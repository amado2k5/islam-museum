# Run log: ca-on-g2-social-studies

Course: Ontario Ministry of Education, "SSHG - Grade 2 (2023)", archive slug `ontario-sshg-g2`. Subject `course/ca-on-g2-social-studies`, grade `course/ca-on-g2`, system `course/ca-on-english`. Fleet run: graph prebuilt; validate, derive, test, build and git state changes skipped by order.

- Started 2026-11-12T05:54Z (date -u). Ended 2026-11-12T06:04Z.
- 05:54Z fetch: `fetch_ontario.py --list "Grade 2"` named "SSHG - Grade 2 (2023)"; fetched to `.cache/curricula/ontario-sshg-g2/`; manifest `docs/courses/curricula/ontario-sshg-g2.json`. 2 strands, 6 overall, 34 specific expectations.
- Source record: `ontario_source.py ontario-sshg-g2` printed `source/ontario-curriculum-sshg-2023` (reused).
- Searches (find_entity.py): Eid, Ramadan, zakat al-fitr, qanat, well, irrigation, First Nations, Inuit, Canada, immigrants, family, family tree, globe, continent/equator, climate, sustainability, farming, shelter, hunting, food, festivals, qibla/directions, diversity, language, needs/water, sea, Mexico/Toronto, residential school, heritage, Canadian commemorative days. Briefs read: eid-al-fitr, sawm-ramadan, zakat-al-fitr, karaji-qanat-surveying, athar-al-iqlim, al-aqalim-al-saba, dairat-al-istiwa, environmental-protection-in-islam, tabula-rogeriana, agriculture-in-islam, qibla, sabil.

## Plan

| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g2-social-studies-a-1 | Eid al-Fitr: a celebration that comes back every year | A2.1, A3.4 |
| ca-on-g2-social-studies-a-2 | Passing traditions on: Ramadan and the alms of Eid | A3.6, A3.7 |
| ca-on-g2-social-studies-b-1 | Showing the world on a map | B3.1, B3.2 |
| ca-on-g2-social-studies-b-2 | Near or far from the equator: place and climate | B3.4 |
| ca-on-g2-social-studies-b-3 | Looking after water, air and soil | B1.3 |
| ca-on-g2-social-studies-b-4 | How people get water | B3.6 |

## The link sentences ("The expectation asks the student to ___; this record shows ___")

- A2.1/A3.4 -> practice/eid-al-fitr: ask questions about and describe a faith celebration kept by families; the record shows what Eid al-Fitr is, that it recurs, and what is recommended on the day.
- A3.6/A3.7 -> practice/sawm-ramadan: name ways heritage passes on through family practices (Ramadan is named in the expectation's examples); the record shows the month and the recommended generosity to dependents, kin and neighbours in its last ten nights.
- A3.6/A3.7 -> practice/zakat-al-fitr: same; the record shows an alms tied to the end of the fast.
- B3.1 -> invention/tabula-rogeriana: understand that locations can be shown in different ways; the record shows one world picture as a silver disc and as a book of seventy maps.
- B3.2 -> concept/dairat-al-istiwa: identify the equator and the hemispheres; the record defines the equator as the circle dividing the earth into northern and southern halves.
- B3.4 -> concept/al-aqalim-al-saba: describe how location and climate are related; the record shows a medieval account of heat and cold by distance from the equator.
- B1.3 -> concept/environmental-protection-in-islam: understand why sustainability matters; the record shows one author's view on pollution and on living with the environment so as to preserve it (attributed as his reading).
- B3.6 -> concept/sabil and invention/karaji-qanat-surveying: describe ways communities meet a basic need (water); the records show a public water fountain and a gravity-fed tunnel.

## Judgement calls

- A2.1 is a skills expectation, but its examples name Eid al-Fitr and it asks for questions about celebrations the museum can supply; it went into lesson a-1. B2.1 (the same skill with no Islamic example) went to the register as a skills expectation.
- concept/athar-al-iqlim was read and not linked: its summary makes claims about skin colour and climate that a Grade 2 lesson should not carry, and no other record in the lesson needs it.
- concept/agriculture-in-islam was read and not linked for B1.3: it does not speak of sustainability.
- concept/qibla was read and not linked for B3.3 (cardinal directions): the qibla is the direction of the Kaaba, not a map direction.
- Lessons b-1, b-2, b-4 serve only the museum's part of an expectation that asks for present-day communities; each Brief says so.
- Connection kind: practices and concepts have no kind of their own; `reflection` used for practices and for the equator and the environment record, `place` for the climes and the sabil, `invention` for the world map and the qanat.

## Problems met with the runbook

- None blocking. `cite-check.ts` prints "N pass, 0 fail"; the fleet message asks for the "0 fail" line as printed.
- The runbook does not say how to translate a cut overall expectation (ends " …" after "(FOCUS"): I ended Arabic and Urdu with " …" and dropped the cut parenthetical.
- Translating the overall expectations' "(FOCUS ON: ...)" label needs a decision; I translated it as "التركيز على" and "توجہ کا محور" and wrapped it in U+2066 ... U+2069.

## More lessons possible

None beyond the six; the other expectations have no honest record (see the gap register).

## Proposals

- Connection kinds: add `practice` (a festival, a rite) and `concept`; the closed list forces `reflection` or `place`.
- Ontario Grade 2 asks for Canadian commemorative days and Canadian communities; the museum holds no record of Canada beyond empty `place/canada` and `place/ontario`.
- The full official wording: a link from each expectation to the Ministry's page for it.

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 2 social studies). Applied in all three languages. No connection was added.

- a-1 `practice/eid-al-fitr` (FIX): "The record says the Muslims have two Eids" -> "The Kuwaiti jurisprudence encyclopaedia, which gives this etymology, says ..." (ar: وتذكر الموسوعة الفقهية الكويتية; ur: کویتی فقہی انسائیکلوپیڈیا کے مطابق). The Eid-bath sentence is replaced by the cited takbir line: "takbir is prescribed on the two Eids on the way to the prayer, in homes, markets and roads, until the prayer begins" (ar: التكبير مشروع في العيدين في الغدو إلى الصلاة في المنازل والأسواق والطرق حتى تبدأ الصلاة; ur: گھروں، بازاروں اور راستوں میں نماز شروع ہونے تک تکبیر). I used the reviewer's second option (restate only the cited prayer and takbir lines) and did not use the uncited "For Sprouts" lines (fresh clothes, visits, greetings). The evidence row now quotes the takbir sentence.
- a-2 `practice/sawm-ramadan`, `practice/zakat-al-fitr` (REMOVE, whole lesson): lesson record and three prose files deleted, removed from unit a, evidence rows deleted; A3.6 and A3.7 added to the gap register (texts copied from the lesson record before deletion), each with two search lines. Unit a keeps one lesson.
- b-1 `invention/tabula-rogeriana` (FIX): now "In al-Idrisi's account, he made ... a big metal disc engraved with lands, rivers and routes, and a book of seventy maps" (cut "seven climes", "pure silver" and the ten-sections detail; "according to the record" -> the record's own "In al-Idrisi's account"); ar: في رواية الإدريسي نفسه ... قرص معدني كبير ... وكتاب فيه سبعون خريطة; ur likewise. The disc-versus-book question is kept.
- b-1 `concept/dairat-al-istiwa` (FIX): cut "the first boundary of the inhabited quarter from the south" (en, ar, ur) and attributed the equal day and night sentence to al-Farghani ("Al-Farghani adds that ..."; ar: ويضيف الفرغاني; ur: فرغانی یہ بھی بتاتے ہیں).
- b-2 `concept/al-aqalim-al-saba` (REMOVE, whole lesson): same as a-2; B3.4 added to the gap register. Unit b keeps three lessons.
- b-3 `concept/environmental-protection-in-islam` (KEEP with the reviewer's small fix): "preserves its constituents" -> "keeps what it needs" (ar: بما يحفظ ما تحتاج إليه; ur: اس کی ضرورت کی چیزیں محفوظ رہیں); the attribution to Muhyi al-Din Afifi Ahmad and "the author's own views" stay. The card still opens "the record says", kept as the reviewer called it attributed throughout.
- b-4 `concept/sabil` (FIX): cut the siqaya / fifth-century sentence and wrote "Al-Haddad describes a sabil as ..." in place of "The record describes" (ar: يصف الحداد; ur: الحداد سبیل کو ... بتاتے ہیں). `invention/karaji-qanat-surveying` (FIX): cut the 2020-study and levelling sentence; kept the sloping tunnel, gravity and shafts.
- Unit and subject text: unit a and b summaries no longer name the removed topics; unit b's prose said "four lessons", unit a's "two lessons"; now three and one. Also, the unit prose files of both units had their Arabic and English text in each other's files (the `ar` file in English, the `en` file in Arabic); I wrote each language into its own file while changing the counts. Worth a check of other units for the same swap.
- Verdicts judged wrong and not applied: none.
