  /* ---------- (V81) the arrangement: "An der schönen blauen Donau", Walzer, Op. 314 (Johann Strauss II, 1867; public domain) — the theme of
     its first waltz (Walzer Nr. 1: the 32-bar strain in D major, as the composer wrote it: the rising D–F♯–A, the held note, the violins'
     answering pairs on the third beat and the next downbeat; C♯–E–B over the dominant; the climb to the high D; E–G–B, the long B and F♯,
     the cadence). The arrangement is this guide's own, for a Viennese orchestra: gentle, then broad.
     An introduction of its own on the dominant (the violins' tremolo on A like water moving under mist, a distant horn calling the waltz's
     first notes in A, the flute answering, the harp's arpeggio, a breath of the timpani). The strain once softly (the cellos and a horn
     singing the theme low, the violins' and the flute's answering pairs above, the harp and the basses' pizzicato on the waltz's step); a
     harp glissando; the strain again, broad (the violins on the theme with the horns, the glockenspiel in the answers, the after-beats in
     the horns and strings, the timpani and the cymbals at its high D; from E–G–B the violins an octave up over trombones); the cadence
     broadened and the full D major chord. The Viennese lilt: the second beat a little early, the third a little late. Times in seconds. ---------- */
  function kscArrange(I) { var END = 0, B = 0.9, W1 = 6.27, i, g;
    /* bar lengths (× B): bar 0 holds the upbeat; the phrases breathe; the cadence broadens; bar 32 is the last chord */
    var FB = [1.08, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 1.02, 1.03, 1.02, 0.98, 0.98, 1.03, 1.02, 0.98, 0.98, 1.0, 1.06, 1.02, 1.08, 1.06, 1.14, 1.28, 2.2];
    var BS = [W1 - B * FB[0]]; for (i = 0; i < FB.length; i++) BS.push(BS[i] + B * FB[i]);
    var LT = [0, 0.305, 0.665, 1]; /* (where the three beats fall in the bar) */
    function tb(x) { var gg = Math.max(0, Math.min(FB.length - 1, Math.floor(x / 3 + 1e-9))), b = Math.min(3, x - gg * 3), k = Math.min(2, Math.floor(b)); return BS[gg] + (BS[gg + 1] - BS[gg]) * (LT[k] + (LT[k + 1] - LT[k]) * (b - k)); }
    function at(gg, b) { return tb(gg * 3 + b); } function len(gg, b, l) { return tb(gg * 3 + b + l) - tb(gg * 3 + b); }
    /* the harmony bar by bar: the after-beats' voicing (v) and the bass's root and fifth (r) */
    var CH = { D: { v: [57, 62, 66], r: [38, 33] }, A7: { v: [55, 61, 64], r: [33, 40] }, A: { v: [57, 61, 64], r: [33, 40] }, G: { v: [55, 59, 62], r: [31, 38] }, Em: { v: [55, 59, 64], r: [40, 35] }, Em7: { v: [55, 59, 62], r: [40, 35] }, E7: { v: [56, 62, 64], r: [40, 35] } };
    var HAR = [null, 'D', 'D', 'D', 'D', 'D', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'G', 'G', 'G', 'Em', 'E7', 'A', 'D', 'D', 'Em7', 'A7', 'D'];
    /* the theme [bar, beat, beats, pitch] and the answering pairs [bar, beat, pitch] */
    var MEL = [[0, 2, 1, 62], [1, 0, 1, 62], [1, 1, 1, 66], [1, 2, 1, 69], [2, 0, 5.4, 69], [4, 2, 1, 62], [5, 0, 1, 62], [5, 1, 1, 66], [5, 2, 1, 69], [6, 0, 5.4, 69],
      [8, 2, 1, 61], [9, 0, 1, 61], [9, 1, 1, 64], [9, 2, 1, 71], [10, 0, 5.4, 71], [12, 2, 1, 61], [13, 0, 1, 61], [13, 1, 1, 64], [13, 2, 1, 71], [14, 0, 5.4, 71],
      [16, 2, 1, 62], [17, 0, 1, 62], [17, 1, 1, 66], [17, 2, 1, 69], [18, 0, 5.4, 74], [20, 2, 1, 62], [21, 0, 1, 62], [21, 1, 1, 66], [21, 2, 1, 69], [22, 0, 5.4, 74],
      [24, 2, 1, 64], [25, 0, 1, 64], [25, 1, 1, 67], [25, 2, 1, 71], [26, 0, 4, 71], [27, 1, 1, 68], [27, 2, 1, 69], [28, 0, 4, 78], [29, 1, 1, 74], [29, 2, 1, 66], [30, 0, 2, 66], [30, 2, 1, 64], [31, 0, 2, 71], [31, 2, 1, 69]];
    var ECH = [[2, 2, 81], [3, 0, 81], [3, 2, 78], [4, 0, 78], [6, 2, 81], [7, 0, 81], [7, 2, 79], [8, 0, 79], [10, 2, 83], [11, 0, 83], [11, 2, 79], [12, 0, 79], [14, 2, 83], [15, 0, 83], [15, 2, 78], [16, 0, 78],
      [18, 2, 86], [19, 0, 86], [19, 2, 81], [20, 0, 81], [22, 2, 86], [23, 0, 86], [23, 2, 83], [24, 0, 83]];
    var PV1 = -0.38, PV2 = -0.16, PVA = 0.1, PC = 0.3, PH = 0.2, PHP = -0.5;
    /* the dynamic: the first strain soft and growing; the second broad, its peak at the long F♯ */
    function kk(gg) { if (gg <= 16) return 0.78 + 0.22 * Math.max(0, gg - 6) / 10; return gg < 25 ? 1.0 : [1.06, 1.1, 1.12, 1.18, 1.12, 1.08, 1.1][Math.min(6, gg - 25)]; }
    function harpRun(ns, t0, t1, v0, v1, pan) { ns.forEach(function (n, x) { var p = ns.length > 1 ? x / (ns.length - 1) : 0; I.harp(n, t0 + (t1 - t0) * Math.pow(p, 0.88), v0 + (v1 - v0) * p, { pan: pan == null ? PHP : pan }); }); }
    function dScale(a, b) { var S = [2, 4, 6, 7, 9, 11, 1], L = [], n; for (n = a; n <= b; n++) if (S.indexOf(((n % 12) + 12) % 12) >= 0) L.push(n); return L; }
    /* ---- the introduction ---- */
    var tP = at(0, 2); /* (the waltz's upbeat) */
    [69, 76, 81].forEach(function (n, x) { I.strings(n, 0.05 + x * 0.12, tP - 0.25 - x * 0.12, 0.022, { n: 3, trem: true, att: 1.4, swell: 1.7, rel: 0.45, pan: -0.42 + x * 0.12, vib: 4, send: 1.3 }); });
    I.cb(33, 0.5, tP - 1.0, 0.07, { arco: true, swell: 1.4 }); I.strings(45, 0.6, tP - 1.1, 0.025, { n: 2, dark: true, att: 1.2, swell: 1.3, pan: PC, rel: 0.5 });
    I.horn(57, 1.0, 0.68, 0.05, { far: true, pan: PH }); I.horn(61, 1.72, 0.4, 0.05, { far: true, pan: PH }); I.horn(64, 2.14, 1.75, 0.058, { far: true, swell: 1.25, pan: PH, rel: 0.5 });
    I.flute(76, 3.2, 0.24, 0.04, {}); I.flute(76, 3.52, 0.46, 0.046, {}); I.flute(73, 4.08, 0.24, 0.04, {}); I.flute(73, 4.4, 0.5, 0.044, { swell: 0.8 });
    harpRun([45, 52, 57, 61, 64, 67, 69, 73, 76, 79], 4.72, 5.62, 0.045, 0.06);
    I.timpRoll(45, 4.9, tP - 0.35, 0.03, 0.11); I.cymSwell(4.75, tP - 0.3 - 4.75, 0.04);
    /* ---- the theme ---- */
    var prevC = null;
    MEL.forEach(function (q) { var gg = q[0], b = q[1], l = q[2], n = q[3], t = at(gg, b), grand = gg > 16 || (gg === 16 && b === 2), lg = l > 1.5, d = len(gg, b, l) * (lg ? 0.97 : 0.985), k = kk(gg);
      if (!grand) { /* the cellos and the solo cello an octave down (a slide up on a leap), the horn on the theme's own octave, distant at first */
        I.strings(n - 12, t, d, 0.075 * k, { n: 3, dark: true, pan: PC, att: lg ? 0.1 : 0.06, rel: lg ? 0.4 : 0.2, vib: 7, swell: lg ? 0.62 : null });
        var sl = prevC != null && n - 12 - prevC >= 5; I.solo(n - 12, t, d, 0.045 * k, { body: 'vc', pan: 0.26, from: sl ? prevC : null, glide: 0.09, att: lg ? 0.09 : 0.05, rel: lg ? 0.35 : 0.14, vib: 13, swell: lg ? 0.65 : null, send: 1.0 }); prevC = n - 12;
        I.horn(n, t, d, (gg < 9 ? 0.03 : 0.036) * k, { far: gg < 9, pan: PH, rel: lg ? 0.4 : 0.2, swell: lg ? 0.7 : null }); return; }
      var hi = gg >= 25 || (gg === 24 && b === 2); /* (from E–G–B the violins go up an octave) */
      I.strings(n, t, d, (hi ? 0.06 : 0.075) * k, { n: hi ? 3 : 4, pan: PV2, att: lg ? 0.07 : 0.035, rel: lg ? 0.45 : 0.22, vib: 8, swell: lg ? 1.12 : null });
      if (hi) I.strings(n + 12, t, d, 0.07 * k, { n: 4, pan: PV1, att: lg ? 0.07 : 0.035, rel: lg ? 0.5 : 0.22, vib: 9, swell: lg ? 1.15 : null });
      I.horn(n, t, d, (hi ? 0.05 : 0.04) * k, { pan: PH, rel: 0.3, swell: lg ? 1.1 : null });
      I.strings(n - 12, t, d, 0.05 * k, { n: 2, dark: true, pan: PC, att: lg ? 0.08 : 0.04, rel: 0.3, vib: 7, swell: lg ? 1.05 : null }); });
    /* ---- the answering pairs (the downbeat's a little longer and fuller) ---- */
    ECH.forEach(function (q) { var gg = q[0], b = q[1], n = q[2], t = at(gg, b), dn = b === 0, grand = gg > 16, k = kk(gg), d = dn ? 0.25 : 0.17;
      I.strings(n, t, d, (grand ? 0.05 : 0.036) * k * (dn ? 1.12 : 0.92), { n: grand ? 3 : 2, att: 0.012, rel: grand ? 0.16 : 0.12, vib: 3, pan: PV1, send: 1.15 });
      I.flute(n, t, d, (grand ? 0.04 : 0.032) * k * (dn ? 1.1 : 0.9), { att: 0.02, rel: 0.1 }); if (grand) I.glock(n, t, 0.035 * (dn ? 1.1 : 0.85), 0.05); });
    /* ---- the waltz's step: the bass on one, the after-beats on two and three ---- */
    var pos = 0;
    for (g = 1; g <= 31; g++) { var h = HAR[g], C = CH[h], grand = g > 16, k = kk(g); pos = h === HAR[g - 1] ? pos + 1 : 0; var bn = C.r[pos % 2];
      if (!grand) { I.cb(bn, at(g, 0), len(g, 0, 1), 0.22 * k, {});
        [1, 2].forEach(function (b) { C.v.forEach(function (n, x) { I.harp(n + 12, at(g, b), 0.03 * k * (b === 1 ? 1.05 : 0.9), { short: true, pan: PHP + x * 0.04 }); if (g >= 9) I.strings(n, at(g, b), len(g, b, 0.42), 0.02 * k, { n: 2, dark: true, att: 0.03, rel: 0.12, pan: PVA + x * 0.05, vib: 3 }); }); }); }
      else { I.cb(bn, at(g, 0), len(g, 0, 1.6), 0.14 * k, { arco: true }); I.cb(bn, at(g, 0), len(g, 0, 1), 0.16 * k, {}); I.lowBrass(bn, at(g, 0), len(g, 0, 0.9), 0.05 * k, { tuba: true, n: 1, pan: 0.35 });
        [1, 2].forEach(function (b) { C.v.forEach(function (n, x) { I.strings(n, at(g, b), len(g, b, 0.42), 0.028 * k, { n: 2, att: 0.025, rel: 0.12, pan: PVA + x * 0.05, vib: 3 }); I.horn(n, at(g, b), len(g, b, 0.45), 0.032 * k, { n: 1, pan: PH + x * 0.05, rel: 0.14 }); I.harp(n + 12, at(g, b), 0.022 * k, { short: true, pan: PHP + x * 0.04 }); }); });
        if (g >= 25) C.v.forEach(function (n, x) { I.lowBrass(n - 12, at(g, 0), len(g, 0, 2.9), 0.022 * k, { n: 1, pan: 0.3 + x * 0.04, swell: 1.1 }); }); } }
    /* ---- the colours of the second strain: the harp's glissando into it, the timpani, the cymbals ---- */
    harpRun(dScale(50, 86), at(16, 1), at(16, 2.92), 0.02, 0.05); I.cymSwell(at(16, 0.5), len(16, 0.5, 2.5), 0.06); I.timpRoll(45, at(16, 1), at(17, 0) - 0.03, 0.03, 0.14);
    I.timp(38, at(17, 0), 0.3, 1.4); I.cymbal(at(17, 0), 0.14); I.bassDrum(at(17, 0), 0.16); I.timp(38, at(18, 0), 0.22, 1.2); I.timp(45, at(21, 0), 0.2, 1.2); I.timp(43, at(22, 0), 0.24, 1.3); I.cymbal(at(22, 0), 0.1);
    [17, 21, 25, 28].forEach(function (gg) { var C = CH[HAR[gg]], ns = [C.r[0] + 12].concat(C.v, C.v.map(function (n) { return n + 12; })); harpRun(ns, at(gg, 0), at(gg, 0) + 0.16, 0.04, 0.05); });
    I.timp(40, at(25, 0), 0.22, 1.3); I.timp(40, at(26, 0), 0.24, 1.3); I.cymSwell(at(26, 0), len(26, 0, 6), 0.07); I.timp(45, at(27, 0), 0.26, 1.3);
    I.timp(38, at(28, 0), 0.34, 1.6); I.cymbal(at(28, 0), 0.2); I.bassDrum(at(28, 0), 0.2); I.timp(40, at(30, 0), 0.2, 1.2); I.timp(45, at(31, 0), 0.24, 1.2); I.timpRoll(45, at(31, 1), at(32, 0) - 0.02, 0.06, 0.24);
    harpRun(dScale(45, 86), at(31, 1), at(31, 2.92), 0.025, 0.055);
    /* ---- the last chord: D major, the whole orchestra ---- */
    var tE = at(32, 0), dE = 2.3;
    [50, 57, 62, 66, 69, 74, 78, 81, 86].forEach(function (n, x) { I.strings(n, tE, dE, 0.05, { n: 3, att: 0.03, rel: 0.9, swell: 1.1, pan: 0.32 - x * 0.08, vib: 8 }); });
    [62, 66, 69].forEach(function (n, x) { I.horn(n, tE, dE, 0.06, { n: 2, rel: 0.7, pan: PH + x * 0.05 }); }); [74, 78].forEach(function (n) { I.trumpet(n, tE, dE * 0.9, 0.045, { n: 2, rel: 0.6, pan: 0.08 }); });
    [50, 57].forEach(function (n) { I.lowBrass(n, tE, dE, 0.06, { n: 1, pan: 0.3 }); }); I.lowBrass(38, tE, dE, 0.08, { tuba: true, n: 1, pan: 0.35 }); I.cb(38, tE, dE, 0.18, { arco: true }); I.cb(38, tE, dE, 0.2, { long: true });
    I.flute(81, tE, dE, 0.04, { rel: 0.5 }); I.glock(86, tE, 0.05, 0.05); harpRun([38, 50, 57, 62, 66, 69, 74, 78, 81, 86], tE, tE + 0.26, 0.05, 0.05);
    I.timp(38, tE, 0.5, 2.2); I.timp(50, tE + 0.01, 0.28, 1.8); I.bassDrum(tE, 0.3); I.cymbal(tE, 0.3); END = tE + dE + 1.0;
    /* the bars cut two by two (the introduction in two pieces, the upbeat with the first two bars) */
    var cuts = [0, 3.2, tP - 0.2]; for (g = 3; g <= 31; g += 2) cuts.push(BS[g]);
    return { BT: BS, cuts: cuts, end: END, T1: BS[9], T2: (BS[29] - BS[9]) / 0.72 }; }
