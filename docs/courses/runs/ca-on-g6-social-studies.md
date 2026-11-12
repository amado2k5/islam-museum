# Run log: ca-on-g6-social-studies
Start 2026-11-12T05:54Z
(started 2026-11-12T05:54Z; ended 2026-11-12T05:59Z)

## Steps
- Fetched "SSHG - Grade 6 (2023)" as `ontario-sshg-g6` (2 strands, 6 overall, 40 specific). Source: `source/ontario-curriculum-sshg-2023` via ontario_source.py.
- Searched about 25 spelling sets (First Nations, Inuit, French, Chinese labourers, Canada, Kabul, Tripoli, Mumbai, Mogadishu, Nairobi, Beijing, London, Washington, Tokyo, Haiti, Jewish, Holocaust, UN, NATO, NAFTA, climate, refugees, earthquake, human rights, latitude, multiculturalism, Islamophobia, fresh water, Ismaili, immigration, Muslims in Canada, Toronto).

## Plan
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g6-social-studies-a-1 | Many communities, one country | A3.4, A3.11 |

## Link sentence
A3.4/A3.11: "The expectation asks the student to identify types of communities in Canada (religious communities among them) and fundamental elements of Canadian identities such as inclusiveness and respect for diversity; event/canadian-islamic-history-month shows a federal commemoration of one religious community's history and contributions, presented as fostering inclusion and appreciation of diversity."

## Judgement calls
- A1.4 (inclusiveness) left in the gap register: the record only commemorates; it does not describe groups' efforts toward the goal or an assessment.
- B3.7 (locate cities by latitude and longitude, Kabul, Mogadishu etc.) left in the register: place/kabul has prose but about the conquest, with no coordinates or Canadian link; the others have no prose. Linking would stretch.
- Skills expectations A2.2, A2.4-A2.6, B2.1, B2.2, B2.4-B2.6 registered as skills. A2.1, A2.3, B2.3 registered with searches.
- Record kind `story` used for a commemoration (closed list has no `event`).

## Outcome
Ingested, thin: 3 records (subject, unit A, 1 lesson), 1 connection, 2 expectations in a lesson, 38 in the gap register, of 40. Strand B has no unit. More lessons possible: none honestly supported.

## Runbook problems
- Hand-written YAML needs the Urdu/Arabic scalars containing ": " quoted and Arabic-script parentheticals in Urdu wrapped in U+2066/U+2069 (Urdu is Arabic script); the runbook mentions the wrap only for Arabic and Urdu loosely.

## Proposals
- Connection kind for a commemoration, institution or event (`story` used).

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 6 social studies). Applied in all three languages. No connection was added.

- a-1 `event/canadian-islamic-history-month` (FIX, borderline): the card now says the Government of Canada's page names the month and its yearly themes (the 2023 campaign "Celebrating the Contributions of Muslim Women and Girls") and names no particular contributions; the closing question adds "and what contributions would your class add?" (ar: وأي إسهامات سيضيف صفّك؟; ur: اور آپ کی جماعت کون سی خدمات شامل کرے گی؟). The lesson Brief states that the class supplies the contributions and the other communities, and Try this asks the student to list what the record says about the month and its themes, then add what the class has found. The record's paragraph on the Quebec City mosque attack is not used. A stricter reading (R b: the record shows a commemoration, not a contribution) would remove the card and send A3.4 and A3.11 to the gap register; I applied FIX as the reviewer marked it.
- Verdicts judged wrong and not applied: none.
