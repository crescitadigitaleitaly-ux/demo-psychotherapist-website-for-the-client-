// Crawls the local preview (root and /demos/therapy/ subdirectory) and checks every
// internal link and asset, one <h1> per page, unique titles/descriptions, noindex and demo notice.
const base = process.argv[2] || 'http://localhost:8080/';
const seen = new Map(); const queue = [new URL('index.html', base).href, new URL('404.html', base).href, new URL('service-template.html', base).href];
const problems = []; const titles = {}; const descs = {}; let pages = 0, assets = 0;
while (queue.length) {
  const url = queue.shift(); if (seen.has(url)) continue;
  const r = await fetch(url); seen.set(url, r.status);
  if (!r.ok) { problems.push(`${r.status} ${url}`); continue; }
  if (!url.endsWith('.html')) { assets++; continue; }
  pages++; const html = await r.text();
  const h1 = (html.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) problems.push(`h1=${h1} ${url}`);
  if (!/<meta name="robots" content="noindex, nofollow">/.test(html)) problems.push('no noindex ' + url);
  if (!/Concept website · Demonstration only/.test(html)) problems.push('no demo notice ' + url);
  const t = html.match(/<title>([^<]+)/)[1]; (titles[t] ||= []).push(url);
  const d = html.match(/name="description" content="([^"]+)/)[1]; (descs[d] ||= []).push(url);
  const refs = [...html.matchAll(/(?:href|src)="([^"#]+)/g), ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => [0, s.trim().split(' ')[0]]))].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:)/.test(ref)) continue;
    if (ref.startsWith('/')) problems.push(`root-absolute link ${ref} in ${url}`);
    const abs = new URL(ref, url).href; if (!seen.has(abs) && !queue.includes(abs)) queue.push(abs);
  }
  for (const m of html.matchAll(/<img [^>]*>/g)) { if (!/width="\d+"/.test(m[0]) || !/height="\d+"/.test(m[0]) || !/alt="/.test(m[0])) problems.push('img attrs ' + url); }
}
for (const [k, v] of Object.entries(titles)) if (v.length > 1) problems.push('dup title ' + k);
for (const [k, v] of Object.entries(descs)) if (v.length > 1) problems.push('dup desc ' + k);
console.log(`${base}: ${pages} pages, ${assets} assets checked, ${problems.length} problems`); problems.forEach(p => console.log('  ' + p));
