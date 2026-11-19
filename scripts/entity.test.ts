import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { sectionRole } from "../site/src/lib/entity";

vi.mock("../site/src/lib/graph", () => ({
  byId: new Map(),
  edgesFrom: () => [],
  href: () => "",
  labelOf: () => "",
  summaryOf: () => "",
  stripNeedsSource: (text: string) => text,
  SITE: "https://islam.museum",
}));

const frenchRoles = {
  "En bref": "brief",
  "Résumé": "brief",
  "Pour les jeunes visiteurs": "kids",
  "Pour les Petits": "kids",
  "Notes pour les chercheurs": "scholars",
  "Pour les Chercheurs": "scholars",
} as const;

const headingsIn = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = `${dir}/${entry.name}`;
  if (entry.isDirectory()) return headingsIn(path);
  return entry.name.endsWith(".md") ? [...readFileSync(path, "utf8").matchAll(/^## (.+)$/gm)].map((match) => match[1]) : [];
});

describe("entity sectionRole", () => {
  it.each(Object.entries(frenchRoles))("maps French role heading %s to %s", (heading, role) => {
    expect(sectionRole(heading)).toBe(role);
  });

  it.each([...new Set(headingsIn("content/fr"))].sort())("classifies corpus French heading %s", (heading) => {
    expect(sectionRole(heading)).toBe(frenchRoles[heading as keyof typeof frenchRoles] ?? "main");
  });

  it.each(["", "Unknown heading", "Pour les Explorateurs", "Note", "Notes", "Vue d'ensemble", "Vue d’ensemble"])("keeps non-role heading %s as main", (heading) => {
    expect(sectionRole(heading)).toBe("main");
  });

  it.each([
    ["Brief", "brief"], ["نبذة", "brief"],
    ["For young visitors", "kids"], ["للزوار الصغار", "kids"],
    ["Notes for scholars", "scholars"], ["ملاحظات للباحثين", "scholars"],
  ])("preserves existing heading %s as %s", (heading, role) => {
    expect(sectionRole(heading)).toBe(role);
  });
});
