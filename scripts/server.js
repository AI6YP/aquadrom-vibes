/**
 * Simple HTTP server for development
 */

'use strict';

import {createServer} from 'http';
import {existsSync, readFileSync, statSync} from 'fs';
import {dirname, extname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = createServer((req, res) => {
  let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);

  // Handle language parameter
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.searchParams.get('lang') === 'en' && url.pathname === '/') {
    filePath = join(distDir, 'index-en.html');
  }

  // Check if file exists
  if (!existsSync(filePath)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
    return;
  }

  // Check if it's a directory
  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  try {
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    const content = readFileSync(filePath);

    res.writeHead(200, {'Content-Type': contentType});
    res.end(content);
  } catch (error) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('500 Internal Server Error');
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
  console.log(`   Russian: http://localhost:${port}/`);
  console.log(`   English: http://localhost:${port}/index-en.html`);
  console.log('\n   Press Ctrl+C to stop\n');
});
