# Project 2 — Break, then heal (Hooks)

1. PostToolUse hook (feedback): fires immediately after every Edit/Write, runs lint, and on failure sends the error to the agent's next input via stderr + exit 2. It CANNOT undo the edit that already happened — it can only report the problem forward. Confirmed: added an unused variable, hook caught it right after the edit, the agent then fixed it itself on request.

2. Stop hook (gate): fires when the session tries to end, runs lint again, and blocks session end outright with exit 2 if lint still fails. Confirmed: deliberately left a lint error and tried to stop — the Stop hook fired twice, refusing to let the session close, until the unused variable was removed and lint passed.

One-line summary: PostToolUse is feedback — it cannot undo what ran, it only informs the next turn. Stop is a gate — the work cannot count as done past it, no matter how many times the agent tries to finish.
