export default function CountryLoading() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
        <span className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-emerald-600 animate-spin" />
        Loading country...
      </div>
      <div className="grid sm:grid-cols-[220px_1fr] gap-8 items-start">
        <div className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-5 w-24 rounded-full bg-slate-100 animate-pulse" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
