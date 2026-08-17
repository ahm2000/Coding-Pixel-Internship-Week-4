import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-emerald-900/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:bg-emerald-700 transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 3.5 9 15 15 0 0 1-3.5 9 15 15 0 0 1-3.5-9A15 15 0 0 1 12 3Z" />
            </svg>
          </span>
          <span className="font-semibold text-slate-900 tracking-tight">Country Explorer</span>
        </Link>
        <nav className="text-sm">
          <Link href="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
            All countries
          </Link>
        </nav>
      </div>
    </header>
  );
}
