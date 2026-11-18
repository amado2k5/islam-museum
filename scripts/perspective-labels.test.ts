import { describe, expect, it } from "vitest";
import { prosePerspectiveIssues } from "./validate";

const block = (...labels: string[]) => `:::perspectives\n${labels.map((label) => `- **${label}**: Text.`).join("\n")}\n:::`;

describe("prose perspective labels", () => {
  it.each(["Point de vue sunnite", "Perspective sunnite", "Sunnite", "sunni", "Sunni Hanafi", "أهل السنة", "سني"])("accepts the Sunni lead label %s", (label) => {
    expect(prosePerspectiveIssues(block(label, "Point de vue académique", "Point de vue chiite"))).toEqual([]);
  });
  it.each(["Point de vue académique", "Point de vue chiite", "academic", "Shia", "غير سني", "antisunnite", "Point de vue non sunnite", "Perspective non-sunnite", "Perspective non‑sunnite"])("rejects a non-Sunni lead label %s", (label) => {
    expect(prosePerspectiveIssues(block(label, "Point de vue sunnite"))).toEqual([expect.objectContaining({ level: "error" })]);
  });
  it("accepts empty prose and an empty perspective block", () => {
    expect(prosePerspectiveIssues("")).toEqual([]);
    expect(prosePerspectiveIssues(block())).toEqual([]);
  });
  it.each(["chiites", "duodécimains", "ismaéliens", "ibadites", "ahmadis", "coranistes", "zaydites"])("warns when a French view precedes its %s label", (label) => {
    expect(prosePerspectiveIssues(`Ils considèrent cela ainsi, selon les ${label}.`)).toEqual([expect.objectContaining({ level: "warn" })]);
    expect(prosePerspectiveIssues(`Les ${label} considèrent cela ainsi.`)).toEqual([]);
  });
  it("preserves English and Arabic view-label warnings", () => {
    expect(prosePerspectiveIssues("They believe this, according to the Shia.")).toEqual([expect.objectContaining({ level: "warn" })]);
    expect(prosePerspectiveIssues("يرى ذلك الشيعة.")).toEqual([expect.objectContaining({ level: "warn" })]);
    expect(prosePerspectiveIssues("The Shia believe this.")).toEqual([]);
    expect(prosePerspectiveIssues(block("Sunni", "Shia"))).toEqual([]);
  });
});
