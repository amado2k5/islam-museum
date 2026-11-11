# period/buyid-seljuk-fatimid-era

Neighbours before: 0. Relations added: 3.

What the schema allows a period: the only registered predicate that names `period` in its domain or range is `part_of` (inverse `has_part`), and it does not admit a polity, a person or a building. Beyond that a period can only be the object of the open-range predicates (`about`, `set_in`, `wrote_about`, `condemned`), that is, something a work, a film, an event or a person is about. So the dynasties and monuments this record names cannot be its neighbours under the present schema, and a person only as someone who wrote about the period.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| has_part -> event/buyid-entry-baghdad-334 | «Starts when the Buyids enter Baghdad; ends with the fall of the Fatimid caliphate. Curatorial periods may overlap.» (with `start.edtf: "0945"`, `start.hijri: "0334"`) | None inline. The field has no `sources:` of its own; the record-level list is `[source/hodgson-1974, source/hourani-1991]`, and the prose cites both only as a general pointer ⁦(«للاطلاع على التأريخ الأوسع لهذا العصر انظر {cite:hodgson-1974} {cite:hourani-1991}»)⁩. | data/period/buyid-seljuk-fatimid-era.yaml, field `start.note` |
| has_part -> event/abbasid-khutba-egypt-567 | «Starts when the Buyids enter Baghdad; ends with the fall of the Fatimid caliphate. Curatorial periods may overlap.» (with `end.edtf: "1171"`, `end.hijri: "0567"`) | None inline. The field has no `sources:` of its own; the record-level list is `[source/hodgson-1974, source/hourani-1991]`, and the prose cites both only as a general pointer ⁦(«للاطلاع على التأريخ الأوسع لهذا العصر انظر {cite:hodgson-1974} {cite:hourani-1991}»)⁩. | data/period/buyid-seljuk-fatimid-era.yaml, fields `start.note` and `end` |
| has_part -> group/al-fatimiyun | «القرون التي بقي فيها الخليفة العباسي مركزًا رمزيًا بينما حكمت أسر كالبويهيين والفاطميين والسلاجقة، وفيها عمل ابن سينا والبيروني والغزالي.» | None inline; record-level `sources: [source/hodgson-1974, source/hourani-1991]`. | data/period/buyid-seljuk-fatimid-era.yaml, field `summary.ar`; the same sentence opens content/ar/period/buyid-seljuk-fatimid-era.md, section «نبذة» |

How each relation reads the field: the record names the first two events as the opening and the closing of the period, and names the Fatimids among the ruling houses ⁦(«أسر»)⁩ of the period. The first two are boundary events, so `has_part` is a reading of "starts when" and "ends with".

How the targets were identified:

- event/buyid-entry-baghdad-334: «دخول بني بويه بغداد وتلقيبهم سنة 334»; its own `periods:` field lists this period.
- event/abbasid-khutba-egypt-567: «قطع الخطبة العبيدية وإقامة الخطبة العباسية بمصر», Muharram 567 AH (1171 CE). The record does not carry the words "fall of the Fatimid caliphate" in its label; it is identified by its own text ⁦(the Fatimid khutba is ended in Egypt and al-Adid, whom its relations call «آخر الخلفاء العبيديين», dies that month)⁩ and by the matching year 567. It is the only event record for that moment ⁦(`grep -l العاضد data/event/*.yaml`, and the events dated 567)⁩. Its own `periods:` field lists period/crusades-ayyubid-mamluk only; the note quoted above says curatorial periods may overlap.
- group/al-fatimiyun: «الفاطميون ⁦(الأسرة)⁩» / "The Fatimid house", kind `family`; the summary's word is «أسر», houses.

Looked for and not found as records:
- the Buyid house and the Seljuk house as groups: `ls data/group | grep -iE "buyid|buwayh|seljuk|saljuq|salajiq"` and a search of group labels for «بنو بويه», «البويهيون», «السلاجقة», «آل سلجوق» give nothing. They exist only as polities (polity/buyid-dynasty, polity/seljuk-empire), which `part_of` does not admit.

Could have been added but no registered predicate says it:
- person/ibn-sina (linked in the prose), al-Biruni and al-Ghazali, whom the summary says worked in these centuries: the only predicate between a person and a period is `wrote_about`, which is not what the summary says.
- polity/fatimid-caliphate and polity/seljuk-empire, linked in the prose list: no predicate links a polity to a period.

## Removed after verification

A fresh-context verifier re-read every relation above against this record. These were taken out again because the record does not say as much as the relation does:

- `has_part -> event/buyid-entry-baghdad-334` (stretched): start.note: 'Starts when the Buyids enter Baghdad'. The best of the period edges: the event opens the period, and the event's own periods field names this period. But it is still an uncited curatorial note, the prose saying «وهذه الحدود وضعها المتحف للتنظيم وليست قطعية», and Hodgson and Hourani are attached to the relation though the record cites them only as further reading.
- `has_part -> event/abbasid-khutba-egypt-567` (stretched): start.note: 'ends with the fall of the Fatimid caliphate'. The record names no event. The agent matched the phrase to the end of the Fatimid khutba in 567 by the year and the death of al-Adid; the match is sound, but it is the agent's, not the record's. Boundary event, uncited note, borrowed sources; and the event's own periods field lists only period/crusades-ayyubid-mamluk.
- `has_part -> group/al-fatimiyun` (stretched): summary.ar, also the first line of the prose, neither cited: «حكمت أسر كالبويهيين والفاطميين والسلاجقة». Houses that ruled in these centuries are not said to be parts of the period, and the Fatimid house (909 to 1171 in its own record) begins before the period does (945). Sources on the relation are the record's further-reading pair.
