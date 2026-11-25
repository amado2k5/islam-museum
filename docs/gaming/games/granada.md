# Granada: state of the game

_Updated 25 November 2026. Release status: **planned, with the rules of its first scenario built**. It cannot be played by a person: there is no screen, no scene and no string a visitor reads. What exists is the part underneath: the money and goods of its economy, the region's geography from the museum's coordinates, and the first scenario, "Water for the Valley", as rules that scripted players have played 6,000 times._

The founder's design is in [`../spec-granada/`](../spec-granada/) (the package of 25 November 2026, read in full). What was found before building is in [`../granada/g0-discovery.md`](../granada/g0-discovery.md); the gates are in [`../granada/acceptance.md`](../granada/acceptance.md); the decisions are [G-0009](../adr/G-0009-granada-eleventh-game.md), [G-0010](../adr/G-0010-granada-economy-kernel.md) and [G-0011](../adr/G-0011-granada-village-rules.md).

## What the game is to be

"Granada: The Last Kingdom of Al-Andalus": a strategy game in which a fictional steward repairs water, farms, trades, builds, negotiates and defends in a setting inspired by the Nasrid kingdom in 1475. Its history is to come from museum records; its prices, people, quests and outcomes are simulation and are to be labelled so. The eleventh game of the platform, and not The Golden Age renamed.

## What exists

| Piece | Files | What it does |
|---|---|---|
| Money and goods | `gaming/games/granada/src/sim/economy.ts` | A journal of whole numbers: treasury, warehouse, markets with two prices and a purse, harvests, one recipe, contracts with reservations. Commands can be retried, are refused when stale, and change everything or nothing |
| The sums a panel will show | `src/sim/appraise.ts` | Round trip, harvest forecast, processing forecast, contract appraisal, reserve status, each naming its condition |
| The first scenario | `src/sim/village.ts` (the rules of a day), `src/sim/scenarios.ts` ("Water for the Valley"), `src/sim/players.ts` (six scripted players), `tools/village-lab.ts` | A valley lived a day at a time: water shared between households and fields, crops that grow as they are watered and tended, a harvest carried into a store that may be full, households that eat and stay or leave, works paid through the ledger, five quests that are conditions on the state |
| Random play | `src/sim/random-play.ts`, `tools/fuzz-report.ts` | Random openings and commands, shared by the tests and the report |
| Geography | `src/world/geography.ts` | Great-circle distance in whole metres, a flat map centred on the city with east to the right in every language, compass direction |
| Museum records | `data/museum-records.source.json` (chosen by hand), `data/museum-records.v1.json` (built), `tools/build-records.ts` | 25 records pinned with their labels in seven languages, their review state, and coordinates for the eleven places |
| A check on the tests | `tools/mutate-economy.py` | Breaks the kernel in 18 ways and confirms the tests fail each time |
| Tests | `test/economy.gtest.ts` (33), `test/geography.gtest.ts` (8), `test/village.gtest.ts` (28) | See below |

## What the money and goods promise

- **Two prices.** The player buys at ask and sells at bid. A market whose ask is below its bid cannot be opened. Buying and selling straight back loses the difference: ten units of wheat at the fixture's prices cost 260 and return 180.
- **Finite markets.** A market cannot sell what it does not have or pay what it does not have. A sale it cannot afford is refused with the quantity it could take.
- **A raw crop is worth the raw price.** 6,800 olives at a bid of 28 are worth 190,400 if every unit is taken, and 145,600 if only the 5,200 that fit are. The third concept image's 435,200 is the same quantity at the price of oil.
- **A harvest that does not fit is a decision.** Refuse it, leave the rest in the field, sell the rest from the field, or accept the loss; each is counted, and a loss is written in the journal.
- **Pressing carries cost.** Five olives make one unit of oil, and what the olives cost goes with them.
- **A contract reserves.** An offer past its deadline cannot be accepted. Accepting one sets aside the goods in hand and the carriage and handling. Delivery pays in proportion, to the last minor unit however it is split. Cancelling, or missing the deadline, releases what was held once and charges the penalty once; what the treasury cannot pay is recorded as owed.
- **Where the goods came from matters.** The Málaga contract of the fixture shows 7,200 on paper with oil the player pressed, and loses 1,200 with oil bought at ask. The test does the second by actually buying and delivering.
- **Safe commands.** The same command twice has the effect of once. A command planned against an older state is refused. A refused command returns the very state it was given.

The numbers are the package's illustrations. They make pressing oil worth less than selling olives, which the package itself says must not become the game's balance. No balance has been attempted.

## The first scenario: "Water for the Valley"

Late spring. The steward of a valley district has 60 households, 1,200 dinars, 220 units of grain in a store with room for 200 more, timber and stone in the yard, and 96 days until the end of winter. A wheat field stands ripe. An olive terrace is thirsty behind a broken branch that carries a quarter of its water. A meadow by the river has never been watered.

| The player can | What it costs or does |
|---|---|
| Mend the branch | 140 dinars, 10 stone, 12 worker-days; it then carries the terrace's need |
| Rebuild and extend the channel | 420 dinars, 20 timber, 40 stone, 40 worker-days; the terrace at full flow, and water to the meadow |
| Order a ripe field brought in | Hands carry it in day by day; what does not fit waits, or is sold from the field at the market's buying price |
| Sow a fallow field | Vegetables in spring or summer, wheat in autumn, where water reaches and the crop can grow |
| Build a house or the granary | 160 dinars and 30 timber for ten more households; 240 dinars, 40 timber and 30 stone for 500 more units of store |
| Buy and sell at the market | At its two prices, while its stock and its purse last |
| Say who gets water first | Households or fields, when there is not enough for both |

Five quests, each a condition the rules check and not a button: water reaching the terrace; the first harvest brought in or sold; twenty days of food held as winter approaches; a house built and a household arrived; the store once full and then with room again. The scenario is won at the end of winter if all five are done, welfare is at least 60, no household has been lost and twenty days of food are in store.

The weather and the river's year are fixed by the seed, so what a forecast shows is what will happen unless the player acts. What the lab found, and what is wrong with the scenario as it stands, is in [G-0011](../adr/G-0011-granada-village-rules.md).

## The museum behind it

`npm --prefix gaming run granada:records` reads the hand-chosen list and pins what the museum has. A record that is missing, sensitive, without a label in one of the seven languages, or (for a place) without coordinates stops the build.

| Use | Records |
|---|---|
| Places (11) | Granada (capital); Málaga and Almería (ports); Almuñécar (coast); Vélez-Málaga, Loja, Alhama, Guadix, Baza, Ronda (towns); the Sierra Nevada (mountain) |
| Context (9) | The Emirate of Granada; the Alhambra, the Generalife, the Nasrid Palaces, the Madrasa of Granada; Ibn al-Ahmar's entry into Granada, the founding of the Alhambra, the surrender of the city; Ibn al-Khatib's *al-Ihata* |
| Ideas behind systems (5) | Water: the saqiya. Soil: Ibn Bassal's matching of soil, water and crop. Market: the hisba. Ceramics: lustreware. Textiles: tiraz |

Twenty of the 25 are draft-tier in the museum; five are published. A role says how the game may use a record and is not a claim about it. Nothing from these records is shown to anyone yet. What the museum does not have (the crops of the Vega and their seasons, the canals, the trade in silk, the coinage, who ruled in 1475) is listed in the discovery report, section 6.

Distances from the museum's coordinates, held by tests: Granada to Málaga 89 km south-west, to Almería 109 km east, to the nearest place on the sea 51 km; Málaga to Almería 175 km.

## What was checked

| Check | Result (25 November 2026) |
|---|---|
| `npm --prefix gaming test` (Granada's part) | 3 files, 69 tests, all pass |
| `npm --prefix gaming run granada:village-lab -- 1000` | 6,000 campaigns over 1,000 seeds in 40 s; no rule broken; the do-nothing and random players never win; the four real ways of playing win 91.4% to 100% |
| Random play (`games/granada/tools/fuzz-report.ts`) | 60,000 commands over 300 openings; 24,460 accepted (40.8%); 0 unsound states; of 1,200 contracts 436 settled, 297 cancelled, 236 failed, 76 still accepted, 155 never taken up |
| `npm --prefix gaming run granada:mutations` | 18 of 18 deliberate breakages caught by the tests |
| `npm --prefix gaming run granada:records` | 25 records, 11 places; digest `3b9fd1e2af98…` |

Evidence: [`../evidence/granada/g0/`](../evidence/granada/g0/) (as it stood when gate G0 was written: 38 tests, 15 breakages) and [`../evidence/granada/village/`](../evidence/granada/village/).

## Not done

- **Everything a player would see.** No screen, no scene, no terrain, no camera, no save, no strings, no sound. The first scenario exists as rules only.
- The scenario is too forgiving: two of the four scripted ways of playing cannot lose, and money has too little to do by the end ([G-0011](../adr/G-0011-granada-village-rules.md)).
- Prices do not move; goods do not travel; there is one warehouse; the clock is a counter. See [G-0010](../adr/G-0010-granada-economy-kernel.md), "What it does not do yet".
- Water, farming, labour, households and two kinds of building exist for one valley. A mill, a second market, goods that travel, construction in stages, diplomacy, defence: not started.
- No historical statement of the game has been checked against a source, because the game makes none yet.
- No measurement of a Granada scene; no person has seen any of it.
- The first random-play run settled no contract at all, because random cancelling always came first. The generator was changed and the test now demands more than 50 of each ending. It is recorded because a fuzz run that never reaches a path proves nothing about it.

## Next

1. **The screen**: the valley in 3D on the existing renderer, with terrain, the channel and its water, the three fields, the store and the houses; the top bar showing what tomorrow and the season will bring from the real forecast; seven languages; saving; a play script in real Chrome. This is what makes Granada a game a person can open.
2. Prices that respond to stock within bounds, and a second market at Málaga reached by goods that travel (Act II).
3. Tightening Act I once people have played it.
