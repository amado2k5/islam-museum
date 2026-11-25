# G-0011: Granada's village is lived a day at a time, and tomorrow's weather is known today

_25 November 2026. Status: accepted and built as rules for the first scenario, "Water for the Valley" (Act I of the package's campaign, quests Q01 to Q05). There is no screen. The numbers are first settings from the lab, not a balance anyone has played._

## Decisions

1. **The step is a day.** `tick()` lives one day in a fixed order: water is shared out; hands are sent to the harvest, then to the works, then to tending; fields grow, ripen or spoil; households eat, are counted and pay the market's levy; quests are checked. A player's decision (`act()`) takes effect at once and never advances the day. The package asks for a fixed step chosen by profiling; a day is the unit a person plans a valley in, and a whole scenario of 96 days plays in about 7 ms on the machine in the inventory, so nothing finer is needed yet. A year is four seasons of thirty days: a game calendar, not a historical one.
2. **Weather is a pure function of the seed and the day.** Rain, and how well the river runs in each season of this year (75% to 125% of a usual one), are fixed when the game begins. So the forecast a panel shows is the real future unless the player acts, a thin summer is known in spring, and no loss comes from a surprise that could not have been seen. `forecast()` is the rules themselves, run on a copy.
3. **Water is a budget, not a simulation of flow.** The day's inflow and the pool are shared between the households and the fields, in the order the player has chosen; a branch carries its capacity times its condition; what is left stays in the pool up to its brim. The pool cannot go below empty. This is the package's "bounded flow network" at its simplest: one source, one pool, branches. It makes no engineering claim.
4. **A field's crop is accounted for to the unit.** When a field ripens its yield is fixed (its potential, less what thirst cost). From then on every unit is brought in, sold from the field, spoiled, or still standing, and the four always add up to the yield; a rule checks it after every day. A harvest is carried in by hand, 14 units a worker a day, into a store that may be full; the player says whether what does not fit waits or is sold. A crop left past its time spoils by an eighth a day, in sight, with a warning event.
5. **Money and goods go through the ledger and nowhere else** ([G-0010](G-0010-granada-economy-kernel.md)). Works are paid for with `spend` and `consume`; households eat with `consume`; the levy and a quest's reward arrive with `earn`; a granary adds room with `add-capacity`. A quest's reward carries the quest's id as its command id, so the ledger itself makes it payable once. Building materials are kept in a yard and take no room in the store.
6. **A quest is a fact about the valley, not a button.** Each of the five is a condition on the state that the rules evaluate: water reaching the olive terrace through a branch able to carry a dry day's need, for three days; the first harvest brought in or sold, nine parts in ten; twenty days of food held for ten days as winter approaches; a house built and a household arrived; the store once full and then with room again.
7. **Two mistakes of the first draft, found by the scripted player who does nothing.** It completed "First Harvest" by letting the wheat rot (every unit was "accounted for") and "Feed the Kingdom" on its tenth day (the store was full of last year's grain). Both conditions were rewritten, and a third, that three days of rain could pass for a repaired branch, was closed before it was seen. The do-nothing player now completes no quest.
8. **Hunger alone makes households leave.** In the first draft welfare under hunger settled exactly at the point where nobody left. A test written from the design, not from the code, caught it.

## What the lab found (1,000 seeds, 6,000 campaigns, no rule broken)

| Player | Wins |
|---|---:|
| Does nothing | 0% |
| Random commands | 0% |
| Mender (the cheap repair, olives for cash, grain bought) | 99.5% |
| Builder (the great works, vegetables in the meadow) | 91.6% |
| Merchant (sells from the field, lives by the market) | 96.4% |
| Irrigator (fields before households, everything built) | 100% |

_(Run again for the eleventh pull request, after one rule changed: a harvested field lies fallow the same day instead of the day after. The merchant was at 91.4% before.)_

All four ways of playing are viable, which the package asks for (three). Three of them win at least 95 campaigns in 100, and the fourth loses only for holding a day or two less food than the goal. **As it stands the scenario asks a steward to act sensibly and then lets them win.** For a first chapter that teaches the loop that may be right; whether it is too easy is for people to say, and nobody has played it. The river's year changes the score more than the outcome. Money still has too little to do by the end: the irrigator finishes with about 2,050 dinars. Full table: [`../evidence/granada/village/village-lab-1000.md`](../evidence/granada/village/village-lab-1000.md).

## What it does not do

- No screen, no sound, no text a player reads. The rules name things by id.
- One market with fixed prices; no goods in transit; no mill (the package's Q06 belongs to Act II).
- Labour is shared out by a fixed order, not by the player.
- A grove does not begin a second year, because the scenario ends before it would.
- No wages, no upkeep, no debt.
- Crops, seasons and yields are game elements. The museum has no record of what the Vega grew or when ([`../granada/g0-discovery.md`](../granada/g0-discovery.md), section 6).

## Alternatives turned down

- **An hourly step.** Nothing in Act I happens faster than a day, and four hundred steps a season would only be slower to forecast.
- **Random weather drawn as the game goes.** A forecast would then be a guess, and a lost harvest would be bad luck instead of a decision.
- **Quests as scripted triggers.** A trigger can fire without the thing it names being true; a condition on the state cannot.
