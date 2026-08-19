# Project 3 — AX: design the harness for the agent that uses it (Concept 7)

**Difficulty:** Intermediate

**What was built:** A simulated MCP-style connector (`connector.js`) exposing `lookupCustomer(id)`, plus a runner (`test-connector.js`). Three deliberately bad error patterns (`'Error 401'`, `'Error 404'`, `'Invalid request'`) were triggered on purpose, then rewritten into actionable AX-style messages that name what failed, why, and the exact next call to make.

**What was tested:** Whether the rewritten error messages alone (no docs, no human help) let an agent recover and complete the task on the very next call.

**Key result:** Proof of self-healing — calling `lookupCustomer('badformat')` returned the new error message, and using only the information in that message, the very next call, `lookupCustomer('CUST-98765')`, succeeded. The old errors named only that something failed (and leaked raw HTTP-style codes); the new errors name what failed, why, and the exact next call to make — turning a wasted beat into a self-healing one.
