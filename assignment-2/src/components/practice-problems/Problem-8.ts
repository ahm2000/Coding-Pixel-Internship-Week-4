// Problem 8 - tracing a border-link click end to end (France -> Spain).
//
// Not a pure function - a request-lifecycle trace. The real proof: live
// navigation from /country/FRA to /country/ESP via the ESP border <Link>,
// with the loading.tsx skeleton observed mid-navigation.
//
// Run individually: npx tsx src/components/practice-problems/Problem-8.ts

const trace = [
  '1. Click the ESP <Link> on France\'s page -> Next intercepts, no document reload',
  '2. Root layout\'s <Header/> and the "Back to all countries" link are outside the',
  '   swapped segment - they do not re-render or remount',
  '3. Next requests the RSC payload for /country/ESP',
  '4. country/[code]/loading.tsx\'s skeleton fills the swapped segment while that\'s in flight',
  '5. On the server, page.tsx re-runs for code = "ESP": validates the code, calls',
  '   fetchCountries() again (a fresh fetch, with the artificial delay - this is what makes',
  '   the skeleton visible instead of instant), finds Spain via getByCode',
  '6. The rendered result streams back; Next swaps only that segment in',
];

console.log('Problem 8 - border-link click trace, France -> Spain:');
trace.forEach((step) => console.log('  ' + step));
console.log(
  "\nSpain's data fetches entirely server-side, the same as the initial page load - the" +
  ' only difference is this fetch was triggered by a client-side navigation instead of a' +
  ' fresh document request.'
);
