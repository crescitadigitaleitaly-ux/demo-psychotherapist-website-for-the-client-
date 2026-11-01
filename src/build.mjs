// Static page builder for The Relational Practice — Concept.
// Wraps each content file in src/pages/ with the shared head, header and footer,
// and writes complete HTML into site/. No dependencies: `node src/build.mjs`.
//
// Content files start with a metadata comment:
//   <!--meta {"title": "...", "description": "...", "nav": "about"} -->
// Inside content, these shorthands are expanded:
//   {{root}}                          relative path back to the site root ("" or "../")
//   <x-img name="pampas" ratio="3x2" alt="..." sizes="..." eager>  responsive <picture>

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(here, 'pages');
const outDir = join(here, '..', 'site');

const SITE = 'The Relational Practice';
const RATIOS = { '4x5': [4, 5], '3x2': [3, 2] };
// Approved deployment (2026-11-01). Used only for absolute canonical and social-preview URLs;
// every link and asset in the pages stays relative.
const ORIGIN = process.env.SITE_ORIGIN || 'https://therapy.mouzzambuild.com/';
const pageUrl = path => ORIGIN + (path === 'index.html' ? '' : path);

const NAV = [
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'therapy', label: 'Therapy', children: [
    { key: 'individual', label: 'Individual Therapy', href: 'individual-therapy.html' },
    { key: 'couples', label: 'Couples Therapy', href: 'couples-therapy.html' },
    { key: 'eft', label: 'Emotionally Focused Therapy', href: 'emotionally-focused-therapy.html' },
  ] },
  { key: 'resources', label: 'Resources', href: 'resources.html' },
  { key: 'contact', label: 'Contact', href: 'contact.html' },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function picture(attrs, root) {
  const name = attrs.name;
  const [rw, rh] = RATIOS[attrs.ratio || '4x5'];
  const h = w => Math.round(w * rh / rw);
  const src = (w, ext) => `${root}assets/images/${name}-${w}.${ext}`;
  const sizes = attrs.sizes || '(min-width: 768px) 50vw, 100vw';
  const eager = 'eager' in attrs;
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture>
  <source type="image/webp" srcset="${src(640, 'webp')} 640w, ${src(1200, 'webp')} 1200w" sizes="${sizes}">
  <img src="${src(1200, 'jpg')}" srcset="${src(640, 'jpg')} 640w, ${src(1200, 'jpg')} 1200w" sizes="${sizes}" width="1200" height="${h(1200)}" alt="${esc(attrs.alt ?? '')}" ${load} decoding="async">
</picture>`;
}

function expand(html, root) {
  html = html.replace(/<x-img\s+([^>]*?)\s*\/?>/g, (_, raw) => {
    const attrs = {};
    raw.replace(/([a-z-]+)(?:="([^"]*)")?/g, (m, k, v) => { attrs[k] = v ?? ''; });
    return picture(attrs, root);
  });
  return html.replaceAll('{{root}}', root);
}

function navHtml(current, root) {
  const items = NAV.map(item => {
    if (item.children) {
      const isCur = item.children.some(c => c.key === current);
      const subs = item.children.map(c => `<li><a href="${root}${c.href}"${c.key === current ? ' aria-current="page"' : ''}>${c.label}</a></li>`).join('\n          ');
      return `<li class="has-sub">
        <button class="nav__parent${isCur ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="subnav-therapy">${item.label}<svg viewBox="0 0 10 6" aria-hidden="true" focusable="false"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>
        <ul class="subnav" id="subnav-therapy">
          ${subs}
        </ul>
      </li>`;
    }
    return `<li><a class="nav__link" href="${root}${item.href}"${item.key === current ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
  }).join('\n      ');
  return items;
}

function layout(meta, body, root) {
  return `<!doctype html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<!-- Demonstration site: keep out of search results. noindex is not access protection. -->
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#3E4A3A">
${meta.nav === 'none' && meta.path === '404.html' ? '' : `<link rel="canonical" href="${pageUrl(meta.path)}">
<meta property="og:url" content="${pageUrl(meta.path)}">
`}<meta property="og:image" content="${ORIGIN}assets/images/social-preview.jpg">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}assets/images/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}assets/fonts/CormorantGaramond-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/SourceSans3-variable.woff2" as="font" type="font/woff2" crossorigin>
${meta.preload ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${root}assets/images/${meta.preload}-640.webp 640w, ${root}assets/images/${meta.preload}-1200.webp 1200w" imagesizes="(min-width: 768px) 45vw, 90vw">\n` : ''}<link rel="stylesheet" href="${root}assets/css/main.css">
<script src="${root}assets/js/main.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="demo-bar" role="note"><strong>Concept website · Demonstration only.</strong> Names, imagery and content are illustrative. <a href="${root}privacy.html">About this demo</a></div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${root}index.html"${meta.nav === 'home' ? ' aria-current="page"' : ''}>
      <span class="brand__name">${SITE}</span>
      <span class="brand__tag">Concept · Sydney</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__bars" aria-hidden="true"></span><span class="nav-toggle__text">Menu</span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list">
      ${navHtml(meta.nav, root)}
      </ul>
      <div class="nav__cta"><a class="btn" href="${root}contact.html">Enquire about therapy</a></div>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">
${body.trim()}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand__name">${SITE}</span>
        <p>A concept website for an individual and couples psychotherapy practice in Sydney, Australia, with a focus on relationships, attachment and Emotionally Focused Therapy.</p>
      </div>
      <div>
        <h2>Therapy</h2>
        <ul>
          <li><a href="${root}individual-therapy.html">Individual Therapy</a></li>
          <li><a href="${root}couples-therapy.html">Couples Therapy</a></li>
          <li><a href="${root}emotionally-focused-therapy.html">Emotionally Focused Therapy</a></li>
        </ul>
      </div>
      <div>
        <h2>Practice</h2>
        <ul>
          <li><a href="${root}about.html">About</a></li>
          <li><a href="${root}resources.html">Resources</a></li>
          <li><a href="${root}contact.html">Enquire about therapy</a></li>
        </ul>
      </div>
      <div>
        <h2>Information</h2>
        <ul>
          <li><a href="${root}privacy.html">Demo privacy information</a></li>
          <li><a href="${root}contact.html#support">Urgent support</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <p><strong>Concept website · Demonstration only.</strong> “${SITE}” is a temporary fictional identity created to demonstrate design and layout. It is not a real practice, and no therapist, service, availability, fee or qualification is represented. Names, imagery and content are illustrative; clinical content is provisional and requires review by the practising therapist before any production use.</p>
      <p>Photography from Unsplash, used under the Unsplash Licence. Rooms shown are not the practice’s premises. If you need urgent help in Australia, call 000 or Lifeline on 13 11 14.</p>
      <p>Design concept by Crescita Digitale Italia.</p>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p)); else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = await walk(pagesDir);
for (const file of files) {
  const rel = relative(pagesDir, file).split(sep).join('/');
  const src = await readFile(file, 'utf8');
  const m = src.match(/^<!--meta\s+([\s\S]*?)-->/);
  if (!m) throw new Error('Missing meta in ' + rel);
  const meta = { ...JSON.parse(m[1]), path: rel };
  const depth = rel.split('/').length - 1;
  const root = '../'.repeat(depth);
  const html = layout(meta, expand(src.slice(m[0].length), root), root);
  const out = join(outDir, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log('built', rel);
}
