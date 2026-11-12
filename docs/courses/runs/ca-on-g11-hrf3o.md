# Run log: ca-on-g11-hrf3o

Started: 2026-11-12T05:54Z (date -u). Ended: 2026-11-12T06:17Z.
Agent: Claude Code; claude-sonnet-5-5. Fleet run (shared worktree; graph already built; no validate, no tests, no git state changes).

## Step 0-1 (05:54Z)
- Ministry name found with `fetch_ontario.py --list "HRF"`: `HRF3O` (the Grade 11 pattern returned nothing, because the Ministry's names for secondary courses are the codes). Fetch ok: archive slug `ontario-hrf3o`, manifest `docs/courses/curricula/ontario-hrf3o.json`. Course: World Religions and Belief Traditions in Daily Life, Grade 11. 6 strands (A-F), 17 overall, 62 specific expectations; all have codes.
- Source record: `ontario_source.py ontario-hrf3o` printed `source/ontario-curriculum-social-sciences-humanities` (reused or made by the tool; not edited).
- Reused `course/ca-on-g11` and `course/ca-on-english`, not edited.

## Step 4 mapping: judgements
- This course is about all religions; the museum can speak only for Islam. Every lesson Brief says so and tells the class to add the other traditions. Strand A (16 expectations, research skills) goes to the register as skills expectations.
- Links are made only where the museum's record, in its cited prose, says what the expectation asks for. Where a record's prose is thin (concept/imam-masjid, concept/muezzin, concept/islamic-calligraphy, practice/mawlid-al-nabi: one or two sentences cited to Wikidata) I used only the stated sentences.
- Uncited sentences in the linked record: two statements in concept/al-hadith-al-nabawi ("second source of Islam after the Qur'an", "gathered in books arranged by chapters or by musnads") carry no citation marker in the record's prose, only its Overview citation to Bukhari and Muslim; the connection cites those two sources, which the record lists. Flagged for the reviewer.
- Link sentences ("The expectation asks the student to ___; this record shows ___"), one per lesson:
  - B-1 B2.2: explain the perceived nature of the divine; tawhid shows the Tahawi creed's opening (one, nothing like Him); shahada shows what the faith names first.
  - B-2 B1.2/B1.3/B3.4: commemoration importance; identify faiths coexisting; belief affecting relations. Canadian Islamic History Month (a federal page: a month to recognise Muslims' history and contributions, for dialogue and inclusion); Constitution of Medina (one community, Jews with freedom of religion and property); Muslim 45 (loving for one's brother is among the qualities of faith). Honest limit: the Medina treaty is a historical case, and B3.4 is served by a single report; the Brief says what the class adds.
  - C-1 C1.1/C1.2: episodes and a major figure; person/muhammad (born, revelation, Hijra, death, from al-Mubarakpuri), event/hijra, event/farewell-pilgrimage.
  - C-2 C1.3/C1.4: Ashura (fast linked to the day God saved the Children of Israel, per the record) for incident to ritual; change of the qibla for an event changing practice.
  - C-3 C2.1/C2.2: madhhab (four schools), imam (and the Shia sense of the word), muezzin. Thin records; the Brief says so. The unifying elements of C2.1 are left to the class's question.
  - D-1 D1.1-D1.3: Ramadan, Eid al-Fitr, Eid al-Adha (only what their cited prose states; the Eid al-Adha record says nothing of Ibrahim, so no sacred-story link is made).
  - D-2 D2.1/D2.2: aqiqa, nikah, funeral prayer. The records give rulings and forms rather than family customs; the Brief says so.
  - D-3 D3.1-D3.3: wudu, adhan, salah. The curriculum itself names Salah in D3.2.
  - E-1 E1.1-E1.3: Qur'an (work record), hadith (second source, chain), Islamic calligraphy (importance of the written text). The curriculum names the Qur'an in E1.3.
  - E-2 E2.1-E2.3: Qur'an connection `3:97` (the Hajj record cites this verse; text invites reading, does not state its meaning), Ramadan (revelation of the Qur'an in it), Muslim 45 as a precept (E2.2).
  - F-1 F1.1/F1.2: hilal, Hijri calendar, Umar's dating decree.
  - F-2 F2.1/F2.2/F2.4: Prophet's Mosque (features), Kaaba, hajj (the curriculum names Mecca and the hajj).
- Considered and not used: event/umar-covenant-jerusalem (first drafted in B-2; replaced by Muslim 45 to serve B3.4 within three connections); practice/mawlid-al-nabi (two Wikidata-cited sentences); concept/laylat-al-qadr (the record is only a historical reading of "thousand months" as Umayyad rule); concept/surat-al-mutadayyin-fi-al-ilam for C3.3 (a studio poll in a lecture series, mostly speakers' views); concept/hijab and halal records for C2.4 (rulings, nothing on Canada).
- Kind choices (closed list): practices and concepts as `reflection`; events and persons as `story`; imam and muezzin as `career`; buildings as `place`; Qur'an work and calligraphy as `object`; Muslim 45 as `hadith`.
- Plan (strand letter, lessons, expectations): B-1 B2.2; B-2 B1.2 B1.3 B3.4; C-1 C1.1 C1.2; C-2 C1.3 C1.4; C-3 C2.1 C2.2; D-1 D1.1 D1.2 D1.3; D-2 D2.1 D2.2; D-3 D3.1 D3.2 D3.3; E-1 E1.1 E1.2 E1.3; E-2 E2.1 E2.2 E2.3; F-1 F1.1 F1.2; F-2 F2.1 F2.2 F2.4. Result: 29 specific expectations in lessons, 33 in the register, of 62.
- Searches for the register were run with `find_entity.py` and the counts quoted in the register are the counts it printed.

## Steps 5-7 (06:08-06:16Z)
- Records written by a generator kept in the scratchpad (not committed); expectation `en` texts come from `quote_official` byte for byte; Arabic and Urdu parentheticals containing Arabic script are wrapped in U+2066/U+2069 by the same script.
- Created: 1 subject, 5 units (B-F), 12 lessons, 34 connections to 33 distinct records; prose in ar, en, ur for each of the 18 records (54 files); gap register (33 entries); evidence file; gate output.
- Gate: `check_course.py course/ca-on-g11-hrf3o --official .cache/curricula/ontario-hrf3o/official.json --strict --save` printed `RESULT: GREEN (23 checks passed)` on the first run.
- cite-check over the 18 ids: `cite-check: 18 pass, 0 fail of 18 record(s)`.
- validate, tests and builds were not run (fleet rule).

## More lessons possible
- C3.3 (bias in media representations of religions): concept/surat-al-mutadayyin-fi-al-ilam could carry a lesson if a reviewer accepts a studio-audience poll as a basis; kept in the register meanwhile.
- D1.2 / D1.1: Mawlid al-Nabi and Ashura as festivals, if the Mawlid record is enriched beyond its two Wikidata-cited sentences.
- C2.1: the Shia branch (group/shia has one Ibn al-Nadim sentence and says a second source is needed).
- B-1 B2.1 terms: a lesson on "tawhid", "iman", "islam-din" as vocabulary could carry B2.1 if the class vocabulary list is taken as the Islamic examples only.

## Runbook problems
- `fetch_ontario.py --list "Grade 11"` finds nothing: secondary courses are listed by code (`--list "HRF"`). The runbook example only shows elementary names.
- Runbook step 2 for Ontario says the tool "finds or makes" the source record; the output gave no note of which, so the log cannot say whether a new file `data/source/ontario-curriculum-social-sciences-humanities.yaml` was created by this run or already existed (it carries `ontario_source.py` as its generator).
- Runbook step 8 and the cite-check usage: in zsh a variable list of ids is not word-split, and the first call failed with "record-exists" for the joined string; `xargs` fixed it.
- The runbook's "two to four expectations per lesson" is met except B-1, which has one (B2.2 is the only honest link in its strand); recorded here rather than padded.

## Proposals
- Connection kinds: the closed list has no `practice`, `concept` or `institution`; this course used `reflection` for practices and concepts, `career` for imam and muezzin, `story` for a treaty and a commemoration. A `practice` kind would fit a course about rites.
- A comparative course (all religions) needs a way to say "the museum serves one tradition here": today it is only in each Brief.
- The curriculum's own examples (Qur'an, hajj, Salah, hijab, "representations of Islam in the media") are not tied to museum records anywhere except by a lesson; a table from curriculum example to record would help.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g11-hrf3o-e-1, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Beyond the card: the card's title "Beautiful writing for a sacred book" -> "Beautiful writing" (ar "الخط الجميل", ur "خوبصورت تحریر"), because the link to the Qur'an is the unsourced part; its question "How might the importance of a sacred writing show in the art around it?" -> "How does the look of a script change the way you meet the words it carries?"; the lesson summary "and the art that grew around the written one" -> "and an art of writing the Arabic letter" (ar, ur the same). Open point for the coordinator: E1.1 to E1.3 are about sacred writings and oral teachings; the Qur'an and hadith cards serve them, and the calligraphy card is now only an art-of-script card. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the sweep review (religion and philosophy)

Source: docs/courses-mission/verifier/sweep-secondary-religion-philosophy.md (this course's lessons only). Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. A connection verdict FIX is KEEP-BUT-FIX; REMOVE is MOVE-TO-GAP of that connection. In every card, in en, ar and ur, "the record says / gives / describes" (ar "يذكر السجل", ur "ریکارڈ بتاتا ہے") was replaced by the named source the linked record itself gives for the sentence (Kuwaiti encyclopaedia of jurisprudence, al-Mubarakpuri, Ibn Hisham relaying Ibn Ishaq, Ibn Khuzayma, al-Tahawi, al-Samhudi, Ibn al-Athir, al-Suyuti, Wikidata, the Government of Canada page, Sahih Muslim). Where a record sentence has no citation and names no one, the clause was cut.

Coordinator instructions, applied first:
- event/change-of-qibla removed from c-2 (prose, Brief, Try this and summary in en, ar, ur changed; C1.4 moved to the gap register). `grep -l "event/change-of-qibla" data/course/*.yaml` now finds no file in the fleet.
- passage/quran-3-97 removed from e-2 (Brief, section and Try this changed in en, ar, ur; E2.1, "the influence of sacred writings and oral teachings in the origin and development of religions", was served by that card alone in my reading and moved to the gap register). concept/malaika is not linked in this course.

Lesson by lesson:
- b-1: shahada: "The record gives the two testimonies" -> "Ibn Khuzayma's Sahih gives". tawhid already named al-Tahawi.
- b-2: canadian-islamic-history-month: "The record says" -> "According to the Government of Canada's page on commemorations". constitution-of-medina FIX: "Al-Mubarakpuri writes in The Sealed Nectar ..." and the record's own hedge added: "The museum's record cautions that the sources preserve only parts of the document and differ on the order and detail of its clauses" (ar ويحذّر سجل المتحف ...; ur عجائب گھر کا اندراج خبردار کرتا ہے ...). muslim-0045: "The record places" -> "Sahih Muslim places".
- c-1: muhammad, hijra, farewell-pilgrimage: attributed to al-Mubarakpuri; al-Mubarakpuri and al-Mas'udi (date); Ibn Ishaq and al-Bukhari (the companions' earlier emigration); Ibn Hisham relaying Ibn Ishaq. "The record, following al-Mubarakpuri, gives" removed.
- c-2: change-of-qibla REMOVED (instruction 1). ashura: "The record says" -> "The Kuwaiti encyclopaedia of jurisprudence reports"; kept as "In one report it gives".
- c-3: madhhab -> Kuwaiti encyclopaedia. imam-masjid FIX -> "Wikidata defines the imam". muezzin FIX: "Bilal ibn Rabah was the first muezzin in Islam" now "Wikidata ... states that"; the closing question, which asked for a purpose the record does not give, replaced by "According to these two entries, how does the muezzin's role differ from the imam's?" (ar, ur the same).
- d-1: sawm-ramadan, eid-al-fitr -> Kuwaiti encyclopaedia. eid-al-adha FIX: attributed; the closing "what would your class need to add to explain why the day is kept" (which conceded D1.1) replaced by "Which of these details name something done on the day?" (D1.2 only). Not applied: D1.1 left on the lesson because the review marks sawm-ramadan KEEP for D1.1-D1.3.
- d-2: nikah REMOVED (b, d); the Hanafi wording "ownership of licit enjoyment of a woman" is gone from the course. aqiqa: Kuwaiti encyclopaedia named, Encyclopaedia of Islam "is cited for" the seventh-day sacrifice. salat-al-janaza: attributed; the supplication wording added (as the review suggests, to serve "purpose"). Summary, Brief and Try this changed from three rites to two. D2.1 and D2.2 stay (aqiqa, janaza).
- d-3: wudu, adhan -> Kuwaiti encyclopaedia; salah -> Ibn Khuzayma's Sahih.
- e-1: islamic-calligraphy REMOVED (b: a sacred text or teaching is the missing noun); summary, Brief, section and Try this changed to the Qur'an and the hadith. work/quran: "The record describes" removed (the belief is attributed to Muslims). al-hadith-al-nabawi: the uncited "second source" and "gathered in books" clauses cut; definition kept.
- e-2: quran-3-97 removed (instruction 2), E2.1 to the gap register. ramadan-fiqh -> Kuwaiti encyclopaedia; muslim-0045 -> Sahih Muslim.
- f-1: hilal-fiqh -> Kuwaiti encyclopaedia; hijri-calendar -> "Al-Suyuti's Tarikh al-Khulafa' is the source cited". hijri-calendar-decree FIX: named Ibn al-Athir's al-Kamil and added the calendar record's hedge that the reports differ on the occasion and the date and need a second source (evidence row added).
- f-2: prophets-mosque -> al-Samhudi in Wafa' al-wafa; kaaba FIX -> "Al-Mubarakpuri writes in The Sealed Nectar that the Kaaba is the House that Abraham and his son Ismail built"; hajj -> Kuwaiti encyclopaedia.

Expectation codes moved to the gap register: C1.4 (events changing practice; the only record was change-of-qibla), E2.1 (sacred writings in a religion's origin and development; quran-3-97 only).

### Records for the founder
- passage/quran-3-97 (not edited): the passage page's commentary reports a hadith about dying "a Jew or a Christian". The cards did not use the material; the link (hrf3o-e-2, and hrt3m-c-1) was removed as a precaution because a student who opens the record reads it. The founder may restore it.
- concept/malaika (not edited): the record carries a preacher's remark contrasting the Companions with "the Children of Israel"; not linked in this course, removed from hrt3m-d-1 on the same precaution.
- event/change-of-qibla (not edited): hostile language about Jews in the record's own voice; withdrawn from both courses.
- practice/ashura (not edited): gives "differing from the Jews" as one scholarly reason for fasting the ninth; the review calls it neutral. The card does not use it and the link stays.

Verdicts not applied: none. Verdict applied with a judgement: E2.1 moved to the gap with quran-3-97 (the review listed E2.1-E2.3 against that card).
