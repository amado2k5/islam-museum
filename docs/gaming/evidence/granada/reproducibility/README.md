# Palace export reproducibility, 27 November 2026

Blender 5.3.0 was run twice from the same unmodified full-palace source, with no rendering, to test whether the export is reproducible byte for byte.

## Measured result

| file | first SHA-256 | second SHA-256 | same? |
|---|---|---|---|
| `palace.gltf` | `2c1292a0f623d2a7edd90c30c8715bffc2d7368dc88f1b73c10b6e2072c3956b` | `2c1292a0f623d2a7edd90c30c8715bffc2d7368dc88f1b73c10b6e2072c3956b` | yes |
| `palace.bin` | `05be2f6560a333a3c027121d70086d485a23b5926feddff5a3ae36ff5ccce438` | `b4479038566c2027c038a4b061590ad10af0b29a8ab81db7f7f1fe92a40e7256` | no |

The binary was 24,568,700 bytes in both runs. In that pair the differing bytes were ordering only: the new mesh-level comparison found the same exact vertex positions, the same whole-attribute vertices and the same whole-attribute triangles in every material. It exited 0.

A later pair of mesh generations showed why byte reproducibility cannot be assumed even when vertex positions are unchanged: six marble triangles were triangulated differently about the same planar surface, while every marble vertex position was still present as the same exact multiset. Ten water triangles also differed when their whole vertex attributes were compared; their triangle positions were unchanged. The experiment's post-export ordering code was **not** merged: ordering the bytes cannot reconcile genuinely different triangulation, and hiding that difference would be worse than measuring it.

## What is now available

`gaming/art/compare_gltf.py` compares two glTF files as meshes rather than as bytes. For each material it reports exact vertex positions, exact triangle shapes, exact whole-attribute vertices, exact whole-attribute triangles, triangle/vertex counts and exact zero-area triangles. It exits:

- `0` when the whole-attribute triangle multisets are the same, even if the bytes are only ordered differently;
- `1` when those mesh multisets differ;
- `2` for a read or format error.

Example:

```bash
python3 gaming/art/compare_gltf.py first/palace.gltf second/palace.gltf --json comparison.json
```

This does not make the export deterministic and does not change any production model. It makes the difference measurable: a checksum mismatch is a byte-ordering fact, not by itself evidence that the palace's geometry or attributes changed.
