# Sha'rawi tafsir (Khawatir, scan), pages 2001-2500: progress

Harvest of the scan pages 2001-2500 of Muhammad Mutawalli al-Sha'rawi's tafsir into draft museum entities. Branch `harvest/tafsir-sharawi-2001-2500`, cut from `origin/main`.

Ground rules applied: draft only (`status.review: draft`, `provenance`), Qur'an text never typed (passage ids only), honorifics never typed, every claim is Sha'rawi's own view unless marked, every fact cites a scan page. Page numbers are scan pages, not printed pages. Edition not yet verified (see the source entity).

## Status

- Last page read and recorded: **2024**. Pages 2025-2500 not yet read.
- Source entity: `source/tafsir-sharawi-khawatir-scan-vol-2`, reused from `origin/main` (created by the parallel run `tafsir-sharawi-1-500`). Its label and `reliability_note` describe **volume one** (al-Fatiha to 2:154). The pages in this batch are in al-Nisa'. Before publication, confirm whether the scan index runs across volumes; if these pages come from volume two, the owner of the source file should add that volume, not this lane. Edition unverified; cite pages are scan pages.
- Claims table (outside git): `scratchpad/tafsir/claims-2001-2500.md`.

## Batch 1 (pages 2001-2024, surah al-Nisa' 3-11 and the Khidr passage in commentary)

Entities created:
- `concept/adl-bayn-al-zawjat` (justice among co-wives), with `perspectives` (Sha'rawi's reading; academic view needs source).
- `concept/milk-al-yamin` (what the right hand owns), with `perspectives` (Sha'rawi on ending slavery; academic view needs source). One OCR word on p. 2008 to be checked on the page image.
- `practice/mahr` (bridal gift), with `perspectives`. The Ali anecdote on p. 2010 has no chain of transmission in this text (needs_source).
- `concept/wilayat-al-mal-al-yatim` (guardianship over an orphan's property), with `perspectives`.
- `source/tafsir-sharawi-khawatir-scan-vol-2`.

Entities edited:
- `concept/taadud-al-zawajat`: added `perspectives` (Sha'rawi's permission-with-justice and surplus argument, a Sunni entry; other states' view and academic view both marked needs_source) and the new source.
- `person/muhammad-mutawalli-al-shaarawi`: added the new source.

Reused, not yet edited: `passage/quran-4-2` to `quran-4-12`, `quran-4-34`, `quran-4-129`, `quran-18-66`, `person/muhammad-mutawalli-al-shaarawi`, `person/umar-ibn-al-khattab`, `person/ali-ibn-abi-talib`, `concept/ilm-al-faraid`, `concept/zakat`.

## Not yet done (next batches)

- 2015-2024: inheritance verses (4:7-11) to link `concept/ilm-al-faraid`; zakat as social insurance (p. 2017); the Khidr story (p. 2019-2021) to `passage/quran-18-66`, with the Sha'rawi reading kept as his.
- Pages 2025-2500: not read.
- Contested topics to mark with `perspectives` when reached: plurality and social absorption (already started), slavery and concubinage (started), the inheritance of women (if the book states a view with doubt markers).
- Persons named but not linked (no entity yet): Sayyid Qutb (p. 2015), Dr Muhammad Khafaja (p. 2006, a commentary not read), Dr Ahmad Umar Hashim (editor's footnote on p. 2024, not Sha'rawi). Add to `data/_stubs.d/tafsir-sharawi-2001-2500.yaml` if linked later.

## Doubts

- OCR of the scan: the word on p. 2008 ("حررت ولدها") and the Ali anecdote on pp. 2010-2011 need checking on the page image.
- The edition is unverified. Page numbers are scan pages; a printed-page concordance is needed before the citations are final.
