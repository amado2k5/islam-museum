# dhayl-tabaqat-hanabila: Ibn Rajab, al-Dhayl ala Tabaqat al-Hanabila

- Lane: OCR harvest, worker F (Claude Code, claude-opus-5-5, run ocr-harvest-2026-11-04)
- Text: `harvest-text/books/tabaqat/dhayl-tabaqat-hanabila/` (not in git)

## Items
| Item | What it is | Used |
|---|---|---|
| `dthanabila` | Part 2, corrected by Muhammad Hamid al-Fiqi, Cairo 1372/1953; printed page = PDF page | yes: `source/dhayl-tabaqat-hanabila-faqi-v2` |
| `03-62517` | Clean text of another edition's vol. 3, starting at entry 238, no title page | not used (edition not identifiable) |

## Records
New
- `source/dhayl-tabaqat-hanabila-faqi-v2` (self-listing)
- prose trio for `work/dhayl-tabaqat-al-hanabila`

Enriched
- `work/dhayl-tabaqat-al-hanabila`: was a Wikidata draft card. It is now published, with the edition, its structure and the author's method (pp. 1, 5–30).
- `person/abd-al-ghani-al-maqdisi`: entry 214, pp. 5–30.
  - Birth is marked debated: 541 (al-Diya'), against 543 or 544 (al-Mundhiri, Ibn al-Najjar).
  - Death: Monday 23 Rabi' I 600, buried in al-Qarafa. Ibn al-Hanbali's 595 is noted as an error.
  - Travels, teachers and works are added.
  - The Isfahan and Mosul episodes are added.
  - A perspectives block covers the Damascus trial: al-Diya's account, the opponents' account, then Ibn Rajab's and al-Dhahabi's rejection of the claimed consensus.
  - The Egypt episodes are added, from both accounts.
  - Edges added: `student_of` Abd al-Qadir al-Jilani, al-Silafi and Abu Musa al-Madini; `authored` Umdat al-Ahkam and al-Kamal; `lived_in` Damascus.
- `work/umdat-al-ahkam` and `work/al-kamal-fi-asma-al-rijal`: these were draft cards. Their summaries are now checked on p. 19 and they are published.

## Flags for other lanes
- The earlier summary and prose of `person/abd-al-ghani-al-maqdisi` give the death year as "1204 CE". 23 Rabi' I 600 converts to about 30 November or 1 December 1203. The YAML summary is corrected here. The Shadharat-based prose paragraph from the earlier lane was left as written.
- There is no `place/jammail` record yet (his birthplace, near Nablus).
- The record keeps the role `muhaddith`, set by the earlier lane, because precheck accepts it.

## Remaining
- Later entries of part 2 (al-Diya' al-Maqdisi, Ibn Qudama, the Banu Qudama) are good next targets.

## Second pass (worker F, run 2, ocr-harvest-2026-11-04)
Batch A (printed = PDF; pp. 5, 52–62, 93, 124, 133–148, 236–240):
- New: `place/jammail` (trio; the Maqdisi birthplace, the 551 AH emigration and the naming of al-Salihiyya), `person/ahmad-ibn-muhammad-ibn-qudama` (data record: khatib of Jamma'il, 491–558).
- Enriched with full Dhayl sections (trios rewritten/extended):
  - `person/abu-umar-al-maqdisi` (entry 229, pp. 52–61): birth, emigration, learning, copying, worship, intercession, campaigning with Saladin, creed verses, reported karamat (attributed), death 18 Rabi' I 607 and funeral. Earlier summary typed a Qur'an verse as his last words; replaced by a `passage/quran-2-132` link. Death EDTF corrected from 1210-10 to 1210-09-09 (tabular, derived). Published.
  - `person/ibn-qudama-al-maqdisi` (entry 272, pp. 133–147): Baghdad journey (561), study with Abd al-Qadir and Ibn al-Manni, works by field, creed method, praise (Sibt, Ibn al-Najjar, Ibn al-Hajib, Abu Shama, Ibn Taymiyya, Ibn al-Salah, al-Yunini), selected fatwas, reported karamat with the corrector's footnote, death Eid al-Fitr 620, children. Dates now confirmed by a second source; published. Edges: born_in Jamma'il, child_of, student_of Abd al-Qadir / Ibn al-Manni / Abu Umar, authored al-Kafi, al-Muqni', Rawdat al-Nazir.
  - `person/diya-al-din-al-maqdisi` (entry 345, pp. 236–240): birth month debated (his hand: 5 Jumada II; Ibn al-Najjar: Jumada I 569), travels, praise, the school at the Muzaffari mosque, full works list, students, death Monday 18 Jumada II 643.
- Not yet done: al-Imad Ibrahim ibn Abd al-Wahid (entry 255, pp. 93–106; existing `person/al-shaykh-al-imad` from Shadharat), Abd al-Rahman ibn Abi Umar and the later Maqdisis (entries 338–345, 383, 406, …). No record exists for al-Diya's al-Ahadith al-Mukhtara (no stub added; the prose names it unlinked).
