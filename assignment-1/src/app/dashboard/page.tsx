import Link from 'next/link';
import { sleep } from '@/lib/sleep';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await sleep(1200);

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
      <p className="text-zinc-500 mt-2">
        This page <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">await sleep(1200)</code> before rendering, so navigating here shows <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">loading.tsx</code> every time - that&apos;s what an async Server Component suspending actually looks like.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/settings" className="text-blue-600 hover:underline text-sm font-medium">
          Settings
        </Link>
        <Link href="/dashboard/broken" className="text-red-600 hover:underline text-sm font-medium">
          Broken page (triggers error.tsx)
        </Link>
      </div>
    </div>
  );
}
