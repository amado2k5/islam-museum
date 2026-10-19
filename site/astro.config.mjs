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
    sitemap({ i18n: { defaultLocale: "ar", locales: { ar: "ar", en: "en", ur: "ur" } } }),
  ],
  vite: { plugins: [tailwindcss()], server: { fs: { allow: [".."] } } },
});
