# Run log ca-on-g3-social-studies

Start 2026-11-12T05:57Z. End 2026-11-12T06:04Z.

## Steps
- 05:57Z fetch: `fetch_ontario.py "SSHG - Grade 3"` failed (no course of exactly that name); the Ministry's name is "SSHG - Grade 3 (2023)". Fetched as archive slug `ontario-sshg-g3`: 2 strands, 6 overall, 34 specific expectations. Source record: `source/ontario-curriculum-sshg-2023` (from `ontario_source.py`).
- Plan: strand A (Communities in Canada, 1780-1850) is entirely about First Nations, Metis, Inuit and settler communities in Canada; the museum holds nothing on them, so it is wholly in the gap register and has no unit. Strand B has four honest lessons.
- Records: subject, one unit (B), four lessons.

## Lesson plan and the link sentence for each link
| Lesson | Expectation | Record | "The expectation asks the student to ___; this record shows ___." |
|---|---|---|---|
| b-1 | B1.1 | event/digging-of-nahr-al-ubulla | describe a connection between a natural feature and where a community lives; this record shows a creek of the Tigris and a canal dug to bring water to Basra. Partial: one medieval example, no Ontario region. |
| b-2 | B2.1 | concept/environmental-protection-in-islam | form questions about effects of land use on the environment; this record shows one author's view that pollution threatens people and that Islam asks for good use of the environment. Partial: a general text, no evidence, no region. |
| b-3 | B3.5 | concept/hima, concept/agriculture-in-islam | describe types of land use and the needs they meet; these records show land reserved for grazing animals of a village, and farmland as the source of food. Partial: two uses only. |
| b-4 | B3.7 | invention/tabula-rogeriana | construct maps with map elements and units; this record shows a medieval map with rivers, roads, harbours and distances in miles. Partial: a historical world map, not Ontario. |

Each Brief says plainly what the class must bring from elsewhere.

## Counts
Units 1, lessons 4, connections 5; expectations in lessons 4 of 34; in the gap register 30 of 34.

## Judgement calls
- B2.1 with the environmental-protection record is the thinnest link: the record is one author's reading with no data. Kept because the expectation is about forming questions and the lesson says so; flagged for the reviewer. B1.1 with the canal is also a single example.
- B3.2 (typography on political maps): tabula-rogeriana is a map but says nothing of lettering; gap.
- Strand A skills expectations (A2.x) name subject matter (challenges of communities in Canada), so they carry topic searches, not "none: skills expectation".

## More lessons possible
None found. If the museum gains records on Ontario regions, landforms, employment or Canada 1780-1850, the 30 gap entries are the places to look.

## Runbook problems
- The runbook example `fetch_ontario.py "SSHG - Grade 4"` omits the "(2023)" suffix that the Ministry's name carries for Grade 3; the fetcher needs the exact name from `--list`.
- `find_entity.py` and `entity_brief.py` printing "=========" in a zsh `echo` loop raises "not found" (shell issue, mine).

## Proposals
- Connection kind `story` is used for concept records (hima, agriculture, environmental protection); the closed list has no `concept` or `idea` kind.
- No Ontario or Canada geography records exist; a place/ontario and place/canada with prose would unlock B3.1, B3.3 and B1.x.

## Gates
- check_course strict --save: RESULT: GREEN (23 checks passed). Output at docs/courses/gates/check-ca-on-g3-social-studies.out.
- cite-check: 6 pass, 0 fail of 6 record(s).

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 3 social studies). Applied in all three languages. No connection was added.

- b-1 `event/digging-of-nahr-al-ubulla` (REMOVE, whole lesson): lesson record and its three prose files deleted, removed from the unit's `lessons:`, evidence rows deleted; B1.1 added to the gap register with the reviewer's reason (expectation text copied from the lesson record before deletion) and two search lines.
- b-2 `concept/environmental-protection-in-islam` (REMOVE, whole lesson): same; B2.1 added to the gap register.
- b-3 `concept/hima` (FIX): "the record says the Prophet reserved" -> "In Ibn Hisham's biography, when the people of Jurash embraced Islam, the Prophet reserved ..." (ar: "في سيرة ابن هشام"; the ur card already read "سیرتِ ابن ہشام کے مطابق"); cut "Whoever grazed his livestock there would have gained unlawfully" (ar: فمن رعى ماشيته فيه كان ماله سُحتًا; ur: جو وہاں اپنے مویشی چراتا اس کا مال ناجائز ٹھہرتا). The reserved pasture for the horse, camel and ox stays.
- b-3 `concept/agriculture-in-islam` (FIX): cut "Whoever revives dead land ... subject to the ruler's leave" (ar, ur likewise); kept farming as the source of food for people and animals, attributed to al-Maraghi.
- b-4 `invention/tabula-rogeriana` (REMOVE, whole lesson): same as b-1; B3.7 added to the gap register.
- The unit (`ca-on-g3-social-studies-b`) keeps one lesson (b-3), so the unit and subject stay; their summaries and prose now say "one lesson" in all three languages (were "four"). Older gap-register lines that said a record was "used in lesson B2.1" or "B3.7" now say it was tried and removed on review.
- Verdicts judged wrong and not applied: none.
