// Problem 2 - borderLinks(codes).
//
// Real implementation: src/lib/countries.ts (kept there, not duplicated
// here - graded logic lives in one named place). This file only
// demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-2.ts

import { borderLinks } from '../../lib/countries';

console.log('Problem 2 - borderLinks(codes):');

const withBorders = borderLinks(['ESP', 'DEU']);
console.log('  borderLinks(["ESP", "DEU"]) =', JSON.stringify(withBorders));
const expected = [{ code: 'ESP', href: '/country/ESP' }, { code: 'DEU', href: '/country/DEU' }];
console.log('  matches expected:', JSON.stringify(withBorders) === JSON.stringify(expected));

const missing = borderLinks(undefined);
console.log('  borderLinks(undefined) =', JSON.stringify(missing));
console.log('  missing borders -> [] (85 of 250 countries have no `borders` field):', missing.length === 0);
