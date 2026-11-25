# Campaign, quests, mastery and replayability
## Narrative: A Kingdom Worth Protecting
A fictional steward inherits a valley district with limited funds, a damaged irrigation connection, an anxious farming community and a market contract. Fictional advisors represent agriculture, commerce, builders, residents and diplomacy; each has understandable competing priorities without ethnic or religious caricature. Introduce characters through action and short dialogue, not an encyclopedia. The historical setting provides context; all choices and outcomes in the story are explicitly alternate-history simulation. Avoid depicting real historical figures as fictional quest-givers speaking invented dialogue. Historical entries are source-linked archive cards, accessible but not compulsory reading during play.

### Act I — Roots in the Valley (first 20–30 min target)
Repair water, harvest a prepared plot, choose domestic reserves vs sale, build housing and storage. A farmer warns that downstream irrigation is insufficient; cheaper repair preserves cash while expansion supports a second plot. Both options have clear future effects. A short visible construction milestone provides payoff. Failure: water/food shortage triggers remedial task and recovery, not instant restart. Exit: stable supplies and functioning market.

### Act II — Roads to Prosperity (next 30–45 min target)
Unlock regional commerce, oil processing and caravan logistics. A merchant offers an export contract; player can negotiate, fulfill, reject or prioritize local market. Storage overflow and weather delay make capacity planning meaningful. Build modular civic/castle project and decide which district to specialize. A council choice trades near-term treasury for water access or trade treaty. Exit: reliable production, stable households and meaningful trade network. Show actual caravan departure and arrival, not just a popup.

### Act III — A Fragile Winter (next 20–45 min target)
Season pressure, rising political tension and civilian needs converge. Player chooses defensive maintenance, reserve building, negotiated relief and/or alternative commerce. Abstract fictional opponent pressure, no forced combat route. Finale scores prosperity, stability, civilian welfare, cultural assets and resilience. Endings: flourishing and prepared; successful negotiated settlement preserving welfare; recovering after economic setback; scenario loss explained and recoverable. Show player's city at dawn and a causal recap: choices, resource trends, completed buildings, citizen impacts. Replay branch preview without spoiling everything. The proposed duration is a design target, not measured gameplay.

## Authored quests (examples to implement and validate)
| ID | Quest and trigger | Player choice / consequence | Evidence of completion |
|---|---|---|---|
| Q01 | Water for the Valley, start | Repair vs expand irrigation; cash vs future capacity | Delivered water reaches named plots |
| Q02 | First Harvest, ripe plot | Sell, store or process | Actual inventory and ledger changes |
| Q03 | Feed the Kingdom, reserve forecast | Retain crop or secure alternative supply | Forecast threshold sustained for defined ticks |
| Q04 | A Place to Call Home, growth | Housing vs jobs first | Occupancy and service access, not building count alone |
| Q05 | Overflowing Granary, capacity warning | Build capacity, split harvest, process or sell | No unaccounted loss; space restored |
| Q06 | The Miller's Promise, surplus wheat | Invest in mill or import flour | Output delivered to bakery/market |
| Q07 | Merchants of Málaga, access unlocked | Accept profitable contract or decline for reserves | Delivery and payment verified once |
| Q08 | A Delayed Caravan, route interruption | Reroute, renegotiate or absorb delay | Shipment state resolved |
| Q09 | The Royal Fortress, building unlocked | Design own connected modular complex | Valid blueprint, funded construction complete |
| Q10 | A Difficult Decision, council | Invest agriculture vs defenses; effects persist | Recorded decision and achieved downstream consequence |
| Q11 | The Jewel of Granada, stable economy | Cultural garden/palace commission vs public investment | Verified project and welfare trade-off |
| Q12 | Winter Approaches, seasonal forecast | Reserves, imports, aid or negotiated relief | Survive defined winter with welfare floor |
| Q13 | A Kingdom United, political tension | Treaty, defensive investment or civil relief | Stable outcome with transparent conditions |
| Q14 | A New Beginning, recovery path | Restore housing/production, renegotiate debts | Reach recovery threshold; no exploit rewards |

Quest data: stable ID, localization keys, source classification, prerequisites, trigger expression, state transitions, objectives, progress query, branch options, time window in game ticks, reward transaction, failure/recovery, next IDs and deterministic seed. Idempotent reward claim, validate DAG or explicitly bounded repeatable cycles. Dynamic quests generated from real shortages or surplus, solver checks preconditions and reachable objective given time/resources; if uncertain, don't publish daily scenario. Avoid conflicts where two quests reserve same goods. Explain change if player chooses alternate path. No fabricated historical evidence. Quests unlock capabilities only if actual prerequisites met; reward cannot bypass fundamental accounting. Track at most 3–4 pin slots; journal accessible and searchable.

## Replay and player creativity
Campaign saves with different strategies and era-aware scenario choices; sandbox creative free-build and economy enabled variants clearly separated; defensive survival with adjustable difficulty; daily UTC seeded constraint with archived version. Daily challenge should take 5–15 minutes proposed, no mandatory login or clock penalty. Example: recover winter reserve while preserving merchant commitment; earn enough through olive export without breaching welfare; build a connected castle module within fixed materials. Prove solvability on 365-day archive/forward corpus; reject ambiguous or impossible seeds. Comparison scores require same rules/version/mod digest; local self-score clearly local. Global validated leaderboard would need backend, anti-cheat and moderation; do not fake.

Sharing: local blueprint/world snapshot export, compressed versioned challenge seed link, screenshot/photo mode, replay command log, shareable spoiler-free score summary, optional video recording after explicit user action. No private save or identity in link by default; cap URL size and fall back to file export. Versioned imports show mods and compatibility, no execution on open. Cinematic camera paths and time-lapse for player-built kingdom; no hidden server upload. Community gallery and co-op future gated by privacy, moderation, rights and hosting approval. Avoid dark patterns, false scarcity, streak-loss pressure and compulsory ads. Track voluntary replay, completion, return and sharing only through approved privacy-preserving analytics or opt-in playtests. No claim of virality from design alone.
