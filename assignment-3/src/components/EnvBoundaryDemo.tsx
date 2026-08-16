'use client';

import { useEffect, useState } from 'react';

// JSON.stringify(undefined) returns the JS value undefined, not the string
// "undefined" - React would render that as nothing, hiding the exact point
// this component exists to demonstrate. String(...) always yields text.
const show = (value: string | undefined) => (value === undefined ? 'undefined' : JSON.stringify(value));

export default function EnvBoundaryDemo() {
  // Reading process.env.API_BASE_URL (no NEXT_PUBLIC_ prefix) directly in
  // render would mismatch between server and client: Next.js server-side
  // rendering runs this "client" component in Node, where every env var is
  // genuinely visible, but the *browser* bundle has any non-NEXT_PUBLIC_
  // reference replaced with `undefined` at build time. Rendering it
  // straight away would make SSR HTML and the first client render disagree
  // and force React to discard and regenerate the tree. Reading it inside
  // an effect means both the server render and the initial client render
  // show the same "checking..." placeholder; only the value revealed after
  // mount comes from the real client bundle.
  const [values, setValues] = useState<{ siteName?: string; apiBaseUrl?: string } | null>(null);

  useEffect(() => {
    // Deliberate exception to react-hooks/set-state-in-effect: this value
    // can only be read correctly post-hydration (see the comment above), so
    // there's no way to derive it during render without reintroducing the
    // exact mismatch this effect exists to avoid.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues({
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      apiBaseUrl: process.env.API_BASE_URL,
    });
  }, []);

  return (
    <dl className="text-xs space-y-1.5 font-mono">
      <div className="flex justify-between gap-4">
        <dt className="text-slate-500">NEXT_PUBLIC_SITE_NAME</dt>
        <dd className="text-emerald-700">{values ? show(values.siteName) : 'checking...'}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-slate-500">API_BASE_URL</dt>
        <dd className="text-rose-600">{values ? show(values.apiBaseUrl) : 'checking...'}</dd>
      </div>
    </dl>
  );
}
