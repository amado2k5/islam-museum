// Where things are. Granada's region is drawn from the museum's own coordinates, never from a concept image: the
// third image of the package puts Málaga and Almería side by side on one shore beside the city, and they are
// neither beside each other nor beside Granada, which is inland.
//
// Distances are great-circle distances, in whole metres so that rules built on them stay in integers. A road or a
// sea lane is longer than the straight line; a route's real length is data for the transport system, and it may
// never be shorter than what this file returns.

export type LatLon = readonly [lat: number, lon: number];

const R = 6_371_008.8; // mean Earth radius, metres
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in whole metres. */
export function metresBetween(a: LatLon, b: LatLon): number {
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}

/**
 * Position on a flat map centred on `origin`, in metres: x grows to the east and y to the north, whatever the
 * language of the screen. A right-to-left interface mirrors its panels, never the land.
 */
export function onMap(origin: LatLon, p: LatLon): { x: number; y: number } {
  return { x: Math.round(rad(p[1] - origin[1]) * Math.cos(rad(origin[0])) * R), y: Math.round(rad(p[0] - origin[0]) * R) };
}

/** The eight-point compass direction from one place to another. */
export function directionTo(from: LatLon, to: LatLon): "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" {
  const { x, y } = onMap(from, to);
  const turn = Math.round(((Math.atan2(x, y) * 180) / Math.PI + 360) / 45) % 8;
  return (["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const)[turn]!;
}
