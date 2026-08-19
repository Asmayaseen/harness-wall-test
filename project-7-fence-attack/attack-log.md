# Attack Log — Blocked Attempts

Every tool call blocked by the project fence (deny rules + `fence-guard.ps1` PreToolUse hook) is appended below, loud and clearly flagged, the moment it's blocked — never silently. Format: timestamp, tool, what was attempted, why it was blocked.
- ðŸš¨ BLOCKED [2026-08-19T14:33:24Z] tool=Bash attempted="rm -rf "/d/harness-engineering-course/project-4-tool-trim/sample-repo/.git" "/d/harness-engineering-course/project-7-fence-attack/sample-repo/.git"
echo "=== confirm removed ==="
ls -la "/d/harness-engineering-course/project-4-tool-trim/sample-repo" | grep -i git
ls -la "/d/harness-engineering-course/project-7-fence-attack/sample-repo" | grep -i git
echo "(no output above means .git is gone from both)"" reason="matches denied pattern Bash(rm -rf *)"
