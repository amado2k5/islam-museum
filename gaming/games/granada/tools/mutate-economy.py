#!/usr/bin/env python3
"""Breaks Granada's economy kernel on purpose, one way at a time, and checks that its tests notice each time.
A test suite that passes proves little until it has been seen to fail. Each mutation is a real mistake a later
change could make (selling at the wrong price, paying twice, losing a harvest silently). The file is restored
after every run, and at the end whatever happens.
Usage (from gaming/): python3 games/granada/tools/mutate-economy.py      Exit code 1 if any mutation survives."""
import pathlib, subprocess, sys

FILE = pathlib.Path("games/granada/src/sim/economy.ts")
MUTATIONS = {
    "sell at ask instead of bid": ("const revenue = q.bid * cmd.quantity;", "const revenue = q.ask * cmd.quantity;"),
    "a repeated command is applied again": ("if (seen) return { state, result: seen };", ""),
    "a stale command is accepted": ("if (env.expectedStateVersion !== state.stateVersion) return", "if (false) return"),
    "a market has endless money": ('if (m.cash < revenue) return fail("market-short-of-cash"', 'if (false) return fail("market-short-of-cash"'),
    "reserved goods can be sold": (
        "export const unreserved = (s: EconomyState, good: string): number => holding(s, good).quantity - holding(s, good).reserved;",
        "export const unreserved = (s: EconomyState, good: string): number => holding(s, good).quantity;",
    ),
    "a penalty is charged on every advance": ('if (c.state === "accepted" && s.tick > c.deadlineTick)', 'if (c.state !== "offered" && c.state !== "settled" && s.tick > c.deadlineTick)'),
    "a harvest that does not fit is taken without asking": ('if (over > 0 && cmd.overflow === "refuse") return fail(', "if (false) return fail("),
    "a loss is not written down": ('j(cmd.good, "field", "loss", lost, "harvest with nowhere to go");', ""),
    "each part delivery is rounded on its own": (
        "const share = (amount: number) => mulDiv(amount, total, c.units) - mulDiv(amount, c.delivered, c.units);",
        "const share = (amount: number) => mulDiv(amount, cmd.quantity, c.units);",
    ),
    "held cash is released twice": ("s.treasury.available += c.reservedCash;\n  s.treasury.reserved -= c.reservedCash;", "s.treasury.available += c.reservedCash * 2;\n  s.treasury.reserved -= c.reservedCash;"),
    "the state passed in is changed": (
        "const s: EconomyState = { ...structuredClone({ ...state, journal: [], done: {} }), journal: state.journal.slice(), done: { ...state.done } };",
        "const s: EconomyState = state;",
    ),
    "the warehouse has no limit": ('if (freeCapacity(s) < cmd.quantity) return fail("no-storage"', 'if (false) return fail("no-storage"'),
    "a contract fails on its last day": ('if (c.state === "accepted" && s.tick > c.deadlineTick) money', 'if (c.state === "accepted" && s.tick >= c.deadlineTick) money'),
    "pressed oil forgets what the olives cost": ("basis += sellFromStock(s, good, n * cmd.runs);", "sellFromStock(s, good, n * cmd.runs);"),
    "an expired offer can still be accepted": ('if (s.tick > c.deadlineTick) return fail("contract-expired"', 'if (false) return fail("contract-expired"'),
}

original = FILE.read_text()
survived = 0
try:
    for name, (old, new) in MUTATIONS.items():
        if original.count(old) != 1:
            print(f"NOT APPLIED  {name}: the line it changes is no longer in the file; update this tool")
            survived += 1
            continue
        FILE.write_text(original.replace(old, new))
        run = subprocess.run(["npx", "vitest", "run", "--config", "vitest.config.ts", "games/granada/test/economy.gtest.ts"], capture_output=True, text=True)
        counts = next((line.strip() for line in (run.stdout + run.stderr).splitlines() if line.strip().startswith("Tests")), "")
        caught = run.returncode != 0
        survived += 0 if caught else 1
        print(f"{'CAUGHT  ' if caught else 'SURVIVED'}  {name}: {' '.join(counts.split())}")
finally:
    FILE.write_text(original)
print(f"{len(MUTATIONS) - survived} of {len(MUTATIONS)} mutations caught")
sys.exit(1 if survived else 0)
