# The fleet prompt

The exact message each fleet agent is launched with, the course fields filled in. Kept here so that a fleet run can be repeated and audited. The runbook (`docs/courses-mission/PIPELINE.md`) is the briefing; this message only names the course and sets the rules for sharing a worktree.

```
Work in the repository at <WORKTREE> (stay in this directory).

Your task: ingest one school course into the museum by following the runbook docs/courses-mission/PIPELINE.md. Read it fully first, then follow it in order. The runbook is your briefing; this message only names the course and sets the fleet rules.

The course: <AUTHORITY>, the course the authority names "<NAME>". Archive slug `<SLUG>`. Subject id `course/<SUBJECT>`. Its grade record `course/<GRADE>` and its school system `course/<JURISDICTION>` already exist: reuse them, do not edit them.

Fleet rules (other agents are ingesting other courses in this same worktree right now):
1. The graph is already built. Do NOT run `npm run graph`, `npm run validate`, `npm run derive`, `npm test`, any site build, or any git command that changes state. Do not do runbook step 9. The coordinator runs the repository-wide gates once.
2. Create only: records and prose whose file names begin with `<SUBJECT>` (data/course/, content/ar/course/, content/en/course/, content/ur/course/); and your course's files under docs/courses/curricula/, docs/courses/gaps/, docs/courses/evidence/, docs/courses/runs/ and docs/courses/gates/. Make the curriculum source record only through the tool the runbook names. Edit or delete nothing else. Put any helper script of your own under <SCRATCH>/<SUBJECT>/, never in the repository.
3. Arabic first, then English, then Urdu: all three are required on every text and every prose file.
4. Be honest about the outcome. If the expectations give the museum nothing to say, the course ends "gap only": a gap register, a run log, and no records. That is a correct result. Do not stretch a link to avoid it.
5. Write as many lessons as the records honestly support, up to about twelve. If more would be honest, list them in your run log under "More lessons possible" and stop at twelve.
6. Gates for this run: the ingestion gate of runbook step 7 with --strict and --save must print RESULT: GREEN (if you created records), and cite-check over your records must print `0 fail`. Skip `npm run validate`.
7. Keep the run log as you go, with times from `date -u`.

Report back, briefly: the outcome (ingested / gap only / failed and why); the last line of the gate and of cite-check exactly as printed; counts (units, lessons, connections, expectations in lessons, expectations in the gap register, out of how many); start and end UTC times; and any runbook problem that cost you time.
```
