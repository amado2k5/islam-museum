import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://islam.museum",
  outDir: "../dist",
  trailingSlash: "always",
  build: { format: "directory" },
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
