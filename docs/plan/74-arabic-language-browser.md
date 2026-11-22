# 74 — Arabic Language Browser («متصفح اللغة العربية لغة القرآن»)

_Written 21 November 2026 on the founder's chat instruction of the same day. The request, kept in his words, the requirements read out of it and the production tests are in [`docs/engineering/66-arabic-language-browser-requirements.md`](../engineering/66-arabic-language-browser-requirements.md). Status: **built, merged, awaiting the founder's deploy**._

Gate labels (`docs/ai-change-gates.md` section 3): `non-impacting` for the records and the page; the change touches `site/src/lib/nav.ts` and `site/src/components/Landing.astro`, so the pull request is labelled `rewrites-all-pages`.

## 1. What the browser is

A front door over the one graph (`docs/site/browsers.md` section 1) for Arabic as the language of the Qur'an, and, by the founder's second message, for the whole story of the language. It has three layers:

1. **The Qur'an on its own tongue.** The fifteen ayahs of the frozen Tanzil text whose wording names the tongue of the revelation, shown with their text from the frozen records.
2. **What the harvested texts say.** Every passage record (hadith, seerah, tafsir, history, law, Qur'anic sciences, letters) whose Arabic wording speaks about the Arabic language, found at build time by `scripts/arabiyya.ts`. A book harvested later adds its passages with no code change.
3. **Curated chapters.** Records tagged `arabiyya-browser` + `arabiyya-<section>`: `lisan`, `ijaz`, `origins`, `script`, `sciences`, `dialects`, `world`, `scholars`, `books`.

Route: `/[lang]/arabiyya/`. API: `/api/v1/arabiyya.json`. Signature view: `sig/ArabiyyaRing.astro` (the ring of the letters in al-Khalil's order).

## 2. Counts on 21 November 2026 (from the graph on that day)

- 15 Qur'an verses.
- 77 other passages found by wording. They are not read one by one: some mention Arabic only in passing, and machine-read (OCR) text can carry reading errors.
- 114 curated records: 92 that the graph already held, tagged in place, and 22 new ones.

## 3. Method and sources

- **Tafsir.** al-Tabari, Ibn Kathir, al-Qurtubi and al-Baghawi were read verse by verse through the Quran.com tafsir API for 45 verses (the fifteen verses on the tongue of the Qur'an, the challenge verses, the verses on al-Walid ibn al-Mughira and three related ones). Citations are by verse, not by printed page.
- **Classical books.** Read in the Shamela library copies whose numbering follows a named printed edition; volume and page are the ones the Shamela page displays, and they were not checked against paper. Each edition is its own `source` record.
- **Modern facts.** United Nations, UNESCO and Encyclopaedia Britannica pages read on 21 November 2026; figures are given as the page stated them, and where two pages differ both are given.
- **Voice.** Each judgement is attributed to its holder. The statement that Arabic is the most eloquent of languages is reported as Ibn Kathir's and Ibn Faris's, not said by the museum. Weak and rejected reports are labelled with the grader's name.
- **Research notes** were kept outside git and deleted with the working folder; what they established is in the records and their `provenance`.

## 4. New records of this run

Concepts (five languages, full prose): `al-arabiyya-lughat-al-quran`, `dawa-al-muallim-al-ajami`, `fadl-taallum-al-arabiyya`, `al-muarrab-fi-al-quran` (lisan); `sama-quraysh-lil-quran`, `al-ijaz-al-bayani-inda-al-mufassirin`, `nazariyyat-al-ijaz-wal-nazm`, `akhbar-sama-al-quran-fi-al-sira` (ijaz); `asl-al-lugha`, `tarikh-al-lugha-al-arabiyya`, `al-lughat-al-samiyya` (origins); `huruf-al-arabiyya-wa-makharijuha` (script); `ulum-al-lisan-al-arabi`, `ilm-al-nahw`, `ilm-al-sarf`, `ilm-al-arud`, `khasais-al-arabiyya` (sciences); `lughat-al-qabail`, `al-fusha-wal-lahajat` (dialects); `al-alam-al-arabi`, `al-arabiyya-fi-al-alam-al-yawm`, `athar-al-arabiyya-fi-al-lughat` (world). Sources: 42 new `source` records (two Quran.com tafsir records, 28 printed editions, twelve web pages).

## 5. What is not done

- No human has read the new prose or its translations.
- The detected passages are not reviewed one by one; `ARABIYYA_EXCLUDE` in `scripts/arabiyya.ts` is the place for a false positive when one is found.
- Not yet written: records for rhetoric (balagha) as a science, for each modern dialect group, for each Arab country's language situation, for Arabic teaching and the language academies, for the history of Arabic printing, and for the many grammar and language books the graph does not yet hold (*al-Khasa'is*, *al-Muzhir*, *al-Sahibi*, *Dala'il al-I'jaz*, *Mughni al-Labib*, *al-Mufassal* have source records here but no `work` record).
- Example loanwords for Spanish, Persian, Turkish and Urdu were not found in a standard reference on the day, so the record gives none.
- The exact wording «تعلموا العربية فإنها من دينكم» was not found with a full chain; the record says so.
- No speaker count is asserted by the museum: the United Nations and UNESCO pages differ (400 and 500 million) and both are quoted.

## 6. Next steps (lane `arabiyya`)

Done on 21 November 2026 (second batch): five `work` records for the classic books on Arabic (al-Khasa'is, al-Muzhir, al-Sahibi, Dala'il al-I'jaz, Mughni al-Labib); four rhetoric records (balagha, ma'ani, bayan, badi'); six dialect-group records (Gulf, Hijaz, Levant, Egypt, Maghrib, Yemen); and one record per Arab League state, 22 in all (`al-arabiyya-fi-<country>`, tag `arabiyya-world`). Not read for the country records: Ethnologue, Britannica pages that refused fetching, the Arab League site, Pearson MapMaster; the CIA World Factbook is cited from Internet Archive copies because cia.gov retired it on 4 February 2026.

Still open:

1. A read of the detected passages, with exclusions recorded in `ARABIYYA_EXCLUDE`.
2. `mentions` edges from the concept records to the verses they discuss, if the founder wants them shown on verse pages.
3. Dialect features and speaker counts for the six dialect groups (none were found in the sources read), and a human read of all AI-written prose and translations.
