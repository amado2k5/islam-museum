# 45 · The Fable 5.2 run and the build/deploy speed work (November 2026)

This is the engineering record of two connected bodies of work from November
2026: a single goal-based build run by Claude Fable 5.2 against the whole
repository, and the build and deployment speed work that was trialled on UAT
and then brought to `main`. It records what changed and what was measured,
with the source of every number. The pipeline as it now stands is documented
in [06 · Deployment](06-deployment.md); the public evidence package for the
application run is [`docs/verification/`](../verification/README.md), and the
run's own records are in [`docs/fable-run/`](../fable-run/VERIFICATION.md).

Nothing in this document is a deployment claim. Merging is not deploying:
production changes only when the founder deploys, by hand.

## 1. The application work: the Fable 5.2 run

### How it was run

- **One mission, stated as outcomes.** The builder received a single
  goal-based prompt (published as exhibit C of
  [`docs/verification/`](../verification/fable-5-2-mission-prompt.md)):
  verifiable statements about the finished state, the repository's standing
  rules as boundaries, and two literal ship gates — the validator must print
  `0 errors`, the citation check `0 fail`.
- **Self-grading by oracle, not by narrative.** Each statement has a committed
  oracle under `scripts/fable/`; the ledger board in
  [`docs/fable-run/VERIFICATION.md`](../fable-run/VERIFICATION.md) is generated
  from the oracles' own last lines, and the before/after table in
  [`docs/fable-run/NUMBERS.md`](../fable-run/NUMBERS.md) is generated from
  their captured outputs.
- **Orchestration.** The run's harness reported 28 subagents in five roles —
  7 prose writers, 2 graph editors, 4 adjudicators, 12 fresh-context
  verifiers, 3 fixers — 10,926,036 tokens, 2,662 tool calls, 553
  agent-minutes (agents ran side by side; the orchestrating session's own
  tokens are not in these figures). Verifiers were briefed to disprove, and
  did: three pull requests from the run (#6027, #6028, #6029) open with dated
  corrections of their own first-reported figures.
- **The local judge.** Governance decisions in this project accumulate in a
  decision ledger. A judge model running locally on the founder's hardware
  (Ollama, `qwen2.5:32b`) triages proposed decisions against the founder's
  recorded rulings and the precedents mined from them. The judge advises; it
  does not decide — and for the ledger itself, agents do not self-merge.
- **Route to production.** The work was written as seven stacked phase pull
  requests (#6022, #6023, #6027, #6028, #6029, #6030, #6033) against a frozen
  baseline (`e1d7212`, main at the run's start; production at the time was
  `8d1b0ef9`, v1.10.0). It was integrated onto `release/uat` for UAT review
  (PR #6036, with repairs #6037 and #6039 and a merge of main in #6055;
  CANARY v1.21.0 on that branch), then merged to `main`, and deployed to
  production by the founder on 12 November 2026 (commit `eeb962b7`, site
  v1.28.0).

### What changed in the application

Measured by the run's oracles, baseline → this branch (full table:
[`docs/fable-run/NUMBERS.md`](../fable-run/NUMBERS.md)):

- **The Grand Tour exists.** 0 tour stops before; 40 stops after, spanning
  nine wings and fourteen Hijri centuries, entered through the River of Time,
  walkable with JavaScript disabled (40 of 40 rooms in Arabic and in English).
  5,871 records hang directly off the Tour's path.
- **Every Tour lead meets the published standard.** Tour leads of 150–250
  words: 1 of 80 before, 80 of 80 after; leads containing a sentence with no
  citation: 50 before, 0 after. Deepening used only sources the record
  already cited.
- **The canon's coverage holes are repaired.** Cornerstones sitting in no
  wing: 48 before, 0 after. Hijri centuries with no cornerstone: the 12th was
  empty before; none is empty after (the century floor raises
  `person/ahmed-iii-uthmani`). Wings with no cornerstone: Today and Made
  before; none after. Cornerstones: 270 → 271.
- **Dead ends reduced, not eliminated.** Dead-end cornerstones: 29 before
  (23 isolated, 6 leaves), 12 after (7 isolated, 5 leaves) — the verifier
  removed 17 of the 82 relations first added because the records' own
  sentences did not support them.
- **A cross-record contradiction sweep.** 130 contradictions found; 38 fixed
  from already-cited sources; 84 standing in the register with their
  evidence; 8 read and found consistent.
- **An honest absence list.** Of 31 subjects the canon register called
  missing: 24 found in the graph under another name, 1 present only as a
  stub, 6 absent after the search.
- **A mechanical vision pass.** Fresh-context reviewers listed 135 visible
  defects from committed screenshots: 23 fixed and confirmed gone by a later
  fresh look, 112 registered with a reason.
- **The rest of the site renders as before.** Homepage and wing landings
  rebuilt from the old templates and the new and compared byte for byte: 28
  of 31 rendered pages byte-identical, 3 different, 0 missing.

### The board: 11 of 13 GREEN, 2 NOT GREEN

The run's own ledger marks 11 of its 13 statements GREEN. The two NOT GREEN,
in the ledger's own terms:

- **Statement 4 (reachability) — NOT GREEN.** Two checks fail: 12
  cornerstones are still dead ends, and not every published record sits
  within three hops of a cornerstone — 7,114 of 18,699 published records
  (38.0%) on the branch measurement; 7,123 (38.1%) when the oracles were
  re-run on the merged tree at the integration point. Under the ledger's
  narrower read (leaving out source, media and dataset records), 7,114 of
  9,631 (73.9%).
- **Statement 6 (canon-first search) — NOT GREEN.** Of the 50 fixed queries,
  48 do not return the canon record first on production (2 of 50 do). The
  search oracle measured the live site only; the branch's search was never
  built, so nothing is known about whether the run moved it.

The ledger also records where its own GREENs are narrow
([`VERIFICATION.md`, "Where I may be wrong"](../fable-run/VERIFICATION.md)):
statement 1's canon rests in part on a Wikipedia language-edition count used
inside the eligibility rule — 489 of the 824 canon records need that count to
be eligible, and the count's cache is kept out of git, so the selection
cannot be reproduced from the repository alone; statement 2's nine wings
rest on two wing additions made by the run (Al-Azhar for Today, the Kiswa for
Made), and a verifier found that the database entry cited for the Kiswa's
sentence does not carry it; the Tour's 80 narratives are machine-written text
on records whose review state is `published`, which the museum's own rule
reserves for text a person has read. These are recorded as proposals for the
founder (P-2, P-3, P-4 in
[`docs/fable-run/PROPOSALS.md`](../fable-run/PROPOSALS.md)), not settled by
the run.

### The independent retest

A different agent acceptance-tested production before the run and re-ran the
identical checks after the founder's deploy
([`docs/verification/`](../verification/README.md)):

- **7 of the 9 baseline defects (D1–D9) fixed**: map city selection (Baghdad
  opens with 982 linked records; Mecca with 554), object photographs,
  leaked editorial markers, Backstage freshness, the populated People hall,
  changelog rendering, and the Battles ghazawat counts (57 + 15, total
  3,251).
- **D8 partial**: footnote anchors work where a page carries them; the
  sampled nature pages still render with no footnote apparatus.
- **D9 not fixed**: `chains.json` and the OpenAPI index still return 404.
- **Both flagship features verified live** in build v1.28.0: the Grand Tour
  (40 stops, 9 wings, 14 centuries) and the Education Explorer (65 Ontario
  courses, Grades 1–12, lessons tied to official curriculum codes).
- **Search, echoed honestly**: "Saladin" returns the person page first;
  "Muhammad" still returns an object first — the production echo of
  statement 6's NOT GREEN.

## 2. The build and deployment speed work

### Route and decision

The founder directed that production be left as it was, the changes tried on
UAT first on `release/uat` (a one-off exception to the one-branch rule), and,
after the UAT runs of 13 November, that the reviewed changes be opened to
`main` together with the `/ar` redirect fix and the action-version updates.
The decision record for the lane is
[`dec-20261113-269`](../decisions/records/dec-20261113-269.yaml). The trial
was PR #6343 (merged to `release/uat` on 12 November 2026); the move to
`main` was PR #6496 (merged 13 November 2026). Risk label for both:
`non-impacting` — no content, schema, licence or privacy change.

### What the trial measured first (PR #6343)

- `site/src/lib/graph.ts` — build run 42911617876 showed 167,679 entity pages
  at 53 ms each, 2 h 28 min of a 3 h build; lookups measured 21.65 ms per
  page locally. The change: index edges by `from` once, parse `related.json`
  once; same results for all 60,000 ids, lookups to ~0 ms per page.
- `workers/r2-sync/batch/publish.mjs` — deploy run 42875635295 showed 1,763
  archives uploaded in 7,172 s, about 4 s each, one at a time, because the
  staging upload blocked the event loop. The change: it no longer blocks.
- `workers/r2-sync` — up to 42 invocations wrote one shared status key,
  `_r2-sync/status.json`, against R2's limit of one write per second to a
  key. The change: `STATUS_FILE = "off"` (UAT sync Workers in the trial).
- `.github/workflows/build.yml` — uploading 419,580 files took 24 min. The
  change: upload one zstd tar as artifact `dist-tar`.
- `.github/workflows/deploy-env.yml` — copying the whole build took 4 min
  and the strip step 45 s. The change: unpack the tar; one `rsync` exclude
  list instead of copying; Pages deploys the same assets-only folder.

### Measured on UAT against production (PR #6496)

Same content, 12 and 13 November 2026. Runs: production build 43290221939
and deploy 43330494209; UAT build 43300358009 and deploy 43334841849.

| Measure | Production, old code | UAT, new code |
|---|---|---|
| Page rendering | 3 h 6 min | 43 min |
| Build run | about 3 h 34 min | 1 h 22 min |
| Deploy job | 3 h 13 min | 47 min |
| R2 publish | 99 min, 307,693 operations, 678 retries | 42 min, 441,087 operations, 13 retries |
| Artifact | 6.7 GB, 456,579 files | 1.15 GB, one file |

400 pages sampled across the sitemap are byte-identical between UAT (new
code) and production (old code).

### What PR #6496 changed on `main`

1. `site/src/lib/graph.ts`: edges indexed by `from` once; `related.json`
   parsed once.
2. `workers/r2-sync/batch/publish.mjs`: the staging upload no longer blocks
   the event loop.
3. `workers/r2-sync`: `STATUS_FILE = "off"`, as tried on UAT and now in
   production configuration.
4. `build.yml`: the build is uploaded as one zstd tar, artifact `dist-tar`.
5. `deploy-env.yml`: unpacks the tar; one `rsync` exclude list instead of
   copying the whole build; Pages deploys the same assets-only folder. It
   accepts both `dist-tar` and the plain `dist` of older builds, so the
   rollback copies stay deployable.
6. `workers/site/wrangler.production.toml`: `/ar`, `/en`, `/ur` without the
   trailing slash go to the Worker, which redirects them (they returned 404
   on production and UAT before).
7. All workflows: checkout, setup-node, upload-artifact v7;
   download-artifact v8; wrangler-action v4.
8. `tour/halls.yaml`: three stops list the Biblissima source their records
   gained in `d0197e27db`; `scripts/tour.test.ts` was failing on `main`, and
   a failed test job cancels every build run.
9. Docs: `AGENTS.md`, `docs/engineering/06-deployment.md`,
   `docs/agents/workflow.md`, `workers/r2-sync/README.md`.

Checks recorded in PR #6496: `npm run validate`: 0 errors. `npm test`: 512
passed and 1 failed before item 8; `scripts/tour.test.ts` passes after it
(25 of 25). Worker tests 32 passed; `archive-test.mjs` passed.

### Status

PR #6496's own deploy note governs: the changes **go live at the founder's
next deploy**; the next build of `main` produces the first `dist-tar`
artifact. Items 5 (the plain-`dist` fallback path), 6 and 7 were not yet
exercised at merge time; the first build of `main` and a UAT deploy from
`main` after the merge are their test, deploying to UAT before production.
The reader-facing summary of the same measurements is in CANARY v1.28.0
(Performance); the pipeline mechanics are in
[06 · Deployment](06-deployment.md) §2.

## Sources

- PR #6343 — the UAT trial (base `release/uat`):
  https://github.com/amado2k5/islam-museum/pull/6343
- PR #6496 — the speed changes on `main` (decision record
  `dec-20261113-269`): https://github.com/amado2k5/islam-museum/pull/6496
- PR #6495 — the published evidence package:
  https://github.com/amado2k5/islam-museum/pull/6495
- [`docs/verification/`](../verification/README.md) — before/after production
  tests (2026-11-10 and 2026-11-12) and the mission prompt.
- [`docs/fable-run/`](../fable-run/VERIFICATION.md) — the run's ledger,
  numbers, gap register and proposals.
- Phase PRs #6022, #6023, #6027, #6028, #6029, #6030, #6033; UAT integration
  PRs #6036, #6037, #6039, #6055.
