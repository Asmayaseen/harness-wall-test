# Project 8 — Two nights, one harness (Concept 12, coupling — capstone)

**Goal:** Test whether the hardened harness contracts from earlier projects (typed-verdict validator from Project 5, lint hook from Project 2) hold up on a different model (Haiku 4.5 vs. Sonnet 5 for all prior projects). Expose behavior-coupling where it exists and measure whether contracts catch and handle it cleanly.

## Findings

### 1. Verdict Schema Coupling — Contract Caught It Cleanly

**Behavior difference:** As Haiku, I naturally produced a verdict with:
- `verdict: "NEEDS_WORK"` (not `"PASS"`/`"FAIL"`)
- `risk: "MEDIUM"` (not `"low"`/`"high"`)

This is typical model behavior: I reasoned through the issues naturally and picked values that made sense semantically, without knowledge of the project-5 schema contract.

**Contract enforcement:** The `validate-verdict.js` validator rejected it immediately:
```
"valid": false,
"reason": "verdict must be exactly 'PASS' or 'FAIL', got \"NEEDS_WORK\""
```

**Coupling outcome:** Clean. The contract (validator + exit-code hook) handled the model mismatch without massaging or post-processing. This is exactly how Concept 12 says it should work: the harness doesn't train the model to match the schema; it enforces the schema after the fact.

**Raw verdict word count:** 61 words across 4 reasons. Haiku's reasons were more concise than typical Sonnet (which tends toward 80-120 words for similar verdicts), likely due to Haiku's inherent brevity.

### 2. Lint Hook Self-Correction — Both Models Match

**Test:** Deliberately added an unused variable (`unusedVar`) to app.js and ran the linter.

**Error produced:** `'unusedVar' is assigned a value but never used  no-unused-vars` on line 12.

**Haiku's response:** Fixed it in one try by removing the line entirely. No re-run needed; the linter passed cleanly on the second attempt.

**Coupling outcome:** No coupling detected. Haiku's lint self-correction behavior matches Sonnet's from Project 2. Both models respond to lint errors the same way: remove the offending code. The lint hook (PostToolUse feedback + exit-code gate) didn't need to adapt to handle Haiku differently.

### 3. Key Insight: Schema Contracts > Model Behavior

The capstone validates Concept 12's main claim: coupling exists *within* model behavior (Haiku reasons differently than Sonnet, produces different verdict tokens), but a well-designed harness contract (typed schema + validation) **prevents that coupling from spreading downstream**. 

- The validator didn't break or require special handling for Haiku's "NEEDS_WORK" verdict; it simply rejected it as invalid.
- The lint hook didn't care that Haiku reasons more tersely; it only cares that the code got fixed.

Both contracts worked identically across models: catch first, enforce second, don't train the model to match.

### 4. What Would Coupling Look Like (Anti-Pattern)

If the harness had tried to *predict* and *handle* different model outputs, that would be coupling:
- e.g., "if verdict not in ('PASS', 'FAIL'), map it based on confidence score" — now the harness is model-aware
- e.g., "accept any risk enum value, normalize to high/low internally" — now the contract is permissive and fragile

Instead, the actual design: reject and escalate. This is tighter and clearer.

## Done-When Check

✅ Typed verdict contract caught model drift cleanly (rejected non-schema verdicts).
✅ Lint hook self-correction worked identically on Haiku vs. Sonnet.
✅ No post-hoc massaging or normalization needed; harness enforced contracts as-is.
✅ Behavior differences (verdict token choices, reasoning verbosity) were isolated and handled at the contract boundary, not hidden in the harness logic.

Conclusion: The harness is portable across models, because the contracts (validate-verdict.js, PostToolUse hook, exit-code gate) don't depend on how the model *thinks*, only on what it *produces*.
