# Run log ca-on-g11-svn3m
Start 2026-11-12T06:12Z. End 2026-11-12T06:33Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:12Z Read runbook and fleet prompt. `fetch_ontario.py --list "SVN"` gave SVN3E and SVN3M; fetched "SVN3M" as ontario-svn3m (6 strands, 17 overall, 75 specific). Source id from `ontario_source.py ontario-svn3m`: source/ontario-curriculum-secondary-science (the record already existed, untracked, written by another fleet agent).
- Read all 75 expectations. Searched the graph with a small helper (kept in the scratchpad: it loads graph.json once and runs many searches; `find_entity.py` loads 350 MB per call and took over two minutes per call here). Read the briefs of every record linked.
- Found, besides the expected agriculture and engineering records, modern persons on the environment (rizwana-hasan, mubarak-ahmad-khan) by grepping the prose for pollut*, deforest*, climate, renewable, which the label search misses.
- Wrote 10 lessons, 6 units, 1 subject through a script in the scratchpad; Arabic, English, Urdu.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 people who work for the environment | A2.1, A2.2 | person/ibn-bassal, person/mubarak-ahmad-khan, person/rizwana-hasan |
| b-1 pollution as a challenge | B1.1 | concept/environmental-protection-in-islam |
| b-2 from a problem to a new material | B3.4 | person/mubarak-ahmad-khan |
| c-1 a campaign in court for workers' health | C1.1 | person/rizwana-hasan |
| d-1 soil, water and the plant | D3.2, D3.3 | invention/ibn-bassal-soil-water-matching |
| d-2 feeding the soil | D3.4 | concept/simad |
| d-3 sharing water for crops | D3.6 | concept/agriculture-in-islam |
| e-1 treated wastewater, two answers | E3.2 | work/fatwa-binbaz-recycled-sewage-water, work/fatwa-aliftaa-jo-reclaimed-wastewater-in-mosques |
| e-2 collecting plastic to recycle | E3.4 | work/fatwa-aliftaa-jo-recycling-plastic-caps-for-charity |
| f-1 flowing water as a source of power | F3.3 | invention/jazari-double-piston-pump |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.1 / hasan, khan: identify careers and the education they need; the records show an environmental lawyer with her law degrees and a chemist with his doctorate and posts. A2.2 / khan, ibn-bassal: describe scientists' contributions; the records show a jute scientist's biodegradable bag and an agronomist's linking of land, water and season to plants.
- B1.1 / environmental-protection-in-islam: analyse social issues of an environmental challenge and efforts to address it; the record shows one writer's account of water, air and soil pollution and unimplemented conference resolutions (the Brief says it is one reading, not research).
- B3.4 / khan: explain how a challenge led to a technology; the record shows a biodegradable bag offered as an alternative to polluting polythene bags.
- C1.1 / hasan: analyse grassroots initiatives for health; the record shows an association's 2003 suit against shipbreaking yards for health hazards, working conditions and waste disposal.
- D3.2, D3.3 / soil-water-matching: plant requirements and soil components; the record shows an early handbook sorting four water sources and ten land types against season and plant, with the caveat that these are not modern categories.
- D3.4 / simad: practices that improve soil fertility (manure); the record defines manuring and gives the jurists' differences on purity.
- D3.6 / agriculture-in-islam: water-management practices in farming; the record shows a warning against withholding surplus water and a watercourse dispute. Modest: it is about sharing, not conservation. The Brief says so.
- E3.2 / the two wastewater answers: remediation practices; they show two religious answers on reusing treated sewage and reclaimed household wastewater. The science of treatment is left to the class.
- E3.4 / plastic caps: collection strategies such as recycling; the record shows a community collecting caps for recycling.
- F3.3 / jazari pump: principles of renewable energy production; the record shows a machine driven by a stream, wheel and gears. Modest: only flowing water, no environmental impact. The Brief says so.

## Counts
Units 6, lessons 10, connections 13 (11 distinct records), expectations in lessons 12 of 75 specific, expectations in the gap register 63 (of which 19 are skills expectations: A1.1 to A1.13 and B2.1, B2.5, C2.1, D2.1, E2.1, F2.1; 12 more are laboratory, field, audit, data or design tasks). Overall expectations listed on units: 17 (all six strands).

## Judgement calls
- Laboratory and practical tasks (B2.2, C2.3, C2.4, D2.2 to D2.4, D2.6, E2.2, E2.4, F2.2, F2.3) and data analysis C2.2 are registered as gaps with the reason "a procedure, with no subject matter the museum holds" and real searches on their topic, not the runbook's "none: skills expectation" (which the runbook reserves for skills).
- C1.2 (government initiatives): person/sadiq-khan has one sentence on charges on older, more polluting vehicles (T-Charge, ULEZ). It names no health aim and no result, so linking it would stretch; registered as a gap.
- D3.5: concept/hima (reserved pasture) states no conservation aim; not linked.
- B3.5: the plastic caps record could serve it, but it is used at E3.4 and gives no account of causes; left in the register.
- A fatwa is filed as kind `reflection`. The records say the museum "issues no ruling of its own"; the connection texts attribute each answer to its issuer and state no ruling in the museum's voice.
- Sonali Bag: the English record says "polluting polythene bags"; the Arabic record says "banned and environmentally harmful". The Arabic connection text keeps only what both say (environmentally harmful).
- concept/environmental-protection-in-islam is `draft` and its summary says "further sources are needed for detail"; the connection restates only that and labels it one writer's reading.
- person/rizwana-hasan's record mentions Bangladeshi party protests against her in 2026. Not used in any text.
- concept/al-israf (waste, extravagance) has Arabic prose only; not linked.

## More lessons possible
- Muslim 1553 (planting as charity benefiting birds and animals, in the Book of Irrigation) and the plastic-caps fatwa's environmental reasoning could carry a lesson on B3.5 or D1.1.
- person/sadiq-khan (ULEZ) for C1.2 if the museum's record is enriched with a health aim.
- invention/jazari-animal-scoop-water-lifter alongside the pump, for a second energy-source example (animal power) under F3.3.
- concept/hima and concept/hima-protected-pasture for D3.5 if their records state a conservation purpose.

## Proposals
- Connection kind: a fatwa, a juristic definition and a modern campaign fit none of the closed list well (`reflection`, `story` and `career` were used). A kind such as `ruling` or `institution` would say more.
- The checker treats a unit's `expectations` as the overall expectations; for a strand where only some overall expectations are served (all six here), no field says which were served. Not acted on.

## Gates
Ingestion gate (--strict --save), saved at docs/courses/gates/check-ca-on-g11-svn3m.out: RESULT: GREEN (23 checks passed).
cite-check over the 17 records: "cite-check: 17 pass, 0 fail of 17 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)"

## Runbook problems
- `find_entity.py` reloads the 350 MB graph on every call (over two minutes each here, and the shell tool's default timeout is 120 s). A multi-query mode, or a cached index, would save most of the time; I wrote a helper that loads once.
- `entity_brief.py` prints the Arabic prose before the English and is long; a flag for summary, English prose and sources only would help.
- The label search missed the most useful records (modern persons on pollution, deforestation, biodegradable materials); only a grep of the prose found them. The runbook step 4 mentions grep for concepts only; it should say to grep the English prose of all classes for the topic words.
- `timeout` does not exist on macOS, and zsh needs `${=ids}` to pass a list of ids to cite-check.
- Skipping the practical and laboratory expectations: the runbook's "skills expectation" reason is narrower than what Ontario science courses contain (investigations, audits, designs). A second standard reason would remove the need to improvise.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g11-svn3m-e-1, KEEP-BUT-FIX.** Both cards gain, before the closing question: "This answer decides whether water counts as ritually pure (tahara); it is not a test of whether water is safe to drink or use, and the museum gives no safety guidance." (ar, ur the same). Brief gains: "These answers are rulings on ritual purity (tahara), not safety tests, and the museum gives no safety guidance. The records name treatment only in passing; the processes themselves come from your class." (ar, ur the same).
- **ca-on-g11-svn3m-e-2, MOVE-TO-GAP (whole lesson).** Lesson record and its three prose files deleted; removed from unit e's `lessons:`; E3.4 added to the gap register with the reviewer's reason and two searches; its two evidence rows deleted. The unit's Brief (en, ar, ur) now says the museum maps one part of the strand, through religious answers on treated wastewater, not wastewater and recycling. Unit e keeps e-1, so the unit stays.
- Not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 11 pass, 0 fail. The line "Counts" above (10 lessons, 13 connections, 6 units) is the state before these corrections; after them: 5 units, 6 lessons (a-1, b-2, c-1, d-1, e-1, e-2), 9 connections.
- svn3m-a-1, card person/mubarak-ahmad-khan, FIX: "whom the research database Scopus considers the leading scientist in the study of jute worldwide" cut; "invented the Sonali Bag, a biodegradable jute-cellulose bag" → "is credited with the Sonali Bag, a jute-cellulose bag"; the whole card opens "According to English Wikipedia" (ar "وفقًا لويكيبيديا الإنجليزية", ur "انگریزی وکی پیڈیا کے مطابق"). It states only name, nationality, PhD, post and the existence of the Sonali Bag.
- svn3m-a-1, card person/rizwana-hasan, FIX: opens "According to English Wikipedia, …" (ar "تذكر ويكيبيديا الإنجليزية أن …", ur "انگریزی وکی پیڈیا کے مطابق …"); the lawyer's degrees and the existence of the campaigns since 2003 are kept.
- svn3m-b-2, card person/mubarak-ahmad-khan, FIX: "decomposes in soil within three to four months and dissolves in water" cut in en, ar, ur. The card now says, "According to English Wikipedia, the Sonali Bag is among his inventions; the article describes it as a cellulose-based biodegradable bioplastic bag, offered as a practical alternative to polluting polythene bags"; "The record names" removed.
- svn3m-c-1, card person/rizwana-hasan, FIX: the card opens "According to English Wikipedia" and the court outcome is attributed to the article ("and in March 2003 the court declared…"); "The record adds" → "The article adds" (ar "وتضيف المقالة", ur "مضمون مزید کہتا ہے").
- svn3m-b-1 (concept/environmental-protection-in-islam), REMOVE, whole lesson (only connection): lesson record and three prose files deleted; removed from unit b's `lessons:`; B1.1 added to the gap register; evidence rows deleted. Unit b keeps b-2; its Brief now says the museum maps one small part (en, ar, ur).
- svn3m-d-2 (concept/simad), REMOVE, whole lesson: deleted as above; D3.4 added to the gap register; evidence rows deleted.
- svn3m-d-3 (concept/agriculture-in-islam), REMOVE, whole lesson: deleted as above; D3.6 added to the gap register; evidence rows deleted. Unit d keeps d-1; its Brief now says the museum maps one part, through an early handbook (en, ar, ur).
- svn3m-f-1 (invention/jazari-double-piston-pump), REMOVE, whole lesson: deleted as above; F3.3 added to the gap register; evidence rows deleted. Unit f then had no lesson, so the unit record and its three prose files were deleted and removed from the subject's `lessons:` list. The subject still has units a, b, c, d, e. The subject summary and Brief now say the museum maps a small part of five of the six strands (en, ar, ur); "engineering" removed from the summary list of record kinds.
- Not applied: none.

### Records for the founder
- person/mubarak-ahmad-khan and person/rizwana-hasan are sourced only to English Wikipedia and Wikidata; their pages carry the "leading scientist worldwide" superlative, the Sonali Bag decomposition time and the court outcome in the museum's voice. The cards no longer do; the records themselves are outside this task.
- concept/environmental-protection-in-islam, concept/simad and concept/agriculture-in-islam: unattributed or thin for science lessons (see the gap register); concept/simad and concept/agriculture-in-islam state jurists' differences and a rule on idle land with no attribution on the page.
