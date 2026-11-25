// Runs the Golden Age simulation lab. Usage: npx tsx tools/simlab.ts [seeds=1000] [scenario=failing-canal] [out.json]
import { writeFileSync } from "node:fs";
import { runLab } from "../games/golden-age/src/lab";
import { SCENARIOS } from "../games/golden-age/src/scenarios";

const seeds = Number(process.argv[2] ?? 1000);
const scenario = SCENARIOS[process.argv[3] ?? "failing-canal"];
if (!scenario) throw new Error(`unknown scenario; have ${Object.keys(SCENARIOS).join(", ")}`);
const started = performance.now();
const report = runLab(scenario, seeds);
const ms = Math.round(performance.now() - started);
console.log(`${report.scenario}: ${report.campaigns} campaigns (${seeds} seeds x ${report.policies.length} players) in ${ms} ms`);
console.log("player          win%   mean score (min-max)   households  welfare  learned  treasury   ended  insolvent  unrest");
for (const p of report.policies) console.log(`${p.policy.padEnd(14)} ${(p.winPermille / 10).toFixed(1).padStart(5)}   ${String(p.meanScore).padStart(5)} (${p.minScore}-${p.maxScore})`.padEnd(46) + `${String(p.meanHouseholds).padStart(8)} ${String(p.meanWelfare).padStart(8)} ${String(p.meanLearned).padStart(8)} ${String(p.meanTreasury).padStart(9)} ${String(p.ended).padStart(7)} ${String(p.lostInsolvent).padStart(10)} ${String(p.lostUnrest).padStart(7)}`);
console.log(report.findings.length ? `FINDINGS (${report.findings.length}):\n- ${report.findings.join("\n- ")}` : "No findings: at least three real strategies win, no probe wins, no invariant broke, every campaign ended.");
if (process.argv[4]) writeFileSync(process.argv[4], JSON.stringify({ ...report, ms }, null, 1) + "\n");
