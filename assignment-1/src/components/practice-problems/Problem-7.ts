// Problem 7 - the navigation pipeline, end to end.
//
// Hovering/entering-viewport on a <Link> triggers a prefetch of that
// route's payload. On click, the router swaps only the changed segment -
// the shared layout tree above it is reused, not re-rendered. If the new
// segment's Server Component is still awaiting, Next shows that segment's
// loading.tsx in place of the swapped content until the server render
// resolves. This is why the network tab shows no new *document* request
// (only the click) yet a loading UI can still appear - two different
// observations, one mechanism.
//
// Run individually: npx tsx src/components/practice-problems/Problem-7.ts

const pipeline = [
  '1. Hover/viewport-enter on <Link> -> Next prefetches that route\'s payload',
  '2. Click -> router swaps only the changed segment, shared layout tree above it is reused',
  '3. If the new segment\'s Server Component is still awaiting -> its loading.tsx shows in its place',
  '4. Server render resolves -> the real content swaps in',
];

console.log('Problem 7 - navigation pipeline:');
pipeline.forEach((step) => console.log('  ' + step));
console.log('\nWhy no document request AND a loading UI can both be true: the click never asks for a');
console.log('new HTML document (step 2), but a still-awaiting Server Component (step 3) is a separate,');
console.log('unrelated reason a loading UI can appear.');
