# Hadith repositories on GitHub: book inventory

Date: 24 October 2026. Scope: the first 50 results of GitHub's repository search for `hadith` (`https://github.com/search?q=hadith&type=repositories`, pages 1 to 5, out of about 3,500 results). Read in Chrome; no API calls and no downloads.

What this is: a list of the books each repository names (in its README or visible folders), and whether our `data/` already holds a record for that book. It is a research note, not a source. Nothing here enters `data/` until a lane cites a defined source for each fact.

## How "have" was decided

"Have" means an entity record exists in `data/` (under `work/`, `source/` or `concept/`). It does not mean the book's text is held locally. "Draft card" means the record exists but its sources are not yet checked on the page.

Authors come from general knowledge, not from the repositories. Verify against a defined source before any of them is cited.

## Harvest folder status and sect checks (24 Oct 2026)

Where a book is held is now checked against the harvest store (`~/islam-museum-harvest/books/`, the scanned PDFs and OCR), not against `data/`. A `data/` record is not the same thing: several rows marked "Have" above have a record but no harvest copy. Sect checks use Wikipedia infoboxes and Wikidata religion or affiliation statements, with the date checked.

| Book | In harvest? | Harvest folder | Author | Sect (Wikipedia / Wikidata) |
|---|---|---|---|---|
| Sahih al-Bukhari | Yes | `hadith/sahih-bukhari` | al-Bukhari | Not re-checked here |
| Sahih Muslim | Yes | `hadith/sahih-muslim` | Muslim ibn al-Hajjaj | Not re-checked here |
| Sunan Abi Dawud | **No** | none | Abu Dawud al-Sijistani (817–889) | Sunni (Wikipedia infobox) |
| Jami al-Tirmidhi | Yes | `hadith/jami-tirmidhi` | al-Tirmidhi | Not re-checked here |
| Sunan al-Nasa'i | Yes | `hadith/sunan-nasai` | al-Nasa'i | Not re-checked here |
| Sunan Ibn Majah | Yes | `hadith/sunan-ibn-majah` | Ibn Majah | Not re-checked here |
| Muwatta Malik | Yes | `hadith/muwatta-malik` | Malik ibn Anas | Not re-checked here |
| Musnad Ahmad | Yes | `hadith/musnad-ahmad` | Ahmad ibn Hanbal | Not re-checked here |
| Sunan al-Darimi | Yes | `hadith/sunan-darimi` | al-Darimi | Not re-checked here |
| Riyad as-Salihin | Yes | `hadith/riyad-salihin` | al-Nawawi | Not re-checked here |
| Al-Arba'un al-Nawawiyya | Yes | `hadith/arbaun-nawawi` | al-Nawawi | Sunni, Shafi'i, Ash'ari (Wikipedia) |
| Bulugh al-Maram | Yes | `hadith/bulugh-maram` | Ibn Hajar al-Asqalani | Not re-checked here |
| Al-Adab al-Mufrad | Yes | `hadith/adab-mufrad` | al-Bukhari | Not re-checked here |
| Mishkat al-Masabih | Yes | `hadith/mishkat-masabih` | al-Tabrizi | Not re-checked here |
| Taqrib al-Tahdhib | Yes | `rijal/taqrib-tahdhib` | Ibn Hajar al-Asqalani | Not re-checked here |
| Tahdhib al-Tahdhib | Yes | `rijal/tahdhib-tahdhib` | Ibn Hajar al-Asqalani | Not re-checked here |
| Shamail al-Tirmidhi | Yes | `shamail/shamail-tirmidhi` | al-Tirmidhi | Not re-checked here |
| Forty Hadith Qudsi | **No** | none | Varies by edition (see note) | Al-Nawawi: Sunni, Shafi'i, Ash'ari (Wikipedia). This edition not verified |
| Shah Waliullah's Forty Hadith | **No** | none | Shah Waliullah Dehlawi (1703–1762) | Sunni (Wikipedia infobox; Wikidata "Sunni Islam") |
| Hisn al-Muslim | **No** | none | Sa'id bin Ali bin Wahf al-Qahtani (1952–2018) | Sunni (Wikidata affiliation "Sunni Islam"; Wikipedia calls his university "Salafi/Sunni") |
| Lu'lu' wal-Marjan | **No** | none | Muhammad Fu'ad Abd al-Baqi (1882–1968) | **Unverified**: religion Islam, no sect stated (Wikipedia and Wikidata) |
| Tafsir Ibn Kathir | Yes | `tafsir/tafsir-ibn-kathir` | Ibn Kathir | Not re-checked here |
| Tafsir al-Jalalayn | Yes | `tafsir/tafsir-jalalayn` | al-Mahalli and al-Suyuti | Not re-checked here |
| Tafsir al-Tabari (Jami al-Bayan) | Yes | `tafsir/tafsir-tabari` | al-Tabari | Not re-checked here |
| Tanwir al-Miqbas (min Tafsir Ibn Abbas) | **No** | none | Firuzabadi (1329–1414), compiler | Sunni, Shafi'i, Ash'ari (Wikipedia) |
| Tafsir al-Sa'di | Yes | `tafsir/tafsir-saadi` | Abd al-Rahman al-Sa'di | Not re-checked here |
| Tafsir al-Qurtubi | Yes | `tafsir/tafsir-qurtubi` | al-Qurtubi | Not re-checked here |
| Tafsir al-Muyassar | Yes | `tafsir/tafsir-muyassar` | King Fahad Quran Complex | Institution; not an individual |
| Tafsir al-Muntakhab | **No** | none | Egyptian religious authority (committee) | **Unverified**: no article on Wikipedia or Wikidata |
| Lata'if al-Isharat (Tafsir al-Qushayri) | **No** | none. The harvest has *al-Risala al-Qushayriyya* (`adab-zuhd/risalat-qushayri`), a different book | Abd al-Karim al-Qushayri (d. 1072) | Sunni, Shafi'i, Ash'ari, Sufi (Wikipedia and Wikidata) |
| Tafsir al-Kashani (file in QURAN-NLP) | **No** | none | Unidentified: Fayz Kashani or Fath Allah Kashani | **Non-Sunni**: both candidates Shia (Wikipedia and Wikidata) |

Notes
- Forty Hadith Qudsi: Wikipedia's Hadith Qudsi article cites "An-Nawawi's Forty Hadith Qudsi" among its references. Compilers vary by edition, so the author of each edition needs checking before use.
- Abu Dawud and Firuzabadi were checked on Wikipedia only, not Wikidata.
- Sa'id al-Qahtani's "Sunni" rests on his Wikidata affiliation and on Wikipedia's wording about his university, not on an explicit denomination field.
- Rows marked "Not re-checked here" were not looked up in this pass; their status comes from earlier sessions.

## Harvest canon checks

Any book added to the harvest canon (`scripts/harvest/library/books.yaml`) must first pass the checks in [`docs/ai-change-gates.md`](../ai-change-gates.md) section 1a: processed-before check, Sunni verification from Wikipedia or Wikidata, and a record in `scripts/harvest/library/exclusions.yaml`.

Results of those checks on the two non-Sunni entries already in the canon:

| Canon id | Author | Sect (evidence) | Processed before? | Action |
|---|---|---|---|---|
| `tahrir-majisti-tusi` | Nasir al-Din al-Tusi | Twelver Shi'i (Wikipedia) | Yes: work record, manuscript source, content in ar/en/ur, harvest folder, progress note | Not removed; founder decision |
| `tafsir-zamakhshari` | Zamakhshari | Mu'tazila (Wikipedia) | Yes: work record, person record, content in ar/en/ur, harvest folder, dedupe note | Not removed; founder decision |

The Kashani tafsirs from this inventory (Fayz Kashani's *Tafsir Safi* and Molla Fathollah Kashani's *Menhaj al-Sadeghin*) are Shia on Wikipedia and Wikidata. They are excluded and were never added to the canon. The unidentified Kashani file in QURAN-NLP stays excluded until its author is confirmed.

## Books named in the repositories

| Book | Author (general knowledge) | Repos naming it | Our data | Status |
|---|---|---|---|---|
| Sahih al-Bukhari | al-Bukhari | 2, 3, 4, 5, 6, 9, 10 (pp. 1–2 numbering below) | `source/sahih-al-bukhari`, `work/sahih-al-bukhari` | Have |
| Sahih Muslim | Muslim ibn al-Hajjaj | 2–6 | `source/sahih-muslim`, `work/sahih-muslim` | Have |
| Sunan Abi Dawud | Abu Dawud al-Sijistani | 2–6 | `source/sunan-abi-dawud`, `work/sunan-abi-dawud` | Have |
| Jami al-Tirmidhi | al-Tirmidhi | 2–6 | `source/jami-al-tirmidhi`, `work/jami-al-tirmidhi` | Have |
| Sunan al-Nasa'i | al-Nasa'i | 2–6 | `source/sunan-al-nasai`, `work/sunan-al-nasai` | Have |
| Sunan Ibn Majah | Ibn Majah | 2–6 | `source/sunan-ibn-majah`, `work/sunan-ibn-majah` | Have |
| Muwatta Malik | Malik ibn Anas | 2–6 | `source/muwatta-malik`, `work/muwatta-malik` | Have |
| Musnad Ahmad | Ahmad ibn Hanbal | 2–6 | `source/musnad-ahmad` only | Have as source; no work record |
| Sunan al-Darimi | al-Darimi | 2–6 | `work/sunan-al-darimi` | Have as draft card |
| Riyad as-Salihin | al-Nawawi | 3, 4, 5-area, Deen-Bridge | `source/riyad-al-salihin`, `work/riyad-al-salihin` | Have |
| Al-Arba'un al-Nawawiyya | al-Nawawi | 3, 4, mo7amedaliEbaid | `work/arbaun-nawawi`, `work/arbaeen-al-nawawiyya` (draft) | Have |
| Bulugh al-Maram | Ibn Hajar al-Asqalani | 3, 4 | `source/bulugh-al-maram`, `work/bulugh-al-maram` | Have |
| Al-Adab al-Mufrad | al-Bukhari | 3, 4 | `source/al-adab-al-mufrad`, `work/al-adab-al-mufrad` | Have |
| Mishkat al-Masabih | al-Tabrizi | 3, 4 | `source/mishkat-al-masabih` only | Have as source; no work record |
| Taqrib al-Tahdhib | Ibn Hajar al-Asqalani | 10 | `source/taqrib-al-tahdhib`, `work/taqrib-al-tahdhib` (draft) | Have |
| Tahdhib al-Tahdhib | Ibn Hajar al-Asqalani | 10 | `work/tahdhib-al-tahdhib` (draft) | Have |
| Forty Hadith Qudsi | varies by edition | 3, Deen-Bridge, alQuranBD | `concept/hadith-qudsi` only | **Need** |
| Forty Hadith of Shah Waliullah | Shah Waliullah al-Dihlawi | 3, Deen-Bridge | `person/shah-waliullah-al-dahlawi` only | **Need** |
| Shama'il al-Muhammadiyya | al-Tirmidhi | 3, CheeseWithSauce, AhmedBaset, alQuranBD | Only a commentary (`work/ashraf-al-wasail-ila-fahm-al-shamail`) | **Need** |
| Hisn al-Muslim (Fortress of the Muslim) | Sa'id ibn Ali al-Qahtani | galacticwarrior9, 4thel00z, CheeseWithSauce | None | **Need** |
| Lu'lu' wal-Marjan | Muhammad Fu'ad Abd al-Baqi | alQuranBD ("upcoming") | None | **Need** |
| Tafsir al-Jalalayn | al-Mahalli and al-Suyuti | GregoryMorse, Deen-Bridge | `work/tafsir-al-jalalayn` | Have |
| Tafsir Ibn Kathir | Ibn Kathir | Deen-Bridge | `source/tafsir-ibn-kathir`, `work/tafsir-ibn-kathir` | Have |
| Tafsir al-Tabari (Jami al-Bayan) | al-Tabari | Deen-Bridge | `work/jami-al-bayan` | Have |
| Tanwir al-Miqbas | attributed to Ibn Abbas | QURAN-NLP | `work/tanwir-al-miqbas` | Have |
| Tafsir al-Sa'di | Abd al-Rahman al-Sa'di | Deen-Bridge | None | **Need** |
| Tafsir al-Qurtubi (al-Jami li-Ahkam al-Quran) | al-Qurtubi | Deen-Bridge | None | **Need** |
| Tafsir al-Muyassar | King Fahad Quran Complex | GregoryMorse | None | **Need** |
| Tafsir al-Muntakhab | Egyptian Ministry of Awqaf | GregoryMorse | None | **Need** |
| Tafsir al-Qushayri (Lata'if al-Isharat) | al-Qushayri | QURAN-NLP | None (only person records) | **Need** |
| Tafsir al-Kashani | not specified in the repo | QURAN-NLP | None | **Need** |

Eleven books are needed: Forty Qudsi, Shah Waliullah's Forty, Shama'il, Hisn al-Muslim, Lu'lu' wal-Marjan, and six tafsirs (al-Sa'di, al-Qurtubi, al-Muyassar, al-Muntakhab, al-Qushayri, al-Kashani).

## Repositories, pages 1 to 5

Numbering in the first column follows search order. Pages 1 to 5 hold 10 repositories each.

**Page 1**
1. fawazahmed0/hadith-api: README names Abu Dawud only as an example edition; the full edition list is in `editions.json`, not opened.
2. gadingnst/hadith-api: nine books (Muslim, Bukhari, Tirmidzi, Nasai, Abu Daud, Ibnu Majah, Ahmad, Darimi, Malik).
3. AhmedBaset/hadith-json: 17 books in English and Arabic, the most complete list on page 1. Scraped from sunnah.com.
4. abdelrahmaan/Hadith-Data-Sets: the Nine Books, with counts.
5. mhashim6/Open-Hadith-Data: the Nine Books as CSV; derived from islamware.
6. ceefour/hadith-islamware: the Nine Books as CSV; Islam Ware copyright 2006–2014.
7. AhmedElTabarani/dorar-hadith-api: wrapper over Dorar.net; no specific book named.
8. muhammadtalhasultan/Sirat-E-Mustaqeem: Flutter app; no book named in the README.
9. ShathaTm/LK-Hadith-Corpus: six canonical books; only Bukhari is named in the description.
10. OmarShafie/hadith (KASHAF): Sahih al-Bukhari, plus Taqrib al-Tahdhib and Tahdhib al-Tahdhib for narrator grades.

**Page 2**
11. sunnah-com/api: no book named.
12. alQuranBD/Bangla-Hadith-api: Bukhari (two editions), Muslim (two editions), Riyad, Abu Dawud, Ibn Majah, Tirmidhi; "upcoming": Bukhari (Tawhid), Hadith Qudsi, Nawawi's 40, Lu'lu' wal-Marjan, Adab al-Mufrad, Darimi, Shama'il.
13. islamAndAi/QURAN-NLP: "canonical collections" (unnamed); tafsirs Jalalayn, Ibn Abbas, Kashani, Qushairi; also Shia sources.
14. fawazahmed0/hadiths: Abu Dawud and Ibn Majah as examples.
15. galacticwarrior9/IslamBot: Fortress of the Muslim (duas).
16. Ananto30/ask-hadith: Bukhari as an example.
17. ashrafuzzaman/hadith: book folders for Abu Dawud, Adab, Bukhari, Ibn Majah, Malik, Muslim, Nasa'i, Tirmidhi, and Nawawi's 40 (HTML). No Darimi.
18. Mohamed-Nagdy/Quran-App-Data: hadith books as JSON; names not listed (file list did not load).
19. asim/reminder: Bukhari (English only).
20. maximromanov/HadithReader: Six Books folder (Abu Dawud, Bukhari, Ibn Majah, Muslim, Nasa'i, Tirmidhi). Licence CC BY-NC-SA 3.0, non-commercial.

**Page 3**
21. metinkale38/prayer-times-android: Sahih al-Bukhari (the Turkish text says "Six Books").
22. fekracomputers/HadithEncyclopediaMobile: encyclopedia by book, author and narrator; no book named.
23. AhmedElTabarani/hadith-checker-extension: searches Sahih al-Bukhari and Sahih Muslim; uses Dorar and sunnah.com.
24. halimbahae/Hadith: the Nine Books (same as repo 5).
25. IslamHouse-API hub: API hub for IslamHouse, QuranEnc and HadeethEnc content; no book named. Republishing terms require attribution.
26. Ananto30/hadith-every-hour: Sahih al-Bukhari, posted in sequence.
27. ceefour/sanad-hadith: SQL dump of the Islam Ware data; no book named.
28. GibreelAbdullah/Hadith-Hub: front-end on Fawaz Ahmed's data; no book named.
29. Deen-Bridge/dnb-ai: ten hadith collections (the Nine Books, Muwatta, Nawawi's 40, Forty Qudsi, Shah Waliullah's Forty); tafsirs Ibn Kathir, al-Tabari, al-Sa'di, al-Qurtubi, Jalalayn; cites Riyad as-Salihin. Holds grading metadata in `data/hadith/*.json`.
30. pakjiddat/Islam-Companion-Web-Api: Urdu, English and Arabic hadith; no book named.

**Page 4**
31. GregoryMorse/IslamSource: tafsirs Jalalayn, al-Muyassar, al-Muntakhab (WordPress plugin).
32. RakibRahman/hadith-api: Bengali hadith; no book named.
33. abdelrahmaan/Most-Frequent-5000-Words-in-Quran-and-Hadith: Sahih al-Bukhari (word frequency).
34. 4thel00z/hadith.json: Sahih al-Bukhari and Hisnul Muslim.
35. fawazahmed0/hadith: front-end on Fawaz Ahmed's data; no book named.
36. AhmedBaset/hadith-api: the 17 books of hadith-json.
37. hazemabdelkawy/SunnahGPT: scrapes sunnah.com; book list not captured.
38. CheeseWithSauce/HadithsJSONFormat: 16 collections: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, Muwatta, Riyad, Adab, Ahmad (incomplete), Bulugh, Darimi, Forty, Hisn al-Muslim, Mishkat, Shamail.
39. sajadah/hadith-graph: graph front-end; no book named.
40. fekracomputers/HadithWebservice: PHP web service, no README; no book named.

**Page 5**
41. IsmailHosenIsmailJames/compressed_hadith_sqlite: offline SQLite API; book names not captured.
42. fawazahmed0/quran-hadith-search: front-end; no book named.
43. hadithmv/hadithmv.github.io: Dhivehi platform; book names not captured.
44. Umma1/hadith: Python library for quantitative hadith research; book names not captured.
45. MAymanKH/HadithSearcher: Arabic app over Dorar.net; book names not captured.
46. mohacelhosen/hadithbangla: six books in Bengali (Bukhari, Muslim, Abu Dawud, Ibn Majah, Nasa'i, Tirmidhi).
47. mo7amedaliEbaid/islamic: Flutter app; includes Nawawi's 40.
48. x0xman/Hadith-API: Telegram bot over the sutanlab API; the nine books.
49. renomureza/hadis-api-id: nine narrators in Indonesian; data from tafsirq.com.
50. rewayaat/rewayaat: Shia hadith platform, 50,038 narrations from 21 books; the book names are not in the README. Label as an other view before any use.

## Caveats

- Some README extracts were cut off by the page-text limit, so repos marked "not captured" may name books that were not read.
- For most repos only the README and a few folder listings were read, not every data file. "Named" means named in what was read.
- Licence and terms to check before any use: maximromanov/HadithReader (CC BY-NC-SA 3.0, non-commercial, so facts only under `docs/attribution.md`); ceefour/hadith-islamware and its copies (Islam Ware copyright 2006–2014); AhmedBaset/hadith-json (scraped from sunnah.com); IslamHouse content (its own republishing terms).
- Shia-source collections (rewayaat, and the Shia sources in islamAndAi/QURAN-NLP) fall outside the Sunni default frame. They need a labelled inventory before any entity is written from them.

## Next steps (not done)

- Verify each "Need" title and author against a defined source before creating any `data/work/` record.
- Shama'il al-Tirmidhi and the Forty Qudsi may already be covered under other titles; check before drafting.
- Inventory the 21 Rewayaat books from `src/main/resources/book_blurbs.json` if the Shia corpus is wanted.
