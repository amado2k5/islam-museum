// The sample build of a pull request (docs/engineering/46-ci-flow-proposal.md, section 2).
// Two page templates hold 92 % of the site's pages (the entity page and the hadith chapter page). A pull request builds
// every other template in full and, of these two, only: the records a check opens by name, the records the pull request
// changed, and an even spread of each class. The full build of `main` is untouched: with SAMPLE_BUILD unset, `sample`
// returns the list it was given, the same array, so not one byte of a full build depends on this file.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { repoPath } from "./paths";

/** Record pages that a check opens by name. A check that names a page missing from here fails the sample run with
 * "not built" (check-weight, check-site, axe, Lighthouse), so this list cannot go stale without someone being told. */
export const PINNED = [
  "event/hijra",            // scripts/check-weight.ts: the leveled reading budget
  "person/ibn-sina",        // scripts/axe-scan.ts and lighthouserc.json
  "passage/quran-2-255",    // scripts/check-site.ts: a verse with a Tafsir section
  "passage/quran-114-6",    // scripts/check-site.ts: a verse without one
];

export const sampling = (env: Record<string, string | undefined> = process.env): boolean => !!env.SAMPLE_BUILD && env.SAMPLE_BUILD !== "0";

/** The ids kept: pinned, changed, and `perClass` records of each class evenly spaced over the ids in order. */
export function pick<T extends { id: string; class: string }>(items: T[], perClass: number, always: Set<string>): Set<string> {
  const keep = new Set<string>();
  const byClass = new Map<string, string[]>();
  for (const n of items) {
    if (always.has(n.id)) keep.add(n.id);
    const list = byClass.get(n.class);
    if (list) list.push(n.id);
    else byClass.set(n.class, [n.id]);
  }
  for (const ids of byClass.values()) {
    ids.sort();
    const take = Math.min(perClass, ids.length);
    for (let i = 0; i < take; i++) keep.add(ids[Math.floor((i * ids.length) / take)]);
  }
  return keep;
}

let always: Set<string> | undefined;
/** Pinned ids plus the ids scripts/sample-routes.ts read from the pull request's diff. */
function alwaysIds(): Set<string> {
  if (always) return always;
  always = new Set(PINNED);
  const file = repoPath(".cache", "sample", "changed.txt");
  if (existsSync(file)) for (const id of readFileSync(file, "utf8").split("\n")) if (id.trim()) always.add(id.trim());
  return always;
}

const skipped = new Set<string>();
/** In a sample build, the items to build; the routes of the others are written to .cache/sample/skipped.txt, from
 * which scripts/sample-stubs.ts makes placeholder pages for the link check. In a full build, `items` itself. */
export function sample<T extends { id: string; class: string }>(items: T[], perClass: number, route: (item: T) => string): T[] {
  if (!sampling()) return items;
  const keep = pick(items, perClass, alwaysIds());
  const kept: T[] = [];
  for (const n of items) {
    if (keep.has(n.id)) kept.push(n);
    else skipped.add(route(n));
  }
  mkdirSync(repoPath(".cache", "sample"), { recursive: true });
  writeFileSync(repoPath(".cache", "sample", "skipped.txt"), [...skipped].join("\n") + "\n");
  return kept;
}
