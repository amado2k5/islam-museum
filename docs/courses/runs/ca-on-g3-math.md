# Run log: ca-on-g3-math

Started: 2026-11-12T06:33Z (date -u). Ended: 2026-11-12T06:48Z.
Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph prebuilt; no graph, validate, derive, test or git state change).

## Step 1 (06:33Z)
- `fetch_ontario.py --list "Grade 3"`: exact name "Math - Grade 3". Fetched to .cache/curricula/ontario-math-g3/ (manifest docs/courses/curricula/ontario-math-g3.json). 6 strands, 12 overall, 46 specific expectations. Strand A (A1) has no specific expectation; C4 has none.
- Source: `ontario_source.py ontario-math-g3` printed source/ontario-curriculum-elementary-mathematics (already present).
- The grade record course/ca-on-g3 cites source/ontario-curriculum-sshg-2023; the subject cites the mathematics source as the runbook requires.

## Step 4: search phase
- find_entity.py with three or more spellings for numerals/place value, fractions, multiplication/division, patterns/girih, domes/muqarnas, length (dhira, farsakh), capacity (mudd, sa'), mass (ratl, mithqal), clocks/prayer times, money/coinage, statistics/census/frequency, probability, qibla/direction, area, solids, averages, graphs, programming. Plus greps of content/en for pictograph, bar graph, perimeter, kilometre, arithmetic mean, equivalent fraction, quarter turn, pan balance, square centimetre, unlikely.
- entity_brief.py read for: algorism, islamic-geometric-patterns, girih, muqarnas, kashi-muqarnas-mensuration, jazari-castle-clock, jazari-swordsman-candle-clock, dhira-fiqh, saa, measure-sa, hunayn spoils distribution, egypt-census-837, abbasid-census-200, nard, maysir, frequency-analysis-al-kindi, algebra, ilm-al-misaha.
- zsh gotcha (mine): `echo =====` aborts a command under zsh.
- find_entity.py searches were run in parallel in the background (14 at once finished within about 100 s).

### Plan
| lesson | title | expectations |
|---|---|---|
| ca-on-g3-math-b-1 | Numbers written in places | B1.1, B1.5, B2.4, B2.5 |
| ca-on-g3-math-c-1 | Patterns of stars and polygons | C1.1, C1.2 |
| ca-on-g3-math-c-2 | An unknown quantity | C2.1 |
| ca-on-g3-math-d-1 | Counting to find out | D1.2, D1.5 |
| ca-on-g3-math-e-1 | Ceilings made of cells | E1.2 |
| ca-on-g3-math-e-2 | Two scoops of different size | E2.5 |
| ca-on-g3-math-e-3 | A clock run by water | E2.6 |
| ca-on-g3-math-e-4 | Measuring a surface by a cubit | E2.8 |

13 specific expectations in 8 lessons, 33 in the gap register, 46 in all. Strand A and strand F get no unit (F1.1 is in the gap register).

### Links: "The expectation asks the student to ___; this record shows ___."
- b-1 invention/algorism: read and represent numbers by place value and add and subtract with algorithms; the record shows nine numerals and zero in place value and written steps for the four operations. B2.5 is the weakest part: the record shows the method, not problems of up to 1000; the Brief says problems are the class's work.
- c-1 concept/islamic-geometric-patterns, concept/girih: identify repeating elements and create patterns in shapes, numbers and tables; the records show repeated patterns of stars and polygons and interlacing strapwork. Both are one-sentence Wikidata-cited records (girih has more prose in learner tiers, but its cited sentence is the Wikidata one). Judgement: kept for C1.1 and C1.2 only, with a Brief that says the records name the kind of pattern and no rule. C1.3 (rules, predictions) is in the gap register.
- c-2 concept/algebra: describe how variables are used; the record shows an unknown posited and the three kinds of number. Modest link: the museum shows an unknown quantity, not letter notation; the Brief says so. C2.2 and C2.3 (equivalence) are in the register.
- d-1 invention/frequency-analysis-al-kindi, event/egypt-census-837: organize data in frequency tables; analyse data and draw conclusions; the records show counting and ranking letters with a warning about short samples, and counted figures compared with earlier ones. Neither collects data in a classroom survey; the Brief says so. The census figures are single-sourced (the record says so, and the connection says so).
- e-1 invention/kashi-muqarnas-mensuration: compose and decompose structures and identify the shapes they contain; the record shows a ceiling of cells made of facets and roofs and counted by shape.
- e-2 concept/saa: measure one attribute with units of different sizes; the record shows two sa' measures of different size for the same grain.
- e-3 invention/jazari-castle-clock: tell time with clocks; the record shows a water clock with seasonal hour signals by doors, balls and lights. Modest link: it shows signals and solar hours, not hours, minutes and seconds on a dial; the Brief says so.
- e-4 concept/ilm-al-misaha: measure area with a non-standard unit; the record shows the cubit by a cubit as the unit of area and a square of side two as four of it. Gaps and overlaps are not in the record; the Brief says they are the class's work.
- Read and not linked: invention/jazari-swordsman-candle-clock (a candle clock; one clock link was enough); concept/measure-sa (same subject as concept/saa, with ratl figures); concept/dhira-fiqh (Urdu record omits the cubit sense, so it cannot carry a three-language connection); concept/muqarnas (one Wikidata sentence; invention/kashi-muqarnas-mensuration carries the lesson); concept/nard and concept/maysir (rulings on games of chance, not likelihood); event/distribution-of-hunayn-spoils (unequal shares of camels, not fair shares); event/hajjaj-mint-reform and event/abd-al-malik-coinage (minting, not making change).

## Steps 5-6
- Records generated by a script kept in the scratchpad (not committed), so that expectation texts come from quote_official byte for byte and YAML is dumped by a library. No expectation here needs a […] mark or a cut.
- Differences between language records (also listed in the evidence file): the Urdu concept/saa gives different ratl figures than the Arabic and English; the connection gives none. The Urdu concept/dhira-fiqh lacks the cubit sense.
- Word counts: the connection texts run about 55 to 90 words in English and are longer in Urdu; the runbook's "40 to 80" is a guide, no gate checks it.

## Step 7 (06:46Z)
- Gate with --strict --save: RESULT: GREEN (23 checks passed); output in docs/courses/gates/check-ca-on-g3-math.out.
- cite-check: ran once per record, 13 of 13 pass, 0 fail.

## Runbook problems
- Step 8 says `npx tsx scripts/cite-check.ts course/<id> course/<id> ...`; with several ids the tool reads them as one id (the same defect the Grade 6 run logged). One id per call works.
- The runbook says to take 40 to 80 words per connection; the Urdu texts routinely exceed it when the record's own sentences are restated in full.

## More lessons possible
- event/abbasid-census-200 (descendants of al-Abbas counted in 200 AH) could give a second D1.5 connection or a lesson on comparing two counts.
- invention/jazari-swordsman-candle-clock could carry a second clock lesson (E2.6) once the record's Arabic and Urdu prose are read in full.
- concept/measure-sa could add a second connection to e-2 after its Arabic and Urdu ratl figures are checked.
- event/distribution-of-hunayn-spoils fixes shares by rank (a foot-soldier four camels and a rider more); it could serve B2.7 or B2.9 if its later section is read in full (not read in full in this run).

## Proposals
- Connection kinds: the closed list has no `concept`, `ruling`, `measure` or `institution`; used `object` for the two pattern records and the sa' measure, `invention` for the algebra, mensuration, muqarnas-measurement, frequency and clock records, and `story` for the census.
- Schema: a record with an Urdu summary that differs in numbers from the Arabic and English (concept/saa) should be repaired by its own lane; this run did not edit it.
- Pinning a card and the full official wording: as in the runbook.

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-mathematics.md, section "Grade 3". Gate after the changes: RESULT: GREEN (24 checks passed); cite-check: 12 pass, 0 fail of 12 records.

- g3-math-b-1 (KEEP), e-2 (KEEP): unchanged. The review's note that the "four mudds" sentence in e-2 "could go" is optional and was not applied.
- g3-math-c-1: REMOVE (b) concept/islamic-geometric-patterns. The "before" connection ("Patterns that cover walls") deleted in all three languages; the evidence row deleted. Brief: "two records on repeated geometric patterns ... say little beyond the kind of pattern and where it appears" -> "one record on girih, which builds stars and polygons from interlacing bands and rests on girih tiles" (ar: "سجلًّا واحدًا عن الجيره ... بخطوط متشابكة وتقوم على بلاطات جيره"; ur: «گرہ» ... متشابک پٹیوں ... ٹائلوں پر قائم). Try this: the two records -> the record on girih. Unit c Brief: "patterns of stars and polygons" -> "girih (stars and polygons)". The girih connection (KEEP) is unchanged.
- g3-math-c-2: FIX concept/algebra. Cut "Al-Khwarizmi states that reckoning by al-jabr and al-muqabala needs three kinds of number: roots, squares and simple number" (ar: ويقرر الخوارزمي ... جذور وأموال وعدد مفرد; ur: خوارزمی کہتے ہیں ... جذر، مال اور مفرد عدد). Card title "Roots, squares and simple numbers" -> "Solving by positing an unknown" (ar: حلّ المسائل بفرض المجهول; ur: مجہول فرض کر کے مسئلے کا حل). The kept text is the record's own sentence "solves problems by positing an unknown and handling equations by general methods" plus the closing question. Brief: "a record on the book that gave algebra its name, in which an unknown quantity is posited and then found" -> "a record on algebra, the branch of mathematics that solves problems by positing an unknown" (ar, ur alike). The "words without symbols" fact was NOT added: it is in invention/algebra (cited to tdv-cebir), not in concept/algebra, and a connection may cite only the sources of the record it links. Evidence row for the roots sentence deleted.
- g3-math-d-1: REMOVE (c) invention/frequency-analysis-al-kindi: connection ("Counting letters and ranking them") deleted in all languages, its two evidence rows deleted, the Brief, the section "What will you tally..." and Try this rewritten to no longer name it. Lesson summary: "Collecting data, organizing it in frequency tables, and reading data sets..." -> "Reading a recorded count by asking questions and drawing conclusions." (ar/ur alike). D1.2 left the lesson and went to the gap register (text byte-identical, two searches). Unit d Brief updated.
- g3-math-d-1: FIX event/egypt-census-837. Card title "Looms and villages counted" -> "Looms counted". Cut the village figures (2,170 against 10,000) as above what the card needs, and the cut "Fatimid" clause; kept 800 looms against 14,000. "at the end of the eighth century" -> "at the end of the eighth century AH" (ar: في آخر القرن الثامن الهجري; ur: آٹھویں صدی ہجری کے آخر میں). "The figures are given on the source's own authority" -> "... and the record says an additional source is needed" (ar: ويقول السجل إنه يحتاج إلى مصدر إضافي; ur: اور اندراج کہتا ہے کہ ایک اضافی ماخذ درکار ہے). The three languages now carry the same content (the Arabic was 57 words and the English 87). The opening sentence still names the villages of Egypt (no figures), as the record does.
- g3-math-e-1: FIX invention/kashi-muqarnas-mensuration. Cut "and adds the surfaces of facets, roofs and connecting pieces" and "counting hollows in a photograph is not enough to find their surface" (ar: ويجمع مساحات الوجوه والسقوف والعناصر الواصلة / ولا يكفي عد التجاويف ...; ur: پھر رخوں، چھتوں اور ملانے والے ٹکڑوں کے رقبے جمع ہوتے ہیں / تصویر میں کھوکھلے حصے گننا ...). Added from the record "cells with bases in one horizontal plane form a tier" (ar: والطبقة تجمع خلايا قواعدها في مستوى أفقي واحد; ur: جن خانوں کی بنیادیں ایک افقی سطح میں ہوں وہ ایک تہہ بناتے ہیں). Kept: a cell of two facets and a roof, counting by shape. Brief unchanged (it did not mention surfaces). Evidence rows rewritten.
- g3-math-e-3: REMOVE (b) invention/jazari-castle-clock, whole lesson. Deleted data/course/ca-on-g3-math-e-3.yaml and its en/ar/ur prose; removed from unit e `lessons:`; unit e summary "Four lessons are linked" -> "Three" (ar, ur) and its Brief no longer names the water clock; evidence rows and the two evidence-note bullets deleted. E2.6 added to the gap register (text byte-identical, two searches).
- g3-math-e-4: KEEP, Brief fixed: added that the record has nothing on gaps and overlaps (en: "the record has nothing on gaps and overlaps"; ar: وليس في السجل شيء عن الفراغات والتداخلات; ur: اندراج میں خالی جگہوں اور اوور لیپ کے بارے میں کچھ نہیں ہے). Evidence note updated.

Not applied: nothing else; the "four mudds" trim in e-2 was left because the review's own verdict is KEEP and the wording is "could go".

Records for the founder: none new. (The earlier note stands: the Urdu concept/saa gives different ratl figures from the Arabic and English.)
