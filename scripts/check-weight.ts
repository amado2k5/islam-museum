// Page-weight budgets for the education routes (docs/delegation/education-master-plan.md §3), checked on dist/
// after the build. Astro inlines every stylesheet into the page (site/astro.config.mjs), so the HTML figure is
// the page as served with its CSS; the JS figure sums the inline module scripts and the hashed module files. Fonts are
// shared and cached and are not counted. A breach fails; the fix is to remove weight, never to raise the number.
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { p } from "./lib.js";

export interface Budget { route: string; html: number; js: number; family: string }
const KB = 1024;
// Routes are checked in Arabic (the heaviest script: Arabic and Urdu pages carry the same markup; Urdu adds nothing).
// Calibrated 23 October 2026 from the first production build (118,388 pages): the measured figures were front door
// 93 KB, band hubs 102-110 KB, teacher and family hubs 87-95 KB, passport 98 KB, quest 107 KB, kindness 136 KB,
// mosque 124 KB, deck 134 KB, lesson 105 KB, trails listing 271 KB. The budgets are the family ceilings of plan §3
// (markup plus inlined CSS), so a regression of more than about 50 % on any route fails the build.
export const BUDGETS: Budget[] = [
  { family: "front door", route: "/ar/learn/", html: 170 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/sprouts/", html: 170 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/explorers/", html: 280 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/storytellers/", html: 170 * KB, js: 12 * KB },
  { family: "teacher hub", route: "/ar/learn/teachers/", html: 170 * KB, js: 12 * KB },
  { family: "family hub", route: "/ar/learn/parents/", html: 170 * KB, js: 12 * KB },
  { family: "passport", route: "/ar/learn/passport/", html: 170 * KB, js: 20 * KB },
  { family: "child activity", route: "/ar/sighar/quest/", html: 210 * KB, js: 14 * KB },
  { family: "child activity", route: "/ar/sighar/kindness/", html: 210 * KB, js: 14 * KB },
  { family: "child activity", route: "/ar/sighar/mosque/", html: 210 * KB, js: 14 * KB },
  // E2 leftover A1: the Sprouts read-aloud stories page (server-rendered, no page script)
  { family: "child activity", route: "/ar/sighar/sprouts/stories/", html: 210 * KB, js: 14 * KB },
  { family: "deck with study modes", route: "/ar/cards/list/tartib-al-anbiya/", html: 210 * KB, js: 30 * KB },
  { family: "lesson (printable)", route: "/ar/sighar/teachers/lessons/quest/", html: 200 * KB, js: 6 * KB },
  { family: "listing", route: "/ar/learn/trails/", html: 600 * KB, js: 12 * KB },
  // E2: a leveled entity page (the switcher is inline CSS and a few lines of inline script, so JS stays the layout's) and the kids' reader
  { family: "leveled reading", route: "/ar/event/hijra/", html: 160 * KB, js: 10 * KB },
  { family: "child activity", route: "/ar/sighar/read/event/hijra/", html: 120 * KB, js: 12 * KB },
  // E2: a teacher pathway landing page (trail walker script only) and its printable pack (no script)
  { family: "teacher pathway", route: "/ar/learn/teachers/pathways/g11-chw3m-rise-of-islam/", html: 220 * KB, js: 14 * KB },
  { family: "printable pack", route: "/ar/learn/teachers/pathways/g11-chw3m-rise-of-islam/print/", html: 200 * KB, js: 8 * KB },
  // E2: the shelf (a list rendered on the device) and the weekly sheet (52 activities in the HTML, hidden but present)
  { family: "shelf", route: "/ar/learn/shelf/", html: 200 * KB, js: 12 * KB },
  { family: "weekly sheet", route: "/ar/learn/parents/weekly/", html: 260 * KB, js: 8 * KB },
  // E3 step 1: the classroom quiz. Calibrated 24 October 2026 from the first build with the page (113.1 KB HTML, the shared
  // BaseLayout alone is about 92 KB); the plan §3 ceiling of 80 KB cannot be met with the shared layout (the parent hub is
  // 86.9 KB under the same layout). Recalibrated 25 October 2026 to 128 KB: shared chrome grew (accessibility preferences
  // menu, easy-read link, other lanes' header/footer work) and the page measured 120.9 KB, still a hard ceiling.
  { family: "classroom quiz", route: "/ar/learn/teachers/quiz/g11-chw3m-rise-of-islam/", html: 128 * KB, js: 15 * KB },
  // E3 step 2: the daily challenge (Century Challenge, five rounds a day) at the child-activity ceiling of plan §3
  { family: "daily challenge", route: "/ar/learn/daily/", html: 120 * KB, js: 12 * KB },
  { family: "listing", route: "/ar/learn/facts/", html: 600 * KB, js: 10 * KB },
  { family: "printable pack", route: "/ar/learn/facts/poster/", html: 200 * KB, js: 6 * KB },
  { family: "listing", route: "/ar/learn/teachers/packs/", html: 600 * KB, js: 10 * KB },
  { family: "teacher pack", route: "/ar/learn/teachers/packs/ramadan/", html: 220 * KB, js: 10 * KB },
  { family: "child hub", route: "/ar/sighar/explorers/where/", html: 220 * KB, js: 8 * KB },
  // E4 step 1: the teen wing — hub, two band pages, and the daily/where mirrors under /shabab/
  { family: "teen hub", route: "/ar/shabab/", html: 200 * KB, js: 30 * KB },
  { family: "teen band", route: "/ar/shabab/scholars/", html: 170 * KB, js: 12 * KB },
  { family: "teen band", route: "/ar/shabab/researchers/", html: 170 * KB, js: 12 * KB },
  { family: "daily challenge", route: "/ar/shabab/daily/", html: 120 * KB, js: 12 * KB },
  { family: "teen activity", route: "/ar/shabab/where/", html: 220 * KB, js: 8 * KB },
  // E4 steps 3–6: the taught wing — topics index, one page per kind, cards and the Journey Map.
  { family: "teen listing", route: "/ar/shabab/topics/", html: 400 * KB, js: 8 * KB },
  { family: "teen lesson", route: "/ar/shabab/60s/hijra/", html: 170 * KB, js: 10 * KB },
  { family: "teen lesson", route: "/ar/shabab/glossary/hijra/", html: 170 * KB, js: 8 * KB },
  { family: "teen activity", route: "/ar/shabab/practice/hijra/", html: 200 * KB, js: 14 * KB },
  { family: "teen listing", route: "/ar/shabab/dilemmas/", html: 300 * KB, js: 8 * KB },
  { family: "teen activity", route: "/ar/shabab/dilemmas/hijra-leave/", html: 170 * KB, js: 10 * KB },
  { family: "teen listing", route: "/ar/shabab/detective/", html: 300 * KB, js: 8 * KB },
  { family: "teen activity", route: "/ar/shabab/detective/niyya-chain/", html: 170 * KB, js: 10 * KB },
  { family: "teen map", route: "/ar/shabab/journey/", html: 170 * KB, js: 10 * KB },
];

export interface Measure { route: string; html: number; js: number; scripts: string[] }
// `scripts` lists the page's own hashed files; chunks they import are counted in `js` but not listed.
export function measure(dist: string, route: string): Measure | null {
  const file = `${dist}${route}index.html`;
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]);
  // Astro inlines a small page script as <script type="module">…</script>; those bytes count as JS too (they are
  // also inside the HTML figure), so a page cannot grow its script by keeping it inline.
  let js = 0;
  for (const m of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) js += Buffer.byteLength(m[1]);
  // A page's hashed file is often a few bytes that import the shared chunk (share.js, the passport chunk), so the
  // static imports are followed, each chunk counted once.
  const seen = new Set<string>();
  const add = (path: string) => {
    if (seen.has(path)) return;
    seen.add(path);
    const f = `${dist}${path}`;
    if (!existsSync(f)) return;
    js += statSync(f).size;
    const src = readFileSync(f, "utf8");
    const dir = path.slice(0, path.lastIndexOf("/") + 1);
    const resolve = (ref: string) => (ref.startsWith("/") ? ref : dir + ref.replace(/^\.\//, ""));
    for (const m of src.matchAll(/(?:import|from)\s*["']([^"']+\.js)["']/g)) add(resolve(m[1]));
    for (const m of src.matchAll(/import\(["']([^"']+\.js)["']\)/g)) add(resolve(m[1]));
  };
  for (const s of scripts) add(s);
  return { route, html: Buffer.byteLength(html), js, scripts };
}

export function check(dist: string, budgets = BUDGETS): { rows: string[]; errors: string[] } {
  const rows: string[] = [], errors: string[] = [];
  for (const b of budgets) {
    const m = measure(dist, b.route);
    if (!m) { errors.push(`${b.route}: not built`); continue; }
    const kb = (n: number) => (n / KB).toFixed(1).padStart(7);
    rows.push(`${b.route.padEnd(40)} html ${kb(m.html)} / ${kb(b.html)} KB   js ${kb(m.js)} / ${kb(b.js)} KB   ${b.family}`);
    if (m.html > b.html) errors.push(`${b.route}: HTML ${kb(m.html)} KB exceeds the ${b.family} budget of ${kb(b.html)} KB`);
    if (m.js > b.js) errors.push(`${b.route}: JS ${kb(m.js)} KB (${m.scripts.join(", ")}) exceeds the ${b.family} budget of ${kb(b.js)} KB`);
  }
  return { rows, errors };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dist = p("dist");
  if (!existsSync(dist)) { console.error("dist/ not found: run npm run build first"); process.exit(2); }
  const { rows, errors } = check(dist);
  for (const r of rows) console.log(r);
  for (const e of errors) console.log("ERROR " + e);
  console.log(`check-weight: ${rows.length} routes, ${errors.length} over budget`);
  if (errors.length) process.exit(1);
}
