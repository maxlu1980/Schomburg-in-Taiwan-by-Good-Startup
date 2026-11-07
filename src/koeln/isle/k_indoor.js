  /* ===== ISLE part K7 (Köln): under a roof the weather stays outside. No rain falls inside the station hall and its platforms, the bar,
     the shops or under the bridge approach: with the camera under a roof the rain is not drawn at all, and from outside the drops stop at
     the roof's edge (each drop is tested against the covered areas in the shader). Indoors the rain is heard muffled, its haze clears
     and the floors stay dry. ===== */
  var KIND = { k: 0, set: false, n: 0 };
  function kindIn(x, y, z) { if (!TK || TK.id !== 'koeln' || !TK.T || !inTK(x, z)) return false; var T = TK.T, l = T.toL(x, z), yr = y - TK.y;
    return (TKM.isOut ? !TKM.isOut(T, l[0], l[1], yr) : false) || !!(T.inStFn && T.inStFn(l[0], l[1], yr)); }
  /* the covered areas as convex quads (world x, z) with the height of their roof, for the rain's shader */
  function kindRoofs() { var T = TK.T, R = [], w; if (T.HBR && T.HBR.length >= 4) { w = T.HBR.slice(0, 4).map(function (p) { var q = T.toW(p[0], 0, p[1]); return [q.x, q.z]; }); R.push([w, TK.y + 25]); }
    if (T.FOOT != null) { w = [[252, -12.4], [628, -12.4], [628, 12.4], [252, 12.4]].map(function (p) { var q = T.toW(p[0], 0, p[1]); return [q.x, q.z]; }); R.push([w, TK.y + T.FOOT - 0.6]); }
    /* (V67) the cathedral, entered: its nave and choir, its transept, its west towers' halls, its apse */ var Dm = T.DOM; if (Dm && Dm.xW != null) [[Dm.xW, Dm.ch[1], -Dm.zA, Dm.zA], [Dm.tr[0], Dm.tr[1], -Dm.zTw, Dm.zTw], [Dm.xW, Dm.tw[1], -23, 23], [Dm.ch[1], Dm.ch[1] + 19.2, -18.6, 18.6]].forEach(function (q) { w = [[q[0], q[2]], [q[1], q[2]], [q[1], q[3]], [q[0], q[3]]].map(function (p) { var o = T.toW(p[0], 0, p[1]); return [o.x, o.z]; }); R.push([w, TK.y + 50]); }); return R; }
  function kindQuad(x, z, q) { var sg = 0, i; for (i = 0; i < 4; i++) { var a = q[i], b = q[(i + 1) % 4], c = (b[0] - a[0]) * (z - a[1]) - (b[1] - a[1]) * (x - a[0]); if (c > 0) sg |= 1; else if (c < 0) sg |= 2; } return sg !== 3; }
  function kinShader() { var m = W.rain && W.rain.material; if (!m || m.userData.kin) return m; var vs = m.vertexShader, fs = m.fragmentShader, anchor = 'vec3 p = vec3(uC.x + a.x * uBox, uC.y - 3.0 + y, uC.z + a.y * uBox);';
    if (vs.indexOf(anchor) < 0 || fs.indexOf('uA * (0.35 + 0.65 * vE)') < 0) { m.userData.kin = 'skip'; return m; }
    m.uniforms.uRN = { value: 0 }; m.uniforms.uRA = { value: [0, 1, 2, 3, 4, 5].map(function () { return new THREE.Vector4(); }) }; m.uniforms.uRB = { value: [0, 1, 2, 3, 4, 5].map(function () { return new THREE.Vector4(); }) }; m.uniforms.uRY = { value: [0, 0, 0, 0, 0, 0] };
    m.vertexShader = vs.replace('varying float vE;', 'varying float vE; varying float vK; uniform int uRN; uniform vec4 uRA[6]; uniform vec4 uRB[6]; uniform float uRY[6]; float kS(vec2 p, vec2 a, vec2 b) { return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x); } float kQ(vec2 p, vec4 A, vec4 B) { float s0 = kS(p, A.xy, A.zw), s1 = kS(p, A.zw, B.xy), s2 = kS(p, B.xy, B.zw), s3 = kS(p, B.zw, A.xy); return ((s0 >= 0.0 && s1 >= 0.0 && s2 >= 0.0 && s3 >= 0.0) || (s0 <= 0.0 && s1 <= 0.0 && s2 <= 0.0 && s3 <= 0.0)) ? 1.0 : 0.0; }')
      .replace(anchor, anchor + ' vK = 1.0; for (int i = 0; i < 6; i++) { if (i >= uRN) break; if (p.y < uRY[i] && kQ(p.xz, uRA[i], uRB[i]) > 0.5) vK = 0.0; }');
    m.fragmentShader = fs.replace('varying float vE;', 'varying float vE; varying float vK;').replace('uA * (0.35 + 0.65 * vE)', 'uA * (0.35 + 0.65 * vE) * vK'); m.needsUpdate = true; m.userData.kin = 'on'; return m; }
  /* the world is built after these parts run: the rain's hook is put in on the first frame that has it */
  function kindInstall() { if (typeof W === 'undefined' || !W || !W.rainTick || W.rainTick.kin) return; var _r = W.rainTick; W.rainTick = function (cp) { _r(cp); try { kindTick(cp); } catch (e) { if (window.ISLE_TEST) throw e; } }; W.rainTick.kin = true; }
  var _extraTickKin = extraTick; extraTick = function (dt, ts) { _extraTickKin(dt, ts); kindInstall(); };
  function kindTick(cp) { var inC = kindIn(cp.x, cp.y, cp.z), dt = 1 / 60; KIND.k += ((inC ? 1 : 0) - KIND.k) * Math.min(1, dt * 6); KIND.cam = inC;
    if (!TK || TK.id !== 'koeln') { if (W.rain && W.rain.material && W.rain.material.uniforms.uRN) W.rain.material.uniforms.uRN.value = 0; return; }
    var m = W.rain ? kinShader() : null, sh = !!(m && m.userData.kin === 'on'), inQ = false;
    if (sh && (!KIND.set || KIND.tk !== TK.T)) { var R = KIND.R = kindRoofs(), u = m.uniforms; R.forEach(function (r, i) { var q = r[0]; u.uRA.value[i].set(q[0][0], q[0][1], q[1][0], q[1][1]); u.uRB.value[i].set(q[2][0], q[2][1], q[3][0], q[3][1]); u.uRY.value[i] = r[1]; }); u.uRN.value = Math.min(6, R.length); KIND.set = true; KIND.tk = TK.T; }
    /* in the station hall the shader keeps the rain outside (so it still falls beyond the doors); in a closed room it is not drawn */
    if (sh && inC && KIND.R) KIND.R.forEach(function (r) { if (cp.y < r[1] && kindQuad(cp.x, cp.z, r[0])) inQ = true; });
    /* she is in a closed room (the bar, a shop) and the camera close by: no rain either */ var pIn = !inC && typeof pos !== 'undefined' && kindIn(pos.x, pos.y + 1, pos.z) && Math.hypot(cp.x - pos.x, cp.z - pos.z) < 9, pQ = false; if (pIn && KIND.R) KIND.R.forEach(function (r) { if (pos.y < r[1] && kindQuad(pos.x, pos.z, r[0])) pQ = true; });
    if (W.rain && W.rain.visible && ((inC && !inQ) || (pIn && !pQ))) W.rain.visible = false;
    /* indoors: the rain's haze lifts, the floors are dry */ var k = KIND.k; if (k > 0.01) { if (W.fog) { W.fog.far += (Math.max(W.fog.far, 1100) - W.fog.far) * k; W.fog.near += (Math.max(W.fog.near, 140) - W.fog.near) * k; }
      /* (V72) with the shelter map each floor knows for itself whether it is under a roof; only without it the camera's place decides */ if (!(typeof KRTX !== 'undefined' && KRTX.occOk) && typeof KIT !== 'undefined' && KIT.U && KIT.U.uWet) KIT.U.uWet.value *= 1 - 0.92 * k; } }
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.indoor = function () { var m = W.rain && W.rain.material; return { cam: !!KIND.cam, k: Math.round(KIND.k * 100) / 100, rain: !!(W.rain && W.rain.visible), shader: m && m.userData.kin, roofs: m && m.uniforms.uRN ? m.uniforms.uRN.value : 0, wet: typeof KIT !== 'undefined' && KIT.U ? KIT.U.uWet.value : null, fog: W.fog ? [Math.round(W.fog.near), Math.round(W.fog.far)] : null }; };
