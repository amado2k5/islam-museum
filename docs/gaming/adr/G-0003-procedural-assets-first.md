# G-0003: geometry and textures are generated from seeds, in code

_25 November 2026. Status: accepted._

## Decision

The first art pipeline is code. Buildings, arcades, domes, walls, trees, boats, figures and terrain are built by functions in `gaming/packages/worldkit` that write plain vertex buffers; surface textures (plaster, brick, ashlar, glazed tile, an eight-pointed star tiling, wood, lattice, cloth, earth, paving, crops, grass, water) are painted pixel by pixel from seeded noise, each with a normal map from the same height field. No image file, no model file and no drawing API is involved, so the output is identical in every browser and in Node, and nothing in it can carry someone else's rights.

Conventions, fixed here for every generator: right-handed, Y up, metres; +X east, +Z south; counter-clockwise triangles face outward; UVs are in metres and the material says how many metres a texture tile covers; vertex colours are linear multipliers.

## Evidence

- The whole reference district generates in about 100 ms (69 to 104 ms measured in Chrome and Node).
- Fourteen 512 × 512 textures with normal maps take 3.86 s on one thread in Node. In Chrome 158 on a pool of eight workers they take 147 ms. Measured in the page: one worker 895 ms, four workers 269 ms, eight workers 147 ms. The worker pool is therefore kept; it is a measured gain, not a habit.
- The transferred size of all of this is the code that makes it, tens of kilobytes, against tens of megabytes for the same district as authored models and textures.

## What this does not give

Authored landmark silhouettes, sculpted characters and hand-painted detail. The first captures show it: the figures are robed cylinders, good enough as crowd proxies from the city camera and not good enough at street level. The specification asks for "authored landmark silhouettes plus modular/procedural assets"; this decision delivers the second half and a place for the first.

## Blender

Blender is not installed on this machine, and installing it is a download this session did not have approval for. Headless Blender with Python and Geometry Nodes remains the candidate build-time tool for hero buildings, characters and their animation, exported to glTF with meshopt and KTX2. It would run on a developer's machine or in CI and never on a player's. The evaluation is an open task in the ledger; nothing in M1 depends on it.

## Alternatives turned down

- **Bought or downloaded asset packs.** Rights to track per file, styles that do not match each other, and periods and regions mixed at random, which the specification names as a failure.
- **AI image or model generators at build time.** An outside service as a dependency, and output that cannot be reproduced from a seed.
