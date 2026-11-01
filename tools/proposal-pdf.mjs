// Saves a preview image of each A4 page of proposal/proposal.html and reports content overflow.
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const [chrome, out] = process.argv.slice(2);
const prof = await mkdtemp(join(tmpdir(), 'pdf-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9337', '--allow-file-access-from-files', `--user-data-dir=${prof}`, 'about:blank']);
await new Promise(r => setTimeout(r, 5000));
const t = (await (await fetch('http://127.0.0.1:9337/json')).json()).find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable');
await send('Page.navigate', { url: pathToFileURL(join(process.cwd(), 'proposal', 'proposal.html')).href });
await new Promise(r => setTimeout(r, 3000)); await ev('document.fonts.ready.then(()=>true)');
// PDF is printed separately with Edge's --print-to-pdf (see README); this script makes previews.
// previews
await mkdir('proposal/preview', { recursive: true });
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1.4, mobile: false });
const n = await ev('document.querySelectorAll(".page").length');
const overflow = await ev(`[...document.querySelectorAll('.page')].map((p,i)=>{const b=p.getBoundingClientRect().bottom-30;const over=[...p.querySelectorAll('*')].filter(e=>!e.closest('.foot')&&e.getBoundingClientRect().bottom>b&&e.getBoundingClientRect().height>0).map(e=>e.tagName+'.'+e.className).slice(0,3);return (i+1)+':'+(over.join(',')||'ok')}).join(' ')`);
console.log('pages', n, '| overflow check', overflow);
for (let i = 0; i < n; i++) {
  await ev(`document.querySelectorAll('.page')[${i}].scrollIntoView()`); await new Promise(r => setTimeout(r, 300));
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
  await writeFile(`proposal/preview/page-${i + 1}.jpg`, Buffer.from(s.result.data, 'base64'));
}
ws.close(); proc.kill();
