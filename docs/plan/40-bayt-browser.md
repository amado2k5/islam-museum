# 40 · Bayt al-Nubuwwa & Al al-Nabi Browser (متصفح بيت النبوة وآل النبي) — megaplan

Lane: `bayt`. Requirements spec: `docs/engineering/28-bayt-browser-requirements.md`
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
  delegation doc `docs/delegation/library/maghazi-waqidi.md`, manifest
  `docs/delegation/library/maghazi-waqidi.yaml`.

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

Post-harvest (11 Nov 2026, PR #6011): 19 Waqidi passages join the seerah
section → ~374 detected passages, ~429 items exported.

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
- Docs: this plan, requirements 28, delegation `maghazi-waqidi.md`,
  manifest `docs/delegation/library/maghazi-waqidi.yaml`, registers.

## Status / next waves

- All records draft until human review; contested doctrine keeps labelled
  perspectives.

## 8. Status and remaining work (handoff, 11 Nov 2026)

Shipped: the browser, detector, API, surface and docs in PR #6005; the
Waqidi wave-B harvest in PR #6011 (19 `passage/waqidi-maghazi-*` records,
the corpus's first seerah passages). `npm run validate` 0 errors,
`npm test` all pass at merge time.

**Remaining, in priority order:**

1. **Waqidi wave C — deeper per-chapter mining.** The delegation doc
   `docs/delegation/library/maghazi-waqidi.md` §Unmined remainder now
   lists the fetched and unfetched Shamela URL ranges. Two parts: (a)
   sweep the already-fetched ranges for family mentions not yet excerpted
   (wife and clan names inside the Badr roll-call, the Hudaybiyya
   Safiyya pages, the Khaybar chapter, the Conquest, the Farewell
   Pilgrimage and Usama chapters); (b) fetch and mine the unfetched
   ranges for family chapters — the early sira chapters (Shamela URL
   42–49, which may carry People-of-the-Cloak context), the chapters
   between Badr and Uhud (213–239), between Hamra' al-Asad and the Ifk
   (381–465, the Banu Nadir era), and the gaps at 571–601, 762–794,
   809–819 and 912–923. Also confirm whether the Ghadir Khumm report
   appears inside the already-fetched Farewell chapter (URL 1127–1156).
2. **Seerah section depth beyond Waqidi.** 19 passages today. The other
   `sira`-genre works tagged for the browser (`work/al-sira-al-nabawiyya-ibn-kathir`,
   `work/al-sira-al-nabawiyya-sallabi`, `work/fiqh-al-sira-al-buti`) have
   no passage records yet; Ibn Hisham mining belongs to the sira lane —
   detection is automatic whenever those passages land.
3. **Curated-record gap audit.** The plan targeted ~8–12 new records;
   two shipped (`ummayma-bint-ali`, `fatima-bint-ali`). A pass against
   the wives' and descendants' lists may surface a few more missing
   figures (e.g. children of Hasan/Husayn the graph does not yet carry).
4. **Mentions-edge enrichment.** Detected passages carry edges only where
   the harvest added them; a deeper pass linking bayt passages to their
   person/group/event pages is open.
5. **BAYT-R20 build gate.** `npm run build` never completed on the final
   merged tree (the attempt was killed mid-rebase; CI covers it, but a
   clean local build confirmation is still open).
6. **BAYT-R21 production smoke** — the BAYT-R1..R12 checklist against
   islam.museum after the founder deploys; record the result in
   `docs/status.md` per the requirements doc.
7. **Human review.** Every harvested record is `status.review: draft`
   until a human reads and promotes it; wife-name mentions intentionally
   include narrator mentions («روت عائشة») per the founder's ruling.

Done since the handoff was drafted: `docs/coverage.md` regenerated
(54,134 entities) in the same commit as this section.

**For the next agent:** start from a fresh clone of `main` — the microSD
work clone and the `/Volumes/exmicroSD/maghazi-scratch` fetch workspace
were deleted after the merge (the shared `islam-museum-harvest` store is
untouched). Lane `bayt`, branch pattern `bayt/<topic>-<agent>`
(`docs/agents/lanes.md`).
