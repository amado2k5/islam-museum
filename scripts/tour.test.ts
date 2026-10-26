// 3D Virtual Tour tests: journeys.yaml schema, i18n parity, client-script
// content sweeps, and required page/lib files. Mirrors scripts/kids.test.ts.
// Sections gated on files owned by parallel agents (journeys.yaml data,
// Tour3D.astro component, site/src/scripts/tour.ts) skip until those land —
// skipped is reported as skipped, never as a fake pass.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

// Same honorific guard as scripts/validate.ts: honorifics are never typed,
// the UI renders them.
const HONORIFIC = /(peace be upon him|\bpbuh\b|\(saw\)|ﷺ|صلى الله عليه|صلى اللّٰه عليه|عليه السلام|عليها السلام|رضي الله ع|رضي اللّٰه ع|رحمه الله|رحمه اللّٰه)/i;

interface Bilingual { ar: string; en: string }
interface Journey {
  id: string; kind: string; build: string;
  title: Bilingual; sub: Bilingual; lines: { ar: string[]; en: string[] };
}
const JOURNEYS = "tour/journeys.yaml";
const journeys = () => parse(readFileSync(JOURNEYS, "utf8")) as {
  journeys: Journey[]; status: { review: string }; provenance: Record<string, string>;
};
const HAS_JOURNEYS = existsSync(JOURNEYS);
const HAS_SCRIPT = existsSync("site/src/scripts/tour.ts");
const HAS_COMPONENT = existsSync("site/src/components/Tour3D.astro");

const KINDS = ["حدث", "مكان", "زمن"];
const BUILDS = ["hira", "madinah", "baghdad", "cordoba", "cairo", "istanbul", "kaaba"];

const nonempty = (v: unknown): v is string => typeof v === "string" && v.length > 0;

describe("3d tour: journeys.yaml", () => {
  it.skipIf(!HAS_JOURNEYS)("exactly 7 journeys, typed kinds/builds, bilingual, draft, no typed honorifics", () => {
    const j = journeys();
    expect(j.journeys.length).toBe(7);
    const ids = new Set<string>();
    const builds = new Set<string>();
    for (const x of j.journeys) {
      expect(x.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(x.id)).toBe(false);
      ids.add(x.id);
      expect(KINDS).toContain(x.kind);
      expect(BUILDS).toContain(x.build);
      builds.add(x.build);
      for (const k of ["title", "sub"] as const) {
        expect(nonempty(x[k].ar), `${x.id}.${k}.ar`).toBe(true);
        expect(nonempty(x[k].en), `${x.id}.${k}.en`).toBe(true);
      }
      // Every narration line is bilingual and non-empty, same count both languages.
      expect(Array.isArray(x.lines.ar) && x.lines.ar.length > 0, `${x.id}.lines.ar`).toBe(true);
      expect(x.lines.en.length).toBe(x.lines.ar.length);
      for (const [i, line] of x.lines.ar.entries()) {
        expect(nonempty(line), `${x.id}.lines.ar[${i}]`).toBe(true);
        expect(nonempty(x.lines.en[i]), `${x.id}.lines.en[${i}]`).toBe(true);
      }
      // No typed honorifics or Quran text anywhere in the journey.
      const text = JSON.stringify(x);
      expect(HONORIFIC.test(text), `${x.id} typed honorific`).toBe(false);
      expect(/[﴿﴾]/.test(text), `${x.id} typed Quran text`).toBe(false);
    }
    // The 7 journeys cover the 7 distinct 3D builds.
    expect(builds.size).toBe(7);
    expect(j.status?.review).toBe("draft");
    expect(j.provenance?.generated_by).toBeTruthy();
  });
});

describe("3d tour: exhibits.yaml", () => {
  const EXHIBITS = "tour/exhibits.yaml";
  it("5 stops, known builds, real object records, label/desc in ar/en/ur, published with provenance", () => {
    const x = parse(readFileSync(EXHIBITS, "utf8")) as {
      exhibits: any[]; status: { review: string }; provenance: Record<string, string>;
    };
    expect(x.status?.review).toBe("published");
    expect(x.provenance?.generated_by).toBeTruthy();
    expect(x.exhibits.length).toBe(5);
    const ids = new Set<string>();
    for (const e of x.exhibits) {
      expect(e.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      expect(["astrolabe", "manuscript", "vase", "dirham", "lamp"]).toContain(e.build);
      expect(e.record).toMatch(/^object\/[a-z0-9-]+$/);
      expect(existsSync(`data/${e.record}.yaml`), `${e.id}: ${e.record} exists`).toBe(true);
      for (const k of ["label", "desc", "material", "museum"]) {
        if (k !== "label" && k !== "desc" && e[k] === undefined) continue;
        for (const l of ["ar", "en", "ur"]) expect(nonempty(e[k]?.[l]), `${e.id}.${k}.${l}`).toBe(true);
      }
      const text = JSON.stringify(e);
      expect(HONORIFIC.test(text), `${e.id} typed honorific`).toBe(false);
      expect(/[﴿﴾]/.test(text), `${e.id} typed Quran text`).toBe(false);
    }
  });

  it("loadExhibits / viewExhibits select the page language", async () => {
    const { loadExhibits, viewExhibits } = await import("../site/src/lib/tour");
    const all = loadExhibits();
    for (const lang of ["ar", "en", "ur"] as const) {
      for (const v of viewExhibits(all, lang)) expect(nonempty(v.label) && nonempty(v.desc), `${lang} ${v.id}`).toBe(true);
    }
    expect(viewExhibits(all, "ur")[0].label).not.toBe(viewExhibits(all, "ar")[0].label);
  });
});

describe("3d tour: i18n parity", () => {
  const collect = (obj: any, prefix = ""): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj ?? {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") out[key] = v;
      else if (v && typeof v === "object") Object.assign(out, collect(v, key));
    }
    return out;
  };
  it("tour: keys are identical in ar/en/ur and every value is a non-empty string", () => {
    const ar = collect(parse(readFileSync("i18n/ar.yaml", "utf8")).tour);
    const en = collect(parse(readFileSync("i18n/en.yaml", "utf8")).tour);
    const ur = collect(parse(readFileSync("i18n/ur.yaml", "utf8")).tour);
    expect(Object.keys(ar).length).toBeGreaterThan(0);
    expect(Object.keys(en).sort()).toEqual(Object.keys(ar).sort());
    expect(Object.keys(ur).sort()).toEqual(Object.keys(ar).sort());
    for (const k of Object.keys(ar)) {
      expect(nonempty(ar[k]), `ar tour.${k}`).toBe(true);
      expect(nonempty(en[k]), `en tour.${k}`).toBe(true);
      expect(nonempty(ur[k]), `ur tour.${k}`).toBe(true);
    }
    // The page, nav link and no-JS fallback strings the template requires.
    for (const k of ["page_title", "page_lede", "nav_label", "nojs_title", "nojs_lede", "nojs_wings", "nojs_journeys"])
      expect(k in ar, `tour.${k}`).toBe(true);
  });
});

describe("3d tour: client script sweeps", () => {
  it.skipIf(!HAS_SCRIPT)("no hardcoded site URL and no person-figure keywords", () => {
    const src = readFileSync("site/src/scripts/tour.ts", "utf8");
    expect(src).not.toContain("https://islam.museum");
    // Honest exclusions: "manuscript" contains "man"; the "people" wing id is a
    // wing identifier (not a depiction); the "no depictions of people" comment
    // states the rule itself.
    const scrubbed = src
      .replace(/manuscripts?/gi, "")
      .replace(/id:\s*"people"/g, "")
      .replace(/no depictions of people/gi, "");
    expect(/\b(person|people|figure|human|man)\b/i.test(scrubbed), "person-figure keyword").toBe(false);
    expect(/(رجل|امرأة|شخص|إنسان|طفل|بشر)/.test(src), "arabic person keyword").toBe(false);
  });
});

describe("3d tour: lib", () => {
  it("viewJourneys selects the page language", async () => {
    const { viewJourneys } = await import("../site/src/lib/tour");
    const fixture: Journey[] = [
      {
        id: "hira", kind: "مكان", build: "hira",
        title: { ar: "غار حراء", en: "Cave of Hira" },
        sub: { ar: "أول الوحي", en: "The first revelation" },
        lines: { ar: ["سطر واحد"], en: ["one line"] },
      },
    ];
    const ar = viewJourneys(fixture, "ar")[0];
    expect(ar.title).toBe("غار حراء");
    expect(ar.sub).toBe("أول الوحي");
    expect(ar.lines).toEqual(["سطر واحد"]);
    expect(ar.id).toBe("hira");
    expect(ar.kind).toBe("مكان");
    expect(ar.build).toBe("hira");
    const en = viewJourneys(fixture, "en")[0];
    expect(en.title).toBe("Cave of Hira");
    expect(en.lines).toEqual(["one line"]);
  });

  it.skipIf(!HAS_JOURNEYS)("loadJourneys validates against the real file", async () => {
    const { loadJourneys, viewJourneys } = await import("../site/src/lib/tour");
    const all = loadJourneys();
    expect(all.length).toBe(7);
    const views = viewJourneys(all, "ar");
    expect(views.length).toBe(7);
    for (const v of views) {
      expect(nonempty(v.title) && nonempty(v.sub) && v.lines.length > 0, v.id).toBe(true);
    }
  });
});

describe("3d tour: page, component and nav", () => {
  const PAGE = "site/src/pages/[lang]/3d.astro";
  const LAYOUT = "site/src/layouts/BaseLayout.astro";

  it("required page and lib files exist", () => {
    for (const f of ["site/src/lib/tour.ts", PAGE]) expect(existsSync(f), f).toBe(true);
  });

  it.skipIf(!HAS_COMPONENT)("Tour3D component exists (parallel agent)", () => {
    expect(existsSync("site/src/components/Tour3D.astro")).toBe(true);
  });

  it("every touched .astro opens with ---", () => {
    for (const f of [PAGE, LAYOUT]) {
      expect(readFileSync(f, "utf8").startsWith("---"), `${f} opens with ---`).toBe(true);
    }
  });

  it("3d.astro mounts Tour3D and ships a real no-JS fallback", () => {
    const src = readFileSync(PAGE, "utf8");
    expect(src).toContain("getStaticPaths");
    expect(src).toContain("<Tour3D");
    expect(src).toContain("missing tour keys");
    // No-JS fallback: wing links as real links, journey list with first narration line.
    expect(src).toContain("tour-nojs");
    expect(src).toContain("t.nojs_title");
    expect(src).toContain("t.nojs_lede");
    expect(src).toContain("t.nojs_wings");
    expect(src).toContain("t.nojs_journeys");
    expect(src).toContain("wingHref(lang, w)");
    expect(src).toContain("T.wings[w].title");
    expect(src).toContain("t.nojs_objects");
    expect(src).toContain("e.href");
  });

  it("nav has the tour entry (way in)", () => {
    const layout = readFileSync(LAYOUT, "utf8");
    expect(layout).toContain('href={`/${lang}/3d/`}');
    expect(layout).toContain("`/${lang}/3d/`");
    expect(layout).toContain("T.tour.nav_label");
  });

  it.skipIf(!HAS_SCRIPT)("tour exit returns to the museum home (way back)", () => {
    // The exit navigation lives in the client script, not the component shell.
    const src = readFileSync("site/src/scripts/tour.ts", "utf8");
    expect(src).toContain("location.href");
    expect(src).toMatch(/\/\$\{data\.lang\}\//);
    // Cancel keeps the visitor in the scene: the confirm comes before the teardown.
    expect(src.indexOf("window.confirm(")).toBeLessThan(src.indexOf("teardown?.()"));
  });
});
