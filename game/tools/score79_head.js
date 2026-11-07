  /* ---------- (V79) the score: the "Ode to Joy" theme (Beethoven, 9th Symphony, 4th movement, 1824; public domain) in a cinematic arrangement of
     this guide's own, synthesised here — no recording. Maestoso, ♩ = 104, in D: two bars of introduction (the pedal of D, a timpani roll from
     nothing, a horn far off on the theme's first four notes, a cymbal swelling into the downbeat); the first phrase in the cellos and basses,
     pianissimo; the second in the violas and second violins over the horns, the first violins joining above, crescendo; the consequent again,
     tutti (violins in two octaves, trumpets and horns on the tune, trombones and tuba on the bass, a choir on the harmony, timpani, bass drum,
     cymbals); the last bar broadening into the held chord of D and a final stroke.
     It is rendered AHEAD: the arrangement is written down once as a list of notes, cut at the bar lines, and each bar is rendered by an
     OfflineAudioContext (off the main thread, while the world loads) into a four-channel buffer — the dry mix and the hall's send, each in
     stereo. The film then plays the bars as buffers through one hall (a convolver) and one compressor: a handful of nodes on the audio thread
     instead of thousands of oscillators and filters, so that a phone plays it without the audio thread overrunning (V78's live synthesis did). ---------- */
  var KSC = { ev: null, CH: null, bufs: [], busy: false, sr: 48000, ms: [], err: null, end: 0, vol: 0.62, t0: 0 };
  function kscOff(len, ch) { var O = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!O) return null; try { return new O(ch || 2, Math.max(128, Math.ceil(len * KSC.sr)), KSC.sr); } catch (e) { return null; } }
  /* the recorder: the arrangement's calls become notes { k: instrument, a: its arguments, t: start, end: when its sound has died away } */
  function kscRec() { var EV = [], I = {};
    function rec(k, ti, endf) { I[k] = function () { var a = Array.prototype.slice.call(arguments); EV.push({ k: k, a: a, ti: ti, t: a[ti], end: endf(a) }); }; }
    function nEnd(a) { var o = a[4] || {}; return a[1] + Math.max(a[2], (o.att || 0.3) + 0.03) + (o.rel || 0.5) + 0.14; }
    ['strings', 'horn', 'trumpet', 'lowBrass', 'choir'].forEach(function (k) { rec(k, 1, nEnd); });
    rec('timp', 1, function (a) { return a[1] + (a[3] || 1.3) + 0.1; }); rec('bassDrum', 0, function (a) { return a[0] + 0.85; }); rec('cymbal', 0, function (a) { return a[0] + 2.7; }); rec('cymSwell', 0, function (a) { return a[0] + a[1] + 1.55; });
    rec('drone', 1, function (a) { return a[1] + Math.max(2.25, a[2]) + 0.9; }); rec('shimmer', 1, function (a) { return a[1] + Math.max(1.65, a[2]) + 1.3; });
    /* (a roll is written out as its strokes, so that each falls in its own bar) */ I.timpRoll = function (n, t0, t1, v0, v1) { var t = t0; while (t < t1) { var p = (t - t0) / (t1 - t0); I.timp(n, t, (v0 + (v1 - v0) * p) * (0.85 + Math.random() * 0.3), 0.5); t += 0.055 + Math.random() * 0.02; } };
    return { I: I, EV: EV }; }
  /* the score cut into bars: each bar holds the notes that start in it; its buffer runs on until the last of them has died away */
  function kscBuild() { if (KSC.ev) return; var R = kscRec(), A = kscArrange(R.I), CH = [], b; KSC.ev = R.EV; KSC.end = A.end;
    for (b = 0; b < 14; b++) CH.push({ c0: A.BT[b * 4], c1: A.BT[b * 4 + 4], ev: [] }); CH.push({ c0: A.BT[56], c1: 1e9, ev: [] });
    R.EV.forEach(function (e) { var k; for (k = 0; k < CH.length; k++) if (e.t < CH[k].c1 - 1e-6) break; CH[Math.min(k, CH.length - 1)].ev.push(e); });
    CH.forEach(function (c) { var m = c.c1 < 1e8 ? c.c1 : c.c0; c.ev.forEach(function (e) { if (e.end > m) m = e.end; }); c.len = m - c.c0 + 0.05; }); KSC.CH = CH; }
  /* one bar to a buffer */
  function kscRender(k, done) { var c = KSC.CH[k], ctx = kscOff(c.len, 4), t0 = (window.performance ? performance.now() : Date.now()); if (!ctx) { KSC.err = 'offline'; done(); return; }
    var I = kscInst(ctx); c.ev.forEach(function (e) { var a = e.a.slice(); a[e.ti] -= c.c0; try { I[e.k].apply(null, a); } catch (er) { KSC.err = String(er); } });
    function got(buf) { KSC.bufs[k] = buf; KSC.ms[k] = Math.round((window.performance ? performance.now() : Date.now()) - t0); done(); }
    try { ctx.oncomplete = function (ev) { if (!KSC.bufs[k] && ev && ev.renderedBuffer) got(ev.renderedBuffer); }; var pr = ctx.startRendering(); if (pr && pr.then) pr.then(function (buf) { if (!KSC.bufs[k]) got(buf); }, function (er) { KSC.err = String(er); done(); }); } catch (er) { KSC.err = String(er); done(); } }
  /* the bars are rendered one after another, as soon as the guide's game is opened (the film then finds them ready) */
  function kscPrep() { if (KSC.busy || KSC.err) return; try { kscBuild(); } catch (e) { KSC.err = String(e); return; } var k = 0; while (k < KSC.CH.length && KSC.bufs[k]) k++; if (k >= KSC.CH.length) return;
    KSC.busy = true; kscRender(k, function () { KSC.busy = false; try { kscPump(); } catch (e) {} if (KSC.wait && kscReady()) { var f = KSC.wait; KSC.wait = null; f(); } setTimeout(kscPrep, 0); }); }
  function kscReady() { return !!(KSC.CH && KSC.bufs.length === KSC.CH.length && KSC.bufs.every(function (b) { return !!b; })); }
