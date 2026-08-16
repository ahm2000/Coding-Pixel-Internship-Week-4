// Problem 2 - why <Link> doesn't full-reload.
//
// <Link> intercepts the click and does client-side navigation: it swaps the
// matched segment's payload without requesting a new HTML document. A raw
// <a> always asks the browser for a fresh document.
//
// This isn't a pure function to unit-test - it's a browser-network claim.
// The real proof lives in scripts/verify-routing.mjs, which records every
// resourceType() === 'document' request across a real <Link> click.
//
// Run individually: npx tsx src/components/practice-problems/Problem-2.ts

const claim = {
  mechanism: '<Link> intercepts the click; client-side router swaps only the changed segment',
  contrast: 'a raw <a> always triggers a full document request',
  liveProof: "verify-routing.mjs: documentRequests.length === 0 after clicking a <Link>",
};

console.log('Problem 2 - <Link> vs <a>:');
console.log(JSON.stringify(claim, null, 2));
