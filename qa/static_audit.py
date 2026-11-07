import re, pathlib, sys, collections
R = pathlib.Path(__file__).resolve().parents[1]
files = [p for p in (list((R/'src').rglob('*')) + [R/'build.py'] + list((R/'ktest').glob('*.html')) + list((R/'i18n').rglob('*'))) if p.is_file() and p.suffix in ('.js','.css','.html','.py','.json','.txt','.md')]
dist = (R/'dist'/'aquafin-p4-injection-guide.html').read_text(encoding='utf-8')
art = (R/'dist'/'aquafin-p4-guide.artifact.html').read_text(encoding='utf-8')
print('files', len(files))
# 1. secrets / PII
pats = {
 'anthropic key': r'sk-ant-[A-Za-z0-9_-]{10,}', 'generic key': r'(?i)(api[_-]?key|secret|token|passw(or)?d)\s*[:=]\s*[\'"][^\'"]{8,}',
 'bearer': r'(?i)bearer\s+[a-z0-9._-]{16,}', 'aws': r'AKIA[0-9A-Z]{16}', 'private key': r'-----BEGIN [A-Z ]*PRIVATE KEY',
 'email': r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', 'claude url': r'claude\.ai/[A-Za-z0-9/_-]+', 'ip': r'\b(?:\d{1,3}\.){3}\d{1,3}\b', 'phone': r'\+?\d{2,3}[ -]?\d{3,4}[ -]?\d{3,4}\b',
 'sandbox path': r'/home/[a-z]+/|/tmp/|/mnt/user-data', 'localhost': r'127\.0\.0\.1|localhost',
}
for name, text in (('STANDALONE', dist), ('ARTIFACT', art)):
    print('==', name)
    for k, pat in pats.items():
        hits = collections.Counter(m.group(0) for m in re.finditer(pat, text))
        if hits: print(' ', k, dict(list(hits.items())[:8]))
        if hits and k in ('anthropic key', 'generic key', 'bearer', 'aws', 'private key', 'sandbox path', 'claude url'): fail += 1
fail = 0
print('== SOURCES')
for p in files:
    t = p.read_text(encoding='utf-8', errors='replace')
    for k, pat in pats.items():
        if k in ('email','ip','phone','localhost','claude url','sandbox path'): continue
        for m in re.finditer(pat, t): print('  !!', p.relative_to(R), k, m.group(0)[:60]); fail += 1
# 2. leftover debug / TODO
for p in files:
    if p.suffix not in ('.js','.html','.css'): continue
    t = p.read_text(encoding='utf-8', errors='replace')
    n = len(re.findall(r'console\.(log|debug|table|trace)\(', t)); d = len(re.findall(r'\bdebugger\b', t)); td = len(re.findall(r'\b(TODO|FIXME|XXX|HACK)\b', t))
    if n or d or td: print('  debug', p.relative_to(R), 'console', n, 'debugger', d, 'todo', td); fail += n + d + td
# 3. forbidden names (constraints) in the delivered pages
forb = ['Touchstone','Porsche','Porsche 993','Triumph','Bonneville','FromSoftware','From Software','Bandai','Namco','Dark Souls','Elden','Sekiro','Bloodborne','Cyberpunk','Cyberpunk 2077','Night City','Ghost in the Shell','Kusanagi','Section 9','Evangelion','EVA-01','NERV','Grand Theft Auto','GTA','Rockstar','Doctor Strange','Marvel','Indiana Jones','Indy','Lucasfilm','Hitler','Nazi','Waffen-SS','Wehrmacht','Swastika','Hakenkreuz','V-2','V2 rocket','Stalingrad','Normandy','Liberty Valance','Libertango','Piazzolla','Quizás','Mi mancherai','Autumn Leaves','Por una cabeza','Gardel','Maersk','Hapag','MSC','Evergreen','CMA CGM','COSCO','Richter','Gerhard','Hyperion','Mandalorian','Star Wars','Zelda','Mario','Pokémon','Pokemon','Nintendo','Disney','Pixar']
low = dist; bad = 0
for w in forb:
    c = len(re.findall(r'(?<![A-Za-z0-9])' + re.escape(w.strip()) + r'(?![A-Za-z0-9])', low))
    if c: print('  FORBIDDEN?', repr(w), c); bad += c
# 4. i18n parity for the site dictionaries (app.js I18N, hsim L/T, de.js)
print('== SIZES', len(dist), len(art))
if bad or fail: print('STATIC AUDIT: FAIL'); sys.exit(1)
print('STATIC AUDIT: OK')
