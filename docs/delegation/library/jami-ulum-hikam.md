# Library lane: Jami' al-Ulum wal-Hikam — Ibn Rajab al-Hanbali (hadith commentary)

**Book:** جامع العلوم والحكم في شرح خمسين حديثا من جوامع الكلم — شرح ابن رجب الحنبلي (ت 795هـ) للأربعين النووية وزوائد ابن الصلاح وابن رجب (خمسون حديثاً في أغلب الطبعات).
**Book id:** `jami-ulum-hikam` · category `hadith` · branch `content/lib-jami-ulum-hikam` · stubs `data/_stubs.d/lib-jami-ulum-hikam.yaml`.

**Edition and item used:** user-provided scan `raw/library/hadith/jami-ulum-hikam/jami3_al_3olom_wal_7ekam_al_arba3oon_al_nawaiya.pdf` (956 PDF pages, no text layer; extracted with Apple Vision OCR via `ocr_book.py` on 12 Oct 2026). Publisher/edition details: to be read from the title page once OCR of the front matter is checked (record printed-page offset here).

**Plan (per `categories/hadith.md`):**
1. Front matter: edition facts, author bio → `source/<edition>`, `work/jami-ulum-hikam` (`commentary_on` → `work/arbaun-nawawi`), `person/ibn-rajab`, `person/al-nawawi`, `work/arbaun-nawawi`.
2. Each hadith (1–50 by this edition's numbering): a `passage` entity (`unit: hadith`, isnad head as printed, grade attributed to its grader, no full matn), linked `basis_for`/`mentions` to the concept/practice it documents.
3. Concepts/practices the commentary defines (niyya, islam-iman-ihsan, halal/haram, bid'a, amr-bil-ma'ruf, gharib, zuhd, wara', hubb, tawakkul, tafsir of the heart…): reuse existing entities first (`concept/iman`, `concept/ihsan`, `concept/islam-din`, `concept/five-pillars`, `concept/qadar` already exist), add the commentary's definition as a cited claim or `perspectives` entry.
4. Hadith 2 (hadith Jibril) is the anchor for `concept/islam-din`, `concept/iman`, `concept/ihsan`.

**Done:**
- (12 Oct 2026) harvest registration: PDF copied to `raw/library/hadith/jami-ulum-hikam/`, manifest line appended (source_url "local:~/Downloads"), `books.yaml` entry added, Apple Vision OCR running into `books/hadith/jami-ulum-hikam/jami3_al_3olom_wal_7ekam_al_arba3oon_al_nawaiya/`.

**Flags:** none yet. Creed/fiqh differences inside the commentary (e.g. hadith 1 on intention and madhhab rulings, hadith 3 on arkan al-islam, bid'a in hadith 28) will need `perspectives` where schools differ; attribute every grading to its grader, never the museum's voice.

**Next:** read OCR'd front pages → record edition + page offset → batch 1 (book metadata + author/commentator bios), then hadith 1 onward in batches of ~40–60 printed pages.
