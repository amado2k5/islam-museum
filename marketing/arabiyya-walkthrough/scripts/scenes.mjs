// The film, scene by scene. The voice is the clock (see ../place-walkthrough/scripts/scenes.mjs for the model).
export const SCENES = [
  { id: "hook",     look: "bleed",  units: ["h1_0", "h1_1", "h2_0"], lead: 0.45, tail: 0.7, gap: { h1_0: 0.5, h1_1: 0.4 } },
  { id: "reveal",   look: "window", units: ["r1_0"], lead: 0.4, tail: 1.2 },
  { id: "ring",     look: "window", units: ["g1_0"], lead: 0.4, tail: 1.0 },
  { id: "verses",   look: "window", units: ["v1_0", "v1_1"], lead: 0.4, tail: 0.8, gap: { v1_0: 0.4 } },
  { id: "chapters", look: "window", units: ["c1_0", "c2_0", "c3_0", "c4_0"], lead: 0.4, tail: 0.8, gap: { c1_0: 0.45, c2_0: 0.2, c3_0: 0.2 } },
  { id: "record",   look: "window", units: ["p1_0", "p1_1"], lead: 0.4, tail: 1.6, gap: { p1_0: 0.5 } },
  { id: "scholar",  look: "window", units: ["p2_0"], lead: 0.5, tail: 1.2 },
  { id: "sources",  look: "window", units: ["s1_0"], lead: 0.4, tail: 1.0 },
  { id: "depth",    look: "window", units: ["d1_0", "d2_0"], lead: 0.4, tail: 0.8, gap: { d1_0: 0.5 } },
  { id: "kin",      look: "window", units: ["k1_0"], lead: 0.4, tail: 2.0 },
  { id: "close",    look: "bleed",  units: ["m1_0", "m2_0", "c5_0", "c5_1", "c5_2"], lead: 0.6, tail: 0.6, gap: { m1_0: 0.6, m2_0: 0.6, c5_0: 0.4, c5_1: 0.4 } },
  { id: "end",      look: "card",   units: ["e1_0", "e1_1"], lead: 0.6, tail: 3.0, gap: { e1_0: 0.45 } },
];
export const GAP = 0.32;
export const TEASER = [];
export const CUTS = { full: { musicStart: 0 }, teaser: { musicStart: 62 } };
