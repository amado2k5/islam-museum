# Run log: ca-on-g10-snc2d

Course: Ontario Ministry of Education, SNC2D, Science (Grade 10). Archive slug `ontario-snc2d`. Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph already built; no validate, no state-changing git).

Start 2026-11-12T06:06Z (first `date -u`). End 2026-11-12T06:26Z.

## Steps

- 06:06Z read the runbook; `fetch_ontario.py --list "SNC2D"` printed the name `SNC2D`. (`--list "Grade 10"` printed nothing: Ministry secondary course names carry no grade.)
- 06:06Z `fetch_ontario.py SNC2D ontario-snc2d`: 5 strands (A, B, C, D, E), 14 overall and 81 specific expectations. `ontario_source.py ontario-snc2d` printed `source/ontario-curriculum-secondary-science` (existing record, reused).
- 06:10Z searched the graph (find_entity, entity_brief; grep over content for words the label search cannot see) for optics, vision, the dark room, the rainbow, mirrors, lenses, physicians and anatomy, circulation, smallpox and measles, hospitals, vaccines, cancer, cloning and organ donation, alchemy and chemistry, acids, climate, greenhouse, oceans, ice, ozone, careers and scientists.
- 06:20Z wrote 12 records, prose in ar/en/ur, the gap register (68 entries), the evidence file; gate run.
- 06:26Z gate GREEN; cite-check 12 pass, 0 fail.

## Lesson plan (final)

| Lesson | Title | Expectations | Records linked |
|---|---|---|---|
| a-1 | Scientists and the careers of science | A2.1, A2.2 | person/ibn-al-haytham, job/physician, person/ibn-al-nafis |
| b-1 | How the parts of a body work together | B3.3, B3.4, B3.5 | concept/anatomy, invention/pulmonary-circulation |
| b-2 | Studying a disease: two illnesses compared | B2.7 | invention/al-razi-smallpox-measles |
| b-3 | New biology and its ethics: what do the fatwas say? | B1.1 | work/fatwa-aliftaa-jo-bequeathing-ones-organs-after-death, work/fatwa-aliftaa-jo-plant-cloning |
| d-1 | Dividing the earth into climates | D2.8 | concept/al-aqalim-al-saba |
| e-1 | Light in a straight line, and the rainbow | E1.2, E3.8 | invention/camera-obscura, invention/farisi-water-sphere-rainbow |
| e-2 | Where does light reflect on a curved mirror? | E2.2, E2.3, E3.3 | invention/ibn-al-haytham-circular-reflection |

Units: A, B, D, E. Strand C (Chemistry) is wholly in the gap register; no unit record for it. Counts: 4 units, 7 lessons, 12 connections, 13 expectations in lessons, 68 in the gap register, of 81 specific expectations.

## The link sentences ("The expectation asks the student to ___; this record shows ___")

- A2.2 / Ibn al-Haytham: identify scientists who contributed to the fields under study; the record shows an Arab scholar of mathematics and physics known for the Book of Optics, with the editor's judgement of the book.
- A2.1 / job/physician: describe careers and the education and training they need; the record shows how the physician's craft was learned and, in the Abbasid period, examined and licensed.
- A2.1 / Ibn al-Nafis: the record shows one physician's training (the account is Tareq al-Suwaidan's, attributed as such).
- B3.3 / concept/anatomy: explain the links between cells, tissues, organs and systems; the record shows the Canon's grouping of organs into simple and composite and its three principal organs. It says nothing about cells; the Brief says so.
- B3.4 / concept/anatomy: explain the primary functions of systems; the record gives the functions of the three principal organs (heart, brain, liver) in the Canon's scheme, not of systems as the class teaches them. Used with that limit stated in the Brief ("the modern account of the systems is for your class").
- B3.5 / invention/pulmonary-circulation: explain the interaction of systems and why it matters; the record shows the blood's route from the right side of the heart through the lung to the left side.
- B2.7 / al-Razi: use a research process to investigate a disease; the record shows a medieval comparison of two diseases, labelled a document in medical history and not a guide to diagnosis.
- B1.1 / the two fatwas: analyse ethical issues of a technological development (the official examples name cloning and organ transplants); the records show one fatwa body's answers on organ donation after death and on plant cloning, attributed to it. They give one voice, and the Brief says the other voices are for the class to research.
- D2.8 / seven climates: classify climate with tools or systems; the record shows one old system of seven climates. It holds no data on the student's region; the Brief says so.
- E1.2 / camera obscura: analyse a device that uses the properties of light; the record shows the dark-room experiment and TDV's statement that it is the basis of the photographic camera.
- E3.8 / al-Farisi: use properties of light to explain a natural optical phenomenon (the full official text names a rainbow among its examples); the record shows a model with refractions and internal reflections for the primary and secondary bows.
- E2.2, E2.3, E3.3 / circular mirror: investigate reflection with plane and curved mirrors; the record shows where light reflects on a circular mirror by the equal-angle rule against the local normal. A construction on paper, not a laboratory result.

## Judgement calls and discrepancies between the Arabic and English records

- Al-Razi record: the Arabic says nausea and anxiety "recur" (تكرر) in measles and back pain "stands out" (بروز) in smallpox; the English says "relatively more nausea and anxiety in measles" and "more characteristic back pain in smallpox". Each language's text follows its own record; both say only that nausea and anxiety go with measles and back pain with smallpox.
- Pulmonary-circulation record: the English dates Ibn al-Nafis to the thirteenth century and the Arabic to the seventh century AH; each text follows its own record. The record's comparison with Servetus is left out of the connection text (to stay within 80 words).
- Ibn al-Haytham person record: the Arabic and English summaries agree.
- Ibn al-Nafis person record: the Arabic says the father "enrolled him" (ألحقه) at the Nuri hospital; the English says "he ... enrolled". The connection text says only that he studied there.
- The invention/circular-reflection sentence "a mathematical construction, not ... an original mirror" is in the record's prose without a citation marker; it is restated as the record states it, citing the source of the surrounding sentences.
- job/physician: the sentence on learning the craft carries no marker in the English Summary; the same fact is in the record's summary field.
- Kind choices: concept/anatomy as `reflection`; the two fatwa works as `object` (as the philosophy course did); concept/al-aqalim-al-saba as `place`; job/physician and Ibn al-Nafis as `career`.
- Ibn al-Nafis lesser circulation: first written from a TV-programme summary (person record, Tareq al-Suwaidan); replaced by invention/pulmonary-circulation, which a label-only class search had missed (found by searching "heart" and "blood circulation" without a class filter). Lesson: search without `--class` too.

## Near misses (not linked, and why)

- invention/haytham-incoming-light-vision: a theory of vision; E1.1 asks for a device or procedure. Listed in the gap register entry for E1.1.
- invention/ibn-zuhr-goat-tracheotomy-demonstration: an animal demonstration of recovery after a tracheal injury; no expectation asks for it (B3.4 asks for the functions of systems).
- invention/razi-substance-classification, concept/anbik, concept/sinaat-al-kimiya, person/jabir-ibn-hayyan, invention/balance-of-wisdom: chemistry-adjacent, but none describes a reaction, an acid or base, a formula, or conservation of mass. Strand C stays wholly in the gap register.
- concept/athar-al-iqlim (Ibn Khaldun on climate's effect on people): not linked to D1.1; it is a claim about climate and human character, not an effect of climate change.
- concept/environmental-protection-in-islam: one author's reading; names no climate initiative (D1.2).
- concept/mirage: no prose, so nothing to restate for E3.8.

## More lessons possible

- A lesson on invention/haytham-incoming-light-vision for a new E1.1 reading, if the founder accepts a theory of vision as "a procedure related to human perception of light".
- A lesson on the Mansuri/Adudi bimaristans and hospital records for B1.2/B1.3 if a record is written that says what the hospitals did for public health (the current records are buildings).
- None beyond these: seven lessons were written, below the twelve allowed; every other expectation lacks a record, not a lesson.

## Runbook problems that cost time

- `find_entity.py --class <class>` hides a record of another class that answers the same question (the pulmonary circulation is an `invention`, which `--class person` could not show). The runbook should say to search once without `--class`.
- `find_entity.py` takes about a minute per call when other agents are running; a batch of thirty topic searches took about twenty minutes. A topic batch mode in one process would save time.
- `entity_brief.py` has no timeout and no `--lang` shorthand for reading only the English; long briefs are read in slices.
- zsh does not split `$IDS`; the cite-check command needs `xargs`.

## Proposals (the schema cannot say it)

- Connection kinds: a `discovery` or `method` (the museum's own kinds for inventions) and a `fatwa` have no connection kind; `invention` and `object` were used.
- A link from each expectation to the Ministry's own page for it would restore the wording that the 40-word rule cuts (the examples of E3.8, B1.1 and others).

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 12 pass, 0 fail.
- snc2d-a-1, card on person/ibn-al-haytham, FIX: the unnamed editor's superlative removed (the lead's instruction: cut, do not name). en: ", and holds that his book is the most valuable thing Arab scholars produced in physics" → full stop after "fifth century AH"; ar: "ويرى أن كتابه أنفس ما أنتج العلماء العرب في الفيزياء" removed; ur: "اور ان کے خیال میں یہ کتاب طبیعیات میں عرب علماء کی سب سے قیمتی پیداوار ہے" removed. Identical wording kept in snc2p-a-1 and sph3u-a-2.
- snc2d-a-1, card on person/ibn-al-nafis, FIX: the card rested on the television programme (birthplace Homs, health crisis in 629 AH at twenty-two, Nuri hospital, move to Cairo in 633 AH). Rewritten in en, ar, ur from the record's cited Shadharat al-Dhahab prose only: Ibn al-Imad's Shadharat calls him the shaykh of medicine in Egypt, he also took part in jurisprudence, usul, hadith, Arabic and logic; al-Shamil (index suggests 300 volumes); endowment to the Mansuri hospital. Title now "The shaykh of medicine in Egypt" (ar, ur matching); source changed from source/assabile-tareq-al-suwaidan to source/shadharat-dhahab. The Brief (en, ar, ur) gains one sentence: the record does not say where he trained, for training use the physician's path. Evidence rows replaced.
- snc2d-b-1, card on invention/pulmonary-circulation, FIX: "It is the first known account of all the blood passing through the lungs" → "John West (2008) calls this the first known description of the pulmonary circulation" (ar, ur the same). Same fix applied in snc2p-b-1 (that card read "The record calls this…").
- snc2d-d-1, card on concept/al-aqalim-al-saba, FIX: "The best inhabited land is…" → "Al-Masudi adds that these astronomers hold the best inhabited land to be…"; added "This is a division of inhabited land by latitude, not a modern climate classification." (ar, ur the same).
- snc2d-e-2, card on invention/ibn-al-haytham-circular-reflection, FIX: closing question "Can you draw the construction yourself?" → "At the reflection point, where is the normal, and which two angles are equal?" (ar, ur the same). The Brief already says mirrors, measuring and images are for the class.
- Not applied: none. b-1 (anatomy, cells) and the other KEEP verdicts unchanged; the Briefs of b-1 and e-2 already say what the class brings.
