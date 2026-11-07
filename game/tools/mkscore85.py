#!/usr/bin/env python3
"""mkscore85.py — the opening film's score (V85), played by a sampled orchestra.

"An der schönen blauen Donau", Walzer Op. 314 (Johann Strauss II, 1867; public domain): the theme of Waltz No. 1. The arrangement is this
guide's own and follows the plan of V81 (an introduction on the dominant; the strain once softly, a harp glissando, the strain again broad;
the cadence broadened; the D major chord) on the same clock (bar lines, the Viennese lilt), so the film's two acts and its title still fall
on the music. What changed: every section is its own sampled instrument (the string sections of the Versilian Studios Chamber Orchestra 2
CE (CC0) and the winds, brass, harp, timpani and percussion of MuseScore General (MIT)), the sustained lines are shaped by breath/bow
dynamics (CC2 on the "Expr." patches) instead of fixed envelopes, the melody is doubled in octaves and the harmony voiced across the
sections as an orchestra plays it, and the hall is a measured-style stereo response (frequency-dependent decay, early reflections).

Steps: MIDI per stem (strings, winds, brass, percussion) → FluidSynth (no internal reverb/chorus) → numpy mix with the hall → loudness
−16 LUFS, true peak ≤ −1.5 dBTP → MP3 (LAME VBR) → src/koeln/score85.js (var KSC_REC = { mime, dur, b64 }).
Usage: python3 game/tools/mkscore85.py [--out DIR] [--no-js]
Needs: fluidsynth (2.3), the MuseScore General soundfont (Debian/Ubuntu package musescore-general-soundfont: /usr/share/sounds/sf3/
MuseScore_General_Full.sf3), ffmpeg with libmp3lame, Python: numpy, scipy, mido, soundfile, pyloudnorm.
"""
import os, sys, math, json, random, base64, subprocess, argparse
import numpy as np, mido, soundfile as sf
from scipy import signal

SF3 = '/usr/share/sounds/sf3/MuseScore_General_Full.sf3'
SR = 48000
import pathlib
ROOT = pathlib.Path(os.environ.get('SG_ROOT') or pathlib.Path(__file__).resolve().parents[2])  # the repository root
ap = argparse.ArgumentParser(); ap.add_argument('--out', default=str(ROOT / 'build' / 'score85')); ap.add_argument('--no-js', action='store_true')
ap.add_argument('--js', default=str(ROOT / 'src' / 'koeln' / 'score85.js')); ARGS = ap.parse_args()
OUT = ARGS.out; os.makedirs(OUT, exist_ok=True)
R = random.Random(85)

# ---------------- the clock: exactly V81's (k_intro.js kscArrange) ----------------
B, W1 = 0.9, 6.27
FB = [1.08, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 0.98, 1.04, 1.0, 0.98, 1.02, 1.03, 1.02, 0.98, 0.98, 1.03, 1.02, 0.98, 0.98, 1.0, 1.06, 1.02, 1.08, 1.06, 1.14, 1.28, 2.2]
BS = [W1 - B * FB[0]]
for f in FB: BS.append(BS[-1] + B * f)
LT = [0, 0.305, 0.665, 1]
def tb(x):
    gg = max(0, min(len(FB) - 1, int(math.floor(x / 3 + 1e-9)))); b = min(3, x - gg * 3); k = min(2, int(math.floor(b)))
    return BS[gg] + (BS[gg + 1] - BS[gg]) * (LT[k] + (LT[k + 1] - LT[k]) * (b - k))
def at(g, b=0): return tb(g * 3 + b)
def ln(g, b, l): return tb(g * 3 + b + l) - tb(g * 3 + b)
tP = at(0, 2); tE = at(32, 0); dE = 2.3; END = tE + dE + 1.0

# ---------------- the material (V81) ----------------
CH = {'D': ([57, 62, 66], [38, 33]), 'A7': ([55, 61, 64], [33, 40]), 'A': ([57, 61, 64], [33, 40]), 'G': ([55, 59, 62], [31, 38]), 'Em': ([55, 59, 64], [40, 35]), 'Em7': ([55, 59, 62], [40, 35]), 'E7': ([56, 62, 64], [40, 35])}
HAR = [None, 'D', 'D', 'D', 'D', 'D', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'G', 'G', 'G', 'Em', 'E7', 'A', 'D', 'D', 'Em7', 'A7', 'D']
MEL = [[0, 2, 1, 62], [1, 0, 1, 62], [1, 1, 1, 66], [1, 2, 1, 69], [2, 0, 5.4, 69], [4, 2, 1, 62], [5, 0, 1, 62], [5, 1, 1, 66], [5, 2, 1, 69], [6, 0, 5.4, 69],
       [8, 2, 1, 61], [9, 0, 1, 61], [9, 1, 1, 64], [9, 2, 1, 71], [10, 0, 5.4, 71], [12, 2, 1, 61], [13, 0, 1, 61], [13, 1, 1, 64], [13, 2, 1, 71], [14, 0, 5.4, 71],
       [16, 2, 1, 62], [17, 0, 1, 62], [17, 1, 1, 66], [17, 2, 1, 69], [18, 0, 5.4, 74], [20, 2, 1, 62], [21, 0, 1, 62], [21, 1, 1, 66], [21, 2, 1, 69], [22, 0, 5.4, 74],
       [24, 2, 1, 64], [25, 0, 1, 64], [25, 1, 1, 67], [25, 2, 1, 71], [26, 0, 4, 71], [27, 1, 1, 68], [27, 2, 1, 69], [28, 0, 4, 78], [29, 1, 1, 74], [29, 2, 1, 66], [30, 0, 2, 66], [30, 2, 1, 64], [31, 0, 2, 71], [31, 2, 1, 69]]
ECH = [[2, 2, 81], [3, 0, 81], [3, 2, 78], [4, 0, 78], [6, 2, 81], [7, 0, 81], [7, 2, 79], [8, 0, 79], [10, 2, 83], [11, 0, 83], [11, 2, 79], [12, 0, 79], [14, 2, 83], [15, 0, 83], [15, 2, 78], [16, 0, 78],
       [18, 2, 86], [19, 0, 86], [19, 2, 81], [20, 0, 81], [22, 2, 86], [23, 0, 86], [23, 2, 83], [24, 0, 83]]
def kk(g):  # the arc of the dynamics (as V81): the first strain growing, the second broad, its peak at the long F sharp
    if g <= 16: return 0.78 + 0.22 * max(0, g - 6) / 10
    return 1.0 if g < 25 else [1.06, 1.1, 1.12, 1.18, 1.12, 1.08, 1.1][min(6, g - 25)]
def dscale(a, b): return [n for n in range(a, b + 1) if n % 12 in (2, 4, 6, 7, 9, 11, 1)]

# ---------------- the orchestra: stems → channels (bank, program, pan, volume, expr) ----------------
ORCH = {
  'strings': {'v1': (0, 21, 49, 34, 112, 1), 'v1s': (1, 20, 48, 34, 104, 0), 'v2': (2, 26, 49, 50, 108, 1), 'v2s': (3, 25, 48, 50, 100, 0), 'va': (4, 31, 49, 80, 104, 1),
              'vas': (5, 30, 48, 80, 98, 0), 'vc': (6, 41, 49, 92, 110, 1), 'cb': (8, 51, 49, 104, 108, 1), 'cbp': (10, 50, 45, 104, 116, 0), 'v1t': (11, 21, 44, 34, 104, 1),
              'vat': (12, 31, 44, 80, 98, 1), 'v2p': (13, 25, 45, 50, 96, 0), 'vap': (14, 30, 45, 80, 96, 0), 'cbs': (15, 50, 48, 104, 104, 0), 'vcs': (7, 40, 48, 92, 98, 0)},
  'winds': {'fl': (0, 17, 73, 58, 96, 1), 'fls': (1, 0, 73, 58, 92, 0), 'ob': (2, 17, 68, 68, 90, 1), 'cl': (3, 17, 71, 54, 92, 1), 'bn': (4, 17, 70, 74, 92, 1), 'bns': (5, 0, 70, 74, 88, 0)},
  'brass': {'hn': (0, 17, 60, 40, 100, 1), 'hns': (1, 0, 60, 40, 84, 0), 'tp': (2, 17, 56, 70, 86, 1), 'tb': (3, 17, 57, 86, 88, 1), 'tu': (4, 17, 58, 96, 92, 1), 'tus': (5, 0, 58, 96, 90, 0), 'hn2': (6, 17, 60, 46, 96, 1)},
  'perc': {'ti': (0, 0, 47, 62, 110, 0), 'hp': (1, 0, 46, 22, 112, 0), 'gl': (2, 0, 9, 74, 86, 0), 'rc': (3, 0, 119, 72, 80, 0), 'bd': (4, 8, 116, 66, 104, 0), 'kit': (9, 128, 48, 70, 100, 0)},
}
PART = {k: s for s, d in ORCH.items() for k in d}
NOTES = {s: [] for s in ORCH}; CCS = {s: [] for s in ORCH}
def J(s=0.006): return R.uniform(-s, s)
def note(part, p, t, d, v):
    s = PART[part]; ch = ORCH[s][part][0]; v = int(max(1, min(127, round(v)))); NOTES[s].append((max(0.0, t), max(0.03, d), ch, int(p), v))
def cc(part, t, num, val):
    s = PART[part]; ch = ORCH[s][part][0]; CCS[s].append((max(0.0, t), ch, num, int(max(0, min(127, round(val))))))
def curve(part, pts, num=2, step=0.04):  # a breath/bow curve through (t, value) points, linear between them
    pts = sorted(pts)
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        n = max(1, int((t1 - t0) / step))
        for i in range(n): cc(part, t0 + (t1 - t0) * i / n, num, v0 + (v1 - v0) * i / n)
    cc(part, pts[-1][0], num, pts[-1][1])
def line(part, ns, legato=0.04, vel=78):  # a melodic line: [(t, d, pitch)]; the notes overlap a little (legato) except on a repeated pitch
    for i, (t, d, p) in enumerate(ns):
        nxt = ns[i + 1] if i + 1 < len(ns) else None; e = t + d
        if nxt and abs(nxt[0] - e) < 0.12: e = nxt[0] + (legato if nxt[2] != p else -0.045)
        note(part, p, t, e - t, vel + R.uniform(-4, 4))
def shape(part, ns, base, swell=10, end=None, att=0.06):  # the dynamics of a line: each note a little arc, a long note a real swell
    pts = []
    for i, (t, d, p, lv) in enumerate(ns):
        L = base(t) * lv; long = d > 1.6
        pts += [(t, L * 0.9), (t + min(att, d * 0.3), L)]
        if long: pts += [(t + d * 0.45, L + swell), (t + d * 0.92, L - 4)]
        else: pts += [(t + d * 0.85, L * 0.97)]
    if end: pts.append(end)
    curve(part, pts)

# (the reverse cymbal's peak, measured)
REVCYM = 2.85
def measure_revcym():
    global REVCYM
    mid = mido.MidiFile(ticks_per_beat=960); tr = mido.MidiTrack(); mid.tracks.append(tr); tr.append(mido.MetaMessage('set_tempo', tempo=1000000))
    tr += [mido.Message('program_change', channel=0, program=119, time=0), mido.Message('note_on', channel=0, note=72, velocity=90, time=96), mido.Message('note_off', channel=0, note=72, velocity=0, time=960 * 6)]
    mid.save(os.path.join(OUT, 'rc.mid')); subprocess.run(['fluidsynth', '-ni', '-q', '-F', os.path.join(OUT, 'rc.wav'), '-r', str(SR), '-R', '0', '-C', '0', SF3, os.path.join(OUT, 'rc.mid')], capture_output=True)
    x, _ = sf.read(os.path.join(OUT, 'rc.wav'), always_2d=True); e = np.convolve(np.abs(x).mean(1), np.ones(480) / 480, 'same'); REVCYM = float(np.argmax(e)) / SR - 0.1
measure_revcym(); print('reverse cymbal peak after %.2f s' % REVCYM)

# ---------------- the introduction (0 … the upbeat) ----------------
for i, p in enumerate([69, 76, 81]): note('v1t', p, 0.05 + i * 0.12, tP - 0.25 - (0.05 + i * 0.12), 64)
curve('v1t', [(0, 0), (1.6, 46), (3.0, 52), (4.6, 64), (5.5, 44), (tP, 30)])
for i, p in enumerate([57, 64]): note('vat', p, 0.4 + i * 0.1, tP - 0.7 - i * 0.1, 58)
curve('vat', [(0, 0), (1.8, 36), (3.2, 42), (4.6, 52), (5.5, 36), (tP, 20)])
note('vc', 45, 0.6, tP - 1.0, 60); note('cb', 33, 0.5, tP - 0.9, 56)
curve('cb', [(0, 0), (1.8, 20), (4.4, 27), (5.2, 16)]); curve('vc', [(0, 0), (1.8, 32), (4.4, 42), (5.2, 28), (5.6, 0)])
line('hn', [(1.0, 0.68, 57), (1.72, 0.4, 61), (2.14, 1.75, 64)], vel=70); curve('hn', [(0.9, 34), (1.1, 46), (1.7, 44), (2.2, 48), (3.2, 58), (3.9, 36)])
line('fl', [(3.2, 0.24, 76), (3.52, 0.46, 76), (4.08, 0.24, 73), (4.4, 0.5, 73)], vel=66); curve('fl', [(3.1, 40), (3.3, 50), (3.95, 44), (4.15, 50), (4.6, 54), (4.95, 40)])
def harprun(ns, t0, t1, v0, v1):
    for x, n in enumerate(ns):
        p = x / (len(ns) - 1) if len(ns) > 1 else 0; note('hp', n, t0 + (t1 - t0) * p ** 0.88, 2.4, v0 + (v1 - v0) * p)
harprun([45, 52, 57, 61, 64, 67, 69, 73, 76, 79], 4.72, 5.62, 52, 70)
def roll(part, p, t0, t1, v0, v1):
    t = t0
    while t < t1: q = (t - t0) / (t1 - t0); note(part, p, t, 0.3, (v0 + (v1 - v0) * q) * R.uniform(0.9, 1.1)); t += R.uniform(0.058, 0.074)
roll('ti', 45, 4.9, tP - 0.35, 34, 66)
def cymswell(t_peak, v): note('rc', 72, t_peak - REVCYM, REVCYM + 0.05, v)  # (the reverse cymbal's swell placed so that its peak lands on the given time)
cymswell(tP - 0.3, 44)

# ---------------- the theme ----------------
prev = None; lines = {k: [] for k in ['vc', 'hn', 'bn', 'v1', 'v2', 'cl', 'fl', 'ob']}
for g, b, l, n in MEL:
    t = at(g, b) + J(0.004); d = ln(g, b, l) * (0.97 if l > 1.5 else 0.985); grand = g > 16 or (g == 16 and b == 2); hi = g >= 25 or (g == 24 and b == 2); k = kk(g)
    if not grand:
        lines['vc'].append((t, d, n - 12, k)); lines['hn'].append((t + 0.008, d, n, k * (0.82 if g < 9 else 1.0)))
        if g >= 9: lines['bn'].append((t + 0.004, d, n - 12, k))
    else:
        lines['v1'].append((t, d, n + 12 if hi else n, k)); lines['vc'].append((t, d, n - 12, k * 1.08))
        if hi: lines['v2'].append((t + 0.006, d, n, k))
        lines['hn'].append((t + 0.01, d, n, k)); lines['cl'].append((t + 0.004, d, n, k))
        if hi: lines['fl'].append((t, d, n + 12, k)); lines['ob'].append((t + 0.004, d, n, k))
for part, ns in lines.items():
    if not ns: continue
    # split a part's line where it rests for more than a bar (each piece is phrased on its own)
    seg = [[ns[0]]]
    for q in ns[1:]:
        if q[0] - (seg[-1][-1][0] + seg[-1][-1][1]) > 1.2: seg.append([q])
        else: seg[-1].append(q)
    for sg in seg: line(part, [(t, d, p) for t, d, p, _ in sg], vel={'vc': 76, 'hn': 72, 'bn': 64, 'v1': 90, 'v2': 86, 'cl': 74, 'fl': 80, 'ob': 74}[part])
base = {'vc': lambda t: 64 if t < at(16, 2) else 86, 'hn': lambda t: 60 if t < at(16, 2) else 80, 'bn': lambda t: 46, 'v1': lambda t: 88, 'v2': lambda t: 82, 'cl': lambda t: 66, 'fl': lambda t: 74, 'ob': lambda t: 68}
for part, ns in lines.items():
    if ns: shape(part, ns, base[part], swell=12 if part in ('v1', 'v2', 'vc') else 8)

# ---------------- the answering pairs ----------------
for g, b, n in ECH:
    t = at(g, b) + J(0.005); dn = b == 0; grand = g > 16; k = kk(g); d = 0.26 if dn else 0.18
    note('v1s', n, t, d, (90 if grand else 76) * k * (1.08 if dn else 0.94)); note('fls', n, t + 0.006, d, (82 if grand else 70) * k * (1.06 if dn else 0.94))
    if grand: note('gl', n, t, 1.2, 70 * (1.1 if dn else 0.85))
    elif g >= 9: note('v2s', n - 12, t + 0.008, d, 58 * k)

# ---------------- the waltz's step ----------------
pos = 0
for g in range(1, 32):
    h = HAR[g]; v, r = CH[h]; grand = g > 16; k = kk(g); pos = pos + 1 if h == HAR[g - 1] else 0; bn = r[pos % 2]
    t1 = at(g, 0) + J(0.004)
    if not grand:
        note('cbp', bn, t1 + 0.012, 0.6, 86 * k)
        for b in (1, 2):
            tb_ = at(g, b) + J(0.005); acc = 1.06 if b == 1 else 0.92
            if g < 9:  # (the harp keeps the step only in the first eight bars; then the strings and horns take it, as a Viennese orchestra does)
                for x, n in enumerate(v): note('hp', n + 12, tb_ + x * 0.004, 1.2, 54 * k * acc)
            if g < 9:
                for n in v[1:]: note('v2p', n, tb_ + 0.01, 0.3, 56 * k * acc)
                note('vap', v[0], tb_ + 0.012, 0.3, 54 * k * acc)
            else:
                for n in v[1:]: note('v2s', n, tb_ + 0.01, ln(g, b, 0.42), 62 * k * acc)
                note('vas', v[0], tb_ + 0.012, ln(g, b, 0.42), 62 * k * acc)
                for n in v[1:]: note('hns', n, tb_ + 0.016, ln(g, b, 0.45), (36 if g < 13 else 44) * k * acc)
    else:
        note('cbs', bn, t1 + 0.01, ln(g, 0, 1.1), 92 * k); note('cbp', bn, t1 + 0.014, 0.6, 84 * k); note('tus', bn, t1 + 0.016, ln(g, 0, 0.9), 70 * k); note('bns', bn + 12, t1 + 0.01, ln(g, 0, 0.8), 64 * k)
        for b in (1, 2):
            tb_ = at(g, b) + J(0.005); acc = 1.06 if b == 1 else 0.92
            for x, n in enumerate(v): note('vas', n, tb_ + 0.008 + x * 0.003, ln(g, b, 0.42), 76 * k * acc); note('hns', n, tb_ + 0.016, ln(g, b, 0.45), 62 * k * acc)
            if g <= 24:
                for n in v[1:]: note('v2s', n + 12, tb_ + 0.01, ln(g, b, 0.4), 72 * k * acc)
        if g >= 25:  # the trombones hold the chords under the climb
            for x, n in enumerate(v): note('tb', n - 12, t1 + 0.02, ln(g, 0, 2.9), 72)
# the trombones' and the bassoons' breath in the second strain; the winds' chords in the cadence
curve('tb', [(at(25, 0) - 0.1, 0), (at(25, 0), 60), (at(27, 0), 70), (at(28, 0), 86), (at(29, 0), 72), (at(31, 0), 78), (at(32, 0) - 0.05, 70)])
curve('bn', [(at(29, 0) - 0.1, 0), (at(29, 0), 56), (at(31, 2.5), 64)])
for g in (29, 30, 31):
    v, r = CH[HAR[g]]
    for part, nn in (('ob', [v[2] + 12]), ('bn', [r[0], v[0]])):
        for n in nn: note(part, n, at(g, 0) + 0.01, ln(g, 0, 2.95), 66)

# ---------------- the colours: the harp's glissando into the second strain, the timpani, the cymbals ----------------
harprun(dscale(50, 86), at(16, 1), at(16, 2.92), 34, 66); cymswell(at(17, 0), 62); roll('ti', 45, at(16, 1), at(17, 0) - 0.03, 36, 84)
for g, p, v in [(17, 38, 112), (18, 38, 92), (21, 45, 90), (22, 43, 96), (25, 40, 94), (26, 40, 96), (27, 45, 98), (28, 38, 116), (30, 40, 92), (31, 45, 96)]: note('ti', p, at(g, 0) + J(0.003), 0.8, v)
for g, v in [(17, 92), (22, 64), (28, 104)]: note('kit', 57, at(g, 0), 2.0, v)
for g, v in [(17, 84), (28, 96)]: note('bd', 36, at(g, 0), 1.2, v)
for g in (17, 21, 25, 28):
    v, r = CH[HAR[g]]; harprun([r[0] + 12] + v + [n + 12 for n in v], at(g, 0), at(g, 0) + 0.16, 58, 66)
cymswell(at(28, 0), 70); roll('ti', 45, at(31, 1), at(32, 0) - 0.02, 50, 96); harprun(dscale(45, 86), at(31, 1), at(31, 2.92), 38, 70)

# ---------------- the last chord: D major, the whole orchestra ----------------
FIN = {'v1': [78, 81, 86], 'v2': [69, 74], 'va': [62, 66], 'vc': [50, 57], 'cb': [38], 'fl': [81, 86], 'ob': [74, 78], 'cl': [69, 74], 'bn': [50, 57],
       'hn': [62, 66], 'hn2': [69, 74], 'tp': [74, 78], 'tb': [50, 57, 62], 'tu': [38]}
for part, ns in FIN.items():
    for n in ns: note(part, n, tE + J(0.008), dE * (0.9 if part == 'tp' else 1.0), 104)
    dyn = 100 if part in ('v1', 'v2', 'va', 'vc', 'cb') else 92
    curve(part, [(tE - 0.03, dyn * 0.7), (tE + 0.04, dyn), (tE + 0.5, dyn * 0.92), (tE + 1.7, dyn * 0.82), (tE + dE, dyn * 0.72)])
note('cbp', 38, tE + 0.01, 0.8, 104); note('ti', 38, tE, 1.2, 120); roll('ti', 38, tE + 0.12, tE + 1.9, 92, 58); note('ti', 50, tE + 0.01, 1.0, 96)
note('kit', 57, tE, 3.0, 112); note('bd', 36, tE, 2.0, 108); note('kit', 81, tE + 0.02, 2.0, 72); note('gl', 86, tE, 2.0, 80)
harprun([38, 50, 57, 62, 66, 69, 74, 78, 81, 86], tE, tE + 0.26, 70, 76)

# ---------------- MIDI per stem ----------------
def write_mid(stem, fn):
    mid = mido.MidiFile(ticks_per_beat=960); tr = mido.MidiTrack(); mid.tracks.append(tr); tr.append(mido.MetaMessage('set_tempo', tempo=1000000))  # 960 ticks = 1 s
    ev = []
    for part, (ch, bank, prog, pan, vol, expr) in ORCH[stem].items():
        if ch == 9: ev += [(0, 0, mido.Message('program_change', channel=9, program=prog))]
        else: ev += [(0, 0, mido.Message('control_change', channel=ch, control=0, value=bank)), (0, 1, mido.Message('program_change', channel=ch, program=prog))]
        ev += [(0, 2, mido.Message('control_change', channel=ch, control=10, value=pan)), (0, 2, mido.Message('control_change', channel=ch, control=7, value=vol)),
               (0, 2, mido.Message('control_change', channel=ch, control=91, value=0)), (0, 2, mido.Message('control_change', channel=ch, control=93, value=0))]
        if expr: ev.append((0, 3, mido.Message('control_change', channel=ch, control=2, value=0)))
    for t, ch, num, val in CCS[stem]: ev.append((t, 3, mido.Message('control_change', channel=ch, control=num, value=val)))
    for t, d, ch, p, v in NOTES[stem]:
        ev.append((t, 5, mido.Message('note_on', channel=ch, note=p, velocity=v))); ev.append((t + d, 4, mido.Message('note_off', channel=ch, note=p, velocity=0)))
    ev.sort(key=lambda e: (e[0], e[1])); last = 0
    for t, _, m in ev: tk = int(round(t * 960)); m.time = tk - last; last = tk; tr.append(m)
    mid.save(fn)
def render(stem):
    mf = os.path.join(OUT, stem + '.mid'); wf = os.path.join(OUT, stem + '.wav'); write_mid(stem, mf)
    r = subprocess.run(['fluidsynth', '-ni', '-q', '-F', wf, '-r', str(SR), '-g', '0.35', '-R', '0', '-C', '0', '-o', 'synth.polyphony=1024', '-o', 'synth.reverb.active=0', '-o', 'synth.chorus.active=0', SF3, mf], capture_output=True, text=True)
    x, sr = sf.read(wf, always_2d=True); assert sr == SR, sr; return x
# ---------------- the hall ----------------
def hall(sr=SR, T=3.0, seed=7):
    rng = np.random.default_rng(seed); n = int(sr * T); t = np.arange(n) / sr; out = np.zeros((n, 2))
    bands = [(20, 180, 2.5), (180, 360, 2.3), (360, 720, 2.1), (720, 1400, 1.95), (1400, 2800, 1.7), (2800, 5600, 1.3), (5600, 11000, 0.85), (11000, 23000, 0.5)]
    pre = int(0.021 * sr)
    for c in range(2):
        nz = rng.standard_normal(n)
        for lo, hi, t60 in bands:
            sos = signal.butter(4, [lo, min(hi, sr / 2 - 100)], btype='band', fs=sr, output='sos'); bnd = signal.sosfilt(sos, nz)
            out[:, c] += bnd * np.exp(-6.9078 * t / t60)
        out[:, c] = np.concatenate([np.zeros(pre), out[:-pre, c]])
        env = np.clip(t / 0.06, 0, 1) ** 1.5; out[:, c] *= env  # (the late field builds up)
        ER = [(0.009, 0.5), (0.014, 0.42), (0.019, 0.36), (0.026, 0.3), (0.033, 0.26), (0.041, 0.22), (0.052, 0.18), (0.064, 0.15), (0.078, 0.12)]
        el = np.sum(out[:, c] ** 2); sc = math.sqrt(el * 0.3 / sum(g * g for _, g in ER))  # (the early reflections carry 30 % of the late field's energy)
        for dt, g in ER:
            k = int((dt * (1.0 + 0.07 * c)) * sr); out[k, c] += g * sc * (1 if rng.random() < 0.5 else -1)
    out /= np.sqrt(np.sum(out ** 2) / 2); return out
def conv(x, ir): return np.stack([signal.fftconvolve(x[:, 0], ir[:, 0])[:len(x)] * 0.5 + signal.fftconvolve(x[:, 1], ir[:, 0])[:len(x)] * 0.15, signal.fftconvolve(x[:, 1], ir[:, 1])[:len(x)] * 0.5 + signal.fftconvolve(x[:, 0], ir[:, 1])[:len(x)] * 0.15], 1)

stems = {s: render(s) for s in ORCH}
L = max(len(x) for x in stems.values()); L = max(L, int((END + 0.6) * SR))
for s in stems: stems[s] = np.vstack([stems[s], np.zeros((L - len(stems[s]), 2))])
IR = hall()
MIX = {'strings': (1.06, 0.30), 'winds': (0.84, 0.38), 'brass': (0.68, 0.44), 'perc': (0.86, 0.40)}  # (dry gain, hall send)
mix = np.zeros((L, 2))
for s, x in stems.items():
    g, w = MIX[s]; mix += g * x + g * w * conv(x, IR) * 1.0
# master: the floor cleaned (high-pass 30 Hz), a little air, the end faded into the hall
sos = signal.butter(2, 30, btype='high', fs=SR, output='sos'); mix = signal.sosfiltfilt(sos, mix, axis=0)
n_end = int((END + 0.5) * SR); mix = mix[:n_end]; fade = np.ones(n_end); f0 = int((END - 0.9) * SR); fade[f0:] = np.cos(np.linspace(0, np.pi / 2, n_end - f0)) ** 2; mix *= fade[:, None]
def comp(x, thr=-26.0, ratio=2.2, att=0.04, rel=0.5, cr=1000):  # a slow master compressor (the orchestra's range narrowed for small speakers)
    n = len(x); hop = SR // cr; e = np.sqrt(np.mean(x ** 2, 1)); m = len(e) // hop; ec = np.sqrt(np.mean(e[:m * hop].reshape(m, hop) ** 2, 1) + 1e-12)
    lv = 20 * np.log10(ec); want = -np.maximum(0, lv - thr) * (1 - 1 / ratio); g = np.zeros(m); cur = 0.0; ka = math.exp(-1 / (att * cr)); kr = math.exp(-1 / (rel * cr))
    for i in range(m): k = ka if want[i] < cur else kr; cur = want[i] + (cur - want[i]) * k; g[i] = cur
    gi = np.interp(np.arange(n), np.arange(m) * hop + hop / 2, g); return x * (10 ** (gi / 20))[:, None]
mix = comp(mix)
import pyloudnorm as pyln
meter = pyln.Meter(SR); lu = meter.integrated_loudness(mix); mix *= 10 ** ((-16.0 - lu) / 20)
def tpeak(x): return np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0)))
pk = tpeak(mix); lim = 10 ** (-1.5 / 20)
from scipy.ndimage import minimum_filter1d, uniform_filter1d
for _ in range(3):  # a gentle look-ahead limiter on the few peaks (sample peaks, then the true peak checked again)
    if tpeak(mix) <= lim: break
    a = np.max(np.abs(mix), 1); gr = np.minimum(1, lim * 0.96 / np.maximum(a, 1e-9)); w = int(0.004 * SR)
    gs = uniform_filter1d(minimum_filter1d(gr, size=2 * w + 1), size=w); mix *= gs[:, None]
lu2 = meter.integrated_loudness(mix); pk2 = 20 * np.log10(tpeak(mix))
wav = os.path.join(OUT, 'score85.wav'); sf.write(wav, mix.astype(np.float32), SR, subtype='FLOAT')
mp3 = os.path.join(OUT, 'score85.mp3'); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-q:a', '2', '-ar', str(SR), mp3], check=True)
info = {'dur': round(len(mix) / SR, 3), 'lufs': round(lu2, 2), 'tp': round(pk2, 2), 'notes': sum(len(v) for v in NOTES.values()), 'mp3': os.path.getsize(mp3), 'END': round(END, 3), 'T1': BS[9], 'T2': (BS[29] - BS[9]) / 0.72}
print(json.dumps(info))
if not ARGS.no_js:
    b64 = base64.b64encode(open(mp3, 'rb').read()).decode()
    js = ('/* ===== (V85) the opening film\'s score, recorded: "An der schönen blauen Donau", Walzer Op. 314 (Johann Strauss II, 1867; public domain),\n'
          '   this guide\'s own arrangement played by a sampled orchestra (MuseScore General: string sections from VSCO 2 CE, CC0; winds, brass,\n'
          '   harp and percussion, MIT) and mixed in a synthesised hall — made by game/tools/mkscore85.py. MP3, ' + str(info['dur']) + ' s, ' + str(info['lufs']) + ' LUFS. ===== */\n'
          'var KSC_REC = { mime: \'audio/mpeg\', dur: ' + str(info['dur']) + ', end: ' + str(round(END, 3)) + ', b64: \'' + b64 + '\' };\n')
    open(ARGS.js, 'w').write(js); print('wrote', ARGS.js, len(js))
