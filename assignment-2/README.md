# Assignment 2 - Country Explorer, Next.js edition

A Next.js App Router rebuild of the Week 3 Vite Country Explorer: a
server-rendered country list with search/region filtering, and a per-country
detail page with borders you can click through, real `loading.tsx`/`error.tsx`
states, and graceful handling of bad URLs.

Data comes from `https://countries.dev` (the brief's `restcountries.com` URL
is dead).

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

`scripts/verify-routing.mjs` checks 12 of the claims below against a live
browser - last run: **12/12 passed**. The 13th (`error.tsx` on a broken
fetch) is verified separately, see problem 5 below, because that fetch runs
inside the Next.js server process and isn't something a browser-side
`page.route()` can intercept.

## Routes

| URL | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/country/[code]` | `src/app/country/[code]/page.tsx` |

`src/app/layout.tsx` renders `<Header/>` once for every route. Both routes
are `export const dynamic = 'force-dynamic'` - without it Next would
statically prerender them at build time and the server-side fetch (and its
artificial delay, see problem 4) would only run once during `next build`,
not on every request.

## Practice problems

**P1 - Server/Client triage.**

| Piece | Server or Client | Why |
|---|---|---|
| List fetch | Server | pure data fetch, no interactivity |
| Detail fetch | Server | pure data fetch, no interactivity |
| Search box | Client | needs `onChange` + local state |
| Region filter | Client | needs `onClick` |
| Nav header | Server | static `<Link>`s, nothing dynamic |

DEEPER - how does the server list hand data to the client filter without the
list becoming client? It doesn't hand the list over at all.
`src/components/SearchAndFilter.tsx` (`'use client'`) never receives the 250
countries - `page.tsx` passes it only the derived, tiny `regions: string[]`
array (for the filter buttons) plus the current `q`/`region` values. The
client component's only job is turning UI events into a URL
(`router.push('/?q=...&region=...')`); the Server Component then re-runs for
that new URL and does the actual filtering server-side, every time. The
country array itself never crosses the client boundary.

**P2 - `borderLinks`.** `src/lib/countries.ts`.
```ts
export const borderLinks = (codes: string[] | undefined): BorderLink[] =>
  (codes ?? []).map((code) => ({ code, href: `/country/${code}` }));
```
DEEPER - defaulting missing `borders`: `codes ?? []` means a country with no
`borders` field (85 of the 250 in this dataset - mostly islands) gets `[]`
instead of `.map` throwing on `undefined`. Verified live: France's border
list renders 8 links (AND, BEL, DEU, ITA, LUX, MCO, ESP, CHE); an island
nation with no `borders` field renders "No bordering countries." instead of
crashing.

**P3 - why the server list means no browser network request.** `page.tsx`
is an `async` Server Component - its `await fetchCountries()` call executes
on the Next.js server, and only the *rendered result* (HTML on first load,
an RSC payload on navigation) is sent to the browser. The browser never
sees `countries.dev` in its own network tab. Verified: `npm run verify`
records every `resourceType() === 'document'` request across a `<Link>`
click and asserts it stays at zero - the click causes no full-page reload,
and the actual API call is invisible to the browser because it never
happened there.

DEEPER - where does a later client-side navigation's fetch run? Still on
the server. Clicking a border `<Link>` doesn't make the browser call
`countries.dev` either - it asks the Next.js server for the RSC payload of
`/country/ESP`, and *that* request is what triggers `fetchCountries()`
server-side again. The browser only ever talks to the Next.js server, never
to the external API directly.

**P4 - `getByCode`.** `src/lib/countries.ts`.
```ts
export const getByCode = (countries: Country[], code: string): Country | null => {
  const target = code.toLowerCase();
  return countries.find((country) => country.alpha3Code.toLowerCase() === target) ?? null;
};
```
Case-insensitive (`fra`, `FRA`, `Fra` all resolve to France), returns `null`
on no match. Verified via a scratch script: exact match, case-insensitive
match, and absent-code-returns-null all passed.

DEEPER - `null` pairs with `notFound()`, not with throwing to `error.tsx`.
A missing country from a syntactically valid code is expected, ordinary
user input (a stale bookmark, a typo, a bad guess) - exactly the case
Next's not-found convention exists for. `error.tsx` should stay reserved for
genuinely unexpected failures (the API being unreachable). `page.tsx`
reflects this split directly: `if (!country) notFound();` for a null
lookup, but a *thrown* error from `fetchCountries()` (bad response, network
failure) is left to propagate and is caught by `error.tsx` instead.

**P5 - detail route file map.**

| Concern | File |
|---|---|
| The page itself | `src/app/country/[code]/page.tsx` |
| Suspense fallback while it awaits | `src/app/country/[code]/loading.tsx` |
| Error boundary if it throws | `src/app/country/[code]/error.tsx` |
| `notFound()` target | `src/app/country/[code]/not-found.tsx` |

DEEPER - API 404 vs. unreachable API: a well-formed but absent code (e.g.
`/country/ZZZ`) is a *successful* fetch that simply has no matching record
- `getByCode` returns `null`, `page.tsx` calls `notFound()`, and
`not-found.tsx` renders. An unreachable API (bad host, network failure,
non-OK response) makes `fetchCountries()` itself throw - that's a failure
mode notFound() has no business modeling, so it's left uncaught and
`error.tsx` renders instead. Verified both independently: `/country/ZZZ`
renders "Country not found"; temporarily pointing `API_URL` in
`countries.ts` at an unreachable host and hitting `/country/FRA` renders
"Couldn't load this country / fetch failed" (screenshotted, then reverted).

**P6 - the Client island boundary.** `'use client'` at the top of
`SearchAndFilter.tsx` marks *that module* (and anything it exclusively
imports) as needing to run in the browser - it does not force its parent
(`page.tsx`) or anything passed *into* it to become client too. `page.tsx`
stays a Server Component even though it renders `<SearchAndFilter/>`.

DEEPER - why doesn't passing a Server Component as `children` into a Client
Component violate the boundary? Because the Server Component is still
rendered on the server first - its already-resolved output (serialized
JSX, not source code) is what the Client Component receives as a prop. The
Client Component never imports or re-executes the Server Component's
module, so nothing about it needs to run client-side; it just slots
finished markup into its own tree. This is the same reason `layout.tsx` can
render `<Header/>` (Server) above `{children}` without either one pulling
the other across the boundary.

**P7 - validating `params.code` before fetching.** `src/lib/validate.ts`:
```ts
export const isPlausibleCode = (code: string): boolean => /^[A-Za-z]{3}$/.test(code);
```
`page.tsx` calls `notFound()` immediately if this fails, before
`fetchCountries()` ever runs - a malformed code can't possibly match a real
`alpha3Code`, so there's no reason to spend a network call finding that
out. CHECK, all verified live:
- `/country/FRA` renders France's full detail page.
- `/country/ZZZ` (well-formed, absent) → not-found, *after* a null lookup
  (the fetch does run, `getByCode` returns `null`).
- `/country/x` (malformed) → not-found *before* fetching (rejected by
  `isPlausibleCode`, `fetchCountries()` never called).

**P8 - tracing a border-link click, France to Spain.** Clicking the `ESP`
`<Link>` on France's page: Next intercepts the click (no document reload).
The root layout's `<Header/>` and the page's own "Back to all countries"
link position are outside the segment being swapped, so they don't
re-render or remount. Next requests the RSC payload for `/country/ESP`;
`country/[code]/loading.tsx`'s skeleton fills the swapped segment while
that's in flight. On the server, `page.tsx` re-runs for `code = "ESP"`:
validates the code, calls `fetchCountries()` again (a fresh fetch, with the
artificial delay - this is exactly what makes the skeleton visible instead
of instant), finds Spain via `getByCode`, and streams the rendered result
back. Next swaps only that segment in - Spain's data fetches entirely
server-side, same as the initial page load. Verified live: `ESP` is a real
`<Link href="/country/ESP">`, clicking it lands on `h1:has-text("Spain")`,
and the loading skeleton is observed mid-navigation on the equivalent FRA
transition (same mechanism, verified via a polling check for "Loading
country...").

## Where things are

- `src/lib/countries.ts` - `Country`/`Language` types, `fetchCountries()`
  (problem 3), `getByCode()` (problem 4), `borderLinks()` (problem 2).
- `src/lib/validate.ts` - `isPlausibleCode()` (problem 7).
- `src/components/Header.tsx` - static server nav, on every page.
- `src/components/SearchAndFilter.tsx` - the one Client Component
  (problem 1, problem 6); writes to the URL, filters nothing itself.
- `src/components/CountryCard.tsx` - server-rendered list card.
- `src/app/page.tsx` - the list route: fetch, filter by `searchParams`,
  render.
- `src/app/country/[code]/` - `page.tsx`, `loading.tsx`, `error.tsx`,
  `not-found.tsx` (problem 5).
- `scripts/verify-routing.mjs` - the committed, runnable proof.

## A note on `AGENTS.md`/`CLAUDE.md`

Next.js 16 auto-generates these on every `next dev` (a built-in
`agentRules` feature, unrelated to any tooling on my end) - disabled here
via `agentRules: false` in `next.config.ts` so they don't show up in the
repo.

## Known limitation

One flag image (Afghanistan) is served from `upload.wikimedia.org`, which
blocks hot-linked requests without a browser-like referer; it renders as a
broken image in the grid. All other 249 flags (served from `flagcdn.com`)
load normally. Not a code bug - a data-source quirk in the upstream API.
