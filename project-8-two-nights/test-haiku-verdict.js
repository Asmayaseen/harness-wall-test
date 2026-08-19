const fs = require('fs');
const { validateVerdict } = require('../project-5-typed-verdict/validate-verdict.js');

const rawVerdictText = fs.readFileSync('./haiku-verdict-raw.txt', 'utf-8');
const result = validateVerdict(rawVerdictText);

console.log('Validation result:');
console.log(JSON.stringify(result, null, 2));
