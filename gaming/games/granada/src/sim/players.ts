// Scripted players for the village: each is a way a person might run the valley, written down so that the lab can
// play it thousands of times. They see only what a player sees (the state and the forecast-free rules), and their
// commands go through the same `act` as a player's. They exist to find what breaks and what dominates; a scripted
// win says nothing about whether the game is enjoyable.
import { Rng } from "@im/kernel/prng";
import { dinars } from "./economy";
import { CROPS, act, invariants, reserveDays, seasonOf, tasksOf, tick, treasuryOf, type Scenario, type VillageCommand, type VillageState } from "./village";

export type Player = (sc: Scenario, s: VillageState, rng: Rng) => VillageCommand[];
const stock = (s: VillageState, good: string) => s.economy.stock[good]?.quantity ?? 0;
const ripe = (s: VillageState) => Object.entries(s.plots).filter(([, p]) => p.ripeSince !== null && p.standing > 0 && p.harvesting === null).map(([id]) => id);
/** Houses standing and under way. */
const houses = (s: VillageState) => s.built.house + s.works.filter((w) => w.kind === "house").length;
const sellAll = (s: VillageState, good: string): VillageCommand[] => (stock(s, good) > 0 ? [{ kind: "sell", good, quantity: stock(s, good) }] : []);
/** Buys grain when the reserve runs low, leaving a little money in hand. */
const topUp = (s: VillageState, below: number, keep: number): VillageCommand[] => (reserveDays(s) < below && treasuryOf(s) > dinars(keep + 26 * 20) ? [{ kind: "buy", good: "wheat", quantity: 20 }] : []);
/** Sows the first fallow field that can take the crop now. */
const sow = (sc: Scenario, s: VillageState, crop: "vegetables" | "wheat"): VillageCommand[] =>
  sc.plots.filter((p) => s.plots[p.id]!.crop === null && p.potential[crop] !== undefined && CROPS[crop].sowIn.includes(seasonOf(s.day))).map((p) => ({ kind: "plant", plot: p.id, crop }) as VillageCommand);

/** What is on the road for a contract, and what it still wants sent: what it asks, less what has arrived and what is coming. */
const coming = (s: VillageState, contract: string) => s.shipments.reduce((n, sh) => n + (sh.contract === contract ? sh.quantity : 0), 0);
const toSend = (s: VillageState, c: { id: string; units: number; delivered: number }) => c.units - c.delivered - coming(s, c.id);
/** Answers every open question the same way. */
const answer = (sc: Scenario, s: VillageState, option: string): VillageCommand[] => (sc.decisions ?? []).filter((d) => s.decisions[d.id]?.state === "open" && d.options.some((o) => o.id === option)).map((d) => ({ kind: "decide", decision: d.id, option }) as VillageCommand);

/**
 * A year played for trade, in the ways the three trading stewards differ: how they answer the neighbours, whether
 * they open the meadow, how many days of food they keep, and how many cisterns they build.
 */
function trading(sc: Scenario, s: VillageState, how: { answer: string; meadow: boolean; reserve: number; cisterns?: number; take?: string[] }): VillageCommand[] {
  const out: VillageCommand[] = [...answer(sc, s, how.answer), ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand)];
  const contracts = (sc.trade?.contracts ?? []).map((c) => s.economy.contracts[c.id]!).filter(Boolean);
  for (const c of contracts) if (c.state === "offered" && (!how.take || how.take.includes(c.good))) out.push({ kind: "accept", contract: c.id });
  if (how.meadow) out.push({ kind: "expand" });
  out.push(...sow(sc, s, "vegetables"), ...sow(sc, s, "wheat"));
  const cisterns = s.placed.filter((p) => p.what === "cistern").length;
  if (sc.catalogue?.cistern && cisterns < Math.max(how.cisterns ?? 1, ...tasksOf(sc).map((x) => (x.kind === "placed" && x.what === "cistern" ? x.n : 0)))) {
    // The stone for it is bought if the works have taken what there was.
    if (stock(s, "stone") < sc.catalogue.cistern.stone) out.push({ kind: "buy", good: "stone", quantity: sc.catalogue.cistern.stone - stock(s, "stone") });
    out.push({ kind: "place", what: "cistern", x: 560, z: 60 + 30 * cisterns });
  }
  if (sc.catalogue?.house && s.households >= s.housing && s.placed.filter((p) => p.what === "house").length < 2) out.push({ kind: "place", what: "house", x: 600 + 40 * s.placed.filter((p) => p.what === "house").length, z: 250 });
  const press = sc.trade?.press;
  const oilOwed = contracts.filter((c) => c.state === "accepted" && c.good === "oil").reduce((n, c) => n + toSend(s, c), 0);
  if (press && stock(s, "olives") >= 5) out.push({ kind: "press", runs: Math.floor(stock(s, "olives") / 5) });
  // The terrace is in and pressed, and the promise is still short: the village's olives make up the rest.
  const terrace = Object.values(s.plots).find((p) => p.crop === "olives");
  const short = oilOwed - stock(s, "oil");
  if (press && short > 0 && terrace && terrace.ripeSince !== null && terrace.standing === 0 && stock(s, "olives") < 5) out.push({ kind: "buy", good: "olives", quantity: Math.min(short * 5, s.economy.markets.village!.goods.olives?.inventory ?? 0) });
  for (const c of contracts) {
    if (c.state !== "accepted") continue;
    // Food is delivered only out of what is over the winter's reserve.
    const spare = c.good === "oil" ? stock(s, "oil") : Math.max(0, stock(s, c.good) - (reserveDays(s) > 30 ? 0 : 60));
    const n = Math.min(toSend(s, c), spare, (sc.trade?.port.cartsPerDay ?? 0) - s.carted);
    if (n > 0) out.push({ kind: "deliver", contract: c.id, quantity: n });
  }
  if (oilOwed === 0 && stock(s, "oil") > 0) out.push({ kind: "send", good: "oil", quantity: stock(s, "oil") });
  return [...out, ...topUp(s, how.reserve, 150)];
}

export const PLAYERS: Record<string, Player> = {
  /** Does nothing at all. It must lose: a game that plays itself is not one. */
  idle: () => [],
  /** The cheap repair, olives for cash, grain bought when the store runs low. */
  mender: (sc, s) => [...answer(sc, s, "share"), ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand), { kind: "repair" }, { kind: "build", what: "granary" }, ...sow(sc, s, "vegetables"), ...(houses(s) < 1 ? [{ kind: "build", what: "house" } as VillageCommand] : []), ...sellAll(s, "olives"), ...topUp(s, 25, 100)],
  /** The great works: water for the meadow, vegetables grown there, less bought. */
  builder: (sc, s) => [...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand), { kind: "expand" }, { kind: "build", what: "granary" }, ...sow(sc, s, "vegetables"), ...sow(sc, s, "wheat"), ...(houses(s) < 2 ? [{ kind: "build", what: "house" } as VillageCommand] : []), ...sellAll(s, "olives"), ...topUp(s, 18, 60)],
  /** Sells what will not fit straight from the field, keeps a thin reserve, and lives by the market. */
  merchant: (sc, s) => [
    ...answer(sc, s, "refuse"),
    ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "sell" }) as VillageCommand),
    { kind: "repair" },
    ...(houses(s) < 2 ? [{ kind: "build", what: "house" } as VillageCommand] : []),
    ...sow(sc, s, "vegetables"),
    ...sellAll(s, "olives"),
    ...(reserveDays(s) > 40 ? [{ kind: "sell", good: "wheat", quantity: 10 } as VillageCommand] : []),
    ...topUp(s, 22, 0),
  ],
  /** Fields before households when water is short, and everything built. */
  irrigator: (sc, s) => [{ kind: "water-first", who: "fields" }, ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand), { kind: "expand" }, ...sow(sc, s, "vegetables"), { kind: "build", what: "granary" }, ...(houses(s) < 3 ? [{ kind: "build", what: "house" } as VillageCommand] : []), ...sellAll(s, "olives")],
  /** The mender's valley, with the olives pressed: the port's contract taken on the first day, oil sent as it is made, and what is over sold at the port. */
  presser: (sc, s) => {
    const c = sc.trade ? s.economy.contracts[sc.trade.contracts[0]!.id] : undefined;
    const oil = stock(s, "oil");
    const owed = c?.state === "accepted" ? toSend(s, c) : 0;
    return [
      ...answer(sc, s, "share"),
      ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand),
      { kind: "repair" },
      { kind: "build", what: "granary" },
      ...sow(sc, s, "vegetables"),
      ...(houses(s) < 1 ? [{ kind: "build", what: "house" } as VillageCommand] : []),
      ...(c?.state === "offered" ? [{ kind: "accept", contract: c.id } as VillageCommand] : []),
      ...(stock(s, "olives") >= 5 ? [{ kind: "press", runs: Math.floor(stock(s, "olives") / 5) } as VillageCommand] : []),
      ...(c && owed > 0 && oil > 0 ? [{ kind: "deliver", contract: c.id, quantity: Math.min(owed, oil) } as VillageCommand] : []),
      ...(owed === 0 && oil > 0 ? [{ kind: "send", good: "oil", quantity: oil } as VillageCommand] : []),
      ...topUp(s, 25, 100),
    ];
  },
  /**
   * The second year's way: every contract taken on the first day, the meadow opened for vegetables, the olives
   * pressed (and bought, if the terrace falls short of what was promised), a cistern and a house on open ground,
   * and what is owed delivered as soon as it is in the store.
   */
  trader: (sc, s) => trading(sc, s, { answer: "refuse", meadow: true, reserve: 26 }),
  /** Oil only: the port's oil contract taken, and every vegetable kept for the households. */
  oilman: (sc, s) => trading(sc, s, { answer: "refuse", meadow: true, reserve: 24, take: ["oil"] }),
  /** Vegetables only: the greens contract taken, and the olives pressed and sold at the port as they come. */
  greengrocer: (sc, s) => trading(sc, s, { answer: "refuse", meadow: true, reserve: 26, take: ["vegetables"] }),
  /** The same trade without the great works: vegetables in the mill field only, and grain bought for the winter. A probe: can the meadow be done without? */
  provisioner: (sc, s) => trading(sc, s, { answer: "refuse", meadow: false, reserve: 30 }),
  /** The oil merchant who also sells the neighbours their water: the same year, with the other answer. */
  sharer: (sc, s) => trading(sc, s, { answer: "share", meadow: true, reserve: 24, take: ["oil"] }),
  /**
   * The careful steward of the long-run tool: mends and extends the channel, sows every fallow field, takes every
   * contract and sends on it as goods come in, keeps the neighbours' water, buys grain before it builds, and builds
   * only what the year asks for. It is here so that the lab can say how a careful hand fares in each year.
   */
  careful: (sc, s) => {
    const out: VillageCommand[] = [...answer(sc, s, "refuse"), ...ripe(s).map((plot) => ({ kind: "harvest", plot, rest: "wait" }) as VillageCommand), { kind: "repair" }, { kind: "expand" }];
    for (const def of sc.plots) if (s.plots[def.id]!.crop === null) out.push({ kind: "plant", plot: def.id, crop: "vegetables" }, { kind: "plant", plot: def.id, crop: "wheat" });
    const contracts = (sc.trade?.contracts ?? []).map((c) => s.economy.contracts[c.id]!).filter(Boolean);
    for (const c of contracts) if (c.state === "offered") out.push({ kind: "accept", contract: c.id });
    if (sc.trade && stock(s, "olives") >= 5) out.push({ kind: "press", runs: Math.floor(stock(s, "olives") / 5) });
    for (const c of contracts) {
      if (c.state !== "accepted") continue;
      const n = Math.min(toSend(s, c), c.good === "oil" ? stock(s, "oil") : Math.max(0, stock(s, c.good) - 60));
      if (n > 0) out.push({ kind: "deliver", contract: c.id, quantity: n });
    }
    const days = reserveDays(s);
    if (days < 26 && treasuryOf(s) > dinars(300)) out.push({ kind: "buy", good: "wheat", quantity: 20 });
    const houses = s.placed.filter((p) => p.what === "house").length;
    if (sc.catalogue?.house && s.households >= s.housing && houses < s.year && days >= 20) out.push({ kind: "place", what: "house", x: 600 + 40 * houses, z: 250 });
    const cisterns = s.placed.filter((p) => p.what === "cistern").length;
    const wanted = Math.max(0, ...tasksOf(sc).map((x) => (x.kind === "placed" && x.what === "cistern" ? x.n : 0)));
    if (sc.catalogue?.cistern && cisterns < wanted) {
      if (stock(s, "stone") < sc.catalogue.cistern.stone) out.push({ kind: "buy", good: "stone", quantity: sc.catalogue.cistern.stone - stock(s, "stone") });
      out.push({ kind: "place", what: "cistern", x: 560, z: 60 + 30 * cisterns });
    }
    if (sc.catalogue?.granary && !s.placed.some((p) => p.what === "granary")) out.push({ kind: "place", what: "granary", x: -420, z: 60 });
    return out;
  },
  /** Any command, any day. It must never break a rule, and should rarely win. */
  random: (sc, s, rng) => {
    const plots = sc.plots.map((p) => p.id);
    const goods = Object.keys(sc.market.goods);
    const pick = <T>(xs: T[]) => xs[rng.int(0, xs.length - 1)]!;
    const all: VillageCommand[] = [
      { kind: "repair" },
      { kind: "expand" },
      { kind: "build", what: pick(["house", "granary"] as const) },
      { kind: "harvest", plot: pick(plots), rest: pick(["wait", "sell"] as const) },
      { kind: "plant", plot: pick(plots), crop: pick(["wheat", "olives", "vegetables"] as const) },
      { kind: "sell", good: pick(goods), quantity: rng.int(1, 200) },
      { kind: "buy", good: pick(goods), quantity: rng.int(1, 200) },
      { kind: "water-first", who: pick(["households", "fields"] as const) },
      { kind: "field-first", plot: pick([...plots, null, "nowhere"]) },
      ...(sc.decisions ?? []).map((d) => ({ kind: "decide", decision: pick([d.id, "nothing"]), option: pick([...d.options.map((o) => o.id), "neither"]) }) as VillageCommand),
      ...(sc.catalogue ? [{ kind: "place", what: pick([...Object.keys(sc.catalogue), "nothing"]), x: rng.int(-500, 800), z: rng.int(-300, 340) } as VillageCommand] : []),
      ...(sc.trade
        ? ([
            { kind: "press", runs: rng.int(1, 12) },
            { kind: "send", good: pick(Object.keys(sc.trade.port.carriage)), quantity: rng.int(1, 80) },
            { kind: "accept", contract: sc.trade.contracts[0]!.id },
            { kind: "deliver", contract: sc.trade.contracts[0]!.id, quantity: rng.int(1, 10) },
          ] as VillageCommand[])
        : []),
    ];
    return rng.chance(0.5) ? [pick(all), pick(all)] : [];
  },
};
/** The players that stand for ways a person might really play. */
export const REAL_PLAYERS = ["mender", "builder", "merchant", "irrigator", "presser", "trader", "oilman", "greengrocer", "sharer", "careful"];

export interface Campaign {
  state: VillageState;
  violations: string[];
  accepted: number;
  refused: number;
  questDay: Record<string, number>;
}
/** Plays a whole scenario with one player and one seed, checking every rule after every day. */
export function playVillage(sc: Scenario, start: VillageState, player: Player, seed: number): Campaign {
  const rng = new Rng(`${sc.id}:${seed}`);
  let s = start;
  const out: Campaign = { state: s, violations: [], accepted: 0, refused: 0, questDay: {} };
  while (!s.outcome) {
    for (const command of player(sc, s, rng)) {
      const r = act(sc, s, command);
      if (r.result.ok) out.accepted += 1;
      else {
        out.refused += 1;
        if (r.state !== s) out.violations.push(`day ${s.day}: a refused command changed the state`);
      }
      s = r.state;
    }
    const day = s.day;
    s = tick(sc, s);
    for (const [q, done] of Object.entries(s.quests)) if (done && out.questDay[q] === undefined) out.questDay[q] = day;
    const bad = invariants(sc, s);
    if (bad.length) out.violations.push(`day ${day}: ${bad.join("; ")}`);
    if (out.violations.length > 5) break;
  }
  out.state = s;
  return out;
}
