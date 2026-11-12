# Run log: ca-on-g11-sch3u (SCH3U, Chemistry, Ontario Grade 11)

Start 2026-11-12T06:10Z. End 2026-11-12T06:21Z (times from `date -u`).

## Steps
- 06:10Z `fetch_ontario.py --list "SCH3U"` found the course under the exact name `SCH3U`; `fetch_ontario.py "SCH3U" ontario-sch3u` fetched 6 strands, 17 overall, 86 specific expectations. `ontario_source.py ontario-sch3u` printed `source/ontario-curriculum-secondary-science` (existing record, reused).
- Read all 86 expectations. Strand A has 13 skills expectations in A1 (nine of them pure skills: A1.1, A1.3-A1.7, A1.11-A1.13); the rest of A1 (A1.2, A1.8, A1.9, A1.10) and A2 name something a record can serve. Strands B to F are school chemistry (atoms, bonds, reactions, the mole, solutions, gases); the museum holds no record on them.
- Searches: `find_entity.py` in batches of 12 and 20 topic queries (three or four spellings each); results are summarised inside the gap register.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g11-sch3u-a-1 | Choosing the right instrument | A1.2 |
| ca-on-g11-sch3u-a-2 | Who is speaking? Weighing a source | A1.9 |
| ca-on-g11-sch3u-a-3 | From evidence to conclusion | A1.8, A1.10 |
| ca-on-g11-sch3u-a-4 | Careers and contributors | A2.1, A2.2 |
| ca-on-g11-sch3u-e-1 | Drinking water for everyone | E1.2 |

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- A1.2 / concept/anbik: select instruments, glassware and techniques; this record shows the named parts of a distilling apparatus and which part is the anbik.
- A1.2 / invention/balance-of-wisdom: select instruments (the expectation names a balance); this record shows a balance whose pans were arranged for weighing in air and in liquid.
- A1.9 / person/jabir-ibn-hayyan: judge reliability and bias of a source; this record shows a source (Ibn al-Nadim) reporting that people disagreed about who Jabir was and whether the works were his.
- A1.9 / concept/sinaat-al-kimiya: same; this record shows claims about the origin of alchemy passed on from their holders, which the record itself says need a further source.
- A1.8, A1.10 / invention/ibn-sina-seven-drug-assessment-conditions: ask whether evidence supports a conclusion and identify sources of error; this record shows seven conditions for interpreting a drug's effect (not a modern clinical trial, as the record says).
- A1.8, A1.10 / concept/plant-ash-glass: draw and justify a conclusion from data; this record shows chemical ratios used to attribute glass to a region, with the warning that no single criterion suffices.
- A2.1 / practice/attar-druggist: describe a career in the field and its training; this record shows the druggist's trade and what he was expected to know.
- A2.2 / invention/razi-substance-classification: describe a scientist's contribution; this record shows an organising handbook, with the limits of the claim stated.
- E1.2 / concept/sabil: analyse social and economic issues of distributing drinking water; this record shows an endowed building giving fresh water daily and where it drew its water.

## Judgement calls
- Not used: concept/soap-saboon (a legal record about soap in purification, no chemistry); concept/water-of-life (no prose); concept/environmental-protection-in-islam (a draft that reports one author's view; it would not be honest as evidence for F1.1, whose object is Canadian air quality); practice/islamic-glassmaking and concept/natron-glass (about production sites and trade; not about reactions); invention/baghdad-papermaking (C1.1 names pulp and paper, but the record is about establishing the craft in Baghdad, not the reactions).
- B1.2 (risks and benefits of everyday substances) was NOT linked to practice/attar-druggist: that record mentions adulterated and badly stored drugs, not health risks.
- The record for the 'attar disagrees across languages: the English summary says "chemist and herbal practitioner", the English prose "chemist and homoeopath", the Arabic prose "الصيدلي والمعالج بالأعشاب". The lesson uses "chemist and herbal practitioner" in English and "الصيدلي والمعالج بالأعشاب" in Arabic and avoids "homoeopath".
- The razi record's Arabic prose says the book is "attributed" (المنسوب) to al-Razi; its English prose does not. The lesson says "attributed to" in all three languages.
- concept/sinaat-al-kimiya: the Arabic record says "the sciences of the craft" of Hermes the Babylonian sage; the English record adds claims of revelation to Moses and Aaron. The connection leaves the revelation claims out; they are not needed for the lesson.
- kind choices: scholar for Jabir; reflection for the alchemy chapter; invention for Ibn Sina's conditions and al-Razi's handbook; object for the anbik, the balance, plant-ash glass and the sabil; career for the 'attar. No Qur'an connection: no linked record cites a verse the lessons need.
- Skills expectations A1.12 (units) and A1.13 (significant figures) could have been tied to the balance record but would have stretched it; both went to the register.

## Counts
Units 2 (A, E), lessons 5, connections 9 (9 distinct records), expectations in lessons 7 of 86, in the gap register 79 (9 skills expectations without subject matter, 70 with searches).

## Problems with the runbook
- None that cost time. `cite-check.ts` takes one id at a time (the runbook's multi-id form does not work); ran it per record.
- `find_entity.py` is slow (10-20 s a call); ran queries in parallel batches.

## Proposals
- Connection kinds: no `concept`, `apparatus`, `instrument`, `method`, `document` or `event` kind; an instrument and a glass type went to `object`, methods to `invention`.
- Chemistry beyond the history of the field (atoms, bonding, the mole, gas laws) has no records in the museum: lessons there would need records on the history of those ideas (for example al-Razi's and Jabir's apparatus and substances, or the Islamic-world history of the balance) before any expectation could be linked.
- A link from each expectation to the authority's page, so texts cut at 40 words can point to the full wording.
