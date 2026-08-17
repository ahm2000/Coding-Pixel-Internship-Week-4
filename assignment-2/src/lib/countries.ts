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

// countries.dev serves a thumb URL for Afghanistan that Wikimedia rejects
// (hotlink protection on that specific derivative); swap in the direct
// source file, which Wikimedia does serve.
const FLAG_OVERRIDES: Record<string, string> = {
  AFG: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg',
};

export const fetchCountries = async (): Promise<Country[]> => {
  await sleep(700);
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`countries.dev responded with ${res.status}`);
  }
  const countries: Country[] = await res.json();
  return countries.map((country) => {
    const override = FLAG_OVERRIDES[country.alpha3Code];
    return override ? { ...country, flags: { ...country.flags, png: override } } : country;
  });
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
