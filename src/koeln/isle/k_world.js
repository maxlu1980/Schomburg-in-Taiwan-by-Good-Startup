  /* ===== ISLE part K0 (Köln): the places of the one city — the training sites, the people at their posts, the landmarks, the board
     game's round; set into the world as soon as it exists (before the people are dressed and the board is laid) ===== */
  /* the plan (local = world; x east, z south; 1 unit = 1.2 m; the cathedral's centre at the origin) */
  var KP = {
    /* the six SCHOMBURG practice sites and the training centre (HQ) on the Roncalliplatz */
    lab: { at: [-25, 72], rr: 26, door: [-25, 64], ry: Math.PI },
    inj: { at: [16, -206], rr: 22, ry: 0 }, rc: { at: [104, -206], rr: 22, ry: 0 },
    cr: { at: [219, 40], rr: 20, ry: -Math.PI / 2 }, wp: { at: [286, 132], rr: 18, ry: -Math.PI / 2 },
    ca: { at: [604, 112], rr: 20, ry: Math.PI / 2 }, pf: { at: [-100, -74], rr: 20, ry: Math.PI / 2 },
    gs: { at: [250.4, 120], rr: 14, ry: -Math.PI / 2 },
    /* the landmarks with something to do */
    shrine: { at: [-95, 70], rr: 10 }, diner: { at: [20, 99], rr: 9 }, temple: { at: null, rr: 8 }, twinHeart: { at: null, rr: 9 },
    dlc: { at: [601.4, 30], rr: 9 }, taitung: { at: [-48, 28.4], rr: 9 },
    /* the arenas of the defects */
    b_fissure: { at: [60, -222], R: 8 }, b_ferrum: { at: [222, 72], R: 7 }, b_tide: { at: [286, 205], R: 5.4 }, b_pressure: { at: [120, -140], R: 8 },
    b_slump: { at: [604, 176], R: 6.2 }, b_oil: { at: [-84, -60], R: 7 }, b_carbon: { at: [-90, 0], R: 9 }
  };
  /* the board game's round: the Domplatte, along the cathedral's south side, between the museums to the Rheingarten, back over the
     Heinrich-Böll-Platz and round the choir */
  var KRING = [[-92, -44], [-92, 46], [84, 47], [85, 92], [238, 93], [238, 20], [92, 20], [75, -44]];
  function koRing() { var R = [], i, n = KRING.length; for (i = 0; i < n; i++) { var a = KRING[i], b = KRING[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.round(L)), k; for (k = 0; k < m; k++) R.push([a[0] + (b[0] - a[0]) * k / m, a[1] + (b[1] - a[1]) * k / m]); } return R; }
  function koT() { return CITY.koeln && CITY.koeln.T; }
  function koY(x, z) { var T = koT(); return T ? KOELN3D.groundAt(T, x, z, 0.62) : 0.12; }
  function koWorld() { if (W.koWorld) return; W.koWorld = true; var C = koBuild(), T = C.T, S = T.spots;
    if (S.locks) KP.temple.at = [S.locks[0], S.locks[1]]; if (S.bridgeMid) KP.twinHeart.at = [S.bridgeMid[0], S.bridgeMid[1] + 4];
    function place(id, p, o) { W.places[id] = Object.assign({ id: id, x: p[0], z: p[1], rr: 10, y: koY(p[0], p[1]) }, o || {}); }
    function act(id, kind, p, r, o) { W.interact.push(Object.assign({ id: id, kind: kind, x: p[0], z: p[1], r: r || 1.5 }, o || {})); }
    function npc(id, role, p, rot) { W.npcs.push({ id: id, role: role, x: p[0], z: p[1], rot: rot || 0 }); }
    /* the training centre and the six sites: the place, the master at the mock-up */
    var hq = S.hq || KP.lab.door; place('lab', [hq[0], hq[1] + 8], { kind: 'land', rr: KP.lab.rr, plazaW: hq.slice() }); act('lab', 'dist', hq, 1.8); if (S.hqLead) npc('lab', 'master', S.hqLead, Math.PI);
    CATS.forEach(function (c) { var q = KP[c]; place(c, q.at, { kind: 'land', rr: q.rr, plazaW: [q.at[0] + Math.sin(q.ry) * 6, q.at[1] + Math.cos(q.ry) * 6] }); });
    var gsp = S.gs || KP.gs.at, gsf = S.gsFront || [gsp[0] - 2.4, gsp[1]]; place('gs', gsp, { kind: 'land', rr: KP.gs.rr, plazaW: gsf.slice() }); npc('gs', 'master', gsp, -Math.PI / 2); act('gs', 'dist', [gsf[0] - 0.6, gsf[1] + 2.2], 1.4);
    /* the landmarks */
    var hz = S.heinz || [KP.shrine.at[0] + 4.8, KP.shrine.at[1]]; place('shrine', KP.shrine.at, { kind: 'land', rr: 10 }); act('shrine', 'shrine', hz, 1.8); npc('shrine', 'keeper', [hz[0] + 0.4, hz[1] - 3.2], 0);
    var br = S.brau || [KP.diner.at[0], KP.diner.at[1] - 0.6]; place('diner', [br[0], br[1] - 2], { kind: 'land', rr: 8 }); act('diner', 'diner', [br[0], br[1] - 0.6], 1.6);
    if (KP.temple.at) { place('temple', KP.temple.at, { kind: 'land', rr: 8, y: (S.locksY != null ? S.locksY : koY(KP.temple.at[0], KP.temple.at[1])) }); act('temple', 'temple', KP.temple.at, 1.6); npc('temple', 'auntie', [KP.temple.at[0] - 2.5, KP.temple.at[1] - 1.2], Math.PI); }
    if (KP.twinHeart.at) { place('twinHeart', KP.twinHeart.at, { kind: 'land', rr: 8 }); act('twinHeart', 'heart', KP.twinHeart.at, 1.8); }
    var dl = S.dlc || KP.dlc.at; place('dlc', dl, { kind: 'land', rr: 9 }); act('dlc', 'dlc', dl, 1.6); npc('dlc', 'clerk', [dl[0] - 0.4, dl[1] + 2.2], -Math.PI / 2);
    var tu = S.turm || KP.taitung.at; place('taitung', tu, { kind: 'land', rr: 9 }); act('balloon', 'balloon', tu, 1.8); npc('balloon', 'pilot', [tu[0] + 2.4, tu[1] + 0.6], 0);
    /* the station's staff by the ticket hall */ if (S.staff) npc('hbf', 'staff', S.staff, S.staffFace || 0);
    /* the arenas: the gate is the side she enters from */
    Object.keys(BOSS).forEach(function (id) { var q = KP['b_' + id]; if (!q) return; var y = koY(q.at[0], q.at[1]); place(id, q.at, { kind: 'boss', rr: q.R + 4, R: q.R, y: y, gate: [q.at[0], q.at[1] + q.R + 2.5] }); act(id, 'boss', [q.at[0], q.at[1] + q.R + 1.2], 1.8); });
    /* the sights: a place each and something to look at */
    var SG = { kDom: [-74, -6], kKreuz: S.kreuz || [-77.4, 32.6], kSchrein: [4, 40.5], kBridge: S.bridgeW || [262, 11], kReiter: S.statue1 ? [S.statue1[0] - 2.4, S.statue1[1] + 2.0] : null, kHbf: S.hbfFront, kLudwig: [130, 17], kRGM: [46, 50.5], kBoell: [152, 12], kGSM: S.gsm, kFisch: [240, 250], kMusical: [192, -190], kTriangle: [606, -82], kBoulevard: S.deutzSteps, kHohe: S.hoheStr };
    Object.keys(SG).forEach(function (id) { var p = SG[id]; if (!p || typeof SIGHT === 'undefined' || !SIGHT[id]) return; place(id, p, { kind: 'sight', rr: 7 }); act(id, 'sight', p, 1.8); });
    /* the street food: the Büdchen, the Imbiss truck, the Reibekuchen stand, the Brauhaus's tables, Max's counter */
    function food(id, p) { if (p && typeof DISH !== 'undefined' && DISH[id]) act(id, 'food', p, 1.3); }
    var kb = S.kioskBuy; if (kb) { food('brezel', [kb[0] - 1.0, kb[1]]); food('berliner', [kb[0] + 1.0, kb[1]]); }
    var im = S.imbiss; if (im) { food('currywurst', [im[0] - 1.1, im[1]]); food('pommes', [im[0] + 1.1, im[1]]); npc('imbiss', 'vendor', S.imbissV, Math.PI * 0); }
    if (S.reibe) { food('reibekuchen', S.reibe); npc('reibe', 'vendor', S.reibeV, Math.PI); }
    food('halvehahn', [br[0] - 6.5, br[1] - 0.6]); food('koelsch', [br[0] - 4.5, br[1] - 0.6]); food('himmelunaed', [br[0] + 5.5, br[1] - 0.6]);
    food('ananaskuchen', [gsf[0] - 0.6, gsf[1] - 2.2]);
    /* NO AFTERLIFE: the counter, its people */ if (S.bar) { act('bar', 'bar', S.bar, 2.0); try { if (typeof barBuild === 'function') barBuild(C); } catch (e) { if (window.console) console.error('koeln bar', e); if (window.ISLE_TEST) throw e; } }
    try { koTrainBuild(C); } catch (e) { if (window.console) console.error('koeln sites', e); if (window.ISLE_TEST) throw e; }
    W.ring = koRing(); }
  /* the board: its tiles stand only where one can stand */
  tileBlocked = function (x, z, m) { var T = koT(); if (!T) return false; var y = KOELN3D.groundAt(T, x, z, 0.62); return [[0, 0], [m, 0], [-m, 0], [0, m], [0, -m]].some(function (d) { return !KOELN3D.walkable(T, x + d[0], z + d[1], y); }); };
  var _buildTilesK = buildTiles; buildTiles = function () { koWorld(); if (!W.ring) W.ring = koRing(); return _buildTilesK(); };
  /* the nearest "station" is the nearest practice site */
  nearestStation = function () { var b = STIDS[0], bd = 1e9; STIDS.forEach(function (id) { var p = W.places[id]; if (!p) return; var d = Math.hypot(p.x - pos.x, p.z - pos.z); if (d < bd) { bd = d; b = id; } }); return b; };
