# Harvest progress: Sha'rawi tafsir (Khawatir scan), pages 1001-1500

Owner: branch `harvest/tafsir-sharawi-1001-1500`. Source edition: `source/tafsir-sharawi-khawatir-scan` (edition and publisher unverified against the title page; see the source entity).

## Status

- Last scan page reached: **1038** (of 1001-1500). Pages 1039-1500 are not yet mined.
- Covered so far: Al-Baqara 228-243 (divorce, waiting period, breastfeeding, maintenance, dower, allusion in iddah, middle prayer, fear prayer, widow's year, flight from death) on pp. 1001-1038.

## Batch 2 (pages 1009-1038)

- Entities created (7): `concept/divorce-before-consummation`, `concept/waiver-of-dower`, `concept/salat-al-wusta` (contested), `practice/salat-al-khawf`, `concept/widow-residence-year`, `concept/allusion-to-proposal-in-iddah`, `concept/fleeing-from-death`. Each has ar, en and ur prose in the same commit, `status.review: draft`, and the source entity.
- Entities reused (linked, not changed): `concept/talaq`, `concept/iddah`, `concept/muta` (its perspectives already carry the academic and Shi'i views; Sha'rawi's opposition to fixed-term marriage at p. 1015 is not yet added to it), `concept/maintenance-after-divorce`, `person/muhammad-mutawalli-al-shaarawi`, passages `quran-2-235` to `quran-2-243`.
- Claims table: scratchpad `claims-1009-1500.md` (not in git).
- Contested points with perspectives: waiver of dower (who is "the one in whose hand is the knot", p. 1020); middle prayer (pp. 1024-1025); fear prayer (Sha'rawi's own view on the imam, p. 1027); flight from death (exegetes' causes, p. 1031).
- Academic and other-tradition views are not yet checked for any of these; each entity says so.
- Entities created in batch 1: 3 concepts (`concept/talaq`, `concept/breastfeeding-and-weaning`, `concept/maintenance-after-divorce`) and the source entity.
- Entities reused (linked, not changed): `concept/iddah`, `concept/raja`, `concept/rada`, `person/muhammad-mutawalli-al-shaarawi`, `passage/quran-2-228` to `passage/quran-2-234`.

## Known gaps

- Academic and other perspectives are not yet written for these concepts: no checked academic or other-view source is cited yet. The Sunni entries carry Sha'rawi's readings only.
- Batch 1 uses `related_to` edges, which the validator flags. Batch 2 writes none: concept-to-passage links are prose links only, because the passage predicates (`revealed_about`, `basis_for`) are written from the passage side, which this lane does not edit. Batch 1's edges should be replaced in a clean-up.
- `practice/salat-al-khawf` is listed in `data/_stubs.yaml`; the validator asks for that line to be removed. Left untouched because the shared stub file is append-only; a lane owner or the founder should remove it.
- `concept/talaq` is still listed in `data/_stubs.yaml`; the validator asks for that stub line to be removed. Left untouched because the shared stub file is append-only.
- The source edition is flagged unverified; a reviewer must check the title page before any citation is marked verified.

## Next

Continue from page 1009 in sections of 20-40 pages, writing a claims table in the scratchpad (not in git), then one commit per batch of at most 25 entities.
