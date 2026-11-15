# The build and deploy, before and after

A 36-second film (1920×1080, 30 fps) of the build and deployment speed work done with Claude Fable 5.2 in November 2026, built with [HyperFrames](https://hyperframes.heygen.com). Requested by the founder on 14 November 2026. It shares fonts, the mark and the sound effects with `marketing/trailer/` through symlinks under `assets/`; set that project's effect files up first (its README).

```bash
cd marketing/build-speed
node scripts/build-audio.mjs     # writes assets/audio/bed.wav
npm run check
npm run render -- --quality delivery -o renders/islam-museum-build-speed.mp4
```

## Every number and where it is from

All from `docs/engineering/45-build-deploy-review.md` and `docs/engineering/45-fable-5-2-improvements.md` unless noted. The comparison is production on the old code against UAT on the new code, same content, 12 and 13 November 2026; it is not a claim about what production runs today.

| On screen | Source |
| --- | --- |
| 202,253 pages | review §2, both build runs |
| The build took 3 h 34 min, heading for GitHub's 6 h job limit | review §1 and §2 (run 42911617876) |
| Every page scanned 147,712 edges about 8 times; 53 ms a page; 2 h 28 min of a 3 h build | review §3.1; improvements §2 |
| Each record page 53 ms to 7.5 ms | review §2 (runs 42911617876, 43300301847) |
| Rendering every page 3 h 6 min to 43 min | review §2 |
| The whole build 3 h 34 min to 1 h 22 min | review §2 |
| The deploy 3 h 13 min to 47 min | review §2 (runs 43330494209, 43334841849) |
| Publishing to R2 99 min to 42 min; 678 retries to 13; 307,693 and 441,087 operations | review §2 |
| The build artifact 456,579 files, 6.7 GB to 1 file, 1.15 GB | review §2 |
| The place map page 25 MB to 601 KB | commit `71866d7a80`, 11 November 2026 |
| Same site, byte for byte; 400 pages sampled | review §3.1 and §4 |

The bars and the two squares are drawn to scale. The film says "8 times" where the review says "about eight times".

## Review notes

- Sound was measured on the render (−13.5 LUFS, peak −1.0 dBFS), not listened to.
- `npm run check` passes with four reading-time warnings kept on purpose: the source captions and three short supporting lines are on screen for one beat group only.
- No vertical cut and no Arabic or Urdu cut yet.
