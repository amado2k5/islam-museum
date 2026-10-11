# 14 · The Themes atlas — every aspect of Islam, and how "everything" becomes checkable

> **Scope note.** Sunni Islam (Ahl al-Sunna wa'l-Jama'a) is the museum's default and main frame, and research starts from Sunni sources. Any other point of view may be mentioned, and is always labelled before it is stated so the reader never mistakes it for the museum's frame. The full rule is in [`docs/scope.md`](../scope.md).

The museum already organises the story by **time** (12 periods), **place** (14 regions) and **kind of thing** (22 classes). This document adds the fourth axis: **theme**. Women, children, the elderly, people with disabilities, indigenous peoples and minorities; websites, conferences and gatherings; factions and splits; wars, skirmishes and desertions; religion against custom; contradictions and hard questions; charity and humane work; halal food; evolution; organisations; science, medicine, astronomy: each is a theme that cuts across every period, region and class.

"Everything" is not a promise anyone can keep by intention. It becomes real when it is a **grid with empty cells the public can see**. A theme is covered when its cells are filled; a theme nobody thought of is added in one line and immediately shows up as empty.

## 1. How a theme works

- **A controlled list** in `schema/enums/themes.yaml`: about 125 themes in 16 families (§3), each with a slug, labels in every language, a one-line scope note, and its parent family. Adding a theme is one entry.
- **`themes[]` on every entity** (common base). An entity carries as many as apply: the bimaristan of Nur al-Din is `medicine`, `charity`, `disability`, `waqf`, `institutions`.
- **A hub page per theme** at `/[lang]/themes/<slug>`, assembled by the build from the graph, with one curated part: a short guide (an `exhibit` of `kind: theme-guide`). The rest is derived: the theme's timeline, map, people, events, works, practices, questions, datasets, screen titles, and its tensions (§4).
- **Coverage per theme** on the public coverage page: entities by class, by period and by region; languages; review status; and the minimum set below.

**Minimum set for a theme to count as open:** a reviewed guide · at least 10 questions · at least 25 entities across at least 5 classes · figures from at least 3 traditions and at least 4 regions · the relevant scriptural and legal sources as `passage` and `work` links · at least one `dataset` where data exists · every tension on the theme's list written up · the theme's counter-voices present (critics and responses, per `13-figures.md`).

## 2. Additions to the data model

No new class. The themes need more **kinds**, a few **fields**, some **predicates** and one **structure**.

**`event.kind` gains:** `war` · `campaign` · `battle` · `skirmish` · `raid` · `siege` · `naval-battle` · `revolt` · `civil-war` · `mutiny` · `desertion` · `defection` · `massacre` · `expulsion` · `persecution` · `truce` · `treaty` · `schism` · `council` · `conference` · `congress` · `declaration` · `fatwa-event` · `gathering` · `pilgrimage-season` · `famine` · `epidemic` · `disaster-relief` · `founding` · `law-enacted` · `court-ruling` · `census`.

Conflict events take a common block: `sides[] { label, participants[], commanders[], strength {value, range, sources} }`, `casualties {range, sources, status}`, `outcome`, `part_of` (skirmish → campaign → war), and `laws_of_war[]` links where the sources discuss conduct. Numbers are always ranges with their sources, because the sources disagree.

**Recurring gatherings** (Hajj, Arbaeen, the Bishwa Ijtema, the Grand Magal of Touba, an annual convention) are one `event` of `kind: gathering` with `recurs` (calendar rule in Hijri or Gregorian), `first_held`, and `editions[]` for the years that have their own story or attendance figure; attendance series go in a `dataset`.

**`group.kind` gains:** `sect` · `school` · `faction` · `party` · `militia` · `council` (fatwa council, scholars' body) · `charity` · `relief-agency` · `foundation` · `certifier` (halal) · `standards-body` · `bank` · `university` · `seminary` · `student-association` · `women's-organisation` · `professional-association` · `interfaith-body` · `international-organisation` · `community-organisation` · `mosque-association`.

**`work.kind` gains:** `website` · `app` · `online-library` · `fatwa` · `declaration` · `charter` · `constitution` · `law` · `court-judgment` · `report` · `survey` · `standard` (e.g. a halal standard) · `curriculum` · `sermon` · `lecture-series` · `podcast` · `newspaper` · `journal`.

Websites take: `url`, `launched`, `closed`, `languages[]`, `publisher` (a `group`), `orientation { value, basis ∈ self-described | documented }`, `content_type ∈ scripture | hadith | fatwa | library | education | news | community | children | academic | apologetics | criticism`, and `archive_url` (the Internet Archive snapshot) so a site that disappears keeps its entry.

**`practice` gains `basis[]`:** per tradition, one of `scriptural` · `prophetic-practice` · `juristic` (naming the school) · `customary` · `contested`, each cited, with `regions[]`. This is the field that separates religion from custom (§5).

**Predicates added:** `split_from`/`split_into` and `merged_into`/`absorbed` (groups; dated; with the `schism` event) · `deserted`/`deserted_by` and `defected_to`/`received_defector` · `convened`/`convened_by` · `attended`/`attended_by` · `issued`/`issued_by` (declaration, fatwa, law) · `signed`/`signed_by` · `rules_on`/`ruled_on_by` (a fatwa or law to its `concept`) · `regulates`/`regulated_by` · `certifies`/`certified_by` (exists) · `funds`/`funded_by` · `serves`/`served_by` (an institution to a population group) · `responded_to`/`answered_by` (shared with `13-figures.md`).

**Population groups as nodes.** "Women", "children", "the elderly", "people with disabilities", "orphans", "the enslaved", "converts", "refugees" and each named minority are `group` entities of `kind: people` or `kind: population`, so that a hospital can `serve` them, a law can `regulate` their status, and a visitor can stand on that node and see the whole story from their side.

## 3. The theme families

Each line is a theme (a hub page). Examples in brackets show the breadth expected, not the limit.

### A. People and stages of life
- **Women** [women in scripture; the Prophet's household; women scholars and hadith transmitters; rulers and regents; mystics and poets; law of marriage, divorce, inheritance, testimony by school; veiling and seclusion across regions and centuries; education; women's mosques in China; modern reform, feminism and its critics; data by country]
- **Children and youth** [birth rites; naming; upbringing and schooling, kuttab to madrasa; orphans and guardianship; custody by school; child labour and child marriage as law, practice and reform; children in war; children's media]
- **The elderly** [duties to parents in scripture; old age in law and ethics; care institutions; elders in transmission of knowledge]
- **Family, marriage and kinship** [nikah, mahr, polygyny, divorce, mut'a (perspectives), kinship and fosterage, family law codes by country]
- **People with disabilities** [blind scholars and reciters; Surah 80; the bimaristan and care for mental illness; legal dispensations; deaf communities and sign languages in Muslim societies; modern accessibility of mosques and Hajj]
- **Health, body and death** [illness, medicine as worship, plague literature, burial and mourning, organ donation and end-of-life rulings]
- **Sexuality and gender diversity** [classical law and ethics by school; mukhannathun in the sources; modern laws by country; contemporary debates and lived experience; perspectives mandatory; `mature` flag]

### B. Peoples, minorities and protected groups
- **Indigenous peoples and Islam** [Amazigh; Sahelian and Saharan peoples; Cham; Malay-world adat communities; Makassan contact with Aboriginal Australians; Tatars and Bashkirs; Muslims among Native American and Māori communities today; how Islam met and mixed with indigenous religion and law]
- **Non-Muslim minorities under Muslim rule** [dhimma, jizya, the millet system; Jews, Eastern Christians, Zoroastrians, Hindus, Buddhists, Sabians, Yazidis, Baha'is; flourishing and persecution both documented; the Marrakesh Declaration]
- **Muslim minorities under non-Muslim rule** [Sicily, Iberia after conquest, Russia, China, India, the Balkans, Europe and the Americas today; fiqh of minorities; civil rights; anti-Muslim hatred]
- **Minorities within Islam** [Shia in Sunni-majority lands and the reverse; Ibadis; Ismailis; Zaydis; Alevis; Druze and Alawites (identity as each community states it); Ahmadiyya (status contested: perspectives); Sufi orders under pressure]
- **Race, colour and ethnicity** [Bilal; the Farewell Sermon tradition; shu'ubiyya; the Zanj revolt; anti-Black racism and the Muslim responses to it; Arab and non-Arab; caste among South Asian Muslims]
- **Slavery and freedom** [law and practice; manumission; slave soldiers and slave rulers; the trans-Saharan, Indian Ocean and Atlantic trades; enslaved Muslims in the Americas; abolition and the debates around it]
- **Converts** and **those who leave** [conversion stories across centuries; apostasy in law by school and by modern state; lived experience; perspectives]
- **Refugees, migrants and diaspora** [the first Hijra to Abyssinia; expulsions; modern displacement; diaspora communities by country]
- **The poor and the worker** [poverty in scripture; guilds; labour; debt]

### C. Belief and worship
- **Creed** · **Scripture and its sciences** · **Prophets** · **Worship and the pillars** · **Spirituality and Sufism** · **Afterlife and eschatology** · **Sacred time** · **Sacred space and pilgrimage** (the Living, Ideas and Words wings already hold most of this; the hubs gather it)

### D. Religion and custom
- **Tradition versus culture** [what is scripture, what is law, what is local custom: see §5]
- **Local Islams and syncretism** [Java, the Sahel, the Balkans, South Asia, China, the Swahili coast; shrine cultures; saints' festivals]
- **Dress** · **Music and its permissibility** (perspectives) · **Images and figural art** (perspectives) · **Names and honorifics** · **Humour and everyday life**

### E. Unity, division and dissent
- **Sects and schools** [how each came to be, in its own account and in others']
- **Factions, splits and schisms** [the succession dispute; the Kharijite secession; the Ismaili divisions (Nizari and Musta'li); Ibadi origins; the formation of the four Sunni schools; Akhbari and Usuli; Deobandi and Barelwi; Salafi currents; the branching of Sufi orders; the Nation of Islam and W. D. Mohammed's community; the Ahmadiyya's Qadiani and Lahori branches], rendered as a dated **family tree of movements** from `split_from` edges
- **Takfir and its critics** · **Reconciliation and unity efforts** [Shaltut's 1959 fatwa; the Amman Message; taqrib initiatives]
- **Dissent, heresy and freethought** [who was called a heretic, by whom, and why; inquisitions such as the mihna]

### F. War, peace and the conduct of conflict
- **Wars and campaigns** · **Battles** · **Skirmishes, raids and expeditions** [the maghazi and saraya of the Prophetic era, with the sources' differing counts recorded as such; frontier raiding; corsairs]
- **Civil wars and revolts** [the fitnas; Abbasid revolution; Zanj; modern civil wars]
- **Desertions, defections and withdrawals** [the withdrawal before Uhud; those who stayed behind from Tabuk; the Ridda; Harura; al-Hurr at Karbala; defections between dynasties; mutinies]
- **Conquest and its debates** · **Crusades** · **Mongol invasions** · **Colonial wars and resistance** · **Modern conflicts**
- **Laws of war and peace** [siyar; treatment of prisoners and non-combatants; truces and treaties from Hudaybiyya onward; jihad in its full semantic range, with perspectives]
- **Peace-making and coexistence** [treaties, convivencia and its critics, mediation traditions]
- **Violent extremism and the Muslim response** (Today wing rules)

### G. Gatherings, councils and conferences
- **Pilgrimages and mass gatherings** [Hajj and Umrah; Arbaeen; the Bishwa Ijtema; the Grand Magal of Touba; the 'urs of Ajmer and other shrine festivals; mawlids]
- **Conferences and declarations** [the caliphate congresses of the 1920s; the 1931 Jerusalem congress; OIC summits since 1969; the Amman Message (2004–2005); A Common Word (2007); the Mardin conference (2010); the Marrakesh Declaration (2016); the Grozny conference (2016, contested); the Makkah Charter (2019)], each as an `event` with conveners, attendees, the text issued as a `work`, and its reception
- **Community conventions** [ISNA, MAS-ICNA, Reviving the Islamic Spirit, the Ahmadiyya Jalsa Salana, Tablighi ijtemas, national Muslim councils' congresses]
- **Scholarly councils** [fiqh academies, fatwa councils, moon-sighting committees]

### H. Institutions and organisations
- **International bodies** [OIC and its organs, the Muslim World League, ICESCO, the Islamic Development Bank]
- **Religious authorities** [al-Azhar, the hawzas of Najaf and Qom, Deoband, Diyanet, national muftiates, Dar al-Ifta bodies]
- **Movements and mass organisations** [Nahdlatul Ulama, Muhammadiyah, Tablighi Jamaat, the Muslim Brotherhood and Jamaat-e-Islami (perspectives), Gülen movement (perspectives), the Aga Khan Development Network]
- **Education** [kuttab, madrasa, university; curricula; women's education; Islamic schools worldwide]
- **Mosques** [as institution: governance, funding, architecture, women's space, the mosque census by country]
- **Waqf** [the endowment as the civilisation's social infrastructure, its dismantling and revival]

### I. Digital Islam
- **Famous Islamic websites and apps** [Qur'an and hadith platforms; fatwa sites of every tradition; online libraries; teaching institutes; news and community sites; children's platforms; prayer-time and Qur'an apps], each a `work` of `kind: website` or `app`, listed with its publisher and self-described orientation, and marked "listed, not endorsed"
- **The history of Islam online** [the first sites of the 1990s; forums; satellite preachers to YouTube shaykhs; online fatwas; scholarship on "cyber-Islam"]
- **AI and Islam** [Qur'an and hadith chatbots, their errors, scholarly responses; this museum's own docent rules]

### J. Charity and humane work
- **Zakat and sadaqa** [rules by school; zakat institutions by country; data]
- **Waqf in service** [hospitals, soup kitchens (imaret), fountains (sabil), caravanserais, endowments for animals and birds]
- **Care for orphans, the poor, the sick and the traveller**
- **Modern relief and development** [Red Crescent societies; the major Muslim relief agencies; refugee work; disaster response], with charity-register data where registers are open
- **Animals and mercy** · **Humanitarian principles in Islamic law**

### K. Food
- **Halal and haram** [the scriptural basis; slaughter rules by school; seafood, game and other differences between schools; stunning, mechanical slaughter and gelatin debates; alcohol and intoxicants]
- **Halal certification and standards** [certifiers by country, standards bodies, the disputes between them; recorded, never adjudicated, as in `11-made-directory.md`]
- **The halal economy** (data) · **Cuisines of the Muslim world** by region · **Food of Ramadan and the feasts** · **Hospitality** · **Coffee, sugar and the foods that travelled** · **Fasting**

### L. Knowledge: science, medicine, astronomy and the rest
- **Astronomy and timekeeping** [observatories, zij tables, the muwaqqit, the qibla problem, the calendar, moon-sighting today]
- **Mathematics** · **Optics and physics** · **Chemistry and alchemy** · **Engineering and technology** · **Geography and cartography** · **Agriculture and botany** · **Zoology**
- **Medicine** [the Greek inheritance; hospitals; pharmacology; surgery; ophthalmology; mental health; prophetic medicine and its relation to learned medicine (perspectives); public health and plague; modern bioethics]
- **Philosophy and logic** · **History-writing and social thought** · **Linguistics** · **Libraries, paper and the book**
- **Translation and transmission** [into Arabic; out of Arabic into Latin, Hebrew and the vernaculars]
- **The "golden age", "decline" and the debates about both** (debated: present the positions)
- **Science in Muslim societies today** [institutions, laureates, output data]

### M. Evolution, origins and modern science
- **Evolution** [what the sources say about creation and Adam; passages in al-Jahiz, the Brethren of Purity and Ibn Khaldun and the debate over reading them as precursors; the range of modern Muslim positions: rejection, acceptance with human exceptionalism, theistic evolution; teaching of evolution by country; survey data]
- **Cosmology and creation** · **"Scientific miracles" claims and their critics** (perspectives) · **Islam and modern medicine** · **Environment and climate**

### N. How Islam changed over time
- **Development of law, theology and institutions** [what was fixed early, what formed over centuries, and how each tradition describes that process]
- **Renewal and reform** [tajdid and islah; eighteenth-century revivals; modernism; Salafism; traditionalism; progressive and feminist readings]
- **Islam and the modern state** [colonialism, nationalism, secularism, Islamism, constitutions, the end of the caliphate]
- **Law today** [family law, criminal law, apostasy and blasphemy laws, Islamic finance, by country, as datasets with sources]
- **Rights and freedoms** [the Cairo Declaration and its critics; freedom of religion; women's rights; minority rights]

### O. Encounters with other traditions
- **Islam and Judaism** · **Islam and Christianity** · **Islam and Zoroastrianism** · **Islam and Hinduism** · **Islam and Buddhism** · **Islam and African religions** · **Islam and atheism or secular thought**
- **Polemic and apologetic** (linked to `13-figures.md`) · **Interfaith dialogue** · **Anti-Muslim hatred** [history, definitions (debated), data] · **Antisemitism and anti-Christian hostility in Muslim societies, and the responses to them**
- **Da'wa and Christian mission** · **Images of Islam** (linked to `12-screen-index.md`)

### P. Arts, economy and the world
- **Trade and finance** [caravans, sea routes, credit instruments, riba and Islamic banking] · **Cities** · **Architecture** · **Arts of the book** · **Literature** · **Music** · **Sport** · **Travel** · **Law and courts** · **Environment, water and animals**

## 4. Contradictions and hard questions

The founder's brief includes "contradictions". The museum treats them as a first-class kind of content, because a museum that hides the hard questions is not trusted on the easy ones.

**Four kinds are distinguished**, since they are different things:

| Kind | What it is | Examples |
|---|---|---|
| `textual` | Passages that appear to conflict, and the disciplines built to address them | Verses on wine at different stages; abrogation (naskh); the *mukhtalif al-hadith* literature; differing reports of one event |
| `between-schools` | Real disagreement among traditions and jurists (ikhtilaf) | Succession; combining prayers; temporary marriage; the status of music |
| `ideal-and-history` | Distance between stated ideals and recorded conduct | Equality and slavery; the civil wars among the first generation; tolerance and persecution |
| `tradition-and-modernity` | Tension with modern science, law or ethics | Evolution; gender equality; apostasy laws; freedom of expression |

**The tension card** is a structure used inside `question` and `concept` entities and rendered by a `:::tension` directive:

```yaml
tensions:
  - id: tension/wine-verses
    kind: textual
    statement: { en: "The Qur'an speaks of wine in different ways in different passages." }
    raised_by: [ { who: "classical exegetes themselves", sources: [...] }, { who: "modern critics", sources: [...] } ]
    passages: [passage/quran-16-67, passage/quran-2-219, passage/quran-4-43, passage/quran-5-90]
    responses:
      - { tradition: sunni, summary: "Gradual prohibition; later verses abrogate earlier", sources: [...] }
      - { tradition: shia-twelver, summary: "...", sources: [...] }
      - { tradition: academic, summary: "...", sources: [...] }
    status: debated
```

Rules: the tension is stated in the words of those who raise it · every response is stated in the words of those who give it · the museum does not resolve it and does not call it false · a tension with no response on record says so · none is omitted because it is uncomfortable. A lint rejects cards with fewer than two cited voices.

Criticism of Islam through history (Byzantine, Latin, Enlightenment, missionary, secular, ex-Muslim) and the Muslim replies form their own hub, built from the `responded_to` threads of `13-figures.md`.

## 5. Tradition versus culture

Many of the questions newcomers bring ("Is that Islam or is that culture?") have a checkable answer once the sources are laid side by side. For any practice the museum shows:

1. **What the texts say**, as `passage` links, or that they say nothing.
2. **What each school of law holds**, with citations, from the `basis[]` field.
3. **Where it is actually practised**, on a map, with dates: a practice found among Muslims and non-Muslims of one region and absent among Muslims elsewhere is visibly regional.
4. **What scholars and communities say today**, as perspectives.

Seed set of practices to run through this frame: forms of veiling by region and century · female genital cutting (map against religion and region; juristic positions; fatwas against it) · honour-based violence · forced and child marriage · dowry customs · caste and biradari · saint veneration and shrine visits · the mawlid · amulets and healing customs · wedding and funeral customs · music and dance · circumcision · naming customs · tribal law beside sharia · inheritance custom against Qur'anic shares (for example where daughters are excluded by custom).

The museum's voice stays descriptive: it shows the basis each tradition claims and the geography of the practice, and leaves the judgement to the visitor.

## 6. Writing about protected and vulnerable groups

Extends `05-editorial.md` §3.

- **Three layers, always separated and labelled:** what the scriptural texts say · what the jurists of each school held and hold · what happened and happens in practice, with data. Blurring them is the commonest source of both apologetics and polemic.
- **Range, not a single "Islamic position".** Where schools or modern scholars differ, the page shows the spread with sources.
- **People speak for themselves.** Women scholars on women; disabled Muslims on disability; minority communities in their own self-description; named, cited voices.
- **Data by country with its source and date**, never a generalisation about "Muslim countries".
- **Both records.** Protection and persecution, emancipation and oppression, are each documented where they occurred.
- **No rulings, no advocacy.** The museum describes debates about rights; it does not issue positions.
- **Sensitivity flags** (`violence`, `mature`, `contested`) and kid mode apply; survivors and living individuals are protected by the living-person policy.

## 7. Where the content comes from

Per theme, the harvest (`15-local-harvest.md`) pulls:

| Theme family | Open sources to harvest | Link or cite only |
|---|---|---|
| People, minorities | Wikidata; Pew and UN datasets; national censuses; Wikipedia category trees as pointers | Human-rights reports; ethnographies |
| Division and dissent | Wikidata (`separated from`, `founded by`); OpenITI heresiographies | Encyclopaedia of Islam, Iranica |
| War and peace | Wikidata (conflicts, `part of`, participants); Atlas of Islamic History tables; OpenITI maghazi and chronicles | Modern military histories |
| Gatherings and conferences | Wikidata; official texts of declarations; OIC documents | Press archives |
| Organisations, charity | Wikidata; open charity registers (England and Wales, Australia, the United States) filtered and then verified by hand | Annual reports |
| Digital Islam | Curlie's Islam categories (CC BY); Wikipedia's "Islamic websites" categories; Internet Archive snapshots | The sites themselves |
| Food | Wikidata; standards bodies' public documents; certifier look-ups by hand | Certifier registers that forbid copying |
| Knowledge and science | Wikidata; OpenITI; museum open-access object data; OpenAlex for scholarship | Journal articles behind paywalls |
| Law today | Constitutions and statutes from official gazettes; Wikidata | Comparative-law databases |

The same legal layers apply as everywhere: only openly licensed facts enter the CC0 core; the rest is cited.

## 8. How it appears

- **Themes door in the Atrium**, a fourth cross-cutting entrance beside Questions, Exhibits and the Screening Room: sixteen family cards, each opening its themes.
- **Theme hub page:** the guide · "start here" questions · a timeline and a map filtered to the theme · people (all role families) · key texts · practices with their basis · tensions · data · on screen · what the museum still lacks on this theme.
- **Theme lens everywhere:** the Time, Place and People halls take a theme filter, so the timeline can show only medicine, or only women, or only schisms.
- **Family tree of movements** (Ideas wing): the branching of sects, schools and orders through time.
- **Conflict explorer** (Time and Place wings): war → campaign → battle → skirmish, both sides, with numbers as ranges.
- **"Religion or custom?" view** on practice pages (§5).
- **Stand in their place:** each population group page ("Women", "People with disabilities", "Jews of Muslim lands") re-reads the whole museum from that group's side.
- **Coverage honesty:** each hub ends with its empty cells and a "what is missing?" link to the issue form.

## 9. Roadmap

- **Phase 0:** `themes` enum (about 125 entries, en + ar labels), `themes[]` in the base schema, the added kinds, fields and predicates, the tension structure and its lint, the hub page layout.
- **Phase 1 (with the spine):** tag all spine entities; open **16 hubs, one per family**, to the minimum set: women · non-Muslim minorities under Muslim rule · worship and the pillars · tradition versus culture · sects and schools · battles and campaigns of the Prophetic era (every ghazwa and sariyya as an event with both sides) · pilgrimages and mass gatherings · religious authorities · famous Islamic websites · zakat and waqf · halal and haram · medicine · evolution · renewal and reform · Islam and Christianity · trade and finance. Twenty tension cards. The newcomer questions grow from 60 to about 220 by adding ten per hub.
- **Phase 2:** 60 hubs open; the family tree of movements; the conflict explorer; "religion or custom?" on 30 practices; 100 tension cards; population-group pages.
- **Phase 3–5:** all hubs open; law-today datasets by country; charity and organisation directories joined with the Made wing; digital-Islam history.
- **Ongoing:** the theme × period × region grid on the coverage page; new themes added on request.

## 10. Risks

| Risk | Mitigation |
|---|---|
| "Everything" becomes shallow | Minimum set per hub; hubs open one at a time; draft labels; empty cells shown |
| Hard questions read as attack, or answers read as apologetics | Tension card with attributed voices on every side; no verdict from the museum; lint |
| Protected-group topics inflame | Three-layer rule; data with sources; self-description; Tier A review; perspectives |
| "Culture, not Islam" used to excuse or to accuse | Show texts, schools, geography and voices; no judgement in museum prose |
| Sectarian objection to the family tree | Each community's own account of its origin shown beside others'; dated split events with sources |
| Casualty and army figures used as propaganda | Ranges only; sources shown; status badge |
| Listing a website or organisation looks like endorsement | "Listed, not endorsed"; orientation as self-described; no ranking |
| Taxonomy disputes | Themes are a flat list with scope notes; an entity may carry many; changes by pull request |

## 11. Acceptance tests

1. `/en/themes/medicine` shows a timeline, a map, at least 25 entities from 5 classes, a dataset, and its list of gaps.
2. The Time hall filtered to `schisms` shows dated split events; the family tree renders the Ismaili branches from `split_from` edges.
3. A battle page shows two sides, strength and casualties as ranges with sources, and its parent campaign.
4. The practice page for a contested custom shows texts, the positions of at least four schools, a regional map and present-day voices; museum prose contains no ruling.
5. A tension card with one voice fails the lint.
6. `group/people-with-disabilities` lists institutions that `serve` it, legal dispensations, and named individuals.
7. A website that has gone offline keeps its page, with its archive link and closure date.
8. The coverage page shows the theme × region matrix and marks every hub below its minimum set.
