/**
 * SEO helpers shared by layouts.
 *
 * truncateDesc caps meta/OG descriptions at ~155 characters so search
 * results show a complete sentence instead of prose cut mid-word.
 * Cutting prefers Arabic/Latin sentence enders (. ؟ ! …), then word
 * boundaries. Null-safe: null/undefined/empty input returns "".
 */
const MAX_DESC = 155;
const ENDERS = [".", "؟", "?", "!", "…"];

export function truncateDesc(input: string | null | undefined): string {
  if (!input) return "";
  const text = input.replace(/\s+/g, " ").trim();
  if (text.length <= MAX_DESC) return text;
  const slice = text.slice(0, MAX_DESC);
  let cut = -1;
  for (const e of ENDERS) {
    const i = slice.lastIndexOf(e);
    if (i > cut) cut = i;
  }
  if (cut > 40) return slice.slice(0, cut + 1).trim();
  const space = slice.lastIndexOf(" ");
  if (space > 40) return slice.slice(0, space).trim() + "…";
  return slice.trim() + "…";
}
