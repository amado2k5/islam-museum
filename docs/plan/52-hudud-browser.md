# Plan 51 — Hudud Allah and Kaba'ir Browser (متصفح حدود الله والكبائر)

_Requested by the founder: "start working on متصفح حدود الله والكبائر where it
should list all the mentioned and written حدود الله والكبائر that are in quran,
seerah, sunna, tabi3een stories, quotes, mentioned and written in books that
were harvested and any future harvested book if it has a حدود الله والكبائر
should be viewable here. add a box for it on landing page and in navigation
menus. make sure this is done end to end and full detailed proses and make it
ready for production at the end of this. this is only about حدود الله والكبائر
and everything mentioned about حدود الله والكبائر anywhere in any of the sunni
books or quran or sunna or sera. find all the instances where حدود الله
والكبائر were mentioned or part of quotes from quran, sunnah, Hadith, seerah
or from sa7aba and tabi3een and add those stories, mentions, quotes, details.
also add this in engineering documents as the original requirements to allow
AI later on to test and validate it when it is in production."_

## 1. What it is

A browser over the one graph that gathers every mention of «حدود الله» — the
limits God set for His rulings, among them the prescribed penalties the
jurists call hudud — and «الكبائر», the major sins: the «تلك حدود الله»
verses, the hudud of fornication, theft, slander, wine, apostasy and
brigandage in the hadith collections, the «اجتنبوا السبع الموبقات» lists,
the carrying out of penalties in the seerah and the reports of the
Companions and Successors, the mentions of every harvested book, and
whatever a future harvest brings — plus the curated records on the limits,
the penalties and the great sins themselves. It follows the Sayyi'at
Browser architecture: passages are ordinary graph nodes found at build
time by a shared detector; curated records carry the `hudud-browser` tag;
there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/hudud.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum
metadata. A hudud or kaba'ir mention in a book harvested next month
appears here the day its passage record lands — the founder's "any future
harvested book" requirement, met by the detector rather than by tagging.

## 2. Scope — what counts as a mention

In scope, two themes:

- **«حدود الله»**: the phrase itself in every inflection («تلك حدود الله»،
  «ومن يتعد حدود الله»، «حدود ما أنزل الله»), «حدوده» "His limits" with the
  pronoun, establishing the hadd («أقام الحد»، «إقامة الحد»), and the fixed
  penalties — stoning «رجم», flogging in its punishment forms («فاجلدوا»،
  «جلدة»)، the amputated hand («فاقطعوا أيديهما»), the discretionary
  «تعزير».
- **«الكبائر»**: «كبائر»/«الكبائر» unambiguous, the «موبقات» destroyers
  of the hadith lists.

**Weak signals** count only beside a strong one — or two distinct weak
signals together (the fiqh phrasing «حد الزنا الجلد»): the ungated
«حدود»/«الحد» forms (borders and definitions in other registers), bare
«جلد» (also "skin"), the hadd crimes (الزنا، السرقة، القذف، الخمر، الردة،
الحرابة), the hudud-adjacent «قصاص», and the ambiguous «كبيرة» and
«إثما كبيرا».

**Excluded by id** (`HUDUD_EXCLUDE`): «رجماً بالغيب» (guessing, 18:22),
the hands the women of Yusuf cut by accident (12:31, 12:50), the snake
"thrown" into the vessel (قذف) of `tathbit-j2-102`, and the mu'allaqa's
«تجلد» "endure". Structural FPs are excluded by pattern instead: «ترجمة»
(biography) can never reach «رجم»، «انقطع» (broke) is not «قطع»، and
«تعزّره» (to honour him, 48:9) is not «تعزير». Pharaoh's amputation
threats (7:124, 20:71, 26:49) are kept: they carry the penalty vocabulary
of the revelation — a recorded judgment call, not a lexical accident.

## 3. Records

- **48 detected passages** in the build of 11 Nov 2026: 21 Qur'an ayahs
  («حدود الله» ×8 incl. 9:97, «حدوده» 4:14, the penalties 24:2/24:4/5:33/
  5:38, the kaba'ir verses 4:31/42:37/53:32, stoning threats
  26:116, Pharaoh's amputations 7:124/20:71/26:49, 60:12) + 27 sunnah and
  book passages (Muslim 57/89/90/94, Bukhari via API copies, Muwatta 1527/
  1532, Abu Dawud 4458, Nasa'i 3361, Tirmidhi 214/2625/3534, Ibn Majah
  1086, Riyad al-Salihin 1614/1714, Bulugh 465, Mishkat 99/584, the usul
  works' «يجب عليه الرجم إذا زنى» examples, Itqan on آية الرجم, Mawahib,
  Minhaj al-Sunna's كتاب الحدود heading).
- **9 curated records tagged in place**: the new umbrella
  `concept/hudud-allah-wal-kabair` (trilingual prose, draft-tier) plus
  `concept/hudud-allah`, `hudud-penalties`, `al-kaba-ir`, `kaba-ir`,
  `al-rajm`, `tazir-discretionary-punishment`, `zina`, `ihsan-hudud`.
- **`mentions → concept/hudud-allah-wal-kabair` edges** on all detected
  passages, each citing the passage's own first source, written by
  `scripts/harvest-hudud-edges.ts`.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في
سائر الكتب · `curated` السجلات المنتقاة — derived from each passage's work
(`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`hudud-browser` tag on curated records. Each passage is marked
`hudud` or `kabair` by its signals (hudud wins when both fire).

## 5. Pages

- `/[lang]/hudud/` — the home: lede, status count, method note, API link,
  section chips with counts, a client-side filter over trilingual labels,
  summaries, work names and text excerpts, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 6. Surface

- `scripts/hudud.ts` — the shared detector + corpus classifier + section
  tag reader (used by `scripts/export-api.ts`, `site/src/lib/hudud.ts`
  and `scripts/harvest-hudud-edges.ts`).
- `scripts/harvest-hudud-edges.ts` — writes the `mentions → umbrella`
  edges (idempotent; `--write` to apply).
- `site/src/lib/hudud.ts`, `site/src/lib/nav.ts` (`hudud` key,
  `ready: true`), `site/src/pages/[lang]/hudud/index.astro`,
  `site/src/scripts/hudud-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.hudud` + `hudud:` block in the same commit),
  `/api/v1/hudud.json` via `FEATURE_EXPORTS`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages` (scale-of-justice
  SVG). Register rows in `docs/site/browsers.md`, plan index,
  `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`hudud` lane),
  `docs/status.md`, `CANARY.md`.
- `docs/engineering/40-hudud-browser-requirements.md` — the requirements
  and production checklist for later validation (`HUD-R..`).

## 7. Status

Built 11 Nov 2026: 48 detected passages + 9 curated records, the
`/[lang]/hudud/` page in three languages, the landing card and Explore
menu entry, `/api/v1/hudud.json`, full API docs. New records are
draft-tier until a human reads them; nothing goes live until the founder
deploys. Future enrichment waves: seerah passages as sira-genre works are
harvested, fiqh chapters of the harvested books (Hidaya, Umda, Zad
al-Mustaqni') as their passages arrive, deeper Companion/Tabi'in
penalty-story mining, and the `HUD-R..` production checklist.
