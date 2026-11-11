# 39 · Bayt al-Nubuwwa & Al al-Nabi Browser (متصفح بيت النبوة وآل النبي) — megaplan

Lane: `bayt`. Requirements spec: `docs/engineering/27-bayt-browser-requirements.md`
(`BAYT-R..`). Canaries: `CANARY.md` v1.13.0.

## Request

The founder asked (verbatim in the requirements doc §0) for a browser listing
**everything mentioned about بيت النبوة وآل النبي** — the Prophet's household
and family — in the Qur'an, the Sunnah, the seerah, Companion and Tabi'in
reports, and every harvested book, with automatic inclusion of future
harvested books, a landing card and navigation entries, trilingual, and
production-ready end to end.

## Scope decided with the founder

- The whole bayt: Ahl al-Bayt, the 'itrah, Banu Hashim, Banu Abd al-Muttalib,
  the Prophet's wives (every wife-name mention, narrator mentions included —
  founder accepted the noise), the Prophet's daughters and sons, Alid /
  Hasanid / Husaynid descendants, and the imams line with labelled
  perspectives.
- Build-time detection over the compiled graph (`scripts/bayt.ts`); no side
  table. Future harvested passages join automatically.
- Sections: `quran`, `sunnah`, `seerah`, `books` (corpus, derived from
  work/genre/unit) plus `ahl`, `mawaqif`, `concepts` (curated records tagged
  `bayt-browser` + `bayt-<section>`).
- Bounded harvest: family chapters of al-Waqidi's *Kitab al-Maghazi* —
  delegation doc `docs/delegation/library/maghazi-waqidi.md`, stub
  `data/_stubs.d/lib-maghazi-waqidi.yaml`.

## Detector design (scripts/bayt.ts)

Guarded lexicon over passage `text` (matn excerpts):

- **Direct (unambiguous):** أهل البيت/أهل بيتي/أهل بيته in family collocations,
  بيت النبوة، آل النبي/آل محمد/آل علي، العترة/عترتي، بنو/بني هاشم، الثقلين،
  غدير خم، فدك، آية/آيات التطهير، أم المؤمنين in construct, سيدة نساء أهل
  الجنة، «فاطمة منها» idiom.
- **Qualified names:** فاطمة only as فاطمة بنت محمد / فاطمة الزهراء / sums of
  the Prophet's household; زينب only as زينب بنت جحش / زينب wife-divorce
  reports; صفية only as صفية بنت حيي; ميمونة/سودة/أم سلمة etc. only in
  wife-collocations or qualified forms; ruqyah-like strings excluded.
- **Excluded:** generic «آل»/«أهل»/«سبط»/«البيت»/«قربى» alone; names that
  resolve to other people (Zaynab bint Abi Salama, Ruqayya the ruqyah
  practitioner, non-Hashem Fatimas); verified false positives listed in
  `BAYT_EXCLUDE`.
- **BAYT_EXTRA:** hand-verified passage ids the lexicon cannot catch.

Corpus audit at build (pre-tag): ~353 passages — sunnah 323, quran 19→21,
books 11 (poetry), seerah 0→4 (work records). After tagging 53 curated
records and adding two new person records the build exports 408 rows.
`excluded still in: 0`.

## Files

- `scripts/bayt.ts` — detector, sections, tag section map.
- `site/src/lib/bayt.ts` — graph-derived item list.
- `site/src/pages/[lang]/bayt/index.astro` — trilingual page (Pagefind body,
  no-JS list, filter).
- `site/src/scripts/bayt-filter.ts` — Arabic-normalising client filter.
- `scripts/export-api.ts` — `/api/v1/bayt.json`.
- `scripts/features-api.test.ts` — fixtures incl. future-harvest guarantee.
- Surface: `site/src/lib/nav.ts`, `site/src/components/Landing.astro`,
  `i18n/{ar,en,ur}.yaml`.
- Data: 53 records tagged in place; `person/ummayma-bint-ali` and
  `person/fatima-bint-ali` created (draft, trilingual).
- Docs: this plan, requirements 27, delegation `maghazi-waqidi.md`,
  stub `data/_stubs.d/lib-maghazi-waqidi.yaml`, registers.

## Status / next waves

- All records draft until human review; contested doctrine keeps labelled
  perspectives.
- Next: Waqidi family-chapter harvest per the delegation doc; mentions-edge
  enrichment on person pages; human read → publish.
