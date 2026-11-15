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

## Second reader (Gemini, relayed by the founder, 14 November 2026)

Three prompts went to Gemini through the founder. Each answer was checked against the museum's
own records before anything was applied; nothing was taken on Gemini's word alone.

**1. Other senses of the two roots.** Gemini listed fifteen. Each was measured on the 1,830
passage records the detector admitted. Most never reach a strong signal (the garment «الحلة»,
«محل», «حلول», «حريم البئر», «حرمة», «تحلة القسم»). Seven were real and are now in
`OUT_OF_SCOPE`: being deprived of a good, the prayer's opening takbir, the month of Muharram
in a date, the sanctuary as a place, leaving ihram, a debt falling due, and the unmarriageable
kin as a person. Result: 1,820 admitted, 10 dropped, 23 with a corrected signal list, none added.

The 10 records that left the browser are still in the graph, with a label and a summary that
describe them as halal and haram mentions. **Proposal held for the founder: delete them**
(they were created by this lane's harvest on a false match): `abudawud-api-1833`,
`bukhari-api-4521`, `ibnmajah-api-1644`, `ibnmajah-api-3046`, `maghazi-waqidi-halal-1-395`,
`muslim-api-2986`, `nasai-api-2682`, `tirmidhi-api-2013`, `tirmidhi-api-238`,
`zuhd-ahmad-halal-1-295`.

Not applied: the reports that declare Makka and Madina inviolable («إن الله حرم مكة») stay in
the browser; that question is with the founder.

**2. Attribution of the scruple stories.** The museum's citations agree with Gemini's table:
Abu Bakr and the soothsayer's earnings (al-Bukhari 3842), Umar and the charity milk (Muwatta
606), the fallen date (al-Bukhari 2055), Muslim 1015, al-Tirmidhi 2518. None of the retelling
additions Gemini warns about is in the prose. One wording was corrected: the Arabic summary and
prose of `concept/al-halal-bayyin-wal-haram-bayyin` gave «أمور مشتبهات» under Abu Dawud 3330,
whose wording is «مشبهات» (the word «أمور» is in 3329). Leads not applied, because no defined
source in the museum carries them yet: that the Muwatta chain for Umar's report is disconnected
(Zayd ibn Aslam did not meet Umar), and the earlier collections Gemini names for three reports
(Ibn al-Mubarak's Zuhd, Ibn Abi Shayba, al-Tayalisi).

**3. Books to harvest next (leads; titles and editions as Gemini gave them, not yet verified,
none in `docs/library/harvest-register.yaml`).** al-Shaybani, Kitab al-Kasb (through
al-Sarakhsi's commentary); Ahmad ibn Hanbal, Kitab al-Wara' (al-Marwadhi's transmission);
al-Muhasibi, al-Makasib wa-l-Wara'; Ibn Abi al-Dunya, Kitab al-Wara' and Islah al-Mal;
al-Khallal, al-Hathth 'ala al-Tijara; al-Hakim al-Tirmidhi, Bayan al-Kasb; al-Ghazali, Ihya'
books 13 and 14 (the Ihya' is already harvested); al-Walidi, Kitab al-Halal wa-l-Haram.

## Subjects (14 November 2026, founder: "Yes, add subjects")

The founder asked whether a visitor looking for what food is unlawful would be helped. The
browser was arranged by source and by Arabic term only, so subjects were added: twelve, read at
build time by `SUBJECT_RE` in `scripts/halal.ts`; curated concepts tagged `halal-subject-<id>`.

Trust criteria for the word list: a word enters a subject only when a sample of its matches on
the admitted passages was mostly about that subject. Dropped after sampling: «دينار»، «درهم»،
«صرف»، «خراج» (earnings); «صلاة»، «مسجد»، «قرآن» (worship); «حمل» (family); «لعن»، «كذب»،
«إثم» (conduct); «إناء»، «لحية» (dress); the bare verb «ذهب» is never gold. Records per subject
at merge: principles 235, food 214, drink 164, hunting and slaughter 118, earnings 182,
marriage and family 456, dress 103, life and honour 186, conduct about 170, worship 351,
sanctuary 66, other about 370. A passage can stand under several.

Known limit: the subject list is a word match and can over-include a passage that names the
word in passing.

The wine verses (founder's ruling, 15 November 2026): the founder approved placing Qur'an 2:219,
5:90 and 5:91 in the browser. They do not use the two roots, so the detector does not find them;
each record now carries `tags: [halal-haram-browser]` and nothing else in it changed (the Qur'an
text is untouched). The word list puts them under Drink and under Speech and conduct (the game
of chance named beside wine). They carry no lawful or unlawful kind and no matched term, because
the browser claims a kind only from a verse's own words. The tag line is added by hand:
`scripts/harvest/quran/generate.py` does not write it, so a regeneration of the Qur'an records
must keep it. The ruling covers these three verses only; any other verse without the two roots
is a new proposal to the founder. The browser now holds 60 ayahs and 1,864 records.

## The sanctuary reports stay (founder's ruling, 15 November 2026)

The founder ruled that the reports on the inviolability of Makka and Madina stay in the browser
under their own subject, `sanctuary`, as built. Passages that only name the sanctuary as a place
remain out of scope. A second reader (Gemini, 15 November 2026) was asked where the classical
books place these reports and how the commentators read the wording. Checked against the graph:
its numbers for the Abu Shurayh report (Bukhari 104, Muslim 1354), the "made lawful to me for an
hour" report (Bukhari 2434 and 6880, Abu Dawud 2017) and the sheet of Ali (Abu Dawud 2034,
Tirmidhi 2127) match the records' texts. Not checked, and not to be cited from this note:
Bukhari 1870 and 6755 and Muslim 1355 and 1370 (not in the graph), the chapter titles, the
glosses ascribed to Ibn Hajar and al-Nawawi, and the positions of the four schools on Madina,
which rested on one secondary web page. Leads from the answer, not acted on: in
`passage/mudawwana-halal-1-223` the phrase «للحلال والحرام» means the non-pilgrim and the
pilgrim in ihram, so its `both` kind comes from another sense; the classical chapter titles
for the subject are «حرمة مكة والمدينة» and «تحريم مكة والمدينة».

## Open


- The founder's ruling on the 10 records above.

- A human read of every draft record.
- The items in the table above.
