import Image from 'next/image';
import Link from 'next/link';
import type { Country } from '@/lib/countries';

export default function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/country/${country.alpha3Code}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5 transition-all"
    >
      <div className="relative h-28 bg-slate-100">
        <Image
          src={country.flags.png}
          alt={`Flag of ${country.name}`}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h2 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{country.name}</h2>
        <p className="text-sm text-slate-500">{country.capital ?? 'No capital'}</p>
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{country.region}</span>
          <span>{country.population.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
