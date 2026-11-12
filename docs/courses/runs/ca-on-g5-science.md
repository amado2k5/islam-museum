# Run log: ca-on-g5-science
Start 2026-11-12T06:06Z. End 2026-11-12T06:25Z.

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Sci & Tech - Grade 5", archive slug `ontario-scitech-g5`, subject `course/ca-on-g5-science`, grade `course/ca-on-g5`, jurisdiction `course/ca-on-english`.

## Steps
- 06:06Z read runbook and fleet prompt. `fetch_ontario.py --list "Grade 5"` found "Sci & Tech - Grade 5".
- 06:06Z fetched: 5 strands, 11 overall, 42 specific expectations. Source id from `ontario_source.py ontario-scitech-g5`: `source/ontario-science-tech-2022` (reused; not edited).
- 06:07Z to 06:20Z searched by topic (18 search batches, in the background) and read briefs of candidate records.
- 06:20Z to 06:24Z wrote the generator (outside the repository, in the scratchpad), the records, the prose, the gap register and the evidence.
- 06:25Z gate and cite-check run.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g5-science-a-1 | Science at work: who does what, and who contributed | A3.1, A3.3 |
| ca-on-g5-science-b-1 | Blood, heart and lungs | B2.2, B2.3 |
| ca-on-g5-science-b-2 | Telling two diseases apart | B2.4 |
| ca-on-g5-science-c-1 | How paper is made, and what it changes | C1.1 |
| ca-on-g5-science-c-2 | What a product is made from: the case of glass | C1.2 |
| ca-on-g5-science-d-1 | Floods and earthquakes: what happens to structures | D1.1, D2.2 |
| ca-on-g5-science-d-2 | Building a dome to stand through earthquakes | D1.2, D2.3 |
| ca-on-g5-science-e-1 | Water that does work | E2.3 |

All five strands have a unit. 12 of the 42 specific expectations are in lessons; 30 are in the gap register (the 6 skills expectations A1.1 to A1.5 and A2.1 among them).

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / invention/ibn-tulun-bimaristan: describe science and technology applied in an occupation to a real need; the record shows a hospital with an endowment, a custodian, attendants and physicians named by role, and what it supplied to patients.
- A3.1, A3.3 / person/ibn-al-nafis: describe a physician's occupation and a contribution from a community; the record shows a shaykh of medicine in Egypt who wrote al-Shamil and endowed his books to a hospital.
- A3.3 / invention/harun-bimaristan: analyse who contributed; the record names Jibril ibn Bukhtishu, Abu Yuhanna Masawayh and his son, a Jundishapur model, and says TDV calls Jibril's family Nestorian Christian.
- B2.2 / concept/anatomy: describe structure and function of organs; the record says Ibn al-Nafis took the shapes of inner organs from Galen and their functions from reasoning (the Arabic says "uses").
- B2.2, B2.3 / invention/pulmonary-circulation: describe the heart and lungs and how they work together; the record gives the blood's route from the right ventricle to the lung to the left ventricle.
- B2.4 / invention/al-razi-smallpox-measles: identify diseases; the record names smallpox and measles and compares their signs. It does not name organs (left to the class, said in the Brief).
- C1.1 / invention/baghdad-papermaking: assess a manufacturing process and its impact on society; the record gives the steps (fibres broken down in water, collected on a screen, dried) and what paper meant for records and books. The environmental impact is not in the record (Brief says so).
- C1.2 / concept/natron-glass, concept/plant-ash-glass: assess how the choice of materials affects a product and the environment; the records give the two fluxes, a restriction on natron extraction and the regional change. The environmental effect and the actions are left to the class (Brief says so).
- D1.1, D2.2 / event/damascus-flood-683, event/earthquake-tsunami-425: analyse the effects of natural forces on structures; the records name the structures that broke.
- D1.2, D2.3 / building/hagia-sophia, event/aqsa-fatimid-rebuild: assess human responses to such forces and describe features that let a structure withstand them; Hagia Sophia's record gives a raised dome, strengthened pillar supports and buttresses that the article credits with the absence of later earthquake damage, and the Aqsa record gives a rebuilding that was smaller (the record does not say why).
- E2.3 / invention/jazari-double-piston-pump: describe how energy is transformed in a device; the record gives the chain stream, waterwheel, gears, slotted rod, piston rods. It does not use the word energy (Brief leaves naming the forms to the class).

## Judgement calls
- Draft records used as sources of connections: concept/anatomy, event/earthquake-tsunami-425, event/damascus-flood-683 (all `draft` in the graph). Each cites a defined source and passes the provenance check. Reviewers should know they are drafts.
- Record disagreement: person/ibn-al-nafis says in English that he "left eighty volumes of it unfinished" and in Arabic that he "bound eighty volumes"; the connection says only that he wrote al-Shamil and endowed his books.
- The pulmonary-circulation text gives "thirteenth century" in English and Urdu and "seventh century AH" in Arabic, each following its own record's language.
- concept/hamiyya-diet (B1.3), concept/hima (E1.3), concept/environmental-protection-in-islam (E1.1), invention/razi-patient-group-comparison (A1.2), invention/ibn-zuhr-goat-tracheotomy-demonstration (B1.2) and concept/anbik (C2.3, C2.6) were read and judged not to carry their expectation; each is named in the gap register's searches. building/mosque-of-al-hakim (battered salients, minaret tops rebuilt after the 1303 earthquake) was read and not used: its salients are said to be not load-bearing and the earthquake is mentioned in one clause.
- Kind `place` used for institutions and buildings (hospital, Hagia Sophia, Aqsa), `story` for events and for the Harun hospital, `invention` for recipes and the pump, `scholar` for Ibn al-Nafis and for the anatomy concept (closed list).
- Urdu was written for every text.

## Failures and runbook problems
- First generator run: three connection texts were over 80 words (81, 82, 81); shortened.
- `npx tsx scripts/cite-check.ts $ids` with a zsh variable passed one argument; zsh does not split unquoted variables, so the ids must be written out. The runbook's command line works only when the ids are typed.
- The first gate run (before the gap register existed) failed COVERAGE as expected; nothing else failed. The final gate printed RESULT: GREEN.
- Topic searches with `find_entity.py` take about a minute each; running 18 of them in the background was the practical way. Searching by building features with `grep -il` over `content/en/building` found Hagia Sophia, which the label search for "structure" and "dome" had not ranked.

## More lessons possible
None beyond the eight written. E2.1 would be served if the museum held a record that names forms of energy; C2.* if it held any record on matter, heat or distilling that states a change of state.

## Proposals
- Connection kinds: no `institution`, `building`, `event` or `concept` kind; hospitals, buildings and earthquakes were filed under `place` and `story`, Ibn al-Nafis's anatomy concept under `scholar`.
- Runbook: add the zsh note for the cite-check command, and say that a unit's lesson list needs the lessons in order.
- A record that states the law of conservation of energy, or the forms of energy, or the states of matter, would let several gap entries (C2.1 to C2.7, E2.1, E2.2, E2.4) become lessons.

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-science.md, section "Grade 5 (age 10): ca-on-g5-science". English, Arabic and Urdu were changed together.

- a-1, person/ibn-al-nafis (FIX): the praise is now attributed to Ibn al-Imad and the list of subjects is cut.
  - en: "Ibn al-Nafis was the shaykh of medicine in Egypt, the one to whom knowledge of medicine ultimately led; he also took part in jurisprudence, ... logic. He wrote ..." -> "Ibn al-Imad calls Ibn al-Nafis the shaykh of medicine in Egypt, the one to whom knowledge of medicine ultimately led. Ibn al-Nafis wrote ...".
  - ar: "كان ابن النفيس شيخَ الطب ... مع مشاركة في الفقه ... والمنطق. ألّف" -> "يصف ابن العماد ابن النفيس بأنه شيخ الطب ... ومن انتهت إليه معرفة الطب. وقد ألّف".
  - ur: "ابن نفیس مصر میں طب کے شیخ تھے ... منطق میں بھی ان کی شرکت تھی۔ انہوں نے" -> "ابن العماد ابن نفیس کو مصر میں طب کا شیخ کہتا ہے ... آ کر ختم ہوا۔ ابن نفیس نے". Evidence rows restated.
- b-1, concept/anatomy (REMOVE): connection deleted with its evidence rows. The lesson stays on invention/pulmonary-circulation, which serves B2.2 and B2.3; the Brief and prose never named the anatomy record. Unit b prose and summary changed from two lessons and "diseases" to one lesson and the human body and its systems.
- b-2 (B2.4, REMOVE): lesson, three prose files and evidence rows deleted; removed from unit b; B2.4 added to the gap register.
- c-1, invention/baghdad-papermaking, second card (FIX): the sentence "The record adds that its sources do not make the Baghdad proposal the origin of every translation movement, library or science" was cut in en, ar and ur (the Arabic "ويضيف السجل أن مصادره ..." and the Urdu "ریکارڈ اضافہ کرتا ہے ..." likewise); the two evidence rows for it were reduced to the two remaining claims. The first card (KEEP) is unchanged.
- c-2 (C1.2, both glass cards, REMOVE): lesson, prose and evidence rows deleted; removed from unit c (prose now says one lesson); C1.2 added to the gap register.
- d-1, event/aqsa-fatimid-rebuild (FIX): closing question "What would a community weigh when it rebuilds a structure after such a force?" -> "What changed in the mosque when it was rebuilt?" (ar: "ماذا تغيّر في المسجد حين أُعيد بناؤه؟"; ur: "مسجد کی تعمیرِ نو میں کیا بدل گیا؟"). Neither d-1 card nor its Brief mentions deaths or drownings, so no clause was cut there.
- e-1 (E2.3, REMOVE): lesson, prose and evidence rows deleted; unit e (its only lesson) and its three prose files deleted and removed from the subject's lessons list; E2.3 added to the gap register; two gap searches that said the pump record "is used in lesson e-1" were reworded.
- Subject Brief: eight lessons -> five, twelve mapped expectations -> nine, in three languages.
- KEEP rows (a-1 Ibn Tulun and Harun hospitals, b-1 pulmonary circulation, c-1 first papermaking card, d-1 flood and earthquake, d-2 Hagia Sophia): unchanged.
- Not applied: nothing judged wrong. One note: the first papermaking card still says "The record calls this the moving of a craft to a city"; the review marked it KEEP and the order was to leave KEEP cards unchanged, so it was left, though the "the record calls" phrasing is the filler the review's pattern 4 describes.
