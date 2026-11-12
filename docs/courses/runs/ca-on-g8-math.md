# Run log: ca-on-g8-math
Start 2026-11-12T06:26Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Math - Grade 8", archive slug `ontario-math-g8`, subject `course/ca-on-g8-math`, grade `course/ca-on-g8`, jurisdiction `course/ca-on-english`.

## Steps
- 06:26Z read the runbook and fleet prompt; `fetch_ontario.py --list "Grade 8"` found "Math - Grade 8".
- 06:27Z fetched: 6 strands, 12 overall, 44 specific expectations. Source id from `ontario_source.py ontario-math-g8`: `source/ontario-curriculum-elementary-mathematics` (reused, not edited).
- 06:28Z to 06:36Z searches (spellings in the gap register) and briefs of candidate records.
- 06:37Z generator (outside the repository) wrote the records, prose, gap register and evidence; gate GREEN on the first run; cite-check 0 fail.
- Finished 06:38Z.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g8-math-b-1 | Places, tenths and the Indian numerals | B1.4, B2.3 |
| ca-on-g8-math-b-2 | Roots, and numbers that never end | B1.2, B1.3 |
| ca-on-g8-math-b-3 | When are two ratios the same? | B2.8 |
| ca-on-g8-math-c-1 | Restoring and balancing an equation | C2.3 |
| ca-on-g8-math-d-1 | Counting letters to read a hidden message | D1.1, D1.6 |
| ca-on-g8-math-e-1 | Stars and polygons that fill a wall | E1.1 |
| ca-on-g8-math-e-2 | Measuring land, circles and ceilings | E2.3 |
| ca-on-g8-math-f-1 | Paying across distance | F1.1 |
| ca-on-g8-math-f-2 | Interest, delay and long-term plans | F1.4, F1.6 |

Strand A (Social-Emotional Learning) has one overall expectation and no specific ones, so it gets no unit. The other 31 specific expectations are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B1.4, B2.3 / algorism: use fractions and decimals flexibly and move digits by powers of ten; the record shows place value, each place worth its position, in a decimal system with nine numerals and a zero.
- B1.4 / decimal-fractions-al-uqlidisi: use fractions and decimals interchangeably; the record shows a half as five tenths and half of that as twenty-five hundredths. Percents are not in the record; the Brief and Try this leave percents to the class.
- B1.2, B1.3 / kashi-general-root-extraction: estimate and calculate roots; the record shows root extraction as the reverse of raising to a power, with approximation when the answer is not whole. Square roots are named only as a special case.
- B1.2 / abu-kamil-irrational-coefficients: describe and compare rational and irrational numbers; the record separates an irrational solution from an irrational coefficient.
- B2.8 / mahani-successive-quotient-ratios: compare proportional situations; the record shows a definition of when two ratios are equal. Unknown values are not served; the Brief says so.
- C2.3 / algebra, al-durub-al-sitta, al-jabr-wal-muqabala: solve equations with several terms and verify; the records show restoring and cancelling on both sides, six types with worked examples, and the book's purposes.
- D1.1, D1.6 / frequency-analysis-al-kindi: tell one-variable data from two-variable data and challenge conclusions; the record shows counts of one variable (letters), and that a short sample may depart from the norm. Partly served: no graphs, no scatter plots.
- E1.1 / islamic-geometric-patterns, girih: identify properties of shapes that tessellate; the records show stars and polygons built from lines, resting on tiles. Both records are one short paragraph; the Brief says the class brings the shapes.
- E2.3 / ilm-al-misaha, al-kashi-pi-calculation, kashi-muqarnas-mensuration: solve measurement problems with formulas; the records show the chapter's area, circumference and volume rules, a decimal value of twice the circumference ratio, and a surface measured as a sum of module counts.
- F1.1 / al-sakk-wal-hawala: methods of payment across currencies; the record shows payment by a bill drawn on a distant agent. Currencies and exchange rates are not in the record; the Brief says so.
- F1.4, F1.6 / riba-fiqh: explain the impact of interest and compare credit terms; the record shows the jurists' definitions of excess on a debt for delay and the reasons commentators gave. The calculations and offers are for the class.

## Judgement calls
- B1.1 (scientific notation) is in the register: the place-value records say nothing on very large and small numbers.
- B2.8: Mahani's record is a definition of equal ratios by quotient sequences, not unit rates; the lesson claims only that and its Brief leaves the unknown values to the class.
- E2.4 (Pythagorean relationship) is in the register: concept/ilm-al-misaha classifies triangles and finds the height of a 13, 14, 15 triangle by al-jabr, but states no Pythagorean relationship, so I did not link it.
- D1.1, D1.6 is the weakest lesson: frequency analysis is one-variable counting, not a scatter plot; the Brief keeps its claim to "careful conclusions from a small sample". A reviewer may prefer to move D1.1, D1.6 to the register.
- F1.4, F1.6 / riba-fiqh: written as the jurists' definition and the reasons commentators gave, attributed, with no verdict. The Qur'an, Sunna and consensus are named only as the record names them.
- Connection kinds: `reflection` for concepts (algebra, al-durub-al-sitta, patterns, girih, mensuration, riba), `invention` for methods and for the sakk and hawala instruments, `story` for the book.
- The Arabic of the Uqlidisi connection writes the year as 341هـ/952–953م; the record's Arabic has no era marks.
- Urdu was written for every text, including lessons, units and subject.
- Gap searches: those marked "no real record" are searches I ran with the spellings shown; the unrelated hits are named in the entry.

## Failures and runbook problems
- None in the gate (GREEN on the first run).
- `find_entity.py` with several spellings takes 30 to 100 seconds; ran 20 searches in parallel with output to files.
- macOS `sed -i` does not take a path that starts with `/private/tmp/...` after the expression as GNU does (it read the path as a label); I used the Edit tool.

## More lessons possible
- concept/idkhar-fiqh (rulings on saving and storing wealth) could be offered against F1.2 (a financial plan toward a long-term goal) if the founder accepts a legal ruling on saving as a plan-related record; I did not.
- invention/khayyam-geometric-cubics and work/al-muadalat-sharaf-tusi could join C2 as a second equations lesson, but cubic equations are beyond C2.3.
- concept/dhira-fiqh (cubit) could be a link for a measurement lesson in E2 if the founder wishes to count a unit of length as a measurement record.
- concept/zakat, concept/kharaj and concept/jizya (levies) could be offered against F1.2 (tax implications) as a record of how a state took revenue, not household tax.
- invention/hisba, concept/hisba and concept/khiyar-fiqh could be offered against F1.5 as records of market supervision and of the right to annul a contract, not of sales or loyalty programmes.

## Proposals
- Connection kinds: no `concept`, `method` or `document` kind (concepts filed under `reflection`; the sakk and hawala under `invention`; a book under `story`).
- Runbook: say that find_entity.py hits that differ only by a shared word (dinar as a name, "lot" in Lut) are noise; a fleet agent should skim the first screen of results only.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g8-math-d-1, KEEP-BUT-FIX.** D1.6 moved from the lesson to the gap register (reason: letter counts are one-variable data; the record has no scatter plot, second variable or misleading graph). Summary and Brief now say D1.1 only. Brief gains: "Letter counts are one-variable data; the record has no scatter plot or second variable." and no longer promises that the student will analyse data sets by challenging preconceived notions and drawing conclusions. The card and the sample-size question are unchanged.
- Not applied: none.

Review: docs/courses-mission/verifier/sweep-mathematics.md (section "Grade 8"). Each change is made in en, ar and ur so the three still say the same. Lesson d-1 was reviewed earlier and is untouched.

## Corrections after the fleet review

- **ca-on-g8-math-b-1, REMOVE.** Whole lesson deleted (record, three prose files, entry in unit b's `lessons:`). Both cards went: invention/algorism (the 208-to-280 digit move is not multiplication by ten) and invention/decimal-fractions-al-uqlidisi (half of a half in hundredths is a Grade 4 task; no percents or powers of ten). B1.4 and B2.3 are in the gap register; evidence rows deleted.
- **ca-on-g8-math-b-3, REMOVE.** Whole lesson deleted. invention/mahani-successive-quotient-ratios defines ratio through successive quotient sequences (continued fractions), far above Grade 8, and determines no unknown values. B2.8 is in the gap register; evidence rows deleted.
- **ca-on-g8-math-c-1, REMOVE one card.** The "after" connection on work/al-jabr-wal-muqabala was deleted (the preface's list of needs solves and verifies no equation). The cards on concept/algebra and concept/al-durub-al-sitta stay and C2.3 remains served. The Brief said "three cards" in all three languages; it now says two cards (algebra; the types of equation in the Book of al-Jabr and al-Muqabala). The prose named no other sentence about the removed record. Evidence row deleted.
- **ca-on-g8-math-e-1, REMOVE one card.** The "before" connection on concept/islamic-geometric-patterns was deleted (one sentence of record, nothing on shapes, symmetry or transformations). The girih card stays. The Brief said "two short cards on Islamic geometric patterns and girih"; it now says one short card, on girih, and "Try this" links only girih (en, ar, ur). E1.1 remains served by girih for the tessellating-shapes half; the transformations half is not served by any record and is a gap: the expectation was not split, as instructed. Evidence row deleted.
- **ca-on-g8-math-f-1, REMOVE.** Whole lesson deleted. concept/al-sakk-wal-hawala has cheques and bills of exchange within one realm, no currency and no exchange rate. F1.1 is in the gap register; evidence rows deleted.
- **ca-on-g8-math-f-2, REMOVE.** Whole lesson deleted. concept/riba-fiqh is the jurists' prohibition and reasons; a religious ruling is not an interest calculation or a comparison of credit offers. F1.4 and F1.6 are in the gap register; evidence rows deleted.
- **Unit f (ca-on-g8-math-f), removed.** Both its lessons went, so the unit record and its three prose files were deleted and it was removed from the subject's `lessons:`. Its overall expectation F1 lived only on the unit record and is not a specific expectation, so the gate needs no register entry for it (the gate checks specific codes only); F1.1 to F1.6 are all in the register. Unit b stays (b-2 remains); its summary and prose now describe one lesson.
- **Subject and stale text.** The subject summary and prose said "five strands, nine lessons"; they now say four strands and five lessons (b-2, c-1, d-1, e-1, e-2). Gap-register entries that cited a removed lesson ("used in lesson b-1", "b-3", "f-2", the geometric-patterns record at e-1) were reworded to say the record was tried at a lesson that was removed.
- **Not applied:** none. No FIX verdicts in this grade; e-2 unchanged; b-2 unchanged.

Note on a possibly better record for B2.8 (not added, as instructed): the reviewer noted that concept/rule-of-three-muamalat ("three known and one unknown") looks like a better fit for proportional reasoning and finding an unknown value than the Mahani record, but did not check it. It has not been read or linked here; a later pass should open it with entity_brief.py and judge whether it can carry B2.8 (it would also need to pass "Fit the grade").

## Records for the founder
- None found in this pass (no museum record outside data/course and content/*/course was edited).
