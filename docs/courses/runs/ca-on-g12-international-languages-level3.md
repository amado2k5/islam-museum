# Run log ca-on-g12-international-languages-level3
Start 2026-11-12T06:44Z. End 2026-11-12T06:50Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:44Z Read the fleet prompt and the runbook. `fetch_ontario.py --list LBADU` printed the exact Ministry name "LBADU – LDYDU" (en dash). Fetched to `.cache/curricula/ontario-intl-languages-level3/` (4 strands, 12 overall, 34 specific); manifest `docs/courses/curricula/ontario-intl-languages-level3.json`. Source id from `ontario_source.py`: source/ontario-curriculum-classical-studies-intl-languages (reused, the same as the sibling's).
- Read all 34 expectations. Candidates: the intercultural "3" expectations of each strand (A3.1, A3.2, B3.1, B3.2, C3.1, C3.2, D3.1, D3.2). Strands 1 and 2 of every group are skills or strategies: gap register.
- Compared the Level 3 "3" expectations with Level 2 (sibling) by running `quote_official` on both: the stored (examples-omitted) wording of A3, B3, C3, D3 and of all eight specific expectations is identical byte for byte. Only the examples differ. So the sibling's Arabic and Urdu translations of the stored text were reused unchanged. The examples decide what the museum can honestly serve:
  - Level 3 A3.2 no longer lists borrowed words among its examples (it lists dialects and accents, gestures, interview conventions, idioms and proverbs, register); the sibling's lesson on bimaristan and algebra was therefore not reused, and A3.2 goes to the register.
  - Level 3 B3.1 no longer lists an interview with a significant figure; it lists a news report, a re-enacted historical event, a presentation. The base wording still says "their contributions to the world", so the al-Khwarizmi lesson was kept, but its closing question and activity were changed from an interview to a short talk.
  - Level 3 D3.1 no longer lists the comparison of health care systems; the base wording "contributions to the world" still holds, the hospitals lesson was kept, and its Brief still leaves the comparison to the class.
  - Level 3 C3.1 lists a ritual, symbols, anthems and analysis of a play; it fits a festival. The sibling's calligraphy connection was dropped to make room (the lesson allows three) and the Eid al-Fitr record added.
  - Level 3 "asks for more: literature, analysis" (an epic poem in D3.1, a contemporary play in C3.1, poems in C3.2): the museum has nothing it can restate; see "More lessons possible".
- Searches (find_entity.py, about 22 calls in parallel, output filtered): epic, Mu'allaqat/pre-Islamic poetry, aqiqa/naming ceremony, flag/anthem, proverb/idiom, Eid, Arabic literature/maqama, dialect, birth rites, poet, wedding, hospitality/coffee, loanword/mu'arrab, gesture/etiquette, slang/colloquial, gratitude/invitation, letter, interview/register, national anthem, drama/film, sport, resume/career. Read the full brief (`--full`) of every record linked, today, and checked each evidence quotation against it.
- Wrote 5 lessons, 4 units, 1 subject through a script kept in the scratchpad (adapted from the sibling's generator); Arabic, English, Urdu throughout.
- Gate and cite-check run (results below).

## What was reused from ca-on-g11-international-languages-level2
Reused, with the Level 2 text copied and re-checked against today's record:
- Lesson a-1 (A3.1), both connection texts (place/baghdad, place/cairo) and its Brief, activity: unchanged. The A3.1 stored wording is identical to Level 2; the Level 3 examples (history events, culture of indigenous peoples, music) do not name cities, but "identify communities ... aspects of their cultures" is the base wording and cities fit it.
- Lesson b-1 (B3.1), both connections (place/baghdad, person/al-khwarizmi): connection texts unchanged; only the title and closing question of the al-Khwarizmi card, the question heading and the activity were reworded (interview to short talk) because Level 3's examples no longer name an interview.
- Lesson b-2 (B3.2), concept/kunya-fiqh text unchanged; the greeting text rewritten for English only (see judgement calls).
- Lesson c-1 (C3.1), concept/arabiyya and event/arabic-script-origin texts unchanged.
- Lesson d-1 (D3.1), both hospital texts unchanged.
- Unit and subject records: shape and the translations of overall expectations A3, B3, C3, D3 reused (the stored wording is identical); the labels, summaries and briefs rewritten for Level 3 and Grade 12.
- Evidence rows: copied for the reused texts, quotations re-verified (ten quotations carried link marks or small wording differences in the fresh brief and were checked by hand).
Not reused: lesson a-2 (words that travel), connection concept/islamic-calligraphy. New: the Eid al-Fitr connection in c-1 and the gap-register searches and reasons for A3.2, C3.2, D3.2.

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 cities | A3.1 | place/baghdad, place/cairo |
| b-1 a scholar and his city | B3.1 | place/baghdad, person/al-khwarizmi |
| b-2 greeting and address | B3.2 | practice/greeting-salam, concept/kunya-fiqh |
| c-1 language, script, a festival | C3.1 | concept/arabiyya, event/arabic-script-origin, practice/eid-al-fitr |
| d-1 two hospitals | D3.1 | building/bimaristan-adudi, invention/ibn-tulun-bimaristan |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / baghdad, cairo: identify communities where the language is spoken and aspects of their cultures; the records show how two cities were founded, named and grew. The museum does not say what is spoken there today: the Brief tells the class to bring that.
- B3.1 / baghdad, al-khwarizmi: speak about a community's contributions to the world; the records show one scholar, his patron's institution and how his work travelled.
- B3.2 / greeting-salam, kunya-fiqh: identify conventions for social situations and use the right level of formality (the Level 3 example "use the appropriate level of formality to interact with people"); the records show when the greeting is given and how a kunya honours a person. Greeting and leave-taking are not named in Level 3's examples; they are social-situation conventions under the base wording.
- C3.1 / arabiyya, arabic-script-origin, eid-al-fitr: find out about aspects of cultures from texts, including a ritual (the Level 3 example "research a ritual practised in a country or region where the target language is spoken"); the records show the language, a report on its script and the name and timing of one festival.
- D3.1 / bimaristan-adudi, ibn-tulun-bimaristan: write about a community's contributions to the world; the records show what two hospitals supplied.

## Judgement calls
- practice/greeting-salam: the English record now reads "belongs to arriving and to leaving alike, and the first is no more due than the last"; the Arabic reads "عند اللقاء وعند الفراق ... أحق". The sibling's English said "meeting and parting ... no more deserving". The English text was changed to the record's words; the Arabic and the Urdu follow the Arabic record.
- practice/eid-al-fitr: only the Overview and Takbir sentences were restated (they cite the Kuwaiti jurists' encyclopaedia). The "For Explorers" and "For Scholars" texts, the dates of institution (the second year of the Hijra) and the rulings of the schools carry no citation or are rulings, and were not used. The connection kind is `reflection` (no `practice` kind; see Proposals). The takbir is named but not explained, because the record does not explain it in a cited sentence.
- place/damascus not linked: its overview sentence carries no citation (as in the sibling run).
- The Mu'allaqat exhibit and the poem passages (passage/poem-muallaqat-*, Mutanabbi's ode on the Eid) have no prose or one cited only to Wikidata: nothing to restate, so no poetry lesson.
- Rule "Fit the grade": every record linked is suitable for a Grade 12 student (no slavery, violence, sexual matters or graphic content).

## More lessons possible
- Poetry for C3.2 and D3.1 (an epic poem, poems from two regions): if the Mu'allaqat or Mutanabbi poem records gain cited prose, a lesson becomes possible (exhibit/path-muallaqat has a two-line description citing only Wikidata).
- Eid al-Adha and the Eid prayer (practice/eid-al-adha, practice/udhiyya) for a second festival comparison in C3.1 or D3.1 (an ad campaign for a cultural celebration): not written because C3.1 and D3.1 each already have their lesson and an expectation sits in one lesson only; the udhiyya record concerns a sacrifice and was not read for grade fit.
- Calligraphy (concept/islamic-calligraphy, cited only to Wikidata) as an aspect of culture for C3.1, replaced in the lesson by Eid.
- Aqiqa (practice/aqiqa) as a ritual that marks a newborn, set beside the naming ceremony in the C3.1 example: not read for grade fit and its prose is fiqh-ruling in character.

## Proposals
- Connection kinds: `practice` (the greeting, a festival) and `concept` (the kunya, the Arabic language) have no kind; all are filed as `reflection`. A `practice` or `language` kind would say it better.
- A generic course (many languages under one code range) is served only for the language the student takes; the schema has no field for "this course, for Arabic". The subject label and Brief say so in words.
- A course whose examples are replaced between levels (Level 1, 2, 3 of the same strand) leaves the stored (examples-omitted) text identical; a gate that reports "the stored text is the same as the sibling course's" would help a later agent see at once which translations may be reused.

## Results
- Gate (docs/courses/gates/check-ca-on-g12-international-languages-level3.out), last line: `RESULT: GREEN (23 checks passed)`.
- cite-check, last line: `cite-check: 10 pass, 0 fail of 10 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`.
- Counts: 4 units, 5 lessons, 11 connections (10 distinct records), 5 of 34 specific expectations in lessons, 29 in the gap register.

## Runbook problems that cost time
- The sibling's saved briefs were the truncated (2,500 character) forms, so comparing them with fresh `--full` briefs said nothing about whether the records had changed; the greeting record's English had changed. Re-reading each record in full was necessary (no runbook note).
- `find_entity.py` output for many parallel searches is long; filtering with `cut` and `head` was needed.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-international-languages-level3-a-1, place/baghdad and place/cairo, REMOVE (the reviewer's judgement call on the cities, applied as decided): both connections go, so the whole lesson, its three prose files and its evidence rows were deleted; A3.1 moved to the gap register with two searches. With no lesson left, unit ca-on-g12-international-languages-level3-a and its prose were deleted and the unit removed from the subject's lessons.
- b-2, practice/greeting-salam, FIX: the card already had the record's wording (kept as the reference for levels 1 and 2). The Brief gains one sentence: "The source for the greeting is a television programme and a lesson." (ar, ur the same).
- b-2, concept/kunya-fiqh, FIX: now attributed to the Kuwaiti Encyclopaedia of Fiqh ("The Kuwaiti Encyclopaedia of Fiqh says that a kunya is ... and that it belongs to notable people"; ar, ur likewise).

Verdicts not applied: none.
