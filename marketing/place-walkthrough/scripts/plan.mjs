// Time the film from the voice. Reads the length of every sentence's audio and writes build/<lang>/plan.json:
// where each scene starts, how long it lasts, and when each sentence starts inside it. The recorder and the
// composition both read this file, so pictures and voice cannot drift apart.
//   node scripts/plan.mjs en|ar
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { ROOT, units } from "./units.mjs";
import { SCENES, GAP } from "./scenes.mjs";
export const FPS = 30;
const dur = (f) => +spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).stdout.trim();
export function plan(lang) {
  const U = Object.fromEntries(units(lang).map((u) => [u.id, u]));
  let t = 0; const scenes = [];
  for (const s of SCENES) {
    let x = s.lead; const cues = {};
    s.units.forEach((id, i) => {
      const f = `${ROOT}voice/${lang}/${id}.wav`;
      if (!existsSync(f)) throw new Error("missing voice file " + f);
      const d = dur(f);
      cues[id] = { at: +x.toFixed(3), dur: +d.toFixed(3), show: U[id].show };
      x += d + (i < s.units.length - 1 ? (s.gap?.[id] ?? GAP) : 0);
    });
    const frames = Math.ceil((x + s.tail) * FPS);
    scenes.push({ id: s.id, look: s.look, start: +(t / FPS).toFixed(4), startFrame: t, frames, dur: +(frames / FPS).toFixed(4), cues });
    t += frames;
  }
  return { lang, fps: FPS, frames: t, dur: +(t / FPS).toFixed(3), scenes };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const lang = process.argv[2] || "en", p = plan(lang);
  mkdirSync(`${ROOT}build/${lang}`, { recursive: true });
  writeFileSync(`${ROOT}build/${lang}/plan.json`, JSON.stringify(p, null, 1));
  for (const s of p.scenes) console.log(s.id.padEnd(11), String(s.start.toFixed(1)).padStart(6), s.dur.toFixed(1).padStart(5), Object.keys(s.cues).join(" "));
  console.log("total", p.dur, "s =", Math.floor(p.dur / 60) + ":" + String(Math.round(p.dur % 60)).padStart(2, "0"));
}
