/* comparison documents: 6 guides × en / zh / de — preview, Word, PDF; table counts, coverage lines, timing; shots of the first product */
const { chromium } = require('playwright');
const G = [['inj', '#/crack-injection'], ['cr', '#/concrete-restoration'], ['wp', '#/mineral-waterproofing'], ['rc', '#/retrospective-concrete-waterproofing'], ['ca', '#/concrete-technology/crystalline-concrete-admixture'], ['pf', '#/protective-flooring-coating-systems']];
const LANGS = (process.env.LANGS || 'en,zh,de').split(',');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  for (const [id, route] of G) for (const lang of LANGS) {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.setDefaultTimeout(300000);
    await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
    p.on('pageerror', e => errs.push(id + ' ' + lang + ' PAGEERROR ' + String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error' && /DocGen|Error/.test(m.text())) errs.push(id + ' ' + lang + ' ' + m.text().slice(0, 300)); });
    await p.goto('http://127.0.0.1:8765/dist/test.html' + route, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    await p.evaluate(l => { setLang(l); window.__saved = []; DocGen.save = function (blob, name) { window.__saved.push([name, blob.size]); }; }, lang);
    await p.evaluate(i => { document.getElementById(i + 'Docs').scrollIntoView({ behavior: 'instant' }); const s = document.querySelector('#' + i + 'Docs [data-docsel="kind"]'); s.value = 'compare'; s.dispatchEvent(new Event('change', { bubbles: true })); }, id);
    await p.waitForTimeout(300);
    const t0 = Date.now();
    await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="preview"]').click(), id);
    await p.waitForFunction(i => { const f = document.getElementById(i + 'DocFrame'); return f && !f.hidden && document.getElementById(i + 'DocScale').textContent.length > 2000; }, id, { timeout: 200000 }).catch(() => errs.push(id + ' ' + lang + ' preview timeout'));
    const tPrev = Date.now() - t0;
    const info = await p.evaluate(i => { const sc = document.getElementById(i + 'DocScale'); return { tables: sc.querySelectorAll('table').length, imgs: sc.querySelectorAll('img').length, len: sc.textContent.length, pages: sc.querySelectorAll('.a4page, .a4__page, .page').length, txt: sc.textContent }; }, id);
    const has = k => info.txt.includes(k);
    if (lang === 'en' && !(has('Manufacturers checked') && has('Table 1 of'))) errs.push(id + ' en missing coverage/part lines');
    if (lang === 'de' && !(has('Für jedes Produkt geprüfte Hersteller'))) errs.push(id + ' de missing coverage');
    if (lang === 'zh' && !(has('每項產品均比對'))) errs.push(id + ' zh missing coverage');
    if (/undefined|NaN|\[object/.test(info.txt)) errs.push(id + ' ' + lang + ' undefined/NaN in text: ' + (info.txt.match(/.{40}(undefined|NaN|\[object).{40}/) || [''])[0]);
    if (id === 'wp' && lang === 'en') { await p.evaluate(i => { const f = document.getElementById(i + 'DocFrame'); f.scrollIntoView(); }, id); await p.waitForTimeout(400); await p.screenshot({ path: 'shots/hs/cmp_wp_en.jpg', type: 'jpeg', quality: 82, fullPage: false }); }
    const t1 = Date.now();
    await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="docx"]').click(), id);
    await p.waitForFunction(() => window.__saved.length >= 1, null, { timeout: 240000 }).catch(() => errs.push(id + ' ' + lang + ' docx timeout'));
    const tDocx = Date.now() - t1, t2 = Date.now();
    await p.evaluate(i => document.querySelector('#' + i + 'Docs [data-docbtn="pdf"]').click(), id);
    await p.waitForFunction(() => window.__saved.length >= 2, null, { timeout: 400000 }).catch(() => errs.push(id + ' ' + lang + ' pdf timeout'));
    const tPdf = Date.now() - t2;
    const saved = await p.evaluate(() => window.__saved);
    const st = await p.evaluate(i => document.getElementById(i + 'DocStatus').textContent, id);
    console.log(id, lang, 'tables', info.tables, 'charts', info.imgs, 'chars', info.len, '| preview', tPrev, 'ms docx', tDocx, 'ms pdf', tPdf, 'ms |', saved.map(s => s[1]).join(' / '), '|', st);
    await p.close();
  }
  console.log('\n' + (errs.slice(0, 60).join('\n') || 'NO ERRORS')); await b.close();
})();
