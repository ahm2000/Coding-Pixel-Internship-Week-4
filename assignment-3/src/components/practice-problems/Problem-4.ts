// Problem 4 - the discriminated union result state.
//
// Real implementation: src/app/actions.ts's SignupState type. This file
// demonstrates the CHECK from the brief at both compile time and runtime.
//
// Run individually: npx tsx src/components/practice-problems/Problem-4.ts

import type { SignupState } from '../../app/actions';

const idle: SignupState = { status: 'idle' };
const success: SignupState = { status: 'success' };
const error: SignupState = { status: 'error', message: 'Please fix the errors below.' };

console.log('Problem 4 - the discriminated union result state:');
console.log('  idle:', JSON.stringify(idle));
console.log('  success:', JSON.stringify(success));
console.log('  error:', JSON.stringify(error));

// TypeScript enforces this at compile time, not just at runtime: reading
// `.message` requires first narrowing to the 'error' branch.
const readMessageSafely = (state: SignupState): string | null => (state.status === 'error' ? state.message : null);
console.log('  .message only reachable after narrowing to "error":', readMessageSafely(error) === error.message && readMessageSafely(success) === null);

console.log(
  '\nCHECK - "submitting" is not actually one of this union\'s members: it comes from' +
  " useActionState's own isPending flag on the client, which drives the button's spinner" +
  ' independently of what the server action returns.'
);

console.log(
  '\nDEEPER - preventing double-submit: the submit button\'s disabled={isPending} is wired' +
  ' to the same in-flight promise React already tracks for that action call, not a' +
  ' separately-managed boolean that could be forgotten or reset early - there is no window' +
  ' where a second click could start an overlapping submission.'
);
