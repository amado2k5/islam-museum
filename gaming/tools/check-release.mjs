// Verifies a built release before anything is published. It needs nothing installed (plain Node), so the deployment
// workflow can run it on a downloaded artifact without an install step.
// Usage: node tools/check-release.mjs <release dir> [--expect-commit <sha>] [--allow-dirty]
// It fails if: the manifest is missing or of another format; a listed file is missing, has another size or another
// SHA-256; a file is present that the manifest does not list; a game's page is missing; a media file or a source map
// is in the release; a page asks for anything from another origin, or carries an inline script or a style attribute
// (the host's content security policy refuses both); the release was built from uncommitted changes (--allow-dirty
// lets a developer check a local build, and a workflow never passes it).
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const dir = resolve(process.argv[2] ?? "");
if (!process.argv[2] || !existsSync(join(dir, "release.json"))) {
  console.error("usage: node tools/check-release.mjs <release dir>   (no release.json found)");
  process.exit(2);
}
const expectAt = process.argv.indexOf("--expect-commit");
const expectCommit = expectAt > 0 ? process.argv[expectAt + 1] : null;
const problems = [];
const manifest = JSON.parse(readFileSync(join(dir, "release.json"), "utf8"));
if (manifest.format !== "im.play.release" || manifest.version !== 1) problems.push(`release.json is ${manifest.format} version ${manifest.version}, not im.play.release version 1`);
if (expectCommit && manifest.commit !== expectCommit) problems.push(`the release was built from ${manifest.commit}, not from ${expectCommit}`);
if (manifest.dirty && !process.argv.includes("--allow-dirty")) problems.push("the release was built from a tree with uncommitted changes");

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const onDisk = new Set(walk(dir).map((f) => relative(dir, f).split("\\").join("/")));
onDisk.delete("release.json");
let bytes = 0;
for (const f of manifest.files ?? []) {
  if (!onDisk.delete(f.path)) {
    problems.push(`${f.path} is in the manifest and not in the folder`);
    continue;
  }
  const body = readFileSync(join(dir, f.path));
  bytes += body.length;
  if (statSync(join(dir, f.path)).size !== f.bytes) problems.push(`${f.path} is ${body.length} bytes, the manifest says ${f.bytes}`);
  if (createHash("sha256").update(body).digest("hex") !== f.sha256) problems.push(`${f.path} does not match its SHA-256`);
  if (/\.(mp3|m4a|wav|ogg|flac|mp4|webm|mov|png|jpe?g|webp|gif|avif)$/i.test(f.path)) problems.push(`${f.path} is media: a release holds code only`);
  if (/\.map$/.test(f.path)) problems.push(`${f.path} is a source map`);
}
for (const extra of onDisk) problems.push(`${extra} is in the folder and not in the manifest`);
if (bytes !== manifest.totalBytes) problems.push(`the files add up to ${bytes} bytes, the manifest says ${manifest.totalBytes}`);

const pages = (manifest.games ?? []).filter((g) => g.page);
if (pages.length === 0) problems.push("the release has no game page");
for (const g of pages) {
  const page = join(dir, g.page, "index.html");
  if (!existsSync(page)) {
    problems.push(`${g.id}: ${g.page}index.html is missing`);
    continue;
  }
  const html = readFileSync(page, "utf8");
  for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) if (/^(?:https?:)?\/\//.test(m[1])) problems.push(`${g.id}: the page asks for ${m[1]} from another origin`);
  if (/\sstyle="/.test(html)) problems.push(`${g.id}: the page has a style attribute, which the content security policy refuses`);
  if (/<script(?![^>]*\bsrc=)/.test(html)) problems.push(`${g.id}: the page has an inline script, which the content security policy refuses`);
}
if (onDisk.has("_headers") || (manifest.files ?? []).some((f) => f.path === "_headers")) problems.push("a release carries no headers file: the host decides the headers");
for (const need of ["index.html", "404.html"]) if (!(manifest.files ?? []).some((f) => f.path === need)) problems.push(`${need} is missing`);

const mb = (n) => (n / 1048576).toFixed(2);
console.log(`release ${String(manifest.commit).slice(0, 11)} of ${manifest.commitDate}: ${manifest.files?.length ?? 0} files, ${mb(bytes)} MB, music ${manifest.musicBase}`);
for (const g of manifest.games ?? []) console.log(`  ${g.id.padEnd(12)} ${g.status.padEnd(10)} ${g.page ?? "(no page: not in this release)"}`);
if (problems.length) {
  for (const p of problems) console.error(`PROBLEM  ${p}`);
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}: do not publish this release`);
  process.exit(1);
}
console.log("the release matches its manifest");
