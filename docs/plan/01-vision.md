# 01 · Vision — islam.museum

> *The whole story of Islam, open to everyone.*

## 1. What this is

**islam.museum** is an all-digital, free, open, multilingual museum of Islam: the faith, the civilization, the cultures, the peoples, the ideas, the places, the objects and the living community, from the world Islam was born into until the day the site was last updated.

It is not a textbook, a fatwa site, a da'wah site, an encyclopedia clone, or a single museum's collection put online. It is a **knowledge graph with a museum's soul**: every person, place, event, idea, object, text, practice, journey, polity, language and people is a node, every node is connected, and every connection is dated, sourced and viewable through many lenses — time, space, people, ideas, objects, words, living culture, today.

The museum metaphor is deliberate. A museum is a place where a stranger can walk in, be welcomed, wander without a goal, be told a story by a curator, pick up an object and turn it over, and leave knowing something they did not know. The web version of that has never been built for Islam as a whole.

## 2. Why it matters

- Islam is 1.9–2 billion people, 14 centuries, and every continent, yet online knowledge about it is **fragmented into silos**: Qur'an sites, hadith sites, museum collections, Wikipedia articles, academic databases, timelines, travel blogs, polemics. Nobody connects the astrolabe to the astronomer to the city to the caliph to the verse he was reading.
- The curious outsider is **poorly served**: they get either apologetics, polemics, or a 40-page Wikipedia article. There is no calm front door.
- Muslims themselves are **under-served on breadth**: most know their own tradition's story deeply and the civilization's story thinly (Timbuktu, Zheng He, the Ottoman observatory, Bosnian Ajami literature, Swahili poetry, Chinese Hui architecture).
- **AI assistants now mediate most first contact with knowledge.** A well-structured, well-cited, machine-readable museum becomes the thing they cite. That is a new kind of impact.
- Everything should be **durable and forkable**: plain text in git, open licenses, free hosting. If the founder disappears, the museum survives. Anyone can clone the entire museum to a laptop.

## 3. Who it is for (personas)

| Persona | Need | What they should find in 60 seconds |
|---|---|---|
| **Maya, 34, non-Muslim** who saw something in the news | A neutral, jargon-free answer that doesn't try to convert her | The *Questions* door: "What is Sharia?", "Why do Muslims fast?" in plain words, each linked deeper |
| **Tariq, 12, school project** on "Islamic Golden Age" | Pictures, a timeline, 5 people, simple words | Kids' trail, depth dial set to *Brief*, big visuals |
| **Fatima, 41, practising Muslim** who wants depth beyond her community | The civilization's story; women scholars; Islam in Africa and China | *People* and *Time* halls, exhibits, journeys |
| **Prof. Lindqvist, historian** | Citations, dates with uncertainty, data export, API | Sources on every page, EDTF dates, JSON-LD, downloadable graph |
| **Ahmed, 29, convert** | Practice explained without assumptions; the big picture | *Living* hall, Hijri calendar, Questions |
| **Nadia, 55, diaspora traveler** going to Córdoba and Fez | What to see, why it matters, what happened there | *Map* hall, place pages, "What was here" |
| **Daniel, journalist** on deadline | Accurate quick context, names spelled right, pronunciations | Entity cards, glossary, perspectives block |
| **Imam Idris, educator** | Lesson plans, printable handouts, curated tours | Tours and exhibits, print mode, educator kits |
| **An AI agent** answering a question | Structured facts with sources | JSON-LD, `/api/`, `llms.txt`, stable URLs |

Design for the stranger first. If the stranger feels welcome and informed, everyone else is also served; the reverse is not true.

## 4. Principles (the museum charter)

1. **Open.** Text under CC BY-SA 4.0, structured data under CC0, code under MIT. Full data downloadable. No paywalls, no ads, no tracking beyond privacy-preserving aggregate analytics.
2. **Welcoming to all.** Written for the curious outsider first. No assumption of belief or disbelief. No proselytizing, no polemics, no mockery. Every faith, race, culture, age and background should feel the door is open.
3. **Faithful to sources.** Every entity cites sources. Every non-trivial claim is tagged by its nature: scripture, tradition, historical consensus, scholarly debate, popular legend. The tradition's own voice and historical scholarship are both presented, clearly labelled, never conflated and never pitted against each other.
4. **A Sunni frame, respectful of all.** The museum describes Islam as understood by Ahl al-Sunna wa'l-Jama'a (the four madhhabs, the Ash'ari, Maturidi and Athari creeds, the Sufi orders within Sunni Islam); see `docs/scope.md`. Within that frame it is deliberately broad: all four schools, classical and reformist readings, Arabs, Persians, Turks, South Asians, Africans, Southeast Asians, Chinese, Europeans, Americans; women and men; rulers and the ruled. Any other point of view (Shia, Ibadi, Ahmadi, academic, non-Muslim) may be mentioned freely and is always labelled before it is stated, so Sunni Islam stays the unlabelled default and no reader mistakes another view for the museum's own.
5. **Everything connected.** No dead ends. Every page leads to time, place, people and ideas around it. Serendipity is a feature.
6. **Hijri-native, timely and transparent.** Dual calendar everywhere. "Today" is part of the story. Every page shows when it was last updated and by whom.
7. **Beautiful and calm, in Arabic first.** A museum, not a portal. Arabic is the primary language and right-to-left the default layout (`docs/language.md`); other languages are translations of the finished Arabic museum.
8. **Durable.** Plain text in git, standard formats (Markdown, YAML, JSON Schema, GeoJSON, EDTF, IIIF, JSON-LD), static hosting, no vendor lock-in, readable without JavaScript, usable offline.
9. **Machine-readable.** Stable URLs, JSON-LD, a static API, Wikidata alignment, `llms.txt`. Built to be cited correctly by humans and machines.
10. **Honest about gaps.** Coverage maps show what the museum does not yet have. Drafts are labelled drafts.
11. **No AI at runtime.** AI is a tool of the building phase only: drafting, extraction, translation, verification, illustration. The published museum is finished work served as static files. No visitor request is answered by a model, no page is generated on demand, and nothing a visitor reads is produced by a model at the time of reading.
11. **Complete and unafraid.** Everyone and everything of significance to the story belongs here: supporters and opponents, allies and critics, achievements and failures, agreements and contradictions. The test is significance, not sympathy. The museum describes and attributes; it does not honour, condemn or resolve in its own voice (`13-figures.md`, `14-themes-atlas.md`).

## 5. What "Islam" covers here (scope)

Everything the founder listed, organised into nine museum **wings** (the visitor's mental model) sitting over about twenty **entity classes** (the data model, see `02-content-model.md`):

| Wing | What lives there | Example nodes |
|---|---|---|
| **Time** | Eras, timelines, "on this day", snapshot years | Prophetic era · 1258 Baghdad · 1453 · 1924 |
| **Place** | Cities, regions, sites, routes, maps through time | Mecca · Córdoba · Timbuktu · Samarkand · Xi'an Great Mosque |
| **People** | Prophets, companions, scholars, rulers, scientists, poets, artists, travelers, women, modern figures; families, tribes, dynasties, peoples | Khadija · Rabi'a al-Adawiyya · al-Khwarizmi · Mansa Musa · Fatima al-Fihri · Muhammad Ali |
| **Ideas** | Beliefs, concepts, disciplines, schools, debates, sciences | Tawhid · Ijtihad · Waqf · Algebra · Kalam · Sufism |
| **Objects** | Artifacts, relics, manuscripts, art, architecture | Blue Qur'an · Astrolabe of al-Sahli · Alhambra · Dome of the Rock |
| **Words** | Qur'an, hadith, poetry, prose, languages and scripts | Surat al-Fatiha · Sahih al-Bukhari · Rumi · Ajami · Jawi |
| **Living** | Practices, calendar, festivals, food, dress, music, everyday culture by region | Salah · Hajj · Ramadan · Eid · Henna · Qawwali · Dhikr |
| **Today** | Modern nations, institutions, demographics, contemporary figures and events, the future | OIC · Al-Azhar · Muslim population data · 21st-century events |
| **Made** | A directory of what Muslims create and own today: shops, brands, publishers, books, apps, studios, media, charities, schools (see 11-made-directory.md) | A bookshop in Fez · a Qur'an app · a modest-fashion brand · a Muslim-run publisher |

Plus four cross-cutting entrances: **Questions** (plain-language FAQ for newcomers), **Exhibits** (curated narratives and guided tours), the **Screening Room** (an index of every film, series and programme about Islam in any language, `12-screen-index.md`) and **Themes** (about 125 themes that cut across every wing, from women and minorities to war, charity, food and science, `14-themes-atlas.md`).

The People wing covers everyone who mattered to the story in any role, including opponents, critics, protectors and outside observers (`13-figures.md`).

## 6. What has been attempted, and what is genuinely new

See `08-prior-art.md` for the full survey. In short, the landscape has excellent **silos**: text libraries (Quran.com, Sunnah.com, OpenITI, Shamela), object collections (Met, Aga Khan Museum, MIA Doha, Archnet), heritage storytelling (Muslim Heritage / 1001 Inventions), timelines and gazetteers (al-Thurayya, Wikidata), and encyclopedias (Brill's EI, Wikipedia). Nobody has built the connective tissue.

What islam.museum does that has not been done:

1. **One graph for everything.** Texts, objects, people, places, events, ideas and practices in a single, typed, dated, sourced graph.
2. **A Hijri-native time machine.** Dual-calendar timeline with cross-section snapshots: "the Islamic world in 450 AH" — who was alive, what stood, who ruled where, what was being written.
3. **Perspectives in the schema, not in edit wars.** Contested topics carry structured, cited viewpoints: the Sunni schools and the academic or historical view, followed by any other view the topic needs, each labelled before it is stated.
4. **Depth dial and persona tours.** The same node serves a 12-year-old, a tourist and a PhD.
5. **Journeys as a first-class lens.** Hijra, Ibn Battuta, Hajj caravan routes, trans-Saharan trade, the spread of Islam to the Malay world, Malcolm X's Hajj, modern migrations.
6. **Networks of knowledge across 14 centuries.** Teacher–student chains, isnad, families, dynasties, patronage, rendered as explorable graphs.
7. **A living museum to the present day**, with transparent last-updated dates and a *Today* wing.
8. **An open data product**, aligned with Wikidata, exposed as JSON-LD and a static API, designed to be the source AI assistants cite.
9. **Zero-cost, forkable, offline-capable infrastructure.** The entire museum is a git repository.
10. **A genuinely welcoming front door** for people who know nothing and are afraid of asking.
11. **The first open, multilingual index of Islam on screen**, filed by what each work is about.
12. **Both sides of every conflict and every argument**, with roles that change over time and hard questions stated with all their answers.

## 7. Non-goals (for now)

- Not a place for rulings (fatwa), religious guidance, or debate about who is right.
- Not user accounts, comments or forums at launch (GitHub Discussions covers community).
- Not hosting copyrighted media we do not have rights to; link to and embed open collections instead.
- Not real-time news. The *Today* wing moves at the pace of careful curation.
- Not a replacement for Quran.com, Sunnah.com or OpenITI; we integrate and link to them.

## 8. Success looks like

- **Year 1:** 2,000+ connected entities, in Arabic, all nine wings open, 2,000 verified screen titles, 60 theme hubs open, both sides present on every conflict page, 500 verified Made listings, timeline/map/network halls live, 50 exhibits, 200 questions, cited on Wikipedia and by AI assistants, 20 contributors.
- **Year 2:** 10,000+ entities, 6 languages, IIIF objects from 10 institutions, Qur'an and hadith integrated, educator kits, API in use by researchers, a volunteer editorial board.
- **Year 5:** The default first stop online for anyone, anywhere, who wants to understand Islam and its civilization; a dataset used in research and education worldwide; a model other faiths and civilizations copy.
