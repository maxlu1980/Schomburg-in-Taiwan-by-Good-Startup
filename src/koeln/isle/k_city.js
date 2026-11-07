  /* ===== ISLE part K1 (Köln): the one city — built, entered, left; the title on the Domplatte; the arrival by train ===== */
  var KX = { built: false };
  /* the city object: Köln downtown (KOELN3D) at the world's origin, its sky (Köln's place and weather), its light */
  function koBuild() { if (CITY.koeln) return CITY.koeln; var X = 0, Z = 0, Y = 0.62, T = KOELN3D.build(scene, { x: X, z: Z, y: Y, tier: TIER, su: W.seaU });
    try { KOELN3D.traffic(T, TIER === 'low' ? 8 : 16, 0); KOELN3D.people(T, TIER === 'low' ? 8 : 20); } catch (e) { if (window.console) console.error('koeln life', e); }
    var wxT = function (lg) { var E = { en: ['Live weather', 'Data: AccuWeather (Köln, Altstadt-Nord)', 'Köln climate model (DWD 1991–2020, Köln/Bonn)', 'Connecting to the live weather…', 'humidity', 'wind'], zh: ['即時天氣', '資料：AccuWeather（科隆 · 舊城北區）', '科隆氣候模型（德國氣象局 1991–2020，科隆/波昂站）', '正在連接即時天氣…', '濕度', '風'], de: ['Live-Wetter', 'Daten: AccuWeather (Köln, Altstadt-Nord)', 'Klimamodell Köln (DWD 1991–2020, Köln/Bonn)', 'Verbinde mit dem Live-Wetter …', 'Luftfeuchte', 'Wind'] }[lg] || [];
      var R = { en: { e_server_not_connected: 'AccuWeather is not connected (claude.ai Settings → Connectors)', e_needs_reauth: 'Reconnect AccuWeather (claude.ai Settings → Connectors)', e_not_in_manifest: 'AccuWeather is not allowed for this page', e_consent_required: 'AccuWeather is not allowed for this page', e_unavailable: 'Connectors are not available in this view', e_other: 'Live data unavailable for now' },
        zh: { e_server_not_connected: '尚未連接 AccuWeather（claude.ai 設定 → 連接器）', e_needs_reauth: 'AccuWeather 需要重新連接（claude.ai 設定 → 連接器）', e_not_in_manifest: '此頁未獲允許使用 AccuWeather', e_consent_required: '此頁未獲允許使用 AccuWeather', e_unavailable: '此檢視無法使用連接器', e_other: '暫時無法取得即時資料' },
        de: { e_server_not_connected: 'AccuWeather ist nicht verbunden (claude.ai Einstellungen → Konnektoren)', e_needs_reauth: 'AccuWeather neu verbinden (claude.ai Einstellungen → Konnektoren)', e_not_in_manifest: 'AccuWeather ist für diese Seite nicht freigegeben', e_consent_required: 'AccuWeather ist für diese Seite nicht freigegeben', e_unavailable: 'Konnektoren sind in dieser Ansicht nicht verfügbar', e_other: 'Live-Daten gerade nicht verfügbar' } }[lg] || {};
      return Object.assign({ live: E[0], src: E[1], model: E[2], wait: E[3], hum: E[4], wind: E[5] }, R); };
    var C = { id: 'koeln', mod: KOELN3D, x: X, z: Z, y: Y, T: T, g: T.root, inb: function (x, z) { return x > X + T.MAPX[0] - 30 && x < X + T.MAPX[1] + 30 && z > Z + T.MAPZ[0] - 30 && z < Z + T.MAPZ[1] + 30; }, place: { lon: 6.9583, lat: 50.9413, id: 'koeln', weather: KOLNWEA.sample }, wsrc: KOLNWEA, wxt: { en: wxT('en'), zh: wxT('zh'), de: wxT('de') } };
    C.wxt.ja = C.wxt.en; CITY.koeln = C; W.glows = W.glows || []; T.glows.forEach(function (g) { W.glows.push(g); });
    /* the ground, the walls and the levels of the city answer the world's own queries */ var _h = W.height; W.height = function (x, z) { if (C.inb(x, z)) return KOELN3D.groundAt(T, x, z, pos.y); return _h(x, z); };
    W.places.koeln = { id: 'koeln', x: X + 100, z: Z, rr: 900, kind: 'city' };
    tpLights(C); try { if (typeof koContent === 'function') koContent(C); } catch (e) { if (window.console) console.error('koeln content', e); if (window.ISLE_TEST) throw e; }
    KX.built = true; return C; }
  /* Tokyo's place in the code is Köln's: the title's district, the free walk's, the street play's */
  tkBuild = function () { var C = koBuild(); if (TK !== C) { if (TK && TK !== C) tkUse(C); else { TK = C; TKM = C.mod; if (C.g) C.g.visible = true; try { if (typeof gsSwitch === 'function') gsSwitch(); } catch (e) {} } } return TK; };
  tkWalkUi = function () { var b = $('isTkWalk'); if (b) b.remove(); };
  /* ---------- the title: the Domplatte before the west front in the late afternoon; a message from Max ---------- */
  /* camera framings in the city's frame: on a wide screen the card sits left, the cathedral right of it with Mira before it; on a narrow
     one the card below, the message above, Mira in the gap with the towers over her */
  TKCAM = { desk: { c: [-114, 2.6, 96], t: [-46, 46, 6], lu: [-99.2, 79.6], fov: 60 }, narrow: { c: [-114, 2.2, 82], t: [-50, 54, 0], lu: [-107.5, 74.5], fov: 66 } };
  msgFill = function (m) { m.innerHTML = '<div class="isle__msgh"><i>M</i><b>' + esc(th('boss')) + '</b><span>' + esc(th('msgT')) + '</span></div><p>' + esc(th('msg')) + '</p>'; m.setAttribute('lang', LANG === 'zh' ? 'zh-Hant-TW' : LANG); };
  th = function (k) { var L = TXH[LANG] || TXH.en; return L[k] != null ? L[k] : TXH.en[k]; };
  /* the title's hour: the golden hour of an October afternoon */ var _titleSceneK = titleScene; titleScene = function () { if (CITYW) { try { cityLeave(); } catch (e) {} } window.ISLE_TK_HOUR = window.ISLE_TK_HOUR || 16.4; _titleSceneK.apply(this, arguments); };
  /* ---------- the start: she steps off the train at Köln Hbf (platform 4/5), the cathedral one passage and one square away ---------- */
  startGame = function () { if (mode !== 'title' && !(fall && fall.tk)) return; AU.init(); var m = $('isMsg'); if (m) m.classList.remove('is-on'); try { phoneProp(false); } catch (e) {} AU.fx('whoosh');
    fade(function () { $('isTitle').hidden = true; fall = null; tkCurve(true); resize(); cityArrive('koeln', P.intro ? 'back' : 'train'); }, function () { banner(lx({ en: 'Köln Hauptbahnhof', zh: '科隆中央車站', de: 'Köln Hauptbahnhof' }), lx({ en: 'The training week begins', zh: '訓練週開始', de: 'Die Schulungswoche beginnt' })); AU.fx('chime'); if (!P.intro) setTimeout(function () { if (mode !== 'walk' || cardOn || talkQ) return; P.intro = 1; save(); talk(lunaName(), t('introLines'), true); }, 1400); }); };
  enterIsland = function (how) { cityArrive('koeln', how === 'back' ? 'back' : 'direct'); };
  /* ---------- arriving in the city ---------- */
  var _cityArriveK = cityArrive; cityArrive = function (id, how, spot) { if (id !== 'koeln') return _cityArriveK.apply(this, arguments); var C = koBuild(); tkUse(C); TK = C; TKM = C.mod; CITYW = true; root.classList.add('is-city'); travel = null; fall = null; mode = 'walk'; setVehicle('walk', true); luna.root.visible = true; var T = C.T;
    var at = spot || (how === 'train' ? T.spots.arrive : how === 'back' ? (P.last && C.inb(P.last[0], P.last[1]) ? [P.last[0] - C.x, P.last[1] - C.z] : T.spots.domWest) : T.spots.domWest), w = T.toW(at[0], 0, at[1]);
    pos.set(w.x, C.y + (how === 'train' ? T.TY : Y1K), w.z); pos.y = groundY(pos.x, pos.z); luna.root.position.copy(pos); vel.set(0, 0, 0); target = null; path = null; if (el.tapMark) el.tapMark.visible = false;
    if (how === 'train') { var tr = T.trains[0]; if (tr) { tr.st = 'dwell'; tr.s = 0; tr.v = 0; tr.wait = 30; tr.open = true; tr.openT = 0; tr.root.visible = true; tr.hold = false; } face = T.spots.arriveFace + Math.PI / 2 + Math.PI; } else face = Math.PI / 2;
    luna.root.rotation.set(0, face, 0); CAM.yaw = face + Math.PI; CAM.userT = 0; TC.d = TC.p = TC.dd = TC.pd = null; TC.hold = null; TC.yawGoal = null; TC.zone = undefined; setView(CAM.view || 'classic', true); snapCam();
    $('isHud').hidden = false; W.skyAt(pos.x, pos.z); try { W.sky2(skyDate(), true); } catch (e) {} W.setTime(hourNow); try { wxChip(); } catch (e) {} hud(); boardLabel(); labels(); tkSoundArm(); try { TKM.soundStart(); } catch (e) {} AU.music('island', isNight());
    try { gsStart(); } catch (e) { if (window.console) console.error('gsStart', e); } placeLabel(true); stamp('koeln.visit'); save(); };
  var Y1K = 0.12;
  /* leaving it (for the title) */ cityLeave = function () { if (!CITYW) return; try { gsStop(); } catch (e) {} CITYW = false; root.classList.remove('is-city'); try { TKM.soundStop(); } catch (e) {} };
  var _toTitleK = toTitle; toTitle = function () { try { if (typeof navStop === 'function') navStop(true); } catch (e) {} try { if (CITYW) { P.last = [pos.x, pos.z]; save(); } cityLeave(); } catch (e) {} return _toTitleK.apply(this, arguments); };
  /* there is no island to hide in Köln */ isleHide = function () {};
  window.ISLE_k = { arrive: function (how, spot) { cityArrive('koeln', how || 'direct', spot); return { city: CITYW, tk: TK && TK.id }; }, T: function () { return CITY.koeln && CITY.koeln.T; }, pos: function () { return [pos.x, pos.y, pos.z]; } };
