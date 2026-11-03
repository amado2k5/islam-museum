# Poetry passages: progress

Plan: `docs/delegation/poetry-passages-plan.md`. Source for the Sira poems: Ibn Hisham, al-Sira, ed. Wüstenfeld (Leipzig 1858), read from the page scans (never from the OCR alone); the cited page is the printed page number. Each passage is one bayt; metre and rhyme are set only when read from the text.

## Done (works with passages)

| Work | Passages | Printed pages |
|---|---|---|
| `work/hassan-poem-kunna-muluk-al-nas` | 6 | 394 (pilot, PR #2951) |
| `work/labid-elegies-for-arbad` | 5 | pilot |
| `work/qasidat-banat-suad` | 7 | 892 (pilot) |
| `work/zibriqan-boast-poem` | 7 | 935-936 |
| `work/hassan-reply-to-zibriqan` | 8 | 936-937 |
| `work/hassan-second-reply-to-zibriqan` | 9 | 938 |
| `work/amr-ibn-al-ahtam-satire-of-qays-ibn-asim` | 1 | 939 (second verse not read with confidence) |
| `work/zibriqan-second-boast` | 2 | 937 |
| `work/amr-ibn-madikarib-poem-to-qays-ibn-makshuh` | 3 | 952 |
| `work/hassan-poem-qawmi-ulaika` | 3 | 931 |
| `work/malik-ibn-awf-jirana-praise` | 4 | 879 |
| `work/abbas-ibn-mirdas-atab` | 6 | 881-882 |

## Skipped, with reason

- `work/tarjuman-al-ashwaq`, `work/hirz-al-amani-wa-wajh-al-tahani`, `work/alpamish`: text not in a reachable public-domain source in this lane.

## Notes

- The lines Hassan composed on the way (`منعنا رسول الله إذ حل وسطنا`, p. 936) are a different recension from the ode on p. 938; only the p. 938 text is used for `hassan-second-reply-to-zibriqan`.
- Zibriqan's first verse (`وفينا تنصب البيع`) is translated cautiously: Ibn Hisham gives the variant `تقسم الربع` (quarter-share).

## Remaining

Every other `kind: poem` work in `data/work/` not listed above (Ka'b ibn Malik, Hassan's elegies, Abbas ibn Mirdas on Hunayn and others, minor Sira verse sets).

## Batch log

- PR 1 (#2987): Tamim delegation poems (25).
- PR 2: Zibriqan second boast, Amr ibn Ma'dikarib, Hassan 'qawmi ulaika', Malik ibn Awf, Abbas ibn Mirdas (atab), Hassan's Mu'tah elegy (25).
- PR 3: Ka'b ibn Malik's Mu'tah elegy, Hassan's elegy for the Prophet, Abu Afak, Umama al-Muzayriyya (24).
- PR 4: Asma bint Marwan's verses and Hassan's reply (7).

## Still to do (for the next session)

- `work/abbas-ibn-mirdas-hunayn`: its recorded opening is `تقضى أمور وتأتي أمور`, not yet located in the Wustenfeld scan. Printed p. 858 (scan index 322 of theil2) has a different Hunayn ode of Abbas, `إني والسوابح يوم جمع`; check whether it is the same work before attaching it.
- `work/kaab-ibn-malik-hunayn`, `work/hassan-poem-enumerating-the-maghazi`, `work/hassan-poem-kunna-muluk-al-nas` (more bayts), and the short verse sets (Aban, Khalid, Said ibn al-As, al-Numan ibn Adi, Abu Khaythama, Abdullah ibn Unays, Abu Jial, Bujayr, Farwa ibn Musayk, Farwa al-Judhami, al-Dahhak, al-Farazdaq, Salma bint Attab, Malik ibn al-Namt): the first line is not in the work files, so each needs a page hunt in the OCR of `vol1-theil2` followed by reading the scan.
- Search helper idea: normalise the OCR (strip diacritics, unify alef/ya/ta marbuta) and rank pages by shared letter trigrams with a known first hemistich.
- PR 5: Abdullah ibn Unays, Malik ibn al-Namt, Farwa ibn Musayk, Abu Ji'al, Salma bint Attab (24).
- PR 6: Farwa al-Judhami, al-Farazdaq, Said ibn al-As, Aban and Khalid ibn Said, Abu Khaythama, al-Numan ibn Adi (23).

## Not located yet (after PR 6)

- `work/bujayr-ibn-bujra-verses`, `work/al-dahhak-ibn-khalifa-verses`, `work/hassan-poem-enumerating-the-maghazi`, `work/kaab-ibn-malik-hunayn`, `work/abbas-ibn-mirdas-hunayn`: no first line in the work file and the trigram search did not land on the poem; still to locate by reading the relevant narrative pages (Hunayn around printed pp. 855-870, Tabuk around 894-900).
- Omitted lines: in Said ibn al-As's pair only the first verse was read with confidence; Abu Ji'al's lines 4-6 and Musayk's lines 1, 5-6 were skipped for legibility or uncertain sense.
- PR 7: Al-Dahhak ibn Khalifa, Bujayr ibn Bujra, Abbas ibn Mirdas on Hunayn (p. 859), Ka'b ibn Malik on the march to Ta'if (p. 870) (23).
  - Attribution note: the work records the openings `تقضى أمور وتأتي أمور` (Abbas) and `وقائلةٍ ألا تَبكِي أخاها` (Ka'b); the Wüstenfeld text has Abbas's Hunayn ode beginning `يا خاتم النبآء` (p. 859, Banu Sulaym's part at Hunayn) and Ka'b's Ta'if ode beginning `قضينا من تهامة` (p. 870). The passages are attached to those works on the basis of subject (Hunayn / march to Ta'if); the recorded openings were not found in this edition and may come from another recension.
  - Abbas's second ode on p. 859 (`أما ترى يا أم فروة خيلنا`) is not attached to any work yet.
- PR 8: Hassan's poem enumerating the Ansar's campaigns (17, pp. 929-930) and three more bayts of Hassan's lam-rhymed poem (refs 7-9) (20).
- PR 9 (Mutanabbi, from the local Dar Beirut 1983 scan; cited by scan page, which matches the printed page): `work/mutanabbi-wa-harr-qalbah` (14 bayts, pp. 331-332) and `work/mutanabbi-ala-qadr-ahl-al-azm` (7 bayts, p. 385). New poem works with `authors: person/al-mutanabbi`.
- PR 10: `work/mutanabbi-bima-al-taallul` (8 bayts, p. 471, Dar Beirut 1983 scan) and `work/tarjuman-al-ashwaq` (9 bayts, pp. 59, 62, 63, 86 of the local Dar al-Marefah 2005 scan, read from page renderings). `tarjuman-al-ashwaq` is therefore no longer skipped: the local edition carries Ibn Arabi's own commentary; only single bayts (under 40 words) of the modern printing are quoted.
- PR 11 (Mutanabbi, Dar Beirut 1983 scan): five more bayts of `mutanabbi-bima-al-taallul` (p. 472) and three new poem works: `mutanabbi-la-taqnaa-bima-dun-al-nujum` (6, p. 232), `mutanabbi-li-kulli-imri-ma-taawwada` (8, p. 370), `mutanabbi-aghalib-fika-al-shawq` (4, p. 466) (22 passages).
- PR 12: plain-link filters (by poet, metre, rhyme letter) in the Verses section of the poetry page, with en/ar/ur strings; no build run.
- PR 13: metre (and rhyme where missing) set on Hassan's lam-rhymed poem (tawil) and Farwa al-Judhami's verses (kamil / tawil by line). Labid's elegies left without metre: not established with confidence from the text.
- PR 14 (Mutanabbi, Dar Beirut 1983 scan): `mutanabbi-kafa-bika-daa` (6, p. 441), `mutanabbi-eid-biayyi-hal` (8, p. 506), `mutanabbi-kabirt-hawl-diyarihim` (11, p. 28) (25 passages, 3 new works).
- PR 15: new source `source/sharh-muallaqat-sab-zawzani-1921` (archive.org AAlexandrina-204263, downloaded to the drive and registered in WORK-REGISTRY.md; Vision OCR on the Mac; verses read from the page image) and `work/muallaqat-imru-al-qays` (11 bayts, pp. 3-7).
- PR 16: fix `issued` shape in the Zawzani source.
- PR 17 (Zawzani 1921): `muallaqat-tarafa` (15 bayts, pp. 46-75) and `muallaqat-amr-ibn-kulthum` (7 bayts, pp. 124-143), read from page images (22 passages).
- PR 18 (Zawzani 1921): `muallaqat-antara` (14 bayts, pp. 143-161) and `muallaqat-labid` (10 bayts, pp. 95-99) (24 passages). Remaining Mu'allaqat not done: Zuhayr and al-Harith ibn Hilliza (no person entities yet; pages 76 and 163 of the Zawzani scan).
- PR 19: new source `source/sharh-diwan-hassan-barquqi-1929` (archive.org AAlexandrina-074429, on the drive, Vision OCR done for all 416 pages) and four new Hassan works with metre as stated in the edition's headings: wa-ghibna (p. 41), alam-tadhir-al-ayn (p. 137), laqad-alimat-quraysh (p. 140), wa-inna-amran-yumsi (p. 142) (9 passages). The edition headings give the metre for ~70 more poems (OCR in books/adab-zuhd/diwan-hassan-barquqi-1929); printed page = scan page + 24.
- PR 20 (Barquqi Hassan diwan, pp. 55-57): satire verses on Madhhij (2), Safwan ibn Umayya (2), Hudhayl (3), Muzayna (3) = 10 passages, 4 new works; metre as stated in the edition.
- PR 21 (Barquqi Hassan diwan, p. 80): Hassan's Badr poem (4 bayts; one further bayt skipped as not legible with confidence).
- PR 22: corrected one word in the Badr poem bayt 4 (matches the scan).
- PR 23 (Zawzani 1921): `muallaqat-zuhayr` (11 bayts, pp. 76-81) and `muallaqat-al-harith-ibn-hilliza` (5 bayts, pp. 163-168; ref 3 omitted as incomplete on the scan), with new person records `zuhayr-ibn-abi-sulma` and `al-harith-ibn-hilliza-al-yashkuri`. All seven Mu'allaqat except Imru' al-Qays's remainder and al-A'sha's (not among the seven in this edition's order) are now covered.
- PR 24 (Barquqi Hassan diwan, pp. 58-59, 76): two poems (7 passages): to al-Walid ibn al-Mughira (wafir) and 'harban yashibu laha al-walid' (metre not stated in the visible heading, so omitted).
- PR 25 (Barquqi Hassan diwan, pp. 90-94): eight more bayts (refs 10-17) of `hassan-elegy-for-the-prophet`, the same elegy as in Ibn Hisham. Note: the Hatif's poem on pp. 87-88 ('hadahum bihi ba'd al-dalala') is the jinn-voice poem in the Umm Ma'bad report, not Hassan's, so it is not ingested under Hassan. Full npm test (run 2 Nov): only environment failures in the 3d tour / timeline tests (worktree lacks site/node_modules for the astro tsconfig; an ideas/iman source mismatch), none in poetry files.
- PR 26: new source `source/mufaddaliyyat-rahmaniyya-1926` (archive.org AAlexandrina-162009; Vision OCR on the drive), person `al-hadira`, and the poem `mufaddaliyyat-al-hadira-bakarat-sumayya` (6 bayts, pp. 9-10).
- PR 27: `mufaddaliyyat-mutammim-sarramat-zunayba` (2 bayts, p. 11).
- Test status (2 Nov 2026), checked at commit b531731d77 (before any poetry PR) and at origin/main: `scripts/tour.test.ts` and `scripts/time-browser-explorer.test.ts` fail without poetry. Five fail at b531731d77: `3d tour: exhibits.yaml > loadExhibits / viewExhibits select the page language`, `3d tour: lib > viewJourneys selects the page language`, `3d tour: lib > loadJourneys validates against the real file`, `3d tour: halls.yaml > loadHalls / viewHalls select the page language`, `timeline explorer curated stories and range dates > gives a range date its start year for the strip`; cause: `astro/tsconfigs/strict` cannot be resolved because this worktree has no `site/node_modules`. The sixth, `3d tour: halls.yaml > 8 halls x 6 stops...`, fails only on newer main: `ideas/iman sources match the record`, caused by commit 643b2ec0f5 (assabile-egypt lane) changing the iman concept's sources, not by poetry.
- PR 29 (Mutanabbi, Dar Beirut 1983): al-raay-qabla-shujaat (4, p. 414), sahiba-al-nas-qablana (5, p. 474), amin-izdiyarik (4, p. 125), wafaukuma-kal-rabi (3, p. 256) (16 passages, 4 works). Introductions on the odes' occasions follow the edition's headings and were read from the page image.
- PR 30 (Mutanabbi, Dar Beirut 1983): wa-min-nakad-al-dunya (8, p. 198), laka-ya-manazil (3, p. 177), alat-al-aysh (4, p. 405), wa-idha-kanat-al-nufus (4, p. 261), al-majd-lil-sayf (4, p. 495) (23 passages, 5 works).
- PR 31 (Mufaddaliyyat 1926): Alqama ibn Abada (5, p. 187) and Salama ibn Jandal (1, p. 46) with new person records (6 passages).
- PR 32 (Mutanabbi, Dar Beirut 1983): six odes, 25 passages: bad-rzaya-wa-ataya (4, p. 143), kull-aziz-lil-amir-dhalil (4, p. 355), arafatuka-wal-sufuf (5, p. 309), aqbal-al-yamin (4, p. 419), ma-sadakat-illa-bi-mawrud (4, p. 293), kathir-hayat-al-mar (4, p. 225).
- PR 33: new source `source/hamasa-abu-tammam-ed-1916` (archive.org AAlexandrina-206563; OCR in progress on the drive; 792 pages) and `hamasa-al-samawal-idha-al-mar-lam-yudannis` (5 bayts, pp. 26-27).
- PR 34 (Hamasa 1916): Qurayt ibn Unayf's opening poem (6 bayts, pp. 6-7) with new person record.
- PR 35 (Hamasa 1916): Ta'abbata Sharran (3, p. 17), Qays ibn al-Khatim (5, p. 49), Amr ibn Ma'dikarib (2, p. 45) (10 passages, 3 works).
- PR 36 (Hamasa 1916): Abu Kabir al-Hudhali (6, pp. 19-20; a seventh bayt skipped as unclear).
- PR 37 (Hamasa 1916): Jafar ibn Ulba al-Harithi (4, p. 11) with new person record. A fifth bayt of the opening was not read.
