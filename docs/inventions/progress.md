# Muslim Inventions Browser: progress

This file is updated with every merged phase or batch. A merged change is not live; deployment is manual and belongs to the founder.

## Log

- **4 November 2026 — Phase 0 started.** Branch `inventions/p0-copilot` is based on fetched `origin/main` `b526655edb`. The operative prompt's authorization is recorded as D-000; the external harvest directory exists on `/Volumes/exmicroSD`. No source files have been downloaded, and no invention data, schema, API or site change has been made.
  - FLAG: the lane's citation and identity work must not infer Sunni affiliation from a person's name, place or period. Modern figures follow the two-independent-source faith rule.
  - FLAG: the existing untracked `docs/inventions/PROMPT-COPILOT.md` is preserved and excluded from commits until its ownership/intent is resolved; the operative brief is separately supplied at the user's Downloads path.
  - Phase 0 plan and census are complete. `npm run inventions:census`, `npm run validate`, `npm test` (323 passed, 1 skipped) and `git diff --check` pass. Validation emits existing stub-list warnings. The first test run found the site's Astro dependencies were not installed; installing them locally without changing manifests allowed the full suite to pass.
  - TypeScript checks are not clean on the current base: `npx tsc --noEmit` reports existing errors across test/site files; the focused census check is blocked by the missing `edtf` declaration in `scripts/lib.ts`. No census-file diagnostics were reported.
  - Phase 0 commit `cc2131d308` was merged with refreshed `origin/main` `5fb35c65cf` as `f6a40029b8`; incoming changes did not overlap Phase 0 files. The census, validation and full test suite were rerun successfully after the merge.
  - Two later `origin/main` refreshes added 38 non-overlapping Tabari content commits through `62ecc19deb`; the merges are `a6039695d1` and `52f2757691`. On the latest tree, the census and validation passed and the full suite passed (19 files, 323 passed, 1 skipped).
  - A third refresh added 20 more non-overlapping Tabari content commits through `2f36c83f6c`, merged as `d2486ef7a0`. The regenerated report now records 208 English/Arabic prose-hit files; validation and the full test suite passed again.
  - Phase 0 PR #3674 was opened and merged at `f16f28f825`; Phase 1 follows.
- **5 November 2026 — Phase 1 implementation complete; PR/merge pending.** The branch is `inventions/p1-copilot`; it began at `daf9b0f70c` and now includes refreshed `origin/main` at `6d78f41539` via merge commit `e7aceeeed4`. The authorized invention class, enums, predicates, ties, validator, graph derivation, API exports, API metadata and English/Arabic/Urdu labels are implemented in commit `e2710cbb7f`. The schema generator has been rerun. Before the origin refresh, `npm run validate`, `npm test` (20 files, 330 passed, 1 skipped), focused invention tests (7/7), `npm run build` (162,965 pages, check-site 0 errors/2 warnings, check-weight 0 over budget, 897 books/0 skipped), and `git diff --check` passed. After the origin refresh, `npm run validate && npm test` passed (20 files, 331 passed; authenticity check 0 errors/1 warning). The fresh post-merge `npm run build` passed: 163,238 pages built, check-site checked 163,250 pages with 0 errors/2 warnings, check-weight found 0 over-budget routes across 41 routes, and 897 books were generated with 0 skipped. The invention dataset and chains are empty as expected; the class index is `[]`, API metadata includes `invention`, and `llms.txt` links to the dataset, chains and class index. A final `origin/main` fetch found no commits beyond `6d78f41539`; merging `FETCH_HEAD` was already up to date.
  - D-004 keeps dates within the existing Julian/Gregorian calendar enum and records Hijri dates in the separate `hijri` field.
  - D-005 defers `/api/v1/inventions/timeline.json`, which is outside the endpoints approved by D-000.
  - The Phase 1 submission-impacting note is recorded in the A.5 claims register and DPGA evidence map. The origin refresh added 106 commits; the only overlapping path was `CANARY.md`, resolved by preserving its complete recovered v1.1.0 release history and adding v1.2.0 per D-006. The root package version remains 0.1.0, matching origin/main.
  - The first site build exhausted the local system volume while writing 13 GB of generated pages. The successful post-merge build used the temporary `dist` symlink to the prepared external volume; generated API and site outputs were verified, and the temporary build output and symlink have been removed.

## Current state

- Phase: 1 — schema and API foundation (committed and merged with refreshed origin/main; post-merge gates and PR/merge pending).
- Branch: `inventions/p1-copilot`.
- Phase 0 is merged; Phase 1 implementation commit `e2710cbb7f` is in the branch, along with origin refresh merge `e7aceeeed4`.
- Downloads: no new downloads for Phase 1.
- Schema/API changes: implemented and locally validated; no invention records or browser page yet.
- Worker/workflow changes: none.
- Deployment: none; do not deploy.
- Local gates: pre-refresh validation, full/focused tests and build passed; post-refresh validation, tests and full site build passed.

## Flags

- Urdu wording is a draft and needs native review where the source phrasing is difficult.
- Each record needs a compliant hero image and a diagram; no record is counted complete without them.
- Identity, tradition, attribution and dates remain leads until the cited evidence is read.
