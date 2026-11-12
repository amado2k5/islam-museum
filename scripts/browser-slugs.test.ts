import { describe, it, expect } from "vitest";
import { browserSlugs } from "./browser-slugs";

describe("browserSlugs", () => {
  const records = [
    { id: "place/najd", class: "place", slug: "najd" },
    { id: "place/quba", class: "place", slug: "quba" },
    { id: "building/quba", class: "building", slug: "quba" },
    { id: "group/quraysh", class: "group" },
  ];

  it("keeps a record's own slug and prefixes only a real clash", () => {
    const m = browserSlugs(records);
    expect(m.get("place/najd")).toBe("najd");
    expect(m.get("place/quba")).toBe("quba");
    expect(m.get("building/quba")).toBe("building-quba");
    expect(m.get("group/quraysh")).toBe("quraysh");
  });

  it("gives every record a distinct slug", () => {
    const m = browserSlugs(records);
    expect(new Set(m.values()).size).toBe(records.length);
  });

  // The fault of 12 November 2026: one `seen` set shared by the three language passes made
  // every English and Urdu page a "clash" with its Arabic twin, so they were built at
  // /en/places/place-najd/ while every link pointed at /en/places/najd/.
  it("is the same on every call, so each language gets the same slug", () => {
    const perLang = ["ar", "en", "ur"].map(() => browserSlugs(records));
    for (const m of perLang) expect([...m]).toEqual([...perLang[0]]);
  });
});
