# Umuma Browser — engineering requirements (acceptance spec)

Spec 56 · plan `docs/plan/64-umuma-browser.md` · lane `umuma` · built 16 Nov 2026

## Original requirement (verbatim, founder request 16 Nov 2026)

> megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح الامومة في الاسلام
> Motherhood in islam
>
>   where it should list all the mentioned and written
>
> Motherhood  الامومة في الاسلام
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
>
> Motherhood  الامومة في الاسلام
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> Motherhood  الامومة في الاسلام
>
> and everything mentioned about
>
> Motherhood  الامومة في الاسلام
>
>  anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> Motherhood  الامومة في الاسلام
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd

## Acceptance requirements (UMUMA-R)

- **UMUMA-R1 — Six topical families.** The browser covers exactly six
  families: the mother and her standing (umm), pregnancy (haml), childbirth
  (wilada), nursing and milk-kinship (radaa), custody and raising (tarbiya),
  and dutifulness to parents (birr). Nothing outside these is in scope.
- **UMUMA-R2 — Automatic detection.** Passages are detected at build time by
  `scripts/umuma.ts` over every compiled `passage` record — Qur'an, hadith,
  seerah and every harvested work. Any book harvested in the future that
  contains a matching passage appears automatically without manual tagging.
- **UMUMA-R3 — Guarded lexicon.** Noisy Arabic terms are gated: bare «أم»
  requires family context («أم القرى»/«أم الكتاب» and «أمة» excluded);
  «حمل» requires pregnancy context (carrying/transport senses excluded);
  «ولد» the boy is out — only birth forms (ولدت/تلد/يولد/مولود/وضعت) count;
  «بر» requires parent vocabulary (برّ the land/grain excluded); verified
  false positives are excluded by id in `UMUMA_EXCLUDE`.
- **UMUMA-R4 — Corpus sections.** Each item carries `section` ∈ {quran,
  sunnah, seerah, books, curated} derived from work genre and unit metadata.
- **UMUMA-R5 — Mothers on record.** Mothers surface the graph's own
  `child_of` edges to female person records — mothers of prophets,
  Companions and Tabi'in — with no side list.
- **UMUMA-R6 — Curated records.** `umuma-browser`-tagged records (existing
  records tagged in place plus new cited concepts) are included; new records
  carry trilingual label/summary, trilingual prose under `content/`, defined
  sources, a `provenance` block and `status.review: draft` until a human
  reads them.
- **UMUMA-R7 — Page.** `/[lang]/umuma/` exists in all three languages
  (ar/en/ur) in the same commit; title, lede and headings inside
  `data-pagefind-body`; the long list inside `data-pagefind-ignore`;
  readable without JavaScript; client-side filter and six topic chips as
  progressive enhancement; signature view `sig/UmumaLines.astro` per
  `docs/site/signature-views.md` rules 1–6.
- **UMUMA-R8 — Navigation.** An Explore-menu entry and a landing-page card
  in all three languages.
- **UMUMA-R9 — API.** `/api/v1/umuma.json` exports every item with `kind`,
  `work`, `ref`, `unit`, `text` excerpt, `sura`/`aya`, `wings`, `themes`,
  `tags`, `section`, `topics`, `signals` and `edges`; documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
- **UMUMA-R10 — Register.** Documented in `docs/site/browsers.md`, the plan
  index, `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md`.
- **UMUMA-R11 — Honest status.** Draft/review metadata is accurate; no
  unreviewed AI output is presented as verified.
- **UMUMA-R12 — Provenance of work.** Built on a clone of the repository on
  the founder's microSD volume (not the Mac main drive), merged to `main`
  via pull request; the clone folder is deleted after merge.
