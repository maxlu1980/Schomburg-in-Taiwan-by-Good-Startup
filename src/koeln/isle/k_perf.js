  /* ===== ISLE part K8 (Köln): the frame rate, live, in the bottom-left corner (under the radar): frames per second over the last half
     second, green at 50 and over, amber from 30, red below; shown while the game is being played ===== */
  var KFPS = { n: 0, t0: 0, el: null, worst: 0, last: 0, fps: 0 };
  function kfpsEl() { if (KFPS.el || !root) return KFPS.el; var e = document.createElement('div'); e.id = 'isFps'; e.setAttribute('aria-hidden', 'true');
    e.style.cssText = 'position:absolute;left:calc(10px + env(safe-area-inset-left,0px));bottom:calc(6px + env(safe-area-inset-bottom,0px));z-index:6;pointer-events:none;font:700 11px/1.25 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.02em;padding:2px 7px;border-radius:9px;background:rgba(12,14,18,.58);color:#9ef0b4;font-variant-numeric:tabular-nums;white-space:nowrap';
    e.hidden = true; root.appendChild(e); KFPS.el = e; return e; }
  function kfpsTick(now) { var t = typeof now === 'number' && now > 0 ? now : performance.now(); if (!KFPS.t0) { KFPS.t0 = t; KFPS.last = t; return; }
    var d = t - KFPS.last; KFPS.last = t; if (d > KFPS.worst) KFPS.worst = d; KFPS.n++; var span = t - KFPS.t0; if (span < 500) return;
    var e = kfpsEl(); KFPS.fps = KFPS.n * 1000 / span; var show = isOpen && mode !== 'title' && mode !== 'off' && !document.hidden;
    if (e) { e.hidden = !show; if (show) { var f = Math.round(KFPS.fps); e.textContent = (KFPS.fps < 9.95 ? KFPS.fps.toFixed(1) : f) + ' FPS · ' + (KFPS.worst > 999 ? '999+' : Math.round(KFPS.worst)) + ' ms'; e.style.color = f >= 50 ? '#9ef0b4' : f >= 30 ? '#ffd25a' : '#ff7b7b'; } }
    KFPS.n = 0; KFPS.t0 = t; KFPS.worst = 0; }
  var _frameF = frame; frame = function (now) { _frameF(now); try { kfpsTick(now); } catch (e) {} };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.fps = function () { return { fps: Math.round(KFPS.fps * 10) / 10, el: KFPS.el ? KFPS.el.textContent : null, shown: KFPS.el ? !KFPS.el.hidden : false }; };
  /* ---- the special attacks without a stall: the weapons, the three machines and their effects are built ahead, then each is drawn once,
     tiny, just in front of the camera, so its shaders are compiled and its buffers uploaded before it is ever needed — one piece every few
     frames, only while nothing is happening; a phone otherwise freezes for a moment the first time a machine appears ---- */
  var KPW = { i: 0, wait: 0, warm: [], done: false, keep: [] };
  function kpwFront(par) { var V = new THREE.Vector3(), d = new THREE.Vector3(); cam.getWorldDirection(d); V.copy(cam.position).addScaledVector(d, 2.5); return par ? par.worldToLocal(V) : V; }
  function kpwShow(o) { if (!o) return; var par = o.parent; KPW.warm.push({ o: o, vis: o.visible, pos: o.position.clone(), sc: o.scale.clone() }); o.position.copy(kpwFront(par)); o.scale.setScalar(1e-4); o.visible = true; }
  function kpwRestore() { KPW.warm.forEach(function (w) { w.o.position.copy(w.pos); w.o.scale.copy(w.sc); w.o.visible = w.vis; }); KPW.warm = []; if (KARM.warm) { KARM.warm = false; if (KARM.holder) KARM.holder.scale.setScalar(1); } }
  function kpwSteps() { return [
      function () { armBuild(); },
      function () { if (!KARM.built || !KARM.holder) return; KARM.warm = true; KARM.holder.scale.setScalar(1e-4); KARM.holder.visible = true; Object.keys(KARM.mdl).forEach(function (k) { KARM.mdl[k].g.visible = true; }); },
      function () { var P = aPools(); if (P) [P.tr[0], P.fl[0]].forEach(function (e) { e.t = 0; e.life = 10; e.s0 = 1e-4; kpwShow(e.m); }); },
      function () { kpwShow(sMdl('tiger').root); },
      function () { kpwShow(sMdl('uboot').root); kpwShow(sMdl('water').root); },
      function () { kpwShow(sMdl('kanone').root); },
      function () { var D = aD(); if (!D) return; var t = mTorpedo(); D.g.add(t); t.visible = false; kpwShow(t); KPW.keep.push(t);
        var dome = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), spFres(0xffffff, 0xff6a2a, 1.2)), ring = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 24), new THREE.MeshBasicMaterial({ color: 0xffd890, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })), shell = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff0c0, toneMapped: false }));
        [dome, ring, shell].forEach(function (m) { D.g.add(m); m.visible = false; kpwShow(m); KPW.keep.push(m); }); /* kept (hidden), so their shader programs stay compiled */ },
      /* the marks a blast leaves (cracks, scorch, bullet holes): their textures painted and uploaded, their material compiled */
      function () { var D = aD(); if (!D || typeof dxTex !== 'function') return; var X = dxTex(); try { R3.initTexture(X.crack); R3.initTexture(X.scorch); } catch (e) {}
        ['crack', 'scorch'].forEach(function (k) { var m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: X[k], transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, opacity: 0.9 })); m.renderOrder = 1; D.g.add(m); m.visible = false; kpwShow(m); KPW.keep.push(m); }); },
      /* last, everything else in the scene that has never been drawn (police, drones, wrecks …): one compile pass while she stands still */
      function () { try { var rt = R3.getRenderTarget(); R3.setRenderTarget(POST && POST.target ? POST.target : null); R3.compile(scene, cam); R3.setRenderTarget(rt); } catch (e) {} }, /* (the variant drawn into the post-processing target) */
      function () { KPW.done = true; } ]; }
  function kpwTick() { kpwRestore(); if (KPW.done || !TK || TK.id !== 'koeln' || mode !== 'walk' || !luna || typeof aD !== 'function' || !aD()) return; if ((GS && (GS.fm || GS.car)) || (typeof SP !== 'undefined' && SP.st) || talkQ || travel || fall) { KPW.wait = 30; return; }
    if (KPW.wait > 0) { KPW.wait--; return; } KPW.wait = 8; var S = KPW.steps || (KPW.steps = kpwSteps()), f = S[KPW.i++]; if (!f) { KPW.done = true; return; } try { f(); } catch (e) { if (window.ISLE_TEST) throw e; } }
  /* the sky's reflections (the environment map) are re-made at most twice a minute and never in the middle of an attack */
  var KENV = { t: -1e9, has: false };
  function kenvInstall() { if (typeof W === 'undefined' || !W || !W.envUpdate || W.envUpdate.kp) return; var _e = W.envUpdate; W.envUpdate = function (R) { if (!W.envDirty) return; var now = performance.now(), busy = (GS && GS.fm) || (typeof SP !== 'undefined' && SP.st) || (typeof DXO !== 'undefined' && DXO.bz);
      if (KENV.has && (busy || now - KENV.t < 30000)) return; KENV.t = now; KENV.has = true; _e(R); }; W.envUpdate.kp = true; }
  var _frameW = frame; frame = function (now) { _frameW(now); try { kenvInstall(); kpwTick(); } catch (e) { if (window.ISLE_TEST) throw e; } };
  /* the weapons' sound engine is started by the first tap (the browsers' rule), not at the first shot */
  ['pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { try { if (isOpen) ASND.init(); } catch (e) {} }, { capture: true, passive: true }); });
  window.ISLE_x.prewarm = function () { return { i: KPW.i, done: KPW.done, warm: KPW.warm.length, env: KENV.has }; };
  /* ---- the shadows at the pace the device can carry: every frame normally; on a phone or a lower tier, while the frame rate is under 45 the
     sun's shadow map is redrawn every second frame, under 30 every third (it is the scene drawn once more, from the sun) ---- */
  var KSH = { n: 0, rate: 1 };
  function kshTick() { if (!R3 || !R3.shadowMap || !R3.shadowMap.enabled) return; var mobile = COARSE || (typeof TIER !== 'undefined' && TIER !== 'high'), f = KFPS.fps || 60;
    if (KSH.force) KSH.rate = KSH.force; /* (V79: the graphics settings set the pace) */ else if (!mobile) KSH.rate = 1; else if (f < 30) KSH.rate = 3; else if (f < 45) KSH.rate = Math.max(KSH.rate, 2); else if (f >= 55) KSH.rate = 1;
    if (KSH.rate === 1) { R3.shadowMap.autoUpdate = true; return; } R3.shadowMap.autoUpdate = false; KSH.n++; if (KSH.n % KSH.rate === 0) R3.shadowMap.needsUpdate = true; }
  var _frameS = frame; frame = function (now) { try { kshTick(); } catch (e) {} _frameS(now); };
  window.ISLE_x.shadowRate = function () { return KSH.rate; };
