# Changelog

Versions are the published builds of the page (`V<n>`); the package version follows them (84.0.0 = V84).

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
