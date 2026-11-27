// The player's choice of text size for the game's panels: the root's font size, which every size given in rem follows.
// Kept on the device under one key for all the museum's games, so a choice made in one is the choice in the next.
export const TEXT_SIZES = { normal: "100%", large: "112.5%", larger: "125%" } as const;
export type TextSize = keyof typeof TEXT_SIZES;
const KEY = "im.games.text-size";
export function readTextSize(): TextSize {
  try {
    const v = localStorage.getItem(KEY);
    return v && v in TEXT_SIZES ? (v as TextSize) : "normal";
  } catch {
    return "normal";
  }
}
export function applyTextSize(size: TextSize, keep = true): void {
  document.documentElement.style.fontSize = TEXT_SIZES[size];
  if (!keep) return;
  try {
    localStorage.setItem(KEY, size);
  } catch {
    // Storage unavailable: the choice holds for this visit.
  }
}
