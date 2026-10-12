You are continuing a content-mining job on islam.museum, an open, free, static, Arabic-first digital museum of Islam, built as a knowledge graph in git (Astro site on GitHub Pages; no servers, no AI at runtime). Two earlier agents (Devin, then Antigravity) did the first part of this job and each stopped because it ran out of credits. Your job is to continue from exactly where it stopped. Nothing about the earlier work needs redoing; do not revert, rewrite or delete it.

0. SET UP YOUR OWN COPY (do this first, never work in the shared folder /Users/ahmedabdelaal/Documents/GitHub/islam-museum, other sessions use it)
   Your own clone already exists at ~/Documents/GitHub/islam-museum-kiro (leave the untracked .kiro/ folder alone, never commit it). Work only there.
   cd ~/Documents/GitHub/islam-museum-kiro && git fetch origin && npm ci
   git checkout -b content/raheeq-kiro origin/main   # if the branch exists already: git checkout content/raheeq-kiro && git pull --rebase origin main
   npm run validate     # must show 0 errors before you start
   npm test             # 32 tests must pass

1. READ FIRST (in the clone): docs/content-quality.md (mandatory: no honorifics, no Qur'an text, .md prose only, top-level sources, typed relations, attributed judgements), CLAUDE.md, docs/collaboration.md, docs/status.md, docs/scope.md, docs/language.md, docs/style-guide.md, docs/plan/02-content-model.md, docs/plan/05-editorial.md, and YOUR BOOK PLAN (given below). Look at 3 or 4 entities already merged from the same book (for example `git log --oneline origin/main | grep -E "raheeq|ibn-hisham"` and open files from the latest commit) and copy their exact shape, field names, citation style and prose voice. Consistency with what is on main matters more than your own preferences.

2. THE BOOK TEXT lives outside git, in the harvest workspace on the founder's Mac:
   ~/islam-museum-harvest/raw/books/<book folder>/   (a symlink to /Volumes/exmicroSD/islam-museum-harvest, the external drive must be mounted)
   It holds book.txt (OCR with page markers), pages.json, pages-png/ (page images, use them to verify any doubtful passage), toc and index files, README.md (known OCR errors) and, for the sira, PROGRESS.md and batches/ (claims tables Devin already built).
   NEVER copy the OCR text, page images or claims tables into the repository. Never paste the book's prose into museum prose. Quotations: verbatim, at most 40 words, in quotation marks, with the page.

3. RULES THAT NEVER BREAK (from CLAUDE.md; read it, these are the short version)
   - Arabic first: label.ar and summary.ar required; prose goes in content/ar/<class>/<slug>.md; no English prose (English optional later).
   - Voice: warm, precise, neutral docent. Describe, never prescribe. Short sentences. No honorifics typed into prose (no "صلى الله عليه وسلم", no "رضي الله عنه"; the UI renders them). Strip them from anything you extract.
   - Sunni frame is the default; any other view is allowed but must be labelled before it is stated. Contested topics use the perspectives block: Sunni position(s) first, then the academic view, then any other view, each cited and labelled. No verdicts. Never write "enemy of Islam" or equivalent in the museum's voice; describe the act and attribute the judgement.
   - Qur'an: never write, complete or quote ayah text. Reference passage/quran-<sura>-<aya> and add revealed_about edges with sources.
   - Dates: record exactly as the book gives them (EDTF + Hijri string + precision); never invent a date. Every dated fact needs the book page plus a second source, or confidence: low with a needs_source flag.
   - Every entity: label.ar, summary.ar, at least one source, a provenance block (generated_by, model, run, sources), and status.review: draft. NEVER mark anything reviewed or verified.
   - Relations use only schema/predicates.yaml; write each edge once (inverses are computed). IDs are class/slug, ASCII slugs, immutable. Before creating an entity, search data/ for an existing one (Arabic label and ASCII slug); reuse it and add to it. A duplicate becomes an alias, never a second entity. Unknown targets go in data/_stubs.d/<your-lane>.yaml with an Arabic label and class.
   - No figurative depictions of prophets or Companions. Maps describe terrain and movement only; coordinates only from docs/plan/16 section 6 or the place's Wikidata item (state which).
   - Licences: prose CC BY-SA, data CC0. The book is a copyrighted reference: facts, chronology, names, numbers and citations only.
   - Quality bar: no sentence stating a fact without {cite:...}; a reviewer must be able to open the page image and verify each claim in under a minute; capture every doubt marker the book prints, none silently dropped.

4. HOW TO WORK, ONE BATCH AT A TIME (at most 25 entities per batch; split a section if it is bigger)
   a. Find the next batch in the list below, read its pages from book.txt and look at the page images where the OCR is doubtful.
   b. Build a claims table in the harvest workspace (batches/ folder for the sira; a scratch file outside the repo for Raheeq). Do not commit it.
   c. Create/extend entities, write the Arabic prose, add stubs.
   d. npm run validate (must be 0 errors; warnings on your own new files should be fixed too) and npm test.
   e. Commit and push (section 5), then start the next batch.
   Do not stop to ask the founder questions. Use the stated rules and the best-supported reading, flag uncertainty in the entity (confidence: low, needs_source, a note) and in the batch report, and carry on.

5. COMMIT AND PUSH TO MAIN OFTEN (credits can run out at any moment; unpushed work is lost work)
   Commit every time something validates, at least after every ~10 entities and always at the end of each batch. Do not wait for the batch to finish. The sequence, every time:
     git fetch origin
     git add <explicit paths of your files only>       # NEVER git add -A or git add .
     git commit -m "content(<lane>): <section> pp. N-M (draft) [part k]"     # conventional commit
     git pull --rebase origin main                      # review what arrived; keep other people's work; resolve conflicts by combining, never by dropping their side
     npm run validate && npm test                       # must be clean after the rebase
     git push origin HEAD:main                          # straight to main (founder instruction)
     git push origin HEAD:<YOUR BRANCH NAME>            # keep your branch in sync too
   If the push is rejected because main moved, repeat fetch / pull --rebase / validate / push. If validate fails after a rebase because of someone else's file, do not edit or delete their file: fix your side, or if it is clearly theirs, note it in docs/status.md and push your part anyway only if your own files are clean. Never force-push. Never commit big files, dumps, OCR text, images or anything under datasets/ larger than a small CSV.
   Mid-batch partial commits are fine as long as validate passes (entities may be fewer than planned). Mention in the commit body what remains.

6. KEEP A HAND-OFF TRAIL so another session can resume if you run out too
   After every push, update docs/delegation/<lane>-progress.md (create it, keep it short): last batch completed and its pages, the batch in progress and what is done in it, open questions and flagged items, the exact next step. Commit and push it with the batch. Also update the matching row in docs/status.md (the "Parallel work" table) at the end of each batch. The harvest-side PROGRESS.md may be updated too but is not the source of truth.

7. END-OF-BATCH REPORT (put it in the final commit message body or the progress file): entities created/updated, count of claims, classical sources used, doubt markers captured, contested points flagged, OCR passages you verified on the image.

8. IF YOU FIND A SCHEMA GAP (a field, enum value or predicate you need that does not exist), do not edit schema/ or scripts/. Write docs/requests/<lane>-<topic>.md describing it and work around it (use a note field) until the maintainer session adds it.

LANE: raheeq          BRANCH NAME: content/raheeq-kiro
BOOK: «الرحيق المختوم» by صفي الرحمن المباركفوري (1943–2006). 512 pages, PDF page = printed page.
BOOK FOLDER: ~/islam-museum-harvest/raw/books/raheeq-makhtum/   (book.txt with "===== [pN] =====" markers, pages.json, pages-png/, toc.txt = pp. 495–512, bib.txt = pp. 489–494, README.md)
BOOK PLAN (read fully before starting): docs/plan/17-raheeq-makhtum.md, especially section 1 (rights: facts, chronology, names, places, numbers with a citation to the book page AND the classical source named in its footnote; quotes at most 40 words; never republish or paraphrase chapter by chapter), the claims table procedure, and the 27-batch order.
Source ids: source/mubarakpuri-raheeq (cite as {cite:mubarakpuri-raheeq p.N}) plus the classical source the book's footnote names, e.g. {cite:ibn-hisham 1/135}; every classical work in bib.txt becomes its own source entity so citations resolve (batch 27 does the complete list, but create any source you cite as you go, after checking it does not exist).
Status of claims: the book narrates the tradition, so facts are status: tradition unless an academic source supports historical or debated. Where the author argues a position (dates, routes, numbers), record it as his view with the page.
Reuse what is already on main: event/battle-of-badr and its children, journey/hijra, the persons and places from batches 1–8, the 67 persons and 12 groups by Devin's people lane (data/person, data/group), the ~80 places in data/place. Search before creating.

ALREADY DONE AND ON MAIN (do not redo): batches 1–10: Badr pp. 204–233; Hijra pp. 161–174; pp. 54–64; 65–77; 78–108; 109–124; 125–142; 143–160; batch 9 الحياة في المدينة pp. 175–203; batch 10 بين بدر وأحد pp. 233–247 (last commit 0720522). A hand-off file exists: docs/delegation/raheeq-progress.md (read it, then keep updating it; the previous branch content/raheeq-continue is fully merged, do not use it). Antigravity's clone ~/Documents/GitHub/islam-museum-antigravity is another session's folder: do not touch it. Another session is working on the Ibn Hisham book (branch content/ibn-hisham-continue) at the same time: follow the overlap rules below.

YOUR BATCHES, IN ORDER (start at 11):
11. غزوة أحد pp. 248–289 (map block + dataset; split into two batches)   12. بين أحد والأحزاب pp. 290–300   13. الأحزاب وبنو قريظة pp. 301–324 (Tier A contested: perspectives block mandatory)   14. بنو المصطلق والإفك pp. 325–336 (Tier A)   15. الحديبية pp. 337–348   16. مكاتبة الملوك pp. 349–361   17. خيبر pp. 362–379   18. السنة السابعة ومؤتة pp. 380–393   19. فتح مكة pp. 394–411 (map)   20. حنين والطائف pp. 412–423 (maps)   21. البعوث وتبوك pp. 424–439   22. حج أبي بكر والوفود pp. 440–457   23. حجة الوداع والوفاة pp. 458–472 (Tier A)   24. البيت النبوي والصفات pp. 473–488   25. العرب قبل الإسلام pp. 15–47   26. النسب والأسرة pp. 48–53   27. ثبت المراجع pp. 489–494 (source entities).
Overlap warning for batches 18–21: the other lane (Ibn Hisham, juz' 4) is creating events for the conquest of Mecca, Hunayn and Ta'if, Mu'ta, Tabuk and the delegations (event/conquest-of-mecca, battle-of-hunayn, siege-of-taif, battle-of-mutah, expedition-to-tabuk and children). ALWAYS reuse those IDs, add your book's page as an extra source and extra claims to them, and put new detail as has_part children only where the child does not already exist. Run `git pull --rebase origin main` before starting each of these batches and look at data/event/ again.
Branch for commits: content/raheeq-kiro; commit prefix: content(raheeq). Progress file: docs/delegation/raheeq-progress.md. Stubs file: data/_stubs.d/raheeq.yaml (check the exact filename already in use first: ls data/_stubs.d/).
Begin with batch 11a (أحد, first half): first check git log origin/main for any batch 11 commit already pushed, then write the files.
