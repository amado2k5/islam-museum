import { describe, expect, it } from "vitest";
import { containsLowConfidence, containsNeedsSource, extractCiteSlugs, isPointerSource } from "./promote-check.js";

describe("promote-check helpers", () => {
  it("pointer sources are gazetteers and authority files, not real sources", () => {
    expect(isPointerSource("source/wikidata")).toBe(true);
    expect(isPointerSource("source/geonames-gazetteer")).toBe(true);
    expect(isPointerSource("source/pleiades")).toBe(true);
    expect(isPointerSource("source/futuh-buldan-maarif-1407")).toBe(false);
    expect(isPointerSource("source/met-open-access")).toBe(false);
    expect(isPointerSource("source/archnet")).toBe(false);
  });

  it("the strict dated-fact rule's flags are detected in raw record text", () => {
    expect(containsNeedsSource("claims:\n  - needs_source: second-source")).toBe(true);
    expect(containsNeedsSource("sources: [source/wikidata]")).toBe(false);
    expect(containsLowConfidence("confidence: low")).toBe(true);
    expect(containsLowConfidence("confidence:  low")).toBe(true);
    expect(containsLowConfidence("confidence: high")).toBe(false);
    expect(containsLowConfidence("confidence: lowest")).toBe(false);
  });

  it("cite slugs are extracted with their anchors ignored, deduplicated", () => {
    const text = "Text {cite:futuh-buldan-maarif-1407 p.329} and {cite:wikidata} and again {cite:futuh-buldan-maarif-1407 p.330}.";
    expect(extractCiteSlugs(text)).toEqual(["futuh-buldan-maarif-1407", "wikidata"]);
    expect(extractCiteSlugs("no citations here")).toEqual([]);
  });
});
