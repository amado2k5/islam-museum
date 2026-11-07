// Hard block on terrorist-organisation content (AGENTS.md, docs/agents/content-safety.md).
// Fails when a data or content file names a blocked organisation or media wing, unless its record is on the
// founder-approved exceptions list (docs/delegation/extremism-firewall-exceptions.md).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { entityOfPath, findBlocked, parseExceptions } from "./lib/extremism";

const ROOT = process.cwd();
const exceptions = parseExceptions(readFileSync(join(ROOT, "docs/delegation/extremism-firewall-exceptions.md"), "utf8"));

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(yaml|md)$/.test(name)) yield p;
  }
}

let errors = 0;
for (const top of ["data", "content"]) {
  for (const abs of walk(join(ROOT, top))) {
    const rel = abs.slice(ROOT.length + 1);
    const id = entityOfPath(rel);
    if (!id || exceptions.has(id)) continue;
    const hits = findBlocked(readFileSync(abs, "utf8"));
    for (const h of hits) {
      errors++;
      console.log(`ERROR ${rel}: names a blocked organisation (${h.label}: "${h.text}"); see docs/agents/content-safety.md. Remove the mention or ask the founder to list ${id} as an exception.`);
    }
  }
}
console.log(`extremism: ${errors} error(s), ${exceptions.size} exception(s)`);
process.exit(errors ? 1 : 0);
