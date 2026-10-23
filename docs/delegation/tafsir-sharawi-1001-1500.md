# Harvest progress: Sha'rawi tafsir (Khawatir scan), pages 1001-1500

Owner: branch `harvest/tafsir-sharawi-1001-1500`. Source edition: `source/tafsir-sharawi-khawatir-scan` (edition and publisher unverified against the title page; see the source entity).

## Status

- Last scan page reached: **1008** (of 1001-1500). Pages 1009-1500 are not yet mined.
- Covered so far: Al-Baqara 228-234 (divorce, waiting period, breastfeeding, maintenance) on pp. 1001-1008.
- Entities created in batch 1: 3 concepts (`concept/talaq`, `concept/breastfeeding-and-weaning`, `concept/maintenance-after-divorce`) and the source entity.
- Entities reused (linked, not changed): `concept/iddah`, `concept/raja`, `concept/rada`, `person/muhammad-mutawalli-al-shaarawi`, `passage/quran-2-228` to `passage/quran-2-234`.

## Known gaps

- Academic and other perspectives are not yet written for these concepts: no checked academic or other-view source is cited yet. The Sunni entries carry Sha'rawi's readings only.
- Relations to passages and other concepts use `related_to`, which the validator flags as a discouraged fallback; no typed predicate fits concept-to-passage edges from this side.
- `concept/talaq` is still listed in `data/_stubs.yaml`; the validator asks for that stub line to be removed. Left untouched because the shared stub file is append-only.
- The source edition is flagged unverified; a reviewer must check the title page before any citation is marked verified.

## Next

Continue from page 1009 in sections of 20-40 pages, writing a claims table in the scratchpad (not in git), then one commit per batch of at most 25 entities.
