// Simple demo utilities for greeting and adding numbers

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

function main() {
  console.log(greet("world"));
  console.log(`2 + 3 = ${add(2, 3)}`);
}

main();

module.exports = { greet, add };
