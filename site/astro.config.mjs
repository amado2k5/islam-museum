import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://islam.museum",
  outDir: "../dist",
  trailingSlash: "always",
  // The stylesheet is small (~22KB) and the only render-blocking resource; inlining it into each page removes the
  // html → css → font critical chain that Lighthouse measured at ~2s on every page.
  build: { format: "directory", inlineStylesheets: "always" },
  // Renamed-entity redirects live in site/public/_redirects; Cloudflare Pages serves them as edge 301s.
  i18n: {
    locales: ["ar", "en", "ur"],
    defaultLocale: "ar",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    svelte(),
    sitemap({
      i18n: { defaultLocale: "ar", locales: { ar: "ar", en: "en", ur: "ur" } },
      // noindex and redirect stubs must not be offered to crawlers
      filter: (page) => {
        const path = new URL(page).pathname;
        if (/\/embed\//.test(path)) return false;
        if (/\/search\/$/.test(path)) return false;
        if (/\/time-browser\/all\/$/.test(path)) return false;
        if (/\/learn\/facts\/poster\/$/.test(path)) return false;
        if (/\/print\/$/.test(path)) return false;
        if (/\/404\/$/.test(path)) return false;
        // Old per-stop pages (/time-browser/<kind>/<slug>/) are meta-refresh stubs. The stage lives under /time-browser/s/.
        if (/\/time-browser\/(event|person|place|polity|period|theme|work|concept|practice)\//.test(path)) return false;
        return true;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()], server: { fs: { allow: [".."] } } },
});
