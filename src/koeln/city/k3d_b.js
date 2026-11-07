
  /* ===== KOELN3D part 2: the build — the groups, the ground and the river, the streets and their markings ===== */
  function build(scene, o) { o = o || {}; NAT.lod = o.tier === 'low' ? 0 : (o.tier === 'high' || o.tier === 'ultra') ? 2 : 1; init(); mats(); signs(); var X = o.x || 0, Z = o.z || 0, Y = o.y || 0, hi = o.tier !== 'low', root = new THREE.Group(); root.position.set(X, Y, Z); scene.add(root);
    var T = { low: !hi, root: root, X: X, Z: Z, Y: Y, f: 1, trains: [], cars: [], peds: [], colliders: [], glows: [], raised: [], walk: [], ramps: [], cam: [], mass: [], air: [], sig: { t: 0, ph: 'A' }, heads: [], ped: [], spots: {}, crows: [], z0: MAPZ[0], z1: MAPZ[1], x0: MAPX[0], x1: MAPX[1], id: 'koeln', esc: [], boards: [], kboards: [], rd: { road: [], walk: [], bld: [], stn: [], pol: [] }, elev: true, cross: [], INT: INT, CWW: CWW, Y1: Y1, TY: TY };
    T.toW = function (lx, ly, lz) { return new V3(X + lx, Y + (ly || 0), Z + lz); }; T.toL = function (wx, wz) { return [wx - X, wz - Z]; };
    /* the groups: the city; the station's insides (shown from near); the trains; the cathedral (its own group: the biggest single thing);
       the bar's inside (only near it); the river */
    var G = { ext: new THREE.Group(), hall: new THREE.Group(), b1: new THREE.Group(), b2: new THREE.Group(), dom: new THREE.Group(), bar: new THREE.Group(), river: new THREE.Group(), night: new THREE.Group() }; Object.keys(G).forEach(function (k) { root.add(G[k]); }); T.G = G; /* (the engine shows a walker below -2 only with b1: the lower promenades) */
    function col(x0, x1, z0, z1, y0, y1) { T.colliders.push([X + (x0 + x1) / 2, Z + (z0 + z1) / 2, Math.abs(x1 - x0) / 2, Math.abs(z1 - z0) / 2, y0 == null ? -1 : y0, y1 == null ? 3 : y1]); }
    function cb(x0, x1, y0, y1, z0, z1) { T.cam.push([Math.min(x0, x1), Math.max(x0, x1), y0, y1, Math.min(z0, z1), Math.max(z0, z1)]); return T.cam[T.cam.length - 1]; }
    function mass(x0, x1, y0, y1, z0, z1) { T.mass.push([x0, x1, y0, y1, z0, z1]); } function air(x0, x1, y0, y1, z0, z1) { T.air.push([x0, x1, y0, y1, z0, z1]); }
    function walk(x0, x1, z0, z1, y0, y1) { T.walk.push([Math.min(x0, x1), Math.max(x0, x1), Math.min(z0, z1), Math.max(z0, z1), y0, y1]); } function floor(x0, x1, z0, z1, h) { T.raised.push([Math.min(x0, x1), Math.max(x0, x1), Math.min(z0, z1), Math.max(z0, z1), h]); } function ramp(x0, x1, z0, z1, h0, h1, ax) { T.ramps.push(ax === 'x' ? [x0, x1, z0, z1, h0, h1, 'x'] : [x0, x1, z0, z1, h0, h1]); }
    function gw(x, y, z, r, k) { T.glows.push([X + x, Y + y, Z + z, r, k || 1]); }
    /* a building block: solid to walkers and to the camera, listed for the radar and the people's cover */ function solid(x0, x1, z0, z1, h, kind) { col(x0, x1, z0, z1, -1, h); cb(x0, x1, -1, h, z0, z1); (kind === 'stn' ? T.rd.stn : kind === 'pol' ? T.rd.pol : T.rd.bld).push([Math.min(x0, x1), Math.max(x0, x1), Math.min(z0, z1), Math.max(z0, z1), h]); }
    /* a turned solid (the station, the curve's walls): cut into strips */ function solidP(P, y0, y1, s) { strips(P, s || 2, false).forEach(function (q) { col(q[0], q[1], q[2], q[3], y0, y1); cb(q[0], q[1], y0, y1, q[2], q[3]); }); }
    function floorP(P, h, s) { strips(P, s || 1.5, true).forEach(function (q) { floor(q[0], q[1], q[2], q[3], h); }); }
    /* (V74) the same, but covering the turned shape whole (the boxes reach a little past its edges): where two floors of a turned building meet
       (a platform and its stair's head), the boxes of each, kept inside their own shapes, left a saw-toothed gap between them that a walker fell
       through; the walks (kept inside) still keep walkers off the edges */ function floorPO(P, h, s) { strips(P, s || 1.5, false).forEach(function (q) { floor(q[0], q[1], q[2], q[3], h); }); }
    function walkP(P, y0, y1, s) { strips(P, s || 1.5, true).forEach(function (q) { walk(q[0], q[1], q[2], q[3], y0, y1); }); }
    T.H = { col: col, cb: cb, mass: mass, air: air, walk: walk, floor: floor, ramp: ramp, gw: gw, solid: solid, solidP: solidP, floorP: floorP, floorPO: floorPO, walkP: walkP };
    /* the batches: one draw per material and group */
    function batches() { var b = { lawn: K.Batch({ uv: true }), soil: K.Batch({ uv: true }), leafF: K.Batch({ sway: true }), paint: K.Batch(), dark: K.Batch(), metal: K.Batch(), glass: K.Batch(), glow: K.Batch(), mat: K.Batch(), line: K.Batch(), sign: K.Batch({ uv: true }), asph: K.Batch({ uv: true }), conc: K.Batch({ uv: true, wuv: 4 }), curtain: K.Batch({ uv: true }), tile2: K.Batch({ uv: true }), tact: K.Batch({ uv: true }), ball: K.Batch({ uv: true }), girder: K.Batch({ uv: true }), gran: K.Batch({ uv: true }), plat: K.Batch({ uv: true }),
        dstone: K.Batch({ uv: true }), dstoneR: K.Batch({ uv: true }), lead: K.Batch({ uv: true }), slab: K.Batch({ uv: true }), walk: K.Batch({ uv: true }), sett: K.Batch({ uv: true }), gable: K.Batch({ uv: true }), hroof: K.Batch({ uv: true }), roof: K.Batch({ uv: true }), spire: K.Batch({ uv: true }), neon: K.Batch(), locks: K.Batch({ uv: true }), mesh: K.Batch({ uv: true }), fac: [], dbay: [] }; for (var i = 0; i < 8; i++) b.fac.push(K.Batch({ uv: true })); for (i = 0; i < 3; i++) b.dbay.push(K.Batch({ uv: true })); return b; }
    var B = batches(), HB2 = batches(), DB = batches(), RB = batches(), BB = batches(), NB = batches(); B.leaf = K.Batch(); B.trunk = K.Batch();
    T.B = { B: B, HB: HB2, DB: DB, RB: RB, BB: BB, NB: NB };
    var r0 = rnd(5501), MK = 0.012;

    /* ================= the ground: the two banks at the street's level, the lower promenades, the river ================= */
    var WLAND = [MAPX[0] - 80, LPR[0]], ELAND = [RPR[1], MAPX[1] + 80];
    flat(B.asph, -1600, RKA[1] + 3.99, -1600, 1600, -0.05, 30, 30); flat(B.asph, RSTEP[1] + 0.01, 1600, -1600, 1600, -0.05, 30, 30);
    /* the streets: asphalt at 0 */
    var ROADS = [[RMZ[0], RMZ[1], MAPZ[0] - 80, MAPZ[1] + 80], [MAPX[0] - 80, RMZ[0], RKO[0], RKO[1]], [RMZ[1], RKA[0], RMA[0], RMA[1]], [RKA[0], RKA[1], MAPZ[0] - 80, TUN], [RKE[0], RKE[1], MAPZ[0] - 80, MAPZ[1] + 80], [RKE[1], MAPX[1] + 80, ROT[0], ROT[1]]];
    ROADS.forEach(function (q) { flat(B.asph, q[0], q[1], q[2], q[3], 0.0, 9, 9); T.rd.road.push(q.slice()); });
    /* the pavements and plazas: the land at 0.12 minus the streets, cut into rectangles; the special pavings laid over them later */
    var landW = H.rectMinus([MAPX[0] - 80, RKA[1] + 4, MAPZ[0] - 80, MAPZ[1] + 80], ROADS.filter(function (q) { return q[0] < RKA[1] + 5; }).concat([[RKA[0] - 0.6, RKA[1] + 0.6, TUN, TUN + 18]]));
    var landR = [[RKA[1] + 4, LPR[0], MAPZ[0] - 80, MAPZ[1] + 80]]; /* the strip along the river's wall (north of the bridge the quay's upper walk; south of it the Rheingarten's lower edge) */
    var landE = H.rectMinus([RSTEP[1], MAPX[1] + 80, MAPZ[0] - 80, MAPZ[1] + 80], ROADS.filter(function (q) { return q[0] > 600; }));
    landW.concat(landE).forEach(function (q) { flat(B.walk, q[0], q[1], q[2], q[3], Y1, 2.4, 2.4); floor(q[0], q[1], q[2], q[3], Y1); T.rd.walk.push(q.slice()); });
    /* north of the bridge: the quay's upper walk between the road and the wall (Konrad-Adenauer-Ufer); Deutz north of the bridge: the land to the wall */
    flat(B.walk, landR[0][0], landR[0][1], MAPZ[0] - 80, BRZ[1] + 1, Y1, 2.4, 2.4); floor(landR[0][0], landR[0][1], MAPZ[0] - 80, BRZ[1] + 1, Y1); T.rd.walk.push([landR[0][0], landR[0][1], MAPZ[0] - 80, BRZ[1] + 1]);
    flat(B.walk, RPR[1], RSTEP[1], MAPZ[0] - 80, BRZ[1] + 0.5, Y1, 2.4, 2.4); floor(RPR[1], RSTEP[1], MAPZ[0] - 80, BRZ[1] + 0.5, Y1); T.rd.walk.push([RPR[1], RSTEP[1], MAPZ[0] - 80, BRZ[1] + 0.5]);
    /* the whole land is walkable at the street's level (the buildings are solid); the promenades at theirs; the river not */
    walk(MAPX[0], LPR[0], MAPZ[0], MAPZ[1], -1, 3.2); walk(RPR[1], MAPX[1], MAPZ[0], MAPZ[1], -1, 3.2);
    /* the lower promenades (Frankenwerft and Konrad-Adenauer-Ufer's quay on the left bank, the Deutz quay on the right): basalt setts */
    [[LPR[0], LPR[1]], [RPR[0], RPR[1]]].forEach(function (p) { flat(B.sett, p[0], p[1], MAPZ[0] - 80, MAPZ[1] + 80, PROM, 2.4, 2.4); floor(p[0], p[1], MAPZ[0] - 80, MAPZ[1] + 80, PROM); walk(p[0], p[1], MAPZ[0], MAPZ[1], PROM - 1, PROM + 3.2); });
    /* the quay walls: stone from the water to the promenade; the river wall from the promenade up to the street (north of the bridge on the
       left bank, both sides on the right bank north of the bridge; south of the bridge the Rheingarten's terraces and the Rheinboulevard's
       steps come down instead) */
    function wallX(x, z0, z1, y0, y1, face) { var g = KT.uvBox(1.2, y1 - y0, z1 - z0, 4, 4); g.translate(x + face * 0.6, y0 + (y1 - y0) / 2, (z0 + z1) / 2); B.dstone.add(g, null, 0xb8b2a6); }
    wallX(QW - 1.2, MAPZ[0] - 80, MAPZ[1] + 80, WATER - 3, PROM, 1); wallX(QE, MAPZ[0] - 80, MAPZ[1] + 80, WATER - 3, PROM, 1);
    wallX(LPR[0] - 1.2, MAPZ[0] - 80, BRZ[1] + 1, PROM, Y1, 1); wallX(RPR[1], MAPZ[0] - 80, BRZ[1] + 1, PROM, Y1, 1);
    col(LPR[0] - 1.6, LPR[0] + 0.2, MAPZ[0], BRZ[1] + 1, PROM - 1, Y1 - 0.3); col(RPR[1] - 0.2, RPR[1] + 1.6, MAPZ[0], BRZ[1] + 1, PROM - 1, Y1 - 0.3);
    /* railings along the upper edges (and along the promenade's water edge, low) */ [[LPR[0] - 0.3, MAPZ[0] - 80, BRZ[1] + 1], [RPR[1] + 0.3, MAPZ[0] - 80, BRZ[1] + 1]].forEach(function (q) { bx(B.dark, q[0] - 0.04, q[0] + 0.04, Y1 + 0.95, Y1 + 1.0, q[1], q[2], 0x2a2e32); for (var zz = q[1]; zz < q[2]; zz += 2.4) bx(B.dark, q[0] - 0.04, q[0] + 0.04, Y1, Y1 + 1.0, zz, zz + 0.08, 0x2a2e32); col(q[0] - 0.3, q[0] + 0.3, q[1], q[2], -1, 3); });
    [[QW - 0.25, 1], [QE + 0.25, -1]].forEach(function (q) { for (var zz = MAPZ[0] - 80; zz < MAPZ[1] + 80; zz += 3.2) bx(B.dark, q[0] - 0.05, q[0] + 0.05, PROM, PROM + 0.9, zz, zz + 0.08, 0x2a2e32); bx(B.dark, q[0] - 0.05, q[0] + 0.05, PROM + 0.86, PROM + 0.92, MAPZ[0] - 80, MAPZ[1] + 80, 0x2a2e32); col(q[0] - 0.3, q[0] + 0.3, MAPZ[0], MAPZ[1], PROM - 1, PROM + 3); });
    /* the Rheingarten's terraces down to Frankenwerft (south of the bridge): three broad flights with landings, lawns between */
    (function () { var x0 = RKA[1] + 4, x1 = LPR[0], z0 = BRZ[1] + 1, z1 = MAPZ[1] + 80, n = 14, i; for (i = 0; i < n; i++) { var xa = x0 + (x1 - x0) * i / n, xb = x0 + (x1 - x0) * (i + 1) / n, y = Y1 + (PROM - Y1) * (i + 0.5) / n; var g = KT.uvBox(xb - xa, 0.4, z1 - z0, 2, 2); g.translate((xa + xb) / 2, y - 0.2, (z0 + z1) / 2); B.slab.add(g, null, 0xffffff); floor(xa, xb, z0, z1, y); }
      /* (V67) each step its own floor (a ramp put her feet half a step into the stone) */ walk(x0, x1, z0, z1, PROM - 1, 3.2); T.rd.walk.push([x0, x1, z0, z1]); })();
    /* the Rheinboulevard: the great steps of Deutz, from the promenade up to the street, south of the bridge (granite, with benches on the
       landings) */
    (function () { var x0 = RPR[1], x1 = RSTEP[1], z0 = BRZ[1] + 1, z1 = MAPZ[1] + 80, n = 12, i; for (i = 0; i < n; i++) { var xa = x0 + (x1 - x0) * i / n, xb = x0 + (x1 - x0) * (i + 1) / n, y = PROM + (Y1 - PROM) * (i + 0.5) / n; var g = KT.uvBox(xb - xa, 0.5, z1 - z0, 2, 2); g.translate((xa + xb) / 2, y - 0.25, (z0 + z1) / 2); B.slab.add(g, null, 0xe8e4dc); floor(xa, xb, z0, z1, y); }
      /* (V67) each step its own floor */ walk(x0, x1, z0, z1, PROM - 1, 3.2); T.rd.walk.push([x0, x1, z0, z1]); })();
    /* (V68) the Rhine's water. The current runs north (to -z) at about 1.5 m/s and carries everything on the surface with it: the long wind
       waves and the short chop (five trains of waves summed, their slopes the surface's normal), the fine ripple (noise in four octaves), and
       the river's own unrest — smooth slicks and rough patches, boils that drift down with it. The colour is the Rhine's olive grey-green, a
       little lighter where the water is shallow at the quays. It mirrors what stands over it: the sky (pale at the horizon, deeper overhead),
       the two banks' walls and houses, the bridge's deck, piers and arches, all broken by the waves; Fresnel's law decides how much is mirror
       and how much is water. The sun glints in the crests. Foam: where the water slaps the quay walls, round the piers' cutwaters and in the
       long wakes behind them, and in the ships' wakes (the stern's churn and the two arms of the Kelvin wedge). Rain stipples it. */
    /* (V69) the water's own textures: a spectrum of small waves as a seamless slope map (many wave trains of random length and direction about
       the wind's, the shorter the lower), and the foam's bubbles in clusters with threads between them */
    function kwaveTex(o) { var S2 = o.size || 256, n = o.n || 48, r = rnd(o.seed || 91), K2 = [], i, x, y; for (i = 0; i < n; i++) { var km = 3 + Math.pow(r(), 1.35) * (o.kmax || 36), a = (o.dir || 0) + (r() - 0.5) * 2 * (o.spread || 1.1) * (r() < 0.8 ? 0.6 : 1.6), kx = Math.round(Math.cos(a) * km), ky = Math.round(Math.sin(a) * km); if (!kx && !ky) kx = 3; K2.push([kx, ky, Math.pow(Math.hypot(kx, ky), -(o.pw || 1.7)), r() * 6.2832]); }
      var gx = new Float32Array(S2 * S2), gy = new Float32Array(S2 * S2), mx = 1e-6, TP = 6.2832 / S2; for (y = 0; y < S2; y++) for (x = 0; x < S2; x++) { var sx = 0, sy = 0; for (i = 0; i < n; i++) { var q = K2[i], v = -q[2] * Math.sin((q[0] * x + q[1] * y) * TP + q[3]); sx += v * q[0]; sy += v * q[1]; } var j = y * S2 + x; gx[j] = sx; gy[j] = sy; mx = Math.max(mx, Math.abs(sx), Math.abs(sy)); }
      var D = new Uint8Array(S2 * S2 * 4); for (i = 0; i < S2 * S2; i++) { D[i * 4] = Math.round(127.5 + 127 * gx[i] / mx); D[i * 4 + 1] = Math.round(127.5 + 127 * gy[i] / mx); D[i * 4 + 2] = 255; D[i * 4 + 3] = 255; }
      var t = new THREE.DataTexture(D, S2, S2); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8; t.needsUpdate = true; return t; }
    function kfoamTex() { var S2 = 512, c = document.createElement('canvas'); c.width = c.height = S2; var g = c.getContext('2d'), r = rnd(57), i; g.fillStyle = '#000'; g.fillRect(0, 0, S2, S2);
      function dot(x, y, rad, a) { for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) { var px = x + ox * S2, py = y + oy * S2; if (px < -rad || px > S2 + rad || py < -rad || py > S2 + rad) continue; g.globalAlpha = a; g.beginPath(); g.arc(px, py, rad, 0, 6.2832); g.fill(); } }
      g.fillStyle = '#fff'; for (i = 0; i < 160; i++) { var cx = r() * S2, cy = r() * S2, cr = 12 + r() * 46, m = 60 + Math.floor(r() * 120); for (var k = 0; k < m; k++) { var a = r() * 6.2832, d = Math.pow(r(), 0.6) * cr; dot(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.7, 0.6 + r() * 2.6, 0.25 + r() * 0.6); } }
      g.strokeStyle = '#fff'; for (i = 0; i < 140; i++) { var x0 = r() * S2, y0 = r() * S2, L = 20 + r() * 70; g.globalAlpha = 0.2 + r() * 0.35; g.lineWidth = 0.8 + r() * 1.6; g.beginPath(); g.moveTo(x0, y0); for (var s2 = 1; s2 <= 6; s2++) g.lineTo(x0 + s2 * L / 6, y0 + Math.sin(s2 + r() * 2) * 6); g.stroke(); }
      g.globalAlpha = 1; var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; }
    function rhineMat(su) { var P0 = PIERS.map(function (px) { return new THREE.Vector4(X + px, Z + BRZ[0] - 5.0, Z + BRZ[1] + 6.2, 3.6); });
      var U = { uTime: K.U.uTime, uCurve: K.U.uCurve, uFocus: K.U.uFocus, uNight: K.U.uNight, uSun: su.uSun, uSunC: su.uSunC, uSky: { value: K.lin(0xc6dbe8) }, uZen: { value: K.lin(0x6f9cc6) }, uFog: { value: K.lin(0xcfe0ea) }, uFogN: { value: 150 }, uFogF: { value: 1200 },
        uDeep: { value: K.lin(0x34443a) }, uShallow: { value: K.lin(0x5f6f58) }, uFlow: { value: 1.3 }, uRain: { value: 0 }, uWind: { value: 0.5 }, uPier: { value: P0 }, uShip: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] }, uShipW: { value: [0, 0, 0] },
        uQ: { value: new THREE.Vector4(X + QW, X + QE, Y + 0.12, Y + 0.12) }, uBr: { value: new THREE.Vector4(X + BRX[0], X + BRX[1], Z + BRZ[0], Z + BRZ[1]) }, uBy: { value: new THREE.Vector4(Y + 2.6, Y + BED + 0.9, Y + WATER, 0) },
        uSp: { value: [new THREE.Vector4(X + BRX[0], X + PIERS[0], Y + BED + 0.6, 17.2), new THREE.Vector4(X + PIERS[0], X + PIERS[1], Y + BED + 0.6, 23.6), new THREE.Vector4(X + PIERS[1], X + BRX[1], Y + BED + 0.6, 17.6)] },
        tW1: { value: kwaveTex({ seed: 91, n: 48, dir: -1.45, spread: 0.9, kmax: 36, pw: 1.7 }) }, tW2: { value: kwaveTex({ seed: 17, n: 40, dir: 0.5, spread: 1.4, kmax: 56, pw: 1.5 }) }, tFoam: { value: kfoamTex() }, tRefW: K.U.tRefW || { value: null }, uRMw: K.U.uRMw || { value: new THREE.Matrix4() }, uRefW: K.U.uRefW || { value: 0 } };
      return new THREE.ShaderMaterial({ fog: false, uniforms: U,
        vertexShader: 'attribute float aSd; uniform float uTime, uCurve, uFocus; varying vec3 vW; varying float vDepth, vSd; void main(){ vec4 w = modelMatrix * vec4(position,1.0); w.y += sin(w.x * 0.21 + w.z * 0.05 + uTime * 0.9) * 0.03; vW = w.xyz; vSd = aSd; vec4 mv = viewMatrix * w; float dz = max(0.0, -mv.z - uFocus); mv.y -= uCurve * dz * dz; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }',
        fragmentShader: [
'uniform float uTime, uFogN, uFogF, uNight, uFlow, uRain, uWind; uniform vec3 uDeep, uShallow, uSun, uSunC, uSky, uZen, uFog; uniform vec4 uPier[2]; uniform vec4 uShip[3]; uniform float uShipW[3]; uniform vec4 uQ, uBr, uBy; uniform vec4 uSp[3];',
'varying vec3 vW; varying float vDepth, vSd; uniform sampler2D tW1, tW2, tFoam, tRefW; uniform mat4 uRMw; uniform float uRefW;',
'float hsh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); return mix(mix(hsh(i), hsh(i + vec2(1.0, 0.0)), u.x), mix(hsh(i + vec2(0.0, 1.0)), hsh(i + vec2(1.0, 1.0)), u.x), u.y); }',
'float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.07 + vec2(17.1, 9.2); a *= 0.5; } return s; }',
'void wv(inout vec2 g, vec2 p, vec2 d, float k, float a, float w){ g += d * (a * k * cos(dot(d, p) * k - w * uTime)); }',
'float archY(float x){ for (int i = 0; i < 3; i++) { vec4 s = uSp[i]; if (x > s.x && x < s.y) { float t = (x - s.x) / (s.y - s.x); return s.z + s.w * (1.0 - (2.0 * t - 1.0) * (2.0 * t - 1.0)); } } return -1e4; }',
'void main(){',
'  vec3 V = normalize(cameraPosition - vW); vec2 P = vW.xz; float T = uTime;',
'  vec2 Pf = P + vec2(0.0, T * uFlow);',
'  float slick = fbm(Pf * 0.018 + vec2(T * 0.01, 0.0)); float rough = mix(0.45, 1.3, smoothstep(0.3, 0.72, slick)) * (0.6 + uWind * 0.8);',
'  vec2 g = vec2(0.0);',
'  wv(g, Pf, normalize(vec2(0.28, -1.0)), 0.55, 0.075, 1.0); wv(g, Pf, normalize(vec2(-0.62, -0.78)), 1.05, 0.04, 1.5); wv(g, Pf, normalize(vec2(0.9, -0.42)), 1.9, 0.022, 2.1);',
'  vec2 gs = vec2(0.0); wv(gs, Pf, normalize(vec2(-0.2, -1.0)), 3.3, 0.011, 2.8); wv(gs, Pf, normalize(vec2(0.72, 0.69)), 5.6, 0.0055, 3.6); wv(gs, P, normalize(vec2(-0.95, 0.3)), 8.5, 0.003, 4.4); g += gs * (1.0 - smoothstep(40.0, 220.0, vDepth)) + g * 0.0;',
'  float near1 = 1.0 - smoothstep(25.0, 140.0, vDepth), near2 = 1.0 - smoothstep(12.0, 70.0, vDepth);',
/* (V69) the spectrum: the long swell of the wind across the current, the chop on it, the ripples near by (mipmapped, so calm far off) */
'  { vec2 t1 = texture2D(tW1, Pf * 0.034 + vec2(T * 0.006, 0.0)).xy * 2.0 - 1.0; vec2 t2 = texture2D(tW2, vec2(P.x * 0.083 - T * 0.011, Pf.y * 0.083 + T * 0.004)).xy * 2.0 - 1.0; vec2 t3 = near1 > 0.01 ? texture2D(tW1, P * 0.29 + vec2(-T * 0.03, T * 0.05)).xy * 2.0 - 1.0 : vec2(0.0);',
'    gs = (t1 * 0.10 + t2 * 0.065 + t3 * 0.04 * near1) * (0.5 + uWind * 0.6) * (0.75 + 0.5 * smoothstep(0.3, 0.72, slick)); }',
'  g *= rough; vec2 dn = vec2(0.0); if (near1 > 0.01) { vec2 q = Pf * 0.9 + vec2(T * 0.21, -T * 0.13); float e = 0.35; dn = vec2(fbm(q + vec2(e, 0.0)) - fbm(q - vec2(e, 0.0)), fbm(q + vec2(0.0, e)) - fbm(q - vec2(0.0, e))) * 0.22 * rough * near1; }',
'  if (near2 > 0.01) { vec2 q2 = Pf * 3.1 - vec2(T * 0.37, T * 0.29); dn += vec2(vn(q2 + vec2(0.3, 0.0)) - vn(q2 - vec2(0.3, 0.0)), vn(q2 + vec2(0.0, 0.3)) - vn(q2 - vec2(0.0, 0.3))) * 0.08 * rough * near2; }',
'  if (uRain > 0.01) { vec2 rc = floor(P * 1.6); vec2 rf = fract(P * 1.6) - 0.5; float ph = fract(T * 1.3 + hsh(rc) * 7.0); float rr = length(rf + (vec2(hsh(rc + 3.1), hsh(rc + 7.7)) - 0.5) * 0.5); float ring = sin((rr - ph * 0.5) * 40.0) * exp(-rr * 6.0) * (1.0 - ph); dn += normalize(rf + 1e-4) * ring * 0.12 * uRain; }',
'  float foam = 0.0, wk = 0.0;',
'  for (int i = 0; i < 2; i++) { vec4 pr = uPier[i]; float dx = P.x - pr.x, ax = abs(dx); if (ax > 40.0 || P.y < pr.y - 260.0 || P.y > pr.z + 12.0) continue; float s = pr.y - P.y; if (s > 0.0) { float hw = pr.w * 0.9 + s * 0.16; float k = exp(-s / 55.0) * (1.0 - smoothstep(hw * 0.55, hw, ax)); float st = fbm(vec2(dx * 0.7, (P.y + T * uFlow) * 0.12)); foam += k * smoothstep(0.5, 0.82, st) * 0.9; wk += k; }',
'    float sb = P.y - pr.z; float dside = abs(ax - pr.w); if (P.y > pr.y - 1.0 && P.y < pr.z + 1.5) { foam += (1.0 - smoothstep(0.0, 0.9, dside)) * smoothstep(0.45, 0.8, vn(vec2(P.y * 0.8 + T * 2.0, dx))) * 0.8; }',
'    float db = length(vec2(dx * 0.8, max(0.0, sb))); if (sb > -1.5) foam += (1.0 - smoothstep(0.3, 3.2, db)) * smoothstep(0.35, 0.75, vn(vec2(dx * 2.0, sb * 2.0 - T * 3.0))); }',
'  for (int i = 0; i < 3; i++) { vec4 sp = uShip[i]; if (sp.w < 1.0) continue; float al = (P.y - sp.y) * sp.z, lat = P.x - sp.x, beh = -al - sp.w * 0.5; float spd = uShipW[i]; if (abs(lat) > 12.0 + max(0.0, beh) * 0.36 || beh > 420.0 || al > sp.w) continue;',
'    if (beh > 0.0) { float edge = beh * 0.354 + 4.0; float arm = exp(-abs(abs(lat) - edge) / (1.2 + beh * 0.02)) * exp(-beh / 140.0) * spd; float ch = exp(-abs(lat) / (2.6 + beh * 0.035)) * exp(-beh / 70.0) * spd;',
'      foam += ch * smoothstep(0.3, 0.7, fbm(vec2(lat * 0.5, beh * 0.25 - T * 1.5))) * 1.2 + arm * smoothstep(0.45, 0.8, vn(vec2(beh * 0.4, lat))) * 0.6; wk += arm + ch;',
'      float inside = 1.0 - smoothstep(edge * 0.75, edge, abs(lat)); g += vec2(0.0, sp.z) * cos(beh * 0.85 - T * 3.0) * 0.06 * inside * exp(-beh / 90.0) * spd; g += vec2(sign(lat), 0.0) * cos((abs(lat) - edge) * 1.6) * arm * 0.08; }',
'    float bow = al - sp.w * 0.5; if (bow > -2.0 && bow < 6.0 && abs(lat) < 6.5) foam += (1.0 - smoothstep(0.0, 6.0, abs(bow) + max(0.0, abs(lat) - 4.6) * 2.0)) * smoothstep(0.4, 0.8, vn(P * 1.5 + T * 2.0)) * spd; }',
'  float qd = vSd; foam += (1.0 - smoothstep(0.0, 0.8, qd)) * smoothstep(0.35, 0.7, vn(vec2(P.y * 0.6 + T * uFlow * 0.7, qd * 3.0 + T))) * 0.85;',
'  g += dn + gs + wk * 0.04 * vec2(vn(P * 2.0 + T) - 0.5, vn(P * 2.0 - T) - 0.5);',
'  float farK = smoothstep(120.0, 600.0, vDepth); g *= 1.0 - farK * 0.55; vec3 N = normalize(vec3(-g.x, 1.0, -g.y));',
'  float dep = clamp(vSd / 6.0, 0.0, 1.0); vec3 body = mix(uShallow, uDeep, smoothstep(0.0, 1.0, sqrt(dep))) * (0.94 + 0.12 * slick);',
'  vec3 L = normalize(uSun); float sunUp = smoothstep(-0.05, 0.12, L.y); body *= 0.55 + 0.45 * sunUp; body += uShallow * 0.18 * max(0.0, dot(N, L)) * sunUp; float sss = pow(clamp(dot(V, -L) * 0.5 + 0.5, 0.0, 1.0), 3.0) * clamp(length(g) * 2.5, 0.0, 1.0) * sunUp * (1.0 - farK); body += vec3(0.14, 0.2, 0.1) * sss * 0.55;',
'  vec3 R = reflect(-V, N); R.y = abs(R.y); vec3 sky = mix(uSky, uZen, smoothstep(0.02, 0.6, R.y)); vec3 refl = sky;',
'  /* the banks: their walls and houses in the mirror (the left bank higher, with the Altstadt; the right bank lower) */',
'  if (R.x < -0.02) { float t = (P.x - (uQ.x - 6.0)) / -R.x; float hy = vW.y + R.y * t; if (hy < uQ.z + 16.0) refl = mix(vec3(0.21, 0.21, 0.2), vec3(0.32, 0.3, 0.27), smoothstep(uQ.z, uQ.z + 16.0, hy)); }',
'  if (R.x > 0.02) { float t = ((uQ.y + 8.0) - P.x) / R.x; float hy = vW.y + R.y * t; if (hy < uQ.w + 11.0) refl = mix(vec3(0.24, 0.24, 0.22), vec3(0.35, 0.36, 0.33), smoothstep(uQ.w, uQ.w + 11.0, hy)); }',
'  /* the bridge: its deck, the piers, the arches */',
'  if (abs(R.z) > 0.02) { float zf = R.z < 0.0 ? uBr.w : uBr.z; if ((R.z < 0.0 && P.y > zf) || (R.z > 0.0 && P.y < zf)) { float t = (zf - P.y) / R.z; float hx = P.x + R.x * t, hy = vW.y + R.y * t; if (hx > uBr.x - 9.0 && hx < uBr.y) { vec3 bg = vec3(0.24, 0.31, 0.27);',
'      if (hy > uBy.x && hy < uBy.y) refl = bg * 0.8; float py = 0.0; for (int i = 0; i < 2; i++) py += 1.0 - step(uPier[i].w, abs(hx - uPier[i].x)); if (py > 0.5 && hy < uBy.x) refl = vec3(0.33, 0.32, 0.3);',
'      float ay = archY(hx); if (ay > 0.0 && hy > uBy.y && hy < ay + 0.6) { float web = step(0.55, fract(hx / 7.5 * 2.0)) * 0.6 + 0.4; if (hy > ay - 0.9 || web > 0.9) refl = mix(refl, bg, 0.85); } } } }',
'  refl *= 1.0 - uNight * 0.85;',
/* (V69) the mirror: the city, the bridge, the ships and the sky as they are, bent by the waves and drawn into streaks by them */
'  if (uRefW > 0.01) { float dk = (0.35 + 0.65 * (1.0 - farK)) * 2.4; vec4 rp = uRMw * vec4(vW.x + N.x * dk, uBy.z, vW.z + N.z * dk, 1.0); vec2 ruv = rp.xy / rp.w; float sl = 0.003 + 0.011 * rough * (1.0 - farK * 0.6);',
'    vec3 mm = texture2D(tRefW, ruv).rgb * 0.34 + (texture2D(tRefW, ruv + vec2(0.0, sl)).rgb + texture2D(tRefW, ruv - vec2(0.0, sl)).rgb) * 0.2 + (texture2D(tRefW, ruv + vec2(0.0, sl * 2.3)).rgb + texture2D(tRefW, ruv - vec2(0.0, sl * 2.3)).rgb) * 0.13;',
'    float edge = smoothstep(0.0, 0.03, ruv.x) * smoothstep(1.0, 0.97, ruv.x) * smoothstep(0.0, 0.02, ruv.y) * smoothstep(1.0, 0.98, ruv.y); refl = mix(refl, mm, uRefW * edge); }',
'  float cosT = max(dot(N, V), 0.0); float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0); F = clamp(F * 1.1, 0.0, 1.0);',
'  vec3 c = mix(body, refl, F);',
'  vec3 H = normalize(V + L); float nh = max(dot(N, H), 0.0); c += uSunC * (pow(nh, 900.0) * 9.0 + pow(nh, 120.0) * 0.35 * (1.0 - uRefW * 0.7)) * sunUp * (1.0 - uNight);',
'  foam = clamp(foam, 0.0, 1.0); float ftx = texture2D(tFoam, Pf * 0.11 + vec2(0.0, T * 0.015)).r * 0.65 + texture2D(tFoam, P * 0.27 - vec2(T * 0.02, 0.0)).r * 0.35; float fa = clamp(foam * (0.3 + 1.1 * ftx) + smoothstep(0.7, 1.0, foam) * 0.25, 0.0, 1.0); c = mix(c, vec3(0.86, 0.88, 0.86) * (0.35 + 0.65 * sunUp) * (1.0 - uNight * 0.8), fa * 0.85);',
'  float f = smoothstep(uFogN, uFogF, vDepth); gl_FragColor = vec4(mix(c, uFog, f), 1.0);',
'\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'].join('\n') }); }
    /* the river: a sheet of moving water between the quays, deep in the middle; the far reaches beyond the map */
    (function () { var su = o.su || { uSun: { value: new V3(0.3, 0.6, -0.7) }, uSunC: { value: K.lin(0xfff2dc) }, uSky: { value: K.lin(0xbfe3f5) }, uFog: { value: K.lin(0xcfe6f2) }, uFogN: { value: 60 }, uFogF: { value: 400 }, uDeep: { value: K.lin(0x34524a) }, uShallow: { value: K.lin(0x5c7764) } }; var xa = QW - 0.6, xb = QE + 0.6, za = -1600, zb = 1600, nx = 48, nz = 160, pos = [], sd = [], idx = [], i, j;
      for (j = 0; j <= nz; j++) for (i = 0; i <= nx; i++) { var x = xa + (xb - xa) * i / nx, z = za + (zb - za) * j / nz; pos.push(x, WATER, z); sd.push(Math.min(x - xa, xb - x)); }
      for (j = 0; j < nz; j++) for (i = 0; i < nx; i++) { var a = j * (nx + 1) + i, b2 = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, c, b2, b2, c, d); }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aSd', new THREE.Float32BufferAttribute(sd, 1)); g.setIndex(idx); g.computeBoundingSphere();
      var mat = rhineMat(su); MX.water = mat; var wm = new THREE.Mesh(g, mat); wm.frustumCulled = false; G.river.add(wm); T.water = wm;
      /* the river bed under the water's skin, dark (it shows where the water is shallow at the walls) */ flat(B.dark, xa, xb, za, zb, WATER - 3, 20, 20); })();
    /* (V68) the river's traffic: a container ship going up to Basel, a bulk carrier coming down to Rotterdam, an excursion boat of the
       Altstadt's piers (original designs, no line's colours or names). Their hulls sit in the water at their draught; the island's tick moves
       them with the current or against it and tells the water where their wakes are */
    (function () { T.ships = [];
      function hullG(L2, Bw, y0, y1, bowL) { var sh = new THREE.Shape(), hb = Bw / 2; sh.moveTo(-hb, L2 / 2); sh.lineTo(hb, L2 / 2); sh.lineTo(hb, -L2 / 2 + bowL); sh.quadraticCurveTo(hb, -L2 / 2, 0, -L2 / 2 - 0.4); sh.quadraticCurveTo(-hb, -L2 / 2, -hb, -L2 / 2 + bowL); sh.lineTo(-hb, L2 / 2);
        var g = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false, curveSegments: 8 }); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g; } /* (the bow toward +z) */
      function ship(kind, seed) { var Bq = K.Batch(), r = rnd(seed), L2, Bw;
        if (kind === 'box' || kind === 'bulk') { L2 = 92; Bw = 9.5; Bq.add(hullG(L2, Bw, -1.6, 0.0, 9), null, 0x4a120e); Bq.add(hullG(L2, Bw, 0.0, 1.5, 9), null, kind === 'box' ? 0x0b1218 : 0x121a10); Bq.add(K.box(Bw - 0.6, 0.12, L2 - 12), { p: [0, 1.52, -2] }, 0x6a6e70);
          [-1, 1].forEach(function (sd) { Bq.add(K.box(0.08, 0.7, L2 - 6), { p: [sd * (Bw / 2 - 0.1), 1.85, 0] }, 0xe8e8e2); });
          if (kind === 'box') { var pal = [0x123264, 0x6e1a12, 0x2e3438, 0x16401f, 0xa8a8a0, 0x8a3e0c, 0x0a1c40, 0x4e1430]; for (var cz = -26; cz < 36; cz += 5.25) for (var cx = -1; cx <= 1; cx++) for (var tier = 0; tier < 2; tier++) { if (r() < 0.12) continue; Bq.add(K.box(2.0, 2.12, 5.05), { p: [cx * 2.05, 1.6 + 1.08 + tier * 2.16, cz] }, pal[(r() * pal.length) | 0]); } }
          else { for (var hz = -26; hz < 36; hz += 6.2) Bq.add(K.box(Bw - 1.4, 0.7, 6.0), { p: [0, 1.95, hz] }, 0x1c3a26); }
          /* aft: the accommodation, the wheelhouse on top, the mast */ Bq.add(K.box(8.4, 2.4, 7), { p: [0, 2.7, -40.5] }, 0xecece6); Bq.add(K.box(6.4, 0.5, 1.2), { p: [0, 2.6, -36.4] }, 0x2a2e32); Bq.add(K.box(5.2, 2.6, 3.4), { p: [0, 5.2, -40.5] }, 0xecece6); Bq.add(K.box(5.25, 0.9, 3.45), { p: [0, 5.6, -40.5] }, 0x182028); Bq.add(K.box(6.4, 0.16, 4.2), { p: [0, 6.6, -40.5] }, 0xd0d0ca); Bq.add(K.box(0.14, 2.6, 0.14), { p: [0, 7.9, -41.5] }, 0xe0e0da); Bq.add(K.box(1.6, 0.12, 0.3), { p: [0, 8.6, -41.5] }, 0x2a2e32); Bq.add(K.box(0.6, 1.6, 0.6), { p: [2.6, 2.3, -44.6] }, 0xc8c8c0); }
        else { L2 = 57; Bw = 9.5; Bq.add(hullG(L2, Bw, -1.3, 0.0, 7), null, 0x0c1a36); Bq.add(hullG(L2, Bw, 0.0, 1.6, 7), null, 0xf2f2ee); [-1, 1].forEach(function (sd) { Bq.add(K.box(0.06, 0.5, L2 - 10), { p: [sd * (Bw / 2 + 0.01), 0.55, -2] }, 0x0c1a36); });
          /* the main deck's saloon, the upper saloon, the sun deck with its rail, the wheelhouse forward */ Bq.add(K.box(Bw - 0.8, 2.3, 44), { p: [0, 2.75, -3] }, 0xf4f4f0); Bq.add(K.box(Bw - 0.75, 1.1, 43), { p: [0, 2.95, -3] }, 0x1a222a); for (var wp = -24; wp < 19; wp += 2.2) Bq.add(K.box(Bw - 0.7, 1.1, 0.14), { p: [0, 2.95, wp] }, 0xf4f4f0);
          Bq.add(K.box(Bw - 1.6, 2.1, 30), { p: [0, 4.95, -6] }, 0xf4f4f0); Bq.add(K.box(Bw - 1.55, 1.0, 29), { p: [0, 5.1, -6] }, 0x1a222a); Bq.add(K.box(Bw - 1.4, 0.14, 32), { p: [0, 6.08, -6] }, 0xd8d8d2); [-1, 1].forEach(function (sd) { Bq.add(K.box(0.06, 0.8, 31), { p: [sd * ((Bw - 1.4) / 2), 6.5, -6] }, 0x203860); });
          Bq.add(K.box(4.6, 1.9, 3.2), { p: [0, 7.0, 7.0] }, 0xf4f4f0); Bq.add(K.box(4.65, 0.8, 3.25), { p: [0, 7.3, 7.0] }, 0x182028); Bq.add(K.box(0.1, 2.4, 0.1), { p: [0, 7.4, -26.5] }, 0xe8e8e2); Bq.add(K.box(0.9, 0.5, 0.02), { p: [0.45, 8.3, -26.5] }, 0xc8102e);
          for (var bz = -20; bz < 6; bz += 2.4) [-1, 1].forEach(function (sd) { Bq.add(K.box(1.6, 0.42, 0.5), { p: [sd * 2.2, 6.36, bz] }, 0x6a5a48); }); }
        var g2 = new THREE.Group(), m = Bq.mesh(M.mat, { cast: true, recv: true }); /* (matte: a hull's paint does not mirror the sky) */ g2.add(m); G.river.add(g2); return { g: g2, L: L2, kind: kind }; }
      [['box', 9201, 372, -300, 1, 2.6], ['bulk', 9202, 528, 520, -1, 3.4], ['boat', 9203, 452, -820, -1, 3.0]].forEach(function (q) { var sp = ship(q[0], q[1]); sp.x = q[2]; sp.z = q[3]; sp.dir = q[4]; sp.v = q[5]; T.ships.push(sp); sp.g.position.set(sp.x, WATER, sp.z); /* (in the city's own frame: the groups hang under its root) */ sp.g.rotation.y = sp.dir > 0 ? 0 : Math.PI; }); })();

    /* ================= road markings: lane lines, the centre lines, stop lines, the walkers' crossings at the signals ================= */
    function dash(x0, x1, z0, z1, ax, on, off) { var L = ax === 'x' ? x1 - x0 : z1 - z0, s; for (s = 0; s < L; s += on + off) { var e = Math.min(L, s + on); if (ax === 'x') flat(B.line, x0 + s, x0 + e, z0, z1, MK, 1, 1); else flat(B.line, x0, x1, z0 + s, z0 + e, MK, 1, 1); } }
    function lineNS(x, z0, z1, solidL) { if (z1 - z0 < 1) return; if (solidL) flat(B.line, x - 0.07, x + 0.07, z0, z1, MK, 1, 1); else dash(x - 0.06, x + 0.06, z0, z1, 'z', 2.5, 5); }
    function lineEW(z, x0, x1, solidL) { if (x1 - x0 < 1) return; if (solidL) flat(B.line, x0, x1, z - 0.07, z + 0.07, MK, 1, 1); else dash(x0, x1, z - 0.06, z + 0.06, 'x', 2.5, 5); }
    /* the stretches of each road between the junction boxes */ function spansZ(J, z0, z1) { var out = [], a = z0; J.forEach(function (j) { out.push([a, INT[j].z[0]]); a = INT[j].z[1]; }); out.push([a, z1]); return out; }
    function spansX(J, x0, x1) { var out = [], a = x0; J.forEach(function (j) { out.push([a, INT[j].x[0]]); a = INT[j].x[1]; }); out.push([a, x1]); return out; }
    function nsRoad(R, J, z0, z1) { var c = (R[0] + R[1]) / 2; spansZ(J, z0, z1).forEach(function (s2) { var a = s2[0] + (J.some(function (j) { return INT[j].z[1] === s2[0]; }) ? CWW + 1.2 : 0), b = s2[1] - (J.some(function (j) { return INT[j].z[0] === s2[1]; }) ? CWW + 1.2 : 0); lineNS(c, a, b, true); lineNS(c - 2.6, a, b); lineNS(c + 2.6, a, b); }); }
    function ewRoad(R, J, x0, x1) { var c = (R[0] + R[1]) / 2; spansX(J, x0, x1).forEach(function (s2) { var a = s2[0] + (J.some(function (j) { return INT[j].x[1] === s2[0]; }) ? CWW + 1.2 : 0), b = s2[1] - (J.some(function (j) { return INT[j].x[0] === s2[1]; }) ? CWW + 1.2 : 0); lineEW(c, a, b, true); lineEW(c - 2.6, a, b); lineEW(c + 2.6, a, b); }); }
    nsRoad(RMZ, ['J2', 'J1'], MAPZ[0] - 80, MAPZ[1] + 80); nsRoad(RKA, ['J3'], MAPZ[0] - 80, TUN); nsRoad(RKE, ['J5'], MAPZ[0] - 80, MAPZ[1] + 80);
    ewRoad(RKO, ['J1'], MAPX[0] - 80, RMZ[0]); ewRoad(RMA, ['J2', 'J3'], RMZ[0], RKA[1]); ewRoad(ROT, ['J5'], RKE[0], MAPX[1] + 80);
    /* at each junction: the walkers' crossings on its legs (Germany's signalled crossings: two broken white lines, not stripes), the stop
       lines; [x0, x1, z0, z1, axis of the road crossed ('ew': across an east-west road), junction] */
    Object.keys(INT).forEach(function (k) { var I = INT[k], legs = I.legs; function cross(x0, x1, z0, z1, ax) { T.cross.push([x0, x1, z0, z1, ax, k]); if (ax === 'ew') { dash(x0, x0 + 0.25, z0, z1, 'z', 0.6, 0.45); dash(x1 - 0.25, x1, z0, z1, 'z', 0.6, 0.45); } else { dash(x0, x1, z0, z0 + 0.25, 'x', 0.6, 0.45); dash(x0, x1, z1 - 0.25, z1, 'x', 0.6, 0.45); } }
      if (legs.indexOf('N') >= 0) { cross(I.x[0], I.x[1], I.z[0] - CWW - 0.5, I.z[0] - 0.5, 'ns'); flat(B.line, I.x[0], (I.x[0] + I.x[1]) / 2, I.z[0] - CWW - 1.4, I.z[0] - CWW - 1.0, MK, 1, 1); }
      if (legs.indexOf('S') >= 0) { cross(I.x[0], I.x[1], I.z[1] + 0.5, I.z[1] + CWW + 0.5, 'ns'); flat(B.line, (I.x[0] + I.x[1]) / 2, I.x[1], I.z[1] + CWW + 1.0, I.z[1] + CWW + 1.4, MK, 1, 1); }
      if (legs.indexOf('W') >= 0) { cross(I.x[0] - CWW - 0.5, I.x[0] - 0.5, I.z[0], I.z[1], 'ew'); flat(B.line, I.x[0] - CWW - 1.4, I.x[0] - CWW - 1.0, (I.z[0] + I.z[1]) / 2, I.z[1], MK, 1, 1); }
      if (legs.indexOf('E') >= 0) { cross(I.x[1] + 0.5, I.x[1] + CWW + 0.5, I.z[0], I.z[1], 'ew'); flat(B.line, I.x[1] + CWW + 1.0, I.x[1] + CWW + 1.4, I.z[0], (I.z[0] + I.z[1]) / 2, MK, 1, 1); } });
    /* the riverside tunnel's mouth: Konrad-Adenauer-Ufer dips under the Rheingarten just south of the bridge (the trench, its walls, the lid) */
    (function () { var z0 = TUN, z1 = TUN + 36, x0 = RKA[0], x1 = RKA[1], dep = -4.6, i, n = 12; for (i = 0; i < n; i++) { var za = z0 + (z1 - z0) * i / n, zb = z0 + (z1 - z0) * (i + 1) / n, y = dep * Math.min(1, (i + 0.5) / n * 1.6); flat(B.asph, x0, x1, za, zb, y, 9, 9); }
      [x0 - 0.6, x1].forEach(function (wx) { var g = KT.uvBox(0.6, 5.2, z1 - z0, 4, 4); g.translate(wx + 0.3, -4.7 + 2.6, (z0 + z1) / 2); B.conc.add(g, null, 0xd8d4cc); col(wx, wx + 0.6, z0, z1, -6, 3); cb(wx, wx + 0.6, -6, 1, z0, z1); });
      var lid = KT.uvBox(x1 - x0 + 1.2, 1.0, z1 - (z0 + 18), 4, 4); lid.translate((x0 + x1) / 2, Y1 - 0.5, (z0 + 18 + z1) / 2); B.conc.add(lid, null, 0xc8c4bc); bx(B.dark, x0, x1, -4.6, Y1 - 1.0, z0 + 18, z0 + 18.2, 0x0a0c0e);
      /* the trench is not walked: a railing round its open part */ col(x0 - 0.6, x1 + 0.6, z0 + 0.5, z0 + 18, -1, 3); bx(B.dark, x0 - 0.6, x1 + 0.6, Y1 + 0.95, Y1 + 1.02, z0 + 0.4, z0 + 0.5, 0x2a2e32); T.tunnel = [x0, x1, z0, z1, dep]; })();
