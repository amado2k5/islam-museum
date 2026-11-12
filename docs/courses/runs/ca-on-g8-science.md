# Run log: ca-on-g8-science
Start 2026-11-12T06:06Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Sci & Tech - Grade 8", archive slug `ontario-scitech-g8`, subject `course/ca-on-g8-science`, grade `course/ca-on-g8`, jurisdiction `course/ca-on-english`.

## Steps
- 06:06Z read runbook and fleet prompt; `fetch_ontario.py --list "Grade 8"` found "Sci & Tech - Grade 8".
- 06:07Z fetched: 5 strands, 11 overall, 52 specific expectations. Source id from `ontario_source.py ontario-scitech-g8`: `source/ontario-science-tech-2022` (reused, not edited).
- 06:08Z to 06:15Z searches (spellings in the gap register) and briefs of candidate records.
- 06:16Z to 06:20Z wrote the generator (outside the repository) and the records, gap register and evidence.
- 06:21Z gate run (GREEN first time); cite-check 0 fail.
- Finished 06:22Z.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g8-science-a-1 | People who solve real problems with science | A3.1, A3.3 |
| ca-on-g8-science-c-1 | Weighing water to find density | C2.2, C2.5 |
| ca-on-g8-science-c-2 | Steering the flow: a clock and a heart | C2.8, C2.10 |
| ca-on-g8-science-d-1 | Pumps with a purpose | D2.2, D2.3 |
| ca-on-g8-science-e-1 | Sharing and carrying water | E2.7 |

Strand B (Life Systems) gets no unit: all eight specific expectations are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / al-jazari-engineer: describe science and technology applied in an occupation to real problems; the record shows an engineer whose book covers clocks, water raising and other devices for a court.
- A3.3 / ibn-al-nafis: analyse a community's contribution; the record shows the shaykh of medicine in Egypt, his learning and his endowment to the Mansuri hospital.
- C2.2 / biruni-displacement-vessel: relate mass, volume and density; the record shows displaced water collected and weighed to compare a sample's volume and weight, and "specific gravity" as a ratio to reference water.
- C2.2, C2.5 / balance-of-wisdom: determine buoyancy in fluids; the record shows apparent weight in a liquid and how comparing air weight with weight in water informs density. Partly served: no calculation of buoyancy in several fluids, and the Brief says so.
- C2.8 / jazari-castle-clock: factors that affect flow; the record says a falling level in an unregulated tank changes the outflow conditions, and describes the float and plug that keep the level steady.
- C2.10 / pulmonary-circulation: compare fluid regulation in organisms and machines; the record shows the route of blood through heart and lungs, to be set beside the clock.
- D2.2, D2.3 / jazari-double-piston-pump, taqi-six-cylinder-pump: purpose, input, output and components of a system; both records name the power source, the transmitting parts and the water output.
- E2.7 / shirb-water-rights, sabil, karaji-qanat-surveying: how water use is managed (municipal treatment is not served); the records give rules for sharing water, a public supply building with its sources and endowments, and the route of an underground channel.

## Judgement calls
- Eighty volumes of al-Shamil: the Ibn al-Nafis record's English says he "left eighty volumes unfinished" and its Arabic says he fair-copied (bayyada) eighty. The two disagree, so the connection omits it and uses only what both say.
- Pulmonary-circulation: the English summary dates Ibn al-Nafis to the thirteenth century and the Arabic to the seventh century AH; the connection gives no century in any language.
- Kind: `invention` used for pulmonary circulation (a discovery), the castle clock, pumps and qanat method; `story` for the concepts shirb and sabil (closed list).
- B2.6 (cells into tissues, organs, systems): concept/anatomy treats organs as simple or composite in Ibn Sina's scheme, with no cells or tissues of cells. Not linked; a gap.
- E2.7 asks about municipal processing; the museum has nothing on treating water. The lesson serves only the management and supply part, and its Brief says so.
- D2.6: the balance record states the lever-arm principle (balance depends on the load's distance from the suspension), but there is nothing on input and output forces or mechanical advantage; a gap.
- Urdu was written for every text, including lessons, units and subject.

## Failures and runbook problems
- None in the gate (GREEN on the first run). The fleet's shared scratch directory holds other agents' generators; the g4-science generator was used as a model for shape only.
- `find_entity.py` with several spellings takes 30 to 100 seconds; run in parallel with output files per search. A shell function with a counter does not survive `&`.
- `cite-check.ts` takes one id per argument; a single quoted string of ids fails with "no file".

## More lessons possible
- event/mecca-springs-835 (springs channeled into Mecca in 835 AH, filling the Bab al-Mu'alla pools) could be a further E2.7 connection, but the record says the source of the water and the builder are not named.
- invention/jazari-animal-scoop-water-lifter and invention/jazari-hidden-drive-water-lifter could join D2.2/D2.3 in a second pumps lesson.
- concept/hawd-basin-water (colour, taste and smell as jurists' signs that an impurity has changed still water) could be offered against E2.6 if the founder accepts a ritual-purity rule as a water-quality indicator; I did not.

## Proposals
- Connection kinds: no `concept`, `discovery` or `event` kind (shirb and sabil filed under `story`, pulmonary circulation under `invention`).
- Runbook: say that sibling units need distinct `order` (the same note as in the Grade 4 science run).

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-science.md (Grade 8). Four FIX verdicts applied; no REMOVE verdicts; the other seven connections were KEEP and are unchanged. No connection added, no gap-register change.

- a-1, person/al-jazari-engineer (FIX). en: "The record, following the TDV encyclopedia, says he served" -> "The TDV Islamic Encyclopedia records that he served". ar: "يذكر السجل، عن موسوعة TDV، أنه" -> "تذكر موسوعة TDV الإسلامية أنه". ur: "ریکارڈ، ٹی ڈی وی انسائیکلوپیڈیا کے حوالے سے، بتاتا ہے کہ" -> "ٹی ڈی وی اسلامی انسائیکلوپیڈیا بتاتی ہے کہ". Bloodletting kept (age 13).
- a-1, person/ibn-al-nafis (FIX). The clauses on his shaykh title, his jurisprudence/hadith/logic share and the endowment to the Mansuri hospital were replaced in all three languages by what he wrote: Ibn al-Imad (Shadharat al-Dhahab) on al-Shamil (index showing 300 volumes, eighty fair-copied) and dictation from memory; John B. West (2008) on his commentary on the anatomy of the Canon describing blood passing from the right ventricle through the lungs to the left ventricle. Both attributed by name. Source source/west-2008-ibn-al-nafis added to the connection (it is cited by the record). Evidence rows updated.
- c-1, invention/balance-of-wisdom (FIX). en: "Robert Hall, in the record, describes" -> "Robert Hall describes"; ar: "يعرض السجل، عن روبرت هول، ميزان" -> "يعرض روبرت هول ميزان"; ur: "ریکارڈ، رابرٹ ہال کے حوالے سے، الخازنی کے ترازو کو" -> "رابرٹ ہال الخازنی کے ترازو کو".
- e-1, concept/shirb-water-rights (FIX). en: "The record on shirb ... draws on the Kuwaiti fiqh encyclopedia. It sorts ... When water is short, the one first ... has priority, but ... Cleaning public canals is paid ..." -> "The Kuwaiti Encyclopedia of Fiqh (al-Mawsu'a al-Fiqhiyya al-Kuwaitiyya), on shirb, ... sorts waters ... and says public water ... belongs to all. It states that when water is short ... and that cleaning public canals is paid ...". ar and ur changed the same way (the encyclopedia is the subject of each verb). Jurists: the record attributes the priority, drink-before-land and canal-cleaning clauses to the encyclopedia without naming a school (it names Malikis/Shafi'is/Hanafis/Hanbalis only for spring ownership and sale of the right, which the card does not state), so none is named.
- E2.7 processing half: the expectation is one sentence ("explain how municipalities process water and manage water usage") that cannot be split without breaking byte-identity with the official text, so it stays in the lesson and is not moved to the gap register; the Brief already says the museum holds nothing on treating water.
- Verdicts judged wrong and not applied: none.
