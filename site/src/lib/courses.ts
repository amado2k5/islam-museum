// The courses surface (docs/courses-mission/DESIGN.md): the view model every courses page reads.
// One source of truth for the tree (jurisdiction -> grade -> subject -> strand -> lesson), the paths, the lesson loop,
// the honest handling of untranslated curriculum text, and the self-check, all derived from the `course` records in the graph.
// Nothing here is authored content: every string a student reads comes from a record, a prose file or i18n/<lang>.yaml.
import { nodes, byId, href, labelOf, summaryOf } from "./graph";
import { ui, type Lang } from "./i18n";
import { renderProse, newHonState } from "./markdown";
import type { Node } from "../../../scripts/build-graph";

/** The languages the new courses surface is built in. Urdu is not built here (the founder's own lane). */
export const COURSE_LANGS = ["ar", "en"] as const;
export type CourseLang = (typeof COURSE_LANGS)[number];
export const isCourseLang = (l: string): l is CourseLang => (COURSE_LANGS as readonly string[]).includes(l);

const all: Node[] = nodes.filter((n) => n.class === "course" && !n.stub);
const ord = (n: Node) => n.data?.order ?? n.data?.grade_number ?? 0;
const sorted = (xs: Node[]) => [...xs].sort((a, b) => ord(a) - ord(b) || a.id.localeCompare(b.id));
export const slugOf = (n: Node | string) => (typeof n === "string" ? n : n.id).split("/")[1];
export const kidsOf = (id: string, kind?: string) => sorted(all.filter((n) => n.data?.part_of === id && (!kind || n.data?.kind === kind)));
export const jurisdictions = sorted(all.filter((n) => n.data?.kind === "jurisdiction")).sort((a, b) => a.id.localeCompare(b.id));
export const subjects = all.filter((n) => n.data?.kind === "subject");

/** Root-first ancestors of a record, the record last. */
export function trail(n: Node): Node[] {
  const out: Node[] = [n];
  for (let p = n.data?.part_of && byId.get(n.data.part_of); p; p = p.data?.part_of && byId.get(p.data.part_of)) out.unshift(p);
  return out;
}

export interface Strand { node: Node | null; lessons: Node[] }
export interface Course { subject: Node; grade?: Node; jurisdiction?: Node; strands: Strand[]; lessons: Node[] }

/** A subject with its strands and its lessons in teaching order. Lessons hung directly on the subject form one unnamed strand. */
export function courseOf(subject: Node): Course {
  const t = trail(subject);
  const strands: Strand[] = kidsOf(subject.id, "unit").map((u) => ({ node: u, lessons: kidsOf(u.id, "lesson") }));
  const loose = kidsOf(subject.id, "lesson");
  if (loose.length) strands.unshift({ node: null, lessons: loose });
  return { subject, grade: t.find((x) => x.data?.kind === "grade"), jurisdiction: t.find((x) => x.data?.kind === "jurisdiction"), strands, lessons: strands.flatMap((s) => s.lessons) };
}
export const courses: Course[] = subjects.map(courseOf).filter((c) => c.lessons.length > 0);
export const courseOfLesson = (lesson: Node) => courses.find((c) => c.lessons.includes(lesson));

export const homePath = (lang: string) => `/${lang}/learn/courses/`;
export const coursePath = (lang: string, c: Course) => `${homePath(lang)}${slugOf(c.subject)}/`;
export const lessonPath = (lang: string, c: Course, lesson: Node) => `${coursePath(lang, c)}${slugOf(lesson)}/`;

/** The language the issuing authority wrote the curriculum in (the jurisdiction's first language of instruction). */
export const officialLang = (c: Course): string => c.jurisdiction?.data?.language_of_instruction?.[0] ?? "en";

export interface ExpectationView { code: string; text: string; textLang: string; translated: boolean }
/**
 * The expectation text to show in `lang`, honestly. A text is "translated" only when the record carries one for `lang` that is
 * not a byte copy of the official-language text. Otherwise the official text is shown, marked with its own language:
 * the pilot stored English under `ar`, and this surface never presents that as Arabic.
 */
export function expectationView(e: any, lang: string, official: string): ExpectationView {
  const off = e.text?.[official] ?? e.text?.en ?? Object.values(e.text ?? {})[0] ?? "";
  const own = e.text?.[lang];
  if (lang === official) return { code: e.code, text: off, textLang: official, translated: true };
  if (own && own.trim() !== String(off).trim()) return { code: e.code, text: own, textLang: lang, translated: true };
  return { code: e.code, text: off, textLang: official, translated: false };
}


export interface ConnView {
  position: "before" | "within" | "after"; kind: string; kindLabel: string; title: string; text: string; ref?: string;
  /** The graph record one tap away. `stub` means the id is named but no record is written: shown, never linked. */
  door?: { id: string; label: string; classLabel: string; href: string; stub: boolean };
  /** A Qur'an reference resolved to the museum's passage record; `ayah` is the frozen Tanzil text from that record, never typed. */
  passage?: { href: string; label: string; ayah?: string };
  sources: { label: string; href?: string }[];
}
export function connView(c: any, lang: Lang): ConnView {
  const T = ui(lang);
  const target = c.entity ? byId.get(c.entity) : undefined;
  let passage: ConnView["passage"];
  const m = typeof c.ref === "string" ? c.ref.match(/^(\d+):(\d+)(?:-(\d+))?$/) : null;
  const pn = c.entity?.startsWith("passage/") ? target : m ? byId.get(`passage/quran-${m[1]}-${m[2]}`) : undefined;
  if (pn && !pn.stub) passage = { href: href(lang, pn.id), label: labelOf(pn, lang), ayah: !m || !m[3] ? pn.data?.text : undefined };
  return {
    position: c.position ?? "within", kind: c.kind, kindLabel: T.syllabus?.kinds?.[c.kind] ?? c.kind,
    title: c.title?.[lang] ?? c.title?.en ?? "", text: c.text?.[lang] ?? c.text?.en ?? "", ref: c.ref,
    door: target && target !== pn ? { id: target.id, label: labelOf(target, lang), classLabel: T.class?.[target.class] ?? target.class, href: href(lang, target.id), stub: !!target.stub } : undefined,
    passage,
    sources: (c.sources ?? []).map((s: string) => { const sn = byId.get(s); return sn ? { label: labelOf(sn, lang), href: sn.stub ? undefined : href(lang, s) } : { label: s }; }),
  };
}

export interface LessonSection { heading: string; html: string }
export interface LessonView {
  course: Course; lesson: Node; strand: Strand; index: number; total: number; strandIndex: number; strandTotal: number;
  prev?: Node; next?: Node; brief?: string; sections: LessonSection[]; tryThis?: LessonSection;
  expectations: ExpectationView[]; before: ConnView[]; after: ConnView[];
  /** The teaching sections with the "within" connections placed between them (see weave()). */
  woven: ({ type: "section"; section: LessonSection } | { type: "conn"; conn: ConnView })[];
  cites: { n: number; label: string; href?: string; locator?: string }[];
  proseLang: string; check: Check;
}

/**
 * Where the "within" connections go. The record says only "within", so the rule is fixed and mechanical: with s teaching
 * sections and k cards, card i (1-based) follows section ceil(i * s / (k + 1)). One card in a two-section lesson sits between
 * the two; cards never open the lesson (that is "before") and never pile up after the first section as the pilot page did.
 */
export function weave<S, C>(sections: S[], cards: C[]): ({ type: "section"; section: S } | { type: "conn"; conn: C })[] {
  const after = new Map<number, C[]>();
  cards.forEach((c, i) => { const at = Math.max(1, Math.ceil(((i + 1) * sections.length) / (cards.length + 1))); after.set(at, [...(after.get(at) ?? []), c]); });
  const out: any[] = [];
  sections.forEach((s, i) => { out.push({ type: "section", section: s }); for (const c of after.get(i + 1) ?? []) out.push({ type: "conn", conn: c }); });
  if (!sections.length) for (const c of cards) out.push({ type: "conn", conn: c });
  return out;
}

// ---- the self-check: built from the lesson's own records, never authored (DESIGN.md, "Closing the loop") ----
export interface Check {
  /** "Which of these did you meet in this lesson?": one right label, two from other lessons of the same course. */
  recognise?: { options: { label: string; right: boolean }[] };
  /** Retrieval prompts: say it in your own words, then open the card's own text to compare. */
  tellBack: { subject: string; answerTitle: string; answer: string }[];
}
const seed = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
function buildCheck(course: Course, lesson: Node, conns: ConnView[], lang: Lang): Check {
  const named = (cs: ConnView[]) => cs.filter((c) => c.door && !c.door.stub).map((c) => c.door!.label);
  const mine = [...new Set(named(conns))];
  const others = [...new Set(course.lessons.filter((l) => l !== lesson).flatMap((l) => named((l.data?.connections ?? []).map((c: any) => connView(c, lang)))))].filter((x) => !mine.includes(x));
  let recognise: Check["recognise"];
  if (mine.length && others.length >= 2) {
    const k = seed(lesson.id);
    const right = mine[k % mine.length];
    const d1 = others[k % others.length];
    const d2 = others.filter((x) => x !== d1)[(k >>> 3) % (others.length - 1)];
    const opts = [{ label: right, right: true }, { label: d1, right: false }, { label: d2, right: false }];
    const r = k % 3;
    recognise = { options: [...opts.slice(r), ...opts.slice(0, r)] };
  }
  const tellBack = conns.filter((c) => (c.door && !c.door.stub) || c.passage).slice(0, 2).map((c) => ({ subject: c.door?.label ?? c.passage!.label, answerTitle: c.title, answer: c.text }));
  return { recognise, tellBack };
}

const BRIEF = /^(brief|موجز|مختصر)$/i;
const TRY = /^(try this|جرّب هذا|جرب هذا)$/i;

export function lessonView(course: Course, lesson: Node, lang: Lang): LessonView {
  const strand = course.strands.find((s) => s.lessons.includes(lesson))!;
  const index = course.lessons.indexOf(lesson);
  const proseLang = lesson.prose?.[lang] ? lang : lesson.prose?.ar ? "ar" : "en";
  const hon = newHonState();
  const cites: LessonView["cites"] = [];
  const render = (md: string) => {
    const r = renderProse(md, lang, hon);
    // renumber this section's notes into one list for the page
    const map = new Map<number, number>();
    for (const c of r.cites) {
      let i = cites.findIndex((x) => x.label === c.source && x.locator === c.locator);
      if (i < 0) { cites.push({ n: cites.length + 1, label: c.source, locator: c.locator }); i = cites.length - 1; }
      map.set(c.n, i + 1);
    }
    // a note number never starts a line on its own: the space before it does not break
    return r.html.replace(/\s+(?=<sup class="cite">)/g, "\u00a0").replace(/<sup class="cite"><a href="#note-(\d+)" id="cite-\d+-\d+">\d+<\/a><\/sup>/g, (_m, k) => `<sup class="cite"><a href="#note-${map.get(Number(k))}">${map.get(Number(k))}</a></sup>`);
  };
  const raw = (lesson.prose?.[proseLang]?.sections ?? []) as { heading: string; markdown: string }[];
  const briefSec = raw.find((s) => BRIEF.test(s.heading.trim()));
  const trySec = raw.find((s) => TRY.test(s.heading.trim()));
  const brief = briefSec ? render(briefSec.markdown) : undefined;
  const sections = raw.filter((s) => s !== briefSec && s !== trySec).map((s) => ({ heading: s.heading, html: render(s.markdown) }));
  const tryThis = trySec ? { heading: trySec.heading, html: render(trySec.markdown) } : undefined;
  for (const c of cites) { const sn = byId.get(c.label); c.href = sn && !sn.stub ? href(lang, sn.id) : undefined; c.label = sn ? labelOf(sn, lang) : c.label; }
  const conns: ConnView[] = (lesson.data?.connections ?? []).map((c: any) => connView(c, lang));
  const off = officialLang(course);
  return {
    course, lesson, strand, index, total: course.lessons.length, strandIndex: strand.lessons.indexOf(lesson), strandTotal: strand.lessons.length,
    prev: course.lessons[index - 1], next: course.lessons[index + 1], brief, sections, tryThis,
    expectations: (lesson.data?.expectations ?? []).map((e: any) => expectationView(e, lang, off)),
    before: conns.filter((c) => c.position === "before"), after: conns.filter((c) => c.position === "after"),
    woven: weave(sections, conns.filter((c) => c.position === "within")),
    cites, proseLang, check: buildCheck(course, lesson, conns, lang),
  };
}

/** What a lesson holds, for the course map: how many discoveries of each kind. */
export const kindsOf = (lesson: Node, lang: Lang) => {
  const T = ui(lang);
  const m = new Map<string, number>();
  for (const c of lesson.data?.connections ?? []) m.set(c.kind, (m.get(c.kind) ?? 0) + 1);
  return [...m].map(([kind, n]) => ({ kind, n, label: T.syllabus?.kinds?.[kind] ?? kind }));
};
export const langName = (code: string, lang: Lang) => ui(lang).courses?.lang_names?.[code] ?? code;
