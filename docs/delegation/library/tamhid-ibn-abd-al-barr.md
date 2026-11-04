# Library lane: al-Tamhid li-ma fi al-Muwatta' — Ibn 'Abd al-Barr (d. 463 AH)

**Book id:** `tamhid-ibn-abd-al-barr` · category `hadith` · worker: Claude Code (OCR-harvest worker A), run `ocr-harvest-2026-11-04` · stubs `data/_stubs.d/claude-ocr-harvest-a.yaml` (none needed so far).

## Items in the harvest store (`books/hadith/tamhid-ibn-abd-al-barr/`)

| item | pages | md5 (first 8) | what it is | used |
|---|---|---|---|---|
| `01172271` | 729 | 0d2c0fc2 | al-Furqan Foundation (London) ed., vol. 1, 1st ed. 1439/2017, ed. Bashar 'Awwad Ma'ruf, Muhammad Bashar 'Awwad (+ a third co-editor read by OCR as «سليم محمد عام[ر]») | **yes** → `source/tamhid-furqan-2017-v1` |
| `alfirdwsiy2018_gmail_1571_201808` | 10,441 | cd846b9e | Moroccan Ministry of Awqaf ed., all volumes in one continuous scan; vol. 1 1387/1967 ed. al-'Alawi & al-Bakri | **yes** (front matter) → `source/tamhid-awqaf-maghrib-1967` |
| `Pdf1079` | 10,443 | 4bde063e | second scan of the same Moroccan set (same volume sequence; vol. 1 TOC on PDF pp. 2–3) | no — duplicate edition |
| `Al-Tamhid_Muwatta` | 519 | 21832b84 | al-Maktaba al-'Asriyya (Sidon–Beirut) ed., vol. 6, 1433/2012, ed. Muhammad b. Riyad al-Ahmad | **excluded**: text layer is font-encoded garbage after the title/imprint pages (PDF p. 3 onward); unreadable |

**Page offset (al-Furqan vol. 1):** printed page = PDF page − 1 (checked on PDF pp. 6, 9, 10, 11, 19, 136, 192, 259). All `tamhid-furqan-2017-v1` citations give the printed page. PDF pp. 137–191 are manuscript photographs (OCR noise). Moroccan set: citations give the PDF page of the continuous file; vol. 1 front matter is in abjad letters.

## Structure of al-Furqan vol. 1 (printed pages)
- Foreword (Ahmad Zaki Yamani) 5–8; editor's introduction 9–135: life of Ibn 'Abd al-Barr 10–18, manuscripts 19–40, the two recensions 41–55, editorial method 55–135.
- Author's introduction 191–202 (khabar al-wahid, mursal, why Yahya al-Laythi's recension, his isnads to the Muwatta'); bab ma'rifat al-mursal wa-l-musnad… wa-ma'na al-tadlis 203–216; bab man yuqbal naqluhu wa-mursaluhu wa-tadlisuh 217–257.
- Bab alif of Malik's teachers 258 ff.: Ibrahim b. 'Uqba 258–, Isma'il b. Abi Hakim 320–, Ishaq b. 'Abd Allah b. Abi Talha 400–, Ayyub al-Sakhtiyani 597–, Ayyub b. Habib 667–; appendix: the Malik chapter of the first recension 677–; index 713–.

## Batch 1 (4 Nov 2026) — front matter, author, Malik's teachers of vol. 1
- Sources (new): `source/tamhid-furqan-2017-v1`, `source/tamhid-awqaf-maghrib-1967`.
- Enriched: `work/al-tamhid-ibn-abd-al-barr` (full ar/en/ur rewrite: purpose, method, structure, two recensions with a perspectives block on the editions' dispute, scholars' judgements, editions), `person/ibn-abd-al-barr` (birth, family, teachers, ijazas, school, Ibn Hazm, judgements, works, death; prose rewritten ar/en/ur keeping the earlier Wafayat citations), `person/ayyub-al-sakhtiyani` (name, origin, contemporaries' judgements, Malik's account, death variants), `concept/khabar-al-ahad` (Ibn 'Abd al-Barr section + perspectives), `concept/irsal-fiqh` (Ibn 'Abd al-Barr section + five-view perspectives).
- New persons (ar/en/ur): `ibrahim-ibn-uqba`, `kurayb-mawla-ibn-abbas`, `ismail-ibn-abi-hakim`, `ishaq-ibn-abd-allah-ibn-abi-talha`, `ayyub-ibn-habib-al-jumahi` (Malik's shaykh — NOT `person/ayyub-ibn-habib-al-lakhmi`, the Andalusian governor), `khalaf-ibn-qasim-ibn-al-dabbagh`, `abd-al-warith-ibn-sufyan`, `said-ibn-nasr-ibn-abi-al-fath`.
- Doubts: Sa'id b. Nasr's dates read from OCR «(٥٣٩٥-٣١٥)»; Ishaq's mother's name «نبيتة» as printed; third co-editor's name. No images available in this session to verify.
- Contested: the recensions dispute (al-Furqan editor vs Moroccan editors) recorded as attributed perspectives.

## Next
- Vol. 1 hadith commentary (Isma'il, Ishaq/Anas reports) for concepts/practices; the Moroccan set's later volumes for Malik's other teachers (Zayd b. Aslam, Ibn Shihab, Nafi'…) — biographies at the head of each shaykh's chapter.
