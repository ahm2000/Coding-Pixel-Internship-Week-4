'use server';

import { parseForm } from '@/lib/schema';

export type SignupState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

// The server never trusts client-side validation - anyone can POST to a
// server action directly, skipping the form entirely, so the same schema
// runs again here regardless of what the browser already checked.
export async function submitSignup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = parseForm(formData);
  if (!parsed.ok) {
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors: parsed.errors };
  }
  return { status: 'success' };
}
