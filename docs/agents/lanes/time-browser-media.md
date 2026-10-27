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
- 2026-10-27 — M2+M3 merged in PR #2381. Next: build step wiring (TB2) or founder direction.
- 2026-10-27 — historynavigator H1+H2 merged (PR #1): clean React 19/Vite 8/TS 5.9/Tailwind 4
  client, all AI code deleted, reads DATA_BASE/<lang>/index.json with /sample fallback.
  H3 (real feed) is blocked until Claude's TB1 (scripts/time-browser.ts) lands on main.
- 2026-10-27 — "add 50 more" approved: batch now 100/class -> 1,230 stops, 8% match
  (98 image / 1,132 card), 10 map clusters, 267 cards. Founder rule change: generated
  SVGs are committed (not git-ignored) and publish to R2; .gitignore excepts
  site/public/media/time-browser/ only.
- 2026-10-27 — H3 merged (historynavigator PR #2): client reads the real TB1 index
  (topics map + raw records normalized in src/services/data.ts; fallback real feed ->
  local /time-browser-data -> sample). public/time-browser-data/{ar,en,ur} carries the
  TB1 staging output (206 records/lang). Schema deltas vs DESIGN section 3 reported to
  Claude in DESIGN.md section 9: date is a bare EDTF string; no image/map/card/
  perspectives fields yet; kids empty; index lacks generated/lang; place/concept/
  practice/theme produced 0 records.
- 2026-10-27 — "add 50 more" (batch 150): 1,780 stops, 8.8% match (157 image /
  1,623 card), 11 map clusters (~432 KB), 360 shared cards (~179 KB). Stale
  cluster SVGs from earlier batches now pruned on regeneration.
- 2026-10-27 — "add 50 more" (batch 200): 2,310 stops, 9.8% match (227 image /
  2,083 card), 12 map clusters (~434 KB), 431 shared cards (~214 KB).
