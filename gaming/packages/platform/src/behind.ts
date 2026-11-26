// The few lines every game's first script needs to stand behind the device check: read the language, make a place
// for the refusal page beside the game's own markup, keep the game's markup out of sight if the device is refused,
// and fetch the game only when it may play. A game passes its own strings and its own import, so that a bundler
// sees them where they are.
import { gate } from "./gate";
import type { Needs, Reason } from "./preflight";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];

export interface Behind {
  /** The game's own container, hidden while the device is refused. */
  app: HTMLElement;
  needs?: Needs;
  /** The game's name and a few sentences about it, in the visitor's language. */
  about: (lang: string) => Promise<{ title: string; text: string[] }>;
  /** Fetches and starts the game. */
  start: () => unknown;
  /** Told of a refusal, for the game's own test hook. */
  refused?: (reasons: Reason[]) => void;
}

export function behindTheGate(o: Behind): void {
  const asked = new URLSearchParams(location.search).get("lang") ?? "";
  const lang = LANGS.includes(asked) ? asked : "en";
  const root = document.createElement("div");
  o.app.before(root);
  const was = { lang: document.documentElement.lang, dir: document.documentElement.dir };
  void gate({
    root,
    lang,
    needs: o.needs,
    museum: `https://islam.museum/${lang}/`,
    about: () => o.about(lang),
    refused: (reasons) => {
      o.app.style.display = "none";
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
      o.refused?.(reasons);
    },
    pass: () => {
      root.remove();
      o.app.style.display = "";
      // The game sets its own language and direction when it starts; what the refusal page set is undone first.
      document.documentElement.lang = was.lang;
      document.documentElement.dir = was.dir;
      void o.start();
    },
  });
}
