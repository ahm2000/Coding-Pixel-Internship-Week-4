// Problem 1 - the route table.
//
// List every route this app serves and the file that implements it.
//
// Run individually: npx tsx src/components/practice-problems/Problem-1.ts

const routes = [
  { url: '/', file: 'src/app/page.tsx' },
  { url: '/about', file: 'src/app/(marketing)/about/page.tsx', note: '(marketing) is a route group - it never appears in the URL' },
  { url: '/dashboard', file: 'src/app/dashboard/page.tsx' },
  { url: '/dashboard/settings', file: 'src/app/dashboard/settings/page.tsx' },
  { url: '/dashboard/broken', file: 'src/app/dashboard/broken/page.tsx' },
];

console.log('Route table:');
for (const route of routes) {
  console.log(`  ${route.url.padEnd(22)} -> ${route.file}${route.note ? `  (${route.note})` : ''}`);
}

const oneFilePerRoute = routes.length === new Set(routes.map((r) => r.file)).size;
console.log('\nEvery route maps to exactly one page.tsx file:', oneFilePerRoute);
