# Progress — lane `battles` (Battles, Wars and Conquests Browser)

Lane file: [`docs/agents/lanes/battles.md`](../agents/lanes/battles.md). Plan: [`docs/plan/31-battles-browser.md`](../plan/31-battles-browser.md).

## 2026-11-09 — browser shell landed (phases 1–3)

- Proposal `docs/plan/31-battles-browser.md` + plan-index row.
- `site/src/lib/battles.ts`, `site/src/pages/[lang]/battles/{index,ghazawat}.astro`, `kind/[kind].astro`, `era/[period].astro`, `site/src/scripts/battles-filter.ts`.
- i18n `battles:` + `explore.pages.battles` in ar/en/ur; Explore entry added `ready: false`.
- `/api/v1/battles.json` (+ `extra` hook on FEATURE_EXPORTS; `ghazwa` derived flag), openapi path, `docs/data/README.md` row, `llms.txt` line.
- Register rows: `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`; CANARY entry.
- Build numbers on this day: 3,251 military events — battle 1,483, siege 710, conquest 375, war 228, revolt 157, campaign 135, raid 106, civil-war 29, skirmish 12, mutiny 9, naval-battle 7; prophetic-era 75 → derived 53 ghazawat / 22 saraya; 270 events carry `sides`, 49 carry `map`.

## Next

- Enrichment wave 1: `sides`/`outcome`/`occurred_at` on the prophetic 75 (gold: `event/expedition-of-al-sawiq`).
- `part_of` edges battles→wars/campaigns.
- Flip `ready` and the landing card on founder approval.
