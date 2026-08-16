'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { crumbs } from '@/lib/nav';

const Chevron = () => (
  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const Breadcrumbs = () => {
  const pathname = usePathname();
  const trail = crumbs(pathname);

  return (
    <nav className="text-sm text-slate-500 flex items-center gap-2 mb-6">
      <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">
        Home
      </Link>
      {trail.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <Chevron />
          {index === trail.length - 1 ? (
            <span className="text-slate-900 font-semibold">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-indigo-600 transition-colors font-medium">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
