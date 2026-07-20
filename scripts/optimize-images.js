/**
 * Image optimization script using Sharp
 * Generates responsive images in multiple formats with intelligent caching
 */

'use strict';

import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { basename, dirname, join } from 'path';
import sharp from 'sharp';
import {
  config,
  getOptimizedFilename,
  getOrientation,
  getThumbnailWidth,
  shouldSkipFile,
} from './image-config.js';
import {
  cleanStaleEntries,
  getCacheStats,
  loadCache,
  needsOptimization,
  saveCache,
  updateCacheEntry,
} from './image-cache.js';

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');
const isVerbose = args.includes('--verbose') || args.includes('-v');
const foldersArg = args.find((arg) => arg.startsWith('--folders='));
const targetFolders = foldersArg
  ? foldersArg.split('=')[1].split(',')
  : config.folders;

// Statistics
const stats = {
  totalProcessed: 0,
  totalSkipped: 0,
  totalErrors: 0,
  totalOutputs: 0,
  originalSize: 0,
  optimizedSize: 0,
  startTime: Date.now(),
};

/**
 * Log message based on verbosity
 */
function log(message, level = 'info') {
  if (level === 'error') {
    console.error(message);
  } else if (level === 'warn') {
    console.warn(message);
  } else if (isVerbose || level === 'always') {
    console.log(message);
  }
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!existsSync(dir)) {
    if (!isDryRun) {
      mkdirSync(dir, { recursive: true });
    }
    log(`📁 Created directory: ${dir}`);
  }
}

/**
 * Get image metadata
 */
async function getImageMetadata(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      orientation: getOrientation(metadata.width, metadata.height),
    };
  } catch (error) {
    throw new Error(`Failed to read metadata: ${error.message}`);
  }
}

/**
 * Optimize and convert image to specified format and size
 */
async function processImage(inputPath, outputPath, format, size, metadata) {
  let pipeline = sharp(inputPath);

  // Strip metadata if configured
  if (config.stripMetadata) {
    pipeline = pipeline.withMetadata({
      orientation: undefined,
      exif: {},
      icc: 'srgb', // Keep color profile for consistency
    });
  }

  // Resize if needed
  if (size !== 'fullSize') {
    let targetWidth;

    if (size === 'thumbnail') {
      targetWidth = getThumbnailWidth(metadata.orientation);
    } else if (size === 'medium') {
      targetWidth = config.sizes.medium;
    }

    if (targetWidth) {
      pipeline = pipeline.resize(targetWidth, null, config.resize);
    }
  }

  // Convert to target format
  const quality = config.quality[size]?.[format] || 85;

  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({
      quality,
      ...config.jpeg,
    });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({
      quality,
      ...config.webp,
    });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({
      quality,
      ...config.avif,
    });
  }

  // Write output
  if (!isDryRun) {
    await pipeline.toFile(outputPath);
  }

  // Get output info
  const outputMeta = await pipeline.metadata();

  return {
    width: outputMeta.width,
    height: outputMeta.height,
    size: isDryRun ? 0 : statSync(outputPath).size,
  };
}

/**
 * Process a single image file
 */
async function optimizeImage(imagePath, categoryFolder, cache) {
  const filename = basename(imagePath);

  // Check if should skip
  if (shouldSkipFile(filename)) {
    log(`⏭️  Skipped: ${filename} (matches skip pattern)`);
    stats.totalSkipped++;
    return;
  }

  // Check cache
  if (!needsOptimization(imagePath, cache, isForce)) {
    log(`✓ Cached: ${filename}`);
    stats.totalSkipped++;
    return;
  }

  log(`🎨 Processing: ${filename}`, 'always');

  try {
    // Get metadata
    const metadata = await getImageMetadata(imagePath);
    log(`   ${metadata.width}×${metadata.height} (${metadata.orientation})`);

    const originalSize = statSync(imagePath).size;
    stats.originalSize += originalSize;

    // Setup output directory
    const optimizedDir = join(categoryFolder, config.optimizedDir);
    ensureDir(optimizedDir);

    const outputs = [];

    // Process each size variant
    for (const [sizeKey, formats] of Object.entries(config.formats)) {
      for (const format of formats) {
        const outputFilename = getOptimizedFilename(filename, sizeKey, format);
        const outputPath = join(optimizedDir, outputFilename);

        log(`   → ${sizeKey}/${format}: ${outputFilename}`, 'verbose');

        try {
          const outputInfo = await processImage(
            imagePath,
            outputPath,
            format,
            sizeKey,
            metadata,
          );

          outputs.push({
            path: outputPath,
            size: outputInfo.size,
            format,
            variant: sizeKey,
            width: outputInfo.width,
            height: outputInfo.height,
          });

          stats.totalOutputs++;
          stats.optimizedSize += outputInfo.size;
        } catch (error) {
          log(
            `   ❌ Failed to generate ${sizeKey}/${format}: ${error.message}`,
            'error',
          );
        }
      }
    }

    // Update cache
    if (!isDryRun && outputs.length > 0) {
      updateCacheEntry(cache, imagePath, outputs);
    }

    stats.totalProcessed++;

    // Calculate savings for this image
    const totalOutputSize = outputs.reduce((sum, o) => sum + o.size, 0);
    const savings = originalSize - totalOutputSize / outputs.length;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    log(
      `   ✅ Generated ${outputs.length} files (${savingsPercent}% optimized)`,
      'always',
    );
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    stats.totalErrors++;
  }
}

/**
 * Process all images in a category folder
 */
async function processCategoryFolder(folderPath, folderName, cache) {
  log(`\n📂 Processing folder: ${folderName}`, 'always');

  if (!existsSync(folderPath)) {
    log(`   ⚠️  Folder not found: ${folderPath}`, 'warn');
    return;
  }

  const files = readdirSync(folderPath);
  const imageFiles = files.filter(
    (file) =>
      !shouldSkipFile(file) && statSync(join(folderPath, file)).isFile(),
  );

  log(`   Found ${imageFiles.length} images to process`);

  for (const file of imageFiles) {
    const imagePath = join(folderPath, file);
    await optimizeImage(imagePath, folderPath, cache);
  }
}

/**
 * Discover all category folders
 */
function discoverCategoryFolders() {
  const folders = [];
  const entries = readdirSync(config.paths.publicImages, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      folders.push(entry.name);
    }
  }

  return folders;
}

/**
 * Verify optimization results
 */
function verifyResults(cache) {
  log('\n🔍 Verifying results...', 'always');

  let missingFiles = 0;
  let totalFiles = 0;

  for (const [imagePath, entry] of Object.entries(cache.images)) {
    if (!existsSync(imagePath)) {
      continue; // Original was deleted
    }

    for (const output of entry.outputs || []) {
      totalFiles++;
      if (!existsSync(output.path)) {
        log(`   ⚠️  Missing: ${output.path}`, 'warn');
        missingFiles++;
      }
    }
  }

  if (missingFiles === 0) {
    log(`   ✅ All ${totalFiles} optimized files exist`, 'always');
  } else {
    log(`   ⚠️  ${missingFiles}/${totalFiles} files missing`, 'warn');
  }

  return missingFiles === 0;
}

/**
 * Print final statistics
 */
function printStats() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const originalMB = (stats.originalSize / (1024 * 1024)).toFixed(2);
  const optimizedMB = (stats.optimizedSize / (1024 * 1024)).toFixed(2);
  const savedMB = (
    (stats.originalSize - stats.optimizedSize / stats.totalOutputs) /
    (1024 * 1024)
  ).toFixed(2);
  const savedPercent = stats.originalSize
    ? (
        ((stats.originalSize - stats.optimizedSize / stats.totalOutputs) /
          stats.originalSize) *
        100
      ).toFixed(1)
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(60));
  console.log(`Images processed:    ${stats.totalProcessed}`);
  console.log(`Images skipped:      ${stats.totalSkipped} (cached)`);
  console.log(`Errors:              ${stats.totalErrors}`);
  console.log(`Output files:        ${stats.totalOutputs}`);
  console.log(`Original size:       ${originalMB} MB`);
  console.log(`Optimized per file:  ~${optimizedMB} MB total`);
  console.log(`Space saved:         ~${savedMB} MB (${savedPercent}%)`);
  console.log(`Duration:            ${duration}s`);

  if (isDryRun) {
    console.log('\n💡 This was a dry run. No files were written.');
  }

  console.log('='.repeat(60) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Image Optimization Script');
  console.log('=============================\n');

  if (isDryRun) {
    console.log('💡 DRY RUN MODE - No files will be written\n');
  }

  if (isForce) {
    console.log('⚡ FORCE MODE - Ignoring cache\n');
  }

  // Ensure cache directory exists
  const cacheDir = dirname(config.paths.cacheFile);
  ensureDir(cacheDir);

  // Load cache
  const cache = loadCache(config.paths.cacheFile);
  log(`📋 Loaded cache: ${Object.keys(cache.images).length} entries`);

  // Clean stale entries
  const removedEntries = cleanStaleEntries(cache);
  if (removedEntries > 0) {
    log(`🧹 Removed ${removedEntries} stale cache entries`);
  }

  // Determine folders to process
  let foldersToProcess = targetFolders;
  if (foldersToProcess.length === 0) {
    foldersToProcess = discoverCategoryFolders();
  }

  log(
    `📁 Processing ${foldersToProcess.length} folders: ${foldersToProcess.join(', ')}\n`,
  );

  // Process each folder
  for (const folderName of foldersToProcess) {
    const folderPath = join(config.paths.publicImages, folderName);
    await processCategoryFolder(folderPath, folderName, cache);
  }

  // Save cache
  if (!isDryRun) {
    saveCache(config.paths.cacheFile, cache);
    log('\n💾 Cache saved', 'always');

    const cacheStats = getCacheStats(cache);
    log(
      `   ${cacheStats.totalImages} images, ${cacheStats.totalOutputs} outputs, ${cacheStats.totalSizeMB} MB`,
    );
  }

  // Verify results
  if (!isDryRun && stats.totalProcessed > 0) {
    verifyResults(cache);
  }

  // Print statistics
  printStats();

  // Exit with appropriate code
  if (stats.totalErrors > 0) {
    console.log('⚠️  Completed with errors\n');
    process.exit(1);
  } else {
    console.log('✅ Optimization complete!\n');
    process.exit(0);
  }
}

// Run
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
