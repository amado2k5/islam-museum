// Khulafa Browser, step 1 (docs/plan/30-khulafa-browser.md): the during_reign predicate and the
// caliph-role/reign consistency rule.
import { describe, expect, it } from "vitest";
import { loadEntities, loadPredicates, resolvePredicate } from "./lib.js";
import { validateAll } from "./validate.js";

const predicates = loadPredicates();

describe("during_reign predicate (docs/plan/30 §2.3)", () => {
  it("is registered with its inverse, domain and range", () => {
    const p = predicates["during_reign"];
    expect(p).toBeDefined();
    expect(p.inverse).toBe("reign_saw");
    expect(p.domain).toEqual(["event", "building", "work", "invention"]);
    expect(p.range).toEqual(["person", "polity"]);
  });

  it("resolves both directions by their endpoint classes", () => {
    expect(resolvePredicate(predicates, "during_reign", "event", "person")?.canonical).toBe("during_reign");
    expect(resolvePredicate(predicates, "reign_saw", "person", "event")?.canonical).toBe("during_reign");
    expect(resolvePredicate(predicates, "reign_saw", "person", "event")?.reversed).toBe(true);
  });
});

describe("caliph role and reign (docs/plan/30 §6)", () => {
  const repo = loadEntities({ shared: true }).map(({ entity }) => entity);

  it("every reign toward a caliphate polity carries the caliph role", () => {
    const caliphates = new Set(repo.filter((e) => e.class === "polity" && e.kind === "caliphate").map((e) => e.id));
    expect(caliphates.size).toBeGreaterThan(0);
    for (const e of repo.filter((e) => e.class === "person")) {
      const reign = (e.story_roles ?? []).some(
        (r: any) => ["ruler", "rival-claimant"].includes(r.role) && caliphates.has(r.toward),
      );
      if (reign) expect(e.roles ?? [], e.id).toContain("caliph");
    }
  });

  it("the Rashidun five all carry a sourced reign toward polity/rashidun-caliphate", () => {
    for (const slug of ["abu-bakr", "umar-ibn-al-khattab", "uthman-ibn-affan", "ali-ibn-abi-talib", "hasan-ibn-ali"]) {
      const e = repo.find((x) => x.id === `person/${slug}`);
      expect(e, slug).toBeDefined();
      expect(e!.roles).toContain("caliph");
      const reign = (e!.story_roles ?? []).find((r: any) => r.role === "ruler" && r.toward === "polity/rashidun-caliphate");
      expect(reign, slug).toBeDefined();
      expect((reign as any).sources?.length ?? 0, slug).toBeGreaterThan(0);
    }
  });
});
