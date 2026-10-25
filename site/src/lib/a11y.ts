// schema.org accessibility properties shared by every JSON-LD object the site emits.
// Values must only claim what is actually shipped (see docs/outreach/unesco-nomination-dossier.md
// and the /[lang]/accessibility/ statement): features below are universal — alt text in the page
// language, landmarks, high contrast, transformable display, table of contents — while
// braille/signLanguage/captions join the list only when those phases land (A5/A9/A8).
import { ui, type Lang } from "./i18n";
import { SITE } from "./graph";

export const a11yLd = (lang: Lang) => ({
  accessibilityFeature: ["alternativeText", "structuralNavigation", "readingOrder", "highContrastDisplay", "displayTransformability", "tableOfContents"],
  accessMode: ["textual", "visual"],
  accessModeSufficient: ["textual"],
  accessibilityHazard: ["noFlashingHazard", "noMotionSimulationHazard", "noSoundHazard"],
  accessibilityControl: ["fullKeyboardControl", "fullMouseControl", "fullTouchControl", "fullVideoControl", "fullAudioControl"],
  accessibilitySummary: ui(lang).accessibility.ld_summary,
  publishingPrinciples: `${SITE}/${lang}/accessibility/`,
});
