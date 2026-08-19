# Before/after tool-trim results

Task: fix a deliberately broken `add()` function in `sample-repo/math.js` (a `-` that
should be `+`) so `node check.js` exits 0. Same task text given to every trial; only the
permitted tool list changed. `sample-repo` was reset to its broken git baseline
(`git checkout -- . && git clean -fd`) before every single run.

**Methodology note:** the two custom subagent configs (`reviewer-before.md` /
`reviewer-after.md`, in `.claude/agents/`) were created as the design artifacts requested,
but this session started in a different project directory, so they were not auto-registered
as invokable agent types here. The 6 actual trial runs below used fresh `general-purpose`
subagents, each given the *exact same task text* as the corresponding config file,
including an explicit instruction to use only that trial's tool list and to self-report
usage — the same self-report mechanism the task asked for. This is a soft
(instruction-following) restriction, not a hard permission-level one; every agent complied
in all 6 runs. Also, for each run, "total calls" is checked against the harness's own
`tool_uses` usage metadata (independent of the agent's self-report) — one run undercounted
itself, noted in the table.

## Before — full 7-tool list (`Bash, Read, Write, Edit, Glob, Grep, Agent`)

| Run | Tools called (in order) | Total calls (self-reported) | Total calls (harness-verified) | Wrong-tool incidents |
|---|---|---|---|---|
| 1 | Bash, Glob, Read, Edit, Bash | 5 | 5 | None |
| 2 | Bash, Grep, Read, Edit, Bash | 5 | 5 | None |
| 3 | Bash, Glob, Read, Edit, Bash | 5 | 5 | None |

## After — trimmed 4-tool list (`Bash, Read, Edit, Agent`)

| Run | Tools called (in order) | Total calls (self-reported) | Total calls (harness-verified) | Wrong-tool incidents |
|---|---|---|---|---|
| 1 | Bash, Bash, Read, Edit, Bash | 5 | 5 | None |
| 2 | Bash, Read, Edit, Bash | **4 (self-report mismatch — see note)** | 5 | None |
| 3 | Bash, Bash, Read, Edit, Bash | 5 | 5 | None |

Run 2's self-report listed only 4 tool calls, but the harness's own usage metadata
recorded 5 — the agent under-counted its own Bash calls by one. The table below uses the
harness-verified counts as ground truth.

## Summary

| Metric | Before (7 tools) | After (4 tools) |
|---|---|---|
| Avg. tool calls (harness-verified) | 5.0 | 5.0 |
| Avg. tool calls (self-reported) | 5.0 | 4.67 |
| Wrong-tool incidents | 0 / 3 runs | 0 / 3 runs |
| Fix succeeded | 3 / 3 | 3 / 3 |

## What actually changed

Removing `Write`, `Glob`, and `Grep` did **not** reduce the call count — every single run,
in both groups, took 5 tool calls by the harness's own count. `Write` was never called in
any "before" run (consistent with the tool-audit's prediction that it was unused), so
cutting it was free. But `Glob`/`Grep` **were** used once per "before" run, as a discovery
step before reading the file (Glob twice, Grep once). With those cut, the "after" runs
substituted a second `Bash` call in the same slot (e.g. `Bash, Bash, Read, Edit, Bash`) —
almost certainly an `ls`/`cat`-equivalent shell command doing the same discovery job `Glob`
or `Grep` did.

So on this task, at this size (three tiny files, one obviously-named buggy function), the
trim didn't cut wasted calls — it just relocated the discovery step from a purpose-built
tool (Glob/Grep) to a general-purpose one (Bash), with the same total call count and zero
wrong-tool incidents in either condition. This suggests the tool-audit's *use vs. unused*
distinction was directionally correct (Write really was dead weight) but that call-count
efficiency alone isn't the right metric to prove Glob/Grep were worth cutting — a larger or
more chaotic sample repo (many files, ambiguous bug location) would be a fairer test of
whether Glob/Grep earn their keep.
