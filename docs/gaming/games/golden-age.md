# The Golden Age — Rise of Civilizations: state of the game

_25 November 2026. Release status: **prototype**. The first scenario can be played from beginning to end, in 3D or from a plan view, in seven languages. It has been played by the author's script and by no person. GDD: [`../spec-v2/games/golden-age.md`](../spec-v2/games/golden-age.md). Code: `gaming/games/golden-age/`._

## What exists

One scenario, "The Failing Canal", with its rules, a screen to play it on, saving, music and a simulation lab.

**The district.** A grid of 8 by 6 plots with the river along the south edge. A plot is a crossroads neighbourhood: four quarters round the meeting of two lanes. A canal link runs along a lane from one crossing to the next and must start at the river bank or at the existing network. Water reaches what is joined to the bank; a building is served if a canal passes its plot or one beside it. One building per plot.

**A season.** The player builds, digs, sets the tax and chooses research, then ends the season. In order: labour is shared out (every household gives one worker; too few workers and every workplace slows equally); water is shared in three tiers (drinking, then farms, then crafts and baths); farms bring in the harvest (full in spring and autumn, 35% in summer, 15% in winter); people eat before anything is stored; what cannot be stored is sold cheaply and some of the rest spoils; the treasury takes tax and trade and pays upkeep; schools add knowledge if the city is paid and fed; welfare moves a third of the way toward what the season was like; people arrive or leave.

**What placement does.** A farm away from water grows a quarter of a crop. A market counts only the houses within three streets, up to 60 households each, and does better with a watered workshop within four. A school teaches the houses within three streets. A bath needs water and serves two streets. A house with water and a bath in reach holds 32 households instead of 20.

**Events** (drought, good harvest, caravan, silting, fever) are drawn from the seed and are always on the horizon a full season before they begin.

**Research** costs knowledge and there is not enough for everything (360 in all, against a goal of 200): lined canals then a water wheel for water; crop rotation for food; paper then medicine for learning and health.

**Winning and losing.** 24 seasons, from 56 households on an old silted canal with 130 coins. Won by ending with at least 200 households, 200 knowledge learned, a treasury not in debt, and welfare at 62 or more for the last four seasons. Lost after three seasons in a row in debt, or three in unrest; the count is visible from the first. A game that ends short of the goal is "ended", not lost.

Everything is whole numbers; ratios are thousandths. Costs, yields and prices are game numbers, not historical figures, and the game says so. The city is fictional. None of its buildings is a place of worship: whether a game may show one is a question for the founder.

## The screen

Address: `/games/golden-age/index.html?lang=ar` on the gaming dev server.

- **The district in 3D** (Three.js on WebGPU). Each plot is built from the state: houses, fields in strips, an arcaded market with stalls and awnings, a workshop yard with kilns and dye vats, a school, a domed bath, vaulted granaries, a library with a tiled portal and a turquoise dome, a hospital round a garden. What is drawn is what the rules hold: a dug link is a channel with water in it; a field is green only if water reaches it and changes with the season; a house in reach of water has a tree in its court; the figures on a plot's lanes follow its households; lined canals turn the channels to stone; the water wheel stands at the intake once it is researched. The light changes with the season.
- **The first thirty seconds.** The steward's note opens with the canal. Choose the canal tool, aim at a lane: the plots that would gain water light up and the tooltip counts them. Click, and the water is seen to run along the new channel.
- **Before you commit.** Beside each stock the top bar shows what ending the season now would do to it. It is exact: the rules are pure, so the season is run on a copy. A building's tooltip says whether water reaches the plot and how many houses it would serve from there; a refused action says why and changes nothing.
- **After.** The ledger gives the season cause by cause: water by tier, food, money, labour, and every point of welfare (food +28, baths +7, tax −4 and so on). The rules now record that breakdown in the season report; it changes no outcome (the 1,000-seed lab gives the same table as before).
- **Trouble shows where it is.** A plot whose building is not doing its job carries a marker over it in the district: no water in reach (a dry farm, a bath or workshop that cannot work, a house without water), or a market, school, bath or hospital with no houses to serve. The same plots are listed in the panel under "Needs attention", each a button that takes the view there, and the plan view's labels say the same sentence. Silt is seen in the canals, which run brown until they are cleared; a drought lowers the river by 0.4 m and the water in the channels by 0.3 m. The scripted campaign meets no drought, so the two looks were set on the renderer directly for captures 16 and 17 in the evidence folder: they show the picture, not a moment of play, and the drop is slight enough that it has not been confirmed to read at the game's usual camera height.
- **The museum behind the game.** Each of the five research projects, and eight of the tools, names the museum record of the real thing its idea comes from and links to it in the player's language (table below). The district itself is fictional and the game says so beside the links.
- **Three ways to play, one game.** Mouse: click to act, drag to move the view, right-drag to turn, scroll to zoom toward the pointer. Keyboard alone: arrows move a plot cursor that follows the view, Enter uses the tool, Shift and an arrow digs a link; number and letter keys choose tools. **Plan view:** the whole board as buttons, every plot and every canal link, with a spoken label for each. Where the browser has no WebGPU the plan is the game (`?no3d=1` shows it).
- **Undo** within a season; **saving** on the device after every command (`im.golden-age.save.v1`), with an unreadable save set aside and a save from a newer version left alone; **start again** on the same district or a new one. The district number is shown, so a game can be repeated.
- **Seven languages**, with panels on the right for Arabic and Urdu and the district itself never mirrored. 267 strings each.
- **Music**: the museum's own suite, from the shared player ([G-0007](../adr/G-0007-music-and-audio.md)).

## Checked

**Unit tests** (`gaming/games/golden-age/test/`, 43 tests): the rules as before (19); and for the screen (24): where plots and links are and which link a point aims at; the camera's limits and that a point of the view maps to the ground and back; that every plot's geometry is the same for the same look, stays on its plot, has sound meshes, and has one sheet of water per stretch of canal; that houses are not rebuilt when the season turns; that the projection matches the season actually played; that the steward's note opens with the canal; which way water arrives in a new link; the overlay; which plots are marked as in trouble and why; that welfare's causes sum to its target through a whole campaign; that every museum link names a record with a label in all seven languages; the saved game in every case; and that all seven languages have every string the screen asks for, with the same blanks.

**In real Chrome 158**, on the machine in the inventory (`npm run golden-age:play`, evidence in [`../evidence/m2/golden-age/screen/`](../evidence/m2/golden-age/screen/)), in each of the seven languages: a new game with its two waterless houses marked; a link dug with the mouse, its water seen to arrive and one marker gone; a link in dry ground refused; a market placed, refused on the taken plot, undone and placed again; a link dug and a school built with the keyboard alone; a season ended; the ledger and research tabs, with five museum links that lead to the record in that language; the game back after a reload; a house built and a link dug from the plan; an unreadable save set aside; the whole of that again with 3D switched off; music silent before a click and playing after one. No console error in any language. In English and Arabic the script then drove a whole campaign of the lab's "balanced" player through the screen: 57 commands, won at season 24 with 336 households.

**Frame times** during that campaign, 1920 × 1080, High, display-synced at 120 Hz: 1,197 frames in 10.0 s, p50 8.3 ms, p95 9.0 ms, p99 9.3 ms, longest 9.4 ms; no frame over 16.7 ms in 57 commands and 24 season ends. The script ends a season about three times a second, far faster than a person. The table and its history are in the ledger.

## What the simulation lab found

`npx tsx gaming/tools/simlab.ts 1000`: 1,000 seeds, 14 scripted players, 14,000 campaigns. Result of 25 November 2026, unchanged after the screen was added (`../evidence/m2/golden-age/simlab-failing-canal-1000.log`):

| Player | What it does | Won | Mean score | Households | Welfare | Learned | Treasury |
|---|---|---:|---:|---:|---:|---:|---:|
| balanced | Whatever is weakest gets the next coin | 73.4% | 759 | 322 | 65 | 274 | 95 |
| merchant | Market and workshop first, profit into houses, baths, schools | 31.2% | 975 | 345 | 61 | 349 | 275 |
| scholar | School first, baths, then library and hospital | 14.6% | 642 | 228 | 60 | 231 | 60 |
| irrigator | Canal, farms, granary first; schools once fed | 12.3% | 860 | 254 | 61 | 261 | 56 |
| idle, tax-only, one building only (seven kinds), random | | 0% each | 195 to 405 | | | | |

- **No rule broke** in 14,000 campaigns or in 60 more of random play from hostile starting stocks. Every campaign ended.
- **No cheap trick wins.**
- **Open finding: only two strategies are comfortably viable.** The GDD asks for at least three. Scholar and irrigator win about one campaign in eight; both fall short on welfare in the final year. Recorded, not tuned away: now that there is a screen, a person playing it is how to tell whether the scripted players are being less sensible than a person would be.

## Known defects and limits

1. **No person has played it.** Every check above is the author's script. Whether the first minute is clear, whether the trade-offs feel like choices, whether a season is too long or too short: unknown.
2. **A stall at every season's end was found and removed; the first diagnosis was wrong.** The earlier version of this page said a new building cost a slow frame. A probe that timed each command and the two frames after it showed otherwise: building cost nothing extra, and every season's end cost about 50 ms, because the renderer swapped the sky's environment map with the season and the engine rebuilt every material's bindings. One environment map now serves all four seasons (sun, sky, haze and exposure still change), and the scripted campaign has no slow frame. New meshes are also brought in two a frame and swapped when ready, which has not been shown to matter on this machine and may on a slower one.
3. **Draw calls are high** (about 950 for a full district on High, each mesh drawn for shadow, depth and colour). It holds the display rate on this machine; it will not on a weak one. Merging the static geometry by material is the fix.
4. **The picture is a tidy model town, not the concept art.** Buildings are plain, figures are simple robed shapes that walk up and down their lane, there are no carts, animals, smoke or lamps, the land beyond the district is bare, and the water is flat. Trouble is now marked on the plot it belongs to, and silt and drought show in the water; hunger, idleness, a fever and a building at work still show only in the panel.
5. **One scenario.** The GDD asks for a three-chapter campaign, three starting scenarios, a sandbox and a daily seeded scenario; and for at least 25 buildings and upgrades where there are nine.
6. **No recovery plan** when a city is failing (a loan, downsizing), no checkpoint beyond undo within a season, no replay or export.
7. **The history is a link, not yet part of the play.** Research and tools point to thirteen museum records, but the buildings are generic, houses and the granary have no record, and nothing in the scenario's story or numbers comes from a record. Two of the thirteen (the public bathhouse and Bayt al-Hikma) are draft-tier records in the museum.
8. **Translations.** Arabic and English were written by the lead agent; Urdu, French, Spanish, Turkish and Indonesian by a Sonnet subagent from them. All are AI text that no native speaker has read. Long words overflow some tool buttons in some languages.
9. **Touch** (one finger to move, two to zoom and turn) is written and has never been tried on a touch screen. Narrow windows have a layout that has only been looked at in a desktop browser.
10. **Only Chrome on one Mac.** Edge, Firefox, Safari, Windows and any discrete GPU are untested.
11. **No sound effects**, no gamepad, no key remapping, no UI scale control, no photo mode.
12. **Settings and the saved game are per device.** Nothing is sent anywhere.

## The museum behind the game

Chosen by hand in `gaming/games/golden-age/data/museum-links.source.json`; `tools/build-links.ts` checks that each record exists, is not marked sensitive and has a label in all seven languages, and pins the result with a digest in `data/museum-links.v1.json`. The game never reads the museum's data while it runs.

| In the game | Museum record | Its state in the museum |
|---|---|---|
| Research: lined canals | `invention/mansur-covered-water-conduits` | published |
| Research: water wheel | `invention/norias-of-hama` | published |
| Research: paper | `invention/paper-mill-samarkand` | published |
| Research: medicine | `invention/physician-licensing-baghdad-931` | published |
| Research: crop rotation | `invention/ibn-bassal-soil-water-matching` | published |
| Canal tool | `invention/karaji-qanat-surveying` | published |
| Farm | `invention/saqiya-improvements` | published |
| Market | `invention/hisba` | published |
| Workshop | `invention/tiraz` | published |
| School | `invention/nizamiyya-madrasa` | published |
| Bath | `concept/hammam` | draft |
| Library | `group/bayt-al-hikma` | draft |
| Hospital | `invention/harun-bimaristan` | published |

A link says "this is the real thing the idea comes from". It does not say the game's district had it, or that the game's numbers describe it. Whether these are the right records for each idea is a judgement of the agent that chose them and is the founder's to correct.

## Run it

```bash
npm --prefix gaming ci
npm --prefix gaming run music:import -- ~/Downloads    # once, if the music is wanted
npm --prefix gaming run dev
# http://127.0.0.1:4330/games/golden-age/index.html?lang=ar
npm --prefix gaming test
npm --prefix gaming run simlab -- 1000
npm --prefix gaming run golden-age:play -- /tmp/ga en 1
```
