# Image Optimization Guide

## Overview

The AquaDrom Gallery uses an intelligent image optimization system built with [Sharp](https://sharp.pixelplumbing.com/) to generate responsive images in multiple formats while preserving art gallery quality.

## Features

- ✅ **Intelligent Caching** - Only processes new or modified images
- ✅ **Near-Lossless Quality** - Preserves artwork detail (JPEG 95%, WebP 90%, AVIF 85%)
- ✅ **Balanced Output** - 7 files per image (vs 15+ with full responsive strategy)
- ✅ **Modern Formats** - Generates WebP and AVIF for better compression
- ✅ **Responsive Sizes** - Thumbnails, medium, and full-size variants
- ✅ **Automatic Verification** - Ensures all files are generated correctly
- ✅ **Original Preservation** - Source images are NEVER modified

## Quick Start

### Optimize All Images

```bash
npm run optimize-images
```

This will:

1. Scan all category folders in `public/images/`
2. Skip images that haven't changed (using cache)
3. Generate 7 optimized files per new/modified image
4. Save cache to `src/data/optimization-cache.json`
5. Verify all files were created

### Command Options

```bash
# Force re-optimization (ignore cache)
npm run optimize-images:force

# Dry run (test without writing files)
npm run optimize-images:dry-run

# Optimize specific folders only
npm run optimize-images -- --folders="Contre-jour,Arizona-Snows"

# Verbose output for debugging
npm run optimize-images -- --verbose
```

## Output Strategy

### Balanced Approach (7 files per original)

For each original image, the system generates:

1. **Thumbnails** (400px landscape / 300px portrait)
   - `image-thumb.jpg` - JPEG fallback for old browsers
   - `image-thumb.webp` - WebP for modern browsers
   - `image-thumb.avif` - AVIF for cutting-edge browsers

2. **Medium Size** (1200px)
   - `image-medium.webp` - For lightbox/modal views
   - `image-medium.avif` - Alternative format

3. **Full Size** (original dimensions)
   - `image.webp` - Near-lossless WebP
   - `image.avif` - Near-lossless AVIF

**Total: 7 files per original image**

### Output Structure

```
public/images/
├── Contre-jour/
│   ├── original-image.jpg          # Original (NEVER modified)
│   └── optimized/
│       ├── original-image-thumb.jpg     # 400px JPEG
│       ├── original-image-thumb.webp    # 400px WebP
│       ├── original-image-thumb.avif    # 400px AVIF
│       ├── original-image-medium.webp   # 1200px WebP
│       ├── original-image-medium.avif   # 1200px AVIF
│       ├── original-image.webp          # Full-size WebP
│       └── original-image.avif          # Full-size AVIF
├── Arizona-Snows/
│   └── ... (same structure)
└── ... (other categories)
```

## Quality Settings

Optimized for art gallery with near-lossless quality:

| Size      | Format | Quality | Use Case                            |
| --------- | ------ | ------- | ----------------------------------- |
| Full-size | JPEG   | 95%     | Near-lossless preservation          |
| Full-size | WebP   | 90%     | Near-lossless, better compression   |
| Full-size | AVIF   | 85%     | Visually lossless, best compression |
| Medium    | WebP   | 85%     | Lightbox views                      |
| Medium    | AVIF   | 80%     | Lightbox views                      |
| Thumbnail | JPEG   | 85%     | Gallery grid fallback               |
| Thumbnail | WebP   | 80%     | Gallery grid                        |
| Thumbnail | AVIF   | 75%     | Gallery grid                        |

## Cache Management

### Cache File

Located at: `src/data/optimization-cache.json`

The cache tracks:

- File MD5 hash (to detect changes)
- Modification timestamp
- Generated output files with sizes
- Image dimensions

### How Caching Works

1. On first run, all images are processed
2. Cache stores hash + timestamp for each image
3. On subsequent runs:
   - Checks if file hash/timestamp changed
   - Verifies all output files exist
   - Skips if unchanged and outputs exist
   - Re-processes if anything is different

### Cache Commands

```bash
# Normal run - uses cache
npm run optimize-images

# Force mode - ignores cache, re-processes everything
npm run optimize-images:force

# Manual cache management
# Delete cache file to start fresh:
rm src/data/optimization-cache.json
```

### Stale Entry Cleanup

The script automatically removes cache entries for images that no longer exist.

## Configuration

### Config File

Edit `scripts/image-config.js` to customize:

```javascript
export const config = {
  // Thumbnail sizes
  sizes: {
    thumbnail: {
      landscape: 400, // Change thumbnail width for landscape
      portrait: 300, // Change thumbnail width for portrait
    },
    medium: 1200, // Change medium size
  },

  // Quality per size and format
  quality: {
    fullSize: { jpeg: 95, webp: 90, avif: 85 },
    medium: { webp: 85, avif: 80 },
    thumbnail: { jpeg: 85, webp: 80, avif: 75 },
  },

  // Formats to generate per size
  formats: {
    thumbnail: ['jpeg', 'webp', 'avif'],
    medium: ['webp', 'avif'],
    fullSize: ['webp', 'avif'],
  },

  // Folders to process (empty = all)
  folders: [],

  // Files to skip
  skipPatterns: ['-thumb', '-medium', '-large', 'placeholder'],
};
```

### Advanced Sharp Options

```javascript
// JPEG settings
config.jpeg = {
  mozjpeg: true, // Use MozJPEG encoder
  progressive: true, // Progressive JPEG
};

// WebP settings
config.webp = {
  effort: 6, // 0-6, higher = slower but better
  lossless: false, // Use lossy compression
};

// AVIF settings
config.avif = {
  effort: 6, // 0-9, higher = slower but better
  chromaSubsampling: '4:2:0',
};
```

## Performance

### Optimization Results

Example from AquaDrom gallery:

- **9 original images** (2.31 MB)
- **63 optimized files** generated (7 per original)
- **Average 35-50% size reduction** per image
- **Processing time**: ~15 seconds for first run
- **Subsequent runs**: <1 second (cached)

### File Size Comparison

| Image Type             | Original | Optimized | Savings |
| ---------------------- | -------- | --------- | ------- |
| arizona-flagstaff-snow | 277 KB   | 138 KB    | 50.1%   |
| arizona-winter-snow    | 234 KB   | 129 KB    | 44.9%   |
| pond-nature-study      | 282 KB   | 159 KB    | 43.6%   |

### Browser Format Support

- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: All modern browsers (95%+ support)
- **JPEG**: Universal fallback (100% support)

## Troubleshooting

### Issue: Sharp Installation Fails

**Solution**: Sharp requires node-gyp and native dependencies.

```bash
# Windows
npm install --global windows-build-tools

# macOS
xcode-select --install

# Linux (Ubuntu/Debian)
apt-get install build-essential libvips-dev
```

### Issue: Out of Memory

**Solution**: Process folders individually:

```bash
npm run optimize-images -- --folders="Contre-jour"
npm run optimize-images -- --folders="Arizona-Snows"
```

### Issue: Files Not Being Re-Processed

**Solution**: Use force mode:

```bash
npm run optimize-images:force
```

### Issue: Verification Fails

**Symptoms**: "Missing files" warning after optimization

**Solution**:

1. Check disk space
2. Check file permissions
3. Run with `--verbose` flag to see detailed errors
4. Re-run optimization

```bash
npm run optimize-images -- --verbose --force
```

## Best Practices

### Workflow for New Images

1. **Capture/Scan** artwork at high resolution (2000-3000px)
2. **Save** as JPEG (90-95% quality) in appropriate category folder
3. **Name** descriptively: `sedona-red-rocks-may-spring-watercolor.jpg`
4. **Run** `npm run optimize-images`
5. **Update** `src/data/gallery-items.js` with metadata
6. **Build** site: `npm run build`

### File Naming Conventions

- Use lowercase with hyphens: `red-rocks-sedona.jpg`
- Include keywords: `arizona-winter-snow-landscape.jpg`
- Be descriptive for SEO
- Avoid special characters and spaces

### Folder Organization

```
public/images/
├── Contre-jour/        # Category folders
├── Arizona-Snows/      # Match category names in data
├── Red-Rocks-of-Sedona/
└── ... (other categories)
```

### Original Image Guidelines

- **Format**: JPEG (95% quality) or PNG
- **Size**: 1600-2000px on longest side
- **Color**: sRGB color space
- **Resolution**: 72-150 DPI
- **Backup**: Keep unedited originals elsewhere

### When to Re-Optimize

- ✅ After adding new images
- ✅ After changing quality settings
- ✅ After updating original files
- ❌ Not needed for every build (cache handles it)

## Integration with Build Process

The optimization system can be integrated into your build workflow:

```json
{
  "scripts": {
    "prebuild": "npm run optimize-images",
    "build": "node scripts/build.js && node scripts/generate-seo-files.js"
  }
}
```

This ensures images are always optimized before building.

## Future Enhancements

Potential improvements:

- [ ] Auto-generate `srcset` attributes from cache
- [ ] Generate `<picture>` elements with format fallbacks
- [ ] Parallel processing for faster optimization
- [ ] Web worker for client-side lazy loading
- [ ] CDN integration for optimized delivery
- [ ] Progressive image loading (blur-up effect)

## Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Guide](https://developers.google.com/speed/webp)
- [AVIF Guide](https://avif.io/)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Sharp documentation
3. Check GitHub issues
4. Run with `--verbose` flag for detailed logs
