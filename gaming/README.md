# islam.museum Gaming Platform: code

An independently built subsystem of the museum repository. The plan, the decisions, the measurements and the open work are in [`docs/gaming/`](../docs/gaming/README.md); start with the ledger there. This folder is only code.

**State, 25 November 2026:** a shared kernel, a procedural world kit, a graphics lab that draws one reference city in two engines and measures them, the first game as a prototype (Atlas), and the rules and simulation lab of the second (Golden Age).

```
packages/kernel/      seeded random numbers and noise, frame statistics, the WebGPU capability check
packages/worldkit/    engine-neutral geometry, procedural textures, the reference district generator
labs/graphics/        the district in Three.js and in Babylon.js, with a fixed camera loop and a benchmark mode
games/atlas/          Atlas: rules, daily schedule, saving, the globe, seven languages, the pinned content pack
games/golden-age/     Golden Age: the season rules, the first scenario, scripted players and the simulation lab (no interface yet)
tools/                bench.ts and shot.ts (real Chrome, real GPU), atlas-play.ts, summaries, a district probe
```

## Commands

```bash
npm --prefix gaming ci            # install the pinned dependencies
npm --prefix gaming test          # unit tests (*.gtest.ts)
npm --prefix gaming run typecheck # strict TypeScript
npm --prefix gaming run dev       # http://127.0.0.1:4330/labs/graphics/district.html  and  /games/atlas/index.html?lang=ar
npm --prefix gaming run atlas:pack   # rebuild Atlas's content pack from the museum's records (a new pack version)
npm --prefix gaming run simlab -- 1000   # play 14,000 Golden Age campaigns and report what breaks or dominates
```

Benchmarks and captures are in [`docs/gaming/m1-graphics-spike.md`](../docs/gaming/m1-graphics-spike.md), with the commands to repeat them.

## Rules of the workspace

- Dependencies are pinned to exact versions, and a new one needs a reason in an ADR (`docs/gaming/adr/`).
- Tests are named `*.gtest.ts`. The museum's root test run must never collect a gaming test, and the reverse.
- Nothing that decides an outcome or generates content calls `Math.random()` or reads the clock. Use `Rng` from `packages/kernel/src/prng.ts` and pass time in.
- A package is created when a second consumer needs it, not before.
- Simulation is separate from rendering: rules are pure functions over plain data and run in Node.
- Nothing here is imported by `site/`. The museum's pages load a game at run time from a release (`docs/gaming/adr/G-0004-hosting-and-release-model.md`), never at build time.
- The museum's rules apply in full (`AGENTS.md`): seven languages for anything a player reads, no AI at run time, history only from museum records, and the truth about what is and is not finished.
