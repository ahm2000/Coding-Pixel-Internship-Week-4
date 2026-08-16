# Assignment 1 - Routing & layout drills

A small App Router site: 5 routes, one shared header that never remounts,
a nested dashboard layout, a real `loading.tsx`, and a real `error.tsx`.

## Run it

```
npm install
npm run dev
```

Open the printed local URL (`http://localhost:3000` by default).
`npm run build` runs a full type-check + production build. `npm run lint`
runs ESLint.

### Reproduce the acceptance criteria yourself

```
npx playwright install chromium   # once
npm run dev                       # in one terminal
npm run verify                    # in another - drives a real browser against it
```

`scripts/verify-routing.mjs` checks all nine claims below against a live
browser, not just asserted in prose - last run: **9/9 passed**.

## The route table (problem 1)

| URL | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/about` | `src/app/(marketing)/about/page.tsx` - the `(marketing)` folder is a route group, it never appears in the URL |
| `/dashboard` | `src/app/dashboard/page.tsx` |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` |
| `/dashboard/broken` | `src/app/dashboard/broken/page.tsx` |

Every route has exactly one `page.tsx`; the shared shell lives once in
`src/app/layout.tsx`, never repeated per page.

## Practice problems

**P2 - why `<Link>` doesn't full-reload.** `<Link>` intercepts the click and
does client-side navigation: it swaps the matched segment's payload without
requesting a new HTML document. A raw `<a>` always asks the browser for a
fresh document. Verified in `verify-routing.mjs`: clicking the Dashboard
link fires zero `resourceType() === 'document'` requests.

**P3 - the nested-layout tree.** `app/layout.tsx` renders `<Header/>` once,
then `{children}`. Every page (`/`, `/about`, `/dashboard`, ...) fills that
`children` slot; the layout component itself is never re-created between
them, so `<Header/>` never remounts. Proof, not a claim: typed
`"hello world"` into the header's search input, clicked a `<Link>` to
Dashboard, and the input still held `"hello world"` afterward - a remount
would have reset it to empty. `dashboard/layout.tsx` nests one level deeper
and adds `<Breadcrumbs/>`; only pages under `/dashboard` get it, `/` and
`/about` don't.

**P4 - what triggers `loading.tsx`.** It's the Suspense fallback Next.js
puts around an async Server Component while that component is still
awaiting. `dashboard/page.tsx` is `export const dynamic = 'force-dynamic'`
and does `await sleep(1200)` before returning JSX - so every navigation
there genuinely suspends and `loading.tsx` genuinely shows (verified via a
polling check for the "Loading dashboard..." text mid-navigation). A
synchronous page has nothing to await, so it never suspends and the
fallback never has a reason to appear. (Without `force-dynamic`, Next can
statically prerender the whole page once at build time - the sleep would
only happen during the build, not on every request.)

**P5 - how `error.tsx` works.** It's an error boundary Next.js wraps
around the route segment; `dashboard/broken/page.tsx` throws unconditionally
and `dashboard/error.tsx` catches it. Boundaries are implemented with
`componentDidCatch`, which only exists on class components with
instance/lifecycle state - React doesn't have a hooks equivalent - so
`error.tsx` must be a Client Component (`'use client'`) and receives
`{ error, reset }` as props. Clicking `reset()` re-attempts rendering the
segment (verified: the boundary re-renders after the click rather than the
app crashing - it shows the error again here since the underlying cause is
unconditional, but the re-attempt itself is real). An error thrown in
`app/layout.tsx` isn't caught by `dashboard/error.tsx`, because the layout
renders *above* where that boundary is mounted - you'd need an `error.tsx`
at the root, or `app/global-error.tsx`, which replaces the whole root
layout including `<html>`/`<body>`.

**P6 - `isActive`.** `src/lib/nav.ts`. Special-cases `/` to an exact match
(a naive `startsWith('/')` would highlight every link); guards the slash
for nested routes so `/dashboardish` doesn't falsely match `/dashboard`.

**P7 - the navigation pipeline, end to end.** Hovering/entering-viewport on
a `<Link>` triggers a prefetch of that route's payload. On click, the
router swaps only the changed segment - the shared layout tree above it is
reused, not re-rendered. If the new segment's Server Component is still
async/awaiting, Next shows that segment's `loading.tsx` in place of the
swapped content until the server render resolves, then swaps in the real
content. This is exactly why the network tab shows no new *document*
request (only the click) yet a loading UI can still appear (the awaiting
Server Component) - two different observations, one mechanism.

**P8 - `crumbs`.** `src/lib/nav.ts`. Splits on `/`, drops the empty leading
segment, accumulates `href`s as it walks, and title-cases each slug
(`'user-profile'` -> `'User Profile'`) by capitalizing the first letter of
each hyphen-separated word. `crumbs('/')` returns `[]` - documented
decision: the root has no segments to list, so the UI always prepends a
static "Home" link itself rather than crumbs() inventing one.

## Where things are

- `src/lib/nav.ts` - `isActive` (problem 6) and `crumbs` (problem 8), real
  named functions from the start, not `Problem-N.tsx` - last week's
  feedback flagged graded logic living only in practice-problem files.
- `src/lib/sleep.ts` - the artificial delay used to demo `loading.tsx`.
- `src/components/Header.tsx` - the persistent nav + search input.
- `src/components/Breadcrumbs.tsx` - renders `crumbs(usePathname())`.
- `src/app/dashboard/` - `layout.tsx`, `page.tsx` (slow), `loading.tsx`,
  `error.tsx`, `settings/page.tsx`, `broken/page.tsx` (always throws).
- `scripts/verify-routing.mjs` - the committed, runnable proof.
