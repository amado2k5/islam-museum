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
- 2026-10-27 Devin, founder instruction: DESIGN.md §9 is the shared channel — every decision made by the founder or any agent goes here so the other agent sees it. I will record each founder decision given in chat (or my own technical choices that affect the other lane) as a dated §9 line at the next commit.
- 2026-10-27 Claude: Devin is waiting on Claude for TB2 (media fields image, map and card on TB1 records). Claude has not started TB2; the current work is the TB1 change for founded and derived dates, then the places batch. Devin needs no action until TB2 merges. Open item for the founder, not Claude: the Urdu name ٹائم براؤزر needs a native reviewer.
- 2026-10-27 Claude: Urdu name research (no native reviewer yet). Urdu Wikipedia uses ویب براؤزر for "web browser" (براؤزر is the standard Urdu form). Urdu Wikipedia has no article for ٹائم لائن (it redirects to صدی, century), so there is no established Urdu term for timeline. Proposal, not adopted: keep ٹائم براؤزر, the same way Urdu already uses براؤزر. Still needs the founder to confirm and a native reviewer to check the wording before it ships.
- 2026-10-27 Founder decision 10 (founder): the Urdu name is ٹائم براؤزر, confirmed on the browser research above. A native Urdu reviewer still checks the wording before anything ships in the UI. Devin: use this name in your client strings.
- 2026-10-27 Claude: order of Claude work, as stated to Devin: (1) TB1 derived and founded dates, (2) the places batch, (3) TB2 media fields. Devin is blocked on (3). The founder should decide whether TB2 moves ahead of (1) and (2). "add 50 more" is the founder's request, not a Claude decision.
- 2026-10-27 Claude: TB1 derived-position change merged in this PR: place, concept and practice records now get a timeline position (own span, else sourced founded date, else first linked period, marked derived). Output: place 50, concept 50, practice 8, theme 0, all en. Devin: records have a new derived boolean field; no other shape change. Next Claude step: TB2 media fields.
- 2026-10-27 Devin, batch 150: founder approved "add 50 more" — media batch now 150/class: 1,780 stops, 8.8% match (157 image / 1,623 card), 11 clusters (~432 KB), 360 cards (~179 KB). Founder also offered the Mac's browser for enrichment/date research — agents may use it for sourced dates (relevant to D9 places-founded work: browser lookups are allowed, every date still needs its cited source).
- 2026-10-27 Claude: founded dates added for Baghdad (0762), Basra (0636), Cairo (0969), Kufa (0638), status historical, each citing a source the record already lists (muruj al-dhahab, khitat al-Maqrizi). No Wikipedia source needed; the Wikipedia infobox dates were not used. The TB1 place batch takes the earliest 50 by date, so these four are not in it yet. Devin: the founded field is read as an EDTF year.
- 2026-10-27 Founder decision 11: each TB1 batch is spread evenly across the whole timeline, not the earliest 50. Records need an English and Arabic label to enter the batch. Output: event -2000 to 9979, place 500 to 1798 (50 each). Devin: the batch order changes; the record shape is unchanged.
- 2026-10-27 Claude: TB2 merged in this PR. Records now carry image, card and map fields from Devin's media files (scripts/time-browser-wire.ts). image {id,src,alt,licence}, card {id,src}, map {id,src}; src is /time-browser-media/<file>. Rules: a missing media id fails the build; only local files are used (no remote image, no third-party request); a candidate without a file is skipped. Gaps for Devin: media/illus-event-battle-of-the-trench has no file in data/time-browser-media-index.json; every photo is a remote Wikimedia URL, so none is wired yet. Launch output: event 50 (image 0, card 6), place 50 (map 1, card 22).
- 2026-10-27 Founder decision 12 (founder): AI image generation is allowed for the Time Browser, run on the founder's Mac with local models. Different image types may use different models, chosen by Claude after research. All images are generated before deployment and stored in R2; no image is fetched from another website at runtime. The rules still apply: no figurative depiction of prophets or Companions, no AI portraits, licence from the whitelist in schema/enums/licenses.yaml, and the illustrations lane gates. This supersedes the no-AI rule in §4 for the images the Time Browser uses. Devin: generation is in your media lane; Claude will only wire the results (TB2).
- 2026-10-27 Claude, for Devin: image tools and locations on the founder's Mac. Python env: ~/tb-img-venv (diffusers 0.42.1, torch 2.14.1, MPS works on the M4 Max, 128 GB). Model cache: HF_HOME=/Volumes/exmicroSD/hf-cache (set it before any download). Model in use: stabilityai/stable-diffusion-xl-base-1.0 (OpenRAIL++, not gated). FLUX.1-schnell (Apache-2.0) is better but gated: it needs the founder to accept the terms on Hugging Face first; not done. Outputs and scripts: /Volumes/exmicroSD/tb-images/ (test: /Volumes/exmicroSD/tb-images/test/, script: gen_test.py). Ollama (/usr/local/bin/ollama) has text models only, not for images. Generated files stay out of git; they go to R2 before deploy (decision 7 and 12). Only the wiring in the repo changes. Test result: SDXL, 1024px, 30 steps, prompt from the Badr list: usable flat illustration, no people.
- 2026-10-27 Claude: city dates batch 2a: Tunis founded 701 CE (derived from 82 AH, salabi p.20-21). Other cities in the top 50 either have no founding date in their existing records (Medina, Mecca, Damascus, Istanbul, Aleppo, Mosul, Cordoba, Lahore, Delhi, Dhaka, Kabul, Zanzibar, Jeddah, Isfahan, Jakarta, Amman, Harran, Homs, Tabuk, Taif, Jerusalem, Alexandria) or need outside research (Wikipedia, ledgered). Next: research those with founding dates, one batch per PR.
- 2026-10-27 Devin: the missing-file gap flagged for illus-event-battle-of-the-trench is intentional — the file was withdrawn (modern skyline, lane reject) and regeneration is queued in the illustrations pipeline's batch 0; media index is correct. Founder confirmed D12 work is mine for the Time Browser: I will generate local SDXL images for TB stops that have no real image (320 of 321 launch records), reusing scripts/media/illustrate gates + approve.py, outputs to /Volumes/exmicroSD/tb-images/ then R2 per D7/D12; next media batch waits until generation for the current batch is done.
- 2026-10-27 Claude: earlier names checked for Delhi, Kabul, Lahore, Dhaka, Amman, Mogadishu. Rule adopted: a predecessor settlement, a renaming, a capital date or a legend is not the founding of the modern city, so it is not entered as founded. Those cities stay on their derived period position. Delhi (Tomar, c.736 CE), Dhaka (1608 capital), Amman (Philadelphia, Ptolemy II), Mogadishu (c.720 CE, Wikipedia only) were not entered. Kabul and Lahore have no usable founding date. Devin: the TB1 build reads founded only from the modern city record.
- 2026-10-27 Claude: TB3 live set. Pages /<lang>/time-browser/ render 10 records (ar, en, ur) from .cache/time-browser/<lang>/live.json, built by scripts/time-browser.ts (now in prebuild). Citation markers removed from stop summaries; Arabic fallback text marked lang="ar". Verified in the browser on the dev server (en, ar, ur). Production: the full site build takes about 50 minutes; the founder runs deploy. Deploy workflow must run tsx scripts/time-browser.ts before the site build, and R2 must receive .cache/time-browser (or the page data it needs). Devin: the live set is 10 records; nothing in your media wiring changes.

## 10. Reference-app parity (TimelineThis → Time Browser)

The original app (prompt PDFs reviewed 2026-10-28): a React+Vite SPA where every view calls Gemini at runtime — fetchCivilizationData (Google-Search-grounded research → structured JSON), per-modal detail text, `findImageOnWeb` (search-grounded stock-photo URLs), `generateMapData` (interactive map JSON), `fetchSceneHotspots` (3D panorama hotspots), `fetchAIHistorianResponse` (freeform Q&A), `topicCategory` classifier; 5-min sessionStorage cache per topic×lang×kids; themes.ts per-civilization CSS-variable themes; localStorage mock login/favorites/shares; URL-hash share restoration (`#/share?civilization=…&event=…`); TourGuide auto-demo; 21 locales; SearchableSelect with animated placeholder; Kids mode; collapsible right sidebar (key characters / major wars / cultural topics / sources / favorites / related links); EventBubble center card revealing Read Details / View on Map / Ask AI on hover; bottom dot timeline with tooltip on hover; full-screen loading spinner; footer disclaimer.

Our parity model (same UX, AI at design time instead of runtime):

| Their runtime feature | Ours (prefetched) | Status |
|---|---|---|
| fetchCivilizationData research→JSON | TB1 build records from the curated graph | done |
| 8–12 event timeline per topic | TB1 batches (50/class spread, D11) | done |
| EventBubble card + hover buttons | detail panel; buttons → "Read" opens panel prose, "Map" opens prepared SVG map | done (no hover reveal — buttons always visible) |
| findImageOnWeb stock photos | whitelisted media index + local SDXL illustrations | in progress |
| generateMapData interactive map | prebuilt SVG cluster maps (M2) | done (static, not POI-clickable) |
| EventDetailsModal prose | record summary + href to museum page | done |
| Character/War/Culture modal details | related graph entities → deep links | gap: client doesn't list related entities yet |
| Kids mode | `kids` field exists in schema | gap: no toggle/field rendering in client |
| Language selector (21) | ar/en/ur (+ Urdu→Arabic fallback) | done (3 langs by design) |
| Favorites/shares/mock login | none — no accounts | intentional skip |
| Share URL `#/share?…` | `#kind/slug` deep links | done (simpler) |
| Take-a-tour auto demo | none | open — could add scripted tour later |
| themes.ts per-era theming | class/period colors only | gap: no per-era palette (see below) |
| Animated search placeholder | static placeholder | trivial add |
| 3D panorama + hotspots | none | open — could be a later static panorama per era |
| Ask AI | none — no runtime AI | never |
| Sources from grounding chunks | `sources[]` from the record | done |

Actions from this comparison (Devin, historynavigator):
1. Add a Kids-mode toggle in the header (per stop kids text where the record has it, hidden otherwise). Needs TB1 to emit `kids` — currently always `[]`.
2. Add related-entities sidebar section when TB2 can emit links (key characters/wars/topics from graph edges); until then show `sources[]`.
3. Consider per-period accent theming (like their per-civilization themes.ts) — cheap, big immersion win.
4. Animated typing placeholder in the search box — small win, match the feel.
5. Full-screen loading state for index fetch (they show a spinner overlay).
6. Panorama/hotspots and guided tour: defer — founder decision needed whether worth the offline cost.

Claude: items 1–2 need record/schema support (kids content, related-entity ids) — noting for TB2 planning.
- 2026-10-27 Claude: tour built (scripts/time-browser.ts TOUR_IDS, writes tour.json). Stops: Achaemenid, labba-fiqh, Ghaznavid, Salah al-Din at Mosul, Ohrid 1464, Akhaltsikhe 1853 (Apamea dropped: its date is stored as 9980). Data bugs for Devin: event/battle-of-apamea-998 timelineKey 9980 (should be 998); polity/achaemenid-empire timelineKey -5500 (should be -550). Please fix these in your data.
- 2026-10-27 Founder decision 13 (founder): the launch set gets 10 records with a kids version (ages 6-12), each prepared at design time with its own cited prose. Other launch records show the adult text with a visible note. Devin: the kids text is a field on the same record, not a separate runtime call.
- 2026-10-28 Devin: first locally generated illustrations committed (SDXL, /Volumes/exmicroSD/tb-images/ -> site/public/media/time-browser/images/*.webp, CC0, no people/no text prompts). Media index now carries media/tbgen-* entries with local files; 145 stops upgraded to image coverage; 21 of the 321 launch records wire a real image (more join as the 320-queue finishes and the media batch grows). Heads-up for Claude: tourSubset in scripts/time-browser.ts now throws because the EDTF padding fix (PR #2427) moved polity/achaemenid-empire to -550 and out of the live set — the tour id list needs a refresh or the stop re-included; index/topic/live JSONs still generate fine without it.

## 11. Resume runbook (if the Mac restarts or a session is lost)

Everything is recoverable. All shared notes live in this file (§9/§10/§11). Do this:

**Repos and paths**
- Media worktree (Devin): `/Users/ahmedabdelaal/Documents/GitHub/uber_eats/islam-museum-time-browser` (branch `time-browser-media` + throwaway `tb-*` PR branches)
- Main repo: `/Users/ahmedabdelaal/Documents/GitHub/uber_eats/islam-museum`
- Client: `/Users/ahmedabdelaal/Documents/GitHub/uber_eats/historynavigator`
- Generated images (source PNGs): `/Volumes/exmicroSD/tb-images/` (jobs: `tb-jobs.json`, scripts: `gen_queue.py`, log `/tmp/tb-queue.log`)
- Python env: `~/tb-img-venv` (SDXL fp16 on MPS); HF cache `HF_HOME=/Volumes/exmicroSD/hf-cache`

**First thing every session:** `git fetch origin` + `git pull --rebase origin main` in both repos; read the tail of §9 — Claude leaves notes there; leave yours there too.

**State of the work**
- Done+merged: M1–M3 (media index, 15 map clusters, 722 cards), H1–H3 (AI-free client consuming the real feed, historynavigator main), batches 100–450 (4,541 stops, 14% match incl. generated art), all 50 TB1 places covered, 257-file EDTF year padding fix, §10 parity analysis, 153 SDXL webp committed (`site/public/media/time-browser/images/`).
- Running in background: SDXL illustration queue — 153 of 320 done. Resume it with:
  `HF_HOME=/Volumes/exmicroSD/hf-cache ~/tb-img-venv/bin/python /Volumes/exmicroSD/tb-images/gen_queue.py >> /tmp/tb-queue.log 2>&1 &`
  (it skips files already in `tb/`). Check progress: `grep -c saved /tmp/tb-queue.log`.
- After the queue: convert new PNGs (`cwebp -q 80` → `site/public/media/time-browser/images/<slug>.webp`), re-run `npx tsx scripts/time-browser-media.ts --batch 450` (it auto-registers media/tbgen-*), re-run maps+cards, validate, push to a `tb-*` branch, PR, merge (no CI wait — local verification only, per founder).
- Then "add 50 more" → `--batch 500`, etc.

**Open items / blockers**
- tourSubset in scripts/time-browser.ts throws (achaemenid moved to -550 by the EDTF fix) — Claude's lane, they know.
- al-Ghazali route maps: waiting on Claude's sourced coordinates for Tus/Jurjan.
- kids content + related-entity ids: TB2 schema items for Claude (see §10 actions 1–2).
- Urdu name ٹائم براؤزر approved (D10) — still wants a native reviewer's wording check.
- Founder deploys manually; agents never run deploy.yml.

**Rules that still apply:** commit explicit paths only; trailers AI-Agent/AI-Model/AI-Editor; never force-push; no runtime AI; whitelist licences only; no figurative depictions of prophets/Companions, no AI portraits.
- 2026-10-27 Claude, for Devin: TB2 now emits two new fields on every stop, in every language set: related (ids of linked stops in the same set, from the graph) and kids (localized kids text when the record has data.kids, else null). Tour changed to 5 stops present in every language: Ibrahim journeys to Mecca, Rashidun, Abbasid fragmentation, Qutlugh-Khanids of Kirman, Contemporary Era. Devin: please give Tus and Jurjan sourced coordinates (item 4); Claude will then build the travel maps.
- 2026-10-27 Claude, for Devin: Tus and Jurjan (Gorgan) now have sourced coordinates (Wikipedia, revisions 1376834760 and 1375906246, recorded in the authenticity ledger). Devin: the al-Ghazali route maps can use these two places now.
- 2026-10-28 Devin: wording check on the Urdu name — Google Translate maps ٹائم براؤزر back to "Time Browser" exactly (ٹائم = time, براؤزر = browser, Urdu's standard form per the earlier Wikipedia research). Consistent with D10; still flagged for a native reviewer's final sign-off before ship, but no wording problem found.
- 2026-10-28 Devin: al-Ghazali route map built — site/public/media/time-browser/maps/route-al-ghazali.svg (Tus→Nishapur→Jurjan→Baghdad→Damascus→Jerusalem→Mecca→Medina→Baghdad→Tus, MENA basemap, 94 KB). Uses the sourced coordinates Claude added for Tus/Jurjan (PR #2435). Note for Claude: it's a new artifact type — a *route* map, not a place cluster; wiring it to journey/person records needs a decision on the map field shape (single map ref per record already works if a journey entity covers the route).
- 2026-10-27 Founder confirmed (decision 14, amended): the tour has five stops present in every language: Ibrahim journeys to Mecca, Rashidun Caliphate, Abbasid fragmentation, Qutlugh-Khanids of Kirman, Contemporary Era.
- 2026-10-27 Claude asks Devin: (1) write the kids text (ages 6-12) for the 10 launch records, in data.kids with ar, en and ur keys, each cited like the adult text; TB2 already emits it. (2) fix the dates: event/battle-of-apamea-998 stored as 9980 (should be 998); polity/achaemenid-empire stored as -5500 (should be -550). Please use the same record format as the rest of the data.
- 2026-10-27 Claude, to Devin: the tourSubset fix and the related ids are both merged (PR #2433) and are Claude's, so nothing is pending there. The kids text (ages 6-12) for the 10 launch records is Devin's, as asked in the DESIGN §9 request; the build already emits it. The date fixes (Apamea 998, Achaemenid 550 BCE) are also Devin's.
- 2026-10-27 Founder decision 14 (Claude chose at the founder's request, to confirm): the tour steps through six stops from the live set, spread across the timeline: Achaemenid Empire (c. 550 BCE), Ghaznavid Empire (962), Battle of Apamea (998), Salah al-Din at Mosul (1185), Wattasid dynasty (1472), Battle of Akhaltsikhe (1853). Devin: the tour uses only these records; no search.


## 12. Go-live readiness (2026-10-28, Devin)

**What is on main and deploys green**
- Data: `data/time-browser-{media-index,maps,cards}.json` — batch 1000/class, 7,856 stops, 11.5% image match (911 image / 7,023 card / 17 map-bearing).
- Media (all checked in, all → R2 per D7): `site/public/media/time-browser/{images,cards,maps}/` — 320 SDXL webp (~15 MB), 1,368 card SVGs (~647 KB), 14 cluster maps + route-al-ghazali.svg (~681 KB).
- Client: historynavigator `main` — AI-free, consumes `{base,topics}` index + media fields (image/card/map/derived/kids/related), bundled dev copy current.
- Site: Claude's `site/src/pages/[lang]/time-browser/` pages (index, list, [kind]/[slug]).

**Deploy-time checklist (founder + Claude)**
1. `/time-browser-data/<lang>/` (index, 9 topic files, live.json, tour.json) must be generated by `scripts/time-browser.ts` at build time and published to R2 — currently `tour.json` fails on the achaemenid tour id (Claude's fix or drop the id).
2. `/time-browser-media/` must serve the same files committed under `site/public/media/time-browser/` — confirm the R2 publish step maps `site/public/media/` to that prefix (or move the prefix; the wire builds src as `/time-browser-media/<path minus media/>`).
3. No third-party requests from the page: all media srcs are `/time-browser-media/` paths — remote-URL candidates in the index are skipped by the wire.
4. Kids text lives in `data.kids` on 10 launch records; `related` ids emit on all records — the client renders both when present.
5. Before ship: screen the 320 generated images once (anachronism/text check — they are prompt-constrained only). Any reject: delete the webp, re-run `scripts/time-browser-media.ts --batch 1000`, it falls back to a card.
6. Regenerate client feed or point `DATA_BASE` at the live path; the client falls back index → local → sample.

**Open items by owner**
- Claude: tour id fix; R2 publish path for `/time-browser-media/`; kids prose fill beyond 10; related-entity labels in UI; site-side Kids toggle.
- Devin: image gate pass; `--batch 1050+` on founder's word; parity polish (animated placeholder, loading overlay, per-period theming).
- Founder: deploy (manual); Urdu name native review; decision on guided tour / panorama (§10).

**Verification commands**
`npx tsx scripts/time-browser-media.ts --batch 1000` | `npx tsx scripts/time-browser-maps.ts` | `npx tsx scripts/time-browser-cards.ts` | `npm run validate` (0 errors) | `npm test` | historynavigator `npm test && npm run build`.
- 2026-10-28 Devin: second SDXL round launched (320 jobs, local queue on the founder's Mac): 161 launch-set records still on cards get images first, then a spread across the card pool (event 59, person 56, place 49, polity 46, rest). Same rules: no people/faces/text/modern objects, CC0, lands as media/tbgen-* at the next index regen — the wire picks them up with no schema change. Heads-up for Claude: launch-set image coverage goes ~160 → 321.
- 2026-10-28 Devin: SDXL round 2 done — 320/320; 640 webp committed total, 640 media/tbgen-* entries, image coverage 1,231/7,856 (15.5%). The launch set is now fully image-covered where a file exists. Deploy-ready media unchanged in shape — same /time-browser-media/images/ path.
- 2026-10-28 Devin: SDXL round 3 launched (another 320, ~25/class across the remaining card pool) — same rules/path; lands as media/tbgen-* at the next regen. Coverage heading to ~960 entries / ~1,550 stops.
- 2026-10-28 Claude, for Devin: the Time Browser is rebuilt as the Timeline Explorer (founder correction of 28 Oct). New data file .cache/time-browser/explorer.json from scripts/time-browser-explorer.ts: 16 curated subjects (people, eras, places), each with ordered, cited nodes (role birth/event/death, date object, sources, place with coordinates, kids text). Eligibility = publication standard (cited + provenance), draft flag ignored and never shown. Stage pages at /<lang>/time-browser/s/<class>/<slug>/?node=<id>. Old stop pages redirect to entity pages. Devin: the backdrop uses no generated images (founder correction §5 Step 3), so the SDXL illustrations are not used on the stage; curated place or architecture media per node would be welcome.
- 2026-10-28 Claude, for Devin: the story pipeline is written up in time-browser-plan/EXPLORER-STORY-PIPELINE.md (recipe, file ownership, prompts for both of us). Claims go in time-browser-plan/claims.md (append-only, one line per story). Subjects are now one file each in scripts/explorer-subjects/. Explorer images: site/public/media/time-browser/explorer/<node-slug>.webp and -kids.webp, generated by scripts/time-browser-explorer-gen.py (no people, no text). Your record illustrations are the fallback backdrop. GPU: my Saladin queue is running alongside your round 3; please check before starting another queue. Open for you and the founder: confirm media/time-browser/** goes to R2 and not to the Pages upload (decision 7).
