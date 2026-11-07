/* smoke test: every route loads in both languages and themes without page errors; header shots */
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const routes = ['#/crack-injection', '#/concrete-restoration', '#/mineral-waterproofing', '#/retrospective-concrete-waterproofing', '#/concrete-technology/crystalline-concrete-admixture', '#/protective-flooring-coating-systems'];
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); p.setDefaultTimeout(300000); await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|GL Driver|WebGL|net::ERR|404/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
  for (const r of routes) {
    await p.goto('http://127.0.0.1:8765/dist/test.html' + r, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    for (const lang of ['en', 'zh', 'de']) { await p.click('button[data-lang="' + lang + '"]'); await p.waitForTimeout(600); const t = await p.evaluate(() => document.querySelector('.util__dist').textContent.replace(/\s+/g, ' ').trim()); console.log(r, lang, '|', t);
      if (r === routes[0]) { await p.screenshot({ path: 'shots/header_' + lang + '.png', clip: { x: 0, y: 0, width: 1280, height: 130 } }); } }
    await p.click('#themeBtn'); await p.waitForTimeout(800); if (r === routes[2]) await p.screenshot({ path: 'shots/header_night.png', clip: { x: 0, y: 0, width: 1280, height: 130 } }); await p.click('#themeBtn'); await p.waitForTimeout(300);
  }
  await p.setViewportSize({ width: 390, height: 800 }); await p.goto('http://127.0.0.1:8765/dist/test.html' + routes[0], { waitUntil: 'load' }); await p.waitForTimeout(2000); await p.click('button[data-lang="zh"]'); await p.waitForTimeout(500); await p.screenshot({ path: 'shots/header_mobile.png', clip: { x: 0, y: 0, width: 390, height: 160 } });
  console.log(errs.slice(0, 10).join('\n') || 'NO ERRORS'); await b.close();
})();
