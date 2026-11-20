import { beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({ files: ["unit.yaml"], unit: {} as any }));
vi.mock("node:fs", () => ({
  existsSync: () => true,
  readdirSync: () => fixture.files,
  readFileSync: (path: string) => JSON.stringify(path.includes("data/passage") ? { chain: ["person/a"] } : fixture.unit),
}));
vi.mock("../site/src/lib/graph", () => ({ byId: new Map([["passage/a", {}], ["work/a", {}], ["object/a", {}]]) }));

import { loadDetective } from "../site/src/lib/detective";

beforeEach(() => {
  fixture.files = ["unit.yaml"];
  const text = { ar: "a", en: "English", ur: "u" };
  fixture.unit = {
    id: "unit", band: "scholars", claim: { ...text }, historians: { ...text },
    evidence: ["passage", "chronicle", "object"].map((kind, i) => ({ kind, id: ["passage/a", "work/a", "object/a"][i], caption: { ...text } })),
  };
});

describe("French source detective fields", () => {
  it("falls back to English for claims, historians' notes and evidence captions", () => {
    const [unit] = loadDetective();
    expect(unit.claim.fr).toBe("English");
    expect(unit.historians.fr).toBe("English");
    expect(unit.evidence.map((e) => e.caption.fr)).toEqual(["English", "English", "English"]);
    expect(unit.claim.ar).toBe("a");
    expect(unit.claim.ur).toBe("u");
  });
  it("preserves supplied French", () => {
    fixture.unit.claim.fr = "Français";
    fixture.unit.historians.fr = "Note";
    fixture.unit.evidence[0].caption.fr = "Légende";
    const [unit] = loadDetective();
    expect(unit.claim.fr).toBe("Français");
    expect(unit.historians.fr).toBe("Note");
    expect(unit.evidence[0].caption.fr).toBe("Légende");
  });
  it("handles an empty collection", () => {
    fixture.files = [];
    expect(loadDetective()).toEqual([]);
  });
  it("still rejects missing required languages", () => {
    delete fixture.unit.historians.en;
    expect(() => loadDetective()).toThrow("historians: missing en");
  });
});
