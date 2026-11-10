# E4 proposal — the teen wing (Scholars 13–15, Researchers 16–18)

**Status:** proposal only. Nothing here is built and no route exists until the founder approves E4 in chat; on approval the quote is recorded in `docs/delegation/education-master-plan.md` §9.1 in its own PR, then E4 is built step by step, one PR each. Scope and acceptance tests follow plan §5 E4.

**Decisions needed (one yes/no per block, and per topic below).**

## 1. Wing shape — decide: yes / no

Two bands, no mascot: **Scholars 13–15** and **Researchers 16–18**, under a new route family `/{lang}/shabab/` (timeline-first hub reusing `HijriTimeline.astro` with hot spots for dilemmas and detective units; no Hudhud, no emoji in headings). Routes: `/shabab/`, `/shabab/scholars/`, `/shabab/researchers/`, `/shabab/60s/{topic}/`, `/shabab/practice/{topic}/`, `/shabab/glossary/{topic}/`, `/shabab/dilemmas/{slug}/`, `/shabab/detective/{slug}/`, `/shabab/journey/`, plus `/shabab/daily/` and `/shabab/where/` (E3 engines already exist). The teen doors on the front door move from `/learn/trails/` to `/shabab/` only after the E4 routes merge.

## 2. The 50 taught topics — decide per row: yes / no

Each topic ships: one 60-second explainer (~150 words), a 12-term glossary, a 10-question self-marking practice set with an explanation under every option, and links into the graph — trilingual (ar first, then en, ur) in the same commit. Anchors are the homework-topics targets already in `edu/homework-topics.yaml`; the "sources" column counts the anchor record's cited sources (what the explainer will cite — exhibits cite the pathway record itself, entity anchors cite their listed sources).

| Topic | Anchor record | Sources it will cite | Approve? |
|---|---|---|---|
| `crusades` | `exhibit/pathway-g11-chw3m-crusades-muslim-side` | pathway record + its linked entities | yes / no |
| `rise-of-islam` | `exhibit/pathway-g11-chw3m-rise-of-islam` | pathway record + its linked entities | yes / no |
| `baghdad-silk-roads` | `exhibit/pathway-g11-chw3m-baghdad-and-the-silk-roads` | pathway record + linked entities | yes / no |
| `al-andalus` | `exhibit/pathway-g11-chw3m-al-andalus` | pathway record + linked entities | yes / no |
| `mongols` | `exhibit/pathway-g11-chw3m-mongols-and-after` | pathway record + linked entities | yes / no |
| `five-pillars-path` | `exhibit/pathway-g11-hrf3o-five-pillars-daily-life` | pathway record + linked entities | yes / no |
| `art-architecture` | `exhibit/pathway-g11-hrt3m-islamic-art-architecture` | pathway record + linked entities | yes / no |
| `life-of-prophet` | `exhibit/pathway-g11-hrt3m-life-of-the-prophet` | pathway record + linked entities | yes / no |
| `quran-text` | `exhibit/pathway-g11-hrt3m-quran-as-a-text` | pathway record + linked entities | yes / no |
| `ottomans` | `exhibit/pathway-g12-chy4u-ottomans-gunpowder-empires` | pathway record + linked entities | yes / no |
| `four-cities` | `exhibit/pathway-g4-social-studies-four-cities` | pathway record + linked entities | yes / no |
| `hajj-network` | `exhibit/pathway-g6-social-studies-hajj-network` | pathway record + linked entities | yes / no |
| `badr` | `event/battle-of-badr` | 9 cited sources | yes / no |
| `hijra` | `event/hijra` | 7 cited sources | yes / no |
| `first-revelation` | `event/first-revelation` | 7 cited sources | yes / no |
| `conquest-mecca` | `event/conquest-of-mecca` | 6 cited sources | yes / no |
| `ibn-battuta` | `person/ibn-battuta-muhammad` | 1 cited source | yes / no |
| `ibn-sina` | `person/ibn-sina` | 5 cited sources | yes / no |
| `al-khwarizmi` | `person/al-khwarizmi` | 2 cited sources | yes / no |
| `ibn-rushd` | `person/ibn-rushd` | 2 cited sources | yes / no |
| `mansa-musa` | `person/mansa-musa` | 1 cited source | yes / no |
| `fatima-al-fihri` | `person/fatima-al-fihri` | 1 cited source | yes / no |
| `al-ghazali` | `person/al-ghazali-abu-hamid` | 2 cited sources | yes / no |
| `mimar-sinan` | `person/mimar-sinan` | 1 cited source | yes / no |
| `salah-al-din` | `person/salah-al-din-yusuf-ibn-ayyub` | 4 cited sources | yes / no |
| `kaaba` | `building/kaaba` | 4 cited sources | yes / no |
| `alhambra` | `building/alhambra` | 1 cited source | yes / no |
| `dome-of-rock` | `building/dome-of-the-rock` | 4 cited sources | yes / no |
| `cordoba-mosque` | `building/great-mosque-cordoba` | 2 cited sources | yes / no |
| `al-aqsa` | `building/al-aqsa-mosque` | 3 cited sources | yes / no |
| `suleymaniye` | `building/suleymaniye-mosque` | 1 cited source | yes / no |
| `blue-mosque` | `building/blue-mosque` | 1 cited source | yes / no |
| `umayyad-mosque` | `building/umayyad-mosque` | 4 cited sources | yes / no |
| `baghdad` | `place/baghdad` | 4 cited sources | yes / no |
| `cordoba` | `place/cordoba` | 3 cited sources | yes / no |
| `timbuktu` | `place/timbuktu` | 1 cited source | yes / no |
| `cairo` | `place/cairo` | 5 cited sources | yes / no |
| `delhi` | `place/delhi` | 1 cited source | yes / no |
| `istanbul` | `place/istanbul` | 1 cited source | yes / no |
| `mecca` | `place/mecca` | 1 cited source | yes / no |
| `medina` | `place/medina` | 3 cited sources | yes / no |
| `jerusalem` | `place/jerusalem` | 3 cited sources | yes / no |
| `five-pillars` | `concept/five-pillars` | 4 cited sources | yes / no |
| `hijri-calendar` | `concept/hijri-calendar` | 2 cited sources | yes / no |
| `algebra` | `concept/algebra` | 1 cited source | yes / no |
| `astronomy` | `concept/astronomy` | 1 cited source | yes / no |
| `calligraphy` | `concept/islamic-calligraphy` | 1 cited source | yes / no |
| `salah` | `practice/salah` | 2 cited sources | yes / no |
| `sawm` | `practice/sawm-ramadan` | 3 cited sources | yes / no |
| `zakat` | `practice/zakat` | 3 cited sources | yes / no |

**Counts:** 50 topics × (150-word explainer + 12-term glossary + 10-question set) = 50 practice sets, 600 glossary terms — ≈ 164 trilingual author-hours (plan §5 E4).

## 3. Dilemma and debate cards — 30, decide: yes / no

Each card: a decision, **two attributed positions** (holder named, never anonymous), an evidence card each, a "you decide" reflection stored only in the existing localStorage keys, sources attached, **no verdict/winner/correct field anywhere**. Sensitive topics (sectarian violence, modern conflicts) excluded from the first 30 per plan. Proposed list (position holders are the records the card will cite):

1. `moving-the-capital-to-damascus` — the Umayyad court's case (al-Baladhuri's narrative tradition) vs the Abbasid-era critique (al-Tabari's framing).
2. `paper-or-parchment` — the Samarran scribal economy (chancery records) vs the baghdadi booksellers' conservatism (Ibn al-Nadim's Fihrist).
3. `translate-or-compose` — the House of Wisdom's translators (Hunayn ibn Ishaq's circle) vs scholars who argued for original Arabic science (al-Biruni's stance).
4. `tolerance-tax` — the dhimma compact as jurists wrote it (the pact texts) vs the academic reading of its real cost (academic view, labelled).
5. `the-cordoban-libraries` — al-Hakam II's collectors (Ibn Hazm's testimony) vs the austere scholarly objection.
6. `students-or-teachers` — madrasa institutionalisation (al-Maqrizi's Cairo account) vs the elder teaching-circle model (Sufi khanqah tradition).
7. `why-baghdad-was-round` — al-Mansur's geometry (al-Tabari) vs the geographers' strategic reading (al-Ya'qubi).
8. `the-price-of-unity` — Abd al-Rahman III's caliphate claim (his own proclamation record) vs the Umayyad loyalists' caution.
9. `genghis-or-sultan` — the Mamluk decision to fight at Ayn Jalut (al-Maqrizi) vs the counsel to wait (the Damascene chroniclers).
10. `the-timbuktu-book-tax` — the qadi's protection of manuscripts vs the Moroccan occupying authorities (Tarikh al-Sudan / Tarikh al-Fattash, both cited).
11. `astrolabe-in-the-mosque` — the astronomer-practitioners (al-Khalili's tables) vs jurists wary of instruments for prayer times (a documented juristic hesitation, attributed).
12. `anatomy-lessons` — Ibn al-Nafis's dissection argument vs the discomfort recorded in juristic writing.
13. `observatory-at-maragha` — Nasir al-Din al-Tusi's case for endowment vs the waqf-law caution of his time.
14. `the-samarra-experiment` — al-Mu'tasim's new capital (al-Ya'qubi) vs the Baghdad establishment it displaced.
15. `greek-into-arabic` — the translation movement's patrons vs the grammarians who feared foreign logic (attributed juristic/literary voices).
16. `the-ferghana-valley-khanate` — conversion by gradual trade contact vs the Turkic-royal-conversion narratives (both as the sources tell them, labelled).
17. `coinage-reform` — Abd al-Malik's dinar standardisation vs the dual-currency pragmatists (both in numismatic and chronicle evidence).
18. `tax-farming` — the fiscal administrators' practice (al-Mawardi's rules) vs the moralists' objection (attributed).
19. `the-almohad-turn` — Ibn Tumart's reform programme (his own credal texts) vs the Almoravid establishment it replaced.
20. `garrison-or-city` — Fustat vs Cairo as Egypt's seat (al-Maqrizi's argument) vs the Fatimid planners' intent.
21. `quarantine-the-plague` — the physicians' isolation advice (Ibn Khatima, Ibn al-Khatib's treatises) vs the fatalist objection of their day.
22. `seafarers-law` — the mariners' customary code vs the jurists' attempt to codify it.
23. `silk-or-sumac` — Baghdad's luxury economy (the qadi's trade books) vs the pietist critique of luxury (attributed sermon voice).
24. `the-paper-fatwa` — jurists permitting paper for religious texts vs those who resisted (a documented early hesitation).
25. `apprentice-or-book` — the master-craftsman's guild way vs the court workshop model (Ottoman registers).
26. `walls-of-dehli` — the sultanate's urban defence (Barani's history) vs the chronicler who counts its cost.
27. `the-muezzin's-clock` — the timkeepers' water clocks vs reliance on observed sky (both documented).
28. `heritage-rent` — the Ottoman vakf's preservation logic (vakf records) vs the critique of dynastic monument spending.
29. `open-the-hospital` — Nur al-Din's bimaristan endowment (Ibn Jubayr's account) vs the older physician-house model.
30. `the-muhtasib's-scale` — market inspection as public good (hisba manuals) vs the trader's complaint (attributed literature).

## 4. Source Detective units — 20, decide: yes / no

Each: one claim + three evidence cards — an isnad strip from a chained passage, a chronicle excerpt rewritten in the museum's words with citation, an object photo or whitelisted illustration; the student grades what the evidence proves on a four-step scale and compares with a historians' note. Acceptance rule: each unit's three evidence ids must exist and ≥1 must be a `passage/` with a `chain`. Proposed claims:

`who-wrote-down-the-quran` (Uthmanic recension), `the-first-minaret`, `who-built-the-dome`, `paper-after-talas`, `numbers-from-india`, `the-hospital-of-baghdad`, `what-caravans-carried`, `the-round-city-plan`, `cordoba-streetlight`, `the-almohad-calendar`, `the-mail-of-the-mamluks`, `genealogy-of-an-astrolabe`, `the-salt-gold-ledger`, `a-map-of-the-world-1154` (al-Idrisi), `the-lighthouse-fees`, `the-madrasa-deed`, `who-kept-time-in-the-mosque`, `the-saddle-and-the-steppe`, `the-glassweights`, `the-translation-fee` (what a translator earned).

## 5. Components and rules — decide: yes / no

`TeenHub.astro`, `SixtySeconds.astro` (reading bar, no timer pressure), `PracticeSet.astro` + `scripts/practice.ts` (keyboard-first), `Dilemma.astro`, `Detective.astro`, `JourneyMap.astro` (territories coloured from the passport, printable). Editorial rules per plan §5 E4: positions attributed, Sunni position first on religious matters then the academic view, no scoring of positions, excerpts under 40 words quoted else paraphrase-with-citation, no image of a person. Data files `edu/topics-50.yaml`, `edu/dilemmas/*.yaml` (30), `edu/detective/*.yaml` (20) — validator checks ids and position holders.

**Acceptance tests (from plan):** every topic with all three parts in all three languages; every question exactly one answer + explanation; every dilemma ≥2 attributed positions, no verdict field; every detective unit's three ids exist ≥1 chained passage; no Hudhud/emoji on the teen hub; keyboard-only completion recorded; check-weight on the family; Urdu flagged for review.

**Effort:** ≈ 291 trilingual author-hours, 12–15 agent-days, built in steps of one PR each.
