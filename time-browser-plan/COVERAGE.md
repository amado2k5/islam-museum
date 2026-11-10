# Timeline Explorer — coverage status & roadmap

Snapshot taken **2026-10-28** on `main` at explorer build "55 subjects, 560 nodes"
(commit ~#2537). Regenerate by running `npm run graph` then
`npx tsx scripts/time-browser-explorer.ts` and counting
`.cache/time-browser/explorer.json` against `.cache/graph.json`
(span-bearing entities only — the Explorer can only place records with dates).

## Where the Explorer sits against the dataset

The Explorer is a **curated window, not a mirror** — most graph classes
(passages, sources, objects, listings, questions…) were never meant to be
stops on a timeline. The fair denominator is the ~8,080 dateable
story-class records (event / person / place / building / work).

| Layer | Covered | Pool | Share |
|---|---|---|---|
| Subjects (stories) | 55 | hand-curated list | ~19 devin + ~36 claude |
| Events shown on stage | 508 | 3,945 dated events | ~13% |
| People shown (birth/death nodes) | 26 | 4,038 dated persons | ~0.6% — by design; people appear via events |
| Mappable places used | 117 | 1,900 places | ~6% |
| Story-class stops overall | ~560 | ~8,080 | ~7% |

## Roadmap — how coverage widens

1. **More subjects.** Each story adds ~5–15 events (and new places/sources
   when gaps are found). The claims file is the tracker — agents claim,
   build, ship per `EXPLORER-STORY-PIPELINE.md` §3.
2. **Edge enrichment.** `occurred_at` / `participated_in` on existing dated
   records is the cheapest multiplier: the graph auto-picks linked events
   into a subject (e.g. Tughril Beg pulled 10+ pre-existing Seljuk events
   nobody wrote for the story).
3. **Date enrichment.** Only ~3.9k of 4.4k events are dated; undated records
   gain spans where a source allows (always `derived` + honest notes).

## Planned / remaining

- Backdrop generation for all nodes (SDXL queue; screen for people/text
  rejects — one reject found so far and removed).
- Next subject candidates (unclaimed): Tlemcen, Kairouan, Bukhara, Timur,
  plus Claude's lane list in `claims.md`.
- Known open items are tracked in `DESIGN.md` §9 (interval-EDTF label
  rendering, `--out` flag for explorer-images, near-duplicate event pairs
  to alias, and the Mamluk-period question — resolved as `person/baybars`).

## Current subjects (devin lane)

mehmed-ii · delhi · ibn-rushd · al-biruni · al-khwarizmi · umar-khayyam ·
al-farabi · ibn-al-haytham · mansa-musa · bayt-al-hikma ·
great-mosque-cordoba · tughril-beg (Seljuks) · sulayman-al-qanuni ·
al-idrisi · baybars (Mamluks) · granada · samarqand · fes · nishapur ·
timbuktu · ibn-jubayr (rihla)

Claude's lane covers the prophets/companions-era figures, the major
periods and the major places (see `claims.md`).
