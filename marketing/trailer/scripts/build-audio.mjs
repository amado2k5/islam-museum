// Synthesises the trailer's percussion-and-drone bed (assets/audio/bed.wav). No samples, no
// melody: sub booms, a low brass-like swell, drum hits on the 100 BPM grid and a drone.
// Every sound is a function of the shot list in SPEC.md. Run: node scripts/build-audio.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000, DUR = 38.4, N = SR * DUR, BEAT = 0.6;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 20261114;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const add = (t0, len, fn) => {
  const s0 = Math.round(t0 * SR), n = Math.round(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    if (s0 + i < 0) continue;
    const [l, r] = fn(i / SR, i);
    L[s0 + i] += l; R[s0 + i] += r;
  }
};
const saw = (ph, harmonics) => { let v = 0; for (let k = 1; k <= harmonics; k++) v += Math.sin(ph * k) / k; return v * 0.6; };

// Sub boom: a sine dropping from ~90 Hz to 38 Hz, driven so a phone speaker still gets harmonics.
const boom = (t0, g, len = 2.4) => {
  let ph = 0, lp = 0;
  add(t0, len, (t) => {
    const f = 38 + 55 * Math.exp(-t * 16);
    ph += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t * 2.0) * Math.min(1, t / 0.003);
    lp += 0.25 * (rnd() - lp);
    const crack = lp * Math.exp(-t * 55) * 0.9;
    const v = Math.tanh((Math.sin(ph) * 2.6 + Math.sin(ph * 2) * 0.5) * env) * g + crack * g;
    return [v, v];
  });
};
// Braam: stacked detuned saws on A, an octave and a fifth, bright at the hit and darkening.
const braam = (t0, len, g) => {
  const fs = [27.5, 55, 55.5, 110.4, 82.6, 165.2], ph = fs.map(() => 0);
  add(t0, len, (t) => {
    const env = Math.min(1, t / 0.035) * Math.min(1, (len - t) / (len * 0.55));
    const h = Math.max(2, Math.round(3 + 14 * Math.exp(-t * 1.6)));
    let l = 0, r = 0;
    fs.forEach((f, k) => {
      ph[k] += (2 * Math.PI * f * (1 - 0.012 * Math.exp(-t * 9))) / SR;
      const v = saw(ph[k], Math.min(h, Math.floor(2400 / f)));
      l += v * (k % 2 ? 0.8 : 1); r += v * (k % 2 ? 1 : 0.8);
    });
    return [Math.tanh(l * 0.9) * env * g, Math.tanh(r * 0.9) * env * g];
  });
};
// Drum: a low frame-drum-like thump with a short skin noise.
const drum = (t0, g, f0 = 95) => {
  let ph = 0, lp = 0;
  add(t0, 0.5, (t) => {
    ph += (2 * Math.PI * (52 + (f0 - 52) * Math.exp(-t * 30))) / SR;
    lp += 0.5 * (rnd() - lp);
    const v = Math.tanh(Math.sin(ph) * 2.2 * Math.exp(-t * 11)) * g + lp * Math.exp(-t * 70) * g * 0.7;
    return [v, v];
  });
};
// Tick: a dry high noise tap on the off-beat.
const tick = (t0, g, pan) => {
  let prev = 0;
  add(t0, 0.06, (t) => { const n = rnd(); const hp = n - prev; prev = n; const v = hp * Math.exp(-t * 120) * g; return [v * (1 - pan), v * (1 + pan)]; });
};
// Noise swell rising into a hit.
const swell = (t0, len, g) => {
  let lp = 0;
  add(t0, len, (t) => {
    const x = t / len, k = 0.02 + 0.5 * x * x;
    lp += k * (rnd() - lp);
    const v = lp * x * x * x * g * 3;
    return [v, v * 0.92];
  });
};
// Drone on A with a slow beat between two voices; `level(t)` shapes it across the film.
const level = (t) => {
  if (t < 4.8) return 0.1;
  if (t < 7.02) return 0.1 + 0.32 * ((t - 4.8) / 2.22) ** 2;
  if (t < 7.2) return 0;
  if (t < 10.8) return 0.13;
  if (t < 33.3) return 0.15;
  if (t < 33.6) return 0;
  return 0.2 * Math.max(0, 1 - (t - 33.6) / 4.5) ** 1.5;
};
{
  let a = 0, b = 0, c = 0;
  add(0, DUR, (t) => {
    a += (2 * Math.PI * 55) / SR; b += (2 * Math.PI * 55.31) / SR; c += (2 * Math.PI * 82.5) / SR;
    const bright = t >= 4.8 && t < 7.02 ? 4 + Math.round(10 * ((t - 4.8) / 2.22)) : 5;
    const g = level(t);
    return [(saw(a, bright) + 0.5 * saw(c, 3)) * g, (saw(b, bright) + 0.5 * saw(c, 3)) * g];
  });
}

// --- the shot list -------------------------------------------------------------------------
[0, 1.2, 2.4].forEach((t, i) => { boom(t, 0.85); braam(t, 1.0, 0.16 + 0.03 * i); });
swell(4.8, 2.22, 0.5);
for (let t = 4.8; t < 7.0; t += 0.3) drum(t, 0.25 + 0.3 * ((t - 4.8) / 2.2), 80);
boom(7.2, 1.0, 3); braam(7.2, 2.3, 0.42);                       // the name
for (let b = 0; 10.8 + b * BEAT < 25.2 - 1e-6; b++) {               // proof: one drum a beat
  const t = 10.8 + b * BEAT;
  if (b % 4 === 0) { boom(t, 0.8); braam(t, 0.5, 0.14); } else drum(t, b % 4 === 2 ? 0.55 : 0.4);
  tick(t + 0.3, 0.16, b % 2 ? 0.3 : -0.3);
  if (b % 4 === 3) drum(t + 0.3, 0.35, 120);
}
for (let k = 0; k < 9; k++) { const t = 25.2 + k * 0.4; drum(t, 0.7, 120 + 8 * k); tick(t + 0.2, 0.14, k % 2 ? 0.4 : -0.4); }
boom(25.2, 0.7);
boom(28.8, 0.95, 2.6); braam(28.8, 1.8, 0.28);                   // nine wings, one museum
[30.3, 30.6, 30.9, 31.05].forEach((t, i) => drum(t, 0.4 + 0.1 * i, 110));
[31.2, 31.8, 32.4].forEach((t, i) => { boom(t, 0.95); braam(t, 0.55, 0.2 + 0.05 * i); });
swell(32.4, 0.9, 0.35);
boom(33.6, 1.0, 4.6); braam(33.6, 4.4, 0.5);                     // the mark
drum(34.8, 0.3, 80);                                             // the button lands

// --- master: soft clip, then peak at -1.5 dBFS ---------------------------------------------
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.15); R[i] = Math.tanh(R[i] * 1.15); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const norm = 0.84 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * norm * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * norm * 32767), 46 + i * 4); }
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "audio");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "bed.wav"), buf);
console.log("bed.wav", DUR, "s, peak before normalise", peak.toFixed(3));
