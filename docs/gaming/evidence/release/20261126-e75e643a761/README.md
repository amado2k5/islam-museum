# Production checks for release `20261126-e75e643a761`, 27 November 2026

Against `https://games.islam.museum`, live release `20261126-e75e643a761` (commit `e75e643a76193c9997bb27e235e214636609a3f3`), in headed Chrome 158.0.8127.38 on the developer's machine. These are production host checks, not performance measurements and not minimum-machine evidence.

| check | result |
|---|---|
| `release:regression` | 12 pass, 0 fail; the release pointer was unchanged from start to end; no console error or failed request |
| `uat-check.ts` Arabic (`ar`) | no problems in five game pages; all five started in 3D; Granada's four models loaded |
| `uat-check.ts` English (`en`) | no problems in five game pages; all five started in 3D; Granada's four models loaded |
| `granada-uat.ts` English (`en`) | 12 pass, 0 fail, 0 absent |
| `granada-uat.ts` Arabic (`ar`) | 12 pass, 0 fail, 0 absent |
| palace media readback | all 8 corrected palace files on the host byte-match the local files recorded in the art manifest |

Files: `release-regression.json`, `uat-check-chrome-ar.json`, `uat-check-chrome-en.json`, `granada-uat-en.json`, `granada-uat-ar.json`, `palace-media-readback.json`.

Not checked here: the other five languages for this release, either minimum machine, a phone, frame cost, memory/performance, or a human player.
