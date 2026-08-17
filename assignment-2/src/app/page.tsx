import { fetchCountries } from '@/lib/countries';
import SearchAndFilter from '@/components/SearchAndFilter';
import CountryCard from '@/components/CountryCard';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<{ q?: string; region?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q = '', region = '' } = await searchParams;
  const countries = await fetchCountries();

  const regions = [...new Set(countries.map((country) => country.region))].sort();

  const filtered = countries.filter((country) => {
    const matchesQuery = q ? country.name.toLowerCase().includes(q.toLowerCase()) : true;
    const matchesRegion = region ? country.region === region : true;
    return matchesQuery && matchesRegion;
  });

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Explore the world&apos;s countries</h1>
        <p className="text-slate-500 text-sm mt-1">
          {countries.length} countries, fetched and rendered on the server.
        </p>
      </div>

      <div className="mb-8">
        <SearchAndFilter regions={regions} currentQuery={q} currentRegion={region} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          No countries match your search.
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-4">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((country) => (
              <CountryCard key={country.alpha3Code} country={country} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
