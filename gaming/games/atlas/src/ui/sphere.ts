// The sphere behind the Atlas globe, as arithmetic: where a place is on it, how it is turned so that a chosen place
// faces the viewer, and where a place then falls in the window. Pure, so that it can be held to the 2D globe's own
// projection by a test: the lit sphere and the pins drawn over it must be the same picture to the pixel, or a guess
// would be dropped on one coast and scored on another.
export type Vec3 = [number, number, number];
export interface SphereView {
  /** The place the view looks at, in degrees. */
  lon: number;
  lat: number;
  /** The globe's radius and centre in the window, in CSS pixels. */
  radius: number;
  cx: number;
  cy: number;
}
const RAD = Math.PI / 180;

/**
 * Where a place is on a unit sphere laid out as Three.js lays out its own: north toward +Y, longitude 0 toward +X,
 * and 90 degrees east toward -Z, so that a map of the whole world with Greenwich at its middle wraps it correctly.
 */
export function spherePoint(lat: number, lon: number): Vec3 {
  const phi = lat * RAD;
  const lambda = lon * RAD;
  return [Math.cos(phi) * Math.cos(lambda), Math.sin(phi), -Math.cos(phi) * Math.sin(lambda)];
}

/** The turn that brings a place to face the viewer on +Z with north up: first about Y, then about X (radians). */
export function viewTurn(lat: number, lon: number): { x: number; y: number } {
  return { x: lat * RAD, y: -Math.PI / 2 - lon * RAD };
}

/** A point after that turn. */
export function turned(p: Vec3, turn: { x: number; y: number }): Vec3 {
  const x = p[0] * Math.cos(turn.y) + p[2] * Math.sin(turn.y);
  const z = -p[0] * Math.sin(turn.y) + p[2] * Math.cos(turn.y);
  return [x, p[1] * Math.cos(turn.x) - z * Math.sin(turn.x), p[1] * Math.sin(turn.x) + z * Math.cos(turn.x)];
}

/** Where a place falls in the window, seen without perspective, and whether it is on the near side of the globe. */
export function onScreen(lat: number, lon: number, view: SphereView): { x: number; y: number; front: boolean } {
  const p = turned(spherePoint(lat, lon), viewTurn(view.lat, view.lon));
  return { x: view.cx + view.radius * p[0], y: view.cy - view.radius * p[1], front: p[2] > 0 };
}
