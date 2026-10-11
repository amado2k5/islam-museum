# 06 · Roadmap and seed content

Strategy: **build the spine first, then grow the body.** The spine is a small, deeply connected core (the Prophet's life, the first century, the major polities, ~150 people, ~60 places) in two languages, with every hall working on it. Breadth comes after the mechanics are proven, by import, by community and by AI-assisted drafting with human review.

## Phase 0 · Foundation (weeks 1–2)

Deliverables:
- Repo scaffold per `03-architecture.md`: licenses, CONTRIBUTING, CODE_OF_CONDUCT, GOVERNANCE, CLAUDE.md, style guide, editorial policy.
- `schema/` v0.1: base + 20 classes, predicates registry, enums, external-id patterns; 10 example entities validate.
- `scripts/`: validate, build-graph, derive, export-api, hijri convert (with anchor tests), coverage report.
- `site/`: Astro + Tailwind + i18n (en, ar) + entity page layout + hall placeholders + search (Pagefind) + JSON-LD + sitemaps + API export.
- CI: validate on PR; deploy on main to GitHub Pages; Cloudflare cache purge.
- DNS: `islam.museum` proxied via Cloudflare → GitHub Pages, HTTPS, `www` redirect, Cloudflare Web Analytics.
- A real landing page: the vision, the eight wings, "opening soon", links to GitHub and Discussions.

Exit criteria: `npm run validate && npm run build` green; https://islam.museum serves the landing page and `/en/person/ibn-sina`; Lighthouse ≥ 95/100.

## Phase 1 · The Spine (weeks 3–10)

Content targets (en + ar; `reviewed` status):

| Class | Count | Notes |
|---|---|---|
| period | 12 | Pre-Islamic Arabia · Prophetic era (Meccan, Medinan) · Rashidun · Umayyad · Abbasid (early, fragmentation) · Fatimid/Buyid/Seljuk era · Crusades & Ayyubid/Mamluk · Mongol & post-Mongol · Gunpowder empires (Ottoman, Safavid, Mughal) · Colonial era · Modern · Contemporary |
| event | 200 | ~90 in the Prophet's life (see list), 40 Rashidun & Umayyad, 40 Abbasid–1500, 30 since 1500 |
| person | 150 | see list |
| place | 60 | see list |
| polity | 30 | see list |
| building | 25 | Kaaba · Prophet's Mosque · Dome of the Rock · Umayyad Mosque · Great Mosque of Córdoba · Ibn Tulun · al-Azhar · al-Qarawiyyin · Qarawiyyin Library · Alhambra · Great Mosque of Kairouan · Great Mosque of Samarra · Taj Mahal · Süleymaniye · Hagia Sophia · Registan · Djinguereber (Timbuktu) · Great Mosque of Djenné · Shah Mosque Isfahan · Great Mosque of Xi'an · Bibi-Khanym · Qutb Minar · Sultan Hassan · Masjid al-Haram expansions · Sankoré |
| object | 30 | Blue Qur'an folio (Met) · Birmingham Qur'an · Topkapı/Samarkand Uthman Qur'an · astrolabes (Met CC0) · al-Jazari manuscript folio · Pyxis of al-Mughira · Ardabil carpet · Mamluk glass lamp (Met) · Iznik dish (Met) · Umayyad dinar of Abd al-Malik · Mansa Musa in Catalan Atlas · Maqamat al-Hariri folio · Kitab al-Diryaq · Baptistère de Saint Louis · Freer canteen · Hunting carpet · Shahnama folios … |
| work | 40 | Qur'an · six hadith collections · Sira of Ibn Ishaq · Muqaddima · Canon of Medicine · al-Jabr · Kitab al-Manazir · Ihya · Shifa · Tahafut · Fasl al-Maqal · Masnavi · Shahnama · Diwan of Hafez · Travels of Ibn Battuta · Kitab al-Hayawan · Fihrist · Tarikh al-Rusul · Rihla of Ibn Jubayr · Hayy ibn Yaqzan · Muwatta · Risala of al-Shafii · Kitab al-Tawhid (Maturidi) · Mathnawi · Divan of Yunus Emre · Hikam · Epistles of the Brethren of Purity … |
| concept | 60 | tawhid · iman · ihsan · islam (the word) · five pillars · shahada · salah · zakat · sawm · hajj · Qur'an · sunnah · hadith · sharia · fiqh · madhhab · ijtihad · ijma · qiyas · kalam · falsafa · tasawwuf · adab · ilm · waqf · ummah · khilafa · imama · jihad (full semantic range) · da'wa · dhikr · barakah · halal/haram · nikah · hijab · ribat · madrasa · bimaristan · bayt al-hikma · tafsir · isnad · qira'at · tajwid · arabesque · girih · muqarnas · mihrab · minaret · calligraphy scripts (kufic, naskh, thuluth, nastaliq) · algebra · algorithm · zero · astrolabe · hijri calendar · mawlid · ashura · ghadir … |
| practice | 25 | the five pillars as practices · wudu · Friday prayer · Eid al-Fitr · Eid al-Adha · Ramadan iftar · Laylat al-Qadr · Ashura · Mawlid · aqiqah · nikah · janazah · henna · dhikr/sama · Qur'an recitation · hospitality/adab of guests · halal food · dress traditions · greeting (salam) · the Hajj rites in detail · Umrah · Islamic New Year · Isra & Mi'raj night · Sufi mawlids |
| language | 12 | Arabic · Persian · Ottoman Turkish · Turkish · Urdu · Bengali · Malay/Indonesian · Swahili · Hausa · Bosnian (Arebica) · Chinese (Xiao'erjing) · Wolof (Wolofal) |
| journey | 10 | Hijra · Isra and Mi'raj (as tradition) · Expedition to Tabuk · Ibn Battuta · Ibn Fadlan · Ibn Jubayr · Mansa Musa's Hajj · Zheng He's voyages · Evliya Çelebi · Malcolm X's Hajj |
| group | 25 | Quraysh · Banu Hashim · Ansar · Muhajirun · Ahl al-Bayt · the four madhhabs · Twelver Shia · Ismailis · Zaydis · Ibadis · Mu'tazila · Ash'aris · Maturidis · Qadiriyya · Naqshbandiyya · Mevlevi · Chishti · Tijaniyya · Mamluks · Janissaries · Brethren of Purity · Banu Musa · Hui · Moriscos … |
| question | 60 | see list |
| exhibit | 8 | "Islam in 30 minutes" tour · The Life of the Prophet · The House of Wisdom · Al-Andalus · Women who shaped Islam · Timbuktu and the Sahel · Islam in China · The Islamic Year (Living) |
| source | 120 | critical editions and scholarship for the above |
| dataset | 3 | Muslim population by country (Pew) · Hajj attendance by year · UNESCO World Heritage sites of Islamic civilization |
| media | 150 + ~650 | CC0/PD images with alt text in en + ar, plus ~650 approved AI-assisted illustrations generated locally per `10-image-generation.md` (wings, periods, regions, places, events, person still-lifes, concepts, practices, journeys, questions) and programmatic name tiles for every person |
| listing | 100 | Made wing seed across 20 countries and all categories, plus a Library shelf of 100 books by living Muslim authors (`11-made-directory.md`) |

Features: entity pages for all classes; Made hall with map and shelves; Time hall (timeline, eras, snapshot year, today); Place hall (map with time slider, journeys); People gallery + ego network; glossary; Questions; 8 exhibits; search; depth dial; honorifics toggle; API; coverage page.

### Seed list · events in the Prophet's life (~90, each an `event`)
Year of the Elephant and birth (c. 570) · death of Amina · care of Abd al-Muttalib then Abu Talib · journey to Syria with Abu Talib · Harb al-Fijar · Hilf al-Fudul · trade for Khadija · marriage to Khadija (c. 595) · rebuilding of the Kaaba and the Black Stone arbitration (c. 605) · retreats on Hira · first revelation (c. 610) · Khadija, Ali, Zayd, Abu Bakr accept Islam · public preaching (c. 613) · persecution of early Muslims · Bilal's ordeal · conversion of Hamza and of Umar (c. 616) · first migration to Abyssinia (615) · second migration to Abyssinia · boycott of Banu Hashim (c. 616–619) · Year of Sorrow: deaths of Khadija and Abu Talib (619) · journey to Ta'if · Isra and Mi'raj (tradition) · first and second pledges of Aqaba (620–622) · plot of Dar al-Nadwa · Hijra (622) · Masjid Quba · arrival at Medina · building the Prophet's Mosque · Constitution of Medina · brotherhood of Muhajirun and Ansar · change of qibla (624) · fasting of Ramadan prescribed · Battle of Badr (624) · marriage of Fatima and Ali · Banu Qaynuqa · Battle of Uhud (625) · Hamza's death · Banu Nadir · Battle of the Trench (627) · Banu Qurayza · marriage to Zaynab bint Jahsh · incident of the slander · Treaty of Hudaybiyya (628) · Khaybar (628) · letters to rulers · Umrah of Qada (629) · Battle of Mu'tah (629) · Conquest of Mecca (630) · cleansing of the Kaaba · Battle of Hunayn · siege of Ta'if · Expedition to Tabuk (630) · Year of Delegations (631) · death of Ibrahim · Hajj led by Abu Bakr · Farewell Pilgrimage and Sermon (632) · Ghadir Khumm (632, perspectives) · final illness · death of the Prophet (8 June 632 / 12 Rabi' I 11 AH) · Saqifa (perspectives) · burial. Plus births/deaths of key figures and the revelation of key surahs as `event`s linked to `passage`s.

### Seed list · 150 people (by lane)
**Prophets and family**: Muhammad · Khadija · Aisha · Fatima · Ali · Hasan · Husayn · Zaynab bint Ali · Hamza · Abbas · Abu Talib · Halima · Zayd ibn Haritha · Umm Salama · Hafsa · Safiyya · Ibrahim, Musa, Isa, Maryam (as Qur'anic figures)
**Companions**: Abu Bakr · Umar · Uthman · Bilal · Salman al-Farisi · Abu Dharr · Khalid ibn al-Walid · Sa'd ibn Abi Waqqas · Abu Hurayra · Ibn Abbas · Ibn Mas'ud · Mu'adh ibn Jabal · Umm Ayman · Nusayba (Umm Umara) · Sumayya · Ja'far ibn Abi Talib · Abu Ubayda · Amr ibn al-As · Zayd ibn Thabit · Mus'ab ibn Umayr
**Successors and early scholars**: Hasan al-Basri · Umm al-Darda · Ja'far al-Sadiq · Abu Hanifa · Malik · al-Shafii · Ahmad ibn Hanbal · al-Bukhari · Muslim · Ibn Ishaq · al-Tabari · Rabi'a al-Adawiyya · al-Hallaj · al-Ash'ari · al-Maturidi · Ibn Sa'd · Abu Yusuf · al-Awza'i · Sufyan al-Thawri · Ibn al-Mubarak · Amra bint Abd al-Rahman
**Rulers**: Mu'awiya · Abd al-Malik · Umar II · Harun al-Rashid · al-Ma'mun · Abd al-Rahman I · Abd al-Rahman III · Saladin · Baybars · Shajar al-Durr · Mahmud of Ghazni · Nizam al-Mulk · al-Mu'izz · Alp Arslan · Mehmed II · Suleiman · Akbar · Shah Abbas · Mansa Musa · Askia Muhammad · Razia Sultan · Sultan Hasan · Timur · Ulugh Beg · Osman I · Tariq ibn Ziyad · Yusuf ibn Tashfin · Abd al-Qadir al-Jaza'iri · Muhammad Ali Pasha · Atatürk
**Scientists and physicians**: al-Khwarizmi · al-Kindi · al-Razi (Rhazes) · Ibn Sina · al-Biruni · Ibn al-Haytham · al-Zahrawi · Ibn al-Nafis · al-Jazari · Jabir ibn Hayyan · al-Battani · Omar Khayyam · Nasir al-Din al-Tusi · Ibn al-Shatir · al-Idrisi · Banu Musa · Maryam al-Ijliya (al-Astrulabi) · Taqi al-Din · Ibn Bajja · al-Farghani · Abbas ibn Firnas
**Philosophers and theologians**: al-Farabi · al-Ghazali · Ibn Rushd · Ibn Tufayl · Ibn Arabi · Fakhr al-Din al-Razi · Ibn Taymiyya · Ibn Khaldun · Mulla Sadra · Shah Waliullah · Muhammad Abduh · Iqbal · Fatima al-Samarqandi · Ibn Hazm · al-Juwayni · Nasir Khusraw · Suhrawardi
**Sufis, poets, artists**: Rumi · Hafez · Saadi · Attar · Yunus Emre · Amir Khusrau · al-Mutanabbi · Abu Nuwas · al-Ma'arri · Ibn Zaydun · Wallada · al-Khansa · Ibn Muqla · Ibn al-Bawwab · Yaqut al-Musta'simi · Sinan · Bihzad · Abd al-Qadir al-Jilani · Moinuddin Chishti · Ahmad Baba al-Timbukti · Nana Asma'u · Shaykh Amadou Bamba · Sheikh Mohammed al-Jazuli
**Travelers, founders, institutions**: Ibn Battuta · Ibn Fadlan · Ibn Jubayr · Evliya Çelebi · Fatima al-Fihri · Zubayda bint Ja'far · Zheng He · Leo Africanus · Enrique of Malacca
**Modern**: Malcolm X · Muhammad Ali · Abdus Salam · Ahmed Zewail · Malala Yousafzai · Mahathir Mohamad · Rashid Rida · Jamal al-Din al-Afghani · Fatima Mernissi · Naguib Mahfouz · Umm Kulthum · Nusrat Fateh Ali Khan · Zaha Hadid · Benazir Bhutto · Shirin Ebadi · Ibrahim Abouleish · Hamka · Sayyid Qutb (perspectives) · Ruhollah Khomeini (perspectives) · Tawakkol Karman

### Seed list · 60 places
Mecca · Medina · Ta'if · Jerusalem · Damascus · Kufa · Basra · Baghdad · Samarra · Cairo (Fustat, al-Qahira) · Alexandria · Kairouan · Fez · Marrakesh · Tlemcen · Córdoba · Seville · Granada · Toledo · Palermo · Istanbul/Constantinople · Bursa · Konya · Edirne · Sarajevo · Jeddah · Yanbu · Sana'a · Zabid · Muscat · Aden · Mosul · Aleppo · Hama · Isfahan · Shiraz · Nishapur · Rayy · Hamadan · Tabriz · Merv · Bukhara · Samarkand · Khiva · Kashgar · Xi'an · Quanzhou · Delhi · Agra · Lahore · Multan · Dhaka · Malacca · Aceh · Zanzibar · Kilwa · Mogadishu · Harar · Timbuktu · Gao · Kano · Cordoba's Madinat al-Zahra · Qayrawan's Raqqada

### Seed list · 30 polities
Rashidun Caliphate · Umayyad Caliphate · Abbasid Caliphate · Umayyads of Córdoba · Idrisids · Aghlabids · Tulunids · Samanids · Buyids · Fatimids · Ghaznavids · Seljuks · Almoravids · Almohads · Ayyubids · Delhi Sultanate · Mamluk Sultanate · Nasrids of Granada · Mali Empire · Ilkhanate · Timurids · Ottoman Empire · Safavids · Mughal Empire · Songhai · Sokoto Caliphate · Aceh Sultanate · Sultanate of Malacca · Kanem-Bornu · Kilwa Sultanate · modern: Saudi Arabia, Turkey, Egypt, Iran, Pakistan, Indonesia, Nigeria (as `polity` with `kind: nation`).

### Seed list · 60 questions (newcomer door)
What is Islam? · Who was Muhammad? · What is the Qur'an? · What do Muslims believe? · What are the five pillars? · Why do Muslims pray five times a day? · Why do Muslims fast in Ramadan? · What is Hajj? · What is the difference between Sunni and Shia? · What is Sharia? · Is Sharia the law of Muslim countries? · What is jihad? · What is a fatwa? · What is a mosque and what happens inside? · Why do some Muslim women cover their hair? · What does "Allah" mean and is it the same God? · What do Muslims believe about Jesus, Moses and Abraham? · What is a hadith? · What is Sufism? · What is halal? · Why don't Muslims eat pork or drink alcohol? · How many Muslims are there and where do they live? · Are all Muslims Arabs? Do all Arabs speak Arabic? · What is the Islamic calendar? · What is Eid? · Why do Muslims face Mecca? · Why is Jerusalem important to Muslims? · What happened in the "Islamic Golden Age"? · What did Muslims contribute to science? · Why is there no image of the Prophet? · What is Islamic art? Why so much geometry? · What is a caliph? Is there one today? · What is a madrasa? · What is an imam? · How do Muslims view other religions? · What does Islam say about women? · What is the status of slavery in Islamic history? · Why do Muslims say "peace be upon him"? · What is the Kaaba? · How did Islam spread so fast? · Was Islam spread by the sword? · What is Islamic finance? · What is zakat? · What is the Arabic language's role in Islam? · What is Ramadan like for a family? · What happens at a Muslim wedding or funeral? · What is the Mahdi? · What is the "ummah"? · What is Wahhabism/Salafism? · What is the Nation of Islam and is it the same as Islam? · How is the Qur'an organised and how do I start reading it? · Who decides what is Islamic? · What is tafsir? · What are the main Muslim holidays? · What is the Hijra and why does the calendar start there? · What is a dervish? · What is Islamic architecture? · What is the Muslim view of the afterlife? · What can I visit to learn about Islamic heritage near me?

## Phase 2 · The halls complete (months 3–4)

Network hall full (teacher–student, isnad, families, dynasties, path finder) · snapshot year with map · Hijri calendar app · "What was here" · compare · bookmarks/My tour · kid mode · print mode · OpenGraph cards · PWA offline · coverage page · RSS. Content: +500 entities via Wikidata-assisted import (people, places, polities) drafted with AI and reviewed; listing harvest pipeline to 1,000 verified Made entries; long-tail illustration batches.

## Phase 3 · Words and objects (months 5–7)

Qur'an browser (Tanzil text; permitted translations; links to events/people/places) · hadith browser with isnad mini-graphs and sunnah.com deep links · poetry anthology · IIIF viewer with QDL/Bodleian/Gallica manuscripts and Met/Smithsonian/Walters CC0 objects imported (≥ 500 objects) · per-version license registry · Objects hall full · media repo live.

## Phase 4 · Community and languages (months 6–9)

Contributor program; wing editors; issue forms; translation workflow; languages: ur, id, tr, fr; educator kits (printable exhibits, lesson plans as `exhibit kind: lesson`); first outreach to universities and museums; Wikipedia citations of islam.museum; monthly data release with DOI.

## Phase 5 · Data product and AI docent (months 9–12)

API docs; Wikidata reconciliation and round-trip bot (propose Hijri dates as qualifiers/notes); Linked Art/CIDOC-CRM JSON-LD export; `llms.txt` and structured facts for assistants; Workers + Vectorize "Ask the museum" grounded strictly on museum content with citations and refusal on rulings; datasets wing; Today wing filled.

## Phase 6 · Year 2 and beyond

IIIF partnerships (Aga Khan Museum, MIA Doha, IAMM, David Collection); 3D scans and AR of buildings; audio tours; oral histories ("Living voices") as a new class; recipes and music as classes; regional rooms for 30 countries; editorial board; non-profit; alignment with the Islamic History Atlas, al-Thurayya and World Historical Gazetteer; 10 languages; 10,000+ entities.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Scope swallows the project | Spine first; coverage page makes gaps visible, not shameful; new classes only when a wing needs them |
| Neutrality disputes | Perspectives in schema; editorial policy; two-reviewer rule; board |
| Licensing mistakes | Whitelist validation; per-version registry; link-don't-copy default; no ads ever |
| Founder burnout | AI-assisted drafting with review; templates; contributors; everything documented |
| GitHub Pages size | Text-only main repo; media repo/R2; Cloudflare caching |
| Arabic typography and RTL bugs | Build RTL first in Phase 0; test with Arabic content from day one |
| Hijri date errors | Store source Hijri; derived values flagged; anchor tests; uncertainty shown |
| AI hallucinations in content | Draft label; two-source rule; citations required; validation that cited sources exist |
| Static limits for interactivity | Islands with compact indexes; Workers upgrade path documented |

## Metrics dashboard (public, from `api/v1/meta/coverage.json`)
Entities by class/wing/period/region/language · review status mix · sources per entity · women share · broken links · build time · site size · visitors by wing (Cloudflare) · zero-result searches.
