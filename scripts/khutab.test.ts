import { beforeEach, describe, expect, it } from "vitest";
import { validateAll, type Issue } from "./validate";

// Acceptance rules of docs/plan/25 (khutab and durus explorer). Fixtures are appended to the loaded corpus;
// only issues on the fixture files are asserted on.
beforeEach(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

const SRC = ["source/assabile-omar-abdelkafy"];
const file = (slug: string) => `data/work/${slug}.yaml`;
const work = (slug: string, extra: Record<string, unknown> = {}) => ({
  entity: {
    id: `work/${slug}`, class: "work", kind: "sermon",
    label: { ar: "اختبار" }, summary: { ar: "اختبار" },
    wings: [], sources: SRC, status: { review: "published" },
    ...extra,
  },
  file: file(slug),
});
const media = (slug: string, extra: Record<string, unknown> = {}) => ({
  entity: {
    id: `media/${slug}`, class: "media", kind: "audio", license: "cc0-1.0",
    label: { ar: "اختبار" }, summary: { ar: "اختبار" }, attribution: "x",
    alt: { ar: "x", en: "x", ur: "x" },
    sources: SRC, status: { review: "published" },
    ...extra,
  },
  file: `data/media/${slug}.yaml`,
});
const onFile = (issues: Issue[], f: string) => issues.filter((i) => i.level === "error" && i.file === f);

describe("khutab-durus rules (docs/plan/25 §8)", () => {
  it("rejects a sermon with no speaker", () => {
    const f = work("khutab-no-speaker");
    const { issues } = validateAll([f]);
    expect(onFile(issues, f.file).some((i) => /delivered\.by/.test(i.msg))).toBe(true);
  });
  it("accepts a well-formed sermon", () => {
    const f = work("khutab-good", {
      sermon_type: "jumu'a",
      delivered: { by: "person/muhammad" },
      delivery_date_status: "delivered",
      composed: { hijri: "0010-12-09", precision: "day" },
      ruler_at_time: [{ who: "polity/rashidun-caliphate", role: "contemporary" }],
    });
    const { issues } = validateAll([f]);
    expect(onFile(issues, f.file)).toEqual([]);
  });
  it("rejects a ruler role beyond contemporary without a citation", () => {
    const f = work("khutab-ruler", {
      delivered: { by: "person/muhammad" },
      ruler_at_time: [{ who: "polity/rashidun-caliphate", role: "named-in-dua" }],
    });
    const { issues } = validateAll([f]);
    expect(onFile(issues, f.file).some((i) => /ruler_at_time/.test(i.msg))).toBe(true);
  });
  it("rejects a series lesson with no order", () => {
    const series = work("khutab-series", { kind: "lecture-series" });
    const lesson = work("khutab-lesson", {
      kind: "lecture", delivered: { by: "person/muhammad" },
      relations: [{ type: "part_of", target: "work/khutab-series" }],
    });
    const { issues } = validateAll([series, lesson]);
    expect(onFile(issues, lesson.file).some((i) => /order/.test(i.msg))).toBe(true);
  });
  it("accepts a series lesson with an order", () => {
    const series = work("khutab-series2", { kind: "lecture-series" });
    const lesson = work("khutab-lesson2", {
      kind: "lecture", delivered: { by: "person/muhammad" }, order: 3,
      relations: [{ type: "part_of", target: "work/khutab-series2" }],
    });
    const { issues } = validateAll([series, lesson]);
    expect(onFile(issues, lesson.file)).toEqual([]);
  });
  it("rejects a YouTube URL in the media store", () => {
    const m = media("khutab-yt", { url: "https://www.youtube.com/watch?v=abc123" });
    const { issues } = validateAll([m]);
    expect(onFile(issues, m.file).some((i) => /YouTube/.test(i.msg))).toBe(true);
  });
});
