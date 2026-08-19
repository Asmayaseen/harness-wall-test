# Project 6 — Name the class, write the fix (Concept 10, failure classes/the ratchet)

**Difficulty:** Intermediate

**Unusual twist:** Instead of simulating a fake week of mistakes, this project classified **4 real incidents that actually happened during this session's work on Projects 1-5** — a broken global hook, a folder created in the wrong parent, a locked-directory `mv` failure, and a lint-check-skipped-past moment. One of the four (the broken global hooks) wasn't just diagnosed on paper — it was actually root-caused and fixed live, then re-verified with a real test tool call.

**What was built:** `HARNESS.md` classifying each incident into exactly one of Concept 10's four failure classes (Context / Constraint / Verification / Planning), naming the fix surface for each (rules file, skill, or hook), and proposing a concrete fix — plus a tally table and a one-sentence verdict on which class the workspace's harness was thinnest in.

**What was tested:** Whether each real incident could be classified honestly into the right failure class and matched to the right fix surface, not just labeled after the fact.

**Key result:** The tally was an even 1-1-1-1 split across all four classes, but by frequency and blast radius it wasn't close — the broken `protect-main.ps1`/`history-log.ps1` global hook entries had silently fired on nearly every tool call, in every project, in every session in this workspace, making Constraint failure the class where the harness was actually thinnest. Investigating it found the real root cause (a global settings.json pointing at a project-relative path that only worked inside one specific unrelated project called "SpecCraft"), and the fix — removing the two misplaced hook entries — was applied and verified for real, not just written down.
