// Problem 6 - isActive.
//
// Real implementation: src/lib/nav.ts (kept there, not duplicated here -
// last week's feedback flagged graded logic living only in Problem-N
// files). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-6.ts

import { isActive } from '../../lib/nav';

const cases: [string, string, boolean][] = [
  ['/', '/', true],
  ['/dashboard', '/', false],
  ['/dashboard', '/dashboard', true],
  ['/dashboard/settings', '/dashboard', true],
  ['/dashboardish', '/dashboard', false],
];

console.log('Problem 6 - isActive(pathname, href):');
let allPass = true;
for (const [pathname, href, expected] of cases) {
  const actual = isActive(pathname, href);
  const pass = actual === expected;
  if (!pass) allPass = false;
  console.log(`  isActive(${JSON.stringify(pathname)}, ${JSON.stringify(href)}) === ${expected}  ->  ${pass ? 'PASS' : 'FAIL'} (got ${actual})`);
}
console.log('\nAll cases pass:', allPass);
