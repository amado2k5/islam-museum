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
  // Removed duplicate entities: the old URL leads to the surviving entity. GitHub Pages cannot send 301s, so these are
  // generated pages with a meta refresh and a canonical link.
  redirects: {
    "/ar/event/hatib-letter-to-quraysh/": "/ar/work/hatib-letter-to-quraysh/",
    "/ar/work/amr-ibn-salim-istighatha/": "/ar/event/khuzaa-appeal-to-medina/",
  },
  i18n: {
    locales: ["ar"],
    defaultLocale: "ar",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    svelte(),
    sitemap({ i18n: { defaultLocale: "ar", locales: { ar: "ar" } } }),
  ],
  vite: { plugins: [tailwindcss()], server: { fs: { allow: [".."] } } },
});
