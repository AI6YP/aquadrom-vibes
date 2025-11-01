# AquaDrom Gallery

Modern watercolor art gallery built with pure JavaScript and ONML.

## Features

✨ **Modern Gallery**

- Responsive grid layout
- Lightbox image viewer with keyboard navigation
- Lazy loading for performance
- Filter by category and year
- Image overlays with artwork info

📝 **Blog**

- Blog posts with images
- Bilingual content (Russian/English)

🌍 **Bilingual**

- Full Russian and English support
- Language switcher

🎨 **Clean Code**

- Built with ONML (Object Notation for Markup Language)
- Minimal dependencies
- Pure JavaScript (no frameworks)
- Static site generation

## Project Structure

```
aquadrom/
├── src/
│   ├── components/      # ONML components
│   │   ├── header.js    # Header & navigation
│   │   ├── gallery.js   # Gallery with all features
│   │   ├── blog.js      # Blog, about, contacts
│   │   └── footer.js    # Footer
│   ├── data/
│   │   └── content.js   # Content data
│   ├── styles/
│   │   └── main.css     # Main stylesheet
│   ├── page.js          # Page builder
│   ├── build.js         # Build script
│   └── server.js        # Dev server
├── public/              # Static assets
│   ├── images/          # Gallery images
│   └── favicon.svg      # Site icon
├── old-content/         # Old blogspot content
│   ├── images/          # Downloaded images
│   └── data/            # Extracted data
├── scripts/
│   └── download-old-site.js  # Content migration
└── dist/                # Build output

```

## Getting Started

### Install

```bash
npm install
```

### Download Old Content

```bash
npm run download
```

Then manually download images from https://aquadrom.blogspot.com/
and place them in `old-content/images/` and `public/images/`

### Build

```bash
npm run build
```

### Image Optimization

The project includes an intelligent image optimization system using Sharp:

```bash
# Optimize all images (only processes new/changed files)
npm run optimize-images

# Force re-optimization of all images
npm run optimize-images:force

# Test optimization without writing files
npm run optimize-images:dry-run

# Optimize specific folders only
npm run optimize-images -- --folders="Contre-jour,Arizona-Snows"
```

**What it does:**

- Generates 7 optimized files per original image:
  - **Thumbnails** (400px): JPEG, WebP, AVIF (3 files)
  - **Medium** (1200px): WebP, AVIF (2 files)
  - **Full-size**: WebP, AVIF (2 files)
- Uses near-lossless quality for art gallery (JPEG 95%, WebP 90%, AVIF 85%)
- Intelligent caching - only processes new or modified images
- Saves 35-50% file size on average
- Original images are NEVER modified

**Output structure:**

```
public/images/
└── Contre-jour/
    ├── original-image.jpg (untouched original)
    └── optimized/
        ├── original-image-thumb.jpg
        ├── original-image-thumb.webp
        ├── original-image-thumb.avif
        ├── original-image-medium.webp
        ├── original-image-medium.avif
        ├── original-image.webp
        └── original-image.avif
```

**Configuration:**
Edit `scripts/image-config.js` to adjust:

- Image sizes and quality settings
- Output formats
- Folders to process
- Compression options

**Cache:**
Optimization cache is stored in `src/data/optimization-cache.json` and tracks:

- File hashes to detect changes
- Generated output files
- Image dimensions and sizes
- Used by build process for responsive image generation

### Development Server

```bash
npm run dev
```

Visit:

- Russian: http://localhost:3000/
- English: http://localhost:3000/?lang=en

## Adding Content

### Adding New Images

1. Place original images in appropriate category folders in `public/images/`
   - Use descriptive, SEO-friendly filenames
   - Supported formats: JPG, JPEG, PNG
   - Keep originals at high resolution (they won't be served directly)

2. Run image optimization:

   ```bash
   npm run optimize-images
   ```

   This will automatically generate all responsive sizes and formats.

3. Update `src/data/gallery-items.js` with image metadata (see below)

### Gallery Items

Edit `src/data/gallery-items.js` and add to `galleryItems`:

```javascript
{
  id: 'unique-id',
  title: { ru: 'Название', en: 'Title' },
  year: 2025,
  size: '40×50 cm',
  category: 'seascape',
  image: '/images/artwork.jpg',
  thumbnail: '/images/thumbs/artwork.jpg',
  sold: false,
  description: { ru: 'Описание', en: 'Description' }
}
```

### Blog Posts

Add to `blogPosts` in `src/data/content.js`:

```javascript
{
  id: 'post-id',
  date: '2025-01-15',
  title: { ru: 'Заголовок', en: 'Title' },
  excerpt: { ru: 'Краткое описание', en: 'Brief description' },
  content: { ru: 'Полный текст', en: 'Full text' },
  category: 'seascape',
  image: '/images/blog/post.jpg'
}
```

## Technologies

- **ONML** - HTML generation via JavaScript objects
- **Pure JavaScript** - No frameworks
- **CSS3** - Modern responsive design
- **Node.js** - Build tools and dev server

## Design

Inspired by clean, elegant art gallery websites with:

- Serif fonts for titles (Playfair Display)
- Sans-serif for body text
- Grid layout with hover effects
- Image overlays
- Smooth transitions

## License

MIT
