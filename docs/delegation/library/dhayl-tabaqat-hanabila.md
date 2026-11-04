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
