const API_URL =
  'https://countries.dev/countries?fields=name,capital,population,region,flags,alpha3Code,languages,borders';

export interface Language {
  name: string;
  iso639_1: string;
  iso639_2: string;
  nativeName: string;
}

export interface Country {
  name: string;
  capital?: string;
  population: number;
  region: string;
  flags: { png: string; svg: string };
  alpha3Code: string;
  languages: Language[];
  borders?: string[];
}

// A short artificial delay so loading.tsx is reliably observable in dev/demo,
// matching the real (if usually faster) latency of a live external API call.
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCountries = async (): Promise<Country[]> => {
  await sleep(700);
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`countries.dev responded with ${res.status}`);
  }
  return res.json();
};

export const getByCode = (countries: Country[], code: string): Country | null => {
  const target = code.toLowerCase();
  return countries.find((country) => country.alpha3Code.toLowerCase() === target) ?? null;
};

export interface BorderLink {
  code: string;
  href: string;
}

export const borderLinks = (codes: string[] | undefined): BorderLink[] =>
  (codes ?? []).map((code) => ({ code, href: `/country/${code}` }));
