# 42 · Resurrection and Reckoning Browser — requirements and production checklist

_The feature requirements for «متصفح البعث ويوم القيامة والحساب» (the
Resurrection, Day of Judgement and Reckoning Browser — every mention of the
Resurrection, the Day and the Reckoning in the Qur'an, the Sunnah, the seerah,
Companion and Tabi'i reports and every harvested book), as requested by the
founder on 11 November 2026 and delivered in `docs/plan/54-qiyama-browser.md`.
Written so any person or AI agent can validate each requirement against
production (`https://islam.museum`, `https://api.islam.museum`) without reading
the plan. Every requirement has an id (`QIY-R..`), a "how to check" line, and
the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح البعث ويوم القيامة والحساب where it should list all
> the mentioned and written البعث ويوم القيامة والحساب that are in quran, see
> rah, sunna, tabi3een stories, quotes, mentioned and written in books that
> were harvested and any future harvested book if it has a البعث ويوم القيامة
> والحساب should be viewable here. add a box for it on landing page and in
> navigation menus. make sure this is done end to end and full detailed
> proses and make it ready for production at the end of this. this is only
> about البعث ويوم القيامة والحساب and everything mentioned about البعث ويوم
> القيامة والحساب anywhere in any of the sunni books or quran or sunna or
> sera. find all the instances where البعث ويوم القيامة والحساب were mentioned
> or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and
> tabi3een and add those stories, mentions, quotes, details. also add this in
> engineering documents as the original requirements to allow AI later on to
> test and validate it when it is in production."

Clarified by the founder (same conversation): route slug `qiyama`; overlap
with the Signs of the Hour browser and the hisab ledger is free (the nar/janna
precedent); curated records at maximal depth (~30+); fresh clone on the
microSD for the work.

## 1. Requirements

- **QIY-R1 · A dedicated page exists.** `https://islam.museum/{ar|en|ur}/qiyama/`
  returns the Qiyama Browser with its title, lede and method note in each
  language. _Check:_ fetch each URL; expect 200 and the localized title
  («متصفح البعث ويوم القيامة والحساب» / "Resurrection and Reckoning Browser" /
  «بعث، یوم قیامت اور حساب کا براؤزر»).
- **QIY-R2 · Every Resurrection/Day/Reckoning mention in the Qur'an is listed.**
  The page's Qur'an section holds every ayah that names the Day or its
  stations — the «يوم …» compounds, al-Haqqa, al-Qari'a, al-Sakhkha,
  al-Ghashiya, the Trumpet verses (39:68, 69:13, 79:6-7…), the raising and
  gathering verses, the scrolls (84:7-12), the Scale (101:6-9, 21:47) and the
  display verses. _Check:_ `/api/v1/qiyama.json` rows with `section: "quran"`
  include `passage/quran-39-68`, `quran-101-6`, `quran-99-6`, `quran-84-7` and
  every ayah carrying a «يوم القيامة» compound.
- **QIY-R3 · The Sunnah corpus is listed.** Hadith-unit passages whose matn
  mentions the Day — the long intercession hadith, «أول ما يحاسب به العبد»,
  «لا تزول قدما عبد», the seven in the Shade, the Hawd and the Sirat —
  appear with `section: "sunnah"`. _Check:_ `/api/v1/qiyama.json` rows with
  `section: "sunnah"` include passages from the two Sahihs and the Sunan.
- **QIY-R4 · Seerah and harvested books land automatically.** A passage in a
  seerah book or any other harvested work mentioning البعث، القيامة or
  الحساب appears under `seerah` or `books` the day its record lands — no
  tagging needed. _Check:_ add no code; confirm an already-harvested non-quran
  non-hadith passage with a qiyama hit is present in the export.
- **QIY-R5 · Companion and Tabi'i reports are included.** Reports in the
  harvested corpora narrating sahaba/tabi'een statements on the Day are
  listed like any other passage. _Check:_ filter `/qiyama/` for a Companion
  report (e.g. ابن مسعود's «لا تزول قدما ابن آدم» wording at al-Tirmidhi).
- **QIY-R6 · Ambiguous lexemes are gated.** «بعث» meaning the sending of a
  messenger, «الساعة» a clock-hour, «حساب» arithmetic, «الصراط» the straight
  path of guidance and «شفاعة» mediation do not enter unless a resurrection
  or reckoning collocation is near. _Check:_ passages whose only hit is
  «بعث الله رسولاً» or «الصراط المستقيم» are absent; `signals` on listed rows
  name the matched lexemes.
- **QIY-R7 · Curated records with cited prose.** The `curated` section holds
  30+ records — the stations of the Day — each with trilingual label, summary
  and prose citing defined sources, `status.review: draft` and a provenance
  block. _Check:_ `/api/v1/qiyama.json` rows with `section: "curated"` ≥ 30;
  open `/{lang}/concept/nafkhat-as-sur/` in three languages.
- **QIY-R8 · Landing box and navigation.** The landing page carries a Qiyama
  card linking to `/{lang}/qiyama/`; the Explore menu lists it in all three
  languages. _Check:_ `/{lang}/` and the Explore menu.
- **QIY-R9 · API export.** `/api/v1/qiyama.json` exists and documents
  `section`, `qiyama_kind` (`baath`/`yawm`/`hisab`), `signals`, work, ref,
  excerpt, kind, themes, tags and edges; openapi `v1.json`, `llms.txt` and
  `docs/data/README.md` describe it. _Check:_ fetch the file; grep the three
  docs.
- **QIY-R10 · Search.** The landing header is Pagefind-indexed (the feature is
  findable by name in every language); the long lists are excluded; every
  curated record is itself a searchable entity page. _Check:_ Pagefind query
  for «متصفح البعث» and "Resurrection and Reckoning Browser".
- **QIY-R11 · Graph, API and search rule.** No side table: records are
  `passage` detections plus `concept` records with the `qiyama-browser` tag.
  _Check:_ `git grep -l qiyama-browser data/` returns the curated set; there
  is no qiyama-only JSON fixture outside the API export.
- **QIY-R12 · The register is updated.** Rows exist in `docs/site/browsers.md`
  (feature + API tables), `docs/plan/00-README.md`, `docs/agents/lanes.md`
  (`qiyama` lane) and `docs/status.md`, plus a CANARY entry. _Check:_ grep
  the five files for `qiyama`.
- **QIY-R13 · Readable without JavaScript; accessible.** The page renders the
  full list server-side; the filter input is a progressive enhancement with a
  44px target; WCAG 2.2 AA holds. _Check:_ fetch the page HTML — the records
  are in the markup.
- **QIY-R14 · Trilingual in the same commit.** Arabic, English and Urdu page
  strings, menu entries and every new prose file ship together; AI output is
  `draft`. _Check:_ the three URLs and the `content/{ar,en,ur}/concept/`
  files.
- **QIY-R15 · Scope line held.** Barzakh, the grave's question and the signs
  of the Hour figures are absent (they belong to the Signs browser); Paradise
  and the Fire to their own browsers. _Check:_ `al-qiyamah-sughra`,
  `adhab-al-qabr`, `dajjal` are not in the export.

## 2. Artifacts

`scripts/qiyama.ts` (detector), `site/src/lib/qiyama.ts`, `site/src/scripts/
qiyama-filter.ts`, `site/src/pages/[lang]/qiyama/index.astro`, `scripts/
export-api.ts` (`qiyama.json`), `site/src/lib/nav.ts`, `site/src/components/
Landing.astro`, `i18n/{ar,en,ur}.yaml`, 36 `qiyama-browser`-tagged concept
records (23 tagged in place + 13 new with `content/{ar,en,ur}/concept/*.md`),
`docs/plan/54-qiyama-browser.md`, this file, `docs/site/browsers.md`,
`docs/plan/00-README.md`, `docs/agents/lanes.md`, `docs/status.md`,
`docs/data/README.md`, `site/public/openapi/v1.json`,
`site/src/pages/llms.txt.ts`, `CANARY.md`.
