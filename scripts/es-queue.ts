// Queue for the `spanish` lane (docs/agents/lanes/spanish.md): lists records that still lack Spanish.
// Usage:
//   npx tsx scripts/es-queue.ts prose [--class person] [--limit 500]   # entities with en/ar prose but no content/es file
//   npx tsx scripts/es-queue.ts labels [--limit 500]                   # data records without label.es
//   npx tsx scripts/es-queue.ts i18n                                   # top-level sections of i18n/en.yaml missing from i18n/es.yaml
//   npx tsx scripts/es-queue.ts stats                                  # counts
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { join } from "node:path";
import { ROOT } from "./lib.js";

const repoPath = (...parts: string[]) => join(ROOT, ...parts);

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
  if (!existsSync(root)) return out; // content/es/ does not exist until the first Spanish prose lands
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
  const es = classesOf(repoPath("content", "es"));
  const only = arg("class");
  const limit = Number(arg("limit") ?? 500);
  const order = [...SPINE, ...[...en.keys()].filter((c) => !SPINE.includes(c))];
  let n = 0;
  for (const cls of order) {
    if (only && cls !== only) continue;
    for (const id of [...(en.get(cls) ?? new Set<string>())].sort()) {
      if (n >= limit) break;
      if ((es.get(cls) ?? new Set()).has(id)) continue;
      const pivot = SACRED.has(cls) && (ar.get(cls) ?? new Set()).has(id) ? "ar" : "en";
      console.log(`${id}\tpivot:${pivot}`);
      n++;
    }
  }
  console.error(`listed ${n}`);
} else if (mode === "labels") {
  const limit = Number(arg("limit") ?? 500);
  let n = 0;
  for (const f of walk(repoPath("data"))) {
    if (n >= limit) break;
    const d = parse(readFileSync(f, "utf8"));
    if (d?.label && !d.label.es) { console.log(d.id ?? f); n++; }
  }
  console.error(`listed ${n}`);
} else if (mode === "i18n") {
  const en = parse(readFileSync(repoPath("i18n", "en.yaml"), "utf8"));
  const es = parse(readFileSync(repoPath("i18n", "es.yaml"), "utf8")) ?? {};
  for (const k of Object.keys(en)) if (es[k] === undefined) console.log(k);
} else {
  const en = classesOf(repoPath("content", "en"));
  const es = classesOf(repoPath("content", "es"));
  let total = 0, done = 0;
  for (const [cls, ids] of en) for (const id of ids) { total++; if (es.get(cls)?.has(id)) done++; }
  const enYaml = parse(readFileSync(repoPath("i18n", "en.yaml"), "utf8"));
  const esYaml = existsSync(repoPath("i18n", "es.yaml")) ? parse(readFileSync(repoPath("i18n", "es.yaml"), "utf8")) : {};
  const i18nDone = Object.keys(enYaml).filter((k) => esYaml[k] !== undefined).length;
  console.log(`prose: ${done}/${total} es files · i18n sections: ${i18nDone}/${Object.keys(enYaml).length}`);
}
