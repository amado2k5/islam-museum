// The board camera: it looks at a point on the ground from a distance, a heading and a tilt, and stays over the
// district. Pure arithmetic (no engine types), so the limits are unit-tested and any renderer can use it.
import { BOARD, QUAY } from "./layout";

export interface CameraPose {
  /** The point on the ground the camera looks at. */
  tx: number;
  tz: number;
  /** Heading in radians: 0 looks north (the river behind the viewer), positive turns the view clockwise seen from above. */
  yaw: number;
  /** Tilt above the horizon in radians. */
  pitch: number;
  /** Metres from the camera to the point it looks at. */
  distance: number;
}

export const CAMERA_LIMITS = { minDistance: 60, maxDistance: 620, minPitch: (24 * Math.PI) / 180, maxPitch: (78 * Math.PI) / 180, margin: 30 } as const;
export const CAMERA_FOV = 32;

export const START_POSE: CameraPose = { tx: -66, tz: -88, yaw: 0.32, pitch: (38 * Math.PI) / 180, distance: 330 };
export const OVERVIEW_POSE: CameraPose = { tx: 0, tz: -118, yaw: 0, pitch: (52 * Math.PI) / 180, distance: 540 };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function clampPose(p: CameraPose): CameraPose {
  const m = CAMERA_LIMITS.margin;
  return {
    tx: clamp(p.tx, BOARD.x0 - m, BOARD.x1 + m),
    tz: clamp(p.tz, BOARD.z0 - m, QUAY + m),
    yaw: Math.atan2(Math.sin(p.yaw), Math.cos(p.yaw)),
    pitch: clamp(p.pitch, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch),
    distance: clamp(p.distance, CAMERA_LIMITS.minDistance, CAMERA_LIMITS.maxDistance),
  };
}

/** Where the camera is, for a pose. */
export function eyeOf(p: CameraPose): [number, number, number] {
  const flat = Math.cos(p.pitch) * p.distance;
  // At yaw 0 the camera stands south of its target (+Z) and looks north.
  return [p.tx - Math.sin(p.yaw) * flat, Math.sin(p.pitch) * p.distance, p.tz + Math.cos(p.yaw) * flat];
}

/** Slides the target across the ground: `right` and `forward` are metres in the view's own directions. */
export function pan(p: CameraPose, right: number, forward: number): CameraPose {
  const c = Math.cos(p.yaw);
  const s = Math.sin(p.yaw);
  return clampPose({ ...p, tx: p.tx + c * right + s * forward, tz: p.tz + s * right - c * forward });
}

export const zoom = (p: CameraPose, factor: number): CameraPose => clampPose({ ...p, distance: p.distance * factor });
export const turn = (p: CameraPose, dYaw: number, dPitch: number): CameraPose => clampPose({ ...p, yaw: p.yaw + dYaw, pitch: p.pitch + dPitch });

/** Moves a pose a fraction of the way toward a goal (frame-rate independent when `k` comes from `1 - exp(-dt * rate)`). */
export function approach(p: CameraPose, goal: CameraPose, k: number): CameraPose {
  const dyaw = Math.atan2(Math.sin(goal.yaw - p.yaw), Math.cos(goal.yaw - p.yaw));
  return { tx: p.tx + (goal.tx - p.tx) * k, tz: p.tz + (goal.tz - p.tz) * k, yaw: p.yaw + dyaw * k, pitch: p.pitch + (goal.pitch - p.pitch) * k, distance: p.distance + (goal.distance - p.distance) * k };
}

export const closeTo = (a: CameraPose, b: CameraPose): boolean => Math.abs(a.tx - b.tx) < 0.02 && Math.abs(a.tz - b.tz) < 0.02 && Math.abs(Math.atan2(Math.sin(a.yaw - b.yaw), Math.cos(a.yaw - b.yaw))) < 1e-4 && Math.abs(a.pitch - b.pitch) < 1e-4 && Math.abs(a.distance - b.distance) < 0.05;

// ---- Rays and projection, from the pose alone ----------------------------------------------------------------------

type V3 = [number, number, number];
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const TAN_HALF_FOV = Math.tan((CAMERA_FOV * Math.PI) / 360);

/** The camera's position and its forward, right and up directions. */
export function basisOf(p: CameraPose): { eye: V3; forward: V3; right: V3; up: V3 } {
  const eye = eyeOf(p);
  const forward = norm([p.tx - eye[0], -eye[1], p.tz - eye[2]]);
  const right = norm([-forward[2], 0, forward[0]]);
  const up: V3 = [right[1] * forward[2] - right[2] * forward[1], right[2] * forward[0] - right[0] * forward[2], right[0] * forward[1] - right[1] * forward[0]];
  return { eye, forward, right, up };
}

/**
 * The point on the ground (y = 0) under a point of the view. `nx`, `ny` are in -1..1 with +x right and +y up;
 * `aspect` is width over height. Null when the point is at or above the horizon.
 */
export function groundPoint(p: CameraPose, nx: number, ny: number, aspect: number): [number, number] | null {
  const { eye, forward, right, up } = basisOf(p);
  const kx = nx * TAN_HALF_FOV * aspect;
  const ky = ny * TAN_HALF_FOV;
  const d: V3 = [forward[0] + right[0] * kx + up[0] * ky, forward[1] + right[1] * kx + up[1] * ky, forward[2] + right[2] * kx + up[2] * ky];
  if (d[1] > -1e-5) return null;
  const t = -eye[1] / d[1];
  return [eye[0] + d[0] * t, eye[2] + d[2] * t];
}

/** Where a world point falls in the view: [nx, ny] in -1..1 and its distance in front of the camera (negative: behind). */
export function viewPoint(p: CameraPose, x: number, y: number, z: number, aspect: number): [number, number, number] {
  const { eye, forward, right, up } = basisOf(p);
  const v: V3 = [x - eye[0], y - eye[1], z - eye[2]];
  const depth = dot(v, forward);
  return [dot(v, right) / (depth * TAN_HALF_FOV * aspect), dot(v, up) / (depth * TAN_HALF_FOV), depth];
}
