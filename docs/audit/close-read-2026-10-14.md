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

## Pages needing citations (not added here)


## Batch 6 of 19

Pages event/abu-quhafa-conversion.md to event/battle-of-the-trench.md (25 pages).

| Page | Result |
|---|---|
| `event/abu-quhafa-conversion.md` | ok |
| `event/abu-ruhm-and-the-stragglers-of-ghifar-and-aslam.md` | ok |
| `event/abu-sufyan-conversion.md` | ok |
| `event/abu-sufyan-medina-mission.md` | ok |
| `event/abu-talib-gathers-clans.md` | ok |
| `event/abyssinian-occupation-of-yemen.md` | ok |
| `event/address-to-the-ansar-at-jirana.md` | ok |
| `event/al-dawa-al-sirriyya.md` | ok |
| `event/al-jadd-ibn-qays-asks-to-stay-behind.md` | ok |
| `event/ali-expedition-to-al-fuls.md` | ok |
| `event/ali-left-with-the-prophets-family.md` | ok |
| `event/arab-congress-paris-1332.md` | ok |
| `event/assassination-attempt-of-amir-and-arbad.md` | ok |
| `event/assassination-of-sallam-ibn-abi-al-huqayq.md` | ok |
| `event/badr-council.md` | ok |
| `event/badr-duel.md` | ok |
| `event/badr-prisoners.md` | ok |
| `event/badr-qulayb.md` | ok |
| `event/bahira-encounter.md` | ok |
| `event/battle-of-badr.md` | ok |
| `event/battle-of-dhu-qar.md` | ok |
| `event/battle-of-hunayn.md` | ok |
| `event/battle-of-khaybar.md` | ok |
| `event/battle-of-mutah.md` | ok |
| `event/battle-of-the-trench.md` | ok |

