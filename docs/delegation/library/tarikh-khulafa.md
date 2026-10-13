# Library lane: Tarikh al-Khulafa — al-Suyuti (caliphal biographies)

**Book:** تاريخ الخلفاء — جلال الدين عبد الرحمن بن أبي بكر السيوطي (ت 911هـ). Chronological caliph biographies Abu Bakr → the author's own day, each entry mixing accession/incidents/deaths of notables.
**Book id:** `tarikh-khulafa` · category `tareekh` · branch `content/lib-futuh-buldan` (same lane branch) · stubs `data/_stubs.d/lib-futuh-buldan.yaml`.

**Edition and item used:** `raw/library/tareekh/tarikh-khulafa/20231228_20231228_2028.pdf` — **الطبعة الثانية المصححة المنقحة، دار المنهاج جدة بالتعاون مع دار الأوقاف للنشرون الإسلامية (قطر)، 1434هـ/2013م، إشراف محمد عثمان نصوح الحسيني، ISBN 978-9953-498-19-5, 864 pp**, based on six manuscripts incl. two in the author's students' hands. Three other scans exist in `raw/library/tareekh/tarikh-khulafa/` (AAlexandrina-033479, -140625, -163451, ~372pp each — likely different printings). OCR via `ocr_apple_vision.py` under miniconda python (system python3 lacks ocrmac) into `books/tareekh/tarikh-khulafa/20231228_20231228_2028/` — done 864 pages in 412s.

**Book structure:** front matter + manuscript plates to ~p64; Suyuti's خطبة الكتاب at p65; a miscellany on the imamate/khilafa hadiths and notes (~pp. 65–92) incl. the twelve-caliphs reports and the Fatimid-lineage anecdotes; then per-caliph entries beginning Abu Bakr (~p93+).

**Plan:** bounded batches by caliph. Extraction emphasis — accession/bay'a events, reign-length and death details, distinctive anecdotes, administrative acts — NOT the hadith corpus (largely covered by seerah/jami lanes). Reuse existing caliph entities (`person/abu-bakr`, `person/umar-ibn-al-khattab`, …) and enrich; create `event` entities for accessions/deaths where missing. Citations to printed page numbers (printed = PDF page, verify).

**Flags:** the edition prints honorifics — never typed into entities. Suyuti compiles from Bukhari/Muslim/Tabari/Ibn al-Athir — reuse existing entities aggressively.

## Done

- **Batch TK-1** (pp. 93–105 — miscellany + Abu Bakr opening): 5 `work` entities (caliph histories: Naftawayh, al-Suli's Awraq, Ibn al-Jawzi, Ibn Abi Tahir, Abu Musa Harun); 4 persons; `concept/quraysh-clan-offices` (siqaya/rifada, hijaba/liwa'/nadwa, Abu Bakr's diya).

- **Batch TK-2** (pp. 148–168 — Abu Bakr's caliphate/death): `event/compilation-of-quran` (Zayd's account), `event/death-of-abu-bakr` (khazira poison, the returned liqha/jafna/qatifa), `event/abu-bakr-naq-sortie` (Ali's halter, Khalid's five-pillar commission); persons al-harith-ibn-kalada, khuzayma-ibn-thabit.

- (12 Oct 2026) Lane opened; edition identified; OCR complete (864 pp, 412s); `source/tarikh-khulafa-minhaj-1434`, `work/tarikh-al-khulafa`, `person/al-suyuti` created.

- **Batch TK-13** (pp. 405–413 — last Umayyads): new `person/al-walid-ibn-yazid` (Mushaf-shooting, Pharaoh hadith), `event/killing-of-al-walid-ii` (Yazid III's throne speech), `event/death-of-yazid-iii` (7 Dhu'l-Hijja 126), `person/ibrahim-ibn-al-walid` (forged deed, 70 nights, Saffah massacre), `event/marwan-exhumes-yazid`; enriched `person/yazid-ibn-al-walid` (quadruple royal descent verse, throne programme, Ghaylan circle), `battle-of-al-zab`, `killing-of-marwan-ibn-muhammad` (Busir, the cat-tongue anecdote).

- **Batch TK-12** (pp. 399–403 — Yazid II + Hisham): new `person/yazid-ibn-abd-al-malik`, `event/death-of-yazid-ibn-abd-al-malik` (late Sha'ban 105), `event/yazid-ii-forty-days` (the forty-day sira reversal), `person/abdallah-al-battal`, `event/hisham-conquests` (Caesarea y7, Khanjara y8 by al-Battal, Kharshana y12); enriched `killing-of-yazid-ibn-al-muhallab` (al-Aqr, Kalbi's "كربلاء الدين والعقّر الكرم") and `death-of-hisham-ibn-abd-al-malik` (Rabi' II 125, the forty-qasama avarice, Rusafa).

- **Batch TK-11** (pp. 370–398 — Sulayman + Umar II): enriched `caliphate-of-umar-ibn-abd-al-aziz` (sealed-letter succession, mount refusal, "لست بقاض") and `death-of-sulayman-ibn-abd-al-malik` (Dabiq, 10 Safar 99, mirror anecdote, Ibn Sirin's verdict); new `event/death-of-umar-ibn-abd-al-aziz` (poison, Dayr Sim'an, Rajab 101), `event/umar-ii-ends-sabb-ali` (khutba reform, quran-16-90 link), `event/umar-ii-returns-fadak`, `event/jarrah-khurasan-justice-letter` ("العدل والحق لا السيف والسوط"); new `person/raja-ibn-haywa`, `person/ghaylan-al-dimashqi` (Qadari crucifixion under Hisham).

- **Batch TK-10** (pp. 360–369 — Abd al-Malik's character + al-Walid): `building/umayyad-mosque`, `event/building-umayyad-mosque` (87H), `event/walid-welfare-decrees` (orphans' tutors, guides for the blind, anti-begging stipends); enriched `walid-rebuilds-the-prophets-mosque` and `death-of-walid-ibn-abd-al-malik` (mid Jumada II 96, age 51, Dhahabi's jihad-era verdict).

- **Batch TK-9** (pp. 348–359 — Ibn al-Zubayr + Abd al-Malik): `event/ibn-al-zubayr-rebuilds-kaba` (two doors on Ibrahim's foundations), `event/death-of-ibn-al-zubayr` (Hajjaj's siege, crucifixion 73, Abu Qubays lightning), `event/killing-of-amr-al-ashdaq` (Ibn al-Kalbi's "first ghadr"), `event/hajjaj-seals-medinese`, `event/marwan-caliphate` (Dhahabi's legitimacy verdict); enriched `abd-al-malik-coinage` (tawamir threat, Khalid ibn Yazid's counsel, dinar inscriptions) and `death-of-abd-al-malik` (Shawwal 86, 17 sons, plague of girls).

- **Batch TK-8** (pp. 339–347 — Yazid + Muawiya II): `event/waqat-al-harra` (Ibn Hanzala's charge, 306 nobles, the pillage), `event/siege-of-ibn-al-zubayr-64` (mangonels, the Ka'ba fire incl. Ishmael's ram horns, "إن طاغيتكم قد هلك"), `event/death-of-yazid-ibn-muawiya`, `event/caliphate-of-muawiya-ii` ("ما أصبت من حلاوتها"); enriched `battle-of-karbala` (4,000 under Umar ibn Sa'd, surrender refusal, the killers' variants, head on the shield, the heads sequence); persons umar-ibn-sad, khawli-ibn-yazid-al-asbahi, muawiya-ibn-yazid, abdullah-ibn-hanzala.

- **Batch TK-7** (pp. 323–332 — Muawiya): `event/am-al-jamaa` (41H), `event/istilhaq-ziyad` (first ruling contrary to the Prophet's judgment), `event/baya-wilayat-ahd-yazid` (Ibn Abi Bakr's "سنة كسرى وقيصر", Ibn al-Zubayr's ثعلب رواغ, the disputed minbar announcement), `event/death-of-muawiya` (Rajab 60, Bab al-Jabiya burial, the hair relics), `concept/diwan-al-khatim` (the forged 100k warrant).

- **Batch TK-6** (pp. 305–320 — Ali's sayings + Hasan): `event/shurayh-armor-judgment` (the armor trial), `event/death-of-hasan-ibn-ali` (Ja'da's poisoning per the account, refused to name the poisoner, Baqi burial dispute); enriched `treaty-of-hasan-and-muawiya` (six months, three conditions, "العار خير من النار"); persons shurayh-al-qadi, jada-bint-al-ashath.

- **Batch TK-5** (pp. 293–298 — Ali's caliphate): `event/bayat-ali` (Badri approval condition, Talha/Zubayr's reluctant pledge); enriched `death-of-ali-ibn-abi-talib` (the Meccan three-way pact, the dream, dar al-imara burial, Ibn Muljim's execution), `battle-of-the-camel` (Jumada II 36, 13k dead, 15-night Basra stay), `battle-of-nahrawan` (Harura', Ibn Abbas's debate, Dhu'l-Thudayya); persons qatam, al-burak-ibn-abdallah, amr-ibn-bakir; merged ibn-muljim→`abd-al-rahman-ibn-muljam`.

- **Batch TK-4** (pp. 259–278 — Uthman): `event/baya-of-uthman` (Abd al-Rahman's private soundings, Ali's "فيما استطعت", Abu Talha's door guard), `event/uthman-expands-two-mosques` (Haram 26H, Prophet's mosque 29H — 160×150 cubits, teak roof); enriched `event/murder-of-uthman` (forged letter in the water-skin, Marwan's hand, siege, al-Mughira's three options, Hash Kawkab burial) and `event/first-raid-on-cyprus` (Amr's sea description); `person/muhammad-ibn-abi-bakr`.

- **Batch TK-3** (pp. 240–258 — Umar's late caliphate): `event/caesar-palm-letter` (the Caesarea palm letter), `event/umar-justice-anecdotes` (Ka'b ibn Suwar's verdict, Ali's meal-advice); enriched `event/death-of-umar` (Abu Lu'lu'a's windmill threat, Umar's premonition, the six-member shura); persons kab-al-ahbar, kab-ibn-suwar, amr-ibn-maymun; merged abu-lulua→`abu-lulu-firuz`, suhayb-al-rumi→`suhayb-ibn-sinan` (both pre-existing, same men).
