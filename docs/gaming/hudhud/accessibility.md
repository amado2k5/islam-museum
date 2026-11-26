# Hudhud: accessibility, child safety, languages, history and assets — what is done and what is planned

_26 November 2026. A matrix of the instruction's sections 6 and 9 against the golden scene. "Done" means built and exercised by a test or the browser tool named. Nothing here has been checked by a person using assistive technology, by a child, or by a native reader._

## Accessibility and input

| Asked for | State | Evidence or gap |
|---|---|---|
| Whole scene playable by keyboard, no trap | **done** | arrows or A and D, Space, the down arrow, E or Enter, Escape; `hudhud-play.ts` flies and talks by keyboard; sheets keep Tab inside and close on Escape |
| Playable without the picture | **done** | "The scene in words": the beam's path as a sentence in a polite live region, a button to turn each mirror with its lean in words, a button to go to each thing; conversation is page text with a live announcement of each line |
| Pointer and touch, 44×44 px targets | **done** for the controls; **partly** for the picture | every button is at least 44 px (48 on a phone); tapping a mirror turns it; other things in the picture are reached with the Touch button when near, or from the list |
| Narrow and tablet layouts | **partly** | captured at 390×844 (the goal above, the talk below the picture) and 844×390; playable, but a phone held upright shows a small picture and there is no full-screen mode yet |
| Gamepad, with reconnect | **partly, not tested with a device** | stick or pad to move, button to fly, to touch, to pause; a disconnect pauses and says so; code only: no gamepad was connected in any run |
| Remapping of keys and buttons | **not done** | planned for the slice |
| Visible focus | **done** | 3 px white outline with a dark halo on every control |
| High-contrast mode | **done, not measured** | a setting: black panels, white lines; contrast ratios have not been measured with a tool |
| Clues that do not depend on colour | **done** | a mirror's lean is shape and words; the beam's end is said in words; goals are words with a mark; Story's hint is a glow plus a sentence |
| Text size | **done** | 100% to 160%, saved |
| Text speed, dialogue log, back, skip | **done** | at once, slow, medium, fast; "What was said"; Back within a node; "Skip the talk". Auto-advance does not exist |
| Simple-language option, reading assistance | **not done** | planned (G-0014) |
| Reduced motion | **done** | follows the system setting, a setting of its own and `motion=reduced`: no camera glide, no dust or sparkle bursts beyond three, no bobbing, the curtain and the page change at once, text appears at once, "go to" places the bird without a flight |
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
| Seven languages, same keys, same order, same placeholders | **done**: `npm --prefix gaming run strings` (163 strings), plus a test of every script against every table |
| Right to left | **done**: Arabic and Urdu mirror the page; the picture, the beam and the arrow buttons are not mirrored. Captured in both |
| No honorific typed; no bare parenthesis round Arabic script | **done**: the string check; the Arabic and Urdu tables use no parentheses at all |
| Truncation at 1280×800 and narrow | **looked at, not exhaustive**: captures in ar, ur and id show no cut text in the talk, the goal or the buttons; the settings sheet was not captured in every language |
| Who wrote them | English by Claude Fable 5.2; the other six drafted from the English by Claude Sonnet as a subagent. **All are machine drafts, not read by a native speaker**, and each file says so in `_meta` |
| Departure from the repository's rule | the rule is Arabic first, with Turkish and Indonesian derived from Arabic. Here English came first and all six from it. To be put right before the slice (G-0014) |
| Doubts the translator raised | Turkish `d_page_dark` and `goal_ingenuity`; Indonesian `goal_feather_how`; the hoopoe's call and the cat's purr were given each language's own sound |

## History

Every statement of history in the scene is an entry in [the ledger](../historical-review/ledger.md) (HR-HH-01 to 08), written by the agent and decided by nobody: no reviewer is named for any game. The page says "Historical review pending" under the picture and in the note at the end, in seven languages, and a test fails if it stops saying so while an entry is pending. An AI does not approve its own history; a museum record is source material that has itself not been reviewed for the game.

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
