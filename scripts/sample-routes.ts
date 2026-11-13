// Sample build of a pull request, step 1 (docs/engineering/46-ci-flow-proposal.md, section 2): the records the pull
// request changed, read from its diff and written to .cache/sample/changed.txt, one id per line. site/src/lib/sample.ts
// builds their pages in the three languages, with the pinned records and an even spread of each class.
//   tsx scripts/sample-routes.ts --base <ref> [--head <ref>]
// In validate.yml the checkout is the merge commit, so `--base HEAD^1 --head HEAD` is what merging would change.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { p } from "./lib.js";

/** data/<class>/<slug>.yaml and content/<lang>/<class>/<slug>.md name the record <class>/<slug>; nothing else does. */
export function entityIdOf(path: string): string | null {
  const m = /^data\/([a-z-]+)\/([^/]+)\.yaml$/.exec(path) ?? /^content\/[a-z-]+\/([a-z-]+)\/([^/]+)\.md$/.exec(path);
  return m && !m[1].startsWith("_") && !m[2].startsWith("_") ? `${m[1]}/${m[2]}` : null;
}

export function changedIds(paths: string[]): string[] {
  return [...new Set(paths.map(entityIdOf).filter((id): id is string => !!id))].sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
  const base = arg("--base"), head = arg("--head") ?? "HEAD";
  if (!base) { console.error("usage: tsx scripts/sample-routes.ts --base <ref> [--head <ref>]"); process.exit(2); }
  // Two dots: the checkout holds both commits but not always their merge base. core.quotePath off keeps non-ASCII names readable.
  const out = execFileSync("git", ["-c", "core.quotePath=false", "diff", "--name-only", "--no-renames", `${base}..${head}`], { cwd: p(), encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const ids = changedIds(out.split("\n"));
  mkdirSync(p(".cache", "sample"), { recursive: true });
  writeFileSync(p(".cache", "sample", "changed.txt"), ids.join("\n") + (ids.length ? "\n" : ""));
  console.log(`sample-routes: ${ids.length} changed record(s) will be built in the three languages`);
}
