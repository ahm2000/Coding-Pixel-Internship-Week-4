import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  age: z.coerce
    .number({ error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'You must be 18 or older'),
});

export type SignupInput = z.infer<typeof signupSchema>;

export type ParseResult =
  | { ok: true; data: SignupInput }
  | { ok: false; errors: Record<string, string[]> };

export const parseForm = (formData: FormData): ParseResult => {
  const raw = Object.fromEntries(formData);
  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return { ok: false, errors: z.flattenError(result.error).fieldErrors };
  }
  return { ok: true, data: result.data };
};
