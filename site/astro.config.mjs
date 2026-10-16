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
    "/ar/person/ikrama-ibn-abi-jahl/": "/ar/person/ikrima-ibn-abi-jahl/",
    "/en/person/ikrama-ibn-abi-jahl/": "/en/person/ikrima-ibn-abi-jahl/",
    "/ar/person/kaab-ibn-zuhayr/": "/ar/person/kab-ibn-zuhayr/",
    "/en/person/kaab-ibn-zuhayr/": "/en/person/kab-ibn-zuhayr/",
    "/ar/person/muthim-ibn-adi/": "/ar/person/mutim-ibn-adi/",
    "/en/person/muthim-ibn-adi/": "/en/person/mutim-ibn-adi/",
    "/ar/person/mu-awiya-ibn-abi-sufyan/": "/ar/person/muawiya-ibn-abi-sufyan/",
    "/en/person/mu-awiya-ibn-abi-sufyan/": "/en/person/muawiya-ibn-abi-sufyan/",
  },
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
