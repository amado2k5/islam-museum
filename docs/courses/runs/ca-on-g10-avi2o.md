# Run log: ca-on-g10-avi2o

Course: Ontario Ministry of Education, AVI2O, Visual Arts (Grade 10). Archive slug `ontario-avi2o`. Agent: Claude Code; claude-sonnet-5-5. Fleet run (graph already built; no validate, no state-changing git).

Start 2026-11-12T06:28Z (first `date -u`). End 2026-11-12T06:40Z.

## Steps

- 06:28Z read the runbook; `fetch_ontario.py --list "AVI2O"` printed the name `AVI2O`. `fetch_ontario.py AVI2O ontario-avi2o`: 3 strands (A, B, C), 9 overall and 26 specific expectations. `ontario_source.py ontario-avi2o` printed `source/ontario-curriculum-secondary-arts` (existing record, reused).
- 06:30Z searched the graph (find_entity, entity_brief) for illuminated manuscripts, calligraphy, mosaic, arabesque and geometric pattern, the Umayyad Mosque, the Dome of the Rock, the Alhambra, textiles and tiraz, ceramics, miniature painting, colour, exhibition, copyright, calligrapher, paper and ink, portraiture, environment, craft training, safety, sculpture and painting. Read the full briefs of zellij, gold-leaf tesserae, the calligrapher job, the Alhambra and the others used.
- 06:36Z wrote 9 records (1 subject, 3 units, 5 lessons), prose in ar/en/ur, the gap register (14 entries), the evidence file; gate run.
- 06:37Z gate GREEN; cite-check 9 pass, 0 fail.

## Lesson plan (final)

| Lesson | Title | Expectations | Records linked |
|---|---|---|---|
| a-1 | Materials, preparing a work, and showing it | A3.1, A3.2, A3.3 | concept/zellij, job/calligrapher (x2) |
| b-1 | What a work was for, and whose world it shows | B1.3, B2.1, B2.2 | building/dome-of-the-rock, concept/gold-leaf-glass-tesserae, invention/tiraz |
| b-2 | Learning a craft: the calligrapher | B3.1, B3.2 | job/calligrapher (x2) |
| c-1 | Words for tools, materials and effects | C1.2, C2.1 | practice/manuscript-illumination-tazhib, job/calligrapher, concept/zellij |
| c-2 | Pattern, script and the conventions of ornament | C1.1, C2.2 | concept/arabesque, concept/islamic-calligraphy |

## Honest sentences for the links

- A3.1 / zellij: The expectation asks the student to try a variety of materials and techniques; this record shows glazed terracotta mosaic cut and laid in patterns, a material and technique to compare with the student's own.
- A3.3 / calligrapher output: asks for understanding of ways works are presented to different audiences; the record shows books, albums, scrolls, framed panels and inscriptions on walls and domes.
- A3.2 / calligrapher licence: asks for ways to prepare works for presentation; the record shows the licence that lets a pupil sign beneath his writing. (Mounting and framing are touched only by "framed panel" in the output connection; the Brief says the making and preparing of the student's own works is left to the class.)
- B1.3 / Dome of the Rock: asks for purpose, style, materials and meanings of historical works; the record shows two descriptions of the building's form and materials (gilded brass, columns, door leaves). Purpose and meaning are given only as far as the record gives them; the connection ends in a question.
- B2.2 / tesserae: asks how a work reflects its society; the record shows the scale of the glass needed and the report that tesserae and workmen came from the Byzantine empire.
- B2.1 / tiraz: asks for the function of a type of art work in a past society; the record shows tiraz as a mark of kingship carrying the ruler's name.
- B3.1, B3.2 / calligrapher: asks for the knowledge and skills of visual arts, their use in careers, and the education careers need; the record shows the stages of training and licence and UNESCO's list of present practitioners.
- C1.2 / tazhib, calligrapher tools, zellij: asks for vocabulary for techniques, materials and tools; the records name them.
- C2.1 / zellij cut-glaze: asks for techniques used for specific effects; the record shows cutting through the glaze to the terracotta to leave black letters on a terracotta ground.
- C1.1, C2.2 / arabesque, calligraphy: asks for design terminology and conventions; the records give an art historian's terms for the arabesque and the named scripts.

## Judgement calls and notes

- The Arabic and English prose of job/calligrapher differ in small ways (the English output list says "mounted decorated pieces", the Arabic only "decorated pieces"). The texts say only what both say.
- The Arabic summary of the Dome of the Rock says al-Muqaddasi saw nothing like it "in the East", the Arabic overview "in Islam", the English both: this superlative is left out of the texts.
- The Alhambra record says explicitly that it holds no architectural description, and the Umayyad Mosque record gives construction facts without style or materials: neither is linked.
- building/dome-of-the-rock has no Urdu label; the Urdu text names it قبۃ الصخرہ.
- `concept/environmental-protection-in-islam` is an author's reading on pollution and says nothing on art materials: C3.3 stays in the register. `concept/hirfa-crafts` is a set of fiqh rulings, not training or opportunities: B3.3 stays in the register.
- Nine skills expectations (A1.1-A1.3, A2.1, A2.2, B1.1, B1.2, B1.4, C1.3) name no subject matter beyond making and critique and went to the register as such.

## Commands that failed

- None in the gate. A first `sed -i` on macOS failed (BSD sed needs an argument after `-i`); the same edit was made with Python.

## More lessons possible

- Hilye and the framed levha (A3.3), and the Alhambra's inscriptions, if the Alhambra record gains an architectural description.
- A lesson on the Samarra stucco styles (concept/samarran-stucco-styles) and the Ibn Tulun soffits, from the arabesque record, for C2.1/C2.2.
- A lesson on Mughal and Deccani painting (concept/mughal-painting and related) for B1.3 and B2.2, if a reader checks their briefs.

## Proposals

- Connection kinds: the closed list has no `craft` or `art_form`; `career` was used for job/calligrapher, `reflection` for art-form concepts, `invention` for tiraz and tazhib, `object` for zellij and tesserae.
- Pinning a card: the `within` connections cannot name the section they follow.

## Runbook problems that cost time

- The runbook says `--list` for secondary courses uses a course code; `--list "AVI2O"` worked, but the exact-name rule is not stated for a bare code.
- `entity_brief.py` takes `--full` after the id, not before (before it, the flag is read as an id).

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g10-avi2o-c-2, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- a-1, job/calligrapher (the licence), FIX: en "The licence is given once the pupil has copied a piece by an old master ... It names the teacher and grants the pupil leave to set his signature beneath his writing. It is given at a ceremony before a jury of calligraphers, and a pen name agreed in advance is written into it." → "In the calligrapher's training, the TDV entry says, the licence grants the pupil leave to set his signature beneath his writing." ar and ur likewise (ceremony, jury, pen name, copying and the naming of the teacher cut). Closing question unchanged. A3.2 stays in the lesson because this signing sentence is kept (the review's condition). Evidence rows reduced to the one row.
- b-1, concept/gold-leaf-glass-tesserae, FIX: "the author estimates" → "Nadine Schibille estimates"; "she notes" → "Schibille notes" (en); ar "وتقدّر المؤلفة" → "وتقدّر نادين شيبيل"; ur "مصنفہ کے اندازے میں" → "نادین شیبیل کے اندازے میں", "وہ لکھتی ہیں" → "شیبیل لکھتی ہیں". Evidence claim cells name her; the quoted record sentences are unchanged.
- c-2, concept/islamic-calligraphy, REMOVE: connection deleted (script names are not an element, principle or convention of design; "names of lines or colours" was a category error). The lesson stands on the arabesque card (C1.1, C2.2). The lesson's label, summary, Brief, third section and Try this, and the unit's summary, no longer name the scripts, in en, ar, ur. Evidence row deleted.
- No verdict was judged wrong.
