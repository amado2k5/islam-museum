# Lane `web-sources`: trusted and known websites as citation families

_Opened by an autonomous Devin harvesting agent on the founder's standing delegation (AGENTS.md, "Act as the human in the loop"), working the catalogue in `docs/agents/source-families.md` end to end: registered families, the Tier 1/2 onboarding order, the Tier 3 pointers, and scored new candidates._

## Scope

- Assess every family in `docs/agents/source-families.md` against its eight criteria; score each in `docs/delegation/web-sources-progress.md`.
- Route every onboarding/licence-posture/classification judgment through the decision engine (`docs/decisions/inbox/` → `scripts/decisions/decide.ts --batch --write` → record in `docs/decisions/records/`). Founder-reserved surfaces (deploys, deletions, spend, outreach, licence *changes*, review-status) are filed and left for the founder.
- Register accepted families completely, in one commit each: an entry in `scripts/harvest/sources.yaml` (licence, layer, method, limits), a `data/source/<family-id>.yaml` entity with a `reliability_note`, and a row in `docs/attribution.md`; move the family between tiers in `docs/agents/source-families.md`.
- Enrich existing museum entities with facts cited `{cite:<family-id> <anchor>}` — the anchor is the family's own stable identifier (site id, fiche number, object number, property number, document id). Facts enter `data/` in the museum's own words; family text and images are ingested only where the licence clearly allows it; NC families are facts-only, permanently.
- Politeness: identified User-Agent `islam-museum-harvest/0.1`, recorded pauses, robots and terms respected, stop and record on 403/429, no login or paywall circumvention, prefer structured endpoints (APIs, dumps) over page scraping.

## Files this lane touches

`docs/agents/lanes/web-sources.md`, `docs/agents/lanes.md` (registry row), `docs/status.md` (Parallel work row), `docs/delegation/web-sources-progress.md`, `docs/decisions/inbox/web-*`, `docs/decisions/records/dec-*` (engine output), `scripts/harvest/sources.yaml` (append entries), `data/source/<new-family>.yaml`, `docs/attribution.md` (append rows), `docs/agents/source-families.md` (tier tables), `data/**` and `content/{ar,en,ur}/**` only for additive citations/enrichment of existing records, `data/_stubs.d/web-sources.yaml` if ever needed, `CANARY.md`.

## Batch rules

At most 25 entities per content batch; `npm run cite-check` on batch ids before committing; `npm run validate` (0 errors), `npm test`, `npm run coverage` regenerated in the same commit when entities/stubs/edges change; conventional commits with `AI-Agent:`/`AI-Model:`/`AI-Editor:` trailers; branch `agent/web-sources*`; PR to the lane's base, self-merge when checks are clean.

## Overlap warnings

- `prose-fill-*` lanes own prose completeness for the same records: this lane adds **sources and facts** to `data/` records (additive `sources:` entries, dated claims, external ids), never rewrites their prose files.
- `ei2`, library and `wikidata-import` lanes cite books/Wikidata: a web-family citation is added alongside, never replaces, existing sources.
- `khutab-durus` owns sermon/lesson sites already in the harvest registry — this lane does not re-register them.
- Never cite a family whose decision record ended `founder-docket` or `rejected`; a `safe-default` hold means pointer-only use at most, recorded as such.

## Rules

`AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/workflow.md`, `docs/agents/content-standards.md`, `docs/agents/publication-standard.md`, `docs/agents/source-families.md`, `docs/agents/content-safety.md`, `docs/decisions/README.md`.
