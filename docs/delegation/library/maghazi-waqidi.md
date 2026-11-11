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

## Unmined remainder

The non-family bulk of al-Wāqidī's *Maghāzī* remains unmined by design; the
battles browser (`docs/plan/` battles waves) is the natural consumer of the
campaign chapters. Revisit if the founder widens scope.
