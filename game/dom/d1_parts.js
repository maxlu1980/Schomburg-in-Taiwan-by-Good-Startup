  /* ---------------- (V67) the cathedral can be entered: the walls are walls (cut with their windows, arcades and portals), the inside
     is built on the same plan as the outside: the piers, the arcades, the triforium, the clerestory, the vaults with their ribs, the
     floor, the furnishings; the windows' stained glass; the sun's light through them (see the runtime at the end) ---------------- */
  function dmV2(p) { return new THREE.Vector2(p[0], p[1]); }
  /* the pointed arch's profile: its height (0 … 1) at t (0 at the springing, 1 at the crown); R: how far apart its two centres are struck,
     in half-spans (1 = a round arch; Gothic ≈ 1.6–2) */
  function dmG(t, R) { R = R || 1.7; t = t < 0 ? 0 : t > 1 ? 1 : t; return Math.sqrt(Math.max(0, R * R - (R - t) * (R - t))) / Math.sqrt(R * R - (R - 1) * (R - 1)); }
  /* a pointed opening's outline (u along the wall, v up), anticlockwise: the sill vs, the springing vp, the crown vc */
  function dmLancet(u0, u1, vs, vp, vc, R, n) { var P = [[u0, vs], [u1, vs]], a = (u1 - u0) / 2, i; n = n || 8; if (vp > vs + 1e-3) P.push([u1, vp]);
    for (i = 1; i < n; i++) P.push([u1 - i / n * a, vp + (vc - vp) * dmG(i / n, R)]); P.push([u0 + a, vc]); for (i = n - 1; i >= 1; i--) P.push([u0 + i / n * a, vp + (vc - vp) * dmG(i / n, R)]);
    if (vp > vs + 1e-3) P.push([u0, vp]); return P; }
  /* an arch cut into the bottom edge of a wall (left to right): from (u0, vp) over the crown vc to (u1, vp) */
  function dmNotch(u0, u1, vs, vp, vc, R, n) { var P = [], a = (u1 - u0) / 2, i; n = n || 8; P.push([u0, vs]); if (vp > vs + 1e-3) P.push([u0, vp]);
    for (i = 1; i < n; i++) P.push([u0 + i / n * a, vp + (vc - vp) * dmG(i / n, R)]); P.push([u0 + a, vc]); for (i = n - 1; i >= 1; i--) P.push([u1 - i / n * a, vp + (vc - vp) * dmG(i / n, R)]);
    if (vp > vs + 1e-3) P.push([u1, vp]); P.push([u1, vs]); return P; }
  /* a wall's plane: local u along d = [dx, dz], v up, w = d × up = (-dz, 0, dx); origin at o = [x, z] */
  function dmBasis(o, d) { var x = new V3(d[0], 0, d[1]).normalize(), y = new V3(0, 1, 0), z = new V3().crossVectors(x, y); return new THREE.Matrix4().makeBasis(x, y, z).setPosition(o[0], 0, o[1]); }
  function dmWallGeo(outline, holes, th) { var sh = new THREE.Shape(outline.map(dmV2)); (holes || []).forEach(function (h) { sh.holes.push(new THREE.Path(h.map(dmV2))); });
    var g = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false, curveSegments: 1, steps: 1 }); g.translate(0, 0, -th / 2); return g; }
  /* a placed geometry, its faces sorted: those that face nIn (a world direction) to the batch Bi, those that face away to Bo, the sides
     (reveals) to Bi, or to Bo when rvOut */
  function dmSplit(g, m, nIn, Bi, Bo, ci, co, si, so, rvOut) { var gg = g.index ? g.toNonIndexed() : g.clone(); gg.applyMatrix4(m);
    var p = gg.attributes.position, A = [], O = [], i, a = new V3(), b = new V3(), c = new V3(), n = new V3(), e = new V3();
    for (i = 0; i < p.count; i += 3) { a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2); n.subVectors(c, b).cross(e.subVectors(a, b)); if (n.lengthSq() < 1e-12) continue; n.normalize();
      var dd = n.dot(nIn), arr = dd > 0.5 ? A : dd < -0.5 ? O : (rvOut ? O : A); arr.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z); }
    [[A, Bi, ci, si], [O, Bo, co, so]].forEach(function (q) { if (!q[0].length || !q[1]) return; var h = new THREE.BufferGeometry(); h.setAttribute('position', new THREE.Float32BufferAttribute(q[0], 3)); h.computeVertexNormals(); q[1].add(bproj(h, q[3] || 4), null, q[2] == null ? 0xffffff : q[2]); }); gg.dispose(); }
  /* a wall: outline and openings in its plane at o along d, th thick; the inside is the side sIn (+1: towards w, −1: away) */
  function dmWall(IN, Bo, o, d, outline, holes, th, sIn, rvOut) { var m = dmBasis(o, d), w = new V3(-d[1], 0, d[0]).multiplyScalar(sIn); dmSplit(dmWallGeo(outline, holes, th), m, w, IN.st, Bo, IN.cW, 0xffffff, 3.2, 4, rvOut); return m; }
  /* a box of masonry seen from inside on its faces towards nIn (the others outside) */
  function dmBoxIO(IN, Bo, x0, x1, y0, y1, z0, z1, nIn) { var g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); dmSplit(g, new THREE.Matrix4(), nIn, IN.st, Bo, IN.cW, 0xffffff, 3.2, 4, true); }
  /* solid to walkers and to the camera: a run of wall from (ax, az) to (bx, bz), th thick (axis-aligned: one box; else a row of small ones) */
  function dmCol(H2, ax, az, bx, bz, th, y0, y1, cam) { var dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz), i; if (L < 1e-3) return;
    if (Math.abs(dx) < 1e-3 || Math.abs(dz) < 1e-3) { var hx = Math.abs(dx) < 1e-3 ? th / 2 : 0, hz = Math.abs(dz) < 1e-3 ? th / 2 : 0, x0 = Math.min(ax, bx) - hx, x1 = Math.max(ax, bx) + hx, z0 = Math.min(az, bz) - hz, z1 = Math.max(az, bz) + hz; H2.col(x0, x1, z0, z1, y0, y1); if (cam !== false) H2.cb(x0, x1, y0, y1, z0, z1); return; }
    var n = Math.ceil(L / 0.6), r = th / 2 + 0.08; for (i = 0; i <= n; i++) { var x = ax + dx * i / n, z = az + dz * i / n; H2.col(x - r, x + r, z - r, z + r, y0, y1); if (cam !== false && i % 2 === 0) H2.cb(x - r - 0.15, x + r + 0.15, y0, y1, z - r - 0.15, z + r + 0.15); } }
  /* a wall's solid runs along its length, leaving the gaps (u ranges) open: for the portals and the arcades */
  function dmColRun(H2, o, d, u0, u1, gaps, th, y0, y1) { var cuts = [[u0, u1]]; (gaps || []).forEach(function (g) { var nx = []; cuts.forEach(function (c) { if (g[1] <= c[0] || g[0] >= c[1]) { nx.push(c); return; } if (g[0] > c[0]) nx.push([c[0], g[0]]); if (g[1] < c[1]) nx.push([g[1], c[1]]); }); cuts = nx; });
    cuts.forEach(function (c) { if (c[1] - c[0] < 0.05) return; dmCol(H2, o[0] + d[0] * c[0], o[1] + d[1] * c[0], o[0] + d[0] * c[1], o[1] + d[1] * c[1], th, y0, y1); }); }

  /* ---- the piers: a core of eight sides ringed with shafts (four strong ones for the arches, four slender ones for the ribs), on a moulded
     base, with a band of carved foliage for the capital ---- */
  function dmPier(IN, x, z, r, y0, h, o) { o = o || {}; var B = IN.st, k, cap = o.cap == null ? 0.55 : o.cap, sg = IN.lo ? 6 : 8;
    var core = new THREE.CylinderGeometry(r * 0.86, r * 0.86, h, 8); core.rotateY(Math.PI / 8); addP(B, core, { p: [x, y0 + h / 2, z] }, IN.cW, 2.4);
    for (k = 0; k < 8; k++) { var a = k * Math.PI / 4 + (o.rot || 0), big = k % 2 === 0, sr = r * (big ? 0.27 : 0.17), rr = r * (big ? 0.84 : 0.88); var sh = new THREE.CylinderGeometry(sr, sr, h, sg, 1, true); addP(B, sh, { p: [x + Math.cos(a) * rr, y0 + h / 2, z + Math.sin(a) * rr] }, 0xece4d4, 2.4); }
    var base = new THREE.CylinderGeometry(r * 1.2, r * 1.28, 0.62, 8); base.rotateY(Math.PI / 8); addP(B, base, { p: [x, y0 + 0.31, z] }, 0xc4bcac, 2.4); var bm = new THREE.CylinderGeometry(r * 1.1, r * 1.18, 0.28, 16); addP(B, bm, { p: [x, y0 + 0.76, z] }, 0xd2cab8, 2.4);
    if (cap > 0) { var cp = new THREE.CylinderGeometry(r * 1.16, r * 1.0, cap, 16); addP(B, cp, { p: [x, y0 + h - cap / 2, z] }, 0xb8ac94, 1.6); var ab = new THREE.CylinderGeometry(r * 1.22, r * 1.22, 0.16, 8); ab.rotateY(Math.PI / 8); addP(B, ab, { p: [x, y0 + h + 0.08, z] }, 0xd8d0c0, 2.4); }
    if (o.col !== false) { IN.H2.col(x - r * 1.1, x + r * 1.1, z - r * 1.1, z + r * 1.1, -1, y0 + h); IN.H2.cb(x - r * 1.05, x + r * 1.05, -1, y0 + h, z - r * 1.05, z + r * 1.05); } }
  /* the slender shafts that carry a high vault's ribs, rising up the wall from the arcade's capital to the vault's springing */
  function dmShafts(IN, x, z, nx, nz, y0, y1) { var k, sg = IN.lo ? 6 : 8; for (k = -1; k <= 1; k++) { var tx = -nz, tz = nx, sr = k ? 0.15 : 0.22, px = x + nx * 0.62 + tx * k * 0.38, pz = z + nz * 0.62 + tz * k * 0.38; var g = new THREE.CylinderGeometry(sr, sr, y1 - y0, sg, 1, true); addP(IN.st, g, { p: [px, (y0 + y1) / 2, pz] }, 0xece4d4, 2.4); var cp = new THREE.CylinderGeometry(sr * 2.0, sr * 1.3, 0.42, sg); addP(IN.st, cp, { p: [px, y1 - 0.21, pz] }, 0xb8ac94, 1.6); } }

  /* ---- a vault over a convex plan (corners P, anticlockwise or not) springing at ys, its crown at yc over the boss C: one web from
     each side up to the boss, the webs meeting in the groins; the ribs along the groins and (where asked) along the sides ---- */
  function dmVault(IN, P, ys, yc, C, o) { o = o || {}; var n = P.length, i, j, k, na = IN.lo ? 3 : 5, nb = IN.lo ? 4 : 8, R = o.R || 1.7, rise = yc - ys, B = IN.st;
    if (!C) { C = [0, 0]; P.forEach(function (p) { C[0] += p[0] / n; C[1] += p[1] / n; }); }
    for (i = 0; i < n; i++) { var A0 = P[i], A1 = P[(i + 1) % n], pos = [];
      function pt(a, b) { var s = (b + 1) / 2, sx = A0[0] + (A1[0] - A0[0]) * s, sz = A0[1] + (A1[1] - A0[1]) * s; return [sx + (C[0] - sx) * a, ys + rise * dmG(1 - Math.abs(b) * (1 - a), R), sz + (C[1] - sz) * a]; }
      for (j = 0; j < na; j++) for (k = 0; k < nb; k++) { var a0 = j / na, a1 = (j + 1) / na, b0 = -1 + 2 * k / nb, b1 = -1 + 2 * (k + 1) / nb, q00 = pt(a0, b0), q01 = pt(a0, b1), q10 = pt(a1, b0), q11 = pt(a1, b1);
        pos.push.apply(pos, q00.concat(q10, q01)); pos.push.apply(pos, q01.concat(q10, q11)); }
      /* the webs face down (the whole web's area-weighted normal decides) */ var ny = 0, t; for (t = 0; t < pos.length; t += 9) { var ux = pos[t + 3] - pos[t], uy = pos[t + 4] - pos[t + 1], uz = pos[t + 5] - pos[t + 2], vx = pos[t + 6] - pos[t], vy = pos[t + 7] - pos[t + 1], vz = pos[t + 8] - pos[t + 2]; ny += uz * vx - ux * vz; }
      if (ny > 0) for (t = 0; t < pos.length; t += 9) for (var c = 0; c < 3; c++) { var tmp = pos[t + 3 + c]; pos[t + 3 + c] = pos[t + 6 + c]; pos[t + 6 + c] = tmp; }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      B.add(bproj(g, 3.0), null, o.cWeb || 0xf0e8da);
      /* the groin's rib, from this corner to the boss */ var rp = []; for (j = 0; j <= 6; j++) { var a2 = j / 6; rp.push([A0[0] + (C[0] - A0[0]) * a2, ys + rise * dmG(a2, R), A0[1] + (C[1] - A0[1]) * a2]); } dmRib(IN, rp, o.rw || 0.34);
      if (o.sides && o.sides[i]) { var sp = []; for (j = 0; j <= 10; j++) { var b2 = -1 + 2 * j / 10, s2 = (b2 + 1) / 2; sp.push([A0[0] + (A1[0] - A0[0]) * s2, ys + rise * dmG(1 - Math.abs(b2), R), A0[1] + (A1[1] - A0[1]) * s2]); } dmRib(IN, sp, (o.rw || 0.34) * (o.sides[i] === 2 ? 1.6 : 1.0), o.sides[i] === 2 ? 0.75 : 0.4); } }
    /* the boss: a gilded and painted rosette where the ribs meet */ var bs = new THREE.CylinderGeometry(o.boss || 0.42, (o.boss || 0.42) * 0.8, 0.3, 10); IN.gd.add(bs, { p: [C[0], yc - 0.32, C[1]] }, 0xd8a840); return C; }
  /* a rib: a moulded stone band hanging under the vault along the points */ function dmRib(IN, pts, w, dp) { dp = dp || 0.4; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz); if (L < 1e-4) continue; var g = new THREE.BoxGeometry(w, dp, L + 0.06); var q = new THREE.Quaternion().setFromUnitVectors(new V3(0, 0, 1), new V3(dx / L, dy / L, dz / L)); var up = new V3(0, 1, 0).applyQuaternion(q); var mm = new THREE.Matrix4().compose(new V3((a[0] + b[0]) / 2 - up.x * dp * 0.45, (a[1] + b[1]) / 2 - up.y * dp * 0.45, (a[2] + b[2]) / 2 - up.z * dp * 0.45), q, new V3(1, 1, 1)); addP(IN.st, g, mm, 0xd8ccb4, 2.0); } }

  /* ---- a window's stained glass: the opening's outline (in the wall's plane at o along d), the glass in its middle, facing in; its
     record for the light that comes through it ---- */
  function dmGlass(IN, o, d, outline, cell, nOut, rec, clip, fy) { var xs = outline.map(function (p) { return p[0]; }), ys = outline.map(function (p) { return p[1]; }), u0 = Math.min.apply(null, xs), u1 = Math.max.apply(null, xs), v0 = Math.min.apply(null, ys), v1 = Math.max.apply(null, ys);
    var g = new THREE.ShapeGeometry(new THREE.Shape(outline.map(dmV2)), 1), p = g.attributes.position, uv = g.attributes.uv, i; for (i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - u0) / (u1 - u0), (p.getY(i) - v0) / (v1 - v0));
    var m = dmBasis(o, d), w = new V3(-d[1], 0, d[0]); if (w.x * nOut[0] + w.z * nOut[1] > 0) { /* the glass faces in: turn it round */ var idx = g.index.array; for (i = 0; i < idx.length; i += 3) { var tmp = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = tmp; } var na = g.attributes.normal; for (i = 0; i < na.count; i++) na.setZ(i, -na.getZ(i)); }
    var C = IN.cells[cell]; IN.gl.add(g, m, 0xffffff, { uvRect: C });
    if (rec !== false) IN.wins.push({ o: [o[0] + d[0] * u0, v0, o[1] + d[1] * u0], ex: [d[0], 0, d[1]], w: u1 - u0, h: v1 - v0, n: [nOut[0], 0, nOut[1]], cell: cell, clip: clip || null, fy: fy }); }
