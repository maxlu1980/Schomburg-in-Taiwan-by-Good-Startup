  /* ===== ISLE part K15 (Köln, V71): the people and Mira's weapons. When a weapon comes out or goes off near them, each passer-by reacts
     in their own way: most run, some break down where they stand (down on their haunches, arms over the head, trembling), and a few —
     walkers, shop and station staff, never more than two at a time — come up to her with a hand out to make her stop; a second blast
     near them sends them running too. They say so in a speech bubble (German, as Köln speaks, with the player's language under it).
     Anyone knocked down shouts "FUBAR!" (the old army slang) as they hit the ground, and gets up again. Nobody is hurt by the weapons:
     they still only hit things. ===== */
  var KCR = { bubs: [], el: null, fubT: 0, ttsT: 0, v: new THREE.Vector3() };
  var KCL = { flee: [['Weg hier!', '快跑！', 'Get out of here!'], ['Lauf!', '快逃！', 'Run!'], ['Hilfe!', '救命！', 'Help!']],
    cower: [['Nein, nein, nein …', '不、不、不……', 'No, no, no …'], ['Oh Gott …', '天啊……', 'Oh God …'], ['Bitte nicht …', '拜託不要……', 'Please, no …']],
    stop: [['Aufhören!', '住手！', 'Stop it!'], ['Lassen Sie das!', '別這樣！', 'Put that down!'], ['Sind Sie verrückt?!', '你瘋了嗎？！', 'Are you mad?!'], ['Ich rufe die Polizei!', '我要報警！', "I'm calling the police!"]],
    back: [['Okay, okay …', '好、好……', 'Okay, okay …'], ['Ich bin weg!', '我走了！', "I'm off!"]],
    fubar: [['FUBAR!', '', '']] };
  function kcrHuman(n) { return n && n.A && (n.kind === 'ped' || n.kind === 'tped' || n.kind === 'reg' || n.kind === 'driver' || n.kind === 'vendor' || n.kind === 'staff'); }
  function kcrPick(a) { return a[Math.floor(Math.random() * a.length)]; }
  /* a speech bubble over a person's head, following them; the German line, the player's language under it */
  function kcrSay(n, key, delay) { var L = kcrPick(KCL[key]); setTimeout(function () { if (!root || !n || !n.A || n.gone) return; if (!KCR.el) { KCR.el = document.createElement('div'); KCR.el.className = 'isle__bubs'; KCR.el.setAttribute('aria-hidden', 'true'); root.appendChild(KCR.el); }
      if (KCR.bubs.length >= 6) { var o = KCR.bubs.shift(); if (o.el.parentNode) o.el.parentNode.removeChild(o.el); }
      KCR.bubs.forEach(function (b) { if (b.n === n) b.life = Math.min(b.life, b.t + 0.15); });
      var e = document.createElement('div'), fub = key === 'fubar'; e.className = 'isle__bub' + (fub ? ' isle__bub--fubar' : key === 'stop' ? ' isle__bub--stop' : '');
      var sub = LANG === 'zh' ? L[1] : LANG === 'en' ? L[2] : ''; e.innerHTML = '<b></b>' + (sub ? '<small></small>' : ''); e.querySelector('b').textContent = L[0]; if (sub) e.querySelector('small').textContent = sub; KCR.el.appendChild(e);
      KCR.bubs.push({ n: n, el: e, t: 0, life: fub ? 1.9 : 2.4 }); }, (delay || 0) * 1000); }
  function kcrBubTick(dt) { if (!KCR.bubs.length) return; var w = root ? root.clientWidth : 0, h = root ? root.clientHeight : 0;
    KCR.bubs = KCR.bubs.filter(function (b) { b.t += dt; var gone = b.t > b.life || !b.n.A || b.n.gone || b.n.off || !b.n.A.root.visible; if (gone) { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); return false; }
      var top = b.n.ko ? 1.15 : b.n.A.mode === 'cower' ? 1.1 : 1.7; KCR.v.set(0, top, 0); b.n.A.root.localToWorld(KCR.v); if (b.n.ko) KCR.v.y += 0.5; var s = scr(KCR.v.x, KCR.v.y, KCR.v.z); if (!s.on) { b.el.style.opacity = '0'; return true; }
      var a = Math.min(1, b.t / 0.12) * Math.min(1, (b.life - b.t) / 0.3); b.el.style.opacity = String(a); b.el.style.transform = 'translate(' + Math.round(Math.max(60, Math.min(w - 60, s.x))) + 'px,' + Math.round(Math.max(40, Math.min(h - 20, s.y))) + 'px) translate(-50%,-100%) scale(' + (0.7 + 0.3 * Math.min(1, b.t / 0.14)) + ')'; return true; }); }
  /* the army's old word, said aloud too (once in a while, in an English voice) */
  function kcrFubar(n) { var now = performance.now() / 1000; kcrSay(n, 'fubar', 0); if (muted() || now - KCR.ttsT < 1.4 || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined' || window.speechSynthesis.speaking) return; KCR.ttsT = now;
    try { var u = new SpeechSynthesisUtterance('FUBAR!'); u.lang = 'en-US'; u.rate = 1.05; u.pitch = 0.75 + Math.random() * 0.6; u.volume = 0.85; window.speechSynthesis.speak(u); } catch (e) {} }
  /* taking a person over from the street's routine, and giving them back */
  function kcrTake(n) { if (n.p && n.p.st !== 'gs') { n.pPrev = n.p.st; n.p.st = 'gs'; } if (n.seat) { var p = n.A.root.position; n.seat = false; p.y = gGround(p.x, p.z, p.y); } }
  function kcrStart(n, k) { kcrTake(n); var d0 = Math.random() * 0.5;
    if (k === 'flee') { n.flee = Math.max(n.flee || 0, 4 + Math.random() * 3); if (LUNA.expr) LUNA.expr(n.A, 'wide', 2.5); if (Math.random() < 0.4) kcrSay(n, 'flee', d0); return; }
    n.flee = 0; idleNpc(n); n.rx = { k: k, t: 0, dur: k === 'cower' ? 4.5 + Math.random() * 3.5 : 5 + Math.random() * 2.5, said: false };
    if (k === 'cower') { LUNA.setMode(n.A, 'cower'); var me = nL(n), Lu = gL(); n.A.root.rotation.y = Math.atan2(Lu[0] - me[0], Lu[2] - me[2]) + (Math.random() < 0.5 ? Math.PI : 0); if (Math.random() < 0.65) kcrSay(n, 'cower', d0 + 0.2); } }
  function kcrEnd(n, next) { var was = n.rx && n.rx.k; n.rx = null; if (LUNA.expr) LUNA.expr(n.A, 'open', 0); if (n.A.mode === 'cower' || n.A.mode === 'halt') LUNA.setMode(n.A, 'idle');
    if (next === 'flee') { n.flee = 3 + Math.random() * 2.5; if (was === 'stop') kcrSay(n, 'back', 0.1); return; } idleNpc(n); if (n.p && n.pPrev) { n.p.st = n.pPrev; n.pPrev = null; } }
  /* each frame, for a person who is reacting (the street's own routine waits): true when handled */
  function kcrStep(n, dt) { var X = n.rx; if (!X) return false; X.t += dt; var me = nL(n), Lu = gL(), dx = Lu[0] - me[0], dz = Lu[2] - me[2], d = Math.hypot(dx, dz) || 1;
    if (X.k === 'cower') { if (n.A.mode !== 'cower' && n.A.mode !== 'stagger') LUNA.setMode(n.A, 'cower'); if (X.t > X.dur) kcrEnd(n, Math.random() < 0.5 ? 'flee' : 'idle'); return true; }
    /* coming up to her: to about two metres, then the hand out, a word; back to their way after a while, or when she walks off */
    if (d > 30 || (X.t0 != null && X.t - X.t0 > X.dur) || (X.t0 == null && X.t > 14)) { kcrEnd(n, 'idle'); return true; }
    if (d > 2.3 && !X.at) { stepNpc(n, Lu[0] - dx / d * 2.0, Lu[2] - dz / d * 2.0, d > 8 ? 3.2 : 2.3, dt); return true; }
    if (X.t0 == null) X.t0 = X.t; X.at = true; n.A.speed = 0; var R = n.A.root, ry = Math.atan2(dx, dz), da = Math.atan2(Math.sin(ry - R.rotation.y), Math.cos(ry - R.rotation.y)); R.rotation.y += da * Math.min(1, dt * 8);
    if (n.A.mode !== 'halt') LUNA.setMode(n.A, 'halt'); if (!X.said) { X.said = true; kcrSay(n, 'stop', 0.05); } else if (!X.said2 && X.t - X.t0 > X.dur * 0.6) { X.said2 = true; if (Math.random() < 0.5) kcrSay(n, 'stop', 0); } if (d < 1.4) X.at = false; return true; }
  /* (V72) only an attack they meet makes people react: a shot fired near them (its crack where she stands, its strike where it lands),
     a blast, things breaking — never the mere sight of a weapon in her hands. Each person must perceive it: on the same level, near
     enough, and either very close (they hear it) or with a clear line of sight to it (walls, the station's halls and the cathedral
     shield them); the farther away, the likelier they only glance and go on. Those who come up to stop her must have seen it. */
  function kcrLOS(T, p, L) { var x0 = p.x, y0 = p.y + 1.5, z0 = p.z, x1 = L[0], y1 = (L[1] || 0) + 1.0, z1 = L[2], d = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(d / 1.4)), i;
    if (!TKM || !TKM.camSolid) return true; for (i = 1; i < n; i++) { var u = i / n; if (u * d < 0.8 || (1 - u) * d < 0.8) continue; if (TKM.camSolid(T, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u)) return false; } return true; }
  function kcrThreat(L, R, kind) { if (!TK || TK.id !== 'koeln' || !GS || !GS.npcs || !L) return; var T = TK.T, Lu = gL(), stops = GS.npcs.filter(function (n) { return n.rx && n.rx.k === 'stop'; }).length; KCR.last = { kind: kind, R: R, n: 0 };
    GS.npcs.forEach(function (n) { if (n.ko || n.gone || n.off || !kcrHuman(n) || !n.A.root.visible) return; var p = n.A.root.position, d = Math.hypot(p.x - L[0], p.z - L[2]); if (d >= R || Math.abs(p.y - (L[1] || 0)) > 3) return;
      var sees = d < 4.5 || kcrLOS(T, p, L); if (!sees && !(kind === 'blast' && d < R * 0.55)) return;
      var pr = d < R * 0.45 ? 1 : 1 - (d - R * 0.45) / (R * 0.55) * 0.7; if (!window.KCR_FORCE && Math.random() > pr) return;
      if (n.rx) { if (n.rx.k === 'stop' && d < Math.max(6, R * 0.6)) kcrEnd(n, 'flee'); return; } if (n.flee > 0) return; KCR.last.n++;
      var dm = Math.hypot(p.x - Lu[0], p.z - Lu[2]), r = Math.random(), can = sees && kind !== 'blast' && (n.kind === 'ped' || n.kind === 'tped' || n.kind === 'staff' || n.kind === 'vendor') && dm > 4 && dm < 18 && stops < 2 && d > 3.5;
      if (window.KCR_FORCE && (window.KCR_FORCE !== 'stop' || can)) { kcrStart(n, window.KCR_FORCE); return; }
      if (can && r < 0.24) { stops++; kcrStart(n, 'stop'); } else if (n.kind === 'driver' ? r < 0.15 : r < 0.5) kcrStart(n, 'cower'); else kcrStart(n, 'flee'); }); }
  /* a gun's shot: its crack round her (at most every third of a second) and its strike where it lands */
  function kcrShot(Lu, E) { var now = performance.now() / 1000; if (now - (KCR.shotT || 0) < 0.33) return; KCR.shotT = now; kcrThreat(Lu, 13, 'shot'); if (E) kcrThreat(E, 5, 'hit'); }
  /* the blasts and the breaking things (the old panic of the street play): its reach scaled to what a person would notice */
  var _dxPanicK = dxPanic; dxPanic = function (L, R) { if (!TK || TK.id !== 'koeln' || !GS || !GS.npcs) return _dxPanicK(L, R); kcrThreat(L, Math.min(24, R * 0.55), 'blast'); };
  /* knocked down: "FUBAR!" as they hit the ground */
  var _knockKC = knock; knock = function (n, dirL, hard) { var was = !!n.ko; if (n.rx && !was) { n.rx = null; if (LUNA.expr) LUNA.expr(n.A, 'open', 0); } _knockKC(n, dirL, hard); if (!was && n.ko && TK && TK.id === 'koeln' && n.kind !== 'master' && n.kind !== 'boss') n.ko.fub = 0.3 + Math.random() * 0.3; };
  var _koStepKC = koStep; koStep = function (n, dt) { var K2 = n.ko; _koStepKC(n, dt); if (K2 && K2.fub != null && K2.t >= K2.fub) { K2.fub = null; kcrFubar(n); } };
  var _extraTickKC = extraTick; extraTick = function (dt, ts) { _extraTickKC(dt, ts); try { kcrBubTick(dt); } catch (e) { if (window.ISLE_TEST) throw e; } };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.crowd = function () { var c = { flee: 0, cower: 0, stop: 0, ko: 0, bubs: KCR.bubs.length, last: KCR.last || null }; (GS && GS.npcs || []).forEach(function (n) { if (n.ko) c.ko++; else if (n.rx) c[n.rx.k]++; else if (n.flee > 0) c.flee++; }); c.lines = KCR.bubs.map(function (b) { return b.el.textContent; }); return c; };
