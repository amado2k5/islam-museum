// promote-check: the machine-checkable half of the promotion protocol
// (docs/agents/review-and-promotion.md §2). A reviewer agent runs this for a batch of
// candidate records before the human-scale work of re-deriving claims (§3.2) and attaches
// the sheet to the promotion commit. It checks what a machine can check: sources exist
// and are not pointer-only, provenance is complete, the strict dated-fact rule's flags
// (needs_source, confidence: low) are absent, trilingual prose parity, and that every
// {cite:...} in the prose resolves to a source entity. It does NOT judge prose quality,
// structure or doubt-preservation — those are the reviewer's, per the protocol.
//
// Run: npm run promote-check -- <class/slug> [<class/slug> ...] [--json]
// Exit code 1 if any record FAILs.
import { existsSync, readFileSync } from "node:fs";
import { p, parseRef, readYaml } from "./lib.js";

// Classes that do not take prose pages (bibliography cards, captions, reader frames —
// see docs/agents/lanes/prose-backfill.md); promotion checks for them skip the prose items.
const PROSE_EXEMPT_CLASSES = new Set(["source", "media", "listing", "dataset", "language"]);

export function isPointerSource(id: string): boolean {
  // Gazetteer / authority families locate and disambiguate; they never carry a claim alone.
  return (
    id === "source/wikidata" ||
    id.startsWith("source/geonames") ||
    id.startsWith("source/pleiades") ||
    id.startsWith("source/getty") ||
    id.startsWith("source/viaf")
  );
}

export function containsNeedsSource(text: string): boolean {
  return /needs_source/.test(text);
}

export function containsLowConfidence(text: string): boolean {
  return /confidence:\s*low\b/.test(text);
}

export function extractCiteSlugs(text: string): string[] {
  // Same citation shape the validator accepts: {cite:<slug> <free-form anchor>}.
  const re = /\{cite:([a-z0-9-]+)(?:\s[^}]*)?\}/g;
  return [...new Set([...text.matchAll(re)].map((m) => m[1]))];
}

export interface CheckResult { name: string; ok: boolean; detail: string }
export interface RecordReport { id: string; result: "pass" | "fail" | "skip"; checks: CheckResult[] }

export function checkRecord(id: string): RecordReport {
  const checks: CheckResult[] = [];
  const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });
  const dataFile = p("data", `${id}.yaml`);
  if (!existsSync(dataFile)) {
    add("record-exists", false, `no file at data/${id}.yaml`);
    return { id, result: "fail", checks };
  }
  const raw = readFileSync(dataFile, "utf8");
  const entity: any = readYaml(dataFile);
  const { cls } = parseRef(id);

  const review = entity?.status?.review ?? "(unset)";
  if (review !== "draft") {
    add("review-state", true, `already ${review}; not a promotion candidate`);
    return { id, result: "skip", checks };
  }
  add("review-state", true, "draft");

  const sources: string[] = Array.isArray(entity?.sources) ? entity.sources : [];
  add("sources-present", sources.length >= 1, sources.length ? `${sources.length} source(s)` : "no sources listed");
  const missing = sources.filter((s) => !existsSync(p("data", `${s}.yaml`)));
  add("sources-resolve", missing.length === 0, missing.length ? `missing: ${missing.join(", ")}` : "all cited sources exist");
  const real = sources.filter((s) => !isPointerSource(s));
  add("non-pointer-source", real.length >= 1, real.length ? `non-pointer: ${real.join(", ")}` : "only pointer/gazetteer sources");

  const prov = entity?.provenance ?? {};
  const provMissing = ["layer", "source", "generated_by"].filter((k) => !prov[k]);
  add("provenance-complete", provMissing.length === 0, provMissing.length ? `provenance missing: ${provMissing.join(", ")}` : "layer, source, generated_by present");

  // The strict dated-fact rule (§2.3): no unresolved flags anywhere in the record.
  add("no-needs-source", !containsNeedsSource(raw), containsNeedsSource(raw) ? "record carries a needs_source flag" : "no needs_source flags");
  add("no-low-confidence", !containsLowConfidence(raw), containsLowConfidence(raw) ? "record carries confidence: low (resolve it, or the record stays draft)" : "no confidence: low");

  const exempt = PROSE_EXEMPT_CLASSES.has(cls) || id.startsWith("passage/quran-");
  const prose: Record<string, string | null> = {};
  for (const lang of ["ar", "en", "ur"]) {
    const f = p("content", lang, `${id}.md`);
    prose[lang] = existsSync(f) ? readFileSync(f, "utf8") : null;
  }
  if (exempt) {
    add("prose-parity", true, `${cls} takes no prose page; skipped`);
  } else if (!prose.ar && !prose.en && !prose.ur) {
    add("prose-parity", false, "no prose in any language");
  } else {
    const missingLangs = ["ar", "en", "ur"].filter((l) => !prose[l]);
    add("prose-parity", missingLangs.length === 0, missingLangs.length ? `prose missing in: ${missingLangs.join(", ")}` : "ar + en + ur prose present");
  }

  const citeSlugs = new Set<string>();
  for (const lang of ["ar", "en", "ur"]) if (prose[lang]) for (const s of extractCiteSlugs(prose[lang]!)) citeSlugs.add(s);
  const badCites = [...citeSlugs].filter((s) => !existsSync(p("data", "source", `${s}.yaml`)));
  add("cites-resolve", badCites.length === 0, badCites.length ? `unresolved cites: ${badCites.join(", ")}` : `${citeSlugs.size} distinct cite(s), all resolve`);

  return { id, result: checks.every((c) => c.ok) ? "pass" : "fail", checks };
}

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (!ids.length) {
    console.error("usage: npm run promote-check -- <class/slug> [<class/slug> ...] [--json]");
    process.exit(2);
  }
  const reports = ids.map(checkRecord);
  if (json) {
    console.log(JSON.stringify(reports, null, 2));
  } else {
    for (const r of reports) {
      console.log(`${r.result.toUpperCase().padEnd(4)} ${r.id}`);
      for (const c of r.checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
    }
    const fails = reports.filter((r) => r.result === "fail").length;
    const passes = reports.filter((r) => r.result === "pass").length;
    const skips = reports.filter((r) => r.result === "skip").length;
    console.log(`\npromote-check: ${passes} pass, ${fails} fail, ${skips} skip of ${reports.length} record(s)`);
    if (fails) process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
