# The other games are paused while Hudhud is built

_26 November 2026. The founder's instruction, section 0: Hudhud has sole game priority; Granada, The Golden Age, Atlas and every planned game are paused, with everything preserved and a clear point to resume from. Nothing of theirs was deleted, unpublished or rewritten by this work._

| Game | Status | Where it stands | Resume from |
|---|---|---|---|
| **Granada** | prototype, on `main` and on UAT | Its art evaluation stopped mid-way. Two draft pull requests are open and are not to be merged while it is paused: [amado2k5/islam-museum#8318](https://github.com/amado2k5/islam-museum/pull/8318) (`gaming/granada-review-flags-claude`, head `f432170ee24`: the founder's fourth decision recorded, eight review findings corrected) and [amado2k5/islam-museum#8319](https://github.com/amado2k5/islam-museum/pull/8319) (`gaming/granada-palace-c-preview-claude`, head `427c246bd1d`: the Candidate C palace behind `?art=c`). Devin's [#8312](https://github.com/amado2k5/islam-museum/pull/8312), [#8320](https://github.com/amado2k5/islam-museum/pull/8320) and [#8321](https://github.com/amado2k5/islam-museum/pull/8321) are open and are the founder's and Devin's | the pause note at the end of `islam-museum-coordination/granada/claude-status.md` (what was not done: the ten-minute repeated check, quiet-machine frame times, palace levels of detail, the vegetation survey, a UAT preview, the recommendation); [`../LEDGER.md`](../LEDGER.md); [`../games/granada.md`](../games/granada.md) |
| **The Golden Age** | prototype, on `main` and on UAT | three chapters playable; no work in flight | [`../games/golden-age.md`](../games/golden-age.md); [`../LEDGER.md`](../LEDGER.md) |
| **Atlas** | prototype, on `main` and on UAT | daily game and practice; picture rounds designed, not built; no work in flight | [`../games/atlas.md`](../games/atlas.md) |
| The eight planned games | planned | nothing built | [`../spec-v2/`](../spec-v2/) |

**They stay in regression.** Every check of the platform still runs all of them: the workspace's 508 tests (354 are theirs), the release build of four games, the smoke run that starts each in Arabic and English behind the Worker's headers, and the Worker's 38 tests. All passed with Hudhud added on 26 November 2026.

**What Hudhud touched that is shared**, and why each is the smallest change: listed in [architecture](architecture.md#changed-in-the-shared-platform-the-smallest-that-works). No file under `gaming/games/granada/`, `gaming/games/golden-age/` or `gaming/games/atlas/`, and no `gaming/tools/granada-*.ts`, was changed.

**The narrow exceptions** under which another game may be touched while paused: a fix to shared platform code, security, data integrity, a production incident, or a regression Hudhud caused. Each is written here with its reason.

| Date | What was touched | Why |
|---|---|---|
| 26 November 2026 | `games/granada/index.html`, `games/golden-age/index.html`, `games/atlas/index.html` (the script each page loads, and one stylesheet link) and a new `src/ui/gate.ts` in each | The founder's directive, section 9: every game stands behind the shared device check. No rule, picture, string or save of those games changed; their tests and the release smoke pass |
| 26 November 2026 | one line more in each of those three `src/ui/gate.ts` files (`backup: "<id>"`) | The directive, section 8: what each keeps in `localStorage` is backed up to the vault and put back if it goes missing. Their own saving code is untouched |

**UAT** serves release `20261126-63e2fd9dc25` since 26 November 2026: the three earlier games, their code unchanged from the release before, and Hudhud as the fourth. The regression scenarios of the three passed there after it, 12 of 12.
