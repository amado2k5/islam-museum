# Library progress: طبقات الفقهاء (tabaqat-fuqaha)

- Item used: `Heliopolis1957_gmail_20180513_1108` (118 OCR'd pages). Edition on the scan's title page: ed. Ihsan Abbas, Dar al-Ra'id al-Arabi, Beirut. The earlier item `AAlexandrina-223745` (300 pages) is the cross-check copy.
- Source entity: `source/tabaqat-fuqaha-abbas-1981` (the year is not on the pages read; confirm before review).
- Page offset: printed numbers match the scan's printed numbers in the editor's section (p.5 shows the author's biography, printed 5–6).

## Batches
1. Author and title (PDF pp. 5–6): `person/abu-ishaq-al-shirazi`, `work/tabaqat-fuqaha`, `source/tabaqat-fuqaha-abbas-1981`. Born at Firuzabad 393 AH (the editor lists 373 and 395 as variants), studied in Fars, Basra, Baghdad from 415 AH; teachers Abu al-Tayyib al-Tabari (d. 450) and Abu Hatim al-Qazwini; refused the chief qadiship in 447 AH; died 476 AH.

## Next
Batch 2: the first jurists of the dictionary after the author's introduction, in the order the book gives them (approximately 25 entities per batch). Each entity gets a claims table in `~/islam-museum-harvest/books/tabaqat/tabaqat-fuqaha/claims/`.

## Batch 2
The dictionary proper starts at PDF p.20 (printed 20): "ذكر فقهاء الصحابة". The Companion jurists it names (pp. 21–34: Abu Bakr, Umar, Ali, Ibn Mas'ud, Abu Musa al-Ash'ari, Ubayy ibn Ka'b, Mu'adh ibn Jabal, Abu Sa'id, Abu al-Darda', Aisha, Ibn Umar, Amr ibn al-As, and the successor jurists Urwa, al-Qasim, Salim, Kharija, Sulayman ibn Yasar, Abu Salama…) already have person records under other slugs (e.g. `abdullah-ibn-masud`, `aisha`, `abdullah-ibn-umar`).
Adding the `jurist` role and this source to those records needs text-level edits: re-dumping them with the YAML library reformats every date line and adds about 600 lines of diff, so a first attempt was reverted.
Next: the successor jurists, with records created for the ones that do not exist yet.
