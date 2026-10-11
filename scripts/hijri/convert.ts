// Hijri <-> Gregorian/Julian conversion.
//  - Tabular (arithmetical, civil epoch, 30-year cycle) for all dates: used for historical dates.
//  - Umm al-Qura (library) for 1318-1500 AH: used for modern dates.
// Conversions only ever fill a missing side and are always flagged `derived: true` by callers.
// Sources disagree by a day or two for historical dates; the tabular result is an approximation.
import uqModule from "@umalqura/core";

export type Calendar = "julian" | "gregorian";
export interface YMD { y: number; m: number; d: number }

// Julian Day Number (integer, noon-based) for a proleptic Gregorian / Julian date.
export function toJDN(c: Calendar, { y, m, d }: YMD): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  if (c === "gregorian") {
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083;
}

export function fromJDN(c: Calendar, jdn: number): YMD {
  let b: number, cc: number;
  if (c === "gregorian") {
    const a = jdn + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    cc = a - Math.floor((146097 * b) / 4);
  } else {
    b = 0;
    cc = jdn + 32082;
  }
  const d = Math.floor((4 * cc + 3) / 1461);
  const e = cc - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    d: e - Math.floor((153 * m + 2) / 5) + 1,
    m: m + 3 - 12 * Math.floor(m / 10),
    y: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

// Civil epoch: 1 Muharram 1 AH = Friday 16 July 622 (Julian) = JDN 1948440.
const HIJRI_EPOCH_JDN = 1948440;

export function isHijriLeap(y: number): boolean {
  return (((11 * y + 14) % 30) + 30) % 30 < 11;
}
export function hijriMonthLength(y: number, m: number): number {
  return m % 2 === 1 ? 30 : m === 12 && isHijriLeap(y) ? 30 : 29;
}

export function tabularToJDN({ y, m, d }: YMD): number {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + HIJRI_EPOCH_JDN - 1;
}
export function jdnToTabular(jdn: number): YMD {
  const y = Math.floor((30 * (jdn - HIJRI_EPOCH_JDN) + 10646) / 10631);
  const m = Math.min(12, Math.ceil((jdn - 29 - tabularToJDN({ y, m: 1, d: 1 })) / 29.5) + 1);
  const d = jdn - tabularToJDN({ y, m, d: 1 }) + 1;
  return { y, m, d };
}

const uq: any = (uqModule as any).default ?? (uqModule as any);
const inUQ = (y: number) => y >= 1318 && y <= 1500;

export type Method = "umalqura" | "tabular";

/** Hijri → civil date. Uses Umm al-Qura for 1318–1500 AH, tabular otherwise. */
export function hijriToCivil(h: YMD, calendar?: Calendar): { date: YMD; calendar: Calendar; method: Method } {
  if (inUQ(h.y)) {
    const dt: Date = uq(h.y, h.m, h.d).date;
    return { date: { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() }, calendar: "gregorian", method: "umalqura" };
  }
  const jdn = tabularToJDN(h);
  const cal = calendar ?? defaultCalendar(jdn);
  return { date: fromJDN(cal, jdn), calendar: cal, method: "tabular" };
}

/** Civil → Hijri. Umm al-Qura where in range (Gregorian only), tabular otherwise. */
export function civilToHijri(c: Calendar, g: YMD): { date: YMD; method: Method } {
  const jdn = toJDN(c, g);
  if (c === "gregorian") {
    const t = jdnToTabular(jdn);
    if (inUQ(t.y) || inUQ(t.y - 1) || inUQ(t.y + 1)) {
      try {
        const x = uq(new Date(g.y, g.m - 1, g.d));
        return { date: { y: x.hy, m: x.hm, d: x.hd }, method: "umalqura" };
      } catch { /* outside the table: fall through */ }
    }
  }
  return { date: jdnToTabular(jdn), method: "tabular" };
}

/** Julian before 1582-10-15, Gregorian from then on (proleptic otherwise). */
export function defaultCalendar(jdn: number): Calendar {
  return jdn < 2299161 ? "julian" : "gregorian";
}

export const fmt = ({ y, m, d }: YMD) =>
  `${y < 0 ? "-" : ""}${String(Math.abs(y)).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
