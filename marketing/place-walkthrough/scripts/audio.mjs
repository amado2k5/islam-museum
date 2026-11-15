// Lay the narration on the film's clock and set its level.
//   node scripts/audio.mjs en|ar
// Writes build/<lang>/audio/voice.wav (every sentence at its planned second, loudness set for social platforms) and
// copies the music bed beside it. The music is the museum's own track "Fourteen Centuries"; it is not in git, so
// the path to it is given in MUSIC (default: the founder's Music library).
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { ROOT } from "./units.mjs";
const lang = process.argv[2];
const plan = JSON.parse(readFileSync(`${ROOT}build/${lang}/plan.json`, "utf8"));
const out = `${ROOT}build/${lang}/audio/`; mkdirSync(out, { recursive: true });
const inputs = [], filters = [], labels = [];
let i = 0;
for (const s of plan.scenes) for (const [id, cue] of Object.entries(s.cues)) {
  inputs.push("-i", `${ROOT}voice/${lang}/${id}.wav`);
  const ms = Math.round((s.start + cue.at) * 1000);
  // a 12 ms fade at each edge removes the click of a cut sentence
  filters.push(`[${i}:a]aresample=48000,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,adelay=${ms}:all=1[v${i}]`);
  labels.push(`[v${i}]`); i++;
}
filters.push(`${labels.join("")}amix=inputs=${i}:normalize=0:dropout_transition=0,loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000,apad=whole_dur=${plan.dur + 0.5}[out]`);
const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-ac", "2", "-t", String(plan.dur), out + "voice.wav"], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
const music = process.env.MUSIC || `${process.env.HOME}/Music/Music/Media.localized/Music/stemoven/Unknown Album/Fourteen Centuries (Restructured).mp3`;
if (existsSync(music)) {
  // The bed: the track's wide dynamics are evened out so it sits steadily under the voice (about 14 dB below it),
  // then it rises once the last sentence has been said and fades with the end card.
  const end = plan.scenes[plan.scenes.length - 1], lastCue = Object.values(end.cues).pop();
  const t1 = +(end.start + lastCue.at + lastCue.dur + 0.15).toFixed(2), under = 0.2, up = 0.62;
  const env = `volume='if(lt(t,${t1}),${under},if(lt(t,${t1 + 1.4}),${under}+(${up}-${under})*(t-${t1})/1.4,${up}))':eval=frame`;
  const m = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", music, "-af",
    `loudnorm=I=-16:LRA=5:TP=-2,aresample=48000,${env},afade=t=in:d=0.6,afade=t=out:st=${(plan.dur - 1.7).toFixed(2)}:d=1.7`,
    "-ac", "2", "-t", String(plan.dur), out + "bed.wav"], { encoding: "utf8" });
  if (m.status !== 0) { console.error(m.stderr); process.exit(1); }
} else console.log("no music file at", music, "- set MUSIC=<file> to add the bed; the film needs", out + "bed.wav");
console.log("voice.wav", plan.dur, "s;", i, "sentences");
