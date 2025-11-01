/**
 * Responsive image utilities
 * Uses optimization cache to generate modern image markup
 */

'use strict';

import {existsSync, readFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..'); // Go up from src/utils to project root
const cacheFile = join(rootDir, 'src', 'data', 'optimization-cache.json');

let cache = null;

/**
 * Load optimization cache
 */
function loadCache() {
  if (cache) return cache;

  try {
    if (existsSync(cacheFile)) {
      const content = readFileSync(cacheFile, 'utf-8');
      cache = JSON.parse(content);
      return cache;
    }
  } catch (error) {
    console.warn('Failed to load optimization cache:', error.message);
  }

  return {images: {}};
}

/**
 * Convert absolute path to web path
 * @param {string} absolutePath - Absolute filesystem path
 * @returns {string} Web path starting with /images/
 */
function toWebPath(absolutePath) {
  // Convert Windows backslashes to forward slashes
  const normalized = absolutePath.replace(/\\/g, '/');

  // Extract path after /public/
  const match = normalized.match(/\/public\/(.+)$/);
  if (match) {
    return '/' + match[1];
  }

  // Fallback: extract from images/ onwards
  const imagesMatch = normalized.match(/images\/(.+)$/);
  if (imagesMatch) {
    return '/images/' + imagesMatch[1];
  }

  return absolutePath;
}

/**
 * Get optimized image paths for an original image
 * @param {string} originalImagePath - Web path to original or thumbnail image
 * @returns {Object|null} Optimized paths or null if not found
 */
export function getOptimizedPaths(originalImagePath) {
  const optimizationCache = loadCache();

  if (!optimizationCache.images) {
    return null;
  }

  // Normalize the input path - remove -thumb suffix if present
  let searchPath = originalImagePath;
  searchPath = searchPath.replace(
    /-thumb\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i,
    '.$1',
  );

  // Extract just the filename for matching
  const filename = searchPath.split('/').pop().toLowerCase();

  // Find entry in cache by matching filename
  for (const [cacheKey, entry] of Object.entries(optimizationCache.images)) {
    const cacheFilename = cacheKey.split(/[/\\]/).pop().toLowerCase();

    if (cacheFilename === filename) {
      // Organize outputs by variant and format
      const organized = {
        thumbnail: {jpeg: null, webp: null, avif: null},
        medium: {webp: null, avif: null},
        fullSize: {webp: null, avif: null},
      };

      for (const output of entry.outputs || []) {
        const variant = output.variant;
        const format = output.format;
        organized[variant][format] = toWebPath(output.path);
      }

      return organized;
    }
  }

  return null;
}

/**
 * Generate picture element for responsive images with modern formats
 * @param {string} originalImagePath - Web path to original image
 * @param {string} alt - Alt text
 * @param {string} className - CSS class name
 * @param {Object} options - Additional options
 * @returns {Array} ONML picture element
 */
export function createPictureElement(
  originalImagePath,
  alt,
  className = '',
  options = {},
) {
  const optimized = getOptimizedPaths(originalImagePath);
  const loading = options.loading || 'lazy';
  const sizes = options.sizes || '(max-width: 768px) 100vw, 400px';

  if (!optimized) {
    // Fallback to original image
    return [
      'img',
      {
        src: originalImagePath,
        alt,
        class: className,
        loading,
      },
    ];
  }

  const sources = [];

  // AVIF source (best compression)
  if (optimized.thumbnail.avif) {
    sources.push([
      'source',
      {
        srcset: optimized.thumbnail.avif,
        type: 'image/avif',
        sizes,
      },
    ]);
  }

  // WebP source (good compression, wide support)
  if (optimized.thumbnail.webp) {
    sources.push([
      'source',
      {
        srcset: optimized.thumbnail.webp,
        type: 'image/webp',
        sizes,
      },
    ]);
  }

  // JPEG fallback (universal support)
  const fallbackSrc = optimized.thumbnail.jpeg || originalImagePath;

  return [
    'picture',
    {},
    ...sources,
    [
      'img',
      {
        src: fallbackSrc,
        alt,
        class: className,
        loading,
      },
    ],
  ];
}

/**
 * Generate srcset for responsive images
 * @param {string} originalImagePath - Web path to original image
 * @returns {string} srcset string
 */
export function generateSrcset(originalImagePath) {
  const optimized = getOptimizedPaths(originalImagePath);

  if (!optimized) {
    return originalImagePath;
  }

  const srcsetParts = [];

  if (optimized.thumbnail.webp) {
    srcsetParts.push(`${optimized.thumbnail.webp} 400w`);
  }

  if (optimized.medium.webp) {
    srcsetParts.push(`${optimized.medium.webp} 1200w`);
  }

  if (optimized.fullSize.webp) {
    srcsetParts.push(`${optimized.fullSize.webp} 1600w`);
  }

  return srcsetParts.length > 0 ? srcsetParts.join(', ') : originalImagePath;
}

/**
 * Get best available image for lightbox
 * @param {string} originalImagePath - Web path to original image
 * @param {string} preferredFormat - Preferred format ('webp', 'avif', 'jpeg')
 * @returns {string} Path to best available image
 */
export function getLightboxImage(originalImagePath, preferredFormat = 'webp') {
  const optimized = getOptimizedPaths(originalImagePath);

  if (!optimized) {
    return originalImagePath;
  }

  // Try medium size first (best for lightbox)
  if (optimized.medium[preferredFormat]) {
    return optimized.medium[preferredFormat];
  }

  // Fallback to full-size
  if (optimized.fullSize[preferredFormat]) {
    return optimized.fullSize[preferredFormat];
  }

  // Last resort: original
  return originalImagePath;
}

/**
 * Check if image has been optimized
 * @param {string} originalImagePath - Web path to original image
 * @returns {boolean} True if optimized versions exist
 */
export function isOptimized(originalImagePath) {
  return getOptimizedPaths(originalImagePath) !== null;
}
