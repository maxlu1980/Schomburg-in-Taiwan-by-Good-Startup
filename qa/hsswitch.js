const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1000, height: 640 } })).newPage(); p.setDefaultTimeout(120000); await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 300)));
  await p.goto('http://127.0.0.1:8765/dist/test.html#/mineral-waterproofing', { waitUntil: 'load' }); await p.waitForTimeout(2200);
  for (const c of ['wp', 'rc', 'wp', 'cr']) {
    await p.evaluate(c => HSIM.open(c), c); await p.waitForTimeout(1800);
    const r = await p.evaluate(c => ({ hosts: document.querySelectorAll('#hsim .hsim__view').length, canvases: document.querySelectorAll('#hsim canvas').length, view: !!HSIM.get(c).view, title: document.getElementById('hsTitle').textContent.slice(0, 30) }), c); console.log(c, JSON.stringify(r));
    await p.evaluate(() => document.getElementById('hsExit').click()); await p.waitForTimeout(300);
  }
  // language switch while open
  await p.evaluate(() => HSIM.open('rc')); await p.waitForTimeout(1500); await p.evaluate(() => setLang('zh')); await p.waitForTimeout(400);
  console.log('zh', await p.evaluate(() => document.getElementById('hsTitle').textContent.slice(0, 20) + ' | ' + document.getElementById('hsExit').textContent + ' | ' + document.querySelector('#hsTools .sim__tool span').textContent));
  await p.evaluate(() => document.getElementById('hsStart').click()); await p.waitForTimeout(500); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  console.log('esc closed', await p.evaluate(() => document.getElementById('hsim').hidden));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close();
})();
