# Run log ca-on-g11-sbi3u
Start 2026-11-12T06:09:53Z. End 2026-11-12T06:24:50Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:09Z Read the fleet prompt and the runbook. `fetch_ontario.py --list "SBI"` gave `SBI3C`, `SBI3U`, `SBI4U`; the Ministry's course name is `SBI3U` (no year suffix).
- 06:10Z Fetched with `fetch_ontario.py "SBI3U" ontario-sbi3u`: 6 strands, 17 overall, 67 specific expectations. Source id from `ontario_source.py ontario-sbi3u`: source/ontario-curriculum-secondary-science (reused).
- Read all 67 expectations. Strand A: A1.1 to A1.13 are skills (gap register). Searched the graph for each topic of strands B to F (find_entity.py, entity_brief.py); briefs read for every record linked.
- Wrote 6 lessons, 5 units (A, B, D, E, F) and 1 subject through a script kept in the scratchpad (not in the repository); Arabic, English, Urdu throughout.
- 06:23Z Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 learning medicine and working as a physician | A2.1 | event/ibn-al-nafis-studies-dakhwar-628, invention/pulmonary-circulation, event/ibn-al-nafis-baybars-physician-660 |
| a-2 scientists and what they added | A2.2 | person/al-zahrawi, work/kitab-al-hayawan, person/ibn-al-nafis |
| b-1 telling groups of animals apart | B3.3 | work/kitab-al-hayawan |
| d-1 cloning plants | D1.1 | work/fatwa-aliftaa-jo-plant-cloning |
| e-1 where does the blood go | E3.3 | invention/pulmonary-circulation (twice: before, within) |
| f-1 soil, water and the growing plant | F3.4 | invention/ibn-bassal-soil-water-matching |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.1: identify and describe careers and the education and training they need; the records show how one physician of the thirteenth century studied under a master, trained at a hospital, and became chief physician. The Brief says the museum offers this one case only and that today's careers in biology come from elsewhere.
- A2.2: describe the contributions of scientists, including Canadians; the records show how three scholars of the Islamic world are described (a surgeon and encyclopaedist, the author of a book on animals, a physician). No Canadian scientist: the Brief says so.
- B3.3: describe unifying and distinguishing characteristics of representative organisms; the record shows one author's division of the animal world and the traits he uses to separate birds from flying insects and bats. The Brief says it is not modern taxonomy and that the kingdoms come from elsewhere.
- D1.1: analyse social and ethical implications of genetic research; the record shows how a religious body answered a question on cloning plant cells, and the conditions it set. Attributed; the museum issues no ruling. The Brief says the museum teaches no genetics and holds one perspective only.
- E3.3: explain the anatomy of the circulatory system and its function; the record shows how the route of the blood through the lungs was first described, against the older scheme of pores in the septum. The Brief says the museum does not teach the anatomy.
- F3.4: describe the factors that affect plant growth; the record shows an author linking kinds of water and soil to season and crop. The Brief says the factors and the evidence for them come from elsewhere.

## Judgement calls
- The English and Arabic texts of person/ibn-al-nafis disagree on al-Shamil: English says eighty volumes were left unfinished, Arabic that eighty were fair-copied (`بيّض`). The card (a-2 after) says only what both say: the index suggests three hundred volumes.
- The Arabic record of event/ibn-al-nafis-studies-dakhwar-628 has the Suwaydan account (illness at 22 in 629, enrolment at the Nuri hospital); invention/pulmonary-circulation (West) has him moving to Cairo at 23. Set side by side they conflict, so the a-1 "before" card takes only the Dakhwar study and the Nuri enrolment, and the "within" card takes only West.
- invention/pulmonary-circulation English summary says "thirteenth century"; its Arabic summary says the seventh century of the Hijra. Each language follows its own record. Urdu follows the Arabic.
- Considered and not linked: question/is-human-evolution-compatible-with-islam (one modern writer's view on creation and evolution, with the scientific and academic views "not yet documented"; it gives no account of the theory, so it cannot serve C3.1); concept/agriculture-in-islam (law and ethics of land and water, no plant matter); concept/hima and concept/environmental-protection-in-islam (no biodiversity); invention/zahrawi-mishab and invention/zahrawi-intestinal-suture (treatments, not technologies for understanding internal systems; the urethra is not among the systems named in E3); invention/ibn-baytar-comparative-materia-medica (about the naming of drugs, no Canadian plants); person/ibn-sina and work/al-qanun-fi-al-tibb (no anatomy of the heart in the brief).
- No Qur'an connection: no linked record cites a verse that the lesson's expectations call for.
- The F3.4 example list (growth regulators, sunlight, water, nutrients, acidity, tropism) is stored as `[…]`; the f-1 card claims only what the record says (kinds of water and soil linked to season and crop), not nutrients or acidity.

## Counts
Units 5 (A, B, D, E, F), lessons 6, connections 11 (8 distinct records), expectations in lessons 6 of 67 specific, expectations in the gap register 61 (13 of them skills expectations: A1.1 to A1.13). Overall expectations listed on units: 5 (A2, B3, D1, E3, F3). Strand C (Evolution) has no unit.

## Gate and cite-check
- `check_course.py course/ca-on-g11-sbi3u --official .cache/curricula/ontario-sbi3u/official.json --strict --save`: `RESULT: GREEN (23 checks passed)`, output in `docs/courses/gates/check-ca-on-g11-sbi3u.out`.
- `npx tsx scripts/cite-check.ts` over the 12 records: `cite-check: 12 pass, 0 fail of 12 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`.

## More lessons possible
None beyond the six: every other expectation has no honest link (see the gap register).

## Runbook problems
- `find_entity.py` loads the whole graph file on every call; with about 150 agents running at once a single call took one to several minutes, and a serial loop of searches never finished. I loaded the graph once in a scratchpad script that imports `find_entity.search` and ran all topic searches in one process. The runbook could offer a multi-query mode (`--batch file`) for fleet runs.
- `entity_brief.py` takes the id first and `--full` after it (`entity_brief.py place/x --full`); `--full` before the id is read as the id. The runbook example shows the flag first in prose.
- `cite-check.ts` must be given the ids as separate arguments; a single quoted string of ids reads as one id and fails with "no file at …".

## Proposals
- Connection kinds: the closed list has no `document`/`ruling`; the plant-cloning answer in d-1 is filed as `reflection`, the nearest kind. Needs the founder's choice.
- D1.1 asks for the social and ethical implications of genetic research; the museum holds only a modern religious body's answer on plant cloning. Whether a fatwa record should ever serve a science expectation as the only perspective is the founder's call; the Brief states the limit.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g11-sbi3u-d-1, KEEP-BUT-FIX.** Summary: old "as a case of the ethical questions that genetic technology raises" -> new "its way of weighing benefit and harm for a biotechnology question, not an example of genetic modification or genomics research" (ar, ur the same). Brief gains: "The record concerns multiplying plant cells, which it describes as leaving the genetic content unchanged; it is not a case of genetic modification." (ar, ur the same). Card unchanged (faithful and attributed per the review). Not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 12 pass, 0 fail.
- sbi3u-a-1, card event/ibn-al-nafis-studies-dakhwar-628, FIX: the television programme is named as such and the disagreement of dates stated without repeating the programme's dates. en: "Tariq al-Suwaydan's al-Mubdi'un adds that he enrolled at the Nuri hospital in Damascus." → "A television programme, Tariq al-Suwaydan's al-Mubdi'un, adds that he enrolled at the Nuri hospital in Damascus, but its dates for his turn to medicine do not agree with the date of al-Dakhwar's death."; ar: "ويضيف طارق السويدان في برنامج «المبدعون» …" → "ويضيف برنامج تلفزيوني، «المبدعون» لطارق السويدان، … لكن تواريخه لتحوله إلى الطب لا تتفق مع تاريخ وفاة الدخوار"; ur: the same in Urdu. Evidence row replaced.
- sbi3u-a-2, card work/kitab-al-hayawan, FIX: replaced, in en, ar, ur, by the classification (inanimate or growing; animals walk, fly, swim or creep; locusts, bees and flies are not birds; the bat among birds though featherless, the ostrich not a bird), credited to the edition of Muhammad Basil 'Uyun al-Sud as the record presents it; the title "A book larger than its title" → "Not everything that flies is a bird" (ar, ur matching); the closing question is now "What does a way of grouping animals add to the study of living things?"; source v4 dropped (v1 only). Evidence rows replaced.
- sbi3u-a-2, card person/ibn-al-nafis, FIX (attribution): "Ibn al-Nafis was the shaykh of medicine…" → "Ibn al-Imad's Shadharat al-Dhahab calls Ibn al-Nafis the shaykh of medicine…"; "Al-Subki is quoted as saying" → "It records al-Subki as saying" (ar "تسمّي «شذرات الذهب» لابن العماد … وتنقل قول السبكي"; ur "ابن العماد کی «شذرات الذہب» … کہتی ہے … نقل کرتی ہے").
- Not applied: the review's "add the pulmonary circulation or drop" on the sbi3u-a-2 Ibn al-Nafis card. The person record's own prose carries the pulmonary circulation only through television programmes, which the lead's rule excludes; the card names the contribution the record gives from its cited source (the medical book al-Shamil and the endowment). Also not applied: the review's "merge into one card" note on sbi3u-e-1 (two links to invention/pulmonary-circulation), attached to KEEP verdicts, left unchanged as instructed.
