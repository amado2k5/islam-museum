# Granada: the brief for an outside environment artist, the paid test, and the request for quotes

_Written on 26 November 2026 under the founder's fourth set of decisions ([`owner-decisions-2026-11-26-d.md`](owner-decisions-2026-11-26-d.md), instructions 11 to 16). **Nobody has been approached, engaged or paid, and nothing has been bought.** This page is prepared so that the founder can approve, change or refuse it. Every hour, price and budget in it is the planning estimate of his outside reviewer, quoted from his decision; none is a supplier's quote and none is approved spending. The figures about the game are read from the game and its models on the day of writing._

## 1. Who is wanted

**A senior real-time environment artist with technical-art ability.** Not an architectural visualiser: the work is judged running in a browser on integrated graphics, not in a rendered still.

The portfolio must show, in shipped or demonstrable real-time work for games or the web:

- modular historic architecture, with believable weathering and the look of a place lived in;
- Blender as the working tool, PBR texturing and baking, clean UVs, retopology, texture atlases;
- levels of detail made by hand and eye, collision proxies, and glTF 2.0 export;
- work brought within the budget of integrated or mobile-class graphics.

Experience of three.js, WebGL or WebGPU is strongly preferred. Without it, a stated willingness to work to budgets measured in the browser.

**The artist is not the historical reviewer.** History is approved by a named, qualified person in a separate role; the artist is not asked to vouch for it and must not claim it.

## 2. What the game is, for the artist

A strategy game in the browser set in Nasrid Granada, a prototype on a test address, free and without advertising or payment. three.js on WebGPU. The player sees a valley from above: an olive estate and its fields in front, a town on the slope, a walled hill with a palace on its top, a snow range behind. The picture it is working toward is the founder's target image, [`granada-v3.jpeg`](../spec-granada/assets/granada-v3.jpeg), which binds for composition, the kinds of thing shown, their hierarchy, density and finish.

**What exists today, and why an artist is asked.** Every building in the game was made by an AI agent writing Blender scripts. Two sets were judged by the founder and neither accepted as production art; a third attempt at one building, the palace, was stopped by its own maker for the same reason. The founder's reading, in his words: close up it "still reads as assembled procedural geometry: broad flat wall planes, uniformly sharp edges, repeated merlons/corbels/windows, regular hole patterns, limited material breakup and simplified box/lump vegetation". The record, with pictures: [`art-candidates-granada.md`](art-candidates-granada.md), and the palace in the running game, [`palace-in-game-granada.md`](palace-in-game-granada.md).

## 3. The package

Four things, and what they share:

| Piece | What it is | What stands in the game today (Set A), metres wide, deep, high; triangles |
|---|---|---|
| The estate | An olive estate at harvest: farmhouse, press, store, yard and walls. In the foreground of the proof view, the nearest building to the eye | 28.4 by 19.4 by 9.1; 3,472 |
| A street cluster | About eight houses of a town street, as a modular set that can be stood along curving streets on a slope without reading as copies. Today four house types stand about three hundred times | four types between 5.3 by 7.1 and 10.6 by 6.8, 6.4 to 10.0 high; 1,356 to 2,016 each |
| Gate and wall | A town gate and one bay of the wall with a tower, to repeat round a hill | gate 9.3 by 3.5 by 9.8 (1,720); wall bay 10.0 by 1.9 by 8.7 (352); tower 6.5 by 6.5 by 13.7 (948) |
| A construction site | Scaffolding, a crane and the props of building, and the stages through which a house or wall is seen to be built | scaffold 8.0 by 1.7 by 9.0 (972); crane 3.4 by 9.6 by 9.8 (380) |
| Shared | One kit of materials for all four; levels of detail; exports; help with fitting them into the game; ordinary revisions | |

Whether the palace joins the package depends on the founder's ruling on its evaluation in the game.

## 4. What the game fixes, and the artist must keep

- **Scale and axes.** Metres. glTF's own axes, Y up, with each piece facing as the model it replaces faces (the present files are given to the artist for this). One unit is one metre; no scale on any node.
- **Origins.** Each piece's origin is on the ground at the middle of its footprint. The game places a piece by that point, a heading and one scale, and stretches a wall bay along its length to close a ring.
- **Names.** Each piece is one named node (`estate`, `house-a` to `house-d`, `wall`, `tower`, `gate`, `scaffold`, `crane`, `stall`); the game finds pieces by name. A moving part is a named child (the mill's `wheel`). New names are agreed before delivery.
- **Footprints.** A new piece stays within the footprint of the one it replaces unless a larger one is agreed, because roads, plots, water and the selection of a building are placed against it. The scripted layouts are given to the artist as blockouts for this.
- **Selection and collision.** Required of new pieces (the present models have none): for a building the player can choose, one simple closed proxy for the pointer and one for collision, as separate named nodes that are not drawn. A street cluster keeps each house a selectable thing or documents its anchors.
- **Building in stages.** Where the game shows a thing being built (a house on a lot, the wall beside the gate), the stages are separate meshes in the same file or files named for the stage.
- **Seasons and light.** The game has four seasons, rain, and in Photo Mode morning, midday and evening light. No scene lighting is baked into base colour. Surfaces must hold up in a low autumn afternoon sun, which is the light of the proof view.
- **Reading at a distance.** Doors, roofs and the difference between a house, a store and a press must be legible at the sizes in section 5, including for players who see colour poorly: shape and value first, hue second.

## 5. How large things are on the screen

Measured in the running game ([`palace-in-game-granada.md`](palace-in-game-granada.md) has the method and every figure). The camera's distance to what it looks at runs from 70 to 980 metres, its field of view is 38 degrees, and in Photo Mode the lens runs from 16 to 70 degrees. Only the palace has been measured so far. The estate is the nearest building in the proof view and the houses of the town fill its middle; their sizes on the screen are measured before the brief is sent. The artist is given the game itself to check sizes, not only this table.

## 6. Budgets

The founder's provisional budgets, to be confirmed by measurement on the two minimum machines (an M1 MacBook Air with 8 GB; a Windows 11 laptop with an i5-1135G7 and 8 GB). Neither machine has been measured yet.

| | Near (Photo Mode, close) | Normal play | Far |
|---|---|---|---|
| A large landmark such as the palace, triangles | 180,000 to 220,000, loaded only for a close view | 45,000 to 70,000 | 10,000 to 20,000; optionally 2,000 to 5,000 or a baked silhouette beyond |
| A hero tree by the estate, triangles | 8,000 to 20,000 | 1,500 to 4,000 | 200 to 800 or an impostor |

- **Materials:** four to eight groups or atlases for a large piece; one shared kit across the package. The source file keeps its full materials.
- **Textures:** masters at whatever size the work needs; runtime in KTX2 (BasisU) with mipmaps. The present models' textures are 1,024 pixels square, as JPEG.
- **Levels of detail:** three per piece, as separate files or by the project's documented names, so that the game loads one and never draws two at once. Made by eye for silhouette, arches, roof lines and material seams. Automatic decimation is not accepted as final.
- **Houses of the town** are drawn in bulk as instances: with four types and about three hundred houses, a type's cost is multiplied some seventy-five times. Budgets for these are agreed after the paid test, from measurements.
- **A budget is met in the game, not in Blender.** The acceptance test is the game's own count of triangles, draw calls, textures and frame time with the piece in place.

## 7. What must be avoided

Broad flat planes without breakup; edges all equally sharp; one merlon, corbel, window or door repeated along a wall; holes and details on a regular grid; a surface that is one tiling photograph; walls that meet the ground in a clean line; hedges that are boxes and trees that are lumps; anything floating, anything cutting through water or ground; copied houses side by side.

What is wanted in their place: layered lime plaster over rammed earth, brick and stone, worn at the base and the corners, stained under eaves and spouts, mended in places; roofs that sag and vary; doors, screens, balconies, arcades and courtyards where they belong; props that show work being done.

## 8. Words and claims

- The palace and the town are a general reconstruction from types of building. **Nothing is called the Alhambra**, in a file name, a layer name, a portfolio caption or a message, and nothing is described as historically accurate. Every piece stays marked "historical review pending" until the named reviewer approves it.
- The artist may show the work in a portfolio once the founder agrees in writing, described as work for a prototype.
- No figurative depiction of prophets or Companions; no religious text modelled or textured onto a surface.

## 9. Sources and licences

- Every texture, scan, brush, model fragment and reference that enters a delivered file is listed in a manifest with its source and licence. Public-domain (CC0) sources are preferred; anything else is agreed first.
- **No marketplace asset that is not disclosed, and no generative-AI output that is not disclosed before it is used.**
- The museum receives the written right to use, modify, redistribute with the game, preserve and migrate everything delivered, worldwide and without limit of time, and receives every source file.

## 10. What is delivered, for every piece

1. The editable `.blend`, with high-resolution and non-destructive sources where they exist.
2. glTF 2.0 files (`.glb` or `.gltf`) at metric scale, with named nodes, stable origins and no missing file.
3. Three levels of detail, and the collision and selection proxies.
4. UVs and master PBR maps: base colour, normal, roughness, metallic where needed, ambient occlusion.
5. Master textures as PNG or TIFF and runtime textures as KTX2 with mipmaps, with the atlas sources.
6. A report for each level of detail: triangles, vertices, draw groups, materials, texture sizes, decoded memory, file size.
7. The stages of construction, where the game shows building.
8. Turntables, captures from the fixed proof camera, and a build of the game with the piece in it.
9. The manifest of sources and licences.
10. The written rights of section 9.

## 11. How the work goes

Three reviews for each piece, one round of changes at each: **blockout** (form, footprint and silhouette, in the game); **material test** (one wall and one roof finished, in the game's light); **final** (everything in section 10). Acceptance is in the running browser game at the proof view and at the nearest view, on the three presets, not from a render. The founder alone accepts the direction of the art.

## 12. The paid test, before any larger contract

**Not approved.** The founder approves spending separately, and this test first.

- **The piece:** one slice seen near: the estate's entrance and courtyard, or the gate with one bay of wall. The founder chooses.
- **What it covers:** final modelling, weathering and PBR textures; one state of building, damage or repair where it applies; three levels of detail; collision; source files; a browser-ready export, checked in the game.
- **The reviewer's estimate, not a quote:** 24 to 40 hours, about USD 1,500 to 4,000, four to eight working days.
- **What it is for:** to judge the look, the communication, the cleanliness of the source files, the optimisation, and whether the museum's rules on sources are kept, before the larger set is contracted.
- **It is paid whatever its result**, and its files belong to the museum under section 9.

## 13. The reviewer's estimate for the whole package, for comparing quotes

Quoted from the founder's decision; **estimates, not quotes, and not approved spending.**

| Part | Hours |
|---|---|
| The estate | 50 to 90 |
| The street cluster of about eight houses | 110 to 190 |
| Gate and wall | 40 to 75 |
| The construction site and its props | 50 to 90 |
| The shared material kit, levels of detail, exports, help with integration, revisions | 70 to 115 |
| **All** | **320 to 560** |

For one strong specialist, eight to fourteen working weeks, often ten to sixteen calendar weeks with reviews. At USD 50 to 100 an hour, about USD 16,000 to 56,000 before taxes, platform fees, historical review and large changes of scope; a practical target for a capable independent artist using modular reuse, USD 20,000 to 35,000. A quote far below should be checked for what it leaves out (levels of detail, source files, unique texturing, browser optimisation, revisions, rights); one above may be earned by bespoke ornament, research or senior technical work.

## 14. The request for a quote, as it would be sent

**Not sent to anyone.** Sending it is a message in the founder's name and waits for his word and his choice of whom to ask. At least three comparable quotes with fixed milestones are wanted.

```text
Subject: Request for a non-binding quote: real-time environment art for a browser strategy game (historic Mediterranean town)

We are a free, non-commercial digital museum building a strategy game that runs in the browser (three.js on WebGPU). It is a prototype. We are looking for a senior real-time environment artist with technical-art ability, working in Blender and delivering glTF.

The work: an olive estate; a modular street cluster of about eight town houses; a town gate with one bay of wall and a tower; a construction site with scaffolding, a crane and building stages; one shared material kit; three levels of detail for each piece; collision and selection proxies; KTX2 runtime textures; help with fitting the pieces into the game. The style is late-medieval Iberian: lime plaster over rammed earth, brick and stone, tiled roofs, weathered and lived in. It must run on integrated graphics (an M1 MacBook Air with 8 GB; an Intel i5-1135G7 laptop).

We would begin with one small paid test (an estate entrance and courtyard, or a gate with one wall bay, finished to final quality with three levels of detail and a browser-ready export) before any larger contract.

Please tell us, without commitment on either side:
1. A fixed price and working days for the paid test.
2. A fixed price by milestone, and calendar time, for the whole package.
3. What is included: levels of detail, source .blend files, revisions (we plan three reviews per piece), rights.
4. Links to real-time work of yours, with triangle and texture figures if you have them.
5. Whether you use marketplace assets or generative AI in your work, and how you record sources and licences.

We require all source files and the perpetual, worldwide right to use, modify and redistribute the work with the game. The full brief, the game on its test address and the reference image are available on request.
```

## 15. What this page does not do

It does not choose an artist, set a price, or commit the museum to anything. It is not a contract. It has been read by no artist, and the founder's instruction that the direction be "hand-authored or artist-reviewed" stays unmet until a named professional has made or reviewed the work.
