// Checks the authenticity register (scripts/harvest/library/authenticity.yaml) against the gate rules in
// docs/delegation/authenticity-policy-proposal.md. Errors break the build; missing decisions only warn, so the
// gate does not block work that predates it. Run: npm run check:authenticity [-- --strict]
import { existsSync, readFileSync } from "node:fs";
import { p, readYaml } from "./lib.js";

export interface Issue { level: "error" | "warn"; where: string; msg: string }

export const DECISIONS = new Set(["accept", "label", "reject"]);
export const SCHOOLS = new Set(["sunni", "shia", "mutazili", "ibadi", "other", "unverified"]);
export const TIERS = new Set(["T1", "T2", "T3", "T4", "T5"]);
export const SOURCE_STATUSES = new Set(["reference-scoped", "reference-edition-dependent", "not-verified", "blocked"]);
// What a source may be used for: pointer (locate a book), grades (attributed verdicts), facts (dates, names), text (quoted matter)
export const USES = new Set(["pointer", "grades", "facts", "text"]);
// website: a site as a carrier; the items it holds are the other kinds
export const KINDS = new Set(["website", "book", "catalogue", "article", "thesis", "whitepaper", "research-paper", "artefact", "image", "video", "audio"]);
// media: images, video, audio and artefacts need a whitelisted licence, a carrier, and explicit answers on depiction and AI generation
export const MEDIA = new Set(["image", "video", "audio", "artefact"]);
export function mediaLicences(): Set<string> {
  const list = readYaml<{ id: string }[]>(p("schema", "enums", "licenses.yaml"));
  return new Set(list.map((l) => l.id));
}
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Pure rule check on a parsed register; returns the issues found. */
export function checkRegister(reg: any, canonIds: Set<string>): Issue[] {
  const out: Issue[] = [];
  const err = (where: string, msg: string) => out.push({ level: "error", where, msg });
  const warn = (where: string, msg: string) => out.push({ level: "warn", where, msg });
  if (!reg || typeof reg !== "object") return [{ level: "error", where: "register", msg: "file is empty or not a mapping" }];
  if (!DATE.test(String(reg.gate_date ?? ""))) err("register", "gate_date must be YYYY-MM-DD");

  const seen = new Set<string>();
  for (const d of reg.decisions ?? []) {
    const w = `decision ${d.id ?? "(no id)"}`;
    if (!d.id) { err(w, "missing id"); continue; }
    if (seen.has(d.id)) err(w, "duplicate id"); seen.add(d.id);
    if (!DECISIONS.has(d.decision)) err(w, `decision must be accept, label or reject, got ${JSON.stringify(d.decision)}`);
    if (!d.decided_by) err(w, "decided_by is required (a person who made the call)");
    if (!DATE.test(String(d.decided_on ?? ""))) err(w, "decided_on must be YYYY-MM-DD");
    if (d.kind === "book" && !canonIds.has(d.id) && d.decision !== "reject") {
      warn(w, "id is not in scripts/harvest/library/books.yaml");
    }
    if (!SCHOOLS.has(d.school)) err(w, `school must be one of ${[...SCHOOLS].join(", ")}`);

    if (d.decision === "accept") {
      if (d.school !== "sunni") err(w, "accept requires school sunni");
      if (!Array.isArray(d.school_evidence) || d.school_evidence.length < 1) err(w, "accept requires at least one school_evidence entry");
      if (!d.authenticity_basis) err(w, "accept requires authenticity_basis (edition, provenance or primary record)");
      // the harvest matches candidates against this rule; without it the harvest would download anything with a matching title
      const ne = d.named_edition;
      if (!ne || !Array.isArray(ne.publisher_any) || ne.publisher_any.length === 0 || !Array.isArray(ne.editor_any) || ne.editor_any.length === 0) err(w, "accept requires named_edition with publisher_any and editor_any (non-empty lists)");
    }
    if (d.decision === "label") {
      if (d.school === "sunni") err(w, "label is for non-Sunni or unverified schools; a Sunni verified item is accepted");
      if (!d.reason) err(w, "label requires a reason");
    }
    if (d.decision === "reject") {
      if (!d.reason) err(w, "reject requires a reason");
    }

    if (MEDIA.has(d.kind) && d.decision !== "reject") {
      const lic = mediaLicences();
      if (!d.licence || !lic.has(d.licence)) err(w, `media needs a licence from schema/enums/licenses.yaml, got ${JSON.stringify(d.licence)}`);
      if (!d.carrier) err(w, "media needs a carrier (the site or archive it came from)");
      if (typeof d.religious_figure_depicted !== "boolean") err(w, "media must declare religious_figure_depicted: true or false");
      if (d.religious_figure_depicted === true) err(w, "no figurative depiction of a prophet or Companion (AGENTS.md); reject this item");
      if (typeof d.ai_generated !== "boolean") err(w, "media must declare ai_generated: true or false");
      if (d.ai_generated === true && d.portrait !== false) err(w, "AI-generated media must declare portrait: false (no AI-generated portraits)");
      if (d.ai_generated === true && d.portrait === true) err(w, "no AI-generated portraits");
    }
  }

  const srcSeen = new Set<string>();
  for (const s of reg.sources ?? []) {
    const w = `source ${s.id ?? "(no id)"}`;
    if (!s.id) { err(w, "missing id"); continue; }
    if (srcSeen.has(s.id)) err(w, "duplicate id"); srcSeen.add(s.id);
    if (!TIERS.has(s.tier)) err(w, `tier must be T1 to T5, got ${JSON.stringify(s.tier)}`);
    if (!SOURCE_STATUSES.has(s.status)) err(w, `status must be one of ${[...SOURCE_STATUSES].join(", ")}`);
    if (!s.url) err(w, "url is required");
    if (!s.evidence) err(w, "evidence is required");
    if (!DATE.test(String(s.checked_on ?? ""))) err(w, "checked_on must be YYYY-MM-DD");
    if (s.tier === "T5" && s.status.startsWith("reference")) err(w, "a T5 source cannot have a reference status (leads only)");
    if (!KINDS.has(s.kind)) err(w, `kind must be website, book or catalogue, got ${JSON.stringify(s.kind)}`);
    if (s.kind === "website" && !DATE.test(String(s.retrieved_on ?? ""))) err(w, "a website source needs retrieved_on (YYYY-MM-DD)");
    const uses: string[] = Array.isArray(s.allowed_uses) ? s.allowed_uses : [];
    for (const u of uses) if (!USES.has(u)) err(w, `allowed_uses has unknown use ${JSON.stringify(u)}`);
    // a T5 site, or one not verified, may only be used to point to a book
    if ((s.tier === "T5" || s.status === "not-verified") && uses.some((u) => u !== "pointer")) err(w, "a T5 or not-verified source may only be used as a pointer");
    // quoted matter needs a T1 source, or a valid sample of 30 or more rows checked against a named edition
    // a recorded founder override (founder_override.text: true, with decided_by, date and reason) stands in for the sample when the founder authorises text use
    const founderText = s.founder_override?.text === true && s.founder_override?.decided_by === "founder" && DATE.test(String(s.founder_override?.date ?? "")) && typeof s.founder_override?.reason === "string" && s.founder_override.reason.length > 0;
    if (uses.includes("text") && s.tier !== "T1" && !founderText && !(s.samples?.size >= 30 && s.samples?.valid === true && s.samples?.edition)) err(w, "text use needs a T1 source, a valid sample of 30 or more rows against a named edition, or a recorded founder override");
  }

  const blocked = new Set((reg.blocklist ?? []).map(String));
  for (const s of reg.sources ?? []) {
    if (blocked.has(s.id) && s.status !== "blocked") err(`source ${s.id}`, "listed on the blocklist: status must be blocked");
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = p("scripts", "harvest", "library", "authenticity.yaml");
  const books = readYaml<{ books: { id: string }[] }>(p("scripts", "harvest", "library", "books.yaml")).books;
  const canon = new Set(books.map((b) => b.id));
  const reg = existsSync(file) ? readYaml(file) : null;
  const issues = checkRegister(reg, canon);
  const strict = process.argv.includes("--strict");

  // Canon entries without a decision: counted, not blocking (they predate the gate).
  const decided = new Set((reg?.decisions ?? []).map((d: any) => d.id));
  const undecided = [...canon].filter((id) => !decided.has(id));
  issues.push({ level: "warn", where: "canon", msg: `${undecided.length} of ${canon.size} canon books have no decision record yet (not blocking)` });

  for (const i of issues) console.log(`${i.level.padEnd(5)} ${i.where}: ${i.msg}`);
  const errors = issues.filter((i) => i.level === "error").length;
  const warns = issues.length - errors;
  console.log(`authenticity: ${errors} error(s), ${warns} warning(s)`);
  if (errors > 0 || (strict && warns > 0)) process.exit(1);
}
