# Assignment 3 - Route handlers + forms

A config-reading API route and a zod-validated signup form: one small proof
that config lives in the environment, not the code, and one small proof
that the server never trusts what the client already checked.

## Run it

```
npm install
cp .env.example .env.local   # fill in API_BASE_URL and NEXT_PUBLIC_SITE_NAME
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

`scripts/verify-routing.mjs` checks 13 of the claims below against a live
browser - last run: **13/13 passed**. The route handler's 500-on-missing-config
path is verified separately (temporarily remove `API_BASE_URL` from
`.env.local`, restart, `GET /api/config` returns 500 with a JSON error body
instead of crashing) since that requires the server to boot in a
deliberately broken state.

## What's here

| Piece | File |
|---|---|
| Route handler, reads env, returns JSON | `src/app/api/config/route.ts` |
| Env reader, throws if missing | `src/lib/config.ts` |
| zod schema + FormData parser | `src/lib/schema.ts` |
| Server action, re-validates regardless of the client | `src/app/actions.ts` |
| The form itself | `src/components/SignupForm.tsx` |
| Env boundary, demonstrated live | `src/components/EnvBoundaryDemo.tsx` |
| `.env.example` | repo root |

## Practice problems

**P1 - the zod schema.** `src/lib/schema.ts`.
```ts
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  age: z.coerce.number({ error: 'Age must be a number' }).int('Age must be a whole number').min(18, 'You must be 18 or older'),
});
```
CHECK, verified via a scratch script: `safeParse({ name:'', email:'x', age:10 })`
fails with exactly 3 issues (name, email, age); a valid object returns
`success: true`.

DEEPER - turning `fieldErrors` into per-field messages: zod v4 moved this to
a standalone function, `z.flattenError(result.error).fieldErrors` (the
`.flatten()` *method* from v3 is gone) - it returns `{ name: [...], email:
[...], age: [...] }`, keyed exactly like the form's field names, so
`fieldErrors.email?.[0]` drops straight into the email field's error text
with no extra mapping.

**P2 - `readConfig`.** `src/lib/config.ts`.
```ts
export const readConfig = (env) => {
  const apiBaseUrl = env.API_BASE_URL;
  if (!apiBaseUrl) throw new Error('API_BASE_URL is missing. Set it in .env.local (see .env.example).');
  return { apiBaseUrl };
};
```
CHECK, verified via a scratch script: set, it returns the value; unset, it
throws that exact named error instead of returning `undefined`.
`.env.example` lists `API_BASE_URL=`.

DEEPER - why the key but never the value: `.env.example` is committed to
git, which means anything in it is public in the repo and its history,
permanently, the moment it's pushed. It exists to document *which*
variables the app needs, not to carry real credentials - a real value
belongs only in `.env.local` (gitignored) or the deploy platform's own
secret store.

**P3 - the GET route handler.** `src/app/api/config/route.ts`.
```ts
export async function GET() {
  try {
    const config = readConfig(process.env);
    return Response.json({ status: 'ok', apiBaseUrl: config.apiBaseUrl });
  } catch (error) {
    return Response.json({ status: 'error', message: ... }, { status: 500 });
  }
}
```
200 on success, a plain object with the env-derived value inside. CHECK,
verified live: `GET /api/config` returns JSON containing `apiBaseUrl`
matching `.env.local`, never a hard-coded string in the handler itself.

DEEPER - the 500 path: `readConfig` throwing is caught right there and
turned into `Response.json({ status: 'error', message }, { status: 500 })`
instead of the route crashing with an unhandled exception. Verified live:
temporarily removed `API_BASE_URL` from `.env.local`, restarted the dev
server, and `GET /api/config` returned `500` with
`{"status":"error","message":"API_BASE_URL is missing. ..."}` - a real
response, not a stack trace.

**P4 - the discriminated union.** `src/app/actions.ts`.
```ts
export type SignupState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };
```
Only the `error` variant carries `.message` - TypeScript won't let
`state.message` be read from the `success` branch without a narrowing check
first. CHECK, verified live via screenshots: `submitting` isn't actually one
of the union's members - it comes from `useActionState`'s own `isPending`
flag, which drives the button's spinner text and `disabled` state
independently of what the action returns; `error` shows the message and
per-field text; `success` shows the confirmation panel.

DEEPER - the double-submit question: the submit button's `disabled={isPending}`
is wired to the *same* in-flight promise React is already tracking
internally for that action call, not a separately-managed boolean I could
forget to set or accidentally reset early. There's no window where a second
click could start an overlapping submission, because the button is inert
for the entire duration React itself considers the action "pending" - the
state shape makes "forgot to guard against double-submit" structurally
impossible rather than something to remember.

**P5 - the env var boundary.** Demonstrated live, not just asserted:
`src/components/EnvBoundaryDemo.tsx` is a Client Component that reads both
`process.env.NEXT_PUBLIC_SITE_NAME` and `process.env.API_BASE_URL` and
prints both. CHECK, verified live: the page shows
`NEXT_PUBLIC_SITE_NAME "Beta Access"` and `API_BASE_URL undefined` - the
exact same `API_BASE_URL` that `/api/config` (running server-side) reads
just fine.

Building this component honestly *broke* on the first pass, which is a
better proof of the lesson than getting it right by luck: reading
`process.env.API_BASE_URL` directly in a Client Component's render caused a
real hydration-mismatch error, because that "client" component is also
server-rendered for the initial HTML - during SSR, Node genuinely has
`API_BASE_URL` in `process.env` and renders the real value, but the
*bundled browser JS* has any non-`NEXT_PUBLIC_` reference replaced with
`undefined` at build time. Server HTML said one thing, the client's first
render said another, and React discarded and regenerated the tree to
recover - which was also corrupting the signup form's state nearby. Fixed
by moving the read into a `useEffect` (see the comment in
`EnvBoundaryDemo.tsx`), so the server render and the client's first render
agree (both show "checking..."), and only the value revealed *after* mount
comes from the real client bundle.

DEEPER - deciding what's safe to expose: `NEXT_PUBLIC_SITE_NAME` is a
display string with no security weight if a stranger reads it in devtools,
so it's fine. `API_BASE_URL` must never be public - the deciding question I
used is "would I be fine with this being visible, permanently, in any
visitor's browser devtools?" If the honest answer involves internal
infrastructure, credentials, or anything that helps an attacker's first
move, it stays server-only. Treat `NEXT_PUBLIC_` as a one-way door: once a
value has shipped in a built bundle, removing the prefix later doesn't
un-expose what already went out.

**P6 - `parseForm`.** `src/lib/schema.ts`.
```ts
export const parseForm = (formData: FormData): ParseResult => {
  const raw = Object.fromEntries(formData);
  const result = signupSchema.safeParse(raw);
  if (!result.success) return { ok: false, errors: z.flattenError(result.error).fieldErrors };
  return { ok: true, data: result.data };
};
```
CHECK, verified via a scratch script: an empty name returns `ok:false` with
a `name` error; valid input returns `ok:true` with typed data; the age
string from `FormData` (always strings) comes back as an actual `number`.

DEEPER - where to coerce: in the schema (`z.coerce.number()`), not before
parsing. `FormData` values are always strings, so if I pre-coerced by hand
I'd need that logic duplicated everywhere the schema is reused (a plain
object in a test, JSON from a client-fetch alternative, ...). Putting the
coercion in the schema keeps `signupSchema` the single source of truth
`parseForm` just delegates to.

**P7 - server action vs. client fetch.** This assignment uses a server
action (`src/app/actions.ts` + `<form action={formAction}>`); contrasting
against the client-fetch alternative:

- *Where validation runs*: identically on the server either way -
  `signupSchema.safeParse` runs inside `submitSignup` here, and would run
  just as server-side inside a route handler in the fetch version. Which
  transport delivered the data never changes where it's trusted.
- *Where secrets stay*: the server action's code runs entirely server-side,
  so `API_BASE_URL` (or any real secret) never needs to reach the browser
  bundle at all - there's no endpoint URL to expose because there's no
  separate endpoint to call. A client-fetch version would need to at least
  expose the endpoint's path to the browser.
- *JavaScript disabled*: `<form action={formAction}>` is a real `<form>`
  element pointing at a server action - without JavaScript the browser does
  a genuine POST and Next.js still runs the action, then re-renders with
  the result. A client-fetch version needs JavaScript to do anything;
  clicking submit with JS disabled does nothing, because there's no native
  form/endpoint wiring underneath the `fetch()` call.

DEEPER - validating only on the client: the exploit is trivial - anyone can
skip the browser and the form entirely, and `curl`/Postman/a script
straight to whatever endpoint accepts the data, with any payload they like,
since client-side checks are JavaScript that simply never runs outside a
page executing it. That's exactly why `submitSignup` re-runs `parseForm`
against the same `signupSchema` on the server regardless of what a browser
already checked - client validation is real UX (instant feedback, no round
trip), but it carries zero security weight on its own.

**P8 - the success/error UX flow.** Verified live via screenshots
(`a3-error.png`, `a3-success.png` during development).

- *Valid submit*: all three fields clear, a green panel with a checkmark
  confirms ("You're on the list. We'll be in touch."), the button returns
  to its idle label.
- *Invalid submit*: every entered value is kept exactly as typed, each
  invalid field shows its own red message directly beneath it, plus one
  summary banner ("Please fix the errors below.") - nothing is lost, and
  nothing is only reported in one place.

Keeping entered values on error also broke once and got fixed for real: by
default, React 19 resets a `<form action={...}>`'s native field values
after *any* action call resolves - including a returned validation-error
state, since as far as the form is concerned a returned value (error or
not) is still a successful resolution, not a thrown failure. `SignupForm.tsx`
tracks the last-typed values in a ref via `onChange`, and on an `error`
result, writes them straight back onto the DOM inputs in a `useEffect` -
overriding React's own reset immediately after it happens. Confirmed live:
before the fix, all three fields went blank on every failed submit; after,
they hold exactly what was typed.

DEEPER - screen-reader announcement: `SignupForm.tsx` has a visually hidden
`<div aria-live="polite">` that updates with "Signup successful." or the
error message on every state change. It's separate from the colored
confirmation/error banners (which are just markup a screen reader has no
reason to re-visit on its own) - the live region is the thing that actually
gets announced without the user needing to have focus anywhere near the
form when the result arrives.

## A note on `AGENTS.md`/`CLAUDE.md`

Next.js 16 auto-generates these on `next dev` (a built-in `agentRules`
feature) - disabled here via `agentRules: false` in `next.config.ts`.
