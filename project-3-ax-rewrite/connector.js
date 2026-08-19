function lookupCustomer(id) {
  if (id === "expired") {
    throw new Error(
      "Auth token expired. Call refreshToken() and retry lookupCustomer with the new token."
    );
  }
  if (id === "notfound") {
    throw new Error(
      "No customer found for this id. Verify the id is correct, or call searchCustomers(query) to find the right id."
    );
  }
  if (id === "badformat") {
    throw new Error(
      'Invalid id format: expected a string like "CUST-12345". Reformat the id and retry.'
    );
  }

  return { id, name: "Sample Customer", status: "active" };
}

module.exports = { lookupCustomer };
