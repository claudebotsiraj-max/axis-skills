const http = require('http');
const fs = require('fs');
const path = require('path');

const CDP_HOST = 'localhost';
const CDP_PORT = 18800;
const SLIDES_DIR = '/Users/sms/.openclaw/workspace/liberty/slides';

const slides = [
  'summer-a1','summer-a2','summer-a3','summer-a4','summer-a5','summer-a6',
  'summer-b1','summer-b2','summer-b3','summer-b4','summer-b5',
  'summer-c1','summer-c2','summer-c3','summer-c4'
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function connectWS(url) {
  const WebSocket = require('ws');
  return new Promise((resolve) => {
    const ws = new WebSocket(url, { perMessageDeflate: false });
    ws.on('open', () => resolve(ws));
  });
}

async function sendCommand(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1e9);
  return new Promise((resolve) => {
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.removeListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  // Check if ws module is available
  try { require('ws'); } catch(e) {
    console.log('Installing ws...');
    require('child_process').execSync('npm install ws', { cwd: SLIDES_DIR, stdio: 'inherit' });
  }

  const targets = await httpGet(`http://${CDP_HOST}:${CDP_PORT}/json/list`);
  let target = targets.find(t => t.type === 'page');
  
  if (!target) {
    // Create a new page
    const newTarget = await httpGet(`http://${CDP_HOST}:${CDP_PORT}/json/new?about:blank`);
    target = newTarget;
  }

  const ws = await connectWS(target.webSocketDebuggerUrl);
  
  // Set viewport to 1080x1920
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false
  });

  for (const slide of slides) {
    const fileUrl = `file://${SLIDES_DIR}/${slide}.html`;
    console.log(`Capturing ${slide}...`);
    
    await sendCommand(ws, 'Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 1000)); // wait for render
    
    const screenshot = await sendCommand(ws, 'Page.captureScreenshot', {
      format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 }
    });
    
    fs.writeFileSync(`${SLIDES_DIR}/${slide}.png`, Buffer.from(screenshot.data, 'base64'));
    console.log(`  -> ${slide}.png`);
  }

  ws.close();
  console.log('All slides captured!');
}

main().catch(console.error);
