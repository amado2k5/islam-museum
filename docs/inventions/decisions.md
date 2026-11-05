# Muslim Inventions Browser: decisions

## D-000 — Founder's standing authorization (4 November 2026)

The following ten points are transcribed verbatim from the founder's operative prompt. They govern this lane; they do not relax `AGENTS.md`, the change gates, source policy or no-go registry.

1. **Run unattended for as many hours as it takes.** Do not stop to ask a question. Do not wait for a human reply at any point. When a decision is needed, research it, decide it yourself by the rules in section 10, write the decision and its reasoning in `docs/inventions/decisions.md`, and continue.
2. **Install and use any tool on this Mac** that helps: Homebrew packages, `uv`/`pip` packages, `npm` packages, `aria2c`, `ia` (Internet Archive CLI), `ocrmypdf`, `tesseract` (ara, eng, fas, tur, urd), `poppler` (`pdftotext`, `pdftoppm`), `pandoc`, `ImageMagick`, `qpdf`, `ollama` / MLX with open-weight models for local drafts and translations, ComfyUI Desktop and Draw Things (already installed) for image generation, Apple Vision for OCR, Google Chrome for the web, Playwright for live checks, DuckDB/SQLite for indexes. Prefer what `docs/plan/15-local-harvest.md` already names. No paid service, no cloud model call from scripts (`AGENTS.md`: models only in the building phase; you are the model in the building phase).
3. **Download any book, PDF, map, image, dataset or page** that enriches the content: Wikipedia and Wikidata dumps or API pages, Internet Archive scans, HathiTrust full-view, public-domain editions of al-Jazari, the Banu Musa, Taqi al-Din, Ibn al-Haytham, al-Zahrawi, al-Razi, Ibn Sina, al-Biruni, Jabir, the Fihrist; museum collection records and open-access images (Met, British Museum, Smithsonian, Louvre, V&A, David Collection, Museum of Islamic Art Doha, Khalili, Istanbul Museum of the History of Science and Technology in Islam, Chester Beatty, Bodleian, BnF Gallica, Qatar Digital Library, Wellcome); Google Patents and USPTO records for modern inventions; EI2/EI3, DİA (`islamansiklopedisi.org.tr`), Encyclopaedia Iranica, MuslimHeritage/FSTC (leads only, section 6.3), Sezgin, Rashed, Hill, al-Hassan. **Everything downloaded lives outside git**, at `~/islam-museum-harvest/inventions/<source-slug>/` (create it; it is outside the repository and outside iCloud, per `docs/plan/15-local-harvest.md` §2). What enters git is only what `docs/sources-policy.md` allows: facts in `data/`, the museum's own prose, citations with page numbers, at most a 40-word cited quotation. Never commit a PDF, OCR text, page image, dump or claims table.
4. **The `submission-impacting` sign-off is granted in advance** for exactly this: adding the `invention` class (22 classes become 23), its enums and predicates, the `inventions:` ties on existing classes, and the new `/api/v1/invention/*`, `/api/v1/inventions.json` and `/api/v1/inventions/chains.json` routes. Label the commit `submission-impacting` and update the claims register (`docs/outreach/unesco-nomination-dossier.md` A.5) and the evidence map (`docs/outreach/dpga-evidence-map.md`) in the same commit, as `docs/ai-change-gates.md` §3 requires. Adding content inside the lane afterwards is `non-impacting`.
5. **Commit, push, open pull requests, and merge them yourself** once the local gates pass (`AGENTS.md`, canary workflow step 5; `main` accepts PRs only). Do not wait for review. Never force-push, never `git add -A`, never rewrite history, never overwrite another agent's work: three-way merge every time `origin/main` moved.
6. **Never deploy.** Merged is not live. Do not run `deploy.yml` or `deploy-uat.yml`, not by `gh workflow run`, not from the Actions tab. At the end of each phase write in `docs/inventions/progress.md` what the founder must deploy and whether a Worker or workflow file is among the merged files.
7. **Targets:** at least 100 inventions fully written and live-ready; then the next 100; then the next 100; and onward until the sources run dry (section 12). Never trade depth for count: the rich-first-pass rule of `docs/agents/content-standards.md` applies to every invention.
8. **Research freely, with every means on this Mac** (founder, 4 November 2026, 23:02): any book, any website, the museum's existing data; **the internet through Google Chrome on this Mac** (the installed browser, with its sign-ins, for pages that a script cannot fetch, for museum collection searches, Google Patents, HathiTrust full view, JSTOR or publisher pages the founder's accounts can open; read and take notes, never scrape in a way a site forbids, never commit what the sources policy keeps out); **any local AI model** (Ollama, MLX, ComfyUI, Draw Things) for drafts, translations, classification, embeddings and images, with the model named in the record's `provenance`; **Apple Vision** (the `Vision` framework through a short Swift or `pyobjc` script, or `macOS` Live Text) for OCR of scanned pages, maps and manuscript images in Arabic, Persian, Ottoman Turkish, Urdu and Latin scripts, alongside `tesseract` and `ocrmypdf`; keep the OCR text in the harvest folder, cite the page, and never commit it.
9. **Scope and order** (founder, 23:01): the inventions are those created by **Sunni Muslims**, in any field or domain, anywhere and at any time (section 3's inclusion rule says how the maker's faith and tradition are established and how the uncertain cases are handled); the work **begins with the first era of Islam and moves forward toward the present**, so the first hundred lean to the early centuries and each later hundred continues in time. **Every invention has an image**: an existing museum image, a free-to-use image found online, or an AI rendering of the invention produced through the museum's illustrations pipeline (section 8.3).
10. **Founder-supplied resources are approved** (founder, 4 November 2026): the Internet Archive copies of *1001 Inventions*, the CNN, National Geographic and History Hit articles, and anything else listed in section 6.3a may be read and used as that section says.

Scope of the sign-off is limited to the exact class, enums, predicates, existing-class ties and API routes named in item 4. Any other submission-impacting change requires its own approval and matching outreach updates. No deployment is authorized.

## D-001 — Use the existing `ideas` wing (4 November 2026)

**Question:** Which existing wing should invention records use?

**Rule applied:** Section 10 of the operative prompt says choose only from `schema/enums/wings.yaml`; no new wing is approved in Phase 0.

**Decision:** Use `ideas` consistently. `science` is not in the current enum, and the records primarily describe knowledge, techniques and systems rather than a new museum wing. Revisit only through an approved proposal if the taxonomy changes.

**Touches:** Phase 1 invention examples/schema and later invention records; no current data change.

## D-002 — Census measures recorded roles and prose literally (4 November 2026)

**Question:** How should the census count the prompt's scientist/person pool?

**Rule applied:** Reproduce the prompt's listed role signals while accounting for the repository's existing `roles:` and `story_roles:` shapes.

**Decision:** Count each requested role from both fields, de-duplicate persons for the pool total, and report per-role counts separately. The prose signal is exactly `invent|اختر|ابتكر` over English and Arabic prose files. These are leads, not invention claims.

**Touches:** `scripts/report/inventions-census.ts`, `docs/inventions/README.md`, and generated coverage.

## D-003 — Keep the current product version for Phase 0 (4 November 2026)

**Question:** Does the planning/census work require a release version bump?

**Rule applied:** `docs/engineering/15-release-notes-and-versioning.md` defines a minor bump for a new feature, page, wing, class or endpoint, and says other entries accumulate under the current version.

**Decision:** Phase 0 adds internal planning documents and a census command, but no reader-facing feature, data class, page or endpoint. Keep package version `0.1.0`; initialize the empty `CANARY.md` with a `v0.1.0` block and a reader-facing note. The schema/API and browser-home phases will receive the required minor bumps.

**Touches:** `CANARY.md`; no package version change.
