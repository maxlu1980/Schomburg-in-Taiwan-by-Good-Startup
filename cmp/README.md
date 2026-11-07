# Product comparison data

The "Comparison against competitive products" documents of the guides compare 22 SCHOMBURG products (slots) with the
corresponding products of twelve manufacturer groups, parameter by parameter.

* `brief.md` — the slots: the SCHOMBURG product, what it is, and the parameter keys every competitor entry fills.
* `research/*.json` — one file per manufacturer group: per slot the competitor product, the values exactly as the
  manufacturer publishes them in its own technical data sheet, and the source URL of each value. A group without a
  corresponding product is recorded with the reason.
* `merge.py` — merges the research into `cmp_new.json` (one product per brand and slot; entries with fewer than four
  published values go to a "listed" line; the German texts come from the i18n chunks) and writes a review view per slot
  to `view/`.
* `embed.py` — writes `cmp_new.json` into `src/app.js` as the `CMP` data line.

Every value is a published value with its source; nothing is estimated. Group membership is as of October 2026.
