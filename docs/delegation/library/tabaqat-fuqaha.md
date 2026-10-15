# Library progress: طبقات الفقهاء (tabaqat-fuqaha)

- Item used: `Heliopolis1957_gmail_20180513_1108` (118 OCR'd pages). Edition on the scan's title page: ed. Ihsan Abbas, Dar al-Ra'id al-Arabi, Beirut. The earlier item `AAlexandrina-223745` (300 pages) is the cross-check copy.
- Source entity: `source/tabaqat-fuqaha-abbas-1981` (the year is not on the pages read; confirm before review).
- Page convention: every page reference in this lane and in the records is a PDF page of the scan (the image sequence p0001–p0118), not the printed page number. Spreads print two numbers on one PDF page (PDF p.35 carries printed 64 and 65), so the printed number cannot be used as the citation. Records label these as "PDF ص" and the source record states the convention.

## Batches
1. Author and title (PDF pp. 5–6): `person/abu-ishaq-al-shirazi`, `work/tabaqat-fuqaha`, `source/tabaqat-fuqaha-abbas-1981`. Born at Firuzabad 393 AH (the editor lists 373 and 395 as variants), studied in Fars, Basra, Baghdad from 415 AH; teachers Abu al-Tayyib al-Tabari (d. 450) and Abu Hatim al-Qazwini; refused the chief qadiship in 447 AH; died 476 AH.

## Next
Batch 2: the first jurists of the dictionary after the author's introduction, in the order the book gives them (approximately 25 entities per batch). Each entity gets a claims table in `~/islam-museum-harvest/books/tabaqat/tabaqat-fuqaha/claims/`.

## Batch 2
The dictionary proper starts at PDF p.20: "ذكر فقهاء الصحابة". The Companion jurists it names (pp. 21–34: Abu Bakr, Umar, Ali, Ibn Mas'ud, Abu Musa al-Ash'ari, Ubayy ibn Ka'b, Mu'adh ibn Jabal, Abu Sa'id, Abu al-Darda', Aisha, Ibn Umar, Amr ibn al-As, and the successor jurists Urwa, al-Qasim, Salim, Kharija, Sulayman ibn Yasar, Abu Salama…) already have person records under other slugs (e.g. `abdullah-ibn-masud`, `aisha`, `abdullah-ibn-umar`).
Adding the `jurist` role and this source to those records needs text-level edits: re-dumping them with the YAML library reformats every date line and adds about 600 lines of diff, so a first attempt was reverted.
Next: the successor jurists, with records created for the ones that do not exist yet.

## Batch 3 (PDF pp. 41–43)
Scope: the Syrian, Egyptian and early Kufan tabi'un (al-Awza'i's pupils, Marthad al-Yazani's circle in Alexandria, Ibn Mas'ud's Kufan students up to al-Sha'bi). Claims table: `~/islam-museum-harvest/books/tabaqat/tabaqat-fuqaha/claims/batch3-pdf41-43.tsv` (outside git).
- 12 new person records: Yahya ibn Yahya al-Ghassani, Sa'id ibn Abd al-Aziz al-Tanukhi (a different person from the Umayyad governor Sa'id ibn Abd al-Aziz "Hudhayfa"), Muhammad ibn al-Walid al-Zubaydi, Abd al-Rahman ibn Usayla al-Sunabihi, Abd Allah ibn Malik al-Jaysh-ani, Marthad ibn Abd Allah al-Yazani, Bukayr ibn Abd Allah ibn al-Ashajj, Amr ibn al-Harith, Alqama ibn Qays al-Nakha'i, al-Aswad ibn Yazid al-Nakha'i, Ubayda ibn Amr al-Salmani, al-Harith al-A'war.
- 6 existing records extended with this source and facts: al-Awza'i, Maymun ibn Mihran, Layth ibn Sa'd, Masruq, Shurayh al-Qadi, al-Sha'bi (death dates with "وقيل" marked debated).
- Edges: `student_of` for Bukayr and Amr (to Marthad, "انتقل إليه"), Layth (to al-Zuhri), and the Ibn Mas'ud students per the book's list (PDF ص42–43).
- Flags: Layth's death year has a printed variant (خمس وتسعين) in the footnote; Muhammad ibn al-Walid's death year (148) was read on the image and needs a second source; Ibn Sirin's ranking is attributed; the nickname "القصير" is as printed; Sunabihi and al-Jaysh-ani have no dates on the page.
- Not done here: Yazid and Abd al-Rahman, sons of Yazid ibn Jabir (named only, no facts on the page); the Ibn Mas'ud students as a group record; the `student_of` edge from Yazid ibn Abi Habib to Marthad (his record is not edited in this batch).
- Next: PDF p.44 (Sa'id ibn Jubayr, Ibrahim al-Nakha'i, al-Hakam ibn Utayba, Hammad ibn Abi Sulayman, Habib ibn Abi Thabit, al-Harith ibn Yazid al-Ukli, Abu Hashim, Abu Ma'shar, al-Qa'qa', al-A'mash, Mansur) and PDF p.45 onward.

## Batch 4 (PDF pp. 44–47)
Scope: the Basran and Kufan tabi'un and their successors as the book gives them: Sa'id ibn Jubayr, Ibrahim al-Nakha'i, Hammad, Habib ibn Abi Thabit, Hakam ibn Utayba, al-Mughira, Ziyad ibn Kulayb, Mansur, Ibn Shubruma, Ibn Abi Layla, Sufyan al-Thawri, Hasan ibn Salih, Shurayk ibn Abd Allah al-Nakha'i, Abu Hanifa, al-Hasan al-Basri, Jabir ibn Zayd, Ibn Sirin, Abu al-Aliya, Humayd al-Himyari, Muslim ibn Yasar, Abu Qilaba, Qatada, Ayyub al-Sakhtiyani. Claims table: `~/islam-museum-harvest/books/tabaqat/tabaqat-fuqaha/claims/batch4-pdf44-47.tsv` (outside git). Every line checked on the page image.
- 14 new person records: Ibrahim al-Nakha'i, Hammad ibn Abi Sulayman, Habib ibn Abi Thabit, al-Harith al-Ukli, Ziyad ibn Kulayb (slug distinct from `person/abu-mashar`, the astrologer), al-Qa'qa' ibn Yazid, Mansur ibn al-Mu'tamir, al-Mughira ibn Miqsam, Shurayk ibn Abd Allah al-Nakha'i (distinct from `person/shurayk-ibn-al-awar`), Muhammad ibn Abd al-Rahman ibn Abi Layla, Ayyub al-Sakhtiyani, Abu Qilaba, Humayd al-Himyari, Muslim ibn Yasar.
- 12 existing records extended with this source and facts: Sa'id ibn Jubayr, al-Hakam ibn Utayba, Abu Hanifa, al-Hasan al-Basri, Muhammad ibn Sirin, Sufyan al-Thawri, Ibn Shubruma, al-Amash, Jabir ibn Zayd, Abu al-Aliya, al-Hasan ibn Salih ibn Hayy, Qatada.
- Flags: Sa'id ibn Jubayr's death year (the book says 95; the existing record's Tabari summary says 94); al-Hasan al-Basri's and Ibn Sirin's ages differ from the existing summaries; Ibn Abi Layla's printed age (72) does not match his birth (74) and death (148) years; Qa'qa' ibn Yazid's identity (variant reading Qa'qa' ibn Hakim); the line that reads "ابن عتيبة وحماد بن أبي سليمان" is Abu Bakr ibn Ayyash's saying, not a pupil list; the Yahya ibn Abi Kathir saying about "ما بين لابتيها" (fn 1 glosses it as Medina, the next clause names Ata, a Meccan) is quoted as printed; the death dates of al-Mughira, Ziyad ibn Kulayb, al-Amash and Mansur come from the editor's footnotes, not the book's text.
- Not done here: the Companion and teacher links of Abu Hanifa to Hammad (page states "أخذ الفقه عن حماد", not yet an edge); the Sufyan–Malik–Awza'i passage (mixed, recorded as reported); group records for the Kufan and Basran circles; pupils named only in lists (al-Fazari, Ibn al-Mubarak, Waki', Yahya ibn Adam and others).
- Next: PDF p.48 onward.
