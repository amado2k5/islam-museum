// Tells a pull request whether merging it will rewrite most of the site's pages on the next deploy.
//
// A page is rewritten when a file baked into it changes: a layout, the header or footer, a library the layouts call, or an
// i18n string the shell shows. Those are the "shell files" (tools/deploy/shell-paths.list). The shell scripts
// are not: they are single files outside the pages (site/public/shell/). A change to a shell file
// costs one deploy about 164,000 R2 writes and half an hour (docs/engineering/16-deploy-churn-proposal.md), so the pull
// request is labelled and its summary says so, and the founder can batch such changes into one deploy a week.
//
// Run in the pull-request check: node tools/deploy/shell-impact.mjs [--base HEAD^1] [--head HEAD]
// (the checkout of a pull_request event is the merge commit; its first parent is the base, so `HEAD^1..HEAD` is exactly what
// merging would change). Writes a Markdown summary to stdout and, in Actions, `rewrites=true|false` to $GITHUB_OUTPUT.
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { isShellPath, shellPaths } from "./shell-paths.mjs";

/** The shell components and libraries whose reads of the i18n table decide which strings are baked into every page. */
export const SHELL_I18N_READERS = [
  "site/src/layouts/BaseLayout.astro",
  "site/src/layouts/EntityLayout.astro",
  "site/src/components/A11yPrefs.astro",
  "site/src/components/Logo.astro",
  "site/src/components/SocialLinks.astro",
  "site/src/components/PageHeader.astro",
  "site/src/components/ExploreBar.astro",
  "site/src/components/LevelSwitcher.astro",
  "site/src/components/TimeStrip.astro",
  "site/src/components/MiniMap.astro",
  "site/src/components/Extras.astro",
];

/**
 * The dotted i18n paths a source text reads through the usual `T` binding: `T.nav.more` is `nav.more`,
 * `T["footer"].support` is `footer.support`. The walk stops at a dynamic index (`T.wings[w]` is `wings`), so a block read
 * dynamically is compared as a whole. A heuristic: it errs toward flagging.
 */
export function i18nPathsRead(source) {
  const paths = new Set();
  for (const m of source.matchAll(/\bT((?:\.[A-Za-z_]\w*|\["[^"]+"\])+)/g)) {
    const parts = [...m[1].matchAll(/\.([A-Za-z_]\w*)|\["([^"]+)"\]/g)].map((x) => x[1] ?? x[2]);
    // `.length`, `.map` and friends are string and array members, not keys.
    const cut = parts.findIndex((p) => ["length", "map", "filter", "join", "includes", "startsWith", "replace", "slice"].includes(p));
    const path = (cut >= 0 ? parts.slice(0, cut) : parts).join(".");
    if (path) paths.add(path);
  }
  return [...paths].sort();
}

const get = (obj, path) => {
  let cur = obj;
  for (const key of path.split(".")) {
    if (cur === null || typeof cur !== "object") return cur;
    cur = cur[key];
  }
  return cur;
};

/** JSON with sorted keys, so two parses of the same data compare equal whatever the key order in the file. */
const stable = (v) => JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x));

/** The shell i18n paths whose value differs between two parsed i18n tables. */
export function changedShellStrings(baseTable, headTable, paths) {
  return paths.filter((p) => stable(get(baseTable, p)) !== stable(get(headTable, p)));
}

/** The summary shown on the pull request, and whether it rewrites the pages. */
export function summarize({ shellFiles, strings }) {
  const rewrites = shellFiles.length > 0 || strings.length > 0;
  if (!rewrites) {
    return { rewrites, text: "This change touches no shell file: its pages are the only ones that change on the next deploy." };
  }
  const lines = [
    "**This change rewrites most or all of the site's pages on the next deploy** (about 164,000 R2 writes, about $0.75 and half an hour of publish time at today's prices).",
    "It is not wrong to merge it. It means the founder will want it in the same deploy as other shell changes, not one deploy a day each.",
    "",
  ];
  if (shellFiles.length) lines.push("Shell files changed:", ...shellFiles.map((f) => `- \`${f}\``), "");
  if (strings.length) lines.push("Shell strings changed (shown on every page):", ...strings.map((s) => `- \`${s}\``), "");
  lines.push("Can the change live in a file outside the pages instead? A script can: the shell scripts (`site/public/shell/`) are single files; see `docs/site/README.md`, \"site-wide numbers\".");
  return { rewrites, text: lines.join("\n") };
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

function main() {
  const arg = (name, fallback) => {
    const i = process.argv.indexOf(`--${name}`);
    return i >= 0 ? process.argv[i + 1] : fallback;
  };
  const base = arg("base", "HEAD^1");
  const head = arg("head", "HEAD");
  const changed = git("diff", "--name-only", base, head).split("\n").map((l) => l.trim()).filter(Boolean);
  const paths = shellPaths();
  const shellFiles = changed.filter((f) => isShellPath(f, paths));

  const strings = [];
  if (changed.some((f) => /^i18n\/[a-z]+\.yaml$/.test(f))) {
    const read = SHELL_I18N_READERS.map((f) => { try { return readFileSync(resolve(f), "utf8"); } catch { return ""; } }).join("\n");
    const readPaths = i18nPathsRead(read);
    for (const lang of ["ar", "en", "ur"]) {
      const file = `i18n/${lang}.yaml`;
      if (!changed.includes(file)) continue;
      let before = {};
      try { before = parse(git("show", `${base}:${file}`)); } catch { /* a new file: everything changed */ }
      const after = parse(git("show", `${head}:${file}`));
      for (const p of changedShellStrings(before, after, readPaths)) strings.push(`${file}: ${p}`);
    }
  }

  const { rewrites, text } = summarize({ shellFiles, strings });
  console.log(text);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `rewrites=${rewrites}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Deploy impact\n\n${text}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
