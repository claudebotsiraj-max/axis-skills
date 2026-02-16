import WebSocket from 'ws';
import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

const CDP_PORT = 18800;

async function getTargets() {
  const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  return res.json();
}

function cdp(wsUrl) {
  return new Promise((resolve) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    });
    ws.on('open', () => {
      resolve({
        send(method, params = {}) {
          return new Promise((res) => {
            const myId = id++;
            pending.set(myId, res);
            ws.send(JSON.stringify({ id: myId, method, params }));
          });
        },
        close() { ws.close(); }
      });
    });
  });
}

const slides = [1,2,3,4,5,6];
const dir = '/Users/sms/.openclaw/workspace/liberty/slides';

for (const n of slides) {
  const url = `file://${dir}/summer-v2-${n}.html`;
  const targets = await getTargets();
  let target = targets.find(t => t.type === 'page');
  
  const client = await cdp(target.webSocketDebuggerUrl);
  
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false
  });
  await client.send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 3000));
  
  const result = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 }
  });
  
  const buf = Buffer.from(result.result.data, 'base64');
  writeFileSync(`${dir}/summer-v2-${n}.png`, buf);
  console.log(`Saved summer-v2-${n}.png (${buf.length} bytes)`);
  
  client.close();
  await new Promise(r => setTimeout(r, 500));
}

process.exit(0);
