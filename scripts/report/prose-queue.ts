// Regenerates the prose-fill queues: per-class lists of entities with missing or
// thin (<800 bytes) prose in ar/en/ur, ranked by inbound links, with cited sources.
// Output: docs/delegation/prose-fill-queue.md (index + top of each class) and
// docs/delegation/prose-queue/<class>.md (the full queue per class).
// Read-only over data/ and content/ — same counting rule as
// docs/delegation/empty-records-priority.md (meta-classes excluded).
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { CLASSES, listFiles, p, rel } from "../lib.js";

const META = new Set(["source", "media", "listing", "dataset", "language"]);
const LANGS = ["ar", "en", "ur"] as const;
const THIN = 800;
const TOP_ROWS = 200; // rows shown in the index file per class; the per-class files hold the full queue

const isMeta = (cls: string, slug: string) => META.has(cls) || (cls === "passage" && slug.startsWith("quran-"));

interface Row {
  id: string;
  label: string;
  links: number;
  missing: string[]; // languages with no prose file
  thin: string[]; // languages with a <800-byte prose file
  sources: string[];
}

// --- inbound links: distinct data/prose files mentioning each id (textual scan, like the Oct report)
function inbound(): Map<string, Set<string>> {
  const ref = /\b(person|group|polity|event|period|journey|place|building|object|media|work|passage|concept|language|practice|exhibit|question|source|dataset|listing|screen|job)\/[a-z0-9][a-z0-9.-]*/g;
  const inb = new Map<string, Set<string>>();
  const scan = (dir: string, exts: string[]) => {
    for (const f of listFiles(p(dir), exts[0])) {
      const text = readFileSync(f, "utf8");
      const hits = new Set(text.match(ref) ?? []);
      for (const h of hits) {
        if (!inb.has(h)) inb.set(h, new Set());
        inb.get(h)!.add(rel(f));
      }
    }
  };
  scan("data", [".yaml"]);
  scan("content", [".md"]);
  return inb;
}

function proseState(cls: string, slug: string): { missing: string[]; thin: string[] } {
  const missing: string[] = [];
  const thin: string[] = [];
  for (const lang of LANGS) {
    const f = p("content", lang, cls, `${slug}.md`);
    if (!existsSync(f)) missing.push(lang);
    else if (statSync(f).size < THIN) thin.push(lang);
  }
  return { missing, thin };
}

function citedSources(file: string): string[] {
  const text = readFileSync(file, "utf8");
  return [...new Set(text.match(/source\/[a-z0-9][a-z0-9.-]*/g) ?? [])].sort();
}

function main() {
  const inb = inbound();
  const rows = new Map<string, Row[]>(); // class -> rows
  for (const cls of CLASSES) {
    const dir = p("data", cls);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".yaml")) continue;
      const slug = name.slice(0, -5);
      if (isMeta(cls, slug)) continue;
      const { missing, thin } = proseState(cls, slug);
      if (!missing.length && !thin.length) continue;
      const id = `${cls}/${slug}`;
      const file = p("data", cls, name);
      const label = (readFileSync(file, "utf8").match(/^label:\s*\n?\s*ar:\s*"?([^"\n]+)"?/m)?.[1] ?? "").trim();
      rows.set(cls, [
        ...(rows.get(cls) ?? []),
        { id, label, links: inb.get(id)?.size ?? 0, missing, thin, sources: citedSources(file) },
      ]);
    }
  }

  const outDir = p("docs", "delegation", "prose-queue");
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const index: string[] = [
    "# Prose-fill queues",
    "",
    `_Computed ${stamp} by \`npx tsx scripts/report/prose-queue.ts\`. "Missing" = no \`content/<lang>/<class>/<slug>.md\`; "thin" = under ${THIN} bytes. Meta-classes excluded (\`source/*\`, \`media/*\`, \`listing/*\`, \`dataset/*\`, \`language/*\`, \`passage/quran-*\`). "Links" = distinct data/prose files mentioning the id. Full per-class queues live in \`docs/delegation/prose-queue/\`; this index shows the top ${TOP_ROWS} rows per class. Programme: \`docs/delegation/prose-fill-programme.md\`._`,
    "",
  ];
  const totals: string[] = ["| Class | Missing (any lang) | Thin (any lang) |", "|---|---|---|"];
  let gMiss = 0, gThin = 0;
  for (const cls of CLASSES) {
    const list = (rows.get(cls) ?? []).sort((a, b) => b.links - a.links || a.id.localeCompare(b.id));
    const miss = list.filter((r) => r.missing.length);
    const thinOnly = list.filter((r) => !r.missing.length);
    gMiss += miss.length;
    gThin += thinOnly.length;
    totals.push(`| ${cls} | ${miss.length} | ${thinOnly.length} |`);
    if (!list.length) continue;
    const head = [
      `# ${cls} prose-fill queue`,
      "",
      `_Computed ${stamp}. ${miss.length} missing, ${thinOnly.length} thin (thin-only rows rank below missing, still sorted by links)._`,
      "",
      "| Links | Entity | Missing | Thin | Sources |",
      "|---|---|---|---|---|",
    ];
    for (const r of [...miss, ...thinOnly]) {
      head.push(`| ${r.links} | \`${r.id}\` ${r.label} | ${r.missing.join(" ") || "—"} | ${r.thin.join(" ") || "—"} | ${r.sources.join(", ")} |`);
    }
    writeFileSync(p("docs", "delegation", "prose-queue", `${cls}.md`), head.join("\n") + "\n");
    index.push(`## ${cls} — missing ${miss.length}, thin ${thinOnly.length}`, "");
    index.push("| Links | Entity | Missing | Thin |", "|---|---|---|---|");
    for (const r of [...miss, ...thinOnly].slice(0, TOP_ROWS)) {
      index.push(`| ${r.links} | \`${r.id}\` ${r.label} | ${r.missing.join(" ") || "—"} | ${r.thin.join(" ") || "—"} |`);
    }
    index.push("");
  }
  index.splice(3, 0, "", `**Totals:** ${gMiss} entities missing prose in ≥1 language, ${gThin} more thin-only.`, "", ...totals);
  writeFileSync(p("docs", "delegation", "prose-fill-queue.md"), index.join("\n") + "\n");
  console.log(`prose-fill-queue -> docs/delegation/prose-fill-queue.md + prose-queue/*.md (${gMiss} missing, ${gThin} thin)`);
}

main();
