'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitSignup, type SignupState } from '@/app/actions';

const initialState: SignupState = { status: 'idle' };

const fieldClass = (hasError: boolean) =>
  `w-full px-3 py-2.5 rounded-xl border bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-300 focus:ring-rose-500/30 focus:border-rose-400'
      : 'border-slate-200 focus:ring-violet-500/30 focus:border-violet-400'
  }`;

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(submitSignup, initialState);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  // React 19 resets a form's native DOM values after ANY action completes -
  // including a validation failure, since a returned error state is still a
  // successful promise resolution as far as the form is concerned. Track
  // what was actually typed so it can be restored right after that reset.
  const lastTyped = useRef({ name: '', email: '', age: '' });

  useEffect(() => {
    if (state.status === 'error') {
      if (nameRef.current) nameRef.current.value = lastTyped.current.name;
      if (emailRef.current) emailRef.current.value = lastTyped.current.email;
      if (ageRef.current) ageRef.current.value = lastTyped.current.age;
    }
    if (state.status === 'success') {
      lastTyped.current = { name: '', email: '', age: '' };
    }
  }, [state]);

  const fieldErrors = state.status === 'error' ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          ref={nameRef}
          onChange={(event) => { lastTyped.current.name = event.target.value; }}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          className={fieldClass(Boolean(fieldErrors.name))}
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-1.5 text-xs text-rose-600">
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          ref={emailRef}
          onChange={(event) => { lastTyped.current.email = event.target.value; }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className={fieldClass(Boolean(fieldErrors.email))}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-rose-600">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1.5">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          ref={ageRef}
          onChange={(event) => { lastTyped.current.age = event.target.value; }}
          aria-invalid={Boolean(fieldErrors.age)}
          aria-describedby={fieldErrors.age ? 'age-error' : undefined}
          className={fieldClass(Boolean(fieldErrors.age))}
        />
        {fieldErrors.age && (
          <p id="age-error" className="mt-1.5 text-xs text-rose-600">
            {fieldErrors.age[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium shadow-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Submitting...' : 'Request access'}
      </button>

      {/* Announced to screen readers without needing sight of the colored banners below. */}
      <div aria-live="polite" className="sr-only">
        {state.status === 'success' && 'Signup successful.'}
        {state.status === 'error' && state.message}
      </div>

      {state.status === 'error' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      )}

      {state.status === 'success' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          You&apos;re on the list. We&apos;ll be in touch.
        </div>
      )}
    </form>
  );
}
