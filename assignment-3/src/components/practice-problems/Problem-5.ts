// Problem 5 - the env var boundary.
//
// process.env.API_KEY read inside a route handler never ships to the
// browser, but the same read in a Client Component (without a
// NEXT_PUBLIC_ prefix) is undefined.
//
// This file runs in Node (like a route handler does), so it genuinely sees
// every variable - proving the "server sees everything" half of the claim.
// The "client sees only NEXT_PUBLIC_*" half is demonstrated live in the
// browser by src/components/EnvBoundaryDemo.tsx, not here, because a
// bundler-time string replacement only happens in an actual Next.js client
// build - not in a plain Node script.
//
// Run individually: npx tsx src/components/practice-problems/Problem-5.ts

// Plain `tsx` doesn't auto-load .env.local the way `next dev` does - load it
// explicitly so this demo actually shows Node seeing the variable, the same
// way the real route handler's process does.
try {
  process.loadEnvFile(new URL('../../../.env.local', import.meta.url));
} catch {
  // No .env.local yet - process.env.API_BASE_URL will just show as undefined below.
}

console.log('Problem 5 - the env var boundary:');
console.log('  Running in Node (same as a route handler) - process.env.API_BASE_URL:', JSON.stringify(process.env.API_BASE_URL));
console.log('  Node sees every variable here, defined or not, same as src/app/api/config/route.ts does.');

console.log(
  '\nCHECK, verified live in the browser (see EnvBoundaryDemo.tsx / npm run verify):' +
  ' process.env.NEXT_PUBLIC_SITE_NAME is defined in the browser; process.env.API_BASE_URL' +
  ' (no prefix) is undefined there, even though this same script (running server-side)' +
  ' sees it fine.'
);

console.log(
  '\nDEEPER - deciding what\'s safe to expose: "would I be fine with this being visible,' +
  ' permanently, in any visitor\'s browser devtools?" NEXT_PUBLIC_SITE_NAME is just a' +
  ' display string - yes. API_BASE_URL might point at internal infrastructure - no, it' +
  ' stays server-only. NEXT_PUBLIC_ is a one-way door: removing the prefix later doesn\'t' +
  ' un-expose what already shipped in a built bundle.'
);
