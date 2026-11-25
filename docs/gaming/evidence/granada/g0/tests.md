# Granada: its unit and property tests

_Captured output of `npx vitest run --config vitest.config.ts games/granada --reporter=verbose` from `gaming/`, 25 November 2026. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
 RUN  v5.1.2 /Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/distracted-wozniak-cc8c6f/gaming
 ✓ games/granada/test/geography.gtest.ts > distance and direction > measures a degree of latitude as about 111.2 km, the same in both directions, and nothing as nothing 1ms
 ✓ games/granada/test/geography.gtest.ts > distance and direction > puts east on the right and north at the top 0ms
 ✓ games/granada/test/geography.gtest.ts > the pinned museum records > is the pack its source list asks for, unaltered since it was built 1ms
 ✓ games/granada/test/geography.gtest.ts > the pinned museum records > names every record in the seven languages and places every place 1ms
 ✓ games/granada/test/geography.gtest.ts > the pinned museum records > does not take the mosque opened in 2003 for a building of the Nasrid city 0ms
 ✓ games/granada/test/geography.gtest.ts > the kingdom's geography > keeps Granada inland: the nearest place on the sea is about 51 km away 0ms
 ✓ games/granada/test/geography.gtest.ts > the kingdom's geography > keeps the two ports apart: Málaga to the south-west, Almería to the east, 175 km between them 0ms
 ✓ games/granada/test/geography.gtest.ts > the kingdom's geography > puts the snow mountain beside the city and the far towns far 0ms
 ✓ games/granada/test/economy.gtest.ts > markets: the player buys at ask and sells at bid > opens the fixture's market with every ask at or above its bid 1ms
 ✓ games/granada/test/economy.gtest.ts > markets: the player buys at ask and sells at bid > refuses a market that sells below what it pays (the second concept image's price table) 0ms
 ✓ games/granada/test/economy.gtest.ts > markets: the player buys at ask and sells at bid > loses 80 dinars on the fixture's wheat round trip, and the ledger agrees 1ms
 ✓ games/granada/test/economy.gtest.ts > markets: the player buys at ask and sells at bid > cannot be bought out of stock it does not have, nor sold more than it can pay for 1ms
 ✓ games/granada/test/economy.gtest.ts > markets: the player buys at ask and sells at bid > refuses a purchase the treasury or the warehouse cannot take 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > values 6,800 olives at 190,400, not at the price of oil 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > presses at most 1,360 units of oil from them, worth 87,040 at the oil bid 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > does not bring in a harvest that will not fit unless the player has said what happens to the rest 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > stores what fits and leaves the rest in the field, counted 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > sells the overflow from the field at the raw bid when told to 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > writes a loss in the journal when the player accepts one, and never loses anything unasked 0ms
 ✓ games/granada/test/economy.gtest.ts > the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so > leaves in the field what a market cannot afford to take 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > appraises the fixture: 7,200 on paper, 2,400 better than selling here, a loss of 1,200 if the oil is bought 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > really loses 1,200 dinars when the oil is bought at ask and delivered 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > holds the oil and the costs on acceptance, so neither can be spent twice 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > pays once for a full delivery: the cash that moves is revenue less the new costs 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > pays the same total however the delivery is split, to the last minor unit 23ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > refuses to deliver more than was asked for 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > releases what it held exactly once when cancelled, and charges the disclosed penalty once 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > fails a contract whose deadline passes, with what was delivered paid for and the penalty charged once 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > cannot be taken up once its deadline has passed 0ms
 ✓ games/granada/test/economy.gtest.ts > the Málaga contract: what it pays depends on where the oil came from > records what a treasury could not pay of a penalty instead of going below nothing 0ms
 ✓ games/granada/test/economy.gtest.ts > winter reserves > reads 36,400 against 40,000 as 91% and 3,600 short, not as adequate 0ms
 ✓ games/granada/test/economy.gtest.ts > commands: safe to retry, refused when stale, all or nothing > answers a repeated command with its first result and changes nothing 0ms
 ✓ games/granada/test/economy.gtest.ts > commands: safe to retry, refused when stale, all or nothing > refuses a command planned against a state that has since changed 0ms
 ✓ games/granada/test/economy.gtest.ts > commands: safe to retry, refused when stale, all or nothing > returns the very same state when a command is refused, and never changes the state it was given 0ms
 ✓ games/granada/test/economy.gtest.ts > commands: safe to retry, refused when stale, all or nothing > refuses openings that are not whole, or that do not fit 0ms
 ✓ games/granada/test/economy.gtest.ts > random play > keeps the books sound after every one of 60,000 random commands over 300 openings 2320ms
 ✓ games/granada/test/economy.gtest.ts > random play > gives the same books for the same commands, and different books for different ones 22ms
 ✓ games/granada/test/economy.gtest.ts > random play > never makes money by carrying goods between a market's two prices 341ms
 Test Files  2 passed (2)
      Tests  38 passed (38)
   Start at  15:09:38
   Duration  2.81s (tests 98%, transform 1%, import 1%)
```
