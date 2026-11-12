# The courses mission: what to publish about it

Written for the founder's public log. It says what was built, the numbers, the errors, the gaps, the decisions that are his, and every place the work does not do what was asked. Nothing here is live: the work is merged to `main`, and deployment is the founder's step.

Every number below is produced by a committed script; the script is named beside it. The ledger is `VERIFICATION.md`.

## 1. What was built

- **A new courses surface, the Education Explorer**, at `/{lang}/learn/courses/` in Arabic, English and Urdu: a finder (school system, grade, course), a course map, and a lesson page built as a loop (goal, before, the lesson with the museum's connections woven in, after, a self-check). Classroom view, print layout, no account, nothing sent anywhere; progress is kept in the reader's own browser. Design record: `DESIGN.md`.
- **A homepage section and an explorer card** presenting it, in three languages.
- **A pipeline** for bringing an official curriculum in (`PIPELINE.md`, `scripts/courses/`), with a gate per course, proven by a fresh agent that ingested Ontario Grade 4 Social Studies from the runbook alone in 14 minutes 10 seconds (`PROOF-RUN.md`).
- **Ontario, Grades 1 to 12.** Counted from the files by `scripts/courses/fleet_report.py` (`docs/courses/FLEET.md`):

| | |
|---|---|
| Courses attempted | 66 |
| Courses that kept lessons | 65 (Grade 5 Social Studies kept none and is a gap register only) |
| Lessons | 360 |
| Connections to museum records | 671 |
| Official expectations served by a lesson | 536 |
| Official expectations the museum cannot yet serve, registered with the reason | 2,610 |
| Courses whose ingestion gate prints GREEN | 64 (the exception is the original pilot, Grade 6 Science) |
| Course records passing cite-check | 643 of 643 (`0 fail`) |

Every record and every prose file is `status.review: draft` with a provenance block. No agent promoted anything.

- **A scale map** for what comes next (`SCALE-MAP.md`).

## 2. What is not green

- **The validator does not print `0 errors`.** The brief made that literal string a gate. Run on the merged branch (`oracle-output/gate-validate.out`) it printed `69 errors`. 26 of them were this work's: Arabic-script parentheses not isolated in Urdu and Arabic course summaries. They were corrected in the next commit and re-checked with the validator's own expression (0 left), but **the validator itself has not been re-run to completion since**: a second run was spoiled because `main` was merged into the tree while it was running, and its output was discarded. The other 43 errors are in records this work does not own and may not touch (typed honorifics in `group/aad` and `group/banu-israil`, a citation key that does not resolve in `group/al-ajam` and `group/al-rum`, the id mismatch of `person/kilab-ibn-murrah`, un-isolated parentheses in eighteen `work/` and `person/` summaries, and others). `main` already failed this gate at the baseline (16 errors). **The gate is unmet and was not weakened.**
- **`npm test`: 506 passed, 4 failed, 2 skipped**, run once on the merged branch before the parenthesis correction. One failure is the validator test above. The other three are in lists `main` keeps by hand and this work does not touch: the canon register's total (`docs/canon.md`, 855 against 875 records), the reading list's check of `practice/salah`, and the 3D tour's sources for the Farewell stop. They were not re-run after the last merge of `main`.
- **Statements 4 and 5 are not green for the pilot.** The original Grade 6 Science pilot links stubs, not records, in 3 of its 15 connections (`oracle-output/o04-mapping.out`). The courses made by the pipeline pass. The pilot was measured, not rewritten (section 5).
- **The full site build was not run**, nor CI awaited, on the user's instruction. What was built is the scoped build (the courses pages, the `/learn/` hubs and the homepages: 1,285 pages). CI on the pull request was not awaited.
- **Three oracles last ran before Urdu and the homepage section existed** (three taps, no-script, the vision pass): they cover Arabic and English only. The Urdu pages and the homepage section have been built and compared byte for byte against the base (`o11`), but **no reviewer has looked at them**.

## 3. Errors made during the run, and what caught them

- The first fleet pass was poor. Fresh reviewers read all 367 lessons it wrote: in the elementary courses they kept 128 of 309 connections as written, asked for changes to 96 and removed 85; in the secondary courses they kept 281, changed 91 and removed 60. All verdicts were applied. **A first pass must never be published unreviewed.**
- Three museum records that must not be put before students were linked by agents and caught only by readers: `concept/islamufubiya` (repeats a hateful phrase from a poll without framing), `concept/medina-society-at-hijra`, `event/change-of-qibla`. All were unlinked. Others unlinked as unsuitable for the grade or the claim: `concept/athar-al-iqlim`, `concept/malaika`, `passage/quran-3-97`, `concept/al-ud`, `concept/ghulamiyyat`; `concept/al-qiyan` remains only in two secondary music lessons, rewritten. **The records themselves were not edited**: they are outside this work's boundary and are listed here for the founder.
- A correction agent added a gloss the source does not carry ("a rewarded act" for *mustahabb*); a claim resting on Wikidata alone ("the first muezzin") was written as prose. Both were removed.
- The proof course's gap register claimed the museum had nothing where it had: a verifier refuted 4 of 8 gap claims. The runbook now requires two recorded searches per gap.
- The pilot's verifier found that 0 of its 29 expectation texts are the Ministry's wording, 17 carry the wrong code and strands C and D are swapped.
- The courses stylesheet leaked onto another page in the first build; the boundary oracle caught it.
- The audit's first draft overstated two numbers; a recount corrected them (45 of 47 matched).
- The release notes: the block above this work's is dated 19 November 2026 by other agents, a date that had not yet come when this work's block was written on 12 November 2026. This work's entry carries the true date.

## 4. Where the work does not do what the brief asked

- **The agent merged its own pull requests, and the final merge went to `main`.** The brief said the founder merges and pull requests target `release/uat`. The user instructed otherwise during the run, and the repository's rule changed on 12 November 2026 (one branch, `main`; agents merge after a three-way merge). The repository's rule was followed.
- **Urdu.** The brief put Urdu in the founder's lane and `/ur/` out of bounds. The user then asked for everything in Arabic, English and Urdu, which is also the repository's standing language rule. All Urdu here is machine-written draft, unread by an Urdu reader.
- **"Nothing outside the courses surface changes."** Two things outside it changed, both asked for by name: the homepage gained a section and a card. Nothing else did (`o11`: the `/learn/` hubs are byte-identical; each homepage is identical once those two additions are cut out).
- **The header menu does not list the Education Explorer.** Adding it rewrites every page of the site (about 164,000). Left for the founder's weekly batch.
- **"Official text" is not the whole official text.** The repository stores at most 40 words of a source verbatim, so expectations are quoted under that rule: example lists become `[…]` and long texts are cut. About 60% of the Ministry's words are not on the page. The gate checks fidelity to the rule, not to the full text.
- **Three taps.** Holds with limits: today a course is two taps from the courses home; it is exactly three once more than three school systems exist. Measured from the courses home, not from the site's front door, and not measured for Urdu.
- **Enrichment "only from sources the museum already cites".** Held as: every connection points to an existing record and repeats only what that record says, cited to the record's own sources. A verifier found 7 of 81 sampled statements stretched; they were fixed. The remaining lessons were read by the sweep reviewers, not sampled statement by statement.
- **Duplicate codes.** Two Ministry documents repeat a code (B1.3 in AMU3M, H2.2 in HZT4U); the coverage check is keyed by code and counts each once.
- **The page is still titled "Syllabus Browser"** in its heading strings; the homepage calls it the Education Explorer. One name should be chosen.
- **Each lesson exists at two addresses**: the entity page `/course/<slug>/` and the new lesson page. No canonical has been declared.
- **`DESIGN.md` was written for Arabic and English**; a dated note at its head records the widening to Urdu and the removal of the legacy page.

## 5. Decisions that are the founder's

1. **The pilot (Grade 6 Science).** Rewrite it through the pipeline, or withdraw it. It is live on production today with expectation texts that are not the Ministry's.
2. **Draft records are visible on production today.** The pilot's 23 records are drafts and are served. Whether drafts of this fleet should be served at the next deploy, or held until a human read, is his call; AGENTS.md says AI output goes live only after a human read.
3. **The records listed in section 3**: fix, reframe or restrict them.
4. **Museum records that disagree with themselves across languages or overstate**, found while linking and not edited: the House of Wisdom ("greatest" in one language, "largest" in another), Ibn al-Nafis, the Urdu of the *sa'* measure, *hamiyya* rendered "soup", tulip and lavender, the Galen record, the summary of the siege of al-Bira. Details are in the sweep reports under `verifier/`.
5. **Fatwas beside science expectations.** Several science lessons link a legal ruling as the museum's connection. The runbook now says a ruling is not a standard; whether such links belong in a science lesson at all is a scope decision.
6. **Two living people** appear in connection cards that say "According to English Wikipedia". Keep, re-source or remove.
7. **Modern Muslim scientists whose faith is not recorded with a basis were not linked.** That follows the rule; it also means the science lessons end around the seventeenth century.
8. **Curricula without codes** (British Columbia, Quebec, England): the schema requires a code. A numbering of the museum's own is implemented and marked as such; it needs approval before use.
9. **Connection kinds.** The closed list lacks concept, practice, institution, event, work and ruling; agents filed dozens of records under kinds that do not fit.
10. **A reviewer's pass as a required gate.** The gate cannot tell an honest link from a stretched one or a record fit for a child from one that is not. Until a reader's verdict is a recorded, required step, GREEN must not be read as "safe to show".

## 6. What was not done

- Ontario courses published only as PDF, among them the two most relevant in the province (`CHW3M`, `CHY4U`/`CHY4C`, world history) and senior mathematics. A PDF extraction step is the most valuable piece still to build.
- Canadian history and civics, First Nations, Métis and Inuit studies, language arts, physical education, technology, business, dance: judged not relevant, with reasons (`docs/courses/ontario-review.md`, `SCALE-MAP.md` section 5).
- British Columbia, Quebec, Michigan, Texas, Washington and California: **on hold after Ontario by the user's instruction**. Michigan and California refuse automated requests; a person must supply their official PDFs.
- No Arabic or Urdu reader has reviewed the texts.
