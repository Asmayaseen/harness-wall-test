# Project 5 — Reject a well-formed lie (Concept 9, typed output)

Built validate-verdict.js: field-by-field validation of a reviewer's JSON verdict — checks verdict is exactly PASS or FAIL, risk is exactly low or high, reasons is an array of strings, and reasons is non-empty unless it's a clean low-risk PASS.

Ran 5 test cases through it:
- Clean PASS → accepted
- Clean FAIL with reasons → accepted
- {"verdict":"MAYBE",...} — well-formed JSON but an invalid value → correctly REJECTED and escalated to needs-a-human.md
- A long, unclear, non-JSON review paragraph → correctly REJECTED as invalid JSON and escalated
- JSON missing the reasons field → correctly REJECTED and escalated

Key proof: the MAYBE case is what makes this validator real — a naive check that only asks 'does .verdict exist?' would have accepted it. This one validates against the allowed value set, not just presence, exactly as Concept 9 requires.

All 3 failures landed in needs-a-human.md with timestamp, raw input, and rejection reason — the escalation path worked instead of the loop guessing at an ambiguous or malformed verdict.
