# Project 8 — Two nights, one harness (Concept 12, coupling — capstone)

**Difficulty:** Advanced (capstone)

**What was tested:** Whether the hardened harness contracts from Projects 2 and 5 (typed-verdict validator, lint PostToolUse hook, exit-code gate) are model-portable — do they work the same on Haiku 4.5 as they did on Sonnet 5?

**Key findings:** 
1. **Verdict schema coupling caught cleanly:** Haiku naturally produced `"NEEDS_WORK"` (not `"PASS"`/`"FAIL"`) and `"MEDIUM"` risk (not `"low"`/`"high"`), but the `validate-verdict.js` contract rejected it immediately without special handling — the harness enforces the schema after the fact, not by training the model.
2. **Lint self-correction is identical:** Haiku fixed an injected unused variable in one try, same as Sonnet did in Project 2. The lint hook (PostToolUse feedback + exit-code gate) required zero adaptation for a different model.

**Why this matters:** Concept 12 (coupling) is about preventing harness logic from depending on how a specific model thinks. The test shows: when contracts are tight (typed, validated, enforce-first), behavior differences stay isolated at the boundary and don't propagate downstream. The harness works the same way on two different models because it doesn't try to predict or normalize their outputs — it just rejects invalid ones.

**Result:** Both contracts (verdict validator, lint hook) are portable across models. The harness works because it constrains *what* gets accepted, not *how* the model produces it.
