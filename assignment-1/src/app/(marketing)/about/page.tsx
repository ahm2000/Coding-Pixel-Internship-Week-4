import Code from '@/components/Code';
import InfoCard from '@/components/InfoCard';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
        Route group
      </span>
      <h1 className="text-4xl font-bold text-slate-900 mt-4 tracking-tight">About</h1>
      <p className="text-slate-500 mt-3 text-lg leading-relaxed max-w-xl">
        This page lives at <Code>app/(marketing)/about/page.tsx</Code>.
      </p>

      <div className="mt-6">
        <InfoCard>
          The route is still just <Code>/about</Code> - a parenthesized folder is a <strong>route group</strong>, it
          organizes files on disk without ever adding a URL segment.
        </InfoCard>
      </div>
    </main>
  );
}
