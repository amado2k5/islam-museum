# Granada — Production Game Design Document (GDD)
## Identity and differentiation
Genre: city and castle construction, regional economic simulation, real-time-with-pause strategy, historical campaign and creative sandbox. Player fantasy: steward a beautiful, vulnerable kingdom whose inhabitants, farms, trade networks and architecture have meaning. The historical setting is late Nasrid Granada, not an interchangeable fantasy skin. Golden Age is about long-term civilization development and knowledge; Dynasty about geopolitical governance; Silk Road about the merchant journey; Architects about design freedom. Granada's distinguishing proposition is **build a specific living kingdom, finance its growth through agricultural commerce and protect it against crises**. These systems interact in a single persistent state. Inspired by genre patterns in Anno, Manor Lords, Stronghold and Age of Empires, not their assets, rules, names or interfaces.

### Design pillars
- Beauty with purpose: a river is a water source, bridge a logistics edge, field a crop plot, tower a modular structure, caravan a shipment, symbol a real state projection. Decorative objects may exist but never pretend to be functioning systems.
- Decisions rather than chores: choose scarcity priorities, investment and routes; automate repetitive labor; no mandatory daily click harvesting.
- Fair pressure: signal risks before commitment, show causes after outcomes, provide proportionate recovery opportunities. No unexplained destruction of a long save.
- History without predetermined player failure: historical starts and sourced context; alternate outcomes clearly simulated. A successful negotiated settlement is as legitimate as military survival.
- Creative attachment: a city visibly develops because of player choices; architectural beauty and residents' needs complement economic depth.

## Player journey and pacing
| Stage | Player action and desired payoff | Proposed measure |
|---|---|---|
| 0–30 seconds | Camera sweeps from Alhambra to a modest playable village, grants control immediately; advisor points at water shortage | Can identify goal without reading a manual |
| 30–90 seconds | Select farm and connect irrigation or adjust labor; see real flow and yield preview | First meaningful action within 60s target |
| 2–5 minutes | Harvest a prepared plot; dispatch surplus at market; build a house or storage extension | Complete mini-loop and understand costs |
| 5–20 minutes | Choose local sale or mill investment; respond to food reserve warning | At least two viable paths |
| 20–60 minutes | Unlock neighboring market; secure first export contract; add a modular tower or civic building | Clear payoff, no repetitive waiting |
| First campaign | Navigate a seasonal crisis and diplomatic decision; build thriving district and complete a scored ending | Complete beginning, escalation, resolution |
| First week | New maps, different constraints, sandbox experimentation, shared designs | Voluntary revisit; no forced streak |
| Long term | Optimize multiple districts, build unique castles, experiment with weather/economic scenarios and mods | Mastery, creative expression, optional archived challenges |

### First scenario: Water for the Valley
Start as a fictional district steward in a curated historical setting. Proposed initial balance fixture: 60 households (240 simulated residents), 1,200 dinars, 120 timber, 80 stone, 500 food units, a partially grown field, a modest reservoir, 3 usable plots, market access and 24 available workers. These are test values, not historical figures. A broken irrigation branch constrains one plot. Offer a cheap repair with moderate yield and a more expensive channel expansion with higher long-term output; both viable. Explain the cost and visible water change. Harvest an existing ripe patch immediately instead of forcing a lengthy growing wait. Show free warehouse capacity and household reserve target. Sell only surplus or process some wheat into flour, then reinvest in one house and a granary. An optional merchant needs oil later; do not overwhelm first-time players with international shipping. End first chapter with an attractive progress reveal and optional free play. Tutorials are skippable, replayable and contextual.

## Camera and controls
Strategic region map (compressed travel geography), settlement 3D (local metric terrain), plot/build precision and first-person walking (same saved geometry at local fidelity). Keep simulation authoritative and separate from camera. Wheel zoom, drag pan, rotate, keyboard WASD/arrow alternatives, inspect and select, multi-select where useful, cancel, tooltips, remappable controls, UI scaling, pause and speed hotkeys. First-person mode has comfortable FOV, optional reduced motion and no forced head bob. Photo mode can pause simulation, hide HUD, set camera and time-of-day preview without changing canonical season. Never require pointer lock for essential management actions.

## Gameplay modes and launch boundary
| Mode | Release candidate minimum |
|---|---|
| Campaign | A complete authored 1475-inspired three-act campaign, 60–120 min target, 3 escalating crises and 3 distinct ending paths |
| Sandbox | One detailed local region with expansion, starting-budget/difficulty presets, free-build toggle and save/export |
| Defensive survival | One complete fictional pressure scenario with nonviolent options, civilian needs and recovery |
| Regional economy | Granada hub plus at least two verified external market nodes, transport and time/cost model; local explorable areas clearly identified |
| Daily challenge | Deterministic constraint scenarios, solver/validation, archive, share code; no verified online rank without backend |
| Creator | Data-only mod import and scenario/building blueprint editor or authoring kit with one working external example |
| Co-op | Future optional feature, not required for local release; no fake multiplayer |

Proposed content floor: 25 meaningful building/module types, 8 verified or explicitly fictional goods, 4 meaningful production chains, 12 authored quests including branching consequences, 3 distinct economic strategies, 2 local environmental districts (e.g. agricultural and urban). Counts are planning floors, not grounds to inflate with filler. Full multi-century campaigns, large explorable coastal cities and advanced online modes are later expansions subject to real results. World fidelity must be demonstrated in the first polished slice, not deferred to the end.

## Challenge and difficulty
Relaxed mode extends grace periods, simplifies forecasts and permits recovery grants; Standard models seasonal pressure, finite markets and upkeep; Expert tightens margins, labor and forecast uncertainty. No opaque difficulty-based cheating. Adjustable scenario options with clear scoring comparability. Reversible planning actions until commitment; undo for local creative edits only, not time-travel market abuse. Save at user-chosen checkpoints, rotating autosaves, explicit recovery. Win condition evaluator supports survival, stable welfare, prosperity, architectural achievements and diplomatic outcome. Wealth alone cannot bypass civilian needs. Avoid lock-in from one wrong action: emergency aid, restructure contracts, reduced consumption, lower-cost rebuilding or negotiated grace. If a scenario is lost, explain the decisive factors with an inspectable timeline and option to restore a checkpoint.

## First release definition
A full campaign playthrough, repeatable sandbox, validated daily scenario, secure extension, seven localized experiences and real measured high-fidelity rendering. Human players should understand the link between crop, market, treasury and building. The museum remains navigable, fast and unchanged for nonplayers. Release candidate is not synonymous with production approval.
