# Run log ca-on-g9-avi1o
Start 2026-11-12T06:33Z. End 2026-11-12T06:46Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:33Z Read runbook and fleet prompt. `fetch_ontario.py --list AVI` lists "AVI1O" (no PDF twin this time). Fetched "AVI1O" (archive slug `ontario-avi1o`): 3 strands, 9 overall, 26 specific expectations, all coded; manifest `docs/courses/curricula/ontario-avi1o.json`. `ontario_source.py ontario-avi1o` printed source/ontario-curriculum-secondary-arts (reused, not edited).
- Read all 26 expectations. Searched the graph with a one-off script around `find_entity.search` (graph loaded once, in the scratchpad) for each subject-matter topic; read the briefs of every record used (`entity_brief.py`, `--full` goes after the id, not before it).
- Wrote 7 lessons in 3 units and the subject through a script kept in the scratchpad (not in the repository); Arabic, English and Urdu throughout, YAML dumped with a library.
- Checked every evidence quotation against the record text (they differ from it only in diacritics and italics markup for the job/ records).
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records linked)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 what Islamic artists made art with | A3.1 | practice/persian-painting-pigments-and-gold, job/calligrapher, concept/inlaid-metalwork |
| a-2 showing art to an audience | A3.3 | object/damascus-room-met, building/museum-of-islamic-art-doha |
| b-1 what art was for | B2.1 | concept/kufic-script, concept/propaganda-coins, work/monumental-calligraphy-in-fatimid-egypt |
| b-2 art, patrons and their society | B1.3, B2.2 | object/princes-of-the-house-of-timur, concept/mughal-painting, practice/islamic-glassmaking |
| b-3 careers behind the art | B3.2 | job/architect, job/calligrapher, job/potter |
| c-1 describing pattern and surface | C1.1, C2.1 | concept/girih, concept/arabesque, concept/zellij |
| c-2 words for techniques, materials, tools | C1.2 | practice/pouncing-in-persian-painting, job/potter, job/calligrapher |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / pigments, calligrapher, inlay: explore materials, tools and techniques; the records show mineral pigments and gold leaf, the reed pen and soot ink, and inlay of brass and bronze.
- A3.3 / Damascus Room, Doha: understand ways of presenting work to reach audiences; the records show a whole room moved into a museum (a two-sentence record, said so in the text) and a museum that arranges by era and region, lends to a biennale and tours an exhibition.
- B2.1 / kufic, coins, Fatimid inscriptions: identify the functions of art works in past societies; the records show a script for copying the Qur'an, for coins and for a monument, coins that carry a message, and inscriptions where title size marks power.
- B1.3, B2.2 / Princes of the House of Timur, Mughal painting, glass: interpret works and see how they reflect their society; the records show a painting that reveals its patron, a style formed in royal studios from Iranian, Indian and European elements, and an industry that followed new capitals.
- B3.2 / architect, calligrapher, potter: identify pathways and careers; the records show the architect's required knowledge and palace school, the calligrapher's meshk and licence, and a tile maker known by signature (the record names no training and no guilds: the text says so).
- C1.1, C2.1 / girih, arabesque, zellij: use design vocabulary and understand techniques for effects; the records show interlacing bands forming stars and polygons (a one-paragraph record: said so), plant ornament abstracted onto the surface, and tile cut away to leave letters.
- C1.2 / pouncing, potter, calligrapher: use vocabulary for techniques, materials, tools; the records define pouncing, cut tile mosaic, lustre, mina'i, the dot, the mistar and the kalip.

## Counts
Units 3, lessons 7, connections 20 (17 distinct records), expectations in lessons 9 of 26 specific, expectations in the gap register 17 (9 of them skills expectations: A1.1, A1.2, A1.3, B1.1, B1.2, B1.4, B2.3, B3.1, C1.3). Overall expectations listed on units: 6 (A3, B1, B2, B3, C1, C2). Strand A has two lessons, B three, C two.

## Judgement calls
- Everything in this course is about the museum serving one part only: Islamic art, craft and architecture. Each lesson's Brief says so in plain words, and the class brings the studio work, present-day programmes and other traditions.
- A3.3 is taught here (unlike in AVI3M, where the matching A3.3 was registered): this Grade 9 expectation is about the ways work can reach audiences, which the Doha record (arranged galleries, loans, a touring exhibition) and the Damascus Room record (a room moved into a museum) honestly show. A3.2 (the practices of preparing a work: signing, labelling, mounting) went to the register.
- B1.2 and B3.1 are registered as skills expectations (identify elements and their effects in works; knowledge and skills applied in life); the vocabulary half of this is taught in c-1 under C1.1.
- C3.1 registered although concept/tasweer-images-and-picturing exists: it is a record on the legal view of making images, not on permission, copyright or ownership of images.
- Left out as thin or off-topic: concept/horse-colours-in-timurid-painting (draft record), concept/color-splashed-ware, concept/slip-painted-ware-colored-engobe (not read in full), event/met-excavations-at-nishapur (it records a dig and looting, not how work is presented to an audience, so it would have stretched A3.3).
- The Urdu texts follow the English claims; I did not read the Urdu prose of each record. The Arabic follows the Arabic record; where the two records differ I wrote only what both say (girih: the Arabic summary says the patterns "spread", the English prose "common"; I kept "common").
- job/calligrapher and job/potter are used in several lessons (different sentences each time). Kinds: techniques to `invention`; art forms and works to `object`; coins, a painting style to `story`; the museum to `place`; the three `job/` records to `career`.

## More lessons possible
- Mamluk and Ottoman carpets (concept/mamluk-carpets, concept/oriental-carpets-renaissance) for B1.3 or B2.2.
- Illumination and bookbinding (practice/manuscript-illumination-tazhib, practice/islamic-bookbinding-persian-ottoman) for A3.1 and C1.2.
- The six pens of proportional script (concept/al-aqlam-al-sitta, concept/naskh-script, concept/thuluth-script) for C1.1 or C2.1.
- Iznik pottery (concept/iznik-pottery) for C2.1.

## Gates
Ingestion gate (--strict --save), saved at docs/courses/gates/check-ca-on-g9-avi1o.out: RESULT: GREEN (23 checks passed).
cite-check over the 11 records: "cite-check: 11 pass, 0 fail of 11 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)"

## Runbook problems
- `find_entity.py` reloads the whole graph per call; a script around `find_entity.search` with the graph loaded once was needed for the topic searches (about 14 topics at a time).
- The runbook says `entity_brief.py ... --full` but the flag must come after the id (before it, the flag is read as an id and the tool answers "NOT A RECORD").
- Quotations in the evidence file for job/ records differ from the record text in diacritics and italic markup; a checker that strips these would let a reviewer verify them mechanically.
- A connection text must fit 40 to 80 English words; the runbook does not say that the gate does not count Arabic or Urdu, so the Arabic of the thinnest records (girih, 37 words) stays under 40.

## Proposals
- Connection kinds: no `document`, `institution` or `museum` kind; the Doha museum went to `place`, a painting style to `story`.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- a-2, object/damascus-room-met, REMOVE: connection deleted (one Wikidata sentence; no audience). The lesson stands on the Doha card (A3.3). Brief ("one case"), the first section, the second heading and the Try this in en, ar, ur no longer name it; evidence rows deleted.
- b-2, object/princes-of-the-house-of-timur, FIX: title "A painting that shows its patron" → "A painting made for a patron" (ar "لوحة تُظهر راعيها" → "لوحة صُنعت لراعٍ"; ur "تصویر جو اپنے سرپرست کو ظاہر کرتی ہے" → "ایک سرپرست کے لیے بنائی گئی تصویر"). The card text, which already attributes the patron reading to the catalogue, is unchanged.
- b-3, job/potter, REMOVE: connection deleted (no training or pathway in the record). The lesson stands on the architect and calligrapher cards (B3.2). Brief, Try this in the three languages now name two crafts; "and were known" removed from the Brief because only the potter card spoke of a name; evidence rows deleted.
- c-2, job/calligrapher, FIX: Urdu "(سانچا)" wrapped in U+2066 ... U+2069.
- Urdu term fixes shared with other courses: pigments card "گوند یا گوندِ عربی" → "سریش یا گوند عربی" (the Urdu record's term, glue or gum arabic); potter "چینی ساز" → "کمہار" in the c-2 card and Brief and Try this (and in the removed b-3 text).
- No verdict was judged wrong.
