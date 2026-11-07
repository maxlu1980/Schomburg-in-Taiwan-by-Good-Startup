#!/usr/bin/env python3
"""Split the page's English dictionaries (i18n/en.json, dumped from the running page) into translation chunks.
   Every string leaf gets a pointer 'PATH|/json/pointer'; chunks hold ~LIMIT characters of English each → i18n/chunks/cNNN.json
   The German goes to i18n/de/cNNN.json with the same keys; assemble.py validates and builds src/de.js."""
import json, pathlib, sys
R = pathlib.Path(__file__).parent
EN = json.load(open(R / 'en.json', encoding='utf-8'))
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 14000
SKIP_PREFIX = ()  # nothing skipped: product names and units inside are kept by the translator

def leaves(v, ptr, out):
    if isinstance(v, str): out.append((ptr, v))
    elif isinstance(v, list):
        for i, x in enumerate(v): leaves(x, ptr + '/' + str(i), out)
    elif isinstance(v, dict):
        for k, x in v.items(): leaves(x, ptr + '/' + k.replace('~', '~0').replace('/', '~1'), out)

allv = []
for path in EN:  # the order of the dump: roots in definition order
    L = []; leaves(EN[path], '', L)
    for ptr, s in L: allv.append((path + '|' + ptr, s))
chunks, cur, size = [], {}, 0
for key, s in allv:
    if size + len(s) > LIMIT and cur: chunks.append(cur); cur, size = {}, 0
    cur[key] = s; size += len(s)
if cur: chunks.append(cur)
D = R / 'chunks'; D.mkdir(exist_ok=True)
for f in D.glob('c*.json'): f.unlink()
man = []
for i, c in enumerate(chunks, 1):
    name = 'c%03d.json' % i; json.dump(c, open(D / name, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    man.append({'file': name, 'strings': len(c), 'chars': sum(len(v) for v in c.values()), 'first': next(iter(c))})
json.dump(man, open(R / 'manifest.json', 'w', encoding='utf-8'), indent=1)
print('strings', len(allv), 'chars', sum(len(s) for _, s in allv), 'chunks', len(chunks))
for m in man: print(m['file'], str(m['strings']).rjust(5), str(m['chars']).rjust(7), m['first'][:70])
