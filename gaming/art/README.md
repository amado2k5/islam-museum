# The games' art, made from source

_Begun 25 November 2026 for piece 1 of the corrective work ([`docs/gaming/traceability.md`](../../docs/gaming/traceability.md)), after the founder allowed Blender to be installed for it. **One asset exists: Granada's watermill, as a preview. It is not in the game yet.**_

The games' scenery was generated in the browser, at load, from boxes. This folder is the other way of making it: assets authored ahead of time by scripts run in Blender, with real mesh detail and mapped textures, exported as glTF for the game to load. "Authored" here means designed on purpose and built from source that anyone can run again; nothing is drawn by hand, nothing is downloaded, and no photograph is used.

## What is here

| | |
|---|---|
| `blender/common.py` | The kit: tiling texture sets painted by arithmetic (base colour, tangent-space normal, roughness); parts built of bevelled boxes, cylinders and prisms in real metres, each mapped in its own frame; cuts; the glTF export; a lit preview render |
| `blender/granada_mill.py` | Granada, hero asset 1: the watermill |
| `manifest.py`, `manifest.json` | For each asset: its source scripts and every output file, with sizes and SHA-256 |

## Running it

Blender 5.3 must be on the path (`brew install --cask blender`). From `gaming/`:

```bash
npm run art:mill                 # paints the textures, builds the mill, writes media/models/granada/mill.gltf
npm run art:mill -- preview.png  # the same, and a lit picture of it (about two minutes more)
npm run art:manifest             # records what came out
npm run art:manifest -- --check  # fails if this machine's models are not the recorded ones
```

The models and textures are media: they are written under `gaming/media/models/`, which git ignores, as the music is. `manifest.json` is what is committed.

## Standards

- One unit is one metre. Z is up in Blender and Y is up in the export.
- An asset's origin is on the ground at its centre. A part that moves is its own object with its origin on its axle (the mill's `wheel` turns about its own y axis in Blender, which is z in the export).
- Texture sets tile, and each says how many metres one repeat covers (`TILE` in `common.py`): a metre of wall is a metre of plaster wherever it stands. A plank's grain runs along the plank.
- Every edge that would catch the light is bevelled. Every face is triangles in the export, with tangents, so the game lights it as the preview was lit.
- Textures are shared between assets (one plaster, one roof tile, one stone, one wood), exported beside the model as JPEG.
- No lettering of any kind is put on a building: an invented inscription would be a false one.

## What it does not do yet

- **Only one asset, and it is not loaded by the game.** The valley still draws its own code-made mill.
- No levels of detail, no collision shapes, no compressed GPU textures.
- No figures: nothing here can make a person or an animal that walks.
- Whether a second run gives the same bytes on another machine or another Blender is not known; the manifest is there to find out.
- No one but the author has looked at it.
