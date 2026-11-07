# SCHOMBURG application guides — build and checks
# The page is assembled by build.py; the generated sources it reads are committed (src/de.js, src/koeln/isle.css, src/koeln/koeln3d.js,
# src/koeln/kisle.js). `make all` regenerates the ones whose inputs are in the repository, then builds. The game's kisle.js is assembled by
# game/tools/port.py from the reference engine parts (game/ref, not in the repository) — see README.
.PHONY: all build de css city check test serve clean

all: de css city build

build:            ## dist/index.html, dist/aquafin-p4-guide.artifact.html, dist/aquafin-p4-injection-guide.html
	python3 build.py

de:               ## src/de.js from i18n/en.json + i18n/de/*.json (strict: every string present, placeholders and tags kept)
	python3 i18n/assemble.py --strict

css:              ## src/koeln/isle.css from game/css/isle_raw.css + src/koeln/isle/k_style.css + k_cis.css (SCHOMBURG CIS)
	python3 game/tools/mkcss.py

city:             ## src/koeln/koeln3d.js from src/koeln/city/*.js
	bash game/tools/mkcity.sh

check:            ## static checks: every script parses as ES5, no duplicate top-level names, no secrets / sandbox paths / stale names
	node qa/parse_all.js
	node qa/dup.js
	python3 game/tools/namecheck.py
	python3 qa/static_audit.py

test: build       ## smoke test: every route × en/zh/de × light/night loads without a page error (needs `npm run serve` in another shell)
	node qa/regress.js

serve:            ## local server for the QA harness (http://127.0.0.1:8765/dist/index.html)
	python3 -m http.server 8765 --bind 127.0.0.1

clean:
	rm -rf dist shots
