/**
 * Generate sitemap.xml and robots.txt
 */

'use strict';

import {writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {blogPosts, galleryItems} from '../src/data/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Generate sitemap.xml
const baseUrl = 'https://aquadrom.art';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
  {url: '/', priority: '1.0', changefreq: 'weekly'},
  {url: '/en', priority: '1.0', changefreq: 'weekly'},
];

// Add gallery items
galleryItems.forEach((item) => {
  pages.push({
    url: `/gallery/${item.id}`,
    priority: '0.8',
    changefreq: 'monthly',
  });
});

// Add blog posts
blogPosts.forEach((post) => {
  pages.push({
    url: `/blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.date,
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : `<lastmod>${currentDate}</lastmod>`}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml);
console.log('✓ Generated sitemap.xml');

// Generate robots.txt
const robotsTxt = `# robots.txt for AquaDrom Gallery
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /*.json$

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional, uncomment if needed)
# Crawl-delay: 10
`;

writeFileSync(join(distDir, 'robots.txt'), robotsTxt);
console.log('✓ Generated robots.txt');

console.log(`\n📊 Sitemap Statistics:`);
console.log(`   Total URLs: ${pages.length}`);
console.log(`   Gallery items: ${galleryItems.length}`);
console.log(`   Blog posts: ${blogPosts.length}`);
console.log(`   Base pages: 2 (ru, en)\n`);
