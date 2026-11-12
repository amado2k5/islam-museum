# Run log: ca-on-g4-science
Start 2026-11-12T05:54Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Sci & Tech - Grade 4", archive slug `ontario-scitech-g4`, subject `course/ca-on-g4-science`, grade `course/ca-on-g4`, jurisdiction `course/ca-on-english`.

## Steps
- 05:54Z read runbook and fleet prompt. `fetch_ontario.py --list "Grade 4"` found "Sci & Tech - Grade 4".
- 05:54Z fetched: 5 strands, 11 overall, 44 specific expectations. Source id from `ontario_source.py ontario-scitech-g4`: `source/ontario-science-tech-2022` (reused; not edited).
- 05:55Z to 06:00Z read briefs of candidate records (optics, al-Jazari devices, earthquakes, Kitab al-Hayawan, al-Biruni).
- 06:01Z wrote the generator (outside the repository) and records, then the gap register and evidence.
- 06:05Z gate run.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g4-science-a-1 | People who solve real problems with science | A3.1, A3.3 |
| ca-on-g4-science-c-1 | How light travels | C2.1, C2.3 |
| ca-on-g4-science-c-2 | How we see | C2.8 |
| ca-on-g4-science-d-1 | A machine for washing hands | D2.1, D2.2 |
| ca-on-g4-science-d-2 | Turning motion into back-and-forth motion | D2.3, D2.4 |
| ca-on-g4-science-e-1 | When the ground shakes | E1.1 |

Strand B (Life Systems) gets no unit: all nine specific expectations are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / al-jazari-engineer: describe science and technology applied in an occupation to a real problem; the record shows an engineer whose book covers clocks, water raising and other devices for a court.
- A3.3 / ibn-al-haytham: analyse a community's contribution to science; the record shows a scholar whose Book of Optics is the principal optical work of the Islamic world.
- C2.3 / optics: describe properties of light including straight travel, reflection, refraction; the record names light's three states.
- C2.1, C2.3 / camera-obscura: name light sources and show that light travels straight; the record has sun, moon, stars, fire and candles, and a ruler laid along the beam.
- C2.3 / circular-reflection: describe reflection; the record locates reflection on a circular mirror between object and eye.
- C2.8 / incoming-light-vision: identify the organ that uses light; the record is a theory of the eye as affected by light from objects.
- C2.8 / camera-obscura: identify a device that uses light; TDV calls the experiment the basis of the photographic camera.
- D2.1, D2.2 / peacock-washer: identify a machine, its purpose and its parts; the record names peacock, float, soap figure, towel figure, spigot and their sequence.
- D2.3, D2.4 / double-piston-pump and animal-scoop-lifter: describe how mechanisms pass on and transform motion; both records turn rotation into back-and-forth motion with a pin in a slot.
- E1.1 / earthquake-tsunami-425, aqsa-fatimid-rebuild: analyse a geological process's impact on society; the records give the damage and a rebuilding.

## Judgement calls
- Lesson d-1 has D2.1 "machines used in daily life" served by a design that may never have been built. The Brief and the connection say so. Kept because hand washing is an everyday task and the record names every part.
- C2.3 is partly served (straight travel, reflection). Absorption and refraction are left to the class and the Brief says so.
- Kind `scholar` used for concept/optics and `story` for earthquake events (closed list).
- Kitab al-Hayawan does not state a food chain, diet classes or adaptations (it sorts animals by movement); not linked. Whole strand B is a gap.
- A3.2 and A2.2 went to the register: no record joins two school subjects, and none concerns coding.
- Urdu was written for every text, including lessons, units and subject.

## Failures and runbook problems
- First gate run failed TREE "siblings have distinct `order`": I had given every unit `order: 1`. Units now take their position (A=1, C=2, D=3, E=4). The runbook's unit example does not say that unit order must differ within the subject.
- The runbook shows lessons without `ur` in places (the proof course has no Urdu); fleet rule 3 and the strict gate require it.
- Search tool `find_entity.py` prints 266+ hits for common words ("light"); useful only with `grep -v` on source/passage.

## More lessons possible
None beyond what is written; the gap register lists what the museum cannot serve. A lesson on A2.2 (impacts of emerging technologies) or on the elephant clock for D2.1 would need records the museum does not hold in a form the expectations ask for.

## Proposals
- Connection kinds: no `concept` or `discipline` kind (optics was filed under `scholar`); no `event` kind (earthquakes under `story`).
- Runbook: state that sibling units need distinct `order`.
- Expectation D2.5 (forces in machines) could be served if the museum had a record on the balance, lever or gear train explaining a change of force.

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-science.md, section "Grade 4". All six lessons stand; no expectation moved to the gap register.

- a-1, person/al-jazari-engineer, FIX. en "The record, following the TDV encyclopedia, says he served" -> "TDV records that he served"; ar "يذكر السجل، عن موسوعة TDV، أنه خدم" -> "تذكر موسوعة TDV أنه خدم"; ur "ریکارڈ، ٹی ڈی وی ... کے حوالے سے، بتاتا ہے کہ اس نے" -> "ٹی ڈی وی انسائیکلوپیڈیا کے مطابق اس نے". "handwashing and bloodletting vessels" -> "vessels for hand washing" (ar "أواني غسل اليدين"; ur "ہاتھ دھونے کے برتن"). Evidence row updated.
- a-1, person/ibn-al-haytham, FIX. "is described as ... Its editor ... holds the book to be the most valuable" -> "Ibn al-Haytham was an Arab mathematician and physicist. The editor of the Kitab al-Manazir ... calls it the principal optical work ..., places him in the fifth century AH and judges it the most valuable thing Arab scholars produced in physics. The museum also records his dark-room test of how light travels." Same in ar and ur. The dark-room sentence rests on the person record's own link to the dark-room contribution. Evidence rows updated and one added.
- c-1, invention/ibn-al-haytham-circular-reflection, REMOVE (c, too hard). Connection deleted; its two evidence rows and the evidence note deleted. The lesson keeps concept/optics and invention/camera-obscura, so it stands and C2.1 and C2.3 are still served. Brief in en, ar, ur: "his work on reflection" -> "his naming of reflection and refraction among the states of light" (the optics card names them), and "refraction" removed from what is left to the class (absorption and sources remain).
- c-2, invention/camera-obscura, FIX. "The record notes that the TDV encyclopedia calls" -> "TDV calls" (ar "تعدّ موسوعة TDV", ur "ٹی ڈی وی انسائیکلوپیڈیا ... کہتی ہے"); second sentence ("did not discover that light passes through a hole ...") dropped in all three languages; its evidence row dropped.
- d-2, invention/jazari-double-piston-pump, FIX. Sentence "The record stresses that the contribution is this arrangement ... reconstruction." dropped in en, ar, ur; its evidence row dropped.
- e-1, event/earthquake-tsunami-425, FIX. "The record, quoting Ibn al-Imad's Shadharat al-Dhahab, says" -> "Ibn al-Imad's chronicle, the Shadharat al-Dhahab, reports" (ar, ur likewise). "three leagues" -> "three farsakhs" (en; ar and ur already had farsakhs). "when the water returned it carried off some of the people who had gone out" -> "some of the people who had gone out to gather fish and shells were caught when the water returned" (ar: "وباغت الماءُ حين عاد بعضَ الذين خرجوا"; ur: "... پانی لوٹنے پر اس کی زد میں آ گئے"). Evidence rows updated.
- e-1, event/aqsa-fatimid-rebuild, FIX. "the record counts the earthquake among the causes" -> "the Encyclopaedia of Islam counts" (ar "دائرة المعارف الإسلامية", ur "اسلامی انسائیکلوپیڈیا"). Evidence row updated.
- d-1, c-1 (optics, camera-obscura), c-2 (haytham vision), d-2 (animal scoop): KEEP, unchanged.

Not applied: nothing. The reviewer's note that e-1's record mixes weather (black wind, hail) with the earthquake needs no change: the card quotes only the earthquake and sea passages.
