# Run log: ca-on-g5-math
Start 2026-11-12T06:32Z. End 2026-11-12T06:41Z.

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Math - Grade 5", archive slug `ontario-math-g5`, subject `course/ca-on-g5-math`, grade `course/ca-on-g5`, jurisdiction `course/ca-on-english`.

## Steps
- 06:32Z read runbook and fleet prompt. `fetch_ontario.py --list "Grade 5"` found "Math - Grade 5".
- 06:32Z fetched: 6 strands, 12 overall, 51 specific expectations. Source id from `ontario_source.py ontario-math-g5`: `source/ontario-curriculum-elementary-mathematics` (reused, not edited).
- 06:33Z to 06:38Z searched by topic (about 35 spellings, run in parallel into files) and read briefs of the candidate records.
- 06:38Z to 06:40Z wrote the generator (outside the repository, in the scratchpad), the records, prose, gap register and evidence.
- 06:40Z gate GREEN; cite-check 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g5-math-b-1 | Numbers that take their value from their place | B1.1, B1.5 |
| ca-on-g5-math-b-2 | Multiplying with complements to ten | B2.1 |
| ca-on-g5-math-c-1 | Finding the unknown | C2.1, C2.3 |
| ca-on-g5-math-c-2 | Ordered steps and the word algorithm | C3.1 |
| ca-on-g5-math-e-1 | Kinds of triangle and their area | E1.1, E2.5 |
| ca-on-g5-math-f-1 | Debts, and moving a debt to someone else | F1.1, F1.4 |
| ca-on-g5-math-f-2 | Two early taxes and what they were for | F1.6 |

Strands B, C, E and F have a unit; strands A and D have none (A has no specific expectations; D is entirely in the gap register). 11 of the 51 specific expectations are in lessons; 40 are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B1.1 / invention/algorism: read and compose whole numbers by place; the record shows nine numerals and a zero with each place taking its value from its position.
- B1.5 / invention/decimal-fractions-al-uqlidisi: read and represent decimals up to hundredths; the record shows a half as five tenths and half of that as twenty-five hundredths in an early treatment.
- B2.1 / invention/abu-wafa-debt-multiplication: use relationships between operations to solve and check; the record shows multiplying 3 x 5 through complements and a subtraction. It does not show two-digit factors, so B2.6 is not claimed.
- C2.1, C2.3 / invention/algebra: translate relationships into equations and solve for an unknown; the record shows the art of finding an unknown number from known ones through an equation. It has no inequalities or expression evaluation (C2.2, C2.4 are gaps).
- C3.1 / invention/algorism: write programs of ordered steps; the record shows ordered steps of written arithmetic and the origin of the word algorithm. It holds no code. The Brief says so in plain words. This is the weakest link of the run; a reviewer may prefer it moved to the gap register.
- E1.1, E2.5 / concept/ilm-al-misaha: name triangle kinds and develop the area of a triangle; the record names right, acute and obtuse and gives height times half base with a worked 13-14-15 example. It does not derive the formula from rectangles or parallelograms (Brief leaves the derivation to the class).
- F1.4 / concept/dayn-fiqh: explain debt; the record defines a debt in the jurists' term and what it attaches to.
- F1.1 / concept/hawala-debt-transfer: describe ways money moves among people; the record shows a debt moving from one person's liability to another's among three parties. It is the transfer of a debt, not of cash.
- F1.6 / concept/kharaj, concept/zakat: describe taxes and what they pay for; the records show a land tax with a register and a wealth levy with a threshold and eight categories of recipients. They do not say which services kharaj paid for, and Canada's taxes are for the class (Brief says so).

## Judgement calls
- Connection kinds: `invention` for concept records (hawala, debt, mensuration) and `story` for kharaj and zakat; the closed list has no better fit.
- The algorism record serves two lessons (b-1 and c-2) with different sentences; no sentence is reused.
- Left out: concept/kharaj-bil-daman and the other kharaj records were not read; invention/kashi-muqarnas-mensuration (area of ceiling cells) does not give the parallelogram or triangle area formula; concept/girih and concept/islamic-geometric-patterns are short overviews with no construction to restate (patterns and transformations are gaps).
- Record faults noticed: the record concept/zakat English says "a tenth on rain-fed crops and half on irrigated" where the Arabic says "its half" for irrigated crops; no clause about it was used. The Arabic of invention/decimal-fractions-al-uqlidisi writes the year "341/952–953" without an era; the connection text writes 341هـ/952–953م (Arabic) and 341ھ/952–953ء (Urdu).
- Urdu connection texts run past 80 words in five lessons (the English ones are all 40 to 80); the gate has no limit on this. Left as is.

## More lessons possible
- concept/kasr and records on inheritance shares (concept/ilm-al-faraid) could serve fractions (B1.3, B1.4, B2.5) if the inheritance records gained the shares as fractions; the record read says only "those with prescribed shares take their shares first" and gives no fractions.
- invention/kashi-muqarnas-mensuration for E2.6 after a reviewer checks the record's English (its first lines have run-together words).

## Proposals
- Connection kinds: a kind for a legal concept or institution (hawala, debt, mensuration as a chapter) and for a tax (kharaj, zakat): `institution` or `concept`.
- A coding or computational-thinking expectation (C3) needs a record on procedures, not only on the word algorithm; a harvest of the Banu Musa and al-Jazari programmable devices with a proper statement of what the sources call programmable would serve C3.2.

## Problems with the runbook
- None that cost time. `entity_brief.py` takes the `--full` flag after the id (before the id it is read as the id).

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-mathematics.md, section "Grade 5". Gate GREEN after the changes; cite-check 0 fail. The counts above ("11 of 51 in lessons, 40 in the register") are now 8 and 43.

- **b-1, invention/algorism (KEEP, with a FIX to the closing question).** Old: "What is the 5 worth in 5, in 50 and in 500?" (en); "كم تساوي الخمسة في 5 وفي 50 وفي 500؟" (ar); "5، 50 اور 500 میں پانچ کی قدر کیا ہے؟" (ur). New: "In the numbers 5, 50 and 500, what is the digit 5 worth in each?" / "في الأعداد 5 و50 و500، كم تساوي الخمسة في كل منها؟" / "اعداد 5، 50 اور 500 میں ہر ایک میں ہندسہ پانچ کی قدر کیا ہے؟". Note: the review says the Arabic omitted the first 5; the Arabic in the file did in fact contain it ("الخمسة في 5"), so the three already agreed in content; all three now use the same unrepeated form. The decimal-fractions card is unchanged (KEEP).
- **b-2, abu-wafa-debt-multiplication (REMOVE, c).** Lesson record and three prose files deleted; B2.1 moved to the gap register; evidence rows deleted. Unit b keeps b-1; its summary and prose now say one lesson, two expectations. Gap `why`/`searches` of B2.2, B2.3, B2.4, B2.6, B2.7 that said "used in b-2 for B2.1" now say the record was tried and not used.
- **c-1, invention/algebra (FIX).** Old clause (en): "He reduced every problem to three kinds of term and six types of equation. What is the unknown in an equation you can solve?" -> "The TDV biography of al-Khwarizmi describes his drawing with squares and rectangles as a geometric representation and verification of the solution, and TDV notes that his algebra was wholly in words, with no symbols. How could you show the same unknown in words, in a drawing and in symbols?" Arabic: the "three kinds ... six types" clause -> the TDV biography's description of the squares and rectangles drawing, and "جبره كله بالكلمات بلا رموز"; Urdu the same in Urdu. Sources gain source/tdv-harizmi and source/tdv-cebir (both cited by the record). Brief rewritten in all three languages (it described "the story of how algebra got its name and its first book", a superlative the card no longer carries). Evidence rows for the cut clause replaced by four rows (representation, all-words; en and ar).
- **c-2, algorism (REMOVE, b).** Lesson and prose deleted; C3.1 moved to the register. Unit c keeps c-1; summary and prose updated. The register's C3.2 search line "used in c-2 for C3.1" now says "tried for C3.1 and not used".
- **f-1, concept/dayn-fiqh (FIX).** Old (en): "A debt in the jurists' term is a binding right in the liability. It covers money and other things, such as a missed prayer or zakat. Debts attach to the debtor's liability, not to his property, except where secured by a pledge, where a bankrupt is under restraint, where a dying sick man is concerned, or where the estate is concerned." -> "The Kuwaiti encyclopaedia of jurisprudence records that a debt in the jurists' term is a binding right in the liability, and that debts attach to the debtor's liability, not to his property." Arabic and Urdu cut the same clauses (the missed prayer or zakat; the four exceptions) and gain the attribution to the Kuwaiti encyclopaedia (the card was unattributed). The closing question is kept. The hawala card is unchanged (KEEP). Evidence rows trimmed to match.
- **f-2, kharaj and zakat (REMOVE, b, both cards).** Lesson and prose deleted; F1.6 moved to the register. Unit f keeps f-1; summary and prose updated.
- Units a lesson is left in: b, c, e, f all keep one lesson, so no unit or subject record was deleted. Unit `expectations` (overall expectations B2, C3) left as they were; the gate passes.
- Verdicts not applied: none. Verdicts that changed nothing: e-1 (ilm-al-misaha, KEEP) and the hawala card of f-1 (KEEP).

Records for the founder: none found.
