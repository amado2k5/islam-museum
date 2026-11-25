// The simulation lab: plays whole campaigns with scripted players and reports what it finds.
// It answers four questions the specification asks before any art is made for a game: can the scenario be won in
// more than one way; can it be won by one cheap trick; can the rules be pushed into a state that should not exist;
// and does every campaign reach an end.
import { Rng } from "@im/kernel/prng";
import { makePolicies, type Policy } from "./policies";
import { invariants, learned, newGame, score, step, type Scenario, type State } from "./rules";

export interface CampaignResult {
  policy: string;
  seed: number;
  outcome: State["outcome"];
  seasons: number;
  score: number;
  households: number;
  welfare: number;
  learned: number;
  treasury: number;
  commands: number;
  violations: string[];
}

export function playCampaign(scenario: Scenario, policy: Policy, seed: number): CampaignResult {
  let s = newGame(scenario, seed);
  const rng = new Rng(`lab:${policy.name}:${seed}`);
  const violations: string[] = [...invariants(s)];
  let commands = 0;
  // A campaign must end within its seasons. The guard is twice that: reaching it is itself a finding.
  for (let guard = 0; s.outcome === "playing" && guard < scenario.seasons * 2; guard++) {
    for (const cmd of policy.plan(scenario, s, rng)) {
      s = step(scenario, s, cmd);
      commands++;
      const bad = invariants(s);
      if (bad.length && violations.length < 5) violations.push(...bad.map((b) => `season ${s.season}: ${b}`));
      if (s.outcome !== "playing") break;
    }
  }
  if (s.outcome === "playing") violations.push("the campaign did not end");
  return { policy: policy.name, seed, outcome: s.outcome, seasons: s.season, score: score(scenario, s), households: s.households, welfare: s.welfare, learned: learned(s), treasury: s.treasury, commands, violations };
}

export interface PolicySummary {
  policy: string;
  campaigns: number;
  won: number;
  ended: number;
  lostInsolvent: number;
  lostUnrest: number;
  winPermille: number;
  meanScore: number;
  minScore: number;
  maxScore: number;
  meanHouseholds: number;
  meanWelfare: number;
  meanLearned: number;
  meanTreasury: number;
  violations: number;
}

export interface LabReport {
  scenario: string;
  seeds: number;
  campaigns: number;
  policies: PolicySummary[];
  violations: string[];
  findings: string[];
}

/** The policies that stand for real ways of playing; the rest are probes that must not win. */
export const REAL_STRATEGIES = ["irrigator", "merchant", "scholar", "balanced"];

export function runLab(scenario: Scenario, seeds: number, firstSeed = 1): LabReport {
  const policies = makePolicies(step);
  const summaries: PolicySummary[] = [];
  const violations: string[] = [];
  let campaigns = 0;
  for (const policy of policies) {
    const results: CampaignResult[] = [];
    for (let i = 0; i < seeds; i++) results.push(playCampaign(scenario, policy, firstSeed + i));
    campaigns += results.length;
    const n = results.length;
    const sum = (f: (r: CampaignResult) => number) => results.reduce((a, r) => a + f(r), 0);
    const won = results.filter((r) => r.outcome === "won").length;
    for (const r of results) for (const v of r.violations) if (violations.length < 20) violations.push(`${policy.name} seed ${r.seed}: ${v}`);
    summaries.push({
      policy: policy.name,
      campaigns: n,
      won,
      ended: results.filter((r) => r.outcome === "ended").length,
      lostInsolvent: results.filter((r) => r.outcome === "lost-insolvent").length,
      lostUnrest: results.filter((r) => r.outcome === "lost-unrest").length,
      winPermille: Math.round((won * 1000) / n),
      meanScore: Math.round(sum((r) => r.score) / n),
      minScore: Math.min(...results.map((r) => r.score)),
      maxScore: Math.max(...results.map((r) => r.score)),
      meanHouseholds: Math.round(sum((r) => r.households) / n),
      meanWelfare: Math.round(sum((r) => r.welfare) / n),
      meanLearned: Math.round(sum((r) => r.learned) / n),
      meanTreasury: Math.round(sum((r) => r.treasury) / n),
      violations: sum((r) => r.violations.length),
    });
  }
  const findings: string[] = [];
  const real = summaries.filter((p) => REAL_STRATEGIES.includes(p.policy));
  const probes = summaries.filter((p) => !REAL_STRATEGIES.includes(p.policy));
  const viable = real.filter((p) => p.winPermille >= 200);
  if (viable.length < 3) findings.push(`only ${viable.length} of ${real.length} real strategies win at least one campaign in five: ${real.map((p) => `${p.policy} ${p.winPermille / 10}%`).join(", ")}`);
  for (const p of real) if (p.winPermille > 950) findings.push(`${p.policy} wins ${p.winPermille / 10}% of campaigns: the scenario is too easy for it to be a decision`);
  for (const p of probes) if (p.won > 0) findings.push(`the probe "${p.policy}" won ${p.won} of ${p.campaigns} campaigns: a degenerate way to win`);
  const bestReal = Math.max(...real.map((p) => p.meanScore));
  for (const p of probes) if (p.meanScore >= bestReal) findings.push(`the probe "${p.policy}" scores as well as the best real strategy (${p.meanScore} against ${bestReal})`);
  for (const p of real) if (p.meanTreasury > scenario.start.treasury * 5) findings.push(`${p.policy} ends with ${p.meanTreasury} coins on average, more than five times the starting treasury: money piles up with nothing to spend it on`);
  if (violations.length) findings.push(`${violations.length} invariant violations (first: ${violations[0]})`);
  return { scenario: scenario.id, seeds, campaigns, policies: summaries, violations, findings };
}
