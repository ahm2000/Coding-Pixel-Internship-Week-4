import SignupForm from '@/components/SignupForm';
import ApiConfigCheck from '@/components/ApiConfigCheck';
import EnvBoundaryDemo from '@/components/EnvBoundaryDemo';

export default function Home() {
  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Beta access signup</h1>
        <p className="text-slate-500 text-sm mt-1">
          Validated server-side with zod, whether or not JavaScript ran the client checks first.
        </p>
      </div>

      <div className="grid sm:grid-cols-[1fr_260px] gap-6 items-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <SignupForm />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-medium text-slate-700 mb-3">Route handler</h2>
            <ApiConfigCheck />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-medium text-slate-700 mb-3">Env boundary, read live</h2>
            <EnvBoundaryDemo />
          </div>
        </div>
      </div>
    </main>
  );
}
