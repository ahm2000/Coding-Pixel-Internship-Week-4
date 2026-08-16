export const isActive = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

export interface Crumb {
  label: string;
  href: string;
}

const titleCase = (slug: string): string => slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');

export const crumbs = (pathname: string): Crumb[] => {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => ({
    label: titleCase(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`
  }));
};
