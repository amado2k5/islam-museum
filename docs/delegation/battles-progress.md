# Progress — lane `battles` (Battles, Wars and Conquests Browser)

Lane file: [`docs/agents/lanes/battles.md`](../agents/lanes/battles.md). Plan: [`docs/plan/31-battles-browser.md`](../plan/31-battles-browser.md).

## 2026-11-09 — browser shell landed (phases 1–3)

- Proposal `docs/plan/31-battles-browser.md` + plan-index row.
- `site/src/lib/battles.ts`, `site/src/pages/[lang]/battles/{index,ghazawat}.astro`, `kind/[kind].astro`, `era/[period].astro`, `site/src/scripts/battles-filter.ts`.
- i18n `battles:` + `explore.pages.battles` in ar/en/ur; Explore entry added `ready: false`.
- `/api/v1/battles.json` (+ `extra` hook on FEATURE_EXPORTS; `ghazwa` derived flag), openapi path, `docs/data/README.md` row, `llms.txt` line.
- Register rows: `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`; CANARY entry.
- Build numbers on this day: 3,251 military events — battle 1,483, siege 710, conquest 375, war 228, revolt 157, campaign 135, raid 106, civil-war 29, skirmish 12, mutiny 9, naval-battle 7; prophetic-era 75 → derived 53 ghazawat / 22 saraya; 270 events carry `sides`, 49 carry `map`.

## Next

- Enrichment wave 1: `sides`/`outcome`/`occurred_at` on the prophetic 75 (gold: `event/expedition-of-al-sawiq`).
- `part_of` edges battles→wars/campaigns.
- Flip `ready` and the landing card on founder approval.

## 2026-11-09 — enrichment waves 1–2 landed (PRs #5829, #5831)

- Wave 1: `sides:` on 14 major records (Qaynuqa, Qurayza, Nadir, Badr al-Maw'ida, Usama, Dumat, Hamra al-Asad, Yemen, Muslim–Quraysh war, al-Raji', Bi'r Ma'una, Amr ibn Umayya, two Hudhayl killings) — cited to each record's own sources; `npm run validate` 0 errors.
- Wave 2: `sides:` on 12 saraya/raids (Abd al-Rahman to Dumat, Abdullah ibn Unays, Abu Ubayda, Ali to al-Fals, Kurz, Zayd to Madyan, Ibn Abi Hadrad ×2, khandama). Sub-events of Badr/Uhud stay unsided by design; `siege-of-taif-8`, `siege-of-tbilisi-628`, `battle-of-abraq-632` need a record review (possible mislabel/duplicates) before any sides.
- Prophetic-era sides coverage now ~66/75; commanders surface on the browser cards.

## 2026-11-09/10 — enrichment waves 3–23 + bulk pass (PRs #5837–#5908)

- Wave 3 (#5837): `sides` derived on 206 records from their own `had_participant`/`occurred_at` edges — the maximum safe mechanical coverage.
- Waves 4–14 (#5840–#5875): researched sides on ~180 famous engagements — Rashidun canon, Umayyad, early-Abbasid, Crusades/Ayyubid/Mamluk (Hattin, Ain Jalut, Tyre, Kerak…), gunpowder empires, Ottoman era, post-Mongol, Buyid/Seljuk/Fatimid, colonial.
- Waves 15–17 (#5864–#5873): Tunis 1357 correction, Ottoman canonicals, cross-era engagements, Buyid/Seljuk/Fatimid.
- Wave 18 (#5892): WWI-era engagements (Gallipoli, Kut, Sinai, Hejaz).
- Wave 19 (#5894): Balkan wars, Indo-Pak, Italo-Turkish, Algerian independence.
- Waves 20–22 (#5896–#5906): gunpowder canonicals (Malacca, Diu, Hormuz, Tripoli, Golconda, Bijapur, Samarkand, Kandahar, Baghdad), Crusade sieges (19 records), Ottoman war umbrellas (15).
- Wave 23 (#5907): Qarmatians, Ridda, Mongols, Zanj, Reconquista, Delhi-era conquests (13 records).
- Bulk pass (#5908): 103 conquest/siege records gained sides derived from `during_reign` + `occurred_at` edges (reigning power vs place garrison).
- Record fixes along the way: `siege-of-taif-8` → alias of `siege-of-taif`; `abraq-632`/`tbilisi-628` → Rashidun era; 964 heading-less prose files unhidden repo-wide (0 empty prose docs now).
- Skipped by policy: modern records tied to designated terrorist organisations (Baghuz, Baiji, al-Mukalla, al-Qaryatayn, al-Rai, Batroun, al-Haffah…).
- Coverage: ~1,050 of 3,251 military records now carry `sides`. Remaining ~2,200 have neither participant nor reign/place edges — each needs per-record source mining.
- Still open: `outcome`, `casualties`, `occurred_at`/`part_of` edges; full `npm run build` end-to-end; Explore `ready` flip awaits founder.

## 2026-11-11 — Wikidata-participant sides wave (PR #5940)

- 668 draft-card military records gained `sides` from their linked Wikidata item's P710 `participant` claims — only where exactly two distinct participants exist, so each claim maps cleanly to one side. Labels are the participants' own Wikidata en/ar labels (35 missing ar labels supplied); the participant carrying a Wikidata religion claim of Islam is ordered first. `source/wikidata` added to citations.
- Held back under the content-safety hard block: `ansariya-ambush-1997` (Hezbollah), `battle-of-ramadi-2014` (the designated group named by its Wikidata participants), `israeli-incursions-in-tulkarm-2023` (the Tulkarm Brigade) and `batroun-raid-2024` — consistent with the earlier modern-conflict skips.
- Skipped: 161 records with one participant, ~430 with three or more (flat claim list cannot split sides), 2 with unlabeled participants, and the previously skipped ambiguous/terrorist-adjacent records.
- Coverage: ~1,716 of 3,250 military records carry `sides`. The remaining ~1,534 have no usable participant data — genuine source mining required.

## 2026-11-11 — Wikidata-participant graph links (PR #5956)

- 520 of the 668 Wikidata-sided records gained `participants:` links on their sides where the participant's Wikidata QID matches an existing graph entity (polity/place/group/person with `external_ids.wikidata`) — 653 links, mostly `polity/` records (Ottoman Empire, Safavid Iran, Mamluk Sultanate…). Labels-only sides remain where no graph entity carries the QID.
- Noted for a future reconciliation lane: `place/byzantine-empire` and `polity/byzantine-empire` are duplicate entities; the QID currently sits on the place record.

## 2026-11-11 — missing belligerent entities + full participant linking (PR #5960)

- 50 new draft entities (45 `polity/`, 5 `group/`) created for Wikidata participant items that had no graph entity — empires, kingdoms, sultanates, taifas and peoples appearing as battle sides. Each carries `external_ids.wikidata`, `sources: [source/wikidata]`, trilingual-ready ar/en labels, `status.review: draft`.
- `external_ids.wikidata` added to `polity/sasanian-empire` (Q83891) and `group/kurds` (Q12223); `polity/adal` was left unchanged because `place/adal-sultanate` already carries Q2365048 (validator caught the would-be duplicate).
- 368 further `participants:` links written across 338 events. Total side→entity links: ~1,083 of 1,348 resolvable refs; the rest are label-only (no graph entity exists — e.g. Crown of Castile Q217196, Emirate of Córdoba Q1337854, which duplicate near-identical existing entities under different Wikidata items).
