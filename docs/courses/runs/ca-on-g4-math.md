# Run log: ca-on-g4-math

Agent: Claude Code; claude-sonnet-5-5 (fleet run). Started 2026-11-12T06:32Z, finished 2026-11-12T06:43Z (`date -u`).

## Steps
- 06:32Z Step 0/1. Graph already built (fleet). `fetch_ontario.py --list "Grade 4"`: exact name "Math - Grade 4". Fetched to `.cache/curricula/ontario-math-g4/` (6 strands, 12 overall, 48 specific expectations; strand A has no specific expectations). Source record: `ontario_source.py ontario-math-g4` gave `source/ontario-curriculum-elementary-mathematics` (existing, uncommitted from another agent's run; not edited).
- 06:34Z Step 4, searches (run in parallel, 10 to 30 s each): algorism, decimal fractions, algebra, geometric patterns, symmetry, zakat, waqf, Banu Musa, fractions, money, weights, time, coordinates, probability, area, price, angle, automata, multiplication, graphs, likelihood, units, payment, saving, ratio, programming.
- 06:38Z Wrote records and prose with a generator script kept in the scratchpad (not in the repository); gap register and evidence written by hand/script.
- 06:42Z Gate: RESULT: GREEN (23 checks passed). cite-check: 12 pass, 0 fail of 12.

## Lesson plan (expectation codes)
| lesson | title | codes | records linked |
|---|---|---|---|
| b-1 | Reading numbers by their places | B1.1, B1.2, B1.3 | invention/algorism |
| b-2 | Tenths: parts of one | B1.7, B1.8, B1.9 | invention/decimal-fractions-al-uqlidisi |
| b-3 | The four operations, step by step | B2.4, B2.5, B2.6 | invention/algorism (two connections, different passages) |
| c-1 | Patterns that repeat | C1.1 | concept/islamic-geometric-patterns, concept/girih |
| c-2 | Finding the unknown number | C2.1, C2.2 | invention/algebra (two connections) |
| e-1 | Measuring a surface in squares | E2.5 | concept/ilm-al-misaha |
| f-1 | Earning, saving and giving | F1.3 | concept/kasb, concept/idkhar-fiqh, practice/sadaqa |

Counts: 4 units (B, C, E, F; strand A has no specific expectations so no unit), 7 lessons, 12 connections, 14 specific expectations in lessons, 34 in the gap register, of 48. Unit records hold the overall expectations of their strands (B1, B2, C1 to C4, E1, E2, F1).

## The link sentences ("The expectation asks the student to ___; this record shows ___")
- b-1 algorism: asks to read, compose and compare whole numbers; the record shows numerals written so that each place takes its value from its position (units, tens, hundreds, thousands).
- b-2 al-Uqlidisi: asks to read decimal tenths and match them with fractions; the record shows a half written as five tenths and half of that as twenty-five hundredths, with its limits stated.
- b-3 algorism (Ibn Khaldun passage): asks to add, subtract, multiply and divide with algorithms; the record gives the four operations as joining and separating and says Indian reckoning does them with numerals in their places. Second connection: B2.4 names "algorithms"; the record shows where the word comes from.
- c-1 patterns, girih: asks to identify and describe repeating patterns; the records show repeated patterns of stars and polygons. Weak records (one-sentence Wikidata summaries): the lesson says the museum offers repeating patterns only and not growing ones.
- c-2 algebra: asks to use symbols for unknowns and solve equations; the record shows algebra as finding an unknown from known numbers through an equation, and restoring/balancing as the two operations.
- e-1 mensuration: asks to measure rectangle area with rows and columns; the record shows area as "one by one" (a cubit by a cubit) and a side-two square as four such areas. Partial on purpose: the record gives no rectangle rule, so E2.6 is in the register.
- f-1 kasb, idkhar, sadaqa: asks to explain earning, saving and donating and the factors to weigh; the records show jurists' rulings and views on each. Spending and investing have no record, said in the Brief.

## Judgement calls
- Coding (C3.1, C3.2) went to the register: automata records do not support writing or altering code. The word "algorithm" is used only under B2.4, whose own text says "including algorithms".
- invention/algorism is linked in b-1 and b-3 (three connections) because it is the only record on written number work; each connection restates a different passage. A reviewer may judge this thin and fold b-1 and b-3.
- F1.3 lesson draws on fiqh rulings (kasb, idkhar). They are described and attributed ("the jurists' ruling", "the majority", "Abu Dharr held"), with no verdict.
- Only F1.3 is taught of the financial strand; F1.4 (spending vs saving) is in the register because the saving record does not compare.
- Considered and rejected: concept/tasir-price-fixing and invention/hisba for F1.5; event/hajjaj-mint-reform for F1.1; concept/maysir and concept/nard for probability; invention/kashi-muqarnas-mensuration for area (a ceiling-surface method, text with run-together spacing); concept/ilm-al-faraid for fractions (no fraction stated in its prose).
- Connection `kind` for fiqh concepts: `reflection` (nearest); for al-Khwarizmi's mensuration and algebra: `invention`; for geometric patterns: `object`; for kasb: `career`.
- Dates: al-Uqlidisi's date is omitted from the connection because the record's text writes the dates with missing spaces (341/952–953 run together).
- Record wording differences noted: algebra English says "three kinds of term", Arabic "three kinds of number"; al-Uqlidisi Arabic "half of one" vs English and Urdu "a half". The texts follow each language; evidence file notes both.

## Runbook problems that cost time
- `entity_brief.py --full` is not accepted before the id (`--full` after it works: the runbook writes `add --full` without saying where). `invention/algorism --full` printed 69 KB; I read it truncated.
- zsh: `echo ====` fails (`= not found`); not the runbook's fault.
- Step 6 says the unit and subject prose is one `## Brief`; ok. The runbook does not say what to do with a strand that has overall expectations but no specific ones (strand A here): I made no unit for it.
- The unit `expectations:` rule ("overall") collides with an overall expectation whose official text ends in explanatory paragraphs (C4); `quote_official` cut it at 40 words, translated as a cut text.
- The `quote_official` text for lesson expectations is almost always the whole official text here (no examples, under 40 words), so 22 of 23 entries were byte-identical to the official text.

## More lessons possible
None beyond those written; the unmatched expectations are in the gap register. If a reviewer accepts a thin link, B1.4 to B1.6 could take a fractions lesson on al-Uqlidisi's half-and-tenths, and E1.1 to E1.3 a lesson on girih tiles.

## Proposals
- Connection kinds: the closed list has no `concept` or `science`; fiqh concepts are filed under `reflection` and mensuration under `invention`.
- A way to mark a record as "thin" (one-sentence summary only) so a connection can be flagged to reviewers.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/sweep-mathematics.md, section "Grade 4". The three languages were changed together.

- **b-1 (algorism, KEEP)**: connection unchanged. The review says B1.2 and B1.3 (compare, round) are not served: both moved to the gap register (text copied exactly). The lesson keeps B1.1; its summary (en, ar, ur) and Brief/Try-this no longer mention comparing, ordering or rounding.
- **b-2 (al-Uqlidisi, KEEP)**: connection unchanged. B1.8 (rounding decimals) is not served: moved to the gap register. B1.7 and B1.9 stay; summary and prose no longer mention rounding.
- **b-3 "after" (algorism, FIX)**: "From it the West learned arithmetic" -> "The editors of the Cairo edition of his algebra say that Westerners learned arithmetic from this Latin translation and from books built on it" (ar: "ويقول محققا طبعة القاهرة ... إن الغربيين تعلموا الحساب من هذه الترجمة اللاتينية ومن كتب بُنيت عليها"; ur: "قاہرہ ایڈیشن کے مدیر کہتے ہیں کہ مغربیوں نے حساب اسی لاطینی ترجمے اور اس پر بنی کتابوں سے سیکھا"). Evidence row rewritten. The "within" card is KEEP, unchanged.
- **c-1 islamic-geometric-patterns (REMOVE)**: connection deleted, the sentence naming it removed from the three prose files (Brief now says one record; Try-this links girih only), evidence row deleted. The girih card (KEEP) stays and is now the lesson's single connection (position set to `within`). C1.1 is still served by girih for repeating patterns; the Brief already says growing patterns are the class's.
- **c-2 algebra "within" (FIX)**: "reducing every problem to three kinds of term and six types of equation" -> "TDV adds that his algebra was wholly in words, with no symbols" (ar: "وتضيف موسوعة TDV أن جبره كله بالكلمات بلا رموز"; ur: the same, naming TDV). `source/tdv-cebir` added to that connection's sources (the record cites it for the sentence). Evidence row replaced. The "after" card is KEEP, unchanged.
- **f-1 kasb (REMOVE)**: connection deleted; the Brief now says the museum has records on two of the five (saving, donating) and that earning, spending and investing are the class's; the Try-this link removed in all three prose files; evidence rows deleted. The Brief gains one sentence that the records describe the history of a view, not financial or religious guidance.
- **f-1 idkhar-fiqh (FIX)**: cut the majority-permit, Sa'd ibn Abi Waqqas and Abu Dharr clauses in all three languages; the card keeps the definition ("putting a thing aside for the time of need", the jurists keep to this sense) and the closing question. Two evidence rows deleted.
- **f-1 sadaqa (FIX)**: the card now opens "The Kuwaiti encyclopaedia of jurisprudence, as the record gives it, defines sadaqa ..." and "It adds that sadaqa aids the weak ..." (ar: الموسوعة الفقهية الكويتية; ur: کویتی فقہی انسائیکلوپیڈیا). Evidence rows reworded.
- F1.3 stays in f-1: saving and giving are served; earning, spending and investing have no record (said in the Brief). The lesson label and summary, which follow the expectation, were left as they were.

Verdicts not applied: none. e-1 (KEEP) and the KEEP connections were left unchanged.

Records for the founder: none new.
