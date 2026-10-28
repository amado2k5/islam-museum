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
- 2026-10-27 — "add 50 more" (batch 250): 2,780 stops, 10.3% match (287 image /
  2,493 card), 12 map clusters (~435 KB), 494 shared cards (~243 KB).
- 2026-10-27 — "add 50 more" (batch 300): 3,230 stops, 10.7% match (345 image /
  2,885 card), 13 map clusters (~497 KB), 559 shared cards (~276 KB).
- 2026-10-27 — "add 50 more" (batch 350): 3,643 stops, 11% match (401 image /
  3,242 card), 14 map clusters (~558 KB), 620 shared cards (~305 KB).
- 2026-10-27 — "add 50 more" (batch 400): 4,016 stops, 11.2% match (451 image /
  3,565 card), 15 map clusters (~619 KB), 670 shared cards (~328 KB).
- 2026-10-27 — Gap check: media/illus-event-battle-of-the-trench has no file
  because the image was withdrawn (2026-10-23, modern-skyline reject under
  illustrations lane gates) and is queued for regeneration in the
  illustrations pipeline batch 0 — not a media-index bug. Next: D12 local
  image generation for TB stops reusing scripts/media/illustrate + SDXL
  (~/tb-img-venv, M4 Max MPS). 320/321 launch records currently have no
  image; generation precedes the next "add 50 more" batch per founder.
- 2026-10-27 — TB1 launch stops now always in the media index (scripts/
  time-browser-media.ts merges .cache/time-browser/en/index.json ids). All 50
  TB1 places covered (was 28); 4,187 stops, 10.9% match, 15 clusters,
  694 cards. Local SDXL generation for unimaged records running on the
  founder's Mac (320 queue, /Volumes/exmicroSD/tb-images/).
- 2026-10-28 — Reviewed the original TimelineThis app (live preview + both
  generation-prompt PDFs): parity table recorded in DESIGN.md §10. Client
  gaps to file: kids-mode toggle, related-entities sidebar, per-period
  theming, animated placeholder, loading overlay. TB2 items for Claude:
  kids content, related-entity ids.
- 2026-10-28 — Local SDXL illustrations: queue running on the founder's Mac
  (/Volumes/exmicroSD/tb-images/, SDXL, no-people/no-text prompts). 153 webp
  committed at site/public/media/time-browser/images/; 145 stops switched to
  coverage:image; 21 launch records now wire a real image. NOTE for Claude:
  scripts/time-browser.ts tourSubset now throws — polity/achaemenid-empire
  fell out of the live set after the EDTF padding fix moved it to -550.
  Local feed regenerated skipping tour.json only.
- 2026-10-28 — "add 50 more" (batch 450): 4,541 stops. Index now auto-registers
  committed SDXL webp (media/tbgen-*): 149 wired so far — match rate 14%
  (649 image / 3,989 card), 15+ clusters, cards regenerated.
- 2026-10-28 — batch 450 merged (PR #2430). Resume runbook written to
  DESIGN.md section 11 for session restarts.
- 2026-10-28 — al-Ghazali route map: route-al-ghazali.svg (94 KB) drawn from
  the MENA basemap — Tus, Nishapur, Jurjan, Baghdad, Damascus, Jerusalem,
  Mecca, Medina and back (dashed route + labeled dots). Uses the sourced
  Tus/Jurjan coordinates from PR #2435. Wiring to a journey/record is open.
- 2026-10-28 — SDXL queue complete: 320/320 local illustrations generated on
  the founder's Mac, converted to webp (15 MB total). All registered as
  media/tbgen-* — image coverage now 820 stops (17.7%). Gate-screening pass
  still pending before ship (prompt-constrained only so far).
- 2026-10-28 — "add 50 more" (batch 500): 4,881 stops; 765 cards, 14
  clusters. NOTE: tbgen registration reports 149 this run (was 320 at
  batch-450 regen) — dedup guard skips ids already present as entries;
  image coverage 694. Needs a look next pass.
- 2026-10-28 — Go-live note in DESIGN.md section 12: deploy checklist
  (feed JSON to R2, /time-browser-media/ publish path, no third-party
  requests, kids+related fields, one image-screen pass pending) and
  verification commands. Batch 1000 merged: 7,856 stops, 1,368 cards,
  14 clusters, 320 tbgen wired.
- 2026-10-28 — SDXL round 2 launched: 320 jobs (161 launch-set cards
  first, then a class spread), output to tb/ as before; register on the
  next time-browser-media.ts regen.
- 2026-10-28 — SDXL round 2 complete: 320/320 generated; 640 webp total
  now committed (~30 MB). Index registers 640 tbgen entries; image
  coverage 1,231 of 7,856 (15.5%); all 321 launch-set stops image-covered
  or card-bearing as wired.
