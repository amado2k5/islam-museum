#!/usr/bin/env tsx
/**
 * tradition-packets.ts — build evidence-rich judge packets for persons with
 * weak/missing tradition attestations (output of tradition-audit.ts).
 *
 * Per candidate: identity, dates, existing labels, teachers (student_of),
 * students (inverse index), authored works, group memberships, truncated
 * summary, and a ready-to-send `prompt` field carrying the taxonomy rubric.
 *
 * Read-only on data/; writes docs/decisions/tradition-packets.jsonl
 *
 * Usage: npx tsx scripts/decisions/tradition-packets.ts [--limit N] [--tiers a,b]
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = process.cwd();
const PERSONS = join(ROOT, "data/person");
const WORKS = join(ROOT, "data/work");
const AUDIT = join(ROOT, "docs/decisions/tradition-attestation-audit.json");
const OUT = arg("--out") ?? join(ROOT, "docs/decisions/tradition-packets.jsonl");
const DEFAULT_TIERS = ["default-only", "unknown-only", "missing"];

const ENUM = ["sunni","sunni-hanafi","sunni-maliki","sunni-shafii","sunni-hanbali",
  "sunni-ashari","sunni-maturidi","sunni-athari","shia-twelver","shia-ismaili",
  "shia-zaydi","ibadi","zahiri","sufi","mu-tazila","quranist","ahmadiyya",
  "nondenominational","academic","other","unknown"];

const RUBRIC = `You are classifying a historical person's Islamic tradition for a museum knowledge graph.
Evidence hierarchy (strongest first): explicit self-designation; explicit rijal/tabaqat label (حنفي/شافعي/شيعي/معتزلي…); inclusion in a single-school tabaqat; the person's own works; rijal-corpus membership and narrator relations; teachers/students/isnads; geography/era as CONTEXT ONLY, never proof.
Hard rules: name/family/birthplace NEVER count. Contested markers (يُرمى بالتشيع، مائل إلى) mean contested — do not flatten. Judge/dataset labels are proposals, not evidence. If evidence does not resolve, answer unknown.
Reply with STRICT JSON only: {"tradition":"<one of: ${ENUM.join("|")}>","subsect":null,"confidence":0..1,"evidence":["..."],"contradictions":["..."],"doubt_flags":["..."]}`;

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function labelOf(doc: any): { ar?: string; en?: string } {
  const l = doc?.label ?? {};
  return { ar: l.ar, en: l.en };
}

function relTargets(doc: any, types: Set<string>): string[] {
  const out: string[] = [];
  for (const r of doc?.relations ?? []) {
    if (types.has(r?.type) && typeof r?.target === "string") out.push(r.target);
  }
  return out;
}

function main() {
  const limit = arg("--limit") ? parseInt(arg("--limit")!) : Infinity;
  const tiers = new Set((arg("--tiers") ?? DEFAULT_TIERS.join(",")).split(","));
  const audit = JSON.parse(readFileSync(AUDIT, "utf8"));
  const candidates: string[] = audit.rows
    .filter((r: any) => tiers.has(r.tier))
    .map((r: any) => r.id);
  const wanted = new Set(candidates);

  // pass 1: candidate docs + student_of edges for the inverse (teacher -> students) map
  const docs = new Map<string, any>();
  const teacherToStudents = new Map<string, string[]>();
  for (const fn of readdirSync(PERSONS).filter(f => f.endsWith(".yaml"))) {
    const id = fn.replace(/\.yaml$/, "");
    let doc: any;
    try { doc = parse(readFileSync(join(PERSONS, fn), "utf8")); } catch { continue; }
    if (wanted.has(id)) docs.set(id, doc);
    if (doc?.relations) {
      for (const r of doc.relations) {
        if (r?.type === "student_of" && typeof r?.target === "string") {
          const arr = teacherToStudents.get(r.target) ?? [];
          arr.push(id); teacherToStudents.set(r.target, arr);
        }
      }
    }
  }

  const nameCache = new Map<string, string>();
  function nameOf(target: string): string {
    if (nameCache.has(target)) return nameCache.get(target)!;
    const cls = target.split("/")[0], slug = target.split("/")[1];
    let name = target;
    const dir = cls === "person" ? PERSONS : cls === "work" ? WORKS : null;
    if (dir) {
      const f = join(dir, `${slug}.yaml`);
      if (existsSync(f)) {
        try {
          const d = parse(readFileSync(f, "utf8"));
          const l = labelOf(d);
          name = l.en ?? l.ar ?? target;
        } catch { /* keep target */ }
      }
    }
    nameCache.set(target, name);
    return name;
  }

  // islamlab corroborating signals (labeling accelerator — proposals, never evidence)
  const noSignals = process.argv.includes("--no-signals");
  const islamlab = new Map<string, any>();
  const ilFile = join(ROOT, "docs/decisions/islamlab-match.jsonl");
  if (existsSync(ilFile) && !noSignals) {
    for (const l of readFileSync(ilFile, "utf8").split("\n")) {
      if (!l.trim()) continue;
      try { const r = JSON.parse(l); if (r.person_id) islamlab.set(r.person_id, r); } catch { /* skip */ }
    }
  }

  let written = 0;
  const out = writeFileSync(OUT, "");
  const stream = (s: string) => writeFileSync(OUT, s, { flag: "a" });
  for (const id of [...wanted].sort()) {
    if (written >= limit) break;
    const doc = docs.get(id);
    if (!doc) continue;
    const l = labelOf(doc);
    const teachers = relTargets(doc, new Set(["student_of"])).map(nameOf);
    const students = (teacherToStudents.get(`person/${id}`) ?? []).map(s => nameOf(`person/${s}`));
    const works = relTargets(doc, new Set(["authored", "commentary_on", "translation_of"])).map(nameOf);
    const groups = relTargets(doc, new Set(["member_of", "founder_of"])).map(nameOf);
    const summary = typeof doc?.summary?.en === "string" ? doc.summary.en.slice(0, 500)
      : typeof doc?.summary?.ar === "string" ? doc.summary.ar.slice(0, 500) : "";
    const faith = (doc?.faith ?? []).map((f: any) => `${f?.value ?? "?"} (${f?.basis ?? "?"})`);
    const traditions = (doc?.traditions ?? []).join(", ");
    const born = doc?.born?.hijri ?? doc?.born?.edtf ?? "";
    const died = doc?.died?.hijri ?? doc?.died?.edtf ?? "";

    const il = islamlab.get(id);
    const ilSignal = il?.want_tradition
      ? `external proposal (islamlab dataset, unverified): madhhab=${il.madhhab} -> ${il.want_tradition} (match: ${il.verdict})`
      : "";

    // faith[]/traditions[] stay OUT of the judge prompt: recorded labels are the
    // golden answer key and unverified defaults for candidates — either would
    // anchor the verdict (circularity/leakage). They remain structured fields.
    const evidence = [
      `name: ${l.en ?? ""} / ${l.ar ?? ""}`,
      ilSignal,
      `dates: born ${born} died ${died}`,
      teachers.length ? `teachers: ${teachers.join("; ")}` : "",
      students.length ? `students: ${students.slice(0, 10).join("; ")}` : "",
      works.length ? `works: ${works.slice(0, 15).join("; ")}` : "",
      groups.length ? `groups: ${groups.join("; ")}` : "",
      summary ? `summary: ${summary}` : "",
    ].filter(Boolean).join("\n");

    const prompt = `${RUBRIC}\n\nPERSON: ${l.en ?? id} (${l.ar ?? ""}) — ${id}\n\nEVIDENCE:\n${evidence}`;
    stream(JSON.stringify({ person_id: id, name_en: l.en ?? null, name_ar: l.ar ?? null,
      born, died, existing_faith: faith, existing_traditions: traditions ? traditions.split(", ") : [],
      islamlab_signal: il?.want_tradition ? { madhhab: il.madhhab, tradition: il.want_tradition, verdict: il.verdict } : null,
      teachers, students: students.slice(0, 10), works, groups, summary, prompt }, null, 0) + "\n");
    written++;
  }
  console.log(`candidates: ${wanted.size}, packets written: ${written} -> ${OUT}`);
}

main();
