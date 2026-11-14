# lib-sira-hadi-ila-al-haqq: Sirat al-Hadi ila al-Haqq (Yahya ibn al-Husayn), ed. Suhayl Zakkar

Lane A, claimed 14 Nov 2026 in `WORK-REGISTRY.md` on the microSD (row `seerah/sira-hadi-ila-al-haqq/seratimamhadi.pdf`, agent claude-sonnet-5-5 / orchestrator-lane-a).

- **Authority:** founder approval recorded as decision record dec-20261114-277 (PR #6577): mine the smallest unstarted seerah, tareekh or sahaba book, then Ibn Sina's Canon from the bones division at page 42, then Zij al-Sabi. Printed pp. 532, 546 and 666 of Kitab al-Manazir are not covered and stay held.
- **Source on the drive:** `books/seerah/sira-hadi-ila-al-haqq/seratimamhadi/` (`pages.json`, 461 OCR pages, already extracted; no new OCR needed). Source record `source/sira-hadi-ila-al-haqq`, work record `work/sira-hadi-ila-al-haqq`. Cite key `{cite:sira-hadi-ila-al-haqq p.N}`.
- **Page offset:** printed page = scan page + 3 (scan p. 12 = printed 15; the narrative starts at scan p. 14 = printed 17). Cites use the printed page.
- **School label:** a Zaydi source in the voice of the imam's followers. Each record says so and attributes praise and marvels to the book; no verdict in the museum's voice.

## Batches

- **Batch 1 (this PR):** the editor's preface (printed pp. 5-10), the opening page (pp. 15-16) and the first lines of the narrative (pp. 17-18). Added prose for the work record in ar, en and ur; four new person records (Ali ibn Muhammad ibn Ubaydallah al-Abbasi, his father Abu Jafar Muhammad ibn Ubaydallah, Muhammad ibn Sulayman al-Kufi, Suhayl Zakkar), each in ar, en and ur. All draft.

## Judgments recorded

- **Narrators corrected.** `work/sira-hadi-ila-al-haqq` listed `person/yala-ibn-muhammad-al-yafrani` (a Zanata amir of the Maghreb, d. 347 AH, from Ibn Khaldun) and al-Hadi himself as authors, and its summary named "Ya'la ibn Muhammad". The book's own opening leaf (printed p. 15) and the editor (pp. 7-8) name Muhammad ibn Sulayman al-Kufi and Ali ibn Muhammad ibn Ubaydallah al-Abbasi al-Alawi; the earlier reading is a misreading of the title-page OCR. The work now lists the two real narrators. The Yafrani record is untouched and no longer linked from this book. Held for the founder: whether that unrelated record needs any further change (none made).
- **Genealogy of Ali ibn Muhammad.** The printed chain on p. 15 is garbled in the OCR (one name reads as a fragment). Only the two ends are recorded (Ali ibn Muhammad ibn Ubaydallah, and al-Abbas ibn Ali). To check against the page image if the PNGs are ever generated (`pages-png/` is empty on the drive).
- **Reading of "hujja" (p. 8):** "a boy on whom no obligation before God had yet fallen" (not yet of age), not pilgrimage.
- **Not recorded:** the second-appendix and body dates; the death date of the father and son (the book gives no year in the pages read).

## Excluded items

None this batch.

## Resume point

Scan p. 14 (printed 17) from "وكان الهادي إلى الحق يحيى بن الحسين ... قد استدعي من الرس", through the body of the narrative. Plan: batches of about 6 to 8 printed pages, at most 25 entities each (persons, places, events, tribes, groups), reusing existing records first (`person/al-hadi-yahya-al-rassi`, `place/saada`, `place/sanaa`, `place/najran`, `place/khiwan`, `polity/rassid-dynasty`, `group/zaydiyya`). Check for Qarmatian passages (a historical group, not a blocked organisation) and write from the book's pages only.
