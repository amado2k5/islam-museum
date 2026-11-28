// The games host on this machine: the games Worker's own code (workers/games) serving a built release from a folder
// laid out exactly like the bucket. Every check of a release runs against it, never against UAT or production
// (founder rule, 28 November 2026: agents test locally; the hosted copies are the founder's to deploy and look at).
// Usage as a server: npx tsx --tsconfig tsconfig.json tools/local-host.ts [release dir=dist/release] [port=4340]
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error plain JavaScript modules of the Worker, with no type declarations
import worker from "../../workers/games/src/index.js";
// @ts-expect-error
import { folderBucket } from "../../workers/games/test/fake-bucket.mjs";

export interface LocalHost {
  base: string;
  releaseId: string;
  manifest: { commit: string; commitDate: string; musicBase: string; modelsBase?: string; games: Array<{ id: string; status: string; page: string | null }> };
  withMusic: boolean;
  withModels: boolean;
  /** The folder bucket, which records every key read (bucket.reads). */
  bucket: { reads: string[] };
  close: () => void;
}

const LOCAL = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/** Refuses any address that is not this machine: no check of the games reads UAT or production. */
export function requireLocal(base: string): string {
  const host = new URL(base).hostname;
  if (!LOCAL.has(host)) throw new Error(`${base} is not this machine. Games checks run only against a local host (npm run release:serve), never UAT or production (founder rule, 28 November 2026).`);
  return base;
}

/** Serves the release in releaseDir on 127.0.0.1 (port 0: any free port). */
export async function startLocalHost(releaseDir = "dist/release", port = 0): Promise<LocalHost> {
  const dir = resolve(releaseDir);
  const manifest = JSON.parse(readFileSync(join(dir, "release.json"), "utf8")) as LocalHost["manifest"];
  const releaseId = `${manifest.commitDate.slice(0, 10).replaceAll("-", "")}-${manifest.commit.slice(0, 11)}`;
  // A bucket on disk: games/channel.json and games/r/<release>/…
  const bucketDir = mkdtempSync(join(tmpdir(), "im-games-bucket-"));
  cpSync(dir, join(bucketDir, "games", "r", releaseId), { recursive: true });
  writeFileSync(join(bucketDir, "games", "channel.json"), JSON.stringify({ format: "im.play.channel", version: 1, current: releaseId, previous: null, commit: manifest.commit, updatedAt: manifest.commitDate }));
  // The music lives beside the releases, as in the real bucket, when this machine has the tracks.
  const localMusic = resolve(dir, "../../media/music");
  const withMusic = manifest.musicBase !== "off" && existsSync(localMusic);
  if (withMusic) cpSync(localMusic, join(bucketDir, "games", "media", "music"), { recursive: true });
  // And so do the authored models, when the release was built to look for them: the entry file, its data and its textures.
  const localModels = resolve(dir, "../../media/models");
  const withModels = manifest.modelsBase !== undefined && manifest.modelsBase !== "off" && existsSync(localModels);
  if (withModels) cpSync(localModels, join(bucketDir, "games", "media", "models"), { recursive: true, filter: (src) => !src.includes("/_work") });
  const bucket = folderBucket(bucketDir);
  const env = { GAMES_BUCKET: bucket, ROBOTS: "disallow", MUSIC_ORIGIN: "" };

  const server = createServer(async (req, res) => {
    try {
      const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers as Record<string, string> });
      const response: Response = await worker.fetch(request, env);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  });
  await new Promise<void>((done) => server.listen(port, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("no port");
  return {
    base: `http://127.0.0.1:${address.port}`,
    releaseId,
    manifest,
    withMusic,
    withModels,
    bucket,
    close: () => {
      server.close();
      rmSync(bucketDir, { recursive: true, force: true });
    },
  };
}

/** The base a check reads: the one given, if it is local, or a local host started over dist/release. */
export async function localBase(given: string | undefined, path = ""): Promise<{ base: string; close: () => void }> {
  if (given) return { base: requireLocal(given), close: () => undefined };
  const host = await startLocalHost();
  console.log(`serving dist/release (${host.releaseId}) at ${host.base}`);
  return { base: host.base + path, close: host.close };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const host = await startLocalHost(process.argv[2] ?? "dist/release", Number(process.argv[3] ?? 4340));
  console.log(`games host for ${host.releaseId}: ${host.base}/ (Ctrl-C to stop)`);
  process.on("SIGINT", () => (host.close(), process.exit(0)));
}
