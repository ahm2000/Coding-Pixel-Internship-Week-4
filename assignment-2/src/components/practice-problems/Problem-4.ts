// Problem 4 - getByCode(countries, code).
//
// Real implementation: src/lib/countries.ts (kept there, not duplicated
// here). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-4.ts

import { getByCode, type Country } from '../../lib/countries';

const sample: Country[] = [
  { name: 'France', capital: 'Paris', population: 1, region: 'Europe', flags: { png: '', svg: '' }, alpha3Code: 'FRA', languages: [], borders: ['ESP', 'DEU'] },
];

console.log('Problem 4 - getByCode(countries, code):');
console.log('  getByCode(sample, "FRA")?.name === "France":', getByCode(sample, 'FRA')?.name === 'France');
console.log('  getByCode(sample, "fra")?.name === "France" (case-insensitive):', getByCode(sample, 'fra')?.name === 'France');
console.log('  getByCode(sample, "XXX") === null (absent -> null):', getByCode(sample, 'XXX') === null);

console.log(
  '\nDEEPER - null pairs with notFound(), not with throwing to error.tsx: a missing country' +
  ' from a syntactically valid code is expected user input (a typo, a stale bookmark) -' +
  ' exactly what the not-found convention exists for. error.tsx stays reserved for' +
  ' genuinely unexpected failures (the API being unreachable), which is a *thrown* error,' +
  ' not a null lookup.'
);
