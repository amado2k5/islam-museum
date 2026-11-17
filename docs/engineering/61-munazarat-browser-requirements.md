# 61. Munazarat Browser — requirements and acceptance spec

**Status:** accepted for production validation · **Lane:** `munazarat` · **Plan:** `docs/plan/69-munazarat-browser.md` · **Shipped:** `/[lang]/munazarat/`, `/api/v1/munazarat.json`, `sig/MunazaratFloor.astro`

## The founder's original brief (verbatim)

> متصفح المناظرات بين الاسلام والأديان الأخرى ال حجة بالحجة والدليل بالدليل والتاريخ بالتاريخ والكلمة بالكلمة
>
> where it should list all the mentioned and written المناظرات between Islam and the other religions that are in quran, see rah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any future harvested book if it has a المناظرات should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> find all the instances where المناظرات were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details.
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> Use microsd instead of Mac main drive; get latest from main, clone the repo to a separate folder; use browser/web sources, downloaded books, OCR or other trusted sources to fully enrich detailed proses; when context is tight commit and push and continue; in the end commit, push, raise PR and merge it; then delete all files and folders related to this work from the microsd.

**Clarification (founder):** the browser covers both **interfaith debates** (Islam vs other religions) and **intra-Muslim debates** (inside the ummah), with **full detailed prose**, and a **unique UI** at the level of the other browser/explorer pages.

## Requirements

- **MZ-R1 — One browser, one graph.** `/[lang]/munazarat/` lists every debate/disputation record the graph knows, computed at build time; no side table.
- **MZ-R2 — Detection.** `scripts/munazarat.ts` matches a guarded Arabic lexicon over passage `text`/`text_search`: مناظرة nouns (مناظر/مناظرة/المناظرات), مُناظَر verbs (ناظر/ناظره/ناظروا/ناظرنا), the جدال family (جدال/يجادل/جادلهم/محاججة/حجاج/احتجاج/تنازع/خصومة), and المباهلة/المتلاعنة anchors (باهل/مباهلة/نبتهل); guarded exclusions for لعان/ملاعنة (li'an oath without debate context), حَجّ pilgrimage and حِجّ braid senses. Signals are returned, not just a boolean.
- **MZ-R3 — Corpus sections.** Every item files under `quran`, `sunnah`, `seerah`, `books` or `curated`, classified from the passage's work genre/unit — a book harvested later lands automatically in `books`.
- **MZ-R4 — Kind and opponent.** `munazarat_kind` ∈ {debate, mention}; `opponent` ∈ {scriptuaries, polytheists, intra, other} from opponent lexicon (يهود/نصارى/أهل الكتاب/مجوس/صابئون → scriptuaries; مشرك/وثن/قريش/مكة → polytheists; خوارج/معتزلة/مرجئة/قدرية/جهمية/روافض/باب الأعج/علماء/فقهاء → intra) plus curated `munazarat-<opponent>` tags.
- **MZ-R5 — Curated records.** Named debates and debate-related records carry the `munazarat-browser` tag and join the `curated` section. Each new record cites defined `source/` IDs and ships Arabic first with English and Urdu translations in the same commit, each with a `provenance` block.
- **MZ-R6 — Trilingual.** The page, the landing card, the Explore menu and every i18n string ship in ar/en/ur.
- **MZ-R7 — Unique UI.** A browser-specific signature view: `sig/MunazaratFloor.astro` («حلبة المناظرة», "the debate floor") — a three-column flow opponent → kind → corpus, keyboard-reachable, reduced-motion safe, caption-labelled, and no-JS-readable fallback stays on the page.
- **MZ-R8 — Discovery.** Landing explorer card, Explore menu entry, `browser-registry` row, `docs/site/browsers.md` entry.
- **MZ-R9 — API.** `/api/v1/munazarat.json` exposes each item with `section`, `munazarat_kind`, `opponent`, `signals`, work, ref, excerpt, themes, tags and edges; indexed in `index.json`, OpenAPI `v1.json`, `llms.txt`, `docs/data/README.md`.
- **MZ-R10 — Every card links its ordinary entity page** (`/passage/<slug>/`, `/event/<slug>/`, `/concept/<slug>/`); the browser never becomes a dead end.
- **MZ-R11 — Verification.** `npm run validate && npm test && npm run build` pass on the branch; `features-api.test.ts` covers detection, exclusions, future-book inclusion, corpus/kind/opponent classification and the API export.

## Acceptance tests (production)

1. Visit `/ar/munazarat/`, `/en/munazarat/`, `/ur/munazarat/` — all render, lede and section labels localized.
2. The page shows the debate-floor signature view and the filter box; disabling JS leaves the full list readable.
3. `GET /api/v1/munazarat.json` returns items with `section`, `munazarat_kind`, `opponent`, `signals`; `index.json` lists it.
4. The curated events — `mubahala-of-najran`, `ibn-abbas-khawarij-debate`, `jafar-debate-at-najashi-court`, `umar-ii-debate-with-kharijites`, `delegation-of-najran`, `arbitration-of-siffin`, `mihna-of-the-quran`, `khatib-tripoli-munazara-447`, `yahya-zubayri-mubahala`, `ibn-al-mulaqqin-mihna-780`, `mihnat-ghulam-khalil` — all appear in the curated section.
5. Adding a harvested-book passage whose text carries a debate signal increases the books section on the next build with no code change.
6. A passage containing «حجّ البيت» or «ملاعنة الزوجين» alone does not appear.
