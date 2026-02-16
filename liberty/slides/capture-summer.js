const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
async function getTargets() { return new Promise((r,j) => { http.get('http://127.0.0.1:18800/json', res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>r(JSON.parse(d))); }).on('error',j); }); }
async function cap(wsUrl, sf, of) { return new Promise((resolve, reject) => {
  const ws = new WebSocket(wsUrl); let id=1; const p=new Map();
  const s=(m,pr={})=>new Promise(r=>{const i=id++;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:pr}));});
  ws.on('message',raw=>{const m=JSON.parse(raw);if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}});
  ws.on('open',async()=>{await s('Emulation.setDeviceMetricsOverride',{width:1080,height:1920,deviceScaleFactor:1,mobile:false});await s('Page.navigate',{url:`file://${sf}`});await new Promise(r=>setTimeout(r,1500));const r=await s('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:1080,height:1920,scale:1}});fs.writeFileSync(of,Buffer.from(r.data,'base64'));console.log(`Saved: ${of}`);ws.close();resolve();});
  ws.on('error',reject);}); }
(async()=>{const t=await getTargets();const pg=t.find(t=>t.type==='page');if(!pg){console.error('No page');process.exit(1);}
const d='/Users/sms/.openclaw/workspace/liberty/slides';
for(let i=1;i<=6;i++) await cap(pg.webSocketDebuggerUrl,path.join(d,`summer${i}.html`),path.join(d,`summer${i}.png`));
console.log('All summer slides captured!');})();
