// The narration is spoken, timed and captioned sentence by sentence. A unit is one sentence of one script line:
// line "d6" with two sentences gives the units d6_0 and d6_1.
import { readFileSync } from "node:fs";
export const ROOT = new URL("..", import.meta.url).pathname;
export const splitSentences = (t) => t.trim().split(/(?<=[.?!؟])\s+/).filter((s) => s.trim());
export function script(lang) { return JSON.parse(readFileSync(`${ROOT}script/${lang}.json`, "utf8")); }
export function units(lang) {
  const out = [];
  for (const l of script(lang).lines) {
    const say = splitSentences(l.say), show = splitSentences(l.show);
    if (say.length !== show.length) throw new Error(`${lang} ${l.id}: ${say.length} spoken sentences but ${show.length} shown`);
    say.forEach((s, k) => out.push({ id: `${l.id}_${k}`, line: l.id, k, say: s, show: show[k], speed: l.speed }));
  }
  return out;
}
