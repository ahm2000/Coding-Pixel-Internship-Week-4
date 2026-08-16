// Problem 2 - readConfig(env).
//
// Real implementation: src/lib/config.ts (kept there, not duplicated
// here). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-2.ts

import { readConfig } from '../../lib/config';

console.log('Problem 2 - readConfig(env):');

const withValue = readConfig({ API_BASE_URL: 'https://api.example.com' });
console.log('  set -> returns the value:', withValue.apiBaseUrl === 'https://api.example.com');

try {
  readConfig({});
  console.log('  unset -> should have thrown: FAIL');
} catch (err) {
  console.log('  unset -> throws a named error instead of returning undefined:', (err as Error).message.includes('API_BASE_URL'));
}

console.log(
  '\nDEEPER - why .env.example lists the KEY but never the real VALUE: .env.example is' +
  ' committed to git, which means anything in it is public in the repo and its history,' +
  ' permanently, the moment it\'s pushed. It documents which variables the app needs -' +
  ' a real value belongs only in .env.local (gitignored) or a deploy platform\'s secret store.'
);
