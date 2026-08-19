const fs = require("fs");
const path = require("path");
const { validateVerdict } = require("./validate-verdict");

const testCases = [
  {
    label: "a. Clean valid PASS",
    input: '{"verdict":"PASS","reasons":[],"risk":"low"}',
  },
  {
    label: "b. Clean valid FAIL",
    input: '{"verdict":"FAIL","reasons":["test broke"],"risk":"high"}',
  },
  {
    label: "c. Hand-crafted lie (well-formed JSON, bad verdict value)",
    input: '{"verdict":"MAYBE","reasons":[],"risk":"low"}',
  },
  {
    label: "d. Long, unclear, non-JSON review text",
    input:
      "This mostly passes, though I have some doubts about edge cases and would want a second look before merging, so I'm not fully confident either way.",
  },
  {
    label: "e. Malformed JSON missing the reasons field entirely",
    input: '{"verdict":"PASS","risk":"low"}',
  },
];

const logPath = path.join(__dirname, "needs-a-human.md");

for (const { label, input } of testCases) {
  const result = validateVerdict(input);
  const escalated = !result.valid;

  console.log(`\n--- ${label} ---`);
  console.log("Input:", input);
  console.log("Result:", result);
  console.log("Escalated to needs-a-human.md:", escalated);

  if (escalated) {
    const timestamp = new Date().toISOString();
    const line = `- ${timestamp} | raw: ${JSON.stringify(input)} | reason: ${result.reason}\n`;
    fs.appendFileSync(logPath, line);
  }
}
