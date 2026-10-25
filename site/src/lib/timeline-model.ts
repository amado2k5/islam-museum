// The Hijri timeline's data and layout, computed once per language and shared by the page component and the JSON the
// browser script loads. The same functions as before the split; nothing here reads the network or the browser.
import { ui, type Lang } from "./i18n";
import { ERA } from "./dates";
import { buildDay } from "./today";
import { timelineEvents, timelinePeriods } from "./timeline";
import { layoutBands, layoutMarkers, xOf, yearLabel, type TlEvent } from "./timeline-layout";

const FLOOR = -150; // earlier events (the patriarchs) gather at the edge marker rather than stretching the axis by millennia

export function timelineModel(lang: Lang) {
  const T = ui(lang);
  const rtl = T.dir === "rtl";
  const MAX = buildDay().h.y;
  const all: TlEvent[] = timelineEvents(lang);
  const early = all.filter((e) => e.y < FLOOR);
  const events = all.filter((e) => e.y >= FLOOR).map((e) => (e.y > MAX ? { ...e, y: MAX } : e));
  const MIN = Math.min(FLOOR, Math.floor(Math.min(...events.map((e) => e.y)) / 50) * 50);
  const markers = layoutMarkers(events, MIN, MAX, rtl);
  if (early.length) markers.push({ y: MIN, x: xOf(MIN, MIN, MAX, rtl), lane: Math.max(...markers.map((m) => m.lane)) + 1, r: 5, items: early });
  const bands = layoutBands(timelinePeriods(lang, MAX), MIN, MAX, rtl);
  const payload = {
    lang, rtl, min: MIN, max: MAX, events,
    bands: bands.map(({ id, href, label, from, to }) => ({ id, href, label, from, to })),
    early: early.length,
    t: { ah: ERA[lang].ah, bh: ERA[lang].bh, ce: ERA[lang].ce, year: T.timeline.year, events: T.timeline.events_in, before: T.timeline.before, close: T.timeline.close, all: T.timeline.all },
  };
  return { all, early, events, MIN, MAX, rtl, markers, bands, payload, yearLabel };
}
