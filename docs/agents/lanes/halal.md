# Lane `halal` — Halal and Haram Browser

Plan: [`docs/plan/58-halal-haram-browser.md`](../../plan/58-halal-haram-browser.md). Spec and the founder's
original request: [`docs/engineering/49-halal-haram-browser-requirements.md`](../../engineering/49-halal-haram-browser-requirements.md).
Opened 14 November 2026 by Claude (claude-fable-5-2) on the founder's request of that day.

## Scope

Only «الحلال والحرام»: passages that name the lawful and the unlawful, the `halal-haram-browser`
tag, the guards of the lexicon in `scripts/halal.ts`, the two harvest scripts, the page
`/[lang]/halal/` and its API export.

## Done on 14 November 2026

| Step | Result |
|---|---|
| Detector `scripts/halal.ts`, test in `scripts/features-api.test.ts` | 11 strong signals, 8 weak, 14 out-of-scope patterns, one pair rule |
| Hadith harvest (`scripts/harvest-halal-hadithapi.ts`, run `halal-hadithapi-1`) | 870 `passage` records from the seven hadith-api Arabic editions, plus 10 pinned reports of scruple |
| OCR harvest (`scripts/harvest-halal-ocr.ts`, run `halal-ocr-1`) | 808 `passage` records from 25 books already read by Apple Vision; no new OCR, no download |
| Tags on existing records | 23 concepts tagged `halal-haram-browser` in place (list in the spec, HH-R26) |
| New curated concepts, ar/en/ur draft prose (run `halal-browser-1`, Claude Sonnet 5.5, from evidence packs of museum passages) | eight records (plan section 5) |
| Page, signature view, filter, API export, menu, landing card, i18n, docs | see the plan |

## Trust criteria used (recorded so they can be audited and reused)

1. **Hadith text**: the Arabic editions of fawazahmed0/hadith-api (Unlicense), already a
   registered source (`source/hadith-api-fawazahmed0`) and the convention of the hisab,
   mukatabat and tibb lanes; each record also cites its collection's own source record.
   Numbering is the edition's; Sahih Muslim's numbers there are not Abd al-Baqi's. The copy
   read was the one already on the harvest drive; nothing was downloaded.
2. **Books**: only works that already have a `work` and a `source` record in the graph and an
   OCR text on the harvest drive, and only where the source record is not tied to a single
   volume that the scans exceed. Nothing was added to the harvest canon. No website was used
   as a source.
3. **OCR excerpts** are quoted as read by the machine, 40 words at most, uncorrected, and
   marked draft; the page number is the scan's page. A window is skipped, not repaired, when
   it carries a Qur'an quotation (marker, Uthmani letters, or four consecutive words of a
   verse), an honorific residue, too many stray letters, or fewer than seven known words in ten.
4. **Curated prose** states only what the museum's own passage records say. Each writer was
   given an evidence pack (verse records with a gloss, hadith reports and book excerpts with
   their cite markers) and told to add nothing from memory; where an excerpt is cut, the
   story stops where the excerpt stops.

## Left out, held for the founder's decision

Nothing below was deleted from the graph; each line is material that was not added.

| What | Why | Gate | To override |
|---|---|---|---|
| The tafsir books' OCR (Ibn Kathir, al-Sa'di, Ibn 'Ashur and the rest) | their pages quote the Qur'an throughout; the typed-verse rule | `scripts/harvest-halal-ocr.ts` BOOKS | add the book to BOOKS; the four-word verse check still applies |
| al-Muhalla, al-Umm, al-Majmu', Bada'i' al-Sana'i', al-Hidaya, I'lam al-Muwaqqi'in, Tafsir al-Qurtubi, Tafsir al-Tabari | the existing source record names one volume while the scans cover several | same | add a volume-neutral source record, then a BOOKS line |
| 'Uyun al-Athar, Ibn Kathir's Sira, Siyar A'lam al-Nubala' | no source record that matches the scan with certainty | same | same |
| Candidate pages above each book's cap (about 5,500 candidate pages in all, 808 kept) | the cap keeps the densest pages and spreads them | `cap` per book | raise the cap and rerun; the script is idempotent |
| OCR windows that quote a verse, carry an honorific residue or are garbled | rules above | `bestWindow` | none: these are rules, not judgments |
| hadith-api repeats of one wording inside a collection (24 on the first run) and reports already in the graph under another id (60) | duplicates | harvest script | none needed |
| Sanctuary, ihram, personal-name, reward, untying and deprivation senses of the two roots | out of the founder's scope («الحلال والحرام» only) | `OUT_OF_SCOPE` in `scripts/halal.ts` | remove the pattern |
| A sentence in `concept/tahrim-ahl-al-jahiliyya` on al-Bayhaqi's Dala'il p.2496 (the postponed month) | the writer marked its reading as an inference from a garbled line | lead review | restore after a human reads the scan page |
| Evidence items the writers did not use | off-topic for the record, repeated, or garbled; listed in the three writers' reports | writer judgment | add in a revision |

## Open

- A human read of every draft record.
- The items in the table above.
