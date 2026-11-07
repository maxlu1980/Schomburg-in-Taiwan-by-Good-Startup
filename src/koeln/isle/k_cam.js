  /* ===== ISLE part K11 (Köln): the camera that frames the city. The arm keeps its clear line to Mira (walls, piers, the station's columns,
     a train beside her pull it in; it slides round a pillar), and the city's places set its length and angle: under the cathedral's vaults
     it stays low and looks up into the height; on the Domplatte it tilts up when she faces the cathedral, so the front rises over her;
     in the station's hall and on the bridge it shows the roof's arches and the bridge's above her. In the passages under the tracks and
     on the stairs it lines up with them (the station lies thirty degrees off east–west). ===== */
  var KCAM = { up: 0, f: 0, tmp: null, dir: null };
  TKV.dom = [5.6, 0.1]; TKV.domPl = [8.2, 0.24]; TKV.bridge = [6.4, 0.2];
  /* how far the aim rises over her head (units) in each place */
  var KCAM_UP = { dom: 1.9, domPl: 3.4, big: 1.0, bridge: 0.9, hall: 0.5 };
  function kcamFacing(T) { /* 0…1: how squarely the camera looks at the cathedral (from the Domplatte) */
    var D = T.DOM; if (!D) return 0; var c = T.toW((D.x0 + D.x1) / 2, 0, 0), dx = c.x - cam.position.x, dz = c.z - cam.position.z, L = Math.hypot(dx, dz) || 1;
    var fw = KCAM.dir || (KCAM.dir = new THREE.Vector3()); cam.getWorldDirection(fw); var fl = Math.hypot(fw.x, fw.z) || 1, d = (fw.x * dx + fw.z * dz) / (fl * L);
    var near = 1 - Math.max(0, Math.min(1, (L - 90) / 80)); return Math.max(0, Math.min(1, (d - 0.15) / 0.6)) * near; }
  var _tkCameraK = tkCamera; tkCamera = function (dt, snap) {
    if (TK && TK.id === 'koeln' && TC.zone === 'domPl') { var f0 = KCAM.f; TKV.domPl[1] = 0.26 - 0.14 * f0; TKV.domPl[0] = 8.2 + 1.6 * f0; }
    /* pressed against a wall with no room behind her (a passage's side, a pillar, a corner) while nobody steers the view: look round for the
       freest direction — along the passage or the stair first — and swing there */
    if (TK && TK.id === 'koeln' && !snap && TC.d != null && TC.dd != null && TC.d < Math.min(1.4, TC.dd * 0.4) && CAM.userT <= 0 && !orbit && !gest && !CAM.rot && TC.yawGoal == null && Math.hypot(vel.x, vel.z) < 0.6) { KCAM.stuck = (KCAM.stuck || 0) + dt;
      if (KCAM.stuck > 0.35) { KCAM.stuck = 0; var o = tkL(CAM.tgt), Bn = tkNear(o, 9), ax = TKM.camAx && (TC.zone === 'pass' || TC.zone === 'stair') ? TKM.camAx(TC.zone) : CAM.yaw, best = null, bs = -1e9, kk;
        for (kk = 0; kk < 8; kk++) { var yw = ax + kk * Math.PI / 4, fr = Math.min(TC.dd, tkFree(o, tkDir(yw, Math.max(0.1, TC.p || 0.2)), TC.dd, Bn)), sc = fr - 0.25 * Math.abs(adiff(yw, CAM.yaw)) + (kk % 4 === 0 ? 0.4 : 0); if (sc > bs) { bs = sc; best = yw; } }
        if (best != null && Math.abs(adiff(best, CAM.yaw)) > 0.2) TC.yawGoal = CAM.yaw + adiff(best, CAM.yaw); } } else KCAM.stuck = 0;
    _tkCameraK(dt, snap); if (!TK || TK.id !== 'koeln') return;
    var z = TC.zone, T = TK.T, fac = z === 'domPl' ? kcamFacing(T) : 1; KCAM.f += (fac - KCAM.f) * (snap ? 1 : Math.min(1, dt * 1.2));
    var want = (KCAM_UP[z] || 0) * (z === 'domPl' ? KCAM.f : 1) * Math.min(1, (TC.d || 0) / 3.2); /* close to her the aim stays on her */
    if (CAM.userT > 0) want *= 0.5; /* the player's own tilt is respected */
    KCAM.up += (want - KCAM.up) * (snap ? 1 : Math.min(1, dt * 1.6));
    if (KCAM.up > 0.02) { var tg = KCAM.tmp || (KCAM.tmp = new THREE.Vector3()); tg.set(CAM.tgt.x, CAM.tgt.y + KCAM.up, CAM.tgt.z); cam.lookAt(tg);
      cam.getWorldDirection(TC.fw); KIT.U.uSeeC.value.copy(cam.position); KIT.U.uSeeP.value.copy(cam.position).addScaledVector(TC.fw, -0.01); } };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.cam = function () { return { zone: TC.zone, d: TC.d && +TC.d.toFixed(2), p: TC.p && +TC.p.toFixed(2), up: +KCAM.up.toFixed(2), f: +KCAM.f.toFixed(2), yaw: +CAM.yaw.toFixed(2), vis: !!(luna && luna.root.visible), fov: +cam.fov.toFixed(1) }; };
  /* the view's depth: on a clear day the far bank, the bridge's whole length and the cathedral from Deutz stand sharp; cloud, rain, snow
     and fog close the distance in */
  var KVIEW = { fog: function () { if (!TK || TK.id !== 'koeln' || !W.wxState) return null; var s = W.wxState() || {}, k = Math.max(0, Math.min(1, (s.cloud || 0) * 0.2 + (s.rain || 0) * 0.55 + (s.fog || 0) * 1.1 + (s.snow || 0) * 0.6));
    return [300 - 240 * k, 3400 - 3000 * k]; } };
  /* the river's tick: the ships go on their way (with a slight roll), the water learns where they are (their wakes), and its sky, its haze
     and the rain's rings follow the weather */
  var KRIV = { t: 0, zc: null };
  function krivTick(dt) { if (!TK || TK.id !== 'koeln' || !TK.T) return; var T = TK.T, m = T.water && T.water.material; if (!m || !m.uniforms || !m.uniforms.uShip) return; var u = m.uniforms; KRIV.t += dt;
    (T.ships || []).forEach(function (sp, i) { sp.z += sp.dir * sp.v * dt; if (sp.z > 1450) sp.z = -1450; if (sp.z < -1450) sp.z = 1450; var w = T.toW(sp.x, 0, sp.z); sp.g.position.set(sp.x, T.WATER + Math.sin(KRIV.t * 0.7 + i) * 0.04, sp.z); /* (local: the river's group hangs under the city's root) */ sp.g.rotation.z = Math.sin(KRIV.t * 0.5 + i * 2) * 0.006;
      if (i < 3) { u.uShip.value[i].set(w.x, w.z, sp.dir, sp.L); u.uShipW.value[i] = Math.min(1, sp.v / 3.0); } });
    if (W.fog) { u.uFogN.value = W.fog.near; u.uFogF.value = W.fog.far; u.uFog.value.copy(W.fog.color); u.uSky.value.copy(W.fog.color); u.uZen.value.copy(W.fog.color).multiply(KRIV.zc || (KRIV.zc = new THREE.Color(0.55, 0.72, 1.0))); }
    var s = W.wxState ? W.wxState() : null; if (s) { u.uRain.value += ((s.rain || 0) - u.uRain.value) * Math.min(1, dt); u.uWind.value = 0.35 + Math.min(1, (s.wind || 0) / 10) * 0.65; } }
  var _extraTickRiv = extraTick; extraTick = function (dt, ts) { _extraTickRiv(dt, ts); try { krivTick(dt); } catch (e) { if (window.ISLE_TEST) throw e; } };
  window.ISLE_x.river = function () { var T = TK && TK.T; if (!T || !T.ships) return null; return T.ships.map(function (s) { return [s.kind, Math.round(s.x), Math.round(s.z), s.dir]; }); };
