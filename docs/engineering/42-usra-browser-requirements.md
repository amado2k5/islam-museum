# Usra Browser — engineering requirements (acceptance spec)

Spec 42 · plan `docs/plan/54-usra-browser.md` · lane `usra` · built 12 Nov 2026

## Original requirement (verbatim, founder request 12 Nov 2026)

> متصفح الزيجات الاشهر في الإسلام وأسر المسلمون وتفاصيل مساكنهم ومعاشهم وتفاصيل عن حياتهم اليومية و عاداتهم الإجتماعية
>
> where it should list all the mentioned and written
> الزيجات الاشهر في الإسلام وأسر المسلمون وتفاصيل مساكنهم ومعاشهم وتفاصيل عن حياتهم اليومية و عاداتهم الإجتماعية
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
> الزيجات الاشهر في الإسلام وأسر المسلمون وتفاصيل مساكنهم ومعاشهم وتفاصيل عن حياتهم اليومية و عاداتهم الإجتماعية
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about الزيجات الاشهر في الإسلام وأسر المسلمون وتفاصيل مساكنهم ومعاشهم وتفاصيل عن حياتهم اليومية و عاداتهم الإجتماعية and everything mentioned about it anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where it was mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.

## Acceptance requirements (USR-R)

- **USR-R1 — Six topical families.** The browser covers exactly six families:
  famous marriages, Muslim families/children, dwellings, livelihood, daily
  life, and social customs. Nothing outside these is in scope.
- **USR-R2 — Automatic detection.** Passages are detected at build time by
  `scripts/usra.ts` over every compiled `passage` record — Qur'an, hadith,
  seerah and every harvested work. Any book harvested in the future that
  contains a matching passage appears automatically without manual tagging.
- **USR-R3 — Guarded lexicon.** Noisy Arabic terms are gated: «زواج/زوج»
  requires a marital collocation excluding the matched token («أزواج»
  meaning pairs/kinds is excluded); «خطبة» requires marriage context
  (Friday sermons excluded); «نفقة» verbs in divine voice are excluded;
  publisher «دار» names and verified false positives are excluded by id.
- **USR-R4 — Corpus sections.** Each item carries `section` ∈ {quran, sunnah,
  seerah, books, curated} derived from work genre and unit metadata.
- **USR-R5 — Famous marriages.** Marriages surface the graph's own
  `spouse_of`, `child_of` and `parent_of` edges on person records, plus
  marriage events (at minimum `event/marriage-of-fatima-and-ali`).
- **USR-R6 — Curated records.** `usra-browser`-tagged records (existing
  records tagged in place plus new cited concepts) are included; new records
  carry trilingual label/summary, trilingual prose under `content/`, defined
  sources, a `provenance` block and `status.review: draft` until a human
  reads them.
- **USR-R7 — Page.** `/[lang]/usra/` exists in all three languages
  (ar/en/ur) in the same commit; title, lede and headings inside
  `data-pagefind-body`; the long list inside `data-pagefind-ignore`;
  readable without JavaScript; client-side filter and six topic chips as
  progressive enhancement.
- **USR-R8 — Navigation.** An Explore-menu entry and a landing-page card in
  all three languages.
- **USR-R9 — API.** `/api/v1/usra.json` exports every item with `kind`,
  `work`, `ref`, `unit`, `text` excerpt, `sura`/`aya`, `wings`, `themes`,
  `tags`, `section`, `usra_kind`, `topics`, `signals` and `edges`; documented
  in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
- **USR-R10 — Register.** Documented in `docs/site/browsers.md`, the plan
  index, `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md`.
- **USR-R11 — Honest status.** Draft/review metadata is accurate; no
  unreviewed AI output is presented as verified.

## Verification

`npm run validate` (0 errors), `npm test`, `npm run build`; detector counts
sampled for false positives per USR-R3; trilingual YAML parses; graph build
exports the api file. (The requester waived the gates for this ship; results
are recorded in the PR.)
