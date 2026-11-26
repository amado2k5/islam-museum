# G-0013: Hudhud is drawn with Phaser 4.2.1, and its rules stay outside the engine

_26 November 2026. Status: accepted for Hudhud; one scene built on it._

## Question

Hudhud: The Atlas of Wonders is a 2D story-action game ([the founder's instruction](../hudhud/owner-instruction-2026-11-26.md), section 7). The workspace has two 3D engines pinned (Three.js for the games, Babylon.js for the graphics lab) and no 2D one. The instruction asks for one engine only, chosen after comparing Phaser 4, PixiJS 8 with systems of our own, and no new engine at all, with the default being Phaser "unless measured repository constraints show a concrete reason otherwise".

## What was measured

All on 26 November 2026, with the workspace's own Vite 8.3.8 and target `es2023`.

| | Phaser 4.2.1 | PixiJS 8.23.0 | No new engine |
|---|---|---|---|
| Latest stable on npm that day | 4.2.1 (`latest`) | 8.23.0 (`latest`) | — |
| Licence | MIT | MIT | — |
| Smallest page that draws a shape (minified) | 1,368,023 bytes in one file | 531,940 bytes in 16 files (it loads the renderer it needs: with WebGL alone, less) | 0 |
| The same, gzip -9 / Brotli | 352,294 / 283,097 | 156,545 / 138,628 (all 16 files) | 0 |
| `eval` or `new Function` in the build | none | none | — |
| Runs under the games host's policy (`script-src 'self'`, `style-src 'self'`, no inline) | **yes, measured**: `release:smoke` opened the built release behind the Worker's own headers in Arabic and English with no policy violation | not built, not measured | — |
| What it brings | scenes with a life (create, update, shutdown), a scale manager, tweens, pointer input, cameras, sprite sheets and atlases, tilemaps, Arcade physics, particles, filters | a renderer and a scene graph; everything else is ours to write | Three.js is already here and can draw flat quads; every 2D convenience is ours to write |

Hudhud's own page in a release, built on Phaser, **as first measured: 1,456,166 bytes minified, 384,198 gzip, 311,102 Brotli**, in one script and one 7 KB stylesheet (no picture files: see below). **Measured again on 26 November 2026, with the five quests and the opening story, from the script `build:release` wrote (`assets/app-B-1A27xA.js`): 1,590,733 bytes minified, 341,288 with Brotli at quality 11, 423,500 with gzip at level 9 (Node's zlib), and a 14,272-byte stylesheet.** The first figures are kept as a past measurement; today's are the second. The scene's code and strings are about 88 KB of that; the rest is the engine. The other three games together are 3.9 MB minified.

## Decision

1. **Phaser 4.2.1, pinned exactly** in `gaming/package.json`. No constraint of the repository speaks against the default. The cost is about 145 KB more on the wire than PixiJS (Brotli) for a game the instruction budgets at 15 to 20 MB on first load; what it buys is the scene lifecycle, scale manager, tweens, tilemaps and atlases that fifty quests would otherwise need written and tested by hand.
2. **The stable WebGL renderer**, asked for by name (`type: Phaser.WEBGL`). No WebGPU. If WebGL cannot start, the page says so and the scene can still be played from the list in words under the picture.
3. **Phaser draws; it does not decide.** The rules are pure TypeScript with no import from Phaser or the page: the light puzzle (`sim/light.ts`), the bird's movement (`sim/move.ts`), the scene's state (`sim/scene.ts`), conversation (`narrative/dialogue.ts`) and saving (`save/save.ts`). They run in Node, which is where the tests run them. A test (`dialogue.gtest.ts`) refuses `Math.random`, `Date.now` and `performance.now` in those files; chance comes from the shared seeded generator ([G-0005](G-0005-determinism.md)).
4. **Movement is our own fixed-step kernel, not Arcade Physics**, for now. The instruction prefers Arcade for traversal. The kernel is 120 lines, gives coyote time, jump buffering, glide and one-way perches, and is tested at 30, 60 and 144 frames a second in Node; Arcade's results depend on Phaser's own loop and cannot be tested without a browser. Arcade stays available in the bundle for moving platforms and hazards if a later quest needs them; that would be a note here, not a new engine.
5. **Phaser's keyboard, gamepad and audio are switched off.** The page has its own input (`input/input.ts`: keyboard, on-screen buttons, gamepad) so that the same code serves the canvas and the accessible page round it, and its own small sound synthesiser; the music is the museum's suite through the shared player ([G-0007](G-0007-music-and-audio.md)).
6. **Words and controls are page, not canvas.** Dialogue, the goal, settings, pause, results and a list that says the scene in words are ordinary DOM over and under the canvas. No UI framework is added.
7. **One 2D engine.** Three.js remains the engine of the other games; nothing of theirs changes. Hudhud does not import it.

## What this does not decide, and what was not measured

- **Pictures.** The golden scene draws every picture with Canvas 2D code when it opens and hands the canvases to Phaser as textures, so a release holds no picture file. Whether the game's art is made that way is the founder's decision and is not made here ([art bible](../hudhud/art-bible.md)). If pictures become files, they are media: out of git, on the games host under `games/media/`, with a manifest, and the release builder and the Worker's policy (`img-src 'self' data: blob:`) already allow them from the same host.
- **PixiJS was measured for size only.** No scene was built on it, so there is no frame-time comparison. The choice rests on size, what each brings and the default in the instruction.
- **Phaser on the two reference machines** (M1 MacBook Air 8 GB; Windows 11, i5-1135G7, 8 GB): not run. The frame times in [the art bible](../hudhud/art-bible.md) are from the founder's M4 Max and prove nothing about them.
- **Phaser's canvas-texture cost at scale.** One scene holds 45 textures. A world of five quests will need atlases (Phaser reads them) and a decision on how many scenes' pictures stay in memory.
- **Context loss.** A lost WebGL context is noticed, the player is told, and the game is rebuilt when the context returns; this was exercised once per run with `WEBGL_lose_context` in Chrome and the scene came back. A real loss on a real driver was not seen.

## Dependencies added

| Package | Version | Licence | Why |
|---|---|---|---|
| `phaser` | 4.2.1 (exact) | MIT | this decision |

`npm --prefix gaming ci` reported 0 vulnerabilities before it was added; the install of Phaser added 2 packages.
