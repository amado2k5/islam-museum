# Kitab al-Maghazi (كتاب المغازي) — al-Waqidi — bayt-browser harvest delegation

Lane: `bayt`. Feature: `docs/plan/40-bayt-browser.md`;
requirements: `docs/engineering/28-bayt-browser-requirements.md` (BAYT-R17).

## Source decision

- **Work:** Kitāb al-Maghāzī (كتاب المغازي) of Muḥammad ibn ʿUmar
  al-Wāqidī (d. 207 AH) — the standard early maghāzī compilation of the
  Prophet's campaigns.
- **Identity check (mandatory before mining):** the title «كتاب المغازي» is
  shared — Mūsā ibn ʿUqba (d. 141 AH) wrote an earlier *Kitāb al-Maghāzī*,
  and later authors (Ibn Isḥāq's *Sīra* via Ibn Hishām, al-Ṭabarī's
  *Tārīkh* §§maghāzī) cover the same ground. The delegation targets
  **al-Wāqidī's** recension specifically; any harvested passage must cite
  the Wāqidī edition used (see candidates below) and never silently mix the
  two *Maghāzī*s.
- **Edition candidates (verify at harvest time):**
  1. *Kitāb al-Maghāzī*, ed. Marsden Jones, Oxford University Press 1966
     (critical edition, standard citation).
  2. *al-Maghāzī*, ed. Shuʿayb al-Arnaʾūṭ, Muʾassasat al-Risāla 1405/1984
     (widely used printed edition).
  Record the exact edition + page in every passage `provenance`.
- **Trust note:** al-Wāqidī is a Sunni hadith scholar whose *Maghāzī* is a
  primary seerah source in the Sunni tradition; isnād criticism applies —
  matn excerpts enter as `status.review: draft` like all AI harvest.

## In-scope chapters (bounded harvest)

Only chapters whose subject is the Prophet's household or clan:

1. **The Prophet's family in Medina** — chapters on his household,
   ḥijāb/zinā reports, and the Banū Hāshim's position.
2. **Ghadīr Khumm** and the Farewell Pilgrimage family reports.
3. **The Cloak hadith context** and the People of the Cloak.
4. **Fāṭima, ʿAlī, al-Ḥasan, al-Ḥusayn** — their reports, disputes (Fadak,
   inheritance), and deaths as narrated.
5. **The wives (ummahāt al-muʾminīn)** — chapters mentioning each wife by
   name in events.
6. **Banū Hāshim / Banū ʿAbd al-Muṭṭalib** — Abū Ṭālib, al-ʿAbbās,
   Ḥamza, Jaʿfar, Umm Ayman, Khadīja reports.
7. **Descendants** — reports naming al-Ḥasan/al-Ḥusayn's children,
   Zaynab, Ruqayya, Umm Kulthum, the imams line where the text mentions
   them.

Everything else in the book (battle narratives not touching the family,
genealogies of other clans, etc.) is **out of scope for this wave** and is
listed here so the omission is documented, not silent.

## Citation and record rules

- Passage records: `data/passage/<work>-<n>.yaml` following the existing
  hadith-passage shape (`work`, `unit`, `ref`, `text` ≤ 40-word matn excerpt,
  `sources`, `provenance` with edition + OCR/vision note).
- Work record: `data/work/kitab-al-maghazi-waqidi.yaml` (new) — the existing
  `work/kitab-al-maghazi` must be checked at harvest time: if it denotes
  Mūsā ibn ʿUqba's book or an unspecified *Maghāzī*, do **not** reuse it for
  Wāqidī passages; create the distinct work record and alias only after
  identity is confirmed.
- Relations: `mentions` edges to the persons/groups/events named; passages
  are auto-detected by `scripts/bayt.ts` once landed (genre `sira` or unit
  `maghazi` → `seerah` section — verify `baytCorpusOf` maps the chosen
  `unit` value).
- Prose/content for any new entity records stays draft-tier trilingual.

## Harvest waves (suggested)

- **Wave A:** delegation doc + stub + `work` record decision — DONE.
- **Wave B (this PR):** 19 family-relevant chapter passages mined from
  al-Maktaba al-Shamila book 23680 (`passage/waqidi-maghazi-*`), covering
  the wives' rotation at the Trench, the Ifk affair, Safiyya bint
  Abd al-Muttalib at Uhud, the Khaybar women list, Mu'ta's condolence to
  Fatima, Umm Salama at Hudaybiyya/Tabuk, Maymunah at the Farewell
  Pilgrimage, and the clan members (Hamza, al-Abbas, al-Fadl, Abu Sufyan
  ibn al-Harith, Usama) at Badr, Hunayn and the Conquest. All draft-tier.
- **Wave C (remaining):** deeper per-chapter mining of the same family
  chapters — additional wife/clan mentions inside the already-fetched page
  ranges — plus any family chapters in parts not yet fetched.

### Edition used (decided)

- **Access:** al-Maktaba al-Shamila book 23680 («كتاب مغازي الواقدي»),
  three parts, Shamela URL pages 42–1166.
- **Edition identity:** the Shamela text reproduces the Marsden Jones
  critical edition (Oxford University Press, 1966); citations use the
  printed page numbers shown in Shamela's page footer (part 1 starts at
  printed p. 1 ≈ Shamela page 42).
- **Identity resolution:** `work/kitab-al-maghazi` previously carried the
  generic title with Wikidata Q135509586 — verified to be **Mūsā ibn
  ʿUqba's** work. The Wāqidī record now carries an explicit author in its
  label and the Jones/Shamela provenance; the Mūsā ibn ʿUqba identity is
  preserved as `work/kitab-al-maghazi-musa-ibn-uqba` (draft). No passages
  of either book are mixed.
- **Text handling:** Shamela's transcription is fully vocalised; excerpts
  in passage `text` fields are the vocalised text with diacritics stripped
  and honorifics removed, trimmed to ≤ ~40 words; the printed page span of
  each chapter is recorded in `provenance.source`.

## Unmined remainder (wave-C brief, 11 Nov 2026)

The non-family bulk of al-Wāqidī's *Maghāzī* remains unmined by design;
the battles browser (`docs/plan/` battles waves) is the natural consumer
of the campaign chapters. Revisit if the founder widens scope.

**Fetch map (Shamela URL page ids → printed pages):**

- Fetched and mined (wave B): Hamza sariyya 50–51 (pp. 9–10); Badr
  60–213 (pp. 19–172); Uhud 240–375 + Hamra' al-Asad 375–381 (pp.
  199–340); Ifk 466–480 (pp. 426–440); Khandaq 480–536 (pp. ~440–495);
  Banu Qurayza tail 536–571 (pp. 496–531); Fadak 602–604 (pp. 562–564);
  Umm Qirfa 604–606 (pp. 564–566); Hudaybiyya 611–673 (pp. 571–633);
  Khaybar 673–762 (pp. 633–722); Mu'ta 795–809 (pp. 755–769); Conquest
  820–912 (pp. 780–873); Hunayn 924–961 (pp. 885–922); Ta'if 961–978
  (pp. 922–939); Ja'rana 978–988 + Hawazin delegation 988–1012 (pp.
  939–973); al-Fils 1023–1028 (pp. 984–989); Tabuk 1028–1099 (pp.
  989–1060); Qur'an-on-Tabuk + Abu Bakr's Hajj + Ali's Yemen +
  ṣadaqāt 1099–1127 (pp. 1060–1088); Farewell Pilgrimage 1127–1156 (pp.
  1088–1117); Usama 1156–1166 (pp. 1117–1127).
- **Not yet fetched:** 42–49 (front matter and the earliest sira
  chapters — candidate for People-of-the-Cloak / early household
  context), 213–239 (chapters between Badr and Uhud), 381–465 (the
  Banu Nadir era between Hamra' al-Asad and the Ifk), 571–601 (between
  Qurayza and Fadak), 762–794 (between Khaybar and Mu'ta), 809–819
  (between Mu'ta and the Conquest), 912–923 (between the Conquest and
  Hunayn), and any tail after 1166.

**Wave-C tasks:**

1. Sweep the fetched ranges for family mentions not yet excerpted —
   wife and clan names inside the Badr roll-call pages, the Hudaybiyya
   Safiyya/people-of-the-trench pages, the Khaybar chapter, the Conquest
   chapter, the Farewell Pilgrimage and Usama chapters.
2. Fetch the unfetched ranges above and check their TOC for family
   chapters (descendants/imams mentions, any additional wife chapters).
3. Confirm whether the Ghadir Khumm report appears inside the
   already-fetched Farewell chapter (URL 1127–1156); if it does, excerpt
   it (it feeds `event/ghadir-khumm` and `place/ghadir-khumm`).
4. Keep the same record rules: ≤40-word excerpts, honorifics stripped,
   printed-page provenance, `status.review: draft`, `mentions` edges to
   existing ids only.

**Edition caveat:** the Shamela transcription is community-maintained;
the Marsden Jones print edition is not open access. If a passage ever
needs verification against print, the fallback is the al-Arna'ūt edition
(Mu'assasat al-Risāla 1405/1984) — do not silently switch editions
mid-harvest; record any edition change in this doc first.
