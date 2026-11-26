// Scripted players for the village: each is a way a person might run the valley, written down so that the lab can
// play it thousands of times. They see only what a player sees (the state and the forecast-free rules), and their
// commands go through the same `act` as a player's. They exist to find what breaks and what dominates; a scripted
// win says nothing about whether the game is enjoyable.
import { Rng } from "@im/kernel/prng";
import { dinars } from "./economy";
import { CROPS, act, invariants, reserveDays, seasonOf, tick, treasuryOf, type Scenario, type VillageCommand, type VillageState } from "./village";

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

/** Answers every open question the same way. */
const answer = (sc: Scenario, s: VillageState, option: string): VillageCommand[] => (sc.decisions ?? []).filter((d) => s.decisions[d.id]?.state === "open" && d.options.some((o) => o.id === option)).map((d) => ({ kind: "decide", decision: d.id, option }) as VillageCommand);

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
    const owed = c?.state === "accepted" ? c.units - c.delivered : 0;
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
export const REAL_PLAYERS = ["mender", "builder", "merchant", "irrigator", "presser"];

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
