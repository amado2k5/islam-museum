# Battles, Wars and Conquests Browser — requirements and production acceptance test

«متصفح الغزوات والحروب والفتوحات» — the museum's browser over every military-kind `event` record in the graph. Plan: `docs/plan/31-battles-browser.md`. Lane: `docs/agents/lanes/battles.md`. Implemented in `site/src/pages/[lang]/battles/`, `site/src/lib/battles.ts`, `site/src/scripts/battles-filter.ts`, `scripts/export-api.ts`.

This file is the acceptance spec: each numbered requirement states what must be true, how to check it against the production site, and what the expected result is. Any agent or reviewer can run the checks verbatim. Numbers marked *(derived)* are computed from the graph at build time — the exact figures below are the values at implementation (9–10 November 2026, 3,251 records); they will only grow as the enrichment lane adds records, so test against *at least* those values, or better, against the numbers the graph build reports.

Base URL for checks: `https://islam.museum` (or the current production domain).

## 1. Pages exist and render in all three languages

- **R1** The landing page exists at `/{lang}/battles/` for `lang ∈ {ar, en, ur}` and returns HTTP 200.
  `curl -sI https://islam.museum/en/battles/ | head -1` → `200`. Repeat for `/ar/` and `/ur/`.
- **R2** The ghazawat page exists at `/{lang}/battles/ghazawat/` for all three languages.
- **R3** A kind page exists at `/{lang}/battles/kind/<kind>/` for each of the eleven military kinds — `battle, siege, conquest, war, campaign, raid, revolt, civil-war, skirmish, naval-battle, mutiny` — in all three languages (33 URLs).
- **R4** An era page exists at `/{lang}/battles/era/<period>/` for each era row shown on the landing page, in all three languages. The era list is derived from the graph *(derived)*: 13 periods at implementation time.
- **R5** Every card/row on every battles page links to a canonical entity page `/{lang}/event/<slug>/` — never to a battles-local record page. There is no second dataset and no `battle/` class.

## 2. Landing page content

- **R6** The landing page shows the prophetic section with two groups: غزوات (ghazawat — engagements the Prophet led in person) and سرايا (saraya — expeditions he sent). *(derived)*: 53 ghazawat and 22 saraya at implementation. The split is **derived from graph edges** (`had_participant`/`sides` on the prophetic-era records), not a data field — a record newly given the correct edges moves groups automatically on the next build.
- **R7** The landing page shows one tile/row per military kind with its record count, and one row per era with its record count. Every tile links to its R3/R4 page.
- **R8** Total records across all kind tiles equals the API count (R12): *(derived)* 3,251 at implementation.
- **R9** The landing page is indexed for site search: its HTML carries `data-pagefind-body` around the title, lede and headings.
- **R10** The page is fully readable with JavaScript disabled: headings, sections, counts, and all links are in the HTML. The kind/era filter script (`site/src/scripts/battles-filter.ts`) is progressive enhancement only.

## 3. Kind, era and ghazawat pages

- **R11** Each kind page lists every record of that kind as a card with at least the record's name and date; cards link to `/event/<slug>/`. Each era page lists every military record in that period. The ghazawat page lists all *(derived)* 75 prophetic-era records, grouped ghazwa/sariyya.

## 4. API

- **R12** `GET /api/v1/battles.json` returns 200 with a JSON array of all military records — *(derived)* 3,251 items. Each item carries the record's id, trilingual label, kind, and a boolean `ghazwa` flag; exactly the 53 prophetic ghazawat are flagged `true` at implementation.
  `curl -s https://islam.museum/api/v1/battles.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items), sum(1 for i in items if i.get('ghazwa')))"` → `3251 53` (or more, as enrichment lands).
- **R13** The endpoint is documented in `site/public/openapi/v1.json` (a `/api/v1/battles.json` path entry), listed in `docs/data/README.md`, and mentioned in `llms.txt`.

## 5. Navigation and discovery

- **R14** The Explore menu and landing cards contain the browser's entry in all three languages. **Status note:** the entry ships `ready: false` («قيد الإعداد») until the founder flips it — until then it must render but stay visibly marked not-ready, per the site convention for in-the-making browsers. After the flip it must be a normal link.
- **R15** The browser is registered in `docs/site/browsers.md` (row with routes, plan link, counts), `docs/status.md`, `docs/agents/lanes.md` (+ `lanes/battles.md`), and `docs/plan/31-battles-browser.md`.

## 6. Record-level rendering (what a military event page must show)

- **R16** A record with `sides` shows its belligerents (participants/commanders) on `/{lang}/event/<slug>/`.
- **R17** A record with an `occurred_at` edge to a coordinate-bearing place plus a `map` block renders its locator map (kind-matched, `event_point` feature, cited source, `date_for_borders` when the event has a usable year).
- **R18** A record with a `during_reign` edge shows its reigning-sovereign context.
- **R19** Records with none of those fields still render a complete card — name, date, summary — in the browser listings. Sparse records are never dropped from listings.

## 7. Graph and content rules the browser must obey

- **R20** Graph-backed only: all listings come from `event` entities whose `kind` is in the eleven-kind set (`MILITARY_KINDS` in `site/src/lib/battles.ts`). No side table, no second graph.
- **R21** Arabic first: `label.ar`/`summary.ar` on every record; all three languages render.
- **R22** Content safety: records involving blocked organisations are never enriched to name them; the hard-block validator (`scripts/check-extremism.ts`) stays at 0 errors.
- **R23** Provenance: every enrichment wave cites defined sources; nothing is invented to raise coverage.
- **R24** Gates green: `npm run validate` (0 errors), `npm test` (all pass), `npm run build` + `scripts/check-site.ts` (0 errors) on any commit touching the browser.

## 8. Data state at implementation (regression baseline)

| Metric | Value (10 Nov 2026) | Check |
|---|---|---|
| Military `event` records | 3,251 | `battles.json` item count |
| Prophetic ghazawat / saraya | 53 / 22 | landing page group counts; `ghazwa` flags in API |
| Military kinds | 11 | kind tiles on landing |
| Era periods | 13 | era rows on landing |
| Records with `sides` | ~1,500+ and growing | entity pages show belligerents |
| Records with `occurred_at` | 2,363 (71%) | — |
| Records with `map` blocks | 2,325 (70%) | entity pages show locator map |
| Records with `during_reign` | backfill started (~36 edges); most remain unfilled by design | — |

## 9. Known open items (not defects)

- Explore entry stays `ready: false` until the founder flips it (R14).
- ~1,700 records still lack `sides` (mostly draft cards without participant edges); the enrichment lane continues — they must still appear in listings (R19).
- Full end-to-end `npm run build` is ~3.5 h on CI; the browser pages all compiled and `check-site` is the gate that reports footnote/link defects.
