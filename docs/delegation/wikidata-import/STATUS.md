# Wikidata import — status

Updated at every push to `main`. Lane: `wikidata-import` (`docs/delegation/wikidata-import/README.md`).

## 19 Oct 2026 — lane opened

- Candidates frozen: **82,296** (P140=Islam minus the 987 QIDs already linked in `data/`), sorted by sitelink count desc; file at `$HARVEST/wikidata-import/candidates.tsv`, sha256 `7f50762a…`.
- Created: 0 · Linked: 0 · Skipped: 0 · `next_index`: 0
- Baseline: `npm run validate` 0 errors / 1996 warnings; `npm test` 101 passed.
- Nothing blocked.

## 19 Oct 2026 — batches 1–3 (candidates 0–259)

- Created: **34** draft records · Linked: **69** existing records to Wikidata items · Skipped: **157** · `next_index`: **260**
- Skips by reason: mostly modern/post-1800 people, unconfirmed sources, out-of-scope terms and collectives; see `batches/0001.md`–`0002.md`.
- Relinks fixed 5 wrong pre-existing QIDs (Ali, Abu Bakr, Malcolm X, sharia, tasawwuf); Khadija and Ahmed III duplicates merged into the richer existing records; Umayyad candidate Q45646 is the distinct dynasty item — the record keeps the caliphate item Q8575586.
- `npm run validate`: 0 errors / 1997 warnings.
- Nothing blocked; pushing per the every-200-created rule once 200 new records accumulate — pushing now anyway to keep remote current.

## 19 Oct 2026 — batches 4–6 (candidates 260–659)

- Created: **89** draft records total · Linked: **174** · Skipped: **397** · `next_index`: **660**
- Batch 6 (560–659) alone: 20 creates, 23 links, 57 skips — al-Dhahabi, Ibn Tumart, al-Kashi, Ibn Miskawayh, Ismail Samani, Bairam Khan, al-Askari shrine, the Tabi'un, and Ottoman figures (Cem, Rustem, Halime, Lala Mustafa, Sehzade Bayezid, Tahmasp II); links incl. Qilij Arslan I, Abu Ma'shar, Sa'id ibn Zayd, al-Muhtadi, al-Kamil, al-Nasa'i, Abu Yusuf, Qalawun, al-Mu'tazz, Ubayd Allah al-Mahdi, Yaqub al-Mansur, Ibn Hisham, al-Zamakhshari.
- `npm run validate`: 0 errors / 1997 warnings; `npm test` 101 passed; graph 22,800 nodes.
- Pushed to main: `af59bb827`. Nothing blocked.

## 19 Oct 2026 — batches 7–11 (candidates 660–1059)

- Created: **159** draft records total · Linked: **263** · Skipped: **638** · `next_index`: **1060**
- Batch 11 (960–1059): 21 creates — Zagan Pasha, Abd al-Razzaq Samarqandi, Sikandar Lodi, Kilic Ali Pasha, Masud I of Rum, Miran Shah, Shahrukh Afshar, Ibn Bakhtiyar Khalji, Khizr Khan, Chand Bibi, Fazil Mustafa Koprulu, al-Fazari, Kilij Arslan II, Minhaj-i Siraj, Sinan Pasha, Qara Yusuf, Piyale Pasha, Isa Celebi, Gawhar Shad, Pir Muhammad, Devlet Hatun.
- Duplicate resolved: my `person/sulayman-pasha-khadim` record for Hadim Suleyman Pasha merged into the richer existing `person/hadim-suleyman-pasha` (QID moved; new file deleted).
- `npm run validate`: 0 errors / 1998 warnings; `npm test` 101 passed.
- Pushed to main: `01c3208b5`. Nothing blocked.

## 19 Oct 2026 — batches 12–13 (candidates 1060–1259)

- Created: **208** draft records total · Linked: **302** · Skipped: **750** · `next_index`: **1260**
- Batch 12 (1060–1159): 24 creates incl. Hersekzade Ahmed Pasha, Shaykh al-Saduq, al-Qurtubi, Ibn Sa'd link, Green Mosque Bursa, Eski/Uc Serefeli Edirne, Suhrawardiyya, Sidrat al-Muntaha; 25 links incl. al-Juwayni, al-Bayhaqi, al-Khatib, Wasil ibn Ata, Idris II.
- Batch 13 (1160–1259): 25 creates incl. Baha al-Din al-Amili, al-Shaykh al-Mufid, al-Shadhili, Ibn Manzur, Kaysaniyya, al-Zaytuna, Danishmend Gazi; 14 links incl. al-Zuhri, al-Qushayri, Jawhar, Ibn al-Kalbi, al-Baydawi.
- `npm run validate`: 0 errors / 1998 warnings; `npm test` 101 passed.
- Pushed to main. Nothing blocked.

## 19 Oct 2026 — batches 14–21 (candidates 1260–2059)

- Created: **413** draft records total · Linked: **447** · Skipped: **1202** · `next_index`: **2060**
- Batch 21 (1960–2059) applied 26 creates and was split into two commits (`574672a0f`, `d6d413304`) to honor the 25-per-commit cap; one link-FAILED logged where Q3556309 (Hadim Mesih Pasha, d.1592) differs from the existing `person/mesih-pasha` (d.1501) — skipped and deferred.
- Earlier batches: 24 creates (1260–1359), 24 creates (1360–1459), 30 creates split into two commits (1460–1559), 25 creates (1560–1659), 25 creates (1660–1759), 24 creates + duplicate merge of al-Abbas al-Jawhari (1760–1859), 25 creates (1860–1959).
- `npm run validate`: 0 errors / 1999 warnings; `npm test` 101 passed.
- Pushed to main: `66fdae59b` (merge `66fdae59b` includes art assets from the parallel lane). Nothing blocked.

## 19 Oct 2026 — push through candidates 2559 (batches 0020–0026)

- Created: **533** · Linked: **498** · Skipped: **1534** · `next_index`: **2560**
- Pushed through `86085d1ae`: Umayyad-era companions and scholars, Mamluk-era figures, Ottoman viziers, mosques; parallel-lane collisions (Abdullah ibn Abd al-Malik, Layla al-Akhyaliyya, Khuzayma ibn Thabit, al-Dahhak ibn Qays, Muqatil, Abu al-Abbas al-Mursi, al-Turtushi) merged into richer existing records as links.
- `npm run validate`: 0 errors / ~2000 warnings; `npm test`: 101 passed.
- Nothing blocked.

## 2026 push — through candidate 3859
- next_index: 3860 / 82296
- created: 822, linked: ~610, skipped: ~2430 (see progress.json for the live counters)
- last_commit/push: 6adf6ca4c
- blocked: nothing

## 2026 push — through candidate 4659
- next_index: 4660 / 82296
- created: 999, linked: 649, skipped: 3047 (progress.json is authoritative)
- last_push: b35a3b40c
- Notable merges: abu-al-muzaffar-al-samani, anushirwan-ibn-khalid, al-aswad-ibn-yazid-al-nakhai, salit-ibn-amr absorbed duplicate creates as links; Q18608788 (Ghurid empire item) skipped as alternate of polity/ghurid-dynasty.
- validate: 0 errors / ~2004 warnings; npm test: 101 passed. Nothing blocked.

## 2026 push — through candidate 5859
- next_index: 5860 / 82296
- created: 1238, linked: 687, skipped: 3971 (progress.json is authoritative)
- last_push: 88cfe5d59 (merge 88cfe5d59 of remote r2-sync test change)
- Notable merges: umayr-ibn-al-humam, rabi-bint-al-nadr (al-rabi-bint-al-nadr), shurayk-ibn-abd-allah-al-nakhai, ibn-muflih-burhan absorbed duplicate creates as links.
- validate: 0 errors / ~2009 warnings; npm test: 101 passed. Nothing blocked.

## 2026 push — through candidate 7059
- next_index: 7060 / 82296
- created: 1530, linked: 710, skipped: 4859 (progress.json is authoritative)
- last_push: ca3a4ef2b (merge of remote r2-sync test changes)
- Notable links: ibn-qindas (Ibn Qundus), burhan-ibn-abi-sharif, muhammad-al-bakri-siddiqi, al-husayn-al-najjar (Mu'tazili), abu-al-abbas-al-nashi (Nashi al-Akbar), rajih-al-hilli, al-sayyid-al-himyari, ibn-al-shihna (al-Saghir).
- New buildings: al-zahiriyah-madrasa-taiz (Rasulid), al-jami-al-kabir-diriyah.
- validate: 0 errors / ~2013 warnings; npm test: 101 passed.

## 19 Oct 2026 — through candidate 9259
- next_index: 9260 / 82296
- created: ~1890, linked: ~720, skipped: ~6750 (progress.json is authoritative)
- last_push: d87cf2e5e
- Large Ottoman tezkere clusters: hundreds of named writers, poets, jurists, calligraphers and composers created as draft cards; homonym conflicts resolved via data/_homonyms.yaml (yumni vs yamini-poet) and merges (musannifak linked to the rich existing record).
- validate: 0 errors / ~2013 warnings; npm test: 101 passed.

## 19 Oct 2026 — lane complete, candidate list exhausted (through 82295)
- next_index: 82296 / 82296 — every candidate decided.
- Totals: created 2,179 draft records; linked 722 existing records to Wikidata items (incl. relinks of wrong QIDs); skipped 79,432.
- The dominant skip: indices ~9579–82181 are a mass modern Saudi mosque-list import (P31=Q32815, P17=Saudi Arabia, four-claim items); all mundane modern list items skipped. Heritage-registered historic mosques documented in the Saudi and Yemen "Atlas of Historic Mosques" (new source records source/atlas-masajid-tarikhiyya-saudi, -yaman) were created (13), as were the historic Haramayn mosques surfaced earlier in the list (Quba-era sites were already linked; al-Rawda, Masjid al-Ijaba, al-Ghamama, al-Nimrah, al-Jinn, al-Khayf, Sayyid al-Shuhada, al-Jumu'ah, Juranah, the Seven Mosques, the Green Dome, Masjid Aisha at al-Tan'im created).
- Final tail (82182–82295): ~36 Rasulid/medieval Yemeni madrasas and dar al-Qur'an records created, plus historic figures (Ibn Karama al-Bayhaqi, Abu al-Hasan al-Sindi, Isabel of Granada, Mai Safoora).
- validate: 0 errors / ~2013 warnings; npm test: 101 passed.
- Lane is complete: no further candidates remain in the frozen subset.
