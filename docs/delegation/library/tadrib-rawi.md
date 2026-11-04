# tadrib-rawi: al-Suyuti, Tadrib al-Rawi fi Sharh Taqrib al-Nawawi

- Lane: OCR harvest, worker F (Claude Code, claude-opus-5-5, run ocr-harvest-2026-11-04)
- Text: `harvest-text/books/hadith-sciences/tadrib-rawi/` (not in git)

## Items
| Item | What it is | Used |
|---|---|---|
| `5_20220809_202208` | Volume 5 of Muhammad Awwama's edition, with Ibn al-Ajami's gloss: Dar al-Minhaj, Jeddah, 1st ed., 1437/2016. Covers types 30–65. Printed page = PDF page. | yes: `source/tadrib-rawi-awwama-v5` |
| `muradmolla-324-1140` | Murad Molla manuscript, poor OCR | excluded |

## Records
New
- `source/tadrib-rawi-awwama-v5` (self-listing)
- `work/tadrib-al-rawi` (trio): there was no earlier record. It is linked as `commentary_on` `work/al-taqrib-wal-taysir`.
- `question/awwal-man-aslama` (trio): who first accepted Islam, pp. 211–223. The answers covered are Abu Bakr, Ali, Khadija, Zayd and others, plus the reconciliation of Ibn al-Salah and al-Nawawi. All entries are Sunni; editor and earlier critics are attributed.

Enriched
- `concept/adalat-al-sahaba`: added the Tadrib section, pp. 171–172 and 185–187. It covers the majority view, al-Mazari's restriction and al-Ala'i's reply, and the other views including the Mu'tazili one (labelled). Awwama's comment is attributed to him.
- `person/abu-al-tufayl-amir-ibn-wathila`:
  - The death date is now debated: 100, after 100, 102, 107 or 110, with al-Dhahabi preferring 110 (pp. 223–225).
  - The record was published from its earlier draft status, and a prose section was added.

## Not done
- The rest of volume 5 (types 30–38 and 40–65) is not yet harvested. Good candidates:
  - type 40, the Successors (p. 239);
  - type 60, dates of transmitters (p. 502);
  - type 62, trustworthy men whose memory became confused (p. 555).
- Volumes 1–4 are not in the harvest.

## Second pass (worker F, run 2, ocr-harvest-2026-11-04)
**Page offset found:** printed = PDF up to PDF p. 544; PDF pp. 545–546 are two stray pages of type 54 (folios 445–446); from PDF p. 547 printed = PDF − 2. Recorded in `source/tadrib-rawi-awwama-v5`; all citations give printed folios.

Batch B (types 40, 60, 61, 62; printed pp. 239–265, 502–579):
- `group/tabiun` (was a Wikidata draft card, no prose): published with full trio — definitions (al-Khatib / al-Hakim / Ibn Hibban, as perspectives), tiers (Muslim, Ibn Sa'd, al-Hakim's fifteen), Ibn al-Musayyab's hearing debate, misclassifications, first and last to die.
- New trios: `concept/mukhadram` (pp. 248–255), `group/al-fuqaha-al-saba` (pp. 255–257; four counts as perspectives), `question/afdal-al-tabiin` (pp. 257–262; Sunni views incl. Awwama's and al-Dhahabi's), `concept/tawarikh-al-ruwat` (type 60, pp. 502–540: uses against liars, wafayat literature, choice dates incl. the 12 vs 1/2 Rabi' I debate and al-Suhayli's calendar objection), `concept/ikhtilat-al-ruwat` (type 62, pp. 553–579: rule, the sixteen examples, editor's caveat on the Sahihs), `person/abu-ishaq-al-sabii` (new; with Mizan part 3 p. 270).
- Enriched: `concept/jarh-wa-tadil` (type 61 section, pp. 541–552; published).
- Not done: types 30–38, 41–59, 63–65 (good next targets: 34 nasikh/mansukh of hadith, 36 mukhtalif al-hadith, 38 al-mursal al-khafi, 63 tabaqat).
