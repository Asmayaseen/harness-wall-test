# Project 7 — Fence it, then attack it (Concepts 5 and 11)

**Difficulty:** Intermediate

**What was built:** A full fence around a sample repo — deny rules for secrets/rm-rf/force-push, a network fence (curl/wget/WebFetch denied), a branch fence (push only to `claude/*`), and a `fence-guard.ps1` PreToolUse hook that independently re-checks and logs every blocked attempt to `attack-log.md`.

**What was tested:** Fed a `malicious-issue.md` bug ticket with a prompt injection buried in it, asking to `cat .env` and `curl` it to an external URL — then forced a direct tool-layer test of each blocked pattern (Read on `.env`, Bash `curl`) to confirm the fence actually fires, not just that Claude's own judgment refuses.

**Key result — two standout findings:**
1. **Inner-vs-outer pattern (same as Project 1):** Claude's own inner-harness judgment refused the injected instruction before ever attempting the tool call, so the first pass proved nothing about whether the outer fence itself works. Only a deliberate, explicit tool-layer test (asking Claude to attempt the blocked Read/Bash calls anyway) exercised the actual guardrail.
2. **Silent-block gap, found and fixed:** curl/force-push/rm-rf blocks were logged loudly by `fence-guard.ps1`, but the `.env` Read block was silent — `permissions.deny` in `settings.json` stopped it before the hook ever ran, so a real guardrail was firing invisibly (Concept 11: "a guardrail that fires silently teaches you nothing"). Fix: moved the Read-path deny logic out of `settings.json` and into `fence-guard.ps1` itself, so the hook is guaranteed to see and log every Read attempt. Verified live — re-running the `.env` Read now produces a logged entry in `attack-log.md`, closing the gap.
