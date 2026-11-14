# Lane `tibb` — Medicine Browser

Plan: [`docs/plan/57-tibb-browser.md`](../../plan/57-tibb-browser.md). Spec and the founder's
original request: [`docs/engineering/47-tibb-browser-requirements.md`](../../engineering/47-tibb-browser-requirements.md).
Opened 14 November 2026 by Claude (claude-fable-5-2) on the founder's request of that day.

## Scope

Only prophetic medicine, medicine, anatomy, surgery, drugs and the seeking of treatment:
new medical passages and records, `tibb-browser` / `tibb-<topic>` tags, the guards of the
lexicon in `scripts/tibb.ts`, the page `/[lang]/tibb/` and its API export.

## Done on 14 November 2026

| Step | Result |
|---|---|
| Detector `scripts/tibb.ts`, tests `scripts/tibb.test.ts` | six topics, about sixty signals, masks and context gates; 11 tests |
| Hadith harvest (`scripts/harvest-tibb-hadithapi.ts`, run `tibb-hadithapi-1`) | 1,033 `passage` records from the seven hadith-api Arabic editions |
| OCR harvest (`scripts/harvest-tibb-ocr.ts`, run `tibb-ocr-1`) | 650 `passage` records from fifteen scans already read by Apple Vision; no new OCR, no download |
| Tags on existing records | 230 records (106 person, 35 work, 35 concept, 24 event, 15 invention, 9 building, 3 question, 2 practice, 1 job) |
| New curated concepts, ar/en/ur draft prose (runs `tibb-browser-curated-1`, `-2`, Claude Sonnet 5.5) | prophetic medicine: `al-tibb-al-nabawi`, `al-habba-al-sawda`, `al-kayy`, `al-talbina`, `al-qust-al-hindi`, `al-sana-wal-sannut`, `al-kamaa`, `al-ithmid`, `al-humma`, `al-ladud-wal-saut`; surgery and drugs: `al-jiraha`, `al-fasd`, `al-jabr-wal-kasr`, `mudawat-al-jarha`, `al-adwiya-al-mufrada`, `al-tiryaq` |
| Page, cabinet view, filter, API export, menu, landing card, i18n, docs | see the plan |

## Trust criteria used (recorded so they can be audited and reused)

1. **Hadith text**: the Arabic editions of fawazahmed0/hadith-api (Unlicense), already a
   registered source (`source/hadith-api-fawazahmed0`) and the convention of the hisab and
   mukatabat lanes; each record also cites its collection's own source record. Numbering is
   the edition's; Sahih Muslim's numbers there are not Abd al-Baqi's.
2. **Books**: only works that already have a `work` and a `source` record in the graph and
   an OCR text on the harvest drive. Nothing was added to the harvest canon, so the canon
   gate (`docs/ai-change-gates.md` §1a) was not triggered. No website was used as a source.
3. **OCR excerpts** are quoted as read by the machine, 40 words at most, uncorrected, and
   marked draft; the page number is the scan's page. A window is skipped, not repaired, when
   it carries a Qur'an quotation marker, an honorific the cleaner could not cut, or too many
   stray letters.
4. **Curated prose** cites only pages and reports the writing agent read; what could not be
   sourced was left out and is listed below.

## Left out, held for the founder's decision

Nothing below was deleted from the museum; these are things this lane did not add. Each can
be overridden by tagging the record `tibb-browser` or by a change to the lexicon.

- **Guarded senses** (plan §4): the heart-disease verses («في قلوبهم مرض»), the legal
  compensation of wounds, the fetus of diya and slaughter, ruqya records that are only about
  jinn or magic (they stay in the Magic and Jinn browsers), menstruation and istihada fiqh,
  nosebleed and vomiting in the purity and fasting chapters.
- **Book passages with only a bare «مرض» or «شفاء»** (a chronicle's notice that someone fell
  ill): not admitted outside the Qur'an and hadith.
- **Existing records judged only incidentally medical** by the tagging pass, among them:
  `work/al-tibb-al-ruhani` and `work/al-jawab-al-kafi` (medicine as a metaphor for ethics),
  `work/kitab-al-shifa` (philosophy), fatwas on a pharmacy's zakat, sick notes and cosmetics,
  `concept/ijhad`, `concept/uqm`, `concept/junun`, `concept/shijaj-head-wounds`, modern hospital
  place stubs, tombs of surgeons, deaths from illness, physician-politicians and writers whose
  main identity is not medicine, `person/thabit-ibn-qurra`, `person/rashid-al-din-hamadani`,
  the Companion women known mainly for other things (`umm-atiyya`, `nusayba-bint-kab`). One
  modern conflict event about a hospital was held back under the content-safety rule.
- **Not written for lack of a source on the drive**: a general record on the bimaristan (the
  hospital records themselves are tagged), the fiqh of the splint, Rufayda in the hadith text
  (the prose points to `invention/rufayda-medical-tent`), a record on Ibn al-Nafis's anatomy
  beyond the existing `concept/anatomy` and `invention/pulmonary-circulation`.
- **Tabaqat Ibn Sa'd**: its scans on the drive gave no window clean enough; nothing taken.

## Next

Human read of the drafts; chapter-by-chapter mining of the Canon, al-Hawi and the Tibb part
of Zad al-Ma'ad beyond the first-pass caps; the books of prophetic medicine by al-Suyuti,
al-Dhahabi and Abu Nu'aym, al-Zahrawi's al-Tasrif and Ibn al-Baytar's al-Jami' through the
canon gate; subject pages per remedy and disease; `perspectives` blocks on contagion, cautery
and the ruling on treatment.
