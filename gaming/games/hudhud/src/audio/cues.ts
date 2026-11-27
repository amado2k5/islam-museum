// The scene's own sounds, made by arithmetic in the browser: there is no sound file to license, host or load. The
// music is not here: it is the museum's suite, played by the shared player every game uses (@im/audio).
//
// Three groups with their own volume, as the settings offer: the room (ambience), the characters (the hoopoe's call,
// the purr), and effects (a mirror turning, the page's chime). Nothing sounds before the player's first press, and
// everything stops while the tab is hidden. Every sound that means something has a caption (ui/app.ts).
export type Group = "ambience" | "voices" | "effects";
export type Cue = "mirror" | "restored" | "purr" | "flap" | "hop" | "land" | "dark" | "light" | "secret" | "call" | "feather" | "line" | "gong" | "part";

export class Cues {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private readonly groups = new Map<Group, GainNode>();
  private ambience: { stop(): void } | null = null;
  private volume: Record<Group, number> = { ambience: 0.6, voices: 0.8, effects: 0.8 };
  private muted = false;
  private noise: AudioBuffer | null = null;
  /** How many sounds have been started, for the resource counters. */
  started = 0;

  /** Call from a click or a key press: browsers allow sound only then. */
  unlock(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    for (const g of ["ambience", "voices", "effects"] as Group[]) {
      const node = this.ctx.createGain();
      node.connect(this.master);
      this.groups.set(g, node);
    }
    // One second of soft noise, made from a fixed recurrence so that it is the same everywhere.
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let s = 0x2545f491;
    for (let i = 0; i < d.length; i++) {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      d[i] = ((s >>> 0) / 4294967296) * 2 - 1;
    }
    this.apply();
    this.startAmbience();
  }
  set(volume: Record<Group, number>, muted: boolean): void {
    this.volume = volume;
    this.muted = muted;
    this.apply();
  }
  private apply(): void {
    if (!this.ctx || !this.master) return;
    this.master.gain.value = this.muted ? 0 : 1;
    for (const [g, node] of this.groups) node.gain.value = this.volume[g] ** 2;
  }
  /** The tab was hidden or shown, or the game paused. */
  hush(on: boolean): void {
    if (!this.ctx) return;
    if (on) void this.ctx.suspend();
    else void this.ctx.resume();
  }

  private tone(group: Group, freq: number, at: number, dur: number, peak: number, type: OscillatorType = "sine", slideTo?: number): void {
    const ctx = this.ctx;
    const out = this.groups.get(group);
    if (!ctx || !out) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime + at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + at + dur);
    g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    o.connect(g).connect(out);
    o.start(ctx.currentTime + at);
    o.stop(ctx.currentTime + at + dur + 0.05);
    o.onended = () => (o.disconnect(), g.disconnect());
    this.started++;
  }
  private hiss(group: Group, at: number, dur: number, peak: number, freq: number, q = 1): void {
    const ctx = this.ctx;
    const out = this.groups.get(group);
    if (!ctx || !out || !this.noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + at + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    src.connect(f).connect(g).connect(out);
    src.start(ctx.currentTime + at);
    src.stop(ctx.currentTime + at + dur + 0.05);
    src.onended = () => (src.disconnect(), f.disconnect(), g.disconnect());
    this.started++;
  }

  play(cue: Cue): void {
    if (!this.ctx || this.ctx.state !== "running") return;
    switch (cue) {
      case "mirror":
        this.tone("effects", 880, 0, 0.09, 0.16, "triangle");
        this.tone("effects", 1320, 0.05, 0.12, 0.1, "triangle");
        break;
      case "restored":
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone("effects", f, i * 0.09, 0.7, 0.16, "sine"));
        break;
      case "purr":
        for (let i = 0; i < 14; i++) this.tone("voices", 52 + (i % 2) * 6, i * 0.055, 0.05, 0.22, "sawtooth");
        break;
      case "flap":
        this.hiss("voices", 0, 0.12, 0.16, 900, 0.8);
        break;
      case "hop":
        this.tone("voices", 420, 0, 0.1, 0.07, "sine", 640);
        break;
      case "land":
        this.hiss("effects", 0, 0.08, 0.1, 300, 0.6);
        break;
      case "dark":
        this.hiss("effects", 0, 0.7, 0.14, 500, 0.5);
        this.tone("effects", 196, 0.1, 0.8, 0.07, "sine", 130);
        break;
      case "light":
        this.hiss("effects", 0, 0.6, 0.12, 700, 0.5);
        break;
      case "secret":
        [783.99, 987.77, 1174.7, 1568].forEach((f, i) => this.tone("effects", f, i * 0.12, 0.9, 0.09, "sine"));
        break;
      case "call":
        // A hoopoe's call is three soft, low notes.
        for (let i = 0; i < 3; i++) this.tone("voices", 520, i * 0.17, 0.13, 0.13, "sine", 500);
        break;
      case "feather":
        this.tone("effects", 1046.5, 0, 0.3, 0.12, "sine");
        this.tone("effects", 1568, 0.1, 0.5, 0.1, "sine");
        break;
      case "line":
        this.tone("effects", 660, 0, 0.05, 0.035, "sine");
        break;
      case "gong":
        // The elephant clock's gong, in al-Jazari's workshop: a low struck note and its ring.
        this.tone("effects", 196, 0, 1.6, 0.2, "sine", 190);
        this.tone("effects", 392.5, 0, 1.1, 0.08, "sine");
        this.tone("effects", 587, 0.01, 0.7, 0.04, "triangle");
        break;
      case "part":
        // A part of the clock picked up or set down: a soft wooden knock.
        this.tone("effects", 300, 0, 0.07, 0.12, "triangle", 220);
        break;
    }
  }

  /** The room at evening: a low hum of air and, far off, crickets. */
  private startAmbience(): void {
    const ctx = this.ctx;
    const out = this.groups.get("ambience");
    if (!ctx || !out || !this.noise || this.ambience) return;
    const air = ctx.createBufferSource();
    air.buffer = this.noise;
    air.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 320;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.05;
    air.connect(low).connect(airGain).connect(out);
    air.start();
    const cricket = ctx.createOscillator();
    cricket.type = "sine";
    cricket.frequency.value = 4200;
    const chirp = ctx.createGain();
    chirp.gain.value = 0;
    const lfo = ctx.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = 3.1;
    const depth = ctx.createGain();
    depth.gain.value = 0.006;
    lfo.connect(depth).connect(chirp.gain);
    cricket.connect(chirp).connect(out);
    cricket.start();
    lfo.start();
    this.started += 3;
    this.ambience = {
      stop: () => {
        for (const n of [air, cricket, lfo]) n.stop();
        for (const n of [air, low, airGain, cricket, chirp, lfo, depth]) n.disconnect();
      },
    };
  }

  dispose(): void {
    this.ambience?.stop();
    this.ambience = null;
    void this.ctx?.close();
    this.ctx = null;
    this.groups.clear();
  }
}
