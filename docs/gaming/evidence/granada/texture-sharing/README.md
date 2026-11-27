# Granada texture sharing measurement, 27 November 2026

Measured on the developer's machine in Chrome 158.0.8127.38, 1920×1080, Medium, seed 7, the default palace (`granada/p1/`). The machine was busy with another agent's test run, so the frame times in the JSON are not evidence of performance cost; the renderer's texture count is the figure being compared because it is a count, not a timing.

| | renderer textures | draw calls | triangles | geometries | models | model failures |
|---|---:|---:|---:|---:|---|---:|
| before | 71 | 307 | 2,884,514 | 144 | 4 | 0 |
| after | 59 | 307 | 2,884,514 | 144 | 4 | 0 |

Measured reduction: **12 renderer textures**. The same four models loaded in both runs (`granada/town`, `granada/landmarks`, `granada/palace`, `granada/mill`), with no model failure and no console error. Reports: [`before-2026-11-27.json`](before-2026-11-27.json), [`after-2026-11-27.json`](after-2026-11-27.json).
