export default function DashboardLoading() {
  return (
    <div>
      <div className="flex items-center gap-3 text-slate-500 mb-6">
        <span className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm font-medium">Loading dashboard...</span>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-24 w-full rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
