# The Golden Age — Rise of Civilizations: state of the game

_25 November 2026. Release status: **planned, with its rules written** (no interface, so it cannot be played by a person yet). GDD: [`../spec-v2/games/golden-age.md`](../spec-v2/games/golden-age.md). Code: `gaming/games/golden-age/`._

## What exists

The rules of the first scenario as a pure simulation, and a lab that plays it thousands of times. There is no screen. The reference district of the graphics spike ([`../m1-graphics-spike.md`](../m1-graphics-spike.md)) is a picture of such a city and is not yet joined to these rules.

**The district.** A grid of 8 by 6 plots with the river along one edge. A canal link joins two neighbouring plots and must start at the bank or at the existing network. Water reaches what is joined to the bank; a building is served if it stands on or beside a canal. One building per plot.

**A season.** The player builds, digs, sets the tax and chooses research, then ends the season. In order: labour is shared out (every household gives one worker; too few workers and every workplace slows equally); water is shared in three tiers (drinking, then farms, then crafts and baths); farms bring in the harvest (full in spring and autumn, 35% in summer, 15% in winter); people eat before anything is stored; what cannot be stored is sold cheaply and some of the rest spoils; the treasury takes tax and trade and pays upkeep; schools add knowledge if the city is paid and fed; welfare moves a third of the way toward what the season was like; people arrive or leave.

**What placement does.** A farm away from water grows a quarter of a crop. A market counts only the houses within three streets, up to 60 households each, and does better with a watered workshop within four. A school teaches the houses within three streets. A bath needs water and serves two streets. A house with water and a bath in reach holds 32 households instead of 20.

**Events** (drought, good harvest, caravan, silting, fever) are drawn from the seed and are always on the horizon a full season before they begin, so the player can prepare: the tests check this over 40 campaigns.

**Research** costs knowledge and there is not enough for everything in one scenario (360 in all, against a goal of 200): lined canals then a water wheel for water; crop rotation for food; paper then medicine for learning and health.

**Winning and losing.** "The Failing Canal": 24 seasons, from 56 households on an old silted canal with 130 coins. Won by ending with at least 200 households, 200 knowledge learned, a treasury not in debt, and welfare at 62 or more for the last four seasons. Lost after three seasons in a row in debt, or three in unrest; the count is visible from the first. A game that ends short of the goal is "ended", not lost.

**Score** for comparing two games on one seed is balance, not wealth: people, learning, welfare and reserves each capped at the goal, with the weakest counted double.

Everything is whole numbers; ratios are thousandths. Costs, yields and prices are game numbers, not historical figures.

## What the simulation lab found

`npx tsx gaming/tools/simlab.ts 1000`: 1,000 seeds, 14 scripted players, 14,000 campaigns in 11 seconds. Result of 25 November 2026 (`../evidence/m2/golden-age/simlab-failing-canal-1000.log`):

| Player | What it does | Won | Mean score | Households | Welfare | Learned | Treasury |
|---|---|---:|---:|---:|---:|---:|---:|
| balanced | Whatever is weakest gets the next coin | 73.4% | 759 | 322 | 65 | 274 | 95 |
| merchant | Market and workshop first, profit into houses, baths, schools | 31.2% | 975 | 345 | 61 | 349 | 275 |
| scholar | School first, baths, then library and hospital | 14.6% | 642 | 228 | 60 | 231 | 60 |
| irrigator | Canal, farms, granary first; schools once fed | 12.3% | 860 | 254 | 61 | 261 | 56 |
| idle | Ends every season | 0% | 352 | 56 | 52 | 0 | 366 |
| tax-only | Top tax, builds nothing | 0% | 333 | 56 | 45 | 0 | 486 |
| only-house, -farm, -market, -workshop, -school, -bath, -granary | One kind of building, whenever affordable | 0% each | 195 to 405 | | | | |
| random | Random legal moves | 0% | 372 | 90 | 54 | 38 | 49 |

- **No rule broke.** No negative stock, no value out of range, no runaway number, in any of the 14,000 campaigns or in 60 further campaigns of random play from hostile starting stocks. Every campaign ended.
- **No cheap trick wins.** Doing nothing, taxing, building one thing, or playing at random never won.
- **Open finding: only two strategies are comfortably viable.** The GDD asks for at least three ways to win. Balanced and merchant clear one win in five; scholar and irrigator win about one in eight. Both fall short on the same thing: welfare in the final year, when a drought or a fever arrives and they have too few workplaces and services. This is recorded, not tuned away. It may be the scripted players being less sensible than a person, or the last-four-seasons rule being too harsh, and people playing it is how to tell.
- **Fixed during the lab runs, and why it matters that the lab exists:** the first numbers could not be won by anything (0 of 2,800: the canal could not carry enough water to feed the goal population); a scripted player dug forty canal links in one season because "short of water" was read as "dig" (canals carry water, they do not make it); and trade income grew without limit until each market was given a capacity.

## Checked

19 unit tests (`gaming/games/golden-age/test/`): the grid, water reach, canal rules, silt, drought and its warning, costs and refusals, demolition, research order, determinism, continuing from a saved copy, hunger, housing, insolvency, the score, and the lab's own assertions on 120 seeds.

## Not done (against the GDD)

1. **No interface at all.** Not the 30-second "place a canal link and see water flow", nor anything after it.
2. **Not joined to the 3D district.** The rules use a small abstract grid; the district is a generated city. Joining them is the next piece of work for this game.
3. One scenario, where the GDD asks for a three-chapter campaign, three starting scenarios, a sandbox and a daily seeded scenario. Nine building types against "at least 25 meaningful buildings/upgrades".
4. No roads or transport cost beyond street distance; no recovery plan (loan, downsizing) when a city is failing; no checkpoint or restart; no replay.
5. No words a player reads, so nothing to translate yet. The names of buildings and research in the code are identifiers.
6. No historical content: research and buildings are generic. Tying them to museum records (and labelling the rest as fiction) is part of writing the campaign.
7. No human has played it, there being nothing to play.

## Run it

```bash
npm --prefix gaming test
cd gaming
npx tsx --tsconfig tsconfig.json tools/simlab.ts 1000            # the lab
npx tsx --tsconfig tsconfig.json tools/simtrace.ts balanced 3    # one campaign, season by season
```
