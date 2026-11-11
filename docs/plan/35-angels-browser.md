# 35 — Angels Browser (متصفح الملائكة)

Requested by the founder, 10 November 2026. Scope clarified by the founder in the same
session: **angels only** — everything mentioned about angels in the Qur'an, the Sunnah,
the Seerah and any of the Sunni books, including material in books harvested later.

## What it is

A browser over the one graph — no side table, no second graph — listing every angel and
every mention of angels in the museum's corpus. The Ghayb Browser already treats angels
as one of its unseen-world topics; this browser is the focused front door for the same
records plus the angel-specific layer the Ghayb sections do not cover.

## Data model

- Records are ordinary graph records: `concept` records (new kind `angel` registered in
  `schema/enums/kinds.yaml` alongside `belief`, `doctrine`, `term`, …) and `person`
  records where the entity model already treats a named angel as a person
  (`person/jibril`, `person/mikail`).
- Membership is by tags: `angels-browser` plus one section tag `angels-<section>`.
- Source material points at subjects through `mentions` edges on `passage`, `event`,
  `journey` and `question` records; subject pages show the inverse (`mentioned_in`).

## Sections (tag → title)

| tag | ar | en | ur |
|---|---|---|---|
| `angels-doctrine` | العقيدة والخلق | Creed and creation | عقیدہ اور تخلیق |
| `angels-revelation` | ملائكة الوحي | Angels of revelation | وحی کے فرشتے |
| `angels-eschaton` | ملائكة الآخرة | Angels of the Hereafter | آخرت کے فرشتے |
| `angels-recording` | الملائكة الكتبة | The recording angels | کتابت کے فرشتے |
| `angels-hosts` | الرتب والجموع | Ranks and hosts | رتبے اور مجمعے |
| `angels-events` | المواقف واللقاءات | Appearances and encounters | مواقع اور ملاقاتیں |

## Seed records (wave 1, 18 new concept records)

Named angels: `malik-keeper-of-jahannam`, `ridwan-keeper-of-jannah`,
`munkar-and-nakir`, `harut-and-marut`, `malak-al-mawt`, `israfil` (existing).
Orders and hosts: `hamalat-al-arsh`, `mal-al-aala`, `angels-at-badr` (existing).
Recording: `kiraman-katibin`, `raqib-wa-atid`, `malak-al-janin`.
Prophetic and seerah encounters: `malaikat-ibrahim`, `malaikat-zakariyya`,
`malak-maryam`, `malaikat-al-imdad`, `malaikat-salat-ala-l-nabi`,
`malaikat-munfarij`, `malaikat-laylat-al-qadr`.
Doctrine: `malaika` (existing), `malaika-fiqh` (existing), `malaika-khalq`,
`question/what-are-angels` (existing).
Events/journeys tagged in: first and second revelation, shaqq al-sadr, Isra' and Mi'raj,
Badr, Uhud burial of martyrs, Hunayn.

## Pages and API

- `/{lang}/angels/` — landing: badge, lede, method note, section chips, filterable card
  grid (`data-pagefind-body` on header, `data-pagefind-ignore` on the grid), counts
  computed at build time.
- `/{lang}/angels/<slug>/` — subject page: trilingual label, summary rendered from the
  record, every linked Qur'an ayah (frozen Tanzil text from the passage records, never
  typed), every linked hadith report, sources footnotes, related records.
- `/api/v1/angels.json` — feature export (kind, wings, themes, tags, edges).
- Entity pages remain at `/[lang]/concept/<slug>/` etc.; the browser is a view, not a
  duplicate.

## Future harvested books

Any future mined record that is angel-related gets `angels-browser` + a section tag and
`mentions`/relation edges, and it appears here automatically — the same contract the
Nature Explorer uses. The harvesting lanes should consult this plan when tagging.

## Validation

`docs/engineering/23-angels-browser-requirements.md` is the acceptance spec: every
requirement has a production check.
