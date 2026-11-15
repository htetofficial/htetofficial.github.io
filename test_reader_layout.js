const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
  if (filePath === './') filePath = './index.html';
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.woff2': 'font/woff2'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(8096);

async function runTest(width, height, fontScale) {
  return new Promise((resolve) => {
    const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--remote-debugging-port=9226',
      'about:blank'
    ]);

    setTimeout(async () => {
      try {
        const tabsResp = await fetch('http://localhost:9226/json');
        const tabs = await tabsResp.json();
        const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
        await new Promise(r => ws.onopen = r);

        let id = 1;
        const pending = new Map();
        ws.onmessage = (e) => {
          const d = JSON.parse(e.data);
          if (d.id && pending.has(d.id)) {
            pending.get(d.id)(d.result);
            pending.delete(d.id);
          }
        };
        const send = (method, params) => new Promise(res => {
          const mid = ++id;
          pending.set(mid, res);
          ws.send(JSON.stringify({ id: mid, method, params }));
        });

        // Set scale
        await send('Runtime.evaluate', {
          expression: `localStorage.setItem('site_font_scale', '${fontScale}');`
        });

        // Navigate
        await send('Page.navigate', {
          url: 'http://localhost:8096/article.html?slug=essential-future-skills-for-youth-in-the-digital-era'
        });

        // Wait 1.5s for article to load and layout to stabilize
        await new Promise(r => setTimeout(r, 1500));

        // Evaluate layout metrics
        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const vw = window.innerWidth;
            const docW = document.documentElement.scrollWidth;
            const bodyW = document.body.scrollWidth;

            const stickyH = document.querySelector('header.sticky');
            const stickyInner = stickyH ? stickyH.querySelector('div') : null;
            const nav = stickyH ? stickyH.querySelector('nav') : null;
            const utils = stickyH ? stickyH.querySelector('div > div:last-child') : null;
            const brand = stickyH ? stickyH.querySelector('a') : null;

            const artH = document.querySelector('article header');
            const artHRow1 = artH ? artH.querySelector('div') : null;
            const artHRightCol = artHRow1 ? artHRow1.querySelector('div:last-child') : null;

            const overflows = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.width > 0 && r.right > vw + 1) {
                overflows.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: el.className ? String(el.className).slice(0, 45) : '',
                  right: Math.round(r.right),
                  diff: Math.round(r.right - vw)
                });
              }
            });

            return {
              vw,
              docW,
              bodyW,
              stickyH: stickyH ? {
                w: stickyH.clientWidth,
                sw: stickyH.scrollWidth,
                right: stickyH.getBoundingClientRect().right,
                innerW: stickyInner ? stickyInner.clientWidth : null,
                innerSW: stickyInner ? stickyInner.scrollWidth : null,
                innerRight: stickyInner ? Math.round(stickyInner.getBoundingClientRect().right) : null,
                brandW: brand ? Math.round(brand.getBoundingClientRect().width) : null,
                navW: nav ? Math.round(nav.getBoundingClientRect().width) : null,
                navDisplay: nav ? window.getComputedStyle(nav).display : null,
                utilsW: utils ? Math.round(utils.getBoundingClientRect().width) : null,
                utilsRight: utils ? Math.round(utils.getBoundingClientRect().right) : null
              } : null,
              artH: artH ? {
                w: artH.clientWidth,
                sw: artH.scrollWidth,
                right: artH.getBoundingClientRect().right,
                row1SW: artHRow1 ? artHRow1.scrollWidth : null,
                row1W: artHRow1 ? artHRow1.clientWidth : null,
                rightColSW: artHRightCol ? artHRightCol.scrollWidth : null,
                rightColW: artHRightCol ? artHRightCol.clientWidth : null,
                rightColRight: artHRightCol ? Math.round(artHRightCol.getBoundingClientRect().right) : null
              } : null,
              overflowCount: overflows.length,
              topOverflows: overflows.slice(0, 8)
            };
          })()`,
          returnByValue: true
        });

        chrome.kill();
        resolve(res.result ? res.result.value : null);
      } catch (err) {
        chrome.kill();
        resolve({ error: err.message });
      }
    }, 1000);
  });
}

async function main() {
  const configs = [
    { w: 375, h: 812, s: 'md' },
    { w: 375, h: 812, s: 'lg' },
    { w: 375, h: 812, s: 'xl' },
    { w: 414, h: 896, s: 'md' },
    { w: 414, h: 896, s: 'xl' },
    { w: 768, h: 1024, s: 'md' },
    { w: 768, h: 1024, s: 'xl' },
    { w: 1024, h: 768, s: 'md' },
    { w: 1024, h: 768, s: 'lg' },
    { w: 1024, h: 768, s: 'xl' },
    { w: 1152, h: 800, s: 'md' },
    { w: 1152, h: 800, s: 'xl' },
    { w: 1280, h: 800, s: 'md' },
    { w: 1280, h: 800, s: 'xl' }
  ];

  for (const c of configs) {
    const r = await runTest(c.w, c.h, c.s);
    console.log(`\n=================== Window ${c.w}x${c.h} | Font Scale: ${c.s} ===================`);
    if (!r) {
      console.log('No result returned');
      continue;
    }
    console.log(`vw: ${r.vw}, docW: ${r.docW}, bodyW: ${r.bodyW}`);
    if (r.stickyH) {
      console.log(`Sticky Header: clientW=${r.stickyH.w}, innerW=${r.stickyH.innerW}, innerSW=${r.stickyH.innerSW}, innerRight=${r.stickyH.innerRight}`);
      console.log(`   brandW=${r.stickyH.brandW}, navDisplay=${r.stickyH.navDisplay}, navW=${r.stickyH.navW}, utilsW=${r.stickyH.utilsW}, utilsRight=${r.stickyH.utilsRight}`);
    }
    if (r.artH) {
      console.log(`Article Header: w=${r.artH.w}, sw=${r.artH.sw}, right=${r.artH.right}`);
      console.log(`   RightCol: w=${r.artH.rightColW}, sw=${r.artH.rightColSW}, right=${r.artH.rightColRight}`);
    }
    if (r.overflowCount > 0) {
      console.log(`*** OVERFLOWS (${r.overflowCount}) ***`);
      r.topOverflows.forEach(o => console.log(`   ${o.tag}#${o.id} diff=+${o.diff}px right=${o.right} cls='${o.cls}'`));
    }
  }

  server.close();
  process.exit(0);
}

main();
