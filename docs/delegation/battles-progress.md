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
