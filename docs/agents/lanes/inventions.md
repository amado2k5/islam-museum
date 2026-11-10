# Muslim Inventions Browser lane

The lane builds the Muslim Inventions Browser under the approved scope in [`docs/inventions/README.md`](../../inventions/README.md). The first phase is planning and census; the schema/API work is explicitly submission-impacting and scoped by D-000 in [`decisions.md`](../../inventions/decisions.md). Later content remains subject to the museum's source, publication, inclusion and change-gate rules.

## Scope and files

- Plan, queue and progress: `docs/inventions/`.
- Census: `scripts/report/inventions-census.ts`; generated snapshot: `.cache/inventions-census.json`; generated lane coverage: `docs/inventions/coverage.md`.
- Future class records: `data/invention/`; trilingual prose: `content/{ar,en,ur}/invention/`.
- Source entities, media, ties and stubs are created only as the research requires them; a lane-owned stub file, if needed, is `data/_stubs.d/inventions.yaml`.
- Research downloads and OCR: `/Volumes/exmicroSD/islam-museum-harvest/inventions/<source-slug>/`, never Git.
- Phase 4 site work: only after 30 sourced invention records, as mapped in `docs/inventions/site.md`.

## Batch order

1. Phase 0 census, taxonomy, initial queue, decisions and companion plans.
2. Phase 1 submission-impacting class, enums, graph predicates, validation, tests and static API; update both outreach evidence files in the same commit.
3. Phase 2 internal leads, source reading and a queue of at least 400 verified/triaged candidates, ordered chronologically and broadly by domain.
4. Phase 3 ten-record batches, ten batches per 100-record wave, each with Arabic-first data/prose, English and Urdu, citations, provenance, image, diagram and applicable map.
5. Phase 4 static browser after 30 records; Phase 5 continues research and publication until the defined stop condition.

## Research priority

Use the museum's scientific people, concepts, events, objects, works and prose first. Tier-A reference paths include the relevant EI2/EI3 and DİA entries, the primary invention text or patent, and the specialist scholarship listed in `docs/inventions/research.md` (Hill/al-Hassan, Rashed, Sezgin, King, Saliba, Savage-Smith/Pormann, Watson/Decker, Bloom and Hillenbrand). Popular starting resources are leads only.

## Overlap warnings

- Reuse existing graph IDs; do not clone people, works, concepts, objects, places, sources or events.
- Person, work, object, event, place and concept files are shared with other lanes. Add only a sourced `inventions:` block or other specifically approved field; preserve all concurrent changes and never overwrite unrelated work.
- Modern figures require the two-independent-source faith basis in `docs/agents/lanes/modern-figures.md`. Historical figures follow the explicit Sunni-default/disputed-tradition rule in `docs/inventions/taxonomy.yaml`.
- Never edit reserved areas, licenses, media policy, source policy, deployment files or worker routes without the required separate approval. This lane never deploys.
- Every image must be an existing compliant media record, a verified free-to-use asset or an illustration that passes the museum pipeline. No portraits of prophets or Companions and no AI portraits.

## Progress and handoff

The live next step and flags are in `docs/inventions/progress.md`; the detailed per-step log is `.inventions-logs/copilot.log`. Branches follow `inventions/<phase>-copilot`, with `inventions/p3-b<nn>-copilot` for content. Every commit uses explicit paths and the required attribution and co-author trailers. Refresh `origin/main` and three-way merge before each push. Merged does not mean live.
