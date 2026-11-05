# Muslim Inventions Browser: progress

This file is updated with every merged phase or batch. A merged change is not live; deployment is manual and belongs to the founder.

## Log

- **4 November 2026 — Phase 0 started.** Branch `inventions/p0-copilot` is based on fetched `origin/main` `b526655edb`. The operative prompt's authorization is recorded as D-000; the external harvest directory exists on `/Volumes/exmicroSD`. No source files have been downloaded, and no invention data, schema, API or site change has been made.
  - FLAG: the lane's citation and identity work must not infer Sunni affiliation from a person's name, place or period. Modern figures follow the two-independent-source faith rule.
  - FLAG: the existing untracked `docs/inventions/PROMPT-COPILOT.md` is preserved and excluded from commits until its ownership/intent is resolved; the operative brief is separately supplied at the user's Downloads path.
  - Phase 0 plan and census are complete. `npm run inventions:census`, `npm run validate`, `npm test` (323 passed, 1 skipped) and `git diff --check` pass. Validation emits existing stub-list warnings. The first test run found the site's Astro dependencies were not installed; installing them locally without changing manifests allowed the full suite to pass.
  - TypeScript checks are not clean on the current base: `npx tsc --noEmit` reports existing errors across test/site files; the focused census check is blocked by the missing `edtf` declaration in `scripts/lib.ts`. No census-file diagnostics were reported.
  - Phase 0 commit `cc2131d308` was merged with refreshed `origin/main` `5fb35c65cf` as `f6a40029b8`; incoming changes did not overlap Phase 0 files. The census, validation and full test suite were rerun successfully after the merge.
  - A second `origin/main` refresh found 20 more non-overlapping Tabari content commits through `92a16a26c1`; they were merged as `a6039695d1`. The census and validation passed again, and the full suite passed (19 files, 323 passed, 1 skipped) on this latest tree.
  - Next step: refresh `origin/main` once more before pushing, then open the Phase 0 PR and merge it after CI passes.

## Current state

- Phase: 0 — planning.
- Branch: `inventions/p0-copilot`.
- Merged batches: none.
- Downloads: none.
- Schema/API/site changes: none.
- Worker/workflow changes: none.
- Deployment: none; do not deploy.
- Local gates: census, validation, tests and whitespace check pass; repository-wide TypeScript check has the existing failures noted above.

## Flags

- Urdu wording is a draft and needs native review where the source phrasing is difficult.
- Each record needs a compliant hero image and a diagram; no record is counted complete without them.
- Identity, tradition, attribution and dates remain leads until the cited evidence is read.
