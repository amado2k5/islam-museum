# Plan 44 — Islamic Economy Browser (متصفح العملات والصكوك والوقف الإسلامي)

_Requested by the founder 11 November 2026: "start working on متصفح العملات
والصكوك والوقف الاسلامي where it should list all the mentioned and written
that are in quran, see rah, sunna, tabi3een stories, quotes, mentioned and
written in books that were harvested and any future harvested book if it has
a متصفح العملات والصكوك والوقف الاسلامي should be viewable here. add a box
for it on landing page and in navigation menus. make sure this is done end to
end and full detailed proses and make it ready for production at the end of
this. this is only about متصفح العملات والصكوك والوقف الاسلامي and everything
mentioned about it anywhere in any of the sunni books or quran or sunna or
sera. find all the instances where it were mentioned or part of quotes from
quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
stories, mentions, quotes, details. also add this in engineering documents as
the original requirements to allow AI later on to test and validate it when
it is in production."_

Founder scope answers (same session): «العملات» means **full Islamic
economics** (coins/cash, exchange, usury, debt and credit, trade contracts,
weights and measures, market rules, taxes and zakat-on-wealth); «الصكوك»
means **all deeds and covenants** (modern sukuk and instruments plus
classical documents and every covenant, treaty, charter and constitution);
«الوقف» means waqf and its endowment synonyms. Page organisation: **corpus
sections plus topic chips**. Slug: `islamic-economy`.

## 1. What it is

A browser over the one graph that gathers everything the museum's sources
say about money and economics in Islam, about deeds, instruments and
covenants, and about endowments: the Qur'anic verses on usury, trade,
debt, zakat, weights and measures and the treasury; the hadith of the two
Sahihs, the Muwatta and the Sunan on buying, selling, lending, pawning,
guaranteeing and giving in charity that lasts; the seerah and Companion
stories of markets, treaties and endowed institutions; every mention in
every harvested book — plus the curated records on the topics. It follows
the Du'a Browser architecture: passages are ordinary graph nodes found at
build time by a shared detector; curated records carry the
`islamic-economy-browser` tag; there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/islamic-economy.ts` matches a guarded, context-gated Arabic
lexicon over each passage's own `text_search`/`text` — never labels or
summaries, which are museum metadata. A mention in a book harvested next
month appears here the day its passage record lands — the founder's "any
future harvested book" requirement, met by the detector rather than by
tagging.

## 2. Scope — the three topics and their boundaries

Every item carries zero or more topic chips from `money` (العملات), `sukuk`
(الصكوك) and `waqf` (الوقف):

- **money — full Islamic economics**: coins and cash (دنانير، دراهم،
  دينار، درهم، فلس، فكة، نقود، نقد، مسكوكات، سكة/ضرب money), exchange
  (صرف، صراف، ثمن، سعر، قيمة), usury (ربا، ربا الفضل، ربا النسيئة، آكلو
  الربا), debt and credit (دين gated, قرض، سلف، نسيئة، آجل، مؤجل، مدين،
  غارم، غرماء، دينار/درهم as money not just weight), trade contracts
  (بيع، شراء، البيوع، تجارة، تاجر، معاملة، عقد، إجارة، سلم، استصناع،
  مضاربة، قيراض، مشاركة، مرابحة، بيع السلم، مقايضة), options and market
  ethics (خيار، مجلس البيع، إقالة، شفاعة، غبن، تدليس، غش، نجش، احتكار،
  غرر، جهالة), weights and measures (كيل، مكيال، ميزان، موازين، صاع،
  مد، أوقية، رطل، منّ، ذراع، أوفوا الكيل، لا تبخسوا), fiscal (خراج،
  جزية، عشر، العشر، موات، إقطاع، بيت المال، بيت مال، زكاة and its nisab
  collocations), the debt instruments (حوالة، سفتجة — also sukuk), and
  economics discourse (اقتصاد، كنز، بخل، إنفاق، أموال gated).
- **sukuk — all deeds, instruments and covenants**: modern instruments
  (صكوك، سندات، صك، سند، كمبيالة، شيك، أوراق مالية، تورق، توريق،
  تكافل، تأمين), classical instruments and documents (صك، حوالة، سفتجة،
  وثيقة، وثائق، سجل gated, محضر, رقاع gated, ديوان gated), covenants and
  treaties (عهد gated, ميثاق، حلف gated, صلح gated, معاهدة، هدنة،
  موادعة، مسالمة، بيعة، مواثيق، صحيفة gated, أمان gated, ذمة gated,
  جوار gated, الصحيفة).
- **waqf — endowment**: وقف gated, أوقف، موقوف، موقوفات، أوقاف، واقف
  gated, حبس gated (not prison), صدقة جارية، جارية only in that phrase,
  the formula «لا يباع ولا يورث»، ناظر الوقف، نظارة، المتولي gated,
  and «أوقف» + endowed objects (دار، أرض، بئر، مسجد، مدرسة، مستشفى،
  سبيل، حوض).

Out of scope (verified, documented in the requirements spec): war booty
and spoils distribution (فيء، غنيمة، الأنفال — the battles domain);
gambling and wine (ميسر، قمار — vices, not money-management); plain
charity, gifts and vows (صدقة، هبة، نذر — one-time giving, not
endowment; «صدقة جارية» stays in); bare «بيع/شراء» and «المال/الأموال»
without economic collocation; every ambiguous short form listed above —
they count only beside their domain collocations, and verified false
positives are excluded by id in `IE_EXCLUDE`.

## 3. Records

- **Passage records detected** in the current corpus — counts filled at
  build; the detector reports per-topic and per-section totals. Every
  detected passage is a card at its ordinary entity page.
- **Curated records tagged in place** with `islamic-economy-browser` and
  `islamic-economy-<topic>` tags (section tags `islamic-economy-<section>`
  where a non-`curated` placement is wanted): the waqf cluster
  (`waqf`, `waqf-fiqh`, `waqf-al-nasab-inda-maadd`, `habs`,
  `sadaqa-jariya`, `concept/tasbil-endowment-term`), the economics cluster
  (the `trade-and-finance` theme census: `naqd`, `nuqud-fiqh`, `riba`,
  `riba-fiqh`, `currency-exchange-sarf`, `bay-al-dayn`, `dayn-fiqh`,
  `qard-hasan`, `bayt-al-mal`, the coinage records, the weights and
  measures records, the fiscal records — audited one by one, not by theme
  alone), the deeds/covenants cluster (`al-sakk-wal-hawala`,
  `written-instrument-sakk`, `ahd`, `hilf-alliance`, `masahif-al-sahaba`,
  `debt-writing-and-witnessing`, `wilayat-al-ahd-fiqh`), waqf and treaty
  events (`dar-al-ilm-waqf-382`, `waqf-haramayn-303`, `treaty-of-hudaybiyya`,
  `hilf-al-fudul`, `hilf-al-mutayyibin`, the Aqaba pledges, the `sulh-*`
  events, `dispatch-of-sadaqa-collectors`), and the Islamic-finance works
  (`fatwa-iifa-262-sharia-governance-in-islamic-finance` and siblings —
  audited by title).
- **`mentions` edges** on every detected passage to its topic anchor
  concepts (money → the money umbrella concept verified at audit, sukuk →
  `concept/sukuk` or `al-sakk-wal-hawala`, waqf → `concept/waqf`), each
  citing the passage's own first source.
- **Reuse before create**: no sukuk concept exists today; `concept/sukuk`
  is created only if a defined source supports it — otherwise the sukuk
  topic anchors on `al-sakk-wal-hawala`/`written-instrument-sakk`.

## 4. Sections (the corpus, plus topic chips)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في
سائر الكتب · `curated` السجلات المنتقاة — derived from each passage's
work (`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`islamic-economy-browser` tag on curated records. Every card additionally
carries its topic chips (العملات / الصكوك / الوقف).

## 5. Pages

- `/[lang]/islamic-economy/` — the home: lede, status count, method note,
  API link, section chips with counts, a client-side filter over
  trilingual labels, summaries, work names, text excerpts and topic
  labels, and the cards. Header block carries `data-pagefind-body`; the
  lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 6. Surface

- `scripts/islamic-economy.ts` — the shared detector + corpus classifier
  + section/topic tag readers (used by both `scripts/export-api.ts` and
  `site/src/lib/islamic-economy.ts`).
- `site/src/lib/islamic-economy.ts` (shared reads),
  `site/src/lib/nav.ts` (`islamic-economy` key, `ready: true`),
  `site/src/pages/[lang]/islamic-economy/index.astro`,
  `site/src/scripts/islamic-economy-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.islamic-economy` + `islamic-economy:` block in the same
  commit), `/api/v1/islamic-economy.json` via `FEATURE_EXPORTS`,
  documented in `docs/data/README.md`, `site/public/openapi/v1.json` and
  `llms.txt`. Landing card + Explore menu entry via `explorePages`.
  Register rows in `docs/site/browsers.md`, plan index,
  `docs/agents/lanes.md` (`islamic-economy` lane), `docs/status.md`,
  `CANARY.md` (v1.17.0).
- `docs/engineering/32-islamic-economy-browser-requirements.md` — the
  requirements and production checklist for later validation (`IE-R..`).

## 7. Status

_Updated at ship: detection counts, curated count, edge count._

New records are draft-tier until a human reads them; nothing goes live
until the founder deploys. Future enrichment waves: seerah and books
passages as they are harvested, fiqh-economics books (the mawsu'a, the
mughni, radd al-muhtar) when their passage records land, deeper
Companion/Tabi'in anecdote mining on markets and endowments, and the
`IE-R..` production checklist.
