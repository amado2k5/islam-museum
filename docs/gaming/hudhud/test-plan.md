# Hudhud: test plan, acceptance so far, risks and known defects

_26 November 2026. What was run is listed with its result. What was not run is listed as not run._

## Run on 26 November 2026, on the founder's Mac (M4 Max, macOS 27.2.1, Node 25.4.0, Chrome 158)

| Check | Result |
|---|---|
| `npm --prefix gaming test` | **32 files, 533 tests, all pass** (151 are Hudhud's own, in ten files; 28 are the shared platform's: 9 of the device check, 12 of the save vault and 7 of the backup; the two shared tests of labels and review marks now cover four games) |
| `npm --prefix gaming run typecheck` | pass |
| `npm --prefix gaming run strings` | pass: Hudhud 7 languages, 300 strings, and 60 names of worlds and subjects |
| `npm --prefix gaming run build:release` | pass: four games; Hudhud 1,456,166 bytes of script, 7,238 of style |
| `npm --prefix gaming run check:release -- --allow-dirty` | pass: the release matches its manifest |
| `npm --prefix gaming run release:smoke` | pass: all four games start in Arabic and English behind the Worker's own headers; no policy violation, no request to another origin |
| `node --test workers/games/test/*.test.mjs` | **38 tests, all pass** |
| `gaming/tools/hudhud-play.ts`, seven runs | all passed with no console error when first run: en at Low, Medium and High (1920×1080), en Challenge (1280×800), ar (1280×800), ur Story (390×844), id (844×390). **The two phone-size runs can no longer be made**: since the device check, a screen under 1280×800 is refused before the game starts (seen again on 26 November 2026: the run at 390×844 stops at the device message). Run again after the deeper puzzle and the movement change: en Explorer (1920×1080), ar Challenge (1920×1080), ur Story (1280×800), all pass |
| `gaming/tools/hudhud-rebuild.ts 12 medium` | memory level after twelve rebuilds |
| `gaming/tools/hudhud-checks.ts` | twenty-six checks pass in Chrome (the newest, which does not skip the opening: a new visitor meets the opening story before the Atlas, reads its five panels by the buttons and by the arrow keys, finds the alt text of each picture and "Begin" on the fifth, begins, and is not shown it again after a reload; "Read the opening again" shows the first panel and Escape leaves it; Skip records it too; a page opened with `autostart=1` shows none and records nothing; and on an Arabic page the page runs right to left and the left arrow goes forward; every other check leaves the opening by pressing its Skip button, and the two that this touched, the skip link and the three puzzles, now say which screen they are on; before it, the two newest: the elephant clock left in the middle is kept and comes back as it was, the flying quest's own place is left alone by a clock with no progress, and one click on the picture's places and spare part changes the clock; a finished clock is not kept, and the flying quest still starts; before them: the elephant clock is played to its end with the page's own controls, a wrong row stops and says where, all four goals are met, the finish is in the save and the Atlas counts it; before it: the three ways of playing are three puzzles, of 5, 6 and 7 mirrors, with a third position outside Story, and Challenge's page in words says only where the beam ends; before it: no texture is wider or taller than 2048 pixels at any preset, no prism is drawn, and the scholar's words carry the mark "Imagined words, not a quotation"; before it, the newest: progress is in the vault, outlives a wiped `localStorage`, shows as saved, and travels by export and import into a fresh browser, with an altered file refused; before it, the newest: with scripts off the page says why in seven languages, and on a refused device the skip link lands; before it, the three newest are of the device check: [`../device-preflight.md`](../device-preflight.md); the rest: the ten below, and: a tab opened earlier takes up what another tab saved and wipes nothing; the skip link lands on the game; pause and go on in seven ways, after each of which the game still answers; the explorer is the same in the settings and on the Atlas before a quest, after one and after a reload; a stand-in controller goes on and back in a talk, pauses and flies): a quest left in the middle comes back after the page is loaded again; a finished quest is recorded and not offered as unfinished; a key given to an action works and is remembered; a redraw keeps the quest; with WebGL refused the quest is finished from the list in words; a page closed in the middle of a talk keeps the last step; each save slot keeps its own place; the Atlas shows ten worlds and fifty pages and one comes home, in English and in Arabic |
| The museum's `npm run validate`, `npm test`, `npm run build` | **not run**: no museum file (`data/`, `content/`, `site/`, `i18n/`, `schema/`) is changed; the games' rule sends a change confined to the games to the games' suite |

## What the 114 tests hold

| The instruction asks (section 12) | Test | State |
|---|---|---|
| Every source asset and subject maps exactly once | `atlas.gtest.ts` | held: 80 files, 50 subjects, 30 + 10 + 10, ten worlds of five, every record id a file |
| Every quest has a start, a completion, a recoverable failure and a replay | `scene.gtest.ts` | held for the workshop, in three styles; the elephant clock has a start, a completion, recoverable failures and "Play again" (`clock.gtest.ts`), and **is kept when left in the middle** (`restoreClock`, tested for every kind of bad snapshot); wrong turns never end it; `replay()` is deterministic |
| Deterministic challenges solvable over many seeds | `light.gtest.ts`, `chain.gtest.ts` | held: 3,000 generated beam puzzles start dark and can be lit; 3,000 generated chains start in a muddle and can be put right |
| No soft lock; no secret required for completion | `scene.gtest.ts`, `light.gtest.ts` | held: all 32 mirror settings can reach the answer; the shortest road needs no secret |
| Jump buffering, coyote time, gliding at low and high frame rates | `move.gtest.ts` | held at 30, 60 and 144 frames a second. Moving platforms and hazards: none exist |
| Dialogue conditions, choices, keys, no invented quotation | `dialogue.gtest.ts` | held in seven languages. RTL layout is checked by capture, not by a test |
| Save round trip, corruption, newer save, no storage, slots | `save.gtest.ts` | held. Migration "from every released version": nothing is released, so the table is empty and a test requires it to be filled when a version is added |
| Scene lifecycle and disposal, pause, context loss | `hudhud-play.ts`, `hudhud-rebuild.ts` | exercised in the browser, not asserted by a unit test |
| Keyboard, touch, gamepad, remapping | `hudhud-play.ts`, `hudhud-checks.ts`, `pad.gtest.ts` | keyboard and key remapping exercised; the gamepad layout and its remapping tested as rules and through a stand-in for the browser's gamepad interface; **no physical controller has been connected**; the on-screen buttons and tapping a mirror are not driven by a tool |
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
- Production: nothing of Hudhud is there. (UAT: released 26 November 2026 at the founder's word and checked there in seven languages with `gaming/tools/hudhud-uat.ts`; no rollback has been rehearsed with Hudhud in the release.)
- A Hudhud case inside `release:regression`: the regression tool was run on UAT for the other three games and passed; Hudhud is checked on a host by its own tool, `hudhud-uat.ts`, and is not yet one of the regression matrix's scenarios.

## Risks

| # | Risk | Likelihood | What it costs | What is being done |
|---|---|---|---|---|
| 1 | The code-drawn look is not accepted | high | no art for 50 subjects without people or an approved tool | the art bible's routes B to D; figures built as replaceable parts |
| 2 | No historical reviewer is named | certain today | nothing can be called reviewed; a quest may need rework after review | every claim in the ledger as pending; invention labelled; the game says so |
| 3 | Machine translations read by nobody | certain today | wrong tone or meaning for children in six languages | marked as drafts; the Arabic-first rule to be restored; a native read needed before any release beyond UAT |
| 4 | Scope: 20 to 30 hours from a few minutes | high | a game that is wide and shallow, or never finished | twelve systems for fifty quests; a world at a time; the estimate in the design page |
| 5 | Performance on the 8 GB reference machines | unknown | High or Medium may not hold 60 frames a second | three presets with the same play; Low is 20 MB of textures and 15 draw calls; not measured there |
| 6 | Title clash with the game Atlas, and an unrun title search | certain / unknown | confusion on the Play page; a name that cannot be used | "Working title" on the page; options in the design page; the founder's decision |
| 7 | One 3520×1440 texture at High | gone | — | fixed 26 November 2026: no texture exceeds 2048 pixels at any preset, and a browser check holds it |
| 8 | Phone play is cramped | certain | children on phones struggle | a full-screen landscape mode in the slice |
| 9 | Details from the thumbnails that no record supports | the prism is gone; others will come with each subject | a museum game showing an unsupported detail | the prism was taken out on 26 November 2026; each quest's dossier is to list what its pictures show that no record supports before the quest is written |
| 10 | Two agents and two sessions in one repository | medium | overwritten work | own branch; shared files changed by the smallest edit; the coordination board |

## Known defects and rough edges (golden scene)

| | |
|---|---|
| D1 | Fixed 26 November 2026: a quest left in the middle is kept (mirrors, turns, what was found, the curtain) and offered as "Continue". The bird's place is not kept: it returns to the door |
| D2 | The Storykeeper walks in front of furniture and the cat, and through the scholar; she has no path of her own |
| D3 | Figures face one way and are mirrored: asymmetric details flip |
| D4 | Fixed 26 November 2026: the dark room's picture now falls on the drawn curtain, the side opposite the hole (ledger HR-HH-06) |
| D5 | After a lost graphics context, or a change of effects preset or of the explorer's look, the picture is redrawn and the bird returns to the door; the quest itself is kept (it was lost before the review of the first pull request found it) |
| D6 | The page's status line for the beam is announced politely on every turn; whether that is too much or too little for a screen-reader user is untested |
| D7 | On a phone held sideways the title bar takes the first screen and the picture is one scroll down; "Full screen" helps where the browser has it |
| D8 | Moods change only the crest and an arm; faces do not change expression |
| D9 | The settings sheet's "Text speed" reuses the word for the Medium effects preset as its middle option |
| D10 | Fixed 26 November 2026, found by an independent play of UAT: after pausing and going on from the toolbar the game stayed frozen (a flag for "a sheet is open" was left set). Pausing is now one function and "a sheet is open" is read from the page |
| D11 | Fixed the same day, same source: an explorer changed in Settings was not shown on the Atlas until its own button was pressed. Every change now redraws the Atlas's choice |
| D12 | Fixed the same day, same source: the controller could not advance a talk (it was read only while the world moved, and its "next" button was sent as "back"). Found while fixing it and also fixed: Escape inside a sheet both closed the sheet and toggled the pause |
| D13 | Fixed 26 November 2026: the toolbar stands above the sheets, so its own buttons can be reached with a mouse while one is up |
| D14 | Fixed 26 November 2026: the prism, which no record read for the scene supports, is out of the scene (the founder's directive, section 11); the beam falls on the page directly |
| D16 | Fixed 26 November 2026: the puzzle was the same five two-position mirrors in every way of playing, too shallow for older players (the founder's directive, defect 5). Explorer and Challenge now have a third position (laid flat, the beam passes), mirrors that must be left out of the beam's road, and in Challenge seven mirrors that all start wrong (ten turns at the least) with a page in words that names only the beam's end. Whether this is the right depth for ages 10 to 17 is **untested**: no child has played it |
| D23 | Fixed 26 November 2026: the picture of the elephant clock could not be played. A click or a touch on a place chooses it (with a ring drawn round it, not colour alone), a second click on another place exchanges the two, a click on a spare part in the box stands it there, and a click on the chosen place lets it go. Every exchange is an ordinary "put" move, counted once, and the lists stay in step. The lists remain the way for the keyboard and screen readers. Not tried: a real touch screen, a right-to-left page by mouse, the two spare parts' look on a small screen |
| D22 | Fixed 26 November 2026: a clock left in the middle started again. Its places, its moves and its questions asked are now kept, and the Atlas says "Continue" for it, with the note and the button to start again. The slot holds one place only: a clock with a move or a question asked takes it over from the flying quest, a clock with none leaves it alone, and a finished or restarted clock clears only its own. The flying quest no longer wipes the clock's place when it finishes or restarts. **One gap left**: if the very last move makes the clock work and the player leaves before setting it going, the saved place is refused (a working row is a finished quest), so the clock starts again; this is by the rule asked for and was not changed |
| D21 | Fixed 26 November 2026, seen on UAT in Arabic: the clock's picture ran left to right on a right-to-left page while its lists ran right to left. The bench is now laid out the other way round in Arabic and Urdu. The UAT release `20261126-709707701f2` still has the fault |
| D20 | The elephant clock quest (added 26 November 2026) is a first trial: played with five lists of choices and a simple picture, checked in the browser in English, and in Arabic on UAT (one play through its commands and a look at the page); the other five languages only by the string check; the picture can now be played by a click or a touch (checked in Chrome with the mouse only, in English: no touch screen and no right-to-left page driven; the hit test is unit-tested in both directions), and the clock left in the middle is kept (see D22 and D23); the translations are machine drafts (five of the seven by a cheaper model, read once by the agent) |
| D19 | Fixed 26 November 2026: Settings could be opened a second time on top of itself from the toolbar; a sheet that is open is now shown again instead. The import check in the browser tool also clicked before the confirmation had opened (a fault of the check, fixed) |
| D18 | Changed 26 November 2026 after the independent review said a short press of Right carried the bird far: on the ground it now stops within 15 pixels from full speed (it was 19) and a tenth-of-a-second tap moves it under 25; in the air, letting go carries it under 35 pixels (it was 66). These are numbers from the rules, pinned by a test; **no player has yet said whether it feels right** |
| D17 | Fixed the same day, found by a browser check: the message at the foot of the page lay over buttons and swallowed their clicks while it showed; it now lets them through |
| D15 | Fixed 26 November 2026: pictures wider than 2048 pixels are uploaded as columns; the largest texture is 2000, 2045 and 2046 pixels at Low, Medium and High (it was 3520 at High) |
