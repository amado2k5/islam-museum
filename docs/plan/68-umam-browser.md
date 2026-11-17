# 67. The Umam Browser — the non-Muslim nations, religions, sects and peoples named in the sources

Requirement (founder): a browser of «الأمم والأديان والطوائف والشعوب غير المسلمة المذكورة في القرآن
والحديث وأثر وكتب الصحابة والتابعين» — every non-Muslim nation, religion, sect and people named in
the Qur'an, the hadith, the sunnah, the seerah, the reports of the Companions and Successors, the
Sunni books, every harvested book, and every future harvested book. A landing-page box, navigation
entries, full detailed prose, production-ready, and an engineering acceptance document so a later
agent can test it in production.

URL: `/umam/` in all three languages (`/{ar,en,ur}/umam/`). API: `/api/v1/umam.json`. Tag:
`umam-browser`, sections `um-<section>`.

## Architecture

No side list — the same membership rule as the Madhhabs and Wasaya browsers, generalised:

1. **Curated records** (`data/<class>/<slug>.yaml`) carry `umam-browser` plus one or more
   `um-<section>` tags. A record with the browser tag and no section tag is filed by class
   (person→ayan, place/building→sukun, work/source→kutub, concept/practice→mafahim, else shuub).
2. **`mentions` edges**: any passage, work, event, exhibit, question or media whose forward
   `mentions` edge targets an Umam member joins `dhikr` **plus every section the target sits in**.
   The frozen Qur'an verses join only this way — the verse text is never scanned. A book harvested
   later therefore appears the day its edges land, with no code change.
3. **A guarded name lexicon** (`UMAM_NAMES`/`EN_NAMES` in `scripts/umam.ts`) reads non-Qur'an
   passage texts (folded: vowels dropped, alef forms joined) and files a passage under `dhikr`
   plus the sections of every people it unambiguously names. Only strong patterns — «قوم عاد»
   matches, «عاد» the verb does not; «قيصر» matches, «قيصريه» does not. `UMAM_EXCLUDE` is the
   curated escape hatch for a verified false positive.

The shared detector `scripts/umam.ts` is the one implementation used by the site
(`site/src/lib/umam.ts`), the API export (`scripts/export-api.ts`), the audit
(`scripts/umam-audit.ts`) and both harvesters (`scripts/harvest-umam-ocr.ts`,
`scripts/harvest-umam-hadithapi.ts`).

## Sections (`UMAM_SECTIONS`, display order)

| section | contents |
|---|---|
| `umam` | the recounted/vanished nations of the Qur'an — 'Ad, Thamud, Saba', the peoples of Nuh, Lut, Shu'ayb, al-Rass, al-Uhdud, al-Qarya, Tubba', Pharaoh's people |
| `adyan` | the religions: Jews, Christians, Magians, Sabians |
| `tawaif` | sects/tribes inside them: Banu Qaynuqa'/Nadir/Qurayza, Jews of Khaybar, Christians of Najran, Ghassan, Lakhm, Harranian Sabians, Banu Salul |
| `shuub` | peoples and nations: Rum, Persians, Abyssinia, Copts, Turks, India, China, Berbers, Zanj, Slavs, Rus, Nabataeans, 'Ajam |
| `mushrikun` | pre-Islamic Arab polytheists — own section, neither People of the Book nor another creed |
| `ayan` | named figures: Heraclius, Khosrow, the Negus, al-Muqawqis, al-Mundhir, Medina's rabbis, Quraysh's polytheist lords |
| `sukun` | lands and dwellings |
| `mafahim` | concepts: ahl al-kitab, dhimma, jizya, shirk, kufr, nifaq, hanif, umma |
| `kutub` | the books and sources that keep their reports |
| `dhikr` | every mentioning record — auto-populated |

## The page

Standard browser chrome (badge, breadcrumb, status, method note, API link, filter, PagedNav,
FullFilter, Pagefind `data-pagefind-body`/`data-pagefind-ignore`) plus the signature view
**«خريطة عالم النصوص» — the world of the texts** (`site/src/components/sig/UmamWorld.astro`): a
pure-SVG manuscript map centred on Makka and Madina — Rum north-west, Fars north-east, Abyssinia
south-west, the People of the Book a band across the middle, the vanished nations below a dashed
horizon line, named figures in a top band, lands/concepts/books on shelves, the far peoples on the
rim. Every dot is a real member and a real link; a colour legend maps to the sections; no
JavaScript is needed. Below it: a "most-mentioned" strip driven by incoming `mentions` edges, and
a dated-records timeline (oldest first).

## Mining

- `scripts/harvest-umam-ocr.ts` mines the OCR corpus (`books/<cat>/<book>/<scan>/pages.json`):
  40-word windows gated by the detector, the same Qur'an/honorific/OCR-quality guards as the other
  harvesters, ≤40 words quoted per page, `mentions` edges to the named peoples, provenance
  `umam-ocr-<n>`.
- `scripts/harvest-umam-hadithapi.ts` mines the hadith-api Arabic editions: 55-word matn excerpts
  centred on the first detected name, same dedup and Qur'an guards, run `umam-hadithapi-<n>`.
- `scripts/umam-audit.ts` reports membership, section counts, members with no incoming mentions,
  and the lexicon-only passage list for false-positive review.

## Rules kept

- Qur'an text is never typed; verses are `passage/quran-<s>-<a>` records joined by reviewed
  `mentions` edges only.
- No honorific formulas in data or prose; UI renders them.
- Arabic parentheses isolated (U+2066/U+2069) where Arabic sits inside them.
- Non-Muslim categories kept distinct: religions, sects, peoples, pagan Arabs and concepts are
  separate sections; identities described with source attribution, no verdicts.
- The terrorist-organisation hard block applies as elsewhere.
