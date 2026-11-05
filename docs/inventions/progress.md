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
  - Next step: refresh `origin/main` once more before pushing, then open the Phase 0 PR and merge it after CI passes.
- **5 November 2026 — Phase 1 implementation complete; PR/merge pending.** The branch is `inventions/p1-copilot`, based on refreshed `origin/main` at `daf9b0f70c`. The authorized invention class, enums, predicates, ties, validator, graph derivation, API exports, API metadata and English/Arabic/Urdu labels are implemented. The schema generator has been rerun. `npm run validate` passes; `npm test` passes (20 files, 330 passed, 1 skipped); the focused invention tests pass (7/7); `npm run build` passes (162,965 pages, check-site 0 errors/2 warnings, check-weight 0 over budget, 897 books/0 skipped); and `git diff --check` passes. The generated empty index, dataset, chains, API class list and `llms.txt` links were checked. Final origin refresh, commit, PR and merge remain.
  - D-004 keeps dates within the existing Julian/Gregorian calendar enum and records Hijri dates in the separate `hijri` field.
  - D-005 defers `/api/v1/inventions/timeline.json`, which is outside the endpoints approved by D-000.
  - The Phase 1 submission-impacting note is recorded in the A.5 claims register and DPGA evidence map. A later origin refresh recovered the product release notes through v1.1.0; D-006 sets the Phase 1 block to v1.2.0 and keeps the root package version at 0.1.0, matching origin/main.
  - The first site build exhausted the local system volume while writing 13 GB of generated pages. The build output was redirected through a temporary `dist` symlink to the prepared external volume; the full build and its checks then passed. Remove that temporary build output and symlink after final artifact verification.

## Current state

- Phase: 1 — schema and API foundation (implementation and local gates complete; PR/merge pending).
- Branch: `inventions/p1-copilot`.
- Phase 0 is merged; Phase 1 is not yet committed or merged.
- Downloads: no new downloads for Phase 1.
- Schema/API changes: implemented and locally validated; no invention records or browser page yet.
- Worker/workflow changes: none.
- Deployment: none; do not deploy.
- Local gates: schema generation, validation, full and focused tests, build, generated-output checks and whitespace check pass.

## Flags

- Urdu wording is a draft and needs native review where the source phrasing is difficult.
- Each record needs a compliant hero image and a diagram; no record is counted complete without them.
- Identity, tradition, attribution and dates remain leads until the cited evidence is read.
