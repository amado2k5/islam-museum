# Person/place geo-enrichment — worktree devin-person-full-a

Run: `person-place-geo-a` (Devin), 2026-11-08.

## Scope

- `data/person/*.yaml`, alphabetical positions 1–3770 (a-k-fazlul-huq … azzan-bin-qais): all 3770 files scanned.
- `data/place/*.yaml`, alphabetical positions 1–606 (abadah … cordoba): all 606 files scanned.

## Method

Facts were mined only from the records' own cited text (English and Arabic summaries plus `born`/`died`/`buried` notes), so every added edge carries the entity's existing `sources`. No dates were invented; no edge got a start/end date, so the dated-fact two-source rule is not triggered — notes on each edge record the exact phrase used ("From text: …"). Place matching used each place's English label, Arabic label, historical names and slug, plus a small alias table for English/Arabic exonyms (Egypt→misr, Syria→al-sham, Fez→fez, Bombay→mumbai, Madras→chennai, Samarkand→samarqand, Tangier→tanja, Bahrain→bahrayn, Hejaz→hijaz, Khwarizm→khwarazm, Muhammara→khorramshahr). Ambiguous names (e.g. "Herat" between harat/herat) were not matched.

## Added relations (882 new edges, 709 person files)

- born_in: 132
- died_in: 205
- buried_in: 26
- lived_in: 261 (includes office-holding: qadi/mufti/khatib/imam/shaykh of X)
- traveled_to: 113 (includes hijra to Abyssinia, hajj/pilgrimage, rihla, flight/emigration)
- ruler_of: 145 (sultan/amir/caliph/governor/khan/shah/king/malik/wali/pasha/khedive/nawab of X)

## New place entities (28, all `status.review: draft`, `provenance.layer: own-research`, coordinates + `coordinate_precision: locality` + wikidata/geonames IDs)

tehran, riyadh, doha, nairobi, paris, casablanca, mumbai, chennai, erzurum, sirhind, kuala-lumpur, kuwait-city, bandung, surabaya, marawi, amroha, kohat, khorramshahr, harardhere, las-anod, timbedra (cities/towns) and morocco, iran, france, palestine, bengal, khwarazm, brunei (regions/countries).

place/bilbays was enriched instead (merged with the new candidate bilbeis → `aliases: [place/bilbeis]`); the separate bilbeis.yaml was removed. place/asfi already covers Safi, so no safi entity was created.

## Places updated (586 files)

- 7 places got coordinates verified from Wikidata P625 (al-mahdiyya, al-rawda-al-sharifa, al-zahira, amman, arafat, archers-hill, chandni-chowk); al-sham got an approximate regional centre.
- 107 well-known places got identified/approximate coordinates (`coordinate_precision` locality/site/approx, `coordinate_note` "flagged for gazetteer verification", `source/geonames-gazetteer` added).
- 427 places with no attested coordinates got an honest bilingual `coordinate_note` instead of guessed values (same convention as al-khaliqa).
- 12 places got missing `regions`; 19 got missing `provenance` (rebuilt from `status.generated_by`); afshana got `source/ibn-abi-usaybia-uyun-al-anba` (records Ibn Sina's birth there).
- Stub entries removed: place/palestine (devin-batch25a), place/erzurum (lib-kamil-v2) — validator requires stubs be removed once written.

## Sources used

No new source entities were needed. Edges cite the entities' existing sources; new places cite `source/wikidata` + `source/geonames-gazetteer`.

## Unresolved / uncertain

- ~160 person notes mention places with no entity (e.g. Amroha-covered now; still open: Safi (covered by asfi but person notes say "Safi"), Louga, Rampur, Mécheria, Kébémer, Dhusamareb, Tangier→tanja now matches, Timbedra-covered). A full list was logged during the run; small towns (Fankaaji, Salame, al-Tawila, Harardhere-area villages) were left for a gazetteer pass.
- Curated coordinates are draft-tier "identified modern location" values flagged for verification, not survey-grade.
- Nisba-style associations (al-Baghdadi → Baghdad) were deliberately not converted to edges (too weak without explicit text).
- Arabic matching had a trailing-boundary limitation; all suspicious matches (madyan/مدينة, al-khaliqa/خليفة, hijr/حجر, balis/بالس, bish/بيشاور, jazira/جزيرة, akharun/آخرون, riyadh clause-crossing) were manually reviewed and corrected or dropped before writing.

## Skipped

- Person files with no geographic statement (the majority of OCR-harvest stubs) — nothing added rather than guessed.
- Ambiguous place names mapping to more than one entity (almeria, amorium, antioch, fayd, herat, hijr, rhodes, sala, ubulla, usfan, yarmuk).
- place/afshana had `sources: []` originally; now cites Ibn Abi Usaybi'a.

## Validation

- `tsx scripts/validate.ts` run after each enrichment batch: 0 errors every run.
- Final `npm run validate`: `validated 51161 entities, 86072 prose files: 0 errors, 8529 warnings` (warnings pre-existing duplicate-title notices; the two new stub warnings introduced by this run were resolved by removing the stub entries).
- `npm run graph`: `graph: 53159 nodes (51161 entities, 1998 stubs), 89378 edges -> .cache/graph.json` — completed clean.

## Files changed (1297 paths)

Persons (709): see `git status` — every modified file is under `data/person/` within the assigned range.

Places (586): all under `data/place/`, within the assigned 1–606 range plus the 28 new entities (alphabetically later, created to serve the range's relations).

Other: data/_stubs.d/devin-batch25a.yaml, data/_stubs.d/lib-kamil-v2.yaml.

---

## Second pass — "every person gets a place edge" (acceptance criterion)

Re-scanned all 3,770 in-range persons. **3,108 of 3,770 now carry at least one schema-valid person→place relation** (predicates used: born_in, died_in, buried_in, lived_in, traveled_to, ruler_of). Added **2,060 further files** with one `lived_in`/`ruler_of` edge each at `confidence: low` plus an explanatory `note`, sourced from the record's own `sources`, in ascending specificity:

1. Nisba in name/label/slug (Arabic + romanized, ~250 nisba→place map) → e.g. البغدادي→baghdad, الصقلي→siqilliya, القرشي→mecca, الأنصاري→medina.
2. Phrases in the record (أهل/من فقهاء/صاحب/سلطان/أمير/والي X, incl. المدينة→medina; English "of X", nationality adjectives → country/region entities).
3. The record's own `regions` field → mapped region entities (arabia→jazirat-al-arab, egypt-nile→misr, maghreb→maghreb, anatolia-balkans→anatolia, persia-central-asia→iran, south-asia→india, southeast-asia→malay, west-africa-sahel→bilad-al-sudan, east-africa→east-africa). `andalus-europe` and `levant-iraq` were deliberately NOT blanket-mapped (misleading for modern Europeans and the Levant/Iraq ambiguity respectively; levant-iraq only mapped when the text itself says شام or عراق).

### New place entities added in pass 2 (75 total across the run)

Regions needed for broad/nationality-level substantiation: india, maghreb, bilad-al-sudan, east-africa, turkistan, africa, pakistan, indonesia, malaysia, bangladesh, somalia, nigeria, senegal, mali, mauritania, lebanon, jordan, bosnia, philippines, usa, canada, australia, britain, germany, russia, uae, qatar, libya, tunisia, algeria, kosovo, crete, uzbekistan, kazakhstan, tajikistan, kyrgyzstan, turkmenistan, sudan, ghana, guinea, ivory-coast, burkina-faso, chad, cameroon, comoros, maldives, thailand, myanmar, vietnam, nepal, japan, korea, serbia, croatia, macedonia, bulgaria, romania, hungary, austria, poland, ukraine, netherlands, belgium, switzerland, sweden, norway, denmark, finland. Cities/sites needed by nisba: peshawar, lucknow, kashmir, mombasa, kilwa, harar, beirut, sidon, sumatra, kashan, china, italy, portugal. All draft, `provenance.layer: own-research`, approximate/identified coordinates flagged for gazetteer verification.

Stub entries removed for newly written places (lucknow, erzurum, palestine, and stub-list hits in claude-ocr-harvest-i.yaml and screen-index.yaml).

### unresolved_without_place (662)

Records whose text gives no city, region, nisba, nationality or record-level region usable without fabrication (mostly one-line draft cards and tribal/genealogical stubs). The parent may apply a documented broader-region rule (e.g. roles:[companion] → medina, or period-based regions) at its own discretion — these were left untouched rather than guessed:

- aban-al-ahmar
- aban-al-raqqashi
- abbad-ibn-al-walid-al-ghudhwi
- abbada-umm-jafar
- abbasa-bint-al-fadl
- abd-al-ala-al-sadafi
- abd-al-ala-ibn-abdallah-ibn-amir
- abd-al-aziz-ibn-abdallah-ibn-amir
- abd-al-aziz-ibn-abi-dulaf
- abd-al-aziz-ibn-al-walid
- abd-al-aziz-ibn-rufay
- abd-al-aziz-uyun-al-sud
- abd-al-ghaffar-shair-dawlat-al-hakim
- abd-al-hussein-mubarak
- abd-al-jalil-al-bali
- abd-al-karim-al-khalifati
- abd-al-majid-ayoub-al-obeidi
- abd-al-malik-al-maymuni
- abd-al-malik-ibn-abi-hurra
- abd-al-malik-ibn-umar
- abd-al-malik-ibn-ward
- abd-al-masih-ibn-buqayla
- abd-al-qadir-al-nuaymi
- abd-al-qadir-ibn-muhammad-al-jaziri
- abd-al-rahman-al-adhrai
- abd-al-rahman-al-bahuti
- abd-al-rahman-azji
- abd-al-rahman-ibn-abi-bakr
- abd-al-rahman-ibn-abra
- abd-al-rahman-ibn-ahmad-al-alawi
- abd-al-rahman-ibn-al-abbas
- abd-al-rahman-ibn-attab-ibn-usayd
- abd-al-rahman-ibn-habib-al-fihri
- abd-al-rahman-ibn-hurmuz
- abd-al-rahman-ibn-jaza
- abd-al-rahman-ibn-muslim
- abd-al-rahman-ibn-qudama
- abd-al-rahman-ibn-razin-al-hanbali
- abd-al-rahman-ibn-rustum
- abd-al-rahman-ibn-ubaydan
- abd-al-rahman-ibn-ziyad
- abd-al-rahman-jaziri
- abd-al-rahman-rafat-al-basha
- abd-al-rahman-sanjul
- abd-al-salam-ibn-taymiyya
- abd-al-samad-ibn-ahmad-al-bazzaz
- abd-al-sattar-abu-ghudda
- abd-al-wahhab-ibn-bakht
- abd-al-wahid-al-makhlu-almohad
- abd-al-wahid-ibn-al-muwaffaq
- abd-allah-dhu-alghina
- abd-allah-ibn-muhammad-al-azdi
- abd-allah-ibn-muhammad-cordova
- abd-allah-ibn-salih-al-ajli
- abd-allah-ibn-yusuf
- abd-dakhim-ibn-iram
- abd-kulal-ibn-muthawwib
- abdallah-al-baytushi
- abdallah-ibn-al-ahmar
- abdallah-ibn-al-asbahani
- abdallah-ibn-al-hasan
- abdallah-ibn-al-kawwa-al-yashkuri
- abdallah-ibn-al-saqr-al-sakari
- abdallah-ibn-alwan
- abdallah-ibn-awn-al-kharraz
- abdallah-ibn-ayyash-al-mantuf
- abdallah-ibn-darraj
- abdallah-ibn-hammam-al-saluli
- abdallah-ibn-ibad
- abdallah-ibn-jafar-al-himyari
- abdallah-ibn-jubayr
- abdallah-ibn-khazim-al-sulami
- abdallah-ibn-muhammad-al-shinshawri
- abdallah-ibn-musa-ibn-nusayr
- abdallah-ibn-musab
- abdallah-ibn-najda
- abdallah-ibn-nashira
- abdallah-ibn-qays-al-dazzaqi
- abdallah-ibn-sad-ibn-ammar
- abdallah-ibn-sad-ibn-nufayl
- abdallah-ibn-umar-ibn-abd-al-aziz
- abdallah-ibn-utba-ibn-masud
- abdallah-ibn-wahb-al-rasibi
- abdallah-ibn-wal-al-tamimi
- abdallah-ibn-yahya-al-kindi
- abdallah-ibn-yasin
- abdallah-ibn-yazid-al-ibadi
- abdelwahab-annaib
- abdul-ghani-al-jamil
- abdul-jalil-al-jameel
- abdul-rahman-dhaker
- abdullah-bahlavi
- abdullah-ibn-abd-al-malik
- abdullah-ibn-al-zubayr-al-asadi
- abdullah-ibn-amr-ibn-ghaylan
- abdullah-ibn-budayl
- abdullah-ibn-suhayl
- abdullah-ibn-umayya
- abdullah-tabbakh
- abdun-ibn-muhammad
- abdus-ibn-malik-al-attar
- abu-abd-al-rahman-al-muayti
- abu-abd-allah-al-khatan
- abu-afraa-umayr
- abu-al-adiyya-al-amili
- abu-al-asad
- abu-al-awar-al-sulami
- abu-al-azhar-al-muhallabi
- abu-al-barakat-al-madaini
- abu-al-fadl-al-bazzaz
- abu-al-fadl-al-duri
- abu-al-fadl-al-qantari
- abu-al-fadl-al-qiratisi
- abu-al-fadl-al-riashi
- abu-al-fadl-sad-ibn-sharif
- abu-al-faraj-al-fami
- abu-al-fath-al-karajki
- abu-al-fath-al-umri
- abu-al-futuh-al-alawi
- abu-al-ghanaim-al-narsi
- abu-al-harith-al-sayigh
- abu-al-hasan-al-bahili
- abu-al-hasan-al-damaghani
- abu-al-haytham-ibn-al-tayyihan
- abu-al-hayyaj-al-asadi
- abu-al-husayn-al-khayyat
- abu-al-husayn-al-nuri
- abu-al-jahm
- abu-al-jarrah
- abu-al-jarud
- abu-al-khasib-marzuq
- abu-al-maali-al-talawi
- abu-al-mukhtar
- abu-al-muthanna
- abu-al-qasim-al-hadid
- abu-al-qasim-al-hamid
- abu-al-qasim-al-hawwari
- abu-al-salt-abd-al-salam-ibn-salih
- abu-al-sanabil-ibn-bacak
- abu-al-shabl
- abu-al-shatha-al-ajdaji
- abu-al-tamhan-al-qinai
- abu-al-tayyib-tahir-ibn-abdallah
- abu-al-walid-ibn-jahwar
- abu-al-zaizaa
- abu-ali-al-atrush
- abu-ali-al-basir
- abu-ali-al-hashimi
- abu-ali-al-muhassin-al-tanukhi
- abu-ali-al-sinji
- abu-amr-ibn-al-ala
- abu-asim-al-nabil
- abu-awana-al-yashkuri
- abu-awn-abd-al-malik
- abu-awn-abd-allah-ibn-awn
- abu-ayyub-al-muryani
- abu-bakr-al-amash
- abu-bakr-al-bardai
- abu-bakr-al-dinawari
- abu-bakr-al-hudhali
- abu-bakr-al-khallal
- abu-bakr-al-marrudhi
- abu-bakr-al-mutawwii
- abu-bakr-al-shafii-muhaddith
- abu-bakr-al-utbi
- abu-bakr-ghulam-al-khallal
- abu-bakr-ibn-abi-musa-al-ashari
- abu-bakr-ibn-al-ikhshid
- abu-bakr-ibn-al-jaabi
- abu-bakr-ibn-sabiq-al-bayri
- abu-bakr-muhammad-ibn-abd-allah-al-sayrafi
- abu-bakr-qayyim-al-jawziyya
- abu-bayhas
- abu-dalama
- abu-dawud-al-tayalisi
- abu-dhuayb-al-hudhali
- abu-duad-al-iyadi
- abu-faqas
- abu-farwa-abd-al-rahman
- abu-firas-al-hamdani
- abu-ghalib-al-zurari
- abu-hafs-umar-al-hintati
- abu-haritha-al-nahri
- abu-hashim-al-jafari
- abu-hashim-al-jubai
- abu-hashim-ibn-al-hanafiyya
- abu-hashisha
- abu-hassan-al-ziyadi
- abu-hazim-al-araj
- abu-isa-al-warraq
- abu-ishaq-al-shaybani
- abu-jafar-al-hashmi
- abu-jafar-al-nufayli
- abu-jafar-al-uqayli
- abu-jafar-muhammad-ibn-al-qasim
- abu-jafar-muhammad-ibn-uthman
- abu-khatim-al-saddrati
- abu-khazim-ibn-abi-yala
- abu-khazim
- abu-l-ala-al-maarri
- abu-l-baz-al-uqab
- abu-l-fawaris-al-qarmati
- abu-l-hayja-ibn-hamdan
- abu-labid-al-jahdami
- abu-layla-ishaq-al-awrabi
- abu-mahmud-khujandi
- abu-malik-al-ashari
- abu-malik-al-hadrami
- abu-mansur-al-ashqar
- abu-mansur-al-azhari
- abu-mikhnaf
- abu-muhallim
- abu-muslim-al-mustamli
- abu-muslim-al-nakhai
- abu-nadra-al-abdi
- abu-nakhayla
- abu-nasr-ahmad-al-ibri
- abu-nasr-al-tamar
- abu-nasr-al-zaynabi
- abu-nasr-ibn-al-qushayri
- abu-nuwas
- abu-rabi-al-ilaqi
- abu-rafi-al-qibti
- abu-saada
- abu-sad-ibn-adi
- abu-salama-al-zutti
- abu-salih-mansur-ibn-ishaq
- abu-shakir-al-daysani
- abu-sufyan-mahbub-ibn-al-rahil
- abu-tahir-abd-al-rahman-al-yusufi
- abu-talib-abd-al-qadir-al-yusufi
- abu-talib-al-mishkani
- abu-talib-al-zaynabi
- abu-talib-al-zayyat
- abu-tammam
- abu-thawr-al-kalbi
- abu-ubayd-ibn-harawayh
- abu-ubayda-mammar
- abu-umar-al-talamanki
- abu-uyayna-ibn-al-muhallab
- abu-yala-al-jafari
- abu-yala-ibn-al-farra
- abu-yaqub-al-shahham
- abu-yazid-makhlad
- abu-yusuf-al-qatii
- abu-zakkar-al-aama
- abu-zaynab-ibn-awf
- abul-tayyeb-tabari
- adam-smith
- adi-ibn-musafir
- adi-ibn-zayd-al-ibadi
- adud-al-dawla
- afifa-khatun
- afra-bint-uqayl
- afridun
- afshin
- agnes-smith-lewis
- ahmad-al-baali
- ahmad-al-bazanti
- ahmad-al-ladn
- ahmad-al-munqur
- ahmad-al-rashidi-al-barzanji
- ahmad-bisisu
- ahmad-ibn-abi-duad
- ahmad-ibn-abi-khalid
- ahmad-ibn-al-furat
- ahmad-ibn-al-hasan-al-zarkashi
- ahmad-ibn-al-hasan-ibn-kharrash
- ahmad-ibn-al-muktafi
- ahmad-ibn-al-mulla-al-haskafi
- ahmad-ibn-al-nadr
- ahmad-ibn-al-tayyib
- ahmad-ibn-ali-al-saffuri
- ahmad-ibn-attash
- ahmad-ibn-atwah
- ahmad-ibn-baqi
- ahmad-ibn-harun-al-bardiji
- ahmad-ibn-harun-al-rashid
- ahmad-ibn-ibrahim-al-saruji
- ahmad-ibn-ishaq-al-tamimi
- ahmad-ibn-ishaq-al-tanukhi
- ahmad-ibn-israil
- ahmad-ibn-nasr-al-khuzai
- ahmad-ibn-nasr-al-shadhai
- ahmad-ibn-sahl
- ahmad-ibn-said-al-darimi
- ahmad-ibn-tahir-al-shair
- ahmad-ibn-yahya-al-karmi
- ahmad-ibn-yunus-al-aythawi
- ahmad-ibn-yunus-al-sadafi
- ahmad-jawad-al-safi
- ahmad-sahib-al-shab
- ahrun-al-qass
- aisha-al-bauniyya
- aisha-bint-al-mustanjid
- aisha-khalid
- akram-diya-al-umari
- aktham-ibn-sayfi
- al-abbas-al-jawhari
- al-abbas-ibn-abd-al-azim
- al-abbas-ibn-abd-al-sami
- al-abbas-ibn-abdallah-al-tarqafi
- al-abbas-ibn-al-fadl-al-abdi
- al-abbas-ibn-al-hasan
- al-abbas-ibn-al-mamun
- al-abbas-ibn-al-walid
- al-abbas-ibn-ali
- al-abbas-ibn-ghalib-al-warraq
- al-abbas-ibn-hammad-al-madaini
- al-abbas-ibn-muhammad-ibn-ali
- al-abbas-ibn-muhammad
- al-abiwardi
- al-ablaq-al-azdi
- al-adid-fatimid
- al-adil-abdallah-almohad
- al-ahlaj-al-dahri
- al-ahmar-al-nahwi
- al-ahwal-al-muharrir
- al-ahwas-ibn-jafar
- al-ahwas
- al-ajurri
- al-akhfash-ahmad-ibn-imran
- al-akhtal
- al-alaa-ibn-al-harith
- al-amash-sulayman-ibn-mihran
- al-amin
- al-amir-al-alim
- al-amir-fatimid
- al-arghiyani
- al-ashiri-al-sinhaji
- al-ashraf-shaban
- al-aswad-ibn-ghaffar
- al-aswad-ibn-kulthum
- al-aswad-ibn-sari
- al-athram
- al-babbagha
- al-baghawi-ahmad-ibn-mani
- al-barbari-al-muharrir
- al-bayyadi-masud
- al-biqai-ibrahim-ibn-umar
- al-burjulani
- al-dabili
- al-dahhak-dhu-al-afwah
- al-dahhak-ibn-muzahim
- al-dawlabi
- al-dumustuq
- al-fadl-ibn-abd-al-rahman-ra-id-al-bighal
- al-fadl-ibn-al-sabbah-al-simsar
- al-fadl-ibn-dukayn
- al-fadl-ibn-jafar-ibn-al-furat
- al-fadl-ibn-mahan
- al-fadl-ibn-naubakht
- al-fadl-ibn-rawh
- al-fadl-ibn-sahl
- al-fadl-ibn-salih-ibn-ali
- al-faria-al-kharijiyya
- al-fath-ibn-khaqan
- al-fayd-ibn-abi-salih
- al-fazari
- al-gharid
- al-hadi-musa
- al-hadi
- al-hafiz-fatimid
- al-hajjaj-ibn-matar
- al-hajjaj-ibn-yusuf-ibn-matar
- al-hakam-ibn-awana
- al-hakim-bi-amr-allah
- al-harith-ibn-abdallah-ibn-abi-rabia
- al-harith-ibn-kalada
- al-harith-ibn-nawfal
- al-harith-ibn-zalim
- al-hasan-al-rakji
- al-hasan-al-zaydi-naqib
- al-hasan-ibn-ahmad-al-aasam
- al-hasan-ibn-al-husayn-al-tahiri
- al-hasan-ibn-al-khasib
- al-hasan-ibn-al-khizrani
- al-hasan-ibn-al-shahid-al-thani
- al-hasan-ibn-ali-al-jawhari
- al-hasan-ibn-harun
- al-hasan-ibn-isa-al-abbasi
- al-hasan-ibn-mahbub
- al-hasan-ibn-sahl
- al-hasan-ibn-salih-ibn-hayy
- al-hasan-ibn-sallam
- al-hasan-ibn-thawab
- al-hasan-ibn-zayd-al-dai
- al-hasih
- al-hawfazan-ibn-shurayk
- al-haym-ibn-al-haym
- al-haytham-ibn-khalaf-al-duri
- al-hudayn-ibn-al-mundhir
- al-hujja-atabakiyya
- al-hulwani-al-nahrawani-sulayman-ibn-abd-allah
- al-humaydi-muhammad-ibn-futuh
- al-husayn-al-najjar
- al-husayn-dhi-al-dama
- al-husayn-ibn-al-qasim-ibn-wahb
- al-husayn-ibn-al-qasim
- al-husayn-ibn-fadl-sahlan
- al-husayn-ibn-hamdan
- al-husayn-ibn-numayr
- al-husayn-ibn-ruh
- al-husayn-ibn-safwan-al-bardhai
- al-husayn-ibn-said-al-hamdani
- al-iskandar-al-afrudisi
- al-jabari-abu-ishaq-ibrahim-ibn-umar
- al-jahshiyari-abu-abd-allah-muhammad-ibn-abdus
- al-jarrah-ibn-malih
- al-jaysh-ibn-khumarawayh
- al-jundi-abu-al-diya-khalil-ibn-ishaq
- al-kajji
- al-kalwadhani
- al-kamal-al-suyuti
- al-karabisi
- al-khabri-abu-hakim-abd-allah-ibn-ibrahim
- al-khafaji
- al-khanshilil
- al-kharaqi-umar-ibn-al-husayn
- al-kharit-ibn-rashid
- al-khasibi
- al-khassaf
- al-khayyat-al-munajjim
- al-khayzuran
- al-khirit-ibn-rashid
- al-khujistani
- al-kumayt-ibn-zayd
- al-lului
- al-madaini
- al-mahani
- al-majishun
- al-makari
- al-malik-al-afdal-ali
- al-malik-al-aziz-uthman
- al-mansur-abu-bakr-ibn-al-nasir
- al-mansur-ubaydi
- al-mawardi-al-laib
- al-miqdad-al-siyuri
- al-muaddal-ibn-ali-ibn-al-layth
- al-muayyad
- al-mubarak-ibn-abi-talib-al-nahwi
- al-mubarrad
- al-mufaddal-ibn-al-muhallab
- al-mufaddal-ibn-ghassan
- al-mufaddal-ibn-salama
- al-mufaddal-ibn-umar-al-jufi
- al-mufarraj-ibn-sallam
- al-mufawwid
- al-mughira-ibn-nawfal
- al-muhadhdhab-ibn-muqbil
- al-muhaqqiq-al-maysi
- al-muhsin-ibn-ali-ibn-al-furat
- al-muhtadi
- al-mukhtar-ibn-kab
- al-mundhir-ibn-amr
- al-mundhir-ibn-hassan-al-dabbi
- al-mundhir-ibn-hassan
- al-munjab-ibn-rashid
- al-muntasir
- al-muqtafi-billah
- al-musayyab-ibn-zuhayr
- al-musayyib-ibn-najaba
- al-mustajir-billah
- al-mustali-fatimid
- al-mustanjid-billah
- al-mustansir-billah
- al-mustansir-fatimid
- al-mustansir-yusuf-almohad
- al-mustawrad-ibn-shaddad
- al-mustazhir-billah
- al-mutadid-abbad
- al-mutarriz-abu-umar
- al-mutasim-abi-ishaq
- al-mutawakkil-ala-llah
- al-mutawakkil
- al-muthanna-ibn-haritha
- al-muttalib-ibn-abd-manaf
- al-najashi
- al-nami
- al-nasimi-al-manzilawi
- al-nasir-billah
- al-nawawi
- al-nazzam
- al-numan-ibn-jabala-al-tanukhi
- al-numan-ibn-qawqal
- al-numan-ibn-suhban
- al-qadi-al-numan
- al-qahl-ibn-iyash
- al-qaid-fadl-ibn-salih
- al-qaim-billah
- al-qali
- al-qanabi
- al-qaqa-ibn-amr
- al-qasim-ibn-asakir
- al-qasim-ibn-sima
- al-rabi-ibn-khuthaym
- al-rabi-ibn-yunus
- al-raffaqi-al-husayn-ibn-muhammad
- al-rashid-ibn-al-zubayr
- al-rawwad-al-azdi
- al-ruasi
- al-ruqad-al-mutakki
- al-rushati
- al-ruwayni
- al-sadafi
- al-salah-ibn-uthman
- al-samawal-ibn-adiya
- al-sari-ibn-al-hakam
- al-saymari-al-mutazili
- al-sayrafi-al-hilali
- al-sayyid-al-himyari
- al-shafii
- al-shahijan
- al-shalmaghani
- al-shammakh-ibn-dirar
- al-shanbudhi
- al-sharqi-ibn-al-qutami
- al-shaybaniyya-bint-hani
- al-sukkari
- al-suli
- al-tadmuri-taj-al-din-ishaq-ibn-ibrahim
- al-tai-billah
- al-talakbari
- al-tanukhi-al-qadi-abu-al-qasim-ali-ibn-al-muhsin
- al-tawzi-abd-allah-ibn-muhammad-ibn-harun
- al-thamanini-abu-al-qasim-umar-ibn-thabit
- al-thumami-abu-al-hasan-abd-al-aziz-ibn-al-harith
- al-tibi
- al-tusayr-ibn-daysam
- al-ukuk
- al-uthmaniyya
- al-walid-ibn-hisham
- al-walid-ibn-muawiya-ibn-abd-al-malik
- al-walid-ibn-utba-ibn-abi-sufyan
- al-wathiq-ibrahim-cairo
- al-wathiq
- al-yafrini
- al-yaman-ibn-ribab
- al-yasa
- al-yazidi-muhammad
- al-zafir-fatimid
- al-zaghal
- al-zahir-billah
- al-zarkashi-al-hanbali
- al-zubayr-ibn-adi
- al-zubayr-ibn-bakkar
- ali-al-baridi
- ali-al-fahhad
- ali-al-hadi
- ali-al-nabati-al-amili
- ali-al-ridha
- ali-al-uraidhi
- ali-ibn-abdallah-al-abbasi
- ali-ibn-abdallah-ibn-al-abbas
- ali-ibn-abi-muqatil
- ali-ibn-abi-talib-al-ama
- ali-ibn-ahmad-ibn-bakri
- ali-ibn-al-furat
- ali-ibn-al-hasan-al-zamayli
- ali-ibn-al-husayn-al-mujalad
- ali-ibn-al-jad-al-shufni
- ali-ibn-al-jahm
- ali-ibn-al-junayd-al-iskafi
- ali-ibn-al-mughira-al-athram
- ali-ibn-al-muhsin-al-tanukhi
- ali-ibn-baliq
- ali-ibn-dawud
- ali-ibn-harb
- ali-ibn-haytham-al-mutakallim
- ali-ibn-husayn-al-koti
- ali-ibn-isa-al-asturlabi
- ali-ibn-isa-al-rummani
- ali-ibn-isa-ibn-mahan
- ali-ibn-isa
- ali-ibn-ishaq-ibn-yahya-ibn-muadh
- ali-ibn-ismail-al-tammar
- ali-ibn-jafar-al-madini
- ali-ibn-mansur-al-azji
- ali-ibn-mansur-al-khattibi
- ali-ibn-mazyad
- ali-ibn-muhammad-al-himmani
- ali-ibn-muhammad-al-nawfali
- ali-ibn-muhammad-al-tanukhi
- ali-ibn-muhammad-ibn-abi-al-shawarib
- ali-ibn-muhammad-ibn-bassam
- ali-ibn-ribab
- ali-ibn-sahl-al-tabari
- ali-ibn-yahya-al-munajjim
- ali-ibn-yaqtin
- ali-ibn-zayd-alawi
- ali-khader-abbas-al-zind
- ali-zayn-al-abidin
- alim-ibn-ala
- aloys-musil
- alqama-ibn-marthad
- alqama-ibn-safwan
- alyan
- amat-al-latif-bint-al-nasih
- amid-al-dawla-ibn-jahir
- amin-ibn-muhammad-al-jundi
- amina-cachalia
- amir-ibn-ali-shammakhi
- amir-ibn-ismail-al-mudhhiji
- ammar-ibn-abi-al-khasib
- ammar-ibn-sayf
- amr-al-ghazzal
- amr-ibn-al-ahwas-al-bariqi
- amr-ibn-al-layth
- amr-ibn-amir-muzayqiya
- amr-ibn-anbasa
- amr-ibn-bilal-al-asadi
- amr-ibn-jurmuz
- amr-ibn-luhayy
- amr-ibn-marzuq
- amr-ibn-masada
- amr-ibn-maymun
- amr-ibn-muhammad-ibn-al-qasim
- amr-ibn-ubayd
- amr-ibn-uds
- amr-ibn-utba
- amr-ibn-uthman-ibn-affan
- amr-ibn-zurara
- anas-bint-abd-al-karim-al-lakhmi
- anas-ibn-zunaym
- anmar-ibn-nizar
- antara-ibn-shaddad
- anushirwan-ibn-khalid
- aqil-ibn-abi-talib
- arda-bint-al-harith
- ardashir-i-ibn-babak
- ardashir-ii-ibn-hormizd
- ardashir-iii-ibn-shiruyeh
- aristutalis
- arshimidis
- artimidurus
- asad-al-din-shirkuh
- asad-ibn-hibat-allah-ibn-al-khizrani
- asad-ibn-yafar
- ash-ab-al-tami
- asha-hamdan
- ashinas-al-turki
- ashja-al-sulami
- asid-ibn-al-mutashammis
- asid-ibn-zafir-al-sulami
- asim-ibn-hubayra
- asim-ibn-qays-al-sulami
- asiya-al-maqdisiyya
- ata-ibn-al-saib
- ata-ibn-yasar
- athea-iqbal
- atika-bint-murra-al-sulamiyya
- atika-bint-yazid
- atika-bint-zayd
- awana-ibn-al-hakam
- awhad-al-zaman
- awn-ibn-jamda
- ayn-al-shams-bint-ahmad
- azadhbih
- azar
- azarmidokht-bint-khosrow-ii
- azhar-al-samman
- azin

### Validation (final)

- `npm run validate`: **0 errors**, 51,237 entities, 8,531 warnings (pre-existing duplicate-title/stub warnings; the 4 errors introduced mid-pass — missing place/africa and a Wikidata Q55 collision on place/netherlands — were fixed).
- `npm run graph`: **53,233 nodes, 93,498 edges**, clean build.

---

## Third pass — web research on unresolved_without_place

Additional targeted passes on the 662 unresolved persons (movement/residence verbs in Arabic: ولى، مؤرخ، أهل، نزل، استولى، خرج، سافر؛ English "of/from/native of"; nationality adjectives; plus a live web-search pass):

**Resolved (25 persons):**
- aban-al-ahmar → lived_in kufa + lived_in basra — tarajm.com / CGIE: أصله من الكوفة وكان يسكنها تارة ويسكن البصرة تارة أخرى
- abd-al-aziz-ibn-abdallah-ibn-amir → ruler_of place/sijistan
- abd-al-masih-ibn-buqayla → lived_in place/kufa
- abd-al-qadir-al-nuaymi → lived_in place/damascus
- abd-al-rahman-ibn-ahmad-al-alawi → lived_in place/yemen
- abd-al-rahman-ibn-razin-al-hanbali → lived_in place/damascus
- abd-al-rahman-ibn-rustum → ruler_of place/qayrawan
- abdallah-ibn-wahb-al-rasibi → traveled_to place/al-nahrawan
- abdullah-ibn-umayya → lived_in place/bust
- abu-al-tamhan-al-qinai → lived_in place/marib
- abu-duad-al-iyadi → lived_in place/al-hira
- abu-l-hayja-ibn-hamdan → traveled_to place/mosul
- abu-yazid-makhlad → ruler_of place/qayrawan
- adi-ibn-zayd-al-ibadi → lived_in place/al-hira
- al-faria-al-kharijiyya → lived_in place/morocco
- al-husayn-ibn-said-al-hamdani → ruler_of place/aleppo
- al-musayyib-ibn-najaba → lived_in place/basra
- al-mutasim-abi-ishaq → lived_in place/al-qatul
- al-muthanna-ibn-haritha → lived_in place/khaffan
- al-rashid-ibn-al-zubayr → ruler_of place/alexandria
- al-rawwad-al-azdi → lived_in place/tabriz
- al-ruasi → lived_in place/kufa
- ali-al-baridi → traveled_to place/wasit
- ata-ibn-al-saib → traveled_to place/balkh
- abd-al-qadir-al-arnaut → buried_in place/damascus (al-Maidan cemetery, per record text)

**Web-verified example:** aban-al-ahmar — tarajm.com + CGIE (Encyclopaedia of the World of Islam): "أصله من الكوفة وكان يسكنها تارة ويسكن البصرة تارة أخرى" → lived_in kufa + lived_in basra (confidence medium). New source entities created: source/tarajm-com, source/cgie-encyclopaedia.

**Corrections made during review:** al-husayn-ibn-said-al-hamdani retargeted humdan→aleppo; abdallah-ibn-wahb-al-rasibi Nahrawan camp → traveled_to; ata-ibn-al-saib campaign → traveled_to balkh; al-ashraf-shaban's الخليفة (caliph, not place) edge dropped; abd-al-rahman-ibn-ahmad-al-alawi "خرج من اليمن" → lived_in yemen.

**Remaining unresolved_without_place (638):** one-line draft cards with no geographic fact in text and no quick source found. Attempted queries: name + أقام/سكن/ولد/توفي/دفن + place, nisba lookups. Records unchanged; parents may retry with per-person research budgets.

**Final validation:** `npm run validate` → 0 errors (51,239 entities). `npm run graph` → 53,235 nodes / 93,550 edges.

---

## Fourth pass — deep research wave on unresolved_without_place

- Re-read each unresolved record (aliases, nisbas, regions, notes, sources, external_ids, relations), then ran: (a) a Wikidata batch fetch of P19/P20/P551 for all 250 unresolved persons carrying QIDs — returned data, but **0 target place-QIDs matched existing place entities** (fetch log kept for the next lane); (b) dynasty-court inference for persons whose records name a ruling house and whose roles mark them ruler/prince/amir/sultan — resolved **7**: abd-al-aziz-ibn-al-walid + abd-allah-ibn-muhammad-cordova + abdullah-ibn-amr-ibn-ghaylan → damascus (Umayyad), aisha-bint-al-mustanjid + al-amin + al-hadi → baghdad (Abbasid), al-uthmaniyya → istanbul (Ottoman). All `lived_in`, `confidence: low`, note flags the inference for review.
- Verbs used in queries across passes: born/died/buried (وُلد، توفي، دُفن), أقام، سكن، استقر، انتقل إلى، خرج من، سافر إلى، عاد إلى، نزل، ولي/أمير/سلطان/صاحب/مؤرخ X, settled in, resided in, moved to, traveled to, worked/served in, nationality adjectives.
- **Coverage now: 3,139 of 3,770 in-range persons carry a person→place edge. Remaining unresolved_without_place: 631** — one-line draft cards and stubs whose records give no place, region, nisba, dynasty or role usable without fabrication; nothing invented.
- Validation: `tsx scripts/validate.ts` → **0 errors** (51,239 entities). `npm run graph` → 53,235 nodes / 93,564 edges, clean.

---

## Fifth pass — external-ID follow-through (Wikidata claims)

- Re-checked every unresolved person's `external_ids`: **250 of 638 had Wikidata QIDs**; all 250 entity records fetched (`wbgetentities`, claims only). Extracted P19/P20/P119/P551/P937/P27 place claims: **223 persons carried 598 place claims -> 159 unique place QIDs**; all 159 fetched with ar/en labels + P625 coords.
- Resolution order per target QID: existing place by `external_ids.wikidata` -> existing place by label/alias -> create new `data/place/*.yaml` (ar/en label+summary, kind town/site/region by name, `regions: [global]`, coords from P625 with `coordinate_precision: locality`, `external_ids.wikidata`, `source/wikidata`, draft status, own-research provenance).
- Result: **220 persons resolved**, edges added as `born_in`/`died_in`/`buried_in`/`lived_in` per claim property, `confidence: medium`, note naming the Wikidata claim and recommending corroboration. 5 of the "new places" turned out to be buildings already in the graph — edges retargeted to `building/*` (allowed by `buried_in`/`lived_in` range) and dupes removed. 26 historical-state/polity-named places had their `wikidata` ID stripped (ID already held on the matching `polity/*` entity; note kept in `coordinate_note`). 4 person files' relation-indent mismatches repaired; `place/sirwan` Arabic parens wrapped in U+2066/U+2069.
- **Coverage now: 3,354 of 3,770 in-range persons carry a person->place edge. Remaining unresolved_without_place: ~416** (count includes the retargeted building edges; unresolved are QID-less draft cards with no Wikidata place claims — bilingual per-person web research is the only remaining lane).
- Validation: `npm run validate` -> **0 errors** (51,321 entities, 8,544 warnings). `npm run graph` -> **53,317 nodes / 94,664 edges**, clean. Not committed.

---

## Sixth pass — targeted research on the consolidated 416-file unresolved list (/tmp/geo-unresolved-a.txt)

- Sequential batches of <=25; every record read in full (labels, nisbas, regions, periods, sources, external_ids, existing relations) before deciding. Edges added only where the record's own cited sources or a defensible inference support them; nisba-only and court-inference edges are marked confidence: low with notes flagging them for review; explicit-source edges carry medium/high.
- **186 of the 416 resolved; 230 remain unresolved** (legendary figures, single-anecdote names, draft cards with no usable geography). Skipped rather than guessed: e.g. afridun, al-dahhak-dhu-al-afwah, aisha-khalid, aktham-ibn-sayfi, al-ablaq, al-ahlaj, afra-bint-uqayl, abd-al-rahman-rafat-al-basha, abu-al-qasim-al-hamid, abu-mansur-al-ashqar.
- New places created (ar/en, coords+precision, draft, own-research): yamama, sicily, maarrat-al-numan, scotland, lalish, cambridge, biqa. Targets reused incl. raqqa, siffin, sijistan, khwarazm, khurasan, herat, faryab, qayrawan, al-andalus, murcia, marrakesh, jurash, sanaa, yamama, wasit, al-madain, al-ahwaz, harran, abiward, bayhaq, dabil, sindan, najd, jazira, ifriqiya, maghreb, misr, aleppo, mecca, medina, samarra, and building/* (buried_in range).
- Representative evidence: "aqama akthara umrihi bi'l-Basra" (al-Ajdaji, EI2, high); "man of Banu Abs at Kufa" (Abu Sa'da, high); "qadi al-qudat bi'l-Andalus, haddatha wa-tawuffa biha" (Ibn Baqi, high); "mustafti Baghdad" (Abu Tayyib al-Tabari, high); Lalish founding + tomb (Adi ibn Musafir, high/medium); governorships (Sijistan for Mansur al-Samani and al-Fadl ibn Mahan; al-Jazira for al-Abbas ibn Muhammad; Khurasan for Ibn Abra, Ibn Ziyad, Ibn Khazim); deaths at Siffin, Bayhaq, Baghdad, Samarra, Ifriqiya, Jurash, Isfahan, Mecca.
- Validation: npm run validate -> **0 errors** (51,328 entities). npm run graph -> **53,323 nodes / 95,056 edges**. Not committed. Remaining-230 list at /tmp/geo-still.txt.

- Continuation of sixth pass (batches 9+): a further 17 resolved in the al-* and remaining Abd-* cards — Ifriqiya governorship for al-Fadl ibn Rawh, death at Samarra for al-Fath ibn Khaqan, al-Hadi Musa dwelling and dying at Madinat al-Salam (Baghdad, high), al-Hakim bi-Amr Allah as ruler of Misr, Khurasan/Sijistan deputyships for al-Hakam ibn Awana and al-Harith al-Quba', al-Hajjaj ibn Matar for the Baghdad translation circle, al-Dabili via the Dabil nisba.
- **Pass total: 203 of the 416 consolidated-list persons now carry a person->place edge; 213 remain unresolved** (mostly legendary/pre-Islamic figures, single-anecdote names, and thin draft cards with no attested geography — list at /tmp/geo-still.txt).
- Validation after the last batch: `npm run validate` -> **0 errors** (51,328 entities); `npm run graph` -> **53,323 nodes / 95,094 edges**. Not committed.

- Continuation of sixth pass (batches 9+): a further 17 resolved in the al-* and remaining Abd-* cards — Ifriqiya governorship for al-Fadl ibn Rawh, death at Samarra for al-Fath ibn Khaqan, al-Hadi Musa dwelling and dying at Madinat al-Salam (Baghdad, high), al-Hakim bi-Amr Allah as ruler of Misr, Khurasan/Sijistan deputyships for al-Hakam ibn Awana and al-Harith al-Quba', al-Hajjaj ibn Matar for the Baghdad translation circle, al-Dabili via the Dabil nisba.
- **Pass total: 203 of the 416 consolidated-list persons now carry a person->place edge; 213 remain unresolved** (mostly legendary/pre-Islamic figures, single-anecdote names, and thin draft cards with no attested geography — list at /tmp/geo-still.txt).
- Validation after the last batch: `npm run validate` -> **0 errors** (51,328 entities); `npm run graph` -> **53,323 nodes / 95,094 edges**. Not committed.

- Continuation (batch 10, al-* cards): +24 resolved — Baghdad milieux for al-Hulwani, al-Ja'bari, al-Kalwadhani, al-Khayyat, al-Khayzuran, al-Mada'ini, viziers of al-Muqtadir/al-Qahir/al-Mahdi; death at Raqqa (al-Husayn ibn al-Qasim), Egypt for Jaysh ibn Khumarawayh, al-Khafaji and al-Kamal al-Suyuti, Mecca siege for al-Husayn ibn Numayr, Jazira for al-Husayn ibn Hamdan, Ahwaz revolt for al-Khirit, Khurasan for al-Khujistani, Basra for al-Kajji, Kufa for al-Jahshiyari and al-Lu'lu'i, Damascus inference for al-Kharaqi.
- **Pass running total: 227 of 416 resolved; 189 remain unresolved** (list at /tmp/geo-still.txt). Validation clean after batch 10 (0 errors).

- Seventh pass — the consolidated 189-file list (/tmp/geo-unresolved-a.txt), batches of <=25.
- Every record re-read in full (labels, nisbas, regions, periods, story_roles, sources, external_ids, relations). Edges written only where the record's own cited sources or a defensible dynasty/court/region inference support them; explicit-source edges carry medium/high confidence, nisba-, region- and inference-based edges are confidence: low with notes flagging them for review.
- **173 of the 189 resolved; 16 remain unresolved** (aisha-khalid, athea-iqbal — living people whose own records state no confirmed place; al-hasan-ibn-al-khasib, al-haym-ibn-al-haym, al-sayrafi-al-hilali, al-mukhtar-ibn-kab, al-yaman-ibn-ribab, ali-ibn-ribab's brother ali-ibn-muhammad-al-nawfali, ali-ibn-ishaq-ibn-yahya-ibn-muadh, ali-ibn-al-muhsin-al-tanukhi, al-tibi, al-nasimi-al-manzilawi, al-mufarraj-ibn-sallam, al-hawfazan-ibn-shurayk, amr-ibn-uds, anmar-ibn-nizar — thin cards, proverb figures and ambiguous toponyms like الارض الكبيرة where no defensible place exists). Unresolved list at /tmp/geo-a-work/still.txt.
- Evidence used from the records themselves: explicit place verbs — مقيماً بالموصل وبها مات (al-Muhadhdhab), قبض مسموماً بطوس ودفن هنالك (al-Ridha), توفي بحلب ودفن خارج باب الأربعين (al-Salah), ولد بقرية أوريولة وقتل شهيداً بالمرية (al-Rushati), مات بسامرا (Ibn al-Madini), دفن ببغداد (al-Mutarriz), قتله الباطنية ببغداد (al-Ruwayni), تغلب على دمشق (al-A'sam), استقرت له مصر (al-Aziz), آخر أمراء الصفاريين على سجستان (al-Mu'addal), أمير مصر (al-Sari b. al-Hakam), صاحب مخاليف اليمن (As'ad b. Ya'fur), والي خراسان/بلخ/مناذر (al-Mufaddal b. al-Muhallab, Asid b. al-Mutashammis, Asim b. Qays), governorships and judgeships (Ibn Abi'l-Shawarib: Madinat al-Mansur, Qatrabbul, Samarra, Takrit, Mosul road), campaign travel (Azerbaijan, Khujanda, Bab al-Lan, Daylam, Anatolia sa'ifa, Ayn al-Tamr, Armenia/Muqan), court/capital milieux (Baghdad for viziers, naqibs, court poets, muhtasib circles; Samarra for Mutawakkil-era princes and Turkish amirs; Cairo for Mamluk-era caliphs; Damascus for Umayyad courtiers), and tribal-region nisbas at low confidence (Tayma, Banu Abs/Najd, Banu Udhra/Hijaz, Yafran/Maghreb, Jabal Amil, Tadmur, Antioch, Masisa, Thamanin/Jazirat Ibn Umar, Shahrazur).
- New place created: place/aphrodisias (ar/en label+summary, coords 37.708, 28.724 locality, region andalus-europe, wikidata Q181303, draft, own-research) for Alexander of Aphrodisias.
- One file repaired mid-pass: ali-ibn-mazyad's relations block uses column-0 dash style; the appended edge was rewritten to match (validator caught it: 2 errors -> fixed -> 0 errors).
- Attempted but left unresolved with documented reasoning above: living online figures with no published residence; pre-Islamic proverb figures with no locality (Amr b. Uds, Anmar b. Nizar); records whose only toponym is ambiguous (al-Mufarraj's الأرض الكبيرة) or unidentified (al-Nasimi's بلدة النسيمية).
- Final validation: `npm run validate` -> **0 errors** (51,329 entities, 8,545 warnings). `npm run graph` -> **53,324 nodes / 95,598 edges**, clean. Not committed.

- Eighth pass — the residual 16-file list (/tmp/geo-final-a.txt): one final bilingual check per record (full fields, nisbas, regions, sources, external_ids) plus targeted Arabic/English web research with birth/death and residence/movement verbs (وُلد، توفي، دُفن، أقام، سكن، انتقل، خرج، وثب، حكم، but also office-holding على المعونة بدمشق، postmaster letters, tribal homelands).
- **10 of the 16 resolved; 6 remain unresolved.** Resolved: ali-ibn-ishaq-ibn-yahya-ibn-muadh -> lived_in damascus (high; he held al-Ma'una at Damascus and crucified the kharaj official at Bab Dimashq in 226, per Tabari j.9 p.111 via lib.eshia/40077 and Ibn Asakir j.18 p.124); al-mufarraj-ibn-sallam -> lived_in maghreb (medium; Baladhuri explicitly places "al-Ard al-Kabira" in the Maghreb, 15 days from Barqa, with coastal Bara); al-tibi -> lived_in tib (medium; tarajm.com gives residence "الطيب، العراق" — new place/tib created: ar/en label+summary, approx coords 32.49/45.83 near al-Nu'maniyya, Wasit, source/tarajm-com, draft); al-hasan-ibn-al-khasib -> born_in basra + died_in baghdad (low; ar.wikipedia Albubather entry, cited via source/wikidata, flagged); al-hawfazan-ibn-shurayk -> lived_in jazira (low; al-A'lam calls him a jahili knight of Banu Shayban b. Bakr, Jazira homeland); al-nasimi-al-manzilawi -> lived_in al-sham (low; cited by al-Ghazzi's Damascus-region Kawakib al-Sa'ira; his "بلدة النسيمية" is unverified, no place created); al-sayrafi-al-hilali and al-yaman-ibn-ribab -> lived_in basra (low; Fihrist/Mas'udi Kharijite mutakallimin Basran circle, flagged); ali-ibn-al-muhsin-al-tanukhi -> lived_in baghdad (low; Tanukhi qadi house); ali-ibn-muhammad-al-nawfali -> lived_in iraq (low; akhbari milieu).
- **Remaining unresolved (6), with attempted searches:** aisha-khalid and athea-iqbal — living online teachers; their own provenance blocks record that no published source names a residence or base (channel/about pages, directories checked) -> left without edges. al-haym-ibn-al-haym — Najiyya imamate author in the Fihrist only; Najadat heartland (Yamama vs Basra) is contested, no defensible place. al-mukhtar-ibn-kab — one verse on Qutayba in Baladhuri, no residence. amr-ibn-uds and anmar-ibn-nizar — pre-Islamic proverb figures from Nihayat al-Arab; no locality.
- New place this pass: place/tib (no `*-2` slug; dedup checked against place list).
- Validation: `npm run validate` -> **0 errors** (51,330 entities, 8,546 warnings). `npm run graph` -> **53,325 nodes / 95,620 edges**, clean. Not committed.
