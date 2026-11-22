/* (V89) The guided jobsites, frame by frame: jumps to steps at a given progress (materials mixed, rate answered) and takes a picture of each,
   with the man and his tool posed as at that moment. For reviewing frames, scenes and marks quickly.
   node qa/sitepose.js cat "id:tw,id:tw,…" [lang] [w×h] [intro]      → shots/pose/<cat>_<id>_<tw>.jpg */
const { chromium } = require('playwright'); const fs = require('fs');
const ROUTE = { wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', cr: '#/concrete-restoration', pf: '#/protective-flooring-coating-systems', ca: '#/concrete-technology/crystalline-concrete-admixture', inj: '#/crack-injection' };
const cat = process.argv[2] || 'wp', list = (process.argv[3] || '').split(',').filter(Boolean).map(s => s.split(':')), lang = process.argv[4] || 'zh', VP = (process.argv[5] || '1280x800').split('x').map(Number), DPR = +(process.env.DPR || 1);
(async () => {
  fs.mkdirSync('shots/pose', { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: VP[0], height: VP[1] }, deviceScaleFactor: DPR })).newPage(); p.setDefaultTimeout(600000);
  await p.addInitScript((l) => { window.NO_GOV = true; if (!/full/.test(location.search)) window.FAST3D = !window.__full; try { localStorage.setItem('aquafin-p4-lang', l); } catch (e) {} delete window.AudioContext; }, lang);
  if (process.env.FULL) await p.addInitScript(() => { window.__full = true; window.FAST3D = false; });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 400)));
  await p.goto('http://127.0.0.1:8765/dist/test.html' + ROUTE[cat], { waitUntil: 'load' }); await p.waitForFunction(() => !document.getElementById('kLoad'), null, { timeout: 300000 }).catch(() => {}); await p.waitForTimeout(1200);
  await p.evaluate(c => HSIM.open(c), cat); await p.waitForTimeout(2000); await p.click('#hsStart'); await p.waitForTimeout(800);
  if (process.argv[6] === 'intro') { await p.waitForTimeout(3500); await p.screenshot({ path: 'shots/pose/' + cat + '_' + lang + '_intro.jpg', type: 'jpeg', quality: 80 }); }
  for (const [id, tws] of list) { const tw = +tws;
    await p.evaluate(({ c, id, tw }) => HSIM.get(c).peek((S, v, k) => { const i = HSIMS[c].phases.findIndex(q => q.id === id); S.introOn = false; for (const m in S.mats) { S.mats[m].mixed = true; S.mats[m].potOn = true; S.mats[m].pot = 3000; } S.phase = i; k.enter(); S.rate = null; S.quiz = null; document.getElementById('hsMix').hidden = true; S.tw = tw; v.H.set(i, tw); k.hold(false); if (S.lapse) { S.lapse.t = S.lapse.dur * tw; } }), { c: cat, id, tw });
    await p.waitForTimeout(+(process.env.WAIT || 2600));
    await p.evaluate(({ c, tw }) => HSIM.get(c).peek((S, v) => { S.tw = tw; }), { c: cat, tw });
    await p.screenshot({ path: 'shots/pose/' + cat + '_' + lang + '_' + id + '_' + tws + '.jpg', type: 'jpeg', quality: 80 }); console.log('shot', id, tw); }
  errs.forEach(e => console.log(e)); await b.close();
})();
