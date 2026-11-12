# period/gunpowder-empires

Neighbours before: 0. Relations added: 0.

CANNOT OPEN: every record its own text names is a polity or a building, and no registered predicate links a period to either.

What the schema allows a period: the only registered predicate that names `period` in its domain or range is `part_of` (inverse `has_part`), and it does not admit a polity, a person or a building. Beyond that a period can only be the object of the open-range predicates (`about`, `set_in`, `wrote_about`, `condemned`), that is, something a work, a film, an event or a person is about. So the dynasties and monuments this record names cannot be its neighbours under the present schema, and a person only as someone who wrote about the period.

The record's statement is «عصر الدول العثمانية والصفوية والمغولية الهندية، ثلاث دول كبرى طويلة العمر ذات بلاطات وجيوش وفنون عظيمة.» (data `summary.ar`; record-level `sources: [source/hodgson-1974, source/hourani-1991]`). The dated fields name no event («Dates are approximate; the three empires rose and fell at different times.»).

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| (none) | | | |

What the text names, and why none could be written:
- polity/ottoman-empire, polity/safavid-iran, polity/mughal-empire: all three are real records, and they are the definition of this period. `part_of` (the only predicate a period can use) has no `polity` in its domain.
- The Taj Mahal, Naqsh-e Jahan Square and the Süleymaniye Mosque, in the uncited «للمستكشفين» section: buildings, which `part_of` does not admit either; and the section is uncited.
- Marshall Hodgson and William McNeill, named in the uncited «للدارسين» section as the historians behind the term (`written_about_by` would fit a person): `ls data/person | grep -iE "hodgson|mcneill"` gives nothing (Hodgson is present only as source/hodgson-1974, and a source record cannot be the target of a relation here).

Looked for and not found as records:
- ruling houses as groups: group/al-uthman ⁦(«آل عثمان», the Ottoman house)⁩ exists, but the record says «الدول» (states), not houses, so it was not substituted for the state; no Safavid or Mughal house exists as a group (`ls data/group | grep -iE "safavid|safaw|mughal"`).

Could have been added but the record does not cite it:
- The lists under «نظرة عامة» in the prose (three polities, four mosques) are generated from the `periods:` classification and are uncited; they were not used, and their classes do not fit `part_of` in any case.
