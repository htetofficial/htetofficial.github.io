const { spawn } = require('child_process');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const server = spawn('python3', ['-m', 'http.server', '8093'], { stdio: 'ignore' });
  await sleep(1000);

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    'about:blank'
  ], { stdio: 'ignore' });
  await sleep(2000);

  try {
    const tabsResp = await fetch('http://localhost:9225/json');
    const tabs = await tabsResp.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result);
        pending.delete(data.id);
      }
    };

    function send(method, params) {
      return new Promise((resolve) => {
        const id = ++msgId;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');

    const testWidths = [360, 390, 768, 1024, 1152, 1280];
    const fontScales = ['md', 'lg', 'xl'];

    for (const w of testWidths) {
      for (const scale of fontScales) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: w,
          height: 900,
          deviceScaleFactor: 1,
          mobile: (w < 768)
        });

        const navScript = `
          localStorage.setItem('site_font_scale', '${scale}');
          location.href = 'http://localhost:8093/article.html?slug=essential-future-skills-for-youth-in-the-digital-era';
        `;
        await send('Runtime.evaluate', { expression: navScript });
        await sleep(1500);

        const checkScript = `
          (() => {
            const vw = window.innerWidth;
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const overflowing = [];

            document.querySelectorAll('*').forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.right > vw + 1) {
                overflowing.push({
                  tag: el.tagName,
                  id: el.id,
                  className: el.className ? String(el.className).slice(0, 50) : '',
                  right: Math.round(rect.right),
                  vw: vw,
                  diff: Math.round(rect.right - vw)
                });
              }
            });

            const stickyHeader = document.querySelector('header.sticky');
            const stickyInner = stickyHeader ? stickyHeader.querySelector('div') : null;
            const articleHeader = document.querySelector('article header');

            return {
              vw,
              docWidth,
              bodyWidth,
              hasDocOverflow: docWidth > vw,
              overflowCount: overflowing.length,
              topOverflows: overflowing.slice(0, 10),
              stickyHeader: stickyHeader ? {
                scrollWidth: stickyHeader.scrollWidth,
                clientWidth: stickyHeader.clientWidth,
                innerScrollWidth: stickyInner ? stickyInner.scrollWidth : null,
                innerClientWidth: stickyInner ? stickyInner.clientWidth : null,
                innerRect: stickyInner ? stickyInner.getBoundingClientRect() : null,
                navCapsule: stickyHeader.querySelector('nav') ? {
                  display: window.getComputedStyle(stickyHeader.querySelector('nav')).display,
                  scrollWidth: stickyHeader.querySelector('nav').scrollWidth,
                  clientWidth: stickyHeader.querySelector('nav').clientWidth,
                  rect: stickyHeader.querySelector('nav').getBoundingClientRect()
                } : null,
                utilsCapsule: stickyHeader.querySelector('header > div > div:last-child') ? {
                  scrollWidth: stickyHeader.querySelector('header > div > div:last-child').scrollWidth,
                  clientWidth: stickyHeader.querySelector('header > div > div:last-child').clientWidth,
                  rect: stickyHeader.querySelector('header > div > div:last-child').getBoundingClientRect()
                } : null
              } : null,
              articleHeader: articleHeader ? {
                scrollWidth: articleHeader.scrollWidth,
                clientWidth: articleHeader.clientWidth,
                rect: articleHeader.getBoundingClientRect(),
                firstRow: articleHeader.querySelector('div') ? {
                  scrollWidth: articleHeader.querySelector('div').scrollWidth,
                  clientWidth: articleHeader.querySelector('div').clientWidth,
                  rightCol: articleHeader.querySelector('div > div:last-child') ? {
                    scrollWidth: articleHeader.querySelector('div > div:last-child').scrollWidth,
                    clientWidth: articleHeader.querySelector('div > div:last-child').clientWidth,
                    rect: articleHeader.querySelector('div > div:last-child').getBoundingClientRect()
                  } : null
                } : null
              } : null
            };
          })()
        `;

        const evalRes = await send('Runtime.evaluate', { expression: checkScript, returnByValue: true });
        const val = evalRes && evalRes.result ? evalRes.result.value : {};
        console.log(`\n================== Width: ${w}px | Scale: ${scale} ==================`);
        console.log(`vw: ${val.vw}, docWidth: ${val.docWidth}, bodyWidth: ${val.bodyWidth}`);
        if (val.stickyHeader) {
          console.log(`Sticky Header: client=${val.stickyHeader.clientWidth}, scroll=${val.stickyHeader.scrollWidth}, innerClient=${val.stickyHeader.innerClientWidth}, innerScroll=${val.stickyHeader.innerScrollWidth}`);
          if (val.stickyHeader.navCapsule) {
            console.log(`   Nav: display=${val.stickyHeader.navCapsule.display}, width=${val.stickyHeader.navCapsule.rect.width}, right=${val.stickyHeader.navCapsule.rect.right}`);
          }
          if (val.stickyHeader.utilsCapsule) {
            console.log(`   Utils: width=${val.stickyHeader.utilsCapsule.rect.width}, right=${val.stickyHeader.utilsCapsule.rect.right}`);
          }
        }
        if (val.articleHeader) {
          console.log(`Article Header: client=${val.articleHeader.clientWidth}, scroll=${val.articleHeader.scrollWidth}`);
          if (val.articleHeader.firstRow && val.articleHeader.firstRow.rightCol) {
            console.log(`   Article Header Right Group: width=${val.articleHeader.firstRow.rightCol.rect.width}, right=${val.articleHeader.firstRow.rightCol.rect.right}`);
          }
        }
        if (val.topOverflows && val.topOverflows.length > 0) {
          console.log(`Top Overflows (${val.overflowCount}):`);
          val.topOverflows.forEach(o => {
            console.log(`   ${o.tag}#${o.id} diff=+${o.diff}px right=${o.right} class='${o.className}'`);
          });
        }
      }
    }

  } finally {
    chrome.kill();
    server.kill();
  }
}

run().catch(console.error);
