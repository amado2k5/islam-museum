# G-0005: one seeded generator, no clock and no `Math.random()` in rules

_25 November 2026. Status: accepted._

## Decision

Everything that decides an outcome or generates content takes its randomness from `Rng` in `gaming/packages/kernel/src/prng.ts`: sfc32 (public domain) seeded through FNV-1a and splitmix32, all in 32-bit integer arithmetic, so the same seed gives the same stream in every JavaScript engine. Streams are forked by label (`rng.fork("houses")`), so adding a new consumer never shifts the numbers an existing one sees. The generator's state is four integers and goes into a save file as they are.

Rule code does not call `Math.random()`, `Date.now()` or `performance.now()`. Time reaches a simulation as a step count or as a time value passed in. The reference district shows the pattern: `generateDistrict(seed)` and `updateDynamics(scene, time)` are pure functions of their arguments.

## Why

Daily challenges must be the same for every player and every language; a replay must reproduce a game; a benchmark must draw the same scene twice; and the museum's own build rule is that output is a function of the commit, never of the clock (`docs/site/README.md`).

## Guarded by

`packages/kernel/test/prng.gtest.ts` pins four output values and one hash. A change to them is a breaking change to every seed-derived result and needs a version bump and a migration, not an edit to the test. `packages/worldkit/test/district.gtest.ts` generates the district twice and compares it.

## Limit

This covers rules and generated content. It does not make GPU output identical across devices, and nothing claims it does (spec 06: replay by snapshots and validated outcomes where physics is not deterministic).
