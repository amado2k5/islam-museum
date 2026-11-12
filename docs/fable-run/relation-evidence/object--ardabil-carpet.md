# object/ardabil-carpet

Neighbours before: 0. Relations added: 0.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| none | none | none | none |

CANNOT OPEN. The record's prose is two paragraphs in `content/ar/object/ardabil-carpet.md`, both cited {cite:wikidata}. What they name, and why none of it became a relation:

- «سجادة صفوية ضخمة ⁦(1539–1540م)⁩ من أردبيل»: `place/ardabil` exists. The only predicates from an object to a place are `made_in` and `depicts`. The sentence says the carpet is from Ardabil; it does not say where it was woven, so `made_in` would say more than the record does.

- «تحمل بيتًا من حافظ واسم مؤسس الورشة مقصود كاشاني»: `person/hafiz-al-shirazi` exists, but no registered predicate links an object to the poet whose verse is written on it; from an object to a person there are only `made_by`, `commissioned_by` and `depicts`. Maqsud Kashani has no record.

- The word «صفوية» in the first quotation: `polity/safavid-iran` exists. The only predicate from an object to a polity is `commissioned_by`, and the record does not say who ordered the carpet.

- «نسخة اللوس أنجلوس وتوأمها في متحف فكتوريا وألبرت», and the data field `holding_institution: LACMA, Los Angeles`: neither museum has a record, so `held_by` has no target. `place/los-angeles` exists, but nothing links an object to the place where it is kept.

Looked for and not found as records: Maqsud Kashani. `grep -rlE "مقصود كاشاني|مقصود الكاشاني|Maqsud Kashani|Maqsud of Kashan" data/person data/group data/_stubs.yaml data/_stubs.d` gives nothing; `person/haji-maqsud-tabrizi` is someone else. The two museums: `grep -rlE "Victoria and Albert|فكتوريا وألبرت|فيكتوريا وألبرت|LACMA|Los Angeles County Museum" data/group data/listing data/building data/place` gives nothing. A concept for Safavid or Persian carpets: `ls data/concept | grep -iE "carpet|sajjad|rug"` gives only `mamluk-carpets`, `oriental-carpets-renaissance` and `transylvanian-rugs`.

Could have been added but the record does not cite it: nothing.
