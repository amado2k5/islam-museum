# Medicine Browser — original requirements and production acceptance spec

This file keeps the founder's original request so that a later agent can test and
validate the feature in production. Plan: [`docs/plan/57-tibb-browser.md`](../plan/57-tibb-browser.md).
Detector tests: `scripts/tibb.test.ts` (ids `TIB-Rnn` below).

## 1. The original request (founder, 14 November 2026)

Recorded as given, condensed only where it repeated itself:

> get latest from main, clone the repo to a separate folder then start working on
> «متصفح الطب النبوي والطب والتشريح والجراحة والدواء والتداوي في الإسلام» where it should
> list all the mentioned and written «الطب النبوي والطب والتشريح والجراحة والدواء
> والتداوي في الإسلام» that are in quran, seerah, sunna, tabi'een stories, quotes,
> mentioned and written in books that were harvested and any future harvested book if it
> has [it] should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make it ready for
> production at the end of this.
>
> this is only about «الطب النبوي والطب والتشريح والجراحة والدواء والتداوي في الإسلام»
> and everything mentioned about [it] anywhere in any of the sunni books or quran or sunna
> or seera. find all the instances where [it was] mentioned or part of quotes from quran,
> sunnah, Hadith, seerah or from sahaba and tabi'een and add those stories, mentions,
> quotes, details.
>
> also add this in engineering documents as the original requirements to allow AI later
> on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download
> any books, you can use mac apple vision to OCR and then harvest those OCRd books or you
> can find any other online website that you can decide whether or not can be authentic
> and trusted as a source and get from it information to fully enrich and fill detailed
> proses.

Working instructions given with it: work on the microSD in a separate clone, commit and
push when context is tight, do not wait for build, test or CI, raise the pull request and
merge it, then delete the work files from the microSD.

## 2. Requirements

Scope (binding): only prophetic medicine, medicine, anatomy, surgery, drugs and the
seeking of treatment. Sunni sources first; the medical classics of Islamic civilization
are listed as books. The museum describes and attributes; it gives no medical advice and
no ruling.

- **TIB-R01.** The browser has exactly six topics, in the order of its title —
  `nabawi`, `tibb`, `tashrih`, `jiraha`, `dawa`, `tadawi` — and five sections —
  `quran`, `sunnah`, `seerah`, `books`, `curated`.
- **TIB-R02.** Matching is done on folded text: vowel marks removed, alif forms unified.
- **TIB-R03.** Reports of the Prophet's remedies are listed under `nabawi`: cupping,
  cautery, ruqya over the sick, honey, black seed, costus, senna, talbina, truffles,
  'ajwa dates, ithmid, ladud and sa'ut.
- **TIB-R04.** Illness, the sick, fever, plague and epidemic, contagion, leprosy, named
  diseases, the physician, the hospital and visiting the sick are listed under `tibb`.
- **TIB-R05.** The stages of human creation (نطفة، علقة، مضغة) and the vessels, joints
  and organs named in the texts are listed under `tashrih`.
- **TIB-R06.** The treatment of wounds, cauterising a vessel, venesection, circumcision,
  splints and bone-setting are listed under `jiraha`; the legal compensation of wounds is not.
- **TIB-R07.** The drug and the disease, poison and antidote, and pharmacy are listed
  under `dawa`; seeking treatment, healing and treatment with what is forbidden under `tadawi`.
- **TIB-R08.** The guarded words do not fire outside their medical sense: «في قلوبهم
  مرض», «سم الخياط», «بالقسط» (justice), the honey of Paradise, «عدوّي», «حمى الله»,
  «بسم الله», a narrator named «الرقّي» or «ابن الجراح».
- **TIB-R09.** Outside the Qur'an and the hadith reports, a bare illness or healing word
  alone does not admit a passage; beside a physician, a drug or a treatment it does.
- **TIB-R10.** Sections follow the work: `work/quran` → `quran`; genre `hadith` or a
  hadith-unit passage → `sunnah`; genre `sira` → `seerah`; everything else → `books`.
  A book harvested later needs no tagging: its passages are detected at build time and
  land in the section of its genre.
- **TIB-R11.** Curated records join by the tag `tibb-browser`, appear in `curated`, and
  carry their topics as `tibb-<topic>` tags.
- **TIB-R12.** `/[lang]/tibb/` renders in ar, en and ur without JavaScript: badge, title,
  lede, status line with the build's counts, method note, API link, the jars view
  (six shelves, a jar per remedy, disease or procedure with its count, every jar a link to its
  record or its section, and the shelf's count of museum records), section chips, the
  filter box, and every section with its cards (label linking the entity page, work and
  reference, topic chips, excerpt). The header block carries `data-pagefind-body`; the
  lists carry `data-pagefind-ignore`.
- **TIB-R13.** `/api/v1/tibb.json` exists with `feature: "tibb-browser"`; every item has
  `section` ∈ the five sections, `topics` ⊆ the six topics and `signals`; passages carry
  work, ref, unit and text.
- **TIB-R14.** The Explore menu (group `conduct`) and the landing page carry the browser
  under the key `tibb` in all three languages; `llms.txt`, `openapi/v1.json` and
  `docs/data/README.md` describe the endpoint; the browser is registered in
  `docs/site/browsers.md`, `docs/site/signature-views.md`, `docs/plan/00-README.md`,
  `docs/agents/lanes.md`, `docs/status.md`, with a `CANARY.md` entry.
- **TIB-R15.** Every new record cites defined sources, carries a `provenance` block and
  `status.review: draft`; new prose exists in ar, en and ur; no honorific is typed, no
  Qur'an text is typed (verses are linked as `[[passage/quran-<s>-<a>|…]]`), and quoted
  excerpts stay within the limits of `docs/sources-policy.md` (40 words from a book, 55
  words of a hadith matn under the hadith-api convention).
- **TIB-R16.** The signature view is drawn from the build's own data: the build throws when a
  signal of the lexicon has no jar, when a jar names a record that is not in the graph, or when
  an admitted passage stands in no jar. Its form (vessels on shelves) is used by no other browser.

## 3. Production smoke list (for the agent that validates the deployed site)

Run against `https://islam.museum` (or `https://uat.islam.museum`) after the founder's deploy.

1. `GET /ar/tibb/`, `/en/tibb/`, `/ur/tibb/` → 200; the `<h1>` is the browser's title in
   that language; with scripts disabled the five section headings and their cards are in
   the HTML. (TIB-R12)
2. On `/ar/tibb/`: the jars view has six shelves; a gold-lidded jar (for example الحجامة)
   opens its record page, a grey-lidded one scrolls to `#t-<section>`; each jar shows a count. (TIB-R12, TIB-R16)
3. `GET https://api.islam.museum/api/v1/tibb.json` → 200, `feature` is `tibb-browser`,
   `items.length` equals the count in the page's status line; every `section` and every
   topic is from the fixed sets. (TIB-R13)
4. In `tibb.json`: `passage/quran-16-69`, `passage/quran-26-80`, `passage/quran-22-5`,
   `passage/quran-23-14`, `passage/quran-50-16` are present (section `quran`);
   `passage/quran-2-10` and `passage/quran-7-40` are absent. (TIB-R05, TIB-R08)
5. In `tibb.json`: at least one item of each collection prefix `bukhari-`, `muslim-`,
   `abudawud-`, `tirmidhi-`, `ibnmajah-`, `nasai-`, `muwatta-` is in section `sunnah`; a
   black-seed report (text contains «الحبة السوداء») has topics including `nabawi`. (TIB-R03)
6. In `tibb.json`: items whose `work` is `work/zad-al-maad` are in section `seerah`;
   items whose `work` is `work/al-qanun-fi-al-tibb` are in section `books`. (TIB-R10)
7. In `tibb.json`: `person/ibn-sina`, `person/al-zahrawi`, `person/rufayda-al-aslamiyya`,
   `concept/hijama`, `concept/tadawi`, `event/plague-of-amwas` are present with section
   `curated` and at least one topic. (TIB-R11)
8. The Explore menu on any page lists the browser; the home page shows its card; the site
   search finds the browser by «الطب النبوي» and by "Medicine Browser". (TIB-R14)
9. `GET /llms.txt` contains `/api/v1/tibb.json`; `GET /openapi/v1.json` has the path
   `/tibb.json`. (TIB-R14)
10. Open three records from each section and check: sources listed, draft mark shown,
    Arabic, English and Urdu label and summary present. (TIB-R15)
11. Future-harvest check: after any later harvest lands a passage whose text contains
    «الحجامة» or «تداووا», that passage appears in `tibb.json` without any change to this
    feature. (TIB-R10)

## 4. Local gates

`npx vitest run scripts/tibb.test.ts scripts/features-api.test.ts`, `npm run validate`
(0 errors), `npm test`, `npm run build`.
