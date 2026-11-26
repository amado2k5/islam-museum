# The baseline for the corrective work, taken on UAT

_25 November 2026 (the evening, Toronto; 26 November UTC). Release on UAT: `20261125-7c31b7631c6`, read from `/_channel`. Tool: `gaming/tools/uat-check.ts`, which opens each address in a fresh browser context (no saved game of anyone's is touched), muted, on the author's machine (Apple M4 Max)._

| Browser | Languages | Addresses | Result |
|---|---|---|---|
| Chrome 158.0.8127.38 | en, ar, ur, fr, es, tr, id | Granada; The Golden Age, chapters 1, 2 and 3; Atlas | In every one of the 35: the game started, drew in 3D, showed the music control, played a track after a click (the host answered 206), and logged no console error |
| Edge 157.0.4341.60 | en | the same five | The same, in all five |

Both browsers report the same adapter for WebGPU: vendor `apple`, architecture `metal-3`, largest texture 16,384. Viewport 1440 × 900 at a pixel ratio of 1.

**What this is:** proof that the release on UAT starts and draws in two browsers on one machine, in seven languages, with what each run found kept as it was written (`uat-<browser>-<lang>.json`), and a capture of each English page.

**What it is not:** a playthrough (each page was opened, clicked once and left); a measurement of speed; a test of touch, of a reload without `fresh`, of a damaged or newer save, or of a hidden tab (those are in each game's own play tool, run on a development build, and are recorded in the ledger); any other machine, any Windows or Linux, Safari or Firefox; a person.

The same day, on a development build of the same code: `tools/granada-play.ts` and `tools/atlas-play.ts` passed in all seven languages (the reports are in [`../../granada/valley3d/`](../../granada/valley3d/) and the ledger), and Granada's table of 1,000 seeds was run again and came out as recorded (mender 99.5, builder 91.6, merchant 96.4, irrigator 100, idle 0, random 0).
