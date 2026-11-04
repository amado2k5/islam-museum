// The museum's product version, read at build time from the top release block of
// CANARY.md (repo root) — the single source of truth for the version shown in the
// footer and on the changelog page. See docs/engineering/15-release-notes-and-versioning.md.
import { readFileSync } from "node:fs";
import { repoPath } from "./paths";

export interface SiteVersion {
  version: string;
  date: string;
  /** The raw CANARY.md text, for the changelog page to render. */
  canary: string;
}

let cached: SiteVersion | null = null;

export function siteVersion(): SiteVersion {
  if (cached) return cached;
  let canary = "";
  try {
    canary = readFileSync(repoPath("CANARY.md"), "utf8");
  } catch {
    canary = "";
  }
  const m = canary.match(/^## v(\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})/m);
  cached = { version: m ? m[1] : "", date: m ? m[2] : "", canary };
  return cached;
}

export interface CanaryBlock {
  version: string;
  date: string;
  groups: { title: string; items: string[] }[];
}

/** Parse CANARY.md into release blocks (newest first), skipping the file's preamble. */
export function canaryBlocks(md: string): CanaryBlock[] {
  const blocks: CanaryBlock[] = [];
  let block: CanaryBlock | null = null;
  let group: { title: string; items: string[] } | null = null;
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    const vm = line.match(/^## v(\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})/);
    if (vm) {
      block = { version: vm[1], date: vm[2], groups: [] };
      blocks.push(block);
      group = null;
      continue;
    }
    if (!block) continue;
    const gm = line.match(/^### (.+)$/);
    if (gm) {
      group = { title: gm[1].trim(), items: [] };
      block.groups.push(group);
      continue;
    }
    const im = line.match(/^- (.+)$/);
    if (im) {
      if (!group) {
        group = { title: "", items: [] };
        block.groups.push(group);
      }
      group.items.push(im[1].trim());
    }
  }
  return blocks;
}
