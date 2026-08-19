const assert = require("assert");
const { add } = require("./math");
const { greet } = require("./greet");

try {
  assert.strictEqual(add(2, 3), 5, "add(2, 3) should equal 5");
  assert.strictEqual(greet("World"), "Hello, World!", "greet should format correctly");
  console.log("All checks passed.");
  process.exit(0);
} catch (err) {
  console.error("Check failed:", err.message);
  process.exit(1);
}
