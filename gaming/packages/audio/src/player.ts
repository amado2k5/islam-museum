// Plays the suite in a game. One <audio> element, streamed (a track is never decoded whole into memory).
// Nothing sounds before the player's first click or key press; the music stops when the tab is hidden and comes
// back when it is shown; the choice of on or off and the volume are remembered for every game on the device.
import { AUDIO_PREFS_KEY, SUITE, gainOf, playlistFrom, readPrefs, writePrefs, type AudioPrefs, type Track, type TrackId } from "./music";

export interface MusicState {
  /** The player wants music. */
  on: boolean;
  /** Sound is coming out now. */
  playing: boolean;
  /** False when the files are not on this server (a fresh clone before the import, or a deployment without them). */
  available: boolean;
  track: Track;
  volume: number;
}

export interface MusicOptions {
  /** Address of the folder that holds the tracks, ending in a slash. */
  base: string;
  /** The track a game opens with; the rest of the suite follows in album order. */
  first: TrackId;
  /** Start as off whatever was saved (tests, or an address that asks for silence). */
  forceOff?: boolean;
}

const FADE_MS = 1800;

export class MusicPlayer {
  private readonly audio: HTMLAudioElement;
  private readonly list: Track[];
  private at = 0;
  private prefs: AudioPrefs;
  private available = true;
  private unlocked = false;
  private hiddenPause = false;
  private fade = 0;
  private readonly listeners = new Set<(s: MusicState) => void>();

  constructor(private readonly options: MusicOptions) {
    this.list = playlistFrom(options.first);
    this.prefs = this.load();
    if (options.forceOff) this.prefs = { ...this.prefs, music: false };
    this.audio = new Audio();
    this.audio.preload = "none";
    this.audio.addEventListener("ended", () => this.advance());
    this.audio.addEventListener("playing", () => this.emit());
    this.audio.addEventListener("pause", () => this.emit());
    this.audio.addEventListener("error", () => {
      // The file is not there or cannot be played: say so once and stop trying.
      this.available = false;
      this.emit();
    });
    // Browsers allow sound only after the player has acted, and so does the game's own rule.
    const unlock = () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      this.unlocked = true;
      if (this.prefs.music) this.start();
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!this.audio.paused) {
          this.hiddenPause = true;
          this.audio.pause();
        }
      } else if (this.hiddenPause) {
        this.hiddenPause = false;
        if (this.prefs.music) this.start();
      }
    });
  }

  private load(): AudioPrefs {
    try {
      return readPrefs(localStorage.getItem(AUDIO_PREFS_KEY));
    } catch {
      return readPrefs(null);
    }
  }
  private save(): void {
    try {
      localStorage.setItem(AUDIO_PREFS_KEY, writePrefs(this.prefs));
    } catch {
      /* not remembered */
    }
  }

  state(): MusicState {
    return { on: this.prefs.music, playing: !this.audio.paused && !this.audio.ended, available: this.available, track: this.list[this.at]!, volume: this.prefs.volume };
  }
  onChange(fn: (s: MusicState) => void): void {
    this.listeners.add(fn);
  }
  private emit(): void {
    const s = this.state();
    for (const fn of this.listeners) fn(s);
  }

  private start(): void {
    if (!this.available || !this.unlocked) return;
    const track = this.list[this.at]!;
    const src = `${this.options.base}${track.file}`;
    if (!this.audio.src.endsWith(src)) this.audio.src = src;
    const target = gainOf(this.prefs.volume);
    this.audio.volume = 0;
    cancelAnimationFrame(this.fade);
    const began = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - began) / FADE_MS);
      this.audio.volume = gainOf(this.prefs.volume) * k;
      if (k < 1 && !this.audio.paused) this.fade = requestAnimationFrame(step);
    };
    void this.audio
      .play()
      .then(() => {
        this.fade = requestAnimationFrame(step);
        this.describe(track);
      })
      .catch(() => {
        // Refused (no gesture yet, or the file failed): the error event reports a missing file; otherwise wait.
        this.audio.volume = target;
        this.emit();
      });
  }
  /** Tells the system's media controls what is playing. */
  private describe(track: Track): void {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: "islam.museum", album: SUITE });
  }
  private advance(): void {
    this.at = (this.at + 1) % this.list.length;
    this.emit();
    if (this.prefs.music) this.start();
  }

  setOn(on: boolean): void {
    this.prefs = { ...this.prefs, music: on };
    this.save();
    // Choosing "on" is itself the player's action, so sound may start.
    if (on) {
      this.unlocked = true;
      this.start();
    } else {
      cancelAnimationFrame(this.fade);
      this.audio.pause();
    }
    this.emit();
  }
  toggle(): void {
    this.setOn(!this.prefs.music);
  }
  setVolume(volume: number): void {
    this.prefs = { ...this.prefs, volume: Math.max(0, Math.min(1, volume)) };
    this.save();
    cancelAnimationFrame(this.fade);
    this.audio.volume = gainOf(this.prefs.volume);
    this.emit();
  }
  next(): void {
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.advance();
  }
}

/** Where the tracks are served from. A release build sets VITE_MUSIC_BASE; in development it is the workspace's media folder. */
export const MUSIC_BASE: string = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_MUSIC_BASE ?? "/media/music/";
