# The Golden Age: a ten-minute soak over constant rebuilding, 27 November 2026

`gaming/tools/golden-age-soak.ts` played the first chapter with the balanced policy at a player's pace — one season
about every twenty seconds — so the district was built and its plots rebuilt through ten minutes: 57 commands across
24 seasons, ending in the chapter's win, after which the board rendered on in the steady state. Every half minute the
renderer's own counts and the browser's heap and listeners were written down. The machine was the developer's own,
serving itself, with other work running; frame times were therefore not measured, and the question this answers is
the memory one: does the merged-static renderer's constant re-concatenation leak?

## What it shows

- **Geometries held level at 42–43 from the fourth minute on** (37 at the first sample, before the authored
  buildings arrived), through every plot rebuild the 57 commands caused. A leak in the merge path — which disposes
  a material's district mesh and makes one again on every change — would show as this count climbing; it does not.
- **Textures flat at 50** throughout.
- **Listeners flat at 22** throughout.
- **Heap oscillated 66.7–92.5 MB with no trend** (the browser collects when it chooses).
- Draw calls rose 80 → 108 as the district gained content — the smoke, lamps, carts and walkers arriving with the
  first market — not with time; triangles rose with the building and froze at the win, exactly as they should.
- 0 page errors; 0 model failures — the five authored buildings loaded and stayed.

This is one machine and ten minutes, evidence rather than a pass: the four-hour soak and the quiet-machine and
minimum-machine measurements the palace record calls for remain open, and they are Granada's gates as much as they
are this game's.
