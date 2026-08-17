// Problem 6 - parseForm(formData).
//
// Real implementation: src/lib/schema.ts (kept there, not duplicated
// here). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-6.ts

import { parseForm } from '../../lib/schema';

console.log('Problem 6 - parseForm(formData):');

const emptyName = new FormData();
emptyName.set('name', '');
emptyName.set('email', 'ada@example.com');
emptyName.set('age', '17');
const r1 = parseForm(emptyName);
console.log('  empty name -> ok:false:', r1.ok === false);
if (!r1.ok) console.log('  has a name error:', 'name' in r1.errors);

const valid = new FormData();
valid.set('name', 'Ada');
valid.set('email', 'ada@example.com');
valid.set('age', '25');
const r2 = parseForm(valid);
console.log('  valid input -> ok:true:', r2.ok === true);
if (r2.ok) console.log('  age string coerced to a real number:', typeof r2.data.age === 'number' && r2.data.age === 25);

console.log(
  '\nDEEPER - where to coerce: in the schema (z.coerce.number()), not before parsing.' +
  ' FormData values are always strings, so pre-coercing by hand would need duplicating' +
  ' that logic everywhere the schema is reused (a plain object in a test, JSON from a' +
  ' client-fetch alternative). Coercing in the schema keeps it the single source of truth.'
);
