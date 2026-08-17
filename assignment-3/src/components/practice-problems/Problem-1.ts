// Problem 1 - the zod schema.
//
// Real implementation: src/lib/schema.ts (kept there, not duplicated here).
// This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-1.ts

import { signupSchema } from '../../lib/schema';

console.log('Problem 1 - the zod schema:');

const bad = signupSchema.safeParse({ name: '', email: 'x', age: 10 });
console.log('  safeParse({ name:"", email:"x", age:10 }).success === false:', bad.success === false);
if (!bad.success) {
  console.log('  issue count === 3:', bad.error.issues.length === 3);
  console.log('  issues:', bad.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
}

const good = signupSchema.safeParse({ name: 'Ada', email: 'ada@example.com', age: 30 });
console.log('  safeParse(valid).success === true:', good.success === true);

console.log(
  '\nDEEPER - turning fieldErrors into per-field messages: zod v4 moved this to a' +
  ' standalone z.flattenError(result.error).fieldErrors (the v3 .flatten() method is' +
  ' gone). It returns { name: [...], email: [...], age: [...] }, keyed exactly like the' +
  ' form field names.'
);
