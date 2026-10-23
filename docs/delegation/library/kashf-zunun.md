# Lane: lib-kashf-zunun — Kashf al-Zunun (Hajji Khalifa)

## Source
- Book: كشف الظنون عن أسامي الكتب والفنون — Hajji Khalifa / Katip Çelebi (d. 1067 AH).
- Scans: `/Volumes/exmicroSD/islam-museum-harvest/books/tareekh/kashf-zunun/` — four copies, all the SAME Furqan 2004 **volume 1** (~688 pp): `01_20221123_20221123`, `20231101_20231101_1929`, `KzakfPDF`, `kzakwfonun`. Best OCR: `01_20221123_20221123/book.txt`.
- Coverage: editor's intro, the author's famous muqaddima (science definitions), then entries — باب الألف (~p. line 4009), حرف التاء (~9486), حرف الثاء — ends before حرف الجيم (vol 2, not scanned).
- Source record: `source/kashf-zunun-furqan`. Cite `{cite:kashf-zunun-furqan p. N}`.
- NOTE: vol 1 only — entries are alphabetical, so later letters (and most famous titles) are not covered by this scan.

## Method
Mine the muqaddima's science taxonomy as concept records and notable entries as work records; entries carry author + death date + genre + sometimes incipit/verdict. Prefer famous set-pieces (entry anecdotes, Hajji Khalifa's asides) over bulk title-listing.

## Progress
- Setup: source record + lane doc.
- Muqaddima: authorial preface (method statement p. 51-52). Science definitions ~pp. 55-110 pending.


## Vol 1 set-piece pass (done)

Scans on shelf are all vol. 1 (alif + tāʾ, entries 1–2000). Mined:
- Muqaddima: science taxonomy, seven kinds of authorship, eight ru'us.
- al-Aghani entry (Ahmad the 50-year gathering, Sahib Ibn Abbad's verdict,
  4,000-dirham draft at Baghdad's suq) — p. 527-528.
- al-Athar al-Baqiya (Biruni, for Shams al-Ma'ali) + Athar al-Bilad
  (Qazwini, composed 674) — p. 179-180.
- al-Isaba (Ibn Hajar; 5 vols combining Isti'ab + Usd al-ghaba) — p. 462.
- Ibn al-Shatir's al-rub' al-tamm (p. 570-571), al-Fanari's Unmudhaj
  al-ulum hundred-science riddle (p. 665-666).
- Ihya' chain enriched: Lubab al-ihya' (Ahmad al-Ghazali), anti-Ihya'
  critique, Irshad entry already covered.

## KZ-2 — works prose-fill pass (Devin)

Drove the lane from the entity side this time: 1,168 unprosed `data/work` records (1,140 Wikidata stubs) were title-matched against vol 1's ~1,994 numbered entries (alif/tāʾ/thāʾ only — the harvest lacks vol 2). After author verification inside each entry, five clean matches were written with ar+en+ur prose:

- ahkam-al-quran-shafii (#150, p.210 — Kashf: al-Shafi'i "أول من صنّف فيه"; compiled from his corpus)
- tuhfat-al-mawdud (#169, p.215 — Ibn Qayyim; Kashf's title "أحكام المولود")
- adab-al-imla-wa-al-istimla (#438, p.284 — Ibn al-Sam'ani; Kashf's short title "أدب الإملاء")
- al-adab-al-shariyya (#424, p.280 — Ibn Muflih al-Hanbali d.763; duplicate `al-adab-al-shariyya-work` merged as alias; stubbed person/muhammad-ibn-muflih-al-maqdisi)
- arbaeen-al-nawawiyya (p.330-332 — the Ibn al-Salah 29→42 expansion, "فاشتهرت", sharh list)

Lesson for next pass: grep hits below ~line 4009 are muqaddima/footnote noise — entries are numbered `NNN_` or `NNN-` lines; match on the entry-head line only, then verify the author inside the entry before writing.
