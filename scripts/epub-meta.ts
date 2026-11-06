// The "last modified" stamp of an accessible EPUB (scripts/a11y-books.ts).
//
// EPUB 3 requires a dcterms:modified value (CCYY-MM-DDThh:mm:ssZ). It used to be the build clock, so all 867 books
// changed on every build and the next R2 publish uploaded each of them again for nothing. The stamp is now the day
// the book's source last changed, taken from the graph (the git commit date of the entity's data and prose), so a book
// changes only when its content does. Same idea as SOURCE_DATE_EPOCH (https://reproducible-builds.org/specs/source-date-epoch/):
// no clock in the output.
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The URL segment of a class differs from the class for two classes (site/src/lib/graph.ts, SEGMENT). */
const CLASS_OF_SEGMENT: Record<string, string> = { questions: "question", exhibits: "exhibit" };

/** The graph id (`class/slug`) of the entity a kids' reader page at /<lang>/sighar/read/<segment>/<slug>/ shows. */
export function nodeIdOfSegment(segment: string, slug: string): string {
  return `${CLASS_OF_SEGMENT[segment] ?? segment}/${slug}`;
}

/**
 * dcterms:modified for a book. `days` are the YYYY-MM-DD dates the book's source last changed (the newest wins).
 * With none, the day of `fallbackIso` (the build's HEAD commit time, from the graph) is used, then SOURCE_DATE_EPOCH,
 * then 1980-01-01 (the zip epoch). The time of day is always 00:00:00 so two builds on one day agree.
 */
export function epubModified(days: (string | undefined)[], fallbackIso?: string, sourceDateEpoch = process.env.SOURCE_DATE_EPOCH): string {
  const valid = days.filter((d): d is string => !!d && DAY.test(d)).sort();
  if (valid.length) return `${valid[valid.length - 1]}T00:00:00Z`;
  if (fallbackIso && DAY.test(fallbackIso.slice(0, 10))) return `${fallbackIso.slice(0, 10)}T00:00:00Z`;
  const epoch = Number(sourceDateEpoch);
  if (sourceDateEpoch && Number.isFinite(epoch)) return `${new Date(epoch * 1000).toISOString().slice(0, 10)}T00:00:00Z`;
  return "1980-01-01T00:00:00Z";
}

/** The dates a graph node's data and its prose in `lang` last changed. */
export function nodeDays(node: { updated?: string; prose?: Record<string, { updated?: string } | undefined> } | undefined, lang: string): string[] {
  return node ? [node.updated, node.prose?.[lang]?.updated].filter((d): d is string => !!d) : [];
}
