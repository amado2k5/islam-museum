# Phase 13: Graph health loop

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Turn the census into standing work: orphan adoption, thin-edge thickening, wing-to-wing bridges. This phase never finishes; its cadence is part of the plan.

## Source corpora and access

- The built graph (`.cache/graph.json`, produced by the build) for the authoritative census. The `data/` and `content/ar/` textual proxy (README section 2.6) for a quick check.

## Size estimate and derivation

Standing. Current proxy: 32,007 of 44,220 entities (72%) without textual inbound reference. The authoritative census is produced by the build; its size is set when it runs (Phase 0's proxy is not used for targets).

## Entry criteria

- Built-graph census produced (a check, not a deploy).
- Founder decision 7 (cadence, below).

## Exit criteria (definition of done)

- Census reported per class and wing.
- Each batch closes orphans or thickens edges with a cited source.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Cadence: one graph-health batch after every three waves of other phases; the census reruns at the same cadence. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Runs alongside all phases; contends lightly with all of them.

## Known risks

- Forced links: an edge is added only where a source states it. Never link to fill a count.

## Founder decisions needed before this phase starts

- Cadence confirmed by the founder (README decision 9).
