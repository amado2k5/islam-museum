// Leaves Hudhud's opening story the way a visitor does: by pressing its Skip button. A page that opens on the story
// would otherwise hide the Atlas from every tool that wants to play. It does nothing where there is no opening (the
// UAT host may still serve an older build), and there is no hidden way round it in the game.
import type { Page } from "playwright-core";

/** Returns true if the opening was showing and has been skipped. */
export async function leaveOpening(page: Page): Promise<boolean> {
  const story = page.locator(".prologue");
  if ((await story.count()) === 0 || !(await story.isVisible())) return false;
  await story.getByRole("button", { name: /^(Skip the opening|تخطَّ البداية|آغاز چھوڑیں|Passer le début|Saltar el comienzo|Girişi atla|Lewati pembukaan)$/ }).click();
  await page.locator(".hub").waitFor({ state: "visible" });
  return true;
}
