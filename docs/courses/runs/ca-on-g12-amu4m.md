# Run log ca-on-g12-amu4m
Start 2026-11-12T06:34Z. End 2026-11-12T06:40Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:34Z Read runbook and fleet prompt. `fetch_ontario.py --list "AMU"` returned AMU4M among several music courses; fetched "AMU4M" (archive slug `ontario-amu4m`): 3 strands, 10 overall, 29 specific expectations, manifest `docs/courses/curricula/ontario-amu4m.json`. Source id from `ontario_source.py ontario-amu4m`: source/ontario-curriculum-secondary-arts (reused).
- Read all 29 expectations. Ran about a dozen parallel `find_entity.py` searches by topic (music, oud, maqam, adhan, singing, al-Farabi, tajwid, qawwali, notation, copyright, hearing, concert, history, Indigenous, sama', arts, nasheed), then read the briefs of every candidate (`entity_brief.py ... --full`, saved in the scratchpad).
- Wrote 3 lessons in 2 units and the subject through a script in the scratchpad (not in the repository); Arabic, English and Urdu throughout, YAML dumped with a library.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| b-1 music, its community and its uses | B2.1, B2.3 | concept/al-qiyan, person/abida-parvin, work/night-song-nusrat |
| b-2 investigating a musician | B1.4, B2.2 | person/ziryab, person/nusrat-fatih-ali-khan |
| c-1 the oud: an instrument and its ideas | C2.2 | concept/al-ud, invention/ziryab-fifth-string |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B2.1, B2.3 / qiyan: analyse how music reflects its community and what it does there; the record shows singing slave women as a social institution of the early Abbasid period, trained by masters and singing teachers, held by the caliph and the wealthy or displayed by a broker.
- B2.3 / Abida Parveen: analyse the functions of music, including worship; the record shows a singer trained by her father who sang with him at Sufi saints' shrines.
- B2.1 / Night Song: analyse the sources of hybridization in contemporary music; the record shows qawwali vocals joined to electronic ambient music with Senegalese musicians.
- B1.4 / Ziryab: investigate the cultural context of a non-Western musician and evaluate the information; the record separates older reports from a later idealized portrait.
- B2.2 / Nusrat Fateh Ali Khan: analyse the impact of a significant individual on a genre; the record shows a qawwal who took qawwali to world audiences through Real World.
- C2.2 / oud and the fifth string: analyse the characteristics of and ideas in a traditional music form; the records show one instrument, an origin account that likens it to a body, and an attributed extra string.

## Counts
Units 2, lessons 3, connections 7 (7 distinct records), expectations in lessons 5 of 29 specific, expectations in the gap register 24 (16 of them skills expectations: A1.1, A1.2, A2.1, A2.2, A2.3, A3.1, A3.2, A3.3, B1.1, B1.2, B1.3, B3.1, B3.2, B3.3, B4.2, C1.3). Overall expectations listed on units: 3 (B1, B2, C2). Strand A has no unit (all its expectations went to the register). Unit B has two lessons, C one.

## Gate lines
- check_course: RESULT: GREEN (23 checks passed)
- cite-check: cite-check: 6 pass, 0 fail of 6 record(s)

## Judgement calls
- Everything here is the museum serving a part only: the Islamic world and its neighbours. Each Brief says so, and the class brings Canadian, Western and Indigenous music, performance, composition and theory.
- Skills: performing, composing and critical-analysis method expectations (A1 to A3, B1.1 to B1.3, B3, B4.2, C1.3) were registered as skills expectations. A3.2 names Japanese and African examples but is studio composing; no record can serve it.
- C2.1 (development of forms over time): gap-registered. The oud origin account and the fifth-string account are about an instrument, not a form of music developing over time; linking them would stretch it.
- Adhan and tajwid records were searched (adhan, tajwid) for B2.3 "religious worship" but neither record describes melody or music, so they were not linked.
- concept/al-qiyan is about enslaved women singers; the connection restates only the record's description (training, ownership types) and its closing question asks what the institution says about its society. The record's `status.review` is draft; the source is Ahmad Amin (duha-islam).
- person/abida-parvin: the Arabic record translates "urs" as weddings; I used only the shrine sentence both languages share.
- concept/al-ud: the English prose says "frets", the Arabic "pegs" (al-mulawi); the connection omits that clause. I also omitted the record's account of the son's body, keeping only that the maker's son had died. The record flags the account as needing a further source and the connection says so.
- Connection texts run 59 to 84 words in English (three just above 80); the gate does not limit length.
- The Urdu texts follow the English record sentences; I did not read the Urdu prose of each record.

## Runbook problems
- `find_entity.py` still takes 4 s or more per call; parallel background calls into files worked well.
- The runbook says a connection text is 40 to 80 words but the gate does not enforce it; three English texts are 81 to 84 words.
- `entity_brief.py --full` must come after the id: `entity_brief.py --full <id>` reads "--full" as the id and prints "NOT A RECORD".

## More lessons possible
None found: the other records the search turned up (person/al-gharid, person/mabad-al-mughanni) are one-line singer records, and person/begum-akhtar, person/mehdi-hassan and person/aziz-mian were not read in full; they might support a second lesson on the ghazal and qawwali if briefed.

## Proposals
- Connection kinds: the closed list has no `music` or `person`; singers and musicians were put under `career`, an album under `object`, a social institution under `reflection`, an instrument origin account under `object`.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- c-1, concept/al-ud, REMOVE: connection deleted (the only use in data/course). In the lesson's three prose files the section "What idea lies behind this picture?" (the "likened to a body in both accounts" sentence) now speaks of the one remaining account ("likens the instrument to a body"), the Brief names one account (the added string) instead of an old picture and an account, "separate what the source reports from what it attributes to a person or says needs another source" → "... attributes to a person", and the Try this reads only the fifth-string record. Evidence rows deleted. The lesson stands on invention/ziryab-fifth-string alone (C2.2).
- b-1, concept/al-qiyan, FIX: en, ar, ur: broker-and-display clause removed; "The Kitab al-Aghani is full of their biographies" added; closing question → "Where was this music heard, and who made it?"; lesson text "who paid or sponsored" → "who made the music" in the three languages. Evidence row rewritten.
- No verdict was judged wrong.
