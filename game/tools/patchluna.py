# writes src/koeln/lib/LUNA.js from the reference, adding Mira: an original look on Luna's rig (opt.mira)
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
if not REF.is_dir():
    raise SystemExit(__file__ + ': needs the reference engine (game/ref/), which is not in the repository — see README.')
SRC = str(REF / 'mods' / 'LUNA.js'); DST = str(SRC / 'lib' / 'LUNA.js')
s = open(SRC).read()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
# the palette: dark-brown hair with a thread of SCHOMBURG red; graphite shirt and trousers; the white work jacket; a white helmet with a red band
rep("    luna: { skin: 0xf9d6c2,", "    mira: { skin: 0xfbe2d4, suit: 0x34373d, dark: 0x26282c, boot: 0x3a3d42, coat: 0xfbfaf6, helmet: 0xffffff, band: 0xe3000f, cup: 0x3a3d42, hair: 0xe8c066, hairHi: 0xfff0bf, streak: 0xc99a42, emblem: 0xe3000f },\n    luna: { skin: 0xf9d6c2,")
rep("    var P = Object.assign({}, PAL.luna, opt.pal || {}), root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.userData.kind = 'luna';",
    "    var MIRA = !!opt.mira, P = Object.assign({}, PAL.luna, MIRA ? PAL.mira : {}, opt.pal || {}), root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.userData.kind = 'luna'; root.userData.mira = MIRA;")
# the legs: plain graphite trousers into the boots
rep("var thighTex = ctex(TN, TN, function (g, w, h) { g.fillStyle = hex(P.boot); g.fillRect(0, 0, w, h);", "var thighTex = ctex(TN, TN, function (g, w, h) { g.fillStyle = hex(P.boot); g.fillRect(0, 0, w, h); if (MIRA) { g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = w / 90; g.beginPath(); g.moveTo(w * 0.5, 0); g.lineTo(w * 0.5, h); g.stroke(); return; }")
# the torso: no chevron for Mira (a graphite shirt under the jacket)
rep("      g.fillStyle = hex(P.dark); g.beginPath(); /* the chevron:", "      if (!MIRA) { g.fillStyle = hex(P.dark); g.beginPath(); } if (!MIRA) /* the chevron:")
rep("g.lineTo(cx - sp, y0 - rise + th); g.closePath(); g.fill();\n", "g.lineTo(cx - sp, y0 - rise + th); g.closePath(); if (!MIRA) g.fill();\n")
rep("      g.strokeStyle = 'rgba(255,255,255,.16)'; g.lineWidth = w / 180; g.beginPath(); g.moveTo(cx - sp, y0 - rise + th * 0.5);", "      if (!MIRA) g.strokeStyle = 'rgba(255,255,255,.16)'; else g.strokeStyle = 'rgba(0,0,0,0)'; g.lineWidth = w / 180; g.beginPath(); g.moveTo(cx - sp, y0 - rise + th * 0.5);")
# the jacket: the red chest band with a white piping, the pockets
rep("g.quadraticCurveTo(x + w * 0.012, h * 0.6, x - w * 0.008, h); g.stroke(); } });", "g.quadraticCurveTo(x + w * 0.012, h * 0.6, x - w * 0.008, h); g.stroke(); } if (MIRA) { g.fillStyle = '#e3000f'; g.fillRect(0, h * 0.16, w, h * 0.085); g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(0, h * 0.252, w, h * 0.012); g.fillStyle = 'rgba(60,60,70,.55)'; g.fillRect(0, h * 0.93, w, h * 0.07); } });")
# the hair: one ponytail, high at the back, instead of the twin tails
rep("    [1, -1].forEach(function (s) {\n      var piv = new THREE.Group(); piv.position.set(s * 0.1, 0.035, -0.062); head.add(piv);",
    "    (MIRA ? [1] : [1, -1]).forEach(function (s) {\n      var piv = new THREE.Group(); if (MIRA) { piv.position.set(0, 0.062, -0.098); piv.rotation.y = Math.PI / 2; piv.scale.setScalar(0.74); } else piv.position.set(s * 0.1, 0.035, -0.062); head.add(piv);")
# the helmet: no emblem for Mira
rep("helm.add(em);", "helm.add(em); if (MIRA) em.visible = false;")
open(DST, 'w').write(s); print('LUNA.js', len(s))

# the face: blue eyes, fair skin, light brows and a few freckles (a girl from the Rhineland)
s = open(DST).read()
def rep2(old, new):
    global s
    c = s.count(old)
    if c != 1: raise SystemExit('LUNA patch 2: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep2("var LFO = { skin: '#fad3bf', eyeX: 0.0445, eyeY: -0.027, ew: 0.0285, eh: 0.0345, lashW: 0.005, fn: LQ >= 3 ? 2048 : 1024 }; var fm = faceMat(faceTex('open', 'luna' + (LQ >= 3 ? 'U' : ''), LFO));",
     "var LFO = MIRA ? { skin: '#fde3d6', eyeX: 0.0445, eyeY: -0.027, ew: 0.0285, eh: 0.0345, lashW: 0.005, fn: LQ >= 3 ? 2048 : 1024, iris: ['#0b1c3c', '#1f539e', '#4a98de', '#b4e0ff'], lash: '#5a3a1e', brow: '#b8894a', freckles: true } : { skin: '#fad3bf', eyeX: 0.0445, eyeY: -0.027, ew: 0.0285, eh: 0.0345, lashW: 0.005, fn: LQ >= 3 ? 2048 : 1024 }, FK = (MIRA ? 'mira' : 'luna') + (LQ >= 3 ? 'U' : ''); var fm = faceMat(faceTex('open', FK, LFO));")
rep2("kind: 'luna', fk: 'luna' + (LQ >= 3 ? 'U' : ''), fo: LFO,", "kind: 'luna', fk: FK, fo: LFO,")
rep2("/* the cheeks */ [-1, 1].forEach(function (sd) { var bx = X(sd * (ex + 0.008)), by = Y(ey - 0.036),",
     "/* freckles over the nose and the cheeks */ if (o.freckles) { [-1, 1].forEach(function (sd) { [[0.004, -0.031], [0.011, -0.035], [0.018, -0.032], [0.008, -0.04], [0.015, -0.042], [0.022, -0.038], [0.026, -0.034]].forEach(function (q, i) { g.fillStyle = 'rgba(176,106,70,' + (0.38 + (i % 3) * 0.08) + ')'; g.beginPath(); g.arc(X(sd * (ex - 0.016 + q[0])), Y(ey + q[1] + 0.012), (0.0009 + (i % 2) * 0.0003) * S, 0, 7); g.fill(); }); }); }\n    /* the cheeks */ [-1, 1].forEach(function (sd) { var bx = X(sd * (ex + 0.008)), by = Y(ey - 0.036),")
open(DST, 'w').write(s); print('LUNA.js face', len(s))

# ===== (V63) Mira in an officer's field uniform: the palette, the breeches and riding boots, the tunic, the cap, the plaits, her bearing =====
import re as _re
s = open(DST).read()
_J = open(ROOT / 'game' / 'tools' / 'mira63.js', encoding='utf-8').read()
def sec(name):
    m = _re.search(r'//@@' + name + r'\n(.*?)//@@END', _J, _re.S)
    if not m: raise SystemExit('mira63: no section ' + name)
    return m.group(1)
def rep3(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch 3: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep3("    mira: { skin: 0xfbe2d4, suit: 0x34373d, dark: 0x26282c, boot: 0x3a3d42, coat: 0xfbfaf6, helmet: 0xffffff, band: 0xe3000f, cup: 0x3a3d42, hair: 0xe8c066, hairHi: 0xfff0bf, streak: 0xc99a42, emblem: 0xe3000f },",
     "    mira: { skin: 0xfbe2d4, suit: 0x666b5c, dark: 0x2b3a30, boot: 0x1c1c20, coat: 0x666b5c, helmet: 0x6a6f60, band: 0xd0101e, cup: 0x2b3a30, hair: 0xe8c066, hairHi: 0xfff0bf, streak: 0xc99a42, emblem: 0xe3000f, breech: 0x7a7d72, silver: 0xd2d5d8, pipe: 0xd0102a, leather: 0x5a3a26, button: 0xb5b8ad, visor: 0x151517 },")
rep3("  function buildLuna(opt) {", sec('HELPERS') + "  function buildLuna(opt) {")
rep3("boot: toon(P.boot),", "boot: toon(P.boot, MIRA ? { rim: 0.7 } : {}),")
rep3("hand: toon(0xffffff, { vc: true }), rim: toon(0x8a8482) };", "hand: toon(0xffffff, { vc: true }), rim: toon(0x8a8482) }; if (MIRA) ['coat', 'helmet', 'dark', 'boot', 'band', 'cup'].forEach(function (k) { M[k].color.convertSRGBToLinear(); });")
rep3("if (MIRA) { g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = w / 90; g.beginPath(); g.moveTo(w * 0.5, 0); g.lineTo(w * 0.5, h); g.stroke(); return; }",
     "if (MIRA) { g.fillStyle = hex(P.breech); g.fillRect(0, 0, w, h); var rn = 99; for (var q0 = 0; q0 < w * h / 80; q0++) { rn = (rn * 16807) % 2147483647; var a1 = rn / 2147483647; rn = (rn * 16807) % 2147483647; var a2 = rn / 2147483647; g.fillStyle = q0 % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)'; g.fillRect(a1 * w, a2 * h, 2, 1); } g.strokeStyle = 'rgba(20,22,18,.3)'; g.lineWidth = Math.max(1, w / 200); [0.25, 0.75].forEach(function (x) { g.beginPath(); g.moveTo(w * x, 0); g.lineTo(w * x, h); g.stroke(); }); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, h * 0.92, w, h * 0.08); return; }")
rep3("var tg = lathe(tp, sg(28, 16), { start: Math.PI });", "var tg = lathe(tp, sg(28, 16), { start: Math.PI }); if (MIRA) breech(tg, side);")
rep3("var bp = smoothProfile([[0.001, 0.012], [0.042, 0.008],", "var bp = smoothProfile(MIRA ? [[0.001, 0.03], [0.0435, 0.026], [0.0425, 0.0], [0.0405, -0.045], [0.0365, -0.095], [0.0325, -0.145], [0.0295, -0.188], [0.0305, -0.215], [0.034, -0.236], [0.0355, -0.246], [0.001, -0.252]] : [[0.001, 0.012], [0.042, 0.008],")
rep3("bg.scale(1.08, 1, 0.9); bg.computeVertexNormals();", "if (MIRA) { bg.scale(1.0, 1, 0.95); var bpp = bg.attributes.position; for (var bq = 0; bq < bpp.count; bq++) { var by2 = bpp.getY(bq); if (by2 > 0.0) { var bz2 = bpp.getZ(bq), br3 = Math.hypot(bpp.getX(bq), bz2) || 1e-6; bpp.setY(bq, by2 + 0.024 * Math.max(0, bz2 / br3) * Math.min(1, by2 / 0.026)); } } } else bg.scale(1.08, 1, 0.9); bg.computeVertexNormals();")
rep3("var foot = mesh(blob(0.05, 0.026, 0.066, sg(18, 10)), M.boot, { ink: 0.0045 }); foot.position.set(0, -0.234, 0.026); knee.add(foot);",
     "var foot = mesh(MIRA ? blob(0.037, 0.025, 0.07, sg(18, 10)) : blob(0.05, 0.026, 0.066, sg(18, 10)), M.boot, { ink: 0.0045 }); foot.position.set(0, -0.234, 0.026); knee.add(foot); if (MIRA) { var heel = mesh(rbox(0.032, 0.02, 0.03, 0.004, 3), M.boot, { ink: 0.003 }); heel.position.set(0, -0.016, -0.042); foot.add(heel); var sole = mesh(blob(0.039, 0.006, 0.072, sg(16, 8)), toon(0x0c0c0e), { ink: false }); sole.position.set(0, -0.021, 0.0); foot.add(sole); }")
rep3("g.fillStyle = hex(P.suit); g.fillRect(0, 0, w, h); var cx = w / 2;", sec('TORSOTEX').strip() + " g.fillStyle = hex(P.suit); g.fillRect(0, 0, w, h); var cx = w / 2;")
rep3("cc.position.y = 0.375; torso.add(cc);", "cc.position.y = 0.375; torso.add(cc); if (MIRA) { coat.visible = false; cc.visible = false; }")
rep3("lm.rotation.set(-0.18, 0.5 * s, 0); torso.add(lm); });", "lm.rotation.set(-0.18, 0.5 * s, 0); torso.add(lm); if (MIRA) lm.visible = false; });")
for _l in ["    lock([onSkull(0.05, R * 0.63, 0.008),", "    lock([onSkull(0.08, R * 0.62, 0.007),", "    lock([onSkull(0.2, R * 0.62, 0.006),"]:
    rep3(_l, _l.replace("    lock(", "    if (!MIRA) lock("))
rep3("(MIRA ? [1] : [1, -1]).forEach(function (s) {", "(MIRA ? [] : [1, -1]).forEach(function (s) {")
rep3("tie.rotation.y = Math.PI / 2; piv.add(tie); });", "tie.rotation.y = Math.PI / 2; piv.add(tie); });\n" + sec('PONY').rstrip('\n'))
rep3("helm.rotation.x = -0.2; head.add(helm);", "helm.rotation.x = -0.2; head.add(helm); if (MIRA) helm.visible = false;")
rep3("[1, -1].forEach(function (s) { var cupG = new THREE.CylinderGeometry(0.041", "(MIRA ? [] : [1, -1]).forEach(function (s) { var cupG = new THREE.CylinderGeometry(0.041")
rep3("    /* the colliders the tails rest against: the head, the shoulders, the back, the coat */", sec('UNIFORM') + "    /* the colliders the tails rest against: the head, the shoulders, the back, the coat */")
rep3("    root.updateMatrixWorld(true); tails.forEach(function (T) { var sk = new THREE.Skeleton(T.bones); T.meshes.forEach(function (mm) { mm.bind(sk); }); });",
     "    A.mira = MIRA; if (MU.skirt) A.skirt = MU.skirt; if (MU.cap) A.cap = MU.cap; if (MU.fist) A.fist = MU.fist;\n    root.updateMatrixWorld(true); tails.forEach(function (T) { var sk = new THREE.Skeleton(T.bones); T.meshes.forEach(function (mm) { mm.bind(sk); }); });")
rep3("    /* apply: the body, the pelvis, the trunk, the head */", sec('MOTION') + "    /* apply: the body, the pelvis, the trunk, the head */")
rep3("if (g.hands) { tg = limbIK(A, Ar, Ar.sh, g.hands[q[2]], A.A1, A.A2, -1); }", "if (g.hands && g.hands[q[2]]) { tg = limbIK(A, Ar, Ar.sh, g.hands[q[2]], A.A1, A.A2, -1); }")
rep3("    springTails(A, dt, o);", "    springTails(A, dt, o); if (A.skirt) skirtTick(A, dt);")
open(DST, 'w').write(s); print('LUNA.js V63', len(s))

# ===== (V65) the high ponytail: the hair at the back pulled up to the tie (short, tight, the strands converging on it); the cap as a
# collider for the tail; LUNA.merge may keep a geometry's own vertex colours (opt-in, for the dog's coat pattern) =====
s = open(DST).read()
def rep4(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch 4: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep4("bc.push([thb, 0.15, R * (1.42 + 0.1 * Math.sin(bi * 2.1))]); }", "bc.push([thb, 0.15, MIRA ? R * (1.02 + 0.05 * Math.sin(bi * 2.1)) : R * (1.42 + 0.1 * Math.sin(bi * 2.1))]); }")
rep4("fringe(Math.PI * 0.4, Math.PI * 1.6, R * 0.55, bc, -R * 0.5, { lift0: 0.004, lift1: 0.012, flick: 0.012, band: 0.3, nu: 150 });",
     "fringe(Math.PI * 0.4, Math.PI * 1.6, R * 0.55, bc, -R * 0.5, MIRA ? { lift0: 0.004, lift1: 0.008, flick: 0.0015, band: 0.3, nu: 180, nv: 22, conv: [Math.PI, -0.002, 9] } : { lift0: 0.004, lift1: 0.012, flick: 0.012, band: 0.3, nu: 150 });")
rep4("var crease = Math.pow(Math.abs(E[1]), 3),", "var crease = o3.conv ? Math.pow(Math.abs(Math.sin(Math.atan2(th - o3.conv[0], (o3.conv[1] - y) / R * 1.6) * o3.conv[2])), 7) * 0.85 + Math.pow(Math.abs(E[1]), 3) * 0.15 : Math.pow(Math.abs(E[1]), 3),")
rep4("var coll = [{ o: head, p: V(0, -0.01, 0), r: 0.128 },", "var coll = [{ o: head, p: V(0, -0.01, 0), r: 0.128 }, MIRA ? { o: head, p: V(0, 0.065, -0.005), r: 0.12 } : { o: head, p: V(0, -0.01, 0), r: 0.128 },")
rep4("c.set(it[2] == null ? 0xffffff : it[2]); var pa = g.attributes.position, na = g.attributes.normal, v = new THREE.Vector3(), n = new THREE.Vector3(), i; for (i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); n.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); P.push(v.x, v.y, v.z); N.push(n.x, n.y, n.z); C.push(c.r, c.g, c.b); } });",
     "c.set(it[2] == null ? 0xffffff : it[2]); var pa = g.attributes.position, na = g.attributes.normal, ca = it[3] ? g.attributes.color : null, v = new THREE.Vector3(), n = new THREE.Vector3(), i; for (i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); n.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); P.push(v.x, v.y, v.z); N.push(n.x, n.y, n.z); if (ca) C.push(c.r * ca.getX(i), c.g * ca.getY(i), c.b * ca.getZ(i)); else C.push(c.r, c.g, c.b); } });")
open(DST, 'w').write(s); print('LUNA.js V65', len(s))

# ===== (V66) a hand busy saluting does not stop the other hand holding something (the umbrella in her left while the right salutes) =====
s = open(DST).read()
def rep6(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch 6: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep6("if (A.holdR && !g.hands && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll'].indexOf(m) < 0) g.aR = A.holdR; if (A.holdL && !g.hands && ['attack',",
     "if (A.holdR && !(g.hands && g.hands[1]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll'].indexOf(m) < 0) g.aR = A.holdR; if (A.holdL && !(g.hands && g.hands[0]) && ['attack',")
open(DST, 'w').write(s); print('LUNA.js V66', len(s))


# ===== (V70) Mira, more charming: larger, brighter eyes with a sparkle and a light in the lower iris (blue all through, not amber), rosier
# cheeks with a gloss, a soft smile at rest, a wink; now and then at the salute she tilts her head and smiles or winks; the cap set a touch
# further back so the fringe shows =====
s = open(DST).read()
def rep7(old, new):
    global s
    c = s.count(old)
    if c != 1: raise SystemExit('LUNA patch 7: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep7("var LFO = MIRA ? { skin: '#fde3d6', eyeX: 0.0445, eyeY: -0.027, ew: 0.0285, eh: 0.0345, lashW: 0.005, fn: LQ >= 3 ? 2048 : 1024, iris: ['#0b1c3c', '#1f539e', '#4a98de', '#b4e0ff'], lash: '#5a3a1e', brow: '#b8894a', freckles: true }",
     "var LFO = MIRA ? { skin: '#fde5da', eyeX: 0.0448, eyeY: -0.0285, ew: 0.0306, eh: 0.0386, lashW: 0.0052, fn: LQ >= 3 ? 2048 : 1024, iris: ['#0a1d40', '#1d5cb4', '#46a8f2', '#d2f0ff'], lash: '#3f2614', brow: '#c9a060', freckles: true, cute: true }")
rep7("rg.addColorStop(0, 'rgba(255,236,170,.55)'); rg.addColorStop(1, 'rgba(255,236,170,0)');", "rg.addColorStop(0, o.cute ? 'rgba(170,232,255,.6)' : 'rgba(255,236,170,.55)'); rg.addColorStop(1, o.cute ? 'rgba(170,232,255,0)' : 'rgba(255,236,170,0)');")
rep7("g.strokeStyle = 'rgba(90,40,10,.55)'; g.lineWidth = rx * 0.05;", "g.strokeStyle = o.cute ? 'rgba(8,30,80,.4)' : 'rgba(90,40,10,.55)'; g.lineWidth = rx * 0.05;")
rep7("g.fillStyle = 'rgba(32,12,2,.92)';", "g.fillStyle = o.cute ? 'rgba(4,10,30,.95)' : 'rgba(32,12,2,.92)';")
rep7("g.strokeStyle = 'rgba(70,28,6,.85)';", "g.strokeStyle = o.cute ? 'rgba(6,20,56,.88)' : 'rgba(70,28,6,.85)';")
rep7("sh.addColorStop(0, 'rgba(70,24,10,.55)'); sh.addColorStop(1, 'rgba(70,24,10,0)');", "sh.addColorStop(0, o.cute ? 'rgba(30,26,60,.5)' : 'rgba(70,24,10,.55)'); sh.addColorStop(1, o.cute ? 'rgba(30,26,60,0)' : 'rgba(70,24,10,0)');")
rep7("g.beginPath(); g.arc(ix + rx * 0.42, iy + ry * 0.42, rx * 0.13, 0, Math.PI * 2); g.fill(); g.globalAlpha = 0.7; g.beginPath(); g.arc(ix - rx * 0.05, iy + ry * 0.6, rx * 0.07, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;",
     "g.beginPath(); g.arc(ix + rx * 0.42, iy + ry * 0.42, rx * 0.13, 0, Math.PI * 2); g.fill(); g.globalAlpha = 0.7; g.beginPath(); g.arc(ix - rx * 0.05, iy + ry * 0.6, rx * 0.07, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;\n"
     "      if (o.cute) { /* (V70) a sparkle (a four-point star) high in the iris, and the sky's light glowing in its lower half */ var lg2 = g.createRadialGradient(ix, iy + ry * 0.55, 0, ix, iy + ry * 0.55, rx * 0.75); lg2.addColorStop(0, 'rgba(205,242,255,.5)'); lg2.addColorStop(1, 'rgba(205,242,255,0)'); g.fillStyle = lg2; g.beginPath(); g.ellipse(ix, iy + ry * 0.5, rx * 0.66, ry * 0.38, 0, 0, Math.PI * 2); g.fill();\n"
     "        g.save(); g.translate(ix + rx * 0.4, iy - ry * 0.5); var sr = rx * 0.22; g.fillStyle = 'rgba(255,255,255,.97)'; g.beginPath(); g.moveTo(0, -sr); g.quadraticCurveTo(sr * 0.12, -sr * 0.12, sr, 0); g.quadraticCurveTo(sr * 0.12, sr * 0.12, 0, sr); g.quadraticCurveTo(-sr * 0.12, sr * 0.12, -sr, 0); g.quadraticCurveTo(-sr * 0.12, -sr * 0.12, 0, -sr); g.fill(); g.restore();\n"
     "        g.fillStyle = 'rgba(255,255,255,.98)'; g.beginPath(); g.ellipse(ix - rx * 0.34, iy - ry * 0.38, rx * 0.34, ry * 0.27, -0.45, 0, Math.PI * 2); g.fill(); }")
rep7("    eye(-ex, -1); eye(ex, 1);\n", "    if (kind === 'wink') { kind = 'happy'; eye(-ex, -1); kind = 'open'; eye(ex, 1); kind = 'wink'; } else { eye(-ex, -1); eye(ex, 1); }\n")
rep7("bl.addColorStop(0, 'rgba(255,128,118,.42)'); bl.addColorStop(1, 'rgba(255,128,118,0)');", "bl.addColorStop(0, o.cute ? 'rgba(255,118,128,.56)' : 'rgba(255,128,118,.42)'); bl.addColorStop(1, o.cute ? 'rgba(255,118,128,0)' : 'rgba(255,128,118,0)');")
rep7("if (o.blushLines !== false) { g.strokeStyle = 'rgba(232,110,100,.5)';", "if (o.cute) { g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(bx - sd * 0.0045 * S, by - 0.0042 * S, 0.003 * S, 0.0016 * S, 0, 0, Math.PI * 2); g.fill(); }\n      if (o.blushLines !== false) { g.strokeStyle = 'rgba(232,110,100,.5)';")
rep7("if (kind === 'happy' || kind === 'wide' || kind === 'shout' || o.mouth === 'open')", "if (kind === 'happy' || kind === 'wink' || kind === 'wide' || kind === 'shout' || o.mouth === 'open')")
rep7("    else { g.beginPath(); g.moveTo(X(-0.0065), Y(my + 0.0012)); g.quadraticCurveTo(X(0), Y(my - 0.0042), X(0.0065), Y(my + 0.0012)); g.stroke(); }",
     "    else if (o.cute) { /* (V70) a soft smile, the corners turned up, a touch of colour */ g.fillStyle = 'rgba(222,104,104,.5)'; g.beginPath(); g.moveTo(X(-0.0068), Y(my + 0.0016)); g.quadraticCurveTo(X(0), Y(my - 0.0064), X(0.0068), Y(my + 0.0016)); g.quadraticCurveTo(X(0), Y(my - 0.0016), X(-0.0068), Y(my + 0.0016)); g.fill();\n"
     "      g.strokeStyle = '#9a3a2c'; g.lineWidth = 0.0015 * S; g.beginPath(); g.moveTo(X(-0.0074), Y(my + 0.0022)); g.quadraticCurveTo(X(0), Y(my - 0.006), X(0.0074), Y(my + 0.0022)); g.stroke(); g.lineWidth = 0.0011 * S; [-1, 1].forEach(function (sd) { g.beginPath(); g.moveTo(X(sd * 0.0074), Y(my + 0.0022)); g.lineTo(X(sd * 0.0085), Y(my + 0.0035)); g.stroke(); }); }\n"
     "    else { g.beginPath(); g.moveTo(X(-0.0065), Y(my + 0.0012)); g.quadraticCurveTo(X(0), Y(my - 0.0042), X(0.0065), Y(my + 0.0012)); g.stroke(); }")
rep7("cap.position.set(0, 0.002, -0.004); cap.rotation.x = -0.13;", "cap.position.set(0, 0.003, -0.006); cap.rotation.x = -0.17; cap.scale.setScalar(0.975);")
# the charm at the salute: now and then a tilt of the head with a smile or a wink
rep7("      if (A.fist) { A.fist.visible = hk > 0.5; if (A.armR.hand) A.armR.hand.visible = hk <= 0.5; }",
     "      /* (V70) now and then at the salute: her head tilts and she smiles or winks */ var chm = A._ch || (A._ch = { t: 3 + Math.random() * 4, on: 0, k: 0 });\n"
     "      if (sal && m === 'idle' && hk < 0.05 && !A.holdL) { if (chm.on > 0) chm.on -= dt; else { chm.t -= dt; if (chm.t <= 0 || window.ISLE_CHARM) { chm.on = 1.5; chm.t = 6 + Math.random() * 7; expr(A, window.ISLE_CHARM || (Math.random() < 0.5 ? 'wink' : 'happy'), 1.5); } } } else chm.on = 0;\n"
     "      chm.k += ((chm.on > 0 ? 1 : 0) - chm.k) * Math.min(1, dt * 7); if (chm.k > 0.01) { var ck2 = chm.k * chm.k * (3 - 2 * chm.k); g.hZ += 0.17 * ck2; g.hX += 0.045 * ck2; }\n"
     "      if (A.fist) { A.fist.visible = hk > 0.5; if (A.armR.hand) A.armR.hand.visible = hk <= 0.5; }")
rep7("var bx = X(sd * (ex + 0.008)), by = Y(ey - 0.036)", "var bx = X(sd * (ex + (o.cute ? 0.012 : 0.008))), by = Y(ey - (o.cute ? 0.046 : 0.036))")
rep7("mira: { skin: 0xfbe2d4,", "mira: { skin: 0xf7d6c4,")
s = s.replace("var LFO = MIRA ? { skin: '#fde5da',", "var LFO = MIRA ? { skin: '#f8d8c7',")
rep7("return 0.03 * Math.pow(f, 2.2) * up; }", "return 0.021 * Math.pow(f, 2.2) * up; }")
rep7("hair: 0xe8c066, hairHi: 0xfff0bf, streak: 0xc99a42, emblem: 0xe3000f", "hair: 0xeebd55, hairHi: 0xfff2c4, streak: 0xc8953a, emblem: 0xe3000f")
# (V71) two poses for the people of the street when Mira's weapons come out: 'cower' (down on their haunches, the arms over the head,
# trembling) and 'halt' (one arm out, the palm toward her: stop it)
rep7("    if (m === 'sit') { g.lL = [-1.45, 0.06, 1.45];", "    if (m === 'cower') { var cw = Math.min(1, mt / 0.35), tr = Math.sin(t * 31) * 0.03; g.lL = [-1.75 * cw, 0.18, 2.25 * cw]; g.lR = [-1.6 * cw, -0.18, 2.1 * cw]; g.bodyY = -0.34 * cw; g.lean = 0.45 * cw; g.aL = [-2.3 * cw + tr, 0.6, -2.2 * cw]; g.aR = [-2.3 * cw - tr, -0.6, -2.2 * cw]; g.hX = 0.5 * cw; g.hZ = tr * 2; }\n    if (m === 'halt') { var hu = Math.min(1, mt / 0.3), swh = Math.sin(t * 5) * 0.06; g.aR = [-1.5 * hu, -0.12, -0.1 + swh]; g.aL = [-0.2, 0.25, -0.35]; g.lean = -0.04; g.hX = -0.1; g.hZ = 0; }\n    if (m === 'sit') { g.lL = [-1.45, 0.06, 1.45];")
rep7("if (m === 'hurt') expr(A, 'hurt', 0.8); }", "if (m === 'hurt') expr(A, 'hurt', 0.8); if (m === 'cower') expr(A, 'hurt', 999); if (m === 'halt') expr(A, 'shout', 1.4); }")
# ===== (V75) the people of the city drawn to charm: buildPerson rebuilt (tools/person75.js); the face takes a male option (thicker,
# straighter brows); the hair's tails and locks swing with the walk (A.hsw) =====
_P75 = open(ROOT / 'game' / 'tools' / 'person75.js', encoding='utf-8').read()
a = s.index("  function buildPerson(opt) {"); b = s.index("  function build(kind, opt) {")
s = s[:a] + _P75 + s[b:]
def rep75(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch 75: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep75("if (o.brows !== false) { g.strokeStyle = o.brow || '#c0641c'; g.lineCap = 'round'; g.lineWidth = 0.0019 * S;",
      "if (o.brows !== false) { g.strokeStyle = o.brow || '#c0641c'; g.lineCap = 'round'; g.lineWidth = (o.male ? 0.0031 : 0.0019) * S;")
rep75("g.beginPath(); g.moveTo(X(sd * (ex - 0.016)), Y(yi)); g.quadraticCurveTo(X(sd * (ex + 0.004)), Y(by + 0.006), X(sd * (ex + 0.026)), Y(by - 0.004)); g.stroke(); }); }",
      "g.beginPath(); g.moveTo(X(sd * (ex - 0.016)), Y(yi)); g.quadraticCurveTo(X(sd * (ex + 0.004)), Y(by + (o.male ? 0.003 : 0.006)), X(sd * (ex + 0.026)), Y(by - (o.male ? 0.006 : 0.004))); g.stroke(); }); }")
rep75("    if (A.exprHold > 0) { A.exprHold -= dt; if (A.exprHold <= 0) { A.expr = 'open'; setFace(A, 'open'); } }\n",
      "    /* (V75) the tails and locks of the people's hair: a lag behind the walk's bob and the turns, a light swing at rest */ if (A.hsw && A.hsw.length) { var hb = Math.sin(((A.gp || 0) * 2) * Math.PI * 2) * A.strideS * 0.35, hy = turn * 0.05; A.hsw.forEach(function (S) { var tg = hb * S.amp + Math.sin(t * 1.1 + S.ph) * 0.03 + (m === 'run' ? 0.3 : 0) * walkA; var acc = (tg - S.a) * 70 - S.v * 9; S.v += acc * dt; S.a += S.v * dt; S.piv.rotation.x = S.r0[0] - S.a; S.piv.rotation.z = S.r0[1] + hy + Math.sin(t * 0.9 + S.ph) * 0.02; }); }\n    if (A.exprHold > 0) { A.exprHold -= dt; if (A.exprHold <= 0) { A.expr = 'open'; setFace(A, 'open'); } }\n")
open(DST, 'w').write(s); print('LUNA.js V75', len(s))

# ===== (V76) Mira's holding, by human factors: a pose override for the weapons (A.poseX: the trunk's twist, the lean, the head, the feet
# — a bladed, braced firing stance), the recoil she absorbs (A.recoil), and 'toss': a one-armed overhand throw with a step (the stick
# grenade: the cord pulled, the arm cocked back, the hips and shoulders turned into the throw, the follow-through) =====
def rep76(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: raise SystemExit('LUNA patch 76: %d found for %r' % (c, old[:100]))
    s = s.replace(old, new)
rep76("      if (A.grip && m !== 'attack') { A._gw = A._gw || [new THREE.Vector3(), new THREE.Vector3()]; g.hands = [A.grip.L ? A.grip.L.getWorldPosition(A._gw[0]) : null, A.grip.R ? A.grip.R.getWorldPosition(A._gw[1]) : null]; g.lean = 0.05; g.hX = -0.03; g.hY = 0; g.torsoY = 0; g.hipsY = 0; }",
      "      if (A.grip && m !== 'attack') { A._gw = A._gw || [new THREE.Vector3(), new THREE.Vector3()]; g.hands = [A.grip.L ? A.grip.L.getWorldPosition(A._gw[0]) : null, A.grip.R ? A.grip.R.getWorldPosition(A._gw[1]) : null]; g.lean = 0.05; g.hX = -0.03; g.hY = 0; g.torsoY = 0; g.hipsY = 0; }\n"
      "      /* (V76) the stance a weapon asks for, set by its code: the trunk bladed to the target, the weight forward on staggered feet, the head down to the sights; the recoil taken in the shoulder and the trunk */\n"
      "      if (A.poseX) { var px = A.poseX; ['torsoY', 'hipsY', 'lean', 'hX', 'hY', 'hZ', 'spin'].forEach(function (kq) { if (px[kq] != null) g[kq] = px[kq]; }); if (px.bodyY != null) g.bodyY += px.bodyY; if (px.feet) g.feet = px.feet; if (px.aL && !(g.hands && g.hands[0])) g.aL = px.aL; if (px.aR && !(g.hands && g.hands[1])) g.aR = px.aR; }\n"
      "      if (A.recoil > 0) { A.recoil = Math.max(0, A.recoil - dt * 9); g.lean -= A.recoil * 0.05; g.hX += A.recoil * 0.04; g.bodyY -= A.recoil * 0.006; }")
# the throw
rep76("    if (m === 'hurl') {",
      "    /* (V76) 'toss': the stick grenade's throw, one-armed, overhand. A.tossP = [pull, cock, throw, follow] seconds. Pull: both hands at the\n"
      "       chest, the left draws the cord down and away. Cock: the right arm back and up behind the shoulder, elbow bent, the trunk turned to the\n"
      "       right, the weight on the right foot, the left arm out towards the mark, eyes on it. Throw: the hips lead, the trunk turns through, the\n"
      "       left foot steps in, the arm whips over the top and lets go. Follow-through: the arm swings down across the body, the trunk comes back. */\n"
      "    if (m === 'toss') { var tp = A.tossP || [0.14, 0.22, 0.14, 0.4], tT = tp[0] + tp[1] + tp[2] + tp[3], ss = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };\n"
      "      var pu = ss(mt / tp[0]), co = ss((mt - tp[0]) / tp[1]), th = ss((mt - tp[0] - tp[1]) / (tp[2] * 0.85)), fo = ss((mt - tp[0] - tp[1] - tp[2]) / tp[3]);\n"
      "      /* the right arm: at the chest; back and up; over the top; down across */ var rx = -0.95 * (1 - co) - 2.3 * co, rz = -0.3 * (1 - co) - 0.55 * co, re = -1.45 * (1 - co) - 1.9 * co; if (th > 0) { rx = -2.3 * (1 - th) - 0.75 * th; rz = -0.55 * (1 - th) - 0.35 * th; re = -1.9 * (1 - th) - 0.25 * th; } if (fo > 0) { rx = -0.75 * (1 - fo) + 0.25 * fo; rz = -0.35 * (1 - fo) - 0.18 * fo; re = -0.25 * (1 - fo) - 0.35 * fo; }\n"
      "      g.aR = [rx, rz, re];\n"
      "      /* the left: on the cord, drawn down and back; then out at the mark; then tucked in */ var lx = -0.85 * (1 - pu) - 0.25 * pu, lz = 0.25 * (1 - pu) + 0.5 * pu, le = -1.5 * (1 - pu) - 0.7 * pu; if (co > 0) { lx = -0.25 * (1 - co) - 1.15 * co; lz = 0.5 * (1 - co) + 0.28 * co; le = -0.7 * (1 - co) - 0.25 * co; } if (th > 0) { lx = -1.15 * (1 - th) - 0.4 * th; lz = 0.28; le = -0.25 * (1 - th) - 0.95 * th; } if (fo > 0) { lx = -0.4 * (1 - fo) + 0.0 * fo; lz = 0.28 * (1 - fo) + 0.2 * fo; le = -0.95 * (1 - fo) - 0.35 * fo; }\n"
      "      g.aL = [lx, lz, le];\n"
      "      /* the trunk and the feet: turned right and back on the cock, through to the left and forward on the throw, square again after */ var tw = -0.45 * co + (0.45 + 0.4) * th - 0.4 * fo, ln = -0.12 * co + 0.4 * th - 0.3 * fo, stp = 0.3 * th - 0.12 * fo;\n"
      "      g.torsoY = tw; g.hipsY = tw * 0.45; g.lean = ln; g.hY = -tw * 0.85; g.hX = -0.12 * co + 0.18 * th - 0.1 * fo; g.bodyY -= 0.02 * co + 0.05 * th - 0.03 * fo; g.spin = 0;\n"
      "      g.feet = [[A.footX + 0.015, A.ank, 0.06 + stp], [-A.footX - 0.03, A.ank, -0.08 - 0.08 * co + 0.04 * th]]; if (mt >= tT) { A.mode = 'idle'; A.modeT = 0; } }\n"
      "    if (m === 'hurl') {")
# 'toss' holds nothing by the hold arrays (the throw owns both arms)
rep76("if (A.holdR && !(g.hands && g.hands[1]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll'].indexOf(m) < 0) g.aR = A.holdR; if (A.holdL && !(g.hands && g.hands[0]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll'].indexOf(m) < 0) g.aL = A.holdL;",
      "if (A.holdR && !(g.hands && g.hands[1]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll', 'toss'].indexOf(m) < 0) g.aR = A.holdR; if (A.holdL && !(g.hands && g.hands[0]) && ['attack', 'combo2', 'thrust', 'heavy', 'parry', 'stagger', 'hurt', 'jump', 'roll', 'toss'].indexOf(m) < 0) g.aL = A.holdL;")
open(DST, 'w').write(s); print('LUNA.js V76', len(s))
