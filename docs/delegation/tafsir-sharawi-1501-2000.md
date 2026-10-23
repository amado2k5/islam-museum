# Sha'rawi tafsir (Khawatir scan), pages 1501-2000: harvest progress

Owner: harvest run `sharawi-harvest-1501-2000-batch-1` (Claude Haiku 5.5).
Source: scan titled "تفسير الشعراوي", OCR text for pages 1501-2000 (kept outside git).
Source entity: `source/tafsir-sharawi-khawatir-scan` (edition unverified; page numbers are scan markers).

## Status

- **Last page reached:** 1520 (end of the commentary on Al Imran 55-61 and the Najran mubahala).
- **Next start:** page 1521 (Al Imran 61 onward, the rest of the Najran episode and the following verses).
- **Pages not yet read:** 1521-2000.

## Batch 1 (pages 1501-1520)

Entities created (all `status.review: draft`):
- `concept/tawaffi`: the meaning of tawaffi (taking in full, sleep, death versus killing, Al Imran 55).
- `concept/mubahala`: the mubahala of Najran, with Sha'rawi's reading of the delegation's refusal.
- `concept/descent-of-isa`: Sha'rawi's affirmation of the descent of Jesus before the Hour.

Reused (no new entity): `person/muhammad-mutawalli-al-shaarawi`, `person/isa-ibn-maryam`, `event/delegation-of-najran`, `passage/quran-3-55`, `passage/quran-3-61`, `passage/quran-6-60`, `passage/quran-39-42`, `source/sahih-al-bukhari`, `source/sahih-muslim`.

Prose: Arabic (`content/ar/concept/`), English and Urdu (`content/en/concept/`, `content/ur/concept/`) in the same commit.

## Notes

- The Qur'an text is never typed here; verses are referenced by passage id only.
- Sha'rawi's views are recorded as his. Each contested point has a `perspectives` block with Sunni first, then an academic entry marked `needs_source`.
- No academic reading from a named source is included yet for any entry.
- The scan's edition, publisher and printed page numbers are not verified.

## Candidates for later batches (not started)

- Sha'rawi's arguments against the divine sonship of Jesus and the image-of-God argument (pages 1507-1516). These need a perspectives block with the Christian view sourced from its own holders.
- The Najran verses 62-64 onward and the verses on Abraham's religion.
- Sura Al Imran remainder, and later suras.
