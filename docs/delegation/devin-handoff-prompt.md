# Prompt for Devin: resume the islam.museum content lanes

You are taking over a multi-lane content pipeline for islam.museum, an open, free, all-digital museum of Islam. It is a knowledge graph in git (`data/<class>/<slug>.yaml` for facts, `content/<lang>/<class>/<slug>.md` for prose), published as a static site. The repo is `amado2k5/islam-museum` on GitHub. Work in your own git worktree or clone, never a shared folder.

## 1. Read first, in this order

1. `AGENTS.md`, the rules that never bend. Pay particular attention to the hard block on terrorist-organisation content, the sources and licence rules, Arabic-first with English and Urdu always, no honorifics typed, Qur'an text never typed, Arabic parentheses isolated with U+2066/U+2069, and the golden-set rule.
2. `docs/ai-change-gates.md`
3. `docs/agents/pipeline.md`, the packet pipeline: workers draft and verify packets, and only the lander writes to `main`.
4. `docs/engineering/48-lane-operations.md`, the lane operations guide. It covers roles, the board, slices, packet checking, the train, hotfixes, registers and the deletion gate, the check-in routine and the open rulings.
5. `docs/agents/publication-standard.md` and `docs/agents/content-standards.md`.
6. `docs/library/enrichment/README.md` and `docs/library/enrichment/prose-completion.md`.

## 2. Where things live

- **Harvest root:** `/Volumes/exmicroSD/islam-museum-harvest` on the microSD. It holds `BOARD.md`, `WORK-REGISTRY.md` and `packets/`. If the drive is not mounted, stop and tell the founder.
- **Packet stages:** `packets/drafting/`, `packets/verified/`, `packets/landed/` and `packets/rejected/`. A rejected packet carries a `REJECT.md`.
- **Registers:** `docs/library/harvest-register.yaml` (look an item up before any download, OCR or mining), `docs/library/enrichment/claims.yaml` (claim work before starting it) and `WORK-REGISTRY.md` (claim books before any OCR).
- **Tools:**
  - `npm run check:packet -- <dir>` is the scoped check.
  - `npm run validate` must report 0 errors. The lander runs it once per train.
  - `npm run enrichment-queue -- --gap <gap> --class <class> --limit N` lists work.
  - `npx tsx scripts/prose-completion.ts --write` regenerates the prose completion table. Run it at least daily.
  - `npm run coverage` regenerates `docs/coverage.md`.

## 3. Roles

- **Workers** draft packets of at most 25 entities. They never push and never open pull requests.
- **The verifier** is a separate agent on a mid-tier model, not the cheapest. It re-reads claims against the cited sources, runs `check:packet`, then moves the packet to `verified/` or writes `REJECT.md`.
- **The lander** is the only one that writes to `main`. It does these steps:
  1. Creates a train branch from fresh `origin/main` in a separate worktree.
  2. Adds each packet's canary note to `CANARY.md`.
  3. Runs `npm run coverage` and the full `npm run validate` (0 errors).
  4. Commits explicit paths with the `AI-Agent:`, `AI-Model:` and `AI-Editor:` trailers.
  5. Opens a pull request to `main` and merges it with `gh pr merge --merge`.
  6. Moves the packets to `landed/`.
- Never run `deploy.yml` or `deploy-uat.yml`. Deployment is the founder's alone. Say in chat when something needs a deploy.
- Never `git add -A` and never force-push.
- Fetch and three-way merge `origin/main` before every push. `CANARY.md` and `docs/coverage.md` conflict often. Keep both sides of `CANARY.md` and regenerate coverage.

## 4. The lanes

- **Lane A (microSD books):**
  - Sirat al-Hadi (Zaydi source, Apple Vision OCR). The last slice stopped at scan p. 182, printed p. 185. The sentence «فلما بان» at the foot of printed p. 184 is cut off and continues the hamstringing of Ibn al-Dahhak's mare. Work one fresh subagent per batch of about 8 to 10 printed pages. Names that could not be settled are listed in the ledger.
  - Zij.
  - Canon Book II (Ibn Sina). OCR is done from alif through ha and into ta. Packets `a4-canon-book2-1` and `a2-zij-sabi-6` are held.
- **Lane B (web sources, places, persons, Wikidata, iDAI, VIAF):**
  - Places come from Yaqut's Mu'jam al-buldan (full text at `books/geography/mujam-al-buldan-sader-shamela23735/pages.jsonl`). The last packet was `b1-enrich-place-23`. Take the next slice from `npm run enrichment-queue -- --gap prose.missing.ar --class place`.
  - Persons: prose is largely exhausted for readable sources.
  - Wikidata linking: match ids only with a second source in agreement. Many queue items are already linked, so check first.
  - VIAF cluster checks need Chrome. Some are blocked by date conflicts.
- **Lane C (lectures and works):**
  - Wa Nalqa al-Ahibba (Amr Khaled) is an episode-by-episode series. Episodes 1 to 9 are landed in `work/wa-nal9a-al-aheba`. Episode 10 is next. It is a machine transcript, so flag anything unclear as `needs_source` and keep the prose as draft.
  - Jamharat khutab al-arab. The EPUBs are on the drive but claimed by the stale claim `c2-work-1`.
  - alwaad-alhaq lectures (episodes 1 and 2 merged, 3 onward not started).

## 5. Standing rules for content

- Write full, detailed prose and as many sourced details as the source supports in the first pass, in Arabic, English and Urdu. Later work is revision only.
- All AI prose is `status.review: draft` with a `provenance` block. Never self-promote it to `published`.
- Never invent a date, quote, page number, ISBN or citation. A source is read and rewritten in the museum's own words, with a citation to the source and page. No verbatim text beyond 40 words.
- The goal is rising full prose and falling partial and empty prose, measured by `scripts/prose-completion.ts`.
- You may use the Mac browser and Apple Vision OCR. Ask before any download over 50 MB or any action on an account. Only use your own browser tabs and never touch another session's tabs.
- Never touch `inventions-w2-*`, `entr-path-rooms-*` or `jobs-p2-*` packets. Other sessions own them.

## 6. State as of 15 November 2026

- Train 44 is merged as PR #7081. It landed `b5-wikidata-person-12`, `lanec-wa-nal9a-al-aheba-09` and `b1-enrich-place-23`. Full `npm run validate` gave 0 errors across 64,412 entities.
- Packets still in `drafting/`, held, with the blocker:
  - `a2-zij-sabi-6`
  - `a4-canon-book2-1`
  - `b1-enrich-place-13` (register-only)
  - `b3-siyar-edition-note`
  - `c2-work-1` (stale claim)
  - `lanec-register-fix-1` (register-only)
  - `ocr-archive-zips-1`
- Rejected packets: `c2-work-2`, `c2-work-7`, `c2-work-8`, `b5-wikidata-person-3`, `b1-enrich-place-6`, `b2-m16`.
- Not yet applied: the `assabile-amr-khaled-wa-nal9a-al-aheba` entry in `docs/library/harvest-register.yaml`.
- The Gemini answers for batches 2 and 3 are claims to verify, not facts. Do not apply them without checking against the cited sources. The questions are in `docs/delegation/gemini/batch-2-3-prompt.md`.
- Partial clones and worktree folders on the microSD (for example `worktrees/lanec-wa-nal9a-08` and `worktrees/a4-canon-13`) are cleanup candidates. Do not delete them without the founder's confirmation.

Caveat: this state comes from the previous session's reports. Confirm `packets/` and `BOARD.md` on the drive before trusting it.

## 7. Open founder decisions

Record them, do not decide them, and raise them in your reports.

- The citation convention for Canon packets.
- The Sirat al-Hadi appended poems (pp. 415–417) and one clan name.
- The register-only packets (`b1-enrich-place-13`, `lanec-register-fix-1`).
- Own-research and copyrighted sources in `c2-work-2`, `c2-work-7` and `c2-work-8`.
- Whether to re-enrich or drop `b5-wikidata-person-3`.
- Abu Bakr's age across the Wa Nalqa episodes.
- The Khaybar narrative and one generalisation at 00:37:00 in an episode.
- Duplicate pairs: Oljeitu/Oljaitu, Muhammad al-Amin/al-Amin, Ageng Tirtayasa/Mahabat Khan.
- Excluded persons (Abu l-Ala al-Ma'arri, al-Qasim ibn Muhammad) and seven excluded places, plus babil.
- The stale claim `c2-work-1` on Jamharat khutab al-arab.
- Which edition of the Siyar to use: none of five archive.org copies is the Dar al-Risala al-Alamiyya edition the register names, and only a Takmila (supplement) lead exists.
- VIAF date conflicts for `khalid-ibn-said-ibn-al-as` and `mahmud-khattab-al-subki`.
- Dost Mohammad and Hunyadi birth-year conflicts. For Hunyadi, Wikidata says 1407 and the card keeps "1406~".
- The browser boundary: workers use only their own tabs.

## 8. Your first steps

1. Fetch `origin/main` and read the docs above.
2. Check `BOARD.md` and `packets/` on the microSD.
3. Run the daily prose-completion update.
4. Run a verifier sweep on `packets/drafting/`, excluding `inventions-w2-*` and `entr-path-rooms-*`.
5. Have the lander land any verified packets.
6. Refill idle lanes with the next slice.
7. Check every lane about every 20 minutes, report progress, and keep going until the founder says stop.

## 9. Reporting

When you finish a train, report the merged PR number, the validate result, what landed, what is held and what needs a founder decision. Say plainly that merged is not live and that the founder deploys.
