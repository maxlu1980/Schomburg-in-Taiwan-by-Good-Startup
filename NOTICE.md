# Notices

## Trademarks and product data

**SCHOMBURG**, the SCHOMBURG logo and the product names used throughout the guides
(AQUAFIN, ASOCRET, ASODUR, BETOCRETE, COMBIFLEX, FIX, INDU, RB400 and others) are
trademarks of SCHOMBURG GmbH & Co. KG, Detmold, Germany. They are used here by
**Good Startup LTD. (好時新創有限公司)**, an authorised SCHOMBURG distributor for Taiwan,
to describe SCHOMBURG products. The product data in the guides (consumption, mixing
ratios, pot life, curing times, test values, approvals) follows the SCHOMBURG technical
data sheets current at the time of writing; the technical data sheet of a product is the
only binding source and must be checked before any application.

The comparison documents name competing products and reproduce published figures from
their manufacturers' public technical data sheets, for comparison purposes only. Those
names are trademarks of their respective owners. The values are quoted with their sources
in the data (`cmp/`).

The **Good Startup** name and the "Good Startup" brand belong to Good Startup LTD.

Nothing in this repository is a SCHOMBURG publication. For official documents use
<https://www.schomburg.com>.

## The Köln training game

The city of Köln (Cologne) is modelled from public sources on the Kölner Dom, the
Hohenzollernbrücke, Köln Hauptbahnhof and their surroundings; place names are used as
place names. All characters, models, textures, voices, music arrangements and sounds are
original work generated for this project. The opening film's music is an original
arrangement of *An der schönen blauen Donau*, op. 314 (Johann Strauss II, 1867, public
domain), played by a sampled orchestra and recorded offline by `game/tools/mkscore85.py` (FluidSynth with the MuseScore
General soundfont; the recording is embedded as MP3 in `src/koeln/score85.js`; the earlier in-browser synthesis remains the
fallback). Mira's German voice lines were synthesised offline
with the Supertonic text-to-speech model (Supertone Inc., OpenRAIL licence; run through
sherpa-onnx by `game/tts/make_vox.py`) and are embedded as MP3 clips in
`src/koeln/isle/k_vox.js`; the model itself is not part of the repository.

## Third-party software and fonts

| Component | Version | Licence | Where |
|---|---|---|---|
| three.js | 0.147.0 | MIT — © 2010-2022 three.js authors | loaded from jsDelivr by the hosted and standalone flavours; copied to `dist/lib/` for `index.html` |
| pdfmake | 0.3.11 | MIT — © bpampuch | same |
| docx | 9.11.0 | MIT — © Dolan Miu | same |
| Jost | 3.710 | SIL Open Font License 1.1 — © 2020 The Jost Project Authors (indestructible-type) | subset in `fonts/jost-400.ttf`, `fonts/jost-700.ttf` |
| Noto Sans TC | 2.004 | SIL Open Font License 1.1 — © 2014-2021 Adobe (with Reserved Font Name "Source") | subset in `fonts/noto-tc-400.ttf`, `fonts/noto-tc-700.ttf` |
| MuseScore General soundfont | 0.2.1 (Debian/Ubuntu package `musescore-general-soundfont`) | MIT — © 2018-2021 S. Christian Collins; ensemble strings from the Versilian Studios Chamber Orchestra 2 CE and cymbals from the Versilian Community Sample Library (CC0, Sam Gossner et al.); Fluid (R3) Mono GM (MIT, © 2014-2017 Michael Cowgill) and Fluid (R3) GM (MIT, © 2000-2002, 2008 Frank Wen) | used to render the opening score; only the rendered recording is shipped (`src/koeln/score85.js`), not the soundfont |
| Playwright, axe-core, html-validate, acorn | see `package.json` | Apache-2.0 / MPL-2.0 / MIT / MIT | development only (QA harness) |

The full text of the SIL Open Font License 1.1 is in `fonts/OFL-1.1.txt`. The font files
are subsets (the glyphs the page uses) of the original fonts and are distributed under the
same licence; they are not sold by themselves. The Google Fonts stylesheet linked in the
page head is a convenience for the hosted flavour; the page renders with the bundled
subsets when it is unavailable.

The visual language of the page (colours, type, spacing, components) follows the
SCHOMBURG corporate design as applied by Good Startup LTD.
