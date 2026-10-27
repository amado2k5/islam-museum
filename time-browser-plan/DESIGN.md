# Islam Museum Time Browser: design (DRAFT for founder approval)

Status: draft. Nothing here is committed. Two prompts follow in `PROMPT-CLAUDE.md` and `PROMPT-DEVIN.md`.

## 1. Confirmed decisions
- Name: Time Browser (EN). Arabic: متصفح الزمن. Urdu: ٹائم براؤزر (proposed; needs a native Urdu reviewer before publishing). Verb: time browsing.
- Record types: all record types, not only events. Each record shows its type (event, person, place, polity, period, theme, work, concept, practice).
- Status: records are shown with a visible "draft" label when `status.review` is `draft`, so the timeline is complete and honest.
- Subdomain-ready: all data URLs and links are built from one base-URL constant, so moving to a subdomain later is a one-line config change, not a rewrite.
- Launch batch: 50 records per type. Each later batch is requested in chat ("add 50 more" or "add 50 more of <type>"), and the batch is run by the agent and logged.
- Logging: every agent writes its run log to a git-ignored file (`.time-browser-logs/<agent>.log`, one line per step: time, phase, action, result, next). When the founder asks for status, the agent reads the tail of the log and reports what was last done and what remains.
- Full viewport, no page scroll. Scroll only inside a panel. Main-site theme, light and dark.
- Mobile first. Phone: bottom timeline strip plus bottom sheet. Tablet and desktop: timeline across the bottom, detail panel on the side.
- Zero runtime AI. No model calls, no generation, no telemetry. Historynavigator's Gemini, voice, video and telemetry code is not ported.
- Search only covers prepared records (the Time Browser index). Anything else gets a "not in the Time Browser yet" message and then normal site results.
- Images and maps are prepared at build time or in the harvest step, never on demand.
- Deploy: static files on the main site, large data on R2. Deploy is the founder's action only (AGENTS.md).

## 2. Where it lives
- Route: `/<lang>/time-browser/` plus `/<lang>/time-browser/<kind>/<slug>/` for deep links.
- Data: `/time-browser-data/<lang>/index.json` (search index and topic list) and per-topic JSON, served from the same origin. If the file count exceeds the Pages limit, move the JSON to R2 and keep only the HTML on Pages (decided in phase TB0).
- Subdomain: not recommended unless TB0 shows the data cannot fit on the main site.

## 3. Content model (one record per stop)
Each stop is a prepared record:
`{ id, kind, date (EDTF + Hijri + calendar + precision), title, summary (ar, en, ur), href, sources[], image?: {id, alt, credit, licence}, map?: {id}, kids?: text, perspectives? }`

Rules: a record enters only when its source entity is `review: published` and has sources (decision D6, to confirm). Urdu missing → show Arabic with `lang="ar"`, never machine translation.

## 4. Images and maps (reuse first)
1. Inventory existing images in `architecture` and `art` (and whitelisted illustrations under `schema/enums/licenses.yaml`).
2. Match each image to items by tags, place, period and date range. One image may cover many stops within the same period and place; if two adjacent stops would show the same image, show it once.
3. Target: one image per 10–20 stops where a match exists. Where none exists, use a generated SVG card with the period colour and the place name (no AI).
4. Maps: small SVG maps are rendered at build time from `basemap-world.json` / `basemap-mena.json` plus coordinates. One map per place cluster, reused.
5. No figurative depiction of prophets or Companions. No AI portraits.

## 5. Search and discovery
- Pagefind over the Time Browser records only, per language.
- "Navigate today" button on the landing page, right after today's date. Opens at a random prepared event, with a short hint on how to search on the first visit.
- On each event, place, person and prose page that is in the Time Browser: a visible button above References, "Time-browse this" (text to be agreed in three languages).
- "What do we offer" page: all features, how to use them, screenshots, in ar, en, ur.

## 6. Phases (each deployable on its own, none breaks the site)
| Phase | Content | Deployable alone |
|---|---|---|
| TB0 | Decisions D1–D6, file-count measurement, Pages vs R2 choice, lane file | yes (docs only) |
| TB1 | Build pipeline: `scripts/time-browser.ts` writes records and JSON from `.cache/graph.json`; schema; tests | yes (no UI) |
| TB2 | Image and map inventory and build step: match, SVG cards, maps; reuse report | yes |
| TB3 | Static pages, no-JS list version, Pagefind index, i18n keys ar/en/ur | yes (no menu entry) |
| TB4 | Interactive timeline: strip, detail panel, keyboard, search, mobile sheet | yes (behind route only) |
| TB5 | Entry points: landing button, "time-browse this" buttons on entity pages, "what we offer" page | yes |
| TB6 | Historynavigator upgrade in its own repo: a clean, modern client that reads the same JSON (no AI) | separate repo |
| TB7 | Ongoing: harvest and transform more records into the format | content only |

## 7. Concurrency and lanes
- Claude owns: `scripts/time-browser*`, `site/src/pages/[lang]/time-browser/`, `site/src/scripts/time-browser*`, `schema/time-browser*`, its own docs section.
- Devin owns: the historynavigator repo (TB6) and, in islam-museum, the image and map inventory scripts under `scripts/time-browser-media*` (TB2). Devin does not touch `site/src` (Claude's lane).
- Shared files (`docs/status.md`, `schema/enums/*`, `nav`/landing files) are append-only and touched in TB5 only, by Claude, after Devin's PRs are merged.
- Each agent: rebase on `origin/main` before every push; PR every ~15 minutes of work; merge its own PR once validate passes (AGENTS.md section on PRs).

## 8. Decisions recorded
1. All record types shown; drafts labelled.
2. Main site path now; base-URL constant keeps a subdomain possible later.
3. Names: see §1.
4. Launch: 50 per type. Further batches on request: "add 50 more" (all types) or "add 50 more of <type>".
5. Logging: every run appends to `.time-browser-logs/<agent>.log` (git-ignored). On request the agent tails the log and reports the latest step and what remains. Progress is also a PR comment at each merge.

Still open: the Urdu name needs a native reviewer. Exact batch counts per type are set in the first batch PR.

## 9. Status notes (append only)
- 2026-10-27, Claude (TB0): lane doc `docs/agents/lanes/time-browser.md` added. Prose counts per class and language are recorded there. `theme` has 0 records in `content/` and `data/`, so the theme launch batch needs preparation before TB1. Devin: do not assume theme records exist when wiring media.
- 2026-10-27, Claude (TB0): **Pages vs R2 is still open.** The launch JSON (about 30 to 40 files) fits on Pages, but the founder has not yet recorded the choice in §8. TB1 writes to the Pages output path until then. Devin: keep media ids independent of the JSON location.
