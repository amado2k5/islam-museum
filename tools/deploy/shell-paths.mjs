// The shell files listed in shell-paths.list (see there). No dependencies, so the deploy job can import it with only
// the r2-sync packages installed.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Parses the text of shell-paths.list into git pathspecs. */
export function parseShellPaths(text) {
  return text.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
}

export function shellPaths(file = join(HERE, "shell-paths.list")) {
  return parseShellPaths(readFileSync(file, "utf8"));
}

/** Whether a repo-relative changed path is a shell file (an exact match or inside a listed folder). */
export function isShellPath(changed, paths = shellPaths()) {
  return paths.some((p) => changed === p || changed.startsWith(p.endsWith("/") ? p : `${p}/`));
}
