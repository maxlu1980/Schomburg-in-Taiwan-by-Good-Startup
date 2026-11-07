/* floor flicker metric: each view rendered twice with the camera moved 1 mm sideways; pixels that change by more than a threshold are
   counted (a surface z-fighting another flips between them; a stable picture barely changes). node qa/flicker.js [PORT] [OUT.json] [tag]  (then python3 qa/flicker_diff.py OUT.json) */
const { chromium } = require('playwright'); const fs = require('fs');
const PORT = process.argv[2] || '8765', OUT = process.argv[3] || 'flk85.json', TAG = process.argv[4] || 'v85';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.NO_GOV = true; window.ISLE_TEST = true; window.ISLE_TIER = 'high'; window.ISLE_DPR = 1; window.KT_LANG = 'en'; window.ISLE_WX = { code: 0, cloud: 0.1, rain: 0 }; window.ISLE_HOUR = 11; window.ISLE_TK_HOUR = 11; delete window.AudioContext; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://127.0.0.1:' + PORT + '/ktest/game_logo.html', { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => window.KT_READY, null, { timeout: 300000 });
  const ev = (s) => p.evaluate(x => { try { var v = ISLE_x.ev(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, s);
  const steps = (n) => ev('(function(){ cancelAnimationFrame(raf); for (var i = 0; i < ' + n + '; i++) { var nw = performance.now(); last = nw - 50; frame(nw); cancelAnimationFrame(raf); } return mode; })()');
  await steps(2); await p.evaluate(() => ISLE._dbg.startGame()); await p.waitForTimeout(1500); await steps(3); await p.waitForTimeout(900); await steps(2); await ev('talkEnd(); 1');
  /* the views: [name, place to stand (local x, z), camera (x, y, z) and target (x, y, z) in the city's local frame; 'st:' = the station's own frame (u, y, v)] */
  const V = [
    ['passage', [-16, -110], 'st', [-9.2, 1.75, 2.0], [6, 0.4, 5.5]],
    ['passage_far', [-16, -110], 'st', [-9.5, 1.75, -40], [9.5, 0.3, 30]],
    ['hall_entry', [0, -50], 'st', [0, 1.7, 60.0], [0, 0.5, 40]],
    ['platform_bed', [-16, -110], 'st', [-90, 6.8, 6.5], [100, 4.3, 0]],
    ['setts_far', [-20, 40], 'L', [-30, 6.0, 40], [-20, 0.0, 260]],
    ['vorplatz', [-10, -40], 'L', [-60, 2.2, -10], [40, 0.2, -70]],
    ['rheingarten', [220, 60], 'L', [190, 9.0, -10], [230, 0.2, 120]]];
  const out = { tag: TAG, views: [] };
  for (const v of V) {
    await ev("ISLE_k.arrive('direct', [" + v[1][0] + ', ' + v[1][1] + ']); snapCam(); 1'); await steps(8);
    const r = await p.evaluate(([v]) => { return ISLE_x.ev('(' + function (v) {
      var T = TK.T; function W(q) { if (v[2] === 'st') { var w = T.HG.localToWorld(new THREE.Vector3(q[0], q[1], q[2])); w.y = TK.y + q[1]; return w; } var w2 = T.toW(q[0], q[1], q[2]); return w2; }
      var c = W(v[3]), t = W(v[4]), side = new THREE.Vector3().subVectors(t, c).cross(new THREE.Vector3(0, 1, 0)).normalize();
      var shots = [], ts = 123456; for (var k = 0; k < 3; k++) { var o = side.clone().multiplyScalar(k * 0.001); cam.position.copy(c).add(o); cam.lookAt(t.clone().add(o)); cam.updateMatrixWorld(true); if (POST) POST.render(scene, cam, ts); else R3.render(scene, cam); shots.push(R3.domElement.toDataURL('image/png')); }
      return JSON.stringify(shots); } + ')(' + JSON.stringify(v) + ')'); }, [v]);
    const shots = JSON.parse(r); const names = shots.map((s, k) => { const f = 'shots/flk/' + TAG + '_' + v[0] + '_' + k + '.png'; fs.mkdirSync('shots/flk', { recursive: true }); fs.writeFileSync(f, Buffer.from(s.split(',')[1], 'base64')); return f; });
    out.views.push({ name: v[0], files: names });
  }
  out.errs = errs; fs.writeFileSync(OUT, JSON.stringify(out)); console.log('done', errs.length); await b.close();
})();
