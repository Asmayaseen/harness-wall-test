# Project 2 — Break, then heal (Hooks)

**Difficulty:** Introductory

**What was built:** A `PostToolUse` hook (runs `npm run lint` after every Edit/Write, blocking with exit 2 on failure) and a `Stop` hook (runs `npm run lint` again before the session may end, blocking with exit 2 on failure) in `.claude/settings.json`.

**What was tested:** Whether each hook actually enforces lint cleanliness — PostToolUse as immediate feedback after an edit, Stop as a gate at session end — by deliberately introducing unused variables into `app.js` and observing the hooks fire.

**Key result:** PostToolUse is feedback — it fires right after the edit, catches the problem, but cannot undo the edit that already happened; it only reports the problem forward. Stop is a gate — it fired twice in a row, refusing to let the session close, until the lint error was actually fixed. The work cannot count as done past a Stop hook, no matter how many times the agent tries to finish.
