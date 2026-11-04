# Canary — islam.museum release notes

The museum's public release notes: every change that lands on `main`, recorded in
reader's language in the same commit that makes the change. Newest release first.
The site build reads the version and date from the top block below and shows them
in the footer of every page and on the changelog page (`/{lang}/changelog/`).

Rules for every agent and contributor (`docs/engineering/15-release-notes-and-versioning.md`):
append your entry under the current version block, grouped by kind — Added, Changed,
Fixed, Removed, Performance, Tests, Data, Breaking, Rolled back. Write what changed
and why it matters, never a bare commit message. If your change bumps the version,
open a new block on top with the new version and today's date.

---

## v1.1.0 — 2026-11-03

### Data
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 128).
- **Library harvest paused**: the OCR'd-book harvest lane (`lib-ocr-harvest`) is stopped at the founder's request after 13 batches; its claim row is released, and every book's progress file lists what remains to mine. Two downloads (Tafsir al-Tabari, Shakir edition, and Adwa' al-Bayan with its Tatimma) are on the harvest drive but not yet OCR'd or harvested.
- **Library harvest from the OCR'd books** (batch 13): 239 records written or enriched with full Arabic, English and Urdu prose from 25 books on the harvest drive (ajaib-athar-jabarti, alam-zirikli, bayan-tabyin-jahiz, crafts, futuh-sham, hikam-ibn-ataillah, isti-ab, macaristanda-osmanli-mimarisi-rehberi, madarij-salikin, minhaj-sunna, mirat-zaman, muhalla…); new records: 76 person, 36 source, 34 building, 25 work, 17 concept, 15 question, 5 event, 4 object, 1 place; 68 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 127).
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 126).
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 125).
- **Library harvest from the OCR'd books** (batch 12): 168 records written or enriched with full Arabic, English and Urdu prose from 31 books on the harvest drive (amali-al-shajari, athar-baqiya-biruni, burhan-zarkashi, diwan-khutab-ibn-nubata, farq-bayn-firaq-baghdadi, fisal-ibn-hazm, ilal-ibn-abi-hatim, ilam-muwaqqiin, kashf-mahjub-hujwiri, khutab-ibn-uthaymin, khutab-muhammad-al-ghazali, madarij-salikin…); new records: 29 building, 29 person, 28 source, 17 work, 14 concept, 11 question, 2 event, 2 polity, 1 object; 64 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 124).
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 123).
- **Library harvest from the OCR'd books** (batch 11): 55 records written or enriched with full Arabic, English and Urdu prose from 9 books on the harvest drive (burhan-juwayni, fajr-islam, futuh-sham, hilyat-awliya, miftah-falah-ibn-ataillah, muqaddima-ibn-salah, mustasfa-ghazali, muwafaqat, nisa-sahabiyat-tabaqat); new records: 12 building, 10 source, 7 concept, 5 work, 3 person, 2 question, 1 event; 28 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 14 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 122).
- **Library harvest from the OCR'd books** (batch 10): 49 records written or enriched with full Arabic, English and Urdu prose from 7 books on the harvest drive (fadail-sahaba-ahmad, ibana-ibn-batta, jam-wasail-shamail, muhalla, sahih-ibn-hibban, sharh-usul-itiqad, tafsir-tabari); new records: 5 source, 4 question, 3 person, 2 concept, 2 work; 39 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 121).
- **Library harvest from the OCR'd books** (batch 9): 162 records written or enriched with full Arabic, English and Urdu prose from 23 books on the harvest drive (al-ibana-ashari, asbab-nuzul-wahidi, bidayat-mujtahid, hayawan-jahiz, hisba-ibn-taymiyya, india-art-and-culture-1300-1900, kitab-tawhid, luma-sarraj, minhaj-sunna, mirat-mafatih, mirat-zaman, muallam-tabarani…); new records: 39 person, 37 source, 20 concept, 16 question, 16 work, 10 object, 2 event, 1 group; 61 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 120).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 119).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 118).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 117).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 116).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 115).
- **Persons**: 15 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 114).
- **Fixed: two harvest records with repeated keys**: the records of al-Qastallani and Queen Arwa al-Sulayhi each carried a key twice after a merge (a second provenance run and a second periods line), which the build's YAML parser rejects; the repeats are removed.
- **Persons**: 16 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 113).
- **Library harvest from the OCR'd books** (batch 8): 82 records written or enriched with full Arabic, English and Urdu prose from 14 books on the harvest drive (adwa-bayan, ajaib-athar-jabarti, dhayl-tabaqat-hanabila, istidhkar, kitab-sunnah-abdullah-ahmad, kitab-tawhid-ibn-khuzayma, mustadrak-hakim, newcomb-tiles, sahabiyyat-mawsua, siyar-nisa, subh-asha, tafsir-tabari…); new records: 24 source, 12 person, 8 work, 6 question, 4 concept, 3 building, 1 event, 1 group, 1 place; 48 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 16 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 112).
- **Persons**: 16 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 111).
- **Persons**: 16 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 110).
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 109).
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 108).
- **Provenance merge repair**: combine al-Qastallani's two recorded run identifiers into one valid YAML field, preserving both the OCR-harvest and biography-publication attribution after their upstream merge.
- **Period merge repair**: keep Arwa al-Sulayhi's existing period once rather than twice, repairing an upstream duplicate YAML key without changing the recorded period.
- **Library harvest from the OCR'd books** (batch 7): 155 records written or enriched with full Arabic, English and Urdu prose from 19 books on the harvest drive (1978-pdf3176, brookes-gardens, deccani-paintings-1983, futuh-sham, irshad-fuhul, kitab-sunnah-ibn-abi-asim, kitab-sunnah-khallal, mostafa-mahmoud, nihayat-al-arab, nukhbat-fikar, rezavi, sawaiq-mursala…); new records: 37 source, 28 person, 27 work, 19 concept, 11 building, 9 question, 4 object, 3 event, 2 place, 2 practice, 1 group; 53 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 107).
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 106).
- **Library harvest from the OCR'd books** (batch 6): 83 records written or enriched with full Arabic, English and Urdu prose from 8 books on the harvest drive (1165pdf2229, asma-ul-husna-ibn-qayyim-jala, burhan-zarkashi, daraa-taarud, how-to-read-islamic-calligraphy-by-maryam-d-ekhtiar, mostafa-mahmoud, sunan-abi-dawud, tafsir-baghawi); new records: 21 source, 20 concept, 15 work, 10 question, 7 person, 5 building, 3 object, 1 practice; 23 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 105).
- **Library harvest from the OCR'd books** (batch 5): 176 records written or enriched with full Arabic, English and Urdu prose from 26 books on the harvest drive (artandarchitectureofislamiccairo, bga-vol06-ibn-khurdadhbih, bulac-mustatraf, khulafa-rashidun-salabi, kitab-kharaj, majmu-fatawa, majmu-nawawi, masalik-al-absar-umari, mostafa-mahmoud, muhammad-haykal, mujam-al-buldan-yaqut-1907, mujam-ma-istaajam-bakri-1876…); new records: 42 source, 35 work, 17 person, 12 concept, 10 question, 8 practice, 5 building, 3 object, 2 event, 2 place; 90 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 104).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 103).
- **Persons**: 18 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 102).
- **Library harvest from the OCR'd books** (batch 4): 79 records written or enriched with full Arabic, English and Urdu prose from 13 books on the harvest drive (artandarchitectureofislamiccairo, badai-sanai, bga-vol03, evliya-celebi-hammer-1834, hidaya-marghinani, kifaya-khatib, madarij-salikin, sharh-nawawi-muslim, subul-salam, tafsir-qurtubi, tafsir-saadi, zuhd-ahmad…); new records: 18 source, 12 concept, 12 person, 11 work, 3 question, 2 building, 1 practice; 38 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 101).
- **Fixed: dates and tour stops after the library harvest**: five records from the OCR'd-book harvest (the mosques of al-Hakim and Ibn Tulun, the Rawda Nilometer, al-Qata'i, Muhammad ibn Yusuf al-Warraq) wrote three-digit years that are not valid EDTF and broke the build; they are now four-digit years. Six 3D-tour stops (the conquests of Mecca and Constantinople, al-Khwarizmi, iman, al-Jabr, the Ihya') now list the same sources as their records, which gained sources in the harvest, so the tour test passes again.
- **Library harvest from the OCR'd books** (batch 3): 96 records written or enriched with full Arabic, English and Urdu prose from 10 books on the harvest drive (artandarchitectureofislamiccairo, ilam-muwaqqiin, irshad-sari, mizan-itidal, rihla-ibn-battuta-khayriyya-1904, safwat-safwa, sharh-usul-itiqad, silsila-sahiha, tafsir-ibn-atiyya, umm-shafii); new records: 18 concept, 12 person, 12 work, 11 source, 4 building, 4 question, 3 place, 1 event, 1 practice; 44 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 100).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 99).
- **Fixed: source records from the library harvest cite themselves**: 26 new edition records (al-Tamhid, Minhaj al-Sunna, al-Jabr, al-Battani, Islamic Cairo and others) carried a provenance layer without the self-citation the validator requires, which failed the site build; each now lists itself under `sources`, as every other edition record does.
- **Library harvest from the OCR'd books** (batch 2): 108 records written or enriched with full Arabic, English and Urdu prose from 11 books on the harvest drive (artandarchitectureofislamiccairo, fadail-sahaba-ahmad, ibana-ibn-batta, ihya-ulum-din, jami-ul-usul, mizan-itidal, mujam-al-buldan-yaqut-1907, radd-muhtar, sira-nabawiyya-salabi, tafsir-shawkani, tafsir-tantawi-wasit); new records: 18 concept, 15 source, 7 work, 6 person, 5 building, 4 question, 1 event, 1 practice; 61 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 98).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 97).
- **Library harvest from the OCR'd books** (batch 1): 72 records written or enriched with full Arabic, English and Urdu prose from 6 books on the harvest drive (artandarchitectureofislamiccairo, fadail-sahaba-ahmad, khwarizmi-algebra, minhaj-sunna, nallino-al-battini-opus-astronomicium-pars-1-3-1899, tamhid-ibn-abd-al-barr); new records: 16 person, 10 source, 9 work, 6 concept, 6 question, 1 building, 1 place; 34 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 96).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 95).
- **Harvest drive: missing books acquired**: 22 books the library plans named but the drive lacked (among them Sunan Abi Dawud with al-Khattabi's Ma'alim, Hilyat al-Awliya', al-Muhalla, al-Khallal's al-Sunna, Ibn Khuzayma's Kitab al-Tawhid, al-Ash'ari's al-Ibana, Nuzhat al-Nazar, Irshad al-Fuhul, Ibn Nubata's sermons, Ibn Uthaymin's sermons, al-Jahiz's al-Hayawan, Uyun al-Akhbar, Ibn Hawqal and Ibn Hayyan) were downloaded from open archive.org items with checksums, OCR'd on the founder's Mac and queued for harvest; six new titles are added to the library canon (`books.yaml`).
- **Harvest drive OCR complete**: the last four library scans without text (the 1916–1929 Cairo printings of the Hamasa of Abu Tammam, the Mufaddaliyyat, al-Zawzani's commentary on the Mu'allaqat and al-Barquqi's commentary on the diwan of Hassan ibn Thabit) were read with Apple Vision, so every one of the 1,401 library PDFs now has page text for mining; the OCR status record and the harvest ledger are updated, and a new `lib-ocr-harvest` lane is registered for the 198 OCR'd books that no record cited yet.
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 94).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 93).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 92).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 91).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 90).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 89).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 88).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 87).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 86).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 85).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 84).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 83).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 82).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 81).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 80).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 79).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 78).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 77).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 76).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 75).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 74).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 73).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 72).
- **Persons**: 4 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 71).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 70).
- **Persons**: 2 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 69).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 68).
- **Persons**: 4 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 67).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 66).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 65).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 64).
- **Persons**: 13 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 63).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 62).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 61).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 60).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 59).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 58).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 57).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 56).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 55).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 54).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 53).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 52).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 51).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 50).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 49).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 48).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 47).
- **Persons**: 9 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 46).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 45).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 44).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 43).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 42).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 41).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 40).
- **People**: 25 more biographies with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 39).
- **People**: 25 more biographies with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep).
- **25 new contemporary biographies**: preachers, teachers and Qur'an reciters followed by millions — from Pakistan, Indonesia, Bangladesh, Turkey, Egypt and France — each with full Arabic, English and Urdu pages and sources.

### Added
- **Another forty Timeline Explorer stories in preparation**: five places and thirty-five people selected from existing cited records, with explicit event curation and Arabic/English/Urdu subject metadata. Reserved shared-image defects are deferred to their owners rather than hidden by dropping events.
- **Forty Explorer stories implemented**: the final twenty person journeys complete the selection, with 185 chronological stops across 132 existing events. All 172 subject/event records pass citation checks; existing Urdu wording is preserved and missing subject translations supplied. No event facts, dates or relations changed.
- **Forty Explorer stories verified**: the full static build and all 120 Arabic/English/Urdu routes pass, including mobile kids imagery and details interactions. All 85 existing served image variants were screened; optional colour backgrounds and existing event-language fallbacks remain explicit. Concurrent harvest and biography work is preserved.
- **Explorer hand-off**: preserve the forty-story work and concurrent source enrichments in #3452, with validation/build snapshots and the final citation-only differences documented. Work stops after the founder-requested wind-down merge; no deployment or further batch is started.
- **Next forty Explorer stories shipped**: #3416 merges the forty person journeys after integrated validation, citation checks and all 318 tests pass; sixteen screened backdrops are already merged in #3414. Completion claims and lane records now name the actual merges. No production or UAT deployment was run.
- **Next forty Explorer journeys verified**: 270 chronological stops across existing cited events, with 120 Arabic/English/Urdu routes checked in the production build and browser. Sixteen new screened backdrops, merged separately in #3414, remove this batch's legacy illustration fallbacks; existing event-language gaps and reserved owner follow-ups remain explicit.
- **Next Timeline Explorer batch, final twenty person stories**: complete the forty-subject definitions and translated subject metadata. Owner-blocked Hamza and Usama proposals are deferred without changing their records or shared images; Abu Sa'id al-Khudri supplies the final slot.
- **Next Timeline Explorer batch, first twenty person stories**: prepare cited chronological journeys with Arabic, English and Urdu subject metadata, reusing existing events rather than inventing dates or links. The preceding forty-story batch is merged in #3400; the new batch retains explicit source-data and image-owner follow-ups.
- **Sixteen native Timeline Explorer backdrops**: eight new adult/kids pairs replace legacy record-illustration fallbacks with screened empty-place scenes. Existing shared images and record illustrations are preserved; these assets ship separately from the next forty stories.
- **Timeline Explorer verification**: the forty new stories pass the full local build and all 120 language-route browser checks; the authorized image correction is merged separately in #3398, resolving the earlier publication blocker. Existing event-language fallbacks and map-selector follow-ups are documented rather than claimed fixed.
- **Safer Timeline Explorer scenery**: ten new adult/kids backdrops override five legacy illustrated scenes, and five shared backdrops with figures are replaced by empty landscapes after explicit founder approval. All fifteen images were visually screened at full size; historical facts and site code are unchanged.
- **Developers page** (`/{lang}/developers/`, Arabic, English, Urdu): the museum's open data and API documented for libraries and builders — endpoints, the node/edge/record schema, worked examples with real responses, sample code, starter prompts for AI coding agents, and an honest list of what is not here yet.
- **Network page** (`/{lang}/network/`): the scholars, institutions and communities in conversation with the museum.
- **Canary release notes**: this file, the changelog page that renders it, and the site version now shown in the footer of every page — so any reader can watch the museum change and know exactly which version they are looking at.
- **A standing rule for every agent** (in the repo's `AGENTS.md`): anyone who changes anything in this repository records the change here in the same commit, then commits, opens a pull request and merges it — finished work is never left sitting locally.
- **Forty more Timeline Explorer stories**: follow twenty places and twenty people through 303 dated, cited stops drawn from existing museum records. Every new subject has Arabic, English and Urdu titles and summaries; individual event text retains the documented Arabic fallback where a translation is missing.

### Fixed
- **Shared Explorer image correction authorized**: five previously blocked backdrops now have screened, people-free replacements following explicit founder approval. The image batch ships separately from the forty new stories; historical dates, facts, relationships and UI code are unchanged.
- **Five Explorer fallback scenes**: ten new adult/kids landscape backdrops prevent five legacy record illustrations with figures from being selected at those stops. Every new image was inspected at full size; the legacy files and other owners' Explorer assets were left unchanged.

### Tests
- **Forty-story Explorer checkpoint**: all 120 built Arabic, English and Urdu routes have been checked in the browser, including desktop/mobile controls and the new Fadak kids backdrop. Local validation, citation checks, 318 tests and the complete site build pass; publication remains blocked by the five shared-image defects tracked in issue #3350.

### Data
- **Clearer subject metadata**: Urdu labels and summaries added to forty existing records, with recorded localization provenance. Missing provenance restored on seven places and one migration event without changing existing event dates or relationships.
- **Honest Explorer image status**: the forty-story batch remains unpublished pending replacement of five shared backdrops that contain figures. The owner request identifies each file and affected story; a prompt or an earlier screening claim is not treated as proof that an image is safe.

### Data
- **Two scholars' pages completed**: Fayz Kashani, the Safavid philosopher and traditionist, and Şeyhülislam Zekeriya Efendi now carry full sourced biographies in Arabic, English and Urdu — both were early draft cards that other pages already linked to.

---

## v1.0.2 — 2026-10-31

### Added
- **Disclaimer page** in all three editions, linked from the footer: what the museum is, how its content is gathered and checked, and the terms on which it is offered.
- **Raisely** added as a fifth voluntary support channel on the Support page.
- **Dataset archived on Zenodo** (27 Oct): the museum's CC0 dataset with a permanent DOI — 10.5281/zenodo.23692511 — so libraries and researchers can cite and keep it forever.

---

## v1.0.1 — 2026-10-17

### Added
- **Kids' wing** («جناح الصغار»): a Hudhud-guided children's wing — Word Garden, Prophet Quest, Kindness Quest, bedtime stories and a teacher's kit — in Arabic and English.

---

## v1.0.0 — 2026-10-11

### Added
- **Public launch of islam.museum**: an Arabic-first digital museum of Islamic history with an English edition, nine wings, and a sourced knowledge graph of people, places, buildings, objects, works, passages, concepts and events — published the same day the domain was registered.
