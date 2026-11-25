# Gaming platform: implementation ledger

The single place that says what is done, what was measured, what is open and what to do next. A new session reads this first, then confirms the branch and head below with `git log -1` before trusting anything here. Update it after every verified unit of work, in the same commit.

_Last updated: 25 November 2026, with the fifth pull request (The Golden Age: its second chapter, "The House of Books"). A separate session is working on Atlas's image rounds at the same time and writes to this file too: merge its entries, never overwrite them._

## Where things stand

| | |
|---|---|
| Specification | Version 2, 25 November 2026, in [`spec-v2/`](spec-v2/) (65 files of the package verified against its SHA-256 list before copying) |
| Milestone | **M0 done. M1 measured on one machine, physical tests open. M2 built:** Atlas and The Golden Age are both playable prototypes, and the simulation lab exists. The one part of M2 not done is its last line: no person other than the author's script has played either game |
| Games | **Atlas and The Golden Age are `prototype`.** The other eight are `planned` |
| On the public site | Nothing. No page, link, script or asset of the gaming platform is in the site build |
| Branches | `claude/islam-museum-gaming-v2-c9bd91` (M0 and M1, merged), `gaming/m2-atlas-claude` (Atlas, and the Golden Age rules and lab; merged), `gaming/m2-golden-age-screen-claude` (The Golden Age on screen, and the music; merged), `gaming/m2-golden-age-legible-claude` (markers, museum links, the season stall; merged), `gaming/m3-golden-age-chapter-two-claude` (the second chapter; the branch name says m3 by mistake, the work is Golden Age content and not milestone M3) |
| Pull requests | [amado2k5/islam-museum#8247](https://github.com/amado2k5/islam-museum/pull/8247) (M0 and M1, merged 25 Nov 2026 as `9854b2d2c1a`); [amado2k5/islam-museum#8248](https://github.com/amado2k5/islam-museum/pull/8248) (Atlas, Golden Age rules and lab, merged 25 Nov 2026 as `c45de1c952b`); [amado2k5/islam-museum#8250](https://github.com/amado2k5/islam-museum/pull/8250) (The Golden Age on screen, and the music; merged 25 Nov 2026 as `e60dab3fcbb`); [amado2k5/islam-museum#8251](https://github.com/amado2k5/islam-museum/pull/8251) (markers, museum links, the season stall; merged 25 Nov 2026 as `361a669c3a5`); PR_FIVE |
| Lane | `gaming` (`docs/agents/lanes.md`) |

**In one paragraph.** The repository, hosting, languages and this machine were inventoried and the findings written down. An isolated `gaming/` workspace exists with pinned, audit-clean dependencies. A procedural reference city is generated from a seed and drawn by both Three.js and Babylon.js on WebGPU; both were benchmarked in real Chrome on an Apple M4 Max and Three.js was chosen. **Atlas** is a five-round daily geography game built entirely from museum records, playable by mouse or keyboard on a 2D globe in seven languages. **The Golden Age** has two chapters of its campaign playable from start to finish ("The Failing Canal", and "The House of Books", each opening on a brief that quotes the museum's own account of the history behind it): a district of 48 plots drawn in 3D from the rules' state, where a canal link is dug and its water seen to arrive, buildings are placed, the top bar shows what the season will do before it is ended and a ledger gives the causes after; the same game can be played with the keyboard alone or from a plan view made of buttons, which is the whole game where there is no WebGPU; it saves on the device and is in seven languages; a plot in trouble is marked in the district, and research and tools link to thirteen museum records. Each chapter was played 14,000 times by scripted players with no rule broken; in the first only two of four strategies are comfortably viable where the GDD asks for three, and in the second all four are. **The music of both games is the museum's own suite**, "Voices of the Museum", silent until the player's first click; the audio files are not in git. The pictures are tidy models, well short of the concept art. **No person has played either game**: every playthrough is the author's script. No portal page, SDK, mod system or deployment work has been done.

## Requirements and their state

Platform outcomes are the ten numbered in `spec-v2/01-MASTER-MANDATE.md`. Release gates are R01 to R18 in [`acceptance.md`](acceptance.md).

| Outcome | State | Notes |
|---|---|---|
| 1. Play portal in seven languages, header, footer, homepage | Not started | Site integration is `submission-impacting` and `rewrites-all-pages`; needs the founder's sign-off with that label |
| 2. Ten distinct games | Two prototypes (Atlas, The Golden Age with two chapters of three); eight not started | [`games/atlas.md`](games/atlas.md), [`games/golden-age.md`](games/golden-age.md) |
| 3. WebGPU-first 3D, measured engine choice, High/Ultra/Cinematic | Engine chosen; presets are placeholders | [G-0002](adr/G-0002-rendering-engine.md) |
| 4. Art pipeline | Procedural kit exists, with nine building types for The Golden Age; music is the museum's suite; no authored assets, no real characters, no sound effects | [G-0003](adr/G-0003-procedural-assets-first.md), [G-0007](adr/G-0007-music-and-audio.md) |
| 5. Shared systems where justified | `kernel`, `worldkit`, `audio` | Music is shared (two games use it). Each game still has its own save module, of the same design: the third game to need one makes it shared. Input mapping, lifecycle, replay, sound effects: not started |
| 6. Museum-sourced history | Working for Atlas; links only in The Golden Age | Atlas: rounds are museum record ids joined to museum place ids, from a pinned pack ([G-0006](adr/G-0006-atlas-content-pack.md)). The Golden Age: research and tools link to thirteen records by id from a pinned file; nothing in its play comes from a record yet |
| 7. Creator ecosystem, SDK, mods | Threat model only | [`threat-model.md`](threat-model.md) |
| 8. Cross-game interchange | Not started | |
| 9. Static hosting, separate build and release | Proposed | [G-0004](adr/G-0004-hosting-and-release-model.md), needs the founder |
| 10. Honest engagement and distribution | Not started | No portal policy has been checked yet |

| Milestone | State | Exit evidence |
|---|---|---|
| M0 inventory, ADRs, baseline, threat model, ownership | **Done** | [`m0-repository-inventory.md`](m0-repository-inventory.md), `adr/`, `threat-model.md` |
| M1 district spike, two-engine comparison, captures, benchmark | **Partly done** | [`m1-graphics-spike.md`](m1-graphics-spike.md); open: other hardware, Edge, soak, leak and device-loss tests, independent review |
| M2 Golden Age core loop, Atlas five rounds, simulation lab | **Built; feedback open** | Atlas five rounds ([`games/atlas.md`](games/atlas.md)); The Golden Age's core loop on screen and its simulation lab ([`games/golden-age.md`](games/golden-age.md)). First independent feedback on either game: not done, and it cannot be done from here |
| M3 to M11 | Not started | |

## Decisions

G-0001 workspace, G-0002 engine, G-0003 assets, G-0004 hosting (proposed), G-0005 determinism, G-0006 Atlas content pack, G-0007 music: see [`README.md`](README.md). Smaller choices made in passing:

- The specification is copied into the repository so a later session has it; concept images are reduced to 1280 × 720 so no file is over 300 KB. The originals are in the founder's package.
- Evidence captures are stored at 1920 × 1080 WebP. The 2560 × 1440 PNG originals are not committed; each is reproducible with one command.
- Benchmark tools start their own server and the installed browser, so one command reproduces a result.
- The founder's twelve attached images cover all ten games: three for The Silk Road, one each for the others. The atlas says so and critiques each (`spec-v2/20-VISUAL-REFERENCE-ATLAS.md`, supplement).
- **The Golden Age's board is its own generated district, not the M1 reference city.** The ledger's earlier plan was to lay the rules' plots onto the reference city. That city is filled edge to edge by its generator and has a curving river, so a grid of plots that the player fills in could not sit on it honestly. The board uses the same kit (houses, arcades, domes, palms, textures, water) to build each plot from the state. The reference city stays as the benchmark scene.
- **A plot is a crossroads, and a canal runs along a lane.** The rules join plot centres, so the picture puts the lanes through the centres and the buildings in the four quarters. A canal is then a street with water in it, and never cuts through a house.
- **The lab's renderer was left exactly as measured.** The game has its own renderer file that began as a copy; the season light, the texture loader and its worker moved from the lab into `worldkit` because two consumers now use them, with no change to what the lab draws.
- **The season report now records why welfare is where it is** (twelve named parts that sum to the target), so the ledger can show causes. No outcome changed: the 1,000-seed lab prints the same table. A minus zero in that record was found by the saved-game test and removed.
- **Music is on by default, and silent until the first click.** The founder asked for the soundtrack in the games; the specification forbids sound before a player's action. One switch, kept for all games, turns it off.
- **A wrong diagnosis, corrected.** The third pull request recorded that placing a building cost a slow frame. It did not. A probe that timed each command and the two frames after it showed building cost nothing extra and every season's end cost about 50 ms: the renderer swapped the sky's environment map with the season, and the engine rebuilt every material's bindings. One environment map now serves all seasons. The lesson for this ledger: a frame-time table says that something is slow, not what; name a cause only after timing it.
- **The Golden Age links to the museum by hand-chosen record ids, pinned like Atlas's pack.** Thirteen records for five research projects and eight tools (`games/golden-age.md`, "The museum behind the game"). A link claims only that this is the real thing the idea comes from. Houses and the granary have no record and no link. Which record fits which idea is the agent's judgement, for the founder to correct.
- **Markers repeat the panel, they do not replace it.** Each marked plot is also a line in the panel's list and a sentence in the plan view's label, so nothing is told by an icon alone.
- **The second chapter's numbers came from the lab, not from taste.** Its first draft was won 99% of the time by one scripted strategy. Two sweeps of start and goal (60 seeds a cell) found the point where all four strategies win at least one campaign in five and none wins nine in ten; 1,000 seeds confirmed it. The scripted players were not changed to suit it, so chapter 1's table is the same as before.
- **A chapter starts from its own authored district.** Carrying the player's city from one chapter to the next is what "linked chapters" should come to mean; it needs a saved city to be judged fit to start from, and is not done.
- **History is told in the museum's words.** A chapter's brief quotes the summary of two museum records as the museum has it in the player's language, citation markers removed and the record linked. The game writes no historical sentence of its own, so it can make no historical claim the museum has not made.
- **The five languages besides Arabic and English were translated by a Sonnet subagent** from those two, by the pivot of `docs/language.md`, and checked mechanically. Two of its choices were changed by hand (Urdu «اسکول» for a school; Indonesian "Buku kas" for the ledger).

## Work done, with files

| Unit | Files |
|---|---|
| Workspace | `gaming/package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `README.md` |
| Kernel | `gaming/packages/kernel/src/{prng,framestats,capability}.ts`, `test/prng.gtest.ts` |
| World kit | `gaming/packages/worldkit/src/{mesh,textures,atmosphere,textures-async,texture-worker}.ts`, `src/district/{site,kit,generate}.ts`, `test/district.gtest.ts` |
| Graphics lab | `gaming/labs/graphics/district.html`, `src/{main,api,camera-path,three-renderer,babylon-renderer}.ts` |
| Tools | `gaming/tools/{bench,shot,serve,probe-district,atlas-play}.ts`, `bench-summary.py`, `image-stats.py` |
| The Golden Age | Rules and lab: `gaming/games/golden-age/src/{rules,scenarios,policies,lab}.ts`. Screen: `src/view/{layout,camera,board,looks,three-board}.ts`, `src/ui/{app,stage,model,icons}.ts`, `golden-age.css`, `src/save.ts`, `index.html`, `i18n/` (seven languages). Tests: `test/{golden-age,screen}.gtest.ts`. Museum links: `data/museum-links.source.json` (chosen by hand), `data/museum-links.v1.json` (built, pinned), `tools/build-links.ts`. Tools: `gaming/tools/{simlab,simtrace,golden-age-play,golden-age-shot}.ts` |
| Music | `gaming/packages/audio/src/{music,player,control}.ts`, `music.css`, `music.json`, `i18n/` (seven languages), `test/music.gtest.ts`; `gaming/tools/music-import.ts`; `gaming/.gitignore` (`media/`) |
| Strings | `gaming/tools/check-strings.py` (every game's tables: seven languages, same keys, same blanks, no honorific, no bare parenthesis round Arabic script) |
| Atlas | `gaming/games/atlas/src/{geo,pack,rules,schedule,save}.ts`, `src/ui/{app,globe}.ts`, `atlas.css`, `index.html`, `tools/build-pack.ts`, `data/` (pinned pack, seven label files, report), `i18n/` (seven languages), `test/atlas.gtest.ts` |
| Documents | everything under `docs/gaming/` |
| Shared files touched | `docs/agents/lanes.md` (one row), `docs/status.md` (one row), `CANARY.md` (four entries), `.claude/launch.json` (one preview entry) |

## Commands run and what they returned

All on 25 November 2026, on the machine in the inventory.

| Command | Result |
|---|---|
| `shasum -a 256 -c PACKAGE-CHECKSUMS.sha256` on the extracted package | 65 of 65 OK |
| `npm --prefix gaming audit` | 0 vulnerabilities |
| `npm --prefix gaming run typecheck` | Clean |
| `npm --prefix gaming test` | 4 files, 72 tests, all pass, 1.5 s: 21 kernel and world kit, 32 Atlas, 19 Golden Age |
| `npx tsx tools/simlab.ts 1000` | 14,000 campaigns in 11 s; 0 invariant violations; every campaign ended; no probe won; win rates balanced 73.4%, merchant 31.2%, scholar 14.6%, irrigator 12.3%; one finding (two viable strategies, not three) |
| `npx tsx tools/probe-district.ts 7` | 770 buildings, 555,544 vertices, 1,326,774 triangles, 3,236 instances, 640 walkers; generated in about 100 ms |
| `npx tsx tools/bench.ts …` (nine runs) | Files in `evidence/m1/`; table in the M1 report |
| `npx tsx tools/bench.ts --channel msedge …` | **Failed**: no first frame in 120 s in Edge 157 under automation. Not investigated |
| `npm run validate` (museum, on this branch, before the documents were written) | 0 errors, 7,674 warnings, 4 min 48 s |
| `npm run validate` (museum, after rebasing onto `origin/main` at `6e9ff94d5da`) | 0 errors, exit 0 |
| `npm test` (museum, same tree) | 62 files, 30,319 tests passed, 2 skipped, exit 0, 616 s. It needs `npm --prefix site ci` first: in a fresh worktree without the site's dependencies, 22 test files cannot load and 6 tests fail, none of them to do with gaming |
| `npm --prefix gaming run atlas:pack` | 3,481 qualifying rounds; pack of 2,125 rounds and 528 places; 365 days, 1,825 rounds used, 0 problems; digest `764f347cfa66…` |
| `npx tsx tools/atlas-play.ts <dir> <lang>` for each of the seven languages | Seven full daily games in Chrome 158, no console error |
| `npm run validate`, `npm test` (museum, on the M2 branch at the Atlas commit; later commits touch only `gaming/` and `docs/gaming/`, which neither command reads) | validate: 0 errors, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 655 s |
| `npm run build`, `npm run check:static` | Not run: no file under `site/` changed |
| **Third pull request** | |
| `npm --prefix gaming run typecheck` | Clean |
| `npm --prefix gaming test` | 6 files, 100 tests, all pass, about 3 s: 21 kernel and world kit, 32 Atlas, 41 Golden Age (19 rules, 22 screen), 6 music |
| `npm --prefix gaming run strings` | Atlas 58 strings, The Golden Age 260, music 12, each in seven languages; no problem reported |
| `npm --prefix gaming audit` | 0 vulnerabilities |
| `npx tsx tools/simlab.ts 1000` after the rules began recording welfare's causes | The same table as before to the decimal (balanced 73.4%, merchant 31.2%, scholar 14.6%, irrigator 12.3%; 0 violations) |
| `npx tsx tools/music-import.ts ~/Downloads` | Six `.m4a` files, 20.5 MB in all, written outside git; measurements in [G-0007](adr/G-0007-music-and-audio.md) |
| `npx tsx tools/golden-age-play.ts <dir> <lang> [1]` for each of the seven languages | Seven runs, every step passed, no console error. English and Arabic also drove a 57-command campaign through the screen to a win at season 24 |
| `npx tsx tools/atlas-play.ts <dir> ar` with the music control added | A full daily game in Arabic, no console error; the control sits at the top corner (`evidence/m2/atlas/atlas-ar-5-with-music-control.webp`) |
| `npm run validate`, `npm test` (museum, on this branch) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 639 s |
| **Fourth pull request** | |
| `npm --prefix gaming test`, `typecheck`, `strings` | 6 files, 102 tests, all pass; clean; The Golden Age now 267 strings in seven languages |
| `npx tsx games/golden-age/tools/build-links.ts` | 13 records (11 published, 2 draft), 5 research links, 8 tool links |
| A probe in real Chrome timing each command and the two frames after it (before the fix) | Command itself 1.6 to 3.6 ms. Two frames after a season's end: 61 to 69 ms. After a tax change, a new house, a new farm: 14 ms, which is two ordinary frames |
| The same probe after keeping one environment map | Two frames after a season's end: 13.9 to 14.9 ms |
| `npx tsx tools/golden-age-play.ts <dir> <lang> [1]` for each of the seven languages | Seven runs, every step passed, no console error: two markers at the start and one after the first link, five museum links per language leading to `islam.museum/<lang>/invention/…`, and a 57-command campaign driven to a win in English and Arabic with no frame over 16.7 ms |
| `npm run validate`, `npm test` (museum, on this branch) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 636 s |
| **Fifth pull request** | |
| `npm --prefix gaming test`, `typecheck`, `strings` | 6 files, 105 tests, all pass; clean; The Golden Age now 277 strings in seven languages |
| `npx tsx tools/simlab.ts 1000 house-of-books` | 14,000 campaigns in 15 s; 0 invariant violations; every campaign ended; no probe won; merchant 78.3%, balanced 71.4%, scholar 32.7%, irrigator 24.0%; one finding (the merchant's money piles up) |
| `npx tsx tools/simlab.ts 1000` (chapter 1, after the rules gained optional starting research and canal condition) | The same table as before to the decimal |
| `npx tsx games/golden-age/tools/build-links.ts` | 13 records, 2 chapters; four summaries pinned in seven languages |
| `npx tsx tools/golden-age-play.ts <dir> <lang> [1]` for each of the seven languages | Seven runs, every step passed, no console error. New in every language: a new game opens on its brief with the museum's account of two records; chapter 2 opens from its brief as authored, and a library is built with the mouse. In English and Arabic chapter 2's campaign was driven through the screen as well (65 commands, ended short of the goal on that seed) |
| `npm run validate`, `npm test` (museum, on this branch) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 920 s (another session was working on the same machine) |

## Measurements

The engine numbers and their conditions are in [G-0002](adr/G-0002-rendering-engine.md) and the [M1 report](m1-graphics-spike.md). They are for one Apple M4 Max in Chrome 158 and are not a hardware recommendation.

**The Golden Age, same machine and browser, 1920 × 1080, High, display-synced at 120 Hz.** Frame intervals while the script drove a whole campaign through the screen (57 commands in about ten seconds, a season ended roughly three times a second: a stress test, far faster than a person plays):

| Run | Frames | Time | p50 | p95 | p99 | Longest | Over 16.7 ms | Over 33.3 ms | Over 50 ms |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| English campaign | 1,197 | 10.0 s | 8.3 ms | 9.0 ms | 9.3 ms | 9.4 ms | 0 | 0 | 0 |
| Arabic campaign | 1,208 | 10.1 s | 8.3 ms | 9.0 ms | 9.2 ms | 9.3 ms | 0 | 0 | 0 |
| _Third pull request, English_ | 1,076 | 9.9 s | 8.3 ms | 9.2 ms | 50.0 ms | 58.9 ms | 27 | 22 | 8 |
| _First version of the screen, English_ | 1,070 | 10.7 s | 8.3 ms | 9.3 ms | 74.8 ms | 108.4 ms | 40 | 24 | 20 |

Chapter 2's campaign through the screen, same conditions: English, 978 frames, p50 8.3 ms, p95 9.0 ms, p99 9.3 ms, longest 17.4 ms, 2 frames over 16.7 ms; Arabic, 975 frames, p99 17.3 ms, longest 33.4 ms, 19 frames over 16.7 ms, measured while a git push was running on the same machine, so it is the worse figure and not a clean one.

The two lower rows of the table are kept as history. The slow frames in them were one per season's end, about 50 ms each, caused by swapping the sky's environment map with the season (see "A wrong diagnosis, corrected" under Decisions). With one environment map for all seasons the campaign holds the display's rate throughout.

The full district at the end is about 1.56 million triangles and about 950 draw calls a frame (each mesh is drawn for the shadow map, the depth pre-pass and the colour pass). Nothing was measured at 1440p or 4K, on Low, or on any other machine; a machine that cannot draw 950 calls in 8 ms will show it at once.

## Evidence

| What | Where |
|---|---|
| Engine comparison, 2560 × 1440, synced and uncapped | `evidence/m1/bench-chrome-2560x1440.json`, `…-uncapped.json` |
| Three.js High, Ultra, Cinematic at 1440p and 4K | `evidence/m1/flagship/*.json` |
| Sixteen real captures | `evidence/m1/captures/*.webp` |
| Atlas: pack report, seven-language playthrough log, thirteen screenshots | `evidence/m2/atlas/` |
| Golden Age: the 1,000-seed lab report and one traced campaign | `evidence/m2/golden-age/` |
| The Golden Age on screen: seven run logs (one per language) and captures of the real game | `evidence/m2/golden-age/screen/` |

## Unresolved defects and known limits

1. Figures are placeholder cylinders; buildings are undetailed; water, sky and market are simple (M1 report, "Honest visual assessment").
2. Microsoft Edge is untested: the lab did not start under automation.
3. No soak, leak, device-loss, resize or suspension test exists.
4. The three flagship presets barely differ.
5. Only one machine has been measured.
6. The desktop app's dev-server launcher stalled twice in the first session; the tools no longer depend on it, but the in-app preview may need `npm --prefix gaming run dev` started by hand.
7. Interface strings of both games and of the music control exist in all seven languages, were written by AI agents and have been read by no native speaker. In Atlas, personal names in Turkish and Indonesian are borrowed from English. The graphics lab page is an English-only developer tool marked `noindex`.
8. Atlas has no images, no sound effects and no 3D globe, and two of its five daily rounds are military events ([`games/atlas.md`](games/atlas.md)).
9. **No game has been played by a person.** Every "playthrough" so far is the author's script. This is now the largest gap: there are two games to play and nobody has.
10. The Golden Age: in chapter 1 only two of four scripted strategies win at least one campaign in five (the GDD asks for three ways to win; chapter 2 has four); in chapter 2 money piles up with nothing to spend it on and doing nothing is comfortable; draw calls are high; two chapters of three, not linked by the player's city, with no rule new in the second; its history is told beside the play, not in it; touch is written and untried. Twelve items in [`games/golden-age.md`](games/golden-age.md).
11. The music has been proved to play, not listened to in a game. There are no sound effects ([G-0007](adr/G-0007-music-and-audio.md)).

## Needs the founder

| Item | Why it cannot be decided here |
|---|---|
| Sign-off, with the label `submission-impacting`, for the Play entries in the header, footer and homepage and for the portal pages | `docs/ai-change-gates.md` section 3; also `rewrites-all-pages`, so it should ride the weekly shell deploy. The claims register and evidence map are edited in the same commit, and those files are reserved to him |
| Approval of G-0004 before any change to `workers/`, the publish lists, `_headers` or a workflow | Hosting and deployment are his alone |
| Whether packs may be imported from a URL (a `connect-src` change on the mod-manager route) | Adds a network call to the museum's privacy posture |
| A second hostname for sandboxed third-party content | DNS and Worker change |
| Installing Blender on the build machine | A download this session had no approval for |
| Access to a Windows machine with a discrete GPU, and to people for playtests | Gates R09 and R10 cannot be met without them. He can be the first player himself: the commands are under "Play it" below |
| Where the six music files are served from in production | They are not in git by the repository's rule. Putting them on R2 with a game release changes the publish lists, which is part of G-0004 |
| What "stemoven", the artist tag inside the six WAV masters, is | The games credit the suite as the museum's own, in the Backstage page's words. If a tool or a person should be credited, or has terms, it is recorded nowhere ([G-0007](adr/G-0007-music-and-audio.md)) |
| Whether music should be on or off when a game is first opened | Default in force: on, starting at the first click, with one switch that silences every game |
| The licence and publication of the SDK | Specification 07 reserves it |
| A ruling on depicting places of worship as buildable or decorative objects in games | The reference district avoids the question by having none; a city builder will have to answer it |
| Which people may be the subject of an Atlas question | Default in force: born 700 to 1900, or died 800 to 1950 ([G-0006](adr/G-0006-atlas-content-pack.md), rule 7). The earliest generations are out until he rules |
| Whether Atlas's list of event kinds never asked is right | G-0006, rule 6 |

## Play it

```bash
npm --prefix gaming ci
npm --prefix gaming run music:import -- ~/Downloads     # once per checkout, for the music
npm --prefix gaming run dev
```

Then `http://127.0.0.1:4330/games/golden-age/index.html?lang=ar` and `http://127.0.0.1:4330/games/atlas/index.html?lang=ar`. What a first player notices in the first minute, where they stop, and what they try that the game refuses is the evidence the next round of work most needs.

## Next executable tasks

In order. Each is a pull request of its own.

1. **A person plays both games**, and what they do is written down (gate R10; `spec-v2/16`). Nothing below should be tuned before this.
2. **The Golden Age, next.** Done since the last entry: trouble marked on the plot it belongs to, silt and drought seen in the water, links to museum records, the season stall removed. Still to do: show hunger, idleness, a fever and a building at work in the district itself; merge static geometry by material to cut draw calls, and measure on a weaker machine; settle the balance finding with what a player does; the campaign's third chapter, and a rule or building that is new in a chapter (chapter 2 differs from chapter 1 in start and goal only); a sink for wealth; carrying the player's city from one chapter to the next. Done since: the second chapter, with a brief in the museum's own words. Read `spec-v2/games/golden-age.md` again first.
3. **Atlas, next steps.** Image rounds from the museum's media records (licence, credit that does not reveal the answer, place); an archive of past days; regional and era practice filters; the museum's web fonts.
4. **M1 remainder.** Cascaded shadows; a water surface with reflection and edge depth; a sky with clouds; a first authored character; a soak and leak test; fix or explain the Edge failure.
5. **M3.** The portal pages in seven languages on a branch, the gaming workflow, the release build (including where the music is served from) and its dry run, ready for the founder's sign-off.

Resume with:

```bash
git fetch origin && git log --oneline -3 && git status --short
npm --prefix gaming ci && npm --prefix gaming test && npm --prefix gaming run strings
```
