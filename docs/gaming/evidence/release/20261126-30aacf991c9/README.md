# Production checks in five languages, 27 November 2026

Against `https://games.islam.museum`, live release `20261126-30aacf991c9`, in headed Chrome on the developer's machine. These are production host checks, not performance measurements and not minimum-machine evidence.

| language | `uat-check.ts` | `granada-uat.ts` |
|---|---|---|
| French (`fr`) | no problems in five game pages | 12 pass, 0 fail, 0 absent |
| Spanish (`es`) | no problems in five game pages | 12 pass, 0 fail, 0 absent |
| Turkish (`tr`) | no problems in five game pages | 12 pass, 0 fail, 0 absent |
| Indonesian (`id`) | no problems in five game pages | 12 pass, 0 fail, 0 absent |
| Urdu (`ur`) | no problems in five game pages | 12 pass, 0 fail, 0 absent |

Every report had an empty `problems` list. The five `granada-uat.ts` reports include the console check, so the console stayed empty in those runs. No problem was found; nothing was fixed in this pull request.

The production media files for the palace had been replaced before these checks (`games-media.yml` check run 45930170926, upload run 45930389021); no game release was started.
