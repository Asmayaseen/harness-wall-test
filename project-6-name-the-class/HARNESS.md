# Project 6 — Name the class, write the fix (Concept 10, failure classes/the ratchet)

Instead of a simulated week, this classifies four **real** incidents that actually happened across this session's work on Projects 1-5.

---

## Incident 1 — Broken global hook references (`protect-main.ps1`, `history-log.ps1`)

**What happened:** Every session in this workspace shows a repeating `PreToolUse:Bash` hook error — a user-level Claude Code settings file references `protect-main.ps1` and `history-log.ps1` hook scripts that were never actually created on this machine. It's non-blocking, but fires on nearly every `Bash` call, in every project folder, in every session.

**Class: Constraint failure.** The name and placement of these hooks (`protect-main`, `history-log`) make their intent obvious: one is meant to guard the main branch, the other to log history for observability. Because the referenced scripts don't exist, that enforcement/observability layer has never actually run — it *looks* configured but constrains nothing and logs nothing. This isn't "the agent did something it shouldn't have" in the literal sense (no bad main-branch action has been observed), but the guardrail meant to prevent that is silently absent workspace-wide, which is exactly the gap Constraint failure describes.

**Fix surface: hook.** This lives entirely at the hook-configuration layer, not in a rules file or a skill.

**Root cause, found on investigation:** The scripts weren't actually missing — they exist at `~/.claude/hooks/protect-main.ps1` and `~/.claude/hooks/history-log.ps1`. The bug was the *path* the global settings.json used to reach them: `"$CLAUDE_PROJECT_DIR"/.claude/hooks/protect-main.ps1` resolves relative to whatever *project* is currently open, not the user's home directory — so it only ever worked inside the one project that had its own local copy of these scripts, and errored everywhere else. Reading the scripts' actual content confirmed they're hardcoded for a specific project called "SpecCraft" (the block message reads "BLOCKED: SpecCraft never touches the main branch," and the log path is `.speccraft/history/conversation.jsonl`) — no SpecCraft project exists anywhere in this workspace. These are project-scoped hooks that were mistakenly wired into the *global* settings.json instead of living in that project's own local `.claude/settings.json`.

**Fix actually applied (not just documented):** Removed the `PreToolUse`/`Bash` (`protect-main.ps1`) and `Stop` (`history-log.ps1`) hook entries from `C:\Users\S com\.claude\settings.json`, since they don't belong at the global level for any project outside SpecCraft. The `SessionStart` and `PermissionRequest` hooks were left untouched. The `.ps1` script files themselves were left in place at `~/.claude/hooks/` (not deleted), in case they get relocated into the actual SpecCraft project's own settings later. Verified with a follow-up `Bash` tool call (`ls`) immediately after the edit — the `PreToolUse:Bash` hook error no longer appears.

---

## Incident 2 — `harness-engineering-course` created inside the wrong parent

**What happened:** Early in this session's history, the `harness-engineering-course` folder was accidentally created nested inside `harness-wall-test` instead of at the `D:\` root, requiring a multi-step recovery (robocopy, manual cleanup) because a locked directory couldn't be deleted outright.

**Class: Context failure.** The folder was created without confirming the actual working directory / real target path first — the agent (in that earlier session) acted on an assumed location rather than a verified one. That's "it didn't know" in the most literal sense: it didn't know where it actually was before it wrote there.

**Fix surface: rules file / skill.** This needs a standing instruction, not a one-off correction.

**Concrete fix:** Add a rule to this workspace's `CLAUDE.md` (or a small skill): before creating any new top-level project folder, print/confirm the absolute target path (`pwd` / `Get-Location` plus the literal destination) and verify the parent directory is the intended one — never assume the current or target location from context alone.

---

## Incident 3 — `mv` failed with "Device or resource busy" during the recovery

**What happened:** During the same recovery, an `mv` command failed with "Device or resource busy" because VS Code had an open file handle on the folder being moved, requiring a fallback to `robocopy`.

**Class: Planning failure.** The pieces used were right (move the directory, then a working alternative), but the order was backwards: the first attempt (`mv`) didn't account for a well-known Windows failure mode — an editor holding a handle on a directory mid-move — so the plan needed an unplanned second pass with a more robust tool instead of leading with it.

**Fix surface: rules file / skill.** Not a task-size problem — a missing documented procedure.

**Concrete fix:** Document a "moving/renaming directories on Windows" note in a rules file or skill: prefer `robocopy /MOVE /E` for directory moves (it retries through locked-file conditions gracefully) as the *first* choice, not the fallback, whenever the source directory may be open in an editor or file watcher — don't rediscover this mid-incident.

---

## Incident 4 — Project 2: declaring "stopping here" on a failing lint check

**What happened:** In Project 2, the first response to a failing lint check was to declare "stopping here" without fixing it, requiring an explicit follow-up instruction from the user to actually fix the error — this was *before* the Stop-gate hook existed to prevent exactly this.

**Class: Verification failure.** Incomplete, failing work was reported as finished without being checked against the actual bar (lint passing). The claim of "done" outran the verification that would have caught it.

**Fix surface: hook.** This is exactly what got built immediately afterward.

**Concrete fix:** Already implemented — a `Stop` hook that runs `npm run lint` and blocks session end (exit 2, with the lint output fed back) whenever lint still fails, closing the gap between "agent says done" and "work verified done." (See Project 2's `HARNESS.md`.)

---

## Tally

| Failure class | Count |
|---|---|
| Context failure | 1 (Incident 2) |
| Constraint failure | 1 (Incident 1) |
| Verification failure | 1 (Incident 4) |
| Planning failure | 1 (Incident 3) |

**Which class dominated:** By raw count it's an even 1-1-1-1 split, but by frequency and blast radius it wasn't close before the fix — Incidents 2-4 were each single, one-time historical events that already got fixed or worked around, while Incident 1's broken `protect-main.ps1`/`history-log.ps1` hooks had silently fired on nearly every tool call, in every project folder, in every session in this workspace. That made **Constraint failure** the class where this workspace's harness was thinnest — and, being the only one of the four still live and unfixed at the time this file was written, it's also the one that was actually fixed here (the two misplaced global hook entries were removed from `~/.claude/settings.json`), not just diagnosed on paper.
