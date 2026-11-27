# Hudhud: accessibility, child safety, languages, history and assets — what is done and what is planned

_26 November 2026. A matrix of the instruction's sections 6 and 9 against the golden scene. "Done" means built and exercised by a test or the browser tool named. Nothing here has been checked by a person using assistive technology, by a child, or by a native reader._

## Accessibility and input

| Asked for | State | Evidence or gap |
|---|---|---|
| Whole scene playable by keyboard, no trap | **done** | arrows or A and D, Space, the down arrow, E or Enter, Escape; `hudhud-play.ts` flies and talks by keyboard; sheets keep Tab inside and close on Escape |
| Playable without the picture | **done** | "The scene in words": the beam's path as a sentence in a polite live region, a button to turn each mirror with its lean in words, a button to go to each thing; conversation is page text with a live announcement of each line |
| A spatial puzzle without the picture (al-Idrisi's scattered sheets, added 26 November 2026) | **built, not tried by anyone who cannot see it** | a real button for every place in the same rows and columns, each labelled in words ("Row 2, place 3: sheet 7"); pressing one holds it and pressing a second exchanges them; what an exchange did and where the seams stand are said in a polite live region; a table in a closed `details` gives the edges of every sheet in words (a coast, a river, a road, or nothing, and in which third of the edge); the three kinds of line differ by shape, and a seam that does not match is a dashed outline as well as red; touching two sheets in the picture does the same. Checked by `hudhud-checks.ts` in Chrome in English and Arabic, not with a screen reader |
| Comparing copies without the picture (Karima's copies, added 27 November 2026) | **built, not tried by anyone who cannot see it** | a table of real buttons in the picture's own rows and columns (two or three copies, twelve to twenty places), with a caption and row and column headers; each button shows its sign's name and is labelled in words ("Copy 2, place 5: a ring", and ", marked as a slip" when it is), with `aria-pressed`; pressing one marks it or takes the mark away, and what happened is said in a polite live region ("Copy 1, place 3 agrees with another copy: not a slip."); the near-alike signs have names that tell them apart (a crescent open to the right or to the left, a star of five or six points); in the picture a marked slip is a dashed ring, so it is shape as well as red; pressing a sign in the picture does the same. On a right to left page place 1 is on the right in the table and in the picture, and the signs themselves are not mirrored, so their names stay true. The table is wider than the page with sixteen or twenty places and scrolls sideways inside its own focusable region (defect D40). Checked by `hudhud-checks.ts` in Chrome in English and Arabic, not with a screen reader |
| Pointer and touch, 44×44 px targets | **done** for the controls; **partly** for the picture | every button is at least 44 px (48 on a phone); tapping a mirror turns it; other things in the picture are reached with the Touch button when near, or from the list |
| Narrow and tablet layouts | **no longer reached**: since 26 November 2026 the device check refuses phones, tablets and windows under 1280 by 800 before the game loads ([`../device-preflight.md`](../device-preflight.md)). What was built before that: | captured at 390×844 (the goal above, the talk below the picture) and 844×390; playable, but a phone held upright shows a small picture. A "Full screen" button fills the screen where the browser allows a page to (not on an iPhone); it was built and not exercised by a tool |
| Gamepad, with reconnect and remapping | **built, not tested with a device** | the standard layout: lower button flies and goes on in a talk, right goes back a line, left touches, Start pauses; each can be changed in Settings; the controller is read while the world stands still, so a talk and a pause answer to it (before 26 November 2026 they did not: an independent review found it); where a talk offers choices, up and down move among them and the lower button picks one; the four direction buttons cannot be given to an action. A disconnect pauses and says so. Tested as rules and through a stand-in; **no physical Xbox- or PlayStation-style controller has been connected**, and no button glyphs are shown |
| Remapping of keys | **done for the keyboard** | Settings, "Keys": each action shows its keys; press its button, then a key; a key does one thing only; "put the keys back"; saved. `hudhud-checks.ts` gives J to flying and flies with it. Gamepad buttons are fixed |
| Visible focus | **done** | 3 px white outline with a dark halo on every control |
| High-contrast mode | **done, not measured** | a setting: black panels, white lines; contrast ratios have not been measured with a tool |
| Clues that do not depend on colour | **done** | a mirror's lean is shape and words; the beam's end is said in words; goals are words with a mark; Story's hint is a glow plus a sentence |
| Text size | **done** | 100% to 160%, saved |
| Text speed, dialogue log, back, skip | **done** | at once, slow, medium, fast; "What was said"; Back within a node; "Skip the talk". Auto-advance does not exist |
| Simple-language option, reading assistance | **not done** | planned (G-0014) |
| Reduced motion | **done** | follows the system setting, a setting of its own and `motion=reduced`: no camera glide, no dust or sparkle bursts beyond three, no bobbing, the curtain and the page change at once, text appears at once, "go to" places the bird without a flight; on al-Tusi's page (the ninth quest) the turning of the two circles is shown for about two and a half seconds with a Skip button, and with reduced motion on, whichever of the three ways it is asked for, the finished path is drawn at once and no turning is shown (mended 26 November 2026, later still: the elephant clock and the paper of Samarkand, which had followed the game's own setting only, now follow all three through the same helper, `calm` in `app.ts`, as the two circles do; one browser record times the clock's run with no signal, with `motion=reduced`, with the system preference and with the game's setting; added 27 November 2026: the Alhambra quest's water, shown running along the channels a step at a time (about 25 to 70 milliseconds a step), is handed the same `calm` helper and is simply there with any of the three, and one browser record shows it never runs with `motion=reduced`; added 27 November 2026, later: al-Razi's loose leaves share the paper's row page and so the same helper, a binding is shown a leaf at a time, about three quarters of a second each, and one browser record shows it bound at once with `motion=reduced`; added 27 November 2026, later still: Karima's copies have nothing that moves, and one browser record finds no animation on the page from start to finish, with and without `motion=reduced`) |
| A chosen radio button in a finished quest | **done** (26 November 2026, later still) | a finished quest disables its controls; the two circles' radio buttons were drawn so pale that the chosen setting was hard to see. They are now drawn as a ring, the chosen one a ring with a solid disc and bold, underlined words (shape and weight, not colour alone), the others a plain muted ring; measured in Chrome on the finished page: the chosen ring 10.18 to 1 against the page, its disc 5.76 to 1 against the button's fill, an unchosen ring 10.2 to 1, the chosen label 15.38 to 1 and an unchosen label 10.2 to 1 (WCAG 1.4.11 asks 3 to 1 for a control and 1.4.3 asks 4.5 to 1 for text; a machine measurement from computed colours, not a conformance claim, and not a person's test). The list of choices of a finished sorting or row quest is still drawn at 55 per cent opacity when disabled (not measured, and not mended here) |
| No rapid flashing | **done by design, not measured** | nothing flashes; the brightest change is the page's glow fading in over about a second |
| Separate volumes, mute, captions | **done** | room, characters, effects; mute; captions for eight meaningful sounds, on by default. Music has the shared control |
| Pause at any time, clean resume | **done** | Escape or the button, also in a talk; the loop sleeps and sound is suspended; hiding the tab pauses |
| Forgiving movement | **done** | coyote time 0.1 s, jump buffer 0.12 s, glide, four flaps (eight in Story); there is nothing to fall into and nothing that hurts |
| Alternatives to time pressure | **done by absence** | the scene has no timer |
| WCAG 2.2 AA for the page | **not audited** | built with roles, labels, a skip link, live regions and no inline style; no automated scan and no screen-reader pass has been run |

## Child safety and privacy

| | State |
|---|---|
| No account, name, age, email or location | **done**: the save holds settings, three indices for the Storykeeper's look and quest results; a test refuses those words in a fresh save |
| Nothing leaves the device | **done and measured**: `release:smoke` records every request of the built page: six or seven, all to the same host, none to another origin |
| No adverts, purchases, timers, streaks, chat, analytics | **done by absence** |
| No model at run time | **done**: every line is an authored string |
| Nonviolent | **done**: nothing in the scene can be harmed |
| Tests with children | **not run**: they need the museum's guardian-consent process, which is the founder's to set up; no child has been recruited or observed |

## Languages

| | State |
|---|---|
| Seven languages, same keys, same order, same placeholders | **done**: `npm --prefix gaming run strings` (1,083 strings and 60 names on 27 November 2026, UTC, with Karima's copies; 1,017 with al-Razi's loose leaves, 945 with the Alhambra quest, 866 before it, 793 before the journey of coffee, 509 earlier that day and 194 when this row was first written), plus a test of every script against every table |
| Right to left | **done**: Arabic and Urdu mirror the page; the picture, the beam and the arrow buttons are not mirrored. Captured in both |
| No honorific typed; no bare parenthesis round Arabic script | **done**: the string check; the Arabic and Urdu tables use no parentheses at all |
| Truncation at 1280×800 and narrow | **looked at, not exhaustive**: captures in ar, ur and id show no cut text in the talk, the goal or the buttons; the settings sheet was not captured in every language |
| Who wrote them | English by Claude Fable 5.2; the other six drafted from the English by Claude Sonnet as a subagent. **All are machine drafts, not read by a native speaker**, and each file says so in `_meta` |
| Departure from the repository's rule | the rule is Arabic first, with Turkish and Indonesian derived from Arabic. Here English came first and all six from it. To be put right before the slice (G-0014) |
| Doubts the translator raised | Turkish `d_page_dark` and `goal_ingenuity`; Indonesian `goal_feather_how`; the hoopoe's call and the cat's purr were given each language's own sound |

## History

Every statement of history in the scene is an entry in [the ledger](../historical-review/ledger.md) (HR-HH-01 to 34 when this was written; HR-HH-01 to 46 on 27 November 2026, with Karima's copies), written by the agent and decided by nobody: no reviewer is named for any game. The page says "Historical review pending" under the picture and in the note at the end, in seven languages, and a test fails if it stops saying so while an entry is pending. An AI does not approve its own history; a museum record is source material that has itself not been reviewed for the game.

Before each further quest is written: read the subject's records; enter each claim the quest will make, with its record and what is uncertain; mark invention as invention; hold anything the founder's pictures show that no record supports (as the prism here) until a reviewer rules.

## Assets

| Asset | Source | Licence or status | Where | Recorded in |
|---|---|---|---|---|
| The 80 thumbnails and their index | the founder, 26 November 2026 | founder-provided; how they were made is not stated | `gaming/media/hudhud/source/` (not in git) | `content/atlas.v1.json` (every file's digest, size and dimensions) |
| Every picture in the scene | code in `src/art/`, written by an AI agent | the repository's code licence (MIT); no outside picture is used | made in the browser when the scene opens | the code itself; `info()` lists each texture's size |
| The scene's sounds | code in `src/audio/cues.ts` | as above; no sample is used | synthesised in the browser | the code itself |
| Music | the museum's suite "Voices of the Museum" | as the other games | the games host, `games/media/music/` | `gaming/packages/audio/music.json` |
| Captures in `docs/gaming/evidence/hudhud/` | `hudhud-play.ts`, 26 November 2026 | made by the repository's own tool; the comparison sheet includes two of the founder's thumbnails reduced to 800 px | git | the reports beside them |

If painted art is made (art bible, routes B to D), each file needs the row the instruction lists: source, maker or tool, licence, transformations, digest, dimensions, decoded size and where it appears. The manifest will follow `gaming/art/manifest.json`'s pattern; none is needed yet because no picture file exists.
