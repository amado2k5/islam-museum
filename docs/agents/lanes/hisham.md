# Lane `hisham`: Sirat Ibn Hisham, juz' 4

**Book:** «السيرة النبوية» of Ibn Hisham (the recension of Ibn Ishaq), juz' 4, ed. السقا والأبياري وشلبي, مطبعة البابي الحلبي 1355هـ/1936م; 376 PDF pages; **printed page = PDF page − 4** (cite the printed page).
**Plan (read fully before starting):** `docs/plan/18-sira-ibn-hisham.md`: §1 (two layers: the classical text is public domain but quotes stay at most 40 words; the editors' footnotes, rubrics and indexes are copyrighted reference: facts and citations only), the procedure, the extraction rules, the batch order.
**Text (outside git):** `~/islam-museum-harvest/raw/books/sira-ibn-hisham/`: `book.txt`, `pages.json`, `pages-png/`, `toc.json`/`toc.txt` (فهرس الموضوعات, printed 358–367), `bib.txt`, `index-people/tribes/places.txt`, `ghazwat-index.txt`, `README.md` (OCR error list), `PROGRESS.md` and `batches/` (claims tables from earlier batches: read them for the format and level of detail).
**Progress and next step:** `docs/delegation/hisham-progress.md` (read it first, resume at its "next step"; also `git log origin/main --oneline | grep ibn-hisham`).
**Branch / stubs:** `content/ibn-hisham-<agent>`; `data/_stubs.d/ibn-hisham.yaml`. Commit prefix `content(ibn-hisham)`.

Follow [`../mining-sources.md`](../mining-sources.md) and [`../content-standards.md`](../content-standards.md).

## Sources and claims

- Source ids: `source/ibn-hisham-saqqa-1936` (cite `{cite:ibn-hisham-saqqa 4/N}`; the earlier ids `source/ibn-hisham-saqqa` and `source/ibn-hisham-sira` are the same work and already cited by older batches: prefer the existing ids for new work), `work/sira-ibn-ishaq-ibn-hisham`; each work in `bib.txt` that you cite becomes a `source` entity.
- Record the isnad head the book names («قال ابن إسحاق: حدثني الزهري…») in the claim's note. Every doubt marker (قال ابن هشام، عن غير ابن إسحاق، ويقال، يُشك فيه، ويُروى) becomes `status: debated` or `confidence: low` with the marker quoted. Status of claims: `tradition` by default.
- Dates exactly as the book words them (`«جمادى الأولى سنة ثمان»` becomes hijri `0008-05`, precision month); never invent a day. A second source for a dated fact comes from the works named in `bib.txt` (al-Bukhari, al-Istiab, al-Isaba, al-Rawd al-Unuf, Mu'jam al-Buldan…) or a parallel classical text.
- Honorifics are spelled out in this edition: strip them; in a verbatim quote trim around them.
- OCR traps: جعفر misread جمفر (13 times: verify on the image), الحبشة, الحديبية, هاشم, مكة, بني تميم; margin rubrics appear as stray short lines; trailing digits on lines are printed line numbers; footnote markers (١)–(٢٥) are reliable.
- Maps describe terrain, positions and movements only; nothing depicting the Prophet or Companions.

## Batch order (23 batches; done batches are in the progress file; Tier A = contested, perspectives block mandatory, Sunni first)

1 the conquest of Mecca pp. 31–69 · 2 Hunayn and al-Ta'if pp. 80–129 · 3 the Hawazin spoils, the mu'allafa and al-Ji'rana pp. 130–143 · 4 Mu'ta pp. 15–30 · 5 the return from Abyssinia pp. 3–11 (a roster, by clan: Hashim/Abd Shams/Asad; Taym/Jumah/Sahm/Adi/Amir/al-Harith; the rest and the women) · 6 Tabuk pp. 159–172 · 7 Masjid al-Dirar and the three who stayed behind pp. 173–181 · 8 the delegations I pp. 200–222 · 9 the delegations II pp. 222–245 · 10 the delegations III pp. 246–247 · 11 the Farewell Pilgrimage pp. 248–253 and the envoys to the kings 254–255 · 12 lists of the expeditions pp. 256–257 · 13 the sariyas I pp. 257–274 (Fazara and Umm Qirfa: **Tier A**) · 14 the sariyas II pp. 275–291 (Abu Afak and Asma' bint Marwan: **Tier A**) · 15 Banu Jadhima and al-Uzza pp. 70–79 (**Tier A**) · 16 Ka'b ibn Zuhayr pp. 144–158 · 17 the Thaqif delegation, Abu Bakr's hajj and Bara'a pp. 182–199 (the prayer over Ibn Ubayy: **Tier A**) · 18 'umrat al-qada' pp. 12–14, 143 · 19 the illness and death pp. 291–305 (**Tier A**: Umar's denial) · 20 the Saqifa pp. 306–311 (**Tier A**: perspectives mandatory) · 21 the preparation and burial pp. 312–322 · 22 the wives pp. 293–298 (dataset) · 23 the indexes pp. 325–368 (source entities and reconciliation).

## Overlap

The conquest of Mecca, Hunayn, al-Ta'if, Mu'ta, Tabuk, the delegations, the Farewell Pilgrimage and the death overlap with the `raheeq` lane and with the `library` lanes. Reuse event ids already on main; if the event does not exist yet, create it with the id the plan gives (`event/battle-of-mutah`, `event/expedition-to-tabuk`, `event/farewell-pilgrimage`, `event/umrah-of-qada`) so the other lane finds and reuses it. Run `git pull --rebase origin main` and recheck `data/event/` before each batch.
