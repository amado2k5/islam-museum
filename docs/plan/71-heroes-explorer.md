# 71 — Heroes of Islam Explorer

Proposal, approved 17 November 2026 in session (founder: "megaplan … explorer about the heroes of islam … full rich proses … ui unique and as grande as their work"). Risk rating: non-impacting — additive content and one page; no class, licence, or submission-claim change.

## What it is

A grand hall-of-heroes explorer at `/[lang]/heroes/`. Twenty-four heroes from every era are grouped by the virtue each embodied into six trails (virtue halls): Sacrifice, Courage, Mercy, Generosity, Knowledge, Steadfastness. Each trail is a `data/exhibit` record of `kind: trail` (`exhibit/hero-*`) with one room per hero and a long-form trilingual narrative (`content/<lang>/exhibit/hero-*.md`); each featured hero's `person` record carries (or receives) the fuller story.

## Roster

| Trail | Heroes |
|---|---|
| hero-sacrifice | sumayya-bint-khayyat, musab-ibn-umayr, nusayba-bint-kab, zayd-ibn-haritha |
| hero-courage | ali-ibn-abi-talib, khalid-ibn-al-walid, salah-al-din-yusuf-ibn-ayyub, omar-mukhtar |
| hero-mercy | al-hasan-al-basri, zaynab-bint-ali, nur-al-din-mahmud-ibn-zangi, abd-al-qadir-al-jazairi |
| hero-generosity | abd-al-rahman-ibn-awf, uthman-ibn-affan, khadija, fatima-al-fihri |
| hero-knowledge | al-shafii, ahmad-ibn-hanbal, rabia-al-adawiyya, al-khansa |
| hero-steadfastness | bilal-ibn-rabah, salman-al-farisi, abu-bakr, abd-al-muttalib |

Prophets are deliberately not rostered (honoured in `messengers`/`seerah`; keeps the depiction question moot).

## Design rules (the "grand" without imagery)

No figurative depiction of any person — the grandeur is calligraphy and geometry: oversized display-type names, one eight-fold star `VirtueMedallion` per hall in its own accent, room bodies as the one-line "what they gave" beneath each name. Fully build-rendered; no client script. RTL-first, trilingual in the same commit, `data-pagefind-body` on the header block only.

## Parts

- `site/src/lib/heroes.ts` — trail registry read from the exhibit records' rooms (single source of truth).
- `site/src/pages/[lang]/heroes/index.astro` + `components/VirtueMedallion.astro`, `components/HeroCard.astro`.
- `i18n/*` — `heroes:` block and `explore.pages.heroes` in ar/en/ur.
- `site/src/lib/nav.ts` — `heroes` key in the Explore union, pages list and `people` group; the landing card follows automatically.
- `/api/v1/heroes.json` — the roster export; `docs/data/README.md`, `openapi/v1.json`, `llms.txt.ts` lines.
- Route budget `/ar/heroes/` in `scripts/check-weight.ts`; build assertion in `scripts/check-site.ts`.
- Registry rows: `docs/site/browsers.md`, `docs/site/signature-views.md`, `docs/plan/00-README.md`, `docs/status.md`, `CANARY.md`, `docs/delegation/heroes-progress.md`.

## Growth

New heroes = new rooms on an existing trail record (or a new `hero-*` trail), never a new dataset — the explorer is a front door over the one graph.
