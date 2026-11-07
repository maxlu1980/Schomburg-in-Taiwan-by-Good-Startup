  /* ===== ISLE part K12 (Köln, V69): the mirrors. What a ray tracer gives a flat water surface, done the way it can be done in a browser at
     full frame rate: the scene drawn a second time from the camera's image below the plane (clipped exactly at the plane by an oblique near
     plane), into a texture the surface then reads where each of its points would see — the city, the bridge, the ships, the sky, the lamps at
     night — bent by the waves or the rain on it. Two mirrors: the Rhine's (whenever the river is in view and the camera is not indoors) and the
     wet ground's at the height Mira stands on (only after rain). When both are needed they take turns, a frame each; each keeps the projection
     of the frame it was drawn in, so what it shows stays in place. ===== */
  var KPRE = []; /* other passes that must be drawn just before the frame (the pocket door's view of where it leads) */
  var KRTX = { inst: false, f: 0, W: null, G: null, fr: new THREE.Frustum(), pm: new THREE.Matrix4(), box: new THREE.Box3(), sc: new THREE.Vector3(), sp: new THREE.Vector3(), stat: { w: 0, g: 0, calls: 0 } };
  function krtxMirror(k) { var gl2 = R3.capabilities.isWebGL2, rt = new THREE.WebGLRenderTarget(64, 64, { type: gl2 ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: true }); rt.texture.generateMipmaps = false; rt.texture.encoding = THREE.LinearEncoding;
    var plane = new THREE.Plane(), normal = new THREE.Vector3(0, 1, 0), mw = new THREE.Vector3(), cw = new THREE.Vector3(), rotM = new THREE.Matrix4(), look = new THREE.Vector3(), clip = new THREE.Vector4(), view = new THREE.Vector3(), target = new THREE.Vector3(), q = new THREE.Vector4(), vc = new THREE.PerspectiveCamera(), sz = new THREE.Vector2();
    var M = { rt: rt, tmw: new THREE.Matrix4(), k: k, hide: [], y: 0,
      /* the mirror is the horizontal plane at height y (world) */
      update: function (R, sceneR, camera) { mw.set(camera.position.x, M.y, camera.position.z); cw.setFromMatrixPosition(camera.matrixWorld); view.subVectors(mw, cw); if (view.dot(normal) > 0) return false; view.reflect(normal).negate(); view.add(mw);
        rotM.extractRotation(camera.matrixWorld); look.set(0, 0, -1).applyMatrix4(rotM).add(cw); target.subVectors(mw, look); target.reflect(normal).negate(); target.add(mw);
        vc.position.copy(view); vc.up.set(0, 1, 0).applyMatrix4(rotM).reflect(normal); vc.lookAt(target); vc.far = camera.far; vc.near = camera.near; vc.fov = camera.fov; vc.aspect = camera.aspect; vc.updateMatrixWorld(); vc.projectionMatrix.copy(camera.projectionMatrix); vc.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
        M.tmw.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1); M.tmw.multiply(vc.projectionMatrix); M.tmw.multiply(vc.matrixWorldInverse);
        plane.setFromNormalAndCoplanarPoint(normal, mw); plane.applyMatrix4(vc.matrixWorldInverse); clip.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant); var pm = vc.projectionMatrix;
        q.x = (Math.sign(clip.x) + pm.elements[8]) / pm.elements[0]; q.y = (Math.sign(clip.y) + pm.elements[9]) / pm.elements[5]; q.z = -1.0; q.w = (1.0 + pm.elements[10]) / pm.elements[14]; clip.multiplyScalar(2.0 / clip.dot(q));
        pm.elements[2] = clip.x; pm.elements[6] = clip.y; pm.elements[10] = clip.z + 1.0; pm.elements[14] = clip.w;
        R.getDrawingBufferSize(sz); var w = Math.max(64, Math.round(sz.x * M.k)), h = Math.max(64, Math.round(sz.y * M.k)), cap = 1280 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); } if (rt.width !== w || rt.height !== h) rt.setSize(w, h);
        M.hide.forEach(function (x) { if (x) { x.__kv = x.visible; x.visible = false; } }); var cur = R.getRenderTarget(), sa = R.shadowMap.autoUpdate, tmo = R.toneMapping; R.shadowMap.autoUpdate = false; R.toneMapping = THREE.NoToneMapping;
        R.setRenderTarget(rt); R.clear(); R.render(sceneR, vc); R.shadowMap.autoUpdate = sa; R.toneMapping = tmo; R.setRenderTarget(cur); M.hide.forEach(function (x) { if (x) x.visible = x.__kv; }); return true; } };
    return M; }
  /* (V72) the shelter map: the city once from straight above, the height of its top surface over every point (a roof, the bridge, the
     station's hall, the cathedral's vaults, an awning), drawn into a texture the wet shaders read (sheltered floors stay dry: no film, no
     puddles, no rings) and copied once to the CPU (is Mira under a roof?). The people, the cars, the trains, the ships and the river are
     left out. */
  function krtxOccBuild(R) { var T = TK.T; if (!T || !T.root) return; var N = 1024, Nz = 1024, box = new THREE.Box3(), mb = new THREE.Box3(), hide = [], i;
    T.root.updateMatrixWorld(true); T.root.traverse(function (o) { if (!o.isMesh || o.isSkinnedMesh || !o.geometry || o === T.water) return; var g = o.geometry; if (!g.boundingBox) g.computeBoundingBox(); if (!g.boundingBox || g.boundingBox.isEmpty()) return; mb.copy(g.boundingBox).applyMatrix4(o.matrixWorld); var sz = mb.getSize(KRTX.sc); if (sz.x > 700 || sz.z > 700) return; box.union(mb); });
    if (box.isEmpty()) return; var x0 = box.min.x - 4, x1 = box.max.x + 4, z0 = box.min.z - 4, z1 = box.max.z + 4, y0 = box.min.y - 2, y1 = box.max.y + 2; /* about three quarters of a unit (90 cm) a texel */ N = Math.min(2048, Math.ceil((x1 - x0) / 0.75)); Nz = Math.min(2048, Math.ceil((z1 - z0) / 0.75));
    function hd(o) { if (o && o.visible) { o.visible = false; hide.push(o); } } hd(T.water); hd(luna && luna.root); (T.ships || []).forEach(function (q) { hd(q.g); }); (T.trains || []).forEach(function (q) { hd(q.root); }); (T.cars || []).forEach(function (q) { hd(q.root); }); (T.peds || []).forEach(function (q) { hd(q.A && q.A.root); });
    T.root.traverse(function (o) { if (o.isSkinnedMesh || o.isPoints || o.isLine) hd(o); });
    var hm = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { uH: { value: new THREE.Vector2(y0, y1 - y0) } },
      vertexShader: 'varying float vY; void main(){ vec4 p = vec4(position, 1.0);\n#ifdef USE_INSTANCING\n p = instanceMatrix * p;\n#endif\n vec4 w = modelMatrix * p; vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'uniform vec2 uH; varying float vY; void main(){ float h = clamp((vY - uH.x) / uH.y, 0.0, 1.0) * 255.0; gl_FragColor = vec4(floor(h) / 255.0, fract(h), 0.0, 1.0); }' });
    var oc = new THREE.OrthographicCamera(x0, x1, -z0, -z1, 0.5, y1 - y0 + 10); oc.position.set(0, y1 + 5, 0); oc.up.set(0, 0, -1); oc.lookAt(0, y0, 0); oc.updateMatrixWorld(); oc.updateProjectionMatrix();
    var rt = new THREE.WebGLRenderTarget(N, Nz, { depthBuffer: true, type: THREE.UnsignedByteType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false }), sc = new THREE.Scene(), par = T.root.parent;
    sc.overrideMaterial = hm; sc.add(T.root); var cur = R.getRenderTarget(), cc = R.getClearColor(new THREE.Color()), ca = R.getClearAlpha(); R.setClearColor(0x000000, 1); R.setRenderTarget(rt); R.clear(); R.render(sc, oc);
    var buf = new Uint8Array(N * Nz * 4); try { R.readRenderTargetPixels(rt, 0, 0, N, Nz, buf); } catch (e) { buf = null; } R.setRenderTarget(cur); R.setClearColor(cc, ca); if (par) par.add(T.root); hide.forEach(function (o) { o.visible = true; }); hm.dispose();
    var U = KIT.U; U.tOcc.value = rt.texture; U.uOccM.value.set(x0, z1, 1 / (x1 - x0), -1 / (z1 - z0)); U.uOccH.value.set(y0, y1 - y0);
    KRTX.occ = { rt: rt, buf: buf, N: N, Nz: Nz, x0: x0, x1: x1, z0: z0, z1: z1, y0: y0, hy: y1 - y0, tk: T }; KRTX.occOk = true; }
  /* the top surface over a world point (the CPU copy), and whether it shelters a point at height y */
  function krtxTop(x, z) { var O = KRTX.occ; if (!O || !O.buf) return -1e9; var u = (x - O.x0) / (O.x1 - O.x0), v = (O.z1 - z) / (O.z1 - O.z0); if (u <= 0 || v <= 0 || u >= 1 || v >= 1) return -1e9; var i = (Math.floor(v * O.Nz) * O.N + Math.floor(u * O.N)) * 4; return (O.buf[i] / 255 + O.buf[i + 1] / 65025) * O.hy + O.y0; }
  function krtxSheltered(x, y, z) { return krtxTop(x, z) - y > 0.6; }
  /* called by the frame just before the picture is drawn (a patch in part c) */
  function krtxFrame(R) { KPRE.forEach(function (f) { try { f(R); } catch (e) { if (window.ISLE_TEST) throw e; } }); try { krtxPre(R); } catch (e) { KIT.U.uRefW.value = 0; KIT.U.uRefG.value = 0; if (window.ISLE_TEST) throw e; } }
  function krtxPre(R) { var U = KIT.U; if (!TK || TK.id !== 'koeln' || !TK.T || !TK.T.water) { U.uRefW.value = 0; U.uRefG.value = 0; return; }
    if (!KRTX.occ || KRTX.occ.tk !== TK.T) { try { krtxOccBuild(R); } catch (e) { KRTX.occ = { tk: TK.T }; if (window.ISLE_TEST) throw e; } } if (KRTX.off) { U.uRefW.value = 0; U.uRefG.value = 0; return; }
    var T = TK.T, kq = (typeof TIER !== 'undefined' && TIER === 'low') ? 0.33 : 0.5; if (!KRTX.W) { KRTX.W = krtxMirror(kq); KRTX.G = krtxMirror(kq); }
    var MW = KRTX.W, MG = KRTX.G, ind = (typeof KIN !== 'undefined' && KIN.k) ? KIN.k : 0, s = W.wxState ? W.wxState() : {};
    U.uRainR.value = Math.min(1, (s && s.rain) || 0); if (W.fogLin) U.uRefSky.value.copy(W.fogLin);
    /* is the river in view? (its sheet as a box, against the camera's frustum) */
    var g = T.water.geometry; if (!g.boundingBox) g.computeBoundingBox(); KRTX.box.copy(g.boundingBox).applyMatrix4(T.water.matrixWorld); KRTX.box.min.y -= 0.5; KRTX.box.max.y += 0.5;
    KRTX.pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); KRTX.fr.setFromProjectionMatrix(KRTX.pm);
    var wantW = ind < 0.5 && KRTX.fr.intersectsBox(KRTX.box), wy = KRTX.box.min.y + 0.5; U.uTideY.value = wy;
    var gy = (typeof pos !== 'undefined' && pos) ? pos.y : wy, under = typeof pos !== 'undefined' && pos && KRTX.occOk ? krtxSheltered(pos.x, pos.y, pos.z) : ind >= 0.5, wantG = !under && U.uWet.value > 0.12 && cam.position.y - gy < 45 && cam.position.y > gy - 0.5;
    /* the frame budget: when the frames run long, the mirrors are redrawn every second or third frame (each keeps its own projection, so the image stays put) */
    var nw = performance.now(); if (KRTX.lt) { var fd = Math.min(100, nw - KRTX.lt); KRTX.ema = KRTX.ema ? KRTX.ema * 0.95 + fd * 0.05 : fd; } KRTX.lt = nw; var every = window.NO_GOV ? 1 : KRTX.ema > 34 ? 3 : KRTX.ema > 24 ? 2 : 1; KRTX.f++;
    var doW = wantW, doG = wantG; if (wantW && wantG) { doW = KRTX.f % 2 === 0; doG = !doW; } if (every > 1 && KRTX.f % every !== 0) { doW = doW && !KRTX.hasW; doG = doG && !KRTX.hasG; }
    if (!wantW) { U.uRefW.value = 0; KRTX.hasW = false; } else if (KRTX.hasW) U.uRefW.value = 1; if (!wantG) { U.uRefG.value = 0; KRTX.hasG = false; } else if (KRTX.hasG) U.uRefG.value = 1; if (!doW && !doG) return;
    /* the cut-away round Mira is the main camera's: not in the mirrors */ KRTX.sc.copy(U.uSeeC.value); KRTX.sp.copy(U.uSeeP.value); U.uSeeC.value.set(0, -9999, 0); U.uSeeP.value.set(0, -9999, 0.01);
    if (doW) { MW.y = wy; MW.hide = [T.water, W.rain]; var tw = U.tRefW.value; U.tRefW.value = U.tRefNone; if (MW.update(R, scene, cam)) { U.uRMw.value.copy(MW.tmw); U.tRefW.value = MW.rt.texture; U.uRefW.value = 1; KRTX.stat.w++; KRTX.hasW = true; } else { U.tRefW.value = tw; U.uRefW.value = 0; } }
    if (doG) { MG.y = gy + 0.03; /* (V72) the plane a little above the floor, so the floor itself is cut away cleanly */ MG.hide = (T.groundM || []).concat([W.rain]); var tg = U.tRefG.value; U.tRefG.value = U.tRefNone; if (MG.update(R, scene, cam)) { U.uRMg.value.copy(MG.tmw); U.uRefY.value = gy + 0.03; U.tRefG.value = MG.rt.texture; U.uRefG.value = 1; KRTX.stat.g++; KRTX.hasG = true; } else { U.tRefG.value = tg; U.uRefG.value = 0; } }
    KRTX.stat.calls = R.info.render.calls; U.uSeeC.value.copy(KRTX.sc); U.uSeeP.value.copy(KRTX.sp); }
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.rtx = function (off) { if (off != null) KRTX.off = !!off; return { occ: !!KRTX.occOk, under: typeof pos !== 'undefined' && KRTX.occOk ? krtxSheltered(pos.x, pos.y, pos.z) : null, top: typeof pos !== 'undefined' && KRTX.occOk ? +krtxTop(pos.x, pos.z).toFixed(2) : null, ema: KRTX.ema && +KRTX.ema.toFixed(1), w: KRTX.stat.w, g: KRTX.stat.g, calls: KRTX.stat.calls, refW: KIT.U.uRefW.value, refG: KIT.U.uRefG.value, off: !!KRTX.off, size: KRTX.W ? [KRTX.W.rt.width, KRTX.W.rt.height] : null }; };
