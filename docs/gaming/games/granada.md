# Granada: state of the game

_Updated 25 November 2026. Release status: **planned, with its first rules built**. It cannot be played: there is no screen, no scene, no scenario and no string a visitor reads. What exists is the part underneath: the money and goods of its economy, and the region's geography from the museum's coordinates._

The founder's design is in [`../spec-granada/`](../spec-granada/) (the package of 25 November 2026, read in full). What was found before building is in [`../granada/g0-discovery.md`](../granada/g0-discovery.md); the gates are in [`../granada/acceptance.md`](../granada/acceptance.md); the decisions are [G-0009](../adr/G-0009-granada-eleventh-game.md) and [G-0010](../adr/G-0010-granada-economy-kernel.md).

## What the game is to be

"Granada: The Last Kingdom of Al-Andalus": a strategy game in which a fictional steward repairs water, farms, trades, builds, negotiates and defends in a setting inspired by the Nasrid kingdom in 1475. Its history is to come from museum records; its prices, people, quests and outcomes are simulation and are to be labelled so. The eleventh game of the platform, and not The Golden Age renamed.

## What exists

| Piece | Files | What it does |
|---|---|---|
| Money and goods | `gaming/games/granada/src/sim/economy.ts` | A journal of whole numbers: treasury, warehouse, markets with two prices and a purse, harvests, one recipe, contracts with reservations. Commands can be retried, are refused when stale, and change everything or nothing |
| The sums a panel will show | `src/sim/appraise.ts` | Round trip, harvest forecast, processing forecast, contract appraisal, reserve status, each naming its condition |
| Random play | `src/sim/random-play.ts`, `tools/fuzz-report.ts` | Random openings and commands, shared by the tests and the report |
| Geography | `src/world/geography.ts` | Great-circle distance in whole metres, a flat map centred on the city with east to the right in every language, compass direction |
| Museum records | `data/museum-records.source.json` (chosen by hand), `data/museum-records.v1.json` (built), `tools/build-records.ts` | 25 records pinned with their labels in seven languages, their review state, and coordinates for the eleven places |
| A check on the tests | `tools/mutate-economy.py` | Breaks the kernel in 15 ways and confirms the tests fail each time |
| Tests | `test/economy.gtest.ts` (30), `test/geography.gtest.ts` (8) | See below |

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
| `npm --prefix gaming test` (Granada's part) | 2 files, 38 tests, all pass |
| Random play (`games/granada/tools/fuzz-report.ts`) | 60,000 commands over 300 openings; 24,460 accepted (40.8%); 0 unsound states; of 1,200 contracts 436 settled, 297 cancelled, 236 failed, 76 still accepted, 155 never taken up |
| `npm --prefix gaming run granada:mutations` | 15 of 15 deliberate breakages caught by the tests |
| `npm --prefix gaming run granada:records` | 25 records, 11 places; digest `3b9fd1e2af98…` |

Evidence: [`../evidence/granada/g0/`](../evidence/granada/g0/).

## Not done

- **Everything a player would see or do.** No screen, no scene, no terrain, no camera, no save, no scenario, no quest, no strings, no sound.
- Prices do not move; goods do not travel; there is one warehouse; the clock is a counter. See [G-0010](../adr/G-0010-granada-economy-kernel.md), "What it does not do yet".
- Water, farming, labour, households, construction, diplomacy, defence: not started.
- No historical statement of the game has been checked against a source, because the game makes none yet.
- No measurement of a Granada scene; no person has seen any of it.
- The first random-play run settled no contract at all, because random cancelling always came first. The generator was changed and the test now demands more than 50 of each ending. It is recorded because a fuzz run that never reaches a path proves nothing about it.

## Next

1. The first scenario's rules, "Water for the Valley": a fixed-step day, a water network that cannot deliver more than it has, plots that grow, labour, households that eat, on top of this ledger; with a scripted-player lab before any screen.
2. Prices that respond to stock, within bounds, with quotes that expire.
3. Goods that travel between Granada and its two ports on a route graph whose lengths are never shorter than the straight lines above.
4. Then the screen, on the existing renderer, with terrain.
