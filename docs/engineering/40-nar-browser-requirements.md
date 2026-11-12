# 40 · Fire Browser — requirements and production checklist

_The feature requirements for «متصفح النار» (the Fire Browser — every mention
of the Fire in the Qur'an, the Sunnah, the seerah, Companion and Tabi'i
reports and every harvested book), as requested by the founder on 11 November
2026 and delivered in `docs/plan/52-nar-browser.md`. Written so any person or
AI agent can validate each requirement against production
(`https://islam.museum`, `https://api.islam.museum`) without reading the plan.
Every requirement has an id (`NAR-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح النار where it should list all the mentioned and
> written النار that are in quran, see rah, sunna, tabi3een stories, quotes,
> mentioned and written in books that were harvested and any future harvested
> book if it has a النار should be viewable here. add a box for it on landing
> page and in navigation menus. make sure this is done end to end and full
> detailed proses and make it ready for production at the end of this. this
> is only about النار and everything mentioned about النار anywhere in any of
> the sunni books or quran or sunna or sera. find all the instances where
> النار Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details.
> also add this in engineering documents as the original requirements to
> allow AI later on to test and validate it when it is in production."

Clarified by the founder: use all hellfire names, not only the literal النار;
include worldly/narrative fire (Ibrahim's fire, Musa's tree, cooking and war
fire) in its own section; enrich the books shelf with a dedicated Sunni
hellfire book harvest in a later wave.

## 1. Requirements

- **NAR-R1 · A dedicated page exists.** `https://islam.museum/{ar|en|ur}/nar/`
  returns the Fire Browser with its title, lede and method note in each
  language. _Check:_ fetch each URL; expect 200 and the localized title
  («متصفح النار» / "The Fire Browser" / «آگ کا براؤزر»).
- **NAR-R2 · Every Fire mention in the Qur'an is listed.** The page's Qur'an
  section holds every ayah that names hell or the Fire — Jahannam, Saqar,
  al-Jahim, al-Hutama, Ladha, al-Hamiya, al-Hawiya, al-Sa'ir, النار، عذاب
  النار، أهل النار، الوقود، الزقوم، الحميم، الغساق — each card linking to its
  `passage/quran-*` page. _Check:_ the `nar.json` items with
  `section: "quran"` include `passage/quran-2-24`, `passage/quran-74-26`,
  `passage/quran-21-69`; spot-read a card's matn against the frozen Tanzil
  text.
- **NAR-R3 · Every Fire mention in the Sunnah is listed.** Hadith passages
  naming the Fire appear under the Sunnah section. _Check:_ `nar.json` items
  with `section: "sunnah"` include «اتقوا النار ولو بشق تمرة» and the
  حديث «استوقد ناراً» of Muslim 2284.
- **NAR-R4 · Seerah section exists.** The page has a seerah section; it may be
  empty until seerah corpora are harvested, and must never error when empty.
- **NAR-R5 · Harvested books appear automatically.** Any passage of a
  `work/*` book whose text mentions the Fire joins the books section at build
  time with no tag. _Check:_ add a synthetic book passage to the
  feature-export test (already covered: `passage/takhwif-1` lands under
  `section: "books"`).
- **NAR-R6 · Worldly fire is its own section.** «يا نار كوني بردا وسلاما»
  (21:69), the fire of Musa's tree and cooking/war fire appear under the
  `dunya` shelf, never inside the hellfire sections. _Check:_ `nar.json`
  items with `section: "dunya"` include `passage/quran-21-69` and their
  `nar_kind` is `"worldly"`.
- **NAR-R7 · False positives are gated.** دينار (coin), منار/أنار (light),
  and worldly-context words without a fire lexeme never match; الموقدة in
  «نار الله الموقدة» is hellfire, not a cooking signal. _Check:_ the
  feature-export test asserts `narSignalsOf` returns `[]` for دينار and
  منار passages; the corpus scan matches no bare رماد/يوقد context.
- **NAR-R8 · Curated records are listed.** `concept/jahannam`, `concept/fire`,
  `concept/zaqqum`, `concept/sirat`, `concept/al-nar-al-yaman`,
  `concept/malik-keeper-of-jahannam` and
  `concept/ashab-al-nar-wa-ashab-al-jannah` appear — doctrine records under
  `curated`, `concept/fire` under `dunya`, the Sirat under its shelf.
- **NAR-R9 · A landing card exists.** The home page in each language shows a
  Fire Browser card linking to `/{lang}/nar/`.
- **NAR-R10 · Navigation menus list it.** The Explore menu in each language
  contains the nar entry. _Check:_ `explorePages` in `site/src/lib/nav.ts`
  includes `{ key: "nar", ready: true }`.
- **NAR-R11 · The API export exists.** `GET /api/v1/nar.json` returns
  `{ feature: "nar-browser", items: [...] }` where every item carries
  `section`, `nar_kind`, `signals`, plus the standard `work`, `ref`, `unit`,
  `text`, `sura`, `aya`, `wings`, `themes`, `tags` fields. _Check:_ fetch the
  endpoint; expect those keys on a sampled item.
- **NAR-R12 · API docs cover it.** `/nar.json` is in `site/public/openapi/
  v1.json`, `docs/data/README.md` and `llms.txt`.
- **NAR-R13 · Section counts and chips.** The page shows section chips with
  counts matching `nar.json` group sizes, and a working filter that never
  hides content when JavaScript is off.
- **NAR-R14 · Search indexing.** The page's title, lede and method block are
  inside `data-pagefind-body`; the long card lists are `data-pagefind-ignore`.
  _Check:_ Pagefind returns the nar page for «النار».
- **NAR-R15 · No JS required.** Disabling JavaScript still renders every
  section and card.
- **NAR-R16 · Trilingual.** `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml`
  each carry the `nar:` block (title, desc, menu, section labels, kind
  labels, filter strings).
- **NAR-R17 · Kind chips.** Passages carry a hellfire/worldly kind chip
  (`nar_kind`); curated records carry their section tag instead.
- **NAR-R18 · Signals are exported.** `nar.json` items expose the matched
  `signals` array so a reader (or AI validator) can see why a passage
  matched.
- **NAR-R19 · Registered.** The browser appears in `docs/site/browsers.md`,
  `docs/plan/00-README.md`, `docs/status.md`, `docs/agents/lanes.md` and has
  a `CANARY.md` entry.
- **NAR-R20 · Provenance and draft tier.** Every detected record keeps its
  own sources and review status; AI-authored records stay `draft` until a
  human reads them; nothing was typed as Qur'an text — ayat are the frozen
  Tanzil passages.

## 2. Non-requirements (explicitly out of scope)

- No rulings or sermon voice: the browser lists and cites; it does not
  preach.
- The seerah section may be empty until seerah corpora are harvested — this
  is expected, not a defect.
- Dedicated hellfire-book harvests (التخويف من النار, هادي الأرواح) are a
  follow-up wave; the detector already guarantees their automatic inclusion.

## 3. How to validate in production (one pass)

1. Open `https://islam.museum/ar/nar/` — title, lede, chips, counts; switch
   to `/en/nar/` and `/ur/nar/`.
2. Confirm the Qur'an section lists النار ayat and the dunya shelf lists
   21:69; open a card and compare the matn with a mushaf.
3. `curl https://api.islam.museum/v1/nar.json | jq '.feature'` →
   `"nar-browser"`; check a few items' `section`/`nar_kind`/`signals`.
4. Filter the page client-side; reload with JS off — all cards still render.
5. Search «النار» — the browser page appears via Pagefind.
6. Landing page and Explore menu show the Fire Browser card/entry.
