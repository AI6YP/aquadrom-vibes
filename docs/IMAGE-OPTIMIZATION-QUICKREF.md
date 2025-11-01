# Image Optimization - Quick Reference

## Daily Commands

```bash
# Optimize new/changed images
npm run optimize-images

# Force re-optimize everything
npm run optimize-images:force

# Test without writing
npm run optimize-images:dry-run

# Debug mode
npm run optimize-images -- --verbose
```

## What You Get

**Per original image (7 files):**

- 3x Thumbnails (400px): JPEG, WebP, AVIF
- 2x Medium (1200px): WebP, AVIF
- 2x Full-size: WebP, AVIF

**Quality Settings:**

- Full-size: Near-lossless (95% JPEG, 90% WebP, 85% AVIF)
- Medium: High quality (85% WebP, 80% AVIF)
- Thumbnails: Optimized (85% JPEG, 80% WebP, 75% AVIF)

## File Structure

```
Category-Folder/
├── original.jpg       ← Never touched
└── optimized/
    ├── original-thumb.jpg
    ├── original-thumb.webp
    ├── original-thumb.avif
    ├── original-medium.webp
    ├── original-medium.avif
    ├── original.webp
    └── original.avif
```

## Key Features

✅ **Smart Caching** - Only processes new/changed files  
✅ **35-50% smaller** - Significant size reduction  
✅ **Near-lossless** - Art gallery quality preserved  
✅ **Auto-verify** - Checks all files generated  
✅ **Safe** - Originals never modified

## Configuration

Edit: `scripts/image-config.js`

```javascript
// Change thumbnail sizes
sizes: {
  thumbnail: { landscape: 400, portrait: 300 },
  medium: 1200
}

// Adjust quality
quality: {
  fullSize: { jpeg: 95, webp: 90, avif: 85 }
}
```

## Cache Location

`src/data/optimization-cache.json`

Used by build process for responsive images.

## Troubleshooting

**Not re-processing?**

```bash
npm run optimize-images:force
```

**Need to see details?**

```bash
npm run optimize-images -- --verbose
```

**Process specific folders?**

```bash
npm run optimize-images -- --folders="Contre-jour,Sedona"
```

## Full Documentation

See: [docs/IMAGE-OPTIMIZATION.md](IMAGE-OPTIMIZATION.md)
