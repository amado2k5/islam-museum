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

## Arabic cross-check

Machine presence/citation check only, not a translation review:

- `person/mansa-musa`: English prose present (10 sections, 22 citations); Arabic prose present (10 sections, 22 citations).
- `event/djinguereber-built-1327`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/mansa-musa-accession-1312`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/mansa-musa-hajj-724`: English prose present (2 sections, 3 citations); Arabic prose present (2 sections, 3 citations).
- `place/cairo`: English prose present (18 sections, 79 citations); Arabic prose present (18 sections, 79 citations).
- `place/mali`: English prose present (8 sections, 42 citations); Arabic prose present (8 sections, 41 citations).
- `place/mecca`: English prose present (19 sections, 50 citations); Arabic prose present (19 sections, 50 citations).

## Who, where, when

- **Who:** en: Mansa Musa; ar: منسا موسى. Record labels: `person/mansa-musa` en='Mansa Musa', ar='منسا موسى'; `event/djinguereber-built-1327` en='Djinguereber mosque built at Timbuktu', ar='بناء مسجد جنكريبر بتمبكتو'; `event/mansa-musa-accession-1312` en='Mansa Musa takes the throne of Mali', ar='منسا موسى يتولى ملك مالي'; `event/mansa-musa-hajj-724` en='The hajj of Mansa Musa', ar='حج منسا موسى'; `place/cairo` en='Cairo', ar='القاهرة'; `place/mali` en='Mali', ar='مالي'; `place/mecca` en='Mecca', ar='مكة المكرمة'
- **Where:** `place/cairo` (Cairo) coordinates `[30.0626, 31.2497]`, precision `site`; `place/mali` (Mali) coordinates `[17.0, -4.0]`, precision `approx`; `place/mecca` (Mecca) coordinates `[21.4225, 39.8262]` Place relations read: place/mali through `person/mansa-musa` relation `ruled_over`, confidence `low`; King of Mali per the record's summary. | place/mecca through `person/mansa-musa` relation `traveled_to`, confidence `low`; Made the hajj in 724 AH per the record's summary. | place/cairo through `person/mansa-musa` relation `traveled_to`, confidence `low`; Passed through Egypt on his 724 AH hajj, per the record's own text ⁦(مرّ بمصر في حجّه)⁩.
- **When:** `person/mansa-musa` `born`: EDTF `1280~`, precision `year`, status `tradition`. Record note: birth year approximate `person/mansa-musa` `died`: EDTF `1337~`, Hijri `0737~`, precision `year`, status `debated`. Record note: بلغ ابن خلدون أنه توفي بعد خمس وعشرين سنة من ملكه؛ سنة الوفاة محتملة بين ٧٣٧ و٧٣٩هـ؛ التحويل مشتق. `place/cairo` `founded`: EDTF `0969`, precision `year`, status `historical`. Record note: Founded by the Fatimids in 969 CE beside Fustat (khitat al-Maqrizi p.1030).

## What the records say they did

1. Mansa Musa, one of the kings of the Mali empire, the most famous of them according to Ibn Khaldun. — source location `content/en/person/mansa-musa.md — Overview`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
2. The Encyclopaedia of Islam says Mansa Musa reigned from 1312 to 1337 and was the grandson of Abu Bakr. — source location `content/en/person/mansa-musa.md — Overview`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
3. The article reports a story where Mansa Musa says he came to power after his predecessor, Muhammad, embarked on a sea expedition and never returned. — source location `content/en/person/mansa-musa.md — How he came to power`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
4. He made the pilgrimage in 724 AH with a procession whose attendants numbered more than twelve thousand, clothed in brocade and Yemeni silk. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
5. It says Mansa Musa exchanged gifts with the Marinid sultan, including a giraffe. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:tarikh-ibn-khaldun-ibar}`; flag: **stated**.
6. The Encyclopaedia of Islam notes the pilgrimage made a profound impression on Egyptians and was recorded by Arab writers. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 443}`; flag: **stated**.
7. Other articles in the same work give slightly different years for the pilgrimage, with some placing it in 1324 and others in 1325. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 2 p. 1019} {cite:encyclopaedia-of-islam-2 vol. 3 p. 295}`; flag: **stated**.
8. The Mali article mentions that royal pilgrimages were an older habit of West African rulers, making Mali known as a rich Muslim realm. — source location `content/en/person/mansa-musa.md — The pilgrimage`; citation `{cite:encyclopaedia-of-islam-2 vol. 6 p. 278}`; flag: **stated**.
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

1. Players can sail to find the limits of the Atlantic Ocean, as the predecessor of Mansa Musa did, and discover new lands [3].

2. Players must mend the royal ship after a storm to continue Mansa Musa's pilgrimage, showcasing the wealth and generosity that impressed Egyptians [4].

3. Players can exchange gifts with other rulers, like the giraffe Mansa Musa sent to the Marinid sultan, to establish trade routes and alliances [5].

## Sensitivities

Evidence scan, not a ruling: none of the tracked war, illness/death, slavery or sect-dispute terms appears in the extracted evidence. Any such material still requires the full content-safety and age-appropriateness review. Do not add war, illness, death, slavery, sect or living disputes unless the reviewed record requires them and they are necessary, age-appropriate and non-spectacular. Literary traditions must be labelled as such. Invented dialogue must be explicit dramatized paraphrase, never a false quotation.

## Gaps

The museum does not yet hold enough reviewed setting, material-culture or chronology detail for a production quest. Reviewer specialty needed: geography and travel; literature.
