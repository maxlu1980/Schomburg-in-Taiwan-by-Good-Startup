/* the hands-on overlay on phones, tablets and desktops: layout shots and touch mechanics (synthetic touch pointers: hold-and-follow, pinch, paint)
   node hsdevice.js [cat] [lang]   → shots/hs/dev_<device>_<step>.jpg + sheet */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const ROUTE = { wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', cr: '#/concrete-restoration', pf: '#/protective-flooring-coating-systems', ca: '#/concrete-technology/crystalline-concrete-admixture' };
const DEVICES = [['phone', 390, 844, true], ['phoneL', 844, 390, true], ['tablet', 820, 1180, true], ['tabletL', 1180, 820, true], ['desktop', 1440, 900, false]];
(async () => {
  const cat = process.argv[2] || 'wp', lang = process.argv[3] || 'en', only = process.argv[4];
  fs.mkdirSync('shots/hs', { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [], files = [];
  for (const [name, w, h, touch] of DEVICES) {
    if (only && name !== only) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 }); const p = await ctx.newPage(); p.setDefaultTimeout(120000);
    await p.addInitScript((touch) => { window.NO_GOV = true; window.FAST3D = true; if (touch) { window.matchMedia = (function (orig) { return function (q) { if (/pointer:\s*coarse/.test(q)) return { matches: true, media: q, addListener: function () {}, removeListener: function () {}, addEventListener: function () {}, removeEventListener: function () {} }; return orig.call(window, q); }; })(window.matchMedia); } }, touch);
    p.on('pageerror', e => errs.push(name + ' PAGEERROR ' + String(e).slice(0, 300)));
    await p.goto('http://127.0.0.1:8765/dist/test.html' + ROUTE[cat], { waitUntil: 'load' }); await p.waitForTimeout(2200); if (lang !== 'en') { await p.evaluate(l => setLang(l), lang); await p.waitForTimeout(300); }
    await p.evaluate(c => HSIM.open(c), cat); await p.waitForTimeout(2200);
    const shot = async (s) => { const f = 'shots/hs/dev_' + name + '_' + s + '.jpg'; await p.screenshot({ path: f, type: 'jpeg', quality: 78 }); files.push(f); };
    await shot('1brief');
    await p.evaluate(() => document.getElementById('hsStart').click()); await p.waitForTimeout(500);
    /* synthetic pointers on the canvas */
    const ev = async (type, id, x, y, ptype) => p.evaluate(({ type, id, x, y, ptype }) => { const c = document.querySelector('#hsim .hsim__view canvas'); c.dispatchEvent(new PointerEvent(type, { pointerType: ptype, pointerId: id, clientX: x, clientY: y, isPrimary: id === 1, bubbles: true, cancelable: true, buttons: type === 'pointerup' ? 0 : 1 })); }, { type, id, x, y, ptype: touch ? 'touch' : 'mouse' });
    await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { S.tool = HSIMS[c].phases[0].tool; A.hud(); }), cat);
    // hold-and-follow with a finger for ~3 s
    let held = 0, t0 = Date.now(), downDone = false;
    while (Date.now() - t0 < 3500) {
      const r = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const hp = A.head(); return { sp: hp ? A.toScreen(hp) : null, hold: !!S.hold, tw: S.tw }; }), cat);
      if (r.sp) { if (!downDone) { await ev('pointerdown', 1, r.sp.x, r.sp.y); downDone = true; } else await ev('pointermove', 1, r.sp.x + 6, r.sp.y + 10); if (r.hold) held++; }
      await p.waitForTimeout(80);
    }
    const tw1 = await p.evaluate(c => HSIM.get(c).peek(S => S.tw), cat);
    await shot('2drive'); await ev('pointerup', 1, 10, 10);
    console.log(name, 'drive: held frames', held, 'tw', tw1.toFixed(3), 'box open', await p.evaluate(() => document.getElementById('hsBox').classList.contains('is-open')));
    // pinch: two fingers apart → the view zooms in (the orbit distance shrinks)
    const d0 = await p.evaluate(c => HSIM.get(c).peek((S, v) => S.look ? S.look.fov : (v.dbg && v.dbg.cam ? v.dbg.cam.position.length() : 0)), cat);
    const cx = w / 2, cy = h / 2; await ev('pointerdown', 1, cx - 40, cy); await ev('pointerdown', 2, cx + 40, cy);
    for (let i = 1; i <= 8; i++) { await ev('pointermove', 1, cx - 40 - i * 12, cy); await ev('pointermove', 2, cx + 40 + i * 12, cy); await p.waitForTimeout(40); }
    await ev('pointerup', 1, cx - 136, cy); await ev('pointerup', 2, cx + 136, cy); await p.waitForTimeout(300);
    const d1 = await p.evaluate(c => HSIM.get(c).peek((S, v) => S.look ? S.look.fov : (v.dbg && v.dbg.cam ? v.dbg.cam.position.length() : 0)), cat);
    console.log(name, 'pinch: lens', d0.toFixed(2), '→', d1.toFixed(2));
    // the task box toggles on tap
    await p.evaluate(() => document.getElementById('hsBox').click()); const open1 = await p.evaluate(() => document.getElementById('hsBox').classList.contains('is-open')); await p.evaluate(() => document.getElementById('hsBox').click()); console.log(name, 'box toggled to', open1);
    // the mixing panel of phase 2 (M30)
    await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const P = HSIMS[c].phases[S.phase]; S.tw = P.to != null ? P.to : 1; A.complete(); S.tw = 1; A.complete(); }), cat); await p.waitForTimeout(900);
    await shot('3mix');
    // the paint phase: a few touch strokes
    await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { Object.keys(S.mats).forEach(k => { S.mats[k].mixed = true; S.mats[k].potOn = true; S.mats[k].pot = 9999; }); S.mixKey = null; document.getElementById('hsMix').hidden = true; while (HSIMS[c].phases[S.phase].kind !== 'paint') { const P = HSIMS[c].phases[S.phase]; if (P.kind === 'drive') { S.tw = P.to != null ? P.to : 1; A.complete(); } else { S.lapse = null; A.next(); } Object.keys(S.mats).forEach(k => { S.mats[k].mixed = true; S.mats[k].potOn = true; S.mats[k].pot = 9999; }); S.mixKey = null; document.getElementById('hsMix').hidden = true; } const P = HSIMS[c].phases[S.phase]; S.tool = P.tool.length != null ? P.tool[0] : P.tool; A.hud(); }), cat); await p.waitForTimeout(600);
    const pts = await p.evaluate(c => HSIM.get(c).peek((S) => { const me = S.paint.meshes[0], g = me.geometry, pos = g.attributes.position, out = []; me.updateMatrixWorld(true); for (let i = 0; i < pos.count; i++) out.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(me.matrixWorld).toArray()); return out; }), cat);
    for (let r = 0; r < 4; r++) { let first = true; for (let cI = 0; cI <= 8; cI++) { const fc = 0.06 + 0.88 * (r % 2 ? 8 - cI : cI) / 8, fr = 0.12 + r * 0.14; const q = await p.evaluate(({ pts, fr, fc, c }) => HSIM.get(c).peek((S, v, A) => { const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; const q = L(L(pts[0], pts[1], fc), L(pts[2], pts[3], fc), fr); return A.toScreen(new THREE.Vector3(q[0], q[1], q[2])); }), { pts, fr, fc, c: cat }); if (!q) continue; if (first) { await ev('pointerdown', 1, q.x, q.y); first = false; } else await ev('pointermove', 1, q.x, q.y); await p.waitForTimeout(25); } await ev('pointerup', 1, 10, 10); }
    await p.waitForTimeout(700);
    const pc = await p.evaluate(c => HSIM.get(c).peek(S => ({ cover: +S.paint.cover.toFixed(2), kg: +S.paint.kgm2().toFixed(2) })), cat); console.log(name, 'paint', JSON.stringify(pc));
    await shot('4paint');
    await p.close(); await ctx.close();
  }
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close();
  execSync('python3 ' + __dirname + '/sheet4.py shots/hs/sheet_dev_' + cat + (lang !== 'en' ? '_' + lang : '') + (only ? '_' + only : '') + '.jpg 2600 4 ' + files.join(' '));
})();
