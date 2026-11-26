const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const app = require('./server');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.pending = new Map();
  }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result ? res.result.value : undefined;
  }
  async screenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, filename), Buffer.from(data, 'base64'));
    console.log(`✓ Generated screenshot: ${filename}`);
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  const tempProfile = path.join(__dirname, `_temp_chrome_${Date.now()}`);
  fs.mkdirSync(tempProfile, { recursive: true });

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/`;
  const cdpPort = 9225;

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1440,900',
    'about:blank'
  ], { stdio: 'ignore' });

  let client;
  try {
    let targetWsUrl = null;
    for (let i = 0; i < 40; i++) {
      try {
        const list = await new Promise((resolve, reject) => {
          const req = http.get(`http://127.0.0.1:${cdpPort}/json/list`, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
              try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
            });
          });
          req.on('error', reject);
        });
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          targetWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {}
      await sleep(250);
    }
    if (!targetWsUrl) throw new Error('Chrome DevTools failed to start');

    client = new CDPClient(targetWsUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('Generating comprehensive suite of 7 verified Myntra Fashion screenshots...');

    // 1. Desktop Homepage & Hero Banner
    await client.send('Page.navigate', { url: baseUrl });
    await sleep(2500);
    await client.screenshot('01_desktop_home.png');

    // 2. Categories Showcase (Men, Women, Kids, Beauty, Home & Living)
    await client.eval(`document.getElementById('categories-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(800);
    await client.screenshot('02_categories_showcase.png');

    // 3. Product Catalog Grid
    await client.eval(`document.getElementById('products-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(1500);
    await client.screenshot('03_product_catalog_grid.png');

    // 4. Smart Search & Live Autocomplete Suggestions
    await client.eval(`(() => {
      window.scrollTo(0, 0);
      const input = document.getElementById('search-input');
      input.focus();
      input.value = 'roadster';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await sleep(600);
    await client.screenshot('04_smart_search_suggestions.png');
    await client.eval(`document.getElementById('clear-search-btn').click()`);
    await sleep(300);

    // 5. Cart Drawer with Fashion Items, Delivery Progress, & Applied MYNTRA200 Coupon
    await client.eval(`(() => {
      window.Myntra.addToCart(1, 1, false, 'L');
      window.Myntra.addToCart(16, 1, false, 'M');
      window.Myntra.applyCoupon('MYNTRA200');
      window.Myntra.openCart();
    })()`);
    await sleep(800);
    await client.screenshot('05_cart_drawer.png');
    await client.eval(`window.Myntra.closeCart()`);
    await sleep(300);

    // 6. Product Details Modal (Quick View)
    await client.eval(`window.Myntra.openProductModal(1)`);
    await sleep(800);
    await client.screenshot('06_product_quickview.png');
    await client.eval(`window.Myntra.closeProductModal()`);
    await sleep(300);

    // 7. Mobile Responsive View (390x844)
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await client.eval(`window.scrollTo(0, 0)`);
    await sleep(800);
    await client.screenshot('07_mobile_view.png');

    console.log('✓ All 7 Myntra screenshots captured successfully.');
  } finally {
    if (client) client.close();
    chrome.kill();
    server.close();
    await sleep(300);
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch {}
  }
}

main().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
