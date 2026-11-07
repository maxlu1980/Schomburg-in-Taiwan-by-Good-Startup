/* ===== [dogs.js] ===== */
/* ===== DOG — the dogs of the island: Luna's Maltese and the two border collies at the Good Startup counter =====
   A small quadruped rig modelled in code and cel-shaded like the people. The trunk, four legs of two bones solved by planar IK so the
   paws stay planted on the ground (front legs bend at the elbow backwards, hind legs at the stifle forwards), the neck, the head with its
   muzzle, eyes, nose and ears, the tail. The Maltese wears its long white coat as a floor-length "haystack" parted along the back that
   hides the legs to the paws, a topknot with a bow; the collies are black-and-white and red-and-white with the white ruff, blaze, muzzle,
   legs and tail tip of the breed. Gaits by speed (Froude-like ratio of speed to leg length): walk (lateral sequence), trot (diagonal),
   rotary gallop with a suspension phase; the poses of daily life and of play: sit, lie down (sphinx), sniff, the play bow, rearing up to
   wrestle, chasing the tail, riding. Units: the island's; Luna stands 1.32 tall, the collie 0.44 at the withers, the Maltese 0.19. */
var DOG = (function () {
  var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
  function T(hex, o) { return LUNA.toon(hex, o); }
  function M(geo, mat, ink) { return LUNA.mesh(geo, mat, { ink: ink === false ? false : (ink || 0.004) }); }
  function blob(rx, ry, rz, s) { return LUNA.blob(rx, ry, rz, Math.max(s || 24, 18)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function se(c, e) { return Math.sign(c) * Math.pow(Math.abs(c), e); }
  function geo(pos, idx) { var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  /* a closed loft along z of superellipse rings [yc, z, halfW, halfH] */
  function loftZ(secs, n, NA) { NA = NA || 28; var pos = [], idx = [], NS = secs.length, i, j, e = 2 / n;
    function ring(S, a) { return [se(Math.cos(a), e) * S[2], S[0] + se(Math.sin(a), e) * S[3], S[1]]; }
    for (i = 0; i < NS; i++) for (j = 0; j <= NA; j++) { var p = ring(secs[i], j / NA * Math.PI * 2); pos.push(p[0], p[1], p[2]); }
    for (i = 0; i < NS - 1; i++) for (j = 0; j < NA; j++) { var a = i * (NA + 1) + j, b = a + 1, c = a + NA + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    [0, NS - 1].forEach(function (k, e2) { var S = secs[k], c0 = pos.length / 3; pos.push(0, S[0], S[1]); for (j = 0; j <= NA; j++) { var p = ring(S, j / NA * Math.PI * 2); pos.push(p[0], p[1], p[2]); } for (j = 0; j < NA; j++) { if (e2) idx.push(c0, c0 + 1 + j, c0 + 2 + j); else idx.push(c0, c0 + 2 + j, c0 + 1 + j); } });
    return geo(pos, idx); }
  /* a stack of horizontal superellipse rings [y, halfX, halfZ, zc] closed at the top and the bottom; wave(a) lifts the lowest ring */
  function loftV(rings, n, NA, wave) { NA = NA || 36; var pos = [], idx = [], NR = rings.length, i, j, e = 2 / n;
    function ring(R, a, k) { return [se(Math.cos(a), e) * R[1], R[0] + (k === 0 && wave ? wave(a) : 0), (R[3] || 0) + se(Math.sin(a), e) * R[2]]; }
    for (i = 0; i < NR; i++) for (j = 0; j <= NA; j++) { var p = ring(rings[i], j / NA * Math.PI * 2, i); pos.push(p[0], p[1], p[2]); }
    for (i = 0; i < NR - 1; i++) for (j = 0; j < NA; j++) { var a = i * (NA + 1) + j, b = a + 1, c = a + NA + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    [0, NR - 1].forEach(function (k, top) { var R = rings[k], c0 = pos.length / 3; pos.push(0, R[0] + (top ? 0.004 : 0.0), R[3] || 0); for (j = 0; j <= NA; j++) { var p = ring(R, j / NA * Math.PI * 2, k); pos.push(p[0], p[1], p[2]); } for (j = 0; j < NA; j++) { if (top) idx.push(c0, c0 + 2 + j, c0 + 1 + j); else idx.push(c0, c0 + 1 + j, c0 + 2 + j); } });
    return geo(pos, idx); }
  /* a limb's radius: tapering from r0 to r1, with rounded ends (a fraction a of the length at the start, b at the end) */
  function rnd(r0, r1, a, b) { return function (t) { var e0 = Math.sin(Math.min(1, t / a) * Math.PI * 0.5), e1 = Math.sin(Math.min(1, (1 - t) / b) * Math.PI * 0.5); return (r0 + (r1 - r0) * t) * Math.sqrt(e0 * e1) + 0.0015; }; }
  function tube(pts, r0, r1, o) { o = o || {}; var cv = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5); return LUNA.taper(cv, o.seg || 22, o.rad || 18, typeof r0 === 'function' ? r0 : function (t) { return r0 + (r1 - r0) * Math.pow(t, o.pw || 1); }, { flat: o.flat || 1, up: o.up }); }
  /* the eye: a dark iris with the pupil and two catch-lights, set a little into the face */
  function eyeBall(r, iris) { var g = new THREE.Group(), e = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), T(iris || 0x2a1a12, { rim: false })); e.scale.z = 0.62; g.add(e);
    var pu = new THREE.Mesh(new THREE.SphereGeometry(r * 0.62, 12, 8), new THREE.MeshBasicMaterial({ color: 0x0c0a0a })); pu.scale.z = 0.5; pu.position.z = r * 0.3; g.add(pu);
    var wm = new THREE.MeshBasicMaterial({ color: 0xffffff }), h = new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 8, 6), wm); h.position.set(-r * 0.32, r * 0.36, r * 0.56); g.add(h);
    var h2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.13, 6, 4), wm); h2.position.set(r * 0.3, -r * 0.3, r * 0.58); g.add(h2); return g; }

  /* ---------- a leg: the pivot at the shoulder or the hip, the joint (elbow / stifle), the paw kept flat on the ground ---------- */
  function leg(D, o) { var piv = new THREE.Group(); piv.position.set(o.x, o.y, o.z); D.body.add(piv);
    if (o.mu) { var up = M(tube([V(0, 0.045, 0), V(0, -o.L1 * 0.45, o.front ? -0.004 : 0.008), V(0, -o.L1 - o.r[1] * 0.55, 0)], rnd(o.r[0], o.r[1], 0.1, 0.14)), o.mu, 0.0032); piv.add(up); }
    if (o.thigh) { var th = M(tube([V(0, 0.05, -0.006), V(0, -0.02, 0.016), V(0, -o.thigh[1] * 0.95, 0.02), V(0, -o.thigh[1] * 1.6, 0.004)], function (t) { var e0 = Math.sin(Math.min(1, t / 0.16) * Math.PI * 0.5), e1 = Math.sin(Math.min(1, (1 - t) / 0.2) * Math.PI * 0.5); return (o.thigh[2] * (1 - 0.55 * t) + 0.004) * Math.sqrt(e0) * Math.sqrt(e1) + 0.002; }, 0, { flat: o.thigh[0] / o.thigh[2], up: V(1, 0, 0), seg: 26 }), o.mu, 0.0035); piv.add(th); }
    var kn = new THREE.Group(); kn.position.y = -o.L1; piv.add(kn);
    if (o.ml) { kn.add(M(tube([V(0, o.r[2] * 0.6, 0), V(0, -o.L2 * 0.5, 0), V(0, -o.L2 - 0.004, 0)], rnd(o.r[2], o.r[3], 0.1, 0.06)), o.ml, 0.003)); kn.add(M(blob(o.r[1] * 0.98, o.r[1] * 0.98, o.r[1] * 0.98, 18), o.mu || o.ml, false)); }
    if (o.feather) { var fe = M(tube([V(0, -0.01, -o.r[2] * 0.4), V(0, -o.L2 * 0.4, -o.r[2] * 1.5), V(0, -o.L2 * 0.75, -o.r[2] * 0.9)], function (t) { return o.r[2] * (0.9 + Math.sin(t * Math.PI) * 0.5); }, 0, { flat: 0.45, up: V(1, 0, 0) }), o.feather, 0.0025); kn.add(fe); }
    var paw = new THREE.Group(); paw.position.y = -o.L2; kn.add(paw);
    var pb = M(blob(o.paw[0], o.paw[1], o.paw[2], 14), o.mp, 0.0028); pb.position.set(0, -o.paw[1] * 0.12, o.paw[2] * 0.38); paw.add(pb);
    return { piv: piv, kn: kn, paw: paw, L1: o.L1, L2: o.L2, front: o.front, x: o.x, y: o.y, z: o.z, ah: o.paw[1] * 1.1, rz: o.rz, ty: o.paw[1] * 1.1, tz: o.rz, lift: 0 }; }
  function solve(L, Py, Pz, Ty, Tz, pitch) { var dy = Ty - Py, dz = Tz - Pz, L1 = L.L1, L2 = L.L2, d = Math.sqrt(dy * dy + dz * dz);
    d = clamp(d, Math.abs(L1 - L2) + 0.002, L1 + L2 - 0.0005); var th = Math.atan2(-dz, -dy);
    var al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), be = Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1)), t1, t2;
    if (L.front) { t1 = th + al; t2 = -(Math.PI - be); } else { t1 = th - al; t2 = Math.PI - be; }
    L.piv.rotation.x = t1 - pitch; L.kn.rotation.x = t2; L.paw.rotation.x = -(t1 + t2) + (L.curl || 0); }

  /* ---------- the Maltese: a toy dog in a long white coat ---------- */
  function maltese() { var root = new THREE.Group(), body = new THREE.Group(); root.add(body); var D = { root: root, body: body, kind: 'maltese', legs: [] };
    var fur = T(0xfdfaf3), furS = T(0xefe6d6), pink = T(0xf49ab0), pinkD = T(0xd96f8c), nose = T(0x1a1616, { rim: false }), pad = T(0xf8efe6), tng = T(0xf08a98);
    /* the coat: floor-length, parted along the back, the hem waving */
    var coat = M(loftV([[0.02, 0.09, 0.13, 0.004], [0.04, 0.088, 0.128, 0.004], [0.08, 0.08, 0.12, 0.004], [0.12, 0.07, 0.11, 0.003], [0.15, 0.06, 0.1, 0.002], [0.17, 0.046, 0.086, 0.001], [0.18, 0.028, 0.06, 0], [0.185, 0.008, 0.024, 0]], 2.15, 40,
      function (a) { return 0.006 * Math.sin(a * 11) + 0.003 * Math.sin(a * 5 + 1); }), fur, 0.0034); body.add(coat); D.coat = coat;
    var part = M(tube([V(0, 0.181, -0.085), V(0, 0.1855, 0), V(0, 0.181, 0.075)], 0.0028, 0.0028), furS, false); body.add(part);
    [1, -1].forEach(function (s) { for (var k = 0; k < 3; k++) { var st = M(tube([V(s * 0.03, 0.18, -0.05 + k * 0.05), V(s * 0.066, 0.15, -0.054 + k * 0.052), V(s * 0.08, 0.08, -0.058 + k * 0.054)], 0.0018, 0.0012), furS, false); body.add(st); } });
    var LG = function (x, z, front) { D.legs.push(leg(D, { x: x, y: 0.1, z: z, L1: 0.046, L2: 0.046, front: front, mp: pad, paw: [0.015, 0.011, 0.019], rz: z + (front ? 0.008 : -0.004) })); };
    LG(0.034, 0.072, true); LG(-0.034, 0.072, true); LG(0.034, -0.075, false); LG(-0.034, -0.075, false);
    /* the head: round skull, button eyes and nose, the short muzzle in a white moustache, ears of long hair, the topknot with its bow */
    var neck = new THREE.Group(); neck.position.set(0, 0.15, 0.088); body.add(neck); var head = new THREE.Group(); head.position.set(0, 0.055, 0.03); neck.add(head); D.neck = neck; D.head = head;
    neck.add(M(tube([V(0, -0.03, -0.02), V(0, 0.02, 0.01), V(0, 0.055, 0.03)], 0.045, 0.04), fur, 0.0032));
    head.add(M(blob(0.05, 0.047, 0.047, 24), fur, 0.0034)); var ch = M(blob(0.044, 0.03, 0.03, 16), fur, 0.003); ch.position.set(0, -0.022, 0.022); head.add(ch);
    var mz = M(blob(0.023, 0.019, 0.022, 14), fur, 0.0028); mz.position.set(0, -0.014, 0.043); head.add(mz);
    var ns = M(blob(0.0095, 0.0078, 0.0075, 12), nose, 0.0015); ns.position.set(0, -0.004, 0.064); head.add(ns);
    var mo = new THREE.Group(); head.add(mo); [1, -1].forEach(function (s) { var m1 = M(blob(0.015, 0.02, 0.014, 12), fur, 0.0024); m1.position.set(s * 0.012, -0.03, 0.05); m1.rotation.z = s * 0.15; mo.add(m1); });
    var bd = M(blob(0.013, 0.017, 0.012, 10), fur, 0.0022); bd.position.set(0, -0.042, 0.038); mo.add(bd);
    var tg = M(blob(0.008, 0.003, 0.012, 8), tng, false); tg.position.set(0, -0.032, 0.058); tg.rotation.x = 0.4; head.add(tg); D.tongue = tg;
    [1, -1].forEach(function (s) { var e = eyeBall(0.0105, 0x2b1a12); e.position.set(s * 0.021, 0.007, 0.042); e.rotation.y = s * 0.28; head.add(e);
      var br = M(blob(0.012, 0.006, 0.006, 8), furS, false); br.position.set(s * 0.021, 0.021, 0.044); br.rotation.z = -s * 0.15; head.add(br); });
    D.ears = []; [1, -1].forEach(function (s) { var ear = new THREE.Group(); ear.position.set(s * 0.035, 0.03, -0.004); head.add(ear);
      ear.add(M(tube([V(0, 0, 0), V(s * 0.013, -0.035, 0.002), V(s * 0.017, -0.08, 0.005), V(s * 0.013, -0.12, 0.009)], function (t) { return 0.017 + 0.013 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.82) + 0.004 * (1 - t); }, 0, { flat: 0.42, up: V(0, 0, 1), seg: 16 }), fur, 0.003)); D.ears.push(ear); });
    var tk = M(blob(0.017, 0.024, 0.017, 12), fur, 0.0025); tk.position.set(0, 0.054, 0.004); head.add(tk); [-1, 0, 1].forEach(function (s) { head.add(M(tube([V(s * 0.004, 0.072, 0.002), V(s * 0.01, 0.078, -0.012), V(s * 0.016, 0.066, -0.03)], 0.006, 0.0025), fur, 0.0018)); });
    [1, -1].forEach(function (s) { var bw = M(blob(0.017, 0.011, 0.007, 10), pink, 0.0018); bw.position.set(s * 0.016, 0.062, 0.012); bw.rotation.z = s * 0.45; head.add(bw); var rb = M(blob(0.004, 0.012, 0.003, 6), pinkD, false); rb.position.set(s * 0.008, 0.05, 0.015); rb.rotation.z = s * 0.5; head.add(rb); });
    var kn2 = M(blob(0.006, 0.006, 0.006, 8), pinkD, 0.0015); kn2.position.set(0, 0.062, 0.016); head.add(kn2);
    /* the plume of the tail laid over the back */ var tail = new THREE.Group(); tail.position.set(0, 0.158, -0.088); body.add(tail); D.tail = tail;
    tail.add(M(tube([V(0, 0, 0), V(0, 0.04, -0.012), V(0.005, 0.07, 0.008), V(0.016, 0.07, 0.045), V(0.028, 0.05, 0.07)], function (t) { return 0.012 + 0.014 * Math.sin(t * Math.PI * 0.9); }, 0, { flat: 0.8, seg: 18 }), fur, 0.0028));
    D.hipY = 0.1; D.hipZ = -0.075; D.legLen = 0.092; D.fmax = 5.2; D.h = 0.26; D.len = 0.3; return D; }

  /* ---------- a border collie ---------- */
  function collie(o) { o = o || {}; var root = new THREE.Group(), body = new THREE.Group(); root.add(body); var D = { root: root, body: body, kind: 'collie', legs: [] };
    var dark = T(o.coat || 0x1d1c22), white = T(0xf8f5ef), whiteS = T(0xe9e3d8), nose = T(0x18161a, { rim: false }), tongue = T(0xe9798a), inner = T(o.inner || 0x3a2c2c);
    /* the trunk: level topline, the deep chest, the tucked loin */
    body.add(M(loftZ([[0.36, -0.272, 0.03, 0.032], [0.356, -0.25, 0.064, 0.066], [0.352, -0.205, 0.08, 0.08], [0.35, -0.12, 0.079, 0.074], [0.343, -0.02, 0.083, 0.088], [0.333, 0.07, 0.09, 0.104], [0.332, 0.14, 0.088, 0.108], [0.34, 0.2, 0.072, 0.092], [0.35, 0.235, 0.036, 0.05]], 2.3, 30), dark, 0.004));
    /* the white: the ruff and shirt front, the belly fringe */
    var ruff = M(blob(0.07, 0.09, 0.052, 20), white, 0.0035); ruff.position.set(0, 0.35, 0.212); ruff.rotation.x = -0.3; body.add(ruff);
    var fr = M(loftZ([[0.255, -0.06, 0.02, 0.012], [0.248, 0.0, 0.055, 0.03], [0.238, 0.08, 0.07, 0.04], [0.244, 0.16, 0.06, 0.04], [0.26, 0.2, 0.03, 0.025]], 2.0, 20), white, 0.003); body.add(fr);
    var LG = function (x, z, front) { var s = { x: x, y: front ? 0.3 : 0.33, z: z, L1: front ? 0.15 : 0.16, L2: front ? 0.142 : 0.164, front: front, mp: white, paw: [0.024, 0.019, 0.032], rz: front ? z + 0.012 : z - 0.035 };
      if (front) { s.mu = dark; s.ml = white; s.r = [0.036, 0.029, 0.026, 0.021]; s.feather = white; } else { s.mu = dark; s.ml = white; s.r = [0.04, 0.032, 0.027, 0.021]; s.thigh = [0.043, 0.078, 0.056]; s.feather = white; }
      D.legs.push(leg(D, s)); };
    LG(0.058, 0.13, true); LG(-0.058, 0.13, true); LG(0.062, -0.19, false); LG(-0.062, -0.19, false);
    /* the neck with the white collar, the head: the broad skull, the stop, the tapered muzzle, the blaze, the eyes, the tipped ears */
    var neck = new THREE.Group(); neck.position.set(0, 0.405, 0.175); body.add(neck); D.neck = neck;
    neck.add(M(tube([V(0, -0.04, -0.03), V(0, 0.03, 0.02), V(0, 0.085, 0.06)], 0.07, 0.055), dark, 0.0036));
    var col = M(new THREE.TorusGeometry(0.058, 0.02, 10, 24), white, 0.0028); col.position.set(0, -0.005, 0.0); col.rotation.x = Math.PI / 2 - 0.7; col.scale.set(1.05, 1.1, 0.9); neck.add(col);
    var head = new THREE.Group(); head.position.set(0, 0.1, 0.075); neck.add(head); D.head = head;
    head.add(M(blob(0.066, 0.06, 0.068, 24), dark, 0.0036)); var chk = M(blob(0.058, 0.04, 0.05, 16), dark, 0.003); chk.position.set(0, -0.022, 0.02); head.add(chk);
    var mzG = new THREE.Group(); mzG.position.set(0, -0.022, 0.04); head.add(mzG);
    var mz = M(LUNA.lathe([[0.001, -0.002], [0.032, 0.0], [0.03, 0.035], [0.024, 0.07], [0.014, 0.088], [0.001, 0.092]], 18), white, 0.003); mz.rotation.x = Math.PI / 2; mz.scale.set(1, 1, 0.82); mzG.add(mz);
    var jaw = new THREE.Group(); jaw.position.set(0, -0.016, 0.0); mzG.add(jaw); var jw = M(LUNA.lathe([[0.001, 0.0], [0.024, 0.0], [0.02, 0.04], [0.012, 0.066], [0.001, 0.07]], 14), white, 0.0026); jw.rotation.x = Math.PI / 2; jw.scale.set(1, 1, 0.5); jaw.add(jw); D.jaw = jaw;
    var tg = M(blob(0.016, 0.004, 0.03, 10), tongue, 0.0018); tg.position.set(0, -0.004, 0.05); tg.rotation.x = 0.35; jaw.add(tg); D.tongue = tg;
    var ns = M(blob(0.015, 0.012, 0.011, 12), nose, 0.0018); ns.position.set(0, 0.006, 0.09); mzG.add(ns);
    var bl = M(tube([V(0, 0.008, 0.08), V(0, 0.03, 0.06), V(0, 0.052, 0.04), V(0, 0.062, 0.0)], 0.009, 0.014, { flat: 0.5, up: V(0, 0, 1) }), white, false); bl.scale.set(1, 1, 1); head.add(bl);
    [1, -1].forEach(function (s) { var e = eyeBall(0.0125, o.eye || 0x4a2c16); e.position.set(s * 0.03, 0.014, 0.055); e.rotation.y = s * 0.35; head.add(e); });
    D.ears = []; [1, -1].forEach(function (s) { var ear = new THREE.Group(); ear.position.set(s * 0.042, 0.048, -0.008); ear.rotation.set(-0.1, 0, -s * 0.32); head.add(ear);
      var eg = new THREE.ConeGeometry(0.028, 0.062, 12); eg.translate(0, 0.031, 0); eg.scale(1, 1, 0.42); ear.add(M(eg, dark, 0.0025)); var ig = new THREE.ConeGeometry(0.018, 0.042, 10); ig.translate(0, 0.022, 0); ig.scale(1, 1, 0.3); var im = M(ig, inner, false); im.position.z = 0.006; ear.add(im);
      var tip = new THREE.Group(); tip.position.y = 0.046; ear.add(tip); var tg2 = new THREE.ConeGeometry(0.017, 0.032, 10); tg2.translate(0, 0.016, 0); tg2.scale(1, 1, 0.42); tip.add(M(tg2, dark, 0.002)); tip.rotation.x = 1.15; ear.userData.tip = tip; D.ears.push(ear); });
    /* the tail: low set, long and brushy with the upward swirl and the white tip */ var tail = new THREE.Group(); tail.position.set(0, 0.385, -0.262); body.add(tail); D.tail = tail;
    tail.add(M(tube([V(0, 0, 0), V(0, -0.07, -0.05), V(0, -0.16, -0.07), V(0, -0.22, -0.045), V(0, -0.235, -0.005)], function (t) { return 0.02 + 0.022 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.6); }, 0, { flat: 0.72, seg: 18 }), dark, 0.003));
    var tt = M(blob(0.03, 0.032, 0.024, 12), white, 0.0022); tt.position.set(0, -0.232, -0.012); tail.add(tt);
    D.hipY = 0.33; D.hipZ = -0.19; D.legLen = 0.32; D.fmax = 3.6; D.h = 0.56; D.len = 0.58; return D; }

  /* ---------- the Taiwan dog (台灣土狗): the island's lean, short-coated street dog — prick ears, a wedge head, a sickle tail
     carried over the back, often tan, black-and-tan or brindle, sometimes a spotted tongue ---------- */
  function tugou(o) { o = o || {}; var root = new THREE.Group(), body = new THREE.Group(); root.add(body); var D = { root: root, body: body, kind: 'tugou', legs: [] };
    var coat = T(o.coat || 0xc58a4c), pale = T(o.pale || 0xe8cfa2), dark = T(o.mask || 0x2a2220), nose = T(0x161414, { rim: false }), tongue = T(o.spots ? 0x9a6a8a : 0xe9798a), inner = T(0x6a4a3a);
    body.add(M(loftZ([[0.375, -0.262, 0.026, 0.028], [0.37, -0.24, 0.054, 0.056], [0.366, -0.19, 0.066, 0.064], [0.364, -0.11, 0.062, 0.06], [0.362, -0.02, 0.068, 0.076], [0.356, 0.07, 0.076, 0.092], [0.358, 0.14, 0.072, 0.094], [0.364, 0.198, 0.058, 0.078], [0.372, 0.228, 0.03, 0.04]], 2.25, 28), coat, 0.0038));
    var chest = M(blob(0.05, 0.07, 0.04, 16), pale, 0.003); chest.position.set(0, 0.33, 0.205); chest.rotation.x = -0.25; body.add(chest);
    var LG = function (x, z, front) { var s = { x: x, y: front ? 0.318 : 0.345, z: z, L1: front ? 0.16 : 0.168, L2: front ? 0.155 : 0.172, front: front, mp: o.socks ? pale : coat, paw: [0.021, 0.017, 0.029], rz: front ? z + 0.012 : z - 0.035, mu: coat, ml: o.socks ? pale : coat };
      s.r = front ? [0.03, 0.024, 0.021, 0.017] : [0.034, 0.027, 0.022, 0.017]; if (!front) s.thigh = [0.038, 0.072, 0.052]; D.legs.push(leg(D, s)); };
    LG(0.052, 0.135, true); LG(-0.052, 0.135, true); LG(0.056, -0.19, false); LG(-0.056, -0.19, false);
    var neck = new THREE.Group(); neck.position.set(0, 0.415, 0.18); body.add(neck); D.neck = neck; neck.add(M(tube([V(0, -0.04, -0.03), V(0, 0.03, 0.02), V(0, 0.088, 0.06)], 0.058, 0.044), coat, 0.0034));
    var head = new THREE.Group(); head.position.set(0, 0.104, 0.074); neck.add(head); D.head = head;
    head.add(M(blob(0.056, 0.052, 0.062, 22), coat, 0.0034)); var chk = M(blob(0.05, 0.036, 0.046, 14), coat, 0.003); chk.position.set(0, -0.02, 0.018); head.add(chk);
    var mzG = new THREE.Group(); mzG.position.set(0, -0.02, 0.04); head.add(mzG);
    var mz = M(LUNA.lathe([[0.001, -0.002], [0.028, 0.0], [0.026, 0.04], [0.019, 0.08], [0.011, 0.1], [0.001, 0.104]], 16), o.mask ? dark : pale, 0.0028); mz.rotation.x = Math.PI / 2; mz.scale.set(1, 1, 0.8); mzG.add(mz);
    var jaw = new THREE.Group(); jaw.position.set(0, -0.014, 0.0); mzG.add(jaw); var jw = M(LUNA.lathe([[0.001, 0.0], [0.021, 0.0], [0.017, 0.045], [0.01, 0.076], [0.001, 0.08]], 12), o.mask ? dark : pale, 0.0024); jw.rotation.x = Math.PI / 2; jw.scale.set(1, 1, 0.5); jaw.add(jw); D.jaw = jaw;
    var tg = M(blob(0.014, 0.004, 0.03, 10), tongue, 0.0016); tg.position.set(0, -0.004, 0.055); tg.rotation.x = 0.35; jaw.add(tg); D.tongue = tg;
    var ns = M(blob(0.013, 0.011, 0.01, 12), nose, 0.0016); ns.position.set(0, 0.005, 0.102); mzG.add(ns);
    [1, -1].forEach(function (s) { var e = eyeBall(0.0115, o.eye || 0x5a3414); e.position.set(s * 0.028, 0.016, 0.052); e.rotation.y = s * 0.4; head.add(e); var br = M(blob(0.009, 0.005, 0.007, 8), pale, false); br.position.set(s * 0.028, 0.034, 0.05); head.add(br); });
    D.ears = []; [1, -1].forEach(function (s) { var ear = new THREE.Group(); ear.position.set(s * 0.034, 0.046, -0.01); ear.rotation.set(-0.12, 0, -s * 0.2); head.add(ear);
      var eg = new THREE.ConeGeometry(0.025, 0.07, 12); eg.translate(0, 0.035, 0); eg.scale(1, 1, 0.4); ear.add(M(eg, coat, 0.0024)); var ig = new THREE.ConeGeometry(0.016, 0.05, 10); ig.translate(0, 0.026, 0); ig.scale(1, 1, 0.3); var im = M(ig, inner, false); im.position.z = 0.006; ear.add(im); D.ears.push(ear); });
    var tail = new THREE.Group(); tail.position.set(0, 0.405, -0.255); body.add(tail); D.tail = tail;
    tail.add(M(tube([V(0, 0, 0), V(0, 0.07, -0.06), V(0, 0.15, -0.065), V(0, 0.2, -0.02), V(0, 0.19, 0.035)], function (t) { return 0.019 - 0.008 * t; }, 0, { seg: 16 }), coat, 0.0026));
    D.hipY = 0.345; D.hipZ = -0.19; D.legLen = 0.335; D.fmax = 3.8; D.h = 0.58; D.len = 0.58; return D; }
  /* ---------- the street cat: an orange tabby — round head, wide-set ears, slit pupils, a long ringed tail ---------- */
  function cat(o) { o = o || {}; var root = new THREE.Group(), body = new THREE.Group(); root.add(body); var D = { root: root, body: body, kind: 'cat', legs: [] };
    var fur = T(o.coat || 0xe8873a), str = T(o.stripe || 0xb8561c), cream = T(0xf6e4c8), nose = T(0xd87a7a, { rim: false }), inner = T(0xf0a8a0);
    body.add(M(loftZ([[0.182, -0.17, 0.032, 0.032], [0.18, -0.15, 0.06, 0.062], [0.176, -0.09, 0.068, 0.07], [0.174, -0.0, 0.066, 0.07], [0.175, 0.07, 0.064, 0.07], [0.18, 0.13, 0.054, 0.062], [0.186, 0.16, 0.032, 0.038]], 2.2, 24), fur, 0.0026));
    var bel = M(blob(0.05, 0.03, 0.13, 14), cream, false); bel.position.set(0, 0.128, 0.0); body.add(bel);
    for (var i = 0; i < 6; i++) { var rw = (i === 0 || i === 5) ? 0.058 : 0.067, sg = new THREE.TorusGeometry(rw, 0.0065, 6, 22, Math.PI * 0.8); sg.rotateZ(Math.PI * 0.1); sg.scale(1, 1.06, 1); var sm = M(sg, str, false); sm.position.set(0, 0.176, -0.13 + i * 0.05); body.add(sm); }
    var LG = function (x, z, front) { var s = { x: x, y: front ? 0.16 : 0.172, z: z, L1: front ? 0.084 : 0.09, L2: front ? 0.08 : 0.09, front: front, mp: cream, paw: [0.016, 0.012, 0.02], rz: front ? z + 0.008 : z - 0.025, mu: fur, ml: fur };
      s.r = front ? [0.022, 0.018, 0.015, 0.013] : [0.026, 0.021, 0.016, 0.013]; if (!front) s.thigh = [0.034, 0.05, 0.044]; D.legs.push(leg(D, s)); };
    LG(0.038, 0.1, true); LG(-0.038, 0.1, true); LG(0.042, -0.12, false); LG(-0.042, -0.12, false);
    var neck = new THREE.Group(); neck.position.set(0, 0.208, 0.13); body.add(neck); D.neck = neck; neck.add(M(tube([V(0, -0.03, -0.02), V(0, 0.02, 0.015), V(0, 0.05, 0.035)], 0.042, 0.034), fur, 0.0024));
    var head = new THREE.Group(); head.position.set(0, 0.062, 0.05); neck.add(head); D.head = head; head.scale.setScalar(1.14);
    head.add(M(blob(0.05, 0.044, 0.046, 22), fur, 0.0026)); [1, -1].forEach(function (s) { var ck = M(blob(0.026, 0.022, 0.024, 12), fur, false); ck.position.set(s * 0.03, -0.016, 0.018); head.add(ck); });
    var mzG = new THREE.Group(); mzG.position.set(0, -0.016, 0.038); head.add(mzG); [1, -1].forEach(function (s) { var wp = M(blob(0.014, 0.011, 0.012, 10), cream, false); wp.position.set(s * 0.011, -0.002, 0.004); mzG.add(wp); });
    var jaw = new THREE.Group(); jaw.position.set(0, -0.01, 0.0); mzG.add(jaw); var jw = M(blob(0.012, 0.006, 0.01, 8), cream, false); jw.position.z = 0.002; jaw.add(jw); D.jaw = jaw;
    var ns = M(blob(0.006, 0.004, 0.004, 8), nose, false); ns.position.set(0, 0.008, 0.014); mzG.add(ns);
    for (var k2 = 0; k2 < 3; k2++) { var bs = M(blob(0.004, 0.012, 0.003, 6), str, false); bs.position.set((k2 - 1) * 0.012, 0.03, 0.04); bs.rotation.z = (k2 - 1) * -0.3; head.add(bs); }
    [1, -1].forEach(function (s) { var e = eyeBall(0.0118, o.eye || 0xb8a022); e.children[1].scale.set(0.32, 1.2, 0.5); e.position.set(s * 0.021, 0.006, 0.039); e.rotation.y = s * 0.3; head.add(e); });
    D.ears = []; [1, -1].forEach(function (s) { var ear = new THREE.Group(); ear.position.set(s * 0.03, 0.03, -0.004); ear.rotation.set(-0.05, 0, -s * 0.38); head.add(ear);
      var eg = new THREE.ConeGeometry(0.022, 0.04, 4); eg.rotateY(Math.PI / 4); eg.translate(0, 0.02, 0); eg.scale(1, 1, 0.45); ear.add(M(eg, fur, 0.002)); var ig = new THREE.ConeGeometry(0.013, 0.028, 4); ig.rotateY(Math.PI / 4); ig.translate(0, 0.015, 0); ig.scale(1, 1, 0.3); var im = M(ig, inner, false); im.position.z = 0.005; ear.add(im); D.ears.push(ear); });
    var tail = new THREE.Group(); tail.position.set(0, 0.2, -0.165); body.add(tail); D.tail = tail;
    tail.add(M(tube([V(0, 0, 0), V(0, 0.03, -0.07), V(0, 0.1, -0.12), V(0, 0.17, -0.12), V(0, 0.21, -0.08)], function (t) { return 0.014 - 0.002 * t; }, 0, { seg: 18 }), fur, 0.0022));
    [0.25, 0.45, 0.65, 0.85].forEach(function (u) { var r2 = M(new THREE.TorusGeometry(0.0145, 0.0035, 6, 14), str, false); var cv = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 0.03, -0.07), V(0, 0.1, -0.12), V(0, 0.17, -0.12), V(0, 0.21, -0.08)], false, 'catmullrom', 0.5), pt = cv.getPoint(u), tn = cv.getTangent(u); r2.position.copy(pt); r2.quaternion.setFromUnitVectors(V(0, 0, 1), tn); tail.add(r2); });
    D.hipY = 0.172; D.hipZ = -0.12; D.legLen = 0.18; D.fmax = 4.6; D.h = 0.3; D.len = 0.38; return D; }


  /* ---------- (V63) the German shepherd (Deutscher Schäferhund): Mira's companion — the long, sloping topline from the withers to the croup,
     the deep chest, the angulated hindquarters, the black saddle over rich tan, the black mask and muzzle, the large erect ears, the
     bushy tail hanging low in a slight curve; a brown leather collar. Standing about 0.53 at the withers to Mira's 1.32 ---------- */

  /* (V65) a smooth trunk from key sections (z, top, bottom, half-width) interpolated with Catmull-Rom, rings of a softened superellipse
     with a narrower keel under the chest; vertex colours from the coat function; one closed mesh with shared vertices (smooth normals) */
  function cr(a, b, c, d, t) { var t2 = t * t, t3 = t2 * t; return 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3); }
  function gsdTrunk(TAN, TANL, BLK) { var K = [[-0.348, 0.404, 0.388, 0.015], [-0.335, 0.43, 0.358, 0.043], [-0.305, 0.455, 0.34, 0.067], [-0.262, 0.471, 0.337, 0.079], [-0.21, 0.479, 0.35, 0.08], [-0.15, 0.484, 0.372, 0.074], [-0.08, 0.49, 0.356, 0.08], [0.0, 0.497, 0.316, 0.093], [0.08, 0.507, 0.286, 0.097], [0.15, 0.52, 0.276, 0.092], [0.2, 0.525, 0.288, 0.08], [0.24, 0.512, 0.322, 0.064], [0.27, 0.484, 0.366, 0.043], [0.287, 0.454, 0.406, 0.017]];
    var NZ = 110, NA = 64, pos = [], col = [], idx = [], i, j, c = new THREE.Color();
    function at(u) { var f = u * (K.length - 1), k = Math.min(K.length - 2, Math.floor(f)), t = f - k, A = K[Math.max(0, k - 1)], B = K[k], C = K[k + 1], D2 = K[Math.min(K.length - 1, k + 2)]; return [cr(A[0], B[0], C[0], D2[0], t), cr(A[1], B[1], C[1], D2[1], t), cr(A[2], B[2], C[2], D2[2], t), Math.max(0.004, cr(A[3], B[3], C[3], D2[3], t))]; }
    function coat(z, sv, sa) { /* sv: 0 at the belly, 1 on the back; the saddle from behind the withers to the croup */ var edge = 0.56 + 0.025 * Math.sin(z * 9 + 1) + (z > 0.1 ? Math.pow((z - 0.1) / 0.11, 2) * 0.45 : 0) + (z < -0.2 ? Math.pow((-0.2 - z) / 0.09, 2) * 0.35 : 0);
      var zin = Math.min(1, Math.max(0, (z + 0.3) / 0.03), Math.max(0, (0.215 - z) / 0.03)); if (sv > edge - 0.07 && zin > 0) { var w = Math.min(1, (sv - edge + 0.07) / 0.14), w2 = w * w * (3 - 2 * w) * zin; c.copy(TAN).lerp(BLK, w2); return c; } c.copy(TAN); if (sv < 0.22) c.lerp(TANL, 0.55 * (1 - sv / 0.22)); return c; }
    for (i = 0; i <= NZ; i++) { var S = at(i / NZ), z = S[0], mid = (S[1] + S[2]) / 2, hh = (S[1] - S[2]) / 2, keel = Math.max(0, Math.min(1, (z + 0.06) / 0.12)) * Math.max(0, Math.min(1, (0.27 - z) / 0.06));
      for (j = 0; j < NA; j++) { var a = j / NA * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), ex = sa > 0 ? 0.86 : 1.0, x = se(ca, ex) * S[3] * (1 - (sa < 0 ? keel * 0.32 * Math.pow(-sa, 1.5) : 0)), y = mid + se(sa, sa > 0 ? 0.9 : 1.0) * hh;
        pos.push(x, y, z); coat(z, (y - S[2]) / Math.max(1e-4, S[1] - S[2]), sa); col.push(c.r, c.g, c.b); } }
    for (i = 0; i < NZ; i++) for (j = 0; j < NA; j++) { var a0 = i * NA + j, b0 = i * NA + (j + 1) % NA, c0 = (i + 1) * NA + j, d0 = (i + 1) * NA + (j + 1) % NA; idx.push(a0, b0, c0, b0, d0, c0); }
    [0, NZ].forEach(function (r, e2) { var S = at(r / NZ), ci = pos.length / 3; pos.push(0, (S[1] + S[2]) / 2, S[0] + (e2 ? 0.006 : -0.006)); coat(S[0], 0.5, 0); col.push(c.r, c.g, c.b); for (j = 0; j < NA; j++) { var p0 = r * NA + j, p1 = r * NA + (j + 1) % NA; if (e2) idx.push(ci, p0, p1); else idx.push(ci, p1, p0); } });
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  function shepherd(o) { o = o || {}; var root = new THREE.Group(), body = new THREE.Group(); root.add(body); var D = { root: root, body: body, kind: 'shepherd', legs: [] };
    function TL(h, o2) { return T(new THREE.Color(h).convertSRGBToLinear(), o2); } /* (an sRGB palette: plain colours are taken as linear) */
    var tan = TL(o.tan || 0xbb8648), tanL = TL(0xd8b07a), blk = TL(o.black || 0x1b1817), blkS = TL(0x2a2320), nose = TL(0x101010, { rim: false }), tongue = TL(0xd0606e), inner = TL(0x8a5444), leather = TL(0x5e381c), ring = TL(0xc9ccce);
    /* the trunk (tan), the saddle laid over it (black): the same sections a little larger and higher, so the black covers the back and
       the upper flanks and the tan shows below */
    /* (V65) the trunk as one smooth anatomical body: the sloping topline (withers high, back level, croup rounding down to the tail),
       the deep chest down to the elbows with a narrow keel, the tuck-up at the loin; the coat painted on it (the black saddle over the
       back and upper flanks, rich tan below, lighter under the belly) — no layered boxes, no seams */
    body.add(M(gsdTrunk(new THREE.Color(o.tan || 0xbb8648).convertSRGBToLinear(), new THREE.Color(0xd8b07a).convertSRGBToLinear(), new THREE.Color(o.black || 0x1b1817).convertSRGBToLinear()), T(0xffffff, { vc: true }), 0.004));
    /* the hind thighs: dark at the top, tan below; the breeches of tan fur behind */
    var LG = function (x, z, front) { var s = { x: x, y: front ? 0.352 : 0.37, z: z, L1: front ? 0.172 : 0.183, L2: front ? 0.162 : 0.188, front: front, mp: tanL, paw: [0.027, 0.021, 0.036], rz: front ? z + 0.014 : z - 0.045, mu: tan, ml: tanL };
      s.r = front ? [0.038, 0.03, 0.025, 0.02] : [0.044, 0.034, 0.026, 0.02]; if (!front) { s.thigh = [0.05, 0.088, 0.066]; s.feather = tan; } D.legs.push(leg(D, s)); };
    LG(0.062, 0.15, true); LG(-0.062, 0.15, true); LG(0.066, -0.215, false); LG(-0.066, -0.215, false);
    /* the neck: tan below, the black mane on top; the leather collar with its ring */
    var neck = new THREE.Group(); neck.position.set(0, 0.45, 0.2); body.add(neck); D.neck = neck;
    neck.add(M(tube([V(0, -0.05, -0.04), V(0, 0.03, 0.02), V(0, 0.1, 0.065)], 0.075, 0.056), tan, 0.0038));
    var mane = M(tube([V(0, -0.02, -0.06), V(0, 0.05, -0.012), V(0, 0.115, 0.04)], 0.06, 0.045, { flat: 0.8, up: V(1, 0, 0) }), blkS, false); mane.position.set(0, 0.016, -0.004); neck.add(mane);
    var col = M(new THREE.TorusGeometry(0.078, 0.0095, 10, 36), leather, 0.0024); col.position.set(0, 0.02, 0.02); col.rotation.x = Math.PI / 2 - 0.75; col.scale.set(1.0, 1.06, 0.92); neck.add(col);
    var rg = M(new THREE.TorusGeometry(0.011, 0.0028, 8, 16), ring, 0.0016); rg.position.set(0, 0.058, 0.086); rg.rotation.y = Math.PI / 2; neck.add(rg);
    /* the head: a strong wedge — tan cheeks, the black over the skull and down the long muzzle, dark almond eyes, the big erect ears */
    var head = new THREE.Group(); head.position.set(0, 0.112, 0.082); head.scale.setScalar(1.1); neck.add(head); D.head = head;
    head.add(M(blob(0.068, 0.062, 0.074, 26), tan, 0.0036)); var chk = M(blob(0.062, 0.042, 0.054, 18), tan, 0.003); chk.position.set(0, -0.024, 0.022); head.add(chk);
    var cap2 = M(blob(0.058, 0.03, 0.066, 18), blk, 0.0028); cap2.position.set(0, 0.04, -0.004); head.add(cap2);
    var mask = M(blob(0.041, 0.031, 0.046, 18), blk, false); mask.position.set(0, -0.006, 0.036); head.add(mask);
    var mzG = new THREE.Group(); mzG.position.set(0, -0.022, 0.045); head.add(mzG);
    /* the muzzle: a long tapered wedge — deep at the stop, narrowing and flattening to the nose pad */
    var mzg = new THREE.SphereGeometry(1, 28, 20), mp = mzg.attributes.position; for (var qi = 0; qi < mp.count; qi++) { var x0 = mp.getX(qi), y0 = mp.getY(qi), z0 = mp.getZ(qi), f0 = (z0 + 1) / 2, wk = 1 - 0.5 * Math.pow(f0, 1.4), hk = 1 - 0.38 * Math.pow(f0, 1.6); mp.setXYZ(qi, x0 * 0.032 * wk, y0 * 0.03 * hk + (y0 > 0 ? 0.0 : 0.004 * f0), z0 * 0.064 + 0.056); } mzg.computeVertexNormals();
    var mz = M(mzg, blk, 0.003); mzG.add(mz);
    var br = M(tube([V(0, 0.03, 0.0), V(0, 0.028, 0.04), V(0, 0.018, 0.085)], 0.022, 0.012, { flat: 0.55, up: V(0, 1, 0) }), blk, false); mzG.add(br);
    var jaw = new THREE.Group(); jaw.position.set(0, -0.016, 0.0); mzG.add(jaw); var jw = M(LUNA.lathe([[0.001, 0.0], [0.026, 0.0], [0.022, 0.05], [0.013, 0.086], [0.001, 0.09]], 16), blk, 0.0026); jw.rotation.x = Math.PI / 2; jw.scale.set(1, 1, 0.5); jaw.add(jw); D.jaw = jaw;
    var tg = M(blob(0.017, 0.0045, 0.036, 12), tongue, 0.0018); tg.position.set(0, -0.004, 0.062); tg.rotation.x = 0.35; jaw.add(tg); D.tongue = tg;
    var ng = new THREE.SphereGeometry(1, 20, 14), np = ng.attributes.position; for (var qn = 0; qn < np.count; qn++) { var nx0 = np.getX(qn), ny0 = np.getY(qn), nz0 = np.getZ(qn); np.setXYZ(qn, nx0 * 0.0175 * (1 - 0.18 * Math.max(0, -ny0)), ny0 * 0.0115 + (ny0 < -0.3 && Math.abs(nx0) < 0.25 ? -0.003 : 0), nz0 * 0.012); } ng.computeVertexNormals(); var ns = M(ng, TL(0x161414, { rim: 0.6 }), 0.0018); ns.position.set(0, 0.017, 0.113); ns.rotation.x = -0.25; mzG.add(ns);
    [1, -1].forEach(function (s) { var e = eyeBall(0.0118, o.eye || 0x3a2210); e.position.set(s * 0.033, 0.018, 0.06); e.rotation.y = s * 0.42; e.scale.set(1.15, 0.85, 1); head.add(e); var bw = M(blob(0.01, 0.0055, 0.007, 8), tanL, false); bw.position.set(s * 0.032, 0.036, 0.056); head.add(bw); });
    D.ears = []; [1, -1].forEach(function (s) { var ear = new THREE.Group(); ear.position.set(s * 0.04, 0.054, -0.016); ear.rotation.set(-0.08, 0, -s * 0.2); head.add(ear);
      var eg = new THREE.ConeGeometry(0.036, 0.1, 16); eg.translate(0, 0.05, 0); eg.scale(1, 1, 0.42); ear.add(M(eg, blkS, 0.0026)); var ig = new THREE.ConeGeometry(0.024, 0.07, 12); ig.translate(0, 0.038, 0); ig.scale(1, 1, 0.3); var im = M(ig, inner, false); im.position.z = 0.0075; ear.add(im); D.ears.push(ear); });
    /* the tail: low set, long and bushy, hanging in a slight sabre curve; black above, tan below */
    var tail = new THREE.Group(); tail.position.set(0, 0.405, -0.3); body.add(tail); D.tail = tail;
    tail.add(M(tube([V(0, 0, 0), V(0, -0.08, -0.06), V(0, -0.18, -0.082), V(0, -0.26, -0.066), V(0, -0.305, -0.03), V(0, -0.315, 0.0)], function (t) { return 0.02 + 0.024 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.62); }, 0, { flat: 0.78, seg: 20 }), blkS, 0.003));
    var tu = M(tube([V(0, -0.03, 0.012), V(0, -0.12, -0.04), V(0, -0.22, -0.05), V(0, -0.29, -0.02)], function (t) { return 0.016 + 0.014 * Math.sin(t * Math.PI); }, 0, { flat: 0.7, seg: 14 }), tan, false); tu.position.set(0, 0, 0.012); tail.add(tu);
    D.hipY = 0.37; D.hipZ = -0.215; D.legLen = 0.37; D.fmax = 3.4; D.h = 0.62; D.len = 0.66; D.tailLen = 0.315; return D; }
  /* ---------- baking: the static meshes under each joint merged into one vertex-coloured toon mesh (+ one outline hull) and one
     unlit mesh for the catch-lights, so a dog costs a few dozen draw calls instead of a couple of hundred ---------- */
  function bake(D) { var J = [D.body, D.neck, D.head, D.tail]; D.legs.forEach(function (L) { J.push(L.piv, L.kn, L.paw); }); if (D.jaw) J.push(D.jaw); if (D.coat) J.push(D.coat); if (D.tongue) J.push(D.tongue); (D.ears || []).forEach(function (e) { J.push(e); if (e.userData.tip) J.push(e.userData.tip); });
    J.forEach(function (j) { j.userData.joint = true; }); D.root.updateMatrixWorld(true); var inv = new THREE.Matrix4();
    J.forEach(function (G) { if (G === D.coat || G === D.tongue) return; inv.copy(G.matrixWorld).invert(); var inked = [], plain = [], basic = [], kill = [], wsum = 0, wn = 0;
      (function walk(o) { o.children.slice().forEach(function (c) { if (c.userData.joint) return; if (c.isMesh) { var m = new THREE.Matrix4().multiplyMatrices(inv, c.matrixWorld);
          if (c.userData.ink) { wsum += c.material.userData.w || 0.003; wn++; } else if (c.material.isMeshBasicMaterial) basic.push([c.geometry, m, c.material.color.getHex()]);
          else { var hasInk = c.parent && c.parent.children.some(function (x) { return x.userData.ink; }); (hasInk ? inked : plain).push([c.geometry, m, c.material.color.getHex(), !!c.material.vertexColors]); }
          kill.push(c); } walk(c); }); })(G);
      if (!kill.length) return; kill.forEach(function (c) { c.parent.remove(c); });
      if (inked.length) G.add(LUNA.mesh(LUNA.merge(inked), T(0xffffff, { vc: true }), { ink: wn ? Math.round(wsum / wn * 10000) / 10000 : 0.003 }));
      if (plain.length) G.add(LUNA.mesh(LUNA.merge(plain), T(0xffffff, { vc: true }), { ink: false }));
      if (basic.length) G.add(new THREE.Mesh(LUNA.merge(basic), new THREE.MeshBasicMaterial({ vertexColors: true }))); }); }

  function build(kind, o) { var D = kind === 'collie' ? collie(o) : kind === 'tugou' ? tugou(o) : kind === 'shepherd' ? shepherd(o) : kind === 'cat' ? cat(o) : maltese(o); D.t = Math.random() * 10; D.ph = Math.random(); D.mode = 'stand'; D.modeT = 0; D.spd = 0; D.gait = 'walk'; D.mw = 0; D.p = 0; D.hy = D.hipY; D.pz = 0; D.br = 0; D.hx = 0; D.hyaw = 0; D.tailUp = 0; D.wagA = 0.2; D.wagF = 5;
    bake(D); D.root.traverse(function (x) { if (x.isMesh && !x.userData.ink) x.castShadow = true; if (x.material && typeof KIT !== 'undefined') [].concat(x.material).forEach(KIT.curved); }); update(D, 0.016, {}); return D; }

  /* ---------- motion ---------- */
  var GAIT = { walk: { off: [0.25, 0.75, 0, 0.5], duty: 0.62, kS: 0.75, lift: 0.16 }, trot: { off: [0, 0.5, 0.5, 0], duty: 0.46, kS: 1.0, lift: 0.2 }, gallop: { off: [0.5, 0.42, 0, 0.1], duty: 0.32, kS: 1.45, lift: 0.26 } }; /* LF RF LH RH */
  function pose(D, m, t) { var H = D.hipY, ll = D.legLen, P = { p: 0, hy: H, pz: 0, br: 0, tg: null, hx: 0, hyaw: 0, tailUp: 0, wagA: 0.2, wagF: 5, ears: 0 };
    if (m === 'sit' || m === 'ride') { P.p = -0.6; P.hy = H * 0.4; P.pz = 0.02 * ll / 0.32; P.tg = [['u', 0.01], ['u', 0.01], ['u', 0.36 * ll], ['u', 0.36 * ll]]; P.hx = 0.45; P.wagA = 0.12; P.wagF = 4; if (D.kind === 'maltese') { P.p = -0.32; P.hy = H * 0.55; P.hx = 0.25; } }
    if (m === 'lie') { P.p = 0.0; P.hy = H * 0.38; P.tg = [['u', 0.6 * ll], ['u', 0.6 * ll], ['u', 0.2 * ll], ['u', 0.2 * ll]]; P.hx = 0.1 + Math.sin(t * 0.4) * 0.06; P.wagA = 0.05; P.wagF = 2; if (D.kind === 'maltese') P.hy = H * 0.55; }
    if (m === 'sniff') { P.hx = -0.9; P.hyaw = Math.sin(t * 1.7) * 0.35; P.wagA = 0.18; P.wagF = 5; P.tailUp = 0.15; }
    if (m === 'bow') { P.p = 0.42; P.hy = H * 0.97 + Math.max(0, Math.sin(t * 9)) * H * 0.04; P.tg = [['u', 0.55 * ll], ['u', 0.55 * ll], ['u', -0.04 * ll], ['u', -0.04 * ll]]; P.hx = -0.9; P.tailUp = 0.75; P.wagA = 0.6; P.wagF = 13; P.ears = 1; }
    if (m === 'rear') { var w = Math.sin(t * 11); P.p = -1.0; P.hy = H * 0.98 + Math.max(0, Math.sin(t * 5.5)) * H * 0.06; P.tg = [['r', 0.33 * ll + w * 0.06 * ll, -0.48 * ll + w * 0.08 * ll], ['r', 0.33 * ll - w * 0.06 * ll, -0.48 * ll - w * 0.08 * ll], ['u', 0.2 * ll], ['u', 0.2 * ll]]; P.hx = 0.85; P.tailUp = 0.35; P.wagA = 0.5; P.wagF = 12; P.ears = 1; }
    if (m === 'spin') { P.br = 0.16; P.hyaw = -0.9; P.hx = -0.15; P.tailUp = 0.5; P.wagA = 0.5; P.wagF = 12; }
    if (m === 'groom') { P.p = -0.6; P.hy = H * 0.42; P.pz = 0.02 * ll / 0.32; P.tg = [['r', 0.18 * ll, -0.25 * ll + Math.max(0, Math.sin(t * 5)) * 0.1 * ll], ['u', 0.01], ['u', 0.36 * ll], ['u', 0.36 * ll]]; P.hx = 0.95 + Math.sin(t * 5) * 0.25; P.hyaw = 0.25; P.wagA = 0.06; P.wagF = 2; }
    if (m === 'loaf') { P.p = 0.0; P.hy = H * 0.42; P.tg = [['u', 0.18 * ll], ['u', 0.18 * ll], ['u', 0.12 * ll], ['u', 0.12 * ll]]; P.hx = 0.25 + Math.sin(t * 0.3) * 0.05; P.wagA = 0.03; P.wagF = 1.2; }
    if (m === 'scratch') { P.p = -0.55; P.hy = H * 0.45; P.tg = [['u', 0.01], ['u', 0.01], ['r', 0.42 * ll, -0.05 * ll + Math.sin(t * 22) * 0.06 * ll], ['u', 0.36 * ll]]; P.hx = 0.3; P.hyaw = 0.55; P.wagA = 0.08; P.wagF = 3; }
    return P; }
  function update(D, dt, o) { o = o || {}; D.t += dt; D.modeT += dt; var t = D.t, m = D.mode, sp = Math.max(0, D.spd), k = 1 - Math.exp(-dt * 9), i, ll = D.legLen;
    if (m === 'spin') { D.root.rotation.y += dt * (D.spinDir || 1) * 7.5; sp = Math.max(sp, ll * 4.5); }
    var moving = sp > 0.02 && (m === 'stand' || m === 'move' || m === 'spin' || m === 'sniff');
    /* the gait by the speed relative to the leg (with hysteresis), its stride and frequency */
    var r = sp / ll, g0 = D.gait; if (g0 === 'walk' && r > 3.4) D.gait = 'trot'; else if (g0 === 'trot' && r < 2.9) D.gait = 'walk'; else if (g0 === 'trot' && r > 7.8) D.gait = 'gallop'; else if (g0 === 'gallop' && r < 6.8) D.gait = 'trot';
    var G = GAIT[D.gait], S = ll * G.kS * clamp(r / 3, 0.3, 1), f = moving ? clamp(sp * G.duty / S, 0.9, D.fmax) : 0; if (moving) S = sp * G.duty / f; D._f = f; D.ph = (D.ph + dt * f) % 1;
    D.mw = lerp(D.mw, moving ? 1 : 0, 1 - Math.exp(-dt * 8));
    var P = pose(D, moving ? (m === 'sniff' ? 'sniff' : 'stand') : m, t);
    /* the body: bob and pitch of the gait on top of the pose */ var gb = 0, gp = 0, ph2 = D.ph * Math.PI * 2;
    if (moving) { if (D.gait === 'walk') { gb = -Math.abs(Math.cos(ph2 * 2)) * ll * 0.025; gp = Math.sin(ph2 * 2) * 0.015; } else if (D.gait === 'trot') { gb = (Math.abs(Math.sin(ph2 * 2)) - 0.6) * ll * 0.07; } else { gb = (Math.sin(ph2 + 0.9) * 0.5 + 0.1) * ll * 0.16 - ll * 0.05; gp = Math.sin(ph2 + 0.3) * 0.13; P.hx = -0.25; P.ears = 1; P.tailUp = 0.25; } P.wagA = 0.4; P.wagF = 9; }
    if (o.excited) { P.wagA = Math.max(P.wagA, 0.55); P.wagF = Math.max(P.wagF, 12); P.tailUp = Math.max(P.tailUp, 0.35); }
    if (o.look != null && m !== 'spin') P.hyaw = clamp(o.look, -1.1, 1.1);
    if (o.wind) P.ears = Math.max(P.ears, o.wind);
    D.p = lerp(D.p, P.p, k); D.hy = lerp(D.hy, P.hy, k); D.pz = lerp(D.pz, P.pz, k); D.br = lerp(D.br, P.br, k);
    var p = D.p + gp * D.mw, hy = D.hy + gb * D.mw, cp = Math.cos(p), sp2 = Math.sin(p), Hy = D.hipY, Hz = D.hipZ;
    D.body.rotation.x = p; D.body.rotation.z = D.br; D.body.position.set(0, hy - (Hy * cp - Hz * sp2), Hz + D.pz - (Hy * sp2 + Hz * cp));
    var by = D.body.position.y, bz = D.body.position.z;
    /* the paws: the pose's targets, blended with the gait's planted steps */
    D.legs.forEach(function (L, j) { var Py = by + L.y * cp - L.z * sp2, Pz = bz + L.y * sp2 + L.z * cp, ty = L.ah, tz = L.rz, s = P.tg && P.tg[j];
      if (s) { if (s[0] === 'u') { tz = Pz + s[1]; ty = L.ah; } else { tz = Pz + s[1]; ty = Py + s[2]; } }
      if (D.mw > 0.001) { var q = (D.ph + G.off[j]) % 1, gz, gy; if (q < G.duty) { gz = S * (0.5 - q / G.duty); gy = 0; } else { var u = (q - G.duty) / (1 - G.duty); gz = S * (-0.5 + u * u * (3 - 2 * u)); gy = Math.sin(Math.PI * u) * Math.min(ll * G.lift * 1.6, ll * 0.05 + S * G.lift); }
        tz = lerp(tz, L.rz + gz, D.mw); ty = lerp(ty, L.ah + gy, D.mw); L.curl = D.mw * (q >= G.duty ? (L.front ? 1.1 : 0.5) * Math.sin(Math.PI * (q - G.duty) / (1 - G.duty)) : 0); } else L.curl = 0;
      var kk = D.mw > 0.5 ? 1 : 1 - Math.exp(-dt * 14); L.ty = lerp(L.ty, ty, kk); L.tz = lerp(L.tz, tz, kk); solve(L, Py, Pz, L.ty, L.tz, p); });
    /* the head and neck: the counter-pitch keeps the gaze level, plus the pose and a little life */
    D.hx = lerp(D.hx, P.hx, k); D.hyaw = lerp(D.hyaw, P.hyaw, k * 0.8); var idle = moving ? 0 : 1;
    D.neck.rotation.x = -p * 0.55 + D.hx * 0.5; D.head.rotation.x = -p * 0.35 + D.hx * 0.5 + Math.sin(t * 1.3) * 0.03 * idle; D.head.rotation.y = D.hyaw + Math.sin(t * 0.6) * 0.18 * idle; D.head.rotation.z = Math.sin(t * 0.9) * 0.1 * idle;
    D.tailUp = lerp(D.tailUp, P.tailUp, k); D.wagA = lerp(D.wagA, P.wagA, k); D.wagF = lerp(D.wagF, P.wagF, k); D.wph = (D.wph || 0) + dt * D.wagF;
    D.tail.rotation.y = Math.sin(D.wph) * D.wagA; D.tail.rotation.z = Math.sin(D.wph) * D.wagA * 0.3;
    if (D.kind === 'collie' || D.kind === 'shepherd') { /* the world angle of the tail (0 hangs, pi/2 streams back, more is raised), kept off the ground */ var tw = (D.kind === 'shepherd' ? 0.18 + D.tailUp * 1.5 : 0.3 + D.tailUp * 1.9), ty0 = D.body.position.y + D.tail.position.y * cp - D.tail.position.z * sp2, cmax = (ty0 - 0.03) / (D.tailLen || 0.235); if (cmax < 1) tw = Math.max(tw, Math.acos(clamp(cmax, -1, 1))); D.tail.rotation.x = tw - p; } else D.tail.rotation.x = -D.tailUp * 0.3 - p * 0.6;
    if (D.ears) D.ears.forEach(function (e, j) { var s = j ? -1 : 1, fl = Math.sin(t * (moving ? f * 6.283 : 1.1) + j) * (moving ? 0.12 : 0.03); if (D.kind === 'maltese') { e.rotation.x = -P.ears * 0.5 + fl + (moving ? -0.15 : 0); e.rotation.z = s * (0.05 + P.ears * 0.25); } else if (D.kind === 'tugou' || D.kind === 'cat' || D.kind === 'shepherd') { e.rotation.x = (D.kind === 'shepherd' ? -0.06 - P.ears * 0.45 : -0.1 - P.ears * 0.3) + fl * 0.5; } else { e.rotation.x = -0.1 - P.ears * 0.55 + fl; if (e.userData.tip) e.userData.tip.rotation.x = 1.15 - P.ears * 0.5 + fl * 2; } });
    if (D.coat) { var sw = moving ? Math.sin(D.ph * Math.PI * 4) * 0.02 * Math.min(1, sp / 0.6) : 0; D.coat.scale.set(1 + sw, 1 - Math.abs(sw) * 0.4, 1 - sw * 0.4); D.coat.rotation.x = moving ? -0.03 * D.mw : 0; }
    var pant = moving || m === 'bow' || m === 'rear' || m === 'spin' || o.excited; if (D.tongue) D.tongue.visible = !!pant; if (D.jaw) D.jaw.rotation.x = pant ? 0.22 + Math.sin(t * 14) * 0.05 : 0.0; }
  function setMode(D, m) { if (D.mode === m) return; D.mode = m; D.modeT = 0; if (m === 'spin') D.spinDir = Math.random() < 0.5 ? -1 : 1; }
  return { build: build, update: update, setMode: setMode };
})();


