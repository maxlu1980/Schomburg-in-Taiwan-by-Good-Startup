#!/usr/bin/env python3
"""Merge the competitor research (cmp/research/*.json) into the comparison data (CMP) of the guides.
   - keeps the earlier entries (relabelled by group), replaces the ones the research superseded
   - one product per brand and slot; sparse entries (fewer than 4 published values) go to a 'listed' line
   - per slot: which of the twelve manufacturer groups have no corresponding product
   - carries the German translations (from the i18n chunks) into the data itself: every text object {en, zh, de}
   Writes cmp/cmp_new.json and cmp/view/<slot>.txt (a review view of every slot)."""
import json, glob, re, pathlib, copy
R = pathlib.Path(__file__).parent
C = json.load(open(R / 'cmp_current.json', encoding='utf-8'))
NOW = '2026-10-24'

# ---------- groups, in the order of the request ----------
ORDER = ['Sika', 'Saint-Gobain', 'RPM', 'Arkema', 'Mapei', 'Kryton', 'Penetron', 'Oriental Yuhong', 'Denka', 'Sobute', 'MC-Bauchemie']
BRAND_ORDER = ['Sika', 'Master Builders Solutions', 'Davco', 'ParexLanko', 'Fosroc', 'Weber', 'GCP Applied Technologies', 'Chryso', 'Xypex',
               'Vandex', 'Tremco', 'Euclid Chemical', 'Prime Resins', 'Volteco', 'Flowcrete', 'Stonhard', 'Bostik', 'Mapei', 'Kryton', 'Penetron',
               'Oriental Yuhong', 'VASA', 'Caparol China', 'Denka', 'Sobute', 'MC-Bauchemie']
# the twelve names of the request, for the "no corresponding product" line: key → (label, test on (group, brand))
TWELVE = [('Sika', lambda g, b: g == 'Sika'), ('Saint-Gobain', lambda g, b: g == 'Saint-Gobain' and b != 'Xypex'), ('RPM', lambda g, b: g == 'RPM'),
          ('Arkema', lambda g, b: g == 'Arkema'), ('Mapei', lambda g, b: g == 'Mapei'), ('Xypex', lambda g, b: b == 'Xypex'),
          ('Kryton', lambda g, b: g == 'Kryton'), ('Penetron', lambda g, b: g == 'Penetron'), ('Oriental Yuhong', lambda g, b: g == 'Oriental Yuhong'),
          ('Denka', lambda g, b: g == 'Denka'), ('Sobute', lambda g, b: g == 'Sobute'), ('MC-Bauchemie', lambda g, b: g == 'MC-Bauchemie')]
NONE_LABEL = {'Sika': 'Sika group (Sika, Master Builders Solutions, Davco, ParexLanko)', 'Saint-Gobain': 'Saint-Gobain (Fosroc, Weber, GCP, Chryso)',
              'RPM': 'RPM (Tremco CPG, Vandex, Euclid, Volteco, Flowcrete, Stonhard)', 'Arkema': 'Arkema (Bostik)', 'Xypex': 'Xypex (Saint-Gobain)'}
SYMBOLS = {'Sika': ('Sika', 'Sika'), 'Master Builders Solutions': ('Sika', 'Master Builders Solutions'), 'Master Builders Solutions (now Sika)': ('Sika', 'Master Builders Solutions'),
           'Master Builders Solutions / Sika': ('Sika', 'Master Builders Solutions'), 'Mapei': ('Mapei', 'Mapei'), 'Fosroc': ('Saint-Gobain', 'Fosroc'),
           'Penetron': ('Penetron', 'Penetron'), 'Kryton': ('Kryton', 'Kryton')}
BRAND_FIX = {'Caparol (德爱威, China)': 'Caparol China', 'Davco / ParexLanko': 'Davco', 'RPM (all brands)': 'RPM'}

# ---------- what the research superseded or what is left out ----------
DROP_OLD = [('wp/AQ1K', 'Vandex BB75-Z'), ('wp/AQ2K', 'Vandex BB75E-Z'), ('ca/CL170', 'MasterLife WP 1000'), ('ca/CL170', 'PENETRON ADMIX')]  # re-sourced from Vandex / replaced by the Sika-owned SikaControl
SKIP_NEW = [('wp/AQ1K', 'VANDEX BB 75'), ('wp/AQ2K', 'VANDEX CEMELAST'), ('wp/AQ1K', 'BLOCK X701'), ('wp/AQ1K', 'VASA'), ('pf/B351', 'Nitoflor® FC150'),
            ('cr/IM', 'MasterSeal® 502')]  # one product per brand and slot
SKIP_EXACT = [('wp/AQ1K', 'VANDEX BB 75')]  # exact names (BB 75 vs BB 75 Z)

# ---------- short notes on the correspondence, shown with the source ----------
NOTE_TXT = {
    'pu1k': ('1-component water-reactive PU; no 2-component elastic resin in the range', '單組分水反應型 PU；該廠無雙組分彈性樹脂', '1-komponentiges wasserreaktives PU; kein 2-komponentiges elastisches Harz im Sortiment'),
    'foam2k': ('2-component foam (resin + catalyst)', '雙組分發泡（樹脂＋觸媒）', '2-komponentiger Schaum (Harz + Katalysator)'),
    'semirigid': ('semi-rigid resin (Shore A 80)', '半剛性樹脂（蕭氏 A 80）', 'halbstarres Harz (Shore A 80)'),
    'notcryst': ('not crystalline', '非結晶型', 'nicht kristallin'),
    'nocls': ('no EN 1504-3 class stated', '未標示 EN 1504-3 等級', 'keine Klasse nach EN 1504-3 angegeben'),
    'notrapid': ('not marketed as rapid', '非快速型產品', 'nicht als schnell ausgewiesen'),
    'epcem': ('epoxy-cement, not pure epoxy', '環氧水泥，非純環氧', 'Epoxid-Zement, kein reines Epoxid'),
    'primer': ('primer only (no binder use stated)', '僅為底漆（未載明可作結合料）', 'nur Grundierung (keine Verwendung als Bindemittel angegeben)'),
    'lining': ('fabric-reinforced lining, not a rolled sealing coat', '纖維布補強襯層，非滾塗封閉塗層', 'gewebeverstärkte Auskleidung, keine gerollte Versiegelung'),
    'noplast': ('no plasticising effect stated', '未載明減水（塑化）效果', 'keine verflüssigende Wirkung angegeben'),
    'r4fine': ('R4 mortar, also used as fine filler', 'R4 砂漿，兼作細修補', 'R4-Mörtel, auch als Feinspachtel verwendet'),
    'twok': ('2-component', '雙組分', '2-komponentig'),
    'osmotic': ('osmotic mortar, not crystalline', '滲透型砂漿，非結晶型', 'osmotischer Mörtel, nicht kristallin'),
    'twopart': ('2-part system (powder + primer)', '雙劑系統（粉體＋底劑）', '2-teiliges System (Pulver + Grundierung)'),
    'notepoxy': ('chemistry not stated as epoxy', '未載明為環氧樹脂', 'Chemie nicht als Epoxid angegeben'),
    'thirdparty': ('values from a copy of the manufacturer\'s data sheet on a third-party site', '數值取自第三方網站轉載之原廠資料表', 'Werte aus einer Kopie des Herstellermerkblatts auf einer Drittseite'),
    'facade': ('façade joints; floor use not stated', '外牆接縫用；未載明可用於地坪', 'Fassadenfugen; Bodeneinsatz nicht angegeben'),
    'plug': ('plugging mortar, not a repair mortar', '止漏塞縫材，非修補砂漿', 'Stopfmörtel, kein Reparaturmörtel'),
    'hellas': ('Penetron Hellas (Greece) range; not on penetron.com', 'Penetron Hellas（希臘）產品，未列於 penetron.com', 'Sortiment von Penetron Hellas (Griechenland); nicht auf penetron.com'),
    'liquidnc': ('liquid pore-blocking / water-reducing, not crystalline', '液態孔隙阻塞／減水型，非結晶型', 'flüssig, porenverschließend / wasserreduzierend, nicht kristallin'),
    'r3': ('R3 mortar, not crystalline', 'R3 砂漿，非結晶型', 'R3-Mörtel, nicht kristallin'),
}
NOTES = [  # (slot, product substring, [note keys])
    ('inj/P4', 'AQUA-FIL', ['pu1k']), ('inj/P4', 'WPU20', ['pu1k']), ('inj/P4', 'INJECTION RESIN (SR)', ['semirigid', 'hellas']),
    ('inj/P1', 'INJECTION FOAM', ['foam2k', 'hellas']),
    ('cr/BIS540', 'MULTI PATCH', ['hellas']), ('cr/BIS16', 'CR-90', ['hellas']), ('wp/AQ1K', 'SEAL COAT', ['hellas']), ('wp/AQ2K', 'SEAL COAT', ['hellas']), ('pf/GBM', 'PENEPOX', ['hellas']),
    ('cr/BIS540', 'Megamix', ['nocls']), ('cr/BIS16', 'Megamix', ['nocls']), ('cr/BIS540', 'Krystol', ['nocls']), ('cr/BIS540', 'RIS', ['nocls']), ('cr/BIS16', 'RENO C205', ['nocls']),
    ('cr/BIS16', 'R4 duo', ['r4fine']), ('cr/BIS16', 'FIBROeRASO', ['r4fine']),
    ('cr/HSF', 'RIS', ['twopart']),
    ('cr/IM', 'weber.tec 933', ['notcryst']), ('cr/IM', 'UNI MORTAR', ['r3']), ('cr/IM', 'キューテックス', ['plug', 'notcryst']), ('cr/IM', 'ombran', ['plug', 'notcryst']), ('cr/IM', 'Waterplug', ['plug', 'notcryst']),
    ('wp/RB400', 'SikaTop®-126', ['notrapid']), ('wp/RB400', 'OS 5', ['notrapid']),
    ('wp/AQ1K', 'TREMproof M', ['twok']), ('wp/AQ1K', 'YHCoat-1000', ['twok']), ('wp/AQ1K', 'Estokote Grey', ['twok']),
    ('rc/IC', 'Planiseal 88', ['osmotic']),
    ('ca/CL170', 'Two in One', ['liquidnc']), ('ca/CL170', 'AM-10L', ['noplast']),
    ('pf/SG3', 'Sikagard®-385', ['epcem']), ('pf/SG3', 'Estogard EMB', ['epcem']),
    ('pf/GBM', 'Standard Primer', ['primer']), ('pf/GBM', 'HYTEC E730', ['primer']), ('pf/GBM', 'Estoprime', ['primer']),
    ('pf/V2370', 'Stonchem 556', ['lining']), ('pf/V2370', 'PowerPro', ['notepoxy']),
    ('pf/IPU', 'NP 474', ['thirdparty']), ('pf/IPU', 'Estoseal', ['facade']), ('pf/IPU', 'P360', ['facade']),
    ('ca/CP360', 'Conplast', ['thirdparty']),
]

def gb(e):
    g, b = e.get('group'), BRAND_FIX.get(e.get('brand'), e.get('brand'))
    return g, b

def label(g, b):
    return b if g == b else b + ' (' + g + ')'

# ---------- the German strings of the CMP data, from the i18n chunks ----------
DEK = {}
for f in sorted((R.parent / 'i18n' / 'de').glob('c*.json')): DEK.update(json.load(open(f, encoding='utf-8')))
OUD = {}
for f in sorted((R.parent / 'i18n' / 'de').glob('ours_*.json')): OUD.update(json.load(open(f, encoding='utf-8')))

def de_of(path, en):
    """German for the text object at path (string or list of strings)"""
    if isinstance(en, list): return [DEK.get(path + '|/' + str(i), x) for i, x in enumerate(en)]
    return DEK.get(path + '|', en)

N = {'GBM': 'ASODUR-GBM', 'SG3': 'ASODUR-SG3', 'B351': 'ASODUR-B351', 'V360': 'ASODUR-V360W', 'V2370': 'ASODUR-V2370', 'IPU': 'INDUFLEX-PU', 'P4': 'AQUAFIN-P4', 'P1': 'AQUAFIN-P1',
     'IH': 'ASODUR-IH', 'BIS540': 'ASOCRET-BIS-5/40', 'BIS16': 'ASOCRET-BIS-1/6', 'HSF': 'ASOCRET-HS-FLEX', 'IM': 'ASOCRET-IM', 'AQ1K': 'AQUAFIN-1K', 'AQ2K': 'AQUAFIN-2K/M-PLUS',
     'RB400': 'AQUAFIN-RB400', 'OS': 'AQUAFIN-OS', 'IC': 'AQUAFIN-IC', 'F20': 'FIX-20-T', 'CL170': 'BETOCRETE-CL170-P', 'CP360': 'BETOCRETE-CP360-WP'}

research = []
for f in sorted((R / 'research').glob('*.json')):
    d = json.load(open(f, encoding='utf-8'))
    for e in d['entries']: e['_file'] = f.name; research.append(e)

out = copy.deepcopy(C)
report = []
for g, G in out.items():
    G['subtitle']['de'] = de_of('CMP.%s.subtitle' % g, G['subtitle']['en'])
    if G.get('note'): G['note']['de'] = de_of('CMP.%s.note' % g, G['note']['en'])
    for pi, P in enumerate(G['products']):
        slot = g + '/' + P['key']; base = 'CMP.%s.products[%d]' % (g, pi)
        P['type']['de'] = de_of(base + '.type', P['type']['en'])
        for j, pr in enumerate(P['params']):
            pr['label']['de'] = de_of(base + '.params[%d].label' % j, pr['label']['en'])
            pr['oursDe'] = OUD.get(base + '.params[%d].ours' % j, pr['ours'])
        for j, ch in enumerate(P.get('charts') or []):
            ch['title']['de'] = de_of(base + '.charts[%d].title' % j, ch['title']['en'])
            if ch.get('oursLabel'): ch['oursLabelDe'] = OUD.get(base + '.charts[%d].oursLabel' % j, ch['oursLabel'])
        if P.get('why'): P['why']['de'] = de_of(base + '.why', P['why']['en'])
        keys = [x['key'] for x in P['params']]
        # earlier entries: relabel, drop the superseded ones
        comps = []
        for c in P['competitors']:
            if any(slot == s and c['product'].startswith(p) and 'LIQUID' not in c['product'] for s, p in DROP_OLD): report.append('dropped old ' + slot + ' ' + c['product']); continue
            c['group'], c['brand'] = SYMBOLS[c['brand']]
            c['accessed'] = G.get('accessed'); c['market'] = c.get('market') or ''
            for ch in P.get('charts') or []:
                c.setdefault('chart', {})[ch['key']] = {'v': (ch.get('values') or {}).get(c['product']), 'label': (ch.get('labels') or {}).get(c['product'])}
            comps.append(c)
        listed, none_by = [], {}
        have = {(c['group'], c['brand']) for c in comps}
        for e in [e for e in research if e['slot'] == slot]:
            gg, bb = gb(e)
            if e.get('verification_only'): continue
            if e.get('none'): none_by.setdefault((gg, bb), e.get('reason', '')); continue
            if any(slot == s and e['product'].startswith(p) for s, p in SKIP_NEW) and not (slot == 'wp/AQ1K' and e['product'] == 'VANDEX BB 75 Z'):
                report.append('skipped ' + slot + ' ' + e['product']); continue
            if (gg, bb) in have: report.append('DUPLICATE brand ' + slot + ' ' + bb + ' ' + e['product']); continue
            vals = {k: e['values'].get(k) for k in keys}
            filled = sum(1 for v in vals.values() if v)
            c = {'group': gg, 'brand': bb, 'product': e['product'], 'type': e.get('type', ''), 'market': e.get('market', ''),
                 'source': {'url': e['source']['url'], 'version': e['source'].get('version', '')}, 'accessed': NOW, 'values': vals,
                 'chart': {k: {'v': (e.get('charts') or {}).get(k, {}).get('v'), 'label': (e.get('charts') or {}).get(k, {}).get('label')} for k in [ch['key'] for ch in P.get('charts') or []]}}
            nk = [k for s, p, ks in NOTES if s == slot and p in e['product'] for k in ks]
            if nk: c['note'] = {'en': '; '.join(NOTE_TXT[k][0] for k in nk), 'zh': '；'.join(NOTE_TXT[k][1] for k in nk), 'de': '; '.join(NOTE_TXT[k][2] for k in nk)}
            if filled < 4: listed.append(c); report.append('listed only (%d values) %s %s %s' % (filled, slot, bb, e['product']))
            else: comps.append(c)
            have.add((gg, bb))
        # existing entries with a known mismatch
        for c in comps:
            nk = [k for s, p, ks in NOTES if s == slot and p in c['product'] for k in ks]
            if nk and 'note' not in c: c['note'] = {'en': '; '.join(NOTE_TXT[k][0] for k in nk), 'zh': '；'.join(NOTE_TXT[k][1] for k in nk), 'de': '; '.join(NOTE_TXT[k][2] for k in nk)}
        rank = lambda c: (ORDER.index(c['group']), BRAND_ORDER.index(c['brand']) if c['brand'] in BRAND_ORDER else 99)
        comps.sort(key=rank); listed.sort(key=rank)
        names = [c['product'] for c in comps + listed]
        assert len(names) == len(set(names)), (slot, names)
        # the twelve: which have neither a product nor a listed product
        present = [(c['group'], c['brand']) for c in comps + listed]
        none = [k for k, t in TWELVE if not any(t(g2, b2) for g2, b2 in present)]
        # every 'none' must be backed by research (or by the earlier comparison)
        for k in none:
            backed = any(t(g2, b2) for (g2, b2) in none_by for kk, t in TWELVE if kk == k)
            if not backed: report.append('NOT RESEARCHED ' + slot + ' ' + k)
        P['competitors'] = comps; P['listed'] = listed; P['none'] = none
        # charts back into the per-chart maps (only products with a value are drawn)
        for ch in P.get('charts') or []:
            ch['values'] = {c['product']: c['chart'][ch['key']]['v'] for c in comps}
            ch['labels'] = {c['product']: c['chart'][ch['key']]['label'] for c in comps if c['chart'][ch['key']]['label']}
        for c in comps + listed: c.pop('chart', None)
json.dump(out, open(R / 'cmp_new.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(report))
# review views
V = R / 'view'; V.mkdir(exist_ok=True)
for g, G in out.items():
    for P in G['products']:
        slot = g + '/' + P['key']; L = ['SLOT ' + slot + ' ' + N[P['key']] + ' — ' + P['type']['en'], 'competitors %d, listed %d, none: %s' % (len(P['competitors']), len(P['listed']), ', '.join(P['none'])), '']
        for pr in P['params']:
            L.append('== ' + pr['key'] + ' | OURS: ' + pr['ours'])
            for c in P['competitors']: L.append('   ' + label(c['group'], c['brand'])[:34].ljust(34) + ' ' + c['product'][:30].ljust(30) + ' : ' + str(c['values'].get(pr['key']))[:170])
        for ch in P.get('charts') or []:
            L.append('## chart ' + ch['key'] + ' (' + ch['unit'] + ', ' + ch['better'] + ') OURS ' + str(ch['ours']) + ' :: ' + ', '.join('%s=%s' % (k[:22], v) for k, v in ch['values'].items() if v is not None))
        L.append(''); L.append('WHY:'); L += ['  - ' + w for w in (P.get('why') or {}).get('en', [])]
        L.append(''); L.append('LISTED: ' + '; '.join(c['brand'] + ' ' + c['product'] for c in P['listed']))
        (V / (slot.replace('/', '_') + '.txt')).write_text('\n'.join(L), encoding='utf-8')
print('slots', sum(len(G['products']) for G in out.values()), 'competitors', sum(len(P['competitors']) for G in out.values() for P in G['products']), 'listed', sum(len(P['listed']) for G in out.values() for P in G['products']))

# ---------- the revised claims, subtitles and notes (en / zh / de) ----------
W = json.load(open(R / 'why_new.json', encoding='utf-8'))
for slot, d in W.items():
    g, k = slot.split('/'); P = [p for p in out[g]['products'] if p['key'] == k][0]
    for i, t in d.items():
        for l in ('en', 'zh', 'de'): P['why'][l][int(i)] = t[l]
SUB = {
 'pf': ('ASODUR / INDUFLEX protective flooring and coating systems against the corresponding products of the leading international manufacturers', 'ASODUR／INDUFLEX 地坪保護與塗裝系統與國際主要製造商同類產品之比較', 'ASODUR / INDUFLEX Bodenschutz- und Beschichtungssysteme im Vergleich mit den entsprechenden Produkten der führenden internationalen Hersteller'),
 'inj': ('AQUAFIN-P4, AQUAFIN-P1 and ASODUR-IH against the corresponding injection resins of the leading international manufacturers', 'AQUAFIN-P4、AQUAFIN-P1 與 ASODUR-IH 與國際主要製造商同類灌注樹脂之比較', 'AQUAFIN-P4, AQUAFIN-P1 und ASODUR-IH im Vergleich mit den entsprechenden Injektionsharzen der führenden internationalen Hersteller'),
 'cr': ('The ASOCRET restoration system against the corresponding products of the leading international manufacturers', 'ASOCRET 混凝土修復系統與國際主要製造商同類產品之比較', 'Das ASOCRET-Instandsetzungssystem im Vergleich mit den entsprechenden Produkten der führenden internationalen Hersteller'),
 'wp': ('The AQUAFIN mineral waterproofing products against the corresponding products of the leading international manufacturers', 'AQUAFIN 水泥基防水產品與國際主要製造商同類產品之比較', 'Die mineralischen AQUAFIN-Abdichtungsprodukte im Vergleich mit den entsprechenden Produkten der führenden internationalen Hersteller'),
 'rc': ('AQUAFIN-IC, ASOCRET-IM and FIX-20-T against the corresponding crystalline and plugging products of the leading international manufacturers', 'AQUAFIN-IC、ASOCRET-IM 與 FIX-20-T 與國際主要製造商同類結晶型及堵漏產品之比較', 'AQUAFIN-IC, ASOCRET-IM und FIX-20-T im Vergleich mit den entsprechenden kristallinen und Stopfprodukten der führenden internationalen Hersteller'),
 'ca': ('BETOCRETE crystalline admixtures against the corresponding admixtures of the leading international manufacturers', 'BETOCRETE 結晶型摻合劑與國際主要製造商同類摻合劑之比較', 'Kristalline BETOCRETE-Zusatzmittel im Vergleich mit den entsprechenden Zusatzmitteln der führenden internationalen Hersteller')}
for g, (en, zh, de) in SUB.items(): out[g]['subtitle'] = {'en': en, 'zh': zh, 'de': de}
out['rc'].pop('note', None)
out['ca']['note'] = {'en': 'BETOCRETE-CL210-WP and BETOCRETE-CP350-CI (with corrosion inhibitor) are not part of this comparison.', 'zh': 'BETOCRETE-CL210-WP 與 BETOCRETE-CP350-CI（含防鏽劑）不在本比較範圍內。', 'de': 'BETOCRETE-CL210-WP und BETOCRETE-CP350-CI (mit Korrosionsinhibitor) sind nicht Teil dieses Vergleichs.'}
for g in out: out[g]['accessed'] = '2026-10-15'  # date of the earlier entries; every new entry carries its own date
for ch in [p for p in out['inj']['products'] if p['key'] == 'P4'][0]['charts']:
    if ch['key'] == 'hardness': ch['better'] = 'none'  # a soft-elastic seal: hardness is a property, not a ranking
# ---------- display hygiene: Traditional Chinese characters (Taiwan readers, and glyphs the embedded Noto Sans TC has), no doubled access dates ----------
import opencc
S2T = opencc.OpenCC('s2t'); JP = {'鉄': '鐵', '処': '處', '剤': '劑', '断': '斷'}
def tidy(o):
    if isinstance(o, str):
        if re.search(r'[\u3040-\u30ff]', o): return ''.join(JP.get(ch, ch) for ch in o)  # Japanese: only the kanji the font lacks
        if re.search(r'[\u4e00-\u9fff]', o): return S2T.convert(o)
        return o
    if isinstance(o, list): return [tidy(x) for x in o]
    if isinstance(o, dict): return {k: tidy(v) for k, v in o.items()}
    return o
for g in out:
    for P in out[g]['products']:
        for lst in ('competitors', 'listed'):
            P[lst] = [tidy(c) for c in P[lst]]
            for c in P[lst]:
                v = re.sub(r'[;,]?\s*accessed \d{4}-\d{2}-\d{2}', '', c['source'].get('version') or '').strip(' ,;')
                c['source']['version'] = v
        # the chart maps are keyed by product name: rebuild after tidy
        for ch in P.get('charts') or []:
            ch['values'] = {tidy(k): v for k, v in ch['values'].items()}; ch['labels'] = {tidy(k): v for k, v in ch['labels'].items()}
json.dump(out, open(R / 'cmp_new.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# sanity: every text object has en / zh / de
bad = []
def walk(o, p):
    if isinstance(o, dict):
        if 'en' in o and 'zh' in o and 'de' not in o: bad.append(p)
        for k, v in o.items(): walk(v, p + '.' + k)
    elif isinstance(o, list):
        for i, v in enumerate(o): walk(v, p + '[%d]' % i)
walk(out, 'CMP'); print('text objects without de:', len(bad), bad[:5])
