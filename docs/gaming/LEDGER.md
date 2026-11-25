# Gaming platform: implementation ledger

The single place that says what is done, what was measured, what is open and what to do next. A new session reads this first, then confirms the branch and head below with `git log -1` before trusting anything here. Update it after every verified unit of work, in the same commit.

_Last updated: 25 November 2026, after the Atlas prototype (second pull request)._

## Where things stand

| | |
|---|---|
| Specification | Version 2, 25 November 2026, in [`spec-v2/`](spec-v2/) (65 files of the package verified against its SHA-256 list before copying) |
| Milestone | **M0 done. M1 measured on one machine, physical tests open. M2 half done:** Atlas is a playable prototype; Golden Age's game loop and the simulation lab are not started |
| Games | **Atlas is a `prototype`.** The other nine are `planned` |
| On the public site | Nothing. No page, link, script or asset of the gaming platform is in the site build |
| Branches | `claude/islam-museum-gaming-v2-c9bd91` (M0 and M1, merged), `gaming/m2-atlas-claude` (Atlas) |
| Pull requests | [amado2k5/islam-museum#8247](https://github.com/amado2k5/islam-museum/pull/8247) (M0 and M1, merged 25 Nov 2026 as `9854b2d2c1a`); Atlas: PR2NUM |
| Lane | `gaming` (`docs/agents/lanes.md`) |

**In one paragraph.** The repository, hosting, languages and this machine were inventoried and the findings written down. An isolated `gaming/` workspace exists with pinned, audit-clean dependencies. A procedural reference city (770 buildings, 1.33 million triangles) is generated from a seed and drawn by both Three.js and Babylon.js on WebGPU; both were benchmarked in real Chrome on an Apple M4 Max and Three.js was chosen. The captures show a clean architectural model, well short of the concept art. **Atlas** is the first game: a five-round daily geography game built entirely from museum records (3,481 qualifying rounds; a pinned pack of 2,125 with a 365-day schedule proved valid), playable by mouse or keyboard on a 2D globe in seven languages, with its rules, schedule and saving under unit test and a scripted playthrough in real Chrome. It has no images, no sound, no 3D globe and has not been played by a person. No portal page, SDK, mod system or deployment work has been done.

## Requirements and their state

Platform outcomes are the ten numbered in `spec-v2/01-MASTER-MANDATE.md`. Release gates are R01 to R18 in [`acceptance.md`](acceptance.md).

| Outcome | State | Notes |
|---|---|---|
| 1. Play portal in seven languages, header, footer, homepage | Not started | Site integration is `submission-impacting` and `rewrites-all-pages`; needs the founder's sign-off with that label |
| 2. Ten distinct games | One prototype (Atlas), nine not started | [`games/atlas.md`](games/atlas.md). Golden Age's loop is next |
| 3. WebGPU-first 3D, measured engine choice, High/Ultra/Cinematic | Engine chosen; presets are placeholders | [G-0002](adr/G-0002-rendering-engine.md) |
| 4. Art pipeline | Procedural kit exists; no authored assets, no characters, no audio | [G-0003](adr/G-0003-procedural-assets-first.md) |
| 5. Shared systems where justified | `kernel` and `worldkit` only | Atlas has its own save module; it becomes shared when a second game needs one. Input, audio, lifecycle, replay: not started |
| 6. Museum-sourced history | Working for Atlas | Rounds are museum record ids joined to museum place ids, from a pinned pack ([G-0006](adr/G-0006-atlas-content-pack.md)) |
| 7. Creator ecosystem, SDK, mods | Threat model only | [`threat-model.md`](threat-model.md) |
| 8. Cross-game interchange | Not started | |
| 9. Static hosting, separate build and release | Proposed | [G-0004](adr/G-0004-hosting-and-release-model.md), needs the founder |
| 10. Honest engagement and distribution | Not started | No portal policy has been checked yet |

| Milestone | State | Exit evidence |
|---|---|---|
| M0 inventory, ADRs, baseline, threat model, ownership | **Done** | [`m0-repository-inventory.md`](m0-repository-inventory.md), `adr/`, `threat-model.md` |
| M1 district spike, two-engine comparison, captures, benchmark | **Partly done** | [`m1-graphics-spike.md`](m1-graphics-spike.md); open: other hardware, Edge, soak, leak and device-loss tests, independent review |
| M2 Golden Age core loop, Atlas five rounds, simulation lab | **Half done** | Atlas five rounds: done as a prototype ([`games/atlas.md`](games/atlas.md)). Golden Age loop, simulation lab, first independent feedback: not started |
| M3 to M11 | Not started | |

## Decisions

G-0001 workspace, G-0002 engine, G-0003 assets, G-0004 hosting (proposed), G-0005 determinism, G-0006 Atlas content pack: see [`README.md`](README.md). Smaller choices made in passing:

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
| Tools | `gaming/tools/{bench,shot,serve,probe-district,atlas-play}.ts`, `bench-summary.py`, `image-stats.py` |
| Atlas | `gaming/games/atlas/src/{geo,pack,rules,schedule,save}.ts`, `src/ui/{app,globe}.ts`, `atlas.css`, `index.html`, `tools/build-pack.ts`, `data/` (pinned pack, seven label files, report), `i18n/` (seven languages), `test/atlas.gtest.ts` |
| Documents | everything under `docs/gaming/` |
| Shared files touched | `docs/agents/lanes.md` (one row), `docs/status.md` (one row), `CANARY.md` (one entry), `.claude/launch.json` (one preview entry) |

## Commands run and what they returned

All on 25 November 2026, on the machine in the inventory.

| Command | Result |
|---|---|
| `shasum -a 256 -c PACKAGE-CHECKSUMS.sha256` on the extracted package | 65 of 65 OK |
| `npm --prefix gaming audit` | 0 vulnerabilities |
| `npm --prefix gaming run typecheck` | Clean |
| `npm --prefix gaming test` | 3 files, 50 tests, all pass, 0.6 s (21 before Atlas) |
| `npx tsx tools/probe-district.ts 7` | 770 buildings, 555,544 vertices, 1,326,774 triangles, 3,236 instances, 640 walkers; generated in about 100 ms |
| `npx tsx tools/bench.ts …` (nine runs) | Files in `evidence/m1/`; table in the M1 report |
| `npx tsx tools/bench.ts --channel msedge …` | **Failed**: no first frame in 120 s in Edge 157 under automation. Not investigated |
| `npm run validate` (museum, on this branch, before the documents were written) | 0 errors, 7,674 warnings, 4 min 48 s |
| `npm run validate` (museum, after rebasing onto `origin/main` at `6e9ff94d5da`) | 0 errors, exit 0 |
| `npm test` (museum, same tree) | 62 files, 30,319 tests passed, 2 skipped, exit 0, 616 s. It needs `npm --prefix site ci` first: in a fresh worktree without the site's dependencies, 22 test files cannot load and 6 tests fail, none of them to do with gaming |
| `npm --prefix gaming run atlas:pack` | 3,481 qualifying rounds; pack of 2,125 rounds and 528 places; 365 days, 1,825 rounds used, 0 problems; digest `764f347cfa66…` |
| `npx tsx tools/atlas-play.ts <dir> <lang>` for each of the seven languages | Seven full daily games in Chrome 158, no console error |
| `npm run validate`, `npm test` (museum, Atlas branch) | M2_GATES |
| `npm run build`, `npm run check:static` | Not run: no file under `site/` changed |

## Measurements

The numbers and their conditions are in [G-0002](adr/G-0002-rendering-engine.md) and the [M1 report](m1-graphics-spike.md). They are for one Apple M4 Max in Chrome 158 and are not a hardware recommendation.

## Evidence

| What | Where |
|---|---|
| Engine comparison, 2560 × 1440, synced and uncapped | `evidence/m1/bench-chrome-2560x1440.json`, `…-uncapped.json` |
| Three.js High, Ultra, Cinematic at 1440p and 4K | `evidence/m1/flagship/*.json` |
| Sixteen real captures | `evidence/m1/captures/*.webp` |
| Atlas: pack report, seven-language playthrough log, thirteen screenshots | `evidence/m2/atlas/` |

## Unresolved defects and known limits

1. Figures are placeholder cylinders; buildings are undetailed; water, sky and market are simple (M1 report, "Honest visual assessment").
2. Microsoft Edge is untested: the lab did not start under automation.
3. No soak, leak, device-loss, resize or suspension test exists.
4. The three flagship presets barely differ.
5. Only one machine has been measured.
6. The desktop app's dev-server launcher stalled twice in this session; the tools no longer depend on it, but the in-app preview of the lab may need `npm --prefix gaming run dev` started by hand.
7. Atlas's interface strings exist in all seven languages but were written by an AI agent and read by no native speaker; personal names in Turkish and Indonesian are borrowed from English. The graphics lab page is an English-only developer tool marked `noindex`.
8. Atlas has no images, no sound and no 3D globe, and two of its five daily rounds are military events ([`games/atlas.md`](games/atlas.md)).
9. No game has been played by a person. Every "playthrough" so far is the author's script.

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
| Which people may be the subject of an Atlas question | Default in force: born 700 to 1900, or died 800 to 1950 ([G-0006](adr/G-0006-atlas-content-pack.md), rule 7). The earliest generations are out until he rules |
| Whether Atlas's list of event kinds never asked is right | G-0006, rule 6 |

## Next executable tasks

In order. Each is a pull request of its own.

1. **Atlas, next steps.** Image rounds from the museum's media records (licence, credit that does not reveal the answer, place); an archive of past days; regional and era practice filters; the museum's web fonts; sound. Read `spec-v2/games/atlas.md` again first.
2. **M2, Golden Age.** Read `spec-v2/games/golden-age.md` in full. A pure rules reducer (households, jobs, water graph, food, treasury, seasons) with no rendering, and a simulation lab that plays 1,000 seeded campaigns with three scripted strategies and checks the invariants. Then place-a-canal and place-a-building on the reference district.
3. **M1 remainder.** Cascaded shadows; a water surface with reflection and edge depth; a sky with clouds; a first authored character; a soak and leak test; fix or explain the Edge failure.
4. **M3.** The portal pages in seven languages on a branch, the gaming workflow, the release build and its dry run, ready for the founder's sign-off.

Resume with:

```bash
git fetch origin && git log --oneline -3 && git status --short
npm --prefix gaming ci && npm --prefix gaming test
```
