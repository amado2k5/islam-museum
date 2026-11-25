# islam.museum Gaming Platform: engineering index

The gaming platform is a separate subsystem of this repository: eleven browser games (the ten of the Version 2 specification, and Granada, added by the founder's addendum of the same day), a portal, shared systems, a creator and developer ecosystem, built and released independently of the museum's pages. Code lives in [`gaming/`](../../gaming/); everything about it that is not code lives here.

**State on 25 November 2026:** milestone M0 (inventory, decisions, baseline) is done; M1 (graphics spike) has its measurements and captures, with physical tests still open; two games are playable prototypes: Atlas, built from museum records, and The Golden Age, whose first scenario can be played in 3D or from a plan view; both play the museum's own suite as their music. No person has played either. Granada, the eleventh game and first in every list, has its first scenario playable in a browser in seven languages, from panels and a drawn plan of the valley; it is not in 3D yet. The other eight games do not exist. Nothing here is on the public site. The honest summary is the ledger's first table.

## Start here in a new session

1. [`LEDGER.md`](LEDGER.md): what is done, what was measured, what is open, the exact next commands. Read it first and confirm the branch and head it names.
2. [`spec-v2/00-START-HERE.md`](spec-v2/00-START-HERE.md), then `01`, `18`, `19`: the founder's Version 2 specification (25 November 2026), copied in full. V2 supersedes V1 (`spec-v2/reference/`) where they differ; repository governance (`AGENTS.md`, `docs/ai-change-gates.md`) overrides both.
3. The GDD of the game you are about to work on, in [`spec-v2/games/`](spec-v2/games/), in full, before writing any of it. For Granada, the whole of [`spec-granada/`](spec-granada/00-START-HERE.md), then [`granada/g0-discovery.md`](granada/g0-discovery.md).

## Documents

| Document | What it holds |
|---|---|
| [`LEDGER.md`](LEDGER.md) | The implementation ledger: requirements, milestone, decisions, work done, files, commits, commands and their real results, evidence, measurements, defects, limits, approvals needed, next tasks |
| [`acceptance.md`](acceptance.md), [`acceptance.json`](acceptance.json) | The eighteen release gates with their real status and evidence. Criteria are never edited to hide a failure |
| [`m0-repository-inventory.md`](m0-repository-inventory.md) | What the repository, hosting, CI, languages and this machine actually are, checked on 25 November 2026 |
| [`m1-graphics-spike.md`](m1-graphics-spike.md) | The engine comparison: method, measured numbers, captures, defects, what is still pending |
| [`games/atlas.md`](games/atlas.md) | Atlas: what exists, where its questions come from, its rules, what is checked and what is not done |
| [`games/golden-age.md`](games/golden-age.md) | The Golden Age: the rules of the first scenario, the screen, what was checked in a real browser, what the simulation lab found, what is not done |
| [`games/granada.md`](games/granada.md) | Granada: the first scenario and its page, what was checked in a real browser, what the lab found, the museum records behind it, and what is not built (the 3D valley first of all) |
| [`granada/g0-discovery.md`](granada/g0-discovery.md) | Granada's gate G0: what the repository has for it, the museum's records, the claims the game would make and their support, the three concept images read against the data, what waits for the founder |
| [`granada/acceptance.md`](granada/acceptance.md), [`granada/acceptance.json`](granada/acceptance.json) | Granada's 26 gates (GRA01 to GRA26) with their real status. They extend R01 to R18 |
| [`release-and-deploy.md`](release-and-deploy.md) | How the games are built, tested, released to UAT and production, and rolled back, apart from the website: the founder's rule, the layout in R2, the Worker, the three workflows, what the first run creates in Cloudflare, and what has not been proved |
| [`test-urls.md`](test-urls.md) | Every address at which each game can be tried, in each language: on the development machine, from another device on the same network, and on UAT |
| [`threat-model.md`](threat-model.md) | Trust levels, boundaries, what the current hosting allows, and the rules that follow |
| [`adr/`](adr/) | Architecture decisions, each with evidence and the alternatives turned down |
| [`spec-v2/`](spec-v2/) | The V2 specification package, with the visual atlas updated for the twelve images of 25 November |
| [`spec-granada/`](spec-granada/) | The Granada addendum of 25 November 2026 as received (19 files verified), with its three concept images reduced in size |
| [`evidence/`](evidence/) | Benchmark JSON and real captures, by milestone; Granada's under `evidence/granada/` |

## Decisions

| ADR | Decision | Status |
|---|---|---|
| [G-0001](adr/G-0001-workspace-and-isolation.md) | A self-contained `gaming/` package with its own lockfile and test naming, so the museum build and tests never see it | Accepted |
| [G-0002](adr/G-0002-rendering-engine.md) | Three.js WebGPURenderer with TSL is the 3D stack; Babylon.js was measured and not chosen | Accepted, on one machine's evidence |
| [G-0003](adr/G-0003-procedural-assets-first.md) | Geometry and textures are generated from seeds in code; Blender is a later, optional build-time tool | Accepted |
| [G-0004](adr/G-0004-hosting-and-release-model.md) | Static game releases, each file named by its content, behind a small pointer file; in R2 under `games/`, served by the games' own Worker at the games' own address; built, tested and deployed by the games' own workflows | Decided by the founder on 25 November 2026 and built; no deployment has run |
| [G-0005](adr/G-0005-determinism.md) | One seeded generator for every rule and every generated scene; no clock and no `Math.random()` in rules | Accepted |
| [G-0006](adr/G-0006-atlas-content-pack.md) | Atlas asks only what a museum record says, from a pack pinned in git with a proved 365-day schedule | Accepted; the rule on which people may be asked about is a default awaiting the founder |
| [G-0007](adr/G-0007-music-and-audio.md) | The museum's own suite, "Voices of the Museum", is the music of every game; the audio is never in git; nothing sounds before the player acts | Accepted (the founder's instruction); where the files are served from in production waits on G-0004 |
| [G-0008](adr/G-0008-atlas-image-rounds.md) | The rule for an Atlas image round (which pictures, how they are credited without giving the answer away, where they load from, how they enter the schedule), and the count that stopped the build: four pictures qualify and a weekly round needs 52 | Rule accepted and kept as tested code; no image round built; three defaults await the founder |
| [G-0009](adr/G-0009-granada-eleventh-game.md) | Granada is the eleventh game, a sub-lane of `gaming`; nothing built is restarted; the existing engine and shared packages are used; its simulation is built before its picture | Accepted for the lane; the cost to the other games is recorded |
| [G-0010](adr/G-0010-granada-economy-kernel.md) | Granada's money and goods are a journal of whole numbers changed only by commands that can be retried; markets have two prices and a purse; a harvest that does not fit is a decision; a contract reserves | Accepted and built for the first slice; prices that move, transport and the clock are not built |

## Rules that bind this subsystem

- The games are built, tested and deployed apart from the website (the founder's rule of 25 November 2026, in `AGENTS.md`): a change to a game runs the games' suite, and the website's workflows do not build, test or deploy any of it.
- `AGENTS.md` in full. In particular: static and no AI at runtime; all seven languages in the same change for anything a visitor reads; no honorifics typed; Qur'an text never typed; the content-safety block; truth in every public claim; deployment is the founder's alone.
- `docs/ai-change-gates.md`. The founder's instruction of 25 November 2026 is the approved proposal for the gaming subsystem. Changes to the museum's own header, footer, homepage, privacy posture, hosting or workflows are labelled `submission-impacting` and wait for his sign-off with that label.
- History in a game comes from museum records by stable id, with its source and its confidence. Concept art is never evidence. Fiction, reconstruction and simulation are labelled as such.
- A benchmark, capture, playtest or review that was not done is written as pending. A game is called finished only when its gates in `acceptance.json` say so.
