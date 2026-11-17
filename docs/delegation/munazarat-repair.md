# Munazarat transcripts repair — 17 November 2026

Branch `repair/munazarat-cites`, repairing the breakage merged by PR #7372
(commit e9d9be8147, "who-said-what exchanges for all curated debates") on top of
origin/main.

## What was broken (78 errors)

1. **Missing frontmatter — 30 errors / 15 files.** Commit e9d9be8147 replaced the
   whole body of five records' prose files and dropped their front matter:
   `al-khutut-al-arida`, `cambridge-scriptural-reasoning`,
   `kairanawi-pfander-debate-1854`, `tuhfa-ithna-ashariyya-refutation`,
   `yusuf-sacks-dialogues` × ar/en/ur. Restored the exact pre-commit front
   matter (`id`, `lang`, `source_lang: ar`, `translators` — `[]` for ar,
   `["Devin (SWE-2), draft translation"]` for en/ur).
2. **Unresolved `{cite:…}` — 48 errors / 9 source ids.**

## Sources created (5)

| cite id | record | verification |
|---|---|---|
| `mahajjah-al-murajaat-critique` | `source/mahajjah-al-murajaat-critique` | «Shattering the Mirage: A Response to 'Abdul Hussain Sharaf al-Din's al Muraja'at», mahajjah.com book page — the published critique arguing al-Muraja'at is composed, matching the prose's "Sunni critics" caveat |
| `wikipedia-peshawar-nights` | `source/wikipedia-peshawar-nights` | en.wikipedia.org/wiki/Peshawar_Nights, revision 1384251862 of 7 Nov 2026 |
| `wikipedia-kairanawi` | `source/wikipedia-kairanawi` | en.wikipedia.org/wiki/Rahmatullah_Kairanawi, revision 1383705086 of 4 Nov 2026 |
| `youtube-tovia-singer-debates` | `source/youtube-tovia-singer-debates` | Rabbi Tovia Singer's official channel youtube.com/@ToviaSinger1 carrying his recorded Muslim-interlocutor exchanges |
| `cambridge-interfaith-programme` | `source/cambridge-interfaith-programme` | interfaith.cam.ac.uk Scriptural Reasoning page — the CIP programme named in the event record's own summary |

## Cites remapped (4 ids)

- `al-islam-al-murajaat` → `al-islam-murajaat` in `al-murajaat-correspondence`
  and `tuhfa-ithna-ashariyya-refutation` (same al-Islam.org page, the records'
  canonical source).
- `al-islam-al-murajaat` → `youtube-sunni-jewish-debate` in
  `al-mustaqillah-tv-debates` and `uthman-al-khamis-debates` (the records'
  canonical source; no verifiable al-islam.org page for the televised debates
  was found).
- `tandfonline-meknes-disputation` → `tandfonline-berdugo-meknes` in
  `berdugo-meknes-disputation` (same Taylor & Francis article).
- `tandfonline-meknes-disputation` → `researchgate-pfander-legacy` in
  `kairanawi-pfander-debate-1854` (the Agra debate's canonical scholarly
  source; the Meknes article is not about Agra).
- `youtube-hijab-shobayri-2017` → `youtube-hijab-shobayri` in
  `hijab-shobayri-debate-2017` (same recording, same video).
- `traditionalhikma-jewish-muslim-dialogue` → `youtube-sunni-jewish-debate` in
  `yusuf-sacks-dialogues` (the record's canonical source; no verifiable
  Traditional Hikma page documenting the Yusuf–Sacks dialogues was found —
  traditionalhikma.com hosts no such page).

## Result

`npx tsx scripts/check-yaml.ts`: 80077 YAML files, 0 problems.
`npm run validate`: 0 errors, 5335 warnings (all pre-existing).
