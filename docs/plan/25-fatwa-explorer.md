# 25 · The Fatwa Explorer: proposal

Status: **proposal, awaiting the founder's approval.** Nothing in schema, data, site, i18n or the canon changes until it is approved (`docs/ai-change-gates.md` §1). This document is the only file this change adds.

Written 31 October 2026 from prompt U in `docs/plan/07-prompts.md`. Phase 1 (finding the books in the browser) has **not** run; section 4 gives the method and a starting list, and the catalogue will follow approval.

## 0 · What the explorer is for, and what it is not

The explorer shows Sunni fatwas from the Companions to today as a connected record: who asked, who answered, when, under which ruler, on what basis, which earlier answers they rest on and which later answers rest on them. It never issues a ruling. Every page says who said what, to whom, and on what basis, and points the reader to a qualified scholar for their own case.

## 1 · What the repository already has (checked 31 October 2026)

- `schema/enums/kinds.yaml`, `work` kinds: `fatwa` already exists. The fatwa collections in `data/work/` are filed as `book` (for example `al-fatawa-al-kubra-ibn-taymiyya`, `fatawa-alamgiriyya`, `fatawa-qadikhan`, `fatawa-ibn-zarb-al-qurtubi`, `mecmu-u-fetava`, `al-fatwa-al-hamawiyya`, `fatawa-ali-al-tantawi`, `al-fatwa-fi-al-islam`, `fatwa-on-terrorism`, `mecmuatu-heyetil-kadime-vel-cedide`). Individual fatwas are not yet entities.
- `concept/ijtihad`, `concept/fiqh`, `concept/al-fatwa-ala-al-fadaiyyat` and `question/what-is-fatwa` exist. There is no `concept/fatwa` or `concept/ifta`.
- Predicates in `schema/predicates.yaml` that fit: `issued` / `issued_by` (mufti → fatwa), `rules_on` (fatwa → concept, practice or group), `part_of` (fatwa → collection), `responded_to` (counter-answer).
- Predicates **missing**: `relies_on` / `relied_on_by`, `agrees_with`, `revised_by` / `revises`, `codified_in`. No asker or ruled-on predicate exists.
- `schema/enums/roles.yaml` has `scholar`, `jurist`, `caliph`, `sultan`, `emir`, but no `mufti`, `qadi` or `shaykh-al-islam`.
- `scripts/harvest/library/books.yaml` has no `fatwa` category. `exclusions.yaml` exists. The harvest tools (`fetch_books.py`, `ocr_all.py`, `ocr_book.py`, `slice_pages.py`, `make_sources.py`, `verify_cites.py`, `claims_pipeline.py`, `authenticity_gate.py`) exist.
- No `data/_stubs.d/fatwa.yaml` yet.

## 2 · The data model (proposed)

### 2.1 Classes and kinds

- **Single fatwa** = `work` with `kind: fatwa` (existing kind).
- **Fatwa collection** = `work` with a new kind `fatwa-collection`, plus `collection_type` (`fatwa-book`, `nawazil`, `masail`, `ottoman-fetva`, `council-resolutions`). New enum value, `work` kinds. It adds a kind inside an existing class, so the class list quoted by the submissions does not change.
- **Act of issuing** = `event` with `kind: fatwa-event` (new enum value), linked to the work.
- **Website** (section 3.4) = `work` with `kind: website` and `content_type: fatwa` (existing kind).
- Concepts: new `concept/fatwa` and `concept/ifta`, with each school's definition in `perspectives`.
- Roles: add `mufti`, `qadi`, `shaykh-al-islam` to `schema/enums/roles.yaml`.
- No new entity class: the class list is quoted in the submissions.

### 2.2 Fields

Reuse existing fields where one fits. Names are proposals.

| Group | Field | Shape | Notes |
|---|---|---|---|
| Question | `question.summary` | {ar, en, ur} | In the museum's words, attributed («سُئل … عن …»). A verbatim quote of ≤ 40 words with page is allowed. |
| | `asker` | link to person / group / polity, or none | An unnamed asker stays unnamed. |
| | `asker_description` | {ar, en, ur} | For example «رجلٌ من أهل …». Never a guessed name. |
| | `asker_role` | enum: ruler, qadi, official, scholar, student, merchant, community, commoner, institution, unnamed | Drives the "who asked" filter. |
| | `asked_from` | place | Can differ from `place`. |
| | `form` | enum: oral, letter, ruq'a slip, court referral, Ottoman fetva form, council resolution, broadcast, website | |
| Answer | `issued_by` (existing predicate) | person or group | The madhhab comes from the person or group entity. |
| | `answer.summary` | {ar, en, ur} | Attributed; quotes ≤ 40 words. |
| | `rules_on` (existing) | concept / practice / group | |
| | `fiqh_area` | enum tree: ibadat, mu'amalat, family, inheritance, crimes and penalties, judiciary, governance (siyasa), jihad and relations, food and dress, creed-related, medicine and science, new matters (nawazil) | New enum file. |
| When and where | `date` | existing date object: EDTF + Hijri + calendar + precision; conversions marked derived | If only the mufti's lifetime is known, record a span at low precision. Never a guessed year. |
| | `place`, `period` | existing | `period` is derived from `date` only when not stated. |
| Power | `ruler_at_time` | link to person / polity | |
| | `ruler_role` | enum: asker, addressee, subject, enforcer, opponent, contemporary | Only `contemporary` may be derived from dates and place. Every other role needs the source to say so. |
| | `judge` | person | The qadi who referred or applied the answer; a court case is an `event` of kind `court-ruling`. |
| Basis | `evidence[]` | typed items: `quran` (passage link only), `hadith` (passage link with grader), `ijma`, `qiyas`, `athar`, `maslaha`, `urf`, `istihsan`, `sadd-al-dhara'i`, `earlier-opinion`, `earlier-fatwa` | Qur'an text is never typed. |
| | `method` | string, as the book names it | |
| Chain | `relies_on` / `relied_on_by` (**new predicate pair**) | work → work or passage | Precedent. The heart of the explorer. |
| | `agrees_with` (**new**, symmetric) | work ↔ work | |
| | `responded_to` (existing) | | A counter-fatwa or refutation. |
| | `revised_by` / `revises` (**new pair**) | work → work | Ruju', or the later mu'tamad position. |
| | `codified_in` (**new**) | work → work or law | For example Ottoman qanun, the Majalla. |
| Reception | `reception[]` | dated, cited items: endorsed by, contested by, applied by a ruler, ignored, became the school's position | Contested fatwas get a `perspectives` block and, for hard questions, a tension card. |
| | `consequence` | `event` link | Only when a source says so. |
| Attribution | `attribution_status` | enum: certain, attributed, disputed, weak | Some famous fatwas are later attributions; record who disputes them. |
| | `transmitted_by` | person | The student who recorded it, or the compiler. |
| | `sources[]` | collection, volume, PDF page, printed page | The printed-page offset is recorded once per book. |
| Display | `headline` | {ar, en, ur} | |
| | `sensitivity` | existing enum | takfir, apostasy, jihad, rebellion, slavery, women and minorities. |

### 2.3 Predicates to add (each needs approval)

| Predicate | Inverse | Domain → range | Labels (ar / en) |
|---|---|---|---|
| `relies_on` | `relied_on_by` | work → work, passage | يستند إلى / Relies on |
| `agrees_with` | `agrees_with` (symmetric) | work → work | يوافق / Agrees with |
| `revised_by` | `revises` | work → work | يراجعه / Revised by |
| `codified_in` | `codifies` | work → work, law | مُقنَّن في / Codified in |

No asker predicate is proposed. `asker` is a field, not an edge, so the explorer filters on the field and the graph is not cluttered with one edge per question.

### 2.4 Why not a `passage` unit for fatwas

A fatwa is a `work` entity with a ≤ 40-word quote and a page citation. A `passage` kind would only be needed if fatwas were cited as sub-units of a book in large numbers. The `work` route keeps one record per fatwa and reuses the existing quote rule.

### 2.5 Other things a visitor would value (not needed for the pilot)

The fee or stipend of the office where the book gives it; the formula «والله أعلم»; the seal of the Ottoman Shaykh al-Islam; the language of the fatwa; whether the asker was non-Muslim (recorded only as the book states it); cross-references between madhhabs on the same question.

## 3 · Explorer design (proposed)

### 3.1 Routes and components

- `/[lang]/fatwa/`: explorer landing. It opens with the section «What a fatwa is, and what it is not» (3.3), then a Hijri timeline strip with era bands (reusing `TimeStrip.astro`), filters (school, mufti, asker role, fiqh area, region, century, collection), a MapLibre map (lines from `asked_from` to `place`), counts, and a Pagefind search.
- Fatwa page: an entity page with a fatwa layout. Question card, answer card, basis, the chain (earlier fatwas above, later ones below, counter-fatwas beside, like an isnad drawn as a family tree), reception and consequences, perspectives, sources with page, the context of the answer, and the fixed notice.
- Mufti and collection pages: a lifespan ribbon (`TimeStrip`), rulers answered, muftis cited and citing, and the collection's table of contents.
- Ruler lens: a «فتاوى في عهده / سُئل فيها» block on ruler and polity pages.
- Compare by question: one `concept` or `practice`, each school's answer side by side through the plan-20 opinions component, Sunni schools first.
- Precedent graph: the constellation view at `/ar/graph/?from=`, coloured by school and sized by citations.
- Today's fatwa websites: a directory (publisher, school, languages, size, link), and index records in search that link out («اقرأ الفتوى كاملة على موقع …»).
- Landing card and explore-bar entry marked «قيد الإعداد» until ready (plan 21).

### 3.2 Data flow and hosting

Build-time JSON for the explorer goes to R2 under the hosting rule (`docs/site/README.md`, ADR 0002). That means adding the folder to `R2_DATA_DIRS` in `workers/site/src/route.js` and `workers/r2-sync/batch/publish.mjs`, to `run_worker_first` in `workers/site/wrangler.production.toml`, and to the two removal lines in `deploy.yml`. No runtime network calls and no AI at runtime. The pages work without JavaScript, meet WCAG 2.2 AA, and are Arabic first with English and Urdu.

### 3.3 The opening section: «What a fatwa is, and what it is not»

In the docent voice, every claim attributed and cited, in ar / en / ur, readable without JavaScript, repeated in short form (one line and a link) on every fatwa, mufti and collection page:

1. Every fatwa is one scholar's answer, reached by his own ijtihad for the question put to him. It can be right and it can be wrong. The classical statements on this (the saying attributed to Malik; al-Shafi'i's «my view is right with the possibility of error») are checked in a defined source with page, and disputed attributions are said to be disputed.
2. A fatwa does not bind the reader the way a judgment binds the parties. The classical line between fatwa (information) and qada' (an enforced decision) is drawn in al-Qarafi's *al-Ihkam fi Tamyiz al-Fatawa an al-Ahkam*.
3. A fatwa answers one question, at one time, in one place, for one person or community. Its basis is Ibn al-Qayyim's chapter in *I'lam al-Muwaqqi'in* on fatwas changing with time, place, condition, intention and custom, and al-Qarafi and Ibn Abidin (*Nashr al-'Arf*) on custom. Two or three real examples from the data, where one school's answer changed, will illustrate it.
4. So a fatwa shown here may or may not apply today, where you live, or to you. For your own case, ask a qualified scholar who knows your time, place and situation.
5. Learn more: 4 to 8 links, each opened and read before it is added, from established Sunni institutions and scholars (Dar al-Ifta al-Misriyya, Al-Azhar's fatwa centre, the International Islamic Fiqh Academy, and in Urdu an established institution such as Dar al-Ulum Deoband or Jamia Binoria). Each link is stored with title, publisher, URL, date read and a Wayback snapshot, and marked «external, listed not endorsed». No guessed URL.

`question/what-is-fatwa` and the new `concept/fatwa` get the same points and sources.

Fixed notice on each fatwa page (Arabic, with English and Urdu): «هذه الفتوى اجتهادُ صاحبها في زمانه ومكانه وحال سائله، تُعرض سجلاً تاريخياً لا حكماً للقارئ؛ قد تصيب وقد تخطئ، وقد لا تنطبق على زمانٍ أو مكانٍ أو شخصٍ آخر. اسأل أهل العلم في حالتك.»

### 3.4 Today's fatwa websites

The site index is a generated dataset of facts only (number, URL, topic in the museum's words, mufti or body, date, language, mapped `fiqh_area`), linking out for the full answer. Full fatwa entities only for notable answers. Each site is a `work` of kind `website`, marked «listed, not endorsed». Robots, terms and copyright are checked first, and a site whose terms forbid automated access is listed but not crawled. Propose the exact shape in a later proposal before any build.

## 4 · Books: method and starting list (Phase 1 not yet run)

Method (prompt U §3): search archive.org (also via `ia`), waqfeya.net, noor-book.com, al-maktaba.org, shamela.ws, OpenITI, the Qatar Digital Library, HathiTrust and official fatwa bodies, in a new browser tab, without the founder's logged-in tabs, without signing in, paying, accepting terms or filling forms. Prefer clean text, then a text-layer PDF, then a scan for Apple Vision OCR. Prefer critical editions. Every candidate passes the §1a harvest canon gate before it enters `books.yaml`.

Starting list to verify, not proven or complete: the Musannaf of Abd al-Razzaq and Ibn Abi Shayba; I'lam al-Muwaqqi'in; the Masa'il of Ahmad (in his students' recensions); al-Mudawwana; Abu al-Layth al-Samarqandi's al-Nawazil; Fatawa Qadikhan; al-Walwalijiyya; al-Bazzaziyya; al-Tatarkhaniyya; al-Hindiyya; Ibn Abidin's *al-Uqud al-Durriyya*; Ebussuud; Behcetü'l-Fetava; Fatawa Rizwiyya; Imdad al-Fatawa; Ibn Rushd al-Jadd's fatawa; Ibn Sahl's *al-Ahkam al-Kubra*; Qadi Iyad's *Madhahib al-Hukkam*; al-Shatibi's fatawa; al-Wansharisi's *al-Mi'yar al-Mu'rib*; al-Wazzani's *al-Mi'yar al-Jadid*; Ibn al-Salah's fatawa and *Adab al-Mufti*; al-Izz ibn Abd al-Salam; al-Nawawi's *Adab al-Fatwa*; al-Subki; al-Suyuti's *al-Hawi*; al-Haytami's *al-Fatawa al-Kubra al-Fiqhiyya*; al-Ramli; Zakariyya al-Ansari; Ibn Taymiyya's *Majmu' al-Fatawa*; Ibn Hamdan's *Sifat al-Fatwa*; *al-Durar al-Saniyya*; Al al-Shaykh; Ibn Baz; Ibn Uthaymin; Fatawa al-Lajna al-Da'ima; al-Qarafi's *al-Ihkam*; Dar al-Ifta al-Misriyya; Muhammad Abduh and Rashid Rida (*al-Manar*); Mahmud Shaltut; Mustafa al-Zarqa; al-Qaradawi's *Fatawa Mu'asira*; OIC and MWL fiqh academy resolutions; ECFR; MUI.

Several authors need the §1a check. The modern Hanbali and Wahhabi-era authors need care in how their school is verified before inclusion.

## 5 · The lane

- Lane name: `fatwa`.
- Scope: Sunni fatwa collections and individual fatwas, the explorer pages, and the index of listed fatwa websites.
- Files, after approval: `docs/agents/lanes/fatwa.md` (lane document), `docs/delegation/fatwa-progress.md` (progress file), `data/_stubs.d/fatwa.yaml` (stubs), a row in `docs/agents/lanes.md`, and a row in the "Parallel work" table of `docs/status.md`. The owner line is set by the founder.

## 6 · Files this proposal touches, and risk labels

| File | Intent | Label |
|---|---|---|
| `docs/plan/25-fatwa-explorer.md` (new) | This proposal | `non-impacting` |
| `docs/plan/00-README.md` | One row for plan 25 | `non-impacting` |
| `schema/enums/kinds.yaml` | Add `fatwa-collection` to `work`; `fatwa-event` to `event` | `non-impacting`; enum change, needs approval |
| `schema/enums/roles.yaml` | Add `mufti`, `qadi`, `shaykh-al-islam` | `non-impacting`; needs approval |
| `schema/enums/fiqh-areas.yaml` (new) | The `fiqh_area` tree | `non-impacting`; needs approval |
| `schema/predicates.yaml` | Add `relies_on`, `agrees_with`, `revised_by`, `codified_in` with inverses and labels | `non-impacting`; needs approval; affects the validator |
| `schema/work.schema.json`, `event.schema.json` | New fields for fatwa records | `non-impacting`; needs approval |
| `scripts/validate.ts` | Rules: a fatwa needs a mufti, a source and a date span; no typed honorific or Qur'an text; quote ≤ 40 words; ruler-role check | `non-impacting`; needs approval |
| `scripts/harvest/library/books.yaml`, `exclusions.yaml` | Add the `fatwa` category after the §1a check | `non-impacting`; canon change in its own commit |
| `scripts/harvest/library/fetch_books.py` | Accept `cat: fatwa` if it does not already | `non-impacting`; needs approval |
| `data/work/*`, `data/event/*`, `data/person/*`, `content/{ar,en,ur}/*` | Fatwa entities in batches of ≤ 25 | `non-impacting` inside the approved lane |
| `data/concept/fatwa.yaml`, `concept/ifta.yaml` | New concepts | `non-impacting` |
| `site/src/pages/[lang]/fatwa/*`, new components, i18n keys in `i18n/{ar,en,ur}.yaml` | Explorer pages and strings | `non-impacting` in content, but a new site route and new i18n keys need their own approval |
| `workers/site/src/route.js`, `workers/r2-sync/batch/publish.mjs`, `workers/site/wrangler.production.toml`, `.github/workflows/deploy.yml` | Add the fatwa data folder to the R2 lists | **`submission-impacting`**: the hosting architecture is quoted by the submissions. Needs the founder's explicit sign-off. |
| `docs/outreach/*` | Not touched | — |
| `docs/coverage.md` | Regenerated with `npm run coverage` in each entity commit | `non-impacting` |
| Licence files | Not touched; no new licence | — |

The publication of the explorer, the R2 change and any deploy are for the founder to decide. No agent runs `deploy.yml`.

## 7 · Acceptance tests

- The validator accepts the new kinds, fields and predicates, and rejects a fatwa with no source, no mufti, a typed honorific, typed Qur'an text, a quote over 40 words, or a ruler role other than `contemporary` without a citation.
- Every `relies_on` edge points to an existing work, passage or stub; `revised_by` has no cycles.
- Every individual fatwa has a mufti, a collection and page, a date object (a span is allowed), question and answer summaries in ar / en / ur, and at least one source.
- Explorer pages render with JavaScript off; the timeline, filters and chain degrade to lists.
- The landing page opens with the «What a fatwa is» section in ar / en / ur; every fatwa, mufti and collection page carries the notice and its link; every learn-more link was opened, returns 200 and has an archive snapshot; every attributed saying has a source and page.
- `npm run validate`, `npm test` and `npm run build` pass; `docs/coverage.md` is regenerated.
- A spot check of 10 random fatwas against the page images, recorded in the lane file.

## 8 · Order of work after approval

1. Approve this proposal. Approve the R2 and deploy-file changes separately, as `submission-impacting`.
2. Phase 1: discovery in the browser, the catalogue table, the §1a check for each book, and the `fatwa` category in `books.yaml`.
3. Phase 2: download, OCR with Apple Vision, and structure into `fatwas.jsonl` (kept in `$HARVEST`, never in git).
4. Phase 3: a pilot of 15 to 25 fatwas across all four schools and several eras. The claims table is shown to the founder first.
5. Phase 4: the explorer build, after the pilot has tested the design.
6. Phase 3b: the websites index, only after the terms and robots check and the founder's approval of any crawl beyond a handful of pages.

## 9 · Decisions for the founder

- Approve the four predicates in 2.3 and the enum and schema changes in section 6.
- Confirm `fatwa-collection` as a `work` kind, and that no new class is wanted.
- Approve the R2 and deploy-file change separately, as `submission-impacting`.
