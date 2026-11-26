// The fifth quest as data: al-Idrisi and the scattered sheets that hold a page of the Atlas.
//
// History and invention, kept apart on purpose:
//   from museum records  al-Idrisi wrote Nuzhat al-Mushtaq for Roger II, king of Sicily, and finished it in Shawwal
//                        548 of the Hijra (the date is not converted here). The book went with a silver disc showing
//                        the seven climes, and he divided each clime into ten sections, which made seventy sectional
//                        maps (person/al-idrisi-muhammad-ibn-abd-allah, work/nuzhat-al-mushtaq).
//   invented for play    the sheets lying out of order, the page of the Atlas among them, putting them in order by
//                        matching their edges, the imagined coast drawn from the edge codes below (it is not his map
//                        and not any real place), the young helper and every spoken line, including al-Idrisi's one
//                        imagined line (review ledger, HR-HH-20 to HR-HH-22). Nothing read for the game says how his
//                        maps were ordered, bound, oriented or what any sheet showed.
import type { Sheet, SheetsDef, SheetsStyle } from "../sim/sheets";

export const SHEETS_QUEST = "w03q4-al-idrisi";

/** A sheet from its number and what its four edges carry: north (the top), east, south, west. See `edgeCode` in sim/sheets. */
const S = (id: number, n: number, e: number, s: number, w: number): Sheet => ({ id, n, e, s, w });

// The maps are written out, not made by chance; the tests prove each has one arrangement only, that the outer border
// of the whole map carries nothing, and that no two sheets are alike. Numbers are the sheets' own; the answer lists
// the sheet at each place of the finished map, row by row, and is kept here only for the tests to compare with what
// the search finds. The coast that results is drawn from the codes: it resembles no real place.
//
//   Story      2 rows of 3. Four places wrong, two pairs exchanged: fewest 2.
//   Explorer   3 rows of 4. Eight places wrong, two cycles of three and a pair: fewest 5.
//   Challenge  3 rows of 5. Every place wrong, in cycles of 5, 4, 3 and 3: fewest 11. Sheets 1 and 9 differ in one
//              edge only (the east one), so a careless match fits on three sides.
const MAPS: Record<SheetsStyle, { rows: number; cols: number; sheets: Sheet[]; answer: number[]; start: number[] }> = {
  story: {
    rows: 2,
    cols: 3,
    sheets: [S(1, 21, 0, 0, 12), S(2, 31, 12, 0, 33), S(3, 0, 0, 21, 33), S(4, 0, 22, 11, 0), S(5, 11, 33, 0, 0), S(6, 0, 33, 31, 22)],
    answer: [4, 6, 3, 5, 2, 1],
    start: [4, 5, 2, 6, 3, 1],
  },
  explorer: {
    rows: 3,
    cols: 4,
    sheets: [S(1, 23, 23, 32, 0), S(2, 0, 11, 0, 32), S(3, 11, 11, 0, 22), S(4, 0, 0, 13, 22), S(5, 0, 22, 23, 0), S(6, 21, 32, 11, 23), S(7, 0, 31, 0, 11), S(8, 32, 22, 0, 0), S(9, 13, 0, 23, 11), S(10, 0, 22, 0, 12), S(11, 0, 12, 21, 22), S(12, 23, 0, 0, 31)],
    answer: [5, 11, 10, 4, 1, 6, 2, 9, 8, 3, 7, 12],
    start: [3, 11, 7, 4, 10, 6, 5, 9, 12, 2, 1, 8],
  },
  challenge: {
    rows: 3,
    cols: 5,
    sheets: [S(1, 33, 32, 32, 31), S(2, 13, 13, 0, 0), S(3, 32, 21, 0, 31), S(4, 31, 0, 0, 21), S(5, 32, 0, 31, 12), S(6, 23, 31, 13, 0), S(7, 0, 13, 23, 0), S(8, 0, 0, 32, 12), S(9, 33, 12, 32, 31), S(10, 32, 32, 0, 13), S(11, 0, 12, 33, 12), S(12, 0, 12, 33, 32), S(13, 32, 31, 0, 32), S(14, 33, 31, 32, 32), S(15, 0, 32, 33, 13)],
    answer: [7, 15, 12, 11, 8, 6, 1, 14, 9, 5, 2, 10, 13, 3, 4],
    start: [10, 9, 14, 15, 4, 12, 11, 6, 1, 2, 7, 13, 5, 8, 3],
  },
};
const defs = new Map<SheetsStyle, SheetsDef>();
export function sheetsMap(style: SheetsStyle): SheetsDef {
  let d = defs.get(style);
  if (!d) {
    const m = MAPS[style];
    d = { rows: m.rows, cols: m.cols, sheets: m.sheets, start: m.start };
    defs.set(style, d);
  }
  return d;
}
/** The arrangement each map is written to have, for the tests to compare with what the search finds. */
export const sheetsIntended = (style: SheetsStyle): readonly number[] => MAPS[style].answer;
/** The near-alike pair of the Challenge map: two sheets that differ in one edge only. */
export const NEAR_ALIKE = [1, 9] as const;
/** Exchanges beyond the fewest, and failed checks, allowed for the Ingenuity goal: Story has no count; Explorer has no checks. */
export const SHEETS_SLACK = { story: null, explorer: { extra: 4, checks: null }, challenge: { extra: 6, checks: 2 } } as const;

/** The museum records the note at the end links to; each is shown only if its file exists. Existing source material; not reviewed for this game. */
export const SHEETS_RECORDS = ["person/al-idrisi-muhammad-ibn-abd-allah", "work/nuzhat-al-mushtaq"] as const;
