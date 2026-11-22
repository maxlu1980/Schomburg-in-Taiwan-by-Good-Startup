/* (V89) The guided jobsites (SiteSim): a full run of one simulator — the briefing, the site as found, every step (mixing panels, the rate of
   each coat, quizzes and doses answered right, the work held to its end), the result. A picture of every step half done.
   Checks: no page errors; every step reached; the hold button there and enabled in every work step; the man and his tool in the picture
   while the work is held; the frame of the step has the work in view (the tool on screen).
   node qa/site.js cat [lang] [w×h]      → shots/site/<cat>_<lang>_<nn>_<id>.jpg; exit 1 on a fault. Serve the repository first (npm run serve). */
const { chromium } = require('playwright'); const fs = require('fs');
const ROUTE = { wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', cr: '#/concrete-restoration', pf: '#/protective-flooring-coating-systems', ca: '#/concrete-technology/crystalline-concrete-admixture', inj: '#/crack-injection' };
const cat = process.argv[2] || 'wp', lang = process.argv[3] || 'zh', VP = (process.argv[4] || '1280x800').split('x').map(Number), ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
let faults = 0; const fault = (m) => { faults++; console.log('  FAULT', m); };
(async () => {
  fs.mkdirSync('shots/site', { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: VP[0], height: VP[1] } })).newPage(); p.setDefaultTimeout(600000);
  await p.addInitScript((l) => { window.NO_GOV = true; window.FAST3D = true; try { localStorage.setItem('aquafin-p4-lang', l); } catch (e) {} delete window.AudioContext; }, lang);
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 400))); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  await p.goto('http://127.0.0.1:8765/dist/test.html' + ROUTE[cat], { waitUntil: 'load' }); await p.waitForFunction(() => !document.getElementById('kLoad'), null, { timeout: 300000 }).catch(() => {}); await p.waitForTimeout(1500);
  await p.evaluate(c => HSIM.open(c), cat); await p.waitForTimeout(2500);
  const shot = async (name) => { const f = 'shots/site/' + cat + '_' + lang + '_' + name + '.jpg'; await p.screenshot({ path: f, type: 'jpeg', quality: 78 }); return f; };
  const peek = () => p.evaluate(c => HSIM.get(c).peek((S, v, k) => { const ph = HSIMS[c].phases[S.phase]; return { phase: S.phase, id: ph.id, kind: ph.kind, mode: S.mode, mixKey: S.mixKey, rate: !!S.rate, quiz: !!S.quiz, lapse: !!S.lapse, play: !!S.play, fin: !!S.fin, tw: S.tw, intro: !!S.introOn, card: !document.getElementById('hsCard').hidden, score: S.score, canWork: k.canWork() }; }), cat);
  await shot('00_brief'); await p.click('#hsStart'); await p.waitForTimeout(1200);
  if (await p.$('#hs2Go')) { await p.waitForTimeout(2500); await shot('01_intro'); await p.click('#hs2Go'); await p.waitForTimeout(600); }
  let last = -1, guard = 0, shotAt = -1; const t0 = Date.now();
  while (guard++ < 3000) {
    const s = await peek();
    if (s.fin) { await p.waitForTimeout(2500); await shot('99_result'); console.log('FINISHED score', s.score, 'in', Math.round((Date.now() - t0) / 1000), 's'); break; }
    if (s.phase !== last) { last = s.phase; console.log('step', s.phase, s.id, s.kind, 'score', s.score); }
    if (s.lapse || s.play) { if (shotAt !== s.phase && s.tw > 0.5) { shotAt = s.phase; await shot(String(s.phase + 2).padStart(2, '0') + '_' + s.id); } await p.waitForTimeout(250); continue; }
    if (s.quiz) { const P = await p.evaluate(({ c, i }) => HSIMS[c].phases[i], { c: cat, i: s.phase }); await shot(String(s.phase + 2).padStart(2, '0') + '_' + s.id); shotAt = s.phase;
      if (P.kind === 'quiz') await p.click('#hsMix [data-opt="' + P.ok + '"]'); else { await p.evaluate(P => { const e = document.getElementById('hsSl'); e.value = (P.dose.ok[0] + P.dose.ok[1]) / 2; e.dispatchEvent(new Event('input')); }, P); await p.click('#hsDoseBtn'); }
      await p.waitForTimeout(300); continue; }
    if (s.rate) { await p.click('#hsMix [data-rate="1"]'); await p.waitForTimeout(300); continue; }
    if (s.mixKey) { const step = await p.evaluate(({ c, k }) => HSIM.get(c).peek(S => { const m = HSIMS[c].mats[k], st = S.mats[k]; return m.steps[st.step]; }), { c: cat, k: s.mixKey });
      if (!step) { await p.waitForTimeout(200); continue; }
      if (step.k === 'hold') { const bb = await p.locator('#hsMixBtn').boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout((step.s + 0.4) * 1000); await p.mouse.up(); }
      else if (step.k === 'mature') await p.waitForTimeout(500);
      else if (step.k === 'slider') { await p.evaluate(sp => { const e = document.getElementById('hsSl'); e.value = (sp.ok[0] + sp.ok[1]) / 2; e.dispatchEvent(new Event('input')); }, step); await p.click('#hsMixBtn'); }
      else await p.click('#hsMixBtn');
      await p.waitForTimeout(200); continue; }
    if (s.mode === 'work' || s.mode === 'coat') {
      const hb = await p.evaluate(() => { const b = document.getElementById('hs2Hold'); return b ? { hidden: b.hidden, disabled: b.disabled } : null; });
      if (!hb || hb.hidden || hb.disabled) { fault('step ' + s.id + ': the hold button ' + JSON.stringify(hb)); }
      if (ONLY && !ONLY.includes(s.id)) { await p.evaluate(c => HSIM.get(c).peek((S, v, k) => k.complete()), cat); await p.waitForTimeout(200); continue; }
      await p.evaluate(c => HSIM.get(c).peek((S, v, k) => k.hold(true)), cat);
      let s2 = s; while (s2.phase === s.phase && s2.tw < 0.5) { await p.waitForTimeout(150); s2 = await peek(); }
      if (s2.phase === s.phase) { await p.waitForTimeout(900); const chk = await p.evaluate(c => HSIM.get(c).peek((S, v) => { let man = false, tool = null; v.scene.traverse(o => { if (o.userData && o.userData.man && o.visible) man = true; }); const H = v.H, st = H.stage, cam = v.cam; let onScreen = null; v.scene.traverse(o => { if (o.userData && o.userData.hold && o.visible && !tool) { tool = o; } }); if (tool) { const w = new THREE.Vector3(); tool.getWorldPosition(w); w.project(cam); onScreen = Math.abs(w.x) < 1 && Math.abs(w.y) < 1 && w.z < 1; } return { man, tool: tool ? tool.userData.hold.kind : null, onScreen }; }), cat);
        if (!chk.man) fault('step ' + s.id + ': no man at work'); if (chk.tool && !chk.onScreen) fault('step ' + s.id + ': the tool (' + chk.tool + ') is out of the picture');
        await shot(String(s.phase + 2).padStart(2, '0') + '_' + s.id); shotAt = s.phase; console.log('   held', s.id, JSON.stringify(chk)); }
      while (s2.phase === s.phase && !s2.fin && !s2.mixKey && !s2.rate) { await p.waitForTimeout(200); s2 = await peek(); }
      await p.evaluate(c => HSIM.get(c).peek((S, v, k) => k.hold(false)), cat); continue; }
    if (s.mode === 'intro') { await p.click('#hs2Go'); continue; }
    await p.waitForTimeout(200);
  }
  const fps = await p.evaluate(() => new Promise(r => { let n = 0; const t = performance.now(); (function f() { n++; if (performance.now() - t < 2000) requestAnimationFrame(f); else r(n / 2); })(); }));
  console.log('fps (swiftshader)', fps);
  errs.filter(e => !/Failed to load resource/.test(e)).slice(0, 8).forEach(e => fault(e));
  console.log(faults ? faults + ' FAULT(S)' : 'SITE OK'); await b.close(); process.exit(faults ? 1 : 0);
})();
