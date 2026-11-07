  /* ===== ISLE part K3 (Köln): the radar of the city, the names of where she is ===== */
  /* the radar: Köln drawn once from its plan — the Rhine, the pavements, the streets, the blocks, the cathedral, the station and its
     platforms (the level she is on: the street, or the platforms up on the embankment) */
  var _radarMapCityK = radarMapCity; radarMapCity = function (T) { if (!TK || TK.id !== 'koeln') return _radarMapCityK(T);
    RM.x0 = T.MAPX[0]; RM.x1 = T.MAPX[1]; RM.z0 = T.MAPZ[0]; RM.z1 = T.MAPZ[1]; RM.k = 1.5; var k = RM.k;
    function cv() { var c = document.createElement('canvas'); c.width = Math.round((RM.x1 - RM.x0) * k); c.height = Math.round((RM.z1 - RM.z0) * k); return c; }
    function painter(g) { return { R: function (q, col) { g.fillStyle = col; g.fillRect((Math.min(q[0], q[1]) - RM.x0) * k, (Math.min(q[2], q[3]) - RM.z0) * k, Math.abs(q[1] - q[0]) * k, Math.abs(q[3] - q[2]) * k); },
      P: function (pts, col, stroke) { g.beginPath(); pts.forEach(function (p, i) { var x = (p[0] - RM.x0) * k, y = (p[1] - RM.z0) * k; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); if (stroke) { g.strokeStyle = col; g.lineWidth = stroke; g.stroke(); } else { g.fillStyle = col; g.fill(); } } }; }
    var c = cv(), g = c.getContext('2d'), D = painter(g);
    D.R([RM.x0, RM.x1, RM.z0, RM.z1], '#2a2e33'); D.R([T.QW, T.QE, RM.z0, RM.z1], '#24425e');
    T.rd.walk.forEach(function (q) { D.R(q, '#5f6770'); }); T.rd.road.forEach(function (q) { D.R(q, '#3b4047'); });
    if (T.DOMPL) D.R(T.DOMPL, '#6c747c'); if (T.VORPL) D.R(T.VORPL, '#6c747c'); if (T.RONC) D.R(T.RONC, '#6c747c'); if (T.HBP) D.R(T.HBP, '#6c747c'); if (T.BRES) D.R(T.BRES, '#6c747c');
    if (T.RGART) D.R(T.RGART, '#3f5a44');
    T.rd.bld.forEach(function (q) { D.R(q, '#1b1e22'); }); (T.rd.stn || []).forEach(function (q) { D.R(q, '#8a7a62'); }); (T.rd.pol || []).forEach(function (q) { D.R(q, '#2f4f8a'); });
    /* the cathedral */ var Dm = T.DOM; if (Dm) { var dc = '#9a8f80'; D.R([Dm.x0, Dm.tw[1], -Dm.tz, Dm.tz], dc); D.R([Dm.tw[1], Dm.ax, -Dm.zA, Dm.zA], dc); D.R([Dm.tr[0], Dm.tr[1], -Dm.zT, Dm.zT], dc); g.fillStyle = dc; g.beginPath(); g.arc((Dm.ax - RM.x0) * k, -RM.z0 * k, Dm.zA * k, -Math.PI / 2, Math.PI / 2); g.fill(); }
    /* the station's hall and the bridge's deck */ if (T.HBR) D.P(T.HBR, '#8a7a62'); D.R([T.BRX[0], T.BRX[1], T.BRZ[0], T.BRZ[1]], '#5a5148');
    RM.c = c; GS.rmc = c;
    /* up on the embankment: the platforms and the tracks under the hall */
    var c2 = cv(), g2 = c2.getContext('2d'), D2 = painter(g2); g2.fillStyle = '#16181b'; g2.fillRect(0, 0, c2.width, c2.height);
    if (T.HBR) D2.P(T.HBR, '#2a2e33'); var Pl = KOELN3D.plan; if (Pl && Pl.HP && T.hW) Pl.HP.forEach(function (pp) { var u0 = -Pl.HB.hl, u1 = Pl.HB.hl, a = T.hW(u0, pp[0]), b = T.hW(u1, pp[0]), cc = T.hW(u1, pp[1]), d = T.hW(u0, pp[1]); D2.P([a, b, cc, d], '#6a737c'); });
    D2.R([T.BRX[0], T.BRX[1], T.BRZ[0], T.BRZ[1]], '#3b4047');
    RM.lvK = [c, c2]; RM.lv = [c, c, c]; RM.lvT = T; T.B1Y = T.B2Y = -1e9; };
  /* the radar follows her: up on the platforms (or the rails' embankment) the second picture */
  var _radarDrawK = radarDraw; radarDraw = function () { if (RM.lvK && TK && TK.id === 'koeln' && TK.T === RM.lvT) { var T = TK.T, y = pos.y - TK.y, cc = (y > T.TY - 1.2 && koInHall(pos.x, pos.z)) ? RM.lvK[1] : RM.lvK[0]; RM.lv = [cc, cc, cc]; } return _radarDrawK(); };
  function koInHall(x, z) { var T = koT(); if (!T || !T.HBR) return false; var P2 = T.HBR, inside = false; for (var i = 0, j = P2.length - 1; i < P2.length; j = i++) { var a = P2[i], b = P2[j]; if (((a[1] > z) !== (b[1] > z)) && (x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside; } return inside; }
  /* ---------- the map of Köln: the plan drawn once (the Rhine, the squares, the blocks, the cathedral, the station, the bridge), the
     Domrunde's round, the practice sites, the places, the defects, Mira; tap a site or a place to go there ---------- */
  var KMAPC = null;
  function koMapCanvas(T, k) { if (KMAPC) return KMAPC; var x0 = T.MAPX[0], z0 = T.MAPZ[0], c = document.createElement('canvas'); c.width = Math.round((T.MAPX[1] - x0) * k); c.height = Math.round((T.MAPZ[1] - z0) * k); var g = c.getContext('2d');
    function R(q, col) { g.fillStyle = col; g.fillRect((Math.min(q[0], q[1]) - x0) * k, (Math.min(q[2], q[3]) - z0) * k, Math.abs(q[1] - q[0]) * k, Math.abs(q[3] - q[2]) * k); }
    function Pg(pts, col) { g.fillStyle = col; g.beginPath(); pts.forEach(function (p, i) { var x = (p[0] - x0) * k, y = (p[1] - z0) * k; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); g.fill(); }
    R([T.MAPX[0], T.MAPX[1], T.MAPZ[0], T.MAPZ[1]], '#efe6d6'); R([T.QW, T.QE, T.MAPZ[0], T.MAPZ[1]], '#8fc3dc'); R([T.LPR[0], T.QW, T.MAPZ[0], T.MAPZ[1]], '#e2d7c2'); R([T.QE, T.RSTEP[1], T.MAPZ[0], T.MAPZ[1]], '#e2d7c2');
    T.rd.walk.forEach(function (q) { R(q, '#f6efe2'); }); T.rd.road.forEach(function (q) { R(q, '#cfc6b6'); }); if (T.RGART) R([T.RGART[0], T.RGART[1], T.RGART[2], 196], '#c5d8a8');
    T.rd.bld.forEach(function (q) { R(q, '#b9ab98'); }); (T.rd.pol || []).forEach(function (q) { R(q, '#6f8fc8'); }); if (T.HBR) Pg(T.HBR, '#a39278');
    var Dm = T.DOM; if (Dm) { var dc = '#7a6a58'; R([Dm.x0, Dm.tw[1], -Dm.tz, Dm.tz], dc); R([Dm.tw[1], Dm.ax, -Dm.zA, Dm.zA], dc); R([Dm.tr[0], Dm.tr[1], -Dm.zT, Dm.zT], dc); g.fillStyle = dc; g.beginPath(); g.arc((Dm.ax - x0) * k, -z0 * k, Dm.zA * k, -Math.PI / 2, Math.PI / 2); g.fill(); }
    R([T.BRX[0], T.BRX[1], T.BRZ[0], T.BRZ[1]], '#6a5e52'); if (T.BAR) R(T.BAR, '#4a3a5a'); KMAPC = c; return c; }
  mapCard = function () { var T = koT(); if (!T) return; var S = 2, cw = 380, ch = Math.round(cw * (T.MAPZ[1] - T.MAPZ[0]) / (T.MAPX[1] - T.MAPX[0])), k = cw * S / (T.MAPX[1] - T.MAPX[0]);
    var PL = ['lab', 'gs', 'shrine', 'diner', 'temple', 'twinHeart', 'taitung', 'dlc'], h = '<h2>' + esc(t('mapT')) + '</h2><div class="isle__map isle__map--k"><canvas id="isMapC" width="' + cw * S + '" height="' + ch * S + '"></canvas></div>' +
      '<h3>' + esc(t('mapStations')) + '</h3><div class="isle__cact isle__cact--grid isle__cact--st">' + STIDS.map(function (id) { return '<button type="button" class="isle__btn isle__btn--small" data-pl="' + id + '"><b>' + esc(lx(STN[id])) + '</b><small>' + esc(dn(id).split(' · ').pop()) + '</small></button>'; }).join('') + '</div>' +
      '<h3>' + esc(t('mapPlaces')) + '</h3><div class="isle__cact isle__cact--grid">' + PL.filter(function (id) { return W.places[id]; }).map(function (id) { var nm = DI[id] ? dn(id) : lx(LN[id]); return '<button type="button" class="isle__btn isle__btn--small" data-pl="' + id + '"><b>' + esc(nm.split(' · ').pop()) + '</b><small>' + esc(nm.indexOf(' · ') > 0 ? nm.split(' · ')[0] : (STN[id] ? lx(STN[id]) : '')) + '</small></button>'; }).join('') + '</div>';
    var C = card(h, 'isle__cin--map'), g = C.querySelector('#isMapC').getContext('2d'); g.drawImage(koMapCanvas(T, k), 0, 0);
    function P2(x, z) { return [(x - T.MAPX[0]) * k, (z - T.MAPZ[0]) * k]; }
    g.setLineDash([8, 6]); g.lineWidth = 2.4; g.strokeStyle = 'rgba(227,0,15,.55)'; g.beginPath(); W.ring.forEach(function (p, i) { var q = P2(p[0], p[1]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); g.stroke(); g.setLineDash([]);
    g.font = '700 ' + 10 * S + 'px Jost, "Noto Sans TC", sans-serif'; g.textBaseline = 'middle';
    function label(x, z, s, col, rad) { var q = P2(x, z); g.fillStyle = col; g.strokeStyle = '#2b2420'; g.lineWidth = 2; g.beginPath(); g.arc(q[0], q[1], rad, 0, 7); g.fill(); g.stroke(); if (s) { var tx2 = q[0] + rad + 4, al = q[0] > cw * S * 0.78; g.textAlign = al ? 'right' : 'left'; if (al) tx2 = q[0] - rad - 4; g.lineWidth = 5; g.strokeStyle = 'rgba(255,248,236,.95)'; g.strokeText(s, tx2, q[1]); g.fillStyle = '#2b2420'; g.fillText(s, tx2, q[1]); g.textAlign = 'left'; } }
    STIDS.forEach(function (id) { var p = W.places[id]; if (p) label(p.x, p.z, dn(id).split(' · ').pop(), '#e3000f', 7); });
    PL.forEach(function (id) { var p = W.places[id]; if (p) label(p.x, p.z, (DI[id] ? dn(id) : lx(LN[id])).split(' · ').pop(), '#ffffff', 5); });
    Object.keys(BOSS).forEach(function (id) { var p = W.places[id]; if (p) label(p.x, p.z, P.boss[id] ? '✓' : P.seen[id] ? lx(BOSS[id].n) : '???', P.boss[id] ? '#55b14a' : '#2b2420', 4); });
    var me = P2(pos.x, pos.z); g.fillStyle = '#0e9fb0'; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(me[0], me[1], 9, 0, 7); g.fill(); g.stroke();
    [].forEach.call(C.querySelectorAll('[data-pl]'), function (b) { b.addEventListener('click', function () { var id = b.getAttribute('data-pl'); cardClose(); fastTravel(id); }); }); };
  /* ---------- navigation in Köln: the training centre and the six sites, the people at their posts, the trains, the places ---------- */
  var _navListK = navList; navList = function () { if (!TK || TK.id !== 'koeln') return _navListK(); var T = TK.T, S = T.spots, out = [], Y = 0.12;
    function add(o, loc) { if (!loc) return; o.L = loc.L || loc; if (loc.face) o.face = loc.face; out.push(o); }
    function person(talk) { return (GS.talkers || []).filter(function (n) { return n.talk === talk; })[0]; }
    var vend = person('vendor'), stf = person('staff'), night = isNight();
    if (S.hq) add({ id: 'lead', cat: 'train', nm: nv('lead'), sub: dn('lab') }, navSpot(T, S.hq, Y));
    KTR.sites.forEach(function (s) { var d = trx(s.cat); add({ id: 'site_' + s.cat, cat: 'train', nm: d[0], sub: d[1] + ' · ' + lx(STN[s.cat]) }, navSpot(T, s.at, s.y - TK.y)); });
    add({ id: 'guard', cat: 'people', nm: nv('guard'), sub: nv('guardS') }, navSpot(T, S.kobanDoor, Y));
    if (vend) add({ id: 'vendor', cat: 'people', nm: gx('c_vendor'), sub: nv('vendorS') }, navSpot(T, S.kioskBuy || S.kiosk, Y) || navNpc(T, vend.A));
    if (stf) add({ id: 'staff', cat: 'people', nm: nv('staff'), sub: nv('staffS') }, navNpc(T, stf.A));
    if (!night && S.gsFront) add({ id: 'max', cat: 'people', nm: 'Max · Good Startup', sub: dn('gs') }, navSpot(T, S.gsFront, Y));
    if (typeof BARN !== 'undefined') BARN.list.forEach(function (n) { var k = n.max ? 'max' : n.talk; if (!k || (k === 'max' && !night)) return; add({ id: 'bar_' + k, cat: 'people', nm: gx('c_' + k), sub: 'NO AFTERLIFE' }, navNpc(T, n.A)); });
    if (S.arrive) add({ id: 'p1', cat: 'transit', nm: nv('p1'), sub: nv('L3') }, navSpot(T, S.arrive, T.TY));
    if (S.ticket) add({ id: 'ticket', cat: 'transit', nm: nv('ticket'), sub: nv('LB1') }, navSpot(T, S.ticket, Y));
    if (S.hbfFront) add({ id: 'hbf', cat: 'transit', nm: nv('hbf'), sub: nv('hbfS') }, navSpot(T, S.hbfFront, Y));
    add({ id: 'dom', cat: 'place', nm: nv('dom'), sub: nv('domS') }, navSpot(T, S.domWest, Y));
    /* (V67) the cathedral from inside: the nave under its vaults, and the Shrine of the Three Kings seen from the ambulatory behind the high altar */
    var DF = 0.55; /* (the cathedral's floor, on its plinth: DOM.fl) */ if (S.domNave) { var lN = navSpot(T, [S.domNave[0] + 6, S.domNave[1]], DF); if (lN) lN.face = [S.domNave[0] + 30, S.domNave[1]]; add({ id: 'domIn', cat: 'place', nm: nv('domIn'), sub: nv('domInS') }, lN); }
    if (S.domAmb) { var lA = navSpot(T, S.domAmb, DF); if (lA) lA.face = [41.6, 0]; add({ id: 'domAmb', cat: 'place', nm: nv('domAmb'), sub: nv('domAmbS') }, lA); }
    if (S.bridgeW) add({ id: 'bridge', cat: 'place', nm: nv('bridge'), sub: nv('bridgeS') }, navSpot(T, S.bridgeW, T.FOOT));
    if (S.brau) add({ id: 'brau', cat: 'place', nm: nv('brau'), sub: nv('brauS') }, navSpot(T, S.brau, Y));
    if (S.barDoor) add({ id: 'bar', cat: 'place', nm: nv('bar'), sub: nv('barS') }, navSpot(T, S.barDoor, Y));
    add({ id: 'koban', cat: 'place', nm: nv('koban'), sub: nv('L0') }, navSpot(T, S.kobanDoor, Y));
    return out; };
  var _navHereK = navHere; navHere = function () { if (CITYW && TK && TK.id === 'koeln' && TK.T && inTK(pos.x, pos.z) && !TKW) return true; return _navHereK(); };
  var _cityTitleK = cityTitle; cityTitle = function () { return TK && TK.id === 'koeln' ? lx(LN.koeln) : _cityTitleK(); };
  var _navLevelK = navLevel; navLevel = function (T, y) { if (TK && TK.id === 'koeln') { return (y > T.TY - 1.2 && koInHall(pos.x, pos.z)) ? nv('L3') : nv('L0'); } return _navLevelK(T, y); };
  /* (V67) arriving in the cathedral, the view swings round behind her: the nave's length before her, or the shrine over the low screen */
  var _navArriveK = navArrive; navArrive = function () { var D = NAV.dst; _navArriveK.apply(this, arguments); if (TK && TK.id === 'koeln' && D && D.face && /^dom/.test(D.id || '')) TC.yawGoal = face + Math.PI; };
