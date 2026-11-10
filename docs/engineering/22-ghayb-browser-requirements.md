# 22 · Ghayb Browser — requirements and production checklist

_The feature requirements for «متصفح ما وراء الطبيعة» (the Ghayb Browser — the
unseen/paranormal explorer), as requested by the founder across the 9–10 November
2026 sessions and delivered in `docs/plan/33-ghayb-browser.md` through merged PRs
#5849, #5858, #5860, #5867, #5871, #5872, #5874, #5877, #5882, #5913, #5920,
#5921, #5922, #5926, #5933, #5938, #5941, #5942. Written so any person or AI
agent can validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an id
(`GHAYB-R..`), a "how to check" line, and the artifact that proves it._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| GHAYB-R01 | No new class or side table: every browser record is an ordinary graph node carrying `tags: [ghayb-browser, ghayb-<section>]` | `grep -rl "ghayb-browser" data/` — all hits under `data/concept/` or `data/event/`; `schema/classes.yaml` unchanged |
| GHAYB-R02 | ~85 tagged records grouped into **eight sections**, each tagged `ghayb-<id>`: `perception` حدود الإدراك · `daily` خفايا يومية · `time` الزمن والزمان · `heavens` رحلة السماوات · `miracles` المعجزات والآيات · `creations` أعظم مخلوقات الغيب · `barzakh` البرزخ وما بعد الموت · `signs` علامات الساعة | `site/src/lib/ghayb.ts` `GHAYB_SECTIONS`; `grep -h "ghayb-" data/concept/*.yaml | sort -u` |
| GHAYB-R03 | Reuse before create: existing records (jinn, malaika, dajjal, mahdiyya, jannah, jahannam, sirat, al-mizan, yawm-al-qiyama, flood, disease, kahana, janin, nutfa, alaqa…) are tagged in place, never duplicated | each exists once in `data/`; duplicate check via validator |
| GHAYB-R04 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule) | spot-check any `data/concept/*` file created in the waves; `npm run validate` 0 errors |
| GHAYB-R05 | Qur'an text is never typed — occurrences are `mentions` edges on frozen Tanzil `passage` records (passage → concept) | `grep -rn "target: concept/<slug>" data/passage/quran-*.yaml`; no `﴿﴾` in prose |
| GHAYB-R06 | Hadith corpora cross-linked the same way: seed `mentions` edges on Muslim/Bukhari passage records (Dajjal narrations, the ten-signs hadiths) | `data/passage/muslim-2942.yaml`, `muslim-0162.yaml`, `bukhari-3207.yaml` contain `type: mentions` edges |
| GHAYB-R07 | Contested topics use `perspectives` — Sunni first, then academic/other, each cited and labelled, no verdict | `perspectives:` block in `data/concept/al-dukhan.yaml` (jumhur vs Ibn Mas'ud) and `data/concept/mahdiyya.yaml` (jumhur vs Ibn Khaldun) |
| GHAYB-R08 | Editorial honesty: science appears only as analogy; nothing claims physics proves jinn, that the Mi'raj was a wormhole, or that the Qur'an encodes string theory | the page's method note (`i18n` `ghayb.method_note`) and record prose state "revelation first, science only analogy" |

## 2. Topic coverage (the founder's full request list)

| Id | Requirement | How to check |
|---|---|---|
| GHAYB-R10 | **Jinn see us unseen**: `concept/jinn` + `al-ghayb-al-mutlaq`, `idrak-al-ghayb`, `shayatin-al-ins-wal-jinn`; edge from 7:27 (إنه يراكم هو وقبيله) | `/ar/ghayb/` perception section; `data/passage/quran-7-27.yaml` mentions `concept/jinn` |
| GHAYB-R11 | **Isra & Mi'raj**: `event/isra-and-miraj`, `sidrat-al-muntaha`, `al-samawat-al-sab`, `bayt-al-mamur` tagged; Mi'raj route strip on the page | heavens section; `data/passage/quran-17-1.yaml`, `quran-53-14.yaml` edges |
| GHAYB-R12 | **Day = 1000/50,000 years**: `concept/yawm-ka-alf-sana` with edges from 22:47, 32:5, 70:4 | record exists; passage edges present |
| GHAYB-R13 | **All ten major signs**: `alamat-al-saaa-al-kubra`, `dajjal`, `dabbat-al-ard`, `tulu-al-shams-min-al-maghrib`, `nuzul-isa-ibn-maryam`, `yajuj-majuj`, `al-dukhan`, `al-khusufat-al-thalatha`, `mahdiyya`, `al-nar-al-yaman` | signs section lists 10 entries in canonical order on the timeline |
| GHAYB-R14 | **Barzakh arc**: `mawt`, `sakarat-al-mawt`, `adhab-al-qabr`, `rafiq-al-qabr`, `al-barzakh`, `yawm-al-qiyama`, `al-hisab`, `al-mizan`, `al-hawd`, `sirat`, `jannah`, `jannat-adn`, `jahannam` | barzakh section; each has trilingual prose |
| GHAYB-R15 | **Jannah details**: `anhar-al-jannah` (four rivers — 47:15), `thamarat-al-jannah` (fruits), `asal` (honey), `al-kawthar` | tagged; edges on 47:15/83:27/43:73/55:68/76:17 |
| GHAYB-R16 | **Miracles & Egypt**: `ayat-musa-al-tis` (الطوفان الجراد القمل الضفادع الدم — 7:133/17:101), `inshaq-al-bahr` (26:63) | miracles section; edges present |
| GHAYB-R17 | **Flood & destroyed nations**: `safinat-nuh` (54:13), `flood`, `aad-al-rih` (69:6-7), `thamud-al-sayha` (69:4), `qawm-lut` (29:40) | miracles section; edges present |
| GHAYB-R18 | **Dreams & visions**: `al-ruya-wa-al-risala`, `ruya-fiqh`, `taabir-al-ruya` (Yusuf's gift — 12:6/12:44/12:100), `al-hulm` (three dream kinds) | daily section; edges present |
| GHAYB-R19 | **Magic & possession**: `sihr` (2:102 Harut/Marut), `mass-al-jinn`, `al-sahara`, `hasad`, `al-ayn` (113:1/68:51), `tathir-al-jinn-wal-sihr`, `kahana` | daily section; edges present |
| GHAYB-R20 | **Premonitions**: `al-firasa`, `al-tatayyur`, `al-ilham` | daily section records exist trilingually |
| GHAYB-R21 | **Disease**: `disease`, `al-taun` (plague = martyrdom hadith), `al-judari`, `al-waba` | daily section records exist trilingually |
| GHAYB-R22 | **Embryo/pregnancy**: `marahil-al-janin` (23:14/22:5/39:6), `nafkh-al-ruh-fi-al-janin` (ensoulment, four decrees — 32:9), plus `janin`, `nutfa`, `alaqa`, `khalq-al-insan`, `nafkh` | creations section; edges present |
| GHAYB-R23 | **Week & months**: `ayyam-al-usbu` (Friday best day), `al-sana-al-arabiyya` (12 lunar months — 9:36), `al-ashhur-al-hurum`, `hijri-calendar`, `yawm-al-jumua-fiqh` (62:9) | time section; edges present |
| GHAYB-R24 | **Greatest creations**: `al-arsh`, `kursi-allah` (2:255), `al-lawh-al-mahfuz` (85:22), `al-qalam` (68:1), `israfil`, `hur-al-ayn`, `istiwa-ala-al-arsh` | creations section; edges present |
| GHAYB-R25 | **Angels/soul/ru'ya Allah**: `malaika`, `israfil`, `al-nafs-wal-ruh` (17:85), `ruyat-allah` | perception section; edges present |

## 3. The browser landing page `/{lang}/ghayb/`

| Id | Requirement | How to check |
|---|---|---|
| GHAYB-R30 | Page exists in all three languages: `/ar/ghayb/`, `/en/ghayb/`, `/ur/ghayb/` | `curl -sI` each → 200 |
| GHAYB-R31 | Localized title «متصفح ما وراء الطبيعة» / "The Ghayb Browser" / غیب کا براؤزر + lede + badge + method note | `i18n/{ar,en,ur}.yaml` `ghayb:` block; view page |
| GHAYB-R32 | Eight section chips with counts, each linking to its section anchor; every section shows a title + description + card grid | `/en/ghayb/` shows 8 sections; chip counts sum to tagged-record count |
| GHAYB-R33 | Every card links to the **ordinary entity page** (`/{lang}/concept/<slug>/` or `/event/…`), never a browser-only page | inspect card `href`s |
| GHAYB-R34 | Client filter narrows cards; Arabic vowel-insensitive; works as progressive enhancement — the full list is readable with JS off | `site/src/scripts/ghayb-filter.ts`; open `/ar/ghayb/` with JS disabled → full list |
| GHAYB-R35 | **Mi'raj route strip**: ordered stations (Mecca → al-Aqsa → seven heavens → Sidra → Bayt al-Ma'mur) read from `journey/isra-and-miraj-route` + heavens records | section «خريطة المعراج» on the page; waypoints come from the journey record, not hardcoded text |
| GHAYB-R36 | **Signs timeline**: the ten major signs in canonical hadith order (`GHAYB_SIGNS_ORDER` — the three khusufat appear as three entries) | «خط زمني علامات الساعة» section lists 10 ordered entries |
| GHAYB-R37 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | search for «المعراج»/«الدجال» reaches the page; page source carries both attributes |
| GHAYB-R38 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| GHAYB-R39 | **Landing card** on the homepage and **Explore menu** entry, in all three languages | homepage shows the star-gate card; `nav.ts` `{ key: "ghayb", ready: true }` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| GHAYB-R40 | `https://api.islam.museum/api/v1/ghayb.json` returns every tagged record with `kind`, `wings`, `themes`, `tags`, edges, prose languages | `curl -s .../ghayb.json | jq '.items | length'` ≥ 80; `feature: "ghayb-browser"` |
| GHAYB-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/ghayb.json` path), and `llms.txt` | all three rows exist |
| GHAYB-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 33), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md` (v1.8.0 + entries), `docs/plan/33-ghayb-browser.md` | all rows present |
| GHAYB-R43 | `features-api.test.ts` asserts `ghayb.json` in the export set | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| GHAYB-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| GHAYB-R51 | All work shipped as small PRs with canary entries; nothing committed directly to protected `main` | merged-PR list above; `gh pr list --search ghayb` |
| GHAYB-R52 | **Full trilingual coverage**: every tagged record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/<class>/<slug>.md` | the verification script returns "ALL TRANSLATED" (85 records) |
| GHAYB-R53 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | `grep -L "review: draft"` finds none among new records |
| GHAYB-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check GHAYB-R30/R39/R40 |

## 6. Explicitly out of scope / known limits

- No interactive 3-D Mi'raj map — the route strip is the approved static equivalent.
- No "common misconceptions" section yet (planned topic: jinn≠dark matter, Mi'raj≠wormhole).
- Qur'an/hadith `mentions` edges are seed waves; more can be added by the same pattern.
- Every record is draft-tier pending human review (R53) — the only gate before counting as published content.
