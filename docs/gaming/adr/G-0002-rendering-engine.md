# G-0002: Three.js WebGPURenderer with TSL is the 3D stack

_25 November 2026. Status: accepted, on the evidence of one machine and two browsers. It is re-opened if a Windows or Linux machine with a discrete GPU contradicts it._

## Question

Which engine renders the 3D games (Golden Age, Silk Road, House of Wisdom, ChronoQuest, Relics, Architects, the Atlas globe)? The specification asks for a measured choice between Three.js and Babylon.js on the same scene, not a preference.

## Method

One scene, built once, drawn by both. `gaming/packages/worldkit` generates the reference district from seed 7 as plain typed arrays: 770 buildings, 555,544 vertices, about 1.33 million triangles, 3,236 instanced props, 640 walking figures. Each engine receives the same vertex buffers, instance matrices, procedural textures (albedo and normal), sun, sky dome, fog and camera path. Both draw the "parity" feature set, the features they share: their own PBR material, hardware instancing, one 4096 × 4096 filtered shadow map covering the whole city, exponential fog, ACES tone mapping, 4× multisampling. Nothing in the parity set is a custom shader.

Lighting was matched by measurement, not by eye. With the same light numbers, Babylon's image was darker until its exposure was divided by 0.6 (Three.js's ACES operator applies that factor internally, Babylon's does not); after that the two riverfront captures differed by 1% in mean luminance (138.2 against 139.6 on a 0 to 255 scale, `gaming/tools/image-stats.py`).

The camera flies a fixed 30-second loop through seven views, from 250 m above the river to a few metres over the market. `gaming/tools/bench.ts` starts the installed browser with a visible window, warms up for 5 seconds, records every frame interval and the CPU time of every render call, and writes the JSON in `docs/gaming/evidence/m1/`.

## Measured

MacBook Pro Mac16,5, Apple M4 Max (40-core GPU, 128 GB unified memory), macOS 27.2.1, built-in 120 Hz display. Google Chrome 158.0.8127.38. Backing store 2560 × 1440. Three.js 0.187.0, Babylon.js 9.37.2. Adapter reported by the browser: vendor `apple`, architecture `metal-3`, not a fallback adapter.

| Run | Engine | Frames | Average fps | Frame p50 / p95 / p99 / max (ms) | Frames over 16.7 ms | CPU per render p50 / p95 (ms) | Engine start (ms) |
|---|---|---:|---:|---|---:|---|---:|
| Display-synced, 30 s | Three.js | 3,601 | 120.0 | 8.3 / 9.0 / 9.3 / 9.4 | 0 | 1.3 / 1.5 | 71 |
| Display-synced, 30 s | Babylon.js | 3,601 | 120.0 | 8.3 / 8.9 / 9.3 / 9.4 | 0 | 1.6 / 2.0 | 320 |
| Frame limit off, 20 s | Three.js | 4,429 | 221.4 | 4.5 / 4.9 / 5.0 / 5.6 | 0 | 1.2 / 1.5 | 75 |
| Frame limit off, 20 s | Babylon.js | 3,999 | 199.9 | 5.0 / 5.5 / 5.6 / 6.3 | 0 | 1.7 / 2.1 | 325 |

"Frame limit off" starts Chrome with `--disable-gpu-vsync --disable-frame-rate-limit`. It is a way to measure headroom and is never something a player needs. About 2.47 million triangles are submitted per frame in both engines (the scene plus its shadow pass); Three.js issued 552 draw calls and Babylon.js 603.

Source files: `evidence/m1/bench-chrome-2560x1440.json`, `evidence/m1/bench-chrome-2560x1440-uncapped.json`. The Microsoft Edge 157 runs are in the same folder and are reported in the M1 report.

## What the numbers say, and do not say

- On this machine both engines hold the display's 120 Hz with no missed frame on the parity scene. Frame pacing does not separate them.
- With the limit off, Three.js is about 11% faster (221 against 200 frames a second), spends about 30% less CPU time per render call, and starts about four times sooner.
- This is one Apple-silicon machine. It is the only hardware available to this session. It says nothing about Windows with NVIDIA or AMD drivers, which is where most of the intended audience is, and nothing about thermals over an hour. Those runs are pending (`m1-graphics-spike.md`, "Still open").

## Decision

Three.js `WebGPURenderer` with TSL node materials, pinned at 0.187.0, for every 3D game. The measured margin is modest; the choice rests on it together with four engineering facts found while building both renderers:

1. **The museum's content security policy.** Babylon's WebGPU engine compiles any GLSL shader through glslang and Tint WebAssembly modules that it fetches from `cdn.babylonjs.com` by default (`Engines/WebGPU/webgpuTintWASM.js`). The museum's policy is `script-src 'self'` and `connect-src 'self'` plus its own API host. Babylon's built-in materials have WGSL versions and the lab ran with no such download, but one GLSL-only material, effect or third-party extension would fail in production in a way that never shows in development. Three.js generates WGSL from TSL itself and downloads nothing.
2. **The post-processing the art direction needs is already in the package** as TSL nodes: ground-truth ambient occlusion, bloom, temporal anti-aliasing, screen-space reflections and global illumination, depth of field, cascaded shadows (`three/examples/jsm/tsl/display`, `three/examples/jsm/csm/CSMShadowNode.js`). The lab's High, Ultra and Cinematic presets use the first two.
3. **Two silent traps in Babylon for generated geometry.** In a right-handed scene, a mesh built from raw buffers is culled inside out unless every material sets `sideOrientation`; and a scene rendered outside `runRenderLoop` draws nothing, with no error, unless the frame is opened and closed by hand. Both were found only by looking at a blank and then a black image. Neither is a defect in Babylon, but both cost an hour that Three.js did not.
4. **One renderer already in the house.** The site depends on three 0.160 for its `/3d/` page. The games use their own newer copy in `gaming/`, and the two never share a bundle, but the team's knowledge is in one library.

## What is not decided here

- No engine wrapper. `labs/graphics/src/api.ts` is the lab's contract for this one scene and is not the games' renderer interface. Games use Three.js directly behind their own small scene modules (specification 04: "not a universal lowest-common-denominator wrapper").
- 2D games (Lost Manuscripts, Knowledge Web, Dynasty's map, the Atlas interface) use DOM, SVG or Canvas where those are better. No game is forced through the 3D stack.
- Babylon.js stays installed for the lab only, so the comparison can be repeated after an engine or browser upgrade. No game imports it.

## Alternatives turned down

- **Babylon.js.** Close on speed, behind on start-up time and CPU cost, and carrying the content-security risk above. Its strengths (a built-in inspector, a physics plugin interface, a node material editor) do not outweigh that here.
- **A custom WebGPU renderer.** Months of work to reach what either engine gives on day one.
- **WebGL.** The mandate's canonical edition has no WebGL obligation, and the lab refuses to run if Three.js falls back to it.

## Read again for Granada (25 November 2026)

The founder asked, while Granada's valley was being built in 3D: "use the most modern, best available web browser based gaming engine if you are not already doing so, use the best ideas and best practices and lookup lessons learnt and how things are done". So the decision was read again and the state of the engines looked up. The look-up was done by a helper agent (Sonnet) from the web, in about ninety seconds; its sources are given as it reported them and **were not re-read by the author**, so every line below that is not about this repository is one helper's reading.

**What it found.**

- Three.js r187 (30 October 2026) is the current release, and it is the one pinned here ([releases](https://github.com/mrdoob/three.js/releases)). Its manual still calls the WebGPU renderer experimental, says it has matured, and says the older renderer receives no major new features ([manual](https://threejs.org/manual/pages/webgpurenderer.html)).
- Babylon.js 9 (26 March 2026; [announcement](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0)) and PlayCanvas 2 are as current and more complete as engines. Unity's web export still calls WebGPU experimental and is heavy to load. Nothing was found that makes any of them a better fit for a game whose every shape is generated by code and which is served as static files under a strict content security policy.
- WebGPU is on by default in Chrome and Edge 113 and later on desktop, Chrome 121 on recent Android, Safari 26, and Firefox 141 on Windows and 147 on macOS ([gpuweb implementation status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status)); one reference site disagrees about Firefox and Safari, and that was left unresolved.
- Practices drawn from the engine's own pages: compile materials ahead with `compileAsync()`; temporal anti-aliasing and multisampling cannot be used together; cascaded shadows exist as `CSMShadowNode` but come with no guidance on cost; the ambient occlusion became darker and wider in r185, so its radius should be kept low; draw many like things as instances, because drawing thousands of separate meshes costs the WebGPU renderer about twice the CPU of the old one (a forum report, with no reply from the maintainers); every release breaks something, so pin the version and read the migration guide at each step.
- Not found: official guidance on levels of detail, on drawing fewer pixels when frames are slow, on memory, on terrain texturing, or on recovering from a lost device.

**What follows from it.**

1. **The decision stands, in plainer words.** Three.js on WebGPU is a modern, actively developed engine and a defensible choice for these games, for the four reasons above, which are about this repository and were not changed by the look-up. It is not shown to be "the best available": two other engines are as current, and this file measured only one of them, on one machine. No document of the museum should call it the best.
2. **What Granada's valley already does that the look-up supports:** everything drawn many times is an instance (7,403 trees are twenty instanced meshes); the environment is made once; the version is pinned.
3. **What it does not do yet, in order:** recover from a lost device with a visible fall back to the plan; decide between cascaded shadows and the one map that follows the camera by measuring both; compile materials before the first frame, to remove the hitch when the valley first appears; try temporal anti-aliasing against multisampling.
4. **What it does on its own judgement,** because nothing official was found: the two-level tree detail, the governor that draws fewer pixels when frames slow, and the plots drawn by the land's material. Each is measured on one machine in [`../games/granada.md`](../games/granada.md) and nowhere else.
