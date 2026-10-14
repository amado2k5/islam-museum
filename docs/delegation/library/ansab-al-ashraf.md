# Lane: lib-ansab — Ansab al-Ashraf (al-Baladhuri)

## Source
- Book: أنساب الأشراف — Ahmad b. Yahya b. Jabir al-Baladhuri (d. 279 AH). Genealogical-biographical compendium of Quraysh and the Arab tribes.
- Scans (raw): `raw/library/tareekh/ansab-ashraf/` — four PDFs:
  - `1_20200312_20200312_1859.pdf` — 723 pp, vol. 1 (Prophet's nasab + early Sira chapters). OCR'd.
  - `0132796_202003.pdf` = `1_20211128_20211128_1729.pdf` — 504 pp identical pair, "Jummal min Ansab al-Ashraf" (tribal genealogies). OCR'd.
  - `BBib-Alex-07711.pdf` — 408 pp, "al-juz' al-thani 'ashar" (vol. 12 — late tribal/Umayyad). OCR'd.
- OCR workspace (not in git): `books/tareekh/ansab-ashraf/<scan>/` — book.txt already present (prior Apple Vision runs).

## Method
As lib-kamil/lib-fihrist: cite `{cite:ansab-al-ashraf p. N}`; create `source/ansab-al-ashraf.yaml` once. Mine vol. 1's set-piece chapters first (ancestors, mustad'afin, wells, messengers, mawali), then the tribal volumes' akhbar.

## Progress
- Setup: lane doc created; vol. 1 chapters mapped (mustad'afin ~line 4713, Mi'raj 7655, mawali 14165, spoils 15581, Fawatim/Mawatik 16106, wells 16189).

## Progress (cont.)
- Vol. 1 mined: Fawatim/Awatik grandmothers, the Prophet's wells (Ruma, Ghars, Bir Anas, Yasira), envoys-to-kings year 7, Hashim–Umayya munafara, Irashi vs Abu Jahl, Tasm–Jadis destruction, Berber etymology, Jurhum plague.
- Vol. 12 mined: ayyam set-pieces — al-Haba'a (Dahis/Ghabra' spark), Rahrahan, Sha'b Jabala (Laqit + Dukhtanus elegy); Hudhayfa b. Badr, Zuhayr b. Judhayma, al-Harith b. Zalim, al-Ahwas, Ma'bad, Laqit, Shurayh, Dukhtanus created.
- 0132796_202003 and 1_20211128 are identical scans of Jummal vol — same coverage as vol-1 chapters; vol-12 remainder is dense tribal nasab (thin event yield).
- Lane paused — moving to al-Muntazam (258–349 AH overlap with Kamil coverage).
