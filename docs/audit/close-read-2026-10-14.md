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
| `group/banu-al-dil.md` | فكان خطؤهم بداية نهاية الحرب كلها | فكان فعلهم بداية نهاية الحرب كلها | moral label in the children's section; describes the act |

## Pages needing citations (not added here)


## Batch 3 of 19

Pages place/thaniyyat-al-wada.md to group/banu-dubaya-ibn-zayd.md (25 pages).

| Page | Result |
|---|---|
| `place/thaniyyat-al-wada.md` | ok |
| `place/uhud.md` | ok |
| `place/ukaz.md` | ok |
| `place/wadi-al-mushaqqaq.md` | ok |
| `place/wadi-hunayn.md` | ok |
| `place/wadi-nakhla.md` | ok |
| `place/yemen.md` | ok |
| `group/adnan.md` | ok |
| `group/ahl-al-bayt.md` | ok |
| `group/al-arab-al-baida.md` | ok |
| `group/al-azd.md` | ok |
| `group/ansar.md` | ok |
| `group/aslam.md` | ok |
| `group/banu-abd-dar.md` | ok |
| `group/banu-abd-shams.md` | ok |
| `group/banu-adi.md` | ok |
| `group/banu-al-ajlan.md` | ok |
| `group/banu-al-dil.md` | fixed (1) |
| `group/banu-al-harith.md` | ok |
| `group/banu-amir.md` | ok |
| `group/banu-amr-ibn-awf.md` | ok |
| `group/banu-asad-ibn-khuzayma.md` | ok |
| `group/banu-asad.md` | ok |
| `group/banu-bakr.md` | ok |
| `group/banu-dubaya-ibn-zayd.md` | ok |

