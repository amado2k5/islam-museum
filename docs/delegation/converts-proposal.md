# Proposal: the converts section (three exhibits for people who embrace Islam)

Status: **proposed, awaiting the founder's written approval** (`docs/ai-change-gates.md` section 1). Written 23 November 2026 on the founder's request: "for the converts, or reverts, add a section that talks about the most famous converts, their names, stories, life, what they did, how they struggled, all of it, and anything else relevant or important that would help a new convert or a convert even 5 years into Islam."

Risk rating: **non-impacting** (section 3). It adds content inside the existing `exhibit`, `person`, `source`, `question` and `event` classes, with no change to licences, languages, ownership, privacy or architecture. Record counts grow, which the filed submissions already say they will. One optional item (section 5, wave 0) touches `schema/` and `i18n/`; it is separate and needs its own approval.

Files this proposal would touch, if approved (nothing is touched now): `data/exhibit/` (3 new), `data/person/` (about 25 new, about 30 enriched), `data/source/` (new registrations), `data/question/` (about 12 new), `content/{ar,en,ur,fr,es}/person/` (prose), `i18n/*.yaml` (only if wave 0 is approved), `docs/site/browsers.md` and `docs/agents/lanes.md` (register rows), `CANARY.md`, `docs/coverage.md`.

The word used throughout is "convert" in the museum's voice, with "revert" given as the term many Muslims prefer, in the exhibit introductions and in the five languages' own idioms. The museum does not choose between them.

## 1. What the museum already holds (counted on 23 November 2026)

Counted by script over `data/*/*.yaml` in this worktree.

- Theme `converts-and-leavers` (`schema/enums/themes.yaml`, family B): **177 persons, 38 events, 9 screen records, 6 groups, 3 works, 2 concepts, 1 question**. The theme mixes people who entered Islam and people who left it.
- Story role `convert` on **108 persons**. Predicate **`converted_under`** (inverse `received_conversion_of`, domain person/group, range person/group/polity, temporal) is in `schema/predicates.yaml`.
- By era the 108 are lopsided: **105 are prophetic-era, 2 pre-Islamic Arabia, 1 modern (`person/roger-garaudy`)**. By region 101 are Arabia; one each Persia/Central Asia and al-Andalus/Europe. There is no convert role on any medieval, early modern or modern Western or African person, even where the record exists.
- Modern converts already stand as person records but without the role or the theme: `muhammad-asad`, `muhammad-marmaduke-pickthall`, `abdullah-quilliam`, `lord-headley`, `muhammad-ali`, `kareem-abdul-jabbar`, `hamza-yusuf`, `abdalhaqq-bewley`, `abdal-hakim-murad`, `bilal-philips`, `siraj-wahhaj`, `asadullah-yate`, `abdur-raheem-green`, `hamza-tzortzis`, `dawud-wharnsby`, `ingrid-mattson`, `keith-ellison`, `mike-tyson`, `dave-chappelle`, `archibald-hamilton`. `malcolm-x` and `yusuf-islam` carry the theme but not the role. All have prose in five languages (7 prose files each, counted). Giving them the role with a basis is a small enrichment, not new research.
- Convert-specific sources already registered: `source/ryad-european-converts-interwar`, `source/wokingmuslim-converts-islamic-review` (the Woking mission's archive; the mission is the Lahore Ahmadiyya, to be labelled as such, see section 4), `source/murad-pickthall-biography`, `source/geaves-sufism-britain-quilliam`, `source/gloqur-asad-message-1964-edition`, `source/gloqur-asad-message-2020`, `source/gloqur-best-speech-pickthall`, `source/institute-of-objective-studies-asad`, plus Wikipedia and Wikidata entity sources for Quilliam, Asad and Pickthall. Early sources already registered: `source/ibn-sad-tabaqat-bewley`, `source/ibn-ishaq-guillaume`, `source/isaba`, `source/ibn-hajar-isaba`, `source/tabaqat-ibn-sad`, `source/siyar-alam-nubala`.
- Exhibits: 318 exist (`path-*`, `hero-*`, `pathway-*`). The exhibit schema (`schema/exhibit.schema.json`) has no `perspectives` field of its own; `perspectives` is defined in `schema/_base.schema.json` and so belongs to `question`, `concept` and the other entity classes. This shapes section 3.

### The 40 best-documented existing converts

Ranked by relations plus cited sources in the record (the number is that sum). All are `person/<id>`.

| # | id | # | id |
|---|---|---|---|
| 1 | umar-ibn-al-khattab (112) | 21 | hamza (34) |
| 2 | khalid-ibn-al-walid (81) | 22 | sajah (33) |
| 3 | uthman-ibn-affan (58) | 23 | nusayba-bint-kab (32) |
| 4 | amr-ibn-al-as (57) | 24 | musab-ibn-umayr (32) |
| 5 | abu-ubayda-ibn-al-jarrah (55) | 25 | abu-hurayra (31) |
| 6 | saad-ibn-abi-waqqas (54) | 26 | suhayl-ibn-amr (30) |
| 7 | bilal-ibn-rabah (52) | 27 | hind-bint-utba (30) |
| 8 | khadija (49) | 28 | ubada-ibn-al-samit (29) |
| 9 | abu-sufyan-ibn-harb (48) | 29 | salman-al-farisi (29) |
| 10 | ikrima-ibn-abi-jahl (44) | 30 | qays-ibn-asim (29) |
| 11 | umm-habiba-bint-abi-sufyan (43) | 31 | amr-ibn-madikarib (29) |
| 12 | umm-salama (42) | 32 | al-zibriqan-ibn-badr (29) |
| 13 | zubayr-ibn-al-awwam (40) | 33 | abdullah-ibn-salam (29) |
| 14 | abbas-ibn-abd-al-muttalib (40) | 34 | abdullah-ibn-amr-ibn-haram (28) |
| 15 | sawda-bint-zama (39) | 35 | safiyya-bint-huyayy (27) |
| 16 | abdullah-ibn-masud (39) | 36 | zayd-al-khayl (26) |
| 17 | zayd-ibn-haritha (38) | 37 | malik-ibn-awf (26) |
| 18 | muadh-ibn-jabal (36) | 38 | al-aqra-ibn-habis (26) |
| 19 | jafar-ibn-abi-talib (36) | 39 | abu-dharr-al-ghifari (26) |
| 20 | adi-ibn-hatim (35) | 40 | tulayha-ibn-khuwaylid (25) |

Caveats the waves must handle: the role `convert` here includes people raised among the first believers and so it fits some (Khadija, Zayd, Ali's generation) as "first to believe" rather than "changed religion"; the room text must say which. Sajah and Tulayha are remembered for claiming prophecy after embracing Islam and then returning (the apostasy wars), so they belong in a "leaving and returning" room, not a hero room. Names 31 to 38 are delegation chiefs of the year of delegations; they are documented but thinly.

### What is missing

1. **No convert records after the Rashidun period carry the role**, and the modern Western, African, Asian and Latin American converts are not linked to each other by any trail.
2. **No convert-experience content at all**: nothing on the first year, the shahada as lived, telling one's family, names, learning prayer, first Ramadan, community, loneliness, burnout, children, ageing. Nothing for a convert five years in.
3. **No convert memoirs or studies as `work` or `source` records** (a handful of `source` entries exist for a few men, none for the genre).
4. **No `question` records** on convert topics, which is where the `perspectives` block lives.
5. **Women converts of the modern era are almost absent** (Maryam Jameelah, Ingrid Mattson only), and the early women (Hind, Umm Habiba, Safiyya, Nusayba) are not framed as converts with families who disagreed.
6. No `converted_under` edges between modern people (for example Pickthall and Quilliam's circle) beyond the prophetic era; the predicate is under-used.

## 2. The famous converts the section would cover (about 60)

"Exists" means a `data/person/<id>.yaml` is in the graph today (checked by file). "Create" means it is not, and a stub or record is part of the plan. Sources: for the early period the already registered `ibn-sad-tabaqat-bewley`, `ibn-ishaq-guillaume`, `isaba` and `siyar-alam-nubala` carry every row marked E; Wikipedia and Wikidata supply entity facts (dates, names, identifiers) only, per the broad rule, and never prose. A source not yet in `data/source/` is registered first (`docs/agents/source-families.md`). Flags: **L** living (modern-figures lane rules: published sources only, no private details, faith value only on two independent sources); **C** contested; **P** politically sensitive; **S** content-safety check required (`docs/agents/content-safety.md`); **H** heterodox affiliation, labelled before stated (`docs/scope.md`).

### A. Early Muslims (22), exhibit 1 rooms 1 and 2

| Person | Record | Sources (beyond E) and flags |
|---|---|---|
| Salman al-Farisi | exists `salman-al-farisi` | E; his Zoroastrian, Christian, then Muslim path is in the record; slave and freedom story needs the Ibn Hisham route |
| Suhayb al-Rumi | exists `suhayb-ibn-sinan` | E |
| Abu Dharr al-Ghifari | exists `abu-dharr-al-ghifari` | E; later political stance contested: perspectives |
| Umar ibn al-Khattab | exists `umar-ibn-al-khattab` | E; the conversion accounts differ by narration: say so |
| Khalid ibn al-Walid | exists `khalid-ibn-al-walid` | E |
| Ikrima ibn Abi Jahl | exists `ikrima-ibn-abi-jahl` | E |
| Amr ibn al-As | exists `amr-ibn-al-as` | E |
| Abd Allah ibn Salam | exists `abdullah-ibn-salam` | E; first Jewish scholar of Medina to embrace Islam |
| Safiyya bint Huyayy | exists `safiyya-bint-huyayy` | E; sensitive wording on captivity and marriage: attribute |
| Al-Najashi (the Negus) | exists `negus-of-aksum` (alias `person/al-najashi`; `najashi-al-harithi` is a different record) | E; the sources record his embracing Islam and the funeral prayer in absentia; the museum records what the sources say, with his faith basis stated |
| Tufayl ibn Amr al-Dawsi | exists `tufayl-ibn-amr-al-dawsi` | E; a poet who brought his tribe |
| Thumama ibn Uthal | exists `thumama-ibn-uthal` | E; captured, then free to choose; used in the "no compulsion" room, with the primary report cited |
| Abu Sufyan ibn Harb | exists `abu-sufyan-ibn-harb` | E; opponent turned believer |
| Hind bint Utba | exists `hind-bint-utba` | E |
| Wahshi ibn Harb | exists `wahshi-ibn-harb` | E; Hamza's killer who embraced Islam: handle as a tension card |
| Suhayl ibn Amr | exists `suhayl-ibn-amr` | E |
| Uthman ibn Talha | exists `uthman-ibn-talha` | E |
| Mus'ab ibn Umayr | exists `musab-ibn-umayr` | E; wealth given up |
| Adi ibn Hatim | exists `adi-ibn-hatim` | E; Christian chief's account |
| Fayruz al-Daylami | exists `fayruz-al-daylami` | E; Persian settler in Yemen |
| Ka'b al-Ahbar | exists `kab-al-ahbar` | E; C: his reports (Isra'iliyyat) are disputed by scholars; perspectives |
| Umm Habiba bint Abi Sufyan | exists `umm-habiba-bint-abi-sufyan` | E; believed against her father |

### B. Medieval and early modern (10), exhibit 1 room 3

| Person | Record | Sources and flags |
|---|---|---|
| Ibn al-Muqaffa | exists `ibn-al-muqaffa` | Zoroastrian-born translator; C: sincerity of his conversion was questioned by contemporaries; perspectives |
| Satuq Bughra Khan (Karakhanid) | create | Central Asian conversion tradition; sources to register (Barthold, Encyclopaedia of Islam entries: terms checked at registration) |
| Berke Khan | exists `berke-khan` | Mongol khan of the Golden Horde |
| Ghazan Khan | exists `ghazan-khan` | Ilkhan; C: motives (politics and faith) argued by historians |
| Anselm Turmeda (Abdallah al-Tarjuman) | exists `abd-allah-al-tarjuman` (same man; verify before creating) | Catalan friar who wrote a book against Christianity; C: contested, polemic; perspectives |
| Leo Africanus (al-Hasan al-Wazzan) | exists `leo-africanus` | Not a convert to Islam but a Muslim made Christian: in the "leaving" room as contrast |
| Uluj Ali (Occhiali) | create | Calabrian-born Ottoman admiral; coerced or voluntary conversion of captives is itself a contested topic: C |
| Murad Reis (Jan Janszoon) | create | Dutch corsair; C and P: piracy, slave raids |
| Mikhail/Mihaloglu-type Balkan Ottoman converts | decide at wave 3 | convert story of the devshirme; C |
| Dimitrie Cantemir | exists | Not a convert; left out on purpose (a Moldavian prince who wrote on the Ottomans); listed to prevent a false entry |

### C. Modern converts (30), exhibit 1 rooms 4 to 7

| Person | Record | Sources and flags |
|---|---|---|
| Abdullah Quilliam | exists `abdullah-quilliam` | registered Wikipedia/Wikidata and `geaves-sufism-britain-quilliam`; Quilliam's own books are public domain: register at wave 2 |
| Lord Headley | exists `lord-headley` | his own "A Western Awakening to Islam" (1914): register; H: Woking mission is Lahore Ahmadiyya |
| Archibald Hamilton | exists `archibald-hamilton` | `wokingmuslim-converts-islamic-review`; H |
| Marmaduke Pickthall | exists `muhammad-marmaduke-pickthall` | `murad-pickthall-biography`, `gloqur-best-speech-pickthall` |
| Muhammad Asad (Leopold Weiss) | exists `muhammad-asad` | `gloqur-asad-message-*`, `institute-of-objective-studies-asad`; his "The Road to Mecca" is in copyright: summarise, cite, no long quotation |
| Alexander Russell Webb | create | first notable American convert (1888); sources: his own writings (public domain), register |
| Etienne (Nasr al-Din) Dinet | create | French painter; Wikipedia/Wikidata for entity facts, Dinet's own books (public domain) |
| Isabelle Eberhardt | create | C: whether she converted or adopted Muslim life is argued; Sufi order ties |
| Rene Guenon (Abd al-Wahid Yahya) | create | C and H: perennialist; faith record by two sources only; described, not endorsed |
| Frithjof Schuon (Isa Nur al-Din) | create | C, P and H: tariqa founder with allegations in the secondary literature; likely `unknown` faith value and a cautious record |
| Martin Lings (Abu Bakr Siraj al-Din) | create | author of a widely read life of Muhammad; H check: Shadhili-Alawi tariqa, which is Sunni |
| Maryam Jameelah (Margaret Marcus) | create | C: her letters to Mawdudi and her later writing; P: she left a Jewish family; no private details |
| Roger Garaudy | exists `roger-garaudy` | the only modern record with the role today; C and P: his later books are condemned in some countries and the founder's rules on sensitive modern figures apply. The museum describes and attributes, no verdict. |
| Malcolm X | exists `malcolm-x` | H and P: Nation of Islam first, then Sunni Islam after Hajj 1964; the autobiography is in copyright; label the Nation of Islam before stating it |
| Muhammad Ali | exists `muhammad-ali` | H and P: Nation of Islam, later Sunni; refusal of the draft is a political act the museum only describes |
| Kareem Abdul-Jabbar | exists `kareem-abdul-jabbar` | L; he embraced Islam in 1968; his own books are in copyright |
| Yusuf Islam (Cat Stevens) | exists `yusuf-islam` | L; 1977 conversion; C and P: the 1989 Rushdie remarks and his later explanation; attribute |
| Murad Hofmann | create | German diplomat and author; died 2020: not L. Wikipedia and Wikidata entity facts; his own books for what he wrote |
| Hamza Yusuf | exists `hamza-yusuf` | L; C and P: political statements are contested and attributed |
| Abd al-Hakim Murad (Timothy Winter) | exists `abdal-hakim-murad` | L |
| Abdalhaqq Bewley | exists `abdalhaqq-bewley` | L; the translator of `ibn-sad-tabaqat-bewley` |
| Jeffrey Lang | create | American mathematician, author of "Struggling to Surrender"; died 2021 (verify before writing); his memoirs are in copyright |
| Gary Miller (Abdul Ahad Umar) | create | Canadian mathematician and preacher; C: the story that he converted after studying the Qur'an is told in many forms; attribute, check dates |
| Bilal Philips | exists `bilal-philips` | L; grandfathered (`modern-figures.md`, ruling 6) |
| Siraj Wahhaj | exists `siraj-wahhaj` | L; grandfathered; P: named once in a 1993 legal case: do not mention beyond what sources state, and S check |
| Zaid Shakir | create | L; US scholar |
| Suhaib Webb | create | L |
| Ingrid Mattson | exists `ingrid-mattson` | L; first woman president of ISNA |
| Dawud Wharnsby | exists `dawud-wharnsby` | L |
| Abdur Raheem Green | exists `abdur-raheem-green` | L; P and S check: his earlier statements are contested; the lane's screening protocol applies |
| Hamza Tzortzis | exists `hamza-tzortzis` | L; P: public debates |
| Khalid Yasin | create | L; P and S check (statements criticised in press): propose only after the S screen |
| Kristiane Backer, Yvonne Ridley, Lauren Booth | create (one or none) | L and P: journalists; media reporting is the only source; propose as a group, hold for the founder's choice (open question 3) |

Excluded on purpose: public-figure rumours of conversion not recorded in a defined source (a famous person is never listed because a website says so); Michael Jackson, Muhammad Ali's siblings; any person whose connection is only to a blocked organisation. Dave Chappelle, Mike Tyson and Keith Ellison are in the graph; they enter the section only if two independent sources attest the conversion and the person's own statements are cited (L, P). **Total candidates: 22 early + 10 medieval + 32 modern = 64; about 36 exist and about 28 are created.**

## 3. Proposed structure: three exhibits

All three are `exhibit` records of kind `trail` (`schema/enums/kinds.yaml` allows exhibition, story, tour, lesson, trail), with `audience` including `newcomer`, rooms with `title`, `body` and `features` in **all five languages** (ar, en, ur, fr, es; the existing exhibits also carry tr and id, which stay valid). Exhibit rooms link to `person`, `event`, `passage`, `source`, `question` and `place` records through `features`. The exhibit schema has no `perspectives`, so the contested and "what scholars say" content in (b) and (c) goes in **`question` records** (the museum's tension-card class, 329 exist) that rooms link to: each `question` carries a `perspectives` block with the Sunni positions first, labelled, then the academic view, no verdict. This needs no schema change.

### (a) `exhibit/path-converts-famous` — "People who came to Islam" (about 45 minutes, newcomer, student, family)

Rooms:
1. **First believers and those who came early.** Khadija, Abu Bakr's circle, Ali, Zayd, Bilal, Suhayb, Salman, Mus'ab. What the sources say they gave up or lost.
2. **Those who came from opposition.** Umar, Khalid, Ikrima, Abu Sufyan, Hind, Wahshi, Suhayl, Uthman ibn Talha, Amr ibn al-As. Tension cards: sincerity, forgiveness, and what the early community did with their past.
3. **Those who came from other faiths.** Abd Allah ibn Salam, Safiyya, Adi ibn Hatim, the Negus, Fayruz, Salman's long road, Tufayl and his tribe.
4. **Families who disagreed.** Umm Habiba against her father; Mus'ab and his mother; Abu Bakr's son; Suhayb's and Bilal's masters. The sources' own accounts of the cost and of how families later reconciled or did not.
5. **Medieval and early modern converts.** Ibn al-Muqaffa, Satuq Bughra Khan, Berke, Ghazan, the Balkan and Mediterranean cases; what the sources can and cannot say of motive.
6. **The Victorian and interwar West.** Quilliam and the Liverpool community, Lord Headley, Hamilton, Pickthall, Webb, Dinet, Asad, Garaudy later; the Woking mission and the Lahore Ahmadiyya labelled before it is stated.
7. **The American story.** Webb, the Nation of Islam (labelled), Malcolm X and the 1964 Hajj, Muhammad Ali, Kareem Abdul-Jabbar, Siraj Wahhaj, Zaid Shakir.
8. **Scholars, translators and writers.** Pickthall, Asad, Bewley, Hofmann, Lang, Murad, Hamza Yusuf, Lings. What each wrote and how readers have received it.
9. **Women who chose Islam.** Hind, Umm Habiba, Safiyya, Maryam Jameelah, Ingrid Mattson, and living women only from published sources.
10. **Those who returned to the faith and those who left.** The `converts-and-leavers` theme's other half: Sajah, Tulayha, Leo Africanus, and why this room exists.

Every room names, per person: who they were before, how the sources say they came, what it cost them, what they did afterwards, and who disagrees about any of it. The museum's voice is descriptive; where a conversion story is told in several versions it says so.

### (b) `exhibit/path-converts-first-year` — "The first year" (about 40 minutes, newcomer)

Written only as what converts report in memoirs and studies, and what named scholars and institutions have written. It gives no ruling and no advice. Rooms and topics:
1. **The shahada.** What it is, who witnesses it in the tradition, and that no ceremony is required in the Sunni schools' accounts; a convert's own accounts of saying it alone, in a mosque, or online. (`practice` and `concept` records; passage references only.)
2. **A name.** What converts report about keeping or changing their names, and what named scholars write; the Companions' own examples (some changed names, some did not).
3. **Learning to pray.** How converts say they learned, what difficulties they report (Arabic, posture, timing, work), what teachers describe; links to existing `practice` records.
4. **Ramadan for the first time.**
5. **Telling family and friends.** Reported reactions, and the early accounts as a mirror (room 4 of exhibit (a)).
6. **Finding a community.** Mosque, study circle, online; what converts say about welcome and about being overlooked.
7. **Loneliness and belonging.** What studies and memoirs say; the Companions' stories of exile and welcome (Salman, Bilal).
8. **Being mistaken for a foreigner, or for a new person who knows nothing.**
9. **Marriage and family questions.** As scholars treat them: marrying a Muslim, a spouse of another faith, a family's obligations. `question` records with `perspectives`: Sunni positions (the four schools where they differ), then the academic view; no verdict.
10. **Money, work and daily life.** What converts report; no advice.
11. **Books and memoirs by converts** (a shelf of `work` records).

### (c) `exhibit/path-converts-five-years-on` — "Five years on" (about 40 minutes, newcomer and others)

1. **Staying power.** What studies and memoirs report about why some stay, why some drift or leave, and how the Companions' accounts describe steadiness.
2. **Family and community, years later.** Reconciliations, mixed households, parents' ageing.
3. **Knowledge.** What converts report about moving from first practice to study; the madhhab question as scholars describe it.
4. **Burnout and doubt.** Reported experiences; scholars' writing on doubt (`question` with perspectives).
5. **Being asked to represent Islam.** What converts say about this; what community leaders have written.
6. **Raising children** as converts, in a household with grandparents of another faith.
7. **Ageing, illness and death as a convert.** Burial, wills and family disagreement as scholars and community bodies describe them.
8. **Giving back.** What converts did: the people in exhibit (a) as examples of what came next.
9. **Further reading.**

### What else would help (not named by the founder)

The shahada and its witnesses; names; the first prayers; telling family; marriage and family law as scholars treat them; Ramadan for the first time; finding a community; loneliness; being mistaken for a foreigner; the Companions' own conversion stories showing families who disagreed (all included above). Further proposals, held for the founder's choice: a **glossary of words a new Muslim hears first** (a `concept` batch); a **"who to ask" room that lists institutions and their published services, not individuals**; a **language trail** (learning Arabic for prayer) linked to existing language exhibits; **converts in each region** as a map using existing `place` records; and a kids and family version of exhibit (b) (the museum already has kids and education layers). Nothing in these gives advice in the museum's own voice.

## 4. Rules and gates

- **Five languages in the same commit** (AGENTS.md, founder rule of 20 November 2026): every `label`, `summary`, `rooms[].title`, `rooms[].body`, `perspectives[]`, `alt` and any other language block; prose in `content/{ar,en,ur,fr,es}/`; Arabic first, French and Spanish from English, `status.review: published` with a `provenance` block.
- **Citations and provenance** per `docs/agents/publication-standard.md`: every fact-stating sentence carries `{cite:<source-id> <anchor>}`, every id resolves to a `data/source/` record, provenance is recorded, and a page number not read is not cited. Run `npm run cite-check -- <ids>` per batch. One source is enough.
- **No typed honorifics**; the renderer adds them. **No Qur'an text typed**: use `[[passage/quran-<sura>-<aya>|label]]`. Passage records are frozen.
- **Arabic parentheses** wrapped as `⁦(...)⁩`; checked by `npm run validate`.
- **A person's faith is recorded only with its basis.** Never "convert" or "sincere" inferred: the `convert` story role carries `status` (tradition, documented) and sources, and the person's `faith` value follows the modern-figures rules (two independent sources for a school; otherwise `unknown`). Conversion dates and place come from the person's own account or a cited biography, stated as theirs. Headship and descent never count.
- **Living people** (flag L): only published sources, no private details (health, family, address, finances, children), no unverifiable quotation, no conclusions about faith or motives; where a source is a person's own channel it is a primary source for that person only. Modern-figures lane rules apply, and the lane's screening protocol where a Somali or other adjacency question arises.
- **Blocked organisations never.** Every candidate is screened against `docs/agents/content-safety.md` before a record is written; a figure whose documented life cannot be told without a blocked group is written neutrally ("an armed group") or not written. The founder's decisions on existing records stand; nothing here is a precedent for adding new content about a blocked group.
- **Heterodox and sectarian affiliations** (Nation of Islam, Ahmadiyya including the Lahore mission behind the Woking archive and Islamic Review, Perennialist orders): named before stated, per `docs/scope.md`.
- **Voice**: warm, descriptive, no sermon, no ruling, no "right way to be a convert", no "enemy of Islam"; opponents, critics and families who disagreed are included and attributed.
- **Images**: no depictions of prophets or Companions; no AI portraits; only whitelisted media (`schema/enums/licenses.yaml`).
- **Every feature is graph, API and search** (AGENTS.md and `docs/site/browsers.md`): all records are in the one graph with registered predicates (`converted_under`, `born_in`, `lived_in`, `member_of` and the existing set; no side table); they appear in the static API through the class exports (`/api/v1/`), `site/public/openapi/v1.json` and `llms.txt` need no change because no new class is added; Pagefind indexes them as entity pages. The exhibits are registered in `docs/site/browsers.md` as a "Converts" row with its landing, `docs/agents/lanes.md` (a new lane `converts`, wave 0), `docs/status.md`, the plan index and the roadmap. If the founder wants a landing page and a signature view, that is a separate site proposal.
- **Gates before a push**: `npm run validate` (0 errors), `npm test`, `npm run coverage`, `CANARY.md` entry per batch, `AI-Agent` trailers, fetch and three-way merge `origin/main`, small PRs; lane content follows the packet pipeline (`docs/agents/pipeline.md`).
- **Truth in every public claim**: the exhibit texts say plainly what they rest on, and that the memoir and study material is a selection, not a survey; no statistic about converts is stated without its source, year and method.
- **Deployment** is the founder's manual step; the merged work goes live at his next deploy.

## 5. Work plan in waves (each at most 25 entities)

**Wave 0 — approvals and lane (no content).** The founder approves this proposal; the lane `converts` is listed in `docs/agents/lanes.md`; the harvest register and enrichment register are checked so no item is redone; the sources below are registered. Optional separate proposals: a `convert` story-role basis note in the docs; a `converted_under` usage note. No schema change is required.

**Wave 1 — enrich what exists (about 25 records, early).** Add the `convert` role (where the record's own sources attest it) and the `converts-and-leavers` theme to the modern persons already in the graph (section 1), correct missing basis fields, and add `converted_under` edges the records already support. Add a "prose gap" check for the 40 best-documented persons: any without prose in all five languages is filled first.

**Wave 2 — modern persons, part 1 (about 20 persons).** Create Quilliam's circle (Webb, Dinet, Headley's and Hamilton's links), Murad Hofmann, Maryam Jameelah, Martin Lings, Jeffrey Lang, Gary Miller, Zaid Shakir, Suhaib Webb. Register the public-domain primary texts first (Quilliam's and Headley's own books; Webb's; Dinet's). Living persons last in the wave, each with its sources checked twice.

**Wave 3 — medieval and early modern (about 12 records).** Satuq Bughra Khan, the Ilkhan and Golden Horde cases, the Mediterranean cases (Turmeda, Uluj Ali, Murad Reis) as `question` cards on voluntary or coerced conversion. Sources registered from open encyclopedic and academic references.

**Wave 4 — the `question` records (about 12) for exhibits (b) and (c)**, each with Sunni positions first and labelled, then academic, then others, and the cited memoirs and studies: the shahada and witnesses; names; family and marriage; ageing and burial; doubt; being asked to represent. Each cites named scholars and convert memoirs; none gives a ruling.

**Wave 5 — the three exhibits** (3 records), the books shelf (`work` records for memoirs, about 20), translations check, `docs/site/browsers.md` and lane rows, CANARY, coverage regeneration.

**Wave 6 — gaps and a second pass**: the people deferred in open question 3, the region map, the glossary, the children's version.

### Source families to onboard first

All registered under `docs/agents/source-families.md` rules (registry entry in `scripts/harvest/sources.yaml`, a `data/source/` entity with `reliability_note`, a row in `docs/attribution.md`). I did not download or fetch anything while writing this, so the statements below are what I know of each source, not a terms check; the terms of each are read and recorded in the `reliability_note` before registration, and a source whose terms are unclear is kept as a citation only.

| Family | What it gives | Status and terms |
|---|---|---|
| The early biographies already registered (`ibn-sad-tabaqat-bewley`, `ibn-ishaq-guillaume`, `isaba`, `siyar-alam-nubala`) | The Companions' conversion accounts | Registered; terms recorded in the existing entities |
| Converts' own public-domain books: Quilliam's "The Faith of Islam" (1887), Lord Headley's "A Western Awakening to Islam" (1914), Webb's writings, Pickthall's lectures (about 1900–1936) | The convert's own account and arguments | Public domain by date as far as I know; the edition and the hosting site (Internet Archive, Wikisource) must be checked at registration; not verified here |
| The Islamic Review and the Woking Muslim Mission archive (`wokingmuslim-converts-islamic-review`) | Interwar convert notices | Registered; Lahore Ahmadiyya source, label before stating |
| Academic open-access studies of converts (for example journal articles and theses on British, American and European converts, found through open repositories; named titles chosen at registration) | What studies say | Open access varies by item; each is read at registration and registered only if the licence allows citing; unverified here |
| Pew Research Center reports on US Muslims and religious switching | Counts and survey findings with year and method | Published openly; the reuse terms must be read before registration; unverified here |
| Institutional convert-support guides published by named Muslim organisations (for instance national mosques or councils) | What institutions say a new Muslim is advised, as their statement | Their statements as attributed positions only; terms read at registration; unverified here |
| Wikipedia and Wikidata (`source/wikidata`, per-article sources) | Entity facts: names, dates, identifiers, birth places | Rule of `docs/delegation/wikipedia-broad-rule-proposal.md`; never prose |
| The memoirs themselves as `work` records ("The Road to Mecca", "Struggling to Surrender", "The Autobiography of Malcolm X", others) | Titles, authors, years, publishers; the books' content summarised in the museum's own words | Copyrighted: cite and summarise, no quotation beyond 40 words (`docs/sources-policy.md`); no text in git |
| Encyclopaedia of Islam and Britannica entries | Medieval and early modern identity facts | Terms checked at registration; unverified here |

## 6. Open questions for the founder

Only the ones I cannot decide myself.

1. **Term in the museum's voice.** Use "convert" in titles and "revert" in introductions, or reverse? *Recommendation:* titles "People who came to Islam" and "New Muslims" in the five languages, with "convert" and "revert" both explained in the introduction and neither imposed.
2. **How modern living people enter.** Create records for living converts such as Hamza Yusuf's circle, Zaid Shakir, Suhaib Webb, Khalid Yasin, Abdur Raheem Green and Hamza Tzortzis, with the modern-figures rules? *Recommendation:* include the living only where two independent published sources exist and the S screen is clear; hold Khalid Yasin, Abdur Raheem Green and the journalists (Backer, Ridley, Booth) until the founder reads the screen results.
3. **Sectarian and politically sensitive converts.** Malcolm X, Muhammad Ali, Roger Garaudy, Schuon, Guenon, and the Woking mission's circle (Nation of Islam, Ahmadiyya, Perennialist). *Recommendation:* include, labelled before stated, with a tension card where the sources conflict; Garaudy and Schuon only after the founder reviews their records' wording.
4. **Do the exhibits give "what to do" lists?** My reading of the museum's voice says no: only what converts report and what named scholars say. *Recommendation:* keep that, and link out to institutions' own published guides as sources, never as the museum's advice.
5. **Marriage, family and funeral questions.** These come near rulings. *Recommendation:* `question` records with the four Sunni schools' positions first where they differ, then the academic view, each cited; no verdict; a plain note that individuals ask a qualified scholar.
6. **Landing page and register entry.** Is a dedicated landing page and signature view (a site proposal) wanted, or are three exhibits linked from the Newcomer path enough? *Recommendation:* three exhibits first; a landing page after wave 5.
7. **A new lane.** Open a lane `converts` with the packet pipeline, or fold the work into the existing figures lanes? *Recommendation:* a new lane, so the claims register shows who is doing what.

Approval of sections 1 to 6 as a whole, or of selected waves, is requested in chat before any record is written.
