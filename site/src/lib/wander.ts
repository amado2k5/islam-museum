// The pages the Wander button can lead to: every record except the reference apparatus and single verses.
import { href, realNodes } from "./graph";
import type { Lang } from "./i18n";
/** Paths under /<lang>/, in graph order. */
export const wanderPool = (lang: Lang): string[] =>
  realNodes.filter((n) => !["source", "media", "dataset"].includes(n.class) && !(n.class === "passage" && n.data.unit === "ayah")).map((n) => href(lang, n.id).replace(`/${lang}/`, ""));
