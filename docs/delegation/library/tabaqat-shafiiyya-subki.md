# Lane: lib-subki-tabaqat — Tabaqat al-Shafi'iyya al-Kubra (Taj al-Din al-Subki)

## Source
- Book: طبقات الشافعية الكبرى — Taj al-Din 'Abd al-Wahhab b. 'Ali al-Subki (d. 771 AH), al-Matba'a al-Husayniyya al-Misriyya printing.
- Scans (raw, outside git): `books/tabaqat/tabaqat-shafiiyya-subki/` —
  - `AAlexandrina-147556`: **juz' 1** (tabaqa 1, companions/students of al-Shafi'i; fihrist at head lists numbered tarajim; printed pages run ~7 behind the `[pN]` markers).
  - `AAlexandrina-149925`: **juz' 2**. `AAlexandrina-150846`: **juz' 3**. `tshafiakobra`: **juz' 10**. `AAlexandrina-162022`: **juz' 11** (الحادي عشر).
- OCR: Apple Vision, noisy; tarjama heads marked with `* name *`; printed page markers `- NNN -` and `===== [pN] =====` (marker ≈ printed + 7 in juz' 1).
- Cite as `{cite:tabaqat-shafiiyya-subki j.N p.M}`. Source record: `source/tabaqat-shafiiyya-subki`.

## Method
Same as other library lanes. Subki is wordy — take his evaluations, the teacher/student lists, dates, and the anecdotes; skip the long fiqh digressions.

## Progress
- Setup: identified five scans (juz' 1, 2, 3, 10, 11); juz' 1 covers al-Shafi'i's first circle — many already exist (al-Muzani, Ibn 'Abd al-Hakam, Harmala, Yunus b. 'Abd al-A'la, al-Karabisi).
- Batch TS-1 (juz' 1, first-circle Shafi'is): new persons abu-thawr (p.228 — Ahmad's "في مسلاخ سفيان الثوري", Khatib: turned from ra'y to hadith on al-Shafi'i's arrival, d. Safar 240), al-zafarani (p.250-258 — the reader in al-Shafi'i's majlis, "أنبت رواة القديم" per al-Mawardi, Darb al-Za'faran named for him, d. Ramadan 260), al-rabi-ibn-sulayman-al-muradi (p.259-261 — muezzin of Fustat, transmitter of al-Shafi'i's books, ~200 journeyed to him, d. 21 Shawwal 270 prayed over by Khumarawayh), al-rabi-ibn-sulayman-al-jizi (p.259 — d. Dhu'l-Hijja 256/257). Enriched al-karabisi (d. 245/248 confirmed).
- Batch TS-2 (juz' 1 tail, pp.232-288): new persons ali-ibn-al-madini (p.265-267 — b.161; ijma' on his imama; Abu Hatim's "علم في الناس"; Ibn 'Uyayna's "لولا ابن المديني ما جلست"; Bukhari's "ما استصغرت نفسي إلا عنده"; mihna answer + pre-death declaration; d. Dhu'l-Qa'da 234 — the entry Tarikh Baghdad scans never yielded), ibrahim-ibn-al-mundhir (p.232-234 — Hizami Madani, in Sahih al-Bukhari, d.235/236), abd-al-aziz-ibn-imran-al-khuzai (p.264 — Egyptian faqih, student of al-Shafi'i and Ibn Wahb, d.234), sulayman-ibn-dawud-al-hashimi (p.263 — 'Abbasi of Ibn 'Abbas's line, Ahmad's "استخلفت سليمان", Shafi'i's "أعقل رجلين", d.219/220), muhammad-ibn-ahmad-al-khallali (p.288 — companion of al-Muzani and al-Rabi'). Enriched abu-hatim-muhammad-al-razi (source added; Subki confirms the 1000-farsakh rihla on foot, b.195).
- Not found in juz-1 OCR: ahmad-ibn-muhammad sibt al-Shafi'i (index p.287) and ahmad-ibn-nasr b. Ziyad al-Naysaburi (p.287) — garbled bodies; retry via pages.json.
- Next: juz' 2 (AAlexandrina-149925) — tabaqat 2-3; index extraction first.
