# islam.museum local Mac playtest evidence log

- Test environment: ChatGPT Desktop Local Work controlling the user's connected Google Chrome instance through the browser extension. Mouse/trackpad-equivalent pointer and keyboard input available. Initial viewport visually observed at approximately 1728×866 CSS pixels from captured browser frames; exact viewport and hardware/GPU not yet verified. WebGPU availability not checked.
- Release endpoint: `https://uat-games.islam.museum/_channel`
- Observed at 2026-11-25 21:00 EST: `current` = `20261125-e2930d63426`; previous = `20261125-484ead40122`; updatedAt = `2026-11-26T01:43:43.401Z`.

## Step 0 reachability

| Time (EST, approx.) | URL / scenario | Visible action | Result |
|---|---|---|---|
| 21:00 | `_channel` | Opened in dedicated connected-Chrome tab | Exact expected release visible. |
| 21:00–21:01 | Granada English fresh | Read opening brief; clicked **Begin** | Interactive 3D valley rendered. `3D view` pressed; plan and whole-valley controls visible. Initial state: Spring day 25, 1,200 dinars, 36 food-days, 60/60 households, welfare 60, pool 150/300, store 220/420, timber 120, stone 80. |
| 21:01 | Golden Age ch. 1 fresh | Read brief; clicked **Begin** | Interactive 3D district rendered. Initial state Year 1 Spring; 130 treasury, 60 grain, 56/80 households, welfare 50, learning 0/200, water 36/16. |
| 21:01 | Golden Age ch. 2 fresh | Read brief; clicked **Begin** | Interactive 3D district rendered. Initial state Year 1 Spring; 110 treasury, 120 grain, 130/168 households, welfare 50, learning 70/480, water 80/46. |
| 21:01–21:02 | Golden Age ch. 3 fresh | Read brief; clicked **Begin** | Interactive 3D district rendered. Initial state Year 1 Spring; 140 treasury, 150 grain, 180/204 households, welfare 50, learning 110/520, water 120/62. |
| 21:02 | Atlas daily 2026-11-26 | Waited for live render; pressed Right then Enter on globe | 3D shaded globe rendered after ~3 s; keyboard interaction placed pin at 30.0° N, 40.8° E. Round 1 clue: “al-Duz takes Lahore and is killed”. |

## Evidence references

- E-CH: `_channel` JSON text rendered in Chrome.
- E-GR-START: Granada opening brief, initial plan fallback during loading, then live 3D whole-valley screenshot observed in-tool.
- E-GA1-START / E-GA2-START / E-GA3-START: opening brief and live 3D district screenshots observed in-tool.
- E-AT-START: initially blank loading frame, then Round 1 shaded-globe frame and keyboard pin state observed in-tool.

No screenshot files have yet been exported by the browser-control surface; evidence images were observed live in the tool session only.

## Completed run evidence

### Granada

- Initial: Spring day 25; 96 days left; 1,200 dinars; 36 food-days; 60/60 households; welfare 60; pool 150/300; store 220/420; timber 120; stone 80.
- Harvested ripe mill field with sell-overflow choice: 200 stored, 120 sold, zero spoiled; treasury 3,263; First Harvest complete.
- Ordered broken olive-branch repair for 140 dinars and 10 stone; displayed “12 days of work”; completed after three calendar days of worker progress; branch flow 5/day broken to 14/day.
- Immediate wheat round trip: visible buy 26, sell 18; eight-dinar loss; no free money.
- House increased capacity 60→70. Granary increased store capacity 420→920. Channel extension supplied the river meadow. Invalid insufficient-resource order disabled without loss.
- Normal/fast/pause and `1`–`5`, `P`, `N`, `H`, `O`, `Home` exercised. Pointer pan/zoom and visible field selection exercised.
- Close post-repair mill frames showed wheel rotation with visible water. Pre-repair no-flow close frame was not captured.
- Winning full year: 1,494 dinars; 24 food-days; 80/80 households; welfare 75; pool 300; store 243/920; all five objectives; score 1,419.
- Neglect loss: 44/60 households; welfare 25; food/store 0; all objectives incomplete; score 614.
- Reload without `fresh=1` restored observed time, resources, quests, crops, repair and construction state.

### Golden Age chapter 1 — The Failing Canal

- Invalid disconnected canal refused with “A canal must start at the river bank or at a canal already dug”; treasury unchanged.
- Cleared silt, connected dry houses, built market/farm/school/houses/workshop/bath/granaries/library and additional farms; used research including lined canals, paper and water wheel.
- Museum source label/destination check: Al-Karaji levelling/tunnel-alignment link opened the matching islam.museum page.
- Final after 24 seasons: treasury 75; grain 172; households 220/220; welfare 76; learning 302/200; water 90/39; “The district flourishes.”
- Reload without `fresh=1` restored the final state.

### Golden Age chapter 2 — The House of Books

- Began from a distinct authored state: treasury 110; grain 120; households 130/168; welfare 50; learning 70/480; water 80/46.
- Built library, workshop, market, housing, canals, bath, schools, farms and granary; water-wheel research raised supply; forecast/ledger followed season results.
- Final after 20 seasons: treasury 298; grain 0; households 308/308; welfare 78; learning 533/480; water 72/47; “The district flourishes.”

### Golden Age chapter 3 — What Endures

- Competent run: fixed two dry houses; added workshop+market; observed Trade 36→72; expanded to 408 households; built schools/hospital/farms/granaries; completed research and four endowments.
- Competent final after 20 seasons: treasury 384; grain 298; households 408/408; welfare 74/64; learning 622/520; water 120/58; four endowments; win.
- Separate fresh poor-trade run: added workshop+market, selected Heavy tax, ignored housing/endowments/learning/welfare, and advanced all 20 seasons.
- Poor-trade final: treasury 2,248; grain 91; households 204/380; welfare 51/64; learning 250/520; zero endowments; Trade 72; loss. Trading was highly profitable but not a universal win.

### Atlas daily 2026-11-26

- Round 1, “al-Duz takes Lahore and is killed”: keyboard pin at 30.0 N, 40.8 E; region hint South Asia; century guess one away; reveal Lahore, 1214 CE; 0 points; 3,197 km.
- Round 2, “Toktogul Satylganov”: typed 42.8 N, 74.3 E; reveal Toktogul, 1933; 784 points; 149 km.
- Round 3, “Battle of Ihtiman”: direct globe click produced 27.0 N, 8.0 E; reveal Ihtiman, 1355; 8 points; 2,232 km.
- Major observed defect: after Round 2→3, globe/canvas became a beige blank; waiting did not restore it. Reload restored the globe and preserved Round 3.
- Round 4, “Khalil Ahmad al-Saharanpuri”: typed 29.97 N, 77.55 E; reveal Nanauta, 1852; 1,000 points; within record precision.
- Round 5, “First Anglo-Mysore War”: typed 12.97 N, 77.59 E; reveal Mysore, 1767; 827 points; 125 km.
- Total 2,619/5,000, equal to the five visible round scores; centuries right 0/1.

## Locale and target-image evidence

- Arabic and Urdu Golden Age final states rendered shaped RTL text and right-side panel organization. Native-language correctness was not assessed.
- User-supplied target images reviewed separately from live evidence:
  - `granada-v3.jpeg` — 1536×864.
  - `Atlas_ Historical World Challenge.png` — 1672×941.
  - `Abbasid Baghdad_ The Golden Age.png` — 1672×941.

## Final channel recheck

- At the end of the primary run, `_channel.current` remained `20261125-e2930d63426`; previous, commit and updatedAt were unchanged.
