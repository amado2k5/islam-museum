// Kids' Wing (جناح الصغار) tests: quest content schema, age-gating flags,
// i18n parity, and required files. Mirrors scripts/cards.test.ts conventions.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { normalize } from "node:path";
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

interface SproutStory {
  slug: string; icon: string;
  prophet: Bilingual; title: Bilingual; body: Bilingual; talk: Bilingual;
}
const DEEDS = "kids/deeds.yaml";
const deeds = () => parse(readFileSync(DEEDS, "utf8")) as {
  deeds: { day: number; icon: string; deed: Bilingual }[];
  status: { review: string }; provenance: Record<string, string>;
};
const STORIES = "kids/stories.yaml";
const stories = () => parse(readFileSync(STORIES, "utf8")) as {
  stories: SproutStory[]; status: { review: string }; provenance: Record<string, string>;
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
      "site/src/components/KindnessQuest.astro",
      "site/src/lib/kids.ts",
      "site/src/scripts/kidsgarden.ts",
      "site/src/scripts/quest.ts",
      "site/src/scripts/kindness.ts",
      "site/src/scripts/sprouts-garden.ts",
      "site/src/scripts/sprouts-quest.ts",
      "site/src/pages/[lang]/sighar/index.astro",
      "site/src/pages/[lang]/sighar/garden.astro",
      "site/src/pages/[lang]/sighar/quest.astro",
      "site/src/pages/[lang]/sighar/kindness.astro",
      "site/src/pages/[lang]/sighar/stories.astro",
      "site/src/pages/[lang]/sighar/sprouts-garden.astro",
      "site/src/pages/[lang]/sighar/sprouts-quest.astro",
      "docs/agents/kids-content.md",
      "kids/quest-stops.yaml",
      "kids/deeds.yaml",
      "kids/stories.yaml",
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
      "site/src/pages/[lang]/sighar/kindness.astro",
      "site/src/pages/[lang]/sighar/stories.astro",
      "site/src/pages/[lang]/sighar/sprouts-garden.astro",
      "site/src/pages/[lang]/sighar/sprouts-quest.astro",
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
      "kids/deeds.yaml",
      "kids/stories.yaml",
      "site/src/lib/kids.ts",
      "site/src/components/KidsWordGarden.astro",
      "site/src/components/ProphetQuest.astro",
      "site/src/components/KindnessQuest.astro",
      "site/src/scripts/kindness.ts",
      "site/src/scripts/sprouts-garden.ts",
      "site/src/scripts/sprouts-quest.ts",
      "site/src/pages/[lang]/sighar/index.astro",
      "site/src/pages/[lang]/sighar/garden.astro",
      "site/src/pages/[lang]/sighar/quest.astro",
      "site/src/pages/[lang]/sighar/kindness.astro",
      "site/src/pages/[lang]/sighar/stories.astro",
      "site/src/pages/[lang]/sighar/sprouts-garden.astro",
      "site/src/pages/[lang]/sighar/sprouts-quest.astro",
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

  it("kindness deeds validate: exactly 30 days, bilingual, draft, no typed honorifics", () => {
    const d = deeds();
    expect(d.deeds.length).toBe(30);
    const days = d.deeds.map((x) => x.day).sort((a, b) => a - b);
    expect(days).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    for (const x of d.deeds) {
      expect(typeof x.icon === "string" && x.icon.length > 0, `day ${x.day} icon`).toBe(true);
      expect(typeof x.deed?.ar === "string" && x.deed.ar.length > 0, `day ${x.day} deed.ar`).toBe(true);
      expect(typeof x.deed?.en === "string" && x.deed.en.length > 0, `day ${x.day} deed.en`).toBe(true);
    }
    expect(d.status?.review).toBe("draft");
    expect(d.provenance?.generated_by).toBeTruthy();
    const raw = readFileSync(DEEDS, "utf8");
    expect(HONORIFIC.test(raw), "deeds typed honorific").toBe(false);
    expect(/[﴿﴾]/.test(raw), "deeds typed Quran text").toBe(false);
  });

  it("sprout stories validate: 5 retellings, slugs match quest stops, draft, no typed honorifics", () => {
    const s = stories();
    expect(s.stories.length).toBe(5);
    expect(s.stories.map((x) => x.slug)).toEqual(["adam", "nuh", "ibrahim", "musa", "isa"]);
    const bySlug = new Map(quest().stops.map((x) => [x.slug, x]));
    for (const st of s.stories) {
      for (const k of ["prophet", "title", "body", "talk"] as const) {
        expect(typeof st[k].ar === "string" && st[k].ar.length > 0, `${st.slug}.${k}.ar`).toBe(true);
        expect(typeof st[k].en === "string" && st[k].en.length > 0, `${st.slug}.${k}.en`).toBe(true);
      }
      expect(typeof st.icon === "string" && st.icon.length > 0, `${st.slug}.icon`).toBe(true);
      // Prophet names are plain: the UI renders honorifics via kidsHonorify.
      expect(HONORIFIC.test(JSON.stringify(st.prophet)), `${st.slug} prophet name typed honorific`).toBe(false);
      // body must be a retelling of the quest stop's story, not a copy.
      const stop = bySlug.get(st.slug)!;
      expect(stop, `${st.slug} has a quest stop`).toBeTruthy();
      expect(st.body.ar).not.toBe(stop.story.ar);
      expect(st.body.ar.length).not.toBe(stop.story.ar.length);
      const words = st.body.ar.split(/\s+/);
      let sharesLongPhrase = false;
      for (let i = 0; i + 12 <= words.length; i++) {
        if (stop.story.ar.includes(words.slice(i, i + 12).join(" "))) { sharesLongPhrase = true; break; }
      }
      expect(sharesLongPhrase, `${st.slug} body shares a 12+ word phrase with the quest story`).toBe(false);
    }
    expect(s.status?.review).toBe("draft");
    expect(s.provenance?.generated_by).toBeTruthy();
    const raw = readFileSync(STORIES, "utf8");
    expect(HONORIFIC.test(raw), "stories typed honorific").toBe(false);
    expect(/[﴿﴾]/.test(raw), "stories typed Quran text").toBe(false);
  });

  it("quest stops carry sprout lines: ≤ 2 sentences each, no typed honorifics", () => {
    const q = quest();
    expect(q.stops.length).toBe(5);
    for (const s of q.stops) {
      const sprout = (s as QuestStop & { sprout?: Bilingual }).sprout;
      expect(sprout?.ar?.length > 0, `${s.slug} sprout.ar`).toBe(true);
      expect(sprout?.en?.length > 0, `${s.slug} sprout.en`).toBe(true);
      expect(sprout!.ar.split(/[.!؟?]/).filter(Boolean).length).toBeLessThanOrEqual(2);
      expect(sprout!.en.split(/[.!؟?]/).filter(Boolean).length).toBeLessThanOrEqual(2);
      expect(HONORIFIC.test(JSON.stringify(sprout)), `${s.slug} sprout typed honorific`).toBe(false);
    }
  });

  it("kids.ts exports the new loaders and views", () => {
    const t = readFileSync("site/src/lib/kids.ts", "utf8");
    for (const fn of [
      "export function loadDeeds",
      "export function loadStories",
      "export function viewStories",
      "export function viewSproutLines",
      "export function storyAudioExists",
    ]) expect(t).toContain(fn);
  });

  it("new kids' pages opt into the kids chrome and use the new scripts", () => {
    for (const p of [
      "site/src/pages/[lang]/sighar/kindness.astro",
      "site/src/pages/[lang]/sighar/stories.astro",
      "site/src/pages/[lang]/sighar/sprouts-garden.astro",
      "site/src/pages/[lang]/sighar/sprouts-quest.astro",
    ]) {
      expect(readFileSync(p, "utf8")).toContain("kids");
    }
  });

  it("story audio player is gated at build time, never unconditional", () => {
    const t = readFileSync("site/src/pages/[lang]/sighar/stories.astro", "utf8");
    expect(t).toContain("audio/kids");
    expect(t.includes("storyAudioExists") || t.includes("existsSync"), "build-time audio existence check").toBe(true);
  });

  it("kindness quest supports printing the sticker chart", () => {
    const comp = readFileSync("site/src/components/KindnessQuest.astro", "utf8");
    expect(comp).toContain("print");
    const page = readFileSync("site/src/pages/[lang]/sighar/kindness.astro", "utf8");
    expect(page.includes("kindness_print") || comp.includes("kindness_print"), "t.kindness_print reference").toBe(true);
  });

  /** All .astro files under the kids' pages dir (recursive) plus kids' components. */
  const kidsAstroFiles = (): string[] => {
    const out: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".astro")) out.push(p);
      }
    };
    walk("site/src/pages/[lang]/sighar");
    for (const f of readdirSync("site/src/components")) {
      if (f.endsWith(".astro") && /Hudhud|Garden|Quest|Retell|Journal/i.test(f))
        out.push(`site/src/components/${f}`);
    }
    return out;
  };

  it("every relative import and <script src> in kids' .astro files resolves to a real file", () => {
    const astroFiles = kidsAstroFiles();
    const SRC = /<script\s+src="(\.[^"]+)"/g;
    const IMP = /(?:import|from)\s+["'](\.[^"']+)["']/g;
    for (const f of astroFiles) {
      const dir = f.slice(0, f.lastIndexOf("/"));
      const text = readFileSync(f, "utf8");
      const check = (re: RegExp, kind: string) => {
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          const base = normalize(`${dir}/${m[1]}`);
          // TS-style imports omit the extension; try .ts/.tsx/index variants.
          const ok =
            existsSync(base) ||
            existsSync(base + ".ts") ||
            existsSync(base + ".tsx") ||
            existsSync(base + "/index.ts");
          expect(ok, `${f}: ${kind} ${m[1]} must exist`).toBe(true);
        }
      };
      check(SRC, "script src");
      check(IMP, "import");
    }
  });

  it("every kids' .astro file opens with a frontmatter fence (build-breaker guard)", () => {
    const files = kidsAstroFiles();
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const first = readFileSync(f, "utf8").split("\n")[0].trim();
      expect(first, `${f} must start with ---`).toBe("---");
    }
  });
});

describe("kids wing phase 4+5 (storytellers + teachers)", () => {
  const QUEST_SLUGS = ["adam", "nuh", "ibrahim", "musa", "isa"];
  const noHonorifics = (text: string, where: string) =>
    expect(HONORIFIC.test(text), `${where}: typed honorific`).toBe(false);
  const noQuranMarks = (text: string, where: string) =>
    expect(text.includes("﴿") || text.includes("﴾"), `${where}: typed Quran marks`).toBe(false);
  const bilingualOk = (v: any, where: string) => {
    expect(typeof v?.ar === "string" && v.ar.length > 0, `${where}.ar`).toBe(true);
    expect(typeof v?.en === "string" && v.en.length > 0, `${where}.en`).toBe(true);
  };

  it("retell.yaml: prompts for all 5 quest stops, 3 per language", () => {
    const raw = parse(readFileSync("kids/retell.yaml", "utf8")) as any;
    expect(raw.status?.review).toBe("draft");
    expect(raw.provenance).toBeTruthy();
    const slugs = raw.retell.map((p: any) => p.stop_slug).sort();
    expect(slugs).toEqual([...QUEST_SLUGS].sort());
    for (const p of raw.retell) {
      expect(p.prompts.ar.length).toBe(3);
      expect(p.prompts.en.length).toBe(3);
      for (const q of [...p.prompts.ar, ...p.prompts.en]) {
        noHonorifics(q, `retell ${p.stop_slug}`);
        noQuranMarks(q, `retell ${p.stop_slug}`);
      }
    }
  });

  it("bridge.yaml: cards link to real built routes only", () => {
    const raw = parse(readFileSync("kids/bridge.yaml", "utf8")) as any;
    expect(raw.bridge.length).toBeGreaterThanOrEqual(6);
    expect(raw.bridge.length).toBeLessThanOrEqual(9);
    for (const c of raw.bridge) {
      bilingualOk(c.title, `bridge ${c.slug}`);
      bilingualOk(c.desc, `bridge ${c.slug}`);
      const dataFile =
        c.kind === "story" ? `cards/stories/${c.slug}.yaml`
        : c.kind === "explain" ? `cards/explainers/${c.slug}.yaml`
        : `cards/wordmap/${c.slug}.json`;
      expect(existsSync(dataFile), `bridge ${c.slug}: ${dataFile} must exist`).toBe(true);
      noHonorifics(c.title.ar + c.title.en + c.desc.ar + c.desc.en, `bridge ${c.slug}`);
    }
  });

  it("lessons.yaml: 6 units with full 40-min plans", () => {
    const raw = parse(readFileSync("kids/lessons.yaml", "utf8")) as any;
    expect(raw.status?.review).toBe("draft");
    const slugs = raw.lessons.map((u: any) => u.unit_slug).sort();
    expect(slugs).toEqual(["garden", "journal", "kindness", "quest", "retell", "stories"]);
    for (const u of raw.lessons) {
      expect(u.experience_href.startsWith("/sighar/"), `${u.unit_slug}: experience_href`).toBe(true);
      expect(u.objectives.ar.length).toBeGreaterThanOrEqual(3);
      expect(u.objectives.en.length).toBeGreaterThanOrEqual(3);
      expect(u.flow_40min.ar.length).toBeGreaterThanOrEqual(5);
      for (const s of [...u.flow_40min.ar, ...u.flow_40min.en]) {
        expect(s.t && s.what, `${u.unit_slug}: flow step needs t+what`).toBeTruthy();
      }
      expect(u.discussion_prompts.ar.length).toBeGreaterThanOrEqual(3);
      expect(u.worksheet.ar.length).toBeGreaterThanOrEqual(5);
      expect(u.worksheet.en.length).toBeGreaterThanOrEqual(5);
      const all = JSON.stringify(u);
      noHonorifics(all, `lesson ${u.unit_slug}`);
      noQuranMarks(all, `lesson ${u.unit_slug}`);
    }
  });

  it("paths.yaml: 3 paths whose units all exist in lessons.yaml", () => {
    const raw = parse(readFileSync("kids/paths.yaml", "utf8")) as any;
    const lessons = parse(readFileSync("kids/lessons.yaml", "utf8")) as any;
    const unitSlugs = new Set(lessons.lessons.map((u: any) => u.unit_slug));
    expect(raw.paths.length).toBe(3);
    for (const p of raw.paths) {
      bilingualOk(p.title, `path ${p.path_slug}`);
      bilingualOk(p.desc, `path ${p.path_slug}`);
      expect(p.units.length).toBeGreaterThanOrEqual(2);
      for (const u of p.units)
        expect(unitSlugs.has(u), `path ${p.path_slug}: unit ${u} must exist`).toBe(true);
    }
  });

  it("pilot.yaml: prepare checklist, 4 weeks, feedback, TODO contact", () => {
    const raw = parse(readFileSync("kids/pilot.yaml", "utf8")) as any;
    expect(raw.prepare.ar.length).toBeGreaterThanOrEqual(4);
    expect(raw.weeks.length).toBe(4);
    for (const w of raw.weeks) {
      bilingualOk(w.title, "pilot week");
      expect(w.points.ar.length).toBeGreaterThanOrEqual(2);
    }
    expect(raw.feedback_questions.ar.length).toBe(3);
    expect(/TODO/i.test(raw.contact_note.ar + raw.contact_note.en), "pilot contact is a TODO").toBe(true);
    expect(/@/.test(raw.contact_note.ar + raw.contact_note.en), "pilot contact has no email").toBe(false);
  });

  it("new pages and scripts exist", () => {
    for (const p of [
      "site/src/pages/[lang]/sighar/retell.astro",
      "site/src/pages/[lang]/sighar/journal.astro",
      "site/src/pages/[lang]/sighar/teachers.astro",
      "site/src/pages/[lang]/sighar/teachers/lessons/[unit].astro",
      "site/src/pages/[lang]/sighar/teachers/paths/[path].astro",
      "site/src/pages/[lang]/sighar/teachers/pilot.astro",
      "site/src/scripts/retell.ts",
      "site/src/scripts/journal.ts",
      "site/src/scripts/classroom.ts",
    ]) {
      expect(existsSync(p), `${p} must exist`).toBe(true);
    }
  });

  it("classroom mode is wired: script loaded in kids chrome, vote banner in quest", () => {
    const layout = readFileSync("site/src/layouts/BaseLayout.astro", "utf8");
    expect(layout).toContain("classroom.ts");
    const quest = readFileSync("site/src/components/ProphetQuest.astro", "utf8");
    expect(quest).toContain("data-vote-banner");
    const css = readFileSync("site/src/styles/kids.css", "utf8");
    expect(css).toContain("html.classroom");
  });
});
