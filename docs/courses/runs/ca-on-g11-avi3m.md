# Run log ca-on-g11-avi3m
Start 2026-11-12T06:13Z. End 2026-11-12T06:34Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:13Z Read runbook and fleet prompt. `fetch_ontario.py --list "AVI3M"` returned two names, "AVI3M" and "AVI3M (PDF)"; I fetched "AVI3M" (archive slug `ontario-avi3m`): 3 strands, 9 overall, 27 specific expectations, manifest `docs/courses/curricula/ontario-avi3m.json`. Source id from `ontario_source.py ontario-avi3m`: source/ontario-curriculum-secondary-arts (reused).
- Read all 27 expectations. Searched the graph (a one-off script around `find_entity.search`, in the scratchpad, so that the graph loads once; plain `find_entity.py` takes about 4 s a query) for each topic, then read the briefs (`entity_brief.py --full`) of every candidate.
- Wrote 7 lessons in 3 units and the subject through a script kept in the scratchpad (not in the repository); Arabic, English and Urdu throughout, YAML dumped with a library.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 materials, tools, techniques | A3.2 | practice/persian-painting-pigments-and-gold, job/calligrapher, concept/inlaid-metalwork |
| a-2 where art is shown | A3.4 | event/met-excavations-at-nishapur, building/museum-of-islamic-art-doha, object/damascus-room-met |
| b-1 what art was for | B2.1 | concept/kufic-script, concept/propaganda-coins, work/monumental-calligraphy-in-fatimid-egypt |
| b-2 art and its society | B1.3, B2.2 | practice/islamic-glassmaking, concept/mughal-painting, job/potter |
| b-3 careers | B3.1 | job/architect, job/calligrapher, job/potter |
| c-1 line, pattern, surface | C1.1, C2.1 | concept/girih, concept/arabesque, concept/zellij |
| c-2 words for techniques | C1.2 | practice/pouncing-in-persian-painting, job/potter, job/calligrapher |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.2 / pigments, calligrapher tools, inlaid metalwork: explore traditional materials, techniques and tools of visual artists; the records show how Persian painters prepared mineral pigments and gold leaf, the calligrapher's reed pen, ink, nib widths and gold, and the inlaying of brass and bronze.
- A3.4 / Nishapur, Doha, Damascus Room: explain how where and how works are displayed affects meaning and audience; the records show a dig whose finds went to a museum, a purpose-built museum that arranges objects by era and region, and a room moved into a museum. The Damascus Room record is two sentences long; the connection restates it and says so.
- B2.1 / kufic, propaganda coins, Fatimid inscriptions: analyse the function and social impact of art works in past societies; the records show a script for copying the Qur'an and for a monument, a coin type that carries a political message, and inscriptions where title size marks power.
- B1.3, B2.2 / glass, Mughal painting, potter: explain how context clarifies a work and how works answer to their society; the records show glass tied to capitals and materials, a painting style formed in a royal studio from Iranian, Indian and European elements, and tile ordered by decree to court-designed patterns.
- B3.1 / architect, calligrapher, potter: identify careers and describe their skills, education and training; the records show an architect's required knowledge and palace school, the calligrapher's meshk and licence, and a tile maker known by signature (the record names no training: the connection says so).
- C1.1, C2.1 / girih, arabesque, zellij: use design vocabulary and understand techniques for specific effects; the records show interlacing lines forming stars and polygons, leaves abstracted onto the surface, and tile cut away to leave letters.
- C1.2 / pouncing, potter, calligrapher: explain terms for techniques, materials and tools; the records define pouncing, cut tile mosaic, lustre, mina'i, the dot, mistar and kalip.

## Counts
Units 3, lessons 7, connections 21 (17 distinct records), expectations in lessons 9 of 27 specific, expectations in the gap register 18 (8 of them skills expectations: A1.1, A1.2, A1.3, B1.1, B1.2, B1.4, B2.3, C1.3). Overall expectations listed on units: 6 (A3, B1, B2, B3, C1, C2). Strand A has two lessons, B three, C two.

## Judgement calls
- Everything in this course is about the museum serving one part only: Islamic art, craft and architecture. Each lesson's Brief says so in plain words, and the class brings the studio work, present-day careers and other traditions. No expectation was written as if the museum's part were the whole.
- A3.3 (standards of presentation) gap-registered although job/calligrapher mentions signature formulas and mounted albums: the record does not give standards for preparing work for display.
- B3.3 gap-registered although job/calligrapher names IRCICA's competitions and UNESCO's listing: no record describes an arts organisation a student could join.
- C3.1 gap-registered; the fatwa on selling a dead author's manuscript under another name is about a book, not visual art. Linking it would be defensible only for the "ideas" half of the expectation, and I judged it a stretch.
- C2.2 gap-registered; concept/propaganda-coins is used under B2.1 instead.
- The Urdu texts follow the English record sentences; I did not read the Urdu prose of each record. The Arabic follows the Arabic record, and where the two records differ I wrote only what both say (concept/girih: the Arabic summary says "widespread", the English prose "common"; I kept "common in Safavid and Seljuk architecture", the claim both make).
- concept/girih, object/damascus-room-met and concept/islamic-calligraphy are thin records (one Wikidata-sourced paragraph); the connections restate only that paragraph. concept/islamic-geometric-patterns and concept/muqarnas were left out for the same reason.
- job/calligrapher and job/potter are reused in three lessons each (different sentences each time). Candidates left out: concept/tasweer-images-and-picturing (a fiqh entry on making images, with no art-historical claim about society, so B2.2 would be a stretch), concept/iznik-pottery, concept/mamluk-carpets, concept/oriental-carpets-renaissance, practice/manuscript-illumination-tazhib, practice/islamic-bookbinding-persian-ottoman, invention/abd-al-malik-epigraphic-dinar (long and heavily hedged), object/mihrab-* and object/balata-* pieces.
- Kinds: closed list again forced choices. Techniques (pigments, pouncing, glassmaking) went to `invention`; art forms and works (kufic, arabesque, girih, zellij, inlay, Fatimid inscriptions, a moved room) to `object`; coins and a painting style and a dig to `story`; museum to `place`; the three `job/` records to `career`.

## More lessons possible
- Mamluk and Ottoman carpets (concept/mamluk-carpets, concept/oriental-carpets-renaissance) for B1.3 or B2.2.
- Illumination and bookbinding (practice/manuscript-illumination-tazhib, practice/islamic-bookbinding-persian-ottoman) for A3.2 and C1.2.
- The six pens of proportional script (concept/al-aqlam-al-sitta, concept/naskh-script, concept/thuluth-script) for C1.1 or C2.1.
- Images and figural art (concept/tasweer-images-and-picturing) for B2.1 if a reviewer wants it read as a social function.

## Gates
Ingestion gate (--strict --save), saved at docs/courses/gates/check-ca-on-g11-avi3m.out: RESULT: GREEN (23 checks passed).
cite-check over the 11 records: "cite-check: 11 pass, 0 fail of 11 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)"

## Runbook problems
- `find_entity.py` reloads and re-normalises the whole graph per call (about 4 s a query, 2 minutes for a 25-query batch in this fleet run, with other agents busy). A multi-query mode that loads the graph once would save several minutes per course.
- `fetch_ontario.py --list "AVI3M"` returns two courses, "AVI3M" and "AVI3M (PDF)", and the runbook does not say which to fetch; I took the plain name.
- `entity_brief.py` on a long `job/` record prints tens of thousands of characters (job/calligrapher is 50 KB); a flag for named sections would save reading.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md. The cards shared with the sibling course (AVI3M and AVI3O) were changed in both, so the two stay identical.

- a-2, event/met-excavations-at-nishapur, REMOVE: connection deleted (a dig report; the record never mentions display, a museum or an audience). Evidence rows deleted.
- a-2, object/damascus-room-met, REMOVE: connection deleted (the card admitted the record says nothing about how the room is displayed). Evidence rows deleted. The lesson stands on the Doha card alone; its Brief ("one case tied to a museum"), first section, Try this in en, ar, ur, and the unit's Brief (one case about display) now match.
- b-2, practice/islamic-glassmaking, FIX: closing question "what an artist made" → "what glassworkers made" (ar "ما صنعه الفنان" → "ما صنعه صنّاع الزجاج"; ur "فنکار نے کیا بنایا" → "شیشہ سازوں نے کیا بنایا"). The card is no longer a target for B1.3 (that stays with the Mughal painting card).
- b-3, job/potter (the tile maker's name), REMOVE: connection deleted (no skills, education or training in the record). The lesson stands on the architect and calligrapher cards; Brief, summary, section 2 and Try this in the three languages now say two crafts. Evidence rows deleted.
- c-1, concept/girih, FIX: "which lines, shapes and repeats do you see" → "which lines and shapes do you see" (ar "وتكرارات" and ur "تكرار" cut); "repeats" is only in the record's uncited audience paragraph. C2.1 now rests on the zellij card alone (the record gives girih no technique).
- Urdu: pigments card "گوند یا گوندِ عربی" → "سریش یا گوند عربی"; inlay card "پیتل اور کانسی کے برتنوں پر" → "پیتل اور کانسی میں"; potter "چینی ساز" → "کمہار" (b-2 card).
- No verdict was judged wrong.
