/* Feet on the floor (V87): she is put at every named place of the city (and on the lawns, the setts, the plazas, in the cathedral's aisles,
   at the game's own starting place on the platform), and the height she stands at is compared with the highest opaque surface drawn under
   her (a ray straight down). A walker must stand on what is seen: |difference| <= FEET_TOL cm (0.25), else the place is listed as a fault —
   the plazas' slabs, the setts, the lawns and the cathedral's floor slabs lay 5–14 mm over the floor that was walked on.
   node qa/feet.js [PORT] [names,comma] [page]      (serve the repository first: npm run serve)      exit 1 when a place fails */
const { chromium } = require('playwright');
const PORT = process.argv[2] || '8765', ONLY = (process.argv[3] || '').split(',').filter(Boolean), PAGE = process.argv[4] || 'ktest/game_logo.html';
const TOL = +(process.env.FEET_TOL || 0.25);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 640, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.NO_GOV = true; window.ISLE_TEST = true; window.ISLE_TIER = 'mid'; window.ISLE_DPR = 0.5; window.KT_LANG = 'en'; window.ISLE_WX = { code: 0, cloud: 0.15, rain: 0 }; window.ISLE_HOUR = 11; window.ISLE_TK_HOUR = 11; delete window.AudioContext; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => window.KT_READY || (window.ISLE_x && window.ISLE_x.load && window.ISLE_x.load().ready), null, { timeout: 300000 });
  const ev = (s) => p.evaluate(x => { try { var v = ISLE_x.ev(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, s);
  const steps = (n) => ev('(function(){ cancelAnimationFrame(raf); for (var i = 0; i < ' + n + '; i++) { var nw = performance.now(); last = nw - 50; try { GFX.lastF = 0; } catch (e0) {} frame(nw); cancelAnimationFrame(raf); } return mode; })()');
  await steps(2); await p.evaluate(() => ISLE._dbg.startGame()); await p.waitForTimeout(1500); await steps(3); await p.waitForTimeout(900); await steps(2);
  await ev('(function(){ try { GFX.cap = 0; } catch (e) {} var n = 0; while (talkQ && n < 12) { talkEnd(); n++; } return n; })()'); await steps(20); await ev('(function(){ var n = 0; while (talkQ && n < 12) { talkEnd(); n++; } return n; })()');
  const MEASURE = '(' + function (who) {
    var T = TK.T, r = who === 'dog' ? DOGS.m.D.root : luna.root, wy = r.position.y, L = T.toL(r.position.x, r.position.z);
    var rc = new THREE.Raycaster(new THREE.Vector3(r.position.x, wy + 0.5, r.position.z), new THREE.Vector3(0, -1, 0), 0, 1.1), hits = [];
    T.root.updateMatrixWorld(true);
    T.root.traverse(function (m) { if (!m.isMesh || m.isInstancedMesh || m.isSkinnedMesh || !m.geometry) return; for (var q = m; q; q = q.parent) if (q.visible === false) return;
      var mat = Array.isArray(m.material) ? m.material[0] : m.material; if (!mat || mat.visible === false) return; var h; try { h = rc.intersectObject(m, false); } catch (e) { return; }
      if (h.length) hits.push([h[0].point.y, m.name || m.type, (mat.transparent || mat.opacity < 1 || mat.blending !== THREE.NormalBlending) ? 't' : 'o']); });
    hits.sort(function (a, b) { return b[0] - a[0]; });
    /* the floor: the highest opaque surface within 2.5 cm of her soles (a stool's foot or a kerb beside her stands on the floor and is not it); what lies over it is listed */ var op = hits.filter(function (h) { return h[2] === 'o' && Math.abs(h[0] - wy) <= 0.021; })[0], tr = hits.filter(function (h) { return h[2] === 't' || (h[2] === 'o' && h[0] > wy + 0.021); })[0];
    return JSON.stringify({ x: +L[0].toFixed(1), z: +L[1].toFixed(1), y: +(wy - TK.y).toFixed(3), zone: TC.zone || '', d_cm: op ? +((wy - op[0]) * 120).toFixed(2) : null, floor: op ? op[1] : '-', over_cm: tr ? +((tr[0] - wy) * 120).toFixed(2) : null, overName: tr ? tr[1] : '' });
  } + ')';
  let names = JSON.parse(await ev("JSON.stringify(Object.keys(TK.T.spots).filter(function (k) { var s = TK.T.spots[k]; return Array.isArray(s) && typeof s[0] === 'number' && typeof s[1] === 'number'; }))"));
  /* besides the named places: the game's own starting place (a platform), the lawns, the old town's setts, Hohe Straße, the square by the museum */
  const EXTRA = { '@start': null, '@lawn': [220, 60], '@setts': [20, 130], '@hohe': [-54, 120], '@roncalli': [30, 70], '@boell': [140, 12], '@domplatteW': [-90, 10], '@domAisleN': [-20, -15.6], '@domAisleS': [-20, 15.6] };
  let all = Object.keys(EXTRA).concat(names); if (ONLY.length) all = all.filter(n => ONLY.includes(n)); /* FEET_FROM=name: go on from that place (a long run cut short) */ if (process.env.FEET_FROM && all.includes(process.env.FEET_FROM)) all = all.slice(all.indexOf(process.env.FEET_FROM));
  let bad = 0, n = 0; const rows = [];
  for (const k of all) {
    if (k !== '@start') { const at = k[0] === '@' ? JSON.stringify(EXTRA[k]) : '[TK.T.spots[' + JSON.stringify(k) + '][0], TK.T.spots[' + JSON.stringify(k) + '][1]]'; const a = await ev("(function(){ try { ISLE_k.arrive('direct', " + at + "); snapCam(); return 'ok'; } catch (e) { return 'ERR ' + e.message; } })()"); if (String(a).startsWith('ERR')) { console.log(k, a); continue; } }
    /* she settles onto a floor over some frames (a step up or down is eased): wait until her height stands still */ let y0 = null; for (let t = 0; t < 12; t++) { await steps(4); const y1 = +(await ev('luna.root.position.y')); if (y0 != null && Math.abs(y1 - y0) < 2e-5) break; y0 = y1; }
    const m = await ev(MEASURE + "('mira')"); let o; try { o = JSON.parse(m); } catch (e) { console.log(k, 'FAILED', String(m).slice(0, 160)); continue; }
    const f = o.d_cm == null ? 'no floor seen' : Math.abs(o.d_cm) > TOL ? (o.d_cm < 0 ? 'SUNK' : 'FLOATS') : 'ok'; if (f !== 'ok') bad++; n++;
    rows.push([k, o, f]); console.log((f === 'ok' ? '  ' : '! ') + k.padEnd(16), JSON.stringify(o), f);
  }
  console.log('places', n, 'faults', bad, 'tolerance', TOL, 'cm', 'page errors', errs.length, errs.slice(0, 3).join(' | '));
  await b.close(); process.exit(bad ? 1 : 0);
})();
