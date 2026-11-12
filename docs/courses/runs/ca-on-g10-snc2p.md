# Run log: ca-on-g10-snc2p

Start 2026-11-12T06:07Z. End 2026-11-12T06:24Z.

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "SNC2P" (Science, Grade 10 applied), archive slug `ontario-snc2p`, subject `course/ca-on-g10-snc2p`, grade `course/ca-on-g10`, jurisdiction `course/ca-on-english`.

## Steps
- 06:07Z read runbook and fleet prompt. `fetch_ontario.py --list "SNC"` listed SNC1W, SNC2D, SNC2P, SNC4E, SNC4M; fetched "SNC2P": 5 strands, 14 overall, 74 specific expectations. Source id from `ontario_source.py ontario-snc2p`: `source/ontario-curriculum-secondary-science` (reused; not edited).
- 06:10Z to 06:20Z searched the graph for optics, medicine, chemistry and climate topics; read the briefs of the candidate records (optics, Ibn al-Haytham, camera obscura, circular reflection, al-Farisi's rainbow, pulmonary circulation, Ibn al-Nafis, the Canon, anatomy, lustreware, glassmaking, Jabir, alchemy, soap, four elements).
- 06:20Z wrote the generator and gap script outside the repository, produced records, prose, gap register and evidence.
- 06:23Z gate: RESULT: GREEN (23 checks passed). cite-check: 12 pass, 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g10-snc2p-a-1 | Careers and scientists: a physician and an optics scholar | A2.1, A2.2 |
| ca-on-g10-snc2p-b-1 | Blood, heart and lungs | B3.5 |
| ca-on-g10-snc2p-b-2 | What each part of the body is for | B3.2 |
| ca-on-g10-snc2p-c-1 | Chemistry in a potter's kiln | C1.1, C1.2 |
| ca-on-g10-snc2p-e-1 | Where does the mirror send the light? | E2.2, E3.3 |
| ca-on-g10-snc2p-e-2 | A dark room and a small hole | E3.8 |
| ca-on-g10-snc2p-e-3 | Where light bends: a water sphere and the rainbow | E2.3, E3.4 |

Strand D (Earth's Dynamic Climate, 16 specific expectations) gets no unit: all are in the gap register. The 12 investigation-skill expectations of A1 are in the register as skills expectations.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.1 / person/ibn-al-nafis: identify a career and its work; the record shows the shaykh of medicine in Egypt who wrote a medical encyclopaedia and endowed his books to a hospital. It names no training path in the Shadharat lines, so the Brief leaves training to the class.
- A2.2 / person/ibn-al-haytham: identify a scientist who contributed to the field; the record shows an Arab mathematician and physicist whose Book of Optics the editor values highly.
- B3.5 / invention/pulmonary-circulation: describe how systems interact; the record shows blood passing from the right side of the heart through the lung to the left side.
- B3.2 / concept/anatomy: describe structure and function of specialised tissues; the record shows Ibn Sina's simple "organs of similar parts" (bone, nerve, flesh) and what each is for. It has no cells. The Brief says it is an older scheme only.
- C1.1, C1.2 / concept/islamic-lustreware: analyse a reaction used in making a product, and a profession's use of it; the record shows Lane's account of the lustre pigment and its reducing firing. It states no hazard; the Brief leaves hazards to the class.
- E2.2, E3.3 / invention/ibn-al-haytham-circular-reflection: explain the law of reflection and how light reflects from mirrors; the record shows equal angles of incidence and reflection measured against the local normal on a circular mirror.
- E3.8 / invention/camera-obscura: explain how a property of light is used in an optical device; the record shows light travelling in straight lines through a hole, called by TDV the basis of the camera.
- E2.3, E3.4 / invention/farisi-water-sphere-rainbow and concept/optics: investigate and describe refraction; the records name refraction as one of light's three conditions and show two refractions in a droplet-model path. Neither gives a rule for the angle of refraction; the Brief leaves the measured investigation to the class.

## Judgement calls
- Arabic and English disagree in person/ibn-al-nafis: the English says "He left eighty volumes of it unfinished", the Arabic "بيّض منها ثمانين مجلدة" (made a fair copy of eighty). The connection omits the eighty and keeps what both say (index suggests three hundred volumes).
- person/ibn-al-nafis (born in Homs, trained at the Nuri hospital per the Suwaidan lecture) and invention/pulmonary-circulation (West: born in or near Damascus) differ on his birthplace. The connection cites neither.
- person/ibn-al-haytham summary.en calls the Book of Optics "the principal optical work of the Islamic world", which the Arabic summary does not say. The connection uses the prose that both languages share (the editor holds it the most valuable thing Arab scholars produced in physics).
- Jabir and the alchemy records were not linked: they report what the Fihrist says of alchemists and describe no reaction.
- Lesson b-2 (B3.2) is a partial service. concept/anatomy has organs of similar parts, not cells. Kept because the expectation also names tissues and their functions, and the Brief says what the museum cannot supply. A verifier may judge it a stretch; if so it can be moved to the register without touching the others.
- E2.5 (how objects reflect, transmit or absorb light) went to the register: the camera-obscura record shows an opaque body stopping a beam, not a comparison of materials.
- Kinds used from the closed list: `career` for the physician, `scholar` for the scholar and for concept/optics and concept/anatomy, `object` for lustreware, `invention` for discoveries and methods.
- The subject's `curriculum_ref` names the Ministry's page and the course code; the source record carries no year.

## Failures and runbook problems
- `find_entity.py` with common words takes more than two minutes when several agents share the machine; I ran the gap searches as background jobs writing to files in the scratch directory.
- The runbook's cite-check command uses `course/<id> course/<id> …`; in zsh a variable holding the ids is not word-split, so I piped through `xargs`.
- A first read of Ibn al-Haytham's `entity_brief.py` text with `--full` placed before the id fails ("--full: NOT A RECORD"); the flag goes after the id.

## More lessons possible
None beyond what is written. A lesson on A1.1 or A1.5 (formulating a question, controlled variables) could be served by Ibn al-Haytham's experiments (camera obscura) or by invention/ibn-sina-seven-drug-assessment-conditions, but A1 are skills expectations that name no subject matter, so they stay in the register per the runbook.

## Proposals
- Connection kinds: no `concept`, `discipline` or `technique` kind (optics, anatomy filed under `scholar`; a craft under `object`).
- Skills expectations (A1 of every Ontario science course) could be served by records of method (a camera-obscura test, a drug-assessment rule). A schema value for a "method" connection and a runbook rule for linking skill expectations would let them be taught.
- The Ontario secondary science courses SNC1W, SNC2D, SNC4E and SNC4M share the optics and medicine records used here; the same lessons could be reused if the fleet reaches them.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 12 pass, 0 fail.
- snc2p-a-1, card person/ibn-al-nafis, FIX: "The record, following Ibn al-Imad's Shadharat al-Dhahab, calls…" → "Ibn al-Imad's Shadharat al-Dhahab calls…" (ar: "يسمّي السجل، عن «شذرات الذهب»…" → "تسمّي «شذرات الذهب»…"; ur: "ریکارڈ، ابن العماد کی … کے حوالے سے … کہتا ہے" → "ابن العماد کی «شذرات الذہب» … کہتی ہے"). The Brief (en, ar, ur) gains one sentence: the record names his title, book and endowment but not how he trained.
- snc2p-a-1, card person/ibn-al-haytham, FIX: the editor's "most valuable thing Arab scholars produced in physics" clause cut in three languages (same wording as snc2d-a-1, sph3u-a-2).
- snc2p-b-1, card invention/pulmonary-circulation, FIX: "The record calls this the first known account of all the blood passing through the lungs" → "John West (2008) calls this the first known description of the pulmonary circulation" (ar, ur the same).
- snc2p-e-1, card invention/ibn-al-haytham-circular-reflection, FIX: the card now opens with the rim point where the angle of incidence equals the angle of reflection against the local normal; the "given an object and an eye, where should light reflect" construction problem is dropped from the lead (en, ar, ur); "The record says" removed. Closing question ("Where would you draw that normal?") unchanged.
- snc2p-e-3, card concept/optics, REMOVE (move to gap, one connection): connection deleted, its two evidence rows deleted; no prose sentence named it. The lesson stands on invention/farisi-water-sphere-rainbow, which still serves E2.3 and E3.4.
- Not applied: none. Other connections KEEP, unchanged.
