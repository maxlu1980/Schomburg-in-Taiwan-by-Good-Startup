# Top-level name collisions between the Köln parts (src/koeln/isle/*.js) and the reference parts, in the assembled kisle.js.
# All parts share one scope: a Köln `var X` that the reference also declares silently replaces the reference's X (V64: ARM broke the duels).
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
import re
full = open(SRC / 'kisle.js', encoding='utf-8').read()
segs = re.split(r'/\* ===== \[([\w.]+)\] ===== \*/\n', full)
def tops(t):
    d = {}
    for m in re.finditer(r'^  (var|function)\s+([A-Za-z_$][\w$]*)', t, re.M): d.setdefault(m.group(2), m.group(1))
    return d
base, kol = {}, {}
for k in range(1, len(segs), 2):
    (base if segs[k].startswith('island_') else kol)[segs[k]] = tops(segs[k + 1])
ball = {}
for n, d in base.items():
    for x, kd in d.items(): ball.setdefault(x, (n, kd))
bad = 0
for n, d in kol.items():
    vc = [(x, d[x], ball[x]) for x in d if x in ball and (d[x] == 'var' or ball[x][1] == 'var')]
    if vc: bad += 1; print(n, 'COLLIDES:', vc)
print('names in reference parts:', len(ball), '| parts with collisions:', bad)
