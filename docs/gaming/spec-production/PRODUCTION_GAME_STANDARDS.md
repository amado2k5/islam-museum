# islam.museum production-game standards

Status: repository-level product, engineering, art, content, QA, accessibility, and release standard for Granada, The Golden Age, Atlas, and future islam.museum games.

These rules convert the three approved target images and the 2026-11-25 UAT playtest into a production definition. The target images are visual/product specifications; they are not evidence of the current implementation. A release must demonstrate the requirements in the running game. “Prototype”, “demo”, “interim”, and visually approximate implementations are not production-complete.

## 1. Product principles

- The games are free, open, browser-native museum experiences. Do not add advertising, paid currency, loot boxes, gambling, pay-to-win, streak penalties, FOMO timers, accounts, required servers, or live multiplayer.
- Design for voluntary long sessions through strategic depth, discovery, authored scenarios, readable consequences, and varied outcomes—not manipulation or grind.
- The first meaningful choice must be reachable without reading external instructions. Objectives, controls, cause/effect, risk, scoring, recovery, and improvement paths must be visible in the game.
- Default difficulty is moderate and forgiving. Add optional challenge settings only after the base game is clear and completable.
- Every historical assertion shown as fact needs an islam.museum record or approved source. Clearly distinguish sourced history, uncertain/contested history, and fictional simulation.
- Seven locales remain first-class: English, Arabic, Urdu, French, Spanish, Turkish, and Indonesian. Arabic and Urdu are true RTL layouts, not mirrored screenshots.

## 2. Target-image fidelity

The attached targets are:

- `granada-v3.jpeg` — 1536×864.
- `Abbasid Baghdad_ The Golden Age.png` — 1672×941.
- `Atlas_ Historical World Challenge.png` — 1672×941.

For each game, maintain a target-to-build checklist covering every visible panel, mode, world landmark, information hierarchy, resource, animation cue, and interaction. At the target resolution and at 1280×800, production screenshots must preserve the target's recognizable composition and feature density without clipping or unreadably shrinking text. Exact data values and live camera frames may differ, but missing target systems may not be disguised with decorative imagery.

Before release, capture comparable in-game frames and perform side-by-side review. Acceptance requires:

- recognizable world composition, authored landmarks, terrain, water, vegetation, activity, lighting, atmosphere, and material richness;
- equivalent menu/panel hierarchy and strategic information density;
- equivalent interactive systems behind visible panels—no dead controls or decorative-only production chains;
- selected, hover, focus, disabled, warning, progress, forecast, and completion states;
- no overlap, clipping, inaccessible controls, or reliance on browser zoom.

## 3. Living-world simulation

All three games must feel alive where appropriate to their design.

- Time: real simulation clock with pause and readable speed controls. Day, dusk, night, dawn, sun position, sky color, artificial lights, and shadow direction/intensity change coherently.
- Seasons: spring, summer, autumn, and winter change ground color, crop state, foliage, water demand, clothing, cloud cover, day length, sun angle, ambient color, and relevant rules. Changes interpolate or transition cleanly.
- Weather: clear, cloud, rain, wind, heat, dust/sand, fog, and storms where geographically and historically appropriate. Weather affects surfaces, vegetation, visibility, water, production, movement, risk, and sound. Snow is used only where the environment supports it.
- Water: visible directional flow, surface motion, foam/turbulence where justified, banks/wetness, reflections appropriate to the art style, and causal response to gates, channels, damage, drought, rain, or repair. Water wheels turn only when water reaches them.
- People and transport: pedestrians have destinations, pathfinding, foot placement, turn/avoidance behavior, varied speed, work/rest cycles, clothing appropriate to locale/season/status, and reactions to weather/events. Carts, animals, boats, and construction crews use valid routes and do not slide, overlap, float, or cut through buildings.
- Ecology and ambience: birds, insects, livestock, smoke, leaves, cloth, dust, fountains, crops, and trees react to time and weather without excessive repetition.
- Sound: discoverable volume/mute controls; separate music, ambience, voice, and effects where practical. Add localized spatial ambience—people, markets, tools, carts, mills, water, wind, birds, rain, construction, boats, and alerts. Background music alone is insufficient.
- Events: news bulletins and world reactions connect events to gameplay. Disasters and crises are not random punishment; they are forecast when fair, have mitigation choices, produce visible consequences, and allow recovery.

## 4. Physics, placement, and world integrity

- Every placeable object validates terrain, slope, footprint, clearance, access, collision, water, road/canal connection, zoning, and world bounds before resources are spent.
- Never allow houses on water, structures in mid-air, buried doors, intersecting roofs, floating workers, roads through walls, disconnected bridges, boats on land, or crops through buildings.
- Show a valid/invalid placement ghost and a specific reason. Refusal never consumes resources.
- Construction has a site state, labor/material requirements, path access, progress, visible scaffolding/staging, completion transition, and safe cancellation/undo rules.
- Dynamic objects use believable acceleration, stopping, turning, collision avoidance, and slopes. Gameplay uses stable, deterministic approximations where full physics would harm performance; visual results must still make sense.
- Navigation meshes/graphs and collision data update after building, demolition, flooding, damage, and repair.

## 5. Gameplay and scenario standard

Every campaign must support a multi-hour arc without repeating one profitable click. Each game needs onboarding, short missions, medium scenarios, long campaigns, replayable procedural or shuffled situations, and an endless/practice option where appropriate.

Each scenario defines:

- opening state and story premise;
- visible primary and optional goals;
- loss/failure conditions and recovery paths;
- at least three materially different viable strategies;
- counter-pressure against one dominant strategy;
- authored events plus bounded variability;
- score components and an explanation of how to improve;
- meaningful midgame escalation and endgame decision;
- sourced historical context and clearly fictionalized simulation rules;
- deterministic seed in QA builds and saved seed in player saves.

Events may include drought, flood, storm, fire, earthquake, crop disease, human disease, famine, market shock, caravan delay, border tension, unrest/riot, labor shortage, damaged infrastructure, discovery, visiting scholars, diplomacy, or construction setback only when the location/time framing is appropriate and sourced. Avoid sensational or dehumanizing treatment. Disease, famine, and unrest require respectful language, mitigation, and recovery—not spectacle.

## 6. UI, onboarding, and accessibility

- Reproduce the target images' high-level menu organization: top resource/calendar strip; left mode navigation; contextual objectives/details; world-centered interaction; bottom build/action catalog; right contextual systems; minimap/layers where shown.
- Do not overload the first minute. Reveal complexity progressively while keeping advanced systems reachable.
- Every number that changes has an explanation, forecast, and ledger entry. Every disabled control explains why. Every destructive/reset action requires clear confirmation.
- Mouse, trackpad, and keyboard can complete all essential actions. Maintain logical Tab and Shift+Tab order, visible focus, Enter/Space activation, Escape close, no keyboard traps, and no global shortcut while typing in an input.
- Canvas interactions have accessible alternatives: plan/list navigation, labeled selected object, coordinate input where relevant, and announced result/status text.
- Support reduced motion, high contrast, text scaling, independent audio controls, and color-independent status cues.
- At 1280×800 and the target desktop resolution, all essential controls remain reachable. Use scrolling inside panels rather than clipping the game.
- Do not claim screen-reader compatibility until tested with VoiceOver and documented.

## 7. Save, route, and release integrity

- Saves are device-local, versioned, atomic, recoverable, and scoped by game, scenario/chapter, language-independent simulation state, and run type (daily/practice/campaign).
- `fresh=1` resets only the intended disposable run after explicit UI confirmation where used outside QA. Normal routes never overwrite another scenario.
- Reload restores scenario, seed, time/season, resources, objectives, buildings, construction, research, events, camera-independent selection state where useful, and completed result.
- Invalid or future save versions fail safely with a readable recovery choice; never silently mix scenarios.
- `_channel` identifies the exact release. QA artifacts record it at start and end.
- Remove “Prototype”, “demo”, or “not a finished game” labels only after all production gates pass; do not merely rename an unfinished build.

## 8. Performance, memory, and browser stability

Define and publish supported desktop/browser baselines before final optimization. Minimum gates:

- Smooth interaction at 1280×800 and target resolution on the reference Mac/Chrome configuration; target 60 fps and never sustain below 30 fps during normal play.
- No unbounded growth in JS heap, DOM nodes, event listeners, timers, workers, WebAudio nodes/contexts, WebGL resources, render targets, textures, geometries, materials, animation mixers, or cached assets.
- Dispose replaced scenes, geometry, textures, materials, framebuffers, audio buffers, observers, subscriptions, and listeners. Cancel animation frames/timers/workers on teardown. Pause or throttle simulation/rendering when the tab is hidden.
- Support WebGL context loss/restore. Avoid creating multiple live contexts during route changes or round transitions.
- A 60-minute repeated-action test and a 4-hour soak must show a plateau after warm-up; retained heap must not grow monotonically. Investigate any repeated-cycle retained growth over 10% unless explained by bounded caches.
- Repeating Atlas rounds, switching Golden Age chapters, restarting Granada years, changing locales, resizing the window, and opening/closing panels 100 times must not crash or progressively degrade.
- Test with Chrome performance/memory tooling on an authorized reference machine; record versions, trace, heap snapshots, GPU/context events, and visible symptoms. Automated tests supplement but do not replace the interactive soak.
- Asset streaming uses bounded concurrency, cancellation, fallback/error UI, compression, LOD, texture budgets, and cache eviction. Loading never leaves a permanent blank canvas.

## 9. Required regression matrix

Each release must run and record at least:

### Release and reach

- REL-01: open `/_channel`; record exact current release at start and end.
- REL-02: interactively load the five canonical English URLs in connected desktop Chrome.
- REL-03: verify actual 3D renderer, then exercise fallback/accessible plan deliberately.

### Granada

- GR-01 onboarding and initial resources/objective.
- GR-02 ripe-field harvest/sell and feedback.
- GR-03 broken-channel inspection, repair cost/work, visible work state, post-repair water, and mill-wheel causal transition.
- GR-04 all tabs/modes; market buy/sell immediate round trip.
- GR-05 normal/fast/pause plus `1`–`5`, `P`, `N`, `H`, `O`, and `Home`.
- GR-06 drag/turn/zoom/pick visible field and verify selected state.
- GR-07 build valid/invalid structures; placement/physics/collision rules; no resource loss on refusal.
- GR-08 save/reload without `fresh=1` and compare full state.
- GR-09 complete a winning year and a separate neglect/failure year.
- GR-10 inspect houses, mosque/minaret, mill, three-arch bridge, walkers, and both cart routes.
- GR-11 four-season/day-night/weather/water/audio visual pass.
- GR-12 60-minute economy/renderer soak and repeated restart leak test.

### The Golden Age

- GA-01 play all three canonical scenarios from their brief to win or loss.
- GA-02 valid/invalid canal and building placement, disabled explanations, Undo, and resource integrity.
- GA-03 compare forecast with actual season results for water, food, money, households, welfare, and learning.
- GA-04 verify non-functioning building explanation and restoration after its missing dependency is supplied.
- GA-05 research selection/completion/unlock, library/school learning, hospital/public-health effects.
- GA-06 chapter 3 endowment costs/upkeep effects and four-endowment win.
- GA-07 chapter 3 profitable trade run plus separate trade-heavy failure run. Record trade, treasury, welfare, learning, households, and goals.
- GA-08 save/reload the correct canonical scenario route and confirm state/scenario isolation.
- GA-09 museum-source label/destination check.
- GA-10 keyboard/camera/plan accessibility and 1280×800 layout.
- GA-11 construction animation, people/boats/carts/weather/day-night/audio and placement integrity.
- GA-12 repeated scenario/locale switches and 4-hour memory/renderer soak.

### Atlas

- AT-01 complete all five daily rounds.
- AT-02 place pins by direct mouse, keyboard+Enter, and typed coordinates.
- AT-03 use a region hint and a century estimate; verify cost and summary.
- AT-04 validate per-round distance/score and total arithmetic.
- AT-05 for every “Battle of X”/“Siege of X” in the sample, compare clue and revealed place.
- AT-06 drag/rotate/zoom, edge placement, pin alignment, layers, overlays, and timeline.
- AT-07 advance every round and verify the globe never disappears; reload must not be required.
- AT-08 reload mid-run and after completion; verify daily persistence and practice isolation.
- AT-09 run at least 25 practice rounds across event/person/place/landmark categories.
- AT-10 100 round transitions, 100 locale switches, resize cycles, WebGL context loss, and memory soak.

### Cross-game

- XG-01 English full run; Arabic and Urdu RTL; spot-check French, Spanish, Turkish, Indonesian.
- XG-02 Tab/Shift+Tab/Enter/Space/Escape and documented shortcuts; visible focus; no traps.
- XG-03 1280×800 and target resolution; no clipping/overlap/unreachable controls.
- XG-04 mute/volume, music, ambience, effects, tab-background behavior.
- XG-05 save migration/corruption recovery, offline/static hosting behavior, and no network dependency beyond museum links.
- XG-06 target-image comparison with signed-off side-by-side frames.

## 10. Definition of done

A game is production-complete only when:

- its target-image checklist is implemented in interactive systems and approved with comparable screenshots;
- its main campaign provides a coherent multi-hour arc and at least three viable strategies;
- all required scenarios, modes, languages, input methods, save/reload paths, and failure paths pass;
- the living world, weather, time, seasons, water, animation, sound, placement, and feedback are visibly causal;
- there are no open blocker/major defects and minor/polish issues are explicitly accepted;
- the performance and memory gates pass on documented hardware/browser baselines;
- historical content has source review and simulation fiction is labeled;
- the release does not call itself final while retaining prototype disclaimers, placeholder visuals, dead panels, or missing target systems.

This standard must be referenced by future implementation prompts and release checklists. If a future game intentionally diverges, document the approved product decision and replacement acceptance criteria; do not silently waive the standard.
