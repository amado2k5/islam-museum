# Muslim Inventions Browser: phases and batch gates

## Standing mechanics

- Branches: `inventions/p0-copilot`, then `inventions/p1-copilot`, `inventions/p2-copilot`, and `inventions/p3-b<nn>-copilot`.
- Queue is the source of truth; each lead has state, chronological era, domain, batch, origin and lead sources. Record exclusions with a reason and citation.
- Phase 3 uses ten inventions per PR, ten batches per wave of 100, never more than 25 content entities per PR. An invention's data and three prose files ship together. Include new/updated source and media records within the limit.
- Before each push, fetch `origin/main`, inspect incoming commits and every overlapping file, then three-way merge/rebase without dropping concurrent work. Use explicit paths; never force-push or deploy.
- Every commit has truthful `AI-Agent`, `AI-Model` and `AI-Editor` trailers plus the required co-author trailer. Every record has matching provenance.
- Every entity/stub/edge batch regenerates `docs/coverage.md` with `npm run coverage`; every invention batch regenerates `docs/inventions/coverage.md`.

## Phase 0 — census and plan

Create the companion plan, machine-readable taxonomy, candidate seed slate, D-000 and local decisions, census script/report, lane/status entries, log ignore, canary entry and external harvest directory. Record census counts against the fetched base. Validate, test, open a PR and merge. Phase 0 is complete only after merge; merged is not live.

## Phase 1 — schema and static API

Implement the `invention` class, enum values, ties, predicates, validator/graph rules, generated schema, tests and static API routes described in [`schema.md`](./schema.md). This is `submission-impacting`. D-000 grants advance sign-off for exactly the scoped class/enums/predicates/ties/API; add the claims-register and evidence-map updates in the same commit. Run validate, tests and build; probe invalid examples; PR and merge.

## Phase 2 — research and queue

Read museum leads first, then the approved resources and relevant literature in [`research.md`](./research.md). Build the candidate queue to at least 400 before the first writing batch. Open at least five new independent sources, register them before citation, and record each source access date. Verify maker identity/tradition, original/improvement/transmission/discovery status, earliest attestation, date, place, primary text, surviving examples and image lead. Order by era and first attestation; within each era distribute across domains. Keep contested and legend candidates visible; do not fill counts by weakening the inclusion rule.

## Phase 3 — content waves

Ten items per batch, ten batches per 100. Start with the oldest supported candidates. Every item has sourced Arabic-first data and trilingual prose, defined source references, provenance, all relevant graph ties, a hero image and a diagram; add a map whenever spread exists. Use sources to set dates and attribution, not the queue's provisional labels. The first wave must include the honesty shelf (at least one contested/legend item) without treating its claim as settled.

Batch gate: `npm run validate` with literal `0 errors`; `npm run cite-check -- <ids>` with literal `0 fail`; `npm test`; `npm run build` where applicable; regenerate both coverage reports; inspect exact changed paths; update `progress.md` and `.inventions-logs/copilot.log`; commit and PR. Each 100-item report lists merged PRs/commits, counts, exclusions, test output, remaining flags and founder deployment instructions.

## Phase 4 — site after 30 inventions

Build the static home, record page, strips, search/discovery and JSON exports from [`site.md`](./site.md). Check Arabic/English/Urdu, RTL, no-JS, accessibility, page weight and browser rendering. No Worker or deployment workflow changes; the founder deploys manually.

## Phase 5 — continue to the stop condition

Continue the 100-item waves and add leads continuously. Stop only when (1) the queue is empty and two further discovery passes, with at least five new sources read, add nothing that passes inclusion; (2) a blocking reserved-area/licence/merge flag prevents every remaining item; or (3) the machine cannot continue after freeing harvest cache and retrying once. State the stop reason and exact next step in the last progress entry.
