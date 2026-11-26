// Hudhud's first script. It is small on purpose: it asks the platform's device check whether the game can be played
// here, and only then fetches the game itself (the engine and everything else). On a phone, a small screen, an
// unsupported browser or a device without the graphics, nothing heavy is downloaded and a plain page says why.
import { gate } from "@im/platform/gate";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const asked = new URLSearchParams(location.search).get("lang") ?? "";
const lang = LANGS.includes(asked) ? asked : "en";
document.documentElement.lang = lang;
document.documentElement.dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
const hook = ((window as unknown as { __HH__?: Record<string, unknown> }).__HH__ ??= { ready: false, error: null });

void gate({
  root: document.getElementById("app")!,
  lang,
  museum: `https://islam.museum/${lang}/`,
  about: async () => {
    const s = (await import(`../../i18n/${lang}.json`)).default as Record<string, string>;
    return { title: s.title!, text: [s.hub_note!, s.review_note!, s.privacy!] };
  },
  refused: (reasons) => {
    hook.unsupported = reasons;
    hook.error = `unsupported: ${reasons.join(", ")}`;
  },
  pass: () => {
    hook.unsupported = null;
    hook.error = null;
    void import("./app");
  },
});
