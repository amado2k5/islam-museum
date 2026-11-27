// Publishes a built games release into an environment's R2 bucket, and moves the pointer that makes it live.
// Run only by the games' deployment workflow (.github/workflows/games-deploy-env.yml), with that environment's own
// S3 keys in AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY. It needs nothing installed but Node and the AWS CLI.
//
//   node workers/games/publish.mjs status   --bucket <name> --endpoint <url>
//   node workers/games/publish.mjs release  --bucket <name> --endpoint <url> --release <dir> [--run <id>] [--dry-run]
//   node workers/games/publish.mjs rollback --bucket <name> --endpoint <url> [--run <id>] [--dry-run]
//   node workers/games/publish.mjs media    --bucket <name> --endpoint <url> --dir <folder> --manifest <music.json> [--dry-run]
//   node workers/games/publish.mjs media    --kind models --bucket <name> --endpoint <url> --dir <folder> --manifest <gaming/art/manifest.json> [--dry-run]
//
// The music is not part of a release: the audio is never in git, so it is uploaded on its own, to games/media/music/,
// and only the tracks the manifest names, each checked against the size and SHA-256 the manifest records.
//
// What it may touch: objects under games/ and nothing else. What it never does: delete or overwrite a release.
// A release folder (games/r/<id>/) is written once; releasing and rolling back change one small file, the pointer.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CHANNEL_KEY, PREFIX, RELEASE_ID, contentType, mediaKey, parseChannel, releaseKey } from "./src/route.js";

/** A release id from its manifest: the commit's date and the first eleven characters of its hash. */
export function releaseIdOf(manifest) {
  const date = String(manifest?.commitDate ?? "").slice(0, 10).replaceAll("-", "");
  const id = `${date}-${String(manifest?.commit ?? "").slice(0, 11)}`;
  if (!RELEASE_ID.test(id)) throw new Error(`the manifest does not give a usable commit and date (got "${id}")`);
  return id;
}

/** The pointer after releasing `id`. Releasing what is already live changes nothing and returns the pointer as it was. */
export function nextPointer(old, id, commit, now, run = null) {
  if (!RELEASE_ID.test(id)) throw new Error(`"${id}" is not a release id`);
  if (old && old.current === id) return old;
  return { format: "im.play.channel", version: 1, current: id, previous: old ? old.current : null, commit, updatedAt: now, run };
}

/**
 * The tracks a manifest names, each with the bytes found for it in `dir`. Throws unless every track is there with
 * exactly the size and SHA-256 the manifest records: nothing else can be published as the museum's music.
 */
export function tracksToPublish(manifest, dir, read = readFileSync, exists = existsSync) {
  const tracks = manifest?.tracks;
  if (!Array.isArray(tracks) || tracks.length === 0) throw new Error("the manifest names no track");
  return tracks.map((t) => {
    if (typeof t.file !== "string" || !/^[a-z0-9][a-z0-9.-]*\.m4a$/.test(t.file)) throw new Error(`"${t.file}" is not a track file name`);
    const path = join(dir, t.file);
    if (!exists(path)) throw new Error(`${t.file} is not in ${dir}`);
    const bytes = read(path);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (bytes.length !== t.bytes || sha256 !== t.sha256) throw new Error(`${t.file} is not the file the manifest records (${bytes.length} bytes, SHA-256 ${sha256.slice(0, 12)}…)`);
    return { file: t.file, path, bytes: bytes.length, sha256, key: mediaKey(`media/music/${t.file}`) };
  });
}

/** A model file's name where there are no folders (the assets of a release): "granada/mill.gltf" is "granada__mill.gltf". */
export const flatName = (path) => path.replaceAll("/", "__");
const MODEL_FILE = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9_-]*)*\/[a-z0-9][a-z0-9_-]*\.(gltf|bin|jpg|webp)$/;

/**
 * The model files an art manifest names, each with the bytes found for it in `dir` (under its own path, or under its
 * flat name). Throws unless every file is there with exactly the size and SHA-256 the manifest records: nothing else
 * can be published as one of the games' models. A file shared by several assets is published once.
 */
export function modelsToPublish(manifest, dir, read = readFileSync, exists = existsSync) {
  if (manifest?.format !== "im.play.art" || !Array.isArray(manifest.assets) || manifest.assets.length === 0) throw new Error("the manifest names no asset");
  const named = new Map();
  for (const asset of manifest.assets) {
    if (!Array.isArray(asset?.files) || asset.files.length === 0) throw new Error(`asset "${asset?.id}" names no file`);
    for (const f of asset.files) {
      if (typeof f?.path !== "string" || !MODEL_FILE.test(f.path) || f.path.includes("__")) throw new Error(`"${f?.path}" is not a model file's path`);
      const before = named.get(f.path);
      if (before && (before.sha256 !== f.sha256 || before.bytes !== f.bytes)) throw new Error(`${f.path} is recorded twice, with different contents`);
      named.set(f.path, f);
    }
  }
  return [...named.values()].map((f) => {
    const path = [join(dir, f.path), join(dir, flatName(f.path))].find((p) => exists(p));
    if (!path) throw new Error(`${f.path} is not in ${dir}`);
    const bytes = read(path);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (bytes.length !== f.bytes || sha256 !== f.sha256) throw new Error(`${f.path} is not the file the manifest records (${bytes.length} bytes, SHA-256 ${sha256.slice(0, 12)}…)`);
    return { file: f.path, path, bytes: bytes.length, sha256, key: mediaKey(`media/models/${f.path}`), contentType: contentType(f.path) };
  });
}

/** The pointer after going back to the release before. There must be one. */
export function rollbackPointer(old, now, run = null) {
  if (!old) throw new Error("nothing has been released, so there is nothing to roll back");
  if (!old.previous) throw new Error(`the live release ${old.current} has no release before it to go back to`);
  return { format: "im.play.channel", version: 1, current: old.previous, previous: old.current, commit: old.previous.slice(9), updatedAt: now, run };
}

// ---- Everything below talks to the bucket ------------------------------------------------------------------------

function main() {
  const [action, ...rest] = process.argv.slice(2);
  const opt = (name) => {
    const i = rest.indexOf(`--${name}`);
    return i >= 0 ? rest[i + 1] : undefined;
  };
  const dry = rest.includes("--dry-run");
  const replace = new Set((opt("replace") ?? "").split(",").map((x) => x.trim()).filter(Boolean));
  const bucket = opt("bucket");
  const endpoint = opt("endpoint");
  const run = opt("run") ?? null;
  if (!["status", "release", "rollback", "media"].includes(action) || !bucket || !endpoint) {
    console.error("usage: node workers/games/publish.mjs <status|release|rollback|media> --bucket <name> --endpoint <url> [--release <dir>] [--dir <folder> --manifest <music.json>] [--run <id>] [--dry-run]");
    process.exit(2);
  }
  const s3 = (key) => {
    if (!key.startsWith(PREFIX)) throw new Error(`refusing to touch ${key}: it is not under ${PREFIX}`);
    return `s3://${bucket}/${key}`;
  };
  const aws = (args, options = {}) => execFileSync("aws", [...args, "--endpoint-url", endpoint], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024, ...options });
  /** An object's text, or null if it is not there. Any other failure stops the run. */
  const read = (key) => {
    try {
      return aws(["s3", "cp", s3(key), "-", "--only-show-errors"]);
    } catch (e) {
      const text = `${e.stderr ?? ""}${e.message ?? ""}`;
      if (/\(404\)|Not Found|NoSuchKey|does not exist/i.test(text)) return null;
      throw new Error(`could not read ${key}: ${text.trim()}`);
    }
  };
  const readPointer = () => {
    const text = read(CHANNEL_KEY);
    if (text === null) return null;
    const pointer = parseChannel(text);
    if (!pointer) throw new Error(`${CHANNEL_KEY} is in the bucket and is not a well-formed pointer: look at it before releasing over it`);
    return pointer;
  };
  const writePointer = (pointer) => {
    const dir = mkdtempSync(join(tmpdir(), "im-games-pointer-"));
    const file = join(dir, "channel.json");
    writeFileSync(file, `${JSON.stringify(pointer, null, 1)}\n`);
    aws(["s3", "cp", file, s3(CHANNEL_KEY), "--only-show-errors", "--content-type", "application/json", "--cache-control", "no-store"], { stdio: "inherit" });
    rmSync(dir, { recursive: true, force: true });
  };
  const now = new Date().toISOString();
  const say = (line) => console.log(line);

  if (action === "media") {
    const kind = opt("kind") ?? "music";
    if (kind !== "music" && kind !== "models") throw new Error(`--kind must be music or models, not ${kind}`);
    const named = JSON.parse(readFileSync(resolve(opt("manifest") ?? ""), "utf8"));
    const tracks = kind === "models" ? modelsToPublish(named, resolve(opt("dir") ?? "")) : tracksToPublish(named, resolve(opt("dir") ?? ""));
    const shaOf = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
    /** Fetches an object to a file. Returns false if it is not in the bucket. */
    const fetchTo = (key, file) => {
      try {
        aws(["s3", "cp", s3(key), file, "--only-show-errors"]);
        return true;
      } catch (e) {
        const text = `${e.stderr ?? ""}${e.message ?? ""}`;
        if (/\(404\)|Not Found|NoSuchKey|does not exist/i.test(text)) return false;
        throw new Error(`could not read ${key}: ${text.trim()}`);
      }
    };
    const work = mkdtempSync(join(tmpdir(), "im-games-media-"));
    let uploaded = 0;
    for (const t of tracks) {
      const copy = join(work, flatName(t.file));
      if (fetchTo(t.key, copy)) {
        if (shaOf(copy) === t.sha256) {
          say(`${t.file}: already in the bucket, identical`);
          continue;
        }
        // A corrected model has to replace the file at the same address. That is never implicit: the exact model
        // path must be named in --replace after a check has shown the difference is the intended one.
        if (kind !== "models" || !replace.has(t.file)) throw new Error(`${t.key} is in the bucket with other contents. It is not overwritten: this needs a look`);
        say(`${t.file}: ${dry ? "would replace" : "replacing"} ${(t.bytes / 1048576).toFixed(2)} MB, as explicitly allowed`);
      } else say(`${t.file}: ${dry ? "would upload" : "uploading"} ${(t.bytes / 1048576).toFixed(2)} MB`);
      if (dry) continue;
      aws(["s3", "cp", t.path, s3(t.key), "--only-show-errors", "--content-type", t.contentType ?? "audio/mp4"], { stdio: "inherit" });
      if (!fetchTo(t.key, copy) || shaOf(copy) !== t.sha256) throw new Error(`${t.key} did not read back as it was sent`);
      uploaded += 1;
    }
    rmSync(work, { recursive: true, force: true });
    say(`${tracks.length} ${kind === "models" ? "model files" : "tracks"} checked against the manifest; ${uploaded} uploaded${dry ? " (dry run: nothing written)" : ""}`);
    return;
  }

  const pointer = readPointer();
  say(pointer ? `live: ${pointer.current} (before it: ${pointer.previous ?? "none"}), set ${pointer.updatedAt ?? "at an unknown time"}` : "nothing has been released into this bucket yet");

  if (action === "status") return;

  if (action === "rollback") {
    const next = rollbackPointer(pointer, now, run);
    if (read(releaseKey(next.current, "release.json")) === null) throw new Error(`release ${next.current} is not in the bucket any more, so the pointer is left where it is`);
    say(`${dry ? "would roll back" : "rolling back"} from ${pointer.current} to ${next.current}`);
    if (!dry) writePointer(next);
    return;
  }

  const dir = resolve(opt("release") ?? "");
  const manifestText = readFileSync(join(dir, "release.json"), "utf8");
  const manifest = JSON.parse(manifestText);
  const id = releaseIdOf(manifest);
  const check = fileURLToPath(new URL("../../gaming/tools/check-release.mjs", import.meta.url));
  execFileSync("node", [check, dir, "--expect-commit", manifest.commit], { stdio: "inherit" });

  const there = read(releaseKey(id, "release.json"));
  if (there !== null && there !== manifestText) throw new Error(`release ${id} is already in the bucket with a different manifest. A release is never overwritten: this needs a look`);
  if (there !== null) say(`release ${id} is already in the bucket, identical: nothing to upload`);
  else {
    say(`${dry ? "would upload" : "uploading"} ${manifest.files.length} files, ${(manifest.totalBytes / 1048576).toFixed(2)} MB, to ${s3(releaseKey(id, ""))}`);
    if (!dry) {
      // The manifest goes last: its presence in the bucket means every other file is there.
      aws(["s3", "cp", dir, s3(releaseKey(id, "")), "--recursive", "--exclude", "release.json", "--only-show-errors"], { stdio: "inherit" });
      aws(["s3", "cp", join(dir, "release.json"), s3(releaseKey(id, "release.json")), "--only-show-errors"], { stdio: "inherit" });
    }
  }
  if (!dry) {
    // Read the whole release back and check it against its manifest, before anything points at it.
    const back = mkdtempSync(join(tmpdir(), "im-games-verify-"));
    aws(["s3", "cp", s3(releaseKey(id, "")), back, "--recursive", "--only-show-errors"], { stdio: "inherit" });
    execFileSync("node", [check, back, "--expect-commit", manifest.commit], { stdio: "inherit" });
    rmSync(back, { recursive: true, force: true });
    say(`the bucket's copy of ${id} matches its manifest`);
  }
  const next = nextPointer(pointer, id, manifest.commit, now, run);
  if (next === pointer) say(`${id} is already the live release: the pointer is left as it is`);
  else {
    say(`${dry ? "would make" : "making"} ${id} live (before it: ${next.previous ?? "none"})`);
    if (!dry) writePointer(next);
  }
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `release_id=${id}\n`, { flag: "a" });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main();
  } catch (e) {
    console.error(`::error::${e.message}`);
    process.exit(1);
  }
}
