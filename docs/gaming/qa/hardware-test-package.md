# The hardware-test package: outline

_Written 26 November 2026 at the founder's request ([`../spec-production/owner-decisions-2026-11-26-b.md`](../spec-production/owner-decisions-2026-11-26-b.md), O2). **This is the outline. The package does not exist yet, and neither performance gate has been run.** Every frame time recorded so far is from an Apple M4 Max in Chrome, which cannot stand in for the minimum machines. A gate passes only when a named person has run the whole suite on the physical machine._

## The two machines, and who runs them

| Machine | Operator | State |
|---|---|---|
| Apple M1 MacBook Air, 8 GB | not named | open: the founder arranges an operator or a QA coordinator |
| Windows 11 laptop, Core i5-1135G7 or its like, 8 GB, integrated graphics | not named | open: the same |

Browsers on each, where the system has them: Chrome and Edge, current and previous stable; Safari, current and previous, on the Mac; Firefox, current. Sizes: 1280 by 800 and 1920 by 1080, at pixel ratios 1 and 2 where the screen allows.

## What the package will hold

It is built from the offline package that already exists (`gaming/tools/qa-package.py`): one ZIP of an exact release with a small Python server, needing no internet, no install and no account. To it are added:

1. **A benchmark build that can be reproduced.** The release named by its id and commit, with its checksums; the games unchanged except that each can be started in a benchmark mode by an address (`?bench=...`) that fixes the seed, the camera path, the quality preset and the actions, so that two runs do the same thing. _To build: the mode in each game, and a test that the same address gives the same sequence._
2. **Counters, read from the page.** Frame times (every frame, summarized as median, 95th and 99th centile, and frames over 33 ms and over 50 ms); the JavaScript heap where the browser gives it; the renderer's own counts of triangles, draw calls, geometries, textures and render targets; and the page's counts of graphics contexts, timers, workers, listeners and audio nodes. _To build: one counter module shared by the three games (plan package F3). Granada and The Golden Age already report draw calls and triangles; nothing reports memory._
3. **A 60-minute script** of repeated actions for each game: the same cycle (for Granada: a day's orders, a harvest, a sale, a camera move, a change of tab; for The Golden Age: a season with building and a canal; for Atlas: a full game of five rounds, then a new one) repeated for an hour, with the counters written every minute.
4. **A four-hour soak**: the 60-minute cycle run four times over, with a tab sent to the background and brought back each half hour, a resize each hour, and the counters kept. The founder asks for the four hours to be interactive: the operator stays with the machine and notes what they see; the script does the repetition.
5. **A page that gathers the machine's own facts** and shows them for copying: browser and version, system and version, the graphics adapter as the browser names it, whether WebGPU or WebGL 2 is in use, screen size and pixel ratio, cores and memory as the browser reports them. The operator adds the model and year from the machine's own "About" screen.
6. **Instructions a person who is not a developer can follow**: one page, with pictures, from "unzip this" to "send back this one file". Nothing is installed; no terminal command beyond starting the server (double-click launchers for macOS and Windows are to be included); nothing leaves the machine by itself.
7. **A results file in one standard form** ([`hardware-results.template.json`](hardware-results.template.json)), written by the page at the end of each run, which the operator sends back. It carries the operator's name only if they choose to give it.

## What makes it safe to hand to someone

- The server listens on the machine itself only (`127.0.0.1`), serves only the package's folder, and stops when its window is closed.
- No credential, key or token is in the package. The games ask for nothing and send nothing; the package's own check fails if a page makes a request to any other host.
- It does not touch the browser's own saved games on the museum's addresses: it runs on its own local address, whose storage is separate.
- The operator is told how to remove everything: delete the folder.

## What counts as a pass, per machine and browser

The founder's gates of 26 November 2026, unchanged: 60 frames a second aimed at in ordinary play and never staying under 30; no slowdown over the session; no blank canvas, lost context left unrecovered, second render loop or doubled sound; memory level after warm-up, and any unexplained growth over 10% across identical cycles looked into; every counted resource steady; a background tab throttled and resumed safely; low, medium and high presets each keeping the game and a coherent picture. A run that was not completed, or was made on another machine, passes nothing.

## What is needed to build it

Plan packages F1 (lifecycle), F2 (WebGL 2 and presets), F3 (counters and runners) in [`../spec-production/production-plan.md`](../spec-production/production-plan.md). Until they are built there is nothing to hand to an operator.
