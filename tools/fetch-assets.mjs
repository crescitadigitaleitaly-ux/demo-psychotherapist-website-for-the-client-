// One-off asset fetcher: downloads self-hosted fonts and pre-sized image variants.
// Run: node tools/fetch-assets.mjs   (writes into site/assets/)
import { writeFile, mkdir } from 'node:fs/promises';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const root = new URL('../site/assets/', import.meta.url);
async function get(url) { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error(r.status + ' ' + url); return Buffer.from(await r.arrayBuffer()); }

// Fonts (latin subset only)
const css = (await get('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@400;600&display=swap')).toString();
const blocks = css.split('/*').filter(b => b.startsWith(' latin */'));
for (const b of blocks) {
  const fam = b.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, '');
  const style = b.match(/font-style: (\w+)/)[1]; const weight = b.match(/font-weight: (\d+)/)[1];
  const url = b.match(/url\(([^)]+)\)/)[1];
  const name = `${fam}${style === 'italic' ? '-italic' : ''}-variable.woff2`; // Google serves one variable file per style
  await writeFile(new URL('fonts/' + name, root), await get(url)); console.log('font', name);
}
for (const [f, u] of [['OFL-CormorantGaramond.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt'], ['OFL-SourceSans3.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt']]) {
  await writeFile(new URL('fonts/' + f, root), await get(u)); console.log('licence', f);
}

// Images: [name, unsplash photo id, aspect w:h]
export const images = [
  ['hero-armchair', '1634148737510-727f137375e0', [4, 5]],
  ['armchair-light', '1763279934323-edb3735f6a6e', [4, 5]],
  ['chair-plant', '1680580216480-562504192aed', [4, 5]],
  ['couple-beach', '1588632258523-26242d0a8c2c', [3, 2]],
  ['olive-branch', '1758641283518-59ade23743ae', [3, 2]],
  ['olive-vase', '1772146518546-315e5f80f706', [4, 5]],
  ['pampas', '1570451488142-71d08e1511e3', [3, 2]],
  ['curtain-light', '1682421938316-4b186e25174c', [3, 2]],
  ['dried-flowers', '1644336806256-f62a2f66c58a', [4, 5]],
  ['coffee-table', '1688728147390-6925695b443f', [3, 2]],
  ['eucalyptus', '1786081676718-586b275c1f57', [3, 2]],
];
for (const [name, id, [aw, ah]] of images) {
  for (const w of [640, 1200]) {
    const h = Math.round(w * ah / aw);
    for (const [fm, q] of [['webp', 70], ['jpg', 74]]) {
      const buf = await get(`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&fm=${fm}&q=${q}`);
      await writeFile(new URL(`images/${name}-${w}.${fm}`, root), buf);
    }
  }
  console.log('img', name);
}
await writeFile(new URL('images/social-preview.jpg', root), await get('https://images.unsplash.com/photo-1634148737510-727f137375e0?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=72'));
console.log('done');
