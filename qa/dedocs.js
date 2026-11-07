/* German documents: every kind of every guide previewed in Deutsch, English leak scan, Word for all, PDF for one kind per guide */
const { chromium } = require('playwright');
const G = [['inj', '#/crack-injection'], ['cr', '#/concrete-restoration'], ['wp', '#/mineral-waterproofing'], ['rc', '#/retrospective-concrete-waterproofing'], ['ca', '#/concrete-technology/crystalline-concrete-admixture'], ['pf', '#/protective-flooring-coating-systems']];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  for (const [id, route] of G) {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.setDefaultTimeout(300000);
    await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
    p.on('pageerror', e => errs.push(id + ' PAGEERROR ' + String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error' && /DocGen/.test(m.text())) errs.push(id + ' ' + m.text().slice(0, 300)); });
    await p.goto('http://127.0.0.1:8765/dist/test.html' + route, { waitUntil: 'load' }); await p.waitForTimeout(2000);
    await p.evaluate(() => { setLang('de'); window.__saved = []; DocGen.save = function (blob, name) { window.__saved.push([name, blob.size]); }; });
    await p.waitForTimeout(500);
    await p.evaluate(i => document.getElementById(i + 'Docs').scrollIntoView({ behavior: 'instant' }), id); await p.waitForTimeout(500);
    const kinds = await p.evaluate(i => [...document.querySelectorAll('#' + i + 'Docs [data-docsel="kind"] option')].map(o => o.value), id);
    let line = id + ' kinds ' + kinds.length + ':';
    for (let k = 0; k < kinds.length; k++) {
      await p.evaluate(([i, v]) => { const s = document.querySelector('#' + i + 'Docs [data-docsel="kind"]'); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }, [id, kinds[k]]);
      await p.waitForTimeout(200);
      await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="preview"]').click(), id);
      await p.waitForFunction(i => { const f = document.getElementById(i + 'DocFrame'); return f && !f.hidden && document.getElementById(i + 'DocScale').textContent.length > 200; }, id, { timeout: 120000 }).catch(() => errs.push(id + ' ' + kinds[k] + ' preview timeout'));
      const r = await p.evaluate(i => {
        const EN = /\b(the|and|with|of|to|is|are|for|from|after|before|into|on|by|per|each|this|that|when|then|until|not|or)\b/gi, DE = /\b(der|die|das|und|mit|von|zu|ist|sind|für|nach|vor|bei|je|nicht|oder|den|dem|des|ein|eine|im|auf)\b/gi;
        const sc = document.getElementById(i + 'DocScale'), out = []; const w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) { const s = n.textContent.replace(/\s+/g, ' ').trim(); if (s.length < 18) continue; const e = (s.match(EN) || []).length, d = (s.match(DE) || []).length; if (e >= 2 && e > d) out.push(s.slice(0, 120)); }
        return { len: sc.textContent.length, leaks: out };
      }, id);
      line += ' ' + kinds[k] + '(' + r.len + (r.leaks.length ? ', LEAK ' + r.leaks.length : '') + ')';
      r.leaks.slice(0, 200).forEach(s => errs.push(id + ' ' + kinds[k] + ' EN: ' + s));
      await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="docx"]').click(), id);
      await p.waitForFunction(n => window.__saved.length >= n, k + 1 + (k > 0 ? 1 : 0), { timeout: 120000 }).catch(() => errs.push(id + ' ' + kinds[k] + ' docx timeout'));
      if (k === 0) { await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="pdf"]').click(), id); await p.waitForFunction(() => window.__saved.length >= 2, null, { timeout: 240000 }).catch(() => errs.push(id + ' pdf timeout')); }
    }
    const saved = await p.evaluate(() => window.__saved);
    console.log(line); saved.forEach(s => console.log('   saved', s[0], s[1]));
    const st = await p.evaluate(i => document.getElementById(i + 'DocStatus').textContent, id); if (/fehl|failed/i.test(st)) errs.push(id + ' status ' + st);
    await p.close();
  }
  console.log('\n' + (errs.slice(0, 400).join('\n') || 'NO ERRORS')); await b.close();
})();
