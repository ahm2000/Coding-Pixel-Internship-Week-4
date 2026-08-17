import Link from 'next/link';

export default function CountryNotFound() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 9.5 5 5m0-5-5 5" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-slate-900">Country not found</h1>
      <p className="text-sm text-slate-500 mt-1.5">
        That country code doesn&apos;t match any country we know about.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors"
      >
        Back to all countries
      </Link>
    </main>
  );
}
