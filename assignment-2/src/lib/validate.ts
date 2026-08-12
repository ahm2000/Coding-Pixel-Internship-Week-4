// A cca3/alpha3 code is always exactly 3 letters (ISO 3166-1 alpha-3).
// Rejecting anything else before fetching avoids a wasted network call for
// obviously malformed input.
export const isPlausibleCode = (code: string): boolean => /^[A-Za-z]{3}$/.test(code);
