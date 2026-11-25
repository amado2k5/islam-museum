# Gaming platform: implementation ledger

The single place that says what is done, what was measured, what is open and what to do next. A new session reads this first, then confirms the branch and head below with `git log -1` before trusting anything here. Update it after every verified unit of work, in the same commit.

_Last updated: 25 November 2026, end of the first session._

## Where things stand

| | |
|---|---|
| Specification | Version 2, 25 November 2026, in [`spec-v2/`](spec-v2/) (65 files of the package verified against its SHA-256 list before copying) |
| Milestone | **M0 done. M1 measured on one machine, physical tests open.** M2 not started |
| Games | **None exists.** All ten are `planned` |
| On the public site | Nothing. No page, link, script or asset of the gaming platform is in the site build |
| Branch | `claude/islam-museum-gaming-v2-c9bd91`, from `origin/main` at `94cb4298a37` |
| Pull request | [amado2k5/islam-museum#PRNUM](https://github.com/amado2k5/islam-museum/pull/PRNUM) |
| Lane | `gaming` (`docs/agents/lanes.md`) |

**In one paragraph.** The repository, hosting, languages and this machine were inventoried and the findings written down. An isolated `gaming/` workspace exists with pinned, audit-clean dependencies. A procedural reference city (770 buildings, 1.33 million triangles) is generated from a seed and drawn by both Three.js and Babylon.js on WebGPU; both were benchmarked in real Chrome on an Apple M4 Max and Three.js was chosen. Sixteen real captures and nine benchmark files are in `evidence/m1/`. The captures show a clean architectural model, well short of the concept art; the report lists the gaps. No gameplay, portal page, SDK, mod system, translation or deployment work has been done.

## Requirements and their state

Platform outcomes are the ten numbered in `spec-v2/01-MASTER-MANDATE.md`. Release gates are R01 to R18 in [`acceptance.md`](acceptance.md).

| Outcome | State | Notes |
|---|---|---|
| 1. Play portal in seven languages, header, footer, homepage | Not started | Site integration is `submission-impacting` and `rewrites-all-pages`; needs the founder's sign-off with that label |
| 2. Ten distinct games | Not started | Golden Age and Atlas first (M2) |
| 3. WebGPU-first 3D, measured engine choice, High/Ultra/Cinematic | Engine chosen; presets are placeholders | [G-0002](adr/G-0002-rendering-engine.md) |
| 4. Art pipeline | Procedural kit exists; no authored assets, no characters, no audio | [G-0003](adr/G-0003-procedural-assets-first.md) |
| 5. Shared systems where justified | `kernel` and `worldkit` only | Save, input, audio, lifecycle, replay: not started |
| 6. Museum-sourced history | Not started | No museum record is read by gaming code yet |
| 7. Creator ecosystem, SDK, mods | Threat model only | [`threat-model.md`](threat-model.md) |
| 8. Cross-game interchange | Not started | |
| 9. Static hosting, separate build and release | Proposed | [G-0004](adr/G-0004-hosting-and-release-model.md), needs the founder |
| 10. Honest engagement and distribution | Not started | No portal policy has been checked yet |

| Milestone | State | Exit evidence |
|---|---|---|
| M0 inventory, ADRs, baseline, threat model, ownership | **Done** | [`m0-repository-inventory.md`](m0-repository-inventory.md), `adr/`, `threat-model.md` |
| M1 district spike, two-engine comparison, captures, benchmark | **Partly done** | [`m1-graphics-spike.md`](m1-graphics-spike.md); open: other hardware, Edge, soak, leak and device-loss tests, independent review |
| M2 Golden Age core loop, Atlas five rounds, simulation lab | Not started | |
| M3 to M11 | Not started | |

## Decisions

G-0001 workspace, G-0002 engine, G-0003 assets, G-0004 hosting (proposed), G-0005 determinism: see [`README.md`](README.md). Smaller choices made in passing:

- The specification is copied into the repository so a later session has it; concept images are reduced to 1280 × 720 so no file is over 300 KB. The originals are in the founder's package.
- Evidence captures are stored at 1920 × 1080 WebP. The 2560 × 1440 PNG originals are not committed; each is reproducible with one command.
- Benchmark tools start their own server and the installed browser, so one command reproduces a result.
- The founder's twelve attached images cover all ten games: three for The Silk Road, one each for the others. The atlas says so and critiques each (`spec-v2/20-VISUAL-REFERENCE-ATLAS.md`, supplement).

## Work done, with files

| Unit | Files |
|---|---|
| Workspace | `gaming/package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `README.md` |
| Kernel | `gaming/packages/kernel/src/{prng,framestats,capability}.ts`, `test/prng.gtest.ts` |
| World kit | `gaming/packages/worldkit/src/{mesh,textures}.ts`, `src/district/{site,kit,generate}.ts`, `test/district.gtest.ts` |
| Graphics lab | `gaming/labs/graphics/district.html`, `src/{main,api,atmosphere,camera-path,three-renderer,babylon-renderer,textures-async,texture-worker}.ts` |
| Tools | `gaming/tools/{bench,shot,serve,probe-district}.ts`, `bench-summary.py`, `image-stats.py` |
| Documents | everything under `docs/gaming/` |
| Shared files touched | `docs/agents/lanes.md` (one row), `docs/status.md` (one row), `CANARY.md` (one entry), `.claude/launch.json` (one preview entry) |

## Commands run and what they returned

All on 25 November 2026, on the machine in the inventory.

| Command | Result |
|---|---|
| `shasum -a 256 -c PACKAGE-CHECKSUMS.sha256` on the extracted package | 65 of 65 OK |
| `npm --prefix gaming audit` | 0 vulnerabilities |
| `npm --prefix gaming run typecheck` | Clean |
| `npm --prefix gaming test` | 2 files, 21 tests, all pass, 0.5 s |
| `npx tsx tools/probe-district.ts 7` | 770 buildings, 555,544 vertices, 1,326,774 triangles, 3,236 instances, 640 walkers; generated in about 100 ms |
| `npx tsx tools/bench.ts …` (nine runs) | Files in `evidence/m1/`; table in the M1 report |
| `npx tsx tools/bench.ts --channel msedge …` | **Failed**: no first frame in 120 s in Edge 157 under automation. Not investigated |
| `npm run validate` (museum, on this branch, before the documents were written) | 0 errors, 7,674 warnings, 4 min 48 s |
| `npm run validate` (museum, after rebasing onto `origin/main` at `6e9ff94d5da`) | 0 errors, exit 0 |
| `npm test` (museum, same tree) | 62 files, 30,319 tests passed, 2 skipped, exit 0, 616 s. It needs `npm --prefix site ci` first: in a fresh worktree without the site's dependencies, 22 test files cannot load and 6 tests fail, none of them to do with gaming |
| `npm run build`, `npm run check:static` | Not run: no file under `site/` changed |

## Measurements

The numbers and their conditions are in [G-0002](adr/G-0002-rendering-engine.md) and the [M1 report](m1-graphics-spike.md). They are for one Apple M4 Max in Chrome 158 and are not a hardware recommendation.

## Evidence

| What | Where |
|---|---|
| Engine comparison, 2560 × 1440, synced and uncapped | `evidence/m1/bench-chrome-2560x1440.json`, `…-uncapped.json` |
| Three.js High, Ultra, Cinematic at 1440p and 4K | `evidence/m1/flagship/*.json` |
| Sixteen real captures | `evidence/m1/captures/*.webp` |

## Unresolved defects and known limits

1. Figures are placeholder cylinders; buildings are undetailed; water, sky and market are simple (M1 report, "Honest visual assessment").
2. Microsoft Edge is untested: the lab did not start under automation.
3. No soak, leak, device-loss, resize or suspension test exists.
4. The three flagship presets barely differ.
5. Only one machine has been measured.
6. The desktop app's dev-server launcher stalled twice in this session; the tools no longer depend on it, but the in-app preview of the lab may need `npm --prefix gaming run dev` started by hand.
7. Nothing is translated, because nothing a visitor reads exists yet. The lab page is an English-only developer tool marked `noindex` and is not part of the site.

## Needs the founder

| Item | Why it cannot be decided here |
|---|---|
| Sign-off, with the label `submission-impacting`, for the Play entries in the header, footer and homepage and for the portal pages | `docs/ai-change-gates.md` section 3; also `rewrites-all-pages`, so it should ride the weekly shell deploy. The claims register and evidence map are edited in the same commit, and those files are reserved to him |
| Approval of G-0004 before any change to `workers/`, the publish lists, `_headers` or a workflow | Hosting and deployment are his alone |
| Whether packs may be imported from a URL (a `connect-src` change on the mod-manager route) | Adds a network call to the museum's privacy posture |
| A second hostname for sandboxed third-party content | DNS and Worker change |
| Installing Blender on the build machine | A download this session had no approval for |
| Access to a Windows machine with a discrete GPU, and to people for playtests | Gates R09 and R10 cannot be met without them |
| The licence and publication of the SDK | Specification 07 reserves it |
| A ruling on depicting places of worship as buildable or decorative objects in games | The reference district avoids the question by having none; a city builder will have to answer it |

## Next executable tasks

In order. Each is a pull request of its own.

1. **M2, Atlas.** Read `spec-v2/games/atlas.md` in full. Build the data pipeline from museum records to a clue pack (ids, coordinates, date ranges with their precision, licensed image and credit, source link); haversine scoring with tests for the antimeridian and the poles; five rounds, daily seed in UTC, practice mode; a 365-day schedule with a solver proof that every day is valid. Start from `packages/kernel` and the 2D map; the 3D globe comes after the loop works.
2. **M2, Golden Age.** Read `spec-v2/games/golden-age.md` in full. A pure rules reducer (households, jobs, water graph, food, treasury, seasons) with no rendering, and a simulation lab that plays 1,000 seeded campaigns with three scripted strategies and checks the invariants. Then place-a-canal and place-a-building on the reference district.
3. **M1 remainder.** Cascaded shadows; a water surface with reflection and edge depth; a sky with clouds; a first authored character; a soak and leak test; fix or explain the Edge failure.
4. **M3.** The portal pages in seven languages on a branch, the gaming workflow, the release build and its dry run, ready for the founder's sign-off.

Resume with:

```bash
git fetch origin && git log --oneline -3 && git status --short
npm --prefix gaming ci && npm --prefix gaming test
```
