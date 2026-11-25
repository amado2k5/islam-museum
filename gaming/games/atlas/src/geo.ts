// Spherical geometry for Atlas. Distances are great-circle distances on a sphere of the Earth's mean radius
// (IUGG, 6371.0088 km); the error against the ellipsoid is under 0.6%, far below the game's tolerance.

export const EARTH_RADIUS_KM = 6371.0088;
const RAD = Math.PI / 180;

/** Longitude wrapped to [-180, 180). */
export const wrapLon = (lon: number): number => ((((lon + 180) % 360) + 360) % 360) - 180;
export const clampLat = (lat: number): number => Math.max(-90, Math.min(90, lat));

/** Great-circle distance in kilometres (haversine form, stable for small distances and across the antimeridian). */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = clampLat(lat1) * RAD;
  const p2 = clampLat(lat2) * RAD;
  const dp = p2 - p1;
  const dl = (wrapLon(lon2) - wrapLon(lon1)) * RAD;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Initial bearing from point 1 to point 2, degrees clockwise from north in [0, 360). */
export function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * RAD;
  const p2 = lat2 * RAD;
  const dl = (lon2 - lon1) * RAD;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return ((Math.atan2(y, x) / RAD) % 360 + 360) % 360;
}

/** Point a fraction t of the way along the great circle from 1 to 2 (for drawing the reveal line). */
export function interpolate(lat1: number, lon1: number, lat2: number, lon2: number, t: number): [number, number] {
  const p1 = lat1 * RAD;
  const l1 = lon1 * RAD;
  const p2 = lat2 * RAD;
  const l2 = lon2 * RAD;
  const d = distanceKm(lat1, lon1, lat2, lon2) / EARTH_RADIUS_KM;
  if (d < 1e-9) return [lat1, lon1];
  const a = Math.sin((1 - t) * d) / Math.sin(d);
  const b = Math.sin(t * d) / Math.sin(d);
  const x = a * Math.cos(p1) * Math.cos(l1) + b * Math.cos(p2) * Math.cos(l2);
  const y = a * Math.cos(p1) * Math.sin(l1) + b * Math.cos(p2) * Math.sin(l2);
  const z = a * Math.sin(p1) + b * Math.sin(p2);
  return [Math.atan2(z, Math.hypot(x, y)) / RAD, wrapLon(Math.atan2(y, x) / RAD)];
}

/** The century a year falls in, by the Common Era count: 1 to 100 is the 1st, 701 to 800 is the 8th. */
export const centuryCE = (year: number): number => Math.floor((year - 1) / 100) + 1;
