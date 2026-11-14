# lib-sira-hadi-ila-al-haqq: Sirat al-Hadi ila al-Haqq (Yahya ibn al-Husayn), ed. Suhayl Zakkar

Lane A, claimed 14 Nov 2026 in `WORK-REGISTRY.md` on the microSD (row `seerah/sira-hadi-ila-al-haqq/seratimamhadi.pdf`, agent claude-sonnet-5-5 / orchestrator-lane-a).

- **Authority:** founder approval recorded as decision record dec-20261114-277 (PR #6577): mine the smallest unstarted seerah, tareekh or sahaba book, then Ibn Sina's Canon from the bones division at page 42, then Zij al-Sabi. Printed pp. 532, 546 and 666 of Kitab al-Manazir are not covered and stay held.
- **Source on the drive:** `books/seerah/sira-hadi-ila-al-haqq/seratimamhadi/` (`pages.json`, 461 OCR pages, already extracted; no new OCR needed). Source record `source/sira-hadi-ila-al-haqq`, work record `work/sira-hadi-ila-al-haqq`. Cite key `{cite:sira-hadi-ila-al-haqq p.N}`.
- **Page offset:** printed page = scan page + 3 (scan p. 12 = printed 15; the narrative starts at scan p. 14 = printed 17). Cites use the printed page.
- **School label:** a Zaydi source in the voice of the imam's followers. Each record says so and attributes praise and marvels to the book; no verdict in the museum's voice.

## Batches

- **Batch 1 (this PR):** the editor's preface (printed pp. 5-10), the opening page (pp. 15-16) and the first lines of the narrative (pp. 17-18). Added prose for the work record in ar, en and ur; four new person records (Ali ibn Muhammad ibn Ubaydallah al-Abbasi, his father Abu Jafar Muhammad ibn Ubaydallah, Muhammad ibn Sulayman al-Kufi, Suhayl Zakkar), each in ar, en and ur. All draft.

- **Batch 2:** printed pp. 17-20, the opening narrative of the first campaigns of 288 AH. Added 19 records, each in ar, en and ur, all draft: events (al-Hadi's entry into Sana'a; the rising at Shibam and the killing of Ibn Abbad; the rising in Sana'a; Raydah; al-Rahba), people (Abu al-Atahiya ibn Bishr, Ibn Abbad al-Tamimi, the judge Ibn Zurayq al-A'sam, Ali ibn Sulayman, Abdullah ibn al-Husayn, Sa'sa'a ibn Ja'far, Ibrahim ibn Khalaf ibn Tarif, Abd al-Qahir ibn Na'im, Ahmad ibn Mahfuz), clans (Al Ya'fur, Al Tarif) and places (Bayt Dhukhar, Raydah, al-Rahba). Dates converted from the tabular Hijri calendar and marked derived.

## Judgments recorded

- **Narrators corrected.** `work/sira-hadi-ila-al-haqq` listed `person/yala-ibn-muhammad-al-yafrani` (a Zanata amir of the Maghreb, d. 347 AH, from Ibn Khaldun) and al-Hadi himself as authors, and its summary named "Ya'la ibn Muhammad". The book's own opening leaf (printed p. 15) and the editor (pp. 7-8) name Muhammad ibn Sulayman al-Kufi and Ali ibn Muhammad ibn Ubaydallah al-Abbasi al-Alawi; the earlier reading is a misreading of the title-page OCR. The work now lists the two real narrators. The Yafrani record is untouched and no longer linked from this book. Held for the founder: whether that unrelated record needs any further change (none made).
- **Genealogy of Ali ibn Muhammad.** The printed chain on p. 15 is garbled in the OCR (one name reads as a fragment). Only the two ends are recorded (Ali ibn Muhammad ibn Ubaydallah, and al-Abbas ibn Ali). To check against the page image if the PNGs are ever generated (`pages-png/` is empty on the drive).
- **Reading of "hujja" (p. 8):** "a boy on whom no obligation before God had yet fallen" (not yet of age), not pilgrimage.
- **Added pages (p. 20 footnote):** the editor says pp. 17-20 appear to have been added to the original; al-Kufi's own account begins at p. 21 (the complete Sana'a manuscript begins there). Noted in the work record and the entry event. The records from these pages carry that caveat.
- **Names held back for the page image:** the first name of Abu al-Atahiya (p. 17 OCR "Abdullah ibn Yashir", p. 19 "ibn Bishr"); Abu al-Ashira ibn al-Ruwayya (p. 18, OCR rough); the son called al-Murtada whom al-Hadi appointed over a district whose name is lost in the OCR (p. 18; the OCR gives his first name as al-Qasim, the usual name being Muhammad); the "Zahr" of p. 20; the distance of "al-Rahba of Sana'a" (p. 20 footnote). None is entered as fact. Ibn Abbad of p. 19 is taken to be Muhammad ibn Ahmad ibn Abi Abbad of p. 17 from the context, marked as inferred.
- **Place identification:** the Shibam of these pages is not linked to `place/shibam` (which is Shibam of Hadramawt) nor to `place/shibam-kawkaban`; the editor's footnote gives only a day-and-night distance from Sana'a. To fix with a gazetteer in a later batch.
- **Coordinates:** none given for Bayt Dhukhar, Raydah or al-Rahba (the book gives none and none were guessed); two battle warnings remain until a gazetteer fixes them.
- **Omitted on purpose:** the narrator's contemptuous descriptions of opponents (not repeated in the museum's voice); the Qur'anic passages quoted in the doctrinal preface are left to batch 3, referenced by passage links only.
- **Not recorded:** the second-appendix and body dates; the death date of the father and son (the book gives no year in the pages read).

## Excluded items

None this batch.

## Resume point

Scan p. 18 (printed 21), al-Kufi's own account: the opening praise and the doctrinal preface on the imamate (printed pp. 21-23, a contested topic: Zaydi position labelled, perspectives block with the Sunni position first), then the narrative from printed p. 24. Plan: batches of about 6 to 8 printed pages, at most 25 entities each (persons, places, events, tribes, groups), reusing existing records first (`person/al-hadi-yahya-al-rassi`, `place/saada`, `place/sanaa`, `place/najran`, `place/khiwan`, `polity/rassid-dynasty`, `group/zaydiyya`). Check for Qarmatian passages (a historical group, not a blocked organisation) and write from the book's pages only.
