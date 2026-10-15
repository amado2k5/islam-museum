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
| `group/banu-hashim.md` | صار لاحقًا اسم الحقّ الذي قامت عليه دول هاشمية وعلوية وفاطمية | صار لاحقًا اسمًا ترفع به دول هاشمية وعلوية وفاطمية دعوى الشرعية | museum voice presented a claim as the truth; reframed as the dynasties' claim |
| `group/banu-shayban.md` | لأن سيدها حفظ الأمانة | وتذكر الرواية أن سيدها حفظ أمانة النعمان | causal moral explanation in museum voice; attributed to the narrative |

## Pages needing citations (not added here)


## Batch 4 of 19

Pages group/banu-ghifar.md to group/early-muslims.md (25 pages).

| Page | Result |
|---|---|
| `group/banu-ghifar.md` | ok |
| `group/banu-hamdan.md` | ok |
| `group/banu-hashim.md` | fixed (1) |
| `group/banu-jumah.md` | ok |
| `group/banu-jusham.md` | ok |
| `group/banu-lakhm.md` | ok |
| `group/banu-makhzum.md` | ok |
| `group/banu-nadir.md` | ok |
| `group/banu-nasr.md` | ok |
| `group/banu-qaynuqa.md` | ok |
| `group/banu-qurayza.md` | ok |
| `group/banu-sahm.md` | ok |
| `group/banu-salim-ibn-awf.md` | ok |
| `group/banu-salima.md` | ok |
| `group/banu-shayban.md` | fixed (1) |
| `group/banu-tahm.md` | ok |
| `group/banu-tamim.md` | ok |
| `group/banu-ubayd-ibn-zayd.md` | ok |
| `group/banu-umayya-ibn-zayd.md` | ok |
| `group/banu-umayya.md` | ok |
| `group/banu-waqif.md` | ok |
| `group/banu-zubayd.md` | ok |
| `group/banu-zuhra.md` | ok |
| `group/builders-of-masjid-al-dirar.md` | ok |
| `group/early-muslims.md` | ok |

