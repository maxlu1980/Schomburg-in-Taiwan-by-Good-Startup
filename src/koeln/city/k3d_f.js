
  /* ================= the street's furniture: trees, lamps, benches, bollards; the signals; the city beyond; the clouds ================= */
  /* a deciduous tree (a plane tree or a lime): a trunk forking into limbs, overlapping clusters of leaves; late in the year gold, rust
     and the last green mixed (the season's tint does the rest) */
  var TREEG = null; function treeGeo() { if (TREEG) return TREEG; var BT = K.Batch({ sway: true }), BL = K.Batch({ sway: true }), r = rnd(7001), i;
    BT.add(K.cyl(0.16, 0.24, 3.0, 7), { p: [0, 1.5, 0] }, 0x8a7a68, { sway: 0 }); [[0.5, 0.2], [-0.45, 0.35], [0.1, -0.5]].forEach(function (q) { BT.add(K.cyl(0.07, 0.12, 2.0, 6), { p: [q[0] * 0.8, 3.6, q[1] * 0.8], r: [q[1] * 0.6, 0, -q[0] * 0.6] }, 0x8a7a68, { sway: function (x, y) { return Math.max(0, (y - 3) / 3) * 0.2; } }); });
    var cols = [0xd8a032, 0xc87a2a, 0x8a9a3a, 0xe0b848, 0xa85a2a, 0x7a9040]; for (i = 0; i < 9; i++) { var a = r() * 6.283, d = 0.6 + r() * 1.4, y = 4.2 + r() * 1.8, rr = 1.0 + r() * 0.7, geo = new THREE.IcosahedronGeometry(rr, 1); BL.add(geo, { p: [Math.cos(a) * d, y, Math.sin(a) * d], s: [1, 0.8, 1] }, (function (c) { return function (x, yy, z) { var t = (yy - 3.6) / 4; return new THREE.Color(c).multiplyScalar(0.62 + t * 0.45); }; })(cols[i % cols.length]), { sway: function (x, yy) { return Math.max(0, (yy - 3) / 4) * 0.5; } }); }
    TREEG = { trunk: BT.geometry(), leaf: BL.geometry() }; return TREEG; }
  function furnBuild(T, B, NB) { var H2 = T.H, r = rnd(7101), i, k, trees = [], lamps = [];
    /* the trees: the Rheingarten's planes in rows, the limes round the Domplatte's edges and Roncalliplatz, along Kennedy-Ufer and the Deutz quay */
    for (var z = 26; z < 190; z += 9) { trees.push([200, z], [238, z + 4.5]); if (z > 34) trees.push([262, z]); }
    for (var x = -100; x < 60; x += 14) trees.push([x, 92]); for (z = -40; z < 40; z += 13) trees.push([-112, z]);
    for (z = MAPZ[0] + 10; z < MAPZ[1]; z += 11) { if (Math.abs(z) > 20) trees.push([RKE[0] - 3.4, z], [RKA[1] + 2.0, z < 0 ? z : 9999]); /* (V79) the Deutz row 2.6 m back from the steps' head (it stood on the top step) */ }
    for (x = -130; x < 240; x += 12) trees.push([x, RMA[1] + 3.2]);
    trees = trees.filter(function (p) { return p[1] < 9000 && !(T.lots || []).some(function (q) { return inR(p[0], p[1], q, 2.5); }) && !T.rd.bld.some(function (q) { return inR(p[0], p[1], q, 1.5); }) && !T.rd.road.some(function (q) { return inR(p[0], p[1], q, 0.8); }); });
    var TG = [natTreeGeo(0), natTreeGeo(1), natTreeGeo(2)], items = trees.map(function (p, i) { var s = 0.9 + r() * 0.35; return { p: [p[0], Y1, p[1]], r: [0, r() * 6.283, 0], s: [s, s * (0.9 + r() * 0.2), s], v: i % 3 }; });
    T.treeItems = items; T.treePts = trees; /* (V79: the pits are laid in k3d_g, when every floor and ramp is known) */ trees.forEach(function (p) { H2.col(p[0] - 0.3, p[0] + 0.3, p[1] - 0.3, p[1] + 0.3, -1, 4); });
    /* the lamps: tall poles with a slim head along the streets; the Rhine's and the Domplatte's classic lanterns on cast posts */
    function lamp(x, z, kind, y0) { var Y0 = y0 == null ? Y1 : y0; if (kind === 'lantern') { cylY(B.dark, x, Y0, Y0 + 3.6, z, 0.07, 0x23272b, 8); bx(B.dark, x - 0.22, x + 0.22, Y0 + 3.6, Y0 + 3.7, z - 0.22, z + 0.22, 0x23272b); bx(B.glow, x - 0.18, x + 0.18, Y0 + 3.7, Y0 + 4.25, z - 0.18, z + 0.18, 0xffe6b8); spyrB(B.dark, x, z, 0.3, Y0 + 4.25, Y0 + 4.6, 0x23272b); H2.gw(x, Y0 + 4.0, z, 7, 1); }
      else { cylY(B.metal, x, Y1, Y1 + 7.6, z, 0.09, 0x8a9096, 8); bx(B.metal, x - 0.5, x + 0.5, Y1 + 7.5, Y1 + 7.65, z - 0.15, z + 0.15, 0x8a9096); bx(B.glow, x - 0.42, x + 0.42, Y1 + 7.44, Y1 + 7.5, z - 0.1, z + 0.1, 0xfff2dc); H2.gw(x, Y1 + 7.3, z, 9, 1.2); } H2.col(x - 0.15, x + 0.15, z - 0.15, z + 0.15, Y0 - 1, Y0 + 4); lamps.push([x, z]); }
    for (x = -110; x < 70; x += 18) { lamp(x, -44, 'lantern'); lamp(x, 44, 'lantern'); } for (z = -30; z < 40; z += 18) lamp(-114, z, 'lantern'); for (z = 30; z < 190; z += 18) lamp(250, z, 'lantern');
    [[RMZ, 'x'], [RKA, 'x'], [RKE, 'x']].forEach(function (q) { for (var zz = MAPZ[0] + 6; zz < MAPZ[1]; zz += 24) { if (zz > -16 && zz < 16 && q[0] !== RMZ) continue; if (q[0] === RKA && zz > TUN) continue; lamp(q[0][0] - 1.4, zz, 'pole'); } });
    [[RKO, -192, RMZ[0]], [RMA, RMZ[1], RKA[0]], [ROT, RKE[1], MAPX[1]]].forEach(function (q) { for (var xx = q[1] + 6; xx < q[2]; xx += 24) lamp(xx, q[0][1] + 1.4, 'pole'); });
    for (z = MAPZ[0] + 12; z < MAPZ[1]; z += 22) { lamp(LPR[0] + 1.2, z, 'lantern', PROM); lamp(RPR[1] - 1.6, z, 'lantern', PROM); } /* the promenades' lanterns, on their own level */
    /* benches on the Domplatte, Roncalliplatz and in the Rheingarten; bollards along the plaza's edges to the streets */
    function bench(x, z, ry) { var c = Math.cos(ry), s = Math.sin(ry); B.paint.add(K.box(2.0, 0.08, 0.5), { p: [x, Y1 + 0.45, z], r: [0, ry, 0] }, 0x7a5a3a); B.paint.add(K.box(2.0, 0.5, 0.08), { p: [x - s * 0.24, Y1 + 0.72, z - c * 0.24], r: [0, ry, 0] }, 0x7a5a3a); [-0.85, 0.85].forEach(function (o) { B.dark.add(K.box(0.08, 0.45, 0.45), { p: [x + c * o, Y1 + 0.22, z - s * o], r: [0, ry, 0] }, 0x2a2e32); }); H2.col(x - 1.1, x + 1.1, z - 1.1, z + 1.1, -1, 1.0); }
    for (x = -96; x < 50; x += 22) { bench(x, -40, Math.PI); bench(x, 40, 0); } for (z = 30; z < 186; z += 20) bench(220, z, -Math.PI / 2); for (x = -30; x < 80; x += 24) bench(x, 96 - 3, 0);
    for (x = -116; x < 76; x += 3) { if (Math.abs(x + 60) < 8) continue; cylY(B.conc, x, Y1, Y1 + 0.8, 47.5, 0.16, 0xd8d4cc, 10); }
    T.lamps = lamps;
    /* ---------- the signals: poles at the junctions' corners, the cars' heads facing the traffic, the walkers' heads across each crossing;
       the street plates on the poles ---------- */
    var SU = { car: [[0, 100], [100, 200]], ped: [[200, 300], [300, 400]] };
    function head(Bt, cell, w, h, x, y, z, ry) { Bt.add(new THREE.PlaneGeometry(w, h), { p: [x, y, z], r: [0, ry, 0] }, 0xffffff, { uvRect: { u0: cell[0] / 512, u1: cell[1] / 512, v0: 0, v1: 1 } }); B.dark.add(K.box(w + 0.1, h + 0.1, 0.22), { p: [x - Math.sin(ry) * 0.12, y, z - Math.cos(ry) * 0.12], r: [0, ry, 0] }, 0x1a1c1e); }
    function pole(x, z, h) { cylY(B.paint, x, Y1, Y1 + (h || 3.4), z, 0.07, 0x2a2e32, 8); H2.col(x - 0.15, x + 0.15, z - 0.15, z + 0.15, -1, 4); }
    T.sigB = { A: K.Batch({ uv: true }), B: K.Batch({ uv: true }) };
    Object.keys(INT).forEach(function (kk) { var I = INT[kk], g = kk === 'J5' ? 'B' : 'A', SBt = T.sigB[g], legs = I.legs, x0 = I.x[0], x1 = I.x[1], z0 = I.z[0], z1 = I.z[1];
      /* the cars: southbound traffic coming from the north (axis z) sees a head at the north-west corner facing north, and so on */
      if (legs.indexOf('N') >= 0) { pole(x0 - 1.0, z0 - CWW - 1.6); head(SBt, SU.car[1], 0.42, 1.08, x0 - 1.0, Y1 + 2.9, z0 - CWW - 1.45, Math.PI); }
      if (legs.indexOf('S') >= 0) { pole(x1 + 1.0, z1 + CWW + 1.6); head(SBt, SU.car[1], 0.42, 1.08, x1 + 1.0, Y1 + 2.9, z1 + CWW + 1.45, 0); }
      if (legs.indexOf('W') >= 0) { pole(x0 - CWW - 1.6, z1 + 1.0); head(SBt, SU.car[0], 0.42, 1.08, x0 - CWW - 1.45, Y1 + 2.9, z1 + 1.0, -Math.PI / 2); }
      if (legs.indexOf('E') >= 0) { pole(x1 + CWW + 1.6, z0 - 1.0); head(SBt, SU.car[0], 0.42, 1.08, x1 + CWW + 1.45, Y1 + 2.9, z0 - 1.0, Math.PI / 2); }
      /* the walkers' heads at both ends of each crossing (a crossing of a north–south road runs along x: the ns cell) */
      T.cross.filter(function (c) { return c[5] === kk; }).forEach(function (c) { var mx = (c[0] + c[1]) / 2, mz = (c[2] + c[3]) / 2; if (c[4] === 'ns') { [[c[0] - 1.2, Math.PI / 2], [c[1] + 1.2, -Math.PI / 2]].forEach(function (q) { pole(q[0], mz + CWW / 2 + 0.6, 2.6); head(SBt, SU.ped[1], 0.34, 0.86, q[0], Y1 + 2.2, mz + CWW / 2 + 0.6, q[1]); }); }
        else { [[c[2] - 1.2, Math.PI], [c[3] + 1.2, 0]].forEach(function (q) { pole(mx + CWW / 2 + 0.6, q[0], 2.6); head(SBt, SU.ped[0], 0.34, 0.86, mx + CWW / 2 + 0.6, Y1 + 2.2, q[0], q[1]); }); } }); });
    /* the street plates on posts at the junctions (the real names, Köln's white plates) */ function plate(name, x, z, ry) { var key = 'st:' + name; if (!signs().c[key]) return; cylY(B.paint, x, Y1, Y1 + 2.9, z, 0.05, 0x2a2e32, 8); signQ(B.sign, key, 1.9, 0.4, x, Y1 + 2.7, z, ry); signQ(B.sign, key, 1.9, 0.4, x, Y1 + 2.7, z, ry + Math.PI); H2.col(x - 0.1, x + 0.1, z - 0.1, z + 0.1, -1, 4); }
    plate('Komödienstraße', RMZ[0] - 8, RKO[1] + 2, 0); plate('An den Dominikanern', RMZ[1] + 2, RKO[1] + 8, Math.PI / 2); plate('Marzellenstraße', RMZ[1] + 2, RKO[0] - 10, Math.PI / 2); plate('Machabäerstraße', RMZ[1] + 10, RMA[1] + 2, 0); plate('Konrad-Adenauer-Ufer', RKA[1] + 2, RMA[1] + 10, Math.PI / 2); plate('Kennedy-Ufer', RKE[0] - 2, ROT[1] + 10, Math.PI / 2); plate('Ottoplatz', RKE[1] + 10, ROT[1] + 2, 0);
    plate('Bahnhofsvorplatz', -70, -46, 0); plate('Domkloster', -100, 4, Math.PI / 2); plate('Roncalliplatz', 30, 50, 0); plate('Hohe Straße', -46, 100, Math.PI / 2); plate('Am Hof', -40, 98, 0); plate('Heinrich-Böll-Platz', 120, 8, 0); plate('Rheingarten', 230, 20, 0); plate('Frankenwerft', 266, 196, Math.PI / 2); plate('Breslauer Platz', 40, -150, 0); plate('Rheinboulevard', 630, 30, Math.PI / 2);
    return { items: items, TG: TG }; }
  function spyrB(Bt, x, z, r, y0, y1, col) { var g = new THREE.ConeGeometry(r, y1 - y0, 4, 1, false); g.rotateY(Math.PI / 4); g.translate(x, (y0 + y1) / 2, z); Bt.add(g, null, col); }
