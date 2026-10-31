# Phase 14: Render-QA sweep

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Define and run a read-only crawl of the built site for raw `{cite:…}`, `(needs_source)` and related leak families, and file the defect list as a fix queue for the site lane. The sweep is analysis; fixes follow the normal site-change gates.

## Source corpora and access

- The built HTML (`npm run build` locally, under the site's gates). **Not the source.**
- Known defect: a raw `{cite:…}` leak on `/ar/concept/tawhid/` (29 October 2026).

## Size estimate and derivation

One crawl, sized by page count: the homepage shows 86,000 pages (read 31 October 2026, to be verified against the build output). Method cost: one crawl of the built output, with a grep per page for each leak pattern. Source counts for context: 24,999 Arabic prose files contain `{cite:` (valid markup), 320 contain `needs_source`, 231 contain `(needs_source)`.

## Entry criteria

- Founder decision 8 (authorise a local, read-only crawl).

## Exit criteria (definition of done)

- Crawl complete; every page checked for each leak pattern; counts recorded.
- Defect list filed as a queue for the site lane with each defect's page and pattern.
- No fix made in this phase.
- Validate 0 errors; the build passes locally.

## Lane mechanics

One sweep per large wave of other phases. The fix queue goes to the site lane under `docs/site/README.md`'s gates.

## Dependencies on other phases

- Depends on nothing; can run now.
- Re-runs after each large wave.

## Known risks

- False positives: legitimate text containing the same characters. The pattern list must be explicit.

## Founder decisions needed before this phase starts

- Decision 8.
