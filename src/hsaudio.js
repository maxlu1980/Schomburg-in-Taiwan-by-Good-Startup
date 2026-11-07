/* ===== HSA — the jobsite in sound =====
   Every sound here is synthesised from noise and oscillators at run time, modelled on the real equipment: the spectrum and the pulse rate of each machine, how it changes
   under load, the stroke of a hand tool, the water and the concrete. No recordings are embedded, so the page stays self-contained and the sounds can follow the work —
   the level and the stroke speed of the tool you hold, the vibrator in the pour, the drips of a wet basement, the diesel idling outside a pour.
   API: HSA.init() on a user gesture · HSA.open(ambientKey) / HSA.close() · HSA.work(key, level, speed) every frame (key null for no tool) · HSA.event(name, arg) ·
        HSA.mute(bool) / HSA.muted() / HSA.toggle() · HSA.has() */
var HSA = (function () {
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, out = null, comp = null, B = {}, room = null, WHITE = null, PINK = null, muted = false, voice = null, voiceKey = null, amb = null, ambKey = null, isOpen = false, lastWork = 0, ambTimer = 0, listeners = [];
  try { muted = localStorage.getItem('hsim-sound') === 'off'; } catch (e) {}
  function has() { return !!AC; }
  function init() { /* on a gesture: the context, the compressor that keeps the mix civil, the three buses and a small room */
    if (ctx || !AC) return !!ctx; try { ctx = new AC(); } catch (e) { return false; }
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 14; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.22;
    out = ctx.createGain(); out.gain.value = muted ? 0 : 0.85; comp.connect(out); out.connect(ctx.destination);
    ['amb', 'tool', 'fx'].forEach(function (k, i) { B[k] = ctx.createGain(); B[k].gain.value = [0.5, 0.8, 0.7][i]; if (k === 'tool') { var pn = pan(0.18); B[k].connect(pn); pn.connect(comp); } else B[k].connect(comp); });
    /* the room: two short feedback delays with a dull tail, fed a little from the tools and the events — a basement, not a studio */
    room = g(0.16); var d1 = ctx.createDelay(0.1), d2 = ctx.createDelay(0.1), fb1 = g(0.32), fb2 = g(0.28), lp1 = f('lowpass', 2200), rg = g(0.5); d1.delayTime.value = 0.029; d2.delayTime.value = 0.047;
    room.connect(d1); room.connect(d2); d1.connect(fb1); fb1.connect(lp1); lp1.connect(d1); d2.connect(fb2); fb2.connect(d2); d1.connect(rg); d2.connect(rg); rg.connect(comp);
    B.tool.connect(room); B.fx.connect(room);
    document.addEventListener('visibilitychange', function () { if (!ctx) return; if (document.hidden) { if (ctx.state === 'running') ctx.suspend(); } else if (isOpen && !muted && ctx.state === 'suspended') ctx.resume(); });
    return true;
  }
  function resume() { if (ctx && ctx.state === 'suspended' && !muted) ctx.resume(); }
  /* ----- sources and node helpers ----- */
  function noiseBuf(pinkish) { var n = Math.floor(ctx.sampleRate * 2), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), i, w, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (i = 0; i < n; i++) { w = Math.random() * 2 - 1; if (!pinkish) { d[i] = w; continue; }
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856; b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; }
    return b; }
  function white() { if (!WHITE) WHITE = noiseBuf(false); var s = ctx.createBufferSource(); s.buffer = WHITE; s.loop = true; s.loopStart = Math.random() * 1.5; s.start(); return s; }
  function pink() { if (!PINK) PINK = noiseBuf(true); var s = ctx.createBufferSource(); s.buffer = PINK; s.loop = true; s.loopStart = Math.random() * 1.5; s.start(); return s; }
  function g(v) { var n = ctx.createGain(); n.gain.value = v; return n; }
  function f(type, fr, q) { var n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = fr; if (q != null) n.Q.value = q; return n; }
  function o(type, fr) { var n = ctx.createOscillator(); n.type = type; n.frequency.value = fr; n.start(); return n; }
  function pulse(fr, k) { /* a pulse-train oscillator: cosines of falling weight — one sharp peak per period, the impacts of a breaker or a hammer drill, used as a gain modulator */
    var n = Math.min(48, k || 24), re = new Float32Array(n + 1), im = new Float32Array(n + 1), i; for (i = 1; i <= n; i++) re[i] = 1 - (i - 1) / (n + 1);
    var s = ctx.createOscillator(); s.setPeriodicWave(ctx.createPeriodicWave(re, im)); s.frequency.value = fr; s.start(); return s; }
  function am(node, lfoType, fr, depth, base) { /* amplitude modulation: node's gain = base + depth·lfo */ var l = o(lfoType, fr), d = g(depth); node.gain.value = base; l.connect(d); d.connect(node.gain); return l; }
  function chain() { var i; for (i = 0; i + 1 < arguments.length; i++) arguments[i].connect(arguments[i + 1]); return arguments[arguments.length - 1]; }
  function pan(v) { try { var p = ctx.createStereoPanner(); p.pan.value = v; return p; } catch (e) { return g(1); } }
  function tgt(param, v, tc) { param.setTargetAtTime(v, ctx.currentTime, tc == null ? 0.05 : tc); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  /* a voice: nodes it owns (stopped and dropped at the end), its output, a per-frame tick(level, speed, now) */
  function V() { var v = { nodes: [], out: g(1), env: g(1) }; v.out.connect(v.env); v.use = function () { var i; for (i = 0; i < arguments.length; i++) v.nodes.push(arguments[i]); return arguments[0]; }; return v; }
  function kill(v, secs) { if (!v) return; var t = ctx.currentTime; try { v.env.gain.cancelScheduledValues(t); v.env.gain.setValueAtTime(v.env.gain.value, t); v.env.gain.linearRampToValueAtTime(0, t + secs); } catch (e) {}
    setTimeout(function () { v.nodes.forEach(function (n) { try { if (n.stop) n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} }); try { v.out.disconnect(); v.env.disconnect(); } catch (e) {} }, secs * 1000 + 60); }
  /* a stroke: hand tools move back and forth; with no pointer speed given, the stroke is a slow swing of its own */
  function stroke(v, hz) { v.sw = 0; v.strokeOf = function (speed, dt) { if (speed != null) return Math.max(0, Math.min(1, speed)); v.sw += dt * hz * Math.PI * 2; return 0.5 + 0.5 * Math.sin(v.sw); }; }

  /* ===== the tools ===== */
  var R = {}, TRIM = { chipper: 2.2, cutter: 1.7, blaster: 0.8, trowel: 1.6, notched: 1.6, rule: 1.8, sponge: 1.8, hand: 1.2, roller: 1.7, vacuum: 1.6, gun: 3, waterstop: 1.4, drill: 1.6, air: 0.85, ratchet: 4, mixer: 1.25 }; /* the loudness of each tool next to the others, measured on the master */
  R.jet = function () { /* high-pressure water jet lance (≈ 500 bar): a dense broadband hiss with the impact of the water on the wall, the pump unit pulsing behind it */
    var v = V(), bp = v.use(f('bandpass', 2800, 0.7)), hg = v.use(g(0.55)); chain(v.use(white()), v.use(f('highpass', 700)), bp, hg, v.out); chain(v.use(white()), v.use(f('bandpass', 7000, 1)), v.use(g(0.18)), v.out);
    chain(v.use(pink()), v.use(f('lowpass', 260)), v.use(g(0.4)), v.out); var pumpG = v.use(g(0.08)); chain(v.use(o('sawtooth', 48)), v.use(f('lowpass', 320)), pumpG, v.out); v.use(am(pumpG, 'sine', 24, 0.035, 0.08));
    v.bp = bp; v.hg = hg; v.t = 0; v.attack = 0.06;
    v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.09) { v.t = 0; tgt(v.hg.gain, 0.55 * level * rnd(0.82, 1.1), 0.06); tgt(v.bp.frequency, rnd(2400, 3400), 0.08); } }; return v; };
  R.chipper = function () { /* chipping hammer: ≈ 28 impacts a second — each a sharp crack and a thud — over the breath of its air exhaust and the motor */
    var v = V(), P = v.use(pulse(28, 28)), crackG = v.use(g(0)), thudG = v.use(g(0)); P.connect(crackG.gain); P.connect(thudG.gain);
    chain(v.use(white()), v.use(f('bandpass', 1900, 1.4)), crackG, v.use(g(0.5)), v.out); chain(v.use(o('sine', 72)), thudG, v.use(g(0.45)), v.out);
    chain(v.use(white()), v.use(f('bandpass', 4200, 0.8)), v.use(g(0.05)), v.out); chain(v.use(o('sawtooth', 55)), v.use(f('lowpass', 220)), v.use(g(0.05)), v.out);
    v.P = P; v.t = 0; v.attack = 0.05; v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.25) { v.t = 0; tgt(v.P.frequency, rnd(26, 30), 0.1); } tgt(v.out.gain, level, 0.05); }; return v; };
  R.cutter = function () { /* disc cutter on concrete: the motor's fundamental and its whine, then the screech of the disc in the cut, grit flying — the pitch sags under load */
    var v = V(), motor = v.use(o('sawtooth', 124)); chain(motor, v.use(f('lowpass', 900)), v.use(g(0.13)), v.out); chain(v.use(o('square', 2480)), v.use(f('bandpass', 2480, 9)), v.use(g(0.035)), v.out);
    var scG = v.use(g(0.3)); chain(v.use(white()), v.use(f('bandpass', 3200, 3)), scG, v.out); var sc2 = v.use(g(0.12)); chain(v.use(white()), v.use(f('bandpass', 5600, 4)), sc2, v.out); chain(v.use(white()), v.use(f('highpass', 6500)), v.use(g(0.07)), v.out);
    v.motor = motor; v.scG = scG; v.sc2 = sc2; v.t = 0; v.load = 0.6; v.attack = 0.12;
    v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.16) { v.t = 0; v.load = Math.max(0.25, Math.min(1, v.load + rnd(-0.25, 0.25))); tgt(v.scG.gain, 0.3 * v.load * level, 0.1); tgt(v.sc2.gain, 0.12 * v.load * level, 0.1); tgt(v.motor.frequency, 124 - 14 * v.load, 0.12); } }; return v; };
  R.blaster = function () { /* sandblast gun: abrasive hiss over the compressor, the grit crackling off the steel */
    var v = V(); chain(v.use(white()), v.use(f('highpass', 1500)), v.use(g(0.42)), v.out); chain(v.use(white()), v.use(f('bandpass', 8000, 1)), v.use(g(0.2)), v.out);
    var cg = v.use(g(0.1)); chain(v.use(o('sawtooth', 40)), v.use(f('lowpass', 150)), cg, v.out); v.use(am(cg, 'sine', 12, 0.04, 0.1)); var crG = v.use(g(0.15)); chain(v.use(white()), v.use(f('bandpass', 2500, 0.6)), crG, v.out);
    v.crG = crG; v.t = 0; v.attack = 0.07; v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.06) { v.t = 0; tgt(v.crG.gain, rnd(0.08, 0.38) * level, 0.03); } }; return v; };
  R.shot = function () { /* shot blaster on a floor: a heavy electric motor, the roar of steel shot in the blast wheel, the dust extractor */
    var v = V(); chain(v.use(o('sawtooth', 60)), v.use(f('lowpass', 260)), v.use(g(0.2)), v.out); chain(v.use(o('sawtooth', 91)), v.use(f('lowpass', 300)), v.use(g(0.1)), v.out); chain(v.use(o('square', 182)), v.use(f('bandpass', 182, 5)), v.use(g(0.07)), v.out);
    var roar = v.use(g(0.4)); chain(v.use(pink()), v.use(f('bandpass', 900, 0.6)), roar, v.out); chain(v.use(white()), v.use(f('bandpass', 3000, 0.8)), v.use(g(0.15)), v.out); chain(v.use(pink()), v.use(f('bandpass', 500, 1)), v.use(g(0.1)), v.out);
    v.roar = roar; v.t = 0; v.attack = 0.5; v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.2) { v.t = 0; tgt(v.roar.gain, rnd(0.32, 0.46) * level, 0.15); } }; return v; };
  R.hose = function () { /* a hose rinsing the wall: the water's rush, its gurgle, the spray splashing off the surface */
    var v = V(), wg = v.use(g(0.35)); chain(v.use(pink()), v.use(f('lowpass', 1800)), wg, v.out); chain(v.use(white()), v.use(f('bandpass', 2500, 0.8)), v.use(g(0.12)), v.out); var sp = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 1200, 1)), sp, v.out);
    v.wg = wg; v.sp = sp; v.t = 0; v.s = 0; v.attack = 0.1;
    v.tick = function (level, speed, now, dt) { v.t += dt; v.s += dt; if (v.t > 0.15) { v.t = 0; tgt(v.wg.gain, rnd(0.22, 0.4) * level, 0.1); } if (v.s > rnd(0.2, 0.5)) { v.s = 0; v.sp.gain.setValueAtTime(0.22 * level, now); v.sp.gain.exponentialRampToValueAtTime(0.001, now + 0.06); } }; return v; };
  R.brush = function () { /* brushing a slurry on: the swish of the bristles with each stroke, the wet slap under it */
    var v = V(), sw = v.use(g(0)), br = v.use(g(0)), wet = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 1400, 0.9)), sw, v.out); chain(v.use(white()), v.use(f('highpass', 4000)), br, v.out); chain(v.use(pink()), v.use(f('lowpass', 600)), wet, v.out); stroke(v, 1.1);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(sw.gain, level * (0.05 + 0.45 * s), 0.04); tgt(br.gain, level * 0.3 * s, 0.04); tgt(wet.gain, level * 0.4 * s, 0.06); }; return v; };
  R.trowel = function () { /* a steel trowel on mortar: the scrape of the blade, the slap of the mortar, a faint ring of the steel */
    var v = V(), sc = v.use(g(0)), sl = v.use(g(0)), rg = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 2600, 2.5)), sc, v.out); chain(v.use(pink()), v.use(f('lowpass', 500)), sl, v.out); chain(v.use(o('sine', 3100)), rg, v.out); stroke(v, 1.2);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(sc.gain, level * 0.35 * s, 0.04); tgt(sl.gain, level * 0.3 * s, 0.05); tgt(rg.gain, level * 0.012 * s, 0.05); }; return v; };
  R.notched = function () { var v = R.trowel(), r = v.use(g(0)); chain(v.use(white()), v.use(f('highpass', 3500)), r, v.out); var t0 = v.tick; v.tick = function (level, speed, now, dt) { t0(level, speed, now, dt); tgt(r.gain, level * 0.15 * v.strokeOf(speed, 0), 0.04); }; return v; };
  R.rule = function () { /* a straightedge drawn over fresh mortar */ var v = V(), sc = v.use(g(0)), sl = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 1800, 1.5)), sc, v.out); chain(v.use(pink()), v.use(f('lowpass', 400)), sl, v.out); stroke(v, 0.6);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(sc.gain, level * 0.25 * s, 0.05); tgt(sl.gain, level * 0.22 * s, 0.06); }; return v; };
  R.sponge = function () { /* a sponge board floating the surface */ var v = V(), w = v.use(g(0)), gr = v.use(g(0)); chain(v.use(pink()), v.use(f('lowpass', 900)), w, v.out); chain(v.use(white()), v.use(f('bandpass', 2000, 1)), gr, v.out); stroke(v, 0.9);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(w.gain, level * 0.28 * s, 0.05); tgt(gr.gain, level * 0.07 * s, 0.05); }; return v; };
  R.hand = function () { /* pressing a fast-setting plug into a leak by hand: the squelch of the mortar, the trickle that gives way */ var v = V(), sq = v.use(g(0)), tr = v.use(g(0.1)); chain(v.use(pink()), v.use(f('lowpass', 700)), sq, v.out); chain(v.use(pink()), v.use(f('bandpass', 1200, 1)), tr, v.out); stroke(v, 0.9);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(sq.gain, level * 0.3 * s, 0.05); tgt(tr.gain, level * 0.1, 0.1); }; return v; };
  R.spray = function () { /* airless spray gun: a steady fine hiss, the pump's piston thumping behind it */
    var v = V(); chain(v.use(white()), v.use(f('highpass', 2000)), v.use(g(0.4)), v.out); chain(v.use(white()), v.use(f('bandpass', 900, 1)), v.use(g(0.1)), v.out); var pg = v.use(g(0.06)); chain(v.use(o('sine', 60)), pg, v.out); v.use(am(pg, 'square', 1.6, 0.04, 0.06));
    v.attack = 0.05; v.tick = function (level) { tgt(v.out.gain, level, 0.05); }; return v; };
  R.sprayMortar = function () { /* wet-spray mortar machine: a thicker hiss, the compressor, the mortar splattering on the face */
    var v = V(); chain(v.use(pink()), v.use(f('lowpass', 900)), v.use(g(0.35)), v.out); chain(v.use(white()), v.use(f('highpass', 1800)), v.use(g(0.22)), v.out); var cg = v.use(g(0.1)); chain(v.use(o('sawtooth', 42)), v.use(f('lowpass', 160)), cg, v.out); v.use(am(cg, 'sine', 11, 0.04, 0.1));
    var sp = v.use(g(0.1)); chain(v.use(white()), v.use(f('bandpass', 1500, 0.8)), sp, v.out); v.sp = sp; v.t = 0; v.attack = 0.08; v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.05) { v.t = 0; tgt(v.sp.gain, rnd(0.04, 0.3) * level, 0.03); } }; return v; };
  R.roller = function () { /* a fur roller in epoxy: the soft rumble of the stroke, the tack of the coat pulling at the fur */
    var v = V(), ru = v.use(g(0)), tk = v.use(g(0)); chain(v.use(pink()), v.use(f('lowpass', 700)), ru, v.out); chain(v.use(white()), v.use(f('bandpass', 3500, 1)), tk, v.out); stroke(v, 0.9);
    v.tick = function (level, speed, now, dt) { var s = v.strokeOf(speed, dt); tgt(ru.gain, level * 0.32 * s, 0.05); tgt(tk.gain, level * 0.09 * s, 0.04); }; return v; };
  R.vacuum = function () { /* an industrial vacuum: the motor spinning up to its whine, the airflow */
    var v = V(), m = v.use(o('sawtooth', 200)); chain(m, v.use(f('bandpass', 330, 3)), v.use(g(0.12)), v.out); var m2 = v.use(o('sawtooth', 400)); chain(m2, v.use(f('bandpass', 660, 4)), v.use(g(0.05)), v.out); chain(v.use(pink()), v.use(f('bandpass', 900, 0.5)), v.use(g(0.3)), v.out); chain(v.use(white()), v.use(f('highpass', 3000)), v.use(g(0.05)), v.out);
    var t = ctx.currentTime; m.frequency.setValueAtTime(200, t); m.frequency.linearRampToValueAtTime(330, t + 0.9); m2.frequency.setValueAtTime(400, t); m2.frequency.linearRampToValueAtTime(660, t + 0.9); v.attack = 0.6; v.tick = function (level) { tgt(v.out.gain, level, 0.1); }; return v; };
  R.gun = function () { /* a cartridge gun: the ratchet's click with each squeeze, the bead pressing out */ var v = V(), hs = v.use(g(0.05)); chain(v.use(white()), v.use(f('bandpass', 1200, 1)), hs, v.out); var ck = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 2200, 2)), ck, v.out); v.ck = ck; v.s = 0; v.attack = 0.05;
    v.tick = function (level, speed, now, dt) { v.s += dt; if (v.s > 0.42) { v.s = 0; v.ck.gain.setValueAtTime(0.3 * level, now); v.ck.gain.exponentialRampToValueAtTime(0.001, now + 0.012); } }; return v; };
  R.waterstop = function () { /* fixing a waterstop at the joint: the PVC rustling, a hammer tapping the clips to the formwork */ var v = V(), ru = v.use(g(0.08)); chain(v.use(white()), v.use(f('bandpass', 2500, 1)), ru, v.out); var tp = v.use(g(0)), tpo = v.use(o('sine', 1800)); chain(tpo, tp, v.out); var tn = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 3000, 1.5)), tn, v.out);
    v.t = 0; v.s = 0; v.attack = 0.05; v.tick = function (level, speed, now, dt) { v.t += dt; v.s += dt; if (v.t > 0.1) { v.t = 0; tgt(ru.gain, rnd(0.04, 0.16) * level, 0.06); } if (v.s > rnd(0.55, 0.9)) { v.s = 0; tpo.frequency.setValueAtTime(2000, now); tpo.frequency.exponentialRampToValueAtTime(500, now + 0.04); tp.gain.setValueAtTime(0.25 * level, now); tp.gain.exponentialRampToValueAtTime(0.001, now + 0.05); tn.gain.setValueAtTime(0.3 * level, now); tn.gain.exponentialRampToValueAtTime(0.001, now + 0.02); } }; return v; };
  R.pour = function () { /* placing concrete: the mix slumping out of the hose in a rumble and a splatter, the poker vibrator (≈ 200 Hz, 12 000 vpm) buzzing and dulling as it goes in */
    var v = V(), ru = v.use(g(0.35)); chain(v.use(pink()), v.use(f('lowpass', 250)), ru, v.out); var sp = v.use(g(0.08)); chain(v.use(white()), v.use(f('bandpass', 1200, 0.7)), sp, v.out);
    var pk = v.use(g(0.3)), pkLp = v.use(f('lowpass', 1200)); chain(v.use(o('sine', 200)), pkLp); chain(v.use(o('sawtooth', 200)), v.use(g(0.3)), pkLp); pkLp.connect(pk); pk.connect(v.out); v.use(am(pk, 'sine', 7, 0.05, 0.3));
    v.pkLp = pkLp; v.sp = sp; v.t = 0; v.s = 0; v.attack = 0.3; v.tick = function (level, speed, now, dt) { v.t += dt; v.s += dt; if (v.t > 0.06) { v.t = 0; tgt(v.sp.gain, rnd(0.03, 0.2) * level, 0.03); } if (v.s > 1.6) { v.s = 0; tgt(v.pkLp.frequency, rnd(450, 1400), 0.5); } tgt(ru.gain, 0.35 * level, 0.2); }; return v; };
  R.poker = R.pour;
  R.sheet = function () { /* a curing sheet laid and wetted: the plastic rustling, water sprayed under it */ var v = V(), ru = v.use(g(0.1)); chain(v.use(white()), v.use(f('highpass', 2500)), ru, v.out); chain(v.use(pink()), v.use(f('lowpass', 1500)), v.use(g(0.15)), v.out); v.t = 0; v.attack = 0.06;
    v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.08) { v.t = 0; tgt(ru.gain, rnd(0.04, 0.28) * level, 0.04); } }; return v; };
  R.mixer = function () { /* a drill mixer in the bucket: the motor spinning up, the paddle through the slurry, the splash at the rim */
    var v = V(), m = v.use(o('sawtooth', 70)); chain(m, v.use(f('lowpass', 1200)), v.use(g(0.14)), v.out); var m2 = v.use(o('square', 140)); chain(m2, v.use(f('bandpass', 220, 4)), v.use(g(0.05)), v.out); var sl = v.use(g(0.35)); chain(v.use(pink()), v.use(f('lowpass', 500)), sl, v.out); v.use(am(sl, 'sine', 2.3, 0.15, 0.35)); var sp = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 1800, 1)), sp, v.out);
    var t = ctx.currentTime; m.frequency.setValueAtTime(70, t); m.frequency.linearRampToValueAtTime(110, t + 0.7); m2.frequency.setValueAtTime(140, t); m2.frequency.linearRampToValueAtTime(220, t + 0.7); v.sp = sp; v.t = 0; v.attack = 0.4; v.tick = function (level, speed, now, dt) { v.t += dt; if (v.t > 0.07) { v.t = 0; tgt(v.sp.gain, rnd(0, 0.12) * level, 0.03); } }; return v; };
  R.drill = function () { /* a hammer drill in concrete: motor and whine, ≈ 50 hammer blows a second, dust */
    var v = V(); chain(v.use(o('sawtooth', 250)), v.use(f('lowpass', 2000)), v.use(g(0.12)), v.out); chain(v.use(o('square', 1500)), v.use(f('bandpass', 1500, 8)), v.use(g(0.03)), v.out);
    var P = v.use(pulse(50, 20)), hg = v.use(g(0)), tg = v.use(g(0)); P.connect(hg.gain); P.connect(tg.gain); chain(v.use(white()), v.use(f('bandpass', 2500, 1.2)), hg, v.use(g(0.35)), v.out); chain(v.use(o('sine', 90)), tg, v.use(g(0.3)), v.out); chain(v.use(white()), v.use(f('highpass', 5000)), v.use(g(0.04)), v.out);
    v.attack = 0.08; v.tick = function (level) { tgt(v.out.gain, level, 0.05); }; return v; };
  R.air = function () { /* compressed air blowing a hole clean */ var v = V(); chain(v.use(white()), v.use(f('highpass', 2500)), v.use(g(0.5)), v.out); chain(v.use(white()), v.use(f('bandpass', 1200, 1)), v.use(g(0.15)), v.out); v.attack = 0.03; v.tick = function (level) { tgt(v.out.gain, level, 0.05); }; return v; };
  R.ratchet = function () { /* tightening a packer with a wrench: the ratchet's clicks, a ring of the steel */ var v = V(), ck = v.use(g(0)); chain(v.use(white()), v.use(f('bandpass', 3000, 2)), ck, v.out); var rg = v.use(g(0)), ro = v.use(o('sine', 2600)); chain(ro, rg, v.out); v.s = 0; v.attack = 0.03;
    v.tick = function (level, speed, now, dt) { v.s += dt; if (v.s > 0.19) { v.s = 0; ck.gain.setValueAtTime(0.35 * level, now); ck.gain.exponentialRampToValueAtTime(0.001, now + 0.008); rg.gain.setValueAtTime(0.04 * level, now); rg.gain.exponentialRampToValueAtTime(0.001, now + 0.12); } }; return v; };
  R.pump = function () { /* an electric injection pump: the motor hum, the piston's slow pulses, the resin hissing through the line */ var v = V(); chain(v.use(o('sawtooth', 50)), v.use(f('lowpass', 300)), v.use(g(0.12)), v.out); chain(v.use(o('sine', 100)), v.use(g(0.06)), v.out); var pg = v.use(g(0.2)); chain(v.use(pink()), v.use(f('lowpass', 800)), pg, v.out); v.use(am(pg, 'sine', 2.2, 0.12, 0.2)); chain(v.use(pink()), v.use(f('bandpass', 700, 1)), v.use(g(0.05)), v.out);
    v.attack = 0.2; v.tick = function (level) { tgt(v.out.gain, level, 0.1); }; return v; };
  R.car = function () { /* a car driving into the finished garage: the engine at idle, tyres on the coating, the door */ var v = V(), eg = v.use(g(0.2)); chain(v.use(o('sawtooth', 35)), v.use(f('lowpass', 600)), eg); chain(v.use(o('sawtooth', 70)), v.use(f('lowpass', 800)), v.use(g(0.5)), eg); chain(v.use(o('square', 140)), v.use(f('lowpass', 500)), v.use(g(0.3)), eg); eg.connect(v.out); v.use(am(eg, 'sine', 13, 0.04, 0.2));
    chain(v.use(pink()), v.use(f('lowpass', 300)), v.use(g(0.1)), v.out); v.attack = 0.4; v.doored = false;
    v.tick = function (level, speed, now) { tgt(v.out.gain, Math.max(0.15, level), 0.2); if (level > 0.92 && !v.doored) { v.doored = true; var d = g(0.4), od = o('sine', 120); od.frequency.exponentialRampToValueAtTime(60, now + 0.12); chain(od, d, v.out); d.gain.setValueAtTime(0.5, now); d.gain.exponentialRampToValueAtTime(0.001, now + 0.18); v.use(od, d); } }; return v; };
  R.water = function () { /* water finding its way through the structure: a trickle and drips — the level fades as the crystals close the paths */ var v = V(), tr = v.use(g(0.12)); chain(v.use(pink()), v.use(f('bandpass', 1500, 1)), tr, v.out); var dg = v.use(g(0)), dp = v.use(o('sine', 900)); chain(dp, dg, v.out); v.s = 0; v.attack = 0.3;
    v.tick = function (level, speed, now, dt) { v.s += dt; tgt(tr.gain, 0.12 * level, 0.3); if (v.s > rnd(0.3, 1.4) / Math.max(0.05, level)) { v.s = 0; dp.frequency.setValueAtTime(rnd(800, 1300), now); dp.frequency.exponentialRampToValueAtTime(500, now + 0.05); dg.gain.setValueAtTime(0.18 * Math.max(0.1, level), now); dg.gain.exponentialRampToValueAtTime(0.001, now + 0.07); } }; return v; };
  R.heal = R.water;

  /* ===== the ambience: a bed per place, with the small events of a site ===== */
  var A = {};
  function drip(dest, lvl) { var t = ctx.currentTime, dg = g(0), dp = o('sine', rnd(900, 1400)); dp.frequency.exponentialRampToValueAtTime(rnd(400, 600), t + 0.05); chain(dp, dg, dest); dg.gain.setValueAtTime(lvl, t); dg.gain.exponentialRampToValueAtTime(0.001, t + 0.09); dp.stop(t + 0.15); setTimeout(function () { try { dg.disconnect(); } catch (e) {} }, 300); }
  function clank(dest, lvl) { var t = ctx.currentTime, n = white(), bp = f('bandpass', rnd(600, 1100), 3), ng = g(0), th = o('sine', rnd(150, 220)), tg2 = g(0); chain(n, bp, ng, dest); chain(th, tg2, dest); ng.gain.setValueAtTime(lvl, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.09); tg2.gain.setValueAtTime(lvl * 0.6, t); tg2.gain.exponentialRampToValueAtTime(0.001, t + 0.25); n.stop(t + 0.2); th.stop(t + 0.3); setTimeout(function () { try { ng.disconnect(); tg2.disconnect(); } catch (e) {} }, 500); }
  function bird(dest, lvl) { var t = ctx.currentTime, k, n = 2 + Math.floor(Math.random() * 3), bo = o('sine', 3000), bg = g(0); chain(bo, bg, dest); for (k = 0; k < n; k++) { var s = t + k * 0.13, fa = rnd(2600, 3800); bo.frequency.setValueAtTime(fa, s); bo.frequency.exponentialRampToValueAtTime(fa * 1.4, s + 0.05); bo.frequency.exponentialRampToValueAtTime(fa * 0.9, s + 0.1); bg.gain.setValueAtTime(0.001, s); bg.gain.exponentialRampToValueAtTime(lvl, s + 0.02); bg.gain.exponentialRampToValueAtTime(0.001, s + 0.1); } bo.stop(t + n * 0.13 + 0.1); setTimeout(function () { try { bg.disconnect(); } catch (e) {} }, n * 130 + 300); }
  function beeper(dest, lvl) { var t = ctx.currentTime, k, bo = o('square', 1000), bg = g(0); chain(bo, f('lowpass', 2500), bg, dest); for (k = 0; k < 4; k++) { bg.gain.setValueAtTime(lvl, t + k * 0.9); bg.gain.setValueAtTime(0, t + k * 0.9 + 0.4); } bo.stop(t + 3.7); setTimeout(function () { try { bg.disconnect(); } catch (e) {} }, 4000); }
  A.basement = function () { /* a wet basement: the ventilation, the room's tone, drips, a distant clank from the site above, a generator outside */
    var v = V(); chain(v.use(o('sawtooth', 50)), v.use(f('lowpass', 120)), v.use(g(0.07)), v.out); chain(v.use(o('sine', 100)), v.use(g(0.03)), v.out); chain(v.use(pink()), v.use(f('lowpass', 400)), v.use(g(0.09)), v.out); var gn = v.use(g(0.025)); chain(v.use(o('square', 45)), v.use(f('lowpass', 90)), gn, v.out); v.use(am(gn, 'sine', 1, 0.01, 0.025));
    v.nd = rnd(1, 3); v.nc = rnd(6, 12); v.tick = function (dt) { v.nd -= dt; v.nc -= dt; if (v.nd < 0) { v.nd = rnd(1.2, 5); drip(v.out, rnd(0.08, 0.2)); } if (v.nc < 0) { v.nc = rnd(7, 16); clank(v.out, rnd(0.06, 0.14)); } }; return v; };
  A.garage = function () { /* an underground garage: a bigger room, the air handling, the traffic outside, a door now and then */
    var v = V(); chain(v.use(pink()), v.use(f('lowpass', 500)), v.use(g(0.08)), v.out); chain(v.use(o('sawtooth', 60)), v.use(f('lowpass', 150)), v.use(g(0.04)), v.out); var tr = v.use(g(0.05)); chain(v.use(pink()), v.use(f('bandpass', 200, 0.5)), tr, v.out);
    v.t = 0; v.nc = rnd(8, 14); v.nb = rnd(5, 10); v.tick = function (dt) { v.t += dt; v.nc -= dt; v.nb -= dt; if (v.t > 0.5) { v.t = 0; tgt(tr.gain, rnd(0.03, 0.09), 0.4); } if (v.nc < 0) { v.nc = rnd(9, 20); clank(v.out, rnd(0.08, 0.16)); } if (v.nb < 0) { v.nb = rnd(8, 18); bird(v.out, 0.03); } }; return v; };
  A.site = function () { /* an open site at a pour: wind in gusts, a mixer truck idling, the beeper of a reversing truck, birds over the noise */
    var v = V(), wg = v.use(g(0.15)); chain(v.use(pink()), v.use(f('bandpass', 300, 0.4)), wg, v.out); chain(v.use(pink()), v.use(f('lowpass', 250)), v.use(g(0.08)), v.out); var tk = v.use(g(0.08)); chain(v.use(o('sawtooth', 30)), v.use(f('lowpass', 180)), tk); chain(v.use(o('sawtooth', 60)), v.use(f('lowpass', 220)), v.use(g(0.5)), tk); tk.connect(v.out); v.use(am(tk, 'sine', 12, 0.03, 0.08));
    v.t = 0; v.nb = rnd(3, 8); v.nk = rnd(18, 35); v.tick = function (dt) { v.t += dt; v.nb -= dt; v.nk -= dt; if (v.t > 0.4) { v.t = 0; tgt(wg.gain, rnd(0.08, 0.28), 0.6); } if (v.nb < 0) { v.nb = rnd(4, 11); bird(v.out, rnd(0.04, 0.08)); } if (v.nk < 0) { v.nk = rnd(25, 50); beeper(v.out, 0.035); } }; return v; };

  /* ===== events ===== */
  function tone(fr, t, dur, lvl, type, dest) { var os = o(type || 'sine', fr), gg = g(0); chain(os, gg, dest || B.fx); gg.gain.setValueAtTime(0.001, t); gg.gain.exponentialRampToValueAtTime(lvl, t + 0.01); gg.gain.exponentialRampToValueAtTime(0.001, t + dur); os.stop(t + dur + 0.05); setTimeout(function () { try { gg.disconnect(); } catch (e) {} }, (t - ctx.currentTime + dur) * 1000 + 200); }
  var EV = {
    click: function () { var t = ctx.currentTime, n = white(), gg = g(0); chain(n, f('highpass', 2000), gg, B.fx); gg.gain.setValueAtTime(0.45, t); gg.gain.exponentialRampToValueAtTime(0.001, t + 0.012); n.stop(t + 0.03); },
    bad: function () { var t = ctx.currentTime; tone(110, t, 0.16, 0.16, 'square'); var n = white(), gg = g(0); chain(n, f('lowpass', 900), gg, B.fx); gg.gain.setValueAtTime(0.12, t); gg.gain.exponentialRampToValueAtTime(0.001, t + 0.1); n.stop(t + 0.15); },
    done: function () { var t = ctx.currentTime; tone(660, t, 0.22, 0.14); tone(1320, t, 0.12, 0.04); tone(880, t + 0.11, 0.3, 0.14); tone(1760, t + 0.11, 0.14, 0.04); },
    warn: function () { var t = ctx.currentTime; tone(1200, t, 0.07, 0.12, 'square'); tone(1200, t + 0.14, 0.07, 0.12, 'square'); },
    potOut: function () { var t = ctx.currentTime, os = o('sawtooth', 440), gg = g(0); chain(os, f('lowpass', 1200), gg, B.fx); os.frequency.exponentialRampToValueAtTime(200, t + 0.25); gg.gain.setValueAtTime(0.001, t); gg.gain.exponentialRampToValueAtTime(0.22, t + 0.02); gg.gain.exponentialRampToValueAtTime(0.001, t + 0.3); os.stop(t + 0.35); },
    ding: function () { var t = ctx.currentTime; tone(1760, t, 0.45, 0.12); tone(3520, t, 0.2, 0.03); },
    finish: function () { var t = ctx.currentTime; [523, 659, 784, 1047].forEach(function (fr, i) { tone(fr, t + i * 0.13, 0.5, 0.12); tone(fr * 2, t + i * 0.13, 0.2, 0.03); }); },
    lapse: function (dur) { /* time passing: a gust rising and falling, a clock ticking faster */ var t = ctx.currentTime, d = dur || 3, n = pink(), bp = f('bandpass', 300, 1), gg = g(0); chain(n, bp, gg, B.fx); bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(1800, t + d * 0.5); bp.frequency.exponentialRampToValueAtTime(300, t + d); gg.gain.setValueAtTime(0.001, t); gg.gain.exponentialRampToValueAtTime(0.4, t + d * 0.4); gg.gain.exponentialRampToValueAtTime(0.001, t + d); n.stop(t + d + 0.1);
      var k, tt = t, step = 0.16; for (k = 0; tt < t + d - 0.2; k++) { var cn = white(), cg = g(0); chain(cn, f('highpass', 3000), cg, B.fx); cg.gain.setValueAtTime(0.2, tt); cg.gain.exponentialRampToValueAtTime(0.001, tt + 0.006); cn.stop(tt + 0.02); tt += step; step = Math.max(0.05, step * 0.93); } }
  };
  EV.quizOk = EV.done; EV.quizBad = EV.bad; EV.doseOk = EV.done; EV.doseBad = EV.bad;

  /* ===== the running of it ===== */
  function ambient(key) { if (!ctx) return; if (key === ambKey && amb) return; if (amb) kill(amb, 1.2); amb = null; ambKey = key; if (!key || !A[key]) return; amb = A[key](); amb.env.connect(B.amb); var t = ctx.currentTime; amb.env.gain.setValueAtTime(0, t); amb.env.gain.linearRampToValueAtTime(1, t + 1.5); }
  function open(key) { if (!init()) return; isOpen = true; resume(); ambient(key || 'basement'); lastWork = performance.now();
    clearInterval(ambTimer); var lt = performance.now(); ambTimer = setInterval(function () { var n = performance.now(), dt = Math.min(0.5, (n - lt) / 1000); lt = n; if (amb && amb.tick && ctx.state === 'running') amb.tick(dt); if (voice && n - lastWork > 300) { kill(voice, 0.15); voice = null; voiceKey = null; } }, 100); }
  function close() { isOpen = false; if (!ctx) return; if (voice) kill(voice, 0.2); voice = null; voiceKey = null; if (amb) kill(amb, 0.8); amb = null; ambKey = null; clearInterval(ambTimer); ambTimer = 0; setTimeout(function () { if (!isOpen && ctx && ctx.state === 'running') ctx.suspend(); }, 1400); }
  var lastTick = 0;
  function work(key, level, speed) { /* every frame from a simulator: the tool at work now (null: none), its level 0–1, the stroke speed 0–1 or null */
    if (!ctx || !isOpen) return; var now = ctx.currentTime, pn = performance.now(), dt = lastTick ? Math.min(0.1, (pn - lastTick) / 1000) : 0.016; lastTick = pn; lastWork = pn; if (level == null) level = 1;
    if (key !== voiceKey) { if (voice) kill(voice, 0.14); voice = null; voiceKey = key; if (key && R[key]) { voice = R[key](); voice.env.connect(B.tool); voice.env.gain.setValueAtTime(0, now); voice.env.gain.linearRampToValueAtTime(TRIM[key] || 1, now + (voice.attack || 0.08)); } }
    if (voice && voice.tick) voice.tick(level, speed, now, dt);
  }
  function event(name, arg) { if (!ctx || muted || ctx.state !== 'running') return; var fn = EV[name]; if (fn) { try { fn(arg); } catch (e) {} } }
  function mute(on) { muted = !!on; try { localStorage.setItem('hsim-sound', muted ? 'off' : 'on'); } catch (e) {} if (ctx) { if (muted) { tgt(out.gain, 0, 0.05); } else { resume(); tgt(out.gain, 0.85, 0.05); } } listeners.forEach(function (fn) { try { fn(muted); } catch (e) {} }); }
  return { has: has, init: init, resume: resume, open: open, close: close, work: work, event: event, mute: mute, toggle: function () { mute(!muted); return muted; }, muted: function () { return muted; }, onChange: function (fn) { listeners.push(fn); }, recipes: function () { return Object.keys(R); }, ambients: function () { return Object.keys(A); }, _ctx: function () { return ctx; }, _out: function () { return out; }, _comp: function () { return comp; }, _bus: function (k) { return B[k]; }, _voice: function () { return voiceKey; }, _amb: function () { return ambKey; } };
})();
/* the tool keys of the hands-on simulators mapped to their sounds (a simulator or a phase can override) */
var HSA_TOOLSND = { lance: 'jet', chipper: 'chipper', trowel: 'trowel', broom: 'brush', notched: 'notched', spray: 'spray', hose: 'hose', cutter: 'cutter', blaster: 'blaster', sponge: 'sponge', rule: 'rule', roller: 'roller', vacuum: 'vacuum', cm: null, gun: 'gun', waterstop: 'waterstop', poker: 'pour', sheet: 'sheet', hand: 'hand', pail: 'mixer', mixer: 'mixer', look: null };
