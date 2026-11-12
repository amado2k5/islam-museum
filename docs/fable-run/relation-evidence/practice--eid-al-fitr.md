# practice/eid-al-fitr

Neighbours before: 1. Relations added: 2.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| based_on -> concept/ramadan-fiqh | «عيد انقضاء صيام رمضان في أول شوال» | no inline marker (see Where) | data/practice/eid-al-fitr.yaml, `summary.ar`, a data field. The summary was written from `source/wikidata`, as `status.generated_by` records, and that is the source put on the relation |
| based_on -> passage/quran-108-2 | «وفرض كفاية عند الحنابلة لقوله» The record then gives the words of the verse, which are not copied here; they were matched against the frozen text in `data/passage/quran-108-2.yaml`, vowel marks ignored. | {cite:fiqh-mawsua-kuwaitiyya-noor-v3 p.11984} | content/ar/practice/eid-al-fitr.md, section «صلاة العيد». The relation carries `perspective: sunni-hanbali` |

Already in the graph before this run: `work/muktatafat-mena-al-seera` writes `about -> practice/eid-al-fitr`, the one neighbour.

Looked for and not found as records: nothing.

Could have been added but the record does not cite it: the year the festival was instituted. The levelled section «للدارسين» says the second year of the Hijra, without a citation.

Named in the record with a citation, but no registered predicate fits: `practice/eid-al-adha`, the other of the two festivals at p.11984, and `practice/zakat-al-fitr`, `practice/sawm-ramadan` and `practice/salah`. Nothing in `schema/predicates.yaml` runs from a practice to a practice, and `part_of` has no practice in its domain or range, so Eid al-Fitr cannot be linked to its nearest neighbours. `concept/shawwal-month` exists, but the only predicate between a concept and a practice is `basis_for`, and falling on the first of Shawwal is not a basis.

On the two relations: both are of the weaker kind. The first rests on the data summary, not on a sentence with an inline citation. The second is one school's evidence for the ruling of the Eid prayer, and says so in its `perspective` and its `note`.
