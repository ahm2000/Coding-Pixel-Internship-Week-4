import Link from 'next/link';
import { sleep } from '@/lib/sleep';
import Code from '@/components/Code';
import InfoCard from '@/components/InfoCard';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await sleep(1200);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>

      <div className="mt-4">
        <InfoCard tone="accent">
          This page <Code>await sleep(1200)</Code> before rendering, so navigating here shows <Code>loading.tsx</Code>{' '}
          every time - that&apos;s what an async Server Component suspending actually looks like.
        </InfoCard>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard/settings"
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Settings
        </Link>
        <Link
          href="/dashboard/broken"
          className="px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors"
        >
          Broken page (triggers error.tsx)
        </Link>
      </div>
    </div>
  );
}
