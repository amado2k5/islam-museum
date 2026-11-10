# Prompt: finish Ibn Hisham juz' 4 (batches 8–23)

You are continuing a content-mining job on islam.museum, an open, free, static, Arabic-first digital museum of Islam built as a knowledge graph in git (Astro on GitHub Pages; no servers, no AI at runtime). Earlier sessions finished batches 1–7. Continue exactly from there. Never redo, revert, rewrite or delete other sessions' work.

## 0. Setup (own worktree, never the shared folder)
```
git clone https://github.com/amado2k5/islam-museum.git ~/islam-museum-<lane> && cd ~/islam-museum-<lane> && npm ci
git checkout -b content/ibn-hisham-batch-<N> origin/main
npm run validate   # 0 errors before you start
npm test
```
(If you already have a clone: `git worktree add ../islam-museum-<lane> -b content/ibn-hisham-batch-<N> origin/main`; do not commit a `node_modules` symlink.)

## 1. Read first
CLAUDE.md, docs/delegation/antigravity-prompt-hisham.md (the full operating procedure and rules, sections 1–8; follow it, except step 0 above), docs/content-quality.md, docs/collaboration.md (including the mandatory attribution trailers), docs/scope.md, docs/language.md, docs/style-guide.md, docs/plan/02-content-model.md, docs/plan/05-editorial.md, docs/plan/18-sira-ibn-hisham.md (chapter map in §3), docs/delegation/hisham-progress.md. Then open 3–4 entities from the latest ibn-hisham commits (`git log --oneline --grep=ibn-hisham -15`; the Tabuk and Masjid al-Dirar batches are the freshest) and copy their exact shape, fields, citation style and voice. Consistency with main beats your preferences.

## 2. The book
«السيرة النبوية» of Ibn Hisham (recension of Ibn Ishaq), juz' 4, ed. السقا والأبياري وشلبي, Cairo 1355 AH / 1936. Source id `source/ibn-hisham-saqqa-1936`, cited as `{cite:ibn-hisham-saqqa 4/N}` with the PRINTED page (printed = PDF page − 4). Text is in the harvest workspace on the founder's Mac, outside git: `~/islam-museum-harvest/raw/books/sira-ibn-hisham/` (book.txt, pages.json, pages-png/ page images, toc.txt, index-people/tribes/places.txt, bib.txt, ghazwat-index.txt, README.md = OCR errors, batches/ = earlier claims tables to copy the format). Never copy OCR text, images or claims tables into the repo. Quotes: verbatim, ≤ 40 words, in quotation marks, with page. The editors' footnotes and indexes are copyrighted reference: facts and citations only. Verify every doubtful name on the page image (known traps: جعفر misread جمفر, ابن/بن, trailing digits are line numbers).

## 3. Rules that never break
- Arabic first: label.ar and summary.ar required; prose in content/ar/<class>/<slug>.md only; no English prose.
- Voice: warm, precise, neutral docent. Describe, never prescribe. No honorifics typed in prose. Sunni frame is default; any other view is labelled before it is stated. Contested topics use `perspectives`: Sunni first, then academic, then any other labelled view, each cited, no verdict. Never write "enemy of Islam" or equivalent; describe the act, attribute the judgement.
- Never write or quote Qur'an text; use passage/quran-<sura>-<aya> with `revealed_about` edges.
- Dates exactly as the book words them (EDTF + Hijri string + precision); never invent a day. Every dated fact: book page + second source, or confidence: low + needs_source.
- Every entity: label.ar, summary.ar, ≥ 1 source, provenance block (generated_by, model, run, sources), status.review: draft. NEVER mark reviewed/verified.
- Relations only from schema/predicates.yaml; write each edge once. IDs are `class/slug`, ASCII, immutable. Search data/ (Arabic label and ASCII slug) before creating; reuse and extend; duplicates become aliases. Unknown targets go in data/_stubs.d/ibn-hisham.yaml.
- Every doubt marker the book prints («قال ابن هشام»، «ويقال»، «عن غير ابن إسحاق»، «يُشك فيه»، «يُروى»، «فيما يزعمون») becomes status: debated or confidence: low with the marker quoted; none silently dropped. Record the isnad head in the claim note.
- Places: no coordinates unless from docs/plan/16 §6 or the place's Wikidata item (state which); otherwise leave empty with a note.
- No figurative depictions of prophets or Companions. Licences: prose CC BY-SA, data CC0.
- Max 25 entities per commit; split a section into a, b, c… A schema gap → write docs/requests/hisham-<topic>.md, do not edit schema/ or scripts/.

## 4. Remaining batches (printed pages). Tier A = contested: perspectives mandatory.
Already done: batches 1–7 (pp. 3–11, 15–69, 80–181 except 144–158) and Mu'ta. Do these, in this order (independent ones may run in parallel in separate worktrees):
- 8  الوفود ١ pp. 200–222
- 9  الوفود ٢ pp. 222–245
- 10 الكذابان والعمال pp. 246–247
- 11 حجة الوداع pp. 248–253 + رسل إلى الملوك pp. 254–255 (extend event/farewell-pilgrimage; Farewell Sermon work; al-nasi concept; Usama's commission)
- 12 جملة الغزوات والسرايا pp. 256–257 (datasets: Ibn Ishaq's own count and lists)
- 13 السرايا ١ pp. 257–274 (فزارة وأم قرفة is Tier A)
- 14 السرايا ٢ pp. 275–291 (أبو عفك وأسماء بنت مروان are Tier A)
- 15 بنو جذيمة والعزى pp. 70–79 (Tier A; violence sensitivity)
- 16 كعب بن زهير pp. 144–158 (work «بانت سعاد»)
- 17 وفد ثقيف وحج أبي بكر وبراءة pp. 182–199 (prayer over Ibn Ubayy is Tier A; ~15 sura-9 passage edges)
- 18 عمرة القضاء pp. 12–14 (extend event/umrah-of-qada; marriage to Maymuna)
- 19 المرض والوفاة pp. 291–305 (Tier A: Umar's denial)
- 22 أزواجه pp. 293–298 (wives dataset: mahr, previous husband)
- 20 سقيفة بني ساعدة pp. 306–311 (Tier A, most sensitive: Sunni account first, then academic, then any other labelled view, each cited, no verdict)
- 21 الجهاز والدفن pp. 312–322 (washers, grave, janaza practice, Hassan's elegy)
- 23 الفهارس pp. 325–368 (source entities from bib.txt; reconcile index-people/tribes/places against existing entities, aliases not duplicates)

Also open: stubs place/al-balqa and place/maab; coordinates for places still lacking them (see notes on each place); the unsourced `needs_source` perspectives in the Dirar and three-left-behind entities.
Before each batch: `git fetch origin`, read what arrived on main, re-check data/event/ and data/person/ for existing entities (another lane, Raheeq, touches the same events; reuse IDs, add your sources).

## 5. Commit and push (credits can run out; unpushed work is lost)
After every ~10–25 validated entities, and at the end of each batch:
```
git fetch origin
git add <explicit paths>          # NEVER git add -A / git add .
git commit                         # conventional message, see trailers below
git pull --rebase origin main      # keep others' work; combine on conflict, never drop their side
npm run validate && npm test       # 0 errors, all tests pass
git push origin HEAD:main          # founder instruction: straight to main; never force-push
```
Every commit message ends with:
```
Co-Authored-By: <your model> <noreply@...>

AI-Agent: <tool/agent you run as>
AI-Model: <exact model name and version, or "unknown">
AI-Editor: <editor or host you run in>
```
Mirror agent/model into each entity's provenance. After each push update docs/delegation/hisham-progress.md (last batch, in progress, open flags, exact next step) and the Ibn Hisham row of docs/status.md. Do not ask the founder questions: use the stated rules, flag uncertainty in the entity, carry on.

## 6. End-of-batch report (in the progress file or commit body)
Entities created/updated, claims count, classical sources used, doubt markers captured, contested points flagged, passages verified on the page image, what remains.
