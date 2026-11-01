// Minimal static server for local preview. Serves site/ at / and also at /demos/therapy/
// to test subdirectory hosting. Usage: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../site/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.argv[2] || 8080);
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.startsWith('/demos/therapy/')) p = p.slice('/demos/therapy'.length);
  if (p.endsWith('/')) p += 'index.html';
  const file = normalize(join(root, p));
  try {
    if (!file.startsWith(normalize(root)) || !(await stat(file)).isFile()) throw 0;
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(join(root, '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}/  and  http://localhost:${port}/demos/therapy/`));
