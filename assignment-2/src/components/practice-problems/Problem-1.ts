// Problem 1 - Server/Client triage table.
//
// For each piece of this app, is it a Server or Client Component, and why.
//
// Run individually: npx tsx src/components/practice-problems/Problem-1.ts

const triage = [
  { piece: 'List fetch (src/app/page.tsx)', kind: 'Server', reason: 'pure data fetch, no interactivity' },
  { piece: 'Detail fetch (src/app/country/[code]/page.tsx)', kind: 'Server', reason: 'pure data fetch, no interactivity' },
  { piece: 'Search box (SearchAndFilter.tsx)', kind: 'Client', reason: 'needs onChange + local state' },
  { piece: 'Region filter (SearchAndFilter.tsx)', kind: 'Client', reason: 'needs onClick' },
  { piece: 'Nav header (Header.tsx)', kind: 'Server', reason: 'static <Link>s, nothing dynamic' },
];

console.log('Problem 1 - Server/Client triage:');
for (const row of triage) {
  console.log(`  ${row.piece.padEnd(45)} ${row.kind.padEnd(7)} ${row.reason}`);
}

console.log(
  '\nDEEPER - the server never hands the 250-country list to the client filter: page.tsx' +
  ' passes SearchAndFilter only the derived `regions: string[]` (tiny) plus the current' +
  ' q/region values. The client component only turns UI events into a URL' +
  ' (router.push), and the Server Component re-runs and re-filters for that URL - the' +
  ' country array itself never crosses the client boundary.'
);
