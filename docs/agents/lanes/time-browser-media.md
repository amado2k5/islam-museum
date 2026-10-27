# Lane: time-browser-media (Devin)

Owner: Devin. Scope (DESIGN.md §7): `scripts/time-browser-media*` in islam-museum, its
outputs (`data/time-browser-media-index.json`, generated SVG maps and cards), and the whole
`amado2k5/historynavigator` repo (TB6). Devin does not touch `site/src` — that is Claude's lane.

## Progress

- 2026-10-27 — M1: `scripts/time-browser-media.ts` writes `data/time-browser-media-index.json`
  (663 stops, 14 classes, batch 50/class published-first then degree; 470 whitelisted images
  inventoried, all depicting objects; match rule depicts | place+period | period+tag).
  Match rate 6%: 40 stops get a real image, 623 get a generated SVG card. Next: M2 SVG maps.
