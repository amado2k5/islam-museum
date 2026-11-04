# Lane: Time Browser

The Time Browser is a static, no-AI way to move through the museum by date: a timeline strip, a detail panel, and search over prepared records only. Design: [`time-browser-plan/DESIGN.md`](../../../time-browser-plan/DESIGN.md). Prompts: [`time-browser-plan/PROMPT-CLAUDE.md`](../../../time-browser-plan/PROMPT-CLAUDE.md).

## Scope

This lane owns:

- `scripts/time-browser*.ts`
- `site/src/pages/[lang]/time-browser/`
- `site/src/scripts/time-browser*.ts`
- `site/src/components/time-browser/`
- `schema/time-browser*`
- `docs/agents/lanes/time-browser.md` (this file)
- the time-browser section of `docs/site/README.md`

It does not own `scripts/time-browser-media*` (Devin's image and map inventory) or the historynavigator repository (Devin, TB6).

## Phases

| Phase | Content | Status |
|---|---|---|
| TB0 | Lane doc, log path, file counts, Pages vs R2 question | in progress (docs only) |
| TB1 | `scripts/time-browser.ts` builds records and per-topic JSON from `.cache/graph.json`; schema; tests; no UI | not started |
| TB2 | Wire Devin's media index; build fails on a missing media id; local Explorer image generation remains a separate predeployment pipeline | not started |
| TB3 | Static pages, no-JS list version, Pagefind limited to time-browser records, i18n ar/en/ur, axe and lychee | not started |
| TB4 | Vanilla TypeScript timeline, keyboard, search, JS ≤ 20 KB gzipped | not started |
| TB5 | Entry points: landing button, "time-browse this" on entity pages, "what we offer" page | not started |

Each phase is one PR, deployable alone, merged by the agent once Validate is green.

## TB0 measurements (2026-10-27, origin/main `06231354de`)

Prose files under `content/<lang>/<class>/` and data files under `data/<class>/`:

| Class | ar prose | en prose | ur prose | data YAML |
|---|---:|---:|---:|---:|
| event | 2,004 | 1,946 | 1,946 | 4,352 |
| person | 7,107 | 7,085 | 7,085 | 10,238 |
| place | 1,782 | 1,763 | 1,763 | 1,788 |
| polity | 106 | 106 | 106 | 180 |
| period | 13 | 13 | 13 | 13 |
| theme | 0 | 0 | 0 | 0 |
| work | 321 | 320 | 320 | 1,467 |
| concept | 2,005 | 1,873 | 1,862 | 2,019 |
| practice | 67 | 66 | 66 | 67 |

Notes:

- **Themes have no records yet.** The launch batch of 50 themes needs preparation before TB1 can ship them; the build must treat an empty type as empty, not as an error.
- **The launch batch is small.** 50 records per type across 9 types is 450 records; with three languages and one JSON file per topic, the output is on the order of 30 to 40 files for launch.
- The counts are file counts, not record counts after the draft and review filters, which TB1 will apply.

## Pages or R2 for the JSON (open decision)

The Pages file limit is far above the launch size, so Pages can hold the launch JSON. DESIGN.md §2 says the choice is made in TB0 and §8 says the founder's answer is recorded there, but §8 has no answer yet. **This decision is open and waits for the founder.** Until it is recorded, TB1 writes JSON to the Pages output path, and moving it to R2 later is a config change because all data URLs come from one constant (`TIME_BROWSER_BASE`).

## Progress

Append one line per merged PR, newest last:

- 2026-10-27 TB0 started: design confirmed on origin/main; counts measured; Pages vs R2 open for the founder.
- 2026-10-27 TB0 merged (PR #2382): lane doc with prose counts; DESIGN §9 notes for Devin. Next: TB1, blocked on Pages vs R2 (DESIGN §8).
- 2026-10-28 Timeline Explorer pipeline adopted (time-browser-plan/EXPLORER-STORY-PIPELINE.md); PR #2517 Mamluk story, range dates, --out job files, people check.
- 2026-10-28 PR #2518 Ibn Sina and Ibn Battuta stories.
- 2026-10-29 PR #2519 root data files (sitemaps, feed, llms, search synonyms, favicons) published to R2; this changes the Worker and workflow and needs a founder deploy.
- 2026-10-29 PR #2520 twelve person stories, 49 subjects in all; PR #2521 (69 backdrops) and #2522 (27 backdrops) merged after the people check.
- 2026-10-29 image queues on the founder's Mac: 113 backdrops for the 12 new stories, then 21 redo images; each batch is checked and shipped in its own PR; rules in EXPLORER-STORY-PIPELINE.md section 3a.
- 2026-11-03 Copilot wired five sourced place stories (Tabuk, Khaybar, Badr, Harran and Rayy), reusing 40 linked graph events. Added missing source/provenance metadata to four existing place records; no event facts or relations changed. Public Explorer build and citation checks pass. Images and browser verification remain pending until the active Cursor queue finishes.
- 2026-11-03 Copilot follow-up: completed 32 localized media records (64 adult/kids variants, 63 new files and one reused Battle of Ray adult image), screened all variants, and verified all five stories in Arabic, English and Urdu, including backdrop switching. `npm run validate`, `npm test` and `npm run build` pass; 158,072 pages checked with 0 errors and 2 unrelated warnings. PR #3301.
- 2026-11-03 Copilot: PR #3310 adds 20 place Explorer stories, reusing 148 eligible nodes across 142 existing events; all 60 Arabic, English and Urdu routes verified.
- 2026-11-03 Copilot follow-up: integrated main through PR #3323 and regenerated the graph, Explorer output and coverage. After the Ramla curation, the 20 stories contain 147 chronological stop occurrences across 141 unique events; all 161 unique place/event records pass citation checks and all 20 place records have provenance. Missing English or Urdu event labels follow the documented Arabic-language fallback. No new backdrops were committed because Explorer images are optional; the existing image fallbacks remain in use. The subject-aware location selector remains an Explorer-owner request in `time-browser-plan/DESIGN.md`; no owner-lane code was edited. Final validation/build and 60-route output checks are pending.

- 2026-11-04 Copilot SDK: founder authorized the next 40 subjects, implemented as 20 place and 20 person stories (40 separate claims; no duplicate subject definitions). The batch reuses 246 events for 303 chronological stops, adds Urdu metadata on all 40 subjects, restores missing record-level provenance on seven places and one existing migration event, and preserves existing dates and relations. Explorer output is 225 subjects / 2,165 nodes. Citation checks pass for 286 records; all 120 language routes returned HTTP 200 with headings and no page errors. Existing event-language and image fallbacks remain explicit; no new backdrops or reserved Explorer code changes. Final full build verification is in progress.
- 2026-11-04 Copilot SDK image-gate follow-up: ten new, full-size-screened local SDXL adult/kids backdrops replace five unsafe record-illustration fallbacks without modifying those legacy assets. The complete 132-variant screen also found five existing shared Explorer files with figures (four kids variants, one adult), owned by Cursor/Claude Code. Exact paths, introducing commits and the five newly affected subjects are recorded in `time-browser-plan/DESIGN.md`. This is a publication blocker; claims stay open, existing owner files are untouched, and the forty-story batch must not be called fully finished or merged as safe.
- 2026-11-04 Copilot SDK local verification complete at `82429eed42`: validation 0 errors; 286 citation checks pass; 19 test files / 318 tests pass; full build checks 158,324 pages with 0 errors / 2 warnings, 41 weight routes with 0 over budget, and writes 897 accessible books. All 120 built language routes pass HTTP/payload and browser checks with no page or console errors; desktop/mobile interactions and the new Fadak kids backdrop pass. Publication remains blocked by [#3350](https://github.com/amado2k5/islam-museum/issues/3350), not by the reconnected microSD. Work is committed locally, not pushed or merged; after owner action, integrate advancing main and rerun gates before the separate image PR and story PR.
- 2026-11-04 Copilot SDK resolution: founder authorized all five replacements in #3350; the fifteen screened new/replacement assets merged in image-only PR #3398 (`73282cfbd2`), closing the image blocker. Forty-story full build at `cbaa6a7a8d` passes: 158,525 pages, 0 errors / 2 warnings; 41 weight routes, 0 over budget; 897 accessible books. The 120 production routes, 909 localized stop occurrences, 132 image URLs and all five approved image selections pass; browser sweep has no page/console errors and desktop/mobile controls pass. Citation audit: 286/286. Main through image PR #3398 and biography batch 79 is integrated; graph/coverage regenerated before final post-merge gates and story publication. The next forty start only after this batch merges; event-text translations and the reserved subject-aware location selector remain follow-ups. No Worker/workflow changes or deployments.

## Revision after the TimelineThis review (27 Oct 2026)

Source: the two original TimelineThis specifications, the live builds, the two demo videos, and the Muse analysis. We keep the stage (topic-first entry, a bottom strip, a central card, a sidebar of people, conflicts and culture, per-era theme). We drop the runtime generator, and we fix the UX faults found in the review.

**Hard rules (unchanged, restated)**
- No runtime AI: no model call, no AI prompt box, no "Ask AI", no AI chat in the UI, and no images generated at runtime. Prepared, locally generated Explorer backdrops may be served as static assets; the Time Browser only reads prepared records.
- Search covers prepared records only. Anything else shows "not in the Time Browser yet", and never a raw error.

**Changes to the design**
1. **Topic-first entry, prepared data.** The header search lists prepared records and era shortcuts. Unknown topics get the "not in the Time Browser yet" message, with links to the normal site search.
2. **Visible timeline labels.** Every stop shows its date under its dot. Hover and keyboard focus show the title. A stop that has no date is never shown on the strip.
3. **No hover-only actions.** Read details, Map and Sources are always visible buttons, and work on touch.
4. **Details must add information.** A detail view shows the cited prose for that record. The card summary is never repeated verbatim as the detail. A test fails the build if a record's detail repeats its summary.
5. **Kids mode is a separate prepared dataset**, not a toggle over the same text. Each record that has a kids version has its own short prose (ages 6–12), checked by the same citation rule. A record without a kids version shows the adult text with a visible note, and the toggle never looks like it changed nothing.
6. **Sharing encodes the view.** Each stop has a URL (`/<lang>/time-browser/<kind>/<slug>/`) that opens that exact stop. Share copies that URL, never the root.
7. **No sign-in.** The Time Browser has no login, no mock accounts and no localStorage identity. Favorites and history are out of scope for TB4 and TB5.
8. **Clear, user-facing errors only.** Missing images, maps or data show a short sentence in the user's language. No developer or API text reaches the page.
9. **Every link works.** Contact is a real mailto link (ahamdy@gmail.com, per the footer spec), and the logo links to the home page. No dead controls.
10. **Images are licensed or generated cards** (decision 12). Where a stop has neither, it shows the period-coloured card, never a placeholder that implies a picture.
11. **Chronology is checked.** Stops on the strip are sorted by date, and a test fails if the order breaks (as in TB1).
12. **Tour.** A "Take a tour" button is in TB5: it steps through a fixed list of prepared stops with captions. It makes no searches.

**Changes to the phases**
- **TB4 (interactive):** items 2, 3, 6 and 8 are required. Keyboard: arrows, Home and End, Enter, Escape. Reduced motion respected. Labels visible at all sizes.
- **TB5 (entry points):** item 12 (tour) and item 9 (links) are required. The "What we offer" page describes what the Time Browser does and does not do (no AI at runtime).
- **Not in any phase:** runtime AI, AI image generation in the browser, AI Q&A, login, code obfuscation, rate limits and bot blocking (these only apply to live API calls, and the site is static).

**Existing code (TB1–TB3).** Checked against this revision: no AI UI exists, and the TB3 page is static with no login. Two additions are needed in TB4: visible labels on the strip (item 2) and per-stop URLs (item 6). The TB1 test for chronological order already covers item 11.

**Open questions for the founder**
- Kids prose: how many records get a kids version in the launch set?
- Tour: which 5–7 stops should it step through?
- 2026-10-29 Claude: animals survey and first animal story (5 nodes); see time-browser-plan/ANIMALS-COVERAGE-2026-10-29.md
