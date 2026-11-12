# Run log: ca-on-g1-science

Start 2026-11-12T05:57Z. End 2026-11-12T06:09Z. Authority: Ontario Ministry of Education, course "Sci & Tech - Grade 1", archive slug ontario-scitech-g1, source/ontario-science-tech-2022 (found by ontario_source.py).

Fetched: 5 strands, 11 overall, 44 specific expectations (Ministry last modified 2023-03-17).

## Plan (7 lessons, 4 units; strand C goes wholly to the gap register)

| Lesson | Title | Expectations | Entities |
|---|---|---|---|
| a-1 | Testing and building | A1.2, A1.3 | invention/camera-obscura; invention/jazari-castle-clock |
| a-2 | Who has helped science and technology? | A3.1, A3.3 | person/al-jazari-engineer; invention/shatir-polar-sundial |
| b-1 | What animals and land need | B1.2, B2.2, B2.5 | concept/hima |
| b-2 | Parts of the body that sense | B2.4 | invention/haytham-incoming-light-vision |
| d-1 | Structures that hold things up | D2.2, D2.3, D2.6 | concept/keel-arch |
| d-2 | What things are made of | D1.2, D2.1 | event/redigging-of-zamzam; concept/andalusi-lead-glass |
| e-1 | Day, night and the seasons | E2.2, E2.3 | invention/jazari-castle-clock (reused from a-1, a different claim) |

## The sentence for each link ("The expectation asks the student to ___; this record shows ___.")

- camera-obscura: use an experiment to test an idea; this record shows a method of testing light with a dark room, a ruler and an opaque body.
- jazari-castle-clock (a-1): use a design process to build and test a device; this record shows a water clock whose scale was set by measuring and experiment.
- al-jazari-engineer: analyse contributions from various communities; this record shows an engineer and his patronage and book.
- shatir-polar-sundial: describe a practical application; this record shows a sundial used to read time from a shadow.
- hima: identify basic needs (food, space) and actions for a healthy environment; this record shows pasture reserved for named animals. The lesson Brief says plainly the museum offers one example only.
- haytham-incoming-light-vision: identify the function of sensory organs; this record shows an account of how the eye sees. The museum does not map the body's parts; the Brief says so.
- keel-arch: identify structures that support a load and their materials; this record shows arches over columns with wooden tie-beams under a dome.
- redigging-of-zamzam: describe objects as made of materials; this record shows swords made into a door.
- andalusi-lead-glass: assess the source of materials and what becomes of things; this record shows glass made from metallurgical waste and recycled glass.
- jazari-castle-clock (e-1): describe changes in daylight through the seasons as cycles; this record shows daylight and darkness each divided into twelve portions whose lengths change seasonally.

## Results

15 of 44 specific expectations in lessons, 29 in the gap register, 0 in neither. 7 lessons, 10 connections, 9 distinct records, 4 units. Everything is draft.

Gate and cite-check outputs: see docs/courses/gates/check-ca-on-g1-science.out and the coordinator's report.

## Judgement calls

- B2.4 (body parts) rests on one eye-theory record; kept because the Brief limits the claim. Weakest link of the course.
- The castle clock serves two lessons (a-1 and e-1) with different restated sentences.
- A2.1 and A2.2 (coding): al-Khwarizmi's algorism was considered and not linked; it concerns arithmetic, not instructions for a machine.
- hima and Zamzam are given `story`; keel-arch `object`; lead glass `invention` (nearest kinds).

## Runbook problems

- Brief output of entity_brief.py is long; I truncated by awk to the English prose. No cost of time otherwise.
- Unit and subject summaries put Arabic text in parentheses; the isolate rule (U+2066/U+2069) had to be applied by a post-processing step in my generator.

## More lessons possible

None beyond the twelve limit; candidates if the museum gains records: C (energy), E2.1 (Earth and the Sun), D2.7 (fasteners).

## Proposals

- Connection kinds: no `concept`, `event` or `building` kind; hima, Zamzam and the keel arch use the nearest kinds.
- A way to mark a lesson as "partial": the Brief states it in prose only.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/sweep-science.md (Grade 1 section and Patterns). Result: 5 lessons stand (a-2, d-1, d-2, e-1 after removals; a-1 went), 3 lessons go (a-1, b-1, b-2) and unit b goes with them. Expectations moved to the gap register: A1.2, A1.3, B1.2, B2.2, B2.5, B2.4.

- a-1 (A1.2, A1.3): skills expectations name no subject matter, so both go to the register ("skills expectation: names no subject matter") and the lesson is removed whole (record and three prose files; removed from unit a). The reviewer's FIXes on its two cards (camera-obscura: cut "opaque body" and the list of lights; jazari-castle-clock: reword "solar hours" and "geometric divisions") are moot because the lesson is gone. Evidence rows deleted.
- a-2 / person/al-jazari-engineer, FIX. EN: "service to the Artuqids at Amid in 1181-1206 and a book commissioned by Nasir al-Din Mahmud, ... completion in 1205" -> "its six parts cover clocks, vessels for drinking, fountains, machines for raising water and other devices, with drawings and instructions for making and assembling them" (attributed to the TDV Islamic Encyclopaedia). AR and UR restated the same way. Evidence rows replaced.
- a-2 / invention/shatir-polar-sundial, FIX. EN: "a large horizontal marble sundial with a gnomon directed towards the celestial pole ... Dizer dates it to 773 AH (1371-1372)" -> "according to David King, Ibn al-Shatir put up a large marble sundial where the time was read from the shadow of a pointer". Same in AR and UR. The Dizer source (source/tdv-ibn-shatir-dizer) is no longer cited by the card and was removed from the connection's sources; its evidence row deleted.
- b-1 / concept/hima, REMOVE (whole lesson b-1, which had only this connection). B1.2, B2.2, B2.5 to the register. Lesson, prose and evidence row deleted.
- b-2 / invention/haytham-incoming-light-vision, REMOVE (whole lesson b-2). B2.4 to the register. Unit b, left with no lesson, deleted (record and three prose files) and removed from the subject's lessons list; the subject keeps units a, d, e.
- d-1 / concept/keel-arch, FIX. EN: "Yeomans counts the keel arch ... a Fatimid innovation in Cairo. In the qibla-arcade dome of al-Azhar ... antique columns braced by wooden tie-beams, much lighter than the solid brick piers of Tulunid building" -> "In the dome of al-Azhar in Cairo, the dome rests on pointed arches shaped like an upturned boat, standing on old columns held in place by wooden bars. Richard Yeomans describes this as much lighter than the solid brick piers of earlier building." AR and UR the same. Evidence rows updated.
- d-2 / event/redigging-of-zamzam, REMOVE (record includes a vow to sacrifice a son and weapons; it never names the metal). Connection, its evidence rows and the Brief/Try-this sentences naming the Kaaba door deleted in en, ar, ur ("two examples" -> "one example"). The lesson keeps concept/andalusi-lead-glass and both expectations D1.2 and D2.1 (the glass card speaks of the material, its source in metal waste and recycled older glass).
- d-2 / concept/andalusi-lead-glass, FIX. EN: "Analyses of glass from Saqunda, a suburb of Cordoba, revealed local lead-glass making at the end of the eighth or the early ninth century, which Nadine Schibille treats as a new technology using metallurgical waste. About sixty percent ... recycled natron glass" -> "Analyses of glass found in Cordoba show, according to Nadine Schibille, glassmakers making lead glass from metal waste. About sixty percent of the glass found there is recycled older glass." AR and UR the same.
- e-1 / invention/jazari-castle-clock, FIX. Cut "A seasonal hour is therefore not always sixty minutes." in en, ar, ur. Evidence row updated. Not applied: the reviewer notes E2.3's "heat" is unserved; no removal was asked, so E2.3 stays and the Brief still mentions heat (a loose fit, left for the founder).

Not applied: nothing.
