# The founder's third set of decisions, 26 November 2026: Granada's art direction

_Sent by the founder in chat on 26 November 2026, after the eight hours on Granada, in answer to the question left with him: whether the proof frame's direction (Set A, on `main`) or the second candidate (Set B, pull request amado2k5/islam-museum#8312) is accepted. He had put the choice, with links to both, to his outside reviewer (ChatGPT). What came back was a covering message that begins "I decided the direction for Claude" and a file of instructions, `claude-granada-art-decision.md` (SHA-256 `d09bc90a68a16e2c3f4c527bb23149e54ed6bc5596415e3a0009e1c2436147d4`), which he sent on. **It was drafted by the outside reviewer and sent by him; it is taken as his, as the second set was.** The file is kept below exactly as it arrived and is never edited. The covering message says the same in seven lines and adds that the reviewer looked at some of the local comparison renders. The earlier sets: [`owner-decisions-2026-11-26.md`](owner-decisions-2026-11-26.md), [`owner-decisions-2026-11-26-b.md`](owner-decisions-2026-11-26-b.md). One line of the file needs a fact beside it: where it lists as settled that "one controlled UAT-only rollback drill is authorized", that drill had already been run when the file arrived, and the approval is spent (decision D21 in the register); a further drill needs his word again. What was done with this one: [`art-candidates-granada.md`](art-candidates-granada.md) and decision D23 in [`owner-register.md`](owner-register.md)._

```text
# Owner decision for Claude: Granada art direction and next work

Claude,

Record and execute the following as the owner's decision. This resolves the choice between Set A on `main` and Set B in PR #8312. Do not ask the owner to choose again unless a new candidate meeting the gates below is ready for visual judgement.

## Decision

1. **Do not merge PR #8312 as it stands.** Keep Set A on `main` and UAT as the current known runtime baseline.
2. **Do not accept either Set A or Set B as Granada's production-quality art direction.** Set A is a valid running prototype/proof attempt with much of the target's broad composition, but its own evidence says it does not have the target's finish. Set B improves some individual procedural models, but it is not in the running game, has not been measured there, contains no new kind of building, deliberately preserves Set A's simple outer silhouettes, and still does not reach the target's density, architectural richness, material variation, vegetation, atmosphere, life, or scene-level finish.
3. **Treat Set B as reusable R&D only.** Its deterministic export work, validation, exact placement compatibility, LOD metadata, comparison tooling, and selected modelling details may be ported. Its generated geometry is not approved final art and must not become the template for mass-producing the rest of Granada.
4. **Create a new consolidated Candidate C from the latest `main`, not by merging #8312 wholesale.** Candidate C must be a real-time, interactive proof frame in the browser. It must combine the stable game and working systems from Set A with only the useful technical lessons from Set B, while replacing the visibly inadequate art with a genuinely target-quality hero slice.
5. **Use a hybrid professional-art pipeline for Candidate C.** Scripted Blender generation can support modular layout, variants, export, LODs, validation, and placement, but it has not proved that it can author the required finish by itself. The hero palace, estate, gate/wall segment, street cluster, construction detail, and key vegetation must be hand-authored or artist-reviewed. Curated licensed assets may be proposed, with an asset-by-asset source, licence, modification, attribution, file-size, triangle, texture-memory, and redistribution table before acquisition or import. Do not purchase anything without separate authorization.

## Why this is the decision

- Set A's proof record says the structure is present but the finish is not. It records only seven checklist lines met, five partly met, one awaiting visual judgement, and founder acceptance absent.
- Set B's own record says it is local-only, unhosted, not in the game, not measured in the game, and not judged against the target. The current loader would render the high and LOD objects together if the files were merely switched.
- The Set B comparison test proves names, origins, bounds, footprints, triangle ratios, and LOD metadata. It does not test visual quality, historic plausibility, composition, animation, UI integration, lighting, scene density, or similarity to the target.
- The representative local comparisons show a real but modest improvement: roof-tile ends, balconies/lattices, base courses, props, and small structural detail. They also show the same fundamental limitation: large simple planes, repeated procedural forms, sparse openings, shallow weathering, limited silhouette variety, and a palace far below the target image's visual richness. This is not enough to approve scaling the method across a whole game.
- Candidate C is therefore a replacement proof candidate, not “Set B integrated.”

## Immediate execution order

### 1. Preserve and classify Set B

- Leave #8312 unmerged and clearly label it `experimental art R&D — not a production proof`.
- Preserve its branch, commit SHA, local render checksums, model checksums, generator versions, Blender version, and test results as evidence.
- Produce a short salvage table for every changed file: `port`, `rewrite`, `retain only as evidence`, or `discard`, with one reason.
- Do not copy the duplicated `*3.py` pipeline into `main` unchanged. Consolidate reusable deterministic-export and validation improvements into the maintained pipeline when Candidate C needs them, with regression tests.

### 2. Build Candidate C as one complete hero slice

Start a new branch from the latest `main`. Do not produce a full building catalogue yet. Build only what the approved Granada proof camera can see, but build that view completely enough to judge the final production direction.

The frame must contain, in the same visual hierarchy and thirds as the binding Granada target:

- **Foreground:** an olive estate at harvest, detailed farmhouse/press/store, wheat or crop plots, irrigation channels with moving water and wet banks, working mill and wheel, carts/animals, workers, tools, baskets, ladders, produce, roads, walls, and dense planting.
- **Midground:** a dense town following believable streets and terrain, a market/civic focus, varied courtyard and street façades, walls, towers and gate, a construction site with meaningful scaffolding and crane activity, purposeful people and traffic, and no obvious repeated-grid or copied-house look.
- **Background:** a major palace/fortified complex that reads as the visual landmark rather than a row of simple blocks; terraced slopes, far settlement/port indication where the composition requires it, atmospheric depth, and the snow range.
- **Living environment:** moving water, wind-responsive vegetation/crops/cloth, smoke, cloud movement or cloud shadow, birds, and people/animals/vehicles whose activity follows the simulation state rather than decorative looping. Use the approved autumn/harvest state for the comparison frame.
- **Materials and architecture:** layered plaster and stone, believable roughness and normal detail, edge and base wear, dirt accumulation, roof variation, doors, screens, balconies, arcades/courtyards where appropriate, props, construction states, and silhouette variation. Blank openings, uniform large planes, floating geometry, water intersections, implausible slopes, and repeated procedural seams are defects.
- **Working interface:** the target-like top bar, objectives, selected estate/place panel, market/contract/production information, construction choices, regional/layer information, security/season information only where the underlying systems work. No painted-on or fake panel is allowed.
- **Interaction/state:** the estate and mill must be selectable; ordering a harvest and repairing/activating water must visibly change workers, crop/stock state, water/wheel state, and the live panels. At least one player-built structure must visibly progress through a construction state if that current system remains in scope.

The target is binding for composition, content categories, hierarchy, density, and finish, subject only to the already-recorded historical, accessibility, and product exceptions. Do not claim pixel identity to concept art; instead account for every important visible target element in a target-to-frame inventory as `matched`, `intentionally replaced with approved reason`, or `not yet matched`. A proof cannot pass with any important line silently omitted.

### 3. Integrate art correctly

- Candidate C must load from the normal build and media publishing path and run on UAT; local Blender renders alone are not evidence of a proof frame.
- Implement deliberate LOD selection so exactly one intended representation is rendered per object. Test transitions, shadows, collision proxies, selection, and material continuity. Do not load high and LOD meshes simultaneously.
- Use instancing and texture/material reuse where visually safe, but introduce enough authored variation to prevent repetition.
- Maintain collision, walkable surfaces, water boundaries, building footprints, selection anchors, construction states, and save compatibility.
- Record asset provenance and historical-review status. Keep the reconstruction and `historical review pending` labels until qualified people approve the relevant entries.

### 4. Produce the proof evidence

Candidate C must satisfy all fourteen proof-frame lines, not merely improve the buildings:

1. Capture and short recording from the running browser game on a named commit/release at 1920×1080.
2. Fixed camera composition comparable to the target.
3. Authored foreground, midground, and background.
4. Target-quality architecture and materials ready for owner judgement.
5. Terrain, water, vegetation, atmosphere, and lighting working together.
6. An animated group performing a real simulated activity.
7. Weather/environmental motion.
8. Working panels in the target hierarchy using real game state.
9. A selectable building/place.
10. A visible simulation state change caused by an order.
11. Side-by-side Low, Medium, and High captures of the identical state/camera.
12. Median, p95 and p99 frame time; long-frame counts; heap; triangles; draw calls; textures; geometries; materials; render targets; timers; workers; listeners; WebAudio nodes; machine, browser, viewport and preset.
13. Actual asset-production time plus revised cost/risk of scaling the accepted method.
14. Explicit owner acceptance of the direction. Do not infer acceptance from a merge, UAT deployment, passing tests, or silence.

Also supply:

- the target and Candidate C side by side at the target's native crop and at 1920×1080;
- a labelled close-up sheet for palace, street cluster, estate, gate/wall, mill, vegetation, people, construction and materials;
- a 60-second interaction recording showing selection and both state changes;
- a ten-minute repeated-state resource check to catch obvious allocation/lifecycle regressions (this is not a substitute for the later one-hour and four-hour gates);
- all commands, checksums, licences, known defects and missing items;
- a clear recommendation: `accept direction`, `revise direction`, or `requires professional/third-party art`, supported by the evidence.

Do not describe Candidate C as accepted, production-ready, final, or complete until the owner has reviewed this package.

## Stop/go rule for the art method

- If the first Candidate C hero palace, one street cluster, and the estate can reach the target's perceived finish with maintainable performance, continue to the complete proof frame.
- If they remain visibly like upgraded procedural boxes after one focused revision, stop iterating that method. Return with a concrete professional-artist or licensed-asset proposal, including exact assets/roles, costs if known, licences, modification work, performance budgets, and how the result will fit the game's simulation. Do not mass-produce fifty more inadequate pieces.

## Decisions already settled; do not reopen them

- The three target images are binding north stars with the documented product/history exceptions.
- Granada remains the production priority. The Golden Age follows, then Atlas. Golden Age/Atlas proof exploration and shared preproduction may proceed in parallel, but not full production without separately staffed teams.
- Photo Mode is required for Granada's first production release. First-person mode is required before Granada can be called complete; show no placeholder button.
- Granada defence is strategic walls/readiness/logistics/diplomacy with no tactical battle or graphic violence.
- Historical claims require qualified human review. AI cannot approve its own history. Unreviewed reconstructions remain labelled pending.
- Human testers and minimum-machine operators are still named-person dependencies. Prepare the packages and materials now; do not claim their gates passed.
- One controlled UAT-only rollback drill is authorized under the recorded ten safeguards. Production rollback or production deployment is not authorized.
- Production deployment and removal of prototype labels each require separate explicit written owner approval.

## Required response

Return with:

1. the Set B salvage table;
2. the Candidate C branch/PR and exact base/head SHAs;
3. the running UAT proof URL and release identifier;
4. the full fourteen-line evidence table;
5. side-by-side images and recordings;
6. test, performance, resource and lifecycle evidence;
7. the complete remaining-gap list with no “prototype” gaps hidden;
8. the recommendation on whether the art pipeline is now scalable or requires professional/licensed art.

Do not merge #8312, mass-produce assets, deploy to production, remove labels, or claim final quality while any of the above gates remain unmet.
```
