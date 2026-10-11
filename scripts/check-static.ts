// Guard for the "no AI and no compute at runtime" rule (docs/adr/0002, docs/plan/03 §13).
// Scans the built site (dist/) and fails if any page or script of ours makes a runtime call to a non-static or cross-origin endpoint.
// Allowed: fetch of same-origin static files (.json, .js, .wasm, .txt, .xml, Pagefind chunks). Not allowed: absolute http(s) URLs in fetch/XHR,
// WebSocket, EventSource, sendBeacon, or same-origin paths that are not static files. The vendored Pagefind bundle (dist/pagefind) is exempt: it only reads its own index files.
// Run: npm run check:static  (after npm run build)
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { listFiles, p, rel } from "./lib.js";

export function scan(files: string[]): string[] {
  const problems: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const file = rel(f);
    for (const m of src.matchAll(/\b(WebSocket|EventSource|XMLHttpRequest)\b|navigator\.sendBeacon/g)) problems.push(`${file}: uses ${m[0]}`);
    for (const m of src.matchAll(/\bfetch\(\s*([`"'])([^`"']*)\1/g)) {
      const url = m[2];
      if (/^(https?:)?\/\//.test(url)) problems.push(`${file}: fetch to an external origin: ${url}`);
      else if (!/\.(json|js|wasm|txt|xml|ndjson|csv|webp|svg|png)(\?|$)/.test(url) && !url.includes("pagefind")) problems.push(`${file}: fetch of a non-static path: ${url}`);
    }
    for (const m of src.matchAll(/<script[^>]+src=["'](https?:)?\/\/[^"']+["']/g)) problems.push(`${file}: loads a third-party script: ${m[0].slice(0, 100)}`);
  }
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dist = p("dist");
  if (!existsSync(dist)) { console.error("dist/ not found: run npm run build first"); process.exit(2); }
  const files = [...listFiles(dist, ".html"), ...listFiles(p("dist", "_astro"), ".js")].filter((f) => !f.includes("/pagefind/"));
  const problems = scan(files);
  for (const x of problems) console.log("ERROR " + x);
  console.log(`checked ${files.length} files: ${problems.length} runtime-network problems`);
  process.exit(problems.length ? 1 : 0);
}
