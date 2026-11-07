/* ===== [luna.js] ===== */
/* ===== LUNA — the characters of the island, modelled in code =====
   ルナちゃん (ケミカルナ), the original character of AUTO CHEMICAL INDUSTRY CO., LTD., built to the proportions of the brand's own key
   art: about 4.2 heads tall, the white helmet with the dark band, the dark ear cups and the orange A, orange twin tails falling in waves to
   the hips with a teal layer underneath, large amber eyes, the dark turtleneck, the orange suit with the dark chevron on the chest, the open
   white lab coat to the hips, and the long dark boots that flare towards the ground under the pointed edges of the suit. Cel-shaded in
   three soft tones with a thin ink line and a rim light, textures drawn on canvases for the crisp edges of the drawing (the chevron, the
   suit's points, the face, the hair's highlight), and a rig for walking, running, waving, the sky-dive, riding, driving, sitting, the
   attack, the dodge and the joys of the board game. The same builder dresses the people of the island: site masters, station staff, the
   diner's master, the shrine keeper. Units: the island's units; Luna stands 1.32 tall, facing +z. */
var LUNA = (function () {
  var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
  function curvedAll(o) { if (typeof KIT !== 'undefined') o.traverse(function (x) { if (x.material) [].concat(x.material).forEach(KIT.curved); }); }
  /* ---------- shading: three soft tones, a rim light and an ink line ---------- */
  var GRAD = null;
  function grad() { if (GRAD) return GRAD; var d = new Uint8Array([150, 150, 150, 255, 205, 205, 205, 255, 255, 255, 255, 255]); GRAD = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); GRAD.minFilter = GRAD.magFilter = THREE.NearestFilter; GRAD.generateMipmaps = false; GRAD.needsUpdate = true; return GRAD; }
  function rimHook(m, k) { if (typeof KIT === 'undefined') return m; return KIT.rim(m, 0xfff4e6, 2.6, k == null ? 0.28 : k); }
  function toon(hex, o) { o = o || {}; var m = new THREE.MeshToonMaterial({ color: hex, gradientMap: grad() }); if (o.map) m.map = o.map; if (o.side) m.side = o.side; if (o.vc) m.vertexColors = true; if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei || 1; } if (o.transparent) { m.transparent = true; m.alphaTest = o.alphaTest || 0; } if (o.po) { m.polygonOffset = true; m.polygonOffsetFactor = -2; m.polygonOffsetUnits = -2; } if (o.rim !== false) rimHook(m, o.rim); if (o.ll !== false && typeof KIT !== 'undefined' && KIT.llights) KIT.llights(m); return m; }
  var INK = {};
  function ink(w) { var m = new THREE.MeshBasicMaterial({ color: 0x2b2420, side: THREE.BackSide }); m.userData.w = w || 0.005;
    m.onBeforeCompile = function (s) { s.uniforms.uInk = { value: m.userData.w }; s.vertexShader = 'uniform float uInk;\n' + s.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = vec3( position ) + normalize( normal ) * uInk;'); };
    m.customProgramCacheKey = function () { return 'ink' + m.userData.w; }; return m; }
  function inkOf(w) { var k = String(w || 0.005); return INK[k] || (INK[k] = ink(w)); }
  function mesh(geo, mat, o) { o = o || {}; var g = new THREE.Group(), m = new THREE.Mesh(geo, mat); m.castShadow = o.shadow !== false; m.receiveShadow = !!o.receive; g.add(m); if (o.ink !== false) { var h = new THREE.Mesh(geo, inkOf(o.ink)); h.renderOrder = -1; h.userData.ink = true; h.castShadow = false; g.add(h); } g.userData.main = m; return g; }

  /* ---------- geometry helpers ---------- */
  function taper(curve, seg, rad, rFn, o) { /* a tube along a curve with its radius profile r(t), flattening, a reference "up" and colours or uv */
    o = o || {}; var fr = curve.computeFrenetFrames(seg, false), pos = [], nor = [], col = [], uvs = [], idx = [], i, j, P = new THREE.Vector3(), N = new THREE.Vector3(), c = new THREE.Color();
    var up = o.up || null, T = new THREE.Vector3(), nn = new THREE.Vector3(), bb = new THREE.Vector3();
    for (i = 0; i <= seg; i++) { var t = i / seg; curve.getPointAt(t, P); var r = rFn(t), n = fr.normals[i], b = fr.binormals[i];
      if (up) { curve.getTangentAt(t, T); bb.copy(T).cross(typeof up === 'function' ? up(t, P) : up).normalize(); nn.copy(bb).cross(T).normalize(); n = nn; b = bb; }
      if (o.tOut) for (j = 0; j <= rad; j++) o.tOut.push(t); for (j = 0; j <= rad; j++) { var a = j / rad * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a) * (o.flat || 1); N.set(ca * n.x + sa * b.x, ca * n.y + sa * b.y, ca * n.z + sa * b.z); pos.push(P.x + N.x * r, P.y + N.y * r, P.z + N.z * r); N.normalize(); nor.push(N.x, N.y, N.z); if (o.color) { o.color(t, a, c, N); col.push(c.r, c.g, c.b); } uvs.push(j / rad, t); } }
    for (i = 0; i < seg; i++) for (j = 0; j < rad; j++) { var a1 = i * (rad + 1) + j, b1 = (i + 1) * (rad + 1) + j; idx.push(a1, a1 + 1, b1, b1, a1 + 1, b1 + 1); }
    if (o.tOut) o.tOut.push(1, 0); var tip = pos.length / 3; curve.getPointAt(1, P); pos.push(P.x, P.y, P.z); var tg = curve.getTangentAt(1); nor.push(tg.x, tg.y, tg.z); uvs.push(0.5, 1); if (o.color) { o.color(1, 0, c, tg); col.push(c.r, c.g, c.b); } for (j = 0; j < rad; j++) idx.push(seg * (rad + 1) + j, seg * (rad + 1) + j + 1, tip);
    var root0 = pos.length / 3; curve.getPointAt(0, P); pos.push(P.x, P.y, P.z); var tg0 = curve.getTangentAt(0); nor.push(-tg0.x, -tg0.y, -tg0.z); uvs.push(0.5, 0); if (o.color) { o.color(0, 0, c, tg0); col.push(c.r, c.g, c.b); } for (j = 0; j < rad; j++) idx.push(j + 1, j, root0);
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); if (o.color) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); return g; }
  function lathe(pts, seg, o) { /* a lathe whose faces always point outwards: a profile given top-down is reversed (v still runs from the first point) */ o = o || {}; var down = pts.length > 1 && pts[0][1] > pts[pts.length - 1][1], q = down ? pts.slice().reverse() : pts;
    var g = new THREE.LatheGeometry(q.map(function (p) { return new THREE.Vector2(Math.max(0.00001, p[0]), p[1]); }), seg || 32, o.start == null ? 0 : o.start, o.len || Math.PI * 2); if (down) { var uv = g.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i)); } g.computeVertexNormals(); return g; }
  function smoothProfile(pts, n) { var cv = new THREE.SplineCurve(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); })), out = [], i; for (i = 0; i <= n; i++) { var q = cv.getPoint(i / n); out.push([q.x, q.y]); } return out; }
  function rbox(w, h, d, r, s) { var g = new THREE.BoxGeometry(w, h, d, s || 4, s || 4, s || 4), p = g.attributes.position, v = new THREE.Vector3(), q = new THREE.Vector3(), i, hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
    for (i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); q.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z))); v.sub(q); if (v.lengthSq() > 1e-9) v.setLength(r); v.add(q); p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; }
  function blob(rx, ry, rz, s) { var g = new THREE.SphereGeometry(1, s || 24, Math.round((s || 24) * 0.75)); g.scale(rx, ry, rz); return g; }
  function merge(list) { /* [geometry, matrix, colour hex] → one geometry with vertex colours */ var P = [], N = [], C = [], c = new THREE.Color(), nm = new THREE.Matrix3();
    list.forEach(function (it) { var g = it[0].index ? it[0].toNonIndexed() : it[0], m = it[1] || new THREE.Matrix4(); nm.getNormalMatrix(m); c.set(it[2] == null ? 0xffffff : it[2]); var pa = g.attributes.position, na = g.attributes.normal, ca = it[3] ? g.attributes.color : null, v = new THREE.Vector3(), n = new THREE.Vector3(), i; for (i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); n.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); P.push(v.x, v.y, v.z); N.push(n.x, n.y, n.z); if (ca) C.push(c.r * ca.getX(i), c.g * ca.getY(i), c.b * ca.getZ(i)); else C.push(c.r, c.g, c.b); } });
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); return g; }
  function M4(p, r, s) { var m = new THREE.Matrix4(); m.compose(V(p[0], p[1], p[2]), new THREE.Quaternion().setFromEuler(new THREE.Euler(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0)), typeof s === 'number' ? V(s, s, s) : s ? V(s[0], s[1], s[2]) : V(1, 1, 1)); return m; }
  function ctex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; }
  function hex(c) { return '#' + ('000000' + c.toString(16)).slice(-6); }

  /* ---------- the face: drawn in the head's own units on a canvas, projected straight onto the front of the head ----------
     The canvas covers x −0.12…0.12, y −0.16…0.08 of the head (before its scale); the face is a decal on the head's own surface,
     so the drawing is undistorted from the front and turns with the head's curvature from the side. */
  var FX0 = -0.12, FW = 0.24, FY1 = 0.08, FH = 0.24, FN = 1024;
  function faceCanvas(kind, o) {
    o = o || {}; var N = o.fn || FN, c = document.createElement('canvas'); c.width = N; c.height = N; var g = c.getContext('2d'), S = N / FW;
    function X(x) { return (x - FX0) * S; } function Y(y) { return (FY1 - y) * S; }
    if (o.draw) { o.draw(g, kind, X, Y, S); return c; } /* a face of its own (the Good Startup owner) */
    var ex = o.eyeX || 0.0435, ey = o.eyeY || -0.026, ew = (o.ew || 0.0255) * S, eh = (o.eh || 0.031) * S, iris = o.iris || ['#3b1806', '#9c4a0c', '#e8841a', '#ffc861'], lash = o.lash || '#2b160e', lw = (o.lashW || 0.0046) * S;
    function lid(gg, k) { /* the upper lid, from the inner corner over the top to the outer corner; k lowers it (0 open … 1 closed) */
      gg.moveTo(-ew * 0.98, eh * 0.06); gg.bezierCurveTo(-ew * 0.92, -eh * (0.92 - k * 0.9), ew * 0.4, -eh * (1.1 - k * 1.05), ew * 1.02, -eh * (0.36 - k * 0.4)); }
    function eye(cx, flip) {
      g.save(); g.translate(X(cx), Y(ey)); g.scale(flip, 1);
      if (kind === 'happy' || kind === 'closed') { /* closed: the lid line with its lashes; happy: an arch ∩ */ g.strokeStyle = lash; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = lw * 1.05; g.beginPath();
        if (kind === 'happy') { g.moveTo(-ew * 0.9, eh * 0.28); g.quadraticCurveTo(0, -eh * 0.62, ew * 0.95, eh * 0.22); g.stroke(); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(ew * 0.9, eh * 0.18); g.lineTo(ew * 1.18, eh * 0.02); g.stroke(); }
        else { g.moveTo(-ew * 0.95, eh * 0.1); g.quadraticCurveTo(0, eh * 0.52, ew * 0.98, eh * 0.06); g.stroke(); g.lineWidth = lw * 0.55; [[0.6, 0.2], [0.9, 0.08], [1.12, -0.06]].forEach(function (q) { g.beginPath(); g.moveTo(ew * q[0], eh * q[1]); g.lineTo(ew * (q[0] + 0.16), eh * (q[1] + 0.2)); g.stroke(); }); }
        g.restore(); return; }
      if (kind === 'hurt') { g.strokeStyle = lash; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(-ew * 0.7, -eh * 0.4); g.lineTo(ew * 0.55, 0); g.lineTo(-ew * 0.7, eh * 0.4); g.stroke(); g.restore(); return; }
      var k = kind === 'half' ? 0.55 : kind === 'shout' ? 0.12 : 0, big = kind === 'wide' ? 1.06 : 1;
      /* the white of the eye, clipped by the lids */
      g.beginPath(); lid(g, k); g.bezierCurveTo(ew * 1.06, eh * 0.42, ew * 0.55, eh * 0.96, -ew * 0.08, eh * 0.93); g.bezierCurveTo(-ew * 0.6, eh * 0.88, -ew * 1.0, eh * 0.5, -ew * 0.98, eh * 0.06); g.closePath();
      g.save(); g.clip(); g.fillStyle = '#fffaf6'; g.fillRect(-ew * 1.3, -eh * 1.3, ew * 2.6, eh * 2.6);
      /* the iris: large, a warm amber gradient, a darker rim, the pupil, a crescent of light below, the lids' shadow, the highlights */
      var ix = ew * 0.06, iy = eh * 0.14, rx = ew * 0.8 * big, ry = eh * 0.88 * big, gr = g.createLinearGradient(0, iy - ry, 0, iy + ry);
      gr.addColorStop(0, iris[0]); gr.addColorStop(0.32, iris[1]); gr.addColorStop(0.68, iris[2]); gr.addColorStop(1, iris[3]); g.fillStyle = gr; g.beginPath(); g.ellipse(ix, iy, rx, ry, 0, 0, Math.PI * 2); g.fill();
      var rg = g.createRadialGradient(ix, iy + ry * 0.45, ry * 0.05, ix, iy + ry * 0.45, ry * 0.75); rg.addColorStop(0, o.cute ? 'rgba(170,232,255,.6)' : 'rgba(255,236,170,.55)'); rg.addColorStop(1, o.cute ? 'rgba(170,232,255,0)' : 'rgba(255,236,170,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(ix, iy, rx, ry, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = o.cute ? 'rgba(8,30,80,.4)' : 'rgba(90,40,10,.55)'; g.lineWidth = rx * 0.05; for (var r0 = 0; r0 < 14; r0++) { var a0 = r0 / 14 * Math.PI * 2; g.beginPath(); g.moveTo(ix + Math.cos(a0) * rx * 0.42, iy + Math.sin(a0) * ry * 0.42); g.lineTo(ix + Math.cos(a0) * rx * 0.78, iy + Math.sin(a0) * ry * 0.78); g.stroke(); }
      g.fillStyle = o.cute ? 'rgba(4,10,30,.95)' : 'rgba(32,12,2,.92)'; g.beginPath(); g.ellipse(ix + ew * 0.02, iy - eh * 0.02, rx * (kind === 'wide' ? 0.3 : 0.38), ry * (kind === 'wide' ? 0.34 : 0.42), 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = o.cute ? 'rgba(6,20,56,.88)' : 'rgba(70,28,6,.85)'; g.lineWidth = rx * 0.07; g.beginPath(); g.ellipse(ix, iy, rx * 0.97, ry * 0.97, 0, 0, Math.PI * 2); g.stroke();
      var sh = g.createLinearGradient(0, -eh * 1.05, 0, -eh * 0.2); sh.addColorStop(0, o.cute ? 'rgba(30,26,60,.5)' : 'rgba(70,24,10,.55)'); sh.addColorStop(1, o.cute ? 'rgba(30,26,60,0)' : 'rgba(70,24,10,0)'); g.fillStyle = sh; g.fillRect(-ew * 1.3, -eh * 1.3, ew * 2.6, eh * 1.2);
      g.fillStyle = 'rgba(255,255,255,.97)'; g.beginPath(); g.ellipse(ix - rx * 0.36, iy - ry * 0.4, rx * 0.3, ry * 0.24, -0.45, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(ix + rx * 0.42, iy + ry * 0.42, rx * 0.13, 0, Math.PI * 2); g.fill(); g.globalAlpha = 0.7; g.beginPath(); g.arc(ix - rx * 0.05, iy + ry * 0.6, rx * 0.07, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
      if (o.cute) { /* (V70) a sparkle (a four-point star) high in the iris, and the sky's light glowing in its lower half */ var lg2 = g.createRadialGradient(ix, iy + ry * 0.55, 0, ix, iy + ry * 0.55, rx * 0.75); lg2.addColorStop(0, 'rgba(205,242,255,.5)'); lg2.addColorStop(1, 'rgba(205,242,255,0)'); g.fillStyle = lg2; g.beginPath(); g.ellipse(ix, iy + ry * 0.5, rx * 0.66, ry * 0.38, 0, 0, Math.PI * 2); g.fill();
        g.save(); g.translate(ix + rx * 0.4, iy - ry * 0.5); var sr = rx * 0.22; g.fillStyle = 'rgba(255,255,255,.97)'; g.beginPath(); g.moveTo(0, -sr); g.quadraticCurveTo(sr * 0.12, -sr * 0.12, sr, 0); g.quadraticCurveTo(sr * 0.12, sr * 0.12, 0, sr); g.quadraticCurveTo(-sr * 0.12, sr * 0.12, -sr, 0); g.quadraticCurveTo(-sr * 0.12, -sr * 0.12, 0, -sr); g.fill(); g.restore();
        g.fillStyle = 'rgba(255,255,255,.98)'; g.beginPath(); g.ellipse(ix - rx * 0.34, iy - ry * 0.38, rx * 0.34, ry * 0.27, -0.45, 0, Math.PI * 2); g.fill(); }
      g.restore();
      /* the upper lash: thin at the inner corner, thick over the top, a wing and two lashes at the outer corner */
      g.fillStyle = lash; g.beginPath(); lid(g, k); g.lineTo(ew * 1.32, -eh * (0.5 - k * 0.4)); g.lineTo(ew * 1.2, -eh * (0.26 - k * 0.38)); g.lineTo(ew * 1.06, -eh * (0.12 - k * 0.38));
      g.bezierCurveTo(ew * 0.45, -eh * (0.98 - k * 1.05) + lw * 1.15, -ew * 0.88, -eh * (0.86 - k * 0.9) + lw * 0.95, -ew * 0.98, eh * 0.06); g.fill();
      g.strokeStyle = lash; g.lineCap = 'round'; g.lineWidth = lw * 0.42; [[0.82, -0.58, 1.08, -0.82], [0.98, -0.42, 1.3, -0.6]].forEach(function (q) { g.beginPath(); g.moveTo(ew * q[0], eh * (q[1] + k * 0.45)); g.quadraticCurveTo(ew * (q[0] + 0.18), eh * (q[1] - 0.12 + k * 0.45), ew * q[2], eh * (q[3] + k * 0.45)); g.stroke(); });
      /* the crease above, the lower lash at the outer corner */
      g.strokeStyle = 'rgba(120,60,40,.45)'; g.lineWidth = lw * 0.28; g.beginPath(); g.moveTo(-ew * 0.35, -eh * 1.18); g.quadraticCurveTo(ew * 0.45, -eh * 1.3, ew * 0.98, -eh * 0.78); g.stroke();
      g.strokeStyle = 'rgba(80,40,26,.7)'; g.lineWidth = lw * 0.3; g.beginPath(); g.moveTo(ew * 0.98, eh * 0.4); g.quadraticCurveTo(ew * 0.6, eh * 1.02, ew * 0.02, eh * 0.97); g.stroke();
      g.restore(); }
    if (kind === 'wink') { kind = 'happy'; eye(-ex, -1); kind = 'open'; eye(ex, 1); kind = 'wink'; } else { eye(-ex, -1); eye(ex, 1); }
    /* the brows: fine arcs, lifted when wide, knit when shouting */ if (o.brows !== false) { g.strokeStyle = o.brow || '#c0641c'; g.lineCap = 'round'; g.lineWidth = (o.male ? 0.0031 : 0.0019) * S; [-1, 1].forEach(function (sd) { var by = ey + (o.eh || 0.031) + 0.017 + (kind === 'wide' ? 0.006 : 0), yi = by + (kind === 'shout' ? -0.005 : kind === 'hurt' ? 0.004 : 0); g.beginPath(); g.moveTo(X(sd * (ex - 0.016)), Y(yi)); g.quadraticCurveTo(X(sd * (ex + 0.004)), Y(by + (o.male ? 0.003 : 0.006)), X(sd * (ex + 0.026)), Y(by - (o.male ? 0.006 : 0.004))); g.stroke(); }); }
    /* freckles over the nose and the cheeks */ if (o.freckles) { [-1, 1].forEach(function (sd) { [[0.004, -0.031], [0.011, -0.035], [0.018, -0.032], [0.008, -0.04], [0.015, -0.042], [0.022, -0.038], [0.026, -0.034]].forEach(function (q, i) { g.fillStyle = 'rgba(176,106,70,' + (0.38 + (i % 3) * 0.08) + ')'; g.beginPath(); g.arc(X(sd * (ex - 0.016 + q[0])), Y(ey + q[1] + 0.012), (0.0009 + (i % 2) * 0.0003) * S, 0, 7); g.fill(); }); }); }
    /* the cheeks */ [-1, 1].forEach(function (sd) { var bx = X(sd * (ex + (o.cute ? 0.012 : 0.008))), by = Y(ey - (o.cute ? 0.046 : 0.036)), bl = g.createRadialGradient(bx, by, 0, bx, by, 0.017 * S); bl.addColorStop(0, o.cute ? 'rgba(255,118,128,.56)' : 'rgba(255,128,118,.42)'); bl.addColorStop(1, o.cute ? 'rgba(255,118,128,0)' : 'rgba(255,128,118,0)'); g.save(); g.translate(bx, by); g.scale(1.45, 0.62); g.translate(-bx, -by); g.fillStyle = bl; g.beginPath(); g.arc(bx, by, 0.017 * S, 0, Math.PI * 2); g.fill(); g.restore();
      if (o.cute) { g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(bx - sd * 0.0045 * S, by - 0.0042 * S, 0.003 * S, 0.0016 * S, 0, 0, Math.PI * 2); g.fill(); }
      if (o.blushLines !== false) { g.strokeStyle = 'rgba(232,110,100,.5)'; g.lineWidth = 0.0009 * S; for (var q = -1; q <= 1; q++) { g.beginPath(); g.moveTo(bx + q * 0.0048 * S - 0.002 * S, by + 0.0028 * S); g.lineTo(bx + q * 0.0048 * S + 0.0016 * S, by - 0.0028 * S); g.stroke(); } } });
    /* the nose: a touch of shadow; the mouth */ g.strokeStyle = 'rgba(196,118,96,.7)'; g.lineWidth = 0.0012 * S; g.lineCap = 'round'; g.beginPath(); g.moveTo(X(0.0015), Y(-0.058)); g.lineTo(X(-0.001), Y(-0.0625)); g.stroke();
    var my = -0.0795, mc = '#8f3426'; g.strokeStyle = mc; g.lineWidth = 0.0016 * S;
    if (kind === 'happy' || kind === 'wink' || kind === 'wide' || kind === 'shout' || o.mouth === 'open') { var mw = kind === 'shout' ? 0.011 : 0.0095, md = kind === 'shout' ? 0.016 : kind === 'wide' ? 0.008 : 0.0105; g.fillStyle = '#7e2a1e'; g.beginPath(); g.moveTo(X(-mw), Y(my + 0.001)); g.quadraticCurveTo(X(0), Y(my - md * 1.6), X(mw), Y(my + 0.001)); g.quadraticCurveTo(X(0), Y(my + 0.002), X(-mw), Y(my + 0.001)); g.fill(); g.fillStyle = '#ef8a86'; g.beginPath(); g.ellipse(X(0), Y(my - md * 0.95), mw * 0.48 * S, md * 0.38 * S, 0, 0, Math.PI * 2); g.fill(); if (kind !== 'wide') { g.fillStyle = '#ffffff'; g.fillRect(X(-mw * 0.62), Y(my + 0.0008), mw * 1.24 * S, 0.0016 * S); } }
    else if (kind === 'hurt') { g.beginPath(); g.moveTo(X(-0.008), Y(my - 0.002)); g.quadraticCurveTo(X(-0.004), Y(my + 0.003), X(0), Y(my - 0.001)); g.quadraticCurveTo(X(0.004), Y(my - 0.005), X(0.008), Y(my)); g.stroke(); }
    else if (o.cute) { /* (V70) a soft smile, the corners turned up, a touch of colour */ g.fillStyle = 'rgba(222,104,104,.5)'; g.beginPath(); g.moveTo(X(-0.0068), Y(my + 0.0016)); g.quadraticCurveTo(X(0), Y(my - 0.0064), X(0.0068), Y(my + 0.0016)); g.quadraticCurveTo(X(0), Y(my - 0.0016), X(-0.0068), Y(my + 0.0016)); g.fill();
      g.strokeStyle = '#9a3a2c'; g.lineWidth = 0.0015 * S; g.beginPath(); g.moveTo(X(-0.0074), Y(my + 0.0022)); g.quadraticCurveTo(X(0), Y(my - 0.006), X(0.0074), Y(my + 0.0022)); g.stroke(); g.lineWidth = 0.0011 * S; [-1, 1].forEach(function (sd) { g.beginPath(); g.moveTo(X(sd * 0.0074), Y(my + 0.0022)); g.lineTo(X(sd * 0.0085), Y(my + 0.0035)); g.stroke(); }); }
    else { g.beginPath(); g.moveTo(X(-0.0065), Y(my + 0.0012)); g.quadraticCurveTo(X(0), Y(my - 0.0042), X(0.0065), Y(my + 0.0012)); g.stroke(); }
    return c; }
  var FACE_CACHE = {};
  function faceTex(kind, key, o) { var k = key + kind; if (FACE_CACHE[k]) return FACE_CACHE[k]; var t = new THREE.CanvasTexture(faceCanvas(kind, o)); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return (FACE_CACHE[k] = t); }
  /* the face decal: the front triangles of the head's own geometry, with the canvas projected along z */
  function faceDecal(geo) { var pa = geo.attributes.position, n = pa.count, uv = new Float32Array(n * 2), i, idx = geo.index.array, keep = [];
    for (i = 0; i < n; i++) { uv[i * 2] = (pa.getX(i) - FX0) / FW; uv[i * 2 + 1] = 1 - (FY1 - pa.getY(i)) / FH; }
    for (i = 0; i < idx.length; i += 3) { var a = idx[i], b = idx[i + 1], c = idx[i + 2], ok = true; [a, b, c].forEach(function (k) { var x = pa.getX(k), y = pa.getY(k), z = pa.getZ(k); if (z < 0.02 || x < FX0 || x > FX0 + FW || y < FY1 - FH || y > FY1) ok = false; }); if (ok) keep.push(a, b, c); }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', pa); g.setAttribute('normal', geo.attributes.normal); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(keep); return g; }
  function faceMat(map) { var m = new THREE.MeshToonMaterial({ map: map, gradientMap: grad(), transparent: true, alphaTest: 0.04, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }); m.emissive = new THREE.Color(0xffffff); m.emissiveMap = map; m.emissiveIntensity = 0.22; return m; }

  /* ---------- the emblem: the orange A of the brand, as a solid ---------- */
  function emblemGeo(s, depth) {
    var A = new THREE.Shape(); A.moveTo(-0.5, 0); A.lineTo(-0.08, 1.0); A.lineTo(0.08, 1.0); A.lineTo(0.5, 0); A.lineTo(0.3, 0); A.lineTo(0, 0.72); A.lineTo(-0.3, 0); A.lineTo(-0.5, 0);
    var bar = new THREE.Shape(); bar.moveTo(-0.3, 0.02); bar.lineTo(-0.14, 0.02); bar.lineTo(0.22, 0.5); bar.lineTo(0.1, 0.6); bar.lineTo(-0.3, 0.02);
    var g = new THREE.ExtrudeGeometry([A, bar], { depth: depth || 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2 }); g.translate(0, -0.5, 0); g.scale(s, s, s); g.computeVertexNormals(); return g; }

  /* ================= the palettes ================= */
  var PAL = {
    mira: { skin: 0xf7d6c4, suit: 0x666b5c, dark: 0x2b3a30, boot: 0x1c1c20, coat: 0x666b5c, helmet: 0x6a6f60, band: 0xd0101e, cup: 0x2b3a30, hair: 0xeebd55, hairHi: 0xfff2c4, streak: 0xc8953a, emblem: 0xe3000f, breech: 0x7a7d72, silver: 0xd2d5d8, pipe: 0xd0102a, leather: 0x5a3a26, button: 0xb5b8ad, visor: 0x151517 },
    luna: { skin: 0xf9d6c2, suit: 0xf39434, dark: 0x4e4848, boot: 0x5e5552, coat: 0xfbfaf6, helmet: 0xffffff, band: 0x4d4949, cup: 0x55504f, hair: 0xf28a2c, hairHi: 0xffbd6a, streak: 0x19a7b5, emblem: 0xef7a1d },
    worker: { skin: 0xf3d2bc, suit: 0x2b3550, dark: 0x1f2533, boot: 0x2a2a2e, coat: 0x2b3550, helmet: 0xffffff, band: 0xf07a12, cup: 0x2b3550, hair: 0x2c241f, hairHi: 0x4a3a30, streak: 0x2c241f, emblem: 0xf07a12, pants: 0x3a3f4a }
  };

  /* the head of the drawings: a round crown, the cheeks full, the jaw drawing in to a short soft chin, the face front a touch flatter */
  function animeSkull(R, su, sv) { var g = new THREE.SphereGeometry(1, su || 72, sv || 54), p = g.attributes.position, v = new THREE.Vector3(), i;
    for (i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); var x = v.x, y = v.y, z = v.z, fr = Math.max(0, z);
      if (y < 0.08) { var k = Math.min(1, (0.08 - y) / 1.08); x *= 1 - 0.42 * Math.pow(k, 1.45) * (0.5 + 0.5 * fr); if (z > 0) z = z * (1 - 0.06 * k) + 0.06 * k * k * fr; else z *= 1 - 0.24 * Math.pow(k, 1.2); y = y * (1 - 0.08 * k) - 0.035 * k * k * k * fr; }
      if (y < 0.02 && y > -0.8 && z > 0.2) x *= 1 + Math.sin(Math.min(1, -y / 0.8) * Math.PI) * 0.04 * Math.min(1, (z - 0.2) / 0.5);
      if (z > 0.6 && y < 0.35) z = 0.6 + (z - 0.6) * 0.8;
      p.setXYZ(i, x * R, y * R * 1.02, z * R * 0.985); }
    g.computeVertexNormals(); return g; }

  /* ================= Luna =================
     (v46) rebuilt to the brand's key art — the reel of auto_chemical, the original character ルナちゃん (ケミカルナ): the white helmet with
     the dark band low over the brows and the large dark ear cups, the orange A, the swept fringe with its tuft, the very large amber eyes,
     the dark turtleneck, the orange suit with the broad dark chevron, the open white lab coat with its pointed lapels, the suit's points
     running down the thighs, and the long dark boots that flare wide to the ground. The twin tails are bundles of strands — orange clumps over
     a teal inner strand — each on its own chain of bones, simulated with the air's drag as she walks and runs. The model's detail follows
     the quality level (LQ 0…3): the segments of every lathe, tube and sphere, the number of strands and bones, the face's resolution. */
  var LQ = 2, QS = [0.6, 0.8, 1, 1.6], QN = [2, 3, 4, 6], QB = [6, 7, 9, 12];
  function sg(n, mn) { return Math.max(mn || 6, Math.round(n * QS[LQ])); }
  function setQuality(q) { LQ = Math.max(0, Math.min(3, q | 0)); }
  /* ===== (V63) Mira in an officer's field uniform: helpers =====
     a point on a lathed surface (its profile [[r, y], …], scaled in z) at height y and angle th, lifted off it along the normal; a grid
     of such points as a mesh (its faces turned outwards); the cloth of the tunic drawn on a canvas */
  function surfR(prof, y) { var best = 0, i; for (i = 0; i < prof.length - 1; i++) { var a = prof[i], b = prof[i + 1], lo = Math.min(a[1], b[1]), hi = Math.max(a[1], b[1]); if (y >= lo && y <= hi && hi - lo > 1e-7) { var r = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); if (r > best) best = r; } } return best; }
  function surfP(prof, zs, y, th, off, out) { var r = surfR(prof, y), dr = (surfR(prof, y + 0.002) - surfR(prof, y - 0.002)) / 0.004, s = Math.sin(th), c = Math.cos(th), nx = s, ny = -dr, nz = c / zs, nl = Math.hypot(nx, ny, nz); out = out || new THREE.Vector3(); return out.set(r * s + nx / nl * off, y + ny / nl * off, zs * r * c + nz / nl * off); }
  function surfN(prof, zs, y, th, out) { var dr = (surfR(prof, y + 0.002) - surfR(prof, y - 0.002)) / 0.004, s = Math.sin(th), c = Math.cos(th); return (out || new THREE.Vector3()).set(s, -dr, c / zs).normalize(); }
  /* the top of a lathe (the shoulders): the height and the slope where its radius is rho, on the part above its widest ring */
  function surfTop(prof, rho) { var im = 0, i; for (i = 1; i < prof.length; i++) if (prof[i][0] > prof[im][0]) im = i; for (i = im; i < prof.length - 1; i++) { var a = prof[i], b = prof[i + 1]; if ((a[0] - rho) * (b[0] - rho) <= 0 && Math.abs(a[0] - b[0]) > 1e-7) { var f = (rho - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * f, (b[1] - a[1]) / (b[0] - a[0])]; } } return [prof[prof.length - 1][1], 0]; }
  function gridGeo(fn, nu, nv, o) { o = o || {}; var pos = [], uvs = [], col = [], idx = [], P = new THREE.Vector3(), c = new THREE.Color(), i, j;
    for (j = 0; j <= nv; j++) for (i = 0; i <= nu; i++) { var u = i / nu, v = j / nv; fn(u, v, P); pos.push(P.x, P.y, P.z); uvs.push(u, 1 - v); if (o.col) { o.col(u, v, c); col.push(c.r, c.g, c.b); } }
    for (j = 0; j < nv; j++) for (i = 0; i < nu; i++) { var a = j * (nu + 1) + i, b = a + 1, d = a + nu + 1, e = d + 1; idx.push(a, d, b, b, d, e); }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); if (col.length) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    if (o.out) { /* faces outwards: compare the middle vertex's normal with the wanted direction, flip the winding if they disagree */ var mi = Math.floor(nv / 2) * (nu + 1) + Math.floor(nu / 2), na = g.attributes.normal, want = o.out(0.5, 0.5); if (na.getX(mi) * want.x + na.getY(mi) * want.y + na.getZ(mi) * want.z < 0) { for (i = 0; i < idx.length; i += 3) { var t2 = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t2; } g.setIndex(idx); g.computeVertexNormals(); } }
    return g; }
  /* the field-grey cloth: a fine twill, the front opening with its placket, the side seams */
  function tunicTex(g, w, h, P) { g.fillStyle = hex(P.suit); g.fillRect(0, 0, w, h); var i, rnd = 1234; function R1() { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
    for (i = 0; i < w * h / 90; i++) { g.fillStyle = R1() < 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)'; g.fillRect(R1() * w, R1() * h, 1 + R1() * 2, 1); }
    g.strokeStyle = 'rgba(0,0,0,.06)'; g.lineWidth = 1; for (i = -h; i < w; i += 5) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(w * 0.488, 0, w * 0.024, h); g.strokeStyle = 'rgba(20,24,18,.55)'; g.lineWidth = Math.max(1, w / 420); g.beginPath(); g.moveTo(w * 0.5, h * 0.02); g.lineTo(w * 0.5, h); g.stroke();
    g.strokeStyle = 'rgba(20,24,18,.25)'; [0.25, 0.75].forEach(function (x) { g.beginPath(); g.moveTo(w * x, h * 0.12); g.lineTo(w * x, h); g.stroke(); });
    g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(0, h * 0.86, w, h * 0.14); }
  /* the riding breeches: the thigh swells out to the side (and a little to the front) above the knee, close again into the boot */
  function breech(g2, side) { var p = g2.attributes.position, i; for (i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z) || 1e-6, out = x * side / r, f = Math.max(0, z / r), u = Math.min(1, Math.max(0, (-y - 0.012) / 0.175)), b = Math.pow(Math.sin(u * Math.PI), 1.2) * (u < 0.62 ? 1 : 1 - Math.pow((u - 0.62) / 0.38, 1.6) * 0.15);
      var k = 1 + b * (0.07 + 0.5 * Math.max(0, out) + 0.1 * f); p.setX(i, x * k); p.setZ(i, z * (1 + b * (0.05 + 0.08 * f))); } g2.computeVertexNormals(); }
  /* the skirt of the tunic moves with the thighs under it, swings back in the air of her own speed and flares a little at a run */
  function skirtTick(A, dt) { var S = A.skirt; if (!S || dt <= 0) return; var p = S.g.attributes.position, R = S.rest, n = p.count, thL = A.legL.piv.rotation.x, thR = A.legR.piv.rotation.x, sp = A.spS || 0, run = Math.max(0, Math.min(1, (sp - 3) / 2.2)), i;
    S.sw += ((-sp * 0.045 - (A.mode === 'fall' ? 0.5 : 0)) - S.sw) * Math.min(1, dt * 7); S.fl += (run * 0.07 - S.fl) * Math.min(1, dt * 5); S.l += (thL - S.l) * Math.min(1, dt * 16); S.r += (thR - S.r) * Math.min(1, dt * 16);
    for (i = 0; i < n; i++) { var x = R[i * 3], y = R[i * 3 + 1], z = R[i * 3 + 2], d = Math.max(0, Math.min(1, (S.yb - y) / S.len)), w = Math.max(0, Math.min(1, 0.5 + x / S.wid)), th = (S.l * w + S.r * (1 - w)) * 0.55 * d + S.sw * d * d, dy = y - S.yb, ct = Math.cos(th), st = Math.sin(th), fk = 1 + S.fl * d;
      p.setXYZ(i, x * fk, S.yb + dy * ct - z * fk * st, dy * st + z * fk * ct); }
    p.needsUpdate = true; S.nt = (S.nt || 0) + 1; if (S.nt % 2 === 0 || run > 0) S.g.computeVertexNormals(); }
  function buildLuna(opt) {
    var MIRA = !!opt.mira, P = Object.assign({}, PAL.luna, MIRA ? PAL.mira : {}, opt.pal || {}), root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.userData.kind = 'luna'; root.userData.mira = MIRA;
    var M = { skin: toon(P.skin), suit: toon(P.suit), dark: toon(P.dark), boot: toon(P.boot, MIRA ? { rim: 0.7 } : {}), coat: toon(P.coat, { side: THREE.DoubleSide }), helmet: toon(P.helmet), band: toon(P.band), cup: toon(P.cup), emblem: toon(P.emblem), hand: toon(0xffffff, { vc: true }), rim: toon(0x8a8482) }; if (MIRA) ['coat', 'helmet', 'dark', 'boot', 'band', 'cup'].forEach(function (k) { M[k].color.convertSRGBToLinear(); });
    var HIP = 0.488, TN = LQ >= 3 ? 512 : 256;
    /* ----- the legs: the thigh with the suit's point running down its front to the knee, the boot narrowing under the knee and flaring wide to the ground ----- */
    var thighTex = ctex(TN, TN, function (g, w, h) { g.fillStyle = hex(P.boot); g.fillRect(0, 0, w, h); if (MIRA) { g.fillStyle = hex(P.breech); g.fillRect(0, 0, w, h); var rn = 99; for (var q0 = 0; q0 < w * h / 80; q0++) { rn = (rn * 16807) % 2147483647; var a1 = rn / 2147483647; rn = (rn * 16807) % 2147483647; var a2 = rn / 2147483647; g.fillStyle = q0 % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)'; g.fillRect(a1 * w, a2 * h, 2, 1); } g.strokeStyle = 'rgba(20,22,18,.3)'; g.lineWidth = Math.max(1, w / 200); [0.25, 0.75].forEach(function (x) { g.beginPath(); g.moveTo(w * x, 0); g.lineTo(w * x, h); g.stroke(); }); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, h * 0.92, w, h * 0.08); return; } g.fillStyle = hex(P.suit); g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h * 0.34); g.lineTo(w * 0.68, h * 0.4); g.lineTo(w * 0.5, h * 0.9); g.lineTo(w * 0.32, h * 0.4); g.lineTo(0, h * 0.34); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(40,30,30,.9)'; g.lineWidth = w / 64; g.beginPath(); g.moveTo(0, h * 0.34); g.lineTo(w * 0.32, h * 0.4); g.lineTo(w * 0.5, h * 0.9); g.lineTo(w * 0.68, h * 0.4); g.lineTo(w, h * 0.34); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = w / 110; g.beginPath(); g.moveTo(w * 0.33, h * 0.405); g.lineTo(w * 0.5, h * 0.88); g.lineTo(w * 0.67, h * 0.405); g.stroke(); });
    thighTex.flipY = false; var thighMat = toon(0xffffff, { map: thighTex });
    var hips = new THREE.Group(); hips.position.y = HIP; body.add(hips);
    function leg(side) {
      var piv = new THREE.Group(); piv.position.set(0.045 * side, 0, 0); hips.add(piv);
      var tp = smoothProfile([[0.001, 0.01], [0.047, 0.0], [0.05, -0.06], [0.046, -0.15], [0.04, -0.235], [0.0005, -0.245]], sg(16, 10));
      var tg = lathe(tp, sg(28, 16), { start: Math.PI }); if (MIRA) breech(tg, side); /* u 0.5 faces +z; v 0 at the hip = the top of the canvas (flipY off) */
      var thigh = mesh(tg, thighMat, { ink: 0.004 }); piv.add(thigh);
      var knee = new THREE.Group(); knee.position.y = -0.235; piv.add(knee);
      /* the boot: close under the knee, then the bell — wider across than fore-and-aft, a rounded lip at the ground */
      var bp = smoothProfile(MIRA ? [[0.001, 0.03], [0.0435, 0.026], [0.0425, 0.0], [0.0405, -0.045], [0.0365, -0.095], [0.0325, -0.145], [0.0295, -0.188], [0.0305, -0.215], [0.034, -0.236], [0.0355, -0.246], [0.001, -0.252]] : [[0.001, 0.012], [0.042, 0.008], [0.038, -0.05], [0.036, -0.1], [0.041, -0.14], [0.053, -0.175], [0.069, -0.205], [0.084, -0.23], [0.086, -0.244], [0.07, -0.252], [0.001, -0.253]], sg(22, 12));
      var bg = lathe(bp, sg(32, 18)); if (MIRA) { bg.scale(1.0, 1, 0.95); var bpp = bg.attributes.position; for (var bq = 0; bq < bpp.count; bq++) { var by2 = bpp.getY(bq); if (by2 > 0.0) { var bz2 = bpp.getZ(bq), br3 = Math.hypot(bpp.getX(bq), bz2) || 1e-6; bpp.setY(bq, by2 + 0.024 * Math.max(0, bz2 / br3) * Math.min(1, by2 / 0.026)); } } } else bg.scale(1.08, 1, 0.9); bg.computeVertexNormals(); var shin = mesh(bg, M.boot, { ink: 0.0045 }); knee.add(shin);
      var foot = mesh(MIRA ? blob(0.037, 0.025, 0.07, sg(18, 10)) : blob(0.05, 0.026, 0.066, sg(18, 10)), M.boot, { ink: 0.0045 }); foot.position.set(0, -0.234, 0.026); knee.add(foot); if (MIRA) { var heel = mesh(rbox(0.032, 0.02, 0.03, 0.004, 3), M.boot, { ink: 0.003 }); heel.position.set(0, -0.016, -0.042); foot.add(heel); var sole = mesh(blob(0.039, 0.006, 0.072, sg(16, 8)), toon(0x0c0c0e), { ink: false }); sole.position.set(0, -0.021, 0.0); foot.add(sole); }
      return { piv: piv, knee: knee, foot: foot }; }
    var legL = leg(1), legR = leg(-1);
    /* ----- the torso: the orange suit with the broad dark chevron (a canvas on a lathe) ----- */
    var torsoTex = ctex(TN * 2, TN * 2, function (g, w, h) { if (MIRA) { tunicTex(g, w, h, P); return; } g.fillStyle = hex(P.suit); g.fillRect(0, 0, w, h); var cx = w / 2;
      if (!MIRA) { g.fillStyle = hex(P.dark); g.beginPath(); } if (!MIRA) /* the chevron: a broad V band, its point at the front below the collar, rising steeply to the sides */ var y0 = h * 0.47, th = h * 0.1, sp = w * 0.215, rise = h * 0.17; g.moveTo(cx - sp, y0 - rise); g.lineTo(cx, y0); g.lineTo(cx + sp, y0 - rise); g.lineTo(cx + sp, y0 - rise + th); g.lineTo(cx, y0 + th); g.lineTo(cx - sp, y0 - rise + th); g.closePath(); if (!MIRA) g.fill();
      if (!MIRA) g.strokeStyle = 'rgba(255,255,255,.16)'; else g.strokeStyle = 'rgba(0,0,0,0)'; g.lineWidth = w / 180; g.beginPath(); g.moveTo(cx - sp, y0 - rise + th * 0.5); g.lineTo(cx, y0 + th * 0.5); g.lineTo(cx + sp, y0 - rise + th * 0.5); g.stroke();
      g.fillStyle = hex(P.dark); g.beginPath(); g.moveTo(cx - w * 0.075, 0); g.lineTo(cx + w * 0.075, 0); g.lineTo(cx + w * 0.05, h * 0.2); g.lineTo(cx, h * 0.28); g.lineTo(cx - w * 0.05, h * 0.2); g.closePath(); g.fill(); /* the dark of the turtleneck running down to a point */
      g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, h * 0.78, w, h * 0.22); });
    torsoTex.flipY = false;
    var torso = new THREE.Group(); torso.position.y = HIP; body.add(torso);
    var tpf = smoothProfile([[0.001, -0.03], [0.072, -0.03], [0.08, 0.03], [0.07, 0.11], [0.058, 0.2], [0.064, 0.27], [0.08, 0.33], [0.084, 0.37], [0.066, 0.41], [0.03, 0.425], [0.001, 0.426]], sg(26, 14));
    var tgeo = lathe(tpf, sg(36, 20), { start: Math.PI }); tgeo.scale(1, 1, 0.74); var tuv = tgeo.attributes.uv; for (var i0 = 0; i0 < tuv.count; i0++) tuv.setY(i0, 1 - tuv.getY(i0));
    var tor = mesh(tgeo, toon(0xffffff, { map: torsoTex }), { ink: 0.004 }); torso.add(tor);
    var collar = mesh(lathe([[0.001, 0], [0.037, 0], [0.037, 0.056], [0.033, 0.066], [0.001, 0.066]], sg(24, 14)), M.dark, { ink: 0.003 }); collar.position.y = 0.4; torso.add(collar);
    var crim = mesh(new THREE.TorusGeometry(0.0345, 0.0028, 6, sg(28, 14)), M.rim, { ink: false }); crim.rotation.x = Math.PI / 2; crim.position.y = 0.462; torso.add(crim);
    /* ----- the lab coat: open in front, pointed lapels and a collar, the front corners hanging to points at the hips ----- */
    var coatTex = ctex(TN * 2, TN, function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(150,150,160,.45)'; g.lineWidth = w / 170; [[0.32, 0.55], [0.68, 0.55]].forEach(function (p) { g.strokeRect(p[0] * w - w * 0.05, p[1] * h, w * 0.1, h * 0.14); }); g.strokeStyle = 'rgba(170,170,180,.35)'; g.lineWidth = w / 256; for (var k = 0; k < 6; k++) { var x = w * (0.08 + k * 0.17); g.beginPath(); g.moveTo(x, h * 0.25); g.quadraticCurveTo(x + w * 0.012, h * 0.6, x - w * 0.008, h); g.stroke(); } if (MIRA) { g.fillStyle = '#e3000f'; g.fillRect(0, h * 0.16, w, h * 0.085); g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(0, h * 0.252, w, h * 0.012); g.fillStyle = 'rgba(60,60,70,.55)'; g.fillRect(0, h * 0.93, w, h * 0.07); } });
    coatTex.flipY = false;
    var CN = sg(40, 24), gapB = 1.05, gapT = 0.42, coatG = new THREE.CylinderGeometry(0.092, 0.118, 0.39, CN, sg(10, 6), true, 0, Math.PI * 2), cp = coatG.attributes.position, cuv = coatG.attributes.uv, v = new THREE.Vector3();
    for (var i = 0; i < cp.count; i++) { v.fromBufferAttribute(cp, i); var tt = (v.y + 0.195) / 0.39, gap = gapB + (gapT - gapB) * Math.pow(tt, 0.7), u = (i % (CN + 1)) / CN; /* map the circle minus the gap */ var a2 = gap / 2 + u * (Math.PI * 2 - gap), r = Math.hypot(v.x, v.z) * (1 + 0.05 * Math.sin(tt * 3.1)); v.x = Math.sin(a2) * r; v.z = Math.cos(a2) * r * 0.8; var ed = Math.max(0, 1 - Math.min(u, 1 - u) / 0.12); v.y -= 0.028 * ed * ed * Math.max(0, 1 - tt / 0.4); cp.setXYZ(i, v.x, v.y, v.z); cuv.setXY(i, u, 1 - tt); }
    coatG.computeVertexNormals();
    var coat = mesh(coatG, toon(0xffffff, { map: coatTex, side: THREE.DoubleSide }), { ink: 0.004 }); coat.position.y = 0.215; torso.add(coat);
    [1, -1].forEach(function (s) { var lp = new THREE.Shape(); lp.moveTo(0, 0); lp.lineTo(0.046 * s, 0.03); lp.lineTo(0.03 * s, 0.128); lp.lineTo(0.0, 0.14); lp.lineTo(0, 0); var lg = new THREE.ExtrudeGeometry(lp, { depth: 0.006, bevelEnabled: false }), lm = mesh(lg, M.coat, { ink: 0.003 }); lm.position.set(0.034 * s, 0.255, 0.066); lm.rotation.set(-0.18, 0.5 * s, 0); torso.add(lm); if (MIRA) lm.visible = false; });
    var cc = mesh(lathe([[0.046, 0], [0.054, 0.03], [0.052, 0.054], [0.042, 0.062]], sg(28, 16), { start: Math.PI * 0.30, len: Math.PI * 1.4 }), M.coat, { ink: 0.003 }); cc.position.y = 0.375; torso.add(cc); if (MIRA) { coat.visible = false; cc.visible = false; }
    /* ----- the arms: white sleeves, cuffs, hands with fingers ----- */
    function hand(side) { var parts = [], k; parts.push([blob(0.026, 0.03, 0.013, sg(16, 10)), M4([0, -0.02, 0], [0, 0, 0]), P.skin]);
      for (k = 0; k < 4; k++) { var fx = (k - 1.5) * 0.0125 * side, fl = [0.026, 0.03, 0.028, 0.022][k]; parts.push([new THREE.CapsuleGeometry(0.0058, fl, sg(3, 2), sg(8, 6)), M4([fx, -0.052 - fl * 0.3, 0.002], [0, 0, (k - 1.5) * 0.12 * side]), P.skin]); }
      parts.push([new THREE.CapsuleGeometry(0.0068, 0.02, sg(3, 2), sg(8, 6)), M4([-0.026 * side, -0.026, 0.008], [0.3, 0, 0.9 * side]), P.skin]); return merge(parts); }
    function arm(side) {
      var sh = new THREE.Group(); sh.position.set(0.088 * side, 0.375, 0); torso.add(sh);
      var up = mesh(lathe(smoothProfile([[0.001, 0.02], [0.03, 0.012], [0.032, -0.05], [0.027, -0.13], [0.001, -0.14]], sg(12, 8)), sg(20, 12)), M.coat, { ink: 0.004 }); sh.add(up);
      var el = new THREE.Group(); el.position.y = -0.13; sh.add(el);
      var fo = mesh(lathe(smoothProfile([[0.001, 0.012], [0.027, 0.008], [0.026, -0.06], [0.03, -0.11], [0.03, -0.125], [0.001, -0.128]], sg(12, 8)), sg(20, 12)), M.coat, { ink: 0.004 }); el.add(fo);
      var cuff = mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.022, sg(18, 12)), M.coat, { ink: 0.003 }); cuff.position.y = -0.115; el.add(cuff);
      var wr = new THREE.Group(); wr.position.y = -0.125; el.add(wr);
      var hd = mesh(hand(side), M.hand, { ink: 0.0035 }); wr.add(hd);
      sh.rotation.z = 0.1 * side; return { sh: sh, el: el, wr: wr, hand: hd }; }
    var armL = arm(1), armR = arm(-1);
    /* ----- the head: an anime head (a round crown, full cheeks, a short soft chin), the face a decal drawn in its own units; the eyes large and round as in the art ----- */
    var neck = new THREE.Group(); neck.position.y = 0.43; torso.add(neck);
    var nk = mesh(new THREE.CylinderGeometry(0.023, 0.026, 0.07, sg(16, 10)), M.skin, { ink: false }); nk.position.y = 0.01; neck.add(nk);
    var head = new THREE.Group(); head.position.y = 0.12; head.scale.setScalar(1.09); neck.add(head);
    var R = 0.112, skull = animeSkull(R, sg(72, 36), sg(54, 27)); var hm2 = mesh(skull, M.skin, { ink: 0.004 }); head.add(hm2);
    var LFO = MIRA ? { skin: '#f8d8c7', eyeX: 0.0448, eyeY: -0.0285, ew: 0.0306, eh: 0.0386, lashW: 0.0052, fn: LQ >= 3 ? 2048 : 1024, iris: ['#0a1d40', '#1d5cb4', '#46a8f2', '#d2f0ff'], lash: '#3f2614', brow: '#c9a060', freckles: true, cute: true } : { skin: '#fad3bf', eyeX: 0.0445, eyeY: -0.027, ew: 0.0285, eh: 0.0345, lashW: 0.005, fn: LQ >= 3 ? 2048 : 1024 }, FK = (MIRA ? 'mira' : 'luna') + (LQ >= 3 ? 'U' : ''); var fm = faceMat(faceTex('open', FK, LFO)); var face = new THREE.Mesh(faceDecal(skull), fm); face.renderOrder = 2; head.add(face);
    /* ----- the hair: a shell under the helmet with the face left open, locks falling over it to the nape, the fringe with its tuft, the side locks ----- */
    var MH = toon(0xffffff, { vc: true }), hairC = new THREE.Color(P.hair), hiC = new THREE.Color(P.hairHi), dkC = new THREE.Color(P.hair).multiplyScalar(0.78), teal = new THREE.Color(P.streak), tealD = new THREE.Color(P.streak).multiplyScalar(0.8);
    var shell = new THREE.SphereGeometry(1, sg(56, 32), sg(36, 20)), sp = shell.attributes.position, sc = [], keep = [], si = shell.index.array, i;
    for (i = 0; i < sp.count; i++) { var hx = sp.getX(i), hy = sp.getY(i), hz = sp.getZ(i); sp.setXYZ(i, hx * R * 1.045, hy * R * 1.07, hz * R * 1.035); var cc2 = hairC.clone().lerp(dkC, Math.max(0, Math.min(1, (0.2 - hy) * 0.8))); sc.push(cc2.r, cc2.g, cc2.b); }
    shell.setAttribute('color', new THREE.Float32BufferAttribute(sc, 3));
    function inShell(k) { var x = sp.getX(k) / (R * 1.045), y = sp.getY(k) / (R * 1.07), z = sp.getZ(k) / (R * 1.035); if (y < -0.82) return false; if (z > 0.3 && y < 0.42 && Math.abs(x) < 0.86) return false; if (z > 0.55 && y < -0.1) return false; if (z > -0.1 && y < -0.35) return false; return true; }
    for (i = 0; i < si.length; i += 3) if (inShell(si[i]) && inShell(si[i + 1]) && inShell(si[i + 2])) keep.push(si[i], si[i + 1], si[i + 2]); shell.setIndex(keep); shell.computeVertexNormals();
    head.add(mesh(shell, MH, { ink: 0.0035 }));
    function radial(t, P0) { return P0.clone().normalize(); }
    var sways = [];
    /* a lock of hair on a pivot at its root (so it can sway); its colours: the body, a band of gloss, the tip darkening */
    function lock(pts, w, th, o2) { o2 = o2 || {}; var p0 = pts[0], rel = pts.map(function (p) { return p.clone().sub(p0); }), cv = new THREE.CatmullRomCurve3(rel, false, 'catmullrom', 0.5), g2 = taper(cv, sg(o2.seg || 18, 8), sg(8, 6), function (t) { return th * Math.pow(1 - t, o2.pw || 0.7) + 0.0012; }, { flat: w / th, up: function (t, Pq) { return Pq.clone().add(p0).normalize(); }, color: function (t, a, c) { c.copy(o2.teal ? teal : hairC); if (o2.band && t > o2.band[0] && t < o2.band[1] && Math.cos(a) > -0.2) c.copy(o2.teal ? teal : hiC); if (t > 0.75) c.lerp(o2.teal ? tealD : dkC, (t - 0.75) * 1.6); } });
      var piv = new THREE.Group(); piv.position.copy(p0); head.add(piv); var mm = mesh(g2, MH, { ink: o2.ink || 0.0026 }); piv.add(mm); if (o2.sway) sways.push({ piv: piv, amp: o2.sway, ph: Math.random() * 6.28, a: 0, v: 0 }); return piv; }
    function onSkull(th, y, lift) { var yy = y / (R * 1.07), rr = Math.sqrt(Math.max(0.02, 1 - yy * yy)), r1 = R * 1.06 + (lift || 0); return V(Math.sin(th) * rr * r1, y, Math.cos(th) * rr * r1); }
    /* the fringe and the back: hair as a surface laid over the skull whose lower edge falls in pointed clumps, shaded strand by strand
       (a crease between the clumps, the light band of the gloss), lifting a little at the tips */
    function fringe(th0, th1, yTop, clumps, yGap, o3) { o3 = o3 || {}; var NU = sg(o3.nu || 120, 40), NV = sg(o3.nv || 14, 6), pos = [], col = [], idx = [], c3 = new THREE.Color(), u, v;
      function edge(th) { var y = yGap, ph = 0, best = 9; clumps.forEach(function (c) { var d = (th - c[0]) / c[1]; if (Math.abs(d) < 1) { var yy = yTop - c[2] * (1 - Math.pow(Math.abs(d), o3.sharp || 1.25)); if (yy < y) y = yy; } if (Math.abs(d) < best) { best = Math.abs(d); ph = d; } }); return [y, ph]; }
      for (v = 0; v <= NV; v++) for (u = 0; u <= NU; u++) { var th = th0 + (th1 - th0) * u / NU, E = edge(th), vv = v / NV, y = yTop + (E[0] - yTop) * vv, lift = (o3.lift0 || 0.004) + ((o3.lift1 || 0.011) - (o3.lift0 || 0.004)) * vv + (o3.flick || 0) * Math.pow(vv, 3), P0 = onSkull(th, y, lift);
        pos.push(P0.x, P0.y, P0.z); var crease = o3.conv ? Math.pow(Math.abs(Math.sin(Math.atan2(th - o3.conv[0], (o3.conv[1] - y) / R * 1.6) * o3.conv[2])), 7) * 0.85 + Math.pow(Math.abs(E[1]), 3) * 0.15 : Math.pow(Math.abs(E[1]), 3), gl = o3.band ? Math.max(0, 1 - Math.abs(vv - o3.band) / 0.09) : 0; c3.copy(hairC).lerp(dkC, crease * 0.65 + vv * 0.12).lerp(hiC, gl * (1 - crease) * 0.9); col.push(c3.r, c3.g, c3.b); }
      for (v = 0; v < NV; v++) for (u = 0; u < NU; u++) { var a = v * (NU + 1) + u, b = a + 1, c = a + NU + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
      var g3 = new THREE.BufferGeometry(); g3.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g3.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g3.setIndex(idx); g3.computeVertexNormals();
      var m3 = mesh(g3, toon(0xffffff, { vc: true, side: THREE.DoubleSide }), { ink: 0.0024 }); head.add(m3); return m3; }
    /* the fringe: longer at the sides, framing the face, the clumps parted to her right where the tuft sweeps out */
    fringe(-1.32, 1.32, R * 0.66, [[-1.17, 0.27, R * 1.16], [-0.9, 0.26, R * 0.92], [-0.62, 0.25, R * 0.76], [-0.36, 0.24, R * 0.7], [-0.1, 0.24, R * 0.6], [0.15, 0.24, R * 0.7], [0.41, 0.25, R * 0.74], [0.67, 0.26, R * 0.8], [0.94, 0.26, R * 0.96], [1.2, 0.26, R * 1.18]], R * 0.2, { lift0: 0.003, lift1: 0.01, flick: 0.004, band: 0.2, sharp: 0.85, nu: 180 });
    /* the back: to the nape, the tips turned out a little */
    var bc = [], bi; for (bi = 0; bi < 15; bi++) { var thb = Math.PI * 0.42 + bi / 14 * Math.PI * 1.16; bc.push([thb, 0.15, MIRA ? R * (1.02 + 0.05 * Math.sin(bi * 2.1)) : R * (1.42 + 0.1 * Math.sin(bi * 2.1))]); }
    fringe(Math.PI * 0.4, Math.PI * 1.6, R * 0.55, bc, -R * 0.5, MIRA ? { lift0: 0.004, lift1: 0.008, flick: 0.0015, band: 0.3, nu: 180, nv: 22, conv: [Math.PI, -0.002, 9] } : { lift0: 0.004, lift1: 0.012, flick: 0.012, band: 0.3, nu: 150 });
    /* the tuft: the big sweep of the fringe to her right, from under the band's middle, flicking up at its end; two smaller wisps beside it */
    if (!MIRA) lock([onSkull(0.05, R * 0.63, 0.008), onSkull(-0.2, R * 0.52, 0.014), onSkull(-0.48, R * 0.42, 0.02), onSkull(-0.72, R * 0.4, 0.024), onSkull(-0.92, R * 0.52, 0.03)], 0.024, 0.0078, { seg: 20, pw: 0.55, band: [0.25, 0.45], sway: 0.05 });
    if (!MIRA) lock([onSkull(0.08, R * 0.62, 0.007), onSkull(-0.08, R * 0.46, 0.014), onSkull(-0.3, R * 0.32, 0.018), onSkull(-0.44, R * 0.22, 0.016)], 0.018, 0.006, { seg: 14, pw: 0.6, sway: 0.04 });
    if (!MIRA) lock([onSkull(0.2, R * 0.62, 0.006), onSkull(0.3, R * 0.44, 0.012), onSkull(0.42, R * 0.28, 0.014), onSkull(0.5, R * 0.2, 0.011)], 0.016, 0.0055, { seg: 12, pw: 0.6, sway: 0.035 });
    /* the side locks: in front of the ear cups, framing the cheeks down to the jaw; a thread of teal among them */
    [1, -1].forEach(function (sd) { [[1.02, 0.05, 1.1, -0.92, 0.024, false], [0.88, 0.12, 0.94, -0.66, 0.02, false], [1.1, -0.02, 1.16, -0.8, 0.01, true]].forEach(function (b) { lock([onSkull(sd * b[0], R * 0.45, 0.004), onSkull(sd * (b[0] + 0.05), R * b[1], 0.01), onSkull(sd * (b[2] - 0.02), R * (b[1] + b[3]) / 2, 0.012), onSkull(sd * b[2], R * b[3], 0.01)], b[4], b[5] ? 0.004 : 0.0058, { seg: 14, pw: 0.6, teal: b[5], sway: 0.06 }); }); });
    /* ----- the twin tails: bundles of strands from under the helmet behind the ear cups — orange clumps over a teal inner strand — each on its own chain of bones ----- */
    var tails = [], NB = QB[LQ], NS = QN[LQ];
    function tailShape(s, k) { /* the S of the drawing: out from the tie, in at the waist, out again, the wavy end flicking outwards; each strand offset in its own way */
      var ox = [0, -0.012, 0.008, -0.006, 0.01, 0.016][k] * s, oz = [0, -0.004, -0.016, 0.012, 0.012, -0.006][k], ph = [0, 0.9, 1.9, 2.6, 3.6, 4.4][k], sc = [1, 0.97, 0.94, 0.98, 0.9, 0.88][k];
      var base = [[0, 0, 0], [0.04, -0.03, -0.016], [0.078, -0.1, -0.034], [0.094, -0.19, -0.046], [0.072, -0.28, -0.04], [0.08, -0.37, -0.028], [0.114, -0.45, -0.016], [0.1, -0.53, -0.004], [0.126, -0.6, 0.006], [0.15, -0.645, 0.02]];
      return base.map(function (p, j) { var w = Math.min(1, j / 2), wv = Math.sin(j * 0.9 + ph) * 0.006 * Math.min(1, j / 3); return V(s * p[0] * sc + (ox + s * wv) * w, p[1] * sc - 0.003 * k * w, p[2] + (oz + wv * 0.5) * w); }); }
    var strandDef = [{ r: 0.034, fl: 0.62, kind: 'main' }, { r: 0.017, fl: 0.6, kind: 'teal' }, { r: 0.021, fl: 0.6, kind: 'orange' }, { r: 0.011, fl: 0.6, kind: 'teal' }, { r: 0.013, fl: 0.62, kind: 'orange' }, { r: 0.011, fl: 0.6, kind: 'orange' }];
    (MIRA ? [] : [1, -1]).forEach(function (s) {
      var piv = new THREE.Group(); if (MIRA) { piv.position.set(0, 0.062, -0.098); piv.rotation.y = Math.PI / 2; piv.scale.setScalar(0.74); } else piv.position.set(s * 0.1, 0.035, -0.062); head.add(piv);
      for (var k = 0; k < NS; k++) { (function (k) { var D = strandDef[k], pts = tailShape(s, k), cv = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5), tOut = [], segs = sg(k === 0 ? 96 : 64, 24), rad = sg(k === 0 ? 14 : 10, 7);
        var rf = function (t) { return D.r * Math.sin(Math.min(1, t * 4 + 0.4) * Math.PI * 0.5) * (1 - Math.pow(t, 1.7) * 0.9) + 0.0025; };
        var mat, geo = taper(cv, segs, rad, rf, { flat: D.fl, up: V(s, 0, 0), tOut: tOut, color: function (t, a, c) { if (D.kind === 'teal') { c.copy(Math.cos(a) > 0.3 && t > 0.05 && t < 0.14 ? new THREE.Color(P.streak).lerp(new THREE.Color(0xffffff), 0.25) : teal); if (t > 0.8) c.lerp(tealD, (t - 0.8) * 2); return; } var band = t > 0.05 && t < 0.12 && Math.cos(a) > 0.2; c.copy(band ? hiC : hairC); if (D.kind === 'main' && Math.cos(a) < -0.55 && t > 0.08 && t < 0.93) c.copy(teal); else if (!band && Math.cos(a) < -0.1) c.copy(dkC); if (t > 0.86) c.lerp(dkC, (t - 0.86) * 3); } });
        /* the bones: at even steps along the curve, each pointing at the next */
        var rest = [], bones = [], q; for (q = 0; q < NB; q++) rest.push(cv.getPointAt(q / (NB - 1)));
        for (q = 0; q < NB; q++) { var bn = new THREE.Bone(); if (q === 0) bn.position.copy(rest[0]); else bn.position.copy(rest[q]).sub(rest[q - 1]); if (q) bones[q - 1].add(bn); bones.push(bn); } piv.add(bones[0]);
        (function skin(geo2, tl) { var n = geo2.attributes.position.count, si2 = new Uint16Array(n * 4), sw = new Float32Array(n * 4), q2; for (q2 = 0; q2 < n; q2++) { var f = Math.min(NB - 1.0001, (tl[q2] || 0) * (NB - 1)), b0 = Math.floor(f), u = f - b0; if (u < 0.35 && b0 > 0) { var w1 = 0.5 + u / 0.7; si2[q2 * 4] = b0; sw[q2 * 4] = w1; si2[q2 * 4 + 1] = b0 - 1; sw[q2 * 4 + 1] = 1 - w1; } else { si2[q2 * 4] = b0; sw[q2 * 4] = 1; } }
          geo2.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si2, 4)); geo2.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); })(geo, tOut);
        mat = toon(0xffffff, { vc: true }); var sk1 = new THREE.SkinnedMesh(geo, mat), ik1 = new THREE.SkinnedMesh(geo, ink(k === 0 ? 0.0042 : 0.003)); ik1.userData.ink = true; ik1.renderOrder = -1; [sk1, ik1].forEach(function (mm) { mm.frustumCulled = false; mm.castShadow = !mm.userData.ink; piv.add(mm); });
        tails.push({ piv: piv, side: s, k: k, bones: bones, rest: rest, meshes: [sk1, ik1], p: null, q: null, kS: [1, 0.92, 0.88, 0.84, 0.8, 0.76][k], air: [1, 1.15, 1.1, 1.3, 1.25, 1.4][k], ph: k * 1.7 + (s > 0 ? 0 : 0.8) }); })(k); }
      var tie = mesh(new THREE.TorusGeometry(0.02, 0.0085, sg(8, 6), sg(18, 10)), M.band, { ink: 0.0025 }); tie.position.set(s * 0.012, -0.004, -0.006); tie.rotation.y = Math.PI / 2; piv.add(tie); });
    /* ----- (V65) the hair: one high ponytail, tied at the back of the head just under the cap's band with an elastic and a red ribbon
       bow; it springs out and up behind the cap, then falls in a soft S to above the belt. The bundle is many tapered strands laid round
       one chain of bones (they move as one tail), with two loose wisps on their own chains; simulated like the tails (gravity, inertia,
       the air, the head, cap and back as colliders) ----- */
    if (MIRA) (function () {
      var piv = new THREE.Group(); piv.position.set(0, -0.002, -0.117); head.add(piv);
      var base = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 0.008, -0.03), V(0, 0.026, -0.064), V(0, 0.027, -0.1), V(0, -0.004, -0.13), V(0, -0.068, -0.146), V(0, -0.145, -0.141), V(0, -0.215, -0.126), V(0, -0.272, -0.11), V(0.004, -0.318, -0.096), V(0.009, -0.352, -0.087)], false, 'catmullrom', 0.5);
      var rest = [], bones = [], q, meshes = [], mat = toon(0xffffff, { vc: true }), X1 = new THREE.Vector3(1, 0, 0);
      for (q = 0; q < NB; q++) rest.push(base.getPointAt(q / (NB - 1)));
      for (q = 0; q < NB; q++) { var bn2 = new THREE.Bone(); if (q === 0) bn2.position.copy(rest[0]); else bn2.position.copy(rest[q]).sub(rest[q - 1]); if (q) bones[q - 1].add(bn2); bones.push(bn2); } piv.add(bones[0]);
      function skinGeo(g, tl, nb) { var n = g.attributes.position.count, si2 = new Uint16Array(n * 4), sw = new Float32Array(n * 4), k; for (k = 0; k < n; k++) { var f = Math.min(nb - 1.0001, Math.max(0, tl[k] || 0) * (nb - 1)), b0 = Math.floor(f), uu = f - b0; si2[k * 4] = b0; sw[k * 4] = 1 - uu; si2[k * 4 + 1] = Math.min(nb - 1, b0 + 1); sw[k * 4 + 1] = uu; }
        g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si2, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); }
      function addSkinned(par, list, g, inkW) { var sm = new THREE.SkinnedMesh(g, mat), ik = new THREE.SkinnedMesh(g, ink(inkW)); ik.userData.ink = true; ik.renderOrder = -1; [sm, ik].forEach(function (mm) { mm.frustumCulled = false; mm.castShadow = !mm.userData.ink; par.add(mm); list.push(mm); }); }
      /* a frame along the curve: the side (L, towards her left/right) and the depth (Dp, up/back) */
      var Pb = new THREE.Vector3(), Tg = new THREE.Vector3(), Lt = new THREE.Vector3(), Dp = new THREE.Vector3();
      function frame(cv, t) { cv.getPointAt(t, Pb); cv.getTangentAt(t, Tg); Lt.copy(X1).addScaledVector(Tg, -Tg.dot(X1)).normalize(); Dp.copy(Tg).cross(Lt).normalize(); }
      /* the strands: a full core and a ring round it; each spreads from the tie (gathered), swells, and comes together again towards the
         tip, where the ring strands part a little into pointed clumps */
      var KS = sg(9, 6), NSg = sg(110, 48), RAD = sg(12, 8);
      for (var k = 0; k < KS; k++) (function (k) { var core = k === 0, an = core ? 0 : (k - 1) / (KS - 1) * Math.PI * 2 + 0.3, sp0 = core ? 0 : 0.0118 + (k % 2) * 0.0035, r0 = core ? 0.0215 : 0.0138 + (k % 3) * 0.0016, ph = k * 1.7, pts = [], N2 = 60, j;
        for (j = 0; j <= N2; j++) { var t = j / N2, spread = Math.sin(Math.min(1, t * 2.4) * Math.PI * 0.5) * (1 - 0.45 * t) + (t > 0.78 ? (t - 0.78) * 0.8 : 0), wv = Math.sin(t * 6.5 + ph) * 0.0028 * Math.min(1, t * 3);
          frame(base, t); var ox = Math.cos(an) * sp0 * spread + wv, oy = Math.sin(an) * sp0 * spread * 0.82; pts.push(Pb.clone().addScaledVector(Lt, ox).addScaledVector(Dp, oy)); }
        var cv = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5), tl = [];
        var rf = function (t) { var sw = 0.55 + 0.45 * Math.sin(Math.min(1, t * 3.2) * Math.PI * 0.5); return r0 * sw * (1 - Math.pow(t, 1.35) * 0.94) + 0.0007; };
        var gg = taper(cv, NSg, RAD, rf, { flat: core ? 0.86 : 0.74, up: function (t) { frame(base, Math.min(1, t)); return Dp.clone(); }, tOut: tl, color: function (t, a, c) { var ca = Math.cos(a); c.copy(hairC); if (core) c.multiplyScalar(0.94);
            var gl = t > 0.08 && t < 0.26 ? 1 - Math.abs(t - 0.17) / 0.09 : 0; if (ca > 0.35) c.lerp(hiC, (0.25 + 0.55 * gl) * (ca - 0.35) / 0.65); else if (ca < -0.25) c.lerp(dkC, 0.65 * Math.min(1, (-0.25 - ca) / 0.5)); if (t > 0.82) c.lerp(dkC, (t - 0.82) * 1.6); } });
        skinGeo(gg, tl, NB); addSkinned(piv, meshes, gg, core ? 0.0026 : 0.002); })(k);
      /* the elastic round the root and the red ribbon bow on it */
      var t0 = 0.03, tieP = base.getPointAt(t0), tg3 = base.getTangentAt(t0), tieG = new THREE.Group(); tieG.position.copy(tieP); tieG.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tg3.clone().negate()); piv.add(tieG);
      var el = mesh(new THREE.TorusGeometry(0.0158, 0.0045, sg(8, 6), sg(26, 14)), M.band, { ink: 0.0016 }); el.rotation.x = Math.PI / 2; tieG.add(el);
      /* the bow sits under the root, facing back: two loops to the sides, the two ends hanging down */
      var bow = new THREE.Group(); bow.position.set(tieP.x, tieP.y - 0.016, tieP.z - 0.013); bow.rotation.x = 0.25; piv.add(bow);
      [1, -1].forEach(function (b2) { var lp = mesh(new THREE.TorusGeometry(0.0185, 0.0058, sg(8, 6), sg(20, 12)), M.band, { ink: 0.0018 }); lp.scale.set(1.3, 0.74, 0.5); lp.position.set(b2 * 0.0235, 0.004, 0); lp.rotation.set(0, b2 * 0.25, b2 * 0.32); bow.add(lp);
        var en = mesh(taper(new THREE.CatmullRomCurve3([V(b2 * 0.003, -0.003, 0), V(b2 * 0.011, -0.03, -0.004), V(b2 * 0.016, -0.06, -0.002)]), sg(12, 6), sg(6, 4), function (t) { return 0.0068 * (1 - 0.3 * t); }, { flat: 0.3, up: V(0, 0, 1) }), M.band, { ink: 0.0014 }); bow.add(en); });
      var knot = mesh(blob(0.0085, 0.008, 0.0062, sg(10, 8)), M.band, { ink: 0.0016 }); bow.add(knot);
      tails.push({ piv: piv, side: 1, k: 0, bones: bones, rest: rest, meshes: meshes, p: null, q: null, kS: 1.45, air: 0.8, ph: 0, pony: true });
      /* two loose wisps from the tie, a little apart from the bundle, each with its own bones */
      [[1, 0.6], [-1, 2.3]].forEach(function (w) { var s = w[0], b2 = [], r2 = [], m2 = [], cvW = new THREE.CatmullRomCurve3([V(0, 0, 0), V(s * 0.006, 0.004, -0.032), V(s * 0.016, 0.012, -0.066), V(s * 0.026, -0.012, -0.1), V(s * 0.032, -0.07, -0.12), V(s * 0.03, -0.14, -0.118), V(s * 0.036, -0.2, -0.106)], false, 'catmullrom', 0.5), NBw = Math.max(5, NB - 3);
        for (q = 0; q < NBw; q++) r2.push(cvW.getPointAt(q / (NBw - 1))); for (q = 0; q < NBw; q++) { var bw = new THREE.Bone(); if (q === 0) bw.position.copy(r2[0]); else bw.position.copy(r2[q]).sub(r2[q - 1]); if (q) b2[q - 1].add(bw); b2.push(bw); } piv.add(b2[0]);
        var tl2 = [], gw = taper(cvW, sg(60, 24), sg(8, 6), function (t) { return 0.0058 * Math.sin(Math.min(1, t * 4 + 0.3) * Math.PI * 0.5) * (1 - Math.pow(t, 1.4) * 0.9) + 0.0006; }, { flat: 0.6, up: V(s, 0, 0), tOut: tl2, color: function (t, a, c) { c.copy(hairC); if (Math.cos(a) > 0.4) c.lerp(hiC, 0.4); if (t > 0.8) c.lerp(dkC, (t - 0.8) * 1.5); } });
        skinGeo(gw, tl2, NBw); addSkinned(piv, m2, gw, 0.0016); tails.push({ piv: piv, side: s, k: 1, bones: b2, rest: r2, meshes: m2, p: null, q: null, kS: 1.1, air: 1.25, ph: w[1] }); });
    })();
    /* the helmet: a white dome, the dark band low over the brow (deeper at the front), the large ear cups, the A */
    var helm = new THREE.Group(); helm.position.set(0, 0.014, -0.004); helm.rotation.x = -0.2; head.add(helm); if (MIRA) helm.visible = false;
    var hg = new THREE.SphereGeometry(1, sg(64, 32), sg(26, 14), 0, Math.PI * 2, 0, Math.PI * 0.5); hg.scale(R * 1.13, R * 1.1, R * 1.12); var hh = mesh(hg, M.helmet, { ink: 0.0042 }); hh.position.y = 0.022; helm.add(hh);
    var bandG = new THREE.CylinderGeometry(R * 1.14, R * 1.158, 0.022, sg(64, 32), 1, true); var band = mesh(bandG, M.band, { ink: 0.0032 }); band.position.y = 0.013; helm.add(band);
    /* the front of the band dips over the brows: a deeper arc between the ear cups */ var bfG = new THREE.CylinderGeometry(R * 1.145, R * 1.165, 0.03, sg(48, 24), 1, true, -1.05, 2.1), bp2 = bfG.attributes.position; for (i = 0; i < bp2.count; i++) { var ang = Math.atan2(bp2.getX(i), bp2.getZ(i)); bp2.setY(i, bp2.getY(i) - 0.006 * Math.cos(ang) * (bp2.getY(i) < 0 ? 1 : 0.2)); } bfG.computeVertexNormals(); var bf = mesh(bfG, M.band, { ink: 0.0032 }); bf.position.y = 0.006; helm.add(bf);
    var emH = 0.046, emZ = R * 1.12 * Math.sqrt(1 - Math.pow(emH / (R * 1.1), 2)) + 0.003, em = mesh(emblemGeo(0.06, 0.06), M.emblem, { ink: 0.002 }); em.position.set(0.0, 0.022 + emH, emZ); em.rotation.x = -Math.asin(emH / (R * 1.1)); helm.add(em); if (MIRA) em.visible = false;
    (MIRA ? [] : [1, -1]).forEach(function (s) { var cupG = new THREE.CylinderGeometry(0.041, 0.044, 0.03, sg(32, 18)); cupG.rotateZ(Math.PI / 2); var cu = mesh(cupG, M.cup, { ink: 0.003 }); cu.position.set(s * R * 1.08, -0.016, -0.012); head.add(cu); var rim = mesh(new THREE.TorusGeometry(0.036, 0.006, sg(8, 6), sg(32, 16)), M.band, { ink: false }); rim.rotation.y = Math.PI / 2; rim.position.set(s * (R * 1.08 + 0.016), -0.016, -0.012); head.add(rim); var dot = mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.006, sg(20, 12)), M.rim, { ink: false }); dot.rotation.z = Math.PI / 2; dot.position.set(s * (R * 1.08 + 0.018), -0.016, -0.012); head.add(dot); });
    /* ----- (V63) the officer's field uniform: the tunic's skirt, the belt and its buckle, the buttons, the four pleated pockets with their
       scalloped flaps, the collar with its tabs, the shoulder boards on their piping; the peaked cap; no badges or emblems of any kind ----- */
    var MU = {};
    if (MIRA) (function () {
      /* (plain colours and vertex colours are taken as linear by the renderer, the cloth's canvas as sRGB: the palette is sRGB, so convert) */
      function LC(h) { return new THREE.Color(h).convertSRGBToLinear(); }
      var zs = 0.74, cS = LC(P.suit), cD = cS.clone().multiplyScalar(0.42), cL = LC(P.suit).lerp(LC(0xffffff), 0.05), V3 = THREE.Vector3;
      var fabV = toon(0xffffff, { vc: true, side: THREE.DoubleSide }), silver = toon(LC(P.silver), { rim: 0.55 }), btnM = toon(LC(P.button), { rim: 0.5 }), leather = toon(LC(P.leather), { rim: 0.4 }), pipeM = toon(LC(P.pipe), { rim: 0.3 });
      function edged(base, e, fold) { return function (u, v, c) { var d = Math.min(u, 1 - u, v, 1 - v); c.copy(base); if (fold && Math.abs(u - 0.5) < 0.045) c.copy(cD).lerp(base, 0.35); if (d < e) c.copy(cD); }; }
      function addTo(par, geo, mat, ink) { var m = mesh(geo, mat, { ink: ink == null ? false : ink }); par.add(m); return m; }
      function button(par, P0, N0, r) { var b = addTo(par, blob(r, r, r * 0.5, sg(12, 8)), btnM, 0.0016); b.position.copy(P0).addScaledVector(N0, r * 0.35); b.quaternion.setFromUnitVectors(new V3(0, 0, 1), N0); return b; }
      /* the skirt of the tunic below the belt, closed in front, flaring over the hips */
      var skp = smoothProfile([[0.0655, 0.21], [0.0685, 0.17], [0.0795, 0.11], [0.094, 0.05], [0.107, 0.0], [0.117, -0.04], [0.123, -0.068]], sg(16, 10)), szs = 0.8;
      var skTex = ctex(TN * 2, TN, function (g, w, h) { tunicTex(g, w, h, P); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, h * 0.94, w, h * 0.06); g.fillRect(0, 0, w, h * 0.05); }); skTex.flipY = false;
      var skg = lathe(skp, sg(56, 32), { start: Math.PI }); skg.scale(1, 1, szs); skg.computeVertexNormals();
      var sk = mesh(skg, toon(0xffffff, { map: skTex, side: THREE.DoubleSide }), { ink: 0.0036 }); torso.add(sk);
      MU.skirt = { g: skg, rest: Float32Array.from(skg.attributes.position.array), yb: 0.205, len: 0.275, wid: 0.15, sw: 0, fl: 0, l: 0, r: 0 };
      function onT(y, th, off, out) { return surfP(tpf, zs, y, th, off, out); } function onS(y, th, off, out) { return surfP(skp, szs, y, th, off, out); }
      function nT(y, th) { return surfN(tpf, zs, y, th); } function nS(y, th) { return surfN(skp, szs, y, th); }
      /* a pleated patch pocket and its scalloped flap, laid on a surface (on: the point function, nn: its normal) */
      function pocket(on, nn, yTop, h, th0, hw, flapH) { var g1 = gridGeo(function (u, v, P2) { return on(yTop - h * v, th0 + (u - 0.5) * 2 * hw, 0.0022, P2); }, sg(10, 6), sg(10, 6), { col: edged(cS, 0.06, true), out: function () { return nn(yTop - h / 2, th0); } }); addTo(torso, g1, fabV);
        var g2 = gridGeo(function (u, v, P2) { var sc = 1 - Math.abs(u - 0.5) * 2, depth = flapH * (0.72 + 0.28 * (sc > 0.6 ? 1 : sc / 0.6)) * (u < 0.08 || u > 0.92 ? 0.9 : 1); return on(yTop + 0.006 - depth * v, th0 + (u - 0.5) * 2 * hw * 1.08, 0.0048 - 0.001 * v, P2); }, sg(12, 8), sg(4, 3), { col: function (u, v, c) { c.copy(cL); if (v > 0.8 || u < 0.05 || u > 0.95) c.copy(cD); }, out: function () { return nn(yTop - flapH / 2, th0); } }); addTo(torso, g2, fabV);
        var bp = on(yTop + 0.006 - flapH * 0.78, th0, 0.0052); button(torso, bp, nn(yTop - flapH * 0.7, th0), 0.0048); }
      pocket(onT, nT, 0.336, 0.062, 0.5, 0.3, 0.024); pocket(onT, nT, 0.336, 0.062, -0.5, 0.3, 0.024);
      pocket(onS, nS, 0.125, 0.085, 0.82, 0.33, 0.03); pocket(onS, nS, 0.125, 0.085, -0.82, 0.33, 0.03);
      /* the buttons down the front: four above the belt, two below */
      [0.372, 0.33, 0.288, 0.246].forEach(function (y) { button(torso, onT(y, 0, 0.0015), nT(y, 0), 0.0056); }); [0.15, 0.075].forEach(function (y) { button(torso, onS(y, 0, 0.0015), nS(y, 0), 0.0056); });
      /* the belt (brown leather, a little proud of the cloth) and the officer's open-frame buckle */
      function onB(y, th, off, out) { var a = onT(y, th, off), b = onS(Math.min(0.205, y), th, off); return (out || new V3()).copy(Math.hypot(a.x, a.z / zs) > Math.hypot(b.x, b.z / szs) ? a : b); }
      var bg = gridGeo(function (u, v, P2) { return onB(0.216 - 0.026 * v, (u - 0.5) * Math.PI * 2, 0.0055, P2); }, sg(64, 36), 2, { col: function (u, v, c) { c.copy(LC(P.leather)); if (v < 0.12 || v > 0.88) c.multiplyScalar(0.55); }, out: function () { return new V3(0, 0, 1); } });
      addTo(torso, bg, toon(0xffffff, { vc: true, side: THREE.DoubleSide, rim: 0.4 }), 0.0022);
      var bk = new THREE.Group(), bn = onB(0.203, 0, 0.007); bk.position.copy(bn); torso.add(bk); var fr = addTo(bk, rbox(0.03, 0.026, 0.004, 0.0018, 3), silver, 0.0016); var inr = addTo(bk, rbox(0.019, 0.015, 0.0045, 0.0012, 3), leather, false); inr.position.z = 0.0008; var bar = addTo(bk, rbox(0.004, 0.017, 0.005, 0.0012, 2), silver, false); bar.position.set(0.004, 0, 0.0012);
      /* the collar: field-grey lining under the dark green, the tabs (two silver bars on dark green, each side) */
      var colG = collar; colG.scale.set(1.04, 1.06, 1.04);
      [1, -1].forEach(function (s) { [0.428, 0.439].forEach(function (y, k) { var th = s * 0.42, rr = 0.0385 * 1.04, p0 = new V3(Math.sin(th) * rr, y, Math.cos(th) * rr), t = addTo(torso, rbox(0.017, 0.0036, 0.0022, 0.0009, 2), silver, false); t.position.copy(p0); t.rotation.y = th; t.rotation.z = -s * 0.12; });
        var pt = addTo(torso, rbox(0.021, 0.019, 0.0016, 0.002, 2), M.dark, false), th2 = s * 0.42, rr2 = 0.0382 * 1.04; pt.position.set(Math.sin(th2) * rr2, 0.4335, Math.cos(th2) * rr2); pt.rotation.y = th2; });
      /* the shoulder boards: silver braid (a chevron weave) on the arm-of-service colour, buttoned at the collar end */
      [1, -1].forEach(function (s) { /* along the top of the shoulder, from the collar over the head of the sleeve (which it sits on) */
        var line = new THREE.CatmullRomCurve3([new V3(0.042, 0.4275, 0), new V3(0.056, 0.4225, 0), new V3(0.07, 0.411, 0), new V3(0.084, 0.4015, 0), new V3(0.1, 0.397, 0)]), Pq = new V3(), Tq = new V3();
        function onTop(u, v, off, out) { line.getPointAt(Math.max(0, Math.min(1, u)), Pq); line.getTangentAt(Math.max(0, Math.min(1, u)), Tq); var nx = -Tq.y, ny = Tq.x, q = (v - 0.5) * 2, hw = 0.0105 * (u > 0.92 ? 1 - (u - 0.92) * 3 : 1), bul = (1 - q * q) * 0.0022; return (out || new V3()).set(s * (Pq.x + nx * (off + bul)), Pq.y + ny * (off + bul) - q * q * 0.0012, q * hw); }
        var under = gridGeo(function (u, v, P2) { return onTop(u * 1.05 - 0.025, (v - 0.5) * 1.28 + 0.5, -0.0012, P2); }, sg(12, 6), 3, { col: function (u, v, c) { c.copy(LC(P.pipe)); }, out: function () { return new V3(0, 1, 0); } }); addTo(torso, under, fabV);
        var top = gridGeo(function (u, v, P2) { return onTop(u, v, 0.0012, P2); }, sg(22, 12), sg(6, 4), { col: function (u, v, c) { var ch = Math.sin(u * 52 + Math.abs(v - 0.5) * 10) * 0.5 + 0.5; c.copy(LC(P.silver)).multiplyScalar(0.55 + 0.45 * ch); if (v < 0.08 || v > 0.92) c.multiplyScalar(0.65); }, out: function () { return new V3(0, 1, 0); } });
        addTo(torso, top, toon(0xffffff, { vc: true, side: THREE.DoubleSide, rim: 0.5 }), false);
        var bp2 = onTop(0.07, 0.5, 0.0035); button(torso, bp2, new V3(0, 1, 0), 0.0042); });
      /* the peaked cap: the dark green band piped red at both edges, the field-grey crown rising to the high front (the "saddle"), piped
         red round its top; the black, glossy, drooping peak with its rim; the silver chin cords and their two buttons */
      /* (V67) the right hand closed to a fist (shown in place of the open hand for the fist-on-heart salute): the palm, the four folded
         fingers as one rounded row of knuckles and their tips tucked under, the thumb laid across */
      (function () { var sd = -1, parts = [[blob(0.026, 0.027, 0.0145, sg(16, 10)), M4([0, -0.019, 0], [0, 0, 0]), P.skin]];
        parts.push([new THREE.CapsuleGeometry(0.0118, 0.03, sg(4, 3), sg(10, 8)), M4([0, -0.043, 0.002], [0, 0, Math.PI / 2]), P.skin]);
        parts.push([new THREE.CapsuleGeometry(0.0098, 0.028, sg(4, 3), sg(10, 8)), M4([0, -0.036, 0.0145], [0, 0, Math.PI / 2]), P.skin]);
        for (var q = 0; q < 4; q++) parts.push([blob(0.0062, 0.0058, 0.0062, sg(8, 6)), M4([(q - 1.5) * 0.0118, -0.054, 0.004], [0, 0, 0]), P.skin]);
        parts.push([new THREE.CapsuleGeometry(0.0066, 0.022, sg(3, 2), sg(8, 6)), M4([-0.006 * sd, -0.033, 0.024], [0, 0, Math.PI / 2 + 0.25 * sd]), P.skin]);
        var fm2 = mesh(merge(parts), M.hand, { ink: 0.0035 }); fm2.visible = false; armR.wr.add(fm2); MU.fist = fm2; })();
      var cap = new THREE.Group(); cap.position.set(0, 0.003, -0.006); cap.rotation.x = -0.17; cap.scale.setScalar(0.975); head.add(cap); MU.cap = cap;
      var bandR = 0.1175, bzs = 1.06;
      var bandG = lathe([[0.1165, 0.034], [0.1178, 0.05], [0.1188, 0.069]], sg(64, 36)); bandG.scale(1, 1, bzs); bandG.computeVertexNormals(); addTo(cap, bandG, M.dark, 0.0026);
      function saddle(x, y, z) { var r = Math.hypot(x, z / 1.12) || 1e-6, f = Math.max(0, z / 1.12 / r), up = Math.max(0, Math.min(1, (y - 0.084) / 0.03)); return 0.021 * Math.pow(f, 2.2) * up; }
      var crP = [[0.1188, 0.069], [0.1235, 0.08], [0.137, 0.096], [0.151, 0.11], [0.1585, 0.119], [0.159, 0.1245], [0.153, 0.1295], [0.128, 0.1335], [0.08, 0.1365], [0.001, 0.1375]], crG = lathe(smoothProfile(crP, sg(18, 12)), sg(72, 40)), cp2 = crG.attributes.position;
      for (var ci = 0; ci < cp2.count; ci++) { var cx = cp2.getX(ci), cy = cp2.getY(ci), cz = cp2.getZ(ci) * 1.12; cp2.setXYZ(ci, cx, cy + saddle(cx, cy, cz), cz); } crG.computeVertexNormals(); addTo(cap, crG, M.helmet, 0.0034);
      function ring(rad, y, zz, tube, mat, sad) { var pts = [], k, N = 96; for (k = 0; k < N; k++) { var a = k / N * Math.PI * 2, x = Math.sin(a) * rad, z = Math.cos(a) * rad * zz; pts.push(new V3(x, y + (sad ? saddle(x, y, z) : 0), z)); } var tg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), sg(120, 64), tube, sg(8, 5), true); return addTo(cap, tg, mat, false); }
      ring(0.1592, 0.1205, 1.12, 0.0027, pipeM, true); ring(0.1192, 0.0688, bzs, 0.0021, pipeM, false); ring(0.1168, 0.0345, bzs, 0.0021, pipeM, false);
      var pk = gridGeo(function (u, v, P2) { var a = (u - 0.5) * 2.7, rIn = 0.1158, len = 0.057 * Math.pow(Math.cos(a * 0.58), 1.4), r = rIn + len * v, sag = 0.006 * Math.pow(Math.abs(u - 0.5) * 2, 2); return P2.set(Math.sin(a) * r, 0.0335 - (r - rIn) * 0.62 - sag * v - 0.004 * v * v, Math.cos(a) * r * bzs); }, sg(40, 24), sg(6, 4), { out: function () { return new V3(0, 1, 0.2); } });
      addTo(cap, pk, toon(LC(P.visor), { side: THREE.DoubleSide, rim: 0.7 }), 0.0024);
      var rimPts = []; for (var ri = 0; ri <= 40; ri++) { var u2 = ri / 40, a2 = (u2 - 0.5) * 2.7, len2 = 0.057 * Math.pow(Math.cos(a2 * 0.58), 1.4), r2 = 0.1158 + len2, sag2 = 0.006 * Math.pow(Math.abs(u2 - 0.5) * 2, 2); rimPts.push(new V3(Math.sin(a2) * r2, 0.0335 - len2 * 0.62 - sag2 - 0.004, Math.cos(a2) * r2 * bzs)); }
      addTo(cap, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts), sg(60, 30), 0.0016, sg(6, 4), false), toon(LC(P.visor), { rim: 0.7 }), false);
      [0.0445, 0.0525].forEach(function (y) { var pts = [], k; for (k = 0; k <= 30; k++) { var a = -1.28 + 2.56 * k / 30, rr = 0.1205; pts.push(new V3(Math.sin(a) * rr, y - 0.0018 * Math.sin(k / 30 * Math.PI), Math.cos(a) * rr * bzs)); } addTo(cap, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), sg(48, 24), 0.0021, sg(6, 4), false), silver, false); });
      [1, -1].forEach(function (s) { var a = s * 1.32, b = addTo(cap, blob(0.0052, 0.0052, 0.003, sg(12, 8)), silver, 0.0012); b.position.set(Math.sin(a) * 0.1208, 0.0485, Math.cos(a) * 0.1208 * bzs); b.rotation.y = a; });
    })();
    /* the colliders the tails rest against: the head, the shoulders, the back, the coat */
    var coll = [{ o: head, p: V(0, -0.01, 0), r: 0.128 }, MIRA ? { o: head, p: V(0, 0.065, -0.005), r: 0.12 } : { o: head, p: V(0, -0.01, 0), r: 0.128 }, { o: torso, p: V(0, 0.33, -0.01), r: 0.105 }, { o: torso, p: V(0, 0.2, -0.01), r: 0.105 }, { o: torso, p: V(0, 0.06, 0), r: 0.118 }, { o: hips, p: V(0, -0.06, 0), r: 0.105 }];
    /* the gear: sockets in the right hand, on the left forearm, on the back */
    var sockW = new THREE.Group(); sockW.position.set(0, -0.045, 0.01); armR.wr.add(sockW);
    var sockS = new THREE.Group(); sockS.position.set(0.035, -0.07, 0); armL.el.add(sockS);
    var sockC = new THREE.Group(); sockC.position.set(0, 0.36, -0.07); torso.add(sockC);
    var A = { root: root, body: body, hips: hips, torso: torso, neck: neck, head: head, face: face, faceMat: fm, legL: legL, legR: legR, armL: armL, armR: armR, tails: tails, sways: sways, coll: coll, L1: 0.235, L2: 0.228, A1: 0.13, A2: 0.15, ank: 0.027, footX: 0.05, kind: 'luna', fk: FK, fo: LFO, hip: HIP, sock: { w: sockW, s: sockS, c: sockC }, gear: {}, lq: LQ,
      t: 0, phase: 0, speed: 0, mode: 'idle', modeT: 0, blinkT: 2 + Math.random() * 2, blink: 0, expr: 'open', exprHold: 0, yawPrev: 0, vPrev: 0, jumpY: 0, squash: 0, scale: 1 };
    A.mira = MIRA; if (MU.skirt) A.skirt = MU.skirt; if (MU.cap) A.cap = MU.cap; if (MU.fist) A.fist = MU.fist;
    root.updateMatrixWorld(true); tails.forEach(function (T) { var sk = new THREE.Skeleton(T.bones); T.meshes.forEach(function (mm) { mm.bind(sk); }); });
    root.userData.A = A; curvedAll(root); return A; }

  /* ================= the people of the island ================= */
  /* ===== (V75) the people of the city, drawn to charm: a rounder, larger head on a slighter body; eyes with a sparkle and the sky's light
     in them (the same drawing as Mira's, in each one's own colour), a soft smile, glossy cheeks; hair with a real fringe of swept clumps
     and side locks, a bob, a bun, a ponytail or twin tails that swing as they walk; a round collar, buttons, a pleated skirt with socks and
     two-tone shoes; by the seed, a ribbon, round glasses, a beret, earrings, freckles. The rig (the joints, their lengths, the sockets) is
     unchanged, so every pose and the clothes of the weather still fit. ===== */
  var PSKIN = [0xf8dac8, 0xfbe4d6, 0xf3cdb2, 0xe9bb98, 0xdca383, 0xf6d6c0], PIRIS = [['#1a0f0a', '#3a2418', '#6a4a34', '#9a7a5e'], ['#0b1c3c', '#1f539e', '#4a98de', '#b4e0ff'], ['#143018', '#2e6b3a', '#5fa060', '#b9e0a8'], ['#2a1a08', '#6a4414', '#b07a2a', '#e8c070'], ['#1c1c24', '#44485a', '#7a8098', '#c8ccd8'], ['#2c0e08', '#6e2a16', '#a85a30', '#e0a070']];
  function pHash(s, k) { var x = Math.sin(s * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function buildPerson(opt) {
    var seed = opt.seed || 0, H = function (k) { return pHash(seed, k); }, P = Object.assign({}, PAL.worker, opt.pal || {}), root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.userData.kind = 'person';
    if (!(opt.pal && opt.pal.skin)) P.skin = PSKIN[Math.floor(H(1) * PSKIN.length)];
    var hairStyle = opt.hair || 'short', fem = opt.fem != null ? !!opt.fem : !!(opt.skirt || hairStyle === 'long' || hairStyle === 'bun' || hairStyle === 'bob' || hairStyle === 'pony' || hairStyle === 'twin');
    var old = (P.hair === 0x8a8a88 || P.hair === 0x9a9a98 || P.hair === 0xd8d0c8 || P.hair === 0xa8a6a0 || P.hair === 0x9a9a96 || P.hair === 0x7a7a78 || P.hair === 0x5a5a58);
    var acc = opt.accent != null ? opt.accent : [0xfff4f6, 0xf6e7c8, 0xe3000f, 0xffffff, 0x2a3a5a, 0xf0b0c0, 0xffd27a][Math.floor(H(2) * 7)];
    var hairHi = new THREE.Color(P.hair).lerp(new THREE.Color(0xffffff), 0.16).getHex();
    var M = { skin: toon(P.skin, { rim: 0.18 }), top: toon(P.suit, { rim: 0.16 }), pants: toon(P.pants || P.dark, { rim: 0.15 }), shoe: toon(P.boot, { rim: 0.12 }), sole: toon(0xf4f2ee, { rim: 0.1 }), sock: toon(0xfbfaf6, { rim: 0.1 }), hair: toon(P.hair, { rim: 0.2 }), hairHi: toon(hairHi, { rim: 0.22 }), hat: toon(opt.hat || 0xffffff, { rim: 0.2 }), acc: toon(P.emblem, { rim: 0.15 }), accent: toon(acc, { rim: 0.14 }), btn: toon(0xfaf6ee, { rim: 0.1 }), glass: toon(0x6a4a34, { rim: 0.25 }) };
    var HIP = 0.5, R = 0.116;
    var hips = new THREE.Group(); hips.position.y = HIP; body.add(hips);
    /* the legs: slim, into two-tone shoes; socks under a skirt */
    function leg(side) { var piv = new THREE.Group(); piv.position.set(0.048 * side, 0, 0); hips.add(piv); var th = mesh(lathe(smoothProfile([[0.001, 0.012], [0.047, 0.002], [0.044, -0.12], [0.038, -0.235], [0.001, -0.242]], 10), 16), opt.skirt ? M.skin : M.pants, { ink: 0.0038 }); piv.add(th);
      var knee = new THREE.Group(); knee.position.y = -0.24; piv.add(knee); knee.add(mesh(lathe(smoothProfile([[0.001, 0.012], [0.038, 0.004], [0.036, -0.1], [0.031, -0.2], [0.001, -0.206]], 10), 16), opt.skirt ? M.skin : M.pants, { ink: 0.0038 }));
      if (opt.skirt) { var sk2 = mesh(lathe(smoothProfile([[0.001, -0.12], [0.034, -0.125], [0.033, -0.2], [0.001, -0.206]], 6), 14), M.sock, { ink: 0.003 }); knee.add(sk2); }
      var ft = mesh(blob(0.042, 0.03, 0.07, 12), M.shoe, { ink: 0.0036 }); ft.position.set(0, -0.226, 0.024); knee.add(ft); var so = mesh(blob(0.044, 0.012, 0.073, 10), M.sole, { ink: 0.0024 }); so.position.set(0, -0.246, 0.024); knee.add(so);
      return { piv: piv, knee: knee, foot: ft }; }
    var legL = leg(1), legR = leg(-1);
    var torso = new THREE.Group(); torso.position.y = HIP; body.add(torso);
    var tg = lathe(smoothProfile([[0.001, -0.04], [0.086, -0.04], [0.088, 0.05], [0.079, 0.17], [0.094, 0.31], [0.087, 0.395], [0.04, 0.425], [0.001, 0.428]], 16), 24); tg.scale(1, 1, 0.74); torso.add(mesh(tg, M.top, { ink: 0.0038 }));
    /* the round collar and the buttons (not under an apron or a vest) */ if (!opt.robe) { var col = mesh(lathe([[0.03, 0.43], [0.058, 0.428], [0.062, 0.405], [0.034, 0.4]], 20), opt.apron || opt.vest ? M.top : M.accent, { ink: 0.0026 }); col.scale.set(1, 1, 0.8); torso.add(col); }
    if (!opt.apron && !opt.vest && !opt.robe) [0.33, 0.25, 0.17].forEach(function (y, k) { if (opt.skirt && k === 2) return; var b = mesh(blob(0.0075, 0.0075, 0.004, 8), M.btn, { ink: 0.0016 }); b.position.set(0, y, surfR([[0.086, -0.04], [0.088, 0.05], [0.079, 0.17], [0.094, 0.31], [0.087, 0.395]], y) * 0.74 + 0.003); torso.add(b); });
    if (opt.skirt || opt.robe) { var skg = lathe(smoothProfile([[0.001, 0.0], [0.096, 0.0], [0.12, -0.14], [opt.robe ? 0.15 : 0.15, opt.robe ? -0.45 : -0.25], [0.001, opt.robe ? -0.45 : -0.25]], 12), 36);
      if (!opt.robe) { /* the pleats: the hem waves in and out */ var sp = skg.attributes.position, v3 = new THREE.Vector3(), i4; for (i4 = 0; i4 < sp.count; i4++) { v3.fromBufferAttribute(sp, i4); var d = Math.max(0, Math.min(1, (-v3.y - 0.06) / 0.19)), th2 = Math.atan2(v3.z, v3.x), w2 = 1 + 0.07 * d * Math.sin(th2 * 9); sp.setXYZ(i4, v3.x * w2, v3.y, v3.z * w2); } skg.computeVertexNormals(); }
      var sk = mesh(skg, opt.robe ? toon(opt.robe, { rim: 0.15 }) : M.top, { ink: 0.0038 }); sk.position.y = 0.02; torso.add(sk);
      if (!opt.robe) { var belt = mesh(new THREE.TorusGeometry(0.094, 0.009, 6, 24), M.accent, { ink: 0.002 }); belt.rotation.x = Math.PI / 2; belt.position.y = 0.012; belt.scale.set(1, 0.76, 1); torso.add(belt); } }
    if (opt.apron) { var ap = mesh(rbox(0.15, 0.36, 0.012, 0.004, 2), toon(opt.apron, { rim: 0.1 }), { ink: 0.003 }); ap.position.set(0, 0.06, 0.07); torso.add(ap); var apk = mesh(rbox(0.09, 0.026, 0.008, 0.003, 2), toon(opt.apron, { rim: 0.1 }), { ink: 0.002 }); apk.position.set(0, 0.255, 0.07); torso.add(apk); }
    if (opt.vest) { var vs = mesh(lathe(smoothProfile([[0.092, -0.02], [0.096, 0.15], [0.1, 0.3], [0.09, 0.38]], 8), 24, { start: Math.PI * 0.12, len: Math.PI * 1.76 }), toon(opt.vest, { rim: 0.15, side: THREE.DoubleSide }), { ink: 0.003 }); vs.scale.set(1, 1, 0.78); vs.rotation.y = Math.PI; torso.add(vs); [0.12, 0.3].forEach(function (y) { var st = mesh(rbox(0.19, 0.016, 0.004, 0.002, 1), toon(0xf4f4f0, { rim: 0.1 }), { ink: false }); st.position.set(0, y, 0.078); st.rotation.x = -0.1; torso.add(st); }); }
    /* the arms: slim, with a little mitten of a hand */
    function arm(side) { var sh = new THREE.Group(); sh.position.set(0.098 * side, 0.372, 0); torso.add(sh); sh.add(mesh(lathe(smoothProfile([[0.001, 0.024], [0.031, 0.014], [0.028, -0.13], [0.001, -0.138]], 8), 14), M.top, { ink: 0.0036 })); var el = new THREE.Group(); el.position.y = -0.13; sh.add(el); el.add(mesh(lathe(smoothProfile([[0.001, 0.01], [0.027, 0.005], [0.025, -0.115], [0.001, -0.12]], 8), 14), M.top, { ink: 0.0036 })); var wr = new THREE.Group(); wr.position.y = -0.125; el.add(wr); var hd = mesh(blob(0.027, 0.033, 0.022, 12), M.skin, { ink: 0.0032 }); hd.position.y = -0.018; wr.add(hd); sh.rotation.z = 0.12 * side; return { sh: sh, el: el, wr: wr, hand: hd }; }
    var armL = arm(1), armR = arm(-1);
    var neck = new THREE.Group(); neck.position.y = 0.428; torso.add(neck); var nk = mesh(new THREE.CylinderGeometry(0.03, 0.034, 0.05, 12), M.skin, { ink: 0.003 }); nk.position.y = 0.012; neck.add(nk);
    var head = new THREE.Group(); head.position.y = 0.1; neck.add(head);
    var pskull = animeSkull(R); head.add(mesh(pskull, M.skin, { ink: 0.0044 })); /* (the first child: the skin, for the clothes of the weather) */
    /* the ears */ [1, -1].forEach(function (s) { var e = mesh(blob(0.012, 0.018, 0.009, 8), M.skin, { ink: 0.0024 }); e.position.set(s * R * 0.98, -0.01, -0.005); head.add(e); });
    /* the face: large bright eyes with a sparkle, a soft smile, glossy cheeks; each one's own iris colour, brows the hair's colour */
    var irisK = Math.floor(H(3) * PIRIS.length), browC = '#' + ('000000' + new THREE.Color(P.hair).lerp(new THREE.Color(0x2a1a10), 0.35).getHex().toString(16)).slice(-6);
    var fk = 'p' + seed + (opt.faceKey || '') + 'c', fo = Object.assign({ iris: PIRIS[irisK], eyeX: 0.041, eyeY: -0.024, ew: fem ? 0.0235 : 0.0212, eh: fem ? 0.0285 : 0.0252, lashW: fem ? 0.0042 : 0.0034, brow: browC, blushLines: false, cute: true, freckles: H(4) < 0.22, male: !fem, lash: fem ? '#2b160e' : '#2a1a14' }, opt.face || {});
    var fm = faceMat(faceTex('open', fk, fo)); var face = new THREE.Mesh(faceDecal(pskull), fm); face.renderOrder = 2; head.add(face);
    /* ---- the hair: a cap on the scalp, a fringe of swept clumps, side locks, and the style's own back ---- */
    var hsw = [];
    function onSk(th, y, lift) { var yy = y / (R * 1.02), rr = Math.sqrt(Math.max(0.02, 1 - yy * yy)), r1 = R * 1.05 + (lift || 0); return V(Math.sin(th) * rr * r1, y, Math.cos(th) * rr * r1 * 0.985); }
    function clump(par, p, rx, ry, rz, rot, mat, inkW) { var c = mesh(blob(rx, ry, rz, sg(12, 8)), mat || M.hair, { ink: inkW || 0.0028 }); c.position.copy(p); if (rot) c.rotation.set(rot[0], rot[1], rot[2]); par.add(c); return c; }
    if (hairStyle !== 'bald') {
      /* the cap: the crown all round, the sides and the back down to the style's length; the front is the fringe's */
      var capT = new THREE.SphereGeometry(1, sg(32, 18), sg(10, 6), 0, Math.PI * 2, 0, Math.PI * 0.36); capT.scale(R * 1.075, R * 1.09, R * 1.055); var ctm = mesh(capT, M.hair, { ink: 0.004 }); ctm.position.y = 0.004; head.add(ctm);
      var capB = new THREE.SphereGeometry(1, sg(32, 18), sg(14, 8), Math.PI * 0.72, Math.PI * 1.56, 0, Math.PI * (hairStyle === 'bob' ? 0.64 : hairStyle === 'long' ? 0.6 : hairStyle === 'short' ? 0.56 : 0.52)); capB.scale(R * 1.075, R * 1.09, R * 1.055); var cbm = mesh(capB, M.hair, { ink: 0.004 }); cbm.position.y = 0.004; head.add(cbm);
      /* the fringe: five broad, flat clumps across the brow, overlapping, swept to one side, their tips just over the brows (the longest at the parting's far side) */ var side = H(5) < 0.5 ? 1 : -1, nC = 5, c;
      for (c = 0; c < nC; c++) { var u = (c + 0.5) / nC - 0.5, th = u * 1.46, far = (u * side + 0.5), len = 0.034 + 0.016 * far + (c % 2 ? 0.004 : 0), yT = R * 0.6, top = onSk(th, yT, 0.007), pb = onSk(th, yT - len, 0.009), mid = top.clone().lerp(pb, 0.5);
        clump(head, mid, 0.03, len * 0.58, 0.012, [0.12 + Math.abs(u) * 0.2, th * 0.9, -side * 0.22 - u * 0.3]); }
      /* the side locks: down the temples, hugging the cheeks (the women's and the long style's to the jaw, the men's short) */ [1, -1].forEach(function (s) { var long = fem || hairStyle === 'long', p0 = onSk(s * 1.42, R * 0.28, 0.0), ln = long ? 0.062 : 0.034; clump(head, V(p0.x * 0.98, p0.y - ln * 0.55, p0.z + 0.004), 0.013, ln * 0.5 + 0.006, 0.02, [0.06, 0, -s * (long ? 0.06 : 0.2)]); });
      if (hairStyle === 'bob') { var bell = lathe(smoothProfile([[R * 0.98, 0.0], [R * 1.1, -0.04], [R * 1.12, -0.085], [R * 1.04, -0.115], [0.001, -0.118]], 10), 28, { start: Math.PI * 0.3, len: Math.PI * 1.4 }); bell.scale(1, 1, 0.98); var bm = mesh(bell, toon(P.hair, { rim: 0.2, side: THREE.DoubleSide }), { ink: 0.004 }); bm.position.y = 0.012; head.add(bm); }
      else if (hairStyle === 'long') { var fall = lathe(smoothProfile([[R * 0.95, 0.0], [R * 1.08, -0.06], [R * 1.12, -0.14], [R * 1.14, -0.21], [0.001, -0.215]], 10), 28, { start: Math.PI * 0.55, len: Math.PI * 0.9 }); var lm = mesh(fall, toon(P.hair, { rim: 0.2, side: THREE.DoubleSide }), { ink: 0.004 }); lm.position.y = 0.012; head.add(lm); }
      else if (hairStyle === 'bun') { var bn = clump(head, V(0, R * 0.98, -R * 0.35), 0.042, 0.036, 0.042, null, M.hair, 0.003); bn.rotation.x = -0.3; var bb = mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 16), M.accent, { ink: 0.002 }); bb.position.set(0, R * 0.9, -R * 0.26); bb.rotation.x = 1.1; head.add(bb); }
      else if (hairStyle === 'pony' || hairStyle === 'twin') { var tails = hairStyle === 'twin' ? [[-1, 0.72], [1, 2.4]] : [[0, 1.3]]; tails.forEach(function (tq) { var s = tq[0], piv = new THREE.Group(), p0 = s ? onSk(s * 1.9, R * 0.45, 0.004) : V(0, R * 0.66, -R * 0.84); piv.position.copy(p0); head.add(piv);
        var tl = mesh(lathe(smoothProfile([[0.001, 0.0], [0.028, -0.012], [0.032, -0.06], [0.024, -0.12], [0.01, -0.16], [0.001, -0.165]], 10), sg(14, 10)), M.hair, { ink: 0.0036 }); tl.position.y = 0.006; piv.add(tl); var tie = mesh(new THREE.TorusGeometry(0.022, 0.006, 6, 14), M.accent, { ink: 0.002 }); tie.rotation.x = Math.PI / 2; tie.position.y = -0.004; piv.add(tie); piv.rotation.set(s ? 0.25 : 0.42, 0, -s * 0.35); hsw.push({ piv: piv, r0: [s ? 0.25 : 0.42, -s * 0.35], amp: 0.22, ph: tq[1], a: 0, v: 0 }); }); }
      else { /* short: small tufts at the nape */ [[0.45, 0.0, 1.0], [-0.45, 0.0, -1.0]].forEach(function (q) { var p = onSk(Math.PI + q[2] * 0.5, R * 0.05, 0.002); clump(head, p, 0.018, 0.022, 0.014, [-0.35, q[0], 0]); }); } }
    /* ---- the hats ---- */
    var hat = opt.hatKind || 'hard';
    if (hat === 'hard') { var hhg = new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.5); hhg.scale(R * 1.16, R * 1.0, R * 1.16); var hm = mesh(hhg, M.hat, { ink: 0.0045 }); hm.position.y = 0.034; head.add(hm); var br = mesh(new THREE.CylinderGeometry(R * 1.25, R * 1.27, 0.012, 32), M.hat, { ink: 0.003 }); br.position.set(0, 0.034, 0.012); br.scale.set(1, 1, 1.12); head.add(br); var ridge = mesh(rbox(0.024, 0.03, R * 2.1, 0.01, 2), M.hat, { ink: 0.003 }); ridge.position.set(0, R * 1.0 + 0.034, 0); head.add(ridge); if (opt.hatMark !== false) { var st = mesh(emblemGeo(0.034, 0.06), M.acc, { ink: 0.002 }); st.position.set(0, R * 0.74, R * 0.96); st.rotation.x = -0.75; head.add(st); } }
    else if (hat === 'cap') { var cg = new THREE.SphereGeometry(1, 32, 10, 0, Math.PI * 2, 0, Math.PI * 0.44); cg.scale(R * 1.11, R * 0.98, R * 1.11); var cpm = mesh(cg, M.hat, { ink: 0.004 }); cpm.position.y = 0.036; head.add(cpm); var bill = mesh(new THREE.CylinderGeometry(R * 0.92, R * 0.92, 0.01, 24, 1, false, -Math.PI * 0.32, Math.PI * 0.64), M.hat, { ink: 0.003 }); bill.position.set(0, 0.034, 0.05); bill.rotation.x = 0.12; head.add(bill); var cb = mesh(blob(0.009, 0.009, 0.009, 8), M.hat, { ink: 0.002 }); cb.position.y = 0.036 + R * 0.98; head.add(cb); }
    else if (hat === 'band') { var tb = mesh(new THREE.TorusGeometry(R * 1.03, 0.014, 8, 32), M.hat, { ink: 0.003 }); tb.rotation.x = Math.PI / 2 - 0.12; tb.position.y = 0.045; head.add(tb); }
    else if (hat === 'eboshi') { var eb = mesh(lathe([[0.001, 0], [0.07, 0], [0.06, 0.12], [0.03, 0.17], [0.001, 0.18]], 16), M.hat, { ink: 0.003 }); eb.scale.set(1, 1, 0.6); eb.position.set(0, R * 0.75, -0.01); head.add(eb); }
    else if (hat === 'beret') { var bg = blob(R * 1.2, R * 0.42, R * 1.2, 20); var bt = mesh(bg, M.hat, { ink: 0.0036 }); bt.position.set(R * 0.1, R * 0.9, -R * 0.1); bt.rotation.z = -0.2; head.add(bt); var bs = mesh(blob(0.006, 0.012, 0.006, 6), M.hat, { ink: false }); bs.position.set(R * 0.1, R * 1.3, -R * 0.1); head.add(bs); }
    /* ---- by the seed: a ribbon, round glasses, earrings, a beret in place of no hat ---- */
    if (fem && hat === 'none' && H(6) < 0.22 && hairStyle !== 'bun' && hairStyle !== 'pony') { var bgr = blob(R * 1.18, R * 0.4, R * 1.18, 20); var bt2 = mesh(bgr, M.accent, { ink: 0.0036 }); bt2.position.set(R * 0.12, R * 0.92, -R * 0.12); bt2.rotation.z = -0.22; head.add(bt2); }
    if (fem && H(7) < 0.4 && (hairStyle === 'bob' || hairStyle === 'long' || hairStyle === 'short')) { var rb = new THREE.Group(), s2 = H(5) < 0.5 ? 1 : -1, pr = onSk(s2 * 1.15, R * 0.74, 0.02); rb.position.copy(pr); rb.lookAt(pr.clone().multiplyScalar(2)); head.add(rb); [1, -1].forEach(function (s) { var lp = mesh(blob(0.03, 0.016, 0.008, 8), M.accent, { ink: 0.002 }); lp.position.set(s * 0.027, 0.004, 0); lp.rotation.z = s * 0.3; rb.add(lp); }); var kn = mesh(blob(0.01, 0.01, 0.009, 6), M.accent, { ink: 0.0018 }); rb.add(kn); }
    if (H(8) < 0.2) { var gl = new THREE.Group(); gl.position.set(0, -0.024, R * 0.96); head.add(gl); [1, -1].forEach(function (s) { var rg = mesh(new THREE.TorusGeometry(0.0215, 0.0015, 6, 20), M.glass, { ink: false }); rg.position.x = s * 0.041; gl.add(rg); }); var bri = mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.034, 6), M.glass, { ink: false }); bri.rotation.z = Math.PI / 2; bri.position.y = 0.004; gl.add(bri); [1, -1].forEach(function (s) { var tp = mesh(new THREE.CylinderGeometry(0.0016, 0.0016, R * 0.9, 5), M.glass, { ink: false }); tp.rotation.x = Math.PI / 2; tp.position.set(s * 0.066, 0.002, -R * 0.45); gl.add(tp); }); }
    if (fem && H(9) < 0.45) [1, -1].forEach(function (s) { var er = mesh(blob(0.005, 0.007, 0.005, 6), M.accent, { ink: false }); er.position.set(s * R * 1.0, -0.026, -0.004); head.add(er); });
    if (old) { /* the elders: a touch of silver in the fringe */ head.children.forEach(function (ch) { if (ch.userData.main && ch.userData.main.material === M.hairHi) ch.userData.main.material = toon(new THREE.Color(P.hair).lerp(new THREE.Color(0xffffff), 0.3).getHex(), { rim: 0.2 }); }); }
    var sockW = new THREE.Group(); sockW.position.set(0, -0.04, 0.01); armR.wr.add(sockW);
    var A = { root: root, body: body, hips: hips, torso: torso, neck: neck, head: head, face: face, faceMat: fm, legL: legL, legR: legR, armL: armL, armR: armR, tails: [], coll: [], L1: 0.24, L2: 0.235, A1: 0.13, A2: 0.145, ank: 0.026, footX: 0.055, kind: 'person', fk: fk, fo: fo, hip: HIP, sock: { w: sockW }, gear: {}, hsw: hsw,
      t: Math.random() * 10, phase: 0, speed: 0, mode: 'idle', modeT: 0, blinkT: 2 + Math.random() * 3, blink: 0, expr: 'open', exprHold: 0, yawPrev: 0, vPrev: 0, jumpY: 0, squash: 0 };
    root.userData.A = A; curvedAll(root); return A; }
  function build(kind, opt) { opt = opt || {}; if (kind === 'luna') return buildLuna(opt); if (kind === 'worker') return buildPerson(Object.assign({ hatKind: 'hard', vest: 0xf07a12 }, opt, { pal: Object.assign({ suit: 0x2b3550 }, opt.pal || {}) })); return buildPerson(opt); }

  /* ---------- the face, the expressions ---------- */
  function expr(A, kind, hold) { A.expr = kind; A.exprHold = hold || 0; setFace(A, kind); }
  function setFace(A, kind) { var t = faceTex(kind, A.fk, A.fo); if (A.faceMat.map !== t) { A.faceMat.map = t; A.faceMat.emissiveMap = t; } }

  function lerp(a, b, k) { return a + (b - a) * k; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function wrapA(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  var _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _q = new THREE.Quaternion(), IKO = { a: 0, g: 0, e: 0 };
  /* two-bone IK in the limb's parent space: (tx, ty, tz) from the limb's root to the target; the answer as the root's rotation.x (a) and
     rotation.z (g) (Euler XYZ: the roll first, then the swing) and the middle joint's rotation.x (e): sign +1 a knee, −1 an elbow */
  function ik2(tx, ty, tz, L1, L2, sign, out) { var D0 = Math.hypot(tx, ty, tz) || 1e-6, D = clamp(D0, Math.abs(L1 - L2) + 1e-4, L1 + L2 - 1e-4), f = D / D0; tx *= f; ty *= f; tz *= f;
    var e = Math.acos(clamp((D * D - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1)) * sign, hy = -L1 - L2 * Math.cos(e), hz = -L2 * Math.sin(e);
    var gm = Math.asin(clamp(-tx / (Math.abs(hy) > 1e-6 ? hy : -1e-6), -1, 1)), Y = hy * Math.cos(gm); out.a = wrapA(Math.atan2(tz, ty) - Math.atan2(hz, Y)); out.g = gm; out.e = e; return out; }
  function limbIK(A, limb, grp, tw, L1, L2, sign) { _b.copy(tw); grp.parent.worldToLocal(_b); _b.sub(grp.position); ik2(_b.x, _b.y, _b.z, L1, L2, sign, IKO); return [IKO.a, IKO.g, IKO.e]; }
  /* ---------- poses and motion ----------
     mode: idle | walk | run | wave | cheer | victory | peace | fall | jump | hop | sit | ride | drive | attack | roll | hurt
     A.speed: units per second over the ground. The feet are placed by IK: planted through the stance (they do not slide), lifted
     and carried through the swing, the stride matched to the speed; the pelvis turns with the leg in front and the shoulders against
     it; the arms swing with the opposite leg. On a vehicle (o.mount) the hands go to the grips or the wheel and the feet to the
     floor or the pedals. */
  function update(A, dt, o) {
    o = o || {}; A.t += dt; A.modeT += dt; var t = A.t, m = A.mode, mt = A.modeT, k = 1 - Math.exp(-dt * 12), kf = 1 - Math.exp(-dt * 20);
    A.spS = lerp(A.spS || 0, A.speed, 1 - Math.exp(-dt * 9)); var sp = A.spS, runA = clamp((sp - 3.0) / 2.2, 0, 1), walkA = clamp(sp / 1.0, 0, 1);
    var yaw = A.root.rotation.y, dyaw = wrapA(yaw - A.yawPrev); A.yawPrev = yaw; var turn = dt > 0 ? clamp(dyaw / dt, -6, 6) : 0;
    var stand = ['idle', 'walk', 'run', 'wave', 'peace', 'cheer', 'victory', 'hurt', 'heavy', 'combo2', 'guard', 'drink', 'parry', 'stagger', 'smoke', 'charge', 'thrust', 'hurl'].indexOf(m) >= 0 && !o.mount, moving = (m === 'walk' || m === 'run') && sp > 0.06;
    var g = { lean: 0, bodyX: 0, bodyY: 0, bodyZ: 0, hipsY: 0, torsoY: 0, spin: 0, aL: [0, 0.21, -0.14], aR: [0, -0.21, -0.14], hX: 0, hY: 0, hZ: 0, lL: [0, 0, 0], lR: [0, 0, 0], feet: null, hands: null };
    if (stand) {
      var cad = clamp(2.6 + 0.95 * sp, 2.6, 6.4), duty = lerp(0.6, 0.34, runA); if (moving) A.gp = ((A.gp || 0) + dt * cad / 2) % 1;
      A.strideS = lerp(A.strideS || 0, moving ? Math.min(1.25, 2 * sp * duty / cad) : 0, kf);
      var foot = function (off) { var ps = ((A.gp || 0) + off) % 1, st = ps < duty, z, h = 0, s2; if (st) { s2 = ps / duty; z = A.strideS * (0.5 - s2); } else { s2 = (ps - duty) / (1 - duty); var e2 = s2 * s2 * (3 - 2 * s2); z = A.strideS * (-0.5 + e2); h = ((0.045 + 0.09 * runA) * Math.sin(Math.PI * s2) + runA * 0.05 * Math.sin(Math.PI * Math.min(1, s2 * 1.6))) * walkA; } return { z: z, h: h, st: st, s: s2 }; };
      var fL = foot(0), fR = foot(0.5), stS = fL.st ? fL.s : fR.st ? fR.s : -1, bob = (stS >= 0 ? -Math.sin(Math.PI * stS) * (0.006 + 0.02 * runA) : 0.01 * runA) * walkA;
      g.bodyY = bob - 0.016 * runA - 0.005; var swL = A.strideS > 1e-3 ? fL.z / (A.strideS * 0.5) : 0, swR = A.strideS > 1e-3 ? fR.z / (A.strideS * 0.5) : 0;
      g.hipsY = -0.09 * swL * walkA * (0.6 + 0.4 * runA); g.torsoY = 0.075 * swL * walkA; g.lean = 0.04 * walkA + 0.17 * runA;
      var amp = (0.3 + 0.55 * runA) * walkA; g.aL = [-amp * swR, 0.21 + 0.06 * runA, -(0.16 + 0.12 * walkA + 1.05 * runA) - 0.25 * Math.max(0, swR) * walkA]; g.aR = [-amp * swL, -0.21 - 0.06 * runA, -(0.16 + 0.12 * walkA + 1.05 * runA) - 0.25 * Math.max(0, swL) * walkA];
      g.hX = -g.lean * 0.55 + bob * 1.2; g.bodyZ = clamp(-turn * sp * 0.025, -0.16, 0.16);
      var wi = 1 - walkA; if (wi > 0) { var ws = Math.sin(t * 0.55), br = Math.sin(t * 2.0); g.bodyX += ws * 0.012 * wi; g.bodyY += (-Math.abs(ws) * 0.006) * wi; g.bodyZ += -ws * 0.02 * wi; g.aL[1] += br * 0.012 * wi; g.aR[1] -= br * 0.012 * wi; g.hZ = (Math.sin(t * 0.7) * 0.04 + ws * 0.02) * wi; if (A.kind === 'luna') { var lk = Math.sin(t * 0.23); g.hY = (lk > 0.85 ? 0.35 : lk < -0.9 ? -0.3 : 0) * wi; } g.hX += Math.sin(t * 0.5) * 0.025 * wi; }
      g.feet = [[A.footX + 0.008 * wi, A.ank + fL.h, fL.z + 0.008 * wi], [-A.footX - 0.008 * wi, A.ank + fR.h, fR.z - 0.012 * wi]];
    }
    if (m === 'wave') { g.aR = [-0.15, -2.6 + Math.sin(t * 9) * 0.25, -0.3 + Math.sin(t * 9 + 0.8) * 0.22]; g.aL = [0, 0.22, -0.2]; g.hZ = 0.12; g.hX = -0.04; g.bodyY = Math.sin(t * 4.5) * 0.004 - 0.004; }
    if (m === 'peace') { g.aR = [-1.4, -1.2, -1.6]; g.aL = [0, 0.26, -0.2]; g.hZ = 0.16; g.bodyZ = -0.06; }
    if (m === 'cheer' || m === 'victory') { var c2 = Math.sin(mt * 10); g.aR = [0, -2.75 + c2 * 0.12, -0.15]; g.aL = [0, 2.75 - c2 * 0.12, -0.15]; g.bodyY = Math.max(0, Math.sin(mt * 8)) * 0.05; g.hX = -0.12; if (g.feet) { g.feet[0][1] += g.bodyY; g.feet[1][1] += g.bodyY; } }
    if (m === 'hurt') { var u4 = Math.min(1, mt / 0.5); g.lean = -0.3 * Math.sin(u4 * Math.PI); g.aL = [0, 0.7, -0.3]; g.aR = [0, -0.7, -0.3]; g.hX = 0.25; if (u4 >= 1) { A.mode = 'idle'; A.modeT = 0; } }
    if (m === 'fall') { g.aL = [-0.35, 1.6 + Math.sin(t * 3) * 0.12, -0.45]; g.aR = [-0.35, -1.6 - Math.sin(t * 3.3) * 0.12, -0.45]; g.lL = [0.25 + Math.sin(t * 2.5) * 0.15, 0.18, 0.85]; g.lR = [-0.12 - Math.sin(t * 2.7) * 0.15, -0.18, 0.35]; g.hX = -0.32; }
    if (m === 'jump' || m === 'hop') { var u = Math.min(1, mt / (m === 'hop' ? 0.42 : 0.6)), sn = Math.sin(u * Math.PI); A.jumpY = sn * (m === 'hop' ? 0.45 : 0.7); g.lL = [-0.5 * sn, 0.05, 0.9 * sn + 0.05]; g.lR = [-0.3 * sn, -0.05, 0.9 * sn + 0.05]; g.aL = [0, 0.9, -0.6]; g.aR = [0, -0.9, -0.6]; if (u >= 1) { A.jumpY = 0; A.squash = 0.1; A.mode = o.after || 'idle'; A.modeT = 0; } }
    else if (m !== 'fall') A.jumpY = lerp(A.jumpY, 0, k);
    if (m === 'cower') { var cw = Math.min(1, mt / 0.35), tr = Math.sin(t * 31) * 0.03; g.lL = [-1.75 * cw, 0.18, 2.25 * cw]; g.lR = [-1.6 * cw, -0.18, 2.1 * cw]; g.bodyY = -0.34 * cw; g.lean = 0.45 * cw; g.aL = [-2.3 * cw + tr, 0.6, -2.2 * cw]; g.aR = [-2.3 * cw - tr, -0.6, -2.2 * cw]; g.hX = 0.5 * cw; g.hZ = tr * 2; }
    if (m === 'halt') { var hu = Math.min(1, mt / 0.3), swh = Math.sin(t * 5) * 0.06; g.aR = [-1.5 * hu, -0.12, -0.1 + swh]; g.aL = [-0.2, 0.25, -0.35]; g.lean = -0.04; g.hX = -0.1; g.hZ = 0; }
    if (m === 'sit') { g.lL = [-1.45, 0.06, 1.45]; g.lR = [-1.45, -0.06, 1.45]; g.bodyY = -0.2; g.aL = [-0.4, 0.2, -0.5]; g.aR = [-0.4, -0.2, -0.5]; }
    if (m === 'attack') { var u2 = Math.min(1, mt / 0.42), sw2 = u2 < 0.35 ? -u2 / 0.35 : -1 + (u2 - 0.35) / 0.65 * 2.6; g.aR = [sw2 * 1.4 - 0.4, -0.5, -0.3]; g.aL = [0, 0.6, -0.4]; g.lean = 0.18 * Math.sin(u2 * Math.PI); g.lL = [0.4, 0.06, 0.1]; g.lR = [-0.3, -0.06, 0.3]; g.spin = -0.6 * Math.sin(u2 * Math.PI); if (u2 >= 1) { A.mode = 'idle'; A.modeT = 0; } }
    if (m === 'roll') { var u3 = Math.min(1, mt / 0.5); A.rollA = u3 * Math.PI * 2; g.lL = [-1.2, 0.05, 1.3]; g.lR = [-1.2, -0.05, 1.3]; g.aL = [-1.2, 0.2, -1.4]; g.aR = [-1.2, -0.2, -1.4]; g.hX = 0.6; g.bodyY = -0.12; if (u3 >= 1) { A.rollA = 0; A.mode = 'idle'; A.modeT = 0; } } else A.rollA = 0;
    /* the fighting moves of v33 (light, second light, heavy, charge, thrust, guard, parry, backstep, the flask) and two everyday ones (a smoke, a sip of coffee on a bench) */
    function endM(u) { if (u >= 1) { A.mode = 'idle'; A.modeT = 0; } }
    if (m === 'heavy') { var hu = Math.min(1, mt / (A.heavyT || 1.0)), wu = Math.min(1, hu / 0.42), su = clamp((hu - 0.42) / 0.16, 0, 1), ru = clamp((hu - 0.6) / 0.4, 0, 1), up = wu * wu * (3 - 2 * wu) * (1 - su), dn = su * (1 - ru);
      g.aR = [-2.7 * up + 0.9 * dn, -0.35, -0.7 * up - 0.15 * dn]; g.aL = [-2.6 * up + 0.8 * dn, 0.35, -0.7 * up - 0.15 * dn]; g.lean = -0.18 * up + 0.42 * dn; g.bodyY -= 0.06 * dn; g.hX = 0.15 * dn - 0.1 * up; g.spin = 0.1 * up; endM(hu); }
    if (m === 'charge') { var cu = Math.min(1, mt / 0.5), e3 = cu * cu * (3 - 2 * cu); g.aR = [-2.7 * e3, -0.4, -0.8 * e3]; g.aL = [-2.6 * e3, 0.4, -0.8 * e3]; g.lean = -0.2 * e3; g.bodyY -= 0.03 * e3 + Math.sin(t * 30) * 0.004; }
    if (m === 'combo2') { var c2u = Math.min(1, mt / 0.42), sw3 = c2u < 0.3 ? c2u / 0.3 : 1 - (c2u - 0.3) / 0.7 * 2.2; g.aR = [-1.2 - 0.2 * sw3, -1.5 * sw3 + 0.3, -0.35]; g.aL = [0, 0.6, -0.4]; g.spin = 0.7 * Math.sin(c2u * Math.PI); g.lean = 0.14 * Math.sin(c2u * Math.PI); endM(c2u); }
    if (m === 'thrust') { var tu = Math.min(1, mt / 0.45), ex = tu < 0.35 ? -tu / 0.35 : Math.min(1, (tu - 0.35) / 0.15) * (1 - Math.max(0, tu - 0.7) / 0.3); g.aR = [-1.45 + 0.1 * ex, -0.15, -1.4 + 1.35 * Math.max(0, ex) - 0.4 * Math.max(0, -ex)]; g.aL = [-1.2, 0.2, -1.0]; g.lean = 0.28 * Math.max(0, ex); endM(tu); }
    if (m === 'guard') { g.aL = [-1.3, 0.55, -1.55]; g.aR = [-0.55, -0.42, -0.95]; g.lean = 0.12; g.bodyY -= 0.035; g.hX = 0.06; }
    if (m === 'parry') { var pu = Math.min(1, mt / 0.38), sp4 = Math.sin(pu * Math.PI); g.aL = [-1.1, 0.35 + 1.25 * sp4, -0.7]; g.aR = [-0.5, -0.4, -0.9]; g.spin = -0.35 * sp4; endM(pu); }
    if (m === 'drink') { var du = Math.min(1, mt / 1.1), ds = Math.sin(Math.min(1, du * 1.25) * Math.PI); g.aR = [-1.55 * ds, -0.25, -2.1 * ds]; g.aL = [-0.2, 0.3, -0.4]; g.hX = -0.32 * ds; endM(du); }
    if (m === 'stagger') { var gu = Math.min(1, mt / 0.7), gs2 = Math.sin(gu * Math.PI); g.lean = -0.38 * gs2; g.aL = [0.3, 0.9 * gs2, -0.4]; g.aR = [0.3, -0.9 * gs2, -0.4]; g.hX = 0.3 * gs2; g.bodyZ = 0.12 * gs2; endM(gu); }
    if (m === 'backstep') { var bu = Math.min(1, mt / 0.38), bs = Math.sin(bu * Math.PI); A.jumpY = 0.12 * bs; g.lean = -0.25 * bs; g.lL = [0.5 * bs, 0.06, 0.6 * bs]; g.lR = [0.3 * bs, -0.06, 0.6 * bs]; g.aL = [0.4, 0.6, -0.5]; g.aR = [0.4, -0.6, -0.5]; endM(bu); }
    if (m === 'smoke') { var sc = (t % 7.0), at = sc < 1.8 ? Math.sin(Math.min(1, sc / 1.8) * Math.PI) : 0; g.aR = [-0.25 - 1.35 * at, -0.3 - 0.1 * at, -0.7 - 1.55 * at]; g.hX += -0.06 * at; }
    if (m === 'sip') { g.lL = [-1.45, 0.08, 1.45]; g.lR = [-1.45, -0.08, 1.45]; g.bodyY = -0.2; g.feet = null; var sc2 = (t % 8.0), at2 = sc2 < 1.6 ? Math.sin(Math.min(1, sc2 / 1.6) * Math.PI) : 0; g.aR = [-0.75 - 0.85 * at2, -0.22, -1.0 - 1.3 * at2]; g.aL = [-0.55, 0.18, -0.75]; g.hX = 0.08 - 0.12 * at2; g.hY = Math.sin(t * 0.3) * 0.25; }
    /* (v44) the hurl: both hands take the board overhead and back (the body arched, a step back on the right), then it is slung forward
       with the whole body — a lunge onto the left foot, the arms out ahead, the head following the throw; held a moment, then idle.
       A.hurlT sets the length (default 1.1 s); the release is at 45 % of it */
    /* (V76) 'toss': the stick grenade's throw, one-armed, overhand. A.tossP = [pull, cock, throw, follow] seconds. Pull: both hands at the
       chest, the left draws the cord down and away. Cock: the right arm back and up behind the shoulder, elbow bent, the trunk turned to the
       right, the weight on the right foot, the left arm out towards the mark, eyes on it. Throw: the hips lead, the trunk turns through, the
       left foot steps in, the arm whips over the top and lets go. Follow-through: the arm swings down across the body, the trunk comes back. */
    if (m === 'toss') { var tp = A.tossP || [0.14, 0.22, 0.14, 0.4], tT = tp[0] + tp[1] + tp[2] + tp[3], ss = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
      var pu = ss(mt / tp[0]), co = ss((mt - tp[0]) / tp[1]), th = ss((mt - tp[0] - tp[1]) / (tp[2] * 0.85)), fo = ss((mt - tp[0] - tp[1] - tp[2]) / tp[3]);
      /* the right arm: at the chest; back and up; over the top; down across */ var rx = -0.95 * (1 - co) - 2.3 * co, rz = -0.3 * (1 - co) - 0.55 * co, re = -1.45 * (1 - co) - 1.9 * co; if (th > 0) { rx = -2.3 * (1 - th) - 0.75 * th; rz = -0.55 * (1 - th) - 0.35 * th; re = -1.9 * (1 - th) - 0.25 * th; } if (fo > 0) { rx = -0.75 * (1 - fo) + 0.25 * fo; rz = -0.35 * (1 - fo) - 0.18 * fo; re = -0.25 * (1 - fo) - 0.35 * fo; }
      g.aR = [rx, rz, re];
      /* the left: on the cord, drawn down and back; then out at the mark; then tucked in */ var lx = -0.85 * (1 - pu) - 0.25 * pu, lz = 0.25 * (1 - pu) + 0.5 * pu, le = -1.5 * (1 - pu) - 0.7 * pu; if (co > 0) { lx = -0.25 * (1 - co) - 1.15 * co; lz = 0.5 * (1 - co) + 0.28 * co; le = -0.7 * (1 - co) - 0.25 * co; } if (th > 0) { lx = -1.15 * (1 - th) - 0.4 * th; lz = 0.28; le = -0.25 * (1 - th) - 0.95 * th; } if (fo > 0) { lx = -0.4 * (1 - fo) + 0.0 * fo; lz = 0.28 * (1 - fo) + 0.2 * fo; le = -0.95 * (1 - fo) - 0.35 * fo; }
      g.aL = [lx, lz, le];
      /* the trunk and the feet: turned right and back on the cock, through to the left and forward on the throw, square again after */ var tw = -0.45 * co + (0.45 + 0.4) * th - 0.4 * fo, ln = -0.12 * co + 0.4 * th - 0.3 * fo, stp = 0.3 * th - 0.12 * fo;
      g.torsoY = tw; g.hipsY = tw * 0.45; g.lean = ln; g.hY = -tw * 0.85; g.hX = -0.12 * co + 0.18 * th - 0.1 * fo; g.bodyY -= 0.02 * co + 0.05 * th - 0.03 * fo; g.spin = 0;
      g.feet = [[A.footX + 0.015, A.ank, 0.06 + stp], [-A.footX - 0.03, A.ank, -0.08 - 0.08 * co + 0.04 * th]]; if (mt >= tT) { A.mode = 'idle'; A.modeT = 0; } }
    if (m === 'hurl') { var hT = A.hurlT || 1.1, hu = Math.min(1, mt / hT), wu = Math.min(1, hu / 0.38), su = clamp((hu - 0.38) / 0.14, 0, 1), ru = clamp((hu - 0.78) / 0.22, 0, 1), up = wu * wu * (3 - 2 * wu) * (1 - su), fw = su * (1 - ru * 0.5);
      g.aR = [-2.9 * up - 1.3 * fw, -0.3 - 0.25 * fw, -0.45 * up - 0.35 * fw]; g.aL = [-2.9 * up - 1.3 * fw, 0.3 + 0.25 * fw, -0.45 * up - 0.35 * fw]; g.lean = -0.28 * up + 0.4 * fw; g.hX = -0.3 * up + 0.12 * fw; g.bodyY -= 0.03 * up + 0.08 * fw; g.spin = 0.12 * up - 0.1 * fw;
      g.feet = [[A.footX + 0.02, A.ank, 0.42 * fw - 0.05 * up], [-A.footX - 0.03, A.ank, -0.34 * up - 0.3 * fw]]; if (hu >= 1) { A.mode = 'idle'; A.modeT = 0; } }
    /* (v42) on the chemistry glider: a low, wide stance (the left foot forward), arms out for balance, a sway with the air; o.surf: { bank, wave, look, point } */
    if (m === 'surf') { var sv = o.surf || {}, sw5 = Math.sin(t * 1.9), sb5 = Math.sin(t * 3.1); g.feet = [[A.footX + 0.07, A.ank, 0.15], [-A.footX - 0.07, A.ank, -0.13]]; g.bodyY = -0.085 + sb5 * 0.01; g.lean = 0.14; g.bodyZ = sw5 * 0.04 + (sv.bank || 0); g.hipsY = 0.22; g.torsoY = -0.16; g.aL = [0.1, 1.25 + sw5 * 0.1, -0.3]; g.aR = [0.1, -1.25 + sw5 * 0.1, -0.3]; g.hX = -0.12; g.hY = sv.look || -0.1;
      if (sv.wave) g.aR = [-0.15, -2.6 + Math.sin(t * 9) * 0.25, -0.3 + Math.sin(t * 9 + 0.8) * 0.22]; if (sv.point) g.aR = [-1.5, -0.3, -0.1];
      /* (v44) more of her on the board: crouched low for speed (knees deep, a hand on the rail), a hand shading her eyes to the horizon, arms
         flung wide, a fist punched up; sv.k blends the crouch */
      if (sv.crouch) { var ck = sv.crouch; g.bodyY -= 0.16 * ck; g.lean += 0.22 * ck; g.feet = [[A.footX + 0.1, A.ank, 0.2], [-A.footX - 0.09, A.ank, -0.18]]; g.aL = [-0.3 * ck + 0.1, 1.25 - 0.5 * ck, -0.3 - 0.4 * ck]; g.aR = [0.5 * ck + 0.1, -1.25 + 0.95 * ck, -0.3 - 1.2 * ck]; g.hX = -0.3 * ck; }
      if (sv.shade) { g.aR = [-2.05, -0.85, -2.25]; g.hX = -0.22; g.hY = (sv.look || 0) + 0.25; }
      if (sv.wide) { g.aL = [0.15, 1.6, -0.08]; g.aR = [0.15, -1.6, -0.08]; g.hX = -0.3; g.lean = 0.02; }
      if (sv.pump) { var pk = Math.sin(t * 11); g.aR = [-2.55 + pk * 0.15, -0.45, -1.55 + pk * 0.2]; g.hX = -0.25; } }
    /* (v43) seated on the grass: the knees up, the feet flat in front, leaning back a little on the hand behind her, the other hand resting on
       the knee; a slow breath, the head tilted; o.lawn: { wave } lifts the hand from the grass to wave */
    if (m === 'lawn') { var lw = o.lawn || {}, brl = Math.sin(t * 1.7), shl = A.seatH == null ? 0.09 : A.seatH;
      g.bodyY = -(A.hip - shl) + brl * 0.0015; g.lean = -0.12 + brl * 0.006; g.feet = A.lawnFeet || [[A.footX + 0.04, A.ank, 0.56], [-A.footX - 0.035, A.ank, 0.5]];
      g.hX = 0.05 + Math.sin(t * 0.31) * 0.02; g.hZ = 0.085 + Math.sin(t * 0.4) * 0.03; var hl = A.lawnHL || [0.1, 0.345, 0.385], hr = lw.wave ? [-0.25 + Math.sin(t * 9) * 0.045, 0.84, 0.1] : (A.lawnHR || [-0.225, 0.115, -0.125]);
      A._hl = A._hl || new THREE.Vector3(); A._hr = A._hr || new THREE.Vector3(); g.hands = [A.root.localToWorld(A._hl.set(hl[0], hl[1], hl[2])), A.root.localToWorld(A._hr.set(hr[0], hr[1], hr[2]))]; }
    if (o.mount) { var mo = o.mount; g.lean = mo.lean || 0; g.hX = mo.headX || -0.05; g.bodyZ = 0; g.hands = mo.hands; g.feet = null; g.feetW = mo.feet; g.aL = [-1.0, 0.25, -0.4]; g.aR = [-1.0, -0.25, -0.4]; if (mo.look) g.hY = mo.look; }
    /* (V63) Mira's bearing: upright, a firm, nearly straight-armed swing on the march; at rest the hands behind her back (parade rest);
       a greeting is a military salute, the fingertips of the right hand to the peak of her cap */
    if (A.mira && !o.mount) {
      /* (V64) a weapon in her hands: both hands to its grips by IK, standing square to it */
      if (A.grip && m !== 'attack') { A._gw = A._gw || [new THREE.Vector3(), new THREE.Vector3()]; g.hands = [A.grip.L ? A.grip.L.getWorldPosition(A._gw[0]) : null, A.grip.R ? A.grip.R.getWorldPosition(A._gw[1]) : null]; g.lean = 0.05; g.hX = -0.03; g.hY = 0; g.torsoY = 0; g.hipsY = 0; }
      /* (V76) the stance a weapon asks for, set by its code: the trunk bladed to the target, the weight forward on staggered feet, the head down to the sights; the recoil taken in the shoulder and the trunk */
      if (A.poseX) { var px = A.poseX; ['torsoY', 'hipsY', 'lean', 'hX', 'hY', 'hZ', 'spin'].forEach(function (kq) { if (px[kq] != null) g[kq] = px[kq]; }); if (px.bodyY != null) g.bodyY += px.bodyY; if (px.feet) g.feet = px.feet; if (px.aL && !(g.hands && g.hands[0])) g.aL = px.aL; if (px.aR && !(g.hands && g.hands[1])) g.aR = px.aR; }
      if (A.recoil > 0) { A.recoil = Math.max(0, A.recoil - dt * 9); g.lean -= A.recoil * 0.05; g.hX += A.recoil * 0.04; g.bodyY -= A.recoil * 0.006; }
      if (stand && moving) { var am2 = (0.44 + 0.5 * runA) * walkA; g.aL[0] = -am2 * swR; g.aR[0] = -am2 * swL; if (runA < 0.6) { g.aL[2] = -0.08 - 0.16 * Math.max(0, swR) * walkA - 0.9 * runA; g.aR[2] = -0.08 - 0.16 * Math.max(0, swL) * walkA - 0.9 * runA; } g.lean *= 0.55; g.hX -= 0.025; }
      /* (V66) her normal stance is the military hand salute: heels together, upright, chin up, the right hand raised so the fingertips touch
         the right edge of the cap's peak, the forearm angled up and forward, the left arm straight down at the side (holding the umbrella if it
         rains); the arm comes up smartly when she stops. A greeting is the same salute. */
      var sal = m === 'wave' || m === 'peace' || (m === 'idle' && !A.holdR && !g.hands && !o.noSalute);
      if (sal) { A._sl = A._sl || new THREE.Vector3(); var su2 = Math.min(1, mt / 0.32), se2 = su2 * su2 * (3 - 2 * su2), br3 = m === 'idle' ? Math.sin(t * 1.5) * 0.0015 : 0; if (!A.holdL) g.aL = [0.03, 0.15, -0.06]; A.head.updateMatrixWorld(true);
        g.hands = [null, A.head.localToWorld(A._sl.set(-0.128 - 0.03 * (1 - se2), -0.012 - 0.15 * (1 - se2) + br3, 0.104 - 0.04 * (1 - se2)))]; g.hZ = 0.02; g.hX = -0.05; g.hY = 0; g.bodyZ = 0; g.lean = -0.025; g.torsoY = 0; g.hipsY = 0; if (g.feet) { g.feet[0][2] = 0; g.feet[1][2] = 0; } }
      /* (V67) now and then, standing at rest, the second salute: the right hand closed to a fist and laid on the heart, the left hand behind
         the back, chin up; held for a few seconds, then back to the hand salute. A pose only: no words, no name, no badge. */
      var hs = A._hs || (A._hs = { t: 5 + Math.random() * 5, on: 0, k: 0, F: [new THREE.Vector3(), new THREE.Vector3()] });
      if (sal && m === 'idle' && !A.holdL) { if (hs.on > 0) { hs.on -= dt; if (hs.on <= 0) hs.t = 8 + Math.random() * 10; } else { hs.t -= dt; if (hs.t <= 0) { if (Math.random() < 0.5 || window.ISLE_HEART) hs.on = 3.4 + Math.random() * 1.8; else hs.t = 4 + Math.random() * 6; } } } else { hs.on = 0; hs.t = Math.max(hs.t, 3); }
      if (window.ISLE_HEART && sal && m === 'idle' && !A.holdL) hs.on = Math.max(hs.on, 1);
      hs.k += ((hs.on > 0 ? 1 : 0) - hs.k) * Math.min(1, dt * 6); var hk = hs.k * hs.k * (3 - 2 * hs.k);
      /* (V70) now and then at the salute: her head tilts and she smiles or winks */ var chm = A._ch || (A._ch = { t: 3 + Math.random() * 4, on: 0, k: 0 });
      if (sal && m === 'idle' && hk < 0.05 && !A.holdL) { if (chm.on > 0) chm.on -= dt; else { chm.t -= dt; if (chm.t <= 0 || window.ISLE_CHARM) { chm.on = 1.5; chm.t = 6 + Math.random() * 7; expr(A, window.ISLE_CHARM || (Math.random() < 0.5 ? 'wink' : 'happy'), 1.5); } } } else chm.on = 0;
      chm.k += ((chm.on > 0 ? 1 : 0) - chm.k) * Math.min(1, dt * 7); if (chm.k > 0.01) { var ck2 = chm.k * chm.k * (3 - 2 * chm.k); g.hZ += 0.17 * ck2; g.hX += 0.045 * ck2; }
      if (A.fist) { A.fist.visible = hk > 0.5; if (A.armR.hand) A.armR.hand.visible = hk <= 0.5; }
      /* the right arm by its angles (the upper arm turned in, so the forearm lies level across the chest and the fist on the left breast:
         solved once against the rig); the left wrist by IK to the small of the back */
      A.armR.sh.rotation.y = 1.284 * (sal && m === 'idle' ? hk : 0);
      if (hk > 0.02 && sal && m === 'idle') { A.torso.updateMatrixWorld(true); var br4 = Math.sin(t * 1.5) * 0.02;
        var hL = A.torso.localToWorld(hs.F[0].set(-0.012, 0.13, -0.135)); if (hk > 0.35) { g.hands = [hL, null]; g.aR = [0.429 + br4, -1.484, -1.78]; } else { g.hands = [null, g.hands[1]]; }
        g.hX = -0.07 * hk - 0.05 * (1 - hk); g.lean = -0.03; }
    } else if (A.mira && A.fist && (A.fist.visible || A.armR.sh.rotation.y)) { A.fist.visible = false; A.armR.hand.visible = true; A.armR.sh.rotation.y = 0; if (A._hs) { A._hs.on = 0; A._hs.k = 0; } }
    /* apply: the body, the pelvis, the trunk, the head */
    A.squash = Math.max(0, A.squash - dt * 0.9); var by = g.bodyY + A.jumpY - A.squash * 0.22;
    A.body.position.y = (m === 'jump' || m === 'hop') ? by : lerp(A.body.position.y, by, kf); A.body.position.x = lerp(A.body.position.x, g.bodyX, k);
    A.body.scale.set(1 + A.squash * 0.5, 1 - A.squash, 1 + A.squash * 0.5); A.body.rotation.x = A.rollA || 0; A.body.rotation.y = lerp(A.body.rotation.y, g.spin, k); A.body.rotation.z = lerp(A.body.rotation.z, g.bodyZ, k);
    A.hips.rotation.y = lerp(A.hips.rotation.y, g.hipsY, kf); A.torso.rotation.y = lerp(A.torso.rotation.y, g.torsoY, kf);
    A.torso.rotation.x = lerp(A.torso.rotation.x, g.lean, k); A.torso.rotation.z = lerp(A.torso.rotation.z, -A.body.rotation.z * 0.4, k);
    A.head.rotation.x = lerp(A.head.rotation.x, g.hX, k * 0.7); A.head.rotation.z = lerp(A.head.rotation.z, g.hZ, k * 0.6); A.head.rotation.y = lerp(A.head.rotation.y, (o.look || 0) + g.hY, k * 0.4);
    A.root.updateMatrixWorld(true);
    /* the legs: by IK to the feet, or by the pose */
    var ikOn = !!(g.feet || g.feetW); A.ikW = clamp((A.ikW || 0) + (ikOn ? dt : -dt) * 7, 0, 1);
    [[A.legL, 0], [A.legR, 1]].forEach(function (q) { var L = q[0], tg = g.lL; if (q[1]) tg = g.lR;
      if (ikOn) { var tw = g.feetW ? g.feetW[q[1]] : A.root.localToWorld(_c.set(g.feet[q[1]][0], g.feet[q[1]][1], g.feet[q[1]][2])); tg = limbIK(A, L, L.piv, tw, A.L1, A.L2, 1); }
      var kk = ikOn && A.ikW >= 1 ? 1 : ikOn ? Math.max(k, A.ikW) : k; L.piv.rotation.x = lerp(L.piv.rotation.x, tg[0], kk); L.piv.rotation.z = lerp(L.piv.rotation.z, tg[1], kk); L.knee.rotation.x = lerp(L.knee.rotation.x, tg[2], kk);
      if (L.foot) L.foot.rotation.x = lerp(L.foot.rotation.x, ikOn ? -(L.piv.rotation.x + L.knee.rotation.x) * 0.85 : 0, kk); });
    /* the arms: to the grips by IK, or by the pose; never through the coat */
    /* (v36.2) a hand that holds something up (an umbrella, a guard, a stance) */ if (A.holdR && !(g.hands && g.hands[1]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll', 'toss'].indexOf(m) < 0) g.aR = A.holdR; if (A.holdL && !(g.hands && g.hands[0]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll', 'toss'].indexOf(m) < 0) g.aL = A.holdL;
    [[A.armL, g.aL, 0, 1], [A.armR, g.aR, 1, -1]].forEach(function (q) { var Ar = q[0], tg = q[1];
      if (g.hands && g.hands[q[2]]) { tg = limbIK(A, Ar, Ar.sh, g.hands[q[2]], A.A1, A.A2, -1); }
      else if (Math.abs(tg[0]) < 0.6) tg = [tg[0], q[3] > 0 ? Math.max(tg[1], 0.17) : Math.min(tg[1], -0.17), tg[2]];
      var kk = (m === 'attack' || m === 'combo2' || m === 'thrust') && q[2] === 1 ? Math.min(1, k * 2.5) : (m === 'heavy' || m === 'parry') ? Math.min(1, k * 2.2) : g.hands ? kf : k; Ar.sh.rotation.x = lerp(Ar.sh.rotation.x, tg[0], kk); Ar.sh.rotation.z = lerp(Ar.sh.rotation.z, tg[1], kk); Ar.el.rotation.x = lerp(Ar.el.rotation.x, tg[2], kk); });
    /* the twin tails on their spring bones */
    springTails(A, dt, o); if (A.skirt) skirtTick(A, dt);
    if (A.gear && A.gear.cape) { var cp = A.gear.cape; cp.rotation.x = lerp(cp.rotation.x, 0.1 + walkA * 0.35 + runA * 0.4 + (o.vehSpeed ? Math.min(1, o.vehSpeed / 12) * 0.9 : 0) + (m === 'fall' ? 1.2 : 0) + Math.sin(t * 3) * 0.03, k); }
    /* blink (a half-lid between open and closed), and the expressions that hold */
    /* (V75) the tails and locks of the people's hair: a lag behind the walk's bob and the turns, a light swing at rest */ if (A.hsw && A.hsw.length) { var hb = Math.sin(((A.gp || 0) * 2) * Math.PI * 2) * A.strideS * 0.35, hy = turn * 0.05; A.hsw.forEach(function (S) { var tg = hb * S.amp + Math.sin(t * 1.1 + S.ph) * 0.03 + (m === 'run' ? 0.3 : 0) * walkA; var acc = (tg - S.a) * 70 - S.v * 9; S.v += acc * dt; S.a += S.v * dt; S.piv.rotation.x = S.r0[0] - S.a; S.piv.rotation.z = S.r0[1] + hy + Math.sin(t * 0.9 + S.ph) * 0.02; }); }
    if (A.exprHold > 0) { A.exprHold -= dt; if (A.exprHold <= 0) { A.expr = 'open'; setFace(A, 'open'); } }
    else { A.blinkT -= dt; if (A.blinkT <= 0) { A.blink = 0.16; A.blinkT = 2.2 + Math.random() * 3.2; } if (A.blink > 0) { A.blink -= dt; var bp = A.blink; setFace(A, bp > 0.12 || bp < 0.04 ? 'half' : bp > 0 ? 'closed' : A.expr); if (A.blink <= 0) setFace(A, A.expr); } }
  }
  /* the strands of the twin tails: chains of Verlet points, each pulled towards where the rigid strand would hang (less and less towards the
     tip), by gravity, by the air she moves through (the drag of her own speed, a flutter that grows with it), by the wind of a ride; kept at
     their lengths, kept from folding back on themselves, pushed out of the head, the back and the coat; the bones then turned to follow */
  var _v = new THREE.Vector3(), _w = new THREE.Vector3();
  function springTails(A, dt, o) {
    if (!A.tails.length || !A.tails[0].bones) return; var i, j, w = o.wind, rs = A.root.scale.x || 1, ultra = (A.lq || 0) >= 3;
    var cols = A.coll.map(function (c) { var ws = c.o.getWorldScale(_c).x; return { p: c.o.localToWorld(c.p.clone()), r: c.r * ws }; }); if (o.colliders) cols = cols.concat(o.colliders);
    /* her own motion through the air (the pivot's, so a turn of the head counts too) */ var pv = A.tails[0].piv.getWorldPosition(_v); if (!A.pPrev || dt <= 0) { A.pPrev = pv.clone(); A.vAir = new THREE.Vector3(); } else { _w.copy(pv).sub(A.pPrev).divideScalar(Math.max(dt, 1e-3)); var vl = _w.length(); if (vl > 14) _w.multiplyScalar(14 / vl); A.vAir.lerp(_w, 1 - Math.exp(-dt * 10)); A.pPrev.copy(pv); }
    var spd = A.vAir.length(), sub = ultra ? 2 : 1, h = dt / sub, gy = A.mode === 'fall' ? 2.4 : -3.6, tt = A.t || 0;
    A.tails.forEach(function (T) { var piv = T.piv, NB = T.bones.length, ws = piv.getWorldScale(_c).x, root = piv.localToWorld(_a.copy(T.rest[0])), kS = T.kS || 1, air = T.air || 1, ph = T.ph || 0;
      if (!T.p || T.p[0].distanceTo(root) > 0.5 || dt <= 0) { T.p = T.rest.map(function (r) { return piv.localToWorld(r.clone()); }); T.q = T.p.map(function (v) { return v.clone(); }); T.len = []; for (i = 1; i < NB; i++) T.len.push(T.rest[i].distanceTo(T.rest[i - 1]) * ws); T.rw = T.rest.map(function (r) { return r.clone(); }); }
      T.p[0].copy(root); T.q[0].copy(root); for (i = 1; i < NB; i++) piv.localToWorld(T.rw[i].copy(T.rest[i]));
      for (var st = 0; st < sub; st++) { var stiff = 1 - Math.exp(-h * 7.0 * kS), drag = 1 - Math.exp(-h * (5.0 + spd * 0.3));
        for (i = 1; i < NB; i++) { var P0 = T.p[i], Q0 = T.q[i], rw = T.rw[i], u = i / (NB - 1), vx = (P0.x - Q0.x) * (1 - drag), vy = (P0.y - Q0.y) * (1 - drag), vz = (P0.z - Q0.z) * (1 - drag), vm = Math.hypot(vx, vy, vz); if (vm > 0.05) { vx *= 0.05 / vm; vy *= 0.05 / vm; vz *= 0.05 / vm; } var nx = P0.x + vx, ny = P0.y + vy, nz = P0.z + vz, sk = stiff * (1.25 - u * 0.55);
          nx += (rw.x - P0.x) * sk; ny += (rw.y - P0.y) * sk + gy * h * h * (0.3 + 0.5 * u); nz += (rw.z - P0.z) * sk;
          /* the air: her speed pushes the strand back, more towards the tip; a flutter that grows with speed, each strand on its own phase */ var ak = air * h * h * (0.2 + 0.8 * u) * 1.1; nx -= A.vAir.x * ak; ny -= A.vAir.y * ak * 0.25; nz -= A.vAir.z * ak;
          if (spd > 0.3) { var fl = Math.min(1, spd / 5) * h * h * 0.8 * u; nx += Math.sin(tt * 11 + ph + i * 0.9) * fl; ny += Math.sin(tt * 8.5 + ph * 1.3 + i * 1.1) * fl * 0.7; nz += Math.cos(tt * 9.5 + ph + i * 0.7) * fl * 0.6; }
          if (w) { nx += w.x * h * h; ny += w.y * h * h; nz += w.z * h * h; }
          Q0.copy(P0); P0.set(nx, ny, nz); }
        for (j = 0; j < 3; j++) { for (i = 1; i < NB; i++) { var Pi = T.p[i]; _c.copy(Pi).sub(T.p[i - 1]).setLength(T.len[i - 1]); Pi.copy(T.p[i - 1]).add(_c);
            if (i >= 2) { /* no folding back: a point keeps away from the one before last */ _c.copy(Pi).sub(T.p[i - 2]); var d2 = _c.length(), mn = (T.len[i - 1] + T.len[i - 2]) * 0.82; if (d2 < mn && d2 > 1e-6) Pi.copy(T.p[i - 2]).add(_c.multiplyScalar(mn / d2)); }
            for (var ci = 0; ci < cols.length; ci++) { var c = cols[ci]; _c.copy(Pi).sub(c.p); var d = _c.length(), rr = c.r + 0.022 * rs; if (d < rr && d > 1e-6) Pi.copy(c.p).add(_c.multiplyScalar(rr / d)); } } } }
      for (i = 0; i < NB - 1; i++) { var bn = T.bones[i]; bn.parent.getWorldQuaternion(_q); _q.invert(); _a.copy(T.bones[i + 1].position).normalize(); _b.copy(T.p[i + 1]).sub(T.p[i]).normalize().applyQuaternion(_q); bn.quaternion.setFromUnitVectors(_a, _b); bn.updateMatrixWorld(true); } });
    /* the fringe's tuft and the side locks: on their pivots, a spring answering her motion, a small flutter at speed */
    if (A.sways && A.sways.length) { var vLoc = _w.copy(A.vAir); A.head.getWorldQuaternion(_q); _q.invert(); vLoc.applyQuaternion(_q);
      A.sways.forEach(function (S) { var tg = Math.max(-0.35, Math.min(0.35, -vLoc.z * 0.055 * S.amp / 0.05 + vLoc.y * 0.03)) + (spd > 0.3 ? Math.sin(tt * 12 + S.ph) * Math.min(1, spd / 5) * S.amp * 1.4 : 0) + Math.sin(tt * 1.3 + S.ph) * 0.012; var acc = (tg - S.a) * 90 - S.v * 11; S.v += acc * dt; S.a += S.v * dt; S.piv.rotation.x = S.a; S.piv.rotation.z = -vLoc.x * 0.04 * (S.amp / 0.05); }); } }
  function setMode(A, m) { if (A.mode === m) return; A.mode = m; A.modeT = 0; if (m === 'wave' || m === 'cheer' || m === 'victory' || m === 'peace') expr(A, 'happy', 1.6); if (m === 'fall') expr(A, 'wide', 999); if (m === 'attack') expr(A, 'shout', 0.5); if (m === 'hurt') expr(A, 'hurt', 0.8); if (m === 'cower') expr(A, 'hurt', 999); if (m === 'halt') expr(A, 'shout', 1.4); }
  /* the gear: weapon, shield, cape (meshes built by PROPS), attached to the sockets */
  function setGear(A, slot, obj) { var sock = slot === 'w' ? A.sock.w : slot === 's' ? A.sock.s : A.sock.c; if (!sock) return; while (sock.children.length) sock.remove(sock.children[0]); if (obj) { sock.add(obj); curvedAll(obj); } A.gear[slot === 'c' ? 'cape' : slot] = obj || null; if (slot === 'c' && obj) A.gear.cape = obj; }

  /* ================= the orange droplet of the masking tape ================= */
  function droplet(o) {
    o = o || {}; var root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    var pts = [], i, n = 30; for (i = 0; i <= n; i++) { var a = i / n, y, r; if (a < 0.7) { var th = a / 0.7 * Math.PI * 0.62; y = 0.21 - Math.cos(th) * 0.21; r = Math.sin(th) * 0.25; } else { var u = (a - 0.7) / 0.3, r0 = Math.sin(Math.PI * 0.62) * 0.25, y0 = 0.21 - Math.cos(Math.PI * 0.62) * 0.21; y = y0 + u * 0.13; r = r0 * Math.pow(1 - u, 0.9); } pts.push([Math.max(0.0001, r), y]); }
    pts[0][0] = 0.0001; pts[n][0] = 0.0001; var g = lathe(pts, 36); var bm = mesh(g, toon(o.color || 0xf27c18), { ink: 0.008 }); body.add(bm);
    var fw = 1.9, fg = new THREE.SphereGeometry(1, 32, 16, Math.PI / 2 - fw / 2, fw, Math.PI * 0.32, Math.PI * 0.34); fg.scale(0.253, 0.215, 0.253); var c = document.createElement('canvas'); c.width = 256; c.height = 128; var x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(128, 64, 120, 58, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#2b2420'; x.beginPath(); x.ellipse(92, 62, 11, 16, 0, 0, Math.PI * 2); x.fill(); x.beginPath(); x.ellipse(164, 62, 11, 16, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(88, 56, 4, 0, 7); x.fill(); x.beginPath(); x.arc(160, 56, 4, 0, 7); x.fill(); x.strokeStyle = '#2b2420'; x.lineWidth = 4; x.beginPath(); x.arc(128, 80, 9, 0.2, Math.PI - 0.2); x.stroke();
    var ft = new THREE.CanvasTexture(c); ft.encoding = THREE.sRGBEncoding; var face = new THREE.Mesh(fg, new THREE.MeshToonMaterial({ map: ft, transparent: true, gradientMap: grad(), polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })); face.position.y = 0.21; body.add(face);
    var em = mesh(emblemGeo(0.11, 0.1), toon(0xffffff), { ink: 0.004 }); em.position.set(0, 0.39, 0.1); em.rotation.x = -0.75; body.add(em);
    root.userData.D = { root: root, body: body, t: Math.random() * 10 }; curvedAll(root); return root.userData.D; }
  function updateDrop(D, dt) { D.t += dt; var h = Math.abs(Math.sin(D.t * 2.2)); D.body.position.y = h * 0.08; var sq = 1 - (1 - h) * 0.1; D.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)); }

  return { build: build, update: update, setMode: setMode, setQuality: setQuality, quality: function () { return LQ; }, expr: expr, setGear: setGear, droplet: droplet, updateDrop: updateDrop, toon: toon, ink: inkOf, mesh: mesh, rbox: rbox, blob: blob, lathe: lathe, taper: taper, emblemGeo: emblemGeo, grad: grad, merge: merge, M4: M4, smoothProfile: smoothProfile, ctex: ctex, faceTex: faceTex, faceDecal: faceDecal, faceMat: faceMat, curvedAll: curvedAll };
})();


