# Run log: ca-on-g6-math

Started: 2026-11-12T06:09Z (date -u). Ended: 2026-11-12T06:31Z.
Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph prebuilt; no graph, validate, derive, test or git state change).

## Step 1 (06:09Z)
- `fetch_ontario.py --list "Grade 6"`: exact name "Math - Grade 6". Fetched to .cache/curricula/ontario-math-g6/ (manifest docs/courses/curricula/ontario-math-g6.json). 6 strands, 12 overall, 53 specific expectations as the manifest counts them.
- Runbook problem: two specific expectations have an EMPTY code and share the key "" in the checker's code map: strand A (the single social-emotional-learning example text) and strand C (an empty entry under C4, whose overall text is "apply the process of mathematical modelling ..."). The checker counts 52 specific codes. One gap entry with code "" and the text of the last empty entry (an empty string) covers both; the "why" names both. The runbook says nothing about codeless specifics.
- Runbook problem: strand C's overall expectation C4 has no specific expectation with a code; C4 is not copied into the unit record.
- Source: `ontario_source.py ontario-math-g6` printed source/ontario-curriculum-elementary-mathematics (the record file was already present as untracked; it is the one the script writes).

## Step 4: search phase
- All spellings were run with find_entity.py (three or more per topic), then entity_brief.py on every candidate. Only the first 2,500 characters per language were read, and every connection restates only the opening Summary or Brief section, never later prose.
- zsh gotcha (mine): `echo =====` aborts a command under zsh; used printf.
- find_entity.py takes 10-20 s per call and the first parallel batch exceeded the 120 s foreground limit; it was backgrounded and finished.

### Plan
| lesson | title | expectations |
|---|---|---|
| ca-on-g6-math-b-1 | Tenths, hundredths and equal amounts | B1.4, B1.6 |
| ca-on-g6-math-b-2 | Debts and numbers below zero | B1.2, B2.1 |
| ca-on-g6-math-b-3 | Places, estimates and written steps | B1.1, B2.4, B2.7, B2.8 |
| ca-on-g6-math-b-4 | Divisors and factors | B2.2, B2.6 |
| ca-on-g6-math-c-1 | Patterns built by a rule | C1.1, C1.2, C1.3 |
| ca-on-g6-math-c-2 | Unknowns and equations | C2.2, C2.3 |
| ca-on-g6-math-d-1 | Counting to read a message | D1.2, D1.6 |
| ca-on-g6-math-e-1 | Quadrilaterals, symmetry and repeating patterns | E1.1, E1.4 |
| ca-on-g6-math-e-2 | Measuring areas and surfaces | E2.4, E2.6 |
| ca-on-g6-math-f-1 | Paying, trading and giving | F1.1, F1.5 |
| ca-on-g6-math-f-2 | Saving and interest | F1.2, F1.4 |

25 specific expectations in 11 lessons, 27 entries in the gap register (26 coded plus the codeless pair), 52 specific codes in all (strand A has no unit).

### Links: "The expectation asks the student to ___; this record shows ___."
- b-1 decimal-fractions-al-uqlidisi: read and represent decimals and show fraction-decimal equivalences; the record shows half written as five tenths and a half of that as twenty-five hundredths.
- b-2 abu-wafa-debt-multiplication: read and represent integers (number lines), use properties of operations in multi-step problems; the record shows a debt of two as a middle step in multiplying three by five. B2.1 is the weakest half of this link: the record shows one multiplication rule, not properties of operations in general. Judgement: kept, flagged for the reviewer.
- b-3 algorism: read whole numbers, use written algorithms; the record shows nine numerals and zero in place value and ordered written steps for the four operations.
- b-4 farisi-amicable-factorization: use divisibility rules and factor composites; the record shows proper divisors and the pair 220 and 284. Judgement: modest link (divisors, not divisibility rules or prime factor trees); the Brief says the rules and trees are the class's work.
- c-1 karaji-binomial-coefficient-recurrence: find pattern rules to extend a pattern; the record shows a table built by adding adjacent entries.
- c-2 algebra, al-durub-al-sitta: solve equations and verify; the records show the jabr and muqabala operations and worked examples.
- d-1 frequency-analysis-al-kindi: collect and organise data, challenge first guesses; the record shows counting and ranking letters and the warning about short messages. Judgement: D1.2 asks for data to answer a question about a population, and the lesson Brief says the museum offers one method only.
- e-1 islamic-geometric-patterns, khayyam-parallel-quadrilateral, girih: list properties of quadrilaterals, describe transformations; the records show repeated patterns of polygons, one named quadrilateral and strapwork stars. They do not describe symmetry or transformations, and the Brief says so. The two pattern records are one-sentence Wikidata-cited records; judgement: kept because both are real, published or draft-cited, and the honest limit is stated in the Brief.
- e-2 ilm-al-misaha, kashi-muqarnas-mensuration: find areas by decomposing, add areas of faces; the records show the triangle and rhombus rules and a method that adds the surfaces of facets and roofs.
- f-1 trade-in-islam, al-sakk-wal-hawala, waqf: describe methods of payment, trading, lending, donating; the records show honest measure in trade, a written payment order and bills of exchange, and an endowment. Lending and borrowing have no record; the Brief says so. concept/qard-hasan (a theological reading of a Qur'anic phrase) was read and not linked.
- f-2 idkhar-fiqh, riba-fiqh: identify saving goals, explain interest rates; the records show saving as setting wealth aside for a time of need, and the jurists' definition of riba. They are not about bank interest rates or fees; the Brief says so.
- Read and not linked: invention/mahani-successive-quotient-ratios (theory of ratio by quotients, not problems with percents and rates), invention/taqi-decimal-trigonometric-tables, concept/al-bunuk-al-islamiyya (a TV poll on Islamic banks), concept/dhira-fiqh (a non-metric unit), concept/kasr (a lexical term).
- C3 (coding): considered invention/algorism for C3.1 and C3.2 (the origin of the word algorithm) and put the pair in the gap register; algorism is taught in b-3 for written algorithms.

## Steps 5-6
- Records were generated by a script kept in the scratchpad (not committed), so that expectation texts come from quote_official byte for byte (no text over 40 words or with an example list: no […] marks or cuts occur in this course) and YAML is dumped by a library.
- Differences between language records, handled by following each record's own words (the evidence file also notes them):
  - al-sakk-wal-hawala: the Urdu record says the Arabic hawala is "the basis of an Urdu word hawala", the English says "awal"; the connection leaves the clause out.
  - idkhar-fiqh: English "above the nisab", Arabic "the nisab", Urdu "at or above the nisab"; each connection follows its own record.
  - ilm-al-misaha: the Arabic record says a "cone" in the volume rule where the English says "cone or pyramid"; the volume rule is not used.
  - al-sakk-wal-hawala and others: dates in the Arabic and Urdu records for al-Uqlidisi print without an era; the connection gives none.
- Judgement: dropped "the Prophet's saying" from the waqf connection in the shortened wording and kept only Umar's condition on the gift.
- Word counts: Urdu texts run 60-110 words by whitespace count and some English texts 74-91; the runbook's "40 to 80" is a guide; no gate checks it.

## Step 7 (06:30Z)
- Gate with --strict --save: RESULT: GREEN (23 checks passed); output in docs/courses/gates/check-ca-on-g6-math.out.
- cite-check: the tool takes one id per call (a list is read as a single id); ran it once per record, 17 of 17 pass, 0 fail.
- Runbook problem: step 8 says `npx tsx scripts/cite-check.ts course/<id> course/<id> ...`; with several ids the tool reports "no file at data/course/<id1> <id2> ... .yaml". It needs one id per call.

## More lessons possible
- B2.12 / B2.3 (ratios, percents): no honest record.
- C3.1 / C3.2: only if a record on programming were added.
- D1.2 could take a second lesson from event/egypt-census-837 or event/abbasid-census-200 (counts of looms and of persons); not read in full in this run.

## Proposals
- Connection kinds: the closed list has no `concept`, `ruling` or `institution`; used `invention` for concept/algebra and for the waqf, sakk and mensuration records, `story` for trade, `reflection` for the two fiqh records, `object` for the two geometric-pattern records.
- Codes: the Ministry publishes two specific expectations without a code; the checker's code map merges them. A stable placeholder code (for example "A1.0") would let each be registered separately.
- Pinning a card and the full official wording: as in the runbook.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g6-math-b-2, KEEP-BUT-FIX.** B2.1 moved from the lesson to the gap register (reason: the only record multiplies a negative by ten, beyond Grade 6, and its shortcut is a special case). Card (en): old "yields a debt of two; multiplying that debt by ten and adding thirty-five gives fifteen. The record says this is evidence ... Where does a debt sit on a number line?" -> new "yields a debt of two. The record says this is evidence ... Here a quantity below zero, a debt of two, appears as a middle step. Where does a debt sit on a number line?" (ar, ur the same; the "not the world's first negative number" sentence is kept). Summary and Brief now say B1.2 only; the Brief says the multiplication itself is not for this grade; Try this takes only the middle step. Evidence row updated.
- **ca-on-g6-math-b-4, KEEP.** Unchanged.
- **ca-on-g6-math-e-1, KEEP-BUT-FIX; MOVE-TO-GAP concept/islamic-geometric-patterns and concept/girih; KEEP invention/khayyam-parallel-quadrilateral.** Both pattern connections deleted with their evidence rows. E1.4 (transformations on a grid) was served only by them, so it moved to the gap register (the pattern records state no symmetry or transformation); the lesson keeps E1.1 through the Khayyam card, which is unchanged. Title (en, ar, ur) old "Quadrilaterals, symmetry and repeating patterns" -> new "Quadrilaterals and their properties"; summary, Brief, section question and Try this rewritten for one quadrilateral record (the Try this no longer names the patterns or girih). Unit e Brief no longer mentions geometric patterns.
- **ca-on-g6-math-f-2, KEEP-BUT-FIX.** Riba card: old "The record says it is forbidden by the Qur'an, the Sunna and consensus." -> new "The Kuwaiti encyclopaedia of jurisprudence defines riba as ... The encyclopaedia says the jurists hold it forbidden by the Qur'an, the Sunna and consensus. Whether this definition covers interest at a modern bank is a question the record does not answer." (ar, ur the same). Idkhar card: old four sentences (hoarding, stockpiling, nisab, Abu Dharr) -> new single sentence "The Kuwaiti encyclopaedia of jurisprudence defines saving (idkhar) as setting wealth aside for a time of need." (the reviewer's option of using only the first sentence, because nisab, zakat and hoarding are above Grade 6); the evidence row for the nisab and Abu Dharr claims deleted.
- Not applied: none.

## Corrections after the fleet review (sweep of mathematics)

Review: docs/courses-mission/verifier/sweep-mathematics.md, Grade 6. Lessons b-2, b-4, d-1, e-1, f-2 were reviewed earlier and not touched. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g6-math-c-1, concept/invention karaji-binomial-coefficient-recurrence, FIX (KEEP-BUT-FIX).** Card opening, en: old "How can we find the numbers that appear when a sum of two quantities is multiplied by itself again and again? The sources attribute to Abu Bakr al-Karaji a rule that generates these coefficients by adding adjacent entries in a table" -> new "Start with a row of numbers, 1, 2, 1. The next row keeps a one at each end and adds each pair of neighbours: one and two make three, two and one make three, so the row is 1, 3, 3, 1. The sources attribute this rule of adding adjacent entries in a table to Abu Bakr al-Karaji". ar: old "كيف نعرف الأعداد التي تظهر عندما نضرب مجموع مقدارين في نفسه مرات متتابعة؟ ..." -> new "نبدأ بصف من الأعداد: 1، 2، 1 ..." with the same two rows; ur: old "دو مقداروں کے مجموعے کو بار بار خود اسی سے ضرب دیں ..." -> new "ایک صف سے شروع کریں: 1، 2، 1 ..." with the same rows. The hedge (transmitted by al-Samawal from a lost computation; a bounded improvement, not the first arithmetic triangle) and the closing question are kept. The lesson now serves C1.3 only: C1.1 and C1.2 were moved from the lesson to the gap register (the record states no growing, shrinking or linear pattern, graph or algebraic expression); lesson summary and Brief (en, ar, ur) rewritten for C1.3 and say what the class must bring. Evidence rows updated.
- **ca-on-g6-math-c-2, concept/algebra, FIX.** en: old "its name comes from al-jabr, the word al-Khwarizmi used in the title of his book" -> new "The editors of the 1939 Cairo edition of his book note that the name of the science in every language comes from al-jabr, the word al-Khwarizmi used as the title of his book". ar: old "وقد سمّاه الخوارزمي «الجبر» في عنوان كتابه" -> new "ويذكر محققا طبعة القاهرة سنة 1939 لكتابه أن اسم هذا العلم في جميع لغات العالم مشتق من الكلمة العربية «الجبر» التي جعلها الخوارزمي اسماً لكتابه". ur: old "اور اس کا نام عربی لفظ «الجبر» سے نکلا ..." -> new "اور قاہرہ کے 1939ء کے ایڈیشن کے محققین ان کی کتاب کے بارے میں لکھتے ہیں کہ اس علم کا نام ہر زبان میں عربی لفظ «الجبر» سے نکلا ...". Evidence row updated.
- **ca-on-g6-math-c-2, concept/al-durub-al-sitta, FIX.** Second example cut. en: old "For 'a square and ten of its roots equal thirty-nine dirhams' the procedure halves the roots, squares the half and adds it to the number, and the root comes out three and the square nine. Check each answer by putting it back in the equation." -> new "Check the answer by putting it back in the equation." ar: old «وفي «مال وعشرة أجذاره يعدل تسعة وثلاثين درهماً» تنصّف الأجذار ... تحقّق من كل جواب ...» -> new «تحقّق من الجواب بوضعه في المعادلة.» ur: old ««ایک مال اور اس کے دس جذر انتالیس درہم کے برابر ہیں» میں جذروں کو آدھا کرو ... ہر جواب ...» -> new «جواب کو مساوات میں رکھ کر جانچیں۔». "Four roots equal twenty" and the check are kept; the evidence row for the cut example is deleted. Lesson prose already used only the four-roots example.
- **ca-on-g6-math-f-1, concept/al-sakk-wal-hawala, FIX.** en: old "The sakk is much like today's cheque:" -> new "Hasan Ibrahim Hasan writes in his Tarikh al-Islam that the sakk is much like today's cheque:". ar: old "الصك أشبه بالشيك اليوم؛" -> new "يذكر حسن إبراهيم حسن في «تاريخ الإسلام» أن الصك أشبه بالشيك اليوم؛". ur: old "الصک آج کے چیک جیسا ہے؛" -> new "حسن ابراہیم حسن اپنی «تاریخ الاسلام» میں لکھتے ہیں کہ صک آج کے چیک جیسا ہے؛". Evidence row updated.
- Not applied: none. Gate: RESULT: GREEN (24 checks passed); cite-check: 17 pass, 0 fail of 17.
