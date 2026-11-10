# Lane: `khulafa` — the Khulafa Browser

Plan: [`docs/plan/30-khulafa-browser.md`](../../plan/30-khulafa-browser.md) (approved by the founder in chat, 9 November 2026).
Progress file: [`docs/delegation/khulafa-progress.md`](../../delegation/khulafa-progress.md).

## Scope

- The roster `datasets/khulafa-roster.csv` (~160 rows): every caliph a `person` record with `roles: [caliph]`, a cited `story_roles` reign (`ruler`/`rival-claimant`, `toward` its caliphate `polity`), `ruled_over` and `successor_of` edges.
- Polities: 8 existing + `zubayrid-caliphate`, `hammudid-caliphate`, `abbasid-caliphate-cairo`, `sharifian-caliphate` (created).
- The browser `/[lang]/khulafa/` + `/[lang]/khulafa/<slug>/`, `site/src/lib/khulafa.ts`, `khulafa:` i18n blocks, `/api/v1/khulafa.json` + `chains.json`, register rows.
- `during_reign` edges (events, buildings, works, inventions → caliph) and `geo/polity/` extents in waves; trilingual caliph prose later.

## Done (9 November 2026)

- Phase 1: `during_reign`/`reign_saw` predicate, validator rule (reign toward caliphate ⇒ `caliph` role; Ottoman empire treated as a caliphate), `scripts/khulafa.test.ts`; caught `person/hasan-ibn-ali` missing the role.
- Phase 2: roster CSV; ~132 existing records patched; 30 new person records (Cordoba 6, Cairo 5, Ottoman 3, Sokoto 15, Sharifian 1); 4 new polities; succession edges.

## Next

- Phase 3 site rows land with the browser pages (in flight).
- `during_reign` edges from dated events/buildings/works in waves of ≤ 25, cited.
- `geo/polity/<slug>-<year>.geojson` schematic extents with sources, then the realm map.
- Trilingual `content/{ar,en,ur}/person/<caliph>.md` prose waves.

## Rules to remember

- ≤ 25 entities per commit; CANARY entry each commit; AI output `draft` + provenance.
- Contested accessions → `perspectives` (Sunni first, academic, then others), no verdict.
- Mouride "khalifas" and other non-caliphate `caliph` roles are not browser records.
