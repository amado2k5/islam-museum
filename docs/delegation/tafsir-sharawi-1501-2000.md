# Sha'rawi tafsir (Khawatir scan), pages 1501-2000: harvest progress

Owner: harvest run `sharawi-harvest-1501-2000-batch-1` (Claude Haiku 5.5).
Source: scan titled "تفسير الشعراوي", OCR text for pages 1501-2000 (kept outside git).
Source entity: `source/tafsir-sharawi-khawatir-scan-vol-2` (edition unverified; page numbers are scan markers).

## Status

- **Last page reached:** 1620 (batch 2 ends at Al Imran 92 and the rules on giving, 1609-1616, and the prohibitions on the Jews, 1617-1620).
- **Next start:** page 1621 (the continuation of Al Imran 92 onward).
- **Pages not yet read:** 1621-2000.

## Batch 2 (pages 1521-1620)

Entities created (all `status.review: draft`, provenance run `sharawi-harvest-1521-2000-batch-1`):
- `concept/kalima-sawa`, `concept/hanif`, `concept/nafs-lawwama`, `concept/inheritance-of-prophethood`, `concept/idlal-al-ghayr`, `concept/talbis-al-haqq`, `concept/fadl-allah`, `concept/amanah`, `concept/love-of-deeds`, `concept/ahd-allah`, `concept/nabi-and-rasul`, `concept/rabbaniyyun`, `concept/mithaq-al-nabiyyin`, `concept/fisq`, `concept/submission-of-creation`, `concept/completion-of-earlier-messages`, `concept/hidaya`, `concept/tahrim-as-chastisement` (18 entities, Arabic first, English and Urdu translations in the same commit).

Reused, not edited (candidates for a later extension pass): `concept/tahrif`, `concept/tawba`, `concept/birr`, `concept/riya`, `concept/ikrah`, `concept/khuluq`, `concept/al-sidq-truthfulness`, `concept/mithaq-bani-israil`, `concept/khatm-al-nubuwwa`, `concept/ahl-al-kitab`, `concept/islam-common-religion-of-prophets`, `concept/riba`, `person/abdullah-ibn-salam`, `person/kab-ibn-al-ashraf`, `person/ibrahim`, `person/nuh`, `source/sahih-al-bukhari`, `source/sahih-muslim`.

Notes:
- Academic and other views are not invented: each contested entity has its academic block marked needs_source, and no other view is set out where none was checked.
- Hadith locations cited by Sha'rawi (the brick hadith, the Salman hadith, the hadith on the seeking of forgiveness) are not verified against the collections.
- The edition is unverified; every citation names the scan page.

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
