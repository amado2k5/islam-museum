// Display and ordering rules for dates on the site (site/src/lib/dates.ts).
import { describe, expect, it } from "vitest";
import { formatDate, timelineKey } from "../../site/src/lib/dates";

describe("Hijri years before the Hijra", () => {
  it("never renders year 0 for 622 CE; the year before 1 AH is 1 BH", () => {
    const { text } = formatDate({ edtf: "0622-03-01" }, "ar");
    expect(text).not.toMatch(/(^|[^\d])0 هـ/);
    expect(text).toContain("1 ق.هـ");
  });
  it("counts stored negative Hijri years back from 1 (no year 0)", () => {
    expect(formatDate({ edtf: "0610-08-10", hijri: "-0011-09-21", calendar: "julian" }, "ar").text).toContain("21 رمضان 12 ق.هـ");
  });
});

describe("timeline order", () => {
  const event = { class: "event", span: { earliest: 632.2, latest: 632.2 }, data: { date: { start: { edtf: "0632-03" } } } };
  it("sorts an era after the events of its start year", () => {
    const era = { class: "period", span: { earliest: 632.0, latest: 661.0 }, data: { start: { edtf: "0632", hijri: "0011", precision: "year" } } };
    expect(timelineKey(era).key).toBeGreaterThan(timelineKey(event).key);
    expect(timelineKey(era).key).toBeLessThan(633);
  });
  it("uses the Hijri date for early entries, so 8 AH follows 7 AH even when the CE year is 629", () => {
    const eight = { class: "event", span: { earliest: 629, latest: 629 }, data: { date: { start: { edtf: "0629", hijri: "0008" } } } };
    const seven = { class: "event", span: { earliest: 629.1, latest: 629.1 }, data: { date: { start: { edtf: "0629-03", hijri: "0007-11" } } } };
    expect(timelineKey(eight).key).toBeGreaterThan(timelineKey(seven).key);
  });
  it("places a Hijri-only entry (no CE date) at its Hijri position, not at the end", () => {
    const badr = { class: "event", span: undefined, data: { date: { start: { hijri: "0002-09", precision: "month" } } } };
    expect(Number.isFinite(timelineKey(badr).key)).toBe(true);
    expect(timelineKey(badr).key).toBeLessThan(625);
  });
  it("sorts undated entries last", () => {
    expect(timelineKey({ class: "dataset", data: {} }).key).toBe(Infinity);
  });
});
