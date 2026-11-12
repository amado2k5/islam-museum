# Run log: ca-on-g1-social-studies

Course: Ontario SSHG - Grade 1 (2023), archive slug `ontario-sshg-g1`, subject `course/ca-on-g1-social-studies`. Agent: Claude Code, claude-sonnet-5-5.
Start 2026-11-12T05:57Z. End 2026-11-12T06:08Z.

## Steps
- 05:57Z fetched: `fetch_ontario.py "SSHG - Grade 1 (2023)" ontario-sshg-g1` (2 strands, 6 overall, 33 specific). Source id from `ontario_source.py`: `source/ontario-curriculum-sshg-2023`.
- 05:58Z searched the graph (find_entity, entity_brief) for services, post, health, water, markets, maps, naming, neighbours, environment, places of worship.
- 06:04Z wrote records, prose, gaps and evidence with a generator kept in the scratch directory (not in the repository).
- 06:06Z gate and cite-check.

## Plan
| Lesson | Title | Expectations |
|---|---|---|
| a-1 | Special days and special places | A1.2, A3.2 |
| a-2 | Living well next door | A3.4, A3.5 |
| b-1 | Services that meet our needs | B1.1, B1.2 |
| b-2 | Services the community looks after | B3.8 |
| b-3 | Looking after the land we share | B1.3 |
| b-4 | Reading and making maps | B2.3, B3.5 |

## Links, as the sentence "The expectation asks the student to ___; this record shows ___."
- a-1 practice/aqiqa: asks how significant events change roles (A1.2, which names naming ceremonies); the record shows a seventh-day naming rite and the sharing of its meat with the poor (Encyclopaedia of Islam).
- a-1 building/prophets-mosque: asks to identify significant places and their purpose (A3.2, which names places of worship); the record shows how one mosque was sited, bought and built.
- a-2 concept/jiwar: asks for positive behaviour and respect toward others (A3.4, A3.5); the record shows neighbours' rights and limits on what an owner may do where it harms a neighbour.
- b-1 concept/sabil: asks how the community meets needs and what if a service did not exist (B1.1, B1.2); the record shows a public water fountain endowed for all.
- b-1 building/bimaristan-adudi: asks to identify services and occupations (B1.2); the record shows a hospital and the staff and supplies gathered in it.
- b-2 invention/barid: asks for services the government is responsible for (B3.8); the record shows the state post, for the state's use only.
- b-2 invention/hisba: the same expectation; the record shows an office watching markets and streets.
- b-3 concept/hima: asks for a plan to interact responsibly with the natural environment (B1.3); the record shows a reserved pasture. The lesson Brief says the plan is the class's own.
- b-4 invention/tabula-rogeriana: asks to read and construct maps (B2.3, B3.5); the record shows one old world map. The Brief says the museum does not teach the parts of a map.

## Judgement calls
- The museum's grade 1 holdings are thin: the course is about the child's own life and community, so only 10 of 33 expectations carry a link. 11 are skills expectations, 12 more concern the student's own life or Canadian places.
- The aqiqa link restates only the Encyclopaedia of Islam account (naming, shaving, slaughter, meat to the poor); the record's lecture sections (needs_source) were not used.
- The sabil link restates the record's definition, naming history and water sources; no claim beyond them.
- The mosque is linked for A3.2 (a place of worship is named in that expectation's examples); the connection says nothing about a mosque's purpose beyond what the record says.
- A1.4 not linked: concept/friendship is about the law's encouragement of friendship, not how interactions affect a person's sense of self.

## More lessons possible
None beyond what is registered: every other expectation is a skills expectation, concerns the student's own life, or concerns Canadian places and peoples the museum does not hold.

## Problems
- The `--list "Grade 1"` output names the course "SSHG - Grade 1 (2023)"; the runbook's example "SSHG - Grade 4" gave "no single course" for Grade 1 until the year was added. The runbook could say: copy the name exactly as `--list` prints it.
- B2 (overall) is cut inside a parenthesis "(FOCUS ON: Cause …"; the isolate pair was written around the parenthetical text and the " …" left outside it so the text still ends with " …". The runbook is silent on this case.
- `cite-check` with the ids joined in one quoted string fails with "no file"; pass the ids as separate arguments.

## Proposals
- Connection kinds: no `practice` (aqiqa, naming rite), `institution` (hisba, hospital) or `concept` kind; `reflection` was used for aqiqa, jiwar and hima, `object` for the sabil.
- A pointer from each expectation to the authority's page for its full text.

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 1 social studies). Applied in all three languages. No connection was added.

- a-1 `practice/aqiqa` and `building/prophets-mosque` (REMOVE, whole lesson, since both connections go): lesson record and three prose files deleted, removed from unit a, evidence rows deleted; A1.2 and A3.2 added to the gap register (texts copied from the lesson record before deletion) with the reviewer's reasons and two search lines each. On re-searching for A3.2 ("mosque", "place of worship", "مسجد") the search found `concept/masjid` and `concept/masjid-umum`; I did not read or link them, because this fix pass adds no connection. A later pass may test whether either states a mosque's purpose in terms a six-year-old can use.
- a-2 `concept/jiwar` (FIX): kept only "a neighbour's rights limit how an owner may use his property where it harms the neighbour" and the opening definition; cut the forty-houses and shared-wall sentences (en, ar, ur); attributed the whole to the Kuwaiti jurisprudence encyclopaedia (ar: تذكر الموسوعة الفقهية الكويتية; ur: کویتی فقہی انسائیکلوپیڈیا کے مطابق). The preacher's series in the record's prose was not used.
- b-1 `concept/sabil` (FIX): cut "called siqaya in the first five centuries and known as sabil from the late fifth century AH" and attributed the description to al-Haddad (ar: يصف الحداد; ur: الحداد سبیل کو ... بتاتے ہیں). `building/bimaristan-adudi` (FIX): cut "Buyid ruler" and "Rabi II 372 AH" (en, ar, ur); the hospital in Baghdad, the gathered physicians, medicines and servants, and the clothing and vessels given to the poor stay, with "following Ibn al-Jawzi" as before.
- b-2 `invention/barid` (REMOVE): connection deleted, evidence rows deleted, and the lesson's Brief and Try this no longer mention a postal system (they said "mail"). The lesson keeps `invention/hisba`, which B3.8 is still served by. I left the hisba card unchanged: the reviewer's wish to say "cheating in what is sold" for "fraud in measures, weights and foodstuffs" is marked optional under a KEEP verdict.
- b-3 `concept/hima` (REMOVE, whole lesson): same as a-1; B1.3 added to the gap register.
- b-4 `invention/tabula-rogeriana` (REMOVE, whole lesson): same; B2.3 and B3.5 added to the gap register.
- Unit a keeps one lesson (a-2) and unit b two (b-1, b-2), so no unit or subject record was deleted; their summaries and prose now say so in all three languages.
- Verdicts judged wrong and not applied: none.
