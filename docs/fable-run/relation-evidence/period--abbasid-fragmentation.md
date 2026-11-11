# period/abbasid-fragmentation

Neighbours before: 0. Relations added: 2.

What the schema allows a period: the only registered predicate that names `period` in its domain or range is `part_of` (inverse `has_part`), and it does not admit a polity, a person or a building. Beyond that a period can only be the object of the open-range predicates (`about`, `set_in`, `wrote_about`, `condemned`), that is, something a work, a film, an event or a person is about. So the dynasties and monuments this record names cannot be its neighbours under the present schema, and a person only as someone who wrote about the period.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| has_part -> event/death-of-mutawakkil | «Conventional start: the troubles after the murder of al-Mutawakkil; scholars place the transition differently.» (with `start.edtf: "0861~"`) | None inline. The field has no `sources:` of its own; the record-level list is `[source/hodgson-1974, source/hourani-1991]`, and the prose cites both only as a general pointer ⁦(«للاطلاع على التأريخ الأوسع لهذا العصر انظر {cite:hodgson-1974} {cite:hourani-1991}»)⁩. | data/period/abbasid-fragmentation.yaml, field `start.note` |
| has_part -> event/buyid-entry-baghdad-334 | «The Buyids enter Baghdad.» (with `end.edtf: "0945"`, `end.hijri: "0334"`) | None inline. The field has no `sources:` of its own; the record-level list is `[source/hodgson-1974, source/hourani-1991]`, and the prose cites both only as a general pointer ⁦(«للاطلاع على التأريخ الأوسع لهذا العصر انظر {cite:hodgson-1974} {cite:hourani-1991}»)⁩. | data/period/abbasid-fragmentation.yaml, field `end.note` |

How each relation reads the field: the record names these two events as the opening and the closing of the period; the edge says each is part of it. Both are boundary events, so this is a reading, and it is flagged as such.

How the targets were identified:

- event/death-of-mutawakkil is «مقتل المتوكل» / "Killing of al-Mutawakkil", 247 AH (861 CE).
- event/buyid-entry-baghdad-334 is «دخول بني بويه بغداد وتلقيبهم سنة 334» / "The Buyids enter Baghdad and receive their titles, 334 AH". Its own `periods:` field lists period/buyid-seljuk-fatimid-era, the next period, which also names this event as its start; the event is therefore written as part of both periods it separates.

Looked for and not found as records:
- the Tulunids, the Samanids and the Saffarids as groups: `ls data/group | grep -iE "tulun|saman|saffar"` gives nothing. They exist only as polities (polity/tulunid-dynasty, polity/samanid-dynasty, polity/saffarid-dynasty), which `part_of` does not admit.

Could have been added but the record does not cite it:
- The lists under «نظرة عامة» in the prose (two polities, two persons, two works, six concepts) are generated from the `periods:` classification of those records and carry no citation; they were not used. One of them looks misplaced: polity/ghaznavid-empire (962 to 1187) is listed under a period that ends in 945.
