  /* ===== ISLE part K5 (Köln): Mira speaks German — a young woman from the Rhineland, in the device's own German voice; her moves in a
     German WWII manner (the anime "tank girl" kind: a tank's ram, a lightning triple, the pioneer's spade, a smoke candle, the eighty-eight;
     a siren dive, a creeping barrage, a rocket salvo). No insignia, no slogans, no real battles; nobody is hurt for good. ===== */
  window.LUNA_VOICE = {}; /* no Japanese clips: every line is spoken by the speech synthesis in German */
  /* what she says (shown = spoken) */
  FSL = {
    goken: ['Achtung – Tiger-Ramme!'], goken_b: ['Volle Panzerung – alles platt!'],
    ryusui: ['Blitzschlag – eins, zwei, drei!'], ryusui_b: ['Und nochmal – Blitzschlag mal fünf!'],
    iai: ['Spaten frei – Schwung!'], iai2: ['Nur mit der flachen Seite – keine Sorge!'], iai_b: ['Pionierspaten – Halbmond!'],
    genmu: ['Nebelkerze – weg damit!'], genmu_b: ['Dichter Nebel – wer findet mich?'],
    seiki: ['Acht-Acht – Feuer!'], seiki_b: ['Volle Ladung – Acht-Acht, Feuer frei!'],
    win: ['Jawoll!'], miss: ['Hä? Daneben!'],
    oc_on: ['Übertakten! Alles läuft wie in Zeitlupe …!'], oc_off: ['Puh … wieder normales Tempo.'], ovl_warn: ['Mir wird … so heiß …'],
    bz_on: ['Nein … mein Körper … ich kann nicht aufhören!'], bz_rage: ['Aaaaah!'], bz_off: ['Hah … hah … was hab ich da gemacht …?'],
    sq_see: ['Echt jetzt? Die Bereitschaftspolizei!'], net: ['Iiih! Ein Netz?! Ich komm nicht raus!'], dr_see: ['Drohnen auch noch?! Die beobachten mich von oben!'], oops: ['Ups … war das ein bisschen zu viel?'],
    sp_charge: ['Jetzt aber – haaaa!'], sp_star: ['Sirene an – Sturzflug!'], sp_lance: ['Feuerwalze – roll los!'], sp_aurora: ['Nebelwerfer – Salve!'], sp_after: ['Puh. Vielleicht hab ich’s ein bisschen zu ernst genommen.'],
    bar_in: ['Wow … die Neonlichter! Das ist also das NO AFTERLIFE?'], bar_kanpai: ['Prost! … Ach so, meins ist alkoholfrei!'], txg_arr: ['Köln Hauptbahnhof! Und da – der Dom, direkt gegenüber!'], koeln_arr: ['Köln Hauptbahnhof! Und da – der Dom, direkt gegenüber!']
  };
  Object.keys(FSL).forEach(function (k) { FSL[k][1] = FSL[k][0]; });
  /* the moves' names, and what she says in the reader's own language (German readers read her line itself) */
  (function () { var ST = { en: { goken: 'Tiger Ram', ryusui: 'Lightning Triple', iai: 'Pioneer Spade', genmu: 'Smoke Candle', seiki: 'Eighty-Eight' }, zh: { goken: '虎式衝撞', ryusui: '閃電三連擊', iai: '工兵鏟', genmu: '煙幕彈', seiki: '八八砲' }, de: { goken: 'Tiger-Ramme', ryusui: 'Blitzschlag-Dreier', iai: 'Pionierspaten', genmu: 'Nebelkerze', seiki: 'Acht-Acht' } };
    var ME = { en: { goken: '"Look out — Tiger Ram!"', goken_b: '"Full armour — flatten the lot!"', ryusui: '"Lightning — one, two, three!"', ryusui_b: '"And again — lightning times five!"', iai: '"Spade out — swing!"', iai2: '"Only the flat side — don\'t worry!"', iai_b: '"Pioneer spade — half moon!"', genmu: '"Smoke candle — away!"', genmu_b: '"Thick fog — who can find me?"', seiki: '"Eighty-eight — fire!"', seiki_b: '"Full charge — eighty-eight, open fire!"', win: '"Yes!"', miss: '"Huh? Missed!"',
        oc_on: '"Overclock! Everything\'s in slow motion…!"', oc_off: '"Phew… back to normal speed."', ovl_warn: '"I\'m getting… so hot…"', bz_on: '"No… my body… I can\'t stop!"', bz_rage: '"Aaaaah!"', bz_off: '"Hah… hah… what did I just do…?"', sq_see: '"Seriously? The riot police!"', net: '"Eek! A net?! I can\'t get out!"', dr_see: '"Drones too?! They\'re watching from above!"', oops: '"Oops… was that a bit much?"',
        sp_charge: '"Here goes — haaaa!"', sp_star: '"Siren on — dive!"', sp_lance: '"Creeping barrage — roll!"', sp_aurora: '"Rocket launcher — salvo!"', sp_after: '"Phew. Maybe I took that a bit too seriously."', bar_in: '"Wow… the neon! So this is NO AFTERLIFE?"', bar_kanpai: '"Cheers! …Oh, mine\'s alcohol-free!"', txg_arr: '"Köln Hauptbahnhof! And there — the Dom, right opposite!"', koeln_arr: '"Köln Hauptbahnhof! And there — the Dom, right opposite!"' },
      zh: { goken: '「注意——虎式衝撞！」', goken_b: '「裝甲全開——全部壓平！」', ryusui: '「閃電——一、二、三！」', ryusui_b: '「再來一次——閃電五連！」', iai: '「工兵鏟出鞘——揮！」', iai2: '「只用鏟面拍的，別擔心！」', iai_b: '「工兵鏟——半月斬！」', genmu: '「煙幕彈——丟出去！」', genmu_b: '「濃霧——找得到我嗎？」', seiki: '「八八砲——開火！」', seiki_b: '「全裝藥——八八砲，自由射擊！」', win: '「好耶！」', miss: '「咦？沒打中！」',
        oc_on: '「超頻！一切都像慢動作……！」', oc_off: '「呼……恢復正常速度了。」', ovl_warn: '「身體……好熱……」', bz_on: '「不……身體……停不下來！」', bz_rage: '「啊啊啊啊——！」', bz_off: '「哈……哈……我剛剛做了什麼……？」', sq_see: '「真的假的？鎮暴警察來了！」', net: '「呀！網子？！出不去啦！」', dr_see: '「連無人機都來了？！從天上盯著我！」', oops: '「糟糕……是不是有點太過頭了？」',
        sp_charge: '「要上了——哈啊啊！」', sp_star: '「警笛開啟——俯衝！」', sp_lance: '「徐進彈幕——滾過去！」', sp_aurora: '「火箭砲——齊射！」', sp_after: '「呼……好像有點太認真了。」', bar_in: '「哇……霓虹燈！這裡就是 NO AFTERLIFE？」', bar_kanpai: '「乾杯！……啊，我的是無酒精的！」', txg_arr: '「科隆中央車站！那邊——大教堂就在正對面！」', koeln_arr: '「科隆中央車站！那邊——大教堂就在正對面！」' } };
    ['en', 'zh', 'de'].forEach(function (lg) { var X = FSX[lg] || (FSX[lg] = { styles: {}, mean: {} }); X.styles = Object.assign({}, X.styles, ST[lg]); X.mean = lg === 'de' ? {} : Object.assign({}, X.mean, ME[lg]); });
    var SPN = { en: { star: 'Siren Dive', lance: 'Creeping Barrage', aurora: 'Rocket Salvo' }, zh: { star: '俯衝警笛', lance: '徐進彈幕', aurora: '火箭齊射' }, de: { star: 'Sturzflug mit Sirene', lance: 'Feuerwalze', aurora: 'Nebelwerfer-Salve' } };
    ['en', 'zh', 'de'].forEach(function (lg) { if (SPX[lg]) Object.assign(SPX[lg], SPN[lg]); }); })();
  /* the subtitle: her German line, and under it what it means (for readers of English or Chinese) */
  fsSub = function (id, style) { var el = $('isFsSub'); if (!el) { el = document.createElement('div'); el.id = 'isFsSub'; el.className = 'isle__fssub'; el.setAttribute('aria-live', 'polite'); root.appendChild(el); }
    var X = fsx(), L = FSL[id]; if (!L) return; el.innerHTML = (style ? '<small>' + esc(X.styles[style] || '') + '</small>' : '') + '<b lang="de">' + esc(L[0]) + '</b>' + (LANG !== 'de' && X.mean && X.mean[id] ? '<i>' + esc(X.mean[id]) + '</i>' : ''); el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on'); FSV.subT = 2.8; };
  /* the voice: the device's German voice, a young woman's where it has one (Anna, Petra, Marlene, Vicki, Katja, Hedda, Google Deutsch …) */
  VOICE = (function () { var de = null; function pick() { if (de || !window.speechSynthesis) return de; var vs = speechSynthesis.getVoices().filter(function (v) { return /^de([-_]|$)/i.test(v.lang); }); if (!vs.length) return null;
      var fem = vs.filter(function (v) { return /Anna|Petra|Marlene|Vicki|Katja|Hedda|Helena|Sabine|Claudia|Leonie|Amala|Seraphina|Conrad?ia|Female|weiblich|Frau/i.test(v.name) && !/Markus|Stefan|Hans|Yannick|Conrad\b|Male|männlich/i.test(v.name); });
      de = fem.filter(function (v) { return /Natural|Online|Neural|Premium|Enhanced/i.test(v.name); })[0] || fem[0] || vs.filter(function (v) { return /Google/i.test(v.name); })[0] || vs[0]; return de; }
    if (window.speechSynthesis && speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', function () { de = null; });
    function muted() { try { return (typeof SimAudio !== 'undefined' && SimAudio.muted()) || (typeof tkMuted === 'function' && tkMuted()) || (typeof AU !== 'undefined' && AU.isMuted && AU.isMuted()); } catch (e) { return false; } }
    function speak(text, o) { if (muted() || !text || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return; o = o || {}; try { var u = new SpeechSynthesisUtterance(String(text).replace(/[«»„“”"]/g, '')); u.lang = 'de-DE'; var v = pick(); if (v) u.voice = v; var fem = v && /Anna|Petra|Marlene|Vicki|Katja|Hedda|Helena|Sabine|Claudia|Leonie|Amala|Seraphina|Female|weiblich/i.test(v.name); u.pitch = o.pitch || (fem ? 1.12 : 1.32); u.rate = o.rate || 1.04; u.volume = 1; if (!o.queue) speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
    function say(id) { var L = FSL[id]; if (L) speak(L[1] || L[0], { pitch: /rage|charge/.test(id) ? 1.25 : 0 }); }
    return { say: say, speak: speak, voice: function () { var v = pick(); return v ? v.name + ' (' + v.lang + ')' : null; } }; })();
  /* she speaks her own lines in a conversation too — in German, whatever the reader's language (the text box shows the reader's) */
  var _talkV = talk; talk = function (who, lines, high) { _talkV(who, lines, high); try { if (who !== lunaName()) { TW.deL = null; return; } var de = null, Lw = L(); Object.keys(Lw).some(function (k) { if (Lw[k] === lines && T.de && Array.isArray(T.de[k])) { de = T.de[k]; return true; } return false; }); if (!de && LANG === 'de') de = lines; TW.deL = de; if (de && de[0]) VOICE.speak(de[0]); } catch (e) {} };
  var _talkNextV = talkNext; talkNext = function () { var i0 = TW.i, wasFull = TW.lines && TW.c >= (TW.lines[TW.i] || '').length; _talkNextV(); try { if (wasFull && TW.deL && talkQ && TW.i !== i0 && TW.deL[TW.i]) VOICE.speak(TW.deL[TW.i]); else if (!talkQ && window.speechSynthesis) { /* the box closed: let the line finish */ } } catch (e) {} };
  /* arriving by train: her first words in Köln */ var _cityArriveV = cityArrive; cityArrive = function (id, how, spot) { _cityArriveV.apply(this, arguments); if (id === 'koeln' && how === 'train') setTimeout(function () { try { if (mode === 'walk' && !talkQ) { VOICE.say('koeln_arr'); fsSub('koeln_arr', null); } } catch (e) {} }, 2600); };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.voice = function () { return VOICE.voice(); }; window.ISLE_x.say = function (id) { VOICE.say(id); fsSub(id, null); return FSL[id] && FSL[id][0]; };
  /* (V62) the smoke candle: a little field-grey canister tossed ahead, then soft grey smoke billowing from it and drifting forward (the street's
     own smoke puffs, round and soft — no hard-edged shapes); a few sparks from its fuse */
  fxDream = function (p, fd) { var D = typeof DXC !== 'undefined' && TK ? DXC[TK.id] : null, c = [p[0] + fd[0] * 2.4, p[1], p[2] + fd[1] * 2.4], h0 = [p[0] + fd[0] * 0.5, p[1] + 1.15, p[2] + fd[1] * 0.5];
    var can = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 24), new THREE.MeshStandardMaterial({ color: 0x5a5e56, roughness: 0.75, metalness: 0.2 })), band = new THREE.Mesh(new THREE.CylinderGeometry(0.057, 0.057, 0.03, 24), new THREE.MeshStandardMaterial({ color: 0xe8e6de, roughness: 0.8 }));
    band.position.y = 0.035; can.add(body); can.add(band); can.position.set(h0[0], h0[1], h0[2]);
    fxAdd(can, 3.2, function (m, u, dt) { var t = u * 3.2, f = Math.min(1, t / 0.36); m.position.set(h0[0] + (c[0] - h0[0]) * f, h0[1] + (c[1] + 0.06 - h0[1]) * f + Math.sin(f * Math.PI) * 0.7, h0[2] + (c[2] - h0[2]) * f); if (f < 1) { m.rotation.x += 0.5; m.rotation.z += 0.3; } else { m.rotation.set(Math.PI / 2, Math.atan2(fd[0], fd[1]), 0); }
      if (!D || f < 1 || t > 2.9) return; m.userData.acc = (m.userData.acc || 0) + (dt || 0.016); var step = (typeof dxLow === 'function' && dxLow()) ? 0.13 : 0.08;
      while (m.userData.acc > step) { m.userData.acc -= step; var nk = (typeof isNight === 'function' && isNight()) ? 0.62 : 1, g = (0.5 + Math.random() * 0.14) * nk, a = Math.random() * 6.283, sp = 0.4 + Math.random() * 0.5;
        dxPuff(D, 'puff', [c[0] + Math.cos(a) * 0.2, c[1] + 0.15, c[2] + Math.sin(a) * 0.2], { vx: fd[0] * 1.1 + Math.cos(a) * sp, vz: fd[1] * 1.1 + Math.sin(a) * sp, vy: 0.5 + Math.random() * 0.6, s0: 0.6, s1: 2.4 + Math.random() * 1.3, c0: [g, g, g + 0.02], c1: [g * 0.8, g * 0.8, g * 0.82], a0: 0.5, life: 2.6 + Math.random() * 0.8, drag: 0.5, spin: 0.5 });
        if (Math.random() < 0.3) dxPuff(D, 'glow', [c[0], c[1] + 0.12, c[2]], { vy: 0.8, vx: (Math.random() - 0.5) * 0.8, vz: (Math.random() - 0.5) * 0.8, s0: 0.12, s1: 0.02, c0: [1, 0.62, 0.25], a0: 0.95, life: 0.4, drag: 0 }); } }); };
  /* (V62) the eighty-eight: a muzzle flash and a tracer that streaks to the target, a smoke ring at the muzzle (the impact's blast and smoke
     follow from the strike itself) */
  fxBeam = function (p, fd, len) { var D = typeof DXC !== 'undefined' && TK ? DXC[TK.id] : null, grp = new THREE.Group(), y = p[1] + 1.05;
    var flash = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.2, 32, 1, true), fxMat(0xffc86a, 0.95)); flash.rotation.x = -Math.PI / 2; flash.position.z = 1.1; grp.add(flash);
    var core = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 18), fxMat(0xfff6dc, 1)); core.position.z = 0.5; grp.add(core);
    var tracer = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.9, 6, 18), fxMat(0xfff2b8, 1)); tracer.rotation.x = Math.PI / 2; grp.add(tracer);
    var halo = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.1, 6, 18), fxMat(0xff8a2a, 0.45)); halo.rotation.x = Math.PI / 2; grp.add(halo);
    var trail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 16, 1, true), fxMat(0xffb050, 0.55)); trail.rotation.x = Math.PI / 2; grp.add(trail);
    grp.position.set(p[0], y, p[2]); grp.rotation.y = Math.atan2(fd[0], fd[1]);
    fxAdd(grp, 0.75, function (m, u) { var t = u * 0.75, f = Math.min(1, t / 0.2), z = 0.6 + f * Math.max(0.5, len - 0.6), fo = Math.max(0, 1 - t / 0.22);
      flash.material.opacity = 0.95 * fo; flash.scale.set(0.7 + t * 3, 0.7 + t * 2, 0.7 + t * 3); core.material.opacity = fo; core.scale.setScalar(1 + t * 4);
      tracer.position.z = z; halo.position.z = z; tracer.visible = halo.visible = f < 1; trail.scale.set(1, Math.max(0.001, z - 0.6), 1); trail.position.z = 0.6 + (z - 0.6) / 2; trail.material.opacity = 0.55 * (f < 1 ? 1 : Math.max(0, 1 - (t - 0.2) / 0.5)); });
    if (D) for (var i = 0; i < 6; i++) { var a = (i / 6) * 6.283, m0 = [p[0] + fd[0] * 0.9, y - p[1] + p[1], p[2] + fd[1] * 0.9]; dxPuff(D, 'puff', [m0[0] + Math.cos(a) * 0.15 * fd[1], m0[1] + Math.sin(a) * 0.15, m0[2] - Math.cos(a) * 0.15 * fd[0]], { vx: fd[0] * 1.6 + Math.cos(a) * fd[1] * 0.8, vz: fd[1] * 1.6 - Math.cos(a) * fd[0] * 0.8, vy: 0.3 + Math.sin(a) * 0.6, s0: 0.4, s1: 1.8, c0: [0.82, 0.8, 0.78], c1: [0.6, 0.59, 0.58], a0: 0.5, life: 1.4, drag: 1.2 }); } };
