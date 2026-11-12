# concept/masjid-umum

Neighbours before: 0. Relations added: 2.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| exemplified_by -> building/prophets-mosque | «بيت العبادة الجامع للمسلمين؛ من مسجد النبي في المدينة تطورت بنيته حول المصلى والقبلة والمنبر والصحن.» | {cite:wikidata} | content/ar/concept/masjid-umum.md, section «موجز» |
| has_part -> concept/minbar | «بيت العبادة الجامع للمسلمين؛ من مسجد النبي في المدينة تطورت بنيته حول المصلى والقبلة والمنبر والصحن.» | {cite:wikidata} | content/ar/concept/masjid-umum.md, section «موجز» |

Looked for and not found as records: the courtyard and the prayer hall, the other two parts the cited sentence names. `ls data/concept | grep -iE "sahn|courtyard|musalla|prayer-hall"` gives nothing; `grep -rlE "الصحن|المصلى" data/concept` finds only this record and `concept/qaa`, a different room.

Could have been added but the record does not cite it: the mihrab and the minaret. `concept/mihrab` and `concept/manara` exist, but the record names them only in its levelled sections «للمستكشفين» and «للدارسين», which carry no citation.

Supported by the record and left out: `concept/qibla`, named in the cited sentence. That record is the legal concept of the direction of prayer, not a part of the building, so `has_part` would misstate it.
