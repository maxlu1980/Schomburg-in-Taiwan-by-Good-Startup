  /* ===== ISLE part K9 (Köln): the police without a stall, and the heavy unit where she can see it.
     (V67) Two faults made the game crawl at a few frames a second once she was wanted: an officer whose way could not be found searched
     again on the very next frame (and the next …), each search up to 60 000 steps; and the heavy unit's van stopped on the nearest of the
     few through-roads, often a hundred metres off, so its five officers spent the whole chase searching for a way that was never found and
     were never seen. Now an officer's search is bounded, one at most every few frames, a failed one is not repeated for a while (the officer
     heads straight on meanwhile); the van draws up on a street she can see, close by; where no van can come (the station hall, the bridge,
     a plaza, the cathedral) the officers come on foot the way she came. ===== */
  var KPOL = { cap: 0, gap: 0, ms: 0, fail: new Map(), cur: null, n: 0, tot: 0, max: 0, M: null, trail: [], tt: 0, last: null };
  /* ---- the officers' way-finding: bounded and spaced out ---- */
  var _tkPathP = tkPath; tkPath = function (wx, wz, wy, fromL, localOut) { var n = KPOL.cur; if (!n || !fromL || !localOut || !TK || !TK.T) return _tkPathP.apply(this, arguments);
    var g = TK.T.toL(wx, wz), gy = wy == null ? fromL[1] : wy - TK.y, key = Math.round(fromL[0] / 2.5) + ',' + Math.round(fromL[2] / 2.5) + ',' + Math.round(fromL[1]) + '>' + Math.round(g[0] / 2.5) + ',' + Math.round(g[1] / 2.5) + ',' + Math.round(gy), now = performance.now() / 1000, f = KPOL.fail.get(key), straight = [[fromL[0], fromL[1], fromL[2]], [g[0], gy, g[1]]];
    /* searched in vain a moment ago from here to there, or another officer searched this frame: straight on, and look again soon */
    if (f != null && now - f < 5) { n.replan = 1.6 + Math.random() * 1.2; return straight; }
    /* her own way is the cheapest: from the nearest point of it that the officer can walk to straight, along it to the goal */
    var tw = kpolAlong(fromL, [g[0], gy, g[1]]); if (tw) { n.replan = 2.2 + Math.random() * 0.8; return tw; }
    if (KPOL.gap > 0 || KPOL.ms > 6) { n.replan = 0.25 + Math.random() * 0.35; return straight; }
    /* the coarse, bucketed grid (a few milliseconds where the fine one takes hundreds), and a bounded number of steps */ var keepPO = TKPO; TKPO = { cs: 0.5 }; KPOL.cap = 1500; var t0 = performance.now(), r = null; try { r = _tkPathP.apply(this, arguments); } catch (e) { r = null; } KPOL.cap = 0; TKPO = keepPO;
    var d = performance.now() - t0; KPOL.ms += d; KPOL.n++; KPOL.tot += d; if (d > KPOL.max) KPOL.max = d; KPOL.gap = 2 + Math.min(10, Math.floor(d / 3));
    if (!r || r.length < 2) { if (KPOL.fail.size > 300) KPOL.fail.clear(); KPOL.fail.set(key, now); n.replan = 1.6 + Math.random() * 1.2; return straight; } return r; };
  function kpolAlong(a, goal) { var Tr = KPOL.trail, i, C = [], gi = -1, gd = 1e9; if (Tr.length < 2) return null;
    for (i = 0; i < Tr.length; i++) { var q = Tr[i], dg = Math.hypot(q[0] - goal[0], q[2] - goal[2]) + Math.abs(q[1] - goal[1]) * 3; if (dg < gd) { gd = dg; gi = i; } C.push([Math.hypot(q[0] - a[0], q[2] - a[2]) + Math.abs(q[1] - a[1]) * 4, i]); }
    if (gd > 6) return null; C.sort(function (p, q) { return p[0] - q[0]; });
    for (var k = 0; k < Math.min(6, C.length); k++) { var j = C[k][1]; if (j > gi || C[k][0] > 40) continue; if (!segClear(a, Tr[j])) continue; var way = [[a[0], a[1], a[2]]]; for (i = j; i <= gi; i++) way.push(Tr[i].slice()); way.push([goal[0], goal[1], goal[2]]); return way; }
    return null; }
  var _copTickP = copTick; copTick = function (n, dt) { KPOL.cur = n; try { return _copTickP(n, dt); } finally { KPOL.cur = null; } };
  /* ---- the way she came: a trail of points (every metre or so of her last walk), for officers who come on foot ---- */
  function kpolTrail(dt) { if (!gsOn() || !GS.built || GS.car || !luna || !luna.root.visible) return; KPOL.tt -= dt; if (KPOL.tt > 0) return; KPOL.tt = 0.25; var Lu = gL(), Tr = KPOL.trail, l = Tr.length ? Tr[Tr.length - 1] : null;
    if (l && (Math.hypot(Lu[0] - l[0], Lu[2] - l[2]) > 8 || Math.abs(Lu[1] - l[1]) > 1.2)) { Tr.length = 0; l = null; } /* a jump (a ride, a teleport): a new trail */
    if (!l || Math.hypot(Lu[0] - l[0], Lu[2] - l[2]) > 0.9) { Tr.push([Lu[0], Lu[1], Lu[2]]); if (Tr.length > 140) Tr.shift(); } }
  var _framePol = frame; frame = function (now) { KPOL.ms = 0; if (KPOL.gap > 0) KPOL.gap--; _framePol(now); };
  var _extraTickPol = extraTick; extraTick = function (dt, ts) { _extraTickPol(dt, ts); try { if (TK && TK.id === 'koeln') kpolTrail(dt); } catch (e) { if (window.ISLE_TEST) throw e; } };
  /* ---- the van and the five officers are made once (ahead, while she stands still) and kept ---- */
  function kpolBuild() { var T = TK.T; if (!KPOL.M || KPOL.M.T !== T) { var van = dxVanMesh(); T.root.add(van.g); van.g.visible = false; var men = []; for (var i = 0; i < 5; i++) men.push(dxTrooper(i, 0, 0)); KPOL.M = { van: van, men: men, T: T }; } return KPOL.M; }
  function kpolSee(L, y) { var w = TK.T.toW(L[0], (y || 0) + 1, L[1]), v = new THREE.Vector3(w.x, w.y, w.z).project(cam); return v.z < 1 && Math.abs(v.x) < 0.82 && Math.abs(v.y) < 0.8; }
  /* a van can drive here: the street's own level, walkable, no hall, bridge or plaza, a lane's width clear */
  function kpolLane(x, z, ux, uz) { var T = TK.T, Y = T.Y1 != null ? T.Y1 : 0.12, k; for (k = -1; k <= 1; k++) { var px = x - uz * 1.15 * k, pz = z + ux * 1.15 * k, y = gGround(px, pz, Y); if (Math.abs(y - Y) > 0.3 || !gWalk(px, pz, y) || (T.noDriveFn && T.noDriveFn(T, px, pz))) return false; } return true; }
  function kpolDrive(P, ux, uz, back, fwd) { for (var s = -back; s <= fwd; s += 2) if (!kpolLane(P[0] + ux * s, P[1] + uz * s, ux, uz)) return false; return true; }
  /* where the van stops: 10–20 m from her on a street at her level, the way from its door to her open, a straight run in and out along the street; one she can see first */
  function kpolPlace(Lu) { var T = TK.T, Y = T.Y1 != null ? T.Y1 : 0.12; if (Math.abs(Lu[1] - Y) > 0.6) return null; var C = [], R = [9, 12, 15, 18], i, j;
    for (i = 0; i < R.length; i++) for (j = 0; j < 24; j++) { var a = j / 24 * Math.PI * 2, x = Lu[0] + Math.sin(a) * R[i], z = Lu[2] + Math.cos(a) * R[i]; C.push({ x: x, z: z, a: a, r: R[i], s: (kpolSee([x, z]) ? 10 : 0) - Math.abs(R[i] - 12) * 0.2 + Math.random() * 0.5 }); }
    C.sort(function (p, q) { return q.s - p.s; });
    for (i = 0; i < C.length; i++) { var c = C[i], y = gGround(c.x, c.z, Y); if (Math.abs(y - Y) > 0.3 || !gWalk(c.x, c.z, y)) continue; if (!segClear([c.x, y, c.z], [Lu[0], Lu[1], Lu[2]])) continue;
      /* the street runs across her line of sight to the van (or near it) */ var rx = (c.x - Lu[0]) / c.r, rz = (c.z - Lu[2]) / c.r, tw = [[rz, -rx], [-rz, rx], [rz * 0.87 - rx * 0.5, -rx * 0.87 - rz * 0.5], [-rz * 0.87 - rx * 0.5, rx * 0.87 - rz * 0.5]];
      for (j = 0; j < tw.length; j++) { var ux = tw[j][0], uz = tw[j][1], ul = Math.hypot(ux, uz); ux /= ul; uz /= ul; if (kpolDrive([c.x, c.z], ux, uz, 34, 30)) return { P: [c.x, c.z], u: [ux, uz], see: c.s >= 9 }; } }
    return null; }
  /* on foot: from a point of the way she came, 15–30 m back along it (they follow it); else from an open point round her at her level */
  function kpolFoot(Lu) { var Tr = KPOL.trail, i, len = 0, best = null; for (i = Tr.length - 1; i > 0; i--) { len += Math.hypot(Tr[i][0] - Tr[i - 1][0], Tr[i][2] - Tr[i - 1][2]); if (len >= 15) { best = i - 1; if (!kpolSee([Tr[i - 1][0], Tr[i - 1][2]], Tr[i - 1][1]) || len > 26) break; } if (len > 30) break; }
    if (best != null) { var way = Tr.slice(best).map(function (q) { return q.slice(); }); way.push([Lu[0], Lu[1], Lu[2]]); return { S: Tr[best].slice(), way: way }; }
    for (var r = 12; r <= 20; r += 4) for (var j = 0; j < 16; j++) { var a = j / 16 * Math.PI * 2, x = Lu[0] + Math.sin(a) * r, z = Lu[2] + Math.cos(a) * r, y = gGround(x, z, Lu[1]); if (Math.abs(y - Lu[1]) < 0.5 && gWalk(x, z, y) && segClear([x, y, z], Lu)) return { S: [x, y, z], way: null }; }
    return { S: [Lu[0], Lu[1], Lu[2]], way: null, near: true }; }
  var _dxSquadP = dxSquad; dxSquad = function () { if (!TK || TK.id !== 'koeln' || !TK.T) return _dxSquadP(); var Q = DXO.sq, T = TK.T, Lu = gL(), M = kpolBuild(); Q.van = M.van; Q.men = M.men; Q.T = T;
    var pl = null; try { pl = kpolPlace(Lu); } catch (e) { pl = null; } Q.t = 0; Q.dep = 0; Q.sk = false; Q.van.door.rotation.y = 0; Q.way = null; Q.lvl = null;
    if (pl) { /* the van: in along the street, stopping beside her */ var ux = pl.u[0], uz = pl.u[1]; Q.foot = false; Q.a = [pl.P[0] - ux * 34, pl.P[1] - uz * 34]; Q.b = [pl.P[0], pl.P[1]]; Q.h = Math.atan2(ux, uz); Q.st = 'drive'; Q.van.g.visible = true; Q.van.g.position.set(Q.a[0], 0, Q.a[1]); Q.van.g.rotation.set(0, Q.h, 0);
      /* it is shown: if it stops where the camera does not look, the camera turns (unless she is turning it herself) */ if (!pl.see && !(CAM.userT > 0)) { var w0 = T.toW(Lu[0], 0, Lu[2]), w1 = T.toW(pl.P[0], 0, pl.P[1]); TC.yawGoal = Math.atan2(w0.x - w1.x, w0.z - w1.z) + 0.35; }
      DXS.play('brake', 0.6); }
    else { /* on foot, the way she came */ var F = kpolFoot(Lu); Q.foot = true; Q.van.g.visible = false; Q.h = 0; Q.b = [F.S[0], F.S[2] + 2.9]; Q.a = Q.b.slice(); Q.lvl = F.S[1]; Q.way = F.way; Q.st = 'deploy'; }
    var e = dxFx(); if (e) e.classList.add('is-lbox'); banner(dxn('sq'), dxn('sqS')); try { sirenOn(); } catch (x) {} };
  /* the officers step out at her level (the van's door, or the point on her way), and those on foot follow that way to her */
  var _dxSquadStepP = dxSquadStep; dxSquadStep = function (dt) { var Q = DXO.sq, d0 = Q.dep || 0; _dxSquadStepP(dt); if (!Q.men || !(Q.dep > d0)) return; for (var i = d0; i < Q.dep; i++) { var n = Q.men[i], R = n.A.root;
      if (Q.lvl != null) R.position.y = gGround(R.position.x, R.position.z, Q.lvl); if (Q.way && Q.way.length > 1) { n.path = Q.way.map(function (q) { return [q[0] + (Math.random() - 0.5) * 0.5, q[1], q[2] + (Math.random() - 0.5) * 0.5]; }); n.path[0] = [R.position.x, R.position.y, R.position.z]; n.pk = 1; n.replan = 5 + i * 0.4; } } };
  /* made ahead, while she stands still (the first appearance no longer stalls) */
  var _kpwStepsP = kpwSteps; kpwSteps = function () { var S = _kpwStepsP(); S.splice(Math.max(0, S.length - 2), 0, function () { if (!TK || TK.id !== 'koeln' || typeof dxVanMesh !== 'function') return; var M = kpolBuild(); kpwShow(M.van.g); M.men.forEach(function (n) { kpwShow(n.A.root); }); }); return S; };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.pol = function (reset) { var Q = DXO.sq, Lu = gL(), o = { n: KPOL.n, ms: Math.round(KPOL.tot), max: Math.round(KPOL.max), fails: KPOL.fail.size, trail: KPOL.trail.length, st: Q.st || 'none', foot: !!Q.foot };
    if (Q.van && Q.st && Q.st !== 'none') { var vp = Q.van.g.position; o.van = Math.round(Math.hypot(vp.x - Lu[0], vp.z - Lu[2])); o.vanSeen = Q.foot ? null : kpolSee([vp.x, vp.z]); o.men = Q.men.filter(function (n) { return !n.gone; }).map(function (n) { var l = nL(n); return Math.round(Math.hypot(l[0] - Lu[0], l[2] - Lu[2])) + (kpolSee([l[0], l[2]], l[1]) ? '*' : ''); }).join(' '); }
    if (reset) { KPOL.n = 0; KPOL.tot = 0; KPOL.max = 0; } return o; };
