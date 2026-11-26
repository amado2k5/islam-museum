# The production handoff of 25 November 2026

The founder gave this as one archive, `islam-museum-claude-production-handoff.zip` (SHA-256 `7710c853a53b6b946ef3902c378b2f76aac5cdc5c9a853c9d2e7421057b3375b`), with no other word. It is what an outside AI reviewer (ChatGPT desktop, driving Chrome on the founder's own Mac) wrote after **playing** the three games on UAT release `20261125-e2930d63426`, together with two new target images. The four documents are kept here byte for byte and are never edited.

| File | What it is |
|---|---|
| [`playtest-report-2026-11-25.md`](playtest-report-2026-11-25.md) | The reviewer's report: what it reached, which claimed changes it confirmed, what it found, how long each game held it, twelve prompts, questions for the owner |
| [`playtest-evidence-log.md`](playtest-evidence-log.md) | Its log of what it did and saw, run by run |
| [`corrective-prompts.md`](corrective-prompts.md) | The twelve prompts on their own (the report holds the same text) |
| [`PRODUCTION_GAME_STANDARDS.md`](PRODUCTION_GAME_STANDARDS.md) | The standards it proposes for a production release, with a regression matrix. The prompts call this file `engineering/gaming/PRODUCTION_GAME_STANDARDS.md`; this is that file |
| [`owner-decisions-2026-11-26.md`](owner-decisions-2026-11-26.md) | **The founder's decisions of 26 November 2026** on everything below, as they arrived. They govern |
| [`owner-decisions-2026-11-26-b.md`](owner-decisions-2026-11-26-b.md) | **His second set, the same day**, on the eleven points then open. They govern |
| [`owner-register.md`](owner-register.md) | The register: 22 decisions, the people still to be named, and what needs his own approval (generated) |
| [`proof-frames.md`](proof-frames.md) | The three proof frames he approved: a brief for each and the checklist each must pass (generated) |
| [`proof-granada.md`](proof-granada.md) | **Granada's proof frame**, taken from the running game on 26 November 2026 and set beside its target, for him to judge |
| [`target-inventory.md`](target-inventory.md) | Every system the three target images show, what exists of it today, and how it is to be met (generated from `target-inventory.json`) |
| [`production-plan.md`](production-plan.md) | The phased plan: six streams of work, dependencies, estimates and gates (generated from `production-plan.json`) |
| [`assets/golden-age-target.webp`](assets/golden-age-target.webp) | The founder's target image for The Golden Age (the original PNG, 1672 × 941, SHA-256 `ca303902c4f3…`, is not in git; this is a smaller copy) |
| [`assets/atlas-target.webp`](assets/atlas-target.webp) | The founder's target image for Atlas (original PNG, 1672 × 941, SHA-256 `c674af76599a…`) |

Granada's target, `granada-v3.jpeg`, was already in [`../spec-granada/assets/`](../spec-granada/assets/); the copy in the archive is the same picture in other bytes (1536 × 864).

## What kind of evidence this is

- **It is the first time anyone other than the author played the games**, and it found the first defect the author had not: Atlas's globe seeming to vanish between rounds (fixed the same day; [`../games/atlas.md`](../games/atlas.md)).
- **It is an AI's review, not a person's playtest.** By [`../playtest-protocol.md`](../playtest-protocol.md) it is filed under its own name and passes no gate that asks for a person. The reviewer says the same: its times are "not proof that a human will find the games engaging".
- It says plainly what it did not check: sound, frame rates, the GPU, memory, the console, VoiceOver, a 1280 × 800 window, four of the seven languages, practice rounds, a soak. Those stay unchecked.
- Two of the author's claims it could **not** confirm by looking: ox-carts moving on both roads, and walkers leaning from foot to foot. They are in the game and too slight to be seen from where a player stands; that is a finding about the game, not about the reviewer.
- On the city-builder's third chapter it won by trading well and lost by trading and nothing else (2,248 coins, every other goal missed). The author's own table had said "a trading city cannot lose"; that is true of the scripted merchant, who also builds, and is not true of trade alone.

## The target images are binding (founder, 26 November 2026)

The three images, Granada's ([`../spec-granada/assets/granada-v3.jpeg`](../spec-granada/assets/granada-v3.jpeg)), The Golden Age's and Atlas's, are **binding north-star specifications** for composition and visual hierarchy, the density and authored detail of the world, the organization of menus and panels, the gameplay systems that are visible, strategic scope, the activity and atmosphere of the world, and production quality. They are not overlays to be matched pixel for pixel, and no figure in them (a population, a treasury, a year, a distance) is a fact.

- **Adaptations are allowed only for:** layouts that respond, down to 1280 by 800; the keyboard and accessibility; Arabic and Urdu right to left; performance on the supported machines; historical accuracy; and product decisions that are written down.
- **Every visible system** is implemented as a system that works, replaced by an approved equivalent, or recorded as an exception the founder has approved. **No control is reproduced as decoration**: a marketplace, a production chain, a timeline, a terrain layer, a catalogue, a contract, a research project or a security panel must change the game and the visible world.
- **The approved equivalents:** in Atlas, the account icon becomes a local profile with settings and accessibility, "Compete" becomes Challenge (personal bests on the device, practice and themed challenges, a result to copy, pass-and-play), and "Political Borders" becomes the borders rule (none in an unanswered round; modern borders after the reveal; an optional hint at a stated cost; historical boundaries only where reviewed). In The Golden Age, the "Military" category becomes Civic Resilience.
- **Where each system stands:** [`target-inventory.md`](target-inventory.md) lists 58 of them. Three exist today, 29 partly, 26 not at all.
- **All three games stay marked as prototypes** until their binding requirements and production gates pass. A test in the games' suite fails if a label is taken away while [`release-status.json`](release-status.json) still says prototype, and that file changes only with the founder's approval of the evidence.

## How it is used

- The twelve prompts are a programme of months, not a change. Each is mapped to the corrective work it belongs to in [`../spec-corrective/plan.json`](../spec-corrective/plan.json) and shown on [`../traceability.md`](../traceability.md), with where it stands; [`production-plan.md`](production-plan.md) orders the work.
- The standards are the reference for what a release must show before the word "prototype" comes off a game, together with the founder's own gates ([`../acceptance.json`](../acceptance.json), [`../granada/acceptance.json`](../granada/acceptance.json)) and his decisions of 26 November 2026 on machines, browsers, lengths of play, review of history and people who play.
- Its regression scenarios are run on every release ([`../regression/matrix.json`](../regression/matrix.json)).
- A photograph in the Atlas target stands for the image round. Atlas has four museum pictures that qualify for one ([G-0008](../adr/G-0008-atlas-image-rounds.md)).

## The reviewer's questions, and their answers

The reviewer's five questions for the owner, and three points the developer raised about the images, were all answered by the founder on 26 November 2026: [`owner-decisions-2026-11-26.md`](owner-decisions-2026-11-26.md), summarized on [`../traceability.md`](../traceability.md) with what still needs him.
