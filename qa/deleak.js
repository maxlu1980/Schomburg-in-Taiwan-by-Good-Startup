/* German leak check: English sentences still shown after switching to Deutsch, per route */
const { chromium } = require('playwright');
(async () => {
  const routes = ['#/crack-injection', '#/concrete-restoration', '#/mineral-waterproofing', '#/retrospective-concrete-waterproofing', '#/concrete-technology/crystalline-concrete-admixture', '#/protective-flooring-coating-systems'];
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); p.setDefaultTimeout(300000);
  await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 300)));
  for (const r of routes) {
    await p.goto('http://127.0.0.1:8765/dist/test.html' + r, { waitUntil: 'load' }); await p.waitForTimeout(2000);
    await p.evaluate(() => document.querySelector('button[data-lang="de"]').click()); await p.waitForTimeout(800);
    // scroll through to trigger lazy sections
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 1600) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(800);
    const res = await p.evaluate(() => {
      const EN = /\b(the|and|with|of|to|is|are|for|from|after|before|into|on|by|per|each|this|that|when|then|until|not|no|or)\b/gi;
      const DE = /\b(der|die|das|und|mit|von|zu|ist|sind|für|nach|vor|bei|je|nicht|oder|den|dem|des|ein|eine|im|auf)\b/gi;
      const out = new Map(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) {
        const el = n.parentElement; if (!el || el.closest('script,style,svg text,.dc,[hidden],.lang')) continue;
        const s = n.textContent.replace(/\s+/g, ' ').trim(); if (s.length < 18) continue;
        const e = (s.match(EN) || []).length, d = (s.match(DE) || []).length;
        if (e >= 2 && e > d) { const k = s.slice(0, 110); out.set(k, (el.closest('[id]') || {}).id || el.tagName); }
      }
      return [...out.entries()];
    });
    console.log('\n' + r + '  leaks: ' + res.length); res.slice(0, 25).forEach(([s, id]) => console.log('  [' + id + '] ' + s));
  }
  console.log('\n' + (errs.slice(0, 10).join('\n') || 'NO ERRORS')); await b.close();
})();
