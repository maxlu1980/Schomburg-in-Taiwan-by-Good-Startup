/* accessibility audit (axe-core, WCAG 2.1 AA tags) of every route in zh/en/de, light + night, desktop + phone; the opened simulator and the game's title on one route */
const { chromium } = require('playwright'); const fs = require('fs');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const routes = ['#/crack-injection', '#/concrete-restoration', '#/mineral-waterproofing', '#/retrospective-concrete-waterproofing', '#/concrete-technology/crystalline-concrete-admixture', '#/protective-flooring-coating-systems'];
const ONLY = process.env.ROUTES ? process.env.ROUTES.split(',') : routes;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const all = {};
  const run = async (p, tag) => {
    await p.evaluate(AXE);
    const r = await p.evaluate(async () => { const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }, resultTypes: ['violations'] }); return res.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, ex: v.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n').slice(1, 2).join(' ').slice(0, 140)) })); });
    for (const v of r) { const k = v.id + ' [' + v.impact + '] ' + v.help; all[k] = all[k] || { n: 0, where: [], ex: v.ex }; all[k].n += v.n; all[k].where.push(tag); }
    console.log(tag, r.length ? r.map(v => v.id + ':' + v.n).join(' ') : 'clean');
  };
  for (const [w, h, touch] of [[1280, 800, false], [390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch }); const p = await ctx.newPage(); p.setDefaultTimeout(200000);
    await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
    for (const r of ONLY) {
      await p.goto('http://127.0.0.1:8765/dist/test.html' + r, { waitUntil: 'load' }); await p.waitForTimeout(2000);
      for (const lang of ['zh', 'en', 'de']) { await p.evaluate(l => setLang(l), lang); await p.waitForTimeout(400); await run(p, w + ' ' + r + ' ' + lang); }
      if (r === routes[2]) { await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark')); await p.waitForTimeout(300); await run(p, w + ' ' + r + ' zh night'); await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
        await p.evaluate(() => HSIM.open('wp')); await p.waitForTimeout(2000); await run(p, w + ' simulator brief'); await p.evaluate(() => document.getElementById('hsStart').click()); await p.waitForTimeout(600); await run(p, w + ' simulator hud'); await p.evaluate(() => HSIM.close ? HSIM.close() : document.getElementById('hsExit').click()); await p.waitForTimeout(500); }
      if (r === routes[0]) { await p.evaluate(() => document.getElementById('simOpen').click()); await p.waitForTimeout(2000); await run(p, w + ' injection brief'); await p.evaluate(() => document.getElementById('simBack').click()); await p.waitForTimeout(400); }
    }
    await ctx.close();
  }
  console.log('\n== VIOLATIONS BY RULE'); Object.entries(all).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) => { console.log(k, '× ' + v.n, 'in', v.where.length, 'views'); v.ex.forEach(e => console.log('    ', e)); });
  await b.close();
})();
