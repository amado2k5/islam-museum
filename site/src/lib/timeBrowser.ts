// Which entities have a Time Browser stop in a language (DESIGN §5). Read from the build output
// (.cache/time-browser/<lang>/members.json, written by scripts/time-browser.ts). A missing file fails the build.
import { readFileSync } from "node:fs";
import { repoPath } from "./paths";

const cache = new Map<string, Set<string>>();

export function timeBrowserMembers(lang: string): Set<string> {
  let members = cache.get(lang);
  if (!members) {
    members = new Set(JSON.parse(readFileSync(repoPath(".cache", "time-browser", lang, "members.json"), "utf8")) as string[]);
    cache.set(lang, members);
  }
  return members;
}
