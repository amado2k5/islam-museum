# Lane: time-browser-media (Devin)

Owner: Devin. Scope (DESIGN.md §7): `scripts/time-browser-media*` in islam-museum, its
outputs (`data/time-browser-media-index.json`, generated SVG maps and cards), and the whole
`amado2k5/historynavigator` repo (TB6). Devin does not touch `site/src` — that is Claude's lane.

## Progress

- 2026-10-27 — M1: `scripts/time-browser-media.ts` writes `data/time-browser-media-index.json`
  (663 stops, 14 classes, batch 50/class published-first then degree; 470 whitelisted images
  inventoried, all depicting objects; match rule depicts | place+period | period+tag).
  Match rate 6%: 40 stops get a real image, 623 get a generated SVG card. Next: M2 SVG maps.
- 2026-10-27 — M1 merged in PR #2380. Next: M2 SVG maps per place cluster.
- 2026-10-27 — M2: `scripts/time-browser-maps.ts` renders one static SVG per place cluster
  (single-linkage, 600km; MENA basemap when the frame fits, cropped world elsewhere; inland
  frames with no coastline fill land, not sea). 98 of 663 stops are coordinated (42 unique
  places) -> 11 cluster SVGs, ~249 KB total under `site/public/media/time-browser/maps/`
  (git-ignored like other generated media; the build step must run the script).
  `data/time-browser-maps.json` maps stop -> cluster; 565 stops have no coordinates.
- 2026-10-27 — M3: `scripts/time-browser-cards.ts` generates one shared SVG card per
  (primary period, primary place): 623 card-stops -> 150 cards, 76 KB, under
  `site/public/media/time-browser/cards/`; `data/time-browser-cards.json` maps stop -> card.
