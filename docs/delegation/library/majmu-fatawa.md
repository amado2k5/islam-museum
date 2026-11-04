# Library lane: Majmu' al-Fatawa (Ibn Taymiyya)

**Worker:** Claude Code (OCR-harvest worker C), run `ocr-harvest-2026-11-04` (second run).

## Items and editions
| item | what it is | md5 (book.txt) | PDF pages | used as |
|---|---|---|---|---|
| `majmou3_alfatawa` | Ibn Qasim compilation, vol. 10 *'Ilm al-Suluk*, King Fahd Complex, Medina, 1425/2004 | 974e15e4… | 792 | `source/majmu-fatawa-qasim-v10` — printed page = PDF page |
| `BBib-Alex-09430` | Dar al-Wafa' (Mansura) / Obeikan, ed. Amir al-Jazzar & Anwar al-Baz, 1st ed. 1418/1997: vol. 7 *al-Iman* (PDF 1–433) bound with vol. 8 *Kitab al-Qadar* (PDF 434–772) | 9f066e87… | 772 | `source/majmu-fatawa-wafa-v7` (printed = PDF − 4) and `source/majmu-fatawa-wafa-v8` (printed = PDF − 432) |
| `37-70735` | Dar al-Wafa', vol. 37 general indexes, 3rd ed. 1426/2005 | ce928cb1… | 607 | `source/majmu-fatawa-wafa-v37` — printed = PDF |
| `Mabahith` | a modern study "Mabahith al-amr allati intaqadaha Ibn Taymiyya fi Majmu' al-Fatawa" (2004?) | fbf4e3c8… | 37 | **excluded**: the text layer is font-garbled (Latin/symbol mojibake) after the title |

No byte-identical items.

## Done (4 Nov 2026), batch 1
Read: vol. 10 pp. 1–8, 18–19, 40–43, 149–157, 176, 180, 186, 218–223, 425–426, 497–499, 551–553, contents 770–773; vol. 7 pp. 6–11, 269–273, 279–281, contents 423–433; vol. 8 pp. 434–439, 615–617, 632, contents 759–766; vol. 37 pp. 1–8, 604–605.
- New sources: the four above.
- New: `work/majmu-al-fatawa` (ar/en/ur), `concept/fana-sufi`, `concept/al-jam-wal-farq`, `question/is-contentment-with-the-decree-obligatory`, `question/is-seclusion-better-than-company-for-the-seeker`, `question/did-adam-argue-from-destiny-to-excuse-his-sin`.
- Enriched (draft Wikidata cards → full ar/en/ur): `work/al-tuhfa-al-iraqiyya`, `work/al-ubudiyya`, `work/kitab-al-iman-ibn-taymiyya`.
- Duplicate resolved: `work/al-iman-al-kabir` (draft, no prose, Wikidata Q29513553) is the same book as `work/kitab-al-iman-ibn-taymiyya` (Q7719222); kept the latter, added `aliases: [work/al-iman-al-kabir]`, deleted the duplicate's data file (no prose, no inbound links except the generated `data/time-browser-media-index.json`, left for regeneration).
- Enriched `question/may-one-say-i-am-a-believer-god-willing` with Ibn Taymiyya's account (two perspectives + a section in ar/en/ur).

## Flags
- Qur'an verses quoted inside the hadiths and fatwas are given only as `passage/quran-*` links.
- Mu'tazili and Sufi positions in the question cards are as Ibn Taymiyya reports them; each card says so.

## Next
Vol. 10: *Amrad al-Qulub* (pp. 91–149, envy pp. 111–125), the prophets' protection from sin (pp. 292–316), the names of the ascetics and the term "Sufi" (pp. 366–370), innovated retreats (pp. 393–406), the commentary on *Futuh al-Ghayb* (pp. 455–551), *al-Wasiyya al-Sughra* (pp. 654–666), *al-sabr al-jamil* (pp. 666–678), the assessment of the *Ihya'* and *Qut al-Qulub* (pp. 551–552, read; not yet written up). Vol. 8: the three kinds of Qadariyya, human capacity, the wisdom of God's acts.

## Batch 2 (4 Nov 2026)
- From vol. 10 pp. 551–552 (read in batch 1): enriched `work/ihya-ulum-al-din` (Ibn Taymiyya's assessment: a paragraph and a perspective in ar/en/ur; source and tour stop sources updated) and rewrote the draft `work/qut-al-qulub` card (completeness 2, from Ibn Taymiyya's assessment only).
- `concept/al-maqamat-wal-ahwal` also cites vol. 10 pp. 5–6, 18.
