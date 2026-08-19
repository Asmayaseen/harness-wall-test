# Project 4 — Trim the tool list (Concepts 6 and 7)

**Difficulty:** Intermediate

**What was built:** A tool-usage audit of `project-08-daily-loop`'s `daily-loop` skill (original `allowed-tools`: `Bash, Read, Write, Edit, Glob, Grep, Agent`), plus a controlled before/after experiment: a tiny `sample-repo` with a deliberately broken function, fixed by fresh agents under the original 7-tool list vs. a trimmed 4-tool list (`Bash, Read, Edit, Agent`), 3 trials each, resetting the repo between every run.

**What was tested:** Whether trimming unused tools (`Write`, `Glob`, `Grep` — none ever invoked by the skill's actual instructions) measurably reduces tool-call count or wrong-tool incidents.

**Key result:** Avg. tool calls (5.0) and wrong-tool incidents (0) were identical in both arms, and both arms fixed the bug 3/3 — cutting the unused tools didn't reduce call count, because Glob/Grep had been doing a real discovery step that simply shifted onto Bash once removed. `Write` was confirmed genuine dead weight (zero calls across all before-runs) and is safe to cut permanently; Glob/Grep were doing real, if not decisive, work — cutting them is a neutral simplification, not a proven improvement, at this task's scale.
