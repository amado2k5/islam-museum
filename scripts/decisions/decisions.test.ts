import { describe, expect, it } from "vitest";
import { advisory, decide, type Precedent } from "./decide";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

// Minimal precedent fixture — the real precedents.yaml is exercised separately.
const precedents: Precedent[] = [
  {
    id: "D-004",
    kind: "decision-record",
    provenance_status: "founder-ruled",
    title: "Use the existing ideas wing for invention records",
    summary: "Invention records live in the existing ideas wing as a kind, not a new class or side table.",
    source_file: "docs/inventions/phases.md",
  },
  {
    id: "D-002",
    kind: "decision-record",
    provenance_status: "founder-ruled",
    title: "Deploys stay founder-only and manual",
    summary: "Production and UAT deployments are triggered only by the founder because of R2 and Cloudflare cost.",
    source_file: "docs/agents/workflow.md",
  },
];

describe("decide pipeline (POC)", () => {
  it("routes non-delegable questions to the founder docket in conservative mode", () => {
    const d = decide({ question: "Should we deploy this batch to production now?" }, precedents, "conservative");
    expect(d.status).toBe("founder-docket");
    expect(d.step).toBe("policy-gate");
  });

  it("autonomous mode decides gated surfaces instead of docking", () => {
    const d = decide({ question: "Should we deploy this batch to production now?" }, precedents, "autonomous");
    expect(d.status).toBe("decided");
    expect(d.step).toBe("autonomous-override");
    expect(String(d.decision)).toContain("deploy");
  });

  it("advisory redirects gated proposals to the engine's safe alternative", () => {
    const d = advisory(
      { question: "Delete the deprecated endpoints from the export API script?", proposed_action: "drop the endpoints", proposed_by: "test" },
      precedents,
      "autonomous",
    );
    expect(d.verdict).toBe("redirect");
    expect((d.engine_decision as { decision: string }).decision).toContain("never delete");
  });

  it("rejects hard-block content outright", () => {
    const d = decide({ question: "Add a figurative portrait of the Prophet to the gallery" }, precedents);
    expect(d.status).toBe("rejected");
    expect(d.step).toBe("hard-reject");
  });

  it("matches a precedent above threshold and cites it", () => {
    const d = decide(
      { question: "Where should invention browser records live — a new class or the existing wing?" },
      precedents,
    );
    expect(d.status).toBe("decided");
    expect(d.step).toBe("precedent");
    expect((d.precedent as { id: string }).id).toBe("D-004");
  });

  it("does not treat negated mentions as policy hits", () => {
    const d = decide({ question: "Render-QA crawl: authorise a read-only crawl — building locally is a check, not a deploy" }, precedents);
    expect(d.status).not.toBe("founder-docket");
    const d2 = decide({ question: "Should we deploy this batch to production now?" }, precedents, "conservative");
    expect(d2.status).toBe("founder-docket");
  });

  it("ignores flag-kind precedents (observations are not rulings)", () => {
    const withFlag = [
      ...precedents,
      { id: "flag-x", kind: "flag", title: "canon decisions process founder books ledger", summary: "canon decisions are founder-only; Phase 1 is founder-bound", source_file: "docs/x.md" },
    ];
    const d = decide({ question: "Canon decision process for undecided canon books ledger checks" }, withFlag);
    expect(d.step).not.toBe("precedent");
  });

  it("falls back to a conservative reversible default with no precedent", () => {
    const d = decide({ question: "Zorblax qwerty flux capacitor alignment for the nebula wing?" }, precedents);
    expect(d.status).toBe("decided");
    expect(d.step).toBe("safe-default");
    expect(d.reversible).toBe(true);
    expect(d.needs_precedent).toBe(true);
  });

  it("loads the real precedents.yaml without parse errors", () => {
    const p = join(process.cwd(), "docs/decisions/precedents.yaml");
    const doc = parse(readFileSync(p, "utf8")) as { precedents: unknown[] };
    expect(doc.precedents.length).toBeGreaterThan(100);
  });
});
