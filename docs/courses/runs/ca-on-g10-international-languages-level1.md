# Run log ca-on-g10-international-languages-level1
Start 2026-11-12T06:44Z. End 2026-11-12T06:54Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:44Z Read the runbook and fleet prompt. `fetch_ontario.py --list LBABD` printed the exact name "LBABD – LDYBD" (en dash). Fetched to `.cache/curricula/ontario-intl-languages-level1/` (4 strands, 12 overall, 34 specific); manifest `docs/courses/curricula/ontario-intl-languages-level1.json`. Source id from `ontario_source.py`: source/ontario-curriculum-classical-studies-intl-languages (the same record as the Level 2 sibling).
- Read all 34 expectations. Candidates: the intercultural "3" expectations of each strand (A3, B3, C3, D3). The Level 1 example lists differ from Level 2: greetings, farewells, courtesy and gratitude (A3.2, B3.2, D3.2), naming practices and nicknames (B3.1), origins of names (D3.1), traditions and festivals (C3.1), a significant individual (B3.1), education systems (D3.1). The other 26 specific expectations are strategies, text forms and the writing process.
- Searched with find_entity.py (about 20 calls): Eid, greeting, kunya and naming, Arabic language, festival and Ramadan, cuisine, music and song, gratitude, letters, nicknames, hospitality, calligraphy, proverb, dialect, mosque, school and madrasa, story, clothing, social media, lyrics. Read the full briefs of every record linked.
- Wrote 7 lessons, 4 units, 1 subject by a script kept in the scratchpad, plus gap register, evidence, prose in three languages.
- The checker could not load `data/course/ca-on-g11-sbi3u-d-1.yaml` and `ca-on-g12-snc4m-c-2.yaml` (another agent's files, mid-write, YAML error "mapping values are not allowed here"). I did not touch them. I ran the checker from a mirror directory in the scratchpad whose `data/course/` links every file except those two (everything else linked to the worktree; `.git` linked too, which the baseline check needs). The `--save` output went to the real `docs/courses/gates/`.

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| a-1 where Arabic is spoken | A3.1 | language/arabic, place/baghdad |
| a-2 greeting, replying, thanking | A3.2 | practice/greeting-salam, concept/gratitude-shukr |
| b-1 a scholar and naming | B3.1 | person/al-khwarizmi, concept/tasmiya-naming |
| b-2 greeting, leave-taking, address | B3.2 | practice/greeting-salam, concept/kunya-fiqh |
| c-1 a festival and an art of writing | C3.1 | practice/eid-al-fitr, concept/islamic-calligraphy |
| d-1 what names mean, and schools | D3.1 | concept/asma-al-arab-min-al-nabat, concept/madrasa |
| d-2 a thank-you note | D3.2 | concept/gratitude-shukr |

## What was reused from the Level 2 sibling (course/ca-on-g11-international-languages-level2)
- The three-language translation of the specific expectation texts A3.1, A3.2, B3.1, B3.2, C3.1, D3.1 (the sibling's `quote_official` English is byte-equal to this course's; a script asserted it) and of the four overall expectations A3, B3, C3, D3 (same assertion). D3.2 was a gap in the sibling, so its Arabic and Urdu are new here.
- Three connection texts, re-read against the records' current briefs and given new closing questions where the Level 1 wording differs: place/baghdad (A3.1; the sibling's a-1 "before" text, now "within"), person/al-khwarizmi (B3.1; the sibling's b-1 "within" text, now "before"), and both connections of b-2 (practice/greeting-salam, concept/kunya-fiqh) taken whole. b-2's lesson prose is the sibling's with courtesy and body language added to what the class brings.
- The subject and unit label and summary texts were rewritten for Level 1; the structure is the sibling's.
- Not reused: any of the sibling's other connections (walid-bimaristan, algebra, cairo, arabiyya, arabic-script-origin, the two hospitals) because the Level 1 expectations do not ask for them.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / arabic: identify communities where the language is spoken and the status of the language; the record describes the language and its historical spread, and says nothing of speakers today (the Brief and the text say so).
- A3.1 / baghdad: find out about a community and its culture; the record shows how a city was founded and named.
- A3.2 / greeting-salam, gratitude-shukr: identify expressions of courtesy such as greetings, and ways to express gratitude; the records show how a greeting is returned and what thanks is. Narrow: no phrases, the Brief says so.
- B3.1 / al-khwarizmi, tasmiya-naming: identify a significant individual and describe accomplishments; share naming practices; the records show one scholar and how jurists describe the naming of a child.
- B3.2 / greeting-salam, kunya-fiqh: use greeting and leave-taking and forms of address matching formality; the records show when the greeting is given and how a kunya honours.
- C3.1 / eid-al-fitr, islamic-calligraphy: research traditions and festivals; find an aspect of culture in a comic strip or text; the records show a festival's name, number and takbir, and an art of writing.
- D3.1 / asma-al-arab, madrasa: write a paragraph on the origins and meaning of names; compare education systems; the records show al-Hamdani's observation on names and Yeomans on the madrasa's origin. Narrow: one institution's history, not a system today.
- D3.2 / gratitude-shukr: write a thank-you note using expressions of gratitude; the record says what thanks is and that a good word suffices. Narrow: no formulas; the Brief says the class brings them.

## Judgement calls
- Fit the grade: Grade 10 (secondary). Every linked record is suitable; no record on slavery, killing, sex or graphic subjects was considered. The tasmiya record's rulings on stillborn children, forbidden names and so on were left out of the text; only the sense, the father's right and the day of naming are restated, with attribution. The record's aqiqa sacrifice is mentioned only as the point from which the Malikis count.
- Each language follows the record's own prose: the Arabic restates the Arabic record, the English the English record. Urdu records of several of these are thin or machine drafts, so the Urdu was written from the Arabic and English texts and checked against the Urdu records where they exist (Eid, shukr, tasmiya, madrasa, asma al-arab, calligraphy, Arabic, kunya).
- practice/greeting-salam: the Arabic and English summary both cite Sha'rawi on returning a greeting, and that sentence is what a-2 restates. The reward-counting passages (needs_source) were not used.
- language/arabic: the record's summary cites only Wikidata, so only that sentence is restated; the sheikh's remarks on the language (opinions, needs_source) were not.
- place/baghdad: the English and Arabic records agree on the overview sentences used. Its Urdu record has only a one-line summary, so the Urdu follows the Arabic and English.
- concept/asma-al-arab-min-al-nabat: the English prose says "thorny trees that grow in pasture"; the English summary says "thorny grazing shrubs". The English prose wording was used. For the women's names the prose says "names of tenderness and fruits"; the Arabic says النواعم والثمار; both were followed. The names listed in the text are a subset (Talha, Samura, Sabra; Bashama, Busra).
- concept/madrasa: the Wikidata summary sentence carries no useful history; the Yeomans paragraph is what the text restates (attributed to him: "Yeomans writes").
- concept/gratitude-shukr is used three times (a-2 as the acknowledgement of a kindness; d-2 as a good word suffices). The Level 2 run kept this record out of its C3.2 lesson because the expectation asked for formulas of thanks, invitation and excuse. The Level 1 D3.2 expectation asks the student to write a thank-you note using expressions of gratitude, and A3.2 asks for ways to express gratitude; the record says what thanks is, not which words to say. It is therefore linked narrowly and the Brief and the Try this say that the expressions themselves come from the class. If the founder prefers the stricter reading, d-2 should move to the gap register.
- practice/eid-al-fitr: only the cited overview and takbir sentences are restated. The summary's "feasts and visits" and the Explorers section carry no citation and were not used. The record's own words on the day's customs (bath, keeping the night) were left out as ritual detail beyond what the expectation asks.
- C3.2 is in the gap register with reasons: no record on dialects, social networking, letter or e-mail conventions, or song lyrics; concept/al-mukatabat is about letters of rulers and was not stretched.
- Not linked: concept/ikram-al-dayf (meal-time customs, B3.1 example): the record is one sheikh's presentation, with its anecdotes marked needs_source; nothing in it is cited beyond the sheikh's lecture, and it contains no meal customs a student could describe and compare. Not linked: practice/sawm-ramadan and Ramadan programmes: a ritual-rulings subject beyond the expectations.

## More lessons possible
- A lesson on the Mu'allaqat or other poems for song-lyric expectations (C3.1, C3.2) if poem records gain prose.
- A second festival lesson on the other Eid, for C3.1 and A3.1 (holiday descriptions), if a practice record for Eid al-Adha with cited prose is added (search found none).

## Proposals
- Connection kinds: `practice`, `concept`, `language` and `festival` have no kind; they are filed as `reflection` (an art form as `object`). A `practice` or `language` kind would say it better.
- A generic course (many languages under one code range) is served only for the language the student takes; the schema has no field for "this course, for Arabic". The subject label and Brief say so in words.
- The checker should skip, with a warning, a data/course file that does not parse rather than stop for every course; during a fleet run another agent's half-written file stopped the gate for everyone.

## Results
- Gate (docs/courses/gates/check-ca-on-g10-international-languages-level1.out), last line: `RESULT: GREEN (23 checks passed)`.
- cite-check, last line: `cite-check: 12 pass, 0 fail of 12 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`.
- Counts: 4 units, 7 lessons, 13 connections (11 distinct records), 7 of 34 specific expectations in lessons, 27 in the gap register.

## Runbook problems that cost time
- The gate and the alias search load every file in data/course; one agent's unparseable YAML (ca-on-g11-sbi3u-d-1.yaml, ca-on-g12-snc4m-c-2.yaml) blocked the gate for all agents, and the runbook says nothing of it. A mirror directory with symlinks (and `.git` linked, for the baseline check) was the workaround.
- `find_entity.py` output for many parallel searches exceeds the tool-output limit; filtering with grep is needed.
- The sibling's expectation translations cannot be reused for an expectation the sibling put in the gap register (D3.2 here); the script must be told.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g10-international-languages-level1-c-1, KEEP-BUT-FIX: calligraphy superlative. This lesson was not in the review's list of eleven, but it repeated the same claim (found by searching every course record for it), so it was corrected the same way. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g10-international-languages-level1-a-1, place/baghdad, REMOVE (the reviewer's judgement call, applied as decided): connection deleted, its evidence row deleted. The lesson stands on language/arabic. The title ("A language and a city" -> "A language"), summary, Brief ("and the story of one city" removed) and Try this (now only the Arabic record; "two sentences about the language, then compare with the language of your own community") were changed in en, ar, ur so they do not describe the removed card.
- a-2 and d-2, concept/gratitude-shukr, FIX: both cards now name the Kuwaiti Encyclopaedia of Fiqh. a-2 en "as the record defines it" -> "as the Kuwaiti Encyclopaedia of Fiqh defines it" (ar "كما يعرّفه السجل" -> "كما تعرّفه الموسوعة الفقهية الكويتية"; ur "اندراج کے مطابق" -> "کویتی فقہی انسائیکلوپیڈیا کے مطابق"). d-2 en "The record on shukr describes it as" -> "The Kuwaiti Encyclopaedia of Fiqh describes shukr as" (ar, ur likewise), so a "good word is enough" is the encyclopaedia's. The d-2 Brief already says the museum offers only what the record says about its meaning and that the Arabic expressions of thanks are the class's, so it was left as it is.
- b-1, concept/tasmiya-naming, FIX: "The record on tasmiya says the jurists use the word ... and that the father has the better right" -> "The Kuwaiti Encyclopaedia of Fiqh records that the jurists use the word tasmiya ..., and that they hold that the father has the better right ..."; added "This is a legal discussion, not a custom of any community." (ar, ur the same).
- b-2, practice/greeting-salam, FIX: en "is given on meeting and on parting, and that the first is no more deserving than the last" -> "belongs to arriving and to leaving alike, and that the first is no more due than the last" (the level 3 wording; ar and ur were already identical across levels). Evidence row updated.
- b-2, concept/kunya-fiqh, FIX: "A kunya is a name ..." -> "The Kuwaiti Encyclopaedia of Fiqh says that a kunya is a name ... It says it is a name besides the given name and the laqab, ... and that it belongs to notable people." (ar "تقول الموسوعة الفقهية الكويتية إن ..."; ur "کویتی فقہی انسائیکلوپیڈیا کہتا ہے کہ ..."). The card still uses only the definition and the rule as the encyclopaedia's, and was not extended.
- c-1, practice/eid-al-fitr, FIX: the card is now the level 3 body in all three languages: attributed to the Kuwaiti jurists' encyclopaedia, "and no other" / "وليس لهم عيد غيرهما" / "اس کے سوا کوئی عید نہیں" removed, "takbir on the two Eids" -> "takbir is prescribed". The level 1 title and closing question were kept. Evidence rows updated. (The ur and ar lines contain a colon, so the YAML lines were quoted.)
- d-1, concept/madrasa, FIX: en "the first being the Nizamiyya ... which became the model for later ones" -> "Yeomans names the Nizamiyya, ..., as the first, and in his view it became the model for later ones" (ar "ويسمّي يومانز النظامية ... أولاها، ويرى أنها صارت نموذجاً"; ur "یومنز ... کو پہلا بتاتے ہیں، اور ان کی رائے میں ...").
- Cross-level (item 5): the greeting card's English is now the same wording at levels 1, 2 and 3; the Eid card at level 1 matches level 3; the shukr cards both name the same source.

Verdicts not applied: none.
