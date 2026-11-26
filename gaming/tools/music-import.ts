// Turns the museum's six soundtrack masters (WAV) into the files the games play, and records what was made.
// Usage: npx tsx tools/music-import.ts <folder holding 01_*.wav ... 06_*.wav>
//
// Each track is measured (EBU R 128 integrated loudness and true peak), given one fixed gain so the six sit at the
// same level without touching their dynamics, and encoded as AAC in an MP4 container, which every current browser
// plays. The encoded files go to gaming/media/music/ (never committed: media does not live in git) and their names,
// lengths, sizes and SHA-256 digests go to packages/audio/music.json (committed), so a deployment can be checked
// against what was imported.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_LUFS = -16;
const PEAK_CEILING = -1.5;
const BITRATE = "160k";
/** The suite as the museum names it on its Backstage page. Titles are not translated. */
const TRACKS = [
  { n: 1, id: "fourteen-centuries", title: "Fourteen Centuries" },
  { n: 2, id: "the-ancient-library", title: "The Ancient Library" },
  { n: 3, id: "the-first-light", title: "The First Light" },
  { n: 4, id: "threshold-of-the-unknown", title: "Threshold of the Unknown" },
  { n: 5, id: "the-unbroken-seals", title: "The Unbroken Seals" },
  { n: 6, id: "leaving-the-museum", title: "Leaving the Museum" },
] as const;

const from = process.argv[2];
if (!from) throw new Error("usage: music-import.ts <folder with the six WAV masters>");
const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = resolve(root, "media/music");
mkdirSync(outDir, { recursive: true });
const files = readdirSync(from);
/** ffmpeg writes its report to stderr; run it and return that text. */
const ffmpeg = (args: string[]): string => {
  try {
    return execFileSync("ffmpeg", ["-hide_banner", "-nostdin", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    throw new Error(`ffmpeg failed: ${(e as { stderr?: string }).stderr ?? e}`);
  }
};
const tracks = [];
for (const t of TRACKS) {
  const name = files.find((f) => f.toLowerCase().endsWith(".wav") && f.startsWith(String(t.n).padStart(2, "0")));
  if (!name) throw new Error(`no WAV beginning ${String(t.n).padStart(2, "0")} in ${from}`);
  const src = resolve(from, name);
  // Pass 1: measure. The summary is the last block of ffmpeg's report.
  const probe = execFileSync("sh", ["-c", `ffmpeg -hide_banner -nostdin -i "$1" -af ebur128=peak=true -f null - 2>&1 | tail -14`, "sh", src], { encoding: "utf8" });
  const lufs = Number(/I:\s+(-?[\d.]+) LUFS/.exec(probe)?.[1]);
  const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(probe)?.[1]);
  if (!Number.isFinite(lufs) || !Number.isFinite(peak)) throw new Error(`could not measure ${name}:\n${probe}`);
  // One fixed gain: up or down to the target, but never so far that the true peak passes the ceiling.
  const gain = Math.round(Math.min(TARGET_LUFS - lufs, PEAK_CEILING - peak) * 10) / 10;
  const file = `${String(t.n).padStart(2, "0")}-${t.id}.m4a`;
  const out = resolve(outDir, file);
  ffmpeg(["-y", "-i", src, "-map", "0:a:0", "-map_metadata", "-1", "-af", `volume=${gain}dB`, "-c:a", "aac", "-b:a", BITRATE, "-ar", "44100", "-ac", "2", "-movflags", "+faststart", "-metadata", `title=${t.title}`, "-metadata", "album=Voices of the Museum", "-metadata", "artist=islam.museum", "-metadata", `track=${t.n}/6`, out]);
  const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }).trim());
  const bytes = statSync(out).size;
  const sha256 = createHash("sha256").update(readFileSync(out)).digest("hex");
  tracks.push({ n: t.n, id: t.id, title: t.title, file, seconds: Math.round(seconds * 10) / 10, bytes, sha256, source: { file: name, lufs, truePeakDb: peak, gainDb: gain } });
  console.log(`${file}  ${seconds.toFixed(1)} s  ${(bytes / 1e6).toFixed(2)} MB  source ${lufs} LUFS, peak ${peak} dBFS, gain ${gain} dB`);
}
const manifest = {
  format: "im.play.music",
  version: 1,
  suite: "Voices of the Museum",
  // What the museum itself says about the suite (site Backstage page, i18n key backstage.music_1), not a new claim.
  provenance: "The museum's own six-track suite. Fully AI-generated: composed and generated in Google Flow with Lyria, around the founder's oud playing as the musical reference.",
  about: "/backstage/",
  listen: "https://soundcloud.com/islam-museum/sets/voices-of-the-museum",
  suppliedBy: "The founder, as WAV masters, 25 November 2026",
  encoding: { codec: "AAC-LC", container: "MP4 (.m4a)", bitrate: BITRATE, targetLufs: TARGET_LUFS, peakCeilingDb: PEAK_CEILING },
  tracks,
};
writeFileSync(resolve(root, "packages/audio/music.json"), `${JSON.stringify(manifest, null, 1)}\n`);
console.log(`wrote packages/audio/music.json and ${tracks.length} files in ${outDir}`);
