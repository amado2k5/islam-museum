# islam.museum

An open, free, all-digital museum of Islam: the faith, the civilization, the peoples, the places, the ideas, the objects and the living culture, from its origins to today.

- **Live:** https://islam.museum (Arabic first, with English and Urdu live, and French and Spanish editions completed and merged, going live at the next deployment)
- **Browsers and explorers:** front doors over the one graph, each a different way to walk the same records: the Time Browser, the Time Machine and Hijri calendar, the Screening Room, the Qur'an, hadith and poetry readers, the Fatwa and Khutab explorers, the Job Browser, the Inventions Browser and the Modern Islam Browser (the last fifty years, plan 26). Every one is in the graph, exported in the API and indexed by search; the register with routes, status, what each has and what it will have is [`docs/site/browsers.md`](docs/site/browsers.md)
- **Plan:** [`docs/plan/`](docs/plan/00-README.md): vision, content model, architecture, experience, editorial policy, roadmap, prompts, prior art, AI content pipeline, image generation, Made directory, Screen index (films and television about Islam in every language), figures on every side of the story, the Themes atlas, and the local harvest that runs on a Mac
- **API:** a static, read-only JSON API under `/api/v1/` (every record, every class, the graph, and one export per browser), documented in [`docs/data/README.md`](docs/data/README.md)
- **Deploy:** GitHub Actions builds `site/` into `dist/`, uploads the HTML pages, search indexes, API JSON, data, maps, images and media to Cloudflare R2 and publishes only code and logic to Cloudflare Pages (founder rule, 28 Oct 2026) (`.github/workflows/deploy.yml`; `docs/plan/03-architecture.md` §1)

## How it works

Content is a knowledge graph in git: language-neutral YAML facts in `data/<class>/<slug>.yaml` and Markdown prose per language in `content/<lang>/<class>/<slug>.md`. A TypeScript pipeline validates it (JSON Schema, EDTF and Hijri dates, link resolution, licences), compiles it into a graph, and an Astro site renders every entity page in each language.

```bash
npm install && npm install --prefix site
npm run validate   # schema, dates, links, licences, alt text, prose links
npm test           # Hijri anchor tests and pipeline tests
npm run build      # validate → graph → derive → api → astro → pagefind  (output: dist/)
npm run dev        # compile, then astro dev
npm run coverage   # writes docs/coverage.md
```

Add content by copying a file from [`templates/`](templates/) (see [CONTRIBUTING.md](CONTRIBUTING.md)). Predicates live in `schema/predicates.yaml`; the JSON Schemas in `schema/` are generated from `schema/enums/*.yaml` by `npm run schema`.

Licences: code MIT · prose CC BY-SA 4.0 · structured data CC0 · media per item ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)).

## Scholarly record and citation

- **Dataset:** archived on Zenodo. Cite the **concept DOI**, which always resolves to the newest snapshot: https://doi.org/10.5281/zenodo.23692511. Each snapshot also carries its own version DOI — use one only to pin the exact state you worked from. [`CITATION.cff`](CITATION.cff) at the root gives GitHub's "Cite this repository" entry, and the site's Cite page (`/{lang}/cite/`) carries the copy-ready citation, BibTeX, RIS and the dataset's schema.org `Dataset` markup.
- **Description paper:** Abdel Aal, A. (2026). *islam.museum: A Citable Open Knowledge Graph and Digital Museum of Islamic History — Resource Description, Method and Validation State* (v1.0) [Preprint]. Zenodo. CC BY 4.0. Cite all versions: https://doi.org/10.5281/zenodo.24273662 · this version: https://doi.org/10.5281/zenodo.24273663. The paper describes the graph, the compilation method and the validation state; its deposit package is kept in [`docs/outreach/whitepaper-2026/`](docs/outreach/whitepaper-2026/), and the engineering record of the whole scholarly apparatus is [`docs/engineering/53-scholarly-record.md`](docs/engineering/53-scholarly-record.md).
- **Author:** Ahmed Abdel Aal — ORCID [0009-0000-9215-2906](https://orcid.org/0009-0000-9215-2906). The dataset and the paper both reach the ORCID record through DataCite.

**Independence:** islam.museum is its founder's personal project, directed by him alone. Its management, ownership and decisions are never shared; it is not for sale; it will never be merged into another project or placed under any government, religious, corporate or foundation umbrella or oversight. Help of every kind — feedback, volunteering, funding, materials, testing, code, writing, marketing — is welcome and credited, and confers no control. Stated in full in the [Founder's Charter](docs/plan/00-founders-charter.md) (Article 7) and in [GOVERNANCE.md](GOVERNANCE.md).

**Free use, no warranty:** everything the museum publishes is free for anyone to use in any way — including cloning or forking the whole codebase to start a similar, modified or new project, against which the founder pledges no copyright claims. The museum may change anything at any time, without prior consent, approval or notice to anyone; it offers no service-level agreement and no warranty, and accepts no liability for anyone's use or reuse of its content. Charter Article 8 and [GOVERNANCE.md](GOVERNANCE.md) state the terms in full.

**Not for profit, not for an agenda:** the museum is not run for profit or gain, pursues no agenda, and serves no government or corporate need. It is free for everyone — no subscriptions, no tracking, and no use or sale of anyone's information. Its running costs are real and continuing: volunteers are welcome, and anyone may donate as they wish, with no commitment, no obligation and no control in return. A separate online gift shop / bazaar is planned for the future (no ads, no spam, no soliciting). Contact: press@islam.museum (press and media), copyright@islam.museum (copyright claims), concerns@islam.museum (any other concerns). Charter Article 9 states this in full.

**Affiliated with no one; an archive, not an author:** the website and its owner are not affiliated with, sponsored by, managed by, owned by, or under the jurisdiction or control of any government, corporation, business or organisation of any type. The museum stands against hate, hate speech and harm — against Islamophobia, antisemitism, racism, genocide and ethnic cleansing — and for diversity, difference of opinion and peace. It is an archive and library of human heritage: the content it presents was authored by the people it records (AI-generated material is labelled), their views are theirs alone, and the museum endorses no one, preaches nothing, and offers no consultation, services or advice of any kind. It claims no copyright, patent or ownership over anything it presents, and offers no incentive, money or gain to anyone to visit, view, apply, market, talk about or advertise it — no one is obligated to visit at all, and anyone who comes does so by their own free will. Charter Article 10 states this in full.
