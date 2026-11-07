#!/usr/bin/env python3
"""Write cmp/cmp_new.json into src/app.js as the CMP data line."""
import json, pathlib
R = pathlib.Path(__file__).parent; p = R.parent / 'src' / 'app.js'
s = p.read_text(encoding='utf-8'); C = json.load(open(R / 'cmp_new.json', encoding='utf-8'))
i = s.index('\nvar CMP = '); j = s.index('\n', i + 1)
p.write_text(s[:i] + '\nvar CMP = ' + json.dumps(C, ensure_ascii=False, separators=(',', ':')) + ';' + s[j:], encoding='utf-8')
print('CMP embedded', len(json.dumps(C, ensure_ascii=False)))
