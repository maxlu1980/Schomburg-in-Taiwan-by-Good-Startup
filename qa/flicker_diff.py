#!/usr/bin/env python3
"""The floor-flicker metric (V85): for each view rendered by qa/flicker.js (three renders, the camera moved 0, 1 and 2 mm sideways), the share of
pixels that change by more than 40 (of 255, any channel) between the renders. A surface fighting another for the same depth flips between them
under such a tiny move; a stable picture changes only at a few edges.  python3 qa/flicker_diff.py OUT.json [OUT2.json …]"""
import json, sys
import numpy as np
from PIL import Image
for fn in sys.argv[1:]:
    d = json.load(open(fn)); print('==', d.get('tag'), fn)
    for v in d['views']:
        a, b, c = [np.asarray(Image.open(f).convert('RGB')).astype(np.int16) for f in v['files']]
        h = a.shape[0]; lo = slice(h // 3, h)  # (the lower two thirds: the floors)
        def share(x, y): return float(np.mean(np.max(np.abs(x[lo] - y[lo]), axis=2) > 40))
        print('  %-14s flicker %.3f %% / %.3f %%' % (v['name'], 100 * share(a, b), 100 * share(b, c)))
