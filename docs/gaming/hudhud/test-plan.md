# Hudhud: test plan, acceptance so far, risks and known defects

_26 November 2026. What was run is listed with its result. What was not run is listed as not run._

## Run on 26 November 2026, on the founder's Mac (M4 Max, macOS 27.2.1, Node 25.4.0, Chrome 158)

| Check | Result |
|---|---|
| `npm --prefix gaming test` | **25 files, 453 tests, all pass** (99 are Hudhud's own, in six files; the two shared tests of labels and review marks now cover four games) |
| `npm --prefix gaming run typecheck` | pass |
| `npm --prefix gaming run strings` | pass: Hudhud 7 languages, 190 strings, and 60 names of worlds and subjects |
| `npm --prefix gaming run build:release` | pass: four games; Hudhud 1,456,166 bytes of script, 7,238 of style |
| `npm --prefix gaming run check:release -- --allow-dirty` | pass: the release matches its manifest |
| `npm --prefix gaming run release:smoke` | pass: all four games start in Arabic and English behind the Worker's own headers; no policy violation, no request to another origin |
| `node --test workers/games/test/*.test.mjs` | **38 tests, all pass** |
| `gaming/tools/hudhud-play.ts`, seven runs | all pass with no console error: en at Low, Medium and High (1920×1080), en Challenge (1280×800), ar (1280×800), ur Story (390×844), id (844×390) |
| `gaming/tools/hudhud-rebuild.ts 12 medium` | memory level after twelve rebuilds |
| `gaming/tools/hudhud-checks.ts` | twelve checks pass in Chrome (the ten below, and: a tab opened earlier takes up what another tab saved and wipes nothing; the skip link lands on the game): a quest left in the middle comes back after the page is loaded again; a finished quest is recorded and not offered as unfinished; a key given to an action works and is remembered; a redraw keeps the quest; with WebGL refused the quest is finished from the list in words; a page closed in the middle of a talk keeps the last step; each save slot keeps its own place; the Atlas shows ten worlds and fifty pages and one comes home, in English and in Arabic |
| The museum's `npm run validate`, `npm test`, `npm run build` | **not run**: no museum file (`data/`, `content/`, `site/`, `i18n/`, `schema/`) is changed; the games' rule sends a change confined to the games to the games' suite |

## What the 99 tests hold

| The instruction asks (section 12) | Test | State |
|---|---|---|
| Every source asset and subject maps exactly once | `atlas.gtest.ts` | held: 80 files, 50 subjects, 30 + 10 + 10, ten worlds of five, every record id a file |
| Every quest has a start, a completion, a recoverable failure and a replay | `scene.gtest.ts` | held for the one quest, in three styles; wrong turns never end it; `replay()` is deterministic |
| Deterministic challenges solvable over many seeds | `light.gtest.ts` | held: 3,000 generated puzzles start dark and can be lit |
| No soft lock; no secret required for completion | `scene.gtest.ts`, `light.gtest.ts` | held: all 32 mirror settings can reach the answer; the shortest road needs no secret |
| Jump buffering, coyote time, gliding at low and high frame rates | `move.gtest.ts` | held at 30, 60 and 144 frames a second. Moving platforms and hazards: none exist |
| Dialogue conditions, choices, keys, no invented quotation | `dialogue.gtest.ts` | held in seven languages. RTL layout is checked by capture, not by a test |
| Save round trip, corruption, newer save, no storage, slots | `save.gtest.ts` | held. Migration "from every released version": nothing is released, so the table is empty and a test requires it to be filled when a version is added |
| Scene lifecycle and disposal, pause, context loss | `hudhud-play.ts`, `hudhud-rebuild.ts` | exercised in the browser, not asserted by a unit test |
| Keyboard, touch, gamepad, remapping | `hudhud-play.ts`, `hudhud-checks.ts` | keyboard and key remapping exercised; the on-screen buttons and tapping a mirror are not driven by a tool; gamepad untested and its buttons fixed |
| Reduced motion, contrast, text size, non-colour clues | — | built; **no test or capture exercises them yet** |
| Release holds the game, status truthful, checksums | `build.ts`, `check-release.mjs`, `prototype-labels.gtest.ts`, `release-smoke.ts` | held |
| Website Play routes and menu | — | not built ([plan](website-plan.md)) |

## Not run

- Either physical reference machine (M1 MacBook Air 8 GB; Windows 11, i5-1135G7, 8 GB), at any viewport or pixel ratio.
- Any browser but Chrome on macOS: no Firefox, Safari, Edge, iOS or Android.
- A 60-minute profile; a four-hour soak.
- Any person playing: no child, parent, teenager, or Arabic or Urdu reader.
- A screen reader; an automated accessibility scan; a contrast measurement.
- A gamepad.
- UAT: nothing of Hudhud is released anywhere. A UAT release is the founder's word each time.
- `release:regression`, which runs against a deployed host and has no Hudhud case yet; one is to be added with the first UAT release.

## Risks

| # | Risk | Likelihood | What it costs | What is being done |
|---|---|---|---|---|
| 1 | The code-drawn look is not accepted | high | no art for 50 subjects without people or an approved tool | the art bible's routes B to D; figures built as replaceable parts |
| 2 | No historical reviewer is named | certain today | nothing can be called reviewed; a quest may need rework after review | every claim in the ledger as pending; invention labelled; the game says so |
| 3 | Machine translations read by nobody | certain today | wrong tone or meaning for children in six languages | marked as drafts; the Arabic-first rule to be restored; a native read needed before any release beyond UAT |
| 4 | Scope: 20 to 30 hours from a few minutes | high | a game that is wide and shallow, or never finished | twelve systems for fifty quests; a world at a time; the estimate in the design page |
| 5 | Performance on the 8 GB reference machines | unknown | High or Medium may not hold 60 frames a second | three presets with the same play; Low is 20 MB of textures and 15 draw calls; not measured there |
| 6 | Title clash with the game Atlas, and an unrun title search | certain / unknown | confusion on the Play page; a name that cannot be used | "Working title" on the page; options in the design page; the founder's decision |
| 7 | One 3520×1440 texture at High | certain | over the 2048 rule; may fail on small GPUs | cut the room in two before the slice |
| 8 | Phone play is cramped | certain | children on phones struggle | a full-screen landscape mode in the slice |
| 9 | The prism, and other details from the thumbnails, are not supported by records | certain for the prism | a museum game showing an unsupported detail | labelled in the note and the ledger; removable in one line |
| 10 | Two agents and two sessions in one repository | medium | overwritten work | own branch; shared files changed by the smallest edit; the coordination board |

## Known defects and rough edges (golden scene)

| | |
|---|---|
| D1 | Fixed 26 November 2026: a quest left in the middle is kept (mirrors, turns, what was found, the curtain) and offered as "Continue". The bird's place is not kept: it returns to the door |
| D2 | The Storykeeper walks in front of furniture and the cat, and through the scholar; she has no path of her own |
| D3 | Figures face one way and are mirrored: asymmetric details flip |
| D4 | The wall picture of the dark room is on the back wall near the reading stand, not on the wall opposite the hole (ledger HR-HH-06) |
| D5 | After a lost graphics context, or a change of effects preset or of the explorer's look, the picture is redrawn and the bird returns to the door; the quest itself is kept (it was lost before the review of the first pull request found it) |
| D6 | The page's status line for the beam is announced politely on every turn; whether that is too much or too little for a screen-reader user is untested |
| D7 | On a phone held sideways the title bar takes the first screen and the picture is one scroll down; "Full screen" helps where the browser has it |
| D8 | Moods change only the crest and an arm; faces do not change expression |
| D9 | The settings sheet's "Text speed" reuses the word for the Medium effects preset as its middle option |
