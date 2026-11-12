# Run log: ca-on-g12-avi4m

Started: 2026-11-12T06:27Z (date -u). Ended: 2026-11-12T06:33Z.
Agent: Claude Code; claude-sonnet-5-5 (fleet run, shared worktree)

## Step 0-2
- `fetch_ontario.py "AVI4M" ontario-avi4m` worked (the bare code is the Ministry's name; `--list AVI` lists the AVI courses). Course "Visual Arts": 3 strands, 9 overall, 27 specific expectations, all coded.
- `ontario_source.py ontario-avi4m` printed source/ontario-curriculum-secondary-arts (existing). Used, not edited.

## Step 4: searches
Topics searched (several run in parallel in the background): calligraphy / khatt, architecture / mosque, ornament / arabesque, art / painting / miniature, museum / curator / exhibition, appropriation / iconoclasm / images / tasweer, patronage / censorship / workshop / craft, Alhambra / Dome of the Rock / Great Mosque of Cordoba, UNESCO / arts council, copyright / plagiarism, pigment / ink / dye / hazardous, identity / heritage, installation / sculpture / statue, career / apprenticeship / guild, gallery / collection / waqf, critique / aesthetics / beauty.
Real records found and read: building/dome-of-the-rock, event/dome-of-the-rock-construction, building/great-mosque-cordoba, building/alhambra, concept/arabesque, concept/tasweer-images-and-picturing, concept/khatt-al-arabi, concept/masjid-umum.

Plan and link sentences:

| Lesson | Expectations | Link sentence |
|---|---|---|
| b-1 | B1.2, B1.3 | Deconstruct a work's forms and surfaces and explain how its context clarifies its intent; the Dome of the Rock record gives its form as al-Umari measured it and the construction event gives who ordered it, when and how it was paid for; the Cordoba record gives a second author's account of another mosque to compare. |
| b-2 | B2.1, B2.2 | Analyse the function of art in past societies and the factors shaping it; the Alhambra record shows a ruler's residence, the Dome record a mosque built over a remembered place, tasweer the jurists' views on what may be made. |
| c-1 | C1.2, C2.1, C2.2 | Name materials and techniques and explain a convention; the Dome record gives gilded brass in three shells and chased brass doors; the arabesque record gives Yeomans's account of a stylised, two-dimensional ornament that respects its surface. |

Considered and rejected:
- concept/khatt-al-arabi for A3.1/C2.2: the record is only Ibn al-Nadim's accounts of the origin of Arabic writing, nothing about calligraphy as art.
- building/alhambra for B1.2/C1.2: the record says it holds no architectural description (the "For Scholars" paragraph on muqarnas and tilework is uncited), so used only for B2.1.
- concept/tasweer for C3.1: it treats jurists' views on images, not copyright or appropriation.
- concept/masjid-umum: not read for a link; no expectation asks about the mosque as a type.

## Step 5-6: records
- Generated with a script under the scratchpad (YAML library dump). Records: 1 subject, 2 units (B, C), 3 lessons, 8 connections. Prose in ar, en and ur for each. Strand A (creating and presenting) has no unit: all nine of its expectations went to the register.
- Record faults noticed: great-mosque-cordoba gives the length as "مئة باع" in Arabic and "a hundred cubits" in English; dimensions left out. Alhambra "For Scholars" and "For Explorers" paragraphs carry facts with no citation; not used. The Dome record's Arabic says the Dome's dome is "مئة ذراع" and "لم ير في الشرق مثلها" while the English says "in Islam" in one place; not used.
- The event record dome-of-the-rock-construction is filed under period/prophetic-era although the event is 66 to 72 AH; not used in text.
- Connection kinds: the event is filed as `story`; the buildings as `place`; the arabesque (an art form) as `object`; tasweer (a legal concept) as `reflection`.

## Result
Ingested. Gate RESULT: GREEN (23 checks); cite-check: 6 pass, 0 fail of 6. 7 of 27 specific expectations in lessons, 20 in the gap register.

## More lessons possible
None honestly; B2.1 could carry a second lesson if the museum gains records on Umayyad and Abbasid patronage of the arts.

## Proposals
- Connection kinds: no `building`/`art form`/`legal concept` kind; `place`, `object` and `reflection` used.
- Runbook: for secondary courses `--list AVI` (the code prefix) works; the runbook says `--list HRT`, fine. The ontario_source.py result for AVI courses is the shared "secondary-arts" source, which says the museum quotes expectations within the 40-word limit.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- b-1, event/dome-of-the-rock-construction, FIX: the dates are now attributed to the book. en: "It was begun in 66 AH (685 CE) and finished in 72 AH (691 CE), and the book the record cites relates ..." → "The book the record cites gives its building as begun in 66 AH (685 CE) and finished in 72 AH (691 CE), and relates ..."; ar: "شُرع فيها ... وفُرغ منها ... وينقل الكتاب" → "ويذكر الكتاب الذي يستند إليه السجل أنه شُرع فيها ... وفُرغ منها ... وينقل"; ur: the same, "جس کتاب کا ریکارڈ حوالہ دیتا ہے وہ بتاتی ہے کہ اس کا آغاز ... اور تکمیل ...". Evidence row reworded.
- b-2, building/alhambra, REMOVE: connection deleted (it named no architectural description); no prose sentence named it; evidence rows deleted. The lesson stands on the Dome of the Rock (Qabbani) and tasweer cards (B2.1, B2.2).
- b-2, concept/tasweer-images-and-picturing, FIX: "jurists differ ... in three views" and the two permissive views only → all the views the record gives, each attributed as the record names them and none endorsed: one view (not forbidden unless an idol is worshipped besides God); the Malikis, some early scholars and Ibn Hamdan (forbid only three-dimensional images complete in their limbs, dislike flat ones); the majority of the Hanafis, Shafi'is and Hanbalis and many early scholars (forbid making flat images as three-dimensional ones, except the cut-off, the demeaned and some other things). Same change in ar and ur (ur uses مسطح for flat). The count "three views" is no longer stated, because the record numbers two before the majority's view and does not number the third. Evidence rows rewritten.
- c-1, building/dome-of-the-rock, FIX: "three shells (painted boards, iron lattice, timber carrying the plates)" removed in en, ar and ur (it is only in the record's summary field); title "Gilded brass, in three shells" → "Gilded brass on the dome and the doors" (ar, ur matching); the card now says the dome is covered in gilded brass and a hundred cubits high including its base (record prose, al-Muqaddasi), and that each door leaf is sheathed in carved yellow brass (al-Umari). Evidence row replaced.
- No verdict was judged wrong.
- Urdu: the unwrapped "(موزیک)" in the Dome of the Rock card (b-1) is now wrapped in U+2066 ... U+2069.
