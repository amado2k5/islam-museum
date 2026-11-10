import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadEntities, p } from "./lib.js";

// The canon (docs/canon.md): `importance` marks the records the museum finishes and shows first.
describe("canon: the importance field", () => {
  const withImportance = loadEntities({ shared: true }).map((e) => e.entity as any).filter((d: any) => d.importance !== undefined);

  it("is an optional 1-or-2 field on every class", () => {
    const base = JSON.parse(readFileSync(p("schema", "_base.schema.json"), "utf8"));
    expect(base.properties.importance.enum).toEqual([1, 2]);
    expect(base.required ?? []).not.toContain("importance");
  });

  it("marks a canon small enough to finish by hand, with cornerstones a minority of it", () => {
    const ones = withImportance.filter((d: any) => d.importance === 1).length;
    expect(withImportance.length).toBeGreaterThan(500);
    expect(withImportance.length).toBeLessThanOrEqual(1100);
    expect(ones).toBeGreaterThan(0);
    expect(ones).toBeLessThanOrEqual(300);
  });

  it("matches the generated register docs/canon.md", () => {
    const doc = readFileSync(p("docs", "canon.md"), "utf8");
    const total = Number(/\| \*\*all\*\* \| \*\*(\d+)\*\*/.exec(doc)?.[1]);
    expect(total).toBe(withImportance.length);
    for (const d of withImportance) expect(doc, d.id).toContain("`" + String(d.id).split("/")[1] + "`");
  });
});
