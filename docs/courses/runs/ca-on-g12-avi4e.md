# Run log: ca-on-g12-avi4e

Course: Ontario Ministry of Education, AVI4E, Visual Arts (Grade 12). Archive slug `ontario-avi4e`. Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph already built; no validate, no state-changing git).

Start 2026-11-12T06:38Z (first `date -u`). End 2026-11-12T06:43Z.

## Steps

- 06:38Z read the runbook; `fetch_ontario.py --list AVI` printed `AVI4E` among the names. `fetch_ontario.py AVI4E ontario-avi4e`: 3 strands (A, B, C), 9 overall and 22 specific expectations. `ontario_source.py ontario-avi4e` printed `source/ontario-curriculum-secondary-arts` (existing record, reused).
- 06:39Z read the full official text and the sibling courses already in the tree (AVI2O, AVI4M) for shape. Ran find_entity for values/advertising/poster, propaganda, transferable skills, exhibition/signature, audience/display, plagiarism/copyright, forgery/attribution, safety/ventilation, recycling/environment, software/digital art, graphic design/logo, framing/label, apprenticeship/craft, pigments/chemicals.
- 06:40Z re-read the briefs of invention/tiraz and concept/gold-leaf-glass-tesserae in full before reusing the AVI2O connection texts (they restate the record; no change needed).
- 06:42Z wrote 9 records (1 subject, 3 units, 5 lessons), prose in ar/en/ur, the gap register (14 entries), the evidence file. Gate run.
- 06:43Z gate GREEN (23 checks); cite-check 9 pass, 0 fail.

## Lesson plan (final)

| Lesson | Title | Expectations | Records linked |
|---|---|---|---|
| a-1 | Where a work is shown, and to whom | A3.3 | job/calligrapher |
| b-1 | What a work was for, and whose world it shows | B1.3, B2.2 | building/dome-of-the-rock, concept/gold-leaf-glass-tesserae, invention/tiraz |
| b-2 | Learning a craft: the calligrapher | B3.1 | job/calligrapher (x2) |
| c-1 | Words for tools, materials and effects | C1.2, C2.1 | practice/manuscript-illumination-tazhib, job/calligrapher, concept/zellij |
| c-2 | Pattern, script and the conventions of ornament | C1.1, C2.2 | concept/arabesque, concept/islamic-calligraphy |

## Honest sentences for the links

- A3.3 / calligrapher output: the expectation asks the student to understand the variety of ways works can be presented to reach audiences; this record shows books, albums, scrolls, framed panels and inscriptions on walls and domes.
- B1.3 / Dome of the Rock: asks the student to interpret works from historical periods; this record shows two writers' descriptions of the building's form and materials. B2.2 / tesserae: asks how works reflect the society that made them; the record shows the scale of glass needed and the report that tesserae and workmen came from the Byzantine empire. B2.2 / tiraz: the record shows a ruler's name woven into cloth as a mark of kingship, and what replaced the earlier images.
- B3.1 / calligrapher: asks for a work opportunity and the skills it needs; the records show the stages of a calligrapher's training and licence and UNESCO's list of present practitioners. The comparison with the student's own skills is left to the class.
- C1.2, C2.1 / tazhib, calligrapher tools, zellij: ask for vocabulary of techniques, materials and tools and for a technique that gives an effect; the records name them, and the zellij record shows cutting through the glaze to leave black letters on terracotta.
- C1.1, C2.2 / arabesque, calligraphy: ask for design terminology and conventions; the records give an art historian's terms for the arabesque and the named scripts.

## Judgement calls and notes

- AVI4E is the applied and commercial strand of the Ministry's Visual Arts course (the expectations say so). The museum holds no commercial art records; every link is to an applied or historical work, and each Brief says the commercial side and the student's own work are for the class.
- The connection texts for b-1, b-2, c-1, c-2 and the a-1 calligrapher card are the AVI2O course's texts (written by another fleet agent against the same records), reused because the expectations ask the same of them. I re-read the tiraz and tesserae briefs in full against them. The Brief, Questions and labels were rewritten for AVI4E's wording; the Sections and Try this were kept.
- The Arabic and English prose of job/calligrapher differ in small ways (the English output list says "mounted decorated pieces", the Arabic only "decorated pieces"). The texts say only what both say.
- Not linked: concept/propaganda-coins (coins carrying a publicity message; says nothing on influence on values, and a coin is not the applied art the expectation names, so B2.1 and B1.3 stay unlinked to it). concept/environmental-protection-in-islam is an author's reading on pollution and says nothing on art workshops (C3.3 in the register). concept/hirfa-crafts is a set of rulings (B3.2 in the register). practice/persian-painting-pigments-and-gold mentions verdigris eating through paper but nothing on the maker's safety (C3.2 in the register).
- The Alhambra and Umayyad Mosque records are not linked (the first holds no architectural description, the second gives construction facts without style or materials), as in AVI2O.
- Seven skills expectations (A1.1-A1.3, A2.1, A2.2, B1.1, B1.2) went to the register as such.
- The gap register's `text` fields are `quote_official` output; the gate confirmed them.

## Commands that failed

- None.

## More lessons possible

- Pigments and gold in Persian painting (practice/persian-painting-pigments-and-gold) for C1.2 and C2.1.
- Propaganda coins (concept/propaganda-coins) for B1.3, as a publicity piece, if a reader judges a coin an applied art work.
- Samarran stucco styles and the Ibn Tulun soffits for C2.2, from the arabesque record.

## Proposals

- Connection kinds: the closed list has no `craft` or `art_form`; `career` was used for job/calligrapher, `reflection` for art-form concepts, `invention` for tiraz and tazhib, `object` for zellij and tesserae, `place` for the Dome of the Rock.
- Pinning a card: the `within` connections cannot name the section they follow.

## Runbook problems that cost time

- None this run. The runbook's step 4 expects fresh connection texts; reusing a sibling course's already-verified texts for near-identical expectations saved most of the time, and the runbook does not say whether that is allowed.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-avi4e-c-2, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- b-1, building/dome-of-the-rock, FIX: the card "The Dome of the Rock in two descriptions" (doors, gilding, al-Maqdisi and al-Umari) replaced by the record's Qabbani and Thesaurus d'Epigraphie Islamique sentences (who ordered it, over which Rock, 72 AH), word for word the same card as AVI4M-B-2, in en, ar, ur; title "A building raised over a remembered place"; sources umayyad-birth-to-fall-2006 and tei-epigraphie. The Try this now asks for materials "where the record gives them" because this card gives none. Evidence rows replaced.
- b-1, concept/gold-leaf-glass-tesserae, FIX: the author is named, as in AVI2O (see that run log).
- c-2, concept/islamic-calligraphy, REMOVE: as in AVI2O; the lesson stands on the arabesque card; Brief, section 3, Try this and the lesson label and summary updated in en, ar, ur.
- No verdict was judged wrong.
