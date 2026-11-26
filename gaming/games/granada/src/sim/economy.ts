// Granada's money and goods: the authoritative kernel every other system will stand on.
//
// Pure functions over plain integer data. Money is in minor units (100 to the dinar), goods in whole units, so the
// same commands give the same state on every machine and a replay is exact. Every change is a journal entry that
// moves something from one account to another; nothing is created or destroyed except by a named flow across the
// edge of the model (a harvest coming in, a loss or a delivery going out, a buyer's payment arriving), and `audit`
// replays the journal to prove the state is what the entries say.
//
// What it promises (docs/gaming/spec-granada/04-ECONOMY-AND-SIMULATION.md):
//   - the player buys at ask and sells at bid, and ask is never below bid, so a round trip never makes money;
//   - a market has finite stock and finite cash: there is no infinite buyer;
//   - accepting a contract reserves goods and cash, and they are released or spent exactly once;
//   - a command with an id already seen returns the first result and changes nothing;
//   - a harvest that does not fit is never silently lost: the caller says what happens to the overflow.
//
// The numbers a scenario feeds it are game numbers, not historical prices.

export const ECONOMY_VERSION = 1;
/** Minor units in one dinar. */
export const MINOR = 100;
export const dinars = (n: number): number => n * MINOR;
/** The most units one command or one holding may carry, and the most a unit may cost: their product stays exact. */
export const MAX_UNITS = 100_000_000;
export const MAX_PRICE = 10_000_000;
/** The most money one account may hold (minor units). Anything that would pass it is refused, never wrapped. */
export const MAX_MONEY = 1_000_000_000_000_000;
/** a × b ÷ c, rounded down, exact whatever the size of the product. */
const mulDiv = (a: number, b: number, c: number): number => Number((BigInt(a) * BigInt(b)) / BigInt(c));

export interface Holding {
  quantity: number;
  /** Units promised to accepted contracts; they cannot be sold or processed. */
  reserved: number;
  /** What the units in hand cost to buy or make, in minor units. Sunk when they leave. */
  costBasis: number;
}
export interface MarketGood {
  inventory: number;
  /** The player buys at this price (minor units a unit). */
  ask: number;
  /** The player sells at this price. Never above ask. */
  bid: number;
}
export interface Market {
  /** Money the market has to buy with. */
  cash: number;
  goods: Record<string, MarketGood>;
}
export interface Contract {
  id: string;
  good: string;
  units: number;
  /** The tick after which an unfinished contract fails. */
  deadlineTick: number;
  /** Paid by the buyer in proportion to what is delivered. */
  revenue: number;
  /** Carriage and handling, paid by the player in proportion to what is delivered. */
  transport: number;
  fees: number;
  /** Charged once if the contract fails or is cancelled after acceptance. */
  penalty: number;
  state: "offered" | "accepted" | "settled" | "cancelled" | "failed";
  delivered: number;
  /** Units and cash still held for it. */
  reservedUnits: number;
  reservedCash: number;
  /** The part of a penalty the treasury could not pay when it fell due. It is owed, not forgotten. */
  owed: number;
}
export interface Recipe {
  id: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  /** Paid per run. */
  cost: number;
}
export interface Shipment {
  good: string;
  quantity: number;
  /** The cost basis that left the warehouse with it. */
  costBasis: number;
  /** Where it is going. A load for a contract that is no longer open when it arrives is sold there instead. */
  market: string;
  contract: string | null;
}
export interface JournalEntry {
  seq: number;
  tick: number;
  commandId: string;
  /** "money" or the id of a good. */
  asset: string;
  from: string;
  to: string;
  amount: number;
  why: string;
}
export interface EconomyState {
  version: number;
  /** Goes up by one with every command that changes anything. */
  stateVersion: number;
  tick: number;
  treasury: { available: number; reserved: number };
  /** Units the warehouse holds in all, every stored good counted alike (a first simplification). */
  capacity: number;
  /** Goods kept in the open yard (timber, stone): they take no room in the warehouse. */
  yard: string[];
  stock: Record<string, Holding>;
  markets: Record<string, Market>;
  contracts: Record<string, Contract>;
  recipes: Record<string, Recipe>;
  /** Goods that have left the warehouse and not yet arrived: each load on the road, bound for a market or for a contract. */
  road: Record<string, Shipment>;
  journal: JournalEntry[];
  /** Results by command id, so that a retry is answered and not repeated. */
  done: Record<string, CommandResult>;
}

export type OverflowPolicy = "refuse" | "leave" | "sell" | "lose";
export type EconomyCommand =
  | { kind: "buy"; market: string; good: string; quantity: number }
  | { kind: "sell"; market: string; good: string; quantity: number }
  | { kind: "harvest"; good: string; quantity: number; overflow: OverflowPolicy; market?: string }
  | { kind: "process"; recipe: string; runs: number }
  | { kind: "accept-contract"; contract: string }
  | { kind: "deliver"; contract: string; quantity: number }
  | { kind: "cancel-contract"; contract: string }
  | { kind: "advance"; ticks: number }
  /** Money leaving for a named purpose (a fee, a cost of works). */
  | { kind: "spend"; amount: number; why: string }
  /** Money arriving from outside the model for a named reason (a levy, a quest's reward). */
  | { kind: "earn"; amount: number; why: string }
  /** Goods used up: eaten, or built into something. `atMost` takes what there is instead of refusing. */
  | { kind: "consume"; good: string; quantity: number; why: string; atMost?: boolean }
  /** Room added to the warehouse by something built. */
  | { kind: "add-capacity"; units: number; why: string }
  /**
   * Goods leave the warehouse for a market, or for a contract at that market. They are on the road, in the books
   * and out of the store, until they arrive. For a contract, what was held for it goes first.
   */
  | { kind: "dispatch"; shipment: string; market: string; good: string; quantity: number; contract?: string }
  /**
   * A load arrives. For a contract still open it is delivered and paid for in proportion. Otherwise it is sold at
   * what the market pays that day, as far as the market's purse goes; what the market cannot pay for waits there.
   */
  | { kind: "arrive"; shipment: string }
  /**
   * A market's own day, apart from the player: goods come to it from its suppliers and leave it for its other
   * buyers, who pay it; and it sets the two prices it will keep until its next day. Every unit and every dinar is
   * journalled against the world, so the audit still closes. A price pair with ask below bid is refused whole.
   */
  | { kind: "market-day"; changes: Array<{ market: string; good: string; arrive: number; leave: number; paid: number; ask: number; bid: number }> };
export interface Envelope {
  commandId: string;
  /** The state the command was planned against. A stale number is refused, so nothing is decided on old prices. */
  expectedStateVersion: number;
  command: EconomyCommand;
  /**
   * A caller that will never send this command again may say so: its result is then not kept, and the record of
   * results does not grow with every command of a long game. A command that may be retried must not set it.
   */
  once?: boolean;
}
export type ErrorCode =
  | "stale-state"
  | "bad-quantity"
  | "unknown-market"
  | "unknown-good"
  | "unknown-recipe"
  | "unknown-contract"
  | "unknown-shipment"
  | "insufficient-funds"
  | "insufficient-stock"
  | "market-out-of-stock"
  | "market-short-of-cash"
  | "no-storage"
  | "overflow"
  | "wrong-contract-state"
  | "over-delivery"
  | "contract-expired"
  | "amount-too-large";
export type CommandResult =
  | { ok: true; stateVersion: number; money: number; stored: number; sold: number; lost: number; leftInField: number }
  | { ok: false; error: ErrorCode; detail?: Record<string, number> };

// ---- Reading -----------------------------------------------------------------------------------------------------------

export const stored = (s: EconomyState): number => Object.entries(s.stock).reduce((n, [good, h]) => n + (s.yard.includes(good) ? 0 : h.quantity), 0);
/** Room a good would need: nothing for what is kept in the yard. */
const roomFor = (s: EconomyState, good: string, quantity: number): number => (s.yard.includes(good) ? 0 : quantity);
export const freeCapacity = (s: EconomyState): number => s.capacity - stored(s);
const holding = (s: EconomyState, good: string): Holding => s.stock[good] ?? { quantity: 0, reserved: 0, costBasis: 0 };
export const unreserved = (s: EconomyState, good: string): number => holding(s, good).quantity - holding(s, good).reserved;
/** Cost basis that leaves with `q` of `quantity` units: an average, with the remainder leaving with the last unit. */
const basisOf = (h: Holding, q: number): number => (q >= h.quantity ? h.costBasis : mulDiv(h.costBasis, q, h.quantity));
/** Penalties that fell due and could not be paid in full. */
export const liabilities = (s: EconomyState): number => Object.values(s.contracts).reduce((n, c) => n + c.owed, 0);

// ---- Starting ----------------------------------------------------------------------------------------------------------

export interface Opening {
  treasury: number;
  capacity: number;
  yard?: string[];
  stock?: Record<string, { quantity: number; costBasis?: number }>;
  markets: Record<string, Market>;
  contracts?: Array<Omit<Contract, "state" | "delivered" | "reservedUnits" | "reservedCash" | "owed">>;
  recipes?: Recipe[];
}

export function open(o: Opening): EconomyState {
  const amount = (n: number, most: number, what: string) => {
    if (!Number.isSafeInteger(n) || n < 0 || n > most) throw new Error(`${what}: ${n} is not a whole amount between 0 and ${most}`);
  };
  amount(o.treasury, MAX_MONEY, "treasury");
  amount(o.capacity, MAX_UNITS, "capacity");
  for (const [good, h] of Object.entries(o.stock ?? {})) {
    amount(h.quantity, MAX_UNITS, `stock of ${good}`);
    amount(h.costBasis ?? 0, MAX_MONEY, `cost basis of ${good}`);
  }
  for (const [id, m] of Object.entries(o.markets)) {
    amount(m.cash, MAX_MONEY, `cash of market ${id}`);
    for (const [g, q] of Object.entries(m.goods)) {
      amount(q.inventory, MAX_UNITS, `market ${id}: stock of ${g}`);
      amount(q.ask, MAX_PRICE, `market ${id}: ask for ${g}`);
      amount(q.bid, MAX_PRICE, `market ${id}: bid for ${g}`);
      // A market that sold below what it pays would hand out money for carrying goods across its own counter.
      if (q.ask < q.bid) throw new Error(`market ${id}: ${g} is offered at ${q.ask} and bought at ${q.bid}; ask may not be below bid`);
    }
  }
  for (const c of o.contracts ?? []) {
    if (!Number.isSafeInteger(c.units) || c.units < 1 || c.units > MAX_UNITS) throw new Error(`contract ${c.id}: ${c.units} is not a whole number of units`);
    for (const [k, v] of [["revenue", c.revenue], ["transport", c.transport], ["fees", c.fees], ["penalty", c.penalty]] as const) amount(v, MAX_MONEY, `contract ${c.id}: ${k}`);
    amount(c.deadlineTick, Number.MAX_SAFE_INTEGER, `contract ${c.id}: deadline`);
  }
  for (const r of o.recipes ?? []) {
    amount(r.cost, MAX_PRICE, `recipe ${r.id}: cost`);
    for (const [g, n] of [...Object.entries(r.inputs), ...Object.entries(r.outputs)]) if (!Number.isSafeInteger(n) || n < 1 || n > 1000) throw new Error(`recipe ${r.id}: ${n} of ${g} is not a whole number between 1 and 1000`);
    if (Object.keys(r.inputs).length === 0 || Object.keys(r.outputs).length === 0) throw new Error(`recipe ${r.id} makes something from nothing, or nothing from something`);
  }
  const s: EconomyState = { version: ECONOMY_VERSION, stateVersion: 0, tick: 0, treasury: { available: 0, reserved: 0 }, capacity: o.capacity, yard: [...(o.yard ?? [])], stock: {}, markets: {}, contracts: {}, recipes: {}, road: {}, journal: [], done: {} };
  const j = writer(s, "opening");
  j("money", "world", "treasury", o.treasury, "opening balance");
  s.treasury.available = o.treasury;
  for (const [good, h] of Object.entries(o.stock ?? {})) {
    j(good, "world", "warehouse", h.quantity, "opening stock");
    s.stock[good] = { quantity: h.quantity, reserved: 0, costBasis: h.costBasis ?? 0 };
  }
  if (stored(s) > s.capacity) throw new Error("the opening stock does not fit the warehouse");
  for (const [id, m] of Object.entries(o.markets)) {
    j("money", "world", `market:${id}`, m.cash, "opening balance");
    s.markets[id] = { cash: m.cash, goods: {} };
    for (const [good, q] of Object.entries(m.goods)) {
      j(good, "world", `market:${id}`, q.inventory, "opening stock");
      s.markets[id]!.goods[good] = { ...q };
    }
  }
  for (const c of o.contracts ?? []) s.contracts[c.id] = { ...c, state: "offered", delivered: 0, reservedUnits: 0, reservedCash: 0, owed: 0 };
  for (const r of o.recipes ?? []) s.recipes[r.id] = r;
  return s;
}

function writer(s: EconomyState, commandId: string) {
  return (asset: string, from: string, to: string, amount: number, why: string): void => {
    if (amount === 0) return;
    if (!Number.isSafeInteger(amount) || amount < 0) throw new Error(`journal: ${amount} is not a whole, positive amount`);
    s.journal.push({ seq: s.journal.length, tick: s.tick, commandId, asset, from, to, amount, why });
  };
}

// ---- Commands ----------------------------------------------------------------------------------------------------------

const fail = (error: ErrorCode, detail?: Record<string, number>): CommandResult => ({ ok: false, error, ...(detail ? { detail } : {}) });
const whole = (n: number) => Number.isSafeInteger(n) && n > 0 && n <= MAX_UNITS;

/** What a command would do, without doing it. */
export function preview(state: EconomyState, env: Envelope): CommandResult {
  return submit(state, env).result;
}

/** Applies a command. The state passed in is never changed; a refused command returns it untouched. */
export function submit(state: EconomyState, env: Envelope): { state: EconomyState; result: CommandResult } {
  const seen = state.done[env.commandId];
  if (seen) return { state, result: seen };
  if (env.expectedStateVersion !== state.stateVersion) return { state, result: fail("stale-state", { stateVersion: state.stateVersion }) };
  // Journal entries and recorded results are never changed once written, so the copy shares them.
  const s: EconomyState = { ...structuredClone({ ...state, journal: [], done: {} }), journal: state.journal.slice(), done: { ...state.done } };
  const result = apply(s, env.command, writer(s, env.commandId));
  if (!result.ok) return { state, result };
  if (s.treasury.available > MAX_MONEY || Object.values(s.markets).some((m) => m.cash > MAX_MONEY) || Object.values(s.stock).some((h) => h.quantity > MAX_UNITS || h.costBasis > MAX_MONEY)) return { state, result: fail("amount-too-large") };
  s.stateVersion = state.stateVersion + 1;
  const done: CommandResult = { ...result, stateVersion: s.stateVersion };
  if (!env.once) s.done[env.commandId] = done;
  return { state: s, result: done };
}

type Write = ReturnType<typeof writer>;
const ok = (over: Partial<Extract<CommandResult, { ok: true }>> = {}): CommandResult => ({ ok: true, stateVersion: 0, money: 0, stored: 0, sold: 0, lost: 0, leftInField: 0, ...over });

function apply(s: EconomyState, cmd: EconomyCommand, j: Write): CommandResult {
  switch (cmd.kind) {
    case "buy": {
      const m = s.markets[cmd.market];
      if (!m) return fail("unknown-market");
      const q = m.goods[cmd.good];
      if (!q) return fail("unknown-good");
      if (!whole(cmd.quantity)) return fail("bad-quantity");
      if (q.inventory < cmd.quantity) return fail("market-out-of-stock", { available: q.inventory });
      const cost = q.ask * cmd.quantity;
      if (s.treasury.available < cost) return fail("insufficient-funds", { cost, available: s.treasury.available });
      if (freeCapacity(s) < roomFor(s, cmd.good, cmd.quantity)) return fail("no-storage", { free: freeCapacity(s) });
      j("money", "treasury", `market:${cmd.market}`, cost, "bought at ask");
      j(cmd.good, `market:${cmd.market}`, "warehouse", cmd.quantity, "bought at ask");
      s.treasury.available -= cost;
      m.cash += cost;
      q.inventory -= cmd.quantity;
      const h = holding(s, cmd.good);
      s.stock[cmd.good] = { quantity: h.quantity + cmd.quantity, reserved: h.reserved, costBasis: h.costBasis + cost };
      return ok({ money: -cost, stored: cmd.quantity });
    }
    case "sell": {
      const m = s.markets[cmd.market];
      if (!m) return fail("unknown-market");
      const q = m.goods[cmd.good];
      if (!q) return fail("unknown-good");
      if (!whole(cmd.quantity)) return fail("bad-quantity");
      if (unreserved(s, cmd.good) < cmd.quantity) return fail("insufficient-stock", { available: unreserved(s, cmd.good) });
      const revenue = q.bid * cmd.quantity;
      // A market pays with what it has: there is no infinite buyer.
      if (m.cash < revenue) return fail("market-short-of-cash", { canBuy: q.bid === 0 ? 0 : Math.floor(m.cash / q.bid) });
      sellFromStock(s, cmd.good, cmd.quantity);
      j(cmd.good, "warehouse", `market:${cmd.market}`, cmd.quantity, "sold at bid");
      j("money", `market:${cmd.market}`, "treasury", revenue, "sold at bid");
      m.cash -= revenue;
      q.inventory += cmd.quantity;
      s.treasury.available += revenue;
      return ok({ money: revenue, sold: cmd.quantity });
    }
    case "harvest": {
      if (!whole(cmd.quantity)) return fail("bad-quantity");
      const free = s.yard.includes(cmd.good) ? cmd.quantity : freeCapacity(s);
      const fits = Math.min(cmd.quantity, Math.max(0, free));
      const over = cmd.quantity - fits;
      // A harvest that does not fit is the player's decision, never a silent loss.
      if (over > 0 && cmd.overflow === "refuse") return fail("overflow", { expected: cmd.quantity, free, overflow: over });
      let sold = 0;
      let money = 0;
      if (over > 0 && cmd.overflow === "sell") {
        const m = cmd.market ? s.markets[cmd.market] : undefined;
        if (!m) return fail("unknown-market");
        const q = m.goods[cmd.good];
        if (!q) return fail("unknown-good");
        sold = Math.min(over, q.bid === 0 ? 0 : Math.floor(m.cash / q.bid));
        money = q.bid * sold;
        j(cmd.good, "field", `market:${cmd.market}`, sold, "harvest sold from the field at bid");
        j("money", `market:${cmd.market}`, "treasury", money, "harvest sold from the field at bid");
        m.cash -= money;
        q.inventory += sold;
        s.treasury.available += money;
      }
      const lost = cmd.overflow === "lose" ? over : 0;
      j(cmd.good, "field", "warehouse", fits, "harvest stored");
      j(cmd.good, "field", "loss", lost, "harvest with nowhere to go");
      if (fits > 0) {
        const h = holding(s, cmd.good);
        s.stock[cmd.good] = { quantity: h.quantity + fits, reserved: h.reserved, costBasis: h.costBasis };
      }
      return ok({ money, stored: fits, sold, lost, leftInField: over - sold - lost });
    }
    case "process": {
      const r = s.recipes[cmd.recipe];
      if (!r) return fail("unknown-recipe");
      if (!whole(cmd.runs)) return fail("bad-quantity");
      for (const [good, n] of Object.entries(r.inputs)) if (unreserved(s, good) < n * cmd.runs) return fail("insufficient-stock", { available: unreserved(s, good) });
      const fee = r.cost * cmd.runs;
      if (s.treasury.available < fee) return fail("insufficient-funds", { cost: fee, available: s.treasury.available });
      const inUnits = Object.entries(r.inputs).reduce((a, [good, n]) => a + roomFor(s, good, n * cmd.runs), 0);
      const outUnits = Object.entries(r.outputs).reduce((a, [good, n]) => a + roomFor(s, good, n * cmd.runs), 0);
      if (freeCapacity(s) + inUnits < outUnits) return fail("no-storage", { free: freeCapacity(s) + inUnits });
      // What the inputs cost goes with them into what they become.
      let basis = fee;
      for (const [good, n] of Object.entries(r.inputs)) {
        basis += sellFromStock(s, good, n * cmd.runs);
        j(good, "warehouse", "processed", n * cmd.runs, `used by ${r.id}`);
      }
      j("money", "treasury", "world", fee, `running ${r.id}`);
      s.treasury.available -= fee;
      const outputs = Object.entries(r.outputs);
      outputs.forEach(([good, n], i) => {
        const share = i === outputs.length - 1 ? basis - Math.floor(basis / outputs.length) * (outputs.length - 1) : Math.floor(basis / outputs.length);
        j(good, "processed", "warehouse", n * cmd.runs, `made by ${r.id}`);
        const h = holding(s, good);
        s.stock[good] = { quantity: h.quantity + n * cmd.runs, reserved: h.reserved, costBasis: h.costBasis + share };
      });
      return ok({ money: -fee, stored: outUnits - inUnits });
    }
    case "accept-contract": {
      const c = s.contracts[cmd.contract];
      if (!c) return fail("unknown-contract");
      if (c.state !== "offered") return fail("wrong-contract-state");
      // An offer whose deadline has passed can no longer be taken up, only to fail at the next tick.
      if (s.tick > c.deadlineTick) return fail("contract-expired", { deadlineTick: c.deadlineTick, tick: s.tick });
      const costs = c.transport + c.fees;
      if (s.treasury.available < costs) return fail("insufficient-funds", { cost: costs, available: s.treasury.available });
      // What can be promised now is set aside now; the rest must be found before the deadline.
      const units = Math.min(c.units, unreserved(s, c.good));
      j("money", "treasury", "treasury:reserved", costs, `held for contract ${c.id}`);
      j(c.good, "warehouse", "warehouse:reserved", units, `held for contract ${c.id}`);
      s.treasury.available -= costs;
      s.treasury.reserved += costs;
      if (units > 0) s.stock[c.good] = { ...holding(s, c.good), reserved: holding(s, c.good).reserved + units };
      Object.assign(c, { state: "accepted", reservedUnits: units, reservedCash: costs });
      return ok();
    }
    case "deliver": {
      const c = s.contracts[cmd.contract];
      if (!c) return fail("unknown-contract");
      if (c.state !== "accepted") return fail("wrong-contract-state");
      if (!whole(cmd.quantity)) return fail("bad-quantity");
      if (c.delivered + cmd.quantity > c.units) return fail("over-delivery", { remaining: c.units - c.delivered });
      const fromReserve = Math.min(cmd.quantity, c.reservedUnits);
      const fromFree = cmd.quantity - fromReserve;
      if (unreserved(s, c.good) < fromFree) return fail("insufficient-stock", { available: unreserved(s, c.good) + c.reservedUnits });
      // Paid in proportion to what has arrived, worked out from the running total so that no part is paid twice.
      const total = c.delivered + cmd.quantity;
      const share = (amount: number) => mulDiv(amount, total, c.units) - mulDiv(amount, c.delivered, c.units);
      const revenue = share(c.revenue);
      const costs = share(c.transport + c.fees);
      j(c.good, "warehouse:reserved", "world", fromReserve, `delivered on contract ${c.id}`);
      j(c.good, "warehouse", "world", fromFree, `delivered on contract ${c.id}`);
      j("money", "world", "treasury", revenue, `paid on contract ${c.id}`);
      j("money", "treasury:reserved", "world", costs, `carriage and handling for contract ${c.id}`);
      const h = holding(s, c.good);
      s.stock[c.good] = { quantity: h.quantity - cmd.quantity, reserved: h.reserved - fromReserve, costBasis: h.costBasis - basisOf(h, cmd.quantity) };
      s.treasury.available += revenue;
      s.treasury.reserved -= costs;
      Object.assign(c, { delivered: total, reservedUnits: c.reservedUnits - fromReserve, reservedCash: c.reservedCash - costs });
      if (total === c.units) c.state = "settled";
      return ok({ money: revenue - costs, sold: cmd.quantity });
    }
    case "dispatch": {
      const m = s.markets[cmd.market];
      if (!m) return fail("unknown-market");
      if (!whole(cmd.quantity) || !cmd.shipment || s.road[cmd.shipment]) return fail("bad-quantity");
      const c = cmd.contract === undefined ? null : s.contracts[cmd.contract];
      if (cmd.contract !== undefined && !c) return fail("unknown-contract");
      let fromReserve = 0;
      if (c) {
        if (c.state !== "accepted" || c.good !== cmd.good) return fail("wrong-contract-state");
        const coming = Object.values(s.road).reduce((n, r) => n + (r.contract === c.id ? r.quantity : 0), 0);
        if (c.delivered + coming + cmd.quantity > c.units) return fail("over-delivery", { remaining: c.units - c.delivered - coming });
        fromReserve = Math.min(cmd.quantity, c.reservedUnits);
      } else if (!m.goods[cmd.good]) return fail("unknown-good");
      const fromFree = cmd.quantity - fromReserve;
      if (unreserved(s, cmd.good) < fromFree) return fail("insufficient-stock", { available: unreserved(s, cmd.good) + fromReserve });
      const h = holding(s, cmd.good);
      const basis = basisOf(h, cmd.quantity);
      j(cmd.good, "warehouse:reserved", "road", fromReserve, `sent on contract ${c?.id}`);
      j(cmd.good, "warehouse", "road", fromFree, c ? `sent on contract ${c.id}` : `sent to ${cmd.market}`);
      s.stock[cmd.good] = { quantity: h.quantity - cmd.quantity, reserved: h.reserved - fromReserve, costBasis: h.costBasis - basis };
      if (c) c.reservedUnits -= fromReserve;
      s.road[cmd.shipment] = { good: cmd.good, quantity: cmd.quantity, costBasis: basis, market: cmd.market, contract: c ? c.id : null };
      return ok();
    }
    case "arrive": {
      const r = s.road[cmd.shipment];
      if (!r) return fail("unknown-shipment");
      const c = r.contract === null ? null : s.contracts[r.contract];
      if (c && c.state === "accepted" && c.delivered + r.quantity <= c.units) {
        // Paid in proportion to what has arrived, worked out from the running total so that no part is paid twice.
        const total = c.delivered + r.quantity;
        const share = (amount: number) => mulDiv(amount, total, c.units) - mulDiv(amount, c.delivered, c.units);
        const revenue = share(c.revenue);
        const costs = share(c.transport + c.fees);
        j(r.good, "road", "world", r.quantity, `delivered on contract ${c.id}`);
        j("money", "world", "treasury", revenue, `paid on contract ${c.id}`);
        j("money", "treasury:reserved", "world", costs, `carriage and handling for contract ${c.id}`);
        s.treasury.available += revenue;
        s.treasury.reserved -= costs;
        Object.assign(c, { delivered: total, reservedCash: c.reservedCash - costs });
        if (total === c.units) c.state = "settled";
        delete s.road[cmd.shipment];
        return ok({ money: revenue - costs, sold: r.quantity });
      }
      // No contract, or one that closed while the load was on the road: sold at what the market pays today.
      const m = s.markets[r.market];
      const q = m?.goods[r.good];
      if (!m || !q) return fail("unknown-market");
      const n = q.bid === 0 ? r.quantity : Math.min(r.quantity, Math.floor(m.cash / q.bid));
      const revenue = q.bid * n;
      j(r.good, "road", `market:${r.market}`, n, "sold at bid on arrival");
      j("money", `market:${r.market}`, "treasury", revenue, "sold at bid on arrival");
      m.cash -= revenue;
      q.inventory += n;
      s.treasury.available += revenue;
      if (n === r.quantity) delete s.road[cmd.shipment];
      else s.road[cmd.shipment] = { ...r, quantity: r.quantity - n, costBasis: r.costBasis - mulDiv(r.costBasis, n, r.quantity), contract: null };
      return ok({ money: revenue, sold: n, leftInField: r.quantity - n });
    }
    case "cancel-contract": {
      const c = s.contracts[cmd.contract];
      if (!c) return fail("unknown-contract");
      if (c.state !== "accepted") return fail("wrong-contract-state");
      return ok({ money: -close(s, c, "cancelled", j) });
    }
    case "spend": {
      if (!whole(cmd.amount) && cmd.amount !== 0) return fail("bad-quantity");
      if (cmd.amount > MAX_MONEY) return fail("amount-too-large");
      if (s.treasury.available < cmd.amount) return fail("insufficient-funds", { cost: cmd.amount, available: s.treasury.available });
      j("money", "treasury", "world", cmd.amount, cmd.why);
      s.treasury.available -= cmd.amount;
      return ok({ money: -cmd.amount });
    }
    case "earn": {
      if (!Number.isSafeInteger(cmd.amount) || cmd.amount < 0 || cmd.amount > MAX_MONEY) return fail("bad-quantity");
      j("money", "world", "treasury", cmd.amount, cmd.why);
      s.treasury.available += cmd.amount;
      return ok({ money: cmd.amount });
    }
    case "consume": {
      if (!whole(cmd.quantity)) return fail("bad-quantity");
      const have = unreserved(s, cmd.good);
      if (have < cmd.quantity && !cmd.atMost) return fail("insufficient-stock", { available: have });
      const used = Math.min(have, cmd.quantity);
      if (used > 0) sellFromStock(s, cmd.good, used);
      j(cmd.good, "warehouse", "used", used, cmd.why);
      // What could not be supplied is reported as left over, never invented.
      return ok({ sold: used, leftInField: cmd.quantity - used });
    }
    case "market-day": {
      const count = (n: number) => Number.isSafeInteger(n) && n >= 0 && n <= MAX_UNITS;
      for (const c of cmd.changes) {
        const m = s.markets[c.market];
        if (!m) return fail("unknown-market");
        const q = m.goods[c.good];
        if (!q) return fail("unknown-good");
        if (!count(c.arrive) || !count(c.leave) || c.leave > q.inventory + c.arrive) return fail("bad-quantity");
        if (!Number.isSafeInteger(c.paid) || c.paid < 0 || c.paid > MAX_MONEY) return fail("bad-quantity");
        if (!Number.isSafeInteger(c.ask) || !Number.isSafeInteger(c.bid) || c.bid < 0 || c.ask < c.bid || c.ask > MAX_PRICE) return fail("bad-quantity");
        j(c.good, "world", `market:${c.market}`, c.arrive, "came to market");
        j(c.good, `market:${c.market}`, "world", c.leave, "sold on by the market");
        j("money", "world", `market:${c.market}`, c.paid, "paid to the market by its other buyers");
        m.goods[c.good] = { inventory: q.inventory + c.arrive - c.leave, ask: c.ask, bid: c.bid };
        m.cash += c.paid;
      }
      return ok();
    }
    case "add-capacity": {
      if (!whole(cmd.units) || s.capacity + cmd.units > MAX_UNITS) return fail("bad-quantity");
      s.capacity += cmd.units;
      return ok({ stored: cmd.units });
    }
    case "advance": {
      if (!whole(cmd.ticks)) return fail("bad-quantity");
      s.tick += cmd.ticks;
      let money = 0;
      for (const c of Object.values(s.contracts)) if (c.state === "accepted" && s.tick > c.deadlineTick) money -= close(s, c, "failed", j);
      return ok({ money });
    }
  }
}

/** Takes unreserved units out of the warehouse and returns the cost basis that leaves with them. */
function sellFromStock(s: EconomyState, good: string, quantity: number): number {
  const h = holding(s, good);
  const basis = basisOf(h, quantity);
  s.stock[good] = { quantity: h.quantity - quantity, reserved: h.reserved, costBasis: h.costBasis - basis };
  return basis;
}

/** Ends an accepted contract short: what was held for it goes back, once, and the disclosed penalty is charged. */
function close(s: EconomyState, c: Contract, state: "cancelled" | "failed", j: Write): number {
  j("money", "treasury:reserved", "treasury", c.reservedCash, `released from contract ${c.id}`);
  j(c.good, "warehouse:reserved", "warehouse", c.reservedUnits, `released from contract ${c.id}`);
  s.treasury.available += c.reservedCash;
  s.treasury.reserved -= c.reservedCash;
  if (c.reservedUnits > 0) s.stock[c.good] = { ...holding(s, c.good), reserved: holding(s, c.good).reserved - c.reservedUnits };
  // The penalty cannot take the treasury below nothing: what cannot be paid stays on the contract as owed.
  const penalty = Math.min(c.penalty, s.treasury.available);
  j("money", "treasury", "world", penalty, `penalty on contract ${c.id}`);
  s.treasury.available -= penalty;
  Object.assign(c, { state, reservedUnits: 0, reservedCash: 0, owed: c.penalty - penalty });
  return penalty;
}

// ---- Proof -------------------------------------------------------------------------------------------------------------

/**
 * Replays the journal and compares it with the state. Returns what does not agree (empty when sound): every
 * unit of money and goods the state holds must be accounted for by entries, and nothing may be negative.
 */
export function audit(s: EconomyState): string[] {
  const bad: string[] = [];
  const balance = new Map<string, number>();
  const key = (account: string, asset: string) => `${account}|${asset}`;
  for (const e of s.journal) {
    balance.set(key(e.from, e.asset), (balance.get(key(e.from, e.asset)) ?? 0) - e.amount);
    balance.set(key(e.to, e.asset), (balance.get(key(e.to, e.asset)) ?? 0) + e.amount);
  }
  const expect = (account: string, asset: string, actual: number) => {
    const booked = balance.get(key(account, asset)) ?? 0;
    if (booked !== actual) bad.push(`${account} holds ${actual} of ${asset} but the journal says ${booked}`);
    if (actual < 0) bad.push(`${account} holds a negative amount of ${asset}: ${actual}`);
  };
  expect("treasury", "money", s.treasury.available);
  expect("treasury:reserved", "money", s.treasury.reserved);
  const goods = new Set<string>(Object.keys(s.stock));
  for (const [id, m] of Object.entries(s.markets)) {
    expect(`market:${id}`, "money", m.cash);
    for (const [good, q] of Object.entries(m.goods)) {
      goods.add(good);
      expect(`market:${id}`, good, q.inventory);
      if (q.ask < q.bid) bad.push(`market ${id} sells ${good} below what it pays for it`);
    }
  }
  const onRoad = new Map<string, number>();
  for (const r of Object.values(s.road ?? {})) {
    goods.add(r.good);
    onRoad.set(r.good, (onRoad.get(r.good) ?? 0) + r.quantity);
    if (r.quantity <= 0 || r.costBasis < 0) bad.push(`a load of ${r.good} on the road is ${r.quantity} with a cost basis of ${r.costBasis}`);
  }
  for (const good of goods) expect("road", good, onRoad.get(good) ?? 0);
  for (const good of goods) {
    const h = holding(s, good);
    expect("warehouse", good, h.quantity - h.reserved);
    expect("warehouse:reserved", good, h.reserved);
    if (h.reserved > h.quantity || h.costBasis < 0) bad.push(`${good}: reserved ${h.reserved} of ${h.quantity}, cost basis ${h.costBasis}`);
  }
  if (stored(s) > s.capacity) bad.push(`the warehouse holds ${stored(s)} in room for ${s.capacity}`);
  if (new Set(s.yard).size !== s.yard.length) bad.push("a good is listed in the yard twice");
  const heldUnits = new Map<string, number>();
  let heldCash = 0;
  for (const c of Object.values(s.contracts)) {
    heldUnits.set(c.good, (heldUnits.get(c.good) ?? 0) + c.reservedUnits);
    heldCash += c.reservedCash;
    if (c.delivered > c.units) bad.push(`contract ${c.id} has taken more than it asked for`);
    if (c.state !== "accepted" && (c.reservedUnits !== 0 || c.reservedCash !== 0)) bad.push(`contract ${c.id} is ${c.state} and still holds something`);
    if (c.owed < 0 || c.owed > c.penalty) bad.push(`contract ${c.id} owes ${c.owed} on a penalty of ${c.penalty}`);
  }
  if (heldCash !== s.treasury.reserved) bad.push(`contracts hold ${heldCash} in cash but ${s.treasury.reserved} is reserved`);
  for (const good of goods) if ((heldUnits.get(good) ?? 0) !== holding(s, good).reserved) bad.push(`contracts hold ${heldUnits.get(good) ?? 0} ${good} but ${holding(s, good).reserved} are reserved`);
  return bad;
}

/** A short, stable fingerprint of a state: two runs of the same commands must give the same one. */
export function fingerprint(s: EconomyState): string {
  const text = JSON.stringify({ ...s, done: Object.keys(s.done).sort() });
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return h.toString(16).padStart(8, "0");
}
