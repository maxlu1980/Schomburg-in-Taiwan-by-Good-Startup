  /* the player: the clips are decoded once (Web Audio) and played on her own channel; a new line cuts the last one off, as a person would;
     the audio is unlocked by the first tap or key (the browsers' rule); a line with no clip falls back to the device's speech engine */
  (function () { var ctx = null, out = null, cache = {}, cur = null, warm = false, byText = {};
    function norm(t) { return String(t || '').replace(/[«»„“”"]/g, '').replace(/\s+/g, ' ').trim(); }
    Object.keys(VOXT).forEach(function (k) { if (!byText[norm(VOXT[k])]) byText[norm(VOXT[k])] = k; });
    function quiet() { try { return (typeof SimAudio !== 'undefined' && SimAudio.muted()) || (typeof tkMuted === 'function' && tkMuted()) || (typeof AU !== 'undefined' && AU.isMuted && AU.isMuted()) || document.hidden; } catch (e) { return false; } }
    function ac() { if (ctx) return ctx; var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ctx = new C(); out = ctx.createGain(); out.gain.value = 1; out.connect(ctx.destination); } catch (e) { ctx = null; } return ctx; }
    function decode(k, cb) { var e = cache[k]; if (e) { if (e.buf) cb(e.buf); else e.wait.push(cb); return; } var c = ac(); if (!c || !VOXC[k]) return; e = cache[k] = { buf: null, wait: [cb] };
      try { var bin = atob(VOXC[k]), u = new Uint8Array(bin.length), i; for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        var ok = function (b) { e.buf = b; var w = e.wait; e.wait = []; w.forEach(function (f) { f(b); }); }, bad = function () { delete cache[k]; }, p = c.decodeAudioData(u.buffer, ok, bad); if (p && p.catch) p.catch(bad); } catch (er) { delete cache[k]; } }
    function unlock() { var c = ac(); if (!c) return; if (c.state === 'suspended' && c.resume) c.resume().catch(function () {}); if (!warm) { warm = true; try { var b = c.createBuffer(1, 1, 22050), s0 = c.createBufferSource(); s0.buffer = b; s0.connect(c.destination); s0.start(0); } catch (e) {}
        /* decode the clips in the background, a few at a time */ var ks = Object.keys(VOXC), n = 0; (function next() { var k = ks[n++]; if (!k) return; decode(k, function () {}); setTimeout(next, 40); })(); } }
    ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (ev) { window.addEventListener(ev, unlock, { capture: true, passive: true }); });
    function stop() { if (cur && cur.src) { try { cur.src.stop(); } catch (e) {} } cur = null; }
    function play(k) { var c = ac(); if (!c || !VOXC[k]) return false; if (quiet()) return true; if (c.state === 'suspended' && c.resume) c.resume().catch(function () {}); stop(); var tok = { k: k }; cur = tok;
      decode(k, function (b) { if (cur !== tok || quiet()) return; try { var s1 = c.createBufferSource(); s1.buffer = b; s1.connect(out); s1.start(); tok.src = s1; s1.onended = function () { if (cur === tok) cur = null; }; } catch (e) {} }); return true; }
    var _say = VOICE.say, _speak = VOICE.speak;
    VOICE.say = function (id) { if (VOXC[id] && play(id)) return; return _say(id); };
    VOICE.speak = function (text, o) { var k = byText[norm(text)]; if (k && play(k)) return; return _speak(text, o); };
    VOICE.voice = function () { return 'Mira (Supertonic 3, de) — ' + Object.keys(VOXC).length + ' clips' + (ctx ? ', audio ' + ctx.state : ''); };
    VOICE.clip = function (k) { return !!VOXC[k]; }; VOICE.ready = function () { return Object.keys(cache).filter(function (k) { return cache[k] && cache[k].buf; }).length; }; VOICE.playing = function () { return cur ? cur.k : null; };
  })();
