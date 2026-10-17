// SEO meta-description helper tests.
import { describe, expect, it } from "vitest";
import { truncateDesc } from "../site/src/lib/meta";

describe("truncateDesc", () => {
  it("returns short text unchanged", () => {
    expect(truncateDesc("نص قصير")).toBe("نص قصير");
  });
  it("returns empty string for nullish input", () => {
    expect(truncateDesc(null)).toBe("");
    expect(truncateDesc(undefined)).toBe("");
    expect(truncateDesc("")).toBe("");
  });
  it("cuts at an Arabic sentence ender under the cap", () => {
    const long = "هذه هي الجملة الأولى الكاملة التي تتجاوز الأربعين حرفاً بسهولة. " + "كلام إضافي ".repeat(30);
    const out = truncateDesc(long);
    expect(out.length).toBeLessThanOrEqual(156);
    expect(out.endsWith(".")).toBe(true);
    expect(out).not.toContain("كلام إضافي ".repeat(5).trim());
  });
  it("falls back to a word boundary with an ellipsis", () => {
    const long = "كلمة ".repeat(60);
    const out = truncateDesc(long);
    expect(out.length).toBeLessThanOrEqual(156);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/ $/);
  });
  it("collapses whitespace", () => {
    expect(truncateDesc("  نص   فيه\nمسافات  ")).toBe("نص فيه مسافات");
  });
  it("keeps latin sentence enders too", () => {
    const long = "First sentence here with enough words to pass the minimum! " + "More words ".repeat(30);
    const out = truncateDesc(long);
    expect(out).toBe("First sentence here with enough words to pass the minimum!");
  });
});
