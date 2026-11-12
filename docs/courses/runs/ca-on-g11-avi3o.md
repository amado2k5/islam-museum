# Run log ca-on-g11-avi3o
Start 2026-11-12T06:37Z. End 2026-11-12T06:41Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:37Z Read runbook and fleet prompt. `fetch_ontario.py --list AVI` returned AVI3O and "AVI3O (PDF)"; fetched "AVI3O" (archive slug `ontario-avi3o`): 3 strands, 9 overall, 26 specific expectations, manifest `docs/courses/curricula/ontario-avi3o.json`. `ontario_source.py ontario-avi3o` printed source/ontario-curriculum-secondary-arts (reused).
- Read all 26 expectations. AVI3O is the Open-level sibling of AVI3M, ingested minutes earlier in this worktree. I read its records, then rechecked each expectation against the AVI3O wording before reusing a lesson shape. The seven lesson shapes and their connections (same linked records, same record sentences, same evidence) were reused, the lesson expectations, the three Briefs whose first sentence depends on the expectation (a-2, b-1, b-3), and the summaries' codes were rewritten for AVI3O, and the nine expectation texts were translated afresh into Arabic and Urdu. A generator script kept in the scratchpad (not in the repository) produced the files; YAML dumped with a library.
- Searched the graph again (one-off script around `find_entity.search`, scratchpad) for the topics of every non-skills gap and wrote the gap entries from those results.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 materials, tools, techniques | A3.1 | practice/persian-painting-pigments-and-gold, job/calligrapher, concept/inlaid-metalwork |
| a-2 where art is shown | A3.3 | event/met-excavations-at-nishapur, building/museum-of-islamic-art-doha, object/damascus-room-met |
| b-1 what art was for | B2.1 | concept/kufic-script, concept/propaganda-coins, work/monumental-calligraphy-in-fatimid-egypt |
| b-2 art and its society | B1.3, B2.2 | practice/islamic-glassmaking, concept/mughal-painting, job/potter |
| b-3 careers and training | B3.2 | job/architect, job/calligrapher, job/potter |
| c-1 line, pattern, surface | C1.1, C2.1 | concept/girih, concept/arabesque, concept/zellij |
| c-2 words for techniques | C1.2 | practice/pouncing-in-persian-painting, job/potter, job/calligrapher |

## Link sentences (the expectation asks ...; this record shows ...)
- A3.1 asks the student to explore techniques, tools and materials; the pigment, calligrapher and inlaid-metalwork records show what Islamic artists ground, cut, wrote and inlaid with. The class supplies alternative media and current technologies.
- A3.3 asks for ways art works are presented to reach audiences; the Nishapur dig, the Doha museum and the Damascus Room show three routes of a work into a museum. The class supplies the student's own audiences.
- B2.1 asks for the functions of art works; the Kufic, propaganda-coin and Fatimid-inscription records show writing doing sacred, official and commemorative work.
- B1.3 and B2.2 ask how context gives meaning and how works answer their society; the glassmaking, Mughal painting and potter records tie each craft to a court, a capital or a market.
- B3.2 asks for pathways and careers and their education; the architect record shows licensing and required knowledge, the calligrapher record shows teaching and masters, the potter record the craft's training as the record gives it. Today's pathways come from the class.
- C1.1 and C2.1 ask for design terms and techniques for effects; the girih, arabesque and zellij records show pattern made by adding and by cutting away. C1.2 asks for terms of technique, materials and tools; the pouncing, potter and calligrapher records give such terms.

## Gates
- `check_course.py ... --strict --save`: RESULT: GREEN (23 checks passed); output at docs/courses/gates/check-ca-on-g11-avi3o.out.
- cite-check: 11 pass, 0 fail of 11 record(s).

## Counts
Units 3, lessons 7, connections 21, expectations in lessons 9, expectations in the gap register 17, of 26.

## Gap register summary
Nine skills expectations (A1.1, A1.2, A1.3, B1.1, B1.2, B1.4, B2.3, B3.1, C1.3) and eight with subject matter the museum lacks (A2.1, A2.2, A3.2, B3.3, C2.2, C3.1, C3.2, C3.3), each with two searches in docs/courses/gaps/ca-on-g11-avi3o.yaml.

## More lessons possible
None found: every expectation that the records honestly support is in a lesson.

## Runbook problems
- None that cost time. The runbook does not say that a sibling course of the same subject may be reused as a template; I did so, and re-verified the expectations one by one, because AVI3O and AVI3M word several expectations differently (A3.1 versus A3.2, A3.3 versus A3.4, B3.2 versus B3.1).

## Proposals
- The closed connection `kind` list has no `institution`; building and event records of museums use `place` and `story`, as in AVI3M.
- A3.2 (preparing the student's own work for presentation) has no museum record; nothing to propose in the schema.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md. The cards shared with the sibling course (AVI3M and AVI3O) were changed in both, so the two stay identical.

- a-2, event/met-excavations-at-nishapur, REMOVE: connection deleted (a dig report; the record never mentions display, a museum or an audience). Evidence rows deleted.
- a-2, object/damascus-room-met, REMOVE: connection deleted (the card admitted the record says nothing about how the room is displayed). Evidence rows deleted. The lesson stands on the Doha card alone; its Brief ("one case tied to a museum"), first section, Try this in en, ar, ur, and the unit's Brief (one case about display) now match.
- b-2, practice/islamic-glassmaking, FIX: closing question "what an artist made" → "what glassworkers made" (ar "ما صنعه الفنان" → "ما صنعه صنّاع الزجاج"; ur "فنکار نے کیا بنایا" → "شیشہ سازوں نے کیا بنایا"). The card is no longer a target for B1.3 (that stays with the Mughal painting card).
- b-3, job/potter (the tile maker's name), REMOVE: connection deleted (no skills, education or training in the record). The lesson stands on the architect and calligrapher cards; Brief, summary, section 2 and Try this in the three languages now say two crafts. Evidence rows deleted.
- c-1, concept/girih, FIX: "which lines, shapes and repeats do you see" → "which lines and shapes do you see" (ar "وتكرارات" and ur "تكرار" cut); "repeats" is only in the record's uncited audience paragraph. C2.1 now rests on the zellij card alone (the record gives girih no technique).
- Urdu: pigments card "گوند یا گوندِ عربی" → "سریش یا گوند عربی"; inlay card "پیتل اور کانسی کے برتنوں پر" → "پیتل اور کانسی میں"; potter "چینی ساز" → "کمہار" (b-2 card).
- No verdict was judged wrong.
