// The eleventh quest as data: the Alhambra and the dry fountain. The page of the Atlas has fallen into a dry fountain,
// and the water must be led to it through a grid of channel pieces, each turned the wrong way.
//
// History and invention, kept apart on purpose:
//   from museum records  (building/alhambra, after the Encyclopaedia of Islam, 2nd edition, vol. 2, "Gharnata"; the
//                        museum's other record, building/nasrid-palaces-alhambra, is a draft card and says nothing of
//                        water) work on the Alhambra began with an aqueduct from the mountains, so that water ran
//                        through the town and the palaces; the palaces are groups of buildings arranged round courtyards,
//                        with the court and not the building as the central element; in the court of Comares, also
//                        called the court of the Myrtles, a very long pool bordered by myrtles fills the centre; and the
//                        Court of the Lions is divided by two intersecting paths with a fountain at the crossing, whose
//                        basin rests on stone lions that probably belonged to a palace of the 5th century of the Hijra
//                        (11th century).
//   invented for play    the grid of turning channel pieces, the spout, the three grids as they are written below, the
//                        dry fountain and the page that floats up when water reaches it, the keeper of the water, the
//                        girl who sweeps the court, the two imagined lines they speak, and the plain round basin and
//                        long basin that stand for a fountain and a pool. Nothing in the record says how water was led
//                        from the aqueduct to each court, and the grid is not the plan of the Alhambra or of its
//                        waterworks (review ledger, HR-HH-38 to HR-HH-40).
import { period, opens, pieceFor, type Basin, type ChannelsDef, type ChannelsStyle, type Kind, type Piece, type Side, type Spout } from "../sim/channels";

export const CHANNELS_QUEST = "w08q2-alhambra";
/** The Atlas subject the quest belongs to. */
export const CHANNELS_SUBJECT = "alhambra";

// The grids are written out, not made by chance: the answer as the sides each place is open on (n e s w; an empty string
// is a plain stone), and for each place how many quarter turns past the answer it lies to begin with (0 to 3; a piece
// that cannot be turned lies as it is). The tests prove each grid has one answer, that the answer is the road written
// here, and the fewest turns each one needs. Pieces that are not on the road may lie any way: they are left as they are.
//
//   Story      3 rows of 3. One basin, the fountain. Five pieces on the road; off it, two pieces and two plain stones.
//              Fewest turns: 6.
//   Explorer   4 rows of 4. Two basins, the fountain and the long pool, so the channel branches at a tee. Eleven pieces
//              on the road. Fewest turns: 11.
//   Challenge  5 rows of 5. Two basins; nothing may leak; twelve pieces on the road (a tee among them) and ten pieces off
//              it (a bolted cross and a tee among them), and three plain stones. The water is shown only when the sluice
//              is opened. Fewest turns: 14.
interface Written {
  rows: number;
  cols: number;
  /** The answer: the sides each place is open on, row by row. */
  road: string[];
  /** Quarter turns past the answer each place lies at the start. */
  off: number[];
  spout: Spout;
  basins: Basin[];
  noLeaks: boolean;
}
const WRITTEN: Record<ChannelsStyle, Written> = {
  story: {
    rows: 3,
    cols: 3,
    road: ["ew", "sw", "", "ns", "ne", "sw", "", "ne", "n"],
    off: [0, 2, 0, 1, 3, 3, 0, 2, 2],
    spout: { cell: 0, side: "w" },
    basins: [{ cell: 8, kind: "fountain" }],
    noLeaks: false,
  },
  explorer: {
    rows: 4,
    cols: 4,
    road: ["ew", "esw", "sw", "", "e", "ns", "ne", "sw", "es", "nw", "ew", "ns", "n", "es", "w", "n"],
    off: [0, 3, 3, 0, 2, 1, 3, 3, 2, 3, 1, 1, 3, 1, 2, 3],
    spout: { cell: 0, side: "w" },
    basins: [
      { cell: 12, kind: "pool" },
      { cell: 15, kind: "fountain" },
    ],
    noLeaks: false,
  },
  challenge: {
    rows: 5,
    cols: 5,
    road: ["", "ns", "es", "ew", "w", "e", "", "ns", "es", "", "sw", "ew", "ns", "nesw", "e", "ne", "ew", "new", "ws", "ns", "ew", "new", "ns", "ne", "w"],
    off: [0, 1, 3, 1, 2, 2, 0, 1, 2, 0, 0, 1, 3, 1, 2, 0, 1, 1, 3, 1, 1, 2, 1, 2, 3],
    spout: { cell: 10, side: "w" },
    basins: [
      { cell: 4, kind: "fountain" },
      { cell: 24, kind: "pool" },
    ],
    noLeaks: true,
  },
};

const SIDE_OF = (c: string): Side => c as Side;
/** The pieces of a written grid: each place's kind and its turn at the start. */
function piecesOf(w: Written): { start: Piece[]; answer: Piece[] } {
  const start: Piece[] = [];
  const answer: Piece[] = [];
  w.road.forEach((mask, p) => {
    const hit = pieceFor([...mask].map(SIDE_OF));
    if (!hit) throw new Error(`no piece is open on "${mask}" (place ${p})`);
    const off = w.off[p]!;
    answer.push({ kind: hit.kind, turn: hit.turn });
    // A piece that looks the same turned lies as it is; the others lie `off` quarter turns past the answer.
    start.push({ kind: hit.kind, turn: period(hit.kind) === 1 ? hit.turn : (hit.turn + off) % 4 });
  });
  return { start, answer };
}
const defs = new Map<ChannelsStyle, ChannelsDef>();
const answers_ = new Map<ChannelsStyle, Piece[]>();
export function channelsGrid(style: ChannelsStyle): ChannelsDef {
  let d = defs.get(style);
  if (!d) {
    const w = WRITTEN[style];
    const { start, answer } = piecesOf(w);
    d = { rows: w.rows, cols: w.cols, start, spout: w.spout, basins: w.basins, noLeaks: w.noLeaks };
    defs.set(style, d);
    answers_.set(style, answer);
  }
  return d;
}
/** The answer each grid is written to have, as the pieces lie when it is done (for the tests to compare with what the search finds). */
export function channelsIntended(style: ChannelsStyle): readonly Piece[] {
  channelsGrid(style);
  return answers_.get(style)!;
}
/** The sides each place of a written grid is open on in the answer, as written. */
export const channelsRoad = (style: ChannelsStyle): readonly string[] => WRITTEN[style].road;
/** The kinds a grid is made of, for the tests. */
export const kindsOf = (style: ChannelsStyle): Kind[] => channelsGrid(style).start.map((p) => p.kind);
/** Turns beyond the fewest, and openings of the sluice that did not finish it, allowed for the Ingenuity goal: Story has no count; Explorer has no openings. */
export const CHANNELS_SLACK = { story: null, explorer: { extra: 4, openings: null }, challenge: { extra: 2, openings: 2 } } as const;
/** The sides a piece is open on as written, for the tests. */
export const sidesOf = (p: Piece): Side[] => opens(p.kind, p.turn);

/** The museum records the note at the end links to; each is shown only if its file exists. Existing source material; not reviewed for this game. */
export const CHANNELS_RECORDS = ["building/alhambra", "building/nasrid-palaces-alhambra"] as const;
