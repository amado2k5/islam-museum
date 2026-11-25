// The village's simulation lab: every scripted player through the scenario over many seeds (the seed decides the
// weather), with every rule checked after every day. It reports who wins, why the others lose, what each ends with,
// and what it finds wrong with the design. A finding is printed, never tuned away silently.
// Usage: npx tsx --tsconfig tsconfig.json games/granada/tools/village-lab.ts [seeds=1000] [scenario=water-for-the-valley] [--json <file>]
import { writeFileSync } from "node:fs";
import { PLAYERS, REAL_PLAYERS, playVillage } from "@im/granada/sim/players";
import { SCENARIOS } from "@im/granada/sim/scenarios";
import { QUESTS, newVillage, reserveDays, treasuryOf } from "@im/granada/sim/village";

const seeds = Number(process.argv[2] ?? 1000);
const sc = SCENARIOS[process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "water-for-the-valley"]!;
const jsonAt = process.argv.indexOf("--json");
const began = Date.now();
const rows: Array<Record<string, unknown>> = [];
let violations = 0;
const mean = (xs: number[]) => (xs.length ? Math.round((10 * xs.reduce((a, b) => a + b, 0)) / xs.length) / 10 : 0);
for (const [name, player] of Object.entries(PLAYERS)) {
  let wins = 0;
  const reasons: Record<string, number> = {};
  const ends = { welfare: [] as number[], households: [] as number[], reserve: [] as number[], dinars: [] as number[], score: [] as number[], spoiled: [] as number[] };
  const quests: Record<string, number> = Object.fromEntries(QUESTS.map((q) => [q, 0]));
  for (let seed = 1; seed <= seeds; seed++) {
    const c = playVillage(sc, newVillage(sc, seed), player, seed);
    violations += c.violations.length;
    if (c.violations.length) console.error(`${name} seed ${seed}: ${c.violations[0]}`);
    const o = c.state.outcome!;
    if (o.won) wins += 1;
    else for (const r of o.reasons) reasons[r] = (reasons[r] ?? 0) + 1;
    for (const q of QUESTS) if (c.state.quests[q]) quests[q]! += 1;
    ends.welfare.push(c.state.welfare);
    ends.households.push(c.state.households);
    ends.reserve.push(reserveDays(c.state));
    ends.dinars.push(Math.floor(treasuryOf(c.state) / 100));
    ends.score.push(o.score);
    ends.spoiled.push(Object.values(c.state.plots).reduce((n, p) => n + p.spoiled, 0));
  }
  rows.push({ player: name, winPercent: Math.round((1000 * wins) / seeds) / 10, welfare: mean(ends.welfare), households: mean(ends.households), reserveDays: mean(ends.reserve), dinars: mean(ends.dinars), score: mean(ends.score), spoiled: mean(ends.spoiled), questsDonePercent: Object.fromEntries(Object.entries(quests).map(([q, n]) => [q, Math.round((100 * n) / seeds)])), lostFor: reasons });
}
const findings: string[] = [];
const real = rows.filter((r) => REAL_PLAYERS.includes(r.player as string));
const viable = real.filter((r) => (r.winPercent as number) >= 20);
if (viable.length < 3) findings.push(`only ${viable.length} of ${real.length} real ways of playing win at least one campaign in five (${viable.map((r) => r.player).join(", ") || "none"}); the design asks for three`);
for (const r of real) if ((r.winPercent as number) >= 95) findings.push(`${r.player} wins ${r.winPercent}% of campaigns: it cannot lose`);
for (const r of rows) if (!REAL_PLAYERS.includes(r.player as string) && (r.winPercent as number) > 5) findings.push(`${r.player}, which is not a way of playing, wins ${r.winPercent}%`);
for (const r of real) if ((r.dinars as number) > 2500) findings.push(`${r.player} ends with ${r.dinars} dinars unspent: money has too little to do`);
if (violations) findings.push(`${violations} rule violations`);
const report = { scenario: sc.id, seeds, campaigns: seeds * rows.length, violations, seconds: Math.round((Date.now() - began) / 100) / 10, rows, findings };
console.log(`${sc.id}: ${report.campaigns} campaigns over ${seeds} seeds in ${report.seconds} s; ${violations} rule violations`);
console.log("player      win%  welfare  households  reserve  dinars  score  spoiled  quests done % (q01..q05)   lost for");
for (const r of rows) console.log(`${String(r.player).padEnd(10)} ${String(r.winPercent).padStart(5)}  ${String(r.welfare).padStart(7)}  ${String(r.households).padStart(10)}  ${String(r.reserveDays).padStart(7)}  ${String(r.dinars).padStart(6)}  ${String(r.score).padStart(5)}  ${String(r.spoiled).padStart(7)}  ${Object.values(r.questsDonePercent as Record<string, number>).map((n) => String(n).padStart(3)).join(" ")}        ${JSON.stringify(r.lostFor)}`);
console.log(findings.length ? `findings:\n${findings.map((f) => `  - ${f}`).join("\n")}` : "no finding");
if (jsonAt > 0) writeFileSync(process.argv[jsonAt + 1]!, `${JSON.stringify(report, null, 1)}\n`);
