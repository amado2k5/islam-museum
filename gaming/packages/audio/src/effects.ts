// The games' sound effects: short sounds made in the browser from tones and noise, so there are no recordings to host
// or licences to clear. They start only after the player has touched the page, have their own on/off and loudness kept
// on the device apart from the music's, and each lasts under half a second.

export type Effect = "tap" | "build" | "coin" | "water" | "harvest" | "refuse" | "season";
export const EFFECTS_KEY = "im.play.effects.v1";
export interface EffectPrefs {
  on: boolean;
  volume: number;
}
export const DEFAULT_EFFECTS: EffectPrefs = { on: true, volume: 0.35 };

export function readEffectPrefs(raw: string | null): EffectPrefs {
  try {
    const o = raw ? (JSON.parse(raw) as Partial<EffectPrefs>) : {};
    return { on: typeof o.on === "boolean" ? o.on : DEFAULT_EFFECTS.on, volume: typeof o.volume === "number" && o.volume >= 0 && o.volume <= 1 ? o.volume : DEFAULT_EFFECTS.volume };
  } catch {
    return { ...DEFAULT_EFFECTS };
  }
}

/** What each effect is made of: tones (frequency in hertz, start and length in seconds) and, for some, a burst of noise. */
export const RECIPES: Record<Effect, { tones: Array<[number, number, number]>; noise?: [number, number, number]; shape: OscillatorType }> = {
  tap: { tones: [[660, 0, 0.05]], shape: "sine" },
  build: { tones: [[196, 0, 0.12], [147, 0.08, 0.16]], noise: [0, 0.09, 900], shape: "triangle" },
  coin: { tones: [[988, 0, 0.08], [1319, 0.07, 0.14]], shape: "sine" },
  water: { tones: [[440, 0, 0.12], [523, 0.06, 0.12], [587, 0.12, 0.14]], noise: [0, 0.3, 2400], shape: "sine" },
  harvest: { tones: [[392, 0, 0.1], [494, 0.08, 0.1], [587, 0.16, 0.18]], shape: "triangle" },
  refuse: { tones: [[220, 0, 0.09], [185, 0.08, 0.12]], shape: "square" },
  season: { tones: [[523, 0, 0.3], [659, 0.1, 0.3], [784, 0.2, 0.32]], shape: "sine" },
};

export class Effects {
  private ctx: AudioContext | null = null;
  private prefs: EffectPrefs;
  private touched = false;
  constructor(private readonly storage: Storage | null = typeof localStorage === "undefined" ? null : localStorage) {
    this.prefs = readEffectPrefs(this.read());
    if (typeof window !== "undefined") {
      const first = () => {
        this.touched = true;
        window.removeEventListener("pointerdown", first);
        window.removeEventListener("keydown", first);
      };
      window.addEventListener("pointerdown", first);
      window.addEventListener("keydown", first);
    }
  }
  get on(): boolean {
    return this.prefs.on;
  }
  set(on: boolean): void {
    this.prefs = { ...this.prefs, on };
    try {
      this.storage?.setItem(EFFECTS_KEY, JSON.stringify(this.prefs));
    } catch {
      // The choice holds for this visit.
    }
  }
  play(effect: Effect): void {
    if (!this.prefs.on || !this.touched || typeof AudioContext === "undefined") return;
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === "suspended") void this.ctx.resume();
      const ctx = this.ctx;
      const t0 = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.value = this.prefs.volume ** 2;
      out.connect(ctx.destination);
      const r = RECIPES[effect];
      for (const [f, at, len] of r.tones) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = r.shape;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + at);
        g.gain.exponentialRampToValueAtTime(0.5, t0 + at + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
        o.connect(g).connect(out);
        o.start(t0 + at);
        o.stop(t0 + at + len + 0.02);
      }
      if (r.noise) {
        const [at, len, cut] = r.noise;
        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        // A fixed pattern, not Math.random: the same sound every time.
        for (let i = 0; i < data.length; i++) data[i] = Math.sin(i * 12.9898) * 43758.5453 % 1;
        const src = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        src.buffer = buffer;
        filter.type = "lowpass";
        filter.frequency.value = cut;
        g.gain.setValueAtTime(0.25, t0 + at);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
        src.connect(filter).connect(g).connect(out);
        src.start(t0 + at);
      }
    } catch {
      // A browser that cannot make the sound plays the game without it.
    }
  }
  private read(): string | null {
    try {
      return this.storage?.getItem(EFFECTS_KEY) ?? null;
    } catch {
      return null;
    }
  }
}
