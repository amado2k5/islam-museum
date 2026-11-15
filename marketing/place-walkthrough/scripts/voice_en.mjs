// English narration: Kokoro on this machine (Apache-2.0), voice af_heart, one file per sentence of script/en.json.
//   node scripts/voice_en.mjs [unit ids...]
import { mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { ROOT, script, units } from "./units.mjs";
const s = script("en"), only = process.argv.slice(2);
mkdirSync(ROOT + "voice/en", { recursive: true });
for (const u of units("en")) {
  if (only.length && !only.includes(u.id) && !only.includes(u.line)) continue;
  const out = `${ROOT}voice/en/${u.id}.wav`;
  const r = spawnSync("npx", ["--yes", "hyperframes@0.9.52", "tts", u.say, "-v", s.voice.voice, "-s", String(u.speed || s.voice.speed), "-o", out, "--json"],
    { encoding: "utf8", env: { ...process.env, HYPERFRAMES_PYTHON: ROOT + ".venv-kokoro/bin/python" } });
  console.log(u.id, r.status === 0 && existsSync(out) ? "ok" : "FAILED " + (r.stderr || r.stdout).slice(-300));
}
