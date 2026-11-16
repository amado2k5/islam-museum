// check-yaml — fast integrity gate over every YAML file the repo feeds the build.
// Catches merge-artifact YAML (keys glued to a closing "]" or duplicated top-level
// keys) and hard parse failures, reporting every bad file at once instead of
// crashing mid-`npm run graph` on the first one. Runs as the first step of
// `npm run validate`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const ROOTS = ["data", "tour", "edu", "schema", "docs/library"];
const TOP_KEY = /^[a-zA-Z_][\w-]*\s*:/;

function walk(dir: string, out: string[] = []): string[] {
  let ents;
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.ya?ml$/.test(e.name)) out.push(p);
  }
  return out;
}

const problems: string[] = [];
const seen = new Set<string>();
const dupes = new Set<string>();
let scanned = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    scanned++;
    const text = readFileSync(file, "utf8");
    for (const [i, line] of text.split("\n").entries()) {
      // a closing flow bracket/brace immediately followed by a bare key means a
      // merge dropped the newline: `]label:` or `}sources:`
      if (/[\]}][a-zA-Z_][\w-]*\s*:/.test(line)) {
        problems.push(`${file}:${i + 1}: key glued to closing bracket — ${line.trim().slice(0, 80)}`);
        break;
      }
      // document end marker inside the file (a second `---` mid-document is fine,
      // but a second top-level `id:`/`kind:` key means a merge duplicated a block)
      if (TOP_KEY.test(line)) {
        const key = line.slice(0, line.indexOf(":"));
        if (seen.has(key)) dupes.add(key);
        seen.add(key);
      }
    }
    seen.clear();
    if (dupes.size) {
      problems.push(`${file}: duplicate top-level keys: ${[...dupes].join(", ")}`);
      dupes.clear();
      continue;
    }
    try {
      parse(text);
    } catch (e) {
      problems.push(`${file}: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`check-yaml: ${problems.length} problem(s) across ${scanned} files`);
  process.exit(1);
}
console.log(`check-yaml: ${scanned} YAML files, 0 problems`);
