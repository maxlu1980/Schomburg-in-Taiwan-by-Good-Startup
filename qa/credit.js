/* the developer's credit outside the game's own cards (V86): "System developed by Good Startup" on the loading screen (three languages, desktop
   and phone: present, clear of the corner button and the note) and under the simulators' result cards (the injection simulator and a hands-on
   one; zh / de / en, day and night). The game's cards, veil and film are checked by qa/scenarios/credit.json (node qa/kplay.js …).
   node qa/credit.js   (a local server on 8765 at the repository root; shots in shots/credit/) */
require('fs').mkdirSync('shots/credit', { recursive: true });
const { chromium } = require('playwright'); const fs = require('fs');
async function loader() { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const out = [];
  for (const [w, h, lang, touch] of [[1280, 760, 'zh', false], [390, 760, 'zh', true], [390, 760, 'de', true], [900, 560, 'en', false], [760, 400, 'de', true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch }); const p = await ctx.newPage();
    await p.addInitScript((lang) => { window.NO_GOV = true; try { localStorage.setItem('aquafin-p4-lang', lang); } catch (e) {} }, lang);
    await p.goto('http://127.0.0.1:8765/dist/test.html', { waitUntil: 'commit', timeout: 120000 });
    await p.waitForSelector('#kLoad:not([hidden])', { timeout: 120000 }); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { function R(e) { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; }
      const d = document.getElementById('kLoadDev'), sk = document.getElementById('kLoadSkip'), inn = document.querySelector('.kload__in'), note = document.getElementById('kLoadNote'); const rr = document.createRange(); rr.selectNodeContents(d); const tx = rr.getBoundingClientRect();
      const a = [Math.round(tx.left), Math.round(tx.top), Math.round(tx.right), Math.round(tx.bottom)], s = R(sk), n = R(note);
      const hit = (x, y) => x && y && !(x[2] <= y[0] || x[0] >= y[2] || x[3] <= y[1] || x[1] >= y[3]);
      return { text: d.textContent, dev: a, skip: s, note: n, overSkip: hit(a, s), overNote: hit(a, n), col: getComputedStyle(d).color, fs: getComputedStyle(d).fontSize, vh: innerHeight }; });
    const f = 'shots/credit/dev_load_' + w + '_' + lang + '.jpg'; console.log(JSON.stringify([w, h, lang, r])); try { await p.screenshot({ path: f, type: 'jpeg', quality: 80, timeout: 170000 }); } catch (e) { console.log('shot failed', w, lang); } await ctx.close(); }
 await b.close(); }
async function results() { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [w, h, lang, touch, theme] of [[1280, 800, 'zh', false, 'light'], [390, 780, 'de', true, 'light'], [1024, 700, 'en', false, 'dark']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch }); const p = await ctx.newPage(); p.setDefaultTimeout(240000); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(([lang, theme]) => { window.NO_GOV = true; window.FAST3D = true; try { localStorage.setItem('aquafin-p4-lang', lang); } catch (e) {} if (theme === 'dark') document.addEventListener('DOMContentLoaded', () => document.documentElement.setAttribute('data-theme', 'dark')); }, [lang, theme]);
    const R = (root) => p.evaluate((root) => { const d = [...document.querySelectorAll(root + ' .sim__dev')].filter(e => e.offsetWidth)[0]; if (!d) return null; const q = d.getBoundingClientRect(), cs = getComputedStyle(d), card = d.closest('.sim__cardin'), cq = card.getBoundingClientRect(), act = card.querySelector('.sim__cardact').getBoundingClientRect();
      return { text: d.textContent, rect: [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)], color: cs.color, bg: getComputedStyle(card).backgroundColor, fs: cs.fontSize, belowButtons: q.top >= act.bottom - 1, inCard: q.bottom <= cq.bottom + 1 }; }, root);
    await p.goto('http://127.0.0.1:8765/dist/test.html#/crack-injection', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    await p.evaluate(() => { document.getElementById('simOpen').click(); }); await p.waitForTimeout(2500);
    const before = await R('#sim'); await p.evaluate(() => { sim.peek(S => { S.finished = true; }); sim.relabel(); }); await p.waitForTimeout(500);
    console.log(JSON.stringify([w, lang, theme, 'injection', { briefingHasLine: !!before }, await R('#sim')]));
    await p.screenshot({ path: 'shots/credit/dev_sim_inj_' + w + '.jpg', type: 'jpeg', quality: 80, timeout: 170000 }).catch(() => console.log('shot failed'));
    await p.evaluate(() => sim.close()); await p.waitForTimeout(400);
    await p.goto('http://127.0.0.1:8765/dist/test.html#/mineral-waterproofing', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    await p.evaluate(() => HSIM.open('wp')); await p.waitForTimeout(3500);
    const before2 = await R('#hsim'); await p.evaluate(() => { HSIM.get('wp').peek(S => { S.fin = true; }); HSIM.get('wp').relabel(); }); await p.waitForTimeout(500);
    console.log(JSON.stringify([w, lang, theme, 'hands-on', { briefingHasLine: !!before2 }, await R('#hsim'), errs]));
    await p.screenshot({ path: 'shots/credit/dev_sim_hs_' + w + '.jpg', type: 'jpeg', quality: 80, timeout: 170000 }).catch(() => console.log('shot failed'));
    await ctx.close(); }
  await b.close(); }
(async () => { await loader(); await results(); })();
