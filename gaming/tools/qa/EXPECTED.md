# What each recent change should look like

For a reviewer. Each line is a claim to check, not a fact to repeat: mark it CONFIRMED (I saw it), NOT CONFIRMED (I looked and did not see it) or NOT CHECKED (and why). "3D" needs WebGPU; without it every game still plays in its fallback, and the lines marked (3D) cannot be checked.

## Granada (`/granada/?lang=en&fresh=1&seed=7`)

| # | Claim | How to see it |
|---|---|---|
| G1 | The page opens on a brief that says this is a game and not a history, and links to three museum records | Open the address with `fresh=1` |
| G2 | The game is playable at once from a drawn plan; the 3D valley takes its place a moment later (3D) | Watch the first seconds; the buttons "3D view", "Plan", "Whole valley" appear above the picture |
| G3 | The village is lime-washed houses under clay-tile roofs, with a mosque and a square minaret north of the square (3D) | Drag toward the village, wheel to come closer |
| G4 | A watermill stands at the tail of the west channel, north-east of the wheat field. It is a model made ahead of time and fetched after the page starts (3D) | In the browser's console: `__GR__.stage().info().models` should be `["granada/mill"]` |
| G5 | The mill's wheel turns only while the west branch carries water (3D) | At the start the west branch is broken and the wheel is still. Works tab: order the channel repaired; let about twelve days pass; the wheel turns |
| G6 | A stone bridge of three arches carries a road north over the river (3D) | North-west of the village, where the road meets the river |
| G7 | Ox-carts go along the two main roads; people lean from foot to foot as they walk (3D) | Watch the road west of the village and the road to the market |
| G8 | The season changes the light and the trees: blossom in spring, gold poplars in autumn, bare wood in winter; a day of rain is overcast (3D) | Let the days pass at the faster speed |
| G9 | What the valley shows is the game's state: wheat thins as it is brought in, a house appears when built, with scaffolding while it goes up (3D) | Fields tab: harvest the mill field; Works tab: build a house |
| G10 | A click on a field in the valley opens that field's card (3D) | Click the wheat field |
| G11 | Keys: 1 to 5 for the tabs, P pause, N one day, H help; in the valley the arrows, Q and E, plus and minus, O, Home | Click the picture first so that it has the keyboard |
| G12 | A reload without `fresh=1` resumes the same day | Reload |
| G13 | The interface is teal with gold lines | Look |

Known and unfixed: three of four scripted ways of playing win at least 95 times in 100, so the year is too forgiving; there is one market with fixed prices; one act of three exists.

## Atlas (`/atlas/?lang=en&date=2026-12-01`)

| # | Claim | How to see it |
|---|---|---|
| A1 | The globe is a lit sphere with stars behind it (3D); without WebGPU a flat disc of coastlines | `document.documentElement.dataset.globe` is `3d` or `2d` |
| A2 | The pins and the line from guess to answer sit exactly on the coast under them (3D) | Guess, submit, zoom in on the reveal |
| A3 | No round named for one place is scored at another: every "Battle of X" or "Siege of X" is scored at X | Play the five rounds of several dates (`date=2026-12-02`, …) and read each reveal |
| A4 | It can be played by mouse, by keyboard alone (arrows turn the globe, Enter drops the pin), or by typing coordinates | Try each |
| A5 | The same date gives the same five rounds in every language | Change `lang` |

Known and unfixed: no picture rounds, no terrain on the globe, no archive of past days.

## The Golden Age (`/golden-age/?lang=en&fresh=1&seed=7`, then `&scenario=house-of-books`, `&scenario=what-endures`)

Nothing has changed in it since the last review.

| # | Claim | How to see it |
|---|---|---|
| D1 | Three chapters, each opened by its own address, each in 3D (3D) or from a plan view | The three addresses; `&no3d=1` for the plan view |
| D2 | A building that is not doing its job carries a marker saying why | Place a house away from water |
| D3 | **A known fault:** in chapter 3 a trading city cannot lose | Try to lose while building markets |
