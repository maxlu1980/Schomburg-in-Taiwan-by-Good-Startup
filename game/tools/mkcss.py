# The game's stylesheet: the reference's .isle rules with SCHOMBURG's red in place of AUTO CHEMICAL's orange, plus the Köln additions.
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
import re
s = open(ROOT / 'game' / 'css' / 'isle_raw.css', encoding='utf-8').read()
SW = { '#e5600c': '#e3000f', '#f97b00': '#ff3b44', '#ef7a1d': '#d8101e', '#ff9a3a': '#ff5a60', '#ff8a2a': '#ff464d', '#ffb15c': '#ff8a8e', '#f07a12': '#d8101e',
       'rgba(229,96,12': 'rgba(227,0,15', 'rgba(239,122,29': 'rgba(216,16,30', 'rgba(249,123,0': 'rgba(255,59,68' }
for a, b in SW.items(): s = s.replace(a, b).replace(a.upper(), b)
# (V75) the loading screen stays over the game while the city is built (the reference hid everything but the game once it was open)
s = s.replace('body.isle-open > :not(.isle):not(.hsim):not(script):not(style){display:none!important}', 'body.isle-open > :not(.isle):not(.hsim):not(.kload):not(script):not(style){display:none!important}')
# ---- (V83) SCHOMBURG CIS: the reference's cartoon look (cream, thick outlines, hard drop shadows, pills) turned into the SCHOMBURG identity:
#      white and grey grounds, one red, black hairlines, square corners, no shadows, Bold / Book / Light (the SCHOMBURG design system, tokens.json)
def _cis(css):
    C = [('--ink:#2b2420', '--ink:#231f20'), ('--cream:#fff8ec', '--cream:#ffffff'), ('--cream2:#fff1dc', '--cream2:#e6e7e8'), ('--or2:#ff3b44', '--or2:#b3000c'), ('--teal:#0e9fb0', '--teal:#005baa'),
         ('#2b2420', '#231f20'), ('rgba(43,36,32,', 'rgba(35,31,32,'), ('#4a3c33', '#231f20'), ('#6a5a4f', '#5e5f62'), ('#6a5e54', '#5e5f62'), ('#fff8ec', '#ffffff'), ('#fff1dc', '#e6e7e8'),
         ('#f4ead8', '#e6e7e8'), ('#cfc3b4', '#d1d3d4'), ('#2cc0cf', '#005baa'), ('#0e8fa0', '#005baa')]
    for a, b in C: css = css.replace(a, b)
    KEEP_R = ['isle__coin', 'isle__stampi', 'isle__sbf', 'isle__stop i', 'isle__ph-from i', 'is-typing b', 'isle__meal', 'isle__gic--', 'kin__pin', 'isle__navpin', 'isle__msgh i', 'isle__gsradar', 'isle__stick', 'isle__btn--guide b::before', 'isle__navpa']
    KEEP_S = ['isle__dxfx', 'violet hush', 'isle__meal', 'isle__navpin', 'isle__gi.is-on', 'isle__ph-from']
    def rule(m):
        sel, body = m.group(1), m.group(2)
        if not any(k in sel for k in KEEP_R): body = re.sub(r'border-radius:[^;}]+', 'border-radius:0', body)
        if not any(k in sel for k in KEEP_S): body = re.sub(r'box-shadow:[^;}]+', 'box-shadow:none', body)
        body = re.sub(r'(border(?:-[a-z]+)?:\s*)[23](?:\.5)?px solid (var\(--ink\)|#231f20)', r'\g<1>1px solid \2', body)
        body = re.sub(r'font:\s*(?:800|900|600)\s', 'font:700 ', body); body = re.sub(r'font-weight:\s*(?:800|900|600)', 'font-weight:700', body)
        body = re.sub(r'font:\s*500\s', 'font:400 ', body); body = re.sub(r'font-weight:\s*500', 'font-weight:400', body)
        return sel + '{' + body + '}'
    return re.sub(r'([^{}]+)\{([^{}]*)\}', rule, css)
s = _cis(s)
extra = (SRC / 'isle' / 'k_style.css').read_text(encoding='utf-8') if (SRC / 'isle' / 'k_style.css').exists() else ''
cisx = (SRC / 'isle' / 'k_cis.css').read_text(encoding='utf-8') if (SRC / 'isle' / 'k_cis.css').exists() else ''
extra = _cis(extra) + '\n' + cisx
(SRC / 'isle.css').write_text(s + '\n' + extra, encoding='utf-8'); print('isle.css', len(s) + len(extra))
