# Plan 57 — Medicine Browser (متصفح الطب النبوي والطب والتشريح والجراحة والدواء والتداوي في الإسلام)

_Requested by the founder on 14 November 2026; built the same day. Lane `tibb`
(`docs/agents/lanes/tibb.md`). Acceptance spec and the founder's original request:
[`docs/engineering/47-tibb-browser-requirements.md`](../engineering/47-tibb-browser-requirements.md)._

## 1. What it is

A front door over the one graph that lists everything the museum's sources say and
write about six subjects, the six of its title and nothing else:

| Topic id | Arabic | What it gathers |
|---|---|---|
| `nabawi` | الطب النبوي | the remedies and treatments reported from the Prophet: cupping, cautery, ruqya over the sick, honey, black seed, costus, senna, talbina, truffles, 'ajwa dates, camel milk, ithmid, ladud and sa'ut |
| `tibb` | الطب | medicine and the physician, illness and the sick, pain, fever, plague and epidemic, contagion, leprosy, named diseases, visiting the sick, the hospital, recovery, health and diet |
| `tashrih` | التشريح | the stages of human creation, the vessels and organs named in the texts, the joints and bones, and anatomy as a science |
| `jiraha` | الجراحة | the treatment of wounds, cauterising a vessel, venesection, circumcision, splints and bone-setting, the women who treated the wounded, the opening of the chest |
| `dawa` | الدواء | the drug and the disease, poison and antidote, simples and compounds, pharmacy |
| `tadawi` | التداوي | seeking treatment and cure, healing, and treatment with what is forbidden |

It reads them in the Qur'an, the Sunnah, the seerah, the reports of the Companions and
the Successors, the medical classics and every other harvested book, and beside them it
lists the museum's own records on medicine: physicians, hospitals, medical books,
remedies, plagues, rulings and fatwas.

The museum describes what the sources say and attributes it. It gives no medical advice
and no ruling; the page says so in its method note.

## 2. Graph, API, search (the rule of `docs/site/browsers.md`)

- **Graph.** No side table. Passages are ordinary `passage` records; curated records are
  ordinary `concept`, `person`, `work`, `building`, `invention`, `event`, `practice`,
  `question` and `job` records carrying the tag `tibb-browser` and one or more topic tags
  `tibb-nabawi`, `tibb-tibb`, `tibb-tashrih`, `tibb-jiraha`, `tibb-dawa`, `tibb-tadawi`.
  Harvested passages carry `mentions` edges to the topic anchors
  (`scripts/harvest-tibb-anchors.ts`).
- **Detection.** `scripts/tibb.ts` runs at build time over the text of every `passage`
  node (`text_search`, else `text`) with a guarded lexicon in folded spelling. A book
  harvested later brings its medical passages here the day its passage records land,
  with no tagging step; its section follows its work's genre (`tibbCorpusOf`).
- **API.** `/api/v1/tibb.json` (`scripts/export-api.ts`): every detected passage and
  every `tibb-browser` record with `section`, `topics`, matched `signals`, work, ref and
  edges. Documented in `docs/data/README.md`, `site/public/openapi/v1.json`, `llms.txt`.
- **Search.** Every record is an entity page indexed by Pagefind; the landing page
  exposes its title, lede and method through `data-pagefind-body`; the long lists carry
  `data-pagefind-ignore`. The whole-list filter index is registered in
  `site/src/lib/browser-registry.ts` (slug `tibb`).

## 3. Pages

- `/[lang]/tibb/` — the home: badge, title, lede, status line, method note, API link,
  the signature view (the apothecary's jars, `sig/TibbJars.astro`: six shelves, one per
  topic; a jar for every remedy, disease or procedure the texts name, filled to the level of
  the passages that name it; a gold-lidded jar opens its museum record, the others their
  section of the list — a form no other browser uses, see `docs/site/signature-views.md`), the section chips, the filter, and the five
  sections (`curated` first, then `quran`, `sunnah`, `seerah`, `books`), each card with its
  work, reference, topic chips and excerpt. Sections longer than the landing shows are
  paged (`site/src/lib/paged.ts`) at `/[lang]/tibb/<section>/<n>/`.
- Records keep their own entity pages (`/passage/…`, `/concept/…`, `/person/…`, …).
- Explore menu (group `conduct`) and landing card, key `tibb`, in ar, en, ur.

## 4. The guards of the lexicon

The words of medicine are also everyday words, so each ambiguous form is admitted only
in its medical sense. The rules are tested in `scripts/tibb.test.ts` (TIB-R08, TIB-R09):

- «في قلوبهم مرض» and its variants are masked: the disease of the hypocrites' hearts is
  not an illness report.
- «الحمى» counts only beside fever vocabulary; «حمى الله», «حول الحمى» and the named
  pastures are masked.
- «القسط» counts only in its drug compounds («القسط البحري», «القسط الهندي», «العود
  الهندي») or beside the ailments it treats, never as justice.
- «عسل», «عجوة», «الكمأة», «كحل», «حناء» count only beside a medical word; the rivers
  of Paradise and the armed «كماة» of the poets stay out.
- «سم الخياط» is masked; bare «سم» counts only beside drinking, eating or the Khaybar
  sheep, and never inside «بسم».
- «عدوى» counts as contagion only in «لا عدوى» or beside طيرة، هامة، مجذوم; «عدوّي» stays out.
- «برأ», «علاج», «الصحة», «الحمية», «اشتكى», «عاده» count only beside an illness.
- The wound words (جرح، جراح، الجرحى، الكلمى، شجة) count only beside treatment, never
  beside the legal compensation of wounds; names in «ابن الجراح» are masked.
- «الختان» in the ghusl reports («جاوز الختان الختان») is masked; «جنين» counts only
  beside creation, never the fetus of diya or slaughter.
- The narrator's nisba «الرقّي» followed by a transmission word is masked, as are «أبو
  جبيرة» and «ليلة الحصبة».
- Outside the Qur'an and the hadith reports, a passage whose only hits are a bare
  illness or healing word (a chronicle's «ومرض فلان», a poet's «شفاء الغليل») is not
  admitted (`TIBB_WEAK_IN_BOOKS`).
- Verified false positives are excluded by id (`TIBB_EXCLUDE`). A passage the lexicon
  misses can be admitted by tagging it `tibb-browser`.

## 5. What was harvested for the opening (14 November 2026)

1. **Existing graph.** The detector over the passages already in the graph: the Qur'an
   verses, and the hadith, tafsir, history and poetry passages that mention medicine.
2. **Hadith.** `scripts/harvest-tibb-hadithapi.ts` over the seven Arabic editions of
   fawazahmed0/hadith-api (the two Sahihs, the four Sunan, the Muwatta): 1,033 reports
   as `passage` records (`<collection>-api-<n>`), a matn excerpt of at most 55 words,
   honorific formulas left out, `mentions` edges to the topic anchors.
3. **OCR'd books on the harvest drive** (existing Apple Vision text; no new OCR, no
   download): `scripts/harvest-tibb-ocr.ts` keeps at most one 40-word window per page
   where the detector fires, the densest pages of each book up to a cap: Zad al-Ma'ad
   (160), al-Bayhaqi's and Abu Nu'aym's Dala'il (41), Hilyat al-Awliya' (37), al-Isaba
   (40), Usd al-Ghaba (40), al-Isti'ab (30), Hayat al-Sahaba (13), Sifat al-Safwa (30),
   Ibn Sina's Canon vols 1–3 (160), Ibn al-Nafis's Sharh Tashrih al-Qanun (39), al-Razi's
   al-Hawi (60) — 650 passages, ids `<book>-tibb-<page>`. Windows that carry a Qur'an
   quotation marker or an honorific the cleaner could not cut are skipped, not repaired.
4. **Existing records tagged in place:** 230 (106 persons, 35 works, 35 concepts, 24
   events, 15 inventions, 9 buildings, 3 questions, 2 practices, 1 job).
5. **New curated records** with trilingual draft prose, cited to Zad al-Ma'ad, the
   Canon, Ibn al-Nafis and the hadith collections: listed in `docs/agents/lanes/tibb.md`.

All of it is `status.review: draft` with provenance; nothing is self-promoted.

## 6. What comes next

- Human read of the draft records and of the OCR excerpts (the OCR text is not corrected).
- Deeper mining of the medical classics chapter by chapter (the caps above are a first pass),
  and of the books not yet on the drive: al-Zahrawi's al-Tasrif, Ibn al-Baytar's al-Jami',
  al-Suyuti's and al-Dhahabi's and Abu Nu'aym's books of prophetic medicine, Ibn Abi
  Usaybi'a's 'Uyun al-Anba' (each through the harvest canon gate, `docs/ai-change-gates.md` §1a).
- Subject pages per remedy and per disease (`/[lang]/tibb/<slug>/`) once the edges are dense.
- `perspectives` blocks on the contested questions (contagion, cautery, the ruling on treatment).
