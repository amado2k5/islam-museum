// The release build of the games. It is the only thing a deployment publishes, and it is separate from the museum's
// site build in every way: its own package, its own command, its own output, its own workflow.
//
// What it makes, in dist/release/ (or --out):
//   <id>/index.html         one page per game that has a page in games/registry.json, in the registry's order
//   assets/…                every script, style and worker, each named by the hash of its content
//   release.json            the manifest: commit, the games, every file with its size and SHA-256
//   index.html, 404.html    no text of their own: they send a visitor to the museum
// The response headers (content security policy, caching, noindex) are not part of a release: the host decides
// them (workers/games/src/route.js), so nothing uploaded can loosen them.
//
// Usage: npx tsx --tsconfig tsconfig.json tools/build.ts [--out dist/release] [--music-base <url>|off] [--home <url>]
//   --music-base  where the six tracks are served from: "off" (the default: games that show no music control), a
//                 path relative to a game's page such as ../media/music/ (the games host serves games/media/ from
//                 the bucket there), or an https address. The audio is never in git and is uploaded on its own.
//   --home        where the root of the games host sends a visitor (default https://islam.museum/).
// Nothing here uploads anything. tools/check-release.mjs verifies a built release, tools/release-smoke.ts opens it
// in a real browser behind the real Worker code, and the deployment workflow publishes it.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const arg = (name: string, fallback: string): string => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback;
};
const out = resolve(root, arg("out", "dist/release"));
const musicBase = arg("music-base", "off");
// The authored models, served like the music and absent from a release in the same way: "off" unless the host has them.
const modelsBase = arg("models-base", "off");
if (modelsBase !== "off" && !/^https:\/\/[a-z0-9.-]+\/[\w./-]*\/$/.test(modelsBase) && !/^(\.\.\/)+[a-z0-9/-]+\/$/.test(modelsBase)) throw new Error(`--models-base must be "off", a relative path such as ../media/models/ or an https address ending in /, not ${modelsBase}`);
const home = arg("home", "https://islam.museum/");
if (musicBase !== "off" && !/^https:\/\/[a-z0-9.-]+\/[\w./-]*\/$/.test(musicBase) && !/^(\.\.\/)+[a-z0-9/-]+\/$/.test(musicBase)) throw new Error(`--music-base must be "off", a relative path such as ../media/music/, or an https address ending in a slash, got ${musicBase}`);
if (!/^https:\/\/[a-z0-9.-]+\/[\w./-]*$/.test(home)) throw new Error(`--home must be an https address, got ${home}`);
if (!out.startsWith(resolve(root, "dist") + "/")) throw new Error(`the output folder must be inside gaming/dist, got ${out}`);

interface Game {
  id: string;
  status: string;
  page: string | null;
}
const registry = JSON.parse(readFileSync(resolve(root, "games/registry.json"), "utf8")) as { games: Game[] };
const STATUSES = ["planned", "prototype", "alpha", "candidate", "released"];
const seen = new Set<string>();
for (const g of registry.games) {
  if (!/^[a-z][a-z0-9-]*$/.test(g.id) || seen.has(g.id)) throw new Error(`registry: bad or repeated game id ${g.id}`);
  seen.add(g.id);
  if (!STATUSES.includes(g.status)) throw new Error(`registry: ${g.id} has the unknown status ${g.status}`);
  if (g.page !== null && (g.page !== `games/${g.id}/index.html` || !existsSync(resolve(root, g.page)))) throw new Error(`registry: ${g.id}'s page must be games/${g.id}/index.html and must exist`);
  if (g.page === null && g.status !== "planned") throw new Error(`registry: ${g.id} is ${g.status} but has no page`);
}
const built = registry.games.filter((g) => g.page !== null);
if (built.length === 0) throw new Error("no game has a page: there is nothing to build");

const alias = { "@im/kernel": "packages/kernel/src", "@im/worldkit": "packages/worldkit/src", "@im/atlas": "games/atlas/src", "@im/audio": "packages/audio/src", "@im/golden-age": "games/golden-age/src", "@im/granada": "games/granada/src", "@im/hudhud": "games/hudhud/src" };
rmSync(out, { recursive: true, force: true });
await build({
  // The pages live in games/<id>/, and that folder is the root here so that a game's address is /<id>/.
  root: resolve(root, "games"),
  configFile: false,
  // Relative addresses, so the release works at the root of a host or under any folder of one.
  base: "./",
  logLevel: "warn",
  resolve: { alias: Object.fromEntries(Object.entries(alias).map(([k, v]) => [k, resolve(root, v)])) },
  define: { "import.meta.env.VITE_MUSIC_BASE": JSON.stringify(musicBase), "import.meta.env.VITE_MODELS_BASE": JSON.stringify(modelsBase) },
  build: {
    target: "es2023",
    outDir: out,
    emptyOutDir: true,
    sourcemap: false,
    // The engine is one large module; the warning is noise here and the manifest states every size.
    chunkSizeWarningLimit: 4096,
    rollupOptions: { input: Object.fromEntries(built.map((g) => [g.id, resolve(root, g.page!)])) },
  },
  worker: { format: "es" },
});

// The root of the host and its not-found page carry no text: they hand the visitor to the museum.
const away = `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="robots" content="noindex" />\n    <meta http-equiv="refresh" content="0; url=${home}" />\n    <link rel="canonical" href="${home}" />\n    <title>islam.museum</title>\n  </head>\n  <body><a href="${home}">islam.museum</a></body>\n</html>\n`;
writeFileSync(resolve(out, "index.html"), away);
writeFileSync(resolve(out, "404.html"), away);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]));
}
const git = (...args: string[]): string => {
  try {
    return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};
for (const g of built) if (!existsSync(resolve(out, g.id, "index.html"))) throw new Error(`the build made no page for ${g.id}`);
const files = walk(out)
  .map((f) => ({ path: relative(out, f).split("\\").join("/"), bytes: statSync(f).size, sha256: createHash("sha256").update(readFileSync(f)).digest("hex") }))
  .sort((a, b) => (a.path < b.path ? -1 : 1));
// A release is code. Media belongs on R2 by the museum's hosting rule, and audio is never in git.
const media = files.filter((f) => /\.(mp3|m4a|wav|ogg|flac|mp4|webm|mov|png|jpe?g|webp|gif|avif)$/i.test(f.path));
if (media.length) throw new Error(`a release holds code only, but the build produced media: ${media.map((f) => f.path).join(", ")}`);
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as { version: string; dependencies: Record<string, string>; devDependencies: Record<string, string> };
const manifest = {
  format: "im.play.release",
  version: 1,
  workspaceVersion: pkg.version,
  commit: git("rev-parse", "HEAD"),
  // The commit's own date, so that the same commit always builds the same manifest.
  commitDate: git("show", "-s", "--format=%cI", "HEAD"),
  dirty: git("status", "--porcelain", "--", ".") !== "",
  musicBase,
  modelsBase,
  home,
  built: { node: process.version, vite: pkg.devDependencies.vite, three: pkg.dependencies.three },
  games: registry.games.map((g) => ({ id: g.id, status: g.status, page: g.page === null ? null : `${g.id}/` })),
  totalBytes: files.reduce((n, f) => n + f.bytes, 0),
  files,
};
writeFileSync(resolve(out, "release.json"), `${JSON.stringify(manifest, null, 1)}\n`);
const mb = (n: number) => (n / 1_048_576).toFixed(2);
console.log(`release ${manifest.commit.slice(0, 11)}${manifest.dirty ? " (uncommitted changes)" : ""}: ${files.length} files, ${mb(manifest.totalBytes)} MB, music ${musicBase}`);
for (const g of manifest.games) console.log(`  ${g.id.padEnd(12)} ${g.status.padEnd(10)} ${g.page ?? "(no page: not in this release)"}`);
for (const f of [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 6)) console.log(`  ${mb(f.bytes).padStart(7)} MB  ${f.path}`);
