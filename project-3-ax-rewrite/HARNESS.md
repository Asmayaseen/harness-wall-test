# Project 3 — AX: design the harness for the agent that uses it (Concept 7)

Connector: a simulated customer-lookup tool (connector.js), lookupCustomer(id).

Three bad error patterns triggered on purpose and rewritten:

1. expired: 'Error 401' → 'Auth token expired. Call refreshToken() and retry lookupCustomer with the new token.'
2. notfound: 'Error 404' → 'No customer found for this id. Verify the id is correct, or call searchCustomers(query) to find the right id.'
3. badformat: 'Invalid request' → 'Invalid id format: expected a string like "CUST-12345". Reformat the id and retry.'

Proof of self-healing: called lookupCustomer('badformat'), got the new error message, and on the very next call — using only the information in that error — successfully called lookupCustomer('CUST-98765') and got a valid result. No human help, no docs, no guessing.

One-line summary: the old errors named only that something failed (and leaked raw HTTP-style codes). The new errors name what failed, why, and the exact next call to make — turning a wasted beat into a self-healing one.
