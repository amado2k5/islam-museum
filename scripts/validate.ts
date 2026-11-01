// Validates data/ and content/: JSON Schema, EDTF + Hijri sanity, link resolution, predicates
// (domain/range), licence whitelist, alt text, slug rules, duplicate external IDs, prose links.
// Run: npm run validate [-- --strict]   (--strict turns warnings into failures)
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import edtf from "edtf";
import { CLASSES, LANGS, PUBLISHED_LANGS, loadEntities, loadPredicates, loadProse, loadStubs, p, readYaml, rel, resolvePredicates, type Prose } from "./lib.js";
import { hijriToCivil, toJDN } from "./hijri/convert.js";

export interface Issue { level: "error" | "warn"; file: string; msg: string }

const CONFLICT_KINDS = new Set(["war", "campaign", "battle", "skirmish", "raid", "siege", "naval-battle", "revolt", "civil-war", "mutiny", "massacre", "conquest"]);
const SPATIAL_KINDS = new Set(["battle", "siege", "naval-battle", "campaign", "war", "conquest", "treaty", "migration", "revolt", "massacre", "council", "founding", "raid", "skirmish"]);
// provenance layers of docs/plan/15 §3; they record origin and no longer gate entry (docs/sources-policy.md)
const KNOWN_LAYERS = new Set(["cc0", "by", "by-sa", "odbl", "nc", "pd", "copyrighted-reference", "link-only", "own-research", "unverified"]);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REF = /^[a-z]+\/[a-z0-9]+(-[a-z0-9]+)*$/;

/** Hijri strings: [-]YYYY[-MM[-DD]] with optional ~ ? markers; month 1-12, day 1-30. */
export function hijriProblem(h: any): string | null {
  if (typeof h !== "string") return `Hijri date must be a quoted string (YAML reads an unquoted 0008 as a number): ${JSON.stringify(h)}`;
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

// ﷺ and the spelled-out formulas; no \b because it never matches before a non-word glyph such as ﷺ
const HONORIFIC = /(peace be upon him|\bpbuh\b|\(saw\)|ﷺ|صلى الله عليه|صلى اللّٰه عليه|عليه السلام|عليها السلام|رضي الله ع|رضي اللّٰه ع|رحمه الله|رحمه اللّٰه)/i;
function* textFields(o: any, path = ""): Generator<[string, string]> {
  if (typeof o === "string") yield [path, o];
  else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* textFields(o[i], `${path}[${i}]`);
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!["provenance", "id", "text", "text_search"].includes(k)) yield* textFields(v, path ? `${path}.${k}` : k);
}

/** The Qur'an text is frozen (docs/plan/15 §6.3): a passage must equal the committed Tanzil text, character for character. */
export function frozenQuranTextProblem(ref: string, text: string, tanzil: Map<string, string> | undefined): string | null {
  if (tanzil && tanzil.get(ref) !== text) return `Qur'an text of ${ref} differs from the frozen Tanzil file (the text is never edited; regenerate with scripts/harvest/quran/generate.py)`;
  return null;
}

// ---- leveled reading (edu/levels.yaml; docs/delegation/education-master-plan.md §5 E2, decision 3 of §9.1)
// Three optional sections under fixed headings per language inside the prose file. Each is capped in words, present in
// all three published languages or in none, declared in the record's `education.levels`, and the two child levels obey
// the kids' rulebook (docs/agents/kids-content.md §2: no fear, no gore, no shaming, no promises; §3: no perspectives).
export interface LevelDef { id: string; band: string; child: boolean; max_words: number; heading: Record<string, string> }
let levelDefs: LevelDef[] | null = null;
export function loadLevels(): LevelDef[] {
  if (!levelDefs) levelDefs = (readYaml(p("edu", "levels.yaml")).levels ?? []) as LevelDef[];
  return levelDefs;
}
/** Words a reader sees: links reduced to their label, citation markers removed, whitespace-separated. */
export const levelWordCount = (md: string): number =>
  md.replace(/\[\[[^\]|]+\|([^\]]*)\]\]/g, "$1").replace(/\[\[[^\]]+\]\]/g, "").replace(/\{cite:[^}]*\}/g, "").split(/\s+/).filter(Boolean).length;
// What never enters a child level, whatever the language (kids rulebook §2). Whole words only; names and ordinary
// story words (battle, journey, sea) are allowed because the rule is about gore and threats, not about events.
const KIDS_BANNED: { what: string; re: RegExp }[] = [
  { what: "fear-based language (hell, torment, punishment)", re: /(?<!\p{L})(جهنم|عذاب|يعذب|يعذّب|سيُعذَّب|hell|hellfire|torment|torture|punish(?:ed|ment|es)?|جہنم|دوزخ|عذاب)(?!\p{L})/iu },
  { what: "graphic battle or death detail", re: /(?<!\p{L})(قُتل|قتلوا|قتلوه|مجزرة|الدماء|دماء|ذُبح|جثث|جثة|killed|slaughtered?|massacre|blood|bloodshed|corpses?|gore|قتل|خون|ذبح|لاشیں|لاش)(?!\p{L})/iu },
  { what: "moral shaming of the child", re: /(?<!\p{L})(يا للعار|عار عليك|لا تكن جبانًا|لا تكن جبانا|shame on you|naughty|coward|cowardly|شرم کرو|بزدل)(?!\p{L})/iu },
  { what: "a promise the museum cannot keep", re: /(?<!\p{L})(سيضمن الله|سوف ينجح دائمًا|will always succeed|guarantees? that|always be rewarded|ہمیشہ کامیاب)(?!\p{L})/iu },
];
export function checkLeveledReading(prose: Prose[], loaded: { entity: any; file: string }[]): Issue[] {
  const issues: Issue[] = [];
  const err = (file: string, msg: string) => issues.push({ level: "error", file, msg });
  const levels = loadLevels();
  const byHeading = new Map<string, { lvl: LevelDef; lang: string }>();
  for (const l of levels) for (const [lang, h] of Object.entries(l.heading)) byHeading.set(h, { lvl: l, lang });
  const present = new Map<string, Map<string, Set<string>>>(); // id -> level -> langs
  const proseFile = new Map<string, string>(); // id:lang -> file
  for (const pr of prose) {
    proseFile.set(`${pr.id}:${pr.lang}`, pr.file);
    let cur: { heading: string; lines: string[] } | null = null;
    const sections: { heading: string; body: string }[] = [];
    for (const line of pr.body.split("\n")) {
      const m = line.match(/^## (.+)$/);
      if (m) { if (cur) sections.push({ heading: cur.heading, body: cur.lines.join("\n") }); cur = { heading: m[1].trim(), lines: [] }; }
      else if (cur) cur.lines.push(line);
    }
    if (cur) sections.push({ heading: cur.heading, body: cur.lines.join("\n") });
    for (const sec of sections) {
      const hit = byHeading.get(sec.heading);
      if (!hit) continue;
      const { lvl, lang } = hit;
      if (lang !== pr.lang) { err(pr.file, `"## ${sec.heading}" is the ${lvl.id} heading for ${lang}; in ${pr.lang} prose write "## ${lvl.heading[pr.lang]}" (edu/levels.yaml)`); continue; }
      const langs = present.get(pr.id) ?? new Map<string, Set<string>>();
      present.set(pr.id, langs);
      if (langs.get(lvl.id)?.has(pr.lang)) err(pr.file, `"## ${sec.heading}" appears twice`);
      langs.set(lvl.id, (langs.get(lvl.id) ?? new Set()).add(pr.lang));
      const body = sec.body.trim();
      if (!body) { err(pr.file, `"## ${sec.heading}" is empty`); continue; }
      const n = levelWordCount(body);
      if (n > lvl.max_words) err(pr.file, `"## ${sec.heading}" has ${n} words; the ${lvl.id} level allows at most ${lvl.max_words} (edu/levels.yaml)`);
      if (lvl.child) {
        if (/:::perspectives/.test(body)) err(pr.file, `"## ${sec.heading}" is a child level and must not carry a perspectives block (docs/agents/kids-content.md §3)`);
        for (const b of KIDS_BANNED) { const m = body.match(b.re); if (m) err(pr.file, `"## ${sec.heading}" is a child level and contains ${b.what}: "${m[0]}" (docs/agents/kids-content.md §2)`); }
      }
    }
  }
  const byId = new Map(loaded.map((x) => [x.entity.id, x]));
  const all = PUBLISHED_LANGS as readonly string[];
  for (const [id, langsByLevel] of present) {
    const ent = byId.get(id);
    for (const [lvl, langs] of langsByLevel) {
      const missing = all.filter((l) => !langs.has(l));
      if (missing.length) err(proseFile.get(`${id}:${[...langs][0]}`) ?? id, `level ${lvl} exists in ${[...langs].sort().join(", ")} but not in ${missing.join(", ")}: a leveled section is present in all three languages or in none`);
    }
    if (!ent) continue;
    const declared: string[] = [...(ent.entity.education?.levels ?? [])].sort();
    const found = [...langsByLevel.keys()].sort();
    if (declared.join() !== found.join()) err(ent.file, `education.levels [${declared.join(", ")}] must match the leveled sections in content/ [${found.join(", ")}]`);
  }
  for (const { entity, file } of loaded) {
    const edu = entity.education;
    if (!edu) continue;
    if (edu.levels?.length && !present.has(entity.id)) err(file, `education.levels [${edu.levels.join(", ")}] declared but content/ has no leveled section for ${entity.id}`);
    if (edu.flagged_for_kids && !(edu.levels ?? []).includes("explorers")) err(file, "education.flagged_for_kids needs the explorers level: the kids' reader shows the Sprout and Explorer texts");
    // fact engine (plan §5 E3): authored fact in the three published languages, ≤ 40 words each, ≥ 2 cited sources
    const fact = edu.did_you_know;
    if (fact) {
      for (const l of PUBLISHED_LANGS) {
        if (!fact[l]) err(file, `education.did_you_know lacks ${l}`);
        else if (levelWordCount(fact[l]) > 40) err(file, `education.did_you_know.${l} has ${levelWordCount(fact[l])} words; a fact is at most 40 words`);
      }
      const fs: string[] = fact.sources ?? [];
      if (fs.length < 2) err(file, `education.did_you_know needs at least two sources, found ${fs.length}`);
      for (const s of fs) if (!byId.has(s)) err(file, `education.did_you_know source ${s} does not exist`);
    }
  }
  return issues;
}

// ---- curriculum pathways (docs/delegation/education-master-plan.md §5 E2): a lesson trail mapped to a jurisdiction's
// curriculum must be walkable by a class (5 to 15 steps over existing records), addressed to teachers and students,
// levelled, and explained in the three published languages in the museum's own words.
export function checkCurriculum(loaded: { entity: any; file: string }[]): Issue[] {
  const issues: Issue[] = [];
  const err = (file: string, msg: string) => issues.push({ level: "error", file, msg });
  const ids = new Set(loaded.map((x) => x.entity.id));
  for (const { entity: e, file } of loaded) {
    // mastery check (plan §5 E2): 5 questions, 4 options, one answer, each teaching a step of this trail, in three languages
    if (e.quiz) {
      const n = (e.rooms ?? []).length;
      if (e.class !== "exhibit") err(file, "quiz: only an exhibit carries a mastery check");
      if (e.quiz.length !== 5) err(file, `quiz: a mastery check has exactly 5 questions, this one has ${e.quiz.length}`);
      e.quiz.forEach((q: any, i: number) => {
        if ((q.options ?? []).length !== 4) err(file, `quiz ${i + 1}: four options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) err(file, `quiz ${i + 1}: answer is the index of the right option, 0 to 3`);
        if (!Number.isInteger(q.teaches) || q.teaches < 0 || q.teaches >= n) err(file, `quiz ${i + 1}: teaches must point to a step of this trail (0 to ${n - 1})`);
        for (const l of PUBLISHED_LANGS) { if (!q.q?.[l]) err(file, `quiz ${i + 1}: question lacks ${l}`); (q.options ?? []).forEach((o: any, k: number) => { if (!o?.[l]) err(file, `quiz ${i + 1}: option ${k + 1} lacks ${l}`); }); }
        const en = (q.options ?? []).map((o: any) => o?.en).filter(Boolean);
        if (new Set(en).size !== en.length) err(file, `quiz ${i + 1}: options repeat`);
      });
    }
    const c = e.curriculum;
    if (!c) continue;
    if (e.class !== "exhibit" || e.kind !== "lesson") err(file, "curriculum: only an exhibit of kind lesson carries a curriculum block");
    const rooms: any[] = e.rooms ?? [];
    if (rooms.length < 5 || rooms.length > 15) err(file, `curriculum: a pathway has 5 to 15 steps, this one has ${rooms.length}`);
    for (const a of ["teacher", "student"]) if (!(e.audience ?? []).includes(a)) err(file, `curriculum: audience must include ${a}`);
    if (!e.level) err(file, "curriculum: a pathway states its level (intro, standard or deep)");
    if (!e.duration_minutes) err(file, "curriculum: a pathway states its duration_minutes");
    for (const l of PUBLISHED_LANGS) {
      if (!c.expectation?.[l]) err(file, `curriculum.expectation lacks ${l}: write the mapping in the museum's words in all three languages`);
      if (!e.goal?.[l]) err(file, `curriculum: a pathway states its goal in ${l}`);
    }
    (e.worksheet ?? []).forEach((w: any, i: number) => {
      for (const l of PUBLISHED_LANGS) if (!w?.prompt?.[l]) err(file, `worksheet prompt ${i + 1} lacks ${l}`);
      for (const k of w?.steps ?? []) if (!Number.isInteger(k) || k < 0 || k >= rooms.length) err(file, `worksheet prompt ${i + 1} points to step ${k}, which is not a step of this pathway`);
    });
    if (!(e.worksheet ?? []).length) err(file, "curriculum: a pathway ships a worksheet (at least one prompt)");
    if (!(e.quiz ?? []).length) err(file, "curriculum: a pathway ends with a mastery check (quiz of 5 questions)");
    rooms.forEach((r, i) => {
      for (const f of r.features ?? []) if (!ids.has(f)) err(file, `curriculum: step ${i + 1} names ${f}, which is not a record`);
      if (!(r.features ?? []).length) err(file, `curriculum: step ${i + 1} names no record`);
    });
  }
  return issues;
}

export function validateAll(extra: { entity: any; file: string }[] = []): { issues: Issue[]; entityCount: number; proseCount: number } {
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
  const loaded = [...loadEntities(), ...extra];
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
  for (const id of stubIds) if (known.has(id)) warn(p("data", "_stubs.yaml"), `${id} is now written; remove it from the stub list (data/_stubs.yaml or data/_stubs.d/)`);
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

    // Arabic first (docs/language.md): label.ar and summary.ar are required; English is optional until Phase 4.
    // Sources are exempt: a bibliographic entry is titled in the language of the work, not translated.
    if (entity.class !== "source") {
      if (!entity.label?.ar) err(file, "label.ar is required (Arabic is the primary language, docs/language.md)");
      if (!entity.summary?.ar) err(file, "summary.ar is required (Arabic is the primary language, docs/language.md)");
    }

    // honorifics are rendered by the UI: never typed into any label, summary or note (passages hold scripture/hadith text verbatim and are exempt)
    if (entity.class !== "passage") for (const [path, s] of textFields(entity)) if (HONORIFIC.test(s)) err(file, `${path}: honorifics must not be typed (the UI renders them)`);

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
    for (const c of entity.chain ?? []) if (!resolves(c)) err(file, `chain: ${c} does not exist`);
    for (const f of ["hero"]) {
      const v = entity.media?.[f];
      if (v && !known.has(v)) err(file, `media.${f}: ${v} does not exist`);
    }
    for (const t of entity.perspectives ?? []) for (const s of t.sources ?? []) if (!known.has(s)) err(file, `perspective source ${s} does not exist`);
    // traditions[] counts a person as a member of a tradition (docs/agents/content-standards.md 13b): a recorded faith with no Muslim value contradicts a Sunni tag
    if (entity.class === "person" && (entity.traditions ?? []).some((t: string) => String(t).startsWith("sunni")) && (entity.faith ?? []).length > 0) {
      const muslim = (v: string) => /^(sunni|shia|ibadi|sufi|ahmadiyya|quranist)/.test(String(v));
      if (!(entity.faith as any[]).some((f) => muslim(f.value))) warn(file, "traditions lists a Sunni tradition but the recorded faith has no Muslim value: a person who was not Muslim is not counted among a tradition");
    }
    // opinions (docs/plan/20-opinions.md): ids unique, holders and evidence resolve, a disagreement states its issue, every opinion cites a source
    if (entity.perspectives?.length) {
      const seenIds = new Set<string>();
      entity.perspectives.forEach((t: any, i: number) => {
        if (t.id) { if (seenIds.has(t.id)) err(file, `perspectives[${i}]: duplicate id "${t.id}"`); seenIds.add(t.id); }
        for (const h of t.holders ?? []) if (!resolves(h)) err(file, `perspectives[${i}].holders: ${h} does not exist`);
        for (const e of t.evidence ?? []) if (!resolves(e.ref)) err(file, `perspectives[${i}].evidence: ${e.ref} does not exist`);
        if (!(t.sources ?? []).length) warn(file, `perspectives[${i}] (${t.tradition}) cites no source: every opinion is cited`);
      });
      entity.perspectives.forEach((t: any, i: number) => {
        if (t.standing === "main" && !String(t.tradition).startsWith("sunni")) err(file, `perspectives[${i}]: standing "main" is for Sunni opinions; "${t.tradition}" is a secondary or other opinion (docs/scope.md)`);
        if (i === 0 && (t.standing === "secondary" || t.standing === "other")) err(file, `perspectives[0] is the lead opinion and cannot be tagged ${t.standing}`);
      });
      if (entity.perspectives.length >= 2 && !entity.issue) warn(file, "two or more opinions but no `issue`: state the question the opinions answer");
    }

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


    // ---- references inside structured fields (story roles, sides, tensions, locations ...)
    const REF_KEYS = new Set(["toward", "participants", "commanders", "passages", "part_of", "parent_period", "parent_concept", "publisher", "broadcaster",
      "founder", "headquarters", "predecessor", "successor", "patron", "architect", "location", "place", "maker", "made_in", "modern_country", "work", "language", "authors", "languages", "defining_events", "related",
      "host", "occasion", "moderator", "co_speakers", "who", "by",
      "job", "under", "trained_under", "polity", "broader", "successor_jobs", "bodies", "tools", "workplaces", "outputs", "pir", "practice"]);
    const walkRefs = (node: any, path: string) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) { node.forEach((x, i) => walkRefs(x, `${path}[${i}]`)); return; }
      for (const [k, val] of Object.entries<any>(node)) {
        if (k === "relations") continue; // handled above with predicate rules
        const vals = Array.isArray(val) ? val : [val];
        if (REF_KEYS.has(k)) for (const x of vals) if (typeof x === "string" && REF.test(x) && !resolves(x)) err(file, `${path ? path + "." : ""}${k}: ${x} does not exist; add the entity or declare it in data/_stubs.yaml`);
        walkRefs(val, path ? `${path}.${k}` : k);
      }
    };
    walkRefs(entity, "");

    // ---- job blocks (docs/jobs/schema.md): every cited source exists; targets are of the class their key names; the craft block is present exactly when hirfa is set
    const clsOf = (id: string) => String(id).split("/")[0];
    if (entity.class === "job") {
      if (entity.hirfa && !entity.craft) err(file, "hirfa: true needs a craft block (docs/jobs/schema.md section 1a)");
      if (!entity.hirfa && entity.craft) err(file, "craft block without hirfa: true");
    }
    for (const [i, o] of ((entity.occupations ?? []) as any[]).entries()) {
      const w = `occupations[${i}]`;
      for (const s of o.sources ?? []) if (!known.has(s)) err(file, `${w}: source ${s} does not exist`);
      if (o.job && clsOf(o.job) !== "job") err(file, `${w}.job: ${o.job} is not a job`);
      if (o.under && clsOf(o.under) !== "person") err(file, `${w}.under: ${o.under} is not a person`);
      if (o.place && clsOf(o.place) !== "place") err(file, `${w}.place: ${o.place} is not a place`);
      if (o.polity && clsOf(o.polity) !== "polity") err(file, `${w}.polity: ${o.polity} is not a polity`);
      for (const t of o.trained_under ?? []) if (clsOf(t) !== "person") err(file, `${w}.trained_under: ${t} is not a person`);
    }
    for (const [i, j] of ((entity.jobs ?? []) as any[]).entries()) {
      const w = `jobs[${i}]`;
      for (const s of j.sources ?? []) if (!known.has(s)) err(file, `${w}: source ${s} does not exist`);
      if (j.job && clsOf(j.job) !== "job") err(file, `${w}.job: ${j.job} is not a job`);
    }

    // ---- provenance layer (docs/sources-policy.md, founder's rule of 15 Oct 2026): the layer records where a thing came
    // from and no longer decides whether it may enter data/. Any source may be read and rewritten with a citation; a layer
    // other than the open ones must therefore cite the source it was rewritten from.
    const layer = entity.provenance?.layer;
    if (layer && !KNOWN_LAYERS.has(layer)) warn(file, `provenance.layer "${layer}" is not a known layer (${[...KNOWN_LAYERS].join(", ")}; see docs/plan/15 §3)`);
    if (layer && !["cc0", "by"].includes(layer) && own.size === 0) err(file, `provenance.layer ${layer} requires cited sources (docs/sources-policy.md §3)`);

    // ---- conflicts must show both sides (docs/plan/13 and 14): warn when a conflict has fewer than two sides
    if (entity.class === "event" && CONFLICT_KINDS.has(entity.kind) && (entity.sides?.length ?? 0) < 2) {
      warn(file, `${entity.kind} lists ${entity.sides?.length ?? 0} sides; conflicts must show both sides (sides[] with at least two)`);
    }

    // ---- tension cards need at least two cited voices (docs/plan/14 §4)
    for (const [i, t] of (entity.tensions ?? []).entries()) {
      const voices = [...(t.raised_by ?? []), ...(t.responses ?? [])].filter((x: any) => (x.sources ?? []).length > 0);
      if (voices.length < 2) err(file, `tensions[${i}] (${t.id}): needs at least two cited voices, has ${voices.length}`);
      for (const s of voices.flatMap((x: any) => x.sources ?? [])) if (!known.has(s)) err(file, `tensions[${i}]: source ${s} does not exist`);
    }



    // ---- scope rule (docs/scope.md): Sunni first and default; order Sunni, then academic, then any other view; every entry labelled
    if (entity.perspectives?.length) {
      const rank = (t: string) => (t.startsWith("sunni") ? 0 : t === "academic" ? 1 : 2);
      const ps: any[] = entity.perspectives;
      if (rank(ps[0].tradition) !== 0) err(file, `perspectives must start with a Sunni entry (sunni or sunni-*); the first entry is "${ps[0].tradition}" (docs/scope.md)`);
      for (let i = 1; i < ps.length; i++) if (rank(ps[i].tradition) < rank(ps[i - 1].tradition)) err(file, `perspectives[${i}] "${ps[i].tradition}" is out of order: Sunni entries first, then academic, then any other view (docs/scope.md)`);
      ps.forEach((x, i) => { if (!x.tradition) err(file, `perspectives[${i}] has no tradition label: every view is labelled`); });
    }

    // ---- map blocks (docs/plan/16): every feature needs a source; schematic positions are flagged; sides must exist
    if (entity.class === "event" && entity.map) {
      const m = entity.map;
      (m.features ?? []).forEach((f: any, i: number) => {
        if (!f.source) err(file, `map.features[${i}] (${f.role}) has no source: no map feature without a source`);
        else if (!known.has(f.source)) err(file, `map.features[${i}]: source ${f.source} does not exist`);
        if (f.side !== undefined && f.side >= (entity.sides?.length ?? 0)) err(file, `map.features[${i}]: side ${f.side} is not in sides[] (${entity.sides?.length ?? 0} listed)`);
        if (f.type === "point" && !f.at) err(file, `map.features[${i}]: a point needs at`);
        if (f.type === "line" && !(f.path || (f.from && f.to))) err(file, `map.features[${i}]: a line needs path or from and to`);
        if (f.type === "polygon" && !f.geometry) err(file, `map.features[${i}]: a polygon needs geometry`);
        if (f.geometry && !existsSync(p(f.geometry))) err(file, `map.features[${i}]: geometry file ${f.geometry} is missing`);
      });
      for (const s of m.sources ?? []) if (!known.has(s)) err(file, `map.sources: ${s} does not exist`);
      if (!m.center && !(entity.relations ?? []).some((r: any) => ["occurred_at", "site_of"].includes(r.type))) err(file, "map needs a center or an occurred_at place");
    }
    if (entity.class === "event" && SPATIAL_KINDS.has(entity.kind)) {
      const placed = (entity.relations ?? []).filter((r: any) => ["occurred_at", "site_of"].includes(r.type)).map((r: any) => r.target);
      const hasCoords = entity.map?.center || placed.some((t: string) => loaded.find((x) => x.entity?.id === t)?.entity.coordinates);
      if (!hasCoords) warn(file, `${entity.kind} has no coordinates (a place with coordinates or map.center) so no map can be drawn`);
    }
    if (entity.class === "media" && entity.kind !== "map" && entity.kind !== "illustration" && !entity.generated && !entity.attribution) err(file, "attribution is required for media that is not generated");

    if (entity.class === "media" && entity.files) {
      for (const [k, f] of Object.entries<string>(entity.files)) if (f.startsWith("media/") && !existsSync(p("site", "public", f))) warn(file, `files.${k}: ${f} is not in site/public/ (media files live in the media repo; the page omits the image until they are present)`);
    }
    if (entity.media?.map && !(known.has(entity.media.map) && classOf(entity.media.map) === "media")) err(file, `media.map: ${entity.media.map} is not an existing media entity`);

    // ---- screen index rules (docs/plan/12)
    if (entity.class === "screen") {
      if (!(entity.relations ?? []).some((r: any) => ["about", "set_in", "subject_of", "setting_of"].includes(r.type))) warn(file, "no about/set_in edge: listed, not yet indexed");
      for (const [i, r] of (entity.reception ?? []).entries()) if (!(r.sources ?? []).length) warn(file, `reception[${i}] (${r.kind}) has no sources`);
      if (entity.approach === "polemical" && entity.sensitivity !== "polemical") err(file, "approach polemical requires sensitivity: polemical");
      if (entity.sensitivity === "polemical" && (entity.watch ?? []).length) err(file, "polemical works are described and cited, never linked for viewing: remove watch[]");
      if (entity.depiction?.prophet === "face") err(file, "a depiction showing a prophet's face is described in words only and must not carry watch links or images");
    }
    if (entity.sensitivity === "polemical" && entity.class === "media") err(file, "polemical material is never reproduced as media");

    // ---- khutab and durus (docs/plan/25): a sermon or lesson records its speaker; a ruler's role beyond "contemporary"
    // needs a citation; lessons in a series carry an order; YouTube is a pointer, never a media store
    if (entity.class === "work" && ["sermon", "lecture"].includes(entity.kind)) {
      if (!entity.delivered?.by) err(file, `kind ${entity.kind} needs delivered.by: every sermon or lesson records its speaker`);
      if (entity.composed && !entity.delivery_date_status) warn(file, "set delivery_date_status: an upload or broadcast date is never shown as the delivery date");
      (entity.ruler_at_time ?? []).forEach((r: any, i: number) => {
        if (r.role !== "contemporary" && !(r.sources ?? []).length) err(file, `ruler_at_time[${i}]: role "${r.role}" needs a citation (only "contemporary" may be derived)`);
      });
      const seriesTarget = (entity.relations ?? []).find((r: any) => r.type === "part_of" && loaded.some((x) => x.entity?.id === r.target && x.entity?.kind === "lecture-series"));
      if (seriesTarget && !Number.isInteger(entity.order)) err(file, `a lesson part_of a lecture-series (${seriesTarget.target}) needs an order number`);
    }
    if (entity.class === "media") {
      const urls = [entity.url, ...Object.values<string>(entity.files ?? {})].filter(Boolean);
      for (const u of urls) if (/youtube\.com|youtu\.be/.test(u)) err(file, "YouTube is metadata and link only: it is never a media store entry (docs/plan/25; audio-video-harvest.md §2)");
    }

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
      for (const lang of PUBLISHED_LANGS) if (!entity.alt?.[lang]) err(file, `alt text missing for "${lang}" (required in every language we publish)`);
    }
    if (entity.class === "media" && entity.sensitivity === "figurative-prophet") err(file, "figurative depictions of prophets are never displayed; describe in text instead");
  }


  // ---- the Qur'an text is frozen (docs/plan/15 §6.3): every passage/quran-* must equal the committed Tanzil file, character for character
  const quran = loaded.find((x) => x.entity?.id === "work/quran");
  if (quran) {
    const ts = quran.entity.text_source;
    const files: Record<string, string[]> = {};
    for (const f of ts?.files ?? []) {
      const path = p(f.path);
      if (!existsSync(path)) { err(quran.file, `text_source file ${f.path} is missing`); continue; }
      const buf = readFileSync(path);
      if (createHash("sha256").update(buf).digest("hex") !== f.sha256) err(quran.file, `${f.path} no longer matches its frozen sha256: the Tanzil source must never be edited`);
      const m = new Map<string, string>();
      for (const line of buf.toString("utf8").split(/\r?\n/)) { if (!line || line.startsWith("#")) continue; const [s, a, ...t] = line.split("|"); m.set(`${s}:${a}`, t.join("|")); }
      files[f.use] = [...m.entries()].flat();
      (files as any)[`map:${f.use}`] = m;
    }
    const mt: Map<string, string> | undefined = (files as any)["map:text"], ms: Map<string, string> | undefined = (files as any)["map:text_search"];
    let ayat = 0, suras = 0;
    for (const { entity: e, file } of loaded) {
      if (e?.class !== "passage" || e.work !== "work/quran") continue;
      if (e.unit === "sura") { suras++; continue; }
      ayat++;
      const frozenProblem = frozenQuranTextProblem(e.ref, e.text, mt);
      if (frozenProblem) err(file, frozenProblem);
      if (ms && ms.get(e.ref) !== e.text_search) err(file, `text_search of ${e.ref} differs from the frozen Tanzil Simple Clean file`);
      if (e.provenance?.layer !== "by") err(file, "Qur'an passages must carry provenance.layer: by (Tanzil attribution)");
    }
    if (mt && (ayat !== 6236 || suras !== 114 || mt.size !== 6236)) err(quran.file, `expected 114 suras and 6,236 ayat, found ${suras} and ${ayat}`);
  }

  // ---- prose
  // content/ holds prose only: a data file saved there is silently never rendered (found in the wild: a .yaml under content/ar/event/)
  for (const d of readdirSync(p("content"), { recursive: true, withFileTypes: true }) as any[]) {
    if (d.isFile() && !d.name.endsWith(".md") && !d.name.startsWith(".")) err(rel(join(d.parentPath ?? d.path, d.name)), "content/ holds .md prose only (data belongs in data/<class>/<slug>.yaml)");
  }
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
    if (HONORIFIC.test(pr.body)) err(pr.file, "honorifics must not be typed into prose (the UI renders them)");
    if (/[﴿﴾]/.test(pr.body)) err(pr.file, "Qur'an text must never be typed into prose: link the ayah as [[passage/quran-<sura>-<aya>|label]] (docs/plan/09 rule 10)");

    // scope rule in prose: a perspectives block must start with a Sunni entry, and non-Sunni doctrine must be labelled before it is stated
    for (const blk of pr.body.matchAll(/^:::perspectives\n([\s\S]*?)\n:::/gm)) {
      const labels = [...blk[1].matchAll(/^- \*\*(.+?)\*\*:/gm)].map((m) => m[1].toLowerCase());
      if (labels.length && !(labels[0].startsWith("sunni") || labels[0].includes("أهل السنة") || labels[0].startsWith("سني"))) err(pr.file, "the perspectives block must start with the Sunni entry (docs/scope.md)");
    }
    const NON_SUNNI = /(Twelver|Shia|Shi'a|Shi‘a|Ismaili|Ibadi|Ahmadi(?:yya)?|Quranist|Zaydi|الشيعة|الإسماعيلية|الإباضية|الأحمدية|القرآنيون|الزيدية)/;
    const VERB = /\b(hold|holds|believe|believes|teach|teaches|regard|regards|maintain|maintains|designated|consider|considers)\b|(يرى|يرون|يعتقد|يعتقدون|تعتقد|ترى|يؤمن|يؤمنون)/;
    for (const sentence of pr.body.replace(/:::perspectives[\s\S]*?\n:::/g, "").split(/(?<=[.!?؟])\s+/)) {
      const n = sentence.match(NON_SUNNI), vb = sentence.match(VERB);
      if (n && vb && vb.index! < n.index!) warn(pr.file, `non-Sunni view stated before its label: "${sentence.slice(0, 80)}…" (name the community first, docs/scope.md)`);
    }
    if (!/^## /m.test(pr.body)) warn(pr.file, "no section headings");
  }
  for (const i of checkLeveledReading(prose, loaded)) issues.push(i);
  for (const i of checkCurriculum(loaded)) issues.push(i);
  for (const { entity, file } of loaded) {
    if (["person", "event"].includes(entity.class) && !seen.has(`ar:${entity.id}`) && entity.status?.completeness >= 2) {
      warn(file, "completeness >= 2 but no Arabic prose in content/ar/");
    }
  }

  // Content lint (build-time): no replacement characters, no placeholder digits in dates, no garbled era marks.
  // "062X" (an EDTF decade) is a legitimate unspecified digit; an X after a hyphen (a month or day) is a placeholder.
  const PLACEHOLDER_DATE = /-\d*X/;
  for (const { entity, file } of loaded) {
    for (const [path, s] of textFields(entity)) {
      if (s.includes("\uFFFD")) err(file, `${path}: contains U+FFFD (replacement character): the text was corrupted`);
      if (s.includes("ق.م هـ")) err(file, `${path}: "ق.م هـ" is garbled; the BCE Hijri form is "ق.هـ"`);
    }
    for (const [path, d] of walkDates(entity)) {
      for (const v of [d.edtf, d.hijri]) if (typeof v === "string" && PLACEHOLDER_DATE.test(v)) err(file, `${path}: date "${v}" has a placeholder digit; use the intended date or an approximation (~)`);
    }
  }
  for (const pr of prose) {
    if (pr.body.includes("\uFFFD")) err(pr.file, "prose contains U+FFFD (replacement character)");
    if (pr.body.includes("ق.م هـ")) err(pr.file, `prose contains "ق.م هـ"; the BCE Hijri form is "ق.هـ"`);
  }

  // Near-duplicate titles across entity types: the same label under two ids is usually one thing entered twice (docs: merge, keep the other id as an alias).
  const titleKey = (s: string) => s.normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const homonymsFile = p("data", "_homonyms.yaml");
  const homonyms = new Set<string>(existsSync(homonymsFile) ? ((readYaml(homonymsFile) ?? {}).namesakes ?? []).flat() : []);
  const byTitle = new Map<string, { id: string; cls: string; file: string }[]>();
  for (const { entity, file } of loaded) {
    const t = entity.label?.ar ? titleKey(entity.label.ar) : "";
    if (!t) continue;
    byTitle.set(t, [...(byTitle.get(t) ?? []), { id: entity.id, cls: entity.class, file }]);
  }
  for (const [t, group] of byTitle) {
    const classes = new Set(group.map((g) => g.cls));
    // A place and an event can share a name (the pool and the proclamation at it), so this is a review warning, not a failure.
    if (group.length > 1 && classes.size > 1) warn(group[0].file, `title "${t}" is used by ${group.map((g) => g.id).join(", ")}: if it is one thing, merge it (keep one id, list the other under aliases)`);
    // Two people under one Arabic name are one person entered twice unless data/_homonyms.yaml says they are namesakes.
    const people = group.filter((g) => g.cls === "person");
    if (people.length > 1 && !people.every((g) => homonyms.has(g.id))) err(people[1].file, `person "${t}" exists twice: ${people.map((g) => g.id).join(", ")}. Merge them (keep one id, list the other under aliases) or list both ids in data/_homonyms.yaml if they are different people`);
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
