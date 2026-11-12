# concept/sharia

Neighbours before: 0. Relations added: 3.

The record's whole text is one sentence. All three relations come from it.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| has_part -> concept/ibada | «الإطار المعياري الإسلامي الجامع للعبادة والمعاملة والأخلاق؛ يدرّسه الفقه وتتنوع فيه المذاهب والاجتهادات.» | {cite:wikidata} | content/ar/concept/sharia.md, section «موجز»; the same words are `summary.ar` in data/concept/sharia.yaml |
| has_part -> concept/madhhab | the same sentence: «... وتتنوع فيه المذاهب والاجتهادات.» | {cite:wikidata} | content/ar/concept/sharia.md, section «موجز» |
| has_part -> concept/ijtihad | the same sentence: «... وتتنوع فيه المذاهب والاجتهادات.» | {cite:wikidata} | content/ar/concept/sharia.md, section «موجز» |

How each relation reads the sentence:

- `has_part -> concept/ibada`: «الجامع للعبادة» ("the framework that takes in worship"). Target labelled «العبادة».
- `has_part -> concept/madhhab` and `has_part -> concept/ijtihad`: «تتنوع فيه المذاهب والاجتهادات» ("within it the schools and the interpretations vary"). The reading is the word «فيه», "within it". Targets labelled «المذهب» and «الاجتهاد». These two are a looser fit than the first: the sentence places the schools and the acts of ijtihad inside the Sharia, it does not call them its parts in so many words.

Caveat for the re-check: the record's only source is a Wikidata description (`sources: [source/wikidata]`), so all three relations rest on that one citation.

Looked for and not found as records:
- «المعاملة» as a legal category: `ls data/concept | grep -iE "muamal|mu-amal"` gives only `rule-of-three-muamalat` and `ilm-al-muamala-wal-mukashafa`.
- «الأخلاق» as a category: only `concept/khuluq` (good character, one virtue), `akhlaq-al-harb`, `ethics-of-the-new-community`; not used.

Could have been added but the sentence does not state it in a form a registered predicate carries:
- concept/fiqh. The sentence says «يدرّسه الفقه» ("jurisprudence teaches it"). No registered predicate says "studied by" or "taught by"; `basis_for` would be an inference. Note for the lead: concept/fiqh's own summary says fiqh is «أحد أنواع الشريعة الثلاثة مع العقائد والأخلاق» {cite:nashat-al-fiqh-al-ijtihadi-azhar p. 6}, so `part_of -> concept/sharia` could be written from the fiqh record on its own evidence. That file was not mine to edit.
