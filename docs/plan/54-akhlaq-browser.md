# Plan 54 — Akhlaq and Mu'amalat Browser (متصفح الأخلاق والمعاملات)

_Requested by the founder 11 November 2026: "start working on متصفح الاخلاق
والمعاملات where it should list all the mentioned and written الاخلاق
والمعاملات that are in quran, see rah, sunna, tabi3een stories, quotes,
mentioned and written in books that were harvested and any future harvested
book if it has a الاخلاق والمعاملات should be viewable here. add a box for it
on landing page and in navigation menus. make sure this is done end to end
and full detailed proses and make it ready for production at the end of this.
this is only about الاخلاق والمعاملات and everything mentioned about الاخلاق
والمعاملات anywhere in any of the sunni books or quran or sunna or sera. find
all the instances where الاخلاق والمعاملات were mentioned or part of quotes
from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
stories, mentions, quotes, details. also add this in engineering documents as
the original requirements to allow AI later on to test and validate it when
it is in production."_

## 1. What it is

A browser over the one graph that gathers every mention of ethics and
dealings the museum's sources carry: the virtues the Qur'an commands and the
vices it condemns, the Prophetic reports on husn al-khuluq and makhariq
al-akhlaq, the fiqh of transactions the passages record — sale, riba, debt,
pledge, hire, bequest, marriage and its rulings, oaths, testimony, judgement,
weights and measures, reconciliation, gifts, guarantees, partnerships and
agency — the reports of the Companions and the Successors, what the seerah
books carry, and every akhlaq or mu'amalat passage in every harvested book —
plus the curated concept records on the traits and the contracts themselves.
It follows the Du'a Browser architecture: passages are ordinary graph nodes
found at build time by a shared detector; curated records carry the
`akhlaq-browser` tag; there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/akhlaq.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata
(the «كتاب الأدب» chapter name of a hadith collection is not evidence). An
akhlaq or mu'amalat passage in a book harvested next month appears here the
day its passage record lands — the founder's "any future harvested book"
requirement, met by the detector rather than by tagging.

## 2. Scope — what counts as akhlaq and mu'amalat

In scope, two tracks that the page shows side by side:

**الأخلاق (akhlaq)** — character ethics: the virtues and the vices the texts
name and teach.

- Virtues (kind `virtue`): الصدق والأمانة والوفاء، الصبر والشكر، التواضع،
  الإحسان، الحياء، الحلم والعفو، الإخلاص، التوبة، القناعة، الكرم والإيثار،
  الشجاعة والنجدة، بر الوالدين وصلة الرحم، حق الجار وحسن المعاشرة، حسن الظن،
  النصيحة، كف الأذى، إتقان العمل، الرحمة، العدل في المعاملة.
- Vices (kind `vice`): الكذب والخيانة والغدر، الكبر والعجب والخيلاء، الرياء
  والسمعة، الحسد، البخل والشح، الغيبة والنميمة والسخرية واللمز والفحش
  والسب، الغضب، الظلم، العقوق وقطيعة الرحم، النفاق، الغش، حسن الظن المذموم
  كسوء الظن.
- The akhlaq mention level («الأخلاق»، «مكارم الأخلاق»، «حسن الخلق»، «من
  حسن إسلام المرء») — kind `mention` when a passage is about character
  without naming a trait.

**المعاملات (mu'amalat)** — the dealings between people the texts regulate
(kind `dealing`): البيع والتجارة والشراء، الربا في سياق المعاملة، الدين
والقرض والسلف، الرهن، الإجارة والأجير والأجر، الوصية والإرث والفرائض، النكاح
والمهر والطلاق والخلع والعدة والرضاع والنفقة والحضانة، اليمين والقسم
والأيمان والكفارة، الشهادة والبينة، القضاء والحكم بين الناس، الميزان
والكيل والمكيال والتطفيف والقسط، الصلح والمصالحة، الهبة والهدية والعطية،
الكفالة والضمان، الوكالة، الشركة والمشاركة والقراض والمضاربة والمزارعة
والمساقاة، السلم والاستصناع، الحوالة، العارية والوديعة، الغصب واللقطة،
الشفعة، الاحتكار، الإكراه، الحجر.

Out of scope (verified): الربا بمعنى الزيادة خارج المعاملة («يربي»،
«ربوة»)، «بيع» بمعنى البيعة للخليفة أو للنبي حيث النص بيعة لا بيع
(allegiance is handled by the bay'ah records, not the transaction
lexicon — the regex family requires sale verbs and objects), «حكم» بمعنى
الحكمة، «شهادة» بمعنى الشهادة بالله أو الشهيد، «عدل» بمعنى الكفء
والتعديل، «أجر» بمعنى الثواب (gated on the hire senses), «قسم»
بمعنى القِسْم النصيب، «صلح» no exclusions needed — الصلح بين الناس is
mu'amalat anyway. Known false positives are excluded by id in
`AKHLAQ_EXCLUDE`. Worship rites (الصلاة والصوم والحج والذكر والدعاء)
belong to the Ibadat and Du'a browsers and are not akhlaq/mu'amalat
signals here — the shared boundary the lanes keep.

Overlap is by design, as in the Nature/Ghayb browsers: records already
owned by the Islamic Economy, Hudud, Hasanat and Sayyiat browsers are
tagged `akhlaq-browser` in place or linked from the curated section —
nothing is duplicated and nothing is removed from its existing browser.

## 3. Kinds and topics

Each detected passage carries `akhlaq_kinds` (a subset of `virtue`,
`vice`, `dealing`, `mention`), `tracks` (`akhlaq`, `muamalat` — a passage
may carry both), `topics` (the trait or contract families its signals
belong to: `sidq`, `amana`, `sabr`, `shukr`, `tawadu`, `ihsan`, `haya`,
`hilm`, `ikhlas`, `tawba`, `karam`, `birr`, `rahim`, `jiwar`, `husn-zann`,
`nasiha`, `rahmah`, `adl`, `itqan`, `kadhib`, `khiyana`, `kibr`, `riya`,
`hasad`, `bukhl`, `ghiba`, `namima`, `ghadab`, `zulm`, `uquq`, `nifaq`,
`ghish`, `bay`, `riba`, `dayn`, `rahn`, `ijara`, `wasiyya`, `irth`,
`aqiqa-marriage` → `nikah`, `talaq`, `yamin`, `shahada`, `qada`, `mizan`,
`sulh`, `hiba`, `kafala`, `wakala`, `sharika`, `salam`, `hawala`, `ariya`,
`ghasb`, `shufa`, `ihtikar`, `ikrah`, `hajr`), and the matched `signals`.
Curated records carry `akhlaq-browser` + `akhlaq-<topic>` tags and the
same topic vocabulary.

## 4. Records

- **Detected passages** — counted at build; the corpus classification is
  `akhlaqCorpusOf` (work `quran` → quran; genre `sira` → seerah; genre
  `hadith` or `unit: hadith` → sunnah; everything else → books). Seerah
  and books fill automatically as those corpora are harvested.
- **Curated records tagged in place** — reuse-before-create held almost
  completely: the graph already carried the traits (`khuluq`, `adab`,
  `al-sidq-truthfulness`, `amana`, `wafa-fiqh`, `sabr`,
  `gratitude-shukr`/`shukr`, `tawadu`, `haya`, `hilm`, `iffa`, `ikhlas`,
  `tawba`, `qanaa`, `karam`, `rahma`, `adl-wal-fadl`, `nasiha`,
  `huquq-al-walidayn`, `uquq-al-walidayn`, `al-muasharah-bil-maruf`,
  `husn-al-zann-billah`, `satr`, `itqan-fil-amal`, `muhasabat-al-nafs`,
  `muraqaba`, `qalb-salim`, `nakhwa-chivalry`, `kadhib`, `khiyana`,
  `al-bukhl`, `hasad`, `riya`, `ujb`, `ikhtiyal`, `hiqd-grudge`,
  `ghadab`, `kazm-al-ghayz`, `zulm`, `nifaq` coverage via `nifaq`-family
  records, `ghayba`, `namimah`, `iftira`, `hifz-al-lisan`, `ghurur`,
  `mann`, `imtina`, `rumour-in-islam`, `tolerance-…`…) and nearly the
  whole contract library (`aqd`, `riba`, `dayn-allah`/`qard-hasan`,
  `rahn-fiqh`, `ijara`, `wasiyya-fiqh`, `irth-fiqh`, `nikah`,
  `talaq`, `iddah`, `mahr`, `nafaqa`, `rada-a-fiqh`, `hadanah-custody`,
  `yamin-fiqh`, `shahada`, `bayyina`, `mizan`, `tatfif-short-measure`,
  `fath-sulh`, `hiba-fiqh`, `hadiyya-fiqh`, `kafala`, `daman` via
  `kharaj-bil-daman`, `wakala-fiqh`, `sharika`/`sharika-partnership`,
  `qirad`, `bay-al-dayn`, `bay-al-taati`, `bay-al-muharramat`,
  `bay-al-istijrar`, `mubayaa-bila-mushahada`, `hawala-debt-transfer`,
  `ariya-madmuna`, `wadia-fiqh`/`wadiah-fiqh`, `luqatah-fiqh`,
  `pre-emption-shufa`, `ihtikar`, `ikrah`, `hajr-fiqh`,
  `hajr-interdiction`, `ihya-al-mawat`, `khulta-fiqh`,
  `khiyar-al-naqd-fiqh`, `ibdal`, `itq-fiqh`, `qimar-and-gharar`,
  `bayah`, `trade-in-islam`, `values-of-islamic-economy`,
  `agriculture-in-islam`, `work-in-islam`, `crafts-in-islam`,
  `wealth-in-islam`, `sadaqa`, `al-infaq-…`).
- **2 new umbrella records**: `concept/akhlaq` (الأخلاق — the
  virtues-and-vices science, distinct from `khuluq` which is the trait
  itself) and `concept/muamalat` (المعاملات — the dealings wing of fiqh),
  each with trilingual draft prose, sources and provenance; the curated
  records `part_of`/`related_to` them where the predicate set allows.
- **Edges**: detected passages carry no bulk edges (the detector is the
  index); the two umbrellas get `mentions` edges from a small set of
  anchor passages (the akhlaq hadiths and the mu'amalat ayahs) in this
  wave; per-trait `mentions` edges grow in later waves.

## 5. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في
سائر الكتب · `curated` السجلات المنتقاة — derived from each passage's
work and from the `akhlaq-browser` tag on curated records. Within each
section the cards carry their track (أخلاق / معاملات), kind (فضيلة /
رذيلة / معاملة / ذكر) and topic chips, and the page filter narrows by
them.

## 6. Pages

- `/[lang]/akhlaq/` — the home: lede, status count, method note, API
  link, section chips with counts, a client-side filter over trilingual
  labels, summaries, work names, text excerpts, track/kind/topic names,
  and the cards. Header block carries `data-pagefind-body`; the lists are
  `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 7. Surface

- `scripts/akhlaq.ts` — the shared detector + corpus classifier + tag
  reader + topic mapper (used by `scripts/export-api.ts` and
  `site/src/lib/akhlaq.ts`).
- `site/src/lib/akhlaq.ts` (shared reads), `site/src/lib/nav.ts`
  (`akhlaq` key, `ready: true`), `site/src/pages/[lang]/akhlaq/
  index.astro`, `site/src/scripts/akhlaq-filter.ts`,
  `i18n/{ar,en,ur}.yaml` (`explore.pages.akhlaq` + `akhlaq:` block in the
  same commit), `/api/v1/akhlaq.json` via `FEATURE_EXPORTS`, documented
  in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`akhlaq`
  lane), `docs/status.md`, `CANARY.md`.
- `docs/engineering/42-akhlaq-browser-requirements.md` — the requirements
  and production checklist for later validation (`AKH-R..`).

## 8. Status

Built 11 November 2026: detected passages + ~40 curated records (2 new
umbrellas + existing records tagged in place) on the `/[lang]/akhlaq/`
page in three languages, the landing card and Explore menu entry, full
API docs. New records are draft-tier until a human reads them; nothing
goes live until the founder deploys. Future waves: seerah and books
passages as they are harvested, akhlaq books (Riyad al-Salihin, al-Adab
al-Mufrad, Ihya' Ulum al-Din, Madarij al-Salikin, Tahdhib al-Akhlaq)
mined deeper, mu'amalat collections (Kitab al-Buyu' of the six books),
per-trait `mentions` edges, and the `AKH-R..` production checklist.
