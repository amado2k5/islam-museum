// Sample build of a pull request, last step (docs/engineering/46-ci-flow-proposal.md, section 2): an empty placeholder
// page for every route the sample left out (.cache/sample/skipped.txt, written by site/src/lib/sample.ts), so that the
// link check can tell a link to a page that was only not built from a link to a page that does not exist. Run after
// the checks that read real pages (check:site, check:weight, check:static) and before the link check. A dist/ with
// placeholders is never deployed: validate.yml uploads no build artifact.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { p } from "./lib.js";

export const STUB = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not built in a sample build</title></head><body></body></html>\n';

/** Writes the placeholders; returns how many. A route that was built is left as it is. */
export function writeStubs(dist: string, routes: string[]): number {
  let written = 0;
  for (const route of routes) {
    if (!/^\/[^.]*\/$/.test(route) || route.includes("/../")) throw new Error(`sample-stubs: not a page route: ${route}`);
    const dir = join(dist, route);
    const file = join(dir, "index.html");
    if (existsSync(file)) continue;
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, STUB);
    written++;
  }
  return written;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const list = p(".cache", "sample", "skipped.txt");
  if (!existsSync(p("dist"))) { console.error("dist/ not found: run the sample build first"); process.exit(2); }
  if (!existsSync(list)) { console.error(".cache/sample/skipped.txt not found: this was not a sample build (SAMPLE_BUILD unset)"); process.exit(2); }
  const routes = readFileSync(list, "utf8").split("\n").filter(Boolean);
  console.log(`sample-stubs: ${writeStubs(p("dist"), routes)} placeholder page(s) for ${routes.length} route(s) left out of the sample`);
}
