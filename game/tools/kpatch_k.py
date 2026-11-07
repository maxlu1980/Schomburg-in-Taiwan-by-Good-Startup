# (Köln) code fixes by exact-string patches
patch('27_island_c', "quizCard(CATS.indexOf(cat) >= 0 ? cat : CATS[Math.floor(Math.random() * 4)]);", "quizCard(CATS.indexOf(cat) >= 0 ? cat : CATS[Math.floor(Math.random() * CATS.length)]);")
patch('27_island_c', " if (n.role === 'staff') TW.after = function () { hsrCard(n.id); }; }", " }")
patch('27_island_c', "    var reg = [['lab', ['visit']], ['po', ['visit', 'quiz', 'sim']], ['sl', ['visit', 'quiz', 'sim']], ['gs', ['visit']], ['ad', ['visit', 'quiz', 'sim']], ['ux', ['visit', 'quiz', 'sim']]];", "    var reg = [['lab', ['visit']], ['gs', ['visit']]].concat(CATS.map(function (c) { return [c, ['visit', 'quiz', 'sim']]; }));")
patch('27_island_c', "    var places = ['shrine', 'diner', 'temple', 'twinHeart', 'kenting', 'sunmoon', 'alishan', 'dlc', 'taitung'].map(", "    var places = ['koeln', 'shrine', 'diner', 'temple', 'twinHeart', 'dlc', 'taitung'].map(")
# ---- part s: NO AFTERLIFE and the city's own lines also in Köln ----
patch('19_island_s', "gd = function (k) { if (TK && TK.id === 'taichung') { var L = GD[LANG] || GD.zh;", "gd = function (k) { if (TK && (TK.id === 'taichung' || TK.id === 'koeln')) { var L = GD[LANG] || GD.zh;")
patch('19_island_s', "gx = function (k) { if (TK && TK.id === 'taichung' && k === 'c_vendor') return _gxS('c_vendor_txg');", "gx = function (k) { if (TK && (TK.id === 'taichung' || TK.id === 'koeln') && k === 'c_vendor') return _gxS('c_vendor_txg');")
patch('19_island_s', "var _cityTalkS = cityTalk; cityTalk = function (it) { if (!TK || TK.id !== 'taichung') return _cityTalkS(it);", "var _cityTalkS = cityTalk; cityTalk = function (it) { if (!TK || (TK.id !== 'taichung' && !(TK.id === 'koeln' && /^(max|kao|andy|zhao|thanks)$/.test(it.id)))) return _cityTalkS(it);")
patch('19_island_s', "function barTick(dt) { if (!TK || TK.id !== 'taichung' || !BARN.A.length) return;", "function barTick(dt) { if (!TK || (TK.id !== 'taichung' && TK.id !== 'koeln') || !BARN.A.length) return;")
patch('19_island_s', "_sk(dt, now); if (!TK || TK.id !== 'taichung' || !BARS.inside) return;", "_sk(dt, now); if (!TK || (TK.id !== 'taichung' && TK.id !== 'koeln') || !BARS.inside) return;")
# ---- part b: the player is Mira (an original look on the same rig) ----
patch('01_island_b', "luna = LUNA.build('luna');", "var _lq = ULTRA ? 3 : TIER === 'high' ? 2 : TIER === 'mid' ? 1 : 0; LUNA.setQuality(3); luna = LUNA.build('luna', { mira: true }); LUNA.setQuality(Math.max(1, _lq));")
# ---- part i: the street play's story in Köln (Kalle, the Köbes, the regulars) ----
patch('08_island_i', "(TK && TK.id !== 'tokyo' ? [['boss', 'b', '#2a6ac8'], ['koban', 'p', '#123a7a'], ['vendor', 'v', '#c8501a'], ", "(TK && TK.id === 'koeln' ? [['boss', 'b', '#2a6ac8'], ['kage', 'k', '#3a3a3e'], ['koban', 'p', '#123a7a'], ['master', 'm', '#8a4a20'], ['vendor', 'v', '#c8501a'], ['staff', 's', '#ec0016']] : TK && TK.id !== 'tokyo' ? [['boss', 'b', '#2a6ac8'], ['koban', 'p', '#123a7a'], ['vendor', 'v', '#c8501a'], ")
patch('08_island_i', "if (TK.id === 'tokyo' && !GS.pinged && !GS.met.kage) {", "if ((TK.id === 'tokyo' || TK.id === 'koeln') && !GS.pinged && !GS.met.kage) {")
patch('08_island_i', "else if (TK.id !== 'tokyo') cityTalk(it); else phSeq('master', gd(it.id), null, true); }", "else if (TK.id !== 'tokyo' && !/^r[12]$/.test(it.id)) cityTalk(it); else phSeq('master', gd(it.id), null, true); }")
# ---- part c: leaving the game goes to the guide site's own pages and simulators; the header button ----
patch('27_island_c', open(ROOT / 'game' / 'tools' / '_closeold.txt', encoding='utf-8').read(), "    koToSite(cat, opt); }")
patch('27_island_c', "b.className = 'util__isle'; b.id = 'utilIsle';", "b.className = 'util__docs util__isle'; b.id = 'utilIsle';")
patch('27_island_c', "function relabelHeader() { var b = document.getElementById('utilIsle'); if (b) b.querySelector('span').textContent = t('island'); }", "function relabelHeader() { var b = document.getElementById('utilIsle'); if (b) b.querySelector('span').textContent = lx({ en: 'Köln game', zh: '科隆遊戲', de: 'Köln-Spiel' }); }")
# ---- part b/c: a scripted camera (the tower climb); people who are away (Max at night) stay away ----
patch('01_island_b', "function camera(dt, snap) { if (window.DBGCAM) { var Dc = window.DBGCAM;", "function camera(dt, snap) { if (window.DBGCAM || KTOWC) { var Dc = window.DBGCAM || KTOWC;")
patch('27_island_c', "npcs.forEach(function (n) { var vis = Math.abs(n.x - cx) < 45 && Math.abs(n.z - cz) < 45;", "npcs.forEach(function (n) { var vis = Math.abs(n.x - cx) < 45 && Math.abs(n.z - cz) < 45 && !n.away;")
# ---- part b: Köln's own time (the clock, the sky of a test hour) ----
patch('01_island_b', "var s = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false });", "var s = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false });")
patch('01_island_b', "var d = new Date(), tp = new Date(d.getTime() + 8 * 3600000), base = Date.UTC(tp.getUTCFullYear(), tp.getUTCMonth(), tp.getUTCDate()) - 8 * 3600000;", "var d = new Date(), kz = KOLN_TZ(d), tp = new Date(d.getTime() + kz * 3600000), base = Date.UTC(tp.getUTCFullYear(), tp.getUTCMonth(), tp.getUTCDate()) - kz * 3600000;")
# ---- part j: an umbrella with a smooth, scalloped canopy (eight panels between the ribs); Mira's in SCHOMBURG red ----
patch('09_island_j', "R = 0.5, can = new THREE.Mesh(new THREE.ConeGeometry(R, 0.2, 8, 1, true), umbMat(kind)); can.position.y = 0.66; g.add(can);", "R = 0.5, can = new THREE.Mesh(koUmbGeo(R), umbMat(kind)); can.position.y = 0.56; g.add(can);")
patch('09_island_j', "rim.position.y = 0.56; g.add(rim);", "rim.position.y = 0.56; rim.visible = false; g.add(rim);")
patch('09_island_j', "{ black: 0x16171a, navy: 0x1c2a44, beige: 0xc8b48e, red: 0x8a1e22, check: 0x4a3a2c }[kind]", "{ black: 0x16171a, navy: 0x1c2a44, beige: 0xc8b48e, red: 0x8a1e22, check: 0x4a3a2c, schomburg: 0xd8101e }[kind]")
patch('09_island_j', "u = umbrella(UMB_KINDS[seed % UMB_KINDS.length]);", "u = umbrella(A === luna ? 'schomburg' : UMB_KINDS[seed % UMB_KINDS.length]);")
# ---- parts k, n, p: the attacks in a German WWII manner (the pioneer's spade for the drawn cut; tracer, smoke, flame and steel instead of prism light) ----
patch('11_island_k', open(ROOT / 'game' / 'tools' / '_bokkenold.txt', encoding='utf-8').read(), open(ROOT / 'game' / 'tools' / '_bokkennew.txt', encoding='utf-8').read())
patch('11_island_k', '<b lang="ja">', '<b lang="de">')
patch('16_island_p', "c0: Math.random() < 0.5 ? [0.3, 0.9, 1] : [1, 0.35, 0.85]", "c0: Math.random() < 0.5 ? [1, 0.62, 0.22] : [1, 0.3, 0.12]")
RECOLOR = { '11_island_k': { '0x6ad0ff': '0xfff06a', '0xeef4ff': '0xd8dee6', '0x8ad8ff': '0x9aa0a8', '0xc89aff': '0xc8ccd2', '0xf0e0ff': '0xffb060', '0x5ae0ff': '0xff8a2a', '0x58d8ff': '0xff9a3a' },
  '14_island_n': { 'dxSparks(D, [c2[0], c2[1] + 1, c2[2]], 4, [0.5, 0.85, 1])': 'dxSparks(D, [c2[0], c2[1] + 1, c2[2]], 4, [1, 0.8, 0.45])', 'c0: [0.3, 0.7, 1]': 'c0: [1, 0.7, 0.3]', 'c0: [0.35, 0.85, 1]': 'c0: [1, 0.8, 0.35]', '0xeef6ff': '0xfff2e0', '0xdfe8ff': '0xffe4c0', '0xbfe8ff': '0xffd8a0' },
  '06_island_g': { 'o.big ? 0xb08aff : 0x7fd8ff': 'o.big ? 0xff7a3a : 0xffb060', "{ r: [Math.PI / 2, 0, 0] }, 0x4a8ac8)": "{ r: [Math.PI / 2, 0, 0] }, 0x6a6e58)", "r: [Math.PI / 2, 0, 0] }, 0x2a5a8a)": "r: [Math.PI / 2, 0, 0] }, 0x4a4e40)" },
  '13_island_m': { 'dxSparks(D, [P.x, P.y + 1.1, P.z], 10, [0.6, 0.85, 1])': 'dxSparks(D, [P.x, P.y + 1.1, P.z], 10, [1, 0.85, 0.5])' },
  '16_island_p': { 'S.rings.forEach(function (rg, i) { rg.rotation.set(': 'S.rings.forEach(function (rg, i) { rg.visible = false; rg.rotation.set(', 'S.orb.scale.setScalar(5.5 * (1 - u2 * 0.3)); }': "S.orb.scale.setScalar(5.5 * (1 - u2 * 0.3)); if (Math.random() < 0.85) dxPuff(D, 'puff', [S.orb.position.x, S.orb.position.y + 1.5, S.orb.position.z], { vy: 0.5, s0: 2.4, s1: 7, c0: [0.34, 0.32, 0.3], c1: [0.2, 0.19, 0.19], a0: 0.55, life: 2.2, drag: 0.6 }); }", "dxPuff(D, 'glow', [x, y, z], { vy: 0, s0: 0.5, s1: 0.05, c0: b.col, a0: 0.9, life: 0.28, drag: 0 });": "dxPuff(D, 'glow', [x, y, z], { vy: 0, s0: 0.5, s1: 0.05, c0: b.col, a0: 0.9, life: 0.28, drag: 0 }); if (Math.random() < 0.45) dxPuff(D, 'puff', [x, y, z], { vy: 0.25, s0: 0.25, s1: 1.2, c0: [0.8, 0.79, 0.77], c1: [0.56, 0.55, 0.54], a0: 0.42, life: 1.1, drag: 0.8 });", 'DXC3.setRGB(0.06, 0.04, 0.1)': 'DXC3.setRGB(0.1, 0.075, 0.05)', 'col: Math.random() < 0.5 ? [0.35, 0.9, 1] : [1, 0.4, 0.9]': 'col: Math.random() < 0.5 ? [1, 0.78, 0.36] : [1, 0.42, 0.18]', '1.2, [0.7, 0.9, 1])': '1.2, [1, 0.82, 0.5])', '0x40e8ff': '0xffb040', '0xff4ad8': '0xff3a1a', '0xff60d0': '0xff5a20', '0x60f0ff': '0xffd060', '0x60a0ff': '0xff7a2a', '0x40d8ff': '0xff8a2a', '0xff70d0': '0xff6a2a', '0x40c8ff': '0xff7020', '0x60e0ff': '0xffa040', '0xcff4ff': '0xffe6b0', '0xbff4ff': '0xffe0a0', '0xbff0ff': '0xffd890', '0x60e8ff': '0xffb050', '0xff60d8': '0xff4a1a', 'c0: [0.6, 0.9, 1]': 'c0: [1, 0.85, 0.5]' } }

# ---- (V63) Mira's companion is a German shepherd: its size, its place beside her, it sits to attention when she salutes; smaller on the pillion ----
patch('02_island_d', "var D = DOG.build('maltese'); D.root.scale.setScalar(1.12); D.root.visible = false; scene.add(D.root); DOGS.m = { D: D, x: pos.x, z: pos.z, hd: 0, v: 0, sp: 0, idle: 0, exc: 0, side: 1, sniff: null, rad: 0.15 };",
      "var D = DOG.build('shepherd'); D.root.scale.setScalar(1.0); D.root.visible = false; scene.add(D.root); DOGS.m = { D: D, x: pos.x, z: pos.z, hd: 0, v: 0, sp: 0, idle: 0, exc: 0, side: 1, sniff: null, rad: 0.24 };")
patch('02_island_d', "q.x = pos.x + rx * 0.55 * sd - fx * 0.3; q.z = pos.z + rz * 0.55 * sd - fz * 0.3;", "q.x = pos.x + rx * 0.68 * sd - fx * 0.22; q.z = pos.z + rz * 0.68 * sd - fz * 0.22;")
patch('02_island_d', "else cand = [[0.55, -0.45], [-0.55, -0.45], [0, -0.75], [0.7, 0.2], [-0.7, 0.2], [0, 0.8]];", "else cand = [[0.7, -0.45], [-0.7, -0.45], [0, -0.95], [0.88, 0.2], [-0.88, 0.2], [0, 1.0]];")
patch('02_island_d', "else if (M.exc > 0 && Math.hypot(M.x - pos.x, M.z - pos.z) < 2.2) { DOG.setMode(D, 'rear');", "else if (M.exc > 0 && Math.hypot(M.x - pos.x, M.z - pos.z) < 2.2) { DOG.setMode(D, D.kind === 'shepherd' && (luna.mode === 'wave' || luna.mode === 'peace') ? 'sit' : 'rear');")
patch('02_island_d', "mk.dog.getWorldPosition(D.root.position); D.root.quaternion.copy(o.quaternion);", "mk.dog.getWorldPosition(D.root.position); D.root.quaternion.copy(o.quaternion); D.root.scale.setScalar(o.userData.kind === 'moped' ? 0.8 : 1.0);")
patch('02_island_d', "M.D.root.visible = true; M.D.root.position.set(M.x, groundY(M.x, M.z), M.z);", "M.D.root.visible = true; M.D.root.scale.setScalar(1.0); M.D.root.position.set(M.x, groundY(M.x, M.z), M.z);")
# ---- (V63) no helmet lamp on the officer's cap (the light itself stays: it shines from the cap's peak) ----
patch('03_island_e', "house.position.set(0, 0.016, R * 1.16 + 0.006); g.add(house);", "house.position.set(0, 0.016, R * 1.16 + 0.006); g.add(house); if (luna.mira) house.visible = false;")
patch('03_island_e', "lens.position.set(0, 0.016, R * 1.16 + 0.0185); g.add(lens);", "lens.position.set(0, 0.016, R * 1.16 + 0.0185); g.add(lens); if (luna.mira) lens.visible = false;")

# ---- V64: the summons set their own camera (S.cam / S.look, local); a strike whose charge is still in flight does not say "miss" ----
patch('16_island_p', "var w = SP.cw; DXV.copy(cam.position).lerp(wp, w);", "if (S.cam && S.look) { wp = T.toW(S.cam[0], S.cam[1], S.cam[2]); wl = T.toW(S.look[0], S.look[1], S.look[2]); } var w = SP.cw; DXV.copy(cam.position).lerp(wp, w);")
patch('11_island_k', "else if (!M.any && Math.random() < 0.5) { VOICE.say('miss');", "else if (!M.any && !M.proj && Math.random() < 0.5) { VOICE.say('miss');")

# ---- V65: the umbrella in her fist — the shaft runs through the middle of the hand (the hand's grip socket), not past the wrist ----
patch('09_island_j', "var hp = A.armR.wr.getWorldPosition(new THREE.Vector3()); A.root.worldToLocal(hp); u.position.set(hp.x, hp.y - 0.02, hp.z);",
      "var hp = A.root.userData.mira ? A.armL.wr.localToWorld(new THREE.Vector3(0, -0.045, 0.01)) : A.sock && A.sock.w ? A.sock.w.getWorldPosition(new THREE.Vector3()) : A.armR.wr.localToWorld(new THREE.Vector3(0, -0.036, 0.006)); A.root.worldToLocal(hp); u.position.set(hp.x, hp.y - 0.008, hp.z);")
# ---- V65: indoors the rain is heard only faintly ----
patch('09_island_j', "var cover = lOut ? 1 : 0.45", "var cover = lOut ? 1 : 0.14")
# ---- V65: the umbrellas' colours as picked (sRGB → linear; the SCHOMBURG red is red, not pink) ----
patch('09_island_j', "else m = new THREE.MeshStandardMaterial({ color: { black: 0x16171a, navy: 0x1c2a44, beige: 0xc8b48e, red: 0x8a1e22, check: 0x4a3a2c, schomburg: 0xd8101e }[kind] || 0x16171a, roughness: 0.55, side: THREE.DoubleSide });",
      "else m = new THREE.MeshStandardMaterial({ color: new THREE.Color({ black: 0x16171a, navy: 0x1c2a44, beige: 0xc8b48e, red: 0x8a1e22, check: 0x4a3a2c, schomburg: 0xd8101e }[kind] || 0x16171a).convertSRGBToLinear(), roughness: 0.55, side: THREE.DoubleSide });")
# ---- V66: Mira holds the umbrella in her LEFT hand (her right salutes) ----
patch('09_island_j', "var UMBPOSE = [-0.62, -0.16, -1.35];", "var UMBPOSE = [-0.62, -0.16, -1.35], UMBPOSE_L = [-0.62, 0.16, 1.35];")
patch('09_island_j', "u.visible = want; if (want) A.holdR = UMBPOSE; else if (A.holdR === UMBPOSE) A.holdR = null; if (!want) return;",
      "var LH = !!(A.root && A.root.userData.mira); u.visible = want; if (want) { if (LH) A.holdL = UMBPOSE_L; else A.holdR = UMBPOSE; } else { if (A.holdR === UMBPOSE) A.holdR = null; if (A.holdL === UMBPOSE_L) A.holdL = null; } if (!want) return;")
# ---- V67: an officer's way-finding is bounded (KPOL.cap, set by k_pol.js only around an officer's search) ----
patch('07_island_h', "while (heap.length && it++ < (NB ? 260000 : 60000)) {", "while (heap.length && it++ < ((typeof KPOL !== 'undefined' && KPOL.cap) || (NB ? 260000 : 60000))) {")
# ---- V67: in the city a step (up to a stair's riser, 0.46) is climbed at any pace; the island's slope rule stays for the island's terrain ----
patch('01_island_b', "if (dd > 1e-4 && (h1 - h0) / dd > 1.6) { r.x = pos.x; r.z = pos.z; }", "if (dd > 1e-4 && (h1 - h0) / dd > 1.6 && !(typeof TK !== 'undefined' && TK && inTK(r.x, r.z) && h1 - h0 < 0.47)) { r.x = pos.x; r.z = pos.z; }")
# (V68) the passages and stairs under a station that lies off the world's axes: the camera lines up with the city's own (TKM.camAx)
patch('07_island_h', "var ax0 = z === 'stair' ? 0 : Math.PI / 2,", "var ax0 = TKM.camAx ? TKM.camAx(z) : (z === 'stair' ? 0 : Math.PI / 2),")
# (V68) Köln's view distance follows the weather (a clear day shows the cathedral from the far bank); Tokyo's fixed street haze otherwise
patch('07_island_h', "W.sun.intensity *= 1.06; if (W.fog) { W.fog.near = 70; W.fog.far = 460; }", "W.sun.intensity *= 1.06; if (W.fog) { var fq = (typeof KVIEW !== 'undefined' && KVIEW.fog) ? KVIEW.fog() : null; W.fog.near = fq ? fq[0] : 70; W.fog.far = fq ? fq[1] : 460; }")
patch('07_island_h', "if (W.fog) { W.fog.near = 70; W.fog.far = TK && TK.id === 'koeln' ? 1150 : 460; } }", "if (W.fog) { var fq2 = (typeof KVIEW !== 'undefined' && KVIEW.fog) ? KVIEW.fog() : null; W.fog.near = fq2 ? fq2[0] : 70; W.fog.far = fq2 ? fq2[1] : (TK && TK.id === 'koeln' ? 1150 : 460); } }")

# ---- (V69) the mirrors and the pocket door's view are drawn just before the frame ----
patch('27_island_c', "    W.envUpdate(R3); if (POST) POST.render(scene, cam, ts); else R3.render(scene, cam);", "    W.envUpdate(R3); if (mode !== 'title' || TK) krtxFrame(R3); if (POST) POST.render(scene, cam, ts); else R3.render(scene, cam);")

# ---- (V69) the city's view distance follows KVIEW (a clear day reaches across the river and beyond) ----
patch('09_island_j', "function tkFog() { if (!tkShown() || !W.fog) return;", "function tkFog() { if (!tkShown() || !W.fog) return; if (TK && TK.id === 'koeln' && typeof KVIEW !== 'undefined') { var kq = KVIEW.fog(); if (kq) { W.fog.near = kq[0]; W.fog.far = kq[1]; return; } }")

# ---- (V71) the people reacting to Mira's weapons (k_crowd.js) take their turn before the street's routine ----
patch('08_island_i', "if (n.ko) { koStep(n, dt); return; }", "if (n.ko) { koStep(n, dt); return; } if (n.rx && kcrStep(n, dt)) return;")

# ---- (V76) the umbrella held as a hand holds one: the upper arm near the body, the elbow bent to a right angle, the forearm level and a
# little inward so the fist is in front of the lower chest, the wrist straight; the shaft leans back a touch so the canopy sits over the
# head, and tips forward into the rain as she walks ----
patch('09_island_j', "var UMBPOSE = [-0.62, -0.16, -1.35], UMBPOSE_L = [-0.62, 0.16, 1.35];", "var UMBPOSE = [-0.26, -0.12, -1.52], UMBPOSE_L = [-0.24, 0.13, -1.55];")
patch('09_island_j', "var sp = A.speed || 0; u.rotation.set(-Math.min(0.22, sp * 0.06), 0, 0); }", "var sp = A.speed || 0; u.rotation.set(-0.12 + Math.min(0.32, sp * 0.09), 0, 0); }")
