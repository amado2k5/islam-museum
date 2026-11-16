# Ukhuwwa Browser — engineering requirements (acceptance spec)

Spec 55 · plan `docs/plan/63-ukhuwwa-browser.md` · lane `ukhuwwa` · built 16 Nov 2026

## Original requirement (verbatim, founder request 16 Nov 2026)

> متصفح الأخوة في الاسلام
> Brotherhood (including sisterhood) in islam
>
> where it should list all the mentioned and written الأخوة في الاسلام
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a الأخوة في الاسلام should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about الأخوة في الاسلام and everything mentioned about it anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where الأخوة في الاسلام were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.

Scope clarification (founder, same session): "Brotherhood incl.
sisterhood". Repeated "Motherhood and sisterhood" wording in the request
was identified as a typo for brotherhood; motherhood is out of scope.
Quality gate waived by requester ("do not wait for build/test or ci").

## Acceptance requirements (UKH-R)

- **UKH-R1 — Six topical families.** The browser covers exactly six
  families: brotherhood/sisterhood terms (`ikwha`), mu'akhat / the
  Muhajirun–Ansar brothering (`muakhat`), love for God's sake (`hubb`),
  brothers'/sisters' rights and duties (`huquq`), altruism–aid–solidarity
  (`ithar`), and warnings against what breaks brotherhood — envy, hatred,
  estrangement, suspicion, backbiting (`tahdhir`). Warnings are in scope
  as brotherhood's stated contrary; nothing else is.
- **UKH-R2 — Automatic detection.** Passages are detected at build time by
  `scripts/ukhuwwa.ts` over every compiled `passage` record — Qur'an,
  hadith, seerah and every harvested work. Any book harvested in the
  future that contains a matching passage appears automatically without
  manual tagging. Detection inspects passage text (`text_search`/`text`)
  only — never labels, summaries or work titles (a "كتاب الأخوة" chapter
  title alone does not pull a work in).
- **UKH-R3 — Guarded lexicon.** Noisy Arabic terms are gated: «يؤثر»
  verbs require the «على» altruism reading; bare «أثرة» requires a
  brother word in context (46:4's «أَثَارَة» = remnant excluded);
  «عضد/سند» only in the brother-collocation; «دم الأخوين» drug name and
  verified false positives excluded by id in `UKHUWWA_EXCLUDE`. Diacritic
  stripping and boundary rules match the repo's other detectors.
- **UKH-R4 — Corpus sections.** Each item carries `section` ∈ {quran,
  sunnah, seerah, books, curated} derived from work genre and unit
  metadata.
- **UKH-R5 — Brotherhood pairs.** The signature view surfaces the graph's
  own `sibling_of` edges plus curated mu'akhat records
  (`event/brotherhood-of-muhajirun-and-ansar`); no invented
  relationships, and a text alternative on the page.
- **UKH-R6 — Curated records.** `ukhuwwa-browser`-tagged records
  (existing records tagged in place plus new cited concepts) are
  included; new records carry trilingual label/summary, trilingual prose
  under `content/`, defined sources and a `provenance` block.
- **UKH-R7 — Page.** `/[lang]/ukhuwwa/` exists in all three languages
  (ar/en/ur) in the same commit; title, lede and headings inside
  `data-pagefind-body`; the long list inside `data-pagefind-ignore`;
  readable without JavaScript; client-side filter and six topic chips as
  progressive enhancement; `FullFilter slug="ukhuwwa"` and `DraftMark`
  where used by sibling browsers.
- **UKH-R8 — Navigation.** An Explore-menu entry in the `people` group
  beside Usra, and a landing-page card (abstract linked-figures motif,
  no figurative depiction) in all three languages.
- **UKH-R9 — API.** `/api/v1/ukhuwwa.json` exports every item with
  `kind`, `work`, `ref`, `unit`, `text`, `sura`/`aya`, `wings`, `themes`,
  `tags`, `section`, `topics`, `signals` and edge information where
  applicable; documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`.
- **UKH-R10 — Register.** Documented in `docs/site/browsers.md`,
  `docs/site/signature-views.md`, the plan index, `docs/agents/lanes.md`,
  `docs/status.md` and `CANARY.md`.
- **UKH-R11 — Honest status.** Review metadata is accurate; the waived
  quality gate and the detection method's known limits (sibling mentions
  include biological/milk kinship where a brotherhood reading is
  legitimate context) are documented, not hidden.
- **UKH-R12 — Language rule.** Arabic written first; English and Urdu
  shipped in the same commit; Arabic parentheticals use U+2066/U+2069
  isolates; no honorifics typed; Qur'an text only via frozen Tanzil
  passage references.
