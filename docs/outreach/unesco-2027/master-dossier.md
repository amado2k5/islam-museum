# islam.museum: master dossier

_Third edition, **draft for the founder's approval**, 15 November 2026, revised that evening after the founder's review (Annex C, rows 18 to 25). Repository state: commit `63475724ce` on `main`. Live figures read the same day. It replaces nothing until the founder signs it off as `submission-impacting`; the edition of 21 October stays the dossier of record in `docs/outreach/unesco-nomination-dossier.md`. One dossier serves every route; the cover letters in [`letters.md`](letters.md) and the form fields in [`form-texts.md`](form-texts.md) are cut from it. Before it is sent anywhere: re-read every figure from its source (Annex B), replace `[email]` and `[telephone]`, and date it._

---

# islam.museum
## A free, Arabic-first digital museum of Islamic history, open for anyone to read, check and reuse

Founder: **Ahmed Abdel Aal**, Oakville, Ontario, Canada. Citizen of Canada and of Egypt.
`[email]` · `[telephone]` · https://islam.museum (Arabic) · https://islam.museum/en/ · https://islam.museum/ur/
Figures are dated 15 November 2026. The museum is added to every day, so the live site will show more.

### 1. Summary

islam.museum is a free digital museum of Islamic history and civilization, written in Arabic first and published also in English and Urdu. It is built as a knowledge graph: each person, place, event, building, object, book and idea is a record with its sources, its dates in the Hijri and Gregorian calendars, and its ties to other records. A reader can walk it through nine wings, a Grand Tour of forty cornerstone stops across fourteen centuries, timelines, maps, a connections explorer, a learning hub with a Kids' Wing, and an Education Explorer that sets the museum's records beside the lessons of a school curriculum.

One person built it and pays for it. He directs artificial-intelligence tools that research, draft, translate and cross-check the records against cited sources, under rules he wrote and published. The museum says so on its own pages, and this dossier says so too: the records are AI-written, most are labelled drafts, and about one in five is a preliminary card whose sources have not yet been checked. Its data is in the public domain, its prose and code are openly licensed, and the whole museum can be downloaded.

It opened to the public on 11 October 2026.

| At a glance | 15 November 2026 |
|---|---|
| Records with a page of their own, drafts included (the home page calls them entries) | 63,078 |
| Languages | Arabic (first), English, Urdu. The Grand Tour is in Arabic and English |
| Grand Tour | 40 stops, 9 wings, 14 centuries; readable without JavaScript |
| Education Explorer | 65 Ontario curriculum courses, Grades 1 to 12; 361 lessons, labelled drafts |
| Licences | Data CC0 1.0; prose CC BY-SA 4.0; code MIT |
| Cost to the reader | None. No accounts, no advertising, no cookies, no tracking |
| Paid for by | The founder, personally |
| Legal form | A personal project. No organisation exists yet |

### 2. The founder and the project

Ahmed Abdel Aal lives in Oakville, Ontario, and holds Canadian and Egyptian citizenship. islam.museum is his personal project. No organisation, sole proprietorship or NGO exists yet; incorporation as an Ontario non-profit is planned. He signs personally. He shares the management, ownership and direction of the museum with no one, and it stands under no government, religious body or other project.

By the founder's account the idea dates from August 2025 and a prototype timeline application followed in September 2025. The domain islam.museum was registered on 11 October 2026 and the museum opened that day. It is five weeks old in public.

### 3. What a visitor finds

- **Nine wings:** Time, Place, People, Ideas, Objects, Words, Living Islam, Today, and Made.
- **The Grand Tour**, entered through the River of Time: forty cornerstone records met in order, from before the Hijra to the present, each room readable with scripts switched off.
- **Texts:** the Qur'an for continuous reading, in the unaltered Tanzil text with Pickthall's English and Jalandhari's Urdu translations; a hadith library; the Muwatta of Malik report by report; a poetry anthology.
- **Explorers and browsers** over the same records: timelines, a map that moves through time, a connections explorer, and browsers for the Companions, the caliphs, inventions, jobs and crafts, and others.
- **A learning hub** for ages four to eighteen, for teachers and for families, with a Kids' Wing guided by a hoopoe named Hudhud.
- **The Education Explorer:** 65 subject courses of the Ontario curriculum, Grades 1 to 12, each lesson opening with the scholars, inventions, places and verses that belong beside it. Its 361 lessons carry the label "Draft: this lesson was written with AI help and has not yet been read by a human editor."
- **Everything behind the pages:** a public repository, a static JSON interface at `api.islam.museum`, and a dated archive with a DOI.

### 4. Contribution to Arab culture and to dialogue between cultures

The Prize's call names six criteria. The museum's case under each, with its limits:

**Promotion and dissemination of Arab culture.** Arabic is the museum's first language, not a translation target: every record must carry its Arabic name and summary, and prose is written in Arabic first. Most of the books it draws on most are Arabic works, among them Malik's *Muwatta*, al-Suyuti's *Tarikh al-khulafa*, Ibn al-Imad's *Shadharat al-dhahab*, al-Baladhuri's *Futuh al-buldan*, al-Bukhari's *Sahih* and al-Zirikli's *al-A'lam*. The museum turns what these books say about a person, a town or a year into records a reader can find, follow and check, in Arabic and, through the English and Urdu editions, beyond it. Its subject is Islamic history, which is wider than Arab culture and not the same thing; it makes no claim to cover Arab culture outside that history.

**Preservation, safeguarding and development of cultural heritage.** The museum documents heritage; it holds none. The documentation is plain text in open formats, in the public domain, deposited daily with a DOI, and Library and Archives Canada has taken the site into its web-preservation scope. It can be copied whole and cannot be lost with one server or one owner.

**Dialogue between cultures and civilizations.** The museum describes and does not prescribe. Sunni Islam is its stated frame, and any other view is labelled before it is given; contested questions are shown as labelled, cited positions with no verdict. On 2 November 2026 the founder wrote to fifteen commentators and organisations publicly critical of Islam and invited each to send any factual error in writing, to be corrected in public with credit. By 15 November three had replied, and none had sent one.

**Cultural diversity and mutual understanding.** The Education Explorer starts from what a public school class in Ontario already studies and places beside it the part of the story that came through Islamic civilization. The learning hub has a path for each age from four to eighteen. The site is built to a WCAG 2.2 AA baseline, self-assessed as partially conformant, with a public accessibility statement in three languages.

**Innovation and originality.** A museum whose collection is a public knowledge graph in a git repository; built by one person directing AI tools under published rules; served as stored files, with no application server, no database and no AI running for the visitor.

**Demonstrated impact on society.** This is the youngest part of the case, and section 8 gives all of it. The museum does not track its readers and states no audience figure. There is no user study and no measured classroom use on record.

### 5. How the museum is made

- **Who does what.** The founder writes the rules, rules on doubtful cases, and alone publishes the site. AI tools do the research, drafting, translation and cross-checking at build time. The site names them: Claude, ChatGPT, Devin, Grok, Google AI, and Muse, the agent that coordinates the work. Films and their narration are also made with AI tools, and the illustrations in the art gallery are labelled "AI-generated illustration". No AI runs when a page is visited.
- **Authorship, measured.** Of 54,823 content records in the repository, 48,446 (88.4%) name an AI model or agent as their maker and 6,377 (11.6%) name a script, most of them the Qur'an text loaded unaltered from Tanzil. No record claims to have been read by a human editor.
- **Review state.** 44,469 content records (81.1%) are labelled drafts and say on the page that they were "written with AI help from the sources it cites, and not yet read by a human editor." 10,354 (18.9%) are labelled published. Under the museum's publication rule a record stands as published when it cites defined sources and records its provenance; no human read is required, and the published records are AI-written too. The museum shows the reader the sources and leaves the judgement to the reader.
- **Sources.** Published books; the Qur'an text from Tanzil; hadith collections; the catalogues and open collections of museums and libraries; registered websites and datasets; and Wikipedia and Wikidata for the facts of a record (names, dates, places, identifiers), never for prose. Of the content records, 55.1% cite at least one book, 16.6% rest on other sources only, 7.6% on Wikipedia or Wikidata only, and **20.5% (11,260) are preliminary cards**, most of them from a Wikidata import, which say in their own text that their sources are not yet checked. A general history cited on such a card is a placeholder, not a source for it. Twenty-two records cite no source record at all.
- **What the rules forbid.** Typed Qur'an text (it comes only from the frozen Tanzil files), invented dates, quotations or citations, rulings and sermon voice, a person's faith inferred without basis, figurative depictions of prophets or Companions, AI-generated portraits, and any content from or about designated terrorist organisations. A validator enforces these on every change.

### 6. Figures, with their definitions

Two bases are used, and each figure says which. **Live** means the site as built on 14 November 2026 (the build stamp in its public API) and read on 15 November. **Repository** means the public repository at commit `63475724ce` on 15 November, which holds a day's more work than the live site.

| Measure | Figure | Basis |
|---|---|---|
| Records with a page of their own, drafts included, unwritten stubs excluded. The home page calls them entries | 63,078 | Live: public API and home page |
| Record pages, as the home page counts them: one page for each of those 63,078 records and for each of 1,866 names that are linked but not yet written, in each of the three languages. A count of pages, not of articles | 194,832 | Live: home page |
| Record files | 64,374: 54,823 content records and 9,551 source records | Repository |
| Content records labelled draft / labelled published | 44,469 / 10,354 | Repository |
| Content records naming an AI tool as maker / naming a script | 48,446 / 6,377 | Repository |
| Relations between records | 88,506 | Repository coverage report |
| Prose files, Arabic / English / Urdu | 33,080 / 32,884 / 32,870 | Repository |
| Passages (verses and reports) / persons / buildings / events / places | 17,292 / 11,642 / 5,793 / 5,552 / 3,958 | Repository |
| Concepts / works / objects / questions answered | 3,908 / 2,402 / 546 / 322 | Repository |
| Learning pathways / curriculum pathways for teachers | 300 / 12 | Live: home page |
| Source records that are books, chapters, manuscripts or theses | 759 of 9,551 | Repository |
| Source records that are Wikipedia or Wikidata pages | 7,049 of 9,551 | Repository |

**The same count on earlier days.** The home page showed 58,128 on 12 November and has shown 63,078 since the build of 14 November. These are one measure on two dates, every record with a page of its own, drafts included; neither is a count of finished or published articles. Letters sent before 15 November carry the earlier figure, and some carry "some 116,000 pages", a page count on a definition the site no longer uses.

**Growth.** The repository held 19,084 record files on 17 October 2026 and 33,919 on 21 October. Of the 30,455 added since, about 9,300 are source records (most of them Wikipedia and Wikidata pages cited for single facts), about 7,700 are verses and reports entered as records, and about 4,400 are further preliminary cards.

### 7. Openness and preservation

- **Licences.** Structured data: CC0 1.0, public domain. Prose in all three languages: CC BY-SA 4.0. Code: MIT. Third-party media keep their own licences, recorded per item: of 764 media records, 381 are CC0, 88 public domain, 63 CC BY-SA and 10 CC BY; 187 are Victoria and Albert Museum photographs shown under its non-commercial terms and not part of the reusable data; 35 are AI-generated.
- **Access.** The repository at `github.com/amado2k5/islam-museum`; a static JSON interface at `https://api.islam.museum/api/v1/`; structured metadata in its pages.
- **Archive.** A dataset on Zenodo under the concept DOI `10.5281/zenodo.23692511`, with thirteen dated versions to 15 November 2026.
- **Preservation.** On 4 November 2026 Library and Archives Canada accepted the site into its preservation scope and proposed a test crawl, which the founder accepted.
- **Hosting.** Static files on Cloudflare. No accounts, no cookies, no advertising, no tracking.

### 8. Recognition and independent evidence

All of it, dated, and no more than each item supports.

- **Library and Archives Canada**, 4 November 2026: as above.
- **Professor Robert Hoyland**, Institute for the Study of the Ancient World, New York University, 29 October 2026, quoted with his permission: "I am sure it will be a wonderful resource for interested lay persons and students alike."
- **OMNI Television**, 30 October 2026: a report on OMNI Arabic News with an interview of the founder.
- **H-Net**, 14 November 2026: the museum's announcement was distributed to subscribers of the H-Net Commons.
- **International Islamic Youth League** (Freetown), 14 November 2026: confirmed in writing its interest in sharing the museum's learning resources with its youth and education networks in Africa and in exploring curriculum mapping for African countries. A first meeting is set for 24 November 2026. No joint activity has begun.
- **Professor Abdullahi Ahmed An-Na'im**, Emory University: thanked on the museum's Network page for his feedback and for sharing the museum with his audience.
- **Applications and entries, none decided:** an application to the Digital Public Goods Alliance, submitted and under review (GID0094424); an entry to the Museums + Heritage Awards 2027, submitted on 15 November 2026.

### 9. Money and independence

The museum charges its readers nothing. Its Support page gives the running costs: roughly CA$1,900 in a recent month, of which roughly CA$900 was AI assistants and about CA$90 hosting. The same page says that in October and early November "overages and top-ups alone added roughly CA$730 on top of the subscriptions"; it does not say whether that sum is inside the monthly figure. The founder pays them. No grant or sponsorship is recorded. Donations are invited through public fundraising pages; no organisation receives them, the museum is not a registered charity, and a gift buys no say over content. A gift-shop storefront is linked from the site and lists no products. The museum's rules are not changed for a funder.

### 10. What this dossier does not claim

- That any record was reviewed by a person. None is recorded as such.
- That every record is fully sourced. One in five is a preliminary card.
- A track record of years. Article 3 of the Prize's Statutes speaks of an international reputation and of "meritorious actions extending over several years"; the museum has been public since 11 October 2026 and asks to be judged on what was built and opened in that time.
- A legal entity, a board, an institutional partner, an audience figure, a user study, or measured use in classrooms.
- That it has been nominated. The founder is seeking a nomination for the UNESCO–Sharjah Prize through nominators eligible under its Statutes.
- A complete Urdu edition. The Grand Tour is in Arabic and English.

---

### Annex A. Fact sheet

| Item | Detail |
|---|---|
| Name | islam.museum |
| Addresses | https://islam.museum (Arabic), /en/, /ur/ |
| Founder | Ahmed Abdel Aal, Oakville, Ontario, Canada; citizen of Canada and of Egypt |
| Legal form | Personal project; no organisation exists; Ontario non-profit incorporation planned |
| Idea and prototype | August and September 2025 (founder's statement) |
| Domain registered; public opening | 11 October 2026 |
| Records | 63,078 with a page of their own, drafts included (public API; site as built 14 November 2026) |
| Review states | 81.1% draft, 18.9% published; all AI-written; none recorded as read by a human editor |
| Preliminary cards | 11,260 (20.5% of content records) |
| Languages | Arabic first; English; Urdu. Grand Tour: Arabic, English |
| Licences | Data CC0 1.0; prose CC BY-SA 4.0; code MIT; media per item |
| Archive | Zenodo, concept DOI 10.5281/zenodo.23692511 |
| Founder's ORCID | 0009-0000-9215-2906 |
| Running costs | Roughly CA$1,900 in a recent month, paid by the founder |
| Digital Public Goods Alliance | Application submitted, under review (GID0094424) |
| UNESCO–Sharjah Prize | Seeking a nomination |

### Annex B. Where each statement can be checked

| Statement | Check it at | How it was checked for this edition |
|---|---|---|
| Record count and its definition | `https://api.islam.museum/api/v1/meta/counts.json` | Read first-hand, 15 Nov |
| Page count and its definition, pathway counts, licences line, "No cookies. No tracking. No ads." | Home page and footer, `https://islam.museum/en/`; the definition in `site/src/lib/numbers.ts` | Read first-hand. (63,078 + 1,866) × 3 = 194,832 |
| Grand Tour: 40 stops, 9 wings, 14 centuries | `https://islam.museum/en/grand-tour/` | Read first-hand. `/ur/grand-tour/` returns "not found" |
| Education Explorer and its draft label | `https://islam.museum/en/learn/courses/`; repository `data/course/` | Read first-hand; 65 and 361 counted in the repository |
| Authorship, review states, sources, preliminary cards | `python3 scripts/report/claims_audit.py` in the repository | Run at `63475724ce`. The script reports two records as unlabelled; both are AI-drafted and labelled draft (their files are written in a form its pattern misses), and they are counted so here |
| How the museum is made; the publication rule | `/en/method/`, `/en/disclaimer/`, `/en/support/`; `docs/agents/publication-standard.md` | Read first-hand |
| Licences, and the licence of each media item | `LICENSE`, `LICENSE-CONTENT.md`; API index; `data/media/` | Read first-hand; media counted in the repository |
| Zenodo deposit; domain registration date | `https://doi.org/10.5281/zenodo.23692511`; the public registration record for islam.museum | Read first-hand: 13 versions, latest `v2026.11.15`; registered 11 October 2026 |
| Running costs, including the overages sentence | `https://islam.museum/en/support/` | Read first-hand, 15 Nov |
| OMNI report | `https://islam.museum/en/press/` | Read first-hand |
| Professor Hoyland's sentence | His email of 29 October 2026 | Read first-hand, twice. The words quoted are his, from a longer sentence that ends "(which you may quote me on)" |
| H-Net distribution | H-Net Commons notification of 14 November 2026 | Read first-hand. The network's name was not re-read |
| IIYL's interest and the meeting date | Its emails of 14 and 15 November 2026 | Read first-hand |
| Library and Archives Canada | `docs/outreach/marketing-and-outreach-register-2026.md` | Register only; the email was not re-read |
| Professor An-Na'im | `https://islam.museum/en/network/` | Read first-hand |
| Letter to fifteen critics | The founder's sent mail of 2 November 2026 and the replies | Read first-hand: fifteen messages sent; three replies, none giving an error |
| Museums + Heritage entry; idea and prototype dates; DPGA status | The founder's own records | Founder-held |

### Annex C. Change log against the edition of 21 October 2026

| # | What changed | Why | Source |
|---|---|---|---|
| 1 | Records 33,919 in 21 classes became 63,078 records (live) and 64,374 record files; relations 32,526 became 88,506; prose files about 20,000 a language became about 32,900 | Stale by 25 days | Public API; repository at `034002e2da` |
| 2 | "Nothing is marked reviewed until a person has checked it" and "all records are draft" removed. Now: 81.1% draft, 18.9% published, all AI-written, none recorded as human-read, with the publication rule stated | Contradicted since the founder's rulings of 24 October and 15 November 2026; 10,354 records are now `published` | `docs/agents/publication-standard.md`; decision record `dec-20261115-286`; audit script |
| 3 | "Drafting is assisted by AI" became a plain account of who does what, naming the tools | The founder's honesty rule of 15 November 2026: match the site's own Support and Method pages | `/en/support/`, `/en/method/`, `/en/disclaimer/` |
| 4 | Preliminary cards 6,841 became 11,260, and "about 27,100 records with a real citation" became the four-way source breakdown | Stale; the old remainder was not a measured figure | Audit script |
| 5 | "A date without two sources is flagged" removed | No longer the rule: one source is enough for any fact | `AGENTS.md`; publication standard |
| 6 | The reach paragraph (37,930 addresses, 1.41 million requests, crawler shares) removed and replaced with "states no audience figure" | Read on 21 October, mostly automated traffic, and not re-read since. The founder may add a current Cloudflare reading with its date | Old claims register A.5 |
| 7 | "No servers, no per-visitor computation" became "served as stored files, with no application server, no database and no AI running for the visitor" | A Cloudflare Worker serves the stored files; the old wording said more than that | `AGENTS.md` (hosting split) |
| 8 | Media: 471 records became 764; the gallery's 1,349 illustrations are described by the site's own label | Stale | `data/media/`; `site/src/data/architecture-art.json` |
| 9 | Planning "began in September 2025"; "domain registered 19 September 2025" became: idea August 2025 and prototype September 2025 by the founder's account; islam.museum registered 11 October 2026 | The 2025 date is not the registration date of islam.museum. The prototype is no longer named or linked, under the rule that the museum's materials name no other project | Public registration record; the commissioning brief |
| 10 | "The route is a Member State or an NGO in official partnership" (the internal brief) replaced by the full list in Article 6.2 | The Statutes also admit foundations in official partnership, former laureates, eminent personalities, and persons and civil society organisations working in the field | 224 EX/9.II, Annex I; the nomination form |
| 11 | The "Canadian dimension" section and the request for guidance from a National Commission removed | The Canadian Commission abstains from all prize applications; nothing may suggest its support | Its reply of 19 October 2026 |
| 12 | The promises to incorporate "before any prize funds are received" and to publish "the share reviewed by a person each year" removed | Not in the founder's current rulings. Incorporation is stated as planned, nothing more | The commissioning brief, Part 2 and Part 7 |
| 13 | Sustainable Development Goal targets and "1.9 to 2 billion people" removed | Framing rather than evidence; the Prize's six criteria replace them | UNESCO call page |
| 14 | A section "What this dossier does not claim" now names the Article 3 gap | The Statutes ask for years of record; the museum has five weeks | 224 EX/9.II, Annex I, Article 3 |
| 15 | Recognition section added | None existed on 21 October | Annex B |
| 16 | Costs added | The honesty rule asks for real running costs | `/en/support/` |
| 17 | Prose licence kept as CC BY-SA 4.0 | Checked, and correct: the repository, the site footer, the Method page and the API all state it | `LICENSE-CONTENT.md`; site footer; API index |
| 18 | "Candidate" removed from the title line, the heading of section 2 and Annex A; they now say "Founder" | No nominator has filed. Section 10 already said so; the titles now agree with it | The founder's review of 15 November |
| 19 | Section 6 names its two bases, live and repository, and says which each figure rests on. A paragraph ties 63,078 to the 58,128 of 12 November | The review asked for the bridge. The two figures are one measure on two dates, not "published" against "all" | Home page; `site/src/lib/numbers.ts` |
| 20 | "Record pages: 194,832" is now defined by its arithmetic, (63,078 + 1,866) × 3, and called a count of pages, not of articles | The review found it read as inflation. It is the home page's own figure, so it is explained here and kept | `site/src/lib/numbers.ts` |
| 21 | Every repository figure re-read at `63475724ce`: 54,823 content records; 44,469 drafts and 10,354 published; 48,446 AI-named and 6,377 script-made; 11,260 preliminary cards; 88,506 relations; 764 media records | The repository moved during the day. The first draft's two breakdowns each summed to two fewer than their total, because the audit script cannot read two records' labels; both are drafts written by an AI tool and are now counted | Audit script; the two files under `data/journey/` |
| 22 | "Guided trails: 298" became "learning pathways: 300" and "curriculum pathways for teachers: 12" | 298 counted records of one kind; the site counts 300 pathways and says so on its home page | Home page; `data/exhibit/` |
| 23 | The overages sentence now quotes the Support page | The review could not place the figure. It is the museum's own published statement | `/en/support/`, read 15 November |
| 24 | The letter to fifteen critics is now given from the founder's sent mail, with the three replies | It rested on the outreach register alone | Sent mail of 2 November |
| 25 | Professor Hoyland's sentence is kept in the form he wrote | Shortening it to "a wonderful resource" would drop his "I am sure it will be", which is a prediction, not a finding | His email of 29 October |
