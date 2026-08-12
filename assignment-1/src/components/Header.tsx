'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { isActive } from '@/lib/nav';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' }
];

const Header = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(pathname, link.href) ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="stays put across navigation"
          className="px-3 py-1.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </header>
  );
};

export default Header;
