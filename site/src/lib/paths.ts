// Bundled SSR code cannot rely on import.meta.url, so locate the repository root from the working directory
// (Astro always runs from site/) by walking up to the folder that holds schema/predicates.yaml.
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

function findRoot(): string {
  let dir = resolve(process.cwd());
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(dir, "schema", "predicates.yaml"))) return dir;
    dir = dirname(dir);
  }
  throw new Error("Cannot locate the repository root from " + process.cwd());
}
export const REPO_ROOT = findRoot();
export const repoPath = (...parts: string[]) => join(REPO_ROOT, ...parts);
