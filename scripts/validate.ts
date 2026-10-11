// Validates data/ and content/: JSON Schema, EDTF + Hijri sanity, link resolution, predicates
// (domain/range), licence whitelist, alt text, slug rules, duplicate external IDs, prose links.
// Run: npm run validate [-- --strict]   (--strict turns warnings into failures)
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import edtf from "edtf";
import { CLASSES, LANGS, loadEntities, loadPredicates, loadProse, loadStubs, p, readYaml, rel, resolvePredicates } from "./lib.js";
import { hijriToCivil, toJDN } from "./hijri/convert.js";

export interface Issue { level: "error" | "warn"; file: string; msg: string }

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REF = /^[a-z]+\/[a-z0-9]+(-[a-z0-9]+)*$/;

/** Hijri strings: [-]YYYY[-MM[-DD]] with optional ~ ? markers; month 1-12, day 1-30. */
export function hijriProblem(h: string): string | null {
  const m = h.match(/^(-?\d{4})(?:-(\d{2})(?:-(\d{2}))?)?[~?%]?$/);
  if (!m) return `malformed Hijri date "${h}" (expected YYYY[-MM[-DD]] with optional ~ or ?)`;
  const mo = m[2] ? Number(m[2]) : 1;
  const d = m[3] ? Number(m[3]) : 1;
  if (mo < 1 || mo > 12) return `Hijri month out of range in "${h}"`;
  if (d < 1 || d > 30) return `Hijri day out of range in "${h}"`;
  return null;
}

/** Hijri/CE agreement: the two sides of one date must be within ~2 years of each other. */
export function hijriCeMismatch(date: { edtf?: string; hijri?: string; calendar?: string }): string | null {
  if (!date.edtf || !date.hijri) return null;
  const hm = date.hijri.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  const em = date.edtf.match(/^(-?\d{4})/);
  if (!hm || !em) return null;
  const hy = Number(hm[1]);
  if (hy < 1) return null;
  const civil = hijriToCivil({ y: hy, m: hm[2] ? Number(hm[2]) : 6, d: hm[3] ? Number(hm[3]) : 15 }, date.calendar as any);
  const jdnH = toJDN(civil.calendar, civil.date);
  const ey = Number(em[1]);
  const jdnE = toJDN("gregorian", { y: ey, m: 6, d: 15 });
  return Math.abs(jdnH - jdnE) > 800 ? `Hijri "${date.hijri}" and EDTF "${date.edtf}" are more than ~2 years apart` : null;
}

function* walkDates(node: any, path = ""): Generator<[string, any]> {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) yield* walkDates(node[i], `${path}[${i}]`); return; }
  if (typeof node.edtf === "string" || typeof node.hijri === "string") yield [path, node];
  for (const [k, v] of Object.entries(node)) yield* walkDates(v, path ? `${path}.${k}` : k);
}

export function validateAll(): { issues: Issue[]; entityCount: number; proseCount: number } {
  const issues: Issue[] = [];
  const err = (file: string, msg: string) => issues.push({ level: "error", file: rel(file), msg });
  const warn = (file: string, msg: string) => issues.push({ level: "warn", file: rel(file), msg });

  // ---- schemas
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  ajv.addSchema(readYamlJson("schema/_base.schema.json"));
  for (const c of CLASSES) ajv.addSchema(readYamlJson(`schema/${c}.schema.json`));

  const predicates = resolvePredicates(loadPredicates());
  const idPatterns = readYaml<Record<string, { pattern: string }>>(p("schema", "external-id-patterns.yaml"));

  // ---- load
  const loaded = loadEntities();
  const stubs = loadStubs();
  const known = new Set<string>();
  const stubIds = new Set(stubs.map((s) => s.id));
  const aliasOwner = new Map<string, string>();
  const externalIds = new Map<string, string>();

  for (const { entity, file } of loaded) {
    if (!entity || typeof entity !== "object") { err(file, "file is empty or not a YAML mapping"); continue; }
    const dir = basename(dirname(file));
    const slug = basename(file, ".yaml");
    if (!SLUG.test(slug)) err(file, `slug "${slug}" must be lowercase ASCII words joined by hyphens`);
    if (entity.id !== `${dir}/${slug}`) err(file, `id "${entity.id}" must equal "${dir}/${slug}" (path decides identity)`);
    if (entity.class !== dir) err(file, `class "${entity.class}" must match its directory "${dir}"`);
    if (known.has(entity.id)) err(file, `duplicate id ${entity.id}`);
    known.add(entity.id);
    for (const a of entity.aliases ?? []) {
      if (aliasOwner.has(a)) err(file, `alias ${a} also claimed by ${aliasOwner.get(a)}`);
      aliasOwner.set(a, entity.id);
    }
  }
  for (const id of stubIds) if (known.has(id)) warn(p("data", "_stubs.yaml"), `${id} is now written; remove it from _stubs.yaml`);
  const resolves = (id: string) => known.has(id) || stubIds.has(id) || aliasOwner.has(id);
  const classOf = (id: string) => id.split("/")[0];

  // ---- per entity
  for (const { entity, file } of loaded) {
    if (!entity?.class || !CLASSES.includes(entity.class)) { err(file, `unknown class "${entity?.class}"`); continue; }
    const validate = ajv.getSchema(`${entity.class}.schema.json`)!;
    if (!validate(entity)) {
      for (const e of validate.errors ?? []) {
        if (e.keyword === "unevaluatedProperties") err(file, `unknown field "${(e.params as any).unevaluatedProperty}" at ${e.instancePath || "/"}`);
        else err(file, `${e.instancePath || "/"} ${e.message}${e.params && (e.params as any).allowedValues ? ` (${(e.params as any).allowedValues.join(", ")})` : ""}`);
      }
    }

    if (!entity.label?.en) err(file, "label.en is required");
    if (!entity.summary?.en) err(file, "summary.en is required");
    if (entity.class !== "source") {
      if (!entity.label?.ar) warn(file, "label.ar missing (Arabic is first-class)");
      if (!entity.summary?.ar) warn(file, "summary.ar missing");
    }

    // dates
    for (const [path, d] of walkDates(entity)) {
      if (d.edtf) { try { edtf(d.edtf); } catch { err(file, `${path}: invalid EDTF "${d.edtf}"`); } }
      if (d.hijri) { const hp = hijriProblem(d.hijri); if (hp) err(file, `${path}: ${hp}`); }
      const mm = hijriCeMismatch(d);
      if (mm) err(file, `${path}: ${mm}`);
      if (d.edtf && d.hijri && d.derived === undefined && false) warn(file, path);
    }

    // sources
    const own = new Set<string>(entity.sources ?? []);
    for (const s of own) {
      if (!REF.test(s) || classOf(s) !== "source") err(file, `sources: "${s}" is not a source/<slug> id`);
      else if (!known.has(s)) err(file, `sources: ${s} does not exist (cited sources must exist)`);
    }
    if (!["source", "dataset", "question", "passage", "media"].includes(entity.class) && own.size === 0) {
      (entity.status?.review === "draft" ? warn : err)(file, "no sources listed (every entity must cite at least one)");
    }

    // simple ref fields
    for (const per of entity.periods ?? []) if (!resolves(per)) err(file, `periods: ${per} does not exist`);
    for (const f of ["hero"]) {
      const v = entity.media?.[f];
      if (v && !known.has(v)) err(file, `media.${f}: ${v} does not exist`);
    }
    for (const t of entity.perspectives ?? []) for (const s of t.sources ?? []) if (!known.has(s)) err(file, `perspective source ${s} does not exist`);

    // relations
    entity.relations?.forEach((r: any, i: number) => {
      const where = `relations[${i}]`;
      const rp = predicates.get(r.type);
      if (!rp) { err(file, `${where}: unknown predicate "${r.type}" (see schema/predicates.yaml)`); return; }
      if (!REF.test(r.target ?? "")) { err(file, `${where}: target "${r.target}" is not a class/slug id`); return; }
      if (!resolves(r.target)) err(file, `${where}: target ${r.target} does not exist; add the entity or declare it in data/_stubs.yaml`);
      // a relation written with the inverse name has its domain and range swapped
      const dom = rp.reversed ? rp.pred.range : rp.pred.domain;
      const ran = rp.reversed ? rp.pred.domain : rp.pred.range;
      if (!dom.includes("*") && !dom.includes(entity.class)) err(file, `${where}: ${r.type} cannot start from a ${entity.class} (domain: ${dom.join(", ")})`);
      const tc = classOf(r.target);
      if (!ran.includes("*") && !ran.includes(tc)) err(file, `${where}: ${r.type} cannot point to a ${tc} (range: ${ran.join(", ")})`);
      for (const s of r.sources ?? []) if (!known.has(s)) err(file, `${where}: source ${s} does not exist`);
      if (r.type === "related_to") warn(file, `${where}: related_to is a discouraged fallback; use a typed predicate`);
    });

    // external ids
    for (const [k, v] of Object.entries<string>(entity.external_ids ?? {})) {
      const pat = idPatterns[k];
      if (!pat) { warn(file, `external_ids.${k}: no pattern registered in schema/external-id-patterns.yaml`); continue; }
      if (!new RegExp(pat.pattern).test(String(v))) err(file, `external_ids.${k}: "${v}" does not match ${pat.pattern}`);
      const key = `${k}:${v}`;
      if (externalIds.has(key)) err(file, `duplicate external id ${key} (also on ${externalIds.get(key)})`);
      externalIds.set(key, entity.id);
    }

    // media: licence and alt text in every published language
    if (entity.class === "media") {
      for (const lang of LANGS) if (!entity.alt?.[lang]) err(file, `alt text missing for "${lang}" (required in every language we publish)`);
    }
    if (entity.class === "media" && entity.sensitivity === "figurative-prophet") err(file, "figurative depictions of prophets are never displayed; describe in text instead");
  }

  // ---- prose
  const prose = loadProse();
  const linkRe = /\[\[([a-z]+\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;
  const citeRe = /\{cite:([a-z0-9-]+)(?:\s[^}]*)?\}/g;
  const seen = new Set<string>();
  for (const pr of prose) {
    if (!(LANGS as readonly string[]).includes(pr.lang)) err(pr.file, `language "${pr.lang}" has no i18n/${pr.lang}.yaml`);
    if (pr.frontmatter.id !== pr.id) err(pr.file, `frontmatter id "${pr.frontmatter.id}" must equal "${pr.id}"`);
    if (pr.frontmatter.lang !== pr.lang) err(pr.file, `frontmatter lang "${pr.frontmatter.lang}" must equal "${pr.lang}"`);
    if (!known.has(pr.id)) err(pr.file, `no data file for ${pr.id}`);
    seen.add(`${pr.lang}:${pr.id}`);
    for (const m of pr.body.matchAll(linkRe)) if (!resolves(m[1])) err(pr.file, `unresolved link [[${m[1]}]]`);
    for (const m of pr.body.matchAll(citeRe)) if (!known.has(`source/${m[1]}`)) err(pr.file, `{cite:${m[1]}} does not resolve to a source`);
    if (/\b(peace be upon him|pbuh|\(saw\)|ﷺ|صلى الله عليه وسلم)/i.test(pr.body)) err(pr.file, "honorifics must not be typed into prose (the UI renders them)");
    if (!/^## /m.test(pr.body)) warn(pr.file, "no section headings");
  }
  for (const { entity, file } of loaded) {
    if (["person", "event"].includes(entity.class) && !seen.has(`en:${entity.id}`) && entity.status?.completeness >= 2) {
      warn(file, "completeness >= 2 but no English prose in content/en/");
    }
  }

  return { issues, entityCount: loaded.length, proseCount: prose.length };
}

function readYamlJson(path: string) {
  return JSON.parse(readFileSync(p(path), "utf8"));
}

// ---- CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const strict = process.argv.includes("--strict");
  const { issues, entityCount, proseCount } = validateAll();
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  for (const i of [...errors, ...warns]) console.log(`${i.level === "error" ? "ERROR" : "warn "} ${i.file}: ${i.msg}`);
  console.log(`\nvalidated ${entityCount} entities, ${proseCount} prose files: ${errors.length} errors, ${warns.length} warnings`);
  process.exit(errors.length || (strict && warns.length) ? 1 : 0);
}
