# Project 4 — Trim the tool list (Concepts 6 and 7)

Audited project-08-daily-loop's daily-loop skill: original allowed-tools was Bash, Read, Write, Edit, Glob, Grep, Agent (7). Skill instructions never actually invoked Write, Glob, or Grep — trimmed to Bash, Read, Edit, Agent (4).

Ran a before/after test: 3 trials fixing a broken function in a sample repo with the 7-tool list, 3 trials with the 4-tool list, resetting the repo between every run.

Result: avg tool calls 5.0 in both arms, 0 wrong-tool incidents in both arms, 3/3 fix success in both arms. Cutting the unused tools did not reduce call count — Glob/Grep had been doing a real discovery step, and removing them just shifted that same step onto Bash instead.

Conclusion: 'if nothing improved, your list was already lean' — the course's own predicted outcome. Write was genuine dead weight (confirmed zero calls across all before-runs) and is safe to cut permanently. Glob and Grep were doing real work, just not decisively necessary work at this task's scale; cutting them is a neutral simplification, not a proven improvement, on this test size.
