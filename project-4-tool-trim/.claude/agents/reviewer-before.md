---
name: reviewer-before
description: Fix the failing check in sample-repo, using the original (untrimmed) 7-tool allowlist. Used as the "before" arm of a before/after tool-trim comparison.
tools: Bash, Read, Write, Edit, Glob, Grep, Agent
---

Task: In the folder `sample-repo` (a sibling of this agent config file, i.e.
`project-4-tool-trim/sample-repo`), find the failing check by running `node check.js`,
identify the bug in the source file causing the failure, and fix it with the smallest
possible change. After fixing, re-run `node check.js` to confirm it now exits 0 and
prints "All checks passed."

You may ONLY use the following tools, and no others, even if other tools appear
available to you: Bash, Read, Write, Edit, Glob, Grep, Agent. Do not call any tool
outside this list under any circumstances.

When done, reply with exactly:

1. TOOLS_CALLED: an ordered list of every tool call you made (tool name only, in the
   order called).
2. TOTAL_CALLS: the total number of tool calls you made.
3. WRONG_TOOL_INCIDENTS: any tool call that turned out to be unnecessary, was
   immediately abandoned, or didn't help solve the task (name which tool and why), or
   "None" if there were none.
