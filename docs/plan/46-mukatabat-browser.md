# Plan 46 — Mukatabat Browser (متصفح المكاتبات النبوية والخلافية والملكية)

_Requested by the founder (this session): "start working on متصفح المكاتبات
النبوية والخلافية والملكية where it should list all the mentioned and written
المكاتبات النبوية والخلافية والملكية that are in quran, see rah, sunna,
tabi3een stories , quotes , mentioned and written in books that were
harvested and any future harvested book if it has a المكاتبات النبوية
والخلافية والملكية should be viewable here. add a box for it on landing page
and in navigation menus. make sure this is done end to end and full detailed
proses and make it ready for production at the end of this. this is only
about المكاتبات النبوية والخلافية والملكية and everything mentioned about
المكاتبات النبوية والخلافية والملكية anywhere in any of the sunni books or
quran or sunna or sera. find all the instances where المكاتبات النبوية
والخلافية والملكية Were mentioned or part of quotes from quran, sunnah,
Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions,
quotes, details. also add this in engineering documents as the original
requirements to allow AI later on to test and validate it when it is in
production."_

_Founder clarification (same session): "it meant the letters sent from
prophet and kings and kholafa to others."_

## 1. What it is

A browser over the one graph that gathers every letter and act of
correspondence the museum's sources mention or write **to or from the
Prophet, caliphs, kings and rulers** — the letters of the Prophet to the
emperors and kings (Heraclius, Chosroes, the Negus, al-Muqawqis, the Arab
kings), the letters of the caliphs to governors, commanders, peoples and
other courts, letters between rulers, the letters written *to* them and the
replies received, the prophetic letters preserved in hadith, and every
correspondence episode in the seerah and in every harvested book. It follows
the Du'a Browser architecture: passages are ordinary graph nodes found at
build time by a shared detector; curated records carry the `mukatabat-browser`
tag; there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/mukatabat.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata.
A letter mentioned in a book harvested next month appears here the day its
passage record lands — the founder's "any future harvested book" requirement,
met by the detector rather than by tagging.

## 2. Scope — what counts as a mukataba

In scope: correspondence **sent by, received by, or exchanged between** the
Prophet, prophets, caliphs, kings, sultans, emperors and the rulers and
offices of the caliphate — including:

- **The Prophet's letters** to rulers and peoples: the letters to Heraclius,
  Chosroes, the Negus, al-Muqawqis, the kings of Yemen, the people of Yemen
  and the delegations; their replies; and the hadith reports of them
  («كتب إلى هرقل»، «خاتم كسرى»، «بعث إلى النجاشي»).
- **Letters to the Prophet** (in scope per the founder's "include incoming +
  replies" answer): Musaylima's letter, Hatib's letter to Quraysh about the
  Prophet's expedition, letters carried by delegations and envoys.
- **Caliphal correspondence**: letters of the Rashidun and later caliphs to
  governors, commanders, judges, peoples and other courts; administrative
  correspondence of the caliphate (barid, khatam, diwan al-insha'); letters
  between caliphs and rulers.
- **Royal correspondence of other rulers** as the sources carry it: kings,
  emperors, sultans and their envoys writing or being written to — Sulayman's
  letter to Bilqis, Heraclius's and Chosroes's answers, later courts'
  correspondence where the corpus reports it.
- **The correspondence institutions and genre**: ديوان الخاتم، ديوان البريد،
  ديوان الإنشاء، صاحب البريد، مكاتبات الملوك، مراسلة الملوك — passages *about*
  the practice of state correspondence itself.

Out of scope (verified, excluded by gate or by id): the fiqh **mukataba**
(العقد على العتق بالأقساط — «المكاتب»، «يعتق بمكاتبة»), «خاتم النبوة» the seal
of prophethood as a physical mark, «الرسالة» in the prophetic-message sense
(«بلغ رسالة ربه»), the Book/scripture senses («الكتاب»، «كتب الله»، «مكتوب
في»), sermons and addresses («خطاب»، «خطب»، «خاطب»), deeds and receipts of
the «صك» fiqh senses unless official-document context is explicit, generic
writing and reading of letters not involving a prophet/caliph/king party,
and personal literary correspondence such as Rumi's *Maktubat* unless a
ruler/prophet party is involved.

## 3. Records

### 3a. Passages detected at build time

Every `passage` record whose own text carries a correspondence signal is
listed automatically — including passages of books harvested later. Expected
surfaces in the current corpus (calibrated at build):

- **Qur'an**: Sulayman's letter to Bilqis (27:28–31, «إنه من سليمان»), and
  any ayah whose text reports or quotes a letter context.
- **Sunnah**: the letter hadiths — «كتب إلى هرقل/كسرى/النجاشي/المقوقس»،
  «خاتم كسرى»، the Amr ibn Hazm zakat letter, Hatib's letter affair,
  «من كتب إلى» reports, correspondence etiquette — once their passage records
  exist; the Muwatta's 2,892 passages are scanned at build.
- **Seerah**: the letter episodes of the sira books once their passage records
  exist (see §3b).
- **Books**: every other harvested work — poetry, history, fiqh, adab — lands
  in `books` by work genre.

Each detected passage carries `mukatabat_kind`: `letter` when it carries or
reports an actual letter (text, sending act, named letter, reply) and
`mention` when it is only *about* correspondence (institutions, the genre,
seals, the practice).

### 3b. Newly harvested passage records (this build)

The founder asked for "full detailed proses" — so this build mines the letter
corpus rather than only detecting what already exists:

- **The six hadith books via hadith-api** (`source/hadith-api-fawazahmed0`,
  Unlicense): scan the `ara-*` editions for the signal lexicon, verify every
  hit by hand, and create `passage/<book>-NNNN` records following the
  existing hadith-api passage conventions (matn excerpt ≤40 words, trilingual
  own-words label/summary, `mentions` edges, `status.review: draft`,
  provenance naming edition + hadith number).
- **Seerah books on the microSD**
  (`/Volumes/exmicroSD/islam-museum-harvest/books/`): al-Raheeq al-Makhtum
  (the letters-to-kings chapter and the delegation letters), Zad al-Ma'ad,
  Subul al-Huda wa'l-Rashad, Uyun al-Athar, Dala'il al-Nubuwwa al-Bayhaqi,
  Sirat Ibn Hisham — and any other `book.txt` whose grep hits verify. Each
  verified episode becomes a `passage/<work>-<slug>` record (`unit: other` or
  `chapter`, `ref` = printed page), after claiming the book in the harvest
  ledger. Books stay outside git; only rewritten museum prose enters.
- **Qur'an** needs no new records — the frozen passages already exist and the
  detector finds them.

### 3c. Curated records

- **New genre concept** `concept/…` for «المكاتبات» the correspondence genre —
  reuse-before-create checked against `concept/mukataba` (the fiqh contract,
  deliberately NOT reused), `concept/diwan-al-insha`, `concept/diwan-al-barid`,
  `concept/diwan-al-khatim`, `concept/insha`. Trilingual draft summary,
  `related_to` edges to those records.
- **Tag audit**: existing records verified and tagged `mukatabat-browser`
  (+ `mukatabat-<sender>` and optional `mukatabat-<section>`): the letter
  events (`letters-to-rulers-and-kings`, `letter-of-himyar-kings`,
  `ghassan-kings-letter-to-kaab`, `hatib-letter-to-quraysh`,
  `musaylimas-letter-and-the-prophets-reply`, `ali-letter-exchange-with-muawiya`,
  `umar-letter-to-the-nile`, `bayhaqi-letter-amid-al-mulk-446`,
  `hulagu-letters-damascus`, `caesar-palm-letter`, `al-awzai-letter-to-salih`,
  `jarrah-khurasan-justice-letter`, the delegation events, `year-of-delegations`,
  `forged-letter-affair`, `quraysh-envoys-to-the-negus`,
  `ubada-embassy-to-al-muqawqis`, `funeral-prayer-for-the-negus`), the
  correspondence concepts (`diwan-al-insha`, `diwan-al-barid`,
  `diwan-al-khatim`, `insha`, `pigeon-post`, document/seal concepts as the
  audit decides), and relevant works (`work/nahj-al-balagha` for Ali's
  letters, correspondence collections — audited one by one).
- **Bounded new records**: for the most famous individual letters that have
  no entity — candidates the Prophet's letter to Heraclius, to Chosroes, to
  the Negus, to al-Muqawqis, Sulayman's letter to Bilqis, the Amr ibn Hazm
  zakat letter, Ali's letter to Malik al-Ashtar — audit first; create
  `event/` records only where a real gap exists, each trilingual draft with
  cited sources.
- **`mentions → concept/<genre>` edges** on every detected passage, citing
  the passage's own source — the analog of the dua `basis_for` edges.

### 3d. Sender classification (the founder's three categories)

Each item carries `sender` ∈ `prophetic` | `caliphal` | `royal` | `other` |
`null` — a *belongs-to* class, not strict authorship:

- `prophetic` — the Prophet or a prophet is a party (author, recipient, or
  correspondent; includes letters TO him and replies received). Sulayman
  counts as prophetic (messenger-king).
- `caliphal` — a caliph, Rashidun, Umayyad or Abbasid caliph, or the
  caliphate administration (governors, judges, barid officials) is a party.
- `royal` — a king, emperor, sultan or royal court is a party and no higher
  class applies.
- `other` — correspondence between parties outside the three classes
  (companions, scholars, tribes).
- `null` — genre-level mentions with no identifiable party (the institutions,
  the practice itself).

Priority when several parties appear: prophetic > caliphal > royal > other.
Curated records set `sender` through the `mukatabat-<sender>` tag;
passages are classified by actor names near the signal.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `curated` السجلات المنتقاة — derived from each passage's work
(`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`mukatabat-browser` tag on curated records — identical to every sibling
browser.

## 5. Pages

- `/[lang]/mukatabat/` — the home: lede, status count, method note, API link,
  section chips with counts, **sender chips** (النبوية / الخلافية / الملكية /
  أخرى) that filter the list, a client-side filter over trilingual labels,
  summaries, work names and text excerpts, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/`, `/{lang}/event/<slug>/`, …).

## 6. Surface

- `scripts/mukatabat.ts` — the shared detector + corpus classifier + sender
  classifier + section/sender tag readers (used by both
  `scripts/export-api.ts` and `site/src/lib/mukatabat.ts`).
- `site/src/lib/mukatabat.ts` (shared reads), `site/src/lib/nav.ts`
  (`mukatabat` key, `ready: true`), `site/src/pages/[lang]/mukatabat/index.astro`,
  `site/src/scripts/mukatabat-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.mukatabat` + `mukatabat:` block in the same commit),
  `site/src/components/Landing.astro` (card thumbnail + accent),
  `/api/v1/mukatabat.json` via `FEATURE_EXPORTS`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`mukatabat`
  lane), `docs/status.md`, `CANARY.md` (v1.18.0).
- `docs/engineering/34-mukatabat-browser-requirements.md` — the requirements
  and production checklist for later validation (`MK-R..`).

## 7. Status

_Implementation in progress._ Gates: `npm run validate` 0 errors,
`npm test` all pass, `npm run build` clean; shipped through a PR on the
`mukatabat-browser` branch; new records draft-tier until a human reads them.
