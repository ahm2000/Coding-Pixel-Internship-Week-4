export default function DashboardLoading() {
  return (
    <div className="flex items-center gap-3 text-zinc-500">
      <span className="w-5 h-5 rounded-full border-2 border-zinc-200 border-t-blue-600 animate-spin" />
      <span>Loading dashboard...</span>
    </div>
  );
}
