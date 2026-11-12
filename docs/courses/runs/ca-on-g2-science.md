# Run log: ca-on-g2-science
Course: Ontario Ministry of Education, "Sci & Tech - Grade 2"; archive slug `ontario-scitech-g2`; subject `course/ca-on-g2-science`.
Start 2026-11-12T05:57Z. End 2026-11-12T06:10Z.

## Steps
- 05:57Z fetched the Ministry text with fetch_ontario.py: 5 strands, 11 overall, 41 specific expectations. Source id from ontario_source.py: `source/ontario-science-tech-2022` (reused, nothing created).
- Searched the graph per theme with find_entity.py (Banu Musa, al-Jazari, qanat, water wheel, water cycle, Zamzam, Karaji, camel, bee, locust, animals, simple machines, water, air, pollution, First Nations, and more). Read entity_brief.py --full for the records used.
- Wrote 11 data records (subject, 5 units, 5 lessons), 33 prose files (ar, en, ur), the gap register, the evidence file.
- 06:09Z gate and cite-check run.

## Plan (lesson: working title: codes)
| Lesson | Title | Codes |
|---|---|---|
| ca-on-g2-science-a-1 | Who has added to science and technology? | A3.2, A3.3 |
| ca-on-g2-science-b-1 | How do animals move and differ? | B2.1, B2.2 |
| ca-on-g2-science-c-1 | Snow and clay: water in its forms and materials | C1.2, C2.6 |
| ca-on-g2-science-d-1 | Machines that move water | D2.1, D2.3, D2.4 |
| ca-on-g2-science-e-1 | Where does water come from? | E2.2 |

## Honest sentences for the links ("The expectation asks the student to ___; this record shows ___")
- A3.3 / group/banu-musa: analyse contributions of communities; a family that, by Ibn al-Nadim, pursued geometry, mechanical devices and astronomy and paid copyists. Only Muslim scholars; stated in the Brief.
- A3.2 / person/al-karaji: use science with other subjects on a real problem; a mathematician-engineer whose manual joins levels and geometry for qanats.
- A3.3 / person/al-jazari-engineer: contributions of a community; an engineer at Amid and his book on mechanical devices.
- B2.1, B2.2 / work/kitab-al-hayawan: compare physical characteristics, describe locomotion; al-Jahiz sorts animals into those that walk, fly, swim, creep and compares talons and beaks.
- C1.2 / event/baghdad-great-snow-398: assess effects of a solid form of water on people; snow a week unmelted, shovelled from roofs. A reported event, no explanation of melting: said in the Brief and in the gap entries for C2.3, C2.4.
- C2.6 / concept/unglazed-earthenware: classify materials by absorbing or repelling water; porous ware stored water, unfit for milk, wine or oil. Buoyancy is not served.
- D2.1, D2.3, D2.4 / the hidden-drive lifter and the double-piston pump: ways to move (turning, back and forth); a lever and a wheel and axle at work. Only two of six simple machines; stated in the Brief.
- E2.2 / sabil, qanat, scoop lifter: sources of water in built environments (wells, pools, springs, rain, groundwater tunnel). Natural sources left to the class; stated in the Brief.

## Judgement calls
- Considered and rejected: concept/environmental-protection-in-islam for E1.1 (one author's statement, draft record, no assessment or plan; the expectation also asks for First Nations, Metis and Inuit perspectives). concept/sabil for E1.3 (supply, not availability). building/bir-zamzam (one-line Wikidata summary). concept/camel, bee, locust, rain, clouds (no prose).
- 31 of 41 specific expectations went to the gap register: strand A skills (A1.1 to A1.5 with the skills reason), and whole topics the museum does not hold (life cycles, adaptation, states and mixtures of matter, safety symbols, forces, the water cycle, air, household water use).
- Kinds: book filed as `object`; earthenware concept as `object`; sabil as `place`; snow event as `story`.

## Counts
Units 5, lessons 5, connections 11, expectations in lessons 10 of 41, in the gap register 31.

## More lessons possible
None found: the other 31 expectations have no record that supports an honest sentence. If the museum later writes prose for concept/rain, concept/clouds, concept/camel or concept/bee, E2.3, E2.4, E2.5 and B2.5 should be searched again.

## Runbook problems
- Section 4 says `entity_brief.py` truncates at 2,500 characters and `--full` is needed; the full output of a single record can be over 30,000 characters, so a reader must page through it by section. A `--section` option or an English-only flag would save time.
- The gap `why` for skills expectations is described as needing a reason but not its wording; I used "skills expectation: names no subject matter".

## Proposals
- Connection kinds: no `event` or `document` kind for the snow report; no `book`. A `work` kind would fit a book such as Kitab al-Hayawan better than `object`.
- A kind for "building/concept of public service" such as the sabil (filed as `place`).

## Corrections after the fleet review

Source: docs/courses-mission/verifier/sweep-science.md. Verdicts: 2 KEEP (b-1 kitab-al-hayawan, c-1 baghdad-great-snow-398; unchanged), 9 FIX (applied), 0 REMOVE. No lesson, unit or expectation moved to the gap register. Lesson prose (Briefs) did not describe the removed clauses and is unchanged. Urdu cards were rewritten to say what the English and Arabic say. Parentheticals in Arabic and Urdu text are wrapped in U+2066/U+2069. The reviewer did not read the Urdu; I wrote it from the new English.

Earlier in the same pass the a-1 and c-1 cards were rewritten first (same rules); old and new text below is taken from the files.

- a-1, group/banu-musa, FIX: Added the sons' books ("Mechanical Devices" by Ahmad and a book on the pneumatics) so the card shows a contribution; glossed "copyists" as people who copied books; question changed to "What can a family contribute...". Old: "...as among those who pursued the ancient sciences to the utmost... What can a family achieve when it spends its wealth on learning?" New (en): "...as men who pursued the ancient sciences to the utmost... Among their books are \"Mechanical Devices\" by Ahmad and a book on the pneumatics. What can a family contribute..." ar and ur say the same (ar names الحيل and كتاب بني موسى في الفرستون; ur gives the pneumatics book as نیومیٹکس).
- a-1, person/al-karaji, FIX: Cut "and the record adds that it is not the invention of every conduit or well"; replaced "a manual on levelling and tunnel alignment joins levels and geometrical explanation within an older qanat tradition" with "Ataie-Ashtiani and Simmons describe his book on hidden waters as using levels, tools for measuring heights, together with geometry to explain how to line up a tunnel so that it can carry water" (ar, ur the same).
- a-1, person/al-jazari-engineer, FIX: Dropped the Artuqid/Amid dates and patron ("The record gives his service ... 1181 to 1206 ... Nasir al-Din Mahmud ... 1205"); now says what his book covers: six parts (clocks, drinking vessels, fountains, water-raising machines and other devices), fifty devices, coloured drawings and instructions for making and running them (TDV). ar, ur the same.
- c-1, concept/unglazed-earthenware, FIX: "its porosity made it unfitting for milk, wine or oil" -> "because it soaked up liquids it was unfitting for milk, wine or oil" (ar: لأنه يتشرب السوائل; ur: چونکہ وہ مائعات کو جذب کر لیتے تھے).
- d-1, invention/jazari-hidden-drive-water-lifter, FIX: Cut "discharged water turns a scoop wheel in a chamber beneath a pool", "gears transmit rotation to a vertical shaft" and the hooves/shaft clause. Now: "flowing water turns a wheel and axle. A lever carries a lightweight wooden cow." (ar, ur the same).
- d-1, invention/jazari-double-piston-pump, FIX: Cut "two gears", "rod", the Hill sentence on the slotted lever in a box and the rotating dowel. Now: "TDV describes al-Jazari's pump with two pistons: flowing water turns a wheel, and the turning becomes back-and-forth motion in the piston rods." (ar, ur the same). Evidence row for the slotted lever removed.
- e-1, concept/sabil, FIX: "The record says sabils drew water from..." -> "He says" with Al-Haddad named (ar: ويذكر الحداد; ur: الحداد بتاتے ہیں). Evidence row names Al-Haddad.
- e-1, invention/karaji-qanat-surveying, FIX: "The record describes a qanat..." -> "Ataie-Ashtiani and Simmons describe a qanat..."; added "so the water runs out downhill" and a gloss "vertical shafts (straight holes down from the ground)"; cut "refines an older tradition; it is not the invention of groundwater or of qanats themselves"; replaced by "Al-Karaji wrote a manual on levels and on lining up such a tunnel." (ar, ur the same). Evidence row for the cut clause replaced.
- e-1, invention/jazari-animal-scoop-water-lifter, FIX: Cut "and a geared mechanism turns that input into a repeated lifting movement"; kept the scoop on a moving stem and "An animal supplies the motion". Evidence row narrowed.

Not applied: nothing. Checked and not changed: the reviewer's note that C2.6 buoyancy and D2.3 (other simple machines) are not served by any card is already stated in the Briefs ("your class will test buoyancy", "find the other simple machines"); no card was added. The a-1 reviewer remark that the banu-musa record is draft was not acted on (record status is outside this task).
