import { describe, expect, it } from "vitest";
import { hasScaffold, stripScaffold, stripScaffoldProse } from "./scaffold.js";

// Audit of 13 November 2026, S13: the pipeline's frame around a summary is taken off when the graph is built.
describe("scaffolding is not content", () => {
  it("keeps the description and drops the frame, in English and Arabic", () => {
    expect(stripScaffold("Draft card for the Khalji dynasty of Bengal, the Turkic rulers of Bengal's first Islamic sultanate; its sources are not yet checked on the page.", "en"))
      .toEqual({ text: "The Khalji dynasty of Bengal, the Turkic rulers of Bengal's first Islamic sultanate.", scaffold: true });
    expect(stripScaffold("بطاقة أولية للمسجد السعودي في نواكشوط، جامع المدينة الكبير؛ لم تُراجع مصادره على الصفحة بعد.", "ar").text).toBe("المسجد السعودي في نواكشوط، جامع المدينة الكبير.");
    expect(stripScaffold("بطاقة أولية لـHz. Tomb of X، المعلم التاريخي؛ لم تُراجع مصادره على الصفحة بعد.", "ar").text).toBe("Hz. Tomb of X، المعلم التاريخي.");
  });
  it("keeps a fact that shares a clause with the note, and a citation", () => {
    expect(stripScaffold("Draft card for X, a poet of Shiraz; he died in 1200 and his entry is not yet checked on the page.", "en").text).toBe("X, a poet of Shiraz; he died in 1200.");
    expect(stripScaffold("Draft card for X, a judge {cite:al-aalam v.3 p.4}; the entry is not yet checked on the page.", "en").text).toContain("{cite:al-aalam v.3 p.4}");
  });
  it("leaves an ordinary summary alone, and says whether a string still carries the frame", () => {
    expect(stripScaffold("A hafiz of Baghdad {cite:x p. 3}.", "en")).toEqual({ text: "A hafiz of Baghdad {cite:x p. 3}.", scaffold: false });
    expect(hasScaffold("Draft card for X")).toBe(true);
    expect(hasScaffold(stripScaffold("Draft card for X; the page not yet checked.", "en").text)).toBe(false);
  });
  it("takes the frame out of a prose line and keeps its link and citation", () => {
    const out = stripScaffoldProse("[[person/x|X]] — Draft card for X, the Almohad caliph raised in 1242; his entry is not yet checked on the page. {cite:bosworth}", "en");
    expect(out).toBe("[[person/x|X]] — X, the Almohad caliph raised in 1242. {cite:bosworth}");
  });
});
