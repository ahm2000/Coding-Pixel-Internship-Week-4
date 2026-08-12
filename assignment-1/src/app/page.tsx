import Code from '@/components/Code';
import InfoCard from '@/components/InfoCard';

const routes = [
  { url: '/', file: 'src/app/page.tsx' },
  { url: '/about', file: 'src/app/(marketing)/about/page.tsx' },
  { url: '/dashboard', file: 'src/app/dashboard/page.tsx' },
  { url: '/dashboard/settings', file: 'src/app/dashboard/settings/page.tsx' },
  { url: '/dashboard/broken', file: 'src/app/dashboard/broken/page.tsx' }
];

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
        App Router
      </span>

      <h1 className="text-4xl font-bold text-slate-900 mt-4 tracking-tight">Routing &amp; Layout Drills</h1>
      <p className="text-slate-500 mt-3 text-lg leading-relaxed max-w-xl">
        Five routes, one header that never remounts, a nested layout, and real loading/error states - demonstrated, not just described.
      </p>

      <div className="mt-6">
        <InfoCard tone="accent">
          Type in the search box above, then click <strong>Dashboard</strong> - the header never remounts, so your text stays put.
        </InfoCard>
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mt-12 mb-3">Route map</h2>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {routes.map((route, index) => (
          <div
            key={route.url}
            className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
              index !== routes.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <span className="font-mono text-sm text-indigo-600 font-medium">{route.url}</span>
            <Code>{route.file}</Code>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400 mt-4">
        This is <Code>app/page.tsx</Code> - the route for <Code>/</Code>.
      </p>
    </main>
  );
}
