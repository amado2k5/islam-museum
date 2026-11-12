# object/kiswa

Neighbours before: 0. Relations added: 4.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| mentioned_in -> work/masalik-al-absar | «ويجمع [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] أخبارها في [[work/masalik-al-absar\|«مسالك الأبصار»]]» <br> «في «مسالك الأبصار» للعمري» | {cite:umari-masalik-1924 p.139} <br> no inline marker (see Where) | content/ar/object/kiswa.md, section «موجز» <br> content/ar/object/kiswa.md, the heading of the section; every sentence under it is cited to `source/umari-masalik-1924`, pp. 137-139 |
| written_about_by -> person/ibn-fadl-allah-al-umari | «ويجمع [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] أخبارها في [[work/masalik-al-absar\|«مسالك الأبصار»]]» <br> «يجمع [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] أخبار كسوة الكعبة» <br> «ويروي أنه تولّى بيده خلع الكسوة العتيقة وإلباس الجديدة في حجه سنة 738هـ.» | {cite:umari-masalik-1924 p.139} <br> {cite:umari-masalik-1924 p.137} <br> {cite:umari-masalik-1924 p.138} | content/ar/object/kiswa.md, section «موجز» <br> content/ar/object/kiswa.md, section «في «مسالك الأبصار» للعمري» <br> content/ar/object/kiswa.md, section «في «مسالك الأبصار» للعمري», last sentence |
| written_about_by -> person/al-azraqi-muhammad-ibn-abd-allah | «ثم ما حكاه الأزرقي من أن معاوية كساها الديباج» <br> «وينقل عن الأزرقي عن ابن جريج أن تبّعاً أول من كساها كسوة كاملة.» <br> «فينقل عن [[person/al-azraqi-muhammad-ibn-abd-allah\|الأزرقي]] عن ابن جريج أن تبّعاً أول من كسا الكعبة كسوة كاملة» | {cite:umari-masalik-1924 p.138} <br> {cite:umari-masalik-1924 p.139} <br> {cite:umari-masalik-1924 p.139} | content/ar/object/kiswa.md, section «في «مسالك الأبصار» للعمري» <br> content/ar/object/kiswa.md, section «في «مسالك الأبصار» للعمري» <br> content/ar/object/kiswa.md, section «موجز» |
| made_in -> place/mecca | «تقاليدها من الجاهلية إلى مصنع مكة الحديث؛ تصنع اليوم في دار كسوة الكعبة بأم الجود على أيدي مئتي صانع.» | {cite:wikidata} | content/ar/object/kiswa.md, section «الأثر» |

In the quotations a wikilink's pipe is written `\|` so that the table renders; the record has a plain pipe.

The lead section «موجز» was deepened by a prose writer while this run was working. All quotations were cut from the file as it stood at the end of the run.

Looked for and not found as records: the Banu Shayba, keepers of the Kaaba, who take the old covering. `grep -rlE "بنو شيبة|بني شيبة|Banu Shayba" data/group` finds only `group/banu-shayban` and `group/bakr-ibn-wail`, where the pattern meets the name Shayban, a different tribe; `ls data/group | grep -iE "shayb|hajaba|sadana"` gives only `banu-shayban`.

Could have been added but the record does not cite it: nothing.

Named in the record with a citation, but no registered predicate fits: `building/kaaba`, the first thing the record names. Nothing in `schema/predicates.yaml` runs from an object to a building, and `part_of` has no building in its range, so the Kiswa cannot be linked to the Kaaba.

Supported by the record and left out: those said to have covered the Kaaba, at pp. 137-139, of whom the lead now links `person/muhammad` and `person/abd-allah-al-mamun`. `commissioned_by` is the nearest predicate, but the record is the covering as a yearly institution, not one cloth, and to say that someone covered the Kaaba is not to say he ordered this object made. `made_in -> place/misr`: in al-Umari's day the covering was «تُحمل من الخزانة السلطانية بمصر مع الركب», carried from Egypt, which is not said to be where it was made.

## Removed after verification

A fresh-context verifier re-read every relation above against this record. These were taken out again because the record does not say as much as the relation does:

- `made_in -> place/mecca` (stretched): Section «الأثر»: «تصنع اليوم في دار كسوة الكعبة بأم الجود» {cite:wikidata}, and summary «إلى مصنع مكة الحديث». That is true of today. The same record says that in al-Umari's time it was «تُحمل من الخزانة السلطانية بمصر مع الركب» and that the ruler of Yemen sent another. made_in takes no date, so the edge reads as the object's origin; only the relation's note keeps the time. Mildest of the stretched.
