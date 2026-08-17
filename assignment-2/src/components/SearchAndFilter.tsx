'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchAndFilterProps {
  regions: string[];
  currentQuery: string;
  currentRegion: string;
}

// Writes search/region state into the URL and lets the Server Component
// page re-render with the new searchParams — this component never holds
// or filters the country list itself. Initial values arrive as props
// (already parsed server-side) so this component never needs its own
// useSearchParams()/Suspense boundary.
export default function SearchAndFilter({ regions, currentQuery, currentRegion }: SearchAndFilterProps) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery);

  const pushParams = (next: { q?: string; region?: string }) => {
    const q = next.q ?? currentQuery;
    const region = next.region ?? currentRegion;

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (region) params.set('region', region);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      if (query !== currentQuery) pushParams({ q: query });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="relative flex-1">
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.34-4.34M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search countries by name..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => pushParams({ region: '' })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            currentRegion === ''
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
          }`}
        >
          All regions
        </button>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => pushParams({ region: currentRegion === region ? '' : region })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              currentRegion === region
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}
