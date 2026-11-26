# Claude Fable 5.2 Extra — production completion prompts

Use these prompts together, in order. They are based on interactive testing of UAT release `20261125-e2930d63426` in connected Google Chrome on macOS and comparison with the three attached target images. The images are product/visual targets, not screenshots of the current implementation.

Global constraints for every prompt:

- Deliver production games, not renamed prototypes. Preserve free/open browser-native delivery, independent static deployment, device-local saves, museum links, and the seven-language interface.
- Do not add ads, payments, loot boxes, gambling, pay-to-win, streak penalties, FOMO, accounts, required servers, or live multiplayer.
- Treat sourced history, uncertain history, and fictional simulation distinctly. New historical detail needs an islam.museum record or approved source.
- Use the canonical URLs and the regression suite in `engineering/gaming/PRODUCTION_GAME_STANDARDS.md`.
- Do not implement a decorative imitation of the target images. Every visible panel/control must drive a real system and every system must have visible world feedback.
- Keep accessibility alternatives for canvas actions and do not sacrifice 1280×800 usability for visual density.

## PROMPT 1 — Cross-game production foundation — priority P0 — size L

Goal: Replace prototype-grade framing and fragile lifecycle behavior with a production foundation shared by Granada, The Golden Age, Atlas, and future islam.museum games.

Why: OBSERVED on release `20261125-e2930d63426`: all three products visibly identify themselves as prototypes; Atlas explicitly says “Prototype: not a finished game.” The live games are playable but materially below the attached target images in scope, rendering, interaction density, animation, audio, and long-session depth. The user requires final production games and reusable rules for future titles.

Do:

1. Adopt `engineering/gaming/PRODUCTION_GAME_STANDARDS.md` as a release gate and link it from the repository’s engineering/game documentation and each game’s release checklist.
2. Create a shared but non-coupled game shell for locale, input mapping, focus, audio buses, settings, save versioning, pause/speed, time/weather hooks, panel layout, error/loading states, diagnostics, and cleanup. Games remain independently deployable.
3. Maintain canonical route/run identifiers: game, scenario/chapter, seed, daily/practice/campaign mode, and save version. A route must never silently restore another scenario. `fresh=1` resets only the intended disposable QA run.
4. Define explicit lifecycle ownership for animation frames, timers, observers, workers, WebAudio, network/asset requests, WebGL contexts, render targets, materials, textures, geometry, and event listeners. Cancel/dispose on restart, route change, locale change, tab teardown, and failed load.
5. Add recoverable loading/error states. A failed 3D initialization must show a labeled accessible plan/fallback and retry, not a permanent blank scene.
6. Preserve current useful mechanics: local saves, museum-source links, Granada tabs and economy, Golden Age plan/forecast/ledger/research, Atlas keyboard and typed coordinates.
7. Do not remove prototype labels until the per-game target checklist, content, accessibility, performance, soak, and release gates pass. Removing the word is not completion.

Done when:

- All five canonical English URLs load and are interactively playable in connected desktop Chrome; the exact `/_channel` release is recorded.
- Each game can restart, change locale, change scenario/mode, background/foreground the tab, and reload 100 times without mixed state, duplicate audio, extra WebGL contexts, leaked listeners/timers, or increasing failure rate.
- A corrupted/unsupported local save produces a safe recovery choice.
- The full cross-game regression matrix passes at target resolution and 1280×800.
- Prototype labels are removed only in the release that also satisfies the production definition of done.

## PROMPT 2 — Granada target image and authored kingdom — priority P1 — size L

Goal: Make the live Granada kingdom recognizably match the attached `granada-v3.jpeg` in interactive composition, landmark quality, strategic information hierarchy, and lived-in visual density.

Why: OBSERVED in Granada English at `https://uat-games.islam.museum/granada/?lang=en&fresh=1`: the UAT shows an attractive but sparse low-poly valley with repeated houses/trees/crops and a small set of fields, waterworks, and quests. The attached 1536×864 target shows a dense kingdom: Alhambra/palace, walled city, Granada capital, Málaga and Almería links, snow mountains, layered fields/orchards, river, mill, bridge, workers, carts, construction, market/contracts, objectives, production chain, regional map, security/tensions, seasons, and a gold-on-teal HUD. The current mill is the most authored-looking asset but its surrounding terrain/buildings are much simpler.

Do:

1. Build an authored modular Nasrid-inspired environment kit: multiple lime-plaster wall states, clay-tile roofs, stone foundations, arches, courtyards, gates, towers, wall segments, palace wings, reservoirs, bridges, mills, mosques/minarets, markets, farm buildings, warehouses, ports, roads, retaining walls, irrigation works, scaffolds, and damage/repair variants. Use historically reviewed motifs without copying unrelated commercial-game assets.
2. Recompose the playable overview to contain the readable target hierarchy: Alhambra/royal palace on its hill; dense Granada town; irrigated Vega; river and three-arch road bridge; connected mill channel; construction site; mountain backdrop; regional connections toward Málaga and Almería. Landmarks must be selectable and gameplay-relevant.
3. Match the target’s material richness: wall/roof variation, vegetation layers, crop diversity, wet/dry soil, stone wear, water edges, contact shadows, ambient occlusion, sun/haze depth, mountain snow, cloud shadows, and restrained bloom. Use LOD/instancing/texture atlases so density remains performant.
4. Match the interface organization rather than the current deviation: top resources/date/speed/settings; left Overview/Economy/Agriculture/Construction/Diplomacy/Defense/First-person/Photo modes; contextual objectives; right market/contracts/security/season panels; bottom production/build categories; regional minimap/layers. Progressive disclosure is allowed, but the systems may not be omitted.
5. Add camera bookmarks and smooth overview/close-up transitions. Keep `O`, `Home`, pointer drag/wheel, geometry picking, and an accessible plan/list. Add optional first-person and photo modes only when they work reliably.
6. Make construction and repair visible: workers deliver resources, scaffolding appears, geometry progresses, access routes matter, and completion transitions cleanly.
7. Produce a target-to-live comparison sheet listing every visible target component as implemented, intentionally adapted, or still blocked.

Done when:

- A 1536×864 live screenshot at a comparable camera angle is immediately recognizable as the target kingdom, with the required landmarks, density, activity, panels, materials, and atmosphere—not a sparse approximation.
- Every visible target panel opens a functioning system; no decorative-only market, production chain, contract, security, layer, or build card.
- Near/far inspection shows multiple authored buildings and material variants without floating/intersecting geometry.
- The same layout remains usable at 1280×800 with scrollable panels and no clipping.
- A 60-minute camera/build/weather soak meets the performance and memory standard.

## PROMPT 3 — Granada multi-hour campaign and living simulation — priority P1 — size L

Goal: Expand Granada from a short 96-day valley exercise into a clear, moderately difficult, multi-hour kingdom campaign with varied strategies, seasons, crises, recovery, and replay value.

Why: OBSERVED: one competent UAT year was won with all five quests, ending at 1,494 dinars, 24 food-days, 80/80 households, welfare 75, pool 300, store 243/920, and score 1,419. A no-action run failed with 44/60 households, welfare 25, food/store 0, and score 614. The current loop is coherent but new decisions concentrate early around harvesting, repair, housing, granary, irrigation, and sow/harvest. It does not yet supply the target’s diplomacy, defense, regional trade, production chains, palace/castle growth, contracts, or hours-long strategic arc.

Do:

1. Keep the current valley as a 15–30 minute onboarding prologue. Teach harvest, storage, market spread, irrigation, repair, building, labor, and seasonal preparation through play.
2. Add campaign phases with escalating but readable goals:
   - restore the Vega and mill network;
   - diversify crops and manage soil/water/seasonal labor;
   - build processing chains (olive press/oil, ceramics, textiles, food storage) with real inputs, workers, capacity, transport, and markets;
   - open Málaga/Almería trade routes, negotiate contracts, handle transport time/risk, and compare local sale versus export;
   - expand Granada housing, markets, workshops, culture, gardens, walls, reservoirs, palace and Alhambra district;
   - manage diplomacy, border tension, defenses, public welfare, and infrastructure without turning the museum into a conquest game;
   - survive a late-game resilience sequence and choose a legacy goal.
3. Provide at least three viable economic strategies—agricultural abundance, craft/export specialization, and resilient civic/cultural development—with tradeoffs and counter-pressure. No single repeatable trade action may dominate every seed.
4. Add fair event families: drought, flood, canal break, heat, frost, crop disease, storm, fire, earthquake, market shock, caravan delay, labor shortage, illness, famine risk, border tension, unrest, visiting scholar/artisan, discovery, and diplomatic opportunity. Use sourced/location-appropriate framing; show forecast, mitigation, visible consequences, bulletin, and recovery choices.
5. Simulate spring/summer/autumn/winter and day/night. Update crop stages, irrigation demand, water level, clothing, work schedules, foliage, surfaces, clouds, light/shadow, wind, dust/leaves, rain, snow only where appropriate, and sound.
6. Add people, animals, carts, boats where applicable, birds, mills, tools, fountains, markets, construction, and households with destinations and schedules. Use route-valid movement and believable reactions.
7. Add campaign score breakdown, optional missions, scenario seeds, difficulty presets, post-game explanation, and locally stored best results. No streak/FOMO mechanics.
8. Preserve current market round-trip loss (observed buy 26/sell 18, eight-dinar loss), visible forecasts, pause/speeds, and save/reload.

Done when:

- A first-time player starts within two minutes, understands the next action, and can recover from one mistake without external instructions.
- The main campaign provides at least 3 hours of non-repeated decisions in playtest, plus shorter scenarios and endless/custom mode.
- Three distinct strategies can win on the same moderate seed; each faces different constraints.
- All events have fair warning/mitigation where appropriate and never create unavoidable random loss.
- Winning, neglect, overspending, drought, trade, and recovery regression scenarios pass with deterministic QA seeds.

## PROMPT 4 — Golden Age target city and chapter differentiation — priority P1 — size L

Goal: Rebuild The Golden Age as the dense, living Abbasid Baghdad city-builder shown in the attached target while preserving the useful canal/plan/forecast simulation.

Why: OBSERVED across all three canonical English scenarios: UAT uses a compact 8×6 district with the same basic grid, building palette, plan overlay, and seasonal ledger. The scenarios have different starting states/objectives and all were completable, but visually and structurally they are much closer to one another than the attached 1672×941 target. The target shows a city-scale Baghdad river scene, bridges and boats, domed scholarly/civic landmarks, active construction, dense housing/markets, research/development panel, top resources/calendar, left modes, bottom categorized build catalog, and minimap.

Do:

1. Create a city-scale Baghdad map with riverbanks, canals, bridges, quays, boats, roads, gardens, farms, dense neighborhoods, markets, workshops, public services, walls/gates where appropriate, and distant city depth. Preserve the accessible plan as a strategic layer, not the only readable city representation.
2. Build authored architectural families and upgrades: houses, markets, caravanserai, workshops, baths, schools/madrasas, libraries/House of Wisdom-inspired complexes, translation houses, manuscript workshops, paper mills, observatory, hospitals, public works, warehouses/granaries, gardens, bridges, water wheels, mosques/minarets where historically/contextually appropriate. Source and review names/claims.
3. Match the target UI hierarchy: Baghdad identity/date; treasury/food/water/population/materials/knowledge; modes for economy/population/research/trade/diplomacy; right research/development objectives; bottom construction categories; city overview metrics; minimap/layers; contextual construction progress.
4. Construction requires materials, labor, access, and time with visible scaffolding, delivery, workers, cranes/tools, and completion. Buildings should visibly operate when staffed/watered and visibly idle when not.
5. Make chapters materially different:
   - The Failing Canal: water network recovery, food/housing triage, silt, expansion, and resilience.
   - The House of Books: scholarship/translation/paper/library network, scholar attraction, funding, copying/transmission, and institutional tradeoffs.
   - What Endures: endowments, public services, disease/resilience, trade income, maintenance, and long-term welfare.
6. Add campaign chapters/scenarios for founding/urban growth, river trade and caravans, public health/hospital response, paper/manuscripts, observatory/scientific institutions, flood/fire/disease recovery, and civic/diplomatic decisions. Historical events require sources; the district/city simulation remains explicitly fictionalized.
7. Add seasonal/day-night/weather life: river flow, boats, workers, scholars, markets, smoke, carts, animals, birds, rain/wind/dust, changing clothes/work schedules/light/shadows, spatial audio, and event reactions.

Done when:

- A comparable 1672×941 live screenshot has the target’s readable river city, authored scholarly landmarks, dense activity, construction, UI hierarchy, minimap, and research/objective systems.
- A blind tester can identify each chapter from world state, available systems, and decision pattern—not just title/objective text.
- Plan and 3D remain synchronized; selecting/building in either identifies the same plot/building/state.
- At least one full multi-hour Baghdad campaign and three 30–60 minute chapter scenarios pass.

## PROMPT 5 — Golden Age economy, trade, endowments, balance, and state — priority P1 — size L

Goal: Preserve the transparent simulation while preventing trade from substituting for the rest of the game and proving chapter/save integrity.

Why: OBSERVED Chapter 3 evidence on release `20261125-e2930d63426`:

- One workshop plus a second market/workshop network raised visible Trade from 36 to 72 per season.
- A competent run still required canals, housing, schools, research, hospital, food storage/farms, light tax, and four endowments; it won after 20 seasons at treasury 384, grain 298, households 408/408, welfare 74/64, learning 622/520, four of four endowments, trade 72.
- A separate trade-heavy poor run built an additional workshop and market, selected Heavy tax, and ignored expansion, endowments, research, and welfare. It finished 20 seasons with treasury 2,248 and trade 72 but lost: households 204/380, welfare 51/64 with zero of four qualifying seasons, learning 250/520, and zero of four endowments. Therefore trade is extremely lucrative but did not win by itself; one successful strategy does not prove a universal 100% win rate.
- Chapter 1 and 2 also won, and forecast/ledger values generally matched actual season results.

Do:

1. Keep the ledger’s explicit Tax/Trade/Upkeep/harvest/water/welfare components and pre-end-season forecast.
2. Balance trade by route access, goods supply, market reach, staffing, transport, demand, price variation, risk, maintenance, and opportunity cost. Prevent money-only victory; do not simply nerf trade into irrelevance.
3. Make endowments a strategic capital allocation: visible cost, eligible building, upkeep removed, permanence, service resilience, opportunity cost, and ledger entry. Provide no accidental double-endowment or state loss.
4. Ensure welfare, learning, population, food, water, public health, and required institutions remain independent constraints. Explain all caps, reach radii, staffing and shortages.
5. Add at least three balanced winning approaches and QA seeds: commerce/endowment, scholarship/institutions, and civic/agricultural resilience. Include deliberately poor variants.
6. Validate placement before spending; keep Undo before season end; show exact non-function reason. Observed good example to preserve: workshop detail explicitly showed “Markets within four streets: 0.”
7. Version and scope saves by canonical scenario. Reload must restore the correct chapter, state, research, endowments, buildings, water links, seed, and outcome. Locale changes must not change simulation state or scenario.
8. Add deterministic simulation tests that compare every forecast component with the applied next-season delta, including events.

Done when:

- The two observed Chapter 3 strategies are recreated: competent trade/endowment run can win; heavy-tax trade-only run accumulates money but fails non-money goals with a clear outcome.
- At least two additional viable strategies win at moderate difficulty without following the same build order.
- No strategy wins every tested seed without responding to food, water, welfare, learning, health, and event constraints.
- Forecast-to-actual reconciliation is exact or explains rounding/event deltas.
- Save/reload and scenario isolation pass canonical route tests.

## PROMPT 6 — Atlas target globe, blank-render defect, and full challenge system — priority P1 — size L

Goal: Match the attached Atlas target’s rich interactive globe and challenge interface, fix round-transition rendering, and expand daily/practice play without compromising accuracy.

Why: OBSERVED at `https://uat-games.islam.museum/atlas/?lang=en`:

- The initial globe rendered as a shaded 3D sphere and accepted keyboard, mouse, and typed coordinates.
- After advancing from Round 2 to Round 3, the entire globe/canvas area became a flat beige blank while the question panel and controls remained. Waiting did not recover it; reloading the same URL restored the globe and preserved Round 3. This is a major core-render defect.
- Five daily rounds completed with total 2,619/5,000, exactly matching 0 + 784 + 8 + 1,000 + 827. The region hint cost 150, one century estimate was one century off, and summary showed “Centuries right: 0 of 1.”
- “Battle of Ihtiman” revealed Ihtiman, so the sampled battle/place mapping was consistent. One sample does not prove the full dataset.
- The target image has photoreal/elevated terrain, clouds/night lights, layers, historical overlays, timeline, landmark image, three clues, multiple hint types, previous rounds, score, daily/practice navigation, and a much richer hierarchy than UAT’s simple country-silhouette sphere and single text clue.

Do:

1. Fix round transitions so the render loop, camera, globe scene, WebGL context, size, and asset state survive every Next round/result/practice transition. Do not require reload. Add error detection/retry and accessible fallback.
2. Build the target globe: terrain/elevation, coastlines, mountains, rivers, clouds, atmospheric rim, day/night and city-light treatment, readable pin/depth, smooth rotation/zoom, and style-consistent historical layers. Use legal, documented map/terrain sources and bounded asset budgets.
3. Implement target panels as real systems: Daily Challenge and Practice; image/landmark clue; progressive textual clues; previous-round summary; local score; hint inventory; region reveal; century elimination; extra contextual clue; construction/period selector; timeline; terrain/mountain/river/border toggles; historical overlays for eras/routes/cities.
4. Keep typed latitude/longitude as an accessibility/power feature and visibly synchronize it with mouse/keyboard pin placement.
5. Add themed practice sets: landmarks/architecture, people, events/battles/sieges, cities, trade/science routes, chronology, and mixed challenges. Add local difficulty and locally stored best scores without accounts or streak pressure.
6. Make scoring explain distance, precision tolerance, hint deductions, date/century accuracy, and total arithmetic. Validate aliases and event-to-place mapping against museum records.
7. Persist daily progress/completion and isolate it from practice. New daily starts at documented UTC boundary without overwriting practice history.

Done when:

- 100 automated-plus-interactive round transitions and 25 practice rounds show no blank globe, context loss, size failure, duplicate scene, or leak.
- The target-resolution live frame contains the target’s terrain depth, layers/overlays, timeline, clues, hints, score, previous rounds, and daily/practice modes.
- Mouse, keyboard+Enter, and typed-coordinate rounds all score the same coordinate consistently, including near the limb and at multiple zoom levels.
- Daily reload mid-round and after completion restores exactly; practice remains independent.
- Every sampled Battle/Siege clue reveals the same named place or an explicitly displayed supported alias.

## PROMPT 7 — Cross-game time, seasons, weather, life, physics, and sound — priority P1 — size L

Goal: Add a coherent living-world layer so environments visibly and audibly respond to time, weather, infrastructure, events, and player decisions.

Why: SUGGESTION grounded in observed gaps: UAT uses functioning simulation values and some animation, but the attached targets imply dense lived-in worlds. In Granada, walkers moved but foot-to-foot lean was not distinguishable and two-route ox-cart movement was not confirmed. The mill wheel visibly rotated after repair, but the no-flow close-up transition was not observed. Golden Age’s plan/ledger is much more expressive than its world activity. Atlas lacks the target’s clouds, atmospheric/night-light depth, and living globe layers. The user explicitly requires water flow, people, birds, wind, rain, sun/shadows, night, sand/dust/leaves, seasons, clothing/surface differences, object/people sounds, and physically sensible reactions.

Do:

1. Implement one deterministic world clock per run with pause/speeds, day/dusk/night/dawn, sun/moon/sky progression, artificial lighting, shadow movement, ambient exposure, and schedule hooks. Avoid flashing or unreadably dark states; offer brightness and reduced-motion options.
2. Implement spring/summer/autumn/winter profiles per geography: temperature/rain/wind probabilities, day length, sun angle, foliage/crops, soil/wetness, water demand/flow, clothing, work schedule, sound, hazards, and production modifiers.
3. Implement layered weather: clear, cloud, rain, wind, heat, dust/sand, fog, storm, and location-appropriate snow. Surfaces darken/wet, puddles/flow respond, trees/crops/cloth/leaves bend, dust direction matches wind, clouds affect shadows, people seek shelter or alter work.
4. Implement causal water networks: source/flow/demand/capacity/damage/gates; visually flowing channels; wet/dry states; wheels/fountains only active with flow; drought/rain/repair transitions; audio intensity linked to flow.
5. Implement agents with pathfinding, destinations, schedules, seasonal clothing, work animations, conversation/market clusters, shelter/reaction, collision avoidance, and LOD/culling. Add appropriate carts, pack animals, boats, birds, livestock, smoke, tools, construction, flags/cloth, plants, and debris.
6. Implement audio buses and spatial emitters for music, ambience, people, markets, tools, water, wheels, carts, boats, animals, birds, wind, rain, construction, and UI/event feedback. Provide mute and independent levels; stop/dispose correctly.
7. Implement placement and collision validation before spending: terrain/slope/water/footprint/access/road/canal/navmesh/world bounds. Add valid/invalid ghost and exact reason. No floating, intersecting, inaccessible, underwater, or airborne structures.
8. Use scalable systems: instancing, pooling, LOD, occlusion/culling, bounded particle counts, deterministic simulation budgets, and offscreen throttling. Visual physics must be believable even when simplified.

Done when:

- A scripted 24-hour/four-season capture visibly demonstrates changing light, shadows, sky, clothing, surfaces, vegetation, water, activity, weather, and audio in each relevant game.
- Cutting/restoring water causes all dependent visuals, animation, production, and sound to stop/resume correctly.
- 500 placement attempts across edge cases never spend resources on invalid placement or create impossible geometry.
- Agents complete routes without persistent intersections/sliding/floating and react to rain/wind/night/events.
- A 4-hour soak with high activity remains within the memory/performance gates.

## PROMPT 8 — UI fidelity, onboarding, accessibility, RTL, and responsive desktop — priority P1 — size L

Goal: Make the games as clear and polished as the target interfaces while preserving accessible alternatives and all seven locales.

Why: OBSERVED: current UAT controls are generally labeled and selected states are visible; Granada shortcuts `1`–`5`, `P`, `N`, `H`, `O`, and `Home` worked; Golden Age plan exposes every plot/link as buttons and explains forecasts; Atlas exposes keyboard and coordinate controls. Arabic and Urdu rendered shaped RTL text with right-side panels. However the current menu hierarchy deviates strongly from all three target images, full keyboard traversal/VoiceOver and 1280×800 were not completed, and the target density will create clipping/focus risk if copied without responsive rules.

Do:

1. Reproduce each target’s high-level structure and styling: teal/navy surfaces, restrained gold/cyan accents, ornament used for hierarchy, top resources/date/time, left modes, contextual right panels, bottom action/build catalog, world-first center, minimap/layers where specified.
2. Progressive onboarding: brief goal, one highlighted next action, contextual explanation, consequence preview, recovery/Undo, optional deeper help. Do not lock advanced players into long tutorials.
3. Every changing number gets tooltip/details and ledger/history. Every disabled action shows exact missing resource/dependency/placement reason. Warnings are timely and actionable.
4. Full keyboard path: logical Tab/Shift+Tab, visible focus, Enter/Space activation, Escape close, arrows where expected, no traps, shortcuts suppressed in text inputs, canvas alternative plan/list/coordinates.
5. Test VoiceOver before claiming screen-reader support; add names, roles, states, live result/status announcements, headings, dialogs, focus return, and reduced-motion/high-contrast/text-scale modes.
6. True RTL: panels/order/alignment adapt; numbers and units remain understandable; maps/geographic north/east-west and camera controls are not incorrectly mirrored; mixed text is isolated correctly. Obtain native review for Arabic/Urdu wording.
7. Responsive desktop layouts at target resolution and 1280×800. Panels scroll internally, modal buttons remain reachable, canvas resizes immediately, and HUD never overlaps essential play.
8. Add first-run settings for audio, text, motion, graphics quality, controls, and language; persist them separately from scenario state.

Done when:

- A first-time moderate-difficulty tester starts each game and reaches the first meaningful result within two minutes without external help.
- All essential actions are completed mouse-only and keyboard-only; focus order and modal return are recorded.
- English full runs plus Arabic/Urdu RTL and French/Spanish/Turkish/Indonesian spot checks have no clipping or untranslated production strings.
- 1280×800 and target-resolution screenshot checklists pass.

## PROMPT 9 — Performance, memory, renderer, and crash prevention — priority P0 — size L

Goal: Prove that hours-long play, rich worlds, repeated rounds, and restarts do not leak memory, lose WebGL state, or crash Chrome.

Why: OBSERVED major Atlas symptom: the globe vanished after a round transition until reload. The requested production scope adds many assets, agents, particles, audio nodes, weather states, and panels, increasing leak/crash risk. No FPS, GPU acceleration, heap, or long soak was measured in this playtest, so do not claim current performance health.

Do:

1. Define supported/reference Mac and Windows hardware, Chrome version, quality presets, target resolution, asset budgets, draw-call/triangle/texture limits, agent/particle caps, and frame-time goals. Target 60 fps; never sustain below 30 fps during supported normal play.
2. Instrument debug builds for frame CPU/GPU time where available, JS heap, DOM nodes, listeners, timers, workers, WebAudio nodes/contexts, WebGL contexts, texture/geometry/material/render-target counts, asset cache, and long tasks.
3. Centralize ownership/disposal. Cancel RAF/timers/workers/requests; remove observers/listeners; dispose scenes/materials/textures/geometry/render targets/audio; bound caches/pools; release route/round resources.
4. Handle tab visibility, resize, device-pixel ratio changes, context loss/restore, asset failure/cancellation, locale changes, restart, daily/practice transition, scenario changes, and save load without duplicate loops/contexts.
5. Add automated lifecycle stress plus interactive profiling: 100 Atlas rounds; 100 Golden Age scenario/locale switches; 100 Granada restarts/year transitions; 100 panel open/close cycles; repeated window resizing; deliberate WebGL context loss; offline/slow asset cases.
6. Run 60-minute repeated-action and 4-hour soak profiles. Memory should plateau after warm-up; no monotonic retained growth. Investigate repeated-cycle retained growth over 10% unless a bounded cache explains it. Record heap snapshots and resource counters at checkpoints.
7. Build quality degradation/fallback rather than crash: reduce LOD/agents/particles/shadows/reflections; preserve simulation/UI/save correctness.

Done when:

- Stress and soak artifacts are attached to the release: hardware/browser, trace/profile, heap snapshots, resource counters, screenshots, and pass/fail notes.
- No blank Atlas canvas, WebGL context accumulation, duplicate audio, progressive slowdown, unbounded heap/resource growth, or browser crash occurs.
- Background tabs throttle safely and resume without simulation corruption.
- Low/medium/high presets remain visually coherent and preserve target UI/system behavior.

## PROMPT 10 — Historical scenarios, missions, events, and replay structure — priority P2 — size L

Goal: Supply hours of varied, respectful, source-backed play across all three games with clear missions, moderate challenge, shocks that can be mitigated, and replayable outcomes.

Why: SUGGESTION requested by the owner and grounded in the short current scenario set. UAT proves the core rules can support forecasts, events, resources, research, water, welfare, quests, scoring, and local saves, but the available arcs are far shorter and narrower than a final game.

Do:

1. Granada campaign families: Valley Restoration; Four Seasons of the Vega; Water Council; Markets of Málaga/Almería; Olive Oil/Ceramics/Textile production; Palace and Gardens; Walls and Border Readiness; Diplomacy and Tribute; Winter Reserves; Drought/Flood/Fire/Earthquake recovery; Disease/Famine prevention; Succession/Civic Council; Legacy challenge. Each needs sourced context, fictional-simulation label, multiple strategies, optional goals, event variants, and short/medium/long modes.
2. Golden Age campaign families: Failing Canal; House of Books; What Endures; Founding/expanding Baghdad; Paper and Manuscripts; Translation and Scholarly Networks; Observatory/Science institutions; River/Caravan Trade; Hospitals/Public Health; Flood/Fire/Disease response; Neighborhood Welfare; Civic/Diplomatic decisions; multi-generation institutional legacy.
3. Atlas modes: five-round daily; unlimited practice; themed packs for landmarks, architecture, people, events, cities, science, routes, chronology; route reconstruction; compare-era overlays; image clue; progressively revealed clue; no-hint challenge; accessible coordinate mode; locally stored personal bests and explanations.
4. Event design: forecast where fairness requires it; show bulletin, probability/risk language, choices, cost, immediate effect, delayed effect, visible world change, ledger entry, recovery path, and sourced note. Earthquake, riot/unrest, pandemic/disease, famine, storm, drought, flood, fire, market shock, border tension, caravan loss, and infrastructure failure must be respectful and mechanically distinct.
5. Difficulty: moderate default, forgiving onboarding, no hidden instant loss. Optional relaxed and challenge presets adjust buffers/forecast/event pressure, not UI opacity. Use deterministic QA seeds and bounded randomness.
6. Replay: branching objectives, scenario modifiers, shuffled but curated events, different starting geography/resources, local score breakdown, post-run improvement suggestions, and multiple viable strategies. Avoid procedural noise and repetitive busywork.

Done when:

- Each main game supports at least three hours of coherent campaign play plus shorter scenarios and replay/practice.
- Content review confirms every factual claim/source and respectful framing.
- Moderated playtesters can explain goals, recover from one crisis, and identify how to improve score without outside help.
- No scenario relies on one mandatory build order or unavoidable random punishment.

## PROMPT 11 — Permanent release regression suite — priority P0 — size L

Goal: Make the full 2026-11-25 interactive test suite and target-image checks mandatory for every subsequent release while relevant features remain.

Why: OBSERVED release `20261125-e2930d63426` supported complete interactive runs, and the manual scenarios exposed the Atlas blank-globe defect plus important economy, save, visual, input, localization, and balance evidence. The owner explicitly requires these scenarios to remain in subsequent release testing.

Do:

1. Encode the test inventory in `engineering/gaming/PRODUCTION_GAME_STANDARDS.md` into a versioned QA checklist with result, release, browser/device, locale, timestamp, seed/run ID, evidence, defect link, and reviewer.
2. Keep manual interactive tests for visual/world behavior; automate deterministic simulation/accounting/lifecycle checks. Automated assertions never replace live 3D review.
3. Mandatory release cases:
   - `/_channel` at start/end and five canonical English URL reach checks;
   - Granada harvest, market round trip, repair/water/mill, tabs, speeds/pause, documented keys, camera/picking, build/invalid, save/reload, full win and neglect loss, landmarks/bridge/walkers/carts, seasons/weather/audio, memory soak;
   - Golden Age all three chapter wins, invalid/valid placement, forecast reconciliation, non-function reason/fix, research/unlocks, endowments, museum link, competent trade win, heavy-tax trade-only loss, scenario save isolation, keyboard/camera/plan, city visuals and soak;
   - Atlas five daily rounds with mouse/keyboard/typed coordinates, hint and century, per-round/total scoring, battle/siege mapping, round transition render, mid-run/completed persistence, 25 practice rounds, layers/timeline, edge pins and soak;
   - English full, Arabic/Urdu RTL, other locale spot checks, 1280×800, target resolution, keyboard focus, audio, reduced motion.
4. Add visual acceptance frames matched to all three attached targets. Review both overview and close-ups; annotate intentional adaptations.
5. Block release on any blocker/major defect, blank renderer, wrong scenario/save, failed core loop, broken locale/input, memory crash/leak, or missing target-system acceptance.
6. Publish a concise release test report; never self-certify “fun for hours” from automated tests. Use human playtesting for comprehension, pacing, enjoyment, difficulty, and replay motivation.

Done when:

- CI/manual release template contains all cases with no silently skipped core test.
- A candidate release cannot be promoted without release ID, evidence, and signed acceptance for target visuals, gameplay, accessibility, localization, memory/performance, and historical content.
- The Atlas blank-round case has a permanent regression that fails before reload can mask it.
- The two Chapter 3 trade strategies remain permanent balance regressions while those mechanics exist.

## PROMPT 12 — Production release acceptance and handoff — priority P1 — size M

Goal: Deliver a verifiable final-production release package rather than another visually improved prototype.

Why: OBSERVED: the current games are functional prototypes with real strengths, but large target-image and content gaps remain. The owner needs a complete, testable handoff with no ambiguous “mostly done” claims.

Do:

1. Maintain a requirement traceability matrix: target-image component, requested production feature, scenario/content requirement, implementation location, manual test, automated test, evidence, status, and owner decision.
2. Produce comparable target/live screenshots at exact target resolutions plus 1280×800, short captures of day/night and all seasons, weather/water causality, people/vehicles/animals, construction, audio states, and crisis/recovery.
3. Supply a content manifest: scenarios, missions, events, buildings, units/agents, resources, production chains, research, diplomacy/trade, layers, clues, locales, sources, audio, accessibility, graphics presets, and save versions.
4. Supply a technical validation pack: `_channel`, canonical URLs, supported browsers/hardware, performance budgets/results, 60-minute and 4-hour soak evidence, heap/resource counters, context-loss test, offline/static-host test, save migration/recovery, and known limitations.
5. Supply the completed regression report from Prompt 11, including all wins/losses and Atlas daily/practice coverage.
6. Remove placeholder/dead content and prototype labels only after owner approval of the evidence package. Do not call the build final with target systems missing behind future-work flags.

Done when:

- The owner can open the five canonical URLs and reproduce the approved visuals and core scenarios without special tools.
- The traceability matrix has no unapproved missing item.
- There are no open blocker/major defects; accepted lower-severity issues are listed with impact.
- The games pass production standards, source/content review, accessibility/localization checks, and performance/memory gates.
- Release documentation clearly states what is final, what is intentionally out of scope, and what evidence supports the claim.
