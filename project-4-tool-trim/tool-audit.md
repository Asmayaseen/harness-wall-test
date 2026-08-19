# Tool audit — project-08-daily-loop `daily-loop` skill

Source: `D:\Loop-Engineering-Projects\project-08-daily-loop\.claude\skills\daily-loop\SKILL.md`
(original file **not modified** — this is audit-only)

## 1. Every actual command/action the skill instructs

Step by step, as written in the body of the skill (not the frontmatter):

- **Step 0**: Read `progress.md` in full before starting anything.
- **Step 1**: Run `pytest watched/ -v` from the project root; read the raw output to determine which modules have failing tests.
- **Step 2**: Count failing modules against the 5-PR cap; for any over the cap, log an entry into `progress.md` ("not yet attempted this run").
- **Step 3** (per failing module):
  1. Decide a branch name (`claude/fix-<module-name>`) — naming convention only, no tool call.
  2. Either delegate the fix to a subagent launched with `isolation: "worktree"`, **or**, if working directly, run `git worktree add` / `git checkout -b` yourself.
  3. Read the failing test file `watched/test_<module>.py` to derive correct behavior.
  4. Edit only `watched/<module>.py` — the smallest change that satisfies the tests. Never touch any `test_*.py` file.
  5. Run `pytest watched/test_<module>.py -v` yourself to confirm the fix passes.
- **Step 4**: Invoke the `reviewer` subagent (fresh agent, not a fork) to independently verify the fix; wait for its `PASS`/`FAIL` + risk verdict.
- **Step 5**:
  - On PASS + low-risk: push the branch and run `gh pr create`; record the PR link in `progress.md` under `## Done`.
  - On PASS + risky, or FAIL: do **not** open a PR; log the module, verdict, and reasoning in `progress.md` under `## Open - needs a human`.
- **Step 6**: Update `progress.md` — append/update entries under `## Done`, `## In progress`, `## Open - needs a human`, even on a no-op run.

## 2. Declared vs. actually-used tools

| Tool | Declared? | Used by skill's actual instructions? | Evidence |
|---|---|---|---|
| **Bash** | Yes | ✅ Used | `pytest watched/ -v`, `pytest watched/test_<module>.py -v`, `git worktree add`/`git checkout -b`, `git push`, `gh pr create` |
| **Read** | Yes | ✅ Used | "read `progress.md` in full" (step 0), "Read the failing test first" (step 3.3) |
| **Write** | Yes | ⚠️ **Not clearly used — candidate to cut** | Every file the skill touches already exists (`progress.md` is read first implying it exists; `watched/<module>.py` is an existing buggy file being *fixed*, not created). No step calls for creating a brand-new file from scratch. All progress.md updates and module fixes read as *modifications* to existing files, which `Edit` covers. |
| **Edit** | Yes | ✅ Used | "Fix only `watched/<module>.py`" (step 3.4), appending `## Done` / `## In progress` / `## Open - needs a human` entries into the existing `progress.md` (steps 2, 5, 6) |
| **Glob** | Yes | ❌ **Not used — candidate to cut** | Failing modules are discovered from `pytest` output ("based on which `test_<module>.py` files reported failures"), never by globbing the `watched/` directory for filenames |
| **Grep** | Yes | ❌ **Not used — candidate to cut** | No step calls for searching file contents; the skill always names exact files (`progress.md`, `watched/<module>.py`, `watched/test_<module>.py`) rather than searching for them |
| **Agent** | Yes | ✅ Used | "invoke the `reviewer` subagent" (step 4), delegating a fix "with `isolation: \"worktree\"`" (step 3.2) |

## 3. Proposed trimmed list

**Original (7 tools):** `Bash, Read, Write, Edit, Glob, Grep, Agent`

**Trimmed (4 tools):** `Bash, Read, Edit, Agent`

**Cut:** `Write`, `Glob`, `Grep`

- `Write` — no step creates a new file; every file the skill touches already exists, so `Edit` alone covers it. (Edge case worth flagging: if `progress.md` might not exist yet on a brand-new project before its first run, `Write` would be needed to create it. The skill's own step 0 phrasing — "read `progress.md` in full" — assumes it already exists, so this reads as a real gap in the skill's instructions rather than a reason to keep `Write`.)
- `Glob` — module discovery is driven entirely by `pytest` output, never by pattern-matching filenames in `watched/`.
- `Grep` — no instruction ever searches file contents; all target files are named explicitly.

No changes have been made to the original `project-08-daily-loop` files — this is audit output only, for review before any trim is applied.
