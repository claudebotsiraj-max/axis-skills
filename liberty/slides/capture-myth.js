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
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
    ws.on('message', raw => {
      const msg = JSON.parse(raw);
      if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
    });
    ws.on('open', async () => {
      await sendAsync('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
      await sendAsync('Page.navigate', { url: `file://${slideFile}` });
      await new Promise(r => setTimeout(r, 1500));
      const result = await sendAsync('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
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
  for (let i = 1; i <= 5; i++) {
    await captureSlide(page.webSocketDebuggerUrl, path.join(dir, `myth${i}.html`), path.join(dir, `myth${i}.png`));
  }
  console.log('All myth slides captured!');
})();
