# Library lane: al-Majmu' Sharh al-Muhadhdhab (al-Nawawi) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/fiqh/majmu-nawawi/`

| item | what | used |
|---|---|---|
| BBib-Alex-09307 (688 pp.) | vol. 8 (al-Nawawi's text: rest of hajj, udhiyya, aqiqa, nadhr), al-Muti'i edition, Maktabat al-Irshad, Jeddah | yes → `source/majmu-irshad-v8` (printed = PDF − 4) |
| BBib-Alex-09296 (556 pp.) | vol. 18 = Takmila part 5 by al-Muti'i | not used (not al-Nawawi's text) |
| magm22_20220524 = waqmagm (identical md5) | vol. 22 = Takmila part 11 (Kitab al-Hudud) by al-Muti'i | not used |

## Batch 1 (this commit)

Pages: 5–6, 13–28, 108–109, 358–359, 434–435 and the "madhahib al-ulama" headings throughout.

- Created: `source/majmu-irshad-v8`.
- Enriched: `work/al-majmu-sharh-al-muhadhdhab` (draft card → full record with ar/en/ur prose); madhhab sections (perspectives) appended to `practice/tawaf` (purity), `practice/sai` (status), `practice/udhiyya` (status), `practice/aqiqa` (status, amount).

## Flags

- al-Nawawi reports Abu Hanifa calling the aqiqa "bid'a"; recorded as al-Nawawi's report, Hanafi view needs_source.
- Qur'an verses quoted in the OCR are referenced only by passage link (22:29, 2:158, 33:21).

## Next

Remaining "madhahib al-ulama" sections in vol. 8 (wuquf p. 146, ramy p. 182, halq p. 197, ihsar p. 322, time and age of udhiyya pp. 363–370, nadhr al-ma'siya p. 446); al-Muti'i's Takmila volumes as a separate work (`work/takmilat-al-majmu`).
