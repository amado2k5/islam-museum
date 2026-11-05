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
- 2026-11-04 Copilot SDK: first forty merged in #3400 (`bdf7568b68`) after final integrated validation/citations and 318 tests passed; the founder's requested next forty are now implemented from existing person/event records, with Urdu subject metadata and additive provenance completion. Hamza is deferred because two additional reserved shared backdrops contain figures; his record and those assets remain untouched, and Usama ibn Zayd takes the slot. Sixteen new native backdrops for eight legacy fallbacks are generating in a separate image-only branch. Final graph/citation/image/build/browser gates and both PRs remain pending for this next batch; no deployments.
- 2026-11-04 Copilot SDK: full-size screening also rejects Usama's adult expedition backdrop; #3403 now requests the reserved owner's correction of all three additional shared files. Hamza and Usama are deferred without altering their original records or hiding events, and Abu Sa'id al-Khudri is the final slot. All other newly encountered native variants passed the updated contact-sheet screen. Sixteen new native variants and integrated gates are still in progress.
- 2026-11-04 Copilot SDK: next forty locally verified, 270 stops / 199 existing events / 239 passing record citation checks / 120 localized subject routes. Full story build at `a5ba27649d` checks 158,645 pages with 0 errors / 2 warnings; image build at `5d2ba40560` checks 158,525 pages with the same result. Both suites pass all 318 tests, static checks pass, and the 120-route browser sweep has no page/console errors. Sixteen new backdrops are screened; no legacy illustration or rejected shared asset is displayed. Existing event-language/colour fallbacks, #3403 and the location-selector request remain documented. Final integrated gates and separate PRs precede completion; no deployment.
- 2026-11-04 Copilot SDK: next forty shipped in #3416 (`a21a48905ce2e3614d9ce1838b9bde9b2ebb15c0`), with sixteen screened assets shipped separately in #3414 (`15df32c2be04150911192151d5b34c912a2e2cdb`). Final graph/coverage, all 239 citation checks, zero-error validation and 318 tests passed before push; all forty `done` claims are appended. Both authorized forty-subject batches are complete in git; no third batch is started. Existing event-language/colour fallbacks, #3403's three reserved assets, source-record corrections and the reserved subject-aware location selector remain explicit owner follow-ups. No Worker/workflow changes or deployments; new definitions/assets await the founder's manual deployment.
- 2026-11-04 Copilot SDK: founder authorized a third forty; five place and thirty-five person definitions now reuse 132 events for 185 chronological stops. All 172 involved records pass citation checks; original fields and existing Urdu metadata are preserved, with 77 missing Urdu fields added. All 85 served native media variants are screened; zero legacy fallbacks, 124 unique-node colour fallbacks. Three unsuitable shared variants are untouched and tracked in #3423; affected subjects were deferred before claiming. Integrated build and 120-route/browser verification are next; no new images, reserved code edits or deployment.
- 2026-11-04 Copilot SDK: third-forty build at `e9799f609d` passes (159,326 pages, 0 errors / 2 warnings; 41 weight routes within budget; 897 accessible books), with 318 passing tests and zero-error validation. Static checks find 0 runtime-network problems. All 120 routes / 555 language-specific stops / 85 image variants pass production and browser checks, with no page/console errors; desktop advance/details and 390px Urdu Babur deep-link/kids/details pass. Later main through `c884f76bbb` is deliberately integrated: all forty generated subjects remain exactly identical, and citations/routes pass again. Fresh final validation/tests and shipping remain; event-language fallbacks (3 English / 129 Urdu), colour backgrounds and reserved-owner follow-ups are not claimed fixed.
- 2026-11-04 Copilot SDK, founder-requested wind-down via #3452: fresh build at `ec1923f23b` passes (161,246 pages, 0 errors / 2 warnings; 41 weight routes within budget; 897 books); static checks pass for 161,277 files and all 318 tests pass. Repeated production/browser checks cover all 120 routes / 555 stop occurrences / 85 image variants with no errors. Integrate main through `68d17f8eb2`, preserving all upstream work. Later differences are only one existing source ID/label added to three events across five stops; all other story payload fields are identical and all 172 citation checks pass. Latest integrated full-build/output QA for those last links is not claimed complete; details in DESIGN §9. Commit/push/merge existing work, then stop until the founder asks; do not start a batch, image job or deployment.
- 2026-11-04 Copilot SDK, foreground-only resumption: merge current main through `44d619a951`, regenerate graph/coverage, preserve every original batch field and upstream publication; all 172 citation checks, zero-error validation and 318 tests pass. Full build fails on the fixed Kirman tour stop displaced from the 50-record polity sample (155 eligible records), reproduced independently in unchanged owner code. Issue #3476 records the exact cause and narrow proposed fix/tests. Reserved code-edit approval was requested but unavailable, so no owner file or subagent was used. #3452 must wait for that fix or explicit authorization; final build/output QA and completion claims remain pending. No new batch or deployment.
- 2026-11-04 Copilot SDK, authorized completion: founder approves #3476's narrow required-stop sampling fix and six regression tests; validation, all 324 tests and full build at `0eb1a1a572` pass (162,464 pages, 0 errors / 2 warnings; 41 weight routes within budget; 897 books). Static checks pass for 162,495 files; all 120 language routes / 555 stop occurrences / 85 screened images pass output/browser checks, including desktop details and mobile Urdu deep-link/kids crossfade. #3452 merged concurrently as squash `23e76e6d1654528d775edcfe2d8f75c1c155e29d`, so forty done claims record the actual story merge and a focused follow-up ships only the authorized fix/completion records. Preserve later event publication through `406335eda6` and rerun integrated gates before push. Existing event-language/colour fallbacks and reserved image/location follow-ups remain; no new batch, subagent, Worker/workflow change or deployment. Founder manual deployment is required for the script change.

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

## 2026-11-04 — fourth forty, foreground-only

Founder-authorized content batch: 21 people and 19 dynasties, 200 chronological stops from 141 existing events, with 120 Arabic/English/Urdu subject routes. Forty definitions and additive Urdu/provenance metadata are committed in two twenty-definition content commits; no new facts, dates, edges, media or runtime code. Main through `ea11a8e3b6` is deliberately merged, with graph/coverage regenerated.

Local citation/preservation audit: 181 pass. Exact dev-route audit: 120 routes, 600 localized stop occurrences, 80 existing screened native image variants, no rejected shared images or legacy record illustrations. Browser sweep: all 120 routes, zero page/console errors. Desktop Arabic/English advance/details and 390px Urdu RTL/deep-link/kids-stage/details checks pass. Existing limitations: 150 Urdu event-language stop-occurrence fallbacks, zero English fallbacks and 127 unique-node colour backgrounds; subject metadata itself is localized in all three languages.

Integrated validation passes with zero errors; final full tests precede push/merge. Full build is explicitly unrun for this batch under the founder's progress-first direction; no CI wait. Reserved image issue #3484 concerns whole deferred candidates, not the selected forty; #3485 records the unchanged renderer's kids-stage/adult-details mismatch. Earlier owner follow-ups remain separate. No subagents or deployments; no Worker/workflow change. The founder deploys these `scripts/` definitions manually when ready.

Final publication record: [#3493](https://github.com/amado2k5/islam-museum/pull/3493), with forty done claims. Full suite: 19 files / 324 tests pass at `9167d8ab45`. Final main through `754d9ed40d` is preserved; shipping head `7c6241fa49` passes validation (zero errors), 181 citation checks and 78 targeted tests after the final unrelated non-runtime refreshes. Every complete selected story payload is unchanged from all 120 successful dev-route/browser checks; all 120 server-rendered initial cards are readable without JavaScript. Full build remains unrun for this batch, not inherited from the third forty; no CI wait or deployment. The local browser helper is stopped. Existing event-language/colour fallbacks and owner follow-ups remain as above; stop after these forty.

- 2026-11-04 Copilot SDK, fifth forty local completion after the founder's renewed request: 36 people and four polities, 214 chronological stops across 170 existing events, forty explicit definitions and fully localized subject metadata. Original fields/statuses are preserved in exactly forty existing records; 35 English and 78 Urdu fields are added, and Aksum receives missing root provenance. Bahri/Kayqubad records explicitly saying their source page is unchecked are deferred and unchanged; cited Hassan ibn Thabit and Abu Ishaq al-Isfara'ini replace them.
- Integrated snapshot `0bdd36ac53` incorporates main through `ce9888e0f1` by deliberate three-way merge, retaining both CANARY entry sets and regenerating graph/coverage. Validation: zero errors; citations: 210/210; targeted tests: three files / **80 tests**, correcting earlier local commit descriptions that understated the count as 78. The full suite on this corrected, integrated source state passed 19 files / 324 tests in 454.07 seconds. Generated total: 385 subjects / 3,041 nodes.
- Route/browser evidence: all 120 final language routes, 120 localized payloads, 120 readable server-rendered initial cards, 642 localized stop occurrences, zero page/console errors. Actual browser traversal checks all 214 stops, rendered citations at every stop and reverse controls in all forty stories; Arabic/English desktop, 390px Urdu RTL, deep links, details/source links, localized alt text and kids-stage art switching also pass. All 51 defined sources open in all three languages (153 pages). Static check: 162,495 files / zero runtime-network problems.
- Media/language limits remain explicit: 61 existing screened native variants (32 adult, 29 kids), no newly generated media or legacy record-image fallback; 174 of 206 unique nodes have no adult scene. Existing event-language fallback affects two English and 150 Urdu stop occurrences. Additional unsafe shared art is reported in #3484; the reserved kids/details inconsistency #3485 is unchanged. Full build and CI wait are deferred by founder direction, not claimed as passed; no subagents, runtime/Worker/workflow edits or deployments. Browser helper stopped. Stop after these forty.
- Final shipping snapshot `16d8cadbfb` incorporates main through `2305e26e6e`: 25 later unrelated publication/provenance updates outside every final subject, script and site surface are preserved, both CANARY entry sets retained and graph/coverage regenerated. All forty complete verified payloads remain unchanged. After this refresh: zero-error validation, 210/210 citations and 80/80 targeted tests pass; the full-suite result remains 324/324 at `0bdd36ac53`, explicitly not another full run after the metadata-only refresh. Forty final `done` claims are persisted; both unchecked candidates remain `deferred`.
