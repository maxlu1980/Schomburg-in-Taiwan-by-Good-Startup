  /* ===== ISLE part K9 (Köln): small things — the stall keepers' words ===== */
  LINES.vendor = { en: ['Fresh and hot — what will it be?', 'Pay with S coins, eat it here or take it in your bag.'], zh: ['剛做好的，熱騰騰——要什麼？', '用 S 幣付款，可以現吃，也可以放進包包。'], de: ['Frisch und heiß – was darf\'s sein?', 'Bezahlt wird mit S-Münzen – gleich essen oder in die Tasche?'] };
  ROLEN.vendor = { en: 'Stall keeper', zh: '攤販', de: 'Standbetreiber' };
  /* Max: at his counter in the Rheingarten by day, behind NO AFTERLIFE's bar at night */
  var KMX = { night: null };
  function koMaxTick() { if (!TK || TK.id !== 'koeln') return; var night = isNight(); if (KMX.night === night) return; KMX.night = night;
    npcs.forEach(function (n) { if (n.owner) { n.away = night; n.hidden = night; if (n.A) n.A.root.visible = !night; } });
    if (typeof BARN !== 'undefined') BARN.list.forEach(function (n) { if (n.max) { n.off = !night; if (n.A) n.A.root.visible = night; } }); }
  var _extraTickKF = extraTick; extraTick = function (dt, ts) { _extraTickKF(dt, ts); try { koMaxTick(); if (TK && TK.id === 'koeln' && TK.T && TK.T.bladesTick) TK.T.bladesTick(pos.x, pos.z); /* (V78) the lawn's carpet of blades travels with Mira */ } catch (e) { if (window.ISLE_TEST) throw e; } };
  /* ---------- the way into the guide site: a guide's page, its simulator, the documents ---------- */
  var KROUTE = { inj: '#/crack-injection', cr: '#/concrete-restoration', wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', ca: '#/concrete-technology/crystalline-concrete-admixture', pf: '#/protective-flooring-coating-systems' };
  var KSIM = { inj: '#simulator [data-hsopen], #simOpen', cr: '#cr-simulator [data-hsopen]', wp: '#wp-simulator [data-hsopen]', rc: '#rc-simulator [data-hsopen]', ca: '#ca-simulator [data-hsopen]', pf: '#pf-simulator [data-hsopen]' };
  function koToSite(cat, opt) { opt = opt || {}; var h = location.hash || '';
    if (cat && KROUTE[cat]) { if (h !== KROUTE[cat]) location.hash = KROUTE[cat]; else if (typeof Menu !== 'undefined' && Menu.show) { try { Menu.show(cat, { hash: true }); } catch (e) {} } }
    else if (/^#\/(island|play)|^#\/?$|^$/.test(h)) { try { history.replaceState(null, '', KROUTE.inj); window.dispatchEvent(new HashChangeEvent('hashchange')); } catch (e) { location.hash = KROUTE.inj; } }
    if (opt.sim && cat && KSIM[cat]) setTimeout(function () { var b = document.querySelector(KSIM[cat]); if (b) { try { b.scrollIntoView({ block: 'center' }); } catch (e) {} setTimeout(function () { b.click(); }, 350); } }, 900);
    if (opt.docs) setTimeout(function () { var d = document.getElementById('utilDocs'); if (d) d.click(); }, 400);
    if (opt.menu) setTimeout(function () { window.scrollTo(0, 0); }, 300); }
  /* the old game's address still leads into the game */ try { if (location.hash === '#/play') history.replaceState(null, '', '#/island'); window.addEventListener('hashchange', function () { if (location.hash === '#/play') { history.replaceState(null, '', '#/island'); if (!isOpen) open({ title: !P.intro }); } }); } catch (e) {}
  /* ---------- the tower climb: 533 steps up the south tower, then the view from the platform (about 97 m) — the station, the Rhine, the bridge, Deutz ---------- */
  var KTOWC = null;
  startBalloon = function () { if (travel || !TK || TK.id !== 'koeln') return; var back = [pos.x, pos.z, face]; if (board) boardOff(true); setVehicle('walk', true); AU.fx('whoosh');
    fade(function () { travel = { kind: 'tower', t: 0, dur: 16, back: back }; luna.root.visible = false; FX_TRAVEL.tower(0); }, function () { banner(t('balloonT'), t('balloonSee')); AU.fx('chime'); }); };
  FX_TRAVEL.tower = function (dt) { var Tv = travel; Tv.t += dt; var u = Math.min(1, Tv.t / Tv.dur), e = u * u * (3 - 2 * u), a = -2.0 + e * 2.6, cx = -48, cz = 15, y = (TK ? TK.y : 0) + 81;
    KTOWC = [cx + Math.cos(a) * 13, y, cz + Math.sin(a) * 13, cx + Math.cos(a) * 160, y - 52, cz + Math.sin(a) * 160];
    if (u >= 1 && !Tv.end) { Tv.end = true; fade(function () { KTOWC = null; travel = null; luna.root.visible = true; var b = Tv.back; pos.set(b[0], groundY(b[0], b[1]), b[1]); face = b[2]; luna.root.position.copy(pos); snapCam(); }); } };
  /* an umbrella's canopy: a shallow dome over eight ribs, each panel sagging a little between them, the rim scalloped (smooth from any side) */
  function koUmbGeo(R) { var NR = 8, PER = 8, NU = NR * PER, NV = 7, pos = [], idx = [], u, v;
    for (v = 0; v <= NV; v++) { var t = v / NV, r = R * Math.sin(t * Math.PI / 2) * 1.0, y = 0.2 * (1 - Math.pow(t, 1.7)); for (u = 0; u <= NU; u++) { var a = u / NU * Math.PI * 2, f = (u % PER) / PER, sag = Math.sin(f * Math.PI), rr = r * (1 - 0.055 * sag * t * t), yy = y - 0.028 * sag * t * t; pos.push(Math.cos(a) * rr, yy, Math.sin(a) * rr); } }
    for (v = 0; v < NV; v++) for (u = 0; u < NU; u++) { var a0 = v * (NU + 1) + u, b0 = a0 + 1, c0 = a0 + NU + 1, d0 = c0 + 1; idx.push(a0, c0, b0, b0, c0, d0); }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  /* (V67) a step taken, not a jump: where the floor goes up or down in steps (the cathedral's plinth and choir, the terraces, the river's
     steps) the walk height changes at once; Mira's body follows it over a few hundredths of a second, as on real stairs */
  var KSY = { y: null };
  var _moveSY = move; move = function (dt) { _moveSY(dt); try { if (!TK || TK.id !== 'koeln' || !luna || VEH.kind !== 'walk' || fall || travel) { KSY.y = null; return; } var ty = pos.y;
      if (KSY.y == null || Math.abs(ty - KSY.y) > 0.7) KSY.y = ty; else KSY.y += (ty - KSY.y) * Math.min(1, dt * 13); luna.root.position.y = KSY.y; } catch (e) { if (window.ISLE_TEST) throw e; } };
