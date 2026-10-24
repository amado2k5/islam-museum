// Curriculum pathways (docs/delegation/education-master-plan.md §5 E2): the lesson exhibits that carry a `curriculum`
// block, their teacher routes, and the LearningResource JSON-LD the teacher landing page emits.
import { nodes, SITE, labelOf, summaryOf, href } from "./graph";
import { ui, fmt, type Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

export const pathways = (): Node[] =>
  nodes
    .filter((n) => n.class === "exhibit" && n.data.kind === "lesson" && n.data.curriculum && !n.stub)
    .sort((a, b) => Number(a.data.curriculum.grade) - Number(b.data.curriculum.grade) || a.slug.localeCompare(b.slug));
export const pathwaySlug = (n: Node): string => n.slug.replace(/^pathway-/, "");
export const pathwayPath = (lang: Lang, n: Node): string => `/${lang}/learn/teachers/pathways/${pathwaySlug(n)}/`;
export const pathwayPrintPath = (lang: Lang, n: Node): string => `${pathwayPath(lang, n)}print/`;
const loc = (o: any, lang: Lang): string => o?.[lang] ?? o?.en ?? o?.ar ?? "";
/** "Social Studies" for an elementary pathway (no Ministry code), the course code (CHW3M) for a secondary one. */
export const pathwaySubject = (n: Node, lang: Lang): string => {
  const c = n.data.curriculum;
  return c.course.startsWith("G") ? loc(c.course_title, lang).split(/[،,]/)[0].trim() : c.course;
};
export const pathwayTitle = (n: Node, lang: Lang): string =>
  fmt(ui(lang).edu.tp_title_fmt, { topic: labelOf(n, lang), grade: n.data.curriculum.grade, subject: pathwaySubject(n, lang) });

/** schema.org LearningResource for the teacher landing page (plan §5 E2 "Teacher SEO"). */
export function learningResourceLd(n: Node, lang: Lang) {
  const c = n.data.curriculum;
  const url = `${SITE}${pathwayPath(lang, n)}`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": url,
    url,
    name: pathwayTitle(n, lang),
    description: summaryOf(n, lang),
    inLanguage: lang,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    educationalLevel: `Grade ${c.grade}`,
    learningResourceType: ["lesson plan", "worksheet"],
    timeRequired: `PT${n.data.duration_minutes}M`,
    audience: { "@type": "EducationalAudience", educationalRole: "teacher" },
    educationalAlignment: [
      { "@type": "AlignmentObject", alignmentType: "educationalSubject", educationalFramework: "The Ontario Curriculum", targetName: loc(c.course_title, lang) },
      { "@type": "AlignmentObject", alignmentType: "educationalLevel", educationalFramework: "The Ontario Curriculum", targetName: `Grade ${c.grade}` },
      { "@type": "AlignmentObject", alignmentType: "teaches", educationalFramework: "The Ontario Curriculum", targetName: `${c.course} ${c.strand}: ${(c.expectations ?? []).join(", ")}`, targetDescription: loc(c.expectation, lang) },
    ],
    hasPart: [{ "@type": "LearningResource", learningResourceType: "worksheet", url: `${SITE}${pathwayPrintPath(lang, n)}` }],
    isBasedOn: `${SITE}${href(lang, n.id)}`,
    publisher: { "@type": "Organization", name: "islam.museum", url: SITE },
  };
}
