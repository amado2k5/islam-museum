# 04 · Experience — halls, lenses, pages

## 1. The mental model

A visitor enters an **Atrium**, chooses a **Wing** (a lens on the whole graph), walks through **Halls** (browse views inside a wing), and reads **Labels** (entity pages). Along the way **Exhibits** (curated narratives) and **Tour / Learn** (guided pathways with a stated goal, `19-tour-learn.md`) offer a story instead of a catalogue, and **Questions** offer a plain-language shortcut. A **Wander** door opens a random label. Every label connects onward through its **Connections** panel, so the visit never dead-ends.

```
Atrium ─┬─ Questions (plain-language door)
        ├─ Tour / Learn (guided pathways with a goal; about 300 planned, `19-tour-learn.md`)
        ├─ Exhibits (curated door)
        ├─ Screening Room (every film, series and programme about Islam, by subject, language, country, era)
        ├─ Themes (about 125 themes in 16 families, each a hub across all wings)
        ├─ Wings ─┬─ Time    ─ Timeline hall · Eras · Snapshot year · Today/On this day
        │         ├─ Place   ─ Map hall · Regions · Journeys · "What was here"
        │         ├─ People  ─ Gallery · Networks · Families & dynasties · Path finder
        │         ├─ Ideas   ─ Concept map · Disciplines tree · Glossary (A–Z / أ–ي)
        │         ├─ Objects ─ Visual grid · By material/type/museum · Deep zoom
        │         ├─ Words   ─ Qur'an · Hadith · Poetry & prose · Languages & scripts
        │         ├─ Living  ─ Practices · Hijri calendar · Festivals · Food/dress/music by region
        │         ├─ Today   ─ Nations · Institutions · Data · Contemporary figures · Future
        │         └─ Made    ─ World map of listings · Categories · Library shelf · Apps · Near you
        ├─ Search (everywhere)
        └─ Wander (random)
```

## 2. The Atrium (home page)

Calm, mostly typographic, one strong image. In order:

1. **Welcome line** in the visitor's language with the Hijri and Gregorian date: *"Today is 19 Rabi' al-Thani 1448 · 11 October 2026."*
2. **Start anywhere**: a search field with live suggestions grouped by class (People · Places · Events · Ideas …), placeholder cycling through example queries ("Why do Muslims fast?", "Córdoba", "Who was al-Khwarizmi?").
3. **Four doors**, as large cards: *I'm new to Islam* (Questions + the Tour / Learn start-here pathway, the 30-minute tour) · *Travel through time* (Timeline) · *Explore the map* (Map) · *Meet the people* (People gallery).
4. **On this day**: 3 events that happened on this Hijri or Gregorian day.
5. **Featured exhibit** (rotates weekly) and **Recently added / updated** (RSS too).
6. **The nine wings** as a quiet row of doors with one-line descriptions.
7. Footer: about, how to read this museum, licenses, contribute, API, languages.

## 3. The Label (entity page anatomy)

Every class renders the same skeleton with class-specific panels, so visitors learn one page once.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb by lens: People › Scholars › Golden Age         [Depth ●○○]   │
│                                                                          │
│ ابن سينا                              (Arabic display name, large)       │
│ Ibn Sina (Avicenna)                   (localized label + transliteration)│
│ c. 980 – June 1037 CE · c. 370 – Ramadan 428 AH                          │
│ Afshana → Bukhara → Isfahan → Hamadan   (place chips, in order of life)  │
│ One-sentence summary.                                                    │
│                                                                          │
│ [Hero image, attribution]      │ AT A GLANCE                             │
│                                │ Roles · Disciplines · Tradition · Era   │
│                                │ Wikidata · VIAF · OpenITI               │
│                                │ Status badges: reviewed ✓ · 3/5 complete│
├──────────────────────────────────────────────────────────────────────────┤
│ IN TIME   ──●────────●──────────●───────   contemporaries strip          │
│ IN SPACE  [mini map with life places and route]                          │
├──────────────────────────────────────────────────────────────────────────┤
│ BODY (depth-controlled): Brief | Standard | Deep                         │
│   Life · Work · Legacy  (+ For young visitors · Notes for scholars)      │
│   :::perspectives  — Sunni view first and main; other views labelled    │
│   Inline [[links]], footnotes {cite}                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ CONNECTIONS  (grouped by relation type, each a row of cards)             │
│   Teachers (1) · Students (4) · Works (12) · Patrons (3) · Influenced (8)│
│   [Open in network view]  [Find a path from here to …]                   │
├──────────────────────────────────────────────────────────────────────────┤
│ IN THE MUSEUM: appears in 3 exhibits · 2 tours · 5 questions             │
│ NEARBY: similar nodes (shared neighbours/tags)                           │
├──────────────────────────────────────────────────────────────────────────┤
│ SOURCES (numbered) · How to cite this page · Download JSON · JSON-LD     │
│ Last updated 2026-10-01 by … · Edit on GitHub · Report an error          │
└──────────────────────────────────────────────────────────────────────────┘
```

Class-specific panels:

| Class | Extra panels |
|---|---|
| `event` | Date with uncertainty explained; participants by role; cause → effect chain; "what else happened that year"; map of location |
| `place` | Timeline of the place (events, buildings, rulers); "What was here" by century; name history; nearby places; modern travel note |
| `building` | Plan/photos (IIIF), style, patron, architect; status timeline (built, damaged, rebuilt); 3D later |
| `object` | Deep-zoom viewer; inscriptions with translation; provenance chain; "where is it now" map; related objects |
| `work` | Table of contents linking to `passage`s; authors; commentaries and translations tree; manuscripts (IIIF); OpenITI link |
| `passage` | Original text (Arabic, proper font) + translations switcher with translator and license; audio; context (asbab al-nuzul, narrator chain); links to people/places/events mentioned |
| `concept` | Definitions by tradition; parent/child concept tree; where it appears (passages); people associated |
| `practice` | When (calendar rule, next occurrence), who, how (brief), regional variations map, scriptural basis |
| `journey` | Animated route map with legs; itinerary table; the traveler; places visited (each linked); sources |
| `polity` | Rulers timeline (succession), extent map with slider, capitals, predecessor/successor, religious policy, art and architecture of the dynasty |
| `period` | Overview, defining events, regions, people active, polities, "enter the period" timeline |
| `language` | Scripts and samples, regions map, literature, number of speakers (dataset), listen |
| `group` | Members, founder, timeline, geography, perspectives |
| `question` | Short answer first; "the longer answer"; "where this leads" (3–6 entities); related questions |
| `exhibit` | Scrollytelling rooms with featured entities and media; progress indicator; "continue the tour" |
| `dataset` | Interactive chart; table; download CSV; method and source |
| `screen` | All titles and scripts; format, year, countries, languages; what it is about (linked); how it depicts sacred figures; versions and dubs; reception with sources; official places to watch; no ratings (see `12-screen-index.md` §8) |
| `person`, `group`, `polity` (added) | "Place in the story": time-scoped roles on any side; "Stance over time" strip; "How others named them" (see `13-figures.md` §6) |
| every class (added) | "On screen": films and programmes about this entity. Theme chips linking to the hubs |

## 4. The halls

### Time hall
- **Zoomable timeline** from 570 CE (and a pre-Islamic prologue) to today. Dual axis: Hijri above, Gregorian below. Rows are lanes by region (14 regions) or by class (events, people lifespans, polities as bars, buildings as marks, works as marks). Zoom from 14 centuries to a single year. EDTF uncertainty renders as soft-edged bars.
- **Filters**: wing, class, tradition, region, tags; "only reviewed".
- **Eras**: period cards in sequence; each opens the period label.
- **Snapshot year**: `/time/year/1000` or `/time/hijri/390`: who was alive (with ages), which polities ruled where (map), what was built, what was written, what happened. A "±10 years" dial. A "play" button advances the year.
- **Today / On this day**: Hijri date, events on this day in both calendars, births and deaths, the current Islamic month explained, upcoming observances.

### Place hall
- **Map** (MapLibre): time slider; layers for places, buildings, events, journeys, polity extents, spread of Islam (dated polygons), trade and pilgrimage routes, scholarly networks (arcs between teacher and student cities). Clustering at low zoom; click → card → label.
- **Regions**: 14 region pages with their own timeline, people, buildings, practices.
- **Journeys**: gallery of routes, each playable.
- **What was here**: enter any modern place (or geolocate) → the Islamic heritage within 100 km, by century.
- **Travel mode**: for a city, a practical "if you visit" panel (buildings standing, museum collections, opening of the site to visitors), sourced.

### People hall
- **Gallery** with facets: era, region, role, discipline, tradition, gender; portrait placeholders use calligraphic name tiles (no invented faces).
- **Networks** (Sigma.js): teacher–student, isnad, family, patronage, correspondence; filter by era; ego-graph for any person; dynasty trees.
- **Path finder**: pick two nodes, see the shortest chains ("Ibn Sina → al-Ghazali → … → Timbuktu").
- **Women in the story**, **Converts**, **Travelers**, **Non-Muslims in the story** as curated facets, because they are systematically under-surfaced elsewhere.
- **Every side of the story** (`13-figures.md`): facets for *Carriers*, *Opponents and critics*, *Protectors and allies*, *Changed sides*, *Rival claimants*, *Observers and scholars from outside*; an encounters layer in the network (debated, corresponded, allied, fought) across faith lines.
- **Pronounce**: audio of names (community-contributed, CC0).

### Ideas hall
- **Concept map**: force graph of concepts by kind; "Beliefs" · "Law" · "Ethics" · "Sciences" · "Arts" clusters.
- **Disciplines tree**: the sciences of the Islamic civilization (tafsir, hadith, fiqh, kalam, falsafa, tasawwuf, lugha, adab, tarikh, tibb, hay'a, handasa, hisab, kimiya, musiqa…) each with key people, works, places, and timeline.
- **Glossary**: A–Z and أ–ي with transliteration, definitions by tradition, one-line usage; downloadable.
- **Debates**: curated pairs ("Reason and revelation", "Succession", "Free will") presented as perspectives.

### Objects hall
- **Visual grid** (masonry) with filters by type, material, century, region, museum; infinite scroll over a compact index.
- **Deep zoom** via IIIF/OpenSeadragon; inscriptions overlay with translation.
- **Collections map**: where the world's Islamic collections are; each institution linked.
- **Relics** treated with `sensitivity: sacred` presentation (no zoom-in gimmicks, descriptive text first).

### Words hall
- **Qur'an**: surah list; ayah view with Arabic (Amiri Quran font), translations switcher (each with translator and license), audio, word-by-word later; links: ayah → events/people/places/concepts (`mentioned_in`) → timeline and map of revelation context. Text from Tanzil (CC BY); translations only where redistribution is permitted; otherwise deep links to Quran.com.
- **Hadith**: collections → books → hadith; narrator chain rendered as a mini isnad graph linking to `person` nodes; deep links to sunnah.com for full scholarly apparatus.
- **Poetry & prose**: anthology by era, language, theme; original + translation; the poet's node.
- **Languages & scripts**: map and timeline; Ajami, Jawi, Arebica, Xiao'erjing; samples and audio.
- **Per-version license registry** (Sefaria model): every text version shows who made it, its license, and what you may do with it.

### Living hall
- **Practices** by kind: pillars, rituals, rites of passage, festivals, customs, food, dress, music, arts, crafts, etiquette; each with regional variation map.
- **Hijri calendar**: interactive month view; observances; moon-sighting explained; conversion tool; "add to my calendar" (ICS).
- **A year in the life**: scrollytelling through the Islamic year.
- **Regional rooms**: "Islam in Indonesia", "Islam in Senegal", "Islam in Bosnia", "Islam in China", "Islam in the Americas" each as an exhibit-like landing.

### Today hall
- **Nations**: modern polities with Muslim populations (dataset), institutions, heritage sites.
- **Institutions**: universities, museums, organisations.
- **Contemporary figures**: scientists, artists, athletes, leaders, Nobel laureates; careful, sourced, living-person policy.
- **Data**: charts from `dataset` nodes (population, hajj numbers, mosques, manuscripts digitised).
- **The 21st century timeline** with the same event schema; sober framing (see editorial policy).
- **Futures**: eschatology as *tradition* (clearly labelled), demographic projections as *data* (clearly sourced), and the museum's own roadmap.

### Tour / Learn (cross-cutting entrance)
- A top-level tab of guided pathways. The visitor says what they want to understand (a phase of history, a group of personalities, a group of events, an idea, a place, a text, a hard question) and gets a short ordered route with a stated outcome, walked **step by step** or seen **all at once** as list, timeline and map. Progress is local to the browser. The rest of the museum is unchanged. About 300 pathways are proposed in the planning phase and built in order of readiness. Full design, data model and rollout: `19-tour-learn.md`. Until the first pathways are ready the tab, the landing page and the coverage page say it is being built.

### Screening Room (cross-cutting entrance)
- Browse by what a work is about, then by language, country, decade made, era depicted, format and approach; two timelines (when made, what time it depicts); a map of where made and where set; Ramadan seasons by Hijri year; a children's shelf. Title pages carry reception and official watch links, and no ratings. See `12-screen-index.md`.

### Themes (cross-cutting entrance)
- Sixteen family cards open about 125 theme hubs: each with a guide, starter questions, a filtered timeline and map, people on every side, key texts, practices with their basis (religion or custom), tension cards for the hard questions, data, screen titles, and its own list of gaps. The family tree of movements, the conflict explorer and the population-group pages live here. Every hall accepts a theme filter. See `14-themes-atlas.md`.

### Made hall
- **World map** of listings by country and category; **category grid**; **Library shelf** (books by living Muslim authors, by genre and language); **Apps shelf**; **Institutions shelf**; **Near you** (geolocation stays in the browser).
- **Listing page**: name in both scripts, kind, categories, founded, map, public links, founder, basis badge (self-identified / documented), certifications with sources, cross-links into the story, last-checked date, correct-or-remove link. No ratings, no ads. See `11-made-directory.md`.
- **No chat, no AI at runtime.** Visitors get precomputed, reviewed pages and client-side tools over static indexes; the Questions wing and search play the role a chatbot would, without a model behind any request (`03-architecture.md` §13).
- **Illustrations setting** (`show | hide`) applies to all AI-assisted images across the museum; each carries an "Illustration" badge and a "how this image was made" disclosure (see `10-image-generation.md`).

## 5. Cross-cutting features

- **Depth dial** (Brief · Standard · Deep) persisted per visitor; Brief shows the `## Brief` section and key facts; Deep adds scholarly notes and all perspectives expanded.
- **Honorifics toggle**: show ﷺ / عليه السلام / رضي الله عنه after names (default on for Arabic UI, off for others; always a one-click choice). Rendered from data roles, never typed into prose, so the text stays neutral for everyone.
- **Perspectives**: the Sunni entry renders as the main column under "Sunni tradition (the museum's frame)"; every other view follows under its own prominent label ("Twelver Shia view", "Academic view"), per `docs/scope.md`. A visitor may set a "preferred school first" ordering among Sunni schools without hiding anything.
- **Kid mode**: bigger type, `## For young visitors` text where present, simplified navigation, no sensitive content.
- **Reading mode / print**: clean print stylesheet; "Print this exhibit as a handout" for educators.
- **Bookmarks → My tour**: localStorage list; export as URL (`/tour?ids=…`) or as a printable sheet; no account.
- **Compare**: pick two nodes of the same class (two dynasties, two scholars, two mosques) → side-by-side facts and timelines.
- **Share cards**: build-time OpenGraph image per entity with Arabic + Latin name, dates, and a motif.
- **Coverage map**: a public page showing what is thin (by era, region, class, language) and inviting contributions.
- **Cite this page**: APA/MLA/Chicago/BibTeX with permalink and version date.
- **Edit this page**: direct link to the file on GitHub plus the issue form.
- **Accessibility**: see architecture §9; alt text mandatory; all interactive halls have a tabular/list equivalent.

## 6. Design language

- **Mood**: a quiet, well-lit museum. Generous margins, large type, few colours. Beauty comes from typography and geometry, not from decoration.
- **Palette** (tokens, visual identity spec): warm alabaster `#F9F8F6` background, ink `#1A1A1A`, deep midnight lapis `#0A2533` (hero band, dark mode ground), museum teal `#113F4E` (links, panels in dark mode), manuscript gold `#C5A059` as the one accent (decorative on light grounds; gold text uses `#7D5D1E`, which passes AA), parchment `#E6D5B8` for panels and light text on dark. Each wing has its own tone for orientation, and each wing number sits in a star medallion. Every text pair meets WCAG 2.2 AA.
- **Geometry**: a procedurally generated girih/star-tiling SVG motif as faint texture in headers and share cards; generated from parameters per entity so every page has a unique but coherent pattern (and nothing is copied from a copyrighted source).
- **Type**: Arabic — Noto Naskh Arabic (body), Amiri Quran (scripture), Reem Kufi (display); Latin — Source Serif 4 (body), Inter (UI). Transliteration follows a simplified ALA-LC without diacritics in body text and full diacritics in the "names" panel.
- **RTL**: the layout mirrors; timelines run right-to-left in Arabic UI; maps keep geography; iconography avoids direction-bound metaphors.
- **Motion**: restrained; reduced-motion honoured; the only animations are route playback and timeline zoom.
- **Imagery rules**: no AI-generated "portraits" of historical figures; no figurative depictions of prophets; calligraphic name tiles as placeholders; real objects, manuscripts, architecture and landscapes from open collections.

## 7. Example visits (acceptance scenarios)

1. **Maya** lands on the Atrium, types "sharia", gets the question *What is Sharia?*: a two-paragraph neutral answer, a perspectives block, links to `concept/sharia`, `concept/fiqh`, `person/al-shafii`, `question/is-sharia-the-law-of-muslim-countries`. Time to first understanding: under 90 seconds.
2. **Tariq** opens Kids' trail *The House of Wisdom*, five rooms, each one object, one person, one place; prints the handout.
3. **Prof. Lindqvist** opens `/api/v1/person/index.json`, filters `died.earliest < 1100`, finds the EDTF strings and Wikidata IDs, downloads `edges.ndjson`, cites the DOI of release 2027.1.
4. **Nadia** opens the Map at 1200 CE around Iberia, sees Córdoba, Seville, Granada, taps the Great Mosque of Córdoba, reads "What was here", bookmarks four places, exports her tour.
5. **Fatima** uses the Snapshot year 1324 CE: Mansa Musa's Hajj, Ibn Battuta setting out, the Ilkhanate, the early Ottomans, Ibn Taymiyya's final years, the Alhambra under construction; she follows the journey of Mansa Musa.
6. **Layla** opens Tour / Learn, picks *a phase of history* and *30 minutes*, and is walked through the Meccan period in nine steps, each with its why and its recap, without opening a single other tab.
7. **An AI assistant** asked "When did Ibn Sina die?" fetches the page, reads JSON-LD with EDTF `1037-06`, Hijri `0428-09`, and cites `https://islam.museum/en/person/ibn-sina`.
