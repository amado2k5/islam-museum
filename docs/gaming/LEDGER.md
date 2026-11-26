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
| Pull requests | [amado2k5/islam-museum#8247](https://github.com/amado2k5/islam-museum/pull/8247) (M0 and M1, merged 25 Nov 2026 as `9854b2d2c1a`); [amado2k5/islam-museum#8248](https://github.com/amado2k5/islam-museum/pull/8248) (Atlas, Golden Age rules and lab, merged 25 Nov 2026 as `c45de1c952b`); [amado2k5/islam-museum#8250](https://github.com/amado2k5/islam-museum/pull/8250) (The Golden Age on screen, and the music; merged 25 Nov 2026 as `e60dab3fcbb`); [amado2k5/islam-museum#8251](https://github.com/amado2k5/islam-museum/pull/8251) (markers, museum links, the season stall; merged 25 Nov 2026 as `361a669c3a5`); [amado2k5/islam-museum#8252](https://github.com/amado2k5/islam-museum/pull/8252) (The Golden Age's second chapter; merged 25 Nov 2026 as `9a14d698bed`); [amado2k5/islam-museum#8253](https://github.com/amado2k5/islam-museum/pull/8253) (Atlas image rounds: the decision record and the survey; merged 25 Nov 2026 as `dfcfe026a2e`); [amado2k5/islam-museum#8254](https://github.com/amado2k5/islam-museum/pull/8254) (The Golden Age's third chapter and endowments; merged 25 Nov 2026 as `6f3df5dd203`); [amado2k5/islam-museum#8255](https://github.com/amado2k5/islam-museum/pull/8255) (Granada: the package, gate G0 and the economy kernel; merged 25 Nov 2026 as `a707db02d7f`); [amado2k5/islam-museum#8256](https://github.com/amado2k5/islam-museum/pull/8256) (the games' own release build, Worker and deployment workflows; labelled `submission-impacting`; merged 25 Nov 2026 as `174985af4df`, after its own workflow had passed on a hosted runner); [amado2k5/islam-museum#8257](https://github.com/amado2k5/islam-museum/pull/8257) (Granada's first scenario, "Water for the Valley", as rules; merged 25 Nov 2026 as `177e9fa0cf1`); [amado2k5/islam-museum#8258](https://github.com/amado2k5/islam-museum/pull/8258) (Granada's first scenario as a page a person can play; merged 25 Nov 2026 as `3599b8f514c`); [amado2k5/islam-museum#8260](https://github.com/amado2k5/islam-museum/pull/8260) (the record of the first UAT run, the development server on the network, and where to try each game; merged 25 Nov 2026 as `6bd4ffe09bb`); [amado2k5/islam-museum#8261](https://github.com/amado2k5/islam-museum/pull/8261) (the music on the games host; merged 25 Nov 2026 as `1057ab8a554`); [amado2k5/islam-museum#8262](https://github.com/amado2k5/islam-museum/pull/8262) (the record of the music on UAT, and the eleven games one by one); [amado2k5/islam-museum#8263](https://github.com/amado2k5/islam-museum/pull/8263) (Granada's valley in 3D; the fifteenth; merged 25 Nov 2026 as `638dce41dd2`); [amado2k5/islam-museum#8264](https://github.com/amado2k5/islam-museum/pull/8264) (Atlas's globe as a lit sphere; the sixteenth; merged as `7c31b7631c6`); [amado2k5/islam-museum#8265](https://github.com/amado2k5/islam-museum/pull/8265) (the third UAT release recorded, and the page for an outside review; the seventeenth; merged as `c943a7bd35e`); [amado2k5/islam-museum#8266](https://github.com/amado2k5/islam-museum/pull/8266) (Granada's village, mosque, mill and bridge; the eighteenth; merged as `3733031ddae`); [amado2k5/islam-museum#8267](https://github.com/amado2k5/islam-museum/pull/8267) (the corrective mandate taken as the plan, and its baseline; the nineteenth; merged as `eb951032473`); [amado2k5/islam-museum#8268](https://github.com/amado2k5/islam-museum/pull/8268) (the art pipeline in Blender and the watermill; the twentieth; merged as `484ead40122`); [amado2k5/islam-museum#8269](https://github.com/amado2k5/islam-museum/pull/8269) (the fourth UAT release recorded; the twenty-first; merged as `58efb0cb9dc`); [amado2k5/islam-museum#8270](https://github.com/amado2k5/islam-museum/pull/8270) (the valley loads the mill made in Blender; the twenty-second; merged as `b53c65944ea`); [amado2k5/islam-museum#8271](https://github.com/amado2k5/islam-museum/pull/8271) (Atlas asks no round named for one place and scored at another; the twenty-third; merged as `75ea7be4b1c`); [amado2k5/islam-museum#8272](https://github.com/amado2k5/islam-museum/pull/8272) (the models can be carried to the games host; the twenty-fourth; merged as `e2930d63426`); [amado2k5/islam-museum#8273](https://github.com/amado2k5/islam-museum/pull/8273) (the record of the models on UAT; the twenty-fifth; merged as `1bd5f51e223`); [amado2k5/islam-museum#8274](https://github.com/amado2k5/islam-museum/pull/8274) (the fifth UAT release recorded; the twenty-sixth; merged as `0207c137737`); [amado2k5/islam-museum#8275](https://github.com/amado2k5/islam-museum/pull/8275) (an offline package of a release for a reviewer with no internet; the twenty-seventh; merged as `ee96e715994`); [amado2k5/islam-museum#8276](https://github.com/amado2k5/islam-museum/pull/8276) (Atlas's globe no longer seems to vanish between rounds; the twenty-eighth; merged as `50be54cfbdd`); [amado2k5/islam-museum#8277](https://github.com/amado2k5/islam-museum/pull/8277) (the production handoff kept as received and mapped to the plan; the twenty-ninth; merged as `3eabcd38488`); [amado2k5/islam-museum#8278](https://github.com/amado2k5/islam-museum/pull/8278) (the reviewer's regression scenarios on every release, and the sixth UAT release recorded; the thirtieth; merged as `d61ec534bd0`); [amado2k5/islam-museum#8279](https://github.com/amado2k5/islam-museum/pull/8279) (the founder's decisions on the handoff, the inventory of the target images, the production plan and the historical-review ledger; the thirty-first; merged as `8a5632b191b`); [amado2k5/islam-museum#8280](https://github.com/amado2k5/islam-museum/pull/8280) (his second set of decisions, the rollback drill on UAT, and the briefs and tables he asked for; the thirty-second; merged as `cb9b37a8881`); [amado2k5/islam-museum#8281](https://github.com/amado2k5/islam-museum/pull/8281) (the mark of historical review on the games' own pages; the thirty-third; merged as `0e0c347b878`); [amado2k5/islam-museum#8282](https://github.com/amado2k5/islam-museum/pull/8282) (the dataset table corrected after NASA's guidelines were read; the thirty-fourth; merged as `d27e46fea49`); [amado2k5/islam-museum#8283](https://github.com/amado2k5/islam-museum/pull/8283) (the seventh UAT release recorded; the thirty-fifth; merged as `4c25e087547`); [amado2k5/islam-museum#8284](https://github.com/amado2k5/islam-museum/pull/8284) (the shared counters and Granada's first reading; the thirty-sixth; merged as `be346df135a`); [amado2k5/islam-museum#8285](https://github.com/amado2k5/islam-museum/pull/8285) (photographed surfaces and the authored town kit; the thirty-seventh; merged as `f2b04cf67b2`); [amado2k5/islam-museum#8286](https://github.com/amado2k5/islam-museum/pull/8286) (the hill's wall, towers, gate and palace, and the estate; the thirty-eighth; merged as `fae4481d01b`); [amado2k5/islam-museum#8287](https://github.com/amado2k5/islam-museum/pull/8287) (the lower town in streets; the thirty-ninth; merged as `c3d3a9785ba`); [amado2k5/islam-museum#8288](https://github.com/amado2k5/islam-museum/pull/8288) (Granada's page arranged round the valley; the fortieth; merged as `159967baab2`); [amado2k5/islam-museum#8289](https://github.com/amado2k5/islam-museum/pull/8289) (people at the harvest; the forty-first; merged as `b3ac4ac191a`); [amado2k5/islam-museum#8290](https://github.com/amado2k5/islam-museum/pull/8290) (fuller trees; the forty-second; merged as `9484b8315ef`); the forty-third, [amado2k5/islam-museum#8291](https://github.com/amado2k5/islam-museum/pull/8291) (`6a6b2541a84`), added three presets and Granada's proof frame; the forty-fourth, [amado2k5/islam-museum#8292](https://github.com/amado2k5/islam-museum/pull/8292) (`af4c275ba25`), added Granada's port, press and contract; the forty-fifth, [amado2k5/islam-museum#8293](https://github.com/amado2k5/islam-museum/pull/8293) (`590c8ea67f2`), added building on the land; the forty-sixth, [amado2k5/islam-museum#8294](https://github.com/amado2k5/islam-museum/pull/8294) (`7136073762c`), added the estate's figures and a field put first; the forty-seventh, [amado2k5/islam-museum#8295](https://github.com/amado2k5/islam-museum/pull/8295) (`32b7f7183c6`), added a decision and a journal; the forty-eighth, [amado2k5/islam-museum#8296](https://github.com/amado2k5/islam-museum/pull/8296) (`a6fa521703f`), added Photo Mode to Granada; the forty-ninth, [amado2k5/islam-museum#8297](https://github.com/amado2k5/islam-museum/pull/8297) (`1d7c3d8d194`), added the region and its layers; the fiftieth, [amado2k5/islam-museum#8298](https://github.com/amado2k5/islam-museum/pull/8298) (`008ef0a0c27`), added prices that move; the fifty-first, [amado2k5/islam-museum#8299](https://github.com/amado2k5/islam-museum/pull/8299) (`0fa66176a9f`), added warnings from the forecast and the season in figures; the fifty-second adds buildings that can be chosen and the oil's road |
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

## The production handoff (25 November 2026)

After the corrective mandate, the founder had the reviewer drive Chrome on his own Mac, and it **played** all three games on UAT release `20261125-e2930d63426`: the first play of them by anyone but their author. He gave its report, its evidence log, twelve prompts, a set of production standards and two more target images as one archive, kept as received in [`spec-production/`](spec-production/).

- Of the changes it was asked to look for, it confirmed seven of Granada's by sight (the houses, the mosque, the mill and that it loads, the wheel turning with water, the bridge, the teal interface) and both of Atlas's (the lit sphere, with the defect below; fair rounds, on the one round that could show it). It could not make out the ox-carts or the walkers' lean, could not check where the mill was made or that the wheel stands still without water, and found one major defect, Atlas's globe seeming to vanish between rounds, which was reproduced and fixed the same day ([amado2k5/islam-museum#8276](https://github.com/amado2k5/islam-museum/pull/8276)).
- On the third chapter of The Golden Age it won one game by trading and building, and lost one by trading and taxing and nothing else (2,248 coins, every other goal missed). The scripted merchant, who also builds and endows, still wins 1,000 games in 1,000; "a trading city cannot lose" was true of that script and is not true of trade alone.
- It is an AI's review and passes no gate that asks for a person ([`playtest-protocol.md`](playtest-protocol.md)).
- Its twelve prompts are mapped to the corrective work on [`traceability.md`](traceability.md). They describe months of work: an authored kingdom and a campaign of hours for Granada, a city for The Golden Age, a terrain globe and modes for Atlas, a living world, access, performance, a permanent regression suite. **No game is near a production release, and none is to be called one.**
- Its questions for the founder, and three places where his target images run against rules the games keep, are listed in [`spec-production/README.md`](spec-production/README.md).

## The sixth UAT release, and the reviewer's scenarios on every release (26 November 2026)

Asked "Release the Atlas fix to the games' UAT copy now?", the founder answered "Release to UAT". Build [45745645233](https://github.com/amado2k5/islam-museum/actions/runs/45745645233) of `main` at `3eabcd38488` was checked ([45745817466](https://github.com/amado2k5/islam-museum/actions/runs/45745817466)) and released ([45745958686](https://github.com/amado2k5/islam-museum/actions/runs/45745958686)): **UAT serves `20261125-3eabcd38488`**, with `20261125-e2930d63426` before it. Production is not deployed and no rollback was made.

- **What it changes for a player:** Atlas only. A round after a close answer opens on the whole globe; the grid of latitude and longitude is drawn over the land as well as the sea; Home or 0 returns to the whole globe.
- **Checked on UAT, in Chrome 158, muted, reading only** ([`evidence/release/20261125-3eabcd38488/`](evidence/release/20261125-3eabcd38488/)): the reviewer's own daily game of 26 November played to its end with no reload across the rounds where it had failed. The close reveal of round 2 came in 9 times and round 3 opened at 1.25, on the whole globe, with the lit sphere there at every round. The five addresses start, draw in 3D, and draw without it when asked. The total shown (2,612) is the sum of the five rounds. A reload in the middle and at the end keeps the game. No console error and no failed request. In Arabic the standing check passes too, with music and Granada's mill loaded.
- **The reviewer's 43 regression scenarios are now a record** ([`regression/matrix.json`](regression/matrix.json), shown on [`traceability.md`](traceability.md)): 16 covered, 17 partly, 10 not at all; 11 are played on the deployed host itself after every release, by a new tool, `gaming/tools/release-regression.ts`, and by the standing UAT check. The ten not covered are the soaks, the 1280 by 800 window, a full keyboard traversal, practice rounds, the look of things, and the side-by-side with the target images.
- **The reviewer's two games of the third chapter of The Golden Age are held in the rules** (`gaming/games/golden-age/test/handoff.gtest.ts`): one workshop, one market and the heavy tax alone ends with between 2,081 and 2,384 coins on 200 seeds (the reviewer's game: 2,248), 204 households of 380, no endowment, every other goal unmet, and never a win; the trading city that also builds wins. That a trading city which builds wins every time is still the open finding.
- **Not done:** the scenarios of Granada and The Golden Age are played on the build of the same commit by their play scripts and in the rules, not on the host; nothing here is a person's play.

## The founder's decisions on the handoff, and the plan made from them (26 November 2026)

The founder answered the reviewer's questions and the three points raised about the images in one text, kept as it arrived in [`spec-production/owner-decisions-2026-11-26.md`](spec-production/owner-decisions-2026-11-26.md) and summarized, decision by decision, on [`traceability.md`](traceability.md).

- **The three target images are binding** for composition, density, menus and panels, visible systems, scope, activity and quality, with adaptations only for small windows, the keyboard and access, right-to-left languages, performance, historical accuracy and written product decisions. [`spec-production/target-inventory.md`](spec-production/target-inventory.md) lists the 58 systems the images show: **3 exist today, 29 partly, 26 not at all.** Four are replaced by equivalents he approved (in Atlas: a local profile for the account icon, Challenge for "Compete", the borders rule for "Political Borders"; in The Golden Age: Civic Resilience for "Military").
- **Lengths of play are set**: three hours or more for the main campaign of each of the two simulation games, with a prologue of 15 to 30 minutes and scenarios of 30 to 60; Atlas 5 to 15 minutes a day, with longer play by choice. Today Granada is about ten minutes and a chapter of The Golden Age five or six.
- **History is reviewed by people.** [`historical-review/`](historical-review/README.md) holds the ledger he asked for: 18 statements the games make today, all pending, because no reviewer is named. Two of them are looks that no source stands behind (the valley's buildings and dress; the district's buildings).
- **The machines and browsers are named**: an M1 MacBook Air with 8 GB and a Windows 11 laptop with a Core i5-1135G7; Chrome, Edge, Safari and Firefox. **Nothing has been measured on either machine or in Safari or Firefox**; every figure so far is from an Apple M4 Max in Chrome, with one run in Edge.
- **Photo Mode is required for Granada's first production release, and first-person before it is called complete.**
- **The plan** ([`spec-production/production-plan.md`](spec-production/production-plan.md)): 44 packages in six streams (foundational engineering, production art, gameplay systems, historical content, accessibility and localization, quality assurance) and six phases, Granada first. The author's estimate is 185 to 313 working sessions, uncertain by a factor of two or more, and not counting what waits on people. Whether art made by script can reach the targets' finish is unproven; the plan's first art package is a proof frame for him to judge.
- **The labels stay.** A test (`gaming/games/prototype-labels.gtest.ts`) fails if a game's prototype label is removed while [`spec-production/release-status.json`](spec-production/release-status.json) says prototype.
- **Eleven decisions still need him** (traceability, "Decisions that still need the founder"): the reviewers and editor, the two machines, how the art is made, the testers, Atlas's pictures and globe data, the order after Granada, what Granada's defence may show, The Golden Age as Baghdad, a UAT rollback, production.

Nothing a player sees changed with this.

## The founder's second set of decisions, and the rollback drill (26 November 2026)

He answered the eleven open points the same day ([`spec-production/owner-decisions-2026-11-26-b.md`](spec-production/owner-decisions-2026-11-26-b.md)) and asked for ten things back. They are in [`spec-production/owner-register.md`](spec-production/owner-register.md) and the pages it names.

- **The register** now holds 22 decisions, six lines of people still to be named, and 18 kinds of action that need his own approval. **O1, O2 and O4 are not closed**: no reviewer, no operator and no tester is named, and writing the documents does not change that.
- **The rollback drill, approved once for UAT, was run** ([`release-and-deploy.md`](release-and-deploy.md), "The drill of 26 November 2026"). The target and the way back were both verified in the bucket first. UAT went from `20261125-3eabcd38488` to `20261125-e2930d63426` and back by two rollbacks; the older release was live for 3 minutes 24 seconds. On it, everything passed but the one scenario that tests the fix it lacks; on the restored release everything passed. A game in progress in each of the three games resumed on both. Nothing was deleted and there was no error. Not tested: a page already open in a tab while the pointer moves.
- **History:** a published museum record is now treated as source material needing review, not as approved. All 18 ledger entries read "historical review pending", sorted into his four kinds (9 sourced, 2 uncertain, 2 reconstructions, 4 fiction, with 1 convention). Six briefs for reviewers are written. Those words on the games' own pages, and his sentence for The Golden Age, followed in the next change (below).
- **Proof frames:** three briefs and a checklist of 14 lines ([`spec-production/proof-frames.md`](spec-production/proof-frames.md)). None is started. For Atlas, whose image shows no people, the reveal is proposed in place of a group at an activity, for him to accept or refuse.
- **The hardware-test package is an outline** ([`qa/hardware-test-package.md`](qa/hardware-test-package.md)) with a results template. It is not built, and nothing has run on either minimum machine.
- **The study plan for people who play** is written ([`playtests/study-plan.md`](playtests/study-plan.md)): who, the screener, the consent words, the tasks, the questionnaire, the evidence template. Nobody is recruited.
- **Atlas** ([`games/atlas-pictures-and-datasets.md`](games/atlas-pictures-and-datasets.md)): 4 candidate pictures, none complete against his ten requirements, 48 to find. Of the globe's data, Natural Earth and ETOPO 2022 were verified at their sources as public domain and CC0 and are proposed for his approval; NASA's three sets are not proposed: its media guidelines, read afterwards in the founder's own Chrome, appear to allow such use with credit, but cloud is better drawn by the game and modern city lights can give an answer away, so the night side is proposed dark. **Nothing was imported.**
- **The order of work** is his: Granada, then The Golden Age, then Atlas, with only preparation beside Granada. The plan now has 48 packages and 196 to 334 sessions by the author's estimate. On the critical path to Granada's first production release, 41 to 76 sessions are engineering and art, and five steps are people with no estimate at all.

A new tool, `gaming/tools/save-carry.ts`, carries a saved game across a change of release; it was used in the drill.

## The mark of historical review on the games' own pages (26 November 2026)

The founder's decision O1 asks that affected content be marked "historical review pending", and O9 that The Golden Age call itself a fictional city inspired by records. Both are now in the games, in seven languages, and a test (`gaming/games/review-mark.gtest.ts`) keeps them there while any entry of a game is pending in the ledger.

- **Granada:** the note on the opening brief and in the help, beside the links to the museum's records.
- **The Golden Age:** under the history on each chapter's brief, in the help, and on every museum link. Its help now says, in his words, "A fictional city simulation inspired by records of Abbasid Baghdad and other historical institutions of the Islamic world." The brief's heading no longer calls the museum's summaries "the real history": it reads "The history behind this chapter, as the museum's records give it".
- **Atlas:** at every reveal, under the links to the record, and beside its note on sources.
- Seen on the page in English and Arabic in Chrome ([`evidence/review-mark/`](evidence/review-mark/)). The six languages other than English were written by an AI agent and read by no native speaker, like every other string.
- **Not on UAT yet**: it goes there with the next release, which needs the founder's word.

## The seventh UAT release (26 November 2026)

Asked "Release the 'historical review pending' wording to the games' UAT copy?", the founder answered "Release to UAT". Build [45752247546](https://github.com/amado2k5/islam-museum/actions/runs/45752247546) of `main` at `0e0c347b878` was checked ([45753109596](https://github.com/amado2k5/islam-museum/actions/runs/45753109596)) and released ([45753255270](https://github.com/amado2k5/islam-museum/actions/runs/45753255270)): **UAT serves `20261125-0e0c347b878`**, with `20261125-3eabcd38488` before it. Production is not deployed.

- **What it changes for a player:** each game says "historical review pending" beside its history, in seven languages; The Golden Age describes itself as a fictional city inspired by records of Abbasid Baghdad; its briefs no longer call the museum's summaries "the real history".
- **Checked on UAT in Chrome 158, reading only** ([`evidence/release/20261125-0e0c347b878/`](evidence/release/20261125-0e0c347b878/)): the mark stands on Granada's brief, The Golden Age's brief and Atlas's reveal; every scripted scenario of the regression passes; the five addresses start in 3D and without it; in Arabic the standing check passes with the music and Granada's mill. The mark was read on the host in English; the other six languages are held by the test of the strings.
- The regression now reads that mark on every release (`HR-MARK`, the museum's own scenario beside the reviewer's 43).
- **Asked the same hour how many hours remain to finish the three games**, the answer recorded in [`spec-production/production-plan.md`](spec-production/production-plan.md) is that no single figure can honestly be given: 196 to 334 sessions by estimate, which is 85 to 145 hours at the average pace measured so far (33 pull requests in 14 hours, most of them small) and 720 to 1,230 hours at the slowest change measured; what remains is the heavier kind; and the steps that are people are not counted at all.

## Eight hours on Granada, unattended (26 November 2026, from 04:16 UTC)

The founder: "work non stop on everything remaining for granada first for the next 8 hours unattended without stopping and without asking me questions or waiting for any answers from me. if you have any questions please ask them all now". Four were asked, and answered:

1. **UAT:** each checked Granada change may be released to UAT, with its models, without asking, for these eight hours. Production is not touched.
2. **After Granada's proof frame is ready:** it is left for him to judge, and work moves to the gameplay systems. No art is made in number before he accepts.
3. **Textures:** public-domain (CC0) material textures and skies may be downloaded from Poly Haven only, through his own Chrome; images only; each licence checked on its page; kept out of git; each source recorded.
4. **Alone, in sequence:** no helper agents in parallel.

Decisions taken alone in these hours are written below as they are made, for him to read afterwards.

### Counters (plan package F3, the part Granada needs)

`gaming/packages/kernel/src/counters.ts` counts what a running game costs: every frame's time, the longest stretch under 30 frames a second, the heap where the browser reports it, drawing contexts, live intervals and workers, listeners, audio contexts and nodes, and whatever the game's renderer says of itself. It is installed only when a page is opened with `?counters=1`, so an ordinary game is not instrumented. `gaming/tools/measure.ts` opens a game in Chrome and prints the counts with the machine, browser and size.

- **First reading of Granada**, as it stands on UAT, on the Apple M4 Max in Chrome 158 at 1920 by 1080, pixel ratio 1, 15 seconds with the days running ([`evidence/granada/counters/`](evidence/granada/counters/)): median frame 8.3 ms, 95th centile 9.0, 99th 9.3, none over 33 ms; heap 189 MB; 286 draw calls, 3.0 million triangles, 115 geometries, 56 textures; one WebGPU context; two intervals; no worker; no audio (music off).
- **It is this machine only.** Nothing has been measured on either minimum machine, and this passes no gate.
- **A reading to understand before it is trusted:** two frame callbacks a frame. One is the game's loop and the other is three.js's own, so two is the resting figure and a rise is the signal. Listeners stood at 293 and are only meaningful as a change over time.
- Not done of F3: the 60-minute and four-hour runners, and the counters' reading of the renderer in The Golden Age and Atlas (the page counts are installed in The Golden Age; Atlas has none yet).

### Photographed surfaces, and a town of authored houses (first step of Granada's proof frame)

- **Five surfaces from Poly Haven**, public domain (CC0), downloaded through the founder's Chrome with his approval: White Stucco 02, Clay Roof Tiles 02, Rustic Stone Wall 02, Weathered Brown Planks, Cobblestone Floor 04, each as colour, normal and roughness at 2K (37 MB of archives in all). Poly Haven's licence page was read first: any use, no credit required, redistribution allowed. [`gaming/art/sources.json`](../../gaming/art/sources.json) records each with its authors, page and checksums. The files are not in git. Its "support us" prompt after a download was left alone, and its cookie notice was not accepted.
- **The kit's surfaces are now these photographs**, cut to 1,024 pixels and tinted into three washes, where a machine has them; the painted ones remain as the fallback. The watermill was rebuilt with them.
- **A town kit authored in Blender** (`gaming/art/blender/granada_town.py`): four houses of 1,356 to 2,016 triangles, a wall, a tower, a gate, scaffolding and a stall, 10,728 triangles in one file of 6.4 MB with its textures.
- **The game stands the houses** wherever it used to make one: the building lots, the old village and the 150 houses of the hill town, about 200 in all, each with its own wash. Without the models it makes its houses itself as before. With them, on the M4 Max in Chrome: 247 draw calls, 3.3 million triangles, median frame 8.3 ms.
- **Decisions taken alone:** (1) a set of models that changes goes to a new folder on the host, `granada/2/`, because a file there is never replaced, and so that a release rolled back to still finds the mill it was made with; (2) one material per surface is shared across model files, so a surface is on the graphics card once; (3) the hill town's lowest houses used to stand in the river: no house is placed on the river or its bank now, in either way of building.
- **How far this is from the image:** the houses are now of the right kind, and that is all. The town is still thin and scattered where the image has streets; the wall, tower and gate of the kit are not placed yet; the land is flat colour; the trees are rounded shapes; there is no palace, no estate, no crowd. This is one step of the proof frame, not the proof frame.

### The eighth UAT release; then the hill's wall and palace, and the estate (second step of the proof frame)

- **Eighth UAT release, `20261125-f2b04cf67b2`** (build [45756346708](https://github.com/amado2k5/islam-museum/actions/runs/45756346708), check [45756805383](https://github.com/amado2k5/islam-museum/actions/runs/45756805383), release [45756941357](https://github.com/amado2k5/islam-museum/actions/runs/45756941357)), released without asking under the founder's answer for these eight hours. The 22 model files of `granada/2/` were carried to UAT first (check [45756396894](https://github.com/amado2k5/islam-museum/actions/runs/45756396894), upload [45756554519](https://github.com/amado2k5/islam-museum/actions/runs/45756554519)). On UAT in Chrome: Granada loads the town and the mill, every scripted scenario passes, no error ([`evidence/release/20261125-f2b04cf67b2/`](evidence/release/20261125-f2b04cf67b2/)).
- **Three larger pieces authored** (`gaming/art/blender/granada_landmarks.py`, in `landmarks.gltf`, 12,508 triangles): a walled palace with a great tower, two halls, an arcade and a pool (8,656 triangles); an olive estate of a farmhouse, a store and an open press-house round a yard (3,472); a builders' crane (380). The palace copies no building and the game does not call it the Alhambra.
- **On the hill** the valley now stands the kit's wall (a piece every 12.5 metres, fitted to each stretch), a tower at each of the fourteen corners, one gate, scaffolding and the crane beside it, and the palace on the top, in place of the wall and halls it used to make. The estate stands beside the olive terrace. Without the models the valley makes what it made before.
- **Decisions taken alone:** (1) the hill's top is level for fifty metres, so the palace stands on ground and not half in it; (2) the river's bed is no longer cut into the hill it runs under; (3) the camera may now travel east as far as the lower town (`BOUNDS` widened), and the land's shape no longer depends on how far the camera may go; (4) helper shapes for buildings are in `gaming/art/blender/kit.py`, shared by the scripts; (5) files already on the host were checked to be byte-identical after every rebuild before new ones were added beside them.
- **A view for the proof frame is found** ([`evidence/granada/town-kit/game-proof-view-first.webp`](evidence/granada/town-kit/game-proof-view-first.webp)): the estate and olives in front, the lower town on the slope, the wall climbing to the palace, the snow range behind. **It is a composition, not yet a picture near the target:** the slope is bare ground with houses scattered on it, the trees are rounded shapes, there are no people in it, and the panels are still the old ones at the side.

### The lower town in streets (third step of the proof frame)

- **The lower town was 150 houses scattered where random numbers fell; it is now about 300 in eight streets that follow the hill round below its wall**, each house facing down the slope, with a gap here and there and a lane climbing the hill at every seventh plot (`lowerTownLots` in `valley.ts`). The layout is fixed by the seed alone, so it is the same town whether its houses are models or made by the valley.
- Between the streets: cypresses and fruit trees; the ground is trodden earth along each street and garden green between.
- **A fault found by an existing test and fixed for every kind of plant:** trees, poplars and scrub had been growing through houses, because they were planted before the houses' ground was known. Whatever falls inside a building's ground is now taken up at the end.
- The picture ([`evidence/granada/town-kit/game-proof-view-lower-town-autumn.webp`](evidence/granada/town-kit/game-proof-view-lower-town-autumn.webp)), 44 days into the game, in autumn: the estate in front, a dense town of tiled houses in streets under the wall, the palace on the hill, the range behind. On the M4 Max in Chrome: 306 draw calls, 3.3 million triangles, median frame 8.3 ms.
- **Against the target image:** the structure is now there (estate, town, palace hill, mountains). The finish is not: the fields are flat bands of colour, the trees are rounded shapes, nobody is in the picture, the estate's yard is empty, and the interface is still the old side panel.

### Two more UAT releases; then the page arranged round the valley (fourth step of the proof frame)

- **Ninth UAT release, `20261125-fae4481d01b`** (build 45758327324, check 45758733345, release 45758914027), after its eight new model files were carried to UAT (check 45758338123, upload 45758488613): the wall, the palace and the estate. **Tenth, `20261126-c3d3a9785ba`** (build 45759203511, check 45759367817, release 45759509472): the lower town in streets. Each passed every scripted scenario on UAT in Chrome with the three model files loaded and no error (`evidence/release/`).
- **The page is arranged as the target picture arranges it**, when the valley is drawn in 3D and the window is at least 1,180 by 640: the valley fills the page; a rail down the left names the game's parts (Overview, Agriculture, Construction, Economy, Ledger), each with a small drawing; what is asked of the steward stands beside it; the part in hand stands on the right; the season, the weather to come and the river's year stand in the corner. On the plan, or in a smaller window, the same four stand in one column beside the land, as before.
- **A field chosen in the valley has a card beside it** that follows it as the view moves: what stands there, how its water is, and, when it is ripe, the two ways of bringing it in. It acts on the game; it is not a picture of a card.
- **Every panel is a working one.** Nothing was drawn that does not act: the rail has no Diplomacy, Defense, First-Person or Photo Mode, because none of those exists yet, and the target's marketplace of five goods is the game's real market of three.
- **A fault met and fixed on the way:** in the side column the parts were squeezed under one another, so that a button could be seen and not pressed. The play script, which clicks as a person does, found it.
- The rail's names were changed to the target's in all seven languages; three strings were added. The six languages other than English are by an AI agent, unread by a native speaker.
- Captures in [`evidence/granada/hud/`](evidence/granada/hud/), in English and Arabic.

### The eleventh UAT release; then people at the harvest (fifth step of the proof frame)

- **Eleventh UAT release, `20261126-159967baab2`** (build 45760198696, check 45760396523, release 45760540440): the page arranged round the valley. Every scripted scenario passed on UAT in Chrome, with the three model files loaded and no error.
- **A harvest now has its people.** From the moment a field's harvest is ordered until the day after the last of it is in, people are at work in that field: in the wheat, sixteen reapers shoulder to shoulder who stoop and rise, with what they have cut standing in stooks behind them and carriers going to the store; in the olives, a ladder against each of the dozen trees nearest the estate, two pickers at each, baskets under them, and carriers going to the estate's press. They are there because the game's state says a harvest is on, and are gone when it is done.
- **Held by the play script**, which orders the wheat harvest in a fresh game and counts: 0 people at work before, 20 while it goes on, 0 three days after.
- **Decision taken alone:** with hands enough the rules bring a small field in within one day, which would leave nothing to see. The day's work is therefore shown for the day it happened. The rules were not changed to make a picture.
- Captures in [`evidence/granada/harvest/`](evidence/granada/harvest/). The people are the game's existing simple figures; they are not yet modelled people, and they are small in so large a valley.

### Fuller trees (sixth step of the proof frame)

- **Crowns:** a broad tree was five rounded heads and is now sixteen of three sizes, and an orchard tree eight where it had three, so that a tree's outline is broken as a tree's is. The far shapes are unchanged.
- **Leaves:** every crown now carries a dapple of lit leaf and shadowed gap, a small picture made at load and laid on from three sides, multiplied into the crown's own light and shade and its season's colour.
- **Measured, and a false alarm recorded:** a first reading showed 32 frames a second. It was taken while a second browser was running the UAT checks on the same machine. Measured alone with `tools/measure.ts` (M4 Max, Chrome, 1920 by 975 of canvas, ten seconds from the first view with the days running): median 8.3 ms and 95th centile 9.1 with the new trees, 8.3 and 8.9 without; no frame over 33 ms either way. The new trees add 0.7 million triangles to a frame (5.4 million from the first view). **That is a great deal for the minimum machines, on which nothing has been measured**; the presets must bring it down there.

### The twelfth UAT release; three presets; wind; and Granada's proof frame, ready for the founder

- **Twelfth UAT release, `20261126-b3ac4ac191a`** (build 45761084716, check 45761245343, release 45761389394): people at the harvest. Every scripted scenario passed on UAT.
- **Three presets**, chosen from the top bar and kept on the device, or asked for in the address (`q=low`, `medium`, `high`): the same game, land, town and people at each; what changes is the pixel ratio, the sharpness of shadows, whether corners are shaded and lights glow, and how far a tree is drawn in full. Four strings in seven languages.
- **Wind:** everything that grows leans and comes back, each plant in its own time; still for a visitor who has asked for less motion.
- **The proof frame** ([`spec-production/proof-granada.md`](spec-production/proof-granada.md)), taken from the running game by `gaming/tools/granada-proof.ts` at the three presets, set beside the target with all fourteen lines of the checklist answered: seven met, five in part, one the founder's eye alone, and his acceptance awaited. **The developer's own reading is on the page: the structure of the target is there and its finish is not.**
- **Measured at the proof view** on the M4 Max in Chrome at 1920 by 1080: 1.90, 2.02 and 3.56 million triangles a frame at Low, Medium and High; heap 92, 166 and 187 MB; median frame 8.3 ms at each. One reading is reported and not explained: the Low run, the first of the three, had 34 frames over 33 ms, where a separate measurement of Low gave none. Two other slow readings this hour were traced to a second browser running the UAT checks at the same moment; a measurement is now taken twice, with nothing else running.
- **By the founder's answer of this morning, the work now moves to the gameplay systems** and no art is made in number until he has judged the frame.

### The thirteenth UAT release; and Granada's economy: a port, a press, a contract

- **Thirteenth UAT release, `20261126-6a6b2541a84`** (build 45762936059, check 45763088025, release 45763231487): the presets, the wind and the fuller trees. All twelve scripted scenarios passed on UAT; evidence in [`evidence/release/20261126-6a6b2541a84/`](evidence/release/20261126-6a6b2541a84/).
- **A port.** The valley can send wheat, olives and oil by cart to a port with its own prices and its own purse. Carriage is paid on every unit, and the carts take 60 units a day. A load the port, the store or the treasury cannot meet is refused before any carriage is spent.
- **A press.** Five measures of olives make one of oil, at 12 dinars a pressing, by an order in the Economy panel.
- **A contract.** Eight measures of oil at the port by the seventy-first day, for 1,680 dinars paid as the oil arrives; 52 dinars of carriage and fees set aside on taking it; 300 dinars if it is not kept, charged once. It is never forced, and it cannot be taken after its day.
- **No money machine, by test:** nothing bought in the village is worth carrying to the port, and oil pressed from bought olives costs more than the port or the contract pays.
- **How it was built:** the ledger kernel is untouched; it already had markets, recipes and contracts, and the village rules now use them. The rules' version went from 1 to 2. **A game saved under version 1 is carried forward, not set aside:** the port is opened in its books with a journal entry so that the audit still closes, and nothing the player had is changed (tested). A release rolled back to before this one would set a version-2 save aside, as an unknown game.
- **Decisions taken alone, for the founder to overrule:** the port is named Málaga, the target's own port, and everything about its trade is invented and says so on the panel (ledger entry HR-GR-08, review pending). Goods arrive the day they are sent: travel that takes days, prices that move with stock, and a trend shown to the player need changes to the ledger kernel and are **not done**; the plan's piece G1 stays in progress. The deadline is shown as days left, not as a date.
- **Checked:** 14 new tests of the rules and the panel (134 for Granada, 287 in all); a sixth scripted player who presses and delivers, in the lab over 1,000 years of weather with no rule broken (it keeps the contract every time, and ends about 330 dinars better off in grain and cash than the same steward selling olives in the village); and the play script takes the contract, presses and delivers by clicking the page, in English and Arabic. 25 new strings in seven languages (228), machine-translated by the agent and read by no person.
- **Not measured or judged:** whether the contract is interesting to a person. No person has played it.

### The fourteenth UAT release; and building on the land

- **Fourteenth UAT release, `20261126-af4c275ba25`** (build 45764447915, check 45764605339, release 45764769275): the port, the press and the contract. All twelve scripted scenarios passed on UAT; evidence in [`evidence/release/20261126-af4c275ba25/`](evidence/release/20261126-af4c275ba25/).
- **A catalogue of four things, each of which does one thing:** a house (ten households), a granary (500 more in the store), a cistern (the pool holds 60 more) and a garden (the households fare 2 better while it stands). Each costs dinars, timber and stone and takes worker-days, like the works before it.
- **Placed by the player, anywhere the ground allows.** The ground refuses, each by its own name and in words: the valley's edge, water and its banks, a field, a road, a slope of more than 1.4 m across the building, a building or a tree already there, and anything the player has placed. The check reads the same geometry the valley is drawn from, so what is refused is what can be seen. A refusal spends nothing and changes nothing (tested for each).
- **In the 3D valley:** a ring on the land under the pointer, green where the ground takes it and red where it does not, with the reason beside it; a click builds. By keyboard the ring is the middle of the view, the arrow keys move it, Enter builds and Escape stops. Scaffolding stands while it is built; the building stands when it is done.
- **On the plan:** the same, with the ring moved by the pointer or the arrow keys. The plan is 1,000 m wide, and the land east of it can be built on only in 3D.
- **Houses and granaries are now placed, not ordered from a list.** The old order on the prepared lots remains in the rules for the scripted players and for games already saved.
- **Rules version 3.** Games saved under versions 1 and 2 are carried forward (tested).
- **A defect found and fixed on the way:** in the 3D layout the season box lay over the foot of the panel beside it, so a button low in a long panel could not be clicked. The panel now ends where the season box begins, measured in whatever language is shown.
- **Decisions taken alone, for the founder to overrule:** castle pieces are left for the defence work, which needs historical review first; industry and culture have nothing in them yet and are not shown, because nothing is shown that does not work. Trees are not cleared: ground with a tree on it refuses. The preview is a ring, not the building's outline.
- **Known and not done:** the plan draws the village as a symbol, so a building placed near it is drawn among houses that are not where the plan shows them. Placed buildings are the game's own simple shapes, not authored models. Nothing here has been measured on the minimum machines, and no person has tried it.
- **Checked:** 9 new tests (143 for Granada, 296 in all); the random scripted player now places things anywhere, in the lab over 1,000 years with no rule broken; the play script chooses, is refused, stops, builds by keyboard and by mouse on the plan and by keyboard in 3D, in English and Arabic ([`evidence/granada/construction/`](evidence/granada/construction/)). 34 new strings in seven languages (262), machine-translated by the agent and read by no person. History ledger entry HR-GR-09, review pending.

### Estates: figures that are the rules' forecast, and a field put first

- **An estate's card now says** who tends it (hands of the hands it needs), what thirst has already cost, what it will give and in how many days if nothing more is ordered, whether the store has room for that today, and what it is worth in the village and, after carriage, at the port.
- **The forecast is the rules run forward on a copy, not an estimate.** Tested over four years of weather and three ways of starting: what the card expects is what comes, to the unit and the day. In the browser the card said 49 in 30 days, and 49 came in 30 days.
- **A real choice:** one field can be put first for water and hands. When either is short it is served before the others, and the others bear it (tested: the terrace put first thirsts less and the mill field more). With no field put first, nothing in the valley changes (tested).
- **Rules version 4**; saves of versions 1, 2 and 3 are carried forward (tested).
- **Decisions taken alone:** "water for three settlements" in the plan's piece G3 is not done; the valley has one settlement. Workers are not assigned by name or number: the hands follow the rules' order, and the one lever is which field comes first.
- **Checked:** 5 new tests (148 for Granada, 301 in all); the random scripted player now puts fields first at random, 1,000 years in the lab, no rule broken; the play script reads the card, puts the terrace first and back, and compares what the card said with what came, in English and Arabic. 10 new strings in seven languages (272), machine-translated and read by no person.

### The fifteenth and sixteenth UAT releases; a decision with a price on each side; a journal

- **Fifteenth UAT release, `20261126-590c8ea67f2`** (build 45766277130, check 45766456585, release 45766605134): building on the land. **Sixteenth, `20261126-7136073762c`** (build 45766988290, check 45767163368, release 45767312380): the estate's figures. All twelve scripted scenarios passed on UAT after each; evidence in [`evidence/release/`](evidence/release/).
- **A decision.** On the tenth day of summer the village downstream asks for water. To share: 220 dinars at once, and for 20 days the river gives the valley 8 less each day. To keep it: nothing is paid, and for 20 days the households fare 4 worse. Each answer's price and gain is shown in figures before it is chosen; the question stays open five mornings; unanswered, it becomes the answer it said it would.
- **Its consequences are real and are in the forecast.** The days ahead already count the answer that will be given if none is; the sky panel shows the river as it will run; what is in force, and for how many more days, is listed beside the tasks.
- **A journal** in the Ledger: tasks done, things built, households come and gone, questions and answers, a contract failed, each with its day. Sixty lines are kept.
- **Rules version 5**; saves of versions 1 to 4 are carried forward. A game saved after the question's day never has it put.
- **A finding from the lab, not tuned away:** over 1,000 years of weather, a steward who mends the branch and shares the water wins 59 years in 100, where the same steward won 99 before the question existed; one who presses oil and shares wins 94. Stewards who keep the water, or let the question lapse, win as often as before. **To share is a real risk and to refuse costs little by the year's end: the two sides are not yet even.** That is a matter of balance for the campaign work, with people playing, and is left as it is.
- **Decisions taken alone, for the founder to overrule:** the question is about water between two villages on one river, invented and labelled as invented, and makes no claim about how water was shared in history (ledger entry HR-GR-10, review pending). There is one question, not a series; nothing about borders, tribute or defence is touched.
- **Checked:** 7 new tests (155 for Granada, 308 in all); every scripted player answers or lets it lapse, the random one answers at random, 1,000 years in the lab with no rule broken; the play script waits for the question, reads its two answers, shares, sees the dinars, what is in force and the journal, and sees the effect end, in English and Arabic. 16 new strings in seven languages (288), machine-translated and read by no person.

### Photo Mode in Granada, against the founder's seven requirements

The founder required Photo Mode for the first production release and listed what it must do (decisions of 26 November 2026, item 5). Each line below is what a script did in real Chrome on one machine; evidence in [`evidence/granada/photo-mode/`](evidence/granada/photo-mode/).

| He asked for | What is there | Scripted |
|---|---|---|
| Hide and show the interface | Entering puts the whole page away and leaves the picture's own controls; H puts those away too, and H or Escape brings them back | Yes |
| Camera movement, rotation, zoom and focal controls | Drag, arrow keys, Q and E, R and F, the wheel, + and −; a lens from 16 to 70 degrees. **No focus distance and no depth of field: the picture is sharp throughout** | Movement and lens yes |
| Time of day and weather where the rules allow | The rules have seasons and rain and no hours. A season and rain can be previewed, and one of three lights (morning, midday, evening) which the panel says is for the picture only | Yes |
| Screenshot capture | The view is drawn once more and saved as a PNG by the browser's own download: 2.9 MB at 1440 by 900 | Yes: a real PNG, its header checked |
| No accidental changes to the simulation | The game is paused; an order and a day asked for through the game's own hook are both refused; the whole saved state is the same text before, during and after | Yes |
| Keyboard access and a visible way out | Opened with Enter on its button; the keyboard lands on the controls; a button to leave is among them; Escape leaves; the keyboard goes back to where it was; the speed comes back | Yes |
| Stable memory after repeated entry and exit | Fifty visits, a light chosen in each: 137 geometries and 66 textures before and after; heap 188 MB before and 189 after in English, 199 and 177 in Arabic | Yes, on this machine |

- **Not passed as a gate.** This is one fast machine (M4 Max) and no person. The plan's gate also asks for the minimum machines; those wait on named operators.
- **Decisions taken alone:** the pictures are named `granada-1.png`, `granada-2.png`; nothing leaves the device except by the visitor's own download. Photo Mode is offered only in the 3D valley, since the plan is a diagram. With the controls hidden nothing is on the page but the picture, at the visitor's own request, and a spoken line says how to bring them back.
- **Seventeenth UAT release** (the decision and the journal, `20261126-32b7f7183c6`) was running while this was written; its record is in the next entry.
- **Checked:** the play script's new part in English and Arabic; 308 tests still pass. 20 new strings in seven languages (308), machine-translated and read by no person.

### The seventeenth and eighteenth UAT releases; the region and its layers; and a fault in the museum's place names

- **Seventeenth UAT release, `20261126-32b7f7183c6`** (build 45767883963, check 45768089770, release 45768238383): the decision and the journal. **Eighteenth, `20261126-a6fa521703f`** (build 45768561424, check 45768779320, release 45768926951): Photo Mode. All twelve scripted scenarios passed on UAT after each; evidence in [`evidence/release/`](evidence/release/). Photo Mode itself has been scripted on the developer's machine, not on UAT.
- **The region**, on the Overview: Granada, Málaga, Almería and the Sierra Nevada at the museum's own coordinates, a kilometre to the unit, with a fifty-kilometre scale and north. Málaga is 89 km from Granada and Almería 109, as the museum's coordinates give them (tested against the same figures the geography tests hold). East is on the right in every language.
- **What it is not:** a drawn map. No outline of any country is drawn, since no map data has been approved for the games. The coast is three coastal places joined by straight lines, and the map says so. The game's valley is marked west of the city and labelled as invented. The route to Málaga is a straight line, not a road.
- **Three layers, each of the game's own figures** (tested against the state): trade (carts sent today, what the port can still pay, the contract), fields (what is sown and how far grown), works (pool, branches, store, buildings finished). No diplomacy or defence layer is shown, because neither exists.
- **Defence was not built, and that is a decision.** The founder's words are that conflict in Granada "must remain historically reviewed, strategic and respectful". No reviewer is named, so nothing about walls, readiness, tribute or the border was written into the game tonight. It waits for a reviewer, not for code.
- **A fault found in the museum's own records, reported and not fixed here.** The game's pack of museum records carries place names in seven languages. Several Turkish, Indonesian and Spanish names are a common noun in place of the name: al-Munkab as "Omuz" and "Bahu" (shoulder); Alhama as "ateş" and "demam" (fever); Loja as "Tienda", "Kumaş" and "Kain" (shop, cloth); Baza as "Tezgah" and "Stall"; Guadix as "Ash Valley" and "Lembah Ash"; Vélez-Málaga as "Malaga'nın başlaması" and "Malaga dimulai"; the Generalife as "Onbaşının Cenneti" and "Surga Kopral"; and Málaga in Spanish without its capital. **These come from the museum's data, which the games only read.** The game shows none of the wrong ones: the map names only Granada, Málaga, Almería and the mountain, and begins each name with a capital. Mending the records is the museum's work, by its own rules for changes, and is for the founder to direct.
- **Checked:** 2 new tests (157 for Granada, 310 in all); the play script counts the five marks, reads the distance, opens each layer by keyboard and sees the carts move, in English and Arabic ([`evidence/granada/region/`](evidence/granada/region/)). 22 new strings in seven languages (330), machine-translated and read by no person. History ledger entry HR-GR-11, sourced from the museum's coordinates, review pending.

### The nineteenth UAT release; and prices that move

- **Nineteenth UAT release, `20261126-1d7c3d8d194`** (build 45769476046, check 45769677813, release 45769830939): the region. All twelve scripted scenarios passed on UAT.
- **Prices move.** Each market has a usual stock of each good: what it opens with. Each night it goes an eighth of the way back to that, its suppliers bringing or its other buyers taking and paying, and sets its two prices for the next day: lower by up to fifteen parts in a hundred when it holds more than usual, higher when less. Within a day a price stands, so what the panel shows is what is paid.
- **A market's purse comes back** as it sells on what it bought from the player, never past what it began with.
- **No round trip can make money, by the numbers and by test.** Fifteen in a hundred was chosen because at that swing the dearest price any market ever pays is still below the cheapest it ever asks, for every good in both markets. The port never holds less than its usual stock (the player can only add to it), so the most it pays, less carriage, is below the least the village asks. And a directed test: a steward who gluts the village with olives to buy them back cheap and press them ends poorer than one who simply presses them.
- **The ledger kernel gained one command**, a market's own day, with every unit and dinar journalled against the world so that the audit still closes; a price pair with ask below bid is refused whole.
- **On the page:** each good says whether its price is above or below yesterday's and whether the market holds less, the usual, or more than it wants, in words. The top bar shows what trade has brought in thirty days, read from the ledger's journal: sales and contract payments less purchases, carriage and penalties.
- **The port now opens with a stock of its own** (150 wheat, 40 olives, 12 oil), which is its usual stock. Rules version 6; saves of versions 1 to 5 are carried forward.
- **From the lab:** no win rate moved. The scripted merchant, who sells grain every day into a falling price, ends with 1,453 dinars where he had 2,187: dumping now costs.
- **Not done:** goods still arrive the day they are sent; there is no silk or ceramics; a "month" is thirty days of the game's calendar.
- **Checked:** 9 new tests (166 for Granada, 319 in all); 1,000 years in the lab, no rule broken; the play script in English and Arabic. 8 new strings in seven languages (338), machine-translated and read by no person.

### What lies ahead: warnings that are the rules run forward; the season in figures

- **"What lies ahead"**, on the Overview: if nothing more is done, the day the households first go hungry or short of water, each crop that will begin to spoil, a contract that will fail, and a reserve too small at winter's end, soonest first. **Every line is read from the rules run forward on a copy.** Tested over three years of weather: each warning comes true on the day it names, and not the day before. It changes the moment the steward acts (tested: ordering the harvest takes the wheat's warning away), and is silent once the game is over.
- **Food to spare**, in the market: how much food could leave the store and still leave, by that forecast, the twenty days asked at winter's end; or, plainly, that there is none to spare. This is the target's adviser ("protect winter reserves before exporting more grain") as a figure and not as a character.
- **The season in figures:** the river against what the valley wants today, how the fields fared yesterday as a share of their best, the days of food in store, the days to winter.
- **Decisions taken alone:** warnings say what will happen and never what to do. "Food to spare" is an approximation and says so by its wording ("by the forecast"): selling food changes the forecast it was reckoned from.
- **Checked:** 4 new tests (170 for Granada, 323 in all); the play script reads the warnings, acts, and sees one go, in English and Arabic. 15 new strings in seven languages (353), machine-translated and read by no person.

### The twentieth and twenty-first UAT releases; buildings that can be chosen; the oil's road

- **Twentieth UAT release, `20261126-008ef0a0c27`** (build 45770545973, check 45770749618, release 45770893769): prices that move. **Twenty-first, `20261126-0fa66176a9f`**: warnings from the forecast (build 45771122082, check 45771315795, release 45771466580). All twelve scripted scenarios passed on UAT after each.
- **Buildings can be chosen.** In the 3D valley a click on the store, the market, the estate by the terrace or anything the player has placed opens a card beside it, with a gold ring on the land: what it holds or how far it is built, in the rules' own figures, and the way into the part of the game it belongs to. The estate opens the press, and the olives can be pressed from its card. On the plan the store, the market and every placed building are buttons, for the pointer and for the keyboard.
- **The oil's road**, in the Economy: five steps in the order the goods travel (the grove, the press, the oil, the store, the port), each with what stands there now, and the next thing to do as a button at its step. The play script works the whole road from that one card: the terrace brought in, pressed, delivered on the contract, the rest sent.
- **A right-to-left defect found and fixed.** In Arabic and Urdu the card beside a chosen field in the 3D valley was placed from the wrong edge and stood partly off the page. It was there before this change, for fields; the new test of a building's card found it. The card is now placed from the land's own left edge in every language, and the script checks that it stands inside the valley.
- **The proof-frame page has an addendum** ([`spec-production/proof-granada.md`](spec-production/proof-granada.md)): what the running game has gained since the frame, so that it is judged as it stands. The frame itself is not retouched and the developer's reading of its finish is unchanged.
- **Not done:** buildings cannot be taken down; the valley's other buildings (the mill, the mosque, the houses) open nothing; the press is an order, not a building that works over time.
- **Checked:** 1 new test (171 for Granada, 324 in all); the play script in English and Arabic, on the plan and in 3D. 15 new strings in seven languages (368), machine-translated and read by no person.

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
| `npm --prefix gaming run atlas:pack` | 3,218 qualifying rounds (3,481 before the fairness rule of 25 November held 263 back); pack of 2,125 rounds and 568 places; 365 days, 1,825 rounds used, 0 problems; digest `60ba50cd200c…` (was `764f347cfa66…`) |
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

### The twenty-third pull request: Atlas asks no round named for one place and scored at another (25 November 2026)

```
npm --prefix gaming run atlas:pack     3,218 qualifying rounds (was 3,481); 263 events held back; pack of 2,125 rounds in 568 places (465 civic, 946 people, 714 military); 365 days, 1,825 rounds used, 0 problems; battles' weight for the free slot 0.62; digest 60ba50cd200c…
npm --prefix gaming test               15 files, 254 tests passed (Atlas: 59; seven new)
tools/atlas-play.ts <dir> <lang>       a full daily game in each of the seven languages on the new pack
npm run build:release:music + release:smoke   passes
```

Three things went wrong on the way and are worth keeping. The first rebuild could not lay out the year: with 258 battles gone the fifth round of each day went to people until, on day 292, every place with a person left was resting. Giving it to the category with most rounds to spare failed the same way on day 312. Giving it to the category with most places free laid out the year but asked 830 battles where the pack had 709, which is the opposite of what was wanted; giving civic events a share ran them out of places by day 149, as the first design had found. Battles are now counted for less in that choice and the builder finds the lowest weight that still lays out the year.

### The twenty-fourth pull request: the models can be carried to the games host (25 November 2026)

```
node --test workers/games/test/*.test.mjs     38 passed (two new: only what the art manifest names, byte for byte, under a path that can hold only a model's files; uploaded once, read back, served as model/gltf+json)
the real manifest against the real files      17 files, 5,472,930 bytes, all accepted
npm --prefix gaming test                      254 passed (unchanged)
```

The workflow's own build now looks for models beside the release (`--models-base ../media/models/`). The founder answered "Yes, upload to UAT" to the question of putting the mill's files there.

### The mill's files on UAT (26 November 2026 UTC)

Asked whether the mill's files might be put on UAT once the uploader was built, the founder answered "Yes, upload to UAT". The 17 files were attached to the draft release `games-media` under flat names, and "Upload the games' media" was run for UAT with kind `models`:

```
action check    run 45736853275   17 model files checked against the manifest; 0 uploaded (dry run: nothing written)
action upload   run 45736985159   17 model files checked against the manifest; 17 uploaded
read back from https://uat-games.islam.museum/media/models/   17 of 17 byte for byte what the manifest records (5,472,930 bytes); a path that is not there answers 404
```

**The game on UAT does not show the mill yet.** The release live there (`20261125-484ead40122`) was built before the build looked for models, so it asks for none. A release of `main` will. Until that release the host there also names a `.gltf` file `application/octet-stream`, because its Worker is the older one; the loader does not depend on the name.

### The fifth games release to UAT: the mill made in Blender, and Atlas's fair rounds (26 November 2026 UTC)

Asked whether to release `main` to UAT so that the mill would show there, the founder answered "Release to UAT". On the games build of `main` at `e2930d63426` (build run 45736806134), which looks for models beside the release:

```
action check     run 45737430538   passed; wrote nothing
action release   run 45737573014   passed; live 20261125-e2930d63426, before it 20261125-484ead40122
tools/uat-check.ts https://uat-games.islam.museum en, then ar   the five addresses each start in 3D, play a track after a click, no console error; Granada reports models ["granada/mill"] and no failure
the host now names /media/models/granada/mill.gltf model/gltf+json (its Worker went out with this release)
```

This release also carries Atlas's rebuilt pack, with the 263 held rounds out of play. Not done: a rollback on UAT; production, which has neither the music nor the models.

### An offline package of the UAT release for an outside reviewer (26 November 2026 UTC)

The reviewer's browser could not reach UAT a second time and asked for a copy to run with no internet. The founder passed the request on.

```
gh run download 45736806134 -n games-release             the build live on UAT; its release.json is byte for byte the host's
tools/qa-package.py assemble … --host https://uat-games.islam.museum   release 20261125-e2930d63426 with its music and models, each against its manifest
tests/qa-check.mjs, fresh Chrome, name lookups cut off but for localhost   en and ar: 8 pages each, 3D on, the mill loaded, forced modes right, save resumed, no request elsewhere
tools/qa-package.py seal …                                25,665,672 bytes, 88 files, SHA-256 a9bf094b5ba5…; unpacked clean: 87 of 87 checksums match
```

The first run on the unpacked copy stopped at Granada's opening brief (no start button found); five later runs passed and the cause is not known ([`external-review.md`](external-review.md)). Asked whether Cloudflare was blocking the reviewer, the host was questioned as six kinds of client, ChatGPT's among them: 200 to each.

### The twenty-eighth pull request: the Atlas globe that seemed to vanish between rounds (26 November 2026 UTC)

The first defect found in any game by someone other than its author: an AI reviewer driving Chrome on the founder's Mac, on UAT release `20261125-e2930d63426` (DEF-AT-001 in its report).

```
tools/atlas-play.ts, the reviewer's steps, before the fix   failed: "the round after a close reveal opened zoomed in 9 times, on the last answer, and not on the whole globe"
the same, after the fix                                     passes; round 3 opens on the whole globe
npm --prefix gaming test                                    255 passed (Atlas: 60)
```

The author's own play script had never met it because it reloads the page after round 2.

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

- The mill's files on UAT: [`evidence/release/uat-models-upload.json`](evidence/release/uat-models-upload.json).

- The fifth UAT release checked in Chrome: [`evidence/release/uat-release-5-en.json`](evidence/release/uat-release-5-en.json) and the same in Arabic; Granada reports the authored mill loaded.

- Atlas's blank round, before and after: [`evidence/atlas/blank-round/`](evidence/atlas/blank-round/).

## Unresolved defects and known limits

1. Figures are placeholder cylinders; buildings are undetailed; water, sky and market are simple (M1 report, "Honest visual assessment").
2. Microsoft Edge: the graphics lab's benchmark did not start under automation in Edge 157, and that is unexplained. The games themselves do run in it: on 25 November 2026 all three opened on UAT in Edge 157 in 3D with no console error ([`evidence/corrective/baseline/`](evidence/corrective/baseline/)). Nothing has been measured in Edge.
3. No soak, leak, device-loss, resize or suspension test exists.
4. The three flagship presets barely differ.
5. Only one machine has been measured.
6. The desktop app's dev-server launcher stalled twice in the first session; the tools no longer depend on it, but the in-app preview may need `npm --prefix gaming run dev` started by hand.
7. Interface strings of both games and of the music control exist in all seven languages, were written by AI agents and have been read by no native speaker. In Atlas, personal names in Turkish and Indonesian are borrowed from English. The graphics lab page is an English-only developer tool marked `noindex`.
8. Atlas has no images and no sound effects, its globe is lit in 3D but carries no terrain, 263 of its events are held back until their records are looked at, and up to two of its five daily rounds are military events ([`games/atlas.md`](games/atlas.md)). The images are held up by the museum's records, not by the game: four pictures qualify ([G-0008](adr/G-0008-atlas-image-rounds.md)).
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
5. **UAT carries everything on `main`** since the fifth release (`20261125-e2930d63426`, 26 November 2026 UTC): Granada's 3D valley with its village, mosque and bridge and the mill made in Blender, Atlas's lit sphere and its fair rounds, are there. The agent asks before each UAT release, because a deploy is the founder's to start; he answered "Release to UAT" for the third, the fourth and the fifth. A rollback on UAT is still unproved. An outside review is being asked for ([`external-review.md`](external-review.md)). **The founder looks at UAT** (`https://uat-games.islam.museum/granada/?lang=ar`) and, when he chooses, deploys the games to production. The next games release to UAT is also the first chance to prove a rollback there.
6. **Granada's valley in 3D is built** (25 November 2026). Next for it: nearer the concept (richer buildings, trees and people, generated or authored as the founder decides; people who walk, carts, boats), water that reflects, cascaded shadows, recovery from a lost device, a measurement on a weaker machine, an interface in the concept's manner. Then **the Play page and menu entry on the site** (the founder's instruction; `submission-impacting` and `rewrites-all-pages`), which leads to Granada first and needs the games deployed to have somewhere to lead. After that, Act II: prices that respond to stock, a mill, and goods that travel to Málaga.
7. **M3.** The portal pages in seven languages on a branch, the gaming workflow, the release build (including where the music is served from) and its dry run, ready for the founder's sign-off.

Resume with:

```bash
git fetch origin && git log --oneline -3 && git status --short
npm --prefix gaming ci && npm --prefix gaming test && npm --prefix gaming run strings
```
