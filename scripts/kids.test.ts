// Kids' Wing (جناح الصغار) tests: quest content schema, age-gating flags,
// i18n parity, and required files. Mirrors scripts/cards.test.ts conventions.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

// Same honorific guard as scripts/validate.ts: honorifics are never typed,
// the UI renders them (site/src/lib/kids.ts kidsHonorify).
const HONORIFIC = /(peace be upon him|\bpbuh\b|\(saw\)|ﷺ|صلى الله عليه|صلى اللّٰه عليه|عليه السلام|عليها السلام|رضي الله ع|رضي اللّٰه ع|رحمه الله|رحمه اللّٰه)/i;

interface Bilingual { ar: string; en: string }
interface QuestStop {
  slug: string; icon: string;
  name: Bilingual; title: Bilingual; story: Bilingual;
  value: Bilingual; value_icon: string;
  question: Bilingual; choices: Bilingual[]; feedback: Bilingual;
}
const QUEST = "kids/quest-stops.yaml";
const quest = () => parse(readFileSync(QUEST, "utf8")) as {
  stops: QuestStop[]; status: { review: string }; provenance: Record<string, string>;
};

describe("kids wing", () => {
  it("quest stops validate: 5 stops, bilingual, draft, no typed honorifics", () => {
    const q = quest();
    expect(q.stops.length).toBe(5);
    const slugs = new Set<string>();
    for (const s of q.stops) {
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(s.slug)).toBe(false);
      slugs.add(s.slug);
      for (const k of ["name", "title", "story", "value", "question", "feedback"] as const) {
        expect(typeof s[k].ar === "string" && s[k].ar.length > 0, `${s.slug}.${k}.ar`).toBe(true);
        expect(typeof s[k].en === "string" && s[k].en.length > 0, `${s.slug}.${k}.en`).toBe(true);
      }
      expect(s.story.ar.split(/[.!؟?]/).filter(Boolean).length).toBeLessThanOrEqual(4);
      expect(Array.isArray(s.choices) && s.choices.length >= 2 && s.choices.length <= 3, `${s.slug}.choices`).toBe(true);
      for (const c of s.choices) {
        expect(c.ar && c.en, `${s.slug}.choice bilingual`).toBeTruthy();
      }
      expect(typeof s.icon === "string" && s.icon.length > 0, `${s.slug}.icon`).toBe(true);
      expect(typeof s.value_icon === "string" && s.value_icon.length > 0, `${s.slug}.value_icon`).toBe(true);
      // No typed honorifics or Quran text anywhere in the stop.
      const text = JSON.stringify(s);
      expect(HONORIFIC.test(text), `${s.slug} typed honorific`).toBe(false);
      expect(/[﴿﴾]/.test(text), `${s.slug} typed Quran text`).toBe(false);
    }
    expect(q.status?.review).toBe("draft");
    expect(q.provenance?.generated_by).toBeTruthy();
  });

  it("word-map kids flag is opt-in and age-gated", () => {
    const dir = "cards/wordmap";
    const kids: string[] = [];
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "index.json")) {
      const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
      if (d.kids === true) kids.push(f);
    }
    // Only positive/neutral-valence words are opted in. عذابًا stays gated out.
    expect(kids).toContain("wa-bashshir.json");
    expect(kids).not.toContain("adhaban.json");
  });

  it("i18n kids: keys have full ar/en parity", () => {
    const ar = parse(readFileSync("i18n/ar.yaml", "utf8")).kids as Record<string, string>;
    const en = parse(readFileSync("i18n/en.yaml", "utf8")).kids as Record<string, string>;
    expect(ar && en).toBeTruthy();
    const ka = Object.keys(ar).sort(), ke = Object.keys(en).sort();
    expect(ke).toEqual(ka);
    for (const k of ka) {
      expect(typeof ar[k] === "string" && ar[k].length > 0, `ar kids.${k}`).toBe(true);
      expect(typeof en[k] === "string" && en[k].length > 0, `en kids.${k}`).toBe(true);
    }
  });

  it("explore nav has the sighar entry in both languages", () => {
    for (const lang of ["ar", "en"] as const) {
      const d = parse(readFileSync(`i18n/${lang}.yaml`, "utf8"));
      const e = d.explore.pages.sighar;
      expect(e?.title?.length > 0, `${lang} explore.pages.sighar.title`).toBe(true);
      expect(e?.menu?.length > 0, `${lang} explore.pages.sighar.menu`).toBe(true);
    }
    const nav = readFileSync("site/src/lib/nav.ts", "utf8");
    expect(nav).toContain('key: "sighar"');
    expect(nav).toContain("`/${lang}/sighar/`");
  });

  it("all kids' wing files exist", () => {
    for (const f of [
      "site/src/styles/kids.css",
      "site/src/components/Hudhud.astro",
      "site/src/components/KidsWordGarden.astro",
      "site/src/components/ProphetQuest.astro",
      "site/src/lib/kids.ts",
      "site/src/scripts/kidsgarden.ts",
      "site/src/scripts/quest.ts",
      "site/src/pages/[lang]/sighar/index.astro",
      "site/src/pages/[lang]/sighar/garden.astro",
      "site/src/pages/[lang]/sighar/quest.astro",
      "docs/agents/kids-content.md",
      "kids/quest-stops.yaml",
    ]) expect(existsSync(f), f).toBe(true);
  });

  it("two-way navigation is wired", () => {
    const layout = readFileSync("site/src/layouts/BaseLayout.astro", "utf8");
    // Way in: prominent top-level nav entry on the main site.
    expect(layout).toContain('class="top-link kids-link"');
    expect(layout).toContain("`/${lang}/sighar/`");
    // Way back: kids prop switches to a simplified chrome with a big back button.
    expect(layout).toContain("kids?: boolean");
    expect(layout).toContain('class="kids-back"');
    expect(layout).toContain("`/${lang}/`");
    // Every kids' page opts into the kids chrome.
    for (const p of [
      "site/src/pages/[lang]/sighar/index.astro",
      "site/src/pages/[lang]/sighar/garden.astro",
      "site/src/pages/[lang]/sighar/quest.astro",
    ]) {
      expect(readFileSync(p, "utf8")).toContain("kids");
    }
    // Back-button strings exist in both languages.
    for (const lang of ["ar", "en"] as const) {
      const k = parse(readFileSync(`i18n/${lang}.yaml`, "utf8")).kids;
      expect(k.back_to_museum?.length > 0, `${lang} back_to_museum`).toBe(true);
    }
  });

  it("kids.css respects reduced motion and touch targets", () => {
    const css = readFileSync("site/src/styles/kids.css", "utf8");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("48px");
  });

  it("no typed honorifics in any kids' source file", () => {
    const files = [
      "kids/quest-stops.yaml",
      "site/src/lib/kids.ts",
      "site/src/components/KidsWordGarden.astro",
      "site/src/components/ProphetQuest.astro",
      "site/src/pages/[lang]/sighar/index.astro",
      "site/src/pages/[lang]/sighar/garden.astro",
      "site/src/pages/[lang]/sighar/quest.astro",
    ];
    for (const f of files) {
      if (!existsSync(f)) continue;
      const t = readFileSync(f, "utf8");
      // kidsHonorify in kids.ts *renders* the honorific string by policy;
      // everywhere else it must not appear.
      if (f === "site/src/lib/kids.ts") continue;
      expect(HONORIFIC.test(t), f).toBe(false);
    }
  });
});
