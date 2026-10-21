// Per-file "last changed" dates from git history, computed once per build.
// Entity pages cite the date their data or prose last changed (not the build day), so a page's
// HTML only changes when its content does and the R2 publish re-uploads only what moved.
// One `git log --name-only` pass over data/ and content/ costs about a second for the whole
// history; a shallow clone yields only HEAD's files, and every other file falls back to the HEAD
// commit date (still deterministic for a given commit). Files with uncommitted changes get today.
import { execFileSync } from "node:child_process";

const git = (root: string, args: string[]): string | null => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 1024 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};

/** Parses `git log --format=%x00%cs --name-only` output: the first (newest) date seen for each path wins. */
export function parseNameOnlyLog(text: string): Map<string, string> {
  const out = new Map<string, string>();
  let date = "";
  for (const line of text.split("\n")) {
    if (line.startsWith("\0")) { date = line.slice(1).trim(); continue; }
    const f = line.trim();
    if (f && date && !out.has(f)) out.set(f, date);
  }
  return out;
}

/** Parses `git status --porcelain` output into the paths with uncommitted changes (renames yield the new name). */
export function parsePorcelain(text: string): string[] {
  return text.split("\n").filter((l) => l.length > 3).map((l) => {
    const path = l.slice(3);
    const arrow = path.indexOf(" -> ");
    return (arrow >= 0 ? path.slice(arrow + 4) : path).replace(/^"|"$/g, "");
  });
}

export interface GitDates {
  /** HEAD commit sha, or null outside a git checkout. */
  commit: string | null;
  /** HEAD committer date as ISO 8601, or null outside a git checkout. */
  committed: string | null;
  /** YYYY-MM-DD of the last commit that touched the repo-relative path; HEAD's date when unknown, today when uncommitted. */
  dateOf: (relPath: string) => string;
}

export function gitDates(root: string, pathspecs: string[]): GitDates {
  const today = new Date().toISOString().slice(0, 10);
  const head = git(root, ["log", "-1", "--format=%H%n%cI"])?.trim().split("\n") ?? [];
  const commit = head[0] || null;
  const committed = head[1] || null;
  const headDay = committed ? committed.slice(0, 10) : today;
  const dates = parseNameOnlyLog(git(root, ["log", "--format=%x00%cs", "--name-only", "--", ...pathspecs]) ?? "");
  for (const f of parsePorcelain(git(root, ["status", "--porcelain", "--untracked-files=all", "--", ...pathspecs]) ?? "")) dates.set(f, today);
  return { commit, committed, dateOf: (relPath) => dates.get(relPath) ?? headDay };
}
