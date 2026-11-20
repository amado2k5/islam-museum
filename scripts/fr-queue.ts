// Queue for the `french` lane (docs/agents/lanes/french.md): lists records that still lack French.
// Usage:
//   npx tsx scripts/fr-queue.ts prose [--class person] [--limit 500]   # entities with en/ar prose but no content/fr file
//   npx tsx scripts/fr-queue.ts labels [--limit 500]                   # data records without label.fr
//   npx tsx scripts/fr-queue.ts i18n                                   # top-level sections of i18n/en.yaml missing from i18n/fr.yaml
//   npx tsx scripts/fr-queue.ts stats                                  # counts
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { p as repoPath } from "./lib.js";

const SPINE = ["person", "event", "place", "work", "concept", "building", "object"];
const SACRED = new Set(["passage", "practice", "question"]);

const mode = process.argv[2] ?? "stats";
const arg = (k: string) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : undefined; };

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".yaml") || e.name.endsWith(".md")) yield p;
  }
}

function classesOf(root: string): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const cls of readdirSync(root)) {
    const d = `${root}/${cls}`;
    const ids = new Set<string>();
    try {
      for (const f of readdirSync(d)) if (f.endsWith(".md")) ids.add(`${cls}/${f.slice(0, -3)}`);
    } catch { continue; }
    if (ids.size) out.set(cls, ids);
  }
  return out;
}

if (mode === "prose") {
  const en = classesOf(repoPath("content", "en"));
  const ar = classesOf(repoPath("content", "ar"));
  const fr = classesOf(repoPath("content", "fr"));
  const only = arg("class");
  const limit = Number(arg("limit") ?? 500);
  const classes = new Set([...en.keys(), ...[...ar.keys()].filter((c) => SACRED.has(c))]);
  const order = [...SPINE, ...[...classes].filter((c) => !SPINE.includes(c))];
  let n = 0;
  for (const cls of order) {
    if (only && cls !== only) continue;
    const ids = new Set(en.get(cls));
    if (SACRED.has(cls)) for (const id of ar.get(cls) ?? []) ids.add(id);
    for (const id of [...ids].sort()) {
      if (n >= limit) break;
      if ((fr.get(cls) ?? new Set()).has(id)) continue;
      const pivot = SACRED.has(cls) && (ar.get(cls) ?? new Set()).has(id) ? "ar" : "en";
      console.log(`${id}\tpivot:${pivot}`);
      n++;
    }
  }
  console.error(`listed ${n}`);
} else if (mode === "labels") {
  const only = arg("class");
  const limit = Number(arg("limit") ?? 500);
  let n = 0;
  for (const f of walk(repoPath("data"))) {
    if (n >= limit) break;
    const d = parse(readFileSync(f, "utf8"));
    if (only && d?.class !== only) continue;
    if (d?.label && !d.label.fr) { console.log(d.id ?? f); n++; }
  }
  console.error(`listed ${n}`);
} else if (mode === "i18n") {
  const en = parse(readFileSync(repoPath("i18n", "en.yaml"), "utf8"));
  const fr = parse(readFileSync(repoPath("i18n", "fr.yaml"), "utf8")) ?? {};
  for (const k of Object.keys(en)) if (fr[k] === undefined) console.log(k);
} else {
  const en = classesOf(repoPath("content", "en"));
  const fr = classesOf(repoPath("content", "fr"));
  let total = 0, done = 0;
  for (const [cls, ids] of en) for (const id of ids) { total++; if (fr.get(cls)?.has(id)) done++; }
  const enYaml = parse(readFileSync(repoPath("i18n", "en.yaml"), "utf8"));
  const frYaml = existsSync(repoPath("i18n", "fr.yaml")) ? parse(readFileSync(repoPath("i18n", "fr.yaml"), "utf8")) : {};
  const i18nDone = Object.keys(enYaml).filter((k) => frYaml[k] !== undefined).length;
  console.log(`prose: ${done}/${total} fr files · i18n sections: ${i18nDone}/${Object.keys(enYaml).length}`);
}
