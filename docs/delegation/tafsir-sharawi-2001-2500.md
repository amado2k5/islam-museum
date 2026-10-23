# Sha'rawi tafsir (Khawatir, scan), pages 2001-2500: progress

Harvest of the scan pages 2001-2500 of Muhammad Mutawalli al-Sha'rawi's tafsir into draft museum entities. Branch `harvest/tafsir-sharawi-2001-2500`, cut from `origin/main`.

Ground rules applied: draft only (`status.review: draft`, `provenance`), Qur'an text never typed (passage ids only), honorifics never typed, every claim is Sha'rawi's own view unless marked, every fact cites a scan page. Page numbers are scan pages, not printed pages. Edition not yet verified (see the source entity).

## Status

- Last page read and recorded: **2124**. Pages 2125-2500 not yet read.
- Source entity: `source/tafsir-sharawi-khawatir-scan-vol-2`, this lane's own record for pages 1001 onward (split from the volume-one record on `origin/main`; see commit f14259f4f). Its label and `reliability_note` still say **volume one**, which the source owner should correct; this lane cites the vol-2 id. Its label and `reliability_note` describe **volume one** (al-Fatiha to 2:154). The pages in this batch are in al-Nisa'. Before publication, confirm whether the scan index runs across volumes; if these pages come from volume two, the owner of the source file should add that volume, not this lane. Edition unverified; cite pages are scan pages.
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

## Batch 2 (pages 2025-2124, surah al-Nisa' 11-23 and the start of 24)

Entities created (all `status.review: draft`, provenance block, Arabic, English and Urdu prose in the same commit):
- `concept/al-kalala` (collateral heirs; the two sides of kalala), `perspectives` (Sha'rawi's reading; academic view needs source).
- `concept/al-wasiyya` (bequest: order against the debt, the one-third limit), `perspectives`.
- `concept/hudud-allah` (the limits of God as separators; ownership limit vs neighbourly limit).
- `concept/qada-wa-al-diyana` (judicial ruling vs religious position), `perspectives`.
- `concept/al-tafattut-al-insiyabi` (Sha'rawi's social reading of dispersal of wealth by inheritance; no academic reading yet).
- `concept/al-tabanni` (adoption and the Zayd-Zaynab account, as told in the book; not yet checked against the biographical sources), `perspectives`.
- `concept/al-muasharah-bil-maruf` (affection vs kindness in marriage).
- `concept/mirath-al-nisa` (the verse forbidding inheriting women by force; pre-Islamic custom), `perspectives`.

Deliberately not recorded as facts (polemic or unverified empirical claims in the scan, kept in the claims table only): the AIDS and "abnormal intercourse" claim (p. 2063), the Masonry and Rotary remarks (p. 2076), and the consanguinity-and-weakness claim presented as modern science (p. 2094-2095). The hadith on consanguinity is cited by the book's footnote only.

Temporary marriage (pp. 2113-2116) is already covered by `concept/muta` on `origin/main` (another lane, with Sunni, academic and Shia perspectives). A first draft `concept/nikah-al-mutah` was withdrawn as a duplicate before this commit; Sha'rawi's pages are to be added to `concept/muta` as a source and claim in a later pass.

Reused, not yet edited (candidates for a later pass, noted in the claims table): `concept/zina` (stoning and the hadd debate pp. 2059-2061, sodomy p. 2066-2067, needs a perspectives block), `concept/tawba` (pp. 2070-2078), `concept/mahram` (pp. 2089-2096), `concept/khamr` (gradual prohibition pp. 2117-2118), `concept/hujjiyyat-al-sunna` (the Prophet's delegated legislation, pp. 2039-2040), `practice/mahr` (pp. 2085-2090), `practice/nikah` (exchange marriages p. 2096).

Persons used (existing): `person/muhammad-mutawalli-al-shaarawi`, `person/umar-ibn-al-khattab`, `person/ali-ibn-abi-talib`, `person/uthman-ibn-affan`, `person/zayd-ibn-haritha`, `person/zaynab-bint-jahsh`, `person/abdullah-ibn-abbas`. No passage links were added in this batch: the passage files are generated from Tanzil and `revealed_about` runs from passage to concept, so the Qur'an links for these entities are still to be added from the passage side (`quran-4-12`, `quran-4-19`, `quran-4-22` to `quran-4-24`, `quran-4-176`).

Doubts: the Ali anecdote on the six-month birth (p. 2097) and the Umar mahr anecdotes (pp. 2085-2086) have no transmission chain in this text; the Zayd-Zaynab account (pp. 2100-2107) is the book's own telling and needs checking against the sira sources before any publication. The "two sisters as slave-women" ruling (p. 2109) is recorded as Ali's and Uthman's positions as the book gives them.

## Not yet done (next batches)

- 2015-2024: inheritance verses (4:7-11) to link `concept/ilm-al-faraid`; zakat as social insurance (p. 2017); the Khidr story (p. 2019-2021) to `passage/quran-18-66`, with the Sha'rawi reading kept as his.
- Pages 2125-2500: not read. Batch 2 (2025-2124) is done.
- Contested topics to mark with `perspectives` when reached: plurality and social absorption (already started), slavery and concubinage (started), the inheritance of women (if the book states a view with doubt markers).
- Persons named but not linked (no entity yet): Sayyid Qutb (p. 2015), Dr Muhammad Khafaja (p. 2006, a commentary not read), Dr Ahmad Umar Hashim (editor's footnote on p. 2024, not Sha'rawi). Add to `data/_stubs.d/tafsir-sharawi-2001-2500.yaml` if linked later.

## Doubts

- OCR of the scan: the word on p. 2008 ("حررت ولدها") and the Ali anecdote on pp. 2010-2011 need checking on the page image.
- The edition is unverified. Page numbers are scan pages; a printed-page concordance is needed before the citations are final.
