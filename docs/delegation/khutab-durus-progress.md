# Lane `khutab-durus` — progress

Lane document: `docs/agents/lanes/khutab-durus.md`. Proposal: `docs/plan/25-khutab-durus-explorer.md` (approved by the founder, PR #2656, merged 31 Oct 2026).

## Next step

Phase 1 discovery continues (catalogue at `$HARVEST/khutab/catalogue.json`); then the first pilot batch of 15–25 items across eras, countries, formats and kinds. The founder is asked before any bulk download or transcription run, and shown the claims table of each source's first batch.

## Log

- 31 Oct 2026 — Worktree `~/Documents/GitHub/islam-museum-khutab`, branch `claude/khutab-durus-explorer`. Proposal PR #2656 merged. Schema landed: `work.kind: lecture`, `sermon_type` enum, `delivered`/`delivered_by` and `relies_on`/`relied_on_by` predicates, roles `khatib`/`imam`/`preacher`, work fields (`delivered`, `host`, `audience`, `occasion`, `ruler_at_time`, `book_studied`, `order`, `duration`, `delivery_date_status`, `consequence`, `reception`), validator rules + `scripts/khutab.test.ts` (6 tests). `delivered.by` added to the three existing `kind: sermon` works. Found while regenerating schemas: `_base.schema.json` on main carried `kids`, `did_you_know` and a region order `gen-schema.ts` could not reproduce (latent bug); restored parity in `gen-schema.ts` so regeneration is now lossless — reported here for the founder.

## Robots and terms (recorded per source before any bulk access)

- `ar.islamway.net/robots.txt` (read 31 Oct 2026): open to crawlers except `/phpAdsNew/`, `/openx/`, `*/poster$`, `*/qr-code$` (Googlebot-Image) and `/bundles/viewers/pdfjs*`. Terms page still to be read before bulk download.
- `manaratalharamain.gov.sa/robots.txt` (31 Oct 2026): not retrievable via fetch; verify in the browser before use.

## Excluded items (reason, gate, override)

_ none yet _
