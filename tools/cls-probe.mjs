// Measures layout shifts (and their source elements) on a URL under throttled mobile conditions.
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
const [chrome, url] = process.argv.slice(2);
const prof = await mkdtemp(join(tmpdir(), 'cls-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9336', `--user-data-dir=${prof}`, 'about:blank']);
await new Promise(r => setTimeout(r, 2500));
const t = (await (await fetch('http://127.0.0.1:9336/json')).json()).find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable'); await send('Network.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 412, height: 823, deviceScaleFactor: 1.75, mobile: true });
// warm-up for CDN browser check, then cold load with cache disabled
await send('Page.navigate', { url }); await new Promise(r => setTimeout(r, 9000));
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__ls.push({v:e.value.toFixed(3),t:Math.round(e.startTime),src:e.sources.map(s=>(s.node&&s.node.nodeType===1?(s.node.tagName+'.'+(s.node.className||'')).slice(0,60):String(s.node&&s.node.nodeName))+' '+JSON.stringify([s.previousRect.y,s.currentRect.y,s.previousRect.height,s.currentRect.height].map(Math.round)))})}).observe({type:'layout-shift',buffered:true});` });
await send('Page.navigate', { url }); await new Promise(r => setTimeout(r, 15000));
console.log(JSON.stringify(await ev('({title:document.title, shifts:window.__ls, cls:window.__ls.reduce((a,b)=>a+ +b.v,0).toFixed(3)})'), null, 1));
ws.close(); proc.kill();
