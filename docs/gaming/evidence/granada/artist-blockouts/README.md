# Granada artist blockouts, 27 November 2026

Blender 5.3.0 made four simple box blockouts with `gaming/art/blender/granada_blockouts.py`. They are not game art and nothing in the game loads them. The glTF files are local, ignored media in `gaming/media/models/granada/blockouts/`; these renders are evidence copies.

- `estate-blockout.gltf`: one `estate` box, 28.4 × 19.4 × 9.06 m.
- `street-cluster-blockout.gltf`: eight houses in two rows, using only the real `house-a` to `house-d` footprints: 7.7 × 6.7 × 7.84 m, 10.6 × 6.8 × 8.2 m, 5.3 × 7.1 × 10.02 m and 8.7 × 7.9 × 6.4 m. The first use of each kind keeps the exact object name; repeats carry the exact piece in `game_piece` because Blender object names must be unique.
- `gate-wall-tower-blockout.gltf`: `gate` 9.3 × 3.5 × 9.8 m, one `wall` bay 10.0 × 1.9 × 8.7 m, and `tower` 6.5 × 6.5 × 13.7 m.
- `construction-site-blockout.gltf`: `scaffold` 8.0 × 1.7 × 9.0 m and `crane` 3.4 × 9.6 × 9.8 m.

Every box has its object origin on the ground at the middle of its footprint and carries the kit piece name plus footprint in glTF extras. The local renders were inspected: they read as plain boxes only, which is intentional for blockouts.
