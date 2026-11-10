# Changelog

Versions are the published builds of the page (`V<n>`); the package version follows them (84.0.0 = V84).

## V86 — "System developed by Good Startup" on the game's interfaces
- One small line — 系統由好時新創 Good Startup 開發 / System developed by Good Startup / System entwickelt von Good Startup — in the page's language on: the title card; the loading screen and the veil of every screen transition; the opening film's closing title; the footer of the panels opened from the HUD (menu, map, navigation, pocket door, phone, bag, handbook, gear, graphics, help, the way back to the guides); the result cards (a duel won or lost, a ride's end) and the simulators' result cards. Nothing is drawn over the 3D picture while playing, and prompts in play (a stall, a gate, a quiz, a question) carry none.
- `src/koeln/isle/k_dev.js` (the game's part), `src/body.html` + `k_load.js` (loading screen), `src/app.js` / `src/hsim.js` (simulator results); styles in `k_cis.css` and `style.css`. Checks: `qa/scenarios/credit.json`, `qa/credit.js` (`npm run test:credit`).

## V85 — steady floors, the camera between levels, the opening score played by a sampled orchestra
- **Floor flicker fixed everywhere**: a coplanar audit (`qa/coplanar.js`) found the pavement lying a few millimetres under the setts, the plazas, the lawns and the tree pits, and at exactly the height of the station's passages and entrance hall (the pavement's slabs broke through the station's tiles in saw-teeth). The ground's layers are now drawn in a fixed order of depth (polygon offset per layer, in depth-buffer steps, so it holds at any distance and angle); the station's floors sit 2 cm over the street; the station's and the viaducts' ballast no longer overlap; the board tiles' icons lie clear of their discs. `qa/flicker.js` + `qa/flicker_diff.py` measure it (pixels that change when the camera moves 1 mm).
- **No more view blocked between the passages and the platforms**: the stairs' wells were closed by an up-facing sheet at the ceiling's height, the track bed and the platforms' concrete bodies; the camera was held under the deck behind a climbing walker (the arm closed onto her back, the view went into the slab). The wells are open now, the camera may pass through them and rises and sinks with her (the higher angles first on a climb), the flights are solid to it, and passers-by or the dog who come between the camera and Mira step out of the picture. `qa/scenarios/stairs_up.json` / `stairs_down.json`.
- **The opening film's music played by a sampled orchestra** (`game/tools/mkscore85.py` → `src/koeln/score85.js`): the same arrangement plan and clock as V81, written for the sections (first and second violins, violas, cellos and basses with legato, short, pizzicato and tremolo articulations; flutes, oboes, clarinets, bassoons; horns, trumpets, trombones, tuba; timpani, harp, glockenspiel, concert bass drum and cymbals), shaped by bow/breath dynamics, rendered with FluidSynth and the MuseScore General soundfont (VSCO 2 CE string sections, CC0; MIT), mixed in a synthesised concert hall and mastered to −16 LUFS (MP3, 0.9 MB). The synthesised score of V81 remains as the fallback.
- **Bookmark name**: on the published site (GitHub Pages) and in the standalone file the page is called "Schomburg in Taiwan by Good Startup" in tabs and bookmarks (`application-name`; the hosted artifact keeps its per-guide titles).
- CI runs on `ubuntu-24.04` (Playwright 1.56 does not support Ubuntu 26.04, the new `ubuntu-latest`).

## V84 — release engineering
- Published on GitHub as **Schomburg in Taiwan by Good Startup** (https://github.com/maxlu1980/Schomburg-in-Taiwan-by-Good-Startup), deployed to GitHub Pages (https://maxlu1980.github.io/Schomburg-in-Taiwan-by-Good-Startup/).
- Repository layout, bilingual README, MIT licence for the code, NOTICE for trademarks / product data / fonts / libraries, CHANGELOG.
- `build.py` writes `dist/index.html` (fonts and libraries as files, for a web server or GitHub Pages) besides the hosted-artifact and standalone flavours; `test.html` is the same page.
- GitHub Actions: CI (static checks, i18n round-trip, build, smoke test, accessibility) and a Pages deployment.
- Tooling made repository-relative (`game/tools/*`, `game/tts/make_vox.py`, the QA harness in `qa/`); `npm run check|test|test:*` scripts.
- i18n round-trip: the committed `src/de.js` equals the one generated from `i18n/` (the V82 string `HSIM_T.edge` added to the sources).
- Accessibility: each guide's `<main>` landmark named by its own title; the hero image has a `src` before the photo loads; the unused serif web fonts (Cormorant Garamond, Noto Serif TC) dropped from the font link.
- Accessibility of the guides and the game checked with axe-core (WCAG 2.1 AA + best practice) in every language, theme and viewport: muted text darkened to pass on grey panels (`--ink-muted`), red text through a `--red-ink` token that lightens in the night theme, numbered marks and the theme button carry their visible text in their names, breadcrumb as a named `<nav>`, blank table corners as plain cells, heading levels in the LCC form and the document preview, decorative drawings hidden, icon buttons named at build time, sideways-scrolling tables focusable, the simulator canvas named; the util bar's game button got its red background back (its CSS variables now live on `:root`).
- Simulators: a crew wholly behind the viewer, or a work zone without a tool in hand, is still the target of the aimed look, and a hand held down beside a ring that left the screen no longer pins the view (the flooring simulator could stall at the crew phases).
- Full re-verification (see the README's quality checks).

## V83 — SCHOMBURG CIS for the operating interfaces
- Game HUD, cards, menus, navigation, duel and touch controls, opening-film buttons and the loading screen restyled to the SCHOMBURG corporate design (one red, black hairlines, white/grey grounds, square corners, Jost Bold/Book/Light, blue for focus and progress, navy/ice inverse ground).
- Simulator HUD, tool bar, mixing/quiz panel, briefing and result cards restyled the same way, with a night-theme variant (red text lightened to keep 4.5:1).
- Fixes: the desktop place chip stayed visible; the mixing panel kept the glass white (an opaque layer over WebGL lost the canvas beneath it); the pot-life bar clipped.

## V82 — pre-release QA
- Painting from the framed view: the view steps back to see the floor band, follows the brush at the edge, frames the whole coat; coverage counted as drawn.
- Phones in portrait: the simulator's tool bar in two rows with names; touch targets ≥ 32 px in the util bar.
- Taiwan terminology pass in the Chinese (組份, 自平, 聚胺酯, 可覆塗時段, 止漏 …).
- All five simulators finish every phase in the harness; six routes × three languages × two themes without page errors.

## V81 — the opening scored with "An der schönen blauen Donau" (op. 314)
- Own arrangement of the public-domain waltz (gentle strain, then broad), synthesised in the browser; harp, flute and glockenspiel added to the instrument set; the film's title rises on the cadence.

## V80 — La Cumparsita opening (replaced in V81), frame-rate-independent controls, bodies out of the walls, 30-fps guard for manual presets

## V79 — film sound fixed, film ground flicker, tree pits, graphics settings (auto-detect + individual items)

## V78 — nature materials (grass, trees, concrete, stone, soil) and the cinematic score

## V77 — the opening scored (Ode to Joy; replaced later)

## V76 — Mira's holds by human factors (umbrella and tool poses)

## V75 — every NPC drawn to charm; the opening film (map and flight into Köln)

## V74 — one logo on the title; the station's walkers keep to the floor

## V73 — dry interiors, no floor flicker, live Köln weather (AccuWeather in the hosted flavour)

## V72 — people react only to an attack they perceive

## V71 — the crowd and Mira's tools

## V70 — Mira more charming

## V69 — sky, mirrors, Rhine, tide line, the rift door, the loading screen

## V68 — the cathedral, the station, the bridge and the Rhine as real as they get; a camera that frames them

## V67 — the police without the stall, the cathedral from inside, floors that bear her

## V66 — the salute as her stance, smoother special attacks, a live FPS readout

## V65 — a high ponytail, her voice on every device, weather-free indoors, model fixes

## V64 — period tools, three summoned machines

## V63 — Mira in an officer's uniform, a German shepherd, the character at full detail

## V62 — German Mira, German voice, smooth shapes, logo colours

## V61 — SCHOMBURG · KÖLN: the game moved into one city
- The six guides on practice sites in a true-scale downtown Köln (Dom, Hohenzollernbrücke, Hauptbahnhof, Rhine); stamps, quizzes, simulators, the six guides and the bosses in one page.

## V58–V60 — the game that opens the system (first version, superseded by Köln)

## V57 — all main players in the comparison documents (twelve manufacturer groups, values with sources)

## V56 — documents in German; company / customer / project in every document; documents as a main function

## V55 — sound in the simulators

## V54 — the aiming ring

## V53 — first person in the simulators

## V52 — enter the scene

## V51 — every screen (responsive and touch pass for the simulators)

## V50 — hands-on: five simulators (mineral waterproofing, crystalline waterproofing, concrete restoration, protective flooring, crystalline admixture)

## V49 — crews that move like people; application technique surveyed from the data sheets

## V48 — posture of the crews; the distributor's name in the header and footer

## V47 — crews without interference; Word and PDF downloads; document layout
