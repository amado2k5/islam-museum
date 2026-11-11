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

- **Wave A (this PR):** delegation doc + stub + `work` record decision;
  no passages yet if no verified edition is at hand.
- **Wave B:** chapters 1–4 above (~30–60 passages expected).
- **Wave C:** chapters 5–7 (~40–80 passages expected).

## Unmined remainder

The non-family bulk of al-Wāqidī's *Maghāzī* remains unmined by design; the
battles browser (`docs/plan/` battles waves) is the natural consumer of the
campaign chapters. Revisit if the founder widens scope.
