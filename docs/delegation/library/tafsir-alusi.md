# Library harvest: tafsir/tafsir-alusi (Ruh al-Ma'ani)

- Worker: Claude Code (OCR-harvest worker B), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Items used: roohm_01 (Dar al-Kutub al-Ilmiyya 1415/1994, ed. Ali Abd al-Bari Atiyya, vol. 1; PDF pp. 1–6, author's preface); azm101010_gmail_20180404_1538 (doctoral thesis "Juhud al-Alusi al-Balaghiyya", 2008–2009, supervisor Muhammad al-Hasan Ali al-Amin; biographical chapter PDF pp. 27–58).
- Not cited: roohulmani (Mu'assasat al-Risala 2010, vol. 15), 1_20211208 (older printing).

## Entities
- Created: source/ruh-al-maani-ilmiyya-1994-v1; source/juhud-al-alusi-al-balaghiyya-thesis; person/mahmud-al-alusi (the exegete had no record; born 14 Sha'ban 1217, died Dhu al-Qa'da 1270); event/al-alusi-begins-ruh-al-maani-1252; question/was-al-alusi-salafi-in-creed (Sunni x2, academic, "not yet given" line).
- Enriched: work/ruh-al-maani (draft card turned into a full record and ar/en/ur prose).
- Stub: person/khalid-al-naqshbandi.

## Notes
- The thesis text layer reverses the digits of numbers (١٠٣١ = 1301) and garbles the title page; the thesis author's name and university could not be read, so the source has no author field.
- Fixed in this batch: academic perspectives in my two earlier Burhan questions were set to `standing: secondary` to satisfy the new precheck rule.
- precheck also flags data/concept/al-jam-wal-farq.yaml (another agent's file, from main); not touched.
