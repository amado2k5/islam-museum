# building/sulaymaniyya-mosque

Neighbours before: 0. Relations added: 3.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| located_in -> place/istanbul | «جامع سليمان القانوني في [[place/istanbul\|إسطنبول]] بناه سنان سنة 1557م على تل يشرف على القرن الذهبي» | {cite:wikidata} | content/ar/building/sulaymaniyya-mosque.md, section «موجز» |
| built_by -> person/mimar-sinan | «جامع سليمان القانوني في [[place/istanbul\|إسطنبول]] بناه سنان سنة 1557م على تل يشرف على القرن الذهبي» | {cite:wikidata} | content/ar/building/sulaymaniyya-mosque.md, section «موجز» |
| patronized_by -> person/sulayman-al-qanuni | «جامع سليمان القانوني في [[place/istanbul\|إسطنبول]] بناه سنان سنة 1557م على تل يشرف على القرن الذهبي» <br> «Sinan's mosque for Suleiman the Magnificent in Istanbul (1557)» | {cite:wikidata} <br> no inline marker (see Where) | content/ar/building/sulaymaniyya-mosque.md, section «موجز» <br> data/building/sulaymaniyya-mosque.yaml, `summary.en`, a data field; the record's only source is `source/wikidata` |

In the quotations a wikilink's pipe is written `\|` so that the table renders; the record has a plain pipe.

Looked for and not found as records: a concept for classical Ottoman architecture, which the summary names in «ذروة العمارة العثمانية الكلاسيكية». `ls data/concept | grep -iE "ottoman|uthmani"` gives only `ottoman-tughra` and `ottoman-islamic-vs-turanian-nationalism`.

Could have been added but the record does not cite it: nothing.

On the predicate: the record says the mosque is Suleiman's and that Sinan built it for him. It does not say in so many words that he ordered it, so the weaker `patronized_by` is used, not `commissioned_by`.

## Removed after verification

A fresh-context verifier re-read every relation above against this record. These were taken out again because the record does not say as much as the relation does:

- `patronized_by -> person/sulayman-al-qanuni` (stretched): The one cited sentence says «جامع سليمان القانوني ... بناه سنان»: Suleiman's mosque, built by Sinan. 'For Suleiman' appears only in summary.en, a data field with no citation. That is possession or dedication, not patronage: the record nowhere says he ordered, paid for or sponsored it, and gives no dates for him. The evidence file concedes it ('does not say in so many words that he ordered it'). Target itself is the right Suleiman.
