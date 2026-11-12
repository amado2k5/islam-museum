# Ingesting a curriculum course: the runbook

This is the whole procedure for bringing one school course into islam.museum. An agent with no other briefing can run it from top to bottom. Read it all once before you start. Then do the steps in order and keep the run log (step 0).

**What you are making.** A student studying an ordinary school subject should meet Islamic civilisation inside that subject, in the lessons of their own curriculum, with every claim cited. You will turn one official curriculum course into a tree of `course` records, link each lesson to real records of the museum's knowledge graph, and write short enrichment texts from what those records already say.

**What "done" means.** Three gates, each a literal string printed by a command:

1. `python3 scripts/courses/check_course.py course/<subject> --official <file> --strict` prints `RESULT: GREEN`.
2. `npm run validate` prints `0 errors` (see step 8 if the repository was already failing before you started).
3. `npx tsx scripts/cite-check.ts <every id you created>` prints `0 fail`.

## The rules that never bend

1. **The authority's own publication only.** Expectations come from the ministry, board or national curriculum body that issued them, fetched by you. Never a summary site, a teacher blog, a textbook publisher or your memory. If you cannot fetch the official text, stop and report; do not work around a block.
2. **Nothing from general knowledge.** A connection text restates what the linked museum record already says, and cites only sources that record already cites. If the record does not say it, you do not write it, however true you believe it is.
3. **Never invent, never stretch.** A lesson links a record only because the lesson's own expectations justify it. No record after an honest search means a gap-register entry, not a new entity and not a loose match.
4. **Search before you say "absent".** Run the alias search with at least three spellings (English, Arabic, a transliteration or the slug) before declaring a gap. Most "missing" records exist under another name.
5. **Everything you produce is `status.review: draft`.** You never mark anything published. Publication is a human act.
6. **A translation is a translation.** Every text you write is written in Arabic first, then English, then Urdu, and all three are required (`ar`, `en`, `ur`). Each says the same thing in its own words. A text is never copied from one language into another: the gate fails a byte copy.
7. **The museum's standing rules apply.** Read `AGENTS.md` and `docs/agents/content-safety.md` before writing. In particular: no typed honorifics; Qur'an text is never typed, paraphrased or completed, only referenced; a neutral docent's voice that describes and attributes; a parenthetical containing Arabic script is wrapped in U+2066 … U+2069; verbatim text from any source is at most 40 words per quotation.
8. **Mirror the schema.** Use only the fields and values of `schema/course.schema.json` as the existing records use them. If something real cannot be expressed, write it under "Proposals" in your run log. Do not add a field.

## 0. Before you start

```bash
git fetch origin && git status          # your own branch; untracked files of another process may be present: leave them alone
npm run graph                           # builds .cache/graph.json; the search tools read it. It takes about two minutes:
                                        # run it in the background or with a long timeout. If you were told the graph is
                                        # already built for you (a fleet run), do not run it.
date -u +%Y-%m-%dT%H:%MZ                # note the time; take every time in your log from this command, never from memory
```

Open a run log at `docs/courses/runs/<subject-slug>.md` and write to it as you go, not afterwards: the time each step started, every command that failed, every place this runbook was unclear or wrong, every judgement call. The log is evidence, and the runbook is repaired from it.

Read two existing records before writing any: `data/course/ca-on-g6-science.yaml` (a subject) and `data/course/ca-on-g6-sci-bio-1.yaml` (a lesson), with `content/ar/course/ca-on-g6-sci-bio-1.md`. Copy their **shape**. Do not copy their **faults**, which the audit lists (`docs/courses-mission/AUDIT.md` section 3): expectation texts that are not the authority's, Arabic that is a copy of the English, links to records that do not exist, and sources the linked record never cites.

## 1. Fetch and archive the authority's document

For Ontario, the Ministry's curriculum site is a JavaScript application whose text comes from the Ministry's own public content service. The fetcher reads that service:

```bash
python3 scripts/courses/fetch_ontario.py --list "Grade 4"                       # find the Ministry's exact course name
python3 scripts/courses/fetch_ontario.py "SSHG - Grade 4" ontario-sshg-2023-g4  # <Ministry course name> <archive slug>
```

It writes the raw files under `.cache/curricula/<slug>/` (never committed) and a small manifest at `docs/courses/curricula/<slug>.json` (committed): the addresses, the time, the sha256 of each file and the counts. `official.json` is the extraction every later step reads.

For any other authority there is no fetcher yet. Download the official document yourself into `.cache/curricula/<slug>/`, write `official.json` by hand in the same shape (`strands[] → overall[] → specific[]`, each with `code` and `text`, the text exactly as published), and write the manifest with the same fields. If the authority's document has no codes, stop and write a proposal: the schema requires a code, and inventing one is not yours to do.

Print what you fetched and read all of it before deciding anything:

```bash
python3 -c "import json;d=json.load(open('.cache/curricula/<slug>/official.json'));[print(s['code'],'|',s['text']) for st in d['strands'] for o in st['overall'] for s in o['specific']]"
```

## 2. The curriculum source record

Every course record cites the curriculum as a `source/` record. **For Ontario, one command finds or makes it:** `python3 scripts/courses/ontario_source.py <archive slug>` prints the source id to cite (it reuses a record that already carries the curriculum's address, or writes one from the Ministry's manifest, the same bytes whoever runs it). Ontario's grade records `course/ca-on-g1` … `course/ca-on-g12` already exist: reuse yours, never create or edit one.

For another authority, look first: `ls data/source | grep -i <authority>`. If one exists for this document, use it and do not edit it (an older source record may say the museum "quotes nothing" from the curriculum; that note predates this pipeline and is the founder's to update, not yours). If none exists, create `data/source/<id>.yaml` in the shape of `data/source/ontario-science-tech-2022.yaml`: the title, the authority as author and publisher, the year, the authority's own URL, `status: { review: draft, completeness: 2, generated_by: "<you, the model, the date>" }`. This is the only kind of new source you may create.

## 3. Plan the tree

Ids are `course/<slug>`; a slug is lower-case letters, digits and hyphens, and is permanent.

| Level | `kind` | Slug pattern | Example |
|---|---|---|---|
| School system | `jurisdiction` | `<country>-<region>-<board>` | `ca-on-english` (exists: reuse it) |
| Grade | `grade` | `<country>-<region>-g<n>` | `ca-on-g4` |
| Subject | `subject` | `<grade slug>-<subject>`; for a secondary course with a course code, `<grade slug>-<code in lower case>` | `ca-on-g4-social-studies`, `ca-on-g11-hrt3m` |
| Strand | `unit` | `<subject slug>-<strand letter>` | `ca-on-g2-social-studies-a` |
| Lesson | `lesson` | `<strand slug>-<n>` | `ca-on-g2-social-studies-a-1` |

Every record you create below the grade begins with your subject's slug, so no two courses can ever collide. (The pilot and the proof course used shorter strand slugs, `ca-on-g6-sci-…` and `ca-on-g4-ss-…`; ids are permanent, so they stay.)

Reuse a jurisdiction or grade record that already exists (`ls data/course`). Never create a second record for the same school system or grade.

**Lessons are your grouping of the authority's specific expectations.** The authority publishes expectations, not lessons. Group two to four specific expectations that belong together into one lesson, following the authority's own order and headings. Write the plan in your run log as a table: lesson slug, working title, expectation codes. An expectation may appear in one lesson only.

Do not finalise the plan yet. Step 4 decides which expectations can be lessons at all.

## 4. Map each planned lesson into the graph

For each planned lesson, ask: *which records of the museum would a student of exactly these expectations be glad to meet?* Search, do not recall:

```bash
python3 scripts/courses/find_entity.py "Baghdad" "بغداد" "Madinat al-Salam"      # any number of spellings; at least three
python3 scripts/courses/find_entity.py --class polity "Mali" "مالي" "Mali Empire"
python3 scripts/courses/entity_brief.py place/baghdad                           # everything you may write from
```

`find_entity.py` lists real records and, apart, stubs. **A stub is not a record: never link one.** `entity_brief.py` prints the record's facts, its prose and the sources it cites. Read the brief before choosing a record: a record with no prose and a one-line summary gives you nothing to write from, so it cannot carry a connection.

`entity_brief.py` cuts long prose to its first 2,500 characters per language; add `--full` before restating anything from further down.

**Adjacent is not a link.** Name the noun in the expectation that the record actually contains. "Governments consult the public" is not served by a record of a ruler consulting his advisers; "night sky" is not served by a daytime eclipse; "symmetry" is not served by a record that only says a pattern exists. If the Brief would have to say the record lacks the very thing the expectation asks for, there is no lesson.

A link is honest when you can finish this sentence from the expectation's own words and the record's own text: "The expectation asks the student to ___; this record shows ___." Write that sentence in your run log for every link. If you cannot, there is no link.

**When an expectation asks for more than the museum holds.** Many expectations ask the student to study "a few" or "some" things and name one the museum cannot supply (Ontario's Grade 4 asks for "a few early societies, including at least one First Nation and one Inuit society"). The museum may serve its part and only its part: the lesson links the records it honestly has, and its Brief says in plain words what the museum offers here and what the class must bring from elsewhere. That is a lesson. If the whole object of the expectation lies outside the museum (the provinces of Canada, a First Nation's governance), it is a gap. Never write as if the museum's part were the whole.

**Fit the grade.** An honest link is not enough: the record's subject must suit the age of the student. In an elementary lesson (Kindergarten to Grade 8) do not link a record whose subject is slavery, concubinage or the sale of people; killing, torture, mutilation or the detail of a battle; sexual matters; or graphic disease, famine or death. It does not matter how well the record fits or how neutrally the card is worded (the fleet's first run put a record on singing slave women into Grade 2, 3 and 4 Arts lessons; it fitted the music expectation and was removed). In a secondary lesson such a record may be linked when the expectation itself reaches the subject, with the card kept to what the expectation asks. If the only fitting record is unsuitable, the expectation is a gap: say why in the register. Health and medicine need the same care at every grade: a card never reads as advice (a remedy, a diet, a ruling on what a sick person may do); it says who held a view, and when.

Each lesson gets one to three connections. Aim for one `before`, one `within`, one `after` when the records support it; one good connection is better than three thin ones.

**The gap register.** An expectation for which you find no honest link does not become a lesson. It goes into `docs/courses/gaps/<subject-slug>.yaml`:

```yaml
course: course/ca-on-g4-social-studies
gaps:
- code: B3.5
  text: "identify Canada’s provinces and territories and their capital cities, …"   # exactly quote_official() of the official text, see step 5
  why: The expectation is about the political map of Canada; the museum holds no record on Canadian provinces.
  searches:
  - 'find_entity.py "Ontario" "أونتاريو" "Ottawa": no real record'
  - 'find_entity.py --class place "Canada" "كندا": place/canada has no prose'
```

At least two searches per entry, each with what it returned. Search by the expectation's **topic**, not only by proper names: the museum files daily life, social order and economy under concept records as well as under people and places (a fresh verifier refuted four of the proof run's gaps by searching "tribe", "kinship", "pre-Islamic" and "Jahiliyya", which the run never tried). Try the Arabic topic words too. `grep -ril "<word>" content/en/concept content/ar/concept | head` finds records the label search misses. A whole strand may go to the register; then that strand gets no `unit` record. A whole course may go to the register: then you create no record at all, write the register and the run log, and report "gap only". That is a valid, honest outcome and not a failure. Every specific expectation of the document ends in exactly one place: a lesson, or the register.

Skills expectations (research, inquiry, communication, safety) name no subject matter; they go to the register with the reason "skills expectation: names no subject matter" and two searches are not needed for them: write `searches: ["none: skills expectation", "none: skills expectation"]`.

Now finalise the lesson plan from what survived.

## 5. Write the records

**Expectation text and the 40-word rule.** The repository stores at most 40 words of any source verbatim, and official expectations are usually longer because of their example lists. The stored form is produced by one function and by nothing else:

```bash
python3 -c "import sys,json;sys.path.insert(0,'scripts/courses');from lib import quote_official;d=json.load(open('.cache/curricula/<slug>/official.json'));[print(s['code'],'|',quote_official(s['text'])) for st in d['strands'] for o in st['overall'] for s in o['specific']]"
```

It replaces each `(e.g., …)` list with `[…]` and cuts what is still over 40 words, ending it with ` …` (the `[…]` mark is not counted as a word). What is stored is the official wording with its examples omitted, not the full official text: say it that way. Paste its output as the `en` text (or the authority's language). Do not retype, tidy or shorten it yourself: the gate compares the bytes.

Translate each expectation into Arabic and into Urdu for real. Keep the marks: `[…]` stays where an example list stood, and a cut text ends with ` …` in every language. In Arabic and Urdu, wrap any parenthetical that contains Arabic script in U+2066 … U+2069 (write the two characters themselves, as the existing records do).

**The records.** One file per record under `data/course/`, in the pilot's field order.

```yaml
# a lesson
id: course/ca-on-g4-ss-a-1
class: course
kind: lesson
label:
  en: <a short title a student of that grade understands>
  ar: <the same in Arabic>
  ur: <the same in Urdu>
summary:
  en: <one sentence: what the lesson asks, from the expectations>
  ar: <the same in Arabic>
  ur: <the same in Urdu>
sources:
- source/<the curriculum source>
status:
  review: draft
  completeness: 1
  generated_by: <agent>; <model id>; courses pipeline (docs/courses-mission/PIPELINE.md); <date>
part_of: course/ca-on-g4-ss-a
expectations:
- code: A1.1
  text:
    en: <quote_official output, byte for byte>
    ar: <your Arabic translation>
    ur: <your Urdu translation>
connections:
- position: before            # before | within | after
  kind: place                 # reflection story scholar invention career quran hadith place object: nothing else
  title:
    en: <a title>
    ar: <the same in Arabic>
    ur: <the same in Urdu>
  text:
    en: <40 to 80 words>
    ar: <the same in Arabic, written first>
    ur: <the same in Urdu>
  entity: place/baghdad       # a real record, from step 4
  sources:
  - source/<a source that record cites>
order: 1
```

Four things that have cost earlier runs a failed gate:

- **`order` is distinct among siblings.** A subject's units are `order: 1, 2, 3 …`; a unit's lessons likewise.
- **Quote YAML scalars that contain `: `, `#`, or start with a quote, bracket or `§`.** If you generate the files with a script, dump them with a YAML library.
- **Urdu is Arabic script.** The U+2066 … U+2069 wrap applies to Urdu parentheticals exactly as to Arabic ones.
- **cite-check takes the ids as separate words.** The shell here is zsh, which passes a variable holding several ids as ONE word (cite-check then says `record-exists: no file`). Write them inline: `npx tsx scripts/cite-check.ts $(ls data/course | grep '^<subject slug>' | sed 's/.yaml//; s|^|course/|')`.
- **Secondary courses are listed by their course code** (`--list HRT`), not by grade.
- **`find_entity.py` takes 10 to 30 seconds a call** when a fleet is running: run several searches in the background or in parallel, never in a long foreground loop.
- **The Ministry's course names are exact**, suffixes included (`SSHG - Grade 3 (2023)`, not `SSHG - Grade 3`): take the name from `--list`.

A `unit` has `label`, `summary`, `sources`, `status`, `part_of` (the subject), `lessons:` (its lessons in order), `expectations:` (the strand's **overall** expectations, code and `quote_official` text, translated) and `order`. A `subject` has `subject_name`, `curriculum_ref` (the document's title and year) and `lessons:` (its units in order). A `grade` has `grade_number`, `country`, `region`. Copy the pilot's records for the exact shape.

**Choosing `kind`.** The list is closed. A scholar is `scholar`; a city, region or building is `place`; a made thing is `object` or `invention`; a ruler, a state, an event or a journey is `story`. If none fits, use the nearest and note it under "Proposals".

**Writing a connection text.**

- Write the Arabic first, then the English, then the Urdu, all saying the same thing.
- Every factual clause restates a sentence in the record's brief. Keep to what that sentence says: its dates, its names, its numbers, its hedges ("it is said", "about"). No superlative ("the first", "the greatest") unless the record states it.
- Each language follows the record's prose in that language: the Arabic text restates the Arabic record's own words, the English the English record's. If the record's Arabic and English disagree (a different verb, a missing clause), say so in your run log and write only what both say. Do not swap a term for a near-synonym the record does not use (a "ruler" is not a "sultan"; "largest" is not "greatest"; a "well" is not a "pit").
- **Name who holds a view.** A ruling, a remedy, a judgement of worth or a cause is always attributed to the person or body that holds it, by name: "the Kuwaiti encyclopaedia of jurisprudence records that the jurists hold…", "al-Razi writes…". Never "the record says", and never in the museum's own voice. If the record itself states the view with no attribution, do not copy it: it is not a fact you can restate.
- **A superlative needs a source that can carry it.** A record that cites only Wikidata or Wikipedia supports names, dates and places, not "the noblest", "the greatest" or "the first". (The fleet's first run copied "the most honoured of the Islamic arts" from such a record into eleven lessons.)
- **Read the whole record before you build on it,** with `--full`, including its `needs_source` marks and anything it reports from a poll, a panel or an audience. A record that reports a television debate or a preacher's talk is evidence of what was said there, not of the subject; do not offer it beside an expectation that asks for the subject itself (a lecturer's management talks are not "major psychological theories"). A record that carries hateful or conspiratorial content, even as a reported opinion, is never linked: write it up under "Records for the founder" in your run log.
- **A religious ruling is not a safety, health or technical standard.** A purity test is not a water-quality test; a ruling on fasting is not dietary guidance. If the expectation asks for the standard, the ruling is a gap.
- **Cite what a reader can see.** Restate only sentences that appear in the record's prose in that language. A sentence that exists only in the data file's notes is not on the page a student opens.
- **Check the nouns and units across your three languages** before you finish: the same thing, the same unit, the same number in each.
- Keep the record's hedges and its separations. If the record gives one author's claim and says another author does not confirm it, do not set the two side by side as if they agreed.
- A year in Arabic or Urdu carries its era (`م` or `هـ`), as the record writes it.
- Do not say "the record quotes" unless the record prints a quotation; say what the record says.
- `sources:` lists the sources the restated sentences cite in the record, and no other. They must appear under "SOURCES THIS RECORD CITES" in the brief.
- Tie it to the lesson in one closing clause or question. That clause is yours; it states no new fact.
- Docent's voice: describe, attribute, do not preach, do not judge.
- **Qur'an.** A `quran` connection has `ref: '<sura>:<aya>'`, `entity: passage/quran-<sura>-<aya>`, and `sources: [source/tanzil-quran]` only. The page prints the verse from the museum's frozen text. Your text does not quote, translate or paraphrase the verse and does not say what it means: it invites the student to read it and asks a question that links it to the lesson. Use a Qur'an connection only when a record the lesson already links cites that verse.
- **Evidence.** For every connection add a row to `docs/courses/evidence/<subject-slug>.md`: lesson, entity, each claim you made, and the sentence of the record it restates (quote at most 40 words) with its citation marker. A reviewer will check your texts against these rows and against the record pages. Give a row for each claim in each language: the Arabic text is checked against the Arabic record, and a quotation in this table is the record's words exactly, not your paraphrase.

## 6. Write the prose

Every record needs `content/ar/course/<slug>.md`, `content/en/course/<slug>.md` and `content/ur/course/<slug>.md`, with front matter:

```
---
id: course/<slug>
lang: ar            # en in the English file, ur in the Urdu file
source_lang: ar     # the language you wrote first
translators: []     # in the en and ur files: [<your agent name>]
---
```

A lesson's prose is short and says nothing the curriculum does not:

- `## Brief` (Arabic file: `## موجز`; Urdu file: `## مختصر`): in plain words for the student, what this lesson asks them to be able to do. Two or three sentences, from the expectations. End it with `{cite:<curriculum source slug>}`.
- One or two sections, each headed by a question the expectations raise, with two or three sentences on what to look for or compare. Method, not facts: do not state history, geography or science here. Facts reach the student through the connections, where they are cited.
- `## Try this` (Arabic: `## جرّب هذا`; Urdu: `## یہ آزمائیں`): one activity that uses a record the lesson links, by name.

The jurisdiction, grade, subject and unit files are one `## Brief` each: what it is, in two sentences, cited to the curriculum source.

## 7. Run the gate

```bash
npm run graph
python3 scripts/courses/check_course.py course/<subject-slug> --official .cache/curricula/<slug>/official.json --strict --save
```

`--save` keeps the output at `docs/courses/gates/check-<subject-slug>.out`, with the course's other files. (In a fleet run, skip `npm run graph` here: the gate reads the record files directly.)

Fix what fails and run it again. Each failing line names the record and the reason. The checks are: TREE, DRAFT, SOURCE, FIDELITY, COVERAGE, LANGUAGE, MAPPING, PROVENANCE, GAPS, PROSE. Never edit the checker to pass.

## 8. Run the repository's gates

```bash
npm run validate 2>&1 | tail -3                              # must print: 0 errors
npx tsx scripts/cite-check.ts course/<id> course/<id> …      # every record you created; its last line must contain: 0 fail
```

The validator takes about ten minutes and covers the whole repository. In a fleet run you are told to skip it: the coordinator runs it once over everyone's work. Run cite-check always.

If `validate` reports errors, read them. Errors in files you created are yours to fix. If every error is in a file you did not touch, the repository was already failing: record the error lines in your run log, state that none is in your files, and go on. Do not edit another lane's records.

## 9. Ship

Only after the three gates. One course is one pull request.

1. `npm run coverage` (regenerates `docs/coverage.md`; entities changed).
2. Add a `CANARY.md` entry under the current version block, under `### Data`: which course, how many lessons and connections, how many expectations went to the gap register, that everything is draft, and that no Urdu was written.
3. Commit explicit paths only (never `git add -A`): `data/course/…`, `content/ar/course/…`, `content/en/course/…`, the source record if you created one, `docs/courses/…`, `docs/coverage.md`, `CANARY.md`. End the message with the `AI-Agent:`, `AI-Model:` and `AI-Editor:` trailers.
4. `git fetch origin` and merge what landed; resolve conflicts by keeping both sides; never force-push.
5. Push and open the pull request against the branch you were told to target.
6. Report: the three gate lines, the counts, the gap register, and every "Proposals" item. Merged is not live: deployment is the founder's.

## What the surface does with your records

Nothing else is needed for the course to appear. The courses home (`/[lang]/learn/courses/`), the course map and every lesson page are generated from the records. A lesson page shows the Brief and expectations, the `before` connections, the sections with the `within` connections between them, "Try this", the `after` connections, and a self-check built from the lesson's own links. To see it: `python3 scripts/courses/scoped_build.py` and open `.cache/courses-dist/en/learn/courses/<subject-slug>/index.html`.

## Proposals: what the schema cannot say yet

Record these in your run log; do not act on them.

- **Connection kinds.** The closed list has no `ruler`, `state`, `event`, `document` (a treaty, a covenant) or `institution` (an office, a hospital); history courses use `story`, `place`, `invention` or `career` for them.
- **Codes.** A curriculum with no expectation codes cannot be ingested.
- **The full official wording.** Texts over 40 words are cut. A link from each expectation to the authority's page for it would restore the rest without storing it.
- **Pinning a card.** A `within` connection cannot name the section it follows; the page spaces them evenly.
