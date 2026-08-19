# Project 5 — Reject a well-formed lie (Concept 9, typed output)

**Difficulty:** Intermediate

**What was built:** `validate-verdict.js`, a field-by-field validator for a reviewer's JSON verdict — checks `verdict` is exactly `PASS` or `FAIL`, `risk` is exactly `low` or `high`, `reasons` is an array of strings, and `reasons` is non-empty unless it's a clean low-risk PASS. Failures return `{ valid: false, reason }` instead of throwing, plus `needs-a-human.md`, an escalation log that every failed validation gets appended to.

**What was tested:** 5 cases run through `validateVerdict` via `run-tests.js` — a clean PASS, a clean FAIL with reasons, a well-formed-but-invalid `"MAYBE"` verdict (the course's hand-crafted lie), a long non-JSON review paragraph, and JSON missing the `reasons` field entirely.

**Key result:** The `"MAYBE"` case is what proves the validator is real — a naive check that only asks "does `.verdict` exist?" would have accepted it. This one validates against the allowed value set, not just presence, exactly as Concept 9 requires. All 3 invalid cases were correctly rejected and escalated to `needs-a-human.md` with timestamp, raw input, and rejection reason — the escalation path worked instead of the loop guessing at an ambiguous or malformed verdict.
