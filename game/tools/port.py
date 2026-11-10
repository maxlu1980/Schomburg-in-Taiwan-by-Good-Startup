# Assemble the Köln game (KISLE) from the reference ISLE parts + the Köln parts, with exact-string patches.
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
if not (REF / 'parts').is_dir():
    raise SystemExit('port.py: the reference engine parts (game/ref/parts/*.js) are not in the repository — the assembled src/koeln/kisle.js is committed; re-assembling needs the reference (see README, "What is not in the repository").')
import os, re, sys
P = str(REF / 'parts') + '/'; OUT = str(SRC) + '/'
ORDER = ['00_island_a', '01_island_b', '02_island_d', '03_island_e', '04_island_f', '05_island_f2', '06_island_g', '07_island_h', '08_island_i', '09_island_j',
         '11_island_k', '12_island_l', '13_island_m', '14_island_n', '15_island_o', '16_island_p', '17_island_q', '18_island_r', '19_island_s',
         '20_island_t', '26_island_z', '@koeln', '27_island_c']
KPARTS = ['k_world.js', 'k_city.js', 'kt_ui.js', 'k_play.js', 'k_train.js', 'k_ui.js', 'kt_world.js', 'kt_street.js', 'kt_fight.js', 'k_voice.js', 'k_vox.js', 'k_arms.js', 'k_indoor.js', 'k_perf.js', 'k_pol.js', 'k_dom.js', 'k_cam.js', 'k_rtx.js', 'k_portal.js', 'k_load.js', 'k_crowd.js', 'k_peds.js', 'k_intro.js', 'k_fix.js', 'k_gfx.js', 'k_col.js', 'k_dev.js']   # the Köln parts (in src/koeln/isle/), inserted at '@koeln' in this order (those that exist)
PATCH = {}
RECOLOR = {}   # part -> {old: new}: every occurrence (colours of effects)
SECT = {}   # part -> [(start marker, end marker (inclusive line), file)] : the lines from the start marker to the end of the end marker's line are replaced by the file
def sect(part, a, b, f): SECT.setdefault(part, []).append((a, b, f))
sect('00_island_a', '  var T = {', '\n  };', 'k_strings.js')
sect('00_island_a', '  /* ----- the product worlds', '  function catOf(st) { return ST2[st]; }', ['k_guides.js', 'k_data.js'])
sect('00_island_a', '  var STAMPS = [', "'ken.boss'];", 'k_stamps.js')
def patch(part, old, new, n=1): PATCH.setdefault(part, []).append((old, new, n))

# ---- part a: Köln's own save; the stamps come with the data ----
patch('00_island_a', "var KEY = 'ac-isle2'", "var KEY = 'schomburg-koeln-1'")
patch('00_island_a', "JSON.parse(localStorage.getItem('ac-isle') || 'null')", "null")
# ---- part b: the world is Köln's (KW), no island people, the three languages of the site ----
patch('01_island_b', "if (typeof THREE === 'undefined' || typeof LUNA === 'undefined' || typeof TWW === 'undefined') return false;", "if (typeof THREE === 'undefined' || typeof LUNA === 'undefined' || typeof KW === 'undefined') return false;")
patch('01_island_b', "W = TWW.build(scene, { low: TIER === 'low' || COARSE, quality: q });", "W = KW.build(scene, { low: TIER === 'low' || COARSE, quality: q }); koWorld();")
patch('01_island_b', "var tp = W.places.tpe; for (var i = 0; i < 3; i++) {", "var tp = W.places.tpe; for (var i = 0; tp && i < 3; i++) {")
patch('01_island_b', "R3.domElement.setAttribute('aria-label', 'AUTO ISLAND 3D');", "R3.domElement.setAttribute('aria-label', 'SCHOMBURG KÖLN 3D');")
patch('01_island_b', '<button type="button" data-l="zh">繁體中文</button><button type="button" data-l="en">English</button><button type="button" data-l="ja">日本語</button>', '<button type="button" data-l="en">English</button><button type="button" data-l="zh">繁體中文</button><button type="button" data-l="de">Deutsch</button>')
patch('01_island_b', "alt=\"AUTO CHEMICAL INDUSTRY CO., LTD.\"", "alt=\"SCHOMBURG\"")
patch('01_island_b', "b.querySelector('span').textContent = k === 'lang' ? ({ zh: '中文', en: 'EN', ja: '日本語' })[LANG] || 'EN' : L2;", "b.querySelector('span').textContent = k === 'lang' ? ({ zh: '中文', en: 'EN', de: 'DE' })[LANG] || 'EN' : L2;")
# ---- part f2: the island's sea creatures need its distance field ----
patch('05_island_f2', "var east = [[121.62, 23.62], [121.48, 23.25], [121.25, 22.85]]; east.forEach(", "var east = typeof TWG !== 'undefined' && TWG.sdf ? [[121.62, 23.62], [121.48, 23.25], [121.25, 22.85]] : []; east.forEach(")
# ---- part j: Köln is wider than a Tokyo street: the clear distance ----
patch('09_island_j', "far = 460 * (1 - 0.55 * Math.min(1, s.rain))", "far = (TK && TK.id === 'koeln' ? 1150 : 460) * (1 - 0.55 * Math.min(1, s.rain))")
patch('07_island_h', "if (W.fog) { W.fog.near = 70; W.fog.far = 460; } }\n", "if (W.fog) { W.fog.near = 70; W.fog.far = TK && TK.id === 'koeln' ? 1150 : 460; } }\n")
# ---- part c: the language pop-up and the island's map ----
patch('27_island_c', "[['zh', '繁體中文'], ['en', 'English'], ['ja', '日本語']]", "[['en', 'English'], ['zh', '繁體中文'], ['de', 'Deutsch']]")

# ---- the text agents' patches (exact strings, per part) ----
for _pf in ['kpatch_ui.py', 'kpatch_world.py', 'kpatch_street.py', 'kpatch_fight.py', 'kpatch_k.py', 'kpatch_v80.py', 'kpatch_v83.py', 'kpatch_v84.py', 'kpatch_v85.py']:
    if (ROOT / 'game' / 'tools' / _pf).exists(): exec(open(ROOT / 'game' / 'tools' / _pf, encoding='utf-8').read())

def build():
    out = ['/* ===== KISLE — SCHOMBURG · KÖLN: the game of the guide, on the engine of the reference game (AUTO 台灣島) ===== */\n']
    for name in ORDER:
        if name == '@koeln':
            for k in KPARTS:
                fp = OUT + 'isle/' + k
                if os.path.exists(fp): out.append('/* ===== [' + k + '] ===== */\n' + open(fp).read() + '\n')
            continue
        s = open(P + name + '.js').read()
        for a, b, f in SECT.get(name, []):
            fl = f if isinstance(f, list) else [f]
            fl = [OUT + 'isle/' + x for x in fl if os.path.exists(OUT + 'isle/' + x)]
            if not fl: continue
            i = s.find(a); j = s.find(b, i + len(a))
            if i < 0 or j < 0 or s.count(a) != 1: raise SystemExit('section failed in %s: %r' % (name, a))
            j = s.find('\n', j + len(b)) + 1
            s = s[:i] + ''.join(open(x).read().rstrip('\n') + '\n' for x in fl) + s[j:]
        for old, new, n in PATCH.get(name, []):
            c = s.count(old)
            if c != n: raise SystemExit('patch failed in %s (%d found, %d wanted): %r' % (name, c, n, old[:110]))
            s = s.replace(old, new)
        for old, new in RECOLOR.get(name, {}).items():
            if old not in s: raise SystemExit('recolor failed in %s: %r' % (name, old))
            s = s.replace(old, new)
        out.append(s + '\n')
    js = ''.join(out)
    open(OUT + 'kisle.js', 'w').write(js); print('kisle.js', len(js))
build()
