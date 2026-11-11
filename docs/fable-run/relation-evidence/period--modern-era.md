# period/modern-era

Neighbours before: 0. Relations added: 1.

CANNOT OPEN: one neighbour only.

What the schema allows a period: the only registered predicate that names `period` in its domain or range is `part_of` (inverse `has_part`), and it does not admit a polity, a person or a building. Beyond that a period can only be the object of the open-range predicates (`about`, `set_in`, `wrote_about`, `condemned`), that is, something a work, a film, an event or a person is about. So a period's neighbours can only be events, groups, works, concepts or objects that are part of it, or works and persons that are about it.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| has_part -> event/abolition-caliphate-1342 | «From the abolition of the caliphate to the Iranian revolution; conventional boundaries.» (with `start.edtf: "1924"`) and the summary: «السنوات التي أعقبت إلغاء الخلافة العثمانية سنة 1924: دول وطنية جديدة وتعليم واسع واقتصادات نفطية وأفكار سياسية متنافسة.» | None inline. The field has no `sources:` of its own; the record-level list is `[source/hodgson-1974, source/hourani-1991]`, and the prose cites both only as a general pointer ⁦(«للاطلاع على التأريخ الأوسع لهذا العصر انظر {cite:hodgson-1974} {cite:hourani-1991}»)⁩. | data/period/modern-era.yaml, fields `start.note` and `summary.ar` |

How the relation reads the field: the record names the abolition of the caliphate (1924) as the event the period runs from. It is a boundary event, so `has_part` is a reading of "from".

How the target was identified: event/abolition-caliphate-1342 is «إلغاء الخلافة العثمانية» / "Abolition of the Ottoman Caliphate", 3 March 1924; its own `periods:` field lists this period.

Looked for and not found as records:
- the Iranian revolution of 1979, the other boundary the record names: `ls data/event | grep -iE "iran|revolution|thawra|khomeini|1979"` gives ten file names, none of them the revolution (the nearest are `shia-uprising-iraq-1979` and `turkmen-rebellion-iran-1979`); a search of `data/event` and `data/concept` for «الثورة الإيرانية» and "Iranian revolution" finds the words inside `event/shia-uprising-iraq-1979` but no record of its own.
- nothing else in the summary (nation-states, mass education, oil economies, political ideas) names a record.

Could have been added but the record does not cite it:
- person/ibn-badran and work/madkhal-ila-madhhab-ahmad are listed under «نظرة عامة» in the prose. That list is generated from the `periods:` classification and is uncited; it was not used. (A work could carry `part_of` to a period, but the list is not evidence.)

## Removed after verification

A fresh-context verifier re-read every relation above against this record. These were taken out again because the record does not say as much as the relation does:

- `has_part -> event/abolition-caliphate-1342` (stretched): start.note: 'From the abolition of the caliphate to the Iranian revolution; conventional boundaries.' The summary puts the period after the event: «السنوات التي أعقبت إلغاء الخلافة العثمانية سنة 1924». A boundary marker in an uncited curatorial note; Hodgson and Hourani are on the relation though the record cites them only as further reading. In its favour: the event's own periods field lists this period, and the years agree.
