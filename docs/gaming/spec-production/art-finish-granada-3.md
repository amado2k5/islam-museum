# Granada art finish, model set 3

_Made 26 November 2026 by Devin as a second proof candidate, from the handoff in [`../handoffs/devin-granada-art-2026-11-26.md`](../handoffs/devin-granada-art-2026-11-26.md). **These models are only in `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art/gaming/media/models/granada/3/` on one Mac. They are not in the game, are on no host, and the founder has not judged them.** The game still reads `granada/2/`; this document does not claim that set 3 matches the target._

## What was made

The handoff's twelve building pieces were made again by the Blender scripts with more architectural finish, and the existing watermill was carried through the same export and LOD treatment. No new kind of piece was made. Every object name, origin, front direction, outer bounding size and kit footprint of `granada/2/` is kept in `granada/3/`; `python3 gaming/art/compare_granada.py` reported an exact size delta of zero for every object. Every object also has one lower level of detail named `<object>-lod1`, with `lodOf` and `lodLevel` extras, at about one third of its triangles. The game does not read or choose those LOD objects yet. In particular, the present mill loader adds its whole glTF scene, so merely pointing it at this file without filtering would draw high and LOD objects together; integration needs a deliberate loader change by the game-code owner.

The generators are separated by kind. `granada_mill.py`, `granada_town.py`, `granada_landmarks.py`, `common.py` and `kit.py` are the unchanged set-2 baseline; the proof is made by `granada_mill3.py`, `granada_town3.py`, `granada_landmarks3.py`, `common3.py` and `kit3.py`. In `gaming/art/manifest.json`, `assets` remains the publishable set-2 baseline that the model publisher reads, while set 3 is recorded under `proofAssets` as local workshop evidence only. This keeps a proof folder present on one machine from becoming a requirement for publishing set 2.

In the table, triangles are the high piece in set 2, the high piece in set 3, then set 3's LOD total and ratio. Geometry bytes are the summed glTF accessor bytes for that piece, not the shared texture files. Size is width × depth × height in metres from the exported bounds; because the interface was kept, the set-2 and set-3 sizes are the same to the precision printed here. The mill's size is the union of its six separately exported objects, including the wheel below its axle.

| piece | what was added in set 3 | triangles 2 → 3 (LOD) | geometry bytes 2 → 3 | size, m |
|---|---|---:|---:|---:|
| house-a | tile ends and ridge caps, a stone string course, worn base stones and earth wash, a wooden balcony | 1,736 → 3,164 (1,054, 0.33) | 190,992 → 355,152 | 7.70 × 6.74 × 7.88 |
| house-b | the same roof and wall finish, a balcony, wing eave tiles, and clay jars in the yard | 2,016 → 3,748 (1,249, 0.33) | 222,144 → 417,936 | 10.70 × 6.96 × 8.24 |
| house-c | a screened wooden gallery, tile ends and ridge caps, string course and worn base | 1,416 → 2,448 (815, 0.33) | 158,256 → 276,192 | 5.30 × 7.14 × 9.88 |
| house-d | a lattice screen on the roof room, string course, worn base and storage jars | 1,356 → 2,040 (680, 0.33) | 149,064 → 229,920 | 8.60 × 7.83 × 6.68 |
| wall | string courses, corbels, arrow slits, worn base stones and earth wash | 352 → 952 (317, 0.33) | 38,976 → 108,192 | 10.00 × 1.90 × 8.70 |
| tower | string courses, corbels, arrow slits and a worn base | 948 → 1,684 (561, 0.33) | 104,760 → 193,008 | 6.50 × 6.50 × 13.70 |
| gate | string courses, corbels, arrow slits, worn base, and wooden leaves with iron straps inside the passage | 1,720 → 2,656 (885, 0.33) | 192,912 → 308,736 | 9.30 × 3.70 × 9.80 |
| scaffold | rope bindings at crossings and spare boards on the first lift | 972 → 1,492 (497, 0.33) | 92,616 → 153,840 | 8.12 × 1.64 × 9.02 |
| stall | cloth valances, jars, baskets and small crates | 212 → 1,100 (366, 0.33) | 21,432 → 123,216 | 3.10 × 2.27 × 2.70 |
| estate | a small farmhouse arcade, wall wear, press-screw and windlass detail, and more vessels | 3,472 → 5,400 (1,800, 0.33) | 372,576 → 595,872 | 28.60 × 19.32 × 8.96 |
| palace | court arch bands, timber screens, tower string courses and corbels, wall wear, pool steps and a pool lip | 8,656 → 14,616 (4,872, 0.33) | 945,408 → 1,642,080 | 78.80 × 55.80 × 36.80 |
| crane | a pulley, rope wound round the windlass, and two braces inside the old silhouette | 380 → 672 (224, 0.33) | 38,136 → 67,872 | 4.17 × 9.05 × 10.97 |
| mill | the existing authored mill was kept; its mesh order was canonicalized and retriangulated, two zero-area Boolean artifacts were dropped, its objects now carry LODs, and its export was made reproducible | 16,172 → 16,177 (5,391, 0.33) | 1,707,480 → 1,809,708 | 16.00 × 12.59 × 10.97 |

The high house pieces remain under about 4,000 triangles each, and the high palace remains under about 15,000.

Asset-file totals, including the shared glTF, binary and texture files recorded in `gaming/art/manifest.json`:

| asset | triangles 2 → 3 | recorded bytes 2 → 3 |
|---|---:|---:|
| `town.gltf` | 10,728 → 25,708 including LODs | 6,425,287 → 8,289,157 |
| `landmarks.gltf` | 12,508 → 27,584 including LODs | 8,446,078 → 10,216,100 |
| `mill.gltf` | 16,172 → 21,568 including LODs | 6,079,641 → 6,953,113 |

## Surfaces

No texture was downloaded for this work. The photographed surfaces remain the five public-domain Poly Haven sets already recorded in `gaming/art/sources.json`: white stucco, clay roof tiles, rustic stone wall, weathered brown planks and cobblestone floor, with the script's existing warm/red plaster and cobble variants. The earthen wash uses the pipeline's existing painted `earth` material rather than a new texture. `iron`, `water`, `dark`, `cloth`, `cloth_red` and `clay` are plain coloured materials, not downloaded or AI-generated textures. Blender's exporter repeated its warning that more than one shader-node texture image used a texture and that the glTF sampler would behave like the first one; the images exported and the comparison renders opened.

## Renders

Each piece is rendered alone at three-quarter view on neutral ground, 1600 × 1000, with set 2 at the left and set 3 at the right, in:

`/Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art/gaming/media/renders/granada-3/`

The renders are media and are not committed. They are evidence for a person to inspect, not proof of how the pieces will look in the game.

## Checks run

- `bash /tmp/repro_granada3.sh`: the three Blender export scripts were run twice with different `PYTHONHASHSEED` values; SHA-256 of all 56 files under `gaming/media/models/granada/3/` was identical after both rounds (`REPRO_GLTF3_IDENTICAL files=56 end=2026-11-26T12:00:02Z` after the generator split).
- `python3 gaming/art/compare_granada.py`: passed; names, origins, exact outer sizes and kit footprints agree, and every object has a `-lod1` object. Every size delta printed as `0 m`; LOD ratios printed as 0.33.
- `blender --background --factory-startup --python /tmp/validate_granada3_gltf.py`: passed (`VALIDATE_GLTF3_PASS`). The final files imported as 18 town mesh objects/25,708 triangles, 6 landmarks objects/27,584 triangles, and 12 mill objects/21,568 triangles.
- `npm --prefix gaming run art:manifest`: passed and recorded both model sets, with set 2 in `assets` and set 3 in `proofAssets`. `npm --prefix gaming run art:manifest -- --check` passed: the models on this machine are the ones the manifest records.
- Baseline separation check: the five set-2 generator files compare byte-identical with `origin/main`; a temporary export of all three baseline scripts produced 6 mill, 9 town and 3 landmarks mesh objects with no `-lod1` object. A temporary `granada_mill3.py` export produced 12 mesh objects, 6 of them `-lod1`, including `wheel-lod1`. Each proof script also defaults to `granada/3` when called without an output argument.
- Publishing-shape check: `modelsToPublish` from `workers/games/publish.mjs` accepted the manifest against `gaming/media/models` as 30 baseline files and selected no set-3 file. In a temporary tree with only set 3 present, `python3 art/manifest.py` preserved the three set-2 records rather than erasing them (`PRESERVE_CHECK_PASS`).
- `blender --background --factory-startup --python gaming/art/blender/render_granada_compare.py -- gaming/media/models/granada gaming/media/renders/granada-3`: passed after the final export cleanup; all 13 comparison PNGs were regenerated at 11:36–11:37Z and visually inspected in a contact sheet.
- `npm --prefix gaming test`: passed; Vitest reported 19 test files and 354 tests passed.
- `npm --prefix gaming run typecheck`: passed; TypeScript printed no errors.

The exact results are also recorded on the coordination board in `tests.md`.

## What script did not reach

- The detail is still procedural: repeated boxes, cylinders, prisms and automatic decimation. It does not have hand-carved ornament, undercut moulding, hand-shaped plaster unevenness or individually art-directed LODs.
- Wall plane variation is shallow and geometric. Dirt is a separate textured earthen strip rather than a weathering layer blended into the plaster texture.
- The LODs are Blender decimation at one third of the triangles. Their silhouettes and material seams were not hand-edited, and no game loader chooses them yet.
- The pieces were not seen in the running game, because wiring them in was outside this task. No frame time, memory use, draw-call count or gameplay interaction of set 3 was measured.
- No judgement is made here about whether the result reaches the founder's target picture. That judgement is the founder's.

## What would be needed to go further

1. The founder's visual judgement of the side-by-side renders and, if he wishes, of the models themselves.
2. A separate decision and implementation to load `granada/3/` or its LODs in the game; that belongs to the game-code owner, not this art task.
3. Measurement in the running game only after such wiring, including the two minimum machines required by the production rules.
4. For a further art step: hand-authored or artist-reviewed sculptural detail, weathering painted into texture maps, and art-directed LODs, subject to the project's licence and approval rules.
