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
| `group/jahmiyya.md` | يزعم أصحاب هذا القول أن القرآن مخلوق | بحسب وصف الكتاب، يقول أصحاب هذا القول إن القرآن مخلوق | dismissive verb in museum voice; attributed to the cited book |
| `group/hawazin.md` | حارب الإسلام في حنين | حارب المسلمين في حنين | framed a religion as a party; factual wording |
| `group/hawazin.md` | ردّة حنين سنة 630م على بيعة الفتح | حرب حنين سنة 630م بعد بيعة الفتح | 'ردّة' (apostasy) asserted in museum voice |
| `group/thaqif.md` | فسلّموا على شروط التصنّع | فسلّموا بشروط خاصّة | imputed insincerity in museum voice; no source states it |
| `group/himyar.md` | ومنهم الملك الظالم الذي أحرق أهل نجران | ومنهم الملك الذي تذكر الرواية أنه أحرق أهل نجران | moral label in the children's section; attributed to the tradition |
| `event/battle-of-uhud.md` | ## غلطة الرماة والانتكاسة | ## ترك الرماة مواقعهم والانتكاسة | evaluative heading ('mistake') in museum voice |
| `event/battle-of-uhud.md` | ## قبل المعركة: انسحاب المنافقين | ## قبل المعركة: انسحاب عبد الله بن أبي | heading labelled a named person with a faith category |
| `event/death-of-abdullah-ibn-ubayy.md` | مات رجل كان يقول أنه مسلم لكنه كان يضرّ بالمسلمين سراً | مات رجل كانت الرواية تصفه بأنه يقول إنه مسلم ويضرّ بالمسلمين سراً | faith and hidden harm inferred in the children's section (no citation there) |

## Pages needing citations (not added here)


## Batch 8 of 19

Pages event/delegation-of-abd-al-qays.md to event/expedition-of-dhu-al-ushayra.md (25 pages).

| Page | Result |
|---|---|
| `event/delegation-of-abd-al-qays.md` | ok |
| `event/delegation-of-banu-hanifa.md` | ok |
| `event/delegation-of-hamdan.md` | ok |
| `event/delegation-of-najran.md` | ok |
| `event/delegation-of-thaqif.md` | ok |
| `event/demolition-of-al-lat.md` | ok |
| `event/demolition-of-al-uzza-and-idols.md` | ok |
| `event/demolition-of-masjid-al-dirar.md` | ok |
| `event/deposition-abd-al-hamid-1327.md` | ok |
| `event/dispatch-of-sadaqa-collectors.md` | ok |
| `event/distribution-of-hunayn-spoils.md` | ok |
| `event/emigrants-carried-in-two-ships.md` | ok |
| `event/expedition-of-al-abwa-waddan.md` | ok |
| `event/expedition-of-al-kharrar.md` | ok |
| `event/expedition-of-al-kudr.md` | ok |
| `event/expedition-of-al-qarada.md` | ok |
| `event/expedition-of-al-sawiq.md` | ok |
| `event/expedition-of-badr-al-mawida.md` | ok |
| `event/expedition-of-banu-al-mustaliq.md` | ok |
| `event/expedition-of-banu-al-nadir.md` | ok |
| `event/expedition-of-buhran.md` | ok |
| `event/expedition-of-buwat.md` | ok |
| `event/expedition-of-dhat-al-riqa.md` | ok |
| `event/expedition-of-dhat-al-salasil.md` | ok |
| `event/expedition-of-dhu-al-ushayra.md` | ok |

