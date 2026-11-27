# Release 20261127-4a2ba00f1c9 — production read-back

Release `20261127-4a2ba00f1c9` (commit `4a2ba00f1c9`, the merge of #8426) is live at games.islam.museum since
27 November 2026, early afternoon UTC. It carries two merged items of the founder's look/performance/art lane:

- **#8425 — The Golden Age's district lives**: walker legs, ox-carts when markets stand, donkeys on the south bank,
  smoke from served workshops and baths, lamp flames over stalls, sky-reflecting water, thicker planting.
- **#8426 — The Golden Age's five public buildings authored in Blender**: market, bath, library, school, hospital,
  merging into the district's per-material meshes at zero extra draw calls.

## What was done, in order

1. Board note written before the release, as the release doc requires.
2. `games-media.yml` kind **models**, production: check run 46043711345 passed (82 files checked, the ten new
   golden-age files named as new); upload run 46044046357 succeeded.
3. `games-deploy.yml` production: check run 46044486239 passed against games build 46043459165 (the exact merge
   commit of #8426); the release run then made `20261127-4a2ba00f1c9` live.
4. Read-back: all five building files answer HTTP 200 on the host (`/media/models/golden-age/{market,bath,library,
   school,hospital}.gltf`).

## Read-back evidence in this folder

- `release-regression.json`: **12 of 12 scenarios pass** against the live host.
- `uat-check-chrome-en.json`: **no problems** (English; the five-language sweep of #8391 covers the host's checks
  per language, and this release changes no string).
- The PNG captures are the regression run's own.

Machine checks of prototypes, not a human review; historical review pending.
