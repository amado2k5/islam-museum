# Ubuwwa Browser — engineering requirements (acceptance spec)

Spec 55 · plan `docs/plan/63-ubuwwa-browser.md` · built 16 Nov 2026

## Original requirement (verbatim, founder request 16 Nov 2026)

> متصفح الابوة في الاسلام
> Fatherhood in islam
>
> where it should list all the mentioned and written
> Fatherhood الابوة في الاسلام
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
> Fatherhood الابوة في الاسلام
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
> Fatherhood الابوة في الاسلام
> and everything mentioned about
> Fatherhood الابوة في الاسلام
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
> Fatherhood الابوة في الاسلام
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.

## Acceptance requirements (UBW-R)

- **UBW-R1 — Topic scope.** The browser covers the father and fatherhood
  in Islam (الأب والأبوة): Qur'anic fathers and their counsel, dutifulness
  to the parents (birr) and disobedience ('uquq), fathers raising,
  teaching and advising children, paternity and lineage (nasab), and the
  orphan whose father is lost (yatm). Nothing outside these families is
  in scope.
- **UBW-R2 — Automatic detection.** Passages are detected at build time by
  `scripts/ubuwwa.ts` over every compiled `passage` record — Qur'an,
  hadith, seerah and every harvested work. Any book harvested in the
  future that contains a matching passage appears automatically without
  manual tagging.
- **UBW-R3 — Guarded lexicon.** Noisy Arabic terms are gated: the kunya
  «أبو فلان» is a man's name, not a fatherhood report, so bare «أبو»
  never counts — only possessed, plural and vocative father forms; child
  vocabulary counts only beside a father word in the same context window
  («يا بني آدم» in God's voice is excluded); verified false positives are
  excluded by id in `UBUWWA_EXCLUDE`.
- **UBW-R4 — Corpus sections.** Each item carries `section` ∈ {quran,
  sunnah, seerah, books, curated} derived from work genre and unit
  metadata.
- **UBW-R5 — Famous fathers.** The fathers list surfaces the graph's own
  `parent_of` and `child_of` edges on person records; a person recorded
  female is never listed as a father.
- **UBW-R6 — Curated records.** `ubuwwa-browser`-tagged records (existing
  records tagged in place plus the new cited `concept/ubuwwa` seed) are
  included; new records carry trilingual label/summary, trilingual prose
  under `content/`, defined sources and a `provenance` block.
- **UBW-R7 — Page.** `/[lang]/ubuwwa/` exists in all three languages
  (ar/en/ur) in the same commit; title, lede and headings inside
  `data-pagefind-body`; the long list inside `data-pagefind-ignore`;
  readable without JavaScript; client-side filter and five topic chips as
  progressive enhancement.
- **UBW-R8 — Navigation.** An Explore-menu entry (people group) and a
  landing-page card in all three languages.
- **UBW-R9 — API.** `/api/v1/ubuwwa.json` exports every item with `kind`,
  `work`, `ref`, `unit`, `text` excerpt, `sura`/`aya`, `wings`, `themes`,
  `tags`, `section`, `topics` and `signals`; documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
- **UBW-R10 — Register.** Documented in `docs/site/browsers.md`,
  `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md`; the expected
  filename list in `scripts/features-api.test.ts` includes
  `ubuwwa.json`.
- **UBW-R11 — Honest status.** Review metadata is accurate; the page's
  method note states plainly how detection works and that the texts are
  drafts until a human reads them.
