function validateVerdict(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return { valid: false, reason: `Invalid JSON: ${err.message}` };
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { valid: false, reason: "Parsed JSON is not an object" };
  }

  const { verdict, risk, reasons } = parsed;

  if (verdict !== "PASS" && verdict !== "FAIL") {
    return {
      valid: false,
      reason: `verdict must be exactly 'PASS' or 'FAIL', got ${JSON.stringify(verdict)}`,
    };
  }

  if (risk !== "low" && risk !== "high") {
    return {
      valid: false,
      reason: `risk must be exactly 'low' or 'high', got ${JSON.stringify(risk)}`,
    };
  }

  if (!Array.isArray(reasons) || !reasons.every((r) => typeof r === "string")) {
    return {
      valid: false,
      reason: `reasons must be an array of strings, got ${JSON.stringify(reasons)}`,
    };
  }

  const isCleanPass = verdict === "PASS" && risk === "low";
  if (reasons.length === 0 && !isCleanPass) {
    return {
      valid: false,
      reason: "reasons must be non-empty unless verdict is a clean PASS (PASS + low risk)",
    };
  }

  return { valid: true, verdict, risk, reasons };
}

module.exports = { validateVerdict };
