# Run log: ca-on-g3-science
Course: Ontario Ministry of Education, "Sci & Tech - Grade 3" (archive slug `ontario-scitech-g3`), subject `course/ca-on-g3-science`.

Start 2026-11-12T05:57Z (fleet run; graph pre-built; no validate/test/build run).

## Steps
- 05:57Z read runbook and fleet prompt.
- 05:58Z fetched the Ministry course with fetch_ontario.py: 5 strands, 11 overall, 44 specific expectations. Source record: `source/ontario-science-tech-2022` (ontario_source.py).
- 06:00Z read pilot shape; searched the graph per topic with find_entity.py and read briefs with entity_brief.py --full.
- 06:10Z generated records (helper scripts in the scratchpad, not in the repository) and the gap register.
- 06:14Z gate: `check_course.py ... --strict --save` GREEN (23 checks). cite-check 13 pass, 0 fail.
- End 2026-11-12T06:19Z.

## Lesson plan (final)
| Lesson | Title | Expectations | Records linked |
|---|---|---|---|
| a-1 | Who helped build science and technology? | A3.3 | invention/camera-obscura, invention/algorism, invention/jazari-double-piston-pump |
| b-1 | What does a plant need from its land? | B2.1 | invention/ibn-bassal-soil-water-matching |
| b-2 | How have people used plants? | B2.6 | concept/agriculture-in-islam, invention/ibn-baytar-comparative-materia-medica |
| c-1 | When wind and earth strike what people built | C1.1 | event/earthquake-tsunami-425, event/aqsa-fatimid-rebuild |
| d-1 | What is a dome made of? | D2.5, D2.6 | building/dome-of-the-rock (two connections) |
| d-2 | What does a great dam mean to the people? | D1.1 | building/marib-dam, event/flood-of-al-aram, passage/quran-34-16 |
| e-1 | What is added to the soil, and which soil suits which crop? | E2.2, E2.3 | invention/ibn-bassal-soil-water-matching, concept/simad |

## Links: "The expectation asks the student to ___; this record shows ___."
- A3.3: analyse contributions to science and technology from various communities; these records show an experiment on light, the origin of the word algorithm, and a water-driven pump, each with its record's own hedge that it improved earlier work.
- B2.1: describe what plants need (water, nutrients); the record shows a farmer relating water source, land type and season to plants.
- B2.6: describe how people use plants for food and medicine; the records show farming as the source of food and a book that compared medicinal materials.
- C1.1: assess effects of forces from natural phenomena on natural and built environments, and ways people respond; the records show wind and earthquake effects on orchards and buildings, and a mosque rebuilt after an earthquake.
- D2.5/D2.6: identify materials to consider and describe how forces such as wind affect a structure; the record names materials of the dome and an iron lattice "against the wind".
- D1.1: assess effects of strong, stable structures on society; the record shows the reverse, what the author says followed a great dam's failure. The Brief says so.
- E2.2: identify substances added to soil; the simad record defines manure but is about rulings, not soil health. The connection and Brief say so.
- E2.3: examine soil types and what they suit; the record shows ten practical land types and suitable plants, from another place and time.

## Judgement calls
- D2.2 not linked: the Dome record describes form but never says how form serves function.
- B1.1: concept/hima describes reserved pasture for animals, not protection of plants; registered as a gap.
- D1.1 used with a failure story. The expectation says "strong and stable"; the Brief states plainly that the museum holds the reverse picture.
- Qur'an connection (34:16) added to d-2 because the linked event record cites that verse; text neither quotes nor interprets it.

## More lessons possible
None beyond the seven; the remaining 35 expectations went to the gap register.

## Proposals
- The closed connection `kind` list has no `disaster` or `building`; used `story` for the earthquake records and `place` for buildings.
- Gate output could print the last line of cite-check to a file like the ingestion gate does.

## Runbook problems
- find_entity.py takes over a minute when the machine is busy with other fleet agents; searches run in parallel shell calls timed out once.
- The Arabic-isolate rule: a generator that wraps parentheses must strip existing U+2066/2069 first, or they double (caught in my own output).

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-science.md, section "Grade 3". Applied in all three languages (en, ar, ur); the Urdu was brought to say what the English and Arabic now say.
- a-1, invention/jazari-double-piston-pump (FIX): cut the sentence "The record calls this a particular double-acting suction-pump arrangement, not the invention of all water lifting, and says the Science Museum's model is a reconstruction, not an original." (ar: "ويسمّي السجل هذا ترتيبًا بعينه ... إعادة بناء لا أصل."; ur: "ریکارڈ اسے دوہرے عمل والے ... اصل نہیں۔"). The card now ends: rotation to back-and-forth, then the question. The matching evidence row was deleted.
- b-2, invention/ibn-baytar-comparative-materia-medica (REMOVE): connection deleted; the lesson stays on concept/agriculture-in-islam. Brief now says the museum offers one piece (food from farming) and that medicine, shelter, clothing and Indigenous uses come from elsewhere; the section and Try this about naming one plant were replaced by a food-to-plant exercise using the agriculture record (al-Maraghi named). Evidence rows deleted. B2.6 stays in the lesson (served for food only); no gap entry needed.
- c-1, event/earthquake-tsunami-425 (FIX): "The record, drawn from Ibn al-Imad's chronicle, says that" -> "Ibn al-Imad's chronicle reports that" (ar: "يروي السجل، عن تاريخ ابن العماد، أنه" -> "يروي ابن العماد في تاريخه أنه"; ur: "ریکارڈ، ابن العماد کی تاریخ کے حوالے سے، بتاتا ہے کہ" -> "ابن العماد کی تاریخ بتاتی ہے کہ"). Deaths remain omitted.
- c-1, event/aqsa-fatimid-rebuild (FIX): closing question "What did people choose to do after the ground had shaken, and what did they change?" -> "What was the rebuilt mosque like?" (ar: "كيف كان المسجد الذي أُعيد بناؤه؟"; ur: "دوبارہ بنائی گئی مسجد کیسی تھی؟"). Not applied: nothing; the reviewer's note that the "reduce or enhance" half of C1.1 is not served is already stated in the Brief.
- d-1, building/dome-of-the-rock, first card (FIX): "piers 'nobler than marble'" -> "its columns, he says, finer than marble" (the record's prose wording); "He describes it as built in three shells: ... an iron lattice against the wind" -> "He describes the dome as built in three layers: ... an iron lattice that, he says, was set there so the winds would not tilt it" (attributed to al-Muqaddasi; the record's Arabic summary has "لئلا تميلها الرياح"). Arabic: "دعائمه ... أنبل من الرخام" -> "أعمدته ... أجلّ من الرخام", wind clause attributed with "كما يقول". Urdu: same, with "ان کے بقول". Evidence rows rewritten to match.
- d-1, building/dome-of-the-rock, al-Umari card (REMOVE): connection deleted; its evidence row deleted. The lesson Brief ("two medieval writers") now names al-Muqaddasi alone, in all three languages. The unit d Brief now lists D2.5 and D2.6 only.
- d-2 (REMOVE, whole lesson): marib-dam, flood-of-al-aram and passage/quran-34-16 removed. Lesson record and its three prose files deleted, removed from unit d `lessons:`; D1.1 added to the gap register with the exact expectation text; evidence rows deleted. Unit d stays (d-1 remains).
- e-1, concept/simad (REMOVE): connection deleted; E2.2 left the lesson (its only card was removed) and went to the gap register with the exact expectation text; e-1 stays on E2.3 with invention/ibn-bassal-soil-water-matching. Brief rewritten to E2.3 only and to say the museum has nothing on substances added to soil; the section line about "what is added" reworded; unit e Brief now lists E2.3 only. The gap entry for E2.5 no longer says simad was "used in lesson E-1". Evidence rows deleted.
- KEEP, unchanged: a-1 camera-obscura and algorism, b-1 ibn-bassal, b-2 agriculture-in-islam, e-1 ibn-bassal.
- No verdict judged wrong. Health or ruling cards: none remain (simad and ibn-baytar are gone), so no "history of a view" sentence was needed.
