You are continuing a content-mining job on islam.museum, an open, free, static, Arabic-first digital museum of Islam, built as a knowledge graph in git (Astro site on GitHub Pages; no servers, no AI at runtime). Another agent (Devin) did the first part of this job and stopped because it ran out of credits. Your job is to continue from exactly where it stopped. Nothing about the earlier work needs redoing; do not revert, rewrite or delete it.

0. SET UP YOUR OWN COPY (do this first, never work in the shared folder /Users/ahmedabdelaal/Documents/GitHub/islam-museum, other sessions use it)
   git clone https://github.com/amado2k5/islam-museum.git ~/islam-museum-<lane>   # <lane> = raheeq or hisham
   cd ~/islam-museum-<lane> && npm ci
   git checkout -b <YOUR BRANCH NAME, given below> origin/main
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

LANE: hisham          BRANCH NAME: content/ibn-hisham-continue
BOOK: «السيرة النبوية» of Ibn Hisham (recension of Ibn Ishaq), juz' 4, ed. السقا والأبياري وشلبي, مطبعة البابي الحلبي 1355هـ/1936م. 376 PDF pages. PRINTED PAGE = PDF PAGE − 4 (cite the printed page).
BOOK FOLDER: ~/islam-museum-harvest/raw/books/sira-ibn-hisham/   (book.txt, pages.json, pages-png/, toc.json and toc.txt = فهرس الموضوعات printed 358–367, bib.txt, index-people/tribes/places.txt, ghazwat-index.txt, README.md = OCR error list, PROGRESS.md and batches/ with the claims tables Devin built for batches 1–3: read them to see the format and the level of detail expected)
BOOK PLAN (read fully before starting): docs/plan/18-sira-ibn-hisham.md: especially section 1 (two layers: the classical text is public domain but quotes stay at most 40 words; the editors' footnotes and indexes are copyrighted reference: facts and citations only, never their notes verbatim), the procedure, the 10 extraction rules and the 23-batch order.
Source ids: source/ibn-hisham-saqqa-1936 (cite as {cite:ibn-hisham-saqqa 4/N}), work/sira-ibn-ishaq-ibn-hisham; each work in bib.txt becomes a source entity. Record the isnad head the book names («قال ابن إسحاق: حدثني الزهري…») in the claim note. Every doubt marker (قال ابن هشام، عن غير ابن إسحاق، ويقال، يُشك فيه، ويُروى) becomes status: debated or confidence: low with the marker quoted in the note. Status of claims: tradition by default. Dates exactly as the book words them («جمادى الأولى سنة ثمان» becomes hijri 0008-05, precision month); never invent a day.
OCR traps (see README.md): جعفر misread جمفر (verify the name on the image every time), الحبشة, الحديبية, هاشم, مكة, بني تميم; margin rubrics appear as short stray lines; trailing digits on lines are printed line numbers.
Reuse what is already on main from batches 1–3: event/conquest-of-mecca and children, battle-of-hunayn, siege-of-taif, spoils and Ji'rana events, the datasets in datasets/ (fath-mecca-contingents.csv, hunayn-martyrs.csv, jirana-grants.csv, taif-martyrs.csv, prophetic-battles.csv), the persons and places. Search before creating. The other lane (Raheeq) also touches these events: reuse IDs, add your sources, never duplicate.

ALREADY DONE AND ON MAIN (do not redo): batch 1 فتح مكة pp. 31–69 (1a and 1b); batch 2 حنين والطائف pp. 80–129 (2a and 2b); batch 3 أموال هوازن والمؤلفة والجعرانة pp. 130–143.

YOUR BATCHES, IN ORDER (start at 4; Tier A = contested, perspectives block mandatory and Sunni position first):
4. مؤتة pp. 15–30 (map, martyrs)   5. مهاجرة الحبشة pp. 3–11 (roster, three batches by clan: هاشم/عبد شمس/أسد ؛ تيم/جمح/سهم/عدي/عامر/الحارث ؛ بقية القبائل والمهاجرات)   6. تبوك pp. 159–172 (journey, Ayla)   7. مسجد الضرار والثلاثة pp. 173–181 (passage edges)   8. الوفود ١ pp. 200–222   9. الوفود ٢ pp. 222–245   10. الوفود ٣ pp. 246–247   11. حجة الوداع pp. 248–253 + رسل إلى الملوك 254–255   12. جملة الغزوات والسرايا pp. 256–257 (datasets)   13. السرايا ١ pp. 257–274 (فزارة وأم قرفة is Tier A)   14. السرايا ٢ pp. 275–291 (أبو عفك and أسماء are Tier A)   15. بنو جذيمة والعزى pp. 70–79 (Tier A)   16. كعب بن زهير pp. 144–158 (work)   17. وفد ثقيف وحج أبي بكر وبراءة pp. 182–199 (prayer over Ibn Ubayy is Tier A)   18. عمرة القضاء pp. 12–14   19. المرض والوفاة pp. 291–305 (Tier A: Umar's denial)   20. سقيفة بني ساعدة pp. 306–311 (Tier A: perspectives mandatory, the Sunni account first, then academic, then any other labelled view, each cited, no verdict)   21. الجهاز والدفن pp. 312–322   22. أزواجه pp. 293–298 (wives dataset)   23. الفهارس pp. 325–368 (source entities + reconciliation).
Overlap warning for batches 4, 6, 11, 18 with the Raheeq lane (Mu'ta, Tabuk, Farewell Pilgrimage, umrat al-qada): the Raheeq agent will reach those events later. If an event already exists on main when you start the batch, extend it; if it does not, create it with the ID from docs/plan/18 (event/battle-of-mutah, event/expedition-to-tabuk, event/farewell-pilgrimage, event/umrah-of-qada) so the other lane finds and reuses it. Run `git pull --rebase origin main` and re-check data/event/ before each batch.
Branch for commits: content/ibn-hisham-continue; commit prefix: content(ibn-hisham). Progress file: docs/delegation/hisham-progress.md. Stubs file: check `ls data/_stubs.d/` and use the file the earlier ibn-hisham batches used; if none, data/_stubs.d/ibn-hisham.yaml.
Begin with batch 4: if batches/04-*.claims.md does not exist in the harvest workspace, build it first, then write the files.

ATTRIBUTION (mandatory, docs/collaboration.md "attribution trailers"): end EVERY commit message with these trailers, filled in truthfully (use "unknown" if you cannot tell the version; never guess):
   AI-Agent: <your agent/tool name>
   AI-Model: <your model name and exact version>
   AI-Editor: <the editor/host you run in>
Also put the same agent/model values in each entity's provenance block.
