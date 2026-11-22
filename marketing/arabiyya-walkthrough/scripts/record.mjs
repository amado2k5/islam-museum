// Record the scenes of one language in one shape from the live site.
//   node scripts/record.mjs en|ar wide|tall [scene ids...]
// Needs build/<lang>/plan.json (scripts/plan.mjs). Writes footage/<lang>/<shape>/<scene>.mp4 and a .json beside it.
import { readFileSync, mkdirSync } from "node:fs";
import { Rec } from "./rec.mjs";
import { SHOTS } from "./shots.mjs";
import { ROOT } from "./units.mjs";
export const SHAPES = { wide: { width: 1280, height: 720, dpr: 1.5, kind: "mouse" }, tall: { width: 540, height: 650, dpr: 2, kind: "touch" } };
const [lang, shape, ...only] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(`${ROOT}build/${lang}/plan.json`, "utf8"));
const out = `${ROOT}footage/${lang}/${shape}/`; mkdirSync(out, { recursive: true });
let failed = 0;
for (const s of plan.scenes) {
  if (!SHOTS[s.id] || (only.length && !only.includes(s.id))) continue;
  const t0 = Date.now();
  const r = await Rec.open({ ...SHAPES[shape], lang });
  const c = { lang, tall: shape === "tall", dir: out + s.id + ".frames", end: s.dur, at: (u) => s.cues[u].at, cue: (u) => s.cues[u] };
  try {
    await SHOTS[s.id](r, c);
    if (r.n !== s.frames) console.log(`  note: ${s.id} recorded ${r.n} frames, planned ${s.frames}`);
    const res = r.end(out + s.id + ".mp4");
    console.log(`${s.id.padEnd(11)} ${res.frames} frames  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  } catch (e) { failed++; console.log(`${s.id.padEnd(11)} FAILED: ${String(e.stack || e).split("\n").slice(0, 4).join(" | ")}`); }
  await r.close();
}
process.exit(failed ? 1 : 0);
