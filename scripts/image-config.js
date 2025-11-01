/**
 * Image optimization configuration
 * Balanced strategy: 7 files per original image
 */

'use strict';

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

export const config = {
  // Source and output directories
  paths: {
    root: rootDir,
    publicImages: join(rootDir, 'public', 'images'),
    cacheFile: join(rootDir, 'src', 'data', 'optimization-cache.json'),
  },

  // Folders to process (empty array = all folders)
  // Can be overridden via CLI: --folders="Contre-jour,Arizona-Snows"
  folders: [],

  // Size configurations
  sizes: {
    thumbnail: {
      landscape: 400, // width in pixels
      portrait: 300, // width in pixels
    },
    medium: 1200, // width in pixels (for lightbox)
    // full-size uses original dimensions
  },

  // Quality settings per size and format
  // Higher quality for art gallery preservation
  quality: {
    fullSize: {
      jpeg: 95, // near-lossless for art gallery
      webp: 90, // near-lossless
      avif: 85, // visually lossless
    },
    medium: {
      webp: 85,
      avif: 80,
    },
    thumbnail: {
      jpeg: 85,
      webp: 80,
      avif: 75,
    },
  },

  // Output formats per size
  // Balanced strategy: 7 files per original
  formats: {
    thumbnail: ['jpeg', 'webp', 'avif'], // 3 files
    medium: ['webp', 'avif'], // 2 files (no JPEG fallback needed)
    fullSize: ['webp', 'avif'], // 2 files (original serves as JPEG fallback)
  },

  // File patterns to skip
  skipPatterns: [
    '-thumb', // already thumbnails
    '-small', // already resized
    '-medium', // already resized
    '-large', // already resized
    'placeholder', // placeholder images
  ],

  // Image extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'],

  // Output subdirectory name
  optimizedDir: 'optimized',

  // Strip metadata (EXIF, etc.) to reduce file size
  stripMetadata: true,

  // Resize options
  resize: {
    fit: 'inside', // Maintain aspect ratio, fit within dimensions
    withoutEnlargement: true, // Don't upscale images
    kernel: 'lanczos3', // High-quality downscaling
  },

  // JPEG options
  jpeg: {
    mozjpeg: true, // Use MozJPEG for better compression
    progressive: true, // Progressive JPEG for better perceived performance
  },

  // WebP options
  webp: {
    effort: 6, // Compression effort (0-6, higher = slower but better)
    lossless: false, // Use lossy compression
  },

  // AVIF options
  avif: {
    effort: 6, // Compression effort (0-9, higher = slower but better)
    chromaSubsampling: '4:2:0', // Standard subsampling
  },
};

/**
 * Get output filename for optimized image
 * @param {string} originalName - Original filename (e.g., 'image.jpg')
 * @param {string} size - Size variant ('thumbnail', 'medium', 'fullSize')
 * @param {string} format - Output format ('jpeg', 'webp', 'avif')
 * @returns {string} Output filename
 */
export function getOptimizedFilename(originalName, size, format) {
  const ext = `.${format === 'jpeg' ? 'jpg' : format}`;
  const baseName = originalName.replace(/\.[^.]+$/, ''); // Remove extension

  if (size === 'fullSize') {
    return `${baseName}${ext}`;
  }

  // Use 'thumb' instead of 'thumbnail' for brevity
  const sizeLabel = size === 'thumbnail' ? 'thumb' : size;

  return `${baseName}-${sizeLabel}${ext}`;
}

/**
 * Check if file should be skipped
 * @param {string} filename - Filename to check
 * @returns {boolean} True if should skip
 */
export function shouldSkipFile(filename) {
  const lowerName = filename.toLowerCase();

  // Check skip patterns
  if (config.skipPatterns.some((pattern) => lowerName.includes(pattern))) {
    return true;
  }

  // Check if valid extension
  const hasValidExt = config.extensions.some((ext) =>
    filename.endsWith(ext.toLowerCase()),
  );

  return !hasValidExt;
}

/**
 * Determine if image is landscape or portrait
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {'landscape'|'portrait'} Orientation
 */
export function getOrientation(width, height) {
  return width >= height ? 'landscape' : 'portrait';
}

/**
 * Get thumbnail width based on orientation
 * @param {'landscape'|'portrait'} orientation - Image orientation
 * @returns {number} Width in pixels
 */
export function getThumbnailWidth(orientation) {
  return config.sizes.thumbnail[orientation];
}
