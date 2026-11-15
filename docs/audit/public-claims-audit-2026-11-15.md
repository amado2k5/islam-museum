# Public claims audit, 15 November 2026: ledger

What the museum's own records support being said about it in public, set against a draft award entry and against the
repository's public documents. Written on the founder's instruction of 15 November 2026 (in chat): document the
findings in the repository, and have every agent keep its public statements honest, true and current, check these
findings, and check again after whatever changes next. The standing rule is in `AGENTS.md` ("Truth in every public
claim"). This ledger is where that rule is kept up to date.

Auditor: Claude (model `claude-fable-5-2`), in a Claude app session at the founder's request. It is one agent's
reading. Section 6 says what it could not check, and section 7 records a correction the auditor had to make to its
own first pass.

## How to use this ledger

- **Before you write or edit anything public** (an award entry, a dossier, a letter, a post, a film script, the
  README, `HOW_IT_WAS_BUILT.md`, the site's About, Method, Support, Press or Backstage text): read section 4, re-run
  the script, and use today's figures with their date.
- **Check the findings yourself.** Run `python3 scripts/report/claims_audit.py`, open the evidence paths, and where a
  row here is wrong, correct it in place with the evidence and add a dated line to section 8.
- **After a change that moves a figure or a claim listed here** (new records, a promotion of review states, a new
  language for a feature, a cost, a shop, a submission): re-run the script, update sections 1 and 4, and move the
  affected rows between "open" and "closed", in the same pull request as the change.
- **Do not fix what is outside your task.** Rows in sections 2 and 3 are reports. The files they name are changed by
  their owners under `docs/ai-change-gates.md` sections 1 to 3; the outreach files in its no-go registry were read for
  this audit and not edited.

Status words used below: **CONTRADICTED** (the record says otherwise), **OVERSTATED**, **UNDERSTATED**, **STALE** (true
once, not on the audit date), **UNVERIFIED** (the auditor could not find the evidence; it may exist), **SUPPORTED**.

## 1. The measured state

Measured at `8d478cd72 2026-11-15` by `python3 scripts/report/claims_audit.py`. Counts are pattern matches over `data/`.

| Measure | Count | Share |
|---|---|---|
| Record files under `data/` (content + source) | 63,629 | |
| Source (bibliography) records | 9,469 | 14.9% of all |
| ... of type book, chapter, manuscript or thesis | 744 | 7.9% of sources |
| ... Wikipedia or Wikidata pages | 7,030 | 74.2% of sources |
| Content records (everything but sources) | 54,160 | |
| Content records in review state `draft` | 44,276 | 81.8% |
| Content records in review state `published` | 9,882 | 18.2% |
| Content records in any other review state, or none | 2 | 0.0% |
| Content records whose `generated_by` is AI-named | 47,781 | 88.2% |
| Content records whose `generated_by` is script-made | 6,377 | 11.8% |
| Content records whose `generated_by` is no tag | 2 | 0.0% |
| `published` content records whose `generated_by` is AI-named | 9,882 | 100.0% of published |
| Grounding: cites at least one book source | 29,574 | 54.6% |
| Grounding: preliminary card (sources not yet checked on the page) | 11,264 | 20.8% |
| Grounding: other sources only (text editions online, datasets, websites, catalogues) | 9,104 | 16.8% |
| Grounding: Wikipedia or Wikidata only | 4,196 | 7.7% |
| Grounding: no source record cited | 22 | 0.0% |
| Grand Tour stops (`tour/grand-tour.yaml`) | 40 | |
| Grand Tour languages (`TOUR_LANGS`) | ar, en | |
| Education Explorer: subject courses / lessons | 65 / 361 | |

| Content records by class | Count |
|---|---|
| passage | 16,908 |
| person | 11,642 |
| building | 5,793 |
| event | 5,556 |
| place | 3,958 |
| concept | 3,764 |
| work | 2,400 |
| media | 723 |
| course | 645 |
| object | 546 |
| group | 501 |
| question | 320 |
| screen | 315 |
| exhibit | 312 |
| polity | 233 |
| listing | 172 |
| invention | 117 |
| practice | 100 |
| journey | 50 |
| award | 33 |
| job | 28 |
| dataset | 16 |
| language | 15 |
| period | 13 |

| Most-cited source records | Type | Content records citing it |
|---|---|---|
| `source/wikidata` | webpage (wiki) | 8,586 |
| `source/tarikh-islam-hasan-ibrahim` | book | 6,872 |
| `source/tanzil-quran` | webpage | 6,627 |
| `source/tanzil-translations` | webpage | 6,231 |
| `source/al-aalam` | book | 3,750 |
| `source/hadith-api-fawazahmed0` | web | 2,988 |
| `source/muwatta-maruf-1997` | book | 2,977 |
| `source/tarikh-khulafa-minhaj-1434` | book | 2,229 |
| `source/shadharat-dhahab` | book | 1,689 |
| `source/futuh-buldan-maarif-1407` | book | 1,572 |
| `source/fiqh-mawsua-kuwaitiyya-noor-v3` | book | 1,537 |
| `source/encyclopaedia-of-islam-2` | book | 1,481 |
| `source/sahih-al-bukhari` | book | 1,211 |
| `source/dawlat-uthmaniyya-salabi` | book | 1,086 |
| `source/sicill-i-osmani` | book | 1,077 |

Read from the live site on 15 November 2026 (about 09:30 Toronto time), as page text, with scripts not run:

| Measure | Value | Read from |
|---|---|---|
| Records with a page of their own, drafts included, stubs excluded | 63,078 | `https://api.islam.museum/api/v1/meta/counts.json` (`entities`) |
| Record pages printed on the Arabic homepage | 194,832 | `https://islam.museum/` (definition: `site/src/lib/numbers.ts`, records and stubs times three languages) |
| Zenodo deposit | version `v2026.11.15`, one archive of 451.4 MB, licence CC0 on the record | `https://doi.org/10.5281/zenodo.23692511` |
| Gift shop | a live Shopify storefront with eight collections and no products | `https://islam-museum.myshopify.com/` (`SHOP` in `site/src/lib/links.ts`) |
| `/ur/grand-tour/` | does not load | consistent with `TOUR_LANGS` above |

Prose files on the measured tree: 32,839 Arabic, 32,643 English, 32,629 Urdu (`content/<lang>/`).

Three things in that table matter for every public sentence:

1. **AI wrote the records.** 88.2% of content records carry a `generated_by` that names an AI agent or model; the
   other 11.8% name a script (the Qur'an text loaded from Tanzil is the bulk of them). Every one of the 9,882 content
   records in review state `published` names an AI agent. No field on a record says that a human read took place; the
   only field about it is `status.ai_unread`, set on 16 records.
2. **Four content records in five are drafts**, and the site says so on the page (`status.draft_note` in
   `i18n/en.yaml`).
3. **One content record in five is a preliminary card.** 11,264 records state in their own text that their sources
   are not yet checked on the page. 11,215 of them came from the Wikidata import runs, and they cite a general work
   as a placeholder (`source/tarikh-islam-hasan-ibrahim` on 6,769 of them, `source/al-aalam` on 2,950).
   The UNESCO dossier already says of these cards that a citation which does not support the record is a placeholder,
   not a source (`docs/outreach/unesco-nomination-dossier.md` A.5, which counts about 6,840 for the import waves of
   19 to 21 October and marks the question open for the founder's decision).

## 2. The draft award entry

The founder asked for a review of his draft entry to the Museums + Heritage Awards 2027 (Best Digital Experience –
Global; editable on the awards portal until 29 January 2027). The draft is not in this repository; its claims are
summarised here so the corrections are on record. The fuller review, with replacement text, went to the founder
directly.

| # | The draft said | Status | What the record shows | Evidence |
|---|---|---|---|---|
| 1 | AI is used at two mechanical stages only (OCR and assisted extraction), never to create content; the graph was harvested by the founder personally | **CONTRADICTED** | AI agents research, draft, translate and check the records; the founder writes the rules, rules on doubtful cases, merges and deploys | Section 1; `HOW_IT_WAS_BUILT.md`; `i18n/en.yaml` `support.why_body`, `disclaimer.gathering_2`, `status.draft_note`; `docs/verification/README.md` |
| 2 | Every fact carries a citation to a verified published book, taken from scans in open repositories | **CONTRADICTED** | 54.6% of content records cite at least one book source; 20.8% are preliminary cards; 16.8% rest on other sources (the Tanzil text, a hadith API, datasets, websites, catalogues); 7.7% on Wikipedia or Wikidata alone. 74.2% of source records are Wikipedia or Wikidata pages. `AGENTS.md` itself admits Wikipedia and Wikidata as sources for entity facts | Section 1; `i18n/en.yaml` `disclaimer.gathering_1`; `AGENTS.md` (Sources) |
| 3 | 58,128 sourced entries across some 116,000 pages | **STALE**, and "sourced" is **OVERSTATED** | 58,128 was the build of 12 November. The live figure on 15 November is 63,078. On the measured tree the same count holds 9,469 source records and 11,264 preliminary cards. Page counts in use: 194,832 record pages (homepage), 202,253 pages built (review of 12 to 13 November) | Section 1; `docs/engineering/45-build-deploy-review.md` section 2; `site/src/lib/numbers.ts` |
| 4 | Complete English and Urdu editions | **OVERSTATED** | Prose exists in all three languages in near-equal file counts, but the Grand Tour, the entry's flagship, is built for Arabic and English only | `site/src/lib/grand-tour.ts` (`TOUR_LANGS`); `docs/fable-run/PROGRESS.md` (rules of the run) |
| 5 | "Eleven weeks into its first year" | **CONTRADICTED** by the calendar | From 11 October 2026: 5.0 weeks on 15 November, 7.1 on 30 November (early deadline), 15.7 on 29 January 2027 (final deadline) | Date arithmetic |
| 6 | A full rebuild was cut from over three hours to under one, so the museum can be republished daily | **OVERSTATED** | Page rendering fell from 3 h 6 min to 43 min; the whole build from about 3 h 34 min to 1 h 22 min. The comparison was production on the old code against UAT on the new code. Production deploys are manual and the founder's alone; no workflow runs on a schedule | `docs/engineering/45-build-deploy-review.md` sections 1 and 2; `.github/workflows/deploy.yml` |
| 7 | Entire cash spend to date roughly CA$1,700 to 2,700 | **UNDERSTATED** against the site | The Support page gives running costs of roughly CA$1,900 in one recent month, about CA$900 of it AI assistants, with about CA$730 of overages in October and early November on top | `i18n/en.yaml` `support.why_body`. The true total is the founder's to state |
| 8 | Sells nothing; income none, by design | **OVERSTATED** | The landing page carries a gift-shop carousel linking to a live storefront. It lists no products. The storefront says purchases support "the Islam Museum Foundation"; the UNESCO dossier states that no legal entity is claimed | `site/src/components/GiftShop.astro`; `site/src/lib/links.ts`; section 1; `docs/outreach/unesco-nomination-dossier.md` (line beginning "What the dossier deliberately does not claim") |
| 9 | The collection is compiled from public-domain and openly held sources | **CONTRADICTED** | Any source may be read, copyrighted or not, and rewritten in the museum's own words with a citation | `docs/sources-policy.md`; `AGENTS.md` (Licences) |
| 10 | Where no image can be licensed the museum generates a visualisation from its own knowledge graph | **OVERSTATED** in wording | The site's own label is "AI-generated illustration" | `i18n/en.yaml` `art.badge`, `art.disclaimer` |
| 11 | H-Net distributed the announcement to H-Mideast-Medieval subscribers | **UNVERIFIED** | The register shows the three H-Net submissions waiting for review on 13 November | `docs/outreach/marketing-and-outreach-register-2026.md` |
| 12 | Tranco rank 1,179,447 on 14 November | **UNVERIFIED** | The log in the repository ends at 1,259,190 for the list of 13 November. Tranco was not queried for this audit | `docs/status.md` |
| 13 | A school founder used the lessons with his students; a youth league confirmed interest; universities "from Dublin to Seiyun" replied with plans | **UNVERIFIED** | None of these replies is in the register as read on 15 November. They may sit in correspondence that is not in git | `docs/outreach/marketing-and-outreach-register-2026.md` |
| 14 | Lesson sections cite the underlying records page by page | **UNVERIFIED** | Course units carry the official expectation codes; the page-by-page claim was not checked | `data/course/` |
| 15 | The museum began as an idea in August 2025 | **UNVERIFIED** | The UNESCO dossier dates the prototype to September 2025. The two can both be true; say them the same way everywhere | `docs/outreach/unesco-nomination-dossier.md` |

**SUPPORTED** in the draft, and safe to repeat with a date: 40 Grand Tour stops across fourteen centuries and nine
wings; every tour room reachable with JavaScript off (`docs/fable-run/NUMBERS.md`, 40 of 40 in Arabic and in English,
measured on the branch on 11 November); the completion room; 65 Ontario courses and 361 lessons, labelled as drafts;
the Kids' Wing with Hudhud; 300 guided pathways (drafted trails); data CC0, prose CC BY-SA 4.0, code MIT; a public
static API; the Zenodo DOI; the OMNI Television segment of 30 October; the Digital Public Goods application under
review; Library and Archives Canada's acceptance of 4 November; no accounts, advertising, cookies or tracking (no
analytics or advertising code was found in `site/src`, `site/public/shell` or `workers`).

**Understated** in the draft: the accessibility work (WCAG 2.2 AA baseline, a public statement in three languages
marked self-assessed and partially conformant, a Lighthouse accessibility score of 100 enforced on sampled pages in
`validate.yml`, alt text on the gallery illustrations: `docs/plan/23-accessibility.md`, `lighthouserc.json`).

## 3. Open items in the repository's own public text

Found while checking the draft. None is fixed by this audit.

| # | Where | What does not match | Status |
|---|---|---|---|
| R1 | `docs/ai-change-gates.md` section 6, first bullet | Says AI output enters as `published` and no review gates publication. `AGENTS.md` and `docs/agents/publication-standard.md` (founder ruling, 8 November 2026) say it enters as `draft` until a human read. Two binding documents disagree | Open |
| R2 | `status.review: published` across `data/` | The publication standard defines `published` as content a human has read. All 9,882 published content records name an AI agent in `generated_by`, and no field records a human read. Until one does, no public text may say or imply that published records were reviewed by a person | Open |
| R3 | `HOW_IT_WAS_BUILT.md` | "47,000+ sourced records, ~89,000 pages", "23 days", "Toronto": true on the day it was written, stale now, and "sourced" has the caveat of section 1, point 3 | Open |
| R4 | `docs/verification/README.md` | "58,128 sourced entries ... live count": the live count has moved, and the same caveat applies | Open |
| R5 | `README.md`; `i18n/en.yaml` `foundation.purpose_3` | Say a gift shop is planned and that until it opens there is no shop, while the landing page links to a live storefront | Open |
| R6 | The storefront's wording | Names "the Islam Museum Foundation" as the beneficiary; the UNESCO dossier says the museum claims no legal entity | Open, founder's decision |
| R7 | Preliminary cards | 11,264 on the measured tree against about 6,840 recorded for 19 to 21 October in the UNESCO dossier (A.5), still marked open there. Any "every record cites its sources" sentence needs this caveat until the cards are sourced, flagged out of the count or removed | Open, founder's decision |
| R8 | The Grand Tour | No Urdu edition, while `AGENTS.md` asks for Arabic, English and Urdu on every new page. The run that built it was told not to build Urdu (`docs/fable-run/PROGRESS.md`) | Open |
| R9 | Search | The canon-first test found the canon record first for 2 of 50 fixed queries on production on 11 November; on 12 November "Muhammad" still returned an object first. Not re-measured for this audit | Open (`docs/fable-run/VERIFICATION.md`, `docs/verification/README.md`) |
| R10 | Footer pages | "Museum Trustees" says the names will be published as the board is formed. A reader of a one-person project meets a board page with no board | Open, founder's decision |

## 4. What is true to say today

The reference for any public text. "Today" is 15 November 2026 on the tree named in section 1; re-read each source
before you reuse a line.

| Topic | True to say | Re-read from |
|---|---|---|
| Who built it | One person, the founder, directing AI agents under written rules. He sets the rules, rules on doubtful cases, merges and deploys | `HOW_IT_WAS_BUILT.md`, `AGENTS.md` |
| What AI does | Research, drafting, translation and cross-checking of records at build time; illustrations, labelled as AI-generated; films and narration. Nothing on the published site calls a model | `i18n/en.yaml` `support.why_body`, `disclaimer.gathering_2`; ADR 0002 |
| Sources | Published books, the Qur'an text from Tanzil, hadith collections, museum and library catalogues, Wikipedia and Wikidata for entity facts, and registered websites. Every record names source records; about one content record in five is a preliminary card whose sources are not yet checked | Section 1; `i18n/en.yaml` `disclaimer.gathering_1` |
| Review | About four content records in five are drafts, labelled on the page as written with AI help and not yet read by a human editor. The corpus is not human-reviewed, and the UNESCO dossier already declines to claim that it is | Section 1; `docs/outreach/unesco-nomination-dossier.md` |
| Scale | The live `entities` figure with its date, and what it includes: source records, drafts and preliminary cards | `/api/v1/meta/counts.json`; this script |
| Languages | Arabic first, with English and Urdu prose. The Grand Tour is in Arabic and English | `content/`, `site/src/lib/grand-tour.ts` |
| Cost and income | The founder's own totals to date. The Support page's monthly figures are the public reference. No grant or sponsorship is recorded. Donations are invited. A storefront exists with no products | `i18n/en.yaml` `support.why_body`; the founder |
| Licences and preservation | Data CC0, prose CC BY-SA 4.0, code MIT; a Zenodo DOI; Library and Archives Canada has taken the site into its preservation scope and proposed a test crawl | `LICENSE-CONTENT.md`; `docs/outreach/marketing-and-outreach-register-2026.md` |
| Accessibility | Built to a WCAG 2.2 AA baseline, self-assessed and partially conformant, with a public statement | `docs/plan/23-accessibility.md` |
| Outcomes | What the outreach register records, with dates. There is no user study and no measured classroom use on record | `docs/outreach/marketing-and-outreach-register-2026.md` |

## 5. Gates for this change

The audit environment had no installed dependencies and no package registry access, so `npm run validate`,
`npm test` and `npm run build` were **not run** locally. The pull request relies on the Validate workflow. This is
written here because a check that was not run is not reported as passed.

## 6. What this audit could not check

- Counts are pattern matches over the YAML, not a parse of the graph. They agree with the site's own figures to within
  the difference between a clone made at 10:05 and a deploy made earlier.
- The live site was read as page text. Its scripts, search and maps were not run, and its pages were not seen rendered,
  except through the screenshots committed on 11 November under `docs/fable-run/vision/shots/`.
- The Tranco ranks, the H-Net publication, the educators' replies, the founder's spend and hours, and the awards
  portal's word limits were not verified.
- The draft entry's text is on the awards portal, not in git. Section 2 summarises it from the copy the founder
  supplied on 15 November.

## 7. The auditor's own correction

The first pass of this audit, given to the founder earlier the same day, said that about three content records in
four cite at least one book. That count treated the placeholder citations on preliminary cards as book citations.
The corrected figure is 54.6%, with 20.8% preliminary cards, as in section 1. The first pass also wrote "most records
are still drafts" without saying that the published records are AI-written too and are not shown to be human-read
(row R2). Both corrections were sent to the founder. They are recorded here because the rule binds the auditor as
much as anyone.

## 8. Change log

Append a dated line for every re-run, correction or closed row. Never rewrite an earlier line.

- 2026-11-15: first edition, measured at `8d478cd72` (Claude, `claude-fable-5-2`, at the founder's request).
