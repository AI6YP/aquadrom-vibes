/**
 * Clean script - removes dist directory
 */

'use strict';

import { existsSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

export function cleanDist() {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
    console.log('✓ Cleaned dist/ directory');
  } else {
    console.log('✓ dist/ directory does not exist (already clean)');
  }
}

// Allow running as standalone script
// Check if this module is the main module by comparing file paths
const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1].replace(/\\/g, '/');
if (isMainModule) {
  cleanDist();
}
