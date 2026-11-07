# usage: python3 game/tools/patchcheck.py game/tools/kpatch_x.py
# checks that every patch(part, old, new) in the file finds `old` exactly once in game/ref/parts/<part>.js
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
if not REF.is_dir():
    raise SystemExit(__file__ + ': needs the reference engine (game/ref/), which is not in the repository — see README.')
import sys
P = str(REF / 'parts') + '/'
_bad = []; _n = [0]
def patch(part, old, new, n=1):
    _n[0] += 1
    try: s = open(P + part + '.js').read()
    except Exception as e: _bad.append((part, 'no such part')); return
    c = s.count(old)
    if c != n: _bad.append((part, '%d found (want %d): %r' % (c, n, old[:90])))
exec(open(sys.argv[1]).read())
print('patches:', _n[0], 'bad:', len(_bad))
for b in _bad: print('  BAD', b)
