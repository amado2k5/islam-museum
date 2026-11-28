// Founder rule, 28 November 2026: production is deployed at most once an hour, to keep R2 Class A operations down.
// Every website workflow that publishes to production starts with the "Hourly spacing" job (deploy-spacing.yml),
// and the jobs that publish wait for it; the list of workflows the guard counts is the list of those that call it.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const dir = join(import.meta.dirname, "..", ".github", "workflows");
const load = (f: string) => parse(readFileSync(join(dir, f), "utf8")) as { on: any; jobs: Record<string, any> };
const ENV_WORKFLOWS = ["./.github/workflows/deploy-env.yml", "./.github/workflows/deploy-lang-env.yml", "./.github/workflows/deploy-shared-env.yml"];

/** Website workflows (not the reusable ones) with a job that publishes to production. */
const production = readdirSync(dir)
  .filter((f) => f.endsWith(".yml") && !f.endsWith("-env.yml"))
  .filter((f) => Object.values(load(f).jobs ?? {}).some((j: any) => ENV_WORKFLOWS.includes(j.uses) && j.with?.environment === "production"));

describe("hourly spacing of production deploys", () => {
  it("finds the production deploys", () => {
    expect(production).toContain("deploy.yml");
    expect(production).toContain("deploy-exp-all-parts.yml");
    expect(production.length).toBeGreaterThanOrEqual(11);
  });

  it("the guard counts exactly the workflows that call it", () => {
    const guard = load("deploy-spacing.yml");
    const listed = String(guard.jobs.check.steps[0].env.WORKFLOWS).split(/\s+/).filter(Boolean).sort();
    expect(listed).toEqual([...production].sort());
  });

  for (const f of production) {
    it(`${f} waits for the spacing job before it publishes`, () => {
      const wf = load(f);
      expect(wf.jobs.spacing?.uses, f).toBe("./.github/workflows/deploy-spacing.yml");
      expect(wf.jobs.spacing?.name).toBe("Hourly spacing");
      expect(wf.on.workflow_dispatch.inputs.urgent?.default).toBe(false);
      // Every publishing job waits for the spacing job, directly or through a job that does.
      const waits = (name: string, seen = new Set<string>()): boolean => {
        if (name === "spacing") return true;
        if (seen.has(name)) return false;
        seen.add(name);
        const needs = [wf.jobs[name]?.needs ?? []].flat() as string[];
        return needs.some((n) => waits(n, seen));
      };
      for (const [name, job] of Object.entries(wf.jobs)) if (ENV_WORKFLOWS.includes((job as any).uses)) expect(waits(name), `${f}: ${name}`).toBe(true);
    });
  }
});
