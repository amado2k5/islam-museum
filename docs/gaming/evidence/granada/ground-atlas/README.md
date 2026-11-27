# The painted ground detail — first integration

27 November 2026. The nine ground tiles ChatGPT Codex painted to the museum's brief
(`/Users/ahmedabdelaal/Documents/islam-museum-game-art/granada/textures/`, prompts and checksums in its
`manifest.jsonl`) built into one atlas by `gaming/art/make_ground_atlas.py` and drawn on the valley's fields.
**AI-made, draft, pending the founder's look** — not yet the game's accepted art.

## What the game does with it

- One atlas, 2048x1536, twelve slots of 512 px (nine tiles and three spare), one file of 1,102,807 bytes,
  one texture in the renderer. Recorded in `gaming/art/manifest.json` as `granada/ground-atlas` with size and SHA-256.
- The plots of the plain draw the tile of their own kind as their albedo — green crops, young wheat, ploughed earth,
  stubble, orchard soil — with each plot's variety of shade, its rows and its hedges as before. The slot travels in
  the plot table's base-texel alpha, the shade in the row-texel's alpha (both were unused), tested in
  `games/granada/test/valley.gtest.ts`.
- The player's worked fields answer the crop as it changes: bare earth fallow or under the olives, green while wheat
  grows, gold when ripe, stubble once cut, vegetable beds for vegetables. The slot is a uniform on each field's soil
  material, updated where the soil colours were already updated.
- Off the plain the land keeps its own colours (rock, scrub, banks, gardens); the dry-grass tile lends only its
  brightness grain, clamped so an odd texel cannot scar a hill.
- The tiles are not seamless as delivered (their wrap edges differ by 10 to 22 of 255, where seamless would be
  under 3), so the mapping mirrors each tile inside its slot; the seam a mirror makes is a line of symmetry,
  invisible in ground cover. Noted for Codex's next round.
- Fallback: where the atlas cannot be fetched the land is exactly as before — palette colours and procedural grain —
  and `granada/ground-atlas` is named in `modelFailures`. Verified: the failure was recorded and the valley drew
  whole with the file withheld.

## Measured, before and after, same views, same preset (High, seed 7, the developer's machine — not a minimum machine)

| measure | without the atlas | with the atlas |
| --- | --- | --- |
| draw calls | 306 | 306 |
| triangles | 5,041,401 | 5,041,401 |
| textures | 63 | 64 |
| geometries | 163 | 163 |
| JS heap | 182 MB | 191 MB |

One texture added, nothing else moved; the heap difference is within run-to-run variation but consistent with the
atlas's pixels. Frame times not measured — the machine was busy. Pictures in this folder: `fields-close.png`,
`plain-wide.png`, `proof.png`.

## Honest limits

- Roads and banks carry no discrete signal in the land shader — their colours are continuous blends in the vertex
  colours — so the dirt-road and riverbank tiles are in the atlas but not yet geographically placed; the wild-land
  grain is the dry-grass tile everywhere off the plain. Recorded on the board.
- The painted tiles have their own rows; where they run against a plot's own row direction both read at once at
  some angles. Acceptable at draft; worth a second look if the founder accepts the set.
- Repetition: at 18 m a tile the mirroring hides the seams, but a very regular tile can still read as repeating on
  the widest views. Not measured beyond the pictures here.
