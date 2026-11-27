# The Sierra strips' first look, 27 November 2026

The two AI-painted Sierra Nevada strips (ChatGPT Codex, to the museum's brief; draft, pending the founder's look)
drawn as one wide alpha-cut curtain east of the valley, in place of the code-made ridge that stood there before.
The curtain is one draw call; its texture is two 4096x768 webp files, 691,496 bytes together, scaled down on this
machine from the painted 8192x1536.

- `sierra-proof.png`: from the valley floor west of the town, looking east over the hill town and the palace. The
  painted range stands behind the palace hill, snow on the peaks, ochre below - the autumn strip, as the season was.
  The strip is not fogged (the range is famously sharp from Granada on a clear day); whether it should carry some
  haze is the founder's to judge with the rest of the art.
- `sierra-east.png`: from the palace hill looking west over the valley - the Sierra is behind the camera here and
  correctly absent. Visible in the far ground instead: the painted ground-detail atlas at distance, where the
  mirrored tiling reads as soft rings - a known draft limit of the tiles, recorded with the atlas's own evidence.

Measured on the sierra test page before this change, on this machine: 503 draw calls, 6,621,211 triangles, 65
textures, 163 geometries (that count already carried the ground atlas). After, same page: the strips add one mesh
and two textures. Frame times: not measured - the machine was not quiet.

Not yet checked: the winter strip's swap-in in the depth of winter (the swap is wired in `setSeason`); either strip
on production, where the media path had to learn webp first.
