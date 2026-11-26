# The production handoff of 25 November 2026

The founder gave this as one archive, `islam-museum-claude-production-handoff.zip` (SHA-256 `7710c853a53b6b946ef3902c378b2f76aac5cdc5c9a853c9d2e7421057b3375b`), with no other word. It is what an outside AI reviewer (ChatGPT desktop, driving Chrome on the founder's own Mac) wrote after **playing** the three games on UAT release `20261125-e2930d63426`, together with two new target images. The four documents are kept here byte for byte and are never edited.

| File | What it is |
|---|---|
| [`playtest-report-2026-11-25.md`](playtest-report-2026-11-25.md) | The reviewer's report: what it reached, which claimed changes it confirmed, what it found, how long each game held it, twelve prompts, questions for the owner |
| [`playtest-evidence-log.md`](playtest-evidence-log.md) | Its log of what it did and saw, run by run |
| [`corrective-prompts.md`](corrective-prompts.md) | The twelve prompts on their own (the report holds the same text) |
| [`PRODUCTION_GAME_STANDARDS.md`](PRODUCTION_GAME_STANDARDS.md) | The standards it proposes for a production release, with a regression matrix. The prompts call this file `engineering/gaming/PRODUCTION_GAME_STANDARDS.md`; this is that file |
| [`assets/golden-age-target.webp`](assets/golden-age-target.webp) | The founder's target image for The Golden Age (the original PNG, 1672 × 941, SHA-256 `ca303902c4f3…`, is not in git; this is a smaller copy) |
| [`assets/atlas-target.webp`](assets/atlas-target.webp) | The founder's target image for Atlas (original PNG, 1672 × 941, SHA-256 `c674af76599a…`) |

Granada's target, `granada-v3.jpeg`, was already in [`../spec-granada/assets/`](../spec-granada/assets/); the copy in the archive is the same picture in other bytes (1536 × 864).

## What kind of evidence this is

- **It is the first time anyone other than the author played the games**, and it found the first defect the author had not: Atlas's globe seeming to vanish between rounds (fixed the same day; [`../games/atlas.md`](../games/atlas.md)).
- **It is an AI's review, not a person's playtest.** By [`../playtest-protocol.md`](../playtest-protocol.md) it is filed under its own name and passes no gate that asks for a person. The reviewer says the same: its times are "not proof that a human will find the games engaging".
- It says plainly what it did not check: sound, frame rates, the GPU, memory, the console, VoiceOver, a 1280 × 800 window, four of the seven languages, practice rounds, a soak. Those stay unchecked.
- Two of the author's claims it could **not** confirm by looking: ox-carts moving on both roads, and walkers leaning from foot to foot. They are in the game and too slight to be seen from where a player stands; that is a finding about the game, not about the reviewer.
- On the city-builder's third chapter it won by trading well and lost by trading and nothing else (2,248 coins, every other goal missed). The author's own table had said "a trading city cannot lose"; that is true of the scripted merchant, who also builds, and is not true of trade alone.

## How it is used

- The twelve prompts are a programme of months, not a change. Each is mapped to the corrective work it belongs to in [`../spec-corrective/plan.json`](../spec-corrective/plan.json) and shown on [`../traceability.md`](../traceability.md), with where it stands.
- The standards are taken as the reference for what a release must show before the word "prototype" comes off a game. They add no gate to the founder's own ([`../acceptance.json`](../acceptance.json), [`../granada/acceptance.json`](../granada/acceptance.json)); where they ask for more than those do, that is for the founder to adopt.
- **The target images are read as the founder's direction for composition and scope, not as facts.** Every figure in them (a population, a treasury, a year, a distance) is an illustration. Three things in them are raised with the founder and not built until he says:
  - The Atlas image shows an account icon and the word "Compete". The games have no accounts and compare no scores; the reviewer's own prompts say to add no accounts; and the founder's specification allows ranked scores only with a service that can vouch for them, which is paid infrastructure and his to approve.
  - The Atlas image offers "Political Borders". Atlas leaves modern borders out on purpose (the reason is written at the top of `gaming/games/atlas/src/ui/globe.ts`): they put the present day into a question about the past and often give the answer away.
  - The Golden Age image has a "Military" category of buildings. The game has none and its design asks for none; the reviewer's prompts ask that the museum's games not become games of conquest. This is a question of scope, not a rule broken.
- A photograph in the Atlas target stands for the image round. Atlas has four museum pictures that qualify for one ([G-0008](../adr/G-0008-atlas-image-rounds.md)).

## The reviewer's five questions for the owner

1. Are the three images binding for composition and scope, with adaptations for small windows and access allowed?
2. Campaign lengths: tutorials of 15 to 30 minutes, scenarios of 30 to 60, and one campaign of three hours or more in each of the two simulation games; Atlas a five-round daily game with unlimited practice?
3. The historical scope and who reviews it, for disasters, diplomacy, conflict, disease, famine, unrest, institutions, dress, buildings, dates and maps.
4. The reference machines and browsers, and the graphics presets, that the performance gates are held to.
5. Whether Granada's first-person and photo modes are needed for the first production release or come later.
