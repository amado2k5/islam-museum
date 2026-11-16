# Bunuwwa Browser — engineering requirements (acceptance spec)

Spec 55 · plan `docs/plan/63-bunuwwa-browser.md` · lane `bunuwwa` · built 16 Nov 2026

## Original requirement (verbatim, founder request 16 Nov 2026)

> متصفح البنوة في الاسلام
> Sonhood and daughterhood in islam
>
> where it should list all the mentioned and written
>
> Sonhood and daughterhood   البنوة في الاسلام
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
>
> Sonhood and daughterhood   البنوة في الاسلام
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> Sonhood and daughterhood   البنوة في الاسلام
>
> and everything mentioned about
>
> Sonhood and daughterhood   البنوة في الاسلام
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> Sonhood and daughterhood   البنوة في الاسلام
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.

## Acceptance requirements (BUN-R)

- **BUN-R1 — Six filial families.** The browser covers exactly six topic
  families: sons and daughters (البنون والبنات), offspring (الذرية), filial
  piety and disobedience to parents (بر الوالدين والعقوق), orphans and
  suckling (اليتامى والرضاعة), the child's rights (الحضانة والعقيقة
  والميراث), and the named sons and daughters of the stories. Nothing outside
  these is in scope.
- **BUN-R2 — Automatic detection.** Passages are detected at build time by
  `scripts/bunuwwa.ts` over every compiled `passage` record — Qur'an, hadith,
  seerah and every harvested work. Any book harvested in the future that
  contains a matching passage appears automatically without manual tagging.
- **BUN-R3 — Guarded lexicon.** Noisy Arabic terms are gated: bare «ابن»
  never counts (it stands in every isnad and patronymic chain; only the
  possessed relational forms ابنه، ابنتها… count); «ميراث» counts only beside
  children vocabulary; «ولد» counts in its born/child forms; and verified
  false positives are excluded by id.
- **BUN-R4 — Corpus sections.** Each item carries `section` ∈ {quran, sunnah,
  seerah, books, curated} derived from work genre and unit metadata.
- **BUN-R5 — Famous parents and children.** The named parents and children
  surface the graph's own `child_of` edges on person records where a parent
  or child carries the `bunuwwa-browser` tag — no side list.
- **BUN-R6 — Curated records.** `bunuwwa-browser`-tagged records (existing
  records tagged in place plus new cited concepts) are included; new records
  carry trilingual label/summary, trilingual prose under `content/`, defined
  sources, a `provenance` block and accurate `status.review` metadata.
- **BUN-R7 — Page.** `/[lang]/bunuwwa/` exists in all three languages
  (ar/en/ur) in the same commit; title, lede and headings inside
  `data-pagefind-body`; the long list inside `data-pagefind-ignore`;
  readable without JavaScript; client-side filter and six topic chips as
  progressive enhancement; signature view `sig/BunuwwaLines.astro` drawn from
  the browser's own records.
- **BUN-R8 — Navigation.** An Explore-menu entry and a landing-page card in
  all three languages.
- **BUN-R9 — API.** `/api/v1/bunuwwa.json` exports every item with `kind`,
  `work`, `ref`, `unit`, `text` excerpt, `sura`/`aya`, `wings`, `themes`,
  `tags`, `section`, `topics`, `signals` and `edges`; documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
- **BUN-R10 — Register.** Documented in `docs/site/browsers.md`,
  `docs/site/signature-views.md`, the plan index, `docs/agents/lanes.md`,
  `docs/status.md` and `CANARY.md`.
- **BUN-R11 — Honest status.** Draft/review metadata is accurate; no
  unreviewed AI output is presented as verified; public claims are re-read
  from their sources on the day they are written.
