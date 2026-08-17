import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-violet-900/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 group-hover:bg-violet-700 transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          <span className="font-semibold text-slate-900 tracking-tight">{process.env.NEXT_PUBLIC_SITE_NAME ?? 'Signup'}</span>
        </Link>
        <a
          href="/api/config"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-slate-500 hover:text-violet-700 transition-colors"
        >
          /api/config
        </a>
      </div>
    </header>
  );
}
