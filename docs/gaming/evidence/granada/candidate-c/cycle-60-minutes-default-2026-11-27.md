# Granada, sixty-minute repeated-action memory profile — default palace

27 November 2026. `gaming/tools/granada-palace-cycle.ts` run for sixty minutes against the
default palace (the lighter making of Candidate C, served from `granada/p1/`), seed 7,
medium preset, on the developer's machine (16 cores, 32 GB, Apple metal-3 GPU — **not** one
of the minimum machines; passes no gate). The machine was busy, so frame times are recorded
in the JSON but are **not** performance evidence.

## What was measured

The cycle tool reloads the game repeatedly and plays it (a field choice per round where the
game allows), measuring the renderer after every action: 155 rounds across 52 page loads in
sixty minutes. Raw figures: `cycle-60-minutes-default-2026-11-27.json` in this folder.

## Results

| measure | first | last | min | max |
| --- | --- | --- | --- | --- |
| geometries | 164 | 164 | 164 | 164 |
| textures | 59 | 59 | 59 | 59 |
| draw calls | 328 | 328 | 328 | 328 |
| triangles | 3,949,245 | 3,949,245 | 3,949,245 | 3,949,245 |
| JS heap, MB | 182.6 | 189.2 | 179.9 | 244.5 |
| listeners | 77 | 51 | 51 | 133 |
| workers | 0 | 0 | 0 | 0 |
| intervals | 1 | 1 | 1 | 1 |
| audio contexts | 0 | 0 | 0 | 0 |

- Model failures: **0** in all 155 rounds. Console errors: **0** in the whole run.
- GPU-side counts (geometries, textures) are **flat to the digit** across 52 page-load
  generations of the same scene — no geometry or texture leak over repeated play.
- The heap oscillates in a 65 MB band (179.9–244.5) with no monotonic climb: the mean of the
  first three loads is 194.8 MB against 201.4 MB for the last three, a 6.6 MB drift over the
  hour inside the oscillation band, and the final round sits at 189.2 MB, below the mean of
  the first load. The heap figure is the browser's own and falls when it collects; nothing
  here indicates a leak.
- Listeners oscillate 51–133 with the game's state (they rise as the valley fills with
  interactive things and fall when panels close or the page reloads); the final round reads
  **51, below the first round's 77** — no monotonic accumulation.
- No audio contexts are created and no nodes are made with `music=off`, as expected.

## Reading

No evidence of a memory or listener leak in Granada's renderer or its palace loading over an
hour of repeated play with the default palace. This extends the ten-minute repeated-state
result (`cycle-10-minutes-default-2026-11-27.md`) from static repetition to active play, and
matches the Golden Age soak result (`docs/gaming/evidence/golden-age/soak/`).

Not measured here: frame times on a quiet machine (this machine was busy), the minimum
machines, and the other palace art sets (`a`, `c`, `c1`, `c2` — one set per run; the default
is the live configuration).
