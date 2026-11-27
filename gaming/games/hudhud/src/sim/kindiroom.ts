// Al-Kindi's room: the secret page played by flying. A pure function from the room's state and a command to a new
// state, what happened, and the commands of the secret page's rules it gave. Those rules (./cipher) are not touched: a
// sign carried to a mark's place on the board is exactly the page's choice of that sign in that mark's list (`assign`,
// which takes the sign from another mark that had it), a place touched with nothing carried is the page's "not yet"
// (`assign` with null), the bell is the page's "Read the page" (`read`), and a question asked, an answer given or the
// feather found is a `flag`; so the counts, the refusals, the failed readings, the goals, the three ways of playing
// and the messages are the page quest's (ui/cipher.ts) to the letter.
//
// What the room adds is only what a bird can do with its beak: carry one sign. Carrying is not a move. A token is
// picked up from the shelf (its sign stays on the shelf, dimmed, while a mark has it: the page's lists always offer
// every sign); touching the token carried puts it back, and touching another takes that one instead.
import { CIPHER_SLACK, cipherPuzzle } from "../content/cipher";
import { KDR_SCRIPTS, kdrThings, type KdrSpeaker } from "../content/kindi-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { CIPHER_FLAGS, applyCipher, cipherGoals, newCipher, restoreCipher, snapshotCipher, type CipherCommand, type CipherFlag, type CipherSnapshot, type CipherState, type CipherStyle } from "./cipher";

export interface KindiState {
  cipher: CipherState;
  /** The sign in Hudhud's beak, or null. */
  carrying: string | null;
  talk: Talk | null;
}
export type KindiCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type KindiHappened =
  | { type: "pick"; sign: string }
  | { type: "drop"; sign: string }
  /** A mark was given a sign (or none). `freed` are the marks the sign was taken from; `changed` is false if the mark already had it. */
  | { type: "assign"; mark: string; sign: string | null; freed: string[]; changed: boolean }
  | { type: "read" }
  | { type: "opened" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface KindiResult {
  state: KindiState;
  happened: KindiHappened[];
  /** The secret page's commands this step gave, in order: the same the page quest gives for the same act. */
  commands: CipherCommand[];
}

export function newKindiRoom(style: CipherStyle): KindiState {
  return { cipher: newCipher(style, cipherPuzzle(style)), carrying: null, talk: open(KDR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is CipherFlag => (CIPHER_FLAGS as readonly string[]).includes(f);

/** The page's command a thing of the room gives when touched, given what Hudhud carries; null for a person, a token or the torn page. */
export function commandOf(s: KindiState, id: string): CipherCommand | null {
  const thing = kdrThings(s.cipher.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "bell") return { type: "read" };
  if (thing.kind === "slot") return s.carrying !== null ? { type: "assign", mark: thing.mark!, sign: s.carrying } : { type: "assign", mark: thing.mark!, sign: null };
  return null;
}

export function applyKindiRoom(s: KindiState, c: KindiCommand): KindiResult {
  const commands: CipherCommand[] = [];
  let cipher = s.cipher;
  const give = (cmd: CipherCommand) => {
    const next = applyCipher(cipher, cmd);
    if (next === cipher) return;
    cipher = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: KindiState, script: string, happened: KindiHappened[] = []): KindiResult => ({ state: { ...state, cipher, talk: open(KDR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: KindiResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<KdrSpeaker>(KDR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<KdrSpeaker>(KDR_SCRIPTS, s.talk, c.index, new Set<string>(s.cipher.flags));
      flags(step.set);
      return { state: { ...s, cipher, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.cipher.done) return none;
  const thing = kdrThings(s.cipher.style, false).find((t) => t.id === c.id);
  if (!thing) return none;
  const carried = s.carrying;

  if (thing.kind === "token") {
    const sign = thing.sign!;
    if (carried === sign) return { state: { ...s, carrying: null }, happened: [{ type: "drop", sign }], commands };
    const happened: KindiHappened[] = carried ? [{ type: "drop", sign: carried }] : [];
    return { state: { ...s, carrying: sign }, happened: [...happened, { type: "pick", sign }], commands };
  }
  if (thing.kind === "slot") {
    const mark = thing.mark!;
    const had = s.cipher.guess[mark] ?? null;
    // With nothing carried, an empty place gives nothing: the page's "not yet" for a mark that has no sign changes nothing.
    if (carried === null && had === null) return none;
    const freed = carried === null ? [] : Object.keys(s.cipher.guess).filter((m) => m !== mark && s.cipher.guess[m] === carried);
    give({ type: "assign", mark, sign: carried });
    return { state: { ...s, cipher, carrying: null }, happened: [{ type: "assign", mark, sign: carried, freed, changed: commands.length > 0 }], commands };
  }
  if (thing.kind === "bell") {
    give({ type: "read" });
    if (cipher.done) return say({ ...s, carrying: null }, "done", [{ type: "read" }, { type: "opened" }]);
    return { state: { ...s, cipher }, happened: [{ type: "read" }], commands };
  }
  if (thing.kind === "kindi") return say(s, "kindi");
  if (thing.kind === "messenger") {
    const has = (f: CipherFlag) => s.cipher.flags.includes(f);
    if (has("kind")) return say(s, "messengerKind");
    if (has("answered")) return say(s, "messengerBlunt");
    return say(s, "messenger");
  }
  // Under the torn page on the bookcase: the feather the first time, nothing more after (the page's own lines).
  if (s.cipher.flags.includes("feather")) return say(s, "pageAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "page", [{ type: "feather" }]);
}

/** The four goals, exactly as the page quest counts them. */
export const kindiGoals = (s: KindiState) => cipherGoals(s.cipher, CIPHER_SLACK[s.cipher.style]);

/** What is kept: the secret page's own snapshot (the page quest can take it up as it is), and what Hudhud carries. */
export type KindiSnapshot = CipherSnapshot & { carrying: string | null };
export const snapshotKindi = (s: KindiState): KindiSnapshot => ({ ...snapshotCipher(s.cipher), carrying: s.carrying });
/** Whether there is anything worth keeping: a sign given, a failed reading, a question or an answer, or a sign in the beak. */
export const worthKeeping = (s: KindiState): boolean => !s.cipher.done && (Object.keys(s.cipher.guess).length > 0 || s.cipher.fails > 0 || s.cipher.flags.length > 0 || s.carrying !== null);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/cipher.ts), with the beak added: after a
 * sign given or taken away, a flag, a reading that was counted, or a sign picked up or put back, the room as it now stands
 * if there is anything worth keeping, or nothing (null) if there is not; a reading refused because a mark has no sign
 * changes nothing kept, and the page read right is finished (the host clears its place). `undefined` means: leave what
 * is kept as it is.
 */
export function keptAfter(before: KindiState, after: KindiState, cmds: readonly CipherCommand[]): KindiSnapshot | null | undefined {
  if (after.cipher.done) return undefined;
  const carried = before.carrying !== after.carrying;
  const other = cmds.some((c) => c.type !== "read");
  const counted = cmds.some((c) => c.type === "read") && after.cipher.last?.complete === true;
  if (!carried && !other && !counted) return undefined;
  return worthKeeping(after) ? snapshotKindi(after) : null;
}
/**
 * A room put back from what was saved, or null if the page cannot be trusted (sim/cipher.ts proves it). A sign in the
 * beak comes back only if it is a sign of this way of playing. A conversation is never restored. A snapshot the page
 * quest kept (no `carrying`) comes back with an empty beak.
 */
export function restoreKindi(x: unknown): KindiState | null {
  const cipher = restoreCipher(x, cipherPuzzle);
  if (!cipher) return null;
  const c = (x as Record<string, unknown>).carrying;
  const carrying = typeof c === "string" && cipher.puzzle.signs.includes(c) ? c : null;
  return { cipher, carrying, talk: null };
}
