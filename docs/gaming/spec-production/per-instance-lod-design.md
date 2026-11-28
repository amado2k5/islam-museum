# Per-Instance LOD Architecture for InstancedMesh

**Status:** Design draft  
**Author:** Devin  
**Date:** 28 November 2026

## Problem

The Granada valley uses `InstancedMesh` to draw many instances of the same geometry (town kit houses, landmarks, palace, animals). Each `InstancedMesh` has a single `BufferGeometry` shared across all its instances. The LOD1 files exist (`town-lod1.gltf`, `landmarks-lod1.gltf`, `palace-lod1.gltf`) but cannot be used because there is no way to swap geometry per-instance.

The mill already has working LOD because it is a single `Object3D` in the scene, not instanced. The town kit, landmarks, and palace are instanced pieces placed throughout the valley.

## Current Architecture

- `three-valley.ts` loads `town.gltf`, `landmarks.gltf`, and `palace.gltf`.
- `loadTown()` extracts geometry and material for each named piece (e.g., `house-a`, `wall`, `tower`).
- `useKit()` creates `InstancedMesh` for each piece, with per-instance matrices for placement.
- All instances of a piece share the same `BufferGeometry`.

## Design Options

### Option A: Per-Instance Geometry Groups

Create multiple `InstancedMesh` for each piece, one per LOD level, and assign instances to the appropriate LOD based on distance. Each LOD level has its own `InstancedMesh` with its own geometry.

**Pros:**
- Simple to implement
- No changes to existing instance matrix logic
- Works with Three.js's standard `InstancedMesh`

**Cons:**
- Increases draw calls (one per LOD per piece)
- Requires calculating instance-to-LOD assignment
- May not be efficient for pieces with many instances spread across distance bands

### Option B: Per-Instance Geometry via Vertex Shaders

Use a custom shader that reads a per-instance LOD index and selects between two geometries (or applies a vertex displacement to approximate LOD1).

**Pros:**
- No additional draw calls
- Can blend between LODs smoothly

**Cons:**
- Requires WebGPU shader work (the game uses Three.js WebGPU)
- Complex to implement and debug
- May not be worth the complexity for the visual gain

### Option C: Hybrid - Group-Based LOD

Group instances by distance bands (e.g., near, mid, far). For each group, create a separate `InstancedMesh` with the appropriate LOD geometry. Update group assignment periodically (e.g., every second) based on camera position.

**Pros:**
- Balances draw calls and simplicity
- Reduces draw calls compared to Option A by grouping
- Works with existing `InstancedMesh` architecture

**Cons:**
- Requires distance calculation and group management
- May have brief LOD popping when instances move between groups
- Still increases draw calls, but less than Option A

## Recommended Approach: Option C (Hybrid Group-Based LOD)

### Rationale

- The game already has a distance-based LOD for the mill (single object).
- Group-based LOD is a natural extension to instanced pieces.
- It balances simplicity and performance.
- It can be implemented incrementally: start with the town kit, then landmarks, then palace.

### Implementation Plan

1. **Add LOD1 geometry loading:**
   - Load `town-lod1.gltf`, `landmarks-lod1.gltf`, and `palace-lod1.gltf` alongside their LOD0 counterparts.
   - Extract LOD1 geometry for each piece, similar to how LOD0 geometry is extracted.

2. **Add LOD group management:**
   - For each piece, maintain three `InstancedMesh`: near (LOD0), mid (LOD1), far (LOD1 or simplified).
   - Calculate instance distance from camera each frame (or periodically).
   - Assign instances to groups based on distance thresholds.

3. **Update instance matrices:**
   - When an instance moves between groups, remove it from the old group's `InstancedMesh` and add it to the new group's `InstancedMesh`.
   - Update the instance count for each group.

4. **Handle animation:**
   - For animated pieces (e.g., animals with moving legs), ensure LOD1 preserves the animation structure (leg objects, joints).

5. **Measure and verify:**
   - Record draw calls and triangles before and after.
   - Verify visual quality at different distances.
   - Ensure no regression in frame rate.

### Distance Thresholds

Initial thresholds (to be tuned):
- Near: < 50m (LOD0)
- Mid: 50m - 150m (LOD1)
- Far: > 150m (LOD1 or further simplified)

### Draw Call Impact

Current: One `InstancedMesh` per piece.
Proposed: Up to three `InstancedMesh` per piece (near, mid, far).

For the town kit (9 pieces):
- Current: 9 draw calls
- Proposed: Up to 27 draw calls (if all three groups are populated)

This is acceptable if the visual quality improvement is significant and the draw calls remain within budget.

## Files to Modify

- `games/granada/src/view/three-valley.ts`:
  - Add LOD1 model loading in `loadTown()`.
  - Add LOD group management in `useKit()`.
  - Add distance calculation and group assignment in `render()`.

- `games/granada/src/view/valley.ts`:
  - May need to expose instance positions for distance calculation.

- `art/manifest.py`:
  - Already records LOD1 files; no changes needed.

## Open Questions

1. **Animation preservation:** Do LOD1 files preserve the leg/joint structure for animated animals? (Need to verify.)
2. **Threshold tuning:** What are the optimal distance thresholds for this valley's scale?
3. **Draw call budget:** Is the increased draw call count acceptable for the target frame rate?
4. **Implementation order:** Should we start with the town kit, then landmarks, then palace, or all at once?

## Next Steps

1. Verify LOD1 files preserve animation structure.
2. Implement LOD1 loading in `loadTown()`.
3. Implement group-based LOD in `useKit()` for one piece (e.g., `house-a`) as a proof of concept.
4. Measure draw calls and visual quality.
5. Extend to all pieces if successful.
