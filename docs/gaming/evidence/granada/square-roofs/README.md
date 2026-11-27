# Square hipped roofs, 27 November 2026

Blender 5.3.0 re-exported the full palace and both lighter makings after `hip_roof` was changed so that a square plan makes triangular slopes to one point instead of four-sided slopes whose two ridge ends occupy the same place.

## Measured counts

| file | triangles before | triangles after | exact zero-area roof triangles before | exact zero-area roof triangles after |
|---|---:|---:|---:|---:|
| `granada/c/palace.gltf` | 214,166 | 214,110 | 56 | 0 |
| `granada/c/palace-lod1.gltf` | 69,676 | 69,620 | 56 | 0 |
| `granada/c/palace-lod2.gltf` | 19,964 | 19,940 | 56 | 0 |
| `granada/p1/palace.gltf` | 69,676 | 69,620 | 56 | 0 |

The full palace also carries two exact zero-area triangles in `plaster_red`, before and after; they are not part of the square-roof defect and were not changed. Measured with a stricter near-zero area threshold, the full palace has 31 very small collinear slivers before and after, produced around the weathering cuts; they are unchanged by this repair. The lighter makings have none after the repair.

## Positions per material

The full palace and LOD1 have exactly the same unique vertex positions per material before and after (rounded to six decimal places for comparison); only the collapsed roof triangles were removed. LOD2's input is the same repair, but its disclosed temporary benchmark decimation is sensitive to the removed triangles: most positions are unchanged, while the decimator produced small numbers of different vertices (`stone`: 64 before-only and 108 after-only; `rooftile`: 69 before-only and 37 after-only; other materials 8–21 before-only and 11–21 after-only). This is recorded rather than hidden; LOD2 remains a temporary benchmark decimation, not final art.

Detailed comparison: [`positions-2026-11-27.json`](positions-2026-11-27.json). `granada/p1/palace.gltf` has the same positions as the repaired LOD1 export and borrows the first set's textures as before.
