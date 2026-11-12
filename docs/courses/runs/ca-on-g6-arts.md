# Run log: ca-on-g6-arts
Start 2026-11-12T06:12Z
(started 2026-11-12T06:12Z; ended 2026-11-12T06:27Z)

## Steps
- 06:12Z fetched "Arts - Grade 6" as `ontario-arts-g6` (4 strands: Dance, Drama, Music, Visual Arts; 12 overall, 38 specific). Source: `source/ontario-curriculum-elementary-arts` via ontario_source.py (it already existed).
- Searched 17 spelling sets: music/al-Farabi/Ziryab; calligraphy; geometric pattern/arabesque; shadow theatre/puppet; dance/whirling/sama; musical notation/al-Kindi/maqam; miniature painting; theatre/drama; storytelling/maqamat; ceramics/textile; recitation/tajwid/nasheed; cinema/animation; coin/symbol; musical instrument/oud; First Nations/powwow; guild/workshop/art school; human rights/environment/peace. Read briefs of 13 records.
- Wrote records with a generator script kept outside the repository (YAML dumped by library).
- 06:26Z gate GREEN; cite-check 9 pass, 0 fail.

## Plan
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g6-arts-b-1 | A play in a community's own language | B3.1 |
| ca-on-g6-arts-c-1 | Comparing the music of two cultures | C3.2 |
| ca-on-g6-arts-d-1 | Pattern, repetition and the surface | D1.2, D1.3, D2.2 |
| ca-on-g6-arts-d-2 | Letters as art: reading signs and style | D2.3, D3.1 |
| ca-on-g6-arts-d-3 | Materials and methods of the painter | D1.4 |

Strand A (Dance) has no unit: all nine expectations are in the register.

## Link sentences
- B3.1: "The expectation asks the student to show understanding of drama and theatre themes and traditions from a variety of times, communities and places; person/mirza-fath-ali-akhundzada shows a nineteenth-century dramatist writing original plays in Azerbaijani Turkish, their themes, and the first performances in the original language."
- C3.2: "The expectation asks the student to compare aspects of the music of one culture or period with another; invention/ziryab-fifth-string shows an account of an oud with an added string (the museum's side of the comparison) and person/al-farabi names a book on music among a scholar's works. The other side of the comparison the class brings."
- D1.2/D1.3/D2.2: "The expectations ask about composition, the principles and elements of design (repetition, shape, surface) and how they carry meaning; concept/islamic-geometric-patterns shows repeated stars, polygons and grids covering surfaces, and concept/arabesque shows, in Yeomans's view, abstracted leaves organised into surface geometry that respects the surface."
- D2.3/D3.1: "The expectations ask the student to read signs and style and to see how art forms reflect a community's beliefs; event/arabic-script-origin shows one report on how a script was devised, concept/khatt-al-arabi lists the early styles of Arabic script, and concept/islamic-calligraphy ties the art to the writing of the Qur'an."
- D1.4: "The expectation asks the student to use materials, tools and techniques to solve design challenges; practice/persian-painting-pigments-and-gold shows the materials (mineral pigments, their binders, a pigment that damages paper) and practice/pouncing-in-persian-painting a copying technique."

## Judgement calls
- D1.2 and D1.3 are making expectations (the student creates); I linked them because the lesson's records show repetition and shape on surfaces, and the Brief says making stays with the class. D1.1 (create art works about feelings and issues) stays in the register: no record carries it.
- D2.1 left in the register: nothing returned for interpreting feelings and social concerns of named artists.
- A1.x, C1.x: making and performing expectations; no record to link, registered.
- Dance: practice/sama-mawlawiyya has one line and no source; not offered. concept/raqs-fiqh is a ruling, not an art piece. A3 wholly outside.
- Qur'an: concept/islamic-calligraphy's "link to the writing of the Qur'an" is restated; no verse quoted and no quran connection made.
- Tajwid/tartil (Qur'anic recitation) not offered as music (the museum does not call it music; C1.x is performing from notation anyway).
- Record kinds: `object` for an art form or a craft (the closed list has no art form); `story` for a report on the script's origin and for Ibn al-Nadim's survey; `career` for a dramatist; `invention` for the fifth string; `scholar` for al-Farabi.
- Record discrepancies: al-Farabi English "master musician" / Arabic "موسيقياً بارعاً" (each text follows its own); Akhund-zada Arabic "ست ملهاة" written "ست ملاهٍ" in the lesson text (same count: six comedies).
- Concept/islamic-calligraphy and concept/islamic-geometric-patterns are cited to Wikidata only; the connection texts restate only their cited summary sentences, not the uncited "For Scholars" paragraphs (Ibn Muqla, Ibn al-Bawwab) that the record also holds.

## Outcome
Ingested: 9 records (1 subject, 3 units, 5 lessons), 10 connections, 8 expectations in lessons, 30 in the gap register, of 38. Strand A has no unit.

## More lessons possible
- C3.2 could take a second lesson on pictured music-making: object/qasa-firuz (Turquoise Bowl with Lute Player) alongside object/ud-shami; not read in full here.
- D1.4 or D3.1 could use the ware-type records (concept/fritware, concept/iznik-pottery, concept/minai-ware): not read in full here.
- A lesson on D2.3 with the symbols on coins: invention/abd-al-malik-epigraphic-dinar (found by the "coin" search, not read).

## Proposals
- Connection kinds: no `art form`, `craft` or `practice`; `object` stands for them.
- Dance: the museum has no dance records; a harvest lane on Sufi sama and regional dance traditions would make A3-type expectations answerable.

## Runbook problems
- find_entity.py takes 1 to 3 minutes per call while many agents share the machine; running the searches as one background batch writing to a file saved time. The runbook could say so.
- `entity_brief.py --full <id>` fails (the flag must follow the id).

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g6-arts-d-2, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Beyond the card: its question "How does a style of writing show what a community honours?" -> "What can a style of writing tell you about the community that used it?"; the lesson summary "how an art form can reflect what a community honours" -> "how an art form can reflect the beliefs and traditions of a community" (ar, ur the same). Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g6-arts-b-1, person/mirza-fath-ali-akhundzada, FIX: en: "Mirza Fath 'Ali Akhund-zada was the first writer of original plays in a Turkish idiom, the Azerbaijani Turkish of the Caucasus." -> "The Encyclopaedia of Islam calls Mirza Fath 'Ali Akhund-zada the first writer of original plays in a Turkish idiom, the Azerbaijani Turkish of the Caucasus." ar: "ميرزا فتح علي آخوندزاده أول من كتب مسرحيات أصيلة بالتركية ..." -> "تصف دائرة المعارف الإسلامية ميرزا فتح علي آخوندزاده بأنه أول من كتب مسرحيات أصيلة بالتركية ..." ur: "میرزا فتح علی آخوند زادہ ... لکھنے والے پہلے مصنف تھے۔" -> "انسائیکلوپیڈیا آف اسلام میرزا فتح علی آخوند زادہ کو ... لکھنے والا پہلا مصنف قرار دیتا ہے۔" Evidence claim reworded.
- ca-on-g6-arts-c-1, invention/ziryab-fifth-string, KEEP: unchanged.
- ca-on-g6-arts-c-1, person/al-farabi, REMOVE (b, e): connection removed; the lesson stays through the Ziryab card (C3.2). Brief (en, ar, ur) now says the museum holds one side of the comparison: a record about a string of the oud. 2 evidence rows deleted.
- ca-on-g6-arts-d-1, concept/islamic-geometric-patterns, KEEP: unchanged.
- ca-on-g6-arts-d-1, concept/arabesque, FIX: same plain-word replacement of "Samarra style B / palmettes / polygons and polylobes" as in Grade 5 (en: "... in a style found at Samarra, where leaves become simple shapes, lose their stems and are arranged into a flat pattern on the surface."; ar, ur correspondingly, keeping each language's own opening words). Evidence row rewritten as a plain-word restatement.
- ca-on-g6-arts-d-1, expectation D1.2 (composition: "create narrative art works or art works on a theme"): moved out of the lesson into the gap register, as the review's per-course note says no remaining connection serves it (the two pattern records state shapes and repetition, not composition). The lesson's summary (the codes in brackets) and Brief (en, ar, ur) no longer name composition. This is a per-course note of the review rather than a connection verdict.
- ca-on-g6-arts-d-3, practice/persian-painting-pigments-and-gold, FIX: closing question en: "Which material would you choose for a design challenge, and why?" -> "These are historical materials, not for use in class. How did the painter's choice of material shape the page?" ar: "أي مادة تختار لتحدٍّ في التصميم، ولماذا؟" -> "هذه مواد تاريخية وليست للاستعمال في الصف. كيف شكّل اختيار المصوّر لمادته الصفحة؟" ur: "ڈیزائن کے کسی چیلنج کے لیے آپ کون سا مادہ چنیں گے، اور کیوں؟" -> "یہ تاریخی مواد ہیں، جماعت میں استعمال کے لیے نہیں۔ مصور کے مادے کے انتخاب نے صفحے کو کیسے شکل دی؟" The lesson's Brief gained one sentence in each language that the colours in the first record are historical materials, not for use in class, and its Try this now asks for materials "from your classroom".
- ca-on-g6-arts-d-3, practice/pouncing-in-persian-painting, KEEP: unchanged. ca-on-g6-arts-d-2 was not reviewed in the sweep and was not touched.

Verdicts not applied: none.
