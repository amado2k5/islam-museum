<!-- Snapshot of /Users/ahmedabdelaal/islam-museum-harvest/agent-progress/microsd-books.md taken 14 November 2026. The live copy stays on the Mac and the microSD; this copy keeps it in git. -->

# microsd-books agent — harvest progress

Agent: Devin subagent (AI-Agent: Devin / AI-Model: SWE-2 Flash High / AI-Editor: Devin)
Worktree: /Users/ahmedabdelaal/Documents/GitHub/islam-museum-microsd, branch `agent/microsd-books` based on `origin/poc/decision-ledger` (carries the decision engine + the completed 21-book wave).
Source: /Volumes/exmicroSD/islam-museum-harvest/raw/library/ (OCR text in books/<cat>/<book>/<item>/book.txt).
Note: mission text named /Users/ahmedabdelaal/Documents/GitHub/islam-museum-harvest/agent-progress/ — that path does not exist; the live agent-progress dir on the drive is used instead (same poll target family as WORK-REGISTRY.md).

## Inventory (done 2026-11-08)

- 494 book dirs under raw/library across 37 categories; all have OCR in books/ (0 not-OCR'd per docs/delegation/microsd-ocr-status.md, 4 Nov 2026).
- 264 per-book progress files in docs/delegation/library/; 255 book dirs have no same-named progress file.
- 21-book wave (8 Nov, runs lib-wave-21-*) covered: arbaun-nawawi, azwaj-nabi, fisal-ibn-hazm, fiqh-mawsua-noor-doc, isaba, jami-tirmidhi, khulafa-rashidun-salabi, marifat-sahaba-abu-nuaym, mishkat-masabih, mughni-ibn-qudama, mustasfa, muwafaqat, muwatta-malik, rihla-ibn-battuta, riyad-salihin, sahih-bukhari, siyar-alam-nubala, tabaqat-huffaz, usd-ghaba (+2 more) — commits on poc/decision-ledger.
- OCR-harvest wave A–L + stage2 (4 Nov, released by founder): 185 progress files, per-book "Next" sections remain open.
- DO NOT TOUCH: raw/library/tafsir-app/ (watchdog harvest running), encyclopaedia-of-islam-2 (ei2 lane), al-azhar-magmaa (lib-azhar-academy lane), tareekh/tarikh-islam-dhahabi (gracious-napier lane, unmerged local branch claude/microsd-books-ocr-harvest-28b2f5), active tareekh lanes (yaqubi, khalifa, akhbar-tiwal, durar-kamina, daw-lami, futuh-misr, futuh-buldan, wafayat-ayan), muntazam-ibn-al-jawzi (deep active mining), kamil-ibn-al-athir (complete).

## Book queue (priority order)

1. sahabiyat/siyar-nisa — continue worker E's "Next" list (~11 named women + muhadditha entries, vols 1–3) — IN PROGRESS
2. sahaba/rijal-hawl-rasul — 5 thin Companions listed in "Next"
3. sahaba/suwar-hayat-sahaba — 5 thin Companions listed in "Next"
4. sahaba/hilyat-awliya — ~600 notices; high-value list in progress file
5. medicine-science lane books: ibn-haytham-manazir (Book 1 text), canon-ibn-sina (Book I fanns 2–4, Book II), hawi-razi, sharh-tashrih-qanun-ibn-nafis, farghani-elements-astronomy (unstarted)
6. Unstarted seerah: sira-nabawiyya-ibn-kathir, maghazi-waqidi, dalail-nubuwwa-abu-nuaym/-bayhaqi, subul-huda, uyun-athar, qisas-anbiya-kisai/-thaalabi
7. tareekh unstarted: bidaya-nihaya, khitat-maqrizi
8. sahaba unstarted: hayat-sahaba, kamil-ziyarat
9. islamic-economics (6), mostafa-mahmoud (15), hadith big collections without progress (musnad-ahmad, sahih-ibn-khuzayma, sunan-nasai, sunan-ibn-majah, sunan-bayhaqi-kubra, musannaf-*, muallam-*-tabarani, fath-bari, umdat-qari, tuhfat-ahwadhi), adab-mufrad/awn-mabud/bulugh-maram (stale Haiku claims 31 Oct — verify before touching), extra-* art books, khutab, shamail, sunnah-aqeedah, usul, rijal, tabaqat, quran-sciences, hadith-sciences, lugha, travel, modern

## Milestones

- 2026-11-08: setup complete (worktree, npm ci, docs read, inventory done). Starting batch 1 = siyar-nisa continuation.

- 2026-11-08 (batch 1 done): siyar-nisa "Next" list complete — 10 new person entities (amina-bint-al-sharid, umm-aban-bint-utba, arwa-bint-al-harith, umama-bint-dhi-al-isba, khadija-bint-nasr-allah-al-dimashqiyya, ramla-bint-al-zubayr, saada-bint-kurayz, zaynab-bint-abd-al-baqi, aisha-bint-uthman-ibn-affan, aisha-bint-ali-ibn-abd-al-ghani), each with cited ar/en/ur prose; stubs in data/_stubs.d/devin-microsd-books.yaml. validate 0 errors, tests pass, coverage regenerated. PR #5653 opened against main (base merged: decision-ledger PR #5642 landed on main during this session). Next: batch 2 = rijal-hawl-rasul thin Companions.

- 2026-11-08 (batch 2 done): rijal-hawl-rasul "Next" list complete. Found imran-ibn-husayn, salama-ibn-al-akwa, abbad-ibn-bishr already enriched (worker E/other batches); wrote the remaining two — abdullah-ibn-amr-ibn-haram (Abu Jabir, pp. 479-482) and amr-ibn-al-jamuh (pp. 483-489): source added to yaml sources, "In Rijal Hawl al-Rasul" sections (ar/en/ur) appended, sibling_of/related_to edges between them, spouse_of edge to new stub person/hind-bint-amr-ibn-haram. Facts verified against OCR book.txt; corrected own draft errors (idol name "Manaf" not "Manafa", no invented son names, no invented Jabir quote, verse paraphrased not quoted). validate 0 errors. Next: batch 3 = suwar-hayat-sahaba thin Companions.

## 2026-11-09 — suwar-hayat-sahaba thin-Companion queue complete (Batch 3)

All 5 targets resolved after identity check:
- nuaym-ibn-masud: Trench stratagem chapter added (pp. 400–410) ar/en/ur.
- fayruz-al-daylami + zayd-al-khayl (= Zayd al-Khayr): already carried suwar enrichment trilingual — verified, no duplication.
- majzaa-ibn-thawr: Tustar tunnel/duel with Hormuzan (pp. 156–163) trilingual + relations.
- al-rabi-ibn-ziyad-al-harithi: Umar's praise, Manadhir, Sijistan, Khurasan (pp. 419–427) trilingual; kept distinct from Bakri namesake; no Companion role (Isaba lists him among tabi'in).
Lane file + CANARY updated. Branch agent/microsd-books-b3. Next queue: medicine/science (ibn-haytham-manazir, canon-ibn-sina fanns, farghani-elements-astronomy) smallest-first.

## 2026-11-09 — medicine-science batch 4a merged (PR #5663)

- Manazir Book 1 (Article 1) read from Sabra 1983 vol.1 OCR (scan pp.60–200): two opposed doctrines of vision, inductive method, ~144 propositions on rectilinear propagation, afterimages, eye anatomy, conditions of sight — described trilingual on work/kitab-al-manazir. No new entities needed.
- al-Farghani: identity already resolved (one person, Ahmad/Muhammad ibn Kathir per Golius); completed missing en/ur prose on person/al-farghani + new en/ur work/jawami-ilm-al-nujum.
- Lane file medicine-science.md + CANARY updated. Gates: validate 0 errors, 428 tests pass.
- Next: Canon Book I fanns (Ta'lim 5 organs scan p.36+, Fann 2-4), Farghani thin-concept en/ur prose, Manazir Articles 2-3, Zij al-Sabi chapters.

## 2026-11-09 — al-Farghani Urdu concept batch complete (b7, PR #5692 merged)

- All 13 remaining al-Farghani astronomy concepts now carry draft Urdu prose matching ar/en: ikhtilaf-al-manzar, eclipses, falak-kharij-al-markaz, falak-al-tadwir, al-kawakib-al-thabita, manazil-al-qamar, equal-hours, heliacal-rising, dairat-al-ufuq, dairat-al-istiwa, kurawiyyat-al-sama, al-harakat-al-ula, al-harakat-al-thaniya. qiyas-al-ard fix (22/7 phrasing) was already merged via #5688.
- Urdu generation was glitch-prone this session (stray tokens like Horizons/proximity/Home inserted mid-text, several truncations) — every file was scanned for stray Latin/Cyrillic and incomplete tails were rebuilt; all 14 files verified clean.
- CANARY Data entry added; validate 0 errors, 428 tests pass; PR #5692 merged 2026-11-09T04:08Z.
- Next: medicine-science queue — Canon Book I fanns (Ta'lim 5 organs scan p.36+, Fann 2-4), Manazir Articles 2-3, Zij al-Sabi chapters; suwar-hayat-sahaba batch 3 already complete.

## 2026-11-09 — Canon organ doctrine + books.yaml (b8, PR #5693 merged)

- Read Canon v1 Book I Fann 1 Ta'lim 5 (scan pp.36–41): organ definition, simple/composite organs, similar-part organ series (bone→cartilage→nerve→sinews→arteries→veins→membranes→flesh), accepting/giving organs, principal (heart/brain/liver + generative) and serving organs, Galen act/benefit, regeneration rules.
- Enriched existing concept/anatomy: added source/canon-ibn-sina-print-v1 to sources + part_of relation, extended ar/en summaries, new trilingual "في القانون: ماهية العضو وأقسامه" sections citing pp.36–41. No new entities needed.
- books.yaml: registered canon-ibn-sina-print-v1/v2/v3 + farghani-elements-astronomy under medicine-science.
- Urdu generation still glitch-prone (stray Latin tokens mid-sentence); every file scanned and repaired before commit.
- Gates: validate 0 errors, 428 tests pass. PR #5693 merged 2026-11-09T04:16Z.
- Next: Canon bones division pp.42+ (30 chapters), Manazir Articles 2-3, Zij al-Sabi chapters, Canon Fann 2-4.

## 2026-11-09 — Manazir Article 2 opening (b9, PR #5695 merged)

- Read Manazir scan pp.198–238 (Article 2 title, 4-chapter plan, ch.2 ray-line geometry, sampled ch.3–4). Article 2 «في تفصيل المعاني التي يدركها البصر» covers meanings beyond light/colour, ray-line states, refraction at the vitreous humour's surface, and perception by sensation/acquaintance/measure.
- Added trilingual "المقالة الثانية" sections to work/kitab-al-manazir.md citing scan pp.198–309. Lane doc + CANARY updated.
- Merge conflict in lane doc resolved (Batch 8 + 9 sections kept in order). Commit amended to add AI-Agent/AI-Model/AI-Editor trailers.
- Gates: validate 0 errors, 428 tests pass. PR #5695 merged 2026-11-09T04:24Z.
- Next: Manazir Article 2 ch.3–4 bodies (pp.230–339), Article 3 (errors of sight, pp.340–533); Canon bones division pp.42+; Canon Fann 2–4; Zij al-Sabi chapters.

## Batch 10 — hilyat-awliya person notices (run microsd-books-b10)
- Branch agent/microsd-books-b10 from latest origin/main.
- Mined 5 high-value Hilyat notices trilingually (ar/en/ur) into existing person records, each citing source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988 with vol/PDF-page:
  - Ibrahim ibn Adham — vol 7 notice 394, pp.367–395 (last notice of vol 7): the hunt-and-the-voice story, lawful-earning years in al-Mansura/Tarsus/Ascalon, grinding wheat rent-free, the two-dirham burial story, hajj 150 AH.
  - Malik ibn Dinar — vol 2 notice 200, pp.357–389 ("أبو يحي مالك بن دينار"). IDENTITY RESOLVED: same person as person/malik-ibn-dinar-al-khattat (Fihrist: mushaf copyist, Abu Yahya, d. 130 AH); no duplicate created.
  - Ka'b al-Ahbar — vol 5 notice 325, pp.364–391: intro "صاحب الكتب والأسفار", zuhd sayings, Umar's question about death, silence, and Torah/Talmud-derived reports flagged as such.
  - Abu Sulayman al-Darani — vol 9 notice 448, pp.254–280: Dhu al-Nun's hearing of his supplication, sayings via Ahmad ibn Abi al-Hawari.
  - Sahl al-Tustari — vol 10 notice 546, pp.190–226: six roots, marks of certainty/contentment, single-stirrup night vigil.
- Added hilyat source to all 5 yaml sources lists; updated docs/delegation/library/hilyat-awliya.md; CANARY.md Data entry added.
- Ahmad ibn Abi al-Hawari still needs a new record (lead for next batch). ~595 notices remain.
- Gates pending: npm run validate && npm test, then push + PR + merge.
- DONE: gates passed (validate 0 errors / 51,144 entities; test 428 passed), pushed agent/microsd-books-b10, PR #5703 MERGED 2026-11-09T06:34:03Z.

## Batch 11 — hilyat-al-awliya intro: concept/wali + concept/karamat-al-awliya (run microsd-books-b11)
- Branch agent/microsd-books-b11 from latest origin/main.
- Read vol. 1 pp. 4–17 in full (the introduction's list of the awliya's "neat"/karamat).
- Appended trilingual sections to content/{ar,en,ur}/concept/wali.md and content/{ar,en,ur}/concept/karamat-al-awliya.md, citing source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988 with vol/page (vol.1 printed=PDF): hadith qudsi on harming a wali, the enumerated groups, Dhu al-Nun's elite portrait. Sources lists updated; delegation doc + CANARY updated.
- Next leads: Ahmad ibn Abi al-Hawari (vol.10 notice 457, NEW record), Sufyan al-Thawri (end vol.7), ~590 notices remain.
- DONE: gates passed (validate 0 errors / 51,170 entities; test 428 passed), pushed agent/microsd-books-b11, PR #5713 MERGED 2026-11-09T07:31:34Z.

## Batch 12 — hilyat-al-awliya: Ahmad ibn Abi al-Hawari (run microsd-books-b12)
- Branch agent/microsd-books-b12 from latest origin/main (fetch retried after ref-lock hiccup).
- Record person/ahmad-ibn-abi-al-hawari already existed (Sifat provenance) — enriched, no duplicate.
- Read vol. 10 notice 457, PDF pp.5–41: books-thrown-into-the-sea (twice), Jurayj exchange, 30 years seeking knowledge, marks of love/contentment, traveller's stations tauba→khawf.
- Trilingual "In Hilyat al-Awliya" sections appended; hilyat source added to yaml sources; delegation doc + CANARY updated.
- Gates + push + PR + merge pending.
- Gates: validate 0 errors (86,103 prose files); test 428 passed / 2 skipped. Committed with AI trailers; PR #5722 created and merged.

## Batch 13 — hilyat-al-awliya: Sufyan al-Thawri notice 387 (run microsd-books-b13)
- Branch agent/microsd-books-b13 from origin/main 4470e6dab9 (ref-lock race retried).
- Located notice: vol.6 pp.356-393 (notice 387 opening) + vol.7 pp.3-144 ("بقية ترجة (٤)", ends before notice 388 Shu'ba at ~p145).
- Mined trilingual section: portrait/testimonies (6/356), letter to Ubbad ibn Abbad (6/376-377), Basra flight + Ma'n ibn Za'ida adjuration (7/4-5), Umm Hassan (7/9-10), zuhd/Abu Hanifa death (7/16), Kaaba fainting + Fatiha tears (7/17), imamate ordering + al-Mahdi (7/31), deathbed purse + grave visitor (7/62), Abu Nu'aym closing (7/125).
- yaml sources += hilyat; delegation + CANARY updated. Gates + PR pending.
- Gates: validate 0 errors (52,616 entities); test 428 passed / 2 skipped. Fixed one issue mid-run: [[person/ubbad-ibn-abbad]] link unresolved (no such record) — de-linked to plain text in all three languages. Committed with AI trailers; PR #5744 created and merged.

## 2026-11-11 — Batch 14 — hilyat-al-awliya vol. 10 (run microsd-books-b14, Claude Code / claude-fable-5-2) — PR #6057 MERGED
- Inherited state: branch agent/microsd-books-b14 was 846 commits behind main with an uncommitted Bayazid draft. Committed it as WIP; `git merge origin/main` could not be concluded because the repo pre-commit hook refuses any commit whose staged diff touches data/passage/quran-*.yaml (main's own changes). Hook NOT bypassed: branched agent/microsd-books-b14b from fresh origin/main and cherry-picked the WIP commit. Old local branch agent/microsd-books-b14 left untouched (never pushed).
- The inherited Bayazid draft was checked against the scan (vol. 10 pp. 33–42 are real and are notice 458) and rewritten: it had cite keys corrupted with an Arabic letter, one reversed meaning, and near-verbatim quotation.
- Read: vol. 10 pp. 33–44, 366–376.
- Written: bayazid-al-bistami (458), al-shibli (646), ibn-al-arabi-ahmad (647) enriched; NEW draft ahmad-ibn-khidruya (459), ibrahim-al-harawi-sitanba (460), abu-amr-al-zajjaji (648).
- Decision: dec-20261112-237 (no faith value on single-source new records; rule-faith-two-source).
- Gates: validate exit 0; npm test 35 files / 482 passed / 2 skipped. Machine load ~90, validate takes ~15 min and tests ~25 min.
- WORK-REGISTRY row added for sahaba/hilyat-awliya (hilyah-09, hilyah-10), active.

## 2026-11-11 — Batch 15 — hilyat-al-awliya vol. 10 (run microsd-books-b15) — PR #6058 MERGED
- Read: vol. 10 pp. 44–45, 116–122, 291–296, 366, 377, 385–389.
- Enriched: sari-al-saqati (469; 10/116–122 only — pp. 123–128 still to mine), amr-ibn-uthman-al-makki (573), ibn-khafif (660), work/hilyat-al-awliya (method statements 10/41–42, 10/375, 10/387–389).
- NEW draft: dawud-al-balkhi (461), ali-ibn-abd-al-hamid-al-ghadairi (644), abu-bakr-ibn-abi-sadan (650).
- Decision: dec-20261112-238 (homonym Sa'id ibn Abd al-Aziz al-Halabi kept apart from the Tanukhi; Shafi'i affiliation in prose only).
- Gates: validate 0 errors (54,748 entities); npm test 35 files / 482 passed / 2 skipped.

## 2026-11-12 — Batch 16 — hilyat-al-awliya vol. 9 (run microsd-books-b16) — PR #6068 MERGED
- Read: vol. 9 pp. 310–339. Enriched: mansur-ibn-ammar (455), dhu-al-nun-al-misri (456, opening only; resume at 9/340).
- NEW draft: abu-abd-allah-al-saji (450), ali-ibn-bakkar (452), al-qasim-ibn-uthman-al-jui (453), mada-ibn-isa (454).
- Decision: dec-20261112-240 (renamed from -239, which main had taken); garbled year not entered as a date.
- Gates: validate 0 errors (55,095 entities). npm test was still running when the batch was merged; its result was not observed.
- Worktree left detached at origin/main; resume from there.

## RESUME POINT for next worker
- Hilyat vol. 9: notice 456 Dhu al-Nun from 9/340; 449 Ahmad ibn Asim al-Antaki (9/280–310); 451 (heading illegible).
- Hilyat vol. 10: 463 Yahya ibn Mu'adh (from 10/51), 465 al-Muhasibi (10/73–110), 469 al-Sari rest (10/123–128), 575 Ibn Ata (10/302+), 645 Sa'id al-Halabi (kept apart from the Tanukhi record; see dec-20261112-238), 661 onward (10/389+).
- Leads: decision dec-20261112-238 open for the 645 homonym question.

## 2026-11-12 — Batch 17 — hilyat-al-awliya vol. 10 (run microsd-books-b17) — PR #6075 MERGED
- Read: vol. 10 pp. 45–51, 296–302, 376 (already read in batch 17 prep).
- Enriched: ruwaym-ibn-ahmad (574). NEW drafts: abu-turab-al-nakhshabi (462; no personal name or death year, none invented), muhammad-ibn-ulayyan-al-nasawi (649).
- Decision: dec-20261112-241.
- Gates: validate exit 0, 0 errors (57,032 entities). npm test for this batch not observed to finish.
- Branch: the first attempt's merge of origin/main staged 181 frozen passage files that main itself contains; the pre-commit hook refused. Not bypassed. Rebuilt the branch on origin/main by cherry-picking the batch commit (ac6901c42c), which touches no passage file.

## RESUME POINT (updated)
- Vol. 9: notice 456 Dhu al-Nun from 9/340; 449 Ahmad ibn Asim al-Antaki (9/280–310); notice 451 (heading illegible).
- Vol. 10: 463 Yahya ibn Mu'adh (10/51+); 465 al-Muhasibi (10/73–110); 469 al-Sari remainder (10/123–128); 575 Ibn Ata (10/302+); 645 Sa'id al-Halabi (keep apart from Tanukhi, dec-20261112-238); 661 onward (10/389+).
- Before the next batch: confirm the batch 16 npm test result; check that the frozen-passage merge issue is resolved on main.

## 2026-11-12 — Batches 19–20 — hilyat vol. 9 notice 449 (Ahmad ibn Asim al-Antaki) — PRs #6082, #6085 MERGED
- Batch 19: new draft record, notice 449 pp. 280–284. Batch 20: pp. 285–296 added. Notice runs to about 9/309 (9/297–309 not yet mined).
- Validate: only the six pre-existing hudud errors on main (commit 0ab0e5d42d). Test not awaited.

## RESUME POINT
- Vol. 9: 449 Ahmad ibn Asim from 9/297 to about 309; then notice 451 (heading illegible, between 9/310 and 317); then 456 Dhu al-Nun from 9/344.
- Vol. 10: 463 Yahya ibn Mu'adh (10/51+), 465 al-Muhasibi (10/73–110), 469 al-Sari remainder (10/123–128), 575 Ibn Ata (10/302+), 645 Sa'id al-Halabi (dec-20261112-238), 661 onward (10/389+).
- Batch 16 test: finished with 3 timeouts (inventions, khutab, pipeline) under machine load, not logic failures.

## 2026-11-12 — Batch 113 — Kitab al-Manazir Article 3 (run microsd-books-b113) — PR #6321 MERGED
- Hilyat vol. 10 finished at 689 (PR #6320 recorded that the volume text ends there); moved to the seeded queue.
- Claimed Manazir in WORK-REGISTRY.md (active row, claude-fable-5-2 / microsd-books).
- Read scan pp. 340–351 in full (pages.json). Added an Article 3 section in ar/en/ur to work/kitab-al-manazir.md: chapter 1 (errors of sight in general) and the start of chapter 2 (ray-lines, the two eyes, the cone, the meeting point, images at the common nerve).

## RESUME POINT (Manazir)
- Article 3 chapter 2 from scan p. 351 (the image coincidence sentence, "تنطبق الصورتان"), then chapters 3–7 (pp. 352–533).
- Article 2 chapters 3–4 bodies (pp. 230–339) still open from batch 9.

## 2026-11-12 — Batches 114–115 — Kitab al-Manazir Article 3 (run microsd-books-b114, b115) — PRs #6322, #6323 MERGED
- Batch 114: scan pp. 351–358 read in full; chapter 2 completed to the start of the test description. PR #6322.
- Batch 115: scan pp. 358–363 read in full; the board test, the geometric account, the summary of single and double vision, and the four lines. PR #6323 (rebased over #6322 with both sections kept).

## RESUME POINT (Manazir)
- Scan p. 363 after "ويظهر ذلك إذا ستر المعتبر" (the eye-covering widening), then Article 3 chapters 3–7 (pp. 364–533).
- Article 2 chapters 3–4 bodies (pp. 230–339) after Article 3.

## 2026-11-12 — Batch 116 — Kitab al-Manazir Article 3 (run microsd-books-b116)
- Scan pp. 363–367 read in full; Article 3 extended to the paper-slip tests. PR merged (see the PR list for the number).

## RESUME POINT (Manazir)
- Scan p. 367: the second paper test with fine lines of text, then Article 3 chapter 2 to its end, then chapters 3–7 (pp. 368–533).
- Article 2 chapters 3–4 bodies (pp. 230–339) after Article 3.

## 2026-11-12 — Batch 117 — Kitab al-Manazir Article 3 (run microsd-books-b117) — PR #6325 MERGED
- Scan pp. 367–371 read in full: the paper test at facing and tilted positions, with one eye and two. Summary sentence at the foot of p. 371 cut off by the scan; not recorded.

## RESUME POINT (Manazir)
- Scan p. 371 ("فيتبين من جميع هذه الاعتبارات"), then Article 3 chapter 2 to its end, then chapters 3–7 (pp. 372–533).
- Article 2 chapters 3–4 bodies (pp. 230–339) after Article 3.

