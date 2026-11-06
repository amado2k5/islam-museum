import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://islam.museum",
  outDir: "../dist",
  trailingSlash: "always",
  // The stylesheet is small (~22KB when this was written, ~64KB now) and the only render-blocking resource; inlining it into each
  // page removes the html → css → font critical chain that Lighthouse measured at ~2s on every page.
  // It stays inline on purpose. Linking it as a file with a stable name (so that a CSS edit would not rewrite every page on the next
  // deploy) was built and measured on 6 Nov 2026: +200 to +350 ms first contentful paint in Lighthouse's mobile profile, and
  // /ar/index.html and /ur/index.html fall to 0.93-0.94 against the 0.95 gate lighthouserc.json had then (they sat at 0.95; the founder lowered the minimum to 0.90 the same day, which linking the sheet would now meet at a real cost to first paint).
  // docs/engineering/16-deploy-churn-proposal.md, section "What was built and what was not".
  build: { format: "directory", inlineStylesheets: "always" },
  // Renamed-entity redirects live in site/public/_redirects; Cloudflare Pages serves them as edge 301s.
  i18n: {
    locales: ["ar", "en", "ur"],
    defaultLocale: "ar",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    svelte(),
    sitemap({ i18n: { defaultLocale: "ar", locales: { ar: "ar", en: "en", ur: "ur" } } }),
  ],
  vite: { plugins: [tailwindcss()], server: { fs: { allow: [".."] } } },
});
