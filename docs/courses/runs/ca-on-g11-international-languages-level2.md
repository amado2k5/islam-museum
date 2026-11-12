# Run log ca-on-g11-international-languages-level2
Start 2026-11-12T06:36Z. End 2026-11-12T06:45Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:36Z Read runbook and fleet prompt. `fetch_ontario.py --list LBACU` printed the exact Ministry name "LBACU – LDYCU" (en dash). Fetched to `.cache/curricula/ontario-intl-languages-level2/` (4 strands, 12 overall, 34 specific); manifest `docs/courses/curricula/ontario-intl-languages-level2.json`. Source id from `ontario_source.py`: source/ontario-curriculum-classical-studies-intl-languages (reused).
- Read all 34 expectations. Candidates for the museum: the intercultural "3" expectations (communities, cultures, contributions, sociolinguistic conventions) of each strand. Strands 1 and 2 of every group are skills or strategies: gap register.
- Searched (find_entity.py, about 20 calls in parallel): Arabic language, dialects, loanwords, greeting, souq, bimaristan, Eid, calligraphy, poetry, cuisine, music, Cairo/Damascus/Baghdad, slang, idiom, letters, gratitude, formality, newspaper, diglossia. Read briefs of every record linked.
- Wrote 6 lessons, 4 units, 1 subject through a script kept in the scratchpad; Arabic, English, Urdu throughout.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 cities | A3.1 | place/baghdad, place/cairo |
| a-2 words that travel | A3.2 | invention/walid-bimaristan, concept/algebra |
| b-1 a scholar and his city | B3.1 | place/baghdad, person/al-khwarizmi |
| b-2 greeting and address | B3.2 | practice/greeting-salam, concept/kunya-fiqh |
| c-1 language, script, calligraphy | C3.1 | concept/arabiyya, event/arabic-script-origin, concept/islamic-calligraphy |
| d-1 two hospitals | D3.1 | building/bimaristan-adudi, invention/ibn-tulun-bimaristan |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / baghdad, cairo: identify communities where the language is spoken and aspects of their cultures; the records show how two cities were founded, named and grew. The museum does not say what is spoken there today: the Brief tells the class to bring that.
- A3.2 / walid-bimaristan, algebra: identify conventions of language in use (the expectation's own example is words borrowed from other languages); the records show a Persian word taken into Arabic and an Arabic word that gave a science its name elsewhere. Narrow: the Brief says dialect and formality are not served.
- B3.1 / baghdad, al-khwarizmi: speak about a community's contributions (the example is an interview with a significant scientific figure); the records show one scholar, his patron's institution and how his work travelled.
- B3.2 / greeting-salam, kunya-fiqh: identify conventions for greeting and leave-taking and use of address (the expectation's own example is greeting and leave-taking expressions, and formality in address); the records show when the greeting is given and how a kunya honours a person.
- C3.1 / arabiyya, arabic-script-origin, islamic-calligraphy: find out about aspects of cultures from texts; the records show the language, a report about its script and an art of writing.
- D3.1 / bimaristan-adudi, ibn-tulun-bimaristan: write about contributions (the example is comparing health care systems); the records show what two hospitals supplied.

## Judgement calls
- place/damascus not linked: its overview sentence carries no citation, so there is nothing to restate under the provenance rule.
- concept/arabiyya states the merit of Arabic as the Kuwaiti jurists' encyclopaedia gives it; the connection text attributes it ("the Kuwaiti jurists' encyclopaedia, which the record follows") rather than stating it in the museum's voice.
- concept/gratitude-shukr not used for C3.2: it gives no formula of thanks, only a ruling on thanking; a student cannot find "a formula" in it.
- object/ud-shami and concept/al-ud (music, A3.1 example) not used: the first is a one-line catalogue entry; the second is an origin story, not a community's musical heritage.
- Arabic and English of place/cairo and concept/kunya-fiqh were compared; the Abu Talib / Abu Lahab examples were left out of the connection text.
- The greeting record's reward-counting passages are marked needs_source in the record and were not restated.
- Bimaristan: the English record says the word was "taken into Arabic"; the Arabic says "معرّب". Both are rendered as "taken into Arabic".

## More lessons possible
- The Mu'allaqat exhibit (path-muallaqat) and poetry for the poetry examples of A3.2, C3.2 and C2.2: the exhibit has a two-line description and cites only Wikidata; if the poem records of the Mu'allaqat gain prose, a lesson on poems from the Arabic-speaking world becomes possible.
- Hisba and the market inspector (invention/hisba, concept/hisba) for shopping and bargaining in A3.2 and B2.2: the records are about market supervision, not about buyer and seller conversation, so they were not linked.

## Proposals
- Connection kinds: `practice` (the greeting) and `concept` (the kunya, the Arabic language) have no kind; both are filed as `reflection`. A `practice` or `language` kind would say it better.
- A generic course (many languages under one code range) is served only for the language the student takes; the schema has no field for "this course, for Arabic". The subject label and Brief say so in words.
- The source record for this curriculum bears the id `ontario-curriculum-classical-studies-intl-languages`, because the Ministry publishes international languages under that heading; no change needed.

## Results
- Gate (docs/courses/gates/check-ca-on-g11-international-languages-level2.out), last line: `RESULT: GREEN (23 checks passed)`.
- cite-check, last line: `cite-check: 11 pass, 0 fail of 11 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`.
- Counts: 4 units, 6 lessons, 13 connections (12 distinct records), 6 of 34 specific expectations in lessons, 28 in the gap register.

## Runbook problems that cost time
- The runbook step 4 says to read `entity_brief.py` output cut at 2,500 characters; several useful sentences sit lower, so `--full` was needed for algebra and the greeting record.
- `find_entity.py` output for 12 parallel searches exceeds the tool-output limit; filtering with grep is needed (no runbook note).

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g11-international-languages-level2-c-1, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g11-international-languages-level2-a-1, place/baghdad and place/cairo, REMOVE (the reviewer's judgement call on the cities, applied as decided): both connections go, so the whole lesson, its three prose files and its five evidence rows were deleted. A3.1 moved to the gap register with two searches.
- ca-on-g11-international-languages-level2-a-2, invention/walid-bimaristan and concept/algebra, REMOVE: both connections go, so the whole lesson, its prose files and four evidence rows were deleted. A3.2 moved to the gap register with two searches.
- With no lesson left, unit ca-on-g11-international-languages-level2-a (Strand A: Listening) and its three prose files were deleted and the unit removed from the subject's lessons. The subject keeps units b, c and d; its summary and prose do not mention the strand.
- b-2, practice/greeting-salam, FIX: en "is given on meeting and on parting, and that the first is no more deserving than the last" -> "belongs to arriving and to leaving alike, and that the first is no more due than the last" (the level 3 wording; ar and ur were already identical across levels).
- b-2, concept/kunya-fiqh, FIX: now attributed to the Kuwaiti Encyclopaedia of Fiqh ("The Kuwaiti Encyclopaedia of Fiqh says that a kunya is ... and that it belongs to notable people"; ar "تقول الموسوعة الفقهية الكويتية إن الكنية ..."; ur "کویتی فقہی انسائیکلوپیڈیا کہتا ہے کہ کنیت ...").

Verdicts not applied: none.
