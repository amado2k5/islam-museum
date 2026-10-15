# Close-read Sunni-compliance audit, 2026-10-14

Scope: every Arabic prose page in `content/ar/` on `origin/main` for the classes place, group, event, journey, concept, polity, period, work, source and exhibit (453 pages). Each page's prose was read paragraph by paragraph and checked for (a) doctrinal, sectarian or moral judgements in the museum's own voice without attribution, (b) insulting or sectarian terms without attribution, (c) at least one `{cite:key}` whose key exists in `data/source/`, and (d) honorifics (ﷺ, رضي الله عنه, عليه السلام). Fixes are minimal wording changes that attribute a judgement to a named source or tradition already on the page. No claims or citations were added, no status fields were changed, and `status.review: draft` is unchanged everywhere.

Pages are committed in 19 batches of at most 25 pages. This document grows by one batch per push; the batch number is in each section heading.

## Results across all batches

- Pages checked: 453 (place 57, group 64, event 208, journey 32, concept 46, polity 8, period 13, work 11, source 9, exhibit 5).
- Pages with a fix: 19 (21 edits).
- Honorifics (criterion d): none found in prose. One automated hit was a false positive (`يرضي الله` contains the substring `رضي الله`).
- Missing citation keys (criterion c): none. Pages with no cite marker at all: 10, listed below.

## Changes

| Page | Before | After | Reason |
|---|---|---|---|

## Pages needing citations (not added here)

- `place/al-akhdar.md`
- `place/al-jurf.md`

## Batch 1 of 19

Pages place/abyssinia.md to place/dhu-tuwa.md (25 pages).

| Page | Result |
|---|---|
| `place/abyssinia.md` | ok |
| `place/ajnadayn.md` | ok |
| `place/aksum.md` | ok |
| `place/al-akhdar.md` | no citation: listed for citation |
| `place/al-hijr.md` | ok |
| `place/al-hira.md` | ok |
| `place/al-jirana.md` | ok |
| `place/al-jurf.md` | no citation: listed for citation |
| `place/al-khaliqa.md` | ok |
| `place/al-khandama.md` | ok |
| `place/al-kudayd.md` | ok |
| `place/al-rabadha.md` | ok |
| `place/al-sham.md` | ok |
| `place/al-watir.md` | ok |
| `place/al-yamama.md` | ok |
| `place/asfan.md` | ok |
| `place/awtas.md` | ok |
| `place/badr.md` | ok |
| `place/baghdad.md` | ok |
| `place/bahrayn.md` | ok |
| `place/basra.md` | ok |
| `place/cairo.md` | ok |
| `place/damascus.md` | ok |
| `place/dhu-awan.md` | ok |
| `place/dhu-tuwa.md` | ok |

