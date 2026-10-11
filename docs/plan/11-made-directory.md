# 11 · The "Made" wing — a directory of things created and owned by Muslims

A ninth wing that lists, classifies and links **what Muslims make and own today and in the recent past**: shops and businesses, brands, publishers and bookshops, books, apps and software, games, media and podcasts, studios, charities, schools, clinics, funds, crafts, foods and more. It extends the museum from "what happened" to "what is being made now", and it is the part of the museum most likely to be used daily.

## 1. Purpose and boundaries

- **Purpose:** discovery and recognition. A visitor anywhere can find Muslim-made books to read, businesses to support, apps to use, studios to follow, and institutions to learn from, with the same calm, sourced, neutral presentation as the rest of the museum.
- **Listed is not endorsed.** The museum does not vet quality, orthodoxy, or halal status; it records what is documented and links to the source.
- **"Muslim-made" means:** the owner, founder or author publicly identifies as Muslim, or a reliable source documents it. The museum never decides who is Muslim; it records self-identification or documentation. A `basis` field says which.
- **No ads, no paid placement, no ratings, no reviews, no affiliate links.** Ever. This is what keeps the wing trustworthy.
- **Respect for the listed.** Any owner can correct or remove their listing through a public form; living-person rules apply to founders.
- **Not a halal certifier.** Where a certification exists, we record the certifier and link to its register; we do not adjudicate.
- **Global by design.** Coverage targets are per country and per category, so the directory does not become a directory of one country.

## 2. Data model

One new class, **`listing`**, plus reuse of existing classes:

| What | Class | Notes |
|---|---|---|
| Shops, brands, restaurants, companies, studios, apps, games, products, media outlets, podcasts, funds, clinics, schools, charities | `listing` | New class (schema below) |
| Books, albums, courses by Muslim authors/creators | `work` with `kind` and `made.by_muslims` | Already in the Words wing; the Made wing aggregates them as a "Library" shelf |
| Films and television by Muslim creators | `screen` with `made.by_muslims` | Catalogued in the Screen index (`12-screen-index.md`); the Made wing shows them as a "Screen" shelf when the basis is documented |
| Organisations and institutions (universities, museums, NGOs) | `group` with `kind: organization` or `institution` | Already in the Today wing; aggregated here when `made.by_muslims` is set |
| Founders and authors | `person` (living-person rules) | Linked by `founded_by`, `authored_by` |
| Physical premises | `place` + coordinates | For the map |

### `listing` schema (key fields)

```yaml
id: listing/example-books-london
class: listing
kind: bookshop            # see kinds below
label: { en: Example Books, ar: مكتبة المثال }
summary: { en: "Independent Islamic and general bookshop in east London, founded 2012.", ar: "..." }
categories: [books, education]          # controlled list, multi-valued
made:
  by_muslims: true
  basis: self-identified                # self-identified | documented | unverified
  sources: [source/example-books-about-page]
founded: { edtf: "2012" }
status_business: active                 # active | closed | unknown ; checked by link-health job
location:
  place: place/london
  address: { en: "…" }                  # optional, public business address only
  coordinates: [51.52, -0.06]
  online_only: false
  serves: [gb, global]                  # ISO country codes
links:
  website: https://example.org
  social: { instagram: "...", youtube: "..." }
  app_store: ...
  isbn_prefix: ...                      # publishers
languages: [en, ar, ur]
certifications:                         # recorded, not adjudicated
  - { body: group/halal-monitoring-committee, ref: "HMC-1234", source: source/hmc-register, checked: 2026-10-01 }
relations:
  - { type: founded_by, target: person/… }
  - { type: located_in, target: place/london }
  - { type: sells_work, target: work/… }        # optional, for bookshops/publishers
owner_contact_on_file: true             # private; not published; enables correction/removal
status: { review: reviewed, completeness: 3, last_checked: 2026-10-01 }
provenance: { submitted_via: issue-form#123, generated_by: scripts/ai/draft-listing@0.1 }
```

**Kinds:** `shop`, `brand`, `restaurant`, `food_product`, `publisher`, `bookshop`, `library`, `company`, `startup`, `app`, `software`, `game`, `studio` (design, animation, architecture), `media` (outlet, channel), `podcast`, `magazine`, `charity`, `foundation`, `school`, `university`, `clinic`, `fund` (finance), `fashion`, `craft`, `artist_practice`, `travel`, `event_series`, `platform`, `other`.

**Categories (facets):** books · education · food · fashion & modest wear · beauty · technology & apps · games · finance · health · travel & Hajj/Umrah services · arts & design · media & entertainment · charity · architecture & construction · agriculture · crafts & heritage · sports · kids & family.

New predicates: `founded_by/founder_of` (exists), `sells_work/sold_at`, `publishes/published_by`, `certified_by/certifies`, `member_of` (chambers, associations).

## 3. Discovery (where the entries come from)

| Source type | Examples | Use |
|---|---|---|
| Owner submissions | GitHub Issue Form "Add a listing" (structured fields: name, kind, country, website, founder, basis, sources) | Primary channel; `basis: self-identified` |
| Existing directories and registers | Muslim business directories and chambers of commerce by country, halal certification registers (e.g. HMC, IFANCA, JAKIM, MUI, ESMA, GCC bodies), Islamic finance registers (AAOIFI members, central-bank lists of Islamic banks), Muslim publishers' associations, Islamic book fairs' exhibitor lists, mosque and community-centre directories | AI-assisted harvesting of *candidates*; each becomes a listing only after verification |
| Books | ISBN databases (Open Library, national libraries), publishers' catalogues, award lists (e.g. prizes for Muslim writers), library catalogues | `work` entries with `made.by_muslims` and a documented basis |
| Apps and software | App store categories (Islamic apps, Qur'an, prayer), open-source projects by Muslim developers who self-identify, product hunt style listings | `listing kind: app/software` |
| Media | Podcast directories, YouTube channels with public self-identification, magazines | `listing kind: podcast/media` |
| Press and reference | Wikidata (founder, country, industry), reputable press features | `basis: documented` with the source |
| Institutions | OIC, ISESCO, IRCICA member lists; university lists; museum associations | `group` entries |

Candidate harvesting from open registers and directories runs on the founder's Mac (`15-local-harvest.md` §6.7). A register entry is a lead only; the basis rules above decide what is published.

The AI pipeline (09) gets a `listing` branch: `harvest-candidates` → `dedupe` → `verify-basis` (finds the owner's public self-identification or two documented sources; otherwise `unverified` and not published) → `draft-listing` → PR. Unverified candidates are kept in a private wanted-list, not on the site.

## 4. Verification and freshness

- **Basis** is required and displayed: self-identified (link to the owner's own statement), documented (two sources), or unverified (never published).
- **Link-health job** weekly: dead website for 60 days → `status_business: unknown`, shown as "may have closed"; owner can confirm.
- **Yearly re-check** of certifications and addresses; `last_checked` shown.
- **Removal and correction** via a form that requires proof of ownership (reply from the domain's email or a note on the site); removals are honoured within days.
- **No personal data** beyond public business information and public founder names; home addresses never.
- **Spam and gaming:** one listing per business, no duplicates across kinds, no promotional language (lint for superlatives and marketing claims), reviewer approval, rate limits on submissions.

## 5. How it appears in the museum

- **Made wing hall:** a map of the world with listings by country, a category grid, a "Library" shelf of books, an "Apps" shelf, an "Institutions" shelf, and a "Near you" finder (geolocation stays in the browser).
- **Listing page:** name in both scripts, kind and categories, founded, location map, website and public links, founder (linked), basis badge, certifications with sources, "part of the story" links (a bookshop in Fez links to `place/fez` and to `building/al-qarawiyyin`; a Qur'an app links to `work/quran`), last checked date, "correct or remove this listing".
- **Cross-links from the rest of the museum:** a `place` page shows "Made here today"; a `work` by a living author shows where to buy from Muslim-owned bookshops that list it (`sells_work`), with no affiliate links; a `concept` like `waqf` links to charities that are waqf-based.
- **Exports:** CSV and JSON per country and per category; the whole directory under CC0 (facts) with sources.

## 6. Roadmap for the wing

- **Phase 1 (with the spine):** schema, issue form, 100 seed listings across 20 countries and all categories (bookshops and publishers first), the Library shelf with 100 books by living Muslim authors across genres and languages, the hall page and map.
- **Phase 2:** harvesting pipeline for candidates from registers; 1,000 verified listings; "Near you"; owner correction flow.
- **Phase 4 (community):** country stewards; translations of listings; partnerships with chambers and publishers' associations.
- **Ongoing:** weekly link health; yearly re-check; public coverage per country.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Looks like advertising | No ads, no ratings, no affiliate links, plain presentation, listed-not-endorsed banner |
| Mislabelling someone's religion | Self-identification or documentation only; removal on request; never infer from names |
| Halal disputes | Record certifications with sources; never adjudicate |
| Stale data | Link-health job; last-checked date; owner updates |
| One-country bias | Country and category coverage targets on the public coverage page |
| Legal (trademarks, defamation) | Nominative use of names only; no logos without permission (text tiles instead); facts with sources; prompt correction |
