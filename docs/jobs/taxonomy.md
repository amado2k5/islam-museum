# Job Browser: taxonomy with holder counts (Phase 0 census, 1 November 2026)

Generated from [`taxonomy.yaml`](taxonomy.yaml) against `data/person/` on `origin/main` at `cc4ec8eeec`. Do not hand-edit this table; Phase 1 adds `scripts/report/jobs-census.ts` to regenerate it, and until then the census script in the master plan's section 2 is the method.

- **Holders from roles**: persons whose `roles:` list contains a string the merge map sends to this job. One person can count under several jobs.
- **Prose leads**: persons *not* counted as holders whose Arabic summary or Arabic prose contains one of the job's Arabic stems (`ar_keys`). A nisba such as الحدّاد or الصائغ is also a surname, so a lead is a record to read, never a holder. Leads are what the Phase 3 sweep opens first.

## Domains

| Domain | Jobs | Holders from roles |
|---|---:|---:|
| Governance & Law (`governance-law`) | 23 | 2856 |
| Court & Administration (`court-administration`) | 10 | 183 |
| Scholarship & Teaching (`scholarship-teaching`) | 15 | 4079 |
| Faith & Preaching (`faith-preaching`) | 10 | 265 |
| Medicine & Care (`medicine-care`) | 10 | 102 |
| Sciences & Numbers (`sciences-numbers`) | 11 | 131 |
| Arts & Letters (`arts-letters`) | 12 | 2066 |
| Building & Making (`building-making`) | 17 | 11 |
| Trade, Travel & the Sea (`trade-travel-sea`) | 13 | 75 |
| War & Command (`war-command`) | 7 | 260 |
| Media & Performance (`media-performance`) | 12 | 340 |
| Sport (`sport`) | 6 | 238 |
| Patronage & Public Life (`patronage-public-life`) | 4 | 210 |
| Land & Water (`land-water`) *proposed* | 7 | 1 |

Total: 157 jobs. 94 have at least one holder from the roles bootstrap; 63 have none yet and start from their prose leads and their sources.

## The first ten, by the first listed period of each holder

The Timeline Explorer's periods, left to right. "none" is a holder with no `periods:` value.

| Job | pre-islamic-arabia | prophetic-era | rashidun | umayyad | abbasid-early | abbasid-fragmentation | buyid-seljuk-fatimid-era | crusades-ayyubid-mamluk | mongol-post-mongol | gunpowder-empires | colonial-era | modern-era | contemporary-era | none |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Qadi (judge) | 0 | 0 | 0 | 2 | 15 | 7 | 21 | 18 | 17 | 26 | 0 | 1 | 0 | 17 |
| Vizier | 0 | 0 | 0 | 0 | 5 | 4 | 26 | 30 | 13 | 31 | 10 | 3 | 0 | 13 |
| Hadith scholar (muhaddith) | 0 | 8 | 0 | 23 | 69 | 8 | 20 | 66 | 15 | 14 | 3 | 0 | 12 | 14 |
| Teacher (mu'allim / mudarris) | 0 | 0 | 1 | 1 | 2 | 2 | 37 | 18 | 27 | 25 | 1 | 1 | 2 | 215 |
| Physician (tabib) | 0 | 1 | 0 | 0 | 2 | 4 | 6 | 16 | 9 | 7 | 0 | 1 | 0 | 53 |
| Astronomer | 0 | 0 | 0 | 0 | 3 | 3 | 9 | 3 | 6 | 1 | 1 | 0 | 0 | 9 |
| Calligrapher (khattat) | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 16 | 8 | 52 | 8 | 15 | 2 | 6 |
| Copyist (warraq / nasikh) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Architect (mi'mar) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 6 | 0 | 0 | 0 | 4 |
| Merchant (tajir) | 0 | 6 | 0 | 0 | 1 | 0 | 3 | 1 | 4 | 1 | 0 | 0 | 0 | 36 |

## Jobs

| Job | Domain | Kind | Holders from roles | Prose leads (not yet holders) |
|---|---|---|---:|---:|
| `job/ruler` Ruler (الحاكم) | governance-law | office | 824 | 0 |
| `job/caliph` Caliph (الخليفة) | governance-law | office | 29 | 0 |
| `job/sultan` Sultan (السلطان) | governance-law | office | 194 | 0 |
| `job/emir` Emir (الأمير) | governance-law | office | 120 | 0 |
| `job/king` King (الملك) | governance-law | office | 2 | 0 |
| `job/khan` Khan (الخان) | governance-law | office | 3 | 0 |
| `job/shah` Shah (الشاه) | governance-law | office | 0 | 72 |
| `job/wali` Governor (wali) (الوالي) | governance-law | office | 22 | 402 |
| `job/regent` Regent (الوصي على العرش) | governance-law | office | 10 | 0 |
| `job/tribal-chief` Tribal chief (سيد القبيلة) | governance-law | office | 31 | 8 |
| `job/hakam` Arbiter (hakam) (الحَكَم) | governance-law | office | 1 | 25 |
| `job/qadi` Qadi (judge) (القاضي) **[first 10]** | governance-law | office | 124 | 674 |
| `job/qadi-al-qudat` Chief judge (qadi al-qudat) (قاضي القضاة) | governance-law | office | 0 | 66 |
| `job/kazasker` Kazasker (chief military judge) (قاضي العسكر) | governance-law | office | 1 | 16 |
| `job/mufti` Mufti (المفتي) | governance-law | religious | 21 | 184 |
| `job/shaykh-al-islam` Shaykh al-Islam (شيخ الإسلام) | governance-law | office | 7 | 89 |
| `job/muhtasib` Muhtasib (market inspector) (المحتسب) | governance-law | office | 0 | 22 |
| `job/sahib-al-shurta` Chief of police (sahib al-shurta) (صاحب الشرطة) | governance-law | office | 0 | 72 |
| `job/faqih` Jurist (faqih) (الفقيه) | governance-law | scholarly | 800 | 216 |
| `job/notary-witness` Notary witness (shahid adl) (الشاهد العدل) | governance-law | office | 0 | 8 |
| `job/lawyer` Lawyer (المحامي) | governance-law | modern-profession | 27 | 29 |
| `job/diplomat` Diplomat / envoy (السفير) | governance-law | office | 34 | 35 |
| `job/politician` Politician (السياسي) | governance-law | modern-profession | 606 | 187 |
| `job/vizier` Vizier (الوزير) **[first 10]** | court-administration | office | 135 | 268 |
| `job/grand-vizier` Grand vizier (الصدر الأعظم) | court-administration | office | 16 | 136 |
| `job/katib` Chancery secretary (katib) (الكاتب) | court-administration | office | 6 | 45 |
| `job/hajib` Chamberlain (hajib) (الحاجب) | court-administration | office | 0 | 67 |
| `job/treasurer` Treasurer (صاحب بيت المال) | court-administration | office | 0 | 44 |
| `job/amil` Tax collector (amil) (العامل) | court-administration | office | 0 | 64 |
| `job/sahib-al-barid` Postmaster (sahib al-barid) (صاحب البريد) | court-administration | office | 0 | 35 |
| `job/nazir-al-waqf` Waqf administrator (nazir) (ناظر الوقف) | court-administration | office | 0 | 12 |
| `job/courtier` Courtier (nadim) (النديم) | court-administration | office | 3 | 369 |
| `job/translator` Translator (المترجم) | court-administration | scholarly | 23 | 22 |
| `job/alim` Religious scholar (alim) (العالم) | scholarship-teaching | scholarly | 3063 | 0 |
| `job/muhaddith` Hadith scholar (muhaddith) (المحدّث) **[first 10]** | scholarship-teaching | scholarly | 252 | 851 |
| `job/mufassir` Qur'an exegete (mufassir) (المفسّر) | scholarship-teaching | scholarly | 21 | 195 |
| `job/mutakallim` Theologian (mutakallim) (المتكلّم) | scholarship-teaching | scholarly | 87 | 67 |
| `job/philosopher` Philosopher (الفيلسوف) | scholarship-teaching | scholarly | 52 | 108 |
| `job/grammarian` Grammarian (nahwi) (النحوي) | scholarship-teaching | scholarly | 31 | 231 |
| `job/lexicographer` Lexicographer (صاحب المعجم) | scholarship-teaching | scholarly | 4 | 24 |
| `job/historian` Historian (المؤرّخ) | scholarship-teaching | scholarly | 197 | 909 |
| `job/nassab` Genealogist (nassab) (النسّاب) | scholarship-teaching | scholarly | 1 | 37 |
| `job/teacher` Teacher (mu'allim / mudarris) (المدرّس) **[first 10]** | scholarship-teaching | scholarly | 332 | 638 |
| `job/professor` University professor (الأستاذ الجامعي) | scholarship-teaching | modern-profession | 12 | 792 |
| `job/librarian` Librarian (khazin al-kutub) (خازن الكتب) | scholarship-teaching | office | 0 | 9 |
| `job/orientalist` Orientalist (المستشرق) | scholarship-teaching | modern-profession | 9 | 14 |
| `job/social-scientist` Social scientist (عالم الاجتماع) | scholarship-teaching | modern-profession | 6 | 213 |
| `job/economist` Economist (الاقتصادي) | scholarship-teaching | modern-profession | 12 | 74 |
| `job/imam` Imam (prayer leader) (الإمام) | faith-preaching | religious | 14 | 75 |
| `job/khatib` Khatib (Friday preacher) (الخطيب) | faith-preaching | religious | 4 | 113 |
| `job/muezzin` Muezzin (المؤذّن) | faith-preaching | religious | 0 | 29 |
| `job/preacher` Preacher (wa'iz / da'iya) (الواعظ) | faith-preaching | religious | 170 | 139 |
| `job/dai` Missionary (da'i) (الداعي) | faith-preaching | religious | 13 | 120 |
| `job/qass` Storyteller-preacher (qass) (القاصّ) | faith-preaching | religious | 0 | 14 |
| `job/qari` Qur'an reciter (qari / muqri) (القارئ) | faith-preaching | religious | 54 | 377 |
| `job/sufi-shaykh` Sufi shaykh (murshid) (الشيخ المرشد) | faith-preaching | religious | 9 | 35 |
| `job/sadin` Custodian of a sanctuary (sadin) (السادن) | faith-preaching | religious | 0 | 7 |
| `job/monk-priest` Monk / priest (الراهب) | faith-preaching | religious | 1 | 647 |
| `job/physician` Physician (tabib) (الطبيب) **[first 10]** | medicine-care | medical | 99 | 660 |
| `job/surgeon` Surgeon (jarrah) (الجرّاح) | medicine-care | medical | 0 | 70 |
| `job/kahhal` Oculist (kahhal) (الكحّال) | medicine-care | medical | 0 | 3 |
| `job/pharmacist` Pharmacist (saydalani) (الصيدلاني) | medicine-care | medical | 0 | 21 |
| `job/hajjam` Cupper (hajjam) (الحجّام) | medicine-care | medical | 0 | 4 |
| `job/midwife` Midwife (qabila) (القابلة) | medicine-care | medical | 0 | 0 |
| `job/wet-nurse` Wet-nurse (الظِّئر) | medicine-care | service | 1 | 15 |
| `job/nurse` Nurse (الممرّض) | medicine-care | modern-profession | 1 | 101 |
| `job/dentist` Dentist (طبيب الأسنان) | medicine-care | modern-profession | 1 | 10 |
| `job/baytar` Veterinarian (baytar) (البيطار) | medicine-care | medical | 0 | 9 |
| `job/astronomer` Astronomer (الفلكي) **[first 10]** | sciences-numbers | scholarly | 35 | 92 |
| `job/astrologer` Astrologer (munajjim) (المنجّم) | sciences-numbers | scholarly | 0 | 39 |
| `job/muwaqqit` Mosque timekeeper (muwaqqit) (الموقّت) | sciences-numbers | religious | 0 | 7 |
| `job/mathematician` Mathematician (الرياضي) | sciences-numbers | scholarly | 29 | 241 |
| `job/engineer` Engineer (muhandis) (المهندس) | sciences-numbers | scholarly | 30 | 40 |
| `job/chemist` Alchemist / chemist (الكيميائي) | sciences-numbers | scholarly | 3 | 35 |
| `job/physicist` Physicist (الفيزيائي) | sciences-numbers | modern-profession | 5 | 28 |
| `job/life-scientist` Life scientist (عالم الأحياء) | sciences-numbers | modern-profession | 8 | 49 |
| `job/geographer` Geographer (الجغرافي) | sciences-numbers | scholarly | 18 | 27 |
| `job/cartographer` Cartographer (رسّام الخرائط) | sciences-numbers | craft | 1 | 10 |
| `job/astronaut` Astronaut (رائد الفضاء) | sciences-numbers | modern-profession | 2 | 12 |
| `job/poet` Poet (الشاعر) | arts-letters | artistic | 659 | 294 |
| `job/rawi` Poetry transmitter (rawi) (الراوية) | arts-letters | artistic | 0 | 57 |
| `job/adib` Man of letters (adib) (الأديب) | arts-letters | artistic | 8 | 516 |
| `job/writer` Writer / author (الكاتب المؤلّف) | arts-letters | modern-profession | 1282 | 1189 |
| `job/calligrapher` Calligrapher (khattat) (الخطّاط) **[first 10]** | arts-letters | craft | 109 | 13 |
| `job/copyist` Copyist (warraq / nasikh) (الورّاق) **[first 10]** | arts-letters | craft | 0 | 74 |
| `job/illuminator` Illuminator (mudhahhib) (المذهّب) | arts-letters | craft | 1 | 9 |
| `job/musawwir` Painter (musawwir) (المصوّر) | arts-letters | craft | 2 | 62 |
| `job/bookbinder` Bookbinder (mujallid) (المجلّد) | arts-letters | craft | 0 | 1 |
| `job/papermaker` Papermaker (kaghadi) (الكاغدي) | arts-letters | craft | 0 | 2 |
| `job/visual-artist` Visual artist (الفنان التشكيلي) | arts-letters | modern-profession | 0 | 0 |
| `job/photographer` Photographer (المصوّر الضوئي) | arts-letters | modern-profession | 5 | 0 |
| `job/architect` Architect (mi'mar) (المعمار) **[first 10]** | building-making | craft | 11 | 23 |
| `job/builder` Builder / mason (banna) (البنّاء) | building-making | craft | 0 | 56 |
| `job/carpenter` Carpenter (najjar) (النجّار) | building-making | craft | 0 | 68 |
| `job/blacksmith` Blacksmith (haddad) (الحدّاد) | building-making | craft | 0 | 32 |
| `job/goldsmith` Goldsmith (sa'igh) (الصائغ) | building-making | craft | 0 | 17 |
| `job/coppersmith` Coppersmith / metalworker (النحّاس) | building-making | craft | 0 | 46 |
| `job/armourer` Armourer / swordsmith (صانع السلاح) | building-making | craft | 0 | 21 |
| `job/instrument-maker` Instrument maker (asturlabi) (الأسطرلابي) | building-making | craft | 0 | 5 |
| `job/potter` Potter / tilemaker (الخزّاف) | building-making | craft | 0 | 8 |
| `job/glassmaker` Glassmaker (zajjaj) (الزجّاج) | building-making | craft | 0 | 10 |
| `job/weaver` Weaver (ha'ik / nassaj) (الحائك) | building-making | craft | 0 | 16 |
| `job/tailor` Tailor (khayyat) (الخيّاط) | building-making | craft | 0 | 30 |
| `job/dyer` Dyer (sabbagh) (الصبّاغ) | building-making | craft | 0 | 12 |
| `job/tanner` Tanner / leatherworker (الدبّاغ) | building-making | craft | 0 | 17 |
| `job/baker` Baker (khabbaz) (الخبّاز) | building-making | craft | 0 | 7 |
| `job/butcher` Butcher (jazzar / qassab) (الجزّار) | building-making | craft | 0 | 15 |
| `job/cook` Cook (tabbakh) (الطبّاخ) | building-making | service | 0 | 4 |
| `job/merchant` Merchant (tajir) (التاجر) **[first 10]** | trade-travel-sea | commercial | 52 | 107 |
| `job/attar` Perfumer / druggist (attar) (العطّار) | trade-travel-sea | commercial | 0 | 29 |
| `job/sarraf` Money-changer / banker (sarraf) (الصيرفي) | trade-travel-sea | commercial | 3 | 12 |
| `job/dallal` Broker (dallal / simsar) (الدلّال) | trade-travel-sea | commercial | 0 | 5 |
| `job/slave-dealer` Slave dealer (nakhkhas) (النخّاس) | trade-travel-sea | commercial | 0 | 5 |
| `job/caravan-leader` Caravan leader (قائد القافلة) | trade-travel-sea | commercial | 0 | 15 |
| `job/guide` Desert guide (dalil / khirrit) (الدليل) | trade-travel-sea | service | 2 | 19 |
| `job/mutawwif` Pilgrim guide (mutawwif) (المطوّف) | trade-travel-sea | service | 0 | 1 |
| `job/ship-captain` Ship captain (rubban / nakhuda) (الربّان) | trade-travel-sea | commercial | 1 | 12 |
| `job/sailor` Sailor (bahhar) (البحّار) | trade-travel-sea | service | 0 | 43 |
| `job/pearl-diver` Pearl diver (ghawwas) (الغوّاص) | trade-travel-sea | craft | 0 | 16 |
| `job/traveller` Traveller (rahhala) (الرحّالة) | trade-travel-sea | scholarly | 17 | 107 |
| `job/porter` Porter (hammal) (الحمّال) | trade-travel-sea | service | 0 | 5 |
| `job/commander` Military commander (qa'id) (القائد) | war-command | military | 243 | 116 |
| `job/soldier` Soldier / warrior (الجندي) | war-command | military | 12 | 69 |
| `job/admiral` Admiral (amir al-bahr / kapudan) (أمير البحر) | war-command | military | 3 | 37 |
| `job/corsair` Corsair (sea ghazi) (الغازي البحري) | war-command | military | 2 | 2 |
| `job/ghazi` Frontier warrior (ghazi / murabit) (الغازي المرابط) | war-command | military | 0 | 114 |
| `job/mamluk` Military slave (mamluk / ghulam) (المملوك) | war-command | military | 0 | 31 |
| `job/janissary` Janissary (yeniçeri) (الإنكشاري) | war-command | military | 0 | 18 |
| `job/musician` Musician (الموسيقي) | media-performance | artistic | 63 | 169 |
| `job/composer` Composer / songwriter (الملحّن) | media-performance | artistic | 29 | 3 |
| `job/singer` Singer (المغنّي) | media-performance | artistic | 50 | 73 |
| `job/actor` Actor (الممثّل) | media-performance | modern-profession | 43 | 48 |
| `job/jester` Jester / wit (المضحك) | media-performance | artistic | 4 | 83 |
| `job/comedian` Comedian (الكوميدي) | media-performance | modern-profession | 9 | 5 |
| `job/hakawati` Storyteller (hakawati) (الحكواتي) | media-performance | artistic | 0 | 4 |
| `job/film-director` Film director (المخرج) | media-performance | modern-profession | 21 | 8 |
| `job/producer` Producer (المنتج) | media-performance | modern-profession | 25 | 20 |
| `job/screenwriter` Screenwriter (كاتب السيناريو) | media-performance | modern-profession | 9 | 3 |
| `job/journalist` Journalist / editor (الصحفي) | media-performance | modern-profession | 57 | 133 |
| `job/presenter` Broadcaster / presenter (المذيع) | media-performance | modern-profession | 30 | 44 |
| `job/athlete` Athlete (الرياضي) | sport | modern-profession | 228 | 88 |
| `job/wrestler` Wrestler (pehlivan) (المصارع) | sport | artistic | 4 | 22 |
| `job/archer` Archer (rami) (الرامي) | sport | military | 1 | 14 |
| `job/horseman` Horseman (faris / furusiyya) (الفارس) | sport | military | 0 | 21 |
| `job/coach` Coach (المدرّب) | sport | modern-profession | 2 | 28 |
| `job/sports-administrator` Sports administrator (الإداري الرياضي) | sport | modern-profession | 3 | 1 |
| `job/patron` Patron (الراعي) | patronage-public-life | office | 20 | 30 |
| `job/waqif` Waqf founder (waqif) (الواقف) | patronage-public-life | office | 0 | 56 |
| `job/philanthropist` Philanthropist (المحسن) | patronage-public-life | modern-profession | 12 | 66 |
| `job/activist` Activist (الناشط) | patronage-public-life | modern-profession | 178 | 19 |
| `job/farmer` Farmer (fallah) (الفلاح) | land-water | craft | 1 | 77 |
| `job/herder` Herder (ra'i) (الراعي للماشية) | land-water | craft | 0 | 7 |
| `job/gardener` Gardener (bustani) (البستاني) | land-water | craft | 0 | 14 |
| `job/muqanni` Qanat digger / water master (muqanni) (المقنّي) | land-water | craft | 0 | 552 |
| `job/fisherman` Fisherman / hunter (sayyad) (الصيّاد) | land-water | craft | 0 | 41 |
| `job/falconer` Falconer (bayzar) (البيزار) | land-water | craft | 0 | 3 |
| `job/camel-driver` Camel driver (jammal) (الجمّال) | land-water | service | 0 | 57 |
