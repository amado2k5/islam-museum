# Granada's art: the three candidates, and what is kept of the second

_Written on 26 November 2026 after the founder's decision on art ([`owner-decisions-2026-11-26-c.md`](owner-decisions-2026-11-26-c.md); his words govern, this is what was done with them). Nothing here is accepted art. Every game is still a prototype._

## Where each candidate stands

| | What it is | Where it is | Standing, by his decision |
|---|---|---|---|
| **Set A** (`granada/2`) | Thirteen buildings made by Blender scripts, with five photographed public-domain surfaces. The proof frame of this morning ([`proof-granada.md`](proof-granada.md)) | On `main` and on UAT | **The running baseline. Not accepted as the direction of production art.** It stays in the game until something better is accepted |
| **Set B** (`granada/3`) | The same thirteen with more scripted detail and one automatic low-detail version each, by a second agent (Devin) | Pull request amado2k5/islam-museum#8312, open; the models only on the machine that made them ([checksums](../evidence/granada/art-set-b/checksums.md)) | **Not merged as it stands. Not accepted. Kept as experimental research**: its engineering may be carried over, its geometry is not a template |
| **Candidate C** | A new proof frame built from `main`: one complete view at the target's finish, in the running game | Not begun when this was written | To be judged by him against all fourteen lines of the checklist. **No asset is made in number before he accepts it in words** |

## What "hand-authored or artist-reviewed" can mean here, said plainly

The decision asks that the hero pieces of Candidate C (palace, estate, gate and wall, a street cluster, construction detail, key vegetation) be "hand-authored or artist-reviewed".

- **No artist is engaged.** Paying one, or buying models, needs his separate approval (register, approval 13), and the decision repeats it: nothing is bought.
- **The developer is an AI that makes models by writing Blender scripts.** It cannot model by hand in the sense an artist does. What it can do differently from Sets A and B is author each hero building as its own script, piece by piece, with its own plan, openings and ornament, instead of drawing every building from one kit of parts. That is what "authored" will mean in Candidate C, and it will be said in those words wherever the candidate is described.
- **"Artist-reviewed" stays unmet until a person is named.** The developer looking at its own renders is not an artist's review.
- **The decision's own stop rule applies to this.** If the first palace, street cluster and estate still read as improved boxes after one focused revision, the method stops and a proposal for a professional artist or licensed models comes back to him, with roles, licences, known costs and budgets.

## Set B, file by file

_The fourteen files of the pull request at `f0ed8773035`, against `main` at `c24845bfd35`._

| File | What it is | Verdict | Why |
|---|---|---|---|
| `gaming/art/blender/common3.py` | A copy of `common.py` with ten added helpers | **Port** the helpers into `common.py`: ordered faces and vertices, removal of zero-area faces, a glTF rewrite that makes two exports byte-identical, automatic LOD. **Discard** the copy | The reproducible export is real engineering and is wanted. Two diverging copies of one 800-line file is the duplication the decision forbids |
| `gaming/art/blender/kit3.py` | A copy of `kit.py` with more parts (tile ends, lattices, base courses, wash) | **Rewrite** | Some parts are worth having, but as parts of the one maintained kit, and Candidate C's hero pieces are not kit-built |
| `gaming/art/blender/granada_town3.py` | Set B's houses, wall, tower, gate, scaffold, stall | **Retain only as evidence** | It keeps Set A's outer shapes on purpose; the decision asks for new silhouettes, streets and variety |
| `gaming/art/blender/granada_landmarks3.py` | Set B's palace, estate and crane | **Retain only as evidence** | The palace is the piece the decision finds furthest from the target |
| `gaming/art/blender/granada_mill3.py` | The mill, unchanged in design, with LOD and ordered export | **Port** the LOD and export calls into `granada_mill.py` when the game can choose one LOD; **discard** the copy | The design is Set A's own; only the export changed |
| `gaming/art/compare_granada.py` | Checks set 3 against set 2: same names, origins, outer sizes, one LOD each | **Rewrite** as a general check | As written it enforces the very sameness of shape that Candidate C must break. Its reading of sizes, triangles and LOD pairs from a glTF without Blender is the useful part |
| `gaming/art/blender/render_granada_compare.py` | Renders each piece of two sets side by side | **Port**, made general over any two sets | Needed for the close-up sheet the decision asks for |
| `gaming/art/manifest.py` | Adds `proofAssets` that the publisher does not read, and keeps records of sets missing on a machine | **Port** | It lets a candidate exist beside the baseline without blocking the baseline's publication, which Candidate C needs until it is accepted |
| `gaming/art/manifest.json` | Generated: the proof records of set 3 | **Discard** | It is regenerated from whatever sets exist; set 3's records stay in the pull request |
| `gaming/art/art.gtest.ts` | Tests for the above | **Port** with `manifest.py`, without the three set-3 names | The test that proof assets stay out of the publishable list is the valuable one |
| `gaming/package.json` | Three scripts to build set 3 | **Discard** | They run the copies |
| `gaming/art/README.md` | Describes set 3 and its commands | **Rewrite** when the ports land | It documents the copies |
| `docs/gaming/spec-production/art-finish-granada-3.md` | Set B's own account of what it changed and could not do | **Retain only as evidence**, in the pull request | An honest record of an experiment; it is not a record of anything on `main` |
| `CANARY.md` | One release note for set 3 | **Discard** | The set is not released; this change carries its own note |

**Also kept in mind, not a file:** in Set B's models the low-detail meshes sit in the same scene as the full ones under names ending `-lod1`. A game that adds the whole scene draws both. Candidate C's loader must choose exactly one for each object, and have a test for it.

## The order of work on Candidate C

1. Label the pull request and keep its evidence. **Done with this change.**
2. The stop/go test: one hero palace, one street cluster and the estate, each authored as its own script, rendered and looked at beside the target. One focused revision at most.
3. If it passes the developer's own honest reading: the rest of the one view (foreground estate and fields, mill and water, town, gate and wall with construction, range), LOD selection in the game, the normal build and media path, UAT, and the whole package of evidence the decision lists.
4. If it does not: stop, and bring him the proposal for an artist or licensed models.
5. Either way he judges. The developer's reading passes no gate.

**What only he can supply and is not waited on:** an artist's review; named historical reviewers (the candidate's buildings are a general picture of a walled town and stay marked "historical review pending"); operators for the minimum machines.
