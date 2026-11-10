# E5 proposal — story cards, leveled reading 101–300, studio, embeds, LibGuides, video specs

**Status:** proposal only. Nothing here is authored or built until the founder approves E5 **separately** in chat (E4 approval does not cover it). Scope follows plan §5 E5.

**Decisions needed (yes/no per block).**

## 1. Leveled reading — the next 200 records — decide per list: yes / no

Per plan §9.1 decision 5 the agent proposes and the founder approves or edits the list before any leveled text is authored (then batches of 25). Selection repeats the leveled-100 rules: real entities only (no stubs), page classes a child/teen can read (person, event, place, building, group, polity, period, concept, practice, language, object, work), the leveled-100 exclusions applied — isnad-dominated hadith transmitters (inbound edges >50% from `passage/` records), the fiqh-technical concepts (talaq, kaffara, riba, tahara), and first-fitna figures (Mu'awiya). `inbound` is the demand evidence: edge count in the compiled graph (`npm run graph`, 66,776 edges, 25 Oct 2026); `prose` lists existing prose languages — every candidate already has ar/en/ur prose.

| Record | Title (en) | inbound | prose |
|---|---|---|---|
| `event/return-of-abyssinian-emigrants` | Return of the Abyssinian emigrants with Ja'far ibn Abi Talib | 91 | ar,en,ur |
| `place/aksum` | Aksum | 68 | ar,en,ur |
| `event/battle-of-hunayn` | The Battle of Hunayn | 49 | ar,en,ur |
| `group/early-muslims` | The early Muslim community | 47 | ar,en,ur |
| `event/expedition-to-tabuk` | The expedition to Tabuk | 45 | ar,en,ur |
| `person/amr-ibn-al-as` | Amr ibn al-As | 38 | ar,en,ur |
| `group/banu-hashim` | Banu Hashim | 38 | ar,en,ur |
| `place/mosul` | Mosul | 37 | ar,en,ur |
| `place/aleppo` | Aleppo | 37 | ar,en,ur |
| `person/abu-ubayda-ibn-al-jarrah` | Abu Ubayda ibn al-Jarrah | 37 | ar,en,ur |
| `place/yemen` | Yemen | 36 | ar,en,ur |
| `practice/dua` | Du'a (supplication) | 35 | ar,en,ur |
| `place/arafat` | Arafat | 35 | ar,en,ur |
| `concept/ghanima` | Ghanima (spoils of war) | 35 | ar,en,ur |
| `work/muwatta-malik` | Muwatta of Imam Malik | 33 | ar,en,ur |
| `person/fatima` | Fatima bint Muhammad | 33 | ar,en,ur |
| `person/abbas-ibn-abd-al-muttalib` | al-Abbas ibn Abd al-Muttalib | 32 | ar,en,ur |
| `person/al-shafii` | Muhammad ibn Idris al-Shafi'i | 31 | ar,en,ur |
| `person/abu-sufyan-ibn-harb` | Abu Sufyan ibn Harb | 31 | ar,en,ur |
| `group/muhajirun` | The Muhajirun | 31 | ar,en,ur |
| `event/death-of-the-prophet` | The death of the Prophet | 31 | ar,en,ur |
| `person/abd-al-muttalib` | Abd al-Muttalib ibn Hashim | 29 | ar,en,ur |
| `event/al-dawa-al-sirriyya` | The three years of the secret call | 29 | ar,en,ur |
| `place/armenia` | Armenia | 28 | ar,en,ur |
| `person/muadh-ibn-jabal` | Mu'adh ibn Jabal | 28 | ar,en,ur |
| `event/battle-of-mutah` | The Battle of Mu'tah | 28 | ar,en,ur |
| `building/prophets-mosque` | Prophet's Mosque | 28 | ar,en,ur |
| `place/khaybar` | Khaybar | 27 | ar,en,ur |
| `event/pledges-of-aqaba` | The Pledges of Aqaba | 27 | ar,en,ur |
| `concept/iman` | Iman (faith) | 27 | ar,en,ur |
| `person/abu-jahl` | Abu Jahl (Amr ibn Hisham) | 26 | ar,en,ur |
| `group/thamud` | Thamud | 26 | ar,en,ur |
| `person/zayd-ibn-haritha` | Zayd ibn Haritha | 25 | ar,en,ur |
| `person/hasan-ibn-ali` | Hasan ibn Ali | 25 | ar,en,ur |
| `person/hamza` | Hamza ibn Abd al-Muttalib | 25 | ar,en,ur |
| `person/abu-talib` | Abu Talib ibn Abd al-Muttalib | 25 | ar,en,ur |
| `person/abd-allah-al-mamun` | Abd Allah al-Ma'mun ibn Harun al-Rashid | 25 | ar,en,ur |
| `person/abd-al-malik-ibn-marwan` | Abd al-Malik ibn Marwan | 25 | ar,en,ur |
| `event/distribution-of-hunayn-spoils` | The distribution of Hunayn spoils at al-Ji'rana | 25 | ar,en,ur |
| `concept/tadbir` | Tadbir (manumission effective after death) | 25 | ar,en,ur |
| `concept/nisab` | Nisab (wealth threshold) | 25 | ar,en,ur |
| `concept/nadhr` | The vow (nadhr) and its rulings | 25 | ar,en,ur |
| `concept/jizya` | Jizya (capitation on treaty peoples) | 25 | ar,en,ur |
| `concept/ijara` | Lease and hire (ijara) | 25 | ar,en,ur |
| `person/khadija` | Khadija bint Khuwaylid | 24 | ar,en,ur |
| `person/jafar-ibn-abi-talib` | Ja'far ibn Abi Talib | 24 | ar,en,ur |
| `group/banu-tamim` | Banu Tamim | 24 | ar,en,ur |
| `event/year-of-delegations` | The Year of Delegations | 24 | ar,en,ur |
| `concept/sadaqa` | Charity (sadaqa) | 24 | ar,en,ur |
| `place/uhud` | Mount Uhud | 23 | ar,en,ur |
| `person/ubada-ibn-al-samit` | Ubada ibn al-Samit | 23 | ar,en,ur |
| `person/bilal-ibn-rabah` | Bilal ibn Rabah | 23 | ar,en,ur |
| `person/zubayr-ibn-al-awwam` | al-Zubayr ibn al-Awwam | 22 | ar,en,ur |
| `person/al-mansur` | Abu Ja'far al-Mansur | 22 | ar,en,ur |
| `group/thaqif` | Thaqif | 22 | ar,en,ur |
| `event/siege-of-taif` | The siege of Ta'if | 22 | ar,en,ur |
| `event/conquest-of-syria` | The Conquest of Syria | 22 | ar,en,ur |
| `event/burial-of-the-prophet` | The burial of the Prophet | 22 | ar,en,ur |
| `concept/adab` | Prophetic adab (proper conduct) | 22 | ar,en,ur |
| `person/husayn-ibn-ali` | Husayn ibn Ali | 21 | ar,en,ur |
| `person/al-mughira-ibn-shuba` | al-Mughira ibn Shu'ba | 21 | ar,en,ur |
| `event/persecution-of-mustadafin` | The persecution of the vulnerable Muslims | 21 | ar,en,ur |
| `event/delegation-of-banu-tamim` | The delegation of Banu Tamim and the boasting contest | 21 | ar,en,ur |
| `event/battle-of-khaybar` | The Conquest of Khaybar | 21 | ar,en,ur |
| `building/masjid-al-haram` | Al-Masjid Al-Haram | 21 | ar,en,ur |
| `practice/dafn` | Burial | 20 | ar,en,ur |
| `place/misr` | Misr (Egypt) | 20 | ar,en,ur |
| `place/al-sham` | al-Sham (Greater Syria) | 20 | ar,en,ur |
| `person/muhammad-khwarazmshah` | person/muhammad-khwarazmshah | 20 | ar,en,ur |
| `person/harun-al-rashid` | Harun al-Rashid | 20 | ar,en,ur |
| `person/al-mahdi` | Muhammad al-Mahdi | 20 | ar,en,ur |
| `person/abu-dharr-al-ghifari` | Abu Dharr al-Ghifari | 20 | ar,en,ur |
| `practice/salat-al-janaza` | The funeral prayer | 19 | ar,en,ur |
| `practice/sai` | Sa'i (walking between Safa and Marwa) | 19 | ar,en,ur |
| `place/algiers` | Algiers | 19 | ar,en,ur |
| `person/musab-ibn-umayr` | Mus'ab ibn Umayr | 19 | ar,en,ur |
| `person/al-qadir-billah` | al-Qadir bi-llah Ahmad ibn Ishaq ibn al-Muqtadir | 19 | ar,en,ur |
| `person/abdullah-ibn-ubayy` | Abdullah ibn Ubayy | 19 | ar,en,ur |
| `concept/al-iqtisad-fi-al-quran` | Economy and balance in the Qur'an | 19 | ar |
| `place/taif` | Ta'if | 18 | ar,en,ur |
| `person/usama-ibn-zayd` | Usama ibn Zayd | 18 | ar,en,ur |
| `person/sad-ibn-muadh` | Sa'd ibn Mu'adh | 18 | ar,en,ur |
| `person/kaab-ibn-malik` | Ka'b ibn Malik al-Ansari | 18 | ar,en,ur |
| `person/jalal-al-din-khwarazmshah` | person/jalal-al-din-khwarazmshah | 18 | ar,en,ur |
| `person/hassan-ibn-thabit` | Hassan ibn Thabit | 18 | ar,en,ur |
| `person/al-mutawakkil` | al-Mutawakkil ala Allah | 18 | ar,en,ur |
| `person/al-malik-al-adil-ayyub` | al-Malik al-Adil Sayf al-Din Abu Bakr ibn Ayyub | 18 | ar,en,ur |
| `person/abu-lahab` | Abu Lahab | 18 | ar,en,ur |
| `event/letters-to-rulers-and-kings` | The Letters to Rulers and Kings | 18 | ar,en,ur |
| `event/hijra-departure` | The departure night of the Hijra | 18 | ar,en,ur |
| `building/kaaba` | The Kaaba | 18 | ar,en,ur |
| `place/alexandria` | Alexandria | 17 | ar,en,ur |
| `person/baybars` | person/baybars | 17 | ar,en,ur |
| `group/khuzaa` | Khuza'a | 17 | ar,en,ur |
| `event/the-three-left-behind` | The three who were left behind after Tabuk | 17 | ar,en,ur |
| `event/masjid-al-dirar-builders-ask-the-prophet-to-pray` | The builders of the mosque ask the Prophet to pray in it | 17 | ar,en,ur |
| `concept/ukhuwwa` | Muslim brotherhood | 17 | ar,en,ur |
| `concept/iddah` | Iddah (waiting period) | 17 | ar,en,ur |
| `place/muzdalifa` | Muzdalifa | 16 | ar,en,ur |
| `person/khalid-ibn-said-ibn-al-as` | Khalid ibn Sa'id ibn al-As | 16 | ar,en,ur |
| `person/jarir-ibn-abd-allah-al-bajali` | person/jarir-ibn-abd-allah-al-bajali | 16 | ar,en,ur |
| `person/ibn-hajar-al-asqalani` | person/ibn-hajar-al-asqalani | 16 | ar,en,ur |
| `person/habib-ibn-maslama` | Habib ibn Maslama al-Fihri | 16 | ar,en,ur |
| `person/asma-bint-umays` | Asma' bint Umays | 16 | ar,en,ur |
| `person/al-qaim-billah` | al-Qa'im bi-Amr Allah Abd Allah ibn al-Qadir | 16 | ar,en,ur |
| `person/al-mutadid` | al-Mu'tadid bi-llah | 16 | ar,en,ur |
| `group/banu-sahm` | Banu Sahm | 16 | ar,en,ur |
| `group/banu-jumah` | Banu Jumah | 16 | ar,en,ur |
| `group/banu-abd-shams` | Banu Abd Shams | 16 | ar,en,ur |
| `group/ahl-al-bayt` | Ahl al-Bayt | 16 | ar,en,ur |
| `event/saqifa` | The meeting at Saqifa | 16 | ar,en,ur |
| `event/ridda-wars` | The Ridda Wars | 16 | ar,en,ur |
| `event/raid-of-zayd-on-judham` | Zayd ibn Haritha's raid on Judham and the Prophet's restitution | 16 | ar,en,ur |
| `event/delegation-of-thaqif` | The delegation of Thaqif | 16 | ar,en,ur |
| `event/conquest-of-jazira` | The Conquest of the Jazira | 16 | ar,en,ur |
| `event/battle-of-yamama` | The Battle of Yamama | 16 | ar,en,ur |
| `place/jazira` | The Jazira | 15 | ar,en,ur |
| `place/ifriqiya` | Ifriqiya | 15 | ar,en,ur |
| `place/badr` | Badr | 15 | ar,en,ur |
| `place/al-hira` | al-Hira | 15 | ar,en,ur |
| `person/talha-ibn-ubaydullah` | Talha ibn Ubaydullah | 15 | ar,en,ur |
| `person/sulayman-al-qanuni` | person/sulayman-al-qanuni | 15 | ar,en,ur |
| `person/hasan-ibn-khayr-al-din` | Hasan b. Khayr al-Din Barbarossa | 15 | ar,en,ur |
| `person/al-mutasim-abi-ishaq` | al-Mu'tasim Abu Ishaq ibn al-Rashid | 15 | ar,en,ur |
| `person/abdullah-ibn-abd-al-muttalib` | Abdullah ibn Abd al-Muttalib | 15 | ar,en,ur |
| `group/banu-hamdan` | Banu Hamdan | 15 | ar,en,ur |
| `event/sariyya-of-uyayna-to-banu-tamim` | Uyayna ibn Hisn's raid on Banu Tamim | 15 | ar,en,ur |
| `event/khuzaa-bakr-clash-al-watir` | The Bakr–Khuza'a clash at al-Watir | 15 | ar,en,ur |
| `event/badr-prisoners` | The affair of the Badr prisoners | 15 | ar,en,ur |
| `concept/qadar` | Qadar (divine decree) | 15 | ar,en,ur |
| `concept/ihdad` | Mourning of a widow (ihdad) | 15 | ar,en,ur |
| `place/hama` | Hama | 14 | ar,en,ur |
| `person/ziyad-ibn-abi-sufyan` | person/ziyad-ibn-abi-sufyan | 14 | ar,en,ur |
| `person/ubayy-ibn-kab` | Ubayy ibn Ka'b | 14 | ar,en,ur |
| `person/suhayl-ibn-amr` | Suhayl ibn Amr | 14 | ar,en,ur |
| `person/nur-al-din-mahmud-ibn-zangi` | person/nur-al-din-mahmud-ibn-zangi | 14 | ar,en,ur |
| `person/musaylima` | Musaylima | 14 | ar,en,ur |
| `person/hudhayfa-ibn-al-yaman` | Hudhayfa ibn al-Yaman | 14 | ar,en,ur |
| `person/ammar-ibn-yasir` | Ammar ibn Yasir | 14 | ar,en,ur |
| `person/al-hajjaj-ibn-yusuf` | al-Hajjaj ibn Yusuf al-Thaqafi | 14 | ar,en,ur |
| `person/abd-allah-ibn-amir` | Abd Allah ibn Amir | 14 | ar,en,ur |
| `group/builders-of-masjid-al-dirar` | The builders of Masjid al-Dirar | 14 | ar,en,ur |
| `group/banu-umayya` | Banu Umayya ibn Abd Shams | 14 | ar,en,ur |
| `group/banu-makhzum` | Banu Makhzum | 14 | ar,en,ur |
| `event/mission-of-khalid-to-banu-al-harith` | Khalid ibn al-Walid's mission to Banu al-Harith ibn Ka'b, their conversion and their delegation | 14 | ar,en,ur |
| `event/incident-of-the-slander` | The Incident of the Slander (Hadith al-Ifk) | 14 | ar,en,ur |
| `concept/maghfira` | Divine forgiveness (maghfira) | 14 | ar,en,ur |
| `concept/dhikr` | Remembrance of God (dhikr) | 14 | ar,en,ur |
| `practice/zakat-al-fitr` | Zakat al-Fitr | 13 | ar,en,ur |
| `place/tunis` | Tunis | 13 | ar,en,ur |
| `place/tabuk` | Tabuk | 13 | ar,en,ur |
| `place/rayy` | Rayy | 13 | ar,en,ur |
| `place/quba` | Quba | 13 | ar,en,ur |
| `place/mutah` | Mu'tah | 13 | ar,en,ur |
| `person/uyayna-ibn-hisn` | Uyayna ibn Hisn al-Fazari | 13 | ar,en,ur |
| `person/selim-i-ottoman` | person/selim-i-ottoman | 13 | ar,en,ur |
| `person/ikrima-ibn-abi-jahl` | Ikrima ibn Abi Jahl | 13 | ar,en,ur |
| `person/ibn-qudama-al-maqdisi` | Ibn Qudama al-Maqdisi | 13 | ar,en,ur |
| `person/al-muthanna-ibn-haritha` | al-Muthanna ibn Haritha | 13 | ar,en,ur |
| `person/al-aqra-ibn-habis` | al-Aqra' ibn Habis al-Tamimi | 13 | ar,en,ur |
| `person/abd-allah-ibn-rawaha` | Abd Allah ibn Rawaha | 13 | ar,en,ur |
| `period/rashidun` | The Rashidun Caliphate | 13 | ar,en,ur |
| `group/kinda` | Kinda | 13 | ar,en,ur |
| `group/banu-nadir` | Banu Nadir | 13 | ar,en,ur |
| `group/al-khazraj` | al-Khazraj | 13 | ar,en,ur |
| `event/second-migration-to-abyssinia` | The second migration to Abyssinia | 13 | ar,en,ur |
| `event/journey-to-taif` | The Prophet's journey to al-Ta'if | 13 | ar,en,ur |
| `event/isra-and-miraj` | The Isra and Mi'raj | 13 | ar,en,ur |
| `event/fatrat-al-wahy` | The pause of revelation (Fatra) | 13 | ar,en,ur |
| `event/expedition-of-nakhla` | Expedition of Nakhla | 13 | ar,en,ur |
| `event/battle-of-yarmuk` | Battle of the Yarmuk | 13 | ar,en,ur |
| `event/badr-duel` | The duel at Badr | 13 | ar,en,ur |
| `concept/ushr` | Tithe on the trade of non-Muslims (ushr) | 13 | ar,en,ur |
| `concept/khamr` | Wine | 13 | ar,en,ur |
| `place/harran` | Harran | 12 | ar,en,ur |
| `place/dhu-al-hulayfa` | Dhu al-Hulayfa | 12 | ar,en,ur |
| `person/uqba-ibn-abi-muayt` | Uqba ibn Abi Mu'ayt | 12 | ar,en,ur |
| `person/umm-habiba-bint-abi-sufyan` | Umm Habiba Ramlah bint Abi Sufyan | 12 | ar,en,ur |
| `person/umayya-ibn-khalaf` | Umayya ibn Khalaf | 12 | ar,en,ur |
| `person/sawda-bint-zama` | Sawda bint Zam'a | 12 | ar,en,ur |
| `person/salih-rais` | Salih Reis | 12 | ar,en,ur |
| `person/safiyya-bint-huyayy` | Safiyya bint Huyayy | 12 | ar,en,ur |
| `person/murad-ii-uthmani` | person/murad-ii-uthmani | 12 | ar,en,ur |
| `person/bayazid-ii` | person/bayazid-ii | 12 | ar,en,ur |
| `person/al-hakim-bi-amr-allah` | al-Hakim bi-Amr Allah Mansur ibn al-Aziz | 12 | ar,en,ur |
| `person/al-bara-ibn-azib` | al-Bara' ibn Azib | 12 | ar,en,ur |
| `group/himyar` | Himyar | 12 | ar,en,ur |
| `group/hawazin` | Hawazin | 12 | ar,en,ur |
| `group/banu-zuhra` | Banu Zuhra | 12 | ar,en,ur |
| `group/banu-taghlib` | Banu Taghlib ibn Wa'il | 12 | ar,en,ur |
| `group/bakr-ibn-wail` | Bakr ibn Wa'il | 12 | ar,en,ur |
| `event/uhud-defense-of-the-prophet` | Defense of the Prophet at Uhud | 12 | ar,en,ur |
| `event/siege-of-ayn-al-tamr` | The Siege of Ayn al-Tamr and Its Church Captives | 12 | ar,en,ur |
| `event/repentance-of-the-three-accepted` | The acceptance of the repentance of the three | 12 | ar,en,ur |
| `event/letter-of-himyar-kings` | The letter of the kings of Himyar | 12 | ar,en,ur |
| `event/last-quraysh-delegation-to-abu-talib` | Last Quraysh delegation to Abu Talib | 12 | ar,en,ur |
| `event/islam-of-umar` | Umar accepts Islam | 12 | ar,en,ur |
| `event/farewell-sermon-at-arafat` | The Farewell Sermon at Arafat | 12 | ar,en,ur |
| `event/expedition-of-banu-al-mustaliq` | The Expedition of Banu al-Mustaliq (al-Muraysi') | 12 | ar,en,ur |
| `event/dispatch-of-sadaqa-collectors` | The dispatch of the sadaqa collectors | 12 | ar,en,ur |

**Counts:** 200 records ≈ 351 trilingual author-hours (plan §5 E5), authored in batches of 25 after approval.

## 2. Embed sign-off — `submission-impacting` — decide: yes / no

The embed widget (`/{lang}/embed/fact/`, `/embed/trail-of-the-week/`, each ≤ 15 KB, inline CSS, a "from islam.museum" backlink, no cookies, no third-party script) is documentation-touching and needs the founder's written sign-off **before it ships**. Exact dossier lines it would change in `docs/outreach/dpga-evidence-map.md`:

- **Line 17 (indicator 7, privacy row):** the claim "No PII collected: no accounts, no cookies, no forms, no third-party scripts" would gain a sentence noting that museum pages may be iframed by third-party sites; the widget itself sets no cookies and runs no third-party script, keeping the claim true.
- **Line 33 ("Files added or changed for this application" list):** would gain a line for `site/src/pages/[lang]/embed/` and the embed strings in `i18n/`.
- **`docs/outreach/unesco-nomination-dossier.md` A.5/A.6 claims register:** the "static, no third-party scripts" posture line would be restated to cover serving iframe embeds to external sites (documentation edit only, after sign-off).

## 3. Story in 12 cards — spec only — decide: yes / no

20 stories × 12 cards (`edu/story-cards/*.yaml`: one idea, one whitelisted image or architecture illustration, one narration line each; auto-play via the Surah Map engine at 2.8 s/card, pause, step). Proposed story list:

`the-hijra-route`, `first-revelation-in-hira`, `the-boy-and-the-monk`, `a-cave-in-thawr`, `the-first-muezzin`, `the-constitution-of-medina`, `the-year-of-sorrow`, `the-farewell-sermon`, `umars-jerusalem-walk`, `the-paper-of-baghdad`, `ibn-battutas-first-journey`, `fatima-al-fihris-mosque`, `al-khwarizmis-book`, `the-house-of-wisdom`, `al-zahrawis-instruments`, `ibn-al-haythams-dark-room`, `the-ash-shifa-manuscript`, `sinans-first-mosque`, `the-samarkand-observatory`, `mansa-musas-caravan`.

## 4. Studio — spec only — decide: yes / no

Girih tile designer (10-/8-point star grid, strap colours, PNG/SVG export), calligraphy tracing (Kufic letterforms; no Qur'an text — city names and virtues only), design-a-coin/manuscript (templates from the 467 object photos; text fields limited to names and dates); every export carries a share card; nothing uploaded; no per-visitor data.

## 5. Librarians page + video specs — decide: yes / no

`/{lang}/learn/teachers/librarians/` (APA/MLA/Chicago citation text + the exact links a LibGuides page needs) and 15 video trailer scripts (5 bands, 10 pathways; shot list without people; QR ending) in `docs/outreach/education/video-specs.md` — spec documents only, no production.

**Effort:** ≈ 392 trilingual author-hours, 14–16 agent-days after approval.
