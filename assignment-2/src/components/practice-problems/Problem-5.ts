// Problem 5 - detail route file map.
//
// Map the detail route's concerns to files, and explain API 404 vs.
// unreachable API.
//
// Run individually: npx tsx src/components/practice-problems/Problem-5.ts

const fileMap = [
  { concern: 'The page itself', file: 'src/app/country/[code]/page.tsx' },
  { concern: 'Suspense fallback while it awaits', file: 'src/app/country/[code]/loading.tsx' },
  { concern: 'Error boundary if it throws', file: 'src/app/country/[code]/error.tsx' },
  { concern: 'notFound() target', file: 'src/app/country/[code]/not-found.tsx' },
];

console.log('Problem 5 - detail route file map:');
for (const row of fileMap) {
  console.log(`  ${row.concern.padEnd(35)} -> ${row.file}`);
}

console.log(
  '\nDEEPER - API 404 vs unreachable API: a well-formed but absent code (e.g. /country/ZZZ)' +
  ' is a *successful* fetch with no matching record - getByCode returns null, page.tsx' +
  ' calls notFound(), not-found.tsx renders. An unreachable API (bad host, network' +
  ' failure) makes fetchCountries() itself throw - notFound() has no business modeling' +
  ' that, so it propagates uncaught and error.tsx renders instead. Verified live: /country/ZZZ' +
  ' -> "Country not found"; API_URL pointed at an unreachable host -> "Couldn\'t load this country".'
);
