// Prints one Golden Age campaign season by season. Usage: npx tsx tools/simtrace.ts <policy> [seed=1] [scenario]
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../games/golden-age/src/policies";
import { BUILDING_TYPES, housingCapacity, intakeCapacity, learned, newGame, score, step } from "../games/golden-age/src/rules";
import { SCENARIOS } from "../games/golden-age/src/scenarios";

const scenario = SCENARIOS[process.argv[4] ?? "failing-canal"]!;
const policy = makePolicies(step).find((p) => p.name === (process.argv[2] ?? "balanced"));
if (!policy) throw new Error("unknown policy");
const seed = Number(process.argv[3] ?? 1);
let s = newGame(scenario, seed);
const rng = new Rng(`lab:${policy.name}:${seed}`);
console.log("ssn  hh/cap  welf>tgt  coins  (tax trade sales -upkeep)  grain harv hunger  water need/sup shares      know  staff  did");
while (s.outcome === "playing") {
  const cmds = policy.plan(scenario, s, rng);
  for (const c of cmds) s = step(scenario, s, c);
  const r = s.last!;
  const did = cmds.filter((c) => c.type !== "end-season").map((c) => (c.type === "build" ? c.building : c.type === "research" ? `r:${c.id}` : c.type)).join(",");
  console.log(`${String(r.season).padStart(3)}  ${String(s.households).padStart(3)}/${String(housingCapacity(s)).padEnd(3)} ${String(s.welfare).padStart(4)}>${String(r.welfareTarget).padEnd(3)} ${String(s.treasury).padStart(6)}  (${r.income.tax} ${r.income.trade} ${r.income.sales} -${r.upkeep})`.padEnd(54) + ` ${String(s.grain).padStart(4)} ${String(r.harvest).padStart(4)} ${String(r.hungerPermille).padStart(5)}   ${r.waterNeed}/${r.waterSupply} ${r.waterShare.join("/")}`.padEnd(40) + ` ${String(learned(s)).padStart(4)} ${String(r.staffingPermille).padStart(5)}  ${r.events.join("+")} ${did}`);
}
console.log(`outcome ${s.outcome}  score ${score(scenario, s)}  buildings ${BUILDING_TYPES.map((t) => `${t}:${s.plots.filter((b) => b === t).length}`).join(" ")}  canals ${s.canals.length}  intake ${intakeCapacity(s)}  researched ${s.researched.join(",")}`);
