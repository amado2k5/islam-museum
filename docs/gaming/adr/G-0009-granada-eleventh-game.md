# G-0009: Granada is the eleventh game, a lane of its own inside the gaming lane, built on what the first two games proved

_25 November 2026. Status: accepted for the Granada lane (the founder's package of the same day is the instruction). Two points in it are the agent's judgement and are marked so. Nothing here changes a file outside `gaming/**` and `docs/gaming/**`._

## What was asked

The founder supplied `granada-production-package.zip` on 25 November 2026 with the instruction to process it completely. It is an addendum to the Version 2 specification: one more standalone game, "Granada: The Last Kingdom of Al-Andalus", a strategy game of water, farming, trade, building, diplomacy and defence in a 1475-inspired Nasrid setting, with its own roadmap (G0 to G8) and 26 gates (GRA01 to GRA26). The package is copied to [`../spec-granada/`](../spec-granada/) after its 19 checksums were verified. It says of itself that it authorizes "a proposed product design, not a completed game or a live deployment", and that it "changes the catalogue from ten to eleven independent games".

## Decisions

1. **The catalogue is eleven games.** Present-tense statements of the platform's scope say eleven from this change on. Documents that record what was true on the day they were written (the M0 inventory, the M1 report, earlier ledger entries, the V2 specification itself) are not edited.
2. **Granada is a sub-lane of `gaming`, not a new top-level lane.** It owns `gaming/games/granada/**`, `docs/gaming/granada/**`, `docs/gaming/games/granada.md`, `docs/gaming/spec-granada/**` and `docs/gaming/evidence/granada/**`. Its gates live in [`../granada/acceptance.json`](../granada/acceptance.json) and extend R01 to R18; they replace none of them.
3. **Nothing already built is restarted or renamed.** Atlas and The Golden Age stay as they are. Granada is not The Golden Age renamed: The Golden Age is a district on a grid in an unnamed city of the classical period, told in chapters of seasons; Granada is a named kingdom on real ground, with money that moves between accounts, markets with two prices, goods that travel, and a fixed-step clock.
4. **Granada uses the engine and the shared packages that exist.** Three.js on WebGPU ([G-0002](G-0002-rendering-engine.md)) is not re-opened: the package asks for a comparison only "where unresolved", and it was resolved by measurement. The seeded generator ([G-0005](G-0005-determinism.md)), the world kit, the music ([G-0007](G-0007-music-and-audio.md)), the string checker, the play-tool pattern and the pinned-pack pattern ([G-0006](G-0006-atlas-content-pack.md)) are reused. What Granada needs that does not exist (a ledger, markets, transport, a fixed-step clock, terrain, construction) is built in its own directory first and moves to a shared package when a second game needs it, which is the rule the workspace already follows.
5. **The simulation is built before the picture.** The first Granada code is its money and goods ([G-0010](G-0010-granada-economy-kernel.md)), tested against the package's own arithmetic, because every error the package finds in its concept images is an error of arithmetic or geography, and those are cheap to get right first and expensive to retrofit. (Agent's judgement. The package's own order puts an art and renderer laboratory, G1, before the playable village, G2; the renderer laboratory already exists from M1, and what is new for Granada in G1 is terrain and the Granada look, which is the next piece of work after the village's rules.)
6. **History comes from museum records by id, and the concept images are evidence of nothing.** Granada's places come from the museum's coordinates through a pinned pack ([`../games/granada.md`](../games/granada.md)). The three images are read and corrected in [`../granada/g0-discovery.md`](../granada/g0-discovery.md); none is used as a texture, a background or a source.
7. **Priority, and what it costs.** The package asks that Granada be "the preferred flagship strategy demonstration where shared work can support it". Taking it up now means the eight V2 games not yet started stay not started for longer, and the open work on the two prototypes (a person playing them; The Golden Age's dominant trading strategy) waits. That is the founder's choice to make and he made it by sending the package; it is written here so that the cost is on the record. (Agent's judgement on one point: the first person to play Atlas and The Golden Age is still the most valuable next thing for the platform as a whole, and Granada's work does not replace it.)

**Added the same day, after this record was written:** the founder made the priority explicit in chat: Granada is the top priority and the first game in every list, it is to be carried through every stage, and the site is to gain a Play entry that leads to it. The cost named in decision 7 stands and is his decision. His words and what follows from them are in the ledger, "The founder's instruction on Granada".

## What the package asks that repository governance overrides

The package states its own order of precedence: repository governance first. Two lines in it are therefore read as follows, as in every earlier pull request of this lane.

- "No … protected-branch merge … without approval." The repository's rule is that an agent merges its own pull request after the gates pass and after a three-way merge with `origin/main` (decision record dec-20261108-185; `AGENTS.md`). Gaming-only pull requests, labelled `non-impacting`, are merged that way. Anything that touches the site, a Worker, a workflow, the publish lists or `_headers` is `submission-impacting` and is not started without the founder's sign-off with that label.
- "Use Fable Extra for G0/G1 … High for implementation." The session runs on the model and effort the founder selected in the app; the agent does not change them.

## Alternatives turned down

- **Fold Granada into The Golden Age as a fourth chapter.** The package forbids it in terms, and the two games' rules do not fit one another: The Golden Age has no money that can be reserved, no second price, no distance.
- **Start with the renderer and a scene that looks like the third image.** It would produce the thing the package warns against: a picture of a future game. The image's own numbers are wrong (see the discovery report), so a scene built to match it would have to be unbuilt.
- **A new top-level lane.** It would split one ledger, one evidence tree and one set of shared packages in two for no gain.

## Evidence

- Package verified: 19 of 19 files match `PACKAGE-CHECKSUMS.sha256`; the nested V2 archive has the same SHA-256 as the one verified for the first pull request and is not copied again.
- The discovery report, with what exists, what is missing and what waits for the founder: [`../granada/g0-discovery.md`](../granada/g0-discovery.md).
