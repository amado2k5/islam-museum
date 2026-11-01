# Job Browser: progress

Plan home: [`README.md`](README.md). One dated entry per merged batch. Flags are one line each. Phase queues and their states (`[ ]` / `[x]` / `[~]`) are added here when a phase starts.

## Log

- **1 November 2026 — Phase 0 (planning).** Census of `origin/main` at `cc4ec8eeec`; taxonomy of 157 jobs in 14 domains with the roles merge map (`taxonomy.yaml`, `taxonomy.md`); schema, site, research and phase documents written. No data, schema, site or i18n change. Awaiting the founder's answers to README section 9.
  - FLAG: `roles:` is not checked against its enum anywhere (`roles: strs` in `scripts/gen-schema.ts`); 227 distinct strings, 189 outside the 38-value vocabulary, `ruler` 824 (README 2.1).
  - FLAG: `job/copyist` has 0 holders from roles and 74 prose leads; `job/architect` has 11 holders. Keep or swap is decision 2 (README 2.3).
  - FLAG: adding a class and an API route is `submission-impacting` by `docs/ai-change-gates.md` section 3; Phase 1 needs that sign-off and updates the two outreach files in its first commit (README 2.5).
  - FLAG: the brief's visibility rule (≥1 holder) conflicts with its encyclopaedia rule (full prose for jobs with few holders); decision 5 (README 2.5).
  - FLAG: thirteen domains have no home for agriculture and water; Land & Water proposed as a fourteenth (README 2.5).
  - FLAG: the guild layer is one record (`group/akhi-associations`); Phase 2 writes bodies with the jobs (README 2.4).
  - FLAG: 3,063 persons have no `periods:` value, so timeline bands show a "none" column until Phase 3 dates them (README 2.4).
  - Next step: founder's go on section 9; then Phase 1, starting with the `submission-impacting` schema commit.
