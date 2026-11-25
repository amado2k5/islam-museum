# G-0010: Granada's money and goods are a journal of whole numbers, changed only by commands that can be retried

_25 November 2026. Status: accepted and built for the first slice (markets, harvest, one recipe, contracts). Price formation, transport and the fixed-step clock are designed here only as far as the kernel must allow for them; they are not built._

## The problem

The Granada package finds four errors in its own concept images, and all four are errors a strategy game can ship with for years: a raw crop valued at the price of what it could become (435,200 where 190,400 is right); a harvest larger than the store for it with nothing said about the difference; a price table on which the player could buy low and sell high at one counter for ever; a contract appraised with a production cost that does not apply to goods bought to fill it. It also asks for properties that cannot be bolted on later: nothing counted twice, nothing paid twice, a command safe to retry, a replay that is exact.

## Decisions

1. **Whole numbers only.** Money is in minor units, 100 to the dinar; goods are whole units. No floating-point value is ever stored. Where a proportion is needed (the cost that leaves with part of a holding; the part of a contract's price due for a part delivery), it is computed as `a × b ÷ c` rounded down with exact big-integer arithmetic, and from the running total, so that the parts always sum to the whole.
2. **Every change is a journal entry from one account to another.** Accounts are the treasury (available and reserved), the warehouse (free and reserved), each market's purse and shelves, and the named edges of the model: `world` (money and goods entering or leaving by a disclosed flow), `field` (a harvest arriving), `loss`, `processed` (a recipe's conversion). `audit()` replays the journal and compares every balance with the state; it also checks that nothing is negative, that nothing reserved exceeds what is held, that the warehouse is within its room, and that what contracts hold equals what is reserved.
3. **A market has two prices and a purse.** The player buys at ask and sells at bid. An opening in which any ask is below its bid is refused, so the second concept image's table cannot be loaded at all. A market pays with the money it has: a sale it cannot afford is refused with the quantity it could take.
4. **A harvest that does not fit is a decision.** The command carries what is to happen to the overflow: refuse the harvest, leave the rest in the field, sell it from the field at the raw bid, or accept its loss. Each outcome is reported in units; a loss is a journal entry. There is no path on which units disappear.
5. **A contract reserves on acceptance.** An offer whose deadline has passed can no longer be accepted. The goods in hand that it asks for, and its carriage and handling, move to the reserved accounts and can be neither sold nor spent. Delivery pays in proportion; cancelling or missing the deadline releases what is held, once, and charges the disclosed penalty, once. A penalty the treasury cannot pay in full is recorded on the contract as owed.
6. **Commands arrive in an envelope.** `{ commandId, expectedStateVersion, command }`. A command id already seen returns its first result and changes nothing. A command planned against an older state is refused, so nothing is bought at a price the player was not shown. A refused command returns the very state it was given. `preview()` is the same function with the result discarded, so what a panel shows before confirmation is what will happen.
7. **Appraisal is separate from the ledger.** `appraise.ts` holds the sums a panel shows (round trip, harvest forecast, processing forecast, contract appraisal, reserve status), each naming its condition: "gross if every unit were accepted at the raw bid" is a field, not a promise.
8. **Limits instead of overflow.** A command carries at most 100,000,000 units; a price is at most 100,000 dinars a unit; an account holds at most 10^15 minor units. Anything beyond is refused with a named error. A modded data file cannot make a product that stops being exact.

## What it does not do yet

- **Prices do not move.** A market's two prices are fixed for the life of a state. Supply and demand pressure, smoothing, a floor, quote lifetime in ticks and re-quoting for size are the next layer; the stale-state refusal is the hook they will use.
- **Goods do not travel.** A contract's delivery is instantaneous here. Shipments (reserve, load, depart, travel, arrive, with delay, loss and part delivery) belong to the transport graph, which will move goods through an `in-transit` account so that nothing is in a warehouse and a caravan at once.
- **One warehouse, every good counted alike.** Storage by place, by kind (a granary is not an oil store), by lot, quality and expiry is not modelled.
- **The clock is a counter.** `advance` moves the tick and fails overdue contracts. The fixed step (how long a tick is, and what happens in one) is decided with the village's rules, by profiling, as the package asks.
- **The journal is kept whole, and so is the record of answered commands.** Copying them on every command is cheap (entries are never changed, so they are shared), but both grow without bound; a long campaign needs a checkpoint of balances plus a tail, and a window of remembered command ids. Not built.
- **The numbers are the package's illustrations.** The fixture's prices make pressing oil worth less than selling the olives. The package says so and forbids taking them as tuning. No balance has been attempted.

## Evidence

In [`../evidence/granada/g0/`](../evidence/granada/g0/), all produced on 25 November 2026 on the machine in the M0 inventory:

- `tests.md`: 38 tests, all pass (30 for the economy, 8 for geography).
- `economy-fuzz.json`: 60,000 random commands over 300 random openings; 24,460 accepted (40.8%); the books were sound after every one; 1,200 contracts ended settled (436), cancelled (297), failed (236), still accepted (76) or never taken up (155). The first version of this run settled no contract at all (random cancelling got there first); the generator was changed and the test now requires more than 50 of each ending.
- `economy-mutations.md`: the kernel was broken on purpose in 15 ways (selling at ask, paying a retried command twice, a market with endless money, a harvest lost silently, a contract failing on its last day, and ten more); the tests failed for all 15.

Reproduce: `npm --prefix gaming test`, `npx tsx --tsconfig tsconfig.json games/granada/tools/fuzz-report.ts` and `npm --prefix gaming run granada:mutations` (the last two from `gaming/`).

## Alternatives turned down

- **Floating-point money with rounding at display.** Not replayable across machines to the last unit, and a part delivery's shares would not sum.
- **Mutable state with an undo log.** A refused or half-applied command would need unwinding; copying the state and discarding the copy cannot leave a half-applied change.
- **One price per good.** It is the first concept image's table, and it makes every market a free store of value: a player could park wealth in goods at no cost.
- **Putting this in a shared package now.** One game uses it. It moves when a second does.
