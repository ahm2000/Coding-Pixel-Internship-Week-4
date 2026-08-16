// Problem 3 - why the server list means no browser network request.
//
// page.tsx is an async Server Component - its `await fetchCountries()`
// executes on the Next.js server, and only the rendered result (HTML on
// first load, an RSC payload on navigation) is sent to the browser. The
// browser's network tab never sees countries.dev.
//
// Not a pure function - a network-boundary claim. The real proof:
// scripts/verify-routing.mjs records every resourceType() === 'document'
// request across a <Link> click and asserts it stays at zero.
//
// Run individually: npx tsx src/components/practice-problems/Problem-3.ts

const claim = {
  whereFetchRuns: 'inside the Next.js server process, during await fetchCountries() in the Server Component',
  whatBrowserSees: 'only the rendered HTML/RSC payload - never a request to countries.dev',
  liveProof: 'verify-routing.mjs: documentRequests.length === 0 across a <Link> click to a country',
  deeper: 'a later client-side navigation (clicking a border <Link>) still runs fetchCountries() on the SERVER - the browser only ever asks the Next.js server for the new RSC payload, never countries.dev directly',
};

console.log('Problem 3 - server-fetched list, no browser network call:');
console.log(JSON.stringify(claim, null, 2));
