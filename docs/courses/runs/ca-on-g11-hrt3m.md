# Run log ca-on-g11-hrt3m
Start 2026-11-12T05:54Z. End 2026-11-12T06:12:43Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 05:54Z Read runbook and fleet prompt. The archive (`.cache/curricula/ontario-hrt3m/`) and manifest (`docs/courses/curricula/ontario-hrt3m.json`, 71 specific, 18 overall, 6 strands, course name "HRT3M", "World Religions and Belief Traditions: Perspectives, Issues, and Challenges") were already present; I did not fetch again. Source id from `ontario_source.py ontario-hrt3m`: source/ontario-curriculum-social-sciences-humanities.
- Read all 71 expectations. Strand A (15) and B3.3, B3.4 name no subject matter: gap register as skills expectations.
- Searched the graph (find_entity.py, entity_brief.py) for each topic; briefs read for every record linked.
- Wrote 10 lessons, 4 units (C, D, E, F), 1 subject through a script kept in the scratchpad (not in the repository); Arabic, English, Urdu throughout.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| c-1 pilgrimage | C2.3 | passage/quran-3-97, practice/hajj, practice/tawaf |
| c-2 death and what follows | C2.4 | concept/akhira, practice/salat-al-janaza, practice/dafn |
| d-1 God, angels, the end | D1.1, D1.2, D1.4 | concept/five-pillars, concept/tawhid, concept/malaika, concept/akhira |
| d-2 giving and fasting | D1.3, D1.5 | practice/zakat, practice/sawm-ramadan |
| d-3 sacred writings | D2.1, D2.2, D2.3, D2.4 | event/compilation-of-quran, concept/al-hadith-al-nabawi, event/farewell-sermon-at-arafat |
| d-4 duties, roles, leaders | D3.1, D3.2, D3.3, D3.4 | concept/islam-din, concept/imam-masjid, person/muhammad, person/khan-abdul-ghaffar-khan |
| e-1 daily prayer | E1.1, E1.2, E1.3, E1.4, E2.4 | passage/quran-4-103, practice/salah, event/change-of-qibla |
| e-2 festival, rite of passage | E2.2, E2.5 | practice/eid-al-fitr, practice/nikah |
| f-1 images, script, mosque | F1.2, F1.3, F1.4 | concept/tasweer-images-and-picturing, concept/islamic-calligraphy, building/prophets-mosque |
| f-2 prejudice | F2.3 | event/international-day-to-combat-islamophobia |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- C2.3 / hajj, tawaf: explain practices tied to a quest for meaning; the records show a pilgrimage with its place, time, conditions and acts.
- C2.4 / akhira, janaza, dafn: explain how ideas of death and the afterlife reflect the journey; the records show a creed's account of the grave and the community's duties at a death.
- D1.1, D1.2, D1.4 / malaika, tawhid, five-pillars, akhira: explain the supernatural, central tenets, afterlife in teaching; the records show a creed's articles on God, angels and the end, and the five acts.
- D1.3, D1.5 / zakat, sawm: describe actions meeting a tradition's expectations; the records show the alms due and the Ramadan fast.
- D2.1 to D2.4 / compilation, hadith, farewell sermon: sacred writings and oral teachings, origin, principles, comparison within a tradition; the records show how the Qur'an was gathered, what hadith is and its standing after the Qur'an, and the principles of one sermon.
- D3.1 to D3.4 / islam-din, imam, Muhammad, Khan: duties, roles, figures, leaders; the records show a definition of Islam, the prayer leader's role, the Prophet's biography and a nonviolent twentieth-century Muslim leader.
- E1.x, E2.4 / salah, change-of-qibla: daily practice, origin, historical event shaping it; the records show the five prayers' beginning and the change of qibla.
- E2.2, E2.5 / eid, nikah: festival origin; teaching in a rite of passage; the nikah record shows only the juristic definition of the contract (see judgement calls).
- F1.2 to F1.4 / tasweer, calligraphy, prophets-mosque: why a form is prohibited, how a tradition shows in a building, why a form has significance.
- F2.3 / UN observance: identify common prejudices; the record shows a prejudice against Muslims named by a UN day.

## Counts
Units 4, lessons 10, connections 28 (27 distinct records), expectations in lessons 26 of 71 specific, expectations in the gap register 45 (17 of them skills expectations: A1.1 to A4.4 and B3.3, B3.4). Overall expectations listed on units: 11 (C1 to F4 of the four strands used). Strands A (research skills) and B (approaches to the study of the sacred) have no unit.

## Judgement calls
- The course compares traditions; the museum holds Islam only. Each lesson Brief says so in plain words, and the class brings the others. No expectation was written as if the museum's part were the whole.
- E2.4 sits with E1.4 in lesson e-1 because the change of qibla serves both (a ritual and a daily practice).
- D3.1 linked to concept/islam-din (a definition that lists what is expected of an adherent): acceptable but modest.
- E2.5 / practice/nikah: the record gives only the schools' definitions of the contract, not rites; the Brief says this. Gap-registering E2.5 would also be defensible.
- F3.2 (Muhammad in the example list) gap-registered: the farewell sermon record has no passage on prejudice, so linking it would stretch it.
- C2.2 (jihad in the example list) gap-registered: concept/jihad is the fiqh of fighting. Not linked on purpose.
- concept/imam-masjid and concept/islamic-calligraphy are thin records (one Wikidata-sourced paragraph each); the connections restate only that paragraph.
- Candidates left out: event/uthman-standardizes-mushaf, practice/zakat-al-fitr, practice/udhiyya, concept/masjid (its text is lecture notes), concept/iman, concept/shirk. Possible extra lessons ("More lessons possible"): standardization of the mushaf under Uthman (D2.2), Eid al-Adha and the sacrifice (E2.2), zakat al-fitr (D1.3).

## Gates
Ingestion gate (--strict --save), saved at docs/courses/gates/check-ca-on-g11-hrt3m.out: RESULT: GREEN (23 checks passed).
cite-check over the 15 records: "cite-check: 15 pass, 0 fail of 15 record(s) — ..."

## Runbook problems
- `timeout` does not exist on this machine (macOS), and zsh needs unquoted-list splitting (`${=ids}`) to pass many ids to cite-check; the runbook command line should show both.
- The runbook gives no instruction for a quoted expectation ending in an example list inside the middle of a sentence; quote_official handled it, but the Arabic and Urdu translations must keep each mark by hand.
- entity_brief.py prints the Arabic prose before the English and is long; a flag to print only summary, English prose and sources would save much reading.
- `fetch_ontario.py --list "HRT3M"` failed with a JSON error in this run while the manifest was already there; I did not need it.

## Proposals
- Connection kinds: no `practice`, `concept` or `doctrine` kind; `reflection` stands in for practices and beliefs, `career` for a role, `story` for an event or document.
- A link from each expectation to the Ministry's page for it would restore the text cut at 40 words.
- A comparative course such as HRT3M would profit from a field saying "this lesson serves one tradition of several", so the page can say it without relying on the Brief.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g11-hrt3m-f-1, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Beyond the card: its question "Why might a culture honour the art of writing above other arts?" (a premise of the removed superlative) -> "What can the shapes of a script tell you about the people who used it?" (ar, ur the same); the prose heading "Why forbid, and why honour?" -> "What does a tradition forbid, and what does it make?" (ar and ur headings and first sentence changed to match). Open point for the coordinator: F1.4 ("why certain cultural forms have special significance") was served in part by the superlative; it now rests on the Prophet's Mosque card alone, and the coordinator may want to check whether F1.4 should move to the gap register. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the sweep review (religion and philosophy)

Source: docs/courses-mission/verifier/sweep-secondary-religion-philosophy.md (this course's lessons only). Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. A connection verdict FIX is KEEP-BUT-FIX; REMOVE is MOVE-TO-GAP of that connection. In every card, in en, ar and ur, "the record says / gives / calls" (ar "يقول/يذكر السجل", ur "اندراج/ریکارڈ ... بتاتا ہے") was replaced by the named source the linked record itself gives for the sentence (Kuwaiti encyclopaedia of jurisprudence, al-Mubarakpuri's The Sealed Nectar, Ibn Khuzayma's Sahih, al-Tahawi, al-Samhudi, al-Bukhari's editor, Wikidata, Wikipedia, UN resolution A/RES/76/254). Where a record sentence has no citation and names no one, the clause was cut (below).

Coordinator instructions, applied first:
- event/change-of-qibla removed from e-1 (its prose, Brief, Try this and summary in en, ar, ur changed to match); expectations E1.4 and E2.4 moved to the gap register. After the edit `grep -l "event/change-of-qibla" data/course/*.yaml` finds no file; the only other use in the Ontario fleet was hrf3o-c-2, also removed.
- concept/malaika removed from d-1 (prose and summary changed; D1.1, "the role of entities associated with the supernatural", has no remaining connection and moved to the gap register. The review listed D1.1 under five-pillars, but that card is about acts, not entities, so I judged D1.1 no longer served).
- passage/quran-3-97 removed from c-1 (it had no prose mention).

Lesson by lesson:
- c-1: quran-3-97 removed (instruction 2). practice/hajj FIX: "The record calls it ..." -> "The Kuwaiti encyclopaedia of jurisprudence defines it ..." plus the clause "The entry gives the rite's conditions, not the pilgrim's experience of it" (ar: والمدخل يذكر شروط الشعيرة لا تجربة الحاج فيها; ur: اندراج رسم کی شرائط بتاتا ہے، حاجی کا تجربہ نہیں). practice/tawaf FIX: the Hanafi/Maliki/Hanbali seven versus Shafi'i six count cut in all three languages (ar "سبعة عند الحنفية ... وستة عند الشافعية", ur "سات ... چھ" removed); kept "prescribed to greet the House"; named the Kuwaiti encyclopaedia.
- c-2: practice/dafn REMOVED (b, and the ruling stated in the museum's voice); evidence rows deleted; Brief, section line and Try this rewritten (no burial). practice/salat-al-janaza FIX: the "communal obligation / communal sunna" classification dropped; card now built on the transmitted supplication ("O God, forgive him, have mercy on him, keep him well and pardon him", ar «اللهم اغفر له وارحمه وعافه واعفُ عنه», ur «اے اللہ! اسے بخش دے، اس پر رحم فرما، اسے عافیت دے اور اسے معاف کر دے») and named to the Kuwaiti encyclopaedia. concept/akhira: "as the record gives it" -> "Al-Tahawi's creed affirms" (named).
- d-1: malaika removed (instruction 2). concept/akhira: "The record gives al-Tahawi's articles" -> "Al-Tahawi's creed lists the articles". five-pillars and tawhid unchanged (already attributed).
- d-2: zakat and sawm-ramadan: "the record says" -> "the Kuwaiti encyclopaedia of jurisprudence says". Review polish applied: sawm-ramadan now says what the fast is ("Muslims fast in Ramadan by abstaining from food and drink from dawn to sunset"; ar يصوم المسلمون في رمضان بالإمساك عن الطعام والشراب من الفجر إلى الغروب; ur مسلمان رمضان میں فجر سے غروبِ آفتاب تک کھانے پینے سے رک کر روزہ رکھتے ہیں), stated plainly as the record's own uncited text.
- d-3: farewell-sermon: "the record says" -> "Al-Mubarakpuri, in The Sealed Nectar, reports" (the Arabic card already had "التاسع"; no change needed there). al-hadith-al-nabawi: the clause "It is the second source of Islam after the Qur'an: it explains what the Qur'an states in general terms ..." cut in all three languages (the record's Standing text has no citation and names no one); the definition (cited to the hadith collections) kept; Try this changed from "what the records say about its place" to "who is named as keeping it". compilation-of-quran unchanged (already attributed to al-Bukhari from Zayd).
- d-4: concept/imam-masjid FIX: "The record defines ..." -> "Wikidata defines the imam as ..."; "the record shows it carries more than one meaning" (an inference) cut in all three languages. person/khan-abdul-ghaffar-khan FIX: attributed to Wikipedia's article; "an estimated 200 to 250" killed cut (ar "نحو 200 إلى 250", ur "۲۰۰ سے ۲۵۰"); "a jihad in which only the enemy held swords" kept only as "in its wording" of Wikipedia. person/muhammad: "the record says" -> al-Mubarakpuri. concept/islam-din: "as the editor explains" -> named (the editor of al-Bukhari's Sahih), the hadith named to Ibn Khuzayma.
- e-1: change-of-qibla removed (instruction 1). practice/salah: "The record calls the prayer" -> "Ibn Khuzayma's Sahih describes the prayer". Qur'an card: closing question no longer asks about "what the record says". Summary and Brief now name E1.1-E1.3 only.
- e-2: practice/eid-al-fitr FIX: the prayer-ruling sentence (emphatic sunna / obligatory / communal obligation) replaced by "Eid al-Fitr falls on the first of Shawwal and closes Ramadan" (the record's own summary, an entity fact); the name's etymology and the two Eids attributed to the Kuwaiti encyclopaedia. practice/nikah REMOVED (b, d) as the review says; the Hanafi wording "ownership of licit enjoyment of a woman" is therefore no longer in either course; E2.5 moved to the gap register; summary, Brief, section and Try this rewritten for one festival.
- f-1: tasweer: "The record says" -> "The Kuwaiti encyclopaedia of jurisprudence says ... it reports three views among jurists". concept/islamic-calligraphy FIX: "Wikidata describes ... and ties it to the writing of the Qur'an" (the link restated, the superlative never); closing question changed to "How might an art of writing be tied to the writing of a scripture?". building/prophets-mosque: "the record says" -> al-Samhudi in Wafa' al-wafa.
- f-2: international-day: "the record says" -> "General Assembly resolution A/RES/76/254 stresses ..." and "According to Wikipedia, the date marks ... Christchurch" (the date claim is Wikipedia's, the resolution's is the UN page's).

Expectation codes moved to the gap register: E1.4, E2.4 (events shaping practice; the only record was change-of-qibla), E2.5 (rites of passage; nikah), D1.1 (supernatural entities; malaika). Not moved: D1.4 (time, creation and the afterlife): akhira serves the afterlife part, and an expectation cannot be split; the review's note that no card serves time and creation stands, and the coordinator may decide to move it.

### Records for the founder
- concept/malaika (outside this task's files, not edited): the record carries a preacher's remark contrasting the Companions with "the Children of Israel". The cards did not use the material; the link was removed from ca-on-g11-hrt3m-d-1 as a precaution because a student who opens the record reads it. The founder may restore it.
- passage/quran-3-97 (not edited): the passage page's commentary reports a hadith about dying "a Jew or a Christian". The cards did not use the material; the links (hrt3m-c-1, hrf3o-e-2) were removed as a precaution because a student who opens the record reads it. The founder may restore them.
- event/change-of-qibla (not edited): the record, in its own voice, uses hostile language about Jews ("Jewish hypocrites", "people of treachery and betrayal") in its Sealed Nectar section; withdrawn from both courses on the reviewer's finding, not to be linked by any lesson.

Verdicts not applied: none. Verdicts applied with a judgement: D1.1 moved to the gap (see above); the hadith "second source" clause cut under the instruction on uncited clauses, although the review marked the card KEEP.
