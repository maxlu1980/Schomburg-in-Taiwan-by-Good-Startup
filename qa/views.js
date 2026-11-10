/* Reference views (V87): the game is started once, she is put at a place, the camera is set by hand and one frame is rendered to a JPEG —
   the platform hall, the train, the stairs, the indicators, the cathedral inside and out, the plazas, the dog. Used to compare a build with
   photographs of the place and with the build before it.   node qa/views.js PORT TAG [names,comma] [page]   → shots/views/TAG_name.jpg */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const OUTD = path.join(__dirname, '..', 'shots', 'views');
const PORT = process.argv[2] || '8765', TAG = process.argv[3] || 'base', ONLY = (process.argv[4] || '').split(',').filter(Boolean), PAGE = process.argv[5] || 'ktest/game_logo.html';
const W = +(process.env.VW || 1280), Hh = +(process.env.VH || 720);
/* [name, arrive (local x, z), frame ('L' city local, 'st' station u/y/v, 'dog' round the dog, 'mira' round her), camera, target, fov, pre (js in the game), steps before] */
const TYv = 5.0;
const V = [
  ['hall', [-16, -110], 'st', [-62, TYv + 1.45, 4.2], [80, TYv + 5.5, 2.0], 62],
  ['hall_end', [-16, -110], 'st', [40, TYv + 1.45, -9.4], [106, TYv + 9, 0], 62],
  ['plat_detail', [-16, -110], 'st', [-34, TYv + 1.45, 6.6], [-20, TYv + 0.9, 4.6], 55],
  ['nose', [-16, -110], 'st', [72.5, TYv + 1.5, 6.6], [84.5, TYv + 1.3, 10.6], 55],
  ['nose_front', [-16, -110], 'st', [97, TYv + 1.2, 7.4], [84, TYv + 1.5, 10.75], 50],
  ['train_side', [-16, -110], 'st', [30, TYv + 1.5, 3.0], [44, TYv + 1.4, 10.75], 62],
  ['stair_foot', [-16, -110], 'st', [-9.4, 1.6, 2.2], [3, 2.6, 5.6], 62],
  ['stair_side', [-16, -110], 'st', [-3, 1.6, -3.4], [-1, 1.8, 5.3], 66],
  ['stair_head', [-16, -110], 'st', [9.5, TYv + 1.5, 5.3], [-7, 0.6, 5.3], 60],
  ['stair_on', [-16, -110], 'st', [-7.6, 1.55, 5.3], [3, 5.2, 5.3], 60],
  ['passage', [-16, -110], 'st', [0, 1.6, 30], [0, 1.5, -30], 62],
  ['hbf_front', [-60, -46], 'L', [-74, 1.7, -42], [-14, 5, -84], 62],
  ['disp', [-16, -110], 'st', [15.5, TYv + 1.55, 6.3], [24, TYv + 3.3, 7.45], 42],
  ['hall_ctr', [-16, -110], 'st', [-40, TYv + 1.5, -9.4], [60, TYv + 4.5, -9.4], 64],
  ['dom_nave', [-22, 0], 'L', [-33, 2.0, 0], [34, 15, 0], 66],
  ['dom_nave_up', [-22, 0], 'L', [-30, 2.0, 0], [0, 34, 0], 70],
  ['dom_aisle_win', [-20, 15.6], 'L', [-22, 2.0, 4], [-20.6, 9, 18.75], 62],
  ['dom_crossing', [1.5, -11], 'L', [-8, 2.0, -3], [30, 9, 6], 66],
  ['dom_trans_s', [1.5, 26], 'L', [1.5, 2.0, 8], [1.5, 12, 36], 66],
  ['dom_amb', [48.4, 0], 'L', [30, 2.2, 13.5], [52, 6, 4], 66],
  ['dom_south', [30, 70], 'L', [34, 1.7, 92], [-6, 46, 0], 78],
  ['dom_south_low', [30, 70], 'L', [22, 1.7, 66], [2, 18, 30], 66],
  ['roncalli', [30, 70], 'L', [-34, 1.7, 52], [60, 4, 72], 66],
  ['roncalli_e', [30, 70], 'L', [80, 1.7, 50], [-20, 6, 60], 66],
  ['dom_west', [-74, 0], 'L', [-116, 1.7, 14], [-58, 48, 0], 80],
  ['dom_portal', [-74, 0], 'L', [-72, 1.7, 2], [-58.4, 6.5, 0], 62],
  ['kreuzblume', [-74, 0], 'L', [-92, 1.7, 22], [-78, 3, 8], 60],
  ['domplatte_w', [-74, 0], 'L', [-100, 1.7, -30], [-60, 3, 30], 66],
  ['dog_sit', [-60, -46], 'dog', [1.5, 0.42, 0.9], [0, 0.32, 0], 40, "DOG.setMode(DOGS.m.D,'sit'); 1", 30],
  ['dog_lie', [-60, -46], 'dog', [1.5, 0.36, 0.9], [0, 0.24, 0], 40, "DOG.setMode(DOGS.m.D,'lie'); 1", 30],
];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: W, height: Hh } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.NO_GOV = true; window.ISLE_TEST = true; window.ISLE_TIER = 'high'; window.ISLE_DPR = 1; window.KT_LANG = 'en'; window.ISLE_WX = { code: 0, cloud: 0.15, rain: 0 }; window.ISLE_HOUR = 11; window.ISLE_TK_HOUR = 11; delete window.AudioContext; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => window.KT_READY, null, { timeout: 300000 });
  const ev = (s) => p.evaluate(x => { try { var v = ISLE_x.ev(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, s);
  const steps = (n) => ev('(function(){ cancelAnimationFrame(raf); for (var i = 0; i < ' + n + '; i++) { var nw = performance.now(); last = nw - 50; try { GFX.lastF = 0; } catch (e0) {} frame(nw); cancelAnimationFrame(raf); } return mode; })()');
  await steps(2); await p.evaluate(() => ISLE._dbg.startGame()); await p.waitForTimeout(1500); await steps(3); await p.waitForTimeout(900); await steps(2); await ev('talkEnd(); 1');
  fs.mkdirSync(OUTD, { recursive: true });
  const out = { tag: TAG, views: [] };
  for (const v of V) {
    if (ONLY.length && !ONLY.includes(v[0])) continue;
    await ev("ISLE_k.arrive('direct', [" + v[1][0] + ', ' + v[1][1] + ']); snapCam(); 1'); await steps(8);
    if (v[6]) { const pr = await ev(v[6]); if (String(pr).startsWith('ERR')) console.log(v[0], 'pre', pr); }
    if (v[7]) { for (let k = 0; k < v[7]; k++) { if (v[6]) await ev(v[6]); await steps(1); } }
    const r = await p.evaluate(([v]) => { return ISLE_x.ev('(' + function (v) {
      var T = TK.T, c, t;
      function W(q) { if (v[2] === 'st') { var w = T.HG.localToWorld(new THREE.Vector3(q[0], q[1], q[2])); w.y = TK.y + q[1]; return w; } return T.toW(q[0], q[1], q[2]); }
      if (v[2] === 'dog' || v[2] === 'mira') { var R = v[2] === 'dog' ? DOGS.m.D.root : luna.root; R.updateMatrixWorld(true); var ry = R.rotation.y, cs = Math.cos(ry), sn = Math.sin(ry); var f = function (q) { return new THREE.Vector3(R.position.x + q[0] * cs + q[2] * sn, R.position.y + q[1], R.position.z - q[0] * sn + q[2] * cs); }; c = f(v[3]); t = f(v[4]); }
      else { c = W(v[3]); t = W(v[4]); }
      var f0 = cam.fov; if (v[5]) { cam.fov = v[5]; cam.updateProjectionMatrix(); }
      cam.position.copy(c); cam.lookAt(t); cam.updateMatrixWorld(true); if (T.levels) try { T.levels(T, cam.position); } catch (e) {}
      if (POST) POST.render(scene, cam, 123456); else R3.render(scene, cam);
      var s = R3.domElement.toDataURL('image/jpeg', 0.9); cam.fov = f0; cam.updateProjectionMatrix(); return s; } + ')(' + JSON.stringify(v) + ')'); }, [v]);
    if (String(r).startsWith('ERR') || String(r).indexOf('base64') < 0) { console.log(v[0], 'FAILED', String(r).slice(0, 200)); continue; }
    const f = path.join(OUTD, TAG + '_' + v[0] + '.jpg'); fs.writeFileSync(f, Buffer.from(r.split(',')[1], 'base64')); out.views.push(v[0]); console.log('shot', v[0]);
  }
  console.log('done', out.views.length, 'errs', errs.length, errs.slice(0, 3).join(' | ')); await b.close();
})();
