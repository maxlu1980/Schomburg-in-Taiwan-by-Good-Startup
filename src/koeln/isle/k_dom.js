  /* ===== ISLE part K10 (Köln): the cathedral from inside. The windows glow with the hour's daylight (dim, warm from the floodlights
     outside, at night); where the real sun stands — its height and direction now, in Köln — it shines through the windows that face it, the
     beams falling through the dusty air onto the floor in the glass's colours; under clouds or rain, none. Inside, the sky's light comes in
     only through the windows: Mira and the others are lit as the walls are. The rain stays outside the roofs. ===== */
  var KDOM = { t: 0, k: 0, sd: null, inst: false, inP: false };
  function kdSm(x, a, b) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function kdomIn(RT, x, z) { var B = RT.IN.bld, i; for (i = 0; i < B.length; i++) { var r = B[i]; if (x > r[0] && x < r[1] && z > r[2] && z < r[3]) return true; } return false; }
  function kdomTick(dt) { if (!TK || TK.id !== 'koeln' || !TK.T || !TK.T.domRT || typeof W === 'undefined' || !W) return; var RT = TK.T.domRT, s = W.wxState ? W.wxState() : null, sun = s && s.sun, alt = sun && sun.alt != null ? sun.alt : 30, dir = sun && sun.dir ? sun.dir : [0.3, 0.8, 0.4];
    var sd = KDOM.sd || (KDOM.sd = new THREE.Vector3()); sd.set(dir[0], dir[1], dir[2]).normalize();
    var cloud = s ? Math.min(1, s.cloud + s.rain * 0.6 + s.fog * 0.6 + s.snow * 0.5) : 0.2, clear = Math.max(0, 1 - Math.pow(cloud, 1.3) * 1.1) * kdSm(alt, 0.5, 7), day = kdSm(alt, -8, 12) * (1 - 0.42 * cloud), night = 1 - kdSm(alt, -9, 1);
    if (!RT.lim) { var mob = (typeof COARSE !== 'undefined' && COARSE) || (typeof TIER !== 'undefined' && TIER === 'low'); RT.lim = mob ? 6 : (typeof TIER !== 'undefined' && TIER !== 'high') ? 8 : 12; RT.ns = mob ? 5 : (typeof TIER !== 'undefined' && TIER !== 'high') ? 6 : 8; } /* (the beams by the device) */
    KDOM.t += dt; RT.tick({ cam: cam.position, sun: sd, elev: alt, clear: clear, day: day, night: night, t: KDOM.t });
    var Lp = TK.T.toL(pos.x, pos.z); KDOM.inP = kdomIn(RT, Lp[0], Lp[1]); var want = (KDOM.inP && luna && luna.root.visible) || RT.inside ? 1 : 0; KDOM.k += (want - KDOM.k) * Math.min(1, dt * 3); }
  /* the sky's light under the vaults (hooked in on the first frame that has the world) */
  function kdomInstall() { if (KDOM.inst || typeof W === 'undefined' || !W || !W.skyTick) return; KDOM.inst = true; var _sk = W.skyTick, c1 = new THREE.Color(); W.skyTick = function (dt, now) { _sk(dt, now); var k = KDOM.k; if (!TK || TK.id !== 'koeln' || k < 0.01) return; W.hemi.intensity *= 1 - 0.5 * k; W.hemi.color.lerp(c1.setRGB(0.98, 0.9, 0.78), 0.25 * k); W.sun.intensity *= 1 - 0.72 * k; }; }
  var _extraTickDom = extraTick; extraTick = function (dt, ts) { _extraTickDom(dt, ts); try { kdomInstall(); kdomTick(dt); } catch (e) { if (window.ISLE_TEST) throw e; } };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.dom = function () { var RT = TK && TK.T && TK.T.domRT; if (!RT) return null; return { near: RT.near, inside: RT.inside, inP: KDOM.inP, k: +KDOM.k.toFixed(2), beams: RT.sg.visible ? RT.beams.length : 0, wins: RT.IN.wins.length, amb: +RT.U.uInAmb.value.toFixed(2), glass: { day: +RT.MI.gl.uniforms.uDay.value.toFixed(2), sun: +RT.MI.gl.uniforms.uSunK.value.toFixed(2) } }; };
  /* the cathedral's inside is made ready ahead (while she stands still, with the other prewarming): its materials and the beams' two
     shaders are compiled once, so entering it does not stall */
  var _kpwStepsDom = kpwSteps; kpwSteps = function () { var S = _kpwStepsDom(); S.splice(Math.max(0, S.length - 2), 0, function () { var RT = TK && TK.T && TK.T.domRT; if (!RT || !RT.MI) return; var gv = RT.gi.visible, tmp = [];
      try { if (RT.mkShaft && RT.ns) { var m1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), RT.mkShaft()), m2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), RT.mkPool()); [m1, m2].forEach(function (m) { m.position.copy(cam.position); m.scale.setScalar(1e-3); scene.add(m); tmp.push(m); }); }
        RT.gi.visible = true; var rt = R3.getRenderTarget(); R3.setRenderTarget(POST && POST.target ? POST.target : null); R3.compile(scene, cam); R3.setRenderTarget(rt); } catch (e) { if (window.ISLE_TEST) throw e; }
      RT.gi.visible = gv; tmp.forEach(function (m) { scene.remove(m); m.geometry.dispose(); KDOM.keep = KDOM.keep || []; KDOM.keep.push(m.material); }); }); return S; };
