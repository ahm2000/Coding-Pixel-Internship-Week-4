'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { crumbs } from '@/lib/nav';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const trail = crumbs(pathname);

  return (
    <nav className="text-sm text-zinc-500 flex items-center gap-2 mb-6">
      <Link href="/" className="hover:text-zinc-900">
        Home
      </Link>
      {trail.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          {index === trail.length - 1 ? (
            <span className="text-zinc-900 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-zinc-900">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
