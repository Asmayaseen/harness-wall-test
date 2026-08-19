# Needs a Human — Escalation Log

Every reviewer verdict that fails `validateVerdict` is appended below, one line per entry: timestamp, the raw input, and the rejection reason.
- 2026-08-19T07:17:30.857Z | raw: "{\"verdict\":\"MAYBE\",\"reasons\":[],\"risk\":\"low\"}" | reason: verdict must be exactly 'PASS' or 'FAIL', got "MAYBE"
- 2026-08-19T07:17:30.864Z | raw: "This mostly passes, though I have some doubts about edge cases and would want a second look before merging, so I'm not fully confident either way." | reason: Invalid JSON: Unexpected token 'T', "This mostl"... is not valid JSON
- 2026-08-19T07:17:30.865Z | raw: "{\"verdict\":\"PASS\",\"risk\":\"low\"}" | reason: reasons must be an array of strings, got undefined
