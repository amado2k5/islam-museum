# Gaming platform: implementation ledger

The single place that says what is done, what was measured, what is open and what to do next. A new session reads this first, then confirms the branch and head below with `git log -1` before trusting anything here. Update it after every verified unit of work, in the same commit.

_Last updated: 25 November 2026, with the twelfth pull request (the record of the first games deployment to UAT, which the founder asked the agent to start, and a way to reach the development server from another device). The eleventh made Granada playable: its first scenario as a page, in seven languages, from panels and a drawn plan of the valley; not yet in 3D. The tenth was that scenario as rules; the ninth, the games' own release build, Worker and deployment workflows. The sixth (Atlas image rounds: the rule decided, the museum's pictures counted, and no round built because four qualify) was written by another session and had merged first; its entries and this one's are both here, neither overwriting the other._

## Where things stand

| | |
|---|---|
| Specification | Version 2, 25 November 2026, in [`spec-v2/`](spec-v2/) (65 files of the package verified against its SHA-256 list before copying). The Granada addendum of the same day, in [`spec-granada/`](spec-granada/) (19 of 19 files verified): one more game, with its own roadmap G0 to G8 and gates GRA01 to GRA26 |
| Milestone | **M0 done. M1 measured on one machine, physical tests open. M2 built:** Atlas and The Golden Age are both playable prototypes, and the simulation lab exists. The one part of M2 not done is its last line: no person other than the author's script has played either game. **Granada: G0 (discovery) done; the first scenario can be played in a browser from panels, a plan and a 3D valley generated from code; the valley is measured on one machine and seen by no person** |
| Games | **Granada, Atlas and The Golden Age are `prototype`.** Granada is first in every list by the founder's instruction; its first scenario plays from start to finish in seven languages, from panels, a drawn plan and (since 25 November 2026) a 3D valley generated from code, which is still far from the concept image. The other eight are `planned` |
| On the public site | Nothing. No page, link, script or asset of the gaming platform is in the site build |
| Build and deployment | The games' own, apart from the website's (founder's rule of 25 November 2026): a release build, a games Worker, a publisher and four workflows are on `main`. **UAT is live** at `https://uat-games.islam.museum` since 25 November 2026 (the founder said "Yes, run UAT"; the agent started it): three games, Granada first. **Production is not deployed** and is the founder's to start ([`release-and-deploy.md`](release-and-deploy.md)) |
| Branches | `claude/islam-museum-gaming-v2-c9bd91` (M0 and M1, merged), `gaming/m2-atlas-claude` (Atlas, and the Golden Age rules and lab; merged), `gaming/m2-golden-age-screen-claude` (The Golden Age on screen, and the music; merged), `gaming/m2-golden-age-legible-claude` (markers, museum links, the season stall; merged), `gaming/m3-golden-age-chapter-two-claude` (the second chapter; the branch name says m3 by mistake, the work is Golden Age content and not milestone M3; merged), `gaming/m2-atlas-images-decision-claude` (the Atlas image-round decision and survey; merged), `gaming/golden-age-chapter-three-claude` (the third chapter and endowments; merged), `gaming/granada-g0-claude` (Granada: the package, G0 and the economy kernel; merged), `gaming/release-build-and-workflows-claude` (the games' release build, Worker and workflows; merged), `gaming/granada-village-rules-claude` (Granada's first scenario as rules; merged), `gaming/granada-screen-claude` (Granada's first scenario as a page), `gaming/granada-3d-claude` (Granada's valley in 3D; merged), `gaming/atlas-globe-3d-claude` (Atlas's globe as a lit sphere) |
| Pull requests | [amado2k5/islam-museum#8247](https://github.com/amado2k5/islam-museum/pull/8247) (M0 and M1, merged 25 Nov 2026 as `9854b2d2c1a`); [amado2k5/islam-museum#8248](https://github.com/amado2k5/islam-museum/pull/8248) (Atlas, Golden Age rules and lab, merged 25 Nov 2026 as `c45de1c952b`); [amado2k5/islam-museum#8250](https://github.com/amado2k5/islam-museum/pull/8250) (The Golden Age on screen, and the music; merged 25 Nov 2026 as `e60dab3fcbb`); [amado2k5/islam-museum#8251](https://github.com/amado2k5/islam-museum/pull/8251) (markers, museum links, the season stall; merged 25 Nov 2026 as `361a669c3a5`); [amado2k5/islam-museum#8252](https://github.com/amado2k5/islam-museum/pull/8252) (The Golden Age's second chapter; merged 25 Nov 2026 as `9a14d698bed`); [amado2k5/islam-museum#8253](https://github.com/amado2k5/islam-museum/pull/8253) (Atlas image rounds: the decision record and the survey; merged 25 Nov 2026 as `dfcfe026a2e`); [amado2k5/islam-museum#8254](https://github.com/amado2k5/islam-museum/pull/8254) (The Golden Age's third chapter and endowments; merged 25 Nov 2026 as `6f3df5dd203`); [amado2k5/islam-museum#8255](https://github.com/amado2k5/islam-museum/pull/8255) (Granada: the package, gate G0 and the economy kernel; merged 25 Nov 2026 as `a707db02d7f`); [amado2k5/islam-museum#8256](https://github.com/amado2k5/islam-museum/pull/8256) (the games' own release build, Worker and deployment workflows; labelled `submission-impacting`; merged 25 Nov 2026 as `174985af4df`, after its own workflow had passed on a hosted runner); [amado2k5/islam-museum#8257](https://github.com/amado2k5/islam-museum/pull/8257) (Granada's first scenario, "Water for the Valley", as rules; merged 25 Nov 2026 as `177e9fa0cf1`); [amado2k5/islam-museum#8258](https://github.com/amado2k5/islam-museum/pull/8258) (Granada's first scenario as a page a person can play; merged 25 Nov 2026 as `3599b8f514c`); [amado2k5/islam-museum#8260](https://github.com/amado2k5/islam-museum/pull/8260) (the record of the first UAT run, the development server on the network, and where to try each game; merged 25 Nov 2026 as `6bd4ffe09bb`); [amado2k5/islam-museum#8261](https://github.com/amado2k5/islam-museum/pull/8261) (the music on the games host; merged 25 Nov 2026 as `1057ab8a554`); [amado2k5/islam-museum#8262](https://github.com/amado2k5/islam-museum/pull/8262) (the record of the music on UAT, and the eleven games one by one); [amado2k5/islam-museum#8263](https://github.com/amado2k5/islam-museum/pull/8263) (Granada's valley in 3D; the fifteenth; merged 25 Nov 2026 as `638dce41dd2`); [amado2k5/islam-museum#8264](https://github.com/amado2k5/islam-museum/pull/8264) (Atlas's globe as a lit sphere; the sixteenth; merged as `7c31b7631c6`); [amado2k5/islam-museum#8265](https://github.com/amado2k5/islam-museum/pull/8265) (the third UAT release recorded, and the page for an outside review; the seventeenth; merged as `c943a7bd35e`); [amado2k5/islam-museum#8266](https://github.com/amado2k5/islam-museum/pull/8266) (Granada's village, mosque, mill and bridge; the eighteenth; merged as `3733031ddae`); [amado2k5/islam-museum#8267](https://github.com/amado2k5/islam-museum/pull/8267) (the corrective mandate taken as the plan, and its baseline; the nineteenth; merged as `eb951032473`); [amado2k5/islam-museum#8268](https://github.com/amado2k5/islam-museum/pull/8268) (the art pipeline in Blender and the watermill; the twentieth) |
| Lane | `gaming` (`docs/agents/lanes.md`) |
| Priority | **Granada first** (the founder's instruction of 25 November 2026, after G0 was written): it is the top priority of the platform and the first game in every list. See "The founder's instruction on Granada" below |

**In one paragraph.** The repository, hosting, languages and this machine were inventoried and the findings written down. An isolated `gaming/` workspace exists with pinned, audit-clean dependencies. A procedural reference city is generated from a seed and drawn by both Three.js and Babylon.js on WebGPU; both were benchmarked in real Chrome on an Apple M4 Max and Three.js was chosen. **Atlas** is a five-round daily geography game built entirely from museum records, playable by mouse or keyboard on a 2D globe in seven languages; it has no picture rounds, because only four of the museum's 895 media records can honestly be one ([G-0008](adr/G-0008-atlas-image-rounds.md)). **The Golden Age** has the three chapters of its campaign playable from start to finish ("The Failing Canal", "The House of Books" and "What Endures", each opening on a brief that quotes the museum's own account of the history behind it; the third brings a rule of its own, endowments): a district of 48 plots drawn in 3D from the rules' state, where a canal link is dug and its water seen to arrive, buildings are placed, the top bar shows what the season will do before it is ended and a ledger gives the causes after; the same game can be played with the keyboard alone or from a plan view made of buttons, which is the whole game where there is no WebGPU; it saves on the device and is in seven languages; a plot in trouble is marked in the district, and research and tools link to thirteen museum records. Each chapter was played 14,000 times by scripted players with no rule broken; in the first only two of four strategies are comfortably viable where the GDD asks for three, in the second all four are, and in the third all four are but one of them cannot lose. **The music of both games is the museum's own suite**, "Voices of the Museum", silent until the player's first click; the audio files are not in git. The pictures are tidy models, well short of the concept art. **No person has played either game**: every playthrough is the author's script. **Granada**, the eleventh game (a strategy game of water, farming, trade and building in a setting inspired by Nasrid Granada in 1475), has its package read and filed, its discovery report written, and the part under everything else built and tested: a ledger of whole numbers in which money and goods only ever move from one account to another, markets with two prices and a purse of their own, harvests that say what happens to what does not fit, one recipe, contracts that reserve and settle once, and the region's real distances from the museum's coordinates. Its first scenario, "Water for the Valley", exists as rules: a valley lived a day at a time, with water shared between households and fields, crops that grow as they are watered, a harvest carried into a store that may be full, works, households and five quests; six scripted players have played it 6,000 times with no rule broken. **It can now be opened and played**: a page in seven languages with a top bar that shows the real forecast, a drawn plan of the valley that follows the state of the game, tabs for the fields, the works and the market, saving on the device, and every control reachable by keyboard. **It is not in 3D**, which the founder's design asks for; that is the next work. The games have their own release build and deployment workflows, apart from the website's; Granada is the first of three pages in a release, and that release is live on the games' UAT address; production is not deployed. No portal page, SDK or mod system exists.

## The founder's instruction on Granada (25 November 2026, in chat)

Given after the discovery report was written and before it was merged. In his words, shortened only where marked:

> please give granada game top priority, show it as the first game in the list, and add Play menu at the top of the main landing page, when clicked it should directly take the visitor to granada game shown in the middle of the page and taking large space with description big screenshot or gif/video and if the user clicks play they start playing, below that you can show other games three or so in a row with smaller images and description and then below all the games the how to develop/mod and any other options. please continue developing all stages of granada till it is completely production high quality with all features and all missions and all steps completed […] once its ready, make a video of its gameplay that we can then post on social media everywhere to invite everyone to come play it. make that video in english and in arabic using the same voice as attached and use background music from islam.museum sound track that i attached earlier.

What follows from it, and what it does not settle:

| Part | Reading | State |
|---|---|---|
| Priority | Granada is worked on before the other games and listed first | In force from this entry |
| A Play entry in the site's header, leading to a Play page | The page: Granada in the middle, large, with its description, a real capture or video and a Play button that starts the game; under it the other games three to a row with smaller pictures and descriptions; under them how to develop and mod, and other options | **Asked for by the founder; not started.** It changes every page of the site, so the pull request carries the labels `submission-impacting` and `rewrites-all-pages` and is his to sign off and to deploy (`docs/ai-change-gates.md`). It is built when Granada can be played, because a Play button that does not start a game is a false claim |
| Where a game's files are served from | R2, under `games/`, in each environment's bucket (his later message) | Decided and built ([G-0004](adr/G-0004-hosting-and-release-model.md)). The music is still not hosted: the audio is never in git, so a release built by a workflow has none |
| All stages of Granada, to production quality | The roadmap G1 to G8 in order, each gate with its evidence | Under way. Physical GPUs and people who play it cannot be supplied from here and stay pending until he arranges them |
| "So good that it can easily become viral" | A goal for quality and for how easily a result is shared | No claim about reach is ever made in any text of the museum |
| The games' own build, test and deployment (four more messages the same afternoon, quoted in [`release-and-deploy.md`](release-and-deploy.md)): a separate suite; the website built and deployed for games only for pages and menus; files in R2 under `games/`, production and UAT, with the Workers that needs, following the website's process; the website's workflows never to build or deploy a game's code; and leave to merge the work to `main` | A release build, a games Worker at the games' own address, a publisher that moves a pointer, and workflows shaped like the website's | **Built and merged in the ninth pull request; never run against Cloudflare.** Starting a deployment stays the founder's |
| A gameplay video in English and Arabic | Made from the real game once it is ready, with the voices of the two films he attached (`marketing/place-walkthrough/`: Kokoro `af_heart` for English, SILMA TTS v1 for Arabic) and the museum's suite as the music | Not started; waits for a game worth filming. Posting it anywhere is his |

## The corrective mandate (25 November 2026)

On 25 November 2026 the founder gave an outside reviewer's audit of the platform against his own specifications, written as fourteen pieces of corrective work (0 to 13), with the words "process this after what you are doing now". It is kept byte for byte in [`spec-corrective/`](spec-corrective/), and from now the order of work is its order: **the baseline (0), then the P0 pieces: Granada's art (1) and economy (2), The Golden Age's economic scaling (5), Atlas's unfair rounds and images (7), and the preparation of human playtests (12)**; the rest follow. Granada stays first.

- The reviewer could not reach UAT and played nothing; it says so. Its findings are the repository's own documents read back, and each is checked against the repository before it is acted on.
- It adds no gate. [`traceability.md`](traceability.md) is the one table of every gate and every piece of this work, generated from the gate files and [`spec-corrective/plan.json`](spec-corrective/plan.json), so it cannot disagree with them. Each piece lands as its own pull request and moves its own line.
- Numbers the mandate proposes (win-rate targets, a rubric score) are its proposals and are recorded as such, not as gates.
- What waits on the founder is listed on that page: the art tool, the testers, the held images, a rollback on UAT, production.

## The eleven games, one by one (25 November 2026)

**Three exist. Eight are designs only.** "Stage" is the status in `gaming/games/registry.json`, or `planned` for a game with no code. The share done is the author's estimate against that game's own design document, not a measurement.

| # | Game | Stage | What exists | Roughly done |
|---:|---|---|---|---|
| 1 | **Granada** — The Last Kingdom of al-Andalus | prototype | The first of three acts, playable in seven languages from panels, a plan and a 3D valley generated from code; rules, ledger, scripted-player lab, saving; on UAT. **The valley is simple shapes under good light, not the painted concept.** No acts II and III, no construction, diplomacy, defence, sandbox, daily challenge | about a tenth |
| 2 | **The Golden Age** — Rise of Civilizations | prototype | Three chapters playable in 3D (WebGPU) or from a plan view, seven languages, saving, museum links; on UAT. Nine building kinds where the design asks for 25; one strategy dominates chapter 3; plain model-town look | about a quarter |
| 3 | **Atlas** — The Historical World Challenge | prototype | A daily five-round game from museum records on a globe that is a lit sphere in 3D where the browser has WebGPU (coastlines only, no terrain), seven languages, a proved 365-day schedule; on UAT. No picture rounds (four museum pictures qualify), no archive | about a third |
| 4 | Architects of History — Wonders of the World | planned | The design document only | nothing built |
| 5 | ChronoQuest — Guardians of History | planned | The design document only | nothing built |
| 6 | Dynasty — The Age of Kingdoms | planned | The design document only | nothing built |
| 7 | The House of Wisdom — Masters of Invention | planned | The design document only | nothing built |
| 8 | The Knowledge Web — Six Degrees of History | planned | The design document only | nothing built |
| 9 | Lost Manuscripts — The Archivist's Mystery | planned | The design document only | nothing built |
| 10 | Relics — The Museum Curator | planned | The design document only | nothing built |
| 11 | The Silk Road — Merchant's Legacy | planned | The design document only | nothing built |

No game is released, none is on the public site, and no person other than the author's scripts has played any of them. Shared across the games and working: the build and deployment to UAT, the music, the seeded rules kernel, the procedural world kit.

## Requirements and their state

Platform outcomes are the ten numbered in `spec-v2/01-MASTER-MANDATE.md`. Release gates are R01 to R18 in [`acceptance.md`](acceptance.md).

| Outcome | State | Notes |
|---|---|---|
| 1. Play portal in seven languages, header, footer, homepage | Not started | Site integration is `submission-impacting` and `rewrites-all-pages`; needs the founder's sign-off with that label |
| 2. Ten distinct games, and Granada as the eleventh | Two prototypes (Atlas, The Golden Age with its three chapters); Granada's first rules, not playable; eight not started | [`games/atlas.md`](games/atlas.md), [`games/golden-age.md`](games/golden-age.md), [`games/granada.md`](games/granada.md) |
| 3. WebGPU-first 3D, measured engine choice, High/Ultra/Cinematic | Engine chosen; presets are placeholders | [G-0002](adr/G-0002-rendering-engine.md) |
| 4. Art pipeline | Procedural kit exists, with nine building types for The Golden Age; music is the museum's suite; no authored assets, no real characters, no sound effects | [G-0003](adr/G-0003-procedural-assets-first.md), [G-0007](adr/G-0007-music-and-audio.md) |
| 5. Shared systems where justified | `kernel`, `worldkit`, `audio` | Music is shared (two games use it). Each game still has its own save module, of the same design: the third game to need one makes it shared. Input mapping, lifecycle, replay, sound effects: not started |
| 6. Museum-sourced history | Working for Atlas; links only in The Golden Age | Atlas: rounds are museum record ids joined to museum place ids, from a pinned pack ([G-0006](adr/G-0006-atlas-content-pack.md)); image rounds are decided and not built for want of qualifying pictures ([G-0008](adr/G-0008-atlas-image-rounds.md)). The Golden Age: research and tools link to thirteen records by id from a pinned file; nothing in its play comes from a record yet |
| 7. Creator ecosystem, SDK, mods | Threat model only | [`threat-model.md`](threat-model.md) |
| 8. Cross-game interchange | Not started | |
| 9. Static hosting, separate build and release | Built; no deployment has run | [G-0004](adr/G-0004-hosting-and-release-model.md), [`release-and-deploy.md`](release-and-deploy.md) |
| 10. Honest engagement and distribution | Not started | No portal policy has been checked yet |

| Milestone | State | Exit evidence |
|---|---|---|
| M0 inventory, ADRs, baseline, threat model, ownership | **Done** | [`m0-repository-inventory.md`](m0-repository-inventory.md), `adr/`, `threat-model.md` |
| M1 district spike, two-engine comparison, captures, benchmark | **Partly done** | [`m1-graphics-spike.md`](m1-graphics-spike.md); open: other hardware, Edge, soak, leak and device-loss tests, independent review |
| M2 Golden Age core loop, Atlas five rounds, simulation lab | **Built; feedback open** | Atlas five rounds ([`games/atlas.md`](games/atlas.md)); The Golden Age's core loop on screen and its simulation lab ([`games/golden-age.md`](games/golden-age.md)). First independent feedback on either game: not done, and it cannot be done from here |
| M3 to M11 | Not started | |
| Granada G0 discover | **Done**, on the author's own evidence | [`granada/g0-discovery.md`](granada/g0-discovery.md), [G-0009](adr/G-0009-granada-eleventh-game.md), [G-0010](adr/G-0010-granada-economy-kernel.md); gates in [`granada/acceptance.md`](granada/acceptance.md): 1 passed, 7 with partial evidence, 18 untouched |
| Granada G2 playable village | **Playable from a plan and in a 3D valley.** The first scenario's loop (water, harvest, trade, building, quests, saving) plays in a browser in seven languages; a person playing it is not done, and the valley is far from the concept image | [`games/granada.md`](games/granada.md), [G-0011](adr/G-0011-granada-village-rules.md) |
| Granada G1, G3 to G8 | Not started, except the ledger, markets, contracts and geography that G3 will stand on | [`games/granada.md`](games/granada.md) |

## Decisions

G-0001 workspace, G-0002 engine, G-0003 assets, G-0004 hosting (decided by the founder and built), G-0005 determinism, G-0006 Atlas content pack, G-0007 music, G-0008 Atlas image rounds (rule decided, none built), G-0009 Granada as the eleventh game, G-0010 Granada's economy kernel, G-0011 Granada's village rules: see [`README.md`](README.md). Smaller choices made in passing:

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
- **The third chapter was built at the founder's instruction, against the agent's recommendation to harden the engine first**, and before any person had played the first two.
- **Endowments are chapter 3's own rule, and only chapter 3's.** A scenario opts in; the first two chapters' lab tables are the same to the decimal. The price is five years of a building's upkeep because that is a rule a player can hold in their head.
- **A dominant strategy was found and is recorded, not hidden.** In chapter 3 the trading city wins every campaign. Four sweeps and one extra rule (a levy, removed) did not cure it without killing the other strategies; the root is that income grows with households and costs do not. The unit test asserts the 100% so that a later fix has to change the test knowingly.
- **The game quotes no museum text that would need an honorific.** The museum's pages add the honorific after a mention of the Prophet when they render; the game renders none. The links builder refuses such a summary, so the waqf record is linked by its label only.
- **The saved-game format has its first migration** (version 1 to 2), with a test that a migrated game plays on exactly as before.
- **Atlas image rounds stopped at the decision record, on the count.** The task allowed for it and the numbers left no other honest result: four pictures for the question as asked, twelve on the widest reading, against 52 for one round a week. The rule was written as code with tests and a survey command rather than as prose alone, so the count is repeatable and the builder can use the same function later. No pack, rule, schedule, string or screen of the game changed, so there is nothing new for a player and nothing in seven languages to check.
- **The music was missing where the founder was listening.** He asked "where is the music": it played in the development build and not on UAT, because a release carried no audio and the tracks were hosted nowhere. The tracks now have their own way into R2 (a draft release as carrier, a manual workflow that checks each file against the recorded SHA-256, the games Worker serving them in spans). The founder's later instructions the same evening, "build 3d for all the games" and "high detail graphics, pristine … and stunning", are the work after this.
- **Granada's page does not look like the founder's concept image, and he said so.** The concept is a painted view of a whole kingdom in 3D with a dense interface; the page is a flat plan with plain panels. The state page had said "not in 3D yet"; that understated how far apart they are. The 3D valley, and an interface drawn in the concept's manner, are the next work. What code alone can generate will be a modelled, lit valley, not that painting: its buildings, trees and people need authored art, which is a decision for the founder (see "Needs the founder"). **Since then (25 November 2026):** the valley is drawn in 3D from code and the panels are teal with gold lines ([`games/granada.md`](games/granada.md), "The valley in 3D"). It is nearer the concept in composition (fields, river, village, hill town, snow range) and still far from it in richness; that sentence about authored art stands.
- **The agent started the UAT deployment, on the founder's word, and nothing beyond it.** Deployment is the founder's alone by the repository's rule. Asked whether he would start the first UAT run or the agent should, he answered "Yes, run UAT". The agent ran `check`, read its result, then `release`. Production was not touched and stays his.
- **Granada was made playable before it was made beautiful.** The page that exists is panels and a drawn plan of the valley, which is also the accessible view and the whole picture where there is no WebGPU. It was built first because every later picture needs the same figures, orders and saved game under it, and because a plan can be checked to the pixel by a script. It is not what the founder's design shows, and the state page says so in its first paragraph.
- **The plan never mirrors.** For Arabic and Urdu the panels swap sides and the land keeps east on the right; the play script measures it.
- **A save is believed only if it obeys the game's own rules.** A saved game is read back through the same checks the lab runs after every day, the ledger's audit included, so a treasury edited by hand is set aside like a damaged file.
- **Five languages were translated by a Sonnet subagent**, French and Spanish from the English, Urdu, Turkish and Indonesian from the Arabic, with field names that stand first in their sentences so no article or case ending has to agree. It reported twelve wordings it was unsure of; they are listed for a native reader in the state page's "Not done".
- **Granada's step is a day, and its weather is known.** Rain and the river's year are a pure function of the seed and the day, so a forecast is the real future and no loss is a surprise ([G-0011](adr/G-0011-granada-village-rules.md)).
- **The do-nothing player reviewed the quests.** It finished "First Harvest" by letting the wheat rot and "Feed the Kingdom" with last year's grain; both conditions were rewritten. A test written from the design, not from the code, then showed that hunger alone could never make a household leave; the rule was fixed.
- **Granada's first scenario is too forgiving, and that is recorded, not tuned away.** Four ways of playing are viable; two cannot lose. Tightening it waits for a person to have played it.
- **The games run on their own address, not under the museum's.** The founder asked for the files in R2 under `games/` with the Workers that needs, and for the website's deploy to carry none of it. A second Worker at `games.islam.museum` does that without one edit to the website's Worker, publish or deploy; it also means a game's script cannot reach the museum's pages or storage. The cost: saved games live on the games' address.
- **The host sets the headers, not the release.** The first draft wrote a headers file into the release; it was removed, because then an upload could loosen its own content security policy.
- **A release is uploaded once and never changed; going live and going back are one small file.** Nothing in the games' workflows can delete an object, and a test reads the publisher's source to keep it so.
- **The games' deploy borrows the repository's one pinned wrangler** (`workers/r2-sync`), as the website's Worker does, instead of a second copy with a second lockfile. It is a shared tool, not a shared workflow.
- **The museum's checks are no longer run for a change to the games alone** (the founder's rule). They were run for the ninth pull request, because it changes museum files: two of the website's workflows, a museum test, `AGENTS.md`, the claims register.
- **Game release notes still go in the museum's `CANARY.md`**, by the standing rule. That makes every game change touch one museum file, which the founder's rule of separation argues against; the question is his and is on the list below.
- **Granada was taken up at the founder's instruction, and its cost is on the record.** The eight Version 2 games not yet started, a person playing the two prototypes, and the repair of The Golden Age's economy all wait longer ([G-0009](adr/G-0009-granada-eleventh-game.md), decision 7).
- **Granada's rules come before its picture.** Every error the package finds in its own concept images is one of arithmetic or geography, so those were built and tested first. The package's order puts an art laboratory first; the renderer laboratory exists from M1, and Granada's own look is the work after the village's rules.
- **A market that sells below what it pays cannot be opened at all.** The second concept image's price table is refused by the kernel as data, not by a rule someone must remember to apply.
- **Granada's places are the museum's, and the test holds them apart.** Málaga and Almería are 175 km from each other with inland Granada between them; a map drawn like the third image cannot be built from the pinned data.
- **A search tool was wrong, and its result was withdrawn.** The shell's `grep` on this machine is `ugrep`, which fails on a bounded repeat with an error that is easy to miss. It had reported that the museum's lustreware and tiraz records say nothing of al-Andalus. They do (Málaga for the first; Granada, Málaga and Almería for the second). The searches were redone in Python and the two records added to Granada's pack.
- **A fuzz run that never settles a contract proves nothing about settling.** Granada's first random-play run cancelled every contract before it could be filled. The generator was changed and the test now requires more than 50 contracts to end in each of the three ways.
- **Five evidence files named in earlier entries were never in the repository, and now are.** The repository ignores `*.log` and `*.txt`, so the Atlas playthrough log, the three lab logs of The Golden Age and its traced campaign stayed on the author's disk while the state pages pointed to them. It was noticed when Granada's own logs would not stage. All eight are now kept as Markdown, from the original files, and the links are corrected. The figures those pages quote were also in the committed JSON reports, so no number changes.
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
| Atlas | `gaming/games/atlas/src/{geo,pack,rules,schedule,save}.ts`, `src/ui/{app,globe}.ts`, `atlas.css`, `index.html`, `tools/build-pack.ts`, `data/` (pinned pack, seven label files, report), `i18n/` (seven languages), `test/atlas.gtest.ts`. Image rule, used by no screen yet: `src/images.ts`, `tools/survey-images.ts`, `test/images.gtest.ts` |
| Granada | `gaming/games/granada/src/sim/{economy,appraise,random-play}.ts`, `src/world/geography.ts`, `data/museum-records.{source,v1}.json`, `tools/{build-records,fuzz-report}.ts`, `tools/mutate-economy.py`, `test/{economy,geography}.gtest.ts`. Documents: `docs/gaming/spec-granada/` (the package), `docs/gaming/granada/{g0-discovery.md,acceptance.md,acceptance.json}`, `docs/gaming/games/granada.md`, `docs/gaming/adr/G-0009`, `G-0010` |
| Granada, the page | `gaming/games/granada/index.html`, `src/ui/{app,model,map}.ts`, `src/ui/granada.css`, `src/save.ts`, `i18n/` (seven languages), `test/screen.gtest.ts`; `gaming/tools/granada-play.ts`; `gaming/games/registry.json` (Granada now has a page); `docs/gaming/evidence/granada/screen/` |
| Granada, first scenario | `gaming/games/granada/src/sim/{village,scenarios,players}.ts`, `tools/village-lab.ts`, `test/village.gtest.ts`; the ledger's new commands in `src/sim/economy.ts`; `docs/gaming/adr/G-0011-granada-village-rules.md`; `docs/gaming/evidence/granada/village/` |
| Release and deployment | `gaming/tools/{build.ts,check-release.mjs,release-smoke.ts}`, `gaming/games/registry.json`; `workers/games/src/{index,route}.js`, `publish.mjs`, `wrangler.production.toml`, `test/` (five test files, a stand-in bucket and a stand-in AWS CLI); `.github/workflows/games-{build,deploy,deploy-uat,deploy-env}.yml`; the website's `validate.yml` and `build.yml` (a `paths-ignore` list each); `scripts/games-separation.test.ts`; `docs/gaming/release-and-deploy.md` |
| Documents | everything under `docs/gaming/` |
| Shared files touched | `docs/agents/lanes.md` (one row), `docs/status.md` (one row), `CANARY.md` (six entries), `.claude/launch.json` (one preview entry) |

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
| **Sixth pull request** | |
| `npm --prefix gaming run atlas:images` (at museum commit `361a669c3a5`) | 895 media records, each given one verdict: 4 can be a "where is this?" round (4 places), 0 a "where was this made?" round under a free licence, 8 more under the V&A's terms (4 places); 883 refused with a counted reason. Not enough for a weekly round (52) or a daily one (365). 5,794 buildings, 247 naming one place, 214 of those scoreable, 7 with any picture |
| `npm --prefix gaming test`, `typecheck`, `strings`, `audit` (after merging the fifth pull request into this branch) | 7 files, 121 tests, all pass (21 kernel and world kit, 48 Atlas of which 16 are the image rule, 46 Golden Age, 6 music); clean; Atlas 58 strings, The Golden Age 277, music 12, none changed by this work; 0 vulnerabilities |
| `npx tsx tools/atlas-play.ts …` | Not run again: no file the Atlas page loads was changed |
| `npm run validate`, `npm test` (museum, on this branch before the fifth pull request was merged into it) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 727 s, **on the second run**. The first run, in a fresh worktree, failed for a reason that has nothing to do with gaming: two tests of `scripts/tafsir.test.ts` need `.cache/graph.json`, which did not exist yet, and a test worker then ran out of memory at the default 8 GB heap. After `npm run graph` (143 s) the whole suite passed. A fresh worktree needs `npm --prefix site ci` and `npm run graph` before `npm test` |
| `npm run validate`, `npm test` (museum, on this branch after that merge, at `4ba6b1d727d`) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 1,291 s, run as `CI=1 npm test`, which is the repository's own CI setting (`vitest.config.ts`: one test file at a time, 12 GB heap; no test reads `CI`, so the assertions are the same). Two plain `npm test` runs before it did not pass, neither on an assertion: in one, three whole-repository tests timed out at 300 s; in the other a worker ran out of memory at the default 8 GB heap. Both have one cause: when a worker runs out of memory, vitest exits and leaves its other workers running, and they starve the next run. A further attempt that passed the heap size on the command line never started a worker and was stopped |
| `npm run build`, `npm run check:static` | Not run: no file under `site/` changed |
| **Seventh pull request** | |
| `npm --prefix gaming test`, `typecheck`, `strings` | 6 files, 110 tests, all pass; clean; The Golden Age now 290 strings in seven languages |
| `npx tsx tools/simlab.ts 1000 what-endures` | 14,000 campaigns in 16 s; 0 invariant violations; every campaign ended; no probe won; merchant 100%, scholar 74.0%, balanced 41.5%, irrigator 37.6%; two findings (the merchant always wins; its money piles up) |
| `npx tsx tools/simlab.ts 1000` and `… 1000 house-of-books` after the rules gained endowments | Both tables the same as before to the decimal |
| Four sweeps of chapter 3 in the lab (60 seeds a cell): endowment price, number asked for, welfare and learning goals, chapter length, a start without ready trade, a levy on households | No setting tried brought the merchant under 90% while leaving three other strategies at one win in five; the levy left the merchant as the only winner and was removed |
| `npx tsx games/golden-age/tools/build-links.ts` | 16 records, 9 tool links, 3 chapters; six summaries pinned in seven languages; the waqf summary refused for quoting (it speaks of the Prophet) and linked by label |
| `npx tsx tools/golden-age-play.ts <dir> <lang> [1]` for each of the seven languages | Seven runs, every step passed, no console error. New in every language: chapter 3 opens on its brief as authored, the bath is endowed with the mouse (140 coins to 100) and then refuses to be cleared. In English and Arabic chapter 3's campaign was driven through the screen as well (the merchant, 76 commands, won with 11 endowments) |
| `npm run validate`, `npm test` (museum, on the seventh pull request's branch before the sixth was merged into it) | validate: 0 errors, 7,674 warnings, exit 0. test: 62 files, 30,319 passed, 2 skipped, exit 0, 530 s. Not run again after the merge: what came in is the Atlas session's gaming-only change, which passed the same gates on its own branch |
| **Eighth pull request (Granada)** | |
| `shasum -a 256 -c PACKAGE-CHECKSUMS.sha256` on the extracted Granada package | 19 of 19 OK. The nested Version 2 archive has the SHA-256 of the one verified for the first pull request |
| `npm --prefix gaming run typecheck`, `npm --prefix gaming test`, `strings`, `audit` | Clean; 9 files, 164 tests, all pass in about 6 s (21 kernel and world kit, 48 Atlas, 51 Golden Age, 6 music, 38 Granada: 30 for the economy and 8 for geography); Atlas 58 strings, The Golden Age 290, music 12, none changed (Granada has none); 0 vulnerabilities |
| `npx tsx --tsconfig tsconfig.json games/granada/tools/fuzz-report.ts` | 60,000 random commands over 300 random openings in 2.2 s; 24,460 accepted (40.8%); the books sound after every one; of 1,200 contracts 436 ended settled, 297 cancelled, 236 failed, 76 still accepted, 155 never taken up. The first run, before the generator was changed, settled none |
| `npm --prefix gaming run granada:mutations` | The economy kernel broken on purpose in 15 ways; its tests failed for all 15 |
| `npm --prefix gaming run granada:records` | 25 museum records pinned (11 places with coordinates), every label in seven languages; 20 draft, 5 published; digest `3b9fd1e2af98…` |
| `npm run validate`, `npm test` (museum, on this branch) | validate: 0 errors, 7,674 warnings (89,037 entities, 254,481 prose files), exit 0, 277 s. test: 62 files, 30,319 passed, 2 skipped, exit 0, 1,263 s, **on the second run**, as `CI=1 npm test` (the repository's CI setting: one test file at a time, 12 GB heap; no test skipped). The first run, plain `npm test`, stopped after 71 s when one test worker ran out of memory at the default 8 GB heap, before any assertion failed; the six orphaned workers it left were stopped by hand. Nothing the museum's tests read was changed by this work |
| `npm run build`, `npm run check:static` | Not run: no file under `site/` changed |
| **Ninth pull request (the games' build and deployment)** | |
| `npm --prefix gaming run build:release` | 37 files, 3.12 MB, in 1.4 s: two game pages (The Golden Age, Atlas), Granada listed as planned with no page; music off |
| `npm --prefix gaming run check:release -- --allow-dirty` | The release matches its manifest |
| `npm --prefix gaming run release:smoke` (real Chrome 158, the Worker's own code over a folder laid out like the bucket) | Both games in Arabic and English: The Golden Age started in 3D and a season was ended; Atlas showed its first question; no console error, no failed request, no content security policy violation, no request to another origin; 33 objects read, none outside `games/`; about 1 MB transferred for a game's page |
| `node --test workers/games/test/*.test.mjs` | 31 tests, all pass: routing and headers, the request handler against a bucket in memory, the release and rollback rules, a rehearsal of a whole release cycle with a stand-in for the AWS CLI, and the separation of the games' workflows from the website's |
| `actionlint` on the four games workflows and on `validate.yml` | No finding. (`build.yml` has one that was there before: actionlint does not know the `queue` key) |
| `npx vitest run scripts/games-separation.test.ts` | 4 tests, all pass |
| `npm --prefix gaming test`, `typecheck`, `strings` | 9 files, 164 tests, all pass; clean; no string changed. The play scripts were run once more in Arabic after the music control's code changed (`tools/golden-age-play.ts`, `tools/atlas-play.ts`): every step passed, the music still starts after a click in a development build, no console error |
| `npm run validate`, `CI=1 npm test` (museum; run because this pull request changes museum files: two of the website's workflows, a museum test, `AGENTS.md`, the claims register) | validate: 0 errors, 7,674 warnings, exit 0, 275 s. test: 63 files, 30,323 passed, 2 skipped, exit 0, 1,254 s (one file and four tests more than before: the separation guard) |
| `npm --prefix gaming test` after a generous time allowance was set | 164 pass. Before it, three heavy tests failed once by the clock (the default five seconds) while the museum's suite ran on the same machine; every assertion held, and four further runs passed. The allowance is now two minutes, because a hosted runner is slower |
| A games deployment to UAT or production | **Not run.** It is the founder's to start |
| **Tenth pull request (Granada's first scenario as rules)** | |
| `npm --prefix gaming test`, `typecheck`, `strings` | 10 files, 195 tests, all pass (69 are Granada's: 33 for the ledger, 8 for geography, 28 for the village); clean; no string changed, Granada still has none |
| `npm --prefix gaming run granada:village-lab -- 1000` | 6,000 campaigns over 1,000 seeds in 40 s; no rule broken; wins: does nothing 0%, random 0%, mender 99.5%, builder 91.6%, merchant 91.4%, irrigator 100%. Two findings: two players cannot lose |
| `npm --prefix gaming run granada:mutations` | 18 of 18 deliberate breakages of the ledger caught |
| `node --test workers/games/test/*.test.mjs`, `npm --prefix gaming run build:release`, `check:release` | 31 pass; the release builds and matches its manifest (still two game pages: Granada has none) |
| The museum's checks | Not run, by the founder's rule: the change is to the games alone, apart from one entry in `CANARY.md`, for which the one museum test that reads that file was run (`npx vitest run scripts/sample.test.ts`: 4 tests pass) |
| **Eleventh pull request (Granada as a page)** | |
| `npm --prefix gaming test`, `typecheck`, `strings` | 11 files, 207 tests, all pass (81 are Granada's: 33 ledger, 8 geography, 28 village, 12 for the page's figures and the saved game); clean; Granada 190 strings in seven languages, the others unchanged |
| `npm --prefix gaming run granada:play -- <dir> <lang>` for each of the seven languages, real Chrome 158 | Seven runs, every step passed, no console or network error; a whole campaign carried through the page to a win in each (12 orders, score 1,254). In Arabic and Urdu the panels are mirrored and the plan is not (the mill field stays west of the olive terrace, measured) |
| `npm --prefix gaming run build:release`, `check:release`, `release:smoke` | 46 files, 3.28 MB, three pages with Granada first; matches its manifest; in real Chrome behind the Worker's code all three games start in Arabic and English with no content security policy violation; Granada's page transfers about 100 KB |
| `npm --prefix gaming run granada:village-lab -- 1000` after one rule changed (a harvested field lies fallow the same day) | 6,000 campaigns, no rule broken; does nothing 0%, random 0%, mender 99.5%, builder 91.6%, merchant 96.4%, irrigator 100% |
| `node --test workers/games/test/*.test.mjs` | 31 pass |
| The museum's checks | Not run, by the founder's rule: the change is to the games alone, apart from one entry in `CANARY.md` (`npx vitest run scripts/sample.test.ts`: 4 tests pass) |
| **Twelfth pull request (the first UAT run)** | |
| `gh workflow run games-deploy-uat.yml -f action=check` (the founder: "Yes, run UAT") | Run 45713511479, success in 95 s, nothing written: owner check, environment, the build of `3599b8f514c`, the release verified, the Worker's 31 tests on the runner, a dry run that read the UAT bucket and found nothing released |
| `gh workflow run games-deploy-uat.yml -f action=release` | Run 45713830185, success in two minutes: Worker `islam-museum-games-uat` deployed and the Custom Domain `uat-games.islam.museum` created; 46 files, 3.28 MB uploaded to `islam-museum-uat` under `games/r/20261125-3599b8f514c/`, read back and verified; the pointer written |
| `curl` on `https://uat-games.islam.museum` | `/_channel`, `/granada/`, `/golden-age/`, `/atlas/`, `/release.json`, `/robots.txt`, `/` all 200 with the content security policy, `nosniff` and `noindex` |
| Granada opened on UAT in Arabic in the app's browser | Started; a harvest and a repair ordered; three days passed; saved on the UAT address; no music control (a release has no music); console empty |
| The development server on the network address (`gaming-dev-lan`) | `http://192.168.2.144:4330/games/{granada,golden-age,atlas}/index.html` answered 200 from the machine's own network address |
| The museum's checks for the museum files this record touches (`CANARY.md`, `docs/status.md`, the claims register, the evidence map) | `npm run validate`: 0 errors, 7,674 warnings, exit 0. `npx vitest run scripts/sample.test.ts scripts/edu.test.ts scripts/games-separation.test.ts` (the tests that read those files): 3 files, 108 tests pass. The whole of `npm test` was not run: no code and no record changed |
| A production deployment; a rollback on Cloudflare | **Not run** |
| **Thirteenth pull request (the music on the games host)** | |
| `node --test workers/games/test/*.test.mjs` | 36 tests pass: the Worker serves `/media/…` from `games/media/…` whole and in spans (206), refuses a span that cannot be met (416) and anything not under `games/`; the publisher uploads only tracks that match `music.json` byte for byte, once, and never over a different file |
| `npm --prefix gaming run build:release -- --music-base ../media/music/`, `release:smoke` | 46 files, 3.28 MB; in real Chrome behind the Worker's code, all three games in Arabic and English showed the music control, asked for a track after a click, got 206 and played (the browser muted), with no content security policy violation |
| `gh release create games-media --draft … gaming/media/music/*.m4a` | Six files attached to a draft release (not public), sizes as `music.json` records |
| `actionlint` on `games-media.yml`, `games-build.yml` | No finding |
| **Fourteenth pull request (the music on UAT, recorded)** | |
| "Upload the games' music", UAT, `check` then `upload` | Runs 45717165700 and 45717350066: six tracks fetched from the draft release, each matching `music.json`, uploaded to `islam-museum-uat` under `games/media/music/` and read back |
| "Deploy the games to UAT", `release` | Run 45717519130: the Worker updated; release `20261125-1057ab8a554` (built to look for its music at `../media/music/`) uploaded, verified and made live, with `20261125-3599b8f514c` kept as the one before |
| `curl` on `https://uat-games.islam.museum/media/music/…` | A span of bytes: 206, `content-range: bytes 0-99999/3458181`, `audio/mp4`. A whole track: 200, 3,581,611 bytes. A track that is not there: 404. The SHA-256 of a track as fetched equals the one in `music.json` |
| `npx tsx --tsconfig tsconfig.json tools/uat-check.ts` (real Chrome, muted, Arabic) | Granada, The Golden Age and Atlas on UAT: each started, showed the music control, asked for no track before a click, got 206 and played after one; The Golden Age in 3D; no console error |
| A rollback on UAT | Not run: the founder was testing there |

### The fifteenth pull request: Granada's valley in 3D (25 November 2026)

```
npm --prefix gaming test                      12 files, 232 tests passed (Granada: 5 files, 106 tests; 25 of them new, for the valley and its camera)
npm --prefix gaming run typecheck             clean
npm --prefix gaming run strings               granada 7 languages, 196 strings; atlas 58; golden-age 290; audio 12
node --test workers/games/test/*.test.mjs     36 passed
npm --prefix gaming run build:release:music   built; check:release --allow-dirty: "the release matches its manifest"
npm --prefix gaming run release:smoke         "the release starts and plays behind the host's own headers"; Granada started in 3D in Arabic and in English under the content security policy; 71 bucket reads, none outside games/
tools/granada-play.ts <dir> <lang>            passed in ar, en, ur, fr, es, tr, id: the page's checks on the plan, then the 3D valley (starts, shows, a click on the mill field opens it, arrows, O and Home steer it, the plan and the valley change places), then a whole campaign won
tools/granada-shot.ts                         captures of eight views and four seasons; MEASURE=1 for frame times; DPR=2 for a Retina screen
```

The first run of the new valley tests failed three times, and two of the three were faults in the valley, not in the tests: a cypress planted in the pool, and the two short channels (the intake and the main) having water in one stretch only, so that a broken channel could not have been shown half full. A later run found a palm inside the olive terrace and the channel's water dipping under sloping land at its edge. All four were fixed in the geometry. The channels and the hill town's walls had also been drawn as separate slabs on every slanted stretch, because their pieces were turned by the mirror of the right angle; that was found by looking at a capture, not by a test.

### The sixteenth pull request: Atlas's globe as a lit sphere (25 November 2026)

```
npm --prefix gaming test                      13 files, 236 tests passed (Atlas: 52; four new, holding the sphere to the 2D projection)
npm --prefix gaming run typecheck             clean
npm --prefix gaming run strings               unchanged: no new string
npm --prefix gaming run build:release:music   built; check:release --allow-dirty: "the release matches its manifest"
npm --prefix gaming run release:smoke         all three games start in 3D in Arabic and in English under the content security policy
tools/atlas-play.ts <dir> <lang>              a full daily game in each of the seven languages with the lit sphere showing, then the drawn globe alone with no3d; no console error
```

The first capture showed two faults that no test would have: the sea's shine made a white blot over Italy, and the paler water along the coasts was drawn in three bands that read as depth contours the game does not have. The shine was dulled and the bands replaced by one soft edge.

### The third games release to UAT: the 3D valley and the lit globe (26 November 2026 UTC)

Asked whether to release both changes to UAT, the founder answered "Release to UAT". The agent then started "Deploy the games to UAT" twice, on the games build of `main` at `7c31b7631c6` (build run 45725218408):

```
action check     run 45728072381   passed; wrote nothing
action release   run 45728259166   passed; live 20261125-7c31b7631c6, before it 20261125-1057ab8a554
curl /granada/ /golden-age/ /atlas/ /release.json      200 each, with the content security policy, nosniff and noindex
tools/uat-check.ts https://uat-games.islam.museum ar   Granada, The Golden Age and Atlas each start in 3D, show the music control, play a track after a click (206), no console error
```

Not done: a rollback on UAT (it would change what the founder is looking at, and he was asked about a release only); production.
### The eighteenth pull request: Granada's village, mill and bridge (25 November 2026)

```
npm --prefix gaming test                      13 files, 240 tests passed (Granada's valley: 29; four new, for the mosque, the mill's wheel, the roads and the cart)
npm --prefix gaming run typecheck             clean
npm --prefix gaming run build:release:music   built; check:release --allow-dirty: "the release matches its manifest"
npm --prefix gaming run release:smoke         "the release starts and plays behind the host's own headers"
tools/granada-play.ts <dir> en, then ar       passed, the 3D valley included
tools/granada-shot.ts                         twelve views captured; 8.3 ms median, 9.1 ms 95th centile, 2.4 million triangles
```

Played in English and Arabic only this time: no string changed. Found by looking at captures, not by tests: wheat that read as paper cards from near, steps of the bridge's bank standing through the road, a village ground too bare, and a pale streak where the terraces' banks took the colour of dry hills. A new test failed once, rightly: fruit trees put in the village's yards had been added to the list a test reserves for orchard plots.

### The twentieth pull request: an art pipeline in Blender, and the first hero asset (25 November 2026)

Asked whether Blender might be installed for Granada's art, the founder answered "Install Blender". `brew install --cask blender` put Blender 5.3.0 in `/Applications` (Homebrew also cleared some of its own old logs and cache as it does).

```
npm --prefix gaming run art:mill -- <preview.png>   textures painted, the mill built, exported, and rendered: 16,172 triangles in 6 objects
npm --prefix gaming run art:manifest                granada/mill: 16172 triangles, 17 files, 5,472,930 bytes
npm --prefix gaming run art:manifest -- --check     "the models on this machine are the ones the manifest records"
two runs compared                                   15 of 15 exported textures byte-identical
npm --prefix gaming test                            14 files, 244 tests passed (four new: the manifest is held to the scripts)
```

The mill is a preview and is not in the game. Its first render showed a ring of the wrong material where a round door was cut through stone and plaster; the door is now built in its arch.

### The fourth games release to UAT: Granada's village, mosque, mill and bridge (26 November 2026 UTC)

Asked whether to release the village pass to UAT, the founder answered "Release to UAT". On the games build of `main` at `484ead40122` (build run 45733224735):

```
action check     run 45733437315   passed; wrote nothing
action release   run 45733594650   passed; live 20261125-484ead40122, before it 20261125-7c31b7631c6
tools/uat-check.ts https://uat-games.islam.museum en, then ar   the five addresses each start in 3D, play a track after a click (206), no console error
```

A capture of Granada on UAT shows the tiled village, the minaret, the mill and the bridge. Not done: a rollback on UAT; production.

### The twenty-second pull request: the authored mill in the valley (25 November 2026)

```
npm --prefix gaming test                      14 files, 247 tests passed (three new: the code-made mill kept apart, the authored one set down with its wheel in the channel, where models are fetched from)
node --test workers/games/test/*.test.mjs     36 passed (the host names a model's entry file for what it is)
tools/granada-play.ts <dir> en, then ar       passed; models: ["granada/mill"], no failure, no console error
npm run build:release:music + release:smoke   as the workflow builds it, with no models: passes, and mill.gltf is never asked for
npm run build:release:media + release:smoke   with the models staged beside the release: passes, the authored mill loads under the content security policy
tools/granada-shot.ts                         8.3 to 8.4 ms median with the model in; 2.42 million triangles from the first view
```

The first run failed to load the model, and the valley kept its own mill and said why, which is what it is meant to do: the development server had stopped to re-bundle when the loader was first asked for. The loader is now named to it in advance.

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

Chapter 3's campaign through the screen, same conditions, a district of about 500 households at the end: English, 963 frames, p50 8.3 ms, p95 16.4 ms, p99 16.8 ms, longest 17.7 ms, 24 frames over 16.7 ms and none over 33.3 ms (a git commit ran on the machine during this run); Arabic, 989 frames, p95 9.2 ms, p99 16.6 ms, longest 17.3 ms, 9 frames over 16.7 ms. So a full district sometimes takes two display frames instead of one, and never more.

The two lower rows of the table are kept as history. The slow frames in them were one per season's end, about 50 ms each, caused by swapping the sky's environment map with the season (see "A wrong diagnosis, corrected" under Decisions). With one environment map for all seasons the campaign holds the display's rate throughout.

The full district at the end is about 1.56 million triangles and about 950 draw calls a frame (each mesh is drawn for the shadow map, the depth pre-pass and the colour pass). Nothing was measured at 1440p or 4K, on Low, or on any other machine; a machine that cannot draw 950 calls in 8 ms will show it at once.

**Granada's valley (25 November 2026, Apple M4 Max, Chrome 158).** At 1494 × 888 and at 2988 × 1776: median 8.3 ms, 95th centile 9.0 to 9.3 ms at three views, which is the display's 120 Hz. 1.9 to 3.0 million triangles a frame, 115 to 297 draw calls. Earlier runs the same day, while the machine did other work: 78 to 83 frames a second at the larger size; medians of 16 and 20 ms with 95th centiles of 33 and 45 ms at the smaller. Before the trees had a light shape for far off, the same scene carried 5.5 million triangles and ran at 22 frames a second. One machine; no weaker GPU, no phone, no Windows, no Safari or Firefox. Details in [`games/granada.md`](games/granada.md).

## Evidence

| What | Where |
|---|---|
| Engine comparison, 2560 × 1440, synced and uncapped | `evidence/m1/bench-chrome-2560x1440.json`, `…-uncapped.json` |
| Three.js High, Ultra, Cinematic at 1440p and 4K | `evidence/m1/flagship/*.json` |
| Sixteen real captures | `evidence/m1/captures/*.webp` |
| Atlas: pack report, seven-language playthrough log, thirteen screenshots | `evidence/m2/atlas/` |
| Atlas: the image survey (every qualifying picture, every reason for refusal with its count, the building figures) | `evidence/m2/atlas/image-survey.json` |
| Golden Age: the 1,000-seed lab report and one traced campaign | `evidence/m2/golden-age/` |
| The Golden Age on screen: seven run logs (one per language) and captures of the real game | `evidence/m2/golden-age/screen/` |
| Granada: the test output, the random-play report, the mutation check, the pinned records | `evidence/granada/g0/` |
| The release build opened in real Chrome behind the Worker's code (report and two captures), and the Worker's test output | `evidence/release/` |
| Granada's first scenario: the lab over 1,000 seeds | `evidence/granada/village/` |
| Granada's page: seven play runs, the release smoke report, eight captures of the real page | `evidence/granada/screen/` |

- Granada's valley in 3D: [`evidence/granada/valley3d/`](evidence/granada/valley3d/) (eight captures: the page in English and in Arabic, the village, the pool, the hill town, the whole valley, autumn, winter rain; the play reports in seven languages; the release smoke report).

- Atlas's globe as a lit sphere: [`evidence/atlas/globe3d/`](evidence/atlas/globe3d/) (four captures and the release smoke report).

- The third UAT release checked in Chrome: [`evidence/release/uat-3d-check.json`](evidence/release/uat-3d-check.json), with captures of Granada and Atlas on UAT in Arabic.

- The art pipeline's first asset: [`evidence/granada/art/mill-preview.webp`](evidence/granada/art/mill-preview.webp), rendered in Blender from `gaming/art/blender/granada_mill.py`.

- The fourth UAT release checked in Chrome: [`evidence/release/uat-release-4-en.json`](evidence/release/uat-release-4-en.json), the same in Arabic, and a capture of Granada there.

- The authored mill in the valley: [`evidence/granada/art/mill-in-the-valley.webp`](evidence/granada/art/mill-in-the-valley.webp).

## Unresolved defects and known limits

1. Figures are placeholder cylinders; buildings are undetailed; water, sky and market are simple (M1 report, "Honest visual assessment").
2. Microsoft Edge: the graphics lab's benchmark did not start under automation in Edge 157, and that is unexplained. The games themselves do run in it: on 25 November 2026 all three opened on UAT in Edge 157 in 3D with no console error ([`evidence/corrective/baseline/`](evidence/corrective/baseline/)). Nothing has been measured in Edge.
3. No soak, leak, device-loss, resize or suspension test exists.
4. The three flagship presets barely differ.
5. Only one machine has been measured.
6. The desktop app's dev-server launcher stalled twice in the first session; the tools no longer depend on it, but the in-app preview may need `npm --prefix gaming run dev` started by hand.
7. Interface strings of both games and of the music control exist in all seven languages, were written by AI agents and have been read by no native speaker. In Atlas, personal names in Turkish and Indonesian are borrowed from English. The graphics lab page is an English-only developer tool marked `noindex`.
8. Atlas has no images and no sound effects, its globe is lit in 3D but carries no terrain, and two of its five daily rounds are military events ([`games/atlas.md`](games/atlas.md)). The images are held up by the museum's records, not by the game: four pictures qualify ([G-0008](adr/G-0008-atlas-image-rounds.md)).
9. **No game has been played by a person** (three now exist). Every "playthrough" so far is the author's script. This is now the largest gap: there are two games to play and nobody has.
10. The Golden Age: in chapter 1 only two of four scripted strategies win at least one campaign in five (the GDD asks for three ways to win; chapter 2 has four); in chapter 2 money piles up with nothing to spend it on and doing nothing is comfortable; in chapter 3 the trading city wins every campaign and still ends rich, because income grows with households and costs do not; draw calls are high; three chapters, not linked by the player's city; its history is told beside the play, not in it; touch is written and untried. Twelve items in [`games/golden-age.md`](games/golden-age.md).
11. The music has been proved to play, not listened to in a game. There are no sound effects ([G-0007](adr/G-0007-music-and-audio.md)).
12. **Nobody has played Granada, and its 3D valley is not the concept.** The valley is drawn in 3D from code: simple shapes, measured on one fast machine, with no cascaded shadows, no reflections and no recovery from a lost graphics device. Gate GRA12 has captures and no independent art review. The scenario is too forgiving as it stands: three of four scripted ways of playing win at least 95 in 100 ([G-0011](adr/G-0011-granada-village-rules.md)). Its strings in seven languages are unread by a native speaker. Its prices do not move, its goods do not travel, it has one warehouse and its clock is a counter ([G-0010](adr/G-0010-granada-economy-kernel.md)). Its numbers are the package's illustrations, in which pressing oil earns less than selling olives.
13. The museum has almost nothing on what Granada's game is about: no record of the Vega's crops or their seasons, of the canals as a network, of the silk trade or the coinage near 1475, and it does not say who ruled in that year in what was read ([`granada/g0-discovery.md`](granada/g0-discovery.md), sections 5 and 6). Twenty of the 25 records pinned for the game are draft-tier.
14. On this machine `grep` is `ugrep` and fails on a bounded repeat such as `.{60}`; a search that returns nothing may have failed. Searches that a claim rests on are done in Python.
15. **The games are on UAT only.** Production is not deployed; a rollback has not been made on Cloudflare (it needs a second release); only Granada was actually played on UAT, and only for three days by the author. A release has no music and no edge caching ([`release-and-deploy.md`](release-and-deploy.md)).

## Needs the founder

| Item | Why it cannot be decided here |
|---|---|
| Sign-off, with the label `submission-impacting`, for the Play entries in the header, footer and homepage and for the portal pages | `docs/ai-change-gates.md` section 3; also `rewrites-all-pages`, so it should ride the weekly shell deploy. The claims register and evidence map are edited in the same commit, and those files are reserved to him |
| Deploying the games to production: "Deploy the games to production", action `check`, then `release` | Deployment is his alone; he asked the agent to start UAT, not production. It creates the Worker `islam-museum-games` and the Custom Domain `games.islam.museum`. Look at `https://uat-games.islam.museum/granada/?lang=ar` first |
| Granada's art: how the valley's buildings, trees, terrain and people are to be made so that the game approaches the concept image | Code can generate a lit, modelled valley from seeds (as in The Golden Age), and that is what is built next. The concept's richness needs authored models and textures: scripted modelling in Blender (free; a download this lane has had no approval for), licensed asset packs (a licence and possibly money), or an artist. Default in force: generated from code only |
| Whether a game's release notes belong in the museum's `CANARY.md` or in a changelog of the games' own | The standing rule says every change is noted in `CANARY.md`; his rule of 25 November says a game change should touch only the games' files. Default in force: `CANARY.md`, as before |
| Whether packs may be imported from a URL (a `connect-src` change on the mod-manager route) | Adds a network call to the museum's privacy posture |
| A second hostname for sandboxed third-party content | DNS and Worker change |
| Installing Blender on the build machine | A download this session had no approval for |
| Access to a Windows machine with a discrete GPU, and to people for playtests | Gates R09 and R10 cannot be met without them. He can be the first player himself: the commands are under "Play it" below |
| Uploading the music to production, with the production games deployment | "Upload the games' music", environment `production`, `check` then `upload`: it is a deployment, and production is his. On UAT it is done |
| What "stemoven", the artist tag inside the six WAV masters, is | The games credit the suite as the museum's own, in the Backstage page's words. If a tool or a person should be credited, or has terms, it is recorded nowhere ([G-0007](adr/G-0007-music-and-audio.md)) |
| Whether music should be on or off when a game is first opened | Default in force: on, starting at the first click, with one switch that silences every game |
| The licence and publication of the SDK | Specification 07 reserves it |
| A ruling on depicting places of worship as buildable or decorative objects in games | The reference district avoids the question by having none; a city builder will have to answer it |
| Which people may be the subject of an Atlas question | Default in force: born 700 to 1900, or died 800 to 1950 ([G-0006](adr/G-0006-atlas-content-pack.md), rule 7). The earliest generations are out until he rules |
| Whether Atlas's list of event kinds never asked is right | G-0006, rule 6 |
| Whether V&A photographs (licence `VAM-NC`) may be shown in a game | The V&A's permission is for the museum's pages on its terms. Default in force: no; eight pictures wait on it ([G-0008](adr/G-0008-atlas-image-rounds.md), rule 3) |
| Whether a manuscript page may ever be a picture question | Default in force: no, because a record does not say whether a leaf is a page of the Qur'an or a figurative painting (G-0008, rule 2) |
| Whether 52 pictures (a weekly image round) and 365 (a daily one) are the right thresholds | The agent's judgement of what a fair schedule needs (G-0008, rule 6) |
| Granada: whether a product of the vine other than fruit may be a good in the game (a label on the second concept image) | Default in force: no; grapes are a fruit crop |
| Granada: whether the game may name the ruler of 1475 or any real person | Default in force: no real person is named, shown or given words |
| Granada: whether museum lanes should write the records the game needs (the Vega's crops and seasons, the canals, silk and ceramics near 1475, the ports' trade, the coinage) | `data/` and `content/` are lane content, not the gaming lane's. Until then all of it is labelled simulation |
| Granada: the word shown for the currency, and whether banners or emblems may be drawn | The package lists currency terms as unverified and forbids invented heraldry shown as authentic. Defaults: nothing shown yet; plain cloth |
| Granada: defects seen in museum records while searching (machine-translation errors in the Turkish and Indonesian summaries of `place/granada`; broken citation markers in the Urdu summaries of `place/malaga` and `place/almeria`; `place/loja` with a one-line summary; `person/boabdil-muhammad-xii` published with a label in one language) | Outside this lane; reported, not changed ([`granada/g0-discovery.md`](granada/g0-discovery.md), section 5) |
| Granada: registration of the eleventh game on the site in seven languages (gate GRA20) | `submission-impacting`; not started |
| Whether a museum lane should add photographs of buildings and places as media records | `data/` is lane content, not the gaming lane's. It is what Atlas's image rounds wait for, and it serves the museum's own pages too: 1 of 1,908 scoreable places and 7 of 5,794 buildings have a picture |

## Play it

```bash
npm --prefix gaming ci
npm --prefix gaming run music:import -- ~/Downloads     # once per checkout, for the music
npm --prefix gaming run dev
```

Then `http://127.0.0.1:4330/games/granada/index.html?lang=ar`, `http://127.0.0.1:4330/games/golden-age/index.html?lang=ar` and `http://127.0.0.1:4330/games/atlas/index.html?lang=ar`. What a first player notices in the first minute, where they stop, and what they try that the game refuses is the evidence the next round of work most needs.

## Next executable tasks

**Since the corrective mandate (25 November 2026) the order is that of [`traceability.md`](traceability.md): pieces 1, 2, 5, 7 and 12 first.** The list below is the order from before it, kept for what each item says; where the two differ, the page wins.

In order. Each is a pull request of its own.

1. **A person plays both games**, and what they do is written down (gate R10; `spec-v2/16`). Nothing below should be tuned before this.
2. **The Golden Age, next.** Done since the last entry: trouble marked on the plot it belongs to, silt and drought seen in the water, links to museum records, the season stall removed. Still to do: show hunger, idleness, a fever and a building at work in the district itself; merge static geometry by material to cut draw calls, and measure on a weaker machine; settle the balance finding with what a player does; **repair the core economy so that a large district is not rich whatever it does** (the cause of chapter 3's dominant strategy and of chapter 2's idle wealth), then re-run all three chapters in the lab; carry the player's city from one chapter to the next; the sandbox and the daily scenario. Done since: the second and third chapters, endowments, and briefs in the museum's own words. Read `spec-v2/games/golden-age.md` again first.
3. **Atlas, next steps.** An archive of past days; regional and era practice filters; the museum's web fonts. Image rounds are designed and wait for pictures: run `npm --prefix gaming run atlas:images` after media records are added, and build to G-0008 rules 4 to 6 when it reports `enoughForAWeeklyImageRound: true`.
4. **M1 remainder.** Cascaded shadows; a water surface with reflection and edge depth; a sky with clouds; a first authored character; a soak and leak test; fix or explain the Edge failure.
5. **UAT carries everything on `main`** since the fourth release (`20261125-484ead40122`, 26 November 2026 UTC): Granada's 3D valley with its village, mosque, mill and bridge, and Atlas's lit sphere, are there. The agent asks before each UAT release, because a deploy is the founder's to start; he answered "Release to UAT" for the third and again for the fourth. A rollback on UAT is still unproved. An outside review is being asked for ([`external-review.md`](external-review.md)). **The founder looks at UAT** (`https://uat-games.islam.museum/granada/?lang=ar`) and, when he chooses, deploys the games to production. The next games release to UAT is also the first chance to prove a rollback there.
6. **Granada's valley in 3D is built** (25 November 2026). Next for it: nearer the concept (richer buildings, trees and people, generated or authored as the founder decides; people who walk, carts, boats), water that reflects, cascaded shadows, recovery from a lost device, a measurement on a weaker machine, an interface in the concept's manner. Then **the Play page and menu entry on the site** (the founder's instruction; `submission-impacting` and `rewrites-all-pages`), which leads to Granada first and needs the games deployed to have somewhere to lead. After that, Act II: prices that respond to stock, a mill, and goods that travel to Málaga.
7. **M3.** The portal pages in seven languages on a branch, the gaming workflow, the release build (including where the music is served from) and its dry run, ready for the founder's sign-off.

Resume with:

```bash
git fetch origin && git log --oneline -3 && git status --short
npm --prefix gaming ci && npm --prefix gaming test && npm --prefix gaming run strings
```
