# islam.museum independent local-Mac game retest and production-gap report

Release tested: `20261125-e2930d63426`  
Interactive session: 2026-11-25, approximately 21:00–21:30 EST  
Target-image comparison added: 2026-11-25 after the live run

The three attached images are treated as approved product/visual targets, not as evidence of what UAT currently renders. Findings labeled **OBSERVED** come from the live connected-Chrome session. Proposed production work is labeled **SUGGESTION**.

## A. Reach

The exact `_channel.current` value rendered in the same connected local Chrome instance was `20261125-e2930d63426`. The final recheck returned the same value. Previous was `20261125-484ead40122`; commit was `e2930d634267ed5673965ed10fe213b346584ad4`; `updatedAt` was `2026-11-26T01:43:43.401Z`. No release change was observed.

Environment:

- ChatGPT Desktop Local Work controlling the user's real connected Google Chrome on the Mac through the browser extension—not a cloud/headless browser.
- macOS 27.2.1 (build 26B131).
- Chrome version was not available through the authorized surface; not checked.
- Observed browser frame was approximately 1728×866 CSS pixels. A separate 1280×800 resize was not completed.
- Pointer/trackpad-equivalent and keyboard input were used.
- GPU model, WebGPU availability, hardware acceleration, renderer API, FPS, frame time, heap, and console were not checked. Visual 3D is not treated as proof of hardware acceleration.
- Music controls were visible, but the browser-control surface supplied no audio evidence; sound was not audibly verified.

| Exact English URL | Loaded | Could interact | 3D | Approx. active minutes | Furthest progress | Exact error |
|---|---:|---:|---|---:|---|---|
| Granada — `https://uat-games.islam.museum/granada/?lang=en&fresh=1` | yes | yes | yes | ~12 | Completed a full winning 96-day year; separate full neglect loss; save/reload checked | none |
| Golden Age ch. 1 — `https://uat-games.islam.museum/golden-age/?lang=en&fresh=1` | yes | yes | yes | ~6 | Won after 24 seasons; 220/220 households, welfare 76, learning 302/200, treasury 75 | none |
| Golden Age ch. 2 — `https://uat-games.islam.museum/golden-age/?lang=en&scenario=house-of-books&fresh=1` | yes | yes | yes | ~5 | Won after 20 seasons; 308/308 households, welfare 78, learning 533/480, treasury 298 | none |
| Golden Age ch. 3 — `https://uat-games.islam.museum/golden-age/?lang=en&scenario=what-endures&fresh=1` | yes | yes | yes | ~8 across two runs | Competent win after 20 seasons plus separate trade-heavy loss after 20 seasons | none |
| Atlas — `https://uat-games.islam.museum/atlas/?lang=en` | yes | yes | yes, then one blank-canvas failure | ~4 | Completed all five daily rounds; 2,619/5,000 | globe disappeared after Round 2→3 until reload |

The requested target minutes were not all reached. These are approximate agent-driven active interaction times, not human retention data. All Golden Age scenarios and Atlas completed earlier than the suggested time budget; Granada received the longest run.

## B. Claimed regression changes

| ID / claim | Result | Observation and evidence |
|---|---|---|
| G-C01 — lime-washed houses with clay-tile roofs | **CONFIRMED** | Several near/far houses showed light plaster walls and warm clay-tile roofs. Material variation was limited compared with the Granada target. |
| G-C02 — mosque with square minaret near square | **CONFIRMED** | Visible mosque/minaret geometry was located in the village context. It is much less authored/dominant than target landmarks. |
| G-C03 — watermill at west channel end, northeast of wheat field | **CONFIRMED** | Mill was found at the branch/field edge and selected visually in close view. |
| G-C04a — mill visibly loads after start | **CONFIRMED** | A more detailed mill was visibly present after 3D load. |
| G-C04b — mill authored in Blender | **NOT CHECKED** | Authoring provenance cannot be established from sight and repository inspection was prohibited. |
| G-C05a — wheel turns with flowing water | **CONFIRMED** | After repair, two close frames showed the wheel in different rotational positions while water was visibly present. |
| G-C05b — wheel turns only when flowing | **NOT CHECKED** | A close no-flow frame before repair was not captured; reverse transition could not be proven. |
| G-C06 — three-arch stone bridge carries road north | **CONFIRMED** | Close view showed a stone-textured three-arch bridge and continuous roadway across the river. Compass-precise direction was not independently measured. |
| G-C07 — ox-carts move on two main roads | **NOT CONFIRMED** | Both routes were specifically watched; two distinct moving cart routes were not clearly observed. |
| G-C08 — walkers lean foot-to-foot | **NOT CONFIRMED** | Walkers changed position, but foot-to-foot lean could not be distinguished from the available view. |
| G-C09 — teal interface with gold lines | **CONFIRMED** | HUD and panels used dark teal/navy surfaces with gold borders/accents. |
| Golden Age — nothing changed | **NOT CHECKED** | No prior comparable interactive build was used; absence of change cannot be established from current UAT alone. |
| Golden Age ch. 3 — trading strategy wins every time | **NOT CONFIRMED** | Competent trade/endowment run won, but a trade-heavy Heavy-tax run finished with 2,248 treasury and Trade 72 yet lost all non-treasury goals. One win and one loss do not establish universal balance. |
| A-C01 — lit sphere | **CONFIRMED with major defect** | Initial/reloaded globe was a shaded 3D sphere and accepted rotate/zoom/pin input. After Round 2→3 it became a blank beige canvas until reload. |
| A-C02 — incorrect Battle/Siege event-to-place scoring removed | **CONFIRMED for one sampled record only** | “Battle of Ihtiman” revealed “Ihtiman.” No Siege clue appeared. This does not prove the full dataset. |

## C. Findings — most serious first

### C1. Defects

#### DEF-AT-001 — Atlas — major — globe disappears after round transition

- Label: **OBSERVED**
- Release/URL/language: `20261125-e2930d63426`; Atlas canonical URL; English.
- Preconditions: daily challenge progressed through two submitted rounds.
- Reproduction:
  1. Complete Round 2.
  2. Select **Next round** to open Round 3, “Battle of Ihtiman.”
  3. Observe the full globe/canvas region.
- Expected: the shaded interactive globe remains visible and accepts a Round 3 pin.
- Actual: the entire globe region became a flat beige blank while the question panel, zoom buttons, inputs, and music control remained. Waiting approximately 1.8 seconds did not recover it. Reloading the same URL restored the globe and preserved Round 3.
- Reproducibility: observed once in the completed five-round run; reload recovery was 1/1. More transition cycles are required.
- Evidence: live in-tool screenshots before and after reload; no exported screenshot file.
- Correction: preserve/restore the renderer, scene, camera, canvas size, render loop, assets, and WebGL context across every round/result transition; add lifecycle regression and visible recoverable error state.
- Retest: 100 consecutive daily/practice transitions with no blank canvas, context accumulation, reload requirement, or state loss.

No other confirmed blocker/major functional fault was found in the exercised core loops. The remaining items below are production gaps and suggestions rather than falsely labeled defects.

### C2. Granada — observed gameplay, usability, and depth

- Opening was understandable: the mill field would spoil in 15 days, an olive branch was broken, and the river meadow lacked water. Initial state was Spring day 25, 1,200 dinars, 36 food-days, 60/60 households, welfare 60, water pool 150/300, store 220/420, timber 120, stone 80.
- Harvesting the mill field with the sell-overflow option advanced one day and produced clear feedback: 200 stored, 120 sold, zero spoiled; treasury rose to 3,263 and the First Harvest objective completed.
- Broken-branch repair visibly cost 140 dinars and 10 stone and said “12 days of work.” After three calendar days of worker progress, branch flow rose from 5/day broken to 14/day and the objective completed. This is not treated as a duration defect because worker-days may differ from calendar days.
- Immediate wheat round trip used visible buy 26/sell 18 and lost eight dinars. No free-money exploit appeared.
- Normal/fast/pause worked; `N` advanced a day; `1`–`5`, `P`, `N`, `H`, `O`, and `Home` mapped to the displayed modes/camera/help. Focused-input shortcut behavior was not checked.
- Building house, granary, and channel extension had clear resource consequences. A granary increased store capacity 420→920. Insufficient-resources orders disabled with a useful reason and did not consume resources.
- Save/reload without `fresh=1` restored observed day, resources, households/capacity, welfare, pool/store, quests, crops, repair, and construction progress.
- Competent run completed all quests and the full year. Neglect run visibly spoiled crops, exhausted food/store, lost households, reduced welfare to 25, and produced a failure outcome with unmet-goal explanation.
- Agent impression: the present loop is coherent and readable but its genuinely new decisions are front-loaded. It is a strong prologue, not the hours-long kingdom shown in the target.

### C3. Granada — exact gap versus attached target

The 1536×864 target contains interactive-looking systems and visual elements that are absent or much smaller in UAT:

- named kingdom/capital/Alhambra and regional nodes Málaga/Almería;
- a large dense city and palace/castle complex, walls, towers, gates, gardens, construction, scaffolding, and defense/security;
- Overview/Economy/Agriculture/Construction/Diplomacy/Defense/First-person/Photo navigation;
- top resources including trade income plus historical date/season and full speed/settings strip;
- market with commodity inventory, buy/sell/trend/demand;
- merchant contracts and route/transport/profit calculation;
- objective journal with simultaneous strategic/civic/economic decisions;
- production chains from raw crops through processing/warehouse/export;
- regional map and layer filters;
- castle/culture/garden/infrastructure catalogs;
- materially denser authored fields, orchards, roads, workers, carts, buildings, river detail, mountains, atmospheric depth, and seasonal color.

Matching the screenshot therefore requires far more than more buildings. It needs the strategic layers, production/trade/diplomacy/defense systems, regional campaign, construction states, living population, and interface hierarchy behind the image.

### C4. The Golden Age — observed gameplay, balance, and usability

- All three scenarios began from different authored resource/objective states and completed successfully.
- Chapter 1: valid canal sequence restored dry houses; invalid disconnected canal was refused with “A canal must start at the river bank or at a canal already dug,” without treasury loss. Forecasts and season results were readable. Final: treasury 75, grain 172, households 220/220, welfare 76, learning 302/200, water 90/39.
- Chapter 2: built library, workshop, market, housing, bath, schools, canals, farms, granary, and water research. Final: treasury 298, households 308/308, welfare 78, learning 533/480; the district flourished.
- Chapter 3 competent run: extra market/workshop doubled visible Trade 36→72; canals fixed two dry houses; four endowments were completed; storage/farms/crop research stabilized food; hospital and schools raised welfare/learning. Final win: treasury 384, grain 298, households 408/408, welfare 74/64, learning 622/520, water 120/58, four endowments.
- Chapter 3 poor trade run: added market/workshop, used Heavy tax, and ignored housing, endowments, learning and welfare. It ended with treasury 2,248 and Trade 72 but failed at households 204/380, welfare 51/64, learning 250/520, zero endowments. Trade was lucrative, not a universal win button.
- Ledger/forecast is the strongest production-ready information design. It clearly decomposes water, food, money, people, welfare, and learning.
- The plan overlay makes all plots/canal links buttons and is a legitimate accessible gameplay path. Full Tab/Shift+Tab/VoiceOver traversal was not completed.
- One museum link opened correctly: “Al-Karaji's levelling and tunnel-alignment methods” matched its islam.museum destination.

### C5. The Golden Age — exact gap versus attached target

The 1672×941 Baghdad target shows a production city-builder that UAT does not yet match:

- a city-scale river Baghdad with multiple bridges, quays, boats, gardens, dense neighborhoods, markets, farms, walls, domes/minarets, smoke, workers, carts, and horizon depth;
- top strip for city identity/date, treasury, food, water, population, materials, and knowledge with rates;
- left Economy/Population/Research/Trade/Diplomacy modes;
- right Research & Development with active progress/time and multiple development objectives;
- large named scholarly construction with progress, workers, materials, and days remaining;
- bottom categories for construction/infrastructure/scholarly/economy/housing/public services/military and richly illustrated building cards;
- city overview metrics for prosperity, welfare, health, education/culture, and infrastructure;
- minimap/layers and a recognizable Baghdad layout;
- visible construction scaffolding, boats/river traffic, water wheels, markets, labor, and landmark-scale authored architecture.

The current 8×6 district and shared building palette are useful simulation prototypes but not a visual or systemic match. Chapters need distinct world composition, systems, events, institutions, and multi-hour arcs—not only different objectives and starting values.

### C6. Atlas — observed gameplay, scoring, and usability

Five daily rounds completed:

| Round | Clue | Input | Guess | Reveal | Result |
|---:|---|---|---|---|---|
| 1 | “al-Duz takes Lahore and is killed” | keyboard globe pin; region hint; century estimate | 30.0° N, 40.8° E; 1101–1200 | Lahore; 1214 CE | 0 points; 3,197 km; century one away |
| 2 | “Toktogul Satylganov” | typed coordinates | 42.8° N, 74.3° E | Toktogul; 1933 | 784 points; 149 km |
| 3 | “Battle of Ihtiman” | direct globe click | 27.0° N, 8.0° E | Ihtiman; 1355 | 8 points; 2,232 km |
| 4 | “Khalil Ahmad al-Saharanpuri” | typed coordinates | 29.97° N, 77.55° E | Nanauta; 1852 | 1,000 points; within record precision |
| 5 | “First Anglo-Mysore War” | typed coordinates | 12.97° N, 77.59° E | Mysore; 1767 | 827 points; 125 km |

Total was 2,619/5,000; arithmetic was correct. The coordinate input, keyboard disclosure, hint cost, reveal location/date, museum links, distance, and total are understandable. Practice mode was visible at the end but not played.

### C7. Atlas — exact gap versus attached target

The 1672×941 target includes major absent/less-developed systems:

- richly shaded/elevated terrain, mountains, rivers, political borders, clouds, atmosphere, and night-side city lights;
- Daily Challenge and Practice navigation;
- landmark/photo clue with zoom/fullscreen/search controls;
- three progressive historical clues with icons and completion states;
- terrain and historical-overlay panels, including eras, al-Andalus, routes, and historical cities;
- century timeline and construction-period selector;
- multiple hint types: broader region, eliminate century, extra context;
- previous rounds and running local score;
- much stronger cyan/navy information hierarchy and world-centered visual composition.

The UAT’s simple country-silhouette globe and text clue are usable, but not a close product match. The blank-round defect must be fixed before richer globe features are layered on.

### C8. Cross-game accessibility, language, speed, audio, and museum voice

- Arabic and Urdu Golden Age states rendered shaped RTL text and right-side panel organization. Native-language correctness was not assessed.
- English received full gameplay. French, Spanish, Turkish, and Indonesian were not checked.
- Selected/pressed states, disabled controls, status text, and modal outcomes were generally visible. Golden Age invalid actions and non-function causes were especially clear.
- Pointer response and simulation changes were subjectively prompt. Granada/Golden Age 3D appeared after brief load; Atlas initially took roughly three seconds. No FPS benchmark was taken.
- Audio controls were discoverable, but audible output was not available through the tool; audio content is not claimed.
- Museum voice was generally neutral and explicitly distinguished the fictional district from linked real records in the Chapter 3 brief. New disasters, politics, dates, institutions, or social claims need sources and respectful framing.
- Smaller-window behavior, VoiceOver, full keyboard traversal, reduced motion, graphics presets, console, GPU, WebGPU, and long memory soak remain untested capabilities, not passed checks.

## D. Play time

Times are approximate because only session endpoints were clocked precisely. The complete browser session ran roughly 21:00–21:30 EST and included setup, observation, analysis, localization, and target-independent checking.

| Game/run | Approx. active time | Progress/outcome | What ended play | Replay/loss coverage |
|---|---:|---|---|---|
| Granada competent | ~9 min | Full 96-day year; win; all five objectives | outcome | harvest, repair, irrigation, house, granary, channel, crops, full year |
| Granada neglect | ~3 min | Full 96-day year; loss; score 614 | outcome | no-action starvation/welfare/household loss |
| Golden Age ch. 1 | ~6 min | 24 seasons; win | outcome | one full run; persistence reloaded |
| Golden Age ch. 2 | ~5 min | 20 seasons; win | outcome | one full run |
| Golden Age ch. 3 competent | ~6 min | 20 seasons; win | outcome | trade, water, housing, schools, hospital, research, storage, four endowments |
| Golden Age ch. 3 poor trade | ~2 min | 20 seasons; loss despite 2,248 treasury | outcome | second fresh run, Heavy tax, market/workshop, no strategic development |
| Atlas daily | ~4 min | five of five; 2,619/5,000 | daily result | mouse, keyboard, typed coordinates, hint, century, reload recovery |

The short times reflect accelerated agent interaction and rapid scenario completion, not proof that a human will find the games engaging for these durations or for hours. Dedicated human comprehension, pacing, enjoyment, difficulty, and replay studies remain necessary.

## E. Developer prompts — at most 12, most valuable first

The following is the verbatim Claude Fable 5.2 Extra production handoff. It is duplicated in `claude-fable-5-2-corrective-prompts.md` for direct use.

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

## F. Granada's picture

The approved Version 3 image was supplied. Exactly three highest-impact changes follow.

### 1. Build the complete authored kingdom composition, not isolated hero assets

- Observed gap: the mill is visibly more detailed and materially richer than surrounding repeated houses/trees/terrain, while the target is organized around Alhambra, Granada, Málaga/Almería connections, dense irrigated Vega, walls/castle construction, river/bridge, and layered mountains.
- Change: produce a modular authored environment kit and recompose the whole playable map around those readable landmarks and regions. Include material/roof/wall variants, city density, palace/walls, farms/orchards, roads, riverbanks, bridges, ports/routes, scaffolding and damage/repair states.
- Would more Blender-authored assets help? **Yes, materially—but only as a coherent kit and composition.** More mill-quality one-off buildings without terrain, city hierarchy, regional scale, and repeated-asset variation would not close the gap.
- Acceptance: at 1536×864, a live comparable overview is immediately recognizable as the target kingdom; close views show non-repeating silhouettes/materials and no floating/intersecting geometry; landmarks are selectable and mechanically relevant.

### 2. Rebuild terrain, water, atmosphere, seasons, and lighting as a causal visual system

- Observed gap: UAT terrain is broad/faceted and comparatively flat in material/atmospheric variation; river/channel treatment, mountain depth, contact shadows, and environmental transitions are much simpler than the painted target.
- Change: layered terrain materials, wet/dry soil, authored riverbanks/channels, directional water/foam/reflections, snow mountains, haze/cloud shadows, sun/day-night, four seasons, wind/rain/dust/leaves, contact shadows/AO, and weather-linked surface/activity/audio changes.
- Would more Blender-authored buildings help? **Not enough by themselves.** Terrain, atmosphere, water, composition, and light currently limit the picture as much as buildings.
- Acceptance: scripted captures of day/night and all four seasons show coherent changes; stopping/restoring water changes wheel/flow/audio/production; target overview has comparable depth and lighting while meeting performance budgets.

### 3. Populate the world and target-matching UI with real interactive systems

- Observed gap: walkers moved but lean was visually ambiguous; two ox-cart routes were not confirmed; target contains dense workers, carts, markets, construction, production, contracts, security, regional map/layers, and broader mode navigation. Current tabs/quests are far narrower.
- Change: destination-driven people, seasonal clothing, carts/animals/birds, markets, construction crews, smoke/flags/crops, spatial sound, plus the target’s top resources/calendar, left strategic modes, right market/contracts/security/season panels, bottom production/build catalog, and regional minimap/layers. Every visible panel must drive gameplay.
- Would more Blender-authored buildings help? **Yes, when paired with animation, state variants, pathfinding, sound, and the strategic systems that make them operate.** Static density alone is insufficient.
- Acceptance: both main cart routes and several pedestrian/work cycles can be followed; construction and production visibly progress; panels have hover/focus/disabled/forecast/result states; the 1280×800 layout remains usable; a 60-minute soak stays stable.

## G. Questions for the owner

No immediate access blocker remains. Product decisions required:

1. Confirm that the three attached images are binding north-star specifications for composition and system scope, with responsive/accessibility adaptations allowed, rather than literal pixel-for-pixel overlays.
2. Approve the intended campaign lengths: recommended 15–30 minute tutorials, 30–60 minute scenarios, and at least one 3+ hour main campaign per simulation game; Atlas daily remains five rounds with unlimited practice/themed modes.
3. Approve historical scope and review workflow for disasters, diplomacy, conflict, disease, famine, unrest, institutions, clothing, architecture, dates, and maps. These cannot be safely filled from visual invention alone.
4. Select and document reference hardware/browser baselines and acceptable low/medium/high graphics presets so performance gates are enforceable.
5. Decide whether first-person/photo modes in the Granada target are required for initial production release or an approved later milestone. All other visible core strategic panels are treated as required.

Missing test capabilities—not owner decisions: audible sound capture, Chrome version, GPU/WebGPU diagnostics, FPS/frame timing, heap profiling, console inspection, VoiceOver, 1280×800 resize, French/Spanish/Turkish/Indonesian checks, and 4-hour soak.

## Appendix — evidence and coverage

### Evidence files

- `playtest-evidence-log.md` — running text evidence.
- `granada-v3.jpeg` — user-supplied target, not live-game evidence.
- `Atlas_ Historical World Challenge.png` — user-supplied target, not live-game evidence.
- `Abbasid Baghdad_ The Golden Age.png` — user-supplied target, not live-game evidence.
- No browser screenshots were exported as local evidence files. Live frames were observed in the computer-use tool; this report does not invent screenshot links.

### Completed coverage

- release channel start/end;
- all five canonical English URLs interactively loaded in local connected Chrome;
- Granada full win, full loss, economy, repair, water, buildings, invalid action, input/camera, landmark inspection, save/reload;
- Golden Age all three wins, chapter 3 separate trade-heavy loss, forecast/ledger, invalid canal, non-function reason, research, endowments, source link, plan/3D;
- Atlas all five daily rounds with three input methods, one hint, one century estimate, scoring arithmetic, persistence reload recovery, one Battle mapping;
- Arabic and Urdu rendered-state/RTL spot checks;
- target-image comparison for all three games.

### Not completed / limitations

- audible sound verification;
- full keyboard Tab/Shift+Tab/Enter/Space traversal and VoiceOver;
- focused-input shortcut suppression;
- smaller 1280×800 window;
- French, Spanish, Turkish, Indonesian;
- Atlas practice rounds and larger Battle/Siege sample;
- Granada pre-repair close-up proving the wheel stopped, both ox-cart routes, and unambiguous walker lean;
- FPS/GPU/WebGPU/console/heap/resource diagnostics and long soak;
- native-language review of Arabic/Urdu;
- human fun/retention/difficulty study.

### Final release recheck

At the end of the primary interactive session, `/_channel.current` still rendered `20261125-e2930d63426`; no release change was observed.

### Resume checkpoint

Next session should begin with Atlas 100-transition reproduction/profiling, 25 practice rounds, canonical Golden Age scenario-isolation reloads, Granada no-flow/flow mill capture and both cart routes, 1280×800 layout, full keyboard/VoiceOver, remaining locales, audible audio, and a 4-hour memory/performance soak on documented reference hardware.
