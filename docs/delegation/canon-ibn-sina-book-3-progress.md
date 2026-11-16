# Canon of Medicine, Book III (diseases of each organ, head to toe): plan and progress

_Plan written 16 Nov 2026 by a Lane A4 worker (Claude Sonnet 5.5), read-only against the harvest drive and `origin/main` (009187ac90). No record has been written yet. This file is the book's own ledger, like `canon-ibn-sina-book-2-progress.md` for Book II; ledger lines from the manifests of the Book III packets are appended below the plan by the lander._

## 1. Where Book III is and what state it is in

- **Volume.** Book III is the whole of print volume 2: `canon-ibn-sina-print-v2` (Dar al-Kutub al-Ilmiyya, Beirut, 1st ed. 1420 AH / 1999 CE, notes by Muhammad Amin al-Dannawi; 864 scan pages; source record `source/canon-ibn-sina-print-v2` exists). Book II (simple drugs) is the end of volume 1 and Book IV (fevers and the like) opens volume 3.
- **Pages (scan).** 1 title, 2 verso, 3 the Book III preface (22 fanns, each in maqalat, each in fusul), 4 blank, **5 Fann 1 begins (head and brain)**, the text runs to **840** (Fann 22 is the last), and **841 to 864 are the contents list** (about 540 `فصل` lines; the list carries no page numbers, so it is a checklist, not a page map). The printed numeral at the head of each page equals the scan page (checked at 47, 100, 300, 500, 800, 864), so every citation is `{cite:canon-ibn-sina-print-v2 p.N}` with the scan page, the same convention as the Book II packets on v1.
- **OCR.** Complete and on the microSD: 864 of 864 pages, all with text (`source: ocr`; the Medicine Browser passages cite it as Apple Vision OCR). Files: `/Volumes/exmicroSD/islam-museum-harvest/books/medicine-science/canon-ibn-sina-print-v2/canon-ibn-sina-print-v2/{book.txt,pages.json,meta.json}`, marker `[pN]` opens page N; PDF (22 MB) at `/Volumes/exmicroSD/islam-museum-harvest/raw/library/medicine-science/canon-ibn-sina-print-v2/canon-ibn-sina-print-v2.pdf` for `pdftoppm -r 100 -f N -l N`. Average 2,350 characters a page (denser than Book II: running prose, not entries), only page 4 is blank, pages 252, 284 and 488 are short (chapter ends). The text is clean Arabic with the edition's English glosses interleaved in parentheses (`Head`, `Brain`), some garbled (`Htead`), and an occasional clause garbled enough to need the page image. **No new OCR is needed.** (Register row `canon-ibn-sina-print-v2`: `ocr.state: complete`, `ocr_archive: none`, so the deletion gate for the drive copy is not met; nothing here deletes anything.)

## 2. Is Book III claimed?

No. `docs/library/harvest-register.yaml` row `canon-ibn-sina-print-v2` says only `mining: in_progress` with 53 data files citing the volume, and its note ("another worker is mining the Canon") is the generic one; it records no `ranges_mined` for Book III. Those 53 files are the Medicine Browser harvest: 50 `passage/qanun-v2-tibb-<page>` excerpts of at most 40 words, `source/canon-ibn-sina-print-v2`, `work/al-qanun-fi-al-tibb`. `WORK-REGISTRY.md` has one row that reaches v2, `canon-ibn-sina-print-v1..v3 (Canon Book I from scan p.42, Fann 2-4)` (claude-sonnet-5-5 / lane-a-a2-canon, `active`, 14 Nov): it covers Book I only, Book I is finished, and the row is stale; the orchestrator should release it. `BOARD.md`, `RESUME.md` and `docs/library/enrichment/claims.yaml` carry no Book III item. To start: add a `WORK-REGISTRY.md` row for `canon-ibn-sina-print-v2 (Canon Book III, scan 5 to 840; mine from existing OCR text, no new OCR, no download)` and, at the first train, set `mining.ranges_mined` and `resume_note` on the v2 register row (lander, in the manifest `registers.harvest` field).

## 3. Structure of Book III (scan pages)

| Fann | Subject | Scan pages | Pages | Maqalat (scan page where each opens) |
|---|---|---|---|---|
| 1 | head and brain | 5 to 134 | 130 | 5 general laws, signs, anatomy; 44 pains of the head (headaches); 76 swellings and breaks of continuity; 89 diseases of the head and most of their harm; 113 brain disorders of voluntary movement |
| 2 | the nerves | 135 to 160 | 26 | 135 |
| 3 | the eye | 161 to 216 | 56 | 161 general; 176 the globe; 193 the lid; 201 sight and its acts |
| 4 | the ear | 217 to 233 | 17 | 217 |
| 5 | the nose | 234 to 252 | 19 | 234 smell and discharges; 245 the rest |
| 6 | mouth and tongue | 253 to 265 | 13 | 253 |
| 7 | teeth | 266 to 279 | 14 | 266 |
| 8 | gums and lips | 280 to 284 | 5 | 280 |
| 9 | throat | 285 to 300 | 16 | 285 |
| 10 | lung and chest | 301 to 369 | 69 | 301 voice and breath; 327 cough, spitting blood; 340 theory of swellings; 357 practice |
| 11 | heart | 370 to 394 | 25 | 370 principles; 379 particulars |
| 12 | breast | 395 to 400 | 6 | 395 |
| 13 | oesophagus and stomach | 401 to 488 | 88 | 401; 432 pain, weakness, appetite; 451 digestion; 459 organic and sympathetic diseases; 467 by contents |
| 14 | liver | 489 to 553 | 65 | 489; 503 weakness, obstructions; 514 swellings; 529 humours of the liver |
| 15 | gall bladder and spleen | 554 to 579 | 26 | 554 anatomy, jaundice; 568 the spleen |
| 16 | intestines | 580 to 659 | 80 | 580 diarrhoeas; 601 their cures; 621 pains; 632 colic and ileus; 652 worms |
| 17 | the anus | 660 to 672 | 13 | 660 |
| 18 | the kidney | 673 to 695 | 23 | 673; 677 swellings |
| 19 | bladder and urine | 696 to 724 | 29 | 696; 707 |
| 20 | male genital organs | 725 to 753 | 29 | 725 (and desire); 747 |
| 21 | women's organs | 754 to 811 | 58 | 754 anatomy, conception; 770 pregnancy and birth; 787 diseases of the womb; 799 position and swellings |
| 22 | external and peripheral parts | 812 to 840 | 29 | 812 disorders of quantity and position; 821 pains |

The contents list (841 onward) heads the fanns in a different order for 15 and 16 (intestines before gall bladder); the body order above is the printed order.

## 4. What Book III yields

- **Unit.** One record per named condition or topic, gathering the book's chapters on it (causes, signs, course, cure) under one citation range; where a condition is split across chapters the record cites the ranges at the page breaks. Not one record per `فصل`.
- **Count.** About 540 `فصل` lines in the contents list; after dropping the "general signs" and "general regimen" chapters and merging the "types of X" with the "cure of X" chapters, an estimated **350 to 450 condition records**, plus about 40 doctrine records (the head, the signs read from each organ, the laws of cure, anatomy openers) that are `concept`s of the same family. That is about **25 packets of at most 25** (some packets will carry fewer where the chapters are doctrinal and dense). These are estimates from the contents list, not a count of finished records.
- **Existing records.** None for the conditions themselves: a search of the ar and en labels in `data/` for 35 core conditions (headache, migraine, epilepsy, apoplexy, facial palsy, palsy, ophthalmia, earache, toothache, quinsy, pleurisy, pneumonia, cough, asthma, palpitation, hiccup, jaundice, dropsy, colic, piles, stone, gout, melancholia, lethargy, frenzy and others) found no medical-disease concept; the hits are all homonyms (below). Sample of fifteen records that exist and that Book III records link to or must not collide with:
  1. `concept/disease` (Book I definition of disease, cause and symptom; the natural parent, `part_of`);
  2. `concept/symptoms-and-signs`; 3. `concept/medical-treatment`; 4. `concept/regimen-of-health`; 5. `concept/anatomy`; 6. `concept/medicine`;
  7. `concept/al-humma` (fever, the hadith frame, kind scientific); 8. `concept/al-taun` (plague, kind belief);
  9. `concept/canon-urine-colour-in-jaundice` (Book I urine chapters; jaundice itself is Book III Fann 15, scan 554);
  10. `concept/canon-dysentery-from-cold-in-infants` (Book I infant care; the adult diarrhoeas are Fann 16, scan 580);
  11. `concept/canon-hot-brain-swelling-in-infants`; 12. `concept/canon-throat-swelling-and-snoring-in-infants`; 13. `concept/canon-causes-of-swelling`; 14. `concept/canon-signs-of-hot-and-cold-swellings` (Book I swelling theory, which Book III's organ chapters apply);
  15. `work/al-muhadhdhab-fi-al-kuhl` (an eye medicine work; Fann 3 links to it by `mentions`);
  and the 50 `passage/qanun-v2-tibb-<page>` excerpts (Medicine Browser). Homonyms that force the `-tibb` suffix on a Book III slug: `person/sara` (sar', epilepsy), `concept/ramad` (ashes; ramad, ophthalmia), `concept/qay` (vomit, fiqh), `concept/dud` (the dyers' worm; dud, worms), `concept/bawl` (urine as a drug), `concept/ijhad` (abortion, fiqh), `concept/ihtilam` (wet dream, fiqh), `concept/aqr` and `concept/uqr` (fiqh), `concept/ruaf-fiqh`, `group/judham`. The Book I `canon-*` records are `kind: scientific`, `wings: [ideas]`, `part_of concept/disease`.
- **Authorities.** The book names Galen, Hippocrates, Dioscorides, Rufus and others as it goes; they are `mentions`, attributed in the prose; no new `person` records are proposed from Book III (the register still notes a proper Galen record is needed).

## 5. Proposed slices (packets `a4-canon-book3-1` to `-25`, resume points set at maqala or fann boundaries)

| Packet | Scan pages | Content |
|---|---|---|
| 1 | 3 to 44 | preface; Fann 1 maq 1 (anatomy of head and brain, reading the brain from its acts and signs, laws of cure) |
| 2 | 44 to 76 | headaches by cause |
| 3 | 76 to 113 | head swellings, breaks of continuity; scalp, hair and the rest of maq 4 |
| 4 | 113 to 160 | brain movement disorders (epilepsy, apoplexy, facial palsy, tremor, spasm); Fann 2 nerves |
| 5 | 161 to 192 | Fann 3 maq 1 to 2 (eye anatomy, the globe) |
| 6 | 193 to 233 | Fann 3 maq 3 to 4 (lid, sight); Fann 4 ear |
| 7 | 234 to 265 | Fann 5 nose; Fann 6 mouth and tongue |
| 8 | 266 to 300 | Fann 7 teeth; Fann 8 gums and lips; Fann 9 throat |
| 9 | 301 to 339 | Fann 10 maq 1 to 3 (voice, breath, cough, spitting blood) |
| 10 | 340 to 369 | Fann 10 maq 4 to 5 (swellings of lung and chest) |
| 11 | 370 to 400 | Fann 11 heart; Fann 12 breast (breast conditions labelled, see 7) |
| 12 | 401 to 431 | Fann 13 maq 1 (oesophagus and stomach principles) |
| 13 | 432 to 466 | Fann 13 maq 2 to 4 (stomach pain, appetite, digestion, organic diseases) |
| 14 | 467 to 502 | Fann 13 maq 5; Fann 14 maq 1 (liver principles) |
| 15 | 503 to 528 | Fann 14 maq 2 (weakness, obstructions) |
| 16 | 529 to 553 | Fann 14 maq 3 to 4 (swellings, humours of the liver) |
| 17 | 554 to 579 | Fann 15 gall bladder, spleen, jaundice |
| 18 | 580 to 620 | Fann 16 maq 1 to 2 (diarrhoeas and their cures) |
| 19 | 621 to 659 | Fann 16 maq 3 to 5 (pains, colic, ileus, worms) |
| 20 | 660 to 695 | Fann 17 anus; Fann 18 kidney |
| 21 | 696 to 724 | Fann 19 bladder and urine |
| 22 | 725 to 753 | Fann 20 male organs (labelled, see 7) |
| 23 | 754 to 786 | Fann 21 maq 1 to 2 (anatomy of the womb, conception, pregnancy, birth: labelled) |
| 24 | 787 to 811 | Fann 21 maq 3 to 4 (diseases and swellings of the womb: labelled) |
| 25 | 812 to 840 | Fann 22 external and peripheral parts |

Order of work: 1 to 21 and 25 first; 22 to 24 last, after the ruling asked for in section 7. Each packet closes at the heading before the next, so the resume point is always a named heading; the first drafter checks the slice's `فصل` list against the contents list (841 to 864). The maqala boundaries are read from the OCR (the Fann 10 second maqala and the Fann 20 and 22 headings are partly garbled), so a drafter confirms each boundary on the page image.

## 6. Entity classes, slugs, citations, shape

- **Class and kind.** `concept`. Proposed `kind: scientific` (the kind of the Book I `canon-*` records and of `concept/al-humma`; Book II drugs are `natural`), `wings: [living]`, `tags: [tibb-browser, tibb-tibb]` (the Medicine Browser tags that put the records in `/api/v1/tibb.json`; plan 57 section 2; Book II uses `tibb-dawa` for drugs), `relations: part_of concept/disease` with `sources: [source/canon-ibn-sina-print-v2]`. An organ hub per fann (22 `concept` records, `part_of concept/anatomy`) is optional; it is a decision for the orchestrator, not needed to start.
- **Slug.** The Arabic name transliterated in the museum's plain ASCII, as in Book II (`aqhwan`, `anfahah`), and **`-tibb` whenever the same slug exists in any class** (check `data/*/<slug>.yaml` on a fresh `origin/main`, across every class, and against every landed, verified, rejected and drafting packet; the rule Book II's packet 32 followed). Examples of the cases that will come up: `sara-tibb` (epilepsy), `ramad-tibb` (ophthalmia), `dud-tibb` (worms), `qay-tibb` (vomiting), `bawl-tibb`.
- **Citations.** `{cite:canon-ibn-sina-print-v2 p.N}` or `pp.N-M` at a page break; `sources: [source/canon-ibn-sina-print-v2]`; provenance `layer: own-research`, `run: a4-canon-book3-<n>`; `status.review: draft` with the provenance block, trilingual in the same packet.
- **Sections** (ar, en, ur, same heading style as Book II): `الماهية والأسباب` / Nature and causes; `العلامات` / Signs; `المآل` / Course and outlook (only where the book gives it); `التدبير` / Approach to treatment (principles only, see 7); and the labelled section for the reproductive subjects. Doctrine records use the sections the book's chapter has.
- **Rules every Book II packet followed carry over unchanged:** page images rendered with `pdftoppm` for every doubtful clause; no doses, weights, counts, times, ratios or extraction and preparation methods; womb, menses, foetus, milk, semen, conception and desire claims only in the labelled section ("Womb, menses, foetus and desire (labelled book listing, held for the founder's ruling)", in ar and ur with the isolated parenthesis), the summaries saying only that the section exists; identifications only from the book or its footnotes, labelled as the editor's; attributed reports ("a report attributed to the book, without recommendation"); `bahaq`, `baras`, `wadah` transliterated; `tila'` glossed as boiled grape must, `sharab` as a drink; Arabic parentheses isolated; no honorifics, no Qur'an text; `npm run check:packet` PASS from a fresh `origin/main` worktree.

### Conventions confirmed by the verifier of a4-canon-book3-1 (16 Nov 2026), binding on a4-canon-book3-2 onward

- **Parent per record kind**, not `concept/disease` throughout: `part_of concept/anatomy` for anatomy records; `concept/symptoms-and-signs` for records that read signs; `concept/disease` for disease records and for matter and swelling signs; `concept/medical-treatment` for laws-of-cure records.
- **Tags:** `tibb-browser` and `tibb-tibb` on every record, plus `tibb-tashrih` on anatomy records and `tibb-tadawi` on cure records, so the Medicine Browser topic chips (`scripts/tibb.ts`) pick them up.
- **Vein choice is stated only as a principle** (for example that the evacuation is drawn farther from the head the farther off the arrival); no vein name, side, site, larger or smaller vessel, binding of limbs, or route of application is written.
- **Footnote glosses are labelled as the editor's** ("the editor's footnote glosses ..."); printed names (al-bayda, shaqiqa, sabar) stay as printed and identify nothing.
- **No application or timing words** in treatment records ("from above downward", "at feeding time", vinegar, rose water, sutures as a route, "dry the side of the head" are out); each treatment record closes with one line saying recipes, quantities, vein names and application methods are not reproduced.
- Greek names transliterated as printed (Rutlus, qaranitus on 20, faranitus on 20-21, lethargus, birsam). Section names follow what the book's chapter says; doctrine chapters have no "Course" section.

## 7. What is different from Book II, and what needs a decision

1. **The book is mostly treatment.** Book III's chapters on cure are recipes (compound drugs, quantities, cooking and application methods) and procedures (venesection, cupping, cautery, incision, bladder and stone surgery, the extraction of the foetus). The records give cause, signs, course and the *kind* of approach (bleed, purge, cool, dry, regimen) as attributed statements, and say "recipes and quantities are not reproduced" and "the procedure is not reproduced"; a recipe or a procedure is never rewritten. This is the Book II rule applied to a book where it removes most of the text, so the drafter must read for the doctrine (temperament, humour, cause, sign) and not copy the pharmacy.
2. **Reproductive subjects (Fann 12 breast, 20, 21; also the womb passages elsewhere).** Whole records (the womb, conception, pregnancy, birth, the dead foetus, impotence, desire) are labelled content. Proposal: write the record with a neutral summary that names the subject and says the chapter's statements are in the labelled section, the whole body under the labelled heading, as every Book II record does for its reproductive lines; and hold packets 22 to 24 (about 90 headings, 55 pages) until the founder confirms that records whose subject is reproduction are kept in this form. If he rules them out, they are an exclusion (a proposal for the founder, never decided by the worker).
3. **`kind` and tags** in section 6 are proposals; the orchestrator confirms or changes them before packet 1 is drafted, because renaming later is expensive.
4. **Alternative names and Greek terms** (the book gives Persian and Greek names for many conditions and the OCR garbles some) go in `aliases` only when the book gives them as names of the same condition; otherwise a `GEMINI:` line.
5. **Medicine Browser.** The tags in section 6 are what let the records appear in the Medicine Browser's curated section with no new code; the three-language landing text does not change.

## 8. Next step

A drafter takes packet 1 (scan 3 to 44) after the orchestrator confirms section 6 and adds the `WORK-REGISTRY.md` row; the verifier checks against `book.txt` and page images as for Book II. Ledger lines from the packet manifests are appended below by the lander.

## Ledger

- Lane A4 (packet a4-canon-book3-1, 16 Nov 2026): Canon Book III, volume 2 (canon-ibn-sina-print-v2), scan 5 to 44, the whole of Fann 1 maqala 1 (general laws of diseases of the head and brain): 25 concepts. By scan page: 5 marifat-al-ras-wa-ajzaih; 5-9 tashrih-al-dimagh; 9-10 amrad-al-ras-al-failah-lil-araad (labelled womb line on 9); 10-11 dalail-ahwal-al-dimagh (labelled womb line on 10); 11 istidlal-kulli-min-afal-al-dimagh; 11-13 istidlal-min-al-hawass; 13-14 istidlal-min-al-quwa-al-siyasiyya-wa-al-ahlam; 14-15 istidlal-min-al-afal-al-harakiyya-wa-al-nawm; 15-16 istidlal-min-intifad-al-fudul-wa-al-shaar; 16-18 istidlal-min-al-muwafaqa-wa-al-mukhalafa; 18-19 istidlal-min-miqdar-al-ras (labelled seminal-matter line on 18); 19 istidlal-min-shakl-al-ras; 19-20 istidlal-min-thiql-al-ras-wa-hararatih-wa-awjaih; 20 istidlal-min-al-ayn; 20-21 istidlal-min-al-lisan-wa-al-wajh-wa-al-raqaba; 21-22 istidlal-min-al-musharakat; 22-23 al-udw-alladhi-yalam-al-dimagh-bi-musharakatih (labelled womb line on 22); 23-24 mizaj-al-dimagh-al-mutadil-wa-al-mufrad; 24 al-amzija-al-murakkaba-lil-dimagh; 24-25 alamat-sut-al-mizaj-bila-madda; 25 alamat-ghalabat-al-mawadd-fi-al-ras; 26 alamat-awram-al-dimagh; 26-28 qawanin-ilaj-amrad-al-ras-al-istifragh; 28-36 inzaj-al-madda-wa-jadhbuha-wa-tanqiyat-al-ras; 38-44 ilaj-awram-al-ras-wa-sut-al-mizaj.
- Conventions applied from the plan, with three small departures: (1) parent: part_of concept/anatomy for the two anatomy records, concept/symptoms-and-signs for the reading-of-signs records (the Book I canon-* sign records use it), concept/disease for the diseases and the matter and swelling signs, concept/medical-treatment for the three laws-of-cure records, not concept/disease throughout; (2) tags: tibb-browser and tibb-tibb for all, plus tibb-tashrih on the anatomy records and tibb-tadawi on the cure records (scripts/tibb.ts topics) so the Medicine Browser topic chips pick them up; (3) the sections are named for what the book's chapter says (the doctrine chapters have no 'Course' section; the treatment ones carry one section stating that recipes, quantities, vein names and application methods are not reproduced). Doctrine only: no doses, quantities, times, ratios, named drug combinations or procedure details were written; the drug and plant names of 28 to 44 (lists of simples, compound pills, oils and poultices, and the vein and cupping sites) are left out, and the cautery-site measurement on 27 is not reproduced.
- Resume point for packet a4-canon-book3-2: scan 44, maqala 2 (pains of the head, 'wa-huwa asnaf'), the chapter 'kalam kulli fi al-suda' (general discourse on headache, scan 44 to 46, which defines headache as pain in the organs of the head and lists its causes: change of temperament, breaking of continuity, swellings and combinations); then the headaches by cause (46 to 53), signs foretelling headache in diseases (53), and the general regimen of headache (53 on). Pages 36-37, 39 and 42 hold only drug lists and recipes. Packet 22 to 24 (reproductive fanns 12, 20 and 21) are held for the founder's ruling and were not touched.
- EXCLUSION (proposal for the founder, packet a4-canon-book3-1): concept/amrad-al-ras-al-failah-lil-araad, concept/dalail-ahwal-al-dimagh, concept/al-udw-alladhi-yalam-al-dimagh-bi-musharakatih: the lines on the womb (the brain's superfluous moisture cleared in the womb or after it, the womb in the list of organs sharing with the brain, the head sharing with the womb); concept/istidlal-min-miqdar-al-ras: the line on seminal matter as the cause of a small or large head; kept as labelled listings and kept out of the summaries except as 'a labelled line in a section held for the founder's ruling' - Womb, menses, foetus, semen and desire claims are labelled content. Proposal: the founder rules how these listings are shown, as for the Book II packets.
- EXCLUSION (proposal for the founder, packet a4-canon-book3-1): Recipes, doses, weights, drug and plant names, compound pills, oils and poultices, the names of veins and the sites of venesection, cupping and cautery, methods of application (scan 26 to 44) - Measured quantity, named drug combination or procedure detail, as in the Book II packets; the three treatment records say so in a closing line of each section.
- EXCLUSION (proposal for the founder, packet a4-canon-book3-1): Scan 36, 37, 39, 42 (lists of simple drugs, compound pills and recipes); scan 3 (preface) - No doctrine beyond the principle lines already carried; the preface only announces the 22 fanns and is not a record.
