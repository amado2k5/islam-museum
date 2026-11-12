# Run log: ca-on-g9-snc1w
Start 2026-11-12T06:06Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "SNC1W", archive slug `ontario-snc1w`, subject `course/ca-on-g9-snc1w`, grade `course/ca-on-g9`, jurisdiction `course/ca-on-english`.

## Steps
- 06:06Z read runbook and fleet prompt. `fetch_ontario.py --list "Grade 9"` printed nothing (the Ministry names this course by its code); `--list "SNC"` listed SNC1W, SNC2D, SNC2P, SNC4E, SNC4M.
- 06:06Z fetched "SNC1W": 5 strands, 10 overall, 50 specific expectations. `ontario_source.py ontario-snc1w` returned `source/ontario-curriculum-secondary-science` (reused; not edited).
- 06:07Z to 06:20Z read briefs of candidate records. Searches done with a one-load batch script of my own (the graph file is 350 MB, so each `find_entity.py` call took about a minute in a busy fleet).
- 06:21Z wrote the generator (outside the repository), the records, prose, gap register and evidence.
- 06:26Z gate run: GREEN. cite-check: 11 pass, 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g9-snc1w-a-1 | Contributions to science | A2.5 |
| ca-on-g9-snc1w-b-1 | Soil, water and what grows | B2.4 |
| ca-on-g9-snc1w-c-1 | What glass is made from | C1.1 |
| ca-on-g9-snc1w-e-1 | Fixed stars and wandering lights | E2.4 |
| ca-on-g9-snc1w-e-2 | Measuring the sky in Earth radii | E2.5 |
| ca-on-g9-snc1w-e-3 | Why the Sun and Moon go dark | E2.6 |

Strand D (Physics) gets no unit: all 12 specific expectations are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.5 / al-biruni-earth-radius: analyse a contribution by people of a community; the record shows a method for the Earth's size, its dating limits and a predecessor.
- A2.5 / ibn-al-shatir-lunar-model: same; the record shows one precise fix to Ptolemy's lunar-distance variation, not heliocentrism.
- B2.4 / ibn-bassal-soil-water-matching: investigate soil and water quality as factors; the record shows a classification of ten land types and four water sources related to season and plants (partial: sustainability, biodiversity, air and succession left to the class).
- C1.1 / natron-glass, plant-ash-glass, andalusi-lead-glass: consider the materials used to make a consumer product; the records show three glass recipes, a supply restriction on natron and a glass made from metal waste (partial: the impact assessment is left to the class).
- E2.4 / al-kawakib-al-thabita, al-harakat-al-thaniya: describe and compare components of the universe; the records show the fixed stars and the sun, moon and planets with how each moves.
- E2.5 / al-abad-al-falakiyya, al-biruni-earth-radius: quantify distances using appropriate units; the records show distances in Earth radii and in miles, and a way to find the Earth's size.
- E2.6 / eclipses, solar-eclipse-836: explain causes of a phenomenon observed from Earth; the records show the conjunction/opposition explanation with parallax, and one eclipse as people saw it.

## Judgement calls
- Lessons b-1 (B2.4), c-1 (C1.1), e-2 (E2.5) are partial serves; each Brief says what the museum offers and what the class must bring.
- concept/al-tawazun-al-kawni (a preacher's account that human interference spoils creation's balance, with a sparrow-and-locust story whose date and details the record marks as needing a source) was NOT used for B2.5: an unsourced anecdote cannot carry a science lesson. B2.5 is in the register with that reason.
- concept/hima records (reserved pasture) were not used for B1.3: they give legal rules, no ecological reason.
- concept/four-elements (Ibn Sina's four simple bodies) was not used for any chemistry expectation (C2.x): it is natural philosophy, not an atomic model or the periodic table.
- practice/islamic-glassmaking, which discusses capitals and craftsmen, was not used for A2.3: it gives no real-world issue for students to investigate.
- In concept/al-abad-al-falakiyya the English side is a summary only; the connection restates only what the English summary and the Arabic share (no table of figures). The Arabic record's OCR hedge is kept in all three languages.
- In concept/al-kawakib-al-thabita the English summary says the slow motion is "one degree" per hundred years while its prose says "one part"; the connection leaves the unit out and keeps the 36,000-year circuit that both give.
- Kinds used: `invention` for methods, `object` for glass types, `scholar` for Farghani's concepts, `story` for the dated eclipse (closed list).
- Urdu was written for every text, including the lesson, unit and subject prose.

## Failures and runbook problems
- `fetch_ontario.py --list "Grade 9"` returns nothing: the secondary courses are named by code. The runbook says to list by grade; for secondary courses use the course code or `--list "SNC"`.
- `find_entity.py` loads a 350 MB graph on each call (about a minute, much more under load): batching many queries in one process saved most of the time. The runbook could ship a batch mode.
- Under zsh, a `$ids` variable holding several record ids is not split, so `cite-check.ts` saw one long id; pass the ids as separate arguments.
- No first-run gate failure this time (the sibling-order rule from earlier runs was applied from the start).

## More lessons possible
- A lesson on A2.3 (science in its economic and social setting) would be possible from practice/islamic-glassmaking (capitals, craftsmen) if the class brings its own real-world issue; held back as a stretch.
- A second C1.1 lesson on paper (invention/baghdad-papermaking, job/papermaker) as another consumer product.

## Proposals
- Connection kinds: no `concept`, `method` or `material` kind (glass types filed under `object`, Farghani's concepts under `scholar`).
- Runbook: a note for secondary courses that the Ministry's course name is the code, and a batch mode for `find_entity.py`.
- Expectation D2.x (electricity) and C2.x (atom, periodic table) could be served only if the museum held records on electrical charge, atomic models or the periodic table.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 11 pass, 0 fail.
- snc1w-e-1, card "The sun and planets move on their own" (concept/al-harakat-al-thaniya), FIX: opening clause added in the three languages. en: "Al-Farghani calls…" → "In his Earth-centred scheme, al-Farghani calls…"; ar: added "في تصوره الذي تقف فيه الأرض في المركز،"; ur: added "اپنے اس نظام میں جس کے مرکز میں زمین ہے،".
- snc1w-e-2, card "The distances of the heavenly bodies" (concept/al-abad-al-falakiyya), FIX: the card now restates only what the Arabic page and the English summary share. "The record notes that the figures are consistent…" → "The figures are consistent…" (ur: "ریکارڈ کے مطابق" removed; ar unchanged there); a closing caveat added in the three languages that these are a medieval astronomer's estimates to be set beside today's measured distances in class. The missing en/ur prose page for the record was not written (outside the course files); see below.
- Other connections of the course: KEEP, unchanged. No verdict left unapplied.

### Records for the founder
- concept/al-abad-al-falakiyya has an Arabic page only (no content/en or content/ur page); the English and Urdu cards can only restate its data summary.
