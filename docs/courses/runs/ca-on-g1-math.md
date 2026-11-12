# Run log: ca-on-g1-math

Started: 2026-11-12T06:33Z (date -u). Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph prebuilt; no validate).

## Steps
- 06:33Z `fetch_ontario.py --list "Grade 1"`: exact name "Math - Grade 1". Fetch ok: 6 strands (A has 1 overall, 0 specific; B 13; C 9; D 7; E 8; F 1) = 38 specific expectations, all coded.
- Source: `ontario_source.py ontario-math-g1` returned source/ontario-curriculum-elementary-mathematics (reused or made by the tool).
- 06:35Z-06:38Z search phase (find_entity.py run six and then twenty-two searches in the background, about 60 s and 100 s). entity_brief read for hijri-calendar, algorism, islamic-geometric-patterns, arabesque, abd-al-malik-coinage, qibla, samt, dinar, mizan (partly).
- 06:41Z gate GREEN, cite-check 0 fail.

## Plan and links
| lesson | title | expectations |
|---|---|---|
| ca-on-g1-math-b-1 | Writing numbers by their places | B1.1, B1.2 |
| ca-on-g1-math-b-2 | Joining and separating numbers | B2.1, B2.4 |
| ca-on-g1-math-c-1 | Patterns that come back | C1.1, C1.2, C1.3 |
| ca-on-g1-math-c-2 | Steps in order: where the word algorithm comes from | C3.1, C3.2 |
| ca-on-g1-math-e-1 | Reading a calendar | E2.3 |

"The expectation asks the student to ___; this record shows ___":
- b-1 / invention/algorism: read and represent whole numbers to 50 and compose/decompose them; the record shows numbers written with nine numerals and a zero where each place has its value by position (units, tens, hundreds).
- b-2 / invention/algorism: use addition and subtraction and their link to solve and check; the record gives Ibn Khaldun's naming of joining and separating (add/subtract, multiply/divide). Modest link: it names the operations, it does not state their inverse relation. Flagged for the reviewer.
- c-1 / concept/islamic-geometric-patterns and concept/arabesque: identify, describe, create and extend patterns; the records show repeated stars, polygons and grids, and networks of interlacing circles, triangles and squares. Both records are thin (the first cites only Wikidata).
- c-2 / invention/algorism: write and read code made of sequential steps; the record shows reckoning by ordered steps and the origin of the word algorithm. Weak link: the museum offers only the history of the word, and the lesson Brief says so. Flagged for the reviewer.
- e-1 / concept/hijri-calendar: read a calendar and find days, months, holidays, seasons; the record shows a lunar calendar fixing Ramadan, Hajj and feasts, about eleven days shorter than the solar year so its months move through the seasons.

Considered and rejected: person/dinar (a man of Nihawand, not a coin) and event/abd-al-malik-coinage (Islamic coins, not Canadian) for F1.1; concept/mizan (law of weights) for E2.1/E2.2; concept/qibla and concept/samt (direction of prayer, legal records) for E1.4/E1.5; concept/mirath and concept/ilm-al-faraid (law of inheritance shares) for B1.6 to B1.8; invention/algebra and concept/al-durub-al-sitta for C2; maysir and nard (games of chance in law) for D2.

## Counts
Units 3 (B, C, E), lessons 5, connections 6, expectations in lessons 10, in the gap register 28, of 38 specific. Strands A, D and F have no unit (A has no specific expectations; D and F wholly registered).

## Record disagreements and judgement calls
- Hijri calendar: the English record says "the two festivals" in its Overview and "feasts" elsewhere, the Arabic says "الأعياد" (no number); I wrote "feasts" / الأعياد / عیدوں, which all three say.
- "About eleven days": the record's Scholars section (uncited in-line) and Zaghloul El-Naggar (cited) both say eleven days; connection cites tarikh-khulafa-minhaj-1434 and assabile-zaghloul-el-naggar.
- Algorism record: the sentence "by ordered steps" is in the record's summary, not in an in-line citation; connection cites the sources the record cites for the surrounding text.
- Arabic record for arabesque says "بطون عقود" and English "arch soffits": used each in its language. I did not say "Cairo" (the building link is the Mosque of Ibn Tulun only).

## Problems with the runbook / tools
- The runbook says a lesson groups two to four expectations; e-1 holds one (E2.3), because no other Strand E expectation has a record. Kept at one.
- Elementary mathematics has an overall expectation (C4) whose text is over 40 words only because the service puts the whole description in one field; quote_official cuts it with " …" and I translated the visible part.
- Strand A (social-emotional learning) has an overall expectation and no specific ones: nothing for the register or a lesson; the runbook does not say what to do with such a strand. I left it out.
- Wasted time: none significant. find_entity.py run in the background worked.

## Proposals
- Connection kinds: a calendar and an art form have no kind; I used `invention` for concept/hijri-calendar and `object` for patterns.
- Concepts such as the Hijri calendar are `concept` class records; the kind list is for the connection, so no schema change is needed beyond a `concept` or `institution` kind.

Ended: 2026-11-12T06:42Z (gate GREEN, 23 checks; cite-check 9 pass, 0 fail of 9).

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-mathematics.md, section "Grade 1". Applied by a fix agent, 2026-11-12.

- ca-on-g1-math-b-1 (invention/algorism; B1.1, B1.2): REMOVE. Lesson, its three prose files and its evidence rows deleted; B1.1 and B1.2 added to the gap register (record is a history of Indian numerals to thousands, far above counting to 50).
- ca-on-g1-math-b-2 (invention/algorism; B2.1, B2.4): REMOVE. Lesson, prose and evidence rows deleted; B2.1 and B2.4 added to the register. Unit ca-on-g1-math-b was then left with no lesson: unit record and its three prose files deleted, removed from the subject's `lessons:`; the subject's summaries (en, ar, ur) now say strands C and E only, and the subject Brief no longer names Number.
- ca-on-g1-math-c-2 (invention/algorism; C3.1, C3.2): REMOVE. Lesson, prose and evidence rows deleted; C3.1 and C3.2 added to the register. Unit C summary (en/ar/ur) and Brief rewritten: "Patterns, and steps in order as in code (C1.1 to C1.3, C3.1, C3.2)" -> "Making patterns from shapes (C1.2)"; the Brief no longer mentions the word algorithm.
- ca-on-g1-math-c-1:
  - concept/islamic-geometric-patterns: REMOVE (one-sentence record, cited only to Wikidata). Connection "Stars and polygons that repeat" and its evidence row deleted.
  - concept/arabesque: FIX. en: "the arch soffits of the Mosque of Ibn Tulun, where vine leaf, acanthus, palmettes and rosettes fill networks ... in a resolution of organic and geometric form" -> "the undersides of the arches of the Mosque of Ibn Tulun, where a vine leaf and other plant forms fill networks of interlacing circles, triangles and squares". ar: "بطون عقود ... ورقة العنب والأقنثا والمراوح والوريدات ... في توازن بين الشكل العضوي والهندسي" -> "بطون عقود ... ورقة العنب وأشكال نباتية أخرى ... والمربعات". ur: "انگور کا پتا، اکینتھس، پنکھے اور گلاب ... نامیاتی اور ہندسی شکل میں ہم آہنگی" -> "انگور کا پتا اور دیگر نباتاتی شکلیں ... جال کو بھرتی ہیں". Evidence row rewritten.
  - Expectations C1.1 and C1.3 are no longer served: moved to the register; the lesson serves C1.2 only. Lesson summary (en/ar/ur), Brief, section question and Try this rewritten to C1.2 only ("What is the rule that keeps this pattern going?" -> "How can the same pattern be made in another way?"; Try this now points to the arabesque record, not the geometric-patterns record).
- ca-on-g1-math-e-1 (concept/hijri-calendar): KEEP, unchanged.
- Gap register: eight entries added (B1.1, B1.2, B2.1, B2.4, C1.1, C1.3, C3.1, C3.2), text byte-identical to the lesson expectation `en`; older search strings that said "taught in lessons b-1, b-2 and c-2" or named the geometric-patterns record as taught in c-1 were corrected to say they were removed.
- Verdicts judged wrong and not applied: none.

### Records for the founder
- concept/islamic-geometric-patterns is a one-sentence record cited only to Wikidata; it needs a source-backed description before any lesson can use it.
