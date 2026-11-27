# The games' art, made from source

_Begun 25 November 2026 for piece 1 of the corrective work ([`docs/gaming/traceability.md`](../../docs/gaming/traceability.md)), after the founder allowed Blender to be installed for it. Granada's watermill, town kit, larger landmarks and the palace the game shows are now built here and served on the games' host. The palace remains under evaluation and historical review, not accepted art._

The games' scenery was generated in the browser, at load, from boxes. This folder is the other way of making it: assets authored ahead of time by scripts run in Blender, with real mesh detail and mapped textures, exported as glTF for the game to load. "Authored" here means designed on purpose and built from source that anyone can run again; nothing is drawn by hand and no outside model is downloaded. The photographed surface textures named below are public domain and recorded file by file.

## What is here

| | |
|---|---|
| `blender/common.py` | The kit: tiling texture sets painted by arithmetic (base colour, tangent-space normal, roughness); parts built of bevelled boxes, cylinders and prisms in real metres, each mapped in its own frame; cuts; the glTF export; a lit preview render |
| `blender/granada_mill.py` | Granada, hero asset 1: the watermill |
| `blender/granada_town.py`, `blender/granada_landmarks.py` | Granada's town kit and larger landmarks |
| `blender/granada_palace_c.py`, `blender/author.py` | The palace written as a building of its own; under historical review, not accepted or final art |
| `derive_palace.py` | Writes the game's lighter palace folder so it borrows the first set's textures instead of carrying copies |
| `compare_gltf.py` | Compares two exports as meshes when their bytes are only ordered differently |
| `manifest.py`, `manifest.json` | For each asset: its source scripts and every output file, with sizes and SHA-256 |

## Surfaces photographed by others

From 26 November 2026 the kit's plaster, roof tile, stone, timber and paving are photographs given to the public domain (CC0) by [Poly Haven](https://polyhaven.com/license), downloaded with the founder's approval through his own browser. [`sources.json`](sources.json) names each one, its authors, its page, and the checksum of every file. They are media and are not in git: they live under `gaming/media/textures/polyhaven/`, and a machine without them gets the surfaces the kit paints itself, so every script still runs. Poly Haven asks for no credit; it is given anyway. Three washes are made from the one stucco by tinting it (a lime white, an ochre, a red earth).

## The town kit

`blender/granada_town.py` makes `town.gltf`: four houses, a length of wall, a tower, a gate, scaffolding and a market stall, each an object of its own name in one file so that they share one set of surfaces. The game stands the houses many times over (`KitPlacement` in `games/granada/src/view/valley.ts`). No source stands behind any of these shapes; they are a reconstruction awaiting review (entry HR-GR-06 of the historical-review ledger).

## A set of models that changes gets a new folder

A file on the games' host is ordinarily never replaced. So when the models of a game change, the whole set is written to a new folder (`granada/2/`), the game is pointed at it (`MODEL_SET` in `three-valley.ts`), and the older set stays where a release that is rolled back to expects it. The one exception is a corrected generation fault: the media workflow may replace only exact files named beforehand, after a check run, and reads them back byte for byte.

## Running it

Blender 5.3 must be on the path (`brew install --cask blender`). From `gaming/`:

```bash
npm run art:mill                 # prepares the textures, builds the mill, writes media/models/granada/2/mill.gltf
npm run art:town                 # the town kit, into the same folder
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

- The game does not change levels of detail by itself. Lighter palace files exist for evaluation, but they are different files the page must be asked for; they are not an automatic LOD system. There are no collision shapes or compressed GPU textures.
- No figures: nothing here can make a person or an animal that walks.
- A second run is **not** guaranteed to give the same bytes. On 27 November 2026 two full-palace runs wrote identical `.gltf` files but different `.bin` bytes while their meshes were exactly the same; a later generation also showed a small triangulation difference on one planar surface. Use `python3 art/compare_gltf.py <first.gltf> <second.gltf>` to tell ordering apart from a real mesh change; the manifest still records exact bytes.
- No historian has reviewed the reconstruction; historical review remains pending.
