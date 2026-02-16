const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

async function getTargets() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:18800/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function captureSlide(wsUrl, slideFile, outputFile) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();
    const sendAsync = (method, params = {}) => new Promise(res => {
      const msgId = id++;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      pending.set(msgId, res);
    });
    ws.on('message', raw => {
      const msg = JSON.parse(raw);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result);
        pending.delete(msg.id);
      }
    });
    ws.on('open', async () => {
      await sendAsync('Emulation.setDeviceMetricsOverride', {
        width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false
      });
      await sendAsync('Page.navigate', { url: `file://${slideFile}` });
      await new Promise(r => setTimeout(r, 1500));
      const result = await sendAsync('Page.captureScreenshot', {
        format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 }
      });
      fs.writeFileSync(outputFile, Buffer.from(result.data, 'base64'));
      console.log(`Saved: ${outputFile}`);
      ws.close();
      resolve();
    });
    ws.on('error', reject);
  });
}

(async () => {
  const targets = await getTargets();
  const page = targets.find(t => t.type === 'page');
  if (!page) { console.error('No page found'); process.exit(1); }
  
  const dir = '/Users/sms/.openclaw/workspace/liberty/slides';
  const slides = [
    // Video 1: 5 Signs
    'signs1', 'signs2', 'signs3', 'signs4', 'signs5', 'signs6',
    // Video 2: First 30 Minutes
    'first30-1', 'first30-2', 'first30-3', 'first30-4', 'first30-5', 'first30-6',
    // Video 3: POV Competition
    'pov1', 'pov2', 'pov3', 'pov4', 'pov5', 'pov6'
  ];
  
  for (const name of slides) {
    const slideFile = path.join(dir, `${name}.html`);
    const outFile = path.join(dir, `${name}.png`);
    await captureSlide(page.webSocketDebuggerUrl, slideFile, outFile);
  }
  console.log('All 18 slides captured!');
})();
