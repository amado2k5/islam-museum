# Production-completion directive for Claude Fable 5.2

## Hudhud: turn the current prototype into a complete, high-fidelity, world-class 2D game

You are Claude Fable 5.2 working in the public repository `github.com/amado2k5/islam-museum`. Continue the existing Hudhud work from current `main`. This document is an implementation directive from the founder, informed by an independent live UAT playtest and code/document review. It supersedes any interpretation that the proof scene, vertical slice, or one playable quest is an acceptable final deliverable.

Do not answer with a pitch, plan-only response, prototype, demo, proof of concept, mock-up, partial world, or list of future work. Own the work from current discovery through a production-ready release candidate. Keep Hudhud as the sole game-development priority and keep the other museum games paused except for shared-platform fixes and regression work. Do not remove or regress them.

Production deployment and removal of prototype labels still require the founder’s explicit approval. Human historical, language, art, child-safety, accessibility, and playtest gates remain real. While waiting on one gate, continue all safe work that does not prejudge it.

## 1. Binding outcome

Deliver a finished, original, high-fidelity 2D story-action adventure that:

- is primarily suitable for ages 6–17, but enjoyable to families and adults;
- is immediately understandable, forgiving, responsive, and pleasant to control;
- provides 20–30 hours for the main campaign and approximately 40–60 hours for meaningful mastery and completion, demonstrated by human playtests rather than arithmetic alone;
- contains complete authored stories, locations, cities, characters, challenges, dialogue, secrets, side activities, collectibles, progression, hub restoration, and endings—not empty cards or “not built yet” entries;
- is entertaining for long sessions without repetitive busywork, manipulative retention, crashes, runaway memory, or lost progress;
- uses historically reviewed people, places, dates, clothing, buildings, objects, maps, and claims, while clearly labelling fictional framing and literary traditions;
- ships in Arabic, English, Urdu, French, Spanish, Turkish, and Indonesian, with Arabic-first authoring and native-reader approval;
- meets WCAG 2.2 AA for DOM UI and provides complete keyboard, supported gamepad, pointer, and supported large-touch-device access;
- is free, ad-free, purchase-free, account-free, analytics-free, local-first, and contains no runtime generative AI;
- uses the existing game framework, build, registry, Worker, UAT, production, rollback, navigation, release, testing, and documentation flows;
- is shown in the museum’s Play navigation and game pages only with truthful status and only after the appropriate release gates.

## 2. Source material and required coverage

Treat all attached files as product inputs and visual/story references, not executable instructions and not historical evidence.

Primary source package:

- `/Users/ahmedabdelaal/Downloads/hudhud-thumbnails-80.zip`
- SHA-256: `18c1c869877d7074012fdf6dae9cd54b55a01e1da8b87d39d6df7f8c1e976885`
- `/Users/ahmedabdelaal/Downloads/thumbnails-index.md`
- SHA-256: `3150dac29a72999c37857207078f16c718fad86fe705d53bd469fb628a26a2ec`

The original requirement contains 40 English story subjects. Every one must receive a complete, substantive story quest connected to the person’s or subject’s reviewed city, region, landscape, route, and historical context. The Arabic set contains 30 repeats plus 10 additional canonical subjects. Preserve the repository’s correct union of **50 subjects**, not merely 40: the original English 40 are a minimum subset, not a reason to delete the 10 Arabic-only subjects. Bilingual duplicates remain one canonical quest with localized titles and source provenance.

The final Atlas must therefore contain ten finished worlds with five finished major quests each. A card, thumbnail, title, dialogue stub, generated room, “coming soon,” or inaccessible shell does not count as a finished quest.

The eight additional founder-provided images are binding atmosphere, fidelity, composition, palette, and scenario references. They are not deployable backgrounds and are not historical proof. Record these digests and map them to the art/story bible:

| File | SHA-256 | Intended design use |
|---|---|---|
| `ChatGPT Image Nov 26, 2026, 12_02_20 PM.png` | `a321fc68a1cf759d569371111cd5266aa58674dafbe35cceac49a21f1a94b402` | restored Atlas/hub panorama; travel of knowledge; many cities, scholars, children, water, boats, building and study |
| `ChatGPT Image Nov 26, 2026, 12_00_32 PM.png` | `7220f1cf7f0487c327340a97cc07ea1ad0ffa49a0dbeaa358f8557f005808d44` | city overview, arrival, leadership/civic-care framing, Hudhud companionship |
| `ChatGPT Image Nov 26, 2026, 11_59_09 AM.png` | `599e9ebecb26718add36edee026ca7c373e4d7b1869047f23c9cab9306394b53` | garden-library world, water, flowers, warm lantern interiors and exploration |
| `ChatGPT Image Nov 26, 2026, 11_56_49 AM.png` | `420e2c4c853313bb52edc073e956ba1d8cbba667cc185cc760871bef9e351cb6` | astronomy/observation challenge, large instruments, sunset-to-night transition |
| `ChatGPT Image Nov 26, 2026, 11_55_06 AM.png` | `2c3f5824d30dadecc3cffcc4a634c82986aaaa577b8444c77e34704ef6651375` | books, study, courtyard, fountains, scholar warmth and close dialogue composition |
| `ChatGPT Image Nov 26, 2026, 11_53_49 AM.png` | `e847abd80f1ea4084f2758582a6507df673adf9064c0cbf1c4cedea0016821b8` | city traversal, skyline, golden-hour atmosphere, depth and scale |
| `ChatGPT Image Nov 26, 2026, 11_52_42 AM.png` | `0b573bc0d2e83c3dc5eefa55d7da6370e0f82f772b3e09960b2a84b0a3eac78b` | civic/architectural garden route, wind-blown blossoms, lamps and layered streets |
| `ChatGPT Image Nov 26, 2026, 11_49_52 AM.png` | `88dc7c587b490739d56ced9c427753fe88d5dce81054736e2b41b103171eda45` | Monkey and Tortoise literary quest, expressive animal acting and riverside environment |

Do not place these 16:9 images directly behind gameplay, crop characters into stiff puppets, reproduce fake or mixed architecture as fact, or preserve large empty thumbnail text areas in runtime scenes. Decompose the visual language into authored parallax layers, game-ready environments, props, animated characters, lighting, weather, VFX, UI portraits, cut-scenes, and camera compositions. Historical and architectural reviewers may require corrections; record each material change.

## 3. Independent UAT findings—treat these as defects and evidence, not suggestions

The independent reviewer played UAT release `https://uat-games.islam.museum/hudhud/` in Chrome 158 on an Apple M4 Max MacBook Pro, macOS 27.2.1. Browser window was approximately 1728×1000 CSS pixels at DPR 2. The reviewer read the current Hudhud documents and inspected the source areas under `gaming/games/hudhud/src/`. No child or ordinary human player was observed, so this does not pass any human-playtest gate.

### What worked in the observed build

- The Atlas truthfully showed 0/50 pages and 49 “Not built yet” entries.
- English and Arabic loaded; Arabic RTL layout was coherent in the tested desktop window.
- The first flight/control opportunity occurred in under a minute.
- Keyboard movement, flap, interaction, dialogue, cat, secret curtain cord, feather, mirror puzzle, result screen, museum note, museum-record link, return to Atlas, and page-home state were exercised in English.
- The English Explorer run completed all four displayed goals and solved the mirror puzzle in three turns.
- The Arabic Challenge run required five mirror flips and reached the restored-page state.
- The no-picture “scene in words” route exposed all essential interactions and could drive the English completion.
- Short-session memory rose from roughly 57 MB at the Atlas to roughly 163–167 MB during the quest. That is not proof of a leak, and it is also not a soak or plateau test.

### Release-blocking or major defects to fix first

1. **Pause/resume can leave the game permanently frozen.** Live reproduction: start a quest, pause, resume using the top toolbar resume control, then try the “scene in words” buttons or touch control. The pause sheet disappears or the label changes, but interactions remain disabled. The Arabic run became non-completable after this sequence. Code cause: `sheet()` sets `sheetOpen = true` (`src/ui/app.ts` around line 378); `togglePause()` directly removes `.sheet.pause` (`around line 590`) instead of using the sheet’s close path; the MutationObserver only repairs state while `paused` remains true (`around line 602`). When `paused` becomes false first, `sheetOpen` can stay true and `frozen()` continues returning true. Fix the state machine, do not patch only the Arabic symptom, and add a browser regression test for toolbar resume, Escape resume, dialog-close resume, settings-from-pause, visibility pause, and repeated pause/resume.
2. **Settings explorer and Atlas explorer become inconsistent.** Live reproduction: on the Atlas open Settings, change girl to boy and change skin/clothes/hair, close Settings. The Atlas can still display/select the old girl until the Atlas selector is clicked. Code cause: Settings calls `setKeeper()` and `redraw()` but does not redraw the Atlas choice UI; `drawChoices()` is only called from `drawHub()`. Make one authoritative selection component/state and test it before a quest, mid-quest, after return to Atlas, after slot switch, and after reload.
3. **Gamepad dialogue control is wrong and untested.** `src/input/input.ts` labels gamepad button 1 as `next` but calls `host.press("back")` around lines 120–124. That rewinds dialogue rather than advancing it. Define and document a standard layout, support remapping and reconnect, test with physical Xbox-style and PlayStation-style controllers, and show the correct glyphs.
4. **The full product is missing.** Only Ibn al-Haytham is playable. There is no prologue, playable hub, world map, world threads, remaining 49 quests, ending, post-game, challenge archive, New Journey+, or full campaign. This alone makes every “complete” or “production-ready” claim false.
5. **The current challenge is not adequate for ages 10–17 or long play.** Explorer is three obvious binary flips; Challenge is five. The live beam sentence tells the player the next mirror reached, so completion becomes “flip the mirror named at the end” rather than reasoning about reflection. Preserve the accessible path but design genuine, legible spatial reasoning: move/rotate mirrors through more than two meaningful states, occlusion, splitters only where reviewed, optional efficiency routes, prediction-before-action, and variants that teach the physical idea. Story mode may expose stepwise hints; Challenge must require understanding, not merely more toggles.
6. **The current art is visibly prototype-grade.** The live scene uses flat code-drawn shapes, limited facial expression, simple cloth blocks, sparse environmental animation, and a single-room composition. It is well below the supplied painterly references in faces, feather detail, cloth/material response, atmospheric depth, lighting, composition, acting, and animation. Do not scale this trial art across 50 quests.
7. **Historical review is unresolved.** HR-HH-01 through HR-HH-09 remain pending; clothing and architecture are generic; the prism lacks support in the records reviewed; the camera-obscura wall placement is acknowledged as wrong; and first-person invented dialogue such as the scholar saying “I hold that…” may be interpreted by children as a real quotation despite the general disclaimer. Rewrite as clearly dramatized paraphrase, obtain named review, and remove/replace unsupported elements unless approved and explicitly contextualized.

### Other verified gaps

- The active quest is only a few minutes—under ten even when optional content and the museum link are used. It cannot support long-term interest.
- Movement responded immediately but a short held Right moved a large distance. Tune acceleration, maximum speed, stopping, aerial steering, camera lead, landing, collision readability, controller dead zones, and age-band assists with real players.
- The Atlas opens as a long wall of unavailable content. Replace it in the final game with a navigable, restored-over-time hub and staged discovery. Never show 49 unavailable production entries.
- The result goals are readable but mechanically shallow. Curiosity, Ingenuity, Kindness, and the feather need quest-specific behaviors and trade-offs, not the same one-click checklist 50 times.
- Current generated tests are useful for deterministic rule correctness but do not establish fun, comprehension, art quality, cultural accuracy, retention, accessibility, device support, or memory stability.
- Phone, physical gamepad, screen reader, Firefox, Safari, Edge, Windows reference hardware, M1 Air reference hardware, 60-minute profile, four-hour soak, real tab-close/reopen, and real concurrent-tab stress were not independently verified.

## 4. World-class benchmark—not imitation

Study these games as benchmark categories. Do not copy their protected characters, levels, art, music, prose, names, UI, or distinctive expression.

| Benchmark | Hudhud must learn | Measurable application |
|---|---|---|
| *Celeste* | exact, readable movement and player-controlled assists | input latency, coyote time, buffering, remapping, optional speed/assist settings, immediate restart, no shame or reward penalty for assists |
| *Rayman Legends* | kinetic flow, visual readability, secrets, replay routes | traversal sequences that teach through safe preview, then combine skills; optional mastery routes; strong anticipation/impact/landing feedback |
| *A Short Hike* | low-pressure exploration, flight, curiosity, useful collectibles | multiple routes, visible landmarks, spontaneous side encounters, traversal upgrades that open optional places, no quest-marker clutter |
| *Monument Valley* | legible visual puzzles and elegant cause/effect | every puzzle state readable at a glance and in words; a satisfying transformation per room; no arbitrary trial-and-error |
| *Spiritfarer* | warm, distinct character writing and place-based stories | each subject has a motivation, emotional arc, optional conversation, and memorable local actions without pretending invented dialogue is quotation |
| *Hades* | dialogue that remembers what the player did | authored conditional reactions to routes, failures, secrets, revisits, mastery and hub restoration; no runtime AI |
| *Stardew Valley* | long-term restoration and self-directed return loop | the Atlas hub changes visibly after every quest/world; several meaningful activities are available without grind or punishment |
| *Dave the Diver* | sustained variety inside a coherent core | reuse polished systems in new combinations, then introduce a twist; avoid 50 disconnected minigames and avoid reskinned repetition |
| *Ori* and premium animated adventures | expressive silhouette, layered worlds, lighting and animation polish | professional character turnarounds, key poses, secondary motion, parallax, environmental life, VFX, camera direction and audio response at the supplied fidelity target |

“World-class” is not a slogan. A release candidate must pass comparative blind playtests in which representative players rate control clarity, visual appeal, desire to continue, character attachment, puzzle satisfaction, and perceived polish against selected benchmark clips/builds. Hudhud need not win every category, but no core category may be consistently described as confusing, cheap, static, repetitive, or boring.

## 5. Complete campaign and content rules

Keep all ten existing worlds and all 50 canonical subjects. The original 40 English subjects must each have a full story and challenge; the 10 Arabic-only subjects must also be fully implemented. For every quest deliver:

- an historically reviewed city/region/route and time-specific environment;
- a 15–25 minute main path plus 5–15 minutes of worthwhile optional content;
- a clear arrival goal, local dramatic problem, discovery, gameplay escalation, resolution, and connection back to the Atlas mystery;
- at least two or three integrated verbs from traversal, observation, conversation, collection, mechanism manipulation, routing, pattern/logic, timing, avoidance, construction, repair, rhythm, mapping, or care;
- a unique mechanical or narrative twist that prevents the reusable systems from feeling reskinned;
- three quest-specific mastery goals, at least one hidden secret, a feather/appropriate collectible, optional older-reader context, and replay value;
- authored failure/recovery and checkpoints; no long replay after a mistake;
- three-layer dialogue: short essential dialogue, optional “Ask more,” and a reviewed museum note with uncertainty and source links;
- distinct reactions on replay and after relevant hub/world progress;
- Story, Explorer, and Challenge balancing that changes assistance, layouts, timing, clue depth, or optional routes—not enemy health or grind;
- a no-picture/structured alternative for every essential visual mechanic;
- seven approved localizations, layout tests, audio captions, and an explicit history/fiction/literature label.

Build a 15–30 minute prologue, a playable restoring Atlas hub, ten world arcs of roughly 2–3 hours including side content, an ending, a post-game Atlas mystery, archived deterministic daily/weekly challenges with no FOMO, chapter replay, and New Journey+ that remixes optional challenge placement without changing history.

Use the eight new images to expand scenario ambition: animated water and fountains; birds and animals; market/study/civic life; boats and caravans; moving scholars, craftspeople and children; lanterns, cloth and foliage affected by wind; sunset, stars and night; rain where geographically and seasonally appropriate; environmental sound; and composition with foreground, midground, background and distant city depth. These systems must be authored efficiently and historically/geographically credible. Do not add random disasters, riots, disease, or spectacle that trivializes suffering; only include difficult events when supported, age-appropriate, reviewed, narratively necessary, and handled without turning real trauma into amusement.

## 6. High-fidelity graphics and animation gate

Choose a production art route now. The recommended route is a blend: professional/approved painterly character and environment production derived from the established source look, plus code/engine-driven lighting, water, particles, weather, parallax, camera and interaction effects. Do not mass-produce the current code-drawn trial.

Before scaling, replace the golden scene with a production-quality runtime proof and obtain explicit founder acceptance. It must include:

- Hudhud with correct hoopoe anatomy simplified consistently, readable beak/crest/wing silhouettes, expressive eyes and at least idle, blink, look, talk/bark, hop, run, takeoff, flap, glide, brake, land, perch, startled, delighted, thinking, wet/windy and interaction animations;
- girl and boy Storykeepers plus approved diverse explorer customization, with non-tokenized historically reviewed options or an explicitly modern museum-visitor frame;
- one historical/story character with full facial acting, hand gestures, cloth secondary motion and non-mirrored asymmetric details;
- one expressive animal;
- hand-painted layered environment matching the supplied saturation, teal/gold palette, warm/cool light separation, material detail, depth and composition;
- animated water/reflections, leaves/cloth/crest in wind, atmospheric particles, day-to-night lighting, shadows, lanterns, weather, foreground occlusion, background life and localized ambient sound;
- dialogue portraits and UI that feel part of the same art world;
- Low/Medium/High effects with identical gameplay and high-fidelity readability; lower presets reduce expensive effects, not art direction;
- atlas packing, streamed world bundles, decoded-memory estimates, draw-call counts, loading transitions, context-loss recovery and clean disposal.

Art acceptance requires side-by-side runtime captures at target viewports. Concept art alone does not pass. No fake script, sacred text as texture, generic “Islamic” architecture across all centuries, duplicated faces, inconsistent hands, impossible instruments, floating props, water/physics errors, or buildings placed without geographical logic.

## 7. Controls, onboarding, usability and difficulty

The game must feel good before it explains itself.

- The first meaningful movement/flight occurs within 30–60 seconds.
- A player aged six should discover movement and interaction without reading a manual; use safe spaces, motion prompts, environmental staging, animation and optional spoken/nonverbal cues.
- Keyboard and gamepad movement must have measured latency, acceleration/deceleration, dead zones, buffering, coyote time, forgiving landings, ledge/perch assistance and consistent camera behavior.
- Controls must be fully remappable, including gamepad. Detect conflicts, provide defaults, allow reset, display current bindings contextually, and handle disconnect/reconnect.
- Story mode offers simplified inputs, untimed alternatives, extra flaps/forgiveness, optional step hints and reading assistance. Explorer is moderate. Challenge adds deeper layouts and mastery routes, not opaque punishment.
- Never require pixel hunting. Interactive objects need visual, motion, audio and structured-text affordances.
- Essential instructions can be replayed. Dialogue supports next, back, log, pause, text speed, text size and skip without losing necessary information.
- The hub always answers: what can I do, what should I do next, why, what changed, what did I earn, and how do I improve?
- Each 10-minute interval should normally introduce a discovery, choice, mechanical combination, location change, story beat, character reaction, secret, spectacle, or meaningful progress. Do not pad playtime.
- Add an accessibility/assist suite comparable in philosophy to leading games: tune game speed where safe, hold/toggle options, additional traversal forgiveness, timing alternatives, clue strength, camera shake/flash/parallax controls, color-independent cues and skip/retry options. Assists must not shame players or disable story completion.

## 8. Platform-wide no-login save standard—apply to Hudhud and every museum game

Implement a shared, versioned save service in the gaming platform and migrate Granada, The Golden Age, Atlas and future games to it without losing existing progress.

### Required behavior

- Use **IndexedDB as the authoritative store** for structured progress and snapshots. `localStorage` may hold a tiny compatibility pointer/settings fallback, but must not be the only long-term store for a large campaign.
- Provide at least three named-by-number local slots without asking for personal information.
- Autosave transactionally at safe checkpoints: quest start, significant objective change, collectible/secret, dialogue choice with persistent consequence, puzzle completion, room/scene transition, return to hub, settings/bindings change, and at a conservative timed interval during active progress.
- Also attempt a final safe checkpoint on `visibilitychange` and `pagehide`; never depend on `beforeunload` or a synchronous network request.
- Show a subtle saving indicator, success state, last-saved time, and a clear failure banner. Never show “saved” before the committed transaction succeeds.
- Provide a manual Save action where the game state is safe to serialize. If saving is temporarily unsafe, explain why and queue it for the next safe frame; do not let manual save corrupt physics/dialogue/puzzle state.
- Use atomic A/B snapshots or a journal with monotonically increasing revision, schema version, checksum, timestamp and last-known-good pointer. Recover from interrupted writes and quarantine corruption.
- Supply migrations from every released schema version and fixtures proving forward migration. Never overwrite a newer save with an older build.
- Merge cross-tab progress deterministically. Use `BroadcastChannel` where available plus IndexedDB revision checks. Prevent stale tabs from erasing newer quest progress, settings, slots or checkpoints.
- Handle unavailable storage, quota errors, private browsing, denied persistence, database upgrade interruption and browser crash gracefully.
- After an appropriate user gesture, request persistent storage with `navigator.storage.persist()` where supported; report whether persistence was granted without alarming or repeatedly nagging the player.
- Provide local Export Save and Import Save using a documented, versioned, checksummed file containing no personal data. Confirm before replacing a slot and retain the old snapshot for recovery.
- Saves are origin/browser/profile/device-specific. There is no cloud or cross-device sync without an account; do not imply otherwise.

### Required player wording

Do not say that ordinary browser restart normally deletes progress. Say, in all seven languages, substantially:

> Progress is saved automatically on this device in this browser. You do not need an account. It should remain after you close and reopen the browser, but it can be lost if you use private browsing, clear this site’s data, your browser/device removes stored data, or you switch browser, profile, or device. Use Export Save if you want a backup.

When storage is unavailable:

> Saving is unavailable in this browser session. You can continue, but progress may be lost when you leave. Try a supported non-private browser window or export a save when available.

### Save acceptance tests for every release

- close/reopen after every checkpoint type;
- crash/kill browser during a write and recover last-known-good state;
- two and three tabs making conflicting progress in different slots;
- stale tab cannot undo a completion or binding change;
- quota exceeded, IndexedDB blocked, private mode, persistence denied;
- corrupted active snapshot, corrupted prior snapshot, unknown/newer version;
- every historical released schema migration;
- 1,000 synthetic save/load cycles and a 4-hour real-play soak;
- Export → fresh profile → Import round trip;
- no personal data and no network request caused by saving.

## 9. Platform-wide supported-device and browser gate—apply to all games

Do not start gameplay on phones, small screens, unsupported browsers, or devices that fail the required graphics/features. The museum information page may still load; the game runtime and large media must not.

Create one shared compatibility preflight used by every current and future game. Do not rely on user-agent sniffing alone. Combine a maintained support matrix with feature tests and a short graphics capability/boot check.

### Minimum supported play environment

- desktop or laptop, or a separately tested large tablet in landscape;
- usable viewport at least **1280×800 CSS pixels** after browser chrome, with adequate physical screen size; primary target 1920×1080;
- hardware-accelerated WebGL 2 (or a separately documented equivalent required by the specific game), stable context creation and required texture limits;
- ES modules and the exact APIs used by the platform, including IndexedDB; Pointer Events/keyboard and supported audio APIs;
- a currently supported stable release of Chrome, Edge, Firefox or Safari from the project’s tested matrix (normally current and previous stable; include Firefox ESR only if tested); no embedded/in-app browser unless specifically passed;
- sufficient benchmark performance and memory for the selected game’s minimum preset. Do not hard-fail solely on `deviceMemory` or `hardwareConcurrency`, which are incomplete hints.

Explicitly block phone-class devices even if landscape width is spoofed. Allow a large tablet only after real-device keyboard/touch/layout/performance tests and only if it meets the viewport and feature gates. Provide a QA-only documented override that cannot accidentally ship as a public bypass.

### Graceful localized failure page

Before engine/media download, show a keyboard- and screen-reader-accessible page in all seven languages containing:

- “This game is not supported on this device.”
- the exact failed reasons (for example: phone, screen too small, unsupported browser, WebGL 2 unavailable, hardware acceleration unavailable, insufficient texture limit, storage unavailable if saving is mandatory);
- “Play on a supported desktop or laptop with a screen area of at least 1280×800, hardware-accelerated graphics, and a current Chrome, Edge, Firefox, or Safari browser.”
- instructions to update the browser, enable hardware acceleration, enlarge/full-screen the window when the physical display qualifies, and retry;
- a link back to the museum and a readable game/story/accessibility summary;
- no blank canvas, crash, infinite spinner, repeated reload, or large asset download.

Test every failure reason, combinations of reasons, zoom/DPR, window resize after start, external display changes, context loss, browser update, and false-positive/false-negative cases. Existing games must receive this shared gate and regression coverage before production.

## 10. Performance, stability and lifecycle gates

Use the project’s required physical machines: M1 MacBook Air 8 GB and Windows 11 i5-1135G7-class integrated graphics with 8 GB, plus the founder’s development Mac. Test supported Chrome, Edge, Firefox and Safari where available.

- 60 fps ordinary play; no sustained period below 30 fps on the minimum supported preset/hardware.
- No unbounded retained-world, texture, listener, timer, audio-node, buffer, DOM, worker or cache growth.
- Enter/exit every quest and world repeatedly; memory must return to a defined plateau after garbage collection opportunities.
- Run deterministic benchmark routes, 60-minute repeated-action profiles and four-hour release-candidate soaks.
- Test background/foreground, sleep/wake, pause/resume, display/DPR changes, gamepad disconnect, WebGL context loss, save during lifecycle changes, and failed/cancelled media loads.
- Load only the shell, hub and current world. Stream future worlds. Release world resources on exit. Do not keep 50 quests resident.
- Keep initial compressed payload within a measured budget, presently 15–20 MB maximum, and set per-world budgets from the accepted art proof.
- Use 2048 atlases by default; 4096 only with measured proof. Remove the current single 3520×1440 texture violation.
- Record exact release, commit, OS, browser, machine, viewport, DPR, preset, FPS percentiles, long frames, memory, GPU/resource counts and test duration.
- A short M4 Max run is not a performance or leak pass.

## 11. History, language, accessibility, safety and privacy

- Name qualified historical reviewers for science/medicine, architecture/material culture/dress, geography/travel, literature, cities/politics and any other needed specialty. AI cannot approve its own claims.
- Review every quest’s claims, visuals, maps, buildings, clothing, instruments, dates and city/region representation before release.
- Remove the unsupported prism unless a reviewer approves a historically honest use. Correct the camera-obscura wall geometry.
- Avoid invented first-person statements that look like quotations. Clearly identify dramatized dialogue.
- Author Arabic first; derive other languages according to repository rules; have native readers approve child-facing Arabic, English, Urdu, French, Spanish, Turkish and Indonesian.
- Test RTL without mirroring maps, clocks, scientific diagrams or art.
- Complete simple-language and optional reading assistance.
- Run automated accessibility checks plus VoiceOver, NVDA and keyboard-only human testing. Validate focus order, live-region volume, contrast, target size, motion, captions and every structured puzzle alternative.
- No accounts, child names, ages, email, location, analytics, ads, purchases, public chat, UGC, streak punishment, manipulative notifications or runtime AI.
- Network requests must be same-origin approved game/media requests only. Saving must not transmit data.

## 12. Required automated and human test matrix for every subsequent release

Keep these tests for every release unless the relevant feature is deliberately removed and its requirement is formally changed.

### Automated

- all repository unit/type/string/build/manifest/Worker/separation/prototype-label gates;
- every one of 80 source assets maps once; all 50 subjects map once; all 50 quests exist and pass content validation;
- every quest in all three styles has start, success, recoverable failure, replay, secret-not-required, no soft lock and deterministic fixtures;
- campaign/prologue/hub/world/ending/New Journey+ progression;
- all seven language key parity, layout screenshot matrix, placeholder safety and review status;
- keyboard remapping, physical-gamepad mappings where automation supports them, touch/pointer, disconnect and focus loss;
- save suite in section 8;
- compatibility gate suite in section 9;
- scene disposal, context loss, missing media, backgrounding, world streaming and memory counters;
- accessibility DOM semantics, focus trap/escape, reduced motion, contrast tokens, target sizes and no-picture route;
- same-origin network allowlist and absence of analytics/runtime AI;
- website Play routes/navigation and truthful status;
- regression of Granada, The Golden Age, Atlas and shared platform behavior.

### Human

Run two rounds per major world milestone and a final-candidate round:

- at least 5–8 players per game/round during formative work, expanding to 12–20 for final validation;
- ages 6–9, 10–13 and 14–17, plus parents/family players;
- at least three Arabic readers and three Urdu readers, with other native-language review organized separately;
- first-time onboarding without explanation;
- 30-, 60- and multi-hour sessions, plus return after several days;
- control preference, confusion, boredom points, quit points, desire to continue, favorite/least favorite quest, recall and perceived fairness;
- accessibility testing with relevant assistive-technology users;
- comparative review against the benchmark categories in section 4;
- privacy-preserving consent and no identifying child data in reports.

The release gate is not “nobody found a crash.” It is: players can start unaided, understand goals, enjoy controls, remain interested, recover from mistakes, remember how to return, and voluntarily want to continue; no age band has a repeated blocking confusion or boredom pattern.

## 13. Production order

1. Fix and regression-test the live pause/resume freeze, Settings/Atlas explorer mismatch, gamepad next/back defect, and any related state-machine issues.
2. Implement the shared compatibility preflight and shared no-login save service, migrate all games safely, and add regression coverage.
3. Resolve the production title with search and founder decision; do not confuse it with the separate game “Atlas.”
4. Name reviewers/native readers/test coordinators and establish review throughput.
5. Produce the replacement high-fidelity runtime golden scene using the eight additional images and 80 thumbnails as visual inputs; obtain founder acceptance.
6. Finish the prologue, playable Atlas hub, complete vertical slice and the first five-quest world. Validate controls, fun, art pipeline, history, localization, accessibility, saving, supported devices and memory on reference hardware.
7. Build the remaining nine worlds in production increments, keeping all 50 quests playable and reviewed. Do not leave integration, localization or accessibility until the end.
8. Build ending, post-game, archived challenges, chapter replay, mastery and New Journey+.
9. Complete museum website Play/navigation integration with truthful environment-aware status.
10. Run full automated, human, performance, soak, accessibility, language, historical, rollback and UAT gates; remediate; repeat until no release blocker remains.
11. Present a production-ready release-candidate evidence packet. Await the founder’s explicit production-deployment and label-removal authorization.

## 14. Definition of done

Do not call Hudhud complete until all are true:

- 50/50 canonical quests are fully playable, reviewed and localized; the original 40 are all substantive stories tied to their cities/locations;
- no “not built yet,” placeholder, prototype art, unreviewed translation, pending release-blocking historical claim, or disabled promised feature remains;
- the prologue, hub, ten world arcs, ending, post-game, replay, mastery, secrets and New Journey+ work end to end;
- high-fidelity runtime art and animation are accepted and consistent across the game;
- controls/onboarding meet the usability and comparative playtest gates;
- main and mastery playtime targets are demonstrated by people and are not padded;
- supported-device gate and graceful failure page work across every museum game;
- manual save, checkpoint autosave, crash recovery, local persistence notice, backup export/import and cross-tab safety work across every museum game;
- all seven languages and RTL pass native and layout review;
- WCAG 2.2 AA and real assistive-technology testing pass;
- historical reviewers approve the release content;
- minimum-hardware performance, 60-minute profile and four-hour soak pass with memory plateau and no crash;
- no known blocker/critical/major defect remains; lower defects have explicit owner-approved disposition;
- UAT, regression, read-back and rollback rehearsal pass;
- repository documentation, engineering/gaming standards, traceability, asset provenance, test evidence and release notes are current;
- the founder explicitly authorizes production and removal of prototype wording.

## 15. Reporting discipline

Maintain a live requirement-to-evidence matrix. For every milestone report:

- exact commit/PR and files changed;
- what is demonstrably finished;
- defects fixed and exact regression tests added;
- tests run, machines/browsers/viewports and raw evidence paths;
- memory/performance/art/media measurements;
- historical/language/accessibility/human approvals received and still pending;
- current playable minutes/hours measured from humans;
- remaining work with honest dependencies;
- whether the build is prototype, alpha, beta, release candidate or production—and why.

Never convert “implemented,” “automated tests pass,” or “AI played it” into “fun,” “accessible,” “historically approved,” “stable for hours,” or “production-ready” without the corresponding human and physical evidence.

