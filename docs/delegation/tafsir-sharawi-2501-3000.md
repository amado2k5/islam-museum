# Harvest: Sha'rawi's commentary (Khawatir), scan pages 2501-3000

Lane: tafsir-sharawi-2501-3000. Branch: harvest/tafsir-sharawi-2501-3000.
Source entity: `source/tafsir-sharawi-khawatir-scan` (edition not verified; citations are scan page numbers, not printed pages).
Working notes (claims table) are kept outside git, in the session scratchpad.

## Progress

- Last scan page read and drafted: **2622** (batch 2 ends; commentary on Surat al-Nisa, verses 88 to 113: hypocrites, covenants, killing and blood-money, prayer in fear, migration, judging between people).
- Pages 2623-3000: not yet harvested. Pages 2623-2624 were read while closing batch 2 and carry over to batch 3.

## Batch 2 (scan pages 2523-2622)

- Created (9 concepts and practices, each with Arabic, English and Urdu prose): `concept/diya`, `concept/qisas`, `concept/qatl-amd`, `concept/tabayyun`, `practice/salat-al-khawf`, `concept/hijra-fi-sabil-allah`, `concept/hidaya`, `concept/ahd-wal-mithaq`, `concept/hukm-bayn-al-nas`.
- Extended (perspectives added, prose not changed): `concept/nifaq` (sunni-sharawi-hypocrites), `concept/tawba` (sunni-sharawi-three-stages), `concept/kasb` (sunni-sharawi-kasb-iktisab).
- Source: `source/tafsir-sharawi-khawatir-scan` reliability note now records that scan p.2586 is the title page of volume five (Q. 4:101 to 5:54).
- Reused without edit: `event/hijra` (not linked from the new hijra concept; the concept is about the doctrine), `concept/qadar`, `concept/ikrah`, `concept/munafiq`, `concept/niyya`, `person/muhammad-mutawalli-al-shaarawi`; passages linked from the new entities: Q. 2:178, 2:179, 4:88, 4:90, 4:92, 4:93, 4:94, 4:97, 4:100, 4:101, 4:102, 4:105, 4:112, 28:56, 42:52.
- Hadith sources named in the scan footnotes and cited as sources: `source/sahih-al-bukhari`, `source/sahih-muslim`, `source/sunan-abi-dawud`, `source/sunan-al-nasai` (the footnotes name these collections; the hadith are not checked against them).
- Entities: 9 created, 3 extended, 0 deleted. Coverage regenerated.
- No Qur'an text is typed; verses are referenced only as passage ids.

## Batch 1 (scan pages 2501-2522)

- Created: `source/tafsir-sharawi-khawatir-scan`, `work/tafsir-al-shaarawi`, `practice/greeting-salam` (Arabic, English and Urdu prose).
- Extended (perspectives and sources added, prose not changed): `concept/qadar` (sunni-sharawi-two-attributes), `concept/ikrah` (sunni-sharawi-no-compulsion).
- Reused without edit so far: `concept/munafiq`, `concept/nifaq`, `concept/al-sidq-truthfulness`, `person/muhammad-mutawalli-al-shaarawi`, `passage/quran-4-86`, `passage/quran-4-88`, `passage/quran-2-256`.

## Open items

- The edition is not identified; the scan's publisher and year are not recorded anywhere.
- Contested points (decree, compulsion and fighting, greeting rules for women and non-believers) carry Sha'rawi's view only. Sunni positions from named sources, academic and other views are marked `needs_source`.
- The Badr-era account of the split over fleeing to Mecca (scan p.2516) is recorded in the claims table and not yet written as an event; no named source.
- Concept prose for `qadar` and `ikrah` in `content/ar` has not been updated with Sha'rawi's view; the new perspectives are in the YAML only.
- `concept/munafiq`, `concept/nifaq` and `concept/al-sidq-truthfulness` have not been edited yet.
