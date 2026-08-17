// Problem 6 - the Client island boundary.
//
// 'use client' marks a module (and what it exclusively imports) as needing
// to run in the browser - it does NOT force its parent, or anything passed
// into it, to become client too.
//
// Run individually: npx tsx src/components/practice-problems/Problem-6.ts

const facts = {
  whatUseClientMarks: "the exact module it's declared in, plus anything that module exclusively imports",
  whatItDoesNotForce: "the parent that renders it (page.tsx stays a Server Component even though it renders <SearchAndFilter/>)",
  deeper:
    'Passing a Server Component as children into a Client Component does not violate the ' +
    'boundary, because the Server Component is rendered on the server FIRST - its already-' +
    'resolved output (serialized JSX, not source code) is what the Client Component receives ' +
    'as a prop. The Client Component never imports or re-executes the Server Component\'s ' +
    'module, so nothing about it needs to run client-side.',
};

console.log('Problem 6 - the Client island boundary:');
console.log(JSON.stringify(facts, null, 2));
