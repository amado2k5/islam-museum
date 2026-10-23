// Education programme tests (docs/delegation/education-master-plan.md E1, appendix C): the band ladder, the
// stamp rules, trilingual parity of the `edu:` strings, the routes the data names, no typed honorifics, the
// page-weight budget table, and the QR helper.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

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
      "site/src/components/BandHub.astro", "site/src/components/PassportStrip.astro", "site/src/components/StudyModes.astro", "site/src/components/Qr.astro"];
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
    for (const f of ["passport.ts", "study.ts", "share.ts"]) {
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
      expect(routeBuilt(b.route.replace(/^\/ar/, "")) || b.route.includes("/cards/list/") || b.route.includes("/lessons/"), b.route).toBe(true);
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
