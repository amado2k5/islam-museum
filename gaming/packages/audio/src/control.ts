// The music control every game shows: one disclosure with an on/off switch, the volume, "next track", what is
// playing and where the music comes from. Plain DOM, so it works the same in a 3D game and a 2D one.
import en from "../i18n/en.json";
import { SUITE } from "./music";
import type { MusicPlayer, MusicState } from "./player";

export type MusicStrings = Record<Exclude<keyof typeof en, "_meta">, string>;
export const AUDIO_LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;

/** Loads the control's strings for a language (English if the language is not one of the seven). */
export async function loadMusicStrings(lang: string): Promise<MusicStrings> {
  const code = (AUDIO_LANGS as readonly string[]).includes(lang) ? lang : "en";
  return (await import(`../i18n/${code}.json`)).default as MusicStrings;
}

const NOTE = "M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0M19 16a3 3 0 1 1-6 0a3 3 0 0 1 6 0";
const SKIP = "M5 5l9 7l-9 7zM17 5v14";

function glyph(d: string): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({ viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", "stroke-width": "1.7", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" })) svg.setAttribute(k, v);
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  svg.append(path);
  return svg;
}

/**
 * Builds the control. `aboutUrl` is the museum page that says how the music was made.
 * The element keeps itself up to date from the player.
 */
export function musicControl(player: MusicPlayer, s: MusicStrings, aboutUrl: string): HTMLElement {
  const root = document.createElement("details");
  root.className = "music";
  const summary = document.createElement("summary");
  const label = document.createElement("span");
  summary.append(glyph(NOTE), label);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "music-toggle";
  toggle.onclick = () => player.toggle();
  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = "0";
  volume.max = "100";
  volume.step = "5";
  volume.setAttribute("aria-label", s.music_volume);
  volume.oninput = () => player.setVolume(Number(volume.value) / 100);
  const volumeRow = document.createElement("label");
  volumeRow.className = "music-volume";
  const volumeText = document.createElement("span");
  volumeText.textContent = s.music_volume;
  volumeRow.append(volumeText, volume);
  const next = document.createElement("button");
  next.type = "button";
  next.className = "music-next";
  next.title = s.music_next;
  next.setAttribute("aria-label", s.music_next);
  next.append(glyph(SKIP));
  next.onclick = () => player.next();
  const now = document.createElement("p");
  now.className = "music-now";
  now.setAttribute("aria-live", "polite");
  const title = document.createElement("bdi");
  title.lang = "en";
  title.dir = "ltr";
  const credit = document.createElement("p");
  credit.className = "music-credit";
  const suite = document.createElement("bdi");
  suite.lang = "en";
  suite.dir = "ltr";
  suite.textContent = `“${SUITE}”`;
  const about = document.createElement("a");
  about.href = aboutUrl;
  about.target = "_blank";
  about.rel = "noopener";
  about.textContent = s.music_about;
  credit.append(suite, ` ${s.music_credit} `, about);
  const row = document.createElement("div");
  row.className = "music-row";
  row.append(toggle, next);
  const body = document.createElement("div");
  body.className = "music-body";
  body.append(row, volumeRow, now, credit);
  root.append(summary, body);

  const draw = (st: MusicState) => {
    label.textContent = !st.available ? s.music_missing_short : st.on ? s.music_on : s.music_off;
    summary.title = s.music;
    root.classList.toggle("on", st.on && st.available);
    toggle.textContent = st.on ? s.music_turn_off : s.music_turn_on;
    toggle.setAttribute("aria-pressed", String(st.on));
    toggle.disabled = !st.available;
    next.disabled = !st.available;
    volume.disabled = !st.available;
    if (document.activeElement !== volume) volume.value = String(Math.round(st.volume * 100));
    title.textContent = st.track.title;
    now.replaceChildren(st.available ? `${s.music_now} ` : s.music_missing, ...(st.available ? [title] : []));
  };
  player.onChange(draw);
  draw(player.state());
  return root;
}
