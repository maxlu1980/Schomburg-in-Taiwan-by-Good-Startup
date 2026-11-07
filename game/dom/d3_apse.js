  /* an upright prism over a plan polygon (x, z points) from y0 to y1, its texture by box projection */
  function dmPrism(B, poly, y0, y1, col) { var sh = new THREE.Shape(poly.map(function (p) { return new THREE.Vector2(p[0], -p[1]); })); var g = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false, curveSegments: 1 }); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); B.add(bproj(g, 4), null, col == null ? 0xffffff : col); }
  /* ---------- the apse: the high choir's seven narrow sides (the arcades tall and slender, stilted to 15 m), the ambulatory round them, the
     crown of seven chapels, each lit by three tall windows; outside the buttresses between the chapels and the flyers over the ambulatory ---------- */
  function domApse(T, DB, IN, h) { var D = DOM, H2 = T.H, ST = DB.dstone, C = [D.ax, 0], rN = D.zN, rM = D.zM, k, j, FL = h.FL, SPA = h.SPA, APA = h.APA, SPN = h.SPN, APN = h.APN, T0 = h.T0, T1 = h.T1, YV = h.YV, WN = h.WN, SPV = 12.5;
    var V = [], W = [], th = [];
    for (k = 0; k <= 7; k++) { var a = -Math.PI / 2 + k * Math.PI / 7; th.push(a); V.push([C[0] + Math.cos(a) * rN, Math.sin(a) * rN]); W.push([C[0] + Math.cos(a) * rM, Math.sin(a) * rM]); }
    function inSide(A, Bp, P) { var dx = Bp[0] - A[0], dz = Bp[1] - A[1], L = Math.hypot(dx, dz), w = [-dz / L, dx / L], m = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2]; return (w[0] * (P[0] - m[0]) + w[1] * (P[1] - m[1])) > 0 ? 1 : -1; }
    function ryOut(n) { return Math.atan2(n[0], n[1]); }
    /* the high choir's walls: a slender arcade below, two triforium openings, one tall window of the kings */
    for (k = 0; k < 7; k++) { var A = V[k], Bp = V[k + 1], dx = Bp[0] - A[0], dz = Bp[1] - A[1], L = Math.hypot(dx, dz), d = [dx / L, dz / L], sIn = inSide(A, Bp, C), out = [-d[1] * -sIn, d[0] * -sIn], mid = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2];
      var ol = [[0, SPV]].concat(dmNotch(0.62, L - 0.62, SPV, SPV, APA, 2.4, 8)).concat([[L, SPV], [L, YV], [0, YV]]), wn = dmLancet(0.5, L - 0.5, T1 + 0.15, 32.4, 35.3, 2.0, 8), holes = [wn], tw = (L - 1.0 - 0.3) / 2;
      for (j = 0; j < 2; j++) holes.push(dmLancet(0.5 + j * (tw + 0.3), 0.5 + j * (tw + 0.3) + tw, T0 + 0.3, 20.1, 20.95, 1.4, 5));
      dmWall(IN, ST, A, d, ol, holes, WN, sIn); dmGlass(IN, A, d, wn, 'ksg2', out);
      dmGlass(IN, [A[0] + out[0] * (WN / 2 + 0.62), A[1] + out[1] * (WN / 2 + 0.62)], d, [[0.4, T0 + 0.25], [L - 0.4, T0 + 0.25], [L - 0.4, 21.05], [0.4, 21.05]], 'tri1', out, false);
      bay(DB.dbay[1], L - 0.5, YV - T1 - 0.8, mid[0] + out[0] * (WN / 2 + 0.02), T1 + 0.3, mid[1] + out[1] * (WN / 2 + 0.02), ryOut(out)); }
    for (k = 0; k <= 7; k++) { var n0 = [C[0] - V[k][0], C[1] - V[k][1]], nl = Math.hypot(n0[0], n0[1]); n0 = [n0[0] / nl, n0[1] / nl]; if (k > 0 && k < 7) dmPier(IN, V[k][0], V[k][1], 0.62, FL, SPV - FL); dmShafts(IN, V[k][0], V[k][1], k === 0 ? 0 : k === 7 ? 0 : n0[0], k === 0 ? 1 : k === 7 ? -1 : n0[1], k === 0 || k === 7 ? D.spA : SPV, SPN); }
    /* the high vault of the apse: seven webs to a boss east of the polygon's centre, and the arch to the choir's last bay */
    dmVault(IN, V.slice(), SPN, APN, [C[0] + 1.6, 0], { sides: [1, 1, 1, 1, 1, 1, 1, 2] });
    /* the ambulatory: seven bays between the high choir's piers and the ring of outer piers */
    for (k = 0; k < 7; k++) { dmVault(IN, [V[k], V[k + 1], W[k + 1], W[k]], SPA, APA, null, { sides: [0, k < 6 ? 2 : 0, 0, 0] }); if (k > 0) dmPier(IN, W[k][0], W[k][1], 0.78, FL, SPA - FL); }
    IN.floorP([V[0], V[1], V[2], V[3], V[4], V[5], V[6], V[7]]); for (k = 0; k < 7; k++) IN.floorP([V[k], W[k], W[k + 1], V[k + 1]]);
    IN.bld.push([C[0], C[0] + rM, -rM, rM]);
    /* the chapels */ var Qs = [];
    for (k = 0; k < 7; k++) { var phi = th[k] + Math.PI / 14, er = [Math.cos(phi), Math.sin(phi)], Cc = [C[0] + er[0] * 14.5, er[1] * 14.5], rc = 3.3, Q = [-67.5, -22.5, 22.5, 67.5].map(function (b) { var aa = phi + b * Math.PI / 180; return [Cc[0] + Math.cos(aa) * rc, Cc[1] + Math.sin(aa) * rc]; });
      if (k === 0) Q[0] = [C[0], W[0][1] - 4.0]; if (k === 6) Q[3] = [C[0], W[7][1] + 4.0]; Qs.push(Q);
      var P = [W[k], Q[0], Q[1], Q[2], Q[3], W[k + 1]];
      for (j = 0; j < 5; j++) { var A2 = P[j], B2 = P[j + 1], dx2 = B2[0] - A2[0], dz2 = B2[1] - A2[1], L2 = Math.hypot(dx2, dz2), d2 = [dx2 / L2, dz2 / L2], s2 = inSide(A2, B2, Cc), out2 = [-d2[1] * -s2, d2[0] * -s2], mid2 = [(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2];
        if ((k === 0 && j === 0) || (k === 6 && j === 4)) continue; /* (the end chapels share the aisle's end wall) */
        var win = j >= 1 && j <= 3, wl = win ? dmLancet(0.45, L2 - 0.45, 3.0, 11.2, 13.6, 2.0, 8) : null;
        dmWall(IN, win ? ST : IN.st, A2, d2, [[0, -0.2], [L2, -0.2], [L2, APA + 0.6], [0, APA + 0.6]], win ? [wl] : [], 1.0, s2); dmCol(H2, A2[0], A2[1], B2[0], B2[1], 1.0, -1, APA + 1);
        if (win) { dmGlass(IN, A2, d2, wl, 'med2', out2); bay(DB.dbay[0], L2 - 0.2, APA - 1.0, mid2[0] + out2[0] * 0.52, 0.8, mid2[1] + out2[1] * 0.52, ryOut(out2)); } }
      dmVault(IN, P, SPA, APA - 0.3, [Cc[0] - er[0] * 0.5, Cc[1] - er[1] * 0.5], { sides: [1, 1, 1, 1, 1, 2] }); IN.floorP(P);
      IN.bld.push([Math.min(Q[0][0], Q[1][0], Q[2][0], Q[3][0], W[k][0], W[k + 1][0]) + 0.4, Math.max(Q[0][0], Q[1][0], Q[2][0], Q[3][0], W[k][0], W[k + 1][0]) - 0.4, Math.min(Q[0][1], Q[1][1], Q[2][1], Q[3][1], W[k][1], W[k + 1][1]) + 0.4, Math.max(Q[0][1], Q[1][1], Q[2][1], Q[3][1], W[k][1], W[k + 1][1]) - 0.4]);
      /* its roof: a pyramid of seven sides */ spyr(DB.lead, Cc[0], Cc[1], 4.5, APA + 0.6, APA + 4.8, 7, 0xffffff, -phi); }
    /* the outer aisles' east ends: one wall each from the ambulatory's first pier to the aisle's outer wall (the end chapel's west side) */
    [-1, 1].forEach(function (s) { var z0 = s * rM, z1 = s * (D.zA + 1.2), o = [C[0], Math.min(z0, z1)], wl2 = dmLancet(4.2 - 1.6, 4.2 + 1.6, 3.4, 11.6, 14.6, 1.8, 8);
      dmWall(IN, IN.st, o, [0, 1], [[0, -0.2], [Math.abs(z1 - z0), -0.2], [Math.abs(z1 - z0), APA + 0.6], [0, APA + 0.6]], [], 1.0, -1); dmCol(H2, C[0], z0, C[0], z1, 1.0, -1, APA + 1); });
    /* outside: the solid buttresses between the chapels (and at the ends), their pinnacles, the flyers to the high choir; the ambulatory's
       roof; the high roof's half cone over the apse */
    for (k = 0; k <= 7; k++) { var poly, R = [C[0] + Math.cos(th[k]) * 19.6, Math.sin(th[k]) * 19.6];
      if (k === 0) { var q2 = Qs[0][1]; poly = [Qs[0][0], [C[0], -D.zA - 1.2], [q2[0] + 0.6, -D.zA - 1.2], [q2[0] + 0.3, q2[1] - 0.4]]; }
      else if (k === 7) { var q3 = Qs[6][2]; poly = [Qs[6][3], [q3[0] + 0.3, q3[1] + 0.4], [q3[0] + 0.6, D.zA + 1.2], [C[0], D.zA + 1.2]]; }
      else poly = [W[k], Qs[k - 1][3], R, Qs[k][0]];
      dmPrism(ST, poly, 0, APA + 1.0, 0xe0dace); poly.forEach(function (p, i2) { var p2 = poly[(i2 + 1) % poly.length]; dmCol(H2, p[0], p[1], p2[0], p2[1], 0.4, -1, APA + 1, false); });
      if (k > 0 && k < 7) { pinnacle(ST, R[0], R[1], APA + 1.0, 8.5, 1.5); var vi = [C[0] + Math.cos(th[k]) * (rN + 1.0), Math.sin(th[k]) * (rN + 1.0)]; flyer(ST, R[0], R[1], APA + 6.2, vi[0], vi[1], YV - 6.5, 0.8); flyer(ST, R[0], R[1], APA + 3.2, vi[0], vi[1], YV - 13, 0.8); sbox(ST, vi[0] - 0.5, vi[0] + 0.5, T1 + 0.4, YV + 0.8, vi[1] - 0.5, vi[1] + 0.5, 0xe0dace); pinnacle(ST, vi[0], vi[1], YV + 0.8, 4.5, 1.0); } }
    var g = new THREE.BufferGeometry(), Pp = []; function tri(p, q2, r) { Pp.push(p[0], p[1], p[2], q2[0], q2[1], q2[2], r[0], r[1], r[2]); }
    for (k = 0; k < 14; k++) { var b0 = -Math.PI / 2 + k / 14 * Math.PI, b1 = -Math.PI / 2 + (k + 1) / 14 * Math.PI, o0 = [C[0] + Math.cos(b0) * (rM + 1.0), APA + 0.6, Math.sin(b0) * (rM + 1.0)], o1 = [C[0] + Math.cos(b1) * (rM + 1.0), APA + 0.6, Math.sin(b1) * (rM + 1.0)], i0 = [C[0] + Math.cos(b0) * (rN + 0.6), T1 + 0.35, Math.sin(b0) * (rN + 0.6)], i1 = [C[0] + Math.cos(b1) * (rN + 0.6), T1 + 0.35, Math.sin(b1) * (rN + 0.6)]; tri(o0, i1, o1); tri(o0, i0, i1); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(Pp, 3)); g.computeVertexNormals(); DB.lead.add(bproj(g, 4), null, 0xffffff);
    var cg = new THREE.ConeGeometry(rN + 0.9, D.ridge - YV, 14, 1, true, 0, Math.PI); cg.translate(C[0], (YV + D.ridge) / 2, 0); DB.lead.add(bproj(cg, 4), null, 0xffffff);
    H2.cb(C[0] - 0.5, C[0] + rN + 1.0, SPV, D.ridge, -rN - 1.0, rN + 1.0);
    IN.apse = { C: C, V: V, W: W }; }
