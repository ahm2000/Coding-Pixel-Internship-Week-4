// Problem 8 - crumbs.
//
// Real implementation: src/lib/nav.ts (kept there, not duplicated here -
// last week's feedback flagged graded logic living only in Problem-N
// files). This file only demonstrates the CHECK from the brief.
//
// Run individually: npx tsx src/components/practice-problems/Problem-8.ts

import { crumbs } from '../../lib/nav';

console.log('Problem 8 - crumbs(pathname):');

const dashboardSettings = crumbs('/dashboard/settings');
console.log('  crumbs("/dashboard/settings") =', JSON.stringify(dashboardSettings));
console.log(
  '  labels title-cased, hrefs accumulate:',
  dashboardSettings[0]?.label === 'Dashboard' &&
    dashboardSettings[0]?.href === '/dashboard' &&
    dashboardSettings[1]?.label === 'Settings' &&
    dashboardSettings[1]?.href === '/dashboard/settings',
);

const root = crumbs('/');
console.log('  crumbs("/") =', JSON.stringify(root), '(root has no segments - UI prepends a static "Home" link itself)');
console.log('  crumbs("/") === []:', root.length === 0);

const userProfile = crumbs('/user-profile');
console.log('  crumbs("/user-profile") =', JSON.stringify(userProfile), '("user-profile" -> "User Profile")');
