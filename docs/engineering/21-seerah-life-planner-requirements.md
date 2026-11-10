# Seerah & Life — requirements and production checklist

**سيرة وحياة · Seerah & Life · سیرت و زندگی** — "Live Your Life the Islamic Way."
The founder's brief: the Seerah is a *method of life and how it reflects on us*.
This guide helps anyone plan a **daily / weekly / monthly / yearly / multi-year**
routine, varied by **age, gender and other relevant factors**, recommending what
to do in each period to live on the Seerah and become a virtuous, good Muslim.
Scope is deliberately wider than ritual detail: life goals, planning, efficient
use of time, helping society, understanding the value and wider impact of one's
work — as well as azkar al-sabah, zakat and sadaqa, learning, Quran reading,
kindness to parents and neighbours, honesty at work, saving, learning a trade,
kindness to animals, and more.

This document is the acceptance spec. Any agent can test production
(`https://islam.museum`) or a build against it. Status: **shipped** (merged to
`main` in PR #5880; landing-card motif in PR #5888; CANARY v1.10.0).

## 1 · Functional requirements

| # | Requirement | Where it lives |
|---|---|---|
| F1 | Route exists for all three published languages: `/ar/seerah/`, `/en/seerah/`, `/ur/seerah/` | `site/src/pages/[lang]/seerah/index.astro` (`getStaticPaths` over `LANGS`) |
| F2 | 26 practice cards, browsable by two dimensions: **time horizon** (daily, weekly, monthly, yearly, life stages) and **life domain** (worship & dhikr; Quran & knowledge; money & work; family & kinship; neighbours & society; self & time) | `ITEMS[]`, `HORIZONS`, `DOMAINS` in the page frontmatter |
| F3 | Cards carry **life-stage badges** (child, youth, student, worker, parent, elder) and gender-specific **notes** where relevant — age/gender personalisation is by badges and notes, not a generated wizard | `stages[]`, `note` on each card |
| F4 | Every card shows: title, teaser, body, and where applicable a routine table, Quran references, hadith, numbered **action steps**, a fiqh **note**, and a **"big picture"** note tying the practice to life purpose | card markup inside `<details>` |
| F5 | Required card set (content coverage): the Prophet's model day (Fajr→sleep routine table); morning/evening adhkar; five prayers & rawatib; daily Quran wird; daily prophetic etiquettes; evening self-accounting; Jumu'ah; Monday/Thursday fasting; kinship & neighbours; weekly planning around prayer; White Days; monthly budget & saving; standing sadaqa; khatma & memorisation plan; zakat practical guide (nisab, 2.5%, lunar year, eight categories); Ramadan & worship seasons; annual review; childhood; youth; seeking knowledge & a trade; honest work; marriage & parents; life purpose & mission; animals & environment; volunteering; old age | `ITEMS[]` — 26 entries |
| F6 | Works **without JavaScript**: every card is a `<details>` disclosure; all content is in the initial HTML | `<details class="practice">` |
| F7 | Progressive enhancement only: a search box and two chip rows (horizon, domain) hide/show cards; a count line shows visible card count | `site/src/scripts/seerah.ts` |
| F8 | Footer resources: external links (Sunnah.com, Quran.com, IslamQA) plus a link to the Living Islam wing, and a "verify rulings locally" disclaimer — the page is educational guidance, not a fatwa engine | `RES[]` + `seerah.verify` i18n |

## 2 · Data and content requirements

| # | Requirement |
|---|---|
| D1 | **No Qur'an text typed anywhere.** Verse citations are links to the frozen Tanzil passage records (`passage/quran-<sura>-<aya>`) rendered via `href()`; the hero links `passage/quran-33-21` |
| D2 | **No typed honorifics** (ﷺ, عليه السلام, رضي الله عنه) — prose writes «النبي»; the UI renders honorifics from data |
| D3 | Hadith are cited with source attributions (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Bayhaqi, Tabarani, Hakim/al-Albani, agreed-upon) |
| D4 | Arabic (and Urdu) parentheticals containing Arabic script are wrapped in U+2066…U+2069 directional isolates |
| D5 | Fiqh-sensitive content carries caveats: zakat nisab/stocks/jewellery → verify with local mufti; women's Jumu'ah/congregation notes; menstruation/travel/illness fasting concessions; the page footer states it is guidance, not personalised rulings |
| D6 | Sunni frame, docent voice: describe, never sermonise |
| D7 | AI-generated Urdu card prose is **draft-tier until a human reads it** — declared in the CANARY v1.10.0 entry and the commit message |
| D8 | Registered in `docs/site/browsers.md` (Seerah & Life row, marked "static prose, no graph records"), `CANARY.md` v1.10.0, and this spec |

## 3 · Language requirements

| # | Requirement |
|---|---|
| L1 | Arabic, English and Urdu ship **in the same commit** — all card content (`title`, `teaser`, `body`, `routine`, `ayat` labels, `hadith`, `steps`, `note`, `why`) is `Record<Lang, string>` |
| L2 | UI strings under `seerah.*` exist in `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml` with key parity (title, lede, hero, search, hz, dm, all, cards, from_quran, from_sunnah, steps, routine, note, resources, living_wing, living_blurb, verify) |
| L3 | `explore.pages.seerah` (title/desc/menu) exists in all three i18n files |
| L4 | Urdu renders RTL; English renders LTR; Arabic is the primary voice |

## 4 · Surfacing and integration

| # | Requirement | Where |
|---|---|---|
| S1 | `"seerah"` is in the `ExplorePage` key union and `explorePages()` returns `{ key: "seerah", href: /{lang}/seerah/, ready: true }` | `site/src/lib/nav.ts` |
| S2 | **Landing page shows the card** — `Landing.astro` renders it via `explorePages` with a custom motif (gold sun over a winding teal path) and `wing-living` accent colour | `site/src/components/Landing.astro` thumb block + `--acc` chain |
| S3 | **Explore dropdown menu** lists سيرة وحياة / Seerah & Life / سیرت و زندگی on every page | `BaseLayout` menu → `explorePages` |
| S4 | Pagefind: title/lede in `data-pagefind-body`; card grid `data-pagefind-ignore` per browsers.md §4 | page markup |
| S5 | Footer/resource links from related pages are optional; the required surfaces are the landing card and the Explore menu | — |
| S6 | Page scripts live outside the layout (`site/src/scripts/seerah.ts`); nothing was baked into `BaseLayout` or `site/src/styles/` (deploy-churn rule) | — |

## 5 · Accessibility requirements

| # | Requirement |
|---|---|
| A1 | WCAG 2.2 AA; `<details>`/`<summary>` gives free keyboard access and disclosure semantics |
| A2 | Filter chips are real `<button>`s inside `role="group"` rows with `aria-label`; the search input has `aria-label` |
| A3 | Content readable and navigable with JS disabled (F6) |
| A4 | Stage badges and horizon tags are text, not colour-only signals |

## 6 · What this page deliberately is NOT

| # | Boundary |
|---|---|
| N1 | **No wizard/personaliser** — no generated plan; age/gender variation via stage badges and notes (F3) |
| N2 | **No graph records** — static curated prose; register row records this decision; optional future modelling as `practice` records |
| N3 | **No API export / OpenAPI line / llms.txt line** — no dataset to export (N2); revisit if practices are ever modelled in the graph |
| N4 | **No fatwa service** — disclaimers in-page; detailed rulings point to the fatwa browser / local mufti (D5) |
| N5 | **No runtime AI, no server calls** — fully static per the Founder Charter |

## 7 · Production acceptance checklist

Run against `https://islam.museum` (or a deploy preview). Every row should pass.

| # | Check | Expected |
|---|---|---|
| P1 | `GET /ar/seerah/`, `/en/seerah/`, `/ur/seerah/` | HTTP 200 each |
| P2 | Count `class="practice` occurrences per page | 26 on each language page |
| P3 | Arabic page `<html dir>` and content | `rtl`; Arabic titles (سيرة وحياة) render |
| P4 | English page | `ltr`; "Seerah & Life", English card titles (e.g. "Zakat — a practical guide") render |
| P5 | Urdu page | `rtl`; سیرت و زندگی renders |
| P6 | **JS disabled**: open any card | `<details>` expands; body, steps, hadith, why all readable |
| P7 | JS enabled: type "zakat" / "زكاة" in the search box | only matching cards visible; count line updates |
| P8 | Click the "yearly" / "سنوي" horizon chip | only yearly cards visible (3) |
| P9 | Click a domain chip (e.g. المال والعمل) | only that domain's section shows; others hidden |
| P10 | Landing page `/{lang}/` → "Explore" section | "Seerah & Life" card present with the sun-over-path motif, links to `/seerah/` |
| P11 | Any page → Explore dropdown menu | سيرة وحياة entry present in all three langs |
| P12 | Click an ayah chip on a card (e.g. البقرة ٢٥٢… / 33:21 hero) | lands on the passage page with the verse text rendered from the record — not typed here |
| P13 | Footer disclaimer | the "verify rulings locally" note renders per language |
| P14 | Pagefind index after deploy | searching "سيرة وحياة" on `/{lang}/search/` finds the page (title/lede indexed) |
| P15 | Site footer version | ≥ v1.10.0 |
| P16 | `npm run validate`, `npm test`, `npm run build` | 0 errors / all pass (note: verify against current `main`; earlier sessions' data repairs landed in v1.9.0) |
| P17 | No `ﷺ`/honorifics and no typed Quran verse text in page source | grep the generated HTML: only links to `passage/quran-*` |

## 8 · Known gaps / follow-ups

- Urdu card prose is AI draft-tier → promote to `published` only after human review.
- Landing motif is a simple SVG; refine if the design system evolves.
- If practices are ever modelled as `practice` graph records: add the class, `/api/v1/practices.json`, OpenAPI + `llms.txt` lines, per-record entity pages, and flip the register row status.
