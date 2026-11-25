# islam.museum Gaming Platform: code

An independently built subsystem of the museum repository. The plan, the decisions, the measurements and the open work are in [`docs/gaming/`](../docs/gaming/README.md); start with the ledger there. This folder is only code.

**State, 25 November 2026:** a shared kernel, a procedural world kit, a graphics lab that draws one reference city in two engines and measures them, two games as prototypes (Atlas, and The Golden Age with its three chapters playable in 3D and from a plan view), the museum's own suite as their music, and Granada, first in every list: its first scenario playable from panels and a drawn plan of the valley, not yet in 3D.

```
packages/kernel/      seeded random numbers and noise, frame statistics, the WebGPU capability check
packages/worldkit/    engine-neutral geometry, procedural textures, season and time-of-day light, the reference district generator
packages/audio/       the museum's soundtrack for every game: track list, player, the shared control, seven languages
labs/graphics/        the district in Three.js and in Babylon.js, with a fixed camera loop and a benchmark mode
games/atlas/          Atlas: rules, daily schedule, saving, the globe, seven languages, the pinned content pack
games/golden-age/     The Golden Age: season rules, the first scenario, scripted players and the simulation lab; the 3D board, the panel, the plan view, saving, seven languages
games/granada/        Granada: the ledger of money and goods, the first scenario's rules and scripted players, the page (panels, a plan of the valley in SVG, saving, seven languages), geography and the pinned museum records; no 3D yet
games/registry.json   the games in the order every list shows them (Granada first), with each one's true status
tools/                bench.ts and shot.ts (real Chrome, real GPU), atlas-play.ts, golden-age-play.ts, music-import.ts, check-strings.py; build.ts (the release build), check-release.mjs, release-smoke.ts
media/                not in git: the encoded music, written here by `music:import`
```

## Commands

```bash
npm --prefix gaming ci            # install the pinned dependencies
npm --prefix gaming test          # unit tests (*.gtest.ts)
npm --prefix gaming run typecheck # strict TypeScript
npm --prefix gaming run strings   # the string tables of every game: seven languages, same keys, same blanks
npm --prefix gaming run dev       # http://127.0.0.1:4330/games/granada/index.html?lang=ar  and  /games/golden-age/index.html?lang=ar  and  /games/atlas/index.html?lang=ar  and  /labs/graphics/district.html
npm --prefix gaming run music:import -- ~/Downloads   # once per checkout: encode the six WAV masters into gaming/media/music/
npm --prefix gaming run atlas:pack   # rebuild Atlas's content pack from the museum's records (a new pack version)
npm --prefix gaming run golden-age:links   # rebuild The Golden Age's pinned links to museum records (labels in seven languages)
npm --prefix gaming run simlab -- 1000   # play 14,000 Golden Age campaigns and report what breaks or dominates
npm --prefix gaming run golden-age:play -- <out dir> ar 1   # play The Golden Age in real Chrome, in a language, with a whole campaign
npm --prefix gaming run build:release      # the release build: gaming/dist/release, with a manifest of every file
npm --prefix gaming run check:release -- --allow-dirty   # verify a local build against its manifest
npm --prefix gaming run release:smoke      # open the release in real Chrome behind the games Worker's own code and headers
npm --prefix gaming run granada:play -- <out dir> ar   # play Granada's first scenario in real Chrome, in a language
npm --prefix gaming run granada:village-lab -- 1000   # six scripted players through Granada's first scenario over 1,000 seeds
npm --prefix gaming run granada:records     # rebuild Granada's pinned museum records (places with coordinates, labels in seven languages)
npm --prefix gaming run granada:mutations   # break Granada's economy kernel 15 ways and check the tests notice each time
```

Useful address parameters for the games: `lang=` one of ar, en, ur, fr, es, tr, id; `music=off`; and for The Golden Age `seed=<number>` (a new game on that district), `q=low` (no post-processing), `no3d=1` (the plan view only).

Benchmarks and captures are in [`docs/gaming/m1-graphics-spike.md`](../docs/gaming/m1-graphics-spike.md), with the commands to repeat them.

## Rules of the workspace

- **The games are built, tested and deployed apart from the website** (the founder's rule of 25 November 2026). The checks for a change here are this workspace's own, plus `node --test workers/games/test/*.test.mjs`; the museum's `npm run validate`, `npm test` and `npm run build` are for museum files. Releasing is the founder's: [`docs/gaming/release-and-deploy.md`](../docs/gaming/release-and-deploy.md).

- Dependencies are pinned to exact versions, and a new one needs a reason in an ADR (`docs/gaming/adr/`).
- Tests are named `*.gtest.ts`. The museum's root test run must never collect a gaming test, and the reverse.
- Nothing that decides an outcome or generates content calls `Math.random()` or reads the clock. Use `Rng` from `packages/kernel/src/prng.ts` and pass time in.
- A package is created when a second consumer needs it, not before.
- Audio, video and other media are never committed. `media/` is ignored by git; what was imported is recorded in a manifest with a digest of each file (`packages/audio/music.json`).
- Simulation is separate from rendering: rules are pure functions over plain data and run in Node.
- Nothing here is imported by `site/`. The museum's pages load a game at run time from a release (`docs/gaming/adr/G-0004-hosting-and-release-model.md`), never at build time.
- The museum's rules apply in full (`AGENTS.md`): seven languages for anything a player reads, no AI at run time, history only from museum records, and the truth about what is and is not finished.
