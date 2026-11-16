# Plan 62 — Testaments Browser (متصفح وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم وأثرهم ومراقدهم)

_Requested by the founder, 16 November 2026: "start working on متصفح وصايا الأنبياء والمرسلين والصالحين
والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم, where it should list all
the mentioned and written [testaments, legacies, relics and graves] that are in the Qur'an, the
seerah, the Sunnah, the Tabi'in's stories, quotes, mentioned and written in books that were harvested
and any future harvested book … add a box for it on the landing page and in navigation menus … full
detailed prose … ready for production." The verbatim request and the acceptance spec for production
validation are in `docs/engineering/54-wasaya-browser-requirements.md` (`WASAYA-R..` ids)._

## 1. What it is

A browser over the one graph that gathers what the museum's sources say about how the prophets and
messengers, the caliphs, the Companions, the Successors, the imams and the righteous took their
leave, in five topics:

| Topic (`wasaya-<topic>`) | Arabic | What it holds |
|---|---|---|
| `wasiyya` | الوصايا والعهود | testaments and parting counsels: the prophets to their sons, the Prophet's last counsels, the caliphs' covenants and counsels to their successors, written wills, and the rules of the bequest in the Qur'an and Sunnah |
| `ihtidar` | ساعة الاحتضار | the last illness and the deathbed: last words, who was present, how the books report the hour |
| `mirath` | التركات والمواريث | what was left: money, land, weapons, books, debts; heirs and executors; the Prophet's saying that the prophets are not inherited from |
| `athar` | الآثار المحفوظة | belongings kept after their owners (mantle, ring, sword, hair) and the traces the Qur'an names (the Ark, the Station of Ibrahim, Yusuf's shirt) |
| `marqad` | الدفن والمراقد | washing, shroud, funeral prayer and burial; graves, cemeteries, tombs and shrines; where reports differ on a grave's place |

It follows the architecture of the Qira'at, Magic, Dream and Cosmos Browsers
(`docs/plan/60-qiraat-browser.md`): there is no side table and no second list. Passages are ordinary
graph nodes; curated records carry the `wasaya-browser` tag. No class, kind, field or predicate was
added.

## 2. How records get in

`scripts/wasaya.ts` is the single definition, read by the site (`site/src/lib/wasaya.ts`), the API
export (`scripts/export-api.ts`) and the mining tool:

1. **The Qur'an — a reviewed table.** `WASAYA_QURAN_REFS` lists sura, first aya, last aya and topics;
   each row carries a comment, in the museum's own words, saying why the verse is there. Verse text is
   never searched by vocabulary and never typed.
2. **Every other passage — a guarded lexicon** over the passage's own text, search text, label and
   summary, folded (vowel marks dropped, alef forms joined, ta marbuta and final ya folded). Words
   open at a word boundary (so «خصوصية» is not «وصية»). Bare common words never match: a grave must be
   a named person's grave or an act of burial; inheritance must be a named person's estate or the
   Prophet's words on the prophets' inheritance; a relic must be named with its owner.
3. **Tags.** Any record carrying `wasaya-browser` is in; `wasaya-<section>` files it; `wasaya-<topic>`
   gives its chips. `WASAYA_EXCLUDE` removes a verified false positive.

A passage from a book harvested later therefore appears with no code change, in the corpus section
its work's genre decides.

## 3. Sections

Four corpora — `quran`, `sunnah`, `seerah`, `books` — and eight curated sections: `prophets`,
`caliphs`, `companions`, `successors` (Successors and the imams of the schools), `righteous` (later
scholars and ascetics, and the museum's concepts on death, the good end and the bequest), `legacy`
(estates, charitable lands, belongings, relics), `graves` (burial chambers, cemeteries, tombs,
shrines), `works` (books of testaments and of the dying, histories of the graves and of Medina). A
curated record without a section tag is filed by class: a place or building under `graves`, an object
under `legacy`, a work under `works`, anything else under `righteous`.

## 4. Pages

`/[lang]/wasaya/` (`site/src/pages/[lang]/wasaya/[...page].astro`), Arabic, English and Urdu:

- a header block inside `data-pagefind-body`: the founder's title, the lede, the status line (counts
  read from the graph at build time; says the texts are AI-written and unread by a human), the five
  topics defined, the method note, the API link;
- the signature view **"the five lines of the testament"** (`sig/WasayaLines.astro`): a line per
  topic, a seal per section sized by its count, every seal a link;
- a **timeline** of the dated curated records by century (`sig/WasayaTimeline.astro`);
- the sections, curated first, as cards (label, work and reference, topic chips, excerpt), paged when
  long, inside `data-pagefind-ignore`; a filter box that works on vowel-less Arabic; everything
  readable with JavaScript off.

The page has its own dress (this page only): a dark green leaf with a gold rule and round seals.
A box on the landing page (`Landing.astro`) and an Explore menu entry in the "people" group
(`site/src/lib/nav.ts`).

## 5. API and documentation

`/api/v1/wasaya.json` (`scripts/export-api.ts`): every record the page shows with `section`,
`topics`, `kind`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `date`, `wings`, `themes`, `tags` and
edges. Documented in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`. Test:
`scripts/features-api.test.ts`, "exports wasaya".

## 6. The curated layer (state on 16 November 2026)

91 new records, each with Arabic, English and Urdu prose (about 76,000 words of Arabic), written by
Sonnet writers from pages they read in the OCR library and from hadith passages in the graph; every
anchor is a scan page (or a printed volume and page where the OpenITI text carries them). 124 existing
records were tagged in place. 1,108 book excerpts (`passage/*-wasaya-*`, 37 books) and 738 hadith
passages (`scripts/harvest-wasaya-hadithapi.ts`, seven collections, each collection's book of wills in
full) were mined; with the passages already in the graph the detector lists 2,132 passages on
16 November 2026, 88 of them Qur'an verses.

**Prophets and messengers (19 new records):** `concept/awsani-personal-counsels-of-the-prophet` (The Prophet's personal counsels to individual Companions (awsani, awsini)); `event/abu-bakr-address-on-the-day-of-the-prophets-death` (Abu Bakr's address on the day of the Prophet's death, and what is reported of its day and hour); `event/burial-of-ibrahim-at-hebron` (Death and burial of Ibrahim at Hebron); `event/burial-of-yaqub-at-hebron` (Death of Yaqub in Egypt and his burial at Hebron); `event/counsels-of-luqman-to-his-son` (Luqman's counsels to his son and his reported sayings); `event/death-of-dawud-and-inheritance-of-sulayman` (Death of Dawud and Sulayman's inheritance from him); `event/death-of-sulayman-the-prophet` (Death of the prophet Sulayman (Solomon) and the staff eaten by the termite); `event/deaths-of-harun-and-musa` (Deaths of Harun and Musa in the Tih and the grave by the red dune); `event/farewell-admonition-reported-by-al-irbad` (The farewell-like admonition reported by al-Irbad ibn Sariya); `event/isa-charge-and-parting-night-with-disciples` (Isa's charge of prayer and almsgiving, his counsel to the disciples, and his being raised in the Sunni books); `event/parting-counsel-to-muadh-ibn-jabal` (The Prophet's parting counsel to Mu'adh ibn Jabal on sending him to Yemen); `event/prophets-counsel-on-copts-women-and-those-in-bondage` (The Prophet's counsel on the Copts, on women and on those in bondage); `event/prophets-last-counsels-in-final-illness` (The Prophet's last counsels in his final illness); `event/prophets-warning-about-graves-in-final-illness` (The Prophet's warning about graves in his final illness); `event/testament-of-adam-to-shith` (Testament of Adam to Shith and his death); `event/testament-of-ibrahim-and-yaqub-to-their-sons` (Testament of Ibrahim and Yaqub to their sons); `event/testament-of-nuh-to-his-son` (Testament of Nuh to his son); `event/testament-of-yusuf-and-his-remains` (Yusuf's charge about his remains and Musa carrying them out of Egypt); `event/zakariyya-prayer-and-killing-of-yahya` (Zakariyya's prayer for an heir, Yahya's five commands, and the reports of the deaths of Yahya and Zakariyya).

**Caliphs (16 new records):** `event/abu-bakr-ten-commands-to-yazid-and-usama-farewell` (Abu Bakr's ten commands to Yazid and his farewell to Usama's army); `event/deathbed-and-burial-of-abu-bakr` (Last hours, estate and burial of Abu Bakr); `event/deathbed-and-burial-of-umar` (Last days, washing, burial and estate of Umar); `event/deathbed-and-estate-of-salah-al-din` (Deathbed, burial and estate of Salah al-Din); `event/last-counsel-of-abd-al-malik-ibn-marwan` (Last counsel of Abd al-Malik ibn Marwan to al-Walid and his sons); `event/last-counsel-of-abu-bakr-to-umar` (Last counsel of Abu Bakr to Umar); `event/last-days-and-grave-of-harun-al-rashid-at-tus` (Last days and grave of Harun al-Rashid at Tus); `event/last-days-and-testament-of-umar-ibn-abd-al-aziz` (Last days, testament and grave of Umar ibn Abd al-Aziz); `event/last-days-and-testament-of-uthman` (Last days, testament and burial of Uthman at Hashsh Kawkab); `event/testament-and-grave-of-ali` (Testament, burial and grave of Ali ibn Abi Talib); `event/testament-of-abu-bakr-designating-umar` (Testament of Abu Bakr designating Umar); `event/testament-of-al-hasan-ibn-ali` (Testament and burial of al-Hasan ibn Ali); `event/testament-of-al-mamun-at-al-badandun` (Testament of al-Ma'mun at al-Badandun and his burial at Tarsus); `event/testament-of-al-mansur-to-al-mahdi` (Testament of al-Mansur to al-Mahdi and his hidden grave at Mecca); `event/testament-of-muawiya-ibn-abi-sufyan` (Testament and burial of Mu'awiya ibn Abi Sufyan); `event/testament-of-umar-after-the-stabbing` (Testament of Umar after the stabbing).

**Companions (24 new records):** `event/counsel-and-death-of-ubada-ibn-al-samit` (Ubada ibn al-Samit's counsel to his son on the decree, and his death in Palestine); `event/death-and-burial-of-abdullah-ibn-abbas-at-taif` (Death and burial of Abdallah ibn Abbas at Ta'if); `event/deathbed-and-burial-of-sad-ibn-muadh` (Last days, death and burial of Sad ibn Muadh after the Trench); `event/deathbed-and-testament-of-abdullah-ibn-umar` (Last illness and testament of Abdallah ibn Umar at Mecca); `event/deathbed-of-abu-al-darda` (Deathbed and counsels of Abu al-Darda' in Damascus); `event/deathbed-of-abu-hurayra` (The last illness and funeral instructions of Abu Hurayra); `event/deathbed-of-abu-musa-al-ashari` (The deathbed of Abu Musa al-Ash'ari, his instruction about his grave, and the differing reports of where he died); `event/deathbed-of-amr-ibn-al-as` (Deathbed of Amr ibn al-As in Egypt and his instructions for his burial); `event/deathbed-of-bilal-ibn-rabah` (Death of Bilal ibn Rabah in Syria and the differing reports on his grave); `event/deathbed-of-hudhayfa-ibn-al-yaman` (The deathbed of Hudhayfa ibn al-Yaman at al-Mada'in and his instruction about his shroud); `event/deathbed-of-khalid-ibn-al-walid` (Deathbed of Khalid ibn al-Walid and his bequest to Umar); `event/deathbed-of-muadh-ibn-jabal` (Deathbed of Mu'adh ibn Jabal in the plague of Amwas); `event/deathbed-of-saad-ibn-abi-waqqas` (Sa'd ibn Abi Waqqas, the bequest of a third, his death at al-Aqiq and burial in al-Baqi'); `event/deathbed-of-salman-al-farisi` (Deathbed of Salman al-Farisi at al-Mada'in); `event/estate-of-abd-al-rahman-ibn-awf` (The bequests, estate and burial of Abd al-Rahman ibn Awf); `event/last-message-of-sad-ibn-al-rabi-at-uhud` (Last message of Sad ibn al-Rabi at Uhud and what he left); `event/last-prayer-of-khubayb-ibn-adi` (The two rakas, words and verses of Khubayb ibn Adi before his killing); `event/testament-of-abdullah-ibn-masud` (The testament, last illness and estate of Abd Allah ibn Mas'ud); `event/testament-of-abu-ayyub-al-ansari` (Abu Ayyub al-Ansari's request to be buried in enemy land, and his grave at Constantinople); `event/testament-of-abu-ubayda-ibn-al-jarrah` (Testament and death of Abu Ubayda ibn al-Jarrah in the plague of Amwas); `event/testament-of-aisha-to-be-buried-in-al-baqi` (Testament and burial of Aisha in al-Baqi); `event/testament-of-al-zubayr-on-the-day-of-the-camel` (Al-Zubayr's testament to his son Abd Allah on the day of the Camel: his debts and estate); `event/testament-of-anas-ibn-malik` (Testament of Anas ibn Malik at Basra about the Prophet's hair and his washing); `event/testament-of-fatima-bint-muhammad` (Testament of Fatima bint Muhammad about her washing, bier and burial).

**Successors and imams (8 new records):** `event/deathbed-of-abu-hanifa` (Death, funeral and grave of Abu Hanifa at Baghdad); `event/deathbed-of-al-hasan-al-basri` (Deathbed and funeral of al-Hasan al-Basri); `event/deathbed-of-al-shafii` (Last illness, words to al-Muzani and burial of al-Shafi'i in Egypt); `event/deathbed-of-malik-ibn-anas` (Deathbed, shroud, estate and burial of Malik ibn Anas); `event/deathbed-of-said-ibn-al-musayyab` (Deathbed of Sa'id ibn al-Musayyab); `event/testament-of-ahmad-ibn-hanbal` (Testament, relic hairs, shroud and estate of Ahmad ibn Hanbal); `event/testament-of-al-rabi-ibn-khuthaym` (Testament and last days of al-Rabi' ibn Khuthaym); `event/testament-of-muhammad-ibn-sirin` (Testament, debts and death of Muhammad ibn Sirin).

**The righteous and scholars (6 new records):** `event/death-and-burial-of-al-ghazali-at-tabaran` (Death and burial of al-Ghazali at al-Tabaran); `event/death-and-funeral-of-ibn-taymiyya-in-the-damascus-citadel` (Death and funeral of Ibn Taymiyya in the Damascus citadel); `event/deathbed-of-abd-allah-ibn-al-mubarak-at-hit` (Deathbed of Abd Allah ibn al-Mubarak at Hit); `event/deathbed-of-al-junayd-at-baghdad` (Deathbed of al-Junayd at Baghdad and burial at the Shuniziyya); `event/last-counsels-and-death-of-al-fudayl-ibn-iyad` (Last counsels and death of al-Fudayl ibn Iyad at Mecca); `event/last-days-and-grave-of-al-bukhari-at-khartank` (Last days of al-Bukhari at Khartank: his prayer, his shroud and his grave).

**Legacies and relics (10 new records):** `concept/belongings-of-the-prophet-kept-by-the-companions` (Belongings of the Prophet kept by the Companions after him); `concept/charitable-lands-of-the-prophet` (The Prophet's charitable lands: Banu al-Nadir, Khaybar and Fadak); `concept/estate-of-the-prophet` (What the Prophet left at his death); `concept/household-of-the-prophet-after-his-death` (The Prophet's household after him: the wives' maintenance and houses); `concept/prophets-leave-no-inheritance` (The prophets leave no inheritance: 'We are not inherited from; what we leave is charity'); `concept/weapons-mounts-and-belongings-of-the-prophet` (The Prophet's weapons, mounts and belongings as the sira books list them); `object/burda-of-kab-ibn-zuhayr` (The mantle (burda) given to Ka'b ibn Zuhayr); `object/hair-of-the-prophet` (The Prophet's hair); `object/shirt-of-yusuf` (The shirt of Yusuf sent to his father, and the report that it was Ibrahim's shirt); `object/tabut-bani-israil` (The Ark (tabut) of the Israelites and the remnant of the house of Musa and the house of Harun).

**Graves (4 new records):** `building/al-hujra-al-nabawiyya` (The Prophet's chamber (al-Hujra): 'A'isha's room and the graves of the Prophet and his two companions); `concept/companions-and-household-buried-at-al-baqi` (Companions and members of the Prophet's household buried at al-Baqi'); `concept/companions-buried-at-bab-al-saghir-damascus` (Companions buried in the Bab al-Saghir cemetery, Damascus); `concept/graves-of-the-prophets` (The graves of the prophets: what the hadith establish and what the books attribute).

**Books (4 new records):** `concept/kitab-al-wasaya-in-the-hadith-collections` (The Book of Wills (Kitab al-Wasaya) in the hadith collections); `work/al-thabat-inda-al-mamat-ibn-al-jawzi` (Al-Thabat 'inda al-Mamat by Ibn al-Jawzi); `work/kitab-al-muhtadarin-ibn-abi-al-dunya` (Kitab al-Muhtadarin by Ibn Abi al-Dunya); `work/wasaya-al-ulama-ibn-zabr` (Wasaya al-Ulama' attributed to Ibn Zabr).

## 7. Scope decisions (made by the agent, recorded here for the founder's audit)

Filed in `docs/decisions/inbox/wasaya-browser-scope.yaml`.

1. **Five topics, not one.** The founder's title names four things (testaments before death, what was
   left, relics, graves). The sources tell them together with the deathbed itself, so `ihtidar` is a
   fifth topic. Reversible: remove a topic from `WASAYA_TOPICS`.
2. **The jurists' general rules of inheritance stay out of the lexicon.** «مورثاتهم» is read as what
   these people left, not the law of shares: the lexicon takes the estates of named people and the
   Prophet's words on the prophets' inheritance; `concept/mirath` and `concept/tarika-estate` are
   tagged as entry points, and the rules of the bequest itself (the word «وصية») are kept. Without
   this the Muwatta's book of shares alone added about 70 passages of pure law. Reversible: one line
   in `AR_MIRATH`.
3. **Graves are attributed, never asserted.** Many shrines of prophets and Companions are attributed
   by local tradition. The browser lists the museum's existing records for them and every new record
   states who makes the identification. No ruling on visiting graves or on relics is given; those
   questions live in their own records with their perspectives.
4. **Sunni sources are the frame.** Three books on the harvest drive that are not Sunni sources
   (`kamil-ziyarat`, `nuzhat-ghari-najaf`, `musawat-atabat`) were not mined. Where a Sunni historian
   reports a differing identification (for example of the grave of 'Ali), it is given as that
   historian's report.
5. **Two draft work cards were not tagged.** `work/kitab-al-wasiyyah` and `work/al-wasiya-al-jamia` are
   preliminary cards with unchecked sources; they join when they are written.
6. **Existing records were tagged in place, not rewritten** (124 records: deaths, tombs,
   cemeteries, relics, concepts, works). Their prose was left as their authors wrote it.

## 8. Known limits and next waves

Stated by the writers, checked against their reports; nothing below was written from memory.

- **Ibn Sa'd.** The scan of al-Tabaqat al-Kubra on the harvest drive holds only five 44-page samples;
  his reports are cited through Ibn Kathir, Ibn Hajar, al-Dhahabi, al-Salihi and Ibn al-Athir, or from
  the OpenITI text where it carries printed volume and page. A full OCR of Ibn Sa'd is the first next
  step: it holds the fullest testament, estate and burial sections for the Prophet, the caliphs and
  the Companions.
- **Al-Tabari.** The scans cover roughly 97–130 AH and 225–262 AH only; the testaments of Mu'awiya,
  'Abd al-Malik, al-Mansur, Harun and al-Ma'mun are given through Ibn Kathir and al-Dhahabi.
- **Not found on any page read, and therefore left out (each record says so):** Musa's last address;
  Abu Hanifa's instruction about the land of his grave; al-Shafi'i's written testament (al-Dhahabi
  calls the one in circulation unsound); 'Umar ibn 'Abd al-'Aziz's letter to Yazid at his death; Salah
  al-Din's counsel to his son al-Zahir; a written testament of Harun al-Rashid; Ibn al-Jawzi's report
  of al-Ghazali's last morning (al-Muntazam for 505 AH is not on the drive); the staff buried with
  Anas; Ibn 'Umar's endowments; the estates of the Mothers of the Believers; the graves of Mu'adh, Abu
  al-Darda', Salman, Dawud and Sulayman.
- **Cited at second hand:** reports of Sahih Muslim, the Sunan and the Musnad that are not passage
  records are cited through the book that quotes them (Fath al-Bari, Ibn Kathir, Ibn Rajab), never by
  a hadith number that was not read.
- **Books not mined:** Siyar A'lam al-Nubala' and Tadhkirat al-Huffaz have no `work/` record yet.
  Kitab al-Muhtadarin, al-Thabat 'inda al-Mamat and Wasaya al-'Ulama' are described only from the title
  lists that mention them; acquiring and OCR'ing them, and the missing volumes of al-Muntazam and
  al-Tabari, is the second next step.
- **Not written in this wave:** Sufyan al-Thawri, al-Awza'i, Nur al-Din, Umm Salama, Zaynab bint
  Jahsh, Abu Talha, Asma' bint Abi Bakr, al-Nawawi, 'Abd al-Qadir al-Jilani and the later imams.
- **Thin existing records the writers reported and did not edit:** `object/kisa-al-nabi`,
  `object/naal-al-nabi`, `object/qadah-al-nabi`, `object/khatam-al-nabi`, `object/sayf-al-nabi`,
  `event/green-dome-collapse`, `event/last-minbar-sermon`, `event/death-of-nur-al-din-569`,
  `place/al-rawda-al-sharifa`; and `person/fatima-bint-abd-al-malik` is described as a Companion,
  which the Umayyad sources do not support (reported to the founder, not changed here).
- **OCR.** Excerpts and anchors come from machine-read scans; several books have column-scrambled
  pages (Siyar scan 1, al-Isaba), and the writers used only what read clearly.
- **No human has read the records.** The site build and the full test suite were not run locally for
  this change; the page was checked on the development server in the three languages.
