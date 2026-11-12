# concept/al-hadith-al-nabawi

Neighbours before: 0. Relations added: 2.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| has_part -> concept/kutub-al-sitta | «الحديث النبوي المصدر الثاني بعد القرآن: يبيّن مجمله ويقرر تفاصيل العبادة والمعاملة، وجُمع في مصنفات أشهرها الكتب الستة.» The summary says the same: «جُمع في مصنفات مرتبة على الأبواب أو على مسانيد الرواة، أشهرها الكتب الستة.» | `sources: [source/sahih-al-bukhari, source/sahih-muslim]` on the `did_you_know` entry. The summary sentence has no inline cite token; the record-level list is the two Sahihs and source/manhaj-tawthiq-al-sunna-azhar. | data/concept/al-hadith-al-nabawi.yaml, `education.did_you_know.ar` (with its own `sources:`) and `summary.ar` |
| basis_for -> concept/ibada | «الحديث النبوي المصدر الثاني بعد القرآن: يبيّن مجمله ويقرر تفاصيل العبادة والمعاملة، وجُمع في مصنفات أشهرها الكتب الستة.» The summary: «يبيّن مجمله ويقرر تفاصيل العبادة والمعاملة والسيرة والأخلاق.» | `sources: [source/sahih-al-bukhari, source/sahih-muslim]` on the `did_you_know` entry; the summary has no inline cite token. | data/concept/al-hadith-al-nabawi.yaml, `education.did_you_know.ar` and `summary.ar` |

How each relation reads the sentence:

- `has_part -> concept/kutub-al-sitta`: the record says the hadith was gathered into compilations and names the Six Books as the best known of them. The edge says the Six Books are part of the hadith corpus. The target is the record labelled «الكتب الستة» / "The Six Books".
- `basis_for -> concept/ibada`: the record says the hadith "fixes the details of worship" ⁦(«يقرر تفاصيل العبادة»)⁩. The edge says the hadith is a basis for worship. The target is the record labelled «العبادة» / "Ibada (worship)".

Caveat for the re-check: both sentences are cited in the record to the two Sahihs. Neither book can itself attest the later term "the Six Books"; the relation inherits the record's citation as it stands and adds no source.

Looked for and not found as records:
- «المعاملة» as a legal category: `ls data/concept | grep -iE "muamal|mu-amal"` gives only `rule-of-three-muamalat` and `ilm-al-muamala-wal-mukashafa`, neither of which is the category.
- «الأخلاق» as a category: `ls data/concept | grep -iE "akhlaq|khuluq|ethic"` gives `khuluq` (good character, one virtue), `akhlaq-al-harb`, `ethics-of-the-new-community`; none is the category the sentence names, so none was used.

Could have been added but the record does not cite it, or no registered predicate says it:
- person/muhammad. The first, cited sentence says the hadith is what is transmitted from the Prophet. No registered predicate from a concept to a person says "transmitted from" (the only one that fits the classes is `influenced_by`, which would misstate the sentence). The existing `related_to` edge stays as it was.
- concept/isnad. The same cited sentence says the hadith "reaches us through a sanad". No registered predicate says "transmitted through"; `has_part` or `based_on` would add a claim the sentence does not make. The existing `related_to` edge stays as it was.
- concept/al-sira-al-nabawiyya. The prose says only «يرتبط الحديث بفن السيرة النبوية. ويحتاج التفصيل إلى مصدر إضافي», uncited.
- work/quran. «المصدر الثاني من مصادر الإسلام بعد القرآن ... يبيّن مجمله»: no registered predicate from a concept to a work says "explains".

Note on the check script: it reports two problems for this record. Both are the `related_to` edges to person/muhammad and concept/isnad, which were in the file at HEAD (lines 13 and 14) and were not written or changed in this pass.

## Removed after verification

A fresh-context verifier re-read every relation above against this record. These were taken out again because the record does not say as much as the relation does:

- `has_part -> concept/kutub-al-sitta` (stretched): «وقد جُمع في مصنفات مرتبة على الأبواب أو على مسانيد الرواة، وأشهرها الكتب الستة»: in the prose section «طريق وصوله» and in summary.ar this sentence has no citation. The only source list is on education.did_you_know, [sahih-al-bukhari, sahih-muslim], and those two books cannot attest a later term that counts them among six; the relation repeats that attribution. 'Gathered in compilations, the best known being the Six Books' is also not 'has the Six Books as a part'.
- `basis_for -> concept/ibada` (stretched): «يبيّن مجمله ويقرر تفاصيل العبادة والمعاملة والسيرة والأخلاق»: predicate and target fit the words. But the prose sentence in section «مكانته» and summary.ar are uncited; the only source list is the same did_you_know one, which the clause about the Six Books shows to be the record's list carried over, not a citation of the sentence. The record's provenance calls the text «صياغة المتحف». Stretched on citation alone.
