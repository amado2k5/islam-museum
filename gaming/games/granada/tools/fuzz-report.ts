// Says what the random-play test really exercises: how many of its commands went through, of which kinds, and how
// the contracts ended. A fuzz run in which nearly everything is refused proves nothing, so the share is reported.
// Usage: npx tsx --tsconfig tsconfig.json games/granada/tools/fuzz-report.ts [openings=300] [commands=200]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Rng } from "@im/kernel/prng";
import { audit, dinars, fingerprint, open, submit, type Market } from "@im/granada/sim/economy";
import { randomCommand, randomOpening } from "@im/granada/sim/random-play";

const FIXTURE = JSON.parse(readFileSync(fileURLToPath(new URL("../../../../docs/gaming/spec-granada/contracts/economy-fixture.json", import.meta.url)), "utf8"));
const SHELVES: Market["goods"] = {};
for (const [good, q] of Object.entries(FIXTURE.market) as Array<[string, { inventory: number; ask: number; bid: number }]>) SHELVES[good] = { inventory: q.inventory, ask: dinars(q.ask), bid: dinars(q.bid) };

{
  const openings = Number(process.argv[2] ?? 300);
  const commands = Number(process.argv[3] ?? 200);
  const byKind: Record<string, { sent: number; accepted: number }> = {};
  const refusals: Record<string, number> = {};
  const contractsAtEnd: Record<string, number> = {};
  let accepted = 0;
  let journal = 0;
  let unsound = 0;
  let prints = "";
  const began = Date.now();
  for (let seed = 0; seed < openings; seed++) {
    const rng = new Rng(`fuzz-${seed}`);
    let s = open(randomOpening(rng, SHELVES));
    for (let i = 0; i < commands; i++) {
      const command = randomCommand(rng, s);
      const out = submit(s, { commandId: `fuzz-${seed}:${i}`, expectedStateVersion: s.stateVersion, command });
      const k = (byKind[command.kind] ??= { sent: 0, accepted: 0 });
      k.sent++;
      if (out.result.ok) {
        accepted++;
        k.accepted++;
      } else refusals[out.result.error] = (refusals[out.result.error] ?? 0) + 1;
      s = out.state;
      if (audit(s).length) unsound++;
    }
    journal += s.journal.length;
    prints += fingerprint(s);
    for (const c of Object.values(s.contracts)) contractsAtEnd[c.state] = (contractsAtEnd[c.state] ?? 0) + 1;
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < prints.length; i++) h = Math.imul(h ^ prints.charCodeAt(i), 0x01000193) >>> 0;
  console.log(JSON.stringify({ openings, commandsEach: commands, sent: openings * commands, accepted, acceptedShare: Math.round((accepted * 1000) / (openings * commands)) / 10, unsoundStates: unsound, journalEntries: journal, byKind, refusals, contractsAtEnd, digestOfAllEndStates: h.toString(16).padStart(8, "0"), seconds: Math.round((Date.now() - began) / 100) / 10 }, null, 1));
}
