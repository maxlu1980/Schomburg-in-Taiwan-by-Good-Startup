//@@HELPERS
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
//@@END
//@@TORSOTEX
if (MIRA) { tunicTex(g, w, h, P); return; }
//@@END
//@@UNIFORM
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
      var cap = new THREE.Group(); cap.position.set(0, 0.002, -0.004); cap.rotation.x = -0.13; head.add(cap); MU.cap = cap;
      var bandR = 0.1175, bzs = 1.06;
      var bandG = lathe([[0.1165, 0.034], [0.1178, 0.05], [0.1188, 0.069]], sg(64, 36)); bandG.scale(1, 1, bzs); bandG.computeVertexNormals(); addTo(cap, bandG, M.dark, 0.0026);
      function saddle(x, y, z) { var r = Math.hypot(x, z / 1.12) || 1e-6, f = Math.max(0, z / 1.12 / r), up = Math.max(0, Math.min(1, (y - 0.084) / 0.03)); return 0.03 * Math.pow(f, 2.2) * up; }
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
//@@END
//@@BRAIDS
    /* ----- (V63) the hair: two plaits (Zöpfe) from the nape behind the ears, each three strands woven over and under, tied with a red ribbon
       and ending in a loose brush; each on its own chain of bones, simulated like the twin tails (gravity, inertia, the air, the body) ----- */
    if (MIRA) [1, -1].forEach(function (s) {
      var piv = new THREE.Group(); piv.position.set(s * 0.062, -0.048, -0.082); head.add(piv);
      var base = new THREE.CatmullRomCurve3([V(0, 0, 0), V(s * 0.012, -0.045, -0.02), V(s * 0.02, -0.105, -0.034), V(s * 0.022, -0.17, -0.04), V(s * 0.02, -0.235, -0.036), V(s * 0.017, -0.29, -0.028), V(s * 0.015, -0.325, -0.022), V(s * 0.014, -0.36, -0.018)], false, 'catmullrom', 0.5);
      var TE = 0.82, NS2 = sg(150, 70), RAD = sg(9, 6), CYC = 7.5, tOutAll = [], bones = [], rest = [], q;
      for (q = 0; q < NB; q++) rest.push(base.getPointAt(q / (NB - 1)));
      for (q = 0; q < NB; q++) { var bn2 = new THREE.Bone(); if (q === 0) bn2.position.copy(rest[0]); else bn2.position.copy(rest[q]).sub(rest[q - 1]); if (q) bones[q - 1].add(bn2); bones.push(bn2); } piv.add(bones[0]);
      var Pb = new THREE.Vector3(), Tg = new THREE.Vector3(), Lt = new THREE.Vector3(), Dp = new THREE.Vector3(), X1 = new THREE.Vector3(1, 0, 0), meshes = [], mat = toon(0xffffff, { vc: true });
      function tap(t) { return 1 - 0.3 * Math.pow(t / TE, 1.3); }
      var Ua = new THREE.Vector3(), Ub = new THREE.Vector3(), Uc = new THREE.Vector3(); function upAt(tb) { base.getTangentAt(Math.min(1, Math.max(0, tb)), Ua); Ub.copy(X1).addScaledVector(Ua, -Ua.dot(X1)).normalize(); return Uc.copy(Ua).cross(Ub).normalize(); }
      function skinGeo(g, tl, scale) { var n = g.attributes.position.count, si2 = new Uint16Array(n * 4), sw = new Float32Array(n * 4), k; for (k = 0; k < n; k++) { var f = Math.min(NB - 1.0001, Math.max(0, (tl[k] || 0) * scale) * (NB - 1)), b0 = Math.floor(f), uu = f - b0; si2[k * 4] = b0; sw[k * 4] = 1 - uu; si2[k * 4 + 1] = Math.min(NB - 1, b0 + 1); sw[k * 4 + 1] = uu; }
        g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si2, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); }
      function addSkinned(g, inkW) { var sm = new THREE.SkinnedMesh(g, mat), ik = new THREE.SkinnedMesh(g, ink(inkW)); ik.userData.ink = true; ik.renderOrder = -1; [sm, ik].forEach(function (mm) { mm.frustumCulled = false; mm.castShadow = !mm.userData.ink; piv.add(mm); meshes.push(mm); }); }
      for (var k3 = 0; k3 < 3; k3++) { var pts = [], N2 = 96, j2; for (j2 = 0; j2 <= N2; j2++) { var tb = TE * j2 / N2, tp2 = tap(tb), ph = CYC * Math.PI * 2 * (tb / TE) + k3 * Math.PI * 2 / 3; base.getPointAt(tb, Pb); base.getTangentAt(tb, Tg); Lt.copy(X1).addScaledVector(Tg, -Tg.dot(X1)).normalize(); Dp.copy(Tg).cross(Lt).normalize();
          pts.push(Pb.clone().addScaledVector(Lt, 0.0118 * tp2 * Math.sin(ph)).addScaledVector(Dp, 0.0068 * tp2 * Math.sin(2 * ph) * s)); }
        var cv = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5), tl = [], kk = k3;
        var gg = taper(cv, NS2, RAD, function (t) { return 0.0098 * tap(t * TE) * (0.94 + 0.06 * Math.cos(t * CYC * Math.PI * 4)); }, { flat: 0.82, up: function (t) { return upAt(t * TE); }, tOut: tl, color: function (t, a, c) { var ca = Math.cos(a); c.copy(hairC); if (ca > 0.45) c.lerp(hiC, 0.55 * (ca - 0.45) / 0.55); else if (ca < -0.3) c.lerp(dkC, 0.7); var cr = Math.abs(Math.sin(t * CYC * Math.PI * 2 + kk * 2.094)); if (cr < 0.18) c.lerp(dkC, 0.5 * (1 - cr / 0.18)); if (kk === 1) c.multiplyScalar(0.96); } });
        skinGeo(gg, tl, TE); addSkinned(gg, 0.0024); }
      /* the tie: a red ribbon wound round, a bow with two loops and two ends */
      var qi = Math.round(TE * (NB - 1)), tieP = base.getPointAt(TE), off = tieP.clone().sub(rest[qi]), tg3 = base.getTangentAt(TE), tieG = new THREE.Group(); tieG.position.copy(off); tieG.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tg3); bones[qi].add(tieG);
      var rib = mesh(new THREE.TorusGeometry(0.0118, 0.0042, sg(8, 6), sg(22, 12)), M.band, { ink: 0.0018 }); rib.rotation.x = Math.PI / 2; tieG.add(rib);
      [1, -1].forEach(function (b2) { var lp = mesh(new THREE.TorusGeometry(0.0105, 0.0032, sg(8, 6), sg(18, 10)), M.band, { ink: 0.0016 }); lp.scale.set(1.25, 0.62, 0.45); lp.position.set(b2 * 0.0135, 0.002, -0.012 * s * 0); lp.rotation.set(0, 0, b2 * 0.35); tieG.add(lp);
        var en = mesh(taper(new THREE.CatmullRomCurve3([V(b2 * 0.004, -0.002, 0), V(b2 * 0.009, -0.016, 0.002), V(b2 * 0.012, -0.03, 0.001)]), sg(10, 6), sg(6, 4), function (t) { return 0.0042 * (1 - 0.4 * t); }, { flat: 0.3, up: V(0, 0, 1) }), M.band, { ink: 0.0014 }); tieG.add(en); });
      var knot = mesh(blob(0.0058, 0.0055, 0.0045, sg(10, 8)), M.band, { ink: 0.0014 }); knot.position.set(0, 0.002, 0); tieG.add(knot);
      /* the brush below the tie */
      var brush = new THREE.Group(); brush.position.copy(off); brush.quaternion.copy(tieG.quaternion); bones[qi].add(brush);
      for (var bi = 0; bi < sg(9, 6); bi++) { var an = bi / sg(9, 6) * Math.PI * 2, sp2 = 0.006 + (bi % 2) * 0.003, L2 = 0.05 + ((bi * 37) % 10) * 0.0022;
        var lg = taper(new THREE.CatmullRomCurve3([V(Math.cos(an) * 0.003, 0.004, Math.sin(an) * 0.003), V(Math.cos(an) * sp2, -L2 * 0.5, Math.sin(an) * sp2), V(Math.cos(an) * sp2 * 1.5, -L2, Math.sin(an) * sp2 * 1.5)]), sg(10, 6), sg(6, 4), function (t) { return 0.0062 * Math.pow(1 - t, 0.8) + 0.0006; }, { color: function (t, a, c) { c.copy(hairC); if (t > 0.6) c.lerp(dkC, (t - 0.6)); if (Math.cos(a) > 0.5) c.lerp(hiC, 0.4); } });
        brush.add(mesh(lg, MH, { ink: 0.0016 })); }
      tails.push({ piv: piv, side: s, k: 0, bones: bones, rest: rest, meshes: meshes, p: null, q: null, kS: 1.3, air: 0.7, ph: s > 0 ? 0 : 0.9, braid: true }); });
//@@END
//@@MOTION
    /* (V63) Mira's bearing: upright, a firm, nearly straight-armed swing on the march; at rest the hands behind her back (parade rest);
       a greeting is a military salute, the fingertips of the right hand to the peak of her cap */
    if (A.mira && !o.mount) {
      /* (V64) a weapon in her hands: both hands to its grips by IK, standing square to it */
      if (A.grip && m !== 'attack') { A._gw = A._gw || [new THREE.Vector3(), new THREE.Vector3()]; g.hands = [A.grip.L ? A.grip.L.getWorldPosition(A._gw[0]) : null, A.grip.R ? A.grip.R.getWorldPosition(A._gw[1]) : null]; g.lean = 0.05; g.hX = -0.03; g.hY = 0; g.torsoY = 0; g.hipsY = 0; }
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
      if (A.fist) { A.fist.visible = hk > 0.5; if (A.armR.hand) A.armR.hand.visible = hk <= 0.5; }
      /* the right arm by its angles (the upper arm turned in, so the forearm lies level across the chest and the fist on the left breast:
         solved once against the rig); the left wrist by IK to the small of the back */
      A.armR.sh.rotation.y = 1.284 * (sal && m === 'idle' ? hk : 0);
      if (hk > 0.02 && sal && m === 'idle') { A.torso.updateMatrixWorld(true); var br4 = Math.sin(t * 1.5) * 0.02;
        var hL = A.torso.localToWorld(hs.F[0].set(-0.012, 0.13, -0.135)); if (hk > 0.35) { g.hands = [hL, null]; g.aR = [0.429 + br4, -1.484, -1.78]; } else { g.hands = [null, g.hands[1]]; }
        g.hX = -0.07 * hk - 0.05 * (1 - hk); g.lean = -0.03; }
    } else if (A.mira && A.fist && (A.fist.visible || A.armR.sh.rotation.y)) { A.fist.visible = false; A.armR.hand.visible = true; A.armR.sh.rotation.y = 0; if (A._hs) { A._hs.on = 0; A._hs.k = 0; } }
//@@END
//@@PONY
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
//@@END
