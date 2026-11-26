// The valley's camera: it looks at a point on the land from a distance, a heading and a tilt, and stays over the
// worked ground. Pure arithmetic, so its limits can be tested. Heading 0 looks north; a quarter turn looks east,
// which is how the valley is first seen: fields in front, the hill town beyond, the snow range behind.
import { BOUNDS } from "./valley";

export interface Pose {
  tx: number;
  ty: number;
  tz: number;
  yaw: number;
  pitch: number;
  distance: number;
}
export const LIMITS = { minDistance: 70, maxDistance: 980, minPitch: (7 * Math.PI) / 180, maxPitch: (76 * Math.PI) / 180 } as const;
export const FOV = 38;
export const START: Pose = { tx: 30, ty: 6, tz: 70, yaw: Math.PI / 2 - 0.16, pitch: (10 * Math.PI) / 180, distance: 600 };
export const OVERVIEW: Pose = { tx: 60, ty: 6, tz: 40, yaw: Math.PI / 2, pitch: (52 * Math.PI) / 180, distance: 860 };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function clampPose(p: Pose, groundAt: (x: number, z: number) => number): Pose {
  const tx = clamp(p.tx, BOUNDS.x0, BOUNDS.x1);
  const tz = clamp(p.tz, BOUNDS.z0, BOUNDS.z1);
  // The camera looks a little above the land it is over, more so from far off, so that the horizon and the range
  // behind the valley stay in the picture.
  return { tx, ty: groundAt(tx, tz) + 0.085 * clamp(p.distance, LIMITS.minDistance, LIMITS.maxDistance), tz, yaw: Math.atan2(Math.sin(p.yaw), Math.cos(p.yaw)), pitch: clamp(p.pitch, LIMITS.minPitch, LIMITS.maxPitch), distance: clamp(p.distance, LIMITS.minDistance, LIMITS.maxDistance) };
}
/** Where the camera is, for a pose. At heading 0 it stands south of its target and looks north. */
export function eyeOf(p: Pose): [number, number, number] {
  const flat = Math.cos(p.pitch) * p.distance;
  return [p.tx - Math.sin(p.yaw) * flat, p.ty + Math.sin(p.pitch) * p.distance, p.tz + Math.cos(p.yaw) * flat];
}
/** Slides the target across the land: `right` and `forward` are metres in the view's own directions. */
export const pan = (p: Pose, right: number, forward: number): Pose => ({ ...p, tx: p.tx + Math.cos(p.yaw) * right + Math.sin(p.yaw) * forward, tz: p.tz + Math.sin(p.yaw) * right - Math.cos(p.yaw) * forward });
export const zoom = (p: Pose, factor: number): Pose => ({ ...p, distance: p.distance * factor });
export const turn = (p: Pose, dYaw: number, dPitch: number): Pose => ({ ...p, yaw: p.yaw + dYaw, pitch: p.pitch + dPitch });
/** Moves a pose part of the way toward a goal. */
export function approach(p: Pose, goal: Pose, k: number): Pose {
  const dyaw = Math.atan2(Math.sin(goal.yaw - p.yaw), Math.cos(goal.yaw - p.yaw));
  return { tx: p.tx + (goal.tx - p.tx) * k, ty: p.ty + (goal.ty - p.ty) * k, tz: p.tz + (goal.tz - p.tz) * k, yaw: p.yaw + dyaw * k, pitch: p.pitch + (goal.pitch - p.pitch) * k, distance: p.distance + (goal.distance - p.distance) * k };
}
