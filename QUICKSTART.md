# AquaDrom Gallery - Quick Reference

## ✅ What's Built

Your modern art gallery is **ready to use**! Here's what's included:

### 🎨 Features Implemented

1. **Modern Gallery**
   - ✅ Responsive grid layout (auto-adapts to screen size)
   - ✅ Lightbox viewer with keyboard navigation (←, →, ESC)
   - ✅ Lazy loading images for fast performance
   - ✅ Filter by category (Seascape, Landscape, Still Life, etc.)
   - ✅ Filter by year (dropdown selector)
   - ✅ Image hover effects with overlay info
   - ✅ "SOLD" badges for sold artworks

2. **Blog Section**
   - ✅ Post cards with images
   - ✅ Chronological display
   - ✅ Excerpt previews
   - ✅ Category tags

3. **Bilingual Support**
   - ✅ Full Russian/English content
   - ✅ Language switcher (RU/EN)
   - ✅ URL parameter support (?lang=en)

4. **Other Sections**
   - ✅ About page
   - ✅ Contacts page
   - ✅ Smooth navigation
   - ✅ Responsive design (mobile-friendly)

### 🛠️ Technology Stack

- **ONML** - HTML generation via JavaScript objects (pure, no frameworks)
- **Pure JavaScript** - No React, Vue, or frameworks
- **CSS3** - Modern, clean design
- **Node.js** - Static site generator + dev server

## 🚀 Usage

### Development

```bash
npm run dev
```

Opens at http://localhost:3000/

### Build

```bash
npm run build
```

Outputs to `dist/` folder

### Download Old Content

```bash
npm run download
```

Creates structure in `old-content/`

## 📁 Project Structure

```
aquadrom/
├── src/
│   ├── components/       # ONML components
│   │   ├── header.js     # Navigation & header
│   │   ├── gallery.js    # Gallery with lightbox
│   │   ├── blog.js       # Blog, about, contacts
│   │   └── footer.js     # Footer
│   ├── data/
│   │   └── content.js    # All content (EDIT THIS!)
│   ├── styles/
│   │   └── main.css      # Styles
│   ├── page.js           # Page builder (ONML)
│   ├── build.js          # Build script
│   └── server.js         # Dev server
├── public/
│   ├── images/           # PUT YOUR IMAGES HERE
│   │   ├── thumbs/       # Thumbnails (400x300)
│   │   └── README.md     # Image guidelines
│   └── favicon.svg
├── old-content/          # Old Blogspot content
│   ├── images/           # Downloaded images
│   └── data/             # Extracted JSON
├── dist/                 # Build output
│   ├── index.html        # Russian version
│   └── index-en.html     # English version
└── package.json
```

## ✏️ Adding Content

### Add Gallery Item

Edit `src/data/content.js` → `galleryItems`:

```javascript
{
  id: 'unique-id',
  title: { ru: 'Название', en: 'Title' },
  year: 2025,
  size: '40×50 cm',
  category: 'seascape', // or landscape, still-life, urban, technique
  image: '/images/artwork.jpg',
  thumbnail: '/images/thumbs/artwork.jpg',
  sold: false,
  description: { ru: 'Описание', en: 'Description' }
}
```

### Add Blog Post

Edit `src/data/content.js` → `blogPosts`:

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

### Add Category

Edit `src/data/content.js` → `categories`:

```javascript
'new-category': { ru: 'Новая категория', en: 'New Category' }
```

## 🖼️ Images

### Required Structure

```
public/images/
├── sea-001.jpg          # Full size: max 2000px wide
├── still-001.jpg
├── thumbs/
│   ├── sea-001.jpg      # 400x300px
│   └── still-001.jpg
└── blog/
    └── post-image.jpg   # 800-1200px wide
```

### Create Thumbnails

**Option 1: ImageMagick**

```bash
magick input.jpg -resize 400x300^ -gravity center -extent 400x300 thumbs/input.jpg
```

**Option 2: Online Tools**

- https://tinypng.com/
- https://squoosh.app/

## 🎨 Customization

### Change Colors

Edit `src/styles/main.css` → `:root` section:

```css
:root {
  --color-primary: #2c3e50; /* Main color */
  --color-accent: #e74c3c; /* Accent/links */
  /* ... more colors ... */
}
```

### Change Fonts

Edit `src/page.js` → Google Fonts link
Edit `src/styles/main.css` → `--font-serif` and `--font-sans`

### Grid Columns

Edit `src/styles/main.css`:

```css
.gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* Change 300px to adjust column width */
}
```

## 📝 Next Steps

### 1. Migrate Old Content

1. Visit https://aquadrom.blogspot.com/
2. Right-click images → Save as → to `old-content/images/`
3. Update `old-content/data/gallery.json` with filenames
4. Copy images to `public/images/`
5. Create thumbnails
6. Update `src/data/content.js` with real data

### 2. Customize Design

- Update author name in `src/data/content.js` → `siteInfo`
- Change colors in CSS
- Add more categories
- Modify layout

### 3. Deploy

**Option 1: GitHub Pages**

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

**Option 2: Netlify**

- Connect your repo
- Build command: `npm run build`
- Publish directory: `dist`

**Option 3: Any Static Host**

- Just upload `dist/` folder contents

## 🆘 Support

### Server Not Starting?

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart:
npm run serve
```

### Build Errors?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Images Not Loading?

- Check file paths match exactly (case-sensitive)
- Ensure images are in `public/images/`
- Create thumbnails in `public/images/thumbs/`
- Rebuild: `npm run build`

## 🔗 URLs

- **Russian**: http://localhost:3000/
- **English**: http://localhost:3000/?lang=en
- **Built files**: `dist/index.html`, `dist/index-en.html`

---

**Built with ❤️ using [ONML](https://github.com/drom/onml)**
