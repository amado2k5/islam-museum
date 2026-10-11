# 05 · Editorial policy, licensing, contribution, governance

## 0. Language

Arabic first: all content is written in Arabic in Phases 0–3 and translated later (`docs/language.md`). The rules below apply to the Arabic text; translations must preserve them.

## 1. Voice

The museum speaks like a thoughtful docent: warm, precise, descriptive, never preaching, never sneering. Rules of thumb:

- Describe; do not prescribe. "Muslims fast during Ramadan" not "Muslims must fast". "The tradition holds…" (meaning Sunni Islam, see `docs/scope.md`), "The Hanafi school holds…", "In Twelver Shia tradition, …" (always labelled before the view is stated), "Historians generally agree…".
- Attribute beliefs and reports to their holders; attribute facts to sources.
- Assume the reader knows nothing and is intelligent. Define every Arabic term the first time, inline, then link to the concept.
- No honorifics typed into prose (the UI renders them on request from data). Refer to "the Prophet Muhammad" on first mention, "the Prophet" or "Muhammad" afterwards, following the visitor's setting.
- Plain words over jargon; short sentences; the Brief section is understandable by a 12-year-old.
- Avoid loaded or polemical labels (e.g. do not use sectarian slurs; use the self-designations in the traditions enum).
- Dates always dual, with the calendar flag explained once per page by a tooltip.

## 2. Claims and perspectives

Every key statement is one of: **scriptural** (the Qur'an states), **tradition** (reported in hadith, sira, tabaqat, hagiography), **historical** (consensus of historians, with sources), **debated** (live disagreement, present the positions), **legend** (popular, not supported by sources, but culturally significant). Badges are subtle and explained once on *How to read this museum*.

**Scope.** Sunni Islam is the museum's default and main frame and research starts from Sunni sources; see `docs/scope.md`. Contested topics (succession after the Prophet, the compilation of the Qur'an, the status of particular figures, modern political events, origins debates) **must** use the `perspectives` block with the Sunni position or positions first (by school where they differ), then the academic or historical view, then any other view the topic needs, each cited and each labelled. Editors present the Sunni understanding as the museum's frame and describe every other position accurately and respectfully, naming it before stating it, without adopting it. The goal is that a Sunni Muslim of any school, a secular historian and a curious outsider each recognise the account as fair, and that a visitor from any other community finds their view stated accurately, labelled, and never attacked.

## 3. Sensitive content policy

| Topic | Policy |
|---|---|
| Figurative depictions of prophets | Never displayed. Objects that contain them are described textually; the holding institution's page is linked. |
| Relics and sacred objects | Shown with `sensitivity: sacred` presentation: descriptive, reverent, no gimmicks; provenance debates stated as `debated`. |
| Violence, war, massacres, persecution | Included as history with sober framing, casualty figures with sources and ranges, no graphic imagery by default. |
| Terrorism and extremism | Covered in the *Today* wing as events and groups, framed by sources, with the mainstream Muslim responses and scholarly refutations also represented; never a platform for their material. |
| Colonialism, slavery, gender, sectarian conflict | Covered honestly, with multiple perspectives, primary sources, and modern scholarship; no apologetics, no polemics. |
| Living persons | Only well-sourced public facts; no speculation; a removal/correction channel; privacy-first. |
| Modern politics | Events and actors described; the museum takes no positions; perspectives block mandatory. |
| Children's content | Kid mode hides `violence`, `mature`, `contested`, `polemical` sensitivity items. |
| Opponents, critics and persecutors | Included by significance, not sympathy (`13-figures.md`). Describe the act, attribute the judgement; never "enemy of Islam" in the museum's voice; roles are time-scoped; each side's case stated as its holders would state it. Perpetrators of recent mass violence get a minimal record with no portrait. |
| Polemical and hateful material | Described and cited, never reproduced, displayed or linked for viewing (`sensitivity: polemical`). Media made by violent extremist groups is not indexed. |
| Films and programmes | Listed, not endorsed; no ratings; depiction of prophets, Companions and Imams stated in words, no stills; reception reported with sources and perspectives; official watch links only (`12-screen-index.md`). |
| Contradictions and hard questions | Never hidden. Written as tension cards: the tension in the words of those who raise it, every response in the words of those who give it, at least two cited voices, no verdict from the museum (`14-themes-atlas.md` §4). |
| Women, children, the elderly, people with disabilities, minorities and other protected groups | Three labelled layers kept apart: what the texts say, what each school held and holds, what happened and happens in practice with dated data. Range of positions, communities' own voices, both protection and persecution documented, no rulings, no advocacy (`14-themes-atlas.md` §6). |
| Religion versus custom | Show the texts, the schools, the geography of the practice and present-day voices; the museum does not label a practice "Islamic" or "un-Islamic" (`14-themes-atlas.md` §5). |
| A person's religion | Recorded only as self-identified (the only basis accepted for the living), documented, or reported by tradition, with the basis shown; never inferred from a name, family or origin. |

## 4. Sourcing rules

- Every entity has at least one `source`. Every date and every non-trivial claim in prose carries `{cite:}`.
- Preferred: primary sources in critical editions (via OpenITI/Shamela references), peer-reviewed scholarship, reference works (EI3, Iranica, DİA), museum records.
- Wikipedia/Wikidata are **pointers**, not sources: use them to find sources and IDs, cite the underlying works.
- Hadith are cited by collection and number with a sunnah.com deep link; Qur'an by surah:ayah.
- AI-assisted drafts must be verified against at least two independent sources before `review: reviewed`; the draft label stays until then.
- Uncertainty is information: write "c.", give ranges, explain disagreements in `note`.

## 5. Transliteration and naming

- Body text: simplified ALA-LC without diacritics (Ibn Sina, al-Ghazali, Qur'an, hadith, Shia). `names[]` panel: full ALA-LC with diacritics and the Arabic script.
- Slug: the most common English form (ibn-sina, not avicenna; avicenna is an alias).
- Labels: the museum's house form in `label.en`; well-known Latin/English forms in parentheses on first mention.
- Places: modern common English name as label with historical names in `historical_names`.

## 6. Licensing

| What | License | Notes |
|---|---|---|
| Our prose (`content/`) | **CC BY-SA 4.0** | Compatible with Wikipedia text reuse in both directions. |
| Our structured data (`data/`, `geo/`, `datasets/` we author) | **CC0 1.0** | Facts should be free; maximises reuse and Wikidata round-trips. |
| Code (`site/`, `scripts/`, `schema/`) | **MIT** | |
| Ingested third-party text (e.g. OpenITI CC BY-NC-SA, Smarthistory CC BY-NC-SA, translations) | **Kept under its own license, recorded per version** | Shown on the page, isolated in its own files/directories with a `LICENSE` note; never mixed into CC BY-SA prose. The site stays strictly ad-free and non-commercial so NC content is admissible. |
| Media | Per item, whitelist only: CC0, CC BY, CC BY-SA, CC BY-NC (ad-free site), Public Domain, explicit institutional open terms | Validation fails on unknown license. Attribution rendered under every image. |
| Qur'an text | Tanzil (CC BY, verbatim with link) | Translations only where redistribution is clearly permitted; otherwise deep link to Quran.com. The Quran Foundation API may only be called client-side within its terms, never pre-baked. |
| Hadith text | Classical Arabic text is public domain; translations and numbering schemes per source | Verify sunnah.com terms before any ingestion; deep-link by default. |
| Screen index (`data/screen/`) | **CC0** for the facts we hold: titles, dates, countries, languages, credits, identifiers from Wikidata, open archives and our own cited research | Nothing copied from IMDb, TMDB or all-rights-reserved national databases beyond the identifier; no posters, stills, clips or subtitle files; TVmaze (CC BY-SA) kept separate if used. |
| Harvested material on the founder's Mac | Kept in licence layers (`cc0`, `by`, `by-sa`, `odbl`, `nc`, `link-only`, `unverified`) | Only `cc0` and `by` facts, or facts established by our own reading and cited, may enter `data/`; the validator checks `provenance.layer` (`15-local-harvest.md` §3). |

A **per-version license registry** (like Sefaria) lives in `data/passage/*` and `data/work/*`: every text version records translator, year, source URL and license, and the UI displays it. A `LICENSES.md` at the root lists all third-party content licenses in use.

## 7. Contribution workflow

1. **Suggest** via GitHub Issue Forms: *Suggest an entity*, *Report an error*, *Request a translation*, *Propose an exhibit*. Forms capture the structured fields so an editor (or an AI-assisted script) can turn them into files.
2. **Author** by pull request: copy a template from `templates/`, fill `data/` and `content/`, run `npm run validate`, open the PR. The PR template asks for sources and a sensitivity check.
3. **CI** validates schema, links, dates, licenses, alt text, and builds a preview.
4. **Review**: at least one wing editor approves (CODEOWNERS routes `data/person/**` to the People editors, etc.). Contested topics require two reviewers from different schools or backgrounds where available.
5. **Merge → deploy → credit**: contributors appear on the page ("Contributors") from git history, and in `CONTRIBUTORS.md`.
6. **Translate**: prose files carry `translation_of: en@<hash>`; a weekly job flags stale translations; the Request-a-translation form creates a checklist.
7. **AI assistance**: contributors may use the prompts in `07-prompts.md`; outputs land as `review: draft` with a `generated_by` note, and must be verified before `reviewed`.

Code of Conduct: Contributor Covenant plus a museum-specific clause: respect for all traditions, no proselytising or polemics in any channel, assume good faith, cite rather than argue.

## 8. Governance

- **Steward** (founder) holds the domain, the organisation and final say on charter questions; commits to open licenses irrevocably.
- **Wing editors** (volunteers; initially the steward) own quality per wing.
- **Editorial board** (target year 2): Sunni scholars and educators from different schools and regions; advisory on policy and disputes; names published.
- **Decisions** are recorded as ADRs in `docs/adr/`; policy changes by PR to `docs/`.
- **Disputes** about content go through the perspectives mechanism first, then the board.
- **Legal home**: start as a personal project with clear licenses; move to a non-profit (or fiscal sponsorship) when donations or partnerships need it.
- **Sustainability**: free infrastructure by design; optional sponsorship for translation and editorial grants; never ads, never paywalls.

## 9. Quality metrics

- Share of entities `reviewed`/`verified`; average completeness; citation density (sources per 1,000 words).
- Coverage balance: entities per region per period; share of women; share of non-Arab regions; languages per entity.
- Link health: broken external links per 1,000; alias redirects working.
- Reader signals (privacy-preserving): most-read pages per wing, exit without onward click (dead-end rate), search queries with no results (feed the wanted-list).
