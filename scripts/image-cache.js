/**
 * Cache management for image optimization
 * Tracks which images have been processed to avoid redundant work
 */

'use strict';

import {existsSync, readFileSync, statSync, writeFileSync} from 'fs';
import {createHash} from 'crypto';

/**
 * Load cache from file
 * @param {string} cacheFile - Path to cache file
 * @returns {Object} Cache object
 */
export function loadCache(cacheFile) {
  if (!existsSync(cacheFile)) {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      images: {},
    };
  }

  try {
    const content = readFileSync(cacheFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Failed to load cache: ${error.message}`);
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      images: {},
    };
  }
}

/**
 * Save cache to file
 * @param {string} cacheFile - Path to cache file
 * @param {Object} cache - Cache object
 */
export function saveCache(cacheFile, cache) {
  try {
    cache.lastUpdated = new Date().toISOString();
    const content = JSON.stringify(cache, null, 2);
    writeFileSync(cacheFile, content, 'utf-8');
  } catch (error) {
    console.error(`❌ Failed to save cache: ${error.message}`);
  }
}

/**
 * Calculate MD5 hash of file
 * @param {string} filePath - Path to file
 * @returns {string} MD5 hash
 */
export function calculateFileHash(filePath) {
  try {
    const content = readFileSync(filePath);
    return createHash('md5').update(content).digest('hex');
  } catch (error) {
    console.error(`❌ Failed to hash file ${filePath}: ${error.message}`);
    return '';
  }
}

/**
 * Get file modification time
 * @param {string} filePath - Path to file
 * @returns {number} Modification time in milliseconds
 */
export function getFileModTime(filePath) {
  try {
    const stats = statSync(filePath);
    return stats.mtimeMs;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if image needs optimization
 * @param {string} filePath - Path to original image
 * @param {Object} cache - Cache object
 * @param {boolean} force - Force re-optimization
 * @returns {boolean} True if needs optimization
 */
export function needsOptimization(filePath, cache, force = false) {
  if (force) {
    return true;
  }

  const cached = cache.images[filePath];

  if (!cached) {
    return true; // Not in cache
  }

  // Check if file has been modified
  const currentHash = calculateFileHash(filePath);
  const currentModTime = getFileModTime(filePath);

  if (cached.hash !== currentHash || cached.modTime !== currentModTime) {
    return true; // File changed
  }

  // Check if all expected output files exist
  if (cached.outputs) {
    for (const output of cached.outputs) {
      if (!existsSync(output.path)) {
        return true; // Output file missing
      }
    }
  }

  return false; // Up to date
}

/**
 * Update cache entry for image
 * @param {Object} cache - Cache object
 * @param {string} originalPath - Path to original image
 * @param {Array<Object>} outputs - Array of output file info {path, size, format, variant}
 */
export function updateCacheEntry(cache, originalPath, outputs) {
  const hash = calculateFileHash(originalPath);
  const modTime = getFileModTime(originalPath);

  cache.images[originalPath] = {
    hash,
    modTime,
    processedAt: new Date().toISOString(),
    outputs: outputs.map((output) => ({
      path: output.path,
      size: output.size || 0,
      format: output.format,
      variant: output.variant,
      width: output.width || 0,
      height: output.height || 0,
    })),
  };
}

/**
 * Get cache statistics
 * @param {Object} cache - Cache object
 * @returns {Object} Statistics
 */
export function getCacheStats(cache) {
  const totalImages = Object.keys(cache.images).length;
  let totalOutputs = 0;
  let totalSize = 0;

  for (const entry of Object.values(cache.images)) {
    if (entry.outputs) {
      totalOutputs += entry.outputs.length;
      totalSize += entry.outputs.reduce((sum, out) => sum + (out.size || 0), 0);
    }
  }

  return {
    totalImages,
    totalOutputs,
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
  };
}

/**
 * Remove stale cache entries (files that no longer exist)
 * @param {Object} cache - Cache object
 * @returns {number} Number of removed entries
 */
export function cleanStaleEntries(cache) {
  let removed = 0;

  for (const [filePath, _entry] of Object.entries(cache.images)) {
    if (!existsSync(filePath)) {
      delete cache.images[filePath];
      removed++;
    }
  }

  return removed;
}
