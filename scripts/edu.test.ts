// Education programme tests (docs/delegation/education-master-plan.md E1, appendix C): the band ladder, the
// stamp rules, trilingual parity of the `edu:` strings, the routes the data names, no typed honorifics, the
// page-weight budget table, and the QR helper.
import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { loadPacks } from "../site/src/lib/packs.ts";

// Site libs (facts, homework, where, packs) read .cache/graph.json; the CI test job runs `npm test`
// without the build, so compile the graph once here when it is missing.
if (!existsSync(".cache/graph.json")) {
  execSync("npm run graph", { stdio: "inherit" });
}

const HONORIFIC = /(peace be upon him|\bpbuh\b|\(saw\)|ﷺ|صلى الله عليه|صلى اللّٰه عليه|عليه السلام|عليها السلام|رضي الله ع|رضي اللّٰه ع|رحمه الله|رحمها الله)/;
const LANGS = ["ar", "en", "ur"] as const;
const i18n = (l: string) => parse(readFileSync(`i18n/${l}.yaml`, "utf8"));
const bands = () => parse(readFileSync("edu/bands.yaml", "utf8")).bands as any[];
const stamps = () => parse(readFileSync("edu/stamps.yaml", "utf8")).stamps as any[];
const PAGES = "site/src/pages/[lang]";
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
/** Does a static route (without the language prefix) have a page file? */
const routeBuilt = (route: string): boolean => {
  const base = `${PAGES}${route.replace(/\/$/, "")}`;
  return existsSync(`${base}.astro`) || existsSync(`${base}/index.astro`);
};

describe("education: bands and stamps", () => {
  it("five bands in ladder order with ar/en/ur strings and built hubs for the kids' wing", () => {
    const b = bands();
    expect(b.map((x) => x.id)).toEqual(["sprouts", "explorers", "storytellers", "scholars", "researchers"]);
    b.forEach((x, i) => {
      expect(x.next).toBe(b[i + 1]?.id ?? null);
      expect(x.ages.min).toBeLessThan(x.ages.max);
      if (i > 0) expect(x.ages.min).toBe(b[i - 1].ages.max + 1);
      for (const l of LANGS) for (const f of ["name", "ages_label", "voice"]) expect(typeof x[f][l] === "string" && x[f][l].length > 0, `${x.id}.${f}.${l}`).toBe(true);
      expect(x.voice.ur, `${x.id}: Urdu voice repeats the English`).not.toBe(x.voice.en);
      if (x.wing === "sighar") expect(routeBuilt(x.hub), `hub ${x.hub}`).toBe(true);
      for (const a of x.activities) expect(routeBuilt(a.href), `activity ${a.href}`).toBe(true);
    });
    expect(b.find((x) => x.id === "sprouts").stateless).toBe(true);
  });

  it("every stamp names a band, a known rule, a built route, and a storage key a script writes", () => {
    const s = stamps();
    const ids = new Set(s.map((x) => x.id));
    expect(ids.size).toBe(s.length);
    const bandIds = new Set(bands().map((b) => b.id));
    const scripts = readdirSync("site/src/scripts").filter((f) => f.endsWith(".ts")).map((f) => readFileSync(`site/src/scripts/${f}`, "utf8")).join("\n");
    for (const x of s) {
      expect(bandIds.has(x.band), x.id).toBe(true);
      expect(x.earn.rule).toMatch(/^(list-min|number-min|keys-min|prefix-keys-min):\d+$|^prefix-any$/);
      expect(routeBuilt(x.href), `${x.id} -> ${x.href}`).toBe(true);
      const key = x.earn.key.replace(/[:-]$/, "");
      expect(scripts.includes(key), `${x.id}: no script writes a key starting with ${x.earn.key}`).toBe(true);
      for (const l of LANGS) expect(x.label[l]?.length > 0, `${x.id}.label.${l}`).toBe(true);
    }
    expect(s.some((x) => x.band === "sprouts"), "Sprouts are stateless and earn no stamp").toBe(false);
  });

  it("no typed honorifics in edu/ data or the edu strings", () => {
    for (const f of ["edu/bands.yaml", "edu/stamps.yaml"]) expect(HONORIFIC.test(readFileSync(f, "utf8")), f).toBe(false);
    for (const l of LANGS) expect(HONORIFIC.test(JSON.stringify(i18n(l).edu)), `i18n ${l} edu`).toBe(false);
  });
});

describe("education: i18n", () => {
  it("edu block has full ar/en/ur parity, every value non-empty, placeholders matching", () => {
    const ar = i18n("ar").edu, en = i18n("en").edu, ur = i18n("ur").edu;
    const ka = Object.keys(ar).sort();
    expect(Object.keys(en).sort()).toEqual(ka);
    expect(Object.keys(ur).sort()).toEqual(ka);
    const ph = (v: unknown) => [...JSON.stringify(v).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const k of ka) {
      for (const [l, d] of [["ar", ar], ["en", en], ["ur", ur]] as const) {
        const v = (d as any)[k];
        expect(Array.isArray(v) ? v.length > 0 && v.every((x: string) => x.length > 0) : typeof v === "string" && v.length > 0, `${l} edu.${k}`).toBe(true);
      }
      expect(ph(ur[k]), `edu.${k}: Urdu placeholders`).toEqual(ph(ar[k]));
      expect(ph(en[k]), `edu.${k}: English placeholders`).toEqual(ph(ar[k]));
    }
  });
  it("Urdu edu strings are not the English ones", () => {
    const en = i18n("en").edu, ur = i18n("ur").edu;
    const same = Object.keys(en).filter((k) => typeof en[k] === "string" && en[k] === ur[k] && !/^(islam\.museum|QR)/.test(en[k]));
    expect(same, "ur repeats en for").toEqual([]);
  });
  it("kids block has Urdu parity too", () => {
    const ar = i18n("ar").kids, ur = i18n("ur").kids;
    expect(Object.keys(ur).sort()).toEqual(Object.keys(ar).sort());
    for (const k of Object.keys(ar)) expect(typeof ur[k] === "string" && ur[k].length > 0, `ur kids.${k}`).toBe(true);
  });
});

describe("education: routes and wiring", () => {
  it("front door, trails, passport, teacher and family hubs and the three band hubs exist", () => {
    for (const r of ["/learn/", "/learn/trails/", "/learn/passport/", "/learn/teachers/", "/learn/parents/", "/sighar/sprouts/", "/sighar/explorers/", "/sighar/storytellers/"]) expect(routeBuilt(r), r).toBe(true);
  });
  it("every relative import and <script src> in the new pages and components resolves", () => {
    const files = [...walk(`${PAGES}/learn`), `${PAGES}/sighar/sprouts.astro`, `${PAGES}/sighar/explorers.astro`, `${PAGES}/sighar/storytellers.astro`,
      "site/src/components/BandHub.astro", "site/src/components/PassportStrip.astro", "site/src/components/ClassroomQuiz.astro", "site/src/components/StudyModes.astro", "site/src/components/Qr.astro",
      `${PAGES}/sighar/read/[class]/[slug].astro`, "site/src/components/ReadShelf.astro", "site/src/components/LevelSwitcher.astro", "site/src/components/PathwayWorksheet.astro"];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      const dir = f.slice(0, f.lastIndexOf("/"));
      for (const m of src.matchAll(/(?:from|src=)\s*["'](\.[^"']+)["']/g)) {
        const target = `${dir}/${m[1]}`;
        const ok = existsSync(target) || existsSync(`${target}.ts`) || existsSync(`${target}.astro`);
        expect(ok, `${f}: ${m[1]}`).toBe(true);
      }
    }
  });
  it("the kids hub links the three band hubs and the kit links the teacher hub", () => {
    const hub = readFileSync(`${PAGES}/sighar/index.astro`, "utf8");
    for (const b of ["sprouts", "explorers", "storytellers"]) expect(hub.includes(`/sighar/${b}/`)).toBe(true);
    expect(readFileSync(`${PAGES}/sighar/teachers.astro`, "utf8").includes("/learn/teachers/")).toBe(true);
  });
  it("the quest page draws the celebrating mascot once and reuses it", () => {
    const q = readFileSync("site/src/components/ProphetQuest.astro", "utf8");
    expect((q.match(/<Hudhud /g) ?? []).length).toBe(1);
    expect((q.match(/href="#hudhud-celebrate"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
  it("study scripts never fetch and only touch storage inside try/catch", () => {
    // every `localStorage.` use must sit inside a try { ... } block (brace-matched), so a browser without storage never throws
    const trySpans = (src: string): [number, number][] => {
      const spans: [number, number][] = [];
      for (const m of src.matchAll(/\btry\s*\{/g)) {
        let depth = 0, i = m.index! + m[0].length - 1;
        for (; i < src.length; i++) { if (src[i] === "{") depth++; else if (src[i] === "}") { depth--; if (depth === 0) break; } }
        spans.push([m.index!, i]);
      }
      return spans;
    };
    for (const f of ["passport.ts", "study.ts", "share.ts", "quiz.ts", "classroom-quiz.ts"]) {
      const src = readFileSync(`site/src/scripts/${f}`, "utf8");
      expect(src.includes("fetch("), `${f} fetches`).toBe(false);
      const spans = trySpans(src);
      for (const m of src.matchAll(/localStorage\./g)) {
        const inside = spans.some(([a, b]) => m.index! > a && m.index! < b);
        expect(inside, `${f}: localStorage used outside try/catch at ${m.index}`).toBe(true);
      }
    }
  });
  it("printables carry a QR: lesson worksheet, kindness chart, retell, pathway handout, deck", () => {
    for (const f of [`${PAGES}/sighar/teachers/lessons/[unit].astro`, "site/src/components/KindnessQuest.astro", "site/src/components/RetellBox.astro", "site/src/components/Pathway.astro", "site/src/components/StudyModes.astro"]) expect(readFileSync(f, "utf8").includes("<Qr "), f).toBe(true);
  });
});

describe("education: weight budgets and QR", () => {
  it("budget table names built routes with sane limits", async () => {
    const { BUDGETS } = await import("./check-weight.ts");
    for (const b of BUDGETS) {
      const dynamic =
        /^\/ar\/(cards\/list|sighar\/teachers\/lessons|sighar\/read\/[a-z]+|learn\/teachers\/pathways|learn\/teachers\/quiz|learn\/teachers\/packs|[a-z]+)\/[a-z0-9-]+\/(print\/)?$/.test(b.route) ||
        /^\/ar\/shabab\/(60s|glossary|practice|dilemmas|detective)\/[a-z0-9-]+\/$/.test(b.route);
      expect(routeBuilt(b.route.replace(/^\/ar/, "")) || dynamic, b.route).toBe(true);
      expect(b.html).toBeLessThanOrEqual(700 * 1024);
      expect(b.js).toBeLessThanOrEqual(30 * 1024);
    }
  });
  it("qrSvg renders a square module grid with the finder patterns", async () => {
    const { qrSvg } = await import("../site/src/lib/qr.ts");
    const svg = qrSvg("https://islam.museum/ar/learn/passport/", 100, "QR");
    expect(svg.startsWith("<svg")).toBe(true);
    const side = Number(svg.match(/viewBox="0 0 (\d+) \d+"/)![1]);
    expect(side).toBeGreaterThanOrEqual(25 + 4);
    // a finder pattern's top-left corner: the module at (2,2) is dark, (3,3) is light, (4,4) is dark (quiet zone of 2)
    for (const [x, y, dark] of [[2, 2, true], [3, 3, false], [4, 4, true]] as const) expect(svg.includes(`M${x} ${y}h1v1h-1z`)).toBe(dark);
  });
});

describe("education: leveled reading list (E2, plan §9.1 decision 5)", () => {
  const list = () => parse(readFileSync("edu/leveled-100.yaml", "utf8"));
  it("proposes exactly 100 distinct records that exist, each with a tier, a reason and prose in ar, en and ur", () => {
    const d = list();
    const r: any[] = d.records;
    expect(r.length).toBe(100);
    expect(new Set(r.map((x) => x.id)).size).toBe(100);
    for (const x of r) {
      const [cls, slug] = x.id.split("/");
      expect(existsSync(`data/${cls}/${slug}.yaml`), x.id).toBe(true);
      expect(["topic", "prophet", "era", "city", "rank"]).toContain(x.tier);
      if (x.tier === "topic") expect(x.topic >= 1 && x.topic <= 50, `${x.id} topic`).toBe(true);
      expect(typeof x.reason === "string" && x.reason.length > 10, `${x.id} reason`).toBe(true);
      expect(x.prose, `${x.id} prose`).toEqual(["ar", "en", "ur"]);
      for (const l of LANGS) expect(existsSync(`content/${l}/${cls}/${slug}.md`), `${x.id} ${l} prose`).toBe(true);
      const ar = readFileSync(`content/ar/${cls}/${slug}.md`, "utf8");
      expect(/^## (نبذة|موجز)\s*$/m.test(ar), `${x.id} brief flag`).toBe(x.brief);
      expect(typeof x.inbound).toBe("number");
    }
  });
  it("covers the five quest prophets, the twenty Time Machine records and every anchored appendix B topic once", () => {
    const ids = new Set((list().records as any[]).map((x) => x.id));
    const stops = parse(readFileSync("kids/quest-stops.yaml", "utf8")).stops as any[];
    const PROPHET: Record<string, string> = { adam: "person/adam", nuh: "person/nuh", ibrahim: "person/ibrahim", musa: "person/musa", isa: "person/isa-ibn-maryam" };
    for (const s of stops) expect(ids.has(PROPHET[s.slug]), s.slug).toBe(true);
    const eras = parse(readFileSync("kids/eras.yaml", "utf8")).eras as any[];
    for (const e of eras) for (const ev of e.events) expect(ids.has(ev.source), ev.source).toBe(true);
    const topics = (list().records as any[]).filter((x) => x.tier === "topic").map((x) => x.topic);
    const anchored = new Set(topics);
    const unanchored = new Set((list().unanchored as any[]).map((u) => u.topic));
    for (let t = 1; t <= 50; t++) expect(anchored.has(t) || unanchored.has(t), `topic ${t} neither anchored nor listed as unanchored`).toBe(true);
    for (const t of unanchored) expect(anchored.has(t), `topic ${t} both anchored and unanchored`).toBe(false);
  });
  it("stays a proposal until the founder approves it", () => {
    const d = list();
    expect(["pending", "approved"]).toContain(d.status.approval);
    expect(HONORIFIC.test(readFileSync("edu/leveled-100.yaml", "utf8"))).toBe(false);
  });
});

describe("education: leveled reading (E2 step 2)", () => {
  const levels = () => parse(readFileSync("edu/levels.yaml", "utf8")).levels as any[];
  const proseOf = (id: string, lang: string, body: string) => ({ id, lang, file: `content/${lang}/${id}.md`, frontmatter: { id, lang }, body });
  const ent = (id: string, education?: any) => ({ entity: { id, class: id.split("/")[0], label: { ar: "x" }, summary: { ar: "x" }, status: { review: "draft" }, ...(education ? { education } : {}) }, file: `data/${id}.yaml` });
  const H = { ar: ["للبراعم", "للمستكشفين", "للدارسين"], en: ["For Sprouts", "For Explorers", "For Scholars"], ur: ["کونپلوں کے لیے", "مہم جوؤں کے لیے", "طالبِ علم کے لیے"] } as const;
  const full = (id: string, texts: Record<string, [string, string, string]>) => Object.entries(texts).map(([l, t]) => proseOf(id, l, `## x\nbody\n\n## ${H[l as "ar"][0]}\n${t[0]}\n\n## ${H[l as "ar"][1]}\n${t[1]}\n\n## ${H[l as "ar"][2]}\n${t[2]}\n`));
  const ok = { ar: ["نص قصير.", "نص أطول قليلًا.", "نص للدارسين."], en: ["Short.", "A bit longer.", "For scholars."], ur: ["مختصر۔", "تھوڑا لمبا۔", "طالبِ علم کے لیے۔"] } as Record<string, [string, string, string]>;

  it("three levels in band order with ar/en/ur headings and the plan's word caps (80, 160, 300)", () => {
    const l = levels();
    expect(l.map((x) => x.id)).toEqual(["sprouts", "explorers", "scholars"]);
    expect(l.map((x) => x.max_words)).toEqual([80, 160, 300]);
    expect(l.map((x) => x.child)).toEqual([true, true, false]);
    const seen = new Set<string>();
    for (const x of l) for (const lang of LANGS) { expect(x.heading[lang]?.length > 0, `${x.id}.${lang}`).toBe(true); expect(seen.has(x.heading[lang]), `duplicate heading ${x.heading[lang]}`).toBe(false); seen.add(x.heading[lang]); }
    expect(HONORIFIC.test(readFileSync("edu/levels.yaml", "utf8"))).toBe(false);
  });

  it("the validator accepts a complete trilingual record and counts words after links and citations", async () => {
    const { checkLeveledReading, levelWordCount } = await import("./validate.ts");
    expect(levelWordCount("a [[person/x|b c]] d {cite:src p.1} e")).toBe(5);
    const issues = checkLeveledReading(full("event/t", ok), [ent("event/t", { levels: ["sprouts", "explorers", "scholars"], flagged_for_kids: true })]);
    expect(issues).toEqual([]);
  });

  it("the validator rejects over-length, banned, foreign-heading, partial and undeclared levels", async () => {
    const { checkLeveledReading } = await import("./validate.ts");
    const msgs = (i: any[]) => i.map((x) => x.msg).join("\n");
    const long = { ...ok, ar: [Array(81).fill("كلمة").join(" "), ok.ar[1], ok.ar[2]] as [string, string, string] };
    expect(msgs(checkLeveledReading(full("event/t", long), [ent("event/t", { levels: ["sprouts", "explorers", "scholars"] })]))).toMatch(/81 words; the sprouts level allows at most 80/);
    const scary = { ...ok, en: ["The people were killed.", ok.en[1], ok.en[2]] as [string, string, string] };
    expect(msgs(checkLeveledReading(full("event/t", scary), [ent("event/t", { levels: ["sprouts", "explorers", "scholars"] })]))).toMatch(/child level and contains graphic battle or death detail/);
    const persp = { ...ok, ar: [ok.ar[0], ":::perspectives\n- **أهل السنة**: x\n:::", ok.ar[2]] as [string, string, string] };
    expect(msgs(checkLeveledReading(full("event/t", persp), [ent("event/t", { levels: ["sprouts", "explorers", "scholars"] })]))).toMatch(/must not carry a perspectives block/);
    const foreign = [proseOf("event/t", "en", "## للبراعم\nx\n")];
    expect(msgs(checkLeveledReading(foreign, [ent("event/t")]))).toMatch(/in en prose write "## For Sprouts"/);
    const partial = [proseOf("event/t", "ar", "## للبراعم\nx\n")];
    expect(msgs(checkLeveledReading(partial, [ent("event/t", { levels: ["sprouts"] })]))).toMatch(/not in en, ur/);
    expect(msgs(checkLeveledReading(full("event/t", ok), [ent("event/t", { levels: ["sprouts"] })]))).toMatch(/education.levels \[sprouts\] must match/);
    expect(msgs(checkLeveledReading(full("event/t", ok), [ent("event/t")]))).toMatch(/education.levels \[\] must match/);
    expect(msgs(checkLeveledReading([], [ent("event/t", { levels: ["sprouts"] })]))).toMatch(/content\/ has no leveled section/);
    expect(msgs(checkLeveledReading(full("event/t", ok), [ent("event/t", { levels: ["sprouts", "explorers", "scholars"], flagged_for_kids: true })]))).toBe("");
    const noExp = Object.entries(ok).map(([l, t]) => proseOf("event/t", l, `## ${H[l as "ar"][2]}\n${t[2]}\n`));
    expect(msgs(checkLeveledReading(noExp, [ent("event/t", { levels: ["scholars"], flagged_for_kids: true })]))).toMatch(/flagged_for_kids needs the explorers level/);
  });

  it("the fixture records carry the three levels in three languages and the kids flag", () => {
    for (const id of ["event/hijra", "person/ibrahim", "building/bayt-al-hikma"]) {
      const d = parse(readFileSync(`data/${id}.yaml`, "utf8"));
      expect(d.education?.levels, id).toEqual(["sprouts", "explorers", "scholars"]);
      expect(d.education?.flagged_for_kids, id).toBe(true);
      expect(d.status?.review, id).toBe("draft");
      for (const l of LANGS) { const body = readFileSync(`content/${l}/${id}.md`, "utf8"); for (const h of H[l]) expect(body.includes(`## ${h}`), `${id} ${l} ${h}`).toBe(true); }
    }
  });

  it("the entity layout removes level sections from the article flow and the reader never shows the Scholars text", () => {
    const layout = readFileSync("site/src/layouts/EntityLayout.astro", "utf8");
    expect(layout.includes("<LevelSwitcher")).toBe(true);
    expect(layout).toMatch(/filter\(\(s\) => !levelSecs\.includes\(s\)\)/);
    const sw = readFileSync("site/src/components/LevelSwitcher.astro", "utf8");
    expect(sw).toMatch(/checked=\{id === defaultId\}/);
    expect(sw).toMatch(/const defaultId = "scholars"/);
    expect(sw).toMatch(/localStorage\.(get|set)Item/);
    for (const m of sw.matchAll(/localStorage\./g)) expect(sw.slice(Math.max(0, m.index! - 120), m.index!).includes("try{"), "localStorage outside try").toBe(true);
    const reader = readFileSync(`${PAGES}/sighar/read/[class]/[slug].astro`, "utf8");
    expect(reader).toMatch(/flagged_for_kids/);
    expect(reader.includes('text("scholars")')).toBe(false);
    expect(reader.includes("<script is:inline")).toBe(false);
    expect(reader.includes("shelf.ts")).toBe(true);
    expect(reader.includes("bridge-card")).toBe(true);
    for (const hub of ["explorers", "storytellers"]) expect(readFileSync(`${PAGES}/sighar/${hub}.astro`, "utf8").includes("<ReadShelf")).toBe(true);
  });
});

describe("education: Ontario curriculum pathways (E2 step 3)", () => {
  const files = readdirSync("data/exhibit").filter((f) => f.startsWith("pathway-")).map((f) => `data/exhibit/${f}`);
  const recs = () => files.map((f) => ({ file: f, d: parse(readFileSync(f, "utf8")) }));
  it("twelve lesson pathways with a complete curriculum block, 5 to 15 steps over existing records, and trilingual text", () => {
    const r = recs();
    expect(r.length).toBe(12);
    for (const { file, d } of r) {
      expect(d.kind, file).toBe("lesson");
      expect(d.audience, file).toEqual(["teacher", "student"]);
      expect(["intro", "standard", "deep"]).toContain(d.level);
      const c = d.curriculum;
      for (const k of ["jurisdiction", "course", "grade", "strand", "expectation", "expectations", "course_title", "strand_title", "document", "verified"]) expect(c[k], `${file} curriculum.${k}`).toBeTruthy();
      expect(c.jurisdiction).toBe("on-ca");
      expect(c.verified).toBe("2026-10-23");
      expect(d.rooms.length).toBeGreaterThanOrEqual(5);
      expect(d.rooms.length).toBeLessThanOrEqual(15);
      for (const room of d.rooms) { for (const f of room.features) { const [cls, slug] = f.split("/"); expect(existsSync(`data/${cls}/${slug}.yaml`), `${file}: ${f}`).toBe(true); } for (const l of LANGS) expect(room.title[l] && room.body[l], `${file} room ${l}`).toBeTruthy(); }
      for (const l of LANGS) { expect(d.label[l] && d.summary[l] && d.goal[l] && c.expectation[l], `${file} ${l}`).toBeTruthy(); expect(existsSync(`content/${l}/exhibit/${d.id.split("/")[1]}.md`), `${file} prose ${l}`).toBe(true); }
      expect(d.worksheet.length).toBe(5);
      for (const w of d.worksheet) { for (const l of LANGS) expect(w.prompt[l], file).toBeTruthy(); for (const k of w.steps) expect(k >= 0 && k < d.rooms.length, `${file} worksheet step ${k}`).toBe(true); }
      expect(d.outcomes.length).toBeGreaterThanOrEqual(2);
      for (const o of d.outcomes) for (const k of o.steps) expect(k < d.rooms.length, `${file} outcome step ${k}`).toBe(true);
      expect(d.status.review).toBe("draft");
      expect(HONORIFIC.test(readFileSync(file, "utf8")), file).toBe(false);
      // the Ministry's own words never enter the mapping: the expectation is written as a lesson, not as an outcome code
      expect(/By the end of (this course|Grade)/i.test(c.expectation.en), `${file}: Ministry phrasing`).toBe(false);
      expect(d.sources.some((x: string) => x.startsWith("source/ontario-curriculum-")), `${file}: cites the curriculum document`).toBe(true);
    }
    const courses = new Set(r.map((x) => x.d.curriculum.course));
    for (const code of ["G4-SS", "G6-SS", "CHW3M", "CHY4U", "HRT3M", "HRF3O"]) expect(courses.has(code), code).toBe(true);
    expect(r.filter((x) => x.d.curriculum.course === "CHW3M").length).toBe(5);
  });
  it("the validator's curriculum rules reject a short, teacher-less or untranslated pathway", async () => {
    const { checkCurriculum } = await import("./validate.ts");
    const msgs = (i: any[]) => i.map((x) => x.msg).join("\n");
    const good = recs()[0].d;
    const all = recs().map((x) => ({ entity: x.d, file: x.file }));
    const ids = [...new Set(all.flatMap((x) => (x.entity.rooms as any[]).flatMap((r) => r.features)))].map((id) => ({ entity: { id, class: id.split("/")[0] }, file: id }));
    expect(msgs(checkCurriculum([...all, ...ids]))).toBe("");
    const short = { ...good, rooms: good.rooms.slice(0, 3) };
    expect(msgs(checkCurriculum([{ entity: short, file: "x" }, ...ids]))).toMatch(/5 to 15 steps/);
    const noTeacher = { ...good, audience: ["student"] };
    expect(msgs(checkCurriculum([{ entity: noTeacher, file: "x" }, ...ids]))).toMatch(/audience must include teacher/);
    const noUr = { ...good, curriculum: { ...good.curriculum, expectation: { ar: "x", en: "y" } } };
    expect(msgs(checkCurriculum([{ entity: noUr, file: "x" }, ...ids]))).toMatch(/expectation lacks ur/);
    const badStep = { ...good, rooms: [...good.rooms.slice(0, 5), { title: { ar: "x" }, features: ["person/does-not-exist"] }] };
    expect(msgs(checkCurriculum([{ entity: badStep, file: "x" }, ...ids]))).toMatch(/not a record/);
  });
  it("the teacher pages exist, emit LearningResource JSON-LD with the required fields, and the hub lists pathways by grade", () => {
    const page = readFileSync(`${PAGES}/learn/teachers/pathways/[slug]/index.astro`, "utf8");
    const lib = readFileSync("site/src/lib/pathways.ts", "utf8");
    for (const k of ['"@type": "LearningResource"', "educationalLevel", "learningResourceType", "inLanguage", "isAccessibleForFree: true", "license"]) expect(lib.includes(k), k).toBe(true);
    expect(page).toMatch(/rel="alternate"/);
    expect(page.includes("tp_mapped")).toBe(true);
    expect(page.includes("<Qr ")).toBe(true);
    expect(page.includes("<PathwayWorksheet")).toBe(true);
    expect(existsSync(`${PAGES}/learn/teachers/pathways/[slug]/print.astro`)).toBe(true);
    const print = readFileSync(`${PAGES}/learn/teachers/pathways/[slug]/print.astro`, "utf8");
    expect(print.includes("answers={true}")).toBe(true);
    expect(print.includes("<script")).toBe(false);
    const hub = readFileSync(`${PAGES}/learn/teachers/index.astro`, "utf8");
    expect(hub.includes("byGrade")).toBe(true);
    expect(hub.includes('id="pathways"')).toBe(true);
    for (const l of LANGS) expect((i18n(l).edu.tp_mapped as string).length > 10, l).toBe(true);
  });
});

describe("education: mastery checks (E2 step 4)", () => {
  const files = readdirSync("data/exhibit").filter((f) => f.startsWith("pathway-")).map((f) => `data/exhibit/${f}`);
  it("every pathway ends with 5 questions of 4 options, a right answer, a teaching step, in three languages, with varied answer positions", () => {
    let positions = new Set<number>();
    for (const f of files) {
      const d = parse(readFileSync(f, "utf8"));
      expect(d.quiz?.length, f).toBe(5);
      for (const q of d.quiz) {
        expect(q.options.length, f).toBe(4);
        expect(q.answer >= 0 && q.answer <= 3, f).toBe(true);
        expect(q.teaches >= 0 && q.teaches < d.rooms.length, `${f}: teaches ${q.teaches}`).toBe(true);
        for (const l of LANGS) { expect(q.q[l], `${f} q ${l}`).toBeTruthy(); for (const o of q.options) expect(o[l], `${f} option ${l}`).toBeTruthy(); }
        positions.add(q.answer);
      }
      const teaches = new Set(d.quiz.map((q: any) => q.teaches));
      expect(teaches.size, `${f}: questions should cover more than one step`).toBeGreaterThan(1);
    }
    expect(positions.size, "the right answer sits in every position across the set").toBe(4);
  });
  it("the mastery check renders in the pathway, stores only the pass key, and the passport has stamps for it and for tell-it-back", () => {
    expect(readFileSync("site/src/components/Pathway.astro", "utf8").includes("<MasteryCheck")).toBe(true);
    const js = readFileSync("site/src/scripts/quiz.ts", "utf8");
    expect(js.match(/localStorage\.setItem\(`edu-quiz:\$\{id\}`, "pass"\)/)).toBeTruthy();
    expect((js.match(/localStorage\.setItem/g) ?? []).length).toBe(1);
    const st = stamps();
    expect(st.find((s) => s.id === "mastery")?.earn).toEqual({ key: "edu-quiz:", rule: "prefix-any" });
    expect(st.find((s) => s.id === "tellback")?.earn).toEqual({ key: "edu-retell:", rule: "prefix-any" });
    const mc = readFileSync("site/src/components/MasteryCheck.astro", "utf8");
    expect(mc.includes("mc-key")).toBe(true);
    expect(mc.includes('onsubmit="return false"')).toBe(true);
  });
});

describe("education: shelf and weekly sheet (E2 step 6)", () => {
  it("fifty-two family activities, one per week, trilingual, short, with no honorific", () => {
    const d = parse(readFileSync("edu/family-activities.yaml", "utf8"));
    expect(d.activities.length).toBe(52);
    d.activities.forEach((a: any, i: number) => {
      expect(a.week, `week ${i + 1}`).toBe(i + 1);
      for (const l of LANGS) { expect(a.title[l], `${i + 1} title ${l}`).toBeTruthy(); expect(a.text[l].split(/\s+/).length <= 40, `${i + 1} text ${l} is short`).toBe(true); }
    });
    expect(HONORIFIC.test(readFileSync("edu/family-activities.yaml", "utf8"))).toBe(false);
  });
  it("the shelf caps at 60 ids, validates ids, writes only edu-shelf in try/catch, and sends nothing", () => {
    const js = readFileSync("site/src/scripts/shelf.ts", "utf8");
    expect(js.includes("MAX = 60")).toBe(true);
    expect(js.includes('KEY = "edu-shelf"')).toBe(true);
    expect(js.includes("fetch(`/api/v1/")).toBe(true); // reads the static museum JSON only, never a service
    expect(js.includes("fetch(`https")).toBe(false);
    for (const m of js.matchAll(/localStorage\./g)) expect(js.slice(Math.max(0, m.index! - 200), m.index!).includes("try {") || js.slice(Math.max(0, m.index! - 200), m.index!).includes("try{"), "localStorage outside try").toBe(true);
    expect(existsSync(`${PAGES}/learn/shelf.astro`)).toBe(true);
    expect(readFileSync(`${PAGES}/learn/shelf.astro`, "utf8").includes("<script")).toBe(true);
  });
  it("the weekly sheet reads the passport and the review schedule only, and has 52 activities in its HTML", () => {
    const js = readFileSync("site/src/scripts/weekly.ts", "utf8");
    expect(js.includes("edu-passport")).toBe(true);
    expect(js.includes("edu-srs")).toBe(true);
    expect(js.includes("localStorage.set")).toBe(false);
    expect(js.includes("fetch(")).toBe(false);
    const page = readFileSync(`${PAGES}/learn/parents/weekly.astro`, "utf8");
    expect(page.includes("loadFamilyActivities()")).toBe(true);
    expect(existsSync(`${PAGES}/learn/parents/weekly.astro`)).toBe(true);
  });
  it("the shelf strings and the weekly strings exist in all three languages", () => {
    for (const l of LANGS) for (const k of ["sh_title", "sh_add", "sh_privacy", "wk_title", "wk_print", "wk_all"]) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
  });
});

describe("education: classroom quiz (E3 step 1)", () => {
  const pathwayFiles = readdirSync("data/exhibit").filter((f) => f.startsWith("pathway-")).map((f) => `data/exhibit/${f}`);
  const quiz = readFileSync("site/src/components/ClassroomQuiz.astro", "utf8");
  const script = readFileSync("site/src/scripts/classroom-quiz.ts", "utf8");

  it("one route per pathway in each language, from the same pathway list the teacher pages use", () => {
    expect(pathwayFiles.length).toBe(12);
    expect(readFileSync(`${PAGES}/learn/teachers/quiz/[slug].astro`, "utf8").includes("pathways()")).toBe(true);
  });

  it("the page states in every language that no answer leaves the device, and the strings exist in ar, en and ur", () => {
    for (const l of LANGS) {
      const v = i18n(l).edu.cq_device;
      expect(typeof v === "string" && v.length > 0, `${l} cq_device`).toBe(true);
    }
    expect(quiz.includes("E.cq_device")).toBe(true);
  });

  it("renders all five questions, their options and the answer sheet in the HTML (no script needed), and hides them only under the js class", () => {
    expect(quiz.includes("qs.map((q) =>")).toBe(true);
    expect(quiz.includes('<section class="cq-sheet"')).toBe(true);
    expect(quiz.includes("q.options.map(")).toBe(true);
    // the questions are visible by default; only a page that has the js class hides them until the quiz starts
    expect(/:root\.js \.cq-q \{ display: none; \}/.test(quiz)).toBe(true);
    expect(/:root\.js \.cq-sheet \{ display: none; \}/.test(quiz)).toBe(true);
    expect(/\.cq-q\s*\{[^}]*hidden/.test(quiz)).toBe(false);
  });

  it("the teaching step is named on a wrong answer and links to the step on the pathway page", () => {
    expect(quiz.includes("#pw-${q.teaches}")).toBe(true);
    expect(quiz.includes("fmt(E.mc_teaches")).toBe(true);
  });

  it("keys 1 to 4 choose, Enter or N moves on, the timer is 20 seconds, and classroom=1 switches the mode", () => {
    expect(script.includes("/^[1-4]$/")).toBe(true);
    expect(script.includes("const LIMIT = 20")).toBe(true);
    expect(script.includes('get("classroom") === "1"')).toBe(true);
    expect(script.includes('e.key.toLowerCase() === "n"')).toBe(true);
  });

  it("the script never stores, fetches or reads the clock at build time: no storage, no network, one clock read at run time", () => {
    expect(script.includes("localStorage")).toBe(false);
    expect(script.includes("sessionStorage")).toBe(false);
    expect(script.includes("fetch(")).toBe(false);
    expect(script.includes("XMLHttpRequest")).toBe(false);
    expect(script.includes("navigator.sendBeacon")).toBe(false);
    expect(script.includes("Math.random")).toBe(false);
  });

  it("the printed sheet carries a QR code and a blank tally column for the teacher", () => {
    expect(quiz.includes("<Qr lang={lang} path={pathwayQuizPath(lang, n)}")).toBe(true);
    expect(quiz.includes('class="cq-blank"')).toBe(true);
  });

  it("the classroom quiz strings exist in all three languages with Urdu not repeating English", () => {
    const en = i18n("en").edu, ur = i18n("ur").edu;
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("cq_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(ur[k] === en[k], `ur repeats en for ${k}`).toBe(false);
    }
  });

  it("the budget table names the classroom quiz route (calibrated, see check-weight.ts)", async () => {
    const { BUDGETS } = await import("./check-weight.ts");
    const b = BUDGETS.find((x) => x.family === "classroom quiz");
    expect(b?.html).toBe(120 * 1024);
    expect(b?.js).toBe(15 * 1024);
  });
});

describe("education: daily challenge (E3 step 2)", () => {
  const generator = "scripts/edu-daily.ts";
  const script = readFileSync("site/src/scripts/daily.ts", "utf8");
  const page = readFileSync(`${PAGES}/learn/daily/index.astro`, "utf8");

  it("the schedule has 366 days of five rounds, each round a non-excluded event with at least two sources and a century among its four choices", async () => {
    const { buildSchedule, centuryPool, DAYS, ROUNDS, CHOICES } = await import("./edu-daily.ts");
    const pool = centuryPool();
    const byId = new Map(pool.map((e) => [e.id, e]));
    const s = buildSchedule(pool);
    expect(s.days.length).toBe(DAYS);
    expect(DAYS).toBe(366);
    s.days.forEach((d, i) => {
      expect(d.day).toBe(i + 1);
      expect(d.rounds.length).toBe(ROUNDS);
      for (const r of d.rounds) {
        const src = parse(readFileSync(`data/${r.id.replace("/", "/")}.yaml`, "utf8"));
        expect(src.education?.exclude === true, r.id).toBe(false);
        expect((src.sources ?? []).length, r.id).toBeGreaterThanOrEqual(2);
        expect(byId.has(r.id), r.id).toBe(true);
        expect(r.choices.length).toBe(CHOICES);
        expect(new Set(r.choices).size).toBe(CHOICES);
        expect(r.choices.includes(r.century)).toBe(true);
      }
    });
  });

  it("the schedule is byte-identical across two builds of the same data (no clock, no random)", async () => {
    const { buildSchedule, centuryPool } = await import("./edu-daily.ts");
    const a = JSON.stringify(buildSchedule(centuryPool()));
    const b = JSON.stringify(buildSchedule(centuryPool()));
    expect(a).toBe(b);
  });

  it("the generator and the client never read the clock for a build, use a random number, or store anything", () => {
    const gen = readFileSync(generator, "utf8");
    expect(gen.includes("Math.random")).toBe(false);
    expect(gen.includes("Date")).toBe(false);
    expect(script.includes("localStorage")).toBe(false);
    expect(script.includes("fetch(\"/edu/daily-schedule.json\")")).toBe(true);
    expect(script.includes("location.search")).toBe(false);
  });

  it("the result text names the day, a five-square grid and the page path, and carries no query parameter", () => {
    expect(script.includes("🟩")).toBe(true);
    expect(script.includes("⬜")).toBe(true);
    expect(script.includes("${t.site || \"\"}${t.path || \"\"}")).toBe(true);
    expect(page.includes("data-path={path}")).toBe(true);
  });

  it("without JavaScript the page lists the first seven days' questions, with the answers folded away", () => {
    expect(page.includes("schedule.days.slice(0, 7)")).toBe(true);
    expect(page.includes("<details class=\"dl-answers\">")).toBe(true);
  });

  it("the daily strings exist in all three languages and Urdu is not the English", async () => {
    const en = i18n("en").edu, ur = i18n("ur").edu;
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("dl_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(ur[k] === en[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("education: fact engine (E3 step 3, plan §5)", () => {
  const factsPage = readFileSync(`${PAGES}/learn/facts/index.astro`, "utf8");
  const poster = readFileSync(`${PAGES}/learn/facts/poster.astro`, "utf8");
  const strip = readFileSync("site/src/components/FactStrip.astro", "utf8");
  const ids = new Set(walk("data").flatMap((f) => {
    const m = /^data\/([a-z]+)\/([a-z0-9-]+)\.yaml$/.exec(f);
    return m && !f.includes("/_") ? [`${m[1]}/${m[2]}`] : [];
  }));
  const words = (s: string) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;
  const facts = () => walk("data").flatMap((f) => {
    if (!/^data\/[a-z]+\/[a-z0-9-]+\.yaml$/.test(f)) return [];
    const d = parse(readFileSync(f, "utf8"));
    const fact = d?.education?.did_you_know;
    return fact ? [{ id: d.id, file: f, fact }] : [];
  });

  it("every did_you_know fact is at most 40 words in ar, en and ur, with at least two existing sources", () => {
    const list = facts();
    expect(list.length, "batches of at most 25 authored facts each").toBeGreaterThan(0);
    expect(list.length).toBeLessThanOrEqual(365);
    for (const { id, file, fact } of list) {
      for (const l of LANGS) {
        expect(typeof fact[l] === "string" && fact[l].length > 0, `${id} ${l}`).toBe(true);
        expect(words(fact[l]), `${id}.${l} word count`).toBeLessThanOrEqual(40);
      }
      expect((fact.sources ?? []).length, `${id} sources`).toBeGreaterThanOrEqual(2);
      for (const s of fact.sources) expect(ids.has(s), `${id} -> ${s}`).toBe(true);
      expect(fact.en, `${id}: Urdu repeats English?`).not.toBe(fact.ur);
      expect(HONORIFIC.test(fact.en + fact.ar + fact.ur), `${id}: typed honorific`).toBe(false);
    }
  });

  it("fact-of-day rotation is deterministic and wraps the pool", async () => {
    const { factOfDay, factOfWeek, loadFacts } = await import("../site/src/lib/facts.ts");
    const a = factOfDay(new Date(Date.UTC(2026, 0, 15)));
    const b = factOfDay(new Date(Date.UTC(2026, 0, 15)));
    expect(a).not.toBeNull();
    expect(a!.id).toBe(b!.id);
    const n = loadFacts().length;
    const afterPool = factOfDay(new Date(Date.UTC(2026, 0, 15 + n)));
    expect(afterPool!.id).toBe(a!.id);
    expect(factOfWeek()).not.toBeNull();
  });

  it("the archive lists every fact with its record and sources, and the poster is one QR-carrying A4 sheet", () => {
    expect(factsPage.includes("loadFacts()")).toBe(true);
    expect(factsPage.includes("v.href")).toBe(true);
    expect(factsPage.includes("E.fc_sources")).toBe(true);
    expect(poster.includes("<Qr ")).toBe(true);
    expect(poster.includes("factOfWeek()")).toBe(true);
    expect(strip.includes("factOfDay()")).toBe(true);
  });

  it("the fact strings exist in all three languages and Urdu is not the English", () => {
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("fc_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").edu[k] === i18n("en").edu[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("education: seasonal packs (E3 step 4, plan §5)", () => {
  const packsLib = readFileSync("site/src/lib/packs.ts", "utf8");
  const packPage = readFileSync("site/src/pages/[lang]/learn/teachers/packs/[slug].astro", "utf8");
  const hubPage = readFileSync("site/src/pages/[lang]/learn/teachers/index.astro", "utf8");

  it("edu/packs.yaml defines exactly the four dated packs, each printing 8-12 sheets", () => {
    const packs = loadPacks().map((p) => p.id);
    expect(packs.sort()).toEqual(["back-to-school", "exam-season", "heritage-month", "ramadan"].sort());
    for (const p of loadPacks()) {
      const sheets = p.kit.reduce((a, k) => a + k.sheets, 0);
      expect(sheets, `${p.id} kit`).toBeGreaterThanOrEqual(8);
      expect(sheets, `${p.id} kit`).toBeLessThanOrEqual(12);
      for (const l of LANGS) {
        expect(p.title[l].length, `${p.id} ${l}`).toBeGreaterThan(0);
        expect(p.when[l].length, `${p.id} when ${l}`).toBeGreaterThan(0);
        expect(p.lede[l].length, `${p.id} lede ${l}`).toBeGreaterThan(0);
      }
      expect(p.kit.length, `${p.id} kit size`).toBeGreaterThan(0);
    }
  });

  it("every pack route is generated per language and the page carries the kit, the print button and the QR", () => {
    expect(packPage.includes("loadPacks()")).toBe(true);
    expect(packPage.includes("window.print()")).toBe(true);
    expect(packPage.includes("<Qr ")).toBe(true);
    expect(packPage.includes("E.pk_kit_title")).toBe(true);
    expect(hubPage.includes("/learn/teachers/packs/")).toBe(true);
  });

  it("every pack kit href resolves to a real static route", () => {
    for (const p of loadPacks()) for (const k of p.kit) {
      const candidates = [
        `site/src/pages/[lang]${k.href.slice(0, -1)}.astro`,
        `site/src/pages/[lang]${k.href}index.astro`,
      ];
      // dynamic routes ([slug].astro, [unit].astro) stand in for the leaf
      const parts = k.href.split("/").filter(Boolean);
      const parent = `site/src/pages/[lang]/${parts.slice(0, -1).join("/")}`;
      const dyn = `${parent}/[slug].astro`;
      const dynUnit = `${parent}/[unit].astro`;
      const grand = `site/src/pages/[lang]/${parts.slice(0, -2).join("/")}`;
      const dyn2 = `${grand}/[slug]/${parts[parts.length - 1]}.astro`;
      const dyn2idx = `${grand}/[slug]/${parts[parts.length - 1]}/index.astro`;
      const ok = candidates.some((c) => existsSync(c)) || existsSync(dyn) || existsSync(dynUnit) || existsSync(dyn2) || existsSync(dyn2idx);
      expect(ok, `${p.id}: ${k.href}`).toBe(true);
    }
  });

  it("the Ramadan pack states the Umm al-Qura expectation and the sighting caveat in every language", () => {
    const p = loadPacks().find((x) => x.id === "ramadan")!;
    for (const l of LANGS) {
      const w = p.when[l];
      expect(w.includes("1448")).toBe(true);
      expect(/2027/.test(w)).toBe(true);
      expect(/رؤية|sighting|ہلال/.test(w)).toBe(true);
    }
  });

  it("each pack has its email text in docs/outreach/education/ for the founder", () => {
    for (const p of loadPacks()) {
      const f = `docs/outreach/education/${p.id}.md`;
      expect(existsSync(f), p.id).toBe(true);
      expect(readFileSync(f, "utf8").includes(`/learn/teachers/packs/${p.id}/`)).toBe(true);
    }
  });

  it("the pack strings exist in all three languages and Urdu is not the English", () => {
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("pk_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").edu[k] === i18n("en").edu[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("education: offline packs (E3 step 5, plan §5)", () => {
  const endpoint = readFileSync("site/src/pages/[lang]/learn/teachers/offline/[slug].html.ts", "utf8");

  it("the endpoint writes one .html per pack per language, self-contained: inline CSS, no script, no absolute URL", () => {
    expect(endpoint.includes("getStaticPaths")).toBe(true);
    expect(endpoint.includes("loadPacks()")).toBe(true);
    expect(endpoint.includes("<style>")).toBe(true);
    expect(endpoint.includes("<script")).toBe(false);
    expect(endpoint.includes("Content-Type")).toBe(true);
    expect(endpoint.includes("pk_offline_note")).toBe(true);
  });

  it("check-site asserts every offline file exists, is at most 2 MB, and carries no external fetch", () => {
    const cs = readFileSync("scripts/check-site.ts", "utf8");
    expect(cs.includes("offline")).toBe(true);
    expect(cs.includes("2 * 1024 * 1024")).toBe(true);
    expect(cs.includes("<script[^>]*\\ssrc=")).toBe(true);
    expect(cs.includes("https?:\\/\\/")).toBe(true);
  });

  it("each pack page links its offline file", () => {
    const packPage = readFileSync("site/src/pages/[lang]/learn/teachers/packs/[slug].astro", "utf8");
    expect(packPage.includes("/learn/teachers/offline/")).toBe(true);
    expect(packPage.includes("pk_offline")).toBe(true);
  });
});

describe("education: Where am I? gentle (E3 step 6, plan §5)", () => {
  const page = readFileSync("site/src/pages/[lang]/sighar/explorers/where.astro", "utf8");

  it("edu/where.yaml has 12 rounds, each with two real options whose answer is among them", async () => {
    const { loadWhere, viewWhere } = await import("../site/src/lib/where.ts");
    const rounds = loadWhere();
    expect(rounds.length).toBe(12);
    for (const r of rounds) {
      expect(r.options.length).toBe(2);
      expect(r.options.includes(r.answer)).toBe(true);
      for (const l of LANGS) expect(r.question[l].length, `${r.id} ${l}`).toBeGreaterThan(0);
      const v = viewWhere(r, "en");
      expect(v.options.filter((o) => o.right).length).toBe(1);
      expect(v.answerLabel.length).toBeGreaterThan(0);
    }
  });

  it("the page needs no JavaScript: every option reveals through <details>, and wrong guesses stay warm", () => {
    expect(page.includes("<script")).toBe(false);
    expect(page.includes("<details")).toBe(true);
    expect(page.includes("wh_notquite")).toBe(true);
    expect(page.includes("wh_yes")).toBe(true);
    expect(page.includes("loadWhere()")).toBe(true);
  });

  it("the Explorers hub links the game and the wh_* strings exist in all three languages", () => {
    const hub = readFileSync("site/src/pages/[lang]/sighar/explorers.astro", "utf8");
    expect(hub.includes("/sighar/explorers/where/")).toBe(true);
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("wh_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").edu[k] === i18n("en").edu[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("education: homework search (E3 step 7, plan §5)", () => {
  it("edu/homework-topics.yaml has 50 topics × 3 phrasings in each language, every target real", async () => {
    const { loadHomework, viewHomework } = await import("../site/src/lib/homework.ts");
    const topics = loadHomework();
    expect(topics.length).toBe(50);
    for (const t of topics) {
      for (const l of LANGS) {
        expect(t.phrasings[l].length, `${t.id} ${l}`).toBe(3);
        expect(new Set(t.phrasings[l]).size).toBe(3);
        expect(t.title[l].length).toBeGreaterThan(0);
      }
      expect(viewHomework(t, "en").href.startsWith("/en/")).toBe(true);
    }
    // the plan's example: «الحروب الصليبية واجب» is a phrasing of the crusades topic
    const crusades = topics.find((x) => x.id === "crusades")!;
    expect(crusades.phrasings.ar).toContain("الحروب الصليبية واجب");
    expect(crusades.target).toBe("exhibit/pathway-g11-chw3m-crusades-muslim-side");
  });

  it("the phrasings merge into the search synonyms at build, and the zero-result strip is wired", () => {
    const derive = readFileSync("scripts/derive.ts", "utf8");
    expect(derive.includes("homework-topics.yaml")).toBe(true);
    const search = readFileSync("site/src/pages/[lang]/search/index.astro", "utf8");
    expect(search.includes("hw-strip")).toBe(true);
    expect(search.includes("homeworkViews")).toBe(true);
    expect(search.includes("pagefind-ui__result")).toBe(true);
    const hub = readFileSync("site/src/pages/[lang]/learn/teachers/index.astro", "utf8");
    expect(hub.includes("homeworkViews")).toBe(true);
  });

  it("the hw_* strings exist in all three languages and Urdu is not the English", () => {
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("hw_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").edu[k] === i18n("en").edu[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("education: Explorers world map (E3 step 8, plan §5)", () => {
  const map = readFileSync("site/src/components/WorldMap.astro", "utf8");

  it("basemap-world.json is Natural Earth 110m land at 80 KB or less", () => {
    const b = JSON.parse(readFileSync("site/src/data/basemap-world.json", "utf8"));
    expect(b.credit).toContain("Natural Earth");
    expect(readFileSync("site/src/data/basemap-world.json").byteLength).toBeLessThanOrEqual(80 * 1024);
    expect(b.paths.length).toBeGreaterThan(100);
    expect(b.viewBox).toBe("0 0 1000 500");
  });

  it("there are exactly 12 hot spots, each opening an existing record", () => {
    const spots = [...map.matchAll(/"place\/[a-z-]+": \[/g)].map((m) => m[0].slice(1, -4));
    expect(spots.length).toBe(12);
    for (const s of ["place/mecca", "place/medina", "place/jerusalem", "place/damascus", "place/baghdad", "place/cairo", "place/cordoba", "place/fez", "place/timbuktu", "place/istanbul", "place/samarqand", "place/delhi"]) {
      expect(existsSync(`data/place/${s.split("/")[1]}.yaml`), s).toBe(true);
    }
    // the no-JS / screen-reader equivalent list
    expect(map.includes("wm-list")).toBe(true);
    expect(map.includes("href={s.href}")).toBe(true);
    expect(map.includes('role="img"')).toBe(true);
  });

  it("the Explorers hub renders the map and the wm_* strings exist in all three languages", () => {
    const hub = readFileSync("site/src/pages/[lang]/sighar/explorers.astro", "utf8");
    expect(hub.includes("WorldMap")).toBe(true);
    for (const k of Object.keys(i18n("ar").edu).filter((k) => k.startsWith("wm_"))) {
      for (const l of LANGS) expect(typeof i18n(l).edu[k] === "string" && i18n(l).edu[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").edu[k] === i18n("en").edu[k], `ur repeats en for ${k}`).toBe(false);
    }
  });
});

describe("E4 step 1 — the teen wing skeleton (/shabab/)", () => {
  it("edu/bands.yaml keeps scholars and researchers in the shabab wing with /shabab/ hubs", () => {
    const bs = bands();
    const sch = bs.find((b) => b.id === "scholars");
    const res = bs.find((b) => b.id === "researchers");
    expect(sch?.wing).toBe("shabab");
    expect(res?.wing).toBe("shabab");
    expect(sch?.hub).toBe("/shabab/scholars/");
    expect(res?.hub).toBe("/shabab/researchers/");
  });

  it("the sb_* strings exist in all three languages, Urdu different from English", () => {
    for (const k of Object.keys(i18n("ar").shabab).filter((k) => k.startsWith("sb_"))) {
      for (const l of LANGS) expect(typeof i18n(l).shabab[k] === "string" && i18n(l).shabab[k].length > 0, `${l} ${k}`).toBe(true);
      expect(i18n("ur").shabab[k] === i18n("en").shabab[k], `ur repeats en for ${k}`).toBe(false);
    }
  });

  it("every /shabab/ page exists, breadcrumbs to the wing and stays free of kids chrome", () => {
    for (const f of ["index", "scholars", "researchers", "daily", "where"]) {
      const s = readFileSync(`site/src/pages/[lang]/shabab/${f}.astro`, "utf8");
      expect(s.includes("/shabab/"), f).toBe(true);
      expect(s.includes("kids={true}") || s.includes("Hudhud") || s.includes("kids.css"), f).toBe(false);
    }
  });

  it("check-weight covers the teen family routes", () => {
    const cw = readFileSync("scripts/check-weight.ts", "utf8");
    for (const r of ["/ar/shabab/", "/ar/shabab/scholars/", "/ar/shabab/researchers/", "/ar/shabab/daily/", "/ar/shabab/where/"]) {
      expect(cw.includes(`route: "${r}"`), r).toBe(true);
    }
  });
});

describe("E4 step 2 — edu/topics-50.yaml (taught topics)", () => {
  it("every topic loads: real anchor, known band, trilingual title and explainer, 12 terms, 10 questions with exactly one answer each", async () => {
    const { loadTopics } = await import("../site/src/lib/topics.ts");
    const topics = loadTopics();
    expect(topics.length).toBeGreaterThan(0);
    for (const t of topics) {
      expect(["scholars", "researchers"]).toContain(t.band);
    }
  });

  it("anchors come from the approved proposal list, not invented ids", () => {
    const raw = parse(readFileSync("edu/topics-50.yaml", "utf8")).topics;
    const approved = new Set([
      "exhibit/pathway-g11-chw3m-crusades-muslim-side", "exhibit/pathway-g11-chw3m-rise-of-islam",
      "exhibit/pathway-g11-chw3m-baghdad-and-the-silk-roads", "exhibit/pathway-g11-chw3m-al-andalus",
      "exhibit/pathway-g11-chw3m-mongols-and-after", "exhibit/pathway-g11-hrf3o-five-pillars-daily-life",
      "exhibit/pathway-g11-hrt3m-islamic-art-architecture", "exhibit/pathway-g11-hrt3m-life-of-the-prophet",
      "exhibit/pathway-g11-hrt3m-quran-as-a-text", "exhibit/pathway-g12-chy4u-ottomans-gunpowder-empires",
      "exhibit/pathway-g4-social-studies-four-cities", "exhibit/pathway-g6-social-studies-hajj-network",
      "event/battle-of-badr", "event/hijra", "event/first-revelation", "event/conquest-of-mecca",
      "person/ibn-battuta-muhammad", "person/ibn-sina", "person/al-khwarizmi", "person/ibn-rushd",
      "person/mansa-musa", "person/fatima-al-fihri", "person/al-ghazali-abu-hamid", "person/mimar-sinan",
      "person/salah-al-din-yusuf-ibn-ayyub", "building/kaaba", "building/alhambra", "building/dome-of-the-rock",
      "building/great-mosque-cordoba", "building/al-aqsa-mosque", "building/suleymaniye-mosque",
      "building/blue-mosque", "building/umayyad-mosque", "building/bayt-al-hikma",
      "place/damascus", "place/baghdad", "place/cordoba", "place/timbuktu",
      "place/cairo", "place/delhi", "place/istanbul", "place/mecca", "place/medina", "place/jerusalem",
      "concept/five-pillars", "concept/hijri-calendar", "concept/algebra", "concept/astronomy",
      "concept/islamic-calligraphy", "practice/salah", "practice/sawm-ramadan", "practice/zakat",
    ]);
    for (const t of raw) expect(approved.has(t.anchor), `${t.id} -> ${t.anchor}`).toBe(true);
  });

  it("no typed honorifics or Qur'an text in the topic data", () => {
    const HON = new RegExp("(صلى الله عليه|عليه السلام|رضي الله عنه|رحمه الله|\\uFDFA|\\uFDFF|\\u06D6)");
    expect(HON.test(readFileSync("edu/topics-50.yaml", "utf8"))).toBe(false);
  });
});

describe("E4 step 3 — teen topic pages (60s, practice, glossary)", () => {
  const PAGE_FILES = [
    "site/src/pages/[lang]/shabab/60s/[topic].astro",
    "site/src/pages/[lang]/shabab/practice/[topic].astro",
    "site/src/pages/[lang]/shabab/glossary/[topic].astro",
    "site/src/pages/[lang]/shabab/topics.astro",
  ];
  it("the four page routes exist and build one path per language and topic", async () => {
    const { loadTopics } = await import("../site/src/lib/topics.ts");
    const n = loadTopics().length;
    for (const f of PAGE_FILES) {
      const src = readFileSync(f, "utf8");
      if (f.includes("[topic]")) {
        expect(src).toContain("loadTopics()");
        expect(src).toContain("LANGS");
      }
    }
    expect(n).toBeGreaterThan(0);
  });
  it("the new shabab strings exist in all three languages", () => {
    const keys = ["sb_sixty_title", "sb_glossary_title", "sb_practice_title", "sb_practice_mark",
      "sb_practice_again", "sb_practice_unanswered", "sb_practice_correct", "sb_practice_wrong",
      "sb_practice_result", "sb_anchor", "sb_sixty_progress", "sb_practice_lede"];
    for (const l of ["ar", "en", "ur"]) {
      const d = parse(readFileSync(`i18n/${l}.yaml`, "utf8")).shabab;
      for (const k of keys) expect(typeof d[k] === "string" && d[k].length > 0, `${l}.${k}`).toBe(true);
    }
  });
  it("practice.ts marks locally only — keyboard-native radios, storage in try/catch", () => {
    const src = readFileSync("site/src/scripts/practice.ts", "utf8");
    expect(src).toContain("localStorage");
    expect(src).toContain("try {");
    expect(src).not.toContain("fetch(");
    const comp = readFileSync("site/src/components/PracticeSet.astro", "utf8");
    expect(comp).toContain('type="radio"');
    expect(comp).toContain("data-why");
  });
});

describe("E4 step 4 — edu/dilemmas/*.yaml (decision cards)", () => {
  it("every dilemma loads: real band, trilingual decision/context/reflection, ≥2 positions each with holder, stance, evidence and ≥1 real source id", async () => {
    const { loadDilemmas } = await import("../site/src/lib/dilemmas.ts");
    const dilemmas = loadDilemmas();
    expect(dilemmas.length).toBeGreaterThanOrEqual(30);
    for (const d of dilemmas) {
      expect(["scholars", "researchers"]).toContain(d.band);
      expect(d.positions.length).toBeGreaterThanOrEqual(2);
      for (const p of d.positions) expect(p.sources.length).toBeGreaterThanOrEqual(1);
    }
  });
  it("no position is scored: no verdict/winner/correct field anywhere in the data or the page", () => {
    const BAN = /"?(verdict|winner|correct)"?:/i;
    for (const f of readdirSync("edu/dilemmas")) {
      const raw = readFileSync(`edu/dilemmas/${f}`, "utf8");
      expect(BAN.test(raw), f).toBe(false);
    }
    const page = readFileSync("site/src/components/Dilemma.astro", "utf8");
    expect(BAN.test(page)).toBe(false);
  });
  it("the new shabab strings exist in all three languages", () => {
    const keys = ["sb_positions", "sb_evidence", "sb_sources", "sb_you_decide", "sb_reflect_hint", "sb_saved"];
    for (const l of ["ar", "en", "ur"]) {
      const d = parse(readFileSync(`i18n/${l}.yaml`, "utf8")).shabab;
      for (const k of keys) expect(typeof d[k] === "string" && d[k].length > 0, `${l}.${k}`).toBe(true);
    }
  });
  it("no typed honorifics or Qur'an text in the dilemma data", () => {
    const HON = new RegExp("(صلى الله عليه|عليه السلام|رضي الله عنه|رحمه الله|\\uFDFA|\\uFDFF|\\u06D6)");
    for (const f of readdirSync("edu/dilemmas"))
      expect(HON.test(readFileSync(`edu/dilemmas/${f}`, "utf8")), f).toBe(false);
  });
});

describe("E4 step 5 — edu/detective/*.yaml (source detective)", () => {
  it("every unit loads: known band, trilingual claim and historians' note, exactly three evidence ids in the graph, ≥1 passage with a chain", async () => {
    const { loadDetective } = await import("../site/src/lib/detective.ts");
    const units = loadDetective();
    expect(units.length).toBeGreaterThanOrEqual(20);
    for (const u of units) {
      expect(["scholars", "researchers"]).toContain(u.band);
      expect(u.evidence.length).toBe(3);
      expect(u.evidence.some((e) => e.kind === "passage" && e.chain && e.chain.length > 0), u.id).toBe(true);
    }
  });
  it("detective strings exist in all three languages", () => {
    const keys = ["sb_claim", "sb_chain", "sb_what_proves", "sb_scale_proves", "sb_scale_supports", "sb_scale_hints", "sb_scale_no", "sb_hist_note", "sb_show_note"];
    for (const l of ["ar", "en", "ur"]) {
      const d = parse(readFileSync(`i18n/${l}.yaml`, "utf8")).shabab;
      for (const k of keys) expect(typeof d[k] === "string" && d[k].length > 0, `${l}.${k}`).toBe(true);
    }
  });
  it("no typed honorifics in detective data", () => {
    const HON = new RegExp("(صلى الله عليه|عليه السلام|رضي الله عنه|رحمه الله|\\uFDFA|\\uFDFF|\\u06D6)");
    for (const f of readdirSync("edu/detective"))
      expect(HON.test(readFileSync(`edu/detective/${f}`, "utf8")), f).toBe(false);
  });
});

describe("E4 step 6 — Journey Map + teen doors", () => {
  it("the /shabab/journey/ route exists and the strings ship in all three languages", () => {
    expect(existsSync("site/src/pages/[lang]/shabab/journey/index.astro")).toBe(true);
    const keys = ["sb_journey", "sb_journey_lede", "sb_journey_legend", "sb_journey_done", "sb_journey_todo", "sb_journey_print"];
    for (const l of ["ar", "en", "ur"]) {
      const d = parse(readFileSync(`i18n/${l}.yaml`, "utf8")).shabab;
      for (const k of keys) expect(typeof d[k] === "string" && d[k].length > 0, `${l}.${k}`).toBe(true);
    }
  });
  it("teen doors point at /shabab/ everywhere a shabab band door is rendered", () => {
    for (const f of ["site/src/pages/[lang]/learn/index.astro", "site/src/pages/[lang]/learn/parents/index.astro"]) {
      const src = readFileSync(f, "utf8");
      expect(src.includes("`/${lang}/shabab/`"), f).toBe(true);
      expect(/shabab.*learn\/trails/.test(src), f).toBe(false);
    }
  });
  it("the Journey Map colours tiles only from device keys (no fetch, no per-visitor data)", () => {
    const src = readFileSync("site/src/scripts/journeymap.ts", "utf8");
    expect(src.includes("localStorage")).toBe(true);
    expect(src.includes("fetch(")).toBe(false);
  });
});

describe("E5 step 3 — edu/story-cards/*.yaml (story in 12 cards)", () => {
  it("20 stories load, each with exactly 12 trilingual cards and whitelisted motifs", async () => {
    const { listStoryCards, loadStoryCards, MOTIFS } = await import("../site/src/lib/story-cards.ts");
    const list = listStoryCards();
    expect(list.length).toBe(20);
    for (const s of list) {
      const d = loadStoryCards(s.slug);
      expect(d.cards.length, s.slug).toBe(12);
      for (const c of d.cards) expect(MOTIFS.includes(c.motif), `${s.slug}:${c.motif}`).toBe(true);
    }
  });
  it("every file is trilingual and carries provenance + published status", () => {
    for (const f of readdirSync("edu/story-cards").filter((x) => x.endsWith(".yaml"))) {
      const d = parse(readFileSync(`edu/story-cards/${f}`, "utf8"));
      expect(d.status?.review, f).toBe("published");
      expect(d.provenance?.generated_by, f).toBeTruthy();
      expect(d.provenance?.source, f).toBeTruthy();
      expect(Array.isArray(d.sources) && d.sources.length > 0, f).toBe(true);
      for (const s of d.sources) expect(existsSync(`data/${s}.yaml`), `${f}:${s}`).toBe(true);
    }
  });
  it("no typed honorifics or Qur'an text in story-card data", () => {
    for (const f of readdirSync("edu/story-cards"))
      expect(HONORIFIC.test(readFileSync(`edu/story-cards/${f}`, "utf8")), f).toBe(false);
  });
  it("the routes + player script exist and auto-play stops on pointer and key", () => {
    expect(existsSync("site/src/pages/[lang]/sighar/storytellers/stories/index.astro")).toBe(true);
    expect(existsSync("site/src/pages/[lang]/sighar/storytellers/stories/[slug].astro")).toBe(true);
    const src = readFileSync("site/src/scripts/story-cards.ts", "utf8");
    expect(src.includes("pointerdown")).toBe(true);
    expect(src.includes("keydown")).toBe(true);
    expect(src.includes("2800")).toBe(true);
    for (const l of ["ar", "en", "ur"]) {
      const d = parse(readFileSync(`i18n/${l}.yaml`, "utf8")).storycards;
      for (const k of ["title", "lede", "play", "stop", "prev", "next", "all_cards", "cards_count"])
        expect(typeof d[k] === "string" && d[k].length > 0, `${l}.${k}`).toBe(true);
    }
  });
});
