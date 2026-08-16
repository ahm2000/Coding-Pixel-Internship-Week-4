// Problem 5 - how error.tsx works.
//
// error.tsx is an error boundary Next.js wraps around the route segment;
// dashboard/broken/page.tsx throws unconditionally and dashboard/error.tsx
// catches it. Boundaries are implemented with componentDidCatch, which only
// exists on class components - React has no hooks equivalent - so
// error.tsx must be a Client Component ('use client') and receives
// { error, reset } as props. An error thrown in app/layout.tsx isn't caught
// by dashboard/error.tsx, because the layout renders *above* where that
// boundary is mounted - that needs app/global-error.tsx instead.
//
// Run individually: npx tsx src/components/practice-problems/Problem-5.ts

const facts = {
  whyClientComponent: 'error boundaries need componentDidCatch, a class-component lifecycle method with no hooks equivalent',
  propsReceived: ['error: Error & { digest?: string }', 'reset: () => void'],
  scope: "dashboard/error.tsx only catches throws inside app/dashboard/** - a throw in app/layout.tsx needs app/global-error.tsx",
  liveProof: 'verify-routing.mjs: clicking "Broken page" renders "Something broke"; clicking "Try again" calls reset() and re-attempts the render',
};

console.log('Problem 5 - error.tsx:');
console.log(JSON.stringify(facts, null, 2));
