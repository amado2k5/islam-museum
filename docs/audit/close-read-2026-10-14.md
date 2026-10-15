# Close-read Sunni-compliance audit, 2026-10-14

Scope: every Arabic prose page in `content/ar/` on `origin/main` for the classes place, group, event, journey, concept, polity, period, work, source and exhibit (459 pages at the time of the final listing). Each page's prose was read paragraph by paragraph and checked for (a) doctrinal, sectarian or moral judgements in the museum's own voice without attribution, (b) insulting or sectarian terms without attribution, (c) at least one `{cite:key}` whose key exists in `data/source/`, and (d) honorifics (ﷺ, رضي الله عنه, عليه السلام). Fixes are minimal wording changes that attribute a judgement to a named source or tradition already on the page. No claims or citations were added, no status fields were changed, and `status.review: draft` is unchanged everywhere.

Pages are committed in 19 batches of at most 25 pages. This document grows by one batch per push; the batch number is in each section heading.

## Results across all batches

- Pages checked: 459 (place 57, group 64, event 214, journey 32, concept 46, polity 8, period 13, work 11, source 9, exhibit 5).
- Pages with a fix: 19 (21 edits).
- Honorifics (criterion d): none found in prose. One automated hit was a false positive (`يرضي الله` contains the substring `رضي الله`).
- Missing citation keys (criterion c): none. Pages with no cite marker at all: 5, listed below.
- Pages added to origin/main by other sessions during this audit (read in this pass, no fix needed): 6 event pages, listed in the batch that contains them. Five place pages (al-akhdar, al-jurf, maysan, thaniyyat-al-wada, wadi-al-mushaqqaq) gained citations from another session during the audit and are no longer in the no-citation list.

## Changes

| Page | Before | After | Reason |
|---|---|---|---|

## Pages needing citations (not added here)


## Batch 2 of 19

Pages place/dumat-al-jandal.md to place/taif.md (25 pages).

| Page | Result |
|---|---|
| `place/dumat-al-jandal.md` | ok |
| `place/ghar-hira.md` | ok |
| `place/ghar-thawr.md` | ok |
| `place/hamadan.md` | ok |
| `place/iraq.md` | ok |
| `place/isfahan.md` | ok |
| `place/istanbul.md` | ok |
| `place/jerusalem.md` | ok |
| `place/khaybar.md` | ok |
| `place/kufa.md` | ok |
| `place/maan.md` | ok |
| `place/marib.md` | ok |
| `place/marr-al-zahran.md` | ok |
| `place/maysan.md` | ok |
| `place/mecca.md` | ok |
| `place/medina.md` | ok |
| `place/mount-sal.md` | ok |
| `place/mutah.md` | ok |
| `place/najran.md` | ok |
| `place/petra.md` | ok |
| `place/quba.md` | ok |
| `place/qudayd.md` | ok |
| `place/sanaa.md` | ok |
| `place/tabuk.md` | ok |
| `place/taif.md` | ok |

