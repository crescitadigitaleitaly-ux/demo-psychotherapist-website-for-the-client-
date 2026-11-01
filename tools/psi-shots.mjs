// Runs PageSpeed Insights (pagespeed.web.dev) for mobile and desktop in headless Chromium,
// saves a screenshot of each report's score section and prints the scores and metrics.
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os'; import { join } from 'node:path';
const chrome = process.argv[2];
const prof = await mkdtemp(join(tmpdir(), 'psi-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9335', `--user-data-dir=${prof}`, 'about:blank']);
await new Promise(r => setTimeout(r, 5000));
const t = (await (await fetch('http://127.0.0.1:9335/json')).json()).find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1100, deviceScaleFactor: 2, mobile: false });
// Pass existing report URLs (from pagespeed.web.dev) as: name=url ...
for (const arg of process.argv.slice(3)) {
  const [ff, reportUrl] = arg.split('=');
  await send('Page.navigate', { url: reportUrl });
  let ok = false;
  for (let k = 0; k < 25 && !ok; k++) { await new Promise(r => setTimeout(r, 3000)); ok = await ev(`document.body.innerText.includes('Captured at')`); }
  if (!ok) { console.log(ff, 'timed out:', (await ev('document.body.innerText')).replace(/\n+/g,' | ').slice(0,700)); const s0 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 }); await writeFile('proposal/psi-debug-'+ff+'.jpg', Buffer.from(s0.result.data, 'base64')); continue; }
  await new Promise(r => setTimeout(r, 2000));
  if (ff === 'desktop') { await ev(`[...document.querySelectorAll('[role=tab]')].find(e=>/Desktop/.test(e.textContent)).click()`); await new Promise(r => setTimeout(r, 2500)); }
  const info = await ev(`(()=>{document.querySelectorAll('[class*="cookie"]').forEach(e=>e.remove());
    const p=document;const t=document.body.innerText;const i=t.indexOf('Diagnose performance issues');
    const anchor=[...p.querySelectorAll('*')].filter(e=>e.childElementCount===0&&e.textContent.trim()==='Diagnose performance issues').find(e=>e.getClientRects().length);
    anchor.scrollIntoView();scrollBy(0,-150);[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&/uses cookies/.test(e.textContent)).forEach(e=>e.style.display='none');return t.slice(i,i+900)})()`);
  console.log('==', ff, '\n' + info.replace(/\n+/g, ' | ').slice(0, 900));
  await new Promise(r => setTimeout(r, 1200));
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
  await writeFile(`proposal/shots/psi-${ff}.jpg`, Buffer.from(s.result.data, 'base64'));
}
ws.close(); proc.kill();
