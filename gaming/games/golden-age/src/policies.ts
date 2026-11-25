// Scripted players for the simulation lab. Each is a plain rule of thumb a person might follow, written down so
// that a thousand campaigns can be played with it. They exist to find out whether more than one way of playing
// works, whether one cheap trick beats everything, and whether the rules can be driven into a broken state.
// None of them cheats: each asks preview() what is legal, as the interface does.
import { Rng } from "@im/kernel/prng";
import { BUILDINGS, BUILDING_TYPES, FARM_YIELD, FARM_YIELD_ROTATION, GRID_H, GRID_W, PLOTS, RESEARCH, RESEARCH_IDS, distance, has, housingCapacity, intakeCapacity, jobs, plotOf, preview, servedByWater, wateredPlots, xyOf, type BuildingType, type Command, type ResearchId, type Scenario, type State } from "./rules";

export interface Policy {
  name: string;
  /** Commands for this season, ending with end-season. May not look at the future beyond state.events. */
  plan(scenario: Scenario, state: State, rng: Rng): Command[];
}

const count = (s: State, t: BuildingType) => s.plots.filter((b) => b === t).length;
const of = (s: State, t: BuildingType) => s.plots.flatMap((b, p) => (b === t ? [p] : []));
const empty = (s: State) => s.plots.flatMap((b, p) => (b === null ? [p] : []));

/** The free plot that best suits a building: near water for those that need it, near houses for those that serve them. */
function bestPlot(s: State, t: BuildingType): number | null {
  const wet = wateredPlots(s);
  const houses = of(s, "house");
  const markets = of(s, "market");
  let best: number | null = null;
  let bestScore = -Infinity;
  for (const p of empty(s)) {
    let v = 0;
    const watered = servedByWater(wet, p) ? 1 : 0;
    const nearHouses = houses.filter((h) => distance(h, p) <= 3).length;
    if (t === "farm") v = watered * 10 - nearHouses - xyOf(p)[1] * 0.1;
    else if (t === "house") v = watered * 4 + Math.min(4, nearHouses) + (markets.some((m) => distance(m, p) <= 3) ? 2 : 0);
    else if (t === "workshop") v = watered * 6 + (markets.some((m) => distance(m, p) <= 4) ? 5 : 0);
    else if (t === "bath" || t === "hospital") v = watered * 8 + nearHouses * 2;
    else if (t === "granary") v = -nearHouses * 0.2;
    else v = nearHouses * 2; // market, school, library: put them among the houses
    v -= p * 0.001; // stable tie-break
    if (v > bestScore) {
      bestScore = v;
      best = p;
    }
  }
  return best;
}

/** A canal link that extends the network toward dry farms or houses, or opens a new intake at the bank. */
function nextCanal(s: State): Command | null {
  const wet = wateredPlots(s);
  const want = s.plots.flatMap((b, p) => ((b === "farm" || b === "house" || b === "bath" || b === "workshop") && !servedByWater(wet, p) ? [p] : []));
  let best: Command | null = null;
  let bestD = Infinity;
  for (let p = 0; p < PLOTS; p++) {
    const [x, y] = xyOf(p);
    const neighbours = [x > 0 ? p - 1 : -1, x < GRID_W - 1 ? p + 1 : -1, y > 0 ? p - GRID_W : -1, y < GRID_H - 1 ? p + GRID_W : -1].filter((q) => q >= 0);
    for (const q of neighbours) {
      if (q < p) continue;
      const cmd: Command = { type: "canal", a: p, b: q };
      if (preview(s, cmd).reason && preview(s, cmd).reason !== "no-funds") continue;
      // Value: how close the new wet plot gets to something that wants water (or simply further inland if nothing does).
      const fresh = wet[p] ? q : wet[q] ? p : xyOf(p)[1] === 0 ? q : p;
      const d = want.length ? Math.min(...want.map((w) => distance(w, fresh))) : 10 - xyOf(fresh)[1];
      if (d < bestD) {
        bestD = d;
        best = cmd;
      }
    }
  }
  return best;
}

const researchOrder = (order: ResearchId[]) => (s: State): Command | null => {
  if (s.research) return null;
  for (const id of order) if (!has(s, id) && (!RESEARCH[id].needs || has(s, RESEARCH[id].needs!))) return { type: "research", id };
  return null;
};

/** Runs a list of wishes in order, doing each while it is legal and leaving a reserve in the treasury. */
function act(scenario: Scenario, start: State, wishes: Array<(s: State) => Command | null>, reserve: number, step: (s: State, c: Command) => State): Command[] {
  const out: Command[] = [];
  let s = start;
  for (let guard = 0; guard < 40; guard++) {
    let did = false;
    for (const wish of wishes) {
      const cmd = wish(s);
      if (!cmd) continue;
      const p = preview(s, cmd);
      if (!p.ok || s.treasury - p.cost < reserve) continue;
      out.push(cmd);
      s = step(s, cmd);
      did = true;
      break;
    }
    if (!did) break;
  }
  void scenario;
  out.push({ type: "end-season" });
  return out;
}

const build = (t: BuildingType) => (s: State): Command | null => {
  const plot = bestPlot(s, t);
  return plot === null ? null : { type: "build", building: t, plot };
};
const when = (test: (s: State) => boolean, wish: (s: State) => Command | null) => (s: State) => (test(s) ? wish(s) : null);
const dryWanters = (s: State) => {
  const wet = wateredPlots(s);
  return s.plots.some((b, p) => (b === "farm" || b === "bath") && !servedByWater(wet, p));
};
// A year is two and a half full harvests, and a household eats four measures a year: so one watered farm feeds
// about 37 households. Plan farms for the people expected next year, and only where there is water to grow with.
const farmsWanted = (s: State) => Math.ceil(((s.households + 16) * 4 * 1000) / ((has(s, "crop-rotation") ? FARM_YIELD_ROTATION : FARM_YIELD) * 2500));
const farmWaterOk = (s: State) => !s.last || s.last.waterShare[1] >= 900;
const hungry = (s: State) => count(s, "farm") < farmsWanted(s) && farmWaterOk(s);
const full = (s: State) => s.households >= housingCapacity(s) - 4;
const silted = (s: State): Command | null => (s.canalCondition < 800 ? { type: "clear-silt" } : null);
const taxTo = (level: 0 | 1 | 2) => (s: State): Command | null => (s.tax === level ? null : { type: "tax", level });

// More than a third of households without work: the ledger shows it as lost welfare, and any player would answer it.
const idle = (s: State) => s.households - jobs(s) > s.households / 3;
// In the last year and a half, with money in hand and welfare short of the goal, ease the tax.
const easeTax = (sc: Scenario) => (s: State): Command | null => (s.season >= sc.seasons - 7 && s.tax > 0 && s.treasury > 60 && s.welfare < sc.goal.welfare + 4 ? { type: "tax", level: 0 } : null);
const droughtComing = (s: State) => s.events.some((e) => e.kind === "drought" && e.season >= s.season);
const short = (s: State, t: BuildingType, perHouses: number) => count(s, t) < Math.ceil(count(s, "house") / perHouses);
const rich = (n: number) => (s: State) => s.treasury > n;
const both = (...tests: Array<(s: State) => boolean>) => (s: State) => tests.every((t) => t(s));

export function makePolicies(step: (scenario: Scenario, s: State, c: Command) => State): Policy[] {
  const run = (scenario: Scenario, s: State, wishes: Array<(s: State) => Command | null>, reserve: number) => act(scenario, s, wishes, reserve, (st, c) => step(scenario, st, c));
  return [
    {
      // Water and food first: clear the canal, extend it to dry farms, farm, store against a bad year; then people and schools.
      name: "irrigator",
      plan: (sc, s) =>
        run(sc, s, [
          researchOrder(["lined-canals", "crop-rotation", "water-wheel", "paper", "medicine"]),
          silted,
          when(dryWanters, nextCanal),
          when(hungry, build("farm")),
          when((x) => count(x, "granary") < 1 && count(x, "farm") >= 3, build("granary")),
          when((x) => droughtComing(x) && count(x, "granary") < 2, build("granary")),
          when((x) => count(x, "school") < 1, build("school")),
          when(full, build("house")),
          when((x) => short(x, "bath", 4), build("bath")),
          when((x) => count(x, "market") < 1 && count(x, "house") >= 6, build("market")),
          when((x) => short(x, "school", 5), build("school")),
          when(both(idle, rich(60)), build("workshop")),
          when(both(rich(140), (x) => has(x, "paper") && count(x, "library") < 1), build("library")),
          easeTax(sc),
        ], 15),
    },
    {
      // Coin first: a market and a workshop at once, tax kept normal, and the profit put into houses, baths and schools.
      name: "merchant",
      plan: (sc, s) =>
        run(sc, s, [
          researchOrder(["paper", "crop-rotation", "lined-canals", "medicine", "water-wheel"]),
          when((x) => count(x, "market") < 1, build("market")),
          when(hungry, build("farm")),
          when((x) => count(x, "workshop") < count(x, "market"), build("workshop")),
          when(full, build("house")),
          when((x) => short(x, "market", 5), build("market")),
          when(both(rich(70), (x) => count(x, "school") < 1), build("school")),
          when((x) => x.canalCondition < 700, silted),
          when(dryWanters, nextCanal),
          when(both(rich(60), (x) => short(x, "bath", 4)), build("bath")),
          when(both(rich(120), (x) => short(x, "school", 5)), build("school")),
          when(both(rich(150), (x) => count(x, "granary") < 1), build("granary")),
          when(both(rich(200), (x) => has(x, "paper") && count(x, "library") < 1), build("library")),
          when(both(rich(220), (x) => has(x, "medicine") && count(x, "hospital") < 1), build("hospital")),
        ], 20),
    },
    {
      // Learning and health first: a school at once, baths, then the library and hospital that research opens.
      name: "scholar",
      plan: (sc, s) =>
        run(sc, s, [
          researchOrder(["paper", "medicine", "lined-canals", "crop-rotation", "water-wheel"]),
          when((x) => count(x, "school") < 1, build("school")),
          when(hungry, build("farm")),
          when((x) => x.canalCondition < 750, silted),
          when((x) => count(x, "bath") < 1, build("bath")),
          when((x) => count(x, "market") < 1 && x.season >= 3, build("market")),
          when((x) => has(x, "paper") && count(x, "library") < 1, build("library")),
          when(dryWanters, nextCanal),
          when(full, build("house")),
          when((x) => short(x, "school", 4), build("school")),
          when((x) => has(x, "medicine") && count(x, "hospital") < 1, build("hospital")),
          when((x) => short(x, "bath", 4), build("bath")),
          when(both(idle, rich(70)), build("workshop")),
          when(both(rich(130), (x) => count(x, "granary") < 1), build("granary")),
          easeTax(sc),
        ], 12),
    },
    {
      // Whatever is weakest gets the next coin.
      name: "balanced",
      plan: (sc, s) =>
        run(sc, s, [
          researchOrder(["lined-canals", "paper", "crop-rotation", "medicine", "water-wheel"]),
          silted,
          when(hungry, build("farm")),
          when(dryWanters, nextCanal),
          when((x) => count(x, "school") < 1, build("school")),
          when((x) => count(x, "market") < 1, build("market")),
          when(full, build("house")),
          when((x) => short(x, "bath", 4), build("bath")),
          when((x) => count(x, "granary") < 1 && count(x, "farm") >= 3, build("granary")),
          when((x) => count(x, "workshop") < 1 && count(x, "market") >= 1, build("workshop")),
          when((x) => has(x, "paper") && count(x, "library") < 1, build("library")),
          when((x) => short(x, "school", 5), build("school")),
        ], 15),
    },
    {
      // Does nothing at all. A scenario that can be won by doing nothing has no decisions in it.
      name: "idle",
      plan: () => [{ type: "end-season" }],
    },
    {
      // Squeezes: top tax, nothing built. If this wins, taxation is broken.
      name: "tax-only",
      plan: (sc, s) => run(sc, s, [taxTo(2)], 0),
    },
    ...BUILDING_TYPES.filter((t) => !BUILDINGS[t].needs).map(
      (t): Policy => ({
        // Builds one kind of building whenever it can afford it, and nothing else. If one of these wins, that building is a dominant strategy.
        name: `only-${t}`,
        plan: (sc, s) => run(sc, s, [build(t)], 0),
      }),
    ),
    {
      // Random legal moves: a search for states the rules should never reach.
      name: "random",
      plan: (sc, s, rng) => {
        const out: Command[] = [];
        let st = s;
        const moves = rng.int(0, 4);
        for (let i = 0; i < moves; i++) {
          const roll = rng.int(0, 9);
          let cmd: Command;
          if (roll < 5) cmd = { type: "build", building: rng.pick(BUILDING_TYPES), plot: rng.int(0, PLOTS - 1) };
          else if (roll < 7) {
            const a = rng.int(0, PLOTS - 1);
            const [x, y] = xyOf(a);
            cmd = { type: "canal", a, b: rng.chance(0.5) && x < GRID_W - 1 ? plotOf(x + 1, y) : y < GRID_H - 1 ? plotOf(x, y + 1) : a };
          } else if (roll === 7) cmd = { type: "tax", level: rng.pick([0, 1, 2] as const) };
          else if (roll === 8) cmd = { type: "research", id: rng.pick([...RESEARCH_IDS, null]) };
          else cmd = rng.chance(0.5) ? { type: "demolish", plot: rng.int(0, PLOTS - 1) } : { type: "clear-silt" };
          if (!preview(st, cmd).ok) continue;
          out.push(cmd);
          st = step(sc, st, cmd);
        }
        out.push({ type: "end-season" });
        return out;
      },
    },
  ];
}

export { intakeCapacity };
