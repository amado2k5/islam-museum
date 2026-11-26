// The golden scene as a quest: it starts, it can be finished, a wrong turn is never the end, talk never traps the
// player, and what the player says changes no fact.
import { describe, expect, it } from "vitest";
import { SCRIPTS, THINGS, type PlayStyle } from "../content/workshop";
import { solve } from "../sim/light";
import { apply, beam, goals, newScene, replay, restore, snapshot, type Command, type SceneState } from "../sim/scene";

const skip: Command = { type: "skip" };
const touch = (id: string): Command => ({ type: "touch", id });
const solveIt = (s: SceneState): Command[] => solve(s.puzzle).ids.flatMap((id) => [touch(`mirror-${id}`), skip]);
const play = (s: SceneState, cs: Command[]) => cs.reduce((st, c) => apply(st, c).state, s);

describe("the golden scene", () => {
  it("opens on the three lines of the intro and gives control back after them", () => {
    let s = newScene("explorer");
    expect(s.talk).toEqual({ script: "intro", node: "1", line: 0 });
    for (let i = 0; i < 3; i++) s = apply(s, { type: "forward" }).state;
    expect(s.talk).toBeNull();
  });
  it("holds the room still while someone is speaking", () => {
    const s = newScene("explorer");
    const r = apply(s, touch("mirror-a"));
    expect(r.state).toBe(s);
    expect(r.happened).toEqual([]);
  });
  it.each(["story", "explorer", "challenge"] as PlayStyle[])("can be played from start to finish in %s, earning every goal", (style) => {
    let s = play(newScene(style), [skip, touch("scholar"), { type: "forward" }, { type: "choose", index: 0 }, skip, touch("cat"), skip]);
    expect(s.flags).toEqual(expect.arrayContaining(["metScholar", "askedMore", "metCat"]));
    s = play(s, solveIt(s));
    expect(s.restored).toBe(true);
    expect(beam(s).lit).toBe(true);
    s = play(s, [touch("cord"), skip, touch("cord"), touch("feather"), skip, touch("page")]);
    expect(s.done).toBe(true);
    expect(goals(s)).toEqual({ curiosity: true, ingenuity: true, kindness: true, feather: true, turns: s.par, par: s.par });
  });
  it("can be finished by the shortest road too: mirrors, then the page", () => {
    let s = play(newScene("explorer"), [skip]);
    s = play(s, [...solveIt(s), touch("page")]);
    expect(s.done).toBe(true);
    expect(goals(s)).toMatchObject({ curiosity: false, ingenuity: true, kindness: false, feather: false });
  });
  it("lets a player wander through wrong turns and still finish: Ingenuity is missed, nothing else", () => {
    let s = play(newScene("challenge"), [skip, touch("mirror-e"), touch("mirror-e"), touch("mirror-d"), touch("mirror-d")]);
    expect(s.turns).toBe(4);
    s = play(s, [...solveIt(s), touch("page")]);
    expect(s.done).toBe(true);
    expect(goals(s).ingenuity).toBe(false);
  });
  it("keeps the page's ink once it has it, whatever is done to the mirrors afterwards", () => {
    let s = play(newScene("explorer"), [skip]);
    s = play(s, solveIt(s));
    s = play(s, [touch("mirror-a")]);
    expect(beam(s).lit).toBe(false);
    expect(s.restored).toBe(true);
    expect(play(s, [touch("page")]).done).toBe(true);
  });
  it("says a word at the pale page and does not end there", () => {
    const s = play(newScene("explorer"), [skip, touch("page")]);
    expect(s.talk?.script).toBe("pageDark");
    expect(s.done).toBe(false);
  });
  it("lets every talk be left at once, from any line", () => {
    for (const name of Object.keys(SCRIPTS)) {
      for (const thing of THINGS) {
        const s = apply(play(newScene("explorer"), [skip]), touch(thing.id)).state;
        if (s.talk?.script !== name) continue;
        expect(apply(s, skip).state.talk, name).toBeNull();
      }
    }
  });
  it("changes no fact by what the player chooses to ask: the puzzle and its answer are the same", () => {
    const quiet = play(newScene("explorer"), [skip, touch("scholar"), { type: "forward" }, { type: "choose", index: 2 }, skip]);
    const curious = play(newScene("explorer"), [skip, touch("scholar"), { type: "forward" }, { type: "choose", index: 0 }, { type: "forward" }, { type: "choose", index: 0 }, { type: "forward" }, { type: "choose", index: 1 }, skip]);
    expect(curious.puzzle).toEqual(quiet.puzzle);
    expect(solve(curious.puzzle)).toEqual(solve(quiet.puzzle));
    expect(curious.flags).toContain("askedMore");
    expect(quiet.flags).not.toContain("askedMore");
  });
  it("opens and closes the curtain, and counts the secret once", () => {
    let s = play(newScene("explorer"), [skip]);
    const first = apply(s, touch("cord"));
    expect(first.happened.map((h) => h.type)).toEqual(["dark", "secret", "talk"]);
    s = play(first.state, [skip]);
    expect(s.dark).toBe(true);
    const second = apply(s, touch("cord"));
    expect(second.happened).toEqual([{ type: "dark", on: false }]);
    expect(apply(second.state, touch("cord")).happened).toEqual([{ type: "dark", on: true }]);
  });
  it("gives the feather once", () => {
    const s = play(newScene("explorer"), [skip, touch("feather"), skip]);
    expect(s.flags).toContain("feather");
    expect(apply(s, touch("feather")).happened).toEqual([]);
  });
  it("is touched by nothing once it is done, and ignores a thing that does not exist", () => {
    let s = play(newScene("explorer"), [skip]);
    expect(apply(s, touch("nothing")).state).toBe(s);
    s = play(s, [...solveIt(s), touch("page")]);
    expect(apply(s, touch("mirror-a")).state).toBe(s);
  });
  it("replays to the same end from the same commands", () => {
    const cs: Command[] = [skip, touch("mirror-a"), touch("cat"), skip, touch("mirror-c"), touch("cord"), skip];
    expect(replay("explorer", cs)).toEqual(replay("explorer", cs));
  });
  it("comes back from a snapshot as it was left, with control in the player's hands", () => {
    let s = play(newScene("challenge"), [skip, touch("mirror-a"), touch("cat"), skip, touch("cord"), skip]);
    const back = restore(JSON.parse(JSON.stringify(snapshot(s))))!;
    expect(back.puzzle).toEqual(s.puzzle);
    expect({ turns: back.turns, flags: back.flags, restored: back.restored, dark: back.dark, style: back.style, par: back.par }).toEqual({ turns: 1, flags: ["metCat", "secret"], restored: false, dark: true, style: "challenge", par: 5 });
    expect(back.talk).toBeNull();
    // A snapshot taken in the middle of a talk comes back without the talk: nobody returns to a sentence half said.
    s = apply(s, touch("scholar")).state;
    expect(restore(snapshot(s))!.talk).toBeNull();
    // And the quest can still be finished from there.
    const end = play(back, [...solveIt(back), touch("page")]);
    expect(end.done).toBe(true);
  });
  it("trusts nothing in a snapshot it cannot check", () => {
    const good = snapshot(play(newScene("explorer"), [skip, touch("mirror-a")]));
    expect(restore(good)).not.toBeNull();
    for (const bad of [null, 7, "x", {}, { ...good, style: "god" }, { ...good, leans: { a: "/" } }, { ...good, leans: { ...good.leans, c: "|" } }, { ...good, turns: -1 }, { ...good, turns: 1.5 }, { ...good, flags: "all" }, { ...good, restored: "yes" }, { ...good, dark: 1 }]) expect(restore(bad), JSON.stringify(bad)).toBeNull();
    // Flags it does not know are dropped; the ink cannot be back before enough mirrors were turned.
    expect(restore({ ...good, flags: ["metCat", "wonTheGame"] })!.flags).toEqual(["metCat"]);
    expect(restore({ ...good, restored: true, turns: 1 })).toBeNull();
    // A lit page always has its ink, whatever the file says.
    const lit = play(newScene("explorer"), [skip]);
    const solved = snapshot(play(lit, solveIt(lit)));
    expect(restore({ ...solved, restored: false })!.restored).toBe(true);
  });
});
