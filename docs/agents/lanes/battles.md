# Lane: `battles` — the Battles, Wars and Conquests Browser

Plan: [`docs/plan/31-battles-browser.md`](../../plan/31-battles-browser.md) (proposed and implementation begun on the founder's instruction, 9 November 2026).
Progress file: [`docs/delegation/battles-progress.md`](../../delegation/battles-progress.md).

## Scope

- The browser pages `/[lang]/battles/` (landing: prophetic expeditions, kind tiles, era rows), `/[lang]/battles/ghazawat/`, `/[lang]/battles/kind/<kind>/` and `/[lang]/battles/era/<period>/`; `site/src/lib/battles.ts`, `site/src/scripts/battles-filter.ts`, the `battles:` and `explore.pages.battles` i18n blocks, `/api/v1/battles.json`, and the register rows (browsers.md, status.md, plan index).
- Data enrichment of the military `event` records (the eleven kinds of plan 31 §1): `sides`, `outcome`, `casualties`, `occurred_at`, `part_of` edges battles→wars/campaigns, and newly mined engagements from the filed canon (al-Waqidi, Ibn Hisham, al-Raheeq, Futuh al-Buldan, Futuh al-Sham, Futuh Misr) — ≤ 25 records per commit, trilingual, draft-tier with provenance.
- No schema, class or kind changes: the records are ordinary `event` entities and the ghazwa/sariyya split is derived (plan 31 §2.3), never stored.

## Done (9 November 2026)

- Phase 1: `site/src/lib/battles.ts` (MILITARY_KINDS, `battleNodes`, `byKind`, `byPeriod`/`battlePeriods`, `isGhazwa`, `placeOf`, `commandersOf`, `parentOf`), the four routes, the filter script, the `battles:` + `explore.pages.battles` i18n blocks (ar/en/ur), the Explore entry (`ready: false` — «قيد الإعداد»).
- Phase 2: `/api/v1/battles.json` in `scripts/export-api.ts` (new optional `extra` hook on FEATURE_EXPORTS carrying `periods`, `themes` and the derived `ghazwa` flag) + openapi path + `docs/data/README.md` row + `llms.txt` line.
- Phase 3: this lane, the progress file, and the register/status/canary rows.

## Next

- Enrichment waves, ghazawat and saraya first: fill `sides`/`outcome`/`occurred_at` on the 75 prophetic-era records, then Rashidun conquests, then the rest by era — each wave ≤ 25, cited, trilingual.
- `part_of` edges: battles into their wars and campaigns (the war pages' battle lists are the computed inverse).
- New records only for real engagements missing from the graph; a duplicate becomes an alias of the richer entity.
- Battle maps stay with the illustrations lane (plan 16); the browser shows the `map` flag the records already carry.
- Flip `ready: true` on the Explore entry when the founder approves.

## Rules to remember

- Describe, never glorify; casualty figures carry `status` and a source; colonial and civil-war records keep neutral phrasing; no blocked organisation is ever named (`docs/agents/content-safety.md` — the hard block is checked by `npm run validate`).
- Dates: EDTF + Hijri string + precision; never invent a date. No honorifics. Arabic parentheses isolated (U+2066/U+2069). AI prose stays `status.review: draft` with provenance. CANARY entry each commit.

## Acceptance

`docs/engineering/20-battles-browser-requirements.md` is the testable spec for this browser — run its checks on production to validate the work of this lane.
