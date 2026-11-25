# islam.museum Gaming Platform: engineering index

The gaming platform is a separate subsystem of this repository: ten browser games, a portal, shared systems, a creator and developer ecosystem, built and released independently of the museum's pages. Code lives in [`gaming/`](../../gaming/); everything about it that is not code lives here.

**State on 25 November 2026:** milestone M0 (inventory, decisions, baseline) is done and M1 (graphics spike) has its measurements and captures, with physical tests still open. No game exists yet. Nothing here is on the public site. The honest summary is the ledger's first table.

## Start here in a new session

1. [`LEDGER.md`](LEDGER.md): what is done, what was measured, what is open, the exact next commands. Read it first and confirm the branch and head it names.
2. [`spec-v2/00-START-HERE.md`](spec-v2/00-START-HERE.md), then `01`, `18`, `19`: the founder's Version 2 specification (25 November 2026), copied in full. V2 supersedes V1 (`spec-v2/reference/`) where they differ; repository governance (`AGENTS.md`, `docs/ai-change-gates.md`) overrides both.
3. The GDD of the game you are about to work on, in [`spec-v2/games/`](spec-v2/games/), in full, before writing any of it.

## Documents

| Document | What it holds |
|---|---|
| [`LEDGER.md`](LEDGER.md) | The implementation ledger: requirements, milestone, decisions, work done, files, commits, commands and their real results, evidence, measurements, defects, limits, approvals needed, next tasks |
| [`acceptance.md`](acceptance.md), [`acceptance.json`](acceptance.json) | The eighteen release gates with their real status and evidence. Criteria are never edited to hide a failure |
| [`m0-repository-inventory.md`](m0-repository-inventory.md) | What the repository, hosting, CI, languages and this machine actually are, checked on 25 November 2026 |
| [`m1-graphics-spike.md`](m1-graphics-spike.md) | The engine comparison: method, measured numbers, captures, defects, what is still pending |
| [`threat-model.md`](threat-model.md) | Trust levels, boundaries, what the current hosting allows, and the rules that follow |
| [`adr/`](adr/) | Architecture decisions, each with evidence and the alternatives turned down |
| [`spec-v2/`](spec-v2/) | The V2 specification package, with the visual atlas updated for the twelve images of 25 November |
| [`evidence/`](evidence/) | Benchmark JSON and real captures, by milestone |

## Decisions

| ADR | Decision | Status |
|---|---|---|
| [G-0001](adr/G-0001-workspace-and-isolation.md) | A self-contained `gaming/` package with its own lockfile and test naming, so the museum build and tests never see it | Accepted |
| [G-0002](adr/G-0002-rendering-engine.md) | Three.js WebGPURenderer with TSL is the 3D stack; Babylon.js was measured and not chosen | Accepted, on one machine's evidence |
| [G-0003](adr/G-0003-procedural-assets-first.md) | Geometry and textures are generated from seeds in code; Blender is a later, optional build-time tool | Accepted |
| [G-0004](adr/G-0004-hosting-and-release-model.md) | Static, content-addressed game releases behind a small pointer file, on the museum's existing Cloudflare hosting | Proposed; needs the founder before any hosting file changes |
| [G-0005](adr/G-0005-determinism.md) | One seeded generator for every rule and every generated scene; no clock and no `Math.random()` in rules | Accepted |

## Rules that bind this subsystem

- `AGENTS.md` in full. In particular: static and no AI at runtime; all seven languages in the same change for anything a visitor reads; no honorifics typed; Qur'an text never typed; the content-safety block; truth in every public claim; deployment is the founder's alone.
- `docs/ai-change-gates.md`. The founder's instruction of 25 November 2026 is the approved proposal for the gaming subsystem. Changes to the museum's own header, footer, homepage, privacy posture, hosting or workflows are labelled `submission-impacting` and wait for his sign-off with that label.
- History in a game comes from museum records by stable id, with its source and its confidence. Concept art is never evidence. Fiction, reconstruction and simulation are labelled as such.
- A benchmark, capture, playtest or review that was not done is written as pending. A game is called finished only when its gates in `acceptance.json` say so.
