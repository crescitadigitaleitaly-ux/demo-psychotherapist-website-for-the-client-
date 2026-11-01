// Full-page screenshots via headless Chrome DevTools protocol (no dependencies).
// Usage: node tools/shots.mjs "<chrome path>"
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os'; import { join } from 'node:path';
const chrome = process.argv[2]; const base = 'http://localhost:8080/demos/therapy/';
const pages = ['index', 'couples-therapy', 'emotionally-focused-therapy', 'contact'];
const sizes = { desktop: [1440, 900, false], mobile: [390, 844, true] };
const prof = await mkdtemp(join(tmpdir(), 'shots-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9333', '--hide-scrollbars', `--user-data-dir=${prof}`, 'about:blank']);
await new Promise(r => setTimeout(r, 2500));
const t = (await (await fetch('http://127.0.0.1:9333/json')).json()).find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
const errors = [];
await send('Runtime.enable'); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown' || (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')) errors.push(JSON.stringify(m.params).slice(0, 200)); });
for (const [label, [w, h, mobile]] of Object.entries(sizes)) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
  for (const p of pages) {
    await send('Page.navigate', { url: base + p + '.html' }); await new Promise(r => setTimeout(r, 1800));
    // load lazy images by scrolling through
    await send('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0)})()`, awaitPromise: true });
    await new Promise(r => setTimeout(r, 1200));
    const { result } = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true }).then(m => m.result);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: result.value, scale: 1 } });
    await writeFile(`docs/screenshots/${p}-${label}.jpg`, Buffer.from(shot.result.data, 'base64')); console.log('shot', p, label, result.value);
  }
}
// Reduced-motion check: with the preference emulated, hero animations must finish instantly.
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: base + 'index.html' }); await new Promise(r => setTimeout(r, 1500));
const rm = await send('Runtime.evaluate', { expression: `JSON.stringify([...document.querySelectorAll('.hero__copy > *, .hero__media img')].map(e => { const s = getComputedStyle(e); return s.animationName + ' ' + s.animationDuration; }))`, returnByValue: true });
console.log('reduced motion:', rm.result.result.value);
console.log('console errors:', errors.length ? errors : 'none');
ws.close(); proc.kill();
