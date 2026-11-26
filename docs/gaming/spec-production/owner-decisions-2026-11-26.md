# The founder's decisions on the production handoff, 26 November 2026

_Sent by the founder in chat on 26 November 2026 (25 November, evening, in his own time zone), as one pasted text, in answer to the questions listed in [`README.md`](README.md). The text opens "Here is a decisive response you can send to Claude": it was drafted with his outside reviewer and sent by him, and it is taken as his. It is kept below exactly as it arrived, unformatted, and is never edited. What was done with it: [`../traceability.md`](../traceability.md), [`target-inventory.md`](target-inventory.md), [`production-plan.md`](production-plan.md), [`../historical-review/`](../historical-review/README.md)._

```text
Here is a decisive response you can send to Claude:
Claude, please record the following owner decisions in the production specification and traceability plan.
1. Status of the three target images
Yes. The three images are binding north-star specifications for:

* Overall composition and visual hierarchy
* Environment density and authored detail
* Menu and panel organization
* Visible gameplay systems
* Strategic scope
* World activity and atmosphere
* Production quality

They are not literal pixel-for-pixel overlays. Adaptations are allowed only for:

* Responsive layouts, including 1280×800
* Keyboard and accessibility requirements
* Arabic and Urdu RTL layouts
* Performance on supported hardware
* Historical accuracy
* Clearly documented product decisions

Every visible system in the images must either:

1. Be implemented as a functioning system;
2. Be replaced by an approved equivalent; or
3. Be recorded as an explicit owner-approved exception.

Do not reproduce controls as decoration. For example, a marketplace, production chain, timeline, terrain layer, construction catalogue, contract, research project or security panel must affect gameplay and the visible world.
The games must remain marked as prototypes until the binding requirements and production gates pass. Do not obtain “final” status merely by removing prototype labels.
2. Campaign and scenario lengths
Approved, with the following targets:
Granada

* Interactive onboarding/prologue: 15–30 minutes
* Individual scenarios: 30–60 minutes
* Main campaign: at least 3 hours for a first successful playthrough
* Optional extended/endless campaign: capable of supporting substantially longer play
* Multiple viable strategies and replayable scenario variations

The Golden Age

* Interactive onboarding: 15–30 minutes
* Each chapter or focused scenario: 30–60 minutes
* Main Baghdad campaign: at least 3 hours
* Additional replayable chapters, scenarios and challenge configurations

Atlas
Atlas should not artificially stretch its daily challenge:

* Daily challenge: approximately 5–15 minutes
* Themed challenge: 15–30 minutes
* Practice or expedition session: 30–60 minutes
* Unlimited practice and themed collections should allow hours of voluntary play

These are content and pacing targets, not reasons to add waiting, grind or repetitive clicks. Human playtests must verify the actual duration, clarity and enjoyment.
3. Historical review
AI may research, organize sources and draft content, but it must never approve its own historical claims.
Use this review structure:

1. Content author/researcher: prepares the claim, museum record and sources.
2. Named human subject-matter reviewer: historian, archaeologist, architectural historian or curator with relevant regional and period expertise.
3. Museum editorial approval: confirms wording, uncertainty, tone and suitability for publication.
4. Owner approval: approves product scope, not historical truth by itself.

Until named reviewers are appointed:

* Reuse only already approved islam.museum records.
* Do not introduce unsupported dates, clothing, architecture, borders, disasters, political claims, military details or social practices as facts.
* Clearly label fictional districts, simulations and alternate outcomes.
* Mark disputed or approximate history honestly.
* Treat disease, famine, conflict and unrest respectfully, with mitigation and recovery rather than spectacle.

Please create a historical-review ledger containing the claim, game context, source, uncertainty, reviewer, decision and approval date.
4. Performance machines and browsers
Use the following initial desktop production gates.
Minimum reference tier

* Mac: Apple M1 MacBook Air, 8 GB RAM
* Windows: Windows 11 laptop with Intel Core i5-1135G7 or equivalent, 8 GB RAM and integrated graphics
* Minimum practical viewport: 1280×800
* Primary target: 1920×1080
* Test device-pixel ratios of 1 and 2

Required browsers

* Chrome: current stable and previous stable
* Edge: current stable and previous stable
* Safari: current stable and previous stable on supported macOS
* Firefox: current stable

Chrome on macOS remains the main UAT reference, but passing only Chrome is not sufficient for production.
Mobile and tablet support are not required for the first production release unless separately approved. If unsupported, show a respectful, useful compatibility message rather than a broken interface.
Performance gates

* Target 60 fps during ordinary play
* Never remain below 30 fps during supported normal gameplay
* No progressive slowdown over a long session
* No blank canvas, unrecovered WebGL context, duplicate render loop or duplicate audio
* 60-minute repeated-action profile
* Four-hour interactive soak
* Memory must plateau after warm-up
* Investigate unexplained retained-memory growth above 10% across repeated identical cycles
* Stable counts for WebGL contexts, textures, geometries, materials, render targets, timers, workers, listeners and WebAudio nodes
* Background tabs must throttle and resume safely
* Low/medium/high presets must preserve gameplay and coherent visuals

Record the exact hardware, OS, browser version, resolution, quality setting, traces and memory evidence for every production candidate.
5. Granada first-person and photo modes
Both are required for the final production scope represented by the binding Granada target.

* Photo Mode is required for the first production release.
* First-person mode is also required before Granada can be called fully complete against the target.

If delivery must be staged, first-person mode may be scheduled after the main strategic camera and Photo Mode, but Granada must remain marked as unfinished until it passes its production acceptance criteria. Do not ship a disabled or placeholder First-Person button.
Photo Mode requirements

* Hide/show UI
* Camera movement, rotation, zoom and focal controls
* Time-of-day and weather preview where simulation rules allow
* Screenshot capture
* No accidental simulation changes
* Keyboard accessibility and visible exit control
* Stable memory after repeated entry and exit

First-person requirements

* Valid walkable navigation
* Collision, stairs, bridges, doors and terrain boundaries
* No walking through water, walls, people or buildings
* Safe return to the strategic camera
* Reduced-motion support
* Seasonal/weather/audio experience
* No simulation or save corruption
* Stable performance and memory

Atlas: account icon and “Compete”
Do not add accounts, authentication, global leaderboards or server-dependent score comparison.
Replace these target elements as follows:

* Account icon → Local Profile / Settings / Accessibility
* “Compete” → Challenge, meaning:
   * personal bests stored locally;
   * practice challenges;
   * themed challenges;
   * optional copyable result summaries;
   * optional same-device/pass-and-play challenges.

Do not imply that scores are compared globally.
Atlas: political borders
Do not show modern political borders during an unanswered daily round if they reveal the answer.
Instead implement:

* Physical terrain, rivers and mountains as normal layers
* Historically appropriate regions or boundaries only where reviewed and meaningful
* Historical-boundary overlays tied to the selected period
* Modern borders only after reveal, in educational/explanation mode
* An optional borders hint, if useful, with an explicit score deduction
* Clear labels where boundaries are approximate, disputed or time-dependent

This preserves the target’s layer system without making clues unfair or presenting modern borders as timeless.
The Golden Age: military category
Do not turn The Golden Age into a conventional military or conquest game.
Replace the target’s Military category with:

* Civic Resilience
* Public safety
* Fire response
* Flood protection
* Walls/gates where historically relevant
* Infrastructure protection
* Emergency food and water
* Disease response
* Caravan/road safety
* Diplomacy and negotiated security

If a historically sourced chapter involves siege, conflict or instability, represent it through city resilience, logistics, diplomacy, welfare and consequences—not tactical combat units unless I separately approve a military design.
Granada may retain Defense and border-readiness systems because they are part of its approved target, but they should remain strategic and historically reviewed.
Human playtesting requirement
The AI playtest is valid regression evidence but does not satisfy human usability, enjoyment or retention gates.
Before production approval, arrange:

* Early formative testing: at least 5–8 independent people per game
* Beta testing: at least 12–20 people across the three games, with meaningful coverage per title
* At least three Arabic/Urdu RTL testers, including native-language review
* A mix of museum visitors, strategy-game players and people unfamiliar with such games
* Keyboard-only and accessibility testing
* Long-session testing for pacing, fatigue and comprehension

Measure:

* Time to understand the first objective
* Time to first meaningful success
* Where assistance is required
* Whether players can explain consequences and scoring
* Difficulty and recovery from mistakes
* Repetition and boredom points
* Session length by choice, not forced waiting
* Desire to retry and the stated reason
* Performance and comfort problems

Do not use engagement manipulation or invent claims such as “players will play for hours” without human evidence.
Next instruction
Please now:

1. Update the traceability document with these decisions.
2. Mark the target images as binding with the approved exceptions above.
3. Produce a phased implementation plan with dependencies, estimates and acceptance gates.
4. Separate foundational engineering, production art, gameplay systems, historical content, accessibility/localization and QA.
5. Identify decisions that still require an owner response.
6. Keep all three games marked as prototypes until their respective production gates pass.
7. Continue running the permanent regression scenarios from the handoff on every subsequent release while the tested features remain.
```
