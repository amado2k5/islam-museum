// The cross-record contradiction detectors (statement 5). Read-only: this file finds; it never fixes.
// A contradiction here is two records (or two fields) that cannot both be right as written. Each finding has a stable
// key, so the register (docs/fable-run/contradictions/register.json) can account for every one of them.
//
// Detectors
//   A  life-and-event   a person takes part in an event dated after the person's death or before the person's birth;
//                       a dated event or building is placed in the reign of a person who was dead or not yet born.
//   B  life-and-life    a child born more than a year after a parent's death or before the parent's birth; a student whose
//                       teacher died before the student was born; spouses whose lives do not overlap.
//   C  direction        the same one-way relation written in both directions between two records; a cycle in a relation
//                       that must be a hierarchy (child_of, part_of, located_in, successor_of); two relations between the
//                       same pair that exclude each other (child and sibling, child and spouse).
//   D  prose-and-field  a record's prose gives, in a parenthesis straight after a link to another record, a death year or
//                       a life span for that person that disagrees with the dates in that person's own record.
// Dates are compared as ranges (scripts/lib.ts dateRange), with a tolerance of one year for calendar conversion.
import { readFileSync } from "node:fs";
import { dateRange, p } from "../lib.js";

export interface Finding { key: string; detector: "A" | "B" | "C" | "D"; kind: string; records: string[]; evidence: string }
const TOL = 1.0;
const EVENT_ROLES = new Set(["participated_in", "attended", "convened", "organized", "signed", "deserted"]);
const ONE_WAY = new Set(["child_of", "successor_of", "part_of", "located_in", "capital_of", "commentary_on", "translation_of", "caused", "split_from", "merged_into", "built_on", "version_of", "episode_of", "adaptation_of", "revised_by", "codified_in", "founder_of", "authored", "student_of"]);
const HIERARCHY = ["child_of", "part_of", "located_in", "successor_of"];

export function detect(graphFile = p(".cache", "graph.json")): { commit: string | null; findings: Finding[] } {
  const g = JSON.parse(readFileSync(graphFile, "utf8"));
  const byId = new Map<string, any>(g.nodes.map((n: any) => [n.id, n]));
  const out = new Map<string, Finding>();
  const add = (f: Finding) => { if (!out.has(f.key)) out.set(f.key, f); };
  const R = (d: any) => { try { return d ? dateRange(d) : undefined; } catch { return undefined; } };
  const show = (d: any) => (d ? `${d.edtf ?? "?"}${d.hijri ? ` (AH ${d.hijri})` : ""}` : "none");
  const life = (id: string) => { const n = byId.get(id); return n?.class === "person" ? { born: R(n.data.born), died: R(n.data.died), n } : undefined; };
  const when = (id: string) => {
    const n = byId.get(id); if (!n) return undefined;
    const d = n.class === "event" ? n.data.date?.start : n.class === "building" ? n.data.built : n.class === "work" ? n.data.composed : undefined;
    const e = n.class === "event" ? (n.data.date?.end ?? n.data.date?.start) : d;
    const a = R(d), b = R(e);
    return a ? { earliest: a.earliest, latest: (b ?? a).latest, d } : undefined;
  };
  const forward = g.edges.filter((e: any) => !e.inverse);

  // ---- A: life-and-event ----
  for (const e of forward) {
    if (EVENT_ROLES.has(e.type)) {
      const L = life(e.from), W = when(e.to);
      if (!L || !W || byId.get(e.to)?.class !== "event") continue;
      if (L.died && W.earliest > L.died.latest + TOL) add({ key: `A|after-death|${e.from}|${e.type}|${e.to}`, detector: "A", kind: "takes part in an event after death", records: [e.from, e.to], evidence: `${e.from} died ${show(L.n.data.died)}; ${e.to} is dated ${show(W.d)}; relation ${e.type}` });
      if (L.born && W.latest < L.born.earliest - TOL) add({ key: `A|before-birth|${e.from}|${e.type}|${e.to}`, detector: "A", kind: "takes part in an event before birth", records: [e.from, e.to], evidence: `${e.from} born ${show(L.n.data.born)}; ${e.to} is dated ${show(W.d)}; relation ${e.type}` });
    }
    if (e.type === "during_reign") {
      const L = life(e.to), W = when(e.from);
      if (!L || !W) continue;
      if (L.died && W.earliest > L.died.latest + TOL) add({ key: `A|reign-after-death|${e.from}|${e.to}`, detector: "A", kind: "placed in the reign of a ruler already dead", records: [e.from, e.to], evidence: `${e.from} is dated ${show(W.d)}; ${e.to} died ${show(L.n.data.died)}` });
      if (L.born && W.latest < L.born.earliest - TOL) add({ key: `A|reign-before-birth|${e.from}|${e.to}`, detector: "A", kind: "placed in the reign of a ruler not yet born", records: [e.from, e.to], evidence: `${e.from} is dated ${show(W.d)}; ${e.to} born ${show(L.n.data.born)}` });
    }
  }

  // ---- B: life-and-life ----
  for (const e of forward) {
    const a = life(e.from), b = life(e.to);
    if (!a || !b) continue;
    if (e.type === "child_of") {
      if (a.born && b.died && a.born.earliest > b.died.latest + TOL) add({ key: `B|born-after-parent-died|${e.from}|${e.to}`, detector: "B", kind: "child born more than a year after the parent's death", records: [e.from, e.to], evidence: `${e.from} born ${show(a.n.data.born)}; parent ${e.to} died ${show(b.n.data.died)}` });
      if (a.born && b.born && a.born.latest < b.born.earliest - TOL) add({ key: `B|child-older-than-parent|${e.from}|${e.to}`, detector: "B", kind: "child born before the parent", records: [e.from, e.to], evidence: `${e.from} born ${show(a.n.data.born)}; parent ${e.to} born ${show(b.n.data.born)}` });
      if (a.died && b.born && a.died.latest < b.born.earliest - TOL) add({ key: `B|child-died-before-parent-born|${e.from}|${e.to}`, detector: "B", kind: "child died before the parent was born", records: [e.from, e.to], evidence: `${e.from} died ${show(a.n.data.died)}; parent ${e.to} born ${show(b.n.data.born)}` });
    }
    if (e.type === "student_of") {
      if (a.born && b.died && a.born.earliest > b.died.latest + TOL) add({ key: `B|teacher-dead-before-student-born|${e.from}|${e.to}`, detector: "B", kind: "teacher died before the student was born", records: [e.from, e.to], evidence: `student ${e.from} born ${show(a.n.data.born)}; teacher ${e.to} died ${show(b.n.data.died)}` });
      if (a.died && b.born && a.died.latest < b.born.earliest - TOL) add({ key: `B|student-dead-before-teacher-born|${e.from}|${e.to}`, detector: "B", kind: "student died before the teacher was born", records: [e.from, e.to], evidence: `student ${e.from} died ${show(a.n.data.died)}; teacher ${e.to} born ${show(b.n.data.born)}` });
    }
    if (e.type === "spouse_of" && e.from < e.to) {
      if ((a.born && b.died && a.born.earliest > b.died.latest + TOL) || (b.born && a.died && b.born.earliest > a.died.latest + TOL)) add({ key: `B|spouses-never-alive-together|${e.from}|${e.to}`, detector: "B", kind: "spouses whose lives do not overlap", records: [e.from, e.to], evidence: `${e.from}: ${show(a.n.data.born)} to ${show(a.n.data.died)}; ${e.to}: ${show(b.n.data.born)} to ${show(b.n.data.died)}` });
    }
  }

  // ---- C: direction ----
  const has = new Set<string>(forward.map((e: any) => `${e.type}|${e.from}|${e.to}`));
  for (const e of forward) {
    if (ONE_WAY.has(e.type) && e.from < e.to && has.has(`${e.type}|${e.to}|${e.from}`)) add({ key: `C|both-ways|${e.type}|${e.from}|${e.to}`, detector: "C", kind: `${e.type} written in both directions`, records: [e.from, e.to], evidence: `${e.from} ${e.type} ${e.to}, and ${e.to} ${e.type} ${e.from}` });
    if (e.type === "child_of") {
      const [x, y] = e.from < e.to ? [e.from, e.to] : [e.to, e.from];
      if (has.has(`sibling_of|${e.from}|${e.to}`) || has.has(`sibling_of|${e.to}|${e.from}`)) add({ key: `C|child-and-sibling|${x}|${y}`, detector: "C", kind: "the same two people are parent and child, and siblings", records: [e.from, e.to], evidence: `${e.from} child_of ${e.to}, and sibling_of between the same two` });
      if (has.has(`spouse_of|${e.from}|${e.to}`) || has.has(`spouse_of|${e.to}|${e.from}`)) add({ key: `C|child-and-spouse|${x}|${y}`, detector: "C", kind: "the same two people are parent and child, and spouses", records: [e.from, e.to], evidence: `${e.from} child_of ${e.to}, and spouse_of between the same two` });
    }
  }
  for (const type of HIERARCHY) {
    const next = new Map<string, string[]>();
    for (const e of forward) if (e.type === type) next.set(e.from, [...(next.get(e.from) ?? []), e.to]);
    const state = new Map<string, number>();
    const stack: string[] = [];
    const visit = (u: string) => {
      state.set(u, 1); stack.push(u);
      for (const v of next.get(u) ?? []) {
        if (state.get(v) === 1) { const cyc = stack.slice(stack.indexOf(v)); if (cyc.length > 2) { const rot = cyc.indexOf([...cyc].sort()[0]); const c = [...cyc.slice(rot), ...cyc.slice(0, rot)]; add({ key: `C|cycle|${type}|${c.join(">")}`, detector: "C", kind: `a cycle of ${type}`, records: c, evidence: c.concat(c[0]).join(` ${type} `) }); } }
        else if (!state.get(v)) visit(v);
      }
      stack.pop(); state.set(u, 2);
    };
    for (const u of [...next.keys()].sort()) if (!state.get(u)) visit(u);
  }

  // ---- D: prose-and-field ----
  const yearOf = (d: any, era: "AH" | "CE"): number | undefined => {
    if (!d) return undefined;
    if (era === "AH") { const h = /^\s*(-?\d{1,4})/.exec(String(d.hijri ?? "")); if (h) return Number(h[1]); const y = /^\s*(-?\d{1,4})/.exec(String(d.edtf ?? "")); return y ? Math.floor((Number(y[1]) - 622) * 33 / 32) + 1 : undefined; }
    const y = /^\s*(-?\d{1,4})/.exec(String(d.edtf ?? "")); return y ? Number(y[1]) : undefined;
  };
  const eraOf = (s: string | undefined, lang: string, year: number): "AH" | "CE" | undefined => {
    if (s && /هـ|ه\b|AH|H\b/i.test(s)) return "AH";
    if (s && /م\b|CE|AD/i.test(s)) return "CE";
    return undefined; // an unmarked year is not compared: it cannot be read without guessing
  };
  const DEATH = /\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s*⁦?\(\s*(?:ت\.?|توفي|تُوفي|المتوفى|d\.|died)\s*(?:سنة|عام|in)?\s*(\d{2,4})\s*(هـ|ه|AH|م|CE|AD)?/g;
  const SPAN = /\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s*⁦?\(\s*(\d{2,4})\s*[–—-]\s*(\d{2,4})\s*(هـ|ه|AH|م|CE|AD)?\s*\)/g;
  // further shapes of the same statement: "(d. 179/795)", "المتوفى سنة 179هـ" after the link, "توفي [[..]] سنة 179هـ" before it,
  // and a link to an event followed by its year in a parenthesis
  const DEATH_PAIR = /\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s*\u2066?\(\s*(?:d\.|died)\s*(\d{2,4})\s*(?:AH)?\s*\/\s*(\d{3,4})\s*(?:CE)?\s*\)/g;
  const DEATH_AFTER = /\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s*،?\s*(?:المتوفى|المتوفّى|المتوفي)\s+(?:في\s+)?(?:سنة|عام)?\s*(\d{2,4})\s*(هـ|ه|م)/g;
  const DEATH_BEFORE = /(?:توفي|تُوفي|توفّي|مات)\s+\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s+(?:في\s+)?(?:سنة|عام)\s+(\d{2,4})\s*(هـ|ه|م)/g;
  const EVENT_YEAR = /\[\[(event\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\s*\u2066?\(\s*(?:سنة|عام|in)?\s*(\d{1,4})\s*(هـ|ه|AH|م|CE|AD)\s*\)/g;
  for (const n of g.nodes) {
    if (n.stub) continue;
    for (const lang of ["ar", "en"]) for (const sec of n.prose?.[lang]?.sections ?? []) {
      const text: string = sec.markdown;
      const deathCheck = (m: RegExpMatchArray, year: number, era: "AH" | "CE") => {
        const pid = m[1]; if (pid === n.id) return;
        const P = byId.get(pid); if (!P || P.stub) return;
        const rec = yearOf(P.data.died, era);
        const tol = era === "AH" && !/hijri/.test(JSON.stringify(P.data.died ?? {})) ? 2 : 1;
        if (rec !== undefined && Math.abs(rec - year) > tol) add({ key: `D|death-year|${n.id}|${pid}|${year}${era}`, detector: "D", kind: "prose gives a death year that differs from the person's own record", records: [n.id, pid], evidence: `${n.id} (${lang}, section "${sec.heading}") says ${m[0].replace(/\s+/g, " ").slice(0, 110)}; ${pid} records died ${show(P.data.died)}` });
      };
      for (const m of text.matchAll(DEATH_PAIR)) { deathCheck(m, Number(m[2]), "AH"); deathCheck(m, Number(m[3]), "CE"); }
      for (const m of text.matchAll(DEATH_AFTER)) deathCheck(m, Number(m[2]), /م/.test(m[3]) ? "CE" : "AH");
      for (const m of text.matchAll(DEATH_BEFORE)) deathCheck(m, Number(m[2]), /م/.test(m[3]) ? "CE" : "AH");
      for (const m of text.matchAll(EVENT_YEAR)) {
        const eid = m[1]; if (eid === n.id) continue;
        const E = byId.get(eid); const era = eraOf(m[3], lang, Number(m[2]));
        if (!E || E.stub || !era) continue;
        const d = E.data.date?.start; const rec = yearOf(d, era);
        const tol = era === "AH" && !/hijri/.test(JSON.stringify(d ?? {})) ? 2 : 1;
        if (rec !== undefined && Math.abs(rec - Number(m[2])) > tol) add({ key: `D|event-year|${n.id}|${eid}|${m[2]}${era}`, detector: "D", kind: "prose gives a year for an event that differs from the event's own record", records: [n.id, eid], evidence: `${n.id} (${lang}, section "${sec.heading}") says ${m[0].replace(/\s+/g, " ").slice(0, 110)}; ${eid} records ${show(d)}` });
      }
      for (const m of text.matchAll(DEATH)) {
        const pid = m[1]; if (pid === n.id) continue;
        const P = byId.get(pid); const era = eraOf(m[3], lang, Number(m[2]));
        if (!P || P.stub || !era) continue;
        const rec = yearOf(P.data.died, era);
        const stated = era === "AH" ? /hijri/.test(JSON.stringify(P.data.died ?? {})) : true;
        const tol = era === "AH" && !stated ? 2 : 1;
        if (rec !== undefined && Math.abs(rec - Number(m[2])) > tol) add({ key: `D|death-year|${n.id}|${pid}|${m[2]}${era}`, detector: "D", kind: "prose gives a death year that differs from the person's own record", records: [n.id, pid], evidence: `${n.id} (${lang}, section "${sec.heading}") says ${m[0].replace(/\s+/g, " ").slice(0, 110)}; ${pid} records died ${show(P.data.died)}` });
      }
      for (const m of text.matchAll(SPAN)) {
        const pid = m[1]; if (pid === n.id) continue;
        const P = byId.get(pid); const era = eraOf(m[4], lang, Number(m[3]));
        if (!P || P.stub || !era) continue;
        const b = yearOf(P.data.born, era), d = yearOf(P.data.died, era);
        const tol = era === "AH" ? 2 : 1;
        if ((b !== undefined && Math.abs(b - Number(m[2])) > tol) || (d !== undefined && Math.abs(d - Number(m[3])) > tol)) add({ key: `D|life-span|${n.id}|${pid}|${m[2]}-${m[3]}${era}`, detector: "D", kind: "prose gives a life span that differs from the person's own record", records: [n.id, pid], evidence: `${n.id} (${lang}, section "${sec.heading}") says ${m[0].replace(/\s+/g, " ").slice(0, 110)}; ${pid} records born ${show(P.data.born)}, died ${show(P.data.died)}` });
      }
    }
  }
  return { commit: g.commit ?? null, findings: [...out.values()].sort((a, b) => a.key.localeCompare(b.key)) };
}

if (/[\\/]contradictions\.ts$/.test(process.argv[1] ?? "")) {
  const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const { commit, findings } = detect(file);
  const by: Record<string, number> = {};
  for (const f of findings) by[`${f.detector} ${f.kind}`] = (by[`${f.detector} ${f.kind}`] ?? 0) + 1;
  console.log(`graph commit ${commit}: ${findings.length} findings`);
  for (const [k, v] of Object.entries(by).sort()) console.log(`  ${String(v).padStart(4)}  ${k}`);
  if (process.argv.includes("--json")) console.log(JSON.stringify(findings, null, 1));
}
