# Verifier: numbers in AUDIT.md sections 1-4 and the section 5 validator claim

Method: my own script `docs/courses-mission/verifier/audit-recount.py` reads every file with `git show 800467e93e:<path>` (no checkout, no state change) and parses the YAML. Live checks used `curl -sL` on https://islam.museum (12 Nov 2026). I did not read `o01_audit.py` or `oracle-output/o01-*` before computing. Section 3(b) not checked (other verifier).

| claim in AUDIT.md | AUDIT.md's number | my number | how | verdict |
|---|---|---|---|---|
| 1. records in data/course | 23 | 23 | git ls-tree | MATCH |
| by kind | 1 jur, 1 grade, 1 subject, 4 units, 16 lessons | same | kind field | MATCH |
| tree: one root, no orphan | root ca-on-english -> g6 -> g6-science -> 4 strands -> 4 lessons each | 1 root, 0 dangling part_of, children counts 1/1/4/4/4/4/4, `lessons[]` lists equal the part_of children | part_of graph | MATCH |
| review state | 23 of 23 draft | 23 draft | status.review | MATCH |
| prose files per language | 23 each ar/en/ur | 23/23/23 | git ls-tree content/<l>/course | MATCH |
| live: all 23 answer 200, ar and en | 23 ar, 23 en | 23 ar, 23 en (and 23 ur) | curl -sL status per slug | MATCH |
| live production commit 8d1b0ef9, v1.10.0 | as stated | v1.10.0 confirmed (live /en/changelog/ top); commit hash not visible anywhere I could fetch | curl | v1.10.0 MATCH; hash UNCHECKED |
| 2. expectation entries on lessons | 29 | 29 (on 16 lessons) | count | MATCH |
| distinct codes | 27 | 27 | set of codes | MATCH |
| expectation entries on units | 4, each a placeholder "Overall expectations, strand B" | 4: B1, D1, C1, E1; text "Overall expectations, strand <letter>" (en) | count | MATCH |
| connections total | 33 | 33 | count | MATCH |
| on lessons | 16 lessons | 16 (none on non-lessons) | count | MATCH |
| per lesson min/max | 1 to 3 | 1 to 3 (13 lessons have 2, 2 have 3, 1 has 1) | Counter | MATCH |
| by position | before 8, within 13, after 12 | 8 / 13 / 12 | Counter | MATCH |
| by kind | story 9, scholar 6, quran 5, career 4, reflection 4, invention 3, hadith 1, place 1, object 0 | identical; object absent | Counter | MATCH |
| with entity link | 15 of 33 | 15 | count | MATCH |
| distinct entities | 14 | 14 | set | MATCH |
| connections linking to nothing | 18 | 33-15 = 18 | arithmetic | MATCH |
| distinct sources | 5 | 5 | Counter | MATCH |
| hill-1993 | 23 | 23 | Counter | MATCH |
| tanzil-quran | 8 | 8 | Counter | MATCH |
| hourani-1991 | 3 | 3 | Counter | MATCH |
| sahih-al-bukhari | 1 | 1 | Counter | MATCH |
| sahih-muslim | 1 | 1 | Counter | MATCH |
| 3(a). ar expectation texts byte copies of en | 29 of 29 | 29 of 29 | string equality | MATCH |
| 3(a). ur expectation texts byte copies of en | 29 of 29 | 29 of 29 | string equality | MATCH |
| 3(c). linked entity ids with no data/<class>/<slug>.yaml at baseline | 5 | 5 | git show returns not found | MATCH |
| which | al-jazari, sultan-bin-salman, astrolabe, maragha-observatory, kitab-al-hiyal | person/al-jazari, person/sultan-bin-salman, object/astrolabe, building/maragha-observatory, work/kitab-al-hiyal | same | MATCH |
| 3(c). two of five exist under another id; others have neighbours (alias search, evidence C) | - | not checked (output C is an alias search I was not asked to redo); I only checked person/al-jazari-engineer and person/sultan-bin-salman-al-saud are not needed by the numbers | - | UNCHECKED |
| 3(d). entity-linked connections where none of the connection's sources appears in the linked record's data file or prose files (ar/en/ur) | "all 15" | 15 of 15 have zero overlap (test: full `source/<id>` or bare slug as substring of the data file + 3 prose files). BUT 5 of the 15 point at entities that have no data file and no prose, so for those the test is vacuously true; among the 10 connections whose entity does have files: 10 of 10 zero overlap | substring test | MATCH on the number; see overstatement 1 |
| 3(d). al-Jahiz example | record cites Ibn al-Nadim, Ibn Khallikan, al-Mas'udi, Encyclopaedia of Islam; the connection cites Hill | al-jahiz.yaml sources: fihrist-ibn-al-nadim, muruj-al-dhahab, wafayat-ayan, encyclopaedia-of-islam-2 and others (7 more); the Hill id does not occur; the connection cites only hill-1993 | read file | MATCH |
| 3(d). Hill source record says "bibliographic details to be verified" | quoted | `generated_by: "Devin; bibliographic details to be verified"` | read file | MATCH |
| 3(d). "23 of the 33 connections rest on that one book with no page" | 23 | 23 connections cite hill-1993, but only 21 cite it alone; 2 cite it with hourani-1991. Sources are bare ids, no page field anywhere | Counter of source tuples | number MATCH; "rest on that one book" see overstatement 2 |
| 3(e). Qur'an-kind connections | 5 | 5 | kind==quran | MATCH |
| ...with a `ref` | 5 of 5 | 5 of 5 (6:38 etc.) | count | MATCH |
| ...with a passage entity link | none | 0 (four have no entity; one has concept/hijri-calendar) | count | MATCH |
| 4. courses page source lines | 42 | 42 | `git show` wc -l | MATCH |
| three `<select>` controls in LearnPicker | 3 | 3 in the island source; 3 `<select` in the served HTML of both /ar and /en | grep -c; curl | MATCH |
| course links in served HTML | 1 (the subject) | 1 (`/<lang>/course/ca-on-g6-science/`) in each of ar and en; other course/ hrefs absent | curl + grep | MATCH |
| ConnCard lines | 17 | 17 | git show wc -l | MATCH |
| connection cards on bio-1 lesson page | 3 | 3 `class="conn-card"` (live en page) | curl | MATCH |
| next-lesson link on lesson page | none; no previous either | no hrefs to any other lesson; only parent strand, language switches, API, edit link | grep of hrefs containing /course/ | MATCH (for this one sampled page) |
| subject page links 4 strands, no lesson | 4 strands, 0 lessons | live subject page links 4 strands + the grade (ca-on-g6) + itself; no lesson slug | curl + grep | MATCH |
| Home to lesson: 3 interactions | 3 | structural; consistent with the above (subject link, strand link, lesson link) | reasoning, not measured | MATCH (inferred) |
| 5. validate at baseline | 16 errors, none in a course record | summary line "16 errors, 4378 warnings"; 16 ERROR lines (10 data/concept provenance.layer, 6 content/*/concept/hudud-allah-wal-kabair.md); none mention course | read gate-validate-baseline.out | MATCH |
| 3(e)/4 surface prose claims (resume impossible, no print layout, no classroom view, within-connections stacked after first section) | qualitative | not numbers; not checked | - | UNCHECKED |

Claims checked: 47 numeric/structural rows. Matches: 45 (two partly unchecked sub-items listed above). Mismatches: 0. Unchecked: the production commit hash 8d1b0ef9, the alias-search claim in 3(c), and the qualitative surface claims.

## Mismatches
None.

## Claims I could not check
- Production commit `8d1b0ef9`: no page or API I could fetch exposes it (the version 1.10.0 does show in the live changelog).
- 3(c) alias-search findings (two of five exist under another id, neighbours of the others) come from `find_entity.py`, outside this brief.
- The "3 interactions at best" count is a UX judgement, not a measurement.
- "Nothing remembers where the student was" and similar: needs JS runtime inspection, not done.
- The Phase-1 claim that no live page in other lessons has a next link: I sampled bio-1 only.

## Worded more strongly than my evidence supports
1. 3(d) "For all 15 entity-linked connections, none of the connection's cited sources is cited anywhere in the linked record." True as counted, but 5 of the 15 link to ids with no record at all (nothing to cite from), so the finding about "records" is measurable on 10 connections; the other 5 fall under defect (c), not (d). Saying "all 15" double counts the stubs.
2. 3(d) "23 of the 33 connections rest on that one book": 23 cite it, 21 cite only it; 2 also cite Hourani 1991. "No page": true because the connection `sources` carry bare ids and the schema has no page field here, so it says nothing about whether the text came from a page.
3. 3(d) test is by id presence in the record; a record could cite the same work under a different source id. I did not find such a case in the 10 existing records, but the test cannot rule it out.
4. 4 "Without JavaScript the three selects do nothing": I confirmed three selects are in the served HTML and the only course link is the subject; I did not test a no-JS browser.
