// Page-weight budgets for the education routes (docs/delegation/education-master-plan.md §3), checked on dist/
// after the build. Astro inlines every stylesheet into the page (site/astro.config.mjs), so the HTML figure is
// the page as served with its CSS; the JS figure sums the hashed module scripts the page references. Fonts are
// shared and cached and are not counted. A breach fails; the fix is to remove weight, never to raise the number.
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { p } from "./lib.js";

export interface Budget { route: string; html: number; js: number; family: string }
const KB = 1024;
// Routes are checked in Arabic (the heaviest script: Arabic and Urdu pages carry the same markup; Urdu adds nothing).
// First figures (23 October 2026): estimated from the dev server (page minus the dev tooling, raw CSS replaced by its
// minified size) with about 25 % headroom, so that the first production build calibrates them rather than fails on a
// guess. Tighten each number towards the family ceiling of plan §3 as the production table confirms it.
export const BUDGETS: Budget[] = [
  { family: "front door", route: "/ar/learn/", html: 190 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/sprouts/", html: 200 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/explorers/", html: 200 * KB, js: 12 * KB },
  { family: "band hub", route: "/ar/sighar/storytellers/", html: 220 * KB, js: 12 * KB },
  { family: "teacher hub", route: "/ar/learn/teachers/", html: 200 * KB, js: 12 * KB },
  { family: "family hub", route: "/ar/learn/parents/", html: 200 * KB, js: 12 * KB },
  { family: "passport", route: "/ar/learn/passport/", html: 200 * KB, js: 20 * KB },
  { family: "child activity", route: "/ar/sighar/quest/", html: 200 * KB, js: 14 * KB },
  { family: "child activity", route: "/ar/sighar/kindness/", html: 260 * KB, js: 14 * KB },
  { family: "child activity", route: "/ar/sighar/mosque/", html: 240 * KB, js: 14 * KB },
  { family: "deck with study modes", route: "/ar/cards/list/tartib-al-anbiya/", html: 300 * KB, js: 30 * KB },
  { family: "lesson (printable)", route: "/ar/sighar/teachers/lessons/quest/", html: 200 * KB, js: 6 * KB },
  { family: "listing", route: "/ar/learn/trails/", html: 700 * KB, js: 12 * KB },
];

export interface Measure { route: string; html: number; js: number; scripts: string[] }
export function measure(dist: string, route: string): Measure | null {
  const file = `${dist}${route}index.html`;
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]);
  let js = 0;
  for (const s of new Set(scripts)) { const f = `${dist}${s}`; if (existsSync(f)) js += statSync(f).size; }
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
