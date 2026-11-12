# Run log: ca-on-g8-arts
Start 2026-11-12T06:27Z
(started 2026-11-12T06:27Z; ended 2026-11-12T06:35Z)

## Steps
- 06:27Z read the runbook; fetched "Arts - Grade 8" as `ontario-arts-g8` (4 strands: Dance, Drama, Music, Visual Arts; 12 overall, 38 specific). Source: `source/ontario-curriculum-elementary-arts` via ontario_source.py (it already existed).
- Searched 17 spelling sets (in this run: dance/whirling/sama; theatre/shadow play; music/oud/maqam; patronage/court musician; painting/miniature/Behzad; architecture/tilework; film/printing press; poetry/song; Alhambra; Ziryab) and read the briefs of 14 records (alhambra, oriental-carpets-renaissance, iranian-influence-on-medieval-indian-architecture, zellij, kamal-al-din-behzad, abida-parvin, qayna and the records the Grade 6 Arts course had linked).
- Wrote records and prose with a generator kept outside the repository (YAML dumped by library).
- 06:34Z gate GREEN; cite-check 0 fail (see gate file and report).

## Plan
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g8-arts-b-1 | Drama that speaks to a community | B3.2 |
| ca-on-g8-arts-c-1 | Music of the past beside music of today | C3.2 |
| ca-on-g8-arts-d-1 | Pattern, repetition and the surface | D2.2 |
| ca-on-g8-arts-d-2 | Letters as art: reading signs and style | D2.3 |
| ca-on-g8-arts-d-3 | Materials and methods of the painter | D1.4 |
| ca-on-g8-arts-d-4 | Art that travels and is borrowed | D3.1 |
| ca-on-g8-arts-d-5 | Rulers, patrons and the artist's work | D3.2 |

Strand A (Dance) has no unit: all nine expectations are in the register.

## Link sentences
- B3.2: "The expectation asks the student to describe contributions drama and theatre make to social, cultural and economic life in various times and places; person/mirza-fath-ali-akhundzada shows a nineteenth-century dramatist writing original plays against feudalism, corrupt justice and superstition, and pupils of state schools giving the first performances in the original language." One case only: the lesson says the class brings the rest.
- C3.2: "The expectation asks the student to compare and contrast music from the past and present; person/al-farabi (a book on music among a scholar's works) and invention/ziryab-fifth-string (a reported added string on an oud) are the past; person/abida-parvin (a singer of today, her radio breakthrough in 1973, the forms and languages she sings in) is the present. The comparison itself is the class's."
- D2.2: "The expectation asks how elements and principles of design communicate a theme or message and how to judge that; concept/islamic-geometric-patterns and concept/arabesque show repeated shapes and a surface-respecting design. What a design says, and the criteria, are the class's." Neither record states a message; the Brief says so.
- D2.3: "The expectation asks the student to read signs, symbols and style; event/arabic-script-origin, concept/khatt-al-arabi and concept/islamic-calligraphy show a script, its early styles and the art of its writing."
- D1.4: "The expectation asks the student to use materials, tools and techniques to solve design challenges; practice/persian-painting-pigments-and-gold and practice/pouncing-in-persian-painting show materials with a conservation cost and a copying method."
- D3.1: "The expectation asks how artistic traditions have been maintained, adapted or appropriated; concept/oriental-carpets-renaissance shows carpets moving into European paintings, and work/iranian-influence-on-medieval-indian-architecture gives one historian's argument (marked as his view) that Indian architecture borrowed and synthesised Iranian forms."
- D3.2: "The expectation asks which social, political and economic factors affect the making of visual art; building/alhambra shows a fortress built by one dynasty, its palaces built by a later ruler, and renewed by the conqueror; person/kamal-al-din-behzad shows a painter's post changing with rulers."

## Judgement calls
- D2.2 is an analysis-and-judgement expectation; the two pattern records state shapes and a design principle but no theme or message. I linked them only as material for the analysis and the Brief says what the class must bring.
- C3.1 left in the register: no record states a social, political or economic factor in the making of music (qayna is a village; the Mutanabbi record is a poet's patron).
- D2.1 left in the register: no record states the feelings or social concerns conveyed by a named art work (tasweer and aniconism records concern the view on images).
- Dance: concept/raqs-fiqh is a ruling, concept/sama is about listening; no dance form is offered. A3 wholly outside.
- Behzad: the record's superlatives ("most celebrated") and its disputed death place are not restated; the text keeps only the 1486 appointment, the Babur link (Iranica) and the move to Tabriz with its unknown date.
- Alhambra: the record holds no architectural description and the lesson's text says nothing of the building's design.
- Abida Parveen: the record's summary lists poets whose verse she sings, but only the summary (uncited) does; not restated. Her record is cited to English Wikipedia, which the museum allows for entity facts.
- Record kinds: `object` for an art form or craft; `story` for the report on the script's origin, the Fihrist survey and Rezavi's chapter; `career` for a dramatist, a singer and a painter; `place` for the Alhambra; `invention` for the fifth string; `scholar` for al-Farabi.
- Record discrepancies: al-Farabi English "master musician", Arabic "موسيقياً بارعاً" (each text follows its own); Akhund-zada Arabic "ست ملهاة" written "ست ملاهٍ" (same count: six comedies).

## Outcome
Ingested: 11 records (1 subject, 3 units, 7 lessons), 15 connections, 7 expectations in lessons, 31 in the gap register, of 38. Strand A has no unit.

## More lessons possible
- concept/zellij (Maghrebi tile mosaic) and building/nasrid-palaces-alhambra could make a lesson on D1.4 or D2.2 (materials and geometric design in tile); zellij was read, the Nasrid palaces record has no prose.
- concept/mughal-painting, concept/deccani-painting, concept/aniconism-in-islam and concept/tasweer-images-and-picturing could serve D3.1/D2.1; found by the painting search, not read in full.

## Proposals
- Connection kinds: no `art form`, `craft`, `practice`, `work` or `institution`; `object` and `story` stand for them.
- Dance: the museum has no dance records; a harvest lane on regional dance traditions would make strand A answerable.

## Runbook problems
- Under zsh, a loop line that echoes `== $f` fails (`= not found`); and `sed -i` needs an argument on macOS. Neither is in the runbook; minor.
- `find_entity.py` calls took a while when run together; one background batch writing to files was fastest.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g8-arts-d-2, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g8-arts-b-1, person/mirza-fath-ali-akhundzada, KEEP: unchanged.
- ca-on-g8-arts-c-1, person/al-farabi, REMOVE (b, e): connection removed; the lesson stays through the Ziryab and Abida Parveen cards (C3.2). Brief and the "what to compare" question (en, ar, ur) no longer mention "a scholar who wrote on music" or "a book about music". 2 evidence rows deleted.
- ca-on-g8-arts-c-1, invention/ziryab-fifth-string and person/abida-parvin, KEEP: unchanged.
- ca-on-g8-arts-d-1, concept/islamic-geometric-patterns, REMOVE (b): connection removed; the lesson stands through the arabesque (D2.2). Brief and Try this (en, ar, ur) now name the arabesque only ("The museum links one record on ornament, the arabesque"; Try this "Read Arabesque. Pick one motif from it and write one sentence on how it spreads across a surface"). 1 evidence row deleted. concept/arabesque KEEP.
- ca-on-g8-arts-d-2, event/arabic-script-origin, REMOVE (b): connection removed; the lesson stands through khatt-al-arabi and islamic-calligraphy (both KEEP). Brief (en, ar, ur) no longer says "the origin of the Arabic script". 3 evidence rows deleted.
- ca-on-g8-arts-d-3, practice/persian-painting-pigments-and-gold, FIX: closing question and Brief changed exactly as in Grade 6 (en "Which material would you choose for a design challenge, and why?" -> "These are historical materials, not for use in class. How did the painter's choice of material shape the page?"; ar and ur as in the Grade 6 log). The lesson's Try this already asks for materials from the classroom. practice/pouncing-in-persian-painting KEEP.
- ca-on-g8-arts-d-4 (both connections), KEEP: unchanged.
- ca-on-g8-arts-d-5, building/alhambra, REMOVE (b): connection removed; the lesson stands through person/kamal-al-din-behzad (D3.2). Brief, Try this and summary (en, ar, ur) now name the painter only; the summary no longer says "and architecture". 3 evidence rows deleted. person/kamal-al-din-behzad KEEP.

Verdicts not applied: none.
