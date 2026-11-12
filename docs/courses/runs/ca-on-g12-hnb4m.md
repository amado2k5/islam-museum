# Run log ca-on-g12-hnb4m
Start 2026-11-12T06:26Z. End 2026-11-12T06:41Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:26Z Read runbook and fleet prompt. `fetch_ontario.py --list "HNB"` printed `HNB4M`; fetched it as `ontario-hnb4m` (course "The World of Fashion", 4 strands, 12 overall, 44 specific). Source id from `ontario_source.py ontario-hnb4m`: source/ontario-curriculum-social-sciences-humanities. (The grade record course/ca-on-g12 cites source/ontario-curriculum-ssh-9-12-2013, a different record; I used the one the tool returned, as the other g12 courses do.)
- Read all 44 expectations. Strand A (15) names no subject matter: gap register as skills expectations.
- Searched the graph (find_entity.py, entity_brief.py --full) for each topic: textile, tiraz, silk, cotton, dress, hijab, kiswa/ihram, tailor/needle, loom/weaving, wool/flax/weaver, designers, brands, fashion centres, countries, globalization, labour, environment, dyes, consumers, tools, seams, knitting, design elements, fashion media. Briefs read for every record linked.
- Wrote 6 lessons, 2 units (B, C), 1 subject through a script kept in the scratchpad (not in the repository); Arabic, English, Urdu throughout.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| b-1 religion, rank and dress | B1.1 | object/kiswa, event/green-turban-ashraf-773 |
| b-2 writing woven into cloth; a court fashion | B1.2 | invention/tiraz, concept/ghulamiyyat, object/tiraz-132-london |
| b-3 looms and the counting of looms | B1.3 | invention/tiraz, job/weaver, event/egypt-census-837 |
| c-1 dress for a community of faith | C1.1, C1.2 | concept/albisa, concept/rida-garment |
| c-2 from silk thread to cloth | C2.2 | concept/silk-rulings, job/weaver, invention/tiraz |
| c-3 when cheaper cloth reached the market | C3.3 | job/weaver (twice: guild; decline) |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B1.1 / kiswa, green turban: analyse how religious practice and class structure affected the fashion industry; the records show a yearly renewed textile that travelled with the pilgrim caravan, and a cloth badge ordered by a sultan to mark a social group.
- B1.2 / tiraz, ghulamiyyat, tiraz-132-london: describe notable fashion innovations of historical periods; the records show the written tiraz band of the Umayyad period, an Abbasid court fashion that spread by imitation, and a surviving fragment dated 132 AH.
- B1.3 / tiraz, weaver, census: analyse the importance of key technologies such as the loom; the records show looms as counts, prices and state workshops (not an invention history; the Brief says so).
- C1.1, C1.2 / albisa, rida: identify a faith group as a clothing market, its fabrics and their functions; the records show what a faith community says dress is for, which materials and colours it names, and the pilgrim's garments. Innovations and modifications are not covered (Brief says so).
- C2.2 / silk, weaver, tiraz: describe the basic processes from fibre to fabric; the records show silk as silkworm thread, spinning and weaving cotton, and letters worked in weft and warp. Knitting, dyeing, printing and finishing are not described (Brief says so).
- C3.3 / weaver: analyse globalization's impact, e.g. displaced local craftspeople; the record shows one Ottoman case of imported Indian and European cotton and the guilds' collapse. Not modern globalization (Brief says so).

## Counts
Units 2, lessons 6, connections 15 (10 distinct records), expectations in lessons 7 of 44 specific, expectations in the gap register 37 (15 of them skills expectations: A1.1 to A4.4). Overall expectations listed on units: 5 (B1, B2; C1, C2, C3). Strands A (research skills) and D (design and construction skills) have no unit.

## Judgement calls
- C1.2 asks for innovations and modifications; the museum holds none. Linked anyway for fabrics and function (albisa: dress covers and protects; named materials; rida' for ihram), with the Brief saying what is missing. Gap-registering C1.2 would also be defensible.
- B1.3: the loom records give counts and prices, not technological change. Kept as the museum's part, said plainly in the Brief. event/egypt-census-837 is a "needs additional source" record; the card keeps that hedge and asks the student to test the count.
- C3.3: job/weaver is a historical Ottoman case, not modern globalization; the Brief says so. C3.1, C3.2, C3.4, C3.5 gap-registered.
- D1.3, D2.2, D2.3, D3.2, D3.5 are practical (making) expectations; gap-registered with real searches instead of the "skills expectation" reason, since they name subject matter (tools, techniques).
- concept/ghulamiyyat: the Arabic record says the girls' heads were turbaned (`فعمّمت`), the English prose says shaved; the card names neither and says only forelocks, sideburns, napes, and the garments. The Arabic names aqbiya, qaraTiq and manaTiq, the English tunics, shirts and belts; each language follows its own record.
- concept/rida-garment: the Arabic says it is recommended (`يستحب`) for the pilgrim to wear a white (new or washed) izar and rida', the English that the jurists agree on a white or washed pair; the card says only that the record names a white izar and rida'.
- concept/silk-rulings: the Arabic says silk is taken from the silkworm; the English calls it the silkworm's thread; each card follows its own record.
- Candidates left out: object/nasi-kamkha (a one-line catalogue entry: no process or design to restate), concept/dibaj (no more than silk-rulings; under 40 words of restatable text), exhibit/path-textiles and exhibit/path-silk-road (trails with one-line summaries), concept/hijab (about covering rules, nothing on a market), concept/hair-wool-and-fur and the dhimmi dress events (not used for fashion-market questions), source/aboutislam-saleh-family (a source record: a Toronto hijab business with hand-dyed hijabs, which would serve C1.1 but sources are not linkable records).
- No connection links a stub. person/rita-hayek and person/qatan-ibn-wahb appeared as stubs and were not used.

## More lessons possible
None beyond these six: the other candidates above lack restatable text.

## Gate lines
- check_course: `RESULT: GREEN (23 checks passed)`
- cite-check: `cite-check: 9 pass, 0 fail of 9 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`

## Runbook problems
- `fetch_ontario.py --list "HNB"` worked, and the course name is just `HNB4M` (a course code; the runbook's `--list HRT` hint covers it).
- The runbook says to quote the unit's overall expectations with `quote_official`; used for all five listed.
- Dumping YAML with a library creates anchors (`&id001`) when the same list object is reused (the two skills-expectation searches); copy the list per entry.
- In zsh, `echo "=====X"` fails with "not found" (leading `=` expands as a command lookup); use printf.

## Proposals
- Connection kinds: the closed list has no `concept` or `textile`; fiqh concepts were filed as `reflection`, tiraz as `invention`, the Ottoman weaver as `career`, a census as `story`.
- A connection to a *source* record (e.g. a news report on a business) cannot be made, though it would serve C1.1; a `report` kind or a rule allowing source links would let such material in.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hnb4m-b-1, object/kiswa, REMOVE: connection deleted; the Brief ("two cases ... a covering renewed every year" -> "one case ... a mark on turbans") and the Try this (now only the green-turban record) rewritten in en, ar, ur; the lesson summary says one case; its four evidence rows deleted. The lesson stays on event/green-turban-ashraf-773. The course summary no longer names the Kaaba covering.
- ca-on-g12-hnb4m-b-2, concept/ghulamiyyat, REMOVE (done first, as ordered): connection deleted; no prose file linked the record, but the Brief's "one fashion from the Abbasid period" / "زيًّا واحدًا من الحقبة العباسية" / "عباسی دور کا ایک فیشن" was its mention and is replaced by a surviving fragment of tiraz set beside the written report; the lesson's title ("and a court fashion") and summary lost the same clause; its two evidence rows deleted. `grep -l concept/ghulamiyyat data/course/*.yaml` now finds nothing.
- ca-on-g12-hnb4m-b-3, event/egypt-census-837, REMOVE: connection deleted; the Try this no longer names it or the "needs additional source" marking; its four evidence rows deleted.
- ca-on-g12-hnb4m-c-1, concept/albisa, FIX: rulings now attributed. Old (en) "Clothing is what covers the body ... Among its rulings, covering the nakedness is obligatory ... silk is for men, and white is recommended." -> "The Kuwaiti Encyclopaedia of Fiqh records that the jurists hold clothing to be what covers the body ... They hold that covering the nakedness is obligatory, ... as silk is for men, and that white is recommended." ar and ur likewise ("تذكر الموسوعة الفقهية الكويتية أن الفقهاء يرون ..."; "کویتی فقہی انسائیکلوپیڈیا درج کرتا ہے کہ فقہا کے نزدیک ..."). The card never carried "imitation of unbelievers' dress" and still does not.
- ca-on-g12-hnb4m-c-1, concept/rida-garment, FIX: the rain-prayer sentence cut in all three languages (en "Most jurists recommend turning the rida' over during the prayer for rain, while Abu Hanifa does not."); the white izar and rida' of the pilgrim kept; two evidence rows deleted and one trimmed.
- ca-on-g12-hnb4m-c-2, concept/silk-rulings, REMOVE: connection deleted; the lesson now has weaver and tiraz. Title ("From the silk thread to the cloth" -> "From the thread to the cloth"), summary (three records -> two), Brief ("silk, cotton and woven writing" -> "cotton and woven writing") and Try this rewritten in the three languages; four evidence rows deleted.

Verdicts not applied: none.
