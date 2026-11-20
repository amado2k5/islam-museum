# 64. Juha and Islamic Folklore Browser — requirements and acceptance spec

**Status:** accepted for production validation · **Lane:** `juha` · **Plan:** `docs/plan/72-juha-browser.md` · **Shipped:** `/[lang]/juha/`, `/api/v1/juha.json`

This document keeps the founder's original brief so that any agent can test the browser against it once it is in production.

## The founder's original brief (verbatim, 20 November 2026)

> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف
>
> where it should list all the mentioned and written جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف that are in quran, seerah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any future harvested book if it has a جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف and everything mentioned about جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
> make the changes in all the website languages
> make the browser/explorer for this have a unique UI that is relevant to its content, similar to how unique all the other browser/explorers are on the website
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd

**Clarifications (founder, same session):**

1. The full name of the browser is «متصفح جحا والفلكلور الاسلامي عبر العصور والكوميديا والنكت والطرائف والنوادر».
2. «and add to your research and criteria and material to find والنوادر» — the anecdote genre (nawadir) is part of the detector's vocabulary, the research criteria and the source list.
3. Books may be searched for online, downloaded, OCR'd with Apple Vision and mined into the museum.

## Requirements

- **JH-R1 — One browser, one graph.** `/[lang]/juha/` lists every humour record the graph knows, computed at build time; there is no side table. Every row is an ordinary museum record with sources and provenance.
- **JH-R2 — Detection.** `scripts/juha.ts` matches a guarded Arabic lexicon over passage `text`/`text_search` and returns signal names, not a boolean: `juha` («جحا» as a whole word, Nasreddin Hoca), `wits_named` (أشعب، نعيمان، سويبط، مزبّد، هبنّقة، أبو دلامة، أبو العيناء…), `wits_type` (ظريف/ظرفاء، مغفلين، حمقى، طفيلي، ماجن، بخلاء…), `nadira` (نوادر، طرفة/طرائف، مستطرف، أضحوكة، فكاهة…), `muzah` (مزاح، دعابة، هزل، ملاعبة…), `dahik` (ضحك، تبسّم، نواجذه، قهقهة…), `ethics` (لا يسخر قوم، ليضحك به القوم، لا أقول إلا حقا…). Guarded exclusions: the jurists' «نادر/نادرة», «النوادر والزيادات», «نوادر الأصول», «طرفة عين», the names «الضحاك» and «ابن مغفل», «ابن طرفة», the grammarians' «ظرف», and «أرجحا/رجحان».
- **JH-R3 — Sections.** Every item files under `curated`, `juha` (the passages of a Juha anecdote collection, `JUHA_WORKS`), `quran`, `sunnah`, `seerah` or `books`, classified from the passage's work, genre and unit — a book harvested later lands automatically in its section the day its passage records are in the graph, with no code change.
- **JH-R4 — Kind of humour.** `juha_kind` ∈ {`juha`, `wits`, `anecdote`, `jest`, `laughter`, `ethics`}, one per record, the most specific signal first; curated records carry it as a `juha-kind-<kind>` tag.
- **JH-R5 — Coverage of the brief.** Qur'an: the verses of laughter, smiling and the ban on mockery. Sunnah: the reports of the Prophet's jesting, laughter and smiling, the Companions' playfulness and the limits of the joke, harvested from the seven collections of the hadith-api editions (`scripts/harvest-juha-hadithapi.ts`). Seerah, Companions, Successors and the harvested books: 40-word cited excerpts from the OCR'd library (`scripts/harvest-juha-ocr.ts`). Juha: every anecdote of *Nawadir Juha al-Kubra* as its own passage record with its printed title, a retelling in the museum's own words, its page and number.
- **JH-R6 — Curated records and prose.** Juha, Nasreddin Hoca, the named wits, the anecdote books and the four genre concepts (`concept/al-muzah`, `concept/al-dahik`, `concept/al-nawadir`, `concept/al-zurafa-wa-al-mughaffalun`) carry the `juha-browser` tag. Each cites defined `source/` ids; the new prose is detailed, cited to the page, and carries provenance.
- **JH-R7 — Five languages.** The page, the landing card, the Explore menu, every interface string, and every new record's label, summary and prose ship in Arabic, English, Urdu, French and Spanish in the same change. Machine translations are marked as such.
- **JH-R8 — Unique UI.** The landing is a storyteller's gathering, unlike any other browser: the rider hero (Juha riding his donkey backwards), «مجلس الظرفاء» (medallion seats for the named figures), «من نوادر جحا» (a strip of speech-bubble anecdote cards), «ميزان الضحك» (stacked bars of humour kinds per section, with a table fallback) and «رف كتب النوادر» (the bookshelf of the anecdote books). Every list card is a speech bubble with a kind-coloured tail. Keyboard-reachable, readable without JavaScript, WCAG 2.2 AA.
- **JH-R9 — Discovery.** Landing explorer card with its own drawing, Explore menu entry in the texts group, `browser-registry` row (full-filter index), `docs/site/browsers.md` entry.
- **JH-R10 — API.** `/api/v1/juha.json` exposes each item with `section`, `juha_kind`, `signals`, work, ref, excerpt, themes, tags and edges; it is listed in `index.json`, OpenAPI `v1.json`, `llms.txt` and `docs/data/README.md`.
- **JH-R11 — Search.** Records are entity pages in Pagefind; the landing's title, lede and headings are indexed through `data-pagefind-body`.
- **JH-R12 — Text rules.** No honorific formula, no typed Qur'an text, no Arabic parenthesis without isolates, no excerpt over 40 words (55 for a hadith matn), nothing from or about a blocked organisation.
- **JH-R13 — Verification.** `npm run validate`, `npm test` and `npm run build` pass on `main`; `features-api.test.ts` covers detection, the exclusions, future-book inclusion, section and kind classification, and the API export.

## Acceptance tests (production)

1. Visit `/ar/juha/`, `/en/juha/`, `/ur/juha/`, `/fr/juha/`, `/es/juha/` — all render; the H1 is the full title in the page's language; the lede and section labels are localized.
2. The landing shows, in order: the rider drawing, the status line with the record count, the method note, the gathering of the wits (Juha first), the strip of Juha anecdotes, the scale of laughter with one bar per section, the bookshelf, then the sections with kind chips and a search box.
3. Disabling JavaScript leaves every list readable; the kind chips and the search box are an enhancement.
4. `GET /api/v1/juha.json` returns items with `section`, `juha_kind` and `signals`; `/api/v1/index.json` lists the file.
5. `passage/quran-27-19`, `passage/quran-53-43`, `passage/quran-11-71` and `passage/quran-49-11` appear in the Qur'an section (the last with kind `ethics`).
6. `passage/tirmidhi-api-1990` and `passage/tirmidhi-api-1992` (the jesting reports) and `passage/abudawud-api-4990` (the warning on lying to raise a laugh) appear in the Sunnah section.
7. The `juha` section lists the anecdotes of `work/nawadir-juha-al-kubra` (`passage/nawadir-juha-<n>`), each opening an entity page with the printed Arabic title, a retelling in the reader's language, the page number and an excerpt of at most 40 words.
8. `person/juha-abu-al-ghusn`, `person/nasreddin-hoca`, `person/ashab-ibn-jubayr`, `work/nawadir-juha-al-kubra`, `concept/al-muzah`, `concept/al-dahik`, `concept/al-nawadir` and `concept/al-zurafa-wa-al-mughaffalun` appear in the curated section, each with prose in five languages.
9. Adding a harvested-book passage whose text carries a humour signal increases its section on the next build with no code change (`features-api.test.ts`, "exports juha").
10. A passage that only says «طرفة عين», «النوادر والزيادات», «قال الضحاك بن مزاحم» or «عبد الله بن مغفل» does not appear.
11. The homepage shows the browser's card and the header's Explore menu lists it, in all five languages.
12. No record of the browser carries an honorific formula, typed Qur'an text or a plain Arabic-script parenthesis (`npm run validate`).

## Known limits on the day of shipping (20 November 2026)

- Everything is draft-tier machine work: OCR text is not corrected and not checked against page images; translations are machine translations no human has read.
- The book excerpts are chosen by vocabulary, so some carry the word without being funny; the kind chip says what was detected, not a judgement of the text.
- The Shama'il scans on the harvest drive are not yet matched to an edition record, so the Shama'il chapters on the Prophet's laughter and jesting are represented by the hadith collections only.
- Ibn al-Jawzi's *Akhbar al-Hamqa wa-l-Mughaffalin* (with its chapter on Juha) and *Akhbar al-Ziraf* have work records but no harvested text yet; they are the next books to download, OCR and mine for this browser.
