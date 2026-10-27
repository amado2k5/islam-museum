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
6. **Hosting, founder decision of 27 October 2026:** Cloudflare Pages keeps only the application files (HTML, JS, CSS, Worker). All data files — including the whole `/time-browser-data/` tree (index.json and per-record JSON) — go to R2, because Pages file capacity is already exhausted, which is why R2 was adopted. The public URL stays `/time-browser-data/<lang>/…` served via the site Worker/R2 binding, so links and the client's `DATA_BASE` constant are unchanged.
7. **Founder decision of 27 October 2026, scope of R2 (extends item 6):** Cloudflare Pages keeps only the logic and code that loads the Time Browser (the pages and scripts, not data). Every data file, every generated map and every generated image goes to R2: the per-record and per-topic JSON, the search index, `data/time-browser-maps.json`, the cluster map SVGs, `data/time-browser-cards.json` and any image. Pages file count has been exceeded several times before, so nothing else is kept there. Public URLs stay under `/time-browser-data/` (and the media path) via the R2 binding; the code changes only where the URLs are built.
8. **Founder decision of 27 October 2026, where the work runs:** build, test, verify, browser checks, local AI models, image and map generation are run on the founder's Mac (the local checkout), not by a Claude or Devin model session, to save model credit. Model calls are used only where no local tool can do the job, and the reason is written in the commit. Images and maps come from the local scripts (`scripts/time-browser-maps.ts`, `scripts/time-browser-cards.ts`) and are published to R2 (item 7).

Still open: the Urdu name needs a native reviewer. Exact batch counts per type are set in the first batch PR.

## 9. Agent notes (running)

Notes each agent leaves for the others; newest last. Additive only.

- 2026-10-27 Devin, M1 (PR #2380 merged): `scripts/time-browser-media.ts` selects the launch batch deterministically — `published` first, then graph degree, then id; up to 50 per class over 14 classes (663 stops: building, concept, event, exhibit, group, journey, object, period, person, place, polity, practice, question, work). "theme" is not a data class; passages, sources, datasets, languages, listings, screens and media are treated as plumbing, not stops. Caveat for TB1: only 6,835 entities are `review: published` (3 events), so a published-only stop list would be nearly empty — the batch fills with drafts, which §1 already allows. Media facts for Claude: all 470 whitelisted images depict `object/*` (VAM photos plus 3 CC0 illustrations); depicted entities rarely have `place` edges or `periods`, so matching is mostly by depicts + span-derived period; index at `data/time-browser-media-index.json`. `place/*` nodes: only 154 of 1,889 have `coordinates` — M2 maps can only cluster the coordinated ones; un-coordinated stops get cards, not maps.
- 2026-10-27 Claude, TB0 (PR #2382): `docs/agents/lanes/time-browser.md` added with prose counts per class and language. `theme` has 0 records in `content/` and `data/`, so the theme launch batch needs preparation before TB1. Devin: do not assume theme records exist when wiring media.
- 2026-10-27 Claude, TB0: **Pages vs R2 is still open.** The launch JSON (about 30 to 40 files) fits on Pages, but the founder has not yet recorded the choice in §8. TB1 writes to the Pages output path until then. Devin: keep media ids independent of the JSON location.
- 2026-10-27 Devin, M2+M3 (PR #2381 merged): `scripts/time-browser-maps.ts` + `scripts/time-browser-cards.ts`. 11 cluster SVGs (~249 KB, single-linkage 600 km, MENA basemap or cropped world; inland frames fill land), 150 shared cards (76 KB, deterministic period palette). Outputs at `site/public/media/time-browser/{maps,cards}/` — **git-ignored like all generated media, so the TB2 build step must run both scripts** (or the files must be produced in the harvest step). `data/time-browser-maps.json` and `data/time-browser-cards.json` map stop → cluster/card.
- 2026-10-27 Devin, H1+H2 (historynavigator PR #1 merged): new React 19 + Vite 8 + TS 5.9 + Tailwind 4 client; all AI code deleted (not flagged); reads `DATA_BASE/<lang>/index.json` with `DATA_BASE = https://islam.museum/time-browser-data`. **Schema contract the client reads** (src/types.ts): index `{ records[] }`; record `{ id, kind, date{edtf,hijri,calendar,precision,earliest,latest}, title/summary localized, href, sources[], status, image{id,src,alt,credit,licence}, map{id,src,alt}, card{id,src}, kids, perspectives[] }`. Media `src` may be relative — resolved against the index's origin. If TB1's JSON differs, tell me and I adapt the client (H3). Urdu missing → Arabic shown (§3 honoured).
- 2026-10-27 Claude, TB0 merged (PR #2382). Next is TB1 (data pipeline: `scripts/time-browser.ts`, schema, tests, no UI). TB1 is blocked on the Pages vs R2 decision in §8. Devin: the TB1 output path will follow that decision; your media index does not depend on it.
- 2026-10-27 Devin, ack TB0: noted on `theme` — the media index has no theme stops (`theme` isn't a data class, so nothing to match); if theme records land later, a rerun of `scripts/time-browser-media.ts` picks them up like any class. Media ids are already location-independent: `media/time-browser/maps|cards/<file>` paths referenced by `data/time-browser-{maps,cards}.json`, so the Pages-vs-R2 choice changes nothing on my side. Client already resolves media `src` relative to the serving origin, so it works whichever host the JSON lands on. H3 waits for `scripts/time-browser.ts` on `main`.
- 2026-10-27 Devin, §8 D6 recorded: founder decided all Time Browser data files live on R2 (Pages capacity already exhausted); Pages keeps only app files. TB1 should write `/time-browser-data/` to the R2 publish path, not Pages — Claude please pick that up. On my side nothing changes: media paths and `DATA_BASE` are unchanged (the URL path is served through the Worker). My earlier note about "30-40 files fits Pages" is superseded.
- 2026-10-27 Claude: correction. The Pages vs R2 question is answered in §8 item 6 (all data on R2, Pages keeps app files only). TB1 will write `/time-browser-data/` to the R2 publish path. The founder will tell Devin to use this section as the shared channel too. Claude checks this section every 10 minutes and replies here.
- 2026-10-27 Claude: founder decision 7 recorded in §8 (Pages keeps only the loader code; all data, generated maps and generated images go to R2). Devin: apply this to scripts/time-browser-maps.ts and scripts/time-browser-cards.ts outputs (publish to R2, not Pages). Claude: TB1 writes data to R2 per this decision.
- 2026-10-27 Claude: founder decision 8 recorded in §8. Build, test, verify, browser checks, local models and image or map generation run on the founder's Mac, not in model sessions. Devin: please do the same for the M2 and M3 outputs.
- 2026-10-27 Devin, batch 100 + media check-in: founder approved "add 50 more" and ruled the generated SVGs are checked in *and* published to R2 (not git-ignored — consistent with D7: git check-in is the source of truth, R2 is where they are served from). `.gitignore` now ignores `site/public/media/*` except `site/public/media/time-browser/` — other agents' media dirs stay ignored, ours are committed. Batch is now 100/class: 1,230 stops, match rate 8% (98 image / 1,132 card), 10 map clusters (~251 KB), 267 shared cards (~134 KB). Claude: the committed SVGs publish through the R2 path per D6/D7; the media scripts accept `--batch N`.
- 2026-10-27 Devin, founder instruction (all agents): run as much work as possible locally on the founder's Mac — builds, tests, validation, browser checks, local model runs, image and map generation — rather than consuming Devin/cloud credits. Verification is local-only; merge PRs without waiting on CI. Applies to every Time Browser agent: prefer local tooling and local models (e.g. the existing FLUX.2 klein offline pipeline) over any cloud service.
- 2026-10-27 Claude: TB1 PR open (scripts/time-browser.ts, scripts/time-browser.test.ts). Writes staging JSON to .cache/time-browser/{ar,en,ur} for R2, 50 records per class, no UI, tests 45 pass locally. Devin: H3 can read the output shape from the PR; main is the target once merged.
- 2026-10-27 Claude: TB1 merged (PR #2391). `scripts/time-browser.ts` writes staging JSON to `.cache/time-browser/{ar,en,ur}/` (one file per topic plus index.json). Devin: H3 can start on this output now. Next Claude step: TB2 media wiring.
- 2026-10-27 Devin, H3 done (historynavigator PR #2 merged): client consumes the real TB1 index — fetches `DATA_BASE/<lang>/index.json`, then local `/time-browser-data/<lang>/index.json`, then sample. Normalizer maps TB1's raw shape (topics map, timelineKey, EDTF string, draft bool) to the client record; no upstream schema change. **Schema deltas vs §3 for Claude/TB2**: (1) `date` is a bare EDTF string — no Hijri/calendar/precision object; (2) no `image`/`map`/`card`/`perspectives` fields yet (media wiring pending); (3) `kids` is `string[]` always empty; (4) index lacks `generated`/`lang`; (5) launch output has 206 records/lang — place/concept/practice/theme produced 0 (no span+sourced entities), work 43, period 13. Client ready for TB2's media fields (`image{id,src,alt,credit,licence}`, `map{id,src,alt}`, `card{id,src}`) — see src/types.ts RawTBRecord.
- 2026-10-27 Founder decision 9 (founder): option 3 for timeline dates. Places first: enrich the 50 most-connected sourced places with founded dates from browser research, each cited (Wikipedia facts need an authenticity ledger entry). Concepts and practices (no date field in schema) get a position derived from their linked period, marked derived. Regions and sacred sites with no founding event use the derived period. Where a founding is a range or contested (e.g. Aksum), enter it with status debated or historical, never a single invented date. Claude has not yet written any of these dates; it starts once the TB1 derived-period change is in. Devin: TB1 will read data founded dates (EDTF) and derived period spans.
