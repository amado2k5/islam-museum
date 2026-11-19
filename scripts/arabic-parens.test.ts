// Arabic and Urdu parentheticals must be wrapped in U+2066 ( ... ) U+2069 (AGENTS.md), or the browser's
// right-to-left layout draws «الخطيب (المؤلف)» with the brackets turned the wrong way.
import { describe, it, expect } from "vitest";
import { ARABIC_PAREN_UNISOLATED, allStrings, proseParenProblem } from "./validate.js";

describe("Arabic-script parentheses", () => {
  it("flags a plain parenthetical in Arabic and Urdu prose", () => {
    expect(proseParenProblem("ar", {}, "- **الخطيب (المؤلف)**: نص")).toMatch(/U\+2066/);
    expect(proseParenProblem("ur", {}, "وہ (سزاوار) ہے")).toMatch(/U\+2066/);
  });
  it("accepts isolated parentheticals, non-Arabic ones and code spans", () => {
    expect(proseParenProblem("ar", {}, "- **الخطيب \u2066(المؤلف)\u2069**: نص (1999)")).toBeNull();
    expect(proseParenProblem("ar", {}, "مثال `(المؤلف)`")).toBeNull();
    expect(proseParenProblem("en", {}, "the preacher (الخطيب)")).toBeNull();
  });
  it("checks the frontmatter too", () => {
    expect(proseParenProblem("ar", { title: "كتاب (الجزء الأول)" }, "")).toMatch(/frontmatter title/);
  });
  it("reaches every string of a data record, including text and provenance", () => {
    const rec = { ur: { text: "(اے پروردگار) ہم" }, provenance: { source: "ص (ج5)" } };
    expect([...allStrings(rec)].filter(([, s]) => ARABIC_PAREN_UNISOLATED.test(s)).map(([p]) => p)).toEqual(["ur.text", "provenance.source"]);
  });
});
