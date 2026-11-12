# Ontario Grade 4 Social Studies proof course: fidelity check (git 62712390bf)

**Who / when.** Fresh-context verifier (Claude Sonnet 5.5), 2026-11-12. The course was read only through `git show 62712390bf:<path>` (copies in `.cache/verifier/repo/`). The Ministry text was fetched by me, independently, from the Ministry's content service (no repository fetcher, no `.cache/curricula/`, no third-party copy).

**Addresses.**
- `https://ws.api.dcp.edu.gov.on.ca/content/api/items?system.type=l2___course&language=en-CA&system.language[eq]=en-CA&depth=0` -> `.cache/verifier/courses.json`, sha256 `178bfb4249226408e78d87848e0887fc7d8b0057489a4f665afa515b80849956` (383 courses; "SSHG - Grade 4", system.id `e6090af9-a67b-4e57-a838-8d1eb2fbc333`).
- `https://ws.api.dcp.edu.gov.on.ca/content/api/items?system.id=e6090af9-a67b-4e57-a838-8d1eb2fbc333&language=en-CA&system.language[eq]=en-CA&depth=6` -> `.cache/verifier/g4.json`, sha256 `c8860ad819c59de833590a7dfd09c0088bb0ad882421b76f43f957cb9c44ec6e`.
- My extraction (HTML stripped, entities decoded, whitespace collapsed): `.cache/verifier/official_g4.json`, sha256 `1b11357b3c18a9fe5771db3d33722665c271ccf7546a69cd0330bcbd443449ac`. Script: `docs/courses-mission/verifier/proof-fidelity-check.py` (reads those files). The course's strand records are `sshg___grade_4___a_5409498` (strand A, "Heritage and Identity: Early Societies to 1500 CE") and `sshg___grade_4___a__copy_` (strand B, "People and Environments: Political and Physical Regions of Canada"); the other 18 strand records and 6 other grades in the payload were ignored. The Ministry publishes 3+3 overall and 20+16 = 36 specific expectations for strands A and B.

**The stated rule, applied by code.** Replace each parenthetical beginning "(e.g." (balanced parentheses) with "[…]"; if the remainder exceeds 40 whitespace-separated words, keep the first 40 words and append " …". Unaltered: "(i.e., …)" parentheticals (B3.3), "(FOCUS ON: …)" in overall expectations.

## 1. Comparison table (every entry in the unit and the three lessons, all 30 gap entries; 39 rows)

Columns: official word count, stored word count, official text has "(e.g.", stored ends with " …".

| record | code | class | official words | stored words | e.g. removed | cut at 40 |
|---|---|---|---|---|---|---|
| ca-on-g4-ss-a | A1 | EXACT-UNDER-RULE | 55 | 41 | no | yes |
| ca-on-g4-ss-a | A2 | EXACT-UNDER-RULE | 52 | 41 | no | yes |
| ca-on-g4-ss-a | A3 | EXACT-UNDER-RULE | 57 | 41 | no | yes |
| ca-on-g4-ss-a-1 | A3.9 | EXACT-UNDER-RULE | 83 | 31 | yes | no |
| ca-on-g4-ss-a-1 | A3.10 | EXACT-UNDER-RULE | 102 | 28 | yes | no |
| ca-on-g4-ss-a-2 | A3.7 | EXACT-UNDER-RULE | 61 | 19 | yes | no |
| ca-on-g4-ss-a-2 | A3.8 | EXACT-UNDER-RULE | 69 | 39 | yes | no |
| ca-on-g4-ss-a-3 | A3.4 | EXACT-UNDER-RULE(marker-not-counted) | 160 | 42 | yes | no |
| ca-on-g4-ss-a-3 | A3.6 | EXACT-UNDER-RULE | 42 | 30 | yes | no |
| gap-register | A1.1 | EXACT-UNDER-RULE | 47 | 20 | yes | no |
| gap-register | A1.2 | EXACT-UNDER-RULE | 124 | 39 | yes | no |
| gap-register | A1.3 | EXACT-UNDER-RULE | 54 | 37 | yes | no |
| gap-register | A1.4 | EXACT-UNDER-RULE | 65 | 40 | yes | no |
| gap-register | A2.1 | EXACT-UNDER-RULE | 77 | 41 | yes | yes |
| gap-register | A2.2 | EXACT-UNDER-RULE | 100 | 41 | yes | yes |
| gap-register | A2.3 | EXACT-UNDER-RULE | 132 | 38 | yes | no |
| gap-register | A2.4 | EXACT-UNDER-RULE | 117 | 14 | yes | no |
| gap-register | A2.5 | EXACT-UNDER-RULE | 45 | 41 | no | yes |
| gap-register | A2.6 | EXACT-UNDER-RULE | 132 | 13 | yes | no |
| gap-register | A3.1 | EXACT-UNDER-RULE | 50 | 41 | yes | yes |
| gap-register | A3.2 | EXACT-UNDER-RULE | 61 | 28 | yes | no |
| gap-register | A3.3 | EXACT-UNDER-RULE | 42 | 22 | yes | no |
| gap-register | A3.5 | EXACT-UNDER-RULE(marker-not-counted) | 44 | 41 | yes | no |
| gap-register | B1.1 | EXACT-UNDER-RULE | 80 | 22 | yes | no |
| gap-register | B1.2 | EXACT-UNDER-RULE | 64 | 20 | yes | no |
| gap-register | B1.3 | EXACT-UNDER-RULE | 58 | 27 | yes | no |
| gap-register | B2.1 | EXACT | 34 | 34 | no | no |
| gap-register | B2.2 | EXACT-UNDER-RULE | 83 | 37 | yes | no |
| gap-register | B2.3 | EXACT-UNDER-RULE | 51 | 27 | yes | no |
| gap-register | B2.4 | EXACT-UNDER-RULE | 91 | 16 | yes | no |
| gap-register | B2.5 | EXACT | 21 | 21 | no | no |
| gap-register | B2.6 | EXACT-UNDER-RULE | 101 | 13 | yes | no |
| gap-register | B3.1 | EXACT-UNDER-RULE | 93 | 29 | yes | no |
| gap-register | B3.2 | EXACT-UNDER-RULE | 71 | 20 | yes | no |
| gap-register | B3.3 | EXACT-UNDER-RULE | 65 | 41 | yes | yes |
| gap-register | B3.4 | EXACT-UNDER-RULE | 37 | 19 | yes | no |
| gap-register | B3.5 | EXACT-UNDER-RULE | 84 | 27 | yes | no |
| gap-register | B3.6 | EXACT-UNDER-RULE | 59 | 17 | yes | no |
| gap-register | B3.7 | EXACT-UNDER-RULE | 42 | 41 | no | yes |

Counts over the 39 rows: EXACT 2 (B2.1, B2.5: under 40 words, no "(e.g."), EXACT-UNDER-RULE 37 (35 on either reading of the rule, 2 only on one reading, see below), DIFFERENT 0, WRONG-CODE 0, NOT-FOUND 0. All 30 gap entries were checked, not a sample of 12. Quote marks (curly apostrophes), the en dash in "Great Lakes–St. Lawrence", and the ellipsis character all match the official text.

**Discrepancies: none** in code or wording. Observations that are not discrepancies:
1. **The rule is ambiguous in one place.** Does the "[…]" marker count toward the 40 words? Read as "yes" (marker is a token), A3.4 (42 tokens, 40 real words) and A3.5 (41 tokens, 40 real words) would have to be cut to "...sustainability and food …" and "...physical needs …". The stored text keeps both whole, ending "[…]". They match only if the marker is not counted. Every other entry matches both readings. The rule should say which.
2. The rule also does not say what happens when the 40th word falls inside text that an "(e.g." removal would have deleted; it never arises here.
3. The stored text normalises non-breaking spaces to plain spaces (the official HTML of A3.5 and A3.8 contains U+00A0). Harmless.
4. The unit record stores the three overall expectations (A1-A3) as well; they too match the rule (all three cut at 40 words, " …").
5. Nine entries end in " …" (A1, A2, A3, A2.1, A2.2, A2.5, A3.1, B3.3, B3.7): the sentence stops mid-clause. A reader sees an ellipsis with no bracket, which looks different from the "[…]" marks for removed examples; both are the same device with two meanings.

## 2. Coverage check

Lessons: A3.9, A3.10 (lesson 1); A3.7, A3.8 (lesson 2); A3.4, A3.6 (lesson 3) = 6. Gap register: 30 (A1.1-A1.4, A2.1-A2.6, A3.1, A3.2, A3.3, A3.5; B1.1-B1.3, B2.1-B2.6, B3.1-B3.7). 6 + 30 = 36. Against the 36 official specific expectations (A: 20, B: 16): **missing: none; duplicated: none; extra codes not in the Ministry list: none.** Complete and exact.

## 3. Is "the official text" a fair name?

Across the 36 specific expectations the Ministry text is 2,641 words; the stored quotations total about 1,056 (40%). 32 of the 36 contain an "(e.g." and so lose it; 6 specifics plus the 3 overall expectations are also cut at 40 words. So "every expectation carries the official code and text" is true of the code, true of the operative clause (the part that says what the student does), and **not true of the text**: it is an abridgement with marked omissions, and about 60% of the words are not there. "Official wording with the examples omitted, capped at 40 words" is accurate; "the official text" without qualification is not. The ellipsis marks are honest (nothing is silently dropped), which is the point in its favour.

What is lost, two concrete cases:
- **A3.10** keeps "describe some attempts within a few early societies … to deal with conflict and to establish greater cooperation […]". The removed examples include "establishment of religious rights in medieval Islam", "the Great Law of Peace", "the Magna Carta" and "the resolution of conflict with drumming, dancing, poetry, and/or humour among Inuit". A teacher sees none of the examples and cannot tell the curriculum itself names medieval Islam as an expected example; for this museum that is the sentence that justifies the Umar covenant and Constitution of Medina links. Likewise A3.8's "imams" in the list of social groups.
- **A2.6** keeps only "communicate the results of their inquiries, using appropriate vocabulary […] and formats […]" (even this is under the rule, 11 words kept of 132). The removed vocabulary list (Elder, clan mother, faith keeper, knowledge keeper, Inuk shaman, feudalism, hierarchy...) and format examples (annotated flood-plain map, stop-animation video) are precisely what a teacher needs to see what a "complete" response looks like. Also lost: A3.4's examples of why a society's survival depended on flooding rivers and thin topsoil, i.e. what "sustainability" means at this grade.
A student loses little (they read the lesson, not the code); a teacher or reviewer checking alignment loses the concrete scope each expectation sets. Linking a record to "A3.10" on the strength of the clause alone is possible, but the examples are what define the scope.

## 4. Claim 2: refuting the absence claims (8 strand-A gap entries)

Method: `find_entity.py` and grep over `data/`, `content/en/`. The register's searches never used the words "Jahiliyya", "tribe", "Arabia before Islam", "kin" or "pre-Islamic", and never searched "Bedouin" in the sense of a society. Those finds are the refutations below. All cited records are `status.review: draft` (so prose exists but is unreviewed; the register's own lessons use draft records too). None of these concerns the First Nation or Inuit part.

| gap | verdict | finding |
|---|---|---|
| A1.1 social organization | **Refuted** (a fitting record exists) | `concept/social-condition-jahiliyya` (1,179 words; nobles, women, slaves, tribe). "The bond of a man with his brother and his cousins and his clan was firm and strong. They lived and died for tribal solidarity, and the basis of the social order was solidarity by descent and kinship." The register said "no record that describes a society's classes". Pre-Islamic Arabia is an early society before 1500. |
| A1.2 daily lives of different groups | **Refuted** | Same record, sections "Women among the nobles", "Other circles and marriages": "Women had the greater share of freedom of will and of the force of speech; they were honoured and protected" (nobles) versus other circles. Plus `concept/economic-condition-jahiliyya`: "the women of all the Arabs worked at spinning". Register said "no record of ... daily life". |
| A1.3 own life vs young people | **Refuted, weakly** | `concept/istirda-al-badiya` (344 words): "It was the custom of the Arabs of the towns to seek wet-nurses for their children among the desert people, to keep them away from the diseases of the towns". Also the "Children" section of the social-condition record. It does describe how young children were raised; school/leisure/work is not covered. |
| A1.4 relationship with the environment | **Absence holds (borderline)** | Nothing treats a society's relationship with its environment in those terms. Closest: `concept/hima` ("land that the ruler reserves, so that none may graze it") is a land-use rule; `concept/istirda-al-badiya` links desert air and health. A connection is conceivable but would be a stretch; the register's reading is defensible. |
| A2.3 thematic maps | **Absence holds** | An inquiry-skill expectation; `invention/tabula-rogeriana` is a world map, not a thematic map. No record fits honestly. |
| A3.1 locate societies on maps | **Absence holds, partly** | `place/mecca`, `place/yemen`, `exhibit/path-arabia-before` give places for the Arabian society, but the expectation is a map-reading skill. A record could carry "locate on a map" only loosely. |
| A3.3 aspects of daily life | **Refuted** | The expectation lists "family life", food, housing, clothing. `concept/social-condition-jahiliyya` (marriage forms, children, tribe) and `concept/economic-condition-jahiliyya` ("farming, tilling, and keeping livestock ... poverty, hunger, and nakedness were common") describe exactly that. Register: "the museum holds no record of such daily life" is wrong as worded. |
| A3.5 environment and physical needs | **Mostly holds** | `concept/economic-condition-jahiliyya` mentions herding and farming "within the Peninsula" and trade in sacred months, but says nothing on how the local environment shaped food or housing. The register's reading holds (the Nilometer is already linked elsewhere). |

Result: 4 of 8 refuted (A1.1, A1.2, A1.3, A3.3), 4 hold (A1.4, A2.3, A3.1, A3.5). The pattern: where the expectation is about society and daily life the museum has a real record of the early Arabian society (the one it holds in depth), found only by searching for "Jahiliyya" and "tribe"; where it is about environment, maps and inquiry skill, the absence holds.

**The First Nation / Inuit rationale.** Almost every strand-A expectation says "including at least one First Nation and one Inuit society". The first agent treated that as grounds to register most of them. I think this was **defensible but too broad**. It is right that a record cannot "satisfy" the expectation, because the expectation can never be met by this museum alone. But the course's own design admits partial coverage: lessons already link A3.7-A3.8 (governance, social organization) to Islamic-world records with the same "including" clause, so the first agent applied the criterion inconsistently (kept A3.7, A3.8, A3.4, A3.6, A3.9, A3.10 as lessons; registered A1.1 and A3.3, which have the identical clause). Consistency would either register all or link every fitting record and state the missing FN/Inuit societies openly. I would call the registration of A1.1, A1.2, A1.3 and A3.3 the wrong call, and of A2.x (skills) and A1.4/A3.5 the right one.

## 5. Summary

1. Codes: 36 of 36 specific expectations (strands A and B) accounted for exactly once; no missing, duplicate or invented code.
2. Text: EXACT 2, EXACT-UNDER-RULE 37, DIFFERENT 0, WRONG-CODE 0, NOT-FOUND 0 (39 rows including the three overall expectations).
3. The 40-word rule is ambiguous about whether "[…]" counts; A3.4 and A3.5 pass only if it does not.
4. "Official text" overstates: about 60% of the Ministry's words are not present; "official wording with examples omitted, capped at 40 words" is accurate.
5. Gap register: 4 of 8 strand-A absences refuted by pre-Islamic Arabia records (`concept/social-condition-jahiliyya`, `concept/economic-condition-jahiliyya`, `concept/istirda-al-badiya`) that its searches never tried; 4 hold.
