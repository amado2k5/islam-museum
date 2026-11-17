# 70. Ulama Browser — متصفح المفكرون والعلماء والأدباء والمحدثون والكتاب

A build-time browser over the one graph for the people of knowledge and the pen — the thinkers, scholars, litterateurs, muhaddiths and writers — and for everything the Qur'an, the Sunnah, the seerah and every harvested book says about them.

## What it is

- **Person detector** `scripts/ulama.ts`: a `person` record qualifies by role (`scholar, muhaddith, jurist, mufti, qadi, shaykh-al-islam, theologian, philosopher, historian, geographer, writer, teacher, preacher, scientist, mathematician, astronomer, physician, calligrapher`) or by occupation job (`alim, muhaddith, adib, katib, faqih, mufassir, mufti, historian, qari`). Poets are excluded by the founder's scope decision — the poetry wing carries them.
- **Mention detector**: a `passage` joins through a `mentions` edge to a qualifying person, or through a guarded folded name form (built from `label.ar` + `names[]`, minimum length, common-name stoplist, `ULAMA_EXCLUDE` escape hatch). Qur'an verses come only from the reviewed `ULAMA_QURAN_REFS` table — the verses naming learned figures (Luqman) and the verses on the people of knowledge as a class, each row commented against al-Tabari and Ibn Kathir. Any book harvested later joins automatically.
- **Corpus sections** quran / sunnah / seerah / books for passages; **people sections** mufakkirun / ulama / muhaddithun / udaba / kuttab; **curated** for tagged records of other classes. Category chips: `mufakkir, alim, muhaddith, adib, katib, scientist`.
- **Page** `/[lang]/ulama/` (`site/src/pages/[lang]/ulama/[...page].astro`): localized lede, method note, category chips, corpus + people sections, client filter, pagination; signature view `sig/UlamaMajlis.astro` («مجلس العلم», "the council of knowledge") — five category columns over the graph's own counts.
- **Rich person presentation:** person cards lead to entity pages enriched in waves — life, mission, quotes, authored works (author edges + a books line), TV interviews (screen records / interview citations), artifacts; per the founder's second addendum.
- **Curated spine** (`ulama-browser` + `ulama-<section>`/`ulama-<topic>` tags): an umbrella `concept/al-ulama` record; founder-named figures `hamdy-abdel-aal`, `heba-kotb`, `saad-al-din-al-hilali`, `islam-behery`, `youssef-ziedan`, `khaled-montaser`; then anchor-wave figures most-recent-first backward to the Companion-scholars (Ibn Abbas, Ibn Mas'ud, Aisha) and the Successors (al-Hasan al-Basri, Ibn Sirin, al-Zuhri).
- **Surface**: Explore menu under people, landing explorer card, `/api/v1/ulama.json`, OpenAPI, `llms.txt`, `docs/data/README.md`, `docs/site/browsers.md` row.
- **Spec**: `docs/engineering/62-ulama-browser-requirements.md` keeps the founder's brief verbatim for production acceptance testing.

## Waves

1. **W0 — spine:** detector, page, signature view, API, nav, landing card, i18n, umbrella concept, founder-named six, curated tags.
2. **W1 — modern anchors:** contemporary→modern scholars and writers (most-recent-first per the founder): Qaradawi, al-Albani, Ibn Baz, Ibn Uthaymeen, Sayyid Qutb, Maududi, al-Ghazali (Mohammed), Tantawi, al-Shaarawy, al-Bouti, Amr Khaled, Tareq al-Suwaidan, Omar Abdelkafy, Zaghloul el-Naggar, Mustafa Mahmoud, Ahmed Deedat, Yusuf Estes, and the founder-named six; prose + works + interviews.
3. **W2 — classical anchors:** the four imams and their circle, the six hadith collectors, al-Tabari, Ibn Kathir, al-Ghazali, Ibn Taymiyya, Ibn Qayyim, Ibn Hajar, al-Suyuti, al-Dhahabi, al-Nawawi, Ibn Khaldun, al-Jahiz, Ibn al-Jawzi, Sibawayh, al-Khalil, al-Asma'i, Ibn al-Muqaffa', Abd al-Hamid, al-Tawhidi, al-Ma'arri, Ibn Abd Rabbihi, al-Khwarizmi, Ibn al-Haytham, al-Biruni, Ibn Sina, al-Razi, al-Zahrawi.
4. **W3 — the salaf:** Companion-scholars and the great Successors; passage-mention edges enriched so their stories surface in the corpus sections.
5. **W4+ — breadth:** remaining qualifying persons by importance, committed and pushed whenever context runs tight.

## Status

Built on branch `agent/ulama-browser-2026-11-17` on the microSD clone; merged to `main`. Enrichment continues in the waves above; every harvested book's scholar mentions surface automatically at build time.
