const { lookupCustomer } = require("./connector");

const badIds = ["expired", "notfound", "badformat"];

for (const id of badIds) {
  console.log(`\n--- lookupCustomer("${id}") ---`);
  try {
    lookupCustomer(id);
  } catch (err) {
    console.log(err);
  }
}
