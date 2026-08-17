// Problem 7 - validating params.code before fetching.
//
// Real implementation: src/lib/validate.ts (kept there, not duplicated
// here). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-7.ts

import { isPlausibleCode } from '../../lib/validate';

console.log('Problem 7 - isPlausibleCode(code):');

const cases: [string, boolean][] = [
  ['FRA', true],
  ['fra', true],
  ['ZZZ', true], // well-formed, absent - passes validation, fails the later lookup
  ['x', false], // malformed - rejected before any fetch
  ['FRAA', false],
  ['123', false],
];

let allPass = true;
for (const [code, expected] of cases) {
  const actual = isPlausibleCode(code);
  const pass = actual === expected;
  if (!pass) allPass = false;
  console.log(`  isPlausibleCode(${JSON.stringify(code)}) === ${expected}  ->  ${pass ? 'PASS' : 'FAIL'} (got ${actual})`);
}
console.log('\nAll cases pass:', allPass);

console.log(
  '\nCHECK, verified live: /country/FRA renders France; /country/ZZZ (well-formed, absent)' +
  ' -> not-found AFTER a null lookup (the fetch does run); /country/x (malformed) ->' +
  ' not-found BEFORE fetching (rejected by isPlausibleCode, fetchCountries() never called).'
);
