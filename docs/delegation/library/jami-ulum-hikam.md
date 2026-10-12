# Library lane: Jami' al-Ulum wal-Hikam — Ibn Rajab al-Hanbali (hadith commentary)

**Book:** جامع العلوم والحكم في شرح خمسين حديثا من جوامع الكلم — شرح ابن رجب الحنبلي (ت 795هـ) للأربعين النووية وزوائد ابن الصلاح وابن رجب (خمسون حديثاً في أغلب الطبعات).
**Book id:** `jami-ulum-hikam` · category `hadith` · branch `content/lib-jami-ulum-hikam` · stubs `data/_stubs.d/lib-jami-ulum-hikam.yaml`.

**Edition and item used:** user-provided scan `raw/library/hadith/jami-ulum-hikam/jami3_al_3olom_wal_7ekam_al_arba3oon_al_nawaiya.pdf` — **دار ابن كثير، دمشق–بيروت، الطبعة الأولى 1429هـ/2008م، تعليق وتحقيق د. ماهر ياسين الفحل، مجلد واحد، 956 صفحة** (title and copyright pages verified on the images pp. 1, 4). No text layer; extracted with Apple Vision OCR via `ocr_book.py` on 12 Oct 2026. **Printed page = PDF page** (checked at pp. 5, 8–11, 25–28). One bad page: p. 19 is a photo of a manuscript leaf and OCR'd as noise. Source entity: `source/ibn-rajab-jami-ulum-hikam`.

**Book structure (author's intro pp. 25–28):** Ibn al-Salah dictated «الأحاديث الكلية» (26 hadiths) → al-Nawawi expanded to 42 («الأربعين») → Ibn Rajab added 8 (named on p. 27) = 50, titled «جامع العلوم والحكم». Hadith 1 commentary begins p. 33.

**Plan (per `categories/hadith.md`):**
1. Front matter: edition facts, author bio → `source/<edition>`, `work/jami-ulum-hikam` (`commentary_on` → `work/arbaun-nawawi`), `person/ibn-rajab`, `person/al-nawawi`, `work/arbaun-nawawi`.
2. Each hadith (1–50 by this edition's numbering): a `passage` entity (`unit: hadith`, isnad head as printed, grade attributed to its grader, no full matn), linked `basis_for`/`mentions` to the concept/practice it documents.
3. Concepts/practices the commentary defines (niyya, islam-iman-ihsan, halal/haram, bid'a, amr-bil-ma'ruf, gharib, zuhd, wara', hubb, tawakkul, tafsir of the heart…): reuse existing entities first (`concept/iman`, `concept/ihsan`, `concept/islam-din`, `concept/five-pillars`, `concept/qadar` already exist), add the commentary's definition as a cited claim or `perspectives` entry.
4. Hadith 2 (hadith Jibril) is the anchor for `concept/islam-din`, `concept/iman`, `concept/ihsan`.

**Done:**
- (12 Oct 2026) harvest registration: PDF copied to `raw/library/hadith/jami-ulum-hikam/`, manifest line appended (source_url "local:~/Downloads"), `books.yaml` entry added, Apple Vision OCR running into `books/hadith/jami-ulum-hikam/jami3_al_3olom_wal_7ekam_al_arba3oon_al_nawaiya/`.
- (12 Oct 2026) Batch 1 on main: `source/ibn-rajab-jami-ulum-hikam`, `work/jami-ulum-hikam`, `work/arbaun-nawawi`, `work/ahadith-kulliyya-ibn-al-salah`, `person/ibn-rajab`, `person/al-nawawi`, `person/ibn-al-salah`; stubs for needed narrators, scholars and hadith sources in `data/_stubs.d/lib-jami-ulum-hikam.yaml`.

**Flags:** none yet. Creed/fiqh differences inside the commentary (e.g. hadith 1 on intention and madhhab rulings, hadith 3 on arkan al-islam, bid'a in hadith 28) will need `perspectives` where schools differ; attribute every grading to its grader, never the museum's voice.

**Next:** batch 2 — hadith 1–5 (pp. 33–~140): a `passage` per hadith (`work: work/jami-ulum-hikam`, ref = its number, isnad head and grade as printed, no full matn), plus concept updates for niyya/islam-iman-ihsan/khuluq al-insan/halal-haram-shubuhat/bid'a-ihdath, each claim cited to its printed page.
