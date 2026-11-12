# Run log: ca-on-g12-hsc4m (HSC4M, World Cultures, Ontario Grade 12)

Start 2026-11-12T05:54Z. End 2026-11-12T06:09Z (times from `date -u`).

## Steps
- 05:54Z `fetch_ontario.py --list "HSC4M"` found the course; `fetch_ontario.py "HSC4M" ontario-hsc4m` fetched 4 strands, 13 overall, 53 specific expectations. Course title in the document: World Cultures. `ontario_source.py ontario-hsc4m` printed `source/ontario-curriculum-social-sciences-humanities` (existing record, reused).
- Read all 53 expectations. Strand A (15) is research skills; strand D3 (5) is designing and running an initiative: all 20 are skills. Strand B and C ask for general theory of culture and for cultures chosen by the class; strand D2 and most of D1 are about Canada.
- Searches (find_entity.py, three spellings each, run per expectation): results are recorded inside the gap register.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-hsc4m-b-1 | Culture on the move | B2.3 |
| ca-on-g12-hsc4m-b-2 | A scholar's idea of culture: Edward Said | B3.1 |
| ca-on-g12-hsc4m-c-1 | The art of the letter and of the building | C1.1, C2.1 |
| ca-on-g12-hsc4m-c-2 | Belief in daily life | C1.3, C1.4, C3.1 |
| ca-on-g12-hsc4m-c-3 | Gifts that travelled | C3.2, C3.5 |
| ca-on-g12-hsc4m-d-1 | Keeping an identity among others | D1.4 |

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- B2.3 / arabic-script-origin: trace how culture is transmitted between groups; this record shows one report of a script passing from Tayy to al-Anbar, al-Hira and Mecca, measured against Syriac.
- B2.3 / baghdad-papermaking: same; shows a craft of Chinese origin moved to Baghdad, with the record's own warning that it is a transmission, not an invention.
- B2.3 / algorism: same; shows Indian numerals entering the Islamic world through al-Khwarizmi's book and reaching the West in Latin.
- B3.1 / edward-said: explain a leading figure's ideas about culture; shows who he was and Britannica's one-sentence account of Orientalism.
- B3.1 / art-and-architecture-of-islamic-cairo: shows an author citing Said in a preface (used as the "after" card).
- C1.1, C2.1 / islamic-calligraphy: describe an art of one culture and its relation to belief; shows the art and its link to writing the Qur'an.
- C1.1, C2.1 / art-and-architecture-of-islamic-cairo: architecture of one culture in its religious, social and political setting, with a period (642-1517) and place (Cairo).
- C1.3, C3.1 / hajj and dhabaih-fiqh: religion and practice (pilgrimage; lawful food).
- C1.4 / environmental-protection-in-islam: religious belief and relation to the environment, as one author's reading.
- C3.5 / coffee-banned-damascus-953: a beverage named in the expectation's examples; shows its arrival and reception in Damascus.
- C3.2, C3.5 / manuscript-illumination-tazhib: Islamic illuminated manuscripts are named in the examples; shows an Arab art taken up and changed in Iran, Turkey, India.
- D1.4 / al-indimaj-wal-huwiyya: ways a minority addresses challenges to identity; shows one speaker's way, labelled as his view. The Brief says the museum offers one way only.

## Judgement calls
- concept/islamufubiya (D1.2) was NOT used: it is a draft summary of a television panel's debate with audience votes and quoted opinions; restating it as findings about media stereotypes would not be honest.
- concept/al-ilmaniyya-wal-islam (D2.5) NOT used for the same reason.
- concept/orientalism (Zaqzuq's view of Western orientalism, draft, Arabic-only prose, a different sense of the word) NOT linked to Said's lesson: it would put one scholar's account under another's heading.
- C3.1 was added to the "Belief in daily life" lesson because its example (religion affecting food; the arts enhancing religious practice) matches the pilgrimage and food records already linked; calligraphy appears under C1.1 rather than C3.1.
- kind choices: calligraphy, Cairo book, illumination use `object` (a made thing); dhabaih and environment records use `reflection`; Hajj and coffee use `story`; see Proposals.
- No Qur'an connection written: no linked record cites a verse in a way the lesson needs.

## Counts
Units 3 (B, C, D), lessons 6, connections 13 (12 distinct records), expectations in lessons 10 of 53, in the gap register 43 (20 skills expectations without subject matter, 23 with searches).

## Problems with the runbook
- `cite-check.ts` takes one id at a time. The runbook's `npx tsx scripts/cite-check.ts course/<id> course/<id> ...` form reads the whole list as one id and fails with "record-exists: no file at ...". Ran it once per record instead.
- The runbook says the grade/subject examples are `ca-on-g6-science`; its shape lacks Urdu text, which `--strict` requires. The proof course `ca-on-g4-social-studies` also has no Urdu; I followed the strict gate.
- `zsh` has no `timeout` and `read -a`; not a runbook problem.
- `find_entity.py` is slow (about 10-20 seconds per call); a batch of 30 calls took over two minutes.

## Proposals
- Connection kinds: no `concept`, `practice`, `event`, `work` or `art` kind; art forms and books went to `object`, legal and social concepts to `reflection`.
- A `skills` flag for expectations that name no subject matter, so they need not each carry a placeholder search.
- A link from each expectation to the authority's page, so texts cut at 40 words can point to the full wording.
- The corpus holds nothing on Canada's ethnocultural communities (place/canada and place/ontario have no prose); an HSC4M lesson on Muslim communities in Canada would need records first.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hsc4m-c-1, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hsc4m-b-1, invention/algorism, FIX: "From it the West learned arithmetic, the record says" -> "The editors of the Cairo edition of al-Khwarizmi's Algebra write that the West learned arithmetic from it, and that his Latinized name became a name for the numerals themselves" (ar: "ومنها تعلّم الغرب الحساب كما يذكر السجل" -> "ويذكر محققا طبعة القاهرة لكتاب «الجبر والمقابلة» للخوارزمي أن الغرب تعلّم الحساب منها"; ur: "ریکارڈ کے مطابق مغرب نے حساب اسی سے سیکھا" -> "الجبر والمقابلہ کے قاہرہ ایڈیشن کے مدیر لکھتے ہیں کہ مغرب نے حساب اسی سے سیکھا"). The review names the TDV Harizmi entry as the source; the record cites this sentence to the Cairo edition (khwarizmi-jabr-cairo-1939 p. 25), so that is the source named. Evidence row updated.
- ca-on-g12-hsc4m-b-2, work/art-and-architecture-of-islamic-cairo, REMOVE: connection deleted; the Try this sentence naming the record removed in en, ar, ur; its evidence row deleted. The lesson keeps person/edward-said and its Brief stays true.
- ca-on-g12-hsc4m-c-1, concept/islamic-calligraphy, FIX: added "Wikidata, the record's only source, links the art to the writing of the Qur'an" (ar, ur the same); no superlative. Brief gains one sentence: the record gives only that link, so function, time and place come from other sources the class finds (ar, ur the same).
- ca-on-g12-hsc4m-c-3, event/coffee-banned-damascus-953, FIX: "The record says coffee appeared" -> "Ibn al-Imad al-Hanbali, in Shadharat al-dhahab, reports that coffee appeared"; "The judge of Damascus ... ruled it forbidden" -> "He names the judge of Damascus, Shams al-Din Muhammad ibn Abd al-Awwal, who with Shaykh Qutb al-Din ibn Sultan and Shaykh Yunus al-Aythawi held it forbidden"; "The record adds" -> "He adds" (ar, ur the same).
- ca-on-g12-hsc4m-d-1, concept/al-indimaj-wal-huwiyya, REMOVE: the lesson left with no connection, so the whole lesson, its three prose files, its evidence rows, then the now-empty unit ca-on-g12-hsc4m-d (and its prose) were deleted and the unit removed from the subject's lessons. D1.4 moved to the gap register with two searches.

Verdicts not applied: none.
