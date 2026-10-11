import { describe, expect, it } from "vitest";
import { civilToHijri, fmt, fromJDN, hijriMonthLength, hijriToCivil, jdnToTabular, tabularToJDN, toJDN } from "./convert";

describe("Hijri anchors", () => {
  it("1 Muharram 1 AH = 16 July 622 (Julian)", () => {
    const r = hijriToCivil({ y: 1, m: 1, d: 1 });
    expect(r.calendar).toBe("julian");
    expect(fmt(r.date)).toBe("0622-07-16");
  });

  it("12 Rabi' I 11 AH is within one day of 8 June 632 (Julian), the traditional date of the Prophet's death", () => {
    // The tabular calendar gives 7 June; the traditional 8 June comes from astronomical reckoning.
    // This is the documented tabular-vs-astronomical divergence, which is why conversions are
    // flagged `derived` and never override a source's own date.
    const r = hijriToCivil({ y: 11, m: 3, d: 12 });
    expect(r.calendar).toBe("julian");
    const delta = toJDN("julian", { y: 632, m: 6, d: 8 }) - toJDN("julian", r.date);
    expect(Math.abs(delta)).toBeLessThanOrEqual(1);
  });

  it("1 Muharram 1447 = 26 June 2025 (Umm al-Qura)", () => {
    const r = hijriToCivil({ y: 1447, m: 1, d: 1 });
    expect(r.method).toBe("umalqura");
    expect(fmt(r.date)).toBe("2025-06-26");
  });

  it("civil -> Hijri round-trips the same anchors", () => {
    expect(civilToHijri("julian", { y: 622, m: 7, d: 16 }).date).toEqual({ y: 1, m: 1, d: 1 });
    expect(civilToHijri("gregorian", { y: 2025, m: 6, d: 26 }).date).toEqual({ y: 1447, m: 1, d: 1 });
  });

  it("the JDN of 16 July 622 Julian is 1948440", () => {
    expect(toJDN("julian", { y: 622, m: 7, d: 16 })).toBe(1948440);
    expect(fromJDN("julian", 1948440)).toEqual({ y: 622, m: 7, d: 16 });
  });

  it("Gregorian reform: 4 Oct 1582 Julian is followed by 15 Oct 1582 Gregorian", () => {
    expect(toJDN("gregorian", { y: 1582, m: 10, d: 15 }) - toJDN("julian", { y: 1582, m: 10, d: 4 })).toBe(1);
  });

  it("tabular conversion round-trips across 1400 years", () => {
    for (let jdn = 1948440; jdn < 1948440 + 365 * 1400; jdn += 97) {
      expect(tabularToJDN(jdnToTabular(jdn))).toBe(jdn);
    }
  });

  it("30-year cycle has 11 leap years and 10631 days", () => {
    let days = 0;
    for (let y = 1; y <= 30; y++) for (let m = 1; m <= 12; m++) days += hijriMonthLength(y, m);
    expect(days).toBe(10631);
  });
});
