// Fast scoped check of one lane packet (docs/agents/pipeline.md). Usage: npm run check:packet -- <packet dir>
// Reads <packet>/manifest.yaml and the <packet>/files/ tree (a repo-relative tree: files/data/<class>/<slug>.yaml,
// files/content/<lang>/<class>/<slug>.md) and checks them against the repository in the current checkout, in a few
// seconds. It writes nothing. The full `npm run validate` still runs once per train, before the lander merges.
//
// Reused, not re-implemented: HONORIFIC, ARABIC_PAREN_UNISOLATED and textFields come from scripts/validate.ts;
// findBlocked, entityOfPath and parseExceptions (the terrorist-organisation block) from scripts/lib/extremism.ts;
// the YAML parser, ROOT and CLASSES from scripts/lib.ts. Only the packet-shape rules below are new.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { CLASSES, LANGS, ROOT } from "./lib.js";
import { ARABIC_PAREN_UNISOLATED, HONORIFIC, textFields } from "./validate.js";
import { entityOfPath, findBlocked, parseExceptions } from "./lib/extremism.js";

export const MAX_ENTITIES = 25;
const ID_RE = /^[a-z_]+\/[a-z0-9-]+$/;
const CANARY_KINDS = new Set(["Data", "Added", "Changed", "Fixed", "Removed", "Performance", "Tests", "Breaking", "Rolled back"]);
const PROVENANCE_KEYS = ["generated_by", "model", "run", "source"];
const ELLIPSIS = /\.{3}|…/;

export interface PacketResult { errors: string[]; warnings: string[]; entities: string[]; files: number }

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) yield* walk(f);
    else yield f;
  }
}

function frontmatter(raw: string): { fm: any; body: string; ok: boolean } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw, ok: false };
  return { fm: parse(m[1]) ?? {}, body: m[2], ok: true };
}

/** An alias of an existing entity counts as a resolving link (the validator's rule); looked up only when a link fails. */
function aliasOwned(repo: string, id: string): boolean {
  let hits: string[] = [];
  try {
    // git grep searches the tracked tree in about a second; plain grep over data/ takes ten times as long
    hits = execFileSync("git", ["-C", repo, "grep", "-lF", id, "--", "data"], { encoding: "utf8", maxBuffer: 64 << 20 }).split("\n").filter(Boolean).map((f) => join(repo, f));
  } catch (e: any) {
    if (e.status === 1) return false; // no match
    try { hits = execFileSync("grep", ["-rlF", "--include=*.yaml", id, join(repo, "data")], { encoding: "utf8", maxBuffer: 64 << 20 }).split("\n").filter(Boolean); } catch { return false; }
  }
  for (const f of hits) {
    try { if ((parse(readFileSync(f, "utf8"))?.aliases ?? []).includes(id)) return true; } catch { /* unparsable repo file: not ours to judge */ }
  }
  return false;
}

export function checkPacket(packetDir: string, repo: string = ROOT): PacketResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const err = (f: string, m: string) => errors.push(`${f}: ${m}`);
  const warn = (f: string, m: string) => warnings.push(`${f}: ${m}`);
  const dir = resolve(packetDir);
  const result = (entities: string[], files: number): PacketResult => ({ errors, warnings, entities, files });

  // ---- manifest
  const mfile = join(dir, "manifest.yaml");
  if (!existsSync(mfile)) { err("manifest.yaml", "missing"); return result([], 0); }
  let manifest: any;
  try { manifest = parse(readFileSync(mfile, "utf8")); } catch (e: any) { err("manifest.yaml", `YAML does not parse: ${String(e.message).split("\n")[0]}`); return result([], 0); }
  if (!manifest || typeof manifest !== "object") { err("manifest.yaml", "is empty or not a mapping"); return result([], 0); }
  for (const k of ["id", "lane", "stage", "author_agent", "model", "date", "base_commit"]) if (!manifest[k]) err("manifest.yaml", `missing field "${k}"`);
  if (manifest.stage && !["drafting", "verified"].includes(manifest.stage)) err("manifest.yaml", `stage must be drafting or verified, got "${manifest.stage}"`);
  if (manifest.stage === "verified" && !manifest.verifier_agent) err("manifest.yaml", "a verified packet must name its verifier_agent");
  if (manifest.verifier_agent && manifest.author_agent && manifest.verifier_agent === manifest.author_agent) warn("manifest.yaml", "verifier_agent equals author_agent: the pipeline asks for a different agent");
  const canary = manifest.canary;
  if (!canary || typeof canary.text !== "string" || !canary.text.trim()) err("manifest.yaml", "canary.text (the reader-facing release note) is required");
  else if (!CANARY_KINDS.has(canary.kind)) err("manifest.yaml", `canary.kind must be one of ${[...CANARY_KINDS].join(", ")}, got "${canary.kind}"`);
  if (!manifest.ledger?.file || !Array.isArray(manifest.ledger?.lines) || !manifest.ledger.lines.length) err("manifest.yaml", "ledger.file and ledger.lines are required (one ledger file per book or series)");
  const declared: string[] = Array.isArray(manifest.entities) ? manifest.entities : [];
  const declaredNew: string[] = Array.isArray(manifest.new_entities) ? manifest.new_entities : [];
  if (!Array.isArray(manifest.entities)) err("manifest.yaml", "entities must be a list of class/slug");
  for (const id of [...declared, ...declaredNew]) if (!ID_RE.test(String(id))) err("manifest.yaml", `"${id}" is not a class/slug id`);
  for (const id of declaredNew) if (!declared.includes(id)) err("manifest.yaml", `new_entities lists ${id}, which is not in entities`);
  if (JSON.stringify(manifest).match(/\/(Users|home)\/|\/Volumes\//)) warn("manifest.yaml", "contains an absolute home or volume path; write paths relative to the harvest root");
  const manifestText = readFileSync(mfile, "utf8");
  for (const h of findBlocked(manifestText)) err("manifest.yaml", `names a blocked organisation (${h.label}: "${h.text}")`);

  // ---- files tree
  const filesDir = join(dir, "files");
  if (!existsSync(filesDir) || !statSync(filesDir).isDirectory()) { err("files/", "missing"); return result(declared, 0); }
  type Item = { rel: string; abs: string };
  const dataFiles = new Map<string, Item>(); // id -> file
  const proseFiles = new Map<string, Map<string, Item>>(); // id -> lang -> file
  let fileCount = 0;
  for (const abs of walk(filesDir)) {
    const rel = relative(filesDir, abs).replace(/\\/g, "/");
    fileCount++;
    if (rel.split("/").some((s) => s.startsWith(".") && s !== ".")) continue; // .DS_Store and the like
    let m = /^data\/([a-z_]+)\/([a-z0-9-]+)\.yaml$/.exec(rel);
    if (m) {
      if (!(CLASSES as readonly string[]).includes(m[1])) { err(rel, `unknown class "${m[1]}"`); continue; }
      if (m[1] === "passage" && m[2].startsWith("quran-")) { err(rel, "Qur'an passage files are never staged (text comes only from the frozen Tanzil files)"); continue; }
      dataFiles.set(`${m[1]}/${m[2]}`, { rel, abs });
      continue;
    }
    m = /^content\/([a-z]{2})\/([a-z_]+)\/([a-z0-9-]+)\.md$/.exec(rel);
    if (m) {
      if (!(LANGS as readonly string[]).includes(m[1])) { err(rel, `language "${m[1]}" has no i18n file`); continue; }
      const id = `${m[2]}/${m[3]}`;
      if (!proseFiles.has(id)) proseFiles.set(id, new Map());
      proseFiles.get(id)!.set(m[1], { rel, abs });
      continue;
    }
    if (rel.startsWith("content/") && !rel.endsWith(".md")) err(rel, "content/ holds .md prose only (data belongs in data/<class>/<slug>.yaml)");
    else if (rel.startsWith("data/") && rel.endsWith(".md")) err(rel, "data/ holds .yaml only (prose belongs in content/<lang>/<class>/<slug>.md)");
    else if (/^data\/_stubs\.d\/[a-z0-9-]+\.yaml$/.test(rel)) { try { parse(readFileSync(abs, "utf8")); } catch (e: any) { err(rel, `YAML does not parse: ${String(e.message).split("\n")[0]}`); } }
    else err(rel, "unexpected path: a packet carries only data/<class>/<slug>.yaml, content/<lang>/<class>/<slug>.md and data/_stubs.d/<lane>.yaml");
  }

  const ids = new Set<string>([...dataFiles.keys(), ...proseFiles.keys()]);
  if (ids.size > MAX_ENTITIES) err("files/", `${ids.size} entities in one packet; the limit is ${MAX_ENTITIES} (split the packet)`);
  if (declared.length > MAX_ENTITIES) err("manifest.yaml", `entities lists ${declared.length}; the limit is ${MAX_ENTITIES} per packet`);
  for (const id of ids) if (!declared.includes(id)) err("manifest.yaml", `${id} has files in the packet but is not listed in entities`);
  for (const id of declared) if (!ids.has(id)) err("manifest.yaml", `${id} is listed in entities but the packet has no file for it`);
  if (!ids.size && !errors.length) err("files/", "no data or prose files found");

  const inRepoData = (id: string) => existsSync(join(repo, "data", `${id}.yaml`));
  const inRepoProse = (id: string, lang: string) => existsSync(join(repo, "content", lang, `${id}.md`));
  const exceptions = (() => {
    const f = join(repo, "docs/delegation/extremism-firewall-exceptions.md");
    return existsSync(f) ? parseExceptions(readFileSync(f, "utf8")) : new Set<string>();
  })();

  const stubIds = new Set<string>();
  for (const f of [join(repo, "data/_stubs.yaml"), ...(existsSync(join(repo, "data/_stubs.d")) ? readdirSync(join(repo, "data/_stubs.d")).filter((n) => n.endsWith(".yaml")).map((n) => join(repo, "data/_stubs.d", n)) : [])]) {
    if (!existsSync(f)) continue;
    try {
      const d = parse(readFileSync(f, "utf8"));
      for (const s of Array.isArray(d) ? d : d?.stubs ?? []) if (s?.id) stubIds.add(s.id);
    } catch { /* repo stub file unparsable: validate reports it */ }
  }
  const aliasCache = new Map<string, boolean>();
  const linkResolves = (id: string): boolean => {
    if (dataFiles.has(id) || inRepoData(id) || stubIds.has(id)) return true;
    if (!aliasCache.has(id)) aliasCache.set(id, aliasOwned(repo, id));
    return aliasCache.get(id)!;
  };

  const checkText = (rel: string, id: string | null, text: string, lang: string | null) => {
    if (id && id.split("/")[0] !== "passage" && HONORIFIC.test(text)) err(rel, "honorifics must not be typed (the UI renders them)");
    if (/[﴿﴾]/.test(text)) err(rel, "Qur'an text markers (﴿ ﴾) must never be typed: link the ayah as [[passage/quran-<sura>-<aya>|label]]");
    if (ELLIPSIS.test(text)) err(rel, "contains an ellipsis (three dots or the ellipsis character): finish the sentence or cut it");
    if ((lang === "ar" || lang === "ur") && ARABIC_PAREN_UNISOLATED.test(text)) err(rel, "wrap every parenthetical that holds Arabic script in U+2066 ( ... ) U+2069 (AGENTS.md)");
  };
  const checkExtremism = (rel: string, text: string) => {
    const ent = entityOfPath(rel);
    if (ent && exceptions.has(ent)) return;
    for (const h of findBlocked(text)) err(rel, `names a blocked organisation (${h.label}: "${h.text}"); see docs/agents/content-safety.md`);
  };
  const linkRe = /\[\[([a-z_]+\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;
  const citeRe = /\{cite:([a-z0-9-]+)(?:\s[^}]*)?\}/g;
  // npm run validate requires no provenance block and no status on any file; it records origin in `provenance` and
  // review state in `status` without gating entry. So the packet check only warns, and only on data records, where
  // the pipeline keeps provenance (a prose file may carry its own block or rely on its data record).
  const checkProvenance = (rel: string, prov: any, ownerExists: boolean, review: any) => {
    if (!prov || typeof prov !== "object") warn(rel, "no provenance block (generated_by, model, run, source); AGENTS.md asks for one on AI output");
    else for (const k of PROVENANCE_KEYS) if (!prov[k]) warn(rel, `provenance.${k} is missing`);
    if (review === "published") warn(rel, `status.review is published${ownerExists ? "" : " on a new file"}: AI output enters as draft until a human reads it (no agent self-promotes)`);
  };

  // ---- data files
  for (const [id, { rel, abs }] of dataFiles) {
    const raw = readFileSync(abs, "utf8");
    checkExtremism(`data/${id}.yaml`, raw);
    let e: any;
    try { e = parse(raw); } catch (x: any) { err(rel, `YAML does not parse: ${String(x.message).split("\n")[0]}`); continue; }
    if (!e || typeof e !== "object") { err(rel, "is empty or not a mapping"); continue; }
    const [cls] = id.split("/");
    if (e.id !== id) err(rel, `id "${e.id}" must equal "${id}"`);
    if (e.class !== cls) err(rel, `class "${e.class}" must equal "${cls}"`);
    if (!e.label?.ar) err(rel, "label.ar is required (Arabic first)");
    if (!e.summary?.ar && cls !== "passage") err(rel, "summary.ar is required (Arabic first)");
    const hasSources = Array.isArray(e.sources) && e.sources.length > 0;
    // validate.ts line 444: no sources is an error, except a warning on a draft
    if (!hasSources && !["source", "dataset", "question", "passage", "media"].includes(cls)) (e.status?.review === "draft" ? warn : err)(rel, "no sources listed (every entity must cite at least one)");
    checkProvenance(rel, e.provenance, inRepoData(id), e.status?.review);
    for (const [path, s] of textFields(e)) {
      const lang = /(^|\.)(ar|ur)(\.|$)|\[\d+\]\.(ar|ur)$/.exec(path)?.[2] ?? null;
      checkText(`${rel} ${path}`, id, s, lang);
    }
    // relation targets and typed links in data
    for (const r of Array.isArray(e.relations) ? e.relations : []) {
      if (typeof r?.target === "string" && ID_RE.test(r.target) && !linkResolves(r.target)) err(rel, `relation target ${r.target} resolves to no file in the repository, no stub and no file in the packet`);
      for (const s of Array.isArray(r?.sources) ? r.sources : []) if (typeof s === "string" && /^source\//.test(s) && !linkResolves(s)) err(rel, `source ${s} does not resolve`);
    }
    for (const s of Array.isArray(e.sources) ? e.sources : []) if (typeof s === "string" && /^source\//.test(s) && !linkResolves(s)) err(rel, `source ${s} does not resolve`);
  }

  // ---- prose files
  for (const [id, langs] of proseFiles) {
    for (const lang of LANGS) {
      if (langs.has(lang)) continue;
      if (inRepoProse(id, lang) && !declaredNew.includes(id)) continue; // existing prose in that language stays as it is
      err(`content/*/${id}.md`, `no ${lang} file: new prose ships in ar, en, ur, fr, es, tr and id together`);
    }
    if (!dataFiles.has(id) && !inRepoData(id)) err(`content/*/${id}.md`, `no data file for ${id} in the repository or the packet`);
    for (const [lang, { rel, abs }] of langs) {
      const raw = readFileSync(abs, "utf8");
      checkExtremism(`content/${lang}/${id}.md`, raw);
      let parsed: ReturnType<typeof frontmatter>;
      try { parsed = frontmatter(raw); } catch (x: any) { err(rel, `frontmatter YAML does not parse: ${String(x.message).split("\n")[0]}`); continue; }
      if (!parsed.ok) { err(rel, "missing frontmatter block (--- ... ---)"); continue; }
      const { fm, body } = parsed;
      if (fm.id !== id) err(rel, `frontmatter id "${fm.id}" must equal "${id}"`);
      if (fm.lang !== lang) err(rel, `frontmatter lang "${fm.lang}" must equal "${lang}"`);
      if (!fm.source_lang) warn(rel, "frontmatter source_lang is missing");
      if (!body.trim()) err(rel, "the prose body is empty");
      if (fm.status?.review === "published" && !inRepoProse(id, lang)) warn(rel, "status.review is published on a new file: AI output enters as draft until a human reads it");
      checkText(rel, id, body, lang);
      for (const m of body.matchAll(linkRe)) if (!linkResolves(m[1])) err(rel, `unresolved link [[${m[1]}]] (no file in the repository, no stub, no alias, none in the packet)`);
      for (const m of body.matchAll(citeRe)) if (!linkResolves(`source/${m[1]}`)) err(rel, `{cite:${m[1]}} does not resolve to a source`);
    }
  }
  return result([...ids], fileCount);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dirArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!dirArg) { console.error("usage: npm run check:packet -- <packet dir>"); process.exit(2); }
  const t0 = Date.now();
  const r = checkPacket(dirArg);
  for (const w of r.warnings) console.log(`WARN  ${w}`);
  for (const e of r.errors) console.log(`ERROR ${e}`);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`check-packet: ${r.errors.length ? "FAIL" : "PASS"} (${r.entities.length} entities, ${r.files} files, ${r.errors.length} error(s), ${r.warnings.length} warning(s), ${secs}s)`);
  process.exit(r.errors.length ? 1 : 0);
}
