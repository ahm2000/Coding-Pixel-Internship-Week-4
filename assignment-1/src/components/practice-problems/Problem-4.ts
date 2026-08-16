// Problem 4 - what triggers loading.tsx.
//
// loading.tsx is the Suspense fallback Next.js puts around an async Server
// Component while it's still awaiting. dashboard/page.tsx does
// `await sleep(1200)` before returning JSX, and is
// `export const dynamic = 'force-dynamic'` - without that, Next could
// statically prerender the page once at build time and the sleep would
// only happen during the build, not on every request.
//
// This file demos the real sleep() helper (src/lib/sleep.ts) that makes the
// suspend genuinely observable - timing it end to end.
//
// Run individually: npx tsx src/components/practice-problems/Problem-4.ts

import { sleep } from '../../lib/sleep';

(async () => {
  console.log('Problem 4 - sleep() is what makes dashboard/page.tsx genuinely suspend:');
  const start = Date.now();
  await sleep(1200);
  const elapsed = Date.now() - start;
  console.log(`  awaited sleep(1200) - actually took ${elapsed}ms`);
  console.log('  elapsed >= 1200ms:', elapsed >= 1200);
  console.log(
    "\nWithout `export const dynamic = 'force-dynamic'` on the page, Next can prerender it" +
    ' at build time - this same await would only run once, during the build.'
  );
})();
