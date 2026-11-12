# The proof run: one course, one fresh agent, only the runbook

Part B.6 of the mission: choose the single highest-value next course, have a fresh-context agent ingest it end to end using only `PIPELINE.md`, observe, time it, log every place the runbook failed, and fix the runbook.

## The choice, and why

**Ontario, Grade 4, Social Studies** (the Ministry's course `SSHG - Grade 4`; strand A, "Heritage and Identity: Early Societies to 1500 CE", and strand B, "People and Environments: Political and Physical Regions of Canada").

Three measured facts decided it.

1. **Graph density.** `scripts/courses/density.py` (output: `oracle-output/density.out`) counts the museum records a course could link, by school subject. History and social studies: 4,580 records with prose. Mathematics: 54. The three science groups: 137 to 244 each. The pilot was a science course; the museum's weight is elsewhere.
2. **Official availability.** Ontario's Ministry serves its curriculum from a public content service with coded expectations, which `fetch_ontario.py` reads. California's Grade 7 standards, which name Islam directly and reach about three times the students, are behind a firewall that refuses automated requests (`cde.ca.gov` answered with a redirect to a block page); the pipeline does not work around a block. England's programmes of study are open on `gov.uk` and have no codes, which the schema requires.
3. **Audience.** The course is compulsory for every Grade 4 student in the province, and it extends the tree the pilot started (same school system), which exercises the "reuse the jurisdiction, add a grade" path.

Strand A asks students to study "a few early societies (to 1500)" and names medieval Islam in its own examples (A3.10: "religious rights in medieval Islam"). Strand B is about the regions of Canada, where the museum holds nothing: a real test of the rule that a gap is registered and never filled.

Among courses an agent can fetch today from the authority itself, with codes, this is the one where the museum has the most to give to the most students. The stronger candidates by density alone, Ontario's `CHW3M` and `CHY4U` world history, are published as PDF only and need an extraction step that does not exist yet.

## The launch prompt

The agent was a fresh context (Claude Sonnet 5.5), launched with this prompt and nothing else. It is quoted in full because "only the runbook" rests on it.

> Work in the repository at [the worktree path] (stay in this directory).
>
> Your task: ingest one school course into the museum by following the runbook docs/courses-mission/PIPELINE.md, and nothing else. The runbook is your only briefing: read it fully first, then do exactly what it says, in order.
>
> The course: Ontario (Canada), Grade 4, Social Studies — the Ministry of Education's course named "SSHG - Grade 4" in its curriculum service. Use the archive slug `ontario-sshg-2023-g4` and the subject id `course/ca-on-g4-social-studies`.
>
> Three limits for this run:
> 1. Do steps 0 to 8 of the runbook. Do NOT do step 9 (no CANARY entry, no coverage, no commit, no push, no pull request). Do not run any git command that changes state (no commit, checkout, stash, reset, add). Another process shares this worktree: touch only files the runbook tells you to create, and do not edit or delete anything else (in particular nothing under site/, scripts/, i18n/, docs/courses-mission/).
> 2. Keep the run log the runbook asks for (docs/courses/runs/ca-on-g4-social-studies.md) honestly and as you go: start it with the UTC time from `date -u`, write the time at the start of every step, and record every command that failed, every point where the runbook was unclear, wrong, or missing something you needed, and every judgement call. This log is the main thing being evaluated — a run that hides its difficulties is a failed run. If the runbook and reality disagree, say so in the log, choose the most conservative reading, and continue.
> 3. If something truly blocks you (the official document cannot be fetched, a tool crashes and you cannot proceed), stop and report rather than improvising around it.
>
> When you finish, report back: the final lines of the three gates exactly as printed, the counts (records created by kind, connections, expectations in lessons, expectations in the gap register), the start and end UTC times, and your list of runbook problems in order of how much time each cost you.

What the prompt added beyond the runbook, stated plainly: the course name and the two slugs; the instruction to stop before shipping (step 9), because the coordinator integrates; and the instruction not to touch the coordinator's files. It gave no hint about which records to link, how many lessons to make, or what to send to the gap register.

The runbook the agent read is the committed version at `8abde83fd4` (`git show 8abde83fd4:docs/courses-mission/PIPELINE.md`).

## Timing

| Measure | Value | Source |
|---|---|---|
| Started | 2026-11-12T05:32:30Z | the run log's first line (`date -u`) |
| Finished | about 05:47Z | the agent's report |
| Wall clock | 14 minutes 10 seconds (850 s) | the harness's own timer for the agent |
| Of which, waiting on `npm run graph` (twice) and `npm run validate` | roughly 9 minutes | the log's step times |
| Tool calls | 37 | the harness |
| Tokens | about 183,000 | the harness |

The agent's first draft of its log carried step times written from memory that ran ahead of the real clock; it caught this itself, corrected them, and said so in the log. The wall-clock figure above is the harness's, not the log's.

## What it produced

| | Count |
|---|---|
| Records created | 6: one grade (`ca-on-g4`), one subject, one strand (`ca-on-g4-ss-a`), three lessons |
| Records reused, unedited | the school system `ca-on-english`; the curriculum source `source/ontario-curriculum-sshg-2023` |
| Prose files | 12 (Arabic and English for each record) |
| Connections | 8, each linking a real record, each citing only sources its record already cited |
| Specific expectations in the Ministry's document | 36 |
| In lessons | 6 (A3.4, A3.6, A3.7, A3.8, A3.9, A3.10) |
| In the gap register | 30 (the 16 of strand B; 14 of strand A) |

Gates as the agent ran them: the ingestion gate `RESULT: GREEN (22 checks passed)`; cite-check `6 pass, 0 fail of 6 record(s)`; the validator `16 errors`, the same 16 lines as at the baseline, none in a file the agent created.

**The run was conservative, and that is a finding.** Every expectation of strand A requires "at least one First Nation and one Inuit society", which the museum cannot supply. The runbook had no rule for an expectation the museum can serve only in part, so the agent took the narrowest reading: it made lessons only where the expectation's own examples reach the museum's records, said in each lesson's Brief that the class must add the other societies, and sent the rest of strand A to the register. Daily life, social organisation and the environment in an early Islamic society (A1.1 to A1.4, A3.3, A3.5) went to the register although the museum has records for them. The runbook now has the rule (below); the proof course is left as the fresh agent made it, because it is the evidence.

It also rejected links a less careful run would have made, and logged each: a reserved pasture offered for an expectation about industry and citizens; a record about gold purity offered for daily life; a medieval world map offered for a thematic map of the environment; a land-grant record offered for feudal society.

## Runbook edits the run forced

Each line is a problem the agent logged and the edit made for it (`git diff 8abde83fd4 HEAD -- docs/courses-mission/PIPELINE.md scripts/courses/`).

1. **An expectation that asks for more than the museum holds had no rule.** Added "When an expectation asks for more than the museum holds": the museum serves its part and only its part, the Brief says what the class must bring, and an expectation whose whole object is outside the museum is a gap.
2. **`entity_brief.py` printed the whole prose** (12,000 words for one record); the agent wrote its own wrapper. The tool now cuts to 2,500 characters per language and has `--full`; the runbook says so.
3. **`npm run graph` takes about two minutes, not one,** and hit the tool's timeout twice. Step 0 now says two minutes, says to run it in the background, and says not to run it at all when a coordinator has built it.
4. **The `0 errors` gate cannot be met when the repository already fails.** It was said only in step 8; step 8 now also says the validator is skipped in a fleet run and run once by the coordinator.
5. **`--save` wrote into the mission's folder.** A course's gate output now goes to `docs/courses/gates/`, with the course's other files.
6. **"A clean worktree" was not true** in a shared worktree. Step 0 now says untracked files of another process may be present and are to be left alone.
7. **The existing curriculum source says the museum "quotes nothing" from it,** which the pipeline's stored quotations contradict. The runbook now says the note predates the pipeline and is not the agent's to edit; it is listed for the founder in `PUBLISH.md`.
8. **Nothing on direction isolates or the cut marks in translated expectations.** Step 5 now says to keep `[…]` and ` …` in every language and to wrap Arabic-script parentheticals.
9. **No connection kind for a treaty, a covenant, an office or an institution.** Added to the proposals list; the agent used `story`, `invention`, `career` and `place`.
10. **A deprecation warning from the fetcher.** Fixed.

Edits not forced by the run, made afterwards on the user's instructions of 12 November 2026: Urdu is now required beside Arabic and English (rule 6, the record templates, the prose step, and a strict check in the gate); a whole course may end "gap only"; skills expectations go to the register without searches; a slug pattern for secondary courses.

## What the run does not prove

- One course, one agent, one authority with a machine-readable service. A PDF-only curriculum, or one without codes, is untested.
- The agent's Arabic was not read by a human. A fresh verifier sampled the texts against their records (`verifier/proof-enrichment.md`); nobody has yet read them as a teacher would.
- "Only the runbook" means the agent was given no other instruction. It could, and did, read the repository files the runbook points to.
