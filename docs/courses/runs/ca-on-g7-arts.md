# Run log: ca-on-g7-arts
Start 2026-11-12T06:28Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Arts - Grade 7", archive slug `ontario-arts-g7`, subject `course/ca-on-g7-arts`, grade `course/ca-on-g7`, jurisdiction `course/ca-on-english`.

## Steps
- 06:28Z read runbook and fleet prompt; `fetch_ontario.py --list "Grade 7"` found "Arts - Grade 7"; fetched: 4 strands (Dance, Drama, Music, Visual Arts), 12 overall, 38 specific expectations.
- 06:28Z `ontario_source.py ontario-arts-g7` printed `source/ontario-curriculum-elementary-arts` (already on disk).
- 06:29Z to 06:32Z topic searches (music, Ziryab, al-Farabi, dance, sama, calligraphy, arabesque, girih, muqarnas, oud, shadow play, optics, maqamat, poetry, adhan, organ, drama, drum, notation, oral tradition, festivals, folk dance, singing) and briefs.
- 06:33Z wrote records, prose, gap register by a script kept outside the repository; then evidence.
- 06:35Z gate run: GREEN (23 checks). cite-check: 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g7-arts-b-1 | Wandering singers and comic plays | B3.1 |
| ca-on-g7-arts-c-1 | New strings and water-driven music | C3.2 |
| ca-on-g7-arts-d-1 | Two scripts, two styles | D2.3, D3.1 |
| ca-on-g7-arts-d-2 | Surface, size and place in design | D2.2, D3.2 |

Strand A (Dance) gets no unit: all nine specific expectations are in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B3.1 / concept/ashik: compare how social values are communicated in different drama forms from different times and places; the record shows wandering poet-minstrels singing and reciting religious and erotic songs, elegies and heroic narratives at public gatherings.
- B3.1 / person/mirza-fath-ali-akhundzada: same expectation; the record shows a playwright whose comedies (1850-1857) put progressive ideas against feudalism, corrupt justice and superstition.
- C3.2 / invention/ziryab-fifth-string: analyse historical and cultural influences on innovation in music; the record shows an attributed extra oud string, with its source criticism.
- C3.2 / invention/jazari-musical-boat: analyse technological influences on music; the record shows a water-powered boat with four musician figures, with Hill's limits.
- D2.3, D3.1 / concept/kufic-script: read style and see how an art form reflects the traditions of its time; the record gives the features of the script and its use for copying the Qur'an.
- D2.3, D3.1 / concept/nastaliq-script: the record gives the script's character, origin and its link to Persian poetry.
- D2.2 / concept/arabesque: explain how design principles communicate; the record gives Yeomans's analysis of the arabesque as two-dimensional and surface-respecting.
- D2.2, D3.2 / work/monumental-calligraphy-in-fatimid-egypt: size and placement of titles and inscriptions on public gates and facades.

## Judgement calls
- Arabic/English differences in the records, handled by writing only what both say: ashik (en "madrasa-educated religious poets", ar "poets of the madrasas and khanqahs": texts say "poets of the madrasas"); jazari-musical-boat (en "a harpist", ar "for the string": texts say "string-instrument player"); arabesque ("Samarra style B" in en, "the second Samarra style" in ar with the letter dropped).
- Kufic: the Arabic record says "preferred script for copying Qur'ans", English the same; no superlative used. The calligraphy concept record (concept/islamic-calligraphy) was not used: it cites only Wikidata for "the noblest art", which is not a source for such a claim.
- D3.2 asks for "influence on identity"; the records do not speak of identity, so the lesson Brief says that part is for the class.
- D1.2 (composition, rule of thirds) and the muqarnas mensuration record (invention/kashi-muqarnas-mensuration): D1.2 asks the student to make art works, and the record is about measuring, so no link.
- concept/girih, concept/islamic-geometric-patterns, concept/muqarnas, building/alhambra: summaries cite only Wikidata (or have unsourced prose tiers); not used as a basis for D-lessons beyond what the sourced records say.
- Dance: concept/sama is about hearing; practice/sama-mawlawiyya is one line citing only Wikidata and does not call the whirling a dance. Both A3 expectations went to the register.
- Optics (invention/camera-obscura) was considered for Visual Arts and not used: nothing in the expectations asks for it.

## Counts
Units 3 (B, C, D); lessons 4; connections 8; expectations in lessons 6 of 38; in the gap register 32 of 38 (26 skills, 6 topical: A3.1, A3.2, B3.2, C1.5, C2.2, C3.1).

## Runbook problems
- None that cost time. `find_entity.py` ran 15 searches in parallel in about 30 seconds.

## More lessons possible
- Strand C: person/ziryab or concept/al-qiyan as a further case for C3.2 or C3.1 if a third music lesson is wanted.
- Strand D: invention/kashi-muqarnas-mensuration (mathematics and ornament) for D3.1 beyond the two scripts, if its record gains an art-historical text.

## Proposals
- Connection kinds: `object` was used for art forms and a book (concept and work records); `story` for a minstrel class and a playwright. The closed list has no `art_form`, `work` or `writer`.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g7-arts-b-1, concept/ashik, REMOVE (b): connection removed. The lesson stays through person/mirza-fath-ali-akhundzada (B3.1, values in a drama form). Label, summary, Brief, question and Try this (en, ar, ur) rewritten to one case: label "Wandering singers and comic plays" -> "Comic plays and social values" (ar "مسرحيات هزلية وقيم اجتماعية"; ur "مزاحیہ ڈرامے اور سماجی قدریں"); the Brief says the museum offers one case. Two further changes on the Akhundzada card, which would otherwise have dangling or unattributed wording: the closing question "compared with a minstrel's song" (ar "بالمقارنة مع أغنية المنشد"; ur "گویے کے گیت کے مقابلے میں") was cut, and "the record calls him the first writer of original plays" (ar "ويصفه السجل", ur "سجل انھیں ... کہتا ہے") now reads "the Encyclopaedia of Islam calls him ..." (ar "وتصفه دائرة المعارف الإسلامية", ur "انسائیکلوپیڈیا آف اسلام انھیں ... قرار دیتا ہے"), with "It says the plays put ..." (ar "وتذكر أنه ضمّن", ur "وہ بتاتا ہے کہ"). 3 evidence rows deleted, the Akhundzada claim row reworded.
- ca-on-g7-arts-b-1, person/mirza-fath-ali-akhundzada: KEEP, plus the two edits above.
- ca-on-g7-arts-c-1, invention/ziryab-fifth-string, KEEP: unchanged.
- ca-on-g7-arts-c-1, invention/jazari-musical-boat, FIX: en: "two tambourine players, one string-instrument player and one wind-instrument player" -> "two tambourine players, a harpist and a wind-instrument player" (the English record says "a harpist"). ar: "أربع عازفات، اثنتان للدف وواحدة للوتر وواحدة للنفخ" -> "أربعة عازفين، اثنان للدف وواحد للوتر وواحد للنفخ" (the Arabic record says only "للوتر", a string instrument, so the Arabic is not made more specific than its record; the feminine plural "عازفات", which the English record does not state for these four, was made gender-neutral so that the three languages agree). ur: "ایک تار والے ساز کا اور ایک پھونک والے ساز کا" -> "ایک ہارپ بجانے والا اور ایک پھونکنے والے ساز کو بجانے والا". Record discrepancy noted below. The card's "courtly scene" was left, as the review says it is fine. Evidence row rewritten.
- ca-on-g7-arts-d-1 (kufic, nastaliq) and ca-on-g7-arts-d-2 work/monumental-calligraphy-in-fatimid-egypt, KEEP: unchanged.
- ca-on-g7-arts-d-2, concept/arabesque, FIX: same plain-word replacement of "Samarra style B / palmettes / polygons and polylobes" as in Grade 5/6. Evidence row rewritten.

Verdicts not applied: none.

Records for the founder (not edited): invention/jazari-musical-boat: the Arabic record says "عازفات" (female performers) and "للوتر" (string) for the four performers where the English record says "four performers ... a harpist": the two records should agree. The same record's court is a setting of servants and "drinking parties" (the card says only "courtly scene").
