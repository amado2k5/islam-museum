// The few lines every game's first script needs to stand behind the device check: read the language, make a place
// for the refusal page beside the game's own markup, keep the game's markup out of sight if the device is refused,
// and fetch the game only when it may play. A game passes its own strings and its own import, so that a bundler
// sees them where they are.
import { gate } from "./gate";
import { openBackup, type Backup } from "./save/backup";
import { openStore } from "./save/idb";
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
  /**
   * The game's id, if what it keeps in localStorage under "im.<id>." is to be backed up to the vault and put back
   * when it has gone missing (save/backup.ts). For a game whose own saving is not yet in the vault.
   */
  backup?: string;
}

/** Opens the backup and puts back what is missing, before the game reads its storage. Never throws, never waits long. */
async function backedUp(game: string): Promise<Backup | null> {
  if (new URLSearchParams(location.search).get("fresh") === "1") return null;
  try {
    const store = await openStore(undefined, 1500);
    const backup = await openBackup(store, window.localStorage, game, () => Date.now());
    (window as unknown as { __IM_BACKUP__: Backup }).__IM_BACKUP__ = backup;
    // Copied when the page is hidden or left, and every fifteen seconds while something has changed.
    const copy = () => void backup.save();
    document.addEventListener("visibilitychange", () => document.hidden && copy());
    window.addEventListener("pagehide", copy);
    window.setInterval(copy, 15_000);
    return backup;
  } catch {
    return null;
  }
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
      if (o.backup) void backedUp(o.backup).then(() => o.start());
      else void o.start();
    },
  });
}
