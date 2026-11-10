import { describe, expect, it } from "vitest";
import { extractCiteSlugs } from "./cite-check.js";

describe("cite-check helpers", () => {
  it("cite slugs are extracted with their anchors ignored, deduplicated", () => {
    const text = "Text {cite:futuh-buldan-maarif-1407 p.329} and {cite:wikidata} and again {cite:futuh-buldan-maarif-1407 p.330}.";
    expect(extractCiteSlugs(text)).toEqual(["futuh-buldan-maarif-1407", "wikidata"]);
    expect(extractCiteSlugs("no citations here")).toEqual([]);
    expect(extractCiteSlugs("{cite:archnet al-azhar-cairo}")).toEqual(["archnet"]);
  });
});
