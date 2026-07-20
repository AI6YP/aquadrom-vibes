/**
 * Build script - generates static HTML files
 */

'use strict';

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { build } from '../src/page.js';
import { cleanDist } from './clean.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Create directories
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Copy static files
function copyStatic() {
  const publicDir = join(rootDir, 'public');

  if (existsSync(publicDir)) {
    const copyRecursive = (src, dest) => {
      ensureDir(dest);
      const entries = readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    };

    copyRecursive(publicDir, distDir);
  }
}

// Copy styles
function copyStyles() {
  const srcStylesDir = join(rootDir, 'src', 'styles');
  const distStylesDir = join(distDir, 'styles');

  if (existsSync(srcStylesDir)) {
    const copyRecursive = (src, dest) => {
      ensureDir(dest);
      const entries = readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else if (entry.name.endsWith('.css')) {
          copyFileSync(srcPath, destPath);
        }
      }
    };

    copyRecursive(srcStylesDir, distStylesDir);
    console.log('✓ Copied styles');
  }
}

// Copy client-side scripts
function copyClientScripts() {
  const clientDir = join(rootDir, 'src', 'client');
  if (!existsSync(clientDir)) {
    return;
  }

  const scriptsDir = join(distDir, 'scripts');
  ensureDir(scriptsDir);

  const entries = readdirSync(clientDir, { withFileTypes: true });
  entries.forEach((entry) => {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const srcPath = join(clientDir, entry.name);
      const destPath = join(scriptsDir, entry.name);
      copyFileSync(srcPath, destPath);
    }
  });

  console.log('✓ Copied client scripts');
}

// Generate HTML pages
async function generatePages() {
  const pages = await build();

  Object.entries(pages).forEach(([filename, html]) => {
    const filepath = join(distDir, filename);
    writeFileSync(filepath, html, 'utf-8');
    console.log(`✓ Generated ${filename}`);
  });
}

// Main build
(async () => {
  try {
    console.log('🏗️  Building AquaDrom Gallery...\n');

    cleanDist();
    ensureDir(distDir);
    copyStatic();
    copyStyles();
    copyClientScripts();
    await generatePages();

    console.log('\n✅ Build complete! Output in dist/');
    console.log('   Run "npm run serve" to preview\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
})();
