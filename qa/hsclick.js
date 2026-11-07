/* real clicks on the gates (desktop mouse, phone tap) and a WebGL-context census across all routes */
const { chromium } = require('playwright');
const R = { inj: '#/crack-injection', cr: '#/concrete-restoration', wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', ca: '#/concrete-technology/crystalline-concrete-admixture', pf: '#/protective-flooring-coating-systems' };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [vw, vh, touch] of [[1280, 800, false], [390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, isMobile: touch, hasTouch: touch }); const p = await ctx.newPage(); p.setDefaultTimeout(120000);
    await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; window.__ctx = []; const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { const c = g.call(this, t, o); if (/webgl/.test(t) && c && !this.__counted) { this.__counted = true; window.__ctx.push(this.id || this.className || this.parentNode && this.parentNode.id || '?'); } return c; }; });
    const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 300)));
    await p.goto('http://127.0.0.1:8765/dist/test.html' + R.inj, { waitUntil: 'load' }); await p.waitForTimeout(2000);
    for (const c of Object.keys(R)) {
      await p.evaluate(h => { location.hash = h; }, R[c]); await p.waitForTimeout(2200);
      const btnId = c === 'inj' ? 'simOpen' : c + 'SimOpen'; const btn = p.locator('#' + btnId);
      await btn.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
      if (touch) await btn.tap(); else await btn.click();
      await p.waitForTimeout(2500);
      const st = await p.evaluate((c) => { const ov = document.getElementById(c === 'inj' ? 'sim' : 'hsim'); const card = document.getElementById(c === 'inj' ? 'simCard' : 'hsCard'); return { open: ov && !ov.hidden, card: card && !card.hidden, title: card && (card.querySelector('h2') || {}).textContent, ctx: window.__ctx.length, bodyOverflow: document.body.style.overflow }; }, c);
      // begin, then exit
      const startId = c === 'inj' ? 'simStart' : 'hsStart'; if (st.card) { if (touch) await p.locator('#' + startId).tap(); else await p.locator('#' + startId).click(); await p.waitForTimeout(600); }
      const phase = await p.evaluate((c) => document.getElementById(c === 'inj' ? 'simPhase' : 'hsPhase').textContent, c);
      const exitId = c === 'inj' ? 'simExit' : 'hsExit'; if (touch) await p.locator('#' + exitId).tap(); else await p.locator('#' + exitId).click(); await p.waitForTimeout(300);
      const closed = await p.evaluate((c) => document.getElementById(c === 'inj' ? 'sim' : 'hsim').hidden && document.body.style.overflow === '', c);
      console.log(vw, c, JSON.stringify(st), '| phase:', String(phase).slice(0, 40), '| closed', closed);
    }
    console.log(vw, 'contexts', await p.evaluate(() => window.__ctx.length + ' ' + JSON.stringify(window.__ctx)));
    console.log(errs.join('\n') || 'NO ERRORS'); await p.close(); await ctx.close();
  }
  await b.close();
})();
