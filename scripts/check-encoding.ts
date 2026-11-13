// No source file may hold U+FFFD (the replacement character): it means text was corrupted on its way in.
// Part of `npm run validate`. It reads every file under the folders below as bytes, so no field is skipped:
// validate.ts walks text fields but leaves out the keys `text`, `text_search`, `provenance` and `id`, and on
// 12 November 2026 a broken letter in the `text` of passage/tirmidhi-api-767 passed validation, was built into
// fifteen pages and failed check:site after a three-hour build (run 43212337822). This check takes seconds.
// docs/engineering/46-ci-flow-proposal.md, section 3.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { p, rel } from "./lib.js";

/** Folders whose text is printed on pages. */
export const FOLDERS = ["data", "content", "i18n", "edu", "tour"];
const TEXT_FILE = /\.(ya?ml|md|json|csv|tsv)$/;
// U+FFFD in UTF-8.
const FFFD = Buffer.from([0xef, 0xbf, 0xbd]);

/** The 1-based line numbers of `buf` that hold U+FFFD. */
export function linesWithReplacementChar(buf: Buffer): number[] {
  const lines: number[] = [];
  let at = buf.indexOf(FFFD);
  if (at < 0) return lines;
  let line = 1, from = 0;
  while (at >= 0) {
    for (let i = from; i < at; i++) if (buf[i] === 0x0a) line++;
    if (lines[lines.length - 1] !== line) lines.push(line);
    from = at;
    at = buf.indexOf(FFFD, at + FFFD.length);
  }
  return lines;
}

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) yield* walk(f);
    else if (TEXT_FILE.test(e.name)) yield f;
  }
}

export function check(folders: string[]): { files: number; errors: string[] } {
  const errors: string[] = [];
  let files = 0;
  for (const folder of folders) {
    if (!existsSync(folder)) continue;
    for (const file of walk(folder)) {
      files++;
      const lines = linesWithReplacementChar(readFileSync(file));
      if (lines.length) errors.push(`${rel(file)}: contains U+FFFD (replacement character) on line ${lines.slice(0, 5).join(", ")}${lines.length > 5 ? ` and ${lines.length - 5} more` : ""}: the text was corrupted; restore the letter from the source`);
    }
  }
  return { files, errors };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { files, errors } = check(FOLDERS.map((f) => p(f)));
  for (const e of errors) console.log("ERROR " + e);
  console.log(`check-encoding: ${files} files, ${errors.length} with U+FFFD`);
  if (errors.length) process.exit(1);
}
