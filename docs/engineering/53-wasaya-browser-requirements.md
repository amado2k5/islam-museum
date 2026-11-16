# 53 · Testaments Browser — requirements and production checklist

_The feature requirements for «متصفح وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء
والصحابة قبل وفاتهم ومورثاتهم وأثرهم ومراقدهم» (the browser of the last testaments of the prophets,
messengers, the righteous, the imams, the Successors, the caliphs and the Companions before their
deaths, what they left behind, their relics and their graves, as the Qur'an, the Sunnah, the seerah,
the reports of the Companions and Successors and every harvested book carry them), as requested by the
founder and delivered in `docs/plan/61-wasaya-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`, `https://api.islam.museum`)
without reading the plan. Every requirement has an id (`WASAYA-R..`) and a "how to check" line._

## 0. The original request (verbatim, 16 November 2026)

> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> where it should list all the mentioned and written
>
> وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that
> were harvested and any future harvested book if it has a
>
> وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is
> done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> and everything mentioned about
>
> وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> وصايا الأنبياء والمرسلين والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم واثرهم ومراقدهم
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and
> add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and
> validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download any books, you
> can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online
> website that you can decide whether or not can be authentic and trusted as a source and get from it
> information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd

What the request fixes: the subject (testaments and parting counsels before death; what was left —
estates and inheritance; relics and traces; graves and resting places), the people (prophets and
messengers, the righteous, the imams, the Successors, the caliphs, the Companions), the corpora
(Qur'an, Sunnah and hadith, seerah, the reports of the Companions and Successors, every harvested
book, and every book harvested later), the frame (Sunni books), the surfaces (a landing-page box and
the navigation menus), the depth (full detailed prose), and this document.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| WASAYA-R01 | The browser has **no data of its own**: every item is an ordinary graph record (`passage`, `event`, `concept`, `object`, `place`, `building`, `work`) with sources and provenance | `GET /api/v1/wasaya.json`: every `items[].id` also resolves at `/api/v1/<class>/<slug>.json` |
| WASAYA-R02 | A record enters in one of three ways only: a Qur'an verse listed in the reviewed table `WASAYA_QURAN_REFS`; a non-Qur'an passage whose own text matches the guarded lexicon; or any record carrying the tag `wasaya-browser` | `scripts/wasaya.ts`; no schema, class, kind or predicate was added |
| WASAYA-R03 | **Future books enter with no code change**: a passage record from any book harvested later appears the day it lands, in the corpus section its work's genre decides (`sira` → seerah; `hadith` or a hadith unit → sunnah; else books) | add a passage with «لما حضرته الوفاة أوصى …» to a test graph: `scripts/features-api.test.ts`, test "exports wasaya" |
| WASAYA-R04 | Qur'an text is never searched by vocabulary and never typed: verses are listed by sura and aya, the page shows the frozen Tanzil text of the passage record | `WASAYA_QURAN_REFS`; no `﴿` in any prose file of the browser |
| WASAYA-R05 | The lexicon never fires on a bare common word: the trial of the grave, a bare «الميراث», «تركه», «الأثر», «عهد», «خصوصية» do not match | same test: `passage/muwatta-7772w` is absent |
| WASAYA-R06 | Five topics — `wasiyya` (testaments and counsels), `ihtidar` (last hours), `mirath` (estates and inheritance), `athar` (relics and traces), `marqad` (burials and graves) — carried by detected families on passages and `wasaya-<topic>` tags on curated records | `items[].topics` in the API; the five topic cards on the page |
| WASAYA-R07 | Twelve sections — four corpora (`quran`, `sunnah`, `seerah`, `books`) and eight curated (`prophets`, `caliphs`, `companions`, `successors`, `righteous`, `legacy`, `graves`, `works`) | `items[].section`; section chips on the page |
| WASAYA-R08 | Every curated record cites defined sources and carries provenance; AI-written prose says so | open any record: sources list, `provenance` block; the page's status line |
| WASAYA-R09 | No honorific is typed; no content about, from or sympathetic to a blocked organisation | `npm run validate` (`check-encoding`, `check-extremism`) |
| WASAYA-R10 | The identification of a grave is always attributed to the cited source, never stated in the museum's voice; where reports differ on a grave, a will or an estate, each version is attributed | read `graves` records and the caliphs' burial records (e.g. the record on the grave of 'Ali) |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| WASAYA-R11 | **Qur'an**: the testaments of Ibrahim and Ya'qub (2:132-133), Luqman's counsels (31:13-19), Ya'qub's counsel (12:67), Yusuf's last prayer (12:101), 'Isa's charge (19:31-33), the religion enjoined on the messengers (42:13; 4:131; 6:151-153), the bequest and its witnesses (2:180-182, 2:240, 5:106-108, 36:50), inheritance among the prophets and the shares (27:16, 19:5-6, 21:89, 4:7-12, 4:176), relics (2:248, 12:93-96, 2:125), death and burial (5:31, 80:21, 18:21, 9:84, 36:51-52, 34:14, 3:144, 110) | `section:"quran"` count = 88 verses on 16 November 2026; `passage/quran-2-133` and `passage/quran-31-13` present |
| WASAYA-R12 | **Sunnah**: the books of bequests of the hadith collections, the reports of the Prophet's last illness, counsels, death and burial, «لا نورث ما تركنا صدقة», the third («الثلث والثلث كثير»), and the Companions' testaments in the hadith books | `section:"sunnah"` > 0; a passage with `topics` containing `mirath` from Sahih al-Bukhari or Muslim is present |
| WASAYA-R13 | **Seerah**: passages from seerah books (Ibn Hisham, al-Waqidi, al-Bayhaqi's Dala'il, Zad al-Ma'ad, Subul al-Huda, al-Rawd al-Unuf) on the Farewell Pilgrimage, the last illness, the death, burial and belongings of the Prophet | `section:"seerah"` > 0; ids `passage/sira-ibn-hisham-wasaya-*` |
| WASAYA-R14 | **Harvested books**: passages mined from the OCR library (Ibn Sa'd, Hilyat al-Awliya', Sifat al-Safwa, Usd al-Ghaba, al-Isaba, al-Isti'ab, Hayat al-Sahaba, al-Tabari, Ibn Kathir, Ibn al-Athir, Ibn al-Jawzi, al-Baladhuri, al-Dhahabi, Ibn 'Asakir, al-Khatib, Ibn Khallikan, the Musannafs, Fath al-Bari, the Zuhd books, the Ihya', Ibn Kathir's and al-Qurtubi's commentaries, Qisas al-Anbiya') with the work, the scan page and a quotation of at most 40 words | items with ids `passage/*-wasaya-*` (1,108 on 16 November 2026); `scripts/harvest-wasaya-ocr.ts` |
| WASAYA-R15 | **Companions and Successors**: their testaments, deathbeds, estates and graves appear as records of their own in `companions` and `successors`, each with Arabic, English and Urdu prose | the sections list the records of plan 61 §6; each has three prose files |
| WASAYA-R16 | **Prophets and caliphs**: the testaments of the prophets from Adam on, the Prophet's parting counsels, estate, relics and burial chamber, and the covenants, counsels, last hours, estates and graves of the Rightly Guided Caliphs and later caliphs | `prophets`, `caliphs`, `legacy`, `graves` section counts > 0 |
| WASAYA-R17 | **Imams and the righteous**: the imams of the schools and later scholars and ascetics | `successors` and `righteous` sections |
| WASAYA-R18 | **Voice**: Sunni sources are the frame; Israelite reports are labelled as such; no ruling is given on visiting graves or seeking blessing through relics — the jurists' positions stay in their own records (`concept/ziyarat-al-qubur`, `concept/tabarruk`, `concept/grave-veneration`) | read those records and any `prophets` record |

## 3. The browser page `/{lang}/wasaya/`

| Id | Requirement | How to check |
|---|---|---|
| WASAYA-R21 | The page exists in Arabic, English and Urdu at `/ar/wasaya/`, `/en/wasaya/`, `/ur/wasaya/`, with the founder's Arabic title as the Arabic `h1` | open the three URLs |
| WASAYA-R22 | Header block (title, lede, status line, the five topics defined, the method note, the API link) is inside `data-pagefind-body`; the long lists are `data-pagefind-ignore` | view source; site search for «وصايا» finds the browser |
| WASAYA-R23 | The status line gives the record and section counts read from the graph at build time and says the texts were written by AI agents and not yet read by a human | the `wr-status` paragraph |
| WASAYA-R24 | Signature view "the five lines of the testament": a line per topic and a seal per section sized by count, each a link | `sig/WasayaLines.astro`; registered in `docs/site/signature-views.md` |
| WASAYA-R25 | A timeline of the dated curated records by century | `sig/WasayaTimeline.astro` |
| WASAYA-R26 | Every section lists its records as cards (label, work and reference for passages, topic chips, excerpt), curated sections first; long sections are paged | section chips and `PagedNav` |
| WASAYA-R27 | The whole list is readable with JavaScript off; the filter box narrows it when JavaScript is on, ignoring Arabic vowel marks | disable JS and reload; type «عمر» in the filter |
| WASAYA-R28 | A box on the landing page and an entry in the Explore menu (group "people") in the three languages | `/ar/`, header menu; `site/src/lib/nav.ts`, `Landing.astro`, `i18n/*.yaml` `explore.pages.wasaya` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| WASAYA-R31 | `GET https://api.islam.museum/api/v1/wasaya.json` returns `feature: "wasaya-browser"` and every item with `section`, `topics`, `work`, `ref`, text excerpt, `kind`, `date`, themes and edges | fetch it |
| WASAYA-R32 | The export is documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/wasaya.json`) and `llms.txt` | grep the three |
| WASAYA-R33 | The browser is registered in `docs/site/browsers.md` (register and API table), `docs/site/signature-views.md`, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`, `docs/status.md` | grep `wasaya` |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| WASAYA-R41 | No new class, kind, field or predicate (`non-impacting` under `docs/ai-change-gates.md` §3, apart from the growing record count) | `git diff main -- schema/` is empty |
| WASAYA-R42 | No PDF, OCR text or page image entered git; book excerpts are at most 40 words, cited | `git diff --stat main` lists only yaml, md, ts, astro, json |
| WASAYA-R43 | CANARY entry, coverage regenerated, harvest register updated for the mined books, scope decision filed in `docs/decisions/inbox/wasaya-browser-scope.yaml` | the files |
| WASAYA-R44 | Checks actually run before merge are named in the pull request, and those not run are named as not run | the PR description |

## 6. Production smoke test (run after the founder's deploy)

1. `curl -s https://api.islam.museum/api/v1/wasaya.json | jq '.feature, (.items|length)'` → `"wasaya-browser"` and a count ≥ the count in the PR description.
2. `jq '[.items[].section]|group_by(.)|map({(.[0]):length})|add'` → all twelve sections present with a count > 0 (a corpus section may be 0 only if its corpus truly has no passage).
3. `jq '[.items[]|select(.section=="quran")]|length'` → 88 (changes only when `WASAYA_QURAN_REFS` changes).
4. Open `/ar/wasaya/`, `/en/wasaya/`, `/ur/wasaya/`: title, five topic cards, the five-line view, the timeline, section chips, cards; each card opens its record.
5. With JavaScript disabled the lists are still present; with it enabled the filter narrows them.
6. The landing page shows the box; the Explore menu lists the browser under the people group.
7. Open three curated records (a prophet's testament, a caliph's, a Companion's): each has Arabic, English and Urdu prose, citations that resolve to source pages, no honorific, no typed Qur'an text.
8. Site search for «وصية أبي بكر» and for "testament" returns browser records.

## 7. Known limits

- The prose and the translations were written by AI agents from the cited sources and have not been
  read by a human; book excerpts are machine-read (Apple Vision OCR) and not corrected.
- Page anchors of OCR'd books are scan pages, not printed page numbers.
- The lexicon is conservative on graves (a named person's grave or a burial, never the bare word) and
  on inheritance (the estates of named people, not the jurists' general rules); passages it misses can
  be added with the `wasaya-browser` tag, and false positives removed through `WASAYA_EXCLUDE`.
- The scans of Ibn Sa'd and al-Tabari on the harvest drive are partial, so their reports are mostly cited
  through later historians (plan 61 §8).
- Siyar A'lam al-Nubala' and Tadhkirat al-Huffaz are on the harvest drive but have no `work/` record
  yet, so their passages were not mined; one line in `scripts/harvest-wasaya-ocr.ts` adds them once the
  work records exist.
- Stories the writers could not find on a source page were left out, not written from memory; they are
  listed in `docs/plan/61-wasaya-browser.md` §8.
