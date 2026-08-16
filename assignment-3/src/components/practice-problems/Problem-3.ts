// Problem 3 - the GET route handler.
//
// Real implementation: src/app/api/config/route.ts (kept there - Next.js
// requires route handlers to live under app/api/.../route.ts to be
// wired up; this file re-runs the identical logic standalone so it's
// checkable without a running server).
//
// Run individually: npx tsx src/components/practice-problems/Problem-3.ts

import { readConfig } from '../../lib/config';

// Mirrors src/app/api/config/route.ts's GET handler exactly.
async function GET(env: Record<string, string | undefined>) {
  try {
    const config = readConfig(env);
    return Response.json({ status: 'ok', apiBaseUrl: config.apiBaseUrl });
  } catch (error) {
    return Response.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

(async () => {
  console.log('Problem 3 - the GET route handler:');

  const okRes = await GET({ API_BASE_URL: 'https://api.example.com' });
  const okBody = await okRes.json();
  console.log('  config present -> status 200:', okRes.status === 200);
  console.log('  body contains the env-derived value, never hard-coded:', okBody.apiBaseUrl === 'https://api.example.com');

  console.log(
    '\nDEEPER - the 500 path instead of a crash:'
  );
  const errRes = await GET({});
  const errBody = await errRes.json();
  console.log('  config missing -> status 500 (not an unhandled crash):', errRes.status === 500);
  console.log('  body is a JSON error, not a stack trace:', errBody.status === 'error' && typeof errBody.message === 'string');
})();
