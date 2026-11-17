/* The start page (V88): the technical pages first — the six guides, one click each — and the city game beside them.
   Checks, on the built page (serve the repository first: npm run serve):
   1. layout: desktop, tablet, phone, a phone held sideways, a small phone × zh/en/de — the six guides are there, nothing reaches past the
      sides of the screen, how many guides are visible without scrolling;
   2. accessibility: axe-core (WCAG 2.1 AA + best practice) on the start page, desktop/light and phone/dark, three languages;
   3. use: a guide taken at once opens that guide (its heading gets the focus) and the game is not opened over it; the header's game
      button opens the game afterwards; the game's own address (#/island) keeps the plain loading screen.
   node qa/start.js [layout,a11y,use]      exit 1 on a fault */
const { chromium } = require('playwright'); const path = require('path');
const URL = 'http://127.0.0.1:8765/dist/test.html', AXE = path.join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js');
const PARTS = (process.argv[2] || 'layout,a11y,use').split(',');
const GUIDES = ['cr', 'wp', 'rc', 'inj', 'ca', 'pf'];
let faults = 0; const fault = (m) => { faults++; console.log('  FAULT', m); };
async function page(b, w, h, touch, lg, scheme, hash) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, colorScheme: scheme || 'light' }); const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push(e.message));
  await p.addInitScript((l) => { window.NO_GOV = true; try { localStorage.clear(); localStorage.setItem('aquafin-p4-lang', l); } catch (e) {} delete window.AudioContext; }, lg);
  await p.goto(URL + (hash || ''), { waitUntil: 'commit', timeout: 300000 }); return p;
}
const state = (p) => p.evaluate(() => { const r = document.querySelector('.isle'), L = document.getElementById('kLoad'), a = document.activeElement;
  return { hash: location.hash, kload: L ? L.className : null, isleOpen: document.body.classList.contains('isle-open') && !!r && !r.hidden, main: [].filter.call(document.querySelectorAll('main[data-cat]'), m => !m.hidden && m.offsetHeight).map(m => m.getAttribute('data-cat')).join(','), focus: a ? a.tagName + ':' + (a.textContent || '').trim().slice(0, 30) : '' }; });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  if (PARTS.includes('layout')) { console.log('== layout');
    for (const v of [['desktop', 1280, 800, false], ['tablet', 820, 1180, true], ['phone', 390, 844, true], ['sideways', 844, 390, true], ['small', 360, 640, true]]) for (const lg of ['zh', 'en', 'de']) {
      const p = await page(b, v[1], v[2], v[3], lg); await p.waitForSelector('#kStartG a', { timeout: 120000 }); await p.waitForTimeout(400);
      const r = await p.evaluate(() => { const vw = innerWidth, vh = innerHeight, L = document.getElementById('kLoad'); const as = [].slice.call(document.querySelectorAll('#kStartG a'));
        return { start: L.classList.contains('is-start'), guides: as.map(a => a.getAttribute('data-g')), visible: as.filter(a => { const q = a.getBoundingClientRect(); return q.width > 0 && q.bottom <= vh; }).length,
          sideways: [].filter.call(L.querySelectorAll('*'), e => { const q = e.getBoundingClientRect(); return q.width && (q.right > vw + 1 || q.left < -1); }).length, h: document.getElementById('kStartH').textContent }; });
      console.log(' ', v[0], lg, JSON.stringify(r));
      if (!r.start) fault(v[0] + ' ' + lg + ': not the start page'); if (r.guides.join() !== GUIDES.join()) fault(v[0] + ' ' + lg + ': guides ' + r.guides.join()); if (r.sideways) fault(v[0] + ' ' + lg + ': ' + r.sideways + ' elements past the sides');
      if (v[0] !== 'small' && r.visible < 4) fault(v[0] + ' ' + lg + ': only ' + r.visible + ' guides without scrolling'); if (p.errs.length) fault(v[0] + ' ' + lg + ': ' + p.errs[0]);
      await p.context().close(); } }
  if (PARTS.includes('a11y')) { console.log('== accessibility');
    for (const v of [[1280, 800, false, 'light'], [390, 844, true, 'dark']]) for (const lg of ['zh', 'en', 'de']) {
      const p = await page(b, v[0], v[1], v[2], lg, v[3]); await p.waitForSelector('#kStartG a', { timeout: 120000 }); await p.addScriptTag({ path: AXE });
      const r = await p.evaluate(async () => { const r = await axe.run(document.getElementById('kLoad'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }); return r.violations.map(x => x.id + '[' + x.impact + ']x' + x.nodes.length + ' ' + x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')); });
      console.log(' ', v[0] + 'x' + v[1], v[3], lg, r.length ? r.join(' ; ') : 'no violations'); r.forEach(x => fault('axe ' + lg + ' ' + x)); await p.context().close(); } }
  if (PARTS.includes('use')) { console.log('== use');
    let p = await page(b, 1280, 800, false, 'zh'); await p.waitForSelector('#kStartG a[data-g="cr"]', { timeout: 120000 }); await p.click('#kStartG a[data-g="cr"]', { timeout: 300000 }); /* (the start page fades and is removed; on a slow renderer the city's building can hold that back) */ await p.waitForFunction(() => !document.getElementById('kLoad'), null, { timeout: 300000 }).catch(() => {}); await p.waitForTimeout(500);
    let s = await state(p); console.log('  a guide taken at once', JSON.stringify(s));
    if (s.hash !== '#/concrete-restoration' || s.main !== 'cr' || s.kload || s.isleOpen || !/^H1/.test(s.focus)) fault('guide at once: ' + JSON.stringify(s));
    await p.waitForTimeout(25000); s = await state(p); console.log('  a while later', JSON.stringify(s)); if (s.isleOpen || s.main !== 'cr') fault('the game opened over the guide: ' + JSON.stringify(s));
    await p.click('#utilIsle', { timeout: 300000 }); await p.waitForFunction(() => document.body.classList.contains('isle-open'), null, { timeout: 400000 }).catch(() => {}); s = await state(p); console.log('  the header\'s game button', JSON.stringify(s));
    if (!s.isleOpen) fault('the header\'s game button did not open the game'); if (p.errs.length) fault('page error ' + p.errs[0]); await p.context().close();
    p = await page(b, 1280, 800, false, 'en', 'light', '#/island'); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => { const L = document.getElementById('kLoad'); return L ? { start: L.classList.contains('is-start'), guides: !document.getElementById('kStart').hidden } : null; }); console.log('  #/island', JSON.stringify(r));
    if (!r || r.start || r.guides) fault('#/island should keep the plain loading screen: ' + JSON.stringify(r)); await p.context().close(); }
  console.log(faults ? faults + ' FAULT(S)' : 'START PAGE OK'); await b.close(); process.exit(faults ? 1 : 0);
})();
