# Run log: ca-on-g3-arts
Start 2026-11-12T06:34Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Arts - Grade 3", archive slug `ontario-arts-g3`, subject `course/ca-on-g3-arts`, grade `course/ca-on-g3`, jurisdiction `course/ca-on-english`.

## Steps
- 06:34Z `fetch_ontario.py --list "Grade 3"` found "Arts - Grade 3"; fetched: 4 strands, 12 overall, 38 specific expectations. Source: `source/ontario-curriculum-elementary-arts`.
- 06:35Z to 06:36Z searched topics (dance, folk dance, Mevlevi, drama, puppet, shadow play, storytelling, folk tale, mask, festival, ceremony, mural, sculpture, painting) and read briefs of the linked records.
- 06:37Z wrote records, prose, gap register and evidence by a script kept outside the repository; gate run GREEN; cite-check 0 fail. Done 06:37Z.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g3-arts-c-1 | Music in a community: then and at a festival | C3.1, C3.2 |
| ca-on-g3-arts-d-1 | Patterns that cover surfaces | D2.2, D3.2 |
| ca-on-g3-arts-d-2 | Writing as art | D2.3, D3.1 |

Strands A (Dance) and B (Drama) get no unit; all their specific expectations are in the gap register.

## Link sentences
- C3.1 / concept/al-qiyan: describe ways music is used in a community; the record shows singing women as an early Abbasid social institution, trained and owned by caliphs, the wealthy or a broker.
- C3.2 / invention/ziryab-fifth-string: identify musical forms of other times and places; the record shows an oud-string attribution with its source criticism.
- C3.1 / event/fez-sacred-music-festival: ways music is used in the community (bringing people together at an event); the record shows an annual festival in Fez, begun 1994, gathering Sufi chants, qawwali and hymns with the music of other faiths.
- D3.2 / concept/islamic-geometric-patterns: awareness of art traditions of diverse places; the record shows repeated star, polygon and grid patterns from al-Andalus to Central Asia.
- D2.2 / concept/arabesque: explain how design elements communicate meaning; the record gives Yeomans's analysis of the arabesque as two-dimensional and surface-respecting.
- D3.2 / concept/waqwaq-arabesque: a variation of the arabesque with a dated earliest example (Shiraz about 1410-11).
- D2.3 / concept/islamic-calligraphy: meaning of signs in art; the record names Kufic, Naskh, Thuluth, Diwani.
- D3.1 / work/monumental-calligraphy-in-fatimid-egypt: art forms seen in a city; the record notes titles given more space than the caliph's and the doubled foundation inscription.
- D3.1 / work/islamic-calligraphy-blair: styles of an art form; the record presents a standard terminology.

## Judgement calls
- The connection texts for the qiyan, the Ziryab string, the patterns, the arabesque, the waqwaq, calligraphy, Fatimid inscriptions and Blair are the Grade 4 course's (`ca-on-g4-arts`), re-checked against the briefs; the closing questions are unchanged. Evidence rows were carried over from the Grade 4 evidence file; the Fez rows are new.
- B3.2 (Grade 3) names fairy tales, myths and plays; unlike Grade 4's B3.2 it gives no oral-storytelling example, so the minstrel (concept/ashik) and epic (work/alpamish) records were NOT used: they are recited poetry, not drama. Both B3 expectations are gaps.
- Dance: practice/sama-mawlawiyya is one line citing only Wikidata and is not called dance in any record; concept/raqs-fiqh is a legal ruling. A3.1 and A3.2 are gaps.
- concept/al-qiyan: Arabic says "houses of the muqayyin", English says "houses of those who hired them"; the clause is left out of all three texts.
- concept/islamic-geometric-patterns and concept/islamic-calligraphy cite only Wikidata (calligraphy also Duha al-Islam); texts restate them closely. The Brief of the patterns lesson says the records do not analyse colour or symmetry.
- Fez festival record cites only Wikidata and is draft; the connection restates only its two sentences.

## Counts
Units 2 (C, D); lessons 3; connections 9; expectations in lessons 6 of 38; in the gap register 32 of 38 (28 skills, 4 topical: A3.1, A3.2, B3.1, B3.2).

## Runbook problems
- `ontario_source.py` reused an existing record; no problem.
- macOS `sed -i` needs an empty suffix argument (`-i ''`); one edit failed and was redone.

## More lessons possible
- Strand C: concept/ashik (minstrels' songs at public gatherings) as a second community of the past for C3.1/C3.2; was not added because the Grade 3 lesson already has three connections.

## Proposals
- Connection kinds: `object` was used for art forms and a book; `story` for a social institution and a festival. The closed list has no `art_form`, `work`, `institution` or `event`.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g3-arts-c-1, MOVE-TO-GAP of one connection (coordinator's grade-suitability decision under "Fit the grade", not in the review): removed the connection to concept/al-qiyan (enslaved singing women, a broker, not suitable for Grades 2 to 4). Its three evidence rows were deleted. The lesson keeps the Ziryab oud-string card and the Fez festival card and both expectations (the Fez card, what music gathers people for, still serves C3.1). Summary, Brief and Try this rewritten in all three languages (three cases became two; the Try this no longer links the record).
- ca-on-g3-arts-d-2, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g3-arts-c-1, invention/ziryab-fifth-string, REMOVE (c, b): that connection removed; the lesson stays through event/fez-sacred-music-festival, which still serves C3.1 and C3.2. Brief, Try this, label and summary (en, ar, ur) rewritten to name one case (the festival) instead of two: label "Music in a community: then and at a festival" -> "Music in a community: a festival" (ar "قديمًا وفي مهرجان" -> "في مهرجان"; ur "تب اور ایک میلے میں" -> "ایک میلے میں"); the summary lost "a story about an oud string and". 3 evidence rows deleted.
- ca-on-g3-arts-c-1, event/fez-sacred-music-festival, KEEP: unchanged.
- ca-on-g3-arts-d-1, concept/islamic-geometric-patterns, KEEP: unchanged.
- ca-on-g3-arts-d-1, concept/arabesque, FIX: the Owen Jones / Graeco-Roman sentences removed; the Yeomans geometric-forms and surface sentence kept. en: "... respecting the surface, unlike closed, naturalistic Graeco-Roman ornament. He cites Owen Jones's Grammar of Ornament (1856): the leaves of Greek scrollwork grow out of the surface, while Islamic design works with it. What would you change in a drawing so that it works with its surface?" -> "... respecting the surface. What would you change in a drawing so that it respects its surface?" ar: ", بخلاف الزخرفة الإغريقية ... ماذا تغيّر في رسم لتجعله يعمل مع سطحه؟" -> ". ماذا تغيّر في رسم لتجعله يحترم سطحه؟" ur: "، بند اور فطرت کی نقل پر مائل ... کہ وہ اپنی سطح کے ساتھ کام کرے؟" -> "۔ آپ ڈرائنگ میں کیا بدلیں گے کہ وہ اپنی سطح کا احترام کرے؟" Evidence: Owen Jones row deleted, Yeomans row trimmed.
- ca-on-g3-arts-d-1, concept/waqwaq-arabesque, REMOVE (a, b): connection removed (I applied (a) as well as (b)); the lesson stands through the patterns and the arabesque; D2.2 and D3.2 are still served. Brief (en, ar, ur) no longer says "with a variation of it". 2 evidence rows deleted.
- ca-on-g3-arts-d-2 (not reviewed in the sweep; judged here by the review's tests, as asked): work/islamic-calligraphy-blair REMOVED: a reference book whose record says only that it exists, how it is organised and that it proposes a standard terminology; it contains no sign, symbol or style the expectations (D2.3, D3.1) ask the student to read, and "first reference work" is the publisher's claim. Brief (en, ar, ur) no longer mentions the reference book. 2 evidence rows deleted. work/monumental-calligraphy-in-fatimid-egypt KEPT: unlike Blair, its record does hold what D2.3 asks for (O'Kane on the size and place of the titles on the gates and the two inscriptions on the Aqmar facade, which the card's own question turns into "what do the size and place of words tell someone walking past"), it is attributed to O'Kane, and its subject (titles on a gate) is not on the "Fit the grade" list. I judged the review's "politics of a caliph and his vizier" worry not enough to remove it; the founder or coordinator may overrule. The lesson stays (D2.3 by the Fatimid card, D3.1 by the calligraphy card).

Verdicts not applied: none from the review. Judgement call: the Fatimid-inscriptions connection of ca-on-g3-arts-d-2 was kept (see above).
