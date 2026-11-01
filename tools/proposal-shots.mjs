// High-resolution viewport screenshots of the LIVE site for the proposal document.
// Usage: node tools/proposal-shots.mjs "<chrome/edge path>"
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os'; import { join } from 'node:path';
const chrome = process.argv[2]; const base = 'https://therapy.mouzzambuild.com/';
const D = [1440, 900, false], M = [390, 844, true];
const shots = [
  ['home-hero', 'index.html', D, null],
  ['home-pathways', 'index.html', D, '#paths-title'],
  ['home-philosophy', 'index.html', D, '#philosophy-title'],
  ['home-resources', 'index.html', D, '#resources-title'],
  ['couples-cycle', 'couples-therapy.html', D, '#pattern-title'],
  ['eft-hero', 'emotionally-focused-therapy.html', D, null],
  ['eft-stages', 'emotionally-focused-therapy.html', D, '#stages-title'],
  ['faq-open', 'couples-therapy.html', D, '#faq-title', `document.querySelectorAll('.faq details')[2].open=true`],
  ['contact-form', 'contact.html', D, '.form-preview', `document.getElementById('preview-confirmation').click()`],
  ['article', 'resources/understanding-attachment.html', D, '.prose'],
  ['contact-confirm', 'contact.html', D, '#preview-confirmation', `document.getElementById('preview-confirmation').click(); scrollBy(0,-560)`],
  ['about-placeholders', 'about.html', D, '#bio-title'],
  ['m-home', 'index.html', M, null],
  ['m-menu', 'index.html', M, null, `document.querySelector('.nav-toggle').click(); document.querySelector('.nav__parent').click(); document.activeElement.blur()`],
  ['m-couples', 'couples-therapy.html', M, '#pattern-title'],
  ['m-contact', 'contact.html', M, '.form-preview'],
  ['t-home', 'index.html', [768, 1024, true], null],
];
const prof = await mkdtemp(join(tmpdir(), 'pshots-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9334', '--hide-scrollbars', `--user-data-dir=${prof}`, 'about:blank']);
await new Promise(r => setTimeout(r, 2500));
const t = (await (await fetch('http://127.0.0.1:9334/json')).json()).find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = expression => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
await send('Page.enable');
// Warm-up visit so Hostinger's CDN browser check completes before real captures.
await send('Page.navigate', { url: base }); await new Promise(r => setTimeout(r, 9000));
const only = process.argv.slice(3);
for (const [name, path, [w, h, mobile], sel, act] of shots) {
  if (only.length && !only.includes(name)) continue;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile });
  await send('Page.navigate', { url: base + path }); await new Promise(r => setTimeout(r, 2500));
  await ev(`(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0);await document.fonts.ready})()`);
  if (sel) await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});const hh=document.querySelector('.site-header').offsetHeight;scrollTo(0,e.getBoundingClientRect().top+scrollY-hh-${mobile ? 24 : 48})})()`);
  if (act) await ev(act);
  await new Promise(r => setTimeout(r, 1500));
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
  await writeFile(`proposal/shots/${name}.jpg`, Buffer.from(s.result.data, 'base64')); console.log('shot', name);
}
ws.close(); proc.kill();
