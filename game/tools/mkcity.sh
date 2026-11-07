#!/bin/bash
# Assemble src/koeln/koeln3d.js (the Köln city) from the city parts, in order.
ROOT="${SG_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT/src/koeln/city" && cat k3d_a.js k3d_nat.js k3d_dom.js k3d_hbf.js k3d_bridge.js k3d_e.js k3d_f.js k3d_h.js k3d_b.js k3d_c.js k3d_g.js > ../koeln3d.js && node --check ../koeln3d.js && echo CITY_OK
