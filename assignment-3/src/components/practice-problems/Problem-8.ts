// Problem 8 - the success/error UX flow.
//
// Not a pure function - a UX design question. Verified live via
// SignupForm.tsx and screenshots taken during development (see the
// README's "P8" section for the two real bugs found while building this:
// React 19 resetting fields on error, and preserving them with a ref).
//
// Run individually: npx tsx src/components/practice-problems/Problem-8.ts

const flow = {
  validSubmit: {
    fieldsClear: true,
    confirmation: 'green panel with a checkmark: "You\'re on the list. We\'ll be in touch."',
    buttonState: 'returns to its idle label',
  },
  invalidSubmit: {
    fieldsClear: false,
    confirmation: 'red per-field messages directly under each invalid field, plus one summary banner',
    entryPreserved: 'every value the user already typed is kept exactly as typed - nothing is lost',
  },
};

console.log('Problem 8 - the success/error UX flow:');
console.log(JSON.stringify(flow, null, 2));

console.log(
  '\nDEEPER - screen-reader announcement: a visually hidden <div aria-live="polite"> updates' +
  ' with "Signup successful." or the error message on every state change, separate from' +
  ' the colored confirmation/error banners (which are just markup a screen reader has no' +
  ' reason to revisit on its own) - the live region is what actually gets announced' +
  ' without the user needing focus anywhere near the form when the result arrives.'
);
