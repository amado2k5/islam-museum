# Mansa Musa — Hudhud quest dossier

**Historical review pending.** Read from museum records at `data/` commit `52cc0fc46b36265077e9109bc1205548b2bc7a8a`. Research handoff, not game text or approval.

## Records read

- `person/mansa-musa`
- `event/djinguereber-built-1327`
- `event/mansa-musa-accession-1312`
- `event/mansa-musa-hajj-724`
- `place/cairo`
- `place/mali`
- `place/mecca`

## Who, where, when

- **Who:** en: Mansa Musa; ar: منسا موسى. Record labels: `person/mansa-musa` en='Mansa Musa', ar='منسا موسى'; `event/djinguereber-built-1327` en='Djinguereber mosque built at Timbuktu', ar='بناء مسجد جنكريبر بتمبكتو'; `event/mansa-musa-accession-1312` en='Mansa Musa takes the throne of Mali', ar='منسا موسى يتولى ملك مالي'; `event/mansa-musa-hajj-724` en='The hajj of Mansa Musa', ar='حج منسا موسى'; `place/cairo` en='Cairo', ar='القاهرة'; `place/mali` en='Mali', ar='مالي'; `place/mecca` en='Mecca', ar='مكة المكرمة'
- **Where:** `place/cairo` (Cairo) coordinates `[30.0626, 31.2497]`, precision `site`; `place/mali` (Mali) coordinates `[17.0, -4.0]`, precision `approx`; `place/mecca` (Mecca) coordinates `[21.4225, 39.8262]` Place relations read: place/mali through `person/mansa-musa` relation `ruled_over`, confidence `low`; King of Mali per the record's summary. | place/mecca through `person/mansa-musa` relation `traveled_to`, confidence `low`; Made the hajj in 724 AH per the record's summary. | place/cairo through `person/mansa-musa` relation `traveled_to`, confidence `low`; Passed through Egypt on his 724 AH hajj, per the record's own text ⁦(مرّ بمصر في حجّه)⁩.
- **When:** `person/mansa-musa` `born`: EDTF `1280~`, precision `year`, status `tradition`. Record note: birth year approximate `person/mansa-musa` `died`: EDTF `1337~`, Hijri `0737~`, precision `year`, status `debated`. Record note: بلغ ابن خلدون أنه توفي بعد خمس وعشرين سنة من ملكه؛ سنة الوفاة محتملة بين ٧٣٧ و٧٣٩هـ؛ التحويل مشتق. `place/cairo` `founded`: EDTF `0969`, precision `year`, status `historical`. Record note: Founded by the Fatimids in 969 CE beside Fustat (khitat al-Maqrizi p.1030).

## What the records say they did

1. Mansa Musa, one of the kings of the Mali empire, the most famous of them according to Ibn Khaldun. He ruled for about a quarter of a century and was succeeded by Mari Jata. — source location `content/en/person/mansa-musa.md — Overview`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
2. The Encyclopaedia of Islam, whose article on him this page now follows, gives his reign as 712 to 738 AH, that is 1312 to 1337, and calls him king, mansa, of Mali. It describes him as apparently the grandson of Abu Bakr, called Manding Bori, who was the brother of Mari Jata, the legendary hero credited with founding Mali as a powerful empire. The article says he reigned at the peak of Mali's prosperity and that… — source location `content/en/person/mansa-musa.md — Overview`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
3. The article reports a story told by Mansa Musa himself to an informant of the Mamluk writer al-Umari, a man named Ibn Amir Hajib who often kept his company in Egypt. According to it, Musa came to power because his predecessor, Muhammad, from another branch of the same family, appointed him deputy before setting out on a sea expedition to find the limits of the Atlantic Ocean. That predecessor never came back. — source location `content/en/person/mansa-musa.md — How he came to power`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
4. He made the pilgrimage in 724 AH with a procession whose attendants numbered more than twelve thousand, clothed in brocade and Yemeni silk. The news of his generosity and the breadth of his realm in the Maghrib, Egypt and the East spread after that. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
5. He exchanged gifts with the Marinid sultan Abu al-Hasan, and among what he sent was a giraffe, which the people of the Maghrib talked about for a long time. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
6. The Encyclopaedia of Islam dates the pilgrimage to Mecca to 1324 and says he left a deputy to rule in his absence. It says the journey made a profound impression on the Egyptians and was recorded by Arab writers. According to the seventeenth-century Timbuktu chronicles, the Tarikh al-Sudan and the Tarikh al-Fattash, whose authors relied heavily on oral sources, he was accompanied by an entourage of thousands,… — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
7. Other articles of the same work give slightly different years. The article on Gao places his return from the pilgrimage in 724 AH, 1324, while the article on the Hausa dates the journey to 725 AH, 1325. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 2 p. 1019} {cite:encyclopaedia-of-islam-2 vol. 3 p. 295}`; flag: **stated**.
8. The Mali article presents royal pilgrimage as an older habit of West African rulers. It names earlier kings, Uli, who passed through Cairo, and Sakura, whose pilgrimage Ibn Khaldun recorded, and calls Musa the most famous of all royal pilgrims. It adds that the visits of Mali's kings to North Africa, Egypt and Mecca made the kingdom known, often under the name Takrur in Egyptian chronicles, as a Muslim realm rich… — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 278}`; flag: **stated**.

## Thumbnail elements without record support

The atlas title is The King and the River of Gold / أغنى رجل في التاريخ. No record read supports the exact pictured scene, costumes, objects, people, weather, lighting or child-facing drama implied by the thumbnail. Because the source pictures are not available in this checkout, this dossier uses the atlas titles rather than visual inspection; the title itself is not treated as a historical claim. Treat those elements as design fiction unless a reviewer supplies support.

## Setting

`place/cairo` (Cairo) coordinates `[30.0626, 31.2497]`, precision `site`; `place/mali` (Mali) coordinates `[17.0, -4.0]`, precision `approx`; `place/mecca` (Mecca) coordinates `[21.4225, 39.8262]` Place relations read: place/mali through `person/mansa-musa` relation `ruled_over`, confidence `low`; King of Mali per the record's summary. | place/mecca through `person/mansa-musa` relation `traveled_to`, confidence `low`; Made the hajj in 724 AH per the record's summary. | place/cairo through `person/mansa-musa` relation `traveled_to`, confidence `low`; Passed through Egypt on his 724 AH hajj, per the record's own text ⁦(مرّ بمصر في حجّه)⁩. Landscape, interiors, clothing and objects beyond the linked records would be invention pending review.

## Related museum records a quest could link to

- `event/djinguereber-built-1327`
- `event/mansa-musa-accession-1312`
- `event/mansa-musa-hajj-724`
- `person/mansa-musa`
- `person/mari-jata`
- `place/cairo`
- `place/mali`
- `place/mecca`
- `polity/mali-empire`

## Three candidate quest premises

These are proposals for Claude and the founder, not content.

1. A local problem asks the player to apply Sail/Route and Mend to the documented object, place, text or route, using only the claims above as the factual base.

2. Hudhud helps the player compare what the museum record states, what it states uncertainly and what the thumbnail adds, then solve the puzzle through Sail/Route and Mend.

3. The completed page returns to the Atlas with optional older-reader context, one hidden collectible and replay goals. This is a structural proposal only, not historical content.

## Sensitivities

Do not add war, illness, death, slavery, sect or living disputes unless the reviewed record requires them and they are necessary, age-appropriate and non-spectacular. Literary traditions must be labelled as such. Invented dialogue must be explicit dramatized paraphrase, never a false quotation.

## Gaps

The museum does not yet hold enough reviewed setting, material-culture or chronology detail for a production quest. Reviewer specialty needed: geography and travel; literature.
