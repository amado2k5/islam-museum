# G-0012: The games' art is authored ahead of time, from source, in Blender

_25 November 2026. Status: accepted for Granada's hero assets; one asset made, none in a game yet._

## Question

The corrective mandate's first piece of work ([`../traceability.md`](../traceability.md), piece 1) asks that Granada's art stop being boxes generated in the browser and become "production-quality assets" from "a repeatable development-time art pipeline (Blender/Python/Geometry Nodes or equivalent tested tool)", with real mesh detail, bevels, mapped tiling textures (colour, normal, roughness), standards for scale and pivots, and a manifest of sources and licences. [G-0003](G-0003-procedural-assets-first.md) had chosen assets generated at load, in the game's own code, because no art tool was available to the session. How is the art made now?

## Decision

1. **Blender, driven by scripts in this repository** (`gaming/art/`). The founder was asked on 25 November 2026 whether Blender might be installed on the machine and answered "Install Blender"; it was installed with Homebrew (5.3.0, the official build). Every asset is a script; running the script makes the asset. Nothing is modelled by hand in the program's windows, so nothing exists that the repository cannot make again.
2. **Textures are painted by arithmetic** in the same scripts: tiling sets of base colour, tangent-space normal and roughness for plaster, barrel tile, coursed stone, planks and earth. No photograph and no downloaded texture is used, so there is no licence to check but our own.
3. **Meshes are built of bevelled parts in real metres**, each mapped in its own frame, so that textures keep their true size and a plank's grain runs along the plank. Exported as glTF with tangents, textures beside the model as JPEG.
4. **The outputs are media and stay out of git** (`gaming/media/models/`, ignored, like the music). What is committed is the source and `gaming/art/manifest.json`: for each asset its scripts' checksums and every output's size and SHA-256. A test fails if a script changes without the manifest being renewed.
5. **A preview render, lit, is made by the same script** and kept as evidence, so that an asset can be judged before it is put in a game. The mandate asks for five such previews before any mass generation.
6. G-0003 stands for what it covers: scenery that is drawn thousands of times (trees, crops, plots of the plain) and anything the game must shape from its own state stays generated in code. Hero buildings come from this pipeline.

## What was found doing the first one

- The watermill: 16,172 triangles in six objects, the wheel its own object on its axle; 5.5 MB with fifteen shared texture files. Two runs on the same machine gave byte-identical textures. Whether another machine or another Blender gives the same bytes is not known.
- Blender's own exporter writes tangents only for triangles, so every part is triangulated on export.
- The first render showed a fault no test would have: a round door cut through two materials left a ring of the wrong one. The door is now built in its arch of stones and not cut.

## Not decided, not done

- **Loading these in the game.** The valley still draws its code-made mill. Loading glTF under the games' content security policy, hosting the models beside the music, and what the game shows while a model loads are the next change.
- Levels of detail, collision shapes, compressed GPU textures.
- **Figures.** Rigged people and animals with walk and work cycles are asked for by the mandate and are a different kind of work; nothing here makes them.
- Who judges the result. The author made it and has looked at it; that is not a review.
