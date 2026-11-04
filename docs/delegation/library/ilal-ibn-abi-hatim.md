# ilal-ibn-abi-hatim: Ibn Abi Hatim al-Razi, Ilal al-Hadith

- Lane: OCR harvest, worker F (Claude Code, claude-opus-5-5, run ocr-harvest-2026-11-04)
- Text: `harvest-text/books/hadith-sciences/ilal-ibn-abi-hatim/` (not in git)

## Items
| Item | What it is | Used |
|---|---|---|
| `AAlexandrina-161315` | Part 1, al-Matba'a al-Salafiyya, Cairo, 1343 (second title page reads 1342 in the OCR). Text folios = PDF−3. Cited by PDF page. | yes: `source/ilal-ibn-abi-hatim-salafiyya-v1` |
| `AAlexandrina-162031` | Part 2, same press, 1344. Folios drift against PDF pages. Cited by PDF page. The scan ends with unrelated periodical pages. | yes: `source/ilal-ibn-abi-hatim-salafiyya-v2` |

## Records
New
- `source/ilal-ibn-abi-hatim-salafiyya-v1` and `-v2` (each self-listing)
- `work/ilal-al-hadith-ibn-abi-hatim` (trio): new id. The existing `work/kitab-al-ilal` is linked from al-Daraqutni as his work, so it was not reused.

Enriched
- `person/ibn-abi-hatim-al-razi`: was a draft card. It is now published with:
  - birth 240 and death Muharram 327;
  - edges `child_of` and `student_of` Abu Hatim, `student_of` Abu Zur'a, `authored` Ilal;
  - a prose section from the publisher's biography (PDF pp. 6–10).

## Flags
- On PDF p. 10 the OCR reads the death year as 337. The biography heading and the preface give 327, which is the year recorded.
- `work/al-jarh-wal-tadil` is a bare draft with no author. No `authored` edge was added from Ibn Abi Hatim, because the title is generic.

## Not done
- The roughly 2,800 individual questions were not mined. Good candidates: the chapters on Qur'an commentary and on the signs of prophethood in part 2.
