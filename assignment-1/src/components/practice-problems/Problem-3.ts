// Problem 3 - the nested-layout tree.
//
// app/layout.tsx renders <Header/> once, then {children}. Every page fills
// that children slot; the layout component itself is never re-created
// between them, so <Header/> never remounts. dashboard/layout.tsx nests one
// level deeper and adds <Breadcrumbs/> - only pages under /dashboard get it.
//
// Not a pure function - a persistence claim about React's tree. The real
// proof: verify-routing.mjs types into the header's search input, clicks a
// <Link> to Dashboard, and asserts the input still holds that text
// afterward (a remount would have reset it to empty).
//
// Run individually: npx tsx src/components/practice-problems/Problem-3.ts

const tree = {
  'app/layout.tsx': { renders: ['Header (once)', '{children}'] },
  'app/page.tsx': 'fills children at /',
  'app/(marketing)/about/page.tsx': 'fills children at /about',
  'app/dashboard/layout.tsx': { renders: ['Breadcrumbs', '{children}'], scope: 'only /dashboard/*' },
  'app/dashboard/page.tsx': 'fills the nested children at /dashboard',
};

console.log('Problem 3 - layout nesting:');
console.log(JSON.stringify(tree, null, 2));
console.log('\nLive proof: header input value survives a <Link> navigation (verify-routing.mjs)');
