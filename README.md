# islam.museum

An open, free, all-digital museum of Islam: the faith, the civilization, the peoples, the places, the ideas, the objects and the living culture, from its origins to today.

- **Live:** https://islam.museum (bilingual, English and Arabic)
- **Plan:** [`docs/plan/`](docs/plan/00-README.md): vision, content model, architecture, experience, editorial policy, roadmap, prompts, prior art, AI content pipeline, image generation, Made directory, Screen index (films and television about Islam in every language), figures on every side of the story, the Themes atlas, and the local harvest that runs on a Mac
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
