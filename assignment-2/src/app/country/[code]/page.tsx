import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCountries, getByCode, borderLinks } from '@/lib/countries';
import { isPlausibleCode } from '@/lib/validate';

export const dynamic = 'force-dynamic';

interface CountryPageProps {
  params: Promise<{ code: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params;

  // Reject malformed codes before spending a fetch on them.
  if (!isPlausibleCode(code)) notFound();

  const countries = await fetchCountries();
  const country = getByCode(countries, code);
  if (!country) notFound();

  const borders = borderLinks(country.borders);

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to all countries
      </Link>

      <div className="grid sm:grid-cols-[220px_1fr] gap-8 items-start">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <Image src={country.flags.png} alt={`Flag of ${country.name}`} fill unoptimized sizes="220px" className="object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{country.name}</h1>
          <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
            {country.region}
          </span>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Capital</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{country.capital ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Population</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{country.population.toLocaleString()}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-400">Languages</dt>
              <dd className="text-slate-800 font-medium mt-0.5">
                {country.languages.length > 0 ? country.languages.map((language) => language.name).join(', ') : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-slate-500 mb-3">Border countries</h2>
        {borders.length === 0 ? (
          <p className="text-sm text-slate-400">No bordering countries.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {borders.map((border) => (
              <Link
                key={border.code}
                href={border.href}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                {border.code}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
