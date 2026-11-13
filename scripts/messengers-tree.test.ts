// The Prophets' Tree (docs/plan/41-messengers-browser.md, "The tree"): the drawn tree never claims a lineage the
// graph does not hold, every browser subject is on it, and no two leaves collide in any language.
import { describe, expect, it } from "vitest";
import { loadEntities } from "./lib.js";
import { MESSENGER_SUBJECTS, messengerTopicsOf } from "./messengers.js";
import {
  MESSENGERS_TREE, MESSENGERS_TREE_TIES, TREE_WIDTH, TREE_HEIGHT, checkMessengersTree, chainBetween, treePath, treeY,
  pillWidth, pillHeight,
} from "./messengers-tree.js";

const entities = loadEntities({ shared: true }).map(({ entity }) => entity as any);
const byId = new Map(entities.map((e) => [e.id, e]));
const view = {
  has: (id: string) => byId.has(id),
  edge: (from: string, type: string, to: string) => (byId.get(from)?.relations ?? []).some((r: any) => r.type === type && r.target === to),
  // the detector is exercised against the frozen Qur'an text at build time (ProphetsTree.astro); here the basis must at least be a real ayah record
  names: (passage: string) => byId.has(passage),
};

describe("the Prophets' Tree", () => {
  it("agrees with the graph: every solid branch is a child_of edge, every tie an edge, every vine on the Ansab chain", () => {
    expect(checkMessengersTree(view)).toEqual([]);
  });

  it("reports a branch whose edge is missing", () => {
    const broken = { ...view, edge: (from: string, type: string, to: string) => !(from === "person/yusuf" && type === "child_of") && view.edge(from, type, to) };
    expect(checkMessengersTree(broken)).toContain("person/yusuf child_of person/yaqub is not in the graph");
  });

  it("draws every subject of the browser, each once, and every path ends at Adam", () => {
    const ids = MESSENGERS_TREE.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of MESSENGER_SUBJECTS) expect(ids).toContain(s);
    for (const id of ids) expect(treePath(id).at(-1)).toBe("person/adam");
  });

  it("splits the vine as the Ansab chain does: disputed above Adnan, agreed below", () => {
    const upper = chainBetween("person/ismail", "person/adnan");
    const lower = chainBetween("person/adnan", "person/muhammad");
    expect(upper.ids.length).toBeGreaterThan(0);
    expect(upper.disputed).toBe(upper.ids.length);
    expect(lower.ids.length).toBeGreaterThan(0);
    expect(lower.disputed).toBe(0);
  });

  it("keeps the leaves apart and inside the drawing in Arabic, English and Urdu", () => {
    for (const lang of ["ar", "en", "ur"] as const) {
      const boxes = MESSENGERS_TREE.map((n) => {
        const e = byId.get(n.id);
        const label = String(e.label[lang] ?? e.label.ar).replace(/\s*⁦?\(.*$/, "").trim();
        const w = pillWidth(label, n.size), h = pillHeight(n.size), y = treeY(n.r);
        return { id: n.id, l: n.x - w / 2, r: n.x + w / 2, t: y - h / 2, b: y + h / 2 };
      });
      for (const a of boxes) {
        expect(a.l, `${lang} ${a.id}`).toBeGreaterThanOrEqual(0);
        expect(a.r, `${lang} ${a.id}`).toBeLessThanOrEqual(TREE_WIDTH);
        expect(a.t).toBeGreaterThanOrEqual(0);
        expect(a.b).toBeLessThanOrEqual(TREE_HEIGHT);
        for (const b of boxes) if (a.id < b.id) expect(a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b, `${lang} ${a.id} over ${b.id}`).toBe(false);
      }
    }
  });

  it("names every tie between two drawn prophets", () => {
    const ids = new Set(MESSENGERS_TREE.map((n) => n.id));
    for (const t of MESSENGERS_TREE_TIES) { expect(ids.has(t.a)).toBe(true); expect(ids.has(t.b)).toBe(true); }
  });
});

describe("the detector reads the Qur'an's spelling of Dawud", () => {
  const passage = (text: string) => ({
    id: "passage/x", class: "passage", slug: "x", label: { ar: "x" }, summary: {}, stub: false, wings: [], regions: [], periods: [], tags: [], aliases: [],
    themes: [], data: { unit: "page", work: "work/x", text }, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-13",
  }) as any;
  it("finds «داوود» with two waws and «داود» with one, and still skips the collector Abu Dawud", () => {
    expect(messengerTopicsOf(passage("وآتينا داوود زبورا"))).toContain("person/dawud");
    expect(messengerTopicsOf(passage("ذكر داود في الكتاب"))).toContain("person/dawud");
    expect(messengerTopicsOf(passage("رواه أبو داوود في سننه"))).not.toContain("person/dawud");
    expect(messengerTopicsOf(passage("رواه أبو داود في سننه"))).not.toContain("person/dawud");
  });
});
