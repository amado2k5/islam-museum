# The games' art, made from source

_Begun 25 November 2026 for piece 1 of the corrective work ([`docs/gaming/traceability.md`](../../docs/gaming/traceability.md)), after the founder allowed Blender to be installed for it. Granada now has two model sets on machines that have run the scripts: `granada/2`, which the game reads, and `granada/3`, a second proof candidate with more finished versions of the same pieces. **Set 3 is not in the game and is on no host.**_

The games' scenery was generated in the browser, at load, from boxes. This folder is the other way of making it: assets authored ahead of time by scripts run in Blender, with real mesh detail and mapped textures, exported as glTF for the game to load. "Authored" here means designed on purpose and built from source that anyone can run again; nothing is drawn by hand; the scripts paint surfaces or use the recorded public-domain photographs named below.

## What is here

| | |
|---|---|
| `blender/common.py` | The unchanged set-2 kit: texture preparation (photographed where present, painted otherwise), parts built of bevelled boxes, cylinders and prisms in real metres, cuts, the glTF export and a lit preview render |
| `blender/kit.py` | Building pieces shared by the unchanged set-2 scripts: roofs, openings, doors, chimneys and merlons |
| `blender/granada_mill.py` | Granada set 2, unchanged: the watermill |
| `blender/granada_town.py` | Granada set 2, unchanged: four houses, wall, tower, gate, scaffolding and stall in one town kit |
| `blender/granada_landmarks.py` | Granada set 2, unchanged: palace, estate and builders' crane in one landmarks file |
| `blender/common3.py`, `blender/kit3.py` | The proof pipeline: set 3's deterministic export and extended building helpers, kept separate so the set-2 generator cannot change kind |
| `blender/granada_mill3.py`, `blender/granada_town3.py`, `blender/granada_landmarks3.py` | Granada set 3: the finished proof candidate |
| `compare_granada.py` | The set-2/set-3 interface comparison: names, origins, outer sizes, kit footprints and LODs |
| `blender/render_granada_compare.py` | Side-by-side evidence renders of the two sets, not used by the game |
| `manifest.py`, `manifest.json` | For each asset: its source scripts and every output file, with sizes and SHA-256. `assets` is the publishable set-2 baseline; `proofAssets` is local-only set-3 evidence and is not read by the model publisher |

## Surfaces photographed by others

From 26 November 2026 the kit's plaster, roof tile, stone, timber and paving are photographs given to the public domain (CC0) by [Poly Haven](https://polyhaven.com/license), downloaded with the founder's approval through his own browser. [`sources.json`](sources.json) names each one, its authors, its page, and the checksum of every file. They are media and are not in git: they live under `gaming/media/textures/polyhaven/`, and a machine without them gets the surfaces the kit paints itself, so every script still runs. Poly Haven asks for no credit; it is given anyway. Three washes are made from the one stucco by tinting it (a lime white, an ochre, a red earth).

## The town kit

`blender/granada_town.py` makes `town.gltf`: four houses, a length of wall, a tower, a gate, scaffolding and a market stall, each an object of its own name in one file so that they share one set of surfaces. The game stands the houses many times over (`KitPlacement` in `games/granada/src/view/valley.ts`). No source stands behind any of these shapes; they are a reconstruction awaiting review (entry HR-GR-06 of the historical-review ledger).

## A set of models that changes gets a new folder

A file on the games' host is never replaced. So when the models of a game change, the whole set is written to a new folder (`granada/2/`), the game is pointed at it (`MODEL_SET` in `three-valley.ts`), and the older set stays where a release that is rolled back to expects it.

## Running it

Blender 5.3 must be on the path (`brew install --cask blender`). From `gaming/`:

```bash
npm run art:mill                 # prepares the textures, builds the mill, writes media/models/granada/2/mill.gltf
npm run art:town                 # the town kit, into the same folder
npm run art:mill3                # the finished mill proof, into media/models/granada/3
npm run art:town3                # the finished town-kit proof, into the same folder
npm run art:landmarks3           # the finished palace, estate and crane proof, into the same folder
python3 art/compare_granada.py   # compares sets 2 and 3 once both exist on this machine
npm run art:mill -- preview.png  # the same, and a lit picture of it (about two minutes more)
npm run art:manifest             # records what came out
npm run art:manifest -- --check  # fails if this machine's models are not the recorded ones
```

The models and textures are media: they are written under `gaming/media/models/`, which git ignores, as the music is. `manifest.json` is what is committed.

## How a game gets a model

Like the music: the models are served beside the releases, from `media/models/` on the games host, and are in no release. A build is told where they are with `--models-base` (`npm run build:release:media` for a local one); without it a build is told there are none and asks for nothing. In development the workspace's own `media/models/` is used. A game must be able to do without any model: it draws a shape of its own first and lets the model take its place.

## Standards

- One unit is one metre. Z is up in Blender and Y is up in the export.
- An asset's origin is on the ground at its centre. A part that moves is its own object with its origin on its axle (the mill's `wheel` turns about its own y axis in Blender, which is z in the export).
- Texture sets tile, and each says how many metres one repeat covers (`TILE` in `common.py`): a metre of wall is a metre of plaster wherever it stands. A plank's grain runs along the plank.
- Every edge that would catch the light is bevelled. Every face is triangles in the export, with tangents, so the game lights it as the preview was lit.
- Textures are shared between assets (one plaster, one roof tile, one stone, one wood), exported beside the model as JPEG.
- No lettering of any kind is put on a building: an invented inscription would be a false one.

## What it does not do yet

- The original `art:mill` and `art:town` commands still run the unchanged set-2 scripts. Set 3 is made only by the separate `*3.py` scripts. It carries one lower level of detail for every exported object, named `<object>-lod1` with `lodOf` and `lodLevel` extras; the game does not yet choose it. A future loader must filter or use those nodes rather than simply drawing every node. No collision shapes, no compressed GPU textures.
- No figures: nothing here can make a person or an animal that walks.
- On this machine and Blender 5.3.0, the three set-3 export scripts gave byte-identical files across a double run; whether another machine or another Blender gives the same bytes is not known. The manifest is there to find out.
- No one but the author has looked at it.
