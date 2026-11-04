# Library lane: Madarij al-Salikin (Ibn Qayyim al-Jawziyya)

**Worker:** Claude Code (OCR-harvest worker C), run `ocr-harvest-2026-11-04`.

## Items
| item | edition | md5 | pages | used |
|---|---|---|---|---|
| `20231031_20231031_1508` | part 1, ed. Nasir ibn Sulayman al-Sa'wi, joint Qassim University edition, Dar al-Sumay'i 1432/2011 | a49c1f53… | 804 | yes → `source/madarij-salikin-sumayi-q1`; printed page = PDF page |
| `20240217_20240217_1914` | *Rawa'i' Madarij al-Salikin*, selected by Turki al-Mayman, Dar Ata'at al-Ilm 1445 | ca3a391b… | 349 | not used |
| `20260717_20260717_0543` | *Tahdhib Madarij al-Salikin*, by Abd al-Mun'im Salih al-Ali al-Izzi | aecfb480… | 616 | not used |
| `madsal` | unidentified (no title-page text in OCR) | 26668905… | 640 | not used |

## Done (4 Nov 2026), batch 5
Read: pp. 1–14 (title, imprint, general introduction, division of the edition), 800–804 (editor's conclusion).
- New: `source/madarij-salikin-sumayi-q1`; stub `work/manazil-al-sairin` in `data/_stubs.d/claude-ocr-harvest-c.yaml`.
- Enriched: `work/madarij-al-salikin` (draft → full ar/en/ur; `commentary_on` Manazil al-Sa'irin).

## Flags
- The assessment of Ibn al-Qayyim's fairness to the Sufis is the editor's (p. 802) and is labelled as such; Sufi views still need their own sources.
- The fourth editor's name is garbled in OCR and not used.

## Next
The commentary on al-Fatiha and the first stations (awakening, repentance) in part 1 (pp. 15ff.).

## Second run (4 Nov 2026), batch 6
Read: Sumayi q1 PDF pp. 125–129 (the editor's study quoting Ibn al-Qayyim on the order of the stations).
- New: `concept/al-maqamat-wal-ahwal` (stations and states; Ibn al-Qayyim's view of their order, with Ibn Taymiyya's 'works of the heart').

## Next
The stations proper begin in later quarters (not in this item); the `madsal` item (640 pp., another edition, wakefulness at p. 137, repentance at p. 453) and `20260717_20260717_0543` are not yet identified as editions.

## Third run (4 Nov 2026), batch 12
- Identified `madsal` (md5 26668905…): vol. 1 of Madarij al-Salikin, ed. Ridwan Jami' Ridwan (names garbled in OCR), Mu'assasat al-Mukhtar, Cairo, 1st ed. 1422/2001 → new `source/madarij-salikin-mukhtar-v1`. It runs from the editor's introduction to the 34th station (contentment), contents pp. 631–640. PDF pages cited; printed numbering runs about 6–7 lower and the offset was not fixed.
- Read (PDF): pp. 5–8, 121–123, 136–139 (awakening, insight), 358–363 (turning back), 631–640 (contents, station list).
- New: `concept/yaqaza`, `concept/inaba` (ar/en/ur).
- `source/madarij-salikin-sumayi-q1` reliability note updated to point to the new identification.

## Next
In the same volume: stations not yet in the graph — reflection, firar (fleeing, PDF ~387), i'tisam (~379), ikhbat (~437), ri'aya (~483), thiqa (~549); existing thin station cards (tafwid, taslim) could take Ibn al-Qayyim's definitions.

## Fourth run (4 Nov 2026), batch 1 — worker C
Read (`madsal` = `source/madarij-salikin-mukhtar-v1`, PDF pages): 378–395 (holding fast, fleeing, training), 395–409 (hearing: kinds of the heard, the permitters' arguments, the reply and the three rules), 415–425 (sorrow, the opening of fear), 436–440 (ikhbat), 482–488 (ri'aya, the opening of muraqaba).
- New concepts (ar/en/ur): `concept/itisam`, `concept/firar`, `concept/riyada`, `concept/huzn`, `concept/ikhbat`, `concept/riaya`.
- New question: `question/is-sufi-sama-of-singing-lawful` (Ibn al-Qayyim first; the permitters' arguments only as he reports them, unnamed, labelled `sufi`, marked as needing the holders' own sources; `sensitivity: contested`).
- Flags: this edition reproduces earlier footnotes signed «الفقي» (and one quoting Rashid Rida); those judgements (e.g. linking Sufis to Christian monasticism, p. 483; the "unity of being" note, p. 394) are labelled as the annotator's. Ibn al-Qayyim's judgements on "heretics among the Sufis" (p. 389) and on singing are recorded as his. Qur'an verses linked as passages only, never typed.

## Next
Al-Harawi's degrees of hearing (PDF 412–414) for the sama' card; in the same volume: ishfaq (~425), khushu' (~430, `concept/khushu-fiqh` is a fiqh card), tabattul (456), raghba (478), ta'zim hurumat Allah, tahdhib/tasfiya; thin cards tafwid could take Ibn al-Qayyim's definitions.
