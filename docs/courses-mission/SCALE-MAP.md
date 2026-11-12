# The scale map: what remains, in what order, at what cost

Part C of the courses mission. It ranks the curricula still to bring in, gives the effort a course costs as this run measured it, and names what is not relevant. The brief asked for this map from one proof run; on the user's instruction of 12 November 2026 the run then ingested every relevant Ontario course, so the effort model below rests on 66 courses, not one.

Three kinds of statement are kept apart in this document:

- **Measured**: a number produced by this run, with the file that holds it.
- **Probed**: an official address this run fetched, with what came back, on 12 November 2026.
- **Estimated**: a figure this run did not measure (enrolments above all). Each is marked "estimate" and is an order of magnitude to be checked before anyone relies on it.

## 1. What a course costs (measured)

One course is one fresh agent following `PIPELINE.md`, then review. The figures are the harness's own timers and token counts for the 65 Ontario runs.

| Step | Wall clock | Tokens | Notes |
|---|---|---|---|
| Ingest one course (fetch, map, write three languages, gate) | 4 to 26 minutes; typically 9 to 15 | 150,000 to 380,000; typically 200,000 to 300,000 | A sibling course built from one already made is the low end; a 90-expectation science course the high end |
| Review (a fresh reader of every lesson and every linked record) | 5 to 10 minutes per 40 to 55 lessons | about 170,000 to 240,000 per batch | One reviewer per subject group |
| Apply the review's verdicts | 5 to 9 minutes per batch | about 120,000 to 230,000 per batch | |
| Repository gates (validator, cite-check), once for the whole fleet | about 10 minutes | none | Run by the coordinator, not by each agent |

**What the first pass is worth.** This is the number that matters most for planning, and it is not flattering. Reviewers read every elementary lesson the fleet wrote (`verifier/sweep-*.md`): of 309 connections, they kept 128 as written, asked for changes to 96, and removed 85. In the secondary courses reviewed so far the proportion kept is higher (about two in three). **Budget one review and one correction pass for every ingestion pass, and do not publish a first pass.** The corrected counts per course are in `docs/courses/FLEET.md`, generated from the files.

**What a course yields.** The museum can honestly serve a minority of any curriculum. Across Ontario, after review, a course keeps between zero and twelve lessons, and most of its expectations go to its gap register. The yield follows the density table (section 3), not the size of the curriculum: World Religions kept the most; Grade 5 Social Studies, which is about New France and Canadian government, kept nothing.

**The fleet runs twenty agents at once** on one machine (the harness's limit), in one shared worktree, with these rules, all learnt the hard way and now in the runbook and the fleet prompt: the graph is built once by the coordinator; shared records (grades, the curriculum source) are made by a deterministic tool so two agents cannot write different versions; every file an agent creates begins with its course's slug; no agent runs a repository-wide gate or a git command that changes state.

At that width the 65 Ontario courses were ingested, reviewed and corrected within one working session; the per-course run logs (`docs/courses/runs/`) carry each run's start and end times.

## 2. Official availability (probed)

A course can be ingested only from the issuing authority's own publication, fetched by the agent. This is what each authority's site returned.

| Authority | Address tried | Result | What it means |
|---|---|---|---|
| Ontario, Ministry of Education | the Ministry's content service behind `dcp.edu.gov.on.ca` | 200; 383 course entries, of which 264 carry structured sections and 119 do not (published as PDF, or the PDF twin of a structured entry) | **Done in this run.** A fetcher exists (`fetch_ontario.py`). The PDF-only courses are in section 5 |
| British Columbia, Ministry of Education and Child Care | `curriculum.gov.bc.ca/curriculum/<subject>/<grade>/<course>` | 200; Big Ideas, Curricular Competencies and Content as page text | **Ready.** A fetcher exists (`fetch_bc.py`, tested on Social Studies 8). The province publishes no codes: see section 6 |
| Texas, Texas Education Agency | `tea.texas.gov/…/19-tac-chapter-113` and the Secretary of State's TAC reader | 200 | Reachable. The TEKS are coded law text (chapter, section, subsection). No fetcher yet |
| Washington, OSPI | `ospi.k12.wa.us/…/social-studies/learning-standards` | 200 for the page; 404 for the PDF address guessed | Reachable; the standards documents must be located from the page. No fetcher yet |
| Quebec, Ministère de l'Éducation | one guessed PDF address | returned a web page, not the document | **Not yet located.** The Québec Education Program is published as PDFs, in French and English; the right addresses have to be found first |
| Michigan, Department of Education | the Social Studies standards PDF | **403** | The site refuses automated requests. The pipeline does not work around a block: the official PDFs must be supplied by a person |
| California, Department of Education | the History–Social Science standards PDF | **redirect to a firewall block page** | Same as Michigan |
| England, Department for Education | `gov.uk` programmes of study | 200; open licence | Reachable, and the text is open. No codes |

## 3. Density: what the museum can give each subject (measured)

`python3 scripts/courses/density.py` counts museum records with prose, by school subject (`oracle-output/density.out`).

| Subject | Records with prose |
|---|---|
| History and social studies (societies, states, events, cities) | 4,580 |
| World religions and ethics | 3,381 |
| Geography (places, travel, maps) | 1,957 |
| Language and literature | 1,488 |
| Art, architecture and design | 1,329 |
| Science: life, health and environment | 244 |
| Science: matter, energy, engineering | 224 |
| Science: astronomy, earth and space | 137 |
| Philosophy and logic | 68 |
| Mathematics | 54 |

The Ontario run bore this out, with one correction: density counts records, and a record's being about history does not make it serve a curriculum that is about another country's history. Ontario's social studies is mostly Canadian, so its yield was far below what 4,580 records suggests. **The courses to seek are world history and world religions courses**, where the curriculum itself asks for what the museum holds. Ontario's two are PDF only.

## 4. The sequence

Ranked by reach × density of the subjects the curriculum actually asks for × availability today. Enrolments are estimates.

| Order | Authority | Why here | What stands in the way |
|---|---|---|---|
| done | Ontario, Grades 1 to 12 | The pilot's province; a machine-readable service | The two world-history courses and all senior mathematics are PDF only |
| 1 | **British Columbia**, K to 12 | Ready today. Social Studies 7 ("The Ancient World to the 7th Century") and 8 ("7th Century to 1750") ask directly for the period and the civilisations the museum holds: the best fit of any course probed. About 50,000 students a grade (estimate) | No codes (section 6) |
| 2 | **Texas**, Grades 1 to 12 | The largest reachable system: about 400,000 students a grade (estimate). World Cultures (Grade 6), World Geography and World History in high school name Islam and its civilisation in the standards themselves. Coded | A fetcher for the administrative-code pages |
| 3 | **Washington**, K to 12 | Reachable; coded social studies standards; about 80,000 students a grade (estimate). Science and mathematics follow national standards (NGSS, Common Core), so one fetcher for those serves many states | Locate the documents; a fetcher |
| 4 | **Quebec** | About 90,000 students a grade (estimate). History and Citizenship Education (secondary cycle one) is a world-history course with a unit on Christianity and Islam around the Mediterranean; Ethics and Religious Culture studies Islam by name. The official text is French: the first curriculum whose official language is not English, which the surface already handles (`officialLang`) | Find the official PDFs; a PDF extraction step; no codes |
| 5 | **Michigan** | About 100,000 students a grade (estimate). Grade 7 World History and Geography covers the period | The site refuses automated requests: **someone must supply the PDFs** |
| 6 | **California** | The largest system in North America, about 450,000 students a grade (estimate), and Grade 7 ("Medieval and Early Modern Times") has a whole standard on the civilisations of Islam. By reach and density it is first; it is last here only because it cannot be fetched | The site refuses automated requests: **someone must supply the PDFs** |

The user's order of 12 November 2026 is British Columbia, Quebec, Michigan, Texas, Washington, California. The ranking above differs only in moving Texas and Washington ahead of the two that are blocked and the one not yet located; the work on those three can proceed the moment their documents are in hand. **The run is on hold after Ontario by the user's instruction and resumes when asked.**

Within any authority, the Ontario run gives the order of courses: world history and world religions first, then geography and the arts, then social studies, then science from about Grade 4 up, then mathematics from about Grade 4 up. Mathematics and science below Grade 4 should not be attempted (section 5).

## 5. What is not relevant, and what is blocked

Not relevant is a finding, registered with its reason; it is not territory to fake.

**Not relevant: do not attempt.**
- **National history and civics of a country the museum does not cover.** Ontario's Grade 5 Social Studies ended with no lesson at all; its Grades 3 and 6 kept one lesson each. Canadian history (Grades 7, 8, 10), civics, and First Nations, Métis and Inuit studies were not attempted for the same reason (`docs/courses/ontario-review.md`).
- **Mathematics and science in Grades 1 to 3.** The reviewers removed most of these lessons: a history of written arithmetic does not teach a six-year-old to count, and a medieval pump described in a scholar's words does not teach a seven-year-old about pushes and pulls. The museum's records are written for adults.
- **Skills courses** (language arts, second languages other than the languages of the Muslim world, physical education, guidance, technology, business): the expectations name no subject matter.
- **Dance.** The museum has no record on a dance form; the one devotional gathering offered as dance was removed.

**Relevant and blocked.**
- **PDF-only courses.** Ontario's `CHW3M` (World History to the End of the Fifteenth Century) and `CHY4U` / `CHY4C` (World History since the Fifteenth Century) are the two most relevant courses in the province, and its senior mathematics, geography, economics, law and politics are PDF only too. A PDF extraction step is the single most valuable piece of pipeline still to build: it also unlocks Quebec, Michigan and California.
- **Authorities that refuse automated requests** (Michigan, California). A person downloads the official documents once; the pipeline does the rest.

**Relevant, and the museum is the limit.** The gap registers are a map of what the museum would need in order to say more. The same absences recur across courses: no record on Aristotle beyond a stub; none on mechanics (the Banu Musa, al-Khazini, Ibn Bajja on motion); none on the core ideas of chemistry; nothing on theatre or dance; no prose on Canada or Ontario; logic works with no prose. Each is a harvest lead for another lane, not a reason to stretch a link.

## 6. Decisions the next authority forces

- **Curricula without codes.** British Columbia, Quebec and England publish none, and the schema requires one. `fetch_bc.py` numbers the standards in the document's own order and marks the number as the museum's (`§C3`: Content standard 3). The surface's line "with their official codes" is then untrue for such a course and must change for it. This is a schema and wording decision for the founder before British Columbia is ingested.
- **The 40-word limit.** Ontario's expectations lose about 60% of their words to it, mostly example lists, and with them the Ministry's own mention of "religious rights in medieval Islam". A link from each expectation to the authority's page would restore the full wording without storing it.
- **Connection kinds.** Almost every agent proposed the same additions to the closed list: a concept, a practice, an institution, an event, a work, a ruling. Their absence forced dozens of records under `story`, `object` and `reflection`.
- **A review gate.** The gate checks structure, fidelity and provenance. It cannot check whether a link is honest, whether a record suits a child, or whether a record carries hateful content. Three such records were linked and caught only by readers. Until a reviewer's pass is a required step with its own recorded result, a green gate must not be read as "safe to show".
