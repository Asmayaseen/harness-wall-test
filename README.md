# Harness Engineering Course

## Project status

1. ✅ **Done** — Project 1: The First Wall (`project-1-first-wall`) — Tested outer-harness permission deny rules; only the `echo` rule was cleanly observed blocking at the tool layer, the other three were masked by the model's own inner-safety caution.
2. ✅ **Done** — Project 2: Break, then heal (`project-2-break-then-heal`) — Built PostToolUse (feedback) and Stop (gate) lint hooks; confirmed PostToolUse can't undo a bad edit, only report it forward, while Stop actually blocks session end until lint passes.
3. ✅ **Done** — Project 3: AX rewrite (`project-3-ax-rewrite`) — Rewrote three bad connector error messages into actionable ones; proved an agent could self-heal from a bad call using only the new error text, no docs or human help.
4. ✅ **Done** — Project 4: Trim the tool list (`project-4-tool-trim`) — Audited and trimmed an unused-tool list, then A/B tested it; confirmed `Write` was dead weight but found cutting `Glob`/`Grep` didn't reduce tool-call count at this task's scale.
5. ✅ **Done** — Project 5: Reject a well-formed lie (`project-5-typed-verdict`) — Built a field-by-field JSON verdict validator; proved it rejects a well-formed-but-invalid `"MAYBE"` verdict (not just checking presence) and correctly escalates all 3 invalid cases to `needs-a-human.md`.
6. ✅ **Done** — Project 6: Name the class, write the fix (`project-6-name-the-class`) — Classified 4 real incidents from this actual session (not a simulated week) into Concept 10's failure classes; found and actually fixed the broken global hook (Constraint failure), not just diagnosed it.
7. ✅ **Done** — Project 7: Fence it, then attack it (`project-7-fence-attack`) — Built a fenced sample repo with a `fence-guard.ps1` hook logging every blocked attempt; attacked it with a prompt-injected bug ticket and found two things: Claude's own inner judgment refused before the outer fence was even exercised, and the `.env` Read block was firing silently until the deny logic was moved into the hook itself.
8. ⬜ **Not started** — Project 8: Two nights, one harness (Concept 12, coupling — capstone)
