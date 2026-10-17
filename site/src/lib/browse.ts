// Every type of content the museum holds, in the order the browse pages and the footer list them.
// A type with no entries still gets a page, so a visitor always finds the category.
import { realNodes, SEGMENT } from "./graph";

export const BROWSE_CLASSES = [
  "person", "place", "event", "object", "building", "passage", "concept", "work", "source",
  "group", "polity", "period", "practice", "question", "exhibit", "journey", "listing", "dataset",
  "media", "language", "screen",
] as const;
export type BrowseClass = (typeof BROWSE_CLASSES)[number];

/** The URL segment of a class's browse page (the same segments entity pages use). */
export const browseSegment = (c: string) => SEGMENT[c] ?? c;

const counts = new Map<string, number>();
for (const n of realNodes) counts.set(n.class, (counts.get(n.class) ?? 0) + 1);
export const countOf = (c: string) => counts.get(c) ?? 0;
export const entriesOf = (c: string) => realNodes.filter((n) => n.class === c);
