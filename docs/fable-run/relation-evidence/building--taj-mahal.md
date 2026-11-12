# building/taj-mahal

Neighbours before: 1. Relations added: 4.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| located_in -> place/agra | «تاج محل ضريح في [[place/agra\|آغرة]] بناه [[person/shah-jahan-mughal\|شاه جهان]] لزوجته ممتاز محل بين 1632 و1653م» <br> «ضريح بناه شاه جهان في آكره لزوجه ممتاز محل» | {cite:wikidata} <br> {cite:brookes-gardens-of-paradise-1987 p.152} {cite:brookes-gardens-of-paradise-1987 p.154} | content/ar/building/taj-mahal.md, section «موجز» <br> data/building/taj-mahal.yaml, `summary.ar`; the same file has the field `location: place/agra` |
| built_by -> person/shah-jahan-mughal | «تاج محل ضريح في [[place/agra\|آغرة]] بناه [[person/shah-jahan-mughal\|شاه جهان]] لزوجته ممتاز محل بين 1632 و1653م» <br> «يذكر [[person/john-brookes\|جون بروكس]] أن [[person/shah-jahan-mughal\|شاه جهان]] بنى التاج ذكرى لزوجه ممتاز محل التي ماتت في ولادة طفلها الرابع عشر بعد ثلاث سنين من جلوسه» | {cite:wikidata} <br> {cite:brookes-gardens-of-paradise-1987 p.151} {cite:brookes-gardens-of-paradise-1987 p.152} {cite:brookes-gardens-of-paradise-1987 p.154} | content/ar/building/taj-mahal.md, section «موجز» <br> content/ar/building/taj-mahal.md, section «البناء والبستان عند بروكس»; the data file has the field `patron: person/shah-jahan-mughal` |
| burial_place_of -> person/shah-jahan-mughal | «ودُفن شاه جهان بجوار زوجه فيه سنة 1666م.» <br> «ودُفن شاه جهان بجوار زوجته فيه سنة 1666م» | {cite:brookes-gardens-of-paradise-1987 p.159} <br> {cite:brookes-gardens-of-paradise-1987 p.159} | content/ar/building/taj-mahal.md, section «موضعه من البستان» <br> content/ar/building/taj-mahal.md, section «موجز» |
| exemplifies -> concept/chaharbagh | «يقوم الضريح على منصة بين جناحين من الحجر الرملي والرخام، أحدهما مسجد والآخر قاعة استقبال، فوق مستوى [[concept/chaharbagh\|البستان الرباعي]]» <br> «ويقوم الضريح على منصة بين جناحين من الحجر الرملي والرخام، أحدهما مسجد والآخر قاعة استقبال، فوق مستوى [[concept/chaharbagh\|البستان الرباعي]]» | {cite:brookes-gardens-of-paradise-1987 p.152} {cite:brookes-gardens-of-paradise-1987 p.154} <br> {cite:brookes-gardens-of-paradise-1987 p.154} | content/ar/building/taj-mahal.md, section «موضعه من البستان» <br> content/ar/building/taj-mahal.md, section «موجز» |

In the quotations a wikilink's pipe is written `\|` so that the table renders; the record has a plain pipe.

Already in the graph before this run: `work/gardens-of-paradise` writes `mentions -> building/taj-mahal`, the one neighbour.

The lead section «موجز» was deepened by a prose writer while this run was working. All quotations were cut from the file as it stood at the end of the run.

Looked for and not found as records: Mumtaz Mahal, for whom the record says it was built. `ls data/person | grep -iE "mumtaz|arjumand"` gives only `mumtaz-daultana`, someone else; `grep -rlE "ممتاز محل|Mumtaz Mahal" data/person` finds her only inside other people's records. The river Yamuna: `ls data/place | grep -iE "yamuna|jumna|jamna"` gives nothing. `person/john-brookes` and `person/syed-ali-nadeem-rezavi`, which the prose links, are stubs only, in `data/_stubs.d/claude-ocr-harvest-h.yaml`, not records.

Could have been added but the record does not cite it: the architect. `person/ustad-ahmad-lahori` exists, but the record says only «وتُنسب تصاميمه إلى أسماء عدة» and names no one.

Named in the record with a citation, but no registered predicate fits: `building/tomb-of-akbar-sikandra`, `building/itimad-ud-daulah-tomb` and `building/humayun-tomb`, which Brookes gives at p.154 as its forerunners. Nothing in `schema/predicates.yaml` runs from a building to a building.
