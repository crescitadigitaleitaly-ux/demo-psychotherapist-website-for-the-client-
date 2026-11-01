// Uploads site/ to Hostinger file storage via TUS (POST then PATCH, override=true).
// Needs env HOST_URL, HOST_AUTH, HOST_REST from the Hostinger "generate upload URL" API.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
const { HOST_URL, HOST_AUTH, HOST_REST } = process.env;
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../site/', import.meta.url));
async function walk(d) { const o = []; for (const e of await readdir(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? o.push(...await walk(p)) : o.push(p); } return o; }
const files = (await walk(root)).map(f => relative(root, f).split(sep).join('/'));
const rank = f => f === '.htaccess' ? 3 : f.endsWith('.html') ? (f === 'index.html' ? 2 : 1) : 0;
files.sort((a, b) => rank(a) - rank(b));
const h = { 'X-Auth': HOST_AUTH, 'X-Auth-Rest': HOST_REST, 'Tus-Resumable': '1.0.0' };
let ok = 0;
for (const f of files) {
  const body = await readFile(join(root, f));
  const url = `${HOST_URL}/${f.split('/').map(encodeURIComponent).join('/')}?override=true`;
  const c = await fetch(url, { method: 'POST', headers: { ...h, 'Upload-Length': String(body.length), 'Upload-Offset': '0' } });
  if (c.status !== 201) { console.log('POST', c.status, f, await c.text()); continue; }
  const p = await fetch(url, { method: 'PATCH', headers: { ...h, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': '0' }, body });
  if (p.status !== 204 || p.headers.get('upload-offset') !== String(body.length)) { console.log('PATCH', p.status, f); continue; }
  ok++;
}
console.log(`uploaded ${ok}/${files.length}`);
