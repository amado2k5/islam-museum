# Sport Browser — engineering requirements (acceptance spec)

Spec 58 · plan `docs/plan/66-sport-browser.md` · lane `sport` · built 16 Nov 2026

## Original requirement (verbatim, founder request 16 Nov 2026)

> megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
>
>   where it should list all the mentioned and written
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
>
> and everything mentioned about
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
>
>  anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون
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

## Acceptance requirements (SPORT-R)

- **SPORT-R1 — Topic coverage.** The browser covers the founder's named
  three and all the rest: horsemanship and the equestrian arts (khayl),
  archery (ramy), swimming (sibaha), wrestling and strength (sira), racing
  and wagered contests (sabq), play and games (laib — spear-play, ball
  games, polo, board games), hunting as field sport (sayd) and modern
  Muslim sports (riyada/modern). Nothing outside sport and contest is in
  scope.
- **SPORT-R2 — Automatic detection.** Passages are detected at build time
  by `scripts/sport.ts` over every compiled `passage` record — Qur'an,
  hadith, seerah and every harvested work. Any book harvested in the
  future that contains a matching passage appears automatically without
  manual tagging.
- **SPORT-R3 — Guarded lexicon.** Noisy Arabic terms are gated: «سبق» the
  stake/prize requires race vocabulary; «صيد» requires sport/hunt/falconry
  vocabulary (snares of people excluded); «لعب» requires the listed
  play/contest senses; «رمي» requires arrow/target vocabulary (رمي الجمرات
  and رمي بالكلام excluded); «يسبح» requires water/swim vocabulary
  (تسبيح excluded); verified false positives drop out by id in
  `SPORT_EXCLUDE`.
- **SPORT-R4 — Corpus sections.** Each passage item carries `section` ∈
  {quran, sunnah, seerah, books} derived from work genre and unit metadata;
  curated records land in `curated` (or their `sport-<section>` tag).
- **SPORT-R5 — The `sport` class.** Named sports and contests exist as
  first-class `data/sport/*.yaml` records (`class: sport`, registered in
  `scripts/lib.ts` CLASSES, `schema/sport.schema.json`,
  `schema/predicates.yaml` domains/ranges, the browse index and i18n
  `class.sport`); each has trilingual label/summary, a `kind`
  (mounted | target | water | combat | racing | ball-game | board-game |
  strength | hunt | modern-team | modern-individual), defined sources, a
  `provenance` block and honest `status.review`. Their entity pages render
  on the generic `/[lang]/sport/<slug>/` route.
- **SPORT-R6 — Existing records tagged in place.** The records already in
  the graph on this topic — `concept/al-rimaya`, `concept/al-musara-a`,
  `concept/sabq-in-islam`, `concept/nakhwa-chivalry`,
  `concept/named-exercises-of-the-canon`, `concept/nard`, the furusiyya
  works and `object/sahn-furusiyya` — carry `sport-browser` tags
  additively; no golden-set record is rewritten or invalidated.
- **SPORT-R7 — Famous contests as events.** The Prophet's two races with
  Aisha, the wrestling bout with Rukana, the Abyssinian spear-play in the
  mosque and the horse race with the sabiq/al-mumarr prize exist as cited
  `event` records with participants.
- **SPORT-R8 — Modern athletes.** Persons carrying the schema `sports:`
  block surface through the modern shelf — read from the graph, no side
  list.
- **SPORT-R9 — Page.** `/[lang]/sport/` exists in all three languages in
  the same commit; title, lede and headings inside `data-pagefind-body`;
  the long list inside `data-pagefind-ignore`; readable without
  JavaScript; client-side filter and topic chips as progressive
  enhancement; signature view `sig/SportFields.astro` per
  `docs/site/signature-views.md` rules 1–6 (abstract geometry only, no
  figurative depiction).
- **SPORT-R10 — Navigation.** An Explore-menu entry and a landing-page
  card in all three languages, registered in `site/src/lib/nav.ts`
  (`ExplorePage` union, `explorePages`, exactly one `EXPLORE_GROUPS`
  group).
- **SPORT-R11 — API.** `/api/v1/sport.json` exports every item with
  `kind`, `work`, `ref`, `unit`, `sura`/`aya`, `tags`, `section`,
  `topics`, `signals` and `edges`; documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`, and in
  `scripts/features-api.test.ts`'s expected list.
- **SPORT-R12 — Register.** Documented in `docs/site/browsers.md`, the
  plan index, `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md`.
- **SPORT-R13 — Honest status.** Draft/review metadata is accurate; AI
  prose carries `provenance`; nothing unverified is presented as verified.
- **SPORT-R14 — Content rules.** Qur'an text is never typed (ayahs render
  from frozen `passage/quran-*` records); no honorifics typed; Arabic
  parentheses are isolated (`⁦(…)⁩`); contested rulings on games and
  wagers use the `perspectives` block, cited, no verdict; nothing about,
  from or sympathetic to any blocked organisation.
- **SPORT-R15 — Provenance of work.** Built on a clone of the repository
  on the founder's microSD volume (not the Mac main drive), merged to
  `main` via pull request; the clone folder is deleted after merge.
