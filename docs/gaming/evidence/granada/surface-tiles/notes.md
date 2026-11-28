# The painted surface tiles' first look, 28 November 2026

Seven tiles painted by ChatGPT Codex to the museum's brief (draft, pending the founder's look) — lime plaster,
red-ochre rammed earth, rubble stone, clay roof tiles, weathered timber, river water and canal water — scaled to
1536 webp (2,227,608 bytes together) and answering the valley's own materials: plaster walls, roofs, wood, ashlar
and earth take the tile as their albedo in place of the procedural grain (the procedural normal stays), and both
waters keep their deep-to-shallow colours while the tile lends its brightness grain, drifting slowly with the
current. The tiles are not seamless as delivered, so the game mirrors them at their edges (MirroredRepeatWrapping)
rather than fixing the seams in the converter — the choice the prompt asked to be written down.

- `village.png`: the village's lime-washed walls, tiled roofs, doors and beams in the plaster, clay, timber and
  rubble tiles.
- `mosque.png`, `mill.png`: the mosque's stone and the mill's stone base and lime wash above it.
- `channels.png`, `pool.png`: the channels in the canal tile and the pool in the river tile, their painted grain
  drifting with the water.

Checked two ways on this machine: with the seven files served the renderer lists all seven under `models` and
reports no failures; with the same requests aborted the same poses render the procedural surfaces and each missing
file is named in `modelFailures` — the fallback the atlas set. A pixel diff of the paired captures shows the tiles
moving the picture where the surfaces are (mean absolute difference per channel 3–14, largest at the mill's stone
and plaster).

Measured on the tiles test page on this machine, tiles served: 500 draw calls, 7,477,159 triangles, 69 textures,
164 geometries, heap 219 MB, no model failures. The same page with the seven requests aborted: 500 draw calls,
7,477,159 triangles, 66 textures, heap 215 MB — draw calls and triangles unmoved, and each missing file named in
`modelFailures` with its surface procedural.

Not yet checked: the tiles on production, where the media path serves them like the skies' webp; frame times, as
the machine was not quiet; whether the rammed-earth tile reads well on the roads and garden beds that share the
`earth` material (it is an earthen surface, but it was painted as a wall — the founder's eye is the judge).
