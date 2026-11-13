// The Hijri calendar's month arithmetic, shared by the interactive calendar (/calendar/) and the static month pages
// (/calendar/<year>/<month>/, audit of 13 November 2026, S28). Same tested functions as scripts/hijri/convert.ts:
// Umm al-Qura for 1318–1500 AH, the tabular calendar otherwise.
import { graph } from "./graph";
import { civilToHijri, hijriToCivil, toJDN, tabularToJDN, type YMD } from "../../../scripts/hijri/convert";

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
/** The year's observances; each links to its museum page where one exists. */
export const OBS: { m: number; days: number[]; key: string; link?: string }[] = [
  { m: 1, days: [1], key: "new_year", link: "concept/hijri-calendar" },
  { m: 1, days: [9, 10], key: "ashura", link: "practice/sawm-ashura" },
  { m: 3, days: [12], key: "mawlid", link: "practice/mawlid-al-nabi" },
  { m: 7, days: [27], key: "isra", link: "event/isra-and-miraj" },
  { m: 8, days: [15], key: "mid_shaban" },
  { m: 9, days: range(1, 30), key: "ramadan", link: "practice/sawm-ramadan" },
  { m: 9, days: [21, 23, 25, 27, 29], key: "qadr", link: "practice/laylat-al-qadr" },
  { m: 10, days: [1, 2, 3], key: "eid_fitr", link: "practice/eid-al-fitr" },
  { m: 12, days: range(8, 13), key: "hajj", link: "practice/hajj" },
  { m: 12, days: [9], key: "arafah", link: "practice/hajj" },
  { m: 12, days: [10, 11, 12, 13], key: "eid_adha", link: "practice/eid-al-adha" },
];
export const obsFor = (m: number, d: number) => OBS.filter((o) => o.m === m && o.days.includes(d));
/** Julian Day Number of a Hijri date: Umm al-Qura where in range, tabular otherwise. */
export const hijriJDN = (y: number, m: number, d: number): number => {
  if (y >= 1318 && y <= 1500) { const c = hijriToCivil({ y, m, d }); return toJDN(c.calendar, c.date); }
  return tabularToJDN({ y, m, d });
};
export const monthLen = (y: number, m: number) => { const [ny, nm] = m === 12 ? [y + 1, 1] : [y, m + 1]; return hijriJDN(ny, nm, 1) - hijriJDN(y, m, 1); };
export const fmtD = (g: YMD) => `${g.y}-${String(g.m).padStart(2, "0")}-${String(g.d).padStart(2, "0")}`;
export const gregDay = (y: number, m: number, d: number) => { const c = hijriToCivil({ y, m, d }); return c.calendar === "julian" ? `${fmtD(c.date)} Julian` : fmtD(c.date); };
export const wdOf = (jdn: number) => { const a = (jdn + 1) % 7; return a < 0 ? a + 7 : a; }; // 0 = Sunday

// The built commit's day (build-graph.ts records the HEAD commit date), never the build machine's clock.
const [gy, gm, gd] = graph.generated.slice(0, 10).split("-").map(Number);
export const buildDay: YMD = { y: gy, m: gm, d: gd };
export const buildHijri = civilToHijri("gregorian", buildDay);
/** Years that have static month pages: ten either side of the built commit's Hijri year. Other years open in the interactive calendar. */
export const STATIC_SPAN = 10;
export const staticYears = range(buildHijri.date.y - STATIC_SPAN, buildHijri.date.y + STATIC_SPAN);
export const hasStatic = (y: number) => y >= staticYears[0] && y <= staticYears[staticYears.length - 1];
export const monthHref = (lang: string, y: number, m: number) => `/${lang}/calendar/${y}/${m}/`;
export const yearHref = (lang: string, y: number) => `/${lang}/calendar/${y}/`;
export const prevMonth = (y: number, m: number): [number, number] => (m === 1 ? [y - 1, 12] : [y, m - 1]);
export const nextMonth = (y: number, m: number): [number, number] => (m === 12 ? [y + 1, 1] : [y, m + 1]);
