// The film, scene by scene. The voice is the clock: a scene lasts as long as its sentences, plus the pauses set
// here (seconds). `gap` is the silence after a sentence; where a gap is long, something happens on screen in it
// (the map flies, a page opens). `look` says how the scene sits in the frame:
//   bleed  - the recording fills the frame, with large type over it
//   window - the recording sits in a window, with the caption under it
//   card   - built in HTML (no recording)
export const SCENES = [
  { id: "hook",   look: "bleed",  units: ["h1_0", "h2_0", "h2_1", "h3_0"], lead: 0.45, tail: 0.7, gap: { h1_0: 0.75, h2_0: 0.55, h2_1: 0.7 } },
  { id: "reveal", look: "window", units: ["r1_0"], lead: 0.4, tail: 0.5 },
  { id: "world",  look: "window", units: ["d1_0", "d1_1", "d2_0", "d2_1"], lead: 0.35, tail: 1.5, gap: { d1_1: 0.6 } },
  { id: "place",  look: "window", units: ["d3_0", "d4_0", "d4_1", "d5_0"], lead: 0.5, tail: 0.6, gap: { d3_0: 1.25, d4_0: 0.25, d4_1: 1.2 } },
  { id: "person", look: "window", units: ["d6_0", "d6_1"], lead: 0.45, tail: 0.5, gap: { d6_0: 0.5 } },
  { id: "entry",  look: "window", units: ["d7_0"], lead: 1.0, tail: 0.9 },
  { id: "search", look: "window", units: ["d8_0", "d8_1", "d8_2"], lead: 0.4, tail: 0.6, gap: { d8_0: 0.35, d8_1: 1.9 } },
  { id: "web",    look: "window", units: ["m1_0", "m1_1", "m1_2"], lead: 0.4, tail: 0.7, gap: { m1_0: 0.55, m1_1: 0.55 } },
  { id: "menu",   look: "window", units: ["e1_0"], lead: 0.5, tail: 1.3 },
  { id: "graph",  look: "window", units: ["e2_0"], lead: 0.4, tail: 0.9 },
  { id: "tour3d", look: "window", units: ["e3_0"], lead: 0.4, tail: 0.6 },
  { id: "grand",  look: "window", units: ["e4_0"], lead: 0.4, tail: 0.6 },
  { id: "tb",     look: "window", units: ["e5_0"], lead: 0.3, tail: 0.35 },
  { id: "quran",  look: "window", units: ["e5_1"], lead: 0.25, tail: 0.35 },
  { id: "companions", look: "window", units: ["e5_2"], lead: 0.25, tail: 0.45 },
  { id: "inventions", look: "window", units: ["e5_3"], lead: 0.25, tail: 0.45 },
  { id: "kids",   look: "window", units: ["e5_4"], lead: 0.25, tail: 0.5 },
  { id: "numbers", look: "card",  units: ["e6_0", "e6_1", "e6_2", "e6_3"], lead: 0.3, tail: 0.5, gap: { e6_0: 0.4, e6_1: 1.0, e6_2: 0.35 } },
  { id: "close",  look: "bleed",  units: ["c1_0", "c2_0", "c2_1", "c2_2"], lead: 0.6, tail: 0.6, gap: { c1_0: 0.7, c2_0: 0.4, c2_1: 0.4 } },
  { id: "end",    look: "card",   units: ["c3_0", "c3_1"], lead: 0.6, tail: 3.2, gap: { c3_0: 0.45 } },
];
export const GAP = 0.32; // default silence between two sentences of a scene
