# writes src/koeln/lib/DOG.js from the reference, adding the German shepherd (Mira's companion, V63)
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
if not REF.is_dir():
    raise SystemExit(__file__ + ': needs the reference engine (game/ref/), which is not in the repository — see README.')
SRC = str(REF / 'mods' / 'DOG.js'); DST = str(SRC / 'lib' / 'DOG.js')
s = open(SRC).read()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('DOG patch: %d found for %r' % (c, old[:90]))
    s = s.replace(old, new)
SHEP = r'''
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
'''
rep("  /* ---------- baking:", SHEP + "  /* ---------- baking:")
rep("kind === 'tugou' ? tugou(o) :", "kind === 'tugou' ? tugou(o) : kind === 'shepherd' ? shepherd(o) :")
rep("if (D.kind === 'collie') { /* the world angle of the tail (0 hangs, pi/2 streams back, more is raised), kept off the ground */ var tw = 0.3 + D.tailUp * 1.9, ty0 = D.body.position.y + D.tail.position.y * cp - D.tail.position.z * sp2, cmax = (ty0 - 0.03) / 0.235;",
    "if (D.kind === 'collie' || D.kind === 'shepherd') { /* the world angle of the tail (0 hangs, pi/2 streams back, more is raised), kept off the ground */ var tw = (D.kind === 'shepherd' ? 0.18 + D.tailUp * 1.5 : 0.3 + D.tailUp * 1.9), ty0 = D.body.position.y + D.tail.position.y * cp - D.tail.position.z * sp2, cmax = (ty0 - 0.03) / (D.tailLen || 0.235);")
rep("} else if (D.kind === 'tugou' || D.kind === 'cat') { e.rotation.x = -0.1 - P.ears * 0.3 + fl * 0.5; }", "} else if (D.kind === 'tugou' || D.kind === 'cat' || D.kind === 'shepherd') { e.rotation.x = (D.kind === 'shepherd' ? -0.06 - P.ears * 0.45 : -0.1 - P.ears * 0.3) + fl * 0.5; }")
open(DST, 'w').write(s); print('DOG.js', len(s))

# ===== (V65) smoother limbs and joints for every dog; the bake keeps a part's own vertex colours (the shepherd's coat) =====
s = open(DST).read()
def rep5(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('DOG patch 5: %d found for %r' % (c, old[:90]))
    s = s.replace(old, new)
rep5("return LUNA.taper(cv, o.seg || 14, o.rad || 10,", "return LUNA.taper(cv, o.seg || 22, o.rad || 18,")
rep5("function blob(rx, ry, rz, s) { return LUNA.blob(rx, ry, rz, s || 20); }", "function blob(rx, ry, rz, s) { return LUNA.blob(rx, ry, rz, Math.max(s || 24, 18)); }")
rep5("kn.add(M(blob(o.r[1] * 0.98, o.r[1] * 0.98, o.r[1] * 0.98, 10), o.mu || o.ml, false));", "kn.add(M(blob(o.r[1] * 0.98, o.r[1] * 0.98, o.r[1] * 0.98, 18), o.mu || o.ml, false));")
rep5("(hasInk ? inked : plain).push([c.geometry, m, c.material.color.getHex()]);", "(hasInk ? inked : plain).push([c.geometry, m, c.material.color.getHex(), !!c.material.vertexColors]);")
open(DST, 'w').write(s); print('DOG.js V65', len(s))
rep5("    if (o.mu) { var up = M(tube([V(0, 0.015, 0), V(0, -o.L1 * 0.5, o.front ? -0.004 : 0.008), V(0, -o.L1, 0)], o.r[0], o.r[1]), o.mu, 0.0032); piv.add(up); }",
     "    if (o.mu) { var up = M(tube([V(0, 0.045, 0), V(0, -o.L1 * 0.45, o.front ? -0.004 : 0.008), V(0, -o.L1 - o.r[1] * 0.55, 0)], rnd(o.r[0], o.r[1], 0.1, 0.14)), o.mu, 0.0032); piv.add(up); }")
rep5("    if (o.thigh) { var th = M(blob(o.thigh[0], o.thigh[1], o.thigh[2], 16), o.mu, 0.0035); th.position.set(0, -o.thigh[1] * 0.55, 0.008); th.rotation.x = -0.25; piv.add(th); }",
     "    if (o.thigh) { var th = M(tube([V(0, 0.05, -0.006), V(0, -0.02, 0.016), V(0, -o.thigh[1] * 0.95, 0.02), V(0, -o.thigh[1] * 1.6, 0.004)], function (t) { var e0 = Math.sin(Math.min(1, t / 0.16) * Math.PI * 0.5), e1 = Math.sin(Math.min(1, (1 - t) / 0.2) * Math.PI * 0.5); return (o.thigh[2] * (1 - 0.55 * t) + 0.004) * Math.sqrt(e0) * Math.sqrt(e1) + 0.002; }, 0, { flat: o.thigh[0] / o.thigh[2], up: V(1, 0, 0), seg: 26 }), o.mu, 0.0035); piv.add(th); }")
rep5("    if (o.ml) { kn.add(M(tube([V(0, 0.008, 0), V(0, -o.L2 * 0.5, 0), V(0, -o.L2, 0)], o.r[2], o.r[3]), o.ml, 0.003));",
     "    if (o.ml) { kn.add(M(tube([V(0, o.r[2] * 0.6, 0), V(0, -o.L2 * 0.5, 0), V(0, -o.L2 - 0.004, 0)], rnd(o.r[2], o.r[3], 0.1, 0.06)), o.ml, 0.003));")
rep5("  function tube(pts, r0, r1, o) {", "  /* a limb's radius: tapering from r0 to r1, with rounded ends (a fraction a of the length at the start, b at the end) */\n  function rnd(r0, r1, a, b) { return function (t) { var e0 = Math.sin(Math.min(1, t / a) * Math.PI * 0.5), e1 = Math.sin(Math.min(1, (1 - t) / b) * Math.PI * 0.5); return (r0 + (r1 - r0) * t) * Math.sqrt(e0 * e1) + 0.0015; }; }\n  function tube(pts, r0, r1, o) {")
open(DST, 'w').write(s); print('DOG.js V65b', len(s))

# ===== (V87) at rest no part of the dog lies under the floor =====
# Sitting or lying, the hip is brought down to a fixed share of its standing height (0.4 for the sit); for the shepherd's deep trunk and
# full thighs that put the croup, the thighs and the hocks under the ground (the paws stayed on it: they are placed by the legs' solver).
# Now the pose is measured: once a rest pose has settled, the lowest point of the body and legs (the tail apart: it is kept off the
# ground by its own rule) is found in the dog's frame, and the hip is raised by what lies under the floor; measured a few times until it
# holds, then kept for that pose. Moving, the lift goes back to nothing.
s = open(DST).read()
def rep7(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('DOG V87 patch: %d found for %r' % (c, old[:90]))
    s = s.replace(old, new)
LIFT = r'''  /* (V87) the lowest point of the body and the legs over the ground, in the dog's own frame (the tail apart) */
  var _dm1 = new THREE.Matrix4(), _dm2 = new THREE.Matrix4();
  function lowest(D) { D.root.updateMatrixWorld(true); _dm1.copy(D.root.matrixWorld).invert(); var lo = 1e9;
    D.body.traverse(function (x) { if (!x.isMesh || !x.visible || !x.geometry || !x.geometry.attributes.position) return; for (var q = x; q && q !== D.body; q = q.parent) if (q === D.tail) return; _dm2.multiplyMatrices(_dm1, x.matrixWorld); var P = x.geometry.attributes.position, e = _dm2.elements, st = Math.max(1, Math.floor(P.count / 1500)), i; for (i = 0; i < P.count; i += st) { var y = e[1] * P.getX(i) + e[5] * P.getY(i) + e[9] * P.getZ(i) + e[13]; if (y < lo) lo = y; } }); return lo; }
  /* (V87) at rest the hip is raised by whatever of the dog lies under the floor (measured when the pose has settled; kept per pose) */
  function restLift(D, m, moving, dt) { var rest = !moving && (m === 'sit' || m === 'ride' || m === 'lie' || m === 'loaf' || m === 'groom' || m === 'scratch' || m === 'bow'), L = D.liftC || (D.liftC = {}), c = L[m], cur = D.lift || 0;
    if (!rest) D.liftT = 0; else { if (!c) c = L[m] = { v: 0, n: 0 }; if (c.n < 5 && D.modeT > 0.7 + c.n * 0.45 && Math.abs(cur - c.v) < 0.0015) { var lo = lowest(D); if (lo < -0.004) c.v = Math.min(D.hipY * 0.7, c.v - lo + 0.002); c.n++; } D.liftT = c.v; }
    D.lift = cur + (D.liftT - cur) * (1 - Math.exp(-dt * 10)); }
'''
# lying: the forepaws were set far ahead of the shoulders (0.6 of the leg), which the two-bone leg can only reach by driving the elbow 6 cm
# under the floor; a lying dog's elbows rest on the ground behind the shoulders with the forearms flat before them
# (measured over the five kinds: with the hip at 0.22 of its standing height, the forepaws just behind the shoulders and the hind paws
# 0.35 of the leg ahead of the hips, the chest and belly rest on the floor — 1 to 2 mm over it — and the measured lift is 1 to 7 cm)
rep7("if (m === 'lie') { P.p = 0.0; P.hy = H * 0.38; P.tg = [['u', 0.6 * ll], ['u', 0.6 * ll], ['u', 0.2 * ll], ['u', 0.2 * ll]];", "if (m === 'lie') { P.p = 0.0; P.hy = H * 0.22; P.tg = [['u', -0.05 * ll], ['u', -0.05 * ll], ['u', 0.35 * ll], ['u', 0.35 * ll]];")
# sitting: the hip was held at 0.4 of its standing height — the croup hung 8 cm over the floor (a squat, not a sit). A sitting dog's rump is
# on the ground with the chest upright over straight forelegs: the body pitched up further, the hip down to 0.2, the hind paws further
# under it (the Maltese keeps its own pose; riding on the scooter's pillion keeps the old one, which the seat was fitted to)
rep7("P.hx = 0.45; P.wagA = 0.12; P.wagF = 4; if (D.kind === 'maltese') { P.p = -0.32; P.hy = H * 0.55; P.hx = 0.25; } }", "P.hx = 0.45; P.wagA = 0.12; P.wagF = 4; if (D.kind === 'maltese') { P.p = -0.32; P.hy = H * 0.55; P.hx = 0.25; } else if (m === 'sit') { P.p = -0.85; P.hy = H * 0.2; P.tg[2][1] = P.tg[3][1] = 0.42 * ll; } }")
rep7("var p = D.p + gp * D.mw, hy = D.hy + gb * D.mw, cp = Math.cos(p)", "var p = D.p + gp * D.mw, hy = D.hy + gb * D.mw + (D.lift || 0), cp = Math.cos(p)")
rep7("    var pant = moving || m === 'bow'", "    restLift(D, m, moving, dt);\n    var pant = moving || m === 'bow'")
rep7("  function setMode(D, m) { if (D.mode === m) return;", LIFT + "  function setMode(D, m) { if (D.mode === m) return;")
rep7("  return { build: build, update: update, setMode: setMode };", "  return { build: build, update: update, setMode: setMode, lowest: lowest };")
open(DST, 'w').write(s); print('DOG.js V87', len(s))
